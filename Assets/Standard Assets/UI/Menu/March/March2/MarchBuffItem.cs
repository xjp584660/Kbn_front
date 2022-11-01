using UnityEngine;
using System.Collections;
using KBN;

public class MarchBuffItem : UIObject {

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

	public int ItemId { get; private set; }
	public bool Selected {
		get 
		{
			if(ItemId == 0)
			{
				return toggle.selected;
			}
			else
			{
				return itemCount > 0 ? toggle.selected : false;
			}
		}
		set
		{
			toggle.selected = value;
		}
	}

	private long itemCount = 0;

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
		toggle.Parent = this;
	}

	public override int Draw ()
	{
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
	}

	public void setItemId(int itemId)
	{
		ItemId = itemId;
		itemCount = MyItems.singleton.countForItem(itemId);

		lbDesc.txt = Datas.getArString("itemDesc.i" + itemId);
		lbOwned.txt = Datas.getArString("Common.Owned") + ": " + itemCount;

		if (itemCount <= 0) {
			toggle.selected = false;
		}
		toggle.SetDisabled(itemCount <= 0);
		lbIcon.tile = GetBuffTileByItemId(itemId);
	}



	public void SetToggleCallback(System.Action<ToggleButton, bool> callback)
	{
		toggle.valueChangedFunc2 = callback;
	}

	public static Tile GetBuffTileByItemId(int itemId)
	{
		switch (itemId) {
		case 3290:
			return TextureMgr.singleton.ElseIconSpt().GetTile("buff_icon_once_attack");
			break;
		case 3291:
			return TextureMgr.singleton.ElseIconSpt().GetTile("buff_icon_once_life");
			break;
		case 3292:
			return TextureMgr.singleton.ElseIconSpt().GetTile("buff_icon_once_speed");
			break;
		case 3295:
			return TextureMgr.singleton.ElseIconSpt().GetTile("buff_icon_once_attack2");
			break;
		case 3296:
			return TextureMgr.singleton.ElseIconSpt().GetTile("buff_icon_once_life2");
			break;
		case 3297:
			return TextureMgr.singleton.ElseIconSpt().GetTile("buff_icon_once_attack3");
			break;
		case 3299:
			return TextureMgr.singleton.ElseIconSpt().GetTile("buff_icon_collectResource");
			break;
		}
		
		return null;
	}
}
