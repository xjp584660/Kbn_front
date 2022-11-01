


public class GearSkillEnhancement extends TabContentUIObject implements ITouchable,GestureReceiver
{	
	
	public var panels:StonePanel[];
	
	
	
	public function Init()
	{
		InitSequenceButton();
		InitWeaponsView();
		InitArcControl(); 
		
		InitAbsoluteRect();
		InitMount();
		//InitPanel();
		InitTransition();
		InitNet();
		InitScrollBackground(); 
		tip.Init();
		cannotEquipTips.Init();
		cannotEquipTips.setInfoContent(Datas.getArString("Gear.KnightsOutside"));		
		InitFlash();
		InitOcupied();
		InitTimer();
		InitHelp();
		GestureManager.Instance().RegistReceiver(this);
		GestureManager.Instance().RegistTouchable(this);
		GearData.Instance().AddArmListener(this);
		
	}
	
	
	
	
	public function Update()
	{
		
		UpdateMount();
		if(mDragedItem == null)
			stonesView.Update();
		stoneSelect.Update();
		UpdateTransition();
		UpdateNet();
		UpdateFlash();
		cannotEquipTips.Update();
		UpdateTimer();
		UpdateHelp();
	}
	/*
	private static var check:int = 0;
	private function UpdateCheck()
	{
		check ++;
		if(check < 100) return;
		check = 0;
		if(stonesView == null) return;
		var n:int = stonesView.numUIObject;
		for(var i:int = 0;i<n;i++)
		{
			var ui:UIObject = stonesView.getUIObjectAt(i);
			if(ui == null) 
			{
				stoneSelect.UpdateCurrent();
				break;
			}
		}
		
	}
	*/
	
	public function Draw()
	{ 
		scrollBackground.Draw();
		DrawInterface(); 
		DrawMount();
		//DrawPanels();
		DrawTransition(); 
		DrawSequenceButton();
		stonesView.Draw();
		stoneSelect.Draw();
		if(mDragedItem != null)
			mDragedItem.Draw();
		//DrawArmInformation();
		DrawFlash();
		tip.Draw();
		DrawOcupied();
		cannotEquipTips.Draw();
		DrawHelp();
	}
	//======================================================================================================
	//arcselect control
	private var stoneSelect:GearStoneSelect;
	public var arcSelectControl:ArcSelectControl;
	
	private function InitArcControl()
	{	
		stoneSelect = new GearStoneSelect();
		stoneSelect.arcSelectControl = arcSelectControl;
		stoneSelect.stonesView = stonesView;
		stoneSelect.sortFunction = stoneSort.SortFunction;
		stoneSelect.OnSelect = OnArmSelect;
		stoneSelect.Init();
		GestureManager.Instance().RegistTouchable(arcSelectControl);
	}
	private function OnArmSelect(index:int)
	{
		Hilighten();
	}
	
	private function UpdateArcSelect()
	{
		stoneSelect.Update();
	}
	
	private function DrawArcSelect()
	{
		if(mDragedItem != null)
			stoneSelect.DisableInput = true;	
		else
			stoneSelect.DisableInput = false;
	
		stoneSelect.Draw();
	}
	
	public function get StoneSelect() : GearStoneSelect
	{
		return stoneSelect;
	}
	
	//======================================================================================================
	//stonesView
	public var stoneItem:StoneItem;
	public var stonesView:ScrollList;
	private function InitWeaponsView()
	{
		canItem = true;
		//stonesView.Init();
		//stonesView.AutoLayout();
		stonesView.SetZOrder(1);
		stonesView.Init(stoneItem);
		GestureManager.Instance().RegistTouchable(stonesView);
	}

	private function Add(i:StoneItem)
	{
		//if(i == null) return;
		
		stoneSelect.UpdateCurrent();
		//this.stonesView.AddElemInNewComponent(i);
		//stonesView.WillSort(stoneSelect.sortFunction);
		//stonesView.RunAutoLayoutAfterCache();
	}
	
