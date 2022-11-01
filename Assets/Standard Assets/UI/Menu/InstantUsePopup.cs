using UnityEngine;
using System;
using System.Collections;

using _Global = KBN._Global;
using Datas = KBN.Datas;
using Shop = KBN.Shop;
using MyItems = KBN.MyItems;

public class InstantUsePopup : PopMenu {
	
	[SerializeField]
	private SimpleLabel lblDesc;

	[SerializeField]
	private SimpleButton btnConfirm;

	[SerializeField]
	private SimpleLabel lblConfirm;

	private InstantUsePopupParam data = null;
	private int price = 0;

	public override void Init ()
	{
		base.Init ();

		lblDesc.Init();
		btnConfirm.Init();
		lblConfirm.Init();

		btnConfirm.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_gem_60_green_normal", TextureType.BUTTON);
		btnConfirm.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_gem_60_green_down", TextureType.BUTTON);

		lblConfirm.mystyle.normal.background = TextureMgr.singleton.LoadTexture("resource_icon_gems",TextureType.ICON);

		btnConfirm.OnClick = new Action(OnConfirmButton);
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);

		data = param as InstantUsePopupParam;

		if (null == data)
			return;

		HashObject obj = (Datas.singleton.itemlist())["i" + data.itemId];
		int category = _Global.INT32(obj["category"]);
		Hashtable item = Shop.singleton.getItem(category, data.itemId);
		price = _Global.INT32(item["price"]);

		lblDesc.txt = data.description;

		lblConfirm.txt = (price * data.count) + "   " + data.buttonText;
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();

		lblDesc.Draw();
		btnConfirm.Draw();
		lblConfirm.Draw();
	}

	private void OnConfirmButton()
	{
		Shop.singleton.BuyInventory(data.itemId, price * data.count, data.count, false, OnBuySuccess);
	}

	private void OnBuySuccess()
	{
		if (null == data.OnUseItem)
		{
			DefaultItemUsage();
		}
		else
		{
			data.OnUseItem();
		}
		close();
	}

	private void DefaultItemUsage()
	{
		MyItems.singleton.Use(data.itemId, data.count, true);
	}
}
