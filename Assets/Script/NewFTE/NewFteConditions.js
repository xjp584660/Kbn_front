#pragma strict
import System.Collections;
import System.Collections.Generic;

class NewFteConditions
{
	protected var andConditions:List.<NewFteCondition> = null;
	protected var orConditions:List.<NewFteCondition> = null; 
	
	public static function BuildFromJson(jsonString:String):NewFteConditions
	{
		var hashObject:HashObject = JSONParse.defaultInst().Parse(jsonString); 
		if (null == hashObject) return null;
		
		return BuildFromJson(hashObject);
	}
	
	public static function BuildFromJson(jsonData:HashObject):NewFteConditions
	{
		if (null == jsonData) return null;
		
		var result:NewFteConditions = new NewFteConditions();
		result.ParseJson(jsonData);
		
		return result;
	}
	
	private function NewFteConditions()
	{
		andConditions = new List.<NewFteCondition>();
		orConditions = new List.<NewFteCondition>();
	}
	
	// { cond1:{ A:{1, 2, 3}, B:{4, 5, 6}, C:{7, 8, 9} } } || { cond2:{D, E, F} }
	private function ParseJson(jsonData:HashObject)
	{
		if (null == jsonData) return;
		
		var cond:NewFteCondition = null;
		for (var jsonEnt:DictionaryEntry in jsonData.Table) // Array, or conditions
		{ 
			// var keyString:String = _Global.GetString(jsonEnt.Key); 
			// if (keyString.Contains("building"))
			// {
			// 	cond = new NewFteConditionBuilding(jsonEnt.Value);
			// } 
			// else if (keyString.Contains("openMenu"))
			// {
			// 	cond = new NewFteConditionMenu(jsonEnt.Value); 
			// } 
			
			cond = NewFteCondtFactoryMgr.Instance().CreateCondition(jsonEnt);
			andConditions.Add(cond);
		}
	}
	
	public function get AndConditions():List.<NewFteCondition>
	{
		return andConditions;
	}
	
	public function get OrConditions():List.<NewFteCondition>
	{
		return orConditions;
	}
}

class NewFteCondition
{
	protected var andConditions:List.<NewFteCondition> = null;
	protected var orConditions:List.<NewFteCondition> = null;
	
	public function NewFteCondition()
	{
		andConditions = new List.<NewFteCondition>();
		orConditions = new List.<NewFteCondition>();
	}
	
	// { cond1:{ A:{1, 2, 3}, B:{4, 5, 6}, C:{7, 8, 9} } } || { cond2:{D, E, F} }
	public function ParseJson(jsonData:HashObject)
	{
		if (null == jsonData) return;
	}
	
	public function IsReached():boolean
	{
		if (null == andConditions && null == orConditions)
			return true;
		
		var result:boolean = false;
		var i:int = 0;
		if (null != andConditions)
		{
			result = true;
			for (i = 0; i < andConditions.Count; i++)
			{
				result &= andConditions[i].IsMeetCondition();
			}
		}
		
		if (null != orConditions)
		{
			for (i = 0; i < orConditions.Count; i++)
			{
				result |= orConditions[i].IsMeetCondition();
			}
		} 
		
		result &= IsMeetCondition();
		return result;
	};
	
	protected function IsMeetCondition():boolean
	{
		return false;
	}
}

class NewFteConditionBuilding extends NewFteCondition
{
	public var buildingId:int;
	public var buildingLevel:int;
	public var buildingCnt:int;
	
	private function NewFteConditionBuilding() {}
	public function NewFteConditionBuilding(data:HashObject)
	{ 
		super();
		
		buildingId = _Global.INT32(data["BuildingId"]); 
		buildingLevel = _Global.INT32(data["BuildingLevel"]); 
		
		if (null != data["BuildingCount"])
			buildingCnt = _Global.INT32(data["BuildingCount"]);
	}
	
	protected function IsMeetCondition():boolean
	{
		for (var city:City in CityQueue.instance().Cities)
		{
			var buildingLvl:int = Building.instance().getMaxLevelForType(buildingId, city.cityId);
			if (buildingLvl >= buildingLevel)
			{
				return true;
			}
		}
		
		return true;
		return false;
	}
}

class NewFteConditionPlayer extends NewFteCondition
{
	public var playerLevel:int;
	public var vipLevel:int;
	public var holdGems:int;
	public var holdMoeny:int;
	
	private function NewFteConditionPlayer() {}
	public function NewFteConditionPlayer(data:HashObject)
	{ 
		super();
	}
	
