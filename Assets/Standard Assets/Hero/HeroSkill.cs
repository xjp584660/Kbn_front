using System;
using System.Collections.Generic;

namespace KBN
{
	public class HeroSkillLevelUpReqItem
	{
		public short Type = 0; // 0:hero level , 1: item num
		public string IconName = null;
		public string Title = null;
		public string Desc = null;
		public long ReqNum = 0;
		public long CurNum = 0;
		public bool bEnough = false;
	
	}
    public class HeroSkill
    {
        private int m_Type = 0;
		private int m_Level = 0;

        public HeroSkill(int type,int level)
        {
            m_Type = type;
			m_Level = level;
        }

        public int Type
        {
            get
            {
                return m_Type;
            }
        }

		public int Level
		{
			get
			{
				return m_Level;
			}
			set
			{
				m_Level = value;
			}
		}

		public int NextLevel
		{
			get
			{
				if(IsMaxLevel) return Level;
				else return Level + 1;
			}
		}

		public bool IsMaxLevel
		{
			get
			{
                var gds = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>();
				return (gds.GetItemById(Type,Level) != null) 
					&& (gds.GetItemById(Type,Level+1) == null);
			}
		}

        public bool Actived
        {
            get;
            set;
        }

        public string Name
        {
            get
            {
                return Datas.getArString(GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(Type).NAME);
            }
        }

        public string Description
        {
            get
            {
                object[] param = null;
                if (m_EffectParam.Count > 0)
                {
                    param = new object[m_EffectParam.Count];
                    Array.Copy((m_EffectParam as List<float>).ToArray(), param, m_EffectParam.Count);
                }
                else
                {
                    param = new object[] { "???", "???", "???", "???", "???", "???", "???", "???", "???", "???" };
                }

                return string.Format(Datas.getArString(GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(Type).DESCRIPTION), param);
            }
        }

		public string GetNextLevelDescription()
		{
			DataTable.HeroSkillLevel gdsSkillLevelItem = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>().GetItemById(Type,Level+1);
			DataTable.HeroSkillFate gdsSkillFateItem = GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(Type);
			if(gdsSkillLevelItem == null || gdsSkillFateItem == null) return "";

			string[] skillParams = gdsSkillLevelItem.PARAMS.Split('_');
			IList<float> effectParams = new List<float>();
			foreach (string effectString in skillParams)
			{
				effectParams.Add(float.Parse(effectString));
			}
			//if(effectParams.Count != 5) return "";
			HeroInfo heroInfo = HeroManager.Instance.GetHeroInfoByType (Type / 100);
			if(heroInfo == null) return "";

			// if(Type == 10603)
			// {
			// 	float baseDamage = (effectParams [3] + effectParams [4] * heroInfo.Attack + effectParams [5] * heroInfo.Health + effectParams [6] * heroInfo.Load) / 10000f;
			// 	float round = effectParams [0];
			// 	float extraFactor = effectParams [1];
			// 	return string.Format(Datas.getArString(GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(Type).DESCRIPTION), baseDamage, round, extraFactor);
			// }
			// else
			// {
				float totalEffect = effectParams [0] + effectParams [1] * heroInfo.Level + effectParams [2] * heroInfo.Attack + effectParams [3] * heroInfo.Health + effectParams [4] * heroInfo.Load;
				if(HeroManager.Instance.IsPercentEffect(gdsSkillFateItem.EFFECT))
				{
					totalEffect = totalEffect * 0.01f;
					totalEffect = (float)System.Math.Round(totalEffect*100)/100;
				}
				
				return string.Format(Datas.getArString(GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(Type).DESCRIPTION), totalEffect);
			//}
		}
        public HeroSkillConditionType ConditionType
        {
            get;
            set;
        }

        public int ConditionParam
        {
            get;
            set;
        }

