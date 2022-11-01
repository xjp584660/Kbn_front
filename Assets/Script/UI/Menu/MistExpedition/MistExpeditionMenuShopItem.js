/*
 * @FileName:		MistExpeditionMenuShopItem.js
 * @Author:			xue
 * @Date:			2022-04-19 09:46:33
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 商店 - 物品项
 *
*/


public class MistExpeditionMenuShopItem extends ListItem {
	@Space(30) @Header("----------MistExpedition - MenuShop - Item----------")

	@SerializeField private var price: Label;

	@SerializeField private var line: SimpleLabel;

	@SerializeField private var btnDetail: Button;

	@SerializeField private var btnPeekInside: Button;

	@SerializeField private var sale: Label;

	@SerializeField private var frame: Label;

	@SerializeField private var saleComponent: SaleComponent;

	@SerializeField private var blackFrame: Label;

	@SerializeField private var reverseBg: Label;

	@SerializeField private var owned: Label;

	@SerializeField private var inforIcon: Label;

	@SerializeField private var isRestrictBuy: boolean;/*拒绝购买*/

	@SerializeField public var bNew: boolean;



	/* desc fade */
	private var combination: CombinationController;
	private var desFade: Fade;
	private var btnPeekFade: Fade;
	private var turnover: Turnover;
	private var iconInforFade: Fade;
	private var nameFade: Fade;


	private var m_data: Hashtable;
	private var oldSaleState: boolean;
	private var restrictBuynumber: int = 50;/*最大购买数量*/
	private var isDescShow = false;/*desc Des*/


	public function getbSale(): boolean {
		return saleComponent.isCutSale && saleComponent.isShowSale;
	}

	public function Init() {
		super.Init();
		InventInit();


		isRestrictBuy = false;

		saleComponent.Init();
		useGroupDraw = false;
		icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		icon.useTile = true;

		btnPeekInside.txt = Datas.getArString("Common.LookInside");

		blackFrame.Init();
		blackFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("backFrame", TextureType.FTE);


		desFade = new Fade();
		desFade.init(description, EffectConstant.FadeType.FADE_IN);
		combination.add(desFade);

		btnPeekFade = new Fade();
		btnPeekFade.init(btnPeekInside, EffectConstant.FadeType.FADE_IN);
		combination.add(btnPeekFade);


		btnPeekInside.Init();
		btnPeekInside.OnClick = handlePeek;

		btnDetail.OnClick = handleDetail;
	}

	/* desc fade */
	private function InventInit() {
		reverseBg.alphaEnable = true;
		reverseBg.alpha = 0.7f;

		combination = new CombinationController(CombinationController.CombinationType.SERIAL);

		turnover = new Turnover();
		turnover.init(null, reverseBg, true);
		combination.add(turnover);

		iconInforFade = new Fade();
		iconInforFade.init(inforIcon, EffectConstant.FadeType.FADE_OUT);
		combination.add(iconInforFade);

		nameFade = new Fade();
		nameFade.init(title, EffectConstant.FadeType.FADE_IN);
		combination.add(nameFade);


		isDescShow = false;
	}

	/* 点击 desc 按钮 */
	private function handleDetail(): void {

		var mistExpedtionMenu: MistExpeditionMenu = MenuMgr.getInstance().getMenu("MistExpeditionMenu") as MistExpeditionMenu;
		var mistExpeditionMenuShop: MistExpeditionMenuShop = mistExpedtionMenu.mistExpeditionMenuShop;

		isDescShow = mistExpeditionMenuShop.GetSelectedId(ID);
		if (isDescShow) {
			combination.revertEffect();
			mistExpeditionMenuShop.addSelectedId(ID, !isDescShow);
		}
		else {
			combination.playEffect();
			mistExpeditionMenuShop.addSelectedId(ID, !isDescShow);
		}
		//isDescShow = !isDescShow;
	}

	private function handlePeek() {
		var id: HashObject = new HashObject({ "ID": ID, "Category": m_data["Category"], "inShop": true });
		MenuMgr.getInstance().PushMenu("ChestDetail", id, "trans_zoomComp");
	}

	public function DrawItem() {
		if (!visible)
			return;

		title.Draw();
		blackFrame.Draw();
		saleComponent.Draw();
		owned.Draw();

		turnover.drawItems();
		nameFade.drawItems();
		desFade.drawItems();


		icon.Draw();
		sale.Draw();
		frame.Draw();

		btnPeekFade.drawItems();
		iconInforFade.drawItems();

		btnDetail.Draw();
		btnSelect.Draw();
	}

	public function Update() {
		saleComponent.Update();

		combination.updateEffect();

		if (oldSaleState != saleComponent.isCutSale) {
			oldSaleState = saleComponent.isCutSale;

			sale.SetVisible(saleComponent.isShowSale);

			var tempType: MyItems.Category = m_data["Category"];

			if (tempType == MyItems.Category.MystryChest) {
				tempType = 5;
			}

			MenuMgr.getInstance().sendNotification("updateDiscountInfo", tempType - 1);
		}

	}

