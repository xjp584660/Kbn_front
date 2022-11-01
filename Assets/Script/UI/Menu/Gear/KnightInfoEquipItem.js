import System.Collections;
import System.Collections.Generic;

class KnightInfoEquipItem extends ListItem implements ITouchable
{ 
	public var backgroundBtn:Button;
	public var underLineLabel:Label;
	
	// Composed UIOjbect which inclue item icon totals
	public var itemIcon:KnightItemIcon;
	public var itemName:Label;
	
	// Base property
	public var itemPropLife:Label;
	public var itemPropAttack:Label;
	public var itemPropTroopsLimit:Label;
	
	// Composed UIObject
	public var skillBGLabel:Label;
	public var skillProps:ItemSkillProperty[];
	// public var itemPropAdds:ItemPropAddComposed;
	
	public var lockBtn:Button;
	public var reinforceBtn:Button;
	public var guideReinforceBtn:Button;
	
	public var nullItemPrompt:Label;
	
	public var renameBtn:Button;
	
	//------------------------------------------------------------
	private var data:Arm = null; 
	
	//------------------------------------------------------------
	private var touchableActivated:System.Action.<ITouchable>;
	
	//------------------------------------------------------------
	private var visitSource:VisitSourceType = VisitSourceType.GeneralHouse; 
	private var originColor : FontColor;
	
	
	//----------------------------------------------------------------
	public enum VisitSourceType
	{
		BlackSmith,
		GeneralHouse,
		Mount
	}
	
	public override function Init()
	{ 
		super.Init();
		
		itemIcon.Init();
		InitBackground();
		InitButton();
		LocalizeWords();
		RegisterGUIEvents();
		
		InitVariables(); 
		RegisterGesture(); 
		
		ShowBaseData(true);
		ShowSkillsData(true); 
		originColor = itemName.normalTxtColor;
	}
	
	private function InitBackground()
	{ 
		backgroundBtn.rect.x = itemIcon.rect.xMax + 5;
		backgroundBtn.rect.width = 300;
		backgroundBtn.rect.height = super.rect.height;
		
//		underLineLabel.setBackground("backFrame",TextureType.DECORATION);
		//underLineLabel.mystyle.normal.background = TextureMgr.instance().LoadTexture("backFrame",TextureType.FTE);
		
		if ( skillBGLabel != null )
		{
			skillBGLabel.setBackground("square_black",TextureType.DECORATION);
			skillBGLabel.txt = "";
		}
	}
	
	private function InitButton()
	{
		guideReinforceBtn.setNorAndActBG("button_moreinfo_small2_normal","button_moreinfo_small2_down");
		reinforceBtn.setNorAndActBG("Forging_button","Forging_button_down");
		
	}
	
	private function LocalizeWords()
	{
		// nullItemPrompt.txt = Datas.getArString("Common.Null");
	}
	
	private function InitVariables()
	{ 
		super.indexInList = 0;
		visitSource = VisitSourceType.GeneralHouse; 
	}
	
	private function RegisterGUIEvents()
	{
		backgroundBtn.OnClick = DefaultOnClickBGBtn;
		lockBtn.OnClick = OnClickLockBtn;
		reinforceBtn.OnClick = OnClickReinforceBtn;
		guideReinforceBtn.OnClick = OnClickReinforceBtn;
		renameBtn.OnClick = OnClickrenameBtn;
		
		SetClickItemIcon(OnDefaultClickItemIcon);
	}
	
	private function RegisterGesture()
	{ 
		// Use the GestureManager from Cai Ming code
		// For add touchable rect to Controller
		GestureManager.Instance().RegistTouchable(this);
	}
	
	private function UnregisterGesture()
	{
		GestureManager.Instance().RemoveTouchable(this);
	}
	
	//------------------------------------------------
	public function DrawItem()
	{
		if (!super.visible)
			return;
		
		//super.prot_calcScreenRect();	
		
		//GUI.BeginGroup(super.rect); 
		
		Convert2ScreenRect(super.rect);
		
		backgroundBtn.Draw();
		underLineLabel.Draw();
		itemIcon.Draw(); 
		itemName.Draw(); 
		
		itemPropLife.Draw();
		itemPropAttack.Draw();
		itemPropTroopsLimit.Draw(); 
		
		// Arm skill 
		if (null != skillBGLabel)
		{
			skillBGLabel.Draw();
		}
		if (null != skillProps)
		{
			for (var i:int = 0; i < skillProps.Length; i++)
			{
				skillProps[i].Draw();
			}
		}
		// itemPropAdds.Draw(); 
		
		lockBtn.Draw(); 
		renameBtn.Draw();
		
		reinforceBtn.Draw(); 
		guideReinforceBtn.Draw();
		
		nullItemPrompt.Draw();
		//GUI.EndGroup();
	}
	
