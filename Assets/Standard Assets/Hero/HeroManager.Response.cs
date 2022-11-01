using System.Collections;
using System.Collections.Generic;

namespace KBN
{
    public abstract partial class HeroManager
    {
		private int m_lastCountOfUsedBoostItems = 0;

		private void SetLastCountOfUsedBoostItems( int count )
		{
			m_lastCountOfUsedBoostItems = count > 0 ? count : 0;
		}

        private void OnError(string errorMessage, string errorCode)
        {
			Oops(Datas.getArString(string.Format("Error.err_{0}", errorCode)));
        }

        private void OnHeroHouseListOK(byte[] data)
        {
            PBMsgHeroHouseList.PBMsgHeroHouseList pbHeroHouseList = _Global.DeserializePBMsgFromBytes<PBMsgHeroHouseList.PBMsgHeroHouseList>(data);

            foreach (IList<HeroSlot> heroSlotList in m_HeroSlotLists)
            {
                for (int i = 0; i < pbHeroHouseList.heroHouseSlots; i++)
                {
                    if (i >= heroSlotList.Count)
                    {
                        heroSlotList.Add(new HeroSlot(i));
                    }

                    HeroSlot slot = heroSlotList[i];
                    if (i < pbHeroHouseList.opennedSlot)
                    {
                        slot.Status = HeroSlotStatus.Unassigned;
                    }
                    else
                    {
                        slot.Status = HeroSlotStatus.Locked;
                        slot.ActiveLevel = pbHeroHouseList.unlockSlotDesc[i - pbHeroHouseList.opennedSlot];
                    }
                }
            }

            foreach (PBMsgHeroHouseList.PBMsgHeroHouseList.PBMsgHero pbHero in pbHeroHouseList.hero)
            {
                HeroInfo hero = GetHeroInfo(pbHero.userHeroId);
                if (hero == null)
                {
					hero = new HeroInfo(pbHero.userHeroId,pbHero.elevate);
                    m_HeroList.Add(hero.Id, hero);
                }

                switch (pbHero.status)
                {
                    case PBMsgHeroHouseList.PBMsgHeroHouseList.PBMsgHeroStatus.UNLOCKED:
                        hero.Status = HeroStatus.Unlocked;
                        break;
                    case PBMsgHeroHouseList.PBMsgHeroHouseList.PBMsgHeroStatus.IN_CITY_DO_NOTHING:
                        hero.Status = HeroStatus.Assigned;
                        break;
                    case PBMsgHeroHouseList.PBMsgHeroHouseList.PBMsgHeroStatus.IN_CITY_IN_MARCH:
                        hero.Status = HeroStatus.Marching;
                        break;
                    case PBMsgHeroHouseList.PBMsgHeroHouseList.PBMsgHeroStatus.IN_CITY_SLEEP:
                        hero.Status = HeroStatus.Sleeping;
                        break;
                    case PBMsgHeroHouseList.PBMsgHeroHouseList.PBMsgHeroStatus.IN_NO_CITY:
                        hero.Status = HeroStatus.Unassigned;
                        break;
                    default:
                        hero.Status = HeroStatus.Locked;
                        break;
                }

                hero.Type = pbHero.heroId;
                hero.Level = pbHero.level;
                hero.Renown = pbHero.renown;
                hero.NextRenown = pbHero.nextRenown;
                hero.Attack = pbHero.attack;
                hero.Health = pbHero.hp;
                hero.Load = pbHero.load;
                hero.Might = pbHero.might;
                hero.Relic.Add(pbHero.gear1);
                hero.Relic.Add(pbHero.gear2);
                hero.Relic.Add(pbHero.gear3);
                hero.Relic.Add(pbHero.gear4);
                //hero.CalculateRelicSet();

                foreach (PBMsgHeroHouseList.PBMsgHeroHouseList.PBMsgSkillActived pbSkill in pbHero.skill)
                {
					HeroSkill skill = GetHeroSkill(pbHero.userHeroId, pbSkill.id);
					if (skill == null)
					{
						skill = new HeroSkill(pbSkill.id,pbSkill.lv);
						hero.Skill.Add(skill);
					}

                    skill.Actived = pbSkill.actived;
					skill.FillCondition();
                    skill.EffectId = pbSkill.effectId;
					skill.EffectParam.Clear();
                    foreach (string effectString in pbSkill.effect)
                    {
                        skill.EffectParam.Add(float.Parse(effectString));
                    }
                }

                foreach (PBMsgHeroHouseList.PBMsgHeroHouseList.PBMsgSkillActived pbFate in pbHero.fate)
                {
					HeroSkill fate = GetHeroFate(pbHero.userHeroId, pbFate.id);
					if (fate == null)
					{
						fate = new HeroSkill(pbFate.id,pbFate.lv);
						hero.Fate.Add(fate);
					}

                    fate.Actived = pbFate.actived;
					fate.FillCondition();
                    fate.EffectId = pbFate.effectId;
					fate.EffectParam.Clear();
                    foreach (string effectString in pbFate.effect)
                    {
                        fate.EffectParam.Add(float.Parse(effectString));
                    }
                }

                hero.Explored = pbHero.explored;
                hero.MaxExplore = pbHero.maxExplore;
                hero.SleepTotal = pbHero.totalSleepTime;
                hero.SleepTime = pbHero.sleepTime;
                int cityIndex = pbHero.cityIndex - 1;
                int slotIndex = pbHero.slot - 1;
                if (cityIndex >= 0 && cityIndex < m_HeroSlotLists.Count && slotIndex >= 0 && slotIndex < m_HeroSlotLists[cityIndex].Count)
                {
                    m_HeroSlotLists[cityIndex][slotIndex].Status = HeroSlotStatus.Assigned;
                    m_HeroSlotLists[cityIndex][slotIndex].AssignedHero = hero;
                }
            }

            MenuMgr.instance.SendNotification(Constant.Hero.HeroInfoListUpdated);

			m_ReceiveInitResponseFlag = true;
        }

