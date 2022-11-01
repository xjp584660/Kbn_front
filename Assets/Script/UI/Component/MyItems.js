	
class MyItems extends KBN.MyItems
{
	public	static	function	instance() : MyItems {
		if( singleton == null ){
			singleton = new MyItems();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		
		return singleton as MyItems;
	}
	
	public	function	init(sd:HashObject){
		seed = sd;
		InitItemList();
		priv_InitCoolDownItem();
		saveItemCoutDic();
	}
	
	public function UpdateAllItemList(sd:HashObject){
		seed = sd;
		InitItemList();
		priv_InitCoolDownItem();
		MenuMgr.getInstance().sendNotification("UpdateItem", null);
		
	}

	public function Update() : void
	{
		this.priv_FlushTimerItems();
	}
	
	public function ResortShopList(){
		//_Global.Log("ResortShopList----");
		generalList.Sort(SortItem_Basic);
		speedList.Sort(SortItem_Basic);
		attackList.Sort(SortItem_Basic);
		treasureItemList.Sort(SortItem_Basic);
		productList.Sort(SortItem_Basic);
//		chestList.Sort(SortItem_Basic);
		if(KBN.FTEMgr.isFTERuning()){
			chestList.Sort(FteChestSort);
		}else{
			chestList.Sort(SortItem_Basic);
		}
		buffList.Sort(SortItem_Basic);
		troopsList.Sort(SortItem_Basic);
		gearList.Sort(SortItem_Basic);
		heroList.Sort(SortItem_Basic);
		exchangeList.Sort(SortItem_Basic);
		citySkinPropList.Sort(SortItem_Basic);

		generalList = ResortList(generalList);
		speedList = ResortList(speedList);
		attackList = ResortList(attackList);
		treasureItemList = ResortList(treasureItemList);
		productList = ResortList(productList);
		chestList = ResortList(chestList);
		buffList = ResortList(buffList);
		troopsList = ResortList(troopsList);
		gearList = ResortList(gearList);
		heroList = ResortList(heroList);
		exchangeList = ResortList(exchangeList);
		citySkinPropList = ResortList(citySkinPropList);
	}

	private function priv_InitCoolDownItem()
	{
		var cdItems = seed["itemscountdowntime"];
		if ( cdItems == null )
			return;
		for ( var cdItem : DictionaryEntry in cdItems.Table )
		{
			var keys : String = cdItem.Key as String;
			var itemIds : String = keys.Substring(1, keys.Length-1);
			var itemId : int = _Global.INT32(itemIds);
			var cdTimeSeconds : int = _Global.INT32(cdItem.Value);
			this.SetItemTimeLeft(itemId, cdTimeSeconds);
		}
	}
	
	
	private var	m_priorityItemIds = [ // this will always be put first
	//				599, // gamble token
					10018,
					10019
				];

	private function priv_clearAllList()
	{
		speedList.Clear();
		generalList.Clear();
		attackList.Clear();
		productList.Clear();
		chestList.Clear();
		piecesList.Clear();
		buffList.Clear();
		troopsList.Clear();
		gearList.Clear();
		heroList.Clear();
		exchangeList.Clear();
		
		treasureChestList.Clear();
		treasureItemList.Clear();
		
		equipStrengthenList.Clear();

		// LiHaojie 2013.09.22: Add may drop gear item array
		mayDropGearItemIds.Clear();

		citySkinPropList.Clear();

	}
	
	private function priv_initItemList_updateMayDropGearItems()
	{
		if (null != seed["gearItems"])
		{
			for( var iGearItem:System.Collections.DictionaryEntry in seed["gearItems"].Table)
			{
				var tItemId:int = _Global.INT32((iGearItem.Key as String).Split('i'[0])[1]);
				mayDropGearItemIds.Add(tItemId);
			}
		}
	}

	private function priv_initItemList_LoadItems()
	{
		var itemlist : HashObject = Datas.instance().itemlist();
		//itemlist = null;
		if(itemlist == null)
		{
			//_Global.Log("data ok get Flags.GM_DATA_LOADED:" + Flags.instance().GM_DATA_LOADED);
			var dataLoaded : String = " Flags.GM_DATA_LOADED:" + Flags.instance().GM_DATA_LOADED;
			var errorLog : String = "UserId : " + GameMain.singleton.getUserId() + " CurMenu : " + MenuMgr.instance.GetCurMenuName() + " itemlist == NULL " + dataLoaded; 
			UnityNet.reportErrorToServer("MyItems  priv_initItemList_LoadItems : ", null, null, errorLog, false);
			GameMain.instance().restartGame();
			return;
		}
		for ( var i:System.Collections.DictionaryEntry in seed["items"].Table)
		{
			var itemId:int = _Global.INT32((i.Key as String).Split('i'[0])[1]);
			priv_initItemList_LoadItems_checkItem(itemId, itemlist);
		}
	}

	private function priv_initItemList_LoadItems_checkItem(itemId:int, itemlist : HashObject)
	{
//		if(itemId == 67307)
//		{
//			var aaa : int = 111111;
//		}
	
		var itemCount : long = countForItem(itemId);
		if ( itemCount <= 0 )
			return;

		for(var j:int =0; j< m_priorityItemIds.length; j++)
		{
			if ( m_priorityItemIds[j] == itemId )
				return;
		}

		var item = itemlist["i" + itemId];
		
//		if ((!item && MystryChest.instance().IsLoadFinish && !MystryChest.instance().IsMystryChest(itemId) && !MystryChest.instance().IsLevelChest(itemId)) )
//			return;
		var newItem:InventoryInfo  = new InventoryInfo();
		newItem.id = itemId;
		newItem.quant = itemCount;
//		if(MystryChest.instance().IsLoadFinish && !MystryChest.instance().IsMystryChest(itemId) && !MystryChest.instance().IsLevelChest(itemId) && item != null && !item["category"] )
//			return;

		if ( MystryChest.instance().IsLoadFinish )
		{	
			if(MystryChest.instance().IsExchangeChest(itemId))
			{
				newItem.category = Category.Exchange;
				CategorizeNormalItem(item, newItem, itemId);
			}
			else if(MystryChest.instance().IsMystryChest(itemId))
			{
				newItem.category = Category.MystryChest;
			}
			else if(MystryChest.instance().IsLevelChest(itemId))
			{
				newItem.category = Category.LevelChest;
			}
			else
			{
				CategorizeNormalItem(item, newItem, itemId);
			}
		}
		else 
		{
			CategorizeNormalItem(item, newItem, itemId);
		}

		for (var k:int = 0; k < mayDropGearItemIds.Count; k++)
		{
			if(mayDropGearItemIds[k] == itemId)
			{
				newItem.mayDropGear = true;
				break;
			}
		}

		priv_pushToCategory(newItem);
	}

	function InitItemList()
	{
		priv_clearAllList();
		priv_initItemList_updateMayDropGearItems();

		MystryChest.instance().AddLoadMystryChestCallback(priv_updateCategoryIsUnknowItem);

        unusableItemRanges = Datas.instance().GetUnusableItemRanges();
        shadowGemItemRanges = Datas.instance().GetShadowGemItemRanges();


		priv_initItemList_LoadItems();

		generalList.Sort(SortItem_Basic);
		speedList.Sort(SortItem_Basic);
		attackList.Sort(SortItem_Basic);
		treasureItemList.Sort(SortItem_Basic);
		productList.Sort(SortItem_Basic);
		chestList.Sort(SortItem_Basic);
		buffList.Sort(SortItem_Basic);
		troopsList.Sort(SortItem_Basic);
		gearList.Sort(SortItem_Basic);
		heroList.Sort(SortItem_Basic);
		exchangeList.Sort(SortItem_Basic);
		citySkinPropList.Sort(SortItem_Basic);

		generalList = ResortList(generalList);
		speedList = ResortList(speedList);
		attackList = ResortList(attackList);
		treasureItemList = ResortList(treasureItemList);
		productList = ResortList(productList);
		chestList = ResortList(chestList);
		buffList = ResortList(buffList);
		troopsList = ResortList(troopsList);
		gearList = ResortList(gearList);
		heroList = ResortList(heroList);
		exchangeList = ResortList(exchangeList);
		citySkinPropList = ResortList(citySkinPropList);
	}
	
	private function CategorizeNormalItem(item : HashObject, newItem : InventoryInfo, itemId : int) {
		if (item != null && item["category"] != null) {
			newItem.category = _Global.INT32(item["category"]);
			newItem.description = generateItemDesc(itemId);
		} else {
			newItem.category = Category.UnknowItem;
			newItem.description = generateItemDesc(itemId);
		}
	}
	
	public function dealExchangeItem()
	{
		var exchangeTempArr : System.Collections.Generic.List.<InventoryInfo> = new System.Collections.Generic.List.<InventoryInfo>();
		
		var arr : System.Collections.Generic.List.<InventoryInfo> = this.GetList(Category.Chest);
		for(var i : int = 0; i < arr.Count;++i)
		{
			var invItem:InventoryInfo = arr[i];
			if(MystryChest.instance().IsExchangeChest(invItem.id))
			{
				invItem.category = Category.Exchange;
				invItem.useInList = priv_isItemCanUse(invItem.id, invItem.category);
				invItem.description = generateItemDesc(invItem.id);
				//arr.Remove(invItem);
				exchangeTempArr.Add(invItem);
				
				this.GetList(Category.Exchange).Add(invItem);
			}
			else
			{
				if(invItem.category == Category.UnknowItem)
				{
					//_Global.LogWarning("Remove Id : " + invItem.id);
					exchangeTempArr.Add(invItem);
				}
			}
		}
		
		for(var j : int = 0; j < exchangeTempArr.Count;++j)
		{
			arr.Remove(exchangeTempArr[j]);
		}
	}
	
	private function priv_updateCategoryIsUnknowItem()
	{		
		var arr : System.Collections.Generic.List.<InventoryInfo> = this.GetList(Category.UnknowItem);
		var exchangeTempArr : System.Collections.Generic.List.<InventoryInfo> = new System.Collections.Generic.List.<InventoryInfo>();
		for ( var i : int = 0; i != arr.Count; ++i )
		{		
			var invItem:InventoryInfo = arr[i];

			if ( invItem.category != Category.UnknowItem )
				continue;
			if(MystryChest.instance().IsExchangeChest(invItem.id))
			{
				invItem.category = Category.Exchange;
				invItem.useInList = priv_isItemCanUse(invItem.id, invItem.category);
				continue;
			}
			else if(MystryChest.instance().IsMystryChest(invItem.id))
			{
				invItem.category = Category.MystryChest;
				invItem.useInList = priv_isItemCanUse(invItem.id, invItem.category);
				continue;
			}
			else if(MystryChest.instance().IsLevelChest(invItem.id))
			{
				invItem.category = Category.LevelChest;
				invItem.useInList = priv_isItemCanUse(invItem.id, invItem.category);
				continue;
			}
			
			exchangeTempArr.Add(invItem);
//			arr.RemoveAt(i);
//			--i;
		}
		
		for(var j : int = 0; j < exchangeTempArr.Count;++j)
		{
			arr.Remove(exchangeTempArr[j]);
		}
		
		dealExchangeItem();
	}
	
	private function priv_pushToCategory(newItem:InventoryInfo)
	{
		var  category:int = newItem.category;
		newItem.useInList =  priv_isItemCanUse(newItem.id, newItem.category);
		this.GetList(category).Add(newItem);
	}
	
	private function generateItemDesc(_id:int):String
	{
		var itemDes:String = "";
		
		switch(_id)		
		{
			case 916:
				if(seed["serverSetting"] != null)
				{
					itemDes = Datas.getArString("itemDesc."+"i" + _id, [_Global.INT32(seed["serverSetting"]["allianceTeleportLevel"])]);
				}
				break;
			default:
				var newId : String = String.Format("itemDesc.i{0}_1", _id);
				if (Datas.IsExistString(newId))
					itemDes = Datas.getArString(newId);
				else
					itemDes = Datas.getArString("itemDesc.i" + _id);
				break;
		}
		
		return itemDes;		
	}
	
	private var m_coolDownItemTime : System.Collections.Generic.Dictionary.<int, System.DateTime> = new System.Collections.Generic.Dictionary.<int, DateTime>();
	public function GetItemTimeLeft(itemId : int) : int
	{
		if ( !m_coolDownItemTime.ContainsKey(itemId) )
			return -1;
		//var totalSecond : int = m_coolDownItemTime[itemId] - GameMain.unixtime();
		var totalSecond : int = (m_coolDownItemTime[itemId] - System.DateTime.Now).TotalSeconds;
		if ( totalSecond < 0 )
			return 0;
		return totalSecond;
	}

	public function SetItemTimeLeft(itemId : int, totalSecond : int) : void
	{
		//var endTime : long = GameMain.unixtime() + totalSecond * 1000;
		var endTime : System.DateTime = System.DateTime.Now + new System.TimeSpan(0, 0, totalSecond);
		if ( m_coolDownItemTime.ContainsKey(itemId) )
			m_coolDownItemTime[itemId] = endTime;
		else
			m_coolDownItemTime.Add(itemId, endTime);
	}

	public function RemoveItemTimeLeft(itemId : int) : void
	{
		m_coolDownItemTime.Remove(itemId);
	}

	private function priv_FlushTimerItems() : void
	{
		if ( m_coolDownItemTime == null || m_coolDownItemTime.Count == 0 )
			return;
		var curTime : System.DateTime = System.DateTime.Now;
		var needRemoveItems : System.Collections.Generic.List.<int>;
		for ( var items in m_coolDownItemTime )
		{
			if ( items.Value > curTime )
				continue;
			if ( needRemoveItems == null )
				needRemoveItems = new System.Collections.Generic.List.<int>();
			needRemoveItems.Add(items.Key);
		}

		for ( var itemId in needRemoveItems )
		{
			m_coolDownItemTime.Remove(itemId);
			this.subtractItem(itemId);
		}
	}

	public function updateTreasureChest():void
	{		
		treasureChestList.Clear(); 
		var newItem:InventoryInfo;  

		var itemlist : HashObject = Datas.instance().itemlist();
		for(var i:System.Collections.DictionaryEntry in seed["items"].Table)
		{		
			newItem = new InventoryInfo();
			var itemId:int = _Global.INT32((i.Key as String).Split('i'[0])[1]);
			var item:HashObject = itemlist["i" + itemId];
					
			if(item != null && _Global.INT32(item["category"]) == Category.TreasureChest)
			{
				newItem.quant = seed["items"]["i" + itemId] ? _Global.INT32(seed["items"]["i" + itemId]) : 0;
				newItem.quant -= March.instance().itemCountInSurveyList(itemId);
				newItem.id = itemId;
				newItem.useInList = true;
				newItem.category = Category.TreasureChest;
				
				if(newItem.quant > 0)
				{
					treasureChestList.Add(newItem);
				}
			}			
		}
		
		treasureChestList.Sort(SortItem_Basic);
		treasureChestList = ResortList(treasureChestList);
	}
	
	function IsResourceBoostId(id:int):boolean
	{
		for( i in Constant.ResourceBoostIds.GOLD)		
		{
			if(id == i)
				return true;
		}
		
		for(i in Constant.ResourceBoostIds.FOOD)		
		{
			if(id == i)
				return true;
		}
		
		for(i in Constant.ResourceBoostIds.STONE)		
		{
			if(id == i)
				return true;
		}
		
		for(i in Constant.ResourceBoostIds.LUMBER)		
		{
			if(id == i)
				return true;
		}
		
		for(i in Constant.ResourceBoostIds.IRON)		
		{
			if(id == i)
				return true;
		}
		return false;		
	}
	
	public function IsVipItem(itemId:int)
	{
		if((itemId >= 21000 && itemId <= 21002) || itemId>=21501 && itemId<=21509)
		{
			return true;
		}
		return false;
	}
	
	public function Use(itemId:int)
	{
		Use(itemId,true);
	}

	public function Use(itemId:int, itemCnt : int, okCallback : function(int) : void)
	{
		Use(itemId, itemCnt, true, okCallback);
	}

	public function Use(itemId:int,floatMsg:boolean) 
	{
		Use(itemId, 1, floatMsg);
	}
	
	public function Use(itemId:int, itemCnt : int, floatMsg:boolean)
	{
		Use(itemId, itemCnt, floatMsg, null);
	}
	
	public function Use(itemId:int, itemCnt : int, floatMsg:boolean, okCallback : function(int) : void) 
	{
	//	itemId = _Global.INT32(itemId, 10);

		if (IsResourceBoostId(itemId) ) 
		 { // production boosters
			UseBoostProduction(itemId);
		} else if (_Global.IsValueInArray([261, 262, 263,264, 265,271, 272, 273,274,275, 281, 291, 301, 311], itemId)) { // combat boosters
			UseBoostCombat(itemId, false); 			
		} 
		else if(_Global.IsValueInArray([144, 145, 146, 147, 148, 149], itemId))
		{
			UseBosstCollectCarmot(itemId);
		}
		else if (_Global.IsValueInArray([410, 411, 412], itemId))
		 { // combat : march size boosters
			UseBoostMarchSize(itemId);
		} else if (itemId >= 3300 && itemId < 3400) { // combat : heal buff item
			UseHealBuffItem(itemId);
		} else if (itemId >= 3400 && itemId < 3500) {
			UseRationBuffItem(itemId);
		} else if (itemId >= 3500 && itemId < 3600) {
			UseLuckBuffItem(itemId, 1);
		} else if (itemId >= 3600 && itemId < 3700) {
			UseLuckBuffItem(itemId, 2);
		} else if (itemId==4201){
			subtractItem(itemId,itemCnt);
		} 
		else if (_Global.IsValueInArray([501, 502, 503],itemId)) { // random chests
			UseRandomChest(itemId);
		} else if (_Global.IsValueInArray([511, 512, 513, 514],itemId)) { // general boosters
			GetGeneral(itemId);
		} else if (_Global.IsValueInArray([521, 522, 523, 524],itemId)) { // vounteers/units
			Volunteer(itemId);
		} else if( _Global.IsValueInArray([21100, 21101, 21102, 21103],itemId)) { // Alliance Help
			UseAllianceHelp(itemId);
		} else if (itemId >= 2101 && itemId <= 2106) { // court items
			UseAddGems(itemId);
		} else if (itemId > 700 && itemId < 900) { // court items
			UseCourt(itemId);
		} else if (itemId > 1000 && itemId < 1080) { // resources
			UseResource(itemId, itemCnt, okCallback);
			okCallback = null;
		} else if ( (itemId >= 10000 && itemId < 20000) || MystryChest.instance().IsMystryChest(itemId)) { // item chests
			UseItemChest(itemId,itemCnt,floatMsg);
		}
		else if (itemId >= 20500 && itemId < 20600)
		{
			UseItemHeroUnlock(itemId);
		}
		else if((itemId > 30000 && itemId <= 30100) || MystryChest.instance().IsLevelChest(itemId))
		{
			UseItemLevelChest(itemId);
		}
		else if(itemId >= 50000)
		{
			UseItemTroop(itemId, itemCnt, okCallback);
			okCallback = null;
		}
		else if(IsVipItem(itemId))
		{
			UseVipItem(itemId);
		}		
		else if(itemId == 1202){
			MenuMgr.getInstance().PushMenu("Cities", null, "trans_zoomComp");
		}
		else if(itemId == 2501){
			UseItemBonusTroop(itemId);
		}
        else if (shadowGemItemRanges.Contains(itemId))
        {
            UseAddShadowGems(itemId);
        }
		else if (itemId >= 6100 && itemId < 6600)
		{
			UnlockAllianceEmblem(itemId);
		}
		else if(itemId >= 47200 && itemId <= 47299)
		{
			decorationUnlock("avatar", itemId);
		}
		else if(itemId >= 47300 && itemId <= 47399)
		{
			decorationUnlock("chat", itemId);
		}
		else if(itemId >= 1300 && itemId <= 1399)
		{
			KBN.HeroRelicManager.instance().addRelic(itemId);
		}
		else
		{
			if ( priv_UseItemWithItemID(itemId) )
				return;
			switch (itemId) {
			case 351:
			case 352:
			case 353:
				Fertilize(itemId);
				break;
			case 355:
				Hypnotize();
				break;
			case 599:
		//		Modal.hideModal();
		//		FortunasGamble.renderFortunasGamblePage();
				MenuMgr.getInstance().PushMenu("GambleMenu",null);
				break;
			case 901:
			case 903:
			case 904:
			case 905:		
				UsePeaceDove(itemId);
				break;
			case 911:
				UseTeleportProvince(itemId);
				break;
			case 912:
			case 915:
			case 916:
				UseTeleport(itemId);
				break;
			case 922:
				ChangeName();
				break;
			case 923:
				RenameCity();
				break;
			case 942:
				UnpackFountainPack();
				break;
			case 3201: // Titanium Map
			case 3202: // Graphene Map
				UseSRMap(itemId);
				break;
			case 2411: // Merlin's Mirror
				ChangeAvatar();
				break;
			}
		}

		if ( okCallback != null )
			okCallback(1);
	}

	private function priv_UseItemWithItemID(itemId : int) : boolean
	{
		//var itemId : int = data.id;
		var cmdHireKnight : String = "hireknight.php";
		var cmdUpgradeBuilding : String = "upgradeBuilding.php";
		var cmdBatchUpgradeBuilding : String = "useItem.php";
		var cmdString : String = null;
		switch ( itemId )
		{
		case 47000:
		case 47001:
		case 47002:
		case 47003:
		case 47004:
		case 47005:
		case 47006:
		case 47007:
		case 47008:
		case 47009:
			cmdString = cmdHireKnight;
			break;
		case 48000:
		case 48010:
		case 48020:
		case 48030:
			cmdString = cmdUpgradeBuilding;
			break;
		case 48201: // legecy building crew
		case 48202:
		case 48203:
		case 48211:
		case 48212:
		case 48213:
			cmdString = cmdBatchUpgradeBuilding;
			break;
		}

		if ( cmdString == null )
			return false;
		
		var useOK : Function = function(result : HashObject)
		{
			if ( result["ok"].Value  )
			{
				var myItems : MyItems = MyItems.instance();
				myItems.subtractItem(itemId);
				if ( cmdString == cmdUpgradeBuilding )
					priv_updateBuildUpgradeInfo(result);
				else if ( cmdString == cmdHireKnight )
					priv_updateKnight(result);
				else if ( cmdString == cmdBatchUpgradeBuilding )
					priv_updateBatchBuildUpgradeInfo(result);				
			}
		};
		//var useItem : Function = function()
		//{
		var finalForm:WWWForm = new WWWForm();
		var cityID:int = GameMain.instance().getCurCityId();
		finalForm.AddField("cityId", cityID);
		finalForm.AddField("itemId", itemId);
		if ( cmdString == cmdBatchUpgradeBuilding) {
			finalForm.AddField("itemQty", "1"); // reverse for batch use
			finalForm.AddField("task", "building_upgrade");
			
			if (itemId == 48202 || itemId == 48203) { // require confirm if beginner protection will be cancelled
				var seed : HashObject = GameMain.instance().getSeed();
				var curCity : int = GameMain.instance().getCurCityId();
				var castleLevel = _Global.INT32(seed["buildings"]["city"+curCity]["pos0"][_Global.ap + "1"]);
				if ( castleLevel == 4 &&
					_Global.INT64(seed["player"]["beginnerProtectionExpireUnixTime"]) > GameMain.unixtime() ) {
					var content:String = Datas.getArString("ModalBuild.CastleUpgrade");
					
					var confirmDialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		
					confirmDialog.setLayout(600,320);		
					confirmDialog.setContentRect(70,75,0,140);
					confirmDialog.setDefaultButtonText(); 
					
					MenuMgr.getInstance().PushConfirmDialog(content, "", function() {
						MenuMgr.getInstance().PopMenu("");
						UnityNet.DoRequest(cmdString, finalForm, useOK, null);
					}, null);
					
					return true;
				}
			}
			
		}
		UnityNet.DoRequest(cmdString, finalForm, useOK, null);
		return true;
		//};
		//btnSelect.OnClick = useItem;
	}

	private function priv_updateBuildUpgradeInfo(result : HashObject)
	{
		var dats : Datas = Datas.instance();
		var seed:HashObject = GameMain.instance().getSeed();
		var upgradeBuildInfo : _UpgradeBuildInfo = new _UpgradeBuildInfo();
		JasonReflection.JasonConvertHelper.ParseToObjectOnce(upgradeBuildInfo, result["info"]);
		//	add notice msg
		var buildName : String = dats.getArString("buildingName.b" + upgradeBuildInfo.buildingType.ToString());
		var noticeMsg : String = String.Format(dats.getArString("ToasterPrompt.DivineUpgradeUsed"), buildName);
		MenuMgr.getInstance().PushMessage(noticeMsg); 

		var bElement:BuildingQueueMgr.QueueElement = BuildingQueueMgr.instance().first(upgradeBuildInfo.cityId);
		if ( bElement != null && bElement.slotId == upgradeBuildInfo.buildingPosition )
		{
			bElement.level = upgradeBuildInfo.buildingLevel;
			bElement.endTime = 0;
			BuildingQueueMgr.instance().update();
			return;
		}
		//var cityId : int = _Global.INT32(result
		var buildingSeed : HashObject = seed["buildings"];
		if ( buildingSeed == null )
			return;
		var citySeed : HashObject = buildingSeed["city" + upgradeBuildInfo.cityId.ToString()];
		if ( citySeed == null )
			return;
		var buildSeed : HashObject = citySeed["pos" + upgradeBuildInfo.buildingPosition.ToString()];
		if ( buildSeed == null )
			return;
		buildSeed[_Global.ap + "0"].Value = upgradeBuildInfo.buildingType.ToString();
		buildSeed[_Global.ap + "1"].Value = upgradeBuildInfo.buildingLevel.ToString();
		buildSeed[_Global.ap + "2"].Value = upgradeBuildInfo.buildingPosition.ToString();
		buildSeed[_Global.ap + "3"].Value = upgradeBuildInfo.buildingId.ToString();
		var gameMain : GameMain = GameMain.instance();
		gameMain.onBuildingFinish(upgradeBuildInfo.buildingPosition, upgradeBuildInfo.buildingType, upgradeBuildInfo.buildingLevel, -1);
	}
	
	private function priv_updateBatchBuildUpgradeInfo(result : HashObject)
	{
		var seed : HashObject = GameMain.instance().getSeed();
		
		// get array of upgradeBuildInfo from result
		var upgradeBuildInfos : Array = new Array(result["info"].Table.Count);
		if (null == upgradeBuildInfos)
			return;
		
		SoundMgr.instance().PlayEffect( "toast", /*TextureType.AUDIO*/"Audio/");
		MenuMgr.getInstance().PushMessage(Datas.instance().getArString("ToastMsg.UpgradeSucceed"));
		
		var buildingSeed : HashObject = seed["buildings"];
		if (null == buildingSeed)
			return;
			
		var gameMain : GameMain = GameMain.instance();
		var queueMgr : BuildingQueueMgr = BuildingQueueMgr.instance();
		for (var i:int = 0; i < upgradeBuildInfos.length; i++)
		{
			var info : _UpgradeBuildInfo = new _UpgradeBuildInfo();
			JasonReflection.JasonConvertHelper.ParseToObjectOnce(info, result["info"][_Global.ap + i]);
			upgradeBuildInfos[i] = null;
			
			// check & finish if this building is upgrading in queue
			if (queueMgr.finish(info.cityId, info.buildingPosition)) 
				continue;
			
			upgradeBuildInfos[i] = info;
			
			var slot : HashObject = buildingSeed["city" + info.cityId]["pos" + info.buildingPosition];

			if (null == slot && info.buildingPosition == 1)
			{
				var newtab:System.Collections.Hashtable = new System.Collections.Hashtable();
				newtab.Add(_Global.ap + "0", "0");
				newtab.Add(_Global.ap + "1", "0");
				newtab.Add(_Global.ap + "2", "0");
				newtab.Add(_Global.ap + "3", "0");
				slot = new HashObject(newtab);
				buildingSeed["city" + info.cityId]["pos" + info.buildingPosition] = slot;
			}
			
			slot[_Global.ap + "0"].Value = info.buildingType.ToString();
			slot[_Global.ap + "1"].Value = info.buildingLevel.ToString();
			slot[_Global.ap + "2"].Value = info.buildingPosition.ToString();
			slot[_Global.ap + "3"].Value = info.buildingId.ToString();
			
			// buff for castle
			if (0 == info.buildingPosition && 5 == info.buildingLevel)
			{
				var curTime:long = GameMain.unixtime();
				
				if(_Global.parseTime(seed["player"]["beginnerProtectionExpireUnixTime"]) > curTime)
				{
					seed["player"]["beginnerProtectionExpireUnixTime"].Value = 0;
					BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_FRESHMAN, -1);
				}
			}

			// check conditions with this building
			BuildingDecMgr.getInstance().checkIsConditionReach(info.buildingType);
			
			// TODO send notifications to MenuMgr if needed
		}
		
		for (i = 0; i < upgradeBuildInfos.length; i++)
		{
			info = upgradeBuildInfos[i] as _UpgradeBuildInfo;
			// update citycontroller and play anim&sound effects here
			// also the seed updating and the quest checking for buildings will be trigged
			if( null != info && info.cityId == gameMain.getCurCityId() )
				gameMain.onBuildingFinish(info.buildingPosition, info.buildingType, info.buildingLevel, -1);
		}
		
		queueMgr.update();
		
	}

