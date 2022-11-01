#pragma strict
import System;

public class OfferItem extends ListItem 
{	
    @SerializeField
    private var timerLabel : Label;
    
    @SerializeField
    private var timerColor : String;
    
    @SerializeField
    private var timerLabelShowTimeKey : String;
    
    @SerializeField
    private var timerLabelLimitedTimeKey : String;
    
    @SerializeField
    private var timerHighlightImage : Label;
    
    @SerializeField
    private var topBgImage : Label;
   
    @SerializeField
    private var queen : Label;
    
    @SerializeField
    private var banner : Label;
    
    @SerializeField
    private var hugeGems : Label;
    
    @SerializeField
    private var worthImage : Label;
    
    @SerializeField
    private var worthLabel : Label;
    
    @SerializeField
    private var arrow : Label;
    
    @SerializeField
    private var oldPrice : Label;
    
     @SerializeField
    private var titleContent : Label;
    
    @SerializeField
    private var gemsCountImageMarginLeft : int = 5;
   
    @SerializeField
    private var chestDetailOutline : Label;
    
    @SerializeField
    private var chestDetailTitle : Label;
    
    @SerializeField
    private var chestDetailView : OfferSubItemsDetailView;
   
    @SerializeField
    private var buyButton : Button;

    @SerializeField
    private var monthlyTag : Button;
    
     @SerializeField
    private var hotTag : Button;
    
     @SerializeField
    private var monthlyTagLabel : Label;
    
     @SerializeField
    private var hotTagLabel : Label;
    
    @SerializeField
    private var getTitle : Label;
    
    @SerializeField
    private var detailBtn : Button;
    
    private var chestId : int = -1;

    private var subItems:HashObject=null;

    private var isMonthlyCard:boolean=false;
    
    private var pricePoint : int = 0;
    
    private var chestInfoReady : boolean = false;
    
    private var loadingLabel : LoadingLabelImpl;
    
    private var curType : int;
    
    private var timeSurplus : long ;

    private var titleBg:Label;
    
    @SerializeField
    private var gemsCountImage : Label;
    
    @SerializeField
    private var gemsPlusImage : Label;
    
    @SerializeField
    private var gemsTextImage : Label;
    
    @SerializeField
    private var monthlyTimmer : Label;
    
    var offerData : PaymentOfferData;
    
    @SerializeField
    public var offerBanner : ComposedUIObj;

    public var SurplusTimesLabel : Label;
    
    public function GetChestDetailView() : OfferSubItemsDetailView
    {
    	return chestDetailView;
    }
    
     public function Init()
    {
        loadingLabel = null;
        chestInfoReady = false;
        SetChestDetailVisible(false);
    
        hugeGems.mystyle.normal.background = TextureMgr.instance().LoadTexture("gems", TextureType.DECORATION);    
        chestDetailTitle.txt = Datas.getArString("PaymentOffer.FreeGift_Title");
        
        gemsCountImage.useTile = true;
		gemsPlusImage.useTile = true;
		gemsPlusImage.tile = TextureMgr.instance().ElseIconSpt().GetTile("plus");
		gemsTextImage.useTile = true;
        gemsTextImage.tile = TextureMgr.instance().ElseIconSpt().GetTile("gems");
        
        buyButton.changeToBlueNew();
        buyButton.OnClick = OnClickBuyButton;
        
        detailBtn.OnClick = OnClickDetailButton;
        
        titleBg=componetList[3] as Label;
        monthlyTag.OnClick = OnClickMonthlyCardHelp;
    }
    
    private function SetTag()
    {
    	if(offerData.offerLabel == 1 || offerData.offerLabel == 2)
    	{
    		hotTag.SetVisible(true);
    		hotTagLabel.SetVisible(true);
    		hotTagLabel.txt = Datas.getArString(String.Format("Offer.label{0}", offerData.offerLabel));
    		
    		monthlyTag.SetVisible(false);
    		monthlyTagLabel.SetVisible(false);
    	}
    	else if(offerData.offerLabel == 3 || offerData.offerLabel == 4 || offerData.offerLabel == 5)
    	{
    		hotTag.SetVisible(false);
    		hotTagLabel.SetVisible(false);
    		
    		monthlyTag.SetVisible(true);
    		monthlyTagLabel.SetVisible(true);
    		monthlyTagLabel.txt = Datas.getArString(String.Format("Offer.label{0}", offerData.offerLabel));
    	}
    	else
    	{
    		hotTag.SetVisible(false);
    		hotTagLabel.SetVisible(false);
    		
    		monthlyTag.SetVisible(false);
    		monthlyTagLabel.SetVisible(false);
    	}
    }
    
