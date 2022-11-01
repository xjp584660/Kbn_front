class PushNotification
{
	
	/*
	* struct data  -- @
	* -- fire date			(d-h-m-s)   	-- *
	* -- time zone 			(0 is default)	-- *
	* -- alert body 		(0 is null)		-- *
	* -- alert action		(0 is null)		-- *
	* -- sound name			(0 is default)	-- *
	* -- icon badge number	(0 is null)		-- *
	* -- user infor			(0 is null)		-- *	
	* -- 
	*/	
	
//	private static var BUILDING_TYPE:String 	= "building";
//	private static var RESEARCH_TYPE:String 	= "research";
//	private static var MARCH_TYPE:String 		= "march";
//	private static var UNLOGIN_TYPE:String 		= "unlogin";
//	private static var FOOD_LEFT_TYPE:String 	= "coinLeft";
//	
//	private var xmlCondition:Object = {	BUILDING_TYPE:{"timeZone":0, "alertBody":0, "alertAction":0, "soundName":0, "userInfo":0},
//										RESEARCH_TYPE:{"timeZone":0, "alertBody":0, "alertAction":0, "soundName":0, "userInfo":0},
//										MARCH_TYPE:{"timeZone":0, "alertBody":0, "alertAction":0, "soundName":0, "userInfo":0},
//										UNLOGIN_TYPE:{"timeZone":0, "alertBody":0, "alertAction":0, "soundName":0, "userInfo":0},
//										FOOD_LEFT_TYPE:{"timeZone":0, "alertBody":0, "alertAction":0, "soundName":0, "userInfo":0}
//									  };
	class	NotificationEntity{
		public	var	alertTime:long;
		public	var	alertBody:String;
		public  var bi:String;
	}
	
//	private var xmlConditionFromServer:Object;								  
	
	private static var NOTIFICATION_COUNT_FOR_NO_LOGIN:int = 6;
	
	private var secondOfDay:long = 24 * 60 * 60;
	private var noticeArray:Array;
	private var noticesString:String = "";
	private var secondsOfHalfHours:int = 4 * 60;
	private var secondsOfOneMonth:int = 30 * secondOfDay;
	
	private static var g_instance:PushNotification;
	
	private static var TIMES_BUILDING:int 	= 0;
	private static var TIMES_RESEARCH:int 	= 1;
	private static var TIMES_MARCH:int 		= 2;
	private static var TIMES_FOOD:int 		= 3;
	
	private var g_pushTimes:int[] = [2, 2, 2, 1];
	
	private function PushNotificationString()
	{
		
	}
	
	public static function getInstance():PushNotification
	{
		if(g_instance == null)
		{
			g_instance = new PushNotification();
			GameMain.instance().resgisterRestartFunc(function(){
				g_instance = null;
			});
		}
		
		return g_instance;
	}
	
	public function get noticesStr():String
	{
		noticeArray = new Array();
		noticesString = "";
		
//		loadLastLoginInfor();
		
		generateArray();
		resetOrderByTime();
		changeToStr();
		
//		saveLoginInfor();
		
		return noticesString;
	}
	
	private var pushTimes:Array;
	private var present:long;
	
	public function loadLastLoginInfor():void
	{
		pushTimes = new Array();
	
		var lastLoginStr:String = PlayerPrefs.GetString(Constant.LoginInfor.LAST_LOGIN_DATE);
		var lastPushTimes:String = PlayerPrefs.GetString(Constant.LoginInfor.LAST_PUSH_TIME);
		
		var lastLoginSecond:long;
		var today:long;
		var a:int;
		
		if(lastLoginStr != null && lastLoginStr != "")
		{
			lastLoginSecond = _Global.INT64(lastLoginStr);
		}
		else
		{
			lastLoginSecond = 0;			
		}
		
		present = GameMain.unixtime();		
		today = present - present % (24 * 3600);
				
		if(today >= lastLoginSecond)
		{
			for(a = 0; a < g_pushTimes.Length; a++)
			{
				pushTimes.push("0");
			}
		}
		else
		{
			if(lastPushTimes != null && lastPushTimes != "")
			{
				pushTimes = lastPushTimes.Split("@"[0]);
				
				if(pushTimes.length != g_pushTimes.Length)
				{
					for(a = 0; a < g_pushTimes.Length; a++)
					{
						pushTimes.push("0");
					}				
				}
			}
			else
			{
				for(a = 0; a < g_pushTimes.Length; a++)
				{
					pushTimes.push("0");
				}
			}			
		}		
	}
	
	public function saveLoginInfor():void
	{
		PlayerPrefs.SetString(Constant.LoginInfor.LAST_LOGIN_DATE, present + "");
		PlayerPrefs.SetString(Constant.LoginInfor.LAST_PUSH_TIME, pushTimes.join("@"));
	}
	
	private function comparePushTimesByType(_type:int):void
	{
		var curTimes:int = _Global.INT32(pushTimes[_type]);
		
		if(curTimes < g_pushTimes[_type])
		{
			pushTimes[_type] = (curTimes + 1) + "";
		}
	}

	public function generateArray():void
	{
//var arStrings:Object = Datas.instance().arStrings();
		var seed:HashObject = GameMain.instance().getSeed();
		
		var item:QueueItem;
		var endTime:long;
		var data:NotificationEntity;
		var cityId:int;
//		var notice:Object;
		var cityName:String = "";
		var cityInfor:HashObject;
		
		var tempTime:long = GameMain.unixtime();
		var cities:HashObject = seed["cities"];

		for(var c:System.Collections.DictionaryEntry in cities.Table)
		{
			cityInfor = c.Value as HashObject;
			cityId = _Global.INT32(cityInfor[_Global.ap + 0]);
		
			if(cityInfor)
				cityName = cityInfor[_Global.ap+1].Value;		

			//March
			var marchQueue:BaseQueue = March.instance().getQueue(cityId);		
			if(marchQueue &&_Global.INT32(seed["push"]["march_set"]) == 1)
			{
				var	marchItem:MarchVO;
				for(var i:int=0;i<marchQueue.itemList.length; i++)
				{
					marchItem = marchQueue.itemList[i] as MarchVO;
					if( marchItem.marchStatus != Constant.MarchStatus.OUTBOUND)
					{
						continue;
					}
					endTime = marchItem.endTime - tempTime;
					data = new NotificationEntity();
					data.alertTime = endTime;
//					data.alertBody = arStrings["NotificationMsg"]["LocalMarchCompleted"].Replace("%1$s",marchItem.toXCoord + "").Replace("%2$s",marchItem.toYCoord + "");
					if(marchItem.marchType == Constant.MarchType.REASSIGN)
					{
						data.alertBody = Datas.getArString("NotificationMsg.LocalReassignCompleted",[cityName,GameMain.instance().getCityNameByXY(marchItem.toXCoord,marchItem.toYCoord)]);
					}
					else if(marchItem.marchType == Constant.MarchType.SURVEY)
					{
						data.alertBody = Datas.getArString("NotificationMsg.LocalSurveyCompleted",[marchItem.toXCoord,marchItem.toYCoord,cityName]);
					}
					else if(marchItem.marchType == Constant.MarchType.PVE || marchItem.marchType == Constant.MarchType.ALLIANCEBOSS)
					{
						//do nothing
						data.alertBody = "";
					}
					else
					{
						data.alertBody = Datas.getArString("NotificationMsg.LocalMarchCompleted",[marchItem.toXCoord,marchItem.toYCoord,cityName]);
					}
					if(data.alertBody != "")
					{
						data.bi = Constant.PushType.March_Complete;
						noticeArray.push(data);					
					}
					
					
//					comparePushTimesByType(TIMES_MARCH);			 
				}
			}		
			
			if(_Global.INT32(seed["push"]["city_set"]) == 0)
				continue;
			//Building
			if(BuildingQueueMgr.instance().first(cityId) != null )
			{
				item = BuildingQueueMgr.instance().first(cityId);
				endTime = item.endTime - tempTime;
				if(endTime >= 0 )
				{
					data = new NotificationEntity();
					data.alertTime = endTime;
//					data.alertBody = arStrings["NotificationMsg"]["LocalBuildCompleted"].Replace("%1$s",item.itemName + " (" + arStrings["Common"]["Level"] + " " + item.level +")");
					
					var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(item.itemType,item.level);
					var prestige:int = _Global.INT32(prestigeData["prestige"]);
					var level:int = _Global.INT32(prestigeData["level"]);
					var strLevel:String = level + "";
					for(var j:int=0;j<prestige;j++)
					{
						strLevel =  "*" + strLevel;
					}
					data.alertBody = Datas.getArString("NotificationMsg.LocalBuildCompleted",[item.itemName,strLevel,cityName]);
					
					
					data.bi = Constant.PushType.Building_Complete;
					noticeArray.push(data);
					
//					comparePushTimesByType(TIMES_BUILDING);								
				}
			}
			
			//Research
			if(Research.instance().getItemAtQueue(0,cityId) != null)
			{
				item = Research.instance().getItemAtQueue(0,cityId);
				endTime = item.endTime - tempTime;
				if(endTime >= 0 )
				{
					data = new NotificationEntity();
					data.alertTime = endTime;
//					data.alertBody = arStrings["NotificationMsg"]["LocalResearchCompleted"].Replace("%1$s",item.itemName + " (" + arStrings["Common"]["Level"] + " " + item.level +")");
					data.alertBody = Datas.getArString("NotificationMsg.LocalResearchCompleted",[item.itemName,item.level,cityName]);
					data.bi = Constant.PushType.Research_Complete;
					noticeArray.push(data);	
					
//					comparePushTimesByType(TIMES_RESEARCH);				
				}			
			}
			
			//Food
			var foodBase:long = Resource.instance().getCountForType(Constant.ResourceType.FOOD,cityId);
			var upkeep:long = Resource.instance().getFinalResourceProductivity(cityId, Constant.ResourceType.FOOD);
			if(upkeep < 0 && foodBase > 0)
			{
				upkeep = -upkeep;
				endTime = 3600 * foodBase / upkeep - 3600;	//before 1 hour push notification
				
				if(endTime == 0)
				{
					endTime = 2;
				}
	
				if( endTime > 0)	//
				{
					data = new NotificationEntity();
					data.alertTime = endTime;
//					data.alertBody = arStrings["NotificationMsg"]["LocalFooddDepleted"];
					data.alertBody = Datas.getArString("NotificationMsg.LocalFooddDepleted",[cityName]);
					data.bi = Constant.PushType.Food;
					noticeArray.push(data);	
					
//					comparePushTimesByType(TIMES_FOOD);
				}
			}
			
			//Wall
			var wall:Walls.TrainInfo = Walls.instance().Queue.FirstByCityId(cityId);
			if(wall != null)
			{
				endTime = wall.endTime - tempTime;
				if(endTime > 0)
				{
					data = new NotificationEntity();
					data.alertTime = endTime;
					
					data.alertBody = Datas.getArString("NotificationMsg.LocalTrainCompleted",[wall.itemName, cityName]);
					data.bi = Constant.PushType.Wall_Training_Complete;
					noticeArray.push(data);	
				}
			}

			//Trainning / barrack
			var train:Barracks.TrainInfo = Barracks.instance().Queue.FirstByCityId(cityId);
			if(train != null )
			{
				endTime = train.endTime - tempTime;
				if(endTime <= 2)
					endTime = 2;
				if(endTime > 0)
				{
					data = new NotificationEntity();
					data.alertTime = endTime;
					
					data.alertBody = Datas.getArString("NotificationMsg.LocalTrainCompleted",[train.itemName,cityName]);
					data.bi = Constant.PushType.Training_Complete;
					noticeArray.push(data);
				}
			}

			var healQueues : System.Collections.Generic.List.<HealQueue.HealQueueItem> = HealQueue.instance().GetQueueByCityId(cityId);
			for (var healQueue in healQueues )
			{
				endTime = healQueue.endTime - tempTime;
				if ( endTime > 0 )
				{
					data = new NotificationEntity();
					data.alertTime = endTime;

					data.alertBody = Datas.getArString("NotificationMsg.LocalHealCompleted",[cityName]);
					data.bi = Constant.PushType.Heal_Complete;
					noticeArray.push(data);
				}
			}
		}

	// Beginener protection
		var protecteTime :long = _Global.INT64(seed["player"]["beginnerProtectionExpireUnixTime"]);
		if( protecteTime > tempTime )
		{
			data = new NotificationEntity();
			data.alertTime = protecteTime - tempTime;
			data.alertBody = Datas.getArString("NotificationMsg.BeginnerProtecteionExpire");
			data.bi = Constant.PushType.BeginnerProtect;
			noticeArray.push(data);	
		}		
		
		//ava event
		var avaEventSwitch:boolean = _Global.INT32( seed["serverSetting"]["avaEventNotification"] ) == 1;
		if( avaEventSwitch )
		{
			var deployStartTime: long = KBN.GameMain.Ava.Event.GetDeployStartTime();
			if( deployStartTime > tempTime )
			{
				data = new NotificationEntity();
				data.alertTime = deployStartTime - tempTime;
				data.alertBody = Datas.getArString("NotificationMsg.AvADeploymentStarts");
				data.bi = Constant.PushType.Ava_Deploy_Start;
				noticeArray.push(data);	
			}
			
			var deployed:boolean = KBN.GameMain.Ava.Units.KnightList != null && KBN.GameMain.Ava.Units.KnightList.Count >= 1;
			var combatStartTime: long = KBN.GameMain.Ava.Event.GetCombatStartTime();
			if( combatStartTime > tempTime && deployed )
			{
				data = new NotificationEntity();
				data.alertTime = combatStartTime - tempTime;
				data.alertBody = Datas.getArString("NotificationMsg.AvAEnterTheMap");
				data.bi = Constant.PushType.Ava_Combat_Start;
				noticeArray.push(data);	
			}
		}
		//		Unlogin
		/*
		//var stepTime : int = 24*3600;
		var stepTime : int = 60;
		for(var a:int = 1; a <= NOTIFICATION_COUNT_FOR_NO_LOGIN; a++)
		{
			endTime = a * stepTime;

			data = new NotificationEntity();
			data.alertTime = endTime;
			data.alertBody = Datas.getArString("NotificationMsg.LocalLoginAlert_" + a);
			data.bi =  Constant.PushType.Return_Game;
			noticeArray.push(data);
		}
		*/
	}

	private var limitPushData:Hashtable = new Hashtable();
	
	private function initData():void
	{}
	
	private function getData():Object
	{}
	
	private function saveData():void
	{}

	private function isSameDay(_lastPushTime:String):boolean
	{
		var lastPushTime:System.DateTime = new System.DateTime(_Global.INT64(_lastPushTime) * System.TimeSpan.TicksPerSecond);
		var	nowDateTime:System.DateTime = new System.DateTime(GameMain.unixtime() * System.TimeSpan.TicksPerSecond);
		
		if(lastPushTime.Day == nowDateTime.Day && lastPushTime.Year == nowDateTime.Year && lastPushTime.Month == nowDateTime.Month)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	private function resetOrderByTime()
	{
		var obj:Object;
		
		for (var j:int = 0; j < noticeArray.length; j++) 
		{ 
			for (var i:int = noticeArray.length - 1; i > j; i--) 
			{ 
		  		if ( (noticeArray[j] as NotificationEntity).alertTime > (noticeArray[i] as NotificationEntity).alertTime) 
		  		{ 
		  			obj = noticeArray[j]; 
		  			noticeArray[j] = noticeArray[i]; 
		  			noticeArray[i] = obj; 
		  		} 
		  	}  			
		}
	}
	
	private function changeToStr()
	{
		var notice:NotificationEntity;
		var tempStr:String;
		
		for(var a:int = 0; a < noticeArray.length; a++)
		{
			notice = noticeArray[a];

			// addBI here......
			tempStr = notice.alertTime + "|" + notice.alertBody + "|" + notice.bi;
			
			if(a == noticeArray.length - 1)
			{
				noticesString += tempStr;
			}
			else
			{
				noticesString += tempStr + "@";
			}			
		}
	}	
}
