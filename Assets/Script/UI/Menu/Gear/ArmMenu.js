
import System.Collections.Generic;

public class ArmMenu extends KBNMenu
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
	
	public var lockedPrompt:Label; 
	public var tabNameWhenNotOpened:Label;
	
	private var lastMappingIndex:int = -1;
	
	public var arcSelectControl1:ArcSelectControl;
	public var arcSelectControl2:ArcSelectControl;
	public static var gm_GachaString : String = "Common.EquipmentReset";
	
	private var disableGacha:boolean = false;
	//======================================================================================================
	//init
	public function Init()
	{
		super.Init();
		InitGearItems();
		InitBackground();
		InitMenuHead();
		InitTabControl();
		lockedPrompt.SetFont(FontSize.Font_BEGIN);
		canBeBottom = true;
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
		if (GearSysController.IsInControling)
		{
			InitTabCtlBySysSwitch();
		}
		else
		{
			tabControl.OnSetTitle = SetTitle;
			tabControl.Init();
			
			var toolBarNames = new String[(disableGacha ? 3 : 4)];
			toolBarNames[0] = Datas.getArString("Common.EquipmentEnhanceTab");
			toolBarNames[1] = Datas.getArString("Common.EquipmentLvUpTab");
			toolBarNames[2] = Datas.getArString("Common.EquipmentInfoTab");
			if (!disableGacha) 
				toolBarNames[3] = Datas.getArString(gm_GachaString);
			tabControl.ToolBarNames = toolBarNames;
		}
	}
	
	private function InitTabCtlBySysSwitch()
	{
		tabControl.OnSetTitle = SetTitle;
		tabControl.Init();
		tabControl.OnTabChanged = OnMenuTabChangedBySwitch;
		
		var tmpNames:System.Collections.Generic.List.<String> = new System.Collections.Generic.List.<String>(4);
			
		if (GearSysController.IsOpenSwallow())
			tmpNames.Add(Datas.getArString("Common.EquipmentEnhanceTab"));
		
		if (GearSysController.IsOpenStrengthen())
			tmpNames.Add(Datas.getArString("Common.EquipmentLvUpTab"));

		if (GearSysController.IsOpenMount())
			tmpNames.Add(Datas.getArString("Common.EquipmentInfoTab"));
			
		if (GearSysController.IsOpenGacha() && !disableGacha)
			tmpNames.Add(Datas.getArString(gm_GachaString));

		//var toolBarNames:String[] = new String[tmpNames.Count];
		//for (var i:int = 0; i < tmpNames.Count; i++)
		//{
		//	toolBarNames[i] = tmpNames[i] as String;
		//}
		tabControl.ToolBarNames = tmpNames.ToArray();
		 
		// Specifical ui layout
		if (tabControl.ToolBarNames.Length <= 1) 
		{
			tabControl.toolBar.SetVisible(false); 
		}
		else 
		{
			tabControl.toolBar.SetVisible(true);	
		} 
		 
		// Default layout setting
		for (var itemIndex:int = 0; itemIndex < tabControl.Items.Length; itemIndex++)
		{
			tabControl.Items[itemIndex].SetVisible(false); 
		}
		OnMenuTabChangedBySwitch(0);
	} 
	
	private function DefaultLayoutByTabControl()
	{   
		super.frameTop.rect.y = 133;  
		super.frameTop.rect.height = 46; 
		
		super.bgMiddleBodyPic.rect.x = 0; 
		super.bgMiddleBodyPic.rect.y = tabControl.toolBar.rect.yMax;  
		super.bgMiddleBodyPic.rect.width = MenuMgr.SCREEN_WIDTH;	
		super.bgMiddleBodyPic.rect.height = MenuMgr.SCREEN_HEIGHT - tabControl.toolBar.rect.yMax;	
	}
	
	private function AutoLayoutByTabControl()
	{  
		DefaultLayoutByTabControl();
		if (tabControl.ToolBarNames.Length <= 1) 
		{
			super.frameTop.rect.y = tabControl.rect.y;  
			
			super.bgMiddleBodyPic.rect.y = tabControl.rect.y; 
			super.bgMiddleBodyPic.rect.height += tabControl.rect.height;	 
			
			tabNameWhenNotOpened.txt = tabControl.ToolBarNames[0];
			tabNameWhenNotOpened.SetVisible(true);
		}
		else
		{ 
			tabNameWhenNotOpened.SetVisible(false);
		}
	}
	
	private function InitBackground()
	{
		m_color = Color(1.0,1.0,1.0,1.0);
		//bgMiddleBodyPic.name = "ui_bg_wood";
		var img : Texture2D = TextureMgr.instance().LoadTexture("ui_bg_gear",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_bg_gear");
		//bgMiddleBodyPic.spt.edge = 2;		
	}
	private function InitMenuHead()
	{
		mMenuHead = GameObject.Instantiate(baseMenuHead);
		mMenuHead.Init();
		
		mMenuHead.leftHandler = menuLeftHandler;
	} 
	private function menuLeftHandler()
	{
		if (refuseBackByTabs())
			return;
		MenuMgr.getInstance().PopMenu("");
	}
	
	private function refuseBackByTabs() : boolean
	{
		for (var i : int = 0; i < tabControl.Items.Length; i++) {
			var gacha : GearGacha = tabControl.Items[i] as GearGacha;
			if (null != gacha) {
				if (gacha.RefuseBackButton())
					return true;
				break;
			}
		}
		return false;
	}
	
	private function SetDefaultLayout()
	{ 
		if (!GearSysController.IsInControling)
		{
			lockedPrompt.SetVisible(false);  
			tabNameWhenNotOpened.SetVisible(false);   
		}
		
		AutoLayoutByTabControl();
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
		//arcSelectControl1.Update();
		//arcSelectControl2.Update();
	}
	//======================================================================================================
	//draw
	public function Draw()
	{
		super.Draw();
	} 
	
	protected function DrawBackground()
	{
		if (tabControl.ToolBarNames.Length > 1)	
		{
			super.DrawBackground();
		} 
		else
		{ 
			if(Event.current.type == EventType.Repaint)
			{
				DrawMiddleBg(MenuMgr.SCREEN_WIDTH);
			}
			mMenuHead.Draw();
		}	
	}
	
	public function DrawItem()
	{
		super.DrawItem();
		
		if (tabControl.ToolBarNames.Length > 1)
		{
			mMenuHead.Draw();
		}
		super.frameTop.Draw();
		tabControl.Draw();
		
		
		
		tabNameWhenNotOpened.Draw(); 
		lockedPrompt.Draw(); 
	} 
	
	override function DrawMiddleBg(width:int, startx:int):void
	{		
		bgMiddleBodyPic.Draw(new Rect(startx, super.bgMiddleBodyPic.rect.y, width, super.bgMiddleBodyPic.rect.height), false);
	}
	
	//======================================================================================================
	
	//on push
	public function OnPush(param:Object)
	{
		super.OnPush(param); 
		
		InitBackground();
		var hash:Hashtable = param as Hashtable;
		if(hash != null) 
		{
			var index:int = hash["currentarm"];
			var arms:Arm[] = hash["arms"];
			
			if(arms != null)
				GearData.Instance().Arms = arms;
			
			GearData.Instance().CurrentArmIndex = index;	
			
			if (null != hash["disableGacha"]) {
				disableGacha = _Global.GetBoolean(hash["disableGacha"]);
				if (disableGacha)
					InitTabControl(); // it's ok re-init the tab
			}
		}

		tabControl.OnPush(param); 
		SetDefaultLayout();
		var arm:Arm = GearData.Instance().CurrentArm;
        if (String.IsNullOrEmpty(arm.RemarkName)){
            SetTitle(Datas.getArString("gearName.g"+arm.GDSID));
        }
        else
        {
            SetTitle(arm.RemarkName);
        }
		
//		tabControl.toolBar.selectedIndex = GearData.Instance().ArmLastTab;
	}
	
	//on pop over
	public function OnPopOver()
	{
		TryDestroy(mMenuHead);
		tabControl.OnPopOver();
		KBN.GearItems.Instance().OnPopOver();
		
	}
	public function OnPop()
	{
		tabControl.OnPop();
//		GearData.Instance().ArmLastTab = tabControl.toolBar.selectedIndex;
//		var	slotId:int = -1;
//		var preMenu:String = GearData.Instance().GetArmPreMenu();
//		if(preMenu != null && preMenu == "GearMenu" )
//		{
//			var knightId:int = GearData.Instance().CurrentKnight.KnightID;
//			MenuMgr.getInstance().PushMenu("GearMenu", knightId, "trans_immediate");
//			GearData.Instance().SetArmPreMenu(null);
//			GearData.Instance().SetGearNextMenu(null);
//			GearData.Instance().GearLastTab = 1;
//		}
//		else if(preMenu != null && preMenu == "BlackSmithMenu")
//		{
//			 slotId = Building.instance().getPositionForType(Constant.Building.BLACKSMITH);
//			if(slotId != -1)
//			{
//				GearData.Instance().SetArmPreMenu(null);
//				Building.instance().openStandardBuilding(Constant.Building.BLACKSMITH, slotId,"trans_immediate");
//			}
//		}
	}
	
	//======================================================================================================
	private function OnMenuTabChangedBySwitch(index:int)
	{
		if (index >= tabControl.ToolBarNames.Length) return;
		
		var name:String = tabControl.ToolBarNames[index]; 
		var mappingIndex:int = GetItemMappingIndexByName(name);
		
		if (-1 != lastMappingIndex)
		{
			tabControl.Items[lastMappingIndex].SetVisible(false); 
		}
		lastMappingIndex = mappingIndex;
		
		// Only need no function callback
		var noFunc:Function = function(resultDatas:Array)
		{
			lockedPrompt.SetVisible(true); 
			if (null != resultDatas)
			{
				var infoDatas:Array = new Array();
				for (var iCondition:SystemCfgCondition in resultDatas)
				{
					var tType:int = _Global.INT32(iCondition.type);
					if (tType == SystemCfgConditionType.BuildingLevel)
					{
						var tBuildingTypeId:int = _Global.INT32(iCondition.key);
						var tBuildingNeedLevel:int = _Global.INT32(iCondition.val);
						var tBuildingName:String = Datas.getArString("buildingName."+"b" + tBuildingTypeId);
						
						infoDatas.Push(tBuildingNeedLevel);
						infoDatas.Push(tBuildingName);
					}
				}
				
				if (infoDatas.Count != 4)
				{
					_Global.Log("Not match the Gear.BlacksmithUnlockDesc paramters!!!");
				}
				var promptText:String = String.Format(Datas.getArString("Gear.BlacksmithUnlockDesc"), 
													infoDatas[0], infoDatas[1], infoDatas[2], infoDatas[3]);
				lockedPrompt.txt = promptText;
			}
			
			tabControl.Items[mappingIndex].SetVisible(false); 
		};
		var isUnlocked:boolean = CheckIsUnlocked(name, null, noFunc);
			
		if (isUnlocked) // unlock
		{
			lockedPrompt.SetVisible(false); 
			tabControl.Items[mappingIndex].SetVisible(true);
			
			//1:GearSwallow     2:GearStrengthen     3:GearMount  
			BuildingDecMgr.getInstance().deleteDecoWithType(index + 1);
			
			if (mappingIndex == 1)
			{
				var strengthen:StrengthenTab = tabControl.Items[mappingIndex] as StrengthenTab;
				strengthen.UpdateData();
			}
			
			tabControl.MappingIndex = mappingIndex;
		} // End if (isUnlocked)
	} 
	
	private function GetItemMappingIndexByName(name:String):int
	{
		var mappingIndex:int = -1;
		if ( name.Equals(Datas.getArString("Common.EquipmentInfoTab")) )
		{
			mappingIndex = 2;
		}
		else if ( name.Equals(Datas.getArString("Common.EquipmentEnhanceTab")) )
		{	
			mappingIndex = 0;
		}
		else if ( name.Equals(Datas.getArString("Common.EquipmentLvUpTab")) )
		{
			mappingIndex = 1;
		}
		else if ( name.Equals(Datas.getArString(gm_GachaString)) )
		{
			mappingIndex = 3;
		}
		
		return mappingIndex;
	}
	
	public function GetNameByMapppingIndex(index:int):String
	{
		if (index == 2)
		{
			return Datas.getArString("Common.EquipmentInfoTab");
		}
		else if (index == 0)
		{
			return Datas.getArString("Common.EquipmentEnhanceTab");
		}
		else if (index == 1)
		{
			return Datas.getArString("Common.EquipmentLvUpTab");
		}
		else if ( index == 3 )
		{
		return Datas.getArString(gm_GachaString);
		}
	}
	
	private function CheckIsUnlocked(name:String, yesFunc:Function, noFunc:Function):boolean
	{
		if ( name.Equals(Datas.getArString("Common.EquipmentInfoTab")) )
		{
			return GearSysController.CheckIsMountUnlocked(yesFunc, noFunc);
		}
		
		else if ( name.Equals(Datas.getArString("Common.EquipmentEnhanceTab")) )
		{	
			return GearSysController.CheckIsSwallowUnlocked(yesFunc, noFunc);
		}
		
		else if ( name.Equals(Datas.getArString("Common.EquipmentLvUpTab")) )
		{
			return GearSysController.CheckIsStrengthenUnlocked(yesFunc, noFunc);
		}
		else if ( name.Equals(Datas.getArString(gm_GachaString)) )
		{
			return GearSysController.CheckIsGachaUnlocked(yesFunc, noFunc);
		}
		
		return true;
	}
	
	/***  hanle notifications ..**/
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.TOP_MENU_CHANGE:
				OnTopMenuChanged(body);
				break;
		}
	}
	
	private function OnTopMenuChanged(body:Object)
	{
		var array:Array = body as Array;
		if(array == null) return;
	
		var oldMenuName:String = array[0];
		var newMenuName:String = array[1];
		var tag:String = array[2];
		
		if(tag == "pop" && oldMenuName.Equals("StrengthenMatMenu"))
		{
			var mappingIndex:int = GetItemMappingIndexByName(Datas.getArString("Common.EquipmentLvUpTab"));
			var strengthen:StrengthenTab = tabControl.Items[mappingIndex] as StrengthenTab;
			if (null != strengthen)
				strengthen.UpdateItemData();
		}
	}
	
	public override function OnBackButton():boolean
	{
		if(NewFteMgr.Instance().IsDoingFte)
			return true;
			
		if (refuseBackByTabs())
			return true;
			
		return super.OnBackButton();
	}	
}