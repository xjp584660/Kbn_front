#pragma strict
import System;

public class OfferPopItem extends ListItem 
{
// @SerializeField
//    private var frameOffset : RectOffset;

//    @SerializeField
//    private var titleLabelBg : Label;
//
//    @SerializeField
//    private var titleLabel : Label;
	
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
    private var descLabel : Label;
    
    @SerializeField
    private var descLabelRectNotLessThan : Rect;
    
//    @SerializeField
    private var descKeyNotLessThan : String = "With a single purchase no less than <i><color=#f9ed91>{0} gems</color></i> to win the {1}!";
    
    @SerializeField
    private var descLabelRectEqual : Rect;
    
//    @SerializeField
    private var descKeyEqual : String = "buy {0} Gems,Get {1}!";

    @SerializeField
    private var queen : Label;
    
    @SerializeField
    private var banner : Label;
    
    @SerializeField
    private var hugeGemsBg : Label;
    
    @SerializeField
    private var hugeGems : Label;

    @SerializeField
    private var gemsCountImage : Label;
    
    @SerializeField
    private var gemsPlusImage : Label;
    
    @SerializeField
    private var gemsTextImage : Label;
    
    @SerializeField
    private var worthImage : Label;
    
     @SerializeField
    private var hotTitleBack : Label;
    
    @SerializeField
    private var worthGems : Label;
    
    @SerializeField
    private var worthGemsImage : Label;
    
    @SerializeField
    private var worthLabel : Label;
    
    @SerializeField
    private var arrow : Label;
    
    @SerializeField
    private var oldPrice : Label;
    
     @SerializeField
    private var titleContent : Label;
    
    @SerializeField
    private var oldPriceImage : Label;
    
    @SerializeField
    private var gemsCountImageMarginLeft : int = 5;
   
    @SerializeField
    private var chestDetailOutline : Label;
    
    @SerializeField
    private var chestDetailTitle : Label;
    
    @SerializeField
    private var chestDetailMargin : RectOffset;
    
    @SerializeField
    private var chestDetailView : PaymentOfferChestDetailView;
   
    @SerializeField
    private var buyButton : Button;

    @SerializeField
    private var monthlyCardTag : Button;
    
    private var chestId : int = -1;

    private var subItems:HashObject=null;

    private var isMonthlyCard:boolean=false;
    
    private var pricePointType : int = -1;
    
    private var pricePoint : int = 0;
    
    private var chestValue : int = 0;
    
    private var chestValuePercentage : int = 0;
    
    private var chestInfoReady : boolean = false;
    
    private var shouldDirectBuy : boolean = false;
    
    private var loadingLabel : LoadingLabelImpl;
    
    private var curType : int;
    
    private var timeSurplus : long ;

    private var titleBg:Label;
    
    var offerData : PaymentOfferData;
    
    public function GetChestDetailView() : PaymentOfferChestDetailView
    {
    	return chestDetailView;
    }
    
     public function Init()
    {
        loadingLabel = null;
        chestInfoReady = false;
        SetChestDetailVisible(false);
    
        hugeGemsBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("payment_light", TextureType.DECORATION);
        hugeGems.mystyle.normal.background = TextureMgr.instance().LoadTexture("gems", TextureType.DECORATION);
		gemsCountImage.useTile = true;
		gemsPlusImage.useTile = true;
		gemsPlusImage.tile = TextureMgr.instance().ElseIconSpt().GetTile("plus");
		gemsTextImage.useTile = true;
        gemsTextImage.tile = TextureMgr.instance().ElseIconSpt().GetTile("gems");

        chestDetailTitle.mystyle.normal.background = TextureMgr.instance().LoadTexture("Event_mytiao", TextureType.DECORATION);
        chestDetailTitle.txt = Datas.getArString("PaymentOffer.FreeGift_Title");
        
        chestDetailView.rect = new Rect(chestDetailOutline.rect.x + chestDetailMargin.left, chestDetailOutline.rect.y + chestDetailMargin.top,
        chestDetailOutline.rect.width - chestDetailMargin.horizontal, chestDetailOutline.rect.height - chestDetailMargin.vertical);
        
        buyButton.changeToBlueNew();
        buyButton.OnClick = OnClickBuyButton;
        titleBg=componetList[3] as Label;
        monthlyCardTag.OnClick = OnClickMonthlyCardHelp;
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
		offerData=data;
        chestId = data.RewardChestId;
        pricePoint = data.PricePoint;
        pricePointType = data.PricePointType;
        chestValue = data.RewardChestValue;
        chestValuePercentage = data.RewardChestValuePercentage;
        worthGems.txt=Datas.getArString("PaymentOffer.Worth");

        subItems=data.subItems;
        isMonthlyCard=data.IsMonthlyCard;
        monthlyCardTag.SetVisible(isMonthlyCard);
        if (isMonthlyCard) {
            titleBg.mystyle.normal.background=TextureMgr.instance().LoadTexture("monthlyCard_title", TextureType.ICON_ELSE);
        }else{
            titleBg.mystyle.normal.background=TextureMgr.instance().LoadTexture("eventcenter_Begin_tiao", TextureType.ICON_ELSE);
        }

		if(data.OfferPictureName != "")
		{		
			topBgImage.mystyle.normal.background = TextureMgr.instance().LoadTexture(data.OfferPictureName, TextureType.PAYMENT_OFFER); 			
		}
		else
		{
			topBgImage.mystyle.normal.background = null; 					
		}
//		if(KBN._Global.IsLargeResolution ())
//		{
//			topBgImage.rect.height = 320;			
//		}
//		else
//		{
//			topBgImage.rect.height = 264;
//		} 
		
		var imageTex : Texture2D = TextureMgr.instance().LoadTexture(data.OfferImageName, TextureType.PAYMENT_OFFER); 
		if(data.OfferImageName != "")
		{		
			queen.mystyle.normal.background = imageTex;		
		}
		else
		{
			queen.mystyle.normal.background = null; 					
		}
		if(KBN._Global.IsLargeResolution ())
		{
			queen.rect.width = _Global.INT32(_Global.FLOAT((queen.rect.height/* - queen.rect.y*/) * imageTex.width) / _Global.FLOAT(imageTex.height));		
		}
		else
		{
			queen.rect.width = _Global.INT32(_Global.FLOAT((queen.rect.height/* - queen.rect.y*/) * imageTex.width) / _Global.FLOAT(imageTex.height)) + 40;
		}
//		if(KBN._Global.IsLargeResolution ())
//		{
//			queen.rect.height = 338;			
//		}
//		else
//		{
//			queen.rect.height = 273;
//		}
//		SetQueenWidth(data.OfferImageName); 

        titleContent.txt = data.Name;
        var greaterThanOrEqualMode : boolean = (pricePointType == Constant.PaymentOffer.PricePointType.GreaterOrEqual);
        var gemsCountTile : Tile = null;
        
        gemsCountImage.SetVisible(true);
        gemsTextImage.SetVisible(true);
        gemsPlusImage.SetVisible(greaterThanOrEqualMode);
        chestDetailTitle.txt = data.BannerDesc;
        if(data.Desc != ".")
        {
        	descLabel.txt = data.Desc;        
        }
        else
        {
        	descLabel.txt = "";                
        }
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
        SetBuyButtonTextWithPrice();
    	worthLabel.txt=oldPrice.txt;
    	worthGemsImage.SetVisible(false);
    	buyButton.mystyle.contentOffset.x=60;    	

		OnChestInfoLoaded();
        var timeEnd : long = offerData.EndTime;
    	timeSurplus = timeEnd - GameMain.unixtime();
        if(timeSurplus<=0 || offerData.SurplusTimes <= 0) {
        	MenuMgr.getInstance().sendNotification("refreshOfferMenuList",null);
        }
   		OnPushOver();
    }
    
