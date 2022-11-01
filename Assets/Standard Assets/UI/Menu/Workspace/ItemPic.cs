using UnityEngine;

public class ItemPic : UIObject
{
	public Label[] elements;
	
	private int itemId;
	private InventoryInfo gearItemInfo = null;
	
	protected MyItemLayout layout;
	
	public static int ELSE_ICON = 1;
	public static int GEM_ICON = 2; 
	public static int GEAR = 3;

	public override void Init()
	{ 
		gearItemInfo = null;
		
		Label label;
		for(int a = 0; a < elements.Length; a ++)
		{
			label = elements[a];
			if(label == null) continue;
			label.Init();
		}	
	}
	
	public override int Draw()
	{
		GUI.BeginGroup(rect);	
		Label label;
		for(int a = 0; a < elements.Length; a ++)
		{
			label = elements[a];
			if(label == null) continue;
			label.Draw();
		}		
		GUI.EndGroup();
		return 0;
	}
	
	private void setType()
	{ 
		if (null != gearItemInfo && gearItemInfo.category == (int)KBN.MyItems.Category.GearItem)
		{ 
			layout = new MyGearItemLayout();
			layout.init(elements, itemId, rect);
		}
		else if(itemId >= 42000 && itemId <= 42399)
		{
			layout = new GemItemLayout();
			layout.init(elements, itemId, rect);
		}
		else if(itemId == -1)
		{
			layout = new GearBlankLayout();
			layout.init(elements, itemId, rect);
		}
		else
		{
			layout = new MyItemLayout();
			layout.init(elements, itemId, rect);			
		}		
	}
	
	public override void SetVisible(bool enable)
	{
		Label label;
		if(enable)
		{
			if(layout != null)
			{
				layout.reset();
			}
		}
		else
		{			
			for(int a = 0; a < elements.Length; a ++)
			{
				label = elements[a];
				if(label == null) continue;
				label.SetVisible(false);
			}
		}
	}
	
	public void SetId(int _itemId)
	{
		itemId = _itemId;		
		setType();
	} 
	
	public void SetItemInventoryInfo(InventoryInfo _item)
	{ 
		gearItemInfo = _item;
		itemId = _item.id;
		
		setType();
	}
	
	public void SetSize(Rect _rect)
	{
		rect = _rect;
	
		if(layout != null)
		{
			layout.setSize(rect);
		}
	}
}

public class MyItemLayout
{
	protected int visibleElementsNum;
	protected Label[] elements;
	protected int id;
	
	protected Rect standardRect;
	
	public MyItemLayout()
	{
		visibleElementsNum = 1;
	}
	
	public void init(Label[] _elements, int _id, Rect _rect)
	{
		elements = _elements;
		id = _id;
		standardRect = _rect;
	
		reset();
		setData();
	}
	
	public void reset()
	{
		Label obj;
		for(int a = 0; a < elements.Length; a++)
		{
			obj = elements[a];
			if(obj == null) continue;
			if(a >= visibleElementsNum)
			{
				obj.SetVisible(false);
			}
			else
			{
				obj.SetVisible(true);
			}
		}		
	}
	
	
	public virtual void setData()
	{
		if(elements == null || elements.Length <= 0) return;
		Label obj = elements[0];
		
		var iconName = TextureMgr.instance().LoadTileNameOfItem(id);
		obj.useTile = true;
		obj.tile = TextureMgr.instance().ElseIconSpt().GetTile(iconName);
		//obj.tile.name = TextureMgr.instance().LoadTileNameOfItem(id);
		obj.rect = new Rect(0, 0, standardRect.width, standardRect.height);
	}

	public virtual void setSize(Rect _rect)
	{	
		standardRect = _rect;
		if(elements != null && elements.Length > 0)
		{
			Label obj = elements[0];
			obj.rect = new Rect(0, 0, standardRect.width, standardRect.height);		
		}
	}
}

class GemItemLayout : MyItemLayout
{	
	private int level;
	private int type;

	public GemItemLayout()
	{
		visibleElementsNum = 3;
	}
	
	public override void setData()
	{
		string idStr = id.ToString();
		idStr = idStr.Substring(3, 1) == "0" ? idStr.Substring(4, 1) : idStr.Substring(3, 2);
		level = KBN._Global.INT32(idStr);
		type  = id / 100 * 100;
		
		if(elements == null) return;
		if(elements.Length < 1) return;
		Label obj = elements[0];
		if(obj != null)
		{
			obj.useTile = true;
			obj.tile = TextureMgr.instance().ElseIconSpt().GetTile(null);
			//obj.tile.name = "gem_frame";
			obj.rect = new Rect(0, 0, standardRect.width, standardRect.height);
			obj.SetVisible(false);
		}
		if(elements.Length < 2) return;
		var obj1 = elements[1];
		if(obj1 != null)
		{
			obj1.useTile = true;
			obj1.tile = TextureMgr.instance().ElseIconSpt().GetTile(setName());
			obj1.rect = setSize();
			//obj1.tile.name = setName();		
		}
		if(elements.Length < 3) return;
		var obj2 = elements[2];
		if(obj2 != null)
		{
			obj2.useTile = true;
			obj2.tile = TextureMgr.instance().ElseIconSpt().GetTile(setNumberName());				
			//obj2.tile.name = setNumberName();		
			obj2.rect = setNumberSize();
		}
	}
	
