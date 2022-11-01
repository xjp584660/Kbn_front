using System.Collections.Generic;
using System;
namespace KBN
{
	public class LeaderBoardItemInfo
	{
		public LeaderBoardItemInfo(int _userID, int _rank, long _score, string _displayName, int _allianceId, string _allianceName, string _reward)
		{
			userID = _userID;
			rank = _rank;
			score = _score;
			displayName = _displayName;
			allianceId = _allianceId;
			allianceName = _allianceName;
			if(_reward != null)
				reward = JSONParse.instance.Parse( _reward );
		}
		public int userID;
		public int rank;
		public long score;
		public string displayName;
		public int allianceId;
		public string allianceName;
		public HashObject reward;
	}

	public class LeaderBoardInfoBase
	{
		public enum LEADERBOARD_TYPE
		{
			LEADERBOARD_TYPE_PVE										= 0,
			LEADERBOARD_TYPE_PVE_ALLIANCE								= 1,
			LEADERBOARD_TYPE_CHAPTER									= 2,
			LEADERBOARD_TYPE_CHAPTER_ALLIANCE							= 3,
			LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_ALLIANCE_CURRENT		= 4,
			LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_ALLIANCE_LASTTIME		= 5,
			LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_PERSONAL_CURRENT		= 6,
			LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_PERSONAL_LASTTIME		= 7,
			LEADERBOARD_TYPE_ALLIANCEBOSS_BUFF							= 8,
			LEADERBOARD_TYPE_ALLIANCE_DONATION							= 9,
			LEADERBOARD_TYPE_ALLIANCE_AVA_SCORE							= 10,
		};
		public int PAGESIZE = 10;
		public LEADERBOARD_TYPE leaderBoardType;
		public int curFirstRank;
		public int curPage;
		
		public int total;
		public int position;
		public long score;
		public List<LeaderBoardItemInfo> leaderBoardList = new List<LeaderBoardItemInfo> ();
		public bool hasReward = false;
	}

	public class AllianceBossDamageLeaderBoard : LeaderBoardInfoBase
	{
		public enum ADD_DATA_INDEX
		{
			CUR_AL_REWARD = 0,
			LAST_AL_REWARD,
			CUR_PER_REWARD,
			LAST_PER_REWARD,
			MAX_COUNT
		};
		public bool curAlReward = false;
		public bool lastAlReward = false;
		public bool curPerReward = false;
		public bool lastPerReward = false;
		public bool isReceive = false;

		public void HasReward()
		{
			switch(leaderBoardType)
			{
			case LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_ALLIANCE_CURRENT:
				if(curAlReward)
					hasReward = true;
				break;
			case LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_ALLIANCE_LASTTIME:
				if(lastAlReward)
					hasReward = true;
				break;
			case LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_PERSONAL_CURRENT:
				if(curPerReward)
					hasReward = true;
				break;
			case LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_PERSONAL_LASTTIME:
				if(lastPerReward)
					hasReward = true;
				break;
			defalt:
				hasReward = false;
				break;
			}
		}
	}
}