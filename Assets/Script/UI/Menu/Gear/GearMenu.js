import System.Collections.Generic;

public class GearMenu extends KBNMenu
{
	
	//======================================================================================================
	//
	public var baseMenuHead:MenuHead;
	public var tabControl:TabControl;
	
	private var mMenuHead:MenuHead;
	
	public var item:GearScrollViewItem;
	public var backgroundButton:Button;
	public var weaponImage:Label;
	public var star:StarLevel;
	public var stoneItem:StoneItem;
	public var number:Label;
	public var flash:FlashLabel;
	private var loadingLabel : LoadingLabelImpl;
	
	public var arcSelectControl:ArcSelectControl;
	//======================================================================================================
	//init
	public function Init()
	{
		super.Init();		
		InitGearItems();
		InitBackground();
		InitMenuHead();
		InitTabControl();
		canBeBottom = true;
		loadingLabel = null;
		
	}
	
	private function InitGearItems()
	{
		KBN.GearItems.Instance().item = item;
		KBN.GearItems.Instance().backgroundButton = backgroundButton;
		KBN.GearItems.Instance().weaponImage = weaponImage;
		KBN.GearItems.Instance().stoneItem = stoneItem;
		KBN.GearItems.Instance().star = star;
		KBN.GearItems.Instance().number = number;
		KBN.GearItems.Instance().flash = flash;
		KBN.GearItems.Instance().Init();
	}
	
	private function InitTabControl()
	{
		tabControl.OnSetTitle = SetTitle;
		tabControl.OnTabChanged = TabChanged;
		tabControl.Init();
		
		
		var toolBarNames : String[] = new String[2];
		toolBarNames[0] = Datas.getArString("Common.KnightEquipTab");
		toolBarNames[1] = Datas.getArString("Common.KnightEquipInfoTab");
		tabControl.ToolBarNames = toolBarNames;
	}
	
	public function InitGearEquipmentBackground()
	{
		var img:Texture2D = TextureMgr.instance().LoadTexture("gearMenuBack",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "gearMenuBack");
	}
	
	public function InitGearGeneralBackground()
	{
		var img : Texture2D = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_bg_wood");
	}

	private function InitBackground()
	{
		m_color = Color(1.0,1.0,1.0,1.0);
		InitGearGeneralBackground();
	}
	private function InitMenuHead()
	{
		mMenuHead = GameObject.Instantiate(baseMenuHead);
		mMenuHead.Init();
		mMenuHead.rect.height = 150;
		mMenuHead.leftHandler = menuLeftHandler;
		mMenuHead.l_title.rect.x = 82.4;
		mMenuHead.l_title.rect.width = 400;
	} 
	private function menuLeftHandler()
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
	private function get priv_activeCloseButton() : Button
	{
		if ( mMenuHead.btn_back.visible == true )
			return mMenuHead.btn_back;
		if ( mMenuHead.btn_left.visible == true )
			return mMenuHead.btn_left;
		return null;
	}

	public function SetMenuHeadBackButton()
	{
		mMenuHead.btn_back.SetVisible(false);
		mMenuHead.btn_left.SetVisible(true);
	}
	public function SetMenuHeadHomeButton()
	{
		mMenuHead.btn_back.SetVisible(true);
		mMenuHead.btn_left.SetVisible(false);
	}
	
	
	public function SetTitle(title:String):void
	{
		mMenuHead.l_title.txt = title;
	}
	
	//======================================================================================================
	//update
	public function Update()
	{
		super.Update();
		mMenuHead.Update();
		tabControl.Update(); 
		if (loadingLabel != null)
        {
            loadingLabel.Update();
        }
//		arcSelectControl.Update();
	}
	//======================================================================================================
	//draw
	public function Draw()
	{
		super.Draw();
	}
	
	public function DrawItem()
	{
		super.DrawItem();
		mMenuHead.Draw();
		super.frameTop.Draw(); 
		tabControl.Draw(); 
		if (loadingLabel != null)
        {
            loadingLabel.Draw();
        }
	}
	//======================================================================================================
	//on pop over
	public function OnPush(hash:Object)
	{ 
		super.OnPush(hash); 
		if(hash == null) return;
		var params:Object[] = hash as Object[];
		if(params == null) return;
		var knightID:String = params[0].ToString();
		var buttonType:String = params[1].ToString();
		
		if(buttonType == "home")
			SetMenuHeadHomeButton();
		else if(buttonType == "back")
			SetMenuHeadBackButton();
		
		if (General.instance().HasFteKnight())
		{
			General.instance().ParseKnights(GearManager.Instance().GearKnights);
			GearData.Instance().SetKnightSequence();
			GearData.Instance().SetCurrentIndex(0);
		}
		else
		{
			General.instance().ParseKnights(GearManager.Instance().GearKnights);
			GearData.Instance().SetKnightSequence();
			var id:int = _Global.INT32(knightID);
			GearData.Instance().SetCurrentKnightID(id);
		}
		
		tabControl.OnPush(knightID);
		if(GearData.Instance().CurrentKnight != null)
			SetTitle(General.singleton.getKnightShowName(GearData.Instance().CurrentKnight.Name,GameMain.instance().getCityOrderWithCityId(GearData.Instance().CurrentKnight.CityID)));	
//		tabControl.toolBar.selectedIndex = GearData.Instance().GearLastTab;
	}
	
