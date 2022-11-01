using UnityEngine;
using System.Collections;

public class AtlasExportConfig
{
	public class ConfigInfo
	{
		public uint boundSize = 0;
		public uint clampBoundSize = 0;
		public bool clearBound = true;
		public ConfigInfo()
		{
		}

		public ConfigInfo(GConfigInfo cfg)
		{
			boundSize = cfg.boundSize;
			clampBoundSize = cfg.clampBoundSize;
			clearBound = cfg.clearBound;
		}
	}

	public class GConfigInfo
		: ConfigInfo
	{
		public string dstPath;
		public string dstName;
		public string rootPath;
	}

	public class ImageInfo
	{
		//public string path;
		public string name;
		public System.Collections.Generic.List<string> srcPath;
		public ConfigInfo config;
		public override string ToString()
		{
			return string.Format("{0}", name);
		}
	}

	public class MetaInfo
	{
		public	string refName;
		public 	string textureFormat;
		public	int maxSize;
		public	int scaleSize;
	}

	public class Distribution
	{
		public string dstPath;
		public MetaInfo[] metaInfos;
	}

	public class NameInfo
	{
		public string name;
		public bool isHide;
		public override string ToString()
		{
			return string.Format("{0}:{1}", name, isHide.ToString());
		}
	}

	public class TileNodeInfo
	{
		public string refName;
		public int deep;
		//public byte[] cborder;
		public static TileNodeInfo CreateFromXmlNode(System.Xml.XmlNode nd)
		{
			string refName = null;
			int deep = -1;
			foreach (System.Xml.XmlNode node in nd.ChildNodes)
			{
				if (node.Name == "ref")
				{
					refName = node.InnerText;
					continue;
				}

				if (node.Name == "deep")
				{
					deep = System.Convert.ToInt32(node.InnerText);
					continue;
				}
			}
			
			var nodeInfo = new TileNodeInfo();
			nodeInfo.refName = refName;
			nodeInfo.deep = deep;
			return nodeInfo;
		}
	}

	public interface TileInfoGen
	{
		System.Collections.Generic.IEnumerable<TileInfo> GetTileInfo();
	}

	public class TileInfo
	{
		public NameInfo nameInfo;
		public byte[] bounder;
		public NameInfo[] aliasInfo;
		public TileNodeInfo[] tileNodes;
		public static TileInfo CreateFromXmlNode(System.Xml.XmlNode nd)
		{
			NameInfo nameInfo = null;
			byte[] bounder = null;
			var alias = new System.Collections.Generic.List<NameInfo>();
			var nodeInfos = new System.Collections.Generic.List<TileNodeInfo>();
			foreach (System.Xml.XmlNode tile in nd.ChildNodes)
			{
				if (tile.Name == "name")
				{
					nameInfo = new NameInfo();
					nameInfo.name = tile.InnerText;
					var attrHideName = tile.Attributes["hide"];
					if (attrHideName != null)
						nameInfo.isHide = System.Convert.ToBoolean(attrHideName.Value);
					continue;
				}

				if (tile.Name == "bounder")
				{
					bounder = priv_getBounder(tile);
					continue;
				}

				if (tile.Name == "alias")
				{
					var aliasInfo = new NameInfo();
					aliasInfo.name = tile.InnerText;
					var attrHideAlias = tile.Attributes["hide"];
					if (attrHideAlias != null)
						aliasInfo.isHide = System.Convert.ToBoolean(attrHideAlias.Value);
					alias.Add(aliasInfo);
					continue;
				}
				
				if (tile.Name == "TileNode")
				{
					var nodeInfo = TileNodeInfo.CreateFromXmlNode(tile);
					nodeInfos.Add(nodeInfo);
					continue;
				}
			}
			if (nameInfo == null && nodeInfos.Count == 0)
				return null;
			TileInfo inf = new TileInfo();
			inf.nameInfo = nameInfo;
			inf.aliasInfo = alias.ToArray();
			inf.tileNodes = nodeInfos.ToArray();
			inf.bounder = bounder;
			if (inf.nameInfo == null )
			{
				inf.nameInfo = new NameInfo();
				inf.nameInfo.isHide = true;
				inf.nameInfo.name = inf.tileNodes[0].refName;
			}

			return inf;
		}
		
