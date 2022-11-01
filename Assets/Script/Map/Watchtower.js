
class	Watchtower{
	private	static	var	singleton:Watchtower;
	private var	seed:HashObject;
	private var attackQueue:AttackComing;
	private var antiScoutingEndTime:long;
//	private var remainingAntiScoutingTime;
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new Watchtower();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	function Update()
	{
		
		attackQueue.updateItems();
		BuffAndAlert.instance().updateAlert();
	}
	
	public function get remainingAntiScoutingTime():long
	{
		var remainTime:long = Mathf.Max(0, antiScoutingEndTime - GameMain.unixtime());
		return remainTime;
	}
	
	function GetAttackList()
	{
		return attackQueue.GetData();
	}
	
	public function FindAttackItem(marchKey:String):AttackInfo
	{
		var attckList:Array = attackQueue.GetData();
		for(var i=0; i<attckList.length; i++)
		{
			if( (attckList[i] as AttackInfo).marchKey == marchKey)
				return attckList[i] as AttackInfo;
		}
		return null;
	}
	function GetAttackQuant():int
	{
		return attackQueue.attackCnt;
	}
	
	function GetAttackNumOfCurCity():int
	{
		return attackQueue.attackCnt;
	}
	
	public	function	init( sd:HashObject ){
		seed = sd;
		attackQueue = new AttackComing();
		attackQueue.SynDataWithSeed(seed);
		var currentcityid = GameMain.instance().getCurCityId();
		antiScoutingEndTime = _Global.parseTime( seed["antiscouting"]["city" + currentcityid] );
	}
	
	public function SynDataWithSeed()
	{
		attackQueue.SynDataWithSeed(seed);
	}
	
	public	function	useHide () {
		
		var currentcityid:int = GameMain.instance().getCurCityId();
	
//		var towerUseBox = $('tower_use_box'),
//			hideStatusElem = $('hide_status'),
	
		var params:Array = new Array();
		params.Add(currentcityid);

		var okFunc:Function = function(result:HashObject){
//			_Global.Log("antiscout OK");
			
			var remainingTime = 86400;
			antiScoutingEndTime = GameMain.unixtime() + remainingTime;
			seed["antiscouting"]["city" + currentcityid].Value = antiScoutingEndTime;
			
			//----------------------------------------------------------------------------//
			BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_ANTI_SCOUT, 0);
			//----------------------------------------------------------------------------//
			
			var isReal:boolean = result["isWorldGem"]?result["isWorldGem"].Value == false:true;
			Payment.instance().SubtractGems(5,isReal);		
		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:int){
//			_Global.Log("antiscout Error:"+msg);
//			
//			if ( errorCode == 4) {
////				Shop.buyNotEnough();
//				return;
//			}
////to do			Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
//		};
//		
//		UnityNet.reqUseHide(params, okFunc, errorFunc );
		UnityNet.reqUseHide(params, okFunc, null );
		
	}
	
	function cityIdToName(cityId:int):String {
		for( var i:System.Collections.DictionaryEntry  in seed["cities"].Table) 
		{
			if( _Global.INT32((i.Value as  HashObject)[_Global.ap + 0]) == cityId)
				return (i.Value as  HashObject)[_Global.ap + 1].Value;
		}
		return "";
	}
	
	public function UpdateAtkinc(marchKey:String, march:HashObject, seed:HashObject)
	{
		attackQueue.UpdateAtkinc(marchKey, march, seed);
	}
	
	public function SortAtkinc()
	{
		attackQueue.Sort(attackQueue.Compare);
	}
}

class AttackInfo extends QueueItem
{
//	public var cityId:int;
	public var cityName:String;
	public var marchScore:int;
	public var generalLevel:int;
	public var armySize:String;
//	public var arriveTime:long;
	public var troops:Array = new Array();
	public var techs:Array = new Array();
	public var allianceName:String;
	public var attackerName:String;
	public var marchKey:String;
	//
	public var toTileX:int;
	public var toTileY:int;
	public var toTileType:int;
	public var toTileName:String;
	public var marchStatus:int;
//	public var marchStatusDes:String;
	
}

