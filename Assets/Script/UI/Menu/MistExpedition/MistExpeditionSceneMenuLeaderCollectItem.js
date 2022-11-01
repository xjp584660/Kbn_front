/*
 * @FileName:		MistExpeditionSceneMenuLeaderCollectItem.js
 * @Author:			xue
 * @Date:			2022-08-16 05:45:49
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	已拥有的领袖列表 - 物品项  
 *
*/


public class MistExpeditionSceneMenuLeaderCollectItem extends ListItem {
    @Space(30) @Header("---------- MistExpedition SceneMenu Collect Item ----------")

    @SerializeField private var leaderName: Label;

    @SerializeField private var leaderFrame: Label;

    @SerializeField private var leaderHead: Label;

    @SerializeField private var leaderHeadBack: Label;

    @SerializeField private var leaderLock: Label;

    @SerializeField private var leaderButtonDetall: Button;


    @Space(20) @Header("--------------该领袖是否是需要在商店购买的--------------")
    public var isLeaderShopBuy: boolean = false;/*默认是不需要购买的*/


    private var leaderInfo: MistExpeditionLeaderInfo;

    public function Init() {
        leaderName.Init();
        leaderFrame.Init();
        leaderHead.Init();
        leaderHeadBack.Init();

        leaderButtonDetall.OnClick = OnDetallClick;
        leaderLock.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_collect_lock");
    }

    public function Draw(): int{
        if (!visible) return;

        GUI.BeginGroup(rect);
        leaderName.Draw();
        leaderFrame.Draw();
        leaderHeadBack.Draw();

        if (isLeaderShopBuy) {
            var oldColor: Color = GUI.color;
            GUI.color = Color(0.3f, 0.3f, 0.3f, 1.0f);
            leaderHead.Draw();
            GUI.color = oldColor;
        } else {
            leaderHead.Draw();
        }

        leaderButtonDetall.Draw();
        leaderLock.Draw();


        GUI.EndGroup();

        return -1;
    }

    public function SetRowData(tempData: Object): void {
        leaderInfo = tempData as MistExpeditionLeaderInfo;
        leaderLock.SetVisible(false);

        if (leaderInfo == null) return;

        leaderName.txt = Datas.getArString(leaderInfo.Name);

        /*领袖头像图片*/
        var Head: String = leaderInfo.HeadIcon;
        var headTile = TextureMgr.instance().GetHeroSpt().GetTile(Head);
        if (headTile.prop != null) {
            leaderHead.useTile = true;
            leaderHead.tile = headTile;
        }
        else {
            var headImg = TextureMgr.instance().LoadTexture(Head, TextureType.MISTEXPEDITION);
            if (headImg != null) {
                leaderHead.useTile = false;
                leaderHead.mystyle.normal.background = headImg;
            } else {
                leaderHead.useTile = true;
                leaderHead.tile = headTile;
            }
        }
        
        /*领袖头像背景图片*/
        var HeadBack: String = leaderInfo.HeadBack;
        var Tile = TextureMgr.instance().GetHeroSpt().GetTile(HeadBack);
        if (Tile.prop != null) {
            leaderHeadBack.tile = Tile;
        }
        else {
            var TileImg = TextureMgr.instance().LoadTexture(HeadBack, TextureType.MISTEXPEDITION);
            if (TileImg != null)
                leaderHeadBack.mystyle.normal.background = TileImg;
        }
    }

    /*技能详细界面*/
    private function OnDetallClick(param: Object): void {
        if (leaderInfo.alreadyOwned)/*只有已拥有的才能查看技能*/
            MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_LeaderSkillInfo, leaderInfo);
    }
}