#pragma strict

public class PaymentNewItemWithOffer extends PaymentNewItem
{
    @SerializeField
    protected var plusIcon : SimpleLabel;
    
    @SerializeField
    protected var chestButton : SimpleButton;
    
    @SerializeField
    protected var chestIcon : SimpleLabel;
    
    @SerializeField
    protected var infoIcon : SimpleLabel;
    
    @SerializeField
    protected var valueLabel : SimpleLabel;
    
    @SerializeField
    protected var valueBg : SimpleLabel;
    
    @SerializeField
    protected var timerLabel : SimpleLabel;
    
    protected var notice : Payment.Notice;
    
    public function Init() : void
    {
        super.Init();
        plusIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile("green_add");
        chestIcon.rect = chestButton.rect;
    }
    
    public function SetRowData(data : System.Object) : void
    {
        super.SetRowData(data);
        l_pop.SetVisible(false);
        l_poptxt.SetVisible(false);
        l_des.SetVisible(false);
        
        var dataDict : Hashtable = data as Hashtable;
        notice = dataDict["Notice"] as Payment.Notice;
		var bonusValue:float =notice.WorthBonus;
		if(bonusValue>0){
			var price:String=Payment.instance().getPriceByGems(notice.pricePoint);
	        var orignalPrice:String = Payment.instance().getOriginalPrice(price,notice.WorthBonus);
			valueLabel.txt = String.Format(Datas.getArString("PaymentOffer.Worth")+"\n {0}", orignalPrice);
		}else{
			valueLabel.txt =Datas.getArString("PaymentOffer.Worth")+"\n";
		}
        

        valueBg.tile = TextureMgr.instance().ElseIconSpt().GetTile("Most-Popular");

        if (MystryChest.instance().IsMystryChest_Temp(notice.rewardChestId))
        {
            chestIcon.tile = TextureMgr.instance().ItemSpt().GetTile(Constant.DefaultChestTileName);
            MystryChest.instance().AddLoadMystryChestCallback(OnMystryChestLoaded);
        }
        else
        {
            chestIcon.tile = TextureMgr.instance().LoadTileOfItem(notice.rewardChestId);
            chestButton.OnClick = OnClickChest;
        }
        
        infoIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("infor_icon", TextureType.DECORATION);
    }
    
    protected function DrawInternal()
    {
        if (Event.current.type == EventType.Repaint)
        {
            if (notice != null)
            {
                if(notice.timeRemaining < 86400 * 3)
                {
                    timerLabel.txt = String.Format("{0} <color={1}>{2}</color>", Datas.getArString("paymentLabel.beginnerOfferTimerTip"),
                        _Global.ColorToString(FontMgr.GetColorFromTextColorEnum(FontColor.Red)), _Global.timeFormatStr(notice.timeRemaining));
                }
                else
                {
                    timerLabel.txt = Datas.getArString("Common.LimitedTime");
                }
            }

            super.DrawInternal();
            plusIcon.Draw();
            chestIcon.Draw();
            infoIcon.Draw();

            timerLabel.Draw();

            valueBg.Draw();
            valueLabel.Draw();
        }
        else
        {
            chestButton.Draw();
            super.DrawInternal();
        }
    }
    
    public function SetSelected(b : boolean) : void
    {
        timerLabel.SetNormalTxtColor(b ? FontColor.Milk_White : FontColor.Description_Light);
        super.SetSelected(b);
    }
    
    private function OnMystryChestLoaded() : void
    {
        chestIcon.tile.name = TextureMgr.instance().LoadTileNameOfItem(notice.rewardChestId);
        chestButton.OnClick = OnClickChest;
    }
    
    private function OnClickChest(param : System.Object) : void
    {
        MenuMgr.getInstance().PopMenu("");
        var curType : int = Payment.instance().currentNoticeType;

        var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetDisplayDataByDisplayPosition();
        if (offerData == null)
        {
            return;
        }
        MenuMgr.getInstance().PushMenu("OfferMenu", {"data": offerData, "fromPayment": true, "curType":curType}, "trans_zoomComp");
    
    }
}
