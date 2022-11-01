class ResourceInfo
{
	public var ID:int;
	public var count:long;
	public var baseProduct:long;
	public var upkeep:long;
	public var boostTime:long;
	public var cap:long;
}

class CityResource
{
	public var resources:ResourceInfo[];
	public var population:int;
	public var populationIdl:int;
	public var populationLabor:int;
	public var populationCap:int;
	public var populationHappiness:int;
	public var taxRate:float;
	
}

class	Resource extends KBN.Resource {
	private var	seed:HashObject;
	
	private var goldBase:long;
	private var foodBase:long;
	private var lumberBase:long;
	private var ironBase:long;
	private var stoneBase:long;
	private var carmotBase:long;
	
	private var foodPro:float;
	private var lumberPro:float;
	private var ironPro:float;
	private var stonePro:float;
	private var tax:float;
	
	private var goldCnt:long;
	private var foodCnt:long;
	private var lumberCnt:long;
	private var ironCnt:long;
	private var carmotCnt:long;
	private var stoneCnt:long;
	
	
	private var recUpdateTime:long;
	
	private var cityResourceHash:Hashtable = new Hashtable();
	
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new Resource();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton as Resource;
	}
	
	public	function	init( sd:HashObject ){
		seed = sd;
		UpdateRecInfo();
//		Update();	//set goldCnt,foodCnt...
	}
	
	public	function	InitAfterChangeCity(){
		UpdateRecInfo();
	}
	
	/**
	*
	* BEGIN HERE: All utility type methods
	*
	*/
	
	// Takes an amount and ADDs it to the current seed.
	//
	// RESOURCE AMOUNTS must be added as "human readable" anounts, like 100 gold, not 36000 seconds.
	//
	public	function	addToSeed(resourceId:int, amount:long, cityId:int) {
	
		switch (resourceId) {
			case Constant.ResourceType.GOLD:

				seed["citystats"]["city" + cityId]["gold"][_Global.ap + 0].Value = getCountForType(resourceId,cityId) + amount;
//				update_gold(); // update chrome
				break;
			case Constant.ResourceType.POPULATION:

				seed["citystats"]["city" + cityId]["pop"][_Global.ap + 0].Value = populationCount(cityId) + amount;

//				update_pop(); // update chrome
				break;
			case Constant.ResourceType.POPULATIONCAP:
				seed["citystats"]["city" + cityId]["pop"][_Global.ap + 1].Value = populationCap(cityId) + amount;
				break;
			case Constant.ResourceType.LABORFORCE:
				seed["citystats"]["city" + cityId]["pop"][_Global.ap + 3].Value = populationLabor(cityId) + amount;
				break;
			default:
				seed["resources"]["city" + cityId]["rec" + resourceId][_Global.ap + 0].Value = (getCountForType(resourceId,cityId) + amount) * 3600;
//				updateResourcesBar(); // update chrome
		}
		return this.getCountForType(resourceId, cityId);
		
	}

	// Returns the current resource count for the type passed in as an integer
	//
	// Resources are passed back via the WHOLE integer amount, not unixtime
	//
	public	function	getCountForTypeInSeed(resourceId:int, cityId:int) :double 
	{		
		var count:double = 0;
		var temp;
		switch (resourceId) {
//		case Constant.ResourceType.GOLD: // gold
//
//			count =_Global.DOULBE64(seed["citystats"]["city" + cityId]["gold"][_Global.ap+0]);
//
//			break;
		case Constant.ResourceType.POPULATION:
			count = populationCount(cityId);
			break;
		case Constant.ResourceType.POPULATIONCAP:
			count = populationCap(cityId);
			break;
		case Constant.ResourceType.LABORFORCE:
			count = populationLabor(cityId);
			break;
		default:

//			temp = seed["resources"]["city" + cityId]["rec" + resourceId];
//			count =_Global.DOULBE64(seed["resources"]["city" + cityId]["rec" + resourceId][_Global.ap+0] )/3600;
			count = (cityResourceHash["city" + cityId] as CityResource).resources[resourceId].count;

		}
		
		return count;		
	}
	
	public	function	getCountForType(resourceId:int, cityId:int) :double 
	{	
		var curCityId = GameMain.instance().getCurCityId();
		if(cityId != curCityId)	
			return getCountForTypeInSeed(resourceId, cityId);
		var count:double = 0;
		var temp;
		switch (resourceId) {
		case Constant.ResourceType.GOLD: // gold
			count = goldCnt;
			break;
		case Constant.ResourceType.POPULATION:
			count = populationCount(cityId);
			break;
		case Constant.ResourceType.POPULATIONCAP:
			count = populationCap(cityId);
			break;
		case Constant.ResourceType.LABORFORCE:
			count = populationLabor(cityId);
			break;
		case Constant.ResourceType.GOLD:
			count = goldCnt;
			break;
		case Constant.ResourceType.FOOD:
			count = foodCnt;
			break;
		case Constant.ResourceType.LUMBER:
			count = lumberCnt;
			break;			
		case Constant.ResourceType.STONE:
			count = stoneCnt;
			break;
		case Constant.ResourceType.IRON:
			count = ironCnt;
			break;
		case Constant.ResourceType.CARMOT:
		var curLevel=GetCastleLevel();
		if(curLevel>=Constant.CarmotLimitLevel){
			count = carmotCnt;
		}else
			count = 0;
			break;
		}
		
		return count;		
	}
	
	function UpdateRecInfo()
	{	
	
	//	seed["resources"]["city" + cityId]["rec" + resourceId][_Global.ap+0]
		var cityKeys:Array = _Global.GetObjectKeys(seed["resources"]);
		for(var i=0; i<cityKeys.length; i++)
		{
			if(cityResourceHash[cityKeys[i]] == null)
			{
				var newCityRec:CityResource = new CityResource();
				newCityRec.resources = [new ResourceInfo(), new ResourceInfo(), new ResourceInfo(),new ResourceInfo(),new ResourceInfo(),new ResourceInfo(),new ResourceInfo(),new ResourceInfo()];
				cityResourceHash[cityKeys[i]] = newCityRec;				
			}
			var cityRec:CityResource = cityResourceHash[cityKeys[i]] as CityResource;
			cityRec.population = _Global.INT32(seed["citystats"][cityKeys[i]]["pop"][_Global.ap + "0"]);
			cityRec.populationCap = _Global.INT32(seed["citystats"][cityKeys[i]]["pop"][_Global.ap + "1"]);
			cityRec.populationHappiness = _Global.INT32(seed["citystats"][cityKeys[i]]["pop"][_Global.ap + "2"]);
			cityRec.populationLabor = _Global.INT32(seed["citystats"][cityKeys[i]]["pop"][_Global.ap + "3"]);
			cityRec.populationIdl = cityRec.population - cityRec.populationLabor;

									
			cityRec.taxRate = _Global.INT32(seed["citystats"][cityKeys[i]]["gold"][_Global.ap + "1"]); 
			tax = 1.0*cityRec.taxRate/100;
			tax = cityRec.population*tax;			
			cityRec.resources[Constant.ResourceType.GOLD].boostTime = _Global.INT64(seed["bonus"]["bC1000"]["bT1001"]);
			if(cityRec.resources[Constant.ResourceType.GOLD].boostTime > GameMain.unixtime() )
			{
				tax *= 2;
			}
			cityRec.resources[Constant.ResourceType.GOLD].baseProduct = tax;
			
			
			cityRec.resources[Constant.ResourceType.GOLD].ID = Constant.ResourceType.GOLD;
			cityRec.resources[Constant.ResourceType.GOLD].count =  _Global.INT64(seed["citystats"][cityKeys[i]]["gold"][_Global.ap+0]);			
			cityRec.resources[Constant.ResourceType.GOLD].upkeep = 0;
			
			for(var j=Constant.ResourceType.FOOD; j<= Constant.ResourceType.CARMOT; j++)
			{
				if(j==5 || j==6) continue;//unuser resource 5,6
				cityRec.resources[j].ID = j;
				cityRec.resources[j].count =  _Global.INT64(seed["resources"][cityKeys[i]]["rec" + j][_Global.ap+0] )/3600;
				cityRec.resources[j].boostTime = _Global.INT64(seed["bonus"]["bC1"+j+"00"]["bT1"+j+"01"]);
				cityRec.resources[j].baseProduct = _Global.INT64( seed["resources"][cityKeys[i]]["rec"+j][_Global.ap + 2] );
				cityRec.resources[j].cap = _Global.INT64(seed["resources"][cityKeys[i]]["rec" + j][_Global.ap + 1]) / 3600;
				if(j == Constant.ResourceType.FOOD)		
					cityRec.resources[j].upkeep = _Global.INT64(seed["resources"][cityKeys[i]]["rec" + Constant.ResourceType.FOOD][_Global.ap+3 ] );;
				else	
					cityRec.resources[j].upkeep = 0;
			}
			
			
		}
		
		recUpdateTime = GameMain.unixtime();
		var curCityId:int = GameMain.instance().getCurCityId();
		goldBase= getCountForTypeInSeed(Constant.ResourceType.GOLD, curCityId);
		foodBase = getCountForTypeInSeed(Constant.ResourceType.FOOD, curCityId);
		stoneBase = getCountForTypeInSeed(Constant.ResourceType.STONE, curCityId);
		ironBase = getCountForTypeInSeed(Constant.ResourceType.IRON, curCityId);
		carmotBase = getCountForTypeInSeed(Constant.ResourceType.CARMOT, curCityId);
		lumberBase = getCountForTypeInSeed(Constant.ResourceType.LUMBER, curCityId) ;
		
	
		tax =  1.0*taxRate(curCityId)/100;
		tax = populationCount(curCityId)*tax/3600;
		if(_Global.INT32(seed["bonus"]["bC1000"]["bT1001"])>GameMain.unixtime() )
		{
			tax *= 2;
		}

		foodPro = 1.0*getFinalResourceProductivity(curCityId, Constant.ResourceType.FOOD)/3600;
		stonePro = 1.0*getFinalResourceProductivity(curCityId,Constant.ResourceType.STONE)/3600;
		ironPro = 1.0*getFinalResourceProductivity(curCityId,Constant.ResourceType.IRON)/3600;
		lumberPro = 1.0*getFinalResourceProductivity(curCityId,Constant.ResourceType.LUMBER)/3600 ;
	
		Update();
	}
	
	public function Update()
	{
		var second:long= GameMain.unixtime();		
		var passedTime:long = second - recUpdateTime;
		goldCnt =  goldBase;// + passedTime*tax;
		foodCnt =  foodBase; //Mathf.Max(0, foodBase	+ passedTime*foodPro);
		stoneCnt = stoneBase	+ passedTime*stonePro;
		ironCnt = ironBase	+ passedTime*ironPro;
		carmotCnt=carmotBase;
		lumberCnt = lumberBase+ passedTime*lumberPro;
	}
	
	public function GetBaseProduction(resourceId:int, cityId:int):int
	{
		return _Global.INT32(seed["resources"]["city" + cityId]["rec" + resourceId][_Global.ap+2 ] );
	}
	
	public function GetProtCnt(cityId:int):long
	{
		var buildingTypeId:int = Constant.Building.STOREHOUSE;
		var curLevel:int = Building.instance().getMaxLevelForType(Constant.Building.STOREHOUSE, cityId);
		var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
		
		var buffValue:BuffValue = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Storage, new BuffSubtarget( BuffSubtargetType.BuildingType, Constant.Building.STOREHOUSE ));
		var techBuff : float = Technology.instance().getIncreaseStorehouseProtection();

		var vipLevel : int = GameMain.instance().GetVipOrBuffLevel();
		var vipDataItem : KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(vipLevel);
		
		return GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(buildingTypeId,curLevel,Constant.BuildingEffectType.EFFECT_TYPE_PROTECT_RESOURCE) * (1 + 0.1* _Global.INT32(seed["tech"]["tch14"]) + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Protection)
		       + buffValue.Percentage + techBuff + (vipDataItem.STORE_HOUSE_CAP * 0.01f)) + buffValue.Number;
	}
	
	public function GetCarmotProtCnt(cityId:int):long
	{
		var castleLevel=GetCastleLevel();
		if(castleLevel>=Constant.CarmotLimitLevel){
			var buildingTypeId:int = Constant.Building.STOREHOUSE;
			var curLevel:int = Building.instance().getMaxLevelForType(Constant.Building.STOREHOUSE, cityId);
			var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
			
			var buffValue:BuffValue = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Storage, new BuffSubtarget( BuffSubtargetType.BuildingType, Constant.Building.STOREHOUSE ));
			var techBuff : float = Technology.instance().getIncreaseStorehouseProtection();
			return GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(buildingTypeId,curLevel,Constant.BuildingEffectType.EFFECT_TYPE_CARMOTLIMIT_CAP)  * (1 + 0.1* _Global.INT32(seed["tech"]["tch14"]) + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Protection)
		       + buffValue.Percentage + techBuff) + buffValue.Number;;
		}else return -1;
		
	}
	
	public function GetFoodUpkeep(cityId:int):long
	{
		var upKeepBuff : boolean = _Global.INT64(seed["bonus"]["bC3400"]["bT340" + GameMain.instance().getCityOrderWithCityId(cityId)]) > GameMain.unixtime();
		return upKeepBuff ? 0 : (cityResourceHash["city" + cityId] as CityResource).resources[Constant.ResourceType.FOOD].upkeep;// parseFloat(seed["resources"]["city" + cityId]["rec" + Constant.ResourceType.FOOD][_Global.ap+3 ] );
	}
	
	public function GetGoldUpkeep(cityId:int):long
	{
		return General.instance().getLeadersalarySum(cityId);
	}
	
	public function GetLimitForType(resourceId:int, cityId:int):long
	{
		return (cityResourceHash["city" + cityId] as CityResource).resources[resourceId].cap;//parseFloat(seed["resources"]["city" + cityId]["rec" + resourceId][_Global.ap+1])/ 3600;
	}
	
	// Returns the tax rate for the current city as an integer
	//
	public	function	taxRate (cityId:int):float {
		return _Global.INT32(seed["citystats"]['city' + cityId]["gold"][_Global.ap + 1]);
	}
	
	public function TaxRevenueBase(cityId:int):long
	{
		var tax:double =  1.0*taxRate(cityId)/100;
		tax = populationCount(cityId)*tax;
		return tax;
	}
	
	public function TaxRevenue(cityId:int):long
	{
		var tax:double =  1.0*taxRate(cityId)/100;
		tax = populationCount(cityId)*tax;
		if(_Global.INT32(seed["bonus"]["bC1000"]["bT1001"])>GameMain.unixtime() )
		{
			tax *= 2;
		}
		tax = tax*(1+ getVipBonus(Constant.ResourceType.GOLD)/100 + Technology.instance().getGoldProductionIncrease());
		return tax;
	}
	
	public function TaxItemBouns():int
	{
		if(_Global.INT32(seed["bonus"]["bC1000"]["bT1001"])>GameMain.unixtime() )
		{
			return 1;
		}
		else
		{
			return 0;
		}
	}
