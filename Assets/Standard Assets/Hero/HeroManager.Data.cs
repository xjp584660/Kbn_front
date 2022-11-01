using System.Collections;
using System.Collections.Generic;
using System;

namespace KBN
{
    public abstract partial class HeroManager
    {
        private readonly IDictionary<long, HeroInfo> m_HeroList = new Dictionary<long, HeroInfo>();
        private readonly IList<IList<HeroSlot>> m_HeroSlotLists = new List<IList<HeroSlot>>();
        private readonly IList<HeroExploreItem> m_HeroExploreItemList = new List<HeroExploreItem>();
		private long m_CurrentExploreId = 0L;
        private int m_CurrentExploreStrength = 0;
        private int m_CurrentCostItemId = 0;
        private int m_CurrentCostItemCount = 0;
        private int m_CurrentCostGems = 0;
		private int m_LastUsedItem = 0;

        public HeroInfo GetHeroInfo(long heroId)
        {
            HeroInfo hero = null;
            if (m_HeroList.TryGetValue(heroId, out hero))
            {
                return hero;
            }

            return null;
        }

        public HeroInfo GetHeroInfoByType(int type)
        {
            foreach (HeroInfo hero in m_HeroList.Values)
            {
                if (hero.Type == type)
                {
                    return hero;
                }
            }

            return null;
        }

        public int GetHeroCityIndex(long heroId)
        {
            HeroInfo hero = GetHeroInfo(heroId);
            if (hero == null)
            {
                return -1;
            }

            if (hero.Status != HeroStatus.Assigned && hero.Status != HeroStatus.Sleeping && hero.Status != HeroStatus.Marching)
            {
                return -1;
            }

            int cityIndex = 0;
            foreach (IList<HeroSlot> heroSlotList in m_HeroSlotLists)
            {
                foreach (HeroSlot heroSlot in heroSlotList)
                {
                    if (heroSlot.AssignedHero == hero)
                    {
                        return cityIndex;
                    }
                }

                cityIndex++;
            }

            return -1;
        }

        public HeroSkill GetHeroSkill(long heroId, int skillType)
        {
            HeroInfo hero = GetHeroInfo(heroId);
            if (hero == null)
            {
                return null;
            }

            foreach (HeroSkill skill in hero.Skill)
            {
                if (skill.Type == skillType)
                {
                    return skill;
                }
            }

            return null;
        }

        public HeroSkill GetHeroFate(long heroId, int fateType)
        {
            HeroInfo hero = GetHeroInfo(heroId);
            if (hero == null)
            {
                return null;
            }

            foreach (HeroSkill fate in hero.Fate)
            {
                if (fate.Type == fateType)
                {
                    return fate;
                }
            }

            return null;
        }

        public HeroSlot GetHeroSlot(int cityIndex, int slotIndex)
        {
            IList<HeroSlot> heroSlotList = GetHeroSlotList(cityIndex);
            if (heroSlotList == null)
            {
                return null;
            }

            if (slotIndex >= heroSlotList.Count)
            {
                return null;
            }

            return heroSlotList[slotIndex];
        }

        public IList<HeroSlot> GetHeroSlotList(int cityIndex)
        {
            if (cityIndex >= m_HeroSlotLists.Count)
            {
                return null;
            }

            return m_HeroSlotLists[cityIndex];
        }


		public IList<HeroInfo> GetUnassignedHeroList()
        {
            IList<HeroInfo> unassignedHeroList = new List<HeroInfo>();
            foreach (HeroInfo hero in m_HeroList.Values)
            {
                if (hero.Status == HeroStatus.Unassigned || hero.Status == HeroStatus.Unlocked)
                {
                    unassignedHeroList.Add(hero);
                }
            }

            return unassignedHeroList;
        }

