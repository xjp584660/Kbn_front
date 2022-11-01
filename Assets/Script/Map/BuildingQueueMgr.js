
class	BuildingQueueMgr{

	class	CityQueue{
		public	static	var	MAX_CNT:int = 1;
		
		public	var	cityId:int;
		public	var	buildingQueue:Array = new Array();
		
		public	function	full():boolean{
			return	buildingQueue.length >= MAX_CNT;
		}
		
		public	function	first():QueueElement{
			return	buildingQueue.length > 0 ? buildingQueue[0] : null;
		}
		
		public function finish(slotId:int):boolean {
			for (var i:int = 0; i < buildingQueue.length; i++) {
				var qe : QueueElement = buildingQueue[i] as QueueElement;
				if (qe.slotId == slotId) {
					qe.endTime = 0;
					return true;
				}
			}
			return false;
		}
		
		public	function	add(element:QueueElement):boolean{
			if( full() && element.needed > 0)
			{
				return false;
			}
			
//			_Global.Log("cityQueue add");
			buildingQueue.Add(element);
			if( cityId == GameMain.instance().getCurCityId() ){
				GameMain.instance().onBuildingStart(element.slotId, element.itemType, element.level,element);
			}
			return true;
		}
		
		public	function	cancel():QueueItem
		{
			if( buildingQueue.length > 0 )
			{
				var qe:QueueElement = first();	//buildingQueue.Pop();
				qe.endTime = GameMain.unixtime();
				qe.timeRemaining = 0;	//will be removed from queue..
				return qe;
			}
			return null;
		}
		
		public function cancel(slotId:int):QueueItem
		{
			var qe:QueueElement = first();
			if(qe && qe.slotId == slotId)
			{
				return this.cancel();				
			}
			return null;
		}
		
		public	function	slotBusy(slotId:int):boolean{
			var	queueElement:QueueElement;
			for( var i:int = 0; i < buildingQueue.length; i ++ ){
				queueElement = buildingQueue[i];
				if( queueElement.slotId == slotId ){
					return true;
				}
			}
			
			return false;
		}
		