//	Utility: {
	
		public	function	calcObservedVsNow(cityId:int, resourceType:int) {

//			var observed = _Global.INT32(seed.gather['c'+cityId].observed);
//			var timeGoneByInMinutes = ( unixtime() - observed ) / 60;
//			var rateByMinutes = Resource.Utility.getResourceHourlyTotalRate(cityId, resourceType) / 60;
//			
//			return Math.max(Math.floor(timeGoneByInMinutes * rateByMinutes), 0);
		}
	
		public	function	isCityReadyToGather(cityId:int) {
//			/**
//			var lastTimeGathered = _Global.INT32(seed.gather['c'+cityId].collected);
//			var timeSinceCollected = unixtime() - lastTimeGathered;
//			
//			if(timeSinceCollected >= Resource.GATHER_TIME_IN_SEC) {
//				return true;
//			} else {
//				return false;
//			}
//			*/
//			
//			var observed = _Global.INT32(seed.gather['c'+cityId].observed);
//			var lastTimeGathered = _Global.INT32(seed.gather['c'+cityId].collected);
//			
//			var limit = lastTimeGathered + Resource.GATHER_TIME_IN_SEC;
//			var timeLeft = limit - unixtime();
//			
//			if(unixtime() >= limit) {
//				return true;
//			} else {
//				return false;
//			}
		}
		
		//--------------------------------------------------------------------------//
		public function getResourceHourlyProduction(iResourceType:int, cityId:int) 
		{
			var total = 0;
			var city:HashObject;
			
			for(var _city:System.Collections.DictionaryEntry in seed["cities"].Table)
			{
				city = _city.Value; 
				if(_Global.INT32(city[_Global.ap + 0]) == cityId)
				{
					total = _Global.INT32(seed["resources"]["city" + city[_Global.ap + 0].Value]["rec" + iResourceType][_Global.ap + 2]) * getTotalBonus(iResourceType, false, city[_Global.ap + 0].Value);
					break;
				}				
			}
			
			return total;
		}		
		//--------------------------------------------------------------------------//				
								
		public	function	getResourceHourlyBaseRate(cityId:int, resourceType:int) {
//			var numOfLevels = Building.getLevelsSumForType(resourceType),
//				scaleFactor = resourcegatherscalefactors[ numOfLevels ],
//				rate = scaleFactor;
//			
//			return Math.floor(rate);
		}
		
		public	function	getTotalLevelResource() {
			
//			var foodLevel =_Global.INT32(Building.getLevelsSumForType(Constant.ResourceType.FOOD),10);
//			var stoneLevel = _Global.INT32(Building.getLevelsSumForType(Constant.ResourceType.STONE),10);
//			var lumberLevel = _Global.INT32(Building.getLevelsSumForType(Constant.ResourceType.LUMBER),10);
//			var ironLevel = _Global.INT32(Building.getLevelsSumForType(Constant.ResourceType.IRON),10);
//			return foodLevel +stoneLevel +lumberLevel +ironLevel;  
		}
		
		public	function	getFinalResourceProductivity(cityId, resourceType):long {
			if(resourceType == 0)
			{
				return TaxRevenue(cityId);
			}
			else
			{
				var oResourceInfo:HashObject = seed["resources"]["city"+cityId]["rec"+resourceType];
				var iPopulationFactor:float = Mathf.Min( populationCount(cityId) / populationLabor(cityId), 1 );
				var bonus:float = getTotalBonus(resourceType, true, cityId)*iPopulationFactor;
				var resData:long = _Global.INT64( oResourceInfo[_Global.ap + 2] )*bonus;// - _Global.INT64( oResourceInfo[_Global.ap +3] );
				resData = resData -_Global.INT64( oResourceInfo[_Global.ap +3] );

				return resData;
			}
		}
		
		public function  GetBaseProductivity(cityId, resourceType):long{
		}
		
		public	function	getResourcesGathered(cityId, resourceType) {
//			if(Resource.Utility.isCityReadyToGather(cityId)) { // if ready to gather just get rate * time limit...
//				return Resource.Utility.getResourceHourlyTotalRate(cityId, resourceType) * Resource.GATHER_TIME_LIMIT;
//			} else { // else get observed gathered amount and add the rests in by figuring out rate * time since observation...
//				
//					// resources at time of observation
//				var resourceAtObservation = _Global.INT32(seed.gather['c'+cityId]['r'+resourceType+'x3600']) / 3600,
//					// resources from observation till now
//					additionalResources = Resource.Utility.calcObservedVsNow(cityId, resourceType);
//				
//				return resourceAtObservation + additionalResources;
//			}
		}
		
		public	function	getTimeToGatheringLimit(cityId) {

//			var observed = _Global.INT32(seed.gather['c'+cityId].observed);
//			var lastTimeGathered = _Global.INT32(seed.gather['c'+cityId].collected);
//			/**
//			var timeSinceCollected = unixtime() - lastTimeGathered;
//			var timeLeft = null;
//			
//			if(timeSinceCollected >= Resource.GATHER_TIME_IN_SEC) {
//				timeLeft = Resource.GATHER_TIME_IN_SEC - (observed - lastTimeGathered);
//			} else {
//				timeLeft = unixtime() - observed;
//			}
//			*/
//			
//			var limit = lastTimeGathered + Resource.GATHER_TIME_IN_SEC;
//			var timeLeft = limit - unixtime();
//			
//			if(unixtime() >= limit) {
//				return 0;
//			} else {
//				return (timeLeft < 0) ? 0 : timeLeft;
//			}
			
		}
		
		public	function	isLaborForceOnStrike(cityId) {
		}
		
