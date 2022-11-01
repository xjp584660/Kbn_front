
class	Walls extends KBN.Walls
{
	private	static	var	singleton:Walls;
	private var	seed:HashObject;
	private	var	allUnitIds:Array = [ // array of all existing units in the proper order
	 
		53,	//trap
		54,	//calrops
		55,	//Wall-mountedCroosbows
		
		56,	//Boiling Oil (v8)
		57,	//Spiked Barrier (v8)
		52,	//defensiveTrebuchet
		
		58,	//Greek Fire (v8)
		59,	//Persian Sulfur (v8)
		60	//Hellfire Thrower (v8)
	/*
		53,//trap
		54,//calrops
		55,//Wall-mountedCroosbows
		52//defensiveTrebuchet
	*/
	];
//	public	static	var	DEFENSE_WALL:Array = [
//		0,
//		400,
//		800,
//		2000,
//		3000,
//		6000,
//		12500,
//		25000,
//		50000,
//		105000,
//		210000
//	];
	
//	public	static	var	DEFENSE_FIELD:Array = [
//		0,
//		500,
//		1000,
//		2000,
//		4000,
//		8000,
//		16000,
//		32000,
//		64000,
//		140000,
//		280000
//	];
	
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new Walls();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public	function	init( sd:HashObject ){
		seed = sd;
		InitTroopList();
		Queue.init(sd);
	}
	
	public	function	InitAfterChangeCity(){
		InitTroopList();
		Queue.SynDataWithSeed();
	}
	
	public function isIncludedUnit(_id:int):boolean
	{
		return GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().IsTroop(Constant.TroopType.FORT,_id);
	}
	
	public var troopList:Array = new Array();
	public var troopListInCurCity:Array = new Array();
	class	TroopInfo{
		public	var	typeId:int;
		public	var	traintime:int;
		// added info..
		public var troopName:String;
		public var description : String;
		public var requirements:Array = new Array();
		public var owned:long;
		public var attack:int;
		public var health:int;
		public var might:int;
		
		public var bLocked:boolean;
		//
		public var selectNum : long;
		public var actType:int;//1,'Supply' ; 2,'Horse' ; 3, 'Ground'; 4,'Artillery'
		public var level:int;
		public var lifeRate:int;
		public var attackRate:int;
		public var trainable:boolean;
		public var needCityOrder:String;

		public static function CompareByLevelAndType(l : TroopInfo, r : TroopInfo) : int
		{
			if ( l.level < r.level )
				return -1;
			if ( l.level > r.level )
				return 1;
			if ( l.actType < r.actType )
				return -1;
			if ( l.actType > r.actType )
				return 1;
			return 0;
		}
	}

