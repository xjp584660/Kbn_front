
class InventoryObj2 extends InventoryObjBase
{
	public var salePrice:Label;	
	public var btnDetail:Button;
	public var frame:Label;
	public var btnPeekInside:Button;
	public var newItem:Label;
	public var blackFrame:Label;
		
	//public var bNew:boolean;
	public var countDown:Label;
	private var bSale:boolean;
	private var m_data:InventoryInfo;
	
	private var desFade:Fade;
	private var btnPeekFade:Fade;

	
	public function Init()
	{
		super.Init();
		
		icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		icon.useTile = true; 
		useGroupDraw = false;
		btnDetail.OnClick = handleDetail;
		btnPeekInside.OnClick = handlePeekInside;
		
		btnPeekInside.txt = Datas.getArString("Common.LookInside");
		
		blackFrame.Init();
		blackFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("backFrame",TextureType.FTE);
		
		desFade	 = new Fade();
		desFade.init(description, EffectConstant.FadeType.FADE_IN);		
		btnPeekFade = new Fade();
		btnPeekFade.init(btnPeekInside, EffectConstant.FadeType.FADE_IN);
				
		combination.add(desFade);
		combination.add(btnPeekFade);
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		
		countDown.SetFont(FontSize.Font_18,FontType.TREBUC);
		countDown.SetNormalTxtColor(FontColor.Red);
		if(lockHeightInAspect)
		{
			var mScaleX:float = GetScreenScale().x;
			if(mScaleX<1)
				reverseBg.scaleX = reverseBg.scaleX/mScaleX;
		}
	}
	
	public function DrawItem()
	{
//		GUI.BeginGroup(rect);
//		if(m_data && ( m_data.category == MyItems.Category.Chest || m_data.category == MyItems.Category.MystryChest || m_data.category == MyItems.Category.LevelChest))
//			btnDetail.Draw();	 	
		title.Draw();	
		blackFrame.Draw();					
		owned.Draw();
		turnover.drawItems();
		nameFade.drawItems();
		desFade.drawItems();
		icon.Draw();
		btnPeekFade.drawItems();
		frame.Draw();
		prot_showFlashFrame();
		iconInforFade.drawItems();
		btnDetail.Draw();
		btnSelect.Draw();	
		
		countDown.Draw();
		
		newItem.Draw();

//		GUI.EndGroup();
//	   	return -1;
	}
	
//	public function SetSalePrice(price:int)
//	{
//		salePriceNum = price;
//	}
//	
//	public function SetPrice(price:int)
//	{
//		this.price.txt = "" + price;
//	}

	public function Update()
	{
		priv_updateLessTime();
		combination.updateEffect();
	}
	
	public function InitContent()
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		icon.tile.name  = texMgr.LoadTileNameOfItem(ID);

	//	icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("i"+ ID, TextureType.ICON_ITEM);//Resources.Load("Textures/UI/icon/icon_item/i"+ ID);

		if(m_data.category == MyItems.Category.MystryChest)
		{
			//var imageName:String = MystryChest.instance().GetChestImage(ID);
			//if(icon.tile.spt.IsTileExist(imageName))
			//	icon.tile.name = imageName;	
			//else
			//	icon.tile.name = Constant.DefaultChestTileName;

			title.txt = MystryChest.instance().GetChestName(ID);

		}
		else if(m_data.category == MyItems.Category.LevelChest)
		{
			//var iName:String = MystryChest.instance().GetLevelChestImage(ID);
			//icon.tile.name = iName;
			
			title.txt = Datas.getArString("Common.LevelChestName", [MystryChest.instance().GetLevelOfChest(ID)]);//MystryChest.instance().GetLevelChestName(ID);
		}
		else
		{
			//if(m_data.category == MyItems.Category.Chest)
			//{
			//	if(icon.tile.spt.IsTileExist("i"+ID))
			//		icon.tile.name = "i"+ ID;	
			//	else
			//		icon.tile.name = Constant.DefaultChestTileName;		
			//}
			//else
			//{
			//	if( Datas.instance().getImageName(ID) == "" )
			//		icon.TileName = "i"+ ID;
			//	else
			//		icon.TileName =	Datas.instance().getImageName(ID);
			//}	
			title.txt = Datas.getArString("itemName."+"i" + ID);
		} 
	}
	
	private function handleDetail():void
	{
		var tempMenu:InventoryMenu = MenuMgr.getInstance().getMenu("InventoryMenu") as InventoryMenu;		
		if(tempMenu.hasSelectedId(false, ID))
		{	
			combination.revertEffect();
			tempMenu.delSelectedId(false, ID);
		}
		else
		{
			combination.playEffect();
			tempMenu.addSelectedId(false, ID);
		}
	}
	
	private function handlePeekInside():void
	{
		var id:HashObject = new HashObject({"ID":ID, "Category":m_data.category, "inShop":false});
		MenuMgr.getInstance().PushMenu("ChestDetail", id, "trans_zoomComp");		
		priv_updateLessTime();
	}
	
	private function priv_updateLessTime()
	{
		var myItems : MyItems = MyItems.instance();
		var lessTime : int = myItems.GetItemTimeLeft(ID);
		if ( lessTime < 0 )
		{
			countDown.SetVisible(false);
		}
		else
		{
			countDown.SetVisible(true);
			countDown.txt = _Global.timeFormatShortStr(lessTime, true);
			if ( countDown.txt == "" )
				countDown.txt = "0s";
		}
	}

	public function UpdateData()
	{
		if(!m_data)
			return;
		var seed:Object = GameMain.instance().getSeed();
		SetOwnedCnt(m_data.quant);
		newItem.SetVisible(m_data.isNewGet);
	}
	
