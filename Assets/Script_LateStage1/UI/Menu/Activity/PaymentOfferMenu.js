#pragma strict

import System;

public class PaymentOfferMenu extends PopMenu
{
    @SerializeField
    private var frameOffset : RectOffset;

    @SerializeField
    private var titleLabelBg : SimpleLabel;

    @SerializeField
    private var titleLabel : SimpleLabel;
    
    @SerializeField
    private var timerLabel : SimpleLabel;
    
    @SerializeField
    private var timerColor : String;
    
    @SerializeField
    private var timerLabelShowTimeKey : String;
    
    @SerializeField
    private var timerLabelLimitedTimeKey : String;
    
    @SerializeField
    private var timerHighlightImage : SimpleLabel;
    
    @SerializeField
    private var topBgImage : SimpleLabel;
    
    // Region: offer description
    @SerializeField
    private var descLabel : SimpleLabel;
    
    @SerializeField
    private var descLabelRectNotLessThan : Rect;
    
    @SerializeField
    private var descKeyNotLessThan : String = "With a single purchase no less than <i><color=#f9ed91>{0} gems</color></i> to win the free chest!";
    
    @SerializeField
    private var descLabelRectEqual : Rect;
    
    @SerializeField
    private var descKeyEqual : String = "with a free chest below!";

    @SerializeField
    private var queen : SimpleLabel;
    
    @SerializeField
    private var banner : SimpleLabel;
    
    @SerializeField
    private var hugeGemsBg : SimpleLabel;
    
    @SerializeField
    private var hugeGems : SimpleLabel;

    @SerializeField
    private var gemsCountImage : SimpleLabel;
    
    @SerializeField
    private var gemsPlusImage : SimpleLabel;
    
    @SerializeField
    private var gemsTextImage : SimpleLabel;
    
    @SerializeField
    private var gemsCountImageMarginLeft : int = 5;
    // End region: offer description
    
    // Region: offer value
    
    @SerializeField
    private var valueRotate : float;
    
    @SerializeField
    private var valueBgLabel : SimpleLabel;
    
    @SerializeField
    private var valueMainLabel : SimpleLabel;
    
    @SerializeField
    private var valueSecondLabel : SimpleLabel;
    
    @SerializeField
    private var valueGemsLabel : SimpleLabel;
    
    @SerializeField
    private var valueGemsKey : String = "paymentLabel.beginnerOfferSummary_2";
    // End region: offer value
    
    // Region: chest detail
//    @SerializeField
//    private var freeIcon : SimpleLabel;
    
    @SerializeField
    private var chestDetailOutline : SimpleLabel;
    
    @SerializeField
    private var chestDetailTitle : SimpleLabel;
    
    @SerializeField
    private var chestDetailMargin : RectOffset;
    
    @SerializeField
    private var chestDetailView : PaymentOfferChestDetailView;
    // End region: chest detail
    
    @SerializeField
    private var buyButton : Button;
    
    private var chestId : int = -1;
    
    private var pricePointType : int = -1;
    
    private var pricePoint : int = 0;
    
    private var chestValue : int = 0;
    
    private var chestValuePercentage : int = 0;
    
    private var chestInfoReady : boolean = false;
    
    private var shouldDirectBuy : boolean = false;
    
    private var loadingLabel : LoadingLabelImpl;
    
    private var curType : int;
    
