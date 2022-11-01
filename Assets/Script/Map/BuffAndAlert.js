class BuffAndAlert
{
	public var handleBuffUpdate:Function;

	private var g_isUpdateBuff:boolean = true;
	private var g_pveUpdateBuff:boolean=true;
	private var g_isUpdateAlert:boolean;
	
	private var g_beAttackedNum:int;
	private var g_present:long;

	private static var CHECK_ALERT_INTERVAL:int = 1;
	private var g_lastCheckAlertTime:long;
	private var g_lastAttackNum:int;
	
	private var buffItemIds:Array = new Array([-1],  								// BUFF_TYPE_FRESHMAN 	= 0
									   		  [901],								// BUFF_TYPE_PEASE 		= 1
									          [-1],									// BUFF_TYPE_ANTI_SCOUT = 2
									          [261, 271, 410, /*3300,*/ 3500, 3600, 265, 275],	// BUFF_TYPE_COMBAT 	= 3
									          [101, 111, 121, 131, 141, 3400],		// BUFF_TYPE_RESOURCE 	= 4
									          [-1],// BUFF_TYPE_TRAINTROOP = 5
											  [3000],
											  [3001]);								
	
	private var g_usedBuffIndex:Array;
	private var g_allBuffItems:Array;
	private var g_hasBuffs:boolean;
	private var g_buffIconForMainChrome:Array;
	
	private static var g_instance:BuffAndAlert;
	
	public function BuffAndAlert()
	{
		g_usedBuffIndex = new Array();
		g_allBuffItems 	= new Array();
		g_buffIconForMainChrome = new Array();

		resetBuffAndAlert();
	}
	
	public function resetBuffAndAlert():void
	{
		g_isUpdateBuff 	= true;
		g_pveUpdateBuff=true;
		g_usedBuffIndex.Clear();
		g_allBuffItems.Clear();
		g_buffIconForMainChrome.Clear();	
	
		updateAlert();
		InitAllBuffs();
	}
	
	public static function instance():BuffAndAlert
	{
		if(!g_instance)
		{
			g_instance = new BuffAndAlert();
			
			GameMain.instance().resgisterRestartFunc(function(){
				g_instance = null;
			});
		}
		
		return g_instance;
	}
	
	public function get isUpdateAlert():boolean
	{
		return g_isUpdateAlert;
	}
	
	public function setAlertFalse():void
	{
		g_isUpdateAlert = false;
	}
	
	public function setBuffFalse():void
	{
		g_isUpdateBuff = false;
	}
	
	public function get isUpdateBuff():boolean
	{
		return g_isUpdateBuff;
	}
	public function setPveBuffFalse():void
	{
		g_pveUpdateBuff=false;
	}

	public function get isPveRefresh():boolean{
		return g_pveUpdateBuff;
	}
	
	public function get buffIconForMainChrome():Array
	{
		return g_buffIconForMainChrome;
	}
	
	public function get attackNum():int
	{
		return g_lastAttackNum;
	}
	
	public function updateBuff(_type:int, itemId:int):void
	{
		var index:int = getIndexInAllBuffs(_type, itemId);
		var queueItem:QueueItem = g_allBuffItems[index];
		
		queueItem.endTime = getExpireTimeByType(_type, itemId);
		queueItem.timeRemaining = queueItem.endTime - GameMain.unixtime();
		
		if(!_Global.IsValueInArray(g_usedBuffIndex, index) && queueItem.timeRemaining > 0)
		{
			g_usedBuffIndex.push(index);
			if(_type == Constant.BuffType.BUFF_TYPE_CARMOTCOLLECT || _type == Constant.BuffType.BUFF_TYPE_RESOURCECOLLECT)
			{
				_type = Constant.BuffType.BUFF_TYPE_RESOURCE;
			}
			addBuffIcon(_type);
		}
		
		if(handleBuffUpdate)
		{
			handleBuffUpdate();
		}
	}
	
	public function getArrayForScrollList():Array
	{
		var array1:Array = new Array();
		var array2:Array = new Array();
		var displayData:Object;
		var queueItem:QueueItem;
		
		var a:int = 0;
		
		for(a = 0; a < g_allBuffItems.length; a++)
		{	
			queueItem = g_allBuffItems[a];
			
			if((queueItem.itemType == Constant.BuffType.BUFF_TYPE_FRESHMAN || queueItem.itemType == Constant.BuffType.BUFF_TYPE_TRAINTROOP) && queueItem.timeRemaining <= 0)
			{
				continue;
			}
			
			if(queueItem.itemType == Constant.BuffType.BUFF_TYPE_PEASE)
			{				
				var freshManTime:long = getExpireTimeByType(Constant.BuffType.BUFF_TYPE_FRESHMAN, 0);
				var curTime:long = GameMain.unixtime();				
				
				if(freshManTime > curTime)
				{
					continue;
				}
			}
											
			if(_Global.IsValueInArray(g_usedBuffIndex, a))
			{
				array1.push(createItemData(queueItem));
			}
			else
			{
				array2.push(createItemData(queueItem));
			}
		}
		
		array1 = array1.concat(array2);
		
		return array1;
	}
	
	private function getItemCount(id:int):int	
	{
		var seed:HashObject = GameMain.instance().getSeed();
		return seed["items"]["i" + id] ? _Global.INT32(seed["items"]["i" + id]) : 0;
	}
	
	public function getSubMenuInfor(_type:int, _id:int):Object	
	{
		var buffItem:BuffItem;
		var arString:Datas = Datas.instance();
		var obj:Hashtable;
		var arr:Array = new Array();
		var item:Hashtable;
		
		var index:int = getIndexInAllBuffsByCategory(_type, _id);
		var queueItem:QueueItem = g_allBuffItems[index];
		
		switch(_type)
		{
			case Constant.BuffType.BUFF_TYPE_RESOURCE:
				
				var itemId:int = queueItem.id;
				
				if (queueItem.id == 3400)
				{
					for (var s:int = 0; s < 100; s++)
					{
						itemId = 3400 + s;
						if (MyItems.instance().countForItem(itemId) > 0) {
							buffItem = new BuffItem();
							buffItem.parseBuffItem(_type, itemId, Shop.ATTACK);
							buffItem.sub_icon = Datas.instance().getImageName(itemId);
							arr.Push(buffItem);
						}
					}

					obj = {
						"type":_type,
						"id":_id,
						"icon":resourceRationPath,
						"des":Datas.getArString("BuffDescription.Ration"),
						"endTime":queueItem.endTime,
						"items":arr
					};
				}
				else
				{
					buffItem = new BuffItem();
					buffItem.parseBuffItem(_type, queueItem.id, Shop.PRODUCT);
					arr.Push(buffItem);

					buffItem = new BuffItem();
					buffItem.parseBuffItem(_type, queueItem.id + 1, Shop.PRODUCT);
					arr.Push(buffItem);
					
					itemId = queueItem.id * 0.1 - 10;
					
					obj = {
						"type":_type,
						"id":_id,
						"icon":resourcePath + queueItem.level,
						"des":arString.getArString("BuffDescription."+"Resource" + itemId),
						"endTime":queueItem.endTime,
						"items":arr
					};
				}
				break;
			case Constant.BuffType.BUFF_TYPE_ANTI_SCOUT:
				
				buffItem = new BuffItem();	
				buffItem.type = _type;
				buffItem.sub_icon = antiscoutPath;
				buffItem.sub_des = arString.getArString("WatchTower.AntiScoutDesc");
				buffItem.sub_name = arString.getArString("WatchTower.AntiScouting");
				buffItem.sub_owned = 0;
				buffItem.sub_price = 5;
				buffItem.sub_salePrice = 5;
				arr.Push(buffItem);	
		
				obj = {
					"type":_type,
					"id":_id,
					"icon":antiscoutPath,
					"des":arString.getArString("BuffDescription.AntiScout"),
					"endTime":queueItem.endTime,
					"items":arr
					};										
						
				break;
			case Constant.BuffType.BUFF_TYPE_COMBAT:

				if (queueItem.id == 261 || queueItem.id == 271 )
				{
					buffItem = new BuffItem();
					buffItem.parseBuffItem(_type, queueItem.id, Shop.ATTACK);
					arr.Push(buffItem);

					buffItem = new BuffItem();
					buffItem.parseBuffItem(_type, queueItem.id + 1, Shop.ATTACK);
					arr.Push(buffItem);	
				}
							
				for(s = 1;s<=2;s++)
				{
					var battleItemId:int;
					if(queueItem.id == 261)
					{
						battleItemId = queueItem.id+ 10 + s*10;
						if(MyItems.instance().countForItem(battleItemId) > 0)
						{
							//arr.Push(newBuffItem(battleItemId, _type, Shop.ATTACK, "i262"));
							buffItem = new BuffItem();
							buffItem.parseBuffItem(_type, battleItemId, Shop.ATTACK);
							buffItem.sub_icon = "i262";
							arr.Push(buffItem);
										
						}
					}
					else
					{
						battleItemId = queueItem.id+ 20 + s*10;
						if(MyItems.instance().countForItem(battleItemId) > 0)
						{
							//arr.Push(newBuffItem(battleItemId, _type, Shop.ATTACK, "i272"));
							buffItem = new BuffItem();
							buffItem.parseBuffItem(_type, battleItemId, Shop.ATTACK);
							buffItem.sub_icon = "i272";
							arr.Push(buffItem);									
						}
					}
				}
				
				if (queueItem.id == 261 || queueItem.id == 271)
				{
					// rules broken ..  263/273 as non-buyable item
					battleItemId = queueItem.id + 2;
					if (MyItems.instance().countForItem(battleItemId) > 0) {
						buffItem = new BuffItem();
						buffItem.parseBuffItem(_type, battleItemId, Shop.ATTACK);
						buffItem.sub_icon = "i" + (queueItem.id + 1);
						arr.Push(buffItem);
					}
					//264/274
					battleItemId = queueItem.id + 3;
					if (MyItems.instance().countForItem(battleItemId) > 0) {
						buffItem = new BuffItem();
						buffItem.parseBuffItem(_type, battleItemId, Shop.ATTACK);
						buffItem.sub_icon = "i" + (queueItem.id + 3);
						arr.Push(buffItem);
					}
				}
				else if(queueItem.id == 265 || queueItem.id == 275)
				{
					battleItemId = queueItem.id;
					if (MyItems.instance().countForItem(battleItemId) > 0) {
						buffItem = new BuffItem();
						buffItem.parseBuffItem(_type, battleItemId, Shop.ATTACK);
						buffItem.sub_icon = "i" + (queueItem.id);
						arr.Push(buffItem);
					}
				}
				else if (queueItem.id == 410)
				{
					for (s = 0; s < 3; s++)
					{
						battleItemId = queueItem.id + s;
						if (MyItems.instance().countForItem(battleItemId) > 0) {
							buffItem = new BuffItem();
							buffItem.parseBuffItem(_type, battleItemId, Shop.ATTACK);
							buffItem.sub_icon = Datas.instance().getImageName(battleItemId);
							arr.Push(buffItem);
						}
					}
				}
				else if (queueItem.id == 3300 || queueItem.id == 3500 || queueItem.id == 3600)
				{
					for (s = 0; s < 100; s++)
					{
						battleItemId = queueItem.id + s;
						if (MyItems.instance().countForItem(battleItemId) > 0) {
							buffItem = new BuffItem();
							buffItem.parseBuffItem(_type, battleItemId, Shop.ATTACK);
							buffItem.sub_icon = Datas.instance().getImageName(battleItemId);
							arr.Push(buffItem);
						}
					}
				}
				
				if(queueItem.id == 261)
				{
					obj = {
						"type":_type,
						"id":_id,
						"icon":combatAttackPath,
						"des":arString.getArString("BuffDescription.IncreaseAttackBy"),
						"endTime":queueItem.endTime,
						"items":arr
						};				
				}
				else if (queueItem.id == 271) 
				{					
					obj = {
						"type":_type,
						"id":_id,
						"icon":combatDefencePath,
						"des":arString.getArString("BuffDescription.IncreaseDefenseBy"),
						"endTime":queueItem.endTime,
						"items":arr
						};	
				}
				else if(queueItem.id == 265)
				{
					obj = {
							"type":_type,
							"id":_id,
							"icon":combatFoeAttackPath,
							"des":arString.getArString("BuffDescription.FoeAttackBy"),
							"endTime":queueItem.endTime,
							"items":arr
							};	
				}
				else if(queueItem.id == 275)
				{
					obj = {
							"type":_type,
							"id":_id,
							"icon":combatFoeDefencePath,
							"des":arString.getArString("BuffDescription.FoeLifeBy"),
							"endTime":queueItem.endTime,
							"items":arr
							};	
				}
				else if (queueItem.id == 410) 
				{					
					obj = {
						"type":_type,
						"id":_id,
						"icon":combatMarchsizePath,
						"des":arString.getArString("BuffDescription.IncreaseMarchSizeby"),
						"endTime":queueItem.endTime,
						"items":arr
						};	
				}
				else if (queueItem.id == 3300)
				{					
					obj = {
						"type":_type,
						"id":_id,
						"icon":combatHealBuffPath,
						"des":arString.getArString("BuffDescription.IncreaseHealSizeby"),
						"endTime":queueItem.endTime,
						"items":arr
						};	
				}
				else if (queueItem.id == 3500)
				{					
					obj = {
						"type":_type,
						"id":_id,
						"icon":combatPVELuckBuffPath,
						"des":arString.getArString("BuffDescription.IncreaseHealSizeby"),
						"endTime":queueItem.endTime,
						"items":arr
						};	
				}
				else if (queueItem.id == 3600)
				{					
					obj = {
						"type":_type,
						"id":_id,
						"icon":combatWorldLuckBuffPath,
						"des":arString.getArString("BuffDescription.IncreaseHealSizeby"),
						"endTime":queueItem.endTime,
						"items":arr
						};	
				}

				break;
			case Constant.BuffType.BUFF_TYPE_CARMOTCOLLECT:
				if (queueItem.id == 3000)
				{
					var carmotCollectId : int = 144;
					for (s = 0; s < 4; s++)
					{
						battleItemId = carmotCollectId + s;
						if (MyItems.instance().countForItem(battleItemId) > 0) {
							buffItem = new BuffItem();
							buffItem.parseBuffItem(_type, battleItemId, Shop.ATTACK);
							buffItem.sub_icon = Datas.instance().getImageName(battleItemId);
							arr.Push(buffItem);				
						}
					}
					
					obj = {
						"type":_type,
						"id":_id,

						"icon":carmotCollect,
						"des":getCarmotCollectBuffDes(),
						"endTime":queueItem.endTime,
						"items":arr
					};	
				}
				
				break;
			case Constant.BuffType.BUFF_TYPE_RESOURCECOLLECT:
				if (queueItem.id == 3001)
				{
					var resourceCollectId : int = 148;
					for (s = 0; s < 2; s++)
					{
						battleItemId = resourceCollectId + s;
						if (MyItems.instance().countForItem(battleItemId) > 0) {
							buffItem = new BuffItem();
							buffItem.parseBuffItem(_type, battleItemId, Shop.ATTACK);
							buffItem.sub_icon = Datas.instance().getImageName(battleItemId);
							arr.Push(buffItem);				
						}
					}
					
					obj = {
						"type":_type,
						"id":_id,

						"icon":resourceCollect,
						"des":getResourceCollectBuffDes(),
						"endTime":queueItem.endTime,
						"items":arr
					};	
				}
				
				break;
				
			case Constant.BuffType.BUFF_TYPE_PEASE:
			
				buffItem = new BuffItem();
				buffItem.parseBuffItem(_type, queueItem.id, Shop.ATTACK);
				arr.Push(buffItem);
				/*
				buffItem.id = queueItem.id;
				buffItem.type = _type;
				buffItem.sub_icon = peasePath + buffItem.id;
				buffItem.sub_des = arString.getArString("itemDesc."+"i" + buffItem.id);
				buffItem.sub_name = arString.getArString("itemName."+"i" + buffItem.id);
				buffItem.sub_owned = getItemCount(buffItem.id);
				
				item = Shop.instance().getItem(Shop.ATTACK, buffItem.id);
				buffItem.sub_price = item["price"];
				buffItem.sub_salePrice = item["salePrice"];
				buffItem.startTime = _Global.INT64(item["startTime"]);
				buffItem.endTime = _Global.INT64(item["endTime"]);
				buffItem.isShow = item["isShow"];*/					
		
				buffItem = new BuffItem();
				buffItem.parseBuffItem(_type, queueItem.id + 2, Shop.ATTACK);
				arr.Push(buffItem);	
				/*
				buffItem.id = queueItem.id + 2;
				buffItem.type = _type;
				buffItem.sub_icon = peasePath + buffItem.id;
				buffItem.sub_des = arString.getArString("itemDesc."+"i" + buffItem.id);
				buffItem.sub_name = arString.getArString("itemName."+"i" + buffItem.id);
				buffItem.sub_owned = getItemCount(buffItem.id);
				
				item = Shop.instance().getItem(Shop.ATTACK, buffItem.id);
				buffItem.sub_price = item["price"];
				buffItem.sub_salePrice = item["salePrice"];
				buffItem.startTime = _Global.INT64(item["startTime"]);
				buffItem.endTime = _Global.INT64(item["endTime"]);	
				buffItem.isShow = item["isShow"];*/
				
				buffItem = new BuffItem();
				buffItem.parseBuffItem(_type, queueItem.id + 3, Shop.ATTACK);
				arr.Push(buffItem);
				
				buffItem = new BuffItem();
				buffItem.parseBuffItem(_type, queueItem.id + 4, Shop.ATTACK);
				arr.Push(buffItem);
				/*
				buffItem.id = queueItem.id + 3;
				buffItem.type = _type;
				buffItem.sub_icon = peasePath + buffItem.id;
				buffItem.sub_des = arString.getArString("itemDesc."+"i" + buffItem.id);
				buffItem.sub_name = arString.getArString("itemName."+"i" + buffItem.id);
				buffItem.sub_owned = getItemCount(buffItem.id);

				item = Shop.instance().getItem(Shop.ATTACK, buffItem.id);
				buffItem.sub_price = item["price"];
				buffItem.sub_salePrice = item["salePrice"];
				buffItem.startTime = _Global.INT64(item["startTime"]);
				buffItem.endTime = _Global.INT64(item["endTime"]);	
				buffItem.isShow = item["isShow"];*/

				obj = {
					"type":_type,
					"id":_id,

					"icon":peasePath + (buffItemIds[1] as int[])[0],
					"des":arString.getArString("BuffDescription.Pease"),
					"endTime":queueItem.endTime,
					"items":arr
					};	
					
				break;
			case Constant.BuffType.BUFF_TYPE_FRESHMAN:
			case Constant.BuffType.BUFF_TYPE_TRAINTROOP:
				break;
		}	

		return obj;
	}
	
	/*
	private function newBuffItem(itemId:int, _type:int, shopCategory:int, iconName:String):BuffItem
	{
		var item:Hashtable;
		var arString:Datas = Datas.instance();
		var buffItem:BuffItem = new BuffItem();
		buffItem.id = itemId;
		buffItem.type = _type;
		buffItem.sub_icon = iconName;
		buffItem.sub_des = arString.getArString("itemDesc."+"i" + buffItem.id);
		buffItem.sub_name = arString.getArString("itemName."+"i" + buffItem.id);
		buffItem.sub_owned = getItemCount(buffItem.id);

		item = Shop.instance().getItem(shopCategory, buffItem.id);
		buffItem.sub_price = item["price"];
		buffItem.sub_salePrice = item["salePrice"];
		buffItem.startTime = _Global.INT64(item["startTime"]);
		buffItem.endTime = _Global.INT64(item["endTime"]);
		buffItem.isShow = item["isShow"];
			
		return buffItem;
	}*/
	
	private static var resourcePath:String = "icon_rec";
	private static var combatAttackPath:String = "buff_icon_attack";
	private static var combatDefencePath:String = "buff_icon_defend";
	private static var combatMarchsizePath:String = "buff_icon_marchsize";
	private static var combatHealBuffPath:String = "buff_icon_heal";
	private static var combatPVELuckBuffPath:String = "buff_icon_luck_PVE";
	private static var combatWorldLuckBuffPath:String = "buff_icon_luck_world";
	private static var combatFoeAttackPath:String = "buff_icon_foeattack";
	private static var combatFoeDefencePath:String = "buff_icon_foedefend";
	
	private static var resourceRationPath:String = "buff_icon_ration";
	private static var freshmanPath:String = "buff_0_icon";
	private static var trainTroopPath:String = "timg_5";
	private static var carmotCollect:String = "icon_rec7";
	private static var resourceCollect:String = "icon_rec_Collect";
	private static var antiscoutPath:String = "buff_2_icon";
	private static var peasePath:String = "i";
	
	private function createItemData(queueItem:QueueItem):Object
	{
		var _type:int = queueItem.itemType;
		var itemId:int = queueItem.id;
		var description:String = "";
		var alert:String = "";
		var picPath:String = "";
		var returnData:Hashtable;
		var canClick:boolean = true;
		var arString:Datas = Datas.instance();
		
		var seed:HashObject = GameMain.instance().getSeed();
		var curtime:long = GameMain.unixtime();
		
		switch(_type)
		{
			case Constant.BuffType.BUFF_TYPE_RESOURCE:
				if (itemId == 3400)
				{
					var cityOrder:int = GameMain.instance().getCurCityOrder();
					var expireTime:long = _Global.INT64(seed["bonus"]["bC3400"]["bT340" + cityOrder]);
					description = Datas.getArString("BuffDescription.Ration");
					picPath = resourceRationPath;
					canClick = true;
				}
				else
				{
					picPath = resourcePath + queueItem.level;
					itemId = itemId * 0.1 - 10;
					description = arString.getArString("BuffDescription."+"Resource" + itemId);
				}
				break;
			case Constant.BuffType.BUFF_TYPE_ANTI_SCOUT:
				picPath = antiscoutPath;
				description = arString.getArString("BuffDescription.AntiScout");
				var cityId:int = GameMain.instance().getCurCityId();
				
				if(!Building.instance().hasBuildingbyType(cityId, Constant.Building.WATCH_TOWER))
				{
					alert = Datas.getArString("BuffDescription.NoWatchTower");
					canClick = false;
				}
				else
				{
					if(queueItem.timeRemaining > 0)
					{
						canClick = false;
					}
				}
			
				break;
			case Constant.BuffType.BUFF_TYPE_COMBAT:
				var EffectLevel:int = 0;
				if(itemId == 261)
				{
					picPath = combatAttackPath;
								
					if(curtime < _Global.INT64(seed["bonus"]["bC2600"]["bT2601"].Value))
						EffectLevel += 20;
					if(curtime < _Global.INT64(seed["bonus"]["bC2600"]["bT2604"].Value))
						EffectLevel += 50;
					if(curtime < _Global.INT64(seed["bonus"]["bC2600"]["bT2602"].Value))
						EffectLevel += 100;
					if(curtime < _Global.INT64(seed["bonus"]["bC2600"]["bT2605"].Value))
						EffectLevel += 130;
						
					EffectLevel += _Global.INT32(seed["bonus"]["bC2600"]["bT2603"].Value);
					
					var attackBuff = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Attack, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));
					EffectLevel += _Global.INT32(100.0f * attackBuff.Percentage);
					
					description = EffectLevel > 0?arString.getArString("BuffDescription.IncreaseAttackBy",[EffectLevel]) : arString.getArString("BuffDescription.IncreaseAttack");
				}
				else if (itemId == 271) 
				{
					picPath = combatDefencePath;
										
					if(curtime < _Global.INT64(seed["bonus"]["bC2700"]["bT2701"].Value))
						EffectLevel += 20;
					if(curtime < _Global.INT64(seed["bonus"]["bC2700"]["bT2704"].Value))
						EffectLevel += 50;
					if(curtime < _Global.INT64(seed["bonus"]["bC2700"]["bT2702"].Value))
						EffectLevel += 100;
					if(curtime < _Global.INT64(seed["bonus"]["bC2700"]["bT2705"].Value))
						EffectLevel += 130;
						
					EffectLevel += _Global.INT32(seed["bonus"]["bC2700"]["bT2703"].Value);
					
					var lifeBuff = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Life, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));
					EffectLevel += _Global.INT32(100.0f * lifeBuff.Percentage);

					description = EffectLevel > 0? arString.getArString("BuffDescription.IncreaseDefenseBy",[EffectLevel]):arString.getArString("BuffDescription.IncreaseDefense");					
				}
				else if(itemId == 265)
				{
					picPath = combatFoeAttackPath;
								
					if(curtime < _Global.INT64(seed["bonus"]["bC2800"]["bT2801"].Value))
						EffectLevel += 20;
					description = EffectLevel > 0? arString.getArString("BuffDescription.FoeAttackBy",[EffectLevel]):arString.getArString("BuffDescription.FoeAttack");					
				}
				else if(itemId == 275)
				{
					picPath = combatFoeDefencePath;
										
					if(curtime < _Global.INT64(seed["bonus"]["bC2900"]["bT2901"].Value))
						EffectLevel += 20;
					description = EffectLevel > 0? arString.getArString("BuffDescription.FoeLifeBy",[EffectLevel]):arString.getArString("BuffDescription.FoeLife");					
				}
				else if (itemId == 410)
				{
					if (curtime < _Global.INT64(seed["bonus"]["bC410"][_Global.ap + 1].Value))
					{
						description = String.Format(Datas.getArString("BuffDescription.IncreaseMarchSizeby"), seed["bonus"]["bC410"][_Global.ap + 0].Value);
					}
					else
					{
						description = Datas.getArString("BuffDescription.IncreaseMarchSize");
					}
					picPath = combatMarchsizePath;
					canClick = true;
				}
				else if (itemId == 3300)
				{
					if (curtime < _Global.INT64(seed["bonus"]["bC3300"][_Global.ap + 1].Value))
					{
						description = String.Format(Datas.getArString("BuffDescription.IncreaseHealSizeby"), seed["bonus"]["bC3300"][_Global.ap + 0].Value);
					}
					else
					{
						description = Datas.getArString("BuffDescription.IncreaseHealSize");
					}
					picPath = combatHealBuffPath;
					canClick = true;
				}
				else if (itemId == 3500)
				{
					description = Datas.getArString("BuffDescription.PVElucky");
					picPath = combatPVELuckBuffPath;
					canClick = true;
				}
				else if (itemId == 3600)
				{
					description = Datas.getArString("BuffDescription.WildLucky");
					picPath = combatWorldLuckBuffPath;
					canClick = true;
				}
				break;
			case Constant.BuffType.BUFF_TYPE_PEASE:

				description = arString.getArString("BuffDescription.Pease");
				picPath = peasePath + (buffItemIds[1] as int [])[0];

				
				if(queueItem.timeRemaining > 0)
				{
					canClick = false;
				}	
				break;
			case Constant.BuffType.BUFF_TYPE_FRESHMAN:
				description = arString.getArString("BuffDescription.FreshMan");
				picPath = freshmanPath;
				canClick = false;
				break;
			case Constant.BuffType.BUFF_TYPE_TRAINTROOP:
				var trainBuff:float = SeasonLeagueMgr.instance().GetTrainTroopBuff(KBN.GameMain.singleton.GetAllianceLeague());
				description = String.Format(arString.getArString("BuffDescription.TrainTroop"),trainBuff);
				picPath = trainTroopPath;
				canClick = false;
				break;
			case Constant.BuffType.BUFF_TYPE_CARMOTCOLLECT:				
				description = getCarmotCollectBuffDes();
				picPath = carmotCollect;
				canClick = true;
				break;
			case Constant.BuffType.BUFF_TYPE_RESOURCECOLLECT:				
				description = getResourceCollectBuffDes();
				picPath = resourceCollect;
				canClick = true;
				break;
		}		
		
		returnData = {"description":description, 
					  "alert":alert, 
					  "path":picPath, 
					  "endTime":queueItem.endTime,
					  "canClick":canClick,
					  "type":_type,
					  "itemId":queueItem.id};
					  
		return returnData;
	}
	
	public function getCarmotCollectBuffDes() : String
	{
		var desString : String;
		var buffType : int = getCarmotCollectBuffType();					
		if(buffType == 0)
		{
			desString = Datas.getArString("BuffDescription.CarmotCollect_Text1");
		}
		else if(buffType == 1)
		{
			desString = String.Format(Datas.getArString("BuffDescription.CarmotCollect_Text2"), "50");
		}
		else
		{
			desString = String.Format(Datas.getArString("BuffDescription.CarmotCollect_Text2"), "100");
		}
		
		return desString;
	}
	
	// 0 no buff;1 50%buff; 2 100%buff
	public function getCarmotCollectBuffType() : int
	{
		var seed:HashObject = GameMain.instance().getSeed();
		if(seed["bonus"]!=null && seed["bonus"]["bC3000"]!=null)
		{
			if(seed["bonus"]["bC3000"]["bT3001"] != null && _Global.INT64(seed["bonus"]["bC3000"]["bT3001"]) != 0)
			{
				if(GameMain.unixtime() > _Global.INT64(seed["bonus"]["bC3000"]["bT3001"]))
				{
					seed["bonus"]["bC3000"]["bT3001"].Value = "" + 0;
					return 0;
				}
				return 1;
			}
			else if(seed["bonus"]["bC3000"]["bT3002"] != null && _Global.INT64(seed["bonus"]["bC3000"]["bT3002"]) != 0)
			{
				if(GameMain.unixtime() > _Global.INT64(seed["bonus"]["bC3000"]["bT3002"]))
				{
					seed["bonus"]["bC3000"]["bT3002"].Value = "" + 0;
					return 0;
				}
				return 2;
			}
			else
			{
				return 0;
			}
		}
		else
		{
			return 0;
		}
	}

	public function getResourceCollectBuffDes() : String
	{
		var desString : String;
		var buffType : int = getResourceCollectBuffType();					
		if(buffType == 0)
		{
			desString = Datas.getArString("BuffDescription.ResourceCollect_Text1");
		}
		else if(buffType == 1)
		{
			desString = String.Format(Datas.getArString("BuffDescription.ResourceCollect_Text2"), "50");
		}
		
		return desString;
	}

	public function getResourceCollectBuffType() : int
	{
		var seed:HashObject = GameMain.instance().getSeed();
		if(seed["bonus"]!=null && seed["bonus"]["bC3000"]!=null)
		{
			if(seed["bonus"]["bC3000"]["bT3003"] != null && _Global.INT64(seed["bonus"]["bC3000"]["bT3003"]) != 0)
			{
				if(GameMain.unixtime() > _Global.INT64(seed["bonus"]["bC3000"]["bT3003"]))
				{
					seed["bonus"]["bC3000"]["bT3003"].Value = "" + 0;
					return 0;
				}
				return 1;
			}
			else
			{
				return 0;
			}
		}
		else
		{
			return 0;
		}
	}
	
	public function updateAlert():void
	{
		g_beAttackedNum = Watchtower.instance().GetAttackNumOfCurCity();
		
		if(g_beAttackedNum != g_lastAttackNum)
		{
			g_isUpdateAlert = true;
			g_lastAttackNum = g_beAttackedNum;
		}
	}
	
	public function update():void
	{
		var tempQueueItem:QueueItem;
		var arra:Array = new Array();
		
		g_present = GameMain.unixtime();
		
		if(g_present - g_lastCheckAlertTime < CHECK_ALERT_INTERVAL)
		{
			return;
		}
		else
		{
			g_lastCheckAlertTime = g_present;
		}		
		
		if(g_usedBuffIndex.length > 0)
		{
			for(var a:int = 0; a < g_usedBuffIndex.length; a++)
			{
				tempQueueItem = g_allBuffItems[g_usedBuffIndex[a]];
				tempQueueItem.calcRemainingTime();
				
				if(tempQueueItem.timeRemaining <= 0)
				{
					g_usedBuffIndex.splice(a,1);
					deleteBuffIcon(tempQueueItem.itemType);
					a--;
				}
			}		
		}
		
		if(g_lastAttackNum > 0)
		{
			g_beAttackedNum = Watchtower.instance().GetAttackNumOfCurCity();
			
			if(g_beAttackedNum != g_lastAttackNum)
			{
				g_isUpdateAlert = true;
				g_lastAttackNum = g_beAttackedNum;
			}
		}
	}
	
	private function addBuffIcon(buffType:int):void
	{
		if(!_Global.IsValueInArray(g_buffIconForMainChrome, buffType))
		{
			g_buffIconForMainChrome.push(buffType);
			g_isUpdateBuff = true;
			g_pveUpdateBuff=true;
		}
	}
	
	private function deleteBuffIcon(buffType:int):void
	{
		if(g_usedBuffIndex.length > 0)
		{
			var tempQueueItem:QueueItem;
			var hasSameBuffType:boolean = false;
			for(var a:int = 0; a < g_usedBuffIndex.length; a++)
			{
				tempQueueItem = g_allBuffItems[g_usedBuffIndex[a]];
				if(tempQueueItem.itemType == buffType)
				{
					hasSameBuffType = true;
				}
			}
			
			if(!hasSameBuffType)
			{
				var index:int = _Global.IndexOf(g_buffIconForMainChrome, buffType);
				if(index >= 0)
				{
					g_buffIconForMainChrome.splice(index, 1);
					g_isUpdateBuff = true;
					g_pveUpdateBuff=true;
				}
			}
		}
		else
		{
			g_buffIconForMainChrome.clear();
			g_isUpdateBuff = true;
			g_pveUpdateBuff=true;
		}
	}
	
	private function InitAllBuffs():void
	{
		var tempQueueItem:QueueItem;
		
		for(var a:int = 0; a < buffItemIds.length; a++)
		{
			var buffIds:int[] = buffItemIds[a];
			for(var b:int = 0; b < buffIds.length; b++)
			{
				tempQueueItem = new QueueItem();
				
				tempQueueItem.itemType = a;
				tempQueueItem.id = buffIds[b];
				tempQueueItem.level = b;
				tempQueueItem.endTime = getExpireTimeByType(a, buffIds[b]);
				tempQueueItem.timeRemaining = tempQueueItem.endTime - GameMain.unixtime();

				g_allBuffItems.push(tempQueueItem);
				
				if(tempQueueItem.timeRemaining > 0)
				{
					g_usedBuffIndex.push(g_allBuffItems.length - 1);
					var _type : int = a;
					if(_type == Constant.BuffType.BUFF_TYPE_CARMOTCOLLECT || _type == Constant.BuffType.BUFF_TYPE_RESOURCECOLLECT)
					{
						_type = Constant.BuffType.BUFF_TYPE_RESOURCE;
					}
					addBuffIcon(_type);
				}			
			}
		}
	}
	
	private function getIndexInAllBuffsByCategory(_type:int, category:int):int
	{	
		var _index:int = 0;
		var index:int = 0;
		
		for(var a:int = 0; a < buffItemIds.length; a++)
		{
			var ids:int[] = buffItemIds[a];
			if(a == _type)
			{
				for(var b:int = 0; b < ids.length; b++)
				{
					if(ids[b] == category)
					{
						index = b;
						break;
					}
				}
				_index += index;
				break;
			}
			else
			{
				_index += ids.length;
			}
		}
		
		return _index;
	}
	
	private function getIndexInAllBuffs(_type:int, itemId:int):int
	{
		var index:int;
		switch(_type)
		{
			case Constant.BuffType.BUFF_TYPE_FRESHMAN:
			case Constant.BuffType.BUFF_TYPE_TRAINTROOP:
			case Constant.BuffType.BUFF_TYPE_PEASE:
			case Constant.BuffType.BUFF_TYPE_ANTI_SCOUT:
				index = 0;
				break;
			case Constant.BuffType.BUFF_TYPE_COMBAT:
				if(itemId == 261 || itemId == 262 || itemId == 263 || itemId == 264 || itemId == 281 || itemId == 291)
				{
					index = 0;
				}
				else if (itemId == 271 || itemId == 272 || itemId == 273 || itemId == 274 || itemId == 301 || itemId == 311) 
				{
					index = 1;
				}
				else if (itemId == 410 || itemId == 411 || itemId == 412) 
				{
					index = 2;
				}
//				else if (itemId >= 3300 && itemId < 3400)
//				{
//					index = 3;
//				}
				else if (itemId >= 3500 && itemId < 3600)
				{
					index = 3;
				}
				else if (itemId >= 3600 && itemId < 3700)
				{
					index = 4;
				}
				else if(itemId == 265)
				{
					index = 5;
				}
				else if(itemId == 275)
				{
					index = 6;
				}
				break;
			case Constant.BuffType.BUFF_TYPE_RESOURCE:
				if (_Global.IsValueInArray( Constant.ResourceBoostIds.GOLD,itemId)) 
				{
					index = 0;
				} 
				else if (_Global.IsValueInArray(Constant.ResourceBoostIds.FOOD,itemId)) 
				{ 
					index = 1;
				} 
				else if (_Global.IsValueInArray(Constant.ResourceBoostIds.LUMBER,itemId)) 
				{ 
					index = 2;
				} 
				else if (_Global.IsValueInArray(Constant.ResourceBoostIds.STONE,itemId)) 
				{
					index = 3;
				} 
				else if (_Global.IsValueInArray(Constant.ResourceBoostIds.IRON,itemId)) 
				{
					index = 4;
				}
				else if (itemId >= 3400 && itemId < 3500)
				{
					index = 5;
				}
				break;
		}
		
		var _index:int = 0;
		for(var a:int = 0; a < buffItemIds.length; a++)
		{
			if(a == _type)
			{
				_index += index;
				break;
			}
			else
			{
				var ids:int[] = buffItemIds[a];
				_index += ids.length;
			}
		}
		
		return _index;
	}
	
	private function maxOfFour(a:long, b:long, c:long,d:long):long
	{
		var ret:long = c;
		
		var minofAB:long = a>b?a:b;
		var minofCD:long = c>d?c:d;
		ret = minofAB > minofCD ? minofAB : minofCD;
		return ret;
	}
	
	private function getExpireTimeByType(_type:int, itemId:int):long
	{
		var returnValue:long = 0;
		var seed:HashObject = GameMain.instance().getSeed();
		
		switch(_type)
		{
			case Constant.BuffType.BUFF_TYPE_RESOURCE:
				if (_Global.IsValueInArray( Constant.ResourceBoostIds.GOLD,itemId)) 
				{
					returnValue = _Global.INT64(seed["bonus"]["bC1000"]["bT1001"]);
				} 
				else if (_Global.IsValueInArray(Constant.ResourceBoostIds.FOOD,itemId)) 
				{
					returnValue = _Global.INT64(seed["bonus"]["bC1100"]["bT1101"]);
				} 
				else if (_Global.IsValueInArray(Constant.ResourceBoostIds.LUMBER,itemId)) 
				{
					returnValue = _Global.INT64(seed["bonus"]["bC1200"]["bT1201"]);
				} 
				else if (_Global.IsValueInArray(Constant.ResourceBoostIds.STONE,itemId)) 
				{
					returnValue = _Global.INT64(seed["bonus"]["bC1300"]["bT1301"]);
				} 
				else if (_Global.IsValueInArray(Constant.ResourceBoostIds.IRON,itemId)) 
				{
					returnValue = _Global.INT64(seed["bonus"]["bC1400"]["bT1401"]);
				}				
				else if (itemId >= 3400 && itemId < 3500)
				{
					var cityOrder:int = GameMain.instance().getCurCityOrder();
					returnValue = _Global.INT64(seed["bonus"]["bC3400"]["bT340" + cityOrder]);
				}
				break;
			case Constant.BuffType.BUFF_TYPE_ANTI_SCOUT:
				var currentcityid:int = GameMain.instance().getCurCityId();
				returnValue = _Global.INT64(seed["antiscouting"]["city" + currentcityid]);
				break;
			case Constant.BuffType.BUFF_TYPE_COMBAT:
				if (itemId == 261 || itemId == 262 || itemId == 263 || itemId == 264 || itemId == 281 || itemId == 291) 
				{
					var bT2601:long = _Global.INT64(seed["bonus"]["bC2600"]["bT2601"]) - GameMain.unixtime();//20%
					var bT2604:long = _Global.INT64(seed["bonus"]["bC2600"]["bT2604"]) - GameMain.unixtime();//50%
					var bT2602:long = _Global.INT64(seed["bonus"]["bC2600"]["bT2602"]) - GameMain.unixtime();//100%
					var bT2605:long = _Global.INT64(seed["bonus"]["bC2600"]["bT2605"]) - GameMain.unixtime();//130%
					
					var attackBuff = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Attack, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));
					var attackTimeLeft = attackBuff.Eta - GameMain.unixtime();
					
					returnValue = maxOfFour(bT2601, bT2604, bT2602,bT2605);
					
					if (returnValue <= 0 || (attackTimeLeft  > 0 && attackTimeLeft < returnValue))
						returnValue = attackTimeLeft;
					
					returnValue += GameMain.unixtime();
				} 
				else if (itemId == 271 || itemId == 272 || itemId == 273 || itemId == 274 || itemId == 301 || itemId == 311) 
				{
					var bT2701:long = _Global.INT64(seed["bonus"]["bC2700"]["bT2701"]) - GameMain.unixtime();
					var bT2704:long = _Global.INT64(seed["bonus"]["bC2700"]["bT2704"]) - GameMain.unixtime();
					var bT2702:long = _Global.INT64(seed["bonus"]["bC2700"]["bT2702"]) - GameMain.unixtime();
					var bT2705:long = _Global.INT64(seed["bonus"]["bC2700"]["bT2705"]) - GameMain.unixtime();
					
					var lifeBuff = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Life, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));
					var lifeTimeLeft = lifeBuff.Eta - GameMain.unixtime();
					
					returnValue = maxOfFour(bT2701, bT2704, bT2702,bT2705);
					
					if (returnValue <= 0 || (lifeTimeLeft > 0 && lifeTimeLeft < returnValue))
						returnValue = lifeTimeLeft;
						
					returnValue += GameMain.unixtime();
					//returnValue = _Global.INT64(seed["bonus"]["bC2700"]["bT2701"]);
				}
				else if(itemId == 265)
				{
					returnValue = _Global.INT64(seed["bonus"]["bC2800"]["bT2801"]);
				}
				else if(itemId == 275)				
				{
					returnValue = _Global.INT64(seed["bonus"]["bC2900"]["bT2901"]);
				}
				else if (itemId == 410 || itemId == 411 || itemId == 412)
				{
					returnValue = _Global.INT64(seed["bonus"]["bC410"][_Global.ap + 1]);
				}
				else if (itemId >= 3300 && itemId < 3400)
				{
					returnValue = _Global.INT64(seed["bonus"]["bC3300"][_Global.ap + 1]);
				}
				else if (itemId >= 3500 && itemId < 3600)
				{
					returnValue = _Global.INT64(seed["bonus"]["bC3500"]["bT3501"]);
				}
				else if (itemId >= 3600 && itemId < 3700)
				{
					returnValue = _Global.INT64(seed["bonus"]["bC3500"]["bT3502"]);
				}
				break;
			case Constant.BuffType.BUFF_TYPE_TRAINTROOP:
				if(seed["bonus"]!=null && seed["bonus"]["bC3100"]!=null)
				{
					returnValue = _Global.INT64(seed["bonus"]["bC3100"]["bT3101"]);
				}
				else
				{
					returnValue = 0;
				}
			break;
			case Constant.BuffType.BUFF_TYPE_PEASE:
				returnValue = _Global.INT64(seed["player"]["truceExpireUnixTime"]);				
				break;
			case Constant.BuffType.BUFF_TYPE_FRESHMAN:
				returnValue = _Global.INT64(seed["player"]["beginnerProtectionExpireUnixTime"]);
				break;
			case Constant.BuffType.BUFF_TYPE_CARMOTCOLLECT:
				if(seed["bonus"]!=null && seed["bonus"]["bC3000"]!=null)
				{
					if(seed["bonus"]["bC3000"]["bT3001"] != null && _Global.INT64(seed["bonus"]["bC3000"]["bT3001"]) != 0)
					{
						returnValue = _Global.INT64(seed["bonus"]["bC3000"]["bT3001"]);
					}
					else if(seed["bonus"]["bC3000"]["bT3002"] != null && _Global.INT64(seed["bonus"]["bC3000"]["bT3002"]) != 0)
					{
						returnValue = _Global.INT64(seed["bonus"]["bC3000"]["bT3002"]);
					}
					else
					{
						returnValue = 0;
					}
				}
				else
				{
					returnValue = 0;
				}
				break;

			case Constant.BuffType.BUFF_TYPE_RESOURCECOLLECT:
				if(seed["bonus"]!=null && seed["bonus"]["bC3000"]!=null)
				{
					if(seed["bonus"]["bC3000"]["bT3003"] != null && _Global.INT64(seed["bonus"]["bC3000"]["bT3003"]) != 0)
					{
						returnValue = _Global.INT64(seed["bonus"]["bC3000"]["bT3003"]);
					}
					else
					{
						returnValue = 0;
					}
				}
				else
				{
					returnValue = 0;
				}
				break;
		}
		
		return returnValue;
	}
	
}