//	public function GetID():int
//	{
//		return ID;
//	}

	public function isUseOutListItem():boolean
	{
		if(m_data != null && m_data.quant == 0)
		{
			return true;
		}
		
		return false;
	}
	
	public function SetRowData(data:Object)
	{
		
		m_data = data as InventoryInfo;
		if(m_data.id==4166){
			Debug.Log(m_data.id);
		}
		SetID(m_data.id);
		SetOwnedCnt(m_data.quant);
		var bCanSell:boolean = KBN.SellItemMgr.instance().CanSell(m_data.id);
		var tempMenu:InventoryMenu = MenuMgr.getInstance().getMenu("InventoryMenu") as InventoryMenu;	
		if(tempMenu != null)
		{
			if(tempMenu.hasSelectedId(false, ID))
			{	
				combination.resetEffectState(EffectConstant.EffectState.END_STATE);
			}
			else
			{
				combination.resetEffectState(EffectConstant.EffectState.START_STATE);
			}
		}	

		btnSelect.OnClick = function(param:Object)
		{
			var itemId:int = _Global.INT32((param as Hashtable)["iid"]);
			var itemMgr : MyItems = MyItems.instance();
           // _Global.LogWarning("itemID"+itemId);
			if(CheckMystryChest(itemId))
			{
				MenuMgr.getInstance().PushMenu("ChestSellAndUseDialog", itemId, "trans_zoomComp");
			}
			else
			{
			
				if(m_data.useInList&&itemMgr.IsCanBatchUse(itemId)){
					//_Global.LogWarning("IsCanBatchUse"+this.ID);
					var menuMgr : MenuMgr = MenuMgr.getInstance();
					var useParam : BatchUseAndBuyDialog.BatchBuyAndUseParam = new BatchUseAndBuyDialog.BatchBuyAndUseParam();
					useParam.itemId = itemId;
					useParam.isBuy = false;
					menuMgr.PushMenu("BatchUseAndBuyDialog", useParam, "trans_zoomComp");
					//return ;
				}
				else if (m_data.useInList)
				{
					//_Global.LogWarning("useInList"+this.ID);
					itemMgr.Use(itemId);
					//return;
				}
				else if(m_data.mayDropGear)
				{
					//_Global.LogWarning("mayDropGear"+this.ID);
					itemMgr.Use(itemId);
					//return;
				}
				else if ( bCanSell )
				{
					//_Global.LogWarning("bCanSell"+this.ID);
					MenuMgr.getInstance().PushMenu("SellItemPopupMenu", itemId, "trans_zoomComp");
					//return;
				}
	

			}
			
			
		};	
		if(CheckMystryChest(ID))
        {
			btnSelect.txt = "···";
		}
		else if(m_data.useInList)
		{
			//_Global.LogWarning("useInList"+this.ID);
			btnSelect.txt = Datas.getArString("Common.Use_button");
		}
		else if(m_data.useInList&&MyItems.instance().IsCanBatchUse(this.ID))
		{
			if(m_data.mayDropGear){
				//_Global.LogWarning("IsCanBatchUse.mayDropGear"+this.ID);
				btnSelect.txt = Datas.getArString("Common.Use_button");
			}
			else{
				//_Global.LogWarning("IsCanBatchUse.NotmayDropGear"+this.ID);
				btnSelect.txt = Datas.getArString("BatchPurchase.Usebutton");		
			}
		}	
		else if(bCanSell)
		{
			//_Global.LogWarning("bCanSell.NotmayDropGear"+this.ID);
			btnSelect.txt = Datas.getArString("Common.Sell");
		}	
		else 
		{
			btnSelect.txt = Datas.getArString("Common.Use_button");
		}
			
		
		bSale = false;
		if(!m_data.useInList && !bCanSell)
		{
			btnSelect.SetVisible(false);
		}
		else
			btnSelect.SetVisible(true);
	
		btnSelect.clickParam = {"iid":ID, "itemPtr":this};

		btnPeekInside.SetVisible(true);
		
		var texMgr : TextureMgr = TextureMgr.instance();
		if(m_data.category == MyItems.Category.MystryChest)
		{	
			description.txt = MystryChest.instance().GetChestDesc(ID);	
			frame.SetVisible(true);
			frame.mystyle.normal.background = texMgr.LoadTexture("chestFrame", TextureType.DECORATION);
		}
		else if(m_data.category == MyItems.Category.LevelChest)
		{
			description.txt = Datas.getArString("Common.LevelChestDesc", [MystryChest.instance().GetLevelOfChest(ID)]);//MystryChest.instance().GetLevelChestDes(ID);	
			frame.SetVisible(true);				
			frame.mystyle.normal.background = texMgr.LoadTexture("chestFrame", TextureType.DECORATION);
		}
		else 
		{
		    if(m_data.category == MyItems.Category.Chest )
		    {
			 	description.txt = Datas.getArString("Common.LookInside");
			}
			else
			{
				description.txt = m_data.description;
				btnPeekInside.SetVisible(false);
			}	
			
			frame.SetVisible(false);	
		}
		//set new item state
			newItem.SetVisible(m_data.isNewGet);
		

//		btnDetail.OnClick = function(param:Object){
//			var id:HashObject = new HashObject({"ID":ID, "Category":m_data.category, "inShop":false});
//			MenuMgr.getInstance().PushMenu("ChestDetail", id, "trans_pop");
//		};

		priv_updateLessTime();

	}


	private function CheckMystryChest(id:int):boolean //判断是否是装备宝箱
	{
		return KBN.SellItemMgr.instance().CheckIsGearDrop(id);
	}
}

