#pragma strict

public class BuyPeacePopMenu extends PopMenu
{
    @SerializeField
    private var tipLabel : SimpleLabel;
    
    @SerializeField
    private var itemRegionBg : SimpleLabel;
    
    @SerializeField
    private var itemIcon : SimpleLabel;
    
    @SerializeField
    private var itemName : SimpleLabel;
    
    @SerializeField
    private var cancelButton : Button;
    
    @SerializeField
    private var buyButton : Button;
    
    @SerializeField
    private var discountBg : SimpleLabel;
    
    @SerializeField
    private var discountPercentage : SimpleLabel;
    
    @SerializeField
    private var discountDesc : SimpleLabel;
    
    @SerializeField
    private var discountDescKey : String = "Off";
    
    private var productId : String;
    
    public function Init() : void
    {
        super.Init();
        buyButton.changeToGreenNew();
        buyButton.OnClick = OnBuyButton;
        buyButton.txt = Datas.getArString("paymentLabel.buyNow");
        cancelButton.changeToBlueNew();
        cancelButton.OnClick = OnCancelButton;
        cancelButton.txt = Datas.getArString("PopUpInfor.ButtonIgnore");
        itemRegionBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2", TextureType.DECORATION);
        itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile("buff_0_icon");
        discountBg.tile = TextureMgr.instance().BackgroundSpt().GetTile("Recommended_box");
        discountPercentage.rect = discountBg.rect;
        discountDesc.rect = discountBg.rect;
        discountDesc.txt = Datas.getArString(discountDescKey);
    }
    
    public function OnPush(param : System.Object)
    {
        super.OnPush(param);
        
        var data : HashObject = param as HashObject;
        tipLabel.txt = _Global.GetString(data["Reason"]);
        itemName.txt = _Global.GetString(data["Desc"]);
        productId = _Global.GetString(data["ProductId"]);
        discountPercentage.txt = _Global.GetString(data["Discount"]);
        SetItemPrice();
    }
    
    public function DrawItem() : void
    {
        if (Event.current.type == EventType.Repaint)
        {
            tipLabel.Draw();
            itemRegionBg.Draw();
            itemIcon.Draw();
            itemName.Draw();
            discountBg.Draw();
            discountPercentage.Draw();
            discountDesc.Draw();
        }
        
        cancelButton.Draw();
        buyButton.Draw();
    }
    
    private function OnBuyButton(param : System.Object) : void
    {
        var payElem : Payment.PaymentElement = Payment.instance().GetPaymentItem(productId);
        if (payElem != null)
        {
            MenuMgr.getInstance().PopMenu("");
            Payment.instance().AddOrderInfo(payElem);
            Payment.instance().BuyItem(payElem);
        }
    }
    
    private function OnCancelButton(param : System.Object) : void
    {
        MenuMgr.getInstance().PopMenu("");
    }
    
    private function SetItemPrice()
    {
        var paymentItems : Array = Payment.instance().getPaymentItems();
        if(paymentItems == null || paymentItems.length <= 0)
        {
            Payment.instance().reqPaymentList(DoSetItemPrice, null, true, true);
        }
        else
        {
            DoSetItemPrice();
        }
    }
    
    private function DoSetItemPrice()
    {
        var payElem : Payment.PaymentElement = Payment.instance().GetPaymentItem(productId);
        if (payElem != null)
        {
            // On the editor, the price won't show if the player opens the payment offer menu after
            // GameMain.recoverPaymentObserver(HashObject) is called. The following 'if' solved this
            if (Application.isEditor && String.IsNullOrEmpty(payElem.price))
            {
                Payment.instance().reqPaymentList(DoSetItemPrice, null, true, true);
                return;
            }
            buyButton.txt = payElem.price;
        }
    }
}
