using UnityEngine;
using KBN;
using System.Collections;
using System;

public class AllianceDonateItem : ListItem
{
	[SerializeField] private SimpleLabel itemIcon;
	[SerializeField] private SimpleLabel statusIcon;
	[SerializeField] private SimpleLabel itemName;
	[SerializeField] private SimpleLabel itemDesc;
	[SerializeField] private SimpleLabel itemNum;
	[SerializeField] private SimpleLabel leftUseNum;
	[SerializeField] private SimpleLabel line;
	[SerializeField] private Button useBtn;
	private AvaDonateItem dataItem;
	private Action<AvaDonateItem> clickFunc = null;

	public override void Init()
	{
		base.Init();
		statusIcon.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("icon_satisfactory", TextureType.ICON);
		line.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("between line_list_small", TextureType.DECORATION);
		useBtn.txt = Datas.getArString ("Alliance.info_dummy_entrust5stonesbtn");
		useBtn.OnClick = new System.Action(handleClick);
		itemIcon.useTile = true;
		itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
	}

	public override void OnPopOver()
	{
		base.OnPopOver();
	}

	public override int Draw()
	{
		GUI.BeginGroup(rect);
		itemIcon.Draw();
		statusIcon.Draw();
		itemName.Draw();
		itemDesc.Draw();
		itemNum.Draw();
		leftUseNum.Draw();
		line.Draw();
		useBtn.Draw();
		GUI.EndGroup();
		return -1;
	}

	public override void Update()
	{
	}

	public override void SetRowData(object data)
	{
		dataItem = data as AvaDonateItem;
		UpdateData ();
	}

	private void handleClick()
	{
		if (clickFunc != null)
			clickFunc (dataItem);
	}

	public void SetClickFunc(Action<AvaDonateItem> _clickFunc)
	{
		clickFunc = _clickFunc;
	}

	public override void UpdateData()
	{
		if (dataItem == null)
			return;
		line.SetVisible (true);
		itemIcon.useTile = true;
		itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		itemIcon.tile.name = TextureMgr.instance().LoadTileNameOfItem(dataItem.Id);
		itemName.txt = Datas.getArString ("itemName.i" + dataItem.Id);
		itemDesc.txt = Datas.getArString ("itemDesc.i" + dataItem.Id);
		long itemCount = MyItems.singleton.countForItem(dataItem.Id);
		string redColor = "<color=red>{0}</color>";
		int leftTime = dataItem.TimeLimit - GameMain.Ava.Player.DonateItemTime (dataItem.Id);
		if (leftTime < 0)
			leftTime = 0;
		if(itemCount>=dataItem.CountPerDonate)
			redColor = "{0}";
		itemNum.txt = Datas.getArString("GearReset.Owned")+string.Format (redColor, _Global.NumSimlify(itemCount));
		redColor = "<color=red>{0}</color>";
		if(leftTime>0)
			redColor = "{0}";
		leftUseNum.txt = string.Format(Datas.getArString ("Alliance.info_dummy_endowtimeslimittoday"), string.Format(redColor, leftTime));
		
		useBtn.txt = string.Format(Datas.getArString ("Alliance.info_dummy_entrust5stonesbtn"), dataItem.CountPerDonate, itemName.txt);
		bool canUse = false;
		if(itemCount>=dataItem.CountPerDonate && leftTime>0)
			canUse = true;
		if(canUse)
		{
			statusIcon.SetVisible (true);
			useBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
			useBtn.SetDisabled(false);
		}
		else
		{
			statusIcon.SetVisible (false);
			useBtn.setNorAndActBG("button_60_grey_normalnew","button_60_grey_normalnew");
			useBtn.SetDisabled(true);
		}
	}
}
