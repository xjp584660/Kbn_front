class BoostItem extends ListItem
{
	private var itemId:int;
	private var recType:int;
	
	private var item:Hashtable;
	
	//public var btnBuyUse:Button;
	//public var money:SimpleLabel;
	public var line:SimpleLabel;
	//public var price:Label;	 
	//public var salePrice:Label;
	//public var deleteLine:Label;
	public var sale:Label; // this is sale icon
	public var owned:Label;
	
	public var saleComponent:SaleComponent;
	
	//private var bSale:boolean;
	private var ownedNum:int;
	//private var isUse:boolean;
	
	function Init()
	{
		btnSelect.OnClick = handleClick;
		line.setBackground("between line_list_small",TextureType.DECORATION);
		
		saleComponent.Init();
	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		line.Draw();
		icon.Draw();
		title.Draw();
		description.Draw();
		owned.Draw();
		saleComponent.Draw();
		btnSelect.Draw();
		sale.Draw();
		/*
		if(isUse)
		{
			btnSelect.Draw();
		}
		else
		{
			btnBuyUse.Draw();
			price.Draw();
			if(bSale)
			{
				sale.Draw();
				salePrice.Draw();
				deleteLine.Draw();
			}	
		}*/
		GUI.EndGroup();
	}
	
	function Update()
	{
		saleComponent.Update();
	}
	
	private function setButtonState(ownedNum:int):void
	{
		if(ownedNum > 0)
		{
			//isUse = true;
			saleComponent.SetVisible(false);
			sale.SetVisible(false);
			
			btnSelect.txt = Datas.getArString("Common.Use_button");
			btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
			btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
			owned.txt = Datas.getArString("Common.Owned") + ": " + ownedNum;
		}
		else
		{
			saleComponent.SetVisible(true);
			sale.SetVisible(true);
			//isUse = false;
			btnSelect.txt = Datas.getArString("Common.BuyAndUse_button");
			btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
			btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_downnew",TextureType.BUTTON);
			owned.txt = Datas.getArString("Common.Owned") + ": 0";
		}	
	}
	
	function SetRowData(data:Object)
	{
		itemId = (data as Hashtable)["ID"];
		recType = (data as Hashtable)["recType"];
		item = (data as Hashtable)["item"] as Hashtable;
		
		icon.useTile = true;
		icon.tile = TextureMgr.instance().ElseIconSpt().GetTile("i"+ itemId);
		//icon.tile.name = "i"+ itemId;
		//icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("i"+ itemId, TextureType.ICON_ITEM);//Resources.Load("Textures/UI/icon/icon_item/i"+ itemId);
		
		ownedNum = (data as Hashtable)["count"];//MyItems.instance().countForItem(itemId);
		
		saleComponent.setData(item["price"], item["salePrice"], _Global.INT64(item["startTime"]), _Global.INT64(item["endTime"]), item["isShow"]);

		sale.SetVisible(saleComponent.isShowSale);

		setButtonState(ownedNum);
		
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt = Datas.getArString("itemName.i" + itemId);
		description.txt = Datas.getArString("itemDesc.i"+itemId) ;

//		btnBuyUse.txt = Datas.getArString("Common.BuyAndUse_button");
//		btnSelect.txt = Datas.getArString("Common.Use_button");
//		var originPrice:int = Shop.instance().getPriceOfItem(Shop.PRODUCT, itemId, true);
//		var newPrice:int = Shop.instance().getPriceOfItem(Shop.PRODUCT, itemId, false);
//		money.txt = "" + originPrice;

		/*

		price.txt = "" + originPrice;
		salePrice.txt = "" + newPrice;		
		if(originPrice != newPrice)
		{
				bSale = true;
				price.mystyle.padding.left = Constant.SalePrice.Text_OffsetX1;
				salePrice.rect.x = price.rect.x + Constant.SalePrice.Text_OffsetX2;
				
				deleteLine.rect.x = price.rect.x + Constant.SalePrice.DeLine_OffsetX;
				deleteLine.rect.height = Constant.SalePrice.DeLine_Height;
				deleteLine.rect.y = price.rect.y +  Constant.SalePrice.DeLine_OffsetY;
				
				price.mystyle.normal.textColor = Color(196.0/255, 196.0/255,196.0/255 , 1.0);
				price.font = FontSize.Font_Small;
				if(originPrice < 10)
					deleteLine.rect.width = Constant.SalePrice.DeLine_Wid1;
				else if(originPrice < 100)
					deleteLine.rect.width = Constant.SalePrice.DeLine_Wid2;	
				else
					deleteLine.rect.width = Constant.SalePrice.DeLine_Wid3;	
		}	
		else
		{
				bSale = false;
				price.mystyle.normal.textColor = Color(1.0, 1.0,1.0 , 1.0);
				price.font = FontSize.Font_Middl;
		}	
		
		btnBuyUse.OnClick =  function(param:Object)
		{
			var buySucess:System.Action = function()
			{
				ownedNum += 1;
				isUse = true;
				owned.txt = Datas.getArString("Common.Owned") + ": " + ownedNum;
				MyItems.instance().Use(itemId);
			};
			Shop.instance().swiftBuy(itemId, buySucess);
		};

		btnSelect.OnClick =  function(param:Object)
		{
			MyItems.instance().Use(itemId);	
		};
		*/
	}
	
	private function handleClick():void
	{
		if(ownedNum > 0)
		{
			MyItems.instance().Use(itemId);	
		}
		else
		{
			var buySucess:System.Action = function()
			{
				ownedNum += 1;
				//isUse = true;
				setButtonState(ownedNum);
				owned.txt = Datas.getArString("Common.Owned") + ": " + ownedNum;
				MyItems.instance().Use(itemId);
			};		
		
			Shop.instance().swiftBuy(itemId, buySucess);
		}
	}
}
