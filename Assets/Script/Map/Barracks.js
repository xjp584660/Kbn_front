
class	Barracks extends KBN.BarracksBase {
	private var	seed:HashObject;
	private static var singleton : Barracks;
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new Barracks();
			baseSingleton = singleton;
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
/*	
	var allUnitIds:int[] = [ // array of all existing units in the proper order
		1, //supply troop
		//3,
		4, // light cavalry
		5, // militiamen
		6,//archer
		9,//suply carts
		8,//cavalry
		7,//swordsmen
		11,//ballistae
		2,//supplywagon
		13,// heavy cavalry
		10,// battering rams
		12,//catapults
		14,//Siege Tower
		15,//Firepot Mangonel
		16 //War Wagon
//		16

	];
	*/
	public function checkSlotForAnimation() : void
	{
		Queue.checkSlotForAnimation();
	}
	public	function	init( sd:HashObject ){
		seed = sd;
		InitTroopList();
		Queue.SynDataWithSeed();
	}
	
	public	function	InitAfterChangeCity(){
		InitTroopList();
		Queue.SynDataWithSeed();
	}
	
	public function isIncludedUnit(_id:int):boolean
	{
		return GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().IsTroop(Constant.TroopType.UNITS,_id);
	}
	
	public var troopList:Array = new Array();
	public var troopListInCurCity:Array = new Array();
	
	
	class TrainInfo extends QueueItem{
		public 	var quant:int;
		public  var owned:int;
		public var description : String;
		public var canCancel:boolean = true;
		public var ratio: float = 0;
		public var realRatio: float;
		//public  var classType:QueueType = QueueType.TrainningQueue;
		function Init()
		{
			classType = QueueType.TrainningQueue;
		}
	}
	
