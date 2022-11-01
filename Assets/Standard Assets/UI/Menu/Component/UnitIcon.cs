
using UnityEngine;

public class UnitIcon : UIObject
{
	public StarRating level;
	public Label l_type;
	public Label l_ribbon;
	public Label icon;
	public Label l_lock;
	[SerializeField]
	private bool m_useHighResolution;

	public override void Init()
	{
		TextureMgr texMgr = TextureMgr.instance();
		TileSprite iconSpt = texMgr.IconSpt();
		if(icon != null)
		{
			icon.useTile = true;
			icon.tile = iconSpt.GetTile(null);
		}
		if(l_lock != null)
		{
			l_lock.useTile = true;
			l_lock.tile = iconSpt.GetTile(null);
		}
		if(l_type != null)
		{
			l_type.useTile = true;
			l_type.tile = iconSpt.GetTile(null);
		}
		if(l_ribbon != null)
		{
			l_ribbon.useTile = true;
			l_ribbon.tile = iconSpt.GetTile("level_system_bg");
    	}
		if(level != null)
		{
			level.Text = "";
			level.image = texMgr.LoadTexture("icon_quest_recommend", TextureType.ICON);
		}
	}

	public override int Draw()
	{
		GUI.BeginGroup(rect);
		if(icon != null)
			icon.Draw();
		if(l_lock != null)
			l_lock.Draw();
		if(l_ribbon != null)
			l_ribbon.Draw();
		if(l_type != null)
			l_type.Draw();
		if(level != null)
			level.Draw();
		GUI.EndGroup();
		return 0;
	}
	
	public bool DrawTileByGraphics
	{
		set
		{
			if(icon != null)
				icon.drawTileByGraphics = value;
			if(l_lock != null)
				l_lock.drawTileByGraphics = value;
			if(l_ribbon != null)
				l_ribbon.drawTileByGraphics = value;
			if(l_type != null)
				l_type.drawTileByGraphics = value;
			if(level != null)
				level.drawTileByGraphics = value;
		}
	}

	public bool UnitLock
	{
		set
		{
			if(l_lock == null)
			{
				return;
			}

			if(value)
			{
				l_lock.tile = TextureMgr.instance().IconSpt().GetTile("icon_lock2");//setBackground("icon_lock2", TextureType.ICON);
			}
			else
			{
				l_lock.tile = TextureMgr.instance().IconSpt().GetTile(null);
			}
		}
	}
	
	public int UnitId
	{
		set
		{
			if ( icon == null )
				return;

			if ( m_useHighResolution )
			{
				string iconPathH = string.Format("ui_{0}_H", value.ToString());
				TextureMgr texMgr = TextureMgr.instance();
				TileSprite spt = texMgr.IconSpt();
				Tile tile = spt.FindTile(iconPathH);
				if ( tile != null )
				{
					icon.tile = tile;
					return;
				}
			}

			string iconPath = string.Format("ui_{0}", value.ToString());
			icon.tile.name = iconPath;
		}
	}

	public int UnitType
	{
		set
		{
			if(l_type != null)
				l_type.TileName = "troop_type"+ value;
		}
	}
	
	public int UnitLevel
	{
		set
		{
			int rate = value;
			if(level != null )
			{
				level.Rate = value;
				if ( !m_useHighResolution )
					level.Region = new Rect((70 - level.starWidth*rate)/2, level.Region.y, level.Region.width, level.Region.height);
			}
		}
	}
	
	public override void OnPopOver() 
	{
		if(level != null)
			this.level.OnPopOver();
		if(l_type != null)
			this.l_type.OnPopOver();
		if(l_ribbon != null)
			this.l_ribbon.OnPopOver();
		if(l_lock != null)
			this.l_lock.OnPopOver();
		if(icon != null)
			this.icon.OnPopOver();
		UIObject.TryDestroy(this);
	}
	
}

