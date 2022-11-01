
using UnityEngine;
using KBN;

public class StoneItem : ListItem , ITouchable
{
	private int id;
	private int count;
	private int level;
	private int type = -1;
	
	public ItemPic pic;
	public Label num;
	public Label back;
	public Label levelLabel;
	
	public enum ItemType
	{
		Mount,
		Scroll,
		Move
	}
	
	public class Tag
	{
		public ItemType type = ItemType.Scroll;
		public int position = -1;
		public ItemType sourceType = ItemType.Scroll;
		public StonePanel mountPanel = null;
	}
	
	
	
	public Tag tagItem = new Tag();
	
	private string backgroundName;
	private string imageName;
	private string foreNumberName;

	
	public bool CanDrawBackground
	{
		get
		{
			if(tagItem == null) return true;
			if(tagItem.type == ItemType.Scroll) return true;
			return false;
		}
	}
	
	
	public override void Init()
	{
		pic.Init();
		tagItem.type = StoneItem.ItemType.Scroll;
		if(tagItem.type == ItemType.Scroll && back != null)
		{
			back.Init(); 
			back.rect = new Rect(0,0,rect.width,rect.height);
			back.mystyle.normal.background = TextureMgr.instance().LoadTexture("Equipment_bg",TextureType.BUTTON);
		}
		if(num != null)
			num.Init();
		
		if(levelLabel != null)
		{
			levelLabel.mystyle.normal.background = TextureMgr.instance().LoadTexture("Hammer_level", TextureType.DECORATION);
			//levelLabel.mystyle.contentOffset.y = 5;
			levelLabel.rect.width = 38;
			levelLabel.rect.height = 48;
			levelLabel.rect.x = rect.width - levelLabel.rect.width - 8;
			levelLabel.rect.y = 2;
		}
		
		GestureManager.singleton.RegistTouchable(this);
	}
	
	public int Id
	{
		get
		{
			return id;
		}
	}
	
	public int Level
	{
		set
		{
			level = value;
		}
		get
		{
			return level;
		}
	}
	
	public int Count
	{
		get
		{
			return this.count;
		}

		set
		{
			this.count = value;
		}
	}
	
	public void SetID(int id,int count)
	{
		this.id = id;
		this.count = count;
		pic.SetId(id);
		type = _Global.GetStoneType(id);
		
		//InventoryInfo itemInfo = MyItems.singleton.GetInventoryInfo(id, MyItems.Category.TreasureItem);
		//if (null != itemInfo)
		//	belongFteId = itemInfo.belongFteId;

		if(num != null)
			num.txt = "x" + this.count;

		if(levelLabel != null)
		{
			//_Global.LogWarning("ID : " + id);
			if(id != -1)
			{
				string idStr = id.ToString();
				idStr = idStr.Substring(3, 1) == "0" ? idStr.Substring(4, 1) : idStr.Substring(3, 2);
				level = KBN._Global.INT32(idStr);
				int nameLevel = (10 * (level / Constant.GEM_LEVEL)) + level % Constant.GEM_LEVEL + 1;
				levelLabel.txt = nameLevel.ToString();	
				levelLabel.SetVisible(true);	
			}
			else
			{
				levelLabel.SetVisible(false);
			}			
		}	
	}
	
	public int StoneType
	{
		get
		{
			return type;
		}
	}
	
	public override void Update()
	{
		base.Update();
		if(num != null)
			num.txt = "X" + this.count;
	}
	public override int Draw()
	{
		if (!base.visible)
			return -1;
		
		base.prot_calcScreenRect();
		
		GUI.BeginGroup(rect);
		UpdateAbsoluteVector();
		DrawInterface();
		if(tagItem.type == ItemType.Scroll && back != null && this.id > 0)
			back.Draw();
		pic.Draw();
		if(num != null)
			num.Draw();
		if(levelLabel != null)
			levelLabel.Draw();
		GUI.EndGroup();
		return 0;
	}
	
	public override void OnPopOver()
	{
		TryDestroy(this);
	}
	//======================================================================================================
	//ITouchable interface
	private Vector2 mAbsoluteVector;
	private Rect mAbsoluteRect;
	private System.Action<ITouchable> mActivated;
	public string GetName()
	{
		return "";
	}
	public bool IsVisible()
	{
		return visible;
	}
	
	public Rect GetAbsoluteRect()
	{
		mAbsoluteRect.x = mAbsoluteVector.x;
		mAbsoluteRect.y = mAbsoluteVector.y;
		mAbsoluteRect.width = rect.width;
		mAbsoluteRect.height = rect.height;
		return mAbsoluteRect;
	}
	public int GetZOrder()
	{
		return 10;
	}
	private void UpdateAbsoluteVector()
	{
		GUI.BeginGroup(pic.rect);
		mAbsoluteVector = GUIUtility.GUIToScreenPoint(new Vector2(0 ,0));
		GUI.EndGroup();
	}
	public void SetTouchableActiveFunction(System.Action<ITouchable> Activated)
	{
		mActivated = Activated;
	}
	private void DrawInterface()
	{	
		if(mActivated != null)
			mActivated(this);
	}
	public override void SetRowData(object data)
	{
		InventoryInfo infor = data as InventoryInfo;
		pic.Init();
		SetID(infor.id,infor.quant);
		num.SetVisible(true); 

		GestureManager.singleton.RegistTouchable(this);
		if(infor.id == Constant.Gear.InValidStoneID)
		{
			num.SetVisible(false);
			
			GestureManager.singleton.RemoveTouchable(this);
		}
		
	}
	
	
}
