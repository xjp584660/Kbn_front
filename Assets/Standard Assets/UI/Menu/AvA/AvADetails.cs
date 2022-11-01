using UnityEngine;
using System;
using System.Collections;
using KBN;

public class AvADetails : UIObject 
{
	public SimpleLabel l_TimeBg1;
	public SimpleLabel l_TimeBg2;
	public Label l_title1;
	public Label l_Time;
	public Button btnHelp;
	public Label l_DescBg;
	public Label l_Desc;
	public Label l_AvaEventBg;
	
	public Label l_title2;
	public Label l_Desc2;
	public Label l_DescBg2;

	public ComposedUIObj curStatus;
	public Label l_Deploying;
	public Label l_Line1;
	public Label l_Matching;
	public Label l_Line2;
	public Label l_Combat;
	public Label l_Line3;
	public Label l_Reward;

	public ComposedUIObj matchResult;
	public Label l_status1;
	public Label l_status2;
	public Label l_status3;
	public Label l_status4;
	public Label l_myAlliance;
	public Label l_VS;
	public Label l_enermyAlliance;
	public Label l_myRank;
	public Label l_RankTitle;
	public Label l_enermyRank;

	public Button btnPrizePreview;
	public Button btnOutPost;

	public ListItem avaResult;

	private PBMsgAvaMatchMakingResult.PBMsgAvaMatchMakingResult m_MatchResult = null;
	public void Init()
	{
		l_TimeBg1.setBackground ("Decorative_strips2", TextureType.DECORATION);
		l_TimeBg2.setBackground ("Decorative_strips2", TextureType.DECORATION);
		l_DescBg.setBackground ("square_black",TextureType.DECORATION);
		l_Desc.txt = Datas.getArString ("AVA.info_howtoplaydesc");
		l_title1.setBackground ("Black_Gradients", TextureType.DECORATION);
		l_title2.setBackground ("Brown_Gradients", TextureType.DECORATION);
		l_DescBg2.setBackground("square_black", TextureType.DECORATION);
		l_AvaEventBg.setBackground ("AvaEventBg",TextureType.DECORATION);

		l_title1.txt = Datas.getArString ("AVA.Detail_Title1");
		l_title2.txt = Datas.getArString ("AVA.Detail_Title2");
		btnPrizePreview.txt = Datas.getArString("Tournament.Prizebutton");
		if(GameMain.Ava.Event.CanEnterAvaMiniMap())
		{
			btnOutPost.txt = Datas.getArString ("AVA.battle_intobattlebtn");
		}
		else
		{
			btnOutPost.txt = Datas.getArString ("AVA.detailst_intooutpostbtn");
		}
		l_Desc2.txt = GameMain.Ava.Event.GetEventDesc ();
		l_Time.txt = GameMain.Ava.Event.GetLeftTimeTips ();
		btnOutPost.OnClick = new Action( OnOutpostBtnClick );
		btnPrizePreview.OnClick = new Action( OnPrizePreviewBtnClick );
		btnHelp.OnClick = new Action (OnHelp);
		btnOutPost.changeToBlueNew ();
		btnPrizePreview.changeToBlueNew ();

		l_status1.setBackground ("square_little", TextureType.DECORATION);
		l_status2.setBackground ("square_little", TextureType.DECORATION);
		l_status3.setBackground ("square_little", TextureType.DECORATION);
		l_status4.setBackground ("square_little", TextureType.DECORATION);
		l_Line1.setBackground ("between line_list_small", TextureType.DECORATION);
		l_Line2.setBackground ("between line_list_small", TextureType.DECORATION);
		l_Line3.setBackground ("between line_list_small", TextureType.DECORATION);
		l_Deploying.txt = Datas.getArString ("AVA.outpost_Deployment");
		l_Matching.txt = Datas.getArString ("AVA.outpost_Travelingtomap");
		l_Combat.txt = Datas.getArString ("AVA.outpost_Battle");
		l_Reward.txt = Datas.getArString ("AVA.outpost_Reward");
		l_VS.txt = Datas.getArString ("AVA.matchmakingresult_VS");
		l_RankTitle.txt = Datas.getArString ("AVA.matchmakingresult_AVARank");
	}

	public void UpdateData(object param)
	{
		avaResult.SetRowData (param);
		SetMatchData (GameMain.Ava.Event.MatchResult);
		RefreshStatus ();
	}