		private void SubtractItem( int itemId, int count )
		{
			MyItems.singleton.subtractItem(itemId, count);
		}

        private void OnBoostHeroOK(byte[] data)
        {
            PBMsgBoostHero.PBMsgBoostHero pbBoostHero = _Global.DeserializePBMsgFromBytes<PBMsgBoostHero.PBMsgBoostHero>(data);
            HeroInfo hero = GetHeroInfo(pbBoostHero.userHeroId);
            if (hero == null)
            {
                Oops(string.Format("BoostHero: Can not found hero by id '{0}'.", pbBoostHero.userHeroId));
                return;
            }

			SubtractItem(pbBoostHero.itemId, m_lastCountOfUsedBoostItems);
			m_lastCountOfUsedBoostItems = 0;

            if (pbBoostHero.statusSpecified)
            {
                switch (pbBoostHero.status)
                {
                    case PBMsgBoostHero.PBMsgBoostHero.PBMsgHeroStatus.UNLOCKED:
                        hero.Status = HeroStatus.Unlocked;
                        break;
                    case PBMsgBoostHero.PBMsgBoostHero.PBMsgHeroStatus.IN_CITY_DO_NOTHING:
                        hero.Status = HeroStatus.Assigned;
                        break;
                    case PBMsgBoostHero.PBMsgBoostHero.PBMsgHeroStatus.IN_CITY_IN_MARCH:
                        hero.Status = HeroStatus.Marching;
                        break;
                    case PBMsgBoostHero.PBMsgBoostHero.PBMsgHeroStatus.IN_CITY_SLEEP:
                        hero.Status = HeroStatus.Sleeping;
                        break;
                    case PBMsgBoostHero.PBMsgBoostHero.PBMsgHeroStatus.IN_NO_CITY:
                        hero.Status = HeroStatus.Unassigned;
                        break;
                    default:
                        hero.Status = HeroStatus.Locked;
                        break;
                }
            }

            if (pbBoostHero.levelSpecified)
            {
                hero.Level = pbBoostHero.level;
            }

            hero.Renown = pbBoostHero.renown;

            if (pbBoostHero.nextLevelRenownSpecified)
            {
                hero.NextRenown = pbBoostHero.nextLevelRenown;
            }

            if (pbBoostHero.attackSpecified)
            {
                hero.Attack = pbBoostHero.attack;
            }

            if (pbBoostHero.hpSpecified)
            {
                hero.Health = pbBoostHero.hp;
            }

            if (pbBoostHero.loadSpecified)
            {
                hero.Load = pbBoostHero.load;
            }

            if (pbBoostHero.mightSpecified)
            {
                hero.Might = pbBoostHero.might;
            }

			if (pbBoostHero.maxExploreTimeSpecified)
			{
				hero.Explored = 0;
				hero.MaxExplore = pbBoostHero.maxExploreTime;
			}

            foreach (PBMsgBoostHero.PBMsgBoostHero.PBMsgSkillActived pbSkill in pbBoostHero.skill)
            {
                HeroSkill skill = GetHeroSkill(pbBoostHero.userHeroId, pbSkill.id);
                if (skill == null)
                {
                    Oops(string.Format("BoostHero: Can not found hero skill by id '{0}'.", pbSkill.id));
                    continue;
                }

                skill.Actived = pbSkill.actived;

				skill.FillCondition();

                if (pbSkill.effectIdSpecified)
                {
                    skill.EffectId = pbSkill.effectId;
                    skill.EffectParam.Clear();
                    foreach (string effectString in pbSkill.effect)
                    {
                        skill.EffectParam.Add(float.Parse(effectString));
                    }
                }
            }

            foreach (PBMsgBoostHero.PBMsgBoostHero.PBMsgSkillActived pbFate in pbBoostHero.fate)
            {
                HeroSkill fate = GetHeroFate(pbBoostHero.userHeroId, pbFate.id);
                if (fate == null)
                {
                    continue;
                }

                fate.Actived = pbFate.actived;
				fate.FillCondition();

                if (pbFate.effectIdSpecified)
                {
                    fate.EffectId = pbFate.effectId;
                    fate.EffectParam.Clear();
                    foreach (string effectString in pbFate.effect)
                    {
                        fate.EffectParam.Add(float.Parse(effectString));
                    }
                }
            }

            MenuMgr.instance.SendNotification(Constant.Hero.HeroBoosted);

            if (pbBoostHero.popGetHero)
            {
                MenuMgr.instance.SendNotification(Constant.Hero.HeroUnlock, hero);
            }
        }

