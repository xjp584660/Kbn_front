/*
 * @FileName:		MistExpeditionMenuExchangeItem.js
 * @Author:			xue
 * @Date:			2022-04-22 05:38:08
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 远征币兑换 - 物品项
 *
*/


public class MistExpeditionMenuExchangeItem extends ListItem {

    @Space(30) @Header("----------MistExpedition - Exchange - Item----------")

    @SerializeField private var l_name: Label;
    @SerializeField private var  l_claimed: Label;
    @SerializeField private var l_time: Label;/*刷新时间*/
    @SerializeField private var point: Label;
    @SerializeField private var itemPic: ItemPic;
    @SerializeField private var iconstateIcon: Label;
    @SerializeField private var iconInfoIcon: Label;
    @SerializeField private var mistExpeditionGoldCount: Label;
    @SerializeField private var bgButton: SimpleButton;/*兑换按钮*/

    @SerializeField private var componentEvent: ComposedUIObj;
    @SerializeField private var componentBg: ComposedUIObj;

    @SerializeField private var scroll: ScrollList;
    @SerializeField private var item: ListItem;


    public var satisfied: Texture2D;
    public var unsatisfied: Texture2D;


    private var endTime: long;
    private var oldTime: long;
    private var eventId: int;


    private var data: KBN.EventEntity;

    @Space(20)/*字符串*/
    @SerializeField private var langKey_Exchange_Unlock: String;/*通关{0}次远征可解锁*/

    public function get getId(): int {
        return eventId;
    }

    public function Init() {

        l_name.Init();
        l_claimed.Init();
        l_time.Init();
        point.Init();

        l_claimed.Init();
        itemPic.Init();
        iconstateIcon.Init();

        iconInfoIcon.Init();
        iconInfoIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("infor_icon", TextureType.DECORATION);

        componentEvent.component = [itemPic, iconstateIcon, iconInfoIcon];

        bgButton.Init();
        bgButton.OnClick = ClickBg;

        scroll.Init(item);

    }

    public function DrawItem() {

        componentBg.Draw();
        componentEvent.Draw();


        l_claimed.Draw();
        l_name.Draw();
        l_time.Draw();

        point.Draw();
        scroll.Draw();

        bgButton.Draw();


    }


    public function SetRowData(param: Object) {

        data = param as KBN.EventEntity;
        eventId = data.id;

        itemPic.SetId(data.itemId);

        l_name.txt = Datas.getArString("itemName." + "i" + data.itemId) + "  x" + data.itemNum;
        l_claimed.txt = Datas.getArString("fortuna_gamble.win_claimButton") + ":" + data.changedQuantity + "/" + data.limitQuantity;


        scroll.Clear();
        scroll.SetData(data.pieces);
        scroll.ResetPos();
    }

    public function Update() {

        /*l_time.txt = _Global.timeFormatStr(endTime - present);*/
        //scroll.Update();
    }

    public function OnClear() {

        super.OnClear();
        scroll.Clear();
    }

    /*兑换方法*/
    private function ClickBg() {

        /*记录是否是点击过兑换*/
        PlayerPrefs.SetInt("MuseumPointId_" + eventId, 0);
        MenuMgr.getInstance().PushMenu("MistExpeditionMenuExchangeEventListMenu", data, "trans_zoomComp");
        point.SetVisible(isPoint());

    }

    /*判断是否被点击过*/
    private function isPoint(): boolean {
        return PlayerPrefs.GetInt("MuseumPointId_" + eventId, 0) == 1;
    }

}