#pragma strict
import System.Timers;
import System;

class NewFteStep
{
	private var stepData:NewFteStepData = null;
	
	//-----------------------------------------------------
	private var actionEntity:StepAction = null; 
	private var doneDelegate:Function;
	//-----------------------------------------------------
	
	//-----------------------------------------------------
	public function NewFteStep(data:NewFteStepData)
	{
		stepData = data;
	}
	
	public function get StepData():NewFteStepData { return stepData; }
	public function get IsDone():boolean 
	{ 
		if (null == actionEntity) return false;
		
		return actionEntity.IsDone; 
	}
	
	public function get Action():StepAction
	{
		return actionEntity;
	}
	
	public function Begin(fteID : int)
	{ 
		if (null == stepData)
		{
			_Global.Log("Null fte step data!!!");
			return;
		}

		switch (stepData.guideAction)
		{
			case NewFteConstants.FteActionOp.ShowDialog:
				actionEntity = new ActionShowDialog(stepData.displayData);
				break;
			case NewFteConstants.FteActionOp.GuideButton:
				actionEntity = new GuideControlValueChanged(stepData.displayData);
				break;
			case NewFteConstants.FteActionOp.GuideDragDrop:
				actionEntity = new GuideDragDropped(stepData.displayData);
				break;
			case NewFteConstants.FteActionOp.ShowTabFlag:
				actionEntity = new ActionShowTabFlag(stepData.displayData);
				break;
			case "GearUpgradeInit":
				actionEntity = new NewFteStep_UpgradeDataInit(stepData.displayData);
				break;
			case "GearEnhanceInit":
				actionEntity = new NewFteStep_EnhanceDataInit(stepData.displayData);
				break;
			case "GearLevelupInit":
				actionEntity = new NewFteStep_LevelupDataInit(stepData.displayData);
				break;
			case "GearItemsClear":
				actionEntity = new NewFteStep_CearItemsClear(stepData.displayData);
				break;
			case "ClearFakeDatas":
				actionEntity = new NewFteStep_ClearFakeDatas(stepData.displayData);
				break;
			case "WaitTime":
				actionEntity = new ActionTimeWait(stepData.displayData);
				break;	
		} 

		if (null != actionEntity)
		{
			actionEntity.doneDelegate = Done;
			actionEntity.Begin(fteID, this);
		}
	}
	
	public function FindServerMsgReplay(phpInvoke : String) : HashObject
	{
		return stepData.FindServerMsgReplay(phpInvoke);
	}

	public function ForceComplete()
	{
		if (null != actionEntity)
			actionEntity.ForceComplete();
	}
	
	public function Active(active:boolean)
	{
		if (null != actionEntity)
			actionEntity.Active(active);
	}
	
	public function Done()
	{
		if (null != doneDelegate)
			doneDelegate(this);
	}
	
	public function SetDoneDelegate(del:Function)
	{
		doneDelegate = del;
	}
}

// The operation base class
class StepAction
{
	protected var displayData:NewFteDisplayData;
	protected var isDone:boolean;
	
	public var doneDelegate:Function;
	
	protected var traceObj:UIObject = null;
	protected var arrowObj:UIObject = null;
	protected var highlightObj:UIObject = null;
	protected var dialog:NewFteDialog = null;
	
	public function StepAction(data:NewFteDisplayData)
	{
		displayData = data;
		
		isDone = false; 
		doneDelegate = null;
		
		traceObj = null;
		arrowObj = null;
		highlightObj = null;
		dialog = null;
	}
	
	public function get TraceUIObj():UIObject
	{
		return traceObj;
	}
	
