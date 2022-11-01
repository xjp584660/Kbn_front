#pragma strict
import System.Collections;
import System.Collections.Generic;

public class NewFteCondtFactoryMgr
{
	private static var instance:NewFteCondtFactoryMgr = null;
	private function NewFteCondtFactoryMgr() {}
	
	public static function Instance():NewFteCondtFactoryMgr
	{
		if (null == instance)
		{
			instance = new NewFteCondtFactoryMgr();
			instance.Init();
			
			GameMain.instance().resgisterRestartFunc(function(){
				instance.Free();
				instance = null;
			});
		}
		
		return instance;
	}
	
	protected var conditionFactoryMap:Dictionary.<String, IConditionBaseFactory> = null;
	public function Init()
	{
		RegisterAllFactories();
	}
	
	public function Free()
	{
		UnregisterAllFactories();
	}
	
	protected function RegisterAllFactories()
	{
		RegisterFactory(NewFteConstants.ConditionTypeKey.PrevFteId, new ConditionPrevFteIdFactory());
		RegisterFactory(NewFteConstants.ConditionTypeKey.Building, new ConditionBuildingFactory());
		RegisterFactory(NewFteConstants.ConditionTypeKey.OpenMenu, new ConditionOpenMenuFactory());
		RegisterFactory(NewFteConstants.ConditionTypeKey.TabControlIndex, new ConditionTabIndexFactory());
	}
	
	protected function UnregisterAllFactories()
	{
		conditionFactoryMap.Clear();
	}
	
	protected function RegisterFactory(type:String, factory:IConditionBaseFactory)
	{
		if (null == conditionFactoryMap)
		{
			conditionFactoryMap = new Dictionary.<String, IConditionBaseFactory>();
		}
		
		if (conditionFactoryMap.ContainsKey(type))
		{
			return;
		}
		else
		{
			conditionFactoryMap[type] = factory;
		}
	}
	
	public function CreateCondition(jsonEnt:DictionaryEntry):NewFteCondition
	{
		var keyString:String = _Global.GetString(jsonEnt.Key); 
		
		for (var facEntity:KeyValuePair.<String, IConditionBaseFactory> in conditionFactoryMap)
		{
			if (keyString.Contains(facEntity.Key))
			{
				return facEntity.Value.CreateCondition(jsonEnt.Value);
			}
		}
		
		return null;
	}
}

//-------------------------------------------------------------------
public interface IConditionBaseFactory
{
	function CreateCondition(data:HashObject):NewFteCondition;
}

public class ConditionPrevFteIdFactory implements IConditionBaseFactory
{
	public function CreateCondition(data:HashObject):NewFteCondition
	{
		var cond:NewFteCondition = new NewFteConditionPrevFteId(data);
		cond.ParseJson(data);
		return cond;
	}
}

public class ConditionBuildingFactory implements IConditionBaseFactory
{
	public function CreateCondition(data:HashObject):NewFteCondition
	{
		var cond:NewFteCondition = new NewFteConditionBuilding(data);
		cond.ParseJson(data);
		return cond;
	}
}

public class ConditionOpenMenuFactory implements IConditionBaseFactory
{
	public function CreateCondition(data:HashObject):NewFteCondition
	{
		var cond:NewFteCondition = new NewFteConditionMenu(data);
		cond.ParseJson(data);
		return cond;
	}
}

public class ConditionTabIndexFactory implements IConditionBaseFactory
{
	public function CreateCondition(data:HashObject):NewFteCondition
	{
		var cond:NewFteCondition = new NewFteConditionTabIndex(data);
		cond.ParseJson(data);
		return cond;
	}
}