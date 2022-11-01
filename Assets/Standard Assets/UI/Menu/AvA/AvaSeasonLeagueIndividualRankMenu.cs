using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class AvaSeasonLeagueIndividualRankMenu : PopMenu 
{
	public Label line;
	public Label rankTitleBg;
	public Label rankBg;
	public Label rank;
	public Label allianceMember;
	public Label battleScore;
	public Label descMinScore;
	public Label minScore;
	public Input2Page page_navigator;

	public ScrollList scrollList;
	public ListItem itemTemplate;
	public AvaSeasonLeagueIndividualRankSelfItem selfItem; 
	private PBMsgAVALeagueUserInfoLeaderboard.PBMsgAVALeagueUserInfoLeaderboard m_data = new PBMsgAVALeagueUserInfoLeaderboard.PBMsgAVALeagueUserInfoLeaderboard();

	public override void Init ()
	{
		base.Init ();
		title.txt = Datas.getArString ("AVA.LeagueLeaderboard_IndividualTitle");
		descMinScore.txt = Datas.getArString ("AVA.LeagueLeaderboard_IndividualRewardsScore");
		minScore.txt = GameMain.singleton.SelfSeasonRewardBar ().ToString ();
		minScore.rect.x = descMinScore.rect.x + descMinScore.GetWidth () + 5;
		rank.txt = Datas.getArString ("AVA.LeagueLeaderboard_IndividualTitleRank");
		allianceMember.txt = Datas.getArString ("AVA.LeagueLeaderboard_IndividualTitleName");
		battleScore.txt = Datas.getArString ("AVA.LeagueLeaderboard_IndividualTitleScore");
		rankBg.setBackground ("Quest_kuang", TextureType.DECORATION);
		rankTitleBg.setBackground ("Decorative_strips2",TextureType.DECORATION);
		scrollList.Init (itemTemplate);
		page_navigator.Init ();
		page_navigator.pageChangedHandler = new System.Action<int>(PageIndexChanged);
	}

	public override int Draw ()
	{
		return base.Draw ();
	}

	public override void Update ()
	{
		base.Update ();
		scrollList.Update ();
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();
		scrollList.Clear ();
	}

	public override void OnPush (object param)
	{
		m_data = param as PBMsgAVALeagueUserInfoLeaderboard.PBMsgAVALeagueUserInfoLeaderboard;
		if (m_data == null)
			return;
		base.OnPush (param);
		scrollList.SetData (m_data.leagueUserInfoList);
		selfItem.SetItemUIData (m_data.userInfo);
		page_navigator.setPages (m_data.curPage, m_data.totalPage);
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();
		title.Draw ();
		line.Draw ();
		rankBg.Draw ();
		rankTitleBg.Draw ();
		rank.Draw ();
		allianceMember.Draw ();
		battleScore.Draw ();
		descMinScore.Draw ();
		minScore.Draw ();
		scrollList.Draw ();
		selfItem.Draw ();
		page_navigator.Draw ();
	}

	public override void handleNotification (string type, object body)
	{
		base.handleNotification (type, body);
	}

	private void PageIndexChanged(int index)
	{
		PBMsgReqAVALeagueLeaderboard.PBMsgReqAVALeagueLeaderboard request = new PBMsgReqAVALeagueLeaderboard.PBMsgReqAVALeagueLeaderboard ();
		request.act = SeasonLeagueMgr.instance().CurSeasonNo + 2;
		request.pageNo = index;
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
		
		page_navigator.setPages(response.curPage, response.totalPage);
		scrollList.SetData(response.leagueUserInfoList);
		selfItem.SetItemUIData (response.userInfo);
	}
}