    private function SetMonthlyTime()
    {
    	if (isMonthlyCard) 
        {
            titleBg.mystyle.normal.background=TextureMgr.instance().LoadTexture("monthlyCard_title", TextureType.ICON_ELSE);
                       
            if(offerData.day > 0)
            {
//            	monthlyTimmer.txt = String.Format("{0} <color=#{1}><i>{2}</i></color>", Datas.getArString("Offer.monthpack2"),
//                    timerColor, offerData.day);
				var timmer : String = String.Format("<color=#{0}><i>{1}</i></color>", timerColor, offerData.day);
                monthlyTimmer.txt = String.Format(Datas.getArString("Offer.monthpack2"),timmer);
                monthlyTimmer.SetVisible(true);
                monthlyTimmer.rect.y = 312;
             	monthlyTimmer.rect.height = 32;
                buyButton.SetVisible(false);
            }
            else if(offerData.day < 0)
            {
            	monthlyTimmer.txt = Datas.getArString("Offer.monthpack3");
                monthlyTimmer.SetVisible(true);
                monthlyTimmer.rect.y = 304;
             	monthlyTimmer.rect.height = 50;
                buyButton.SetVisible(false);                
            }
            else
            {
            	monthlyTimmer.SetVisible(false);
                buyButton.SetVisible(true);
            }
        }else
        {
        	monthlyTimmer.SetVisible(false);
        	buyButton.SetVisible(true);
            titleBg.mystyle.normal.background=TextureMgr.instance().LoadTexture("eventcenter_Begin_tiao", TextureType.ICON_ELSE);
        }
    }
  
  public function SetRowData(param : System.Object)
    {
    	 var data : PaymentOfferData = null;
        if ((param as PaymentOfferData) != null)
        {
            data = param as PaymentOfferData;
            //curType = data.Type;
        }
        else // param is a Hashtable
        {
            var paramDict : Hashtable = param as Hashtable;
            data = paramDict["data"];
        }
		offerData = data;
        chestId = data.RewardChestId;
        pricePoint = data.PricePoint;
        
        subItems = data.subItems;
        isMonthlyCard = data.IsMonthlyCard;
        
		SetTag();
        SetMonthlyTime();

		if(data.OfferPictureName != "")
		{		
			topBgImage.mystyle.normal.background = TextureMgr.instance().LoadTexture(data.OfferPictureName, TextureType.PAYMENT_OFFER); 			
		}
		else
		{
			topBgImage.mystyle.normal.background = null; 					
		}
		
		var imageTex : Texture2D = TextureMgr.instance().LoadTexture(data.OfferImageName, TextureType.PAYMENT_OFFER); 
		//var imageTex : Texture2D = TextureMgr.instance().LoadTexture("offerImage3", TextureType.PAYMENT_OFFER); 			
		//data.OfferImageName = "offerImage2";
		if(data.OfferImageName != "")
		{		
			queen.mystyle.normal.background = imageTex; 			
		}
		else
		{
			queen.mystyle.normal.background = null; 					
		}		
		//queen.rect.height 324
		if(KBN._Global.IsLargeResolution ())
		{
			queen.rect.width = _Global.INT32(_Global.FLOAT((queen.rect.height/* - queen.rect.y*/) * imageTex.width) / _Global.FLOAT(imageTex.height));		
		}
		else
		{
			queen.rect.width = _Global.INT32(_Global.FLOAT((queen.rect.height/* - queen.rect.y*/) * imageTex.width) / _Global.FLOAT(imageTex.height)) + 40;
		}
		
		var pricePointType : int = data.PricePointType;
		var greaterThanOrEqualMode : boolean = (pricePointType == Constant.PaymentOffer.PricePointType.GreaterOrEqual);
        var gemsCountTile : Tile = null;
	    gemsCountImage.SetVisible(true);
        gemsTextImage.SetVisible(true);
        gemsPlusImage.SetVisible(greaterThanOrEqualMode);
        if (greaterThanOrEqualMode)
        {  
            var tileName:String = String.Format("{0}g", pricePoint);
            if (null != TextureMgr.instance().ItemSpt().FindTile(tileName))
            {
	            gemsCountTile = TextureMgr.instance().ItemSpt().GetTile(tileName);
	            gemsCountImage.tile = gemsCountTile;
	            gemsCountImage.rect.width = gemsCountImage.rect.height * gemsCountTile.rect.width / gemsCountTile.rect.height;
	            gemsPlusImage.rect.x = gemsCountImage.rect.xMax;
	            gemsTextImage.rect.x = gemsPlusImage.rect.xMax + gemsCountImageMarginLeft;
            }
            else
            {
	            gemsCountImage.SetVisible(false);
		        gemsTextImage.SetVisible(false);
		        gemsPlusImage.SetVisible(false);
            }
        }
        else
        {
            gemsCountTile = TextureMgr.instance().ItemSpt().GetTile(String.Format("{0}g", pricePoint));
            gemsCountImage.tile = gemsCountTile;
            gemsCountImage.rect.width = gemsCountImage.rect.height * gemsCountTile.rect.width / gemsCountTile.rect.height;
            gemsTextImage.rect.x = gemsCountImage.rect.xMax + gemsCountImageMarginLeft;
        }

        titleContent.txt = data.Name;
           
        if(isMonthlyCard)
        {
        	chestDetailTitle.txt = Datas.getArString("Offer.monthlytest2");
        }   
        else
        {
        	chestDetailTitle.txt = String.Format(Datas.getArString("Offer.test2"), data.offerWorth);
        }               
        
        SetBuyButtonTextWithPrice();
    	worthLabel.txt = offerData.RewardChestValuePercentage * offerData.WorthBonus * 100 + "%";

		OnChestInfoLoaded();
        var timeEnd : long = offerData.EndTime;
    	timeSurplus = timeEnd - GameMain.unixtime();
        if(timeSurplus<=0 || offerData.SurplusTimes <= 0) {
        	MenuMgr.getInstance().sendNotification("refreshOfferMenuList",null);
        }
   		OnPushOver();
    }
    
