using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;

class AvaSeasonLeagueHelp : KBNMenu
{

	[SerializeField]
	private MenuHead menuHead;
	[SerializeField]
	private SimpleLabel lbDesc;
	[SerializeField]
	private SimpleLabel lbIndividualScore;
	[SerializeField]
	private SimpleLabel lbFrame;
	[SerializeField]
	private ScrollList scrollList;
	[SerializeField]
	private AvaSeasonLeagueHelpItem itemTemplate;

	public override void Init ()
	{
		base.Init ();

		menuHead.Init();
		menuHead.btn_getmore.SetVisible(false);	
		menuHead.l_gem.SetVisible(false);
		menuHead.rect.height = 150;
		menuHead.setTitle(Datas.getArString("AVA.LeagueInfo_HowToPlay_Title"));
		menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_ARROW);
		
		frameTop.rect = new Rect( 0, 70, frameTop.rect.width, frameTop.rect.height);

		lbDesc.txt = string.Format(Datas.getArString("AVA.LeagueInfo_HowToPlay_Desc"),GameMain.singleton.AllianceSeasonRewardBar(),GameMain.singleton.SelfSeasonRewardBar());
		lbIndividualScore.txt = string.Format(Datas.getArString("AVA.LeagueInfo_HowToPlay_ScoreInfo"),SeasonLeagueMgr.instance().Respose.individualScore.ToString(),GameMain.singleton.SelfSeasonRewardBar());
		lbFrame.setBackground("square_blackorg", TextureType.DECORATION);

		scrollList.Init(itemTemplate);
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);

		GDS_SeasonLeague gds = GameMain.GdsManager.GetGds<GDS_SeasonLeague>();
		List<GDS_SeasonLeague.LeagueReward> rewardsData = gds.GetItems();

		scrollList.SetData(rewardsData);
		scrollList.ResetPos();
		scrollList.MoveToTop();
	}

	public override void Update ()
	{
		base.Update ();

		scrollList.Update();
	}

	protected override void DrawBackground ()
	{
		menuHead.Draw();
		if(Event.current.type != EventType.Repaint)
			return;
		bgStartY = 70;
		DrawMiddleBg();
		
		frameTop.Draw();
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();

		lbDesc.Draw();
		lbIndividualScore.Draw ();
		lbFrame.Draw();
		scrollList.Draw();
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

		scrollList.Clear();
	}
	
}
