/*
 * @FileName:		WheelGameLeaderboard.js
 * @Author:			xue
 * @Date:			2022-10-26 05:29:17
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	转盘 - 排行榜
 *
*/


public class WheelGameLeaderboard extends UIObject {


    @Space(30) @Header("WheelGame Leaderboard")

    /* 背景 */
    @SerializeField private var imagBG: Label;
    @SerializeField private var ibBgPic: Label;/* 红色背景 */
    @SerializeField private var trophy: Label;/* 奖杯 */

    @SerializeField private var personalRanking: Label;/* 个人排名 */
    @SerializeField private var timerLabel: Label;/* 倒计时 */
    @SerializeField private var rewardsBtn: Button;/* 奖品预览按钮 */
    @SerializeField private var infoBtn: Button;


    /* 排行榜 */
    @SerializeField private var l_bg: Label;
    @SerializeField private var lblTipColumns: Label;
    @SerializeField private var lblCutLine1: Label;
    @SerializeField private var lblCutLine2: Label;
    @SerializeField private var lblRank: Label;
    @SerializeField private var lblMight: Label;
    @SerializeField private var lblAlcAndName: Label;
    @SerializeField private var inputPager: Input2Page;

    @SerializeField private var scroll: ScrollList;
    @SerializeField private var wheelGameLeaderboardItem: ListItem;

    /* 个人排名信息 */
    @SerializeField private var selfItem: WheelGameLeaderboardBoardSelfItem;

    public function Init() {
        super.Init();

        imagBG.Init();
        ibBgPic.Init();
        trophy.Init();

        personalRanking.txt = "10";
        timerLabel.txt = "1000000";

        rewardsBtn.OnClick = function () {
            MenuMgr.getInstance().PushMenu("WheelGameLeaderboardRewardsPerview", null,"trans_up");
        };
        infoBtn.OnClick = function () {
            Debug.Log("<color=#FB00FFFF> 执行排行榜详细介绍 </color>");
        };

        wheelGameLeaderboardItem.Init();
        scroll.Init(wheelGameLeaderboardItem);
        selfItem.Init();

    }


    public function Draw() {
        if (!visible) return;

        imagBG.Draw();
        ibBgPic.Draw();

        trophy.Draw();
        personalRanking.Draw();
        timerLabel.Draw();
        rewardsBtn.Draw();
        infoBtn.Draw();

        l_bg.Draw();
        lblTipColumns.Draw();
        lblRank.Draw();
        lblMight.Draw();
        lblAlcAndName.Draw();


        lblCutLine1.Draw();
        lblCutLine2.Draw();
        scroll.Draw();

        selfItem.Draw();
        inputPager.Draw();


    }

    public function OnPop() {
        scroll.Clear();
        
    }



    public function SetData() {

        Debug.Log("<color=#FB00FFFF> 执行 WheelGameLeaderboard OnPush </color>");


        SeasonLeagueMgr.instance().CurSeasonNo = 2;
        RequestAVALeaderboard(SeasonLeagueMgr.instance().CurSeasonNo, 1, 0);

    }

    private function RequestAVALeaderboard(act: int, page: int, league: int) {
        //act == 1 : curseason, act == 2 lastseason, act == 3 individualRank
        var request: PBMsgReqAVALeagueLeaderboard.PBMsgReqAVALeagueLeaderboard = new PBMsgReqAVALeagueLeaderboard.PBMsgReqAVALeagueLeaderboard();
        request.act = act;
        request.pageNo = page;
        request.leagueNo = league;
        KBN.UnityNet.RequestForGPB("leagueSeason.php", request, OnGetAVALeaderBoardOK, null, false);
    }

    private function OnGetAVALeaderBoardOK(data: byte[]) {
        if (data == null) {
            return;
        }

        var response: PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard =
            _Global.DeserializePBMsgFromBytes.<PBMsgAVALeagueLeaderboard.PBMsgAVALeagueLeaderboard>(data);

        SeasonLeagueMgr.instance().Respose = response;
        SeasonLeagueMgr.instance().CurShowLeague = response.curLeagueNo;
        //btnSwitchRankList.txt = Datas.getArString("LeagueName.League_" + SeasonLeagueMgr.instance().CurShowLeague);
        //lblSeasonName.txt = response.season.seasonName;
        //m_endTime = response.season.endTime;
        //RefreshCurLeagueStatus(response);
        if (response.leagueList.Count > 0) {
            //lbl_noresult.SetVisible(false);
        }
        else {
            //lbl_noresult.SetVisible(true);
        }
        //page_navigator.setPages(response.curPage, response.totalPage);
        scroll.SetData(response.leagueList);
        selfItem.SetItemUIData(response.userLeagueInfo);
        //m_hasUserRank = (response.userLeagueInfo != null && response.userLeagueInfo.leagueRankSpecified && response.userLeagueInfo.leagueRank > 0); 
    }






    public function Update() {
        scroll.Update();
    }

}