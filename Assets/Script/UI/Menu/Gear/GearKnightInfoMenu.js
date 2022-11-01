class GearKnightInfoMenu extends GeneralReincarnationInfo implements ITouchable, GestureReceiver
{
	///--------Prefab to Instatiate---------------------------------------
	public var prefabEquipItem:KnightInfoEquipItem;
	public var prefabEquipItem1:KnightInfoEquipItem;
	public var prefabEquipItem2:KnightInfoEquipItem;
	public var prefabEquipItem3:KnightInfoEquipItem;
	public var prefabEquipItem4:KnightInfoEquipItem;
	public var prefabEquipItem5:KnightInfoEquipItem;
	//-----------------------------------------------
	// public var knightBaseInfoComp:ComposedUIObj;
	public var scrollView:ScrollView;
	
	public var knightBackground:Label;
	public var underLineLabel:Label;
	
	public var knightAvatar:Label;
	public var knightName:Label;
	
	public var knightPropLevel:Label;
	public var knightPropAttack:Label;
	public var knightPropLife:Label;
	public var knightPropTroopLimit:Label;
	
	public var knightExpProgress:ProgressBar;
	public var knightExpLabel:Label;
	public var gotoExpBtn:Button;
	
	// Max extra properties count is 2
	public var knightPropExtras:Label[]; // Icon + texts
	
	// 5kind
//	public var equipItemsScrollView:ScrollView;
//	public var itemFullInfo:KnightItemFullInfo;
	
	//---------------------------------------------------------
	private final var PropMaxExtraCnt:int = 2;
	private final var EquipMaxCnt:int = 5;
	
	private var data:Object;
	
	//------------------------------------------------------------
	private var touchableActivated:System.Action.<ITouchable>;
	private var receiverActivated:System.Action.<GestureReceiver>; 
	private var screenAbsoluteRect:Rect;
	
	@HideInInspector public var OnLongPressedDelegate:Function;
	@HideInInspector public var OnLongPressReleasedDelegate:Function;
	
	//----------------------------------------------------------------
	// Tips
	public var tip:GearInformationTip; 
	private var gearTip:GearArmTip;
	
	private var isCanTimeCounter:boolean = false;
	private var tipShowTimeCounter:float = 0;
	
	private var tipCanHideCounter:float = 0;
	private var lastIsTipShow:boolean = false;
	private var selectItem:KnightInfoEquipItem = null;

	//-------------------------------------------
	public override function Init()
	{  
		super.Init(); 

		knightExpProgress.Init();
		knightExpProgress.SetCurValue(0.5f); 
		
		// itemFullInfo.Init();
		InitBackground();
		
		InitEquipItems(); 
		InitTip();
		
		RegisterGUIEvents(); 
		LocalizeWords();
		
		InitVariables();

		ShowKnightVolatiteProps(false);
	}
	
	private function InitVariables()
	{
		isCanTimeCounter = false;
		tipShowTimeCounter = 0;
		
		lastIsTipShow = false;
		selectItem = null;
	}
	
	private function InitBackground()
	{
		GearSysHelpUtils.SetLabelTexture(knightBackground, "Brown_Gradients", TextureType.DECORATION);
	}
	
	private function InitEquipItems()
	{  
		scrollView.Init();
		scrollView.IntervalSize = -10;
		
		prefabEquipItem.SetIndexInList(5);
		prefabEquipItem1.SetIndexInList(0);
		prefabEquipItem2.SetIndexInList(1);
		prefabEquipItem3.SetIndexInList(2);
		prefabEquipItem4.SetIndexInList(3);
		prefabEquipItem5.SetIndexInList(4);
		
		prefabEquipItem.SetClickItemIcon(OnClickEquipItem);
		prefabEquipItem1.SetClickItemIcon(OnClickEquipItem);
		prefabEquipItem2.SetClickItemIcon(OnClickEquipItem);
		prefabEquipItem3.SetClickItemIcon(OnClickEquipItem);
		prefabEquipItem4.SetClickItemIcon(OnClickEquipItem);
		prefabEquipItem5.SetClickItemIcon(OnClickEquipItem);
		
		// Click background button
		prefabEquipItem.SetOnClickBGBtn(OnClickEquipItemBGBtn);
		prefabEquipItem1.SetOnClickBGBtn(OnClickEquipItemBGBtn);
		prefabEquipItem2.SetOnClickBGBtn(OnClickEquipItemBGBtn);
		prefabEquipItem3.SetOnClickBGBtn(OnClickEquipItemBGBtn);
		prefabEquipItem4.SetOnClickBGBtn(OnClickEquipItemBGBtn);
		prefabEquipItem5.SetOnClickBGBtn(OnClickEquipItemBGBtn);
	}
	public function OnSelect()
	{
		tip.CompareRequire = true;
	}
	private function InitTip()
	{
		gearTip = new GearArmTip();
		gearTip.tip = tip;
		gearTip.Init();
	}
	
	private function LocalizeWords()
	{
		gotoExpBtn.txt = Datas.getArString("Common.PlusExp_button");
	}
	
	private function RegisterGUIEvents()
	{
		gotoExpBtn.OnClick = OnClickGotoExpBtn;
	}
	
	public function RegisterGesture()
	{
//		// For receive the touchable of KnightInfoEquipItem
//		GestureManager.Instance().RegistReceiver(this);
//		
//		// For add touchable rect to Controller
//		GestureManager.Instance().RegistTouchable(this);
	}
	
	private function UnregisterGesture()
	{
//		GestureManager.Instance().RemoveReceiver(this);
//		GestureManager.Instance().RemoveTouchable(this);
	}
	
	public override function Draw()
	{
		if (!super.isVisible) return;
		
		super.prot_calcScreenRect();
		
		Local2ScreenRect();
		UpdateGestures();
		
		GUI.BeginGroup(super.rect);
		// knightBaseInfoComp.Draw();
		scrollView.Draw();
				
		knightBackground.Draw();
		underLineLabel.Draw();
		
		knightAvatar.Draw();
		knightName.Draw();
		
		knightPropLevel.Draw();
		knightPropAttack.Draw();
		knightPropLife.Draw();
		knightPropTroopLimit.Draw();
		
		knightExpProgress.Draw();
		knightExpLabel.Draw();
		gotoExpBtn.Draw();
		
		if (null != knightPropExtras)
		{
			for (var i:int = 0; i < knightPropExtras.Length; i++)
			{
				knightPropExtras[i].Draw();
			}
		}
		
		DrawTip();
		// prefabEquipItem.Draw();  
		//equipItemsScrollView.Draw();
		
		// itemFullInfo.Draw();
		this.prot_drawItems();
		GUI.EndGroup();
	}
	
	private function DrawTip()
	{
		if (null != gearTip)
			gearTip.Draw();
	}
	
	public function Update()
	{
//		equipItemsScrollView.Update();
		scrollView.Update();
		
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
		prefabEquipItem.OnClear();
		prefabEquipItem1.OnClear();
		prefabEquipItem2.OnClear();
		prefabEquipItem3.OnClear();
		prefabEquipItem4.OnClear();
		prefabEquipItem5.OnClear();
		
		if (null != gearTip)
			gearTip.OnPopOver();
			
		UnregisterGesture();
	}
	
	public override function SetVisible(visible:boolean)
	{
		super.SetVisible(visible);
	}
	
	public function SetRowData(data:Object)
	{
		// Here data is general id
		var knightId:int = data;
		var knight:Knight = GearManager.Instance().GearKnights.GetKnight(knightId);
		Data = knight;
	}
	
	public function SetUIData(data:System.Object)
	{
		Data = data;
	}
	
	public function set Data(value:Object)
	{
		data = value;
		// Convert to knight data
		if (null == data)
		{
			NullKnightData();
		}
		else
		{
			var info:Knight = data as Knight;
			SetKnightInfo(info);
			SetEquipItems(info);
		}
	}
	
	public function get Data():Object
	{
		return data;
	}
	
	private function NullKnightData()
	{
		// First null all items 
		var tmpEquipItem:KnightInfoEquipItem = null; 
//		for (var i:int = 0; i < equipItemsScrollView.numUIObject; i++)
//		{ 
//			tmpEquipItem = equipItemsScrollView.getUIObjectAt(i) as KnightInfoEquipItem;
//			tmpEquipItem.Data = null; 
//		}
	}
	
	public function SetKnightInfo(info:Knight)
	{
		// Icon
		var curCityOrder:int = GameMain.instance().getCurCityOrder();
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		
		knightAvatar.useTile = true;
		knightAvatar.tile = iconSpt.GetTile(General.getGeneralTextureName(info.Name, curCityOrder));
		//knightAvatar.tile.name = General.getGeneralTextureName(info.Name, curCityOrder);
		//knightAvatar.mystyle.normal.background = TextureMgr.instance().LoadTexture(info.AvatarImage, TextureType.ICON_ITEM);
		
		// Name
		knightName.txt = General.singleton.getKnightShowName(info.Name, curCityOrder);
		
		// Property, maybe need calculate form gds?
		GearSysHelpUtils.SetKnightProp(knightPropLevel, ItemPropertyKind.Level, info.Level);
		this.SetData(info.IsHaveStar);
		knightPropLevel.txt = info.ShowerLevel;
		knightPropLevel.mystyle.normal.background = null;

		var attackVal:double = GearManager.Instance().GetShowKnightAttack(info);
		GearSysHelpUtils.SetKnightProp(knightPropAttack, ItemPropertyKind.Attack, attackVal); 

		var lifeVal:double = GearManager.Instance().GetShowKnightLife(info);
		GearSysHelpUtils.SetKnightProp(knightPropLife, ItemPropertyKind.Life, lifeVal);
		
		var troopLimit:int = GearManager.Instance().GetKnightTroop(info);
		GearSysHelpUtils.SetKnightProp(knightPropTroopLimit, ItemPropertyKind.TroopsLimit, troopLimit);
		
		SetKnightVolatiteProps(info);
		
		// Calculate the knight data
		var expLv:Array = General.instance().calcExpLvl(info.KnightID.ToString());
		var currExp:int = _Global.INT32(expLv[0]);
		var maxExp:int = _Global.INT32(expLv[2]);
		
		knightExpLabel.txt = currExp.ToString() + "/" + maxExp.ToString(); // exp and expMax
		
		var fExp:float = parseFloat(currExp);
		knightExpProgress.SetCurValue(fExp / maxExp);
	}
	
	private function SetKnightVolatiteProps(info:Knight)
	{
		// Volatite data
		GearSysHelpUtils.SetKnightProp(knightPropExtras[0], ItemPropertyKind.TroopsLimit, info.Level);
		GearSysHelpUtils.SetKnightProp(knightPropExtras[1], ItemPropertyKind.TroopsLimit, info.Level);
	}
	
	private function ShowKnightVolatiteProps(show:boolean)
	{
		if (null != knightPropExtras)
		{
			for (var i:int = 0; i < knightPropExtras.Length; i++)
			{
				knightPropExtras[i].SetVisible(show);
			}
		}
	}
	
	private function SetEquipItems(info:Knight)
	{
		if (info.Arms.Length == 0) return;
		
		var tmpEquipItem:KnightInfoEquipItem = null;
		
		
		prefabEquipItem.Data = GetKnightArmByIndex(info, 0);
		prefabEquipItem1.Data = GetKnightArmByIndex(info, 1);
		prefabEquipItem2.Data = GetKnightArmByIndex(info, 2);
		prefabEquipItem3.Data = GetKnightArmByIndex(info, 3);
		prefabEquipItem4.Data = GetKnightArmByIndex(info, 4);
		prefabEquipItem5.Data = GetKnightArmByIndex(info, 5);
				
/*		for (var i:int = 0; i < equipItemsScrollView.numUIObject; i++)
		{ 
			tmpEquipItem = equipItemsScrollView.getUIObjectAt(i) as KnightInfoEquipItem;
			tmpEquipItem.Data = GetKnightArmByIndex(info, i);
		}
*/	} 
	
	private function GetKnightArmByIndex(info:Knight, index:int):Arm
	{
		var result:Arm = null;
		switch (index)
		{
		case 0:  
			result = info.GetArm(Constant.ArmType.Ring);
			break;
		case 1:  
			result = info.GetArm(Constant.ArmType.Sword);
			break;
		case 2:  
			result = info.GetArm(Constant.ArmType.Shield);
			break;
		case 3:
			result = info.GetArm(Constant.ArmType.Helmet);
			break; 
		case 4: 
			result = info.GetArm(Constant.ArmType.Armer);
			break;
		case 5:  
			result = info.GetArm(Constant.ArmType.Pants);
			break;
		}
		
		return result;
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

	private function OnClickGotoExpBtn()
	{
		var knightId:int = GearData.Instance().CurrentKnight.KnightID;
		MenuMgr.getInstance().PushMenu("GenExpBoostMenu", {"kid":knightId}, "trans_zoomComp");	
	}
	
	// Update per frame
	private function Local2ScreenRect()
	{
		GUI.BeginGroup(super.rect);
		var minPoint:Vector2 = GUIUtility.GUIToScreenPoint(new Vector2(0, 0));
		GUI.EndGroup(); 
		
		screenAbsoluteRect.x = minPoint.x;
		screenAbsoluteRect.y = minPoint.y;
		screenAbsoluteRect.width = super.rect.width;
		screenAbsoluteRect.height = super.rect.height;
	}
	
	// Override ITouchable
	public function GetAbsoluteRect():Rect
	{
		// Convert to screen coordinate?
		return screenAbsoluteRect;
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
		return 10;
	}
	
	public function SetTouchableActiveFunction(activated:System.Action.<ITouchable>)
	{
		touchableActivated = activated;
	}
	
	public function SetReceiverActiveFunction(activated:System.Action.<GestureReceiver>)
	{
		receiverActivated = activated;
	}

	private function UpdateGestures()
	{	
		if (touchableActivated != null)
			touchableActivated(this); 
			
		if (receiverActivated != null)
			receiverActivated(this);
	}
	
	public function OnGesture(type:GestureManager.GestureEventType, touchables:List.<ITouchable>, t:Object)
	{  
	} 
	
	// private function OnGearTipsGesture()
	// {
	// 	if(gearTip.IsShowTip()) 
	// 	{
	// 		gearTip.CloseTip();
	// 	}	
	// } 
	
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
	
	
	public function OnPopOver()
	{
		this.prefabEquipItem.OnPopOver();
		this.prefabEquipItem1.OnPopOver();
		this.prefabEquipItem2.OnPopOver();
		this.prefabEquipItem3.OnPopOver();
		this.prefabEquipItem4.OnPopOver();
		this.prefabEquipItem5.OnPopOver();
		
		this.knightBackground.OnPopOver();
		this.underLineLabel.OnPopOver();
		this.knightAvatar.OnPopOver();
		this.knightName.OnPopOver();
		this.knightPropLevel.OnPopOver();
		
		this.knightPropAttack.OnPopOver();
		this.knightPropLife.OnPopOver();
		this.knightPropTroopLimit.OnPopOver();
		this.knightExpProgress.OnPopOver();
		this.knightExpLabel.OnPopOver();
		
		this.gotoExpBtn.OnPopOver();  
		UnregisterGesture();
		UIObject.TryDestroy(this);
	}
	
}