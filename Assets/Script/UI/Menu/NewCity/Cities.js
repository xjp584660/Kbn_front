import System.Collections.Generic;
import System.Collections;
class Cities extends PopMenu
{
	public var cityList:ScrollList;
	public var cityItem:NewcityItem;

	public var small_bg:Label;
	public var small_title:Label;
	var titleLine:Label;
	@SerializeField
	private var m_cityDescription : SimpleLabel;
	public var flashtimeBase:double;
    
    private var cityIdToUnhideTroops : int;
    
	function Init()
	{
		super.Init();
//		showItem.Init();
		cityList.Init(cityItem);
		showScrollView.Init();
		small_title.Init();
		small_bg.Init();
		small_title.txt=Datas.getArString("ShowSkill.Title_Text9");
		
//		var arStrings:Object = Datas.instance().arStrings();

		titleLine.setBackground("between line", TextureType.DECORATION);
		title.txt = Datas.getArString("AdditionalCity.AddCityPopupTitle");
		m_cityDescription.txt = Datas.getArString("MyCityPanel.NewCityDesc");
		btnClose.OnClick = function()
		{
//			CityQueue.instance().StopNote();
			MenuMgr.getInstance().PopMenu("");
		};
        
        cityIdToUnhideTroops = -1;
        UnityNet.GetShowSkills(okFunction,null);
	}
	function OnPush(param:Object)
	{
        var paramDict : Hashtable = param as Hashtable;
        if (paramDict != null && paramDict.ContainsKey("CityIdToUnhideTroops"))
        {
            cityIdToUnhideTroops = paramDict["CityIdToUnhideTroops"];
        }
        
		flashtimeBase = System.Convert.ToDouble(GameMain.instance().unixtime());
		CityQueue.instance().CheckNewCtiyRequirement();
        
		cityList.SetData(CityQueue.instance().Cities.ToArray());
        cityList.ForEachItem(CheckAndSetUnhideAnimationFlag);
	}
    
    function OnPushOver()
    {
        super.OnPushOver();
        cityList.ForEachItem(ItemPushOver);
    }
	
    private function CheckAndSetUnhideAnimationFlag(item : ListItem) : boolean
    {
        var cityItem = item as NewcityItem;
        if (cityItem.cityInfo.cityId != cityIdToUnhideTroops)
        {
            return true;
        }
        cityItem.UnhideAnimationFlag = true;
        return true;
    }
    
    private function ItemPushOver(item : ListItem) : boolean
    {
        var cityItem = item as NewcityItem;
        cityItem.OnPushOver();
        return true;
    }
    
	public	function	OnPopOver()
	{
		cityList.Clear();
		showScrollView.clearUIObject();
	}
	
	function DrawItem()
	{
		titleLine.Draw();
		cityList.Draw();
		small_title.Draw();
		small_bg.Draw();
		m_cityDescription.Draw();
		showScrollView.Draw();
	}
	