	protected function IsMeetCondition():boolean
	{
		return true;
	}
}

class NewFteConditionMenu extends NewFteCondition
{
	public var menuName:String; 
	
	private function NewFteConditionMenu() {}
	public function NewFteConditionMenu(data:HashObject)
	{ 
		super();
		menuName = _Global.GetString(data); 
	}
	
	protected function IsMeetCondition():boolean
	{
		var tTopMenu : KBNMenu = MenuMgr.getInstance().Top();
		return menuName.Equals(tTopMenu.menuName);
		
		return true;
	}
}

class NewFteConditionPrevFteId extends NewFteCondition
{
	public var prevFteId:int; 
	
	private function NewFteConditionPrevFteId() {}
	public function NewFteConditionPrevFteId(data:HashObject)
	{ 
		super();
		prevFteId = _Global.INT32(data); 
	}
	
	protected virtual function IsMeetCondition():boolean
	{ 
		var isDone:boolean = NewFteMgr.Instance().IsFteCompleted(prevFteId);
		return isDone;
	}
}

class NewFteConditionTabIndex extends NewFteCondition
{ 
	public var jsonValue:String; 
	
	public var toolbar:ToolBar; 
	public var tabIndex:int; 
	
	private function NewFteConditionTabIndex() {}
	public function NewFteConditionTabIndex(data:HashObject)
	{ 
		super(); 
		
		jsonValue = _Global.GetString(data); 
	}
	
	protected virtual function IsMeetCondition():boolean
	{  
		var splitChar:String = ".";
		var hierarchyNames:String[] = jsonValue.Split(splitChar.ToCharArray());
		if (hierarchyNames.Length == 0)
		{
			return false;
		}
		
		var menu:System.Object = UtilityTools.GetMenuObject(hierarchyNames[0]); 
		if (null == menu || menu != MenuMgr.getInstance().Top()) return false;
		
		toolbar = NewFteMgr.GetMenuMemberObject(jsonValue) as ToolBar; 
		if (null != toolbar 
			&& ( (toolbar.toolbarStrings.Length > 1 && toolbar.isVisible()) || toolbar.toolbarStrings.Length == 1) 
			)
		{
			var index:int = jsonValue.LastIndexOf(splitChar);
			if (-1 != index)
			{  
				var indexString:String = jsonValue.Substring(index + 1, jsonValue.Length - index - 1);
				tabIndex = UtilityTools.GetNumberInt(indexString);
			}	
			
			if (tabIndex < 0)
				return false;
			
			// Check the GeneralMenu's function is opened or unlocked?
			var generalMenu:GeneralMenu = menu as GeneralMenu;
			if (generalMenu)
			{
				if (1 == tabIndex)
				{
					if (!GearSysController.IsOpenGearSys() || !GearSysController.IsGearSysUnlocked())
						return false;
				}
			}
			
			// Check the ArmMenu's function is opened or unlocked?
			var armMenu:ArmMenu = menu as ArmMenu;
			if (armMenu)
			{
				var tabName:String = armMenu.GetNameByMapppingIndex(tabIndex);
				var selectedTabName:String = toolbar.toolbarStrings[toolbar.selectedIndex];	
				
				if ( tabName.Equals(Datas.getArString("Common.EquipmentInfoTab")) )
				{
					if (!GearSysController.IsOpenMount() || !GearSysController.IsMountUnlocked())
						return false;
				}
				else if ( tabName.Equals(Datas.getArString("Common.EquipmentEnhanceTab")) )
				{	
					if (!GearSysController.IsOpenSwallow() || !GearSysController.IsSwallowUnlocked())
						return false;
				}
				else if ( tabName.Equals(Datas.getArString("Common.EquipmentLvUpTab")) )
				{
					if (!GearSysController.IsOpenStrengthen() || !GearSysController.IsStrengthenUnlocked())
						return false;
				}
				else if ( tabName.Equals(Datas.getArString("Common.EquipmentReset")) )
				{
					if (!GearSysController.IsOpenGacha() || !GearSysController.IsGachaUnlocked())
						return false;
				}

				return selectedTabName.Equals(tabName);
			}
				
			return toolbar.selectedIndex == tabIndex;
		}
		
		return false;
	} 
	
	// public function IsMeetCondition(toolbar:ToolBar, index:int):boolean
	// { 
	// 	return (this.toolbar == toolbar) && tabIndex == index;
	// }
}