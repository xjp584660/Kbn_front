#pragma strict
import System.Collections;
import System.Collections.Generic;
import JasonReflection;

class NewFteRewards
{
	public var gems:int;
	public var gameMoneys:int;
	
	public var exps:int;
	
	class ItemData
	{
		@JasonDataAttribute("ItemId")
		public var itemId:int;
		
		public var itemType:int;
		
		@JasonDataAttribute("ItemCount")
		public var itemCount:int;
	}
	
	public class GearData
	{
		@JasonDataAttribute("GearId")
		public var gearId:int;
		@JasonDataAttribute("GearCount")
		public var gearCount:int;

		@JasonDataAttribute("GearStarLevel")
		public var gearStarLevel:int;
		@JasonDataAttribute("GearSkillLevel")
		public var gearSkillLevel:int;
		@JasonDataAttribute("GearTierLevel")
		public var gearTierLevel:int;
		
		@JasonDataAttribute("GearPlayerId")
		public var gearPlayerId:int = -1;

		@JasonDataAttribute("GearSkill")
		public var skillIds:int[];
	}
	
	class KnightData
	{
		public var knightId:int;
		public var knightLevel:int;
	}
	
	public var itemDatas:List.<ItemData> = null;
	public var gearDatas:List.<GearData> = null;
	public var knightDatas:List.<KnightData> = null;
	
	public static function BuildFromJson(jsonString:String):NewFteRewards
	{
		var hashObject:HashObject = JSONParse.defaultInst().Parse(jsonString); 
		if (null == hashObject) return null;
		
		return BuildFromJson(hashObject);
	}
	
	public static function BuildFromJson(jsonData:HashObject):NewFteRewards
	{
		if (null == jsonData) return null;
		
		var result:NewFteRewards = new NewFteRewards();
		result.ParseJson(jsonData);
		
		return result;
	}
	
	private function ParseJson(jsonData:HashObject)
	{
		gems = 0;
		gameMoneys = 0;
		exps = 0;
		
		// Parse the data
		if (null != jsonData[NewFteConstants.RewardsKey.Items])
		{
			itemDatas = new List.<ItemData>();
			var tItems:Array = _Global.GetObjectValues(jsonData[NewFteConstants.RewardsKey.Items]);
			for (var obj:HashObject in tItems)
			{
				var tItemData:ItemData = new ItemData();
				tItemData.itemId = _Global.INT32(obj[NewFteConstants.RewardsKey.ItemId]);
				tItemData.itemCount = _Global.INT32(obj[NewFteConstants.RewardsKey.ItemCount]);
				
				itemDatas.Add(tItemData);
			}
		}
		
		if (null != jsonData[NewFteConstants.RewardsKey.Gears])
		{
			gearDatas = new List.<GearData>();
			var tGears:Array = _Global.GetObjectValues(jsonData[NewFteConstants.RewardsKey.Gears]);
			for (var obj:HashObject in tGears)
			{
				var tGearData:GearData = new GearData();
				JasonConvertHelper.ParseToObjectOnce(tGearData, obj);
				
				tGearData.gearId = _Global.INT32(obj[NewFteConstants.RewardsKey.GearId]);
				tGearData.gearCount = _Global.INT32(obj[NewFteConstants.RewardsKey.GearCount]);
				tGearData.gearStarLevel = _Global.INT32(obj[NewFteConstants.RewardsKey.GearStarLevel]);
				tGearData.gearSkillLevel = _Global.INT32(obj[NewFteConstants.RewardsKey.GearSkillLevel]);
				tGearData.gearTierLevel = _Global.INT32(obj[NewFteConstants.RewardsKey.GearTierLevel]);
				
				tGearData.skillIds = new int[4];
				tGearData.skillIds[0] = _Global.INT32(obj[NewFteConstants.RewardsKey.GearSkill1]);
				tGearData.skillIds[1] = _Global.INT32(obj[NewFteConstants.RewardsKey.GearSkill2]);
				tGearData.skillIds[2] = _Global.INT32(obj[NewFteConstants.RewardsKey.GearSkill3]);
				tGearData.skillIds[3] = _Global.INT32(obj[NewFteConstants.RewardsKey.GearSkill4]);
				
				gearDatas.Add(tGearData);
			}
		}
		
		if (null != jsonData[NewFteConstants.RewardsKey.Knights])
		{
			knightDatas = new List.<KnightData>();
			
			var tKnights:Array = _Global.GetObjectValues(jsonData[NewFteConstants.RewardsKey.Knights]);
			for (var obj:HashObject in tKnights)
			{
				var tKnightData:KnightData = new KnightData();
				
				tKnightData.knightId = _Global.INT32(obj[NewFteConstants.RewardsKey.KnightId]);
				tKnightData.knightLevel = _Global.INT32(obj[NewFteConstants.RewardsKey.KnightLevel]);
				
				knightDatas.Add(tKnightData);
			}
		}
	}
	
