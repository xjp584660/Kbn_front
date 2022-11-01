/*
 * @FileName:		MistExpeditionSceneMenuBuff.js
 * @Author:			xue
 * @Date:			2022-04-19 06:14:02
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 增益Buff
 *
*/


public class MistExpeditionSceneMenuBuff extends PopMenu {

    @Space(30) @Header("----------MistExpedition Scene Buff----------")

    @SerializeField private var divideLine: Label;
    @SerializeField private var scrollList: ScrollList;
    @SerializeField private var item: ListItem;
    @SerializeField private var buffNull: Label;

    @Space(30)/*字符串Key*/
    @SerializeField private var langKey_nobuff: String;

    public function Init(): void {
        super.Init();
        btnClose.Init();
        btnClose.OnClick = handleBack;

        title.Init();

        divideLine.Init();
        divideLine.setBackground("between line", TextureType.DECORATION);

        scrollList.Init(item);
    }

    public function OnPush(param: Object) {

        buffNull.visible = false;
        buffNull.txt = "";

        var array: Array = MistExpeditionManager.GetInstance().GetSelectedBuffArray();
        if (array == null) return;
        if (array.length > 0) {
            scrollList.SetData(array);
            scrollList.ResetPos();
        }
        else {
            /*没有buff时显示一段文字*/
            buffNull.visible = true;
            buffNull.txt = Datas.getArString(langKey_nobuff);
        }
        title.txt = Datas.getArString("Expedition.Scene_Buff");
    }

    public function Update() {

        scrollList.Update();
    }

    public function DrawItem() {

        if (!visible) return;
        divideLine.Draw();
        scrollList.Draw();
        buffNull.Draw();
    }

    public function OnPopOver(): void {

        super.OnPopOver();

        scrollList.Clear();

    }

    private function handleBack(): void {
        MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_Buff);
    }
}