using KBN;
using System.Collections.Generic;
public partial class AvaUnits : AvaModule
{
	private List<HeroInfo> m_HeroInfoList = new List<HeroInfo> ();

	public void InitHeroInfoList()
	{
		m_HeroInfoList.Clear ();
		for(int i=0;i<m_Units.heros.Count;i++)
		{
			PBMsgAVATroop.PBMsgAVATroop.Hero hero = m_Units.heros[i];
			HeroInfo origHero = HeroManager.Instance.GetHeroInfo(hero.userHeroId);
			if(origHero == null)
			{
				continue;
			}
			HeroInfo heroInfo = origHero.CloneHero();
			if(heroInfo != null)
			{
				switch(hero.status)
				{
				case Constant.AvaHeroStatus.UNLOCKED:
					heroInfo.Status = HeroStatus.Unlocked;
					break;
				case Constant.AvaHeroStatus.IN_CITY_DO_NOTHING:
					heroInfo.Status = HeroStatus.Assigned;
					break;
				case Constant.AvaHeroStatus.IN_CITY_IN_MARCH:
					heroInfo.Status = HeroStatus.Marching;
					break;
				case Constant.AvaHeroStatus.IN_CITY_SLEEP:
					heroInfo.Status = HeroStatus.Sleeping;
					break;
				case Constant.AvaHeroStatus.IN_NO_CITY:
					heroInfo.Status = HeroStatus.Unassigned;
					break;
				default:
					heroInfo.Status = HeroStatus.Locked;
					break;
				}
				heroInfo.SleepTime = hero.sleepEndTime - (int)GameMain.unixtime();
				heroInfo.SleepTotal = hero.sleepTotal;
				heroInfo.Level = hero.level;

				m_HeroInfoList.Add(heroInfo);
			}
		}

	}

	private void UpdateHeroInfoList()
	{
		for(int i=0;i<m_HeroInfoList.Count;i++)
		{
			if(m_HeroInfoList[i].Status == HeroStatus.Sleeping)
			{
				if(m_HeroInfoList[i].SleepTime <= 0)
				{
					RequestAvaUnits();
				}
				else
				{
					m_HeroInfoList[i].SleepTime--;
				}
			}
		}
	}

	public List<HeroInfo> GetHeroList()
	{
		return m_HeroInfoList;
	}

	public List<HeroInfo> GetMarchHeroList()
	{
		List<HeroInfo> marchHeroList = new List<HeroInfo> ();
		HeroInfo heroInfo = null;
		for(int i=0;i<m_HeroInfoList.Count;i++)
		{
			heroInfo = m_HeroInfoList[i];
			if (heroInfo.Status != HeroStatus.Assigned && heroInfo.Status != HeroStatus.Sleeping)
			{
				continue;
			}

			bool hasMarchSkill = false;
			foreach (HeroSkill skill in heroInfo.Skill)
			{
				if (skill.Actived && skill.EffectId == Constant.Hero.HeroMarchSkillType)
				{
					hasMarchSkill = true;
					marchHeroList.Add(heroInfo);
					break;
				}
			}
			
			if (hasMarchSkill)
			{
				continue;
			}
			
			foreach (HeroSkill fate in heroInfo.Fate)
			{
				if (fate.Actived && fate.EffectId == Constant.Hero.HeroMarchSkillType)
				{
					marchHeroList.Add(heroInfo);
					break;
				}
			}
		}
		return marchHeroList;
	}

	public PBMsgAVATroop.PBMsgAVATroop.Hero GetRowHeroById(int userHeroId)
	{
		for(int i=0;i<m_Units.heros.Count;i++)
		{
			PBMsgAVATroop.PBMsgAVATroop.Hero hero = m_Units.heros[i];
			if(userHeroId == hero.userHeroId)
			{
				return hero;
			}
		}
		return null;
	}

	public void SetHeroSleepEndTime(int userHeroId,int endTime)
	{
		for(int i=0;i<m_Units.heros.Count;i++)
		{
			PBMsgAVATroop.PBMsgAVATroop.Hero hero = m_Units.heros[i];
			if(userHeroId == hero.userHeroId)
			{
				hero.sleepEndTime = endTime;
				return;
			}
		}
	}

	public HeroInfo GetHeroInfo(int userHeroId)
	{
		for(int i=0;i<m_HeroInfoList.Count;i++)
		{
			if(m_HeroInfoList[i].Id == userHeroId)
			{
				return m_HeroInfoList[i];
			}
		}
		return null;
	}

	public PBMsgAVATroop.PBMsgAVATroop.Hero GetRawHeroData(int userHeroId)
	{
		for(int i=0;i<m_Units.heros.Count;i++)
		{
			PBMsgAVATroop.PBMsgAVATroop.Hero hero = m_Units.heros[i];
			if(userHeroId == hero.userHeroId)
			{
				return hero;
			}
		}
		return null;
	}

	public int GetHeroSleepStartTime(int heroId)
	{
		for(int i=0;i<m_Units.heros.Count;i++)
		{
			PBMsgAVATroop.PBMsgAVATroop.Hero hero = m_Units.heros[i];
			if(heroId == hero.userHeroId)
			{
				return hero.sleepStartTime;
			}
		}
		return 0;
	}

	public int GetHeroSleepEndTime(int heroId)
	{
		for(int i=0;i<m_Units.heros.Count;i++)
		{
			PBMsgAVATroop.PBMsgAVATroop.Hero hero = m_Units.heros[i];
			if(heroId == hero.userHeroId)
			{
				return hero.sleepEndTime;
			}
		}
		return 0;
	}

	public int GetHeroSleepTotalTime(int heroId)
	{
		for(int i=0;i<m_Units.heros.Count;i++)
		{
			PBMsgAVATroop.PBMsgAVATroop.Hero hero = m_Units.heros[i];
			if(heroId == hero.userHeroId)
			{
				return hero.sleepTotal;
			}
		}
		return 0;
	}

}