        public IList<HeroInfo> GetCollectedHeroList()
        {
            IList<HeroInfo> heroInfoList = new List<HeroInfo>();
            Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection dataItems = 
                GameMain.GdsManager.GetGds<GDS_HeroBasic>().GetItems();
            foreach (DataTable.HeroBasic dataItem in dataItems)
            {
                HeroInfo hero = GetHeroInfoByType(dataItem.ID);
                if (hero == null)
                {
                    hero = new HeroInfo(0,0);
                    hero.Status = HeroStatus.Locked;
                    hero.Type = dataItem.ID;
                    string[] skillTypesStr = dataItem.SKILL.Split('_');
                    foreach (string skillTypeStr in skillTypesStr)
                    {
                        int skillType = int.Parse(skillTypeStr);
                        if (skillType <= 0)
                        {
                            continue;
                        }

                        DataTable.HeroSkillFate skillData = GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(skillType);
                        HeroSkill skill = new HeroSkill(skillType,1);
                        skill.Actived = false;
                        skill.EffectId = skillData.EFFECT;
                        skill.ConditionType = HeroSkillConditionType.Level;
                        skill.ConditionParam = skillData.SKILL_RENOWN;
                        
                        hero.Skill.Add(skill);
                    }
                    string[] fateTypesStr = dataItem.FATE.Split('_');
                    foreach (string fateTypeStr in fateTypesStr)
                    {
                        int fateType = int.Parse(fateTypeStr);
                        if (fateType <= 0)
                        {
                            continue;
                        }

                        DataTable.HeroSkillFate fateData = GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(fateType);
                        HeroSkill fate = new HeroSkill(fateType,1);
                        fate.Actived = false;
                        fate.EffectId = fateData.EFFECT;
                        if (fateData.FATE_HERO_IDS > 0)
                        {
                            fate.ConditionType = HeroSkillConditionType.Hero;
                            fate.ConditionParam = fateData.FATE_HERO_IDS;
                        }
                        else
                        {
                            fate.ConditionType = HeroSkillConditionType.Gear;
                            fate.ConditionParam = fateData.FATE_EQUIP_IDS;
                        }

                        hero.Fate.Add(fate);
                    }
                }

                heroInfoList.Add(hero);
            }

			(heroInfoList as List<HeroInfo>).Sort(new CollectedHeroCompare());

            return heroInfoList;
        }

        public float GetHeroSkillAffectedRatio(int cityIndex, HeroSkillAffectedProperty property)
        {
			if (!m_CheckResult)
			{
				return 0.0f;
			}

            float ratio = 0.0f;

            IList<HeroSlot> heroSlotList = GetHeroSlotList(cityIndex);
            if (heroSlotList == null)
            {
                return ratio;
            }

            foreach (HeroSlot heroSlot in heroSlotList)
            {
                if (heroSlot.AssignedHero == null)
                {
                    continue;
                }

                foreach (HeroSkill skill in heroSlot.AssignedHero.Skill)
                {
                    if (skill.Actived)
                    {
                        ratio += m_HeroSkillAffectedRatioFunc[property](skill.EffectId, skill.EffectParam);
                    }
                }

                foreach (HeroSkill fate in heroSlot.AssignedHero.Fate)
                {
                    if (fate.Actived)
                    {
                        ratio += m_HeroSkillAffectedRatioFunc[property](fate.EffectId, fate.EffectParam);
                    }
                }
            }

            return ratio;
        }

		public float GetHeroSkillAffectedRatio(List<int> heroIDList, HeroSkillAffectedProperty property)
		{
			float ratio = 0.0f;
			foreach (int id in heroIDList)
			{
				if(!m_HeroList.ContainsKey(id))
				{
					continue;
				}
				HeroInfo heroInfo = m_HeroList[id];
				foreach (HeroSkill skill in heroInfo.Skill)
				{
					if (skill.Actived)
					{
						ratio += m_HeroSkillAffectedRatioFunc[property](skill.EffectId, skill.EffectParam);
					}
				}
				
				foreach (HeroSkill fate in heroInfo.Fate)
				{
					if (fate.Actived)
					{
						ratio += m_HeroSkillAffectedRatioFunc[property](fate.EffectId, fate.EffectParam);
					}
				}
			}
			
			return ratio;
		}

		public float GetHeroSkillAffectedRatioLong(List<long> heroIDList, HeroSkillAffectedProperty property)
		{
			float ratio = 0.0f;
			foreach (long idLong in heroIDList)
			{
				int id=_Global.INT32(idLong);
				if(!m_HeroList.ContainsKey(id))
				{
					continue;
				}
				HeroInfo heroInfo = m_HeroList[id];
				foreach (HeroSkill skill in heroInfo.Skill)
				{
					if (skill.Actived)
					{
						ratio += m_HeroSkillAffectedRatioFunc[property](skill.EffectId, skill.EffectParam);
					}
				}
				
				foreach (HeroSkill fate in heroInfo.Fate)
				{
					if (fate.Actived)
					{
						ratio += m_HeroSkillAffectedRatioFunc[property](fate.EffectId, fate.EffectParam);
					}
				}
			}
			
			return ratio;
		}
		private System.Collections.Generic.IEnumerable<object> priv_castToGeneric(System.Collections.IEnumerable data)
		{
			foreach( object d in data )
				yield return d;
		}

		
		public long GetCurrentExploreId()
		{
			return m_CurrentExploreId;
		}
		
