public class BlueLight extends PopMenu
{
	public var l_title 	:Label;
	public var p_percent:PercentBar;
	public var l_percent:Label;
	public var l_img	:Label;
	public var l_gem	:Label;
	public var l_name	:Label;
	public var btn_buy	:Button;
	private var max:int;
	private var cur:int;
	private var dtime:double = 0.0;
	public var toAlpha:float = 0.5;
	
	public function Init():void
	{
		super.Init();
		
		l_img.useTile = true;
		l_img.tile = TextureMgr.instance().ElseIconSpt().GetTile(Constant.DefaultChestTileName);
		//l_img.tile.name = Constant.DefaultChestTileName;
		l_name.txt = Datas.getArString("paymentLabel.mysticalChest");
		btn_buy.txt = Datas.getArString("paymentLabel.buyNow");
		btn_buy.OnClick = openPayment;
		
		l_gem.setBackground("gems_box", TextureType.DECORATION);
	}
	
	public function OnPush(param:Object):void
	{
		
		var need:int;
			
		max = Payment.instance().blueLightData.max;
		cur = Payment.instance().blueLightData.cur;
		
		need = max - cur;
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
		
		//static + random..
		l_percent.txt = Datas.getArString("paymentLabel.gems2go",[need]) + "";
		l_title.txt = Datas.getArString("paymentLabel.blueLight_title",[need]);

//		Debug.Log("Percent " + cur + " / " + max);
	}
	
	protected function openPayment(clickParam:Object):void
	{
		MenuMgr.getInstance().PopMenu("");
		MenuMgr.getInstance().PushPaymentMenu(Constant.PaymentBI.BlueLight);
	}
	
	public function DrawItem()
	{
		l_title.Draw();
		p_percent.Draw();
		l_percent.Draw();
		l_img.Draw();
		l_gem.Draw();
		l_name.Draw();
		btn_buy.Draw();
	}		
	
	public function Update()
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
