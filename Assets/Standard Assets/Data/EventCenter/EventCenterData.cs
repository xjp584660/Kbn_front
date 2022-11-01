using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

using _Global = KBN._Global;

public class EventCenterGroupRewards {
    public List<EventCenterGroupRewardsPerRank> rewardPerRankList;

    private EventCenterGroupRewards() {
        rewardPerRankList = new List<EventCenterGroupRewardsPerRank>();
    }

    public void Sort(){
    	if(rewardPerRankList!=null){
    		rewardPerRankList.Sort((o1,o2)=>{
            	if(o1.FromRank>o2.FromRank){
	                return 1;
	            }else{
	                return -1;
	            }
        	});
    	}
    }

    public int Count {
        get {
            return rewardPerRankList.Count;
        }
    }

    public EventCenterGroupRewardsPerRank this[int index] {
        get {
            return rewardPerRankList[index];
        }
    }

    public static EventCenterGroupRewards CreateFromHashObject(HashObject groupRewardsHo) {
        var ret = new EventCenterGroupRewards();
		for (int i = 0; i < _Global.GetObjectKeys(groupRewardsHo).Length; ++i) {
            HashObject groupRewardsPerRankHo = groupRewardsHo[string.Format("{0}{1}", _Global.ap, i)];
            var groupRewardsPerRank = EventCenterGroupRewardsPerRank.CreateFromHashObject(groupRewardsPerRankHo);
            ret.rewardPerRankList.Add(groupRewardsPerRank);
        }
        // ret.Sort();
        return ret;
    }

    public static EventCenterGroupRewards CreateFromSourceHashObject(HashObject groupRewardsHo) {
        var ret = new EventCenterGroupRewards();
		for (int i = 0; i < _Global.GetObjectKeys(groupRewardsHo).Length; ++i) {
            HashObject groupRewardsPerRankHo = groupRewardsHo[string.Format("{0}{1}", _Global.ap, i)];
            var groupRewardsPerRank = EventCenterGroupRewardsPerRank.CreateFromSourceHashObject(groupRewardsPerRankHo);
            ret.rewardPerRankList.Add(groupRewardsPerRank);
        }
        // ret.Sort();
        return ret;
    }
}

public class EventCenterGroupRewardsPerRank {
    public int FromRank { get; private set; }
    public int ToRank { get; private set; }

    public List<EventCenterGroupRewardItem> rewardList;

    public EventCenterGroupRewardsPerRank(int fromRank, int toRank) {
        FromRank = fromRank;
        ToRank = toRank;
        rewardList = new List<EventCenterGroupRewardItem>();
    }

    public int Count {
        get {
            return rewardList.Count;
        }
    }

    public void AddRewardItem(EventCenterGroupRewardItem rewardItem) {
        rewardList.Add(rewardItem);
    }

    public EventCenterGroupRewardItem this[int index] {
        get {
            return rewardList[index];
        }
    }

    public static EventCenterGroupRewardsPerRank CreateFromHashObject(HashObject groupRewardsPerRankHo) {
        int fromRank = _Global.INT32(groupRewardsPerRankHo["from"]);
        int toRank = _Global.INT32(groupRewardsPerRankHo["to"]);
        var ret = new EventCenterGroupRewardsPerRank(fromRank, toRank);
        HashObject rewardItemListHo = groupRewardsPerRankHo["list"];
		for (int i = 0; i < _Global.GetObjectKeys(rewardItemListHo).Length; ++i) {
			HashObject itemObj = rewardItemListHo[string.Format("{0}{1}", _Global.ap, i)];
			int itemId = _Global.INT32(itemObj["id"]);
			int itemQty = _Global.INT32(itemObj["qty"]);
            var rewardItem = new EventCenterGroupRewardItem(itemId, itemQty);
            ret.AddRewardItem(rewardItem);
        }
        return ret;
    }

    public static EventCenterGroupRewardsPerRank CreateFromSourceHashObject(HashObject groupRewardsPerRankHo) {
        int fromRank = _Global.INT32(groupRewardsPerRankHo["score"]);
        int toRank = _Global.INT32(groupRewardsPerRankHo["score"]);
        var ret = new EventCenterGroupRewardsPerRank(fromRank, toRank);
        HashObject rewardItemListHo = groupRewardsPerRankHo["list"];
		for (int i = 0; i < _Global.GetObjectKeys(rewardItemListHo).Length; ++i) {
			HashObject itemObj = rewardItemListHo[string.Format("{0}{1}", _Global.ap, i)];
			int itemId = _Global.INT32(itemObj["id"]);
			int itemQty = _Global.INT32(itemObj["qty"]);
            var rewardItem = new EventCenterGroupRewardItem(itemId, itemQty);
            ret.AddRewardItem(rewardItem);
        }
        return ret;
    }
}