	public function GetTroopInfo(typeId:int):TroopInfo
	{
		//var	gMain:GameMain = GameMain.instance();
		//var common:Utility = Utility.instance();
		//var curCityId:int = gMain.instance().getCurCityId();
		
		var	ret:TroopInfo = new TroopInfo();
		ret.typeId = typeId;
		var arString :Datas = Datas.instance();
		
		ret.troopName = arString.getArString("fortName."+"f" + typeId);
		ret.description = arString.getArString("fortDesc."+"f" + typeId);
		// requirements variables
//		ret.requirements = common.checkreq("f", ret.typeId, 1);
//		ret.bLocked = false;
//		for(var i:int = 0; i < ret.requirements.length; i++)
//		{
//			if( !ret.requirements[i].ok && ret.requirements[i].typeId < 0 )
//			{
//				ret.bLocked = true;
//				break;
//			}	
//		}
		
		ret.owned = getUnitCountForType(ret.typeId);
//		var fortStats:HashObject = Datas.instance().fortstats();
		ret.health = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.FORT,ret.typeId,Constant.TroopAttrType.HEALTH);
		ret.attack = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.FORT,ret.typeId,Constant.TroopAttrType.ATTACK);
		ret.actType = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.FORT,ret.typeId,Constant.TroopAttrType.TYPE);
		ret.level = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.FORT,ret.typeId,Constant.TroopAttrType.TIER);
		ret.lifeRate = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.FORT,ret.typeId,Constant.TroopAttrType.LIFERATE);
		ret.attackRate = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.FORT,ret.typeId,Constant.TroopAttrType.ATTACKRATE);
      	ret.might = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.FORT,ret.typeId,Constant.TroopAttrType.MIGHT);

		return ret;
	}
	
	public function GetTroopList():Array
	{
		/*
		for(var i:int =0; i<allUnitIds.length; i++)
		{
			obj = this.GetTroopInfo(allUnitIds[i]);
			troopList.push(obj);
		}
		*/
		return troopList;
	}
	
	public function GetTroopListInCurCity()
	{
		return troopListInCurCity;
	}
	
	protected function InitTroopList()
	{
		troopList.Clear();
		troopListInCurCity.Clear();
		troopList = GetFortList();
		var curCityOrder:int = GameMain.instance().getCurCityOrder();
		for(var i:int=0;i<troopList.length;i++)
		{
			var troop:Walls.TroopInfo = troopList[i] as Walls.TroopInfo;
			if(! CanTrainInThisCity(troop.needCityOrder,curCityOrder))
			{
				continue;
			}
			troopListInCurCity.Push(troop);
		}
	}
	
	public function UpadateTroopList(troopId:int)
	{
		for(var i:int = 0; i< troopList.length; i++)
		{
			if((troopList[i] as TroopInfo).typeId == troopId)
			{
				(troopList[i] as TroopInfo).owned = getUnitCountForType(troopId);
				break;
			}
		}
	}
	
	class TrainInfo extends QueueItem{
		public 	var quant:int;
		public  var owned:int;
		public var canCancel:boolean;
	}
	
	public	var Queue:QueueClass = new QueueClass();
	
	// Queue manangement functions
	// (This is pretty much copied wholesale from Barracks.js, with
	// minor changes for queue location)
	//
	class	QueueClass{
		// Returns all queue slots as an array of objects.
		//
		var seed:HashObject;
		var m_trainQueue:Array = new Array();
		public	function	init(sd:HashObject){
			seed = sd;
			SynDataWithSeed();
//			queue = _Global.GetObjectValues(seed["fortify_queue"]["c" + GameMain.instance().getCurCityId()]);
		}
		
		public	function	slots(cityId:int):Array {
			return _Global.GetObjectValues(seed["fortify_queue"]["c" + cityId]);
		}

//		// Returns all slots that are "empty" or available
//		//
//		public	function	emptySlots () :Array{
//			var func:Function = function (queue) {
//				return _Global.INT32(queue["eta"]) <= GameMain.unixtime();
//			};
//			
//			return _Global.SelectArray(slots(), func);
//			
//		}
		
		public function GetTraiQueue():Array
		{			
			return m_trainQueue;
		}
		
		public	function 	ParseQueue(slot:HashObject, cityId:int):TrainInfo
		{
			var arString :Datas = Datas.instance();
			var ret:TrainInfo =  new TrainInfo();

			ret.id = _Global.INT32(slot["id"]);
			ret.itemType = _Global.INT32(slot["type"]);
			ret.itemName = arString.getArString("fortName."+"f" + ret.itemType);
			ret.quant = _Global.INT32(slot["quant"]);

//			ret.needed = _Global.parseTime(slot["needed"]);
			ret.cityId = cityId;
			ret.endTime = _Global.parseTime(slot["eta"]);
			ret.startTime = _Global.parseTime(slot["ticker"]);
			ret.canCancel = _Global.INT32(slot["canCancel"]) ==1;
			ret.needed = ret.endTime - ret.startTime;
			
			ret.timeRemaining = ret.endTime - GameMain.unixtime();
//			_Global.Log("id:" + ret.id + " quant:" + ret.quant + " startTime:" + ret.startTime + " ticker:" + slot["ticker"]);
//			_Global.Log("needed:" + ret.needed + " old:"  + _Global.parseTime(slot["needed"]) + " equal:" + (_Global.parseTime(slot["needed"]) == ret.needed)
//				+ " timeRemaining:" + ret.timeRemaining);
			ret.owned = Walls.instance().getUnitCountForType(ret.itemType);
			ret.classType = QueueType.WallTrainingQueue;
			return ret;
		}
		
		

//		// Returns "active" slots, i.e. ones that are currently in production.
//		//
//		// Actually, this behaves the way it does, returning activeSlots as an array,
//		// becaue parts of code are expecting it as an array. However, since we
//		// moved away from statuses and switched entirely to time based queueing,
//		// all I did is alter the function to match what is expected.
//		// Also allows for the ability to have multiple active slots in the future.
//		//
//		public	function	activeSlots () :Object{
//			return current();
//		}

//		// Returns all queued slots, i.e. ones that are waiting but not the current
//		// active slot.
//		//
//		// The optimal way to do this would be remove all this.activeSlots.. but since
//		// we only currently allow one, I just use a prototype function to simply remove
//		// the current active slot
//		//
//		public	function	queuedSlots () {
////			return this.slots().select(function (queue) {
////				return _Global.INT32(queue.eta, 10) > unixtime();
////			}).without(this.current());
//
//			var curSlot:Object = current();
//			var slts:Array = slots();
//			var slot:Object;
//			var ret:Array = new Array();
//			
//			if( curSlot == null ){
//				return ret;
//			}
//			
//			for( var i:int = 0; i < slts.length; i ++ ){
//				slot = slts[i];
//				if( _Global.INT32(slot["id"]) != _Global.INT32(curSlot["id"]) && _Global.parseTime(slot["eta"]) > GameMain.unixtime() ){
//					ret.Add(slot);
//				}
//			}
//			
//			return ret;
//		}
		
		public	function	queuedSlotsSorted(cityId:int):Array {
			
			var curSlot:HashObject = current(cityId);
			if( curSlot == null ){
				return null;
			}
			
			var slts:Array = new Array();
			var orgSlts:Array = slots(cityId);
			var slot:HashObject;
			var i:int;
			for( i = 0; i < orgSlts.length; i ++ ){
				slot = orgSlts[i];
				
				if( _Global.INT32(slot["id"]) != _Global.INT32(curSlot["id"]) && _Global.parseTime(slot["eta"]) > GameMain.unixtime() ){

					slts.Add(slot);
				}
			}
			
			
			var tmp:Object;
			var j:int;

			for( i = 0; i < slts.length; i ++ ){
				for( j = i + 1; j < slts.length; j ++ ){
					if( _Global.parseTime((slts[j] as HashObject)["eta"]) < _Global.parseTime((slts[i] as HashObject)["eta"]) ){
						tmp = slts[i];
						slts[i] = slts[j];
						slts[j] = tmp;
					}
				}
			}
			
			slts.Unshift(curSlot);
			return slts;
		}

		// Return slot id for the current unit being trained
		// returns null if there isn't one
		//
		public	function	current(cityId:int) :HashObject{
			var smallest:double = double.PositiveInfinity;
			var	nextSlot:HashObject = null;
			var slts:Array = slots(cityId);
			var slot:HashObject;
			var endTime:double;
			var unixtime:long = GameMain.unixtime();
			
			for( var i:int = 0; i < slts.length; i ++ ){
				slot = slts[i];
				endTime = _Global.parseTime(slot["eta"]);
//				_Global.Log(" slot id:" + slot["id"] + " endTime:" + endTime + " slot eta:" + slot["eta"] + " smallest:" + smallest );
				if (endTime < smallest && endTime > unixtime) {
					smallest = endTime;
					nextSlot = slot;
//					_Global.Log( " loop next slot id:" + nextSlot["id"] );
				}
			}

			if (nextSlot) {
//				_Global.Log("NEXT SLOT id:" + nextSlot["id"]);
				if (_Global.parseTime(nextSlot["ticker"]) > unixtime) { // reset to current
					var updateData:Hashtable = {"eta": _Global.parseTime(nextSlot["eta"]) - _Global.parseTime(nextSlot["ticker"]) + unixtime,//_Global.parseTime(nextSlot["needed"]) + unixtime,//
										"ticker": unixtime};
					updateSlotWithCityID(_Global.INT32(nextSlot["id"]), updateData, cityId);
				}
				return nextSlot;
//				return getSlot(nextSlot["id"]);
			} else {
				return null;
			}
		}

//		// Return slot id for the next unit in training in queue
//		// returns null if there isn't one
//		//
//		public	function	next (cityId:int) :Object{
//			
//			var smallest:double = double.PositiveInfinity;
//			var	nextSlot = null;
//			var slts:Array = queuedSlots();
//			var slot:Object;
//			
//			for( var i:int = 0; i < slts.length; i ++ ){
//				slot = slts[i];
//				var endTime:double = _Global.parseTime(slot["eta"]);
//				if (endTime < smallest && endTime > GameMain.unixtime()) {
//					smallest = endTime;
//					nextSlot = slot;
//				}
//			}
//			return nextSlot;
//		}

		// Returns the next empty (available) slot
		//
		public	function	nextEmpty () :HashObject{
			
			var cityId:int = GameMain.instance().getCurCityId();
			var	slts:Array = slots(cityId);
			var unixtime:long = GameMain.unixtime();
			for( var slot:Object in slts ){
				if( _Global.parseTime((slot as HashObject)["eta"]) <= unixtime){
					return slot;
				}
			}
			return null;
		}

//		// Checks to make sure if the level of the wall can support the amount of slots.
//		// The reason is as soon as a wall is upgraded, it creates a new queue, but it
//		// is not available for use until construction is complete.
//		//
//		public	function	enoughCapacity () {
//			var curCityId:int = GameMain.instance().getCurCityId();
//			return Building.instance().getMaxLevelForType(Constant.Building.WALL, curCityId) > this.activeSlots().length + this.queuedSlots().length;
//		}

//		// Returns true if there's an available queue for training
//		//
//		public	function	available () {
//			return this.enoughCapacity() && this.emptySlots().length > 0;
//		}

//		// Start a slot into active production (by changing time) and update the seed accordingly
//		//
//		public	function	start (slot:Object) {
//			var currentcityid:int = GameMain.instance().getCurCityId();
//			var timediff:double = _Global.parseTime(slot["eta"]) - _Global.parseTime(slot["ticker"]);
//			seed["fortify_queue"]["c" + currentcityid]["f" + slot["id"]]["ticker"] = GameMain.unixtime();
//			seed["fortify_queue"]["c" + currentcityid]["f" + slot["id"]]["eta"] = _Global.parseTime(slot["eta"]) + timediff;
//			SynDataWithSeed();
//		}

		// Set the specified queue slot to inactive (by resetting time) and all associated actions
		//
		public	function	stopSlotId (slotId:int) {
			var cityId:int = GameMain.instance().getCurCityId();
			
			
			var removedEta:long = _Global.parseTime(seed["fortify_queue"]["c" + cityId]["f" + slotId]["eta"]);
			var queueTimeReduced:long = removedEta - _Global.parseTime(seed["fortify_queue"]["c" + cityId]["f" + slotId]["ticker"]);
			
			if(slotId == (m_trainQueue[0] as TrainInfo).id )
			{
				queueTimeReduced = removedEta - GameMain.unixtime();
			}
		//	this.SynDataWithSeed();
			var slots:Array = _Global.GetObjectKeys(seed["fortify_queue"]["c" + cityId]);
			for(var i:int =0; i<slots.length; i++)
			{
				var curSlot:HashObject =seed["fortify_queue"]["c" + cityId][slots[i]] ;
				if(_Global.parseTime(curSlot["ticker"]) >= removedEta){
					curSlot["ticker"].Value = _Global.parseTime(curSlot["ticker"]) - queueTimeReduced;
					curSlot["eta"].Value = _Global.parseTime(curSlot["eta"]) - queueTimeReduced;
				}	
			}
			seed["fortify_queue"]["c" + cityId]["f" + slotId]["eta"].Value = GameMain.unixtime();
			for(i=0; i<m_trainQueue.length; i++)
			{
				if((m_trainQueue[i] as TrainInfo).id == slotId)
				{	
//					(m_trainQueue[i] as TrainInfo).endTime = 0;
					(m_trainQueue[i] as TrainInfo).endTime = GameMain.unixtime() - 10;
					(m_trainQueue[i] as TrainInfo).timeRemaining = 0;
					m_trainQueue.RemoveAt(i);
					
					
					if( m_trainQueue.length > 0){
						SynDataWithSeed();
						MenuMgr.getInstance().UpdateTrainProgress();
					}
					MenuMgr.getInstance().UpdateData();
					break;
				}
			}
		}

		// Updates a queue slot with data from an object passed in
		// returns the updated object
		//
		public	function	updateSlot (slotId:int, slotData:Hashtable){
			var currentcityid:int = GameMain.instance().getCurCityId();
			updateSlotWithCityID(slotId, slotData, currentcityid);
		}

		private function	updateSlotWithCityID(slotId:int, slotData:Hashtable, cityID:int)
		{
			var keys:Array = _Global.GetObjectKeys( slotData );
			
			for( var key in keys){
				seed["fortify_queue"]["c" + cityID]["f" + slotId][key] = new HashObject(slotData[key]);
			}

//			return seed["fortify_queue"]["c" + cityID]["f" + slotId];
		}
		
		public function SpeedUp(slotId:int, reduceTime:long, cityId:int)
		{
			
			var slots:Array = _Global.GetObjectKeys(seed["fortify_queue"]["c" + cityId]);
			for(var i:int =0; i<slots.length; i++)
			{
				var curSlot:HashObject =seed["fortify_queue"]["c" + cityId][slots[i]] ;
				curSlot["ticker"].Value = _Global.parseTime(curSlot["ticker"]) - reduceTime;
				curSlot["eta"].Value = _Global.parseTime(curSlot["eta"]) - reduceTime;
			}	
			var trainQueue:Array = GetTraiQueue();
			for(i=0; i<trainQueue.length; i++)
			{
				(trainQueue[i] as TrainInfo).startTime -= reduceTime;
				(trainQueue[i] as TrainInfo).endTime -= reduceTime;
			}
		}

//		// When a barracks is started, this creates a new training slot
//		//
//		public	function	addSlot (slotId:int) {
//			var addSlot:Object = {
//				"id": slotId,
//				"eta": 0,
//				"needed": 0,
//				"progress": 0,
//				"quant": 0,
//				"status": 0,
//				"ticker": 0,
//				"type": 0
//			};
//			seed["fortify_queue"]["c" + GameMain.instance().getCurCityId()]["f" + slotId] = addSlot;
//		}

		// Returns the specified slot object
		//
		public	function	getSlot (slotId:String):HashObject {
			return seed["fortify_queue"]["c" + GameMain.instance().getCurCityId()]["f" + slotId];
		}
		
		public function UpdateData()
		{
			
			var i:int = 0;
			var removeItem:boolean = false;
			while( i < m_trainQueue.length)
			{
                var trainInfo : TrainInfo = m_trainQueue[i] as TrainInfo;
				trainInfo.timeRemaining = trainInfo.endTime - GameMain.unixtime();
				if(trainInfo.timeRemaining <= 0)
				{
					trainInfo.timeRemaining = 0;
					UpdateSeed.instance().followCheckQuest(2);
					GameMain.instance().seedUpdateAfterQueue(false);
                    DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.Training, {
                        "uid" : trainInfo.itemType,
                        "qty" : trainInfo.quant
                    });
					m_trainQueue.RemoveAt(i);
					removeItem = true;
				}
				else
				{
					i++;
				}
			}
			
			
			if(removeItem && m_trainQueue.length > 0){
				SynDataWithSeed();
				MenuMgr.getInstance().UpdateTrainProgress();
			}
				
			if(removeItem)
			{
				MenuMgr.getInstance().sendNotification(Constant.Notice.TRAIN_COMPLETED,null);
				MenuMgr.getInstance().UpdateData();
				SoundMgr.instance().PlayEffect( "end_construction", /*TextureType.AUDIO*/"Audio/");
                GameMain.instance().invokeUpdateSeedInTime(1);
			}	
		}
		
		public function SynDataWithSeed()
		{
			m_trainQueue.Clear();
			
			var cityId:int  = GameMain.instance().getCurCityId();
			var slt:Array = queuedSlotsSorted(cityId);//queuedSlots();
			
			if( slt == null || slt.length <= 0 ){
				return;
			}
			
			var trainInfo:TrainInfo;

			for( var i:int = 0; i < slt.length; i ++ )		
			{
				trainInfo = ParseQueue(slt[i], cityId);
				m_trainQueue.Push( trainInfo );
			}
		}
		
		public function FirstByCityId(cityId:int):TrainInfo
		{			
			var curSlot:Object = current(cityId);
			if(curSlot)
			{
				return ParseQueue(curSlot, cityId);
			}
			else
			{
				var slt:Array = queuedSlotsSorted(cityId);
				if(slt != null && slt.length > 0)
				{
					return ParseQueue(slt[0], cityId);
				}
				else
				{
					return null;
				}
			}
		}
		
		public function First():TrainInfo
		{
			return m_trainQueue.length >0 ?(m_trainQueue[0] as TrainInfo):null;
		}
	}
	
	public	function	trainDefense (unitTypeId:int, num:int, itemId:int, okCallback:Function) {
		
		var fistEmptySlot:HashObject = Queue.nextEmpty();
		if( fistEmptySlot == null ){
			ErrorMgr.instance().PushError("", Datas.instance().getArString("Wall.NoEnoughSlotError"));
			return;
		}
		
//		var fortifyingData:HashObject = Datas.instance().fortifyingData();
		var currentcityid:int = GameMain.instance().getCurCityId();
//		var time = this.trainTime(unitTypeId, num);
		var params = new Array();
		params.Add(currentcityid);
		params.Add(unitTypeId);
		params.Add( num );
		params.Add(itemId);
		params.Add(fistEmptySlot["id"].Value);

		
//		//add to queue
//		if (itemId == 26) {
//			time = _Global.INT32(time * 0.7);
//		}
		
		var okFunc:Function = function(result:HashObject){
//			_Global.Log("trainDefensOK");
			
//			KTrack.event(['_trackEvent', 'TrainDefense', unitTypeId, seed.player.title, num]);
			var i:int;
			for (i = 0; i <= 5; i++) 
			{ // remove resources
//				Resource.instance().addToSeed(i, _Global.INT32(fortifyingData["f" + unitTypeId]["c"][_Global.ap + i]) * num * -1, currentcityid);
				Resource.instance().addToSeed(i, GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainCostResource(Constant.TroopType.FORT,unitTypeId,i) * num * -1, currentcityid);
			}
			
			//subtract need troops
			subtractTroopsForTrain(unitTypeId,num);
			
			Queue.updateSlot(_Global.INT32(result["fortifyId"]), {
				"eta": _Global.parseTime(result["initTS"]) + _Global.parseTime(result["timeNeeded"]),
				"needed": result["ticksNeeded"].Value, //base need time
				"progress": 0,
				"quant": num,
				"status": result["status"].Value,
				"ticker": result["initTS"].Value,
				"canCancel":result["canCancel"].Value,
				"type": unitTypeId
			});

//			_Global.Log( "id:" + result["fortifyId"] + "quant:" + num + "status:" + result["status"] +  "ticker:" + result["initTS"] +  " needed:" + result["ticksNeeded"] + " eta:" + (_Global.parseTime(result["initTS"]) + _Global.parseTime(result["timeNeeded"])));
//			Modal.hideModal();
//			queue_changetab_train();
//			Walls.changeWallsModalTabs(1);
//			if (itemId == 26) {
//				seed["items"]["i26"] = _Global.INT32(seed["items"]["i26"]) - 1;
//			}
			if (result["updateSeed"]) {
				UpdateSeed.instance().update_seed(result["updateSeed"]);
			}
			
			
			Queue.SynDataWithSeed();
			SoundMgr.instance().PlayEffect( "start_train", /*TextureType.AUDIO*/"Audio/" );
			if( okCallback ){
				okCallback();
			}
			
		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String){
//			_Global.Log("trainDefenseError:"+msg + " errorCode:" + errorCode);
//		};
//		
//		UnityNet.reqTrainDefense(params, okFunc, errorFunc );
		UnityNet.reqTrainDefense(params, okFunc, null );
	}
	
	/*
	private	function	unitInSpaceType( unitId:int, spaceType:String ):boolean{
		var	data:HashObject = Datas.instance().getGameData();
		var fortSpaceUnit:HashObject = data["fortspaceunit"];
		var units:Array = _Global.GetObjectValues( fortSpaceUnit[spaceType] );
		return _Global.IsValueInArray( units, unitId );
	}
	*/
	
	public	function	getWallSpace( cityId:int, spaceType:String ):int
	{
		var	wallLevel:int = Building.instance().getMaxLevelForType(Constant.Building.WALL, cityId);
		return GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(Constant.Building.WALL,wallLevel,spaceType);
	}
	
	// Calculates the space used by fortifications on the wall
	// type: 1=no queue, 2=withqueue
	//
	public	function	spaceCalc (type:int) :int[]
	{
		var spacetaken:int[] = [0, 0, 0];
		var currentcityid:int = GameMain.instance().getCurCityId();
		var fortKeys:Array = _Global.GetObjectKeys(seed["fortifications"]["city" + currentcityid]);
		
		var unitId:int;
		var tier:int;
		var	spaceUsed:int;
		for( var fortKey:String in fortKeys )
		{
			unitId = _Global.INT32(fortKey.Substring("fort".Length));
			spaceUsed = unitId > 0 ? spaceUsedForType(unitId) * getUnitCountForType(unitId) : 0;
//			if (unitId == 54 || unitId == 55) {
			tier = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.FORT,unitId,Constant.TroopAttrType.TIER);
			if( tier == 1 )
			{
				spacetaken[0] = spacetaken[0] + spaceUsed;
			} 
			else 
			if( tier == 2 )
			{
				spacetaken[1] = spacetaken[1] + spaceUsed;
			}
			else
			{
				spacetaken[2] = spacetaken[2] + spaceUsed;
			}
		}
		
		if ( type == 2) 
		{
			var queueKeys:Array = _Global.GetObjectKeys(seed["fortify_queue"]["c" + currentcityid]);
			for( var queueKey:Object in queueKeys )
			{
				var queue:HashObject = seed["fortify_queue"]["c" + currentcityid][queueKey];
				
				if ( !isIncludedUnit(_Global.INT32(queue["type"])) )
					return spacetaken;

				unitId = _Global.INT32(queue["type"]);
				tier = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.FORT,unitId,Constant.TroopAttrType.TIER);
				spaceUsed = unitId > 0 && GameMain.unixtime() < _Global.parseTime(queue["eta"]) ? spaceUsedForType(unitId) * _Global.INT32(queue["quant"]) : 0;

//				if (unitId == 54 || unitId == 55) {
				if( tier == 1 )
				{
					spacetaken[0] = spacetaken[0] + spaceUsed;
				} 
				else 
				if( tier == 2 )
				{
					spacetaken[1] = spacetaken[1] + spaceUsed;
				}
				else
				{
					spacetaken[2] = spacetaken[2] + spaceUsed;
				}
			}
		}
		return spacetaken;
	}
	
	public	function	trainMax (unitId:int) {
	
		var curCityId:int = GameMain.instance().getCurCityId();
//		var fortifyingData = Datas.instance().fortifyingData();
		var fortCostData = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainCostData(Constant.TroopType.FORT,unitId);
		if(fortCostData == null) return 0;
		var tier:int =  GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.FORT,unitId,Constant.TroopAttrType.TIER);
		var resource:Resource = Resource.instance();
		var reqs:Array = new Array();
		var	own:Array = new Array();
		var	maxamt:long = 0x7FFFFFFFFFFFFFFF; //double.PositiveInfinity;//Number.POSITIVE_INFINITY;