	public function OnPopOver()
	{
		TryDestroy(mMenuHead);
		tabControl.OnPopOver();
		KBN.GearItems.Instance().OnPopOver();
		GestureManager.Instance().Clear();
		mMenuHead = null;
		if (loadingLabel != null)
        {
            loadingLabel=null;
        }
		
	}
	public function OnPop()
	{
		GearData.Instance().GearLastTab = tabControl.toolBar.selectedIndex;
		tabControl.OnPop();
		// for gear mem opt
//		var preMenu:String = GearData.Instance().GetGearPreMenu();
//		var nextMenu:String = GearData.Instance().GetGearNextMenu();
//		if(preMenu != null && preMenu == "GeneralMenu" && nextMenu == null)
//		{
//			var	slotId:int = Building.instance().getPositionForType(Constant.Building.GENERALS_QUARTERS);
//			if(slotId != -1)
//			{
//				GearData.Instance().SetGearPreMenu(null);
//				Building.instance().openStandardBuilding(Constant.Building.GENERALS_QUARTERS, slotId,"trans_immediate");
//			}
//		}
	}
	
	
	
	//======================================================================================================
	/***  hanle notifications ..**/
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.TOP_MENU_CHANGE:
				OnTopMenuChanged(body);
				break;
			case Constant.Notice.ShareSendFBPostOK:
            	OnFacebookPostOK(body as String);
            	closeLoading();
           	 	break;
        	case Constant.Notice.ShareSendFBPostFailed:
            	OnFacebookPostFailed(body as String);
//            	var gearEquip:GearEquipment = tabControl.Items[0] as GearEquipment;
//            	gearEquip.endShare();
            	closeLoading();
            case Constant.Notice.TOP_MENU_CHANGE:
				OnTopMenuChanged(body);
				break;
			case Constant.Notice.ShowGearLoading:
				showLoading();
				break;
			case Constant.Notice.CloseGearLoading:
				closeLoading();
				break;
			case Constant.Notice.ShowShareMenu:
				var gearEquip:GearEquipment = tabControl.Items[0] as GearEquipment;
				gearEquip.endShare();
				MenuMgr.getInstance().PushMenu("GearShareMenu","","trans_zoomComp");
				break;
				
		}
	}
	
	public function showLoading(){
		loadingLabel = new LoadingLabelImpl(false, rect.center);
	}
	
	public function closeLoading(){
		if(loadingLabel!=null){
			loadingLabel=null;
		}
		
	}
	
	private function OnTopMenuChanged(body:Object)
	{
		var array:Array = body as Array;
		if(array == null) return;
	
		var oldMenuName:String = array[0];
		var newMenuName:String = array[1];
		var tag:String = array[2];
		
		if(tag == "pop" && oldMenuName != null )
		{
			var gearInfo:GearGeneralsInfoPanel = tabControl.Items[1] as GearGeneralsInfoPanel;
			if (oldMenuName.Equals("ArmMenu"))
			{
				if (null != gearInfo)
				{
					gearInfo.UpdateKnightInfo();
				}
			}
			else if (oldMenuName.Equals("GenExpBoostMenu"))
			{
				if (null != gearInfo)
				{
					gearInfo.UpdateKnightBaseInfo();
				}
			}
		}
	}
	
	  private function OnFacebookPostOK(str : String) : void
    {
//        _Global.Log("[gearMenu OnFacebookPostOK] returned string: " + str);
        ErrorMgr.instance().PushError("",str);
        if (loadingLabel != null)
        {
            loadingLabel.Update();
        }
    }
    
    private function OnFacebookPostFailed(str : String) : void
    {
//        _Global.Log("[gearMenu OnFacebookPostFailed] returned string: " + str);

        ErrorMgr.instance().PushError("",Datas.getArString("Gear.ShareFace_NotHaveFace"));
    }
	
	private function TabChanged(index:int)
	{
		
	}
	public function OnBackButton():boolean
	{
		if(NewFteMgr.Instance().IsDoingFte)
			return true;
		return super();
	}	
}
