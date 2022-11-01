


public class GearArmLevelUpgrade extends TabContentUIObject implements ITouchable,GestureReceiver
{
	//======================================================================================================
	public function Init()
	{

		
		InitTip();
		InitArmPanel();
		
		
		InitSequenceButton();
		InitWeaponsView();
		InitArcControl();
		InitAbsoluteRect(); 
		InitTransition();
		InitScrollBackground();
		InitFlash();
		InitFlashMain();
		InitFloating(); 
		InitFlashHilight();
		InitSkillButton(); 
		InitBonus();
		InitOcupied();
		InitButton();
		InitTimer();
		InitHelp();
		cannotEquipTips.Init();
		cannotEquipTips.setInfoContent(Datas.getArString("Gear.KnightsOutside"));				
		GearNet.Instance().OnUnLockOK = OnUnLockOK;
		GearNet.Instance().OnUnLockNotOK = OnUnLockNotOK;
		SetCanEat(true);
		isAnimated = false;
		canTime = 0.0f;
	}
	
	
	//======================================================================================================
	//receiver interface
	private var mDragedItem:GearScrollViewItem = null;
	private var receiverActivated:System.Action.<GestureReceiver>;
	private var canItem:boolean = true;
	private function OnSequence(type:GestureManager.GestureEventType, item:ITouchable, time:Object) 
	{ 
		HideTip();
		if(type == GestureManager.GestureEventType.LongMove)
		{
			OnArcMove();
			OnLongMove();
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
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnOnlyWindowRelease();
		}		
		else if(type == GestureManager.GestureEventType.SlideMove)
		{
			InputCurrent();
		}
		else if(type == GestureManager.GestureEventType.SlideOver)
		{
			Finish();
			canItem = true;
		}		

	}
	
