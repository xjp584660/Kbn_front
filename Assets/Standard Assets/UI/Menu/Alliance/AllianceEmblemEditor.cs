using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

using Datas = KBN.Datas;
using ScrollList = KBN.ScrollList;
using Alliance = KBN.Alliance;
using MyItems = KBN.MyItems;
using _Global = KBN._Global;
using Shop = KBN.Shop;

public class AllianceEmblemEditor : PopMenu, IEventHandler {

	[SerializeField]
	private SimpleLabel lblTitleUnderline;
	[SerializeField]
	private SimpleLabel lblEmblemFrame;
	[SerializeField]
	private SimpleLabel lblDescription;
	[SerializeField]
	private SimpleLabel lblBannerColor;
	[SerializeField]
	private SimpleLabel lblSaperator;
	
	[SerializeField]
	private SimpleLabel lblStyleBg;
	[SerializeField]
	private SimpleLabel lblStyleTitle;
	[SerializeField]
	private SimpleLabel lblStyleTitleBg;

	[SerializeField]
	private SimpleLabel lblSymbolBg;
	[SerializeField]
	private SimpleLabel lblSymbolTitle;
	[SerializeField]
	private SimpleLabel lblSymbolTitleBg;

	[SerializeField]
	private SimpleButton btnStyleColor;
	[SerializeField]
	private SimpleButton btnSymbolColor;
	[SerializeField]
	private SimpleLabel lblStyleColorCorner;
	[SerializeField]
	private SimpleLabel lblSymbolColorCorner;
	[SerializeField]
	private SimpleButton btnSave;
	[SerializeField]
	private SimpleLabel lblNoPermission;

	[SerializeField]
	private AllianceEmblemColorSelector colorSelector;

	[SerializeField]
	private AllianceBubbleTips lockedTips;

	[SerializeField]
	private AllianceEmblem emblem;

	[SerializeField]
	private AllianceEmblemListItem bannerListItem;
	[SerializeField]
	private AllianceEmblemListItem graphListItem;

	[SerializeField]
	private ScrollList bannerList;
	[SerializeField]
	private ScrollList styleList;
	[SerializeField]
	private ScrollList symbolList;

	[SerializeField]
	private SaleComponent moneyTemplate;
	private SaleComponent money;
	[SerializeField]
	private Vector2 moneyPositionSale;
	[SerializeField]
	private Vector2 moneyPositionNoSale;

	[SerializeField]
	private SimpleLabel itemCount;

	private AllianceEmblemData data;
	private Color styleColor;
	private Color symbolColor;

	private List<AllianceEmblemItemData> styleColors;
	private List<AllianceEmblemItemData> symbolColors;

	private static bool HasEditPermission
	{
		get {
			return AllianceRights.IsHaveRights(Alliance.singleton.myAlliance.userOfficerType, AllianceRights.RightsType.EditAllianceEmblem);
		}
	}

	public override void Init ()
	{
		base.Init ();

		title.txt = Datas.getArString("AllianceEmblem.EditorTitle");

		lblTitleUnderline.Init();
		lblTitleUnderline.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line", TextureType.DECORATION);
		lblEmblemFrame.Init();
		lblEmblemFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Quest_kuang", TextureType.DECORATION);
		lblDescription.Init();
		lblDescription.txt = Datas.getArString("AllianceEmblem.EmblemDesc");
		lblBannerColor.Init();
		lblBannerColor.txt = Datas.getArString("AllianceEmblem.BannerColor");
		lblSaperator.Init();
		lblSaperator.mystyle.normal.background = TextureMgr.singleton.LoadTexture("mail_Split-line", TextureType.DECORATION);
		
		lblStyleBg.Init();
		lblStyleBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_black2", TextureType.DECORATION);
		lblStyleTitle.Init();
		lblStyleTitle.txt = Datas.getArString("AllianceEmblem.EmblemStyle");
		lblStyleTitleBg.Init();
		lblStyleTitleBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_black2", TextureType.DECORATION);
		
		lblSymbolBg.Init();
		lblSymbolBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_black2", TextureType.DECORATION);
		lblSymbolTitle.Init();
		lblSymbolTitle.txt = Datas.getArString("AllianceEmblem.EmblemSymbol");
		lblSymbolTitleBg.Init();
		lblSymbolTitleBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_black2", TextureType.DECORATION);

		btnStyleColor.Init();
		btnStyleColor.mystyle.normal.background = TextureMgr.singleton.WhiteTex();
		btnStyleColor.OnClick = new Action(OnStyleColorButton);

		btnSymbolColor.Init();
		btnSymbolColor.mystyle.normal.background = TextureMgr.singleton.WhiteTex();
		btnSymbolColor.OnClick = new Action(OnSymbolColorButton);

		lblStyleColorCorner.Init();
		lblStyleColorCorner.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Triangle", TextureType.DECORATION);
		lblSymbolColorCorner.Init();
		lblSymbolColorCorner.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Triangle", TextureType.DECORATION);

		btnSave.Init();
		btnSave.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_60_green_normalnew", TextureType.BUTTON);
		btnSave.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_60_green_downnew", TextureType.BUTTON);
		btnSave.OnClick = new Action(OnSaveButton);

		lblNoPermission.Init();
		lblNoPermission.txt = Datas.getArString("AllianceEmblem.Tips_1");

		colorSelector.Sys_Constructor();
		lockedTips.Sys_Constructor();

		bannerList.Init(bannerListItem);
		styleList.Init(graphListItem);
		symbolList.Init(graphListItem);

		bannerList.itemDelegate = this;
		styleList.itemDelegate = this;
		symbolList.itemDelegate = this;

		money = GameObject.Instantiate(moneyTemplate) as SaleComponent;
		money.Init();

		itemCount.Init();
	}

