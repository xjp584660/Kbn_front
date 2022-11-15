/*
 * @FileName:		WheelGameLeaderboardRewardsPerviewItem.js
 * @Author:			xue
 * @Date:			2022-11-08 05:53:59
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	转盘 - 排行榜 - 奖励界面 - 奖品项
 *
*/


public class WheelGameLeaderboardRewardsPerviewItem extends UIObject {

    @Space(30) @Header("---------- WheelGame - Leaderboard - Rewards - Perview - Item ----------")

	private var RewardItema: AvaRewardsPreviewIndividualRewardItem;

	/* background */
	@SerializeField private var lbBg: Label;
	@SerializeField private var lbTitles: Label[];
	@SerializeField private var titleBack: Label;
	@SerializeField private var titleFllow: Label;


	@SerializeField private var itemList: UIList;
	@SerializeField private var itemTemplate: AvaRewardsPreviewIndividualRewardItem;


	@Space(30) @Header(" Label 渲染下标 ")
	@SerializeField private var lbTitlesIdex: int;
	@Space(20)/*字符串*/
	@SerializeField private var langKey_Reward_RankTitle: String;/*排名奖励: {0}-{1}*/
	@SerializeField private var langKey_Reward_RankTitle1: String;/*排名奖励: {0}*/

	public function   Init() {
		super.Init();

		lbBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("contentBack", TextureType.DECORATION);

		for (var i: int = 0; i < lbTitles.length; i++) {
			lbTitles[i].mystyle.normal.background = TextureMgr.singleton.LoadTexture("eventCenterRank" + (i + 1), TextureType.DECORATION);
		}

		titleBack.mystyle.normal.background = TextureMgr.singleton.LoadTexture("titleBack", TextureType.DECORATION);
		titleFllow.mystyle.normal.background = TextureMgr.singleton.LoadTexture("flower", TextureType.DECORATION);

		itemList.Init();
		itemTemplate.Init();
	}

	public function  Draw(): int {
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);

		lbBg.Draw();
		itemList.Draw();
		titleBack.Draw();
		titleFllow.Draw();
		lbTitles[lbTitlesIdex].Draw();

		GUI.EndGroup();

		return -1;
	}

	public function   SetUIData(data: Object) {
		super.SetUIData(data);

		var leagueReward = data as KBN.GDS_SeasonLeague.LeagueReward;

		var avaReward = data as KBN.GDS_ExpeditionRankReward.ExpeditionRankReward;


		if (avaReward != null) {
			if (avaReward.MinScore == avaReward.MaxScore) {
				lbTitles[lbTitlesIdex].txt = String.Format(Datas.getArString(langKey_Reward_RankTitle1), avaReward.MinScore);
			} else {

				lbTitles[lbTitlesIdex].txt = String.Format(Datas.getArString(langKey_Reward_RankTitle), avaReward.MinScore, avaReward.MaxScore);
			}
		}
		else {
			var league_name: String = Datas.getArString("LeagueName.League_" + leagueReward.Level);
			if (leagueReward.MaxRank == leagueReward.MinRank) {

				lbTitles[lbTitlesIdex].txt = String.Format(Datas.getArString(langKey_Reward_RankTitle1), league_name, leagueReward.MaxRank);
			} else {

				lbTitles[lbTitlesIdex].txt = String.Format(Datas.getArString(langKey_Reward_RankTitle), league_name, leagueReward.MaxRank, leagueReward.MinRank);
			}

		}

		var itemData: String[] = (avaReward != null) ? _Global.GetStringListByString(avaReward.Items, "|") : _Global.GetStringListByString(leagueReward.Items, "|");

		for (var j = 0; j < itemData.Length; j++) {
			var item2: AvaRewardsPreviewIndividualRewardItem = Instantiate(itemTemplate) as AvaRewardsPreviewIndividualRewardItem;

			item2.SetUIData(itemData[j]);
			itemList.AddItem(item2);
		}

		lbBg.rect.height = itemList.rect.yMax + 10;
		rect.height = lbBg.rect.yMax;


	}

	public function  OnPopOver() {
		super.OnPopOver();
		itemList.Clear(true);
	}
}