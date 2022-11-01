#pragma strict

public enum SystemCfgConditionType
{
	BuildingLevel = 1,	
	RoleLevel = 1,	
}

public class SystemCfgCondition
{
	var type:String;
	var key:String;
	var val:String;
	
	public static function Parse(object:KBN.DataTable.GearSysUnlock):Array
	{
		var retArr:Array = new Array();
		
		if(object != null)
		{
			var strCondition:String = object.value;
			var conditions:String[] = strCondition.Split("/"[0]);
			for(var i:int=0;i<conditions.Length;i++)
			{
				if( !System.String.IsNullOrEmpty(conditions[i]))
				{
					var condition:SystemCfgCondition = new SystemCfgCondition();
					condition.type = object.type.ToString();
					var elements:String[] = conditions[i].Split("-"[0]);
					if(elements.Length == 2)
					{
						condition.key = elements[0];
						condition.val = elements[1];
					}
					retArr.Push(condition);
				}
			}
		}
		
		return retArr;
	}
	
	public function ToNotReachedString():String
	{
		var tType:int = _Global.INT32(this.type);
		
		if (tType == SystemCfgConditionType.BuildingLevel)
			return BuildingNotReachedString();
			
		else if (tType == SystemCfgConditionType.RoleLevel)
			return RoleNotReachedString();
			
		return "xxxxx";
	}
	
	private function BuildingNotReachedString():String
	{
		var tBuildingTypeId:int = _Global.INT32(this.key);
		var tBuildingNeedLevel:int = _Global.INT32(this.val);
		
		// var buildingLvl:int = Building.instance().getMaxLevelForType(tBuildingTypeId);
		var result:String = "Need {0} reach {1} level";
		result = String.Format(result, Datas.getArString("buildingName."+"b" + tBuildingTypeId), tBuildingNeedLevel);
		return result;
	} 
	
	private function RoleNotReachedString():String
	{
		return "roleLevel";
	} 
	
	public virtual function IsReached():boolean
	{
		var tType:int = _Global.INT32(this.type);
		
		if (tType == SystemCfgConditionType.BuildingLevel)
			return IsBuildingLevelReached();
			
		else if (tType == SystemCfgConditionType.RoleLevel)
			return IsRoleLevelReached();
		
		return true;
	}
	
	protected function IsBuildingLevelReached():boolean
	{
		var tBuildingTypeId:int = _Global.INT32(this.key);
		var tBuildingNeedLevel:int = _Global.INT32(this.val);
		
		// Current city 
		var cityId:int = GameMain.instance().getCurCityId();
		var buildingLvl:int = Building.instance().getMaxLevelForType(tBuildingTypeId, cityId);
		return buildingLvl >= tBuildingNeedLevel;
	}
	
	protected function IsRoleLevelReached():boolean
	{
		return true;
	}
}
	
class GearSysController
{
	public static var IsInControling:boolean = true;
	
	private static var openGearSys:boolean = true;
	
	// Exclude equipment change module
	private static var canArmOperate:boolean = true;
	private static var openMount:boolean = true;
	private static var openSwallow:boolean = true;
	private static var openStrengthen:boolean = true;
	private static var openGacha:boolean = true;
	
	public static function UpdateFromSettingSeed(setting:HashObject)
	{
		// Reset all false first.
		openGearSys = false;
		canArmOperate = false;
		openMount = openSwallow = openStrengthen = openGacha = false;
		
		// Get state from GetSeed / UpdateSeed
		if (null != setting["gearMainControl"])
			openGearSys = _Global.GetBoolean(_Global.INT32(setting["gearMainControl"]));
		
		if (null != setting["gearMountControl"])
			openMount = _Global.GetBoolean(_Global.INT32(setting["gearMountControl"]));
				
		if (null != setting["gearUnlockStarControl"])
			openSwallow = _Global.GetBoolean(_Global.INT32(setting["gearUnlockStarControl"]));
			
		if (null != setting["gearLevelUpControl"])
			openStrengthen = _Global.GetBoolean(_Global.INT32(setting["gearLevelUpControl"]));
		
		if (null != setting["gearGachaControl"])
			openGacha = _Global.GetBoolean(_Global.INT32(setting["gearGachaControl"]));
			
		canArmOperate = openMount || openSwallow || openStrengthen || openGacha;
		
		// Add new fte control
		if (null != setting["gearFteControl"])
		{
			NewFteMgr.IsOpenFte = _Global.GetBoolean(_Global.INT32(setting["gearFteControl"]));
		}
	}
	
