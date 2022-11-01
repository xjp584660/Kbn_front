/*
 * @FileName:		MistExpeditionSceneMenuBattleEventMarch.js
 * @Author:			lisong
 * @Date:			2022-04-21 02:49:42
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 事件点 - 战斗 -  march 配置信息设置
 *
*/


public class MistExpeditionSceneMenuBattleEventMarch extends PopMenu {
    @Space(30) @Header("---------- MistExpedition SceneMenu BattleEvent March ----------") 


    @Header("----------language key")
    @SerializeField private var langKey_menuTitle: String;
    @SerializeField private var langKey_leaderTitle: String;
    @SerializeField private var langKey_leaderNamePreStr: String;
    @SerializeField private var langKey_troopTitle: String; 
    @SerializeField private var langKey_NoTroopsTips: String;
    @SerializeField private var langKey_HaveMarchTipsTitle: String;
    @SerializeField private var langKey_HaveMarchTipsInfo: String;
    @Space(20)

    @Header("---------- default ") 
    @SerializeField private var titleLabel: Label;
    @SerializeField private var titleLine: Label;
    @SerializeField private var leaderTitleLabel: Label;
    @SerializeField private var troopTitleLabel: Label;
    
    @Space(20) @Header("---------- leader") 
    @SerializeField private var imgIconFrame: Label;
    @SerializeField private var imgIcon: Label;
    @SerializeField private var nameLabel: Label;
    @SerializeField private var separateline: Label;
    @SerializeField private var iconBtn: Button;

    @Space(20) @Header("---------- troop ") 
    @SerializeField private var noTroopTipsLabel: Label;
    @SerializeField private var troopScrollList: ScrollList;
    @SerializeField private var troopItemPrefab: ListItem;

    @Space(20) @Header("---------- btn ") 
    @SerializeField private var marchStartBtn: Button;
    @SerializeField private var saveTroopBtn: Button;
    @SerializeField private var troopEditorBtn: Button;

 

    private var eventPointId = 0;
    private var layer = 0;
    private var battleEventTypeVal = 0;
    private var marchID: int = 0;
    private var selectedTroopUnitsData: Hashtable = new Hashtable();



    private var isHaveTroop: boolean = false;

    public var waitTime: int = 3;

    public function Init() {
        super.Init();

    
        troopScrollList.Init(troopItemPrefab);

        titleLabel.txt = Datas.getArString(langKey_menuTitle);
        leaderTitleLabel.txt = Datas.getArString(langKey_leaderTitle);
        troopTitleLabel.txt = Datas.getArString(langKey_troopTitle);

        imgIconFrame.drawTileByGraphics = false;
        imgIconFrame.useTile = true;
        imgIconFrame.tile = TextureMgr.instance().IconSpt().GetTile("frame_reincarnation");
        iconBtn.OnClick = OnLeaderBtnClick;

        troopEditorBtn.txt = Datas.getArString("Common.Edit");
        troopEditorBtn.OnClick = OnClickTroopEditorBtn;
        saveTroopBtn.txt = Datas.getArString("Common.Save_Button");
        saveTroopBtn.OnClick = OnClickSaveTroopBtn;
        marchStartBtn.txt = Datas.getArString("ModalTitle.March");
        marchStartBtn.OnClick = OnClickMarchStartBtn;


        noTroopTipsLabel.txt = Datas.getArString(langKey_NoTroopsTips);
    }


    public function DrawBackground() {
        super.DrawBackground();

        titleLine.Draw();
    }

    public function DrawItem() {

        titleLabel.Draw();

        leaderTitleLabel.Draw();

        imgIcon.Draw();
        imgIconFrame.Draw();
        nameLabel.Draw();
        separateline.Draw();
        iconBtn.Draw();

        troopTitleLabel.Draw();


        if (!isHaveTroop)
            noTroopTipsLabel.Draw();
        else
            troopScrollList.Draw();


        troopEditorBtn.Draw();
        marchStartBtn.Draw();
        saveTroopBtn.Draw();

    }


    public function Update() {
        if (isHaveTroop)
            troopScrollList.Update();

    }


    public function OnPopOver() {
        troopScrollList.Clear();


    }


    public function OnPush(params: Object) {
        var data: HashObject = params as HashObject;
        eventPointId = _Global.INT32(data["eventPointId"].Value);
        layer = _Global.INT32(data["layer"].Value);
        battleEventTypeVal = _Global.INT32(data["battleType"].Value);


        UpdateLeaderInfo();
        UpdateChooseTroopList();
    }


