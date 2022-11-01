
class PlayerInfo extends ComposedMenu
{
	public var 	detailTab:ComposedUIObj;
	public var  cityTab:ComposedUIObj;
	public var 	worldToolBar:ToolBar;

	private var normalBlueBtn:Texture2D;
	private var downBlueBtn:Texture2D;
	private var normalGreenBtn:Texture2D;
	private var downGreenBtn:Texture2D;

	public var  playerName:Label;
	public var  btnVIPLevel:Button;
	public var  l_vipBG:Label;
	public var  level:Label;
	public var  power:Label;
	public var  powerContent:Label;
	public var  owned:Label;
	public var  xpBar:PercentBar;
	public var  xp:Label;
	public var  allianceName:Label;
	public var  allianceNameContent:Label;
	public var allianceLeague:Label;
	public var allianceLeagueContent:Label;
	public var allianceLeagueIcon:Label;
	public var allianceLeagueRank:Label;
	public var allianceLeagueRankContent:Label;
	public var  alliancePos:Label;
	public var  alliancePosContent:Label;
	public var  allianceDiplomacy:Label;
	public var  allianceDiplomacyContent:Label;
	public var  allianceEmblem:AllianceEmblemButton;
	public var  changeName:Label;
	public var  txtField:TextField;
	public var  cLimit:Label;
	public var  money:Label;
    
    @SerializeField
    private var  money_priceTemplate : SaleComponent;
    
	private var  money_priceObj:SaleComponent;
	
	public var  avatar:Label;
	public var  avatarFrame:Label;
	public var  btnChange:Button;
	
	public var 	btnItems:Button;
	public var  btnFeedback:Button;
	public var  btnMigrate:Button;
	public var  btnGetIdea:Button;
	public var  btnBuy:Button;
	public var  btnCreatWorld:Button;
	public var  btnEnterWorld:Button;
	public var  worldList:ScrollList;
	public var  worldEnglishList:ScrollList;
	public var  worldOthersList:ScrollList;
	public var  selectedWorldlData:Object;
	public var  l_bg:Label;
	public var  l_bg2:Label;
	public var  line2:Label;
	public var  line3:Label;
	public var  line4:Label;
	public var  line5:Label;
	public var  levelCondition:Label;
	public var  powerCondition:Label;
	public var  cityList:ScrollList;
	public var  cityTemplate:CityItem;
	public var  worldTemplate:WorldItem;
	public var  btnSetting:Button;
	public var  btnHelp:Button;
	public var  btnForum:Button;
	private var 	worldData:Array = new Array();
	private var	worldData_English:Array = new Array();
	private var worldData_Others:Array = new Array();
	private var worldListOrigPosY:int;
	private var worldListTabIdx:int = 0;
	private var defaultWorldListTab:int = 0;
	private var flashTimeVip: float;

	@Space(20) @Header("----------服务器的ID集合 - 用来过滤掉不运营的服务器----------") 
	@SerializeField	private var worldIds: int[];


	function Init()
	{
		super.Init();

		var texMgr : TextureMgr = TextureMgr.instance();
		normalGreenBtn = texMgr.LoadTexture("button_60_green_normalnew", TextureType.BUTTON);
		downGreenBtn = texMgr.LoadTexture("button_60_green_downnew", TextureType.BUTTON);
		normalBlueBtn = texMgr.LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);
		downBlueBtn = texMgr.LoadTexture("button_60_blue_downnew", TextureType.BUTTON);
//		var arStrings:Object = Datas.instance().arStrings();
		worldListOrigPosY = 168;
		var detail:String = Datas.getArString("Common.Details");
		var cities:String = Datas.getArString("Common.Cities");
		var worlds:String = Datas.getArString("Common.World");
		titleTab.toolbarStrings = [detail, cities, worlds];
		changeName.txt = Datas.getArString("questObjectives.q999021");
		cLimit.txt = Datas.getArString("Common.CharacterLimit")+ ": " + GameMain.instance().MaxPlayerNameCharactor.ToString();
		btnFeedback.txt = Datas.getArString("PlayerInfo.ButtonSupport");
		btnMigrate.txt= Datas.getArString("PlayerInfo.ButtonMigrate");
		btnGetIdea.txt = Datas.getArString("Settings.GetIdea");
		btnForum.txt = Datas.getArString("PlayerInfo.ButtonForum");
		txtField.hidInput = false;
		cityTemplate.txtField.hidInput = false;
		txtField.maxChar = 15;
		
		 
		btnMigrate.SetVisible(GameMain.instance().GetmMigrateSwitch());
		
