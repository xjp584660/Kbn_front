/*
 * @FileName:		MistExpeditionSceneMenuLeaderSelect.js
 * @Author:			xue
 * @Date:			2022-04-19 11:20:00
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 领袖选择
 *
*/


public class MistExpeditionSceneMenuLeaderSelect extends ComposedMenu {

    @Space(30) @Header("---------- MistExpedition SceneMenu LeaderSelect ----------")

    @SerializeField private var item: MistExpeditionSceneMenuLeaderSelectItem;
    @SerializeField private var LeaderList: ScrollList;

    @Space(10) @Header("--------------Label--------")
    @SerializeField private var titleBackground: Label;
    @SerializeField private var description: Label;
    @SerializeField private var bottom: Label;
    @SerializeField private var explain: Label;
    @SerializeField private var leftLine: Label;
    @SerializeField private var rightLine: Label;
    @SerializeField private var collectBack: Label;


    @Space(10) @Header("--------------Button--------")
    @SerializeField private var help: Button;
    @SerializeField private var collect: Button;


    public var Const: int;



    @Space(20)/*字符串*/
    @SerializeField private var langKey_LeaderSelect_Title: String;/*选择领袖 标题*/
    @SerializeField private var langKey_LeaderSelect_Dialog: String;/*选择领袖 对话*/
    @SerializeField private var langKey_LeaderSelect_Text1: String;/*选择领袖iButton*/



    public function Init(): void {
        super.Init();
        setDefautlFrame = false;
        menuHead.setTitle(Datas.getArString(langKey_LeaderSelect_Title));
        description.txt = Datas.getArString(langKey_LeaderSelect_Dialog);
        frameTop.rect = Rect(0, 70, frameTop.rect.width, frameTop.rect.height);
        menuHead.backTile.rect = Rect(0, 0, 640, 140);

        bgMiddleBodyPic = TileSprite.CreateTile(TextureMgr.instance().LoadTexture("ui_hero_hpbg1", TextureType.DECORATION), "ui_hero_hpbg1");
        explain.tile = TileSprite.CreateTile(TextureMgr.instance().LoadTexture("ui_paper_bottom", TextureType.BACKGROUND), "ui_paper_bottom");
        titleBackground.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_hp_details");
        leftLine.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_paper_wen");
        rightLine.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_paper_wen");

        item.Init();
        LeaderList.Init(item);


        collect.OnClick = OnLeaderCollec;
        help.OnClick = OnHelpClick;
        menuHead.btn_back.SetVisible(false);/*关闭menuHead退出按钮*/

    }

    public function Update(): void {
        super.Update();
        menuHead.Update();
        LeaderList.Update();
    }

    public function DrawItem(): void {
        if (!visible) return;
     
        bottom.Draw();
        explain.Draw();
        leftLine.Draw();
        rightLine.Draw();
        frameTop.Draw();
        help.Draw();
        description.Draw();
        titleBackground.Draw();
        LeaderList.Draw();
        collectBack.Draw();
        collect.Draw();
    }


    public function DrawBackground(): void {
        menuHead.Draw();
        bgStartY = 70;
        DrawMiddleBg();
    }

    public function OnPush(param: Object): void {
        super.OnPush(param);

        RefreshLeaderList();
    }

    public function OnPushOver(): void {
        super.OnPushOver();
    }

    public function OnPop(): void {
        super.OnPop();
    }


    public function OnPopOver(): void {
        super.OnPopOver();

        LeaderList.Clear();
        TryDestroy(menuHead);
        menuHead = null;
    }

   
   
    
    /*详细介绍*/
    private function OnHelpClick(): void {
        var setting: InGameHelpSetting = new InGameHelpSetting();
        setting.type = "one_context";
        setting.key = Datas.getArString(langKey_LeaderSelect_Text1);
        setting.name = Datas.getArString(langKey_LeaderSelect_Title);

        MenuMgr.getInstance().PushMenu("InGameHelp", setting, "trans_horiz");
    }

    /*加载领袖信息*/
    private function RefreshLeaderList(): void {
        var leaderArray: Array = MistExpeditionManager.GetInstance().GetLeaderArray();

        for (var i: int = 0; i < Const; i++) {
            var info: MistExpeditionLeaderInfo = new MistExpeditionLeaderInfo();
            leaderArray.push(info);/*多加一个数据 数据为空 显示为尽情期待*/
        }
        LeaderList.SetData(leaderArray);
        LeaderList.ResetPos();
    }

    /*打开领袖图鉴列表*/
    private function OnLeaderCollec(): void {
        MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_LeaderCollect, null);
    }
}