class AttackComing extends BaseQueue
{
	private var attackHash :Hashtable = {};
	public var attackCnt:int;	
	public function SynDataWithSeed( seed:HashObject )
	{
		queueList.Clear();
		attackCnt = 0;
		var marches:HashObject = seed["queue_atkinc"];
	    var values:Array = _Global.GetObjectValues(marches);
	    var keys:Array = _Global.GetObjectKeys(marches);
	    var currentcityid = GameMain.instance().getCurCityId();
	    CityQueue.instance().ClearAttackInfo();
	    AttackFlash.Instance.SetEnable(false);
		var bNotify:boolean = false;
		for( var i :int = 0; i < keys.length; i ++ ){
			var marchType:int = marches[keys[i]]["marchType"]? _Global.INT32(marches[keys[i]]["marchType"]):-1;
			var cityId:int = _Global.INT32(marches[keys[i]]["toCityId"]);
			if(marches[keys[i]]["score"]!= null)
			{ 
				if(currentcityid == cityId)
					attackCnt++;
				else
					bNotify = true;	
				var city:City = CityQueue.instance().GetCity(cityId);	
				city.bAttacked = true;
				AttackFlash.Instance.SetEnable(true && !GameMain.instance().comeFromLoading);
			}	
			if (marchType == Constant.MarchType.ATTACK || marchType == Constant.MarchType.COLLECT || marchType == Constant.MarchType.COLLECT_RESOURCE) {
				var attack:AttackInfo = ParseMarch(marches[keys[i]], seed);
				attack.marchKey = keys[i];
				if(marchType == Constant.MarchType.COLLECT || marchType == Constant.MarchType.COLLECT_RESOURCE){
					attack.toTileName=Datas.getArString("Newresource.tile_name_Nolevel");
					attack.marchStatus= marches[keys[i]]["marchStatus"]? _Global.INT32(marches[keys[i]]["marchStatus"]):1;
				}
				if( cityId == currentcityid)
					addItem( attack );
				else
					bNotify = true;			
				attackHash[_Global.ap + "_" +marches[keys[i]]["toCityId"].Value  + "_" + keys[i]] = attack;
			}
		}
		Sort(Compare);
		CityQueue.instance().NotifyAttack = bNotify;
		MenuMgr.getInstance().sendNotification(Constant.Notice.ATTACKINFO, null);
	}
	
	public function get attckCntOfCurCity():int
	{
		return queueList.length;
	}

	static function Compare(first:AttackInfo, second:AttackInfo):boolean
	{
		return first.endTime > second.endTime;				
	}
	
	public function UpdateAtkinc(marchKey:String, march:HashObject, seed:HashObject)
	{	
		var attack:AttackInfo;
		var city:String = march["toCityId"].Value;
		var key:String = _Global.ap + "_" +march["toCityId"]  + "_" + marchKey;
		if(attackHash[key] )
		{
			attack = attackHash[key];
			UpdateAtkinc(attack, march, seed);
		}
		else
		{
			attack = ParseMarch(march, seed);
			addItem( attack );
			attackHash[key] = attack;
		}
	}
	
	private function UpdateAtkinc(qItem:AttackInfo, march:HashObject, seed:HashObject)
	{

		var needUpgradeStr:String = Datas.instance().getArString("WatchTower.UpgradeMsg");
		qItem.marchScore = _Global.INT32(march["score"]);

		if(march["arrivalTime"])
		{
			qItem.endTime = _Global.parseTime( march["arrivalTime"] ); 
			qItem.showTime = true;
		}	
		else 
		{	
			qItem.endTime = System.Int64.MaxValue;//double.PositiveInfinity;
			qItem.showTime = false;
		}	
		qItem.cityId = _Global.INT32( march["toCityId"] );
		qItem.cityName = Watchtower.instance().cityIdToName(qItem.cityId);
		qItem.generalLevel = march["knt"] && march["knt"]["cbt"] ? _Global.INT32( march["knt"]["cbt"] ) : -1;
		if(qItem.marchScore >= 4 &&  march["aid"] && seed["allianceNames"]["a" + march["aid"].Value])
		{
			qItem.allianceName = seed["allianceNames"]["a" + march["aid"].Value].Value;
		}
		else
		{
			qItem.allianceName = Datas.instance().getArString("Common.None");
		}
		qItem.attackerName = march["pid"] ? seed["players"]["u" + march["pid"].Value ]["n"].Value : needUpgradeStr;
		qItem.armySize = qItem.marchScore >= 5 &&march["cnt"] ?"" + march["cnt"].Value :"";
		var unitKeys:Array = _Global.GetObjectKeys(march["unts"]) ;
		qItem.troops.Clear();
		for( var i:int = 0; i< unitKeys.length; i++)
		{
			var troop:Barracks.TroopInfo = new Barracks.TroopInfo();
			troop.typeId = _Global.INT32((unitKeys[i] as String).Split("u"[0])[1] );

			troop.description  = qItem.marchScore > 6? march["unts"][unitKeys[i]].Value :"";
			troop.troopName = Datas.getArString("unitName"+"u"+ troop.typeId);

			qItem.troops.Push(troop);
		}
		
		var techKeys:Array = _Global.GetObjectKeys(march["tech"]) ;
		qItem.techs.Clear();
		for( i = 0; i<techKeys.length; i++)
		{
		//	var tech:Research.ResearchQueueElement = new Research.ResearchQueueElement();
		//	tech.id = parsetechKeys[i].Split("t"[0])[1];
			var tech:TechVO = new TechVO();
			tech.tid = _Global.INT32((techKeys[i] as String).Split("t"[0])[1]);

			tech.name = Datas.instance().getArString("techName."+"t"+ tech.tid );
			tech.level = _Global.INT32(march["tech"][techKeys[i]]);

			qItem.techs.Push(tech);
		}
	}
	