		public	function	update(){
			var i:int = 0; 
			var	queueElement:QueueElement;
			
			for( i = buildingQueue.length - 1; i >= 0 ; i -- )
			{
				queueElement = buildingQueue[i];
				
//				_Global.Log("timeRemaining:" + queueElement.timeRemaining);
				if( queueElement.timeRemaining > 0 )
				{
					//queueElement.timeRemaining = queueElement.endTime - GameMain.unixtime();
					queueElement.calcRemainingTime();
				}
				else
				{
					SoundMgr.instance().PlayEffect( "end_construction", /*TextureType.AUDIO*/"Audio/");
					if( queueElement.level == 0 )
					{ // demolished
						//add resource ...
						var seed:HashObject = GameMain.instance().getSeed();
						var buildingOrigLevel:int =_Global.INT32(seed["buildings"]["city" + cityId]["pos" + queueElement.slotId][_Global.ap + 1].Value);
						//var constructionData:HashObject = Datas.instance().constructionData();
						
						
						for( var resourceId:int = 0; resourceId <= 4; resourceId ++ )
						{
							//Resource.instance().addToSeed(resourceId, _Global.INT64(constructionData["b" + queueElement.itemType]["c"][_Global.ap + resourceId]) * Mathf.Pow(2, buildingOrigLevel - 2), cityId);
							Resource.instance().addToSeed(resourceId, _Global.INT64(GameMain.GdsManager.GetGds.<GDS_Building>().getCostResource(queueElement.itemType,buildingOrigLevel,resourceId))/4, cityId);
						}
			
						Resource.instance().UpdateRecInfo();						
						
						//adjust population
						
						Building.instance().BuildDestroyed(queueElement.slotId,cityId);
					}
					else
					{
						GameMain.instance().getSeed()["buildings"]["city" + cityId]["pos" + queueElement.slotId] = new HashObject({
																			_Global.ap + 0:queueElement.itemType + "", 
																			_Global.ap + 1:queueElement.level + "", 
																			_Global.ap + 2:queueElement.slotId + "", 
																			_Global.ap + 3:queueElement.id + ""
																			
						});
					}
					
					if(queueElement.slotId == 0 && queueElement.level == 5)
					{
						var curTime:long = GameMain.unixtime();
						var seeds:HashObject = GameMain.instance().getSeed();
						
						if(_Global.parseTime(seeds["player"]["beginnerProtectionExpireUnixTime"]) > curTime)
						{
							seeds["player"]["beginnerProtectionExpireUnixTime"].Value = 0;
							BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_FRESHMAN, -1);
						}
					}
					
					buildingQueue.RemoveAt(i);
					
					BuildingDecMgr.getInstance().checkIsConditionReach(queueElement.itemType);

                    DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.Building, 
                        {"buildingId": queueElement.itemType, "level": queueElement.level, "lastLevel": queueElement.lastLevel});
                    
					if( cityId == GameMain.instance().getCurCityId() )
						GameMain.instance().onBuildingFinish(queueElement.slotId,queueElement.itemType,queueElement.level,queueElement.lastLevel );
					
					MenuMgr.getInstance().sendNotification(Constant.Notice.BUILDING_PROGRESS_COMPLETE,queueElement);
					//build cottage,upgrade farm; build academy;
					KBN.FTEMgr.getInstance().checkNextFTE([
							FTEConstant.Step.BUILD_HOUSE_COMPLETE,
							FTEConstant.Step.UP_BUILD_COMPLETE,
							FTEConstant.Step.BUILD_ACADEMY_COMPLETE,
							FTEConstant.Step.UP_BUILD_SPEED_2_LEVELUP
					]);
				}
			}
		}
	}
	
	class	QueueElement extends QueueItem{
		public	var lastLevel:int;
		public	var	progress:int;
		public	var	slotId:int;
        
        public function QueueElement()
        {
            classType = QueueType.BuildingQueue;
        }
        
        public function ToString() : String
        {
            return String.Format("QueueElement: lastLevel={0}, progress={1}, slotId={2}, classType={3}",
                lastLevel, progress, slotId, classType);
        }
	}
	
	private	static	var	singleton:BuildingQueueMgr;
	private	var	cities:Array = new Array();
	private var seed:HashObject;
	
	public	static	function	instance():BuildingQueueMgr{
		if( singleton == null ){
			singleton = new BuildingQueueMgr();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;	
	}
	
	public	function	init(sd:HashObject){
		var keys:Array = _Global.GetObjectKeys( sd["queue_con"] );
		var values:Array;
		var cityId:int;
		this.seed = sd;
		for( var i:int = 0; i < keys.length; i ++ ){
			cityId = _Global.INT32((keys[i] as String).Substring("city".length));
			values = _Global.GetObjectValues(sd["queue_con"][keys[i]]);
			for( var j:int = 0; j < values.length; j ++ ){
				add(cityId, values[j] );
			}
		}
	}
    
	public	function	update(){
		var i:int = 0;
		var city:CityQueue;
		
		for( i = 0; i < cities.length; i ++ ){
			city = cities[i];
			city.update();
		}
	}
	
	public	function	add(cityId:int, buildingArray:Object):boolean{
		
		var	element:QueueElement = parseQueue(cityId,buildingArray);
		if( element == null )	// instant finish.
		{
			return false;
		}
		
//		//add to seed
//		seed["queue_con"]["city" + cityId].push([buildingId, currentLevel + 1, _Global.INT32(result.buildingId, 10), 0, 0, 0, 0, _Global.INT32(cityPos, 10)]);
		
		var city:CityQueue = getCityQueue(cityId);
		
		if( city == null ){
			city = new CityQueue();
			city.cityId = cityId;
			cities.Add(city);
		}
		
		return city.add(element);
	}
	
	public	function	full(cityId:int):boolean{
		var city:CityQueue = getCityQueue(cityId);
		if( city == null ){
			return false;
		}
		return city.full();
	}
	
	public	function	first(cityId:int):QueueElement{
		var city:CityQueue = getCityQueue(cityId);
		if( city == null ){
			return null;
		}
		return city.first();
	}
	
	public function finish(cityId:int, slotId:int):boolean {
		var city:CityQueue = getCityQueue(cityId);
		if (null != city) return city.finish(slotId);
		return false;
	}
	
	public	function	slotBusy(cityId:int, slotId:int):boolean{
		var city:CityQueue = getCityQueue(cityId);
		if( city == null ){
			return false;
		}
		return city.slotBusy(slotId);
	}
	
	public function updateBuildingQueueWithHelpData(cid:int,hObj:HashObject):void
	{
		var q:CityQueue = this.getCityQueue(cid);
		if(q)
		{
			var qItem :QueueItem = q.first();
			var endTime:long = _Global.parseTime(hObj["endTime"]);
			if(qItem != null && qItem.id  == _Global.INT32(hObj["bid"]) && endTime <= qItem.endTime )
			{
				qItem.startTime = _Global.parseTime(hObj["beginTime"]);
				qItem.endTime = endTime;
				qItem.help_cur = _Global.INT32(hObj["help_cur"]);
				qItem.help_max = _Global.INT32(hObj["help_max"]);
				
				qItem.calcRemainingTime();
			}
		}
	}
	
	public	function	getCityQueue(cityId:int):CityQueue{
		var i:int = 0;
		var city:CityQueue;
		for( i = 0; i < cities.length; i ++ ){
			city = cities[i];
			if( city.cityId == cityId ){
				return city;
			}
		}
		
		return null;
	}
	
	public function cancelSlot(slotId:int,cityId:int):QueueItem
	{
		var city:CityQueue = getCityQueue(cityId);
		if(city)
			return city.cancel(slotId);
		return null;
	}
	public	function	cancel(cityId:int):QueueItem
	{
		var city:CityQueue = getCityQueue(cityId);
		if( city == null ){
			return null;
		}
		return city.cancel();
	}
	
	// Returns the element as a nice object that makes sense.
	//
	private	function	parseQueue(cityId:int,_queueArray:Object) : QueueElement{
		if (_queueArray == null  ) {
			return null;
		}
		//if( queueArray[_Global.ap + 7]  == null)			
			//return;
		var queueArray:HashObject = _queueArray as HashObject;
		if(queueArray == null)
			queueArray = new HashObject(_queueArray as Hashtable);
			
		var element:QueueElement = new QueueElement();
		element.cityId = cityId;
		element.itemType = _Global.INT32(queueArray[_Global.ap + 0]);
		element.level = _Global.INT32(queueArray[_Global.ap + 1]);
		element.id = _Global.INT32(queueArray[_Global.ap + 2]);
		element.startTime = _Global.parseTime(queueArray[_Global.ap + 3]);
		element.endTime = _Global.parseTime(queueArray[_Global.ap + 4]);
		element.needed = element.endTime - element.startTime;//System.Int32.Parse(queueArray[_Global.ap + 5] + "");
		element.progress = _Global.INT32(queueArray[_Global.ap + 6] );
		//
		
		element.help_cur = _Global.INT32(queueArray[_Global.ap + 7]);
		element.help_max = _Global.INT32(queueArray[_Global.ap + 8]);
		
		element.lastLevel = _Global.INT32(queueArray[_Global.ap + 10]);
		
		var arString :Datas = Datas.instance();
		
		element.itemName = arString.getArString("buildingName."+"b" + element.itemType);
		
		
		if(queueArray[_Global.ap + 9]  != null && queueArray[_Global.ap + 9].Value != null)
		{
			element.slotId = _Global.INT32(queueArray[_Global.ap + 9]);
		}
		else
		{
			element.slotId = this.getBuildingSlotIdById(cityId,element.id);
		}
//		_Global.Log(" bid:" + element.id + " slotid:" + element.slotId );
//		_Global.Log(" es:" + element.startTime + " qs:" + queueArray[_Global.ap + 3]
//			+ " ee:" + element.endTime + " qe:" + queueArray[_Global.ap + 4] );
		var ut:long = GameMain.unixtime();
		element.timeRemaining = element.endTime - ut;
		
		if(element.slotId < 0)
			element = null;
		return element;
		
	}
	private function getBuildingSlotIdById(cityId:int,bid:int):int
	{
		var c:HashObject = seed["buildings"]["city"+cityId];
		var v:Array = _Global.GetObjectValues(c);
		var i:int;
		var ap:String = _Global.ap;
		for(i = v.length - 1; i>=0; i--)
		{
			var kl:Array = _Global.GetObjectKeys(v[i]);
//			var vl:Array = _Global.GetObjectValues(v[i]);
			if(_Global.INT32((v[i] as HashObject)[ap+3]) == bid)
				return _Global.INT32((v[i] as HashObject)[ap+2]);
		}		
		return -1;		
	}
}