    /* 更新 leader 的显示信息 */
    private function UpdateLeaderInfo() {

        var leaderInfo: MistExpeditionLeaderInfo = MistExpeditionManager.GetInstance().GetCurrentLeaderInfo();
        if (leaderInfo != null) {

            nameLabel.txt = Datas.getArString(leaderInfo.Name);
               
            imgIcon.tile = TextureMgr.instance().ItemSpt().GetTile(leaderInfo.Head);
        }

    }

   /* 更新 troop 信息显示 */
    public function UpdateChooseTroopList() {

        var list = MistExpeditionManager.GetInstance().GetTroopInfoList();


        if (list == null || list.Count <= 0) {
            isHaveTroop = false;
            return;
        }


        var arr: Array = new Array();

        selectedTroopUnitsData = new Hashtable();

        for (var info: Barracks.TroopInfo in list) {
            if (info.selectNum > 0 && info.owned > 0) {
                arr.Add(info);
                selectedTroopUnitsData.Add(info.typeId+"", info.selectNum);
            }
        }

        if (arr.Count <= 0) {

            marchID = MistExpeditionManager.GetInstance().GetCurrentMarchID();

            if (marchID != 0) {
                noTroopTipsLabel.txt = Datas.getArString(langKey_HaveMarchTipsInfo);
            }
                
            isHaveTroop = false;
            return;
        }

        isHaveTroop = true;

        troopScrollList.Clear();
        troopScrollList.SetData(arr);
        troopScrollList.UpdateData();
        troopScrollList.ResetPos();
    }
    
