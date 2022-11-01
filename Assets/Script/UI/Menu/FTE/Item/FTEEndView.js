public class FTEEndView extends FTEMask
{
	public var endedFunc:Function;
	
	public var a1:float;
	public var a2:float;
	public var a3:float;
	public var t12:float;
	public var t23:float;
	
	protected var p1:float;
	protected var p2:float;
	
	protected var dtime:double=0;
//	protected var flag :int = 0;
	protected var totalTime:float;
	public function Init(evo:ElementVO):void
	{
		super.Init();
		
		this.a1 = evo.getFloat("a1");
		this.a2 = evo.getFloat("a2");
		this.a3 = evo.getFloat("a3");
		this.t12 = evo.getFloat("t12");
		this.t23 = evo.getFloat("t23");		
		
		totalTime = t12 + t23;
		totalTime = totalTime > 0 ? totalTime : 1;
		
		p1 = t12 / totalTime;
		p2 = 1 - p1;
		
		//
		totalTime --;
	}
	
	public function startPlay():void
	{
		this.flag = 1;
		dtime = 0;
		
	}
	
	public function FixedUpdate():void
	{
		if(flag == 1 )
		{			
			dtime += Time.fixedDeltaTime;
			playPercent(dtime / totalTime);		
		}
	}
	public function Draw():int
	{
//		//_Global.Log("FTE end Draw Alpha: " + alpha);
		return super.Draw();
	}
	protected function playPercent(percent:float):void
	{
		
		if(percent <= p1)
		{
			this.alpha = func_linear(a1,a2,percent / p1 );
		}
		else if( p2 > 0)
		{			
			this.alpha = func_linear(a2,a3,(percent - p1) / p2 );
		}
	
		if(percent >= 1.05)
		{
			flag =2;
			if(endedFunc != null)
				endedFunc();
		}		
	}
		
	public function endPlay():void
	{
		playPercent(1.1);
	}
	
	protected function func_linear(fromV:float,toV:float,percent:float):float
	{
//		percent = percent < 0 ? 0 : percent;
//		percent = percent > 1 ? 1 : percent;
		return fromV * (1 - percent) + toV * percent;		
	}
	
}