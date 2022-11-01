public class BlueLightBar extends ListItem
{
	public var l_title 	:Label;
	public var p_percent:PercentBar;
	public var l_percent:Label;
	public var l_img	:Label;
	private var max:int;
	private var cur:int;
	protected var dtime:double = 0;
	public var toAlpha:float = 0.5;
	
	public function Init():void
	{
		
		var need:int;
		
		max = Payment.instance().blueLightData.max;
		cur = Payment.instance().blueLightData.cur;
		
		need = max - cur;
		
		
		l_title.txt = Datas.getArString("paymentLabel.blueLightContent");
		
		var l:int = (Random.value * 999) % 3 + 1;
		l_percent.txt = Datas.getArString("paymentLabel.gems2go",[need]) +" - " + Datas.getArString("paymentLabel.gems2go_apd" + l);
		
		p_percent.Init();
		
		if(cur == 0)
		{
			p_percent.thumb.alphaEnable = true;
			p_percent.thumb.alpha = 0;	
			p_percent.Init(max,max);
		}
		else
		{
			p_percent.thumb.alphaEnable = false;
			p_percent.thumb.alpha = 1;
			cur = 0.05 * max + 0.95 * cur;
			p_percent.Init(cur,max);	
		}
	}
	
	
	public function DrawItem()
	{
		//GUI.BeginGroup(rect);
		l_title.Draw();
		p_percent.Draw();
		l_percent.Draw();
		l_img.Draw();
		
		//GUI.EndGroup();
	}
	
	public function UpdateData()
	{
		
		if(cur == 0)
		{
			dtime += Time.deltaTime;
			while(dtime > 2)
				dtime -= 2;
			if(dtime <=1)
				p_percent.thumb.alpha = dtime * toAlpha;
			else
				p_percent.thumb.alpha = toAlpha - (dtime -1) / 2;
		}
		
	}
	
}
