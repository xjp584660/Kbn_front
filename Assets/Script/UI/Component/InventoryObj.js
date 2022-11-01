class InventoryObj extends InventoryObjBase
{ 
	public var price:Label;	
	public var line:SimpleLabel;
	public var btnDetail:Button;
	public var btnPeekInside:Button;
	public var sale:Label;
	public var frame:Label;
	public var saleComponent:SaleComponent;
	public var blackFrame:Label;
	
	public var bNew:boolean;
	private var salePriceNum:int;
	private var m_data:Hashtable;
	private var oldSaleState:boolean;
	private var desFade:Fade;
	private var btnPeekFade:Fade;

	public function getbSale():boolean
	{
		return saleComponent.isCutSale && saleComponent.isShowSale;
	}
	
	public function Init()
	{
		super.Init();
		
		saleComponent.Init();

		useGroupDraw = false;
		icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		icon.useTile = true;
		
		btnPeekInside.txt = Datas.getArString("Common.LookInside");
		
		blackFrame.Init();
		blackFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("backFrame",TextureType.FTE);
		
		desFade	 = new Fade();
		desFade.init(description, EffectConstant.FadeType.FADE_IN);		
		btnPeekFade = new Fade();
		btnPeekFade.init(btnPeekInside, EffectConstant.FadeType.FADE_IN);

		combination.add(desFade);
		combination.add(btnPeekFade);
		
		btnPeekInside.Init();
		btnPeekInside.OnClick = handlePeek;		
		btnDetail.OnClick = handleDetail;
		
		if(lockHeightInAspect)
		{
			var mScaleX:float = GetScreenScale().x;
			if(mScaleX<1)
				reverseBg.scaleX = reverseBg.scaleX/mScaleX;
		}
	}
	private function handlePeek()
	{
		var id:HashObject = new HashObject({"ID":ID, "Category":m_data["Category"], "inShop":true});
		MenuMgr.getInstance().PushMenu("ChestDetail", id, "trans_zoomComp");		
	}
	
	private function handleDetail():void
	{		
		var tempMenu:InventoryMenu = MenuMgr.getInstance().getMenu("InventoryMenu") as InventoryMenu;		
		if(tempMenu.hasSelectedId(true, ID))
		{	
			combination.revertEffect();
			tempMenu.delSelectedId(true, ID);
		}
		else
		{
			combination.playEffect();
			tempMenu.addSelectedId(true, ID);
		}		
	}
	
	public function DrawItem()
	{
//		GUI.BeginGroup(rect);
//		var category : MyItems.Category = _Global.INT32(m_data["Category"]);
//		if(m_data && ( category == MyItems.Category.Chest || category == MyItems.Category.MystryChest))
//			btnDetail.Draw();
		title.Draw();	
		blackFrame.Draw();		
		saleComponent.Draw();		
		owned.Draw();
//		line.Draw();
		turnover.drawItems();
		nameFade.drawItems();
		desFade.drawItems();
		icon.Draw();
		sale.Draw();
		btnPeekFade.drawItems();
		frame.Draw();	
		prot_showFlashFrame();
		iconInforFade.drawItems();					
		btnDetail.Draw();
		btnSelect.Draw();
//		GUI.EndGroup();
//	   	return -1;
	}
	
	public function Update()
	{
		saleComponent.Update(); 
	
		combination.updateEffect();
 
 		if(oldSaleState != saleComponent.isCutSale)
 		{
 			oldSaleState = saleComponent.isCutSale;
 			
 			sale.SetVisible(saleComponent.isShowSale);
 			
			var tempType:MyItems.Category = m_data["Category"];
			
			if(tempType == MyItems.Category.MystryChest) 
			{
				tempType = 5;
			}	
			
			MenuMgr.getInstance().sendNotification("updateDiscountInfo",tempType -1); 			
 		}
		
	}
	
	public function InitContent()
	{

		icon.tips = Datas.getArString("itemDesc."+"i" + ID);
		
		/*
		if(m_data["Category"] && ( m_data["Category"] == 5 || m_data["Category"] == MyItems.Category.MystryChest))
		{
			btnDetail.SetVisible(true);
		}
		else
		{
			btnDetail.SetVisible(false);
		}*/

		var mysStartTime:long = m_data["startTime"];
		var mysEndTime:long = m_data["endTime"];
		var category : MyItems.Category = _Global.INT32(m_data["Category"]);
		if(category == MyItems.Category.MystryChest)
		{
			mysStartTime = m_data["salePrice"]== 0?0:m_data["discountStartTime"];
			mysEndTime = m_data["salePrice"]== 0?0:m_data["discountEndTime"];
		} 

		saleComponent.setData(m_data["price"], m_data["salePrice"], mysStartTime, mysEndTime, m_data["isShow"]); 
		oldSaleState =  saleComponent.isCutSale; 
		
		sale.SetVisible(saleComponent.isShowSale);

		//icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("i"+ ID, TextureType.ICON_ITEM);//Resources.Load("Textures/UI/icon/icon_item/i"+ ID);
		
		var texMgr : TextureMgr = TextureMgr.instance();
		icon.tile.name  = texMgr.LoadTileNameOfItem(ID);
		
		if(category != MyItems.Category.Chest && category != MyItems.Category.MystryChest)
		{
			btnPeekInside.SetVisible(false);
		}
		else
		{
			btnPeekInside.SetVisible(true);
		}
	}

	public function UpdateData()
	{
		var seed:HashObject = GameMain.instance().getSeed();			
		SetOwnedCnt( seed["items"]["i" + ID] ? _Global.INT32(seed["items"]["i" + ID]) :0);
	}
	
	private function buyInventory():void
	{
		var myItems : MyItems = MyItems.singleton;
		var price : int = 0;
		if(saleComponent.isCutSale)
		{
			price = _Global.INT32(m_data["salePrice"]);
		}
		else
		{
			price = _Global.INT32(m_data["price"]);
		}

		var mayDropGear : boolean = _Global.GetBoolean(m_data["tMayDropGear"]);
		if ( myItems.IsCanBatchBuy(ID) )
		{
			var menuMgr : MenuMgr = MenuMgr.getInstance();
			var useParam : BatchUseAndBuyDialog.BatchBuyAndUseParam = new BatchUseAndBuyDialog.BatchBuyAndUseParam();
			useParam.itemId = ID;
			useParam.isBuy = true;
			useParam.price = price;
			useParam.mayGropGear = mayDropGear;
			menuMgr.PushMenu("BatchUseAndBuyDialog", useParam, "trans_zoomComp");
			return;
		}
		
		//var param:Hashtable = {"iid":ID, "price":price};
		Shop.instance().BuyInventory(ID, price, 1, mayDropGear);
	}

	public function SetRowData(data:Object)
	{
		m_data = data;
		SetID(m_data["ID"]);
		
		var tempMenu:InventoryMenu = MenuMgr.getInstance().getMenu("InventoryMenu") as InventoryMenu;	
		if(tempMenu.hasSelectedId(true, ID))
		{	
			combination.resetEffectState(EffectConstant.EffectState.END_STATE);
		}
		else
		{
			combination.resetEffectState(EffectConstant.EffectState.START_STATE);
		}
		
		btnSelect.OnClick = buyInventory ;
		if ( !MyItems.instance().IsCanBatchBuy(this.ID) )
			btnSelect.txt = Datas.getArString("Common.Buy");
		else
			btnSelect.txt = Datas.getArString("BatchPurchase.Purchasebutton");
		
		if(m_data["price"] != null)
		{
			SetOwnedCnt(MyItems.instance().countForItem(ID));
		}
		else
		{
		 	SetOwnedCnt(m_data["Count"]);
		}		

		var texMgr : TextureMgr = TextureMgr.instance();
		var category : MyItems.Category = _Global.INT32(m_data["Category"]);
		if(category == MyItems.Category.MystryChest)
		{	
			description.txt = MystryChest.instance().GetChestDesc(ID);	
			frame.SetVisible(true);
			frame.mystyle.normal.background = texMgr.LoadTexture("chestFrame", TextureType.DECORATION);
		}
		else
		{
			frame.SetVisible(false);	
//			if(category != MyItems.Category.Chest )
//				description.txt = Datas.getArString("Common.LookInside");
//			else 
				description.txt = Datas.getArString("itemDesc."+"i" + ID);	
		}
		
		if(category == MyItems.Category.MystryChest)
			title.txt = MystryChest.instance().GetChestName(ID);
		else
			title.txt = Datas.getArString("itemName."+"i" + ID);		
		
		title.SetFont();
	}	
}