public class EventCenterAwardInfo
{
	public List<EventCenterGroupRewardItem> rankRewardList = new List<EventCenterGroupRewardItem> ();
	public List<EventCenterGroupRewardItem> scoreRewardList = new List<EventCenterGroupRewardItem> ();

	public EventCenterAwardInfo() {
	}
}

public class EventCenterGroupRewardItem {
    public int Id { get; private set; }
    public int Qty { get; private set; }

    public EventCenterGroupRewardItem(int id, int qty) {
        Id = id;
        Qty = qty;
    }
}

public class EventCenterAllGroupBasicInfo {
	public int PlayerGroupIndex { get; private set; }

	private List<EventCenterGroupBasicInfo> groupBasicInfos = new List<EventCenterGroupBasicInfo>();

	public int Count {
		get {
			return groupBasicInfos.Count;
		}
	}

	public EventCenterGroupBasicInfo this[int index] {
		get {
			return groupBasicInfos[index];
		}
	}

	private EventCenterAllGroupBasicInfo() {
	}

	public static EventCenterAllGroupBasicInfo Create(HashObject allGroupInfo, int playerGroupIndex) {
		var ret = new EventCenterAllGroupBasicInfo();
		ret.PlayerGroupIndex = playerGroupIndex;
		for (int i = 0; i < _Global.GetObjectKeys(allGroupInfo).Length; ++i) {
			var singleGroup = EventCenterGroupBasicInfo.CreateWithHashObject(allGroupInfo[string.Format("{0}{1}", _Global.ap, i)]);
			ret.groupBasicInfos.Add(singleGroup);
		}
		return ret;
	}
}

public class EventCenterGroupBasicInfo {
	public int MinLevel { get; private set; }
	public int MaxLevel { get; private set; }
	public string Title { get; private set; }
	public int TopRewardItemId { get; private set; }

	private EventCenterGroupBasicInfo() {
	}

	public static EventCenterGroupBasicInfo CreateWithHashObject(HashObject groupInfo) {
		var ret = new EventCenterGroupBasicInfo();
		ret.MinLevel = _Global.INT32(groupInfo["minLevel"]);
		ret.MaxLevel = groupInfo["maxLevel"] == null ? int.MaxValue : _Global.INT32(groupInfo["maxLevel"]);
		ret.Title = _Global.GetString(groupInfo["title"]);
		ret.TopRewardItemId = _Global.INT32(groupInfo["topReward"]);
		return ret;
	}
}

public static class EventCenterUtils {
	public static int EventCenterMenuRankFrameTopY = 66;

	public static class RankType
	{
		public static string ScoreType = "Score Type";
		public static string RankingType = "Ranking Type";
	}

	public static bool IsSeasonEvent(HashObject eventData) {
		return (_Global.INT32(eventData["eventType"]) == (int)(Constant.EventCenter.GameEventType.SeasonEvent));
	}

	public static bool IsIndividualTournament(HashObject eventData) {
		if (_Global.INT32(eventData["eventType"]) != (int)(Constant.EventCenter.GameEventType.Tournament)) {
			return false;
		}
		if (eventData["extra"] == null || eventData["extra"]["individual"] == null) {
			return false;
		}
		if (_Global.INT32(eventData["extra"]["individual"]) == 0) {
			return false;
		}
		return true;
	}

	public static bool IsTournament(HashObject eventData) {
		if (_Global.INT32(eventData["eventType"]) != (int)(Constant.EventCenter.GameEventType.Tournament)) {
			return false;
		}
//		if (eventData["extra"] == null || eventData["extra"]["individual"] == null) {
//			return false;
//		}
//		if (_Global.INT32(eventData["extra"]["individual"]) == 0) {
//			return false;
//		}
		return true;
	}

	public static bool IsRankTroopTrain(HashObject eventData) {
		return (_Global.INT32(eventData["eventType"]) == (int)(Constant.EventCenter.GameEventType.TrainTroop)) && (_Global.INT32(eventData["rewardType"]) == 1);
	}

	public static bool IsBossFightEvent(HashObject eventData) {
		return (_Global.INT32(eventData["eventType"]) == (int)(Constant.EventCenter.GameEventType.BossFight));
	}
	public static bool IsCarmotEvent(HashObject eventData) {
		return (_Global.INT32(eventData["eventType"]) == (int)(Constant.EventCenter.GameEventType.CarmotEvent));
	}
	public static bool IsShowViewPrize(HashObject eventData) {
		return IsTournament(eventData) || IsRankTroopTrain(eventData) || IsBossFightEvent(eventData) || IsCarmotEvent(eventData) || IsWorldBoss(eventData);
	}