	private function Remove(i:StoneItem)
	{
		//if(i == null) return;
		
		stoneSelect.UpdateCurrent();
		//this.stonesView.RemoveElemInNewComponent(i);
		//stonesView.WillSort(stoneSelect.sortFunction);
		//stonesView.RunAutoLayoutAfterCache();
	}
	/*
	private function Find(id:int):StoneItem
	{
		var n:int = stonesView.numUIObject;
		for(var i:int = 0;i<n;i++)
		{
			var item:StoneItem = stonesView.getUIObjectAt(i) as StoneItem;
			if(item == null) continue;
			if(item.Id == id) return item;
		}
		return null;
	}
	*/
	
	private function Add(id:int,count:int)
	{
		GearManager.Instance().AddItem(id,count);
		Add(null);
//		var item:StoneItem = Find(id);
		
//		if(item == null)
//			Add(GearItems.Instance().CreateScrollStoneItem(id,count));
//		else
//			item.Count += count;
	}
	
	private function Remove(id:int,count:int)
	{
		GearManager.Instance().SubstractItem(id,count);
		Remove(null);
/*		var item:StoneItem = Find(id);
		if(item == null) return;
		if(item != null)
			item.Count -= count;
		if(item.Count <= 0)
			Remove(item);
*/	}
	
	private function Clear()
	{
		//this.stonesView.WillClear();
		this.stonesView.Clear();
	}
	
	//======================================================================================================
	//Sort
	public var sequenceButton:Button; 
	private var stoneSort:StoneSort;
	
	private function InitSequenceButton()
	{
		stoneSort = new StoneSort();
		stoneSort.sequenceButton = sequenceButton;
		stoneSort.OnSortChanged = OnSortChanged;
		stoneSort.Init();
	}
	private function OnSortChanged()
	{
		stoneSelect.sortFunction = stoneSort.SortFunction;
		Hilighten();
		//stoneSelect.UpdateCurrent();
	}
	private function DrawSequenceButton()
	{
		stoneSort.Draw();
	}
	
	//======================================================================================================
	//receive interface 
	private var receiverActivated:System.Action.<GestureReceiver>;
	private var canItem:boolean = true;
	
	private function OnAction(type:GestureManager.GestureEventType,time:Object)
	{
		if(type == GestureManager.GestureEventType.SlideOver)
		{
			canItem = true;
			
		}
	}
	
	private function OnOcupiedTouchable(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var it:OcupiedTouchable; 
		it = item as OcupiedTouchable;
		if(it == null) return;
		
	
		if(type == GestureManager.GestureEventType.LongPress)
		{

		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
		
		}
		else if(type == GestureManager.GestureEventType.LongMove)
		{
		
		}
		else if(type == GestureManager.GestureEventType.Clicked)
		{
			OnPanelClick(it.tag as StonePanel);
		} 
		else if(type == GestureManager.GestureEventType.DoubleClicked)
		{

		}									
		
	}
	private function OnSequence(type:GestureManager.GestureEventType, item:ITouchable, time:Object) 
	{ 
		HideTip();
		if(type == GestureManager.GestureEventType.LongMove)
		{
			OnLongMove();
		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnOnlyWindowRelease();
		}
		else if(type == GestureManager.GestureEventType.Clicked)
		{
			if (NewFteMgr.Instance().IsDoingFte)
				return;
			stoneSort.OnSequenceClick();
		}
		else if(type == GestureManager.GestureEventType.DoubleClicked)
		{
			if (NewFteMgr.Instance().IsDoingFte)
				return;
				
			stoneSort.OnSequenceClick();
		}
		else if(type == GestureManager.GestureEventType.SlideMove)
		{
			InputCurrent();
			canItem = false;
		}
		else if(type == GestureManager.GestureEventType.SlideOver)
		{
			Finish();
			canItem = true;
			
		}

	}
	
