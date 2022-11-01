/*
 * @FileName:		MistExpeditionMenuExchangeEventListMenu.js
 * @Author:			xue
 * @Date:			2022-04-22 06:35:47
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 兑换 - 二级界面
 *
*/


public class MistExpeditionMenuExchangeEventListMenu extends PopMenu {
    @Space(30) @Header("----------MistExpedition - Exchange - EventListMenu----------")

    @SerializeField private var mistExpeditionMenuExchangeEventListMenuItem: MistExpeditionMenuExchangeEventListMenuItem;
    @SerializeField private var item: MistExpeditionMenuExchangeEventListMenuItem;

    private var data: KBN.EventEntity;


    public function Init() {
        super.Init();
    }

    public function OnPush(param: Object) {

        super.OnPush(param);
        data = param as KBN.EventEntity;
        if (data == null) return;

        OnPopOver();


        /*初始化item*/
        item = Instantiate(mistExpeditionMenuExchangeEventListMenuItem) as MistExpeditionMenuExchangeEventListMenuItem;
        item.Init();




        item.SetRowData(param);
        Position();

    }

    /*根据物体来设置大小*/
    private function Position() {
        rect.height = item.rect.height + 10;
        frameSimpleLabel.rect.height = rect.height + 7;
        rect.y = (960 - rect.height) / 2;
    }


    public function OnPopOver() {
        super.OnPopOver();

        /*清除item缓存*/
        if (item == null) return;
        item.OnClear();
        TryDestroy(item);
    }


    public function DrawItem() {
        if (!visible) return;
        item.Draw();
    }

    public function Update() {
        if (item) {
            item.Update();
        }
    }

    /*兑换成功数据刷新*/
    public function handleNotification(type: String, body: Object): void {
        switch (type) {
            case Constant.Notice.OnMutiClaimOK:
                RestPush();
                break;
        }
    }

    private function RestPush() {
        if (data != null) {
            data = IsArt() ?
                Museum.singleton.GetArtById(data.id) :
                Museum.singleton.GetEventById(data.id);
        }
        TryDestroy(item);
        OnPush(data);
    }

    private function IsArt(): boolean {
        if (data != null) {
            return data.tab > 10;
        }
    }

}