        private void OnUnassignHeroOK(byte[] data)
        {
            PBMsgUnassignHero.PBMsgUnassignHero pbUnassignHero = _Global.DeserializePBMsgFromBytes<PBMsgUnassignHero.PBMsgUnassignHero>(data);
            HeroSlot slot = GetHeroSlot(pbUnassignHero.cityIndex - 1, pbUnassignHero.sid - 1);
            if (slot.AssignedHero == null || slot.Status != HeroSlotStatus.Assigned && slot.AssignedHero.Id != pbUnassignHero.hid)
            {
                Oops("UnassignHero: Assigned hero status error.");
                return;
            }

			HeroInfo unassignedHero = slot.AssignedHero;
            slot.Status = HeroSlotStatus.Unassigned;
            slot.AssignedHero = null;

            foreach (PBMsgUnassignHero.PBMsgUnassignHero.PBMsgHero pbHero in pbUnassignHero.hero)
            {
                HeroInfo hero = GetHeroInfo(pbHero.userHeroId);
                if (hero == null)
                {
                    Oops(string.Format("UnassignHero: Can not found hero by id '{0}'.", pbHero.userHeroId));
                    continue;
                }

                if (pbHero.statusSpecified)
                {
                    switch (pbHero.status)
                    {
                        case PBMsgUnassignHero.PBMsgUnassignHero.PBMsgHeroStatus.UNLOCKED:
                            hero.Status = HeroStatus.Unlocked;
                            break;
                        case PBMsgUnassignHero.PBMsgUnassignHero.PBMsgHeroStatus.IN_CITY_DO_NOTHING:
                            hero.Status = HeroStatus.Assigned;
                            break;
                        case PBMsgUnassignHero.PBMsgUnassignHero.PBMsgHeroStatus.IN_CITY_IN_MARCH:
                            hero.Status = HeroStatus.Marching;
                            break;
                        case PBMsgUnassignHero.PBMsgUnassignHero.PBMsgHeroStatus.IN_CITY_SLEEP:
                            hero.Status = HeroStatus.Sleeping;
                            break;
                        case PBMsgUnassignHero.PBMsgUnassignHero.PBMsgHeroStatus.IN_NO_CITY:
                            hero.Status = HeroStatus.Unassigned;
                            break;
                        default:
                            hero.Status = HeroStatus.Locked;
                            break;
                    }
                }

                if (pbHero.heroIdSpecified)
                {
                    hero.Type = pbHero.heroId;
                }

                if (pbHero.levelSpecified)
                {
                    hero.Level = pbHero.level;
                }

                if (pbHero.renownSpecified)
                {
                    hero.Renown = pbHero.renown;
                }

                if (pbHero.nextRenownSpecified)
                {
                    hero.NextRenown = pbHero.nextRenown;
                }

                if (pbHero.attackSpecified)
                {
                    hero.Attack = pbHero.attack;
                }

                if (pbHero.hpSpecified)
                {
                    hero.Health = pbHero.hp;
                }

                if (pbHero.loadSpecified)
                {
                    hero.Load = pbHero.load;
                }

                if (pbHero.mightSpecified)
                {
                    hero.Might = pbHero.might;
                }

                foreach (PBMsgUnassignHero.PBMsgUnassignHero.PBMsgSkillActived pbSkill in pbHero.skill)
                {
                    HeroSkill skill = GetHeroSkill(pbHero.userHeroId, pbSkill.id);
                    if (skill == null)
                    {
                        Oops(string.Format("UnassignHero: Can not found hero skill by id '{0}'.", pbSkill.id));
                        continue;
                    }

                    if (pbSkill.activedSpecified)
                    {
                        skill.Actived = pbSkill.actived;
                    }

					skill.FillCondition();

                    if (pbSkill.effectIdSpecified)
                    {
                        skill.EffectId = pbSkill.effectId;
                        skill.EffectParam.Clear();
                        foreach (string effectString in pbSkill.effect)
                        {
                            skill.EffectParam.Add(float.Parse(effectString));
                        }
                    }
                }

                foreach (PBMsgUnassignHero.PBMsgUnassignHero.PBMsgSkillActived pbFate in pbHero.fate)
                {
                    HeroSkill fate = GetHeroFate(pbHero.userHeroId, pbFate.id);
                    if (fate == null)
                    {
                        continue;
                    }

                    if (pbFate.activedSpecified)
                    {
                        fate.Actived = pbFate.actived;
                    }

					fate.FillCondition();

                    if (pbFate.effectIdSpecified)
                    {
                        fate.EffectId = pbFate.effectId;
                        fate.EffectParam.Clear();
                        foreach (string effectString in pbFate.effect)
                        {
                            fate.EffectParam.Add(float.Parse(effectString));
                        }
                    }
                }

                if (pbHero.exploredSpecified)
                {
                    hero.Explored = pbHero.explored;
                }

                if (pbHero.maxExploreSpecified)
                {
                    hero.MaxExplore = pbHero.maxExplore;
                }

                if (pbHero.sleepTimeSpecified)
                {
                    hero.SleepTime = pbHero.sleepTime;
                }
            }

			MenuMgr.instance.SendNotification(Constant.Hero.HeroUnassigned, unassignedHero);
            MenuMgr.instance.SendNotification(Constant.Hero.HeroStatusUpdated);
        }

