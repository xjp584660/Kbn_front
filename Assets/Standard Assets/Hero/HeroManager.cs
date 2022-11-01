using System;
using System.Collections;
using System.Collections.Generic;
using HeroLevelUpItems = KBN.DataTable.HeroLevelUpItems;

namespace KBN
{
    public abstract partial class HeroManager
    {
        private long m_LastUpdateTime = 0;
        private bool m_CheckResult = false;
        private bool m_HeroEnable = false;
        private bool m_SendInitRequestFlag = false;
		private bool m_ReceiveInitResponseFlag = false;
        private IDictionary<HeroSkillAffectedProperty, HeroSkillAffectedRatioFunc> m_HeroSkillAffectedRatioFunc = new Dictionary<HeroSkillAffectedProperty, HeroSkillAffectedRatioFunc>();
        protected static HeroManager m_Instance = null;
        private QueueItem m_HeroSpeedUpData = null;

		private readonly int[] SkillEffectId_Percent = {30001, 30002, 20005, 20006, 20007, 20008, 20009, 20010, 20013, 20015, 20014, 20001, 20002, 20004, 20003, 20011, 20012, 20016};

		public bool IsPercentEffect(int effectId)
		{
			foreach (int id in SkillEffectId_Percent) 
			{
				if(id == effectId)
				{
					return true;
				}
			}
			return false;
		}

