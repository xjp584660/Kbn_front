using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using KBN;
public class AvaSeasonLeagueLeaderBoard : UIObject, IEventHandler
{
	public Label lblBgPic;
	public Label lblSeasonName;
	public Label lblEndTime;
	public Label lblCurLeague;
	public Label lblCurLeagueIcon;
	public Button btnSwitchRankList;
	public Label lblSwitchSeasonTips;
	public Button btnSwitchSeason;
	public Button btnSeasonInfo;
	public Button btnViewPrize;
	public Button btnSwitchLeagueGhost;
	public Button btnIndividualPerformance;

	public Input2Page page_navigator;
	
	public Label lblBackground;
	public Label lblTipColumns;
	public Label lblTipRank;
	public Label lblTipName;
	public Label lblTipScore;
	public Label lbl_noresult;
	public KBN.ScrollList scrollList;
	public ListItem itemTemplate;
	public AvaSeasonLeagueLeaderBoardSelfItem selfItem;
	public SimpleLabel lblTrackAllianceTipsBg;
	public SimpleLabel lblTrackAllianceTips;
	private bool m_hasUserRank = false;
	private long m_endTime;
	private bool m_isCurSeason;
	private bool m_isSeasonActive;
	private const int PAGESIZE = 10;

	public Label lblCutLine1;
	public Label lblCutLine2;

	public override void Init ()
	{
		base.Init ();
		m_isCurSeason = true;
		m_isSeasonActive = false;
		m_hasUserRank = false;
		SeasonLeagueMgr.instance ().CurShowLeague = GameMain.singleton.GetAllianceLeague ();
		SeasonLeagueMgr.instance ().CurSeasonNo = 1;

		page_navigator.Init();
		page_navigator.pageChangedHandler = new System.Action<int>(PageIndexChanged);
		scrollList.Init(itemTemplate);
		scrollList.itemDelegate = this;
		selfItem.Init ();

		lblBgPic.setBackground ("red_ditu",TextureType.DECORATION);
		lblTipRank.txt = Datas.getArString("AVA.LeagueLeaderboard_Rank");
		lblTipName.txt = Datas.getArString("AVA.LeagueLeaderboard_AllianceWorld");
		lblTipScore.txt = Datas.getArString("AVA.LeagueLeaderboard_BattleScore");

		lblCurLeague.txt = Datas.getArString ("AVA.LeagueLeaderboard_CurrentLeague");
		btnSwitchRankList.txt = Datas.getArString ("LeagueName.League_" + GameMain.singleton.GetAllianceLeague ());
		LayoutBtnSwitchRankList ();
		lblCurLeagueIcon.setBackground (SeasonLeagueMgr.instance().GetLeagueIconName(GameMain.singleton.GetAllianceLeague ()),TextureType.DECORATION);

		btnSwitchSeason.OnClick = new Action (OnSwitchSeason);
		btnSwitchSeason.txt = Datas.getArString("AVA.LeagueLeaderboard_LastSeason");

		btnSeasonInfo.OnClick = new Action (OnViewSeasonInfo);
		btnSeasonInfo.setNorAndActBG ("add_Golden", "add_Golden");
		btnSwitchRankList.OnClick = new Action (OnSwitchRankList);
		btnSwitchLeagueGhost.OnClick = new Action (OnSwitchToSelfRankList);

		float minWidth = 0.0f;
		float maxWidth = 0.0f;
		btnViewPrize.OnClick = new Action (OnViewPrize);
		btnViewPrize.txt = Datas.getArString("AVA.LeagueInfo_ViewPrize");
		btnViewPrize.mystyle.CalcMinMaxWidth (new GUIContent (btnViewPrize.txt), out minWidth, out maxWidth);
		btnViewPrize.rect.width = maxWidth + 5.0f;
		btnViewPrize.rect.x = 610 - btnViewPrize.rect.width;

		lbl_noresult.txt = Datas.getArString("Alliance.NO_Alliances");
		lbl_noresult.SetVisible (false);

		btnIndividualPerformance.txt = Datas.getArString("AVA.LeagueLeaderboard_Performance");
		btnIndividualPerformance.OnClick = new Action (OnOpenIndividualRankMenu);

		lblTrackAllianceTipsBg.Init();
		lblTrackAllianceTipsBg.setBackground("chat_help_DialogBox", TextureType.DECORATION);
		lblTrackAllianceTips.Init();
		lblTrackAllianceTips.txt = Datas.getArString("AVA.LeagueLeaderboard_TrackMyAlliance");
		Vector2 txtSize = lblTrackAllianceTips.mystyle.CalcSize(new GUIContent(lblTrackAllianceTips.txt));
		lblTrackAllianceTips.rect.width = lblTrackAllianceTips.mystyle.contentOffset.x + txtSize.x + 15;
		lblTrackAllianceTipsBg.rect = lblTrackAllianceTips.rect;

		RefreshTrackAllianceTipsStatus();
	}
	
	public void UpdateData(System.Object param)
	{
		
	}
	
