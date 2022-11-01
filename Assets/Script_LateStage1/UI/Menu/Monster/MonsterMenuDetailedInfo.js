/*
 * @FileName:		MonsterMenuDetailedInfo.js
 * @Author:			xue
 * @Date:			2022-06-27 02:19:29
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	魔物迷宫 - 掉落物品详细 - 信息
 *
*/


public class MonsterMenuDetailedInfo extends PopMenu {
    @Space(30) @Header("----------MonsterMenu - DetailedInfo----------")


    public var itemBG: SimpleLabel;/*物体背景*/
    public var itemName: Label;/*物体名字*/
    public var itemDesc: Label;/*物体简介*/
    public static var isSwitch: boolean;/*是否点击物体详细按钮*/

    public var widthSoce: float;

    private var itemId: int;/*物体ID*/


    /*控制打开活着关闭*/
    public static function IsMonsterMenuDetailedInfo(bool: boolean) {
        isSwitch = bool;
    }

    public  function Init() {
        super.Init();
        this.itemBG.Init();
        this.itemName.Init();
        this.itemDesc.Init();
    }

    public  function Draw() {
        if (!visible) return;
        this.itemBG.Draw();
        this.itemName.Draw();
        this.itemDesc.Draw();
    }

    public  function SetData(param: Object) {
        itemId = _Global.INT32(param);
        if (itemId <= 0) {
             UnityEngine.Debug.Log("< color=#00ff00 >  物体的ID不正确 : </color >" + this.itemId);
            return;
        }

        itemName.txt = Datas.getArString("itemName." + "i" + itemId);

        var strHeight: int = itemName.GetWidth();/*获取物体名称的宽度*/

        itemName.rect.width = strHeight + widthSoce - 50;/*设置物体名称的宽度*/

        itemBG.rect.width = strHeight + widthSoce;/*让背景的宽度 = 一个初始长度 + 名称的长度*/

        itemDesc.rect.width = strHeight + widthSoce;/*让物体介绍的宽度 等于背景的宽度*/


        itemDesc.txt = Datas.getArString("itemDesc." + "i" + itemId);

    }

}