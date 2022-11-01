using UnityEngine;
using System.Collections;
using System.Collections.Generic;


public class PvPToumamentInfoData
{
	public static PvPToumamentInfoData singleton;
	public int noticeIndexOfSelectTab;
	public int sharePageSize=20;//20......
	public int rankPageSize=20;
	//ToumamentInfoData
	public string deadLineTime;
	public string labelIntroduction;
	public long actionStartTime;
	public long actionEndTime;
	public List<ToumamentInfoItemData> itemDataList;
	public bool isPopMenu = false;
	public PBMsgWorldMapEvent.PBMsgWorldMapEvent m_tournamentInfo;
	public PBMsgWorldMapEvent.PBMsgWorldMapEvent m_tournamentFinishInfo;
	//SharedTileInfoData
	public PBMsgWorldMapShare.PBMsgWorldMapShare shareData;
	//ToumamentRankData
	public PBMsgLeaderboard.PBMsgLeaderboard rankData;
	//WorldMapMarchData
	public PBMsgWorldMapMarch.PBMsgWorldMapMarch marchData;

	public List<PBMsgWorldMapUserStatus.PBMsgWorldMapUserStatus.unit> m_troopRestoredList = new List<PBMsgWorldMapUserStatus.PBMsgWorldMapUserStatus.unit>();
	public List<PBMsgWorldMapEvent.PBMsgWorldMapEvent.Reward> rewardsList=new List<PBMsgWorldMapEvent.PBMsgWorldMapEvent.Reward>();
	public int indexOfSelectTabForToumament=0;

	public PvPToumamentInfoData()
	{
		itemDataList = new List<ToumamentInfoItemData> (); 
		shareData = new PBMsgWorldMapShare.PBMsgWorldMapShare ();
		rankData = new PBMsgLeaderboard.PBMsgLeaderboard ();
		marchData = new PBMsgWorldMapMarch.PBMsgWorldMapMarch ();
	}

	public	static	PvPToumamentInfoData instance()
	{
		if( singleton == null ) 
		{
			singleton = new PvPToumamentInfoData();
			if(singleton != null)
			{
				singleton.InitDefault();
			}
		}
		return singleton;
	}

	public void InitDefault()
	{
	}


	public void PopUpNoticePad(int whichTab)
	{
		switch (whichTab) 
		{
			case 0:
				RequestToumamentInfo (true);
			break;

			case 1:
			PvPToumamentInfoData.instance().RequestSharedInfo(Constant.ReqPvPToumamentId.ShareList,1,sharePageSize,true);//
			break;

			case 2:
			PvPToumamentInfoData.instance().RequestRankInfo(Constant.ReqPvPToumamentId.AllianceLeaderboard,1,rankPageSize,true);//
			break;
		}
	}


	// Request the tournament basic info.
	public void RequestToumamentInfo()
	{
		RequestToumamentInfo (false);
	}

	public void RequestToumamentInfo(bool isPopMenu, bool showIndicator=true)
	{
		this.isPopMenu = isPopMenu;
		PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
		request.cmd=Constant.ReqPvPToumamentId.ReqEventList;
		request.subcmd = Constant.ReqPvPToumamentId.RewardsList;
		KBN.UnityNet.RequestForGPB("worldmap.php", request, OnToumamentInfoOK, OnError, !showIndicator);
	}

	public void RequestToumamentFinishInfo(bool showIndicator=true)
	{
		this.isPopMenu = isPopMenu;
		PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
		request.cmd=1;
		request.subcmd = 2;
		HashObject seed = KBN.GameMain.singleton.getSeed();
		if( seed == null ) {
			return;
		}
		if( seed["worldmap"]["actId"] == null ) {
			return;
		}
		if (KBN._Global.INT32(seed["worldmap"]["actId"].Value) != 0) 
		{
			int actId=KBN._Global.INT32(seed ["worldmap"] ["actId"].Value);
			request.actId=actId;
		}

		KBN.UnityNet.RequestForGPB("worldmap.php", request, OnFinishedToumamentInfoOK, OnError, !showIndicator);
	}