//		var	wallLevel:int = Building.instance().getMaxLevelForType(Constant.Building.WALL, curCityId);
//		var	wallspace:int = Mathf.Pow(2, wallLevel - 1) * 500;
		var	maxwall:long = 0;
		var	spacetaken:int[] = spaceCalc(2);
		var	i:int;
		
		
		var saleData:HashObject = null;
		var remainder:int = 0;
		var reqNum:double = 0;
//		_Global.Log("unitId:" + unitId);
		for (i = 0; i <= 4; i++) 
		{
			//troop sale
			saleData = GameMain.instance().getResSaleForTrainTroop(Constant.TroopType.FORT,unitId,i);
			reqNum = _Global.INT64(fortCostData[_Global.ap + i]);
			if(saleData != null)
			{
				remainder = reqNum*_Global.INT32(saleData["Numerator"])%_Global.INT32(saleData["Denominator"]);
				reqNum = reqNum*_Global.INT32(saleData["Numerator"])/_Global.INT32(saleData["Denominator"]);
				if(remainder != 0) reqNum++;
			}
			reqs.push(reqNum);
			own.push(resource.getCountForTypeInSeed(i, curCityId));
//			_Global.Log("i:" + i + " reqs:" + reqs[i] + " own:" + own[i]);
		}
		
		reqs.push(fortCostData[_Global.ap +5]);
		own.push(resource.populationIdle(curCityId));