	@JasonReflection.JasonDataAttribute(SearchInfo = JasonReflection.JasonDataAttribute.SearchType.All)
	private class _UpgradeBuildInfo
	{
		var buildingId : int;
		var buildingPosition : int;
		var buildingType : int;
		var buildingLevel : int;
		var buildingStatus : int;
		var cityId : int;
	}

	private function priv_updateKnight(result : HashObject)
	{
		var updateSeed : UpdateSeed = UpdateSeed.instance();
		//if(  result["knights"] != null )
		//{	//	no test.
		//	updateSeed.addKnights(result["knights"]);
		//}
		//else
		var knightName : String = null;
		var knightNode : HashObject = result["info"];
		if ( knightNode != null && knightNode["knightId"] != null )
		{
			var cityID:int = GameMain.instance().getCurCityId();
			var knightId : int = _Global.INT32(knightNode["knightId"]);
			var nodeKnights : HashObject = new HashObject();
			var nodeCity : HashObject = new HashObject();
			nodeKnights["city" + cityID.ToString()] = nodeCity;
			nodeCity["knt" + knightId.ToString()] = knightNode;
			updateSeed.addKnights(nodeKnights);
			if ( knightNode["knightName"] != null )
				knightName = knightNode["knightName"].Value.ToString();
		}
		var seed:HashObject = GameMain.instance().getSeed();		
		GearManager.Instance().GearKnights.Parse(seed);

		if ( knightName != null )
		{
			var dats : Datas = Datas.instance();
	    	var curCityOrder:int = GameMain.instance().getCurCityOrder();
	    	var knightTrueName : String = General.singleton.getKnightShowName(knightName, curCityOrder);
	    	var noticeMsg : String = String.Format(dats.getArString("ToasterPrompt.PumpkinKnightUsed"), knightTrueName);
			MenuMgr.getInstance().PushMessage(noticeMsg); 
		}
	}

