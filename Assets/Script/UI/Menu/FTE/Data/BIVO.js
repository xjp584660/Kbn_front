public class BIVO extends FTEBaseVO
{
	public var step:int;
	public var slice:int;
	
	public function Init(data:Object):void
	{
		super.mergeDataFrom(data);
		this.step = this.getInt("step");
		this.slice= this.getInt("slice");
		
		if(step == 0)
			step = 200;	//default Value.
	}
}