	public function GetTroopInfo(typeId:int):TroopInfo
	{
		var	gMain:GameMain = GameMain.instance();
		var common:Utility = Utility.instance();
		var curCityId:int = gMain.getCurCityId();
		
		var	ret:TroopInfo = new TroopInfo();
		ret.typeId = typeId;
		var arString : Datas = Datas.instance();
		
		ret.troopName = arString.getArString("unitName."+"u" + typeId);
		ret.troopTexturePath = "ui_" + typeId;
		ret.description = arString.getArString("unitDesc."+"u" + typeId);
		// requirements variables
//		ret.requirements = common.checkreq("u", ret.typeId, 1);
		ret.bLocked = false;
//		for(var i:int = 0; i < ret.requirements.length; i++)
//		{
//			if( !ret.requirements[i].ok && ret.requirements[i].typeId < 0 )
//			{
//				ret.bLocked = true;
//				break;
//			}	
//		}
		ret.owned = getUnitCountForType(ret.typeId, curCityId);
		//var unitsStats:HashObject = Datas.instance().UnitsStats();
		ret.health = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.HEALTH);
		ret.attack = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.ATTACK);
		ret.speed = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.SPEED);
		ret.load = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.LOAD);
		
		ret.actType =  GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.TYPE);
		ret.level = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.TIER);
		ret.lifeRate = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.LIFERATE);
		ret.attackRate = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.ATTACKRATE);
		ret.upkeep = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.UPKEEP);
		ret.might = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.MIGHT);
		ret.trainable = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.TRAINABLE) == 0? false:true;
		return ret;
	}
	
	public function creatTroopInfo(typeId:int,num:int):TroopInfo
	{
		var	gMain:GameMain = GameMain.instance();
		var common:Utility = Utility.instance();
		var curCityId:int = gMain.instance().getCurCityId();
		
		var	ret:TroopInfo = new TroopInfo();
		ret.typeId = typeId;
		var arString : Datas = Datas.instance();
		
		ret.troopName = arString.getArString("unitName."+"u" + typeId);
		ret.troopTexturePath = "ui_" + typeId;
		ret.description = arString.getArString("unitDesc."+"u" + typeId);
		ret.owned = num;
		return ret;
	
	}
	
	public function GetTroopList():Array//all
	{
		return troopList;
	}
	
	public function GetTroopListInCurCity():Array
	{
		return troopListInCurCity;
	}
	
	protected function InitTroopList()
	{ 
	/*
		var obj:TroopInfo;
		troopList.Clear();
		
		for(var i:int =0; i<allUnitIds.length; i++)
		{
			obj = this.GetTroopInfo(allUnitIds[i]);
			troopList.push(obj);
		}
	*/
		troopList.Clear();
		troopListInCurCity.Clear();
		troopList = GetUnitsList();
		var curCityOrder:int = GameMain.instance().getCurCityOrder();
		for(var i:int=0;i<troopList.length;i++)
		{
			var troop:Barracks.TroopInfo = troopList[i] as Barracks.TroopInfo;
			if(! CanTrainInThisCity(troop.needCityOrder,curCityOrder))
			{
				continue;
			}
			troopListInCurCity.Push(troop);
		}
	}
	/**
		for rallyPoint & march view.
	*/
	
	public function GetTroopListWithOutZero():Array
	{
		return GetTroopListWithOutZero(0);
	}
	
	public function GetTroopListWithOutZero(load:long):Array
	{
		UpadateAllTroop();
		var list:Array = new Array();
		for(var i:int = 0; i< troopList.length; i++)
		{
			var obj:TroopInfo = troopList[i] as TroopInfo;
			if(obj!=null && obj.owned>0)
			{
				list.Push(obj);
			}
		}	
		if(load <=0 )
		{
			return list;
		}
		else
		{
			list.Sort(function(comparea:Object,compareb:Object){
				var loada:long = (comparea as TroopInfo).load;
				var loadb:long = (compareb as TroopInfo).load;
				return loadb - loada;
			});
			for(var item:TroopInfo in list)
			{
				if(load > item.load * item.owned)
				{
					item.selectNum = item.owned;
					load = load - item.load * item.owned;
				}
				else
				{
					item.selectNum = (load + item.load - 1)/ item.load;
					break;
				}
			}
			
			list.Sort(function(comparea:Object,compareb:Object){
				var typea:int = (comparea as TroopInfo).typeId;
				var typeb:int = (compareb as TroopInfo).typeId;
				return typea - typeb;
			});
			return list;
		}
	}
	
	public function UpadateTroopList(troopId:int ,cityId:int)
	{
		for(var i:int = 0; i< troopList.length; i++)
		{
			var troopInfo : TroopInfo = troopList[i] as TroopInfo;
			if ( troopInfo.typeId == troopId )
			{
				troopInfo.owned = getUnitCountForType(troopId, cityId);
				if ( troopInfo.selectNum > troopInfo.owned )
					troopInfo.selectNum = troopInfo.owned;
				break;
			}
		}
	}
	
	public function UpadateAllTroop()
	{
		var cityId:int = GameMain.instance().getCurCityId();
		for(var i:int = 0; i< troopList.length; i++)
		{
			var troopInfo : TroopInfo = troopList[i] as TroopInfo;
			troopInfo.owned = getUnitCountForType(troopInfo.typeId, cityId);
			if ( troopInfo.selectNum > troopInfo.owned )
				troopInfo.selectNum = troopInfo.owned;
		}
		MenuMgr.getInstance().sendNotification(Constant.Notice.BARRACK_UNITS_CNT_UP, null);
	}
	
	public var	Queue:QueueClass = new QueueClass();
	class	QueueClass{
	
		// Returns all queue slots as an array of objects.
		//
		private var m_trainQueue:Array = new Array();
		public	function	slots (cityId:int) :Array{
//			return Object.values(seed["training_queue"]["c" + cityId]);
			return _Global.GetObjectValues(GameMain.instance().getSeed()["training_queue"]["c" + cityId]);
		}

		// Returns all slots that are "empty" or available
		//
		public	function	emptySlots(cityId:int) :Array{
//			return this.slots(cityId).select(function (queue) {
//				return _Global.INT32(queue.status, 10) === 0 && _Global.INT32(queue.eta, 10) <= unixtime();
//			});
			var	ret:Array = new Array();
			var slt:Array = slots(cityId);
			var i:int = 0;
			for( i = 0; i < slt.length; i ++ ){
				if( _Global.INT32( (slt[i] as HashObject)["eta"]) <= GameMain.unixtime() ){
					ret.Add(slt[i]);
				}
			}
			return ret;
		}
		
		public function GetTraiQueue():Array
		{			
			return m_trainQueue;
		}
		
		function ParseQueue(slot:HashObject, cityId:int):TrainInfo
		{
			var arString :Datas = Datas.instance();
			var ret:TrainInfo =  new TrainInfo();

			ret.id = _Global.INT32(slot["id"]);
			ret.itemType = _Global.INT32(slot["type"]);
			ret.itemName = arString.getArString("unitName."+"u" + ret.itemType);
			ret.quant = _Global.INT32(slot["quant"]);

//			ret.needed = _Global.parseTime(slot["needed"]);
			ret.cityId = cityId;
			ret.endTime = _Global.parseTime(slot["eta"]);
			ret.startTime = _Global.parseTime(slot["ticker"]);
			ret.needed = ret.endTime - ret.startTime;
			ret.timeRemaining = ret.endTime - GameMain.unixtime();
			ret.owned = Barracks.instance().getUnitCountForType(ret.itemType, cityId);
			ret.description = arString.getArString("unitDesc."+"u" + ret.itemType);
			ret.canCancel = _Global.INT32(slot["canCancel"]) == 1;
			var itemRatio : float = _Global.INT32(slot["ratio"]);
			var techRatio: float = _Global.INT32(slot["techNumRadio"]);
			ret.ratio = itemRatio;
			if(itemRatio != 0 && techRatio != 0)
			{
				ret.realRatio = itemRatio * (techRatio * 0.0001 + 1);
			}
			else if(itemRatio == 0 && techRatio != 0)
			{
				ret.realRatio = techRatio * 0.0001 + 1;
			}

			else if(itemRatio != 0 && techRatio == 0)
			{
				ret.realRatio = itemRatio;
			}
			else
			{
				ret.realRatio = 0;
			}
			ret.classType = QueueType.TrainningQueue;
			return ret;
		}

		// Returns "active" slots, i.e. ones that are currently in production.
		//
		// Actually, this behaves the way it does, returning activeSlots as an array,
		// becaue parts of code are expecting it as an array. However, since we
		// moved away from statuses and switched entirely to time based queueing,
		// all I did is alter the function to match what is expected.
		// Also allows for the ability to have multiple active slots in the future.
		//
		public	function	activeSlots (cityId:int) :Object{
		//	var ret:Array = new Array();
			return current(cityId);
		}

		// Returns all queued slots, i.e. ones that are waiting but not the current
		// active slot.
		//
		// The optimal way to do this would be remove all this.activeSlots.. but since
		// we only currently allow one, I just use a prototype function to simply remove
		// the current active slot
		//
		public	function	queuedSlots(cityId:int) :Array{
			var curSlot:HashObject = current(cityId);
			var slts:Array = slots(cityId);
			var slot:HashObject;
			var ret:Array = new Array();
			
			if( curSlot == null )
				return ret;
 			for( var i:int = 0; i < slts.length; i ++ ){
				slot = slts[i];
//				_Global.Log("slot id:"+slot["id"]);
				if( slot["id"].Value != curSlot["id"].Value && _Global.parseTime(slot["eta"]) > GameMain.unixtime() ){
					ret.Add(slot);
				}
			}
			
			return ret;
		}

//		class Cmp implements System.Collections.IComparer{
//			public	function	Compare( a:Object, b:Object ){
//				return a["eta"] - b["eta"];
//			}
//		}
//		private	var cmper:Cmp = new Cmp();
		// Returns queued slots sorted by finish time (in the actual order of the queue)
		public	function	queuedSlotsSorted(cityId:int):Array {
			
//			return this.queuedSlots().sort(function (a, b) {
//				return a.eta - b.eta;
//			});
			var tmp:HashObject;
			var i:int;
			var j:int;
			var slts:Array = queuedSlots(cityId);
			
			for( i = 0; i < slts.length; i ++ ){
				for( j = i + 1; j < slts.length; j ++ ){
					if( _Global.parseTime((slts[j] as HashObject)["eta"]) < _Global.parseTime( (slts[i] as HashObject)["eta"]) ){
						tmp = slts[i];
						slts[i] = slts[j];
						slts[j] = tmp;
					}
				}
			}
			return slts;
		}

		// Return slot id for the current unit being traned
		// returns null if there isn't one
		//
		public	function	current (cityId:int) :Object{
			var smallest:double = double.PositiveInfinity;
			var	nextSlot:HashObject = null;
			var slts:Array = slots(cityId);
			var slot:HashObject;
			var i:int = 0;
//			if(slts.length > 0)
//			{
//				smallest = GameMain.unixtime() + 0xfffff;
//		//		nextSlot = slts[0];
//			}	
			for( i = 0; i < slts.length; i ++ ){
				slot = slts[i];
		
				var endTime:double = _Global.parseTime(slot["eta"]);
				var bSmall:boolean  = endTime < smallest;
			//		var time:long = GameMain.unixtime();
				if (endTime < smallest && endTime > GameMain.unixtime()) {
					smallest = endTime;
					nextSlot = slot;
				}
		
			}
			
			if (nextSlot) {
				if (_Global.parseTime( nextSlot["ticker"] ) > GameMain.unixtime()) { // reset to current
					var slotData:Hashtable = {
					"eta":_Global.parseTime(nextSlot["eta"]) - _Global.parseTime(nextSlot["ticker"]) + GameMain.unixtime(),//( _Global.parseTime( nextSlot["needed"] ) + GameMain.unixtime() ),
					"ticker":GameMain.unixtime()
					};
					
					this.updateSlotWithCityID(_Global.INT32(nextSlot["id"]),slotData, cityId);
				}
				return this.getSlot(_Global.INT32(nextSlot["id"]), cityId);
			} else {
				return null;
			}
		}

		// Return slot id for the next unit in training in queue
		// returns null if there isn't one
		//
		public	function	next (cityId:int) {
			var smallest = double.PositiveInfinity;
			var	nextSlot = null;
			var slts:Array = queuedSlots(cityId);
			var slot:HashObject;
			if(slts.length > 0)
				smallest = _Global.parseTime((slts[0] as HashObject)["eta"]);
			for( var i:int = 0; i < slts.length; i ++ ){
				slot = slts[i];
				var endTime:double = _Global.parseTime(slot["eta"]);
				if (endTime < smallest && endTime > GameMain.unixtime()) {
					smallest = _Global.parseTime(slot["eta"]);
					nextSlot = slot;
				}
			}
			return nextSlot;
		}

		// Returns the next empty (available) slot
		//
		public	function	nextEmpty ():HashObject {
			return this.emptySlots(GameMain.instance().getCurCityId())[0];
		}

		// Checks to make sure if the number of barracks can support the amount of slots.
		// The reason is as soon as a barracks is built, it creates a new queue, but it
		// is not available for use until construction is complete.
		//
		public	function	enoughCapacity () :boolean{
			var curCityId:int = GameMain.instance().getCurCityId();
			var activeNum:int = 0;
			if(this.activeSlots(curCityId))
				activeNum = 1;
			return Building.instance().getCountForType(Constant.Building.BARRACKS,curCityId) > activeNum + this.queuedSlots(curCityId).length;
		}

		// Returns true if there's an available queue for training
		//
		public	function	available () :boolean{
			var curCityId:int = GameMain.instance().getCurCityId();
//			_Global.Log("empty slot:" + this.emptySlots(curCityId).length);
			return this.enoughCapacity() && this.emptySlots(curCityId).length > 0;
		}

		// Start a slot into active production and update the seed accordingly
		//
		public	function	start (slot:HashObject) {
			var seed:HashObject = GameMain.instance().getSeed();
			var currentcityid:int = GameMain.instance().getCurCityId();
			var timeadd = _Global.parseTime(slot["eta"]) - _Global.parseTime(slot["ticker"]);
			seed["training_queue"]["c" + currentcityid]["t" + slot["id"].Value]["ticker"].Value = GameMain.unixtime();
			seed["training_queue"]["c" + currentcityid]["t" + slot["id"].Value]["eta"].Value = _Global.INT32(slot["eta"]) + timeadd;
		//	this.SynDataWithSeed();
		}

		// Set the specified queue slot to inactive and all associated actions
		//
		public	function	stopSlotId (slotId:int, cityId:int) {
			var seed:HashObject = GameMain.instance().getSeed();
			var removedEta:long = _Global.parseTime(seed["training_queue"]["c" + cityId]["t" + slotId]["eta"]);
			var queueTimeReduced:long = removedEta - _Global.parseTime(seed["training_queue"]["c" + cityId]["t" + slotId]["ticker"]);
			if(slotId == (m_trainQueue[0] as TrainInfo).id )
			{
				queueTimeReduced = removedEta - GameMain.unixtime();
			}
			seed["training_queue"]["c" + cityId]["t" + slotId]["status"].Value = GameMain.unixtime() - 10;
			seed["training_queue"]["c" + cityId]["t" + slotId]["eta"].Value = GameMain.unixtime() - 10;
		//	this.SynDataWithSeed();
			var slots:Array = _Global.GetObjectKeys(seed["training_queue"]["c" + cityId]);
			for(var i:int =0; i<slots.length; i++)
			{
				var curSlot:HashObject =seed["training_queue"]["c" + cityId][slots[i]] ;
				if(_Global.parseTime(curSlot["ticker"]) >= removedEta){
					curSlot["ticker"].Value = _Global.parseTime(curSlot["ticker"]) - queueTimeReduced;
					curSlot["eta"].Value = _Global.parseTime(curSlot["eta"]) - queueTimeReduced;
				}	
			}
			
			for(i =0; i<m_trainQueue.length; i++)
			{
				if((m_trainQueue[i] as TrainInfo).id == slotId)
				{	
					(m_trainQueue[i] as TrainInfo).endTime = GameMain.unixtime() - 10;
					(m_trainQueue[i] as TrainInfo).timeRemaining = 0;				
					m_trainQueue.RemoveAt(i);
					if( m_trainQueue.length > 0)
					{
						SynDataWithSeed();
						MenuMgr.getInstance().UpdateTrainProgress();
					}		
					MenuMgr.getInstance().UpdateData();
					break;
				}
			}
			
			checkSlotForAnimation();
		}

		// Updates a queue slot with data from an object passed in
		// returns the updated object
		//
		public	function	updateSlot (slotId:int, slotData:Hashtable):HashObject {
			var currentcityid:int = GameMain.instance().getCurCityId();
			return updateSlotWithCityID(slotId, slotData, currentcityid);
		}

		private function updateSlotWithCityID( slotId:int, slotData:Hashtable, cityID : int):HashObject {
			var seed:HashObject = GameMain.instance().getSeed();
			var keys:Array = _Global.GetObjectKeys(slotData);

			for( var i:int = 0; i<keys.length; i++ ){
				var key:String =  keys[i];
				seed["training_queue"]["c" + cityID]["t" + slotId][key].Value = slotData[key];
			}
		//	SynDataWithSeed();
			return seed["training_queue"]["c" + cityID]["t" + slotId];
		}

		public function SpeedUp(slotId:int, reduceTime:long, cityId:int)
		{
			var seed:HashObject = GameMain.instance().getSeed();
			var slots:Array = _Global.GetObjectKeys(seed["training_queue"]["c" + cityId]);
			for(var i:int =0; i<slots.length; i++)
			{
				var curSlot:HashObject =seed["training_queue"]["c" + cityId][slots[i]] ;
				curSlot["ticker"].Value = _Global.parseTime(curSlot["ticker"]) - reduceTime;
				curSlot["eta"].Value = _Global.parseTime(curSlot["eta"]) - reduceTime;
			}	
			var trainQueue:Array = GetTraiQueue();
			for(i=0; i<trainQueue.length; i++)
			{
				(trainQueue[i] as TrainInfo).startTime -= reduceTime;
				(trainQueue[i] as TrainInfo).endTime -= reduceTime;
			}
			
			checkSlotForAnimation();
		}
		
		function checkSlotForAnimation():void
		{
			if(m_trainQueue != null && m_trainQueue.length > 0)
			{
				GameMain.instance().setBuildingAnimationOfCity(Constant.Building.BARRACKS, Constant.BuildingAnimationState.Open);
			}
			else
			{
				GameMain.instance().setBuildingAnimationOfCity(Constant.Building.BARRACKS, Constant.BuildingAnimationState.Close);
			}		
		}

		// When a barracks is started, this creates a new training slot
		//
		public	function	addSlot (slotId:int, cityId:int) {
				

			var slotInfo:Hashtable={
				"id": slotId,
				"eta": 0,
				"needed": 0,
				"progress": 0,
				"quant": 0,
				"status": 0,
				"ticker": 0,
				"type": 0,
				"ratio":0,
				"techNumRadio":0
			};
			GameMain.instance().getSeed()["training_queue"]["c" + cityId]["t" + slotId] = new HashObject(slotInfo);
		}

		public function UpdateSlotRatio(slotId,ratio:int){
			var currentcityid:int = GameMain.instance().getCurCityId();
			var seed:HashObject = GameMain.instance().getSeed();
			if (seed["training_queue"]["c" + currentcityid]["t" + slotId]!=null) {
				seed["training_queue"]["c" + currentcityid]["t" + slotId]["ratio"].Value = ratio;

				//this.seed = seed;

			SynDataWithSeed();
			}
		}

		// Returns the specified slot object
		//
		public	function	getSlot(slotId, cityId):Object {
			return GameMain.instance().getSeed()["training_queue"]["c" + cityId]["t" + slotId];
		}
		
		public function UpdateData()
		{
			var i:int = 0;
			var removeItem:boolean = false;
			var currentcityid:int = GameMain.instance().getCurCityId();
			while( i < m_trainQueue.length)
			{
                var trainInfo : TrainInfo = m_trainQueue[i] as TrainInfo;
				trainInfo.timeRemaining = trainInfo.endTime - GameMain.unixtime();
				if(trainInfo.timeRemaining <= 0)
				{
					trainInfo.timeRemaining = 0;
					Barracks.instance().UpadateTroopList(trainInfo.itemType, currentcityid);
				    
                    DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.Training, {
                        "uid" : trainInfo.itemType,
                        "qty" : trainInfo.quant
                    });
					UpdateSeed.instance().followCheckQuest(4);			
					
					m_trainQueue.RemoveAt(i);
					removeItem = true;
				}
				else
				{
					i++;
				}
			}
			
			if(removeItem)
			{
				if(m_trainQueue.length > 0)
				{
					SynDataWithSeed();
					MenuMgr.getInstance().UpdateTrainProgress();				
				}
				else
				{
					checkSlotForAnimation();
				}
			}	
			if(removeItem)
			{
				MenuMgr.getInstance().sendNotification(Constant.Notice.TRAIN_COMPLETED,null);
				MenuMgr.getInstance().UpdateData();
				SoundMgr.instance().PlayEffect( "end_construction", /*TextureType.AUDIO*/"Audio/" );
				GameMain.instance().seedUpdateAfterQueue(true);
                GameMain.instance().invokeUpdateSeedInTime(1);
			}	
		}
		
		public function SynDataWithSeed()
		{
			var cityId:int  = GameMain.instance().getCurCityId();
			m_trainQueue.Clear();
			var slt:Array = queuedSlotsSorted(cityId);	
			var curSlot:HashObject = current(cityId);
			if(curSlot)
				m_trainQueue.Push( ParseQueue(curSlot, cityId) );
			for( var i:int = 0; i < slt.length; i ++ )		
			{
				m_trainQueue.Push( ParseQueue(slt[i], cityId) );
			}
			
			checkSlotForAnimation();		
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
				if(slt.length > 0)
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
	
	public	function	dismissDo (unitId:int, barracks_dismiss_ipt:int) {
	
		var currentcityid:int = GameMain.instance().getCurCityId();
		var params:Array = new Array();
		params.Add(currentcityid);
		params.Add(unitId);
		params.Add(barracks_dismiss_ipt);
		
		var okFunc:Function = function(result:Object){
//			_Global.Log("dismissDoOK");
			
//			var unitmight:HashObject = Datas.instance().unitmight();
			addUnitsToSeed(unitId, barracks_dismiss_ipt * -1, currentcityid);
				
			seed["player"]["might"].Value = _Global.INT64(seed["player"]["might"]) - (GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTroopMight(Constant.TroopType.UNITS,unitId) * barracks_dismiss_ipt);
			UpadateTroopList(unitId, currentcityid);
			MenuMgr.getInstance().OnDismiss();
			InitTroopList();
		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String){
//			_Global.Log("dismissDoError:"+msg);
//		};
//		
//		UnityNet.reqDismissUnits(params, okFunc, errorFunc);
		UnityNet.reqDismissUnits(params, okFunc, null);

	}
	
	public	function	trainTime (unitId:int, quant:int) {
		if(quant == 0)
			return 0;
		var curCityId:int = GameMain.instance().getCurCityId();
		var building:Building = Building.instance();
		//var trainingData:HashObject = Datas.instance().trainingData();
		//var basetime:int = _Global.INT32(trainingData["u" + unitId]["c"][_Global.ap + 10]) * quant;
		var basetime:int = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainBaseTime(Constant.TroopType.UNITS,unitId) * quant;
		var	buildingLevel:int = 0;
		var	barracksBonus:float = 0;
		var allType:Array = building.getAllOfType(13, curCityId);
		
//		var i:int = 0;
//		for( i = 0; i < allType.length; i ++ ){
//			barracksBonus += _Global.INT32(allType[i][_Global.ap +1]) + 9;
//		}
//		barracksBonus /= 10;
		
		barracksBonus = 1.0*(building.getLevelsSumForType(Constant.Building.BARRACKS, curCityId) + (building.getCountForType(Constant.Building.BARRACKS, curCityId) * 9)) / 10;
		if(barracksBonus == 0)
			return 1;
		// Calculate building bonus for specific troop types
		if ( Constant.Unit.CALVARY == unitId ||
			Constant.Unit.HEAVY_CALVARY == unitId) {
			buildingLevel = buildingLevel + building.getMaxLevelForType(Constant.Building.STABLE, curCityId);
			
		} else if (Constant.Unit.SUPPLY_WAGON == unitId ||
				Constant.Unit.SCORPIO == unitId ||
				Constant.Unit.BATTERING_RAM == unitId ||
				Constant.Unit.BALLISTA == unitId) {
			buildingLevel = buildingLevel + building.getMaxLevelForType(Constant.Building.WORKSHOP, curCityId);
			
		} else { // SUPPLY_DONKEY, CONSCRIPT, LEGIONARY, CENTURION, SKIRMISHER
			buildingLevel = buildingLevel + building.getMaxLevelForType(Constant.Building.BLACKSMITH, curCityId);
		}
		
		// TroopType: 1 Supply 2 Horse 3 Ground 4 Artillery
		var troopType : int = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS, unitId, Constant.TroopAttrType.TYPE);
		var heroBonus : float = 0.0f;
		var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
		switch (troopType)
		{
			case 1:
				heroBonus = HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Supply);
				break;
			case 2:
				heroBonus = HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Horse);
				break;
			case 3:
				heroBonus = HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Ground);
				break;
			case 4:
				heroBonus = HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Artillery);
				break;
		}
		var leagueBonus:float = SeasonLeagueMgr.instance().GetTrainTroopBuff(KBN.GameMain.singleton.GetAllianceLeague());
		var vipLevel : int = GameMain.instance().GetVipOrBuffLevel();
		var vipDataItem : KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(vipLevel);
		return Mathf.Max(1, Mathf.Ceil(1.0*basetime / (barracksBonus * (1 + General.instance().combatBonus() + Research.instance().bonusForType(Constant.Research.TACTICS) + Technology.instance().getCutDownTrainTroopTime() + (buildingLevel * 0.1) + heroBonus + leagueBonus + (vipDataItem.TRAIN_SPEED * 0.01f)))));
	}

	public	function	trainTimeCalc(quant:int, unitid:int) {
		var	maxnum:int = trainMax(unitid);

		if (maxnum < 0) {
			maxnum = 0;
		}

		if (quant) {
			if (quant > maxnum) {
				quant = maxnum;
				
			} else if (quant < 0) {
				quant = 0;
				
			}
//			if (_Global.INT32(tgt.value, 10) === 0) {
//				traintimeElem.update('');
//			} else {
//				traintimeElem.update(timestr(Barracks.trainTime(unitid, tgt.value), 1));
//			}
		} else {
//			tgt.value = '';
//			traintimeElem.update('');
		}
	}
	
	public	function	trainMax (unitid:int):int {
		//var	trainingData:HashObject = Datas.instance().trainingData();
		var resource:Resource = Resource.instance();
		var reqs:Array = new Array();
		var	own:Array = new Array();
		var	maxamt:long = System.Int64.MaxValue;//double.PositiveInfinity;
		//var	unitCost:HashObject = trainingData["u" + unitid]["c"];
		var	unitCost:HashObject = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainCostData(Constant.TroopType.UNITS,unitid);
		if(unitCost == null) return 0;
		var	i:int;
		var curCityId:int = GameMain.instance().getCurCityId();
		
		var saleData:HashObject = null;
		var remainder:int = 0;
		var reqNum:double = 0;
		for (i = 0; i <= 7; i++) 
		{ // gold, resources
			if(i==5 || i==6){continue;}
			saleData = GameMain.instance().getResSaleForTrainTroop(Constant.TroopType.UNITS,unitid,i);
			reqNum = _Global.INT64(_Global.CeilToInt(_Global.INT64(unitCost[_Global.ap + i])));
			if(saleData != null)
			{
				remainder = reqNum*_Global.INT32(saleData["Numerator"])%_Global.INT32(saleData["Denominator"]);
				reqNum = reqNum*_Global.INT32(saleData["Numerator"])/_Global.INT32(saleData["Denominator"]);
				if(remainder != 0) reqNum++;
			}
			reqNum = reqNum / (1 + Technology.instance().getReduceTrainTroopResConsume());
			reqNum = _Global.CeilToInt(reqNum);
			reqs.push(reqNum);
			own.push(resource.getCountForTypeInSeed(i, curCityId));
		}
		
		reqs.push(unitCost[_Global.ap +5].Value);
		own.push(resource.populationIdle(curCityId));
		
		//troop
		var needTroopObj:HashObject;
		var troopId:int;
		var needNum:int;
		var ownNum:int;
		var reqResource : KBN.GDS_Troop.ResourceRequire = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetResourceRequeire(Constant.TroopType.UNITS,unitid);
		//var needTroops:System.Collections.ArrayList = KBN.GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainNeedTroops(Constant.TroopType.UNITS,unitid) as System.Collections.ArrayList;

		for(i=0;i<reqResource.troopRequire.Count;i++)
		{
			var reqTroop : KBN.GDS_Troop.ResourceRequire.TroopRequire = reqResource.troopRequire[i];
			needNum =  reqTroop.troopCnt;
			ownNum = Barracks.instance().getUnitCountForType(reqTroop.troopId, GameMain.instance().getCurCityId());
			saleData = GameMain.instance().getTroopSaleForTrainTroop(Constant.TroopType.UNITS,unitid);
			if(saleData != null)
			{
				remainder = needNum*_Global.INT32(saleData["Numerator"])%_Global.INT32(saleData["Denominator"]);
				needNum = _Global.CeilToInt(needNum*_Global.INT32(saleData["Numerator"])/_Global.INT32(saleData["Denominator"]));
				if(remainder != 0)
					needNum++;
			}
			reqs.push(needNum);
			own.push(ownNum);
			
			_Global.Log("*** Resource.TroopRequire " + i + ": " + ownNum);
		}
		
		for ( i = 0; i != reqResource.itemRequire.Count; ++i )
		{
			var itemRequire : KBN.GDS_Troop.ResourceRequire.ItemRequire = reqResource.itemRequire[i];
			needNum =  itemRequire.itemCnt;
			ownNum = MyItems.singleton.countForItem(itemRequire.itemId);
			//saleData = GameMain.instance().getTroopSaleForTrainTroop(Constant.TroopType.UNITS,unitid);
			//if(saleData != null)
			//{
			//	remainder = needNum*_Global.INT32(saleData["Numerator"])%_Global.INT32(saleData["Denominator"]);
			//	needNum = needNum*_Global.INT32(saleData["Numerator"])/_Global.INT32(saleData["Denominator"]);
			//	if(remainder != 0)
			//		needNum++;
			//}
			reqs.push(needNum);
			own.push(ownNum);
			
			_Global.Log("*** ResourceRequire.ItemRequire " + i + ": " + ownNum);
		}

		//items  --- to do in next version
		var reqTemp:long = 0;
		var ownTemp:long = 0;
		for (i = 0; i < reqs.length; i++) 
		{
			reqTemp = _Global.INT64(reqs[i]);
			ownTemp = _Global.INT64(own[i]);
			if (reqTemp != 0) 
			{
				if(ownTemp <= 0)
				{
					_Global.Log("*** ownTemp[" + i + "] : " +  ownTemp);
					return 0;
				}
				_Global.Log("*** ownTemp[" + i + "] : " + ownTemp);
				var cnt:long = Mathf.Floor( 1.0*ownTemp / reqTemp );
				maxamt = Mathf.Min(maxamt, cnt);
			}
		}
		
		return Mathf.Floor(maxamt);
	}
	
	public	function	trainUnit (unitTypeId:int, num:int, itemId:int, okCallback:Function) {
		
		var currentcityid:int = GameMain.instance().getCurCityId();
		var time:int = trainTime(unitTypeId, num);
		var	params:Array = new Array();
		params.Add(currentcityid);
		params.Add(unitTypeId);
		params.Add( num );
		params.Add(itemId);
		
		//var trainingData:HashObject = Datas.instance().trainingData();
		//var	unitCost:HashObject = trainingData["u" + unitTypeId]["c"];
		var	unitCost:HashObject = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainCostData(Constant.TroopType.UNITS,unitTypeId);
		var	i:int;
		
		if (!Queue.available()) {
//			Modal.showAlert(arStrings.SD.Barracks_hcString71);
			//TODO:
			ErrorMgr.instance().PushError("", Datas.instance().getArString("Error.NoTrainSlot"));	
				
		} else {
			params.Add(Queue.nextEmpty()["id"].Value);
			//add to queue
			if (itemId == 36) {
				time = _Global.INT32(time * 0.7);
			}
			var okFunc:Function = function(result:HashObject){
//				_Global.Log("trainUnitOK");
				
				
				for (i = 0; i <= 5; i++) { // remove resources
					Resource.instance().addToSeed(i, _Global.INT32(unitCost[_Global.ap + i].Value) * num * -1, currentcityid);
				}
				
				//subtract troops
				subtractTroopsForTrain(unitTypeId,num);
				
				var endTime:double =  _Global.parseTime(result["initTS"]) + _Global.INT64(result["timeNeeded"]);
				var techRatio : int = GetTechGetIncreaseNumOfBarracks();
				var slotData:Hashtable = {
					"eta":endTime,
					"needed": result["timeNeeded"].Value,
					"progress": 0,
					"quant": num,
					"status": result["status"].Value,
					"ticker": result["initTS"].Value,
					"type": unitTypeId,
					"canCancel":result["canCancel"].Value,
					"ratio":0,
					"techNumRadio": techRatio
				};
//				_Global.Log("start time: "+ _Global.parseTime(result["initTS"]));
//				_Global.Log("new train endtime: "+ endTime);
//				_Global.Log("need time: "+ result["timeNeeded"]);
//				_Global.Log("current time: " + GameMain.unixtime());
				var id:int = _Global.INT32(Queue.nextEmpty()["id"]);
				Queue.updateSlot(_Global.INT32(result["trainingId"]),
				slotData);
				
				
//				queue_changetab_building();	
				if (itemId == 36) {
					seed["items"]["i36"].Value = _Global.INT32(seed["items"]["i36"]) - 1;
				}
				if (result["updateSeed"]) {
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}
				Queue.SynDataWithSeed();
				
				if( okCallback ){
					okCallback();
				}
				
				SoundMgr.instance().PlayEffect( "start_train", /*TextureType.AUDIO*/"Audio/");
				InitTroopList();
			};
			
//			var	errorFunc:Function = function(msg:String, errorCode:String){
//				_Global.Log("trainUnitError:"+msg);
//			};
//			
//			UnityNet.reqTrainUnit(params, okFunc, errorFunc );
			UnityNet.reqTrainUnit(params, okFunc, null );
		}
	}
	
	public function GetTechGetIncreaseNumOfBarracks() : int
	{
		var rotioTech : int = Technology.instance().getIncreaseNumOfBarracks();
		if(rotioTech == 1)
		{
			rotioTech = 0;
		}
		
		return rotioTech;
	}
	
	// Removes a training queue.
	//
	public	function	removeTraining (trainingId:int, cityId:int, typetrn:int, 
						amount:int, trnETA:long, trnTmp:long, trnNeeded:long, okCallBack:Function) {
		var params = new Array();
		params.Add("CANCEL_TRAINING");
		params.Add(cityId);
		params.Add(typetrn);
		params.Add(amount);
		params.Add("" +trnETA);
		params.Add(""+trnTmp);
		params.Add(""+trnNeeded);
		params.Add(trainingId);
	
		var okFunc:Function = function(result:HashObject){
			for (var i:int = 0; i <= 4; i++) { // return the resources from the cancelled unit
				Resource.instance().addToSeed(i, GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainCostResource(Constant.TroopType.UNITS,typetrn,i) * _Global.INT32(amount) / 2, cityId);
			}
			
			// refund need troops
			refundTroopsFromCancelTrain(typetrn,amount);

			UpdateSeed.instance().update_seed(result["updateSeed"]);// return the resources from the cancelled unit
			var updateInventoryNode : HashObject = result["updateInventory"];
			if ( updateInventoryNode != null )
				UpdateSeed.instance().update_inventory(updateInventoryNode);

			Queue.stopSlotId(trainingId, cityId);
			
			if( okCallBack ){
				okCallBack();
			}
			
			InitTroopList();
		};
		UnityNet.reqRemoveTraining(params, okFunc, null );

	}
	
	// Returns the unit count for the ID passed in as an integer
	//  
	public	function	getUnitCountForType (unitId:int, cityId:int):long 
	{
		var temp = seed["units"]["city" + cityId]["unt" + unitId];
//		_Global.Log("temp--:"+troopInfo.owned);
		if(temp!=null && temp!="")
		{
			return _Global.INT64(temp);
		}
		
		return 0;
	}

