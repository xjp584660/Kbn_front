using System.Collections.Generic;
using System;
namespace KBN
{
	public class HeroElevateReqItem
	{
		public int ID = 0;
		public long ReqNum = 0;
		public long CurNum = 0;
	}

	// 圣物套装类型
	public enum RelicSetType
	{
		None,
		One_Two_Effect, // 一个双套装
		Two_Two_Effect, // 两个双套装
		One_Foue_Effect,// 一个四套装
	}

	// 圣物套装
	public class HeroRelicSet
	{
		public RelicSetType setType = RelicSetType.None;
		public int OneSetId = 0;
		public float OneSetValue = 0;
		public int TwoSetId = 0;
		public float TwoSetValue = 0f;
	}

    public class HeroInfo
    {
        private readonly long m_Id = 0L;
        private readonly IList<HeroSkill> m_Skill = new List<HeroSkill>();
        private readonly IList<HeroSkill> m_Fate = new List<HeroSkill>();
		private int m_Renown = 0;
		private int m_NextRenown = 0;
		private int m_Elevate = 0;
        private GDS_HeroBasic heroBasicGds = null;
        private GDS_HeroLevel heroLevelGds = null;
        private readonly IList<int> m_Relic = new List<int>();
		private HeroRelicSet m_RelicSet;

        public HeroInfo(long id,int elevate)
        {
            m_Id = id;
			m_Elevate = elevate;
            heroBasicGds = GameMain.GdsManager.GetGds<GDS_HeroBasic>();
            heroLevelGds = GameMain.GdsManager.GetGds<GDS_HeroLevel>();
        }

		public HeroInfo CloneHero()
		{
			HeroInfo newHero = new HeroInfo (this.Id,this.Elevate);

			newHero.Attack = this.Attack;
			newHero.Elevate = this.Elevate;
			newHero.Explored = this.Explored;

			for(int i=0;i<this.Fate.Count;i++)
			{
				newHero.Fate.Add(this.Fate[i]);
			}
			for(int i=0;i<this.Skill.Count;i++)
			{
				newHero.Skill.Add(this.Skill[i]);
			}
			for(int i=0;i<this.Relic.Count;i++)
			{
				newHero.Relic.Add(this.Relic[i]);
			}
			CalculateRelicSet();
			newHero.Level = this.Level;
			newHero.Load = this.Load;
			newHero.MaxExplore = this.MaxExplore;
			newHero.Might = this.Might;
			newHero.m_NextRenown = this.m_NextRenown;
			newHero.m_Renown = this.m_Renown;
			newHero.SleepTime = this.SleepTime;
			newHero.SleepTotal = this.SleepTotal;
			newHero.Status = this.Status;
			newHero.Type = this.Type;
			newHero.Health = this.Health;
			newHero.heroBasicGds = this.heroBasicGds;
			newHero.heroLevelGds = this.heroLevelGds;
			newHero.m_Elevate = this.m_Elevate;
			return newHero;

		}

        public long Id
        {
            get
            {
                return m_Id;
            }
        }

        public bool ISOtherHero
        {
            get;
            set;
        }

        public HeroStatus Status
        {
            get;
            set;
        }

        public int Type
        {
            get;
            set;
        }

		public int Elevate
		{
			get
			{
				return m_Elevate;
			}
			set
			{
				m_Elevate = value;
			}
		}

        public string Name
        {
            get
            {
                return Datas.getArString(heroBasicGds.GetItemById(Type).NAME);
            }
        }

        public string Head
        {
            get
            {
                return heroBasicGds.GetItemById(Type).HEAD_ICON;
            }
        }

        public string HeadBack
        {
            get
            {
                return heroBasicGds.GetItemById(Type).HEADBACKGROUND_ICON;
            }
        }

		public string HeadSmall
		{
			get
			{
				return heroBasicGds.GetItemById(Type).ICON;
			}
		}

        public int Level
        {
            get;
            set;
        }

		public int MaxLevelOfElevate(int elevate)
		{
			DataTable.HeroBasic gdsItem = heroBasicGds.GetItemById (Type);
			if (gdsItem == null)
				return 0;
			string[] elevateLevels = gdsItem.ELEVATELEVEL.Split('*');
			if(elevate <0 || elevate >= elevateLevels.Length)
			{
				return 0;
			}
			else
			{
				return _Global.INT32(elevateLevels[elevate]);
			}
		}