	public function InitContent() {

		icon.tips = Datas.getArString("itemDesc." + "i" + ID);

		var mysStartTime: long = m_data["startTime"];
		var mysEndTime: long = m_data["endTime"];
		var category: MyItems.Category = _Global.INT32(m_data["Category"]);
		if (category == MyItems.Category.MystryChest) {
			mysStartTime = m_data["salePrice"] == 0 ? 0 : m_data["discountStartTime"];
			mysEndTime = m_data["salePrice"] == 0 ? 0 : m_data["discountEndTime"];
		}

		saleComponent.setData(m_data["price"], m_data["salePrice"], mysStartTime, mysEndTime, m_data["isShow"]);
		oldSaleState = saleComponent.isCutSale;

		sale.SetVisible(saleComponent.isShowSale);


		var texMgr: TextureMgr = TextureMgr.instance();
		icon.tile.name = texMgr.LoadTileNameOfItem(ID);

		if (category != MyItems.Category.Chest && category != MyItems.Category.MystryChest) {
			btnPeekInside.SetVisible(false);
		}
		else {
			btnPeekInside.SetVisible(true);
		}
	}

	public function UpdateData() {

		var seed: HashObject = GameMain.instance().getSeed();
		SetOwnedCnt(seed["items"]["i" + ID] ? _Global.INT32(seed["items"]["i" + ID]) : 0);
	}

	/*判断是否还可以购买 来切换按钮图片*/
	private function SetRestrictBuyCount(isBuy: boolean) {
		isRestrictBuy = isBuy;
		if (isBuy) {
			btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew", TextureType.BUTTON);
			btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew", TextureType.BUTTON);
		}
		else {
			btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
			btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
		}
	}

	/*购买成功之后 数量的刷新*/
	private function SetOwnedCnt(cnt: int) {
		if (cnt >= restrictBuynumber) {
			owned.txt = String.Format("{0}: <color=red>{1}/{2}</color>", Datas.getArString("Common.Limit"), cnt, restrictBuynumber);
			SetRestrictBuyCount(false);
		}
		else {
			owned.txt = String.Format("{0}: {1}/{2}", Datas.getArString("Common.Limit"), cnt, restrictBuynumber);
			SetRestrictBuyCount(true);
		}
	}

	private function buyInventory(): void {
		if (!isRestrictBuy) return;
		var myItems: MyItems = MyItems.singleton;
		var price: int = 0;
		if (saleComponent.isCutSale) {
			price = _Global.INT32(m_data["salePrice"]);
		}
		else {
			price = _Global.INT32(m_data["price"]);
		}

		var mayDropGear: boolean = _Global.GetBoolean(m_data["tMayDropGear"]);

		/*是否可以批量购买*/
		if (myItems.IsCanBatchBuy(ID)) {
			var menuMgr: MenuMgr = MenuMgr.getInstance();
			var useParam: BatchUseAndBuyDialog.BatchBuyAndUseParam = new BatchUseAndBuyDialog.BatchBuyAndUseParam();
			useParam.itemId = ID;
			useParam.isBuy = true;
			useParam.price = price;
			useParam.mayGropGear = mayDropGear;
			menuMgr.PushMenu("BatchUseAndBuyDialog", useParam, "trans_zoomComp");
			return;
		}


		Shop.instance().BuyInventory(ID, price, 1, mayDropGear);/*购买调用的接口*/
	}


	public function SetRowData(data: Object) {
		m_data = data;
		SetID(m_data["ID"]);

		var mistExpedtionMenu: MistExpeditionMenu = MenuMgr.getInstance().getMenu("MistExpeditionMenu") as MistExpeditionMenu;
		var mistExpeditionMenuShop: MistExpeditionMenuShop = mistExpedtionMenu.mistExpeditionMenuShop;

		isDescShow = mistExpeditionMenuShop.GetSelectedId(ID);
		if (isDescShow) {
			combination.resetEffectState(EffectConstant.EffectState.END_STATE);
		}
		else {
			combination.resetEffectState(EffectConstant.EffectState.START_STATE);
		}

		btnSelect.OnClick = buyInventory;
		if (!MyItems.instance().IsCanBatchBuy(this.ID))
			btnSelect.txt = Datas.getArString("Common.Buy");
		else
			btnSelect.txt = Datas.getArString("BatchPurchase.Purchasebutton");

		if (m_data["price"] != null) {
			SetOwnedCnt(MyItems.instance().countForItem(ID));
		}
		else {
			SetOwnedCnt(m_data["Count"]);
		}

		var texMgr: TextureMgr = TextureMgr.instance();
		var category: MyItems.Category = _Global.INT32(m_data["Category"]);
		if (category == MyItems.Category.MystryChest) {
			description.txt = MystryChest.instance().GetChestDesc(ID);
			frame.SetVisible(true);
			frame.mystyle.normal.background = texMgr.LoadTexture("chestFrame", TextureType.DECORATION);
		}
		else {
			frame.SetVisible(false);
			description.txt = Datas.getArString("itemDesc." + "i" + ID);
		}

		if (category == MyItems.Category.MystryChest)
			title.txt = MystryChest.instance().GetChestName(ID);
		else
			title.txt = Datas.getArString("itemName." + "i" + ID);

		title.SetFont();
	}

}