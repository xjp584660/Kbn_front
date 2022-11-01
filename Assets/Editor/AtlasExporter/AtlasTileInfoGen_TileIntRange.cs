
public class AtlasTileInfoGen_TileIntRange : AtlasExportConfig.TileInfoGen
{
	private AtlasExportConfig.TileInfoGen m_tileNodeTemplateGen;
	//private AtlasExportConfig.TileInfo m_tileNodeTemplate;
	//private AtlasExportConfig.TileNodeInfo[] m_tileNodeInfoTemplate;
	struct Range
	{
		public Range(int in_start, int in_end)
		{
			start = in_start;
			end = in_end;
		}
		public readonly int start;
		public readonly int end;
	}

	private System.Collections.Generic.List<Range> m_ranges;
	private System.Collections.Generic.Dictionary<string, string> m_paramsTemplate;
	public static AtlasExportConfig.TileInfoGen CreateFromXmlNode(System.Xml.XmlNode nd)
	{
		AtlasTileInfoGen_TileIntRange rtv = new AtlasTileInfoGen_TileIntRange();
		AtlasExportConfig.TileInfoGen tileNodeTemplateGen = null;
		var p = new System.Collections.Generic.Dictionary<string, string>();
		var ranges = new System.Collections.Generic.List<Range>();
		foreach ( System.Xml.XmlNode node in nd.ChildNodes )
		{
			if ( node.Name == "Tile" )
			{
				tileNodeTemplateGen = AtlasExportConfig.TileInfoGenBase.CreateFromXmlNode(node);
				continue;
			}

			if ( node.Name == "TileIntRange" )
			{
				tileNodeTemplateGen = CreateFromXmlNode(node);
				continue;
			}

			if ( node.Name == "range" )
			{
				var r = priv_readRange(node);
				ranges.Add(r);
				continue;
			}

			if ( node.Name == "p" )
			{
				p = priv_readParams(node);
				continue;
			}

			throw new System.Exception("Unknow TileIntRange Child : " + node.Name);
		}

		//tileNodeInfos.Sort((l,r)=>l.deep - r.deep);
		rtv.m_ranges = ranges;
		rtv.m_paramsTemplate = p;
		rtv.m_tileNodeTemplateGen = tileNodeTemplateGen;
		return rtv;
	}

	private static Range priv_readRange(System.Xml.XmlNode nd)
	{
		int start = 0;
		int end = 0;
		if ( nd.Attributes["start"] != null )
			start = System.Convert.ToInt32(nd.Attributes["start"].Value);
		if ( nd.Attributes["end"] != null )
			end = System.Convert.ToInt32(nd.Attributes["end"].Value);

		foreach ( System.Xml.XmlNode node in nd.ChildNodes )
		{
			if ( node.Name == "start" )
			{
				start = System.Convert.ToInt32(node.InnerText);
				continue;
			}
			if ( node.Name == "end" )
			{
				end = System.Convert.ToInt32(node.InnerText);
				continue;
			}

			throw new System.Exception("Unknow Range Child : " + node.Name.ToString());
		}

		return new Range(start, end);
	}

	private static System.Collections.Generic.Dictionary<string, string> priv_readParams(System.Xml.XmlNode nd)
	{
		var p = new System.Collections.Generic.Dictionary<string, string>();
		foreach ( System.Xml.XmlNode node in nd.ChildNodes )
		{
			p.Add(node.Name, node.InnerText);
		}

		return p;
	}

	public System.Collections.Generic.IEnumerable<AtlasExportConfig.TileInfo> GetTileInfo()
	{
		foreach ( var rg in m_ranges )
		{
			foreach ( AtlasExportConfig.TileInfo ti in priv_getTileInfoWithOneRange(rg.start, rg.end) )
			{
				yield return ti;
			}
		}
	}

	private System.Collections.Generic.IEnumerable<AtlasExportConfig.TileInfo> priv_getTileInfoWithOneRange(int start, int end)
	{
		for ( int i = start; i != end; ++i )
		{
			foreach ( var tileNodeTemplate in m_tileNodeTemplateGen.GetTileInfo() )
			{
				var tileInfo = new AtlasExportConfig.TileInfo();
				tileInfo.nameInfo = new AtlasExportConfig.NameInfo();
				tileInfo.nameInfo.name = priv_fmtFromParam(tileNodeTemplate.nameInfo.name, i, m_paramsTemplate);
				if ( tileNodeTemplate.aliasInfo != null && tileNodeTemplate.aliasInfo.Length != 0 )
				{
					tileInfo.aliasInfo = new AtlasExportConfig.NameInfo[tileNodeTemplate.aliasInfo.Length];
					for ( int x = 0; x != tileInfo.aliasInfo.Length; ++x )
					{
						tileInfo.aliasInfo[x] = new AtlasExportConfig.NameInfo();
						tileInfo.aliasInfo[x].isHide = tileNodeTemplate.aliasInfo[x].isHide;
						tileInfo.aliasInfo[x].name = priv_fmtFromParam(tileNodeTemplate.aliasInfo[x].name, i, m_paramsTemplate);
					}
				}

				if ( tileNodeTemplate.tileNodes != null && tileNodeTemplate.tileNodes.Length != 0 )
				{
					tileInfo.tileNodes = new AtlasExportConfig.TileNodeInfo[tileNodeTemplate.tileNodes.Length];
					tileInfo.bounder = tileNodeTemplate.bounder;
					for ( int m = 0; m != tileInfo.tileNodes.Length; ++m )
					{
						tileInfo.tileNodes[m] = new AtlasExportConfig.TileNodeInfo();
						tileInfo.tileNodes[m].deep = tileNodeTemplate.tileNodes[m].deep;
						//tileInfo.tileNodes[m].refName = new AtlasExportConfig.NameInfo();
						//tileInfo.tileNodes[m].refName.isHide = m_tileNodeTemplate.tileNodes[m].refName.isHide;
						tileInfo.tileNodes[m].refName = priv_fmtFromParam(tileNodeTemplate.tileNodes[m].refName, i, m_paramsTemplate);
					}
				}

				yield return tileInfo;
			}
		}
	}

	private static string priv_fmtFromParam(string inDat, int input, System.Collections.Generic.Dictionary<string, string> ps)
	{
		foreach ( var p in ps )
		{
			string val = string.Format(p.Value, input.ToString());
			string key = string.Format("{{{0}}}", p.Key);
			int nVal = (int)Evaluate(val);
			inDat = inDat.Replace(key, nVal.ToString());
		}

		return inDat;
	}

	public static int Evaluate(string expression)
	{
		var loDataTable = new System.Data.DataTable();
		var loDataColumn = new System.Data.DataColumn("Eval", typeof (int), expression);
		loDataTable.Columns.Add(loDataColumn);
		loDataTable.Rows.Add(0);
		return (int) (loDataTable.Rows[0]["Eval"]);
	}
}
