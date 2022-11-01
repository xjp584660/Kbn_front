

public class Timer
{
	private var mTime:double = 0.0f;
	private var mInterval:double = 0.0f;
	private var mTimes:int = 0;
	public var OnTime:Function = null;
	public var params:Object = null;
	
	public function Begin(interval:double,ps:Object)
	{
		Init();
		mInterval = interval;
		params = ps;
	}
	
	public function Stop()
	{
		Init();
	}
	
	public function Init()
	{
		mInterval = 0.0f;
		mTime = 0.000000000000f; 
		mTimes = 0;
	}
	
	
	public function Update()
	{
		if(mInterval <= 0) return;
		
		if(mTime >= mInterval || mTime == 0.0f)
		{	
			if(mTime != 0.0f)
				mTime -= mInterval;
			if(OnTime != null)
				OnTime(mTimes++,params);
		}
		mTime += Time.deltaTime;
	}
	
	
}