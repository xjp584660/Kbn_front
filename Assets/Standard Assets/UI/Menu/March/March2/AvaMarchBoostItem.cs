using KBN;
using KBN.DataTable;
using UnityEngine;
using System;

public class AvaMarchBoostItem : ListItem
{
	[SerializeField] private Label l_img;
	[SerializeField] private Label l_name;
	[SerializeField] private Label l_des;
	
	[SerializeField] private Label l_num;
	[SerializeField] private Button btn;
	[SerializeField] private Label divideLine;
	[SerializeField] private Label l_time;
	[SerializeField] private Label l_status;
	
	private int itemId;
	private long expireTime;
	private AvaItem avaItem;
	
	public override void Init()
	{
		base.Init();
		divideLine.setBackground("between line_list_small",TextureType.DECORATION);
		btn.OnClick = new Action<object>(handleClick);

		l_img.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		l_img.useTile = true;
		btn.txt = Datas.getArString("Common.Use_button");;
		l_status.txt = Datas.getArString("Common.InUse");
	}
	
	public override void OnPopOver()
	{
		base.OnPopOver();
	}
	
	public override int Draw()
	{
		GUI.BeginGroup(rect);
		l_img.Draw();
		l_name.Draw();
		l_des.Draw();
		
		l_num.Draw();
		btn.Draw();
		divideLine.Draw();
		l_time.Draw();
		l_status.Draw();
		GUI.EndGroup();
		return -1;
	}
	
	public override void Update()
	{
		UpdateData ();
	}
	
	public override void SetRowData(object data)
	{
		itemId = _Global.INT32 (data);
		l_img.tile.name = TextureMgr.singleton.LoadTileNameOfItem(itemId);
		l_name.txt = Datas.getArString("itemName.i" + itemId);
		l_des.txt = Datas.getArString("itemDesc.i" + itemId);
	}

	private void GetItemData()
	{
		avaItem = GameMain.Ava.Inventory.GetItem(itemId);
		if (avaItem != null)
		{
			GDS_AllianceShopItem avaShopItemGds = GameMain.GdsManager.GetGds<GDS_AllianceShopItem>();
			AllianceShopItem gdsItem = avaShopItemGds.GetItemById(itemId);
			expireTime = GameMain.PlayerBuffs.AvaSelfRunningBuffs.GetRunningBuffEndTimeBy(gdsItem.BUFF_ID, BuffSource.Item);
		}
	}

	public override void UpdateData()
	{
		GetItemData ();
		btn.SetVisible(true);
		l_time.SetVisible(false);
		l_status.SetVisible(false);

		if (avaItem != null)
		{
			int itemNum = avaItem.Quantity;
			l_num.txt = Datas.getArString("Common.Own") + ": " + itemNum;
			long curTime = GameMain.unixtime();
	
			if(curTime < expireTime)
			{
				btn.SetVisible(false);
				l_time.SetVisible(true);
				l_status.SetVisible(true);
				l_time.txt = Datas.getArString("Common.TimeRemining") + " " + _Global.timeFormatStr(expireTime - curTime);
			}
			else if (itemNum > 0 && curTime >= expireTime)
			{
				btn.changeToBlueNew ();
			}
			else
				btn.changeToGreyNew ();
		}
		else
		{
			l_num.txt = Datas.getArString("Common.Own") + ": " + 0;
			btn.changeToGreyNew ();
		}
	}
	
	private void handleClick(object clickParam)
	{
		GameMain.Ava.Inventory.UseItem (itemId);
	}
}