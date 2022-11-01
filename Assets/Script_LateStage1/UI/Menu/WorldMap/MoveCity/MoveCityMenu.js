/*
 * @FileName:		MoveCityMenu.js
 * @Author:			xue
 * @Date:			2022-04-28 04:34:45
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迁城道具 - UI界面
 *
*/


public class MoveCityMenu extends PopMenu {
    @Space(30) @Header("MoveCityMenu")

    @SerializeField private var scroll: ScrollList;

    @SerializeField private var item: ListItem;

    public var texture_line: Texture2D;

    public function Init() {
        super.Init();

        title.txt = Datas.getArString("Teleport.TeleportConfirm_Text3");
        if (title.txt == "Teleport.TeleportConfirm_Text3") {
            title.txt = Datas.getArString("选择道具");
        }
        scroll.Init(item);
    }

    public function DrawBackground() {
        super.DrawBackground();
        this.drawTexture(texture_line, 45, 105, 490, 17);
    }

    public function Update() {
        scroll.Update();
    }

    public function DrawItem() {
        if (!visible) return;
        title.Draw();
        scroll.Draw();
    }

    public function OnPush(param: Object) {
        super.OnPush(param);

        scroll.Clear();
        scroll.SetData(priv_getOwnedItemList());
        scroll.ResetPos();
    }

    public function OnPopOver() {
        scroll.Clear();
    }


    /*筛选背包里面 迁城道具 加入数组*/
    private function priv_getOwnedItemList(): Array {

        var myItems: MyItems = MyItems.instance();
        var arrDat: System.Collections.Generic.List.<InventoryInfo> = myItems.GetList(MyItems.Category.Attack);
        var array: Array = new Array();
        for (var j = arrDat.Count - 1; j >= 0; j--) {
            if ((arrDat[j] as InventoryInfo).id == 912 || (arrDat[j] as InventoryInfo).id == 915 || (arrDat[j] as InventoryInfo).id == 916)
                array.Push(arrDat[j]);
        }
        return array;

    }

}