using UnityEngine;

/// <summary>
/// 打包用的图集管理器.
/// </summary>
public class AtlasGroupMakerInEditor
	: AtlasGroup
{
	//得到当前纹理的数量
	public uint TextureCount
	{
		get { return (uint)m_textureInfo.Count; }
	}
	/// <summary>
	/// Initializes a new instance of the <see cref="AtlasGroupMakerInEditor"/> class.
	/// </summary>
	/// <param name="path">根路径.</param>
	public AtlasGroupMakerInEditor(string path)
	{
		m_rootPath = path;
		m_textureInfo = new System.Collections.Generic.List<TextureInfo>();
		m_imgDatas = new System.Collections.Generic.List<Image>();
		m_name2Idx = new System.Collections.Generic.Dictionary<string, int[]>();
	}
	/// <summary>
	/// 添加一个纹理
	/// </summary>
	/// <returns>此纹理添加后的ID.</returns>
	/// <param name="name">此纹理的名字.</param>
	/// <param name="tex">需要添加的目标纹理.</param>
	public uint AddTexture(string name, Texture2D tex)
	{
		var texInfo = new TextureInfo();
		texInfo.texIdx = m_textureInfo.Count;
		texInfo.name = name;
		texInfo.texHandle = tex;
		texInfo.width = (uint)tex.width;
		texInfo.height = (uint)tex.height;
		m_textureInfo.Add(texInfo);
		return (uint)texInfo.texIdx;
	}
	/// <summary>
	/// 给已存在的图组添加别名
	/// </summary>
	/// <returns><c>true</c>, 添加成功啦, <c>false</c> otherwise.</returns>
	/// <param name="texName">需要添加别名的原始图名.</param>
	/// <param name="alias">别名名字.</param>
	public bool AddAlias(string texName, string[] alias)
	{
		int[] idxs;
		if ( !m_name2Idx.TryGetValue(texName, out idxs) )
			return false;
		foreach ( string alia in alias )
			m_name2Idx.Add(alia, idxs);
		return true;
	}
	/// <summary>
	/// 添加一个图组的引用关系
	/// </summary>
	/// <returns><c>true</c>, if reference was added, <c>false</c> otherwise.</returns>
	/// <param name="texName">待添加的图组名.</param>
	/// <param name="refNames">此新增图组所引用的图元的名字.</param>
	public bool AddRef(string texName, string[] refNames)
	{
		var refIds = new System.Collections.Generic.List<int>();
		for ( int i = 0; i != refNames.Length; ++i )
		{
			int[] ids = null;
			if ( !m_name2Idx.TryGetValue(refNames[i], out ids) )
				return false;
			foreach ( int id in ids)
				refIds.Add(id);
		}
		m_name2Idx.Add(texName, refIds.ToArray());
		return true;
	}

	/// <summary>
	/// 移除一个图组
	/// </summary>
	/// <param name="texName">Tex name.</param>
	public void RemoveTile(string texName)
	{
		m_name2Idx.Remove(texName);
	}
	/// <summary>
	/// 添加一个图元
	/// </summary>
	/// <param name="texDat">图元的基本信息.</param>
	/// <param name="idx">此图元所在的纹理的id.</param>
	public void Add(AtlasExport.TextureData texDat, uint idx)
	{
		var texInfo = m_textureInfo[(int)idx];
		Rect rect = new Rect();
		rect.x = texDat.x;
		rect.y = texInfo.height - texDat.y - texDat.Height;
		rect.width = texDat.Width;
		rect.height = texDat.Height;

		var img = new Image();
		img.uvRect = priv_CalcUV(rect, texInfo.width, texInfo.height);
		img.border = texDat.border;
		var tmp = img.border.top;
		img.border.top = img.border.bottom;
		img.border.bottom = tmp;
		img.texIdx = idx;

		int imgIdx = priv_insertTextureData(img);
		m_name2Idx.Add(texDat.Name, new int[]{imgIdx});
		//m_imgDatas.Add(texDat.Name, img);
	}
	/// <summary>
	/// 根据名字尝试获取图组
	/// </summary>
	/// <returns><c>true</c>, if images was gotten, <c>false</c> otherwise.</returns>
	/// <param name="name">图组名字.</param>
	/// <param name="imgs">返回的图元.</param>
	public bool GetImages(string name, out Image[] imgs)
	{
		return prot_tryGetImages(name, out imgs);
	}
	/// <summary>
	/// 判断两个图元是否是一个图元
	/// </summary>
	/// <returns><c>true</c>, if equ image was equal, <c>false</c> otherwise.</returns>
	/// <param name="l">待比较的图元L.</param>
	/// <param name="r">待比较的图元R.</param>
	private static bool priv_isEquImage(Image l, Image r)
	{
		if ( l.texIdx != r.texIdx )
			return false;
		if ( l.border != r.border )
			return false;
		if ( l.uvRect != r.uvRect )
			return false;
		return true;
	}
	/// <summary>
	/// 插入一个图元
	/// </summary>
	/// <returns>此图元的id.</returns>
	/// <param name="texDat">待插入的图元信息.</param>
	/// <remarks>可以插入同样的，这样会返回已存在图元的id</remarks>
	private int priv_insertTextureData(Image texDat)
	{
		for ( int i = 0; i != m_imgDatas.Count; ++i )
		{
			if ( priv_isEquImage(texDat, m_imgDatas[i]) )
				return i;
		}

		m_imgDatas.Add(texDat);
		return m_imgDatas.Count - 1;
	}
	/// <summary>
	/// 删除未被引用的图元
	/// </summary>
	public void RemoveNoRefImage()
	{
		if ( m_textureInfo == null || m_textureInfo.Count == 0 )
			return;

		if ( m_imgDatas == null || m_imgDatas.Count == 0 )
		{
			m_textureInfo.Clear();
			return;
		}

		var texRefs = new int[m_textureInfo.Count];
		for ( int x = 0; x < m_imgDatas.Count; ++x )
		{
			var texId = m_imgDatas[x].texIdx;
			++texRefs[(int)texId];
		}

		uint[] newIdx = null;
		uint[] idxCast = null;
		for ( uint x = 0; x != texRefs.Length; ++x )
		{
			if ( texRefs[x] == 0 )
			{
				newIdx = new uint[m_textureInfo.Count];
				idxCast = new uint[m_textureInfo.Count];
				break;
			}
		}

		if ( newIdx == null )
			return;

		for ( uint x = 0; x != newIdx.Length; ++x )
		{
			newIdx[x] = x;
			idxCast[x] = x;
		}

		var lastIdx = 0;
		for ( ; lastIdx != newIdx.Length; ++lastIdx)
		{
			if ( texRefs[lastIdx] != 0 )
				continue;

			int j = lastIdx + 1;
			for ( ; j != newIdx.Length; ++j )
			{
				if ( texRefs[j] == 0 )
					continue;
				newIdx[j] = (uint)lastIdx;
				idxCast[lastIdx] = (uint)j;

				texRefs[lastIdx] = texRefs[j];
				texRefs[j] = 0;
				break;
			}

			if ( j == newIdx.Length )
				break;
		}

		var newTexInfo = new System.Collections.Generic.List<TextureInfo>();
		for ( int x = 0; x != lastIdx; ++x )
			newTexInfo.Add(m_textureInfo[(int)idxCast[x]]);
		m_textureInfo = newTexInfo;
		for ( int x = 0; x != m_imgDatas.Count; ++x )
			m_imgDatas[x].texIdx = newIdx[(int)m_imgDatas[x].texIdx];
	}
	/// <summary>
	/// 删除未被引用的图元组（有id 没名字)
	/// </summary>
	public void RemoveNoRefTile()
	{
		var id2RefName = new System.Collections.Generic.List<System.Collections.Generic.List<string>>(m_imgDatas.Count);
		for ( int idx = 0; idx != m_imgDatas.Count; ++idx )
		{
			id2RefName.Add(new System.Collections.Generic.List<string>());
		}

		foreach ( var pair in m_name2Idx )
		{
			foreach ( int index in pair.Value )
			{
				id2RefName[index].Add(pair.Key);
			}
		}

		var newIdxs = new System.Collections.Generic.List<int>();
		int newIdx = 0;
		for ( int i = 0; i != id2RefName.Count; ++i )
		{
			newIdxs.Add(newIdx);
			if ( id2RefName[i].Count != 0 )
				++newIdx;
		}

		foreach ( var idxArray in m_name2Idx.Values )
		{
			for ( int pos = 0; pos != idxArray.Length; ++pos )
			{
				idxArray[pos] = newIdxs[idxArray[pos]];
			}
		}

		var newImgs = new System.Collections.Generic.List<Image>();
		for ( int x = 0; x < m_imgDatas.Count; ++x )
		{
			if ( id2RefName[x].Count != 0 )
				newImgs.Add(m_imgDatas[x]);
		}
		m_imgDatas = newImgs;
		this.RemoveNoRefImage();
	}
	/// <summary>
	/// 将配置写入文件！
	/// </summary>
	/// <param name="file">目标文件.</param>
	public void Write(System.IO.Stream file)
	{
		var binFile = new System.IO.BinaryWriter(file);
		using ( binFile )
		{
			binFile.Write(GM_FILE_VERSION);
			binFile.Write(m_rootPath);
			uint cnt = (uint)m_textureInfo.Count;
			binFile.Write(cnt);
			foreach( var info in m_textureInfo )
			{
				binFile.Write(info);
			}
			
			cnt = (uint)m_imgDatas.Count;
			binFile.Write(cnt);
			foreach ( var imgDat in m_imgDatas )
			{
				binFile.Write(imgDat);
			}

			cnt = (uint)m_name2Idx.Count;
			binFile.Write(cnt);
			foreach ( var name2Idx in m_name2Idx )
			{
				binFile.Write(name2Idx.Key);
				byte idxCnt = (byte)name2Idx.Value.Length;
				binFile.Write(idxCnt);
				foreach ( var idxPos in name2Idx.Value )
					binFile.Write(idxPos);
			}
		}
	}
	/// <summary>
	/// 根据区域计算uv
	/// </summary>
	/// <returns>计算后的UV.</returns>
	/// <param name="rect">图元的区域.</param>
	/// <param name="imgWidth">Image width.</param>
	/// <param name="imgHeight">Image height.</param>
	private static Rect priv_CalcUV(Rect rect, uint imgWidth, uint imgHeight)
	{
		Rect uvRect = new Rect();
		uvRect.x = (float)rect.x / (float)imgWidth;
		uvRect.y = ((float)imgHeight - (float)rect.y - (float)rect.height)/ (float)imgHeight;
		uvRect.width = (float)rect.width / (float)imgWidth;
		uvRect.height = (float)rect.height / (float)imgHeight;
		return uvRect;
	}
}

