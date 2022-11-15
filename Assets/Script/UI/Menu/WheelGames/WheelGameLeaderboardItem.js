/*
 * @FileName:		WheelGameLeaderboardItem.js
 * @Author:			xue
 * @Date:			2022-11-07 04:48:36
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	转盘 - 排行榜 - 物品项
 *
*/


public class WheelGameLeaderboardItem extends FullClickItem {
	@Space(30) @Header("---------- WheelGame - Leaderboard - Item ----------")

	@SerializeField private var l_Rank: Label;
	@SerializeField private var l_Name: Label;
	@SerializeField private var l_World: Label;
	@SerializeField private var l_Score: Label;
	@SerializeField private var l_ScoreDiff: Label;
	@SerializeField private var l_language: Label;
	@SerializeField private var emblem: AllianceEmblem;
	@SerializeField private var l_bg: Label;

	private var itemData: PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard.League = null;

	public function Init() {
		super.Init();

		btnDefault.alpha = 0.3f;
	}

	public function SetRowData(data: Object) {
		itemData = data as PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard.League;
		pri_setRank(itemData.leagueRank);
		l_Name.txt = itemData.allianceName;
		l_Score.txt = _Global.NumSimlify(itemData.score);
		l_World.txt = itemData.serverName;
		var gds: KBN.DataTable.AllianceLanguage = KBN.GameMain.GdsManager.GetGds.<KBN.GDS_Alliancelanguage>().GetItemById(itemData.languageId);
		if (l_language != null)
			l_language.mystyle.normal.background = TextureMgr.instance().LoadTexture(gds == null ? "" : gds.flagicon, TextureType.ALLIANCELANGUAGE);
		if (itemData.curBattleRank > itemData.preBattleRank) {
			l_ScoreDiff.txt = (itemData.preBattleRank - itemData.curBattleRank).ToString();
			l_ScoreDiff.SetNormalTxtColor(FontColor.Red);
		}
		else {
			l_ScoreDiff.txt = "+" + (itemData.preBattleRank - itemData.curBattleRank).ToString();
			l_ScoreDiff.SetNormalTxtColor(FontColor.Green);
		}
		l_ScoreDiff.SetVisible(itemData.preLeagueLevel != 0 && itemData.preBattleRank != itemData.curBattleRank);

		emblem.Data = new AllianceEmblemData(
			itemData.emblem.curBanner,
			itemData.emblem.curStyle,
			itemData.emblem.curStyleColor,
			itemData.emblem.curSymbol,
			itemData.emblem.curSymbolColor
		);

		btnSelect.OnClick = function () {
			OnClickItem(null);
		};
	}

	private function pri_setRank(rank: int) {
		if (rank == 1) {
			l_Rank.txt = "";
			l_Rank.image = TextureMgr.instance().LoadTexture("rank1_s", TextureType.ICON);
		}
		else if (rank == 2) {
			l_Rank.txt = "";
			l_Rank.image = TextureMgr.instance().LoadTexture("rank2_s", TextureType.ICON);
		}
		else if (rank == 3) {
			l_Rank.txt = "";
			l_Rank.image = TextureMgr.instance().LoadTexture("rank3_s", TextureType.ICON);
		}
		else {
			l_Rank.image = null;
			l_Rank.txt = itemData.leagueRank.ToString();
		}
	}

	public function DrawItem() {
		if (!visible) return;
		super.DrawItem();
		l_bg.Draw();
		l_Rank.Draw();
		l_Name.Draw();
		l_World.Draw();
		l_Score.Draw();
		l_ScoreDiff.Draw();
		if (l_language != null)
			l_language.Draw();
		emblem.Draw();
	}

	private function OnClickItem(paramL: Object) {
	}
	public function  SetIndexInList(index: int) {
		if (l_bg == null)
			return;
		if (index % 2 == 0) {
			l_bg.setBackground("rank_single_background", TextureType.FTE);
			l_bg.SetVisible(true);
		}
		else {
			l_bg.SetVisible(false);
		}
	}


}