    public function Init()
    {
        loadingLabel = null;
        chestInfoReady = false;
        SetChestDetailVisible(false);
    
    	titleLabelBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("hiddenbossname",TextureType.DECORATION);
        titleLabel.mystyle.normal.background = TextureMgr.instance().LoadTexture("title_colour",TextureType.DECORATION);
        titleLabel.txt = Datas.getArString("paymentLabel.beginnerOfferTtile");
        
//        topBgImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("Blue_Gradient", TextureType.DECORATION);
		topBgImage.useTile = true;
		topBgImage.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_assign_bg");
        timerHighlightImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("timeleft_ditu", TextureType.DECORATION);

		queen.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_Morgause", TextureType.FTE); //280, 370
        banner.mystyle.normal.background = TextureMgr.instance().LoadTexture("chat_announcement_light", TextureType.DECORATION);
        hugeGemsBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("payment_light", TextureType.DECORATION);
        hugeGems.mystyle.normal.background = TextureMgr.instance().LoadTexture("gems", TextureType.DECORATION);

//        freeIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile("free");
		gemsPlusImage.useTile = true;
		gemsPlusImage.tile = TextureMgr.instance().ElseIconSpt().GetTile("plus");
		gemsTextImage.useTile = true;
        gemsTextImage.tile = TextureMgr.instance().ElseIconSpt().GetTile("gems");
        chestDetailOutline.mystyle.normal.background = TextureMgr.instance().LoadTexture("Quest_kuang2", TextureType.DECORATION);
        
        chestDetailTitle.mystyle.normal.background = TextureMgr.instance().LoadTexture("Event_mytiao", TextureType.DECORATION);
        chestDetailTitle.txt = Datas.getArString("PaymentOffer.FreeGift_Title");
        
        chestDetailView.rect = new Rect(chestDetailOutline.rect.x + chestDetailMargin.left, chestDetailOutline.rect.y + chestDetailMargin.top,
            chestDetailOutline.rect.width - chestDetailMargin.horizontal, chestDetailOutline.rect.height - chestDetailMargin.vertical);
        
        valueBgLabel.tile = TextureMgr.instance().BackgroundSpt().GetTile("Recommended_box");
        valueMainLabel.rect = valueSecondLabel.rect = valueBgLabel.rect;
        valueGemsLabel.mystyle.normal.background = TextureMgr.instance().LoadTexture("resource_icon_gems", TextureType.ICON);

        buyButton.changeToBlueNew();
        
        buyButton.txt = Datas.getArString("PaymentOffer.Button_Buy");
        
        buyButton.OnClick = OnClickBuyButton;

        super.Init();
    }

    public function OnPush(param : System.Object)
    {
        var data : PaymentOfferData = null;
        if ((param as PaymentOfferData) != null)
        {
            data = param as PaymentOfferData;
            curType = Payment.instance().currentNoticeType;
        }
        else // param is a Hashtable
        {
            var paramDict : Hashtable = param as Hashtable;
            data = paramDict["data"];
            curType = paramDict["curType"];
            if (_Global.GetBoolean(paramDict["fromPayment"]) == true && btnClose != null)
            {
                btnClose.OnClick = function(param : System.Object) {
                    OpenPayment();
                };
            }
        }

        chestId = data.RewardChestId;
        pricePoint = data.PricePoint;
        pricePointType = data.PricePointType;
        chestValue = data.RewardChestValue;
        chestValuePercentage = data.RewardChestValuePercentage;
        shouldDirectBuy = data.IsBuyDirect;

        titleLabel.txt = data.Name;
        
        var greaterThanOrEqualMode : boolean = (pricePointType == Constant.PaymentOffer.PricePointType.GreaterOrEqual);
        var gemsCountTile : Tile = null;
        
        gemsCountImage.SetVisible(true);
        gemsTextImage.SetVisible(true);
        gemsPlusImage.SetVisible(greaterThanOrEqualMode);
        
        if (greaterThanOrEqualMode)
        {
            descLabel.rect = descLabelRectNotLessThan;
            if (pricePoint <= 0)
            {
                descLabel.txt = Datas.getArString("PaymentOffer.BeginnerDesc");
            }
            else
            {
                descLabel.txt = String.Format(Datas.getArString(descKeyNotLessThan), pricePoint);
            }
            
            valueMainLabel.txt = Datas.getArString("PaymentOffer.Worth");
            valueSecondLabel.txt = chestValue.ToString();
            
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
            
            queen.mystyle.normal.background = TextureMgr.instance().LoadTexture("npc_wheelgame", TextureType.DECORATION);
            queen.rect.x = -4;
            queen.rect.width = 216;
        }
        else
        {
            descLabel.rect = descLabelRectEqual;
            descLabel.txt = Datas.getArString(descKeyEqual);
            
            valueMainLabel.txt = String.Format(Datas.getArString("PaymentOffer.Percent"), chestValuePercentage);
            valueSecondLabel.txt = Datas.getArString("PaymentOffer.Value2");
            
            gemsCountTile = TextureMgr.instance().ItemSpt().GetTile(String.Format("{0}g", pricePoint));
            gemsCountImage.tile = gemsCountTile;
            gemsCountImage.rect.width = gemsCountImage.rect.height * gemsCountTile.rect.width / gemsCountTile.rect.height;
            gemsTextImage.rect.x = gemsCountImage.rect.xMax + gemsCountImageMarginLeft;
            
            
			queen.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_Morgause", TextureType.FTE);
			queen.rect.x = -10;
			queen.rect.width = 290;
            
            if (shouldDirectBuy)
            {
                SetBuyButtonTextWithPrice();
            }
        }
        
        valueSecondLabel.SetVisible(true);
        valueGemsLabel.SetVisible(true);

        var valueSize : Vector2 = valueSecondLabel.mystyle.CalcSize(new GUIContent(valueSecondLabel.txt));
        valueGemsLabel.rect.x = valueSecondLabel.rect.xMax - (valueSecondLabel.rect.width - valueSize.x - 32) * 0.5f - 32 + 2;

        if (MystryChest.IsMystryChest_Temp(chestId))
        {
            if (MystryChest.instance().IsLoadFinish)
            {
                OnChestInfoLoaded();
            }
        }
        else
        {
            OnChestInfoLoaded();
        }
        super.OnPush(param);
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
        ResetLayoutWithRectOffset(frameOffset);
    }
    
