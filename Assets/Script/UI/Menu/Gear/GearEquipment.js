
import System.Collections.Generic;


public class GearEquipment extends TabContentUIObject implements GestureReceiver,ITouchable
{
	//======================================================================================================
	//field


	public  var armDrawLabels:Label[];
	
	
	public var panel:KnightPanel;
	public var photoFrame:Label;
	public var flowerLeftBottom:Label;
	public var flowerRightTop:Label;
	public var logoImg:Label;
	private var m_rotate:Rotate;
	public var scrollBackground:Label;
	public var cannotEquipTips:InfoTipsBar;
	public var shareButton:Button;
	
	private var timmer:float=2;
	public var screenShortRect:Rect =new Rect(60,140,500,580);
	//======================================================================================================
	
	enum CantEquipCondition{
		KNIGHT_OUTSIDE,
		KNIGHT_LV_NOT_MET,
		CANNOT_MOUNT
	}
	//initialization
	public var KnightArmDestinations:Rect[];
	public function Init()
	{ 
		putLineAnimation = null;
		removeLineAnimation = null;
		
		InitScrollBackground();
		InitSequenceButton(); 
	
		InitButton(); 
		InitWeaponsView(); 
		InitArcControl();
		
		InitPanel();
		InitTip();
		InitAbsoluteRect();
		InitData();
		InitTransition();
		InitNet();
		InitFlash();
		InitSkillButton();
		InitShareButton();
		InitPhotoFrames();
		InitOcupied();
		InitBackForwardButton();
		
		GestureManager.Instance().RegistTouchable(arcSelectControl);
		GestureManager.Instance().RegistReceiver(this);
		GestureManager.Instance().RegistTouchable(this);
		GestureManager.Instance().RegistTouchable(weaponsView);
		GestureManager.Instance().RegistTouchable(ocupied);
				
		InitHelp();		
		InitTimer();		
		isAnimated = false;
		InitTest();	
			
	}
	
	private function InitScrollBackground()
	{
		
		scrollBackground.useTile = false;
		scrollBackground.setBackground("tool bar_bottom",TextureType.BACKGROUND);
		scrollBackground.Init();
	}
	
	private function InitPanel()
	{
		panel.Init();
		panel.KnightArmDestinations = KnightArmDestinations;
	}
	
	private function InitPhotoFrames()
	{
		photoFrame.Init();
		photoFrame.setBackground("double_deck",TextureType.DECORATION);
		flowerLeftBottom.Init();
		flowerLeftBottom.setBackground("corner_pattern",TextureType.DECORATION);
		flowerRightTop.Init();
		flowerRightTop.setBackground("corner_pattern",TextureType.DECORATION);
		m_rotate = new Rotate();
		m_rotate.init(flowerRightTop,EffectConstant.RotateType.ROTATE_INSTANT,Rotate.RotateDirection.CLOCKWISE,0,180);
		m_rotate.playEffect();
	}

	private function InitTest()
	{
		
	}
	
	
	
	
	private function InitButton()
	{
		forwardButton.Init();
		backwardButton.Init();
		forwardButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("gear_button_flip_right_normal",TextureType.BUTTON);
		forwardButton.mystyle.active.background = TextureMgr.instance().LoadTexture("gear_button_flip_right_down",TextureType.BUTTON);
		backwardButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("gear_button_flip_left_normal",TextureType.BUTTON);
		backwardButton.mystyle.active.background = TextureMgr.instance().LoadTexture("gear_button_flip_left_down",TextureType.BUTTON);
		backwardButton.SetZOrder(10);
		backwardButton.SetName("backwardButton");
		forwardButton.SetZOrder(10);
		forwardButton.SetName("forwardButton");
		forwardButton.OnClick = ForwardClick;
		backwardButton.OnClick = BackwardClick;
		forwardButton.alphaEnable = true;
		backwardButton.alphaEnable = true;
		forwardButton.alpha = 1.0f;
		backwardButton.alpha = 1.0f;
				
		forwardButton.TouchRect = new Rect(forwardButton.rect.x,forwardButton.rect.y,forwardButton.rect.width ,forwardButton.rect.height);
		backwardButton.TouchRect = new Rect(backwardButton.rect.x,backwardButton.rect.y,backwardButton.rect.width ,backwardButton.rect.height);
	}
	
	private function OnBackForward(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		if(item == null) return; 
		if(type == GestureManager.GestureEventType.Clicked)
		{
			if(item.GetName() == "backwardButton")
			{
				BackwardClick();
			} 
			else if(item.GetName() == "forwardButton")
			{
				ForwardClick();
			}
		}
	}
	
	//======================================================================================================
	//update
	public function Update()
	{
		UpdateArcSelect();
		if(mDragedItem == null)
			weaponsView.Update();
		UpdateTransition();
		UpdateNet(); 
		UpdateFlash();
		UpdateSkillButton();
		panel.Update();
		UpdateEventTime();
		cannotEquipTips.Update();
		UpdateTimer();
		UpdateBackForwardButton();
		UpdateHelp();
		if(timmer < 1){
			timmer+=Time.deltaTime;
		}
		
	}
	//======================================================================================================
	//tip	
	public var tip:GearInformationTip; 
	private var gearTip:GearArmTip;
	private var tipItem:GearScrollViewItem;
	
	private function InitTip()
	{
		gearTip = new GearArmTip();
		gearTip.tip = tip;
		gearTip.Init();
		tipItem = null;
		cannotEquipTips.Init();
		cannotEquipTips.setInfoContent(Datas.getArString("Gear.KnightsOutside"));
	
	}
	
