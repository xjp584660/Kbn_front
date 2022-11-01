using UnityEngine;
using System;

namespace GearLevelUpData
{
	public class GearLevelUps
	{
		[JasonReflection.JasonData("data")]
		public System.Collections.Generic.Dictionary<int, GearLevelUpItem> Items = new System.Collections.Generic.Dictionary<int, GearLevelUpItem>();
		public GearLevelUps()
		{
		}
		
		public GearLevelUps(HashObject data)
		{
			foreach ( string item in data.Keys )
			{
				if ( string.IsNullOrEmpty(item) )
					continue;
				var itemID = System.Convert.ToInt32(item);
				HashObject val = data[item];
				priv_addItem(itemID,val);
			}
		}

		private void priv_addItem(int id,HashObject item)
		{
			GearLevelUpItem newItem = new GearLevelUpItem(item);
			Items.Add(id,newItem);
		}

		public GearLevelUpItem Find(int id)
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
		
		public GearArmLevelData FindArmLevelData(int id, int level)
		{
			try
			{
				return Items[id].GetLevelInfo(level);
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
	}
	
	public class GearLevelUpItem
	{
		private GearArmLevelData[] levels;
		private int m_uMaxLevels = 0;
		private static readonly int count = 20;

        public static int GlobalMaxLevel { get; set; }
		
        static GearLevelUpItem()
        {
            GlobalMaxLevel = -1;
        }

		public GearLevelUpItem()
		{
		}
		
		public GearLevelUpItem(HashObject data)
		{
			for ( int i = 0; i != count; ++i )
			{
				HashObject ho = data["l"+(i+1).ToString()];
				if ( ho == null )
					break;
				GearArmLevelData armLevel = new GearArmLevelData(ho);
				priv_setLevels(armLevel, i);
			}
		}
		
		
		private void priv_setLevels(GearArmLevelData lvInfo, int lv)
		{
			if ( levels == null )
				levels = new GearArmLevelData[count];
			levels[lv] = lvInfo;
			if ( m_uMaxLevels < lv + 1 )
				m_uMaxLevels = lv + 1;
		}
		
		public int MaxLevels
		{
			get
			{
                return GlobalMaxLevel <= 0 ? m_uMaxLevels :
                       GlobalMaxLevel > m_uMaxLevels ? m_uMaxLevels :
                       GlobalMaxLevel;
			}
		}
		
		public GearArmLevelData GetLevelInfo(int level)
		{
            if (level > MaxLevels) {
                throw new ArgumentOutOfRangeException(string.Format("Level {0} is greater than max level {1}", level, MaxLevels));
            }
			return levels[level];
		}
	}
	
	public class GearArmLevelData
	{
		public int id;
		public int level;
		public int baseItem;
		public int baseNum;
		public int mightSucc;
		public int mightFail;
		public GearItemLevelupDataArray item_data;
		public GearItemLevelupData GetItem(int idx)
		{
			return item_data.GetItem(idx);
		}
		
		public GearArmLevelData()
		{
		}
		
		public GearArmLevelData(HashObject data)
		{
			id = System.Convert.ToInt32(data["id"].Value);
			level = System.Convert.ToInt32(data["level"].Value);
			baseItem = System.Convert.ToInt32(data["baseItem"].Value);
			baseNum = System.Convert.ToInt32(data["baseNum"].Value);
			mightSucc = System.Convert.ToInt32(data["mightSucc"].Value);
			mightFail = System.Convert.ToInt32(data["mightFail"].Value);
			
			item_data = new GearItemLevelupDataArray(data["item_data"]);
		}
	}
	
	public class GearItemLevelupDataArray
	{
		public GearItemLevelupData[] Items;

		private static readonly int count = 5;
		
		public GearItemLevelupDataArray()
		{
		}

		public GearItemLevelupDataArray(HashObject data)
		{
			for ( int i = 0; i != count; ++i )
			{
				HashObject hoData = data["item_" + (i+1).ToString()];
				if ( hoData == null )
					continue;
				GearItemLevelupData levelup = new GearItemLevelupData(hoData);
				priv_setItemLevelupData(levelup, i+1);
			}
		}
		
		private void priv_setItemLevelupData(GearItemLevelupData itemInfo, int id)
		{
			if ( Items == null )
				Items = new GearItemLevelupData[count];
			Items[id-1] = itemInfo;
		}

		public GearItemLevelupData GetItem(int idx)
		{
			if ( Items == null )
				return null;
			return Items[idx];
		}
	}
	
	public class GearItemLevelupData
	{
		public int id;
		public int count;
		public int rate;
		public int showRate;
		
		public GearItemLevelupData()
		{
		}
		
		public GearItemLevelupData(HashObject data)
		{
			id = System.Convert.ToInt32(data["id"].Value);
			count = System.Convert.ToInt32(data["count"].Value);
			rate = System.Convert.ToInt32(data["rate"].Value);
			showRate = System.Convert.ToInt32(data["showRate"].Value);
		}
	}
}
