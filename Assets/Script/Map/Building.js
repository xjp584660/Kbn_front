
class	Building extends KBN.Building
{
	private var LV:String;
	private var YourLv:String;
	private var Population:String;
	
	private	static	var	allBuildingTypeIds:Array = new Array(
	[ /* array of all existing buildings in the proper order */
		Constant.Building.WALL, /* the first one is special,see function emptySlotInfo */
		
		Constant.Building.FARM,
		Constant.Building.SAWMILL,
		Constant.Building.QUARRY,
		Constant.Building.MINE, /* resource buildings (1-4) need to be here to show up in field */
		Constant.Building.VILLA,
		Constant.Building.BARRACKS,
		Constant.Building.ACADEMY,
		Constant.Building.GENERALS_QUARTERS,
		Constant.Building.STOREHOUSE,
		Constant.Building.RALLY_SPOT,
		Constant.Building.EMBASSY,
		Constant.Building.COLISEUM,
		Constant.Building.BLACKSMITH,
		Constant.Building.WORKSHOP,
		Constant.Building.WATCH_TOWER,
		Constant.Building.STABLE,
		Constant.Building.MUSEUM,
		Constant.Building.RELIEF_STATION,
		Constant.Building.MARKET,
		Constant.Building.HOSPITAL
		
	]);
	
	private	static 	var	nonUniqueBuildingIds:Array = new Array(
	 [ /* Buildings that can have multiple instances in a city */
		Constant.Building.FARM,
		Constant.Building.SAWMILL,
		Constant.Building.QUARRY,
		Constant.Building.MINE,
		Constant.Building.VILLA,
		Constant.Building.BARRACKS,
		Constant.Building.HOSPITAL
	]);
	
	class	EmptySlotInfo{
		public var	buildingTypeId:int;
		
		public var	valid:boolean;/* display gray or not */
	}
	
	private	var	seed:HashObject;
	
