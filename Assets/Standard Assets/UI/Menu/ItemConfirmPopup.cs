using UnityEngine;
using System;

using MyItems = KBN.MyItems;
using Datas = KBN.Datas;

public class ItemConfirmPopup : PopMenu 
{

	[SerializeField] private SimpleLabel lblDesc;
	[SerializeField] private SimpleLabel lblItemBg;
	[SerializeField] private SimpleLabel lblItemIcon;
	[SerializeField] private SimpleLabel lblItemName;
	[SerializeField] private SimpleLabel lblItemAmount;
	[SerializeField] private SimpleLabel lblItemDesc;

	[SerializeField] private SimpleButton btnCancel;
	[SerializeField] private SimpleButton btnConfirm;

	private ItemConfirmPopupParam data;

	public override void Init ()
	{
		base.Init ();

		lblDesc.Init();
		lblItemBg.Init();
		lblItemIcon.Init();
		lblItemName.Init();
		lblItemAmount.Init();
		lblItemDesc.Init();

		btnCancel.Init();
		btnConfirm.Init();

		lblItemBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2", TextureType.DECORATION);

		btnCancel.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);
		btnCancel.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew", TextureType.BUTTON);
		btnConfirm.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);
		btnConfirm.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew", TextureType.BUTTON);

		btnCancel.txt = Datas.getArString("Common.Cancel");
		btnCancel.OnClick = new Action(OnCancel);
		btnConfirm.txt = Datas.getArString("Common.Confirm");
		btnConfirm.OnClick = new Action(OnConfirm);
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);

		data = param as ItemConfirmPopupParam;

		lblDesc.txt = data.description;
		lblItemIcon.useTile = true;
		lblItemIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile(Datas.singleton.getImageName(data.itemId));
		lblItemName.txt = Datas.getArString("itemName.i" + data.itemId);
		lblItemDesc.txt = Datas.getArString("itemDesc.i" + data.itemId);
		long amount = MyItems.singleton.countForItem(data.itemId);
		lblItemAmount.txt = Datas.getArString("Common.Owned") + ": " + amount;
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();

		lblDesc.Draw();
		lblItemBg.Draw();
		lblItemIcon.Draw();
		lblItemName.Draw();
		lblItemAmount.Draw();
		lblItemDesc.Draw();
		
		btnCancel.Draw();
		btnConfirm.Draw();
	}

	private void OnConfirm()
	{
		close();
		if (null != data.OnConfirm)
			data.OnConfirm();
	}

	private void OnCancel()
	{
		close();
		if (null != data.OnCancel)
			data.OnCancel();
	}
}
