import System.Collections.Generic;

class	PaymentMenu extends	PopMenu implements IEventHandler
{
	public var lineLabel:Label;
	public var paymentList:ScrollView;

	public var payItem:PaymentNewItem;
    public var offerPayItem:PaymentNewItem;

 	public var btn_buy:Button;
 	public var gotoOfferMenu:Button;
 	public var payNotice:PaymentNotice;
 	public var Offer3Notice:PaymentNotice;
 	public var bl:BlueLightBar;
	public var tapJoyItem:TapJoyItem;
 	
 	private var select_item:PaymentNewItem;
    private var selectedCurrency : int;
    
 	public var l_gems:Label;
 	protected var cur_notice:UIObject;
 	
 	private var plist:Array;
 	
 	private var isInitnotice:boolean;
 	public var freeGiftTips : Label;
 	
    @SerializeField private var gemsInfoButton : Button;
    @SerializeField private var gemsInfoButtonLeftMargin : float = 5f;
    
 	
 	public	function Init(){
 		super.Init();
 		m_lockRadio = false;
 		paymentList.Init();
 		payNotice.Init();
 		Offer3Notice.Init();
 		//lineLabel.setBackground("between line", TextureType.DECORATION);
 		isInitnotice = true;
 		title.txt = Datas.getArString("paymentLabel.MenuTitle");
 		freeGiftTips.txt = Datas.getArString("PaymentOffer.FreeGift_Tips");
 		var min:float;
 		var max:float;
 		title.mystyle.CalcMinMaxWidth( GUIContent(title.txt, null, null) , min, max); 
 		l_gems.rect.x = title.rect.x + min + 5;
 		
 		btn_buy.OnClick =  buyClick;
 		btnClose.OnClick = function()
		{
			UnityNet.SendPaymentBI(3);
			MenuMgr.getInstance().PopMenu("");
		};
		
		gotoOfferMenu.OnClick = GotoOfferMenu;
		
		btn_buy.txt = Datas.getArString("Temple_BuyGoldModal.BuyGold_Button");
		
        l_gems.txt = Payment.instance().Gems + "";
        UpdateGemsInfoButton();
 	}
    
    private function UpdateGemsInfoButton() {  
        gemsInfoButton.OnClick = OnClickGemsInfo;
        gemsInfoButton.SetVisible(Payment.instance().ShadowGems > 0);
        gemsInfoButton.txt = String.Format("({0} + {1})", Payment.instance().NormalGems, Payment.instance().ShadowGems);
        gemsInfoButton.rect = new Rect(l_gems.rect.x + l_gems.mystyle.CalcSize(new GUIContent(l_gems.txt, l_gems.image, null)).x + gemsInfoButtonLeftMargin,
            gemsInfoButton.rect.y, gemsInfoButton.mystyle.CalcSize(new GUIContent(gemsInfoButton.txt, null, null)).x, gemsInfoButton.rect.height);
    }
    
    private function OnClickGemsInfo(param : System.Object) : void {
        MenuMgr.getInstance().PushMenu("GemsInfoMenu", null, "trans_zoomComp");
    }
 	
 	public function OnPush(param:Object)
 	{		
 		super.OnPush(param);
 		checkIphoneXAdapter();
		plist = param as Array;
        selectedCurrency = -1;
		resetAll(Payment.instance().currentNoticeType, true);
		SetBackImage();
		var texMgr : TextureMgr = TextureMgr.instance();
		var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		repeatTimes = -6;
 		if( GameMain.instance().getPlayerLevel() <= 4 )
 		{
 			var toastMsg:String = Datas.getArString("ToastMsg.GemsPurpose");
			MenuMgr.getInstance().PushMessage(toastMsg);
			return;
		}
 	}
 	