	public void SetMatchData(PBMsgAvaMatchMakingResult.PBMsgAvaMatchMakingResult matchData)
	{
		m_MatchResult = matchData;
		if(m_MatchResult == null)
		{
			return;
		}
		l_myAlliance.txt = m_MatchResult.myAllianceName;
		l_myRank.txt = m_MatchResult.myAllianceRank.ToString ();
		if(string.IsNullOrEmpty(m_MatchResult.enemyAllianceName))
		{
			l_enermyAlliance.txt = Datas.getArString("Chrome.match_noAlliance");
		}
		else
		{
			l_enermyAlliance.txt = m_MatchResult.enemyAllianceName;
		}
		if(string.IsNullOrEmpty(m_MatchResult.enemyAllianceName))
		{
			l_myRank.txt = Datas.getArString("Chrome.match_automaticVictory");
			l_enermyRank.txt =  string.Empty;
		}
		else
		{
			l_enermyRank.txt = m_MatchResult.enemyAllianceRank.ToString();
		}
	}

	public void RefreshStatus()
	{
		l_status1.SetNormalTxtColor (FontColor.Description_Dark);
		l_status2.SetNormalTxtColor (FontColor.Description_Dark);
		l_status3.SetNormalTxtColor (FontColor.Description_Dark);
		l_status4.SetNormalTxtColor (FontColor.Description_Dark);
		l_Deploying.SetNormalTxtColor (FontColor.Description_Dark);
		l_Matching.SetNormalTxtColor (FontColor.Description_Dark);
		l_Combat.SetNormalTxtColor (FontColor.Description_Dark);
		l_Reward.SetNormalTxtColor (FontColor.Description_Dark);
		switch(GameMain.Ava.Event.CurStatus)
		{
		case AvaEvent.AvaStatus.Prepare:
			l_status1.SetNormalTxtColor(FontColor.Milk_White);
			l_Deploying.SetNormalTxtColor(FontColor.Milk_White);
			break;
		case AvaEvent.AvaStatus.Match:
			l_status2.SetNormalTxtColor(FontColor.Milk_White);
			l_Matching.SetNormalTxtColor(FontColor.Milk_White);
			break;
		case AvaEvent.AvaStatus.Frozen:
		case AvaEvent.AvaStatus.Combat:
		case AvaEvent.AvaStatus.EndFrozen:
			l_status3.SetNormalTxtColor(FontColor.Milk_White);
			l_Combat.SetNormalTxtColor(FontColor.Milk_White);
			break;
		case AvaEvent.AvaStatus.ClaimReward:
		case AvaEvent.AvaStatus.Rewward:
			l_status4.SetNormalTxtColor(FontColor.Milk_White);
			l_Reward.SetNormalTxtColor(FontColor.Milk_White);
			break;
		}
	}

	public void Update()
	{
		l_Time.txt = GameMain.Ava.Event.GetLeftTimeTips ();
		if(GameMain.Ava.Event.CanEnterAvaMiniMap())
		{
			btnOutPost.txt = Datas.getArString ("AVA.battle_intobattlebtn");
		}
		else
		{
			btnOutPost.txt = Datas.getArString ("AVA.detailst_intooutpostbtn");
		}
	}

	public void Draw()
	{
		l_TimeBg1.Draw ();
		l_TimeBg2.Draw ();
		l_Time.Draw ();
		l_DescBg.Draw ();
		l_AvaEventBg.Draw ();
		l_Desc.Draw ();
		l_title1.Draw ();
		btnHelp.Draw ();

		l_DescBg2.Draw ();
		l_title2.Draw ();
		curStatus.Draw ();
		if(GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Match && m_MatchResult != null)
		{
			matchResult.Draw();
		}
		else
		{
			l_Desc2.Draw ();
		}
		btnPrizePreview.Draw();
		btnOutPost.Draw ();
		avaResult.Draw ();
	}

	private void OnPrizePreviewBtnClick()
	{
		MenuMgr.instance.PushMenu("AvaRewardsPreview", null, "trans_zoomComp");
	}

	private void OnOutpostBtnClick()
	{
		if( GameMain.Ava.Event.CanEnterAvaMiniMap() && GameMain.singleton.curSceneLev() != GameMain.AVA_MINIMAP_LEVEL)
		{
			MenuMgr.instance.pop2Menu("MainChrom");
			GameMain.Ava.Seed.RequestAvaSeed();
		}
		else
		{
			MenuMgr.instance.PushMenu("OutpostMenu", new Hashtable() { {"UseBackButton", true} });
		}
	}

	private void OnHelp()
	{
		InGameHelpSetting setting = new InGameHelpSetting();
		setting.type = "one_context";
		setting.key = Datas.getArString("AVA.eventdesc");
		setting.name = Datas.getArString("Event.AVA_AVAeventtitle");
		
		MenuMgr.instance.PushMenu("InGameHelp", setting, "trans_horiz");
	}
}
