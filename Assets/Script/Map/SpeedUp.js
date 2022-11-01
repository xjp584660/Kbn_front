
class	SpeedUp{
	private	static	var	singleton:SpeedUp;
	
	public static var PLAYER_ACTION_CONSTRUCT	:int = 1;
	public static var PLAYER_ACTION_ATTACK		:int = 2;
	public static var PLAYER_ACTION_RESEARCH	:int = 3;
	public static var PLAYER_ACTION_TRAIN		:int = 4;
	public static var PLAYER_ACTION_TRADE		:int = 5;
	public static var PLAYER_ACTION_MESSAGE		:int = 6;
	public static var PLAYER_ACTION_USE_ITEM	:int = 7;
	//,'PLAYER_ACTION_TEMPLE_CONSTRUCT' => 8
	public static var PLAYER_ACTION_FORTIFY		:int = 9;
	public static var PLAYER_ACTION_MARCH		:int = 10;
	public static var PLAYER_ACTION_SCOUT		:int = 11;
	public static var PLAYER_ACTION_WILDER		:int = 13;
	public static var PLAYER_ACTION_HEAL		:int = 14;
	public static var PLAYER_ACTION_PVE			:int = 15;
	public static var PLAYER_ACTION_HERO		:int = 16;
    public static var PLAYER_ACTION_SELECTIVE_DEFENSE : int = 17;
    public static var PLAYER_ACTION_TECHNOLOGYTREE : int = 18;
    public static var PLAYER_ACTION_RALLY 		:int = 19;
    public static var PLAYER_ACTION_WORLDBOSS   :int = 20;
	
	public static var BASEITEM_NUM				:int = 7;
	
	public static var STANDERDITEM_COMP_CODE	:int = 89;
	
	public static var PLAYER_ACTION_COLLECTMARCH		:int = 90;
	public static var RLAYER_ACTION_COLLECT_RESOURCE_MARCH : int = 100;
	
	private var	seed:HashObject;
	private var m_bCanClickSpeedUpItem:boolean = false;
//	var hourGlassTimes:Array = [1440, 900, 480, 150, 60, 15, 1];
	var hourGlassTimes:int[] = [1, 15, 60, 150, 480, 900, 1440, 4320, 10080, 144000];
	var itemsInShop:Hashtable = new Hashtable();
	
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new SpeedUp();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public	function	init( sd:HashObject ){
		seed = sd;
	}
	
	public function GetSpeedUpIsOpenHint() : boolean
	{
		if(PlayerPrefs.HasKey(Constant.SpeedUpHintType.GemsCost))
		{
			var open : int = PlayerPrefs.GetInt(Constant.SpeedUpHintType.GemsCost);
			if(open == 0)
			{
				return false;
			}
			
			return true;
		}
		
		return false;
	}
	
	public function SetSpeedUpIsOpenHint(open : boolean) : void 
	{
		if(open)
		{
			PlayerPrefs.SetInt(Constant.SpeedUpHintType.GemsCost, 1);
		}
		else
		{
			PlayerPrefs.SetInt(Constant.SpeedUpHintType.GemsCost, 0);
		}
	}
	
	public function		resetItemsInShop():void
	{
		itemsInShop.Clear();
		for(var i:int = 0; i < 10; i++)
		{
			var itemId:int = i>=7?(i + 1 + SpeedUp.STANDERDITEM_COMP_CODE):i+1;
			var existFlag:boolean = Shop.instance().itemExistInShop(Shop.SPEEDUP, itemId);

			if(!existFlag)
				itemsInShop[itemId] = false;
			else
				itemsInShop[itemId] = true;
		}
	}
	
	public function		getClosestItem(itemId:int):int
	{
		var startIndex:int;
		var resultId:int;
		startIndex = itemId > 7? (itemId - SpeedUp.STANDERDITEM_COMP_CODE):itemId;
		for(var i:int = startIndex - 1; i >= 1; i--)
		{
			resultId = i>7?(i +SpeedUp.STANDERDITEM_COMP_CODE):i;
				
			if(itemsInShop[resultId] == true)
			{
				if(resultId > 7)
					resultId -= SpeedUp.STANDERDITEM_COMP_CODE;
				return resultId;				//97 -> 7  98 -> 8
			}
		}
	}
	
	// Instant speedups are special, as they actually use multiple
	// speedup items to achieve the "instant" portion, enough that covers
	// the total construction time. This function figures out all how many
	// of each item would be needed if used, from largest to smallest time,
	// as an array.
	//
	public	function	getTotalItemArray (timeLeft:int) {
		
		resetItemsInShop();
		
		var totalItems = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			];
		var	timeReductionArray = [ // index maps to speedup item ID.
				0,
				5,
				30,
				120,
				360,
				690,
				1200,
				3900,
				9600,
				100000,
//				144000
				525600
			];
			