	private function DrawTip()
	{
		if(timmer >= 1){
			forwardButton.Draw();
			backwardButton.Draw();
		}
		
		gearTip.Draw();
		cannotEquipTips.Draw();
	}
	private function ShowTip(item:GearScrollViewItem)
	{
		if (NewFteMgr.Instance().IsDoingFte)
		{
			return;
		}
		
		gearTip.SetIsShowCompare(true);
		gearTip.ShowTip(item.TheArm);
		
		tipItem = item;
		tipItem.Hilighten();
		showItem = item;
	}
	private function HideTip():boolean
	{
		var isHide:boolean = false;
		if(gearTip.IsShowTip()) 
		{ 
			gearTip.CloseTip();
			if(tipItem != null)
				tipItem.Darken();

			showItem = null;
			isHide = true;
		} 
		if(cannotEquipTips.IsShow())
		{ 
			cannotEquipTips.Hide();
			isHide = true;
		} 
		return isHide;		
	}
	//======================================================================================================
	//draw
	

	public function Draw()
	{ 
		
		DrawPhotoFrames();
		scrollBackground.Draw();
		if(timmer >= 1){
			DrawSkillButton();
			shareButton.Draw();
		}
		
		panel.Draw();
		DrawArcSelect();
		
		weaponsView.Draw();
		
		DrawSequenceButton();
		DrawInterface();
		DrawTransition();
		
		DrawOcupied();
		
		
		DrawFlash();
		DrawDragedItem();
		DrawTip();
		
		DrawBackForwardButton();
		if(timmer >= 1){
			DrawHelp();
		}else
			logoImg.Draw();
	 
	} 
	//======================================================================================================
	//arcselect control
	private var armSelect:GearArmSelect;
	public var arcSelectControl:ArcSelectControl;
	
	private function InitArcControl()
	{	
		armSelect = new GearArmSelect();
		armSelect.arcSelectControl = arcSelectControl;
		armSelect.weaponsView = weaponsView; 
		armSelect.sortFunction = armSort.SortFunction;
		armSelect.OnSelect = OnArmSelect;
		armSelect.ArmsType = GearArmSelect.ArmsState.NotArmed;
		armSelect.ShowRedRect = true;
		armSelect.Init();
		
		
	}
	private function OnArmSelect(index:int)
	{
		Hilighten();
	}
	private function UpdateArcSelect()
	{
		armSelect.Update();
	}
	
	private function DrawArcSelect()
	{
		if(mDragedItem != null)
			armSelect.DisableInput = true;	
		else
			armSelect.DisableInput = false;
		armSelect.Draw();
	}
	
