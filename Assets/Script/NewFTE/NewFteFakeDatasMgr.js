#pragma strict

import System.Collections;
import System.Collections.Generic;

public class NewFteFakeDatasMgr
{
	private static var instance:NewFteFakeDatasMgr = null;
	private function NewFteFakeDatasMgr() {}
	
	public static function Instance():NewFteFakeDatasMgr
	{
		if (null == instance)
		{
			instance = new NewFteFakeDatasMgr();
			instance.Init();
			
			GameMain.instance().resgisterRestartFunc(function(){
				instance.Free();
				instance = null;
			});
		}
		
		return instance;
	}
	
	///----------------------------------------------------------------
	public function Init()
	{
		InitVariables();
	}
	
	private function Free()
	{
	}
	
	private function InitVariables()
	{
	}
	
	public function InitDataTransmits()
	{
		RegisterGeneralMenuTransimits();
		RegisterGearMenuTransimits();
		RegisterArmMenuTransimits();
	}
	
	private function RegisterGeneralMenuTransimits()
	{
		NewFteMgr.Instance().RegisterDataTransmit("GeneralMenu", typeof(NewFteConditionMenu), function(fteId:int, data:System.Object)
		{
			if (!GearSysController.IsOpenGearSys() || !GearSysController.IsGearSysUnlocked())
				return false;
			
			var transmitData:NewFteRewards = data as NewFteRewards;
			if (null == transmitData) return false;
			
			if (null != transmitData.knightDatas)
			{
				for (var i:int = 0; i < transmitData.knightDatas.Count; i++)
				{
					var knightObj:HashObject = NewFteRewards.FakeKnight(transmitData.knightDatas[i]);
					knightObj["belongFteId"] = new HashObject(fteId);
					
					General.instance().InsertFteKnight(knightObj);
				}
			}
			
			return true;
		});
	}
	
	private function RegisterGearMenuTransimits()
	{
		NewFteMgr.Instance().RegisterDataTransmit("GearMenu", typeof(NewFteConditionMenu), function(fteId:int, data:System.Object)
		{
			var transmitData:NewFteRewards = data as NewFteRewards;
			if (null == transmitData) return false;
			
			if (null != transmitData.gearDatas)
			{
				for (var i:int = 0; i < transmitData.gearDatas.Count; i++)
				{
					for (var iCount:int = 0; iCount < transmitData.gearDatas[i].gearCount; iCount++)
					{
						var arm:Arm = NewFteRewards.FakeGearArm(transmitData.gearDatas[i]);
						arm.belongFteId = fteId;
						
						GearManager.Instance().GearWeaponry.AddArm(arm);
					}
				} 
				
				if (null != transmitData.knightDatas)
				{
					for (var j:int = 0; j < transmitData.knightDatas.Count; j++)
					{
						var knightObj:HashObject = NewFteRewards.FakeKnight(transmitData.knightDatas[j]);
						knightObj["belongFteId"] = new HashObject(fteId);
						General.instance().InsertFteKnight(knightObj);
					}
				}
			}
			
			return true;
		});
	}
	
	private function RegisterArmMenuTransimits()
	{
		NewFteMgr.Instance().RegisterDataTransmit("ArmMenu", typeof(NewFteConditionMenu), function(fteId:int, data:System.Object)
		{
			var transmitData:NewFteRewards = data as NewFteRewards;
			if (null == transmitData) return false;
			
			if (null != transmitData.itemDatas)
			{
				for (var itemIndex:int = 0; itemIndex < transmitData.itemDatas.Count; itemIndex++)
				{
					MyItems.instance().AddFteFakeItem(transmitData.itemDatas[itemIndex].itemId, 
												transmitData.itemDatas[itemIndex].itemCount, fteId);
				}
			}
			
			if (null != transmitData.gearDatas)
			{
				for (var i:int = 0; i < transmitData.gearDatas.Count; i++)
				{
					for (var iCount:int = 0; iCount < transmitData.gearDatas[i].gearCount; iCount++)
					{
						var arm:Arm = NewFteRewards.FakeGearArm(transmitData.gearDatas[i]);
						arm.belongFteId = fteId;
						
						GearManager.Instance().GearWeaponry.AddArm(arm);
					}
				}
			}
			
			return true;
		});
	}
	
	public function TrimFteFakeDatas(fteId:int)
	{ 
		TrimFakeKnights(fteId);
		TrimFakeGears(fteId);
		
		var itemCategories:MyItems.Category[] = [MyItems.Category.General, MyItems.Category.Chest
									, MyItems.Category.TreasureChest, MyItems.Category.TreasureItem
									, MyItems.Category.EquipStrengthen];
		for (var cIndex:int = 0; cIndex < itemCategories.Length; cIndex++)
		{
			TrimFakeItems(fteId, itemCategories[cIndex]);
		}
	}

	private function TrimFakeKnights(fteId:int)
	{
		var itemList:Array = General.instance().getGenerals(); 
		
		var i:int = 0;
		var tmpRmList:Array = new Array();
		for (i = 0; i < itemList.Count; i++)
		{
			var item:HashObject = itemList[i] as HashObject; 
			if (null != item["belongFteId"])
			{
				var belongFteId:int = _Global.INT32(item["belongFteId"]);
				if (belongFteId == fteId)
					tmpRmList.Add(item);
			}
		} 
		for (i = 0; i < tmpRmList.Count; i++)
		{ 
			General.instance().RemoveFteKnight(tmpRmList[i]);
		} 
		tmpRmList.Clear();
		
		GearData.Instance().SetKnightSequence();
	}
	
	private function TrimFakeItems(fteId:int, itemCategory:int)
	{
		var itemList:System.Collections.Generic.List.<InventoryInfo> = MyItems.instance().GetList(itemCategory); 
		
		var i:int = 0;
		var tmpRmList:Array = new Array();
		for (i = 0; i < itemList.Count; i++)
		{
			var item:InventoryInfo = itemList[i] as InventoryInfo; 
			if (null != item && item.belongFteId == fteId)
			{ 
				item.belongFteId = -1;
				
				if (item.id == 42000)
				{
					MyItems.instance().subtractItem(item.id, item.fteFakeCount);
					item.quant -= item.fteFakeCount; 
					if (item.quant <= 0)
						tmpRmList.Add(item);
				}
				else
				{
					// No need subtractItem, because all is consumed
				}
			}
		} 
		for (i = 0; i < tmpRmList.Count; i++)
		{ 
			itemList.Remove(tmpRmList[i]);
		} 
		tmpRmList.Clear();
	}
	
	private function TrimFakeGears(fteId:int)
	{
		var itemList:List.<Arm> = GearManager.Instance().GearWeaponry.GetArms(); 
		
		var i:int = 0;
		var tmpRmList:Array = new Array();
		for (i = 0; i < itemList.Count; i++)
		{
			var item:Arm = itemList[i]; 
			if (null != item && item.belongFteId == fteId)
			{
				tmpRmList.Add(item);
			}
		} 
		for (i = 0; i < tmpRmList.Count; i++)
		{ 
			GearManager.Instance().GearWeaponry.RemoveArm(tmpRmList[i] as Arm);
		} 
		tmpRmList.Clear();
	}
}