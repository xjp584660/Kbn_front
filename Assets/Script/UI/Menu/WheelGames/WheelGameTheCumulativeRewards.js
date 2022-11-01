/*
 * @FileName:		WheelGameTheCumulativeRewards.js
 * @Author:			xue
 * @Date:			2022-10-21 10:57:28
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	转盘 - 累计奖励
 *
*/


public class WheelGameTheCumulativeRewards extends UIObject {

    @Space(30) @Header("WheelGame TheCumulative Rewards")

    /* ---------- 顶部 菜单按钮 ---------- */

    @Space(30) @Header("Top 界面")/* Top 界面 */
    @SerializeField private var imagBG: Label;
    @SerializeField private var iconLabel: Label;
    @SerializeField private var nameLabel: Label;
    @SerializeField private var descLabel: Label;
    @SerializeField private var timerLabel: Label;

    @SerializeField private var helpBtn: Button;


    @Space(30) @Header("花费进度界面") /* 花费进度界面 */
    @SerializeField private var spendNGetImagBG: Label;
    @SerializeField private var spendNGetGemsSpentLabel: Label;
    @SerializeField private var spendNGetPercentBar: Label;
    @SerializeField private var spendNGetProgressBar: Label;

    /* 进度 档位 */
    @SerializeField private var spendNGetGraduations: List.<SpendNGetGraduation>;
    @SerializeField private var spendNGetGraduation: SpendNGetGraduation;


    @SerializeField private var bgImageName: String;
    @SerializeField private var gemsSpentKey: String;


    /* 奖励 界面 */
    @SerializeField private var rewardTip: Label;/* 奖励介绍 */
    @SerializeField private var wheelRewardItem: WheelGameTheCumulativeRewardItem;/* 奖励 Item */   
    @SerializeField private var scrollView: ScrollView;

    private var timerLabelPreStr = "";
    private var endTime: long = 0;
    public var eventId: String;

    public function Init() {

        var texMgr: TextureMgr = TextureMgr.instance();
        spendNGetImagBG.mystyle.normal.background = texMgr.LoadTexture(bgImageName, TextureType.DECORATION);
        spendNGetPercentBar.mystyle.normal.background = texMgr.LoadTexture("gems_progress-bar2", TextureType.DECORATION);
        spendNGetProgressBar.mystyle.normal.background = texMgr.LoadTexture("gems_progress-bar", TextureType.DECORATION);

        //helpBtn.OnClick =

        spendNGetGraduations = new List.<SpendNGetGraduation>();


        rewardTip.txt = Datas.getArString("SpendCurrency.RewardDesc");
        scrollView.Init();

    }

    public function Draw() {

        if (!visible) return;
        imagBG.Draw();

        iconLabel.Draw();
        nameLabel.Draw();
        descLabel.Draw();
        timerLabel.Draw();

        helpBtn.Draw();

        SpendNGetDraw();

        scrollView.Draw();

    }

    public function SpendNGetDraw() {
        spendNGetImagBG.Draw();
        spendNGetGemsSpentLabel.Draw();


        spendNGetPercentBar.Draw();
        spendNGetProgressBar.Draw();
        //spendNGetGraduations.Draw();

        DrawGraduations();
    }


    public function OnPop() {
        scrollView.clearUIObject();
        Clear();
    }

    public function SetData() {

        //iconLabel.tile = TextureMgr.instance().ItemSpt().GetTile(data.ImageName);
        nameLabel.txt = "218";
        descLabel.txt = "1212";

        timerLabelPreStr = Datas.getArString("EventCenter.StartsIn");


        reqGetEventDetailInfo(eventId, ViewEventDetail);
    }


    public function reqGetEventDetailInfo(eventId: String, resultFunc: Function) {
        var webData: List.<String>  = new List.<String>();
        webData.Add("detail");
        var language: String = Datas.singleton.getGameLanguageAb();
        webData.Add(language);
        webData.Add(eventId);    
        UnityNet.SpendNGetDetailInfo(webData.ToArray(), resultFunc, null);
    }

