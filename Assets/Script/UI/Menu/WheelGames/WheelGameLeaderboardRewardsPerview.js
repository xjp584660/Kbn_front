/*
 * @FileName:		WheelGameLeaderboardRewardsPerview.js
 * @Author:			xue
 * @Date:			2022-11-07 05:55:52
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	转盘 - 排行榜 - 奖励界面
 *
*/


public class WheelGameLeaderboardRewardsPerview extends KBNMenu {
    @Space(30) @Header("----------WheelGame - Leaderboard - Rewards - Perview----------")

    /* ---------- 顶部 菜单按钮 ---------- */
    @SerializeField private var menuHead_prefab: MenuHead;
    @HideInInspector public var menuHead: MenuHead;

    @SerializeField private var yMax: float;
    @SerializeField private var scrollView: ScrollView;

    @SerializeField private var item: WheelGameLeaderboardRewardsPerviewItem;

    /* 背景 */
    @SerializeField private var imagBG: Label;

    @Space(15) @Header("----------language key")
    @SerializeField private var langKey_menuTitle: String;


    /*存储所有预制体 在退出时方便进行清除*/
    private var rewards: System.Collections.Generic.List.<WheelGameLeaderboardRewardsPerviewItem>;

    @Space(20)/*字符串*/
    @SerializeField private var langKey_Rank_Reward_Title: String;/*奖励*/

    public function Init() {
        super.Init();


        menuHead = GameObject.Instantiate(menuHead_prefab);
        menuHead.l_title.mystyle.wordWrap = true;
        menuHead.Init();
        menuHead.btn_left.SetVisible(true);
        menuHead.btn_back.SetVisible(false);
        menuHead.btn_left.OnClick = function () {
            MenuMgr.getInstance().PopMenu("WheelGameLeaderboardRewardsPerview");
        };

        imagBG.Init();
        scrollView.Init();

    }

    public function DrawBackground() {
        if (menuHead != null) {
            menuHead.Draw();
        }
    }

    public function DrawItem() {

        if (!visible) return;
        imagBG.Draw();
        frameTop.Draw();
        scrollView.Draw();
    }

    public function OnPush(param: Object) {
        super.OnPush(param);

        menuHead.setTitle(Datas.getArString(langKey_menuTitle));
        scrollView.clearUIObject();

        var y: float = yMax;

        rewards = new System.Collections.Generic.List.<WheelGameLeaderboardRewardsPerviewItem>();

        var gds: KBN.GDS_ExpeditionRankReward = KBN.GameMain.GdsManager.GetGds.<KBN.GDS_ExpeditionRankReward>();
        var rewardsData: System.Collections.Generic.List.<KBN.GDS_ExpeditionRankReward.ExpeditionRankReward> = gds.GetItems();


        for (var j = 0; j < rewardsData.Count; j++) {
            var reward = Instantiate(item) as WheelGameLeaderboardRewardsPerviewItem;
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
        menuHead.Update();
        scrollView.Update();
    }

    public function OnPop() {
        super.OnPop();
        TryDestroy(menuHead);
        menuHead = null;

        scrollView.clearUIObject();
        for (var i = 0; i < rewards.Count; i++) {
            rewards[i].OnPopOver();
        }
    }



}