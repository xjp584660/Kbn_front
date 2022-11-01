public class FTELocalServer extends KBN.FTELocalServer
{	
	public static function getInstance():FTELocalServer
	{
		if(!_instance)
		{
			_instance = new FTELocalServer();
			GameMain.instance().resgisterRestartFunc(function(){
				_instance = null;;
			});
		}
		return _instance as FTELocalServer;
	}
	
	public function setMgr(fmgr:KBN.FTEMgr):void
	{
		this.fmgr = fmgr;
	}	
	
	protected var fmgr:KBN.FTEMgr;
	protected var seed:HashObject;
	
	
	public function getSeed():HashObject
	{
		return seed;
	}
	
	public function firstInitSeed():int
	{
		return firstInitSeed(FTEConstant.Step.FTE_FIRST_STEP);
	}
	public function firstInitSeed(step:int):int
	{
		seed = GameMain.instance().getSeed();
		//var step:int = FTEConstant.Step.FTE_FIRST_STEP;
		var scene:int;
		while(step >= 0)
		{
			scene = fillSeedByStep(step);			
			if(step == fmgr.curStep)
				break;
			step = fmgr.getNextStepBy(step);			
		}
		if(step < 0)
		{
			//_Global.Log("FTE Error Config with Step: " + step);
		}
		this.readyForNextFTEModule(step/100);
		return scene;
	}
	
	public function doRequest(url:String,form:WWWForm):Object
	{
		var result :Object =  null;
		var baseUrl:String = UnityNet.getBaseURL();
		url = url.Substring(baseUrl.Length);		
		if(fmgr)
		{
			//_Global.Log("FTE HOOK  AT STEPID:" + fmgr.curStep + " WITH URL:" + url);
			result = handlerSeedByStep(fmgr.curStep,url,form);
		}
		else
		{
			//_Global.Log("FTE NOT INIT HOOK URL:" + url);
		}
		return result;
	}
	
	public function fillSeedByStep(step:int):int
	{
		var scene:int = GameMain.CITY_SCENCE_LEVEL;
		var seed:HashObject = GameMain.instance().getSeed();
		var cityId:int = GameMain.instance().getCurCityId();
		var ut:long = GameMain.unixtime();
		switch(step)
		{
			case FTEConstant.Step.FTE_FIRST_STEP:
					seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_Academy] = new HashObject(
					{
						_Global.ap + 0 : "" + Constant.Building.ACADEMY,
						_Global.ap + 1 : "1",
						_Global.ap + 2 : "" +FTEConstant.Data.Slot_Academy,
						_Global.ap + 3 : "0"
					});
					if( seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_Farm] == null)
					{
						seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_Farm] = new HashObject(
						{
							_Global.ap + 0 : "" + Constant.Building.FARM,
							_Global.ap + 1 : "1",
							_Global.ap + 2 : "" +FTEConstant.Data.Slot_Farm,
							_Global.ap + 3 : "0"
						});						 
					}
					
					Quests.instance().getReward(FTEConstant.Data.Quest_BuildAcademy_Id,null);
				break;
			case FTEConstant.Step.BUILD_HOUSE_COMPLETE:
				//TASK_1_CLICK_QUESTS
 				// build house complete. add a house. add Quest for Task1
				seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_House] = new HashObject(
				{
					_Global.ap + 0 : "" + Constant.Building.VILLA,
					_Global.ap + 1 : "1",
					_Global.ap + 2 : "" +FTEConstant.Data.Slot_House,
					_Global.ap + 3 : "0"
				});
				GameMain.instance().onBuildingFinish(FTEConstant.Data.Slot_House,Constant.Building.VILLA,1,0);
 				break;
 				
 			case FTEConstant.Step.TASK_1_CLICK_HOME:
 				// add Quest 1 Reward. 1051
 				Quests.instance().getReward(FTEConstant.Data.Quest_Comoplete_Id1,null);
 				break;
 				
 			case FTEConstant.Step.UP_BUILD_CLICK_FARM:
 				scene = GameMain.FIELD_SCENCE_LEVEL;
 				break; 			
 			
 			//case FTEConstant.Step.UP_BUILD_COMPLETE:
 			case FTEConstant.Step.TASK_2_CLICK_QUEST:
 				scene = GameMain.FIELD_SCENCE_LEVEL;
 				//  Upgrade Farm to LV 2. 
 				seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_Farm][_Global.ap + 1].Value = "2";
 				
 				break;
 			
 			case FTEConstant.Step.TASK_2_CLICK_HOME:
 				//Task2; add Quest & Rewards.
 				scene = GameMain.CITY_SCENCE_LEVEL;
 				Quests.instance().getReward(FTEConstant.Data.Quest_Comoplete_Id2,null);
 				break;

			case FTEConstant.Step.BUILD_ACADEMY_COMPLETE:
				// build academy
				seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_Academy] = new HashObject(
				{
					_Global.ap + 0 : "" + Constant.Building.ACADEMY,
					_Global.ap + 1 : "1",
					_Global.ap + 2 : "" +FTEConstant.Data.Slot_Academy,
					_Global.ap + 3 : "0"
				});				
				GameMain.instance().onBuildingFinish(FTEConstant.Data.Slot_Academy,Constant.Building.ACADEMY,1, 0);

				break;		
 			case FTEConstant.Step.UP_TECH_WAIT : 	 				
 				if(fmgr.curStep != FTEConstant.Step.SPEED_UP_OPEN)
 					break;
				var tobj:HashObject = new HashObject(	
					{
						_Global.ap + 0 : "" + Constant.Research.IRRIGATION,
						_Global.ap + 1 : "1",
						_Global.ap + 2 : "" + ut,
						_Global.ap + 3 : "" + (ut +FTEConstant.GetResearchTimes()), 
						_Global.ap + 4 : "0",
						_Global.ap + 5 : "" + FTEConstant.GetResearchTimes(),
						_Global.ap + 6 : ""
					});
					seed["queue_tch"]["city"+cityId][_Global.ap + 0] = tobj;
					Research.instance().init(seed);
								
 				break;		
 			case FTEConstant.Step.SPEED_UP_CLICK_INSTANT:
 				//seed set tech LV.			
 				seed["tech"]["tch" + Constant.Research.IRRIGATION].Value = "1";
 				Research.instance().updateAllTVO();
 				//claim
 				break;
 			case FTEConstant.Step.LEVEL_UP_OK:
