//import System.Reflection;

public class	Utility extends KBN.Utility
{
	//private	static	var	singleton:Utility;
	//private var	seed:HashObject;
	
	//private var LV:String;
	//private var YourLv:String;
	//private var Population:String;
	//private var resourceToGems:float = 0;
	
	public	static	function	instance() : Utility{
		if( singleton == null ){
			singleton = new Utility();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}

	public static function areRequimentsAllOk(requirements:Array):boolean
	{
		var req_ok :boolean = true;
		var idata:Requirement;
		
		for(var i:int=0; i<requirements.length; i++)			
		{
			idata = requirements[i] as Requirement;
			if(idata.ok != true  && idata.ok != 'true')
			{
				req_ok = false;		
				break;
			}
		}
	
		return req_ok;
	}

	public function SubResAndItemAfterCraftSuccess(recipeId:String):void
	{
		var curCityId:int = GameMain.instance().getCurCityId();
		var recipeData:HashObject = Datas.instance().getOneRecipe(recipeId);
		if(recipeData == null) return;
		var	resourceRequirement:int;
		var i:int;
		for (i = 1; i <= 4; i++) 
		{ //sub resources
			resourceRequirement = _Global.INT32(recipeData["cost"][_Global.ap + i]);
			if (resourceRequirement > 0) 
			{
				Resource.instance().addToSeed(i,-resourceRequirement,curCityId);
			}
		}
		Resource.instance().UpdateRecInfo();
		
		//sub items
		var tempArray:Array = _Global.GetObjectValues(recipeData["costItem"]);
		var costItem:HashObject = null;
		var needNum:int;
		for(i=0;i<tempArray.length;i++)
		{
			costItem = tempArray[i] as HashObject;
			if(costItem != null)
			{
				needNum = _Global.INT32(costItem["num"]);
				MyItems.instance().subtractItem(_Global.INT32(costItem["id"]),needNum);
			}
		}
		
	}

	public function checkRecipeStudyReq(recipeId:String):Requirement[]
	{
		var recipeData:HashObject = Datas.instance().getOneRecipe(recipeId);
		if(recipeData["studyReq"] == null) return null;
		var	retArr:Array = new Array();
		var req:Requirement;
		
		var	requiredPlayerLevel:int = 0;
		var currentPlayerLevel:int = _Global.INT32(seed["player"]["title"]);
		var	playerLevelRequirement:HashObject;
		if(recipeData["studyReq"]["r11"])
		{
			playerLevelRequirement = recipeData["studyReq"]["r11"];
		}
		// START player LEVEL requirement
		if (playerLevelRequirement != null) 
		{
			requiredPlayerLevel = _Global.INT32(playerLevelRequirement["p2"]);
		}
		if (requiredPlayerLevel > 0) { // don't show level 0 requirements
			req = new Requirement();
			req.type = 	YourLv;	//Constant.CommonString1;
			req.required = LV + " " + requiredPlayerLevel;
			req.own = LV + " " + currentPlayerLevel;
			req.ok = currentPlayerLevel >= requiredPlayerLevel;
			retArr.Push(req);
			
		}
		 // END player LEVEL requirement
		 
		 // START check building req
		var currentBuildingLevel:int;
		var	requiredBuildingLevel:int = 0;
		var	buildingsReq:HashObject;
		if(recipeData["studyReq"]["r1"] != null)
		{
			buildingsReq = recipeData["studyReq"]["r1"];
		}
		var buildingTypeId:int;
		var i:int;
		if(buildingsReq != null)
		{
			if (buildingsReq.Table.Count != 0) 
			{ //HAS BUILDING REQS
				
				var buildingKeys = _Global.GetObjectKeys(buildingsReq); // e.g. ['b0', 'b1']
				for (i = 0; i < buildingKeys.length; i++) 
				{ //check reqs
					requiredBuildingLevel = 0; //reset
					buildingTypeId = _Global.INT32((buildingKeys[i] as String).Split("b"[0])[1]);
					currentBuildingLevel = Building.instance().getMaxLevelForType(buildingTypeId, GameMain.instance().getCurCityId());
					requiredBuildingLevel = _Global.INT32(buildingsReq[buildingKeys[i]]);
					
					var reqPrestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingTypeId,requiredBuildingLevel);
					var curPrestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingTypeId,currentBuildingLevel);
					
					if (requiredBuildingLevel > 0) 
					{ // don't show level 0 requirements
						req = new Requirement();
						req.type = Datas.getArString("buildingName."+"b" + buildingTypeId);
						req.reqPrestige = _Global.INT32(reqPrestigeData["prestige"]);
						req.ownPrestige = _Global.INT32(curPrestigeData["prestige"]);
						req.required = LV + " " + _Global.INT32(reqPrestigeData["level"]);
						req.own = LV + " " + _Global.INT32(curPrestigeData["level"]);
						req.ok = currentBuildingLevel >= requiredBuildingLevel;
						retArr.Push(req);
					}
				}
			}
		}
		//END check building req
		
