
import System.Collections.Generic;


/*

	ZOrder information
	
	ArcSelectControl  			100
	ArmSkillButton 				5
	GearArmLevelUpgrade			0
	GearEquipment				0
	GearGeneralsInfoPanel		0
	GearKnightInfoMenu			10
	GearScrollViewItem			10
	GearSkillEnhancement		0
	KnightInfoEquipItem			0
	OcupiedTouchable			1
	StoneItem					10
	StonePanel					20
	StrengthenItem				10
	StrengthenTab				0
	SkillInformationMenu    	1000
	KnightInformationPopMenu	1000

*/


public class GestureManager extends KBN.GestureManager
{
	//private static var sInstance:GestureManager = new GestureManager();
	private var longPress:LongPressGesture = new LongPressGesture();
	private var click:ClickGesture = new ClickGesture();
	private var largeAreaClick:ClickGesture = new ClickGesture();
	private var slide:SlideGesture = new SlideGesture();
	
	private function GestureManager()
	{
		InitLongPress();
		InitClick();
		InitSlide();
		InitLargeAreaClick();
		mCanInvoke = true; 
		mCanClick = true;
		Enable = true;
	}
		
	private function InitLongPress()
	{
		longPress.Init();
		longPress.OnLongPress = OnLongPress;
		longPress.OnLongPressRelease = OnLongRelease;
		longPress.OnMove =  OnLongMove;
		longPress.Enable = true;
		longPress.area = new Rect(0,0,0,0);
		longPress.timeSpan = 0.4f;
		if(_Global.IsLowEndProduct())
			longPress.timeSpan = 1.0f;
		if(RuntimePlatform.Android == Application.platform)	
			longPress.timeSpan = 0.5f;
	}
	private function InitSlide()
	{
		slide.Init();
		slide.OnSlidePress = OnSlidePress;
		slide.OnSlideOver = OnSlideRelease;
		slide.OnSlide =  OnSlideMove;
		slide.Enable = true;
	}	
	
	private function InitClick()
	{
		click.Init(new Rect());
		click.OnClicked = OnClicked;
		click.Enable = true;
		click.Diff = 6.0f;
		click.OnDoubleClicked = OnDoubleClicked;	
		click.ReleaseTime = 0.4f;
		click.doubleClickTimeSpan = 0.8f;
		if(_Global.IsLowEndProduct())
		{
			click.ReleaseTime = 1.0f;
			click.doubleClickTimeSpan = 2.0f;
		}
		if(RuntimePlatform.Android == Application.platform)
		{
			click.ReleaseTime = 0.5f;
			click.doubleClickTimeSpan = 1.5f;
		}		
	}
	
	
	private function InitLargeAreaClick()
	{
		largeAreaClick.Init(new Rect());
		largeAreaClick.OnClicked = OnLargeAreaClicked;
		largeAreaClick.Enable = true;
		largeAreaClick.OnDoubleClicked = OnLargeAreaDoubleClicked;	
	}
	

	public static function Instance() : GestureManager
	{
		if ( singleton == null )
			singleton = new GestureManager();
		return singleton;
	}

	private var mTouchables:List.<ITouchable> = new List.<ITouchable>();
	private var mReceivers:List.<GestureReceiver> = new List.<GestureReceiver>();
	private var mActiveTouchables:Dictionary.<ITouchable,int> = new Dictionary.<ITouchable,int>();
	private var mActiveReceivers:Dictionary.<GestureReceiver,int> = new Dictionary.<GestureReceiver,int>();
	private var mToDelete:List.<ITouchable> = new List.<ITouchable>();
	private var mCanInvoke:boolean = true;
	
	public function RegistTouchable(touch:ITouchable)
	{
		if(touch == null) return;
		if(mTouchables.Contains(touch))
		{
			mTouchables.Remove(touch);
		}
		
		mTouchables.Add(touch); 
		mTouchables.Sort(SortDes);
		touch.SetTouchableActiveFunction(ActivatedTouchable);
	}
	public function RegistReceiver(receiver:GestureReceiver)
	{
		if(receiver == null) return;
		if(!mReceivers.Contains(receiver))	
		{
			mReceivers.Add(receiver);
			receiver.SetReceiverActiveFunction(ActivatedReceiver);
		}
	}
	
	private function ActivatedTouchable(touchable:ITouchable)
	{
		if(touchable == null) return;
		mActiveTouchables[touchable] = 5;
	}
	
	private function ActivatedReceiver(receiver:GestureReceiver)
	{
		if(receiver == null) return;
		mActiveReceivers[receiver] = 5;
 	}
	
	private function UpdateActivated()
	{
		for(var touchable:ITouchable in mTouchables)
		{  
			if(!mActiveTouchables.ContainsKey(touchable)) 
				mActiveTouchables[touchable] = 0;
			var v:int = mActiveTouchables[touchable];
			mActiveTouchables[touchable] = v - 1;
		}
		for(var receiver:GestureReceiver in mReceivers)
		{  
			if(!mActiveReceivers.ContainsKey(receiver)) 
				mActiveReceivers[receiver] = 0;
			var m:int = mActiveReceivers[receiver];
			mActiveReceivers[receiver] = m - 1;
		}
	}
	