//	}
	
	/**
	*
	* END HERE: All utility type methods
	*
	*/
	
	/** 
	*
	* BEGIN HERE: All bonus related methods ============================================================================ >
	*
	*/
	
	
	public	function	getItemBonus (resourceId):float {
		var percent:float = 0;
		if(_Global.INT32(seed["bonus"]["bC1"+resourceId+"00"]["bT1"+resourceId+"01"]) > GameMain.unixtime()){
			percent = 25;
		}
		return percent;
	}
	// used for palace
	public	function	getResearchBonus(resourceId):float {
		var technologyId:int = Research.instance().getTechIdByResource( resourceId );
		return parseFloat( parseFloat((Research.instance().bonusForType(technologyId) + Technology.instance().BonusForType(resourceId)) * 100 ));
	}
	
	public	function	getTotalBonus(resourceType, bonus, cid):float {
		var per:float = 100.0f;
		if (bonus) {	//WILL TAKE OTHER BONUSES (coliseum) INTO ACCOUNT SOON
			return 1 + getHeroBonus(resourceType) + getVipBonus(resourceType)/per + getItemBonus(resourceType)/per + Research.instance().bonusForType(resourceType) + Technology.instance().BonusForType(resourceType) + getWildernessBonus(cid, resourceType)/per + getPraefectBonus(cid)/per; 
		} else {
			return 1;
		}
	}
	
	public function getHeroBonus(resourceType : int) : float
	{
		var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
		switch (resourceType)
		{
			case Constant.ResourceType.FOOD:
				return HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Food);
			case Constant.ResourceType.LUMBER:
				return HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Wood);
			case Constant.ResourceType.STONE:
				return HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Stone);
			case Constant.ResourceType.IRON:
				return HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Ore);
		}
		
		return 0.0f;
	}
	
	public function getVipBonus(resourceType:int):float
	{
		var bonus:float = 0.0f;
		if(!GameMain.instance().IsVipOpened()) return bonus;
		var vipLevel:int = GameMain.singleton.GetVipOrBuffLevel();
		var vipDataItem: KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(vipLevel);
		if(vipDataItem == null) return bonus;
		switch(resourceType)
		{
			case Constant.ResourceType.GOLD:
				bonus =  vipDataItem.GOLD;
			break;
			case Constant.ResourceType.FOOD:
				bonus =  vipDataItem.FOOD;
			break;
			case Constant.ResourceType.LUMBER://wood
				bonus = vipDataItem.WOOD;
			break;
			case Constant.ResourceType.STONE:
				bonus = vipDataItem.STONE;
			break;
			case Constant.ResourceType.IRON:
				bonus = vipDataItem.ORE;
			break;
		}
		return bonus;
	}
	
	public	function	getPraefectBonus(cid):float {
		var bonus:float = 0;
		var id = _Global.INT32(seed["leaders"]["city" + cid]["resourcefulnessKnightId"]);
		if (id > 0) {
			bonus = (seed["knights"]["city" + cid]["knt" + id]) ? _Global.INT32( seed["knights"]["city" + cid]["knt" + id]["knightLevel"] ) : 0;
		}
		return bonus;
	}

	public	function	getWildernessBonus (cid, resourceType):float {
		var tiles:Array = _Global.GetObjectKeys(seed["wilderness"]["city" + cid]);
		var wilderness = [0,0,0,0,0,0,0,0,0];
		var rectype;
		for(var i = 0; i < tiles.length; i++){
			rectype = -1;
			switch (_Global.INT32(seed["wilderness"]["city" + cid][tiles[i]]["tileType"])) {
				case Constant.TileType.GRASSLAND:
				case Constant.TileType.LAKE:
//				case Constant.TileType.RIVER:
					rectype = Constant.ResourceType.FOOD;
					break;
				case Constant.TileType.WOODS:
					rectype = Constant.ResourceType.LUMBER;
					break;
				case Constant.TileType.HILLS:
					rectype = Constant.ResourceType.STONE;
					break;
				case Constant.TileType.MOUNTAIN:
					rectype = Constant.ResourceType.IRON;
					break;
			}
			if ( rectype != -1 ) {
				wilderness[rectype] += _Global.INT32( seed["wilderness"]["city" + cid][tiles[i]]["tileLevel"] );
			}
		}

		return _Global.INT32(wilderness[resourceType] * 5);
	}

	public	function	getDeityBonus() {
//		var percent = 0;
//		if(seed.temple.templeType == "2") {
//			percent = Temple.getBonusPercent();
//		}
//		return percent;
	}
	
	/** 
	*
	* END HERE: All bonus related methods ============================================================================ >
	*
	*/
	
	/**
	*
	* BEGIN HERE: Population =========================================================================================== >
	*
	*/
	
	// Returns the total population for the current city as an integer
	//
	public	function	populationCount(cityid:int) :float{
		return (cityResourceHash["city" + cityid] as CityResource).population;
	//	return _Global.INT32(seed["citystats"]['city' + cityid]["pop"][_Global.ap + 0]);
	}

	// Returns the max population cap for the current city as an integer
	//
	public	function	populationCap(cityid:int) :float {
		return (cityResourceHash["city" + cityid] as CityResource).populationCap;
	//	return _Global.INT32(seed["citystats"]['city' + cityid]["pop"][_Global.ap + 1]);
	}

	// Returns the percentage of happiness for a city as an integer
	//
	public	function	populationHappiness(cityid:int) :float {
		return (cityResourceHash["city" + cityid] as CityResource).populationHappiness;
	//	return _Global.INT32(seed["citystats"]['city' + cityid]["pop"][_Global.ap + 2]);
	}

	// Returns the total labor force for the current city as an integer
	//
	public	function	populationLabor (cityid:int) :float {
		return (cityResourceHash["city" + cityid] as CityResource).populationLabor;
	//	return _Global.INT32(seed["citystats"]['city' + cityid]["pop"][_Global.ap + 3]);
	}

	// Returns the total idle population as an integer
	//
	public	function	populationIdle(cityid:int):float {
		return (cityResourceHash["city" + cityid] as CityResource).populationIdl;
	//	return populationCount(cityid) - populationLabor(cityid);
	}
	/**
	*
	* END HERE: Population =========================================================================================== >
	*
	*/
	
	/**
	*
	* BEGIN HERE: Daily Reward =========================================================================================== >
	*
	*/
	