 	private function SetBackImage() : void
 	{
        var isHaveOffer : boolean = PaymentOfferManager.Instance.IsHaveOffer();
        if(isHaveOffer)
        {
        	gotoOfferMenu.SetVisible(true);
			if(KBN._Global.IsLargeResolution ())
			{
				gotoOfferMenu.rect = new Rect(11,94,548,150);
				paymentList.rect = new Rect(10,270,550,490);								
			}
			else
			{
				gotoOfferMenu.rect = new Rect(11,94,548,130);
				paymentList.rect = new Rect(10,230,550,540);	
			}       	
        }
        else
        {
        	gotoOfferMenu.SetVisible(false);
			if(KBN._Global.IsLargeResolution ())
			{
				paymentList.rect = new Rect(10,105,550,660);								
			}
			else
			{
				paymentList.rect = new Rect(10,85,550,670);
			}         	
        }
 	}
 	
 	protected function resetAll(noticetype:int, updateNotice : boolean):void
 	{
 		paymentList.clearUIObject();
 		cur_notice = null;
        select_item = null;

        var notice : Payment.Notice = null;
        if (updateNotice)
        {
            Payment.instance().reqNotice();
		    notice = Payment.instance().notice;
        }

		if (notice && notice.type == noticetype)
		{
			switch(notice.type)
			{
				case 1:
				case 2:
					cur_notice = payNotice;
					payNotice.Init(Payment.instance().notice);
					break;
					
				case 3:
					cur_notice = Offer3Notice;
					Offer3Notice.Init(Payment.instance().notice);
					break;
					
				case 8:
                    if (PaymentOfferManager.Instance.PayingStatus == PaymentOfferManager.PayingStatusType.HasPaid)
					{
						cur_notice = bl;
						bl.Init();
					}
					break;
			}
		}
		var needSpecialItem : boolean = false;
		//needSpecialItem = true;
      
        if (cur_notice && notice && notice.type == noticetype)
        {
            if (notice.type == 8 || notice.rewardChestId==10005)
            {
                paymentList.addUIObject(cur_notice);
            }
            else
            {
                needSpecialItem = true;
            }
        }
        
        //var isHaveOffer : boolean = PaymentOfferManager.Instance.IsHaveOffer();
//        if (cur_notice && notice && notice.type == noticetype/* && !isHaveOffer*/)
//        {
//            if (notice.type == 8)
//            {
//                paymentList.addUIObject(cur_notice);
//                paymentList.SetItemAutoScale(cur_notice);
//            }
//        }
        PrepareItemList(needSpecialItem, notice);

		if(Payment.instance().isTapjoyOpen())
		{
			tapJoyItem.Init();
			paymentList.addUIObject(tapJoyItem);
			//paymentList.SetItemAutoScale(tapJoyItem);
		}

 	}
    
    protected function PrepareItemList(needSpecialItem : boolean, notice : Payment.Notice)
    {
        var showList : List.<Payment.PaymentElement> = GetPaymentListForShow();
        
        if (needSpecialItem)
        {
            RepermutateShowList(showList, notice);
        }
        
        AddPayItemsToScrollView(needSpecialItem, showList, notice);
    }
    
    protected function AddPayItemsToScrollView(needSpecialItem : boolean, showList : List.<Payment.PaymentElement>, notice : Payment.Notice)
    {
        for (var i = 0; i < showList.Count; ++i)
        {
            var d : Payment.PaymentElement = showList[i];
            var item : PaymentNewItem;

            if (needSpecialItem && notice.pricePoint == d.currency)
            {
                item = Instantiate(offerPayItem);
            }
            else
            {
                item = Instantiate(payItem);
            }
            
            item.Init();           
            item.handlerDelegate = this;
            paymentList.SetItemAutoScale(item);
            paymentList.addUIObject(item);
            item.SetRowData({"PayItem" : d, "Notice" : notice});
    		           
            if (selectedCurrency > 0)
            {
                item.SetSelected(selectedCurrency == d.currency);
            }
            else if (needSpecialItem)
            {
                item.SetSelected(notice.pricePoint == d.currency);
            }
            else
            {
                item.SetSelected(d.itunesProductId == "com.kabam.kocmobile.tier20");
            }
        }
        paymentList.AutoLayout();
 		paymentList.MoveToTop();
    }
    