		public int GetCurrentExploreStrength()
		{
			return m_CurrentExploreStrength;
		}
		
		public int GetCurrentCostItemId()
		{
			return m_CurrentCostItemId;
		}
		
		public int GetCurrentCostItemCount()
        {
            return m_CurrentCostItemCount;
        }

        public int GetCurrentCostGems()
        {
            return m_CurrentCostGems;
        }

        public HeroExploreItem GetHeroExploreItem(int index)
        {
            IList<HeroExploreItem> heroExploreItemList = GetHeroExploreItemList();
            if (index >= heroExploreItemList.Count)
            {
                return null;
            }

            return heroExploreItemList[index];
        }

        public HeroExploreItem GetHeroExploreClosedItemByTypeWithCount(int type, int count)
        {
            IList<HeroExploreItem> heroExploreItemList = GetHeroExploreItemList();
            foreach (HeroExploreItem item in heroExploreItemList)
            {
                if (!item.Opened && item.Type == type && item.Count == count)
                {
                    return item;
                }
            }

            return null;
        }

        public IList<HeroExploreItem> GetHeroExploreItemList()
        {
            return m_HeroExploreItemList;
        }

        public IList<HeroInfo> GetMarchHeroList(int cityIndex)
        {
            IList<HeroInfo> marchHeroList = new List<HeroInfo>();
            IList<HeroSlot> heroSlotList = GetHeroSlotList(cityIndex);
            if (heroSlotList == null)
            {
                return marchHeroList;
            }

            foreach (HeroSlot heroSlot in heroSlotList)
            {
                if (heroSlot.AssignedHero == null)
                {
                    continue;
                }

				if (heroSlot.AssignedHero.Status != HeroStatus.Assigned && heroSlot.AssignedHero.Status != HeroStatus.Sleeping)
                {
                    continue;
                }

                bool hasMarchSkill = false;
                foreach (HeroSkill skill in heroSlot.AssignedHero.Skill)
                {
                    if (skill.Actived && skill.EffectId == Constant.Hero.HeroMarchSkillType)
                    {
                        hasMarchSkill = true;
                        marchHeroList.Add(heroSlot.AssignedHero);
                        break;
                    }
                }

                if (hasMarchSkill)
                {
                    continue;
                }

                foreach (HeroSkill fate in heroSlot.AssignedHero.Fate)
                {
                    if (fate.Actived && fate.EffectId == Constant.Hero.HeroMarchSkillType)
                    {
                        marchHeroList.Add(heroSlot.AssignedHero);
                        break;
                    }
                }
            }

            return marchHeroList;
        }

		public void SetHeroAvaDeployableStatus(long heroId)
		{
			HeroInfo hero = GetHeroInfo(heroId);
			if (hero == null)
			{
				Oops(string.Format("SetHeroAvaDeployableStatus: Can not found hero by id '{0}'.", heroId));
				return;
			}
			
			hero.Status = HeroStatus.Assigned;
		}

        public void SetHeroMarchStatus(long heroId)
        {
            HeroInfo hero = GetHeroInfo(heroId);
            if (hero == null)
            {
                Oops(string.Format("SetHeroMarchStatus: Can not found hero by id '{0}'.", heroId));
                return;
            }

            hero.Status = HeroStatus.Marching;

			MenuMgr.instance.SendNotification(Constant.Hero.HeroStatusUpdated);
        }

        public void SetHeroSleepStatus(long heroId, int sleepTime, int totalTime)
        {
            HeroInfo hero = GetHeroInfo(heroId);
            if (hero == null)
            {
                return;
            }

			hero.Status = HeroStatus.Sleeping;
			hero.SleepTime = sleepTime;
			hero.SleepTotal = totalTime;

			MenuMgr.instance.SendNotification(Constant.Hero.HeroStatusUpdated);
        }

