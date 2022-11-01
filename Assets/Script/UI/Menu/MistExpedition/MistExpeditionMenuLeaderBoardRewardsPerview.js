/*
 * @FileName:		MistExpeditionMenuLeaderBoardRewardsPerview.js
 * @Author:			xue
 * @Date:			2022-04-25 10:10:31
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 排行榜 - 奖励界面
 *
*/


public class MistExpeditionMenuLeaderBoardRewardsPerview extends PopMenu {
    @Space(30) @Header("----------MistExpedition - LeaderBoard - RewardsPerview----------")


    @SerializeField private var yMax: float;
    @SerializeField private var scrollView: ScrollView;

    @SerializeField private var item: MistExpeditionMenuLeaderBoardRewardsPerviewItem;

    @SerializeField private var texture_line: Texture2D;


    /*存储所有预制体 在退出时方便进行清除*/
    private var rewards: System.Collections.Generic.List.<MistExpeditionMenuLeaderBoardRewardsPerviewItem>;

    @Space(20)/*字符串*/
    @SerializeField private var langKey_Rank_Reward_Title: String;/*奖励*/

    public function Init() {
        super.Init();

        title.txt = Datas.getArString(langKey_Rank_Reward_Title);
        scrollView.Init();

    }

    public function DrawBackground() {
        super.DrawBackground();
        drawTexture(texture_line, 45, 105, 490, 17);
    }

    public function DrawItem() {

        if (!visible) return;
        scrollView.Draw();
    }

    public function OnPush(param: Object) {
        super.OnPush(param);


        scrollView.clearUIObject();

        var y: float = yMax;

        rewards = new System.Collections.Generic.List.<MistExpeditionMenuLeaderBoardRewardsPerviewItem>();

        var gds: KBN.GDS_ExpeditionRankReward = KBN.GameMain.GdsManager.GetGds.<KBN.GDS_ExpeditionRankReward>();
        var rewardsData: System.Collections.Generic.List.<KBN.GDS_ExpeditionRankReward.ExpeditionRankReward> = gds.GetItems();


        for (var j = 0; j < rewardsData.Count; j++) {
            var reward = Instantiate(item) as MistExpeditionMenuLeaderBoardRewardsPerviewItem;
            reward.Init();
            reward.SetUIData(rewardsData[j]);
            reward.rect.y = y;
            y = reward.rect.yMax + 10;
            scrollView.addUIObject(reward);
            rewards.Add(reward);
        }
       

      

        scrollView.AutoLayout();
        scrollView.MoveToTop();
    }

    public function Update() {
        scrollView.Update();
    }

    public function OnPop() {
        super.OnPop();

        scrollView.clearUIObject();
        for (var i = 0; i < rewards.Count; i++) {
            rewards[i].OnPopOver();
        }
    }
}