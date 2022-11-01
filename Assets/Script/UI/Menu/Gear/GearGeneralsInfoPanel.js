import System;
import System.Collections;

///----------------------------------------------------
class GearGeneralsInfoPanel extends TabContentUIObject implements GestureReceiver,ITouchable
{
	public var prefabKnightInfo:GearKnightInfoMenu;
	
	// public var forwardButton:Button;
	// public var backwardButton:Button;
	//public var knightInfoList:ScrollList;
	
	//-----------------------------------------------------------------
	private var receiverActivated:System.Action.<GestureReceiver>;
	
	//-----------------------------------------------------------------
	public override function Init()
	{
		super.Init();
		
		prefabKnightInfo.Init();
		prefabKnightInfo.RegisterGesture();
		InitKnightInfoList();
		
		RegisterGUIEvents();
		RegisterGesture(); 
		
		InitVariables(); 
		InitAbsoluteRect();
		InitTransition();
		GearData.Instance().AddKnightListener(this);
	} 
	
	private function InitKnightInfoList()
	{ 
		//knightInfoList.Init(prefabKnightInfo);
	} 
	
	private function RegisterGUIEvents()
	{
	}
	
	private function RegisterGesture()
	{
		// For receive the touchable of KnightInfoEquipItem
//		GestureManager.Instance().RegistReceiver(this);
//		GestureManager.Instance().RegistTouchable(this);
		
	}
	
	private function UnregisterGesture()
	{
//		GestureManager.Instance().RemoveReceiver(this);
//		GestureManager.Instance().RemoveTouchable(this);
	}
	
	private function InitVariables()
	{
	}

	public override function Draw()
	{
		if (!super.visible) return;
		
		UpdateGestures();
		
		GUI.BeginGroup(super.rect);
		if(canShowPanel)
			prefabKnightInfo.Draw();
	//	knightInfoList.Draw();
		//forwardButton.Draw();
		//backwardButton.Draw();
		DrawTransition();
		DrawInterface();
		GUI.EndGroup();
	}
	
	public function Update()
	{
		prefabKnightInfo.Update();
	//	knightInfoList.Update();
		UpdateTransition();
	}
	
	public function OnClear()
	{  
		prefabKnightInfo.OnClear();
		UnregisterGesture();
		GearData.Instance().RemoveKnightListener(this);
	}
	
	// private function OnClickForwardBtn()
	// {
	// 	GearData.Instance().ShiftNextKnight();
	// }
	// 
	// private function OnClickBackwardBtn()
	// {
	// 	GearData.Instance().ShiftPreviousKnight();
	// }
	
	public function UpdateKnightInfo()
	{    
		prefabKnightInfo.Data = GearData.Instance().CurrentKnight;
	}
	
	public function UpdateKnightBaseInfo()
	{
		if (null == GearData.Instance().CurrentKnight)
			return;
			
		var seed:HashObject= GameMain.instance().getSeed();
		
		var cityId:int = GearData.Instance().CurrentKnight.CityID;
		var knightId:int = GearData.Instance().CurrentKnight.KnightID;
		var knightObj:HashObject = seed["knights"]["city" + cityId]["knt" + knightId];
		if (knightObj)
		{
			GearData.Instance().CurrentKnight.Level = _Global.INT32(knightObj["knightLevel"]);
		}
	
		prefabKnightInfo.SetKnightInfo(GearData.Instance().CurrentKnight);
	}
	
	/// Gesture events
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
		if(MenuMgr.getInstance().Top().menuName != "GearMenu") return;
		
		if (touchables == null) return;
		if (touchables.Count == 0) return;
		
		// Get our care UIObject
		var currUIObj:GearKnightInfoMenu = null;
		for (var i:int = 0; i < touchables.Count; i++)
		{
			if(touchables[i] == null) continue;
			var panel:GearGeneralsInfoPanel =touchables[i] as GearGeneralsInfoPanel;
			if(panel != null)
			{
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
		
		
		
	} 
	
	//// Define a touch struct 
	//public class MouseOrTouch
	//{ 
	//	public var pos:Vector2; 
	//	public var deltaSinceLastUpdate:Vector2;
	//	public var deltaSinceLastEvent:Vector2;
	//	
	//	public Vector2 pos;				// Current position of the mouse or touch event
	//	public Vector2 delta;			// Delta since last update
	//	public Vector2 totalDelta;		// Delta since the event started being tracked
	//
	//	public Camera pressedCam;		// Camera that the OnPress(true) was fired with
	//
	//	public GameObject current;		// The current game object under the touch or mouse
	//	public GameObject pressed;		// The last game object to receive OnPress
	//	public GameObject dragged;		// The last game object to receive OnDrag
	//
	//	public float clickTime = 0f;	// The last time a click event was sent out
	//
	//	public ClickNotification clickNotification = ClickNotification.Always;
	//	public bool touchBegan = true;
	//	public bool pressStarted = false;
	//	public bool dragStarted = false;
	//}
	//
	private final var DragDisThreshold:float = 8.0f;
	private var dragUIObj:GearKnightInfoMenu = null; 
	// Begin
	// Update
	// Canceled
	// Done
	private function OnDragDropEvent()
	{
		
	}
	public function OnSelect()
	{
		this.SetVisible(true);
		prefabKnightInfo.Data = GearData.Instance().CurrentKnight;
		
		var gearMenu:GearMenu = MenuMgr.getInstance().getMenu("GearMenu") as GearMenu;
		if( gearMenu ){
			gearMenu.InitGearGeneralBackground();
		}
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
		
	} 
	
	private function Begin()
	{
		var pre:Knight = GearData.Instance().PreviousKnight;
		var next:Knight = GearData.Instance().NextKnight;
		var current:Knight = GearData.Instance().CurrentKnight;
		if(!transition.IsTransiting)
			canShowPanel = false; 
		transition.Begin(prefabKnightInfo,[pre,current,next]);
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
		if(GearData.Instance().NextKnight == null) return;
		Begin();
		Finish(1.0f);
	}
	private function BackwardClick()
	{
		if(GearData.Instance().PreviousKnight == null) return;
		Begin();
		Finish(-1.0f);
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
	
	private function OnFinish(side:int)
	{
		canShowPanel = true;
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
		mAbsoluteRect = new Rect(0,0,640,960);
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
	public function OnCurrentKnightChanged(o:Knight,n:Knight)
	{
		if( n != null) 
		{
			prefabKnightInfo.Data = n;
		}
		
		TransitionOnKnightChanged();		
	}
	
}