        public string ActiveMessage
        {
            get
            {
                switch (ConditionType)
                {
                    case HeroSkillConditionType.Level:
                        return string.Format(Datas.getArString("HeroHouse.Detail_SkillRequire"), ConditionParam);
                    case HeroSkillConditionType.Hero:
					return GameMain.GdsManager.GetGds<GDS_HeroBasic>().GetItemById(ConditionParam) == null ? Datas.getArString("HeroHouse.HeroNotExist") : string.Format(Datas.getArString("HeroHouse.Detail_FateRequire"), Datas.getArString(GameMain.GdsManager.GetGds<GDS_HeroBasic>().GetItemById(ConditionParam).NAME));
                    case HeroSkillConditionType.Gear:
                        return string.Format(Datas.getArString("HeroHouse.Detail_GearRequire"), "Undefined");
                }

                return string.Empty;
            }
        }

        public long EffectId
        {
            get;
            set;
        }

        private readonly IList<float> m_EffectParam = new List<float>();
        public IList<float> EffectParam
        {
            get
            {
                return m_EffectParam;
            }
        }

		public int GetEffectIdFromGDS()
		{
			return GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(Type).EFFECT;
		}

        
        public bool AffectByLevel
        {
            get
            {
                string[] param = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>().GetItemById(Type,Level).PARAMS.Split('_');
                return param[1] != "0";
            }
        }

        public bool AffectByAttack
        {
            get
            {
                string[] param = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>().GetItemById(Type,Level).PARAMS.Split('_');
                return param[2] != "0";
            }
        }

        public bool AffectByHealth
        {
            get
            {
				string[] param = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>().GetItemById(Type,Level).PARAMS.Split('_');
                return param[3] != "0";
            }
        }

        public bool AffectByLoad
        {
            get
            {
				string[] param = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>().GetItemById(Type,Level).PARAMS.Split('_');
                return param[4] != "0";
            }
        }

		public bool FillCondition()
		{
			DataTable.HeroSkillFate dataItem = GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(Type); 
			if(dataItem != null)
			{
				if(_Global.INT32(dataItem.SKILL_RENOWN) != 0)
				{
					ConditionType = HeroSkillConditionType.Level;
					ConditionParam = _Global.INT32(dataItem.SKILL_RENOWN);
				}
				else if(_Global.INT32(dataItem.FATE_HERO_IDS) != 0)
				{
					ConditionType = HeroSkillConditionType.Hero;
					ConditionParam = _Global.INT32(dataItem.FATE_HERO_IDS);
				}
				else if(_Global.INT32(dataItem.FATE_EQUIP_IDS) != 0)
				{
					ConditionType = HeroSkillConditionType.Gear;
					ConditionParam = _Global.INT32(dataItem.FATE_EQUIP_IDS);
				}
				else
				{
					ConditionType = HeroSkillConditionType.Actived;
					ConditionParam = 0;
				}
				return true;
			}
			else
			{
				return false;
			}
		}

		public bool ShowTips
		{
			get
			{
				return GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(Type).TIPS == 1;
			}
		}
        
		private int skillId = 0;
		public int SkillId
		{
			get
			{
				if(skillId == 0)
				{
					skillId = GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(Type).ID;
				}
				return skillId;
			}
		}