//				seed["player"]["gems"] = "10";
 				seed["xp"]["lvl"].Value = "2"; 				 				
 				seed["player"]["title"].Value = 2;
 				Quests.instance().getReward(FTEConstant.Data.Quest_LeveUPId,null);
 				break; 			
 			
 			case FTEConstant.Step.ITEMS_CLICK_USE:
 				MyItems.instance().Use(FTEConstant.Data.Used_ItemId,false); 				 					 					 				
 				break; 			
 			case FTEConstant.Step.END_NPC_3:
 				Quests.instance().getReward(FTEConstant.Data.Quest_UseChestId,null);
				Quests.instance().getReward(FTEConstant.Data.Quest_ResearchId,null);
 				Quests.instance().getReward(FTEConstant.Data.Quest_Comoplete_Id2,null);
 				seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_Farm][_Global.ap + 1].Value = "2";
 				seed["tech"]["tch" + Constant.Research.IRRIGATION].Value = "1";
 				break;
			default:
				break;
		}		
		return scene;
	}
	
	public function readyForNextFTEModule(mid:int):void
	{
		//quest1, quest2, speedup, levelup,  useitem;
		var seed:HashObject = GameMain.instance().getSeed();
		var cityId:int = GameMain.instance().getCurCityId();
		var ut:long = GameMain.unixtime();
		switch(mid)
		{
			/***
			case FTEConstant.Module.BACKGROUND:
				break;
			case FTEConstant.Module.MAP	:
				break;
			case FTEConstant.Module.BUILD_HOUSE:
				break;					
			case FTEConstant.Module.TASK_1:				
				break;
			case FTEConstant.Module.VIEW_CHANGE:
				break;
					
			case FTEConstant.Module.UP_BUILD:
				break;
			**/				
			case FTEConstant.Module.TASK_2:
 				seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_Farm][_Global.ap + 2].Value = "2";

				break;			
			case FTEConstant.Module.BUILD_ACADEMY:
				break;
			case FTEConstant.Module.UP_TECH:
				break;
			case FTEConstant.Module.SPEED_UP:				
				break;
			
			case FTEConstant.Module.LEVEL_UP:
				//for level up.
				seed["xp"]["lvl"].Value = "2";
				
				break;
			case FTEConstant.Module.ITEMS:				
//				seed["items"]["i" + FTEConstant.Data.Used_ItemId] = "1";
//				MyItems.instance().AddItem(FTEConstant.Data.Used_ItemId);
				break;
			case FTEConstant.Module.END:				
				break;
		}
	}
	
	/*****/	
	protected function handlerSeedByStep(step:int,url:String,form:WWWForm):Object
	{
		var res:HashObject = null;
		var ut:long = GameMain.unixtime();
		switch(url)
		{
			case "construct.php":
				//buildID.
				var bid:long = 0;
				var lv:int = 0;
				var upgradeTime : int = FTEConstant.Data.Build_Time;
				if ( (step / 100 == 6) && FTEConstant.GetFteVersion() != 0 )
					upgradeTime = FTEConstant.Data.BuildUpgrade_Time;
				res = new HashObject(
				{
					"ok"		:true,
					"buildingId":bid,
					"timeNeeded":upgradeTime,
					"reqmicrotime":ut,
					"resmicrotime":ut					
				});
				break;

			case "research.php":
				res = new HashObject(
				{
					"ok"	:true,
					"techId":1,
					"timeNeeded": FTEConstant.GetResearchTimes(),
					"reqmicrotime":ut,
					"resmicrotime":ut,
					"help_cur":0,
					"help_max":0
				});
				break;
				
			case "quest.php":
				res = new HashObject(
				{
					"ok":true
					
				});
				break;
			case "speedupConstruction.php":
				res = new HashObject(
				{
					"ok":true
				});
				break;
			case "speedupResearch.php":
				res = new HashObject(
				{
					"ok":true
				});					
				break;
			case "speedupUseGems.php":
					res = new HashObject(
					{
						"ok":true
					});
				break;
				
			case "itemChest.php":
					res = new HashObject(
					{
						"ok"	:true,
						"items"	:
							{
								"i1"	:2,	
								"i2"	:1,							
								"i111"	:1,
								"i121"	:1,							
								"i131"	:1,								
								"i141"	:1,								
								"i922"	:1,								
								"i923"	:1
							}
					});
				break;
					
			case	"updateSeed.php":
				res = new HashObject(
					{
						"ok"	:false,
						"error_code" : "0"
					});
				break;
			case "showShop.php":
				res = new HashObject(
				{
					"ok":true,
					"data":
					{
						/*
						"shopOrder":{
									"599":{"origPrice":5},"351":{"origPrice":50},"355":{"origPrice":100},"401":{"origPrice":100},"911":{"origPrice":30},
									"912":{"origPrice":90},"922":{"origPrice":90},"923":{"origPrice":10},"9":{"origPrice":9},"1":{"origPrice":1},
									"2":{"origPrice":5},"3":{"origPrice":10},"4":{"origPrice":20},"5":{"origPrice":50},"6":{"origPrice":80},"7":{"origPrice":120},
									"261":{"origPrice":10},"262":{"origPrice":60},"271":{"origPrice":10},"272":{"origPrice":60},"361":{"origPrice":8},
									"362":{"origPrice":30},"363":{"origPrice":100},"901":{"origPrice":30},"1015":{"origPrice":10},"1025":{"origPrice":10},
									"1035":{"origPrice":10},"1045":{"origPrice":10},"111":{"origPrice":8},"112":{"origPrice":50},"121":{"origPrice":8},
									"122":{"origPrice":50},"131":{"origPrice":8},"132":{"origPrice":50},"141":{"origPrice":8},"142":{"origPrice":50},
									"101":{"origPrice":45},"102":{"origPrice":280},"10001":{"origPrice":305},"10002":{"origPrice":325},
									"10003":{"origPrice":350},"10007":{"origPrice":100},"10008":{"origPrice":120},"10009":{"origPrice":400},
									"10010":{"origPrice":340},"10011":{"origPrice":450}},
									*/
						"shopOrder":{},
						"featuredOrder":{},
						"featureInfo":{"i599":{"price":3,"startTime":1319190711,"endTime":1319589067}},
						"inventory":{"i1":"5","i2":"2","i111":"1","i121":"1","i131":"1","i141":"1","i599":"1","i922":"1","i923":"1"},
						"gems":"10"

					}					
				});
				
				var shopOrder:Array = [
					{"itemId":599,"origPrice":5},{"itemId":401,"origPrice":100},{"itemId":911,"origPrice":30},
					{"itemId":912,"origPrice":90},{"itemId":351,"origPrice":50},{"itemId":355,"origPrice":100},
					{"itemId":922,"origPrice":90},{"itemId":923,"origPrice":10},{"itemId":9,"origPrice":9},
					{"itemId":1,"origPrice":1},{"itemId":2,"origPrice":5},{"itemId":3,"origPrice":10},
					{"itemId":4,"origPrice":20},{"itemId":5,"origPrice":50},{"itemId":6,"origPrice":80},
					{"itemId":7,"origPrice":120},{"itemId":361,"origPrice":8},{"itemId":362,"origPrice":30},
					{"itemId":363,"origPrice":100},{"itemId":262,"origPrice":60},{"itemId":261,"origPrice":10},
					{"itemId":272,"origPrice":60},{"itemId":901,"origPrice":30},{"itemId":1025,"origPrice":10},
					{"itemId":1035,"origPrice":10},{"itemId":1015,"origPrice":10},{"itemId":1045,"origPrice":10},
					{"itemId":1005,"origPrice":10},{"itemId":1026,"origPrice":55},{"itemId":1036,"origPrice":55},
					{"itemId":1016,"origPrice":55},{"itemId":1046,"origPrice":55},{"itemId":1006,"origPrice":55},
					{"itemId":1027,"origPrice":95},{"itemId":1037,"origPrice":95},{"itemId":1017,"origPrice":95},
					{"itemId":1047,"origPrice":95},{"itemId":1007,"origPrice":95},{"itemId":121,"origPrice":8},
					{"itemId":122,"origPrice":50},{"itemId":131,"origPrice":8},{"itemId":132,"origPrice":50},
					{"itemId":111,"origPrice":8},{"itemId":112,"origPrice":50},{"itemId":141,"origPrice":8},
					{"itemId":142,"origPrice":50},{"itemId":101,"origPrice":45},{"itemId":102,"origPrice":280},
					{"itemId":10003,"origPrice":350},{"itemId":10004,"origPrice":225},{"itemId":10011,"origPrice":450},
					{"itemId":10009,"origPrice":400},{"itemId":10008,"origPrice":120},{"itemId":10010,"origPrice":270},
					{"itemId":10001,"origPrice":305},{"itemId":10002,"origPrice":325}];
				
				
				
				for(var i:int = 0; i < shopOrder.length; i++)
				{
					res["data"]["shopOrder"][_Global.ap + i] = new HashObject(shopOrder[i] as Hashtable);
				}
				
				break;
		}
		
		return res;
	}
	
	public function fillFTEEndData(result:Object):void
	{
		//
		var slot:int;
		var bid:int;
		var cityId:int = GameMain.instance().getCurCityId();
		seed = GameMain.instance().getSeed();
		try {
			checkData(seed,cityId);
			for(var i:System.Collections.DictionaryEntry  in (result as HashObject)["buildings"].Table)
			{
				slot = _Global.INT32(i.Key);
				bid = _Global.INT32((i.Value as HashObject));
				seed["buildings"]["city" + cityId]["pos" + slot] [_Global.ap + 3].Value = bid;
			}
		} catch (Exception) {
			_Global.Log("error---------");
		}
		
		seed["cities"][_Global.ap+0][_Global.ap + 2] = Datas.getValue(result,"map.xCoord") as HashObject;
		//_Global.Log(seed["cities"][_Global.ap+0][_Global.ap + 2].Value+"..change city coord....."+result);	
		seed["cities"][_Global.ap+0][_Global.ap + 3] = Datas.getValue(result,"map.yCoord") as HashObject;
		seed["cities"][_Global.ap+0][_Global.ap + 4] = Datas.getValue(result,"map.provinceId") as HashObject;
		CityQueue.instance().SyncWithSeed();
		
	}
	
	public function checkData(seed:HashObject,cityId:int){
		if( seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_Academy] == null)
			{
				seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_Academy] = new HashObject(
				{
					_Global.ap + 0 : "" + Constant.Building.ACADEMY,
					_Global.ap + 1 : "1",
					_Global.ap + 2 : "" +FTEConstant.Data.Slot_Academy,
					_Global.ap + 3 : "0"
				});
			}
	
		if( seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_House] == null)
		{
			seed["buildings"]["city" + cityId]["pos" + FTEConstant.Data.Slot_House] = new HashObject(
				{
					_Global.ap + 0 : "" + Constant.Building.VILLA,
					_Global.ap + 1 : "1",
					_Global.ap + 2 : "" +FTEConstant.Data.Slot_House,
					_Global.ap + 3 : "0"
				});				 
		}
	}
	/***** Hack Data ****/
	public function HackDataConfig():void
	{
		var gd:Object = Datas.instance().getGameData();
		// for quest 6011
//		gd["questlist"]["q6011"]["levelreq"] = 1;
	
	}
	
	public function RestoreHackDataConfig()
	{
		var gd:Object = Datas.instance().getGameData();
	}
}
