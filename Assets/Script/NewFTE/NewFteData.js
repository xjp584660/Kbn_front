#pragma strict
import System.Collections;
import System.Collections.Generic;

import System.IO;
import System.Text;

class NewFteData
{
	// Use the attribute (JsonFx.Json.JsonName) for JsonFx.Json.JsonReader Deserialize
	// If not have the attribute usage, default use the member name as the jsonName
	// @JsonFx.Json.JsonName("id")
	public var id:int;
	
	//@JsonFx.Json.JsonName("type")
	public var type:String;
	
	//@JsonFx.Json.JsonName("name")
	public var name:String;
	public var updateMenu:String;
	public var description:String;
	
	public var isCanSkip:boolean;
	
	// Conditions
	public var openConditions:NewFteConditions = null;
	public var completeConditions:NewFteConditions = null;
	
	public var fakeItems:NewFteRewards = null;
	public var rewards:NewFteRewards = null;
	
	public var stepsFileName:String;
	
	//--------------------------------------------------
	// The task step datas list, as the completed conditions
	private var stepDatas:List.<NewFteStepData> = null;
	
	public function ToString():String
	{
		var sb:StringBuilder = new StringBuilder(1024);
		
		sb.Append("NewFteData:\n");
		sb.AppendFormat("id:{0}\n", id);
		sb.AppendFormat("name:{0}\n", name);
		sb.AppendFormat("type:{0}\n", type);
		sb.AppendFormat("description:{0}\n", description); 
		
		return sb.ToString();
	}
	
	// Explict custom Construction
	public function NewFteData()
	{
		InitVariables();
	} 
	
	public function NewFteData(jsonData:HashObject)
	{
		InitVariables(); 
		ParseJson(jsonData);
	} 
	
	public static function BuildFromJson(jsonString:String):NewFteData
	{
		var hashObject:HashObject = JSONParse.defaultInst().Parse(jsonString); 
		if (null == hashObject) return null;
		
		return BuildFromJson(hashObject);
	}
	
	public static function BuildFromJson(jsonData:HashObject):NewFteData
	{
		var result:NewFteData = new NewFteData();
		
		return result;
	}
	
	private function InitVariables()
	{
		id = -1;
		type = String.Empty; 
		
		name = String.Empty; 
		description = String.Empty; 
		
		openConditions = null; 
		completeConditions = null; 
		
		fakeItems = null; 
		rewards = null;
		
		stepDatas = new Generic.List.<NewFteStepData>();
	}
	
	private function ParseJson(jsonData:HashObject)
	{
		// Parse the data
		id = _Global.INT32(jsonData[NewFteConstants.FteNodeKey.Id]); 
		type = _Global.GetString(jsonData[NewFteConstants.FteNodeKey.Type]); 
		
		name = _Global.GetString(jsonData[NewFteConstants.FteNodeKey.Name]); 
		description = _Global.GetString(jsonData[NewFteConstants.FteNodeKey.Description]); 
		
		isCanSkip = _Global.GetBoolean(jsonData[NewFteConstants.FteNodeKey.IsCanSkip]);
		
		var jsonString:String = _Global.GetString(jsonData[NewFteConstants.FteNodeKey.OpenConditions]);  
		var tmpJson:HashObject = jsonData[NewFteConstants.FteNodeKey.OpenConditions];
		openConditions = NewFteConditions.BuildFromJson(tmpJson);  
		
		jsonString = _Global.GetString(jsonData[NewFteConstants.FteNodeKey.CompleteConditions]);  
		tmpJson = jsonData[NewFteConstants.FteNodeKey.CompleteConditions];
		completeConditions = NewFteConditions.BuildFromJson(tmpJson);
		
		tmpJson = jsonData[NewFteConstants.FteNodeKey.FakeDatas];
		fakeItems = NewFteRewards.BuildFromJson(tmpJson);
		
		tmpJson = jsonData[NewFteConstants.FteNodeKey.Rewards];
		rewards = NewFteRewards.BuildFromJson(tmpJson);  
		
		stepsFileName = _Global.GetString(jsonData[NewFteConstants.FteNodeKey.StepsFileName]); 
		var stepsFile:TextAsset = TextureMgr.instance().LoadText(stepsFileName, NewFteMgr.FtesPath);

		updateMenu = _Global.GetString(jsonData["UpdateMenu"]);

		_Global.Log("Fte step fileName: " + stepsFileName);
		if (null != stepsFile)
		{
			var stepsJsonData:HashObject = JSONParse.defaultInst().Parse(stepsFile.text); 
			LoadStepDatasFromJson(stepsJsonData["Datas"]);
		}
	} 
	
