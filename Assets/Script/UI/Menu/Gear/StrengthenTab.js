#pragma strict
import GearLevelUpData;
public enum DragDropEvent
{
	Begin,
	Update,
	Canceled,
	Done,
	OnTarget,
} 

public class DragDropedObject
{
	var dragedItem:StrengthenItem = null;
	var beginRect:Rect; 
	var evt:DragDropEvent; 
	
	public static function InstantiateFrom(source:StrengthenItem):DragDropedObject
	{
		var resultObj:DragDropedObject = new DragDropedObject();
		resultObj.dragedItem = MonoBehaviour.Instantiate(source) as StrengthenItem; 
		resultObj.dragedItem.Init(); 
		resultObj.dragedItem.Data = source.Data;
		
		resultObj.dragedItem.rect = new Rect(source.GetAbsoluteRect());
		resultObj.beginRect = new Rect(source.GetAbsoluteRect());  
		
		resultObj.dragedItem.OnlyShowHammer();
		
		return resultObj;
	}
}

class StrengthenTab extends TabContentUIObject implements GestureReceiver,ITouchable
{
	//-------------------------------------------------
	public var prefabStrengthenItem:StrengthenItem;
	//-------------------------------------------------
	
	//-------------------------------------------------
	public var toastText:Label;
	public var hammerAnimLabel:Label;
	public var selectItemAnimLabel:Label;
	
	//-------------------------------------------------
	public var topBG:Label;
	public var nextLevel:Label;
	public var currProps:ItemSkillProperty[];
	
	public var maxLevelPrompt:Label;
	
	// increase 
	public var incProps:Label[];
	
	public var splitLineLabel:Label;
	
	//-------------------------------------
	public var strengthenItemIcon:Label;
	public var strengthenItemFireBG:Label;
	
	public var needItemEventBtn:Button;
	public var needItemIcon:Label;
	public var needItemCount:Label;
	public var needItemIconBG:Label;
	
	public var stoveBGLabel:Label;
	public var stoveLeftPlate:Label;
	public var stoveRightPlate:Label;
	public var stoveExterior:Label;
	
	public var stoveFireAnim0:Label;
	public var stoveFireAnim1:Label;
	public var stoveFireAnim2:Label;
	
	// Just use for Group clip, can not draw it
	public var stoveLeftRangeMask:Label;
	public var stoveRightRangeMask:Label;
	
	public var successRateBar:ProgressBar;
	public var successRateSlider:Label; 
	public var successRateLow:Label;
	public var successRateHigh:Label;
	
	public var strengthenItemsBG:Label;
	public var strengthenItemsView:ScrollView;
	public var succFailDialog:StrengthenSuccFail;
	
	//------------------------------------------------------------
	private var data:Arm = null;
	
	private var canDropedAbsRect:Rect; 
	private var dragDropedTargetAbsRect:Rect;
	private var needItemAbsRect:Rect;
	
	//------------------------------------------------------------
	private final var stovePlateMoveMax:float = 70.0f;
	private var stoveLeftPlateStartX:float = 0.0f;
	private var stoveRightPlateStartX:float = 0.0f;
	
	private final var hammerMiniTime:float = 1.5f;
	private final var hammerMaxiTime:float = 5.5f;
	private var hammerTimer:float = 0.0f;
	private var isHammerAniming:boolean = false;
	
	private final var protocolStateNone:int = 0;
	private final var protocolStateSended:int = 1;
	private final var protocolStateResponseOk:int = 2;
	private final var protocolStateResponseFail:int = 3;
	
	private var protocolState:int = protocolStateNone;
	private var protocolResult:HashObject = null; 
	
	private var currHammerItemId:int = -1; 
	private var hammerAnim:HammerProceduralAnim = null;
	
	//------------------------------------------------------------
	private var dragDropedHammer:DragDropedObject = null;
	private var needItemMirror:Label = null;
	
	//------------------------------------------------------------
	private var receiverActivated:System.Action.<GestureReceiver>; 
	private var centerArm:GearScrollViewItem;
	//------------------------------------------------------------
	
	private var selectHammerItem:StrengthenItem = null;
	
	//------------------------------------------------------------
	public override function Init()
	{
		super.Init();
		GearData.Instance().AddArmListener(this);
		InitLabel();
		RegisterGUIEvents();
		RegisterGesture();
		
		InitAbsoluteRect();
		InitTransition();
		
		InitItemsScrollView();
		InitStoveFireEffect();
		
		succFailDialog.Init();
		
		LocalizeWords();
		InitVariables();
		
		// Default settings
		toastText.SetVisible(false);
		toastText.SetFont(FontSize.Font_BEGIN);
		hammerAnimLabel.SetVisible(false);
		selectItemAnimLabel.SetVisible(false);
		
		// Default settings
		successRateBar.Init();
		successRateBar.SetCurValue(0.0f);
		successRateBar.mystyle.normal.background = TextureMgr.instance().LoadTexture("Success_rate", TextureType.GEAR);
		
		InitSkillButton();
		InitHelp();
		stoveLeftPlate.rect.x = stoveLeftPlateStartX;
		stoveRightPlate.rect.x = stoveRightPlateStartX;
	}
	
	private function InitLabel()
	{
		needItemIconBG.tile = TextureMgr.instance().GetGearIcon("Accelerant_panel");
		needItemIconBG.useTile = true;
		stoveBGLabel.tile = TextureMgr.instance().GetGearIcon("Stove");
		stoveBGLabel.useTile = true;
		stoveExterior.tile = TextureMgr.instance().GetGearIcon("Stove_exterior");
		stoveExterior.useTile = true;
		
		strengthenItemFireBG.tile = TextureMgr.instance().GetGearIcon("Stove_light");
		strengthenItemFireBG.useTile = true;
		
		successRateSlider.tile = TextureMgr.instance().GetGearIcon("Success_rate_cursors");
		successRateSlider.useTile = true;
		
		stoveRightPlate.setBackground("Stove_Door",TextureType.GEAR);
		stoveLeftPlate.setBackground("Stove_Door",TextureType.GEAR);
		selectItemAnimLabel.setBackground("city_background2",TextureType.BACKGROUND);
	}
	
