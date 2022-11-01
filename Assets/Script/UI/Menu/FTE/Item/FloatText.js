public class FloatText extends TypingText
{
	protected var fy:float;
	protected var ty:float;
	protected var ftime:float;
	
	protected var fa:float;
	protected var ta:float;
	protected var atime:float;
	
	public function Init(evo:ElementVO)
	{
		super.Init();
		fy = evo.getFloat("fy");
		ty = evo.getFloat("ty");
		ftime = evo.getFloat("ftime");
		
		fa = evo.getFloat("fa");
		ta = evo.getFloat("ta");
		atime = evo.getFloat("atime");
		delayTime = evo.getFloat("delayTime");
	}
	
	public function startTyping():void
	{
		dtime = -delayTime;
		this.txt = wholeText;
		flag = 1;
		setAlphaPercent(0);
	}
	
	public function Draw():int
	{
		var oldColor:Color = GUI.color;
		if(m_color.a < 0.9999) //
			GUI.color = m_color;
			
		super.Draw();
		
		GUI.color = oldColor;
		return 0;
	}
	
	protected function updateTxt():void
	{
		this.setFloatPercent(dtime / ftime);
		this.setAlphaPercent(dtime / atime);
		
		if(dtime >= ftime && dtime >= atime)
		{
			endTyping();
		}
	}
	protected function setFloatPercent(percent:float):void
	{
		this.rect.y = func_linear(fy,ty,percent);
	}
	protected function setAlphaPercent(percent:float):void
	{
		this.m_color.a = func_linear(fa,ta,percent);
	}
	
	public function get canEndType():boolean
	{
		return flag == 1;
	}
	
	public function endTyping():void
	{
		if(flag == 1)
		{
			flag = 2;
			setFloatPercent(1);
			setAlphaPercent(1);
			
			if(typeEndFunc)
				typeEndFunc();
		}
	}
	
	
	protected function func_linear(fromV:float,toV:float,percent:float):float
	{
		percent = percent < 0 ? 0 : percent;
		percent = percent > 1 ? 1 : percent;
		return fromV * (1 - percent) + toV * percent;		
	}
}