	public function Begin(fteID : int, fteStep : NewFteStep) 
	{
		if (displayData.hasDialog)
		{
			dialog = NewFteDisplayMgr.Instance().ShowDialog(true);
			dialog.Data = displayData;
		}
		
		if (displayData.hasArrow || displayData.hasHighlight)
		{
			traceObj = NewFteMgr.GetMenuMemberObject(displayData.traceObjName) as UIObject;
			if (null == traceObj)
			{
				_Global.Log("traceObjName:" + displayData.traceObjName);
				throw new System.NullReferenceException("Hi, do you write a wrong traceObjName:" + displayData.traceObjName.ToString());
			}
			// If now is hide in draw workflow
			this.Active(traceObj.isVisible());
			
			NewFteDisplayMgr.Instance().AddTraceUIObject(traceObj);
			displayData.traceObj = traceObj;
			
			highlightObj = NewFteDisplayMgr.Instance().CreateHighLightBorder(displayData);
		}
		
		if (displayData.hasArrow)
		{
			// Merge arrow and highlight logic
			arrowObj = NewFteDisplayMgr.Instance().CreateGuideArrow(displayData);
		}
			
		StartSkipFrameTimer();
	}
	
	protected function OnBeginDone()
	{
	}
	
	protected function Done() 
	{
		isDone = true;
		
		if (null != traceObj)
		{
			NewFteDisplayMgr.Instance().RemoveTraceUIObject(traceObj);
			traceObj = null;
		}
			
		if (null != arrowObj)
		{
			NewFteDisplayMgr.Instance().DeleteGuideArrow(arrowObj);
		}
		
		if (null != highlightObj)
		{
			NewFteDisplayMgr.Instance().DeleteHighLightBorder(highlightObj);
		}
		 
		if (displayData.hasDialog)
		{ 
			NewFteDisplayMgr.Instance().ShowDialog(false);
			dialog = null;
		}
		
		if (null != doneDelegate) 
			doneDelegate(this);
	}
	
	public function ForceComplete() { Done(); }
	public function get IsDone():boolean { return isDone; }
	
	public virtual function Active(active:boolean)
	{
		//	why hide this ui object?
		//if (null != traceObj)
		//{
		//	traceObj.SetVisible(active);
		//}

		if (null != arrowObj)
		{
			arrowObj.SetVisible(active);
		}
		
		if (null != highlightObj)
		{
			highlightObj.SetVisible(active);
		}
		
		if (displayData.hasDialog)
		{ 
			NewFteDisplayMgr.Instance().ShowDialog(false);
		} 
		
		NewFteDisplayMgr.Instance().ShowBGMask(active);
	}
	
	protected function StartSkipFrameTimer()
	{
		NewFteDisplayMgr.Instance().AddTimer(new TimerSimulator(0.5f, OnTimerDone));
	}
	
	protected function OnTimerDone()
	{
		OnBeginDone();
	}
}

// Extend class
class ActionShowDialog extends StepAction
{
	public function ActionShowDialog(data:NewFteDisplayData)
	{
		super(data);
	}
	
	public override function OnBeginDone()
	{
		// super.Begin();
		
		if (null != super.dialog)
		{
			super.dialog.OnDoneDelegate = function()
			{
				this.Done();	
			};
		}
	} 
	
	protected override function Done() 
	{
		if (null != dialog)
		{
			super.dialog.OnDoneDelegate = null;
		}
		
		super.Done();
		_Global.Log("Finish ActionShowDialog");
	}
}

class ActionShowTabFlag extends StepAction
{
	private var flagIcon:NewFteFlagIcon;
	private var tabIndex:int = 0;
	
	public function ActionShowTabFlag(data:NewFteDisplayData)
	{
		super(data);
		
		flagIcon = null;
		tabIndex = -1;
	}
	
	public override function Begin(fteID : int, fteStep : NewFteStep) 
	{
		if (TraceToolbar())
		{
			NewFteDisplayMgr.Instance().ShowBGMask(false);
		}
		else
		{
			traceObj = NewFteMgr.GetMenuMemberObject(super.displayData.traceObjName) as UIObject;
			flagIcon = NewFteDisplayMgr.Instance().CreateFlagIcon(traceObj);
		}
		
		if (null != flagIcon)
		{
			flagIcon.SetDoneDelegate(function()
			{
				this.Done();
			});
		}
		
		// If now is hide in draw workflow
		this.Active(traceObj.isVisible());
		
		NewFteDisplayMgr.Instance().AddTraceUIObject(traceObj);
		displayData.traceObj = traceObj;
		
		StartSkipFrameTimer();
	}
	
