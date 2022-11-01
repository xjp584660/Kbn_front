

public class ClickGesture
{
	public var OnClicked:Function;
	public var OnDoubleClicked:Function;
	public var area:Rect; 
	public var ReleaseTime:double;
	
	private var mIsEnable:boolean;
	private var pressed:boolean;
	private var longPressGuesture:LongPressGesture;
	
	private var doubleClickTime:double = 0.0f;
	public 	var doubleClickTimeSpan:double;
	private var releaseTime:double;
	private var shouldClick:boolean;
	
	private var clickDistance:double = 50.0f;
	private var diff:double;
	public function set Diff(value:double)
	{
		diff = value;
	}
	public function get Enable():boolean
	{
		return mIsEnable;
	}
	public function set Enable(value:boolean)
	{
		longPressGuesture.Enable = value;
		mIsEnable = value;
	}
	
	
	public function Init(area:Rect)
	{
		longPressGuesture = new LongPressGesture();
		longPressGuesture.Init();
		longPressGuesture.OnLongPress = OnPress;
		longPressGuesture.OnLongPressRelease = OnRelease;
		longPressGuesture.timeSpan = 0.001f;
		longPressGuesture.area = area;
		this.area = area;
		pressed = false;
		mIsEnable = false;
		
		doubleClickTime = 0.0f;
		doubleClickTimeSpan = 0.8f;
		shouldClick = false;
		diff = 0.0f;
		clickDistance = 10.0f;
	}
	private var origin:Vector2;
		
	private function OnPress(sender:LongPressGesture,time:double)
	{	
		pressed = true;
		origin = Input.mousePosition;
		releaseTime = 0.0f;  
		
	} 
	
	private function Near(p1:Vector2,p2:Vector2):boolean
	{
		if(diff <= 0.0f) return;
		var x:int = p1.x - p2.x;
		var y:int = p1.y - p2.y;
		if(x > clickDistance || x < -clickDistance) return false;
		if(y > clickDistance || y < -clickDistance) return false;
		return true;
	}
	
	private function OnRelease(sender:LongPressGesture,time:double)
	{
		if( pressed )
		{  
			pressed = false; 
			if(releaseTime <= ReleaseTime && Near(origin,Input.mousePosition))
			{
				shouldClick = true;
				
				if(doubleClickTime <= doubleClickTimeSpan)
				{ 
				
					shouldClick = false;
					if(OnDoubleClicked != null)
						OnDoubleClicked(this); 
				}
			}
			doubleClickTime = 0.0f; 
			
		}
	}
	
	private function UpdateClick()
	{
		if(shouldClick && doubleClickTime > doubleClickTimeSpan)
		{
			shouldClick = false;
			if(OnClicked != null  && Near(origin,Input.mousePosition))
				OnClicked(this);
		}
	}
	
	public function Update()
	{
		if(!Enable) return;
		doubleClickTime += Time.deltaTime;
		releaseTime += Time.deltaTime;
		longPressGuesture.Update();
		UpdateClick();
	}
	
	
	
}