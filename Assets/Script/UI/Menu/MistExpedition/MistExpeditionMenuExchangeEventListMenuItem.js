/*
 * @FileName:		MistExpeditionMenuExchangeEventListMenuItem.js
 * @Author:			xue
 * @Date:			2022-04-24 09:54:29
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 兑换 - 二级界面 - 物品项
 *
*/


public class MistExpeditionMenuExchangeEventListMenuItem extends ListItem implements IEventHandler {

    @Space(30) @Header("----------MistExpedition - Exchange - EventListMenu - Item----------")


    @SerializeField private var bg: Label;
    @SerializeField private var eventName: Label;
    @SerializeField private var limitDes: Label;
    @SerializeField private var timeTitle: Label;
    @SerializeField private var timeCounter: Label;
    @SerializeField private var titleBg: Label;

    @Space(10)

    @SerializeField private var lineDec: Label;
    @SerializeField private var itemPic: ItemPic;
    @SerializeField private var itemDes: Label;
    @SerializeField private var itemName: Label;
    @SerializeField private var itemRewardNum: Label;

    @Space(10)

    @SerializeField private var stateIcon: Label;
    @SerializeField private var infoIcon: Label;
    @SerializeField private var buttonPeek: Button;/*物体详细按钮*/
    @SerializeField private var requireLabel: Label;
    @SerializeField private var centerBg: Label;

    @Space(10)

    @SerializeField private var compoentEvent: ComposedUIObj;
    @SerializeField private var componentTitle: ComposedUIObj;
    @SerializeField private var componentPiece: ComposedUIObj;
    @SerializeField private var component: ComposedUIObj;

    @Space(10)
    @SerializeField private var pieceObj: MuseumExchangePieceItem;
    @SerializeField private var conversionBtn: Button;/*兑换按钮*/


    @Space(10)
    @SerializeField private var satisfied: Texture2D;
    @SerializeField private var unsatisfied: Texture2D;


    private var eventId: int;
    private var endTime: long;
    private var oldTime: long;
    private var presentTime: long;
    private var isEventOver: boolean;

    private var data: KBN.EventEntity;

    private var selectedExchangePiece: MuseumExchangePieceItem = null;

    public function Init() {

        eventName.Init();
        limitDes.Init();
        stateIcon.Init();

        bg.Init();
        titleBg.Init();
        timeTitle.Init();
        timeCounter.Init();

        lineDec.Init();

        itemDes.Init();
        itemName.Init();
        itemRewardNum.Init();
        infoIcon.Init();
        infoIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("infor_icon", TextureType.DECORATION);
        buttonPeek.Init();


        requireLabel.Init();
        pieceObj.Init();
        conversionBtn.Init();

        componentTitle.component = [eventName, timeTitle, timeCounter, limitDes, lineDec];
        compoentEvent.component = [itemPic, itemDes, itemName, itemRewardNum, stateIcon, infoIcon, buttonPeek];
        componentPiece.component = [requireLabel, component];

    }

    public function OnClear() {

        super.OnClear();
        component.clearUIObject();
    }

    public function get getId(): int {
        return eventId;
    }

    private function get IsOrLogic(): boolean {
        return (null == data) ? false : (data.logicType == Constant.Museum.ExchangeLogicType.LOGIC_OR);
    }

    public function Draw() {
        if (!visible) return;
        GUI.BeginGroup(rect);
        centerBg.Draw();
        bg.Draw();

        componentTitle.Draw();
        compoentEvent.Draw();
        componentPiece.Draw();

        conversionBtn.Draw();

        GUI.EndGroup();


    }

