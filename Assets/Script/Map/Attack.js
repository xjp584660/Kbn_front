
class	Attack{
	private	static	var	singleton:Attack;
	private var	seed:HashObject;
	private var maxMarchCount:int=0;//max can use march count
	private var curMarchCount:int=0;//current used march count
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new Attack();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public	function	init( sd:HashObject ){
		seed = sd;
	}
	
	class	TileTroopInfo{
		public	var	canRecall:boolean;
		
		public	var	marchId:String;
		public	var	fromCityId:String;
		public	var	general:String;
		public	var	alliance:String;
		public	var	from:String;
		public 	var fromCitySequence:String;
		public  var surveyEndTime:long;
		
		public var c_willBeRemoved:boolean;	//remove from list flag.
		public var c_marchInfo:Object;	//cache march Info.
		public var fromPlayerId:int;
	}
	
//	public	function	cancel (marchId:int) {
//
//		var params:Array = new Array();
//		params.Add(marchId);
//		params.Add("CANCEL_MARCH");
//
//		var okFunc:Function = function(result:Object){
//			_Global.Log("cancel march OK");
//
//		};
//		
////		var	errorFunc:Function = function(msg:String, errorCode:String){
////			_Global.Log("cancel march Error:"+msg);
////		};
////		
////		UnityNet.reqWildernessBuildCity(params, okFunc, errorFunc );
//		UnityNet.reqWildernessBuildCity(params, okFunc, null );
//	}
	
	//Disable march-related buttons if overmarch
	public	function	checkOverMarch () :boolean{
		var	currentcityid:int = GameMain.instance().getCurCityId();

		var filterFunc:Function = function(march:Object):boolean{
			var mStatus:int = (march as MarchVO).marchStatus;
			if(currentcityid != (march as MarchVO).cityId)
				return false;
//			return (mStatus == Constant.MarchStatus.OUTBOUND || mStatus == Constant.MarchStatus.DEFENDING || mStatus == Constant.MarchStatus.SITUATION_CHANGED || mStatus == Constant.MarchStatus.RETURNING || mStatus == Constant.MarchStatus.ABORTING);	
			return (mStatus != Constant.MarchStatus.DELETED 
					&& mStatus != Constant.MarchStatus.INACTIVE 
					);
		};
		var marches:Array = March.instance().getMarchListByFilter(filterFunc);
		var numOfMarches:int = marches.length;
			
		//var curLevel:int = Building.instance().getMaxLevelForType(Constant.Building.RALLY_SPOT,currentcityid);
		//var maxMarchSlotNum:int = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(Constant.Building.RALLY_SPOT,curLevel,Constant.BuildingEffectType.EFFECT_TYPE_MARCH_SLOT_COUNT);
		
		var maxMarchSlotNum:int = Building.instance().getMaxMarchCount();
		/*
		//What's the rally point's level?
		var pos:Array = _Global.GetObjectKeys( seed["buildings"]["city" + currentcityid] );
		var rallyPointLevel:int = -1;
		for( var i:int = 0; i < pos.length; i++){
			var bdg:HashObject = seed["buildings"]["city" + currentcityid][pos[i] as String];
			
			if(_Global.INT32(bdg[_Global.ap + 0]) == Constant.Building.RALLY_SPOT){ //is this a rally point?
				rallyPointLevel = _Global.INT32(bdg[_Global.ap + 1]);
			}
		}
		//Now hide the buttons and show error message
		*/
		curMarchCount=numOfMarches;
		maxMarchCount=maxMarchSlotNum;
		return numOfMarches < maxMarchSlotNum;
	}


	public	function	checkWorldBossOverMarch () :boolean{
		var	currentcityid:int = GameMain.instance().getCurCityId();

		var filterFunc:Function = function(march:Object):boolean{
			var mStatus:int = (march as MarchVO).marchStatus;
			if(currentcityid != (march as MarchVO).cityId)
				return false;

			return (mStatus != Constant.MarchStatus.DELETED 
					&& mStatus != Constant.MarchStatus.INACTIVE 
					&& (march as MarchVO).worldBossId!=0
					);
		};
		var marches:Array = March.instance().getMarchListByFilter(filterFunc);
		var numOfMarches:int = marches.length;
		var maxMarchSlotNum:int = GameMain.singleton.GetWorldBossCount();
		return numOfMarches < maxMarchSlotNum;
	}
	
	public function GetAllCitiesOutMarchCount():int{
//		var	currentcityid:int = GameMain.instance().getCurCityId();

		var filterFunc:Function = function(march:Object):boolean{
			var mStatus:int = (march as MarchVO).marchStatus;
//			if(currentcityid != (march as MarchVO).cityId)
//				return false;
			return (mStatus != Constant.MarchStatus.DELETED 
					&& mStatus != Constant.MarchStatus.INACTIVE 
					);
		};
		var marches:Array = March.instance().getMarchListByFilter(filterFunc);
		var numOfMarches:int = marches.length;
		
//		var curLevel:int = Building.instance().getMaxLevelForType(Constant.Building.RALLY_SPOT,currentcityid);
//		var maxMarchSlotNum:int = GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(Constant.Building.RALLY_SPOT,curLevel,Constant.BuildingEffectType.EFFECT_TYPE_MARCH_SLOT_COUNT);
		
		return numOfMarches;
	}
	