		var	totalTime:float = timeLeft / 60f; // minutes
		var	i:int;
		
//		_Global.Log(" totalTime:" + totalTime );

		while (totalTime > 0) {
			for (i = 1; i < timeReductionArray.length; i++) {
				if (totalTime >= timeReductionArray[i - 1] && totalTime < timeReductionArray[i]) 
				{
					var index:int = i;
					if(KBN.FTEMgr.getInstance().isFinished)
					{	
						var itemId:int = i>7?(i + SpeedUp.STANDERDITEM_COMP_CODE):i;
						var existFlag:boolean = Shop.instance().itemExistInShop(Shop.SPEEDUP, itemId);		
						
						if(!existFlag)
						{
							index = getClosestItem(itemId);
						}
					}
					if(index >= timeReductionArray.length )
						index = 7;
					if(index <1 )
						index = 1;
					totalTime = totalTime -  hourGlassTimes[index - 1] ;
					totalItems[index-1] = totalItems[index-1] + 1;
				}
			}
		}

//		return totalItems.Reverse();
		return totalItems;
	}
	
	// Returns the total gem cost that would be required for using
	// "Instant Finish", basically an aggregation of the speedup items
	// that would be required to finish.
	//
	// Whichever is less, the cost of a single item or the aggregate,
	// will be returned.
	//
	public	function	getTotalGemCost(timeLeft:int) :int{
		var totalGemCost:int = 0;
		var	itemArray:Array = getTotalItemArray(timeLeft);
		var itemlist:HashObject = Datas.instance().itemlist();

		// Calculate total gem cost for aggregated items
		for( var i:int = 0; i < itemArray.length; i ++ ){
			if(i >= SpeedUp.BASEITEM_NUM)
				totalGemCost = totalGemCost + _Global.INT32(itemlist["i" + (i + 90)]["price"]) * _Global.INT32(itemArray[i]);
			else
				totalGemCost = totalGemCost + _Global.INT32(itemlist["i" + (i + 1)]["price"]) * _Global.INT32(itemArray[i]);
		}
		return totalGemCost;

	}
	
	public	function	getTechGemCost(timeLeft:int) :int{
		var totalGemCost:int = 0;	
		var itemlist:HashObject = Datas.instance().itemlist();
		
		var	i : int;		
		var itemArray : Array = getTechItemArray(timeLeft);
		for (i = 0; i < itemArray.length; i++)
		{
			var itemID : int = itemArray[i];	
			if(itemlist["i" + itemID] != null && itemlist["i" + itemID]["price"] != null)
			{
				totalGemCost = totalGemCost + _Global.INT32(itemlist["i" + itemID]["price"]); 
			}							
		}

		return totalGemCost;
	}
	
	var	techTimeReductionArray = [0,5,30,120,360,690,1200,3900,9600,100000,525600];
	//科技树加速道具
	var techSpeedUpItems : int[]  = [4301,4302,4303,4304,4305,4306,4307,4308];
	// index maps to speedup item ID.
	var	hourGlassTimesArray : int[] = [1,15,60,150,480,900,1440,4320];
	public function getTechSpeedUpItemListString(timeLeft : int) : String
	{		
		var itemArray : Array = getTechItemArray(timeLeft);
		if(itemArray != null)
		{
			return itemArray.Join(",");			
		}
		
		return "";
	}
	
	public function getTechItemArray(timeLeft : int)
	{
		var	totalTime : float = timeLeft / 60.0f; // minutes
		var	i : int;
		var itemid : int;
		var itemArray : Array = new Array();
		
		while (totalTime > 0) {
			for (i = 1; i < techTimeReductionArray.length; i++) {
				if (totalTime >= techTimeReductionArray[i - 1] && totalTime < techTimeReductionArray[i]) 
				{
					var index:int = i;
					if(index > 8 )
						index = 8;
					totalTime = totalTime -  hourGlassTimesArray[index - 1] ;
					itemid = techSpeedUpItems[index - 1];
					itemArray.push(itemid);
				}
			}
		}
//		while (totalTime > 0) {
//			for (i = techTimeReductionArray.length - 1; i >= 1; i--) {
//			
//				if(totalTime > techTimeReductionArray[techTimeReductionArray.length - 1])
//				{
//					itemid = techSpeedUpItems[techSpeedUpItems.length - 1];//4308
//					totalTime = totalTime - techTimeReductionArray[techTimeReductionArray.length - 1];//4320
//					itemArray.push(itemid);
//				}
//				else
//				{
//					if(totalTime < 1 && totalTime > 0)
//					{
//						itemid = techSpeedUpItems[0]; //4301
//						totalTime = totalTime -  techTimeReductionArray[1] ;//1
//						itemArray.push(itemid);
//					}
//					else if (totalTime >= techTimeReductionArray[i - 1] && totalTime <= techTimeReductionArray[i]) 
//					{
//						itemid = techSpeedUpItems[i - 1];
//						totalTime = totalTime -  techTimeReductionArray[i - 1] ;
//						itemArray.push(itemid);
//					}
//				}
//			}
//		}
		
		return itemArray;
	}
	
	public function getTechSpeedUpItemsIndex(itemid : int) : int
	{
		for(var i : int = 0; i < techSpeedUpItems.length; ++i)
		{
			if(techSpeedUpItems[i] == itemid)
			{
				return i;
			}
		}
		
		return 0;
	}

	// Returns the total list of items, comma-separated, that will be
	// needed to finish current construction. Used for Instant Finish.
	//
	public	function	getItemListString (timeLeft:int):String {
		var itemListArray:Array = new Array();
		var	itemArray:Array = getTotalItemArray(timeLeft);

//		itemArray.reverse().each(function (count, index) {
//			$R(1, count).each(function () {
//											itemListArray.push(index + 1);
//										});
//		});

		////??????????
		var i:int = 0;
		var j:int = 0;
		var builtinArray:int[] = itemArray.ToBuiltin(int);
		for( i = 0; i < itemArray.length; i ++ ){
			for( j = 1; j <= builtinArray[i]; j ++ ){
				var itemId:int;
				itemId = (i < 7)?(i+1):(i+1 +SpeedUp.STANDERDITEM_COMP_CODE);
				itemListArray.Push(itemId );
			}
		}

//		_Global.Log(" itemArray:" + itemArray + " string:" + itemListArray.Join(","));
		return itemListArray.Join(",");
	}
	
	public	function	useInstantSpeedUp (typeId:int, gems:int, itemList:String, targetId:int) 
	{
		useInstantSpeedUp (typeId, gems, itemList, targetId, 0,"");
	}
	
	public	function	useInstantSpeedUp (typeId:int, gems:int, itemList:String, targetId:int, cityID : int) 
	{
		useInstantSpeedUp (typeId, gems, itemList, targetId, 0, "", cityID);
	}

	// Executes an Instant Speedup. In the case of buildings and technology
	// currently, a list of speedups is passed along since it may require
	// multiple speedups to cover the entire time remaining for construction.
	//
	public	function	useInstantSpeedUp (typeId:int, gems:int, itemList:String, targetId:int, directBuyflag:int, dollar:String) {
		var currentcityid : int = GameMain.instance().getCurCityId();
		useInstantSpeedUp(typeId, gems, itemList, targetId, directBuyflag, dollar, currentcityid);
	}

	public	function	useInstantSpeedUp (typeId:int, gems:int, itemList:String, targetId:int, directBuyflag:int, dollar:String, currentcityid : int) {

//		_Global.Log(" seed gems:" + seed["player"]["gems"] + " need gems:" + gems );
		//var currentcityid : int = GameMain.instance().getCurCityId();
		if (Payment.instance().CheckGems(gems)) 
		{
			var params:Array = new Array();
			
			var	reqFunc:Function = UnityNet.reqGemsInstantSpeedUp;
			switch (typeId)
			{
			case PLAYER_ACTION_TRAIN: // units
				params.Add(currentcityid);
				params.Add(typeId);
				params.Add(gems);
				params.Add(itemList);
				break;
				
			case PLAYER_ACTION_CONSTRUCT: // building
				params.Add(currentcityid);
				params.Add(typeId);
				params.Add(gems);
				params.Add(itemList);
				break;
				
			case PLAYER_ACTION_RESEARCH: // technology
				params.Add(currentcityid);
				params.Add(typeId);
				params.Add(gems);
				params.Add(itemList);
				break;
				
			case PLAYER_ACTION_TECHNOLOGYTREE: // technologyTree
				params.Add(currentcityid);
				params.Add(typeId);
				params.Add(gems);
				params.Add(itemList);
				break;
				
			case PLAYER_ACTION_FORTIFY: // fortification
				params.Add(currentcityid);
				params.Add(typeId);
				params.Add(gems);
				params.Add(itemList);
				break;

			case PLAYER_ACTION_MARCH:
			case PLAYER_ACTION_COLLECTMARCH:
			
				var mvo:MarchVO = March.instance().getMarchInTotalCitites(targetId);
				params.Add(mvo?mvo.fromCityId:currentcityid);
				params.Add(typeId);
				params.Add(gems);
				params.Add(itemList);
				params.Add(targetId);
				break;
				
			case PLAYER_ACTION_WILDER:
				var wvo:WildernessVO = WildernessMgr.instance().getWilderness(targetId);
				params.Add(wvo?wvo.tileCityId:currentcityid);
				params.Add(typeId);
				params.Add(gems);
				params.Add(itemList);
				params.Add(targetId);
				break;
				
			case PLAYER_ACTION_SCOUT:
				params.Add(currentcityid);
				params.Add(typeId);
				params.Add(gems);
				params.Add(itemList);
				break;
			case PLAYER_ACTION_HEAL:
            case PLAYER_ACTION_SELECTIVE_DEFENSE:
				reqFunc = UnityNet.ReqGemsInstantSpeedUp;
				break;
			case PLAYER_ACTION_PVE:
				var pveMvo:MarchVO = March.instance().getMarchInTotalCitites(targetId);
				params.Add(pveMvo?pveMvo.fromCityId:currentcityid);
				params.Add(PLAYER_ACTION_MARCH);
				params.Add(gems);
				params.Add(itemList);
				params.Add(targetId);
				reqFunc = UnityNet.reqGemsInstantSpeedUp;
				break;
			case PLAYER_ACTION_HERO:
				params.Add(currentcityid);
				params.Add(typeId);
				params.Add(gems);
				params.Add(itemList);
				params.Add(targetId);
				reqFunc = UnityNet.reqGemsInstantSpeedUp;
				break;
			}

			params.Add(directBuyflag);
			params.Add(dollar);
			var okFunc:function(HashObject) = function(result:HashObject){
				if(directBuyflag != 0)
				{
					MenuMgr.getInstance().sendNotification(Constant.Notice.PREVIOUS_PROGRESS_COMPLETE,null);
				}
				switch (typeId) {
				case PLAYER_ACTION_TRAIN: // units
//					Barracks.Queue.updateSlot(SpeedUp.targetId, { eta: 0 });
//					seed.player.might = _Global.INT32(seed.player.might, 10) + (_Global.INT32(unitmight['u' + queue.type], 10) * queue.quant);				
//					update_might();
//					Barracks.instance().Queue.updateSlot(targetId, {
//						"ticker": 0,
//						"eta": 0
//					});
					var trainQueue:Array = Barracks.instance().Queue.GetTraiQueue();
					var timered:long;
					for(var i:int =0; i<trainQueue.length; i++)
					{
						if((trainQueue[i] as Barracks.TrainInfo ).id == targetId)
						{	
							timered = (trainQueue[i] as Barracks.TrainInfo ).endTime - GameMain.instance().unixtime();
							(trainQueue[i] as Barracks.TrainInfo ).startTime = 0;
							(trainQueue[i] as Barracks.TrainInfo ).endTime = 0;
							
							break;
						}
					}
					Barracks.instance().Queue.SpeedUp(targetId,timered ,currentcityid);
					break;
				case PLAYER_ACTION_CONSTRUCT: // building
					var bElement:BuildingQueueMgr.QueueElement = BuildingQueueMgr.instance().first(currentcityid);
					if( bElement ){
						bElement.endTime = 0;
					}
					BuildingQueueMgr.instance().update();
//					if( seed["queue_con"]["city" + currentcityid][_Global.ap + 0] ){
//						seed["queue_con"]["city" + currentcityid][_Global.ap + 0][_Global.ap + 4] = 0;
//					}
					break;
					
				case PLAYER_ACTION_RESEARCH: // technology
					seed["queue_tch"]["city" + currentcityid][_Global.ap + 0][_Global.ap + 2].Value = 0;
					seed["queue_tch"]["city" + currentcityid][_Global.ap + 0][_Global.ap + 3].Value = 0;
					seed["queue_tch"]["city" + currentcityid][_Global.ap + 0][_Global.ap + 4].Value = 0;
					
					var rItem:QueueItem = Research.instance().getItemAtQueue(0,currentcityid);
					if(rItem)
					{
						rItem.endTime = GameMain.unixtime()-1;
						rItem.startTime = 0;
					}
					if(directBuyflag != 0)
					{
						MenuMgr.getInstance().netBlock = true;
						var isRealtmp:boolean = result["isWorldGem"]?result["isWorldGem"].Value == false:true;
						Payment.instance().SubtractGems(gems,isRealtmp);
						GameMain.instance().seedUpdateAfterQueue(true);
						GameMain.instance().resetSecondUpdate();
						return;
					}
					break;
					
				case PLAYER_ACTION_TECHNOLOGYTREE: // technology			
					var techItem:QueueItem = Technology.instance().getFirstQueue();
					if(techItem)
					{
						//seed["queue_technology"]["" + techItem.id][_Global.ap + 0][_Global.ap + 2].Value = 0;
						//seed["queue_technology"]["" + techItem.id][_Global.ap + 0][_Global.ap + 3].Value = 0;
						//seed["queue_technology"]["" + techItem.id][_Global.ap + 0][_Global.ap + 4].Value = 0;
						techItem.endTime = GameMain.unixtime()-1;
						techItem.startTime = 0;
					}
					if(directBuyflag != 0)
					{
						MenuMgr.getInstance().netBlock = true;
						var isTechRealtmp:boolean = result["isWorldGem"]?result["isWorldGem"].Value == false:true;
						Payment.instance().SubtractGems(gems,isTechRealtmp);
						GameMain.instance().seedUpdateAfterQueue(true);
						GameMain.instance().resetSecondUpdate();
						return;
					}
					break;
					
					
				case PLAYER_ACTION_FORTIFY: // fortification
//					Walls.instance().Queue.updateSlot(targetId, { "eta": 0 });
//					Walls.instance().Queue.updateSlot(targetId, {
//						"ticker":  0,
//						"eta":  0
//					});
					var wallTrainQueue:Array = Walls.instance().Queue.GetTraiQueue();
					for(var w:int =0; w<wallTrainQueue.length; w++)
					{
						if(( wallTrainQueue[w] as Walls.TrainInfo ).id == targetId)
						{	
							timered = (wallTrainQueue[w] as Walls.TrainInfo ).endTime - GameMain.instance().unixtime();
							( wallTrainQueue[w] as Walls.TrainInfo ).startTime = 0;
							( wallTrainQueue[w] as Walls.TrainInfo ).endTime = 0;
							break;
						}
					}
					
					Walls.instance().Queue.SpeedUp(targetId,timered ,currentcityid);
					break;
					
				case PLAYER_ACTION_MARCH:
				case PLAYER_ACTION_COLLECTMARCH:
				case RLAYER_ACTION_COLLECT_RESOURCE_MARCH:
				
						var el:long = GameMain.unixtime();	//(result["neweta"]);
						var mvo:MarchVO = March.instance().getMarchInTotalCitites(targetId);						
						if(mvo)						
						{		
							mvo.speed2EndTime(el);	// march not exists? 				 						
							seed["outgoing_marches"]["c" + mvo.fromCityId]["m" + targetId]["marchUnixTime"].Value = "" + mvo.marchUnixTime;
							seed["outgoing_marches"]["c" + mvo.fromCityId]["m" + targetId]["destinationUnixTime"].Value = "" + mvo.destinationUnixTime;
							seed["outgoing_marches"]["c" + mvo.fromCityId]["m" + targetId]["returnUnixTime"].Value = "" + mvo.returnUnixTime;
						}						
						MenuMgr.getInstance().sendNotification(Constant.Notice.SPEED_MARCH_OK,null);
						
					break;
				case PLAYER_ACTION_WILDER:
					var now:long = GameMain.unixtime();
					var wvo:WildernessVO = WildernessMgr.instance().getWilderness(targetId);						
					if(wvo)						
					{		
						wvo.speed2EndTime(now);				 						
						seed["wilderness"]["city"+ wvo.tileCityId]["t"+ targetId]["freezeEndTime"].Value = now;
						seed["wilderness"]["city"+ wvo.tileCityId]["t"+ targetId]["inSurvey"].Value = Constant.WildernessState.FREETOSURVEY;						
//						MenuMgr.getInstance().SpeedUp.close();
					}
					MenuMgr.getInstance().sendNotification(Constant.Notice.SPEED_WILDER_OK, targetId);
					break;
				
				case PLAYER_ACTION_SCOUT:
					var scoutItem:Scout.ScoutItem = Scout.instance().getScout();
					if(scoutItem != null)
						scoutItem.speed2EndTime(GameMain.unixtime());
					break;

				case PLAYER_ACTION_HEAL:
					var ltHealQueueItem : System.Collections.Generic.List.<HealQueue.HealQueueItem> = HealQueue.instance().GetQueueByCityId(currentcityid);
					if ( ltHealQueueItem.Count != 0 )
						ltHealQueueItem[0].speed2EndTime(GameMain.unixtime());
					HospitalHealPopMenu.OnSpeedupOK();
                
                case PLAYER_ACTION_SELECTIVE_DEFENSE:
                    var defenseQueue : List.<SelectiveDefenseQueueItem> = SelectiveDefenseQueueMgr.instance().GetQueueByCityId(currentcityid);
                    if (defenseQueue.Count != 0)
                    {
                        defenseQueue[0].speed2EndTime(GameMain.unixtime());
                    }
                    CastleDefenseContent.OnSpeedupOK();

				case PLAYER_ACTION_PVE:
					var endTime:long = GameMain.unixtime();
					KBN.PveController.instance().SetMarchEndTime(endTime);
					var pveMvo:MarchVO = March.instance().getMarchInTotalCitites(targetId);						
					if(pveMvo)						
					{		
						pveMvo.speed2EndTime(endTime);	// march not exists? 				 						
					}
					break;
				case PLAYER_ACTION_HERO:
					var heroData : QueueItem = HeroManager.Instance().GetLastHeroSpeedUpData();
					heroData.endTime = 0;
					HeroManager.Instance().SetHeroSleepStatus(targetId, 0, 1);
					MenuMgr.instance.sendNotification(Constant.Hero.HeroInfoListUpdated, null);
					break;
				}

				var isReal:boolean = result["isWorldGem"]?result["isWorldGem"].Value == false:true;
				Payment.instance().SubtractGems(gems,isReal);
				GameMain.instance().update_queue();
				
				//force..6+ update 
				//UpdateSeed.instance().update_seed_ajax(true,null);
				GameMain.instance().seedUpdateAfterQueue(true);

				MenuMgr.getInstance().sendNotification(Constant.Notice.SPEEDUP_ITEMS_UPDATED, null);
			};

			if ( reqFunc == UnityNet.ReqGemsInstantSpeedUp )
            {
				UnityNet.ReqGemsInstantSpeedUp(currentcityid, typeId, gems, itemList, targetId, okFunc);
            }
			else
            {
				reqFunc(params, okFunc, null );
            }
		}
		else
		{
			//gems not enough
		}
	}
	