    public function SetRowData(param: Object) {

        data = param as KBN.EventEntity;

        eventId = data.id;
        endTime = data.endTime;

        buttonPeek.OnClick = OnButtonPeekButton;

        component.clearUIObject();/*清除之前的Item数据*/
        var obj: MuseumExchangePieceItem;
        for (var a: int = 0; a < data.pieces.Count; a++) {
            obj = Instantiate(pieceObj);
            obj.setData(data.pieces[a]);
            obj.handleDelegate = this;
            obj.setToggleVisible(IsOrLogic);
            component.addUIObject(obj);
        }

        component.AutoLayout();

        component.AutoLayout();

        /*设置兑换物体信息的位置*/
        componentPiece.rect.height = component.rect.height + component.rect.y;
        titleBg.rect.height = componentPiece.rect.height;

        /*根据兑换物体信息的位置 来设置兑换按钮的位置*/
        conversionBtn.rect.y = componentPiece.rect.y + componentPiece.rect.height + 30;
        rect.height = conversionBtn.rect.y + conversionBtn.rect.height + 15;
        centerBg.rect.height = conversionBtn.rect.y - centerBg.rect.y - 20;
        bg.rect.height = rect.height;

        requireLabel.txt = Datas.getArString("Common.Requirement");

        if (data.limitQuantity == 0) {
            limitDes.SetVisible(false);
            conversionBtn.txt = Datas.getArString("fortuna_gamble.win_claimButton");
            conversionBtn.OnClick = OnClaim;
        }
        else if (Museum.singleton.ComputeClaimCount(data) > 1 && data.batchReward) {
            limitDes.SetVisible(true);
            conversionBtn.txt = "(" + data.changedQuantity + "/" + data.limitQuantity + ")  " + Datas.getArString("fortuna_gamble.win_claimButton") + "...";
            conversionBtn.OnClick = OnMutiClaim;
        }
        else {
            limitDes.SetVisible(true);
            conversionBtn.txt = "(" + data.changedQuantity + "/" + data.limitQuantity + ")  " + Datas.getArString("fortuna_gamble.win_claimButton");
            conversionBtn.OnClick = OnClaim;
        }

        eventName.txt = data.eventName + "";
        limitDes.txt = "( " + Datas.getArString("Museum.EventLimit") + ": " + data.limitQuantity + " )";

        itemPic.SetId(data.itemId);/*加载兑换物体图片*/

        var itemCategary: int = MyItems.GetItemCategoryByItemId(data.itemId);
        data.itemCategary = itemCategary;

        if (itemCategary == MyItems.Category.MystryChest) {
            itemDes.txt = MystryChest.instance().GetChestDesc(data.itemId);
            itemName.txt = MystryChest.instance().GetChestName(data.itemId);
            infoIcon.SetVisible(true);
            buttonPeek.SetVisible(true);
        }
        else if (itemCategary == MyItems.Category.LevelChest) {
            itemDes.txt = Datas.getArString("Common.LevelChestDesc", [MystryChest.instance().GetLevelOfChest(data.itemId)]);
            itemName.txt = Datas.getArString("Common.LevelChestName", [MystryChest.instance().GetLevelOfChest(data.itemId)]);
            infoIcon.SetVisible(true);
            buttonPeek.SetVisible(true);
        }
        else if (itemCategary == MyItems.Category.Chest || itemCategary == MyItems.Category.TreasureChest) {
            itemDes.txt = Datas.getArString("itemDesc." + "i" + data.itemId);
            itemName.txt = Datas.getArString("itemName." + "i" + data.itemId);
            infoIcon.SetVisible(true);
            buttonPeek.SetVisible(true);
        }
        else {
            itemDes.txt = Datas.getArString("itemDesc." + "i" + data.itemId);
            itemName.txt = Datas.getArString("itemName." + "i" + data.itemId);
            infoIcon.SetVisible(false);
            buttonPeek.SetVisible(false);
        }

        var _size: Vector2 = itemName.mystyle.CalcSize(GUIContent(itemName.txt));
        itemName.rect.width = _size.x + 10;
        itemRewardNum.rect.x = itemName.rect.x + itemName.rect.width + 5;
        itemRewardNum.txt = "x" + data.itemNum;

        timeTitle.txt = Datas.getArString("ModalEvent.TimeRemaining");
        timeTitle.SetFont();
        timeCounter.rect.x = timeTitle.rect.x + timeTitle.GetWidth() + 15;




        if (data.canClaim) {
            stateIcon.mystyle.normal.background = satisfied;
        }
        else {
            stateIcon.mystyle.normal.background = unsatisfied;

        }
        if (data.endTime > GameMain.unixtime()) {
            isEventOver = false;
        } else if (data.endTime == 0) {
            isEventOver = false;
        }
        else {
            timeCounter.txt = "0";
            isEventOver = true;
        }

        timeCounter.SetVisible(data.tab <= 10 && data.endTime != 0);
        timeTitle.SetVisible(data.tab <= 10 && data.endTime != 0);
        changeBtnSkin(isEventOver || !data.canClaim || !canClaimInLogicOr());
    }


