/*
 * @FileName:		WheelGameLeaderboardItem.js
 * @Author:			xue
 * @Date:			2022-11-07 03:03:45
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	转盘 - 排行榜 - 个人信息面板
 *
*/


public class WheelGameLeaderboardBoardSelfItem extends UIObject {
	@Space(30) @Header("---------- WheelGame - Leaderboard - BoardSelf - Item ----------")


	@SerializeField private var l_Background: Label;
	@SerializeField private var l_Rank: Label;
	@SerializeField private var l_LeagueIcon: Label;
	@SerializeField private var l_Score: Label;
	@SerializeField private var l_language: Label;

	/*--- alliance --*/
	@SerializeField private var l_AllianceName1: Label;
	@SerializeField private var l_World: Label;


	/*--- individual --*/
	@SerializeField private var l_PlayerName: Label;
	@SerializeField private var l_AllianceName2: Label;


	@SerializeField private var emblem: AllianceEmblem;
	@SerializeField private var btnReward: Button;

	/*--- tip --*/
	@SerializeField private var l_Tip: SimpleLabel;

	@SerializeField private var mRank: PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard.League= null;



	public function Init() {
		super.Init();

		l_Background.Init();
		if (l_Background.mystyle.normal.background == null) {
			l_Background.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_hero_tiao", TextureType.DECORATION);
		}

		l_Tip.txt = KBN.Datas.getArString("AVA.leaderboard_noalliancenote");
		l_Tip.SetVisible(false);
		btnReward.setNorAndActBG("button_icon_item", "button_icon_item");
		btnReward.OnClick = new Action(OnRewardClick);
	}

	public function SetItemUIData(data: Object) {
		mRank = data as PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard.League;

		if (KBN.Alliance.singleton.hasGetAllianceInfo) {
			pri_setUIData();
		}
		else {
			KBN.Alliance.singleton.reqAllianceInfo(pri_setUIData);
		}
	}

	public function Draw(): int {
		if (!isVisible())
			return -1;
		GUI.BeginGroup(rect);
		l_Background.Draw();
		l_Rank.Draw();
		l_LeagueIcon.Draw();
		l_PlayerName.Draw();
		l_AllianceName1.Draw();
		l_AllianceName2.Draw();
		l_World.Draw();
		emblem.Draw();
		l_Score.Draw();
		btnReward.Draw();
		l_Tip.Draw();
		if (l_language != null)
			l_language.Draw();
		GUI.EndGroup();
		return -1;
	}

	private function pri_setUIData() {
		if (KBN.Alliance.singleton.MyAllianceId() <= 0) {
			l_AllianceName1.SetVisible(false);
			l_PlayerName.SetVisible(false);
			l_AllianceName2.SetVisible(false);
			l_World.SetVisible(false);
			emblem.SetVisible(false);
			if (l_language != null)
				l_language.SetVisible(false);
			l_Rank.SetVisible(false);
			l_LeagueIcon.SetVisible(false);
			l_Score.SetVisible(false);
			btnReward.SetVisible(false);
			l_Tip.SetVisible(true);
		}
		else {
			l_Tip.SetVisible(false);

			l_Rank.SetVisible(true);
			l_LeagueIcon.SetVisible(true);
			l_Score.SetVisible(true);
			emblem.SetVisible(true);
			if (l_language != null)
				l_language.SetVisible(true);

			if (mRank != null) {
				if (l_language != null) {
					var gds: KBN.DataTable.AllianceLanguage =
						KBN.GameMain.GdsManager.GetGds.<KBN.GDS_Alliancelanguage>().GetItemById(mRank.languageId);

					l_language.mystyle.normal.background =
						TextureMgr.instance().LoadTexture(gds == null ? "" : gds.flagicon, TextureType.ALLIANCELANGUAGE);

				}


				l_AllianceName1.SetVisible(false);
				l_World.SetVisible(false);
				l_PlayerName.SetVisible(true);
				l_AllianceName2.SetVisible(true);

				l_PlayerName.txt = KBN.GameMain.singleton.getSeed()["players"]["u" + KBN.Datas.singleton.tvuid()]["n"].Value.ToString();
				l_AllianceName2.txt = KBN.Alliance.singleton.MyAllianceName();

				l_LeagueIcon.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(mRank.leagueLevel), TextureType.DECORATION);
				l_Rank.txt = mRank.leagueRank <= 0 ? "---" : mRank.leagueRank.ToString();
				l_Score.txt = mRank.score <= 0 ? "---" : _Global.NumSimlify(mRank.score);
				btnReward.SetVisible(GameMain.singleton.HasSeasonLeagueReward);
				emblem.Data = AllianceEmblemMgr.instance.playerAllianceEmblem;
			}
		}
	}

	private function OnRewardClick() {
		//act == 1 : curseason, act == 2 lastseason
		var request: PBMsgReqAVALeagueLeaderboardReward.PBMsgReqAVALeagueLeaderboardReward =
			new PBMsgReqAVALeagueLeaderboardReward.PBMsgReqAVALeagueLeaderboardReward();

		KBN.UnityNet.RequestForGPB("leagueSeasonReward.php", request, OnGetRewardOk, null, false);
	}

	private function OnGetRewardOk(data: byte[]) {
		if (data == null) {
			return;
		}
		var response: PBMsgAVALeagueLeaderboardReward.PBMsgAVALeagueLeaderboardReward =
			KBN._Global.DeserializePBMsgFromBytes.<PBMsgAVALeagueLeaderboardReward.PBMsgAVALeagueLeaderboardReward>(data);

		for (var i: int = 0; i < response.leagueRewardItems.Count; i++)
		{
			MyItems.singleton.AddItem(response.leagueRewardItems[i].itemId, response.leagueRewardItems[i].itemNum);
		}
		GameMain.singleton.HasSeasonLeagueReward = false;
		btnReward.SetVisible(false);
		MenuMgr.instance.PushMessage(Datas.getArString("PVP.Event_Leaderboard_ClaimText"));
	}

}