	private function TraceToolbar():boolean
	{
		var traceObjName:String = super.displayData.traceObjName;
		var splitChar:String = ".";
		var hierarchyNames:String[] = traceObjName.Split(splitChar.ToCharArray());
		if (hierarchyNames.Length == 0)
		{
			return false;
		}
		
		var menu:System.Object = UtilityTools.GetMenuObject(hierarchyNames[0]); 
		if (null == menu) return false;
		
		var toolbar:ToolBar = NewFteMgr.GetMenuMemberObject(traceObjName) as ToolBar; 
		if (null != toolbar && toolbar.isVisible())
		{
			var index:int = traceObjName.LastIndexOf(splitChar);
			if (-1 != index)
			{  
				var indexString:String = traceObjName.Substring(index + 1, traceObjName.Length - index - 1);
				tabIndex = UtilityTools.GetNumberInt(indexString);
			}
			
			flagIcon = NewFteDisplayMgr.Instance().CreateFlagIcon(toolbar);
			flagIcon.SetTraceToolbarIndex(tabIndex);

			traceObj = toolbar;
			
			return true;
		}
		
		return false;
	}
	
	public override function OnBeginDone()
	{
	} 
	
	protected override function Done() 
	{
		if (null != flagIcon)
		{
			NewFteDisplayMgr.Instance().DeleteFlagIcon(flagIcon);
			flagIcon = null;
		}
		
		super.Done();
	}
	
	public override function Active(active:boolean)
	{ 
		super.Active(active);
	
		//if (null != traceObj)
		//{
		//	traceObj.SetVisible(active);
		//}
			
		if (null != flagIcon)
		{
			flagIcon.SetVisible(active);
		} 
		
		NewFteDisplayMgr.Instance().ShowBGMask(false);
	}
}

class GuideControlValueChanged extends StepAction
{  
	private var replaceParams:Array = null;
	
	public function GuideControlValueChanged(data:NewFteDisplayData)
	{
		super(data); 
		
		replaceParams = new Array();
	}
	
	public override function OnBeginDone()
	{
		// Parse data from table contents
		if (super.traceObj instanceof Button)
		{
			TraceButton(super.traceObj as Button);
		}
		else if (super.traceObj instanceof ToolBar)
		{
			TraceToolbar(super.traceObj as ToolBar);
		}
	}
	
	protected override function Done() 
	{
		_Global.Log("Finish button click event, will go to next step");

		super.Done();
	}
	
	private function TraceButton(btn:Button)
	{
		replaceParams.Add(btn);  
		replaceParams.Add(btn.OnClick); 
		replaceParams.Add(btn.clickParam);  
		
		btn.clickParam = replaceParams; 
		btn.OnClick = ReplaceBtnOnClick; 
	}
	
	private function ReplaceBtnOnClick(param:Object)
	{  
		if (null == replaceParams)
		{
			throw new System.ArgumentNullException("ReplaceBtnOnClick");
		} 
		
		if (replaceParams.Count != 3)
		{
			throw new System.ArgumentNullException("ReplaceBtnOnClick");
		}

		var tBtn:Button = replaceParams[0] as Button; 
		var tOnClick:MulticastDelegate = replaceParams[1] as MulticastDelegate;
		var tClickParam:Object = replaceParams[2];
		
		if (null != tOnClick)
		{
			try
			{
				tOnClick.DynamicInvoke([tClickParam]);
			}
			catch (ex : TargetParameterCountException)
			{
				tOnClick.DynamicInvoke([]);
			}
		}
			
		// Reset the button data
		tBtn.OnClick = tOnClick; 
		tBtn.clickParam = tClickParam;
		
		this.Done();
	}
	
	private function TraceToolbar(toolbar:ToolBar)
	{
		replaceParams.Add(toolbar);  
		replaceParams.Add(toolbar.indexChangedFunc); 
		replaceParams.Add(null);  
		
		toolbar.indexChangedFunc = ReplaceToolbarTabChanged; 
	}
	