    private function SetQueenWidth(queenName : String)
    {    	
    	switch(queenName)
    	{
    		case "offerImage1" :
    			queen.rect.x = -25;
    			queen.rect.y = 37;
    			queen.rect.width = 255;
    			break;
    		case "offerImage2" :
    			queen.rect.x = -25;
    			queen.rect.y = 37;
    			queen.rect.width = 255;
				if(KBN._Global.IsLargeResolution ())
				{
					queen.rect.height = 330;			
				}
    			break;
			case "offerImage3" :
				queen.rect.x = -9;
    			queen.rect.y = 27;
				queen.rect.width = 388;
				break;
			case "offerImage4" :
				queen.rect.x = -11;
    			queen.rect.y = 28;
				queen.rect.width = 360;
				break;
			case "offerImage5" :
				queen.rect.x = -28;
    			queen.rect.y = 30;
				queen.rect.width = 420;
				break;
			case "offerImage6" :				
				queen.rect.x = 2;
				queen.rect.y = 55;
				queen.rect.width = 285;
				if(KBN._Global.IsLargeResolution ())
				{
					queen.rect.height = 290;			
				}
				else
				{
					queen.rect.height = 247;
				}
				break;
			case "offerImage7" :				
				queen.rect.x = -26;
				queen.rect.y = 8;
				queen.rect.width = 470;
				break;					
    	}
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
    
//        var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetDataByCategory(curType);
        if(offerData != null)
        {
            var timeEnd : long = offerData.EndTime;
             timeSurplus = timeEnd - GameMain.unixtime();
            var shouldShowTime : boolean = (timeEnd - GameMain.unixtime()) < 86400 * 3;
            if(timeSurplus<=0 || offerData.SurplusTimes <= 0) {
            	MenuMgr.getInstance().sendNotification("refreshOfferMenuList",null);
            	timeSurplus=0;
            }
            timerLabel.SetVisible(shouldShowTime);
        	timerHighlightImage.SetVisible(shouldShowTime);   
            if (shouldShowTime)
            {
                timerLabel.txt = String.Format("{0} <color=#{1}><i>{2}</i></color>", Datas.getArString(timerLabelShowTimeKey),
                    timerColor, _Global.timeFormatStr(timeSurplus));                
            }
        }
  	}
   
    public function Update()
    {

    }
     
    private function OnChestInfoLoaded()
    {
        chestInfoReady = true;
        loadingLabel = null;
        if (isMonthlyCard&&subItems!=null) {
            chestDetailView.InitMonthCard(chestId,subItems);
        }else{
            chestDetailView.Init(chestId,subItems);
        }
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
        var userName : String = Datas.instance().getHashedNaid();
    	var payment : Payment.PaymentElement = Payment.singleton.GetOrderByGems(offerData.PricePoint);
    	if(payment != null)
    	{
    		var productId : String = payment.itunesProductId;
			GameMain.instance().buyAppOfferProduct(productId,payment.payoutId, offerData);
    	}
    	
//        if (shouldDirectBuy)
//        {
//            DirectBuy();
//        }
//        else
//        {
//            OpenPayment();
//        }
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
        	oldPrice.SetVisible(false);
        	oldPriceImage.SetVisible(false);
        	buyButton.txt = "";
        	buyButton.SetDisabled(true);
			buyButton.changeToGreyNew();
    	}
    	else
    	{
		  	var orignalPrice:String = Payment.instance().getOriginalPrice(price,offerData.WorthBonus);
        	oldPrice.SetVisible(true);
        	oldPrice.txt=orignalPrice;
        	oldPriceImage.SetVisible(true);
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