		//START check tech req
		
		var requiredTechnologyLevel:int = 0;
		var	technologies:HashObject;
		if(recipeData["studyReq"]["r2"] != null)
		{
			technologies = recipeData["studyReq"]["r2"];
		}
		var technologyId:int;
		var	currentTechnologyLevel:int;
		if(technologies != null)
		{
			if (technologies.Table.Count != 0)  //HAS TECH REQS
			{
				var technologiesKeys = _Global.GetObjectKeys(technologies); // e.g. ['t0', 't1']
				for (i = 0; i < technologiesKeys.length; i++)  //check reqs
				{
					requiredTechnologyLevel = 0; //reset
					technologyId = _Global.INT32((technologiesKeys[i] as String).Split("t"[0])[1]);	//[_Global.ap + 1]);
					currentTechnologyLevel = Research.instance().getMaxLevelForType(technologyId);
					requiredTechnologyLevel = _Global.INT32(technologies[technologiesKeys[i]]);
					if (requiredTechnologyLevel > 0)  // don't show level 0 requirements
					{
						req = new Requirement();
						req.type = Datas.getArString("techName."+"t" + technologyId);
						req.required = LV + " " + requiredTechnologyLevel;
						req.own = LV + " " + currentTechnologyLevel;
						req.ok = currentTechnologyLevel >= requiredTechnologyLevel;
						retArr.Push(req);
					}
				}
			} //END check tech req
		}
		var reqItems:Array;
		if(recipeData["studyCostItem"] != null)
		{
			reqItems = _Global.GetObjectValues(recipeData["studyCostItem"]);
		}
		var item:HashObject;
		var itemId:int;
		var needNum:int;
		var hasNum:int;
		if(reqItems != null)
		{
			for(i=0;i<reqItems.length;i++)
			{
				item = reqItems[i] as HashObject;
				if(item != null)
				{
					itemId = _Global.INT32(item["id"]);
					needNum = _Global.INT32(item["num"]);
					hasNum = MyItems.instance().countForItem(itemId);
					req = new Requirement();
					req.type = Datas.getArString("itemName.i" + itemId);
					req.required = "" + needNum;
					req.own = _Global.NumOnlyToMillion(hasNum);
					req.ok = hasNum >= needNum;
					
					retArr.Push(req);
				}
			}
		}
		return retArr.ToBuiltin(typeof(Requirement));
	}
	
	public	function getCraftCostRes(recipeId:String):String
	{
		var retStr:String = null;
		var recipeData:HashObject = Datas.instance().getOneRecipe(recipeId);
		//var tempArray:Array = _Global.GetObjectValues(recipeData["cost"]);
		
		var	resourceRequirement:long;
		var	resourceCount:long;
		for (var i:int = 1; i <= 4; i++) 
		{ //check resources
			
			resourceRequirement = _Global.INT64(recipeData["cost"][_Global.ap + i]);
			resourceCount = Resource.instance().getCountForTypeInSeed(i,GameMain.instance().getCurCityId());
			if (resourceRequirement > 0) 
			{
				retStr = resourceRequirement + " " + Datas.getArString("ResourceName." + _Global.ap + i);
				return retStr;
			}
		}
		return retStr;
	}
	
	public function isCraftCostResEnough(recipeId:String):boolean
	{
		var bRet:boolean = true;
		var recipeData:HashObject = Datas.instance().getOneRecipe(recipeId);
		//var tempArray:Array = _Global.GetObjectValues(recipeData["cost"]);
		
		var	resourceRequirement:long;
		var	resourceCount:long;
		for (var i:int = 1; i <= 4; i++) 
		{ //check resources
			resourceRequirement = _Global.INT64(recipeData["cost"][_Global.ap + i]);
			resourceCount = Resource.instance().getCountForTypeInSeed(i,GameMain.instance().getCurCityId());
			if (resourceRequirement > 0) 
			{
				if(resourceCount < resourceRequirement)
				{
					bRet = false;
					break;
				}
			}
		}
		return bRet;
	}
	
	//public function isCraftCostItemsEnough(recipeId:String):boolean
	//{
	//	var bRet:boolean = true;
	//	var recipeData:HashObject = Datas.instance().getOneRecipe(recipeId);
	//	var tempArray:Array = _Global.GetObjectValues(recipeData["costItem"]);
	//	var costItem:HashObject = null;
	//	var needNum:int;
	//	var hasNum:int;
	//	for(var i:int=0;i<tempArray.length;i++)
	//	{
	//		costItem = tempArray[i] as HashObject;
	//		if(costItem != null)
	//		{
	//			needNum = _Global.INT32(costItem["num"]);
	//			hasNum = MyItems.instance().countForItem(_Global.INT32(costItem["id"]));
	//			if(hasNum <  needNum)
	//			{
	//				bRet = false;
	//				break;
	//			}
	//		}
	//	}
	//	return bRet;
	//}
	
	/*** START checkreq ***/
	// Checks requirements for a resrouce, determining whether or not it can be built.
	// type: 't', 'b', 'u', f' (technology, building, unit, fortification)
	// [[name1, name2], [req1, req2], [has1, has2], [complete1, complete2]]
	public	function checkreq(type:String, targetId:int, targetLevel:int) :Requirement[]{
	
		var typeData:HashObject;
		switch (type) {
			case "t":
				typeData = Datas.instance().researchData();
				break;
			case "b":
				return Building.instance().getBuildReqs(targetId,targetLevel).ToArray();
			case "u":
				return TroopMgr.instance().GetTrainAllReqs(Constant.TroopType.UNITS,targetId).ToBuiltin(typeof(Requirement));
			case "f":
				return TroopMgr.instance().GetTrainAllReqs(Constant.TroopType.FORT,targetId).ToBuiltin(typeof(Requirement));
		}

	
		var	arStrings:Datas = Datas.instance();
		var mult:float = Mathf.Pow(2, (targetLevel - 1));
		var	returnarr:Array = new Array();
		var req:Requirement;
		
		var	requiredPlayerLevel:int = 0;
		var currentPlayerLevel:int = _Global.INT32(seed["player"]["title"]);
		var	playerLevelRequirement:HashObject = typeData[type + targetId]["r"]["r11"]["p2"];
	
		// START player LEVEL requirement
		if (playerLevelRequirement != null) {
			
			if (playerLevelRequirement[_Global.ap + 0].Value == 1) { // absolute
				requiredPlayerLevel = playerLevelRequirement[_Global.ap + 1].Value;
			} else { // relative
				requiredPlayerLevel = currentPlayerLevel + _Global.INT32(playerLevelRequirement[_Global.ap + 1]);
			}
			if (requiredPlayerLevel > 0) { // don't show level 0 requirements
				req = new Requirement();
				req.type = 	YourLv;	//Constant.CommonString1;
				req.required = LV + " " + requiredPlayerLevel;
				req.own = LV + " " + currentPlayerLevel;
				req.ok = currentPlayerLevel >= requiredPlayerLevel;
				returnarr.Push(req);
				
			}
		} // END player LEVEL requirement
		
		
		// START check building req
		var currentBuildingLevel:int;
		var	requiredBuildingLevel:int = 0;
		var	buildings:HashObject = typeData[type + targetId]["r"]["r1"];
		
		var buildingTypeId:int;
		var i:int;
		if (buildings.Table.Count != 0) { //HAS BUILDING REQS
			
			var buildingKeys = _Global.GetObjectKeys(buildings); // e.g. ['b0', 'b1']
			for (i = 0; i < buildingKeys.length; i++) { //check reqs
				requiredBuildingLevel = 0; //reset
				buildingTypeId = _Global.INT32((buildingKeys[i] as String).Split("b"[0])[1]);
				currentBuildingLevel = Building.instance().getMaxLevelForType(buildingTypeId, GameMain.instance().getCurCityId());
				
				if (_Global.INT32(buildings[buildingKeys[i]][_Global.ap + 0]) == 1)
				{ // absolute
					requiredBuildingLevel = _Global.INT32(buildings[buildingKeys[i]][_Global.ap + 1]);
				} else { //relative
					requiredBuildingLevel = targetLevel + _Global.INT32(buildings[buildingKeys[i]][_Global.ap + 1]);
				}
				if (type === "t" && buildingTypeId == Constant.Building.ACADEMY) 
				{
					requiredBuildingLevel = Mathf.Max(requiredBuildingLevel, targetLevel);
				}
//				if(buildingTypeId == Constant.Building.PALACE&&targetLevel < 11)
//				{				
//					break;
//				}
				if(requiredBuildingLevel > 0)
				{
					currentBuildingLevel = Building.instance().getMaxLevelForType(buildingTypeId, GameMain.instance().getCurCityId());
					var reqPrestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingTypeId,requiredBuildingLevel);
					var curPrestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildingTypeId,currentBuildingLevel);
					req = new Requirement();
					req.type = Datas.getArString("buildingName."+"b" + buildingTypeId);
					req.reqPrestige = _Global.INT32(reqPrestigeData["prestige"]);
					req.ownPrestige = _Global.INT32(curPrestigeData["prestige"]);
					req.required = LV + " " + _Global.INT32(reqPrestigeData["level"]);
					req.own = LV + " " + _Global.INT32(curPrestigeData["level"]);
					req.ok = currentBuildingLevel >= requiredBuildingLevel;
					returnarr.Push(req);
				}			
			}
		} //END check building req
		
		//START check tech req TODO ..data error .no r.r2.t*?
		
		var requiredTechnologyLevel:int = 0;
		var	technologies:HashObject = typeData[type + targetId]["r"]["r2"];
		var technologyId:int;
		var	currentTechnologyLevel:int;
		if (technologies.Table.Count != 0)  //HAS TECH REQS
		{
			var technologiesKeys = _Global.GetObjectKeys(technologies); // e.g. ['t0', 't1']
			for (i = 0; i < technologiesKeys.length; i++)  //check reqs
			{
				requiredTechnologyLevel = 0; //reset
				technologyId = _Global.INT32((technologiesKeys[i] as String).Split("t"[0])[1]);	//[_Global.ap + 1]);
				currentTechnologyLevel = Research.instance().getMaxLevelForType(technologyId);
				
				if (_Global.INT32(technologies[technologiesKeys[i]][_Global.ap + 0]) == 1)  // absolute
				{
					requiredTechnologyLevel = _Global.INT32(technologies[technologiesKeys[i]][_Global.ap + 1]);
				}
				else
				{ //relative
					requiredTechnologyLevel = targetLevel + _Global.INT32(technologies[technologiesKeys[i]][_Global.ap + 1]);
				}
				if (requiredTechnologyLevel > 0)  // don't show level 0 requirements
				{
					req = new Requirement();
					req.type = arStrings.getArString("techName."+"t" + technologyId);
					req.required = LV + " " + requiredTechnologyLevel;
					req.own = LV + " " + currentTechnologyLevel;
					req.ok = currentTechnologyLevel >= requiredTechnologyLevel;
					returnarr.Push(req);
				}
			}
		} //END check tech req
		
		var multTen:float = Mathf.Pow(2, 9);
		var	resource:Resource = Resource.instance();
		var	softcurrencyCount:long = resource.getCountForType(Constant.ResourceType.GOLD, GameMain.instance().getCurCityId());
		var	softcurrencyRequirement:long;
		if(targetLevel > 10)
		{
		 	softcurrencyRequirement= _Global.INT32(typeData[type + targetId]["c"][_Global.ap + 0]) *  multTen * 100; 
		}
		else
		{
			softcurrencyRequirement= _Global.INT32(typeData[type + targetId]["c"][_Global.ap + 0]) * mult;
		}
		if (softcurrencyRequirement > 0) 
		{ //check gold
			req = new Requirement();
			req.type = arStrings.getArString("ResourceName."+_Global.ap + 0);
			req.typeId = Constant.ResourceType.GOLD;
			req.required = _Global.NumSimlify(softcurrencyRequirement);
			req.own = _Global.NumOnlyToMillion(softcurrencyCount);	;// "" + softcurrencyCount.ToString();
			req.ok = softcurrencyCount >= softcurrencyRequirement;
			returnarr.Push(req);
		}
		
		var	resourceRequirement:long;
		var	resourceCount:long;
		for (i = 1; i <= 4; i++) 
		{ //check resources
			if(targetLevel > 10)
			{
				resourceRequirement = _Global.INT32(typeData[type + targetId]["c"][_Global.ap +i]) * multTen * 100;
			}
			else
			{
				resourceRequirement = _Global.INT32(typeData[type + targetId]["c"][_Global.ap +i]) * mult;
			}
			resourceCount = resource.getCountForTypeInSeed(i,GameMain.instance().getCurCityId());
			if (resourceRequirement > 0) 
			{					
				req = new Requirement();
				req.type = arStrings.getArString("ResourceName."+_Global.ap +i);
				req.typeId = i;
				req.required = _Global.NumSimlify(resourceRequirement);
				req.own = _Global.NumOnlyToMillion (resourceCount);
				req.ok = resourceCount >= resourceRequirement;
				returnarr.Push(req);
			}
		}
		
		
		var carmotRequirement:long;
		carmotRequirement = _Global.INT32(typeData[type + targetId]["c"][_Global.ap + 7]) * 2000 ;
		var carmotCount = resource.getCountForTypeInSeed(7,GameMain.instance().getCurCityId());
		if(carmotRequirement > 0 && targetLevel > 10)
		{
			req = new Requirement();
			req.type = arStrings.getArString("ResourceName."+_Global.ap + 7);
			req.typeId = Constant.ResourceType.CARMOT;
			req.required = _Global.NumSimlify(carmotRequirement);
			req.own = _Global.NumOnlyToMillion (carmotCount);
			req.ok = carmotCount >= carmotRequirement;
			returnarr.Push(req);
		}
		
		
		
		//only type == "t"
		var	populationRequirement:long;
		populationRequirement = _Global.INT32(typeData[type + targetId]["c"][_Global.ap + 5]) * mult;
		var populationCount:int = resource.populationIdle(GameMain.instance().getCurCityId());
		if (populationRequirement > 0) { //check population
			req = new Requirement();
			req.type = Population;
			req.required = _Global.NumSimlify(populationRequirement);
			req.own = _Global.NumOnlyToMillion(populationCount);
			req.ok = populationCount >= populationRequirement;
			returnarr.Push(req);
		}
		
		
		var dummyRequirement:long = _Global.INT32(typeData[type + targetId]["c"][_Global.ap + 11]);
		var dummyId:int = 4123;
		var curDummy = MyItems.instance().countForItem(dummyId);
		if(dummyRequirement > 0 && targetLevel > 10)
		{
			req = new Requirement();
			req.type = Datas.getArString("itemName.i" + dummyId);
			req.required = "" + dummyRequirement;
			req.own = _Global.NumOnlyToMillion(curDummy);
			req.ok = curDummy >= dummyRequirement;
			returnarr.Push(req);
		}
		
		return returnarr.ToBuiltin(typeof(Requirement));
	}
	/*** END checkreq ***/
	
	//private function checkBuildNeedDI(btype:int):boolean
	//{
	//	//need to patch
	//	if(btype < Constant.Building.FARM || btype > Constant.Building.VILLA)
	//		return true;
	//	return false;
	//}
	
	private function priv_calBuildCostResToGems(requirements : System.Collections.Generic.IEnumerable.<Requirement>, curLevel:int,targetId:int):float
	{
		var	resourceRequirement:long = 0;
			
		//var idata:Requirement;
		//var i:int;

		var resourceToGems:float = 0;
		var R7GemsRate : float = _Global.FLOAT(GameMain.instance().getSeed()["r7togem"].Value);
		for ( var idata:Requirement in requirements )
		//for (i=0; i< requirements.length; i++)
		{
			//idata = requirements[i] as Requirement;
			for(var j:int = 0;j<=4;j++)
			{
				if(idata.type == Datas.instance().getArString("ResourceName."+_Global.ap + j))
					resourceRequirement += _Global.INT32(GameMain.GdsManager.GetGds.<GDS_Building>().getCostResource(targetId,curLevel,j));
			}
			if(idata.type == Datas.instance().getArString("ResourceName."+_Global.ap + 7)){
				resourceRequirement += _Global.INT32(GameMain.GdsManager.GetGds.<GDS_Building>().getCostResource(targetId,curLevel,7))*R7GemsRate;
			}
		}
		resourceToGems = resourceRequirement*55.0f/250000.0f;
		return 	resourceToGems>0?resourceToGems:0;
	}
	
	static public function CalcTotalResourceToGemsWithCost(costRes : int):int
	{
		var resourceToGems : int = costRes*55.0f/250000.0f;
		return resourceToGems>0?resourceToGems:0;
	}

	// Instantfinish Resources to Gems
	public function calResouceToGems(type:String, requirements : System.Collections.Generic.IEnumerable.<Requirement>,curLevel:int,targetId:int):float
	{
		if(!requirements )
			return;
		var typeData:HashObject;
		switch (type) {
			case "t":
				typeData = Datas.instance().researchData();
				break;
			case "b":
				return priv_calBuildCostResToGems(requirements,curLevel+1,targetId);
//			case "u":
//				typeData = Datas.instance().trainingData();
//				break;
//			case "f":
//				typeData = Datas.instance().fortifyingData();
//				break;
			default:
				return 0;
		}
		var	arStrings:Datas = Datas.instance();
		var	resource:Resource = Resource.instance();
		var mult:float = Mathf.Pow(2, curLevel);
		var multTen:float = Mathf.Pow(2,9);
		var	resourceRequirement:long = 0;
		var	resourceCount:long;
			
		
		//var item:RequireItem ;
		//var idata:Requirement;
		//var i:int;

		//var sum:int = requirements.length;
		//var resourceReq_ok:boolean = true;
		//for (i=0; i< sum; i++)
		for ( var idata:Requirement in requirements )
		{
			if(curLevel > 9)
			{
				for(var i:int = 0;i<=4;i++)
				{
					if(idata.type == arStrings.getArString("ResourceName."+_Global.ap + i))
						resourceRequirement += _Global.INT32(typeData[type + targetId]["c"][_Global.ap + i]) * multTen * 100;
				}
				if(idata.type == Datas.instance().getArString("ResourceName."+_Global.ap + 7))
				{
					resourceRequirement += _Global.INT32(typeData[type + targetId]["c"][_Global.ap + 7]) * 2000 * (_Global.FLOAT(GameMain.instance().getSeed()["r7togem"].Value));
				}
			}
			else
			{
				for(var j:int = 0;j<=4;j++)
				{
					if(idata.type == arStrings.getArString("ResourceName."+_Global.ap + j))
						resourceRequirement += _Global.INT32(typeData[type + targetId]["c"][_Global.ap +j]) * mult;
				}
			}	
			//if(idata.type == arStrings.getArString("Common.Population"))
			//{
				//resourceRequirement += _Global.INT32(typeData[type + targetId]["c"][_Global.ap +5]) * mult;
				//resourceCount = resource.populationIdle(GameMain.instance().getCurCityId());
			//}		
		}
		var resourceToGems : float = resourceRequirement*55.0f/250000.0f;
		return 	resourceToGems>0?resourceToGems:0;
	}
	
	//public  function checkInstantRequire(requirements:Array):boolean
	//{
	//	var item:RequireItem ;
	//	var idata:Requirement;
	//	var i:int;
	//	
	//	if(!requirements )
	//		return;
	//	var sn:int = requirements.length;

	//	for (i=0; i< sn; i++)
	//	{
	//		idata = requirements[i] as Requirement;
	//		
	//		if(idata.ok != true  && idata.ok != 'true' && !isResourceReq(idata))
	//		{
	//			return false;
	//		}
	//	}
	//	
	//	for (i=0; i< sn; i++)
	//	{
	//		idata = requirements[i] as Requirement;
	//		
	//		if(idata.ok != true  && idata.ok != 'true' && isResourceReq(idata))
	//		{
	//			return true;
	//		}
	//	}
	//	return false;
	//}
	
	//private function isResourceReq(param:Requirement):boolean
	//{
	//	var	arStrings:Datas = Datas.instance();
	//	for (var i:int = 0; i <= 4; i++) 
	//	{
	//		if(param.type == arStrings.getArString("ResourceName."+_Global.ap + i))
	//			return true;			
	//	}