	public static function instance(){
		if( singleton == null ){
			singleton = new Building();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		
		return singleton as Building;
	}
	
	public function init(sd:HashObject){
		seed = sd;
		Population = Datas.getArString("Common.Population");
		LV =  Datas.getArString("Common.Lv") ;
		YourLv = Datas.getArString("Common.YourLevel");
	}
	
	public function isEmptySlot(slotId:int):boolean{
		
		return seed["buildings"]["city" + GameMain.instance().getCurCityId()]["pos" + slotId] == null;
	}
	
	/* Create a new building on an empty slot -- displays the
	// new building selector.
	*/
	public function emptySlotInfo(slotId:int):Array{
	
		var	ret:Array = new Array();
		var	start:int;
		var end:int;
		if (slotId >= 2 && slotId <= 99) { /* city, remove field buildings and wall */
			start = 5;
			end = allBuildingTypeIds.length;
			
		} else if (slotId >= 100) { /* field buildings, remove all else */
			start = 1;
			end = 5;
			
		} else if (slotId == 1) { /* wall */
			start = 0;
			end = 1;
		}
		
		var	buildingTypeId:int;
		var	reqs:Array;
		var emptyInfo:EmptySlotInfo;
		var	req:Array;
		var reqsmet:boolean = true;
		var j:int;
		var common:Utility = Utility.instance();
		
		for( var i:int = start; i < end; i ++ ){
			buildingTypeId = allBuildingTypeIds[i];
			if( !validBuilding( buildingTypeId ) )
				continue;
			
			emptyInfo = new EmptySlotInfo();
			reqs = common.checkreq("b", buildingTypeId, 1);
			req = reqs[3];
			
			for( j = 0; j < req.length; j ++ ){
				if( req[j] == 0 ){
					reqsmet = false;
					break;
				}
			}
			
			if( !reqsmet ){
				emptyInfo.valid = false;
			}else{
				emptyInfo.valid = true;
			}
			emptyInfo.buildingTypeId = buildingTypeId;
			
			ret.Add(emptyInfo);
		}
		return ret;
	}
	
	private function validBuilding( buildingTypeId:int ):boolean{
		for( var i:int = nonUniqueBuildingIds.length - 1; i >= 0; i -- ){
			if( nonUniqueBuildingIds[i] == buildingTypeId ){
				return true;
			}
		}
		
		return getCountForType(buildingTypeId, GameMain.instance().getCurCityId()) == 0;
	}
	
	public class	BuildingInfo{
		public var	typeId:int;
		public var	curLevel:int;
		public var	buildingRank:int;
		public var	buildtime:int;
		public  var canbeDestoryed:boolean;
		public var canBeCanceBuild:boolean;
		public  var isTopLevel:boolean;
		public  var isDestorying;
		/* added info.. */
		public var cityId:int;
		public var buildName:String;
		public var slotId : int;
		public var buildingTexturePath : String;
		public var description : String;
		public var nextLevel_description : String;
		public var curLevel_description : String;
		public var queueStatus: Object; /*BuildingQueueMgr::QueueElement. */
		public var otherQueueStatus:Object;
		public var requirements:System.Collections.Generic.List.<Requirement> = new System.Collections.Generic.List.<Requirement>();
		public var req_ok : boolean;
		public var isOtherUpgrade : boolean;
		public var callBack:Function;
		
		public function BuildingInfo()
		{
			canbeDestoryed = true;	
			isDestorying = false;		
			canBeCanceBuild = true;
		}

		public function syncReq():void
		{
			req_ok = true;
			if(requirements){
				for(var i:int=0; i<requirements.Count; i++) {
					var idata:Requirement = requirements[i];
					if(!idata.ok && idata.ok != 'true') {
						req_ok = false;		
						break;
					}
				}
			}
		}
	}
	
	public function buildingInfo(slotId:int, newBuildingTypeId:int):BuildingInfo{

		var	gMain:GameMain = GameMain.instance();
		var common:Utility = Utility.instance();
		var curCityId:int = gMain.instance().getCurCityId();
		
		var	ret:BuildingInfo = new BuildingInfo();
		var	slotInfo:HashObject = seed["buildings"]["city" + curCityId]["pos" + slotId];
		ret.typeId = slotInfo ? _Global.INT32(slotInfo[_Global.ap + 0] ) : newBuildingTypeId;
		ret.curLevel = slotInfo ? _Global.INT32(slotInfo[_Global.ap + 1]) : 0;
		ret.buildingRank = Mathf.Max(Mathf.Ceil(ret.curLevel / 3), 1);
		ret.slotId = slotId;

	/*		ret.buildingTexturePath = "bi_" + ret.typeId; */

		var GDS_building = GameMain.GdsManager.GetGds.<GDS_Building>();
		if(ret.curLevel == 0)
		{
			ret.buildingTexturePath = GDS_building.getBuildingIconName(ret.typeId,1);
		}
		else
		{
			ret.buildingTexturePath = GDS_building.getBuildingIconName(ret.typeId,ret.curLevel);
		}
		
		ret.isTopLevel = (ret.curLevel == GDS_building.getBuildingTopLevel(newBuildingTypeId));
		ret.cityId = curCityId;

		/* fix some common information.. */
		var arString :Datas = Datas.instance();		
		
		ret.buildName = arString.getArString("buildingName."+"b" + ret.typeId);		
		ret.description = arString.getArString("buildingDesc."+"b" + ret.typeId);
		if(ret.curLevel == 0)
			ret.curLevel_description =  Datas.getArString("buildingDescShort.b" + ret.typeId);
		else
			ret.curLevel_description = arString.getArString("buildingLevelDesc."+ret.typeId + "_" + (ret.curLevel-1));
		
		/* status ..  is building? upgrading? destroying? search it from BuildingQueueMgr. */

		var qe:BuildingQueueMgr.QueueElement = BuildingQueueMgr.instance().first(curCityId);
		ret.isOtherUpgrade = (qe != null);
		if(qe && qe.slotId == slotId) 
		{
			ret.queueStatus = qe;		
			ret.isOtherUpgrade = false;			
			ret.isDestorying = (qe.level < ret.curLevel);
		}
		else
		{
			ret.otherQueueStatus = qe;
		}
		switch(ret.typeId)
		{
			case Constant.Building.PALACE:
			case Constant.Building.WALL:
			case Constant.Building.GENERALS_QUARTERS:
			case Constant.Building.RALLY_SPOT:
			case Constant.Building.WATCH_TOWER:
			case Constant.Building.MUSEUM:
				ret.canbeDestoryed = false;
				break;
		}
		
		var nextLevel = ret.curLevel + 1;
		if(ret.isTopLevel)
		{
			ret.nextLevel_description = Datas.getArString("BuildingModal.TopLevel");
		}
		else
		{				
			/* ret.nextLevel_description = arString.getArString("buildingLevelDesc."+ret.typeId + "_" + ret.curLevel); */
			ret.nextLevel_description = getNextLevelDescription(ret.typeId,ret.curLevel);
		}
		ret.buildtime = getBuildTimeForLevel(ret.typeId, nextLevel);

		/* requirements variables */
		/* ret.requirements = common.checkreq("b", ret.typeId, nextLevel); */

		ret.requirements = getBuildReqs(ret.typeId, nextLevel);
		ret.syncReq();
		return ret;
	}
		
	public function getInstantBuildGem(buildingTypeId:int,level:int):int
	{
		var timeRequired:int = getBuildTimeForLevel(buildingTypeId, level);
		var	goldRequired:int = SpeedUp.instance().getTotalGemCost(timeRequired);
		return goldRequired;
	}
	
	public function instantBuild(buildingTypeId:int, currentLevel:int, cityPos:int, resourceToGems:float):boolean
	{
		var nextLevel:int = currentLevel + 1;
		var timeRequired:int = getBuildTimeForLevel(buildingTypeId, nextLevel);
		var	goldRequired:int;
		
		var rate:float = _Global.FLOAT(seed["buyUpgradRateBuilding"].Value);
		
		var tmpTimeceil:int = _Global.INT32(SpeedUp.instance().getTotalGemCost(timeRequired)*_Global.INT32(rate*10000) + 9999)/10000;
			
		if(seed["buyUpgradRateBuilding"])
			goldRequired = tmpTimeceil + Mathf.Ceil(resourceToGems*rate);
		else
			goldRequired = SpeedUp.instance().getTotalGemCost(timeRequired) + resourceToGems;
		
		var	itemsList:String = SpeedUp.instance().getItemListString(timeRequired);
		
		var curCityId = GameMain.instance().getCurCityId();
		
		if(Payment.instance().CheckGems(goldRequired))
		{
			var okFunc:Function = function(result:HashObject){
//				_Global.Log("instantBuildOK");

/*				if (MyItems.instance().countForItem(401) > 0 && nextLevel == 10)
				{
					MyItems.instance().subtractItem(401);
				}
				*/
				subtractBuildingLevleUpItem(buildingTypeId,nextLevel);
				if (result["updateSeed"]) {
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}
				var isReal:boolean = result["isWorldGem"]?result["isWorldGem"].Value == false:true;
				Payment.instance().SubtractGems(goldRequired,isReal);
				

				//TODO: add queue and update display
				
				BuildingQueueMgr.instance().add(curCityId,
					{_Global.ap + 0:buildingTypeId, 
						_Global.ap + 1:nextLevel, 
						_Global.ap + 2:_Global.INT32(result["buildingId"]), 
						_Global.ap + 3:0, 
						_Global.ap + 4:0, 
						_Global.ap + 5:0, 
						_Global.ap + 6:0, 
						_Global.ap + 9:cityPos,
						_Global.ap + 10:currentLevel});
						
				BuildingQueueMgr.instance().update();
//				//force update .0802.		
//				UpdateSeed.instance().update_seed_ajax(true,null);

			};
			
			var	errorFunc:Function = function(msg : String, errorCode : String, feedback : String)
			{
				if(errorCode == "UNKNOWN")
					return;

				var errorMsg:String = errorCode == UnityNet.NET_ERROR ? Datas.getArString("Error.Network_error") : UnityNet.localError( errorCode, msg, feedback );
								
				if(errorCode != UnityNet.NET_ERROR && _Global.INT32(errorCode) == 3000 && MenuMgr.getInstance().GetCurMenu() != MenuMgr.getInstance().MainChrom)
					MenuMgr.getInstance().PopMenu("");			
				
				if( errorMsg != null )
				{
					ErrorMgr.instance().PushError("",errorMsg, true,Datas.getArString("FTE.Retry"), null);
				}
							
				GameMain.instance().seedUpdate(false);
			};
			
		
			
			var okCostFunc:Function = function()
			{
				var params:Array = new Array();
				params.Add(curCityId);
				params.Add(goldRequired);
				params.Add(itemsList);
				params.Add(nextLevel);
				params.Add(cityPos);
				params.Add(buildingTypeId);
				
				if( nextLevel > 1 ){
					params.Add(seed["buildings"]["city" + curCityId]["pos" + cityPos][_Global.ap + 3].Value);
				}
				
	/*			UnityNet.reqInstantBuild(params,okFunc,Building.resultError); */
				UnityNet.reqInstantBuild(params,okFunc,errorFunc);
			};
			
			var open : boolean = SpeedUp.instance().GetSpeedUpIsOpenHint();
			if(goldRequired >= GameMain.instance().gemsMaxCost() && !open)
			{
				var contentData : Hashtable = new Hashtable(
				{
					"price":goldRequired
				});
	            MenuMgr.getInstance().PushMenu("SpeedUpDialog", contentData , "trans_zoomComp"); 
				MenuMgr.getInstance().getMenuAndCall("SpeedUpDialog", function(menu : KBNMenu) {
					var SpeedUpDialogmenu:SpeedUpDialog = menu as SpeedUpDialog;
					if(SpeedUpDialogmenu != null)
		           {
					SpeedUpDialogmenu.setAction(okCostFunc);
				   }
				});

			}
			else
			{
				okCostFunc();
			}			
		}
		else
		{
			return false;
		}
		return true;
	}
	
	/* Performs the net call to do construct the building */
	public function buildAction(buildingTypeId:int, currentLevel:int, cityPos:int){
		
		var nextLevel :int = currentLevel + 1;
		var curCityId:int = GameMain.instance().getCurCityId();
		if( BuildingQueueMgr.instance().full(curCityId) && getBuildTimeForLevel(buildingTypeId, nextLevel) > 0){
			//TODO: error msg
			return false;
		}
		var reqs:Array = Utility.instance().checkreq("b", buildingTypeId, nextLevel);
		for( var req:Requirement in reqs ){
			if( !req.ok ){
				//TODO: error msg
				return false;
			}
		}
		
		var okFunc:Function = function(result:HashObject){
			var time:int = _Global.parseTime(result["timeNeeded"]);//getBuildTimeForLevel(buildingTypeId, nextLevel);
			var startTime:long = _Global.parseTime(result["resmicrotime"]);
			SoundMgr.instance().PlayEffect( "start_construction", /*TextureType.AUDIO*/"Audio/");
			for( var resourceId:int = 0; resourceId <= 4; resourceId ++ )
			{
				Resource.instance().addToSeed(resourceId, GameMain.GdsManager.GetGds.<GDS_Building>().getCostResource(buildingTypeId,nextLevel,resourceId) * -1, curCityId);
			}
			/*
			if (MyItems.instance().countForItem(401) > 0 && nextLevel == 10)
			{
				MyItems.instance().subtractItem(401);
			}
			*/
			subtractBuildingLevleUpItem(buildingTypeId,nextLevel);

			Resource.instance().UpdateRecInfo();
			
//			_Global.Log("GameMain.unixtime():" + GameMain.unixtime() + " resmicrotime:" + result["resmicrotime"]
//						+ " parse time:" + _Global.parseTime(result["resmicrotime"]) + " timeNeeded:" + time);
			BuildingQueueMgr.instance().add(curCityId,
				{_Global.ap + 0: buildingTypeId, 
				_Global.ap + 1:nextLevel, 
				_Global.ap + 2:_Global.INT32(result["buildingId"]), 
				_Global.ap + 3:startTime, 
				_Global.ap + 4:(startTime + time), 
				_Global.ap + 5:time, 
				_Global.ap + 6:time, 
				_Global.ap + 9:cityPos,
				_Global.ap + 7:result["help_cur"],
				_Global.ap + 8:result["help_max"],
				_Global.ap + 10:currentLevel
				});
			
//			_Global.Log(" currentLevel:" + currentLevel + " cityPos:" + cityPos);
			if (currentLevel == 0) 
			{
				seed["buildings"]["city" + curCityId]["pos" + cityPos] = new HashObject({_Global.ap + 0:buildingTypeId + "", 
																			_Global.ap + 1:0 + "", 
																			_Global.ap + 2:cityPos + "", 
																			_Global.ap + 3:result["buildingId"]});
																			
				var a:HashObject = seed["buildings"]["city" + curCityId]["pos" + cityPos];
				
				var lv:int = _Global.INT32(a[_Global.ap + 1]);
				var type:int = _Global.INT32(a[_Global.ap + 0]);
//				_Global.Log(" curCityId:" + curCityId + " pos:" + cityPos + " lv:" + lv + " type:" + type );
			}
			
//			if (MyItems.instance().countForItem(401) > 0) {
//				MyItems.instance().subtractItem(401);
//			}
			
			if (result["updateSeed"]) 
			{
				UpdateSeed.instance().update_seed(result["updateSeed"]);
				Resource.instance().UpdateRecInfo();
			}
			
//			if (result["newSlotId"]) { // barracks and walls generate new training queue slots
//				if (buildingTypeId == Constant.Building.BARRACKS) 
//				{
//					Barracks.instance().Queue.addSlot(result["newSlotId"], curCityId);
//				}
//				else if (buildingTypeId == Constant.Building.WALL) 
//				{
//					Walls.instance().Queue.addSlot(result["newSlotId"]);
//				}
//			}

		};
		
		var	errorFunc:Function = function(msg:String, errorCode:int){
//			_Global.Log("buildActionError:"+msg + " code:" + errorCode);
		};
		
		var params:Array = new Array();
		params.Add(curCityId);
		params.Add(cityPos);
		params.Add(nextLevel);
		params.Add(buildingTypeId);
		
		if( nextLevel > 1 )
		{		
			params.Add(seed["buildings"]["city" + curCityId]["pos" + cityPos][_Global.ap + 3].Value);
		}
		
//		UnityNet.reqBuild(params, okFunc, Building.resultError );
		UnityNet.reqBuild(params, okFunc, null );
	}
	
	// Performs the call to remove a building completely (salvage/deconstruct)
	public function deleteAction(buildingTypeId:int, currentLevel:int, cityPos:int)	// should add a Queue......
	{
		var curCityId:int = GameMain.instance().getCurCityId();
		
		var okFunc:Function = function(result:HashObject){
//			_Global.Log("DeleteActionOk");
			
			var buildtime:int= result["timeNeeded"].Value;
			var	startTime:long = GameMain.unixtime();
			
			BuildingQueueMgr.instance().add( curCityId, {_Global.ap + 0: buildingTypeId, 
															_Global.ap + 1: 0, 
															_Global.ap + 2: _Global.INT32(result["buildingId"]), 
															_Global.ap + 3: startTime, 
															_Global.ap + 4: (startTime + buildtime), 
															_Global.ap + 5: buildtime, 
															_Global.ap + 6: buildtime, 
															_Global.ap + 9: _Global.INT32(cityPos),
															_Global.ap + 7:result["help_cur"],
															_Global.ap + 8:result["help_max"],
															_Global.ap + 10:currentLevel
															});

			if (result["updateSeed"]) {
				UpdateSeed.instance().update_seed(result["updateSeed"]);
			}
		};
		
		var	errorFunc:Function = function(msg:String, errorCode:int){
//			_Global.Log("DeleteActionError:"+msg);
		};
		
		var params:Array = new Array();
		params.Add(curCityId);
		params.Add(cityPos);
		params.Add(currentLevel-1);
		params.Add(buildingTypeId);
		
		if (currentLevel > 0) {
			params.Add(_Global.INT32(seed["buildings"]["city" + curCityId]["pos" + cityPos][_Global.ap + 3]));
		}
		
//		UnityNet.reqDelete(params, okFunc, Building.resultError );
		UnityNet.reqDelete(params, okFunc, null );
	}
	
	public function subtractBuildingLevleUpItem(btypeId:int,targetLevel:int):void
	{
		var needItems:System.Collections.Generic.IEnumerable.<HashObject> = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildNeedItems(btypeId,targetLevel);
		//var itemObj:HashObject;
		var itemId:int;
		var needNum:int;
		for ( var itemObj:HashObject in needItems )
		//for(var i:int=0;i<needItems.length;i++)
		{
			//itemObj = needItems[i] as HashObject;
			if(itemObj != null)
			{
				itemId = _Global.INT32(itemObj["itemId"]);
				needNum = _Global.INT32(itemObj["num"]);
				if(needNum > 0 )
					MyItems.instance().subtractItem(itemId,needNum);
			}
		}
	}
	
	//cancel build action
	public function refundBuildingLevleUpItem(btypeId:int,targetLevel:int):void
	{
		var needItems:System.Collections.Generic.IEnumerable.<HashObject> = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildNeedItems(btypeId,targetLevel);
		//var itemObj:HashObject;
		var itemId:int;
		var needNum:int;
		
		for ( var itemObj:HashObject in needItems )
		//for(var i:int=0;i<needItems.length;i++)
		{
			//itemObj = needItems[i] as HashObject;
			if(itemObj != null)
			{
				itemId = _Global.INT32(itemObj["itemId"]);
				needNum = _Global.INT32(itemObj["num"]);
				if(needNum > 0 )
					MyItems.instance().AddItem(itemId,needNum);
			}
		}
	}
	
	public function cancelAction(currentLevel:int, buildingSlotId:int){
		var curCityId:int = GameMain.instance().getCurCityId();
		
		var okFunc:Function = function(result:Object){
//			_Global.Log("cancelActionnOK");
			
			var targetLevel = BuildingQueueMgr.instance().first(curCityId).level;
			var	buildingTypeId = _Global.INT32(seed["buildings"]["city" + curCityId]["pos" + buildingSlotId][_Global.ap + 0]);
			var	buildingLevel = _Global.INT32(seed["buildings"]["city" + curCityId]["pos" + buildingSlotId][_Global.ap + 1]);
			var	i:int;
			
			var qe:QueueItem = BuildingQueueMgr.instance().cancel(curCityId);
			// set the old level.....
			
			qe.level = buildingLevel;
			
			// cancel Upgrading OR Destorying.
			
//			seed.queue_con['city' + currentcityid] = []; // reset queue
//			Modal.hideModal();
//			if (currentLevel === 0) {
//				removeCityFromView(buildingSlotId);
//			} else {
//				build(buildingSlotId);
//			}
//			if (modViewsCity.hasClassName('sel')) {
//				changeview_city(modViewsField);
//			} else if (modViewsField.hasClassName('sel')) {
//				changeview_fields(modViewsField);
//			}
			if (buildingLevel > 0 && targetLevel != 0) 
			{
				for (i = 0; i <= 4; i++) 
				{ // return resources
					Resource.instance().addToSeed(i, GameMain.GdsManager.GetGds.<GDS_Building>().getCostResource(buildingTypeId,targetLevel,i) * 0.5, curCityId);
				}
				Resource.instance().UpdateRecInfo();
			}
			
			//refund item
//			refundBuildingLevleUpItem(buildingTypeId,targetLevel);
			
		};
		
		var	errorFunc:Function = function(msg:String, errorCode:int){
//			_Global.Log("cancelActionError:"+msg);
		};
		
		var  bid:int = _Global.INT32(seed["buildings"]["city" + curCityId]["pos" + buildingSlotId][_Global.ap + 3]);
		var params:Array = new Array();
		params.Add("CANCEL_CONSTRUCTION");
		params.Add(curCityId);
		params.Add(buildingSlotId);
		params.Add(bid);
		
//		UnityNet.reqCancelBuild(params, okFunc, Building.resultError );
		UnityNet.reqCancelBuild(params, okFunc, null );
	}
	
	public function destructAction(cityPos:int)	// remove building immediately.
	{
	
		var currentcityid:int = GameMain.instance().getCurCityId();
		var okFunc:Function = function(result:Object){
//			_Global.Log("destructActionOK");
			
			var resource:Resource = Resource.instance();
			
			var buildingLevel:int = _Global.INT32(seed["buildings"]["city" + currentcityid]["pos" + cityPos][_Global.ap + 1]);
			var	buildingTypeId:int = _Global.INT32(seed["buildings"]["city" + currentcityid]["pos" + cityPos][_Global.ap + 0]);
			
			var	popCap:int = resource.populationCap(currentcityid);
			var pop:int = resource.populationCount(currentcityid);

			MyItems.instance().subtractItem(9);
			
//			_Global.Log( " set city:" + currentcityid + " pos:" + cityPos + " to null" );
			seed["buildings"]["city" + currentcityid].Remove("pos" + cityPos);
//			_Global.Log(" === null:" + (seed["buildings"]["city" + currentcityid]["pos" + cityPos]==null));
			
//			BuildingQueueMgr.instance().cancelSlot(currentcityid,cityPos);	//delete .. remove the progressBar if possible.
			 
//			var buildingmight:Object = Datas.instance().buildingmight();
			var acc:int = 0;
			var i:int;
			
//			for( i = 1; i <= buildingLevel; i ++ ){
//				acc += buildingmight[_Global.ap + buildingTypeId][_Global.ap + i];
//			}
//			seed["player"]["might"] = _Global.INT64(seed["player"]["might"]) - acc;

			// adjust population
			acc = 0;
			
			if (buildingTypeId >= 1 && buildingTypeId <= 4) { // field building
				for( i = 1; i <= buildingLevel; i ++ ){
					acc += i * 10;
				}
				seed["citystats"]["city" + currentcityid]["pop"][_Global.ap + 3].Value = resource.populationLabor(currentcityid) - acc;
			} else if (buildingTypeId == Constant.Building.VILLA) {
				for( i = 1; i <= buildingLevel; i ++ ){
					acc += i * 100;
				}
				
				popCap = popCap - acc;
				if (popCap < 50) {
					popCap = 50; // base value
				}
				if (pop > popCap) {
					seed["citystats"]["city" + currentcityid]["pop"][_Global.ap + 0].Value = popCap;
				}
				seed["citystats"]["city" + currentcityid]["pop"][_Global.ap + 1].Value = popCap;
			}
			//just here 
			GameMain.instance().onBuildingFinish(cityPos,0,0,buildingLevel);	//
			
				
//			update_might();
//			update_pop();
		};
		
		var	errorFunc:Function = function(msg:String, errorCode:int){
//			_Global.Log("destructActionError:"+msg);
		};
		
		var  bid:int = _Global.INT32(seed["buildings"]["city" + currentcityid]["pos" + cityPos][_Global.ap + 3]);
		var params:Array = new Array();
		params.Add("DESTROY_BUILDING_DRAGON_STOMP_MEDAL");
		params.Add(currentcityid);
		params.Add(bid);
		params.Add(cityPos);
		
//		UnityNet.reqDestruct(params, okFunc, Building.resultError );
		UnityNet.reqDestruct(params, okFunc, null );
	}
	
	public function BuildDestroyed(cityPos:int,cityId):void
	{
			var currentcityid:int = cityId;	//GameMain.instance().getCurCityId();

			var resource:Resource = Resource.instance();
			
			var buildingLevel:int = _Global.INT32(seed["buildings"]["city" + currentcityid]["pos" + cityPos][_Global.ap + 1]);
			var	buildingTypeId:int = _Global.INT32(seed["buildings"]["city" + currentcityid]["pos" + cityPos][_Global.ap + 0]);
			
			var	popCap:int = resource.populationCap(currentcityid);
			var pop:int = resource.populationCount(currentcityid);

			

			seed["buildings"]["city" + currentcityid].Remove("pos" + cityPos);
	
//			var buildingmight:Object = Datas.instance().buildingmight();
			var acc:int = 0;
			var i:int;
			
//			for( i = 1; i <= buildingLevel; i ++ ){
//				acc += buildingmight[_Global.ap + buildingTypeId][_Global.ap + i];
//			}
//			seed["player"]["might"] = _Global.INT64(seed["player"]["might"]) - acc;

			// adjust population
			acc = 0;
			
			if (buildingTypeId >= 1 && buildingTypeId <= 4) { // field building
				for( i = 1; i <= buildingLevel; i ++ ){
					acc += i * 10;
				}
				seed["citystats"]["city" + currentcityid]["pop"][_Global.ap + 3].Value = resource.populationLabor(currentcityid) - acc;
			} else if (buildingTypeId == Constant.Building.VILLA) {
				for( i = 1; i <= buildingLevel; i ++ ){
					acc += i * 100;
				}
				
				popCap = popCap - acc;
				if (popCap < 50) {
					popCap = 50; // base value
				}
				if (pop > popCap) {
					seed["citystats"]["city" + currentcityid]["pop"][_Global.ap + 0].Value = popCap;
				}
				seed["citystats"]["city" + currentcityid]["pop"][_Global.ap + 1].Value = popCap;
			}
			//just here 
			//GameMain.instance().onBuildingFinish(cityPos,0,0 );	//
	
	}
	
	public function upgradeAction(buildingTypeId:int, currentLevel:int, cityPos:int)
	{
		this.buildAction(buildingTypeId,currentLevel,cityPos);
	}
	
	public function speedUPAction(cityPos:int):void
	{
		
	}
	
	public function removeCityFromView (buildingSlotId) {
//		var slotElem = $('slot_' + buildingSlotId);
//
//		delete seed.buildings['city' + currentcityid]['pos' + buildingSlotId];
//
//		if (slotElem) {
//			slotElem.update('');
//			slotElem.className = 'blank';
//		}
//		seed.queue_con['city' + currentcityid].each(function (queue, index) {
//			if (_Global.INT32(queue[7], 10) === _Global.INT32(buildingSlotId, 10)) {
//				seed.queue_con['city' + currentcityid].splice(index, 1);
//				throw $break;
//			}
//		});
//		return true;
	}
	
	// Returns the total number of buildings of a particular type that exist
	// in the current city.
	//
	public function getCountForType (buildingTypeId:int, cityId:int):int {
		return getAllOfType(buildingTypeId, cityId).length;
	}

	// This gets the maximum level for a bulding if a player has one or more
	// in the current city, returning 0 if no buliding of that type exists.
	//
	public function getMaxLevelForType(buildingTypeId:int,cityId:int):int {
		
		var allType:Array = getAllOfType(buildingTypeId, cityId);
		var ret:int = 0;
		var lv:int;
		for( var i:int = 0; i<allType.length; i ++ ){
			lv = _Global.INT32((allType[i] as HashObject)[_Global.ap + 1]);
			if( lv > ret ){
				ret = lv;
			}
		}
		
		return ret;
	}
	public function getMaxLevelForType(buildingTypeId:int):int {
		var lvlMax:int = 0;
		var cities:Hashtable = seed["cities"].Table;
		for(var c:System.Collections.DictionaryEntry in cities)
		{
			var cityInfor:HashObject = c.Value;
			var cityId:int = _Global.INT32(cityInfor[_Global.ap + 0]);
			var lvl:int = getMaxLevelForType(buildingTypeId,cityId);
			if(lvl >lvlMax)
			{
				lvlMax = lvl;
			}
		}
		return lvlMax;
	}
	
	
	//----------------------------------------------------------------------------------------//	
	public function getLevelsSumForType(buildingTypeId:int, cityId:int):int
	{
		var alltype:Array = getAllOfType(buildingTypeId, cityId);
		var collectFun:Func.<HashObject, int> = function(building:HashObject)
		{
			return _Global.INT32(building[_Global.ap + 1]);
		};
		
		var buildType:int[] = _Global.CollectArray(alltype.ToBuiltin(HashObject), collectFun);
		var sum:int = 0;
		for(var a=0; a < buildType.length; a++)
		{
			sum += buildType[a];
		}
		
		return sum;
	}		
	
	public function getLevelsSumForType(buildingTypeId:int):int {
		var sum:int = 0;
		var cities:Hashtable = seed["cities"].Table;
		for(var c:System.Collections.DictionaryEntry in cities)
		{
			var cityInfor:HashObject = c.Value;
			var cityId:int = _Global.INT32(cityInfor[_Global.ap + 0]);
			var lvl:int = getLevelsSumForType(buildingTypeId,cityId);
			var sureLvl : int = GameMain.GdsManager.GetGds.<GDS_Building>().getMaxMarch(buildingTypeId,lvl);
			sum += sureLvl;
		}
		return sum;
	}
	
	//----------------------------------------------------------------------------------------//	

	//
	// Returns an array of all buildings of a particular type, each as an array (see getAll())
	// Can accept an optional cityId paramenter
	//
	public function getAllOfType(buildingTypeId:int, cityId:int):Array
	{
		var	ret:Array = new Array();
		var info:Array = getAll(cityId);
		var obj: HashObject;
		var key1: String = _Global.ap + 0;
		var key2: String = _Global.ap + 1;
		for(var i:int = 0; i < info.length; i++)
		{
			if (info[i] != null) {
				obj = info[i] as HashObject;
				if ( _Global.INT32(obj[key1]) == buildingTypeId && _Global.INT32(obj[key2] ) > 0)
				{
					ret.Push(info[i]);
				}
			}
		}
		
		return ret;

	}
	
	// Returns the position for a building on the map. In the case of multiple buildings,
	// only the first one will be returned. Integer.
	// Will return null if no building exists
	//
	public function getPositionForType (buildingTypeId:int) :int{
		var buildings:Array = this.getAllOfType(buildingTypeId, GameMain.instance().getCurCityId());
		if (buildings.length > 0) {
			return _Global.INT32((buildings[0] as HashObject)[_Global.ap + 2]);
		} else {
			return -1;
		}
	}
	
	// Return all buildings. Each building is gathered from seed.buildings,
	// each an array of data. e.g. ['2', '1', '103', 374'] [buildingTypeId, level, position, id]
	//
	public function getAll(cityId:int):Array
	{
		var positions:HashObject = seed["buildings"]["city" + cityId]; // all existing positions of buildings
		var keys:Array = _Global.GetObjectKeys(positions);
		var ret:Array = new Array();
		
		for( var i:int = 0; i < keys.length; i ++ )
		{
			ret.Push(positions[keys[i]]);
		}
		
		return ret;
	}
	
	// Returns the building time, in seconds, for a building given the level,
	// taking into account bonuses.
	// targetLevel is the level you want the time for
	public function getBuildTimeForLevel(buildingTypeId:int, targetLevel:int):int 
	{
		var	basetime:int = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildBaseTimeForLevel(buildingTypeId,targetLevel);
		if(basetime > 0)
		{
			basetime = basetime;
			var vipBuff:int = 0;
			if(GameMain.instance().IsVipOpened())
			{
				var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
				var vipLevel:int = GameMain.instance().GetVipOrBuffLevel();
				var vipDataItem: KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(vipLevel);
				if(vipDataItem != null)
				{
					vipBuff =  vipDataItem.CONSTRUCT;
				}
			}
			
			var buffValue:BuffValue = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.CreateSpeed, new BuffSubtarget( BuffSubtargetType.BuildingType, 0 ));
			return _Global.INT32( (basetime - buffValue.Number) / (1 + 
											General.instance().politicsBonus() + 
											Research.instance().bonusForType(Constant.Research.CRANES) + 
											HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Build) + 0.01f * vipBuff + 
											buffValue.Percentage + Technology.instance().getReducedTimeToBuild()
											));
		}
		else
			return 0;
	}

	public function hasBuildingbyType(cityId,type:int):boolean
	{
		var vl:Array = _Global.GetObjectValues(seed["buildings"]["city" + cityId]);
		for(var i:int=0;i<vl.length;i++)
		{
			if(vl[i] != null && _Global.INT32((vl[i] as HashObject)[_Global.ap + 0]) == type)
				return true;
		}
		return false;
	}

	
	public function getBuildingObjById(cityId:String, bid:int):HashObject
	{
		var buildings:HashObject = seed["buildings"];
		var vl:Array = _Global.GetObjectValues(seed["buildings"][cityId]);
		for(var i:int=0; i<vl.length; i++)
		{
			if(vl[i] != null && _Global.INT32((vl[i] as HashObject)[_Global.ap + 3]) == bid)
			{
	//			return Datas.getArString("buildingName.b" + vl[i][_Global.ap + 0]);
				return vl[i];
			}
		}
	}
	
	//todo rally
