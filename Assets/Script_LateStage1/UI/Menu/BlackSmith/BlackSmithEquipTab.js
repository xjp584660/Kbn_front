#pragma strict

class BlackSmithEquipTab extends UIObject implements IEventHandler
{
	public var prefabEquipItem:KnightInfoEquipItem;
	
	//-------------------------------------------------------- 
	public var lockedPrompt:Label;
	public var toastText:Label;
	
	public var storageCnt:Button;
	public var storageCntAddBtn:Button;
	
	public var equipKindsToolbar:ToolBar;
	public var equipScrollLists:ScrollList[];
	
	//----------------------------------------------------------------
	// Tips
	public var tip:GearInformationTip; 
	private var gearTip:GearArmTip;
	
	private var isCanTimeCounter:boolean = false;
	private var tipShowTimeCounter:float = 0;
	
	private var tipCanHideCounter:float = 0;
	private var lastIsTipShow:boolean = false;
	private var selectItem:KnightInfoEquipItem = null;
	
	private final var ToolbarStrings:String[] = ["Gear.BlacksmithWeaponTab", "Gear.BlacksmithShieldTab"
												, "Gear.BlacksmithHelmetTab", "Gear.BlacksmithArmorTab"
												, "Gear.BlacksmithPantsTab", "Gear.BlacksmithRingTab"];
	
	//----------------------------------------------------------------
	private var needRebuildEquips:boolean[];
	
	public override function Init()
	{
		super.Init();  
		
		prefabEquipItem.Init();
		
		InitTabControl();
		InitScrollLists();
		InitTip();
		InitButton();
		InitLabel();
		RegisterGUIEvents();
			
		LocalizeWords();
		InitVariables(); 
		tip.CompareRequire = false;
		toastText.SetVisible(false);
	}
	
	private function InitLabel()
	{
		lockedPrompt.setBackground("square_black",TextureType.DECORATION);
		toastText.setBackground("black_Translucent",TextureType.DECORATION);
	}
	
	private function InitButton()
	{
		storageCntAddBtn.setNorAndActBG("add_Golden","add_blue");
	}
	
	private function InitTabControl()
	{
		// Second leve toolbar
		equipKindsToolbar.Init();
		equipKindsToolbar.indexChangedFunc = OnEquipKindsTabChanged;	
		
		var toolBarNames = new String[6];
		for (var i:int = 0; i < 6; i++)
		{
			toolBarNames[i] = Datas.getArString(ToolbarStrings[i]);
		}
		equipKindsToolbar.toolbarStrings = toolBarNames; 
		equipKindsToolbar.selectedIndex = 0;
	}
	
	private function InitScrollLists()
	{ 
		needRebuildEquips = new boolean[equipScrollLists.Length];
		for (var i:int = 0; i < equipScrollLists.Length; i++)
		{
			equipScrollLists[i].Init(prefabEquipItem); 
			equipScrollLists[i].Clear(); 
			equipScrollLists[i].itemDelegate = this;
			
			needRebuildEquips[i] = true;
		} 
	}
	
	private function InitTip()
	{
		gearTip = new GearArmTip();
		gearTip.tip = tip;
		gearTip.Init();
	}
	
	private function RegisterGUIEvents()
	{ 
		storageCnt.OnClick = function()
		{
			GearSysHelpUtils.PopupDefaultDialog("", Datas.getArString("Gear.IncreaseStorageLimitDesc"), false);
		};
		
		storageCntAddBtn.OnClick = storageCnt.OnClick;
	}
	
	private function LocalizeWords()
	{
		lockedPrompt.txt = Datas.getArString("Locked");
	}
	
	private function InitVariables()
	{ 
		isCanTimeCounter = false;
		tipShowTimeCounter = 0;
		
		lastIsTipShow = false;
		selectItem = null;
	}
	
	public function Draw()
	{
		if (!visible) return;
		
		equipKindsToolbar.Draw();
		for (var i:int = 0; i < equipScrollLists.Length; i++)
		{
			equipScrollLists[i].Draw();
		}
		
		lockedPrompt.Draw();
		
		storageCnt.Draw();
		storageCntAddBtn.Draw();
		
		DrawTip();
		toastText.Draw();
	}
	
	private function DrawTip()
	{
		if (null != gearTip)
			gearTip.Draw();
	}
	
	public function Update()
	{
		equipKindsToolbar.Update();
		for (var i:int = 0; i < equipScrollLists.Length; i++)
		{ 
			if (equipScrollLists[i].isVisible())
				equipScrollLists[i].Update();
		}
		
		if (lastIsTipShow)
		{
			tipCanHideCounter += Time.deltaTime;
		}
		
		if (isCanTimeCounter)
		{
			tipShowTimeCounter += Time.deltaTime;
			if (tipShowTimeCounter >= 0.6f)
			{
				lastIsTipShow = false;
				tipCanHideCounter = 0.0f;
				
				isCanTimeCounter = false;
			}
		}
		
		if (IsTouched() && null != gearTip && (gearTip.IsShowTip() && tipCanHideCounter >= 0.55f))
		{
			isCanTimeCounter = true;
			tipShowTimeCounter = 0;
			
			ClearSelectEquipItem();
		}
	}
	
