using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;

public class AtlasExport : EditorWindow
{
	private static string priv_getClientResourcePath(string assetPath)
	{
		var subPath = System.IO.Path.Combine(Application.dataPath, "Resources");
		assetPath = System.IO.Path.GetDirectoryName(assetPath);
		return assetPath.Substring(subPath.Length + 1);
	}

	public class TextureData
	{
		public TextureData(Texture2D t){ tex = t; }
		public Texture2D tex;
		public uint x, y;
		public UnityEngine.RectOffset border = new UnityEngine.RectOffset();
		public uint Width
		{
			get
			{
				return (uint)(tex.width - border.left - border.right);
			}
		}
		public uint Height
		{
			get
			{
				return (uint)(tex.height - border.top - border.bottom);
			}
		}
		public string Name
		{
			get
			{
				return tex.name;
			}
		}
		public Color[] Pixels
		{
			get
			{
				Color[] srcs = tex.GetPixels();
				if ( border.right == 0 && border.left == 0 && border.top == 0 && border.bottom == 0 )
					return srcs;
				Color[] cols = new Color[this.Height * this.Width];
				for ( var ypos = border.top; ypos != tex.height - border.bottom; ++ypos )
				{
					for ( var xpos = border.left; xpos != tex.width - border.right; ++xpos )
					{
						var x = xpos - border.left;
						var y = ypos - border.top;
						cols[y * this.Width + x] = srcs[ypos * tex.width + xpos];
					}
				}
				return cols;
			}
		}
	}

	private class ImageData
	{
		public string imgPath;
		public int imgSize;
	}
	
	private static TextureData priv_getTextData(Texture2D tex, bool isClearBound, uint boundSize)
	{
		TextureData texData = new TextureData(tex);
		if ( !isClearBound )
			return texData;
		Color[] col = texData.tex.GetPixels();
		//	from top -> bottom
		int ypos = 0;
		int xpos = 0;
		for ( ; ypos != texData.tex.height; ++ypos )
		{
			for (xpos = 0; xpos != texData.tex.width; ++xpos )
			{
				if ( col[ypos * texData.tex.width + xpos].a != 0.0f )
					goto _NEXT00;
			}
		}
	_NEXT00:
		//	top : ypos;
		texData.border.top = ypos;
		int maxLeftPos = xpos;
		int minRightPos = xpos;
		// bottom -> top
		for (ypos = texData.tex.height-1; ypos > texData.border.top; --ypos )
		{
			for ( xpos = 0; xpos != texData.tex.width; ++xpos )
			{
				if ( col[ypos * texData.tex.width + xpos].a != 0.0f )
					goto _NEXT01;
			}
		}
	_NEXT01:
		texData.border.bottom = ypos;
		if ( xpos < maxLeftPos )
			maxLeftPos = xpos;
		if ( xpos > minRightPos )
			minRightPos = xpos;
		//	left -> right.
		if ( texData.border.top + 1 < texData.border.bottom - 1 )
		{
			for (xpos = 0; xpos < maxLeftPos-1; ++xpos )
			{
				for (ypos = texData.border.top + 1; ypos < texData.border.bottom - 1; ++ypos)
				{
					if ( col[ypos * texData.tex.width + xpos].a != 0.0f )
						goto _NEXT02;
				}
			}
	_NEXT02:
			texData.border.left = xpos;
		}
		//	right -> left
		if ( texData.border.top + 1 < texData.border.bottom - 1 )
		{
			for (xpos = texData.tex.width - 1; xpos > minRightPos + 1; --xpos )
			{
				for (ypos = texData.border.top + 1; ypos < texData.border.bottom - 1; ++ypos)
				{
					if ( col[ypos * texData.tex.width + xpos].a != 0.0f )
						goto _NEXT03;
				}
			}
	_NEXT03:
			texData.border.right = xpos;
		}
		else
		{
			texData.border.right = texData.tex.width - 1;
		}

		texData.border.bottom = texData.tex.height - texData.border.bottom - 1;
		texData.border.right = texData.tex.width - texData.border.right - 1;
		return texData;
	}
	
	struct AreaSize
	{
		public uint w;
		public uint h;
	}