		public void SubtractHeroSleepTime(long heroId, int subtractTime)
		{
			HeroInfo hero = GetHeroInfo(heroId);
			if (hero == null)
			{
				Oops(string.Format("SubtractHeroSleepTime: Can not found hero by id '{0}'.", heroId));
				return;
			}
			
			if (hero.Status != HeroStatus.Sleeping)
			{
				Oops(string.Format("SubtractHeroSleepTime: Hero '{0}' status is '{1}', can not subtract sleep time.", heroId, hero.Status));
				return;
			}

			hero.SleepTime -= subtractTime;
		}

        public void AddPVEHero(byte[] data)
        {
            if (data == null)
            {
                Oops("AddPVEHero: data is null.");
                return;
            }

            OnSyncPVEHeroOK(data);
        }

		public IList<HeroElevateReqItem> GetElevateReqList(int heroId)
		{
			HeroInfo hero = GetHeroInfo (heroId);
			if (hero == null)
			{
				Oops(string.Format("GetElevateReqList: Can not found hero by id '{0}'.", heroId));
				return null;
			}
			return hero.GetElevateReqList ();
		}

        private float HeroSkillAffectedFoodRatio(long effectId, IList<float> effectParam)
        {
            if (effectId == 20001 && effectParam.Count >= 1)
            {
                return effectParam[0];
            }

            return 0.0f;
        }

        private float HeroSkillAffectedWoodRatio(long effectId, IList<float> effectParam)
        {
            if (effectId == 20002 && effectParam.Count >= 1)
            {
                return effectParam[0];
            }
            return 0.0f;
        }

        private float HeroSkillAffectedStoneRatio(long effectId, IList<float> effectParam)
        {
            if (effectId == 20003 && effectParam.Count >= 1)
            {
                return effectParam[0];
            }
            return 0.0f;
        }

        private float HeroSkillAffectedOreRatio(long effectId, IList<float> effectParam)
        {
            if (effectId == 20004 && effectParam.Count >= 1)
            {
                return effectParam[0];
            }
            return 0.0f;
        }

		private float HeroSkillAffectedProtectionRatio(long effectId, IList<float> effectParam)
		{
			if (effectId == 20005 && effectParam.Count >= 1)
			{
				return effectParam[0];
			}
			
			return 0.0f;
		}

		private float HeroSkillAffectedBuildRatio(long effectId, IList<float> effectParam)
		{
			if (effectId == 20006 && effectParam.Count >= 1)
			{
				return effectParam[0];
			}
			
			return 0.0f;
		}

		private float HeroSkillAffectedSupplyRatio(long effectId, IList<float> effectParam)
		{
			if (effectId == 20007 && effectParam.Count >= 1)
			{
				return effectParam[0];
			}
			
			return 0.0f;
		}

		private float HeroSkillAffectedHorseRatio(long effectId, IList<float> effectParam)
		{
			if (effectId == 20008 && effectParam.Count >= 1)
			{
				return effectParam[0];
			}
			
			return 0.0f;
		}

		private float HeroSkillAffectedGroundRatio(long effectId, IList<float> effectParam)
		{
			if (effectId == 20009 && effectParam.Count >= 1)
			{
				return effectParam[0];
			}
			
			return 0.0f;
		}

		private float HeroSkillAffectedArtilleryRatio(long effectId, IList<float> effectParam)
		{
			if (effectId == 20010 && effectParam.Count >= 1)
			{
				return effectParam[0];
			}
			
			return 0.0f;
		}

        private float HeroSkillAffectedLoadRatio(long effectId, IList<float> effectParam)
        {
            if (effectId == 20013 && effectParam.Count >= 1)
            {
                return effectParam[0];
            }

            return 0.0f;
        }

		private float HeroSkillAffectedGroundSpeedRatio(long effectId, IList<float> effectParam)
		{
			if (effectId == 20014 && effectParam.Count >= 1)
			{
				return effectParam[0];
			}
			
			return 0.0f;
		}

		private float HeroSkillAffectedFastRatio(long effectId, IList<float> effectParam)
		{
			if (effectId == 30001 && effectParam.Count >= 1)
			{
				return effectParam[0];
			}
			
			return 0.0f;
		}

		private float HeroSkillAffectedHorseSpeedRatio(long effectId, IList<float> effectParam)
		{
			if (effectId == 20015 && effectParam.Count >= 1)
			{
				return effectParam[0];
			}
			
			return 0.0f;
		}