	//======================================================================================================
	//knight
/*	private var knightSequence:int[];
	private var currentKnightIndex:int;
*/	
	private function InitData()
	{
		GearData.Instance().AddKnightListener(this);
	}
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		//armSelect.SetArmType(Constant.ArmType.All);
		OnSelect();
//		screenShortRect =new Rect(60,140,500,580);
		if(KBN._Global.isIphoneX()) {
			screenShortRect =new Rect(60,160,500,580);
		}else{
			screenShortRect =new Rect(60,140,500,580);
		}
		
	}
	private function SetCurrentIndex(index:int) :boolean
	{   
		GearData.Instance().SetCurrentIndex(index);
	}
	public function OnInActive()
	{
		HideTip();
		armSelect.Stop();
		
	}
	
	
	
	public function OnCurrentKnightChanged(o:Knight,n:Knight)
	{
//		if(o != null)
//			Save(o);
	
		if( n != null ) 
		{
			panel.TheKnight = n;
		}
		SetMenuTitle();
		TransitionOnKnightChanged();
		ScrollOnCurrentKnightChanged(n);
	}
	
	private function ScrollOnCurrentKnightChanged(knight:Knight)
	{
		if(knight == null) return;
		armSelect.UpdateCurrent();
	}
	
	
	
	

	private function get CurrentKnight():Knight
	{
		return GearData.Instance().CurrentKnight;
	} 



	private function SetMenuTitle()
	{
		if(OnSetTitle != null && CurrentKnight != null) 
			OnSetTitle(General.singleton.getKnightShowName(CurrentKnight.Name,GameMain.instance().getCityOrderWithCityId(CurrentKnight.CityID)));		
	}
	
	//======================================================================================================
	//destroy

	public function OnPopOver()
	{
		GestureManager.Instance().RemoveTouchable(ocupied);
		GestureManager.Instance().RemoveTouchable(arcSelectControl);
		GestureManager.Instance().RemoveReceiver(this);
		GestureManager.Instance().RemoveTouchable(this);
		GestureManager.Instance().RemoveTouchable(weaponsView);
		GestureManager.Instance().RemoveTouchable(ocupied);
		GestureManager.Instance().RemoveTouchable(skillButton);
		GearData.Instance().RemoveKnightListener(this);
		armSelect.OnPopOver();
		transition.OnPopOver();
		gearTip.OnPopOver();
		weaponsView.Clear();
		if(mDragedItem != null)
			DestroyDragedItem();
		armSort.OnPopOver();
		
	}
	//======================================================================================================
	//weaponsView
	
	public var weaponsView:ScrollList;
	private var arms:List.<Arm>;
	
	private function InitWeaponsView()
	{
		//weaponsView.Init();
		//weaponsView.AutoLayout();
		weaponsView.SetZOrder(1);
		var tag:GearScrollViewItem.Tag = new GearScrollViewItem.Tag();
		tag.type =  GearScrollViewItem.ItemType.Scroll;
		KBN.GearItems.Instance().item.tagItem = tag;
		KBN.GearItems.Instance().item.Init();
		weaponsView.Init(KBN.GearItems.Instance().item);

		
		canItem = true;
	}

	private function Add()
	{
		Refresh();
		//armSelect.UpdateCurrent();
		//weaponsView.WillSort(armSort.SortFunction);
		//weaponsView.RunAutoLayoutAfterCache();
	}
	
	private function Remove()
	{
		Refresh();
		//weaponsView.RemoveElemInNewComponent(i);
		//armSelect.UpdateCurrent();
		
		//weaponsView.WillSort(armSort.SortFunction);
		//weaponsView.RunAutoLayoutAfterCache();
	}
	private function Refresh()
	{
		armSelect.UpdateCurrent();
		//weaponsView.RunAutoLayoutAfterCache();
	}
	
	private function Clear()
	{
		//this.weaponsView.WillClear();
		this.weaponsView.Clear();
	}
	//======================================================================================================
	//receive interface  
	private function OnSequence(type:GestureManager.GestureEventType, item:ITouchable, time:Object) 
	{ 
		HideTip();
		if(type == GestureManager.GestureEventType.SlideMove)
		{
			InputCurrent();
		}
		else if(type == GestureManager.GestureEventType.SlideOver)
		{
			Finish();
		}
		else if(type == GestureManager.GestureEventType.Clicked)
		{ 
			if (NewFteMgr.Instance().IsDoingFte)
				return;
				
			armSort.OnSequenceClick();
		}
		else if(type == GestureManager.GestureEventType.DoubleClicked)
		{ 
			if (NewFteMgr.Instance().IsDoingFte)
				return;
					
			armSort.OnSequenceClick();
		}
		
		if(mDragedItem == null) return;
		if(type == GestureManager.GestureEventType.LongMove)
		{
			OnLongMove();
		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnOnlyWindowRelease();
		}	

	}
	private function OnArc(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		HideTip();
		if(type == GestureManager.GestureEventType.SlideMove)
		{
			InputCurrent();
		}
		else if(type == GestureManager.GestureEventType.SlideOver)
		{
			Finish();
		}
		
		if(mDragedItem == null) return;
		if(type == GestureManager.GestureEventType.LongMove)
		{
			OnLongMove();
		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnOnlyWindowRelease();
		}	
			
	}
	//======================================================================================================
	//ocupied 
	private var ocupied:OcupiedTouchable;
	private function InitOcupied()
	{
		ocupied = new OcupiedTouchable();
		ocupied.rect = new Rect(0,0,rect.width,rect.height - scrollBackground.rect.height);
		ocupied.SetZOrder(1); 
		ocupied.SetName("ocupied");
		
	}
	private function DrawOcupied()
	{
		ocupied.Draw();
	}
	
	private function OnOcupied(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var it:OcupiedTouchable; 
		it = item as OcupiedTouchable;
		if(it == null) return; 
		if(it.GetName() != "ocupied") return;
		if(type == GestureManager.GestureEventType.SlidePress)
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
	
	// Fte use
	private function IsCanOpItemByFte(item:GearScrollViewItem):boolean
	{
		// Check is fte allow operate item
		var doingFte:NewFte = NewFteMgr.Instance().GetCurrentFte;
		if (doingFte && doingFte.CurrStep)
		{
			if ((doingFte.CurrStep.Action as GuideDragDropped))
			{
				var fteOpItem:GearScrollViewItem = doingFte.CurrStep.Action.TraceUIObj as GearScrollViewItem;
				
				// Check is fte using transitItems.arrayItem0
				if (panel.CheckIsNullTransitItem(fteOpItem))
				{
					// Change items.arrayItem0 instead of it
					fteOpItem = panel.GetMatchItem(fteOpItem);
				}
				
				if (fteOpItem != item)
				{
					return false;
				}
			}
			else
			{
				return false;
			}
			
			return true;
		}
		
		return true;
	}
	
	//======================================================================================================
	private var receiverActivated:System.Action.<GestureReceiver>;
	private var canItem:boolean = true;
	private function OnItem(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		
		var it:GearScrollViewItem; 
		it = item as GearScrollViewItem;
		if(it == null) return; 
		
		if(type == GestureManager.GestureEventType.LongPress)
		{
			// Check is fte allow operate item
			if (!IsCanOpItemByFte(it))
				return;
		
			OnLongPress(it);
			
		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnLongRelease(it);
			
		}
		else if(type == GestureManager.GestureEventType.LongMove)
		{
			
		}
		else if(type == GestureManager.GestureEventType.Clicked)
		{
			OnShortPressed(it);
			 
		} 
		else if(type == GestureManager.GestureEventType.DoubleClicked)
		{
			OnDoubleClick(it);
		}									
	}
	private function OnScroll(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var scroll:ScrollList;
		scroll = item as ScrollList;
		if(scroll == null) return;
		if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnScrollRelease();
			OnOnlyWindowRelease();
		}
		else if(type == GestureManager.GestureEventType.LongMove)
		{
			OnLongMove();
		}
		else if(type == GestureManager.GestureEventType.SlidePress)
		{
			canItem = false;
			
		}
		else if(type == GestureManager.GestureEventType.SlideMove)
		{
			canItem = false;
			if (NewFteMgr.Instance().IsDoingFte)
				weaponsView.updateable = false;
			else
				weaponsView.updateable = true;
			
		}
		else if(type == GestureManager.GestureEventType.SlideOver)
		{
			canItem = true;
		}
		
	}
	private function OnOnlyWindow(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var gear:GearEquipment;
		gear = item as GearEquipment;
		if(gear == null) return;
		HideTip();
		if(type == GestureManager.GestureEventType.LongPress)
		{
			OnOnlyWindowLongPress();
		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnOnlyWindowRelease();
		}
		else if(type == GestureManager.GestureEventType.LongMove)
		{
			OnOnlyWindowMove();
		}
		else if(type == GestureManager.GestureEventType.Clicked)
		{
			
		}
		else if(type == GestureManager.GestureEventType.DoubleClicked)
		{
			
		}					
		
	}	
	private function OnWindow(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var gear:GearEquipment;
		gear = item as GearEquipment;
		if(gear == null) return;
		
		if(type == GestureManager.GestureEventType.LongPress)
		{
			
		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnWindowRelease();
		}
		else if(type == GestureManager.GestureEventType.LongMove)
		{
			OnLongMove();
		}
		else if(type == GestureManager.GestureEventType.Clicked)
		{
		
		}
		else if(type == GestureManager.GestureEventType.DoubleClicked)
		{
			
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
	
	private function IsGestureValid():boolean
	{
		if(flash == null) return false;
		if(flash.isVisible()) return false;
		return true;
	}
	
	public function OnGesture( type:GestureManager.GestureEventType, touchables:List.<ITouchable>, time:Object)
	{   
		if(MenuMgr.getInstance().Top() == null) return;
		if(MenuMgr.getInstance().Top().menuName != "GearMenu") return;
		eventTime = 0.0f;
		if(!IsGestureValid()) return;
		
		if(touchables == null) return;
		if(touchables.Count <= 0) return; 
		var first:boolean = true;
		var arc:ArcSelectControl;
		
		for(var item:ITouchable in touchables)
		{ 
			var it:SkillInformationMenu = null;
			it = item as SkillInformationMenu;
			if(it != null) return;
			
			if(item.GetName() == "skillbutton") 
			{	
				OnSkillButton(type,item,time);
				return;
			}			
			
			var ill:KnightInformationPopMenu = null;
			ill = item as KnightInformationPopMenu;
			if(ill != null) return;
			OnBackForward(type,item,time);
			if(item.GetName() == "seq")
			{	
				OnSequence(type,item,time); 
				return;		
			}
			
			arc = item as ArcSelectControl;
			if(arc != null) 
			{  	
				OnArc(type,item,time);
				return;
			}
			if(first) 
			{
				OnItem(type,item,time);  
				first = false;
			}
			if(touchables.Count == 1)
			{
				OnOnlyWindow(type,item,time); 
			} 
			else if(touchables.Count == 2)
			{
				if( touchables[0].GetName() == "ocupied" || touchables[1].GetName() == "ocupied")
					OnOnlyWindow(type,item,time);
			}
			OnWindow(type,item,time);
			OnScroll(type,item,time);
			OnOcupied(type,item,time);
		}
		OnAction(type,time);
	} 
	
	public function OnAction(type:GestureManager.GestureEventType,time:Object)
	{
		if(type == GestureManager.GestureEventType.SlideOver)
		{
			Finish();
			canItem = true;

			timer.Begin(4.0f,null); 
		}
		else if(type == GestureManager.GestureEventType.SlideMove)
		{
			InputCurrent();
		}		
		
	}
	
	
	public function SetReceiverActiveFunction(Activated:System.Action.<GestureReceiver>) 
	{
		receiverActivated = Activated;
	}
	//======================================================================================================
	//timer
	
	private var timer:Timer;
	
	private function InitTimer()
	{
		timer = new Timer();
		timer.Init();
		timer.OnTime = OnTime;
	}
	
	private function OnTime(t:int,p:Object)
	{
		if( t <= 0) return;
		weaponsView.updateable = false;
		timer.Stop();
	}
	
	private function UpdateTimer()
	{
		timer.Update();
	}
	
	
	
	//======================================================================================================
	//Animation
	
	
	private var putLineAnimation:LineGUIAnimation = null;
	private var removeLineAnimation:LineGUIAnimation = null;
	private var mDragedItem:GearScrollViewItem = null;
	private var isAnimated:boolean;
	private function DrawDragedItem()
	{
		if(mDragedItem != null)	
		{
			mDragedItem.Draw(); 
			if(eventTime >= 1.0f && !isAnimated)
			{
				DestroyDragedItem();
				Refresh();
			}
		}
		else 
			isAnimated = false;		
	}
	private function DestroyDragedItem()
	{
		if(mDragedItem == null) return;
		if(mDragedItem.lblIcon != null)
			Resources.UnloadAsset(mDragedItem.lblIcon.mystyle.normal.background);
		mDragedItem.OnPopOver();
		mDragedItem = null;
	}


	private function LineAnimate(lineAnimation:LineGUIAnimation,to:Rect,OnLineFinish:System.Action):LineGUIAnimation
	{
		if(mDragedItem == null) return;
		if(mDragedItem.TheArm == null) return;
		if(!mDragedItem.TheArm.IsValidCategory()) return;
		
		var s:double = 0.0f;
		var v:double = 1.8f;
		var a:double = -1.45f;
		
		
		var from:Rect = new Rect(mDragedItem.rect);
			
		//var to:Rect = new Rect(panel.Destinations[mDragedItem.TheArm.Category - 1]);
		var uiobject:UIObject = mDragedItem;
					
		lineAnimation = GUIAnimationManager.Instance().CreateLineAnimation(OnLineFinish,from,to,uiobject);
		lineAnimation.SetDefault(true);
		lineAnimation.From = from;
		lineAnimation.To = to;
		lineAnimation.TheObject = uiobject;
		GUIAnimationManager.Instance().Start(lineAnimation,s,v,a);
		isAnimated = true;
		return lineAnimation;
	}
	private function OnLinePutFinish()
	{
		if(mDragedItem == null) return;
		if(CurrentKnight == null) return;
		Save(CurrentKnight);
		isAnimated = false;
		var arm:Arm = CurrentKnight.GetArm(mDragedItem.TheArm.Category);
		if(arm != null)
			GearManager.Instance().RemoveArm(arm,CurrentKnight.KnightID);
		GearManager.Instance().PutArm(mDragedItem.TheArm,CurrentKnight.KnightID);
		Remove();

		NewFteMgr.Instance().OnTraceDragDropDone(mDragedItem, GearScrollViewItem.ItemType.Knight);
		var temp:Rect = mDragedItem.rect;
		DestroyDragedItem();
		
		SoundMgr.instance().PlayRelativeToGear(Constant.GearSoundName.EquipOrUnEquip);
		
		if(arm != null)
		{
			mDragedItem = KBN.GearItems.Instance().CreateMoveArmItem(arm);
			mDragedItem.rect = temp;
			removeLineAnimation = LineAnimate(removeLineAnimation,new Rect(300,1000,10,10),OnLineRemoveAfterPutFinish);
			OnRevomeLineStart();
		}
	}
	
	private function OnRevomeLineStart():void
	{
		SoundMgr.instance().PlayRelativeToGear(Constant.GearSoundName.EquipOrUnEquip);
	} 
	
	private function OnLineRemoveFinish()
	{
		if(mDragedItem == null)
			return;
		if(CurrentKnight == null)
			return;
		Save(CurrentKnight);
		isAnimated = false;
		
		priv_doAdd(GearScrollViewItem.ItemType.Scroll);

		if(mDragedItem.TheArm.Category != armSelect.CurrentType)
		{
			armSelect.SetArmType(mDragedItem.TheArm.Category);
			Hilighten();
		}
		DestroyDragedItem();
	}

	private function priv_doAdd(tgtPosition : GearScrollViewItem.ItemType)
	{
		
		NewFteMgr.Instance().OnTraceDragDropDone(mDragedItem, tgtPosition);
		Add();
	}

	private function OnLineRemoveAfterPutFinish()
	{
		if(mDragedItem == null) return;
		if(CurrentKnight == null) return;
		Save(CurrentKnight);
		isAnimated = false;
		priv_doAdd(GearScrollViewItem.ItemType.Move);
		DestroyDragedItem();
	}

	//======================================================================================================
	//drag		
	private function OnLongPress(item:GearScrollViewItem)
	{
		if(HideTip()) return;
		if(!canItem) return;
		if(item == null) return;
		if(item.tagItem == null) return; 
		if(item.tagItem.type ==  GearScrollViewItem.ItemType.Blank) return;
		if(isAnimated) return;
		if(transition.IsTransiting ) return;
		
		var scale:double = 0.6f;
		if(General.instance().getGeneralStatus(GearData.Instance().CurrentKnight.CityID,GearData.Instance().CurrentKnight.KnightID) != Constant.GeneralStatus.IDLE)
		{
			ShowCantEquipTips(CantEquipCondition.KNIGHT_OUTSIDE);
			return;
		}
		if(!GearManager.Instance().CanPutArm(item.TheArm,GearData.Instance().CurrentKnight))
		{
			ShowCantEquipTips(CantEquipCondition.KNIGHT_LV_NOT_MET);
			return;
		}
		if(item.tagItem.type == GearScrollViewItem.ItemType.Knight)
		{
			GearManager.Instance().RemoveArm(item.TheArm,CurrentKnight.KnightID);
			scale = 1.0f;
		}
		else if(item.tagItem.type == GearScrollViewItem.ItemType.Scroll)
		{
			Remove();
			scale = 0.6f;
		}
	 	mDragedItem = KBN.GearItems.Instance().CreateMoveArmItem(item.TheArm);
	 	mDragedItem.WithinRect(new Rect(mDragedItem.rect.x,mDragedItem.rect.y,item.rect.width,item.rect.height));
		mDragedItem.tagItem.sourceType = item.tagItem.type;
		mDragedItem.tagItem.type = GearScrollViewItem.ItemType.Move;
		
		OnLongMove();
		
		NewFteMgr.Instance().OnTraceDragDropBegin("mDragedItem", this);
	}
	
	private function OnLongRelease(item:GearScrollViewItem)
	{
		
		if(mDragedItem == null) return;
		if(item == null) return;
		if(mDragedItem.tagItem == null) return;
		if(mDragedItem == item) return;
	 	
		if(mDragedItem.tagItem.sourceType == GearScrollViewItem.ItemType.Knight && item.TheArm != mDragedItem.TheArm)
		{
			if(General.instance().getGeneralStatus(GearData.Instance().CurrentKnight.CityID,GearData.Instance().CurrentKnight.KnightID) != Constant.GeneralStatus.IDLE)
			{
				ShowCantEquipTips(CantEquipCondition.KNIGHT_OUTSIDE);
				
				GearManager.Instance().RemoveArm(mDragedItem.TheArm,CurrentKnight.KnightID);
				DestroyDragedItem();
				return;
			}
			GearManager.Instance().RemoveArm(mDragedItem.TheArm,CurrentKnight.KnightID);
			removeLineAnimation = LineAnimate(removeLineAnimation,new Rect(300,1000,10,10),OnLineRemoveFinish);
			OnRevomeLineStart();
		}
		else if(mDragedItem.tagItem.sourceType == GearScrollViewItem.ItemType.Scroll && (item.tagItem.type == GearScrollViewItem.ItemType.Blank || item.tagItem.type == GearScrollViewItem.ItemType.Knight))
		{
			if(General.instance().getGeneralStatus(GearData.Instance().CurrentKnight.CityID,GearData.Instance().CurrentKnight.KnightID) != Constant.GeneralStatus.IDLE)
			{
				ShowCantEquipTips(CantEquipCondition.KNIGHT_OUTSIDE);
				
				//Add(GearItems.Instance().CreateScrollArmItem(mDragedItem.TheArm));
				priv_doAdd(GearScrollViewItem.ItemType.Blank);
				DestroyDragedItem();
				return;
			}
			if(GearManager.Instance().CanPutArm(mDragedItem.TheArm,GearData.Instance().CurrentKnight))
			{
				var r:Rect = panel.Destinations[mDragedItem.TheArm.Category - 1];
				r.x += panel.rect.x;
				r.y += panel.rect.y;
				putLineAnimation = LineAnimate(putLineAnimation,r,OnLinePutFinish);
			}
			else
			{
				ShowCantEquipTips(CantEquipCondition.KNIGHT_LV_NOT_MET);
			}
		}
		else if(mDragedItem.tagItem.sourceType == GearScrollViewItem.ItemType.Scroll && item.tagItem.type == GearScrollViewItem.ItemType.Scroll)
		{
			//Add(GearItems.Instance().CreateScrollArmItem(mDragedItem.TheArm));
			priv_doAdd(GearScrollViewItem.ItemType.Blank);
			DestroyDragedItem();
		}
	}
	
	
	private function OnLongMove()
	{
		if(mDragedItem == null) return;  
		if(isAnimated) return;
		
		var v2:Vector2;
		v2 = Input.mousePosition; 
		v2 = _Global.TransCoordFromScrren(v2);
		var r:Rect = new Rect(mDragedItem.rect);
		r.x = v2.x;
		r.y = v2.y;
		
		mDragedItem.rect = _Global.CalculateLeftTopFromCenter(r);
		mDragedItem.rect.y -= mDragedItem.rect.height / 2;
	}
	
	private var showItem:GearScrollViewItem;
	private function OnShortPressed(item:GearScrollViewItem)
	{
		
		if(item == null) return;
		
		if(item.tagItem.type == GearScrollViewItem.ItemType.Blank) return;
		
		if(transition.IsTransiting) return;
		
		if(isAnimated) return;
		
		if(HideTip())
		{
			
		}
		else if(item != showItem)
		{ 
			
			ShowTip(item);
		}
		
	}
	
	private function OnWindowRelease()
	{
		if(mDragedItem == null) return;
		if(mDragedItem.tagItem.sourceType != GearScrollViewItem.ItemType.Scroll && mDragedItem.tagItem.sourceType != GearScrollViewItem.ItemType.Knight)
		{
			DestroyDragedItem();
		}
	}
	
	private function OnScrollRelease()
	{
		if(mDragedItem == null) return;
		if(mDragedItem.tagItem == null) return;
		
		if(mDragedItem.tagItem.sourceType == GearScrollViewItem.ItemType.Knight)
		{
			if(General.instance().getGeneralStatus(GearData.Instance().CurrentKnight.CityID,GearData.Instance().CurrentKnight.KnightID) != Constant.GeneralStatus.IDLE)
			{
				ShowCantEquipTips(CantEquipCondition.KNIGHT_OUTSIDE);
				
				GearManager.Instance().PutArm(mDragedItem.TheArm,GearData.Instance().CurrentKnight);
				DestroyDragedItem();
				return;
			}
		}
		else	
		{	
			DestroyDragedItem();
			return;
		}

		//Add(GearItems.Instance().CreateScrollArmItem(mDragedItem.TheArm));
		priv_doAdd(GearScrollViewItem.ItemType.Scroll);

		//DestroyDragedItem(); 			
	}
	
	private function OnOnlyWindowRelease()
	{
		if(mDragedItem == null)
		{
			
			//Finish();
			
			return;
		}
		if(mDragedItem.tagItem == null) return;
		
		if(mDragedItem.tagItem.sourceType == GearScrollViewItem.ItemType.Knight)
		{
			if(General.instance().getGeneralStatus(GearData.Instance().CurrentKnight.CityID,GearData.Instance().CurrentKnight.KnightID) != Constant.GeneralStatus.IDLE)
			{
				ShowCantEquipTips(CantEquipCondition.KNIGHT_OUTSIDE);
				
				GearManager.Instance().PutArm(mDragedItem.TheArm,GearData.Instance().CurrentKnight);
				DestroyDragedItem();
				return;
			}
			removeLineAnimation = LineAnimate(removeLineAnimation,new Rect(300,1000,10,10),OnLineRemoveFinish);
			OnRevomeLineStart();
		}
		else if(mDragedItem.tagItem.sourceType == GearScrollViewItem.ItemType.Scroll)
		{
			if(General.instance().getGeneralStatus(GearData.Instance().CurrentKnight.CityID,GearData.Instance().CurrentKnight.KnightID) != Constant.GeneralStatus.IDLE)
			{
				ShowCantEquipTips(CantEquipCondition.KNIGHT_OUTSIDE);
				

				priv_doAdd(GearScrollViewItem.ItemType.Blank);
				DestroyDragedItem();
				return;
			}
			if(GearManager.Instance().CanPutArm(mDragedItem.TheArm,GearData.Instance().CurrentKnight))
			{
				var r:Rect = panel.Destinations[mDragedItem.TheArm.Category - 1];
				r.x += panel.rect.x;
				r.y += panel.rect.y;
				putLineAnimation = LineAnimate(putLineAnimation,r,OnLinePutFinish);

			}
			else
			{
				ShowCantEquipTips(CantEquipCondition.KNIGHT_LV_NOT_MET);
			}
		}
	
	}
	
	private function OnOnlyWindowMove()
	{
		//InputCurrent();	
	}
	
	private function OnOnlyWindowLongPress()
	{			
		//Begin();
	}

	
	public function OnDoubleClick(item:GearScrollViewItem)
	{
		if (!IsCanOpItemByFte(item)) return;
		
		HideTip();
		if(mDragedItem != null) return;
		
		OnLongPress(item);
		OnLongMove();
		OnOnlyWindowRelease();
	}
	
	private	function ShowCantEquipTips( condition:CantEquipCondition ):void
	{
		var	strKey:String = "Gear.KnightsOutside";
		
		switch( condition ){
			case	CantEquipCondition.KNIGHT_OUTSIDE:
			strKey = "Gear.KnightsOutside";
			break;
			
			case	CantEquipCondition.KNIGHT_LV_NOT_MET:
			strKey = "Gear.KnightsLvNotMet";
			break;
		}
		cannotEquipTips.StopTime = 5.0f;
		cannotEquipTips.setInfoContent(Datas.getArString(strKey));
		cannotEquipTips.Show();
	}

	//======================================================================================================
	//Sort
	public var sequenceButton:Button; 
	private var armSort:GearArmSort;
	
	private function InitSequenceButton()
	{
		armSort = new GearArmSort();
		armSort.sequenceButton = sequenceButton;
		armSort.OnSortChanged = OnSortChanged;
		armSort.Init();
	}
	private function OnSortChanged()
	{
		armSelect.sortFunction = armSort.SortFunction;
		Hilighten();
		//armSelect.UpdateCurrent();
	}
	private function DrawSequenceButton()
	{
		armSort.Draw();
	}
	
	//======================================================================================================
	//touchable interface 
	private var mAbsoluteRect:Rect; 
	private var mActivated:System.Action.<ITouchable>;
	
	private function InitAbsoluteRect()
	{
		mAbsoluteRect = new Rect(0,0,640,960);
	}
	public function GetName():String
	{
		return "";
	}
	public function IsVisible():boolean
	{
		return visible;
	}
	
	public function GetAbsoluteRect():Rect
	{ 
		return mAbsoluteRect;
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
		if(receiverActivated != null)
			receiverActivated(this);
	}	
	
	//======================================================================================================
	//transition
	public var forwardButton:Button;
	public var backwardButton:Button;
	private var transition:KnightTransition;
	
	
	private function InitTransition()
	{
		transition = new KnightTransition();
		
		transition.OnTransitionFinish = OnFinish;
		panel.SetVisible(true);
		panel.hand.SetVisible(true);
 
		transition.Init();
	} 
	
	private function Begin()
	{
		if (NewFteMgr.Instance().IsForbidMenuEvent)
		{
			return;
		}
		
		if(gearTip.IsShowTip()) return;
		if(mDragedItem != null) 
		{
			//Finish();
			return;
		}
		
		if(transition.IsTransiting ) return;
		
		var pre:Knight = GearData.Instance().PreviousKnight;
		var next:Knight = GearData.Instance().NextKnight;
		var current:Knight = GearData.Instance().CurrentKnight;
		if(!transition.IsTransiting)
		{
			panel.SetVisible(false);
			panel.hand.SetVisible(false);
		}
		transition.Begin(panel,[pre,current,next]);
	}

	   
	private function Finish()
	{
		transition.Finish();
	}
	private function Finish(destination:double)
	{
		transition.Finish(destination);
	}
	
	private function TransitionOnKnightChanged()
	{
		if( GearData.Instance().NextKnight == null)
			forwardButton.alpha = 0.2f;
		else
			forwardButton.alpha = 1.0f;
			
		if( GearData.Instance().PreviousKnight == null)
			backwardButton.alpha = 0.2f;
		else
			backwardButton.alpha = 1.0f;
		
	}
	
	private function ForwardClick()
	{
		_Global.Log("#####ForwardClick0");
		if(GearData.Instance().NextKnight == null) return;
		_Global.Log("#####ForwardClick1");
		if(mDragedItem != null) return;
		_Global.Log("#####ForwardClick2");
		Begin();
		Finish(1.0f);
	}
	private function BackwardClick()
	{
		_Global.Log("#####BackwardClick0");
		if(GearData.Instance().PreviousKnight == null) return;
		_Global.Log("#####BackwardClick1");
		if(mDragedItem != null) return;
		_Global.Log("#####BackwardClick2");
		Begin();
		Finish(-1.0f);
	}
	
	private function OnFinish(side:int)
	{

		panel.SetVisible(true);
		panel.hand.SetVisible(true);
		
		if(side == -1) GearData.Instance().ShiftPreviousKnight();
		if(side == 1) GearData.Instance().ShiftNextKnight();	
	}
	   	   	    
	private function UpdateTransition()
	{
		transition.Update();
	}   	   
	
	private function DrawTransition()		     
	{
		transition.Draw();
	} 
	
	private function InputCurrent()
	{
		
		if(mDragedItem != null) 
		{
			Finish();
			return;
		}	
		transition.InputCurrent();
	}
	
	//======================================================================================================
	//Net
	private var netTimer:Timer;
	private var saveInterval:double;
	
	
	private function InitNet()
	{
		netTimer = new Timer();
		netTimer.Init();
		netTimer.OnTime = OnNetTime;
		//netTimer.Begin(Constant.Gear.NetInterval,null);
		saveInterval = 0.0f;
		GearNet.Instance().OnAfterKnightError = OnAfterKnightError;
	}
	private function OnAfterKnightError()
	{
		armSelect.UpdateCurrent();
	}
	private function OnNetTime()
	{
		//Save(GearData.Instance().CurrentKnight);
	}
	
	private function UpdateNet()
	{
		netTimer.Update();
		saveInterval += Time.deltaTime;
	}
	
	public function OnPop()
	{
		netTimer.Stop();
	}
	
	private function Save(knight:Knight)
	{
		GearNet.Instance().EnKnightQueue(knight);
	}
	
	public function OnSelect()
	{
		tipHelp.Begin();
		if(armSelect != null)
		{
			if (null != armSort)
				armSelect.sortFunction = armSort.SortFunction;
				
			armSelect.Reset = true;
			armSelect.SetArmType(armSelect.CurrentType);
			armSelect.UpdateCurrent();
		}
		OnCurrentKnightChanged(null,GearData.Instance().CurrentKnight);

		tip.CompareRequire = true;
		HideTip();
		
		var gearMenu:GearMenu = MenuMgr.getInstance().getMenu("GearMenu") as GearMenu;
		if( gearMenu ){
			gearMenu.InitGearEquipmentBackground();
		}
	}
	//======================================================================================================
	public var flash:FlashLabel;
	
	private function InitFlash()
	{ 
		if(flash == null) return;
		flash.Init();
		flash.From = 0.2f;
		flash.To = 0.8f;
		flash.Times = 1;
		flash.Screenplay.OnPlayFinish = OnFlashFinish;
		GearManager.Instance().SetImageNull(flash);
		flash.mystyle.normal.background = TextureMgr.instance().LoadTexture("kuang",TextureType.DECORATION);
		flash.rect = new Rect(scrollBackground.rect);
		
		flash.mystyle.border.left = 8;
		flash.mystyle.border.right = 8;
		flash.mystyle.border.top = 8;
		flash.mystyle.border.bottom = 8;
		Darken();
	}
	public function Hilighten()
	{
		if(flash == null) return;
		flash.SetVisible(true);
		flash.Begin();
	}
	
	public function Darken()
	{
		if(flash == null) return;
		flash.SetVisible(false);
	}
	
	private function OnFlashFinish()
	{
		if(armSelect != null)
		{
			armSelect.Reset = true;
			armSelect.UpdateCurrent();
		}
		Darken();
	}
	private function UpdateFlash()
	{
		if(flash == null) return;
		flash.Update();
	}
	
	private function DrawFlash()
	{ 
		if(flash == null) return;
		flash.Draw();
	}
	//======================================================================================================
	//skill information
	public var skillButton:Button;
	private function InitSkillButton()
	{
		skillButton.Init();
		//skillButton.OnClick = OnSkillButtonClick;
		skillButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_i",TextureType.DECORATION);
		skillButton.SetName("skillbutton");
		skillButton.SetZOrder(1000);
		//skillButton.TouchRect = new Rect(skillButton.rect.x - 15,skillButton.rect.y - 15, skillButton.rect.width + 30, skillButton.rect.height + 30);
		skillButton.TouchRect = new Rect(skillButton.rect.x, skillButton.rect.y, skillButton.rect.width, skillButton.rect.height);
		
		GestureManager.Instance().RegistTouchable(skillButton);
		
	}
	private function InitShareButton(){
		shareButton.Init();
		shareButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("facebook_buttonUp",TextureType.DECORATION);
		shareButton.mystyle.active.background = TextureMgr.instance().LoadTexture("facebook_buttonDown",TextureType.DECORATION);
		shareButton.OnClick = OnShareBtnClick;
	}
	public function OnShareBtnClick(){
		
		//startShare();
//		var rec:Rect=new Rect(60,160,500,580);
		//GameMain.instance().SaveGearShareTexture(screenShortRect);

		
		
	}
	
	
	public function startShare(){
		timmer=0;
	}
	
	public function endShare(){
		timmer=2;
	}
	private function OnSkillButton(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		if(type == GestureManager.GestureEventType.Clicked)
		{ 
			if (NewFteMgr.Instance().IsDoingFte)
				return;
			OnSkillButtonClick();
		}
		else if(type == GestureManager.GestureEventType.LongMove)
		{
			OnLongMove();
		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnOnlyWindowRelease();
		}					
	}
	
	private function OnSkillButtonClick()
	{
		MenuMgr.getInstance().PushMenu("SkillInformationMenu", SkillInformationMenu.MenuType.Knight, "trans_horiz" );
	}
	
	private function UpdateSkillButton()
	{
		skillButton.Update();
	}
	
	private function DrawSkillButton()
	{
		skillButton.Draw();
	}
	
	private function DrawPhotoFrames()
	{
		photoFrame.Draw();
		flowerLeftBottom.Draw();
		m_rotate.drawItems();
	}
	//======================================================================================================
	private var eventTime:double = 0.0f;
	private function UpdateEventTime()
	{
		eventTime += Time.deltaTime;
		
	}
	//======================================================================================================
	//back buttons
	
	public var backButton_back:Button;
	public var forwardButton_back:Button;
	public var iButton_back:Button;
	public var detailButton_back:Button;
	
	private function InitBackForwardButton()
	{
		backButton_back.Init();
		forwardButton_back.Init();
		iButton_back.Init();
		
		forwardButton_back.OnClick = ForwardClick;
		backButton_back.OnClick = BackwardClick;
		iButton_back.OnClick = OnSkillButtonClick;
		
	}
	
	private function UpdateBackForwardButton()
	{
		backButton_back.Update();
		forwardButton_back.Update();
		iButton_back.Update();
		
		
	}
	
	private function DrawBackForwardButton()
	{
		backButton_back.Draw();
		forwardButton_back.Draw();
		iButton_back.Draw();
		
		
		
		
	}
	
	//======================================================================================================
	//help
	public var tipHelp:FlashLabel;
	
	
	private function InitHelp()
	{
		tipHelp.Init();
		
		tipHelp.From = 0.0f;
		tipHelp.To = 1.0f;
		tipHelp.Times = 1;
		tipHelp.Accelerate = Mathf.PI / 16;
		tipHelp.txt = Datas.getArString("Gear.HelpEquip");
		tipHelp.alphaEnable = true;
		tipHelp.alpha = 0.0f;
	}
	private function UpdateHelp()
	{
		tipHelp.Update();
		
	}
	private function DrawHelp()
	{
		tipHelp.Draw();
		
	}
	
	
}