	private function InitItemsScrollView()
	{  
		strengthenItemsBG.useTile = false;
		strengthenItemsBG.setBackground("tool bar_bottom",TextureType.BACKGROUND);
		
		// No need scroll now, just prepare
		strengthenItemsView.Init(); 
		strengthenItemsView.SetVisible(true);
		strengthenItemsView.AutoLayout();
		
		InitStrengthenItems();
	}
	
	private function InitStoveFireEffect()
	{
		stoveLeftRangeMask.SetVisible(false);
		stoveRightRangeMask.SetVisible(false);
		stoveFireAnim0.tile = TextureMgr.instance().GetGearSpt().GetTile(null);
		stoveFireAnim0.useTile = true;
		// 3 Fire animation
		var texAnim:TextureAnimation = TextureAnimation.StartAnim(stoveFireAnim0, true, "Fire", TextureType.GEAR, 7, null);
		texAnim.timePerFrame = 0.15f;
		
		stoveFireAnim1.tile = TextureMgr.instance().GetGearSpt().GetTile(null);
		stoveFireAnim1.useTile = true;
		texAnim = TextureAnimation.StartAnim(stoveFireAnim1, true, "Fire", TextureType.GEAR, 7, null);
		texAnim.timePerFrame = 0.15f;
		
		stoveFireAnim2.tile = TextureMgr.instance().GetGearSpt().GetTile(null);
		stoveFireAnim2.useTile = true;
		texAnim = TextureAnimation.StartAnim(stoveFireAnim2, true, "Fire", TextureType.GEAR, 7, null);
		texAnim.timePerFrame = 0.15f;
	}
	
	private function InitVariables()
	{ 
		data = null;  
		
		canDropedAbsRect = new Rect(0, 0, 1, 1);  
		dragDropedTargetAbsRect = new Rect(0, 0, 1, 1);  
		
		needItemAbsRect = new Rect(0, 0, 1, 1);  
		
		stoveLeftPlateStartX = 54.4f;
		stoveRightPlateStartX = 23.1f;
		
		hammerTimer = 0.0f;
		isHammerAniming = false;
		
		protocolState = protocolStateNone;
		protocolResult = null;
		
		currHammerItemId = -1;
		
		dragDropedHammer = null;
		needItemMirror = null;
		
		hammerAnim = null;
		selectHammerItem = null;
	}
	
	private function LocalizeWords()
	{
		successRateLow.txt = Datas.getArString("Gear.LowRate");
		successRateHigh.txt = Datas.getArString("Gear.MaxRate");
		
		maxLevelPrompt.SetFont(FontSize.Font_20);
		maxLevelPrompt.txt = Datas.getArString("Gear.EquipmentMaxLvPopDesc");
	}
	
	private function RegisterGUIEvents()
	{
		// Regist the click event
		needItemEventBtn.OnClick = OnClickNeedItemBtn;
	}
	
	private function RegisterGesture()
	{
		GestureManager.Instance().RegistReceiver(this);
		GestureManager.Instance().RegistTouchable(this);
	}
	
	private function UnregisterGesture()
	{
		GestureManager.Instance().RemoveReceiver(this);
	}
	
	public function Draw()
	{
		if (!super.visible)
			return; 
		
		UpdateGestures(); 
		
		DrawInterface(); 
		
		GUI.BeginGroup(super.rect);
		DrawOthers();
		GUI.EndGroup();
	    
	    if(canShowPanel)
	    	centerArm.Draw();
	    DrawTransition();	 
	    
		selectItemAnimLabel.Draw();
		toastText.Draw();
		succFailDialog.Draw();
		
	    if (null != dragDropedHammer && null != dragDropedHammer.dragedItem)
		{
			dragDropedHammer.dragedItem.Draw();
		}
		
		if (null != needItemMirror)
			needItemMirror.Draw();
		
		if (null != hammerAnim)
			hammerAnim.Draw();	
		DrawSkillButton();	
		DrawHelp();
	}   
	
	public function DrawOthers()
	{
		CalcCanDropedAbsRect();
		CalcDragDropedTargetAbsRect();
		CalcNeedItemAbsRect();
		
		topBG.Draw();
		nextLevel.Draw();
		
		if (null != currProps)
		{
			for (var i:int = 0; i < currProps.Length; i++)
			{
				currProps[i].Draw();
			}
		} 
		
		if (null != incProps)
		{
			for (var j:int = 0; j < incProps.Length; j++)
			{
				incProps[j].Draw();
			}
		}
		
		splitLineLabel.Draw();
		maxLevelPrompt.Draw();
		
		// Item background
		strengthenItemFireBG.Draw();
		
		// Note the draw order
		stoveBGLabel.Draw();
		stoveFireAnim0.Draw();
		stoveFireAnim1.Draw();
		stoveFireAnim2.Draw();
		
		// Need clip the stove plate
		GUI.BeginGroup(stoveLeftRangeMask.rect);
		stoveLeftPlate.Draw();
		GUI.EndGroup();
		
		GUI.BeginGroup(stoveRightRangeMask.rect);
		stoveRightPlate.Draw();
		GUI.EndGroup();
		
		stoveExterior.Draw();
		stoveLeftRangeMask.Draw();
		stoveRightRangeMask.Draw();
		
		// Item icons
//		strengthenItemIcon.Draw();
		
		needItemIconBG.Draw();
		needItemIcon.Draw();
		needItemEventBtn.Draw();
		needItemCount.Draw();
		
		successRateBar.Draw();
		// Specific scheme 
		if (!Mathf.Equals(successRateSlider.rect.x, successRateBar.thumb.rect.xMax - 0.5f * successRateSlider.rect.width))
		{ 
			successRateSlider.rect.x = successRateBar.thumb.rect.xMax - 0.5f * successRateSlider.rect.width;
		}
		// Note the draw order
		successRateLow.Draw(); 
		successRateHigh.Draw(); 
		successRateSlider.Draw(); 
		
		strengthenItemsBG.Draw();
		strengthenItemsView.Draw();
		// prefabStrengthenItem.Draw();
	} 
	
	public function Update()
	{
		strengthenItemsView.Update();
		
		UpdateTransition(); 
		centerArm.Update();  
		
		UpdateHammerAnim();
		UpdateSkillButton();
		UpdateHelp();
	}
	
	public override function OnClear()
	{ 
		ReleaseInstantiateItems();
		strengthenItemsView.clearUIObject();
		super.OnClear();
		GearData.Instance().RemoveArmListener(this);	
		UnregisterGesture();
	}
	
