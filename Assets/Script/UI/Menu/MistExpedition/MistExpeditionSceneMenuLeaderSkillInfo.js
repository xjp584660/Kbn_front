/*
 * @FileName:		MistExpeditionSceneMenuLeaderSkillInfo.js
 * @Author:			xue
 * @Date:			2022-04-02 05:36:31
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	领袖技能详细
 *
*/


public class MistExpeditionSceneMenuLeaderSkillInfo extends ComposedMenu
{
    @Space(30) @Header("---------- MistExpedition SceneMenu Leader Skill Info ----------")

    @SerializeField private var frame: Label;/*头像框*/
    @SerializeField private var head: Label;/*头像*/
    @SerializeField private var headBack: Label;/*头像背景*/
    @SerializeField private var LeaderName: Label;
    @SerializeField private var LeaderDescribe: Label;
    @SerializeField private var skillBackground: Label;
    @SerializeField private var skillList: ScrollList;
    @SerializeField private var skillItem: MistExpeditionSceneMenuLeaderSkillInfoItem;
    @SerializeField private var skillBar: ToolBar;


    private var leaderInfo: MistExpeditionLeaderInfo;
    private var leaderSkillArray: Array;

    public function Init(): void {
        super.Init();

        menuHead.setTitle(Datas.getArString("HeroHouse.Detail_Title"));
        menuHead.backTile.rect = Rect(0, 0, 640, 140);
        menuHead.leftHandler = GoBackMenu;
        frameTop.rect = Rect(0, 70, frameTop.rect.width, frameTop.rect.height);


        frame.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_heroframe1");

        skillList.Init(skillItem);

        skillBar.Init();
        var skill: String = Datas.getArString("HeroHouse.Detail_SubTitle1");
        skillBar.toolbarStrings = [skill];
    }

    public function Update(): void {
        super.Update();
        menuHead.Update();
        skillList.Update();
    }

    public function DrawItem(): void {
        if (!visible)
            return;
        headBack.Draw();
        LeaderName.Draw();
        skillBackground.Draw();
        skillList.Draw();
        head.Draw();
        frame.Draw();
        skillBar.Draw();
        LeaderDescribe.Draw();

    }
    public function DrawBackground(): void {
        menuHead.Draw();
        bgStartY = 70;
        DrawMiddleBg();
        frameTop.Draw();
    }

    private function GoBackMenu(): void {
        KBN.MenuMgr.instance.PopMenu("MistExpeditionSceneMenuLeaderSkillInfo");
    }

    public function OnPopOver(): void {
        skillList.Clear();

        TryDestroy(menuHead);
        menuHead = null;
        super.OnPopOver();
    }

    public function OnPush(param: Object): void {
        super.OnPush(param);
        leaderInfo = param as MistExpeditionLeaderInfo;
        if (this.leaderInfo == null) return;
        leaderSkillArray = new Array();

        /*领袖头像图片*/
        var leaderHead: String = leaderInfo.HeadIcon;
        var headTile = TextureMgr.instance().GetHeroSpt().GetTile(leaderHead);
        if (headTile.prop != null) {
            head.useTile = true;
            head.tile = headTile;
        } else {
            var headImg = TextureMgr.instance().LoadTexture(leaderHead, TextureType.MISTEXPEDITION);
            if (headImg != null)/*如果本地也为空 就给他一个默认的 icon_default*/ {
                head.useTile = false;
                head.mystyle.normal.background = headImg;
            } else {
                head.useTile = true;
                head.tile = headTile;
            }

        }
        

        /*领袖头像背景图片*/
        var leaderHeadBack: String = leaderInfo.HeadBack;
        var Tile = TextureMgr.instance().GetHeroSpt().GetTile(leaderHeadBack);
        if (Tile.prop != null) {
            headBack.useTile = true;
            headBack.tile = Tile;
        }
        else {
            var TileImg = TextureMgr.instance().LoadTexture(leaderHeadBack, TextureType.MISTEXPEDITION);
            if (TileImg != null) {
                headBack.useTile = false;
                headBack.mystyle.normal.background = TileImg;
            } else {
                headBack.useTile = true;
                headBack.tile = Tile;
            }
                
        }



        /*处理领袖技能 开始的第一个为佩戴 后面三个需要购买*/
        var leaderSkill: String[] = _Global.GetStringListByString(leaderInfo.Skill, "*");
        /*获取buff 字典数据*/
        var leaderBuffDic: Dictionary.<String, KBN.DataTable.IDataItem> = MistExpeditionManager.GetInstance().GetBuffDic();
        var leaderBuffList: List.<int> = MistExpeditionManager.GetInstance().GetLeaderBuffList();/*获取领袖buff列表*/
        for (var i: int = 0; i < leaderSkill.length; i++) {
            var buffExist: boolean = false;
            if (leaderBuffList == null)/*领袖buff列表为空  代表 还没有购买领袖buff所以 只需默认第一个解锁*/ {
                if (i == 0) {
                    buffExist = true;
                } else {
                    buffExist = false;
                }
            } else {
                for (var j: int = 0; j < leaderBuffList.Count; j++) {
                    var leaderBuffID: int = _Global.INT32(leaderSkill[i]);/*当前领袖buff ID*/
                    if (leaderBuffID == leaderBuffList[j]) /*使用当前领袖buff ID 去领袖已购买里面 判断 ID 相同就是 已拥有*/{
                        buffExist = true;
                    }
                }
            }
            
            var leaderbuff: KBN.DataTable.ExpeditionBuff = leaderBuffDic[leaderSkill[i]] as KBN.DataTable.ExpeditionBuff;
            var Skill: MistExpeditionLeaderSkillInfo = new MistExpeditionLeaderSkillInfo();
            Skill.alreadyOwned = buffExist;
            Skill.Name = leaderbuff.NAME;
            Skill.Description = leaderbuff.DESCRIPTION;
            Skill.Value = _Global.FLOAT(leaderbuff.VALUE);
            Skill.Type = _Global.INT32(leaderbuff.VALUE_TYPE);

            leaderSkillArray.push(Skill);
        }



        RefreshHeroDetail();
    }

    private function RefreshHeroDetail(): void {

        /*领袖名称*/
        LeaderName.txt = Datas.getArString(leaderInfo.Name);

        /*领袖简介*/
        LeaderDescribe.txt = Datas.getArString(leaderInfo.Description);


        skillList.SetData(leaderSkillArray);
        skillList.ResetPos();
    }

}