	public function RemoveReceiver(receiver:GestureReceiver)
	{
		if(receiver != null)
			mReceivers.Remove(receiver);
		if(mActiveReceivers != null)
			mActiveReceivers.Remove(receiver);
	}
	public function RemoveTouchable(touchable:ITouchable)
	{
		if(touchable != null)
			mTouchables.Remove(touchable);
		if(mActiveTouchables != null)
			mActiveTouchables.Remove(touchable);
	}
	
	public function Clear()
	{
		mTouchables.Clear();
		mReceivers.Clear();
		mList.Clear();
		mToDelete.Clear();
	}
	
	private var mList:List.<ITouchable> = new List.<ITouchable>();
	
	private function OnGesture(gesture:GestureEventType,t:Object)
	{
		mList.Clear();
		var iphoneXScaleY:float = KBN._Global.GetIphoneXScaleY2();
		for(var touchable:ITouchable in mTouchables)
		{
			if(touchable == null) 
			{	
				mToDelete.Add(touchable);
				continue;
			}
			var rect1:Rect = touchable.GetAbsoluteRect();
			if(rect1 == null) continue;
			if(KBN._Global.isIphoneX()) {
				rect1.y=rect1.y * iphoneXScaleY;
			}
			
			if(mActiveTouchables == null) continue;
			var v2:Vector2 = AbsoluteVectore2(Input.mousePosition); 
			if(!mActiveTouchables.ContainsKey(touchable)) continue;
			if(mActiveTouchables[touchable] <= 0) continue;
			if(mList == null) continue;
			if(rect1.Contains(v2))
			{
				mList.Add(touchable);
			}
		}
		
		for(var receiver:GestureReceiver in mReceivers)
		{
			if(receiver == null) continue;
			if(mActiveReceivers == null) continue;
			if(!mActiveReceivers.ContainsKey(receiver)) continue;
			if(mActiveReceivers[receiver] <= 0) continue;
			if(mList == null) continue;
			receiver.OnGesture(gesture, mList,t);
		}
		var n:int = mToDelete.Count;
		for(var i:int = 0; i < n; i++)
		{
			mTouchables.Remove(mToDelete[i]);
		}
		mToDelete.Clear();
	}
	
	
	private function SortDes(t1:ITouchable,t2:ITouchable):int
	{
		var a1:int = t1.GetZOrder();
		var a2:int = t2.GetZOrder();
		if(a1>a2) return -1;
		else if(a1 < a2) return 1;
		else return 0;
	}
	
	private var mCanClick:boolean;
	
	private function OnLongPress(longpress:LongPressGesture,t:Object)
	{
		OnGesture(GestureEventType.LongPress,t);
		mCanInvoke = false;
	} 
	private function OnLongRelease(longpress:LongPressGesture,t:Object)
	{
		OnGesture(GestureEventType.LongRelease,t);
	}
	private function OnLongMove(longpress:LongPressGesture,t:Object)
	{
		OnGesture(GestureEventType.LongMove,t);
	}
	
	private function OnSlidePress(longpress:SlideGesture,t:Object)
	{
		if(!mCanInvoke) return;
		OnGesture(GestureEventType.SlidePress,t);
	}
	private function OnSlideRelease(longpress:SlideGesture,t:Object)
	{
		OnGesture(GestureEventType.SlideOver,t);
	}
	private function OnSlideMove(longpress:SlideGesture,t:Object)
	{
		OnGesture(GestureEventType.SlideMove,t);
	}
	private function OnClicked(sender:ClickGesture)
	{
		OnGesture(GestureEventType.Clicked,null); 
		mCanClick = false;
	}
	
	private function OnDoubleClicked(sender:ClickGesture)
	{
		OnGesture(GestureEventType.DoubleClicked,null);
	}
	private function OnLargeAreaClicked(sender:ClickGesture)
	{ 
		if(!mCanClick)	return;
		OnGesture(GestureEventType.LargeAreaClicked,null);
	}
	private function OnLargeAreaDoubleClicked(sender:ClickGesture)
	{ 
		if(!mCanClick) return;
		OnGesture(GestureEventType.LargeAreaDoubleClicked,null);
	}
	
	
	public function Draw()
	{
		if(!IsValid()) return;
		mCanInvoke = true; 
		mCanClick = true;
		longPress.Update();
		click.Update();
		slide.Update();
		//largeAreaClick.Update();
		UpdateActivated();
	}
	public static function AbsoluteVectore2(v2:Vector2):Vector2
	{
		v2.y = Screen.height - v2.y;
		
		var y:double = v2.y;
		var x:double = v2.x;
		
		v2.y = y * 960.0f / Screen.height;
		v2.x = x * 640.0f / Screen.width;

		return (v2);
	}
	public static function AbsoluteRect(r:Rect):Rect
	{
		var re:Rect = new Rect(r);
		
		re.x = r.x * 640.0f / Screen.width;
		re.y = r.y * 960.0f / Screen.height;
		re.width = r.width * 640.0f / Screen.width;
		re.height = r.height * 960.0f / Screen.height;
		
		
		return re;
	}
	
	private function IsValid()
	{
		if(MenuMgr.getInstance() == null) return false;
		if(MenuMgr.getInstance().netBlock)return false;
		if(!Enable) return false; 
		if(mReceivers.Count <= 0) return false;
		if(mTouchables.Count <= 0) return false;
		return true;
	}



}

