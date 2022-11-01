

public class TechnologyQueueElement extends QueueItem
{
	public  var progress:int;

	public function mergeDataFrom(src:HashObject)
	{
		var ap:String = _Global.ap;
		this.classType = QueueType.TechnologyQueue;
		this.id = _Global.INT32(src[ap + 0]);
		this.level = _Global.INT32(src[ap + 1]);
		this.startTime = _Global.parseTime(src[ap + 2]);
		this.endTime = _Global.parseTime(src[ap + 3]);
		this.progress = _Global.INT32(src[ap + 4]);
		this.needed = _Global.INT32(src[ap + 5]);
		this.timeRemaining = this.endTime - GameMain.instance().unixtime();
		
		this.help_cur = _Global.INT32(src[ap + 7]);
		this.help_max = _Global.INT32(src[ap + 8]);

		this.itemName = Datas.getArString("techName.t" + this.id);	
	}
}


// 技能信息
public class TechnologyInfo
{
	public var skillID : int;
	public var curLevel : int;
	public var maxLevel : int;
	public var sort : int;
	public var unlockBuilding : System.Collections.Generic.List.<Requirement> = new System.Collections.Generic.List.<Requirement>();
	// 技能满足一种就可以
	public var unlockSkill : System.Collections.Generic.List.<Requirement> = new System.Collections.Generic.List.<Requirement>();
	public var requirements : System.Collections.Generic.List.<Requirement> = new System.Collections.Generic.List.<Requirement>();
	public var time : int;   // 实际要用的时间
	public var oldTime : int;   // 没加速的时间
	public var name : String;
	public var icon : String;
	public var dicscribe : String;
	// 是否解锁
	public var isUnlock : boolean;
	public var isLight : boolean;

	public var isResearch : boolean = false;

	public function syncUnlockReq() : void
	{
		isUnlock = true;

		var req_building : boolean = true;
		for(var i:int=0; i<unlockBuilding.Count; i++)			
		{
			var idata:Requirement = unlockBuilding[i];
			if(idata.ok != true  && idata.ok != 'true')
			{
				req_building = false;		
				break;
			}
		}

		var req_skill : boolean = true;

		for(var j:int=0; j<unlockSkill.Count; j++)			
		{
			var skill:Requirement = unlockSkill[j];
			if(skill.ok != true  && skill.ok != 'true')
			{
				req_skill = false;		
				break;
			}
		}

		if(curLevel > 0)
		{
			isUnlock = true;
			isLight = true;
		}
		else
		{
			if(!req_building || !req_skill)
			{
				isUnlock = false;
			}

//			if(isUnlock && curLevel > 0) 
//			{
//				isLight = true;
//			}
//			else
//			{
				isLight = false;
//			}
		}		
	}
}