	private function LoadStepDatasFromJson(jsonData:HashObject)
	{
		for (var jsonEnt:DictionaryEntry in jsonData.Table)
		{ 
			var stepData:NewFteStepData = new NewFteStepData(jsonEnt.Value); 
			stepDatas.Add(stepData);
		}
		
		stepDatas.Sort(function(a:Object, b:Object)
		{ 
			return (a as NewFteStepData).id - (b as NewFteStepData).id;
		});
	}
	
	public function MergeFromServer(seed:HashObject)
	{
	
	}
	
	public function get StepDatas():List.<NewFteStepData>
	{
		return stepDatas;
	}
	
	public function get IsCompleted():boolean
	{
		return true;
	}
	
	public function HasConditionType(type:System.Type):boolean
	{
		var result:boolean = false;
		for (var i:int = 0; i < openConditions.AndConditions.Count; i++)
		{
			if (openConditions.AndConditions[i].GetType() == type)
			{
				result = true;
				break;
			}
		}
		
		return result;
	}
	
	public function IsReachConditions(buildingId:int, buildingLevel:int):boolean
	{
		var condition:NewFteConditionBuilding = null;
		for (var i:int = 0; i < openConditions.AndConditions.Count; i++)
		{
			if (openConditions.AndConditions[i] instanceof NewFteConditionBuilding)
			{
				condition = openConditions.AndConditions[i] as NewFteConditionBuilding;
				if (condition.buildingId == buildingId && condition.buildingLevel == buildingLevel)
				{
					return IsCanOpened();
				}
			}
		}
		
		return false;
	}
	
	public function IsReachConditions(menu : KBNMenu):boolean
	{
		var condition:NewFteConditionMenu = null;
		for (var i:int = 0; i < openConditions.AndConditions.Count; i++)
		{
			if (openConditions.AndConditions[i] instanceof NewFteConditionMenu)
			{
				return IsCanOpened();
				// condition = openConditions.AndConditions[i] as NewFteConditionMenu;
				// if (condition.menuName.Equals(menu.menuName))
				// {
				// 	return IsCanOpened();
				// }
			}
		}
		
		return false;
	}
	
	public function IsEqualCondition(menu : KBNMenu):boolean
	{
		var condition:NewFteConditionMenu = null;
		for (var i:int = 0; i < openConditions.AndConditions.Count; i++)
		{
			if (openConditions.AndConditions[i] instanceof NewFteConditionMenu)
			{
				condition = openConditions.AndConditions[i] as NewFteConditionMenu;
				if (condition.menuName.Equals(menu.menuName))
				{
					return true;
				}
			}
		}
		
		return false;
	}
	
	public function IsReachConditions(toolbar:ToolBar):boolean
	{
		var condition:NewFteConditionMenu = null;
		for (var i:int = 0; i < openConditions.AndConditions.Count; i++)
		{
			if (openConditions.AndConditions[i] instanceof NewFteConditionTabIndex)
			{
				return IsCanOpened();
			}
		}
		
		return false;
	}
	
	public function IsReachConditions(prevFteId:int):boolean
	{
		var condition:NewFteConditionMenu = null;
		for (var i:int = 0; i < openConditions.AndConditions.Count; i++)
		{
			if (openConditions.AndConditions[i] instanceof NewFteConditionMenu)
			{
				return IsCanOpened();
			}
		}
		
		return false;
	}
	
	public function IsCanOpened():boolean
	{
		var result:boolean = true;
		for (var i:int = 0; i < openConditions.AndConditions.Count; i++)
		{
			var condition : NewFteCondition = openConditions.AndConditions[i];
			result &= condition.IsReached();
		}
		
		return result;
	}
}