	public function OnClear()
	{
		if (null != gearTip)
			gearTip.OnPopOver();
			
		for (var i:int = 0; i < equipScrollLists.Length; i++)
		{
			equipScrollLists[i].Clear();
		}
	}
	
	public function OnMenuTabChanged(index:int)
	{  
		// Because the Toolbar's index change check maybe skip the same index
		var noFunc:Function = function(resultDatas:Array)
		{
			ShowEquipmentTab(false);
			
			storageCnt.SetVisible(false);
			storageCntAddBtn.SetVisible(false);
			
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
		};
		
		var isUnlocked:boolean = GearSysController.CheckIsGearSysUnlocked(null, noFunc);
		if (isUnlocked)
		{
			lockedPrompt.SetVisible(false);
			
			ShowEquipmentTab(true);
			SetStorageData();
			
			// Notes: in this case, the equipments is impossibility changed 
			OnEquipKindsTabChanged(equipKindsToolbar.selectedIndex);
		}
	}
	
	//--------------------------------------------------------
	private function SetStorageData()
	{
		storageCnt.SetVisible(true);
		storageCntAddBtn.SetVisible(true);
		
		var equipSys:Weaponry = GearManager.Instance().GearWeaponry;
		var equipList:List.<Arm> = equipSys.GetArms();
		
		var storageCount:int = GearManager.Instance().GetStorageCount();
		
		var prefix:String = Datas.getArString("Gear.StorageLimit");
		var szFormat:String = prefix + ":{0}/{1}";
		storageCnt.txt = String.Format(szFormat, equipList.Count, storageCount);
	}
	
	public function MarkNeedRebuild(index:int)
	{
		needRebuildEquips[index] = true;
	}
	
	private function FillAllEquipLists()
	{
		for (var i:int = 0; i < equipKindsToolbar.toolbarStrings.Length; i++)
		{
			UpdateScrollList(i, GetArmTypeByTabIndex(i));
		}
	}
	
	private function UpdateScrollList(index:int, kind:int)
	{   
		if (!needRebuildEquips[index]) 
			return;
		 	
		var equipSys:Weaponry = GearManager.Instance().GearWeaponry;
		var equipList:List.<Arm> = equipSys.GetSortArmsByType(kind);
		if (equipList.Count == 0)
		{ 
			return;
		} 
		
		needRebuildEquips[index] = false; 
		
		var scrollList:ScrollList = equipScrollLists[index];
		scrollList.Clear();
		scrollList.SetData(equipList.ToArray()); 
		scrollList.ResetPos(); 
		scrollList.UpdateData();
		 
		// Test the j# complex structure reference style
		equipList.Clear();
	}
	
	private function GetArmTypeByTabIndex(tabIndex:int) : int
	{ 
		var result:int = -1;
		
		var tabString:String = equipKindsToolbar.toolbarStrings[tabIndex]; ;
		switch (tabString)
		{
		case Datas.getArString(ToolbarStrings[0]):  
			result = Constant.ArmType.Sword;
			break;
		case Datas.getArString(ToolbarStrings[1]):  
			result = Constant.ArmType.Shield;
			break;
		case Datas.getArString(ToolbarStrings[2]):
			result = Constant.ArmType.Helmet;
			break; 
		case Datas.getArString(ToolbarStrings[3]): 
			result = Constant.ArmType.Armer;
			break;
		case Datas.getArString(ToolbarStrings[4]):  
			result = Constant.ArmType.Pants;
			break;
		case Datas.getArString(ToolbarStrings[5]):  
			result = Constant.ArmType.Ring;
			break;
		}  
		
		return result;
	}
	
	private function ShowEquipmentTab(show:boolean)
	{
		equipKindsToolbar.SetVisible(show);
		
		for (var i:int = 0; i < equipScrollLists.Length; i++)
		{
			equipScrollLists[i].SetVisible(show);
		}
	}
	 
	public function SelectEquipKindsTabIndex(index:int)
	{
		OnEquipKindsTabChanged(index);
	}
	
	private function OnEquipKindsTabChanged(index:int)
	{  
		if (index >= equipScrollLists.Length) 
		{
			Debug.LogWarning("Array out of range!!!"); 
			return;
		}
		  
		UpdateScrollList(index, GetArmTypeByTabIndex(index)); 
		
		for (var i:int = 0; i < equipScrollLists.Length; i++)
		{
			equipScrollLists[i].SetVisible(i == index);
		}
		
		// Notes: in this case, the equipments is impossibility changed
	}
	