	public void OnShow()
	{
		RequestAVALeaderboard(SeasonLeagueMgr.instance().CurSeasonNo,1,GameMain.singleton.GetAllianceLeague());
		RefreshTrackAllianceTipsStatus();
	}

	public void OnSwitchLeagueOK()
	{
		RequestAVALeaderboard(SeasonLeagueMgr.instance().CurSeasonNo,1,SeasonLeagueMgr.instance().CurShowLeague);
	}

	public void OnOpenIndividualRankMenu()
	{
		if (m_isCurSeason && !m_isSeasonActive)
		{
			ErrorMgr.singleton.PushError("", Datas.getArString("Alliance.NO_Alliances"), true, Datas.getArString("Common.OK"), null);
			return;
		}
		PBMsgReqAVALeagueLeaderboard.PBMsgReqAVALeagueLeaderboard request = new PBMsgReqAVALeagueLeaderboard.PBMsgReqAVALeagueLeaderboard ();
		//act =3: cur, act = 4 :last
		request.act = SeasonLeagueMgr.instance().CurSeasonNo + 2;
		request.pageNo = 1;
		request.leagueNo = 1;
		KBN.UnityNet.RequestForGPB("leagueSeason.php", request, OnGetAVAIndividualRankOK, null, false);
	}

	public void OnGetAVAIndividualRankOK(byte[] data)
	{
		if (data == null) 
		{
			return;
		}
		PBMsgAVALeagueUserInfoLeaderboard.PBMsgAVALeagueUserInfoLeaderboard response = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVALeagueUserInfoLeaderboard.PBMsgAVALeagueUserInfoLeaderboard>(data);

		MenuMgr.instance.PushMenu("AvaSeasonLeagueIndividualRankMenu",response,"trans_zoomComp");
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();
		scrollList.Clear();
		scrollList.ClearData2();
	}
	
	public override void Update ()
	{
		scrollList.Update ();
		page_navigator.Update();

		if(SeasonLeagueMgr.instance().Respose!= null && SeasonLeagueMgr.instance().Respose.season.endTimeSpecified)
		{

			long leftTime = 0;
			if(SeasonLeagueMgr.instance().Respose.season.startTime > GameMain.unixtime())
			{
				leftTime = SeasonLeagueMgr.instance().Respose.season.startTime - GameMain.unixtime();
				lblEndTime.txt = string.Format (Datas.getArString("AVA.LeagueLeaderboard_StartIn"),_Global.timeFormatStr(leftTime));
				m_isSeasonActive = false;
			}
			else if(SeasonLeagueMgr.instance().Respose.season.endTime > GameMain.unixtime())
			{
				leftTime = SeasonLeagueMgr.instance().Respose.season.endTime - GameMain.unixtime();
				lblEndTime.txt = string.Format (Datas.getArString("AVA.LeagueLeaderboard_SeasonCountdown"),_Global.timeFormatStr(leftTime));
				m_isSeasonActive = true;
			}
			else
			{
				lblEndTime.txt = Datas.getArString("AVA.LeagueLeaderboard_SeasonEnd");
				m_isSeasonActive = false;
			}
		}
		else
		{
			lblEndTime.txt = Datas.getArString("AVA.LeagueLeaderboard_NoSeason");
			m_isSeasonActive = false;
		}

	}
	
	public override int Draw ()
	{
		GUI.BeginGroup(rect);
		lblBgPic.Draw ();
		lblBackground.Draw();
		scrollList.Draw();
		btnSwitchRankList.Draw ();
		btnSwitchSeason.Draw ();
		btnSeasonInfo.Draw ();
		btnViewPrize.Draw ();
		btnIndividualPerformance.Draw ();
		lblCurLeagueIcon.Draw ();
		DrawTips();
		lblSeasonName.Draw ();
		lblEndTime.Draw ();
		lblCurLeague.Draw ();
		page_navigator.Draw();
		selfItem.Draw ();
		lblTrackAllianceTipsBg.Draw();
		lblTrackAllianceTips.Draw();
		lbl_noresult.Draw();
		btnSwitchLeagueGhost.Draw ();
		GUI.EndGroup();
		return -1;
	}
	
	private void DrawTips()
	{
		lblTipColumns.Draw();
		lblTipRank.Draw();
		lblTipName.Draw();
		lblTipScore.Draw();
		lblCutLine1.Draw ();
		lblCutLine2.Draw ();
	}
	
	public override void OnClear ()
	{
		base.OnClear ();
		
		scrollList.Clear();
	}
	
	public void handleItemAction(string action, object param)
	{
	}

	
	private void PageIndexChanged(int index)
	{
		RequestAVALeaderboard(SeasonLeagueMgr.instance().CurSeasonNo,index,SeasonLeagueMgr.instance ().CurShowLeague);
	}


	private void RequestAVALeaderboard(int act, int page,int league)
	{
		//act == 1 : curseason, act == 2 lastseason, act == 3 individualRank
		PBMsgReqAVALeagueLeaderboard.PBMsgReqAVALeagueLeaderboard request = new PBMsgReqAVALeagueLeaderboard.PBMsgReqAVALeagueLeaderboard ();
		request.act = act;
		request.pageNo = page;
		request.leagueNo = league;
		KBN.UnityNet.RequestForGPB("leagueSeason.php", request, OnGetAVALeaderBoardOK, null, false);
	}

