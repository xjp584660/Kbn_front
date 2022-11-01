using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using KBN;

public class AllianceLeaderBoard : UIObject
{
	[SerializeField] private ScrollList leaderList;
	[SerializeField] private ListItem itemTemplate;
	
	[SerializeField] private SimpleLabel bg1;
	[SerializeField] private SimpleLabel bg2;

	[SerializeField] private SimpleLabel rank;
	[SerializeField] private SimpleLabel name;
	[SerializeField] private SimpleLabel score;

	[SerializeField] private AllianceBossSelectItem donation;
	[SerializeField] private AllianceBossSelectItem avaScore;

	[SerializeField] private Button4Page inputPager;

	[SerializeField] private LeaderBoardSelfItem selfItem;

	public override void Init()
	{
		base.Init ();

		leaderList.Init(itemTemplate);
		bg1.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("square_blackorg", TextureType.DECORATION);

		donation.Init();
		avaScore.Init();
		donation.txt = Datas.getArString("Alliance.members_performancedonationtab");
		avaScore.txt = Datas.getArString("Alliance.members_performance_AVAscoretab");
		donation.OnClick = handleSelectDonation;
		avaScore.OnClick = handleSelectAvaScore;

		inputPager.Init();
		inputPager.pageChangedHandler = new Action<int>(pageChangedHandler);

		rank.txt = Datas.getArString("Alliance.members_performance_rank");
		name.txt = Datas.getArString("Alliance.members_performance_name");
		score.txt = Datas.getArString("Alliance.members_performance_AVAscore");

		selfItem.Init ();
	}

	public override int Draw()
	{
		GUI.BeginGroup(rect);
		leaderList.Draw ();
		bg1.Draw ();
		bg2.Draw ();
		donation.Draw ();
		avaScore.Draw ();
		inputPager.Draw ();
		rank.Draw ();
		name.Draw ();
		score.Draw ();
		selfItem.Draw ();
		GUI.EndGroup();
		return -1;
	}

	public override void Update() 
	{
		leaderList.Update ();
	}

	public override void OnPopOver()
	{
		base.OnPopOver ();
		leaderList.Clear();
	}

	private void handleSelectDonation()
	{
		inputPager.setPages(1,1);
		donation.SetState(AllianceBossSelectItem.ItemState.SELECTED);
		avaScore.SetState(AllianceBossSelectItem.ItemState.UN_SELECTED);
		leaderList.Clear();
		ReqLeaderBoarInfo();
		score.txt = Datas.getArString("Alliance.members_performance_AVAdonation");
	}

	private void handleSelectAvaScore()
	{
		inputPager.setPages(1,1);
		avaScore.SetState(AllianceBossSelectItem.ItemState.SELECTED);
		donation.SetState(AllianceBossSelectItem.ItemState.UN_SELECTED);
		leaderList.Clear();
		ReqLeaderBoarInfo();
		score.txt = Datas.getArString("Alliance.members_performance_AVAscore");
	}

	private void pageChangedHandler(int _curPage)
	{
		inputPager.setPages(_curPage, inputPager.getTotalPage());
		ReqLeaderBoarInfo();
	}

	public void OnPush(object param)
	{
		handleSelectDonation ();
	}

	private void ReqLeaderBoarInfo()
	{
		int pageNum = inputPager.getCurPage();
		LeaderBoardInfoBase.LEADERBOARD_TYPE reqType;
		if(donation.isSelect)
			reqType = LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCE_DONATION;
		else
			reqType = LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCE_AVA_SCORE;
		KBN.LeaderBoardController.instance().ReqAllianceLeaderBoard(reqType, pageNum);
	}

	public void handleNotification(string type, object param)
	{
		switch(type)
		{
		case Constant.Notice.LEADERBOARD_DATA_OK:
		string paramStr = param as String;
			if(paramStr == "AllianceLeaderBoard")
			{
				RefreshMenu();
			}
			break;
		}
	}

	private void RefreshMenu()
	{
		LeaderBoardInfoBase Data = LeaderBoardController.instance().GetLeaderBoard() as KBN.LeaderBoardInfoBase;
		List<LeaderBoardItemInfo> dataList = Data.leaderBoardList;
		leaderList.Clear();
		leaderList.SetData(dataList.ToArray());
		leaderList.UpdateData();
		leaderList.ResetPos();
		leaderList.ForEachItem(
			item=>
			{
				AllianceLeaderBoardItem itemAlliance = item as AllianceLeaderBoardItem;
				itemAlliance.clickFunc = data=>{
					AllianceMemberVO memberInfo = new AllianceMemberVO();
					memberInfo.userId = (data as LeaderBoardItemInfo).userID;
					MenuMgr.instance.PushMenu("AllianceUserProfile",memberInfo,"trans_zoomComp");
				};
				return true;
			}
		);
		int maxPage = (Data.total-1)/Data.PAGESIZE + 1;
		inputPager.setPages(inputPager.getCurPage(),maxPage);
		selfItem.Rank = Data.position;
		selfItem.Name = GameMain.singleton.getUserName();
		selfItem.Score = Data.score;
	}

	private IEnumerable TestData()
	{
		List<LeaderBoardItemInfo> testHash= new List<LeaderBoardItemInfo>();
		testHash.Add (new LeaderBoardItemInfo(1231, 1, 222, "xhx", 1, "xhx123", null));
		testHash.Add (new LeaderBoardItemInfo(1231, 1, 222, "xhx", 2, "xhx123", null));
		testHash.Add (new LeaderBoardItemInfo(1231, 1, 222, "xhx", 3, "xhx123", null));
		testHash.Add (new LeaderBoardItemInfo(1231, 1, 222, "xhx", 4, "xhx123", null));
		testHash.Add (new LeaderBoardItemInfo(1231, 1, 222, "xhx", 5, "xhx123", null));
		testHash.Add (new LeaderBoardItemInfo(1231, 1, 222, "xhx", 6, "xhx123", null));
		testHash.Add (new LeaderBoardItemInfo(1231, 1, 222, "xhx", 7, "xhx123", null));
		testHash.Add (new LeaderBoardItemInfo(1231, 1, 222, "xhx", 8, "xhx123", null));
		return testHash.ToArray();
	}
}