	public function UpdateData()
	{ 
	} 
	
	public function SetReceiverActiveFunction(activated:System.Action.<GestureReceiver>)
	{
		receiverActivated = activated;
	}

	private function UpdateGestures()
	{	
		if (receiverActivated != null)
			receiverActivated(this);
	}
	
	public function OnGesture(type:GestureManager.GestureEventType, touchables:List.<ITouchable>, time:Object)
	{
		if(MenuMgr.getInstance().Top() == null) return;
		if (MenuMgr.getInstance().Top().menuName != "ArmMenu") return;
		
		if (touchables == null) return;
		if (touchables.Count == 0) return;
		
		OnStrengthenItemGesture(type, touchables, time);
		
		// Not control the centerArm
		if (null != dragDropedHammer)
		{ 
			return;
		}
		
		// Control the centerArm
		for(var item:ITouchable in touchables)
		{
			var tab = item as StrengthenTab;
			if(tab == null) continue;
			
			if(type == GestureManager.GestureEventType.LongPress)
			{
				//Begin();
			}
			else if(type == GestureManager.GestureEventType.LongRelease)
			{
				//Finish();
			}
			else if(type == GestureManager.GestureEventType.LongMove)
			{
				//InputCurrent();
			}
			else if(type == GestureManager.GestureEventType.SlidePress)
			{
				Begin();
			}
			else if(type == GestureManager.GestureEventType.SlideMove)
			{
				InputCurrent();
			}
			else if(type == GestureManager.GestureEventType.SlideOver)
			{
				Finish();
			}
		}  
	}
	
	private function PlaySelectItemAnim()
	{
		selectItemAnimLabel.SetVisible(true);
		
		var anim:AlphaFlareAnim = AlphaFlareAnim.StartAnim(selectItemAnimLabel, -1, null);
		anim.UpperLimit = 0.8f;
	}
	
	private function StopSelectItemAnim()
	{
		selectItemAnimLabel.SetVisible(false);
		AlphaFlareAnim.StopAnim(selectItemAnimLabel, true);
	}
	
	private function PlayHammerAnim(hammerItemId:int, isMaxRateHammer:boolean)
	{ 
		hammerTimer = 0.0f;
		isHammerAniming = true; 
		
		hammerAnimLabel.SetVisible(true); 
		// TextureAnimation.StartAnim(hammerAnimLabel, true, "b_ani1", TextureType.BUILD_ANIMATION, 8, null);
		// TextureAnimation.StartAnim(hammerAnimLabel, true, null);
		
		SoundMgr.instance().PlayRelativeToGear(Constant.GearSoundName.Hammer);
		
		if (-1 != hammerItemId) {
			if (isMaxRateHammer) {
				GearSysHelpUtils.SetMyItemIcon(hammerAnimLabel, 5121);
			} else {
				GearSysHelpUtils.SetMyItemIcon(hammerAnimLabel, hammerItemId);
			}
		}
		hammerAnim = HammerProceduralAnim.StartAnim(hammerAnimLabel, true, null);
	}
	
	private function StopHammerAnim()
	{  
		hammerTimer = 0.0f;
		isHammerAniming = false; 
		
		hammerAnimLabel.SetVisible(false);
		// TextureAnimation.StopAnim(hammerAnimLabel, false);
		
		HammerProceduralAnim.StopAnim(hammerAnimLabel, true);
		hammerAnim = null;
	}
	
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
		