	public function handleItemAction(action:String, param:Object):void
	{
		switch(action)
		{
		case "GearEquip_OnInit":
			OnInitEquipItem(param);
			break;
		case "GearEquip_OnClickItem":
			OnClickEquipItem(param);
			break;
		case "GearEquip_OnReqLock":
			OnEquipItemReqLock(param);
			break;
		case "GearEquip_OnClickBGBtn":
			OnClickEquipItemBGBtn(param);	
			break;
		}	
	}
	
	private function OnClickEquipItemBGBtn(param:Object)
	{
		var uiObject:KnightInfoEquipItem = param as KnightInfoEquipItem;
		if (null == uiObject || null == uiObject.Data)
		{  
			return;
		}
		
		if (lastIsTipShow)
		{
			return;
		} 
		else
		{
			uiObject.OnClickReinforceBtn();
		}
	}
	
	private function OnInitEquipItem(param:Object)
	{
		var uiObject:KnightInfoEquipItem = param as KnightInfoEquipItem;
		if (null == uiObject || null == uiObject.Data)
		{  
			return;
		} 
		uiObject.VisitSource = KnightInfoEquipItem.VisitSourceType.BlackSmith; 
	}
	
	private function OnClickEquipItem(param:Object)
	{
		var uiObject:KnightInfoEquipItem = param as KnightInfoEquipItem;
		if (null == uiObject || null == uiObject.Data)
		{  
			ClearSelectEquipItem();
			return;
		} 
		
		isCanTimeCounter = false;
		if (lastIsTipShow)
		{
			lastIsTipShow = false;
			tipCanHideCounter = 0.0f;
			return;
		}
		else
		{
			SelectEquipItem(uiObject);
		}
	}
	
	private function SelectEquipItem(uiObject:KnightInfoEquipItem):void
	{
		if (null != gearTip)
		{
			gearTip.SetIsShowCompare(false);
			gearTip.ShowTip(uiObject.Data as Arm);
			
			lastIsTipShow = true;
			tipCanHideCounter = 0.0f;
		}
		
		selectItem = uiObject;
		selectItem.itemIcon.Hilighten();
	}
	
	private function ClearSelectEquipItem():void
	{
		if (null != gearTip)
		{
			gearTip.CloseTip();
		}
		
		if (selectItem)
		{
			selectItem.itemIcon.Darken();
		}
		selectItem = null;
	}
	
	private function OnEquipItemReqLock(param:Object)
	{
		var armLocked:boolean = param;
		if (armLocked)
			ShowToastText(Datas.getArString("Gear.GearLockedDesc"));
		else
			ShowToastText(Datas.getArString("Gear.GearUnlockDesc"));
	}
	
	// Simple dispose, reason: is multiple call use one BothwayExtendAnim, then is delegate function sync operate
	private var toastTiming:float = 0.0f;
	private function ShowToastText(text:String)
	{
		toastText.rect.x = 0;
		toastText.rect.y = 420;
		toastText.rect.width = 640;
		
		var wantHeight:float = toastText.mystyle.CalcHeight(GUIContent(text), Screen.width);
		if (wantHeight > toastText.mystyle.lineHeight)
		{
			toastText.rect.height = 80;
		}
		else
		{
			toastText.rect.height = 70;
		}
		
		toastText.SetVisible(true);
		toastText.txt = text;
		
		toastTiming = 0.0f;
		BothwayExtendAnim.StartAnim(toastText, BothwayExtendAnim.ExtendStyle.UpDown, 1.2f, function()
		{
			toastTiming += 1.2f;
			TimeStayAnimation.StartAnim(toastText, 1.0f, function()
			{
				toastTiming += 1.0f;
				
				if (toastTiming >= 2.2f)
				{
					toastText.SetVisible(false);
				}
			});
		});
	} 
	
	public function OnTopMenuChanged()
	{  
		SetStorageData();
		
		// Rebuild this index ListItem
		needRebuildEquips[equipKindsToolbar.selectedIndex] = true; 
		OnEquipKindsTabChanged(equipKindsToolbar.selectedIndex);
	}
	
	private function IsTouched():boolean
	{
		var clicked:boolean = false;
#if (UNITY_ANDROID || UNITY_IPHONE) && !UNITY_EDITOR
		if (Input.touchCount > 0)
		{
		 	var touch:Touch = Input.touches[0];
		 	if (touch.phase == TouchPhase.Began)
			{
				clicked = true;
			}
			else if (touch.phase == TouchPhase.Canceled)
			{
				clicked = false;
			}
		 }
#elif UNITY_EDITOR
		if (Input.GetMouseButtonDown(0))
			clicked = true;
#endif
		return clicked;
	}
}