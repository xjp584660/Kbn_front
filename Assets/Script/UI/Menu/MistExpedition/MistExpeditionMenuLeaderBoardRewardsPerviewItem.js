/*
 * @FileName:		MistExpeditionMenuLeaderBoardRewardsPerviewItem.js
 * @Author:			xue
 * @Date:			2022-05-14 10:26:30
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 排行榜 - 奖励界面 - 奖品项
 *
*/


public class MistExpeditionMenuLeaderBoardRewardsPerviewItem extends UIObject {

	@Space(30) @Header("----------MistExpedition - LeaderBoard - RewardsPerview - Item----------")

	private var RewardItema: AvaRewardsPreviewIndividualRewardItem;


	@SerializeField private var lbFrame: SimpleLabel;
	@SerializeField private var lbTitle: SimpleLabel;

	@SerializeField private var eapTextOffset: Vector2 = new Vector2(46, 0);

	@SerializeField private var itemList: UIList;

	@SerializeField private var itemTemplate: AvaRewardsPreviewIndividualRewardItem;


	@Space(20)/*字符串*/
	@SerializeField private var langKey_Reward_RankTitle: String;/*排名奖励: {0}-{1}*/
	@SerializeField private var langKey_Reward_RankTitle1: String;/*排名奖励: {0}*/

	public function   Init() {
		super.Init();

		lbFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Quest_kuang", TextureType.DECORATION);

		lbTitle.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Decorative_strips2", TextureType.DECORATION);


		itemList.Init();
		itemTemplate.Init();
	}

	public function  Draw(): int {
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);

		lbFrame.Draw();
		lbTitle.Draw();
		itemList.Draw();

		GUI.EndGroup();

		return -1;
	}

	public function   SetUIData(data: Object) {
		super.SetUIData(data);

		var leagueReward = data as KBN.GDS_SeasonLeague.LeagueReward;

		var avaReward = data as KBN.GDS_ExpeditionRankReward.ExpeditionRankReward;


		if (avaReward != null) {
			if (avaReward.MinScore == avaReward.MaxScore) {
				lbTitle.txt = String.Format(Datas.getArString(langKey_Reward_RankTitle1), avaReward.MinScore);
			} else {

				lbTitle.txt = String.Format(Datas.getArString(langKey_Reward_RankTitle), avaReward.MinScore, avaReward.MaxScore);
			}
		}
		else {
			var league_name: String = Datas.getArString("LeagueName.League_" + leagueReward.Level);
			if (leagueReward.MaxRank == leagueReward.MinRank) {

				lbTitle.txt = String.Format(Datas.getArString(langKey_Reward_RankTitle1), league_name, leagueReward.MaxRank);
			} else {

				lbTitle.txt = String.Format(Datas.getArString(langKey_Reward_RankTitle), league_name, leagueReward.MaxRank, leagueReward.MinRank);
			}
			
		}

		var itemData: String[] = (avaReward != null) ? _Global.GetStringListByString(avaReward.Items, "|") : _Global.GetStringListByString(leagueReward.Items, "|");

		for (var j = 0; j < itemData.Length; j++) {
			var item2: AvaRewardsPreviewIndividualRewardItem = Instantiate(itemTemplate) as AvaRewardsPreviewIndividualRewardItem;

			item2.SetUIData(itemData[j]);
			itemList.AddItem(item2);
		}

		lbFrame.rect.height = itemList.rect.yMax + 10;
		rect.height = lbFrame.rect.yMax;

		
	}

	public function  OnPopOver() {
		super.OnPopOver();
		itemList.Clear(true);
	}

}