    public function OnPushOver()
    {
        if (!chestInfoReady)
        {
            loadingLabel = new LoadingLabelImpl(false, chestDetailOutline.rect.center);
            MystryChest.instance().AddLoadMystryChestCallback(function() {
                var menu : PaymentOfferMenu = MenuMgr.getInstance().getMenu("PaymentOfferMenu", false) as PaymentOfferMenu;
                if (menu == null)
                {
                    return;
                }
                OnChestInfoLoaded();
            });
        }
    }
    
    public function OnPop()
    {
        loadingLabel = null;
    }
    
    public function OnPopOver()
    {
        chestDetailView.OnPopOverOrDestroy();
    }
    
    public function OnDestroy()
    {
        if (chestDetailView != null)
        {
            chestDetailView.OnPopOverOrDestroy();
        }
    }
    
    public function resetLayout()
    {
    }
    
  	private function UpdateInfo()
  	{
        if (loadingLabel != null)
        {
            loadingLabel.Update();
        }
        if(timeSurplus<=0 ){
        	return;
        }
        chestDetailView.Update();
    
        if(offerData != null)
        {
            var timeEnd : long = offerData.EndTime;
             timeSurplus = timeEnd - GameMain.unixtime();
            //var shouldShowTime : boolean = (timeEnd - GameMain.unixtime()) < 86400 * 3;
            if(timeSurplus<=0 || offerData.SurplusTimes <= 0) {
            	MenuMgr.getInstance().sendNotification("refreshOfferMenuList",null);
            	timeSurplus=0;
            }
            var shouldShowTime : boolean = true;

            timerLabel.SetVisible(shouldShowTime);
        	timerHighlightImage.SetVisible(shouldShowTime);   
            if (shouldShowTime)
            {
                timerLabel.txt = String.Format("{0} <color=#{1}><i>{2}</i></color>", Datas.getArString(timerLabelShowTimeKey),
                    timerColor, _Global.timeFormatStr(timeSurplus));                
            }

            //SurplusTimesLabel.txt = String.Format(Datas.getArString("Offer.SurplusTimes"), offerData.SurplusTimes);
            SurplusTimesLabel.txt = String.Format("{0}{1}","remaining times:",offerData.SurplusTimes.ToString());
        }
  	}
   
    public function Update()
    {

    }
     
    private function OnChestInfoLoaded()
    {
        chestInfoReady = true;
        loadingLabel = null;
        chestDetailView.Init(offerData);

        SetChestDetailVisible(true);
    }
    
    private function SetChestDetailVisible(visible : boolean)
    {
        chestDetailView.SetVisible(visible);
    }
    
    private function OnClickMonthlyCardHelp(param : System.Object)
    {
    	if(isMonthlyCard)
    	{
    		MenuMgr.getInstance().PushMenu("MonthlyCardHelpMenu", null, "trans_zoomComp");
    	}
    }
    