	// 
	public void RequestSharedInfo(int subcmd,int page,int pageSize)
	{
		if( m_tournamentInfo != null && m_tournamentInfo.actId == 0 ) {
			return;
		}
		RequestSharedInfo(subcmd,page,pageSize,false);
	}

	public void RequestSharedInfo(int subcmd,int page,int pageSize,bool isPopMenu)
	{
		if( m_tournamentInfo != null && m_tournamentInfo.actId == 0 ) {
			return;
		}
		this.isPopMenu = isPopMenu;
		PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
		request.cmd = Constant.ReqPvPToumamentId.ReqShareInfo;
		request.subcmd = subcmd;
		request.page = page;
		request.pageSize = pageSize;
		if (subcmd == Constant.ReqPvPToumamentId.ShareList) 
		{
			KBN.UnityNet.RequestForGPB ("worldmap.php", request, OnSharedInfoAllOK, OnError);
		} 
		else if (subcmd == Constant.ReqPvPToumamentId.ShareMyList) 
		{
			KBN.UnityNet.RequestForGPB ("worldmap.php", request, OnSharedInfoMyLotOK, OnError);	
		}
	}


	public void RequestSharedTile(int xcoord,int ycoord)
	{
		if( m_tournamentInfo != null && m_tournamentInfo.actId == 0 ) {
			return;
		}
		PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
		request.cmd = Constant.ReqPvPToumamentId.ReqShareInfo;
		request.subcmd = Constant.ReqPvPToumamentId.ShareTile;
		request.xcoord = xcoord;
		request.ycoord = ycoord;
		//KBN.UnityNet.RequestForGPB("worldmap.php", request, OnSharedTileOK, OnError);
	}


	public void RequestAbandonTileByTileId(int tileId)
	{
		if( m_tournamentInfo != null && m_tournamentInfo.actId == 0 ) {
			return;
		}
		PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
		request.cmd = Constant.ReqPvPToumamentId.ReqMarchList;
		request.subcmd = 2;
		request.tileId.Add(tileId);
		KBN.UnityNet.RequestForGPB("worldmap.php", request, OnAbandonTileOK, OnError);
	}


	public void RequestDeleteAllianceSharedTile(ArrayList tileIdArray)
	{
		if( m_tournamentInfo != null && m_tournamentInfo.actId == 0 ) {
			return;
		}
		PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
		request.cmd = Constant.ReqPvPToumamentId.ReqShareInfo;
		request.subcmd = 4;
		for (int i=0; i<tileIdArray.Count; i++) 
		{
			request.tileId.Add ((int)tileIdArray[i]);
		}
		KBN.UnityNet.RequestForGPB("worldmap.php", request, OnDeleteSharedOK, OnError);
	}

	public void RequestDeletePlayerSharedTile(ArrayList tileIdArray)
	{
		if( m_tournamentInfo != null && m_tournamentInfo.actId == 0 ) {
			return;
		}
		PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
		request.cmd = Constant.ReqPvPToumamentId.ReqShareInfo;
		request.subcmd = 6;
		for (int i=0; i<tileIdArray.Count; i++) 
		{
			request.tileId.Add ((int)tileIdArray[i]);
		}
		KBN.UnityNet.RequestForGPB("worldmap.php", request, OnDeleteSharedOK, OnError);
	}

	public void RequestSetAllianceOrderSharedTile(ArrayList tileIdArray)
	{
		if( m_tournamentInfo != null && m_tournamentInfo.actId == 0 ) {
			return;
		}
		PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
		request.cmd = Constant.ReqPvPToumamentId.ReqShareInfo;
		request.subcmd = 5;

		for (int i=0; i<tileIdArray.Count; i++) 
		{
			request.tileId.Add ((int)tileIdArray[i]);
		}
		KBN.UnityNet.RequestForGPB("worldmap.php", request, OnSetOrderOK, OnError);
	}

