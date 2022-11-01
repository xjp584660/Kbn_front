using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;
public class SeasonLeagueMgr 
{
	public class LeagueListItemData
	{
		public int leagueLevel;
		public bool bSelected;
	}
	private static SeasonLeagueMgr singleton;
	private PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard  m_LeagueList = new PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard ();
	private List<LeagueListItemData> leagueListForShow = new List<LeagueListItemData> ();
	public PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard Respose 
	{
		get;
		set;
	}
	public int CurShowLeague 
	{
		get;
		set;
	}

	public int CurSeasonNo 
	{
		//1: cur,2:last
		get;
		set;
	}

	public	static	SeasonLeagueMgr	instance()
	{
		if(singleton == null)
		{
			singleton = new SeasonLeagueMgr();
		}
		return singleton;
	}

	public PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard LeagueList
	{
		get
		{
			return m_LeagueList;
		}
	}
	
	public void RequestSeasonLeagueList(int act,int page)
	{
		PBMsgReqAVALeagueLeaderboard.PBMsgReqAVALeagueLeaderboard request = new PBMsgReqAVALeagueLeaderboard.PBMsgReqAVALeagueLeaderboard ();
		request.act = act;
		request.pageNo = page;

		UnityNet.RequestForGPB("leagueseason.php", request, OnGetLeagueListOk, null);
	}
	
	private void OnGetLeagueListOk(byte[] data)
	{
		if(data == null)
		{
			return;
		}
		m_LeagueList = _Global.DeserializePBMsgFromBytes<PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard>(data);


	} 

	public void InitLeagueListForShow()
	{
		leagueListForShow.Clear ();
		GDS_SeasonLeague gds = GameMain.GdsManager.GetGds<GDS_SeasonLeague>();
		List<GDS_SeasonLeague.LeagueReward> rewardsData = gds.GetItems();
		for(int i=0;i<rewardsData.Count;i++)
		{
			LeagueListItemData dataItem = new LeagueListItemData();
			dataItem.leagueLevel = rewardsData[i].Level;
			dataItem.bSelected = CurShowLeague==rewardsData[i].Level?true:false;
			leagueListForShow.Add(dataItem);
		}
	}

	public List<LeagueListItemData> GetLeagueListForShow()
	{
		List<LeagueListItemData> retList = new List<LeagueListItemData> ();
		GDS_SeasonLeague gds = GameMain.GdsManager.GetGds<GDS_SeasonLeague>();
		List<GDS_SeasonLeague.LeagueReward> rewardsData = gds.GetItems();
		for(int i=0;i<rewardsData.Count;i++)
		{
			LeagueListItemData dataItem = new LeagueListItemData();
			dataItem.leagueLevel = rewardsData[i].Level;
			dataItem.bSelected = CurShowLeague==rewardsData[i].Level?true:false;
			retList.Add(dataItem);
		}
		return retList;
	}

	public string GetLeagueIconName(int leagueLevel)
	{
		return "league_" + leagueLevel;
	}

	public float GetTrainTroopBuff(int leagueLevel)
	{
		GDS_SeasonLeague gds = GameMain.GdsManager.GetGds<GDS_SeasonLeague>();
		KBN.DataTable.SeasonLeague gdsItem = gds.GetItemById (leagueLevel);
		if(gdsItem != null)
		{
			float trainSpeed = (float)gdsItem.TRAINING_BUFF;
			return trainSpeed/100.0f;
		}
		return 0.0f;
	}

}