		public int MaxSkillLevelOfElevate(int elevate)
		{
			DataTable.HeroBasic gdsItem = heroBasicGds.GetItemById (Type);
			if (gdsItem == null)
				return 0;
			string[] skillLevels = gdsItem.MAXSKILLLEVELS.Split('*');
			if(elevate <=0 || elevate > skillLevels.Length)
			{
				return 0;
			}
			else
			{
				return _Global.INT32(skillLevels[elevate-1]);
			}
		}

		public int GetRenownOfLevel(int level)
		{
			KBN.DataTable.HeroLevel item = heroLevelGds.GetItemById (Type, level);
			return item == null ? 0 : item.RENOWN;
		}

		public int PreviousRenown
		{
			get
			{
				return Level <= 1 ? 0 : heroLevelGds.GetItemById(Type, Level - 1).RENOWN;
			}
		}

        public int Renown
        {
            get
			{
				return m_Renown - PreviousRenown;
			}
            set
			{
				m_Renown = value;
			}
        }

		public int CurTotalRenown
		{
			get
			{
				return m_Renown;
			}
		}

        public int NextRenown
        {
            get
			{
				return m_NextRenown - PreviousRenown;
			}
            set
			{
				m_NextRenown = value;
			}
        }

		public bool CanLevelup
		{
			get
			{
				bool levelGds = heroLevelGds.GetItemById(Type, Level + 1) != null;
				bool heroGds = !heroBasicGds.IsElevateLevel(Type,Level,Elevate);
				return levelGds && heroGds;
			}
		}

		public bool CanElevate
		{
			get
			{
				bool levelGds = heroLevelGds.GetItemById(Type, Level + 1) != null;
				bool heroGds = heroBasicGds.IsElevateLevel(Type,Level,Elevate);
				bool elevateOpen = GameMain.singleton.IsHeroElevateOpened();
				return levelGds	&& heroGds && elevateOpen;
			}
		}

        public int Attack
        {
            get;
            set;
        }

        public int Health
        {
            get;
            set;
        }

        public int Load
        {
            get;
            set;
        }

        public int Might
        {
            get;
            set;
        }

        public IList<HeroSkill> Skill
        {
            get
            {
                return m_Skill;
            }
        }

        public IList<HeroSkill> Fate
        {
            get
            {
                return m_Fate;
            }
        }

        public IList<int> Relic
        {
        	get
        	{
        		return m_Relic;
        	}
        }

        public string Legend
        {
            get
            {
                return Datas.getArString(heroBasicGds.GetItemById(Type).LEGEND);
            }
        }

        public string UnlockDescription
        {
            get
            {
                return Datas.getArString(heroBasicGds.GetItemById(Type).UNLOCK_DESCRIPTION);
            }
        }

        public int Explored
        {
            get;
            set;
        }

        public int MaxExplore
        {
            get;
            set;
        }

		public int SleepTotal
		{
			get;
			set;
		}

        public int SleepTime
        {
            get;
            set;
        }

        public HeroRelicSet RelicSet
        {
        	get{
        		return m_RelicSet;
        	}
        }

        public string SleepTimeDescripiton
        {
            get
            {
                if (SleepTime < 60)
                {
                    return string.Format("{0}s", SleepTime.ToString());
                }
                else if (SleepTime < 3600)
                {
                    return string.Format("{0}m{1}s", (SleepTime / 60).ToString(), (SleepTime % 60).ToString());
                }
                else if (SleepTime < 86400)
                {
                    return string.Format("{0}h{1}m", (SleepTime / 3600).ToString(), (SleepTime % 3600 / 60).ToString());
                }
                else
                {
                    return string.Format("{0}d{1}h", (SleepTime / 86400).ToString(), (SleepTime % 86400 / 3600).ToString());
                }
            }
        }

		public string[] Troop_Type
		{
		   get
		   {
               return heroBasicGds.GetItemById(Type).TROOP_TYPE.Split('*');
		   }
		}

		public  List<HeroElevateReqItem> GetElevateReqList()
		{
			List<HeroElevateReqItem> retList = new List<HeroElevateReqItem>();
			DataTable.HeroBasic gdsItem = heroBasicGds.GetItemById (Type);
			if (gdsItem == null)
				return retList;
			string[] strReqItems = gdsItem.REQUIREMENTS.Split('*');
			string[] strElevateLevels = gdsItem.ELEVATELEVEL.Split('*');
			if (strReqItems.Length != strElevateLevels.Length)
				return retList;
			for(int i=0;i<strElevateLevels.Length;i++)
			{
				if(Level == _Global.INT32(strElevateLevels[i]))
				{
					string[] reqItemsForLevel = strReqItems[i].Split(':');
					for(int j=0;j<reqItemsForLevel.Length;j++)
					{
						string[] item = reqItemsForLevel[j].Split('_');
						HeroElevateReqItem retItem = new HeroElevateReqItem();
						retItem.ID = _Global.INT32(item[0]);
						retItem.ReqNum = _Global.INT32(item[1]);
						retItem.CurNum = MyItems.singleton.countForItem(retItem.ID);
						retList.Add(retItem);
					}
				}
			}
			return retList;
		}