		xpBar.Init();
		
		l_vipBG.useTile = false;
		
        if (money_priceObj != null)
        {
            TryDestroy(money_priceObj);
            money_priceObj = null;
        }
        money_priceObj = Instantiate(money_priceTemplate);
        
        allianceEmblem.SetVisible(false);
		detailTab.component = [l_bg, l_bg2, line2, line3, line4, line5, owned,playerName, l_vipBG,btnVIPLevel,level, btnItems, xpBar, xp, levelCondition, power,powerContent, powerCondition, 
		allianceName, allianceNameContent, allianceLeague,allianceLeagueContent,allianceLeagueIcon,allianceLeagueRank,allianceLeagueRankContent,alliancePos, alliancePosContent, allianceDiplomacy, 
		allianceDiplomacyContent, allianceEmblem, changeName, txtField, cLimit, btnBuy, avatar, avatarFrame, btnChange, /*money,*/money_priceObj, /*removed in 18.5.0 Gaea btnGetIdea,*/btnFeedback, btnMigrate,btnForum];
		detailTab.Init();
		
		//worldTab.component = [worldToolBar,worldList];//,btnCreatWorld,btnEnterWorld];
//		btnCreatWorld.txt = Datas.getArString("PlayerInfo"]["CreatNewWorld"];
//		btnEnterWorld.txt = Datas.getArString("PlayerInfo"]["EnterWorld"];
		tabArray = [detailTab, cityList, worldToolBar];
//		cityTemplate.Init();
		cityList.Init(cityTemplate);
		cityList.btnNextPage.mystyle.normal.background = texMgr.LoadTexture("button_flip_right_normal", TextureType.BUTTON);
		cityList.btnNextPage.mystyle.active.background = texMgr.LoadTexture("button_flip_right_down", TextureType.BUTTON);
		cityList.btnPrevPage.mystyle.normal.background = texMgr.LoadTexture("button_flip_left_normal", TextureType.BUTTON);
		cityList.btnPrevPage.mystyle.active.background = texMgr.LoadTexture("button_flip_left_down", TextureType.BUTTON);
		//worldList.Init(worldTemplate);
		worldEnglishList.Init(worldTemplate);
		worldOthersList.Init(worldTemplate);
		
//		btnFeedback.SetVisible(false);
//		btnFeedback.txt = Datas.getArString("GameCenter"]["Leaderboard"];
//		btnFeedback.OnClick = clickLeaderboard;
		
		power.txt = Datas.getArString("MainChrome.MightInfo_Title") + ": ";
		allianceName.txt =  Datas.getArString("ShowCreateAlliance.AllianceName") + ": ";
		allianceLeague.txt = Datas.getArString("PVP.TileLeagueTitle");
		allianceLeagueRank.txt = Datas.getArString("PVP.TileLeagueRank");
		alliancePos.txt = Datas.getArString("Profile.AlliancePosition") + " ";
		allianceDiplomacy.txt = "";// Datas.getArString("AllianceInfo.AllianceDiplomacy"];
		
		
		powerCondition.txt = Datas.getArString("Common.MightDesc");
		//menuHead.Init();
		menuHead.btn_getmore.SetVisible(false);	
		btnSetting.OnClick = function(param:Object)
		{
			MenuMgr.getInstance().PushMenu("PlayerSetting", null, "trans_zoomComp" );
		};
		btnHelp.OnClick = function(param:Object)
		{
            MenuAccessor.OpenHelp();
		};
		
		if (KBN._Global.IsLargeResolution ()) 
		{
			btnSetting.rect.width = 66;
			btnHelp.rect.width = 66;
		} 
		else if (KBN._Global.isIphoneX ()) 
		{
			btnSetting.rect.width = 85;
			btnHelp.rect.width = 85;
		}
		else
		{
			btnSetting.rect.width = 75;
			btnHelp.rect.width = 75;
		}
		btnSetting.rect.height = 63;
		btnSetting.rect.y = 2;
		btnHelp.rect.height = 63;
		btnHelp.rect.y = 2;
		menuHead.l_gem.SetVisible(false);
		