//	 [5,13,11,7,9,12,8,15,16,14,17,18,20,24]
//			,[5,13,11,7,9,12,8,15,16,14,17,18,24]
//			,[5,13,11,7,9,12,8,15,16,14,17,18,24]
//			,[5,13,11,7,9,12,8,15,16,14,17,18,24]
//			,[5,13,11,7,9,12,8,15,16,14,17,18,22,24]

protected static var cityBuildListOrder1: Array = [5, 13, 11, 7, 9, 12, 8, 15, 16, 14, 17, 18, 20];
protected static var cityBuildListOrder2: Array = [5, 13, 11, 7, 9, 12, 8, 15, 16, 14, 17, 18];
protected static var cityBuildListOrder3: Array = [5, 13, 11, 7, 9, 12, 8, 15, 16, 14, 17, 18];
protected static var cityBuildListOrder4: Array = [5, 13, 11, 7, 9, 12, 8, 15, 16, 14, 17, 18];
protected static var cityBuildListOrder5: Array = [5, 13, 11, 7, 9, 12, 8, 15, 16, 14, 17, 18, 22];

	protected	static var fieldBuildListOrder:Array = [1,2,3,4];

	public function getCreatBuildingList(cityId:int,slotId:int):Array
	{
		var type:int ;
		var list:Array= new Array();
		var obj:BuildingInfo;
		var i:int;
		var curList:Array;
		var curCityOrder:int = GameMain.instance().getCurCityOrder();
	
		
		if(slotId <=99)	//city..
		{
			if (curCityOrder == 1)
				curList = cityBuildListOrder1;
			else if (curCityOrder == 2)
				curList = cityBuildListOrder2;
			else if (curCityOrder == 3)
				curList = cityBuildListOrder3;
			else if (curCityOrder == 4)
				curList = cityBuildListOrder4;
			else if (curCityOrder == 5)
				curList = cityBuildListOrder5;
		}
		else	//field 
		{
			curList = fieldBuildListOrder;
		}

		//for(type = minType; type <=maxType; type ++)
		for(i=0;i<curList.length;i++)
		{	
			type = curList[i];
			//check this type building can build more?(some building only allowed one) 6 10 18

			if (type == 6 || type == 10 /*|| type == Constant.Building.RELIEF_STATION */
				|| type == 19)	//casino.
				continue; 
			// you'd better use nonUniqueBuildingIds array to check this condition.
			if(type<1 || (type>5 && type !=13 && type != 22) ) 
			{
				if(this.hasBuildingbyType(cityId,type) )
					continue;
			}
			obj = this.buildingInfo(-1,type);
			//get level 1 info when create building
			if( !CanBuildInThisCity(obj.typeId,1,curCityOrder))
			{
				continue;
			}
			list.push(obj);
		}
		return list;
	}
	public function openCreatBuilding(slotId:int):void
	{
		if (MenuMgr.getInstance().getState()==MENUSTATE.FadeIn) {return;}
		if(slotId == 1)	//wall statrts from lv0.
		{
			if(KBN.GameMain.singleton.IsOnClick){return;}
			openStandardBuilding(Constant.Building.WALL,slotId);
		}
		else if(slotId==Constant.Building.NOTICEPAD)//NOTICEPAD 
	    {
			MenuMgr.getInstance().PushMenu("ActivityEventListMenu", null);			
	    	return;
	    }
	    else if (slotId==Constant.Building.MONSTER)
	    {

			// MenuMgr.getInstance().PushMenu("MonsterMenu", null);	
			MonsterController.instance().AttackMonster(0,0);	
			// MonsterController.instance().GetMonsterPool();
	    	return;
	    }
	    else if (slotId==Constant.Building.MONTHLYCARD) {
	    	MenuMgr.getInstance().PushMenu("MonthlyCardMenu", null,"trans_zoomComp");
	    	return; 
	    }
	    else if(slotId == Constant.Building.AVAOUTPOST)
	    {
	    	if (GameMain.Ava.Event.CanEnterAvaMiniMap())
	    	{
//	    		GameMain.instance().GotoAVAMinimap();
				GameMain.Ava.Seed.RequestAvaSeed();
	    	}
	    	else
	    	{
		    	MenuMgr.getInstance().PushMenu("OutpostMenu", {"UseHomeButton": true} );			
	    	}
	    	return;
	    }
        else if (slotId == Constant.Hero.HeroHouseSlotId)
        {
			if(KBN.GameMain.singleton.IsOnClick){return;}
            openStandardBuilding(0,slotId);
        }
		else if(this.isEmptySlot(slotId) )
		{
			MenuMgr.getInstance().PushMenu("CreatBuilding", slotId);
			return;
		}
		
		

	}

	public function openStandardBuilding(type:int,slotId:int)
	{
		openStandardBuilding(type,slotId,"default_transition");
	}

	public function openStandardBuilding(type:int,slotId:int,transition:String)
	{
		
		if (MenuMgr.getInstance().getState()==MENUSTATE.FadeIn) {return;}
	//	_Global.Log("openStandardBuilindg type:" + type + " slotId:" + slotId);
	    if (slotId == Constant.Hero.HeroHouseSlotId)
	    {
	        GameMain.instance().OpenHero();
	        return;
	    }
	    
	
		var buildInfo :BuildingInfo ;	
		buildInfo = this.buildingInfo(slotId,type);	
		switch(type)
		{
			
			case Constant.Building.PALACE:
				MenuMgr.getInstance().PushMenu("NewCastleMenu", buildInfo,transition);
				break;
			case Constant.Building.TECHNOLOGY_TREE://23
				MenuMgr.getInstance().PushMenu("TechnologyTreeBuilding", buildInfo,transition);
				break;
					
			case Constant.Building.FARM:
			case Constant.Building.SAWMILL:
			case Constant.Building.QUARRY:
			case Constant.Building.MINE: // resource buildings (1-4) need to be here to show up in field
			case Constant.Building.VILLA:
				MenuMgr.getInstance().PushMenu("StandardBuilding", buildInfo,transition);
				break;
			case Constant.Building.BARRACKS:
				MenuMgr.getInstance().PushMenu("BarrackMenu", buildInfo,transition);
				break;
			case Constant.Building.ACADEMY:
				MenuMgr.getInstance().PushMenu("AcademyBuilding", buildInfo,transition);
				break;
			case Constant.Building.RALLY_SPOT:
				MenuMgr.getInstance().PushMenu("RallyPointBuilding",buildInfo,transition);
				break;
			case Constant.Building.WATCH_TOWER:
				MenuMgr.getInstance().PushMenu("WatchTowerMenu",buildInfo,transition);
				break;	
			case Constant.Building.GENERALS_QUARTERS:
				MenuMgr.getInstance().PushMenu("GeneralMenu",buildInfo,transition);
				break;
			case Constant.Building.WALL:
				MenuMgr.getInstance().PushMenu("WallMenu",buildInfo,transition);
				break;
			
			case Constant.Building.EMBASSY:
				MenuMgr.getInstance().PushMenu("EmbassyMenu",buildInfo,transition);
				break;
			case Constant.Building.MUSEUM:
				MenuMgr.getInstance().PushMenu("MuseumBuilding",buildInfo,transition);
				break;	
			case Constant.Building.STOREHOUSE:
				MenuMgr.getInstance().PushMenu("StoreHouseMenu", buildInfo,transition);
				break;
			case Constant.Building.WORKSHOP:
				MenuMgr.getInstance().PushMenu("WorkShopMenu", buildInfo,transition);
				break;
			case Constant.Building.BLACKSMITH:
				if (GearSysController.IsOpenGearSys())
					MenuMgr.getInstance().PushMenu("BlackSmithMenu", buildInfo,transition);
				else
					MenuMgr.getInstance().PushMenu("StandardBuilding", buildInfo,transition);
				break;
			case Constant.Building.COLISEUM:
			case Constant.Building.STABLE:
			case Constant.Building.RELIEF_STATION:
			case Constant.Building.MARKET:
				MenuMgr.getInstance().PushMenu("StandardBuilding", buildInfo,transition);
				//MenuMgr.getInstance().PushMenu("creatBuilding", slotId);
				break;
			case Constant.Building.HOSPITAL:
				MenuMgr.getInstance().PushMenu("HospitalMenu", buildInfo, transition);
				break;
			case Constant.Building.WAR_HALL:
				MenuMgr.getInstance().PushMenu("WarHallBuilding", {"selectIndex":0, "buildInfo":buildInfo}, transition);
				break;
		}
	
	}

	private function IsShowInFileds(buildingTypeId:int):boolean
	{
		return (buildingTypeId==Constant.Building.FARM || buildingTypeId==Constant.Building.SAWMILL
		|| buildingTypeId==Constant.Building.QUARRY || buildingTypeId==Constant.Building.MINE);
	}
	
	
	public function getPrefixOfBuildingImgName(curCityId:int,buildingTypeId:int):String
	{
		var prefix:String;
		
		if(IsShowInFileds(buildingTypeId))
		{
			prefix = "f1";
		}
		else
		{
			prefix = "c";
			if(buildingTypeId == 0)
			{
				//castle has different img in different city
				prefix = prefix + curCityId;
			}
			else
			{
				//others have same img with city 1
				prefix = prefix + 1;
			}
		}
		prefix = prefix + "_";
		return prefix;
	}
	
	public function getBuildingImgName(curCityId:int,buildingTypeId:int,buildingLevel:int):String
	{
		var prefix:String = getPrefixOfBuildingImgName(curCityId,buildingTypeId);
		var imgName:String = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingImgName(buildingTypeId,buildingLevel);
		imgName = prefix + imgName;

		return imgName;
	}
	
	// Duplicate to 'getBuildingImgName' method except that this one might throw an exception
	public function getBuildingImgNameWithThrow(curCityId : int, buildingTypeId : int, buildingLevel : int) : String
	{
		var prefix:String = getPrefixOfBuildingImgName(curCityId,buildingTypeId);
		var imgName:String = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingImgNameWithThrow(buildingTypeId,buildingLevel);
		imgName = prefix + imgName;
		return imgName;
	}
	
	public function getBuildingImgTexture(curCityId:int,buildingTypeId:int,buildingLevel:int):Texture2D
	{
		var imgName:String = getBuildingImgName(curCityId,buildingTypeId,buildingLevel);
		return TextureMgr.instance().LoadTexture(imgName,TextureType.BUILDING);
	}

	public function getCastleImgNameForField(curCityId:int,buildingLevel:int):String
	{
		var prefix:String = "f" + curCityId + "_";
		var imgName:String = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingImgName(Constant.Building.PALACE,buildingLevel);
		imgName = prefix + imgName;
		return imgName;
		
	}
	
	public function getNextLevelDescription(buildingTypeId:int,curLevel:int):String
	{
		var strKey:String = "buildingLevelDesc." + buildingTypeId + "_Prestige";
		var baseDesc:String = Datas.getArString(strKey);
		var nextLevel:int = curLevel + 1;
		var B_GDS:GDS_Building = GameMain.GdsManager.GetGds.<GDS_Building>();
		var retStr:String = baseDesc;
		var laborPopulation:int;
		switch(buildingTypeId)
		{
			case Constant.Building.FARM:
				laborPopulation = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_LABOR_POPULATION);
				var foodProduct:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_PRODUCTION_FOOD);
				var foodCapacity:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_RESOURCE_CAPACITY);
				retStr = retStr.Replace("{0}",laborPopulation.ToString());
				retStr = retStr.Replace("{1}",foodProduct.ToString());
				retStr = retStr.Replace("{2}",foodCapacity.ToString());
			break;
			case Constant.Building.SAWMILL:
				laborPopulation = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_LABOR_POPULATION);
				var woodProduct:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_PRODUCTION_WOOD);
				var woodCapacity:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_RESOURCE_CAPACITY);
				retStr = retStr.Replace("{0}",laborPopulation.ToString());
				retStr = retStr.Replace("{1}",woodProduct.ToString());
				retStr = retStr.Replace("{2}",woodCapacity.ToString());
			break;
			case Constant.Building.QUARRY:
				laborPopulation = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_LABOR_POPULATION);
				var stoneProduct:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_PRODUCTION_STONE);
				var stoneCapacity:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_RESOURCE_CAPACITY);
				retStr = retStr.Replace("{0}",laborPopulation.ToString());
				retStr = retStr.Replace("{1}",stoneProduct.ToString());
				retStr = retStr.Replace("{2}",stoneCapacity.ToString());
			break;
			case Constant.Building.MINE:
				laborPopulation = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_LABOR_POPULATION);
				var ironProduct:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_PRODUCTION_IRON);
				var ironCapacity:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_RESOURCE_CAPACITY);
				retStr = retStr.Replace("{0}",laborPopulation.ToString());
				retStr = retStr.Replace("{1}",ironProduct.ToString());
				retStr = retStr.Replace("{2}",ironCapacity.ToString());
			break;
			case Constant.Building.VILLA:
			//cottage
				var populationLimit:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_POPULATION_LIMIT);
				retStr = retStr.Replace("{0}",populationLimit.ToString());
			break;
			case Constant.Building.STOREHOUSE:
				var protectRes:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_PROTECT_RESOURCE);
							
				 if(nextLevel >= 22)
				 {
				 	var carmotProtectRes:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_CARMOTLIMIT_CAP);
				 	var carmotStrKey:String = "buildingLevelDesc." + buildingTypeId + "_Carmot";
				 	var carmotBaseDesc:String = Datas.getArString(carmotStrKey);
				 	retStr = String.Format(carmotBaseDesc, protectRes, carmotProtectRes);
				 }
				 else
				 {
				 	retStr = retStr.Replace("{0}",protectRes.ToString());
				 }
			break;
			case Constant.Building.RALLY_SPOT:
				var marchTroopLimit:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_MARCH_TROOP_LIMIT);
				var marchSlotLimit:int = B_GDS.getBuildingEffect(buildingTypeId,nextLevel,Constant.BuildingEffectType.EFFECT_TYPE_MARCH_SLOT_COUNT);
				retStr = retStr.Replace("{0}",marchSlotLimit.ToString());
				retStr = retStr.Replace("{1}",marchTroopLimit.ToString());
				break;
			case Constant.Building.HOSPITAL:
				var healCapacity : int = B_GDS.getBuildingEffect(buildingTypeId, nextLevel, Constant.BuildingEffectType.EFFECT_TYPE_CURE_UNIT_CAP);
				var healCount : int = B_GDS.getBuildingEffect(buildingTypeId, nextLevel, Constant.BuildingEffectType.EFFECT_TYPE_CURE_UNIT_COUT);
				retStr = retStr.Replace("{0}",healCapacity.ToString());
				retStr = retStr.Replace("{1}",healCount.ToString());
				break;
			case Constant.Building.WALL:
				retStr = Datas.getArString("buildingLevelDesc." + buildingTypeId + "_" + 1);
			break;
			default:
				retStr = Datas.getArString("buildingLevelDesc." + buildingTypeId + "_" + curLevel);	
			break;
		}
		
		return retStr;
	}
	
	public function CanBuildInThisCity(buildingTypeId:int,curLevel:int,cityOrder:int):boolean
	{
		var needCityOrder:String = GameMain.GdsManager.GetGds.<GDS_Building>().getNeedCityOrder(buildingTypeId,curLevel);
		if(needCityOrder != null && needCityOrder.Trim() != "")
		{
			var index:int = cityOrder - 1;
			if(index < needCityOrder.Length && index >= 0)
			{
				return (needCityOrder.Substring(index,1) == "1");
			}
		}
		return false;
	}
	
	public function getBuildPlayerLvReq(data:HashObject):Requirement
	{
		var seed:HashObject = GameMain.instance().getSeed();
		var requiredPlayerLevel:int = 0;
		var req:Requirement = null;
		var currentPlayerLevel:int = _Global.INT32(seed["player"]["title"]);
		if(data!=null && data["r11"]!=null)
		{
			requiredPlayerLevel = _Global.INT32(data["r11"]);
		}
		if (requiredPlayerLevel > 0)
		 { // don't show level 0 requirements
			req = new Requirement();
			req.type = 	YourLv;
			req.required = LV + " " + requiredPlayerLevel;
			req.own = LV + " " + currentPlayerLevel;
			req.ok = currentPlayerLevel >= requiredPlayerLevel;
		} // END player LEVEL requirement
		
		return req;	
	}
	
	public function getBuildBuildingReq(data:HashObject):Array
	{
		var seed:HashObject = GameMain.instance().getSeed();
		var	retArr:Array = new Array();
		var req:Requirement;
		var reqLv:int = 0;
		var curLv:int = 0;
		
		if(data != null)
		{
			var buildReqKeys:Array = _Global.GetObjectKeys(data);
			var key:String;
			var reqBuildTypeId:int = 0;
			
			for(var i:int=0;i<buildReqKeys.length;i++)
			{
				key = _Global.GetString(buildReqKeys[i]);
				if(key.StartsWith("r1_"))
				{
					reqBuildTypeId = _Global.INT32(key.Substring(3));
					reqLv = _Global.INT32(data[key]);
					if(reqLv > 0)
					{
						curLv = getMaxLevelForType(reqBuildTypeId, GameMain.instance().getCurCityId());
						var reqPrestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(reqBuildTypeId,reqLv);
						var curPrestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(reqBuildTypeId,curLv);
						req = new Requirement();
						req.type = Datas.getArString("buildingName."+"b" + reqBuildTypeId);
						req.reqPrestige = _Global.INT32(reqPrestigeData["prestige"]);
						req.ownPrestige = _Global.INT32(curPrestigeData["prestige"]);
						req.required = LV + " " + _Global.INT32(reqPrestigeData["level"]);
						req.own = LV + " " + _Global.INT32(curPrestigeData["level"]);
						req.ok = curLv >= reqLv;
						retArr.Push(req);
					}
				}
			}
		}
		return retArr;
	}
	
	public function getBuildTechReq(data:HashObject):Array
	{
		var seed:HashObject = GameMain.instance().getSeed();
		var	retArr:Array = new Array();
		var req:Requirement;
		var reqLv:int = 0;
		var curLv:int = 0;
		
		if(data != null)
		{
			var techReqKeys:Array = _Global.GetObjectKeys(data);
			var key:String;
			var reqTechId:int = 0;
			
			for(var i:int=0;i<techReqKeys.length;i++)
			{
				key = _Global.GetString(techReqKeys[i]);
				if(key.StartsWith("r2_"))
				{
					reqTechId = _Global.INT32(key.Substring(3));
					reqLv = _Global.INT32(data[key]);
					if(reqLv > 0)
					{
						curLv =  Research.instance().getMaxLevelForType(reqTechId);
						req = new Requirement();
						req.type = Datas.getArString("techName."+"t" + reqTechId);
						req.required = LV + " " + reqLv;
						req.own = LV + " " + curLv;
						req.ok = curLv >= reqLv;
						retArr.Push(req);
					}
				}
			}
		}
		return retArr;
	}
	
	public function getBuildCostResReq(data:HashObject):Array
	{
		var seed:HashObject = GameMain.instance().getSeed();
		var	retArr:Array = new Array();
		var req:Requirement;
		var reqNum:int = 0;
		var curNum:long = 0;
		
		if(data != null)
		{
			var techReqStr:String;
			var reqTechId:int = 0;
			
			//gold:0,food:1,wood,stone,iron,population,time 
			for(var i:int=0;i<8;i++)
			{
			if(i==5 || i==6) continue;
				if(data[_Global.ap+i] != null)
				{
					reqNum = _Global.INT32(data[_Global.ap+i]);
					if(reqNum > 0)
					{
						curNum =  Resource.instance().getCountForType(i, GameMain.instance().getCurCityId());
						req = new Requirement();
						req.type = Datas.getArString("ResourceName."+_Global.ap +i);
						req.typeId = i;
						req.required = _Global.NumFormat(reqNum);
						req.own = _Global.NumOnlyToMillion (curNum);
						req.ok = curNum >= reqNum;
						retArr.Push(req);
					}
				}
			}
		}
		return retArr;
	}
	
	public function getCostPopulationReq(data:HashObject):Requirement
	{
		var reqPopulation:int = 0;
		var req:Requirement = null;
		var curPopulation:int = Resource.instance().populationIdle(GameMain.instance().getCurCityId());
		if(data != null && data["a5"] !=null)
		{
			reqPopulation = _Global.INT32(data["a5"]);
			if (reqPopulation > 0)
			{
				req = new Requirement();
				req.type = 	Population;
				req.required = _Global.NumFormat(reqPopulation);
				req.own = _Global.NumOnlyToMillion(curPopulation);
				req.ok = curPopulation >= reqPopulation;	
			}
		}
		return req;
	}
	
	public function getBuildItemsReq(data:HashObject):Array
	{
		var seed:HashObject = GameMain.instance().getSeed();
		var	retArr:Array = new Array();
		var req:Requirement;
		var reqItemId:int;
		var reqNum:int = 0;
		var curNum:int = 0;
		
		if(data!=null)
		{
			var itemKeys:Array = _Global.GetObjectKeys(data);
			var key:String;
			
			for(var i:int=0;i<itemKeys.length;i++)
			{
				key = _Global.GetString(itemKeys[i]);
				if(key.StartsWith("r8_"))
				{
					reqItemId = _Global.INT32(key.Substring(3));
					reqNum = _Global.INT32(data[key]);
					if(reqNum > 0)
					{
						curNum = MyItems.instance().countForItem(reqItemId);
						req = new Requirement();
						req.type = Datas.getArString("itemName.i" + reqItemId);
						req.required = "" + reqNum;
						req.typeId = reqItemId;
						req.own = _Global.NumOnlyToMillion(curNum);
						req.ok = curNum >= reqNum;
						retArr.Push(req);
					}
				}
			}
		}
		return retArr;
	}
	
	public function getBuildReqs(targetId:int, targetLevel:int):System.Collections.Generic.List.<Requirement>
	{
		var reqData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildRequirementData(targetId,targetLevel);
		var costData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildCostData(targetId,targetLevel);
		
		var	retArr:System.Collections.Generic.List.<Requirement> = new System.Collections.Generic.List.<Requirement>();
		var buildingReqArr:Array;
		var techReqArr:Array;
		var itemReqArr:Array;
		var costReqArr:Array;
		var req:Requirement;
		var i:int=0;
		//Player Level Req
		req = getBuildPlayerLvReq(reqData);
		if(req != null) 
			retArr.Add(req);
		
		//Building Req
		buildingReqArr = getBuildBuildingReq(reqData);
		for(i=0;i<buildingReqArr.length;i++)
		{
			req = buildingReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Add(req);
		}
		
		//Tech Req
		techReqArr = getBuildTechReq(reqData);
		for(i=0;i<techReqArr.length;i++)
		{
			req = techReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Add(req);
		}
		
		//Resource
		costReqArr = getBuildCostResReq(costData);
		for(i=0;i<costReqArr.length;i++)
		{
			req = costReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Add(req);
		}
		
		//population
		req = getCostPopulationReq(costData);
		if(req != null) 
			retArr.Add(req);
		
		//Items Req
		itemReqArr = getBuildItemsReq(reqData);
		for(i=0;i<itemReqArr.length;i++)
		{
			req = itemReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Add(req);
		}
		
		return retArr;
	}
	
	// 最大行军数量
	public function getMaxMarchCount() : int
	{
		var	currentcityid : int = GameMain.instance().getCurCityId();
		var curLevel : int = getMaxLevelForType(Constant.Building.RALLY_SPOT,currentcityid);
		var buildingMaxMarchNum : int = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(Constant.Building.RALLY_SPOT,curLevel,Constant.BuildingEffectType.EFFECT_TYPE_MARCH_SLOT_COUNT);

		Technology.instance().InitTechnologyList();
		var techAddMarchNum : int = Technology.instance().getIncreaseMarchNum();
		
		return buildingMaxMarchNum + techAddMarchNum;
	}
}