        private void OnAssignHeroOK(byte[] data)
        {
            PBMsgAssignHero.PBMsgAssignHero pbAssignHero = _Global.DeserializePBMsgFromBytes<PBMsgAssignHero.PBMsgAssignHero>(data);
            HeroInfo assignedHero = GetHeroInfo(pbAssignHero.hid);
            if (assignedHero == null)
            {
                throw new KeyNotFoundException();
            }

            HeroSlot slot = GetHeroSlot(pbAssignHero.cityIndex - 1, pbAssignHero.sid - 1);
            slot.Status = HeroSlotStatus.Assigned;
            slot.AssignedHero = assignedHero;

            foreach (PBMsgAssignHero.PBMsgAssignHero.PBMsgHero pbHero in pbAssignHero.hero)
            {
                HeroInfo hero = GetHeroInfo(pbHero.userHeroId);
                if (hero == null)
                {
                    Oops(string.Format("AssignHero: Can not found hero by id '{0}'.", pbHero.userHeroId));
                    continue;
                }

                if (pbHero.statusSpecified)
                {
                    switch (pbHero.status)
                    {
                        case PBMsgAssignHero.PBMsgAssignHero.PBMsgHeroStatus.UNLOCKED:
                            hero.Status = HeroStatus.Unlocked;
                            break;
                        case PBMsgAssignHero.PBMsgAssignHero.PBMsgHeroStatus.IN_CITY_DO_NOTHING:
                            hero.Status = HeroStatus.Assigned;
                            break;
                        case PBMsgAssignHero.PBMsgAssignHero.PBMsgHeroStatus.IN_CITY_IN_MARCH:
                            hero.Status = HeroStatus.Marching;
                            break;
                        case PBMsgAssignHero.PBMsgAssignHero.PBMsgHeroStatus.IN_CITY_SLEEP:
                            hero.Status = HeroStatus.Sleeping;
                            break;
                        case PBMsgAssignHero.PBMsgAssignHero.PBMsgHeroStatus.IN_NO_CITY:
                            hero.Status = HeroStatus.Unassigned;
                            break;
                        default:
                            hero.Status = HeroStatus.Locked;
                            break;
                    }
                }

                if (pbHero.heroIdSpecified)
                {
                    hero.Type = pbHero.heroId;
                }

                if (pbHero.levelSpecified)
                {
                    hero.Level = pbHero.level;
                }

                if (pbHero.renownSpecified)
                {
                    hero.Renown = pbHero.renown;
                }

                if (pbHero.nextRenownSpecified)
                {
                    hero.NextRenown = pbHero.nextRenown;
                }

                if (pbHero.attackSpecified)
                {
                    hero.Attack = pbHero.attack;
                }

                if (pbHero.hpSpecified)
                {
                    hero.Health = pbHero.hp;
                }

                if (pbHero.loadSpecified)
                {
                    hero.Load = pbHero.load;
                }

                if (pbHero.mightSpecified)
                {
                    hero.Might = pbHero.might;
                }

                foreach (PBMsgAssignHero.PBMsgAssignHero.PBMsgSkillActived pbSkill in pbHero.skill)
                {
                    HeroSkill skill = GetHeroSkill(pbHero.userHeroId, pbSkill.id);
                    if (skill == null)
                    {
                        Oops(string.Format("AssignHero: Can not found hero skill by id '{0}'.", pbSkill.id));
                        continue;
                    }

                    if (pbSkill.activedSpecified)
                    {
                        skill.Actived = pbSkill.actived;
                    }

					skill.FillCondition();

                    if (pbSkill.effectIdSpecified)
                    {
                        skill.EffectId = pbSkill.effectId;
                        skill.EffectParam.Clear();
                        foreach (string effectString in pbSkill.effect)
                        {
                            skill.EffectParam.Add(float.Parse(effectString));
                        }
                    }
                }

                foreach (PBMsgAssignHero.PBMsgAssignHero.PBMsgSkillActived pbFate in pbHero.fate)
                {
                    HeroSkill fate = GetHeroFate(pbHero.userHeroId, pbFate.id);
                    if (fate == null)
                    {
                        Oops(string.Format("AssignHero: Can not found hero fate by id '{0}'.", pbFate.id));
                        continue;
                    }

                    if (pbFate.activedSpecified)
                    {
                        fate.Actived = pbFate.actived;
                    }

					fate.FillCondition();

                    if (pbFate.effectIdSpecified)
                    {
                        fate.EffectId = pbFate.effectId;
                        fate.EffectParam.Clear();
                        foreach (string effectString in pbFate.effect)
                        {
                            fate.EffectParam.Add(float.Parse(effectString));
                        }
                    }
                }

                if (pbHero.exploredSpecified)
                {
                    hero.Explored = pbHero.explored;
                }

                if (pbHero.maxExploreSpecified)
                {
                    hero.MaxExplore = pbHero.maxExplore;
                }

                if (pbHero.sleepTimeSpecified)
                {
                    hero.SleepTotal = pbHero.sleepTime;
                    hero.SleepTime = pbHero.sleepTime;
                }
            }

            MenuMgr.instance.SendNotification(Constant.Hero.HeroAssigned, assignedHero);
        }