//	// Returns the total amount of units for a city as an integer
//	//
//	public	function	totalUnitCount () {
//		return Barracks.allUnitIds.inject(0, function (acc, unitId) {
//																		return acc + Barracks.getUnitCountForType(unitId);
//																	});
//	}
	
	// Takes an amount and ADDs it to the current seed.
	//
	public	function	addUnitsToSeed (unitId:int, amount:int, cityId:int) {
		seed["units"]["city" + cityId]["unt" + unitId].Value = getUnitCountForType(unitId, cityId) + amount;
		UpadateTroopList(unitId ,cityId);
	}
	
	public function Update()
	{
		Queue.UpdateData();
	}
	

	
	public function addUnitsToSeed(unitTypeId:int, troopCount:int):void
	{
		var currentcityid:int = GameMain.instance().getCurCityId();
		seed["units"]["city" + currentcityid]["unt" + unitTypeId].Value = Barracks.instance().getUnitCountForType(unitTypeId, currentcityid) + troopCount;
		UpadateTroopList(unitTypeId ,currentcityid);
	}
	
	public function subtractUnitsToSeed(troopId:int,troopCount:int)
	{
		if(troopCount <= 0 ) return;
		var currentcityid:int = GameMain.instance().getCurCityId();
		seed["units"]["city" + currentcityid]["unt" + troopId].Value = Barracks.instance().getUnitCountForType(troopId, currentcityid) - troopCount;
		UpadateTroopList(troopId ,currentcityid);
	}
	
	public function subtractTroopsForTrain(troopId:int,trainNum:int):void
	{
		var reqResource : KBN.GDS_Troop.ResourceRequire = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetResourceRequeire(Constant.TroopType.UNITS, troopId);
		//var needTroops:System.Collections.ArrayList = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainNeedTroops(Constant.TroopType.UNITS,troopId) as System.Collections.ArrayList;
		var needNum:int;
		var remainder:int = 0;
		var saleData:HashObject = GameMain.instance().getTroopSaleForTrainTroop(Constant.TroopType.UNITS,troopId);

		for ( var i : int = 0; i != reqResource.troopRequire.Count; ++i )
		{
			var troopRequire : KBN.GDS_Troop.ResourceRequire.TroopRequire = reqResource.troopRequire[i];
			needNum = troopRequire.troopCnt;
			if(saleData != null)
			{
				remainder = needNum*_Global.INT32(saleData["Numerator"])%_Global.INT32(saleData["Denominator"]);
				needNum = needNum*_Global.INT32(saleData["Numerator"])/_Global.INT32(saleData["Denominator"]);
				if(remainder != 0) needNum++;
			}

			if(needNum > 0 )
				subtractUnitsToSeed(troopRequire.troopId,needNum*trainNum);
		}

		for ( var x : int = 0; x != reqResource.itemRequire.Count; ++x )
		{
			var itemRequire : KBN.GDS_Troop.ResourceRequire.ItemRequire = reqResource.itemRequire[i];
			MyItems.singleton.AddItem(itemRequire.itemId, -itemRequire.itemCnt * trainNum);
		}
	}
	
	public function refundTroopsFromCancelTrain(troopId:int,trainNum:int):void
	{
		var reqResource : KBN.GDS_Troop.ResourceRequire = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetResourceRequeire(Constant.TroopType.UNITS, troopId);
		//var needTroops:System.Collections.ArrayList = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTrainNeedTroops(Constant.TroopType.UNITS,troopId) as System.Collections.ArrayList;
		var troopObj:HashObject;
		var needTroopId:int;
		var needNum:int;
		var rateNumerator:int = GameMain.instance().getTrainRefundTroopRate_Numerator();
		var rateDenominator:int = GameMain.instance().getTrainRefundTroopRate_Denominator();
		if(rateDenominator == 0 || rateNumerator > rateDenominator) return;
		
		//for(var i:int=0;i<needTroops.Count;i++)
		for ( var i : int = 0; i != reqResource.troopRequire.Count; ++i )
		{
			var troopRequire : KBN.GDS_Troop.ResourceRequire.TroopRequire = reqResource.troopRequire[i];
			needNum = troopRequire.troopCnt;
			var retNum:int = needNum*trainNum*rateNumerator/rateDenominator;
			if(retNum > 0 )
			{
				addUnitsToSeed(troopRequire.troopId,retNum);
			}
		}
		//for ( var x : int = 0; x != reqResource.itemRequire.Count; ++x )
		//{
		//	var itemRequire : KBN.GDS_Troop.ResourceRequire.ItemRequire = reqResource.itemRequire[i];
		//	MyItems.singleton.AddItem(itemRequire.itemId, itemRequire.itemCnt * trainNum);
		//}
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

    private function GetUnitsList():Array
    {
        var retArr:Array = new Array();
        var gdsTroopList:Dictionary.<String, KBN.DataTable.IDataItem> = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetItemDictionary() as Dictionary.<String, KBN.DataTable.IDataItem>;
        for(var key:String in gdsTroopList.Keys)
        {
            var itemTroop:KBN.DataTable.Troop = gdsTroopList[key] as KBN.DataTable.Troop;
            if(itemTroop!=null)
            {
                var nKey:int = _Global.INT32(key);
                if(nKey>=KBN.GDS_Troop.MAX_UNIT)
                    continue;
                var troopInfo:Barracks.TroopInfo = new Barracks.TroopInfo();

                troopInfo.typeId = nKey;
                troopInfo.needCityOrder = _Global.GetString(itemTroop.CITY);
                troopInfo.troopName = Datas.instance().getArString("unitName."+"u" + troopInfo.typeId);
                troopInfo.troopTexturePath = "ui_" + troopInfo.typeId;
                troopInfo.description = Datas.instance().getArString("unitDesc."+"u" + troopInfo.typeId);
                troopInfo.bLocked = false;
                troopInfo.owned = Barracks.instance().getUnitCountForType(troopInfo.typeId, GameMain.instance().getCurCityId());
                troopInfo.appearTab = _Global.INT32(itemTroop.TAP);

                troopInfo.health        = _Global.INT32(itemTroop.LIFE);
                troopInfo.attack        = _Global.INT32(itemTroop.ATTACK);
                troopInfo.speed         = _Global.INT32(itemTroop.SPEED);
                troopInfo.load          = _Global.INT32(itemTroop.LOAD);
                troopInfo.actType       = _Global.INT32(itemTroop.Type);
                troopInfo.level         = _Global.INT32(itemTroop.TIER);
                troopInfo.lifeRate      = _Global.INT32(itemTroop.LIFE_RATE);
                troopInfo.attackRate    = _Global.INT32(itemTroop.ATTACK_RATE);
                troopInfo.upkeep        = _Global.INT32(itemTroop.UPKEEP);
                troopInfo.might         = _Global.INT32(itemTroop.MIGHT);
                var trainable:int       = _Global.INT32(itemTroop.TRAINABLE);
                troopInfo.trainable = trainable == 0 ? false : true;

                retArr.Push(troopInfo);
            }
        }
        return retArr;
    }	
}