//	DailyReward: {
//		shareCheckBoxDailyReward:true,
//		open: function () {
//			var params = {};
//			params.cid = currentcityid;
//			AjaxCall.gPostRequest('getUserDailyRewardInfo.php', params,
//				function(result){
//					if (result.ok) {
//						if (result.consecutiveLoginCount === null) {
//							result.consecutiveLoginCount = 0;
//						}
//						var romanLevel = ["", "I", "II", "III", "IV", "V+"];
//						var dayHtml = new Array();
//						for (var d = 1; d <= 5; d++) {
//							dayHtml.push( 
//								Resource.renderTemplate("daily_each", {
//									"romanLevel": romanLevel[d],
//									"level": (d <= result.consecutiveLoginCount) ? ("x" + d) : "",
//									"status": (d <= result.consecutiveLoginCount) ? "active" : "inactive",
//									"days": (d === 1) ? "Day" : "Days"
//								})
//							);
//						}
//
//						var html = Resource.renderTemplate("daily_reward", {
//							"deity": seed.temple.templeType,
//							"userLevel": result.userLevel,
//							"returningBonus": result.consecutiveLoginCount,
//							"dailyRewardAmount": addCommas(result.baseRewardAmount),
//							"totalRewardAmount": addCommas(result.dailyRewardAmount),
//							"daily_each": dayHtml.join(""),
//							"shareCheckBoxDailyReward" : Resource.DailyReward.shareCheckBoxDailyReward
//						});
//						
//						Modal.showModal(600,580,90,95, "Welcome Back, Enjoy This Daily Gift!", html, null, null, Constant.Modal.WHITE600);
//						$("shareCheckBoxDailyReward").checked = Resource.DailyReward.shareCheckBoxDailyReward;
//					} else {
//						alert(arStrings.SD.Resource_hcString414+" " + result.msg);
//					}
//				},
//				function(){
//					alert(arStrings.SD.Resource_requestFailed);
//				}
//			);			
//		},

		public	function	claim () {
//			Resource.DailyReward.shareCheckBoxDailyReward = $("shareCheckBoxDailyReward").checked;
//			var params = {};
//			params.cid = currentcityid;
//			AjaxCall.gPostRequest('claimDailyReward.php', params, 
//				function(result){
//					if (result.ok) {
//						if ($("shareCheckBoxDailyReward") && $("shareCheckBoxDailyReward").checked) {
//							Resource.DailyReward.showFeed(result.resourceRewardId);
//							Resource.DailyReward.shareCheckBoxDailyReward = true;
//						} else {
//							Resource.DailyReward.shareCheckBoxDailyReward = false;
//						}
//						Resource.DailyReward.updateIcon(false);
//						if (result.updateSeed) {
//							update_seed(result.updateSeed);
//						}
//						updateResourcesBar();
//						Modal.hideModal();
//					} else {
//						alert(arStrings.SD.Resource_hcString416+" " + result.msg);
//					}
//				},
//				function(){
//					alert(arStrings.SD.Resource_requestFailed);
//				}
//			);
			
		}
		
		
		
		public	function	showFeed(rewardId) {
//			var reparr = [],
//			image = "1101_dailyresource";
//			reparr.push(["REPLACE_ReWaRdId", rewardId]);
//			common_postToProfile('1101', reparr, null, image);
		}
		
		public	function	updateIcon(status) {
			/*
			if (status) {
				$("buttonDailyResourceReward").show();
			} else {
				$("buttonDailyResourceReward").hide();
			}
			*/
		}
		
		public	function	tooltip(elem, evt) {
//			var cssOverride = {}; 
//			cssOverride.width = "105px";
//			Tooltip.show(elem, evt, arStrings.Tooltip.DailyResourceReward, [-20, 20], cssOverride);
		}
