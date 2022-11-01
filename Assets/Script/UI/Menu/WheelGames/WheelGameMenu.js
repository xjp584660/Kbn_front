/*
 * @FileName:		WheelGameMenu.js
 * @Author:			xue
 * @Date:			2022-10-28 05:20:57
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	转盘事件UI入口
 *
*/


public class WheelGameMenu extends KBNMenu {

    @Space(30) @Header("WheelGame Menu")

    /* ---------- 顶部 菜单按钮 ---------- */
    @SerializeField private var menuHead_prefab: MenuHead;
    @HideInInspector public var menuHead: MenuHead;


    /* ---------- toggle bar ---------- */
    @SerializeField private var toolBar: ToolBar;


    /* ---------- toggle page  ---------- */
    
    @SerializeField private var m_wheelGameTheCumulativeRewards: WheelGameTheCumulativeRewards;/*累计奖励界面*/
    @SerializeField private var m_wheelGameLeaderboard: WheelGameLeaderboard;/*排行榜界面*/


    /* 当前的 界面 */
    private var currentUI: UIObject;
    private var tabUI: Array;


    @Space(15) @Header("----------language key")
    @SerializeField private var langKey_menuTitle: String;
    @SerializeField private var langKey_toolBarStrArr: String[];


    public function Init() {
        super.Init();



        menuHead = GameObject.Instantiate(menuHead_prefab);
        menuHead.l_title.mystyle.wordWrap = true;
        menuHead.Init();
        menuHead.btn_left.SetVisible(true);
        menuHead.btn_back.SetVisible(false);
        menuHead.btn_left.OnClick = function () {
            MenuMgr.getInstance().PopMenu("WheelGameMenu");
        };

        InitToolBar();

        m_wheelGameTheCumulativeRewards.Init();
        m_wheelGameLeaderboard.Init();

        tabUI = [m_wheelGameTheCumulativeRewards, m_wheelGameLeaderboard];
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



    public function OnPush(param: Object) {
        super.OnPush(param);


        menuHead.setTitle(Datas.getArString(langKey_menuTitle));

        ShowToolBarPage(toolBar.selectedIndex);

    }


    private function OnTabIndexChanged(index: int): void {

        ShowToolBarPage(index);


    }

    public function OnPopOver() {

        TryDestroy(menuHead);
        menuHead = null;

        m_wheelGameTheCumulativeRewards.OnPop();
        m_wheelGameLeaderboard.OnPop();

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
            (currentUI as WheelGameTheCumulativeRewards).SetData();
        }
        else if (toolBar.selectedIndex == 1) {
            (currentUI as WheelGameLeaderboard).SetData();
        }

    }


}