	static uint priv_calcPriority(TextureData tex, uint boundSize)
	{
		var w = tex.Width;
		var h = tex.Height;
		if ( tex.Width / tex.Height > 10 )
		{
			h = w/2;
		}
		if ( tex.Height / tex.Width > 10 )
		{
			w = h/2;
		}
		var area = (w + boundSize)* (h + boundSize);
		return area;
	}

	static ImageData  BuildAtlas(System.Collections.Generic.IEnumerable<Texture2D> objects, string assetPath, AtlasGroupMakerInEditor maker, string name, uint boundSize, uint clampBoundSize, bool clearBoundSize)
	{
		if ( clampBoundSize > boundSize / 2 )
			clampBoundSize = boundSize / 2;

		AreaSize[] sizeArray = {
			new AreaSize{w =64, h=64}
			, new AreaSize{w =128, h=128}
			, new AreaSize{w =256, h=256}
			, new AreaSize{w = 512, h = 512}
			, new AreaSize{w = 1024, h = 1024}
			, new AreaSize{w = 2048, h=2048}
		};
		
		var datInObjectWithoutOrder = from tex in objects
			where (tex as Texture2D) != null
			select priv_getTextData(tex as Texture2D, clearBoundSize, boundSize);

		var datInObject = from tex in datInObjectWithoutOrder
			orderby priv_calcPriority(tex, boundSize) descending, tex.Width descending, tex.Name
			select tex;

		uint totalAreaSize = (uint)(from tex in datInObject
			select ((int)tex.Width + boundSize) * ((int)tex.Height + boundSize)).Sum();

		PicUV.Box picBox = null;
		int lastBoxSize = 0;
		System.Collections.Generic.LinkedList<TextureData> textData = new System.Collections.Generic.LinkedList<TextureData>();
		foreach ( var boxSize in sizeArray)
		{
			if ( totalAreaSize > boxSize.w * boxSize.h )
				continue;

			textData.Clear();
			bool isOK = true;
			PicUV.Box box = new PicUV.Box(boxSize.w, boxSize.h);
			foreach(var tex in datInObject)
			{
				var pos = box.Insert((uint)tex.Width, (uint)tex.Height, boundSize, boundSize);
				if ( pos == null )
				{
					isOK = false;
					break;
				}
				tex.x = pos.x;
				tex.y = pos.y;
				textData.AddLast(tex);
			}
			
			if ( isOK )
			{
				picBox = box;
				lastBoxSize = (int)boxSize.w;
				break;
			}
		}

		if ( picBox != null )
		{
			Debug.Log("Insert " + totalAreaSize.ToString("N0") + " into " + (picBox.Width * picBox.Heigh).ToString("N0") + " OK, " + ((float)totalAreaSize/(picBox.Width * picBox.Heigh)).ToString("P"));
		}
		else
		{
			var totalSize = sizeArray.Last().w * sizeArray.Last().h;
			Debug.LogWarning("Insert " + totalAreaSize.ToString("N0") + " into " + totalSize.ToString("N0") + " Lost, " + ((float)totalAreaSize/totalSize).ToString("P")
			                 + "Png:" + name + "TotalSize:" + sizeArray.Last().w + "*" + sizeArray.Last().h);
			return null;
		}

		Texture2D atlas = new Texture2D((int)picBox.Width, (int)picBox.Heigh);
		Color[] zero = new Color[picBox.Width*picBox.Heigh];
		atlas.SetPixels(zero);

		foreach(var tex in textData)
		{
			Color[] col = tex.Pixels;
			for ( int pos = 0; pos != col.Length; ++pos )
			{
				if ( col[pos].a == 0.0f )
					col[pos] = Color.clear;
			}
			atlas.SetPixels((int)tex.x, (int)tex.y, (int)tex.Width, (int)tex.Height, col);
			if ( clampBoundSize != 0 )
			{
				//	upper
				//	down,
				Color[] colTop = new Color[(int)tex.Width];
				Color[] colBottom = new Color[(int)tex.Width];
				for ( int xpos = 0; xpos != (int)tex.Width; ++xpos )
				{
					colBottom[xpos] = col[(int)(tex.Height - 1) * (int)tex.Width + xpos];
					colTop[xpos] = col[xpos];
				}
				for ( int ybound = 0; ybound != clampBoundSize; ++ ybound )
				{
					if ( (int)tex.y - ybound - 1 >= 0 )
						atlas.SetPixels((int)tex.x, (int)tex.y - ybound - 1, (int)tex.Width, 1, colTop);
					if ( (int)tex.y + (int)tex.Height + ybound < picBox.Heigh )
						atlas.SetPixels((int)tex.x, (int)tex.y + (int)tex.Height + ybound, (int)tex.Width, 1, colBottom);
				}
				//	left
				Color[] colLeft = new Color[1];
				Color[] colRight = new Color[1];
				for ( int ypos = 0; ypos != (int)tex.Height; ++ypos )
				{
					colLeft[0] = col[tex.Width * ypos];
					colRight[0] = col[tex.Width * ypos + (int)tex.Width - 1];
					for ( int xbound = 0; xbound != clampBoundSize; ++xbound )
					{
						if ( (int)tex.x - xbound - 1 >= 0 )
							atlas.SetPixels((int)tex.x - xbound - 1, (int)tex.y + ypos, 1, 1, colLeft);
						if ( (int)tex.x + (int)tex.Width + xbound < picBox.Width )
							atlas.SetPixels((int)tex.x + (int)tex.Width + xbound, (int)tex.y + ypos, 1, 1, colRight);
					}
				}
				//	right
			}
		}

		// Save the atlas as an asset:
		byte[] bytes = atlas.EncodeToPNG();

		// Write out the atlas file:
		string pngName = name +".png";
		//string directoryName = System.IO.Path.GetDirectoryName(pngName);
		if ( !System.IO.Directory.Exists(assetPath) )
		{
			System.IO.Directory.CreateDirectory(assetPath);
		}

		var filePNGPath = System.IO.Path.Combine(assetPath, pngName);
		using (FileStream fs = File.Create(filePNGPath))
		{
			fs.Write(bytes, 0, bytes.Length);
			fs.Close();
			fs.Dispose();
		}

		var texIdx = maker.AddTexture(pngName, atlas);
		foreach(var texDat in textData)
		{
			maker.Add(texDat, texIdx);
		}

		var imgDat = new ImageData();
		imgDat.imgPath = filePNGPath;
		imgDat.imgSize = lastBoxSize;
		return imgDat;
	}