	private function UseItemLevelChest(id:int):void
	{
		if(MystryChest.instance().GetLevelOfChest(id) > _Global.INT32(seed["player"]["title"].Value))
		{
			var errorMes:String = Datas.getArString("MessagesModal.LevelUpChests", [MystryChest.instance().GetLevelOfChest(id)]);
			ErrorMgr.instance().PushError("", errorMes);					
		}
		else
		{
			UseItemChest(id, true);
		}
	}	
	function UseAllianceHelp( itemId : int )
	{
		// Can't play here
		
	}
	
	function UseBoostProduction(itemId:int)
	 {
	//	itemId = _Global.INT32(itemId, 10);
		var curCid = GameMain.instance().getCurCityId();
		var okFunc = function(result:HashObject)
		{	
			if (result["ok"].Value) {
				var seed:HashObject = GameMain.instance().getSeed();
				var expireTime:long = _Global.INT64(result["expire"]);
		//		var	modalShopMessage = $("modal_shop_message");
				
				if (seed["playerEffects"]["length"] == null|| seed["playerEffects"]["length"].Value == 0) {
					seed["playerEffects"] = new HashObject();
				}
				if (_Global.IsValueInArray( Constant.ResourceBoostIds.GOLD,itemId)) { // silver
					seed["bonus"]["bC1000"]["bT1001"].Value = expireTime;
				} else if (_Global.IsValueInArray(Constant.ResourceBoostIds.FOOD,itemId)) { // food
					seed["bonus"]["bC1100"]["bT1101"].Value = expireTime;
				} else if (_Global.IsValueInArray(Constant.ResourceBoostIds.LUMBER,itemId)) { // lumber
					seed["bonus"]["bC1200"]["bT1201"].Value = expireTime;
				} else if (_Global.IsValueInArray(Constant.ResourceBoostIds.STONE,itemId)) { // stone
					seed["bonus"]["bC1300"]["bT1301"].Value = expireTime;
				} else if (_Global.IsValueInArray(Constant.ResourceBoostIds.IRON,itemId)) { // ore
					seed["bonus"]["bC1400"]["bT1401"].Value = expireTime;
				}

				subtractItem(itemId);
				var msg:String = Datas.instance().getArString("ToastMsg.BoostSuccess");
				MenuMgr.getInstance().PushMessage(msg);

				if (result["updateSeed"]) {
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}

				
				//----------------------------------------------------------------------------//
				BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_RESOURCE, itemId);
				//----------------------------------------------------------------------------//
				
			//	MenuMgr.getInstance().SwitchMenu("MainChrom", null);
				
				MenuMgr.getInstance().sendNotification(Constant.Notice.BOSST_RESOURCE, null);
				
			} else {
			//errordialog	Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
			}
		};
//		subtractItem(itemId);
		UnityNet.BoostProduction(itemId, curCid, okFunc, null);
	}
	
	function UseBosstCollectCarmot(itemId:int)
	{
		var okFunc = function(result:HashObject)
		{
			if (result["ok"].Value) 
			{
				var seed:HashObject = GameMain.instance().getSeed();
				var expireTime:long = result["expire"].Value;
				//	modalShopMessage = $("modal_shop_message");

				if (!seed["playerEffects"]) 
				{
					seed["playerEffects"] = new HashObject();
				}

				var isCarmotCollect : boolean = false;
				if (_Global.IsValueInArray([144, 145],itemId)) 
				{
					isCarmotCollect = true;
					switch(itemId)
					{
						case 144:
						case 145:
							seed["bonus"]["bC3000"]["bT3001"].Value = "" + expireTime;
							break;
						default:
							break;
					}				
				} 
				else if (_Global.IsValueInArray([146, 147],itemId)) 
				{
					isCarmotCollect = true;
					switch(itemId)
					{
						case 146:
						case 147:
							seed["bonus"]["bC3000"]["bT3002"].Value = "" + expireTime;
							break;
						default:
							break;
					}
				}
				else if (_Global.IsValueInArray([148, 149],itemId)) 
				{
					isCarmotCollect = false;
					switch(itemId)
					{
						case 148:
						case 149:
							seed["bonus"]["bC3000"]["bT3003"].Value = "" + expireTime;
							break;
						default:
							break;
					}
				}

				subtractItem(itemId);

				if (result["updateSeed"]) {
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}

				GameMain.instance().seedUpdate(true);
				
				if(isCarmotCollect)
				{
					BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_CARMOTCOLLECT, itemId);
				}
				else
				{
					BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_RESOURCECOLLECT, itemId);
				}
				
				MenuMgr.getInstance().sendNotification(Constant.Action.CLOSE_MARCHCARMOTBUFF_MENU, null);
				
				var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
				MenuMgr.getInstance().PushMessage(msg);
			}
		};
		
		var errorFunc:Function = function(errorMsg:String, errorCode:String)
		{
			ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
		};
		
		UnityNet.BoostCollectCarmot(itemId, okFunc, errorFunc);		
	}
	
	public function UseBoostCombat(itemId:int,usedOkFunc:System.Action.<int>)
	{
		var curCid = GameMain.instance().getCurCityId();
		var okFunc = function(result:HashObject){
			if (result["ok"].Value) {
				var seed:HashObject = GameMain.instance().getSeed();
				var expireTime:long = result["expire"].Value;
				//	modalShopMessage = $("modal_shop_message");

				if (!seed["playerEffects"]) {
					seed["playerEffects"] = new HashObject();
				}

				if (_Global.IsValueInArray([261, 262, 263,264,265, 281, 291],itemId)) {
					switch(itemId)
					{
						case 261:
						case 262:
							seed["bonus"]["bC2600"]["bT2601"].Value = "" + expireTime;
							break;
						case 263:
							seed["bonus"]["bC2600"]["bT2604"].Value = "" + expireTime;
							break;
						case 264:
							seed["bonus"]["bC2600"]["bT2605"].Value = "" + expireTime;
							break;
						case 265:
							seed["bonus"]["bC2800"]["bT2801"].Value = "" + expireTime;
							break;	
						case 281:
							seed["bonus"]["bC2600"]["bT2602"].Value = "" + expireTime;
							break;
						case 291:
							seed["bonus"]["bC2600"]["bT2603"].Value = "" + (_Global.INT32(seed["bonus"]["bC2600"]["bT2603"].Value) + 1);
							break;
						default:
							break;
					}
					
				} else if (_Global.IsValueInArray([271, 272, 273,274, 275,301, 311],itemId)) {
					switch(itemId)
					{
						case 271:
						case 272:
							seed["bonus"]["bC2700"]["bT2701"].Value = "" + expireTime;
							break;
						case 273:
							seed["bonus"]["bC2700"]["bT2704"].Value = "" + expireTime;
							break;
						case 274:
							seed["bonus"]["bC2700"]["bT2705"].Value = "" + expireTime;
							break;
						case 275:
							seed["bonus"]["bC2900"]["bT2901"].Value = "" + expireTime;
							break;
						case 301:
							seed["bonus"]["bC2700"]["bT2702"].Value = "" + expireTime;
							break;
						case 311:
							seed["bonus"]["bC2700"]["bT2703"].Value = "" + (_Global.INT32(seed["bonus"]["bC2700"]["bT2703"].Value) + 1);
							break;
						default:
							break;
					}
				}

				subtractItem(itemId);

				if (result["updateSeed"]) {
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}
//				Boosts.instance().update_boosts();
				
				//UpdateSeed.instance().update_seed_ajax(true,null);
				GameMain.instance().seedUpdate(true);
				//----------------------------------------------------------------------------//
				BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_COMBAT, itemId);
				//----------------------------------------------------------------------------//

				if(usedOkFunc != null)
				{
					usedOkFunc(itemId);
				}
			} 
			else 
			{
			}
		};