	// private static var fakeItemUniqId:int = 1;
	// public static function FakeItem(itemData:ItemData):MyItems
	// {
	// 	var newItem:InventoryInfo  = new InventoryInfo();
	// 	
	// 	newItem.id = itemData.itemId;
	// 	newItem.category = itemData.itemType;
	// 	newItem.quant = itemData.itemCount;
	// 	
	// 	return newItem;
	// }
	
	private static var fakeGearUniqId:int = -1000000000;
	public static function FakeGearArm(gearData:GearData):Arm
	{
		var gearId:int = gearData.gearId;
		var level:int = gearData.gearStarLevel;
		var skillLevel:int = gearData.gearSkillLevel;
		var tierLevel:int = gearData.gearTierLevel > 0 ? gearData.gearTierLevel : 1;
		
		var arm:Arm = new Arm();
		
		// First get it from gds
//		var armSeed:HashObject = GearGDS.instance().GetArmHashObject(gearId, level);
		
		if ( gearData.gearPlayerId != -1 )
			arm.PlayerID = gearData.gearPlayerId;
		else
			arm.PlayerID = fakeGearUniqId++;
		arm.GDSID = gearId;
		arm = FillArmSeed(arm, gearId, level, skillLevel, tierLevel);
		for (var j:int = 0; j < 4; j++)
		{
			var skill:ArmSkill = new ArmSkill();
			skill.mID = gearData.skillIds[j];
			skill.mPosition = j+1;
			skill.mStone = 0;
			arm.Skills[skill.Position] = skill;
		}
					
		return arm;
	}
	
	public static function FillArmSeed(arm:Arm, gearTypeId:int, starLevel:int, skillLevel:int, tierLevel:int):Arm
	{
		arm.TierLevel = tierLevel;
		arm.Picture = GameMain.GdsManager.GetGds.<KBN.GDS_Gear>().GetPic(gearTypeId,arm.TierLevel);
		arm.Rare = GameMain.GdsManager.GetGds.<KBN.GDS_Gear>().GetRare(gearTypeId);
		arm.Category = GameMain.GdsManager.GetGds.<KBN.GDS_Gear>().GetType(gearTypeId);
		arm.Attack = GameMain.GdsManager.GetGds.<KBN.GDS_Gear>().GetAttack(gearTypeId,starLevel,arm.TierLevel);
		arm.HP = GameMain.GdsManager.GetGds.<KBN.GDS_Gear>().GetLife(gearTypeId,starLevel,arm.TierLevel);
		arm.Locked = false;
		arm.StarLevel = starLevel;
		arm.TroopLimit = GameMain.GdsManager.GetGds.<KBN.GDS_Gear>().GetTroop(gearTypeId,starLevel);
		arm.SkillLevel = skillLevel;
		arm.Experence = GameMain.GdsManager.GetGds.<KBN.GDS_Gear>().GetExperence(gearTypeId,starLevel);
		arm.ToExperence = GameMain.GdsManager.GetGds.<KBN.GDS_Gear>().GetToExperence(gearTypeId,arm.TierLevel);
		arm.KnightID = 0;
		arm.Status = 0;
		
		return arm;
	}
	
	// Fake a knight or general and insert into seed
	public static function FakeKnight(knightData:KnightData):HashObject
	{
		// var seed:HashObject = GameMain.instance().getSeed();
		var currCityId:int = GameMain.instance().getCurCityId();
		
		var knightObj:HashObject = new HashObject();
		knightObj["cityId"] = new HashObject(currCityId + "");
		knightObj["knightId"] = new HashObject(knightData.knightId + "");
		knightObj["knightName"] = new HashObject(1 + "");
		
		knightObj["knightLevel"] = new HashObject(knightData.knightLevel + "");
		
		var oldExpMax:int = 0;
		// var max:int = knightData.knightLevel * 20;
		for ( var i:int = 1; i < knightData.knightLevel; i ++ )
		{
			oldExpMax += i * 20;
		}
		var currExp:int = oldExpMax;
		
		knightObj["experience"] = new HashObject(currExp + "");
		knightObj["knightEnergy"] = new HashObject(100 + "");
		knightObj["knightStatus"] = new HashObject(1 + "");
		
		return knightObj;
	}
}
