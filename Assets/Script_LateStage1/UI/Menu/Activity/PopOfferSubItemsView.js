#pragma strict

import System;

public class PopOfferSubItemsView extends PopMenu
{
    @SerializeField
    private var subItemsScrollList : ScrollList;
    
    @SerializeField
    private var subItemTemplate : NewSubItem;
    
//    @SerializeField
//    private var oldPrice : Label;
//    
//    @SerializeField
//    private var oldPriceImage : Label;
    
    @SerializeField
    private var buyButton : Button;

    @SerializeField
    private var closeButton : Button;
    
    public var chestName : Label;
	public var chestDesc : Label;
	public var chestBack : Label;
	public var chestIcon : Label;
	public var chestSummary : ComposedUIObj;
	public var descMyst : Label;
    
    private var data : ChestDetailDisplayData = null;
    private var offerData : PaymentOfferData;
    
    private var specialChestId : int = 10005;
    
    public function Init()
    {
    	super.Init();
    	
		title.Init();
		
		closeButton.Init();
		closeButton.OnClick = handleBack;
		
		buyButton.changeToBlueNew();
        buyButton.OnClick = OnClickBuyButton;  
        
        chestSummary.component = [chestBack, chestName, chestIcon, chestDesc]; 
        chestIcon.useTile = true;
		chestIcon.tile =  TextureMgr.instance().ItemSpt().GetTile(null);     
    }
    
    private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("PopOfferSubItemsView");
	}

    public function OnPush(param : System.Object)
    {
  		offerData = param as PaymentOfferData;
  		  
        var texMgr : TextureMgr = TextureMgr.instance();
		var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		repeatTimes = (rect.height - 15)/bgMiddleBodyPic.rect.height +1;
		
		SetBuyButtonTextWithPrice();
		//buyButton.mystyle.contentOffset.x=60;    
		
		var chestId : int = offerData.RewardChestId;
		if(chestId != 0)
		{			
			if(offerData.IsMonthlyCard)
			{						
				InitNormalChest(offerData.subItems);
				if(this.offerData.day != 0)
				{
					buyButton.SetDisabled(true);
					buyButton.changeToGreyNew();
				}
			}
			else
			{
			    if(chestId == specialChestId)
			    {
			    	ClearData();
		        	var cheho = new HashObject({
			            "ID": chestId
			            , "Category": MyItems.GetItemCategoryByItemId(chestId)
			        });
			        
			        var data : ChestDetailDisplayData = null;
        			data = ChestDetailDisplayData.CreateWithHashObject(cheho);
			        
			        subItemsScrollList.Init(subItemTemplate);
			        var items : InventoryInfo[] = data.Items;
			        if (items.Length > 0)
			        {
			            subItemsScrollList.SetData(items);
			            subItemsScrollList.ResetPos();
			        }
			    }
			    else
			    {
					var ho = new HashObject({
		            "ID": chestId
		            , "Category": MyItems.GetItemCategoryByItemId(chestId)
		        	});
					var displayData : ChestDetailDisplayData = ChestDetailDisplayData.CreateWithHashObject(ho);
					chestIcon.tile = TextureMgr.instance().LoadTileOfItem(chestId);
					chestName.txt = displayData.Name;
					chestDesc.txt = displayData.Desc;
					descMyst.txt = displayData.DescMyst;
				}
			}	
		}
		else
		{
			InitNormalChest(offerData.subItems); 
		}       
    }
    
  	private function InitNormalChest(intsubItems : HashObject)
    {        
       	ClearData();
       	
        var items : InventoryInfo[] = ChestDetailDisplayData.GetOfferItems(intsubItems);
        if (items.Length > 0)
        {        
        	subItemsScrollList.Init(subItemTemplate);
            subItemsScrollList.SetData(items);
            subItemsScrollList.ResetPos();
        }    	
    }
    
    public function ClearData()
    {
        if (subItemsScrollList != null)
        {
            subItemsScrollList.Clear();
            subItemsScrollList.ClearData();
        }
    }
    
    public function OnPushOver()
    {

    }
    
    public function OnPop()
    {
		subItemsScrollList.Clear();
		chestSummary.clearUIObject();
    }
    
    public function OnPopOver()
    {

    }
    
    public function DrawItem()
    {
		if(offerData.RewardChestId != 0)
		{
			if(offerData.IsMonthlyCard || offerData.RewardChestId == specialChestId)
			{
				subItemsScrollList.Draw();  
			}
			else
			{
				chestSummary.Draw();
		        descMyst.Draw(); 
	        }
        }
        else
        {
        	subItemsScrollList.Draw();  
        }    
        buyButton.Draw();
                       
    }
    
    public function DrawLastItem()
    {
        closeButton.Draw();
    }
    
    public function Update()
    {
   		if (!visible)
        {
            return;
        }

        if (subItemsScrollList.isVisible)
        {
            subItemsScrollList.Update();
        }
    }
    
    
    private function OnClickBuyButton(param : System.Object)
    {
    	var payment : Payment.PaymentElement = Payment.singleton.GetOrderByGems(offerData.PricePoint);
    	if(payment != null)
    	{
    		var productId : String = payment.itunesProductId;
			GameMain.instance().buyAppOfferProduct(productId,payment.payoutId, offerData);
    	}
    }
    
  	private function SetBuyButtonTextWithPrice()
    {
        var price:String=Payment.instance().getPriceByGems(offerData.PricePoint);
        if(price == null || price.length==0 || offerData == null) 
        {
        	Payment.instance().reqPaymentData();
//        	oldPrice.SetVisible(false);
//        	oldPriceImage.SetVisible(false);
        	buyButton.txt = "";
        	buyButton.SetDisabled(true);
			buyButton.changeToGreyNew();
    	}
    	else
    	{
		  	var orignalPrice:String = Payment.instance().getOriginalPrice(price,offerData.WorthBonus);
//        	oldPrice.SetVisible(true);
//        	oldPrice.txt=orignalPrice;
//        	oldPriceImage.SetVisible(true);
        	buyButton.txt =price;
        	buyButton.SetDisabled(false);
			buyButton.changeToBlueNew();
    	}
    }
}
