#pragma strict

class PayItemRS extends FullClickItem
{
	public var bgframe:Label;
//	public var bg:Label;
	public var bg_bottom:Label;
	public var bg_light:Label;
	public var gemTxt:Label;
	public var gemNums:ArtNums;
	public var diamond:Label;
	public var price:Label;
	public var l_TapJoy:Label;
	public var l_pop	:Label;
	public var l_poptxt	:Label;
	
	
	private var m_Data:Payment.PaymentElement;
	
	public function Init()
	{
		super.Init();
		bgframe.Init();
		bgframe.setBackground("payment_Backplane",TextureType.DECORATION);
		btnDefault.rect = Rect(8, 8, rect.width-37, rect.height - 27);
		gemNums.Init();
		gemTxt.Init();
		gemTxt.setBackground("gems", TextureType.ICON);
		bg_bottom.Init();
		bg_bottom.setBackground("payment_Backplane2",TextureType.DECORATION);
		btnDefault.OnClick = handleBtn;	
		l_TapJoy.txt = Datas.getArString("Temple_BuyGoldModal.EarnGold_Button");
		l_pop.useTile = true;
		l_pop.tile = TextureMgr.instance().ElseIconSpt().GetTile(null);
	}
	
	public function SetRowData(data:Object)
	{
		m_Data = data as Payment.PaymentElement;
		
		if(m_Data.isTapJoy)
		{
			gemNums.clearUIObject();
			gemTxt.SetVisible(false);
			price.SetVisible(false);
			diamond.SetVisible(false);
			l_TapJoy.SetVisible(true);
			l_pop.SetVisible(false);
			l_poptxt.SetVisible(false);
		}
		else
		{
			l_pop.SetVisible(true);
			l_poptxt.SetVisible(true);
			switch(m_Data.saleType)
			{
				case Payment.ST_POPULAR:
					l_pop.tile.name = "Most-Popular";
					l_poptxt.txt = Datas.getArString("paymentLabel.Most_Popular");
					break;
				case Payment.ST_VALUABLE:
					l_pop.tile.name = "Best-Value";
					l_poptxt.txt = Datas.getArString("paymentLabel.Best_Value"); 
					break;
				case Payment.ST_LIMIT:
					l_pop.tile.name = "Best-Value";
					l_poptxt.txt = Datas.getArString("paymentLabel.Limited_Offer");
					break;
				//case Payment.ST_COMMON:
				default:
					l_pop.SetVisible(false);
					l_poptxt.SetVisible(false);
					break;
			}
			gemNums.SetNums(m_Data.currency);
			gemNums.rect.x = (rect.width - gemNums.rect.width - gemTxt.rect.width)/2 -1;
			gemTxt.rect.x = gemNums.rect.x + gemNums.rect.width + 1;
			price.txt = _Global.GetString(m_Data.price);
			SetDiamond();
			
			diamond.SetVisible(true);
			gemTxt.SetVisible(true);
			price.SetVisible(true);
			l_TapJoy.SetVisible(false);
		}
		
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		bgframe.Draw();
//		bg.Draw();
		bg_light.Draw();
		bg_bottom.Draw();
		diamond.Draw();
		gemNums.Draw();
		gemTxt.Draw();
		price.Draw();
		l_TapJoy.Draw();
		btnDefault.Draw();
		l_pop.Draw();
		l_poptxt.Draw();
		GUI.EndGroup();
//		super.Draw();
	}
	
	public function SetDiamond()
	{
		diamond.SetVisible(true);
		switch (m_Data.currency)
		{
			case 30:
				diamond.setBackground("gems1",TextureType.DECORATION);
			break;
			case 50:
				diamond.setBackground("gems1",TextureType.DECORATION);
			break;
			case 100:
				diamond.setBackground("gems2",TextureType.DECORATION);
			break;
			case 240:
				diamond.setBackground("gems3",TextureType.DECORATION);
			break;
			case 375:
				diamond.setBackground("gems4",TextureType.DECORATION);
			break;
			case 665:
				diamond.setBackground("gems5",TextureType.DECORATION);
			break;
			case 1600:
				diamond.setBackground("gems6",TextureType.DECORATION);
			break;
			default:
				diamond.SetVisible(false);
		}
		
		if(diamond.mystyle.normal.background != null)
		{
			var sourceWidth:float = 0.0;
			var sourceHeight:float = 0.0;
			sourceWidth = diamond.mystyle.normal.background.width;
			sourceHeight = diamond.mystyle.normal.background.height;
			diamond.rect.x = (this.rect.width - sourceWidth)/2;
			diamond.rect.y = (this.rect.height - sourceHeight)/2;
			diamond.rect.width = sourceWidth;
			diamond.rect.height = sourceHeight;
		}
	}
	
	public function OnClear()
	{
		gemNums.clearUIObject();
	}
	
	public function handleBtn()
	{
		if(m_Data.isTapJoy)
		{
			NativeCaller.ShowTapJoyOffers();
		}
		else
		{
			MenuMgr.getInstance().PopMenu("");
 			Payment.instance().BuyItem(m_Data);
 		}
	}
	
}