	private function ReplaceToolbarTabChanged(index:int)
	{
		if (null == replaceParams)
		{
			throw new System.ArgumentNullException("ReplaceToolbarTabChanged");
		} 
		
		if (replaceParams.Count != 3)
		{
			throw new System.ArgumentNullException("ReplaceToolbarTabChanged");
		}
		 
		var tToolbar:ToolBar = replaceParams[0] as ToolBar; 
		var tFunction:Function = replaceParams[1] as Function;
		var tParam:Object = replaceParams[2];
		
		if (null != tFunction)
			tFunction(index); 
			 
		// Reset the button data
		tToolbar.indexChangedFunc = tFunction; 
		
		this.Done();
	}
}

class GuideDragDropped extends StepAction
{  
	private var draggingObj:UIObject = null; 
	private var dropTargetObj:UIObject = null; 
	
	private var targetHighlightBorder:UIObject = null;
	private var dragIndicator:NewFteDragIndicator = null;
	
	public function GuideDragDropped(data:NewFteDisplayData)
	{
		super(data); 
		
		dropTargetObj = null;
		targetHighlightBorder = null;
	}
	
	public override function Begin(fteID : int, fteStep : NewFteStep)
	{
		super.Begin(fteID, fteStep);
		
		if (String.IsNullOrEmpty(displayData.dragDroppedTargetName))
		{
			throw new System.ArgumentNullException("A wrong or null dropped target object name!!!");
		}
		
		draggingObj = super.traceObj;
		dropTargetObj = NewFteMgr.GetMenuMemberObject(displayData.dragDroppedTargetName) as UIObject;
		if (null == dropTargetObj)
		{
			throw new System.NullReferenceException("Hi, do you write a wrong dropped target Name: " + displayData.dragDroppedTargetName);
		}
		targetHighlightBorder = NewFteDisplayMgr.Instance().CreateHighLightBorder(dropTargetObj);
		
		// Indicator pic + text
		dragIndicator = NewFteDisplayMgr.Instance().ShowDragIndicator(true);
		dragIndicator.Data = super.displayData;
		
		NewFteMgr.Instance().RegisterDragDropBegin(OnDragDroppedBegin);
		NewFteMgr.Instance().RegisterDragDropDone(OnDragDroppedDone);
	}
	
	public override function OnBeginDone()
	{
		super.OnBeginDone();
		BeginIndicatorAnim();
	}
	
	protected override function Done() 
	{
		NewFteMgr.Instance().UnregisterDragDropBegin(OnDragDroppedBegin);
		NewFteMgr.Instance().UnregisterDragDropDone(OnDragDroppedDone);
		
		if (null != dropTargetObj)
		{
			NewFteDisplayMgr.Instance().RemoveTraceUIObject(dropTargetObj);
			dropTargetObj = null;
		}
		
		if (null != targetHighlightBorder)
		{
			NewFteDisplayMgr.Instance().DeleteHighLightBorder(targetHighlightBorder);
			targetHighlightBorder = null;
		}
		
		StopIndicatorAnim();
		NewFteDisplayMgr.Instance().ShowDragIndicator(false);

		super.Done();
	}
	
	public override function Active(active:boolean)
	{
		super.Active(active);
		
		if (null != dropTargetObj)
		{
			dropTargetObj.SetVisible(active);
		}
		
		if (null != targetHighlightBorder)
		{
			targetHighlightBorder.SetVisible(active);
		}
		
		if (null != dragIndicator)
		{
			dragIndicator.SetVisible(active);
		}
	}
	
	private function OnDragDroppedBegin(dragObjMemName:String, parent:Object):void
	{
		if (null != parent)
		{
			var newArray:Array = new Array();
			newArray[0] = parent.GetType().GetField(dragObjMemName, 
											System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.NonPublic
											| System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Static);
			newArray[1] = parent;
			NewFteDisplayMgr.Instance().TopObjPairInfo = newArray;
		}
		
		NewFteDisplayMgr.Instance().ShowDragIndicator(false);
	}
	
