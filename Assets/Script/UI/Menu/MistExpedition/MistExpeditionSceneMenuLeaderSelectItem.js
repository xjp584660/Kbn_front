/*
 * @FileName:		MistExpeditionSceneMenuLeaderSelectItem.js
 * @Author:			xue
 * @Date:			2022-04-19 11:20:58
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 领袖选择 - 物品项
 *
*/


public class MistExpeditionSceneMenuLeaderSelectItem extends ListItem {
    @Space(30) @Header("---------- MistExpedition SceneMenu LeaderSelect Item ----------")



    @SerializeField private var select: Button;
    @SerializeField private var exlporeDecorationTop: Label;
    @SerializeField private var info: Label;
    @SerializeField private var frame: Label;
    @SerializeField private var sleepTime: Label;
    @SerializeField private var head: Label;
    @SerializeField private var headBack: Label;
    @SerializeField private var skillName: Label[];
    @SerializeField private var LeaderName: Label;
    @SerializeField private var panelBack: Label;
    @SerializeField private var exlporeDecorationBottom: Label;
    @SerializeField private var detall: Button;
    @SerializeField private var unpurchased: Label;
    @SerializeField private var expect: Label;
    @SerializeField private var lock: Label;
    @SerializeField private var comingSoon: Label;

    private var leaderInfo: MistExpeditionLeaderInfo;

    @Space(20)/*字符串*/
    @SerializeField private var langkey_Scene_Tips1: String;/*确认选择次领袖？选择后本次远征过程中将无法更改领袖。*/
    @SerializeField private var langKey_LeaderUnlock2: String;/*远征商店解锁*/
    @SerializeField private var langKey_LeaderUnlock3: String;/*敬请期待*/
    @SerializeField private var langKey_Expedition_StayTuned: String;/*内容暂未开放 敬请期待*/	

    @Space(20) @Header("--------------该领袖是否是需要在商店购买的--------------")
    public var isLeaderShopBuy: boolean = false;/*默认是不需要购买的*/


    public function Init(): void {
        select.txt = Datas.getArString("Common.Select");
        select.changeToBlueNew();

        info.mystyle.normal.background = TextureMgr.instance().LoadTexture("infor_icon", TextureType.DECORATION);
        frame.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_heroframe1");
        sleepTime.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_time");

        select.OnClick = OnSelectClick;
        detall.OnClick = OnDetallClick;

        unpurchased.alpha = 0.7f;
    }

    public function SetRowData(data: Object): void {
        leaderInfo = data as MistExpeditionLeaderInfo;
        info.SetVisible(false);

        if (leaderInfo == null) return;
        comingSoon.txt = String.Empty;

        /*判断这个领袖是否在列表里面有值  列表里面需要多一个空值的来表示尽情期待*/
        if (leaderInfo.alreadyOwned) {
            info.SetVisible(true);
            select.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);
            select.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);

            /*领袖头像图片*/
            var leaderHead: String = leaderInfo.HeadIcon;
            var headTile = TextureMgr.instance().GetHeroSpt().GetTile(leaderHead);
            if (headTile.prop != null) {
                head.useTile = true;
                head.tile = headTile;
            } else {
                var img = TextureMgr.instance().LoadTexture(leaderHead, TextureType.MISTEXPEDITION);
                if (img != null) {
                    head.useTile = false;
                    head.mystyle.normal.background = img;
                }
            }

            /*领袖头像背景图片*/
            var leaderHeadBack: String = leaderInfo.HeadBack;
            var Tile = TextureMgr.instance().GetHeroSpt().GetTile(leaderHeadBack);
            if (Tile.prop != null) {
                headBack.useTile = true;
                headBack.tile = Tile;
            } else {
                var TileImg = TextureMgr.instance().LoadTexture(leaderHeadBack, TextureType.MISTEXPEDITION);
                if (TileImg != null) {
                    headBack.useTile = false;
                    headBack.mystyle.normal.background = TileImg;
                }
            }


            /*领袖名称*/
            var leaderName: String = leaderInfo.Name;
            LeaderName.txt = Datas.getArString(leaderName);


