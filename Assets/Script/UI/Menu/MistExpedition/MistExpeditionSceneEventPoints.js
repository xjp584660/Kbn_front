/*
 * @FileName:		MistExpeditionSceneEventPoints.js
 * @Author:			xue
 * @Date:			2022-05-24 04:01:31
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 事件点界面
 *
*/


public class MistExpeditionSceneEventPoints extends PopMenu {

    @Space(30) @Header("----------MistExpedition - Scene - EventPoints----------")

    @SerializeField private var divideLine: Label;
    @SerializeField private var scrollList: ScrollList;
    @SerializeField private var item: ListItem;


    @Space(20) @Header("------字符串------")
    @SerializeField private var langKey_Scene_EventIntro: String;/*事件点简介*/



    @Space(20)
    @SerializeField private var eventPointsarray: EventPoints[];/*事件点数据*/

    public function Init() {
        super.Init();
        btnClose.Init();
        btnClose.OnClick = handleBack;

        title.Init();

        divideLine.Init();
        divideLine.setBackground("between line", TextureType.DECORATION);

        scrollList.Init(item);
    }

    public function DrawItem() {
        if (!visible) return;
        divideLine.Draw();
        scrollList.Draw();
    }


    public function OnPush(param: Object) {

        scrollList.SetData(eventPointsarray);
        scrollList.ResetPos();

        title.txt = Datas.getArString(langKey_Scene_EventIntro);
    }

    public function Update() {

        scrollList.Update();
    }

    public function OnPopOver(): void {

        super.OnPopOver();

        scrollList.Clear();

    }

    private function handleBack(): void {
        MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_EventPoints);
    }
}

public class EventPoints {
    public  var langKey_Scene_EventName: String;/*事件点名称*/
    public var langKey_Scene_EventDesc: String;/*事件点名称简介*/
    public var image: Texture;/*事件点图片*/
}