	private static System.Text.StringBuilder priv_printDebugData(string name, PicUV.Box picBox, Texture2D atlas, System.Collections.Generic.IEnumerable<TextureData> textData)
	{
		System.Text.StringBuilder data = new System.Text.StringBuilder(65536);
		data.Append("{" + '"' + "img" + '"' + ":" +  '"' + name  + '"'+ "," +  '"' + "width" + '"' + ":" + atlas.width + ","  + '"' + "height" + '"' + ":" +  atlas.height + "," +  '"' + "tiles" + '"'+ ":{");
		foreach(var texDat in textData)
		{
			data.Append("\"" + texDat.Name + "\":{");
			data.Append("\"rect\":{");
			data.Append("\"x\":" + texDat.x.ToString() + ",");
			data.Append("\"y\":" + (picBox.Heigh - texDat.y - texDat.Height).ToString() + ",");
			data.Append("\"width\":" + texDat.Width.ToString() + ",");
			data.Append("\"height\":" + texDat.Height.ToString());
			data.Append("},");
			data.Append("\"border\":{");
			data.Append("\"left\":" + texDat.border.left.ToString() + ",");
			data.Append("\"right\":" + texDat.border.right.ToString() + ",");
			data.Append("\"top\":" + texDat.border.bottom.ToString() + ",");	//	top, bottom swap.
			data.Append("\"bottom\":" + texDat.border.top.ToString());			//	top, bottom swap.
			data.Append("}");
			data.Append("},");
		}
		data.Remove(data.Length-1, 1);
		data.Append("}}");// = data + "}}";
		return data;
	}
	
	[UnityEditor.MenuItem("KBN/Build/Build Atlas/Gear")]
	public static void BuildGear()
	{
		var path = System.IO.Path.Combine(priv_getImportPath(), "ImportGearsConfig.xml");
		priv_exportWithConfig(path);
	}