        private void OnInitHeroExploreOK(byte[] data)
        {
            PBMsgInitHeroExplore.PBMsgInitHeroExplore pbInitHeroExplore = _Global.DeserializePBMsgFromBytes<PBMsgInitHeroExplore.PBMsgInitHeroExplore>(data);
            HeroInfo hero = GetHeroInfo(pbInitHeroExplore.userHeroId);
            if (hero == null)
            {
                Oops(string.Format("InitHeroExplore: Can not found hero by id '{0}'.", pbInitHeroExplore.userHeroId));
                return;
            }

            m_CurrentExploreId = pbInitHeroExplore.exploreId;
            m_CurrentExploreStrength = pbInitHeroExplore.strength;
            hero.Explored++;
            hero.SleepTime = pbInitHeroExplore.sleepTime;
			hero.SleepTotal=hero.SleepTime;
            switch (pbInitHeroExplore.status)
            {
                case PBMsgInitHeroExplore.PBMsgInitHeroExplore.PBMsgHeroStatus.UNLOCKED:
                    hero.Status = HeroStatus.Unlocked;
                    break;
                case PBMsgInitHeroExplore.PBMsgInitHeroExplore.PBMsgHeroStatus.IN_CITY_DO_NOTHING:
                    hero.Status = HeroStatus.Assigned;
                    break;
                case PBMsgInitHeroExplore.PBMsgInitHeroExplore.PBMsgHeroStatus.IN_CITY_IN_MARCH:
                    hero.Status = HeroStatus.Marching;
                    break;
                case PBMsgInitHeroExplore.PBMsgInitHeroExplore.PBMsgHeroStatus.IN_CITY_SLEEP:
                    hero.Status = HeroStatus.Sleeping;
                    break;
                case PBMsgInitHeroExplore.PBMsgInitHeroExplore.PBMsgHeroStatus.IN_NO_CITY:
                    hero.Status = HeroStatus.Unassigned;
                    break;
                default:
                    hero.Status = HeroStatus.Locked;
                    break;
            }
            m_HeroExploreItemList.Clear();
            if (pbInitHeroExplore.itemId.Count != pbInitHeroExplore.itemCount.Count)
            {
                Oops(string.Format("InitHeroExplore: ItemId.Count = {0}, but ItemCount.Count = {1}.", pbInitHeroExplore.itemId.Count, pbInitHeroExplore.itemCount.Count));
                return;
            }

            int index = 0;
            foreach (int i in pbInitHeroExplore.itemId)
            {
                HeroExploreItem item = new HeroExploreItem(index);
                item.Type = i;
                item.Opened = false;
                item.Count = pbInitHeroExplore.itemCount[index];
                m_HeroExploreItemList.Add(item);
                index++;
            }

            m_CurrentCostItemId = pbInitHeroExplore.strengthItemIdSpecified ? pbInitHeroExplore.strengthItemId : 0;
            m_CurrentCostItemCount = pbInitHeroExplore.strengthItemCountSpecified ? pbInitHeroExplore.strengthItemCount : 0;
            m_CurrentCostGems = pbInitHeroExplore.gemsNSpecified ? pbInitHeroExplore.gemsN : 0;

            DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.Exploration, null);
            MenuMgr.instance.SendNotification(Constant.Hero.HeroInitExplore);
            MenuMgr.instance.SendNotification(Constant.Hero.HeroStatusUpdated);
        }