		BothwayExtendAnim.StartAnim(toastText, BothwayExtendAnim.ExtendStyle.UpDown, 1.2f, function()
		{
			TimeStayAnimation.StartAnim(toastText, 1.0f, function()
			{
				toastText.SetVisible(false);
			});
		});
	}
	
	public function OnSelect()
	{
		tipHelp.Begin();
		tipHelp2.Begin();
	
		this.UpdateData();
		Data = GearData.Instance().CurrentArm;
	}
	
	//======================================================================================================
	//transition
	public var forwardButton:Button;
	public var backwardButton:Button;
	private var transition:KnightTransition;
	private var canShowPanel:boolean;
	
	private function InitTransition()
	{
		transition = new KnightTransition();
		
		transition.OnTransitionFinish = OnFinish;
		canShowPanel = true;  
		transition.Init();
		forwardButton.OnClick = ForwardClick;
		backwardButton.OnClick = BackwardClick;
		forwardButton.alphaEnable = true;
		backwardButton.alphaEnable = true;
		forwardButton.alpha = 1.0f;
		backwardButton.alpha = 1.0f;
		forwardButton.setNorAndActBG("gear_button_flip_right_normal","gear_button_flip_right_down");
		backwardButton.setNorAndActBG("gear_button_flip_left_normal","gear_button_flip_left_down");
		
	} 
	
	private function Begin()
	{
		if (NewFteMgr.Instance().IsForbidMenuEvent)
		{
			return;
		}
		
		if (isHammerAniming) return;
		
		if(transition.IsTransiting ) return;
		var pre:Arm = GearData.Instance().PreviousArm;
		var next:Arm = GearData.Instance().NextArm;
		var current:Arm = GearData.Instance().CurrentArm;
		if(!transition.IsTransiting)
			canShowPanel = false; 
		transition.Begin(centerArm,[pre,current,next]);
	}

	   
	private function Finish()
	{
		transition.Finish();
	}
	private function Finish(destination:double)
	{
		transition.Finish(destination);
	}
	
	private function ForwardClick()
	{
		if(GearData.Instance().NextArm == null) return;
		Begin();
		Finish(1.0f);
	}
	private function BackwardClick()
	{
		if(GearData.Instance().PreviousArm == null) return;
		Begin();
		Finish(-1.0f);
	}
	private function TransitionOnArmChanged()
	{
		if( GearData.Instance().NextArm == null)
			forwardButton.alpha = 0.2f;
		else
			forwardButton.alpha = 1.0f;
			
		if( GearData.Instance().PreviousArm == null)
			backwardButton.alpha = 0.2f;
		else
			backwardButton.alpha = 1.0f;
		
	}
	
	private function OnFinish(side:int)
	{
		canShowPanel = true;
		if(side == -1) GearData.Instance().ShiftPreviousArm();
		if(side == 1) GearData.Instance().ShiftNextArm();	
	}
	   	   	    
	private function UpdateTransition()
	{
		transition.Update();
	}   	   
	
	private function DrawTransition()		     
	{
		transition.Draw();
		forwardButton.Draw();
		backwardButton.Draw();
		
	} 
	
	private function InputCurrent()
	{
		transition.InputCurrent();
	}
	//======================================================================================================
	//touchable interface 
	private var mAbsoluteRect:Rect; 
	private var mActivated:System.Action.<ITouchable>;
	
	private function InitAbsoluteRect()
	{
		mAbsoluteRect = new Rect(0,0,640,960 - strengthenItemsView.rect.height);
	}
	public function GetAbsoluteRect():Rect
	{ 
		return mAbsoluteRect;
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
	public function SetTouchableActiveFunction(Activated:System.Action.<ITouchable>)
	{
		mActivated = Activated;
	}

	private function DrawInterface()
	{	
		if(mActivated != null)
			mActivated(this); 
	}	
	
	public function OnCurrentArmChanged(o:Arm,n:Arm)
	{
		if(n == null) return;
		if(centerArm != null)
			centerArm.OnPopOver();
		centerArm = KBN.GearItems.Instance().CreateKnightArmItem(n);
		centerArm.WithinRect(new Rect(234.5,339,171,151));
		TransitionOnArmChanged();
		
		Data = GearData.Instance().CurrentArm;
	}
	 
	///-----------------------------------------------------------
	/// Move from StrengthenUnit 
	///-----------------------------------------------------------
	private function UpdateHammerAnim()
	{
		if (!isHammerAniming) return;
		
		hammerTimer += Time.deltaTime;
		if (protocolState != protocolStateResponseOk
			&& protocolState != protocolStateResponseFail
			)
		{
			if (hammerTimer >= hammerMaxiTime)
			{
				// Stop protocol sending logo
				protocolState =	protocolStateNone;
				
				StopHammerAnim();
			}
		}
		else
		{
			if (hammerTimer >= hammerMiniTime)
			{
				OnResponseServer();		
				StopHammerAnim();
			}
		}
	}
	
	public function OnStrengthenItemGesture(type:GestureManager.GestureEventType, touchables:List.<ITouchable>, time:Object)
	{
		// Get our care UIObject
		var currUIObj:StrengthenItem = null;
		for (var i:int = 0; i < touchables.Count; i++)
		{
			if (touchables[i] instanceof StrengthenItem)
			{
				currUIObj = touchables[i] as StrengthenItem;
				break;
			}
		}
		
		// Check is fte allow operate item
		var doingFte:NewFte = NewFteMgr.Instance().GetCurrentFte;
		if (doingFte && doingFte.CurrStep)
		{
			if ((doingFte.CurrStep.Action as GuideDragDropped))
			{
				var fteOpItem:UIObject = doingFte.CurrStep.Action.TraceUIObj;
				if ((type == GestureManager.GestureEventType.LongPress || type == GestureManager.GestureEventType.DoubleClicked) 
					&& fteOpItem != currUIObj)
				{
					return;
				}
			}
			else 
			{
				return;
			}
		}
		
		switch (type)
		{
		case GestureManager.GestureEventType.LongPress:
			OnLongPressed(currUIObj);
			break;
		case GestureManager.GestureEventType.LongMove:
			OnLongMoved(currUIObj);
			break;
		case GestureManager.GestureEventType.LongRelease:
			OnLongPressReleased(currUIObj);
			break;
		case GestureManager.GestureEventType.DoubleClicked:
			OnDoubleClicked(currUIObj);
			break;	
		default:
			break;
		}
	}
	
	private function OnLongPressed(uiObj:StrengthenItem)
	{
		if (uiObj == null) return;
		if (-1 == uiObj.GetHammerId()) return;
		
		OnDragDroppedBegin(uiObj);
	}
	
	private function OnLongMoved(uiObj:StrengthenItem)
	{ 
		if (null == dragDropedHammer || null == dragDropedHammer.dragedItem)
		{ 
			return;
		}
		
	 	if (null != dragDropedHammer 
	 		&& (dragDropedHammer.evt != DragDropEvent.Canceled || dragDropedHammer.evt != DragDropEvent.Done)
	 		)
	 	{   
			var v2:Vector2;
			v2 = Input.mousePosition; 
			v2 = _Global.TransCoordFromScrren(v2);
			
			var r:Rect = new Rect(dragDropedHammer.dragedItem.rect);
			r.x = v2.x;
			r.y = v2.y;
		
			dragDropedHammer.dragedItem.rect = _Global.CalculateLeftTopFromCenter(r); 
			dragDropedHammer.dragedItem.rect.y -= dragDropedHammer.dragedItem.rect.height * 0.5f;
			
	 		dragDropedHammer.evt = DragDropEvent.Update;
	 		OnDragDropEvents(dragDropedHammer);
	 	}
	}
	
	private function OnLongPressReleased(uiObj:StrengthenItem)
	{
		// Search the target UIObject is our need?
		if (null != dragDropedHammer)
		{
			if (null != data)
			{ 
				if (data.IsMaxLevel)
				{
					ShowToastText(Datas.getArString("Gear.MaxLvNoUpgrade"));
					dragDropedHammer.evt = DragDropEvent.Canceled;
				}
				else
				{
					var v2:Vector2 = Input.mousePosition; 
					v2 = _Global.TransCoordFromScrren(v2);
					
					var isTarget:boolean = canDropedAbsRect.Contains(v2);
					if (isTarget)
						dragDropedHammer.evt = DragDropEvent.Done;
					else
						dragDropedHammer.evt = DragDropEvent.Canceled;
				}
				OnDragDropEvents(dragDropedHammer);
			}
		}
	} 
	
	private function OnDoubleClicked(uiObj:StrengthenItem)
	{
		if (uiObj == null) return;
		if (-1 == uiObj.GetHammerId()) return;
		
		if (null != data)
		{ 
			if (data.IsMaxLevel)
			{
				ShowToastText(Datas.getArString("Gear.MaxLvNoUpgrade"));
				return;
			}
			
			ReleaseInstantiateItems();
			
			dragDropedHammer = DragDropedObject.InstantiateFrom(uiObj);
			dragDropedHammer.evt = DragDropEvent.Done;
		 	OnDragDropEvents(dragDropedHammer);
	 	
			// Play strike with a hammer
		}
	}
	
	private function CalcCanDropedAbsRect()
	{
		canDropedAbsRect.x = 0; 
		canDropedAbsRect.y = strengthenItemIcon.rect.y; 
		canDropedAbsRect.width = 640; 
		canDropedAbsRect.height = strengthenItemsView.rect.y - strengthenItemIcon.rect.y; 
		
		GUI.BeginGroup(canDropedAbsRect);
		var minPoint:Vector2 = GUIUtility.GUIToScreenPoint(new Vector2(0, 0)); 
		GUI.EndGroup();
		
		canDropedAbsRect.x = minPoint.x;
		canDropedAbsRect.y = minPoint.y;
	} 
	
	private function CalcDragDropedTargetAbsRect()
	{
		dragDropedTargetAbsRect = strengthenItemIcon.rect;  
		
		GUI.BeginGroup(dragDropedTargetAbsRect);
		var minPoint:Vector2 = GUIUtility.GUIToScreenPoint(new Vector2(0, 0));  
		GUI.EndGroup();
		
		dragDropedTargetAbsRect.x = minPoint.x;
		dragDropedTargetAbsRect.y = minPoint.y;
	} 
	
	private function CalcNeedItemAbsRect()
	{
		needItemAbsRect = needItemIcon.rect;  
		
		GUI.BeginGroup(needItemAbsRect);
		var minPoint:Vector2 = GUIUtility.GUIToScreenPoint(new Vector2(0, 0));  
		GUI.EndGroup();
		
		needItemAbsRect.x = minPoint.x;
		needItemAbsRect.y = minPoint.y;
	}
	
	private function OnDragDroppedBegin(uiObj:StrengthenItem)
	{
		if (null != dragDropedHammer)  return;
		
		dragDropedHammer = DragDropedObject.InstantiateFrom(uiObj); 
		dragDropedHammer.evt = DragDropEvent.Begin;
	 	OnDragDropEvents(dragDropedHammer);
	 	
	 	PlaySelectItemAnim();
	 	SetStrengthenSuccessRate(uiObj);
	}
	
	private function OnDragDropEvents(dragObj:DragDropedObject)
	{
		if (null == dragObj.dragedItem)
		{
			dragDropedHammer = null; 
			return;
		}
		
		// Begin Update Canceled Done
		switch (dragObj.evt)
		{
		case DragDropEvent.Begin:
			NewFteMgr.Instance().OnTraceDragDropBegin("dragedItem", dragObj);
		break;
		case DragDropEvent.Update:
		// Do nth.
		break;
		case DragDropEvent.Canceled:
			// Back to the original rect 
			StartLineAnimation(dragObj.dragedItem, dragObj.dragedItem.rect, dragObj.beginRect, function()
			{ 
				TryDestroy(dragObj.dragedItem); 
				dragDropedHammer = null;
			});
		break;
		case DragDropEvent.Done:
			// Do animation from current rect to real target rect  
			StartLineAnimation(dragObj.dragedItem, dragObj.dragedItem.rect, dragDropedTargetAbsRect, function()
			{ 
				NewFteMgr.Instance().OnTraceDragDropDone(dragObj.dragedItem, DragDropEvent.Done);
				
				var hammerItemId:int = dragObj.dragedItem.GetHammerId();
				var hammerCnt:int = MyItems.instance().countForItem(hammerItemId);
				var isMaxRageHammer:boolean = dragObj.dragedItem.IsMaxLevelUpRate();
				if (!dragObj.dragedItem.IsCanUse())
				{
					ShowToastText(Datas.getArString("Gear.TipsOfNoHammer"));
				}
				else
				{
					var itemUniqueId:int = data.PlayerID;
					var costGems:int = dragObj.dragedItem.GetCostGems();
					
					if (Payment.instance().CheckGems(costGems)) 
					{
						var needItemId:int = dragObj.dragedItem.GetNeedItemId();
						var needItemCnt:int = dragObj.dragedItem.GetNeedItemCount();
						var needItemCurrCnt:int = MyItems.instance().countForItem(needItemId);
						var costItemCnt:int = 0;
						if(needItemCurrCnt<=0)
						{
							costItemCnt = 0;
						}
						else if(needItemCurrCnt <= needItemCnt)
						{
							costItemCnt = needItemCurrCnt;
						}
						else
						{
							costItemCnt = needItemCnt;
						}
						var costHammerCnt:int = MyItems.instance().countForItem(hammerItemId)>0 ? 1:0;
						UnityNetReqStrengthen(itemUniqueId, hammerItemId,costHammerCnt,needItemId,costItemCnt, costGems);
						PlayHammerAnim(hammerItemId, isMaxRageHammer);
					}
				}
				
				TryDestroy(dragObj.dragedItem); 
				dragDropedHammer = null;
			});
			
			needItemMirror = InstantiateNeedItemMirror();
			StartLineAnimation(needItemMirror, needItemMirror.rect, dragDropedTargetAbsRect, function()
			{ 
				TryDestroy(needItemMirror);
				needItemMirror = null;
			});
		break;
		}
	}
	
	private function InstantiateNeedItemMirror():Label
	{
		// Fly need item mirror
		var result:Label = Instantiate(needItemIcon) as Label; 
		var needItemId:int = GetNeedItemId(data);
		if (-1 == needItemId)
			GearSysHelpUtils.SetEquipItemIcon(needItemIcon, null);
		else
			GearSysHelpUtils.SetMyItemIcon(result, needItemId);
		
		result.rect = new Rect(needItemAbsRect);
		
		return result;
	}
	
	private function StartLineAnimation(uiObj:UIObject, start:Rect, end:Rect, endDel:System.Action)
	{
		var s:double = 0.0f;
		var v:double = 1.8f;
		var a:double = -1.45f;
	
		GUIAnimationManager.Instance().CreateLineAnimation(endDel, start, end, uiObj, s, v, a);
	}
	
	private function ReleaseInstantiateItems()
	{
		if (null != needItemMirror)
		{
			TryDestroy(needItemMirror);
		}
		needItemMirror = null;
		
		if (null != dragDropedHammer && null != dragDropedHammer.dragedItem) 
		{
			TryDestroy(dragDropedHammer.dragedItem);
		}
		dragDropedHammer = null;
	}
	
	// Set current arm data
	public function SetRowData(data:Object)
	{
		Data = data;
	}
	
	public function set Data(value:Object)
	{
		if (null == value) return;
		
		data = value;
		SetItemData(data); 
		
		UpdateMyStrengthenItems(GetNeedItemId(data), GetNeedItemCount(data));
	} 
	
	public function UpdateItemData()
	{
		SetNeedItemData(data);
		UpdateMyStrengthenItems(GetNeedItemId(data), GetNeedItemCount(data));
	}
	
	private function SetItemData(data:Arm)
	{
		// maxLevelPrompt.SetVisible(true);
		maxLevelPrompt.SetVisible(data.IsMaxLevel);
		if (data.IsMaxLevel)
		{
			nextLevel.txt = Datas.getArString("Gear.EquipmentMaxLvDesc");
		}
		else
		{
			nextLevel.txt = Datas.getArString("Gear.EquipmentNextLvDesc") + ":" + (data.SkillLevel + 1).ToString();
		}
		
		SetItemProps(data);
		SetItemIncreaseProps(data);
		
		GearSysHelpUtils.SetEquipItemIcon(strengthenItemIcon, data);
		SetNeedItemData(data); 
	}
	
	private function OnClickNeedItemBtn()
	{
		if (null == data || data.IsMaxLevel) return;
		
		var needItemId:int = GetNeedItemId(data);
		if (-1 == needItemId) return;
		
		var data:Object = {"data":needItemId};
		MenuMgr.getInstance().PushMenu("StrengthenMatMenu", data, "trans_zoomComp");
	}
	
	private function SetItemProps(data:Arm)
	{
		if (null == currProps)
			return;
		
		// Null it first
		var i:int = 0;
		for (i = 0; i < currProps.Length; i++)
		{
			currProps[i].ArmData = null;
			currProps[i].Data = null;
		}
			
		if (null != data)
		{
			i = 0;
			for (var keyVal:KeyValuePair.<int, ArmSkill> in data.ArmSkills)
			{ 
				if (i >= currProps.Length)
					break;
				
				currProps[i].ArmData = data;	
				currProps[i].Data = keyVal.Value;
				currProps[i].SetPropLabelLight(i < data.StarLevel);
				
				i++;
			}
		}
	}
	
	private function SetItemIncreaseProps(data:Arm)
	{
		if (null == incProps)
			return;
		
		if (null != data)
		{
			var hasMaxLvl:boolean = data.IsMaxLevel;
			
			var i:int = 0;
			for (var keyVal:KeyValuePair.<int, ArmSkill> in data.ArmSkills)
			{ 
				if (i >= incProps.Length)
					break;
				
				incProps[i].SetNormalTxtColor(FontColor.Pure_Green);
				if (hasMaxLvl)
				{
					incProps[i].txt = "";
					GearSysHelpUtils.SetLabelTexture(incProps[i], null);	
				}
				else
				{
					var currLvlVal:int = GameMain.GdsManager.GetGds.<KBN.GDS_GearSkill>().GetLevelData(keyVal.Value.ID, data.SkillLevel);
					var nextLvlVal:int = GameMain.GdsManager.GetGds.<KBN.GDS_GearSkill>().GetLevelData(keyVal.Value.ID, data.SkillLevel + 1);
					
					var isPercent:boolean = GearManager.Instance().IsPercent(keyVal.Value.ID);
					
					var diffVal:int = nextLvlVal - currLvlVal;
					var disText:String = "";
					if (isPercent)
						disText = (diffVal / GearSysHelpUtils.DividendFactor).ToString("P2", System.Globalization.CultureInfo.InvariantCulture);
					else
					{
						disText = (diffVal).ToString();
					}
					
					var szColFormat:String = "<color={0}>+{1}</color>";
					var col = Constant.ColorValue.ToHTMLHexString(143, 195, 31); 
					
					incProps[i].txt = String.Format(szColFormat, col, disText);
					GearSysHelpUtils.ChangeLabelToTile(incProps[i], GearSysHelpUtils.ImageArrowRise);
				}
				
				if (keyVal.Value.ID == Constant.Gear.NullSkillID)
				{
					incProps[i].txt = "";
					GearSysHelpUtils.SetLabelTexture(incProps[i], null);
				}
				
				i++;
			}
		}
	}
	
	private function SetNeedItemData(data:Arm)
	{
		if (null == data) return;
		
		if (data.IsMaxLevel)
		{
			needItemIcon.SetVisible(false); 
			needItemCount.SetVisible(false);  
			
			return;
		}
		else
		{ 
			needItemIcon.SetVisible(true); 
			needItemCount.SetVisible(true); 
			
			// Get static data from GDS
			var armLvlData:KBN.DataTable.GearLevelUp = GameMain.GdsManager.GetGds.<KBN.GDS_GearLevelUp>().GetArmLevelData(data.GDSID, data.SkillLevel + 1); 
			if (null == armLvlData) return;
			
			var needItemId:int = armLvlData.BaseItem;
			var needCnt:int = armLvlData.BaseItemCount;
			var hasCnt:int = MyItems.instance().countForItem(needItemId);
			
			var szFormat:String = "{0}/{1}";
			if (hasCnt >= needCnt)
			{
				needItemCount.txt = String.Format(szFormat, hasCnt, needCnt);
			}
			else
			{
				// Add red highlight
				szFormat = "<color={0}>{1}</color>/{2}";
				needItemCount.txt = String.Format(szFormat, "#ef1639FF", hasCnt, needCnt);
			}
			
			GearSysHelpUtils.SetMyItemIcon(needItemIcon, needItemId);
		}
	}
	
	private function HasEnoughNeedItems(data:Arm):boolean
	{
		var armLvlData:KBN.DataTable.GearLevelUp = GameMain.GdsManager.GetGds.<KBN.GDS_GearLevelUp>().GetArmLevelData(data.GDSID, data.SkillLevel + 1); 
		if (null == armLvlData) return false;
		
		var needItemId:int = armLvlData.BaseItem;
		var needItemCnt:int = armLvlData.BaseItemCount;
		
		var needItemHasCnt:int = MyItems.instance().countForItem(needItemId);
		if (needItemHasCnt < needItemCnt) // Not enough item
		{
			return false;
		}
		
		return true;
	}
	
	private function GetNeedItemId(data:Arm):int
	{
		if (null == data) return -1;
		
		var armLvlData:KBN.DataTable.GearLevelUp = GameMain.GdsManager.GetGds.<KBN.GDS_GearLevelUp>().GetArmLevelData(data.GDSID, data.SkillLevel + 1); 
		if (null == armLvlData) return -1;
		
		var needItemId:int = armLvlData.BaseItem;
		return needItemId;
	}
	
	private function GetNeedItemCount(data:Arm):int
	{
		if (null == data) return -1;
		
		var armLvlData:KBN.DataTable.GearLevelUp = GameMain.GdsManager.GetGds.<KBN.GDS_GearLevelUp>().GetArmLevelData(data.GDSID, data.SkillLevel + 1); 
		if (null == armLvlData) return -1;
		
		var needItemCnt:int = armLvlData.BaseItemCount;
		return needItemCnt;
	}
	
	private function SubtractNeedItem(data:Arm)
	{
		var armLvlData:KBN.DataTable.GearLevelUp = GameMain.GdsManager.GetGds.<KBN.GDS_GearLevelUp>().GetArmLevelData(data.GDSID, data.SkillLevel + 1); 
		if (null == armLvlData) return;
		
		var needItemId:int = armLvlData.BaseItem;
		var needItemCnt:int = armLvlData.BaseItemCount;
		
		if (-1 != needItemId)
			MyItems.instance().subtractItem(needItemId, needItemCnt);
	}
	
	private function InitStrengthenItems()
	{
		strengthenItemsView.clearUIObject();
		
		var tmpListItem:StrengthenItem = null;
		var strengthenItemIds:int[] = GearSysHelpUtils.getStrengthenItemIds();
		for (var i:int = 0; i < strengthenItemIds.Length; i++)
		{
			var dataArray:Array = new Array();
			dataArray[0] = strengthenItemIds[i];
			dataArray[1] = -1;
			dataArray[2] = -1;
			dataArray[3] = -1;
			
			tmpListItem = PrivateChatSheet.AddListItem(strengthenItemsView, 10, dataArray, prefabStrengthenItem) as StrengthenItem;
			tmpListItem.SetOnClickDelegate(OnClickStrengthenItem); 
		}
		
		strengthenItemsView.AutoLayout();
	}
	
	private function UpdateMyStrengthenItems(needItemId:int, needItemCnt:int)
	{  
		var tmpListItem:StrengthenItem = null; 
		var strengthenItemIds:int[] = GearSysHelpUtils.getStrengthenItemIds();
		for (var i:int = 0; i < strengthenItemIds.Length - 1; i++)
		{ 
			tmpListItem = strengthenItemsView.getUIObjectAt(i) as StrengthenItem;
			tmpListItem.UpdateItemDatas(needItemId, needItemCnt);
		}
		
		tmpListItem = strengthenItemsView.getUIObjectAt(strengthenItemIds.Length - 1) as StrengthenItem;
		
		// find least level master hammer available
		var itemIds:int[] = [];
		var itemId:int = -1;
		var itemCount:int = 0;
		var itemLevel:int = -1;
		var maxLevel:int = GameMain.GdsManager.GetGds.<KBN.GDS_GearLevelUp>().GetArmMaxLevel(data.GDSID);
		for (i = data.SkillLevel; i <= maxLevel; i++)
		{
			itemIds = GearSysHelpUtils.getChaseHammerIdsForLevel(i);
			for (var j:int = 0; j < itemIds.length; j++)
			{
				itemId = itemIds[j];
				if (-1 == itemId)
					continue;
				itemCount = MyItems.instance().countForItem(itemId);
				if (itemCount > 0)
				{
					itemLevel = i;
					break;
				}
			}
			
			if (-1 != itemLevel)
			{
				break;
			}
		}
			
			
		var dataArray:Array = new Array();
		dataArray[0] = (itemCount > 0 && !data.IsMaxLevel) ? itemId : -1;
		dataArray[1] = needItemId;
		dataArray[2] = needItemCnt;
		dataArray[3] = -1;
		dataArray[4] = 1;
		dataArray[5] = itemLevel;
		tmpListItem.SetRowData(dataArray);
		tmpListItem.SetOnClickDelegate(OnClickStrengthenItem);
		
	}
	
	private function OnClickStrengthenItem(clickParam:Object)
	{
		PlaySelectItemAnim();
		
		var uiObj:StrengthenItem = clickParam as StrengthenItem;
		if (null != selectHammerItem)
		{
			selectHammerItem.Darken();
		}
		selectHammerItem = uiObj;
		selectHammerItem.Hilighten();
		
		SetStrengthenSuccessRate(uiObj);
	}
	
	private function SetStrengthenSuccessRate(uiObj:StrengthenItem)
	{
		var itemId:int = uiObj.GetHammerId(); 
		// Calculate the success rate
		if (null == data || data.IsMaxLevel) 
		{
			successRateBar.SetCurValue(0.0f);
			return;
		}
		
		var startVal:float = successRateBar.GetCurValue();
		var endVal:float = startVal;
		
		var val:int = GameMain.GdsManager.GetGds.<KBN.GDS_GearLevelUp>().GetItemShowRate(data.GDSID, data.SkillLevel + 1,itemId);
		endVal = val / GearSysHelpUtils.DividendFactor;
		
		if (uiObj.IsMaxLevelUpRate()) endVal = 1.0f;
		
		if (Mathf.Abs(startVal - endVal) < 0.001f)
			return;
		
		AdvancedValueAnim.StartAnim(successRateBar, startVal, endVal, function(currVal:float)
		{
			successRateBar.SetCurValue(currVal);	
		}, function() // End function delegate
		{
			successRateBar.SetCurValue(endVal);
		});
		
		// Play stove animation
		var moveStart:float = stovePlateMoveMax * startVal;
		var moveEnd:float = stovePlateMoveMax * endVal;
		AdvancedValueAnim.StartAnim(stoveLeftPlate, moveStart, moveEnd, function(currMoveVal:float)
		{
			stoveLeftPlate.rect.x = stoveLeftPlateStartX - currMoveVal;
			stoveRightPlate.rect.x = stoveRightPlateStartX + currMoveVal;
		}, function() // End function delegate
		{
			stoveLeftPlate.rect.x = stoveLeftPlateStartX - moveEnd;
			stoveRightPlate.rect.x = stoveRightPlateStartX + moveEnd;
		});
	}

	private function UnityNetReqStrengthen(strengthenItemUniqId:int, hammerItemId:int, costHammerCnt:int, costItemId:int, costItemCnt:int, costGems:int)
	{ 
		var reqParams:Hashtable = new Hashtable(); 
		reqParams.Add("uniqId", strengthenItemUniqId);
		reqParams.Add("hammerItemId", hammerItemId);  
		reqParams.Add("costHammerCnt", costHammerCnt);
		reqParams.Add("costItemId", costItemId);
		reqParams.Add("costItemCnt", costItemCnt);
		reqParams.Add("gems", costGems);
		protocolState = protocolStateSended;
		currHammerItemId = hammerItemId;
		_Global.Log("UnityNetReqStrengthen");
		
		UnityNet.ReqGearStrengthen(reqParams, ReqStrengthenOk, ReqStrengthenError);
	}
	
	// UnityNetReqStrengthen callback
	private function ReqStrengthenOk(result:HashObject)
	{
		protocolState = protocolStateResponseOk;
		protocolResult = result;
        DailyQuestHelper.CheckForgeGearProgress(result);
	}
	
	// UnityNetReqStrengthen callback
	private function ReqStrengthenError(msg:String, errorCode:String)
	{
		_Global.Log("ReqStrengthenError.errorCode:" + errorCode + " and errorMsg:" + msg);
		
		protocolState = protocolStateResponseFail;
		protocolResult = new HashObject( {"ok":false, "errorCode":errorCode, "errorMsg":msg} );
		
		if(errorCode.Equals("UNKNOWN"))
			return;
	}
	
	private function OnResponseServer()
	{
		if (protocolState == protocolStateResponseOk)
		{	
			//subtract item and gems
			var costGems = _Global.INT32(protocolResult["costGems"]); 
			if (costGems > 0)
			{ 
				var isReal:boolean = protocolResult["isWorldGem"] ? protocolResult["isWorldGem"].Value == false : true;
				Payment.instance().SubtractGems(costGems, isReal);
			}
			if(protocolResult["costHammerCnt"] != null)
			{
				var costHammerId:int = _Global.INT32(protocolResult["hammerItemId"]);
				var costHammerCnt:int = _Global.INT32(protocolResult["costHammerCnt"]);
				if(costHammerCnt > 0)
				{
					MyItems.instance().subtractItem(currHammerItemId,costHammerCnt);
				}
			}
			if(protocolResult["costItemCnt"] != null)
			{
				var costItemId:int = _Global.INT32(protocolResult["costItemId"]);
				var costItemCnt:int = _Global.INT32(protocolResult["costItemCnt"]);
				if(costItemCnt > 0)
				{
					MyItems.instance().subtractItem(costItemId,costItemCnt);
				}
			}
			
			
			var currLevel:int = data.SkillLevel;
			data.SkillLevel = _Global.INT32(protocolResult["currentLevel"]);
			
			// Setting the arm data
			Data = data;
			
			var might:int = 0;
			if (currLevel == data.SkillLevel)
			{
				might = GameMain.GdsManager.GetGds.<KBN.GDS_GearLevelUp>().GetStrengthenMight(data.GDSID, data.SkillLevel + 1, false);
				var mightString:String = Datas.getArString("Common.Might") + "+" + might.ToString();
				ShowToastText(Datas.getArString("Gear.LvUpFailPopTitle") + " " + mightString);
				
				SoundMgr.instance().PlayRelativeToGear(Constant.GearSoundName.LevelUpGearFail);	
			}
			else
			{
				might = GameMain.GdsManager.GetGds.<KBN.GDS_GearLevelUp>().GetStrengthenMight(data.GDSID, data.SkillLevel, true);
				succFailDialog.SetMight(might);
				succFailDialog.SetSuccessOrFail(true);
			}
			
			GameMain.instance().seedUpdate(false);
		}
		else if (protocolState == protocolStateResponseFail)
		{  
			// Show the error msg?
			// protocolResult = new HashObject( {"ok":false, "errorCode":errorCode, "errorMsg":msg} );
			ShowToastText(Datas.getArString("Gear.LvUpFailPopTitle"));
		}
			
		protocolState =	protocolStateNone;	
		protocolResult = null;
		currHammerItemId = -1; 
		
		if (null != selectHammerItem)
		{
			selectHammerItem.Darken();
		}
		selectHammerItem = null;
		StopSelectItemAnim();
	}
	//======================================================================================================
	//skill information
	public var skillButton:Button;
	private function InitSkillButton()
	{
		skillButton.Init();
		skillButton.OnClick = OnSkillButtonClick;
		skillButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_i",TextureType.DECORATION);
		skillButton.SetName("skillbutton");
		skillButton.SetZOrder(1000);
		skillButton.TouchRect = new Rect(skillButton.rect.x - 15,skillButton.rect.y - 15, skillButton.rect.width + 30, skillButton.rect.height + 30);
		GestureManager.Instance().RegistTouchable(skillButton);
	}
	private function OnSkillButtonClick()
	{
		MenuMgr.getInstance().PushMenu("SkillInformationMenu", SkillInformationMenu.MenuType.Strenthen, "trans_horiz" );
	}
	
	private function UpdateSkillButton()
	{
		skillButton.Update();
	}
	
	private function DrawSkillButton()
	{
		skillButton.Draw();
	}	
	//======================================================================================================
	//help
	public var tipHelp:FlashLabel;
	public var tipHelp2:FlashLabel;
	
	private function InitHelp()
	{
		tipHelp.Init();
		
		tipHelp.From = 0.0f;
		tipHelp.To = 1.0f;
		tipHelp.Times = 1;
		tipHelp.Accelerate = Mathf.PI / 16;
		tipHelp.txt = Datas.getArString("Gear.HelpForge");
		tipHelp.alphaEnable = true;
		tipHelp.alpha = 0.0f;
		
		tipHelp2.Init();
		
		tipHelp2.From = 1.0f;
		tipHelp2.To = 1.0f;
		tipHelp2.Times = 0;
		tipHelp2.Accelerate = Mathf.PI / 16;
		tipHelp2.txt = Datas.getArString("Gear.UpgradeTip");
		tipHelp2.SetVisible(true);		 
		
		
		
	}
	private function UpdateHelp()
	{
		tipHelp.Update();
		tipHelp2.Update();
	}
	private function DrawHelp()
	{
		tipHelp.Draw();
		tipHelp2.Draw();
	}
	
}