	public static bool IsWorldBoss(HashObject eventData)
	{
		if (_Global.INT32(eventData["eventType"]) != (int)(Constant.EventCenter.GameEventType.WorldBoss)) {
			return false;
		}
		
		return true;
	}

	public static bool EventIsGrouped(HashObject eventData) {
		if (eventData["groupedTournament"] == null || GetAllGroupInfoFromEvent(eventData) == null) {
			return false;
		}
		return GetGroupCount(eventData) > 1;
	}
	
	public static int GetUserGroupIndexFromEvent(HashObject eventData) {
		return _Global.INT32(eventData["groupedTournament"]["playerGroup"]);
	}
	
	public static string GetGroupTitleFromGroupInfo(HashObject groupInfo) {
		return _Global.GetString(groupInfo["title"]);
	}

	public static string GetGroupLongTitleFromGroupInfo(HashObject groupInfo) {
		if (groupInfo["longTitle"] != null) {
			return _Global.GetString(groupInfo["longTitle"]);
		}
		return GetGroupTitleFromGroupInfo(groupInfo);
	}
	
	public static HashObject GetAllGroupInfoFromEvent(HashObject eventData) {
		return eventData["groupedTournament"]["groups"];
	}
	
	public static HashObject GetGroupInfoAtIndex(HashObject allGroupInfo, int index) {
		return allGroupInfo[string.Format("{0}{1}", _Global.ap, index)];
	}
	
	public static int GetGroupCount(HashObject eventData) {
		HashObject groups = GetAllGroupInfoFromEvent(eventData);
		return _Global.GetObjectKeys(groups).Length;
	}
	
	public static HashObject GetGroupRewardsFromGroupInfo(HashObject groupInfo) {
		return groupInfo["rewards"];
	}

	public static HashObject GetUserGroupInfoFromEvent(HashObject eventData) {
		int userGroupIndex = GetUserGroupIndexFromEvent(eventData);
		HashObject allGroupInfo = GetAllGroupInfoFromEvent(eventData);
		HashObject userGroupInfo = GetGroupInfoAtIndex(allGroupInfo, userGroupIndex);
		return userGroupInfo;
	}
	
	public static bool isScoreRewardsOpen(HashObject scoreRewards)
	{
		if(scoreRewards != null)
		{
			return scoreRewards.Table.Count != 0;			
		}
		return false;
	}

	public static HashObject GetGroupRewardsFromScoreRewards(HashObject scoreRewards)
	{
		HashObject score = new HashObject();
		
		for (int i = 0; i < scoreRewards.Table.Count; i++)
		{
			HashObject rankGroup = scoreRewards[_Global.ap + i];
			HashObject newRankGroup = new HashObject();
			newRankGroup["from"] = rankGroup["score"];
			newRankGroup["to"] = rankGroup["score"];
			
			HashObject rewardList = new HashObject(); 
			newRankGroup["list"] = rewardList;
			
			string[] rewards = (rankGroup["scoreReward"].Value as string).Replace("[", "").Split(new char[] {']'}, System.StringSplitOptions.RemoveEmptyEntries);
			
			for (int j = 0; j < rewards.Length; j++)
			{
				string[] reward = rewards[j].Split(':');
				rewardList[_Global.ap + j] = new HashObject();
				rewardList[_Global.ap + j]["id"] = new HashObject();
				rewardList[_Global.ap + j]["id"].Value = reward[0];
				rewardList[_Global.ap + j]["qty"] = new HashObject();
				rewardList[_Global.ap + j]["qty"].Value = reward[1];
			}
			
			score[_Global.ap + i] = newRankGroup;
		}
		
		return score;
	}

	public static HashObject GetGroupRewardsFromRewardConfig(HashObject rewardConfig) {
		HashObject ret = new HashObject();

		for (int i = 0; i < rewardConfig.Table.Count; i++)
		{
			HashObject rankGroup = rewardConfig[_Global.ap + i];
			HashObject newRankGroup = new HashObject();
			newRankGroup["from"] = rankGroup["fromRank"];
			newRankGroup["to"] = rankGroup["toRank"];

			HashObject rewardList = new HashObject(); 
			newRankGroup["list"] = rewardList;

			string[] rewards = (rankGroup["reward"].Value as string).Replace("[", "").Split(new char[] {']'}, System.StringSplitOptions.RemoveEmptyEntries);

			for (int j = 0; j < rewards.Length; j++)
			{
				string[] reward = rewards[j].Split(':');
				rewardList[_Global.ap + j] = new HashObject();
				rewardList[_Global.ap + j]["id"] = new HashObject();
				rewardList[_Global.ap + j]["id"].Value = reward[0];
				rewardList[_Global.ap + j]["qty"] = new HashObject();
				rewardList[_Global.ap + j]["qty"].Value = reward[1];
			}

			ret[_Global.ap + i] = newRankGroup;
		}

		return ret;
	}
}