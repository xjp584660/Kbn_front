using UnityEngine;
using System.Collections;
using System;
using KBN;
public class AvaSeasonLeagueLeaderBoardSelfItem : UIObject
{
	public Label l_Background;
	public Label l_Rank;
	public Label l_LeagueIcon;
	public Label l_Score;
	public Label l_language;
	
	#region alliance
	public Label l_AllianceName1;
	public Label l_World;
	#endregion alliance
	
	#region individual
	public Label l_PlayerName;
	public Label l_AllianceName2;
	#endregion individual
	
	public AllianceEmblem emblem;
	public Button btnReward;
	#region tip
	public SimpleLabel l_Tip;
	#endregion tip

	private PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard.League mRank = null;



	public override void Init()
	{
		base.Init();
		
		l_Background.Init();
		if (l_Background.mystyle.normal.background == null)
		{
			l_Background.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_hero_tiao", TextureType.DECORATION);
		}
		
		l_Tip.txt = KBN.Datas.getArString("AVA.leaderboard_noalliancenote");
		l_Tip.SetVisible(false);
		btnReward.setNorAndActBG ("button_icon_item", "button_icon_item");
		btnReward.OnClick = new Action (OnRewardClick);
	}
	
	public void SetItemUIData(object data)
	{
		mRank = data as PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard.League;
		
		if (KBN.Alliance.singleton.hasGetAllianceInfo)
		{
			pri_setUIData();
		}
		else
		{
			KBN.Alliance.singleton.reqAllianceInfo(pri_setUIData);
		}
	}
	
	public override int Draw()
	{
		if (!isVisible())
			return -1;
		GUI.BeginGroup(rect);
		l_Background.Draw();
		l_Rank.Draw();
		l_LeagueIcon.Draw ();
		l_PlayerName.Draw();
		l_AllianceName1.Draw();
		l_AllianceName2.Draw();
		l_World.Draw();
		emblem.Draw();
		l_Score.Draw();
		btnReward.Draw ();
		l_Tip.Draw();
		if(l_language!=null)
			l_language.Draw();
		GUI.EndGroup();
		return -1;
	}
	
	private void pri_setUIData()
	{
		if (KBN.Alliance.singleton.MyAllianceId() <= 0)
		{
			l_AllianceName1.SetVisible(false);
			l_PlayerName.SetVisible(false);
			l_AllianceName2.SetVisible(false);
			l_World.SetVisible(false);
			emblem.SetVisible(false);
			if(l_language!=null)
				l_language.SetVisible(false);
			l_Rank.SetVisible(false);
			l_LeagueIcon.SetVisible(false);
			l_Score.SetVisible(false);
			btnReward.SetVisible(false);
			l_Tip.SetVisible(true);
		}
		else
		{
			l_Tip.SetVisible(false);
			
			l_Rank.SetVisible(true);
			l_LeagueIcon.SetVisible(true);
			l_Score.SetVisible(true);
			emblem.SetVisible(true);
			if(l_language!=null)
				l_language.SetVisible(true);
			
			if (mRank != null)
			{
				if(l_language!=null){
					KBN.DataTable.AllianceLanguage gds = KBN.GameMain.GdsManager.GetGds<KBN.GDS_Alliancelanguage>().GetItemById(mRank.languageId);
               	    l_language.mystyle.normal.background=TextureMgr.instance().LoadTexture(gds==null?"":gds.flagicon,TextureType.ALLIANCELANGUAGE);
				}
				

				l_AllianceName1.SetVisible(false);
				l_World.SetVisible(false);
				l_PlayerName.SetVisible(true);
				l_AllianceName2.SetVisible(true);
				
				l_PlayerName.txt = KBN.GameMain.singleton.getSeed()["players"]["u" + KBN.Datas.singleton.tvuid()]["n"].Value.ToString();
				l_AllianceName2.txt = KBN.Alliance.singleton.MyAllianceName();
				
				l_LeagueIcon.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(mRank.leagueLevel),TextureType.DECORATION);
				l_Rank.txt = mRank.leagueRank <= 0 ? "---" : mRank.leagueRank.ToString();
				l_Score.txt = mRank.score <= 0 ? "---" : _Global.NumSimlify(mRank.score);
				btnReward.SetVisible(GameMain.singleton.HasSeasonLeagueReward);
				emblem.Data = AllianceEmblemMgr.instance.playerAllianceEmblem;
			}
		}
	}

	private void OnRewardClick()
	{
		//act == 1 : curseason, act == 2 lastseason
		PBMsgReqAVALeagueLeaderboardReward.PBMsgReqAVALeagueLeaderboardReward request = new PBMsgReqAVALeagueLeaderboardReward.PBMsgReqAVALeagueLeaderboardReward ();

		KBN.UnityNet.RequestForGPB("leagueSeasonReward.php", request, OnGetRewardOk, null, false);
	}

	private void OnGetRewardOk(byte[] data)
	{
		if(data == null)
		{
			return;
		}
		PBMsgAVALeagueLeaderboardReward.PBMsgAVALeagueLeaderboardReward response = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVALeagueLeaderboardReward.PBMsgAVALeagueLeaderboardReward>(data);
		for(int i=0;i<response.leagueRewardItems.Count;i++)
		{
			MyItems.singleton.AddItem(response.leagueRewardItems[i].itemId,response.leagueRewardItems[i].itemNum);
		}
		GameMain.singleton.HasSeasonLeagueReward = false;
		btnReward.SetVisible (false);
		MenuMgr.instance.PushMessage(Datas.getArString("PVP.Event_Leaderboard_ClaimText"));
	}
}
