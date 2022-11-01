class TroopMgr
{
	private	static	var	singleton:TroopMgr;
	private var LV:String;
	private var YourLv:String;
	private var Population:String;
	
	public	static	function	instance()
	{
		if( singleton == null )
		{
			singleton = new TroopMgr();
			singleton.init();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public	function	init()
	{
		Population = Datas.getArString("Common.Population");
		LV =  Datas.getArString("Common.Lv") ;
		YourLv = Datas.getArString("Common.YourLevel");
	}
	
	public function GetPlayerLvReq(data:HashObject):Requirement
	{
		var seed:HashObject = GameMain.instance().getSeed();
		var requiredPlayerLevel:int = 0;
		var req:Requirement = null;
		var currentPlayerLevel:int = _Global.INT32(seed["player"]["title"]);
		if(data!=null && data["r11"]!=null)
		{
			requiredPlayerLevel = _Global.INT32(data["r11"]);
		}
		if (requiredPlayerLevel > 0)
		 { // don't show level 0 requirements
			req = new Requirement();
			req.type = 	YourLv;
			req.required = LV + " " + requiredPlayerLevel;
			req.own = LV + " " + currentPlayerLevel;
			req.ok = currentPlayerLevel >= requiredPlayerLevel;		
		} // END player LEVEL requirement
		
		return req;	
	}
	
	public function GetCostPopulationReq(data:HashObject):Requirement
	{
		var reqPopulation:int = 0;
		var req:Requirement = null;
		var curPopulation:int = Resource.instance().populationIdle(GameMain.instance().getCurCityId());
		if(data!=null && data["a5"] != null)
		{
			reqPopulation = _Global.INT32(data["a5"]);
			if (reqPopulation > 0)
			{
				req = new Requirement();
				req.type = 	Population;
				req.required = _Global.NumFormat(reqPopulation);
				req.own = _Global.NumOnlyToMillion(curPopulation);
				req.ok = curPopulation >= reqPopulation;	
			}
		}
		return req;	
	}
	
	public function GetBuildingReq(data:HashObject):Array
	{
		var seed:HashObject = GameMain.instance().getSeed();
		var	retArr:Array = new Array();
		var req:Requirement;
		var reqLv:int = 0;
		var curLv:int = 0;
		
		if(data!=null)
		{
			var buildReqKeys:Array = _Global.GetObjectKeys(data);
			var key:String;
			var reqBuildTypeId:int = 0;
			
			for(var i:int=0;i<buildReqKeys.length;i++)
			{
				key = _Global.GetString(buildReqKeys[i]);
				if(key.StartsWith("r1_"))
				{
					reqBuildTypeId = _Global.INT32(key.Substring(3));
					reqLv = _Global.INT32(data[key]);
					if(reqLv > 0)
					{
						curLv = Building.instance().getMaxLevelForType(reqBuildTypeId, GameMain.instance().getCurCityId());
						var reqPrestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(reqBuildTypeId,reqLv);
						var curPrestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(reqBuildTypeId,curLv);
						req = new Requirement();
						req.type = Datas.getArString("buildingName."+"b" + reqBuildTypeId);
						req.reqPrestige = _Global.INT32(reqPrestigeData["prestige"]);
						req.ownPrestige = _Global.INT32(curPrestigeData["prestige"]);
						req.required = LV + " " + _Global.INT32(reqPrestigeData["level"]);
						req.own = LV + " " + _Global.INT32(curPrestigeData["level"]);
						req.ok = curLv >= reqLv;
						retArr.Push(req);
					}
				}
			}
		}
		return retArr;
	}
	
	public function GetTechReq(data:HashObject):Array
	{
		var seed:HashObject = GameMain.instance().getSeed();
		var	retArr:Array = new Array();
		var req:Requirement;
		var reqLv:int = 0;
		var curLv:int = 0;
		
		if(data!=null)
		{
			var techReqKeys:Array = _Global.GetObjectKeys(data);
			var key:String;
			var reqTechId:int = 0;
			
			for(var i:int=0;i<techReqKeys.length;i++)
			{
				key = _Global.GetString(techReqKeys[i]);
				if(key.StartsWith("r2_"))
				{
					reqTechId = _Global.INT32(key.Substring(3));
					reqLv = _Global.INT32(data[key]);
					if(reqLv > 0)
					{
						curLv =  Research.instance().getMaxLevelForType(reqTechId);
						req = new Requirement();
						req.type = Datas.getArString("techName."+"t" + reqTechId);
						req.required = LV + " " + reqLv;
						req.own = LV + " " + curLv;
						req.ok = curLv >= reqLv;
						retArr.Push(req);
					}
				}
			}
		}
		return retArr;
	}
	
	public function GetCostResReq(troopType:String,troopId:int):Array
	{
		var costData:HashObject = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetCostData(troopType,troopId);
		var seed:HashObject = GameMain.instance().getSeed();
		var	retArr:Array = new Array();
		var req:Requirement;
		var reqNum:long = 0;
		var curNum:long = 0;
		
		if(costData!=null)
		{
			var techReqStr:String;
			var reqTechId:int = 0;
			
			for(var i:int=0;i<8;i++)
			{
				if(i==5 || i==6) continue;
				if(costData[_Global.ap+i] != null)
				{
					reqNum = _Global.INT64(costData[_Global.ap+i]);
					var saleData:HashObject = GameMain.instance().getResSaleForTrainTroop(troopType,troopId,i);
					var remainder:int = 0;
					if(saleData != null)
					{
						remainder = reqNum*_Global.INT32(saleData["Numerator"])%_Global.INT32(saleData["Denominator"]);
						reqNum = reqNum*_Global.INT32(saleData["Numerator"])/_Global.INT32(saleData["Denominator"]);
						if(remainder != 0) reqNum++;
					}
					reqNum = reqNum / (1 + Technology.instance().getReduceTrainTroopResConsume());
					reqNum = _Global.CeilToInt(reqNum);
					if(reqNum > 0)
					{
						curNum =  Resource.instance().getCountForType(i, GameMain.instance().getCurCityId());
						req = new Requirement();
						req.type = Datas.getArString("ResourceName."+_Global.ap +i);
						req.typeId = i;
						req.required = _Global.NumFormat(reqNum);
						req.own = _Global.NumOnlyToMillion (curNum);
						req.ok = curNum >= reqNum;
						if(saleData != null)
						{
							req.bSale = true;
						}
						retArr.Push(req);
					}
				}
			}
		}
		return retArr;
	}
	
	public function GetItemsReq(data:HashObject):Array
	{
		var seed:HashObject = GameMain.instance().getSeed();
		var	retArr:Array = new Array();
		var req:Requirement;
		var reqItemId:int;
		var reqNum:long = 0;
		var curNum:long = 0;
		
		if(data!=null)
		{
			var itemKeys:Array = _Global.GetObjectKeys(data);
			var key:String;
			
			for(var i:int=0;i<itemKeys.length;i++)
			{
				key = _Global.GetString(itemKeys[i]);
				if(key.StartsWith("r8_"))
				{
					reqItemId = _Global.INT32(key.Substring(3));
					reqNum = _Global.INT64(data[key]);
					if(reqNum > 0)
					{
						curNum = MyItems.instance().countForItem(reqItemId);
						req = new Requirement();
						req.type = Datas.getArString("itemName.i" + reqItemId);
						req.required = reqNum.ToString();
						req.own = _Global.NumOnlyToMillion(curNum);
						req.ok = curNum >= reqNum;
						retArr.Push(req);
					}
				}
			}
		}
		return retArr;
	}
	
	public function GetTroopsReqs(troopType:String,troopId:int):Array
	{
		var reqData:HashObject = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetRequirementData(troopType,troopId);
		var seed:HashObject = GameMain.instance().getSeed();
		var	retArr:Array = new Array();
		var req:Requirement;
		var reqTroopId:int;
		var reqNum:long = 0;
		var curNum:long = 0;
		
		if(reqData!=null)
		{
			var troopKeys:Array = _Global.GetObjectKeys(reqData);
			var key:String;
			
			for(var i:int=0;i<troopKeys.length;i++)
			{
				key = _Global.GetString(troopKeys[i]);
				if(key.StartsWith("r20_"))
				{
					reqTroopId = _Global.INT32(key.Substring(4));
					reqNum = _Global.INT64(reqData[key]);
					
					var saleData:HashObject = GameMain.instance().getTroopSaleForTrainTroop(troopType,troopId);
					var remainder:int = 0;
					if(saleData != null)
					{
						remainder = reqNum*_Global.INT32(saleData["Numerator"])%_Global.INT32(saleData["Denominator"]);
						reqNum = reqNum*_Global.INT32(saleData["Numerator"])/_Global.INT32(saleData["Denominator"]);
						if(remainder != 0) reqNum++;
					}
					
					if(reqNum > 0)
					{
						req = new Requirement();
						if(troopType == Constant.TroopType.UNITS)
						{
							curNum = Barracks.instance().getUnitCountForType(reqTroopId,GameMain.instance().getCurCityId());
							req.type = Datas.getArString("unitName."+"u" + reqTroopId);
						}
						else
						{
							curNum = Walls.instance().getUnitCountForType(reqTroopId);
							req.type = Datas.getArString("fortName."+"f" + reqTroopId);
						}
						
						req.required = reqNum.ToString();
						req.own = _Global.NumOnlyToMillion(curNum);
						req.ok = curNum >= reqNum;
						if(saleData != null)
						{
							req.bSale = true;
						}
						retArr.Push(req);
					}
				}
			}
		}
		return retArr;
	}
	
	public function GetTrainAllReqs(troopType:String,troopId:int):Array
	{
		var reqData:HashObject = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetRequirementData(troopType,troopId);
		var costData:HashObject = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetCostData(troopType,troopId);
		
		var	retArr:Array = new Array();
		var buildingReqArr:Array;
		var techReqArr:Array;
		var itemReqArr:Array;
		var costReqArr:Array;
		var troopReqArr:Array;
		var req:Requirement;
		var i:int=0;
		//Player Level Req
		req = GetPlayerLvReq(reqData);
		if(req != null) 
			retArr.Push(req);
		//Population Req
		req = GetCostPopulationReq(costData);
		if(req != null)
			retArr.Push(req);
		//Building Req
		buildingReqArr = GetBuildingReq(reqData);
		for(i=0;i<buildingReqArr.length;i++)
		{
			req = buildingReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Push(req);
		}
		
		//Tech Req
		techReqArr = GetTechReq(reqData);
		for(i=0;i<techReqArr.length;i++)
		{
			req = techReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Push(req);
		}
		
		//Resource
		costReqArr = GetCostResReq(troopType,troopId);
		for(i=0;i<costReqArr.length;i++)
		{
			req = costReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Push(req);
		}
		
		//Items Req
		itemReqArr = GetItemsReq(reqData);
		for(i=0;i<itemReqArr.length;i++)
		{
			req = itemReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Push(req);
		}
		
		//troop Req
		troopReqArr = GetTroopsReqs(troopType,troopId);
		for(i=0;i<troopReqArr.length;i++)
		{
			req = troopReqArr[i] as Requirement;
			if(req !=null) 
				retArr.Push(req);
		}
		return retArr;
		
	}
	
	//temporarily,because c# function can not call js function.
	public function GetLevelMight(_levelID:int):long
	{
		var gdsPveLevelInfo : KBN.DataTable.PveLevel = GameMain.GdsManager.GetGds.<KBN.GDS_PveLevel>().GetItemById(_levelID);

		if(gdsPveLevelInfo==null)
		{
			return 0;
		}

		var gdsPveBossInfo : KBN.DataTable.PveBoss = GameMain.GdsManager.GetGds.<KBN.GDS_PveBoss>().GetItemById (gdsPveLevelInfo.BOSS_ID);
		if(gdsPveBossInfo==null)
		{
			return 0;
		}
		var totalMight : long = 0;
		var unitNums:Array = gdsPveBossInfo.UINT.Split ("*"[0]);
		
		for(var i:int=0;i<unitNums.length;i++)
		{
			var unitMight:int = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetTroopMight(Constant.TroopType.UNITS, i+1);
			var thisNum:long = _Global.INT64(unitNums[i]);
			totalMight += unitMight*thisNum;
		}
		
		return totalMight;
	}
	
}