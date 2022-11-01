using UnityEngine;
using System.Collections;
using System;
using KBN;
public class AvaSpeedUpItem : ListItem 
{
	public Label l_Line;
	public Label cntLabel;

	private InventoryInfo m_ItemData = new InventoryInfo();
	public override void Init()
	{
		icon.useTile = true;

		
		btnSelect.OnClick = new Action<object>(handleClick);
        btnSelect.txt = Datas.getArString("Common.Use_button");
	}
	
	public override int Draw()
	{
		GUI.BeginGroup(rect);
		icon.Draw();
		title.Draw();
		description.Draw();
		btnSelect.Draw();
		cntLabel.Draw();
		l_Line.Draw();
		GUI.EndGroup();
		return 1;
	}
	
	public override void Update()
	{

	}
	
	public override void SetRowData(object data)
	{
		m_ItemData = data as InventoryInfo;
		l_Line.setBackground("between line_list_small",TextureType.DECORATION);
		string iconName = TextureMgr.instance().LoadTileNameOfItem(m_ItemData.id);
		icon.tile = TextureMgr.singleton.ItemSpt().GetTile(iconName);
		title.txt = Datas.getArString("itemName."+"i" + m_ItemData.id);
		description.txt = Datas.getArString("itemDesc."+"i" + m_ItemData.id);
		cntLabel.txt = Datas.getArString("Common.Own") + ": " + m_ItemData.quant;
		if(m_ItemData.quant > 0)
		{
			btnSelect.changeToBlueNew();
		}
		else
		{
			btnSelect.changeToGreyNew();
		}

	}

	private void handleClick(object param)
	{
		if(handlerDelegate != null)
			handlerDelegate.handleItemAction(Constant.Action.USE_SPEEDUP_ITEM,m_ItemData.id);
	}
}
