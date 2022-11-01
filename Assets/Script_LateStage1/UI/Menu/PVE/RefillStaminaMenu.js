class RefillStaminaMenu extends PopMenu
{
	@SerializeField private var line:Label;
	@SerializeField private var topDesc:Label;
	@SerializeField private var bottomDesc:Label;
	@SerializeField private var bottomDescTitle:Label;
	@SerializeField private var bottleIcon:Label;
	@SerializeField private var bottleNum:Label;
	@SerializeField private var sandglass:Label;
	@SerializeField private var timeDesc:Label;
	@SerializeField private var buyBtn:Button;
	
	@SerializeField private var vipIcon:SimpleLabel;
	@SerializeField private var vipTips:SimpleLabel;
	
	@SerializeField private var darkBack:SimpleLabel;
	@SerializeField private var staminaNum:Label;
	@SerializeField private var gemIcon:Label;
	@SerializeField private var itemIcon:Label;
	@SerializeField private var noBuyDesc:Label;
	@SerializeField private var rectBtn1:Rect;
	@SerializeField private var rectBtn2:Rect;
	
//	private var refillStaminaItemID:int = 950;
	private var maxStamina:int = 10;
	private var recoverTime:int = 120;//recover time
	private var totalData:KBN.PveTotalData;
	
	private var isNew : boolean;
	
	public function Init():void
	{
		super.Init();
		
		line.Init();
		topDesc.Init();
		bottomDesc.Init();
		bottleIcon.Init();
		bottleNum.Init();
		sandglass.Init();
		timeDesc.Init();
		buyBtn.Init();
		btnClose.OnClick = handleBack;
		buyBtn.OnClick = handleBuyAndUse;
		
		line.setBackground("between line",TextureType.DECORATION);
		sandglass.setBackground("icon_time",TextureType.ICON);		
		
		vipIcon.setBackground("VIP",TextureType.DECORATION);
		vipTips.txt = Datas.getArString("VIP.Stamina_Tip");
		
		buyBtn.setNorAndActBG("button_60_green_normalnew","button_60_green_downnew");
		
		title.txt = Datas.getArString("Campaign.Stamina_Title");//"Refill stamina";
		topDesc.txt = Datas.getArString("Campaign.Stamina_Text1");//"Each battle inCampin will cost stamina will auto restore in.";
		bottomDesc.txt = Datas.getArString("Campaign.Stamina_Text2");//"Stamina position complete restore your stamina.";
		
		
		darkBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2",TextureType.DECORATION);
		gemIcon.setBackground("Diamond",TextureType.DECORATION);
		if(Application.platform == RuntimePlatform.Android)
		{
			gemIcon.SetNormalTxtColor(FontColor.New_Describe_Grey_1);
		}
		else
		{
			gemIcon.SetNormalTxtColor(FontColor.New_Level_Yellow);
		}
		
		
		itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		itemIcon.useTile = true;
		//itemIcon.setBackground("icon_stamina",TextureType.DECORATION);
//		noBuyDesc.txt = Datas.getArString("You can only buy 10 Stamina Potion in one day.");
	}
	
	public function DrawItem()
	{
		line.Draw();
		topDesc.Draw();
		bottleIcon.Draw();
				
		var samian : int = KBN.PveController.instance().GetSimina();
		if(samian < maxStamina)
		{
	//		var iTime:int = (maxStamina - totalData.samina)*recoverTime-(GameMain.unixtime () - totalData.saminaTime);
			var refreshTime : long = KBN.PveController.instance().GetRefreshTime();
			var iTime:long = recoverTime - GameMain.unixtime () + refreshTime;
			if(iTime<0)iTime = 0;
			timeDesc.txt = _Global.timeFormatStrPlus(iTime);

			sandglass.Draw();
			timeDesc.Draw();
		}
		
		vipIcon.Draw();
		vipTips.Draw();
		
		darkBack.Draw();
		buyBtn.Draw();
		staminaNum.Draw();
		gemIcon.Draw();
		bottomDesc.Draw();
		bottomDescTitle.Draw();
		itemIcon.Draw();
		bottleNum.Draw();
//		noBuyDesc.Draw();
	}
	
	function Update() 
	{
	}
	
	public function OnPush(param:Object)
	{
		UpdateMenu();
	}
	
	public function OnPop()
	{
		super.OnPop();
	}
	
	public function OnPopOver()
    {
        super.OnPopOver();
        
        itemIcon.tile.name = null;
		itemIcon.tile = null;
    }
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("RefillStaminaMenu");
		
//		var hash:HashObject = new HashObject({
//                "type":BossMenu.Menu_Type.MENU_TYPE_BOSS_INFO
//            });
//		MenuMgr.getInstance().PushMenu("BossMenu", hash, "trans_zoomComp");
	}
	
	function getTestDate():Hashtable
	{
		var testDate:Hashtable  = {
			"bottleNum":99,
			"hour":167,
			"minute":23,
			"secende":40
		};
		return testDate;
	}
	
	function handleBuyAndUse()
	{
		var itemID : int = totalData.isNew ? totalData.advancedItemId : totalData.itemID;
		var gem : int = totalData.isNew ? totalData.advancedItemPrice : totalData.gem;
		var itemCount:long = MyItems.instance().countForItem(itemID);
		if(itemCount>0)
		{
			if(totalData.isNew)
			{
				KBN.PveController.instance().ReqRecoverStamina(8);
			}
			else
			{
				KBN.PveController.instance().ReqRecoverStamina(2);
			}		
		}
		else
		{
			if (Payment.instance().CheckGems(gem)) 
			{
				if(totalData.isNew)
				{
					KBN.PveController.instance().ReqRecoverStamina(9);
				}
				else
				{
					KBN.PveController.instance().ReqRecoverStamina(3);
				}				
			}
		}
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.UPDATE_PVE_STAMINA:
				UpdateMenu();
				
				var samina : int = KBN.PveController.instance().GetSimina();
				if(maxStamina <= samina)
					handleBack();
				break;
		}
	}
	
	private function UpdateMenu():void
	{
		totalData = KBN.PveController.instance().GetPveTotalInfo() as KBN.PveTotalData;
		//bottleNum.txt = "X"+data["bottleNum"];
		maxStamina = KBN.PveController.instance().GetMaxStamina();
		recoverTime = KBN.PveController.instance().GetRecoverStaminaTime();
		
		var itemID : int;
		var stamina : int;
		var leftBuyNum : int;
		if(totalData.isNew)
		{
			itemID = totalData.advancedItemId;
			stamina = totalData.advancedEnergy;
			leftBuyNum = totalData.advancedItemLeftBuyNum;
			bottleIcon.setBackground("newStamina",TextureType.ICON);
		}
		else
		{
			itemID = totalData.itemID;
			stamina = totalData.samina;
			leftBuyNum = totalData.leftBuyNum;

			bottleIcon.setBackground("stamina",TextureType.ICON);
		}
		
		var itemCount:long = MyItems.instance().countForItem(itemID);
		
		if(itemCount>0)
		{
			buyBtn.txt = Datas.getArString("Common.Use_button");//"Use";
			gemIcon.txt = "";
			gemIcon.SetVisible(false);
			buyBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
		}
		else
		{
			buyBtn.txt = Datas.getArString("Common.BuyAndUse_button");//"Buy and use";
			if(totalData.isNew)
			{
				gemIcon.txt = totalData.advancedItemPrice+"";
			}
			else
			{
				gemIcon.txt = totalData.gem+"";
			}

			gemIcon.SetVisible(true);
			buyBtn.setNorAndActBG("button_60_green_normalnew","button_60_green_downnew");
		}
		
		if(leftBuyNum <= 0 && itemCount <= 0)
		{
//			buyBtn.rect = rectBtn1;
			buyBtn.setNorAndActBG("button_60_grey_normalnew","button_60_grey_normalnew");
			buyBtn.SetNormalTxtColor(FontColor.Sale_Gray);
			buyBtn.SetDisabled(true);
			gemIcon.txt = "";
			gemIcon.SetVisible(false);
			noBuyDesc.SetVisible(true);
		}
		else if(stamina >= maxStamina)
		{
//			buyBtn.rect = rectBtn2;
			buyBtn.setNorAndActBG("button_60_grey_normalnew","button_60_grey_normalnew");
			buyBtn.SetNormalTxtColor(FontColor.Sale_Gray);
			buyBtn.SetDisabled(true);
			gemIcon.txt = "";
			gemIcon.SetVisible(false);
			noBuyDesc.SetVisible(false);
		}
		else
		{
//			buyBtn.rect = rectBtn2;
			buyBtn.SetNormalTxtColor(FontColor.Button_White);
			buyBtn.SetDisabled(false);
			noBuyDesc.SetVisible(false);
		}
	
		bottleNum.txt = Datas.getArString("Common.Owned") + ': '+itemCount;
		bottomDescTitle.txt = Datas.getArString("itemName.i" + itemID);//"Blood Lust";
		bottomDesc.txt = Datas.getArString("itemDesc.i" + itemID);	
		staminaNum.txt = stamina + "/"+ maxStamina;
		
		itemIcon.tile.name  = TextureMgr.instance().LoadTileNameOfItem(itemID);
		UpdateVipElement();
	}
	
	private function UpdateVipElement()
	{
		vipIcon.SetVisible(GameMain.instance().IsVipOpened());
		vipTips.SetVisible(GameMain.instance().IsVipOpened());
		
	}
}