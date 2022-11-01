using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class MarchSizeBuffItem : UIObject 
{
	[Space(30), Header("----------MarchSizeBuffItem----------")]


	[SerializeField]
	private SimpleLabel lbFrame;
	[SerializeField]
	private SimpleLabel lbIcon;
	[SerializeField]
	private SimpleLabel lbDesc;
	[SerializeField]
	private SimpleLabel lbOwned;
	[SerializeField]
	private ToggleButton toggle;
	
	private AddMarchSizeData.MarchBuffItemData m_data = null;
	public IEventHandler handlerDelegate;
	public override void Init ()
	{
		base.Init ();
		
		lbFrame.Init();
		lbFrame.setBackground("ui_hero_frame", TextureType.DECORATION);
		
		lbIcon.Init();
		lbIcon.useTile = true;
		lbIcon.tile = TextureMgr.singleton.ElseIconSpt().GetTile("buff_icon_once_life");
		
		lbDesc.Init();
		lbDesc.txt = string.Empty;
		
		lbOwned.Init();
		lbOwned.txt = string.Empty;
		
		toggle.Init();
		toggle.selected = false;
		toggle.valueChangedFunc = new System.Action<bool> (valueChangedFunc);
	}
	
	public override int Draw ()
	{
		if (!visible) return -1;

		base.Draw ();
		
		GUI.BeginGroup(rect);
		
		lbFrame.Draw();
		lbIcon.Draw();
		lbDesc.Draw();
		lbOwned.Draw();
		toggle.Draw();
		
		GUI.EndGroup();
		
		return -1;
	}
	
	public override void Update ()
	{
		base.Update ();
		toggle.selected = m_data.selected;
	}
	
	public void SetData(AddMarchSizeData.MarchBuffItemData _data)
	{
		m_data = _data;

		if(m_data.itemId == 0)
		{
			lbDesc.txt = Datas.getArString ("MachSizePopup.Text");
			lbDesc.rect.y = 45;
		}
		else
		{
			lbDesc.txt = Datas.getArString ("itemDesc.i" + m_data.itemId);
			lbDesc.rect.y = 25;
		}

		lbOwned.txt = Datas.getArString ("Common.Owned") + ": " + m_data.itemCount;
		lbOwned.SetVisible(m_data.itemId!=0);
		toggle.SetDisabled (m_data.itemId != 0 && m_data.itemCount <= 0);
		toggle.selected = m_data.selected;
		lbIcon.tile = GetBuffTileByItemId (m_data.itemId);
	}

	public static Tile GetBuffTileByItemId(int itemId)
	{
		switch (itemId) {
		case 3293:
			return TextureMgr.singleton.ElseIconSpt().GetTile("buff_icon_once_marchsize1");
			break;
		case 3294:
			return TextureMgr.singleton.ElseIconSpt().GetTile("buff_icon_once_marchsize2");
			break;
		}
		
		return null;
	}

	public void valueChangedFunc(bool selected)
	{
		if(selected)
		{
			AddMarchSizeData.getInstance().OnToggleBuffItem(m_data);
			if(handlerDelegate != null)
			{
				handlerDelegate.handleItemAction(Constant.Action.SELECTMARCHSIZEBUFF,m_data);
			}	
		}	
	}
}