        protected HeroManager()
        {
            m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.Food] = HeroSkillAffectedFoodRatio;
            m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.Wood] = HeroSkillAffectedWoodRatio;
            m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.Stone] = HeroSkillAffectedStoneRatio;
            m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.Ore] = HeroSkillAffectedOreRatio;
			m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.Protection] = HeroSkillAffectedProtectionRatio;
			m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.Build] = HeroSkillAffectedBuildRatio;
			m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.Supply] = HeroSkillAffectedSupplyRatio;
			m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.Horse] = HeroSkillAffectedHorseRatio;
			m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.Ground] = HeroSkillAffectedGroundRatio;
			m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.Artillery] = HeroSkillAffectedArtilleryRatio;
            m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.Load] = HeroSkillAffectedLoadRatio;
			m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.GroundSpeed] = HeroSkillAffectedGroundSpeedRatio;
			m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.HorseSpeed] = HeroSkillAffectedHorseSpeedRatio;
			m_HeroSkillAffectedRatioFunc[HeroSkillAffectedProperty.Fast] = HeroSkillAffectedFastRatio;


            m_LastUpdateTime = GameMain.unixtime();
            int cityCount = GetCityCount();
            for (int i = 0; i < cityCount; i++)
            {
                m_HeroSlotLists.Add(new List<HeroSlot>());
            }
        }

        public static void Free()
        {
			m_Instance = null;
        }

        public static int GetHeroCategory(HeroInfo heroInfo)
        {
            return GetHeroCategory(heroInfo.Type);
        }

        public static int GetHeroCategory(int heroType)
        {
            return heroType / 100;
        }

        public void Update()
        {
            if (!m_CheckResult)
            {
                return;
            }

            long currentTime = GameMain.unixtime();
            int deltaTime = (int)(currentTime - m_LastUpdateTime);
            if (deltaTime < 1)
            {
                return;
            }

            m_LastUpdateTime = currentTime;

            // HeroSlot Update
            int playerLevel = GetPlayerLevel();
            foreach (IList<HeroSlot> heroSlotList in m_HeroSlotLists)
            {
                foreach (HeroSlot heroSlot in heroSlotList)
                {
                    if (heroSlot.Status != HeroSlotStatus.Locked)
                    {
                        continue;
                    }

                    if (playerLevel >= heroSlot.ActiveLevel)
                    {
                        heroSlot.Status = HeroSlotStatus.Unassigned;
                    }
                }
            }

            // HeroInfo Update
            foreach (HeroInfo hero in m_HeroList.Values)
            {
                hero.SleepTime -= deltaTime;
                if (hero.SleepTime <= 0 && hero.Status == HeroStatus.Sleeping)
                {
                    hero.SleepTime = 0;
                    hero.Status = HeroStatus.Assigned;
                    MenuMgr.instance.SendNotification(Constant.Hero.HeroStatusUpdated);
                }
            }
        }

        public bool Check(bool tryAddBuilding)
        {
            if (m_HeroEnable && GetPlayerLevel() >= GetHeroHouseOpenLevel())
            {
                m_CheckResult = true;

                if (tryAddBuilding)
                {
					TryAddBuilding();
                }

                if (!m_SendInitRequestFlag)
                {
                    RequestHeroHouseList(GetCurrentCityId());
                    m_SendInitRequestFlag = true;
					m_ReceiveInitResponseFlag = false;
                }
            }
            else
            {
                m_CheckResult = false;
            }

            return m_CheckResult;
        }

		public bool Ready()
		{
			return m_SendInitRequestFlag && m_ReceiveInitResponseFlag;
		}

        public void SetHeroEnable(bool enable)
        {
            if (m_HeroEnable != enable)
            {
                m_HeroEnable = enable;
                Check(true);
            }
        }

		public bool GetHeroEnable()
		{
			return m_HeroEnable;
		}

		public int GetHeroHouseOpenLevel()
		{
            var gds = GameMain.GdsManager.GetGds<GDS_HeroCommon>();
			return gds.GetItemById(1) == null ? int.MaxValue : gds.GetItemById(1).PLAYER_LEVEL;
		}

        private static bool HeroCanSeeLevelUpItem(HeroInfo heroInfo, InventoryInfo item)
        {
            var levelUpItemDict = GameMain.GdsManager.GetGds<GDS_HeroLevelUpItems>().GetItemDictionary();
            var itemIdStr = item.id.ToString();
            if (!levelUpItemDict.ContainsKey(itemIdStr))
            {
                return false;
            }

            var gdsData = levelUpItemDict[itemIdStr] as HeroLevelUpItems;
            var heroCategory = GetHeroCategory(heroInfo);
            if (gdsData.heroType > 0 && gdsData.heroType != heroCategory)
            {
                return false;
            }

            if (heroInfo.Level >= gdsData.levelLimit)
            {
                return false;
            }

            return true;
        }

        public static bool HeroCanUseLevelUpItem(HeroInfo heroInfo, InventoryInfo item)
        {
            if (!HeroCanSeeLevelUpItem(heroInfo, item))
            {
                return false;
            }

            var levelUpItemDict = GameMain.GdsManager.GetGds<GDS_HeroLevelUpItems>().GetItemDictionary();
            var itemIdStr = item.id.ToString();
            if (!levelUpItemDict.ContainsKey(itemIdStr))
            {
                return false;
            }
            
            var gdsData = levelUpItemDict[itemIdStr] as HeroLevelUpItems;
            var nextElevateLevel = heroInfo.MaxLevelOfElevate(heroInfo.Elevate);
            if (nextElevateLevel > 0 && gdsData.levelLimit > nextElevateLevel)
            {
                return false;
            }

            return true;
        }

        protected void SubtractItem(int itemId)
        {
            MyItems.singleton.subtractItem(itemId);
        }

        protected IEnumerable<InventoryInfo> GetHeroItems(HeroInfo heroInfo, bool includeGenericItems)
        {
			foreach (var product in MyItems.singleton.GetList(MyItems.Category.Hero))
            {
                if (product.id < Constant.Hero.HeroGiftItemFrom || product.id > Constant.Hero.HeroGiftItemTo)
                {
                    continue;
                }
                
                int productType = product.id / 10 % 1000;
                
                // Renown items
                if (product.id < Constant.Hero.HeroLevelUpItemFrom
                    && !(includeGenericItems && productType == 100)
                    && productType != heroInfo.Type)
                {
                    continue;
                }
                
                // Level-up items
                if (product.id >= Constant.Hero.HeroLevelUpItemFrom && !HeroCanSeeLevelUpItem(heroInfo, product))
                {
                    continue;
                }
                
                yield return product;
            }
        }

        public List<InventoryInfo> GetHeroItemList(HeroInfo heroInfo)
        {
            var itemList = new List<InventoryInfo>();
            itemList.AddRange(GetHeroItems(heroInfo, true));
            var gds = GameMain.GdsManager.GetGds<GDS_HeroLevelUpItems>();
            itemList.Sort((a, b) => {
                // Both are level-up items
                if (a.id >= Constant.Hero.HeroLevelUpItemFrom && b.id >= Constant.Hero.HeroLevelUpItemFrom)
                {
                    // Type 2 items will display above Type 1.
                    int aType = gds.GetItemById(a.id).itemType;
                    int bType = gds.GetItemById(b.id).itemType;

                    if (aType != bType)
                    {
                        return bType.CompareTo(aType);
                    }
                }
                return a.id.CompareTo(b.id);
            });
            return itemList;
        }

        public bool GetHeroGiftFlash(HeroInfo heroInfo)
        {
            foreach (var product in GetHeroItems(heroInfo, false))
            {
                return true;
            }

            return false;
        }

        public QueueItem GetLastHeroSpeedUpData()
        {
            return m_HeroSpeedUpData;
        }

        public QueueItem GetNewHeroSpeedUpData(HeroInfo heroInfo)
        {
            if (heroInfo == null || heroInfo.Status != HeroStatus.Sleeping)
            {
                return null;
            }
            
            m_HeroSpeedUpData = new QueueItem();
            m_HeroSpeedUpData.id = (int) heroInfo.Id;
            m_HeroSpeedUpData.itemType = 0;
            m_HeroSpeedUpData.itemName = String.Empty;
            m_HeroSpeedUpData.cityId = 0;
            m_HeroSpeedUpData.endTime = GameMain.unixtime() + heroInfo.SleepTime;
            m_HeroSpeedUpData.startTime = m_HeroSpeedUpData.endTime - heroInfo.SleepTotal;
            m_HeroSpeedUpData.needed = heroInfo.SleepTime;
            m_HeroSpeedUpData.timeRemaining = heroInfo.SleepTime;
            m_HeroSpeedUpData.classType = QueueType.Hero;
            m_HeroSpeedUpData.level = 0;
            m_HeroSpeedUpData.titleStr = String.Empty;
            
            return m_HeroSpeedUpData;
        }

        protected int GetPlayerLevel()
        {
            return GameMain.singleton.getPlayerLevel();
        }

        protected int GetCityCount()
        {
            return CityQueue.instance().MaxReleasedCityCnt;
        }

        protected int GetCurrentCityId()
        {
            return GameMain.singleton.getCurCityId();
        }

        protected abstract void TryAddBuilding();

        private void Oops(string errorMessage)
        {
            MenuMgr.instance.SendNotification(Constant.Hero.HeroErrorMessage, errorMessage);
            ErrorMgr.singleton.PushError("", errorMessage, true, Datas.getArString("Common.OK"), null);
            Free();
        }

        public static HeroManager Instance
        {
            get
            {
                return m_Instance;
            }
        }
    }
}
