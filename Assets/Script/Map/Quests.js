class Quests extends KBN.Quests
{
	private var unlockedQuests:Hashtable;
	private var unlockedRecommandQuestId:int;
	private var isUpdateDisplayInfor:boolean;
	private var displayQuests: System.Collections.Generic.Dictionary.<String, Array>;
	private var recommendedQuest:QuestItem;
	private var numComplete:int;
	private var mainRecommendLevel:int;

	public function Quests()
	{
		isUpdateDisplayInfor = true;
		unlockedQuests = new Hashtable();
	}
	
	public static function instance() : Quests
	{
		if( singleton == null )
		{
			singleton = new Quests();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton as Quests;
	}	
	
	public function GetQuestComp():int
	{
		return numComplete;
	}
	
	public function get recommandQuest():QuestItem
	{
		return recommendedQuest;
	}
	
	public function get nonRecommandQuests():System.Collections.Generic.Dictionary.<String, Array>
	{
		return displayQuests;
	}
	
	public function GetMainRecommendLevel():int
	{
		return mainRecommendLevel;
	}
	
	public function UpdateMainRecommendLevel(seed:HashObject):void
	{
		if (seed["serverSetting"] != null && seed["serverSetting"]["recommendQuestMaxLevel"] != null)
		{
			mainRecommendLevel = _Global.INT32(seed["serverSetting"]["recommendQuestMaxLevel"]);
		}
        else
        {
        	mainRecommendLevel = 0;
    	}
	}
	
	public function createDisplayInfor():void
	{			
		var quest:QuestItem;	
		var key:int;
		
		if(isUpdateDisplayInfor)
		{
			displayQuests = new System.Collections.Generic.Dictionary.<String, Array>();
			recommendedQuest = null;
		}
		else
		{
			return; //{"normal":displayQuests, "recommand":recommendedQuest};
		}
		
		if(unlockedRecommandQuestId != 0)
		{
			recommendedQuest = unlockedQuests[unlockedRecommandQuestId];//{"id":unlockedRecommandQuestId, "check":unlockedQuests[unlockedRecommandQuestId]["isFinish"]};
		}

		var tempArr:Array;						
		for(var q:System.Collections.DictionaryEntry in unlockedQuests)
		{
//			if(local_parseInt(quest._key) > 11001 && local_parseInt(quest._key) <= 11200)
//			{
//				continue;
//			}
			
			key = q.Key;
			
			if(key == unlockedRecommandQuestId)
			{
				continue;
			}

			quest = q.Value as QuestItem;
			var heading : String = Datas.getArString("questCategory.q" + key);

			if ( displayQuests.ContainsKey(heading) )
			{
				(displayQuests[heading] as Array).Push(quest);
			}
			else
			{
				tempArr = new Array();
				tempArr.Push(quest);

				displayQuests[heading] = tempArr;
			}
		}
		
		isUpdateDisplayInfor = false;
		
		MenuMgr.getInstance().MainChrom.RefreshCurrentMission();
		
		return;//{"normal":displayQuests, "recommand":recommendedQuest};
	}

	public function init(sd:Object)
	{}
	
	private function local_parseInt(_obj):long
	{		
		return _Global.INT64(_obj);		
	}
	
	// This checks the objective for a quest, and returns true or false on whether
	// it has been met. This applies across all cities in an empire.
	//
	// This is all conditional based on an array: questlist[qXXX].objective
	// objective[0] is the type of objective, determined below.
	// objective[1] is the target (resource, building ID, technology ID, etc.)
	// objective[2] is the value, if needed (such as gold count, level, etc.)
	//
	// returns true or false if the objective has been met
	//
	public function checkForTroop():void
	{
		checkByType({"3":1, "4":1});
	}
	
	public function checkForBuilding():void
	{
		checkByType({"1":1, "5":1, "6":1, "9":1, "15":1});
	}	
	
	public function checkForMarch():void
	{
		checkByType({"7":1});
	}
	
	public function checkForTechnology():void
	{
		checkByType({"2":1});
	}
	
	public function checkForElse():void
	{
		checkByType({"999":1, "6":1});
	}	
	
	public function checkObjective(questItem:QuestItem, currentcityid:int):boolean 
	{	
		var seed:HashObject = GameMain.instance().getSeed();
		var quest:HashObject = questItem.getQuestObjective();
		var questId:int = questItem.questId;
		
		var objectiveType:int = local_parseInt(quest[_Global.ap + 0].Value);
		var	objectiveTarget:int = local_parseInt(quest[_Global.ap + 1].Value);
		var	objectiveValue:int = local_parseInt(quest[_Global.ap + 2].Value);

		var	objectiveMet:boolean = false;
		var	compareValue:int = 0;
		var _wilderness:System.Collections.DictionaryEntry;
		var _city:System.Collections.DictionaryEntry;
		if(objectiveType < 999) //not quest-specific hardcoded
		{ 
			// We just set a compare value then compare after the switch,
			// since everything here is >= objectiveValue
			
			switch (objectiveType) 
			{
				case 1: 
					// building
					compareValue = Building.instance().getMaxLevelForType(objectiveTarget, currentcityid);
					break;
				case 2: 
					// technology
					compareValue = Research.instance().getMaxLevelForType(objectiveTarget);
					break;
				case 3: 
					// unit/troop count
					compareValue = Barracks.instance().getUnitCountForType(objectiveTarget, currentcityid);
					break;
				case 4: 
					// fortification count
					compareValue = Walls.instance().getUnitCountByTypeAndCity(objectiveTarget, currentcityid);
					break;
				case 5: // resources
				case 9: 
					// resources (deprecated)
					compareValue = Resource.instance().getCountForType(objectiveTarget, currentcityid);
					break;
				case 6: 
					// resource caps
					switch (objectiveTarget) 
					{
						case 0: 
							// raise gold income
							compareValue = Resource.instance().taxRate(currentcityid) * 0.01 * Resource.instance().populationCount(currentcityid);
							break;
						case 1:
						case 2:
						case 3:
						case 4:
							compareValue = Resource.instance().getResourceHourlyProduction(objectiveTarget, currentcityid);
							break;
						case 9: 
							//raise population cap
							compareValue = Resource.instance().populationCap(currentcityid);
							break;
						default:  
							//resources
							compareValue = Building.instance().getLevelsSumForType(objectiveTarget, currentcityid);
							break;
					}
					break;
				case 7: 
					// conquer wilderness										
//					for( _city in seed["cities"])
//					{	
//						var city = _city._value;
						var wildernessArray:HashObject = seed["wilderness"]["city" + currentcityid];
						for(_wilderness in wildernessArray.Table)
						{
							var wilderness:HashObject = _wilderness.Value as HashObject; 
							if(objectiveTarget != 0 )//-1)
							{
								if(local_parseInt(wilderness["tileType"].Value) == objectiveTarget && local_parseInt(wilderness["tileLevel"].Value) >= objectiveValue)
								{
									objectiveMet = true;
								}
							}
							else if(local_parseInt(wilderness["tileLevel"].Value) >= objectiveValue)
							{
								objectiveMet = true;
							}
						}
//					}
					break;
				case 15: // building count
					compareValue = Building.instance().getCountForType(objectiveTarget, currentcityid);
					break;
			}
			if (compareValue >= objectiveValue) 
			{
				objectiveMet = true;
			}
		} 
		else if (objectiveType == 999) 
		{ 
			// specific quest-based, hardcoded
			if (questId >= 11002 && questId <= 11060) 
			{ 
				// might
				if (local_parseInt(seed["xp"]["lvl"].Value) >= objectiveValue) 
				{
					objectiveMet = true;
				}
			} 
			else
			{
				switch (questId) 
				{
					case 1082: 
						// join alliance
						if ( seed["allianceDiplomacies"] != null && local_parseInt(seed["allianceDiplomacies"]["allianceId"].Value) > 0 ) 
						{
							objectiveMet = true;
						}
						break;

					case 1502: 
						// build second city
						var temp_array:Array = _Global.GetObjectValues(seed["cities"]);
						if (temp_array.length >= 2) 
						{
							objectiveMet = true;
						}
						break;
					
					case 3500: 
						// complete artifact set 1
						if (seed["artifactSets"]["inventory"]['as20110'] && _Global.INT32(seed["artifactSets"]["inventory"]['as20110']) > 0) 
						{
							objectiveMet = true;
						}
						break;
					
					case 1201: // SR collection
					case 1202:
					case 1203:
					case 1204:
//						var aResourceToCollect = {'q1201':5,'q1202':6,'q1203':7,'q1204':8};
//						var iResourceToCollect = aResourceToCollect['q'+questId];
						var isCollecting:int = 0;
						
//						for(var city_resource in seed["resources"].Table)
//						{
//							//isCollecting = local_parseInt(city_resource["rec" + iResourceToCollect][_Global + 2]);  //?
//						}
						
						if (isCollecting > 0) 
						{
							objectiveMet = true;
						}
						break;
					case 7901: 
						//reinforce 2nd city
						var temp_cities:Array = _Global.GetObjectValues(seed["cities"]);
						if (temp_cities.length > 1) 
						{
							objectiveMet = true;
						} 
						else 
						{
						
							for( _city in seed["cities"].Table)
							{	
								var city_1:HashObject = _city.Value as HashObject;
								var wildernessArray_1:HashObject = seed["wilderness"]["city" + city_1[_Global.ap + 0].Value];
								for( _wilderness in wildernessArray_1.Table)
								{
									var wilderness_1:HashObject = _wilderness.Value as HashObject; 
									if(Attack.instance().wildernessBuildCityCheck(wilderness_1["xCoord"].Value, wilderness_1["yCoord"].Value))
									{
										objectiveMet = true;
									}								
								}							
							}
						}
						break;
					case 8002: 
						// 2nd city
						if (local_parseInt(seed["num_neighbors"].Value) >= 5 || local_parseInt(seed["items"]["i1202"].Value) > 0) {
							objectiveMet = true;
						}
						break;
					case 8003: 
						// 3rd city
						if (local_parseInt(seed["items"]["i1101"].Value) >= 4 || local_parseInt(seed["items"]["i1102"].Value) >= 2 || local_parseInt(seed["items"]["i1103"].Value) >= 1) {
							objectiveMet = true;
						}
						break;
					case 8004: 
						// 4th city
						if (local_parseInt(seed["items"]["i1103"].Value) >= 4 || local_parseInt(seed["items"]["i1104"].Value) >= 3 || local_parseInt(seed["items"]["i1105"].Value) >= 10) {
							objectiveMet = true;
						}
						break;

					case 21095: 
						// Ask for help
						// '95' == building help feed id
						// '107' == research help feed id
						//if ( ['95','107'].intersect(feeds_sent).length > 0 ) { //?
						//	objectiveMet = true;
						//}
						break;
	
					case 999001: 
						// hire knight
						if (seed["knights"]['city' + currentcityid] != null) {
							objectiveMet = true;
						}
						break;
					case 999002: 
						// assign role
						if (seed["leaders"]['city' + currentcityid] != null) 
						{
							var temp_max:Array = [
								Convert.ToInt32(local_parseInt(seed["leaders"]['city' + currentcityid]["combatKnightId"].Value)),
								Convert.ToInt32(local_parseInt(seed["leaders"]['city' + currentcityid]["intelligenceKnightId"].Value)),
								Convert.ToInt32(local_parseInt(seed["leaders"]['city' + currentcityid]["politicsKnightId"].Value)),
								Convert.ToInt32(local_parseInt(seed["leaders"]['city' + currentcityid]["resourcefulnessKnightId"].Value)),
								Convert.ToInt32(local_parseInt(seed["leaders"]['city' + currentcityid]["defenseKnightId"].Value))
							];

							if (_Global.MaxValue(temp_max) > 0) 
							{
								objectiveMet = true;
							}
						}
						break;
					case 999010: 
						// tax rate
						if (Resource.instance().taxRate(currentcityid) == 20) {
							objectiveMet = true;
						}
						break;
					case 999020:
						//Quest for opening the new city chest 
						if(!seed["items"]["i10020"])
						{
							objectiveMet = true;
						}
						break;
					case 999021:
						//Quest for changing player name
						var playerName		:String = seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value;
						var newUserStr		:String;
						
						if(seed["newuserstring"] != null)
						{
							newUserStr = seed["newuserstring"].Value;
						}
						else
						{
							newUserStr = "NewUser";
						}
						
						objectiveMet = checkUserName(playerName, "NewUser");
						
						if(objectiveMet)
						{
							objectiveMet = checkUserName(playerName, newUserStr);
						}

						break;
				}
			}
		}		
		return objectiveMet;
	}

	private function checkUserName(playerName:String, userNameStr:String):boolean
	{
		var isChange:boolean = false;
		var subStr  :String;
		
		if(playerName.Length >= userNameStr.Length)
		{
			subStr = playerName.Substring(0, userNameStr.Length);
			
			if (subStr != userNameStr) 
			{
				isChange = true;
			}
			else
			{
				isChange = false;
			}						
		}
		else
		{
			isChange = true;
		}
		
		return isChange;
	}

	
	// Returns an array of rewards for a given quest ID, each in the
	// following object format:
	//
	// {
	//   name: 'name', // name of the reward
	//   count: 1000, // amount of the reward, name in the case of title
	//   type: 'resource', // type of reward ('resource', 'unit', 'item', 'special')
	//   id: 1 // the relational id based on type
	// }
	//
	
	class DataReward
	{
		public var name:String;
		public var count:int;
		public var type:String;
		public var id:int;
		
		public function DataReward()
		{}
	}
	
	public function rewards(questId:int):Array
	{
//		var arStrings:Object = Datas.instance().arStrings();
		var questlist:HashObject = Datas.instance().questlist();
		var seed:HashObject = GameMain.instance().getSeed();
				
		var quest:HashObject = questlist['q' + questId];
		var	questRewards:Array = new Array();
		
//		if(!quest)
//		{
//			_Global.Log("Quest Missed:" + questId);
//		}
		var temp_reward:HashObject = quest["reward"][_Global.ap + 0];
		var reward:Array = _Global.GetObjectValues(temp_reward);
		var i:int;
		var dataReward:DataReward;
			
		for( i = 0; i < reward.length; i ++ )
		{
			if (local_parseInt(temp_reward[_Global.ap + i].Value) > 0) 
			{
				dataReward = new DataReward();
				dataReward.name = Datas.getArString("ResourceName." + _Global.ap + i);
				dataReward.count = _Global.INT32(temp_reward[_Global.ap + i]);
				dataReward.type = "resource";
				dataReward.id = i;
				questRewards.push(dataReward);
							
//				questRewards.push({
//					"name": arStrings["ResourceName"][_Global.ap + i],
//					"count": local_parseInt(temp_reward[_Global.ap + i]),
//					"type": "resource",
//					"id": i
//				});
			}
		}
		
		temp_reward = quest["reward"][_Global.ap + 1];
		reward = _Global.GetObjectValues(temp_reward);
		for( i = 0; i < reward.length; i ++ )
		{
			if(_Global.INT32(temp_reward[_Global.ap + i][_Global.ap + 0]) > 0 && _Global.INT32(temp_reward[_Global.ap + i][_Global.ap + 1]) > 0)
			{
			
				dataReward = new DataReward();
				dataReward.name = Datas.getArString("unitName.u" + temp_reward[_Global.ap + i][_Global.ap + 0].Value);
				dataReward.count = _Global.INT32(temp_reward[_Global.ap + i][_Global.ap + 1]);
				dataReward.type = "unit";
				dataReward.id = _Global.INT32(temp_reward[_Global.ap + i][_Global.ap + 0]);				
				questRewards.push(dataReward);
					
//				questRewards.push({
//					"name": arStrings["unitName"]["u" + temp_reward[_Global.ap + i][_Global.ap + 0]],
//					"count": local_parseInt(temp_reward[_Global.ap + i][_Global.ap + 1]),
//					"type": "unit",
//					"id": temp_reward[_Global.ap + i][_Global.ap + 0]
//				});			
			}
		}

		temp_reward = quest["reward"][_Global.ap + 2];
		reward = _Global.GetObjectValues(temp_reward);				
		for( i = 0; i < reward.length; i ++ )
		{
			if(_Global.INT32(temp_reward[_Global.ap + i][_Global.ap + 0]) > 0 && _Global.INT32(temp_reward[_Global.ap + i][_Global.ap + 1]) > 0)
			{
				dataReward = new DataReward();
				dataReward.name = Datas.getArString("itemName.i" + temp_reward[_Global.ap + i][_Global.ap + 0].Value);
				dataReward.count = _Global.INT32(temp_reward[_Global.ap + i][_Global.ap + 1]);
				dataReward.type = "item";
				dataReward.id = _Global.INT32(temp_reward[_Global.ap + i][_Global.ap + 0]);				
				questRewards.push(dataReward);			
			
//				questRewards.push({
//					"name": arStrings["itemName"]['i' + temp_reward[_Global.ap + i][_Global.ap + 0]],
//					"count": local_parseInt(temp_reward[_Global.ap + i][_Global.ap + 1]),
//					"type": "item",
//					"id": temp_reward[_Global.ap + i][_Global.ap + 0]
//				});	
//				_Global.Log("reward item name:"+ arStrings["itemName"]['i' + temp_reward[_Global.ap + i][_Global.ap + 0]]);		
			}
		}
		
		var name:String;
		var count:int;
		
		// gems, might, and title
		temp_reward = quest["reward"][_Global.ap + 3];
		reward = _Global.GetObjectValues(temp_reward);			
		for( i = 0; i < reward.length; i ++ )
		{
			count = _Global.INT32(temp_reward[_Global.ap + i]);
			if (count > 0) 
			{
				switch (i) 
				{
				case 0: // gems
					name = Datas.getArString("Common.gold");
					break;
				case 1: // might
					name = Datas.getArString("Common.Glory");
					break;
				case 2:
					name = Datas.getArString("Common.Level");
					break;
				}

				dataReward = new DataReward();
				dataReward.name = name;
				dataReward.count = count;
				dataReward.type = "special";
				dataReward.id = i;				
				questRewards.push(dataReward);				
												
//				questRewards.push({
//					"name": name,
//					"count": count,
//					"type": 'special',
//					"id": i
//				});
			}
		}
		return questRewards;
	}

	// Accepts the award for the user, giving them all the rewards
	// and marking it "seen", and doing all related functions like
	// updating the seed and posting to facebook.
	//
	public function getReward(questId:int, successFunc:Function)
	{
		getReward(questId, false, successFunc);
	}
	
	public function	getReward(questId:int, fromMainChrome:boolean, successFunc:Function)//, share)
	{
		var curCityId:int; 
		if(unlockedQuests.Count == 0 || unlockedQuests[questId] == null)	//FOR FTE.
		{
			curCityId = GameMain.instance().getCurCityId();
		}
		else
		{
			curCityId = (unlockedQuests[questId] as QuestItem).cityId;
		}
		
		var rewardCityId:int = GameMain.instance().getCurCityId(); // the city get the reward
		var seed:HashObject = GameMain.instance().getSeed();
		var params:Array = new Array();
		params.Add(curCityId);
		params.Add(rewardCityId);
		params.Add(questId);
		params.Add(fromMainChrome ? 1 : 0);
			
		var okFunc:Function = function(result:HashObject)
		{
//			_Global.Log("Quest getReward ok");
			
//			KTrack.event(['_trackEvent', 'Quests', 'ClaimQuest', seed.player.title]);
//			KTrack.event(['_trackEvent', 'Quests', 'ClaimByID', tvuid, seed.player.cntLogins ]);

//			if(share) {
//				reparr.push(["REPLACE_QuEsTnAmE", arStrings.questName['q' + questId]]);
//				reparr.push(["REPLACE_AwArDnAmE", arStrings.questName['q' + questId]]);
//				reparr.push(["REPLACE_QuEsTId", questId]);
//				var image = '104_quest';
//				common_postToProfile('104', reparr, null, image);
//			}

			// give the rewards to the user	
			giveRewards(questId);

			// HARDCODED (ick!) QUEST ACTION FOR CITIES
			switch (questId) {
			case 8003: // 3rd city, quest complete, remove crests
				seed["items"]["i1101"].Value = local_parseInt(seed["items"]["i1101"].Value) - 1;
				seed["items"]["i1102"].Value = local_parseInt(seed["items"]["i1102"].Value) - 1;
				seed["items"]["i1103"].Value = local_parseInt(seed["items"]["i1103"].Value) - 1;
				break;
			case 8004: // 4th city, quest complete, remove crests
				seed["items"]["i1103"].Value = local_parseInt(seed["items"]["i1103"].Value) - 1;
				seed["items"]["i1104"].Value = local_parseInt(seed["items"]["i1104"].Value) - 1;
				seed["items"]["i1105"].Value = local_parseInt(seed["items"]["i1105"].Value) - 1;
				break;
			}
    
			// remove from list			
			if(!seed["quests"]["q" + questId])
			{
				var obj:HashObject = new HashObject();
				
				for(var i:System.Collections.DictionaryEntry in seed["quests"].Table)
				{
					obj[i.Key + ""] = new HashObject("1");
				}
				
				obj["q" + questId] = new HashObject("1");	
				
				seed["quests"] = obj;	
			}
			
//			if (local_parseInt(seed["tutorial"]["t1"]) == 6) {
//				GORTutorial.openClickField();	
//			} else {
//				// redisplay window
//				if (local_parseInt(seed["tutorial"]["t1"], 10) != 6) {
//					Quests.allCompleted();
//					Modal.hideModal();
//					Quests.open();
//				}
//			}
		
			if (result["updateSeed"]) 
			{
				UpdateSeed.instance().update_seed(result["updateSeed"]);
			}
			
			if(unlockedQuests.ContainsKey(questId))
			{
				unlockedQuests.Remove(questId);
				isUpdateDisplayInfor = true;
			}
			
			updateQuestData();
			
			var achievementId:String = Datas.instance().GetArchiveMentId(questId);
			if(String.IsNullOrEmpty(achievementId) == false)
			{
				GameCenterHelper.ReportAchievementProgress(achievementId,100.0);
			}
			
			if(successFunc)			
			{
				successFunc(result);
			}
			
//			_Global.Log("Quest getReward success");
		};
		
//		var errorFunc:Function = function(msg:String, errorCode:String)
//		{
//			_Global.Log("Quest getReward error");
//		};
//			
//		UnityNet.reqQuestRewards( params, okFunc, errorFunc);
		UnityNet.reqQuestRewards( params, okFunc, null);

	}

	// Updates the seed with the rewards of a given quest.
	//
	public function giveRewards (questId:int):void
	{
		var seed:HashObject = GameMain.instance().getSeed();
		var curCityId:int = GameMain.instance().getCurCityId();
		var questlist:HashObject = Datas.instance().questlist();
		var	allRewards:Array = rewards(questId);
		var reward:DataReward;
		
		for( var i:int = 0; i < allRewards.length; i ++ ) 
		{
			reward = allRewards[i] as DataReward;
		
			switch (reward.type) 
			{
			case "resource":
				Resource.instance().addToSeed(reward.id, reward.count, curCityId);
		//		Resource.instance().UpdateRecInfo();
				break;
			case 'unit':
				Barracks.instance().addUnitsToSeed(reward.id, reward.count, curCityId);
				break;
			case 'item':
				var itemId:int = _Global.INT32(reward.id);
				MyItems.instance().AddItem(itemId, reward.count);
				break;
			case 'special':
				switch (reward.id) 
				{
				case 0: // gems
					Payment.instance().AddGems(reward.count);
					break;
				case 1: // might
					seed["player"]["might"].Value = _Global.INT64(seed["player"]["might"]) + reward.count;
					LevelUp.instance().check();
					break;
				case 2: // title, needs to be an exception, pulling direct from questlist
						var curLevel:int = _Global.INT32(seed["player"]["title"]);
						seed["player"]["title"] = questlist["q" + questId]["reward"][_Global.ap + 3][_Global.ap + 2];

						var newLV = _Global.INT32(seed["player"]["title"]);
						if (curLevel != newLV) {
							NativeCaller.SetRoleLevel(newLV, Datas.instance().tvuid().ToString());
							/* 更新本地的玩家等级 */
							Datas.instance().SetPlayerCurrentLevel(newLV);
						}				

						break;
				}
				break;
			}
		}
		Resource.instance().UpdateRecInfo();

		return;
	}
	
	// Returns an array of valid quests IDs and the current recommended quest ID.
	// e.g. [[...questIds...], 1001]
	
	
	public function updateQuestData():void
	{
		validQuests(false);
		checkAfterValid();
	}
	
	public function initQuestData():void
	{
		validQuests(true);
		checkAfterValid();		
	}
	
	//unlock quest
	public function validQuests(isInit:boolean):void 
	{
		var	questlist:HashObject = Datas.instance().questlist(); //this is common data
		var seed:HashObject = GameMain.instance().getSeed();
		var questDisplayOrder:Array = _Global.GetObjectValues(seed["questdisplayorder"]);
		var questrecommendationorder:Array = _Global.GetObjectValues(seed["questrecommendationorder"]);

		var	quest:HashObject;
		var	questId:int;
		var	prereqs:Array;
		var	prereqsMet:boolean;
		var questItem:QuestItem;
		var i:int;
		var j:int;
		var questsInfo : HashObject = seed["quests"];

		for (i = 0; i < questDisplayOrder.length; i++) 
		{
			questId = _Global.INT32(questDisplayOrder[i]);
			quest = questlist['q' + questId];
			prereqsMet = true;

			if(!quest)
			{
				continue;
			}
			
			if(questId > 11001 && questId <= 11200)
			{
				continue;
			}	
			
			if(!isInit && unlockedQuests.ContainsKey(questId))
			{
				continue;
			}
			
			if (!questsInfo['q' + questId] || !questsInfo['q' + questId].Value)
			{ 
				//quest is not completed by player
				if (quest["levelreq"] != null && _Global.INT32(seed["player"]["title"]) < _Global.INT32(quest["levelreq"])) 
				{
					//quest is beyond current level of player
					continue; 
				}
				
				if (quest["prerequisite"].Value == null ||quest["prerequisite"].Value == "") 
				{
					questItem = new Quests.QuestItem();
					questItem.questId = questId;
					questItem.isFinish = false;
					questItem.isCheck = false;
					questItem.cityId = 0;
					
					//{"questId":questId, "quest":quest, "isFinish":false, "isCheck":false, "cityId":0};
					unlockedQuests[questId] = questItem; 
				} 
				else 
				{
					prereqs = (quest["prerequisite"].Value as String).Split(","[0]);
					for (j = 0; j < prereqs.length; j++) 
					{			
						if (questsInfo['q' + prereqs[j]] == null)
						{
							prereqsMet = false;
							break;
						}
						if (questsInfo['q' + prereqs[j]] && questsInfo['q' + prereqs[j]].Value != "1" && _Global.INT32(prereqs[j]) != 9999 && _Global.INT32(prereqs[j]) != 99999) 
						{
							prereqsMet = false;
							break;
						}
					}
					if (prereqsMet) 
					{
						questItem = new Quests.QuestItem();
						questItem.questId = questId;
						questItem.isFinish = false;
						questItem.isCheck = false;
						questItem.cityId = 0;	
						
						//{"questId":questId, "quest":quest, "isFinish":false, "isCheck":false, "cityId":0}
						unlockedQuests[questId] = questItem;
					}
				}
			}
		}

		unlockedRecommandQuestId = 0;
		for(i = 0; i < questrecommendationorder.length; i++) 
		{
			questId = _Global.INT32(seed["questrecommendationorder"][_Global.ap + i]);
			questItem= unlockedQuests[questId] as QuestItem;
			if(questItem) 
			{
				unlockedRecommandQuestId = questId;
				break;
			}
		}
	}
	
	public function isColorLabeledQuest(id:String):boolean
	{
		var colorLabeledQuests:HashObject = Datas.instance().colorLabeledQuestList();
		if (null == colorLabeledQuests) return false;
		for(var i:int = 0; i < colorLabeledQuests.Table.Count; i++)
		{
			var obj = colorLabeledQuests[_Global.ap + i];
			if (obj.Value as String == id) return true;
		}
		return false;
	}
	
	public function checkByType(types:Hashtable):void
	{
		var questItem:QuestItem;		
		var questId:int;
		var city:HashObject;
		var cityId:int;
		var isFinished:boolean;
		var objectiveType:String;
		var oldState:boolean;
		
		var seed:HashObject = GameMain.instance().getSeed();
		var cities:HashObject = seed["cities"];
		var curCityId:int = GameMain.instance().getCurCityId();	

		for(var data:System.Collections.DictionaryEntry in unlockedQuests)
		{
			questItem = data.Value as QuestItem;
			questId = data.Key;
			objectiveType = questItem.getQuestObjective()[_Global.ap + 0].Value;
			
			if(types[objectiveType])
			{
				oldState = questItem.isFinish;
				isFinished = checkObjective(questItem, curCityId);
				
				if(isFinished)
				{
					questItem.isCheck = true;
					questItem.isFinish = true;
					questItem.cityId = curCityId;
				}
				else
				{
					for(var _city:System.Collections.DictionaryEntry in cities.Table)
					{
						city = _city.Value as HashObject;
						cityId = _Global.INT32(city[_Global.ap + 0]);
						
						if(("c" + curCityId) == cityId)
						{
							continue;
						}
						
						isFinished = checkObjective(questItem, cityId);
						
						if(isFinished)
						{
							questItem.isCheck = true;
							questItem.isFinish = true;
							questItem.cityId = cityId;
							break;						
						}
					}
					
					if(!isFinished)
					{
						questItem.isCheck = true;
						questItem.isFinish = false;
						questItem.cityId = 0;						
					}
				}
				
				if(oldState != isFinished)
				{
					isUpdateDisplayInfor = true;
				}				
			}
		}
		
		calCompleteNum();
		MenuMgr.getInstance().MainChrom.setQuestTipForMainchrom(numComplete);
		MenuMgr.getInstance().MainChrom.RefreshCurrentMission();
		isUpdateDisplayInfor = true;
	}
	
	private function calCompleteNum():void
	{
		var quest:QuestItem;
		var num:int = 0;
		for(var data:System.Collections.DictionaryEntry  in unlockedQuests)
		{
			quest = data.Value as QuestItem;
			if(quest.isFinish)
			{
				num++;
			}
		}
		
		numComplete = num;
	}
	
	//check all city
	private function checkAfterValid():void
	{
		var questItem:QuestItem;		
		var questId:int;
		var city:HashObject;
		var cityId:int;
		var isFinished:boolean;
		var oldState:boolean;
		
		var seed:HashObject = GameMain.instance().getSeed();
		var cities:Hashtable = seed["cities"].Table;
		var curCityId:int = GameMain.instance().getCurCityId();
		
		for(var data:System.Collections.DictionaryEntry  in unlockedQuests)
		{
			questItem = data.Value as QuestItem;
			questId = data.Key;
			
//			if(!quest["isCheck"])
//			{
				oldState = questItem.isFinish;
				isFinished = checkObjective(questItem, curCityId);
				
				if(isFinished)
				{
					questItem.isCheck = true;
					questItem.isFinish = true;
					questItem.cityId = curCityId;
				}
				else
				{
					for(var _city:System.Collections.DictionaryEntry in cities)
					{
						city = _city.Value as HashObject;
						cityId = _Global.INT32(city[_Global.ap + 0]);
						
						if(("c" + curCityId) == cityId)
						{
							continue;
						}
						
						isFinished = checkObjective(questItem, cityId);
						
						if(isFinished)
						{
							questItem.isCheck = true;
							questItem.isFinish = true;
							questItem.cityId = cityId;
							break;						
						}
					}
					
					if(!isFinished)
					{
						questItem.isCheck = true;
						questItem.isFinish = false;
						questItem.cityId = 0;						
					}
				}
				
				if(oldState != isFinished)
				{
					isUpdateDisplayInfor = true;
				}
//			}
		}
		
		calCompleteNum();
		MenuMgr.getInstance().MainChrom.setQuestTipForMainchrom(numComplete);
		MenuMgr.getInstance().MainChrom.RefreshCurrentMission();		
	}
	
	public class QuestItem
	{
		public var questId:int;
		public var isFinish:boolean;
		public var isCheck:boolean;
		public var cityId:int;
		
		public function QuestItem()
		{
			
			
		}
		
		public function getQuestData():HashObject
		{
			var	questlist:HashObject = Datas.instance().questlist();
			return questlist['q' + questId];
		}
		
		public function getQuestObjective():HashObject
		{
			var	questlist:HashObject = Datas.instance().questlist();
			return questlist['q' + questId]["objective"];
		}
	}	
}