    /* 点击leader头像显示详情信息 */
    private function OnLeaderBtnClick(): void {
        var leaderInfo = MistExpeditionManager.GetInstance().GetCurrentLeaderInfo();
        if (leaderInfo != null) {
            MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_LeaderSkillInfo, leaderInfo);
        }

    }

    /* 编辑 march 部队信息 */
    private function OnClickTroopEditorBtn(): void {

        /* 出现已经发送过 march，但是没有进行到获得战斗结果的步骤，就禁止编辑部队信息，直接让玩家发送战斗请求 */
        /* 弹窗提示玩家直接战斗 */
        if (MistExpeditionManager.GetInstance().GetCurrentMarchID() != 0) {
            /* 信息弹窗提示  */
            MistExpeditionMenuManager.PopupConfirmDialogSingleBtn(langKey_HaveMarchTipsTitle, langKey_HaveMarchTipsInfo, UnityEngine.TextAnchor.UpperLeft, null);
            return;
        }


        MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventMarchChooseTroop, this, "trans_pop");

    }


    /* 保存 march 部队信息 */
    private function OnClickSaveTroopBtn(): void {


    }




    private var lockMarchBtn: boolean = false;

    /* 进行 march 战斗 */
    private function OnClickMarchStartBtn(): void {
        if (lockMarchBtn) return;

        lockMarchBtn = true;

        if (isHaveTroop || MistExpeditionManager.GetInstance().GetCurrentMarchID() != 0) {

            MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventMarch);

            ReqSendBattleMarchInfo();
        } else {
            var errorStr = Datas.getArString("Error.March_NeedTroops");
            ErrorMgr.instance().PushError("", errorStr);

        }

        lockMarchBtn = false;

    }

    /* 发送march数据信息 */
    private function ReqSendBattleMarchInfo() {

        var doReqMattleResult = function () {
            MenuMgr.getInstance().netBlock = true;/* 弹出遮挡界面，等待一定时间后，再请求March结果 */
            Invoke("ReqBattleMarchResult", waitTime);
        };


        marchID = MistExpeditionManager.GetInstance().GetCurrentMarchID();


        if (marchID != 0) {
            doReqMattleResult();
            return;
        }


        var cityId: int = GameMain.instance().getCurCityId();
        var leaderId = MistExpeditionManager.GetInstance().GetLeaderID();


        var okFunc: Function = function (result: HashObject) {

            if (_Global.GetBoolean(result["result"]["status"].Value)) {
                marchID = _Global.INT32(result["result"]["data"]["marchId"]);
                doReqMattleResult();
            }
            else {
                KBN.Game.Event.Fire(this, new KBN.MistExpeditionBattleAnimeEventArgs(eventPointId, false));
                NetConnectMenu.ResetState();

         #if UNITY_EDITOR
                var errorMsg = result["result"]["message"].Value as String;
                Debug.Log(String.Format("[{0}]<color=#FF0099FF>发送 march信息 失败！(type=2)    errorMsg:{1}</color>" , System.DateTime.Now.ToString("HH:mm:ss:fff"), errorMsg));
	    #endif
            }
        };

  
        /*
        *参数：
        * cid(cityId): 城市id,
        * hid(leaderId): 领袖id,
        * lid(eventPointId):事件点的id,
        * floor(layer): 当前事件所在的层数（共1-15层）,
        * mapType(battleEventTypeVal): 事件类型,
        * units:部队排遣数据
       */

        NetConnectMenu.ShowPure();
        KBN.Game.Event.Fire(this, new KBN.MistExpeditionBattleAnimeEventArgs(eventPointId, true));
        UnityNet.reqMistExpeditionEventBattleMarch(cityId, leaderId, eventPointId, layer, battleEventTypeVal, JsonHelper.ToJson(selectedTroopUnitsData), okFunc, OnNetErrorMsg);

    }


    /* 请求 战斗结果 */
    private function ReqBattleMarchResult() {

        var okFunc: Function = function (result: HashObject) {

            if (result != null && _Global.GetBoolean(result["ok"])) {
                var refreshFunc: Function = function () {

                    NetConnectMenu.ShowPure();
                    KBN.Game.Event.Fire(this, new KBN.MistExpeditionBattleAnimeEventArgs(eventPointId, true));

                    /* 请求最新的 迷雾远征基础数据 */
                    /* 之后在显示战斗的结果界面 */
                    MistExpeditionManager.GetInstance().RequestMistExpeditionMapInfo(function (obj: HashObject) {

                        /* 恢复事件点显示 */
                        KBN.Game.Event.Fire(this, new KBN.MistExpeditionBattleAnimeEventArgs(eventPointId, false));
                        if (_Global.INT32(result["result"]["win"]) != 0) {

                            /* 更新地图显示 */
                            KBN.Game.Event.Fire(this, new KBN.MistExpeditionEventArgs());
                        }

                        MistExpeditionManager.GetInstance().SetBattleResultData(eventPointId, result["result"]);

                        MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventResult, "0_0_0", "trans_zoomComp");

                        NetConnectMenu.ResetState();

                    });

                };

                if (_Global.GetBoolean(result["result"]["direct_victory"]))/*判断是否是直接胜利*/ {

                    PopupConfirmDialog(refreshFunc, null);
                } else {

                    refreshFunc();


                    Message.getInstance().DownLoadReports(function () {
                        _Global.Log("download message success.......");

                    }, "1");
                }
            }
        };

        var cityId: int = GameMain.instance().getCurCityId();
        NetConnectMenu.ShowPure();
        KBN.Game.Event.Fire(this, new KBN.MistExpeditionBattleAnimeEventArgs(eventPointId, true));
        UnityNet.reqMistExpeditionEventBattleMarchResult(cityId, marchID, eventPointId, okFunc, OnNetErrorMsg);

    }

    private function OnNetErrorMsg(errorMsg: String, errorCode: String) {
        #if UNITY_EDITOR
            Debug.LogWarning("<color=#ff0077>errorMsg:" + errorMsg + "  errorCode:" + errorCode + "</color>");
        #endif
        MistExpeditionMenuManager.PopUpErrorMsg(errorMsg, errorMsg);

        KBN.Game.Event.Fire(this, new KBN.MistExpeditionBattleAnimeEventArgs(eventPointId, false));
        NetConnectMenu.ResetState();

    }


    /*直接胜利 弹窗*/
    public static function PopupConfirmDialog(okFunc: Function, cancelFunc: Function) {

        var dialog: ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
        dialog.setLayout(600, 380);
        dialog.setTitleY(60);
        dialog.m_msg.mystyle.alignment = UnityEngine.TextAnchor.UpperLeft;
        dialog.setContentRect(70, 140, 0, 100);

        dialog.btnConfirm.setXY(190, 280);

      
        dialog.btnCancel.SetVisible(false);


        dialog.setButtonText(Datas.getArString("Common.Yes"), Datas.getArString("Common.No"));
        var func = function () {
            if (okFunc != null) {
                MenuMgr.getInstance().PopMenu("");
                okFunc();
            }
        };


        MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("Expedition.Scene_WinOutright_Text"),
            Datas.getArString("Expedition.Scene_WinOutright_Title"), func, cancelFunc);

        dialog.btnClose.SetVisible(false);
    }


}