class Technology extends KBN.Technology
{
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new Technology();
		}
		
		return singleton as Technology;
	}

	//可同时学习的最大科技数量
	public static var MAX_COUNT : int = 1;
	private var	seed : HashObject;
	public var technologyList : System.Collections.Generic.List.<TechnologyInfo>  = new System.Collections.Generic.List.<TechnologyInfo>();
	public var technologyQueues : System.Collections.Generic.List.<TechnologyQueueElement> = new System.Collections.Generic.List.<TechnologyQueueElement>();
	//是否可以弹PopUp
	public var isTechnologyPopUp : boolean = false;
	public var isTechnologyPopUping : boolean = false;

	public function init(sd : HashObject) : void
	{
		secondTimes = 0;
		isTechnologyPopUp = false;
		isTechnologyPopUping = false;
		technologyQueues.Clear();
		
		seed = sd;

		InitTechnologyList();
		
		var obj:Hashtable = GameMain.instance().getSeed()["queue_technology"].Table;	
		for(var j:System.Collections.DictionaryEntry in obj) 
		{
			for(var i:System.Collections.DictionaryEntry in (j.Value as HashObject).Table)
			{
				addTechnologyQueue(i.Value);
			}
		}
	}
	
	public function updateSeed(updateSeed : HashObject) : void
	{
		if(updateSeed["isTechnologyPopUp"] && isMainCity())
		{
			if(_Global.INT32(updateSeed["isTechnologyPopUp"]) == 1)
			{
				isTechnologyPopUp = false;
			}
			else
			{
				isTechnologyPopUp = true;
			}

			ShowTechMerlinMenu();
		}
	}
	
	public function ShowTechMerlinMenu()
	{
		if(!isTechnologyPopUp)
		{
			return;
		}

		if(isTechnologyPopUping)
		{
			return;
		}

		if(!isCanShowTechBuilding())
		{
			return;
		}
				
		var curSceenLevel : int = GameMain.instance().getScenceLevel();
		if(curSceenLevel != GameMain.CITY_SCENCE_LEVEL)
		{
			return;
		}
		
		isTechnologyPopUping = true;
	}

	private var secondTimes : int = 0;
	private var IntervalTime : int = 2;
	public function Update()
	{
		if(isTechnologyPopUping && MenuMgr.getInstance().GetCurMenuName() == "MainChrom")
		{
			secondTimes += 1;
			if(secondTimes > IntervalTime)
			{
				secondTimes = 0;
				GameMain.instance().SetCityCameraPos(new Vector2(2,2));
				MenuMgr.getInstance().PushMenu("CarmotIntroDialog",{"type":2},"trans_pop");
			}
		}
	}
	
	public function SetBuildings(result:HashObject)
	{
		var cities : Hashtable = result["buildingIds"].Table;
        var city:HashObject;

	    for(var j:int = 0; j < cities.Count; j++)
        {
            city = cities[_Global.ap + j];
            if(city == null)
                continue;
            var cityId : int = _Global.INT32(city["cityId"].Value);
            var a:HashObject = seed["buildings"]["city"+cityId]["pos"+Constant.Building.TIERLEVEUP];
            if( a == null || a.Table.Count == 0 )
			{
				GameMain.instance().getSeed()["buildings"]["city" + cityId]["pos" + Constant.Building.TIERLEVEUP] = new HashObject({
																		_Global.ap + 0:Constant.Building.TECHNOLOGY_TREE + "", 
																		_Global.ap + 1:1 + "", 
																		_Global.ap + 2:Constant.Building.TIERLEVEUP + "", 
																		_Global.ap + 3:city["buildingId"].Value as String	
																		});
        	}
		}
	}

	public function isHaveTechBuildingData() : boolean
	{
		var currentcityid : int = GameMain.instance().getCurCityId();
		var a:HashObject = seed["buildings"]["city"+currentcityid]["pos"+Constant.Building.TIERLEVEUP];

		if( a == null || a.Table.Count == 0 )
		{
			return false;
		}

		return true;
	}
	
	public function checkTechPopUp()
	{
		var okFunc:Function=function(result:HashObject){
			SetBuildings(result);	
			GameMain.instance().buildingTechnology(Constant.Building.TIERLEVEUP,Constant.Building.TECHNOLOGY_TREE,1);		
		};
		isTechnologyPopUping = false;	
		var currentcityid : int = GameMain.instance().getCurCityId();
		var params:Array = new Array();
		params.Add(1);
		params.Add(currentcityid);
				
		UnityNet.reqCheckTechPopUp(params, okFunc, null);
	}

	public function getMightValue(skillId : int, curLevel : int) : int
	{
		var might : int = GameMain.GdsManager.GetGds.<GDS_Technology>().getMightValue(skillId,curLevel);
		return might;
	}

	public function getEffectIndex(skillId : int, curLevel : int) : int
	{
		var index : int = GameMain.GdsManager.GetGds.<GDS_Technology>().getEffectIndex(skillId,curLevel);
		return index;
	}

	public function getEffectString(skillId : int, curLevel : int, index : int) : String
	{
		var effect : String = GameMain.GdsManager.GetGds.<GDS_Technology>().getEffectString(skillId,curLevel,index);
		return effect;
	}

	public function getEffect(skillId : int, curLevel : int, index : int) : float
	{
		var effect : int = GameMain.GdsManager.GetGds.<GDS_Technology>().getEffect(skillId,curLevel,index);
		return effect * 0.0001;
	}
	
	public function getIntEffect(skillId : int, curLevel : int, index : int) : int
	{
		var effect : int = GameMain.GdsManager.GetGds.<GDS_Technology>().getEffect(skillId,curLevel,index);
		return effect;
	}
	
	public function BonusForType(resourceType : int) : float
	{
		var resData : float = 0f;
		switch(resourceType)
		{
			case Constant.ResourceType.FOOD://1
				resData = getFoodProductionIncrease();
				break;
			case Constant.ResourceType.LUMBER://2
				resData = getWoodProductionIncrease();
				break;
			case Constant.ResourceType.STONE://3
				resData = getStoneProductionIncrease();
				break;
			case Constant.ResourceType.IRON://4
				resData = getOreProductionIncrease();
				break;
			case Constant.ResourceType.GOLD://0
				resData = getGoldProductionIncrease();
				break;
		}
		
		return resData;
	}

	//#region buff
	// 增加行军部队数量上限 1019 effect5
	public function getAddMarchCount() : int
	{
		var addMarchCount : int = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1019);
		if(tech != null && tech.isLight)
		{
			addMarchCount = getIntEffect(tech.skillID, tech.curLevel, 5);
		}

		return addMarchCount;
	}

	// 训练部队所用时间缩短 1020 effect6
	public function getCutDownTrainTroopTime() : float
	{
		var cutDownTime : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1020);
		if(tech != null && tech.isLight)
		{
			cutDownTime = getEffect(tech.skillID, tech.curLevel, 6);
		}

		return cutDownTime;
	}

	// 训练部队需要的资源消耗减少 1021 effect7
	public function getReduceTrainTroopResConsume() : float
	{
		var reduce : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1021);
		if(tech != null && tech.isLight)
		{
			reduce = getEffect(tech.skillID, tech.curLevel, 7);
		}

		return reduce;
	}

	// 部队行军速度增加 1022 effect8
	public function getTroopsMarchSpeed() : float
	{
		var speed : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1022);
		if(tech != null && tech.isLight)
		{
			speed = getEffect(tech.skillID, tech.curLevel, 8);
		}

		return 1 + speed;
	}

	// 兵营训练部队数量增加 1023 effect9
	public function getIncreaseNumOfBarracks() : int
	{
		var increase : int = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1023);
		if(tech != null && tech.isLight)
		{
			increase = getIntEffect(tech.skillID, tech.curLevel, 9);
		}

		return increase;
	}

	// 玩家可派出的行军数量增加 1026 1027 effect12
	public function getIncreaseMarchNum()
	{
		var increase : int = 0;
		var tech : TechnologyInfo;
		tech = GetTechnologySkillById(1026);
		if(tech != null && tech.isLight)
		{
			increase += getIntEffect(tech.skillID, tech.curLevel, 12);
		}

		tech = GetTechnologySkillById(1027);
		if(tech != null && tech.isLight)
		{
			increase += getIntEffect(tech.skillID, tech.curLevel, 12);
		}

		return increase;
	}

	// Wood生产量增加 1028 effect13
	public function getWoodProductionIncrease()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1028);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 13);
		}

		return increase;
	}

	// Stone生产量增加 1029 effect14
	public function getStoneProductionIncrease()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1029);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 14);
		}

		return increase;
	}

	// Ore生产量增加 1030 effect15
	public function getOreProductionIncrease()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1030);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 15);
		}

		return increase;
	}

	// Food生产量增加 1031 effect16
	public function getFoodProductionIncrease()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1031);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 16);
		}

		return increase;
	}

	// Gold生产量增加 1032 effect17
	public function getGoldProductionIncrease()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1032);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 17);
		}

		return increase;
	}

	// 医院容纳伤兵数量的上限提高 1041 effect26
	public function getIncreaseWoundedSoldiersNum()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1041);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 26);
		}

		return increase;
	}
	
	// 仓库保护量增加 1033 effect18
	public function getIncreaseStorehouseProtection()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1033);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 18);
		}

		return increase;
	}

	// 建造及升级建筑的所需时间缩短 1034 effect19
	public function getReducedTimeToBuild()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1034);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 19);
		}

		return increase;
	}

	// 炼金研究所研究科技所需时间缩短 1035 effect20
	public function getCutDownResearchAlchemyTime()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1035);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 20);
		}

		return increase;
	}

	// 战役获取资源增加 1037 effect22
	public function getIncreaseNumOfResInCampaign()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1037);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 22);
		}

		return increase;
	}

	// 医院医疗伤兵消耗资源减少 1039 effect24
	public function getReducedHospitalRes()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1039);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 24);
		}

		return increase;
	}

	// 医院治疗伤兵速度增加 1040 effect25
	public function getIncreasesHospitalWoundedSoldiersSpeed()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1040);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 25);
		}

		return increase;
	}

	// Divination Lab研究天赋所需时间缩短（科技树） 1036 effect21
	public function getDivinationLabShortensResearchTime()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1036);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 21);
		}

		return increase;
	}

	//玩家单次可治疗部队上限提高 1048 effect31
	public function getIncreasesOnceTreatmentUpperLimit()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1048);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 31);
		}

		return 1 + increase;
	}

	//部队运载能力增加 1046 effect32
	public function getTroopLoad()
	{
		var increase : float = 0;
		var tech : TechnologyInfo = GetTechnologySkillById(1046);
		if(tech != null && tech.isLight)
		{
			increase = getEffect(tech.skillID, tech.curLevel, 32);
		}

		return increase;
	}
	//#endregion
	
	public function isTechOpen() : boolean
	{
		var mainCityId : int = GameMain.instance().getMainCityId();
		var a:HashObject = seed["buildings"]["city"+mainCityId]["pos"+Constant.Building.TIERLEVEUP];

		if( a == null || a.Table.Count == 0 )
		{
			return false;
		}

		return true;
	}

	// 是否是主城
	public function isMainCity() : boolean
	{		
		var mainCity : boolean = GameMain.instance().isMainCity();
		return mainCity;
	}

	public function isCanShowTechBuilding() : boolean
	{
		if(isMainCity())
		{
			var currentcityid : int = GameMain.instance().getCurCityId();
			var maxLevel : int = Building.instance().getMaxLevelForType(0,currentcityid);
			if(maxLevel >= 23)
			{
				return true;
			}
		}

		return false;
	}

	public function techCostResToGems(requirements : System.Collections.Generic.IEnumerable.<Requirement>, curLevel:int,targetId:int):float
	{
		var	resourceRequirement:long = 0;
			
		var resourceToGems:float = 0;
		var R7GemsRate : float = _Global.FLOAT(GameMain.instance().getSeed()["r7togem"].Value);
		for ( var idata:Requirement in requirements )
		{
			for(var j:int = 0;j<=4;j++)
			{
				if(idata.type == Datas.instance().getArString("ResourceName."+_Global.ap + j))
					resourceRequirement += _Global.INT32(GameMain.GdsManager.GetGds.<GDS_Technology>().getCostResource(targetId,curLevel,j));
			}
			if(idata.type == Datas.instance().getArString("ResourceName."+_Global.ap + 7)){
				resourceRequirement += _Global.INT32(GameMain.GdsManager.GetGds.<GDS_Technology>().getCostResource(targetId,curLevel,7))*R7GemsRate;
			}
		}
		resourceToGems = resourceRequirement*55.0f/250000.0f;
		return 	resourceToGems>0?resourceToGems:0;
	}

	public function getInstantTechnologyGems(techTime : int) : int
	{
		var	gemRequired:int = SpeedUp.instance().getTechGemCost(techTime);
		return gemRequired;
	}

	public function getTechnologyQueueById(techID : int) : TechnologyQueueElement
	{
		for(var i : int = 0; i < technologyQueues.Count;++i)
		{
			if(technologyQueues[i].id == techID)
			{
				return technologyQueues[i];
			}
		}

		return null;
	}

	public function isTechnologyQueueFull() : boolean
	{
		return technologyQueues.Count >= MAX_COUNT;
	}

	public function getFirstQueue() : TechnologyQueueElement
	{
		if(isTechnologyQueueFull())
		{
			return technologyQueues[0];
		}

		return null;
	}

	public function addTechnologyQueue(src : HashObject) : void
	{
		var tech : TechnologyQueueElement = new TechnologyQueueElement();
		//tech.mergeDataFrom(src);
		var ap:String = _Global.ap;
		tech.classType = QueueType.TechnologyQueue;
		tech.id = _Global.INT32(src[ap + 0]);
		tech.level = _Global.INT32(src[ap + 1]);
		tech.startTime = _Global.parseTime(src[ap + 2]);
		tech.endTime = _Global.parseTime(src[ap + 3]);
		tech.progress = _Global.INT32(src[ap + 4]);
		tech.needed = _Global.INT32(src[ap + 5]);
		tech.timeRemaining = tech.endTime - GameMain.instance().unixtime();
		
		tech.help_cur = _Global.INT32(src[ap + 7]);
		tech.help_max = _Global.INT32(src[ap + 8]);

		tech.itemName = Datas.getArString("DivinationLab.SkillName_" + tech.id.ToString());	

		technologyQueues.Add(tech);

		MenuMgr.getInstance().onResearch(tech);

		// todo 刷新数据
		updateTechResearch(tech.id);
		MenuMgr.getInstance().sendNotification(Constant.Action.TECHNOLOGY_START,null);
		
		GameMain.instance().setBuildingAnimationOfCity(Constant.Building.TECHNOLOGY_TREE, Constant.BuildingAnimationState.Open);
	}

	public function removeTechnologyQueue(tech : TechnologyQueueElement) : void 
	{
		technologyQueues.Remove(tech);
		//todo 修改等级
		seed["technology"]["tech" + tech.id].Value = "" + tech.level;

		InitTechnologyList();

		MenuMgr.getInstance().sendNotification(Constant.Action.TECHNOLOGY_COMPLETE,null);
		GameMain.instance().setBuildingAnimationOfCity(Constant.Building.TECHNOLOGY_TREE, Constant.BuildingAnimationState.Close);

		SoundMgr.instance().PlayEffect( "end_construction", /*TextureType.AUDIO*/"Audio/");
	}

	public function checkAnimationState()
	{
		InitTechnologyList();
		if (isTechnologyQueueFull())
			GameMain.instance().setBuildingAnimationOfCity(Constant.Building.TECHNOLOGY_TREE, Constant.BuildingAnimationState.Open);
		else
			GameMain.instance().setBuildingAnimationOfCity(Constant.Building.TECHNOLOGY_TREE, Constant.BuildingAnimationState.Close);
	}

	public function updateQueue() : void
	{
		var i : int = 0;
		var tech : TechnologyQueueElement;

		for( i = technologyQueues.Count - 1; i >= 0 ; i -- )
		{
			tech = technologyQueues[i];

			if(tech.timeRemaining > 0)
			{
				tech.calcRemainingTime();
			}
			else
			{
				removeTechnologyQueue(tech);
			}
		}	
	}

	public	function upgradeTechnology(techTypeId : int, techLevel : int) {
	
		var researchData:HashObject = Datas.instance().researchData();
		var general = General.instance();
		var resource:Resource = Resource.instance();
		var gMain:GameMain = GameMain.instance();
		var currentcityid:int = gMain.getCurCityId();
		var resLevel : int = techLevel - 1;
		var mult = Mathf.Pow(2, resLevel);
		var i : int;

		if(this.isTechnologyQueueFull())
		{
			return;
		}
		else 
		{			
			var okFunc:Function = function(result:HashObject)
			{
				for (i = 0; i <= 7; i++) 
				{ // remove resources
					if(i != Constant.ResourceType.ITEMS)
					{
						var ti : int = GameMain.GdsManager.GetGds.<GDS_Technology>().getCostResource(techTypeId,resLevel,i);
						resource.addToSeed(i, ti * mult * -1, currentcityid);
					}
				}

				var itemData : HashObject = GameMain.GdsManager.GetGds.<GDS_Technology>().getTechnologyItemsData(techTypeId,techLevel);
				var itemReqArr : Array = Building.instance().getBuildItemsReq(itemData);
				var req : Requirement;
				for(i = 0; i < itemReqArr.length; i++)
				{
					req = itemReqArr[i] as Requirement;
					if(req !=null) 
					{
						var costItemCount : int = _Global.INT32(req.required);
						var costItemId : int = req.typeId;
						MyItems.instance().subtractItem(costItemId,costItemCount);
					}
				}
		
				Resource.instance().UpdateRecInfo();
				
				var time :long = _Global.INT32(result["timeNeeded"]);//getResearchAloneTime(techTypeId,techLevel - 1);				
				var unixtime = GameMain.unixtime();
				
				var obj:HashObject  = new HashObject( {
									_Global.ap + 0 : techTypeId, 
									_Global.ap + 1 : techLevel, 
									_Global.ap + 2 : unixtime, 
									_Global.ap + 3 : unixtime + time, 
									_Global.ap + 4 : 0, 
									_Global.ap + 5 : time,
									_Global.ap + 7 : result["help_cur"],
									_Global.ap + 8 : result["help_max"]
									}) ;
				if(result["updateSeed"]){
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}

				addTechnologyQueue(obj);
				SoundMgr.instance().PlayEffect( "start_research", /*TextureType.AUDIO*/"Audio/" );
			};
			
			var	errorFunc:Function = function(msg:String, errorCode:int){

				//TODO:
			};
			
			var params:Array = new Array();
			params.Add(currentcityid);
			params.Add(techLevel);
			params.Add(techTypeId);
			
			UnityNet.reqUpgradeTechnology(params, okFunc, null);
		}
	}

	public	function	instantTechnology(techTypeId:int, techLevel:int,onCallBack:Function,requirements:Array,aditionGems:float) {
		var	general:General = General.instance();
		var resource:Resource = Resource.instance();
		var speedUp:SpeedUp = SpeedUp.instance();
		var curCityId:int = GameMain.instance().getCurCityId();
		var mult = Mathf.Pow(2, techLevel - 1);
		//var researchData:HashObject = Datas.instance().researchData(techTypeId);
		var tech : TechnologyInfo = GetTechnologySkillById(techTypeId);
		var	researchAloneTime:int = tech.time;//_Global.INT32(researchData["t"+techTypeId]["c"][_Global.ap + 6] * mult * (1 / (1 + general.intelligenceBonus())));
		var	goldRequired:int;
		
		var rate:float = _Global.FLOAT(seed["buyUpgradeRateTech"].Value);
		
		var tmpTimeceil:int = _Global.INT32(SpeedUp.instance().getTechGemCost(researchAloneTime)*_Global.INT32(rate*10000) + 9999)/10000;
		
		if(seed["buyUpgradeRateTech"])
			goldRequired = tmpTimeceil+Mathf.Ceil(aditionGems*_Global.FLOAT(seed["buyUpgradeRateTech"].Value));
		else
			goldRequired = speedUp.getTechGemCost(researchAloneTime)+aditionGems;
		
		var	itemsList:String = speedUp.getTechSpeedUpItemListString(researchAloneTime);
		var canAfford:boolean = false;
		
		if(Payment.instance().CheckGems(goldRequired))
		{
			canAfford = true;
		}
		else
		{
			return;
		}
		var	i:int;
		
		if(!canAfford) 
		{
			MenuMgr.getInstance().PushPaymentMenu();
		}
		 else 
		{
			if(true)
			{
				var okFunc:Function = function(result:HashObject)
				{
					SoundMgr.instance().PlayEffect( "start_research", /*TextureType.AUDIO*/"Audio/" );	
					var isReal:boolean = result["isWorldGem"]?result["isWorldGem"].Value == false:true;
					Payment.instance().SubtractGems(goldRequired,isReal);
					Resource.instance().UpdateRecInfo();
					seed["technology"]["tech"+techTypeId].Value = techLevel;

					if(result["updateSeed"]){
						UpdateSeed.instance().update_seed(result["updateSeed"]);
					}
					
					InitTechnologyList();				
					MenuMgr.getInstance().sendNotification(Constant.Action.TECHNOLOGY_COMPLETE,null);

					GameMain.instance().seedUpdateAfterQueue(true);
					if(onCallBack!=null)
						onCallBack();			
				};
				
				var	errorFunc:Function = function(msg:String, errorCode:String)
				{
					if(errorCode == "UNKNOWN")
						return;
						
					var errorMsg:String = errorCode == UnityNet.NET_ERROR ? Datas.getArString("Error.Network_error") : UnityNet.localError( errorCode, msg, null );
					
					if(errorCode != UnityNet.NET_ERROR && _Global.INT32(errorCode) == 3000 &&MenuMgr.getInstance().GetCurMenu() != MenuMgr.getInstance().MainChrom)
						MenuMgr.getInstance().PopMenu("");
					
					if( errorMsg != null )
					{
						ErrorMgr.instance().PushError("",errorMsg, true,Datas.getArString("FTE.Retry"), null);
					}
								
					GameMain.instance().seedUpdate(false);
				};
							
				var okCostGemsFunc:Function = function()
				{
					var params:Array = new Array();
					params.Add(curCityId);
					params.Add(techLevel);
					params.Add(techTypeId);
					params.Add(goldRequired);
					params.Add(itemsList);
					
					UnityNet.reqInstantTechnology(params, okFunc, null );	
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
						SpeedUpDialogmenu.setAction(okCostGemsFunc);
					   }
					});
				}
				else
				{
					okCostGemsFunc();
				}	
			}
		}
	}

	public function InitTechnologyList() : void
	{
		technologyList.Clear();
		var tech : TechnologyInfo;

		var technologyKeys : Array = _Global.GetObjectKeys(seed["technology"]);
		for(var j : int = 0; j < technologyKeys.length;j++ )
		{
			var key : String = _Global.GetString(technologyKeys[j]);
			var keySkillID : int = _Global.INT32(key.Substring(4));

			tech = new TechnologyInfo();
			tech.skillID = keySkillID;

			var queue : TechnologyQueueElement = getTechnologyQueueById(keySkillID);
			if(queue != null)
			{
				tech.isResearch = true;
			}

			tech.curLevel = _Global.INT32(seed["technology"]["tech" + keySkillID]);
			tech.maxLevel = GameMain.GdsManager.GetGds.<GDS_Technology>().getTechnologySkillMaxLevel(keySkillID);
			tech.sort = GameMain.GdsManager.GetGds.<GDS_Technology>().getTechnologyType(keySkillID);
			if(tech.curLevel < tech.maxLevel)
			{
				var nextLevel : int = tech.curLevel + 1;
			
				tech.requirements = GetUpdateReqs(keySkillID, nextLevel);
				//tech.time = _Global.CeilToInt(GameMain.GdsManager.GetGds.<GDS_Technology>().getSkillUpgrateNeedTime(keySkillID, nextLevel) * getDivinationLabShortensResearchTime());
			}	
			tech.name = Datas.getArString("DivinationLab.SkillName_" + keySkillID.ToString());
			tech.icon = GameMain.GdsManager.GetGds.<GDS_Technology>().getIconName(keySkillID,1);
			tech.dicscribe = Datas.getArString("DivinationLab.SkillDesc_" + keySkillID.ToString());

			technologyList.Add(tech);	
		}
		
		SetTechnologyIsUnlock();
		SetTechnologyTime();
	}
	

	public function updateTechResearch(techid : int) : void
	{
		var tvo:TechnologyInfo;
		if(!technologyList)
			return;
		for(var i:int=0;i<technologyList.Count;i++)
		{
			tvo = technologyList[i] as TechnologyInfo;
			if(tvo.skillID == techid)
			{
				tvo.isResearch = true;
			}
		}	
	}

	// 设置是否解锁
	private function SetTechnologyIsUnlock() : void
	{
		for(var i : int = 0; i < technologyList.Count; ++i)
		{
			var tech : TechnologyInfo = technologyList[i];
			tech.unlockBuilding = GetUnlockBuildingReqs(tech.skillID, 1);
			tech.unlockSkill = GetUnlockSkillReqs(tech.skillID, 1);
			
			tech.syncUnlockReq();		
		}
	}
	
	private function SetTechnologyTime()
	{
		for(var i : int = 0; i < technologyList.Count; ++i)
		{
			var tech : TechnologyInfo = technologyList[i];

			if(tech.curLevel < tech.maxLevel)
			{
				var nextLevel : int = tech.curLevel + 1;
			
				tech.time = _Global.CeilToInt(GameMain.GdsManager.GetGds.<GDS_Technology>().getSkillUpgrateNeedTime(tech.skillID, nextLevel) / (1 + getDivinationLabShortensResearchTime()));
				tech.oldTime = _Global.CeilToInt(GameMain.GdsManager.GetGds.<GDS_Technology>().getSkillUpgrateNeedTime(tech.skillID, nextLevel));
			}			
		}
	}

	public function GetTechnologySkillById(skillID : int) : TechnologyInfo
	{
		for(var i : int = 0; i < technologyList.Count; ++i)
		{
			if(skillID == technologyList[i].skillID)
			{
				return technologyList[i];
			}
		}

		return null;
	}

	//获得同类型的技能列表
	public function GetSkillsBySort(sort : int) : System.Collections.Generic.List.<OneRowSkill>
	{
		var skills : System.Collections.Generic.List.<OneRowSkill> = GameMain.GdsManager.GetGds.<GDS_TechnologyShow>().GetRowSkills(sort);
		return skills;
	}
	
	//获得当前技能在 显示行的第几个
	public function GetIndexOfRow(skillID : int) : int
	{
		var sort : int = GameMain.GdsManager.GetGds.<GDS_Technology>().getTechnologyType(skillID);
		var skills : System.Collections.Generic.List.<OneRowSkill> = GetSkillsBySort(sort);
		
		for(var i : int = 0; i < skills.Count;++i)
		{
			var skillRow : OneRowSkill = skills[i];
			for(var j : int = 0; j < skillRow.rowSkill.Count;++j)
			{
				if(skillID == skillRow.rowSkill[j])
				{
					return j;
				}
			}
		}
		
		return 0;
	}

	// 获得技能解锁条件
	public function GetUnlockSkillCondition(skillID : int) : String
	{
		var unlock : String = GameMain.GdsManager.GetGds.<GDS_Technology>().getUnlockSkillCondition(skillID);
		return unlock;
	}

	//判断一个技能是否是别的技能的解锁条件
	public function IsUnlockSkill(skillID : int) : boolean
	{
		var sort : int = GameMain.GdsManager.GetGds.<GDS_Technology>().getTechnologyType(skillID);
		var skills : System.Collections.Generic.List.<OneRowSkill> = GetSkillsBySort(sort);
		
		for(var i : int = 0; i < skills.Count;++i)
		{
			var skillRow : OneRowSkill = skills[i];
			for(var j : int = 0; j < skillRow.rowSkill.Count;++j)
			{
				var showId : int = skillRow.rowSkill[j];
				if(showId != 0)
				{
					var unlock : String = GetUnlockSkillCondition(showId);
					if(unlock == "0")
					{
						continue;
					}
					var msgArr : String[] = unlock.Split(";"[0]);
					for(var k : int = 0; k < msgArr.length;++k)
					{
						var arr : String[] = msgArr[k].Split("_"[0]);
						var  id : int = _Global.INT32(arr[1]);
						if(id == skillID)
						{
							return true;
						}
					}
				}				
			}
		}

		return false;
	}

	//解锁 技能
	public function GetUnlockSkillReqs(targetId:int, targetLevel:int):System.Collections.Generic.List.<Requirement>
	{
		var reqData:HashObject = GameMain.GdsManager.GetGds.<GDS_Technology>().getTechnologyUnlockSkillRequirementData(targetId,targetLevel);

		var	retArr:System.Collections.Generic.List.<Requirement> = new System.Collections.Generic.List.<Requirement>();
		var skillReqArr:Array;
		var req:Requirement;

		//Skill Req
		skillReqArr = getSkillReq(reqData);
		for(var i : int = 0; i <skillReqArr.length;i++)
		{
			req = skillReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Add(req);
		}

		return retArr;
	}

	//解锁 建筑
	public function GetUnlockBuildingReqs(targetId:int, targetLevel:int):System.Collections.Generic.List.<Requirement>
	{
		var reqData:HashObject = GameMain.GdsManager.GetGds.<GDS_Technology>().getTechnologyRequirementData(targetId,targetLevel);

		var	retArr:System.Collections.Generic.List.<Requirement> = new System.Collections.Generic.List.<Requirement>();
		var buildingReqArr:Array;
		var req:Requirement;

		//Building Req
		buildingReqArr = Building.instance().getBuildBuildingReq(reqData);
		for(var i : int = 0 ;i < buildingReqArr.length;i++)
		{
			req = buildingReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Add(req);
		}

		return retArr;
	}

	//获得升级材料
	public function GetUpdateReqs(targetId:int, targetLevel:int):System.Collections.Generic.List.<Requirement>
	{
		var reqData:HashObject = GameMain.GdsManager.GetGds.<GDS_Technology>().getTechnologyRequirementData(targetId,targetLevel);
		var costData:HashObject = GameMain.GdsManager.GetGds.<GDS_Technology>().getTechnologyCostData(targetId,targetLevel);
		var itemData:HashObject = GameMain.GdsManager.GetGds.<GDS_Technology>().getTechnologyItemsData(targetId,targetLevel);

		var	retArr:System.Collections.Generic.List.<Requirement> = new System.Collections.Generic.List.<Requirement>();
		var buildingReqArr:Array;
		var itemReqArr:Array;
		var costReqArr:Array;
		var req:Requirement;
		var i:int=0;

		//Building Req
		buildingReqArr = Building.instance().getBuildBuildingReq(reqData);
		for(i=0;i<buildingReqArr.length;i++)
		{
			req = buildingReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Add(req);
		}

		//Resource
		costReqArr = Building.instance().getBuildCostResReq(costData);
		for(i=0;i<costReqArr.length;i++)
		{
			req = costReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Add(req);
		}

		//Items Req
		itemReqArr = Building.instance().getBuildItemsReq(itemData);
		for(i=0;i<itemReqArr.length;i++)
		{
			req = itemReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Add(req);
		}
		
		return retArr;
	}

	public function getSkillReq(data:HashObject):Array
	{
		var seed:HashObject = GameMain.instance().getSeed();
		var	retArr:Array = new Array();
		var req:Requirement;
		var reqLv:int = 0;
		var curLv:int = 0;
		
		if(data != null)
		{
			var skillReqKeys:Array = _Global.GetObjectKeys(data);
			var key:String;
			var reqSkillID:int = 0;
			
			for(var i:int=0;i<skillReqKeys.length;i++)
			{
				key = _Global.GetString(skillReqKeys[i]);
				if(key.StartsWith("r14_"))
				{
					reqSkillID = _Global.INT32(key.Substring(4));
					req = new Requirement();

					reqLv = _Global.INT32(data[key]);
					curLv = GetTechnologySkillById(reqSkillID).curLevel;
					req.ok = curLv >= reqLv;					

					req.type = Datas.getArString("DivinationLab.SkillName_" + reqSkillID.ToString());//Datas.getArString("itemName.i" + reqItemId);
					req.required = Datas.getArString("Common.Lv") + " " + reqLv;
					req.own = Datas.getArString("Common.Lv") + " " + curLv.ToString();

					retArr.Push(req);	
				}
			}
		}
		return retArr;
	}
	
	public function getTechAddMaxMarchCount() : int
	{
		var addMarch : int = 0;
		addMarch += GameMain.GdsManager.GetGds.<GDS_Technology>().getTechnologySkillMaxLevel(1026);
		addMarch += GameMain.GdsManager.GetGds.<GDS_Technology>().getTechnologySkillMaxLevel(1027);
		return addMarch;
	}
}