            /*领袖技能 目前直接锁第一个 后面的需要购买*/
            var skillIndex: int = 0;
            var fateIndex: int = 0;
            var leaderSkill: String[] = _Global.GetStringListByString(leaderInfo.Skill, "*");
            for (var i: Label in skillName) {
                if (skillIndex < leaderSkill.length) {
                    var leaderSkillName: String = "Expedition.BuffName_i" + leaderSkill[skillIndex];
                    i.txt = Datas.getArString(leaderSkillName);
                    if (skillIndex == 0) {
                        i.SetNormalTxtColor(FontColor.Light_Yellow);/*只有解锁的buff才显示为黄色 颜色为黄色*/
                    } else {
                        i.SetNormalTxtColor(FontColor.Description_Light);
                    }
                    skillIndex++;
                } else {
                    i.txt = String.Empty;
                }
            }


            unpurchased.SetVisible(false);
            expect.SetVisible(false);
            //lock.SetVisible(true);/*锁UI界面*/

        }
        else {
            select.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
            select.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);

            unpurchased.SetVisible(false);
            expect.SetVisible(true);
            lock.SetVisible(false);

            sleepTime.txt = String.Empty;
            head.tile = null;
            headBack.tile = null;
            comingSoon.txt = Datas.getArString(langKey_Expedition_StayTuned);
            LeaderName.txt = Datas.getArString(langKey_LeaderUnlock3);

            for (var i: Label in skillName) {
                i.txt = String.Empty;
            }

        }

    

    }

    public function Update(): void {

    }

    public function Draw(): int {
        if (!visible) return;

        GUI.BeginGroup(rect);

        panelBack.Draw();
        headBack.Draw();
        expect.Draw();
        if (isLeaderShopBuy) {
            var oldColor: Color = GUI.color;
            GUI.color = Color(0.3f, 0.3f, 0.3f, 1.0f);
            head.Draw();
            GUI.color = oldColor;
        } else {
            head.Draw();
        }
        unpurchased.Draw();
        frame.Draw();
        info.Draw();
        select.Draw();
        exlporeDecorationTop.Draw();
        sleepTime.Draw();
        LeaderName.Draw();
        exlporeDecorationBottom.Draw();
        detall.Draw();
        lock.Draw();
        comingSoon.Draw();

        for (var i: Label in skillName) {
            i.Draw();
        }
        GUI.EndGroup();

        return -1;
    }

    /*确认选择按钮*/
    private function OnSelectClick(): void {
        /* 是否已将选择了领袖 */
        if (MistExpeditionManager.GetInstance().IsHaveLeader())
            return;

        if (!leaderInfo.alreadyOwned) return;
        var dialog: ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
        dialog.setDefaultButtonText();
        var content: String = Datas.getArString(langkey_Scene_Tips1);
        dialog.setLayout(580, 320);
        dialog.setContentRect(70, 80, 0, 100);
        dialog.SetCancelAble(true);
        MenuMgr.getInstance().PushConfirmDialog(content, "", SelectLeader, null);
    }

    /*选择成功关闭界面*/
    private function SelectLeader(): void {

        if (!leaderInfo.alreadyOwned) return;/*只有已拥有的才能选择*/

        var okFunc: Function = function (result: HashObject) {
            MenuMgr.getInstance().PopMenu("");

            MistExpeditionManager.GetInstance().RequestMistExpeditionMapInfo(function (obj: HashObject) {

                MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_LeaderSelect);

                MistExpeditionManager.GetInstance().SetLeaderID(leaderInfo.ID);
            });

        };
        UnityNet.reqMistExpeditionSelectLeader(leaderInfo.ID, okFunc, null);
    }

    /*技能详细界面*/
    private function OnDetallClick(param: Object): void {
        if (leaderInfo.alreadyOwned)/*只有已拥有的才能查看技能*/
            MenuMgr.getInstance().PushMenu(Constant.MistExpeditionConst.SceneMenu_LeaderSkillInfo, leaderInfo);
    }

}