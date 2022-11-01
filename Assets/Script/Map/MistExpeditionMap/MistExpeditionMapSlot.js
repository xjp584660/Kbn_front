/*
 * @FileName:		MistExpeditionMapSlot.js
 * @Author:			lisong
 * @Date:			2022-04-07 06:36:25
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	MistExpedition Map 中的 每个 地图块单元
 *
*/


public class MistExpeditionMapSlot extends MonoBehaviour {

    @Space(30) @Header("----------MistExpedition Map Slot ----------")


    @Header("----------language key")
    @SerializeField private var LangKey_RandomEventTipsInfo: String;
    @SerializeField private var LangKey_EventTipsInfoDesc: String;
    @SerializeField private var LangKey_EventTipsInfoTitle: String; 
    @SerializeField private var LangKey_noTroopTipsInfo: String; 
    @Space(20)


    public var slotEventType: MistExpeditionMapSlotEventType = MistExpeditionMapSlotEventType.None;
    public var slotStateType: MistExpeditionMapSlotStateType = MistExpeditionMapSlotStateType.Forbid;

    @Space(20)
    @SerializeField private var slotTrans: Transform;
    @SerializeField private var slotBaseSpriteRenderer: SpriteRenderer;
    @Space(20)
    @SerializeField private var map_slot_base_select_sprite: Sprite;
    @SerializeField private var map_slot_base_select_boss_sprite: Sprite;
    @SerializeField private var map_slot_base_inactive_sprite: Sprite;
    @SerializeField private var map_slot_base_inactive_boss_sprite: Sprite;
    @SerializeField private var map_slot_base_forbid_sprite: Sprite;
    @SerializeField private var map_slot_base_forbid_boss_sprite: Sprite;





    private var boxCollider: BoxCollider;


    private var meMapController: MistExpeditionMapController;
    private var slotID: String;
    private var isBossSlot = false;


    private var isClicked = false;






    private function Awake() {
        if (slotTrans == null)
            slotTrans = transform.Find("slot");

        slotID = transform.name;
        isBossSlot = String.Equals(slotID, "15_3");

    }


    public function Init(ctr: MistExpeditionMapController) {
        meMapController = ctr;
    }




    #if UNITY_EDITOR
    public function CreateSlotByInspectorEditor() {
        CreateSlot(slotEventType);
    }
    #endif







    /* 根据 event Type 、state Type、的 类型 设置 slot 的显示 状态*/
    public function CreateSlot(type: MistExpeditionMapSlotEventType) {

        if (IsHaveSlotEventObj()) {
            if (slotEventType != type) {                
                DeleteSlotEventObj();/* delete old event obj */
                slotEventType = type;
                CreateSlotEvnetObj();/* add new event obj */
            }

        } else {
            slotEventType = type;
            CreateSlotEvnetObj();
        }

    }

    /* 设置 slot 的 EventType */
    public function SetSlotEventType(type: MistExpeditionMapSlotEventType) {
        slotEventType = type;

    }



    /* 选中当前的 slot 的 */
    public function SelectSlot() {
        SetSlotState(MistExpeditionMapSlotStateType.Select, true);
        AddSlotArrowObj();
    }

    /* 设置 slot 的状态为 尚未完成 */
    public function UncompleteSlot() {
        SetSlotState(MistExpeditionMapSlotStateType.Uncomplete, true);
        AddSlotArrowObj();

    }



    
 
    /* 激活当前的 slot 的操作 */
    public function ActiveSlot() {
        SetSlotState(MistExpeditionMapSlotStateType.Active, true);
    }

    /* 注销当前的 slot 的操作 */
    public function InactiveSlot() {
        SetSlotState(MistExpeditionMapSlotStateType.Inactive, false);
    }

    /* 禁止 slot 的操作*/
    public function ForbidSlot() {
        SetSlotState(MistExpeditionMapSlotStateType.Forbid, false);
    }





    /*---------------- Flag ----------------------*/
    private var isHaveFlag: boolean = false;
    /*  添加 slot 上 的 flag */
    public function AddSlotFlagObj() {
        if (isHaveFlag)
            return;

        /*add flag obj*/
        var resObj: GameObject = TextureMgr.instance().LoadPrefab(Constant.MistExpeditionConst.MapSlot_Flag);
        if (resObj != null) {
            var flagObj = Instantiate(resObj, slotTrans);
            flagObj.name = "Flag";
            flagObj.transform.localPosition = Vector3.zero;
            isHaveFlag = true;
        }
    }