	public function Update()
	{
		super.Update();
		
		if (null != itemIcon)
		{
			itemIcon.Update();
		}
	}
	
	public override function OnClear()
	{
		super.OnClear();
		UnregisterGesture();
	}
	
	// Update per frame
	private function Convert2ScreenRect(guiRect:Rect)
	{
		var minPoint:Vector2 = GUIUtility.GUIToScreenPoint(new Vector2(guiRect.xMin, guiRect.yMin));
		var maxPoint:Vector2 = GUIUtility.GUIToScreenPoint(new Vector2(guiRect.xMax, guiRect.yMax));
	}
	
	// Override ITouchable
	public function GetAbsoluteRect():Rect
	{
		// Convert to screen coordinate?
		return ScreenRect;
	}
	public function GetName():String
	{
		return "";
	}
	public function IsVisible():boolean
	{
		return visible;
	}
	
	public function GetZOrder():int
	{
		return 0;
	} 
	
	public function SetTouchableActiveFunction(activated:System.Action.<ITouchable>)
	{
		touchableActivated = activated;
	}
	
	private function UpdateGestures()
	{	
		if (touchableActivated != null)
			touchableActivated(this); 
	}
	
	public override function SetRowData(object:Object):void
	{
		Data = object;
		VisitSource = VisitSourceType.GeneralHouse; 
		
		// Notify the init end event
		if(handlerDelegate)
			handlerDelegate.handleItemAction("GearEquip_OnInit", this);
	}
	
	public function set Data(value:Object)
	{	
		data = value as Arm;
		if (null == data)
			NullEquipItemData();
		else
			SetEquipItemData(data);
	}
	
	public function get Data():Object
	{
		return data;
	} 
	
	public function set IndexInList(value:Object)
	{
		indexInList = value;
	}
	
	public function SetUIData(data:System.Object)
	{
		var d:UIData = data as UIData;
		if(d == null)
		  return;
	
		Data = d.arm;
		VisitSource = d.source;
	} 
	
	public function set VisitSource(value:Object)
	{   
		visitSource = value;
		if(skillBGLabel != null)
			skillBGLabel.SetVisible(false);
		switch (visitSource)
		{
		case VisitSourceType.BlackSmith:  
			lockBtn.SetVisible(true);
			renameBtn.SetVisible(true);
			if(skillBGLabel != null)
				skillBGLabel.SetVisible(true);
			reinforceBtn.SetVisible(true);
			guideReinforceBtn.SetVisible(false);
			
			//guideReinforceBtn.SetVisible(GearSysController.IsCanArmOperate());
			reinforceBtn.SetVisible(GearSysController.IsCanArmOperate());
			break;
		case VisitSourceType.GeneralHouse: 
			lockBtn.SetVisible(false);
			renameBtn.SetVisible(true);
			reinforceBtn.SetVisible(true);
			guideReinforceBtn.SetVisible(false);
			
			//guideReinforceBtn.SetVisible(GearSysController.IsCanArmOperate());
			reinforceBtn.SetVisible(GearSysController.IsCanArmOperate());
			break;
		case VisitSourceType.Mount:
			lockBtn.SetVisible(false);
			renameBtn.SetVisible(false);
			reinforceBtn.SetVisible(false);
			guideReinforceBtn.SetVisible(false);
			
			ShowSkillsData(false);
			break;
		}
		
		itemIcon.itemIsInKnight.SetVisible(visitSource == VisitSourceType.BlackSmith);
	}
	
	public function get VisitSource():VisitSourceType
	{
		return visitSource;
	}
	
	public function SetClickItemIcon(del:Function)
	{
		itemIcon.SetOnClickDelegate(del);
		itemIcon.itemBackgroundBtn.clickParam = this;
	}
	
	private function OnDefaultClickItemIcon()
	{
		if(handlerDelegate)
			handlerDelegate.handleItemAction("GearEquip_OnClickItem", this);
	}
	
	private function NullEquipItemData()
	{
		itemIcon.Data = null;
		
		if (visitSource == VisitSourceType.GeneralHouse)
		{
			itemIcon.SetNullItemIcon(GearSysHelpUtils.NullEquipImageNames[super.indexInList]);
			nullItemPrompt.txt = Datas.getArString(GearSysHelpUtils.NullEquipPrompts[super.indexInList]);
		}
		
		itemName.txt = "";
		
		ShowBaseData(false);
		ShowSkillsData(false);
		
		lockBtn.SetVisible(false);
		reinforceBtn.SetVisible(false); 
		guideReinforceBtn.SetVisible(false);
		renameBtn.SetVisible(false);
		nullItemPrompt.SetVisible(true);
		
	}
	
