


public class LongPressGesture
{
	public var OnLongPress:Function;
	public var OnLongPressRelease:Function;
	public var OnMove:Function;
	
	public var area:Rect;
	public var timeSpan:double;
	
	private var mIsEnable:boolean;
	private var mTime:double;
	private var mIsDown:boolean;
	private var mIsReleased:boolean;
	
	public function get Enable():boolean
	{
		return mIsEnable;
	}
	public function set Enable(value:boolean)
	{
		mIsEnable = value;
	}
	
	public function Init()
	{
		mTime = 0.0f;
		mIsReleased = true;
		mIsDown = false;
	}

	public function Update()
	{
	//	if(timeSpan <= 0 ) return;
		if(!Enable) return;
		
		UpdateLongPress();
		UpdateMove();
		UpdateLongPressRelease();
	}
	private function UpdateLongPressRelease()
	{
		
		if(Event.current.type == EventType.MouseUp)
		{ 
			if( !mIsReleased )
			{
				if(OnLongPressRelease != null)
					OnLongPressRelease(this,mTime);

			}
			mTime = 0.0f;
			mIsReleased = true;
			mPressedDown = false;			
		}
		
	} 
	
	private var mPressedDown:boolean = false;
	private function UpdateLongPress()
	{   
		var v2:Vector2 = Event.current.mousePosition;
		if(((area == Rect(0,0,0,0)) || area.Contains(v2)) && Event.current.type == EventType.MouseDown)
			mPressedDown = true;
		
		
		
		if(mPressedDown && ((area == Rect(0,0,0,0)) || area.Contains(v2)))
		{ 
			
			mTime += Time.deltaTime;
			if(mTime >= timeSpan && mIsReleased)
			{
				if(OnLongPress != null)
					OnLongPress(this,mTime);
				mIsReleased = false;	 
			
			}
		}
		else
			mTime = 0.0f;
	}
	
	private function UpdateMove()
	{
		var v2:Vector2 = Event.current.mousePosition;
		if(!mIsReleased)
		{
			if(OnMove != null)
				OnMove(this,mTime);
		}
	}
	
	
}