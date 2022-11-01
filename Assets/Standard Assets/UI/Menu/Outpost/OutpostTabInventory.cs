using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

using Datas = KBN.Datas;
using GameMain = KBN.GameMain;
using ScrollList = KBN.ScrollList;

public class OutpostTabInventory : TabContentUIObject {

    [SerializeField]
    private OutpostStatusLabel lbTime;

	[SerializeField]
	private SimpleLabel lbFrame;

	[SerializeField]
	private SimpleLabel lbDesc;

    [SerializeField]
    private SimpleLabel empty;

	[SerializeField]
	private ScrollList scrollList;

	[SerializeField]
	private ListItem listItem;

	[SerializeField]
	private Button btnInventory;

    private IList<int> selectedInventoryItem;
    private IList<AvaItem> inventoryItems;

	public override void Init ()
	{
		base.Init ();

        lbTime.Init();

		lbFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);

        lbDesc.txt = Datas.getArString("AVA.Outpost_item_allianceshopdesc");

        empty.txt = Datas.getArString("Common.NoItem");

		scrollList.Init(listItem);
        selectedInventoryItem = new List<int>();

		btnInventory.txt = Datas.getArString("Allianceshop.allianceshoptitle");
		btnInventory.OnClick = new Action(OnInventoryClick);
		btnInventory.changeToBlueNew ();
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);

        lbTime.Draw();

		lbFrame.Draw();
		lbDesc.Draw();
		btnInventory.Draw();

		scrollList.Draw();
        if (scrollList.GetDataLength() <= 0)
        {
            empty.Draw();
        }

		GUI.EndGroup();
		
		return -1;
	}

	public override void Update ()
	{
		base.Update ();

        lbTime.Update();
		scrollList.Update();
	}

	public override void OnPopOver ()
	{
        scrollList.Clear();
        selectedInventoryItem.Clear();

        KBN.Game.Event.UnregisterHandler(KBN.EventId.AvaUseItem, OnAvaUseItem);
		KBN.Game.Event.UnregisterHandler(KBN.EventId.AvaBuyItem, OnAvaBuyItem);

        base.OnPopOver();
	}

	public override void OnPush(object param)
	{
		base.OnPush (param);

        KBN.Game.Event.RegisterHandler(KBN.EventId.AvaUseItem, OnAvaUseItem);
		KBN.Game.Event.RegisterHandler(KBN.EventId.AvaBuyItem, OnAvaBuyItem);

        inventoryItems = GameMain.Ava.Inventory.GetInventoryItems();
		scrollList.Clear();
        scrollList.SetData(inventoryItems);
        scrollList.ResetPos();
	}

    public bool IsSelected(int itemType)
    {
        return selectedInventoryItem.Contains(itemType);
    }
    
    public void Select(int itemType)
    {
        if (!selectedInventoryItem.Contains(itemType))
        {
            selectedInventoryItem.Add(itemType);
        }
    }
    
    public void Unselect(int itemType)
    {
        if (selectedInventoryItem.Contains(itemType))
        {
            selectedInventoryItem.Remove(itemType);
        }
    }
    
    public void UseItem(int itemType)
    {
        GameMain.Ava.Inventory.UseItem(itemType);
    }

    private void OnAvaUseItem(object sender, GameFramework.GameEventArgs e)
    {
        KBN.AvaUseItemEventArgs ne = e as KBN.AvaUseItemEventArgs;
        if (ne == null)
        {
            return;
        }

        AvaItem avaItem = KBN.GameMain.Ava.Inventory.GetItem(ne.ItemId);
        if (avaItem == null)
        {
            return;
        }

        if (avaItem.Quantity <= 0)
        {
            inventoryItems.Remove(avaItem);
        }

        scrollList.UpdateData();
    }

	private void OnInventoryClick()
	{
		KBN.MenuMgr.instance.PushMenu("AvaShopMenu", null, "trans_horiz");
	}

	private void OnAvaBuyItem(object sender, GameFramework.GameEventArgs e)
	{
		inventoryItems = GameMain.Ava.Inventory.GetInventoryItems();
		scrollList.Clear();
		scrollList.SetData(inventoryItems);
		scrollList.ResetPos();
	}
}