		public void SubtractItemForElevate(int elevate)
		{
			List<HeroElevateReqItem> retList = new List<HeroElevateReqItem>();
			DataTable.HeroBasic gdsItem = heroBasicGds.GetItemById (Type);
			if (gdsItem == null)
				return;
			string[] strReqItems = gdsItem.REQUIREMENTS.Split('*');
			if(elevate <= 0 || elevate > strReqItems.Length)
				return;
			string[] reqItemsForLevel = strReqItems[elevate-1].Split(':');
			for(int j=0;j<reqItemsForLevel.Length;j++)
			{
				string[] item = reqItemsForLevel[j].Split('_');
				MyItems.singleton.subtractItem(_Global.INT32(item[0]),_Global.INT32(item[1]));
			}
		}

		public HeroSkill ElevateNewSkill()
		{
			DataTable.HeroBasic gdsItem = heroBasicGds.GetItemById (Type);
			if (gdsItem == null)
				return null;
			string[] newSkills = gdsItem.NEWSKILLIDS.Split ('*');
			if(Elevate>=0 && Elevate < newSkills.Length && !String.IsNullOrEmpty(newSkills[Elevate]))
			{
				return new HeroSkill(_Global.INT32(newSkills[Elevate]),1); 
			}
			return null;
		}

		public HeroSkill ElevateNewFate()
		{
			DataTable.HeroBasic gdsItem = heroBasicGds.GetItemById (Type);
			if (gdsItem == null)
				return null;
			string[] newFates = gdsItem.NEWFATEIDS.Split ('*');
			if(Elevate>=0 && Elevate < newFates.Length && !String.IsNullOrEmpty(newFates[Elevate]))
			{
				return new HeroSkill(_Global.INT32(newFates[Elevate]),1); 
			}
			return null;
		}

		public int ElevateMaxSkillLevel(int elevate)
		{
			DataTable.HeroBasic gdsItem = heroBasicGds.GetItemById (Type);
			if (gdsItem == null)
				return 0;
			string[] maxSkillLevels = gdsItem.MAXSKILLLEVELS.Split ('*');
			if(elevate>0 && elevate <= maxSkillLevels.Length && !String.IsNullOrEmpty(maxSkillLevels[elevate-1]))
			{
				return _Global.INT32(maxSkillLevels[elevate-1]); 
			}
			return 1;
		}

		public void CalculateLevelAndRenown()
		{
			int startLevel = Level;
			KBN.DataTable.HeroLevel item = heroLevelGds.GetItemById (Type, startLevel);
			while( item!=null && CurTotalRenown > item.RENOWN)
			{
				item = heroLevelGds.GetItemById (Type, ++startLevel);
			}
			Level = startLevel;

			int maxLevelOfElevete = MaxLevelOfElevate (Elevate);
			Level = Level > maxLevelOfElevete ? maxLevelOfElevete : Level;
			m_NextRenown = heroLevelGds.GetItemById (Type, Level).RENOWN;

		}

		public long CalculateMight(int level)
		{
			KBN.DataTable.HeroLevel item = heroLevelGds.GetItemById (Type, level);
			long attack = _Global.INT64 (item.ATTACK);
			long life = _Global.INT64(item.LIFE);
			long wise = _Global.INT64(item.TROOP_NUM);
			return ((attack + life + wise) * 20 + 600);
		}

		public long CalculateMight(int level, int type)
		{
			KBN.DataTable.HeroLevel item = heroLevelGds.GetItemById (type, level);
			long attack = _Global.INT64 (item.ATTACK);
			long life = _Global.INT64(item.LIFE);
			long wise = _Global.INT64(item.TROOP_NUM);
			return ((attack + life + wise) * 20 + 600);
		}

		private Dictionary<string, float> map;
		public int AllDeputySkillCount
		{
			get
			{
				return map.Count;
			}		
		}