	public static function IsOpenGearSys():boolean
	{ 
		if (!IsInControling) return true;
		return openGearSys;
	}
	
	public static function IsCanArmOperate():boolean
	{ 
		if (!IsInControling) return true;
		return canArmOperate;
	}
	
	public static function IsOpenMount():boolean
	{ 
		if (!IsInControling) return true;
		return openMount;
	}
	
	public static function IsOpenSwallow():boolean
	{ 
		if (!IsInControling) return true;
		return openSwallow;
	}
	
	public static function IsOpenStrengthen():boolean
	{ 
		if (!IsInControling) return true;
		return openStrengthen;
	}
	
	public static function IsOpenGacha():boolean
	{
		if(!IsInControling) return true;
		return openGacha;
	}
	

	public static function IsGearSysUnlocked():boolean
	{
		if (!IsInControling) return true;
		
		var conditionObj:KBN.DataTable.GearSysUnlock = GameMain.GdsManager.GetGds.<KBN.GDS_GearSysUnlock>().GetItemByKey("dressRequire");
		if (null == conditionObj) return true; // Mean no need this condition
		
		var conditionArray:Array = SystemCfgCondition.Parse(conditionObj);
		
		return IsConditionsReached(conditionArray);
	}
	
	public static function IsMountUnlocked():boolean
	{
		var conditionObj:KBN.DataTable.GearSysUnlock = GameMain.GdsManager.GetGds.<KBN.GDS_GearSysUnlock>().GetItemByKey("mountRequire");
		if (null == conditionObj) return true; // Mean no need this condition
		
		var conditionArray:Array = SystemCfgCondition.Parse(conditionObj);
		
		return IsConditionsReached(conditionArray);
	}
	
	public static function IsSwallowUnlocked():boolean
	{	
		var conditionObj:KBN.DataTable.GearSysUnlock = GameMain.GdsManager.GetGds.<KBN.GDS_GearSysUnlock>().GetItemByKey("starUpRequire");
		if (null == conditionObj) return true; // Mean no need this condition
		
		var conditionArray:Array = SystemCfgCondition.Parse(conditionObj);
		
		return IsConditionsReached(conditionArray);
	}
	
	public static function IsStrengthenUnlocked():boolean
	{
		var conditionObj:KBN.DataTable.GearSysUnlock = GameMain.GdsManager.GetGds.<KBN.GDS_GearSysUnlock>().GetItemByKey("levelUpRequire");
		if (null == conditionObj) return true; // Mean no need this condition
		
		var conditionArray:Array = SystemCfgCondition.Parse(conditionObj);
		
		return IsConditionsReached(conditionArray);
	}
	
	public static function IsGachaUnlocked():boolean
	{
		var conditionObj:KBN.DataTable.GearSysUnlock = GameMain.GdsManager.GetGds.<KBN.GDS_GearSysUnlock>().GetItemByKey("resetRequire");
		if (null == conditionObj) return true; // Mean no need this condition
		
		var conditionArray:Array = SystemCfgCondition.Parse(conditionObj);
		
		return IsConditionsReached(conditionArray);
	}
	
	private static function IsConditionsReached(conditionArray:Array):boolean
	{
		if (conditionArray.Count == 0) return false;
		
		// condtion1 && condtion2 && condtion3 ...
		for (var condition:SystemCfgCondition in conditionArray)
		{
			if (!condition.IsReached()) return false;
		}
		
		return true;
	}
	