    @SerializeField private var percentBar: Rect;
    public function ViewEventDetail(data: HashObject): void {
        var MaxGemsCount: int = 0;
        var gemsSpent: int = 0;
        var progress: int = 0;
        var IsRepeatable: boolean;
        var dataIdList: List.<int>;
        var milestonesList: List.<GameEventDetailInfoSpendNGet.Milestone>;
        if (data != null && data.Contains("ok")) {

            gemsSpent = _Global.INT32(data["event"]["spendAndGet"]["gemsSpent"]);
            IsRepeatable = _Global.GetBoolean(data["event"]["spendAndGet"]["repeatable"]);

            var graduationArray: Array = _Global.GetObjectValues(data["event"]["spendAndGet"]["milestones"]);
            var maxCont: int = graduationArray.length - 1;
            dataIdList = List.<int>();
            milestonesList = new List.<GameEventDetailInfoSpendNGet.Milestone>();


            spendNGetGemsSpentLabel.txt = String.Format(Datas.getArString(gemsSpentKey), gemsSpent);
            endTime = _Global.INT64(data["event"]["rewardEndTime"]);

            var isEquivalence: boolean = spendNGetGraduations.Count == graduationArray.length;
            for (var i = 0; i < graduationArray.length; i++) {

                var result: HashObject = data["event"]["spendAndGet"]["milestones"][_Global.ap + i];
                var rewards: HashObject = result["rewards"];
                var gemsCount: int = _Global.INT32(result["gemsCount"]);
                var id: int = _Global.INT32(rewards["a0"]["rewardItemId"]);
                var claimableNum: int = _Global.INT32(rewards["a0"]["claimableItemNum"]);

                var reward: GameEventDetailInfoSpendNGet.Reward = new GameEventDetailInfoSpendNGet.Reward(id, claimableNum);
                var rewardList: List.<GameEventDetailInfoSpendNGet.Reward> = new List.<GameEventDetailInfoSpendNGet.Reward>();
                rewardList.Add(reward);
                var spednNGet: GameEventDetailInfoSpendNGet.Milestone = new GameEventDetailInfoSpendNGet.Milestone(id, gemsCount, rewardList);

                if (MaxGemsCount == 0) {
                    result = data["event"]["spendAndGet"]["milestones"][_Global.ap + maxCont];
                    MaxGemsCount = _Global.INT32(result["gemsCount"]);
                }

                dataIdList.Add(id);
                milestonesList.Add(spednNGet);

                var graduation: SpendNGetGraduation;
                if (isEquivalence) {
                    graduation = spendNGetGraduations[i] as SpendNGetGraduation;
                } else {
                    graduation = Instantiate(spendNGetGraduation) as SpendNGetGraduation;
                }
              
                var percentage: float = (gemsCount + 0.0f) / MaxGemsCount;
                graduation.rect.x = percentBar.x + percentage * percentBar.width - graduation.Offset.x;
                graduation.rect.y = percentBar.y - graduation.Offset.y - 0.5f * (graduation.graduationHeight - percentBar.height);
                graduation.Init();
                graduation.SetData(i, gemsCount);

                if (isEquivalence) {
                    spendNGetGraduations[i] = graduation;
                } else {
                    spendNGetGraduations.Add(graduation);
                }

            }

            if (IsRepeatable) {
                progress = gemsSpent / MaxGemsCount;
                if (gemsSpent >= MaxGemsCount && progress == 0) // Has completed the progress at least once
                {
                    progress = MaxGemsCount;
                }
            } else {
                progress = Mathf.Min(gemsSpent, MaxGemsCount);
            }
            


            var length: float = spendNGetPercentBar.rect.width - 35;
            var scale: float = Mathf.Max(Mathf.Min(1.0f, 1.0f * progress / MaxGemsCount), 0.0f);
            length *= scale;
            
            spendNGetProgressBar.rect = new Rect(spendNGetProgressBar.rect.x, spendNGetProgressBar.rect.y,
            length, spendNGetProgressBar.rect.height);

            SetScrollViewData(dataIdList.Count, dataIdList, milestonesList);

        } else {

            Debug.Log("<color=#00C0FFFF> 数据返回失败 </color>");
        }

    }


    public function Clear(): void {
        for (var i: int = 0; i < spendNGetGraduations.Count; ++i) {
            if (spendNGetGraduations[i] == null) {
                continue;
            }

            Destroy(spendNGetGraduations[i].gameObject);
        }

        spendNGetGraduations.Clear();
    }


    private function DrawGraduations(): void {
        for (var i: int = spendNGetGraduations.Count - 1; i >= 0; i--) {
            spendNGetGraduations[i].Draw();
        }
    }

    public function Update() {
        scrollView.Update();

        UpdateLimitTime();
    }


    private function SetScrollViewData(Count: int, idList: List.<int>, milestonesList: List.<GameEventDetailInfoSpendNGet.Milestone>): void {
        scrollView.clearUIObject();
        scrollView.addUIObject(rewardTip);

        for (var i: int = 0; i < Count; ++i) {
            var item: WheelGameTheCumulativeRewardItem = Instantiate(wheelRewardItem) as WheelGameTheCumulativeRewardItem;
            item.Init();
            item.SetRowData({ "eventId": idList[i], "milestone": milestonesList[i] });
            scrollView.addUIObject(item);
        }

        scrollView.AutoLayout();
        scrollView.MoveToTop();
    }


    private function UpdateLimitTime() {

        var curTime: long = GameMain.unixtime();
        var str = timerLabelPreStr + String.Format("<color=#FF001AFF>  {0}</color>",
            (endTime < curTime ? _Global.timeFormatStr(0) : _Global.timeFormatShortStr(endTime - curTime, true)));

        timerLabel.txt = str;
    }


}