		private float HeroSkillAffectedCarmotSpeedRatio(long effectId, IList<float> effectParam)
		{
			if (effectId == 20021 && effectParam.Count >= 1)
			{
				return effectParam[0];
			}
			
			return 0.0f;
		}

		public void RefreshHeroAtbBySkill (HeroSkill skill)
		{
			if ( skill == null)
				return;
			HeroInfo hero = GetHeroInfoByType(skill.Type/100);
			DataTable.HeroSkillLevel gdsSkillLevelItem = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>().GetItemById(skill.Type,skill.Level); 
			DataTable.HeroSkillLevel gdsSkillPreviousLevelItem = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>().GetItemById(skill.Type,skill.Level-1);

			if(gdsSkillLevelItem == null)
			{
				return;
			}

			//this Level
			string[] skillParams = gdsSkillLevelItem.PARAMS.Split('_');
			IList<float> effectParams = new List<float>();
			foreach (string effectString in skillParams)
			{
				effectParams.Add(float.Parse(effectString));
			}
			float totalEffect = effectParams [0] + effectParams [1] * hero.Level;

			//last Level
			IList<float> effectParams_Previous = new List<float>();
			string[] skillParams_PreviousLevel;
			float totalEffect_PreviousLevel = 0.0f;
			if(gdsSkillPreviousLevelItem != null)
			{
				skillParams_PreviousLevel = gdsSkillPreviousLevelItem.PARAMS.Split('_');

				foreach (string effectString in skillParams_PreviousLevel)
				{
					effectParams_Previous.Add(float.Parse(effectString));
				}
				totalEffect_PreviousLevel = effectParams_Previous [0] + effectParams_Previous [1] * hero.Level;

			}

			// total
			float totalSelfAtbEffect = totalEffect - totalEffect_PreviousLevel;

			//check hero atb changed by skill effect id
			if(skill.Actived)
			{
				bool addMight = false;
				switch(skill.EffectId)
				{
				case 10002:
					//add attack 
					hero.Attack += (int)totalSelfAtbEffect;
					addMight = true;
					break;
				case 10003:
					//add life 
					hero.Health += (int)totalSelfAtbEffect;
					addMight = true;
					break;
				case 10006:
					//add attack,sub life
					hero.Attack += (int)totalSelfAtbEffect;
					hero.Health -= (int)totalSelfAtbEffect;
					addMight = true;
					break;
				case 10007:
					//add life, sub attack
					hero.Attack -= (int)totalSelfAtbEffect;
					hero.Health += (int)totalSelfAtbEffect;
					addMight = true;
					break;
				case 10008:
					//add wise
					hero.Load += (int)totalSelfAtbEffect;
					addMight = true;
					break;
				}
				if(addMight)
				{
					hero.Might = 600 + hero.CurTotalRenown * 0 + (hero.Attack + hero.Health + hero.Load) * 20;
				}
			}
		}

		private void AddHeroElevateNewSkill(HeroInfo hero)
		{
			//CheckUnlockNewSkill
			HeroSkill newSkill = hero.ElevateNewSkill ();
			if(newSkill != null)
			{
				HeroSkill skill = GetHeroSkill(hero.Id, newSkill.Type);
				if(skill == null)
				{
					hero.Skill.Add(newSkill);
				}
				
				DataTable.HeroSkillFate gdsSkillItem = GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(newSkill.Type); 
				DataTable.HeroSkillLevel gdsSkillLevelItem = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>().GetItemById(newSkill.Type,newSkill.Level); 
				if(gdsSkillItem != null && gdsSkillLevelItem != null)
				{
					newSkill.Actived = true;
					//check skill Active
					//renown
					if(hero.Level < gdsSkillItem.SKILL_RENOWN)
					{
						newSkill.Actived = false;
					}
					//other hero in the same city
					int reqHeroTypeId = gdsSkillItem.FATE_HERO_IDS;
					if(reqHeroTypeId != 0)
					{
						HeroInfo reqHeroInfo = GetHeroInfoByType(reqHeroTypeId);
						if(reqHeroInfo != null)
						{
							if(GetHeroCityIndex(hero.Id) != GetHeroCityIndex(reqHeroInfo.Id))
							{
								newSkill.Actived = false;
							}
						}
						else
						{
							newSkill.Actived = false;
						}
					}
					newSkill.FillCondition();
					newSkill.EffectId = gdsSkillItem.EFFECT;
					newSkill.EffectParam.Clear();
					
					string[] skillParams = gdsSkillLevelItem.PARAMS.Split('_');

					IList<float> effectParams = new List<float>();
					foreach (string effectString in skillParams)
					{
						effectParams.Add(float.Parse(effectString));
					}
					float totalEffect = effectParams [0] + effectParams [1] * hero.Level + effectParams [2] * hero.Attack + effectParams [3] * hero.Health + effectParams [4] * hero.Load;
					if(IsPercentEffect(gdsSkillItem.EFFECT))
					{
						totalEffect = totalEffect * 0.01f;
						totalEffect = (float)System.Math.Round(totalEffect*100)/100;
					}
					newSkill.EffectParam.Add(totalEffect);
					RefreshHeroAtbBySkill(newSkill);
				}
				else
				{
					Oops(string.Format("OnHeroElevateOK: skillId : '{0}' is not exsited.", newSkill.Type));
				}
			}
		}