	public void RequestSetPlayerOrderSharedTile(ArrayList tileIdArray)
	{
		if( m_tournamentInfo != null && m_tournamentInfo.actId == 0 ) {
			return;
		}
		PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
		request.cmd = Constant.ReqPvPToumamentId.ReqShareInfo;
		request.subcmd = 7;
		
		for (int i=0; i<tileIdArray.Count; i++) 
		{
			request.tileId.Add ((int)tileIdArray[i]);
		}
		KBN.UnityNet.RequestForGPB("worldmap.php", request, OnSetOrderOK, OnError);
	}

	public void RequestRankInfo(int subcmd,int page,int pageSize)
	{
		/*if( m_tournamentInfo.actId == 0 ) {
			return;
		}*/
		RequestRankInfo (subcmd, page, pageSize, false);
	}

	public void RequestRankInfo(int subcmd,int page,int pageSize,bool isPopMenu)
	{
		this.isPopMenu = isPopMenu;
		PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
		request.cmd = Constant.ReqPvPToumamentId.ReqRankList;
		request.subcmd = subcmd;
		request.page = page;
		request.pageSize = pageSize;
		if(subcmd==Constant.ReqPvPToumamentId.AllianceLeaderboard)
		{
			KBN.UnityNet.RequestForGPB("worldmap.php", request, OnRankInfoAllianOK, OnError);
		}
		else if(subcmd==Constant.ReqPvPToumamentId.PlayerLeaderboard)
		{
			KBN.UnityNet.RequestForGPB("worldmap.php", request, OnRankInfoIndivOK, OnError);
		}
	}


	public void RequestWorldMapMarch(int currentcityid)
	{
		/*if( m_tournamentInfo.actId == 0 ) {
			return;
		}*/
		PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
		request.cmd = Constant.ReqPvPToumamentId.ReqMarchList;
		request.subcmd = Constant.ReqPvPToumamentId.ReqMyCityMarchList;
		//int currentcityid = KBN.GameMain.singleton.getCurCityId();
		request.toCityId = currentcityid;
		KBN.UnityNet.RequestForGPB("worldmap.php", request, OnWorldMapMarchOK, OnError);
	}

	public void OnError(string errorMessage, string errorCode)
	{
		//Oops(Datas.getArString(string.Format("Error.err_{0}", errorCode)));
		if(string.IsNullOrEmpty(errorMessage))
			return;
		Debug.LogWarning (errorMessage);
	}

