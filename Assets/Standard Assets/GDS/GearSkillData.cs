
namespace GearSkillData
{
	public class GearSkills
	{
		[JasonReflection.JasonData("data")]
		public System.Collections.Generic.Dictionary<int, GearSkillItem> Items = new System.Collections.Generic.Dictionary<int, GearSkillItem>();
		//[JasonReflection.JasonData("ver")]
		//public int version;
		//[JasonReflection.JasonData("restart")]
		//public int needRestart;
		
		public GearSkillItem Find(int id)
		{
			try
			{
				return Items[id];
			}
			catch(System.Exception)
			{
				return null;
			}
		}
		
		public void Clear()
		{
			Items.Clear();
		}
		
		public GearSkills()
		{
		}
		
		public GearSkills(HashObject data)
		{
			Items.Clear();
			foreach ( string item in data.Keys )
			{
				if ( string.IsNullOrEmpty(item) )
					continue;
				var itemID = System.Convert.ToInt32(item);
				HashObject val = data[item];
				AddItem(itemID,val);
			}
		}
		
		public void AddItem(int id,HashObject item)
		{
			GearSkillItem newItem = new GearSkillItem(item);
			Items.Add(id,newItem);
		}
		
	}
	
	[JasonReflection.JasonData]
	public class GearSkillItem
	{
		public int type;
		public string subType;
		public string color;
		public int rare;
		public string iconSkill;
		public int iconLevel;
		public string iconTarget;
		public int isPercent;
		private System.Collections.Generic.List<int> m_levels;
		private System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<int,int> > m_stones;
		
		//[JasonReflection.JasonData("rare")]
		//public string rareString
		//{
		//	set
		//	{
		//		if ( string.IsNullOrEmpty(value) )
		//			rare = 0;
		//		else
		//			rare = System.Convert.ToInt32(value);
		//	}
		//	get
		//	{
		//		return rare.ToString();
		//	}
		//}
		
		public GearSkillItem()
		{
		}
		
		public GearSkillItem(HashObject data)
		{
			type = System.Convert.ToInt32(data["type"].Value);
			subType = data["subType"].Value.ToString();
			color = data["color"].Value.ToString();
			rare = System.Convert.ToInt32(data["rare"].Value);
			iconSkill = data["iconSkill"].Value.ToString();
			iconLevel = System.Convert.ToInt32(data["iconLevel"].Value);
			iconTarget = data["iconTarget"].Value.ToString();
			isPercent = System.Convert.ToInt32(data["isPercent"].Value);
			level = data["level"];
			stone = data["stone"];
		}
		
		public HashObject level
		{
			set
			{
				m_levels = null;
				int idx = 1;
				while(true)
				{
					if(value["lv" + idx.ToString ()] == null)
						break;
					
					var levelValue = value["lv" + idx.ToString ()].Value.ToString();
					if ( string.IsNullOrEmpty(levelValue) )
						break;
					if ( m_levels == null )
						m_levels = new System.Collections.Generic.List<int>();
					m_levels.Add(System.Convert.ToInt32(levelValue));
					idx ++;
				}
			}
		}
		
		public HashObject stone
		{
			set
			{
				m_stones = null;
				foreach ( string item in value.Keys )
				{
					if ( string.IsNullOrEmpty(item) )
						continue;
					string val = value[item].Value.ToString();
					if ( m_stones == null )
						m_stones = new System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<int,int> >();
					var itemID = System.Convert.ToInt32(item);
					var stonePercent = System.Convert.ToInt32(val);
					m_stones.Add(new System.Collections.Generic.KeyValuePair<int,int>(itemID, stonePercent));
				}
//				if ( m_stones != null )
//					m_stones.Sort((x, y) => x.Key - y.Key);
			}
		}
		
		public int GetLevelData(int lv)
		{
			--lv;
			if ( m_levels == null || lv >= m_levels.Count )
				return 0;
			return m_levels[lv];
		}
		
		public int GetStoneData(int id)
		{
			if ( m_stones == null )
				return 0;
			for ( int i = 0; i != m_stones.Count; ++i )
				if ( m_stones[i].Key == id )
					return m_stones[i].Value;
			return 0;
			/*
			int start = 0;
			int end = m_stone.Length;
			int pos = (start + end + 1) / 2;
			while ( pos != end )
			{
				if ( m_stones[pos].Key > id )
				{
					end = pos;
					pos = (start + end + 1)/2;
				}
				else if ( m_stones[pos].Key < id )
				{
					
				}
			}
			*/
		}
	}
}