	[UnityEditor.MenuItem("KBN/Build/Build Atlas/WheelGames")]
	public static void BuildWheelGames()
	{
		var path = System.IO.Path.Combine(priv_getImportPath(), "ImportWheelgamesConfig.xml");
		priv_exportWithConfig(path);
	}

    [UnityEditor.MenuItem("KBN/Build/Build Atlas/Daily login UI anim")]
    public static void BuildDailyLoginUIAnim()
    {
		var path = System.IO.Path.Combine(priv_getImportPath(), "ImportDailyLoginUIAnimsConfig.xml");
		priv_exportWithConfig(path);
    }

	[UnityEditor.MenuItem("KBN/Build/Build Atlas/Event player group anim")]
	public static void BuildEventPlayerGroupAnim()
	{
		var path = System.IO.Path.Combine(priv_getImportPath(), "ImportEventPlayerGroupAnimConfig.xml");
		priv_exportWithConfig(path);
	}

	[UnityEditor.MenuItem("KBN/Build/Build Atlas/Icons(Andriod)")]
	public static void BuildIconsAndriodAtlasGroup()
	{
		var path = System.IO.Path.Combine(priv_getImportPath(), "ImportIconsAndriodConfig.xml");
		priv_exportWithConfig(path);
	}

	[UnityEditor.MenuItem("KBN/Build/Build Atlas/Icons(Orginal)")]
	public static void BuildIconsAtlasGroup()
	{
		var path = System.IO.Path.Combine(priv_getImportPath(), "ImportIconsConfig.xml");
		priv_exportWithConfig(path);
	}

	[UnityEditor.MenuItem("KBN/Build/Build Atlas/Icons(OTA)")]
	public static void BuildIconsOTAAtlasGroup()
	{
		var path = System.IO.Path.Combine(priv_getImportPath(), "ImportIconsOTAConfig.xml");
		priv_exportWithConfig(path);
	}

	[UnityEditor.MenuItem("KBN/Build/Build Atlas/Icons(ALL)")]
	public static void BuildIconsAllAtlasGroup()
	{
		var path = System.IO.Path.Combine(priv_getImportPath(), "ImportIconsAllConfig.xml");
		priv_exportWithConfig(path);
	}

	[UnityEditor.MenuItem("KBN/Build/Build Atlas/Icons(OTA2014Halloween)")]
	public static void BuildIconsOTA2014HalloweenAtlasGroup()
	{
		var path = System.IO.Path.Combine(priv_getImportPath(), "ImportIconsOTA2014HalloweenConfig.xml");
		priv_exportWithConfig(path);
	}

	[UnityEditor.MenuItem("KBN/Build/Build Atlas/Gear(OTA2014Halloween)")]
	public static void BuildGearOTA2014HalloweenAtlasGroup()
	{
		var path = System.IO.Path.Combine(priv_getImportPath(), "ImportGearOTA2014HalloweenConfig.xml");
		priv_exportWithConfig(path);
	}


	private static string priv_getImportPath()
	{
		return System.IO.Path.Combine(Application.dataPath, "ExportTextures");
	}