	private void UpdateActivityInfoData() {

		actionStartTime = m_tournamentInfo.starttime;
		actionEndTime = m_tournamentInfo.endtime;
		// Bonus
		// Format: bonusGroup[minLevel][bonusID] = bonusNum
		HashObject bonusGroup = new HashObject();
		if (indexOfSelectTabForToumament == 0) 
		{
			rewardsList=m_tournamentInfo.rewards;
		}
		else if(indexOfSelectTabForToumament == 1)
		{
			rewardsList=m_tournamentInfo.playerRewards;
		}

		for(int i=0; i<rewardsList.Count; i++)
		{
			int minLevel = rewardsList[i].min;
			int bonusID = rewardsList[i].itemId;
			int bonusNum = rewardsList[i].num;
			string key = ""+minLevel;
			if( bonusGroup[key] == null ) {
				bonusGroup[key] = new HashObject();
			}
			string key2 = ""+bonusID;
			if( bonusGroup[key][key2] == null ) {
				bonusGroup[key][key2] = new HashObject();
				bonusGroup[key][key2].Value = "0";
			}
			bonusGroup[key][key2].Value = ""+( KBN._Global.INT32( bonusGroup[key][key2].Value ) + bonusNum );
		}
		
		
		itemDataList.Clear();
		string[] keys = KBN._Global.GetObjectKeys( bonusGroup );
		SortKeys (keys);
		int curMin = 1;
		for(int i=0; i<keys.Length; i++)
		{
			ToumamentInfoItemData r = new ToumamentInfoItemData();
			
			r.m_bonus = new HashObject();
			
			//string[] keys2 = KBN._Global.GetObjectKeys( bonusGroup[keys[i]] );
			string[] keys2 = KBN._Global.GetObjectKeys( bonusGroup[keys[i]] );
			for( int j = 0; j < keys2.Length; ++j ) {
				
				r.m_bonus[keys2[j]] = new HashObject();
				r.m_bonus[keys2[j]].Value = bonusGroup[keys[i]][keys2[j]].Value;
			}
			
			r.itemDataRankTexName = "Rank_"+(i+1);
			r.itemDataTitle = string.Format(KBN.Datas.getArString("PVP.Event_Detail_Rank"),curMin+"",FindMaxByMin(curMin)+"");
			curMin=FindMaxByMin(curMin)+1;
			r.index=i+1;
			
			itemDataList.Add(r);
		}
		
		//
		labelIntroduction = KBN.Datas.getArString ("PVP.Event_Detail_Desc");
		if (isPopMenu) 
		{
			noticeIndexOfSelectTab=0;
			KBN.MenuMgr.instance.PushMenu ("NoticePadMenu", Constant.Building.NOTICEPAD, "trans_horiz" );
			isPopMenu=false;
		}
		
		//test
		/*
		ToumamentInfoItemData rr = new ToumamentInfoItemData();
		rr.index = 15;
		itemDataList.Add(rr);
		rr = new ToumamentInfoItemData();
		rr.index = 16;
		itemDataList.Add(rr);
		rr = new ToumamentInfoItemData();
		rr.index = 177;
		itemDataList.Add(rr);
		*/
		//test end
		KBN.MenuMgr.instance.SendNotification(Constant.PvPResponseOk.ToumamentInfoOK,null);
	}

	private void OnFinishedToumamentInfoOK( byte[] data ) {
		if( data == null ) {
			return;
		}
		if(m_tournamentInfo.actId == 0)//last act end  no act announce in advance
		{
			m_tournamentInfo = KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapEvent.PBMsgWorldMapEvent>(data);
		}
		else//last act end  and a new act announce in advance
		{
			m_tournamentFinishInfo=KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapEvent.PBMsgWorldMapEvent>(data);
		}
		UpdateActivityInfoData();
	}
	
	private void OnToumamentInfoOK(byte[] data) {
		if( data == null ) {
			return;
		}
		// Main Info
		m_tournamentInfo = KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapEvent.PBMsgWorldMapEvent>(data);
		long timeNow = KBN.GameMain.unixtime ();
		long timeStart = m_tournamentInfo.starttime;
		if (timeNow<timeStart||m_tournamentInfo.actId == 0) // The last acitvity would be finished. The new acitvity has not start yet.
		{
			RequestToumamentFinishInfo(true);
			return;
		}
		UpdateActivityInfoData();
	}

	public int FindMaxByMin(int min)
	{
		for (int i=0; i<rewardsList.Count; i++) 
		{
			if(rewardsList[i].min==min)
			{
				return rewardsList[i].max;
			}
		}
		return min;
	}


	private void SortKeys(string[] s)
	{
		string temp;
		for (int i=0; i<s.Length; i++) 
		{
			for(int j=i;j<s.Length;j++)
			{
				if(KBN._Global.INT32(s[i])>KBN._Global.INT32(s[j]))
				{
					temp=s[i];
					s[i]=s[j];
					s[j]=temp;
				}
			}
		}
	}

	public void OnDeleteSharedOK(byte[] data) {
		KBN.MenuMgr.instance.SendNotification(Constant.PvPResponseOk.DeleteSharedOK);
	}

	public void OnSetOrderOK(byte[] data) {
		KBN.MenuMgr.instance.SendNotification(Constant.PvPResponseOk.SetOrderOK);
	}