    /* 删除 slot 上 的 flag */
    public function DeleteSlotFlagObj() {
        /*delete flag obj*/
        var flagObjTrans = slotTrans.Find("Flag");

        if (flagObjTrans != null) {
            /* TODO: 动画消失 */
            flagObjTrans.gameObject.SetActive(false);
            Destroy(flagObjTrans.gameObject);
        }

        isHaveFlag = false;
    }


    /*---------------- chest reward ----------------------*/

    private var isHaveChestReward: boolean = false;

    /* 添加 slot 上 的 chest reward */
    public function AddSlotChestRewardObj() {

        if (isHaveChestReward)
            return;


        /*add chest reward obj*/
        var resObj: GameObject = TextureMgr.instance().LoadPrefab(Constant.MistExpeditionConst.MapSlot_Chest_Reward);
        if (resObj != null) {
            var obj = Instantiate(resObj, slotTrans);
            obj.name = "ChestReward";
            obj.transform.localPosition = Vector3.zero;
            isHaveChestReward = true;
        }
    }

    /* 删除 slot 上 的 chest reward */
    public function DeleteSlotChestRewardObj() {
        /*delete chest reward obj*/
        var trans = slotTrans.Find("ChestReward");

        if (trans != null) {
            /* TODO: 动画消失 */
            trans.gameObject.SetActive(false);
            Destroy(trans.gameObject);
        }

        isHaveChestReward = false;
    }


    /*---------------- arrow ----------------------*/

    private var isHaveArrow: boolean = false;

    /* 添加 slot 上 的 arrow */
    public function AddSlotArrowObj() {

        if (isHaveArrow)
            return;


        /*add arrow obj*/
        var resObj: GameObject = TextureMgr.instance().LoadPrefab(Constant.MistExpeditionConst.MapSlot_Select_Arrow);
        if (resObj != null) {
            var arrowObj = Instantiate(resObj, slotTrans);
            arrowObj.name = "Arrow";
            arrowObj.transform.localPosition = Vector3.zero;
            isHaveArrow = true;
        }
    }

    /* 删除 slot 上 的 arrow */
    public function DeleteSlotArrowObj() {
        /*delete arrow obj*/
        var arrowObjTrans = slotTrans.Find("Arrow");

        if (arrowObjTrans != null) {
        /* TODO: 动画消失 */
            arrowObjTrans.gameObject.SetActive(false);
            Destroy(arrowObjTrans.gameObject);
        }

        isHaveArrow = false;
    }

    /*---------------- event obj ----------------------*/
    private var isHaveEventObj: boolean = false;

    /* 通过当前的事件类型 创建事件对象 */
    public function CreateSlotByCurrentEventType() {
        CreateSlot(slotEventType);
    }

    /* 创建 事件对应的 obj */
    private function CreateSlotEvnetObj() {

        var objPath = String.Empty;
        switch (slotEventType) {
            case MistExpeditionMapSlotEventType.Chest:
                objPath = Constant.MistExpeditionConst.MapSlot_Event_Chest;
                break;
            case MistExpeditionMapSlotEventType.Merchant:
                objPath = Constant.MistExpeditionConst.MapSlot_Event_Merchant;
                break;
            case MistExpeditionMapSlotEventType.SupplyStation:
                objPath = Constant.MistExpeditionConst.MapSlot_Event_SupplyStation;
                break;
            case MistExpeditionMapSlotEventType.Random:
                objPath = Constant.MistExpeditionConst.MapSlot_Event_Random;
                break;
            case MistExpeditionMapSlotEventType.Battle_Normal:
                objPath = Constant.MistExpeditionConst.MapSlot_Event_Battle_Normal;
                break;
            case MistExpeditionMapSlotEventType.Battle_Elite:
                objPath = Constant.MistExpeditionConst.MapSlot_Event_Battle_Elite;
                break;
            case MistExpeditionMapSlotEventType.Battle_Boss:
                objPath = Constant.MistExpeditionConst.MapSlot_Event_Battle_Boss;
                break;
            default:
                break;
        }

        if (String.IsNullOrEmpty(objPath)) {
            return;
        }



        /* add new event obj */
        var eventResObj: GameObject = TextureMgr.instance().LoadPrefab(objPath);
        if (eventResObj != null) {
            var eventObj = Instantiate(eventResObj, slotTrans);
            eventObj.name = "EventObj" + slotEventType.ToString();
            eventObj.transform.localPosition = Vector3.zero;
            isHaveEventObj = true;
        }
    }