	public function GetVisibleMarchCount():int{
		return maxMarchCount-curMarchCount;
	}
	
	public function GetMaxMarchCount():int{
		return maxMarchCount;
	}
	
	public	function	wildernessView(tileid:String, okCallback:Function) {
	
		var params:Array = new Array();
		params.Add(tileid);

		var okFunc:Function = function(result:HashObject){
//			_Global.Log("reqWildernessView OK");
			
			var tileTroopInfo:TileTroopInfo;
			var		troopList:Array = new Array();
			if( result["defenders"] ){
				var cities:Array = _Global.GetObjectValues(result["defenders"]);
				var marches:Array;
				for( var city in cities ){
					marches = _Global.GetObjectValues( city );
					for( var march:HashObject in marches ){
						tileTroopInfo = new TileTroopInfo();
						tileTroopInfo.general = "";//g_js_strings.commonstr.noknight;
						if( march["knightName"] ){
							tileTroopInfo.general = march["knightName"].Value;
						}
						tileTroopInfo.alliance = result["playerNames"]["u" + march["fromPlayerId"].Value].Value;
						tileTroopInfo.from = march["fromXCoord"].Value + "," + march["fromYCoord"].Value;
						tileTroopInfo.marchId = march["marchId"].Value;
						tileTroopInfo.fromCityId = march["fromCityId"].Value;
						tileTroopInfo.fromCitySequence = march["cityType"].Value;
						tileTroopInfo.fromPlayerId = _Global.INT32(march["fromPlayerId"].Value);
						if(march["destinationUnixTime"] && _Global.INT32(march["marchType"]) == Constant.MarchType.SURVEY && _Global.INT32(march["marchStatus"]) == Constant.MarchStatus.OUTBOUND)
							tileTroopInfo.surveyEndTime =_Global.INT64(march["destinationUnixTime"].Value);
						
						if( (_Global.INT32(march["marchStatus"]) == Constant.MarchStatus.DEFENDING
							|| _Global.INT32(march["marchType"]) == Constant.MarchType.SURVEY)
							&& _Global.INT32(march["fromPlayerId"]) == Datas.instance().tvuid() ){
							tileTroopInfo.canRecall = true;
						}
						troopList.Add(tileTroopInfo);
					}
				}
			}

			if( okCallback ){
				okCallback(troopList);
			}

		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String){
//			_Global.Log("reqWildernessView Error:"+msg);
//		};
//		
//		UnityNet.reqWildernessView(params, okFunc, errorFunc );
		UnityNet.reqWildernessView(params, okFunc, null );
		
	}
	
	public	function	wildernessAbandon (tileid:int, xcoor:int, ycoor:int, seccessFunc:Function) {
		
		var currentcityid = GameMain.instance().getCurCityId();
		var params:Array = new Array();
		params.Add(tileid);
		params.Add(xcoor);
		params.Add(ycoor);
		params.Add(currentcityid);

		var okFunc:Function = function(rslt:HashObject){
//			_Global.Log("wildernessAbandon OK");
			
			//Check troops and recall
//			Modal.hideModal();
			if(rslt["returningMarches"] )
			{
				var cities:Array = _Global.GetObjectKeys(rslt["returningMarches"]);
				for(var i:int=0;i<cities.length;i++)
				{
					var mids:Array = _Global.GetObjectKeys(rslt["returningMarches"][cities[i]]);
					for(var j:int =0; j < mids.length; j++)
					{
						var cid:String = (cities[i] as String).Split("c"[0])[1];
						var mid:String = rslt["returningMarches"][cities[i]][_Global.ap + j].Value;
						
						var march:HashObject = seed["outgoing_marches"]["c"+cid]["m"+mid];
						if(march)
						{
							//var marchtime:long = Mathf.Abs(_Global.INT64(march["destinationUnixTime"]) - _Global.INT64(march["eventUnixTime"]));
							var marchtime:long = Mathf.Abs(_Global.INT64(march["returnUnixTime"]) - _Global.INT64(march["destinationUnixTime"]));
							var ut:long = GameMain.unixtime();
  							
 							seed["outgoing_marches"]["c"+cid]["m"+mid]["destinationUnixTime"].Value=ut;
							seed["outgoing_marches"]["c"+cid]["m"+mid]["marchUnixTime"].Value=ut-marchtime;
							seed["outgoing_marches"]["c"+cid]["m"+mid]["returnUnixTime"].Value=ut+marchtime;
							seed["outgoing_marches"]["c"+cid]["m"+mid]["marchStatus"].Value = Constant.MarchStatus.RETURNING; 							
						}
						//delete
						March.instance().syncSeedMarch(_Global.INT32(cid), _Global.INT32(mid) );

					}
									
//					for(var j:int=0;j<rslt["returningMarches"][cities[i]].length;j++)
//					{
//						var cid=cities[i].Split("c"[0])[1];
//						var mid=rslt.returningMarches[cities[i]][j];
//						//set time of return
//						var march=seed["outgoing_marches"]["c"+cid]["m"+mid];
//						if(march)
//						{
//							var marchtime=Mathf.Abs(_Global.INT32(march["destinationUnixTime"])-_Global.INT32(march["eventUnixTime"]));
//							var ut=GameMain.unixtime();
//							seed["outgoing_marches"]["c"+cid]["m"+mid]["destinationUnixTime"]=ut;
//							seed["outgoing_marches"]["c"+cid]["m"+mid]["marchUnixTime"]=ut-marchtime;
//							seed["outgoing_marches"]["c"+cid]["m"+mid]["returnUnixTime"]=ut+marchtime;
//							seed["outgoing_marches"]["c"+cid]["m"+mid]["marchStatus"] = Constant.MarchStatus.RETURNING;
//						}
//						//delete
//					}
				}
				GameMain.instance().invokeUpdateSeedInTime(1);
			}
			
			if(rslt["updateSeed"])
			{
				UpdateSeed.instance().update_seed(rslt["updateSeed"]);
			}
			
			if (_Global.GetObjectKeys(seed["wilderness"]["city"+currentcityid]).length == 1) 
			{
				seed["wilderness"]["city"+currentcityid]=new HashObject();
			} 
			else 
			{ 
				//delete seed["wilderness"]["city"+currentcityid]["t"+tileid];
				var _wilders:Array = _Global.GetObjectKeys(seed["wilderness"]["city"+currentcityid]);
				var obj:HashObject = new HashObject();
				for(var a:int = 0; a < _wilders.length; a++)
				{
					if(_Global.INT32((_wilders[a] as String).Split("t"[0])[1]) == tileid)
					{
						continue;
					}
					else
					{
						obj[(_wilders[a] as String)] = new HashObject();
						obj[(_wilders[a] as String)].Value = seed["wilderness"]["city"+currentcityid][(_wilders[a] as String)].Value;
					}
				}
				
				seed["wilderness"]["city"+currentcityid] = obj;
			}
			
			seccessFunc(rslt);
			
//			g_mapObject.getMoreSlots();

		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String){
//			_Global.Log("wildernessAbandon Error:"+msg);
//		};
//		
//		UnityNet.reqWildernessAbandon(params, okFunc, errorFunc );
		UnityNet.reqWildernessAbandon(params, okFunc, null );
	}

	
	public	function	wildernessBuildCityCheck (xcoord, ycoord) {
		
		var cities:Array=_Global.GetObjectKeys(seed["outgoing_marches"]);
		var validspot:boolean=false;
		var totrec:int[]=[0,0,0,0,0];
		var tottrp:int=0;
		for(var i=0;i<cities.length;i++){
			var marches:Array = _Global.GetObjectKeys(seed["outgoing_marches"][cities[i]]);
			for(var j=0;j<marches.length;j++){
				var idvmarch:HashObject = seed["outgoing_marches"][cities[i]][marches[j]];
				if(_Global.INT32(idvmarch["toXCoord"])==_Global.INT32(xcoord) 
					&& _Global.INT32(idvmarch["toYCoord"])==_Global.INT32(ycoord) 
					&& _Global.INT32(idvmarch["marchStatus"]) == Constant.MarchStatus.DEFENDING){
					tottrp+=_Global.INT32(idvmarch["unit1Count"]);
					totrec[0]+=_Global.INT32(idvmarch["gold"]);
					for(var k=1;k<5;k++){
						totrec[k]+=_Global.INT32(idvmarch["resource"+k]);
					}
				}
			}
		}
		if(tottrp>=250 && totrec[0]>=10000 && totrec[1]>=10000 && totrec[2]>=10000 && totrec[3]>=10000 && totrec[4]>=10000){
			return true;
		}
		return false;
	}
	
//	public	function	wildernessBuildCityConfirm (tileid:int, cityid:int) {
//		
//		var params:Array = new Array();
//		params.Add(tileid);
//		params.Add(cityid);
////		params.Add($("modal_wilderness_newcity_ipt").value);
//
//		var okFunc:Function = function(result:Object){
//			_Global.Log("wildernessBuildCityConfirm OK");
//			
////			top.location=appUrl;
//
//		};
//		
////		var	errorFunc:Function = function(msg:String, errorCode:String){
////			_Global.Log("wildernessBuildCityConfirm Error:"+msg);
////		};
////		
////		UnityNet.reqWildernessBuildCity(params, okFunc, errorFunc );
//		UnityNet.reqWildernessBuildCity(params, okFunc, null );
//	}

	public	function	getIncomingAttackCount () {
		var count:int = 0;
		var	marches:HashObject = seed["queue_atkinc"];

		var keys:Array = _Global.GetObjectKeys(marches);
		for( var i :int = 0; i < keys.length; i ++ ){
			var marchType:int = _Global.INT32(marches[keys[i]]["marchType"]);
//			if (marchType == Constant.MarchType.ATTACK || isNaN(marchType)) {
			if (marchType == Constant.MarchType.ATTACK ) {
				count = count + 1;
			}
		}

		return count;
	}
}
