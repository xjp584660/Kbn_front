class CityItem extends ListItem
{
	public var population:Label;
	public var food:Label;
	public var happy:Label;
	
	public var normalBlueBtn:Texture2D;
	public var downBlueBtn:Texture2D;
	public var normalGreenBtn:Texture2D;
	public var downGreenBtn:Texture2D;	

	//public var curCity:Label;
	private var bCurCity:boolean;
	//public var l_bg:SimpleLabel;
	public var iconbg:Label;
	public var commingSoon:SimpleLabel;
	public var frame:SimpleLabel;
	
	public var populationContent:Label;
	public var foodContent:Label;
	public var happyContent:Label;
	public var componentObj:ComposedUIObj;

	public var  changeName:Label;
	public var  txtField:TextField;
	public var  cLimit:Label;
	//public var  money:Label;
	public var money_priceObj:SaleComponent;
	public var  owned:Label;
	public var  btnBuy:Button;
	private var itemNum:int;
	
	public var  line:Label;
	public var  line2:Label;
	public var  line3:Label;
	public var  line4:Label;
	public var  btnCity:Button;
	public var  cityInfo:City;
	public var  reqItem:CityRequirement;
	public var  reqLevel:CityRequirement;
	public var  reqPlain:CityRequirement;
	@SerializeField
	private var m_noticeOpenTime : Label;
	private var m_updateOpenTime : function();
	//public var  l_lock:Label;
	public var  cityLocked:Label;       
	public function Init()
	{
		population.txt = Datas.getArString("Common.Population");
		food.txt = Datas.getArString("ShowCityToolTip.FoodSupply");
		happy.txt = Datas.getArString("Common.Happiness") ;
		//money.txt = "" + Datas.instance().itemlist()["i" + 923]["price"].Value;
		//money_priceObj.setItemId(923);
		
		money_priceObj.Init();
		
		componentObj.component = [population, food, happy, populationContent, foodContent, happyContent];	
		
		cLimit.txt = Datas.getArString("Common.CharacterLimit")+ ": " + GameMain.instance().MaxPlayerNameCharactor.ToString();
		changeName.txt = Datas.getArString("RenameCity.EnterNameCaption");
		txtField.maxChar = 15;
//		icon.useTile = true;
//		icon.tile.spt = TextureMgr.instance().BuildingSpt();
//		icon.drawTileByGraphics = true;
		//l_lock.useTile = true;
		//l_lock.tile.spt = TextureMgr.instance().ItemSpt();
		//l_lock.drawTileByGraphics = true;
		//l_lock.TileName = "Big-lock";
		
		cityLocked.Init();
		
		reqItem.Init();
		reqLevel.Init();
		reqPlain.Init();

		this.txtField.Init();

	}
	
	public function SetRowData(data:Object)
	{
		m_noticeOpenTime.txt = "";
		m_updateOpenTime = null;
		cityInfo = data as City;
		population.txt = Datas.getArString("Common.Population")+ ":";
		food.txt = Datas.getArString("ShowCityToolTip.FoodSupply")+ ":";
		happy.txt = Datas.getArString("Common.Happiness") + ":";

		var curCityId:int = GameMain.instance().getCurCityId();
		bCurCity =  curCityId == cityInfo.cityId;
		var info:Object = GameMain.instance().GetCityInfo(curCityId);
//		var arStrings:Object = Datas.instance().arStrings();
		priv_setDefaultCityName();
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.image = null;
		title.rect.y = 18;
		icon.SetVisible(true);
		if(cityInfo.state == CityState.ALIVE)
		{
			var order :int = GameMain.instance().getCityOrderWithCityId(cityInfo.cityId);
			title.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_yellow_" + order,TextureType.ICON_ELSE);
			title.rect.y = 7;
			title.txt = title.txt + "-" +cityInfo.cityName + "(" + cityInfo.x + ", "+ cityInfo.y+")";
			populationContent.txt = ""+ _Global.NumFormat( Resource.instance().populationCount(cityInfo.cityId) );
			foodContent.txt = _Global.NumSimlify( Resource.instance().getCountForType(Constant.ResourceType.FOOD, cityInfo.cityId), 3, true);
			happyContent.txt = ""+ Resource.instance().populationHappiness(cityInfo.cityId) ;
			if(bCurCity)
			{
				btnCity.SetVisible(false);
				componentObj.rect.y = 20;
			}
			else
			{
				btnCity.SetVisible(true);
				btnCity.txt = Datas.getArString("Common.View");     	
				btnCity.mystyle.normal.background = normalBlueBtn;
				btnCity.rect.y = 165;
				componentObj.rect.y = -10;	
			}	
			//l_bg.Region.height = 760;
			btnCity.OnClick = EnterCity;
			m_updateOpenTime = null;
		}
		else if(cityInfo.state == CityState.WAITINGBUILD)
		{
			//Debug.LogWarning("!!!!!!!!!!cityInfo.state = "+cityInfo.state);
			
			reqItem.SetVisible(true);
			reqLevel.SetVisible(true);
			reqPlain.SetVisible(true);
			btnCity.SetVisible(true);
			populationContent.txt = "";
			foodContent.txt = "";
			happyContent.txt = "";
			reqItem.SetRowData(cityInfo.reqItem);
			reqLevel.SetRowData(cityInfo.reqLevel);
			reqPlain.SetRowData(cityInfo.reqPlain);

			//l_bg.Region.height = 270;
			btnCity.OnClick = CreatCity;
			if ( CityQueue.instance().GetCreatedCityByIdx(cityInfo.dependencyCityId-1) == null )
			{
				m_noticeOpenTime.SetNormalTxtColor(FontColor.Milk_White);
				m_updateOpenTime = priv_updateStartDependTime;
			}
		}
		else
		{
			reqItem.SetVisible(false);
			reqLevel.SetVisible(false);
			reqPlain.SetVisible(false);
			btnCity.SetVisible(false);
			icon.SetVisible(false);
			//btnCity.OnClick = CreatCity;
			var str:String =  Datas.getArString("PlayerInfo.CityLocked");
     		cityLocked.txt = str;
     		cityLocked.mystyle.normal.textColor = _Global.ARGB("0xFFe6cfaa");
			//l_bg.Region.height = 270;
			if ( CityQueue.instance().GetCreatedCityByIdx(cityInfo.dependencyCityId-1) == null )
			{
				m_noticeOpenTime.SetNormalTxtColor(FontColor.Milk_White);
				m_updateOpenTime = priv_updateStopDependTime;
			}
		}


		//curCity.txt = Datas.getArString("Common.CurrentCity");
//		icon.tile.name = "city-icon";//icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("city-icon", TextureType.ICON_ELSE);
//		icon.Background = TextureMgr.instance().LoadTexture( "f"+ cityInfo.citySequence + "_0_4_1", TextureType.BUILDING);		
		icon.Background = TextureMgr.instance().loadBuildingTextureFromSprite("f"+ cityInfo.citySequence + "_0_4_1");
		UpdateItem();
		
		//if(bCurCity)
		//	icon.Region.x = 184;
		//else
		//	icon.Region.x = 80;
		txtField.ClearField();	
	}

	private function priv_updateStopDependTime()
	{
		m_noticeOpenTime.txt = "";
		if ( cityInfo.closeDependTimeStart < 0 )
			return;

		var lessTime : long = cityInfo.closeDependTimeStart - GameMain.unixtime();
		var lessTimeString : String = "0";
		if ( lessTime > 0 )
			lessTimeString = _Global.timeFormatStr(lessTime);
		m_noticeOpenTime.txt = String.Format(Datas.getArString("City.Dependencytip_1"), lessTimeString);
	}


	private function priv_updateStartDependTime()
	{
		m_noticeOpenTime.txt = "";
		if ( cityInfo.closeDependTimeEnd < 0 )
			return;

		var lessTime : long = cityInfo.closeDependTimeEnd - GameMain.unixtime();
		var lessTimeString : String = "0";
		if ( lessTime > 0 )
			lessTimeString = _Global.timeFormatStr(lessTime);
		m_noticeOpenTime.txt = String.Format(Datas.getArString("City.Dependencytip_2"), lessTimeString);
	}

	public function Draw()
	{
		GUI.BeginGroup(rect);
		//l_bg.Draw();
		frame.Draw();
		title.Draw();
//		iconbg.Draw();
		icon.Draw();		
//		if(bCurCity)
//			curCity.Draw();
//		else
//			commingSoon.Draw();	
		if( cityInfo.state == CityState.ALIVE)
		{
			line.Draw();
//			population.Draw();
//			populationContent.Draw();
//			food.Draw();
//			foodContent.Draw();
//			happy.Draw();
//			happyContent.Draw();
			componentObj.Draw();
		//	btnSelect.Draw();
			changeName.Draw();
			txtField.Draw();
			cLimit.Draw();
	
			btnBuy.Draw();	
			
			if(itemNum > 0)
				owned.Draw();
			else
				//money.Draw();
				money_priceObj.Draw();
		}	
		else if(cityInfo.state == CityState.WAITINGBUILD)
		{
			line.Draw();
			reqItem.Draw();
			reqLevel.Draw();
			reqPlain.Draw();
			line2.Draw();
			line3.Draw();
			line4.Draw();
			m_noticeOpenTime.Draw();
		}
		else if(cityInfo.state == CityState.LOCKED)
		{
			//l_lock.Draw();
			cityLocked.Draw();
			m_noticeOpenTime.Draw();
		}
		btnCity.Draw();

				
		GUI.EndGroup();
	   	return -1;
	}
	
	private var isCutSale:boolean;

	function Update()
	{
		if( cityInfo.state == CityState.ALIVE)
		{
			money_priceObj.Update();
			
			if(isCutSale != money_priceObj.isShowSale)
			{
				isCutSale = money_priceObj.isShowSale;
				if(isCutSale)
				{
					money_priceObj.rect.x = 160;
				}
				else
				{
					money_priceObj.rect.x = 280;
				}
			}
		}
		else if(cityInfo.state == CityState.WAITINGBUILD)
		{
			reqItem.Update();
		}
		
		if ( m_updateOpenTime != null )
			m_updateOpenTime();
	}
	
	function UpdateData()
	{
		UpdateItem();
	}
	
	private function UpdateItem()
	{
//		var arStrings:Object = Datas.instance().arStrings();
		btnCity.disabled = false;
		if(cityInfo.state == CityState.WAITINGBUILD)
		{
			btnCity.SetVisible(true);
			if(cityInfo.bCreat)
			{
				btnCity.disabled = false;
				btnCity.mystyle.normal.background = normalBlueBtn;
			}
			else
			{
				btnCity.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
				btnCity.disabled =true;
			}
			btnCity.OnClick = CreatCity;
			btnCity.txt = Datas.getArString("PlayerInfo.AddCityButton");
			btnCity.rect.y = 105;        
		}
		
		itemNum = MyItems.instance().countForItem(923);
		if(itemNum > 0)
		{
			money_priceObj.SetVisible(false);
			owned.SetVisible(true);
//			btnBuy.txt = Datas.getArString("Common.Use_button"];
			owned.txt = Datas.getArString("Common.Owned") + ": " + MyItems.instance().countForItem(923);
			btnBuy.txt = Datas.getArString("Common.Use_button");
			btnBuy.mystyle.normal.background = normalBlueBtn;
			btnBuy.mystyle.active.background = downBlueBtn;
			//btnBuy.mystyle.padding.left = -10;
			btnBuy.OnClick =  function(param:Object)
			{
				RenameCity();
			};
		}	
		else
		{
			money_priceObj.SetVisible(true);
			owned.SetVisible(false);
			//money.txt = "" + Datas.instance().itemlist()["i" + 923]["price"].Value;
			var obj:HashObject = (Datas.instance().itemlist())["i" + 923];
			var category:int = _Global.INT32(obj["category"]);
						 
			var item:Hashtable = Shop.instance().getItem(category, 923);			
			money_priceObj.setData(item["price"], item["salePrice"], _Global.INT64(item["startTime"]), _Global.INT64(item["endTime"]), _Global.INT32(item["isShow"]), false);
			
			isCutSale = money_priceObj.isShowSale;
			if(isCutSale)
			{
				money_priceObj.rect.x = 160;
			}
			else
			{
				money_priceObj.rect.x = 280;
			}			
			
			btnBuy.txt = Datas.getArString("Common.BuyAndUse_button");
			btnBuy.mystyle.normal.background = normalGreenBtn;
			btnBuy.mystyle.active.background = downGreenBtn;
			//btnBuy.mystyle.padding.left = 90;
			btnBuy.OnClick =  function(param:Object)
			{
				Shop.instance().swiftBuy(923, RenameCity);
			};
			
		}
		
		var seed:Object = GameMain.instance().getSeed();
//		var curCityId:int = GameMain.instance().getCurCityId();
//		var cityInfo:Object = GameMain.instance().GetCityInfo(curCityId);
//		var cityName:String = cityInfo[_Global.ap+1];
//		title.txt = cityName;//Datas.getArString("Common.City"] + data["citySeq"];
		
		if(cityInfo.state == CityState.ALIVE)
			title.txt = cityInfo.cityName + " (" + cityInfo.x + ", "+ cityInfo.y+")";
		else
			priv_setDefaultCityName();
	}
	
	private function priv_setDefaultCityName()
	{
		var cityAliasNameKey : String = String.Format("CityName.{0}thCity", cityInfo.citySequence.ToString());
		if ( Datas.IsExistString(cityAliasNameKey) )
			title.txt = Datas.getArString(cityAliasNameKey);
		else
			title.txt = Datas.getArString("Common.City") + cityInfo.citySequence.ToString();
	}
	
	function RenameCity()
	{
		this.UpdateData();
		MyItems.instance().setNewCityName(txtField.txt, cityInfo.cityId);
	}
	
	function EnterCity()
	{
		GameMain.instance().changeCity(cityInfo.cityId);
		MenuMgr.getInstance().PopMenu("", "trans_pop");
	}
	
	function CreatCity()
	{
		MenuMgr.getInstance().PushMenu("CreatNewCity",{"plainId":null, "buildCity":cityInfo}, "trans_zoomComp");
	}
}