    /* 删除 slot 的 event 的 obj */
    public function DeleteSlotEventObj() {
        /*delete event obj*/
        var eventObjTrans = slotTrans.Find("EventObj" + slotEventType.ToString());
        if (eventObjTrans != null) {
            eventObjTrans.gameObject.SetActive(false);
            Destroy(eventObjTrans.gameObject);
        }

        isHaveEventObj = false;
    }

    /* 是否有 slot 的 event 的 obj */
    public function IsHaveSlotEventObj(): boolean{
        return isHaveEventObj;
    }

    /*---------------- battle anime ----------------------*/

    private var isHaveBattleAnime: boolean = false;

    /* 添加 slot 上 的 battle anime */
    public function AddSlotBattleAnimeObj() {

        if (isHaveBattleAnime)
            return;


        /*add arrow obj*/
        var resPath = isBossSlot ? Constant.MistExpeditionConst.MapSlot_Battle_Anime_Boss : Constant.MistExpeditionConst.MapSlot_Battle_Anime;
        var resObj: GameObject = TextureMgr.instance().LoadPrefab(resPath);

        if (resObj != null) {
            var obj = Instantiate(resObj, slotTrans);
            obj.name = "BattleAnime";
            obj.transform.localPosition = Vector3.zero;
            isHaveBattleAnime = true;
        }
    }



    /* 删除 slot 上 的 battle anime */
    public function DeleteSlotBattleAnimeObj() {
        /* delete battle anime */
        var objTrans = slotTrans.Find("BattleAnime");

        if (objTrans != null) {

            objTrans.gameObject.SetActive(false);
            Destroy(objTrans.gameObject);
        }

        isHaveBattleAnime = false;
    }
    /*----------------------------------------*/


    /* 清空 slot */
    public function ClearSlot() {
        DeleteSlotEventObj();
        DeleteSlotFlagObj();
        DeleteSlotArrowObj();
        DeleteSlotBattleAnimeObj();
        DeleteSlotChestRewardObj();
    }

    /* 隐藏当前的 slot */
    public function HideSlot() {
        ClearSlot();
        gameObject.SetActive(false);
    }

    /* 显示当前的 slot */
    public function ShowSlot() {
        ClearSlot();
        gameObject.SetActive(true);
    }


    public function IsCanClick(): boolean{

        return !(slotStateType == MistExpeditionMapSlotStateType.Forbid
                || slotStateType == MistExpeditionMapSlotStateType.Inactive
                || slotEventType == MistExpeditionMapSlotEventType.None);
    }


    /* slot 被点击 */
    public function OnClick() {
        if (slotStateType == MistExpeditionMapSlotStateType.Forbid || slotEventType == MistExpeditionMapSlotEventType.None)
            return;

        if (isClicked) return;
        isClicked = true;

        /*点击效果*/
        slotBaseSpriteRenderer.color = Color.white;
        var color = slotBaseSpriteRenderer.color;
        color *= 0.5f;
        color.a = 1f;
        slotBaseSpriteRenderer.color = color;

        SoundMgr.instance().PlayEffect("on_tap", "Audio/");

        CancelInvoke("ResetToClick");
        CancelInvoke("ClickOverAndOpenMenu");
        Invoke("ClickOverAndOpenMenu", 0.1f);


    }