        private void OnProcessHeroExploreOK(byte[] data)
        {
            PBMsgProcessHeroExplore.PBMsgProcessHeroExplore pbProcessHeroExplore = _Global.DeserializePBMsgFromBytes<PBMsgProcessHeroExplore.PBMsgProcessHeroExplore>(data);
            if (m_CurrentExploreId != pbProcessHeroExplore.exploreId)
            {
                Oops(string.Format("ProcessHeroExplore: Current explore id '{0}' is not equal with server explore id '{1}'.", m_CurrentExploreId, pbProcessHeroExplore.exploreId));
                return;
            }

            m_CurrentExploreStrength = pbProcessHeroExplore.strength;

            if (pbProcessHeroExplore.gemsSpecified)
            {
                MenuMgr.instance.SendNotification(Constant.Hero.HeroExploreCostGems, pbProcessHeroExplore.gems);
            }

			if (m_CurrentCostItemId > 0)
			{
				SubtractItem(m_CurrentCostItemId);
			}

            if (pbProcessHeroExplore.itemIdSpecified && pbProcessHeroExplore.itemCountSpecified)
            {
                HeroExploreItem heroExploreItem = GetHeroExploreClosedItemByTypeWithCount(pbProcessHeroExplore.itemId, pbProcessHeroExplore.itemCount);
                if (heroExploreItem == null)
                {
                    Oops(string.Format("ProcessHeroExplore: Can not find explore item by id '{0}' with count '{1}'.", pbProcessHeroExplore.itemId, pbProcessHeroExplore.itemCount));
                    return;
                }

                heroExploreItem.Opened = true;

                MenuMgr.instance.SendNotification(Constant.Hero.HeroProcessExplore, heroExploreItem);
            }

            m_CurrentCostItemId = pbProcessHeroExplore.strengthItemIdSpecified ? pbProcessHeroExplore.strengthItemId : 0;
            m_CurrentCostItemCount = pbProcessHeroExplore.strengthItemCountSpecified ? pbProcessHeroExplore.strengthItemCount : 0;
            m_CurrentCostGems = pbProcessHeroExplore.gemsNSpecified ? pbProcessHeroExplore.gemsN : 0;
        }