	function Update()
	{
		cityList.UpdateData();
        cityList.ForEachItem(ScrollList.UpdateItem);
		updateTimeBase();
		showScrollView.Update();

	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.NEWCITY_REQUIREMENT:
				cityList.SetData(CityQueue.instance().Cities.ToArray());
				break;	
		}
	}

	function updateTimeBase()
	{
		flashtimeBase += Time.deltaTime;
	}

	//－－－－－－－－－－－ Show Skill -----------------------//
	
	public class HospitalData
	{
		public var cureSpeed:long;
		public var cureCost:long;
		public var hospitalCap:long;
		public var hospitalCount:long;
		public var hospitalCapFactor:long;
	}
	public class EconomyData
	{
		public var foodProductivity:long;
		public var woodProductivity:long;
		public var stoneProductivity:long;
		public var oreProductivity:long;
		public var campaignResource:long;
		public var pictResource:long;
		public var technologySpeedup:long;
		public var techSpeedup:long;
		public var constructSpeedup:long;
	}

	public class DefenceData
	{
		// public var defenseKnight:DefenseKnightData=new DefenseKnightData();
		public var defenseCapacity:long;
		public var knightName:long;
		public var mashalName:long;
		public var units:long;
		// public var wall:int;
	}
		public class DefenseKnightData
		{
			public var knightId:long;
			public var knightName:long;
			public var kLv:long;
			public var attackFactor:long;
			public var lifeFactor:long;
			// public var DefenseTroopCapacity:int;
		}

	public class TrainData
	{
		public var trainTroopNumber:long;
		public var trainCostDecrease:long;
		public var trainSpeedUp:TrainSpeedUpData=new TrainSpeedUpData();
		public var fortifySpeedUp:long;
		public var troopLoadPercent:long;
		public var troopLoadNumber:long;
		public var troopCostFood:long;
		public var campaignAttack:long;
		public var pictBoost:long;
	}

		public class TrainSpeedUpData
		{
			public var supply:long;
			public var cavalry:long;
			public var infantry:long;
			public var archer:long;
		}

	public class AttackData
	{
		public var marchSpeedup:long;
		public var marchLimit:long;
		public var infantry:InfantryData=new InfantryData();
		public var cavalry:CavalryData=new CavalryData();
		public var archer:ArcherData=new ArcherData();

	}
		public class InfantryData
		{
			public var attack:long;
			public var life:long;
			public var foeEnemyAttack:long;
			public var foeEnemyLife:long;
		}
		public class CavalryData
		{
			public var attack:long;
			public var life:long;
			public var foeEnemyAttack:long;
			public var foeEnemyLife:long;
		}
		public class ArcherData
		{
			public var attack:long;
			public var life:long;
			public var foeEnemyAttack:long;
			public var foeEnemyLife:long;
		}

	public class AllShowSkillData
	{
		public var stableMight:long;
		public var gearMight:long;
		public var technologyMight:long;
		public var might:long;
		public var totalMight:long;
		public var kill:long;
		public var hospital:HospitalData=new HospitalData();
		public var economy:EconomyData=new EconomyData();
		public var defense:DefenceData=new DefenceData();
		public var train:TrainData=new TrainData();
		public var attack:AttackData=new AttackData();
	}
	
	private var showSkill:AllShowSkillData;//=new AllShowSkillData();
	private function okFunction(resultAll:HashObject)
	{
		if (resultAll["ok"])
		{
		
			var result:HashObject=resultAll["showSkill"] as HashObject;
			
			showSkill=new AllShowSkillData();
			showSkill.stableMight=_Global.INT64(result["stableMight"]);
			showSkill.kill=_Global.INT64(result["kills"]);
			showSkill.gearMight=_Global.INT64(result["gearMight"]);
			showSkill.technologyMight=_Global.INT64(result["technologyMight"]);
			showSkill.might=_Global.INT64(result["might"]);
			showSkill.totalMight=_Global.INT64(result["totalMight"]);
			
			showSkill.hospital.cureSpeed=_Global.INT64(result["hospital"]["cureSpeed"]);
			showSkill.hospital.cureCost=_Global.INT64(result["hospital"]["cureCost"]);
			showSkill.hospital.hospitalCap=_Global.INT64(result["hospital"]["hospitalCap"]);
			showSkill.hospital.hospitalCount=_Global.INT64(result["hospital"]["hospitalCount"]);
			showSkill.hospital.hospitalCapFactor=_Global.INT64(result["hospital"]["hospitalCapFactor"]);

			showSkill.economy.foodProductivity=_Global.INT64(result["economy"]["foodProductivity"]);
			showSkill.economy.woodProductivity=_Global.INT64(result["economy"]["woodProductivity"]);
			showSkill.economy.stoneProductivity=_Global.INT64(result["economy"]["stoneProductivity"]);
			showSkill.economy.oreProductivity=_Global.INT64(result["economy"]["oreProductivity"]);
			showSkill.economy.campaignResource=_Global.INT64(result["economy"]["campaignResource"]);
			showSkill.economy.pictResource=_Global.INT64(result["economy"]["pictResource"]);
			showSkill.economy.technologySpeedup=_Global.INT64(result["economy"]["technologySpeedup"]);
			showSkill.economy.techSpeedup=_Global.INT64(result["economy"]["techSpeedup"]);
			showSkill.economy.constructSpeedup=_Global.INT64(result["economy"]["constructSpeedup"]);

			// showSkill.defense.defenseKnight.knightId=_Global.INT32(result["defense"]["defenseKnight"]["knightId"]);
			showSkill.defense.knightName=_Global.INT64(result["defense"]["knightName"]);
			showSkill.defense.mashalName=_Global.INT64(result["defense"]["mashalName"]);
			showSkill.defense.units=_Global.INT64(result["defense"]["units"]);
			// showSkill.defense.defenseKnight.kLv=_Global.INT32(result["defense"]["defenseKnight"]["kLv"]);
			// showSkill.defense.defenseKnight.attackFactor=_Global.INT32(result["defense"]["defenseKnight"]["attackFactor"]);
			// showSkill.defense.defenseKnight.lifeFactor=_Global.INT32(result["defense"]["defenseKnight"]["lifeFactor"]);
			showSkill.defense.defenseCapacity=_Global.INT64(result["defense"]["defenseCapacity"]);
			// showSkill.defense.defenseKnight.DefenseTroopCapacity=_Global.INT32(result["defense"]["defenseKnight"]["DefenseTroopCapacity"]);
			// showSkill.defense.wall=_Global.INT32(result["defense"]["wall"]);

			showSkill.train.trainTroopNumber=_Global.INT64(result["train"]["trainTroopNumber"]);
			showSkill.train.trainCostDecrease=_Global.INT64(result["train"]["trainCostDecrease"]);
			showSkill.train.trainSpeedUp.supply=_Global.INT64(result["train"]["trainSpeedUp"]["supply"]);
			showSkill.train.trainSpeedUp.cavalry=_Global.INT64(result["train"]["trainSpeedUp"]["cavalry"]);
			showSkill.train.trainSpeedUp.infantry=_Global.INT64(result["train"]["trainSpeedUp"]["infantry"]);
			showSkill.train.trainSpeedUp.archer=_Global.INT64(result["train"]["trainSpeedUp"]["archer"]);
			showSkill.train.fortifySpeedUp=_Global.INT64(result["train"]["fortifySpeedUp"]);
			showSkill.train.troopLoadPercent=_Global.INT64(result["train"]["troopLoadPercent"]);
			showSkill.train.troopLoadNumber=_Global.INT64(result["train"]["troopLoadNumber"]);
			showSkill.train.troopCostFood=_Global.INT64(result["train"]["troopCostFood"]);
			showSkill.train.pictBoost=_Global.INT64(result["train"]["pictBoost"]);
			showSkill.train.campaignAttack=_Global.INT64(result["train"]["campaignAttack"]);
			
			showSkill.attack.marchSpeedup=_Global.INT64(result["attack"]["marchSpeedup"]);
			showSkill.attack.marchLimit=_Global.INT64(result["attack"]["marchLimit"]);
			showSkill.attack.infantry.attack=_Global.INT64(result["attack"]["infantry"]["attack"]);
			showSkill.attack.infantry.life=_Global.INT64(result["attack"]["infantry"]["life"]);
			showSkill.attack.infantry.foeEnemyAttack=_Global.INT64(result["attack"]["infantry"]["foeEnemyAttack"]);
			showSkill.attack.infantry.foeEnemyLife=_Global.INT64(result["attack"]["infantry"]["foeEnemyLife"]);
			showSkill.attack.cavalry.attack=_Global.INT64(result["attack"]["cavalry"]["attack"]);
			showSkill.attack.cavalry.life=_Global.INT64(result["attack"]["cavalry"]["life"]);
			showSkill.attack.cavalry.foeEnemyAttack=_Global.INT64(result["attack"]["cavalry"]["foeEnemyAttack"]);
			showSkill.attack.cavalry.foeEnemyLife=_Global.INT64(result["attack"]["cavalry"]["foeEnemyLife"]);
			showSkill.attack.archer.attack=_Global.INT64(result["attack"]["archer"]["attack"]);
			showSkill.attack.archer.life=_Global.INT64(result["attack"]["archer"]["life"]);
			showSkill.attack.archer.foeEnemyAttack=_Global.INT64(result["attack"]["archer"]["foeEnemyAttack"]);
			showSkill.attack.archer.foeEnemyLife=_Global.INT64(result["attack"]["archer"]["foeEnemyLife"]);


			SetShowData();
			
		}
	}
	private function errorFunction(result:HashObject){}
	
	private function buildingName() : String
	{
		var cityId:int = GameMain.instance().getCurCityId();
		
		var hasQueue :  BuildingQueueMgr.QueueElement = BuildingQueueMgr.instance().first(cityId);
		if(hasQueue != null)
		{
			return hasQueue.itemName;
		}
		
		return "－";
	}
	private function buildingTime() : String
	{
		var cityId:int = GameMain.instance().getCurCityId();
		
		var hasQueue :  BuildingQueueMgr.QueueElement = BuildingQueueMgr.instance().first(cityId);
		if(hasQueue != null)
		{
			return _Global.timeFormatStrPlus(hasQueue.timeRemaining<0?0:hasQueue.timeRemaining);
		}
		
		return "0";
	}

	private function alchemyReceachName() : String
	{
		var curCitySearchItem:Research.ResearchQueueElement = Research.instance().getItemAtQueue(0,GameMain.instance().getCurCityId());
		if(curCitySearchItem != null)
		{
			return curCitySearchItem.itemName;
		}
		
		return "－";		
	}
	
	private function alchemyReceachTime() : String
	{
		var curCitySearchItem:Research.ResearchQueueElement = Research.instance().getItemAtQueue(0,GameMain.instance().getCurCityId());
		if(curCitySearchItem != null)
		{
			return _Global.timeFormatStrPlus(curCitySearchItem.timeRemaining<0?0:curCitySearchItem.timeRemaining);
		}
		
		return "0";		
	}
	
	private function techTreeReceachName() : String
	{
		var firstQueue : TechnologyQueueElement = Technology.instance().getFirstQueue();
		if(firstQueue != null)
		{
			return firstQueue.itemName;
		}
		
		return "－";	
	}

	private function techTreeReceachTime() : String
	{
		var firstQueue : TechnologyQueueElement = Technology.instance().getFirstQueue();
		if(firstQueue != null)
		{
			return _Global.timeFormatStrPlus(firstQueue.timeRemaining<0?0:firstQueue.timeRemaining);
		}
		
		return "0";	
	}
	
	private function getMaxMarchCount() : long
	{
		var cityId:int = GameMain.instance().getCurCityId();
		var max_troop : long = March.instance().getTroopMax(cityId,null, false);
//		var visibleMarchCount : int = Attack.instance().GetVisibleMarchCount();
//		var buffSize : long = AddMarchSizeData.getInstance().GetSelectedBuffSize();
//		var techBuff : float = Technology.instance().getAddMarchCount();
//		var maxMarchCount : String = _Global.NumSimlify(visibleMarchCount * (max_troop + buffSize+techBuff));
		return max_troop;//_Global.NumFormat(max_troop);//maxMarchCount;
	}
	
	private function getAllSlotCountForHealthInCity() : String
	{
		var cityId:int = GameMain.instance().getCurCityId();
		var hostpitals : Array = Building.instance().getAllOfType(Constant.Building.HOSPITAL, cityId);
		var levelField : String = _Global.ap + "1";
		var cntForHealth : int = 0;
		var gdsBuilding : GDS_Building = GameMain.GdsManager.GetGds.<GDS_Building>();
		for (var hospital : HashObject in hostpitals)
		{
			var level : int = _Global.INT32(hospital[levelField]);
			cntForHealth += gdsBuilding.getBuildingEffect(Constant.Building.HOSPITAL, level, Constant.BuildingEffectType.EFFECT_TYPE_CURE_UNIT_CAP);
		}

		var vipLevel : int = GameMain.instance().GetVipOrBuffLevel();
		var vipDataItem : KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(vipLevel);
		
		return (cntForHealth * (1 + Technology.instance().getIncreaseWoundedSoldiersNum()) * (1 + (vipDataItem.HOSPITAL_CAP * 0.01f))).ToString();
	}

	private function SetShowData()
	{
		if (AllShowSkillData==null) 
		{
			UnityNet.GetShowSkills(okFunction,errorFunction);
		}
		else
		{
			// var show_builds:HashObject=new HashObject
			// ({
			// 	"title":Datas.getArString("ShowSkill.Title_Text1"),
			// 	"list":new Array
			// 	([
			// 		{

			// 			"name":buildingName(),
			// 			"des":buildingTime()
			// 		},
			// 		{

			// 			"name":alchemyReceachName(),
			// 			"des":alchemyReceachTime()
			// 		},
			// 		{

			// 			"name":techTreeReceachName(),
			// 			"des":techTreeReceachTime()
			// 		}
			// 	])
				
			// });

			// var show_buff:HashObject={};

			var show_attack:HashObject=new HashObject
			({
				"title":Datas.getArString("ShowSkill.Title_Text3"),
				"list":new Array
				([
					{

						"name":Datas.getArString("ShowSkill.Desc_Text1"),
						"des": _Global.NumSimlify(showSkill.totalMight, 3, true),
						"index":"1"
					},
					// {

					// 	"name":Datas.getArString("ShowSkill.Desc_Text2"),
					// 	"des":_Global.NumSimlify(showSkill.totalMight, 3, true),
					// 	"index":"0"
					// },
					{

						"name":Datas.getArString("ShowSkill.Desc_Text65"),
						"des":_Global.NumSimlify(showSkill.kill, 3, true),//showSkill.stableMight.ToString(),
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text3"),
						"des":_Global.NumSimlify(showSkill.stableMight, 3, true),//showSkill.stableMight.ToString(),
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text4"),
						"des":_Global.NumSimlify(showSkill.technologyMight, 3, true),//showSkill.technologyMight.ToString(),
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text5"),
						"des":_Global.NumSimlify(showSkill.might, 3, true),//_Global.NumSimlify(showSkill.might ,3, true),
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text6"),
						"des":_Global.NumSimlify(GetAllWallMight(), 3, true),//GetAllWallMight().ToString(), //"0",///////
						"index":"0"
					}
					// {

					// 	"name":Datas.getArString("ShowSkill.Desc_Text7"),
					// 	"des":showSkill.gearMight.ToString(),
					// 	"index":"1"
					// }
				])
				
			});

			var show_military:HashObject=new HashObject
			({
				"title":Datas.getArString("ShowSkill.Title_Text4"),
				"list":new Array
				([
					{

						"name":Datas.getArString("ShowSkill.Desc_Text8"),
						"des":showSkill.attack.marchLimit.ToString(),
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text9"),
						"des":_Global.NumSimlify(getMaxMarchCount(), 3, true),//getMaxMarchCount(),
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text10"),
						"des":"+"+showSkill.attack.marchSpeedup+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text11"),
						"des":"+"+showSkill.attack.infantry.attack+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text12"),
						"des":"+"+showSkill.attack.cavalry.attack+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text13"),
						"des":"+"+showSkill.attack.archer.attack+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text14"),
						"des":"+"+showSkill.attack.infantry.life+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text15"),
						"des":"+"+showSkill.attack.cavalry.life+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text16"),
						"des":"+"+showSkill.attack.archer.life+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text17"),
						"des":"-"+showSkill.attack.infantry.foeEnemyAttack+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text18"),
						"des":"-"+showSkill.attack.cavalry.foeEnemyAttack+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text19"),
						"des":"-"+showSkill.attack.archer.foeEnemyAttack+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text61"),
						"des":"-"+showSkill.attack.infantry.foeEnemyLife+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text62"),
						"des":"-"+showSkill.attack.cavalry.foeEnemyLife+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text63"),
						"des":"-"+showSkill.attack.archer.foeEnemyLife+"%",
						"index":"1"
					}
				])
				
			});

			var show_defence:HashObject=new HashObject
			({
				"title":Datas.getArString("ShowSkill.Title_Text5"),
				"list":new Array
				([
					{

						"name":Datas.getArString("ShowSkill.Desc_Text20"),
						"des":showSkill.defense.defenseCapacity,
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text21"),
						"des":GetKnightName(),
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text64"),
						"des":GetMashalName(),
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text24"),
						"des":_Global.NumSimlify(showSkill.defense.units, 3, true),//showSkill.defense.units.ToString(),
						"index":"0"
					}//,
					// {

					// 	"name":Datas.getArString("ShowSkill.Desc_Text26"),
					// 	"des":showSkill.defense.wall.ToString(),
					// 	"index":"0"
					// }
				])
				
			});

			var show_train:HashObject=new HashObject
			({
				"title":Datas.getArString("ShowSkill.Title_Text6"),
				"list":new Array
				([
					{

						"name":Datas.getArString("ShowSkill.Desc_Text28"),
						"des":"+"+showSkill.train.trainSpeedUp.cavalry.ToString()+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text29"),
						"des":"+"+showSkill.train.trainSpeedUp.infantry.ToString()+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text27"),
						"des":"+"+showSkill.train.trainSpeedUp.supply.ToString()+"%",
						"index":"1"
					},	
					{

						"name":Datas.getArString("ShowSkill.Desc_Text30"),
						"des":"+"+showSkill.train.trainSpeedUp.archer.ToString()+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text31"),
						"des":"+"+showSkill.train.trainCostDecrease.ToString()+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text32"),
						"des":"+"+showSkill.train.trainTroopNumber.ToString()+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text33"),
						"des":"+"+showSkill.train.fortifySpeedUp.ToString()+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text34"),
						"des":"+"+showSkill.train.troopLoadPercent.ToString()+"%",
						"index":"0"
					},
					// {

					// 	"name":Datas.getArString("ShowSkill.Desc_Text35"),
					// 	"des":"+"+showSkill.train.troopLoadNumber.ToString(),
					// 	"index":"1"
					// },
					{

						"name":Datas.getArString("ShowSkill.Desc_Text36"),
						"des":"+"+showSkill.train.troopCostFood.ToString()+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text37"),
						"des":"+"+showSkill.train.campaignAttack.ToString()+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text38"),
						"des":"+"+showSkill.train.pictBoost.ToString()+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text39"),
						"des":Research.instance().getMaxLevelForType(Constant.Research.STEALTH).ToString(),
						"index":"0"
					}
				])
				
			});

			var show_hospital:HashObject=new HashObject
			({
				"title":Datas.getArString("ShowSkill.Title_Text8"),
				"list":new Array
				([
					{

						"name":Datas.getArString("ShowSkill.Desc_Text40"),
						"des":"+"+showSkill.hospital.cureCost.ToString()+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text41"),
						"des":"+"+showSkill.hospital.cureSpeed.ToString()+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text43"),
						"des":showSkill.hospital.hospitalCap.ToString(),
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text42"),
						"des":showSkill.hospital.hospitalCount.ToString(),//getAllSlotCountForHealthInCity(),
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text44"),
						"des":"+"+showSkill.hospital.hospitalCapFactor.ToString()+"%",
						"index":"1"
					}
				])
				
			});

			var show_economy:HashObject=new HashObject
			({
				"title":Datas.getArString("ShowSkill.Title_Text7"),
				"list":new Array
				([
					{

						"name":Datas.getArString("ShowSkill.Desc_Text45"),
						"des":"+"+showSkill.economy.constructSpeedup.ToString()+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text46"),
						"des":"+"+showSkill.economy.techSpeedup.ToString()+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text47"),
						"des":"+"+showSkill.economy.technologySpeedup.ToString()+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text48"),
						"des":"+"+showSkill.economy.woodProductivity.ToString()+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text49"),
						"des":"+"+showSkill.economy.stoneProductivity.ToString()+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text50"),
						"des":"+"+showSkill.economy.oreProductivity.ToString()+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text51"),
						"des":"+"+showSkill.economy.foodProductivity.ToString()+"%",
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text52"),
						"des":"+"+GetGoldBonus()+"%",
						"index":"0"
					},					
					{

						"name":Datas.getArString("ShowSkill.Desc_Text53"),
						"des":_Global.NumSimlify(Resource.instance().GetLimitForType
								(Constant.ResourceType.LUMBER,GameMain.instance().getCurCityId()), 3, true),//_Global.NumFormat(Resource.instance().GetLimitForType
								// (Constant.ResourceType.LUMBER,GameMain.instance().getCurCityId())),
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text54"),
						"des":_Global.NumSimlify(Resource.instance().GetLimitForType
								(Constant.ResourceType.STONE,GameMain.instance().getCurCityId()), 3, true),//_Global.NumFormat(Resource.instance().GetLimitForType
								// (Constant.ResourceType.STONE,GameMain.instance().getCurCityId())),
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text55"),
						"des":_Global.NumSimlify(Resource.instance().GetLimitForType
								(Constant.ResourceType.IRON,GameMain.instance().getCurCityId()), 3, true),//_Global.NumFormat(Resource.instance().GetLimitForType
								// (Constant.ResourceType.IRON,GameMain.instance().getCurCityId())),
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text56"),
						"des":_Global.NumSimlify(Resource.instance().GetLimitForType
								(Constant.ResourceType.FOOD,GameMain.instance().getCurCityId()), 3, true),//_Global.NumFormat(Resource.instance().GetLimitForType
								// (Constant.ResourceType.FOOD,GameMain.instance().getCurCityId())),
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text57"),
						"des":_Global.NumSimlify2(Resource.instance().GetProtCnt(GameMain.instance().getCurCityId())),/////////
						"index":"1"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text58"),
						"des":"+"+showSkill.economy.campaignResource.ToString()+"%",
						"index":"0"
					},
					{

						"name":Datas.getArString("ShowSkill.Desc_Text59"),
						"des":"+"+showSkill.economy.pictResource.ToString()+"%",
						"index":"1"
					}
				])
				
			});

			var showData:Array=new Array();
			// if (GetBuildsBuff()!=null)
			// {
			// 	showData.push(GetBuildsBuff());
			// }		
			// showData.push(GetItembuffs());
			showData.push(show_attack);
			showData.push(show_military);
			showData.push(show_defence);
			showData.push(show_train);
			showData.push(show_hospital);
			showData.push(show_economy);

			SetScrollView(showData);
		}
	}

	private function SetScrollView(showData:Array)
	{
		showScrollView.clearUIObject();
//		try
//	    {
			var a:int = 0;
			for(a = 0; a < showData.length; a++)
			{
				var listItem:ShowSkillGroupItem=Instantiate(showItem);
				listItem.Init();
				listItem.SetRowData(showData[a]);
				showScrollView.addUIObject(listItem);
				//showScrollView.AutoLayout();
			}
			showScrollView.AutoLayout();	
//		}
//	    catch(error:System.Exception)
//	    {
//			UnityNet.reportErrorToServer("Cities",null,"Client Exception",error.Message,false);
//			return;
//	    }
	}

	private function GetItembuffs():HashObject
	{
		var array:Array = BuffAndAlert.instance().getArrayForScrollList();
		var count:int=array.length;
		var data:Array=new Array();
		var present:long = GameMain.unixtime();
		for (var i = 0; i < count; i++) {
			var h:Hashtable=array[i] as Hashtable;
			var d:HashObject=new HashObject(
			{
				"name":h["description"]+"",
				"des":_Global.timeFormatStr(_Global.INT64(h["endTime"])-present>=0?_Global.INT64(h["endTime"])-present:0)
			});
			data.push(d);
		}
		var show_buff:HashObject=new HashObject
		({
			"title":Datas.getArString("ShowSkill.Title_Text2"),
			"list":data
		});
		return show_buff;
	}

	private function GetBuildsBuff():HashObject
	{
		var data:Array=new Array();
		if (buildingTime()!="0")
		{
			var d:HashObject=new HashObject(
			{
				"name":buildingName(),
				"des":buildingTime()
			});
			data.push(d);
		}	
		if (alchemyReceachTime()!="0")
		{
			var b:HashObject=new HashObject(
			{
				"name":alchemyReceachName(),
				"des":alchemyReceachTime()
			});
			data.push(b);
		}	
		if (techTreeReceachTime()!="0")
		{
			var x:HashObject=new HashObject(
			{
				"name":techTreeReceachName(),
				"des":techTreeReceachTime()
			});
			data.push(x);
		}
		var show_builds:HashObject=new HashObject
		({
			"title":Datas.getArString("ShowSkill.Title_Text1"),
			"list":data
		});
		if (data.length>0) {return show_builds;}
		else{ return null;}
	}

	private function GetGoldBonus():int
	{
		var baseBonus:float=0;
		if(GameMain.instance().IsVipOpened())
		{
			var vipLevel:int = GameMain.instance().GetVipOrBuffLevel();
			var vipDataItem: KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(vipLevel);
			baseBonus = vipDataItem.GOLD;
		}
		
		var totalBonus:int=Resource.instance().TaxItemBouns() * 100+_Global.INT32(baseBonus)+parseFloat(parseFloat(Technology.instance().getGoldProductionIncrease()) * 100);;
		return totalBonus;
	}

	private function GetAllWallMight():long
	{
		var might:long=0;
		var common:Utility = Utility.instance();
		var allTroopData:Array=Walls.instance().GetTroopListInCurCity().slice(0);
		for(var i:int = 0; i < allTroopData.length; i++)
		{
			var troopData:Walls.TroopInfo = allTroopData[i] as Walls.TroopInfo;
			troopData.requirements = common.checkreq("f", troopData.typeId, 1);
			troopData.bLocked = false;
			for(var j:int = 0; j < troopData.requirements.length; j++)
			{
				var requirement:Requirement = troopData.requirements[j] as Requirement;
				// if( !requirement.ok )//&& requirement.typeId < 0 )
				// {
				// 	troopData.bLocked = true;
				// 	break;
				// }	
			}

			// var troopData:Walls.TroopInfo = allTroopData[i] as Walls.TroopInfo;
			if (!troopData.bLocked) 
			{
				might+=troopData.might*troopData.owned;
			}	
		}

		return might;
	}
	private function GetChengfangLimit():long
	{
		var curCityId:int = GameMain.instance().getCurCityId();
		var	wallLevel:int = Building.instance().getMaxLevelForType(Constant.Building.WALL, curCityId);
		var	l1:int = Walls.instance().getWallSpace(curCityId, Constant.BuildingEffectType.EFFECT_TYPE_WALL_TROOP_T1_LIMIT);
		var	l2:int = Walls.instance().getWallSpace(curCityId, Constant.BuildingEffectType.EFFECT_TYPE_WALL_TROOP_T2_LIMIT);
		var l3:int = Walls.instance().getWallSpace(curCityId, Constant.BuildingEffectType.EFFECT_TYPE_WALL_TROOP_T3_LIMIT);
		return l1+l2+l3;
	}

	private function GetKnightName():String
	{
		// return "-";
		if (showSkill.defense.knightName==0) {
			return "-";
		}else{
			var curCityOrder:int = GameMain.instance().getCurCityOrder();
			var name : String = General.singleton.getKnightShowName(showSkill.defense.knightName.ToString(), curCityOrder);
			var temp : String = name.Split("the"[0])[0];
			if(temp.IsNullOrEmpty(temp))
			{
				return name;
			}
			else
			{
				return temp;
			}
		}	
	}

	private function GetMashalName():String
	{
		// return "-";
		if (showSkill.defense.mashalName==0) {
			return "-";
		}else{
			var curCityOrder:int = GameMain.instance().getCurCityOrder();
			var name : String = General.singleton.getKnightShowName(showSkill.defense.mashalName.ToString(), curCityOrder);
			var temp : String = name.Split("the"[0])[0];
			if(temp.IsNullOrEmpty(temp))
			{
				return name;
			}
			else
			{
				return temp;
			}
		}	
	}

	public var showItem:ShowSkillGroupItem;
	public var showScrollView:ScrollView;






}