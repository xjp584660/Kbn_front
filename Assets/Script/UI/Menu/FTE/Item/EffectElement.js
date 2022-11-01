public class EffectElement extends UIElement
{	
	public var startTime:float;
	public var endTime:float;
	
	protected var totalTime :float;
	protected var curTime	:float;

	//
	protected var flag:int = 0;
	
	public function Init(data:Object):void
	{
		flag = 0;
		
	}
	
	public function startEffect():void
	{
		flag = 1;
		curTime = 0;
	}
	
	public function Update():void
	{
		
	}
	
	public function FixedUpdate():void
	{
		if(flag == 1)
		{			
			curTime += Time.fixedDeltaTime;	
			if(curTime >= startTime)		
				doEffect(curTime - startTime, totalTime);
		}
	}
	
	public function endEffect():void
	{
		doEffect(totalTime,totalTime);		
	}
	
	//should be override .
	protected function doEffect(percent:float):void
	{
		
	}
	
	protected function doEffect(ctime:float, totalTime :float):void
	{
		if(curTime >= totalTime)
			flag = 2;			
		doEffect(ctime / totalTime)	;	
	}
}