		private static byte[] priv_getBounder(System.Xml.XmlNode nd)
		{
			var bdInf = new byte[4];	//lrtb
			foreach (System.Xml.XmlNode bd in nd.ChildNodes)
			{
				if (bd.Name == "left")
				{
					bdInf[0] = System.Convert.ToByte(bd.InnerText);
					continue;
				}
				if (bd.Name == "right")
				{
					bdInf[1] = System.Convert.ToByte(bd.InnerText);
					continue;
				}
				if (bd.Name == "top")
				{
					bdInf[2] = System.Convert.ToByte(bd.InnerText);
					continue;
				}
				if (bd.Name == "bottom")
				{
					bdInf[3] = System.Convert.ToByte(bd.InnerText);
					continue;
				}
				throw new System.Exception("Unsupport bounder child : " + bd.Name);
			}
			
			return bdInf;
		}
	}

	public class TileInfoGenBase
		: TileInfoGen
	{
		private TileInfo m_tileInfo;
		public System.Collections.Generic.IEnumerable<TileInfo> GetTileInfo()
		{
			yield return m_tileInfo;
		}

		public static TileInfoGen CreateFromXmlNode(System.Xml.XmlNode nd)
		{
			TileInfoGenBase rtv = new TileInfoGenBase();
			rtv.m_tileInfo = TileInfo.CreateFromXmlNode(nd);
			return rtv;
		}
	}

	private ImageInfo[] m_imgsInfo;
	private TileInfoGen[] m_tileInfos;
	private GConfigInfo m_cfgInfo;
	private Distribution[] m_distributiones;

	public ImageInfo[] ImageInfos
	{
		get
		{
			return m_imgsInfo;
		}
	}

	public System.Collections.Generic.IEnumerable<Distribution> Distributiones
	{
		get
		{
			return m_distributiones;
		}
	}

	public System.Collections.Generic.IEnumerable<TileInfo> TileInfos
	{
		get
		{
			if ( m_tileInfos == null )
				yield break;

			foreach ( TileInfoGen tileInfoGen in m_tileInfos )
			{
				foreach ( TileInfo ti in tileInfoGen.GetTileInfo() )
					yield return ti;
			}
		}
	}

	public GConfigInfo Config
	{
		get
		{
			return m_cfgInfo;
		}
	}

	public AtlasExportConfig()
	{
	}

	public bool LoadConfig(System.IO.Stream xmlStream)
	{
		System.Xml.XmlReader xmlReader = System.Xml.XmlReader.Create(xmlStream);
		System.Xml.XmlDocument xmlDoc = new System.Xml.XmlDocument();
		xmlDoc.Load(xmlReader);

		if ( xmlDoc.ChildNodes.Count == 0 )
			return false;
		priv_readRootNode(xmlDoc.ChildNodes[0]);
		return true;
	}