	private function SetEquipItemData(data:Arm)
	{
		// Icon
		itemIcon.Data = data;
		
		// Name
		
		if(String.IsNullOrEmpty(data.RemarkName)){
		 itemName.txt = Datas.getArString("gearName.g" + data.GDSID.ToString());
		}else{
		   itemName.txt = data.RemarkName;
		   itemName.SetNormalTxtColor(FontColor.New_KnightName_Blue);
		}
		
		// Property1 // Property2 // Property3
		// According GDS to calculate the necessary value
		ShowBaseData(true);
		
		// Calculate the hp and attack
		var lifeVal:double = GearManager.Instance().GetArmLife(data.GDSID, data.StarLevel,data.TierLevel);
		lifeVal = GearManager.Instance().GetShowData(lifeVal);
		GearSysHelpUtils.SetItemProp(itemPropLife, ItemPropertyKind.Life, lifeVal);
		
		var attackVal:double = GearManager.Instance().GetArmAttack(data.GDSID, data.StarLevel,data.TierLevel);
		attackVal = GearManager.Instance().GetShowData(attackVal);
		GearSysHelpUtils.SetItemProp(itemPropAttack, ItemPropertyKind.Attack, attackVal);
		
		var troopLimitVal:int = GearManager.Instance().GetArmTroop(data.GDSID, data.StarLevel);
//		if (troopLimitVal <= 0)
//			itemPropTroopsLimit.SetVisible(false);
//		else
			GearSysHelpUtils.SetItemProp(itemPropTroopsLimit, ItemPropertyKind.TroopsLimit, troopLimitVal);
		
		ShowSkillsData(true);
		SetSkillData(data);
		
		SetItemLocked(data.Locked);
		nullItemPrompt.SetVisible(false);
		
		VisitSource = visitSource;
	}
	
	private function SetSkillData(data:Arm)
	{ 
		if (null == skillProps)
			return;
		
		// Null it first
		var i:int = 0;
		for (i = 0; i < skillProps.Length; i++)
		{
			skillProps[i].ArmData = null;
			skillProps[i].Data = null;
		}
			
		if (null != data)
		{
			i = 0;
			for (var keyVal:KeyValuePair.<int, ArmSkill> in data.ArmSkills)
			{ 
				if (i >= skillProps.Length)
					break;
					
				skillProps[i].ArmData = data;
				skillProps[i].Data = keyVal.Value;
				skillProps[i].SetPropLabelLight(i < data.StarLevel);
				
				i++;
			}
		}
	}
	
	private function ShowBaseData(show:boolean)
	{
		itemPropLife.SetVisible(show); 
		itemPropAttack.SetVisible(show);
		itemPropTroopsLimit.SetVisible(show);
	}
	
	private function ShowSkillsData(show:boolean)
	{ 
		if (null != skillProps)
		{
			for (var i:int = 0; i < skillProps.Length; i++)
			{
				skillProps[i].SetVisible(show);
			}
		}
		
		if (null != skillBGLabel)
			skillBGLabel.SetVisible(show);
			
		// itemPropAdds.SetVisible(show);
	}
	
	private function SetItemLocked(locked:boolean)
	{
		var normalImageName:String = "Equipment_unlocked";
		// var activeImageName:String = "Equipment_unlocked_down";
		
		if (locked)
		{
			normalImageName = "Equipment_lock";
			// activeImageName = "Equipment_lock_down";
		}
		
		lockBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture(normalImageName, TextureType.BUTTON);
		// lockBtn.mystyle.active.background = TextureMgr.instance().LoadTexture(activeImageName, TextureType.GEAR);
	}
	
	public function SetOnClickBGBtn(del:Function)
	{
		backgroundBtn.OnClick = del;
		backgroundBtn.clickParam = this;
	}
	
	private function DefaultOnClickBGBtn()
	{
		// TODO:
		// Show the item full information 
		if(handlerDelegate)
			handlerDelegate.handleItemAction("GearEquip_OnClickBGBtn", this);
	}
	
	private function OnClickLockBtn()
	{
		// TODO:
		// Tell the server
		if (null != data)
			UnityNetReqLockEquip(data.PlayerID, !data.Locked);
	}
	