    protected function GetPaymentListForShow() : List.<Payment.PaymentElement>
    {
        var originalShowList : Array = Payment.instance().getPaymentListForShow(plist);
        var ret : List.<Payment.PaymentElement> = new List.<Payment.PaymentElement>();
        for (var i : int = 0; i < originalShowList.length; ++i)
        {
            ret.Add(originalShowList[i]);
        }
        return ret;
    }
    
    protected function RepermutateShowList(showList : List.<Payment.PaymentElement>, notice : Payment.Notice)
    {
        var hasFoundOfferItem : boolean = false;
        for (var i : int = showList.Count - 1; i >= 0; --i)
        {
            if (!hasFoundOfferItem)
            {
                if (notice.pricePoint == showList[i].currency)
                {
                    hasFoundOfferItem = true;
                }
                continue;
            }
            
            var tmp : Payment.PaymentElement = showList[i];
            showList[i] = showList[i + 1];
            showList[i + 1] = tmp;
        }
    }
 	
 	protected function removeNotice():void
 	{
        resetAll(-1, false);
 	}
 	
 	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.PAYMENT_NOTICE_END:
				removeNotice();
				break;
			case Constant.Notice.PAYMENT_CLOSE:
				this.close();
				break;
		}
	}
	
	public function GotoOfferMenu(clickParam:Object):void
	{
	    var isHaveOffer : boolean = PaymentOfferManager.Instance.IsHaveOffer();
		if(isHaveOffer)
		{
			   MenuMgr.getInstance().PopMenu("");
			   Payment.instance().setCurNoticeType(3);
		       var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetDisplayDataByDisplayPosition();
		        if ( offerData == null )
		           return;
		        MenuMgr.getInstance().PushMenu("OfferMenu",
		             {"data": "", "curType":3},
		             "trans_zoomComp");
		}     
	}
		
 	public function buyClick(clickParam:Object):void
 	{
		if(Payment.instance().CheckBlockAndPopMessage()) {
 			return;
 		}

		 if(select_item != null) {
 			var pe:Payment.PaymentElement = select_item.getData();
 			Payment.instance().AddOrderInfo(pe);
 			MenuMgr.getInstance().PopMenu("");
 			Payment.instance().BuyItem(pe);
 			//test data
// 			var order:Payment.PaymentElement =Payment.instance().GetOrderInfo(pe.payoutId);
//			_Global.Log("cents"+order.cents);
//			_Global.Log("currency"+order.currencyCode);
		}
 	}
 	
 	public function handleItemAction(action:String,data:Object):void
 	{
 		switch(action)
		{
			case Constant.Action.PAYMENT_ITEM_SELECT:	
		 		if(select_item && select_item != data)
		        {
		 			select_item.SetSelected(false);
		        }
		 		select_item = data as PaymentNewItem;
		        selectedCurrency = select_item.getData().currency;
				break;
		}
 	}
	
 	public function Update()
 	{
 		paymentList.Update();
 	}
 	
 	function DrawTitle()
 	{
		title.Draw();
		l_gems.Draw();
        gemsInfoButton.Draw();
	}
	
	function DrawItem()
	{
		lineLabel.Draw();
		GUI.BeginGroup(Rect(20, 0, rect.width - 40, rect.height));
		paymentList.Draw();
		freeGiftTips.Draw();
		btn_buy.Draw();		
		gotoOfferMenu.Draw();	
		GUI.EndGroup();
	}
 	
 	
	public function OnPop()
	{
		super.OnPop();
		MenuMgr.getInstance().floatMessage.forceFinish();
	}
	
	public function OnPopOver()
 	{
 		paymentList.clearUIObject();
 	}
}