    public function Update() {
        if (isEventOver) {
            return;
        }

        if (!isEventOver) {
            var present: long = GameMain.unixtime();
            if (present - oldTime >= 1) {
                if (endTime == 0 || endTime - present >= 0 || data.tab > 10) {
                    timeCounter.txt = _Global.timeFormatStr(endTime - present);
                    oldTime = present;
                }
                else {
                    isEventOver = true;
                    changeBtnSkin(isEventOver);
                }
            }
        }
    }


    /*按钮的图片切换*/
    private function changeBtnSkin(canntClick: boolean): void {
        if (canntClick) {
            conversionBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
            conversionBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
            conversionBtn.SetDisabled(true);
        }
        else {
            conversionBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);
            conversionBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew", TextureType.BUTTON);
            conversionBtn.SetDisabled(false);
        }
    }


    /*兑换多个方法*/
    private function OnMutiClaim(param: Object): void {
        if (isEventOver || !data.canClaim || !canClaimInLogicOr()) {
            return;
        }
        var crestId: int = -1;
        if (IsOrLogic) crestId = selectedExchangePiece.getId;

        var pushData: HashObject = new HashObject({
            "eventName": data.eventName, "tab": data.tab, "endTime": data.endTime, "eventId": eventId, "crestId": crestId, "itemId": data.itemId,
            "exchangeMaxCount": Museum.singleton.ComputeClaimCount(data), "hasClaimedCount": data.changedQuantity, "claimCapCount": data.limitQuantity
        });
        MenuMgr.getInstance().PushMenu("MutiClaimPopMenu", pushData, "trans_zoomComp");
        return;
    }


    /*兑换方法*/
    private function OnClaim(param: Object): void {
        if (data.tab > 10 || endTime == 0) {
            Claim();
        }
    }


    private function canClaimInLogicOr(): boolean {
        if (IsOrLogic) {
            return (null != selectedExchangePiece && selectedExchangePiece.IsSatisfied);
        }
        return true;
    }

    private function Claim() {

        /*回掉函数*/
        var ok = function (result: HashObject) {
            if (result["ok"].Value) {
                var itemIdlist: Array = _Global.GetObjectKeys(result["reward"]);
                for (var i = 0; i < itemIdlist.length; i++) {
                    var itemId: int = _Global.INT32(itemIdlist[i]);
                    var count: int = _Global.INT32(result["reward"][itemIdlist[i]].Value);
                    MyItems.instance().AddItem(itemId, count);
                }
                for (var j = 0; j < data.pieces.Count; j++) {
                    var piece: KBN.EventEntity.EventPiece = data.pieces[j] as KBN.EventEntity.EventPiece;
                    MyItems.instance().AddItem(piece.id, (0 - piece.needNum));
                }
                var num: int = _Global.INT32(result["claimCount"]);

                var mistExpeditionMenu: MistExpeditionMenu = MenuMgr.getInstance().getMenu("MistExpeditionMenu") as MistExpeditionMenu;
                if (mistExpeditionMenu) {
                    Museum.instance().ReSetArtDatas(data.id, num);/*刷新物体的信息*/
                    Museum.instance().ArifactPriority();
                }
                callBack();
            }
        };

        UnityNet.ClaimArtifact(data.id, ok, null);

    }

    /*兑换成功 外部Item数据刷新*/
    private function callBack(): void {
        var mistExpeditionMenuExchange: MistExpeditionMenuExchange = (MenuMgr.getInstance().getMenu("MistExpeditionMenu") as MistExpeditionMenu).mistExpeditionMenuExchange;
        mistExpeditionMenuExchange.handleItemAction(EventDetail.RESET_EVENT_DISPLAY, (data.tab > 10 || data.endTime == 0) ? 1 : 0);
        MenuMgr.getInstance().PushMessage(Datas.getArString("Common.actionSucess"));
        MenuMgr.instance.sendNotification(Constant.Notice.OnMutiClaimOK, null);
    }


    /*物体详细信息*/
    public function OnButtonPeekButton() {

        MenuMgr.getInstance().PushMenu("ChestDetail",
            new HashObject({ "ID": data.id, "Category": data.itemCategary, "inShop": true }),
            "trans_zoomComp");
    }

}