    /*  点击效果结束，执行点击事件 */
    private function ClickOverAndOpenMenu() {
        slotBaseSpriteRenderer.color = Color.white;

        if (!IsCanClick()) {
            isClicked = false;
            return;
        }

        /*打开领袖选择界面*/
        if (!MistExpeditionManager.GetInstance().IsHaveLeader()) {
            MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_LeaderSelect, null, "trans_zoomComp");

        } else {
            OpenEventMenu();
        }

       
        /* 因为在显示UI界面时候有时间间隔，期间可以再次点击按钮，所以添加一个过渡时间，之后在恢复 按钮的点击 */
        CancelInvoke("ResetToClick");
        Invoke("ResetToClick", 2f);
    }

    private function ResetToClick() {
        isClicked = false;

    }




    /* 设置slot 的状态 */
    private function SetSlotState(stateType : MistExpeditionMapSlotStateType, isState: boolean) {
        slotStateType = stateType;
        SetColliderState(isState);

      
        if (slotStateType == MistExpeditionMapSlotStateType.Active
            || slotStateType == MistExpeditionMapSlotStateType.Select) {

            slotBaseSpriteRenderer.sprite = isBossSlot ? map_slot_base_select_boss_sprite : map_slot_base_select_sprite;

        } else if (slotStateType == MistExpeditionMapSlotStateType.Inactive) {
            slotBaseSpriteRenderer.sprite = isBossSlot ? map_slot_base_inactive_boss_sprite : map_slot_base_inactive_sprite;

        } else if (slotStateType == MistExpeditionMapSlotStateType.Forbid
            || slotStateType == MistExpeditionMapSlotStateType.Uncomplete) {
            slotBaseSpriteRenderer.sprite = isBossSlot ? map_slot_base_forbid_boss_sprite : map_slot_base_forbid_sprite;
        }
    }


    /* 设置 slot 的collider 的开启状态 */
    public function SetColliderState(isState: boolean) {
        if (boxCollider == null) {
            boxCollider = slotTrans.GetComponent.<BoxCollider>();
        }

        boxCollider.enabled = isState;

        if (isState) {/* 高亮显示 */
            
        } else {/* 变暗显示 */
            
        }

    }





    /* 打开事件对应的界面 */
    private function OpenEventMenu() {

        if (slotStateType == MistExpeditionMapSlotStateType.Select) {
            this.OpenEventMenu(false);
        } else if (slotStateType == MistExpeditionMapSlotStateType.Uncomplete) {
            this.OpenEventMenu(true);
        }
        else {
            ShowSelectEventTips(); /* 尚未选择 */

        }
    }


    /* 根据 事件类型 打开对应的 UI 界面 */
    private function OpenEventMenu(isEventUncomleted: boolean) {
    
        if (!IsCanClick()) {
            return;
        }


        var eventPointId = MistExpeditionManager.GetInstance().GetExpeditionCurrentEventPointIdBySlotId(slotID);


        switch (slotEventType) {
            /* Chest 宝箱 */
            case MistExpeditionMapSlotEventType.Chest:
                MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_ChestEvent, slotID, "trans_zoomComp");
                break;

            /* SupplyStation 支援点 */
            case MistExpeditionMapSlotEventType.SupplyStation:
                MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_SupplyStationEvent, eventPointId, "trans_zoomComp");
                break;

            /* Merchant 远征商人 */
            case MistExpeditionMapSlotEventType.Merchant:
                MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_MerchantEvent, eventPointId, "trans_zoomComp");
                break;

            /* battle 战斗 */
            case MistExpeditionMapSlotEventType.Battle_Normal:
            case MistExpeditionMapSlotEventType.Battle_Elite:
            case MistExpeditionMapSlotEventType.Battle_Boss:

                if (isEventUncomleted) {
                    if (slotEventType == MistExpeditionMapSlotEventType.Battle_Boss)
                        MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventRewardBossChest, null, "trans_zoomComp");
                    else
                        MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventReward, eventPointId, "trans_zoomComp");
                } else {

                    /* 检测是否有部队，没有部队就显示结算提示信息弹窗 */
                    if (MistExpeditionManager.GetInstance().IsHaveTroop()) {
                        var data: HashObject = new HashObject({
                            "eventPointId": eventPointId,
                            "layer": MistExpeditionManager.GetSlotPosInfo(slotID)[0],
                            "battleType": slotEventType.ToString()
                        });
                        MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_BattleEvent, data, "trans_zoomComp");

                    } else {
                        var okFunc = function () {

                            var okFunc2: Function = function (result: HashObject) {
                                MenuMgr.getInstance().PopMenu("");
                                /* 更新 当前远征的 远征币数量 */
                                MistExpeditionManager.GetInstance().UpdateExpeditioneCoinState(result);
                                /* 显示完成远征的最后结算、退出迷雾远征 */
                                MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_BattleEventResult, "0_1_1", "trans_zoomComp");
                            };

                            UnityNet.reqMistExpeditionSettlement(okFunc2, null);
                        };

                        /* 信息弹窗提示 事件点类型 */
                        MistExpeditionMenuManager.PopupConfirmDialog("", LangKey_noTroopTipsInfo, UnityEngine.TextAnchor.UpperLeft, okFunc, null);
                    }
                   
                }
                break;
            default:
                break;
        }
    }



    /* 当未选择 event 时，点击 slot 需要弹出对应的提示信息 */
    private function ShowSelectEventTips() {

        var titleStrKey = "";
        var tipsInfoStrKey = "";

        var okFunc = function () {
            MenuMgr.getInstance().PopMenu("");
        };

        /* 是否有部队 */
        if (MistExpeditionManager.GetInstance().IsHaveTroop()) {
            var val = MistExpeditionManager.GetEventTypeIntValue(slotEventType);
            titleStrKey = LangKey_EventTipsInfoTitle + val;
            tipsInfoStrKey = LangKey_EventTipsInfoDesc + val;

            okFunc = function () {
                var eventPointId = MistExpeditionManager.GetInstance().GetExpeditionCurrentEventPointIdBySlotId(slotID);

                var selectOkFunc = function (result: HashObject) {


                
                    if (slotEventType == MistExpeditionMapSlotEventType.Random) {

                        var mapId: int = MistExpeditionManager.GetInstance().GetCurrentMapID();
                        var eventType: int = MistExpeditionManager.GetInstance().GetEventTypeIntValue(slotEventType);
                        var layer: int = MistExpeditionManager.GetSlotPosInfo(slotID)[0];


                        var selectOkFuncRandom = function (resultRandom: HashObject) {
                            MenuMgr.getInstance().PopMenu("");

                            var mapInfoOkFuncRandom = function (dataRandom: HashObject) {
                                /* 刷新地图状态 */
                                KBN.Game.Event.Fire(this, new KBN.MistExpeditionEventArgs());

                                /* 由于需要根据更新后的 地图状态数据来去打开事件的菜单界面，但是会出现更新状态慢，先打开菜单界面的情况
                                 * 所以就先将 当前的 slot 的状态更新上，以便打开菜单界面使用
                                 * 之后这个 slot 状态也会被地图更新时重置，不会影响
                                 * 除非是后端返回的地图状态数据和 当前 slot 的状态不一致
                                 * */

                                var eventTypeRandom = MistExpeditionManager.GetInstance().GetCurrentMapSlotEventType(slotID);
                                CreateSlot(eventTypeRandom);
                                SelectSlot();
                                /* 再次打开事件点 */
                                OpenEventMenu();

                            };

                            /* 刷新远征地图数据 */
                            MistExpeditionManager.GetInstance().RequestMistExpeditionMapInfo(mapInfoOkFuncRandom);

                        };
                        UnityNet.reqMistExpeditionEventGetRandomEvent(eventPointId, layer, eventType, mapId, selectOkFuncRandom, null);
                    } else {

                        MenuMgr.getInstance().PopMenu("");

                        var mapInfoOkFunc = function (data: HashObject) {
                            /* 刷新地图状态 */
                            KBN.Game.Event.Fire(this, new KBN.MistExpeditionEventArgs());

                            /* 由于需要根据更新后的 地图状态数据来去打开事件的菜单界面，但是会出现更新状态慢，先打开菜单界面的情况
                             * 所以就先将 当前的 slot 的状态更新上，以便打开菜单界面使用
                             * 之后这个 slot 状态也会被地图更新时重置，不会影响
                             * 除非是后端返回的地图状态数据和 当前 slot 的状态不一致
                             * */

                            var eventType = MistExpeditionManager.GetInstance().GetCurrentMapSlotEventType(slotID);
                            CreateSlot(eventType);
                            SelectSlot();
                            /* 再次打开事件点 */
                            OpenEventMenu();

                        };

                        /* 刷新远征地图数据 */
                        MistExpeditionManager.GetInstance().RequestMistExpeditionMapInfo(mapInfoOkFunc);
                    }

                   
                };
                /* 向后台发送选中的 事件点 */
                UnityNet.reqMistExpeditionMapSelectEventPoint(eventPointId, selectOkFunc, null);
            };

        } else {
            tipsInfoStrKey = LangKey_noTroopTipsInfo;
        }


        /* 信息弹窗提示 事件点类型 */
        MistExpeditionMenuManager.PopupConfirmDialog(titleStrKey, tipsInfoStrKey, UnityEngine.TextAnchor.UpperLeft, okFunc, null);


    }



}