	private void priv_readRootNode(System.Xml.XmlNode nd)
	{
		if ( nd.Name != "Atlas" )
			return;

		ImageInfo[] imgInfos = null;
		TileInfoGen[] tileInfos = null;
		Distribution[] distribution = null;

		GConfigInfo cfgInfo = null;
		for (int i = 0; i != nd.ChildNodes.Count; ++i)
		{
			var chr = nd.ChildNodes[i];
			if (chr.Name == "Images")
			{
				imgInfos = priv_getImagesInfo(chr, cfgInfo);
				continue;
			}

			if (chr.Name == "Tiles")
			{
				tileInfos = priv_getTileInfoGens(chr);
				continue;
			}

			if ( chr.Name == "GConfig" )
			{
				cfgInfo = priv_getGConfigInfo(chr);
				continue;
			}

			if ( chr.Name == "Distribution" )
			{
				distribution = priv_getDistributiones(chr);
				continue;
			}
		}

		m_imgsInfo = imgInfos;
		m_tileInfos = tileInfos;
		m_cfgInfo = cfgInfo;
		m_distributiones = distribution;
		if ( m_distributiones == null )
		{
			var dis = new Distribution();
			m_distributiones = new Distribution[]{dis};
			dis.dstPath = m_cfgInfo.dstPath;
			dis.metaInfos = new MetaInfo[m_imgsInfo.Length];
			for ( int i = 0; i != dis.metaInfos.Length; ++i )
			{
				var metaInfo = new MetaInfo();
				metaInfo.refName = m_imgsInfo[i].name;
				metaInfo.maxSize = -1;
				metaInfo.scaleSize = 1;
				dis.metaInfos[i] = metaInfo;
			}
		}
		else
		{
			foreach ( Distribution dist in m_distributiones )
			{
				if ( string.IsNullOrEmpty(dist.dstPath) )
				{
					dist.dstPath = m_cfgInfo.dstPath;
					break;
				}
			}
		}
	}

	private ImageInfo[] priv_getImagesInfo(System.Xml.XmlNode nd, GConfigInfo gcfg)
	{
		var infs = new System.Collections.Generic.List<ImageInfo>();
		foreach (System.Xml.XmlNode chr in nd.ChildNodes)
		{
			if ( chr.GetType() == typeof(System.Xml.XmlComment) )
				continue;

			if (chr.Name != "Image")
				throw new System.Exception("Unsupport Images child node:" + chr.Name);
			ImageInfo inf = new ImageInfo();
			inf.name = chr.Attributes["name"].Value;
			inf.srcPath = new System.Collections.Generic.List<string>();
			inf.config = new ConfigInfo(gcfg);
			foreach (System.Xml.XmlNode src in chr.ChildNodes)
			{
				if (src is System.Xml.XmlComment)
					continue;
				switch ( src.Name )
				{
				case "Config":
					inf.config = priv_getConfigInfo(src);
					break;
				case "src":
					inf.srcPath.Add(src.Attributes["path"].Value);
					break;
				default:
					throw new System.Exception("Unsupport Image child node:" + src.Name);
				}
			}
			infs.Add(inf);
		}
		return infs.ToArray();
	}

	private TileInfoGen[] priv_getTileInfoGens(System.Xml.XmlNode nd)
	{
		var infs = new System.Collections.Generic.List<TileInfoGen>();
		foreach (System.Xml.XmlNode chr in nd.ChildNodes)
		{
			if (chr.Name == "Tile")
			{
				var baseGen = TileInfoGenBase.CreateFromXmlNode(chr);
				infs.Add(baseGen);
				continue;
			}

			if ( chr.Name == "TileIntRange" )
			{
				var tileIntRange = AtlasTileInfoGen_TileIntRange.CreateFromXmlNode(chr);
				infs.Add(tileIntRange);
				continue;
			}
			if ( chr.GetType() == typeof(System.Xml.XmlComment) )
				continue;
			throw new System.Exception("Unsupport Tiles child node:" + chr.Name);
		}
		return infs.ToArray();
	}

	private Distribution[] priv_getDistributiones(System.Xml.XmlNode nd)
	{
		var dis = new System.Collections.Generic.List<Distribution>();
		foreach ( System.Xml.XmlNode chr in nd.ChildNodes )
		{
			if ( chr is System.Xml.XmlComment )
				continue;
			if ( chr.Name == "Release" )
			{
				Distribution d = priv_getRelease(chr);
				dis.Add(d);
				continue;
			}

			throw new System.Exception("Unsupport Distribution Child : " + chr.Name);
		}

		return dis.ToArray();
	}