		btnGetIdea.OnClick = OnGetIdea;
		btnFeedback.OnClick = OnContact;
		btnMigrate.OnClick=OnMigrate;
		btnItems.OnClick = OnItems;
		btnForum.OnClick = OnForum;
		btnVIPLevel.OnClick = OpenVipMenu;
		money_priceObj.Init();
		
		worldToolBar.Init();
		worldToolBar.toolbarStrings = [Datas.getArString("Language.English"),Datas.getArString("Language.Other")];
		worldToolBar.SetVisible(true);
		worldToolBar.indexChangedFunc = worldTabidxChgFunc;
		
		cLimit.SetVisible(true);
		txtField.startInput = function() {
			cLimit.SetVisible(false);
		};
		txtField.endInput = function() {
			if (txtField._txt == "") {
				cLimit.SetVisible(true);
			}
		};
		
		btnChange.txt = Datas.getArString("Common.Change");
//		btnChange.mystyle.normal.background = normalBlueBtn;
//		btnChange.mystyle.active.background = downBlueBtn;
		btnChange.OnClick = function(param:Object)
		{
			MenuMgr.getInstance().PushMenu("AvatarSelector", null, "trans_zoomComp");
		};
		
		avatar.inScreenAspect = !_Global.IsFitLogicScreen();
		avatar.lockWidthInAspect = _Global.IsTallerThanLogicScreen();
		avatar.lockHeightInAspect = _Global.IsShorterThanLogicScreen();