//		if(param.type == arStrings.getArString("Common.Population"))
//			return true;
			
	//	return false;
	//}
	
	
	public function instantFinishPreQueue(element:QueueItem, gems:int, type:int):void
	{
		var tl : long = element.timeRemaining;
		var itemList : String;
		var price : int;
		if(type == SpeedUp.PLAYER_ACTION_TECHNOLOGYTREE)
		{
			price = SpeedUp.instance().getTechGemCost(tl);	
			itemList = SpeedUp.instance().getTechSpeedUpItemListString(tl);
		}
		else
		{
		 	price = SpeedUp.instance().getTotalGemCost(tl);		
		 	itemList = SpeedUp.instance().getItemListString(tl);
		}
		var BiType:int;
		var msg:String;
		switch(type)
		{
			case SpeedUp.PLAYER_ACTION_CONSTRUCT:
				BiType = 1;
				msg = Datas.getArString("BuildingModal.QueueFull");
				break;
				
			case SpeedUp.PLAYER_ACTION_RESEARCH:
				BiType = 2;
				msg = Datas.getArString("ResearchModal.QueueFull");
				break;
				
			case SpeedUp.PLAYER_ACTION_TECHNOLOGYTREE:
				BiType = 9;
				msg = Datas.getArString("TechModal.QueueFull");
				break;
			default:
				break;
		}
		InstantFinishEvent(tl, gems, msg, BiType, function(directBuyFlag : int, curPrice : int, paymentDat : Payment.PaymentElement)
		{
			SpeedUp.instance().useInstantSpeedUp(type, curPrice,itemList , element.id, directBuyFlag,(paymentDat == null)?"":paymentDat.price);
		});
	}

	public function InstantFinishEvent(totalTime:long, gems:int, msg:String, BiType : int, onOKCallback : function(int, int, Payment.PaymentElement) : void)
	{
		if(gems == 0)
		{
			return;
		}
		var dialogparam:Hashtable;
		var dialog:EventDoneDialog = MenuMgr.getInstance().getEventDoneDialog();
		dialog.SetExtraLabeTxtColor(FontColor.Button_White);
		var originalGems:long = Payment.instance().Gems;
		var _CurPrice:int;
		var _PayItem:Payment.PaymentElement;
		var splicTest:int = 1;
		var params:Array;
		
		if(seed["directbuyType"])
			splicTest = _Global.INT32(seed["directbuyType"]);
		
		dialog.setLayout(560,360);
		dialog.btnConfirm.rect = new Rect(83.8,230,386,85);
		dialog.btnConfirm.changeToGreenNew();
		dialog.setMsgLayout(68.6,100.1,450,120);			   
		dialog.setextraLabeLayout(84,220,380,70);
		dialog.setIconLayout(142.32,264.8,40.5,12.5);
		dialog.extraLabe.mystyle.imagePosition = ImagePosition.ImageLeft;
		dialog.extraLabe.mystyle.normal.textColor = Color(1.0, 1.0, 1.0, 1.0);
		dialog.extraLabe.image = TextureMgr.instance().LoadTexture("resource_icon_gems",TextureType.ICON);
		
		var price:int;
		if(BiType == 9)
		{
			price = SpeedUp.instance().getTechGemCost(totalTime);
		}
		else
		{
			price = SpeedUp.instance().getTotalGemCost(totalTime);
		}
		
		// have gems 
		var OnFinishPreBuilding:Function = function()
		{
			MenuMgr.getInstance().PopMenu("");
				onOKCallback(1, price, null);
				params = new Array();
				params.Add(price);
				params.Add(price);
				params.Add("");
				params.Add(1);
				UnityNet.SendDirectPaymentBI( Constant.PaymentBI.DirectGemsOpen, BiType, params);	
		};
		
		//no enough gems
		var OnFinishPreBuildingByPayment:Function = function()
		{
				//var price:int = SpeedUp.instance().getTotalGemCost(tl);
				onOKCallback(2, _CurPrice, _PayItem);
				
				_PayItem = null;
				//Payment.instance().SubtractGems(_CurPrice);
		};
		
		//pay
		var buyItem:Function = function()
		{
			if (_PayItem) 
			{		
				params = new Array();
				params.Add(price);
				params.Add(_CurPrice);
				params.Add(_PayItem.price);
				params.Add(2);
				UnityNet.SendDirectPaymentBI( Constant.PaymentBI.DirectDollaOpen, BiType, params);
			 	MenuMgr.getInstance().PopMenu("");
				Payment.instance().BuyItem(_PayItem,OnFinishPreBuildingByPayment);
			}
		};
		
		//popup directbuy menu
		var directBuy:Function = function()
		{
			_PayItem = Payment.instance().getDBProductIdByCurrency(_CurPrice);
			if (_PayItem) 
			{
				if(splicTest == 2 && gems > 10 && gems>_CurPrice)
				{
					dialog.btnConfirm.rect = new Rect(79,230,408,85);
					dialog.setextraLabeLayout(79,230,408,85);
					dialogparam = {"Msg":msg,
						   "btnTxt":" ",
						   "isShowCloseButton":true,
						   "btnHandler": buyItem,
						   "extraLabel":price + "    " + _PayItem.price + " " + Datas.instance().getArString("SpeedUp.BuyInstantFinish"),
						   "MainIcon":"Textures/UI/decoration/discount",
						   "isLineShown": false};
				}
				else
				{
					dialogparam = {"Msg":msg,
						   "btnTxt":" ",
						   "isShowCloseButton":true,
						   "btnHandler": buyItem,
						   "extraLabel":_PayItem.price + " " + Datas.instance().getArString("SpeedUp.BuyInstantFinish"),
						   "isLineShown": false};
					dialog.extraLabe.image = null;
					dialog.setextraLabeLayout(79,255,408,120);
				}
				
				MenuMgr.getInstance().PushEventDoneDialog(dialogparam);
				params = new Array();
				params.Add(price);
				params.Add(_CurPrice);
				params.Add(_PayItem.price);
				params.Add(2);
				UnityNet.SendDirectPaymentBI( Constant.PaymentBI.MenuOpen , BiType, params);
			}
			else
				MenuMgr.getInstance().PopMenu("");
		};
		
/*********************************** Logic part ****************************************************************/
		
		if(originalGems >= gems)
		{
			dialogparam = {"Msg":msg,
						   "btnTxt":" ",
						   "isShowCloseButton":true,
						   "btnHandler": OnFinishPreBuilding,
						   "extraLabel":gems + "    " + Datas.instance().getArString("SpeedUp.BuyInstantFinish"),
						   "isLineShown": false};
						   
			dialog.btnConfirm.rect = new Rect(84,212,386,85);			   
						   
			MenuMgr.getInstance().PushEventDoneDialog(dialogparam);
			params = new Array();
			params.Add(price);
			params.Add(price);
			params.Add("");
			params.Add(1);
			UnityNet.SendDirectPaymentBI( Constant.PaymentBI.MenuOpen , BiType, params );
		}
		else
		{
			if(splicTest == 1)
				_CurPrice = (gems + 9) / 10 * 10;
			else if(splicTest == 2)
			{
				_CurPrice = gems/ 10 * 10;
				if(_CurPrice == 0)
					_CurPrice = 10;
			}
				
//			if(gems >100)
//			{
				MenuMgr.getInstance().PushPaymentMenu();
//			}
//			else
//			{
//				var paymentItems:Array = Payment.instance().getitunesValideProducts();
//				
//				if(paymentItems && paymentItems.length > 0)
//				{
//					//Debug.LogWarning(" YYYYYYYYY  000000000");
//					directBuy();
//				}
//				else
//				{
//					//Debug.LogWarning(" YYYYYYYYY  11111111111");
//					Payment.instance().reqPaymentList(directBuy, null, true, true);
//				}
//			}
		}
	}
	
}
