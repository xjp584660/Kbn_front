using System.Collections.Generic;
using System;
namespace KBN
{
	public class HeroRelicInfo
	{
		private GDS_Relic relicGDS = null;
		private GDS_RelicSkill relicSkillGDS = null;
		private GDS_RelicSet relicSetGDS = null;
		private GDS_RelicUpgrade relicUpgradeGDS = null;

		public HeroRelicInfo(HashObject relic)
		{
			relicGDS = GameMain.GdsManager.GetGds<GDS_Relic>();
			relicSkillGDS = GameMain.GdsManager.GetGds<GDS_RelicSkill>();
			relicSetGDS = GameMain.GdsManager.GetGds<GDS_RelicSet>();
			relicUpgradeGDS = GameMain.GdsManager.GetGds<GDS_RelicUpgrade>();

			RelicId = _Global.INT32(relic["relicId"]);
			RelicTypeId = _Global.INT32(relic["relicTypeId"]);
			UserId = _Global.INT32(relic["userId"]);
			UserHeroId = _Global.INT32(relic["userHeroId"]);
			Level = _Global.INT32(relic["level"]);
			LockSkill = _Global.INT32(relic["lockSkill"]);
			TotalExp = _Global.INT32(relic["exp"]);
			MainSkill = _Global.INT32(relic["mainSkill"]);
			DeputySkill1 = _Global.INT32(relic["deputySkill1"]);
			DeputySkill1Level = _Global.INT32(relic["deputySkill1Level"]);
			DeputySkill2 = _Global.INT32(relic["deputySkill2"]);
			DeputySkill2Level = _Global.INT32(relic["deputySkill2Level"]);
			DeputySkill3 = _Global.INT32(relic["deputySkill3"]);
			DeputySkill3Level = _Global.INT32(relic["deputySkill3Level"]);
			Tier = _Global.INT32(relic["tier"]);
			Status = _Global.INT32(relic["status"]);
		}

		public int RelicId
		{
			get;
			set;
		}

		public int RelicTypeId
		{
			get;
			set;
		}

		public int UserId
		{
			get;
			set;
		}

		public int UserHeroId
		{
			get;
			set;
		}

		public int Level
		{
			get;
			set;
		}

		public int MaxLevel
		{
			get{
				return relicUpgradeGDS.getRelicUpgradeMaxLevel(RelicTypeId);
			}
		}

		// 是否可以继续选择圣物升级
		public bool IsCanSelectUpgradeRelic()
		{
			return Level < MaxLevel;
		}

		public int LockSkill					// 解锁几个副属性
		{
			get;
			set;
		}

		// 当前的经验
		public int CurExp
		{
			get
			{
				if(Level == 1)
				{
					return TotalExp;
				}
				else
				{
					int tempExp = TotalExp;
					int tempLevel = Level;
					while(tempLevel > 1)
					{
						tempLevel --;
						tempExp -= UpgradeNeedExp(tempLevel);
					}
					return tempExp;
				}
			}
		}

		// 总经验
		public int TotalExp
		{
			get;
			set;
		}

		// 升级需要经验
		public int UpgradeNeedExp(int level)
		{
			int tempLevel = level + 1 >= MaxLevel ? MaxLevel : level + 1;
			return relicUpgradeGDS.GetItemById(RelicTypeId, tempLevel).EXP;
		}

		// 作为升级材料的经验值
		public int ProvideExp
		{
			get{
				return relicUpgradeGDS.GetItemById(RelicTypeId, Level).PROVIDE_EXP;
			}
		}

		// 是否可以升级
		public bool IsCanUpgrade(List<HeroRelicInfo> relicIdList)
		{
			if(relicIdList.Count == 0)
			{
				return false;
			}
			if(Level < MaxLevel)
			{
				int tempExp = UpgradeNeedExp(Level) - CurExp;
				for(int i = 0; i < relicIdList.Count; i ++)
				{
					tempExp -= relicUpgradeGDS.GetItemById(relicIdList[i].RelicTypeId, relicIdList[i].Level).PROVIDE_EXP;
				}

				return tempExp <= 0;
			}
			else
			{
				return false;
			}
		}