        private void OnAddHeroOK(byte[] data)
        {
            PBMsgAddHero.PBMsgAddHero pbAddHero = _Global.DeserializePBMsgFromBytes<PBMsgAddHero.PBMsgAddHero>(data);

			if (GetHeroInfo(pbAddHero.userHeroId) != null)
			{
				Oops(string.Format("OnAddHeroOK: Duplicate hero by id '{0}'.", pbAddHero.userHeroId));
				return;
			}

            HeroInfo hero = new HeroInfo(pbAddHero.userHeroId,pbAddHero.elevate);
            switch (pbAddHero.status)
            {
                case PBMsgAddHero.PBMsgAddHero.PBMsgHeroStatus.UNLOCKED:
                    hero.Status = HeroStatus.Unlocked;
                    break;
                case PBMsgAddHero.PBMsgAddHero.PBMsgHeroStatus.IN_CITY_DO_NOTHING:
                    hero.Status = HeroStatus.Assigned;
                    break;
                case PBMsgAddHero.PBMsgAddHero.PBMsgHeroStatus.IN_CITY_IN_MARCH:
                    hero.Status = HeroStatus.Marching;
                    break;
                case PBMsgAddHero.PBMsgAddHero.PBMsgHeroStatus.IN_CITY_SLEEP:
                    hero.Status = HeroStatus.Sleeping;
                    break;
                case PBMsgAddHero.PBMsgAddHero.PBMsgHeroStatus.IN_NO_CITY:
                    hero.Status = HeroStatus.Unassigned;
                    break;
                default:
                    hero.Status = HeroStatus.Locked;
                    break;
            }
            hero.Type = pbAddHero.heroId;
            hero.Level = pbAddHero.level;
            hero.Renown = pbAddHero.renown;
            hero.NextRenown = pbAddHero.nextRenown;
            hero.Attack = pbAddHero.attack;
            hero.Health = pbAddHero.hp;
            hero.Load = pbAddHero.load;
            hero.Might = pbAddHero.might;
            foreach (PBMsgAddHero.PBMsgAddHero.PBMsgSkillActived pbSkill in pbAddHero.skill)
            {
                HeroSkill skill = new HeroSkill(pbSkill.id,pbSkill.lv);
                skill.Actived = pbSkill.actived;
				skill.FillCondition();
                skill.EffectId = pbSkill.effectId;
                foreach (string effectString in pbSkill.effect)
                {
                    skill.EffectParam.Add(float.Parse(effectString));
                }
                hero.Skill.Add(skill);
            }
            foreach (PBMsgAddHero.PBMsgAddHero.PBMsgSkillActived pbFate in pbAddHero.fate)
            {
                HeroSkill fate = new HeroSkill(pbFate.id,pbFate.lv);
                fate.Actived = pbFate.actived;
				fate.FillCondition();
                fate.EffectId = pbFate.effectId;
                foreach (string effectString in pbFate.effect)
                {
                    fate.EffectParam.Add(float.Parse(effectString));
                }
                hero.Fate.Add(fate);
            }
            hero.Explored = pbAddHero.explored;
            hero.MaxExplore = pbAddHero.maxExplore;
            hero.SleepTime = pbAddHero.sleepTime;
            int cityIndex = pbAddHero.cityIndex - 1;
            int slotIndex = pbAddHero.slot - 1;

            m_HeroList[hero.Id] = hero;
            if (cityIndex >= 0 && cityIndex < m_HeroSlotLists.Count && slotIndex >= 0 && slotIndex < m_HeroSlotLists[cityIndex].Count)
            {
                m_HeroSlotLists[cityIndex][slotIndex].Status = HeroSlotStatus.Assigned;
                m_HeroSlotLists[cityIndex][slotIndex].AssignedHero = hero;
            }

            MenuMgr.instance.SendNotification(Constant.Hero.HeroInfoListUpdated);
			MenuMgr.instance.PushMessage(Datas.getArString("ToastMsg.UseItem"));
			MyItems.singleton.subtractItem(m_LastUsedItem);
        }

		private void OnAddHeroError(string errorMessage, string errorCode)
		{
			switch (errorCode)
			{
			case "4019":
				MenuMgr.instance.PushMessage(Datas.getArString("Error.err_4019"));
				break;
			case "4021":
				MenuMgr.instance.PushMessage(Datas.getArString("Error.err_4021"));
				break;
			default:
				OnError(errorMessage, errorCode);
				break;
			}
		}