//		subtractItem(itemId);
		UnityNet.BoostCombat(itemId, curCid, okFunc, null);		
	}
	
	function UseBoostCombat(itemId:int, stayOpen:boolean)
	{
		var okFunc:System.Action.<int> = function(itemId:int){
			var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
			MenuMgr.getInstance().PushMessage(msg);
		};
		UseBoostCombat(itemId,okFunc);
	}
	
	function UseBoostMarchSize(itemId:int)
	{
		UnityNet.BoostMarchSize(itemId, function(result:HashObject) {
			if (_Global.GetBoolean(result["ok"])) {
				
				var seed:HashObject = GameMain.instance().getSeed();
				var size:int = _Global.INT32(result["size"]);
				var expireTime:long = _Global.INT64(result["expire"]);
				
				seed["bonus"]["bC410"][_Global.ap + 0].Value = size.ToString();
				seed["bonus"]["bC410"][_Global.ap + 1].Value = expireTime.ToString();
			
				subtractItem(itemId);
				
				BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_COMBAT, itemId);
				
				var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
				MenuMgr.getInstance().PushMessage(msg);
			}
		});
//			subtractItem(itemId);
	}
	
	function UseHealBuffItem(itemId:int)
	{
		UnityNet.UseHealBuffItem(itemId, function(result:HashObject) {
			if (_Global.GetBoolean(result["ok"])) {
				
				var seed:HashObject = GameMain.instance().getSeed();
				var size:int = _Global.INT32(result["size"]);
				var expireTime:long = _Global.INT64(result["expire"]);
				
				seed["bonus"]["bC3300"][_Global.ap + 0].Value = size.ToString();
				seed["bonus"]["bC3300"][_Global.ap + 1].Value = expireTime.ToString();
			
				subtractItem(itemId);
				
				BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_COMBAT, itemId);
				
				var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
				MenuMgr.getInstance().PushMessage(msg);
			}
		});
//			subtractItem(itemId);
	}
	
	function UseRationBuffItem(itemId:int)
	{
		var form:WWWForm = new WWWForm();
		var cityID:int = GameMain.instance().getCurCityId();
		form.AddField("itemId", itemId);
		form.AddField("itemQty", 1);
		form.AddField("cityId", cityID);
		
		UnityNet.UseRationBuffItem(form, function(result:HashObject) {
			if (_Global.GetBoolean(result["ok"])) {
				
				var seed:HashObject = GameMain.instance().getSeed();
				var cityOrder:int = _Global.INT32(result["info"]["cityOrder"]);
				var expireTime:long = _Global.INT64(result["info"]["expireTime"]);
				
				seed["bonus"]["bC3400"]["bT340" + cityOrder].Value = expireTime.ToString();
			
				subtractItem(itemId);
				
				BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_RESOURCE, itemId);
				UpdateSeed.singleton.update_seed_ajax();
				
				var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
				MenuMgr.getInstance().PushMessage(msg);
			}
		});
//			subtractItem(itemId);
	}
	
	function UseLuckBuffItem(itemId:int, type:int)
	{
		var form:WWWForm = new WWWForm();
		var cityID:int = GameMain.instance().getCurCityId();
		form.AddField("itemId", itemId);
		form.AddField("luckType", type);
		form.AddField("itemQty", 1);
		
		UnityNet.UseLuckBuffItem(form, function(result:HashObject) {
			if (_Global.GetBoolean(result["ok"])) {
				
				var seed:HashObject = GameMain.instance().getSeed();
				var returnType:int = _Global.INT32(result["info"]["luckType"]);
				var expireTime:long = _Global.INT64(result["info"]["expireTime"]);
				
//				if (returnType == type)
//					return;
				
				seed["bonus"]["bC3500"]["bT350" + returnType].Value = expireTime.ToString();
			
				subtractItem(itemId);
				
				BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_COMBAT, itemId);
				
				var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
				MenuMgr.getInstance().PushMessage(msg);
			}
		});