	private void InitData(HashObject lockStatus) {

		data = new AllianceEmblemData(AllianceEmblemMgr.instance.playerAllianceEmblem);
		
		List<AllianceEmblemItemData> bannerdata = AllianceEmblemMgr.GetBannerColors(lockStatus);
		
		List<AllianceEmblemItemData> styledata = AllianceEmblemMgr.GetStyles(lockStatus);
		
		List<AllianceEmblemItemData> symboldata = AllianceEmblemMgr.GetSymbols(lockStatus);

		styleColors = AllianceEmblemMgr.GetStyleColors(lockStatus);

		symbolColors = AllianceEmblemMgr.GetSymbolColors(lockStatus);

		bannerList.Clear();
		bannerList.SetData(bannerdata);
		
		styleList.Clear();
		styleList.SetData(styledata);
		
		symbolList.Clear();
		symbolList.SetData(symboldata);
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);

		InitData(param as HashObject);

		UpdateEmblem();
	}

	private void UpdateEmblem() {
		emblem.Data = data;
		
		styleColor = AllianceEmblemMgr.GetColor(data.styleColor);
		symbolColor = AllianceEmblemMgr.GetColor(data.symbolColor);
		HighlightBanner(data.banner);
		HighlightStyle(data.style);
		HighlightSymbol(data.symbol);

		btnSave.SetVisible(HasEditPermission);
		money.SetVisible(HasEditPermission);
		itemCount.SetVisible(HasEditPermission);
		lblNoPermission.SetVisible(!HasEditPermission);

		if (!HasEditPermission)
			return;

		long count = MyItems.singleton.countForItem(2421);
		itemCount.txt = Datas.getArString("itemName.i2421") + "   " + Datas.getArString("Common.Owned") + ": " + count;
		itemCount.SetVisible(count > 0);
		money.SetVisible(count == 0);

		bool emblemChanged = !data.Equals(AllianceEmblemMgr.instance.playerAllianceEmblem);

		if (count > 0) {
			btnSave.txt = Datas.getArString("Common.Use_button");
			btnSave.EnableBlueButton(emblemChanged);
		} else {
			btnSave.txt = Datas.getArString("Common.BuyAndUse_button");
			btnSave.EnableGreenButton(emblemChanged);

			HashObject obj = (Datas.singleton.itemlist())["i" + 2421];
			int category = _Global.INT32(obj["category"]);
			Hashtable item = Shop.singleton.getItem(category, 2421);

			money.setData(
				_Global.INT32(item["price"]),
				_Global.INT32(item["salePrice"]),
				_Global.INT64(item["startTime"]),
				_Global.INT64(item["endTime"]),
				_Global.INT32(item["isShow"]),
				false);

			money.SetVisible(true);
		}
	}

	public override int Draw ()
	{

		if ((!colorSelector.isVisible() && !lockedTips.isVisible()) || Event.current.type == EventType.Repaint) {
			base.Draw ();
		}

		if (visible) {
			colorSelector.Draw();
			lockedTips.Draw();
		}

		return 0;
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();

		title.Draw();

		lblTitleUnderline.Draw();
		lblEmblemFrame.Draw();
		lblDescription.Draw();
		lblBannerColor.Draw();
		lblSaperator.Draw();

		emblem.Draw();

		bannerList.Draw();

		lblStyleBg.Draw();
		lblStyleTitleBg.Draw();
		lblStyleTitle.Draw();

		Color oldColor = GUI.color;
		GUI.color = styleColor;
		btnStyleColor.Draw();
		GUI.color = oldColor;

		lblStyleColorCorner.Draw();

		styleList.Draw();

		lblSymbolBg.Draw();
		lblSymbolTitleBg.Draw();
		lblSymbolTitle.Draw();

		GUI.color = symbolColor;
		btnSymbolColor.Draw();
		GUI.color = oldColor;

		lblSymbolColorCorner.Draw();

		symbolList.Draw();

		itemCount.Draw();
		money.Draw();
		btnSave.Draw();
		lblNoPermission.Draw();
	}

	public override void Update ()
	{
		base.Update ();

		if ((!colorSelector.isVisible() && !lockedTips.isVisible()))
		{
			bannerList.Update();
			styleList.Update();
			symbolList.Update();
		}

		money.Update();
		if (money.isShowSale)
		{
			money.rect.x = moneyPositionSale.x;
			money.rect.y = moneyPositionSale.y;
		}
		else
		{
			money.rect.x = moneyPositionNoSale.x;
			money.rect.y = moneyPositionNoSale.y;
		}
	}

	public override void OnPopOver ()
	{
		bannerList.Clear();
		styleList.Clear();
		symbolList.Clear();

		Destroy(money);
		money = null;
	}

	public void handleItemAction (string action, object param)
	{
		AllianceEmblemListItem item = param as AllianceEmblemListItem;
		if (null == item)
			return;

		if (action == "OnClick") {
			ScrollList list = bannerList;
			switch (item.Data.type) {
			case AllianceEmblemItemType.BannerColor:
				data.banner = item.Data.color; break;
			case AllianceEmblemItemType.Style:
				data.style = item.Data.tile; break;
			case AllianceEmblemItemType.Symbol:
				data.symbol = item.Data.tile; break;
			}
			
			UpdateEmblem();
		} else if (action == "OnUpdateData") {

			switch (item.Data.type) {
			case AllianceEmblemItemType.BannerColor:
				item.Highlighted = (item.Data.color == data.banner); break;
			case AllianceEmblemItemType.Style:
				item.Highlighted = (item.Data.tile == data.style); break;
			case AllianceEmblemItemType.Symbol:
				item.Highlighted = (item.Data.tile == data.symbol); break;
			}

		} else if (action == "OnTips") {
			ShowTips(item);
		}
	}

	private void HighlightBanner(string color) {
		bannerList.ForEachItem(delegate (ListItem it) {
			AllianceEmblemListItem item = it as AllianceEmblemListItem;
			if (null != item && item.Data.type == AllianceEmblemItemType.BannerColor)
				item.Highlighted = (item.Data.color == color);
			return true;
		});
	}
	
	private void HighlightStyle(int idx) {
		styleList.ForEachItem(delegate (ListItem it) {
			AllianceEmblemListItem item = it as AllianceEmblemListItem;
			if (null != item && item.Data.type == AllianceEmblemItemType.Style)
				item.Highlighted = (item.Data.tile == idx);
			return true;
		});
	}
	
	private void HighlightSymbol(int idx) {
		symbolList.ForEachItem(delegate (ListItem it) {
			AllianceEmblemListItem item = it as AllianceEmblemListItem;
			if (null != item && item.Data.type == AllianceEmblemItemType.Symbol)
				item.Highlighted = (item.Data.tile == idx);
			return true;
		});
	}

	private void ShowTips(AllianceEmblemListItem item) {
		ScrollList list = null;
		int itemId = 0;
		switch (item.Data.type) {
		case AllianceEmblemItemType.BannerColor:
			list = bannerList; break;
		case AllianceEmblemItemType.Style:
			list = styleList; itemId = 6200 + item.Data.tile; break;
		case AllianceEmblemItemType.Symbol:
			list = symbolList; itemId = 6400 + item.Data.tile; break;
		default:
			return;
		}

		if (0 == itemId) return;

		Rect r = item.Region;
		r.x += list.rect.x - list.getScrollViewVector().x;
		r.y += list.rect.y;
		r.x = Mathf.Clamp(r.x, list.rect.x - r.width * 0.4f, list.rect.xMax - r.width * 0.6f);

		try {
			lockedTips.Text = string.Format(Datas.getArString("AllianceEmblem.UnlockTips"), Datas.getArString("itemName.i" + itemId));
		} catch(System.Exception) {
			lockedTips.Text = Datas.getArString("AllianceEmblem.UnlockTips");
		}

		lockedTips.rect.y = r.center.y - lockedTips.rect.height - 30;
		lockedTips.arrowRect.y = r.center.y - 16;

		lockedTips.rect.x = (640 - lockedTips.rect.width) * 0.5f;
		if (r.center.x > lockedTips.rect.xMax - 40)
			lockedTips.rect.x = r.center.x + 40 - lockedTips.rect.width;
		if (r.center.x < lockedTips.rect.x + 40)
			lockedTips.rect.x = r.center.x - 40;
		lockedTips.arrowRect.x = r.center.x - 16;
		lockedTips.SetVisible(true);
	}

	private void OnStyleColorButton() {
		colorSelector.colorList = styleColors;
		colorSelector.rect.y = btnStyleColor.rect.center.y + 30;
		colorSelector.arrowRect.y = colorSelector.rect.y - 25;
		colorSelector.OnSelected = OnStyleColorChanged;
		colorSelector.SetVisible(true);
	}

	private void OnSymbolColorButton() {
		colorSelector.colorList = symbolColors;
		colorSelector.rect.y = btnSymbolColor.rect.center.y + 30;
		colorSelector.arrowRect.y = colorSelector.rect.y - 25;
		colorSelector.OnSelected = OnSymbolColorChanged;
		colorSelector.SetVisible(true);
	}

	private void OnStyleColorChanged(string color) {
		data.styleColor = color;
		UpdateEmblem();
	}

	private void OnSymbolColorChanged(string color) {
		data.symbolColor = color;
		UpdateEmblem();
	}

	private void OnSaveButton() {
		AllianceEmblemMgr.instance.SaveAllianceEmblem(data);
		this.close();
	}
}