	//-------------------------------------------------------
	// Feedback data methods,same as IsGearSysUnlocked() ....
	//-------------------------------------------------------
	public static function CheckIsGearSysUnlocked(yesFunc:Function, noFunc:Function):boolean
	{
		if (!IsInControling)
		{
			if (null != yesFunc) yesFunc();
			return true;
		} 
		
		var conditionObj:KBN.DataTable.GearSysUnlock = GameMain.GdsManager.GetGds.<KBN.GDS_GearSysUnlock>().GetItemByKey("dressRequire");
		if (null == conditionObj)
		{
			if (null != yesFunc) yesFunc();
			return true;
		} 
		
		var conditionArray:Array = SystemCfgCondition.Parse(conditionObj);
		return CheckIsConditionsReached(conditionArray, yesFunc, noFunc);
	}
	
	public static function CheckIsMountUnlocked(yesFunc:Function, noFunc:Function):boolean
	{
		if (!IsInControling)
		{
			if (null != yesFunc) yesFunc();
			return true;
		} 
		
		var conditionObj:KBN.DataTable.GearSysUnlock = GameMain.GdsManager.GetGds.<KBN.GDS_GearSysUnlock>().GetItemByKey("mountRequire");
		if (null == conditionObj)
		{
			if (null != yesFunc) yesFunc();
			return true;
		} 
		
		var conditionArray:Array = SystemCfgCondition.Parse(conditionObj);
		return CheckIsConditionsReached(conditionArray, yesFunc, noFunc);
	}
	
	public static function CheckIsSwallowUnlocked(yesFunc:Function, noFunc:Function):boolean
	{
		if (!IsInControling)
		{
			if (null != yesFunc) yesFunc();
			return true;
		} 
	
		var conditionObj:KBN.DataTable.GearSysUnlock = GameMain.GdsManager.GetGds.<KBN.GDS_GearSysUnlock>().GetItemByKey("starUpRequire");
		if (null == conditionObj)
		{
			if (null != yesFunc) yesFunc();
			return true;
		} 
		
		var conditionArray:Array = SystemCfgCondition.Parse(conditionObj);
		return CheckIsConditionsReached(conditionArray, yesFunc, noFunc);
	}
	
	public static function CheckIsStrengthenUnlocked(yesFunc:Function, noFunc:Function):boolean
	{
		if (!IsInControling)
		{
			if (null != yesFunc) yesFunc();
			return true;
		} 
		
		var conditionObj:KBN.DataTable.GearSysUnlock = GameMain.GdsManager.GetGds.<KBN.GDS_GearSysUnlock>().GetItemByKey("levelUpRequire");
		if (null == conditionObj)
		{
			if (null != yesFunc) yesFunc();
			return true;
		} 
		
		var conditionArray:Array = SystemCfgCondition.Parse(conditionObj);
		return CheckIsConditionsReached(conditionArray, yesFunc, noFunc);
	}
	
	public static function CheckIsGachaUnlocked(yesFunc:Function, noFunc : Function):boolean
	{
		if (!IsInControling)
		{
			if (null != yesFunc) yesFunc();
			return true;
		}
		var conditionObj:KBN.DataTable.GearSysUnlock = GameMain.GdsManager.GetGds.<KBN.GDS_GearSysUnlock>().GetItemByKey("resetRequire");
		
		if (null == conditionObj)
		{
			if (null != yesFunc) yesFunc();
			return true;
		}

		var conditionArray:Array = SystemCfgCondition.Parse(conditionObj);
		return CheckIsConditionsReached(conditionArray, yesFunc, noFunc);
	}
	
	private static function CheckIsConditionsReached(conditionArray:Array, yesFunc:Function, noFunc:Function):boolean
	{
		if (conditionArray.Count == 0)
		{
			if (null != yesFunc) yesFunc();
			return true;
		}
		
		var result:boolean = true;
		var resultDatas:Array = new Array();
		
		// condtion1 && condtion2 && condtion3 ...
		for (var condition:SystemCfgCondition in conditionArray)
		{
			var isReached:boolean = condition.IsReached();
			result = result && isReached;
			
			resultDatas.Push(condition);	
		}
		
		if (result)
		{
			if (null != yesFunc) yesFunc();
		}
		else
		{
			if (null != noFunc) noFunc(resultDatas);
		}
		
		return result;
	}
}