	public function OnRemoveItem(qItem : QueueItem):void
	{
		var ret:AttackInfo = qItem as AttackInfo;
		if(ret.marchStatus==1){
			//call updateseed 
			GameMain.instance().dealyCallUpdateSeed(2);
		}
	}
	
	function ParseMarch( march:HashObject, seed:HashObject ):AttackInfo
	{
		var needUpgradeStr:String = Datas.instance().getArString("WatchTower.UpgradeMsg");
		var ret:AttackInfo = new AttackInfo();
		ret.marchScore = _Global.INT32(march["score"]);
		if(march["arrivalTime"])
		{
			ret.endTime = _Global.parseTime( march["arrivalTime"] ); 
			ret.showTime = true;
		}	
		else 
		{	
			ret.endTime = System.Int64.MaxValue;//double.PositiveInfinity;
			ret.showTime = false;
		}	
		ret.cityId = _Global.INT32( march["toCityId"] );
		ret.cityName = Watchtower.instance().cityIdToName(ret.cityId);
		ret.generalLevel = march["knt"] && march["knt"]["cbt"] ? _Global.INT32( march["knt"]["cbt"] ) : -1;
//		var marchId:String = march["aid"].Value;
		var allianceNames:HashObject = seed["allianceNames"];

		if(ret.marchScore >= 4 &&  march["aid"] && allianceNames && allianceNames[_Global.ap + march["aid"].Value])
		{
			ret.allianceName = seed["allianceNames"][_Global.ap + march["aid"].Value].Value;
		}
		else
		{
			ret.allianceName = Datas.instance().getArString("Common.None");
		}
		ret.attackerName = march["pid"] ? seed["players"]["u" + march["pid"].Value ]["n"].Value : needUpgradeStr;
		ret.armySize = ret.marchScore >= 5 &&march["cnt"] ? "" + march["cnt"].Value :"";
		var unitKeys:Array = march["unts"]?_Global.GetObjectKeys(march["unts"]):[] ;
		ret.troops.Clear();
		for( var i:int = 0; i< unitKeys.length; i++)
		{
			var troop:Barracks.TroopInfo = new Barracks.TroopInfo();
			troop.typeId = _Global.INT32((unitKeys[i] as String).Split("u"[0])[1] );

			var unitCnt:String = march["unts"][unitKeys[i]].Value;
			troop.description  = ret.marchScore > 6? march["unts"][unitKeys[i]].Value :"";
			troop.troopName = Datas.instance().getArString("unitName."+"u"+ troop.typeId);

			ret.troops.Push(troop);
		}
		
		var techKeys:Array = march["tech"]?_Global.GetObjectKeys(march["tech"]):[] ;
		ret.techs.Clear();
		for( i = 0; i<techKeys.length; i++)
		{
		//	var tech:Research.ResearchQueueElement = new Research.ResearchQueueElement();
		//	tech.id = parsetechKeys[i].Split("t"[0])[1];
			var tech:TechVO = new TechVO();

			tech.tid = _Global.INT32((techKeys[i] as String).Split("t"[0])[1]);
			tech.name = Datas.instance().getArString("techName."+"t"+ tech.tid );
			tech.level = _Global.INT32(march["tech"][techKeys[i]]);

			ret.techs.Push(tech);
		}
		
		//
		ret.toTileX = _Global.INT32(march["toTileX"]);
		ret.toTileY = _Global.INT32(march["toTileY"]);
		ret.toTileType = _Global.INT32(march["toTileType"]);
		ret.toTileName = March.getTileTypeString(ret.toTileType);

		return ret;

	}
}
