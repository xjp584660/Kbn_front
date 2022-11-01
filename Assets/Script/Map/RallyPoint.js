
class RallyPoint{

	private	static	var	singleton:RallyPoint;
	private var	seed:HashObject;
	
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new RallyPoint();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public	function	init( sd:HashObject ){
		seed = sd;
		
	}
	
	
	public function checkMarchWarn(slotInfo:HashObject,troopList:Array):boolean
	{
		
		if(slotInfo == null)
			return false;
		//
		var curTime:long = GameMain.unixtime();
		if(_Global.INT64(seed["player"]["beginnerProtectionExpireUnixTime"]) >= curTime)
		{
		}
		else
			return false;
			
		var tileType:int = _Global.INT32(slotInfo["tileType"]);
		var tileUserId:int = _Global.INT32( slotInfo["tileUserId"] );
		var tileCityId:int = _Global.INT32( slotInfo["tileCityId"] );
		var gameData:HashObject = Datas.instance().getGameData();
		var targetMight:long;
		var targetLevel:int = _Global.INT32(slotInfo["tileLevel"]); 
		
		if(tileType == Constant.TileType.CITY)
		{
			if(tileUserId == 0)	//pictish
			{
				targetMight = _Global.INT64(gameData["npcpowerlevels"]["l" + targetLevel]);
			}
			else	//user
			{
				return false;
			}
		}
		else
		{
			targetMight = _Global.INT64(gameData["wildpowerlevels"]["l" + targetLevel]);
		}
		var selectTroopMight:int = 0;
		var idx:int;
		var xid:Barracks.TroopInfo;
		for(idx=0; idx < troopList.length; idx++)
		{
			xid = troopList[idx] as Barracks.TroopInfo;	
			if(xid == null)
				continue;
			selectTroopMight += xid.selectNum * GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTroopMight(Constant.TroopType.UNITS,xid.typeId);
		}
		if(selectTroopMight >= targetMight)
			return false;
			
		return true;
	}
	
	public function getMoveMentList(cityId:int):Array
	{
		var list:Array = March.instance().getMarchListByFilter(function(mvo:MarchVO):boolean
		{
			var curTime:long=GameMain.unixtime();
			return mvo.isActive && mvo.cityId == cityId && !(mvo.marchStatus==8 && mvo.endTime <= curTime);				
		});
		return list;
	}
	
	//type:1=rally
	public	function	recall (marchId :int, type:int, cityId:int, callback:Function) 
	{
		var params : Array = new Array();
		params.Add( cityId );
		params.Add( marchId );
		
		var okFunc:Function = function(result:HashObject){
			
			
			var marchtime:long;
			var	ut = GameMain.unixtime();
			var marchObj:HashObject = seed["outgoing_marches"]["c" + cityId]["m" + marchId];
			
			if (result != null) 	//
			{
                var isDeploy : boolean = (_Global.INT32(marchObj["marchType"]) == Constant.MarchType.AVA_SENDTROOP);
                
				marchObj["marchStatus"].Value = isDeploy ? Constant.MarchStatus.INACTIVE : Constant.MarchStatus.RETURNING;
//				marchtime = _Global.INT64(marchObj["returnUnixTime"]) - _Global.INT64(marchObj["destinationUnixTime"]);
//				marchObj["returnUnixTime"].Value = ut + marchtime;
//				marchObj["destinationUnixTime"].Value = ut;
//				marchObj["marchUnixTime"].Value = ut - marchtime;
				if (null != result["returnUnixTime"])
					marchObj["returnUnixTime"] = result["returnUnixTime"];
				if (null != result["destinationUnixTime"])
					marchObj["destinationUnixTime"] = result["destinationUnixTime"];
				
				//add a List..
				/*
				if(true)
				{
					_Global.Log("Recall result OK  =================================  ReturnTime:" + (ut + marchtime) + " currentTime/DestinationTime:" + ut + " MarchTime:" +marchtime );
				}
				*/
				March.instance().addSeedMarchObj2Mgr(cityId,marchObj) ;				
				UpdateSeed.instance().update_seed(result["updateSeed"]);
                
                if (isDeploy)
                {
                    GameMain.instance().seedUpdate(true);
                    GameMain.Ava.Units.RequestAvaUnits();
                }
			}
			//
			
//			if (_Global.INT32(type) === 1) {
////					seed.outgoing_marches["c" + cityId]["m" + marchId].marchStatus = 8;
//				RallyPoint.tab($("modal_rallypoint_tab_movement"), 2);
//			}
//			queue_changetab_march();

			if (callback) callback(result);

		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String){
//			_Global.Log("recall Error:"+msg);
//		};
		
		UnityNet.reqUndefend(params, okFunc, null );
	}

	public	function	viewMarch (marchId:int, okFunction:Function) {
		// XXX GoR styled, leave out of wednesday demo
		var params = new Array();
		params.Add(marchId);
		
		UnityNet.reqFetchMarch(params, okFunction, null );
	}	
	
	
}

	
