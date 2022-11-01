public class FTEStoryText extends SimpleLabel
{
	
	protected var flag:int = 0;
	protected var dtime:double;
	public var timeArr:int[];
	public var alphaArr:int[];
	
	protected var curIdx:int;
	protected var timeSum:float;
	
	public function Init(evo:ElementVO):void
	{
		var obj:Object = evo.getValue("timeArr");
		timeArr = evo.getValue("timeArr"); //as Array).ToBuiltin(double);
		alphaArr = evo.getValue("alphaArr");// as Array).ToBuiltin(double);
	}
	
	public function startEffect():void
	{
		flag = 1;
		dtime = 0;
		curIdx = 0;
		this.alpha = this.alphaArr[0];
	}
	
	public function endEffect():void	
	{
		flag = 2;		
	}
	
	public function Update():void
	{
		if(flag == 1)
		{
			dtime += Time.deltaTime;		
			calcStep();
		
		}	
	}
	
	protected function calcStep():void
	{
		while(flag == 1)
		{ 
			if(dtime > timeArr[curIdx] )
				curIdx ++;
			else
				break;
				
			if(curIdx >= timeArr.length)
				endEffect();
		}
		
		if(flag == 1)
		{
			curIdx --;
			doStepEffect(curIdx,dtime - timeArr[curIdx]);			
		}
	}
	
	protected function doStepEffect(eIdx:int,stepTime:float):void
	{
		var sT:float = timeArr[eIdx + 1] - timeArr[eIdx];		
		this.alpha = alphaArr[eIdx] + (alphaArr[eIdx + 1]- alphaArr[eIdx]) * stepTime / sT;
		
	}
	
	public function Draw()
	{
		var oldColor:Color = GUI.color;
		if(alpha < 0.9999)		
			GUI.color = new Color(1,1,1,alpha);
			
		super.Draw();
		
		GUI.color = oldColor;
		return 0;
	
	}
}