//	}
		
	/**
	*
	* END HERE: Daily Reward =========================================================================================== >
	*
	*/
	
	public function getTransPortResourceList(cityId:int):Array
	{
		return getTransPortResourceList(cityId,null);
	}
	public function getTransPortResourceList(cityId:int,res:long[]):Array
	{
		var list:Array = [];
		var rvo:ResourceVO;
		var idx:int = 0;
		if(res != null && (res.Length == 5 || res.Length == 6))
		{
			for(idx=0;idx<=7;idx++)
			{
				if(idx>4 && res.Length == 5) continue;				
				else if(idx==5 || idx==6) continue;//unuse resource type
				var index=idx>6?idx-2:idx;//if (idx>6) idx=idx-2
				rvo = InitResourceVOInternal(cityId,idx);
				rvo.selectNum = res[index] > rvo.owned ? rvo.owned:res[index];
				list.push(rvo);
			}
		}
		else
		{
			for(idx=0;idx<=4;idx++)
			{
				rvo = InitResourceVOInternal(cityId,idx);
				list.push(rvo);
			}
		}
		return list;
	}
	
	private function InitResourceVOInternal(cityId:int,resId:int):ResourceVO
	{
		var result:ResourceVO = new ResourceVO();
		result.id = resId;
		result.owned = this.getCountForType(resId,cityId);			
		result.name = Datas.instance().getArString(String.Format("ResourceName.{0}{1}",_Global.ap, resId));
		//_Global.Log("Resource.InitResourceVOInternal  ResourceId : " + resId + " Name : " + result.name + " result.owned : " + result.owned);
		return result;
	}
	
	public function getData(type:int):Hashtable
	{
		var curCityId:int = GameMain.instance().getCurCityId();
		var upkeep:long = GetFoodUpkeep(curCityId) ;	
	
		var data:Hashtable;
		if(type != Constant.ResourceType.GOLD)
		{
			data = {
				"ID":type,
				"owned":getCountForTypeInSeed(type, curCityId),
				"product":getFinalResourceProductivity(curCityId, type),
				"cap":GetLimitForType(type, curCityId),
				"upkeep":upkeep			
			};
		}
		else
		{
			data  = {
					"ID":Constant.ResourceType.GOLD,
					"owned":getCountForTypeInSeed(Constant.ResourceType.GOLD, curCityId),
					"product":TaxRevenue(curCityId),
					"cap":0,		
					"upkeep": GetGoldUpkeep(curCityId)
				};			
		}
		
		return data;
	}
	//获取城堡当前等级
	public function GetCastleLevel():int
	{	
//		var common:Utility = Utility.instance();
		var curCityId: int = GameMain.instance().getCurCityId();
//		
//		
//		var curLevel:int = Building.instance().getMaxLevelForType(Constant.Building.PALACE, curCityId);
//			
//		
//		var	slotInfo:HashObject = seed["buildings"]["city" + curCityId]["pos0"];
//		curLevel = slotInfo ? _Global.INT32(slotInfo[_Global.ap + 1]) : 0;
		return GetCastleLevel(curCityId);
	}
	
	public function GetCastleLevel(cityId:int):int{
		var curLevel:int = Building.instance().getMaxLevelForType(Constant.Building.PALACE, cityId);
		var	slotInfo:HashObject = seed["buildings"]["city" + cityId]["pos0"];
		curLevel = slotInfo ? _Global.INT32(slotInfo[_Global.ap + 1]) : 0;
		return curLevel;
	}
}