	private function OnArc(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		HideTip();
		if(type == GestureManager.GestureEventType.LongMove)
		{
			OnLongMove();
		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnOnlyWindowRelease();
		}
		else if(type == GestureManager.GestureEventType.SlideMove)
		{
			InputCurrent();
			canItem = false;
		}
		else if(type == GestureManager.GestureEventType.SlideOver)
		{
			Finish();
			canItem = true;
			
		}
		
		
	}
	
	// Fte use
	private function IsCanOpItemByFte(item:StoneItem):boolean
	{
		// Check is fte allow operate item
		var doingFte:NewFte = NewFteMgr.Instance().GetCurrentFte;
		if (doingFte && doingFte.CurrStep)
		{
			if ((doingFte.CurrStep.Action as GuideDragDropped))
			{
				var fteOpItem:StoneItem = doingFte.CurrStep.Action.TraceUIObj as StoneItem;
				if (null != fteOpItem && null != item && fteOpItem.Id != item.Id)
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
		if(!canItem) return;
		var it:StoneItem; 
		it = item as StoneItem;
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
			//OnLongMove();
			
		}
		else if(type == GestureManager.GestureEventType.Clicked)
		{
			HideTip();
		} 
		else if(type == GestureManager.GestureEventType.DoubleClicked)
		{
			 OnDoubleClick(it);
			 HideTip();
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
			if (NewFteMgr.Instance().IsDoingFte)
				stonesView.updateable = false;
			else
				stonesView.updateable = true;
			
		}
		else if(type == GestureManager.GestureEventType.SlideMove)
		{
			canItem = false;
		}
		else if(type == GestureManager.GestureEventType.SlideOver)
		{
			canItem = true;
		}
		else if(type == GestureManager.GestureEventType.Clicked)
		{
			HideTip();
		}
		else if(type == GestureManager.GestureEventType.DoubleClicked)
		{
			HideTip();
		}					
		
		
	}
	private function OnOnlyWindow(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var gear:GearSkillEnhancement;
		gear = item as GearSkillEnhancement;
		if(gear == null) return;
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
		else if(type == GestureManager.GestureEventType.DoubleClicked)
		{
			
		}					
		
	}	
	private function OnWindow(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var gear:GearSkillEnhancement;
		gear = item as GearSkillEnhancement;
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
	

	
	private function OnStonePanel(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var pan:StonePanel;
		pan = item as StonePanel;
		if(pan == null) return;
		
	
		if(type == GestureManager.GestureEventType.LongPress)
		{
			OnPanelLongPress(pan);
		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			OnPanelRelease(pan);
			OnPanelReleaseTran(pan);
		}
		else if(type == GestureManager.GestureEventType.LongMove)
		{
			OnPanelMove(pan);
		}
		else if(type == GestureManager.GestureEventType.Clicked)
		{
			//OnPanelClick(pan);
			HideTip();
		}
		else if(type == GestureManager.GestureEventType.DoubleClicked)
		{
			
		}
		
	}
	private function OnArmItem(type:GestureManager.GestureEventType, item:ITouchable, time:Object)
	{
		var armItem:KnightInfoEquipItem;
		armItem = item as KnightInfoEquipItem;
		if(armItem == null) return;
		HideTip();
		if(type == GestureManager.GestureEventType.LongPress)
		{
			OnArmItemLongPress();
		}
		else if(type == GestureManager.GestureEventType.LongRelease)
		{
			
		}
		else if(type == GestureManager.GestureEventType.LongMove)
		{
			
		}
		else if(type == GestureManager.GestureEventType.Clicked)
		{
			
		}
		else if(type == GestureManager.GestureEventType.DoubleClicked)
		{
			
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
		if(MenuMgr.getInstance().Top().menuName != "ArmMenu") return;
		if(!IsGestureValid()) return;
		if(touchables == null) return;
		if(touchables.Count <= 0) return; 
		
		
		
		var arc:ArcSelectControl;
		for(var item:ITouchable in touchables)
		{
			if(item.GetName() == "seq") 
			{	
				OnSequence(type,item,time);
				return;
			}
		
			arc = item as ArcSelectControl;
			if(arc != null) 
			{	
				OnArc(type,item,time);
				break;
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
			OnStonePanel(type,item,time);
			OnArmItem(type,item,time); 
			OnOcupiedTouchable(type,item,time);
			OnOcupied(type,item,time);
		}
		OnAction(type,time);
	} 
	
	public function SetReceiverActiveFunction(Activated:System.Action.<GestureReceiver>) 
	{
		receiverActivated = Activated;
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
	//drag		
	private var lineAnimation:LineGUIAnimation;
	private var mDragedItem:StoneItem = null;
	private function DestroyDragedItem()
	{
		if(mDragedItem == null) return;
		mDragedItem.OnPopOver();
		mDragedItem = null;
	}
	private function OnLongPress(item:StoneItem)
	{  
		if(item == null) return; 
		if(item.tagItem == null) return;
		if(item.tagItem.type ==  StoneItem.ItemType.Move) return;
		if(transition.IsTransiting ) return;
		var id:int = item.Id;
		
		var knightid:int = GearData.Instance().CurrentArm.KnightID;
		var knight:Knight = GearManager.Instance().GearKnights.GetKnight(knightid);
		if(knight != null)
		{
			if(General.instance().getGeneralStatus(knight.CityID,knight.KnightID) != Constant.GeneralStatus.IDLE)
			{
				ShowCantEquipTips(GearEquipment.CantEquipCondition.KNIGHT_OUTSIDE);
				return;
			}
		}
		
		if(item.tagItem.type ==  StoneItem.ItemType.Mount)
		{
			if(item.tagItem.mountPanel == null) return; 
			
			item.tagItem.mountPanel.Drop();
			Save();
		}
		else if(item.tagItem.type ==  StoneItem.ItemType.Scroll)
		{
			
			Remove(id,1);
			var arm:Arm = GearData.Instance().CurrentArm;
			if(panels != null && arm != null)
			{	
				for(var i:int = 0;i<panels.length;i++)
				{
					panels[i].SkillActive = GearManager.Instance().CanMount(arm,panels[i].Skill,id);//(panels[i].Skill.ID,item.Id);//(arm,panels[i].Skill,item.Id);
					if(panels[i].SkillActive)
					{
						panels[i].addition.SetVisible(true);
						panels[i].addition.txt = GearManager.Instance().GetCompareSkillData(arm,panels[i].Skill,id);
						//panels[i].addition.mystyle.normal.textColor = new Color(14.0f/255.0f,227.0f/255.0f,16.0f/255.0f,1.0f);
						panels[i].addition.normalTxtColor = FontColor.New_GearGem_Green;
						panels[i].ShowCircle();
					}
				}
			}
		}
		
	 	mDragedItem = KBN.GearItems.Instance().CreateMoveStoneItem(id,1);
		mDragedItem.tagItem.sourceType = item.tagItem.type;
		
		NewFteMgr.Instance().OnTraceDragDropBegin("mDragedItem", this);
	}
	
	private function OnLongRelease(item:StoneItem)
	{
		if(item == null) return;
		if(mDragedItem == null) return; 
		var id:int;
		if(item.tagItem.type == StoneItem.ItemType.Scroll)
		{  
			NewFteMgr.Instance().OnTraceDragDropDone(mDragedItem, StoneItem.ItemType.Scroll);
			Add(mDragedItem.Id,1);
		}		
		DestroyDragedItem();
		
	}
	
	
	private function OnLongMove()
	{
		if(mDragedItem != null)
		{
			var v2:Vector2;
			v2 = Input.mousePosition; 
			v2 = _Global.TransCoordFromScrren(v2);
			var r:Rect = new Rect(mDragedItem.rect);
			r.x = v2.x;
			r.y = v2.y;
			
			mDragedItem.rect = _Global.CalculateLeftTopFromCenter(r);
		}
		//InputCurrent();
	}
	
	
	private function OnWindowRelease()
	{
		DestroyDragedItem();
		//Finish();
		
		ResetPanelState();
	}
	
	
	private function OnScrollRelease()
	{ 
		ResetPanelState();
		if(mDragedItem == null) return;
		
		NewFteMgr.Instance().OnTraceDragDropDone(mDragedItem, GearScrollViewItem.ItemType.Scroll);
		
		Add(mDragedItem.Id,1);
		DestroyDragedItem();
	}
	
	private function OnOnlyWindowPress()
	{
		//Begin();
	}
	private function OnOnlyWindowMove()
	{
		//InputCurrent();
	}
	private function OnOnlyWindowRelease()
	{
		if(mDragedItem == null) return;
		
		NewFteMgr.Instance().OnTraceDragDropDone(mDragedItem, GearScrollViewItem.ItemType.Scroll);
		
		Add(mDragedItem.Id,mDragedItem.Count);
		DestroyDragedItem();
		//Finish();
	}
	

	
	private function OnDoubleClick(item:StoneItem)
	{
		if(item.tagItem.type == StoneItem.ItemType.Mount)
		{ 
			if (!IsCanOpItemByFte(item)) return;
			
			OnLongPress(item);
			OnLongMove(); 
			OnOnlyWindowRelease();
		}
		
	}
	private function OnPanelLongPress(pan:StonePanel)
	{
		
	}
	
	private function OnPanelRelease(pan:StonePanel)
	{
		if(mDragedItem == null) return;
		if(pan == null) return;
		if(pan.Skill == null) return;
		
		if(!GearManager.Instance().CanMount(GearData.Instance().CurrentArm,pan.Skill,mDragedItem.Id)) 
		{
			NewFteMgr.Instance().OnTraceDragDropDone(mDragedItem, StoneItem.ItemType.Scroll);
			ShowCantEquipTips(GearEquipment.CantEquipCondition.CANNOT_MOUNT);
			Add(mDragedItem.Id,1);
			DestroyDragedItem();
			return;
		}
		NewFteMgr.Instance().OnTraceDragDropDone(mDragedItem, StoneItem.ItemType.Mount);

		var id:int = pan.Drop();
		if(id != -1) Add(id,1);

		pan.Mount(mDragedItem.Id,mDragedItem.Count);
		Save();
		DestroyDragedItem();
	}
	private function OnPanelReleaseTran(pan:StonePanel)
	{
		//Finish();
	}	
	private function OnPanelMove(pan:StonePanel)
	{
		//InputCurrent();
	}
	private function OnPanelClick(pan:StonePanel)
	{
		if(pan == null) return;
		if(pan.Skill == null) return; 
		if(!HideTip())
		{
			tip.TheArm = GearData.Instance().CurrentArm;
			tip.Skill = pan.Skill;  
			ShowTip(pan);
		}
	}
	
	private function OnArmItemLongPress()
	{
		//Begin();
	}
	
	public var tip:ArmSkillTip;
	//======================================================================================================
	//on push
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		OnSelect();
		
		GestureManager.Instance().RegistTouchable(armInformationItem);
	}
	
	public function OnInActive()
	{
		HideTip();
		stoneSelect.Stop();
	}
	
	
	public function OnPopOver()
	{
		transition.OnPopOver();
		GestureManager.Instance().RemoveTouchable(this);
		GestureManager.Instance().RemoveTouchable(stonesView);
//		GestureManager.Instance().RemoveReceiver(this);
		GestureManager.Instance().RemoveTouchable(arcSelectControl);
		GearData.Instance().RemoveArmListener(this);
		
		//stonesView.clearUIObject();
		stonesView.Clear();
		
		transition.OnPopOver();
		mount.OnPopOver();
	}
	
	//======================================================================================================
	//KnightInfoEquipItem
	public var armInformationItem:KnightInfoEquipItem;
	
	//======================================================================================================
	// transition

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
		
		if(mDragedItem != null) 
		{
			//Finish();
			return;
		}
	 	if(transition.IsTransiting ) return;
		var pre:Arm = GearData.Instance().PreviousArm;
		var next:Arm = GearData.Instance().NextArm;
		var current:Arm = GearData.Instance().CurrentArm;
		if(!transition.IsTransiting)
			canShowPanel = false;
					
		var data1:KnightInfoEquipItem.UIData = null; 
		if(pre != null)
			data1 = new KnightInfoEquipItem.UIData(pre,KnightInfoEquipItem.VisitSourceType.Mount);
		var data2:KnightInfoEquipItem.UIData = null; 
		if(current != null)
			data2 = new KnightInfoEquipItem.UIData(current,KnightInfoEquipItem.VisitSourceType.Mount);
		var data3:KnightInfoEquipItem.UIData = null; 
		if(next != null)
			data3= new KnightInfoEquipItem.UIData(next,KnightInfoEquipItem.VisitSourceType.Mount);
		
		
		transition.Begin(mount,[data1,data2,data3]);
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
		mount.SetPanels(GearData.Instance().CurrentArm);
	}
	
	private function OnFinish(side:int)
	{
		canShowPanel = true;
		if(side == -1) GearData.Instance().ShiftPreviousArm();
		if(side == 1) GearData.Instance().ShiftNextArm();	
		armInformationItem.VisitSource = KnightInfoEquipItem.VisitSourceType.Mount;
		armInformationItem.Data = (GearData.Instance().CurrentArm);		
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
		if(mDragedItem != null) 
		{
			Finish();
			return;
		}	
	
		transition.InputCurrent();
	}
	//======================================================================================================
	// Net
	private var netTimer:Timer;
	//private var saveInterval:double;
	
	
	private function InitNet()
	{
		netTimer = new Timer();
		netTimer.Init();
		netTimer.OnTime = OnTime;
		netTimer.Begin(Constant.Gear.NetInterval,null);
		//saveInterval = 0.0f;
	}	
	private function OnTime()
	{
		//Save(GearData.Instance().CurrentArm);
	}
	
	private function UpdateNet()
	{
		netTimer.Update();
		//saveInterval += Time.deltaTime;
	}
	
	public function OnPop()
	{
		
		//Save(GearData.Instance().CurrentArm);
		netTimer.Stop();
	}
	
	private function Save()
	{
/*		if(arm == null) return;
		if(arm.Skills == null) return;
		var id:int = arm.PlayerID;
		var ids:int[] = new int[arm.Skills.Count];
		
		for(var i:int = 0;i<arm.Skills.Count;i++)
		{
			ids[i] = arm.Skills[i].Stone;
		}
	if(isChanged)
			GearNet.Instance().knightGearMount(id,ids);
*/
		GearNet.Instance().EnMountQueue(GearData.Instance().CurrentArm);
		//saveInterval = 0.0f;
	}
	public function OnCurrentArmChanged(o:Arm,n:Arm)
	{
		mount.SetPanels(n);
		//Save(o);
		if(armInformationItem != null)
		{
			armInformationItem.VisitSource = KnightInfoEquipItem.VisitSourceType.Mount;
			armInformationItem.Data = (GearData.Instance().CurrentArm);
		}		
		TransitionOnArmChanged();

		var name:String;
		if (String.IsNullOrEmpty(n.RemarkName))
		{		
			OnSetTitle(Datas.getArString("gearName.g"+n.GDSID));
		}else{
			OnSetTitle(n.RemarkName);
		}
	}
	public function OnExperenceChanged(o:int,n:int)
	{
		
	}

	//======================================================================================================
	//scrollBackground
	public var scrollBackground:Label;
	private function InitScrollBackground()
	{
		if(scrollBackground == null) return;
		scrollBackground.useTile = false;
		scrollBackground.mystyle.normal.background = TextureMgr.instance().LoadTexture("tool bar_bottom", TextureType.BACKGROUND);
		scrollBackground.Init();
	}
	
	//======================================================================================================
	public function OnSelect()
	{
		if(GearData.Instance().CurrentArm == null) return;
		tipHelp.Begin();
		mount.OnPush(null);
		if(stoneSelect != null)
		{
			stoneSelect.SetStoneType(stoneSelect.CurrentType);
			stoneSelect.UpdateCurrent();
		}
		if(armInformationItem != null)
		{
			armInformationItem.VisitSource = KnightInfoEquipItem.VisitSourceType.Mount;
			armInformationItem.Data = (GearData.Instance().CurrentArm);
		}
		
	}
	private function SetSkills(arm:Arm)
	{
		if(arm == null) return;
		var n:int = Mathf.Min(arm.Skills.Count,panels.length);
		for(var i:int = 0; i < n;i++)
		{
			panels[i].Skill = arm.Skills[i];
			panels[i].Active = GearManager.Instance().IsReadyForMount(arm,arm.Skills[i]);
		}
	}
	//======================================================================================================
	//Mount Panel
	
	@SerializeField
	private var mount:MountPanel;
	
	public function InitMount()
	{
		mount.item = armInformationItem; 
		//mount.panels = panels;
		mount.Init(panels);
	}
	public function UpdateMount()
	{
		mount.Update();
	}
	
	public function DrawMount()
	{
		if(canShowPanel)
			mount.Draw();
	}
	private function ResetPanelState()
	{
		var arm:Arm = GearData.Instance().CurrentArm;
		if(panels != null && arm != null)
		{	
			for(var i:int = 0;i<panels.length;i++)
			{
				panels[i].SkillActive = false;
				
				panels[i].addition.txt = "";
				panels[i].HideCircle();
				GearManager.Instance().SetAdditionText(panels[i]);
			}
		}
		
	}
	
	//======================================================================================================
	//flash
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
		if(stoneSelect != null)
		{
			stoneSelect.Reset = true;
			stoneSelect.UpdateCurrent();
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
	//tip
	private var currentPanel:StonePanel;
	public var cannotEquipTips:InfoTipsBar;
	
	private function ShowTip(panel:StonePanel)
	{
		if (NewFteMgr.Instance().IsDoingFte)
		{
			return;
		}
		
		if(tip == null) return;
		tip.Show();
		if(panel != null)
		{
			currentPanel = panel;
			currentPanel.Hilighten();
		}
	}
	private function HideTip():boolean
	{
		if(currentPanel != null)
			currentPanel.Darken();
		currentPanel = null;
		
		if(tip == null) return false;
		
		if(tip.IsShow())
		{
			tip.Hide();
			return true;
		}
		if(cannotEquipTips.IsShow())
		{
			cannotEquipTips.Hide();
			return true;
		}				
		
		return false;
	}
	private	function ShowCantEquipTips( condition:GearEquipment.CantEquipCondition ):void
	{
		var	strKey:String = "Gear.KnightsOutside";
		
		switch( condition )
		{
			case	GearEquipment.CantEquipCondition.KNIGHT_OUTSIDE:
			strKey = "Gear.KnightsOutside";
			break;
			
			case	GearEquipment.CantEquipCondition.KNIGHT_LV_NOT_MET:
			strKey = "Gear.KnightsLvNotMet";
			break;  
			
			case	GearEquipment.CantEquipCondition.CANNOT_MOUNT:
			strKey = "Gear.EquipmentInactiveDesc";
			break; 
		}
		cannotEquipTips.StopTime = 5.0f;
		cannotEquipTips.setInfoContent(Datas.getArString(strKey));
		cannotEquipTips.Show();
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
		stonesView.updateable = false;
		timer.Stop();
	}
	
	private function UpdateTimer()
	{
		timer.Update();
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
		tipHelp.txt = Datas.getArString("Gear.EmbedTip");
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