		public List<HeroSkillLevelUpReqItem> GetlevelUpReqList()
		{
			List<HeroSkillLevelUpReqItem> reqList = new List<HeroSkillLevelUpReqItem> ();
			DataTable.HeroSkillLevel gdsItem = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>().GetItemById(Type,Level+1);
			if(gdsItem == null)
				return reqList;
			HeroSkillLevelUpReqItem skillLevelUpItem = new HeroSkillLevelUpReqItem ();

			skillLevelUpItem.ReqNum = _Global.INT32(gdsItem.REQUIREHEROLV);
			HeroInfo heroInfo = HeroManager.Instance.GetHeroInfoByType (Type / 100);
			skillLevelUpItem.Type = Constant.Hero.SkillLevelUp_ReqType_Hero;
			skillLevelUpItem.CurNum = heroInfo.Level;
			skillLevelUpItem.IconName = "heroicon_" + heroInfo.Type;
			skillLevelUpItem.Title = heroInfo.Name;
			skillLevelUpItem.bEnough = skillLevelUpItem.CurNum >= skillLevelUpItem.ReqNum;
			skillLevelUpItem.Desc = string.Format(Datas.getArString ("Hero.Upgrade_Requirement1"),skillLevelUpItem.ReqNum);
			reqList.Add (skillLevelUpItem);

			string[] strReqs = gdsItem.REQUIREMENTS.Split(':');
			for(int i=0;i<strReqs.Length;i++)
			{
				string [] itemIdAndNum = strReqs[i].Split('_');
				skillLevelUpItem = new HeroSkillLevelUpReqItem ();
				skillLevelUpItem.Type = Constant.Hero.SkillLevelUp_ReqType_Item;
				int ItemId = _Global.INT32(itemIdAndNum[0]);
				skillLevelUpItem.Title = Datas.getArString("itemName."+"i" + ItemId);
				skillLevelUpItem.Desc = Datas.getArString("itemDesc."+"i" + ItemId);
				skillLevelUpItem.IconName = TextureMgr.instance().LoadTileNameOfItem(ItemId);
				skillLevelUpItem.ReqNum = _Global.INT32(itemIdAndNum[1]);
				skillLevelUpItem.CurNum = MyItems.singleton.countForItem(ItemId);
				skillLevelUpItem.bEnough = skillLevelUpItem.CurNum >= skillLevelUpItem.ReqNum;
				reqList.Add(skillLevelUpItem);
			}

			return reqList;
		}

		public void SubtractItemForLevelUp()
		{
			DataTable.HeroSkillLevel gdsItem = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>().GetItemById(Type,Level+1);
			if(gdsItem != null)
			{
				string[] strReqs = gdsItem.REQUIREMENTS.Split(':');
				for(int i=0;i<strReqs.Length;i++)
				{
					string [] itemIdAndNum = strReqs[i].Split('_');
					MyItems.singleton.subtractItem(_Global.INT32(itemIdAndNum[0]),_Global.INT32(itemIdAndNum[1]));
				}
			}
		}

		public void RefreshEffectParam()
		{
			HeroInfo hero = HeroManager.Instance.GetHeroInfoByType(Type/100);
			DataTable.HeroSkillLevel gdsSkillLevelItem = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>().GetItemById(Type,Level); 
			DataTable.HeroSkillFate gdsSkillItem = GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(Type); 

			string[] skillParams = gdsSkillLevelItem.PARAMS.Split('_');
			
			IList<float> effectParams = new List<float>();
			foreach (string effectString in skillParams)
			{
				effectParams.Add(float.Parse(effectString));
			}
			HeroInfo heroInfo = HeroManager.Instance.GetHeroInfoByType (Type / 100);

			// if(Type == 10603)
			// {
			// 	float baseDamage = (effectParams [3] + effectParams [4] * heroInfo.Attack + effectParams [5] * heroInfo.Health + effectParams [6] * heroInfo.Load) / 10000f;
			// 	float round = effectParams [0];
			// 	float extraFactor = effectParams [1];
			// 	EffectParam.Clear ();
			// 	EffectParam.Add(baseDamage);
			// 	EffectParam.Add(round);
			// 	EffectParam.Add(extraFactor);
			// }
			// else
			
				float totalEffect = effectParams [0] + effectParams [1] * heroInfo.Level + effectParams [2] * heroInfo.Attack + effectParams [3] * heroInfo.Health + effectParams [4] * heroInfo.Load;
				if(HeroManager.Instance.IsPercentEffect(gdsSkillItem.EFFECT))
				{
					totalEffect = totalEffect * 0.01f;
					totalEffect = (float)Math.Round(totalEffect*100)/100;
				}
				EffectParam.Clear ();
				EffectParam.Add(totalEffect);
	        // }
		}
    }
}