	private function OnDragDroppedCanceled(dragObj:UIObject)
	{
		dragIndicator = NewFteDisplayMgr.Instance().ShowDragIndicator(true);
		BeginIndicatorAnim();
	}

	private function OnDragDroppedDone(dragObj:UIObject, srcType : String)
	{
		NewFteDisplayMgr.Instance().TopObjPairInfo = null;
		
		if ( !String.IsNullOrEmpty(displayData.dragTraceTargetType) )
		{
			if ( srcType != displayData.dragTraceTargetType )
				return;
		}

		if (IsMatchGearScrollViewItem(dragObj))
		{
			if ( !String.IsNullOrEmpty(displayData.dragTraceSourceType) )
			{
				var gearItem : GearScrollViewItem = dragObj as GearScrollViewItem;
				if ( gearItem != null && gearItem.tagItem.sourceType.ToString() != displayData.dragTraceSourceType )
					return;
			}
			this.Done();
			return;
		}

		if (IsMatchStoneItem(dragObj))
		{
			if ( !String.IsNullOrEmpty(displayData.dragTraceSourceType) )
			{
				var stoneItem : StoneItem = dragObj as StoneItem;
				if ( stoneItem != null && stoneItem.tagItem.sourceType.ToString() != displayData.dragTraceSourceType )
					return;
			}
			this.Done();
			return;
		}

		if (IsMatchStrengthenItem(dragObj))
		{
			this.Done();
			return;
		}
	}
	
	private function IsMatchGearScrollViewItem(dragObj:UIObject):boolean
	{
		if (dragObj as GearScrollViewItem)
		{
			var compair1:GearScrollViewItem = draggingObj as GearScrollViewItem;
			var compair2:GearScrollViewItem = dragObj as GearScrollViewItem;
			
			if (null != compair1.TheArm || null != compair2.TheArm)
				return true;
			
			if (compair1.TheArm.PlayerID == compair2.TheArm.PlayerID)
				return true;
		}
		
		return false;
	}
	
	private function IsMatchStoneItem(dragObj:UIObject):boolean
	{
		if (dragObj as StoneItem)
		{
			var compair1:StoneItem = draggingObj as StoneItem;
			var compair2:StoneItem = dragObj as StoneItem;
			
			if (null == compair1 || null == compair2)
				return true;
				
			if (compair1.Id == compair2.Id)
				return true;
		}
		
		return false;
	}
	
	private function IsMatchStrengthenItem(dragObj:UIObject):boolean
	{
		if (dragObj as StrengthenItem)
		{
			var compair1:StrengthenItem = draggingObj as StrengthenItem;
			var compair2:StrengthenItem = dragObj as StrengthenItem;
			
			var id1:int = compair1.GetHammerId();
			var id2:int = compair2.GetHammerId();
			if (id1 == id2)
				return true;
		}
		
		return false;
	}
	
	private function BeginIndicatorAnim()
	{
		if (null != draggingObj && null != dropTargetObj
			&& null != dragIndicator)
		{
			PositionAnimation.StartAnim(dragIndicator, draggingObj.ScreenRect.center, dropTargetObj.ScreenRect.center, null);
		}
	}
	
	private function StopIndicatorAnim()
	{
		if (null != dragIndicator)
			PositionAnimation.StopAnim(dragIndicator, true);
	}
}

class ActionTimeWait extends StepAction
{ 
	public function ActionTimeWait(data:NewFteDisplayData)
	{
		super(data);
	}
	
	public override function Begin(fteID : int, fteStep : NewFteStep) 
	{
		StartSkipFrameTimer();
	}
	
	protected override function StartSkipFrameTimer()
	{
		_Global.Log("[NewFte]:ActionTimeWait.StartSkipFrameTimer " + super.displayData.waitTime);
		NewFteDisplayMgr.Instance().AddTimer(new TimerSimulator(super.displayData.waitTime, OnTimerDone));
	}
	
	protected function OnTimerDone()
	{
		_Global.Log("[NewFte]:ActionTimeWait.OnTimerDone");
		super.Done();
	}
}
