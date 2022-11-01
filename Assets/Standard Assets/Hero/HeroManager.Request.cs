using System.Collections;
using System.Collections.Generic;

namespace KBN
{
    public abstract partial class HeroManager
    {
        public void RequestHeroHouseList(long cityId)
        {
            PBMsgReqHeroHouseList.PBMsgReqHeroHouseList request = new PBMsgReqHeroHouseList.PBMsgReqHeroHouseList();
            request.cid = cityId;
            UnityNet.RequestForGPB("heroHouseList.php", request, OnHeroHouseListOK, OnError, true);
        }

        public void RequestBoost(long heroId, int itemType, int times)
        {
			SetLastCountOfUsedBoostItems( times );
            PBMsgReqBoostHero.PBMsgReqBoostHero request = new PBMsgReqBoostHero.PBMsgReqBoostHero();
            request.hid = heroId;
            request.iid = itemType;
			request.utimes = times;
            UnityNet.RequestForGPB("boostHero.php", request, OnBoostHeroOK, OnError);
        }

        public void RequestUnassign(long heroId, long cityId)
        {
            PBMsgReqUnassignHero.PBMsgReqUnassignHero request = new PBMsgReqUnassignHero.PBMsgReqUnassignHero();
            request.hid = heroId;
            request.cid = cityId;
            UnityNet.RequestForGPB("unassignHero.php", request, OnUnassignHeroOK, OnError);
        }

        public void RequestAssign(long heroId, long cityId, int slotIndex)
        {
            PBMsgReqAssignHero.PBMsgReqAssignHero request = new PBMsgReqAssignHero.PBMsgReqAssignHero();
            request.hid = heroId;
            request.cid = cityId;
            request.sid = slotIndex + 1;
            UnityNet.RequestForGPB("assignHero.php", request, OnAssignHeroOK, OnError);
        }

        public void RequestInitHeroExplore(long heroId, long cityId, int speed)
        {
            PBMsgReqInitHeroExplore.PBMsgReqInitHeroExplore request = new PBMsgReqInitHeroExplore.PBMsgReqInitHeroExplore();
            request.hid = heroId;
            request.cid = cityId;
            request.speed = speed;
            UnityNet.RequestForGPB("heroExploreInit.php", request, OnInitHeroExploreOK, OnError);
        }

        public void RequestProcessHeroExplore(long heroId, long exploreId, int costItemId, int costGems)
        {
            PBMsgReqProcessHeroExplore.PBMsgReqProcessHeroExplore request = new PBMsgReqProcessHeroExplore.PBMsgReqProcessHeroExplore();
            request.hid = heroId;
            request.eid = exploreId;
            request.itemId = costItemId;
            request.gems = costGems;
            UnityNet.RequestForGPB("heroExploreProcess.php", request, OnProcessHeroExploreOK, OnError);
        }

        public void RequestAddHero(int itemId)
        {
			m_LastUsedItem = itemId;
            PBMsgReqAddHero.PBMsgReqAddHero request = new PBMsgReqAddHero.PBMsgReqAddHero();
            request.iid = itemId;
            UnityNet.RequestForGPB("addHero.php", request, OnAddHeroOK, OnAddHeroError);
        }

		private string m_ElevateFromMenu = "";
		public void RequestHeroElevate(long heroId,string fromMenu)
		{
			PBMsgReqElevateHero.PBMsgReqElevateHero request = new PBMsgReqElevateHero.PBMsgReqElevateHero ();
			request.hid = heroId;
			m_ElevateFromMenu = fromMenu;
			UnityNet.RequestForGPB("heroElevate.php", request, OnHeroElevateOK);
		}

		public void RequestHeroSkillLevelUp(int skillId)
		{
			PBMsgReqHeroSkillLevelUp.PBMsgReqHeroSkillLevelUp request = new PBMsgReqHeroSkillLevelUp.PBMsgReqHeroSkillLevelUp ();
			HeroInfo hero = GetHeroInfoByType (skillId / 100);
			request.hid = hero.Id;
			request.sid = skillId;
			UnityNet.RequestForGPB("heroSkillLevelUp.php", request, OnHeroSkillLevelUpOk);
		}
    }
}
