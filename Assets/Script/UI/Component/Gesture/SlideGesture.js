


public class SlideGesture
{
	private var gesture:LongPressGesture;
	
	public var OnSlidePress:Function;
	public var OnSlide:Function;
	public var OnSlideOver:Function;
	
	private var S:Vector2;
	private var V:Vector2;
	
	private var T:double;
	
	private var origin:Vector2;
	private var lastPosition:Vector2;
	private var lastS:Vector2;
	private var lastV:Vector2;
	private var canBegin:boolean;
	private var isBegin:boolean;
	
	private var data:Data;
	private var enable:boolean;
	
	
	public function get Enable():boolean
	{
		return enable;
	}
	public function set Enable(value:boolean)
	{
		enable = value;
		gesture.Enable = enable;
	}
	
	public function Init()
	{
		gesture = new LongPressGesture();
		gesture.Init();
		gesture.OnLongPress = OnLongPress;
		gesture.OnLongPressRelease = OnLongRelease;
		gesture.OnMove =  OnLongMove;
		gesture.Enable = true;
		gesture.area = new Rect(0,0,0,0);
		gesture.timeSpan = 0.0f;
		
		S = new Vector2();
		V = new Vector2();
		
		canBegin = false;
		origin = new Vector2();
		isBegin = false;
		data = new Data();
	}
	public function Update()
	{
		T += Time.deltaTime;
		gesture.Update();
	}
	
	
	private function OnLongPress(longpress:LongPressGesture,t:Object)
	{
		origin = Input.mousePosition;
		lastPosition = Input.mousePosition;
		lastV.x = 0.0f;
		lastV.y = 0.0f;
		S = new Vector2();
		V = new Vector2();
		canBegin = false;
		T = 0.0f;
	} 
	private function OnLongRelease(longpress:LongPressGesture,t:Object)
	{
		if(isBegin)		
		{
			if(OnSlideOver != null)
				OnSlideOver(this,data);
			isBegin = false;	
		}
	}
	private function OnLongMove(longpress:LongPressGesture,t:Object)
	{
		S.x = Input.mousePosition.x - origin.x;
		S.y = Input.mousePosition.y - origin.y;
		lastS.x = (Input.mousePosition.x - lastPosition.x);
		lastS.y = (Input.mousePosition.y - lastPosition.y);
		if(T > 0.0f)
		{
			V.x = S.x / T;
			V.y = S.y / T;
		}
		if(lastPosition.x == 0 && lastPosition.y == 0)
		{
			lastV.x = 0.0f;
			lastV.y = 0.0f;
		}
		else
		{
			if(T > 0.0f)
			{
				lastV.x = lastS.x / T;
				lastV.y = lastS.y / T;
			}
		}
		
		if(isBegin)
		{
			if(OnSlide != null)
				OnSlide(this,data);
		}
		else if(CanBegin())
		{
			if(OnSlidePress != null)
			{
				OnSlidePress(this,data);
				
			}
			isBegin = true;
		}		
		lastPosition.x = Input.mousePosition.x;
		lastPosition.y = Input.mousePosition.y;
		
		data.V = V;
		data.S = S;
		data.lastV = lastV;
		data.lastS = lastS;
		
	}
	
	private function CanBegin():boolean
	{	
		var r:boolean = true;
		if((Mathf.Abs(S.x) < 10.0f && Mathf.Abs(S.y) < 10.0f))
			r = false;
		
		if((Mathf.Abs(V.x) < 50.0f && Mathf.Abs(V.y) < 50.0f))
			r = false;
		
		if((Mathf.Abs(lastV.x) < 50.0f && Mathf.Abs(lastV.y) < 50.0f))
			r = false;

		return r;
	}
	
	public class Data
	{
		public var V:Vector2;
		public var S:Vector2;
		public var lastV:Vector2;
		public var lastS:Vector2;
	}
	
	
}