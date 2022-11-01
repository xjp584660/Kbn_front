



public class SkillInformationMenu extends KBNMenu implements ITouchable
{
	public var view:ScrollList;
	public var baseMenuHead:MenuHead;
	public var close:Button;
	public var item:SkillInformationItem;
	
 	public var attribute:Label;
 	public var benifit:Label;
 	public var type:Label;
 	private var menuType:MenuType;
 	
 	public var description:Label;
 	public enum MenuType
 	{
 		Knight,
 		Grade,
 		Strenthen
 	}
 	
 	//private var items:List.<SkillInformationItem>;
	private var mMenuHead:MenuHead;
	
	public function Init()
	{ 
		super.Init();
		InitBackground();
		InitMenuHead();
		
		attribute.Init();
 		benifit.Init();
 		type.Init();
		
		attribute.txt = Datas.getArString("Gear.AttributeIcon");
 		benifit.txt = Datas.getArString("Gear.BenefitTroops");
 		type.txt = Datas.getArString("Gear.AttributeType");
		
		
		SetTitle(Datas.getArString("Gear.EquipmentAttributeTitle"));
		InitAbsoluteRect();
		
		description.Init();
		GestureManager.Instance().RegistTouchable(this);
	} 
	private function InitBackground()
	{
		m_color = Color(1.0,1.0,1.0,1.0);
		//bgMiddleBodyPic.name = "ui_bg_wood";
		bgStartY = 70;
		var img : Texture2D = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_bg_wood");
		//bgMiddleBodyPic.spt.edge = 2;		
	}
	private function InitMenuHead()
	{
		mMenuHead = GameObject.Instantiate(baseMenuHead);
		mMenuHead.Init(); 
		mMenuHead.backTile.rect.y = 0;
		mMenuHead.leftHandler = menuLeftHandler;
	} 
	private function menuLeftHandler()
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
	public function SetTitle(title:String):void
	{
		mMenuHead.l_title.txt = title;
	}
	public function Update()
	{
		view.Update();
		description.Update();
	}
	public function Draw()
	{
		super.Draw();
	}
	public function DrawBackground()
	{
		mMenuHead.Draw(); 
		DrawMiddleBg();
	}
	public function DrawItem()
	{
		description.Draw();
		view.Draw(); 
		attribute.Draw();
 		benifit.Draw();
 		type.Draw();
		
		frameTop.Draw();
		DrawInterface();
		
	}
	
	public function OnPush(hash:Object)
	{ 
		super.OnPush(hash);
		menuType = hash;
		
		description.txt = "";
		AutoLayout();
		view.Init(item);
		Read();
		view.AutoLayout();
		view.MoveToTop();
	}	
	
	private function Read()
	{
		var list:List.<int> = GearManager.Instance().GetBaseSkills(); 
		if(list == null) return; 
		DestroyResources();
		var array:Array = new Array();
		for(var i:int = 0;i<list.Count;i++)
		{
			array[i] = list[i];
		}
		view.SetData(array);
	}
	
	public function AutoLayout()
	{
		switch(menuType)
		{
			case MenuType.Knight:
				description.txt = Datas.getArString("IngameHelp.Gear_Text1") + "\n" + "\n" + Datas.getArString("IngameHelp.Gear_Text2");
				break;
			
			case MenuType.Grade:
				description.txt = Datas.getArString("IngameHelp.Gear_Text3");
				break;
				
			case MenuType.Strenthen:
				description.txt = Datas.getArString("IngameHelp.Gear_Text4");
				break;
		}
		var height:int = description.GetTxtHeight();
		
		
		attribute.rect.y = description.rect.y + height + 30;
		benifit.rect.y = attribute.rect.y;
		type.rect.y = attribute.rect.y;
		
		height = attribute.GetTxtHeight();
		view.rect.y = attribute.rect.y + height + 10;
		view.rect.height = 960 - view.rect.y;
		
	}
	
	
	public function OnPopOver()
	{ 
		DestroyResources();
		TryDestroy(mMenuHead);
	}
	
	private function DestroyResources()
	{ 
		view.Clear();
	}
	public function OnPop()
	{
		
	}
	
	//======================================================================================================
	//touchable interface 
	private var mAbsoluteRect:Rect; 
	private var mActivated:System.Action.<ITouchable>;
	private var receiverActivated:Function;
	public function GetName():String
	{
		return "";
	}
	public function IsVisible():boolean
	{
		return visible;
	}
	
	private function InitAbsoluteRect()
	{
		mAbsoluteRect = new Rect(0,0,640,960);
	}
	public function GetAbsoluteRect():Rect
	{ 
		return mAbsoluteRect;
	}

	public function GetZOrder():int
	{
		return 1000;
	}
	public function SetTouchableActiveFunction(Activated:System.Action.<ITouchable>)
	{
		mActivated = Activated;
	}

	private function DrawInterface()
	{	
		if(mActivated != null)
			mActivated(this); 
		if(receiverActivated != null)
			receiverActivated(this);
	}
	
	
	
}