//		_Global.Log(" reqs:" + reqs[5] + " own:" + own[5]);
		
		for (i = 0; i < reqs.length; i++) {
			if( _Global.INT32(reqs[i]) > 0 ){
				maxamt = Mathf.Min(maxamt, Mathf.Floor( 1.0*_Global.INT64(own[i]) / _Global.INT32(reqs[i]) ) );
//				_Global.Log("i:" + i + " maxamt:" + maxamt);
			}
		}
		maxamt = Mathf.Floor(maxamt);
//		_Global.Log(" maxamt:" + maxamt);

//		if (_Global.INT32(unitId) == 54 || _Global.INT32(unitId) == 55) {
		var wallspace:int;
		if( tier == 1 )
		{
			wallspace = getWallSpace(curCityId, Constant.BuildingEffectType.EFFECT_TYPE_WALL_TROOP_T1_LIMIT);
			var spaceUsed:int = spaceUsedForType(unitId);
			if(spaceUsed < 1)
			{
				maxwall = wallspace - spacetaken[0];
			}
			else
			{
				maxwall = _Global.INT32((wallspace - spacetaken[0]) / spaceUsedForType(unitId));
			}
			
		} 
		else
		if( tier == 2 )
		{
			wallspace = getWallSpace(curCityId, Constant.BuildingEffectType.EFFECT_TYPE_WALL_TROOP_T2_LIMIT);//DEFENSE_WALL[wallLevel];
			maxwall = _Global.INT32((wallspace - spacetaken[1]) / spaceUsedForType(unitId));
		}
		else
		{
			wallspace = getWallSpace(curCityId, Constant.BuildingEffectType.EFFECT_TYPE_WALL_TROOP_T3_LIMIT);//DEFENSE_WALL[wallLevel];
			maxwall = _Global.INT32((wallspace - spacetaken[2]) / spaceUsedForType(unitId));
		}

		return Mathf.Max(Mathf.Min(maxamt, maxwall), 0 );
	}
	
	public	function	trainTime (unitId:int, quant:int) {
		var	currentcityid:int = GameMain.instance().getCurCityId();
//		var fortifyingData:HashObject = Datas.instance().fortifyingData();
//		var basetime:int = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrain * quant;
		var basetime:int = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainBaseTime(Constant.TroopType.FORT,unitId) * quant;
		var	denominator:float = 1 + (0.1 * Research.instance().getMaxLevelForType(Constant.Research.CRANES));
		var	knightLevel:float = 0;
		var	knight:HashObject = seed["knights"]["city" + currentcityid];

		// This is very similar to General.politicsBonus except that knightlevel is
		// multiplied by 1.25 if there's a boost going.
		if (knight != null) {
			knight = knight["knt" + seed["leaders"]["city" + currentcityid]["politicsKnightId"].Value];
			
			if (knight) {
				knightLevel = _Global.INT32(knight["knightLevel"]);
//				if ((_Global.INT32(knight["politicsBoostExpireUnixtime"]) - GameMain.unixtime()) > 0) {
//					knightLevel = knightLevel * 1.25;
//				}
				denominator = denominator + (0.005 * knightLevel);
			}
		}

		return Mathf.Max(0, Mathf.Ceil(basetime / denominator));
	}
	
	// Removes a fortifying queue.
	//
	public	function	removeFortifications (queueId, cityId, typefrt, numtrpfrt, frtETA, frtTmp, frtNeeded, okCallBack:Function) {
		var curCityId = GameMain.instance().getCurCityId();
//		var fortifyingData = Datas.instance().fortifyingData();
		var params:Array = new Array();
		params.Add("CANCEL_FORTIFICATIONS");
		params.Add(cityId);
		params.Add(typefrt);
		params.Add(numtrpfrt);
		params.Add(frtETA);
		params.Add(frtTmp);
		params.Add(frtNeeded);
		params.Add(queueId);
		
		var okFunc:Function = function(result:HashObject){
//			_Global.Log("removeFortifications OK");
//			var i:int;

			// set current queue to inactive in the seed
			Queue.stopSlotId(queueId);
			for (var i:int = 0; i <= 4; i++) { // return the resources from the cancelled unit
//				Resource.instance().addToSeed(i, _Global.INT32(fortifyingData["f" + typefrt]["c"][_Global.ap + i]) * _Global.INT32(numtrpfrt) / 2, curCityId);
				Resource.instance().addToSeed(i, GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainCostResource(Constant.TroopType.FORT,typefrt,i) * _Global.INT32(numtrpfrt) / 2, curCityId);
			}
			
			// refund need troops
			refundTroopsFromCancelTrain(typefrt,numtrpfrt);
			
			UpdateSeed.instance().update_seed(result["updateSeed"]);// return the resources from the cancelled unit

			if( okCallBack ){
				okCallBack();
			}
//
//			var next:Object = Queue.next(curCityId);
//			if ( next != null) {
//				Queue.start(next);
//			}

		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String){
//			_Global.Log("removeFortifications Error:"+msg + " errorCode:" + errorCode);
//		};
//		
//		UnityNet.reqRemoveFortifications(params, okFunc, errorFunc );
		UnityNet.reqRemoveFortifications(params, okFunc, null );
	}

	// Returns the unit count for the ID passed in as an integer
	//  
	public	function	getUnitCountForType (unitId:int):int 
	{
		var temp:HashObject = seed["fortifications"]["city" + GameMain.instance().getCurCityId()]["fort" + unitId];
		if(temp!=null && temp!="")
		{
			return _Global.INT32(temp);
		}	
	
		return 0;
	}
	
	public function getUnitCountByTypeAndCity(unitId:int, cityId:int):int
	{
		var temp:HashObject = seed["fortifications"]["city" + cityId]["fort" + unitId];
		if(temp!=null)
		{
			return _Global.INT32(temp);
		}	
	
		return 0;
	}

	// Returns the amount of space a fortification uses as an integer
	//
	public	function	spaceUsedForType (unitId:int) {
//		var fortstats = Datas.instance().fortstats();
//		return _Global.INT32(fortstats["unt" + unitId][_Global.ap + 5]);
		return GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.FORT,unitId,Constant.TroopAttrType.SPACE);
	}

	// Takes an amount and ADDs it to the current seed.
	//
	public	function	addUnitsToSeed (unitId:int, amount:int) {
		
		seed["fortifications"]["city" + GameMain.instance().getCurCityId()]["fort" + unitId].Value = getUnitCountForType(unitId) + amount;
		UpadateTroopList(unitId);
	}
	
	public function subtractFortsToSeed(troopId:int,troopCount:int)
	{
		if(troopCount <= 0) return;
		seed["fortifications"]["city" + GameMain.instance().getCurCityId()]["fort" + troopId].Value = getUnitCountForType(troopId) - troopCount;
		UpadateTroopList(troopId);
	}
	
	public function Update()
	{
		Queue.UpdateData();
	}
	
	public function subtractTroopsForTrain(troopId:int,trainNum:int):void
	{
		var needTroops:System.Collections.ArrayList = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainNeedTroops(Constant.TroopType.FORT,troopId) as System.Collections.ArrayList;
		var troopObj:HashObject;
		var needTroopId:int;
		var needNum:int;
		var saleData:HashObject = null;
		var remainder:int = 0;
		saleData = GameMain.instance().getTroopSaleForTrainTroop(Constant.TroopType.FORT,troopId);
		for(var i:int=0;i<needTroops.Count;i++)
		{
			troopObj = needTroops[i] as HashObject;
			if(troopObj != null)
			{
				needTroopId = _Global.INT32(troopObj["troopId"]);
				needNum = _Global.INT32(troopObj["num"]);
				if(saleData != null)
				{
					remainder = needNum*_Global.INT32(saleData["Numerator"])%_Global.INT32(saleData["Denominator"]);
					needNum = needNum*_Global.INT32(saleData["Numerator"])/_Global.INT32(saleData["Denominator"]);
					if(remainder != 0) needNum++;
				}
				if(needNum > 0 )
					subtractFortsToSeed(needTroopId,needNum*trainNum);
			}
		}
	}
	
	public function refundTroopsFromCancelTrain(troopId:int,trainNum:int):void
	{
		var needTroops:System.Collections.ArrayList = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainNeedTroops(Constant.TroopType.FORT,troopId) as System.Collections.ArrayList;
		var troopObj:HashObject;
		var needTroopId:int;
		var needNum:int;
		var rateNumerator:int = GameMain.instance().getTrainRefundTroopRate_Numerator();
		var rateDenominator:int = GameMain.instance().getTrainRefundTroopRate_Denominator();
		if(rateDenominator == 0 || rateNumerator > rateDenominator) return;
		
		for(var i:int=0;i<needTroops.Count;i++)
		{
			troopObj = needTroops[i] as HashObject;
			if(troopObj != null)
			{
				needTroopId = _Global.INT32(troopObj["troopId"]);
				needNum = _Global.INT32(troopObj["num"]);
				var retNum:int = needNum*trainNum*rateNumerator/rateDenominator;
				if(retNum > 0 )
					addUnitsToSeed(needTroopId,retNum);
			}
		}
	}
	
	public function CanTrainInThisCity(needCityOrder:String,cityOrder:int):boolean
	{
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
    
    private function GetFortList():Array
    {
        var retArr:Array = new Array();
        var gdsTroopList:Dictionary.<String, KBN.DataTable.IDataItem> = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetItemDictionary() as Dictionary.<String, KBN.DataTable.IDataItem>;
        for(var key:String in gdsTroopList.Keys)
        {
            var itemTroop:KBN.DataTable.Troop = gdsTroopList[key] as KBN.DataTable.Troop;
            if(itemTroop!=null)
            {
                var nKey:int = _Global.INT32(key);
                if (nKey < KBN.GDS_Troop.MAX_UNIT)
                    continue;
                var troopInfo:Walls.TroopInfo = new Walls.TroopInfo();

                troopInfo.typeId = nKey;
                troopInfo.needCityOrder = _Global.GetString(itemTroop.CITY);
                troopInfo.troopName = Datas.instance().getArString("fortName."+"f" + troopInfo.typeId);

                troopInfo.description = Datas.instance().getArString("fortDesc."+"f" + troopInfo.typeId);
                troopInfo.bLocked = false;
                troopInfo.owned = Walls.instance().getUnitCountForType(troopInfo.typeId);

                troopInfo.health        = _Global.INT32(itemTroop.LIFE);
                troopInfo.attack        = _Global.INT32(itemTroop.ATTACK);
                troopInfo.actType       = _Global.INT32(itemTroop.Type);
                troopInfo.level         = _Global.INT32(itemTroop.TIER);
                troopInfo.lifeRate      = _Global.INT32(itemTroop.LIFE_RATE);
                troopInfo.attackRate    = _Global.INT32(itemTroop.ATTACK_RATE);
                troopInfo.might         = _Global.INT32(itemTroop.MIGHT);
                var trainable:int       = _Global.INT32(itemTroop.TRAINABLE);
                troopInfo.trainable = trainable == 0 ? false : true;

                retArr.Push(troopInfo);
            }
        }
        return retArr;
    }
}
