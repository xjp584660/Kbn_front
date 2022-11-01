using UnityEngine;
using System.Collections;

public class GearTierLevelUpBottlePanel : UIObject
{
	public Label backgroundLabel;
	public Label frame;
	public Label num;
	public ItemPic item;
	public Label level;

	public override void Init()
	{
		item.Init ();
		frame.Init ();
		backgroundLabel.Init();
		num.Init();

		frame.useTile = true;
		frame.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_heroframe1");
		backgroundLabel.mystyle.normal.background = TextureMgr.singleton.LoadTexture("map_icon_button_down",TextureType.BUTTON);
		level.Init();
		level.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Hammer_level",TextureType.DECORATION);
	}




	public override void Update()
	{
		item.Update ();
		frame.Update ();
		backgroundLabel.Update();
		num.Update();
		level.Update();
		//UpdateFontSize();
	}
	
	public override int Draw()
	{
		if (!visible)
			return 0;

		GUI.BeginGroup(rect);
		backgroundLabel.Draw();
		item.Draw ();
		frame.Draw ();
		num.Draw();
		level.Draw();
		GUI.EndGroup();
		return 1;
	}
	private void UpdateFontSize()
	{
		if(num.mystyle.fontSize != 13)
			num.mystyle.fontSize = 13;
	}


	private int id;
	public int ID
	{
		get
		{
			
            return id;
        }

		set
		{
			item.SetId(value);
			id = value;
		}
	}

	private int count;
	public int Count
	{
		get
		{
			return count;
		}
		set
		{
			count = value;
			Format();
		}
	}

	private int need;
	public int Need
	{
		get
		{
			return need;
		}
		set
		{
			need = value;
			Format();
		}
	}


	public int Level
	{
		set
		{
			level.txt = value.ToString();
		}
	}

	public bool IsValid()
	{
		return Count >= Need;
	}

	private void Format()
	{
		num.txt = Count.ToString() + " / " + Need.ToString();
	}

	public void OnSelect()
	{

	}
	public override void OnPopOver()
	{
		
	}



}