		avatarFrame.inScreenAspect = !_Global.IsFitLogicScreen();
		avatarFrame.lockWidthInAspect = _Global.IsTallerThanLogicScreen();
		avatarFrame.lockHeightInAspect = _Global.IsShorterThanLogicScreen();
		
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");


	}
	
	private function OpenVipMenu(param:Object):void
	{
		if(!GameMain.instance().IsVipOpened()) return;
		var vipData:HashObject = GameMain.instance().GetVipData();
		MenuMgr.getInstance().PushMenu("VIPMenu", vipData);
	}
	
	private function OnItems(param:Object):void
	{
		var obj:Object = {"selectedTab":1, "selectedList":4};
		MenuMgr.getInstance().PushMenu("InventoryMenu", obj);		
	}
	
	private function OnContact(param:Object)
	{
		MenuMgr.getInstance().PushMenu("BugsAndIssues", null, "trans_zoomComp");
	}
	
	private function OnMigrate(param:Object)
	{
		var okFunc:Function = function(result:HashObject)
		{
			if (result["ok"].Value) {
				MenuMgr.getInstance().PushMenu("MigrateMenu", result, "trans_zoomComp" );
			}
		};
	
				
		var errorFunc:Function = function(errorMsg:String, errorCode:String)
		{
			ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
		};

//		var curServerId:int=Datas.instance().worldid();
//		var userId:int=GameMain.instance().getUserId();
		UnityNet.GetMigrateWords( okFunc, errorFunc);
		
		
	}
	
	private function OnGetIdea(param:Object)
	{
        GameMain.instance().OpenUserVoice();
	}
	
	private function OnForum(param:HashObject)
	{
		UnityNet.GetHelp(3, GetHlepOk, null);
	}
	private function GetHlepOk(result:HashObject)
	{
		Application.OpenURL(result["url"].Value);
	}
	
	private function clickLeaderboard():void
	{
		//GameCenterMgr.getInstance().openLeaderboard();
	}
	
	public function DrawBackground()
	{
		super.DrawBackground();
		

		btnSetting.Draw();
		btnHelp.Draw(); 
		if(selectedTab == 2)
		{
			worldList.Draw();
		}
	}
	
	private function resetDisplay():void
	{
		var seed:HashObject = GameMain.instance().getSeed();
		menuHead.setTitle(Datas.getArString("Common.PlayerInfo_Title"));
		var myAlliance:AllianceVO;
		if( Alliance.getInstance().hasGetAllianceInfo ){
			myAlliance = Alliance.getInstance().myAlliance;
		}else{
			Alliance.getInstance().reqAllianceInfo();
		}
		txtField.ClearField();
	//	txtField._txt = "cloud";Datas.instance().tvuid()
		playerName.txt = seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value + String.Format(Datas.getArString("PlayerInfo.UID"), Datas.instance().tvuid());
		var vipData:HashObject = GameMain.instance().GetVipData();
		btnVIPLevel.txt = _Global.GetString(vipData["vipLevel"]);
		btnVIPLevel.SetVisible(GameMain.instance().IsVipOpened());
		l_vipBG.SetVisible(GameMain.instance().IsVipOpened());
		powerContent.txt = _Global.NumFormat(_Global.INT64(seed["player"]["might"].Value));
		level.txt = Datas.getArString("MainChrome.LevelInfo_Title") + ": "+ seed["player"]["title"].Value;
		
		if(_Global.INT32(seed["player"]["title"].Value) >= 3)
		{
			levelCondition.txt = Datas.getArString("Common.LevelChest");
		}
		else
		{
			levelCondition.txt = Datas.getArString("Common.LevelChestThree");
		}
		
		allianceNameContent.txt = myAlliance?myAlliance.name:"" ;
		allianceLeagueContent.txt = Datas.getArString("LeagueName.League_"+GameMain.instance().GetAllianceLeague());
		var rankInLeague:int = GameMain.instance().GetAllianceRankInLeague();
		allianceLeagueRankContent.txt = rankInLeague!=0?rankInLeague.ToString():"";
		allianceLeagueIcon.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(GameMain.instance().GetAllianceLeague()),TextureType.DECORATION);
		allianceLeagueIcon.rect.x = allianceLeagueContent.rect.x + allianceLeagueContent.GetWidth() + 10;
		alliancePosContent.txt =  myAlliance?myAlliance.role:"";
		allianceDiplomacyContent.txt = "";
		var nextlvlxp:int = _Global.INT32(seed["xp"]["nextlvlxp"]) + 1;
		xp.txt = seed["xp"]["xp"].Value + "/" + nextlvlxp;
		xpBar.Init( _Global.INT32(seed["xp"]["xp"]), nextlvlxp );
		if( MyItems.instance().countForItem(922) > 0 )
		{
			owned.txt = Datas.getArString("Common.Owned") + ': ' + MyItems.instance().countForItem(922);
			//money.SetVisible(false);
			money_priceObj.SetVisible(false);
			
			owned.SetVisible(true);
			btnBuy.txt = Datas.getArString("Common.Use_button");
			btnBuy.changeToBlueNew();
//			btnBuy.mystyle.normal.background = normalBlueBtn;
//			btnBuy.mystyle.active.background = downBlueBtn;
			//btnBuy.mystyle.padding.left = -10;
			btnBuy.OnClick =  function(param:Object)
			{
				MyItems.instance().changeNameDo(txtField.txt);
			};
		}
		else
		{
			//money.SetVisible(true);
			money_priceObj.SetVisible(true);
			owned.SetVisible(false);
			
			var obj:HashObject = (Datas.instance().itemlist())["i" + 922];
			var category:int = _Global.INT32(obj["category"]);
						 
			var item:Hashtable = Shop.instance().getItem(category, 922);			
			money_priceObj.setData(item["price"], item["salePrice"], _Global.INT64(item["startTime"]), _Global.INT64(item["endTime"]), _Global.INT32(item["isShow"]), false);

			isCutSale = money_priceObj.isShowSale;
									
			btnBuy.txt = Datas.getArString("Common.BuyAndUse_button");
			btnBuy.changeToGreenNew();
//			btnBuy.mystyle.normal.background = normalGreenBtn;
//			btnBuy.mystyle.active.background = downGreenBtn;
			//btnBuy.mystyle.padding.left = 90;
			btnBuy.OnClick =  function(param:Object)
			{
				MyItems.instance().changeNameBuyAndDo(txtField.txt);
			};
		}
		
		allianceEmblem.Data = AllianceEmblemMgr.instance.playerAllianceEmblem;
		allianceEmblem.SetVisible(null != AllianceEmblemMgr.instance.playerAllianceEmblem);
		
		avatar.useTile = true;
		avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(AvatarMgr.instance().PlayerAvatar));

		if(FrameMgr.instance().PlayerHeadFrame != "img0")
		{
			avatarFrame.useTile = true;
			avatarFrame.tile = TextureMgr.instance().ElseIconSpt().GetTile(FrameMgr.instance().PlayerHeadFrame);
		}
		else
		{
			avatarFrame.useTile = false;
		}		
		
		CityQueue.instance().CheckNewCtiyRequirement();
		GetCityList();
		worldData_English.Clear();
		worldData_Others.Clear();
		worldEnglishList.Clear();
		worldOthersList.Clear();
		UnityNet.GetWorldsInfo(GetWorldList, null);
		worldList.SetVisible(true);
		worldOthersList.MoveToTop();
		worldEnglishList.MoveToTop();
		worldList.MoveToTop();
		
		menuHead.rect.height = 150;
		menuHead.SetGemsAnimationVisible(false);		
	}
	
	function OnPush(param:Object)
	{	
		super.OnPush(param);
		if(Shop.instance().updateShop)
		{
			Shop.instance().getShopData(resetDisplay);
		}
		else
		{
			resetDisplay();
		}
		
		var table : Hashtable = param as Hashtable;
		if (null != table && null != table["avatar_selector"]) {
			MenuMgr.getInstance().PushMenu("AvatarSelector", null, "trans_zoomComp");
		}
	}
	
	function GetCityList()
	{
		var data:Array = new Array();
		var seed:HashObject = GameMain.instance().getSeed();
		var curCityId:int = GameMain.instance().getCurCityId();
		var cityInfo:Object = GameMain.instance().GetCityInfo(curCityId);
//		var newItem:Object  = {
//				"cityId":curCityId,
//				"citySeq":1,
//				"cityName":cityInfo[_Global.ap+1],
//				"population":Resource.instance().populationCount(curCityId),
//				"food":Resource.instance().getCountForType(Constant.ResourceType.FOOD, curCityId),
//				"happy":Resource.instance().populationHappiness(curCityId) 
//		};
		var cities:System.Collections.Generic.List.<City> = CityQueue.instance().Cities;
		for(var i:int = 0; i<CityQueue.instance().MaxCityCnt; i++)
		{
			if(cities[i].state == CityState.INCOMING)
				continue;
			data.Push(cities[i]);
		}
		cityList.SetData(data);
		cityList.ResetPos();
		Updatecitypage(GameMain.instance().getCurCityOrder());

//		data.Push(newItem);
//		cityList.SetData(data);
//		cityTemplate.SetRowData(newItem);
//		cityTemplate.txtField.ClearField();
	}
	
	function GetWorldList(param:HashObject)
	{
		if (!param["ok"].Value) 
			return;
		var curWorld:int = Datas.instance().worldid();	
		var worlds:HashObject = param["myworlds"];
		var keys:Array =  _Global.GetObjectKeys(worlds);
		var newItem:WorldInfo;
		var data:Array = new Array();
		for(var i:int =0; i<keys.length; i++)
		{
			var curData:HashObject = worlds[ _Global.ap + i ];
			newItem = new WorldInfo();
			newItem.worldId = _Global.INT32( curData["worldId"] );
			newItem.worldName = curData["worldName"].Value;
			newItem.playerName = curData["playerName"].Value;
			newItem.worldDate = curData["worldDate"].Value;
			newItem.isTest = curData["isTestWorld"].Value;
			newItem.population = _Global.INT32(curData["population"]);
			newItem.language = _Global.GetString(curData["language"]);


			if (IsWorldIdsServiced(newItem.worldId)) { 
				if(newItem.language == "en")
				{
					if( newItem.worldId == curWorld )
					{
						worldData_English.Unshift(newItem);
						defaultWorldListTab = 0;
						worldToolBar.SelectTab(defaultWorldListTab);
					}
					else
						worldData_English.Push(newItem);
				}
				else
				{
					if( newItem.worldId == curWorld )
					{
						defaultWorldListTab = 1;
						worldToolBar.SelectTab(defaultWorldListTab);
						worldData_Others.Unshift(newItem);
					}
					else
						worldData_Others.Push(newItem);
				}
			}
				
		}
		
		UnityNet.GetNewWorld(GetNewWorlds, null);
	}

	/*用来判断当前服务器是否在运营*/
	private function IsWorldIdsServiced(worldId: int): boolean {
		for (var i: int = 0; i < worldIds.length; i++) {
			if (worldId == worldIds[i]) {
				return true;
			}
		}
		return false;
	}

	function GetNewWorlds(param:HashObject)
	{
		if (!param["ok"].Value) 
			return;
		var worlds:HashObject = param["worlds"];
		var keys:Array =  _Global.GetObjectKeys(worlds);
		var newItem:WorldInfo;
		var data_English:Array = new Array();
		var data_Others:Array = new Array();
		for(var i:int =0; i<keys.length; i++)
		{
			var curData:HashObject = worlds[ _Global.ap + i ];
			newItem = new WorldInfo();
			newItem.worldId = _Global.INT32( curData["worldId"] );
			newItem.worldName = curData["worldName"].Value;
			newItem.playerName = null;//curData["playerName"]?curData["playerName"].Value:"";
			newItem.worldDate = curData["worldDate"].Value;
			newItem.isTest = curData["isTestWorld"].Value;
			newItem.population = _Global.INT32(curData["population"]);
			newItem.language = _Global.GetString(curData["language"]);
			//newItem.createDate = curData["createDate"].Value;
			
			if(newItem.language == "en")
				data_English.Push(newItem);
			else
				data_Others.Push(newItem);			
		}
		
		data_English.Sort(function(a:WorldInfo,b:WorldInfo){
			
			return  b.worldId - a.worldId;
		});
		data_Others.Sort(function(a:WorldInfo,b:WorldInfo){
			
			return  b.worldId - a.worldId;
		});
		worldData_English = worldData_English.concat(data_English);
		worldData_Others = worldData_Others.concat(data_Others);
		worldEnglishList.SetData(worldData_English);
		worldOthersList.SetData(worldData_Others);
		
		if(defaultWorldListTab == 0)
			worldList = worldEnglishList;
		else
			worldList = worldOthersList;

	}
	