	public void OnSharedInfoAllOK(byte[] data) {
		if( data == null ) {
			return;
		}
		PBMsgWorldMapShare.PBMsgWorldMapShare tdata = KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapShare.PBMsgWorldMapShare>(data);
		this.shareData = tdata;
		//NoticePadMenu.SharedInfoList.SetData (tdata.items.ToArray);
		if (isPopMenu) 
		{
			noticeIndexOfSelectTab=1;
			KBN.MenuMgr.instance.PushMenu ("NoticePadMenu", Constant.Building.NOTICEPAD);
			isPopMenu=false;
		}
		KBN.MenuMgr.instance.SendNotification(Constant.PvPResponseOk.SharedPageAllOK);
	}

	public void OnSharedInfoMyLotOK(byte[] data) {
		if( data == null ) {
			return;
		}
		PBMsgWorldMapShare.PBMsgWorldMapShare tdata = KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapShare.PBMsgWorldMapShare>(data);
		this.shareData = tdata;
		if (isPopMenu) 
		{
			noticeIndexOfSelectTab=1;
			KBN.MenuMgr.instance.PushMenu ("NoticePadMenu", Constant.Building.NOTICEPAD);
			isPopMenu=false;
		}
		KBN.MenuMgr.instance.SendNotification(Constant.PvPResponseOk.SharedPageMyLotOK);
	}

	public void OnAbandonTileOK(byte[] data) {
		KBN.MenuMgr.instance.SendNotification(Constant.PvPResponseOk.AbandonTileOK);
		if( data == null ) {
			return;
		}
	}

	public void OnRankInfoAllianOK(byte[] data) {
		if( data == null ) {
			return;
		}
		PBMsgLeaderboard.PBMsgLeaderboard tdata = KBN._Global.DeserializePBMsgFromBytes<PBMsgLeaderboard.PBMsgLeaderboard>(data);
		this.rankData = tdata;
		if (isPopMenu) 
		{
			noticeIndexOfSelectTab=2;
			KBN.MenuMgr.instance.PushMenu ("NoticePadMenu", Constant.Building.NOTICEPAD);
			isPopMenu=false;
		}
		KBN.MenuMgr.instance.SendNotification(Constant.PvPResponseOk.RankPageAllianOK);
	}

	public void OnRankInfoIndivOK(byte[] data) {
		if( data == null ) {
			return;
		}
		PBMsgLeaderboard.PBMsgLeaderboard tdata = KBN._Global.DeserializePBMsgFromBytes<PBMsgLeaderboard.PBMsgLeaderboard>(data);
		this.rankData = tdata;
		if (isPopMenu) 
		{
			noticeIndexOfSelectTab=2;
			KBN.MenuMgr.instance.PushMenu ("NoticePadMenu", Constant.Building.NOTICEPAD);
			isPopMenu=false;
		}
		KBN.MenuMgr.instance.SendNotification(Constant.PvPResponseOk.RankPageIndiOK);
	}


	public void OnWorldMapMarchOK(byte[] data) {
		if( data == null ) {
			return;
		}
		PBMsgWorldMapMarch.PBMsgWorldMapMarch tdata = KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapMarch.PBMsgWorldMapMarch>(data);
		this.marchData = tdata;
		KBN.MenuMgr.instance.SendNotification(Constant.PvPResponseOk.WorldMapMarchOK);
	}

	public void OnWorldMapTroopRestoreDataOK( byte[] rawData ) {
		if( rawData == null ) {
			return;
		}
		PBMsgWorldMapUserStatus.PBMsgWorldMapUserStatus d = KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapUserStatus.PBMsgWorldMapUserStatus>(rawData);
		m_troopRestoredList = d.data;
		KBN.MenuMgr.instance.SendNotification(Constant.PvPResponseOk.WorldMapTroopRestoreOK, m_troopRestoredList );
	}
}