    private function OnClickBuyButton(param : System.Object)
    {
//        var userName : String = Datas.instance().getHashedNaid();
    	var payment : Payment.PaymentElement = Payment.singleton.GetOrderByGems(offerData.PricePoint);
    	if(payment != null)
    	{
    		var productId : String = payment.itunesProductId;
			GameMain.instance().buyAppOfferProduct(productId,payment.payoutId, offerData);
    	}
	}
    
    private function OnClickDetailButton(param : System.Object)
    {
    	MenuMgr.getInstance().PushMenu("PopOfferSubItemsView", offerData, "trans_zoomComp");
    }
    
    private function DirectBuy()
    {
        var paymentItems : Array = Payment.instance().getPaymentItems();
        if(paymentItems.length <= 0)
        {
            Payment.instance().reqPaymentList(DoDirectBuy, null, true, true);
        }
        else
        {
            DoDirectBuy();
        }
    }
    
    private function DoDirectBuy()
    {
        var payElem : Payment.PaymentElement = Payment.instance().getProductIdByCurrency(pricePoint);
        if (payElem != null) 
        {
            MenuMgr.getInstance().PopMenu("");
            Payment.instance().BuyItem(payElem);
        }
    }
    
    private function OpenPayment()
    {
    	Payment.instance().setCurNoticeType(curType);
        if(MenuMgr.getInstance().hasMenuByName("PaymentMenu"))
        {
            MenuMgr.getInstance().PopMenu("");
        }
        else
        {
            MenuMgr.getInstance().PopMenu("", "trans_immediate");

            var seed:HashObject = GameMain.instance().getSeed();
    
            if(curType == 3 && (PaymentOfferManager.Instance.PayingStatus == PaymentOfferManager.PayingStatusType.HasNotPaid))
            {
                MenuMgr.getInstance().PushPaymentMenu(Constant.PaymentBI.BegginerOpen);
            }
            else
            {
                MenuMgr.getInstance().PushPaymentMenu(Constant.PaymentBI.PayOffer);
            }   
        }
    }
    
    /*	
   ┏┓ 	  ┏┓ 
  ┏┛┻━━  ━┛┻┓ 
  ┃　　　		┃  
  ┃　　 ━	┃  
  ┃　┳┛　┗┳　┃ 
  ┃　　		┃ 
  ┃　　 ┻	┃ 
  ┗ ━┓　	  ┏━┛ 
  　　┃　　┃　　　　 　　　　　　
  　　┃　　┗━ ━ ━ ━ ┓ 
  　　┃　　　　      ┣┓
  　　┃　    	      ┏┛
  　　┗┓┓┏━┳┓┏ ━	 ━┛ 
  　　 ┃┫┫ ┃┫┫ 
  　　 ┗┻┛ ┗┻┛ 

*/
    
    private function SetBuyButtonTextWithPrice()
    {
        var price:String=Payment.instance().getPriceByGems(pricePoint);
        if(price == null || price.length==0 || offerData == null) 
        {
        	Payment.instance().reqPaymentData();
        	buyButton.txt = "";
        	buyButton.SetDisabled(true);
			buyButton.changeToGreyNew();
    	}
    	else
    	{
		  	var orignalPrice:String = Payment.instance().getOriginalPrice(price,offerData.WorthBonus);
        	buyButton.txt =price;
        	buyButton.SetDisabled(false);
			buyButton.changeToBlueNew();
    	}
    }
       
    private function DoSetBuyButtonTextWithPrice()
    {
        var payElem : Payment.PaymentElement = Payment.instance().getProductIdByCurrency(pricePoint);
        if (payElem != null)
        {
            // On the editor, the price won't show if the player opens the payment offer menu after
            // GameMain.recoverPaymentObserver(HashObject) is called. The following 'if' solved this
            if (Application.isEditor && String.IsNullOrEmpty(payElem.price))
            {
                Payment.instance().reqPaymentList(DoSetBuyButtonTextWithPrice, null, true, true);
                return;
            }
            //buyButton.changeToGreen();
            buyButton.txt = payElem.price;
        }
    }

    public function Draw()
    {
   		 if(!visible)
			return -1;
    	GUI.BeginGroup(rect);
    	for(var i:int=0;i<componetList.Count;i++){
			componetList[i].Draw();
		}
		GUI.EndGroup();
		UpdateInfo();
	   	return -1;
    }
}