	public override void setSize(Rect _rect)
	{
		standardRect = _rect;
		if(elements != null && elements.Length > 1)
		{
			Label obj = elements[0];
			if(obj != null)
				obj.rect = new Rect(0, 0, standardRect.width, standardRect.height);
			
			var obj1 = elements[1];
			if(obj1 != null)
				obj1.rect = setSize();
		}
	}

	// 三角形宝石  宝石扩大1.2倍 中间宝石等级不变
	private float gemsScale = 1.2f;
	private float gemsScale1 = 1.1f;
	private Rect setSize()
	{
		/*		
		string idStr = id + "";
		idStr = idStr.Substring(3, 1) == "0" ? idStr.Substring(4, 1) : idStr.Substring(3, 2);
		int subId = _Global.INT32(idStr) % 3;
		*/
		
		Rect size;
/*		switch(level)
		{
			case 0:
				size = new Rect(standardRect.width * 0.3, standardRect.height * 0.3, standardRect.width * 0.4, standardRect.height * 0.4);
				break;
			case 1:
				size = new Rect(standardRect.width * 0.225, standardRect.height * 0.225, standardRect.width * 0.55, standardRect.height * 0.55);
				break;
			case 2:
				size = new Rect(standardRect.width * 0.15, standardRect.height * 0.15, standardRect.width * 0.70, standardRect.height * 0.70);
				break;
		}
*/
		if(level >= 0 && level < 10)
		{
			size = new Rect(-standardRect.width * (gemsScale - 1) * 0.5f, -standardRect.height * (gemsScale - 1) * 0.5f, standardRect.width * gemsScale, standardRect.height * gemsScale);	
		}
		else if(level >= 10 && level < 20)
		{
			size = new Rect(-standardRect.width * (gemsScale1 - 1) * 0.5f, -standardRect.height * (gemsScale1 - 1) * 0.5f, standardRect.width * gemsScale1, standardRect.height * gemsScale1);	
		}
		else
		{
			size = new Rect(0, 0, standardRect.width, standardRect.height);			
		}
		return size;
	}
	private Rect setNumberSize()
	{
		return new Rect(standardRect.width * 0.29f, standardRect.height * 0.39f, standardRect.width * 0.40f, standardRect.height * 0.22f);
		//return new Rect(standardRect.width * 0.29f, standardRect.height * 0.39f, 74f * 0.6f / 110f, 41f * 0.6f / 110f);
	}
	
	private string setName()
	{
		/*
		string fileName;
		string idStr = id + "";
		idStr = idStr.Substring(3, 1) == "0" ? idStr.Substring(4, 1) : idStr.Substring(3, 2);
		int subId = _Global.INT32(idStr) / 3;
		*/
	
		string fileName = "g" + type + "_" + getTypeLevel();
		
		return fileName;
	}

	private int getNameLevel()
	{
		int nameLevel = level % Constant.GEM_LEVEL;
		return nameLevel;
	}

	private int getTypeLevel()
	{
		int typeLevel = (level / Constant.GEM_LEVEL) + 1;
		return typeLevel;
	}
	
	private string setNumberName()
	{
		//temperory method
		string fileName = "gearstone_" + (getNameLevel() + 1);
		return fileName;
		
	}
}

class MyGearItemLayout : MyItemLayout
{
	public MyGearItemLayout()
	{
		visibleElementsNum = 1;
	}
	
	public override void setData()
	{
		if(elements == null || elements.Length <= 0) return;
		Label obj = elements[0];
		
		// obj.useTile = true;
		// obj.tile.spt = TextureMgr.instance().ElseIconSpt();
		// obj.tile.name = TextureMgr.instance().LoadTileNameOfItem(id); 
		GearSysHelpUtils.SetEquipItemIcon(obj, base.id);
		
		obj.rect = new Rect(0, 0, standardRect.width, standardRect.height);
	}
}

class GearBlankLayout : MyItemLayout
{
	public GearBlankLayout()
	{
		visibleElementsNum = 1;
	}
	
	public override void setData()
	{
		if(elements == null || elements.Length <= 0) return;
		Label obj = elements[0];
		obj.useTile = false;
		// obj.tile.spt = TextureMgr.instance().ElseIconSpt();
		// obj.tile.name = TextureMgr.instance().LoadTileNameOfItem(id); 
		//obj = GearManager.Instance().SetImage(obj,"Equipment_bg");
		obj.mystyle.normal.background = TextureMgr.instance().LoadTexture("Equipment_bg",TextureType.BUTTON);
		obj.rect = new Rect(0, 0, standardRect.width, standardRect.height);
		
	}
}