/// <summary>
/// 写入图集配置项的辅助类.
/// </summary>
static class WriteClass
{
	public static void Write(this System.IO.BinaryWriter file, AtlasGroup.TextureInfo texInfo)
	{
		file.Write(texInfo.texIdx);
		file.Write(texInfo.name);
		file.Write(texInfo.width);
		file.Write(texInfo.height);
		file.Write(texInfo.inMemWidth);
		file.Write(texInfo.inMemHeight);
	}

	public static void Write(this System.IO.BinaryWriter file, AtlasGroup.Image img)
	{
		AtlasGroup.ImageField imgField = AtlasGroup.ImageField.None;
		if ( img.border != null && (img.border.left != 0 || img.border.right != 0 || img.border.top != 0 || img.border.bottom != 0) )
			imgField |= AtlasGroup.ImageField.HaveBorder;
		if ( img.cborder != null && (img.cborder.left != 0 || img.cborder.right != 0 || img.cborder.top != 0 || img.cborder.bottom != 0) )
			imgField |= AtlasGroup.ImageField.HaveCBorder;

		file.Write((byte)imgField);
		file.Write(img.texIdx);
		//file.Write(img.rect);
		if ( (imgField & AtlasGroup.ImageField.HaveBorder) != AtlasGroup.ImageField.None )
			file.Write(img.border);
		if ( (imgField & AtlasGroup.ImageField.HaveCBorder) != AtlasGroup.ImageField.None )
			file.Write(img.cborder);
		file.Write(img.uvRect);
		//file.Write(img.OrgRect);
		//file.Write(img.LogicRect);
	}
	public static void Write(this System.IO.BinaryWriter file, Rect r)
	{
		file.Write(r.x);
		file.Write(r.y);
		file.Write(r.width);
		file.Write(r.height);
	}
	public static void Write(this System.IO.BinaryWriter file, RectOffset r)
	{
		file.Write(r.left);
		file.Write(r.right);
		file.Write(r.top);
		file.Write(r.bottom);
	}
}