//	protected function WorldItemClick(data:Object):void
//	{
//		if(selectedWorldlData)
//		{
//			selectedWorldlData.selected = false; 
//		}
//		selectedWorldlData = data;	
//		selectedWorldlData.selected = true;
//	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case "ChangeAvatar":
				avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(AvatarMgr.instance().PlayerAvatar));
				break;
			case "ChangeName":
				var seed:HashObject = GameMain.instance().getSeed();
				playerName.txt = seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value + String.Format(Datas.getArString("PlayerInfo.UID"), Datas.instance().tvuid());
				worldList.UpdateData();
				if( MyItems.instance().countForItem(922) > 0 )
				{
					owned.txt = Datas.getArString("Common.Owned") + ':' + MyItems.instance().countForItem(922);
					money_priceObj.SetVisible(false);
					owned.SetVisible(true);
					btnBuy.txt = Datas.getArString("Common.Use_button");
					btnBuy.changeToBlueNew();
//					btnBuy.mystyle.normal.background = normalBlueBtn;
//					btnBuy.mystyle.active.background = downBlueBtn;
					//btnBuy.mystyle.padding.left = -10;
					btnBuy.OnClick =  function(param:Object)
					{
						MyItems.instance().changeNameDo(txtField.txt);
					};
				}
				else
				{
					money_priceObj.SetVisible(true);
					owned.SetVisible(false);
					var obj:HashObject = (Datas.instance().itemlist())["i" + 922];
					var category:int = _Global.INT32(obj["category"]);
								 
					var item:Hashtable = Shop.instance().getItem(category, 922);			
					money_priceObj.setData(item["price"], item["salePrice"], _Global.INT64(item["startTime"]), _Global.INT64(item["endTime"]), _Global.INT32(item["isShow"]), false);
					
					isCutSale = money_priceObj.isShowSale;									
					
					btnBuy.txt = Datas.getArString("Common.BuyAndUse_button");
					btnBuy.changeToGreenNew();
//					btnBuy.mystyle.normal.background = normalGreenBtn;
//					btnBuy.mystyle.active.background = downGreenBtn;
					//btnBuy.mystyle.padding.left = 90;
					btnBuy.OnClick =  function(param:Object)
					{
						MyItems.instance().changeNameBuyAndDo(txtField.txt);
					};
				}		
				break;
			case "RenameCity":
				cityList.UpdateData();
				break;	
				
			case Constant.Notice.ALLIANCE_INFO_LOADED:
				var myAlliance:AllianceVO = Alliance.getInstance().myAlliance;
				allianceNameContent.txt = myAlliance?myAlliance.name:"" ;
				alliancePosContent.txt =  myAlliance?myAlliance.role:"";
				allianceLeagueContent.txt = myAlliance? Datas.getArString("LeagueName.League_"+myAlliance.league):Datas.getArString("LeagueName.League_0");
				var league:int = myAlliance?myAlliance.league:0;
				allianceLeagueIcon.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(league),TextureType.DECORATION);
				allianceLeagueRankContent.txt = myAlliance?myAlliance.rankInLeague.ToString():"" ;
				break;
			case Constant.Notice.NEWCITY_REQUIREMENT:
				cityList.UpdateData();
				break;	
			case Constant.FrameType.DECORATION_UPDATE:
				if(FrameMgr.instance().PlayerHeadFrame != "img0")
				{
					avatarFrame.useTile = true;
					avatarFrame.tile = TextureMgr.instance().ElseIconSpt().GetTile(FrameMgr.instance().PlayerHeadFrame);
				}
				else
				{
					avatarFrame.useTile = false;
				}	
				break;
		}
	}
	
	function OnPop()
	{
		menuHead.SetGemsAnimationVisible(true);
		worldList.SetVisible(false);
		super.OnPop();
	}
	
	private var isCutSale:boolean;
	
	function Update()
	{
		super.Update();
		if(selectedTab == 2)
			worldListOrigPosY = 168+100;
		else
			worldListOrigPosY = 168;
		
		if(subMenuStack.Count == 0)
		{
			if(tabArray[selectedTab])
			{
				tabArray[selectedTab].Update();
			}
		}
		if(selectedTab == 2)
		{
			//in world tab
			worldList.Update();
		}
		
		if(selectedTab == 0)
		{
			money_priceObj.Update();
			
			if(isCutSale != money_priceObj.isShowSale)
			{
				isCutSale = money_priceObj.isShowSale;				
			}
		}
		if(GameMain.instance().IsVipOpened())
		{
			flashTimeVip += Time.deltaTime;
			if(flashTimeVip >= 1.0)
			{
				l_vipBG.setBackground("city_background2",TextureType.BACKGROUND);
			}
			if(flashTimeVip >= 2.0)
			{
				l_vipBG.mystyle.normal.background = null;
				flashTimeVip = 0;
			}
		
			l_vipBG.SetVisible(Datas.singleton.GetVipLevelUpFlag2()==1);
		}
	}
	
	function Draw()
	{
		super.Draw();
//		if(selectedTab == 2)
//		{
//			worldList.Draw();
//		}
	}
	
	function ViewCity(citySequence:int)
	{
		titleTab.selectedIndex = 1;
		var cities:System.Collections.Generic.List.<City> = CityQueue.instance().Cities;
		var pageCnt : int = 0;
		for(var i:int = 0; i < CityQueue.instance().MaxCityCnt && i < citySequence; i++)
		{
			if(cities[i].state == CityState.INCOMING)
				continue;
			++pageCnt;
		}

		if ( pageCnt > 0 )
			cityList.SetToPage(pageCnt - 1);
	}
	
	function Updatecitypage(citySequence:int)
	{
		//cityList.SetToPage(citySequence - 1);
	}
	
	function NextCity()
	{
	}
	
	function PrevCity()
	{
	}
	
	protected function worldTabidxChgFunc(idx:int):void
	{
		if(idx == 0)
		{
			worldList = worldEnglishList;
		}
		else
		{
			worldList = worldOthersList;
		}
		worldList.MoveToTop();
	}
	
	public function OnPopOver()
	{
		worldEnglishList.Clear();
		worldOthersList.Clear();
		cityList.Clear();
        
        TryDestroy(money_priceObj);
        money_priceObj = null;
		
        super.OnPopOver();
	}
}
