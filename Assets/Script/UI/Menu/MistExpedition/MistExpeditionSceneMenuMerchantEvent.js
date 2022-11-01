/*
 * @FileName:		MistExpeditionSceneMenuMerchantEvent.js
 * @Author:			lisong
 * @Date:			2022-04-02 05:31:30
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 事件点 - 商人
 *
*/

import System.Collections.Generic;

public class MistExpeditionSceneMenuMerchantEvent extends KBNMenu {

    @Space(30) @Header("---------- MistExpedition SceneMenu MerchantEvent ----------")



    @Header("----------language key")
    @SerializeField private var langKey_menuTitle: String;
    @SerializeField private var langKey_toolBarNameArr: String[];
    @SerializeField private var langKey_exitTips: String;
    @SerializeField private var langKey_exitBtn: String;
    @Space(20)

    @SerializeField private var imageBG: Label;

    /* ---------- 顶部 菜单按钮 ---------- */
    @Space(20)
    @SerializeField private var menuHead_prefab: MenuHead;
    @HideInInspector public var menuHead: MenuHead;


    /* ---------- toggle bar ---------- */
    @Space(20)
    @SerializeField private var toolBar: ToolBar;



    /* ---------- toggle page  ---------- */
    @Space(20)
    @SerializeField private var toolBarStringKeys: String[];
    @SerializeField private var coinShop: MistExpeditionSceneMenuMerchantEventCoinShop;
    @SerializeField private var gemsShop: MistExpeditionSceneMenuMerchantEventGemsShop;


    @Space(20)
    @SerializeField private var exitBtn: Button;





    private static var currentUIIndex: int = 0;
    /* 当前的 界面 */
    private var currentUI: UIObject;
    private var tabUI: Array;


    private var eventPointId: int = 0;





    public function Init() {
        imageBG.Init();


        menuHead = GameObject.Instantiate(menuHead_prefab);
        menuHead.Init();

        InitToolBar();


        if (menuHead != null) {
            menuHead.btn_back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_back2_normal", TextureType.BUTTON);
            menuHead.btn_back.mystyle.active.background = TextureMgr.instance().LoadTexture("button_back2_down", TextureType.BUTTON);
        }


        coinShop.Init();
        gemsShop.Init();


        tabUI = [coinShop, gemsShop];

        currentUI = tabUI[currentUIIndex];


        exitBtn.Init();
        exitBtn.OnClick = OnExitBtnClick;
        exitBtn.txt = Datas.getArString(langKey_exitBtn);
    }

    private function InitToolBar(): void {
        toolBar.Init();
        toolBar.indexChangedFunc = OnTabIndexChanged;

        var toolBarStrings: List.<String> = new List.<String>();
        for (var key: String in langKey_toolBarNameArr) {
            toolBarStrings.Add(Datas.getArString(key));
        }
        toolBar.toolbarStrings = toolBarStrings.ToArray();

    }

    private function OnTabIndexChanged(index: int): void {

        ShowToolBarPage(index);


    }




    public function OnPush(param: Object) {
        super.OnPush(param);

        eventPointId = _Global.INT32(param);

        menuHead.setTitle(Datas.getArString(langKey_menuTitle));

        ShowToolBarPage(toolBar.selectedIndex);

    }

    public function OnPopOver() {
        TryDestroy(menuHead);
        menuHead = null;

        coinShop.OnPop();
        gemsShop.OnPop();

        super.OnPop();
    }



    public function Update() {

        menuHead.Update();
        toolBar.Update();

        switch (toolBar.selectedIndex) {
            case 0:
                coinShop.Update();

                break;
            case 1:
                gemsShop.Update();

                break;
            default:
                break;
        }
    }



    protected function DrawItem() {
        if (!visible) return;

        imageBG.Draw();


        if (currentUI != null) {
            currentUI.Draw();
        }

        frameTop.Draw();
        toolBar.Draw();

        exitBtn.Draw();
    }



    protected function DrawBackground() {
        menuHead.Draw();

    }



    private function ShowToolBarPage(index: int) {
        currentUI = tabUI[index];
        currentUIIndex = index;

        if (toolBar.selectedIndex == 0) {
            (currentUI as MistExpeditionSceneMenuMerchantEventCoinShop).SetData(eventPointId);
        }
        else if (toolBar.selectedIndex == 1) {
            (currentUI as MistExpeditionSceneMenuMerchantEventGemsShop).SetData(eventPointId);
        }

    }

    /* 点击 退出 按钮 */
    private function OnExitBtnClick(): void {
        MistExpeditionMenuManager.PopupConfirmDialog("", langKey_exitTips
            , function () {
                var okFunc: Function = function (result: HashObject) {

                    MenuMgr.getInstance().PopMenu("");

                    MistExpeditionManager.GetInstance().RequestMistExpeditionMapInfo(function (obj: HashObject) {
                        KBN.Game.Event.Fire(this, new KBN.MistExpeditionEventArgs());
                        MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_MerchantEvent);
                    });
                };

                MistExpeditionManager.GetInstance().MistExpeditionShopPayDicClear();/*清除 远征商人gems 缓存信息*/
                MistExpeditionManager.GetInstance().MistExpeditionShopCoinDicClear();/*清除 远征商人Coin 缓存信息*/
                /* 结束购买 */
                UnityNet.reqMistExpeditionEventMerchantExit(eventPointId, okFunc, null);
            }
            , function () {
                MenuMgr.getInstance().PopMenu("");
            }
        );

    }



    public function handleNotification(type: String, body: Object): void {

        if (type == "UpdateItem") {
            menuHead.l_gem.txt = Payment.instance().DisplayGems + "";
        }

    }

}