		public String GetAllDeputySkillInfo()
		{
			map = new Dictionary<string, float>();
			GDS_RelicSkill relicSkillGDS = GameMain.GdsManager.GetGds<GDS_RelicSkill>();
			for(int i = 0; i < m_Relic.Count; i++)
			{
				int relicId = m_Relic[i];
				if(relicId != 0)
				{
					HeroRelicInfo info = HeroRelicManager.instance().GetHeroRelicInfo(relicId);
					if(info.DeputySkill1 != 0)
					{
						string desc1 = relicSkillGDS.GetItemById(info.DeputySkill1).DESC;
						if(map.ContainsKey(desc1))
						{
							map[desc1] += info.DeputySkill1Value;
						}
						else
						{
							map.Add(desc1, info.DeputySkill1Value);
						}
					}

					if(info.DeputySkill2 != 0)
					{
						string desc2 = relicSkillGDS.GetItemById(info.DeputySkill2).DESC;
						if(map.ContainsKey(desc2))
						{
							map[desc2] += info.DeputySkill2Value;
						}
						else
						{
							map.Add(desc2, info.DeputySkill2Value);
						}
					}
					
					if(info.DeputySkill3 != 0)
					{
						string desc3 = relicSkillGDS.GetItemById(info.DeputySkill3).DESC;
						if(map.ContainsKey(desc3))
						{
							map[desc3] += info.DeputySkill3Value;
						}
						else
						{
							map.Add(desc3, info.DeputySkill3Value);
						}
					}
				}			
			}

			
			string allDeputySkillInfo = string.Empty;
			foreach (var item in map)
			{
				//_Global.LogWarning("SkillId : " + item.Key);
				//string desc = relicSkillGDS.GetItemById(item.Key).DESC;
				//_Global.LogWarning("Desc : " + desc);
				string txtDesc =  string.Format(Datas.getArString(item.Key), item.Value);
				allDeputySkillInfo += txtDesc + "\n";
			}

			return allDeputySkillInfo;
		}
		
		public HeroRelicSet CalculateRelicSet()
		{
			m_RelicSet = new HeroRelicSet();
			Dictionary<int, int> dic = new Dictionary<int, int>();
			for(int i = 0; i < m_Relic.Count; i++)
			{
				int relicId = m_Relic[i];
				if(relicId != 0)
				{
					HeroRelicInfo info = HeroRelicManager.instance().GetHeroRelicInfo(relicId);
					if(dic.ContainsKey(info.RelicSetId))
					{
						dic[info.RelicSetId]++;
					}
					else
					{
						dic.Add(info.RelicSetId, 1);
					}
				}			
			}

			GDS_RelicSet relicSetGDS = GameMain.GdsManager.GetGds<GDS_RelicSet>();
			int index = 0;
			foreach (var item in dic)
			{
				if(item.Value == 4)
				{
					m_RelicSet.setType = RelicSetType.One_Foue_Effect;
					m_RelicSet.OneSetId = item.Key;
					m_RelicSet.OneSetValue = relicSetGDS.GetTwoSetValue(m_RelicSet.OneSetId);
					m_RelicSet.TwoSetId = item.Key;
					m_RelicSet.TwoSetValue = relicSetGDS.GetFourSetValue(m_RelicSet.TwoSetId, Level, Attack, Health, Load);
				}
				else if(item.Value == 3)
				{
					m_RelicSet.setType = RelicSetType.One_Two_Effect;
					m_RelicSet.OneSetId = item.Key;
					m_RelicSet.OneSetValue = relicSetGDS.GetTwoSetValue(m_RelicSet.OneSetId);
				}	
				else if(item.Value == 2)
				{
					if(m_RelicSet.OneSetId == 0)
					{
						m_RelicSet.setType = RelicSetType.One_Two_Effect;
						m_RelicSet.OneSetId = item.Key;
						m_RelicSet.OneSetValue = relicSetGDS.GetTwoSetValue(m_RelicSet.OneSetId);
					}

					if(m_RelicSet.OneSetId != 0 && m_RelicSet.OneSetId != item.Key)
					{
						m_RelicSet.setType = RelicSetType.Two_Two_Effect;
						m_RelicSet.TwoSetId = item.Key;
						m_RelicSet.TwoSetValue = relicSetGDS.GetTwoSetValue(m_RelicSet.TwoSetId);
					}
				}			
			}

			return m_RelicSet;
		}

		public void RefreshHeroSkillByHeroRelic()
		{
			for(int i = 0; i < Skill.Count; i ++)
			{
				Skill[i].RefreshEffectParam();
			}

			for(int i = 0; i < Fate.Count; i ++)
			{
				Fate[i].RefreshEffectParam();
			}

			Might = 600 + (Level + Attack + Health) * 20;
		}
    }
}