    protected function DrawLastItem()
    {
    	if (Event.current.type == EventType.Repaint)
        {
	    	titleLabelBg.Draw();
	        titleLabel.Draw();
	        
	        queen.Draw();
            banner.Draw();
            hugeGemsBg.Draw();
            hugeGems.Draw();
            gemsCountImage.Draw();
            gemsPlusImage.Draw();
            gemsTextImage.Draw();
	        
	        var old_matrix = GUI.matrix;
	        _Global.MultiplyRotateScaleMatrix(valueBgLabel.rect, valueRotate, Vector3.one);
	        
            valueBgLabel.Draw();
            valueMainLabel.Draw();
            valueSecondLabel.Draw();
            valueGemsLabel.Draw();
            
            GUI.matrix = old_matrix;
        }
    }
    
    public function DrawItem()
    {
        if (Event.current.type == EventType.Repaint)
        {
            topBgImage.Draw();
            timerHighlightImage.Draw();
            timerLabel.Draw();
            descLabel.Draw();
            
            chestDetailOutline.Draw();
            chestDetailView.Draw();
            chestDetailTitle.Draw();

//            freeIcon.Draw();
            buyButton.Draw();
            
            if (loadingLabel != null)
            {
                loadingLabel.Draw();
            }
        }
        else if (loadingLabel == null)
        {
            buyButton.Draw();
        }
    }
    
    public function Update()
    {
        if (loadingLabel != null)
        {
            loadingLabel.Update();
        }
        chestDetailView.Update();
    /*offerChange
        var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetDataByCategory(curType);
        if(offerData != null)
        {
            var timeEnd : long = offerData.EndTime;
            var timeSurplus : long = timeEnd - GameMain.unixtime();
            var shouldShowTime : boolean = (timeEnd - GameMain.unixtime()) < 86400 * 3;
            
            if (shouldShowTime)
            {
                timerLabel.txt = String.Format("{0} <color=#{1}><i>{2}</i></color>", Datas.getArString(timerLabelShowTimeKey),
                    timerColor, _Global.timeFormatStr(timeSurplus));
            }
            else
            {
                timerLabel.txt = Datas.getArString(timerLabelLimitedTimeKey);
            }
        }
        else
        {
            MenuMgr.getInstance().PopMenu("");
        }*/
    }
    
    private function OnChestInfoLoaded()
    {
        chestInfoReady = true;
        loadingLabel = null;
        //chestDetailView.Init(chestId);
        SetChestDetailVisible(true);
    }
    
    private function SetChestDetailVisible(visible : boolean)
    {
        chestDetailView.SetVisible(visible);
//        freeIcon.SetVisible(visible);
    }
    
    private function OnClickBuyButton(param : System.Object)
    {
        if (shouldDirectBuy)
        {
            DirectBuy();
        }
        else
        {
            OpenPayment();
        }
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
    
    private function SetBuyButtonTextWithPrice()
    {
        var paymentItems : Array = Payment.instance().getPaymentItems();
        if(paymentItems.length <= 0)
        {
            Payment.instance().reqPaymentList(DoSetBuyButtonTextWithPrice, null, true, true);
        }
        else
        {
            DoSetBuyButtonTextWithPrice();
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
            buyButton.changeToGreenNew();
            buyButton.txt = payElem.price;
        }
    }
}