	private static void priv_exportWithConfig(string path)
	{
		AtlasExportConfig conf = new AtlasExportConfig();
		var file = System.IO.File.OpenRead(path);
		using (file)
			conf.LoadConfig(file);
		var texsList = new System.Collections.Generic.List<System.Collections.Generic.IEnumerable<Texture2D>>();
		foreach (AtlasExportConfig.ImageInfo img in conf.ImageInfos )
		{
			var texs = priv_getTextures(img);
			if ( texs == null )
				continue;
			texsList.Add(texs);
		}
		string assetPath = System.IO.Path.Combine(Application.dataPath, conf.Config.dstPath);
		string rootPath = conf.Config.rootPath;
		if ( string.IsNullOrEmpty(rootPath) )
			rootPath = priv_getClientResourcePath(assetPath);
		rootPath = rootPath.Trim();
		if (rootPath [rootPath.Length - 1] == '/' || rootPath [rootPath.Length - 1] == '\\')
			rootPath = rootPath.Remove(rootPath.Length-1);

		AtlasGroupMakerInEditor maker = new AtlasGroupMakerInEditor(rootPath);
		ImageData[] imgDatas = new ImageData[texsList.Count];
		for ( int i = 0; i != texsList.Count; ++i )
		{
			var splitName = conf.ImageInfos[i].name;
			var cfg = conf.ImageInfos[i].config;
			imgDatas[i] = BuildAtlas(texsList[i], assetPath, maker, splitName, cfg.boundSize, cfg.clampBoundSize, cfg.clearBound);
			if ( imgDatas[i] == null )
				return;
		}

		foreach ( var tileInfo in conf.TileInfos )
		{
			if ( tileInfo.aliasInfo != null && tileInfo.aliasInfo.Length != 0 )
			{
				var alias = new System.Collections.Generic.List<string>();
				foreach ( var alia in tileInfo.aliasInfo )
				{
					alias.Add(alia.name);
				}
				maker.AddAlias(tileInfo.nameInfo.name, alias.ToArray());
			}

			if ( tileInfo.bounder != null )
			{
				AtlasGroup.Image[] imgs = null;
				if ( maker.GetImages(tileInfo.nameInfo.name, out imgs) )
				{
					for ( int i = 0; i != imgs.Length; ++i )
					{
						imgs[i].cborder = new UnityEngine.RectOffset(
							tileInfo.bounder[0],
							tileInfo.bounder[1],
							tileInfo.bounder[2],
							tileInfo.bounder[3]
							);
					}
				}
			}

			if ( tileInfo.tileNodes != null && tileInfo.tileNodes.Length != 0 )
			{
				var refs = new System.Collections.Generic.List<string>(tileInfo.tileNodes.Length);
				for ( int cnt = 0; cnt != tileInfo.tileNodes.Length; ++cnt )
					refs.Add(null);

				foreach ( var tileNode in tileInfo.tileNodes )
					refs[tileNode.deep] = tileNode.refName;

				maker.AddRef(tileInfo.nameInfo.name, refs.ToArray());
			}
		}

		//	remove hide alias
		foreach ( var tileInfo in conf.TileInfos )
		{
			if ( tileInfo.aliasInfo != null && tileInfo.aliasInfo.Length != 0 )
			{
				//var alias = new System.Collections.Generic.List<string>();
				foreach ( var alia in tileInfo.aliasInfo )
				{
					if ( alia.isHide )
						maker.RemoveTile(alia.name);
				}
			}
			if ( tileInfo.nameInfo.isHide )
				maker.RemoveTile(tileInfo.nameInfo.name);
		}

		maker.RemoveNoRefTile();

		var defaultFileLists = new System.Collections.Generic.List<string>();
		foreach ( AtlasExportConfig.Distribution dis in conf.Distributiones )
		{
			foreach ( AtlasExportConfig.MetaInfo metaInfo in dis.metaInfos )
			{
				if ( dis.dstPath != conf.Config.dstPath )
				{	//	need copy to new path.
					string srcPath = System.IO.Path.Combine(Application.dataPath, conf.Config.dstPath);
					srcPath = System.IO.Path.Combine(srcPath, metaInfo.refName);
					srcPath = System.IO.Path.ChangeExtension(srcPath, ".png");

					string dstPath = System.IO.Path.Combine(Application.dataPath, dis.dstPath);
					dstPath = System.IO.Path.Combine(dstPath, metaInfo.refName);
					dstPath = System.IO.Path.ChangeExtension(dstPath, ".png");

					System.IO.Directory.CreateDirectory(System.IO.Path.GetDirectoryName(dstPath));

					System.IO.File.Copy(srcPath, dstPath, true);
				}
				else
				{
					defaultFileLists.Add(metaInfo.refName);
				}

				var metaPath = System.IO.Path.Combine(dis.dstPath, metaInfo.refName);
				metaPath = "Assets/" + metaPath + ".png";

				AssetDatabase.ImportAsset(metaPath);
				TextureImporter textureImporter = AssetImporter.GetAtPath(metaPath) as TextureImporter;
				textureImporter.textureType = TextureImporterType.GUI;
				TextureImporterSettings st = new TextureImporterSettings();
				textureImporter.ReadTextureSettings(st);
				st.wrapMode = TextureWrapMode.Clamp;
				st.alphaIsTransparency = true;
				st.mipmapEnabled = false;

				for ( int x = 0; x != imgDatas.Length; ++x )
				{
					if ( System.IO.Path.GetFileNameWithoutExtension(imgDatas[x].imgPath) == metaInfo.refName )
					{
						st.maxTextureSize = imgDatas[x].imgSize;
						break;
					}
				}

				if ( metaInfo.maxSize > 0 )
					st.maxTextureSize = metaInfo.maxSize;
				if ( metaInfo.scaleSize > 1 )
					st.maxTextureSize = st.maxTextureSize / metaInfo.scaleSize;
				if ( !string.IsNullOrEmpty(metaInfo.textureFormat) )
					st.textureFormat = (TextureImporterFormat)System.Enum.Parse(typeof(TextureImporterFormat), metaInfo.textureFormat);
				else
					st.textureFormat = TextureImporterFormat.AutomaticCompressed;
				textureImporter.SetTextureSettings(st);
				AssetDatabase.ImportAsset(metaPath);

				foreach ( var img in maker.TextureInfos )
				{
					var imgName = System.IO.Path.GetFileNameWithoutExtension(img.name);
					if ( imgName == metaInfo.refName )
					{
						var tex2D = (Texture2D)AssetDatabase.LoadAssetAtPath(metaPath, typeof(Texture2D));
						img.inMemWidth = (uint)tex2D.width;
						img.inMemHeight = (uint)tex2D.height;
						break;
					}
				}
			}

			var pathName = System.IO.Path.Combine(Application.dataPath, dis.dstPath);
			pathName = System.IO.Path.Combine(pathName, conf.Config.dstName);
			var fileBytes = System.IO.File.OpenWrite(pathName);
			using ( fileBytes )
			{
				maker.Write(fileBytes);
			}
		}

		for ( int i = 0; i != imgDatas.Length; ++i )
		{
			int x = 0;
			for ( ; x != defaultFileLists.Count; ++x )
			{
				if ( System.IO.Path.GetFileNameWithoutExtension(imgDatas[i].imgPath) == defaultFileLists[x] )
					break;
			}

			if ( x == defaultFileLists.Count )
			{
				System.IO.File.Delete(imgDatas[i].imgPath);
				System.IO.File.Delete(imgDatas[i].imgPath+".meta");
			}
		}
	}