	public function OnClickReinforceBtn()
	{
		// TODO:
		// Check is Arm function opended?
		if (!GearSysController.IsCanArmOperate())
			return;
			
		if (null == data)
			return;
		
		// Open the EquipUpgradeMenu
		var hash:Hashtable = new Hashtable(); 
		if (visitSource == VisitSourceType.GeneralHouse)
		{ 
			var knightArms:Arm[] = GearData.Instance().CurrentKnight.Arms;
			var transfArms:Array = new Array();
			for (var i:int = 0; i < knightArms.Length; i++)
			{
				if (knightArms[i] != null)
					transfArms.Push(knightArms[i]);	
			}
			
			var indexInArry:int = 0;
			for (indexInArry = 0; indexInArry < transfArms.Count; )
			{
				if (transfArms[indexInArry] == data)
					break;
				else
					indexInArry++;
			}
			
			hash["currentarm"] = indexInArry; 
			hash["arms"] = transfArms;
			hash["disableGacha"] = true;
		}
		else if (visitSource == VisitSourceType.BlackSmith)
		{ 
			hash["currentarm"] = super.indexInList; 
			var equipList:List.<Arm> = GearManager.Instance().GearWeaponry.GetSortArmsByType(data.Category);
			hash["arms"] = equipList.ToArray();
			hash["disableGacha"] = (data.Category != Constant.ArmType.Ring);
		}
		 
		 // for mem opt
//		var curMenu  : KBNMenu = MenuMgr.getInstance().GetCurMenu();
//		if(curMenu != null)
//		{
//			if(curMenu instanceof GearMenu)
//			{
//				GearData.Instance().SetArmPreMenu("GearMenu");
//			}
//			else if(curMenu instanceof BlackSmithMenu)
//			{
//				GearData.Instance().SetArmPreMenu("BlackSmithMenu");
//			}
//		}
//		GearData.Instance().SetGearNextMenu("ArmMenu");
//		MenuMgr.getInstance().PopMenu("");
		MenuMgr.getInstance().PushMenu("ArmMenu", hash, "");
		
	}
	
	
	public function OnClickrenameBtn(){
	   var kid:int = itemIcon.Data!=null? itemIcon.Data.PlayerID:0;
	   var name:String =  itemName.txt;
	   MenuMgr.getInstance().PushMenu("RenameKnightMenu",{"type":"equip","kid":kid,"name":name,"act":OnRenameAction},"trans_zoomComp");
	}
	
	// UnityNetReqStrengthen
	private function UnityNetReqLockEquip(itemUniqId:int, locked:boolean)
	{ 
		var reqParams:Hashtable = new Hashtable(); 
		reqParams.Add("uniqId", itemUniqId);
		
		if (locked)
			reqParams.Add("lock", 1);
		else
			reqParams.Add("lock", 0);
		
		UnityNet.ReqGearLockEquip(reqParams, ReqLockEquipOk, ReqLockEquipError);
	}
	
	// UnityNetReqStrengthen callback
	private function ReqLockEquipOk(result:HashObject)
	{
		_Global.Log("ReqLockEquipOk");
		
		// Get data from server
		data.Locked = !data.Locked;
		SetItemLocked(data.Locked);
		
		if(handlerDelegate)
			handlerDelegate.handleItemAction("GearEquip_OnReqLock", data.Locked);
	}
	
	// UnityNetReqStrengthen callback
	private function ReqLockEquipError(msg:String, errorCode:String)
	{
		_Global.Log("ReqLockEquipError.errorCode:" + errorCode);
		
		// if(handlerDelegate)
		// 	handlerDelegate.handleItemAction("GearEquip_OnReqLock", false);
			
		if(errorCode.Equals("UNKNOWN"))
			return;
	}
	
	
	///-----------------------------------------------------------
	public class UIData
	{
		public function UIData(arm:Arm,source:VisitSourceType)
		{
			this.arm = arm;
			this.source = source;
		}
		
		public var arm:Arm;
		public var source:VisitSourceType;
	}
	
	
	public function OnPopOver():void 
	{
		this.backgroundBtn.OnPopOver();
		
		if (null != this.skillBGLabel)
			this.skillBGLabel.OnPopOver(); 
		this.underLineLabel.OnPopOver();
		this.itemIcon.OnPopOver();
		this.itemName.OnPopOver();
		this.lockBtn.OnPopOver();
		this.renameBtn.OnPopOver();
		this.reinforceBtn.OnPopOver();
		this.guideReinforceBtn.OnPopOver();
		UIObject.TryDestroy(this);
	}
	
	private function OnRenameAction(name:String,isChange:Boolean)
	{
	  this.itemName.txt = name;
	  if(isChange)
	  {
	  this.itemName.SetNormalTxtColor(FontColor.New_KnightName_Blue);
	  }
	  else
	  {
	  this.itemName.SetNormalTxtColor(originColor);
	  }
	}
			
}