        private void OnSyncPVEHeroOK(byte[] data)
        {
            PBMsgSyncPVEHero.PBMsgSyncPVEHero pbSyncPVEHero = _Global.DeserializePBMsgFromBytes<PBMsgSyncPVEHero.PBMsgSyncPVEHero>(data);

            foreach (PBMsgSyncPVEHero.PBMsgSyncPVEHero.PBMsgHero pbHero in pbSyncPVEHero.hero)
            {
				if (GetHeroInfo(pbHero.userHeroId) != null)
				{
					Oops(string.Format("OnSyncPVEHeroOK: Duplicate hero by id '{0}'.", pbHero.userHeroId));
					return;
				}

                HeroInfo hero = new HeroInfo(pbHero.userHeroId,pbHero.elevate);
                switch (pbHero.status)
                {
                    case PBMsgSyncPVEHero.PBMsgSyncPVEHero.PBMsgHeroStatus.UNLOCKED:
                        hero.Status = HeroStatus.Unlocked;
                        break;
                    case PBMsgSyncPVEHero.PBMsgSyncPVEHero.PBMsgHeroStatus.IN_CITY_DO_NOTHING:
                        hero.Status = HeroStatus.Assigned;
                        break;
                    case PBMsgSyncPVEHero.PBMsgSyncPVEHero.PBMsgHeroStatus.IN_CITY_IN_MARCH:
                        hero.Status = HeroStatus.Marching;
                        break;
                    case PBMsgSyncPVEHero.PBMsgSyncPVEHero.PBMsgHeroStatus.IN_CITY_SLEEP:
                        hero.Status = HeroStatus.Sleeping;
                        break;
                    case PBMsgSyncPVEHero.PBMsgSyncPVEHero.PBMsgHeroStatus.IN_NO_CITY:
                        hero.Status = HeroStatus.Unassigned;
                        break;
                    default:
                        hero.Status = HeroStatus.Locked;
                        break;
                }
                hero.Type = pbHero.heroId;
                hero.Level = pbHero.level;
                hero.Renown = pbHero.renown;
                hero.NextRenown = pbHero.nextRenown;
                hero.Attack = pbHero.attack;
                hero.Health = pbHero.hp;
                hero.Load = pbHero.load;
                hero.Might = pbHero.might;
                foreach (PBMsgSyncPVEHero.PBMsgSyncPVEHero.PBMsgSkillActived pbSkill in pbHero.skill)
                {
                    HeroSkill skill = new HeroSkill(pbSkill.id,pbSkill.lv);
                    skill.Actived = pbSkill.actived;
					skill.FillCondition();
                    skill.EffectId = pbSkill.effectId;
                    foreach (string effectString in pbSkill.effect)
                    {
                        skill.EffectParam.Add(float.Parse(effectString));
                    }
                    hero.Skill.Add(skill);
                }
                foreach (PBMsgSyncPVEHero.PBMsgSyncPVEHero.PBMsgSkillActived pbFate in pbHero.fate)
                {
                    HeroSkill fate = new HeroSkill(pbFate.id,pbFate.lv);
                    fate.Actived = pbFate.actived;
					fate.FillCondition();
                    fate.EffectId = pbFate.effectId;
                    foreach (string effectString in pbFate.effect)
                    {
                        fate.EffectParam.Add(float.Parse(effectString));
                    }
                    hero.Fate.Add(fate);
                }
                hero.Explored = pbHero.explored;
                hero.MaxExplore = pbHero.maxExplore;
                hero.SleepTime = pbHero.sleepTime;
                int cityIndex = pbHero.cityIndex - 1;
                int slotIndex = pbHero.slot - 1;

                m_HeroList[hero.Id] = hero;
                if (cityIndex >= 0 && cityIndex < m_HeroSlotLists.Count && slotIndex >= 0 && slotIndex < m_HeroSlotLists[cityIndex].Count)
                {
                    m_HeroSlotLists[cityIndex][slotIndex].Status = HeroSlotStatus.Assigned;
                    m_HeroSlotLists[cityIndex][slotIndex].AssignedHero = hero;
                }

				int count = UnityEngine.PlayerPrefs.GetInt(Constant.Hero.HeroCollectCount, 0) + 1;
				UnityEngine.PlayerPrefs.SetInt(Constant.Hero.HeroCollectCount, count);
            }

            MenuMgr.instance.SendNotification(Constant.Hero.HeroInfoListUpdated);
        }

		private void OnHeroElevateOK(byte[] data)
		{
			PBMsgHeroElevateResult.PBMsgHeroElevateResult pbElevateRet = _Global.DeserializePBMsgFromBytes<PBMsgHeroElevateResult.PBMsgHeroElevateResult>(data);
			HeroInfo hero = GetHeroInfo (pbElevateRet.heroId);
			AddHeroElevateNewSkill (hero);
			AddHeroElevateNewFate(hero);
			hero.Elevate = pbElevateRet.heroElevate;
			hero.CalculateLevelAndRenown ();
			hero.SubtractItemForElevate (hero.Elevate);
			SoundMgr.instance().PlayEffect("kbn_hero_proplight", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
			MenuMgr.instance.SendNotification(m_ElevateFromMenu);

		}

		private void OnHeroSkillLevelUpOk(byte[] data)
		{
			PBMsgHeroSkillLevelUpResult.PBMsgHeroSkillLevelUpResult pbSkillLevelUpRet = _Global.DeserializePBMsgFromBytes<PBMsgHeroSkillLevelUpResult.PBMsgHeroSkillLevelUpResult>(data);
			HeroSkill skill = GetHeroSkill (pbSkillLevelUpRet.heroId, pbSkillLevelUpRet.skillId);
			HeroSkill fate = GetHeroFate (pbSkillLevelUpRet.heroId, pbSkillLevelUpRet.skillId);
			if(skill != null)
			{
				skill.SubtractItemForLevelUp ();
				skill.Level = pbSkillLevelUpRet.skillLevel;
				skill.RefreshEffectParam();
				RefreshHeroAtbBySkill (skill);
			}
			else
			{
				fate.SubtractItemForLevelUp ();
				fate.Level = pbSkillLevelUpRet.skillLevel;
				fate.RefreshEffectParam();
				RefreshHeroAtbBySkill (fate);
			}
			SoundMgr.instance().PlayEffect("kbn_hero_proplight", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
			MenuMgr.instance.SendNotification(Constant.Hero.SkillLevelUpOK);
		}

    }
}