//			subtractItem(itemId);
	}
	
	function UseRandomChest(itemId:int)
	 {
	 	var curCid:int = GameMain.instance().getCurCityId();
		var okFunc:Function = function(result:HashObject)
		{
			if (result["ok"].Value) {
				subtractItem(itemId);
				useChestGain(result["medals"], itemId);
				var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
				MenuMgr.getInstance().PushMessage(msg);
			} else {
			//	Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
			}
		};
		
		UnityNet.UseRandomChest(itemId, curCid, okFunc, null);
//			subtractItem(itemId);
	}
	
	function useChestGain(items:HashObject, itemId:int) 
	{
		useChestGain(items,itemId,true);
	}
	function useChestGain(items:HashObject, itemId:int,floatMsg:boolean) 
	{
		var itemKeys:Array = _Global.GetObjectKeys(items);
		for(var i:int = 0; i<itemKeys.length;i++)
		{
			var chestItemId:int = _Global.INT32((itemKeys[i] as String).Split('i'[0])[1]);
			var quant:int = _Global.INT32(items[itemKeys[i]]);
			this.AddItem(chestItemId, quant);
		}
		if(floatMsg)
		{
			var msg:String = Datas.instance().getArString("ToastMsg.UseChest");
			if (itemId >= 64000 && itemId < 65000)
			{
				msg = Datas.getArString("ToastMsg.UseGearChest");
			}
			
			MenuMgr.getInstance().PushMessage(msg);
		}

	}
	function GetGeneral(itemId:int) 
	{
	/*	var msghtml = [];
		msghtml.push("<div class='appointknightwrap'>");
		msghtml.push("<center><div class='name'><b>" + g_js_strings.modal_knight_info.knightname + "</b></div>");
		msghtml.push("<div class='knightname'><div><input id='knightname' value='' maxlength='15' /></div></div>");
		msghtml.push("<div class='errorbox'><div id='nameError' style='display:none' font-color='red'>" + g_js_strings.modal_knight_info.entername + "</div></div>");
		msghtml.push("<br/><div class='btnlink clearfix' ><a  class='button25' onclick='MyItems.useGeneral(" + itemId + ");return false;'><span>" + g_js_strings.modal_appoint.appointknight + "</span></a></div></center>");
		msghtml.push("</div></center>");
		msghtml.push("</div>");

		Modal.showModal(Constant.Modal.MEDIUM, 500, 10, 10, g_js_strings.modaltitles.appointknight, msghtml.join(""));*/
	}
	
	function Volunteer(itemId:int) 
	{
		var curCid = GameMain.instance().getCurCityId();
		var okFunc = function(result:HashObject){
			if (result["ok"].Value) {
				var units = result["unitsGained"];
		/*		units.each(function (pair) {
					var unitId = pair.key.substring(4);
					Barracks.addUnitsToSeed(unitId, pair.value);
				});*/

				subtractItem(itemId);

				if (result["updateSeed"]) {
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}
				volunteerGain(result["unitsGained"], itemId);
			} else {
			//error dialog	Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
			}
		};
//			subtractItem(itemId);
		UnityNet.Volunteer(itemId,curCid,okFunc,null);
	/*	AjaxCall.gPostRequest('volunteee.php', params, function (result) {
			
		});*/
	}
	function volunteerGain(unitgain, itemId) {
	// show ui
	/*	var msghtml = [];
		var	units = Object.keys(unitgain);
		var	uid;
		var	i;
		msghtml.push("<div class='volunteerpackagelist'>");
		msghtml.push("<div><b>" + g_js_strings.modal_volunteer_gain.unitsgained + "</b></div>");
		msghtml.push("<table cellpadding='0' cellspacing='0'><tbody>");
		for (i = 0; i < units.length; i++) {
			uid = units[i].split("unit")[1];
			msghtml.push("<tr><td><div class='pic px30 units unit_" + uid + "'></div>");
			msghtml.push("</td><td class='unm'>");
			msghtml.push(arStrings.unitName['u' + uid]);
			msghtml.push("</td><td class='gain'>");
			msghtml.push(unitgain[units[i]]);
			msghtml.push("</td></tr>");
		}
		msghtml.push("</tbody></table>");
		msghtml.push("<div class='btnlink clearfix'><a  class='button25' onclick='Modal.hideModal();return false;'><span>" + g_js_strings.commonstr.ok + "</span></a></div>");
		msghtml.push("</div>");
		Modal.hideModal();
		Modal.showModal(Constant.Modal.MEDIUM, 500, 10, 10, arStrings.itemName['i' + itemId], msghtml.join(""));*/
	}
	function UseCourt(itemId:int) {
	//	itemId = _Global.INT32(itemId, 10);
	/*	var params = {
				item: itemId,
				setflag: $('modal_item_' + itemId).select('.equiptext')[0].innerHTML === g_js_strings.commonstr.equip ? 1 : 2
			};

		AjaxCall.gPostRequest('courtSelectItem.php', params, function (result) {
			var startItem = 0,
				endItem = 899,
				i, index;
			if (result.ok) {
				if (params.pflag === 1) {
					if (itemId > 800 && itemId < 860) {
						startItem = itemId - itemId % 10;
						for (i = startItem; i < (startItem + 10); i++) {
							index = seed.courtItems.indexOf(i.toString());
							if (index >= 0) {
								delete seed.courtItems[index];
								$('modal_item_' + i).select('.equiptext')[0].innerHTML = g_js_strings.commonstr.equip;
							}
						}
					} else if (itemId >= 860 && itemId < 900) { // international flags
						startItem = 860;
						for (i = startItem; i <= endItem; i++) {
							index = seed.courtItems.indexOf(i.toString());
							if (index >= 0) {
								delete seed.courtItems[index];
								$('modal_item_' + i).select('.equiptext')[0].innerHTML = g_js_strings.commonstr.equip;
							}
						}
					}
					$('modal_item_' + itemId).select('.equiptext')[0].innerHTML = g_js_strings.commonstr.unequip;
				} else {
					index = seed.courtItems.indexOf(itemId.toString());
					delete seed.courtItems[index];
					$('modal_item_' + itemId).select('.equiptext')[0].innerHTML = g_js_strings.commonstr.equip;	
				}
				update_bdg();
			} else {
				Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
			}
		});*/
	}
	
	private function UseResource(itemId:int, itemCnt:int, okCallback : function(int) : void) 
	{
		if (itemId > 1000 && itemId < 1080)
		 {
		 	
		 	var curCid:int = GameMain.instance().getCurCityId();
			var okFunc = function(result:HashObject)
			{
				Resource.instance().addToSeed(result["rtype"].Value, result["amt"].Value, curCid);			
//				_Global.Log("<color=#ff0000>count="+result["itemCount"].Value+"</color>");
				//var itemCount:int=_Global.INT32(result["itemCount"].Value); 				
				//priv_setItemCount(itemId,itemCount);
				
				subtractItem(itemId, itemCnt);
//				if (itemId >= 1070 && itemId < 1080){//carmot resource
//					subtractItem(itemId, itemCnt);
//				}
				if (result["updateSeed"]) {
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}
				var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
				MenuMgr.getInstance().PushMessage(msg);
				MenuMgr.getInstance().sendNotification(Constant.Notice.ADD_RESOURCE, null);
				if ( okCallback != null )
					okCallback(itemCnt);
			};
//			var	errorFunc:Function = function(msg:String, errorCode:String){
//				var errorMsg= Datas.getArString("Error.err_" + errorCode);
//				var array=msg.Split("-"[0]);
//				var count=array[array.length-1];
//				if(errorCode=="4"){
//					priv_setItemCount(itemId, parseInt(count));
//				}else{
//					subtractItem(itemId, 0);
//				}
////					MenuMgr.getInstance().PopMenu("");
//				if ( okCallback != null )
//					okCallback(itemCnt);//close batchUse window
//				_GlobalGlobal.Log("<color=#ff0000>error</color>errorCode="+errorCode+"errorMsg:"+errorMsg+",result count="+count);
//				ErrorMgr.singleton.PushError("", errorMsg, true, "", null);
//			};
			if(UnityNet.GetNetState()>0) {
//				if (itemId < 1070 || itemId >= 1080){
//					subtractItem(itemId, itemCnt);
//				}
				UnityNet.UseResourceItem(itemId, itemCnt, curCid, okFunc, null);
			}else{
			
			}
				

		}
	}
	
	function UseAddGems(itemId:int) 
	{
	//	itemId = _Global.INT32(itemId, 10);
		if (itemId >= 2101 && itemId <= 2106)
		 {
		 	var curCid:int = GameMain.instance().getCurCityId();
			var okFunc = function(result:HashObject)
			{
				if (result["ok"].Value) 
				{
					if (result["gems"]) 
					{
						Payment.instance().AddGems(_Global.INT32(result["gems"].Value));
					}
	
					subtractItem(itemId);
					
					var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
					MenuMgr.getInstance().PushMessage(msg);
			
					} 
					else 
					{
						//	Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
					}
			};
//				subtractItem(itemId);
			UnityNet.UseItem2AddGems(itemId, curCid, okFunc, null);	
		}
	}
    
    // Caller should guarantee the validity of 'itemId'
    private function UseAddShadowGems(itemId : int) {
        var okFunc : Function = function(result : HashObject) {
            if (!Convert.ToBoolean(result["ok"].Value)) {
                return; 
            }
            if (result["addedShadowGems"] != null) {
                var addedShadowGems : int = _Global.INT32(result["addedShadowGems"].Value);
                Payment.instance().AddShadowGems(addedShadowGems);
            }
            subtractItem(itemId);
            var msg : String = Datas.instance().getArString("ToastMsg.UseItem");
            MenuMgr.getInstance().PushMessage(msg);
        };
        
        var url : String = "depositShadowGems.php";
        var form : WWWForm = new WWWForm();
        form.AddField("itemId", itemId);
//        	subtractItem(itemId);
        UnityNet.DoRequest(url, form, okFunc, null);
    }
	
	private function UseItemTroop(itemId:int, itemCnt : int, okCallback : function(int) : void):void
	{
	//	itemId = _Global.INT32(itemId, 10);
		if (itemId < 50000)
			return;

	 	var curCid:int = GameMain.instance().getCurCityId();
		var okFunc = function(result:HashObject)
		{
			subtractItem(itemId, itemCnt);

			if (result["updateSeed"])
			{
				UpdateSeed.instance().update_seed(result["updateSeed"]);
			}

			var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
			var typeId:int = _Global.INT32(result["troopType"].Value);
			var amount:long = _Global.INT64(result["amount"].Value);
			var originalCount:long = 0;
			var troopList:Array;

			UpdateSeed.instance().followCheckQuest(2);

			if(typeId <50)
			{
				if(seed["units"]["city" + curCid]["unt" + typeId])
				{
					var temp:HashObject = seed["units"]["city" + curCid]["unt" + typeId];
					if(temp!=null && temp!="")
					{
						seed["units"]["city" + curCid]["unt" + typeId] = new HashObject(amount);
					}
					troopList = Barracks.instance().GetTroopList();
					for(var i:int = 0; i< troopList.length; i++)
					{
						if((troopList[i] as Barracks.TroopInfo).typeId == typeId)
						{
							(troopList[i] as Barracks.TroopInfo).owned = amount;
							break;
						}								
					}
					MenuMgr.getInstance().sendNotification(Constant.Notice.Add_TROOP_ITEM, null);
				}
			}
			else
			{
				if(seed["fortifications"]["city" + curCid]["fort" + typeId])
				{
					var forttemp:HashObject = seed["fortifications"]["city" + curCid]["fort" + typeId];
					if(forttemp!=null && forttemp!="")
					{
						seed["fortifications"]["city" + curCid]["fort" + typeId] = new HashObject(amount);
					}
					troopList = Walls.instance().GetTroopList();
					for( var f:int = 0; f < troopList.length; f++ )
					{								
						if((troopList[f] as Walls.TroopInfo).typeId == typeId)
						{
							(troopList[f] as Walls.TroopInfo).owned = amount;
							break;
						}
					}
					MenuMgr.getInstance().sendNotification(Constant.Notice.WALL_UNITS_CNT_UP, null);
				}				
			}				

			MenuMgr.getInstance().PushMessage(msg);
			if ( okCallback != null )
				okCallback(itemCnt);
		};	
//		subtractItem(itemId, itemCnt);
		UnityNet.UseTroopItem(itemId, curCid, itemCnt, okFunc, null);
	}
	
	private function UseItemHeroUnlock(itemId : int)
	{
		if (!HeroManager.Instance().Check(false))
		{
			return;
		}
		
		HeroManager.Instance().RequestAddHero(itemId);
	}
	
	private function UseVipItem(itemId:int)
	{
	
	 	var curCid:int = GameMain.instance().getCurCityId();
	 	var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
		var okFunc = function(result:HashObject)
		{
			if (result["ok"].Value) 
			{
				subtractItem(itemId);
				
				if (result["updateSeed"]) 
				{
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}
				MenuMgr.getInstance().PushMessage(msg);
			}
		};
//		subtractItem(itemId);
		UnityNet.UseVipItem(itemId, curCid, okFunc, null);
	}
	
	private function HasEnoughGearStorage(itemId:int):boolean
	{
		var newItem:InventoryInfo = null;
		for(var i:int = 0; i < chestList.Count; i++)
		{
			if ((chestList[i] as InventoryInfo).id == itemId)
			{
				newItem = (chestList[i] as InventoryInfo);
				break;
			}
		}
		if (null != newItem && newItem.mayDropGear && !GearManager.Instance().HasEnoughGearStorage())
		{
			var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
			dialog.setLayout(600, 380);
			dialog.setTitleY(60);
			dialog.setContentRect(70, 140, 0, 100);
			dialog.SetCancelAble(false);
			dialog.setDefaultButtonText();
			
			var noFunc:Function = function(resultDatas:Array)
			{
				if (null != resultDatas)
				{
					var infoDatas:Array = new Array();
					for (var iCondition:SystemCfgCondition in resultDatas)
					{
						var tType:int = _Global.INT32(iCondition.type);
						if (tType == SystemCfgConditionType.BuildingLevel)
						{
							var tBuildingTypeId:int = _Global.INT32(iCondition.key);
							var tBuildingNeedLevel:int = _Global.INT32(iCondition.val);
							var tBuildingName:String = Datas.getArString("buildingName."+"b" + tBuildingTypeId);
							
							infoDatas.Push(tBuildingNeedLevel);
							infoDatas.Push(tBuildingName);
						}
					}
					
					if (infoDatas.Count != 4)
					{
						_Global.Log("Not match the Gear.GearNotUnlock paramters!!!");
					}
					var promptText:String = String.Format(Datas.getArString("Gear.GearNotUnlock"), 
														infoDatas[0], infoDatas[1], infoDatas[2], infoDatas[3]);
					
					dialog.setButtonText(Datas.getArString("Gear.GearNotUnlockButton"), Datas.getArString("Common.Cancel"));									
					MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("Gear.GearNotUnlock"), "", null, null);
				}
			};
			
			var isUnlocked:boolean = GearSysController.CheckIsGearSysUnlocked(null, noFunc);
			if (isUnlocked)
			{
				dialog.setButtonText(Datas.getArString("Gear.StorageFullButton"), Datas.getArString("Common.Cancel"));
				
				var confirmCallback:System.Action = function()
				{
					MenuMgr.getInstance().PopMenu("");
					
					var	slotId:int = Building.instance().getPositionForType(Constant.Building.BLACKSMITH);
					if (slotId == -1)
					{
						ErrorMgr.instance().PushError("", Datas.getArString("MainChrome.researchWarning"));
					}
					else
					{
						Building.instance().openStandardBuilding(Constant.Building.BLACKSMITH, slotId);	
					}
				};
				MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("Gear.StorageFull"), "", confirmCallback, null);
			}
			
			return false;
		}
		
		return true;
	}
	
	function UseItemChest(itemId:int) 
	{
		UseItemChest(itemId,true);
	}
	function UseItemChest(itemId:int,floatMsg:boolean) 
	{
		// LiHaojie 2013.09.22: Add not enough gear storage
		if (!HasEnoughGearStorage(itemId))
			return;
		
		var params = {
				"iid": itemId
			};

		var okFunc:Function = function(result:HashObject){
			if (result["ok"].Value) {
				subtractItem(itemId);
				useChestGain(result["items"], itemId,floatMsg);
				priv_addGearItem(result["gearDrop"]);
				if(MystryChest.instance().IsMystryChest(itemId))
				{
					// LiHaojie 2013.08.26: Add drop gear items, and add "inShop" key
					var data:HashObject = new HashObject({"ID":itemId, "Category":Category.MystryChest, "inShop":false, 
														"subItems":result["items"], 
														"gearDrop":result["gearDrop"]}
														);
					MenuMgr.getInstance().PushMenu("ChestDetail", data, "trans_zoomComp");
				}
				else if(MystryChest.instance().IsLevelChest(itemId))
				{
					var data1:HashObject = new HashObject({"ID":itemId, "Category":Category.LevelChest, "subItems":result["items"]});
					MenuMgr.getInstance().PushMenu("ChestDetail", data1, "trans_zoomComp");					
				}
				
				MenuMgr.getInstance().sendNotification(Constant.Notice.ITEM_USE_CHEST, itemId);
			} else {
			
		//		Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
			}
		};
//			subtractItem(itemId);
			UnityNet.UseItemChest(itemId, okFunc, null);
	}
	function UseItemChest(itemId:int,itemCnt:int,floatMsg:boolean) 
	{
		// LiHaojie 2013.09.22: Add not enough gear storage
		if (!HasEnoughGearStorage(itemId))
			return;
		
		var params = {
				"iid": itemId
			};

		var okFunc:Function = function(result:HashObject) {
			if (result["ok"].Value) {
				subtractItem(itemId,itemCnt);
//				_Global.Log("<color=#ff0000>count="+result["itemCount"].Value+"</color>");
//				priv_setItemCount(itemId, _Global.INT32(result["itemCount"].Value));
				useChestGain(result["items"], itemId,floatMsg);
				priv_addGearItem(result["gearDrop"]);
				if(MystryChest.instance().IsMystryChest(itemId))
				{
					// LiHaojie 2013.08.26: Add drop gear items, and add "inShop" key
					var data:HashObject = new HashObject({"ID":itemId,"itemCnt":itemCnt, "Category":Category.MystryChest, "inShop":false, 
														"subItems":result["items"], 
														"gearDrop":result["gearDrop"]}
														);
					MenuMgr.getInstance().PushMenu("ChestDetail", data, "trans_zoomComp");
				}
				else if(MystryChest.instance().IsLevelChest(itemId))
				{
					var data1:HashObject = new HashObject({"ID":itemId, "Category":Category.LevelChest, "subItems":result["items"]});
					MenuMgr.getInstance().PushMenu("ChestDetail", data1, "trans_zoomComp");					
				}
				
				MenuMgr.getInstance().sendNotification(Constant.Notice.ITEM_USE_CHEST, itemId);
			} else {
			
		//		Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
			}
		};
		
//			var	errorFunc:Function = function(msg:String, errorCode:String,feedback:String){
//				var errorMsg= Datas.getArString("Error.err_" + errorCode);
//				var array=feedback.Split("-"[0]);
//				var count=array[array.length-1];
//				if(errorCode=="4"){
//					priv_setItemCount(itemId, parseInt(count));
//				}else{
//					subtractItem(itemId, 0);
//				}
//
//				_Global.Log("<color=#ff0000>error</color>errorCode="+errorCode+feedback+"errorMsg:"+errorMsg+",result count="+count);
//				ErrorMgr.singleton.PushError("", errorMsg, true, "", null);
//			};
		UnityNet.UseItemChest(itemId,itemCnt, okFunc, null);
//		subtractItem(itemId,itemCnt);
 	}

	private function priv_addGearItem(armsSeed : HashObject)
	{
		if ( armsSeed == null )
			return;
		var gearMgr : GearManager = GearManager.Instance();
		var weaponContain : Weaponry = gearMgr.GearWeaponry;
		for ( var armSeedEntry : DictionaryEntry in armsSeed.Table )
		{
			var armSeed : HashObject = armSeedEntry.Value as HashObject;
			if ( armSeed == null )
				continue;
			var arm : Arm = new Arm();
			arm.Parse(armSeed);
			if ( !arm.IsParseValid() )
				continue;
			weaponContain.AddArm(arm);
		}
	}
	
	function Fertilize(itemId:int) {
		var curCid:int = GameMain.instance().getCurCityId();
		var okFunc = function(result:HashObject){
			if (result["ok"].Value) {
				if (result["updateSeed"]) {
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}

				subtractItem(itemId);
				var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
				MenuMgr.getInstance().PushMessage(msg);
			//	Modal.hideModal();
			//	MyItems.open();	
			//	$("modal_shop_message").innerHTML = arStrings.itemName.i351 + ' used!';
			//	$("modal_shop_message").show();
			} else {
			//	Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
			}
		};
		switch(itemId)
		{
			case 351:
			case 352:
			case 353:
				UnityNet.FertilizePeople(itemId,curCid,okFunc, null);
				break;
			default:
				break;
		}
		
	}
	
	function Hypnotize() {
		var params = {
				"cid": GameMain.instance().getCurCityId()
			};
		var curCid:int = GameMain.instance().getCurCityId();
		var okFunc = function(result:HashObject){
			if (result["ok"].Value) {
				if (result["updateSeed"]) {
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}

				subtractItem(355);
				var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
				MenuMgr.getInstance().PushMessage(msg);

		//		Modal.hideModal();
		//		MyItems.open();	
		//		$("modal_shop_message").innerHTML = arStrings.itemName.i355 + ' used!';
		//		$("modal_shop_message").show();
			} else {
			//	Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
			}
		};
		
		UnityNet.Hypnotize(curCid, okFunc,null);
	}
	
	function UsePeaceDove(itemId:int) {
		var okFunc:Function = function (result:HashObject) {
			if (result["ok"].Value) {
//				seed["player"]["truceExpireUnixTime"] = _Global.INT32(seed["player"]["truceExpireUnixTime"]);
//				var ut = GameMain.unixtime();
//				var	bst = 60 * 60 * 12; // 12 hours
//
//				if (seed["player"]["truceExpireUnixTime"] <= ut) {
//					seed["player"]["truceExpireUnixTime"] = ut;
//				} 
//				seed["player"]["truceExpireUnixTime"] = seed["player"]["truceExpireUnixTime"] + bst;

				seed["player"]["truceExpireUnixTime"].Value = _Global.INT64(result["truceExpireUnixTime"].Value);
				seed["player"]["warStatus"].Value = 3;	

				subtractItem(itemId);

				if (result["updateSeed"]) {
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}
//				Boosts.instance().update_boosts();
				var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
				MenuMgr.getInstance().PushMessage(msg);
				
				//----------------------------------------------------------------------------//
				BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_PEASE, itemId);
				//----------------------------------------------------------------------------//
				
			} else {
		//		Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
			}
		};
		UnityNet.UsePeaceDove( itemId, okFunc, null);
	}
	
	function UseTeleportProvince(itemId:int)
	 {
		MenuMgr.getInstance().PushMenu("TeleportProvince", null, "trans_zoomComp");
	}
	
	function useTeleportProvinceDo(itemId:int, pId:int) 
	{
		var curCid:int = GameMain.instance().getCurCityId();
		var okFunc:Function = function(result:HashObject)
		{
			if (result["ok"].Value)
			{
				subtractItem(itemId);
				var keys:Array = _Global.GetObjectKeys(seed["cities"]);
				for (var i:int = 0; i < keys.length; i++) {
					if( _Global.INT32( seed["cities"][keys[i]][_Global.ap + 0] ) == curCid ) 
					{
						seed["cities"][keys[i]][_Global.ap + 2].Value = result["x"].Value;
						seed["cities"][keys[i]][_Global.ap + 3].Value = result["y"].Value;		
						seed["cities"][keys[i]][_Global.ap + 4].Value = "" + pId;	
						var city:City = CityQueue.instance().GetCity(curCid);

						city.x = _Global.INT32(result["x"]);
						city.y = _Global.INT32(result["y"]);				
						var msg:String = Datas.instance().getArString("ToastMsg.TeleportSuccess") + " ("+ result["x"].Value + ","+result["y"].Value+")" ;
						MenuMgr.getInstance().PushMessage(msg);
						MenuMgr.getInstance().SwitchMenu("MainChrom",null);
						GameMain.instance().moveCityTo(_Global.INT32(result["x"]),  _Global.INT32(result["y"]));

						break;
					}
				}	
				MyCitiesController.Init(seed);

			}
		};
		UnityNet.RadomRelocate(itemId,curCid, pId, okFunc, null);
	}
	function UseTeleport(itemId:int)
	{
		MenuMgr.getInstance().PushMenu("TeleportLocation", itemId, "trans_zoomComp");
	}
	
	
	private function priv_UseItemReturn(itemId : int, result : HashObject) : boolean
	{
		if ( result["itemNum"] == null )
		{
			subtractItem(itemId);
			return false;
		}
		var isFirstUse : boolean = false;
		if ( result["countdownTime"] != null )
		{
			var lessTime : int = _Global.INT32(result["countdownTime"]);
			this.SetItemTimeLeft(itemId, lessTime);

			if ( result["totaltime"] != null )
			{
				var totalTime : int = _Global.INT32(result["totaltime"]);
				if ( totalTime == lessTime )
					isFirstUse = true;
			}
		}

		var itemNum = _Global.INT32(result["itemNum"]);
		if ( itemNum == 0 )
			this.RemoveItemTimeLeft(itemId);

		priv_setItemCount(itemId, itemNum);
		return isFirstUse;
	}

	function useTeleportDo(itemId:int, xcoord:int, ycoord:int) {

		var curCid:int = GameMain.instance().getCurCityId();
		var okFunc:Function = function(result:HashObject) {
			if (result["ok"].Value) {
				var isFirstUse : boolean = priv_UseItemReturn(itemId, result);
				var firstUsedMsg : String = "";
				if ( isFirstUse )
				{
					firstUsedMsg = " " + Datas.instance().getArString("ToasterPrompt.EverlastingPortalUsed");
				}

				var keys:Array = _Global.GetObjectKeys(seed["cities"]);
				for (var i:int = 0; i < keys.length; i++) {
					if( _Global.INT32( seed["cities"][keys[i]][_Global.ap + 0] ) == curCid ) 
					{
						seed["cities"][keys[i]][_Global.ap + 2].Value = result["x"].Value;
						seed["cities"][keys[i]][_Global.ap + 3].Value = result["y"].Value;
						var city:City = CityQueue.instance().GetCity(curCid);
						city.x = _Global.INT32(result["x"]);
						city.y = _Global.INT32(result["y"]);	
						MenuMgr.getInstance().SwitchMenu("MainChrom",null);

						var msg:String = Datas.instance().getArString("ToastMsg.TeleportSuccess") + " ("+ result["x"].Value + ","+result["y"].Value+")" + firstUsedMsg;
						firstUsedMsg = "";
						MenuMgr.getInstance().PushMessage(msg);
						GameMain.instance().moveCityTo(_Global.INT32(result["x"]),  _Global.INT32(result["y"]));
						break;
					}
				}
				MyCitiesController.Init(seed);	
				if (GameMain.singleton.getMapController()!=null) {
					GameMain.singleton.getMapController().MoveCityAni(xcoord,ycoord);
				}
			} 
		};
		
		var errorFunc:Function = function(result:HashObject)
		{
			var errorStr:String;
			if (result["msg"]) {
				errorStr = result["msg"].Value;
			}
			else if(result["feedback"])
			{
				errorStr = result["feedback"].Value ;	
			}
			ErrorMgr.instance().PushError(null, errorStr);
		};
		UnityNet.Relocate(itemId, curCid, xcoord, ycoord, okFunc, null);
	}
	
	function ChangeAvatar()
	{
		var data : Hashtable = new Hashtable();
		data["avatar_selector"] = "1";
		MenuMgr.getInstance().PushMenu("PlayerInfo", data);
		MenuMgr.getInstance().getMenuAndCall("PlayerInfo", function(menu : KBNMenu) {
			var playerInfo:PlayerInfo = menu as PlayerInfo;
			if(playerInfo != null)
				playerInfo.titleTab.SelectTab(0);
		});
	}
	
	function ChangeName() 
	{
		MenuMgr.getInstance().PushMenu("PlayerInfo", null);
		MenuMgr.getInstance().getMenuAndCall("PlayerInfo", function(menu : KBNMenu) {
			var playerInfo:PlayerInfo = menu as PlayerInfo;
			if(playerInfo != null)
				playerInfo.titleTab.SelectTab(0);
		});
	}
	
	function RenameCity() {
		MenuMgr.getInstance().PushMenu("PlayerInfo", null);
		MenuMgr.getInstance().getMenuAndCall("PlayerInfo", function(menu : KBNMenu) {
			var playerInfo:PlayerInfo = menu as PlayerInfo;
			if(playerInfo != null)
				playerInfo.titleTab.SelectTab(1);
		});
	}
	function setNewCityName(newName:String, cityId:int) {
		var	itemId:int = 923;
//		var currentcityid:int  = GameMain.instance().getCurCityId();
		if (!newName || newName.length < 3 || newName.length > 15) {
			ErrorMgr.instance().PushError("", Datas.instance().getArString("Error.NameNotAllowed"));
			return;
		}
		var cityInfo:HashObject = GameMain.instance().GetCityInfo(cityId);
		var cityName:String = cityInfo[_Global.ap+1].Value;	
		if(newName == cityName)
			return;					
			var okFunc:Function = function(result:HashObject)
			{
				if (result["ok"].Value)
				{ 
					subtractItem(itemId);
					var keys:Array = _Global.GetObjectKeys(seed["cities"]);
					for (var i:int = 0; i < keys.length; i++) {
						if( _Global.INT32( seed["cities"][keys[i]][_Global.ap + 0] ) == cityId ) 
						{
							seed["cities"][keys[i]][_Global.ap + 1].Value = newName;
							CityQueue.instance().GetCity(cityId).cityName = newName;
						//	MenuMgr.getInstance().SwitchMenu("MainChrom",null);
							break;
						}
					}
					
					var gMain:GameMain = GameMain.instance();
					var curCityInfo:HashObject = gMain.GetCityInfo(gMain.getCurCityId());
					var x:int = _Global.INT32(curCityInfo[_Global.ap + 2]);
					var y:int = _Global.INT32(curCityInfo[_Global.ap + 3]);
					MapMemCache.instance().onCityNameChanged(x,y,newName);
					
					Bookmark.instance().changeCityName();
					MenuMgr.getInstance().sendNotification("RenameCity", null);
					
				}
			};
			
		var errorFunc = function(errorMsg:String, errorCode:String){
//			ErrorMgr.instance().PushError("",errorMsg);
			var arStrings:Datas = Datas.instance();
			var disMsg:String = errorCode == UnityNet.NET_ERROR ? arStrings.getArString("Error.Network_error") : UnityNet.localError( errorCode, errorMsg, null );
			ErrorMgr.instance().PushError("",disMsg);
			
			MenuMgr.getInstance().sendNotification("RenameCity", null);
		};	
		UnityNet.RnameCity(itemId, cityId, newName, okFunc, errorFunc);
			
	}
	
	function changeCityNameBuyAndDo() {
//		Shop.swiftBuy(923, function(){
//			$("buttonChangeCityNameGold").hide();
//			$("item_923_owned_num").innerHTML = MyItems.countForItem(923);
//			$$("#buttonChangeCityName .mid")[0].innerHTML = arStrings.Common.Use_button;
//			$("buttonChangeCityName").onclick = function () {
//				MyItems.setNewCityName();
//				return false;
//			};
//			MyItems.setNewCityName();
//		});
	}
	
	function UnpackFountainPack()
	 {
		var itemId :int= 942;
		var	singleItemId:int = 941;

		var okFunc:Function = function(result:HashObject) {
			if (result["ok"].Value) {
				subtractItem(itemId);
				seed["items"]['i' + singleItemId].Value = countForItem(singleItemId) + 5;
			} else {
		/*		if (result.msg) {
					$('cloakNameError').innerHTML = result.msg;
					$('cloakNameError').show();
				} else {
					Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
				}*/
			}
		};
		UnityNet.UseItemChest(itemId, okFunc, null);
	}
	
	function UseSRMap(itemId:int) 
	{
	
		var okFunc = function(result:HashObject){
		
			if (result["ok"].Value) {
				subtractItem(itemId);
				if (result["updateSeed"]) {
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}
				var msg:String = Datas.instance().getArString("ToastMsg.UseItem");
				MenuMgr.getInstance().PushMessage(msg);
			//	Modal.showNotice(arStrings['Resource']['CheckInboxMessage']); 
			} else {
			//	Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
			}
		};	
		UnityNet.UseSRMap(itemId, okFunc, null);
	}
	
	function changeNameBuyAndDo(newName:String) {

		if (!newName || newName.length < 3 || newName.length > 15) {
			ErrorMgr.instance().PushError("", Datas.instance().getArString("Error.NameNotAllowed"));
		//	MenuMgr.getInstance().OpenNoMoneyDialog(1);
			return false;
		}

//		var originalName = newName.toLowerCase();
//		var sanitizedName = this.sanitize(originalName);
//		if (sanitizedName !== originalName) {
//			Modal.showAlert("This name is invalid.");
//			return false;
//		} else if (this.sterilize(sanitizedName) !== originalName) {//now sterilize
//			Modal.showAlert("This name is invalid.");
//			return false;
//		}
		
		var okFunc:System.Action = function()
		{
			changeNameDo(newName);
		};
		Shop.instance().swiftBuy(922, okFunc);
	}

	function changeNameDo(newName:String) {
		var	itemId:int = 922;
		var currentcityid:int  = GameMain.instance().getCurCityId();
		if (!newName || newName.length < 3 || newName.length > 15) {
			ErrorMgr.instance().PushError("", Datas.instance().getArString("Error.err_51"));
		//	MenuMgr.getInstance().OpenNoMoneyDialog(1);
			return false;
		}
		
		if(newName == seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value)
		{
			ErrorMgr.instance().PushError("", Datas.instance().getArString("Error.err_50"));
			MenuMgr.getInstance().sendNotification("ChangeName", null);
			return false;
		}
//		var originalName = newName.toLowerCase();
//		var sanitizedName = this.sanitize(originalName);
//		if (sanitizedName !== originalName) {
//			Modal.showAlert("This name is invalid.");
//			return false;
//		} else if (this.sterilize(sanitizedName) !== originalName) {//now sterilize
//			Modal.showAlert("This name is invalid.");
//			return false;
//		}
		
		var okFunc = function (result:HashObject) {
			if (result["ok"].Value) {
				MyItems.instance().subtractItem(itemId);
				seed["player"]["name"].Value = newName;
				seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value = newName;

				//---------------------------------// zhou wei
				Quests.instance().checkForElse();
				//---------------------------------//
				
				MapMemCache.instance().onUserNameChanged(Datas.instance().tvuid(), newName);					

				MenuMgr.getInstance().sendNotification("ChangeName", null);
				MenuMgr.getInstance().PushMessage(Datas.instance().getArString("ToastMsg.ChangeNameSuccess")); 
			}
		};
		
		var errorFunc = function(errorMsg:String, errorCode:String){
//			ErrorMgr.instance().PushError("",errorMsg);
			var arStrings:Datas = Datas.instance();
			var disMsg:String = errorCode == UnityNet.NET_ERROR ? arStrings.getArString("Error.Network_error") : UnityNet.localError( errorCode, errorMsg, null );
			ErrorMgr.instance().PushError("",disMsg);
			
			MenuMgr.getInstance().sendNotification("ChangeName", null);
		};
		
		UnityNet.ChangeName(itemId, currentcityid, newName, okFunc, errorFunc);
	}
	
	public function changeAvatarBuyAndDo(avatar:String) {
		// check avatar
		if (!AvatarMgr.instance().AvatarAvailable(avatar)) {
			return;
		}
		
		var okFunc:System.Action = function()
		{
			MenuMgr.instance.sendNotification("OnItemAmountChanged", null);
			changeAvatarDo(avatar);
		};
		Shop.instance().swiftBuy(2411, okFunc);
	}
	
	public function changeAvatarDo(avatar:String) {
		var itemId:int = 2411;
		
		var okFunc = function (result:HashObject) {
			if (null != result["ok"].Value) {
				MyItems.instance().subtractItem(itemId);
				
				MenuMgr.getInstance().sendNotification("ChangeAvatar", null);
				MenuMgr.getInstance().PushMessage(Datas.instance().getArString("Avatar.SelectSucceed"));
			}
		};
		
		var errorFunc = function(errorMsg:String, errorCode:String) {
			var arStrings:Datas = Datas.instance();
			var disMsg:String = errorCode == UnityNet.NET_ERROR ? arStrings.getArString("Error.Network_error") : UnityNet.localError( errorCode, errorMsg, null );
			ErrorMgr.instance().PushError("",disMsg);
		};
		
		AvatarMgr.instance().RequestChangeAvatar(avatar, okFunc, errorFunc);
	}

	public function decorationUnlock(type : String, itemId : int)
	{
		var okFunc = function (result:HashObject) {
			if (null != result["ok"].Value) {
				MyItems.instance().subtractItem(itemId);
			}
		};
		
		var errorFunc = function(errorMsg:String, errorCode:String) {
			
		};
		
		FrameMgr.instance().decorationUnlock(type, itemId, okFunc, errorFunc);
	}
	
	function substractTreasureChest(itemId:int, num:int):int
	{
		var newCount:int = seed["items"]["i" + itemId] ? _Global.INT64(seed["items"]["i" + itemId]) : 0;
		newCount -= num;
		
		if(newCount < 0)
		{
			return 0;
		} 
		
		seed["items"]["i" + itemId].Value = newCount;
		
		updateTreasureChest();
		MenuMgr.getInstance().sendNotification("UpdateItem", null);
		return newCount;	
	}

	/* 迷雾远征 花费 道具 背包 数量 更新 */
	public function MistExpeditionSubtractItem(itemId: int, count: int) {
		subtractItem(itemId, count);
	}


	function subtractItem(itemId:int) :int
	{
		return subtractItem(itemId, 1);
	}
	
	function subtractItem(itemId:int, count:int):int
	{
		var newCount:int = countForItem(itemId) - count;
		if ( newCount < 0 )
		{
			newCount = 0;
		}
		
		priv_setItemCount(itemId, newCount);		
		return newCount;
	}

	public function AddFteFakeItem(itemId:int, count:int, fteId:int)
	{
		AddItem(itemId, count);
		
		var item:HashObject = (Datas.instance().itemlist())["i" + itemId];
		
		var category:int;	
		if(MystryChest.instance().IsExchangeChest(itemId))
		{
			category = Category.Exchange;
		}	
		else if(MystryChest.instance().IsMystryChest(itemId))
		{
			category = Category.MystryChest;
		}
		else if(MystryChest.instance().IsLevelChest(itemId))
		{
			category = Category.LevelChest;
		}
		else
		{
			category = _Global.INT32(item["category"]);
		}

		var itemInfo:InventoryInfo = GetInventoryInfo(itemId, category);
		if (null != itemInfo)
		{
			itemInfo.belongFteId = fteId;
			itemInfo.fteFakeCount = count;
		}
	}
    
    public function AddItemWithCheckDropGear(itemId : int, quant : int) {
        var mayDropGear : boolean = false;
        for (var id : int in mayDropGearItemIds) {
            if (id == itemId) {
                mayDropGear = true;
                break;
            }
        }
        
        if (mayDropGear) {
            AddItemDropGear(itemId, quant, true);
        } else {
            AddItem(itemId, quant);
        }
    }
	
	public function AddItemDropGear(itemId:int, mayDropGear:boolean)
	{
        AddItemDropGear(itemId, 1, mayDropGear);
    }
    
    public function AddItemDropGear(itemId : int, quant : int, mayDropGear : boolean) {
		AddItem(itemId, quant);
		
		var item:HashObject = (Datas.instance().itemlist())["i" + itemId];
		var category:int;	
		if(MystryChest.instance().IsExchangeChest(itemId))
		{
			category = Category.Exchange;
		}		
		else if(MystryChest.instance().IsMystryChest(itemId))
		{
			category = Category.MystryChest;
		}
		else if(MystryChest.instance().IsLevelChest(itemId))
		{
			category = Category.LevelChest;
		}
		else
		{
			category = _Global.INT32(item["category"]);
		}
		
		var newItem:InventoryInfo = null;
		var list:System.Collections.Generic.List.<InventoryInfo> = GetList(category);	
		for(var i:int = 0; i < list.Count; i++)
		{
			if ((list[i] as InventoryInfo).id == itemId)
			{
				newItem = (list[i] as InventoryInfo);
				newItem.mayDropGear = mayDropGear;
				break;
			}
		}
	}
	
	public function AddItem(itemId:int)
	{
		AddItem(itemId, 1);
	}

	public function AddItem(itemId:int, quant:int)
	{
		//var newCount:int;
		//var item:HashObject = (Datas.instance().itemlist())["i" + itemId];
		
		var oldCount : int = priv_getItemCount(itemId);
		var newCount : int = oldCount + quant;
		priv_setItemCount(itemId, newCount);		
	}
	
	public function AddCarmotLootItem(marchId:int){
		var ok:Function = function(result:HashObject){
			if(result["ok"].Value)
			{
				if (result["data"] == null)
		        {
		            return;
		        }
				var arr : String[] = _Global.GetObjectKeys(result["data"]);
				var itemId:int;
				var itemcount:int ;
				 for (var i : int = 0; i < arr.Length; ++i)
        		{		
        			var itemsObj:HashObject = result["data"][arr[i]];
        			if(itemsObj!=null){
	        			itemId = _Global.INT32(itemsObj["itemType"]);
	        			itemcount = _Global.INT32(itemsObj["itemCount"]);
	        			AddItem(itemId,itemcount);
        			}
        			
        		
        		}
				MenuMgr.getInstance().MainChrom.RefreshCurrentMission();
			}
		};
		UnityNet.GetCarmotDropLoot(marchId,ok, null);
	}
	
	public function getItemCount(itemId : int):int
	{
		return priv_getItemCount(itemId);
	}
	
	private function priv_getItemCount(itemId : int) : int
	{
		if (seed["items"]["i" + itemId] != null)
			return _Global.INT32(seed["items"]["i" + itemId.ToString()]);
		return 0;
	}
	
	private function priv_setItemCount(itemId : int, count : int)
	{
		var itemIdString : String = "i" + itemId.ToString();
		var itemObj : HashObject = seed["items"][itemIdString];
		if ( itemObj != null )
			itemObj.Value = count;
		else
			seed["items"][itemIdString] = new HashObject(count);
		priv_ChangeInventoryCount(itemId, count);
		MenuMgr.getInstance().sendNotification("UpdateItem", null);
	}
	
	private function priv_getItemCategoryByItemId(itemId : int) : int
	{
		return GetItemCategoryByItemId(itemId);
	}

	private function priv_getCategoryArrayByItemId(itemId : int) : System.Collections.Generic.List.<InventoryInfo>
	{
		var category : int = priv_getItemCategoryByItemId(itemId);
		if ( category < 0 )
			return new System.Collections.Generic.List.<InventoryInfo>();
		return GetList(category);	
	}
	
	private function priv_ChangeInventoryCount(itemId : int, newCount : int)
	{
		var list : System.Collections.Generic.List.<InventoryInfo> = priv_getCategoryArrayByItemId(itemId);
		for(var i:int = 0; i<list.Count; i++)
		{
			var inventory : InventoryInfo = list[i] as InventoryInfo;
			if ( inventory.id == itemId )
			{
				inventory.quant = newCount;
				if ( newCount == 0 )
				{
					list.RemoveAt(i);
				}
				MenuMgr.getInstance().sendNotification("UpdateItem", null); 
				return;
			}
		}
		if ( newCount != 0 )
		{
			var category : int = priv_getItemCategoryByItemId(itemId);
			if ( category >= 0 )
				priv_PushNewItem(list, itemId, category, newCount);
		}
	}

	private function priv_PushNewItem(list : System.Collections.Generic.List.<InventoryInfo>, itemId : int, category : int, count : int)
	{
		var newItem:InventoryInfo = new InventoryInfo();
		newItem.id = itemId;
		newItem.category = category;
		newItem.quant = count;
		newItem.description = generateItemDesc(itemId);
		newItem.useInList = priv_isItemCanUse(itemId, newItem.category);
		newItem.isNewGet=true;
		AddNewItem(newItem);
	//	list.Add(newItem);
		list.Insert (0,newItem);
		reSort(category);
		MenuMgr.getInstance().sendNotification("UpdateItem", null);
	}

	private function reSort(category:int):void
	{
		switch(category)		
		{
			case Category.TreasureItem:
				treasureItemList.Sort(SortItem_Basic);
				treasureChestList = ResortList(treasureChestList);
				break;
			case Category.TreasureChest:
				treasureChestList.Sort(SortItem_Basic);
				treasureChestList = ResortList(treasureChestList);
				break;
		}
	}
	
	public function getInventoryData(callback:Function)
	{
		var ok:Function = function(result:HashObject){
			if(result["ok"].Value)
			{
				seed["items"] = result["data"]["inventory"];
				
				InitItemList();
				if(callback)
				{
					callback();
				}
			}
		};
		UnityNet.GetInventoryList(ok, null);
	}
	
	public function set NeedUpdate(value:boolean)
	{
		m_bNeedUpdate = value;
	}
	
	public function get NeedUpdate():boolean
	{
		return m_bNeedUpdate;
	}
	
	public function reqInventoryList():void
	{
		
	}
	
	public function UseItemBonusTroop(itemId:int):void
	{
	//	itemId = _Global.INT32(itemId, 10);
		if (itemId != 2501)	
			return;
	 	var curCid:int = GameMain.instance().getCurCityId();
		var okFunc = function(result:HashObject)
		{
	 		if(result["ratio"] == null)
	 			return;

			subtractItem(itemId);
			var troopDes : Barracks.TrainInfo =Barracks.instance().Queue.First();
			if ( troopDes != null)
			{
				if(troopDes.ratio == 0)
				{
					troopDes.ratio=_Global.INT32(result["ratio"]);				
				}
				else
				{
					troopDes.ratio=troopDes.ratio*_Global.INT32(result["ratio"]);
				}
			}
			Barracks.instance().Queue.UpdateSlotRatio(troopDes.id,_Global.INT32(result["ratio"]));
//			var training_queue : HashObject = GameMain.instance().getSeed()["training_queue"];
//			var curCity : HashObject = training_queue["c" + curCid.ToString()];
//			var train : HashObject = curCity["t" + result["trainId"].Value.ToString()];
//			if ( train != null )
//			{
//				if(train["ratio"] == 0)
//				{
//					train["ratio"]=result["ratio"];				
//				}
//				else
//				{
//					var rotioTech : float = (Barracks.instance().GetTechGetIncreaseNumOfBarracks() * 0.0001) + 1;	
//					var rotio : int = _Global.INT32(train["ratio"].Value.ToString());
//					
//					var mainRotio : float = rotioTech * rotio;
//					var slotInfo:HashObject=new HashObject();
//					slotInfo["ratio"].Value = mainRotio.ToString();
//					train["ratio"]=slotInfo;
//				}
//			}

			var msg:String = Datas.instance().getArString("DoubleTroopItem.Toaster");
			MenuMgr.getInstance().PushMessage(msg);
			MenuMgr.getInstance().sendNotification(Constant.Notice.USE_RADIO,null);
		
		};	
		
		UnityNet.UseBonusTroopItem(itemId, curCid, okFunc, null);	
		
	}
	
	private function UnlockAllianceEmblem(itemId:int):void
	{
		if (itemId < 6100 || itemId >= 6600)
			return;
		
		var okFunc = function(result:HashObject)
		{
			if(_Global.GetBoolean(result["ok"]))
			{
				subtractItem(itemId);
			}
		};
		
		UnityNet.reqUnlockAllianceEmblem(itemId, okFunc, null);
	}

	//添加战报掉落
	public function AddReportdDropItems(data:HashObject){

		var keys:String[] = _Global.GetObjectKeys(data);
		for(var i = 0; i < keys.length; i ++)
		{
			var key:String=keys[i];
			var marchType:int=_Global.INT32(data[key]["marchType"]);
			if (marchType!=101) {
				continue;
			}
			var value:HashObject=data[key]["boxContent"]["dropItems"];
			if (value!=null) {
				var itemKeys:String[]=_Global.GetObjectKeys(value);
				for (var j = 0; j < itemKeys.length; j++) {
					var itemId=_Global.INT32(itemKeys[j].Replace('i', ''));
					var count=_Global.INT32(value[itemKeys[j]]);
					AddItem(itemId,count);
				}
			}
		}
	}
}