	private Distribution priv_getRelease(System.Xml.XmlNode nd)
	{
		var metaInfos = new System.Collections.Generic.List<MetaInfo>();
		string dstPath = null;
		foreach ( System.Xml.XmlNode chr in nd.ChildNodes )
		{
			if ( chr is System.Xml.XmlComment )
				continue;
			if ( chr.Name == "dstPath" )
			{
				dstPath = chr.InnerText;
				continue;
			}
			if ( chr.Name == "meta" )
			{
				metaInfos.Add(priv_getMetaInfo(chr));
				continue;
			}
		}
		Distribution d = new Distribution();
		d.metaInfos = metaInfos.ToArray();
		d.dstPath = dstPath;
		return d;
	}

	private MetaInfo priv_getMetaInfo(System.Xml.XmlNode nd)
	{
		var attr = nd.Attributes["ref"];
		if ( attr == null )
			throw new System.Exception("Invalid meta node, need: ref");
		var metaInfo = new MetaInfo();
		metaInfo.refName = attr.Value;
		foreach ( System.Xml.XmlNode chr in nd.ChildNodes )
		{
			if ( chr is System.Xml.XmlComment )
				continue;
			if ( chr.Name == "maxSize" )
			{
				metaInfo.maxSize = System.Convert.ToInt32(chr.InnerText);
				continue;
			}
			if ( chr.Name == "scaleSize" )
			{
				metaInfo.scaleSize = System.Convert.ToInt32(chr.InnerText);
				continue;
			}
			if ( chr.Name == "textureFormat" )
			{
				metaInfo.textureFormat = chr.InnerText;
				continue;
			}
			throw new System.Exception("Unsupport meta child : " + chr.Name);
		}

		return metaInfo;
	}


	public ConfigInfo priv_getConfigInfo(System.Xml.XmlNode nd)
	{
		uint boundSize = 0;
		uint clampBoundSize = 0;
		bool clearBound = false;
		foreach ( System.Xml.XmlNode chr in nd.ChildNodes )
		{
			if ( chr.Name == "boundSize" )
			{
				boundSize = System.Convert.ToUInt32(chr.InnerText);
				continue;
			}
			if ( chr.Name == "clampBoundSize" )
			{
				clampBoundSize = System.Convert.ToUInt32(chr.InnerText);
				continue;
			}
			if ( chr.Name == "clearBound" )
			{
				clearBound = System.Convert.ToBoolean(chr.InnerText);
				continue;
			}
			throw new System.Exception("Unsupport Config child: " + chr.Name);
		}

		var cfgInfo = new ConfigInfo();
		cfgInfo.boundSize = boundSize;
		cfgInfo.clampBoundSize = clampBoundSize;
		cfgInfo.clearBound = clearBound;
		return cfgInfo;
	}

	public GConfigInfo priv_getGConfigInfo(System.Xml.XmlNode nd)
	{
		string dstPath = null;
		string dstName = null;
		string rootPath = null;
		uint boundSize = 0;
		uint clampBoundSize = 0;
		bool clearBound = false;
		foreach ( System.Xml.XmlNode chr in nd.ChildNodes )
		{
			if ( chr.Name == "dstPath" )
			{
				dstPath = chr.InnerText;
				continue;
			}
			if ( chr.Name == "dstName" )
			{
				dstName = chr.InnerText;
				continue;
			}
			if ( chr.Name == "rootPath" )
			{
				rootPath = chr.InnerText;
				continue;
			}
			if ( chr.Name == "boundSize" )
			{
				boundSize = System.Convert.ToUInt32(chr.InnerText);
				continue;
			}
			if ( chr.Name == "clampBoundSize" )
			{
				clampBoundSize = System.Convert.ToUInt32(chr.InnerText);
				continue;
			}
			if ( chr.Name == "clearBound" )
			{
				clearBound = System.Convert.ToBoolean(chr.InnerText);
				continue;
			}
			throw new System.Exception("Unsupport Config child: " + chr.Name);
		}

		var cfgInfo = new GConfigInfo();
		cfgInfo.dstPath = dstPath;
		cfgInfo.dstName = dstName;
		cfgInfo.rootPath = rootPath;
		cfgInfo.boundSize = boundSize;
		cfgInfo.clampBoundSize = clampBoundSize;
		cfgInfo.clearBound = clearBound;
		return cfgInfo;
	}

}
