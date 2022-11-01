/*
 * @FileName:		MistExpeditionMenu.js
 * @Author:			lisong
 * @Date:			2022-03-28 05:30:21
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 入口界面
*/

import System.Collections.Generic;


public class MistExpeditionMenu extends KBNMenu {

	@Space(30) @Header("----------MistExpeditionMenu----------") 


    @Header("----------language key") 
    @SerializeField private var langKey_menuTitle: String;
    @SerializeField private var langKey_toolBarStrArr: String[];

    @Space(20)
    @SerializeField
    private var imageBG: Label;

    /* ---------- 顶部 菜单按钮 ---------- */
    
    @SerializeField
    private var menuHead_prefab: MenuHead;
    @HideInInspector
    public var menuHead: MenuHead;


    /* ---------- toggle bar ---------- */
	@SerializeField
	private var toolBar: ToolBar;



    /* ---------- toggle page  ---------- */
    @SerializeField
    private var mistExpeditionMenuDetailInfo: MistExpeditionMenuDetailInfo;
    @SerializeField
    private var mistExpeditionMenuLeaderBoard: MistExpeditionMenuLeaderBoard;
    @SerializeField
    public var mistExpeditionMenuShop: MistExpeditionMenuShop;
    @SerializeField
    public var mistExpeditionMenuExchange: MistExpeditionMenuExchange;

    /* 当前的 界面 */
    private var currentUI: UIObject;
	private var tabUI:Array;


    public function Init() {
        imageBG.Init();


        menuHead = GameObject.Instantiate(menuHead_prefab);
        menuHead.l_title.mystyle.wordWrap = true;
        menuHead.Init();

        InitToolBar();


        mistExpeditionMenuDetailInfo.Init();
        mistExpeditionMenuLeaderBoard.Init();
        mistExpeditionMenuShop.Init();
        mistExpeditionMenuExchange.Init();

        tabUI = [mistExpeditionMenuDetailInfo, mistExpeditionMenuLeaderBoard, mistExpeditionMenuShop, mistExpeditionMenuExchange];
        currentUI = tabUI[0];

	}

    private function InitToolBar(): void {
        toolBar.Init();
        toolBar.indexChangedFunc = OnTabIndexChanged;

        var toolBarStrings: List.<String> = new List.<String>();
        for (var key: String in langKey_toolBarStrArr) {
            toolBarStrings.Add(Datas.getArString(key));
        }
        toolBar.toolbarStrings = toolBarStrings.ToArray();

    }

    private function OnTabIndexChanged(index: int): void {

        ShowToolBarPage(index);

         
    }




    public function OnPush(param: Object) {
        super.OnPush(param);

        menuHead.setTitle(Datas.getArString(langKey_menuTitle));

        ShowToolBarPage(toolBar.selectedIndex);
    }

    public function OnPopOver() {
        TryDestroy(menuHead);
        menuHead = null;

        mistExpeditionMenuDetailInfo.OnPop();
        mistExpeditionMenuLeaderBoard.OnPop();
        mistExpeditionMenuShop.OnPop();
        mistExpeditionMenuExchange.OnPop();

        super.OnPop();
    }



    public function Update() {

        menuHead.Update();
        toolBar.Update();

        if (currentUI != null) {
            currentUI.Update();
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
    }



    protected function DrawBackground() {
        menuHead.Draw();
        
    }



    private function ShowToolBarPage(index: int) {
        currentUI = tabUI[index];

        if (toolBar.selectedIndex == 0) {
            (currentUI as MistExpeditionMenuDetailInfo).SetData();
        }
        else if (toolBar.selectedIndex == 1) {
            (currentUI as MistExpeditionMenuLeaderBoard).SetData();
        }
        else if (toolBar.selectedIndex == 2) {
            (currentUI as MistExpeditionMenuShop).SetData();
        }
        else if (toolBar.selectedIndex == 3) {
            (currentUI as MistExpeditionMenuExchange).SetData();

        }

    }

  


    public function handleNotification(type: String, body: Object): void {

        if (type == "UpdateItem") {
            mistExpeditionMenuShop.handleNotification(type, body);
            menuHead.l_gem.txt = Payment.instance().DisplayGems + "";
        }

    }
}

