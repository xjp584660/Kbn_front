using UnityEngine;
using System;
using System.Collections;
using KBN;

[Serializable]
public class ItemPreviewTips : BubbleFrame 
{
	[SerializeField] private SimpleLabel lblItemIcon;
	[SerializeField] private SimpleLabel lblItemName;
	[SerializeField] private SimpleLabel lblItemdesc;
	
	public void SetItemData(int itemId)
	{
		lblItemIcon.useTile = true;
		lblItemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		lblItemIcon.tile.name = TextureMgr.instance().LoadTileNameOfItem(itemId);
		lblItemName.txt = MyItems.GetItemName (itemId);
		lblItemdesc.txt = MyItems.GetItemDesc (itemId);
	}
	
	protected override void DrawItem ()
	{
		base.DrawItem ();
		
		lblItemIcon.Draw();
		lblItemName.Draw ();
		lblItemdesc.Draw ();
	}
}