//	public	function	marketApply (tkey, ind, mktid) {
//		var curCityId = GameMain.instance().getCurCityId();
//		
//		var okFunc:Function = function(result:Object){
//			_Global.Log("marketApply spped up OK");
//			seed["items"]["i49"] = _Global.INT32(seed["items"]["i49"]) - 1;
//			if (seed["queue_mkt"]["city" + curCityId][tkey][ind]) {
//				seed["queue_mkt"]["city" + curCityId][tkey][ind]["eventUnixTime"] = "1";
//			}
//		};
//		
//		var	errorFunc:Function = function(msg:String, errorCode:int){
//			_Global.Log("marketApply spped upError:"+msg);
//		};
//		
//		var params:Array = new Array();
//		params.Add(mktid);
//		params.Add(curCityId);
//		params.Add(49);
//		
//		UnityNet.reqMarketSpeedUp(params,okFunc,errorFunc);
//	}

	// The action that actually uses a speedup
	//targetDat --- added by tzhou, sometypes need this.(QueueItem)
	public	function	apply (typeId:int, itemId:int, targetId:int,targetData:QueueItem/*,forceUpdate:boolean*/, okCallback:Function){
		var	research:Research = Research().instance();
		var	currentcityid:int = GameMain.instance().getCurCityId();

		var targetCityId : int = currentcityid;
		if(typeId == PLAYER_ACTION_MARCH || typeId == PLAYER_ACTION_COLLECTMARCH || typeId == RLAYER_ACTION_COLLECT_RESOURCE_MARCH ||typeId == PLAYER_ACTION_PVE)
			targetCityId = (targetData as MarchVO).fromCityId;
		else if(typeId == PLAYER_ACTION_WILDER)
			targetCityId = (targetData as WildernessVO).tileCityId;

		var params:Array = new Array();
		params.Add(targetCityId);
		params.Add(itemId);

		var okFunc:function(HashObject) = function(result:HashObject){
//			_Global.Log("apply spped up OK");
			var timered:int;// = hourGlassTimes[itemId - 1] * 60;
			var	queue = null;
			var	buildingTypeId:int = 0;
			var curCityId:int;

			// deduct from seed.items
			MyItems.instance().subtractItem(itemId);
			SoundMgr.instance().PlayEffect( "use_speedup", /*TextureType.AUDIO*/"Audio/");
			if(itemId < 4301 || itemId > 4308)
			{
				if(itemId > SpeedUp.BASEITEM_NUM)
					itemId -= SpeedUp.STANDERDITEM_COMP_CODE;
			}			
			switch (typeId) {
				case PLAYER_ACTION_CONSTRUCT:
					timered = hourGlassTimes[itemId - 1] * 60;
					var bElement:BuildingQueueMgr.QueueElement = BuildingQueueMgr.instance().first(currentcityid);
					if( bElement ){
						bElement.startTime -= timered;
						bElement.endTime -= timered;
					}
					break;
					
				case PLAYER_ACTION_RESEARCH:
					timered = hourGlassTimes[itemId - 1] * 60;
					var rItem:QueueItem = research.getItemAtQueue(0,currentcityid);
					if( rItem ){
						rItem.startTime -= timered;
						rItem.endTime -= timered;
					}
					break;
					
				case PLAYER_ACTION_TECHNOLOGYTREE:
					var index : int = getTechSpeedUpItemsIndex(itemId);
					timered =  hourGlassTimesArray[index] * 60;
					var techItem:QueueItem = Technology.instance().getFirstQueue();
					if( techItem ){
						techItem.startTime -= timered;
						techItem.endTime -= timered;
					}
					break;
//				
				
				case PLAYER_ACTION_TRAIN:
//				
					curCityId = GameMain.instance().getCurCityId();
					timered = hourGlassTimes[itemId - 1] * 60;//9000;

					var trainQueue:Array = Barracks.instance().Queue.GetTraiQueue();
					for(var i:int =0; i<trainQueue.length; i++)
					{
						if((trainQueue[i] as Barracks.TrainInfo).id == targetId)
						{	
							timered = Mathf.Min((trainQueue[i] as Barracks.TrainInfo).endTime - GameMain.instance().unixtime(), timered );
							break;
						}
					}
					Barracks.instance().Queue.SpeedUp(targetId,timered ,curCityId);
					break;
					
				case PLAYER_ACTION_FORTIFY:
					curCityId = GameMain.instance().getCurCityId();
					timered = hourGlassTimes[itemId - 1] * 60;//9000;

					var wallTrainQueue:Array = Walls.instance().Queue.GetTraiQueue();
					for(var w:int =0; w<wallTrainQueue.length; w++)
					{
						if((wallTrainQueue[w] as Walls.TrainInfo).id == targetId)
						{	
							timered = Mathf.Min((wallTrainQueue[w] as Walls.TrainInfo).endTime - GameMain.instance().unixtime(), timered );
							break;
						}
					}
					
					Walls.instance().Queue.SpeedUp(targetId,timered ,curCityId);
					break;

				case PLAYER_ACTION_MARCH:	//TODO.......		
				case PLAYER_ACTION_COLLECTMARCH:
				case PLAYER_ACTION_WORLDBOSS:	
				case RLAYER_ACTION_COLLECT_RESOURCE_MARCH:
						
						var el:long = _Global.INT64(result["neweta"]);
						var mvo:MarchVO = targetData as MarchVO;
						mvo.speed2EndTime(el);
						
						if(mvo)
						{	
							seed["outgoing_marches"]["c" + mvo.fromCityId]["m" + targetId]["marchUnixTime"].Value = "" + mvo.marchUnixTime;
							seed["outgoing_marches"]["c" + mvo.fromCityId]["m" + targetId]["destinationUnixTime"].Value = "" + mvo.destinationUnixTime;
							seed["outgoing_marches"]["c" + mvo.fromCityId]["m" + targetId]["returnUnixTime"].Value = "" + mvo.returnUnixTime;
						}
						
						MenuMgr.getInstance().sendNotification(Constant.Notice.SPEED_MARCH_OK,null);
						//TODO...something else.
					break;
	
				case PLAYER_ACTION_RALLY:							
						var rallyTime:long = _Global.INT64(result["newEta"]);
						var rallyMvo:MarchVO = targetData as MarchVO;
						rallyMvo.speed2EndTime(rallyTime);
						 
						MenuMgr.getInstance().sendNotification(Constant.Notice.SPEED_MARCH_OK,null);
					break;
				case PLAYER_ACTION_WILDER:	//TODO.......						
						var wliderel:long = _Global.INT64(result["neweta"]);
						var wvo:WildernessVO = targetData as WildernessVO;
						
						if(wvo)
						{	
							wvo.speed2EndTime(wliderel);					
							seed["wilderness"]["city"+ wvo.tileCityId]["t"+ targetId]["freezeEndTime"].Value = wliderel;
							//if(wvo.tileStatus == Constant.WildernessState.FREETOSURVEY)	
								MenuMgr.getInstance().sendNotification(Constant.Notice.SPEED_WILDER_OK, targetId);
						}
					break;
					
				case PLAYER_ACTION_SCOUT:
					var scoutNewEta:long = _Global.INT64(result["neweta"]);
					(targetData as QueueItem).speed2EndTime(scoutNewEta);
					break;

				case PLAYER_ACTION_HEAL:
                case PLAYER_ACTION_SELECTIVE_DEFENSE:
					var newEndTime : long = _Global.INT64(result["neweta"]);
					//var healQueueItem : HealQueue.HealQueueItem = targetData as HealQueue.HealQueueItem;
					targetData.speed2EndTime(newEndTime);
					break;
					
				case PLAYER_ACTION_PVE:						
					var endTime:long = _Global.INT64(result["neweta"]);
					KBN.PveController.instance().SetMarchEndTime(endTime);
					var pveMvo:MarchVO = targetData as MarchVO;
					
					if(pveMvo)
					{
						pveMvo.speed2EndTime(endTime);
					}
					break;
				case PLAYER_ACTION_HERO:
					timered = hourGlassTimes[itemId - 1] * 60;
					var heroData : QueueItem = targetData as QueueItem;
					heroData.startTime -= timered;
					heroData.endTime -= timered;
					HeroManager.Instance().SubtractHeroSleepTime(heroData.id, timered);
					MenuMgr.instance.sendNotification(Constant.Hero.HeroInfoListUpdated, null);
					break;
			}
				
			if (result["updateSeed"]) {
				UpdateSeed.instance().update_seed(result["updateSeed"]);
			}
			
			MenuMgr.getInstance().sendNotification(Constant.Notice.SPEEDUP_ITEMS_UPDATED, null);
			
			if( okCallback ){
				okCallback();
			}
		};
		
		switch (typeId) {
		case PLAYER_ACTION_WORLDBOSS:
			params.Add(targetId);
			UnityNet.worldBossSpeedUp(params, okFunc, null );
			break;
		case PLAYER_ACTION_RALLY:
			var rallyMarch : MarchVO = targetData as MarchVO;
			UnityNet.rallySpeedUp(itemId, rallyMarch.marchId, rallyMarch.rallyId, okFunc, null );
			break;
		case PLAYER_ACTION_CONSTRUCT:
			params.Add(targetId);
			UnityNet.reqConstructionApplySpeedUp(params, okFunc, null );
			
			break;
		case PLAYER_ACTION_RESEARCH:
			params.Add(targetId);
			UnityNet.reqResearchApplySpeedUp(params, okFunc, null );
			break;
		case PLAYER_ACTION_TECHNOLOGYTREE:
			params.Add(targetId);
			UnityNet.reqTechnologyApplySpeedUp(params, okFunc, null );
			break;
		case PLAYER_ACTION_TRAIN:
			params.Add(targetId);
			UnityNet.reqTrainingApplySpeedUp(params, okFunc, null );
			break;
		case PLAYER_ACTION_FORTIFY:
			params.Add(targetId);
			UnityNet.reqFortifyingApplySpeedUp(params, okFunc, null );
			break;
		case PLAYER_ACTION_MARCH:
			params.Add(targetId);
			UnityNet.reqMarchApplySpeedUp(params, okFunc, null );
			break;			
		case PLAYER_ACTION_COLLECTMARCH:
			params.Add(targetId);
			UnityNet.reqMarchApplyCollectSpeedUp(params, okFunc, null );
			break;	
		case RLAYER_ACTION_COLLECT_RESOURCE_MARCH:
			params.Add(targetId);
			UnityNet.reqMarchApplyCollectResourceSpeedUp(params, okFunc, null );
			break;
		case PLAYER_ACTION_WILDER:
			params.Add(targetId);
			UnityNet.reqTileApplySpeedUp(params, okFunc, null );
			break;				
		case PLAYER_ACTION_SCOUT:
			UnityNet.reqScoutApplySpeedUp(params, okFunc, null);
			break;
		case PLAYER_ACTION_HEAL:
			UnityNet.reqHealApplySpeedUp(targetCityId, targetData.id, itemId, okFunc);
			break;
        case PLAYER_ACTION_SELECTIVE_DEFENSE:
            UnityNet.ReqSelectiveDefenseSpeedUp(targetCityId, targetData.id, itemId, okFunc);
            break;
		case PLAYER_ACTION_PVE:
			params.Add(targetId);
			UnityNet.reqMarchApplySpeedUp(params, okFunc, null);
			break;
		case PLAYER_ACTION_HERO:
			params.Add(targetId);
			UnityNet.reqHeroApplySpeedUp(params, okFunc, null);
			break;
		}
	}
	
	public function sortTechSpeedUpItems(timeLeft:long):Array
	{
		var minLeft:long = timeLeft / 60;
		var firstItemIndex:int = 0;
		
		var result:Array = new Array();
		var i:int = 0;
		for(i = 0;i < techSpeedUpItems.length; i++)
		{
			result.Add(techSpeedUpItems[i]);
		}
			
		for(i = 0;i < hourGlassTimesArray.length; i++)
		{
			var itemMins:int = hourGlassTimesArray[i];
			if(itemMins >= minLeft)
			{    
				firstItemIndex = i;
				break;
			}
		}
		if(hourGlassTimesArray[hourGlassTimesArray.length - 1]<= minLeft)
			firstItemIndex = hourGlassTimesArray.length - 1;
			
		result.splice(firstItemIndex,1);
		result.unshift(techSpeedUpItems[firstItemIndex]);	
		return result;
	}
	
	public function sortSpeedUpItems(timeLeft:long):Array
	{
		var minLeft:long = timeLeft / 60;
		var firstItemId:int = 0;
		var result:Array = new Array();
		var i:int = 0;
		for(i=1;i<= 10;i++)
		{
			var itemMins:int = hourGlassTimes[i - 1];
			if(itemMins >= minLeft)
			{
				firstItemId = i;
				break;
			}
		}
		if(i > 10 && hourGlassTimes[9]<= minLeft)
			firstItemId = 10;
		for(i = firstItemId;i >= 1; i--)
		{
			result.Add(i);
		}
		for(i = firstItemId + 1;i <= 10; i++)
		{
			result.Add(i);
		}
		return result;
	}
	
	public function set CanClickSpeedUpItem(value:boolean)
	{
		m_bCanClickSpeedUpItem = value;
	}
	
	public function get CanClickSpeedUpItem():boolean
	{
		return m_bCanClickSpeedUpItem;
	}
}
