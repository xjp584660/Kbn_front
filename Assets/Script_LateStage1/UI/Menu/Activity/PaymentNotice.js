import System;

public class PaymentNotice extends UIObject
{
	public var l_img:Label;
	public var l_des:Label;
	public var l_time:Label;
	public var btn_all :Button;
	
	private var notice:Payment.Notice;
    
    @SerializeField
    private var timerLabelShowTimeKey : String = "paymentLabel.beginnerOfferTimerTip";
    
    @SerializeField
    private var descKey : String = "PaymentOffer.PageDesc";
	
    @Serializable
    private class ColorConfig
    {
        @SerializeField
        private var descColor : FontColor;
        
        public function get DescColor() : FontColor
        {
            return descColor;
        }
        
        @SerializeField
        private var timerTxtColor : FontColor;
        
        public function get TimerTxtColor() : FontColor
        {
            return timerTxtColor;
        }
        
        @SerializeField
        private var timeColor : FontColor;
        
        public function get TimeColor() : FontColor
        {
            return timeColor;
        }
    }
    
    @SerializeField
    private var colorConfigForBg1 : ColorConfig;
    
    @SerializeField
    private var colorConfigForBg2 : ColorConfig;
    
    private var colorConfig : ColorConfig;
    
	public function Init(notice:Payment.Notice):void
	{
		this.notice = notice;
		btn_all.OnClick = onClick;
		
		l_img.useTile = true;

		if(notice.type != 1)
		{
			l_img.tile = TextureMgr.instance().ElseIconSpt().GetTile("payment_sale2");
            colorConfig = colorConfigForBg2;
		}
		else
		{
			l_img.tile = TextureMgr.instance().ElseIconSpt().GetTile("payment_sale");
            colorConfig = colorConfigForBg1;
		}

        l_des.SetNormalTxtColor(colorConfig.DescColor);
        if (notice != null)
        {
            if (notice.pricePoint <= 0)
            {
                l_des.txt = Datas.getArString("PaymentOffer.BeginnerDesc");
            }
            else
            {
                l_des.txt = String.Format(Datas.getArString(descKey), notice.rewardValue, notice.pricePoint);
            }
        }
        
        l_time.SetNormalTxtColor(colorConfig.TimerTxtColor);
		
		btn_all.rect = l_img.rect;
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		l_img.Draw();
		DrawDefaultBtn();
		l_des.Draw();
		if(notice != null)
		{
			if(notice.timeRemaining < 86400 * 3)
			{
                var colorStr : String = _Global.ColorToString(FontMgr.GetColorFromTextColorEnum(colorConfig.TimeColor));
				l_time.txt = String.Format("{0} <color={1}>{2}</color>", Datas.getArString(timerLabelShowTimeKey),
                    colorStr, _Global.timeFormatStr(notice.timeRemaining));
			}
			else
			{
				l_time.txt = Datas.getArString("Common.LimitedTime");
			}
		}
		l_time.Draw();
		GUI.EndGroup();
	}
	
	function DrawDefaultBtn()
	{
		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0, 0.4);	
		btn_all.Draw();
		GUI.color = oldColor;
	}
	
	public function onClick(clickParam:Object):void
	{
		// popup Yuna's offer.
		UnityNet.SendPaymentBI(10); // open Begginer's Offer
		var curType:int = Payment.instance().currentNoticeType;
//		(MenuMgr.getInstance().Beginner as BeginnerOffer).setPaymentMenuReady(true);

        MenuMgr.getInstance().PopMenu("");
        /*offerChange
        var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetDisplayDataByDisplayPosition(curType == 3 ? 
            PaymentOfferManager.DisplayPosition.Lower : PaymentOfferManager.DisplayPosition.Upper);
        if (offerData == null)
        {
            return;
        }
        MenuMgr.getInstance().PushMenu("PaymentOfferMenu", {"data": offerData, "fromPayment": true, "curType":curType}, "trans_zoomComp");
	*/
	}
	
	public function SetScrollPos(pos:int, listHeight:int)
	{
		if(rect.y - pos < 0 || rect.y+rect.height - pos > listHeight)
		{
			l_img.drawTileByGraphics = false;
		}
		else
		{
			l_img.drawTileByGraphics = true;
		}	

	}
}