	private static System.IO.FileAttributes priv_getFileType(string name, out string newName)
	{
		var fileExtion = new string[]{"", ".png", ".jpg"};
		for ( int i = 0; i != fileExtion.Length; ++i )
		{
			try
			{
				var attr = System.IO.File.GetAttributes(name + fileExtion[i]);
				newName = name + fileExtion[i];
				return attr;
			}
			catch(System.Exception)
			{
			}
		}

		throw new System.IO.FileNotFoundException(name + " Not Found");
	}

	private static System.Collections.Generic.IEnumerable<Texture2D> priv_getTextures(AtlasExportConfig.ImageInfo img)
	{
		var applicationPath = System.IO.Path.GetDirectoryName(Application.dataPath);
		foreach ( string path in img.srcPath )
		{
			string datPath = System.IO.Path.Combine(Application.dataPath, path);
			bool isDir = true;
			try
			{
				var attr = priv_getFileType(datPath, out datPath);
				if ( (attr & System.IO.FileAttributes.Directory) != System.IO.FileAttributes.Directory )
					isDir = false;
			}
			catch(System.Exception)
			{
				continue;
			}

			if ( !isDir )
			{
				var resPath = datPath.Substring(applicationPath.Length+1);
				var texFromFile = (Texture2D)AssetDatabase.LoadAssetAtPath(resPath, typeof(Texture2D));
				if ( texFromFile != null )
					yield return texFromFile;
				continue;
			}

			var di = new System.IO.DirectoryInfo(datPath);
			var fileInfos = di.GetFiles("*", System.IO.SearchOption.AllDirectories)
				.Where(fi => fi.Extension.ToLower() == ".png" || fi.Extension.ToLower() == ".jpg");
			foreach ( System.IO.FileInfo fileInfo in fileInfos )
			{
				var tex2D = (Texture2D)AssetDatabase.LoadAssetAtPath(fileInfo.FullName.Substring(applicationPath.Length+1), typeof(Texture2D));
				if ( tex2D == null )
					continue;
				yield return tex2D;
			}
		}
	}
}