	private void OnGetAVALeaderBoardOK(byte[] data)
	{
		if (data == null) 
		{
			return;
		}
		PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard response = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard>(data);
		SeasonLeagueMgr.instance ().Respose = response;
		SeasonLeagueMgr.instance ().CurShowLeague = response.curLeagueNo;
		btnSwitchRankList.txt = Datas.getArString ("LeagueName.League_" + SeasonLeagueMgr.instance ().CurShowLeague);
		lblSeasonName.txt = response.season.seasonName;
		m_endTime = response.season.endTime;
		RefreshCurLeagueStatus (response);
		if(response.leagueList.Count > 0)
		{
			lbl_noresult.SetVisible(false);
		}
		else
		{
			lbl_noresult.SetVisible(true);
		}
		page_navigator.setPages(response.curPage, response.totalPage);
		scrollList.SetData(response.leagueList);
		selfItem.SetItemUIData (response.userLeagueInfo);
		m_hasUserRank = (response.userLeagueInfo != null && response.userLeagueInfo.leagueRankSpecified && response.userLeagueInfo.leagueRank > 0);
		RefreshTrackAllianceTipsStatus();
	}

	public void RefreshTrackAllianceTipsStatus()
	{
		if (m_hasUserRank && PlayerPrefs.GetInt(Constant.PLAYER_PREFS.ALLIANCE_SEASON_LEADER_BOARD_TRACK + Datas.singleton.tvuid() + Datas.singleton.worldid(), 0) == 0)
		{
			lblTrackAllianceTipsBg.SetVisible(true);
			lblTrackAllianceTips.SetVisible(true);
		}
		else
		{
			lblTrackAllianceTipsBg.SetVisible(false);
			lblTrackAllianceTips.SetVisible(false);
		}
	}

	private void RefreshCurLeagueStatus(PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard pbMsgData)
	{
		lblCurLeagueIcon.setBackground (SeasonLeagueMgr.instance().GetLeagueIconName(pbMsgData.curLeagueNo), TextureType.DECORATION);
		if(pbMsgData.curLeagueNo == pbMsgData.userLeagueInfo.leagueLevel)
		{
			lblCurLeague.txt = Datas.getArString ("AVA.LeagueLeaderboard_PLayerLeague");
		}
		else
		{
			lblCurLeague.txt = Datas.getArString ("AVA.LeagueLeaderboard_CurrentLeague");
		}
		LayoutBtnSwitchRankList ();
	}

	private void LayoutBtnSwitchRankList()
	{
		btnSwitchRankList.rect.x = lblCurLeague.rect.x + lblCurLeague.GetWidth () + 3;
		float minWidth = 0.0f;
		float maxWidth = 0.0f;
		btnSwitchRankList.mystyle.CalcMinMaxWidth (new GUIContent (btnSwitchRankList.txt), out minWidth, out maxWidth);
		btnSwitchRankList.rect.width = maxWidth + 5.0f;
	}

	private void OnSwitchSeason()
	{
		m_isCurSeason = ! m_isCurSeason;
		if(m_isCurSeason)
		{
			SeasonLeagueMgr.instance ().CurSeasonNo = 1;
			btnSwitchSeason.txt = Datas.getArString("AVA.LeagueLeaderboard_LastSeason");
			RequestAVALeaderboard(SeasonLeagueMgr.instance().CurSeasonNo,1,GameMain.singleton.GetAllianceLeague());
		}
		else
		{
			SeasonLeagueMgr.instance ().CurSeasonNo = 2;
			btnSwitchSeason.txt = Datas.getArString("AVA.LeagueLeaderboard_CurrentSeason");
			RequestAVALeaderboard(SeasonLeagueMgr.instance().CurSeasonNo,1,0);
		}
	}

	private void OnViewSeasonInfo()
	{
		MenuMgr.instance.PushMenu("AvaSeasonLeagueHelp",null);
	}

	private void OnSwitchRankList()
	{
		MenuMgr.instance.PushMenu("SwitchLeagueMenu",null,"trans_zoomComp");
	}

	private void OnSwitchToSelfRankList()
	{
		SeasonLeagueMgr.instance ().CurShowLeague = GameMain.singleton.GetAllianceLeague ();
		MenuMgr.instance.SendNotification (Constant.Notice.OnSelectLeagueOK);
		if (m_hasUserRank)
		{
			PlayerPrefs.SetInt(Constant.PLAYER_PREFS.ALLIANCE_SEASON_LEADER_BOARD_TRACK + Datas.singleton.tvuid() + Datas.singleton.worldid(), 1);
		}
		RefreshTrackAllianceTipsStatus();
	}

	private void OnViewPrize()
	{
		MenuMgr.instance.PushMenu("AvaSeasonLeagueRewardPreview",null,"trans_zoomComp");
	}

}