		private void AddHeroElevateNewFate(HeroInfo hero)
		{
			//CheckUnlockNewFate
			HeroSkill newSkill = hero.ElevateNewFate ();
			if(newSkill != null)
			{
				HeroSkill skill = GetHeroSkill(hero.Id, newSkill.Type);
				if(skill == null)
				{
					hero.Fate.Add(newSkill);
				}
				
				DataTable.HeroSkillFate gdsSkillItem = GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(newSkill.Type); 
				DataTable.HeroSkillLevel gdsSkillLevelItem = GameMain.GdsManager.GetGds<GDS_HeroSkillLevel>().GetItemById(newSkill.Type,newSkill.Level); 
				if(gdsSkillItem != null && gdsSkillLevelItem != null)
				{
					newSkill.Actived = true;
					//check skill Active
					//renown
					if(hero.Level < gdsSkillItem.SKILL_RENOWN)
					{
						newSkill.Actived = false;
					}
					//other hero in the same city
					int reqHeroTypeId = gdsSkillItem.FATE_HERO_IDS;
					if(reqHeroTypeId != 0)
					{
						HeroInfo reqHeroInfo = GetHeroInfoByType(reqHeroTypeId);
						if(reqHeroInfo != null)
						{
							if(GetHeroCityIndex(hero.Id) != GetHeroCityIndex(reqHeroInfo.Id))
							{
								newSkill.Actived = false;
							}
						}
						else
						{
							newSkill.Actived = false;
						}
					}
					newSkill.FillCondition();
					newSkill.EffectId = gdsSkillItem.EFFECT;
					newSkill.EffectParam.Clear();

					string[] skillParams = gdsSkillLevelItem.PARAMS.Split('_');
					
					IList<float> effectParams = new List<float>();
					foreach (string effectString in skillParams)
					{
						effectParams.Add(float.Parse(effectString));
					}
					HeroInfo heroInfo = HeroManager.Instance.GetHeroInfoByType (newSkill.Type / 100);
					float totalEffect = effectParams [0] + effectParams [1] * heroInfo.Level + effectParams [2] * heroInfo.Attack + effectParams [3] * heroInfo.Health + effectParams [4] * heroInfo.Load;
					if(IsPercentEffect(gdsSkillItem.EFFECT))
					{
						totalEffect = totalEffect * 0.01f;
						totalEffect = (float)System.Math.Round(totalEffect*100)/100;
					}
					newSkill.EffectParam.Add(totalEffect);

					RefreshHeroAtbBySkill(newSkill);
				}
				else
				{
					Oops(string.Format("OnHeroElevateOK: skillId : '{0}' is not exsited.", newSkill.Type));
				}
			}
		}


        private class CollectedHeroCompare : IComparer<HeroInfo>
        {
            public int Compare(HeroInfo lInfo, HeroInfo rInfo)
            {
				if (lInfo.Status == HeroStatus.Locked && rInfo.Status != HeroStatus.Locked)
				{
					return 1;
				}
				else if (lInfo.Status != HeroStatus.Locked && rInfo.Status == HeroStatus.Locked)
				{
					return -1;
				}
				else
				{
					return lInfo.Type.CompareTo(rInfo.Type);
				}
            }
        }
    }
}