	private function OnArc(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var it:ArcSelectControl = null; 
		it = item as ArcSelectControl;
		if(it == null) return; 
		HideTip();
		if(type == GestureManager.GestureEventType.LongMove)
		{
			OnArcMove();
			OnLongMove();
		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnOnlyWindowRelease();
		}		
		else if(type == GestureManager.GestureEventType.SlideMove)
		{
			InputCurrent();
		}
		else if(type == GestureManager.GestureEventType.SlideOver)
		{
			Finish();
			canItem = true;
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
				if (null != fteOpItem && null != item && fteOpItem.TheArm != item.TheArm)
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
	
	private function OnItem(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		
		var it:GearScrollViewItem = null; 
		it = item as GearScrollViewItem;
		if(it == null) return;
		
		if(type == GestureManager.GestureEventType.LongPress)
		{
			// Check is fte allow operate item
			if (!IsCanOpItemByFte(it)) return;
					
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
		scroll =  item as ScrollList;
		if(scroll == null) return;
		
		if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnScrollRelease();
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
			//canItem = false;
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
	private function OnArmSkillButton(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var button:ArmSkillButton;
		button = item as ArmSkillButton;
		if(button == null) return;
		
		if(type == GestureManager.GestureEventType.Clicked)
		{
			if (NewFteMgr.Instance().IsDoingFte)
				return;
			OnButtonClicked(button);
		}
		else if(type == GestureManager.GestureEventType.LongMove)
		{
			OnButtonMove(button);
		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnButtonRelease(button);
		}


		
	}
	private function OnOnlyWindow(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var gear:GearArmLevelUpgrade;
		gear = item as GearArmLevelUpgrade;
		if(gear == null) return;
//		if(gearTip.IsShowTip()) 
//		{
//			gearTip.CloseTip();
//			if(tipItem != null)
//				tipItem.Darken();			
//		} 
		HideTip();
		
		
		
		if(type == GestureManager.GestureEventType.LongPress)
		{
			OnOnlyWindowPress();
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
		
		
	}	
	private function OnWindow(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var gear:GearArmLevelUpgrade;
		gear = item as GearArmLevelUpgrade;
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
		else if(type == GestureManager.GestureEventType.SlideMove)
		{
			InputCurrent();
		}
		else if(type == GestureManager.GestureEventType.SlideOver)
		{
			Finish();
			canItem = true;
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
		GestureManager.Instance().RegistTouchable(ocupied);
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
		
		if (NewFteMgr.Instance().IsDoingFte) return;
		
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
	
	
	//======================================================================================================
	
	private function IsGestureValid():boolean
	{
		if(flashhilight == null) return false;
		if(flashhilight.isVisible()) return false;
		return true;
	}

	public function OnGesture( type:GestureManager.GestureEventType, touchables:List.<ITouchable>, time:Object)	 
	{
		if(MenuMgr.getInstance().Top() == null) return;
		if(MenuMgr.getInstance().Top().menuName != "ArmMenu") return;
		eventTime = 0.0f;
		if(!IsGestureValid()) return;
		if(touchables == null) return;
		if(touchables.Count <= 0) return; 
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
			
			OnItem(type,item,time);
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
			OnArmSkillButton(type,item,time);
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
	
	private function OnArcMove()
	{
		//InputCurrent();
		
	}

	private function OnLongPress(item:GearScrollViewItem)
	{ 
		HideTip();
		if(!canItem) return;
		if(item == null) return;
		if(item.tagItem == null) return; 
		if(item.tagItem.type ==  GearScrollViewItem.ItemType.Blank) return;
		if(isAnimated) return;
		if(item.tagItem.type ==  GearScrollViewItem.ItemType.Knight) 
		{
			//Begin();
			return;
		}
		
		// Lihaojie: check the fte actor, hard code
		var isFteDrag:boolean = false;
		var doingFte:NewFte = NewFteMgr.Instance().GetCurrentFte;
		if (doingFte && doingFte.CurrStepData)
		{
			isFteDrag = doingFte.CurrStepData.guideAction.Equals(NewFteConstants.FteActionOp.GuideDragDrop);
			if (!isFteDrag)
				return;
		}

	 	mDragedItem = KBN.GearItems.Instance().CreateMoveArmItem(item.TheArm);
	 	mDragedItem.SetRect(new Rect(mDragedItem.rect.x,mDragedItem.rect.y,item.rect.width,item.rect.height));	 	
		mDragedItem.tagItem.sourceType = item.tagItem.type; 
		if(item.tagItem.type == GearScrollViewItem.ItemType.Scroll)
		{
			//Remove(item);
			if(armPanel.CanEat())
				BeginMainFlash();
		}
		
		NewFteMgr.Instance().OnTraceDragDropBegin("mDragedItem", this);
	}
	private function OnLongRelease(item:GearScrollViewItem)
	{	
		
		if(mDragedItem == null) return;
		if(item == null) return;
		if(mDragedItem.tagItem == null) return;
		if(mDragedItem == item) return;
		if(isAnimated) return;
		isBonusTip = false;
		

		
		if(mDragedItem.tagItem.sourceType == GearScrollViewItem.ItemType.Scroll && item.tagItem.type == GearScrollViewItem.ItemType.Scroll)
		{
			Add();
		}	
		else if(mDragedItem.tagItem.sourceType == GearScrollViewItem.ItemType.Scroll && item.tagItem.type == GearScrollViewItem.ItemType.Knight)
		{
			if(mDragedItem != null)
			{
				if(mDragedItem.tagItem.sourceType == GearScrollViewItem.ItemType.Scroll)
				{
					SwallowArm();
				}
			}
			else
			{
				
			}		
		}
		DestroyDragedItem();
		
	}
	private function OnWindowRelease()
	{
		isBonusTip = false;
	}
	private function OnLongMove()
	{
		//InputCurrent();
		//if(!canItem) return;
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

		if(!HideTip() && item != showItem && !armPanel.tip.IsShow())
		{
			ShowTip(item);
		}
	}
	
	private function OnOnlyWindowRelease()
	{
		isBonusTip = false;
		if(mDragedItem != null)
		{
			DestroyDragedItem();
			Add();
		}
		else
		{
			//Finish();
		}
		
		
	}

	private function OnOnlyWindowMove()
	{
		//InputCurrent();
	}
	private function OnOnlyWindowPress()
	{
		//Begin();
	}
	
	private function OnScrollRelease()
	{
		if(mDragedItem == null) return;
		if(mDragedItem.tagItem == null)
		{	
			DestroyDragedItem();
			return;
		}
		
		
		if(mDragedItem.tagItem.sourceType == GearScrollViewItem.ItemType.Scroll)
		{
			Add();
		}	
		DestroyDragedItem();
	}
	
	
	public function OnButtonMove(button:ArmSkillButton)
	{
		//InputCurrent();
	}
	public function OnButtonRelease(button:ArmSkillButton)
	{
		if(mDragedItem != null)
		{
			DestroyDragedItem();
			Add();
//			if(mDragedItem.tagItem.sourceType == GearScrollViewItem.ItemType.Scroll)
//			{
//				SwallowArm();
//			}
		}
		else
		{
			//Finish();
		}
		
	}
	public function OnButtonClicked(button:ArmSkillButton)
	{
		if(button == null) return;
		if(button.Skill == null) return; 
		if(button.Skill.ID == Constant.Gear.NullSkillID) 
		{
			HideTip();
			return;
		}
		
		if(!HideTip() && !armPanel.armtip.IsShowTip())
		{
			ShowArmPanelTip(button,GearData.Instance().CurrentArm,button.Skill);
		} 

	}
	
	public function SetReceiverActiveFunction(Activated:System.Action.<GestureReceiver>)
	{
		receiverActivated = Activated;
	}
	
	//======================================================================================================
	//touchable interface
	private var mAbsoluteRect:Rect; 
	private var mActivated:System.Action.<ITouchable>;
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
	//armParel
	public var armPanel:ArmPanel;

	private function InitArmPanel()
	{
		armPanel.armtip = gearTip;
		armPanel.Init();
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
		armSelect.ArmsType = GearArmSelect.ArmsState.UnlockedNotArmedNotCurrentArms;
		armSelect.ShowRedRect = false;
		armSelect.Init();
		
		GestureManager.Instance().RegistTouchable(arcSelectControl);
	}
	private function OnArmSelect(index:int)
	{
		Hilighten();
		HideTip();
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
	
	public function get ArmSelect() : GearArmSelect
	{
		return armSelect;
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
	
	}
	
	private function DrawSequenceButton()
	{
		armSort.Draw();
	}

	
	//======================================================================================================
	//weaponsView
	
	public var weaponsView:ScrollList;
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
		GestureManager.Instance().RegistTouchable(weaponsView);
		
		canItem = true;
		
	}

	private function Add()
	{
		armSelect.UpdateCurrent();
		//this.weaponsView.AddElemInNewComponent(i);
		//weaponsView.WillSort(armSort.SortFunction);
		//weaponsView.RunAutoLayoutAfterCache();
	}
	
	private function Remove()
	{
		
		//weaponsView.RemoveElemInNewComponent(i);
		//this.weaponsView.RemoveElemInNewComponent(i);
		//weaponsView.WillSort(armSort.SortFunction);
		//weaponsView.RunAutoLayoutAfterCache();
		armSelect.UpdateCurrent();
	}
	
	
	private function Clear()
	{
		//this.weaponsView.WillClear();
		this.weaponsView.Clear();
	}
	
	//======================================================================================================
	//tip	
	public var tip:GearInformationTip; 
	private var gearTip:GearArmTip;
	private var tipItem:GearScrollViewItem;
	public var singleTip:InfoTipsBar;
	private var currentButton:ArmSkillButton;
	private function InitTip()
	{
		gearTip = new GearArmTip();
		gearTip.tip = tip;
		gearTip.Init();
		tipItem = null;
		singleTip.Init();
		singleTip.StopTime = 1.0f;
		currentButton = null;
		tip.CompareRequire = false;
	}
	
	private function DrawTip()
	{
		gearTip.Draw();
		singleTip.Draw();
	}
	private function ShowTip(item:GearScrollViewItem)
	{
		tip.CompareRequire = false;
		if (NewFteMgr.Instance().IsDoingFte)
		{
			return;
		}
		
		gearTip.SetIsShowCompare(false);
		gearTip.ShowTip(item.TheArm);
		
		tipItem = item;
		tipItem.Hilighten();
		showItem = item;
	} 
	private function ShowArmPanelTip(button:ArmSkillButton,arm:Arm,skill:ArmSkill)
	{ 
		if(button == null) return;  
		if(arm == null) return;
		if(skill == null) return;
		armPanel.tip.TheArm = arm;
		armPanel.tip.Skill = skill;
		currentButton = button;
		currentButton.Hilighten();
		armPanel.tip.Show();
	}
	private function HideTip():boolean
	{ 
		var r:boolean = false;
		if(currentButton != null)
			currentButton.Darken();
		if(gearTip.IsShowTip()) 
		{
			gearTip.CloseTip();
			if(tipItem != null)
				tipItem.Darken();

			showItem = null;
			r = true;
		}
		if(armPanel.tip.IsShow())
		{
			armPanel.tip.Hide();
			r = true;
		}
		if(singleTip.IsShow())
		{
			singleTip.Hide();
			r = true;
		}
		if(cannotEquipTips.IsShow())
		{
			cannotEquipTips.Hide();
			return true;
		}				
		
		return r;
	}
	
	//======================================================================================================
	public function Update()
	{
		UpdateArcSelect();
		if(mDragedItem == null)
			weaponsView.Update();

		UpdateTransition();
		armPanel.Update();
		UpdateFlash();
		UpdateFlashMain();
		UpdateFloating(); 
		UpdateFlashHilight();
		UpdateSkillButton(); 
		UpdateBonus();
		singleTip.Update();
		UpdateEventTime();
		cannotEquipTips.Update();
		UpdateCanTime();
		UpdateTimer();
		UpdateHelp();
	}
	//======================================================================================================
	public function Draw()
	{
		DrawInterface();
		scrollBackground.Draw();
		
		weaponsView.Draw();
		armSort.Draw();
		forwardButton.Draw();
		backwardButton.Draw();
		DrawSkillButton(); 
		armPanel.Draw();
		DrawTransition();
		
		DrawArcSelect();
		DrawFlash();
		DrawFlashMain();
		
		DrawFlashHilight();
		
		DrawBonus();
		DrawOcupied();
		DrawDragedItem();
		DrawFloating();	
		DrawTip();
		DrawHelp();
		cannotEquipTips.Draw();
	}
	//======================================================================================================
	public function OnPopOver()
	{
		HideTip();
		armPanel.OnPopOver();
		GestureManager.Instance().RemoveTouchable(this);
		GestureManager.Instance().RemoveTouchable(weaponsView);
		GestureManager.Instance().RemoveReceiver(this);
		GestureManager.Instance().RemoveTouchable(arcSelectControl);
		GearData.Instance().RemoveArmListener(this);
		OnPopOverFlash();
		//weaponsView.clearUIObject();
		transition.OnPopOver();
		flashMain.OnPopOver();
		weaponsView.Clear();
	}
	
	public function OnPush(param:Object)
	{
		//armSelect.SetArmType(Constant.ArmType.All);
		OnSelect();
	}
	public function OnInActive()
	{
		HideTip();
		armSelect.Stop();
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
	
	private var lineAnimation:LineGUIAnimation;
	public var Destination:Rect;
	
	private function CalculateDestination():Rect
	{
		 Destination.x = 319;//armPanel.centerArm.rect.x;
		 Destination.y = 403;//armPanel.centerArm.rect.y;
		 Destination.width = 0;//armPanel.centerArm.rect.width;
		 Destination.height = 0;//armPanel.centerArm.rect.height;
		 return Destination;
	}
	
	private function LineAnimate()
	{
		if(mDragedItem == null) return;
		
		var from:Rect = new Rect(mDragedItem.rect);
		var to:Rect = new Rect(CalculateDestination());
		var uiobject:UIObject = mDragedItem;
		var s:double = 0.0f;
		var v:double = 1.8f;
		var a:double = -1.35f;
		
					
		lineAnimation = GUIAnimationManager.Instance().CreateLineAnimation(OnLineFinish,from,to,uiobject);
		
		lineAnimation.SetDefault(true);
		lineAnimation.From = from;
		lineAnimation.To = to;
		lineAnimation.TheObject = uiobject;
		
		GUIAnimationManager.Instance().Start(lineAnimation,s,v,a);
		isAnimated = true;
	}
	private function OnLineFinish()
	{
		isAnimated = false;
		var positions:int[];
		if(mDragedItem == null) return;
		Remove();
		DestroyDragedItem();
	}	
	public function OnDoubleClick(item:GearScrollViewItem)
	{
		if (!IsCanOpItemByFte(item)) return;
		
		HideTip();
		OnLongPress(item);
		OnLongMove();
		isBonusTip = false;
		if(mDragedItem != null)
		{
			if(mDragedItem.tagItem.sourceType == GearScrollViewItem.ItemType.Scroll)
			{
				SwallowArm();
			}
		}
		else
		{
			
		}		

	}
	//======================================================================================================
	// transition

	public var forwardButton:Button;
	public var backwardButton:Button;
	private var transition:KnightTransition;

	
	private function InitTransition()
	{
		transition = new KnightTransition();
		
		transition.OnTransitionFinish = OnFinish;
		armPanel.CanShowArm = true;  
		transition.Init();
		forwardButton.OnClick = ForwardClick;
		backwardButton.OnClick = BackwardClick;
		forwardButton.alphaEnable = true;
		backwardButton.alphaEnable = true;
		forwardButton.alpha = 1.0f;
		backwardButton.alpha = 1.0f;
		
	}
	
	private function Begin()
	{
		if(mDragedItem != null) 
		{
			return;
		}	
		if(isComposedAnimated) return;
		if(transition.IsTransiting ) return;
		var pre:Arm = GearData.Instance().PreviousArm;
		var next:Arm = GearData.Instance().NextArm;
		var current:Arm = GearData.Instance().CurrentArm;
		if(!transition.IsTransiting)
			armPanel.CanShowArm = false; 		
	
		transition.Begin(armPanel.centerArm,[pre,current,next]);
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
		if(mDragedItem != null) return;
		Begin();
		Finish(1.0f);
	}
	private function BackwardClick()
	{
		if(GearData.Instance().PreviousArm == null) return;
		if(mDragedItem != null) return;
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
		armPanel.CanShowArm = true;
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
	private var saveid:int;
	private var backDrag:GearScrollViewItem;
	private var canEat:boolean;
	private var canTime:double;
	
	private function SetCanEat(c:boolean)
	{
		canEat = c;
		if(!canEat)
			canTime = 0.0f;
	}
	private function UpdateCanTime()
	{
		if(!canEat)
		{
			canTime += Time.deltaTime;
			if(canTime > 15.0f)
				canEat = true;
		}
	}
/*	private function Save(ids:int[])
//	{
//		if(GearData.Instance().CurrentArm == null) return;
//		var uniqId = GearData.Instance().CurrentArm.PlayerID;
//		if(ids == null ) return;
//		canEat = false;
//		for(var i:int = 0;i<ids.length;i++)
//		{
//			Remove();
//			GearManager.Instance().GearWeaponry.RemoveArm(GearManager.Instance().GearWeaponry.GetArm(ids[i]));
//		}
//		GearNet.Instance().knightGearUnlockSkill(uniqId,ids);
//	}
*/	
	
	private function Save(id:int)
	{
		if(GearData.Instance().CurrentArm == null) return;
		SetCanEat(false);
		backDrag = null;
		saveid = id;
		backDrag = mDragedItem;
		DestroyDragedItem();
		var arm:Arm = GearManager.Instance().GearWeaponry.GetArm(id);
		if(WillReConsider(arm))
		{
			if (NewFteMgr.Instance().IsForbidMenuEvent)
			{
				RareOK();
			}
			else
			{
				OpenRareDialog();
			}
		}
		else
		{
			RareOK();
		}
	}
	
	private function SwallowArm()
	{
		if(!canEat) 
		{
			if(mDragedItem != null)
			{
				Add();
				DestroyDragedItem();
			}
			return;
		}
		
		if(armPanel.CanEat())
			Save(mDragedItem.TheArm.PlayerID);
		else
		{
			if(mDragedItem != null)
			{
				Add();
				DestroyDragedItem();
				singleTip.setInfoContent(Datas.getArString("Gear.EquipmentNoAttributPopDesc"));
				singleTip.Show();
			}
			
		}
	}
	
	private function WillReConsider(arm:Arm):boolean
	{
		if(arm == null) return false;
		
		if(arm.StarLevel >= GearManager.Instance().LevelTip) return true;
		if(GearManager.Instance().GetTotalArmRare(arm) >= GearManager.Instance().RareTotal) return true;
		
		return false;
	}
	private function RareCancel()
	{
		SetCanEat(true);
		armSelect.UpdateCurrent();
	}
	private function RareOK()
	{
		SetCanEat(true);
		var uniqId = GearData.Instance().CurrentArm.PlayerID;
		if(GearManager.Instance().GearWeaponry.GetArm(uniqId) == null) return;
		if(uniqId == saveid) return;
		
		mDragedItem = backDrag;
		backDrag = null;
		NewFteMgr.Instance().OnTraceDragDropDone(mDragedItem, GearScrollViewItem.ItemType.Scroll);
		
		LineAnimate();
		Remove();
		var arm:Arm = GearManager.Instance().GearWeaponry.GetArm(saveid);
		GearManager.Instance().GearWeaponry.RemoveArm(arm);
		GearData.Instance().RemoveArm(arm);
		GearNet.Instance().knightGearUnlockSkill(uniqId,[saveid]);
	}	
	//======================================================================================================
	//arm
	public function OnCurrentArmChanged(o:Arm,n:Arm)
	{
		if(n == null) return;
		armPanel.TheArm = n;
		TransitionOnArmChanged();
		if(armSelect != null)
			armSelect.UpdateCurrent();
	}
	public function OnExperenceChanged(o:int,n:int)
	{
		
	}

	//======================================================================================================
	//scrollBackground
	public var scrollBackground:Label;
	private function InitScrollBackground()
	{
		scrollBackground.useTile = false;
		scrollBackground.setBackground("tool bar_bottom",TextureType.BACKGROUND);
		scrollBackground.Init();
	}
	//======================================================================================================
	public function OnSelect()
	{
		tipHelp.Begin();	 
		tipHelp2.Begin();

		if(armSelect != null)
		{
			armSelect.Reset = true;
			armSelect.SetArmType(armSelect.CurrentType);
			armSelect.UpdateCurrent();
		}
		OnCurrentArmChanged(null,GearData.Instance().CurrentArm);
		armPanel.OnExperenceChanged(GearData.Instance().Experence);
		GestureManager.Instance().RegistReceiver(this);
		GestureManager.Instance().RegistTouchable(this);
		GearData.Instance().AddArmListener(this);	
	}
	//======================================================================================================
	//flash label
	
	public var flash:FlashLabel;
	private var flashes:FlashLabel[];
	private var flashMain:FlashLabel;
	private var isLevelupTip:boolean;
	private function InitFlash()
	{
		flashes = new FlashLabel[armPanel.skills.length];
		for(var i:int = 0;i<armPanel.skills.length;i++)
		{
			flashes[i] = GameObject.Instantiate(flash);
			flashes[i].Init();
			flashes[i].rect = new Rect(armPanel.skills[i].rect);
			flashes[i].rect.width -= 30;
			flashes[i].rect.height -= 30;
			flashes[i].rect.x = flashes[i].rect.x + armPanel.rect.x + 15;
			flashes[i].rect.y = flashes[i].rect.y + armPanel.rect.y + 15;
			flashes[i].useTile = true;
			//flashes[i].tile.name = "city_background2";
			flashes[i].tile = TextureMgr.instance().ElseIconSpt().GetTile("city_background2");
			flashes[i].mystyle.normal.textColor = new Color(14.0f/255.0f,227.0f/255.0f,16.0f/255.0f,1.0f);
			flashes[i].SetVisible(false);
			flashes[i].From = 0.5f;
			flashes[i].To = 0.8f;
			flashes[i].Times = 3;
			flashes[i].Screenplay.OnBegin = OnBeginFlash;
			flashes[i].Screenplay.OnPlayFinish = FlashFinish;
			flashes[i].Screenplay.SetValue("flash",flashes[i]);
			flashes[i].Screenplay.SetValue("index",i);
		}
		
		progressScreenplay = new IComposedScreenplay(null);
		progressScreenplay.Init();
		progressScreenplay.OnBegin = OnComposedBegin;
		progressScreenplay.OnPlayFinish = OnComposedFinish;
		Darken();
	}
	
	private function OnBeginFlash(screenplay:IScreenplay)
	{
		var f:FlashLabel = screenplay.GetValue("flash") as FlashLabel; 
		var index:int = _Global.INT32(screenplay.GetValue("index"));
		var flashindex:int = _Global.INT32(screenplay.GetValue("flashindex")); 
		if(f == null) return;
		f.SetVisible(true);
		f.txt = ""; 
		bonus.Begin();
		var arm:Arm = GearData.Instance().CurrentArm;
		if(isBonusTip && flashindex == index)
		{ 
			f.txt = String.Format(Datas.getArString("Gear.EquipmentMightPlus"), GearManager.Instance().GetArmLvMight(arm.GDSID, index + 1));
			f.mystyle.normal.textColor = new Color(14.0f/255.0f,227.0f/255.0f,16.0f/255.0f,1.0f);
			f.mystyle.alignment = TextAnchor.MiddleCenter; 
		} 
		else
		{  
			isLevelupTip = true;
			
			SoundMgr.instance().PlayRelativeToGear(Constant.GearSoundName.OnlockGear);
			
			floatingSmall.txt = String.Format(Datas.getArString("Gear.EquipmentMightPlus"), GearManager.Instance().GetArmLvMight(arm.GDSID, index + 1));
			floatingSmall.mystyle.normal.textColor = new Color(14.0f/255.0f,227.0f/255.0f,16.0f/255.0f,1.0f);
			floatingSmall.BackRect = new Rect(f.rect.x,f.rect.y + f.rect.height / 2,f.rect.width,20); 
			floatingSmall.Begin();
		}
	}
	
	private function FlashFinish(screenplay:IScreenplay)
	{
		var f:FlashLabel = screenplay.GetValue("flash") as FlashLabel; 
		var index:int = _Global.INT32(screenplay.GetValue("index"));
		var flashindex:int = _Global.INT32(screenplay.GetValue("flashindex")); 
		if(f == null) return;
		isLevelupTip = false;
		if(isBonusTip && flashindex == index)
		{
			f.Begin();
		}
		else
		{
			f.Times = 3;
			f.SetVisible(false); 
			screenplay.SetValue("flashindex",-1); 
		}
		
	}
	
	private function UpdateFlash()
	{
		for(var i:int = 0;i<armPanel.skills.length;i++)
		{
			flashes[i].Update();
		}
		progressScreenplay.Update();
		
		UpdateProgress();
	}
	private function DrawFlash()
	{ 
		if(!isLevelupTip && !isBonusTip) return;
		for(var i:int = 0;i<armPanel.skills.length;i++)
		{ 
			flashes[i].Draw();
		}
	}
	private function OnPopOverFlash()
	{
		for(var i:int = 0;i<armPanel.skills.length;i++)
		{
			flashes[i].OnPopOver();
			UIObject.TryDestroy(flashes[i]);
		}
		
	}
	
	private function InitFlashMain()
	{
		if(flashMain != null)
		{
			flashMain.OnPopOver();
			flashMain = null;
		}
		flashMain = GameObject.Instantiate(flash);
		flashMain.Init();
		flashMain.rect = new Rect(armPanel.centerFore.rect);
		flashMain.rect.width -= 30;
		flashMain.rect.height -= 30;
		flashMain.rect.x = flashMain.rect.x + armPanel.rect.x + 15;
		flashMain.rect.y = flashMain.rect.y + armPanel.rect.y + 15;
		flashMain.useTile = true;
		//flashMain.tile.name = "city_background2";
		flashMain.tile = TextureMgr.instance().ElseIconSpt().GetTile("city_background2");
		flashMain.mystyle.normal.textColor = new Color(14.0f/255.0f,227.0f/255.0f,16.0f/255.0f,1.0f);
		flashMain.SetVisible(false);
		flashMain.From = 0.5f;
		flashMain.To = 0.8f;
		flashMain.Times = 3;
		flashMain.Screenplay.OnBegin = OnBeginMainFlash;
		flashMain.Screenplay.OnPlayFinish = MainFlashFinish;
		flashMain.Screenplay.SetValue("flash",flashMain);
	}
	private function BeginMainFlash()
	{
		flashMain.Begin();
	}
	private function OnBeginMainFlash(screenplay:IScreenplay)
	{
		if(screenplay == null) return;
		var l:FlashLabel = screenplay.GetValue("flash");
		if(l == null) return;
		l.SetVisible(true);
		if(mDragedItem == null) return;
		if(mDragedItem.TheArm == null) return;
		
		for(var w:int =0;w<flashes.length;w++)
		{
			flashes[w].Screenplay.Stop();
		}
		
		isBonusTip = true;
		l.txt = String.Format(Datas.getArString("Gear.EquipmentEXPPlus"), mDragedItem.TheArm.ToExperence);
		l.mystyle.normal.textColor = new Color(14.0f/255.0f,227.0f/255.0f,16.0f/255.0f,1.0f);
		l.mystyle.alignment = TextAnchor.MiddleCenter;  
		var list:List.<int> = armPanel.GetLevelUpIndex(armPanel.Experence,armPanel.Experence + mDragedItem.TheArm.ToExperence); 
		var n:int = list.Count;
		if(n <= 0) return; 
		for(var i:int =0;i<n;i++)
		{
			var j:int = list[i];
			flashes[j].Screenplay.SetValue("flashindex",j);
			flashes[j].Times = 1;
			flashes[j].Begin();
		}
		
	}
	private function MainFlashFinish(screenplay:IScreenplay)
	{
		isBonusTip = false; 
		if(screenplay == null) return;
		var l:FlashLabel = screenplay.GetValue("flash");
		if(l == null) return;
		
		if(mDragedItem == null)
			l.SetVisible(false);
		else
			BeginMainFlash();
	}	
	private function UpdateFlashMain()
	{
		if(mDragedItem == null) 
			flashMain.SetVisible(false);
		flashMain.Update();
	}
	private function DrawFlashMain()
	{
		flashMain.Draw();
	}
	
	
	//----------------------------------
	//circle progress bar
	private var singleScreenplay:ArcOutScreenplay;
	private var progressScreenplay:IComposedScreenplay;
	private function UpdateProgress()
	{
		var isCircle:Object = progressScreenplay.GetCurrentValue("isCircle");
		if(isCircle != null)
		{
			var from:double = _Global.DOULBE64(progressScreenplay.GetCurrentValue("from"));
			var to:double = _Global.DOULBE64(progressScreenplay.GetCurrentValue("to"));
			armPanel.OnExperenceChanged(progressScreenplay.data.S * (to - from) + from);
		}
	}
	//----------------------------------
	//floating
	public var floating:FloatingLabel;
	public var floatingSmall:FloatingLabel;
	private var isComposedAnimated:boolean;
	
	private function InitFloating()
	{	
		floating.Init(); 
		floatingSmall.Init();
		isComposedAnimated = false;
	}
	
	private function DrawFloating()
	{
		floating.Draw(); 
		if(!flashMain.isVisible() && isBonusTip) return;
		floatingSmall.Draw();
	}
	
	private function UpdateFloating()
	{
		floating.Update(); 
		floatingSmall.Update();
	}
	
	private function OnUnLockNotOK(msg:String, errorCode:String)
	{
		SetCanEat(true);
		if (errorCode.Equals("3116"))
		{
		
		}
	}
	
	private function OnUnLockOK(id:int,old:int,experence:int)
	{
		SetCanEat(true);
		if(GearData.Instance().CurrentArm.PlayerID != id) return;
		floating.txt = String.Format(Datas.getArString("Gear.EquipmentEXPPlus"), (experence - old));
		floating.mystyle.normal.textColor = new Color(14.0f/255.0f,227.0f/255.0f,16.0f/255.0f,1.0f);
		if(armPanel != null && armPanel.centerArm != null)
			floating.BackRect = new Rect(armPanel.centerArm.rect.x,armPanel.centerArm.rect.y + armPanel.centerArm.rect.height / 2,armPanel.centerArm.rect.width,20);
		DestroyDragedItem();
		var levels:int[] = armPanel.LevelExperence;
		if(levels == null) return;
		if(old >= experence) return;
		progressScreenplay.Clear();
		progressScreenplay.SetValue("experence",experence);
		for(var i:int = 1;i<levels.length;i++)
		{
			if(old < levels[i])
			{
				if(GearData.Instance().CurrentArm.Skills[i-1].ID == Constant.Gear.NullSkillID) continue;
				var singleScreenplay:ArcOutScreenplay = new ArcOutScreenplay();
				singleScreenplay.Init();
				var from:double = Mathf.Max(levels[i-1],old);
				singleScreenplay.SetValue("isCircle",singleScreenplay);
				singleScreenplay.SetValue("from",from);	

				singleScreenplay.OnPlayFinish = OnPlayFinish;
				singleScreenplay.Stop();
				progressScreenplay.Add(singleScreenplay);
				
				if(experence >= levels[i])
				{
					var l:double = levels[i];
					singleScreenplay.SetValue("to",l);
					flashes[i-1].Screenplay.Stop();

					progressScreenplay.Add(flashes[i-1].Screenplay);
					if(GearData.Instance().CurrentArm != null)
						GearData.Instance().CurrentArm.StarLevel = i;
					
					var might:long = GearManager.Instance().GetArmLvMight(GearData.Instance().CurrentArm.GDSID,i);
					might += KBNPlayer.Instance().getMight();
					KBNPlayer.Instance().setMight(might);	
				}
				else if(experence < levels[i])
				{
					singleScreenplay.SetValue("to",experence);
					break;		
				}
			}
		}
		
		progressScreenplay.Begin(0.0f,0.0f,Mathf.PI * 2);
		Remove();
		Finish();
	}
	private function OnPlayFinish(screenplay:IScreenplay)
	{
		var a:int = 1;
	}
	
	
	private function OnComposedBegin(screenplay:IScreenplay)
	{
		SetCanEat(false);
		isComposedAnimated = true;
		
		SoundMgr.instance().PlayRelativeToGear(Constant.GearSoundName.IncreaseGearEXP);
	}
	private function OnComposedFinish(screenplay:IScreenplay)
	{
		SetCanEat(true);
		isComposedAnimated = false;
		progressScreenplay.Clear();
		
		var experence:int = _Global.INT32(progressScreenplay.GetValue("experence"));
		armPanel.OnExperenceChanged(experence);
		for(var i:int = 0;i<armPanel.skills.length;i++)
		{
			flashes[i].Screenplay.OnPlayFinish = FlashFinish;
		}		
		floating.Begin();
	}

	//======================================================================================================
	public var flashhilight:FlashLabel;
	
	private function InitFlashHilight()
	{ 
		if(flashhilight == null) return;
		flashhilight.Init();
		flashhilight.From = 0.2f;
		flashhilight.To = 0.8f;
		flashhilight.Times = 1;
		flashhilight.Screenplay.OnPlayFinish = OnFlashFinish;
		GearManager.Instance().SetImageNull(flashhilight);
		flashhilight.mystyle.normal.background = TextureMgr.instance().LoadTexture("kuang",TextureType.DECORATION);
		flashhilight.rect = new Rect(scrollBackground.rect);
		
		flashhilight.mystyle.border.left = 8;
		flashhilight.mystyle.border.right = 8;
		flashhilight.mystyle.border.top = 8;
		flashhilight.mystyle.border.bottom = 8;
		Darken();
	}
	public function Hilighten()
	{
		if(flashhilight == null) return;
		flashhilight.SetVisible(true);
		flashhilight.Begin();
	}
	
	public function Darken()
	{
		if(flashhilight == null) return;
		flashhilight.SetVisible(false);
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
	private function UpdateFlashHilight()
	{
		if(flashhilight == null) return;
		flashhilight.Update();
	}
	
	private function DrawFlashHilight()
	{ 
		if(flashhilight == null) return;
		flashhilight.Draw();
	}
	//======================================================================================================
	//Open Dialog
	
	private function OpenRareDialog()
	{
		OpenDialog(Datas.getArString("Gear.UseGearPopDesc"),RareOK,RareCancel);
	}

	
	private function OpenDialog(content:String, okFunc:System.Action.<Object>, cancelFunc:System.Action.<Object>)
	{
		var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		dialog.setLayout(600, 380);
		dialog.setTitleY(60);
		dialog.setContentRect(70, 140, 0, 100);
		MenuMgr.getInstance().PushConfirmDialog(content, "", okFunc, cancelFunc, true);
		dialog.btnClose.SetVisible(false);
		// dialog.setDefaultButtonText();
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
		skillButton.TouchRect = new Rect(skillButton.rect.x - 15,skillButton.rect.y - 15, skillButton.rect.width + 30, skillButton.rect.height + 30);
		GestureManager.Instance().RegistTouchable(skillButton);
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
		MenuMgr.getInstance().PushMenu("SkillInformationMenu", SkillInformationMenu.MenuType.Grade, "trans_horiz" );
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
	//flash bonus
	public var bonus:FlashLabel;
	private var isBonusTip:boolean;
	private function InitBonus()
	{
		bonus.Init();
		bonus.From = 0.2f;
		bonus.To = 0.8f;
		bonus.Times = 3;
		bonus.mystyle.normal.background = TextureMgr.instance().LoadTexture("payment_light",TextureType.DECORATION);  
		var r:Rect = new Rect(armPanel.star.rect);
		r.x += armPanel.rect.x;
		r.y += armPanel.rect.y - 5;
		bonus.rect = r; 
		bonus.SetVisible(false); 
		bonus.Screenplay.OnPlayFinish = BonusFlashFinish; 
		bonus.Screenplay.OnBegin = BonusFlashBegin;
	}
	private function UpdateBonus()
	{
		bonus.Update();
	}
	private function BonusFlashBegin(screenplay:IScreenplay)
	{
		bonus.SetVisible(true);
	}
	private function BonusFlashFinish(screenplay:IScreenplay)
	{
		bonus.SetVisible(false);
	}
	private function DrawBonus()
	{
		if(!isLevelupTip && !isBonusTip) return;
		bonus.Draw();
	}	
	//======================================================================================================
	//tip and drag item
	public var cannotEquipTips:InfoTipsBar;	
	
	private	function ShowCantEquipTips( condition:GearEquipment.CantEquipCondition ):void
	{
		var	strKey:String = "Gear.KnightsOutside";
		
		switch( condition ){
			case	GearEquipment.CantEquipCondition.KNIGHT_OUTSIDE:
			strKey = "Gear.KnightsOutside";
			break;
			
			case	GearEquipment.CantEquipCondition.KNIGHT_LV_NOT_MET:
			strKey = "Gear.KnightsLvNotMet";
			break;
		}
		cannotEquipTips.StopTime = 5.0f;
		cannotEquipTips.setInfoContent(Datas.getArString(strKey));
		cannotEquipTips.Show();
	}	
	
	private var isAnimated:boolean;
	private function DrawDragedItem()
	{
		if(mDragedItem != null)	
		{
			mDragedItem.Draw(); 
			if(eventTime >= 1.0f && !isAnimated)
			{
				DestroyDragedItem();
				armSelect.UpdateCurrent();
			}
		}
		else 
			isAnimated = false;		
	}
	private function DestroyDragedItem()
	{
		if(mDragedItem == null) return;
		if(mDragedItem.lblIcon != null && mDragedItem.TheArm.GDSID != GearData.Instance().CurrentArm.GDSID)
			Resources.UnloadAsset(mDragedItem.lblIcon.mystyle.normal.background);
		mDragedItem.OnPopOver();
		mDragedItem = null;
	}

	//======================================================================================================
	private var eventTime:double = 0.0f;
	private function UpdateEventTime()
	{
		eventTime += Time.deltaTime;
		
	}
	
	private function InitButton()
	{
		forwardButton.setNorAndActBG("gear_button_flip_right_normal","gear_button_flip_right_down");
		backwardButton.setNorAndActBG("gear_button_flip_left_normal","gear_button_flip_left_down");

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
		tipHelp.txt = Datas.getArString("Gear.HelpStrengthen");
		tipHelp.alphaEnable = true;
		tipHelp.alpha = 0.0f;
		
		tipHelp2.Init();
		
		tipHelp2.From = 1.0f;
		tipHelp2.To = 1.0f;
		tipHelp2.Times = 0;
		tipHelp2.Accelerate = Mathf.PI / 16;
		tipHelp2.txt = Datas.getArString("Gear.StrenthenTip");		
		
		
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