		// 可以升到的级数
		public int GetCanUpgradedLevel(List<HeroRelicInfo> relicIdList)
		{
			if(relicIdList.Count == 0)
			{
				return Level;
			}
			int exptemp = 0;
			for(int i = 0; i < relicIdList.Count; i ++)
			{
				exptemp += relicIdList[i].ProvideExp;
			}

			List<int> expList = relicUpgradeGDS.getExpList(RelicTypeId);
			for(int i = expList.Count - 1; i >=1 ; i --)
			{
				if(exptemp + TotalExp < expList[i] && exptemp + TotalExp >= expList[i - 1])
				{
					return i;
				}
			}

			return MaxLevel;
		}

		// 选中的经验
		public int GetSelectTotalExp(List<HeroRelicInfo> relicIdList)
		{
			int exptemp = 0;
			for(int i = 0; i < relicIdList.Count; i ++)
			{
				exptemp += relicIdList[i].ProvideExp;
			}

			return exptemp;
		}

		// 当前级数所需的总经验
		public int GetCurLevelTotalExp(int curLevel)
		{
			int level = curLevel > MaxLevel ? MaxLevel : curLevel;
			List<int> expList = relicUpgradeGDS.getExpList(RelicTypeId);
			
			return expList[level - 1];
		}

		public int MainSkill
		{
			get;
			set;
		}

		public float MainSkillValue
		{
			get{
				return relicUpgradeGDS.getMainSkillValue(RelicTypeId, Level, MainSkill);
			}
		}

		public string MainSkillDesc
		{
			get
			{
				string skillName = string.Format("relicMainDesc.r{0}", MainSkill);
				return string.Format(Datas.getArString(skillName), MainSkillValue);
			}
		}

		public int DeputySkill1
		{
			get;
			set;
		}

		public int DeputySkill1Level
		{
			get;
			set;
		}

		public float DeputySkill1Value
		{
			get
			{
				return relicSkillGDS.getDeputySkillValue(DeputySkill1, DeputySkill1Level);
			}
		}

		public string DeputySkill1Desc
		{
			get
			{
				string desc = relicSkillGDS.GetItemById(DeputySkill1).DESC;
				return string.Format(Datas.getArString(desc), DeputySkill1Value);
			}
		}

		public int DeputySkill2
		{
			get;
			set;
		}

		public int DeputySkill2Level
		{
			get;
			set;
		}

		public float DeputySkill2Value
		{
			get
			{
				return relicSkillGDS.getDeputySkillValue(DeputySkill2, DeputySkill2Level);
			}
		}

		public string DeputySkill2Desc
		{
			get
			{
				string desc = relicSkillGDS.GetItemById(DeputySkill2).DESC;
				return string.Format(Datas.getArString(desc), DeputySkill2Value);
			}
		}

		public int DeputySkill3
		{
			get;
			set;
		}

		public int DeputySkill3Level
		{
			get;
			set;
		}

		public float DeputySkill3Value
		{
			get
			{
				return relicSkillGDS.getDeputySkillValue(DeputySkill3, DeputySkill3Level);
			}
		}

		public string DeputySkill3Desc
		{
			get
			{
				string desc = relicSkillGDS.GetItemById(DeputySkill3).DESC;
				return string.Format(Datas.getArString(desc), DeputySkill3Value);
			}
		}

		public int Tier						// 星级
		{
			get;
			set;
		}

		public int Status                     // 1 正常 2 锁住
		{
			get;
			set;
		}

		// 圣物图标
		public string IconName
		{
			get{
				return relicGDS.getIconName(RelicTypeId);
			}
		}

		// 圣物名字
		public string RelicName
		{
			get
			{
				string name = "relicName.r" + RelicTypeId;
				return Datas.getArString(name);
			}
		}

		// 套装id
		public int RelicSetId
		{
			get
			{
				return relicGDS.GetItemById(RelicTypeId).SET_ID;
			}
		}

		public bool IsSelected
		{
			get;
			set;
		}

		public float TwoSetValue
		{
			get{
				return relicSetGDS.GetTwoSetValue(RelicSetId);
			}
		}
	}
}
