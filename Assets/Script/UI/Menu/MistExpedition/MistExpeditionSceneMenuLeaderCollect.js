/*
 * @FileName:		MistExpeditionSceneMenuLeaderCollect.js
 * @Author:			xue
 * @Date:			2022-08-16 05:13:14
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	已拥有的领袖列表
 *
*/


public class MistExpeditionSceneMenuLeaderCollect extends ComposedMenu {

    @Space(30) @Header("---------- MistExpedition SceneMenu Collect ----------")

    @SerializeField private var description: Label;
    @SerializeField private var collectList: ScrollList;
    @SerializeField private var item: MistExpeditionSceneMenuLeaderCollectItem;


    @Space(10) @Header("------字符串--------")
    @SerializeField private var langKey_LeaderCollection_Title: String;/*领袖图鉴*/
    @SerializeField private var langKey_LeaderCollection_Desc: String;/*查看所有领袖信息*/

    public function Init(): void {
        super.Init();

        setDefautlFrame = false;

        menuHead.setTitle(Datas.getArString(langKey_LeaderCollection_Title));
        description.txt = Datas.getArString(langKey_LeaderCollection_Desc);

        frameTop.rect = Rect(0, 70, frameTop.rect.width, frameTop.rect.height);
        menuHead.backTile.rect = Rect(0, 0, 640, 140);
        menuHead.leftHandler = GoMainMenu;

        bgMiddleBodyPic = TileSprite.CreateTile(TextureMgr.instance().LoadTexture("ui_paper_bottomSystem", TextureType.BACKGROUND), "ui_paper_bottomSystem");
        repeatTimes = -6;
        marginT = TextureMgr.instance().LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);

        collectList.Init(item);
    }

    public function Update(): void {
        super.Update();

        menuHead.Update();
        collectList.Update();
    }

    public function DrawItem() {
        if (!visible) return;
        description.Draw();
        collectList.Draw();

    }

    /*渲染 (menuHead) */
    public function DrawBackground(): void {
        bgStartY = 70;
        menuHead.Draw();
        DrawMiddleBg();
        prot_drawFrameLine();
        frameTop.Draw();
    }

    public function OnPush(param: Object): void {
        super.OnPush(param);
        RefreshLeaderCollectList();
    }

    public function OnPop(): void {
        super.OnPop();
    }

    public function OnPopOver(): void {
        super.OnPopOver();

        collectList.Clear();
        TryDestroy(menuHead);
        menuHead = null;
    }

    /*返回按钮*/
    public function GoMainMenu(): void {
        MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_LeaderCollect);
    }

    /*获取所有领袖信息  并且加载出来*/
    public function RefreshLeaderCollectList(): void {
        var leaderArray: Array = MistExpeditionManager.GetInstance().GetLeaderArray();
        if (leaderArray == null) return;

        collectList.SetData(leaderArray);
        collectList.ResetPos();
    }

}