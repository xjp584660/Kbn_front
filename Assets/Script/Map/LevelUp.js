
class	LevelUp{

	private	static	var	singleton:LevelUp;
	private var	seed:HashObject;
	private var menuOpened:boolean = false;
	private var m_isDuringCheck : boolean = false;

	public	static	function	instance(){
		if( singleton == null ){
			singleton = new LevelUp();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public	function	init( sd:HashObject ){
		seed = sd;
		initUnlockHelp();
//		menuOpened = false;
	}

	var unlock:Hashtable ={
		"2": {
			"t-supplytruck": 6,
			"t-infantry": 5,
//			"b-university": Constant.Building.ACADEMY,
			"b-barracks": Constant.Building.BARRACKS
		},
		"3": {
			"b-embassy": Constant.Building.EMBASSY,
			"b-generalsquarters": Constant.Building.GENERALS_QUARTERS,
			"b-aircontrol": Constant.Building.BLACKSMITH,
			"b-rallypoint": Constant.Building.RALLY_SPOT
		},
		"4": {
			"t-suplycarts": 9,
			"t-cavalry": 8,
			"b-factory": Constant.Building.WORKSHOP,
			"b-perimeter": Constant.Building.WALL,
			"b-supplybunker": Constant.Building.STOREHOUSE,		
			"b-satellitestation": Constant.Building.WATCH_TOWER
		},
		"5": {
			"t-swordman": 7,
		//	"b-blackmarket": "Black Market",
		//	"b-logisticscenter": Constant.Building.RELIEF_STATION ,
		//	"b-casino": "Casino",
			"b-tankdepot": Constant.Building.STABLE,
			"b-reliefstation":Constant.Building.RELIEF_STATION
		},
		"6": {
			"t-ballistae": 11,
			"f-defensiveTrebuchet":52
		},
		"7": {
			"f-trap": 53,
			"f-calrops":54,
			"b-roundtower":Constant.Building.MUSEUM
		},
		"8": {
			"t-supplywagon": 2,
			"f-Wall-mountedCroosbows": 55
		},
//		"9": {
//
//		},
//		"10": {

//		},
		"12": {
			"t-heavycavalry": 13
		},
		"16": {
			"t-batteringrams": 10
		},
		"20": {
			"t-catapults": 12
		}
	};
	
	var unlockhelps:Hashtable ={
	"1":"surveyhelp"

	};
	
	var unlockhelpList:Array = new Array();
	
	private	var	currentLevel:int = 0; //to be initialized in this.init()
	
	public function reInit()
	{
		objLevel = null;
	}
	
	private	var	objLevel: HashObject = null; //to be initialized in this.init()
	private	var	MAX_LEVEL: int = 0;
	private var questlist:HashObject;
	public	function	init2(){
		if (this.objLevel == null) {
			questlist = Datas.instance().questlist();
			this.currentLevel = 1;	//_Global.INT32(seed["player"]["title"]);
			checkLevel = 0;
			this.objLevel = new HashObject();

			//Get data from questlist
			var qid:Array = _Global.GetObjectKeys(questlist);

			for (var i = 0; i < qid.length; i++) {
//				_Global.Log(questlist[ qid[i] ]);
//				_Global.Log(questlist[ qid[i] ]["objective"]);
				var level:int = questlist[ qid[i] ]["objective"][_Global.ap + 2] ?_Global.INT32( questlist[ qid[i] ]["objective"][_Global.ap + 2] ):0;
				var objectiveType:int = _Global.INT32(questlist[ qid[i] ]["objective"][_Global.ap + 0]);
				var rewardLevel:int = _Global.INT32( questlist[ qid[i] ]["reward"][_Global.ap + 3][_Global.ap + 2] );
				if (level > 0 && objectiveType == 999 && rewardLevel > 0) { //this is a level up quest
					if ( seed["quests"][qid[i]] && _Global.INT32(seed["quests"][qid[i]]) == 1 ) { // already claimed
						this.currentLevel = Mathf.Max(level, this.currentLevel);
					}
					this.objLevel[_Global.ap + level] = new HashObject({"qid" : qid[i]});
					this.MAX_LEVEL = Mathf.Max(this.MAX_LEVEL, level);
				}
			}
		}
	}
	public function check()
	{
		if ( m_isDuringCheck )
			return;

		m_isDuringCheck = true;
		
		if ( !KBN.FTEMgr.isFTERuning() )
		{
			MystryChest.instance().AddLoadMystryChestCallback(function()
			{
				priv_check(true);
				m_isDuringCheck = false;
			});
		}
		else
		{
			priv_check(true);
			m_isDuringCheck = false;
		}
	}
	
	private var checkLevel:int = 0;
	
	private	function	priv_check(openMenu:boolean){
		this.init2();
		//tzhou.0804
		var newLevel:int = _Global.INT32(seed["xp"]["lvl"]);

		MenuMgr.getInstance().MainChrom.RefreshCurrentMission();
		
//		_Global.Log("new level = "+ newLevel);
		if(menuOpened)
			return;
		Player.getInstance().syncPlayerVO();
//		this.open(3);
//		return;

		if (newLevel > this.currentLevel) {
//			var stop = newLevel;
//			var i:int = this.currentLevel;
			var fromLevel:int = this.currentLevel +1;
			for (var level = fromLevel; level <= newLevel; level++) {
//				this.currentLevel = i+1;
				var index:String =  _Global.ap + level;
				if (this.objLevel[index] && (!seed["quests"]["q"+(11000+level)] || (seed["quests"]["q"+(11000+level)] &&_Global.INT32(seed["quests"]["q"+(11000+level)]) != 1))) {					
			//		var qid:String = _Global.INT32( this.objLevel[index]["qid"].Substring(1) );
//					if(openMenu)
//						this.open(level);
					break;
				}
			}
			
			if(fromLevel > checkLevel)
			{
				checkLevel = fromLevel;
			}
			else
			{
				return;
			}
			
			this.claim(fromLevel, level);
		}
	}
	
	public	function	claim( fromLevel:int, toLevel:int){
		
		var	quests:Quests = Quests.instance();
		var questId:int = 0;
		for (var i:int = fromLevel; i <= toLevel ; i++) {
			if(this.objLevel[_Global.ap +i] == null)
				continue;
			if (this.objLevel[_Global.ap +i]["qid"]) {
				fromLevel = i;
				questId = _Global.INT32( (this.objLevel[_Global.ap +i]["qid"].Value as String).Substring(1) );
				break;
			}
		}		
		if (questId == 0) {//there must be something wrong, questId must not be 0
			return false;
		}

		var that:Object = this;
		var params:Array = new Array();
	//	params.Add(quests.checkObjective(questId));
		
		params.Add(GameMain.instance().getCurCityId());
		params.Add(GameMain.instance().getCurCityId());
		params.Add(questId);
		
		var okFunc:Function = function(result:HashObject){			
			// give the rewards to the user	
			quests.giveRewards(questId);

			// HARDCODED (ick!) QUEST ACTION FOR CITIES
			switch (_Global.INT32(questId)) {
			case 8003: // 3rd city, quest complete, remove crests
				seed["items"]["i1101"].Value = new HashObject(_Global.INT32(seed["items"]["i1101"]) - 1);
				seed["items"]["i1102"].Value = new HashObject(_Global.INT32(seed["items"]["i1102"]) - 1);
				seed["items"]["i1103"].Value = _Global.INT32(seed["items"]["i1103"]) - 1;
				break;
			case 8004: // 4th city, quest complete, remove crests
				seed["items"]["i1103"].Value = new HashObject(_Global.INT32(seed["items"]["i1103"]) - 1);
				seed["items"]["i1104"].Value = new HashObject(_Global.INT32(seed["items"]["i1104"]) - 1);
				seed["items"]["i1105"].Value = new HashObject(_Global.INT32(seed["items"]["i1105"]) - 1);
				break;
			}
    
			// remove from list
//			_Global.Log("level up:"+ questId);
			seed["quests"]["q" + questId] = new HashObject(1);
			quests.updateQuestData();
			this.currentLevel = fromLevel;
			
			if(result["popAllianceTips"] != null)
			{
				JoinAllianceTip.getInstance().setJoinAllianceTipEnable(_Global.GetBoolean(result["popAllianceTips"]));
			}
			else
			{
				JoinAllianceTip.getInstance().setJoinAllianceTipEnable(false);
			}
			
			this.open(this.currentLevel);
			if (result["updateSeed"]) {
				UpdateSeed.instance().update_seed(result["updateSeed"]);
			}			
		};
		
		var	errorFunc:Function = function(msg:String, errorCode:String)
		{
			//Dont show error message, just try claiming the next level
			//Modal.showAlert(printLocalError((result.error_code || null), (result.msg || null), (result.feedback || null)));
			if(errorCode == "1701" && (  seed["quests"]["q" + questId] == null ||_Global.INT32(seed["quests"]["q" + questId]) != 1) )
			{
				seed["quests"]["q" + questId].Value = 1;
				if(this.currentLevel < fromLevel)
				{
					this.currentLevel = fromLevel;
					quests.giveRewards(questId);
				}	
			}	
			if (fromLevel+1 <= toLevel) {
				(that as LevelUp).ClaimNext(fromLevel+1, toLevel);
			}
			else
				return;
		};
		
		UnityNet.reqClaimLevelUp(params,okFunc,errorFunc);
		
	}
	
	private function ClaimNext(from:int, to:int)
	{
		claim(from, to);
	}
	
	public	function	getLevel(xp:int){
		var result = this.currentLevel;
		for (var level = this.currentLevel; level <= this.MAX_LEVEL; level++) {
			if (this.objLevel[_Global.ap+level] && xp >= _Global.INT32(this.objLevel[_Global.ap+level]["xp"])) {
				result = level;
			}
		}
		return result;
	}
	
	public	function	open(level:int){
		if (this.objLevel == null) {
			this.init2();
		}		
		
		var that:LevelUp = this;
		var currentLevel:int;
		if (level || level == 0) {
			currentLevel = level;
		} else {
			currentLevel = this.currentLevel;
		}	
		// _Global.INT32( this.objLevel[currentLevel].qid.substr(1) ) is the questId
		if( this.objLevel[_Global.ap +currentLevel] ) {
			this.setRewards( (this.objLevel[_Global.ap +currentLevel]["qid"].Value as String).Substring(1));
		}

		var nextUnlockLevel = this.getNextUnlockLevel(currentLevel);

		unlockArray.Clear();
		var keys:Array = _Global.GetObjectKeys(unlock["" + currentLevel]);
		var curUnlock:Hashtable  =  unlock["" + currentLevel] as Hashtable;		
		var arStrings :Datas = Datas.instance();
		
		for(var k:int = 0;k<unlockhelpList.length; k++)
		{
			var helpitem:UnlockHelp = (unlockhelpList[k] as UnlockHelp);
			if(helpitem.unlockLevel != currentLevel)
				continue;
				
			var newhelpItem:UnlockItem = new UnlockItem();
			newhelpItem.name = arStrings.getArString("Common.SurveyBtn");
			newhelpItem.texturePath = "icon_Shovel";
			newhelpItem.description = Datas.getArString("MessagesModal.SurveyingUnlocked");
			newhelpItem.type = TextureType.ICON_ELSE;
			unlockArray.Push(newhelpItem);
		}
		
		for(var i:int = 0; i<keys.length; i++)
		{
			var	key:String = keys[i]; 
			var newItem:UnlockItem = new UnlockItem();
			if (key.Substring(0,1) == "b") {
				newItem.name = arStrings.getArString("buildingName."+"b" + curUnlock[key]);
				newItem.texturePath = "bi_"+curUnlock[key];
				newItem.description = Datas.getArString("buildingDescShort.b" +  curUnlock[key]);
				newItem.type = TextureType.ICON_BUILDING;
			} else 	if (key.Substring(0,1) == "t") {
				newItem.name = arStrings.getArString("unitName."+"u" + curUnlock[key]);
				newItem.texturePath = "ui_"+curUnlock[key];
				newItem.type = TextureType.ICON_UNIT;
				newItem.description = Datas.getArString("unitDesc.u" +  curUnlock[key]) ;
			} else {
				newItem.name = arStrings.getArString("fortName."+"f" + curUnlock[key]);
				newItem.texturePath = "ui_"+curUnlock[key];
				newItem.type = TextureType.ICON_UNIT;
				newItem.description = Datas.getArString("fortDesc.f" +  curUnlock[key]);
			}
			unlockArray.Push(newItem);
		}
		var param:Object = {"level":level};
		menuOpened = true;
		MenuMgr.getInstance().PushMenu("LevelupMenu", param, "trans_zoomComp");
		CityQueue.instance().CheckNewCtiyRequirement();
		MenuMgr.getInstance().sendNotification(Constant.Notice.LEVEL_UP, null);
		
		if(level >= MainChrom.LEVEL_LIMIT_QUEST_ANIMATION)
		{
			MenuMgr.getInstance().MainChrom.StopQuestAnimation();
		}
		
	}
	function setRewards(questid:String) {
		questid = "q" + questid;
	//	this.rewards = {};
		rewardArray.Clear();
		var arStrings:Datas = Datas.instance();
		// Resources
		var resourceList:HashObject = questlist[questid]["reward"][_Global.ap + 0];
		var newItem:Reward;
		for( var i:int =0; i <= Constant.ResourceType.IRON; i++ ) {
			if( resourceList[_Global.ap +i] && arStrings.getArString("ResourceName."+_Global.ap + i) ) {
				newItem = new Reward();
				newItem.name = arStrings.getArString("ResourceName."+_Global.ap + i);
				newItem.texturePath = "icon_rec" + i;
				newItem.type = TextureType.ICON_ELSE;
				newItem.quant = _Global.INT32( resourceList[_Global.ap + i] );
				if(newItem.quant > 0)
					rewardArray.Push(newItem);
			}
		}
		
		// Items
		var itemList:Array = _Global.GetObjectValues( questlist[questid]["reward"][_Global.ap + 2] );
		for( i=0; i < itemList.length; i++ ) {
			if( itemList[i] ) {
				newItem = new Reward();
				
				newItem.id = _Global.INT32((itemList[i] as HashObject)[_Global.ap +0].Value);
				var itemLookupKey:String = "i" + newItem.id;
				newItem.quant = _Global.INT32( (itemList[i] as HashObject)[_Global.ap +1] );
				
				if(newItem.id > 30000 && newItem.id <= 30100)
				{
					newItem.name = Datas.getArString("Common.LevelChestName", [MystryChest.instance().GetLevelOfChest(newItem.id)]);//MystryChest.instance().GetLevelChestName(newItem.id);
					newItem.texturePath = MystryChest.instance().GetLevelChestImage(newItem.id);
				}
				else
				{
					newItem.name = arStrings.getArString("itemName."+itemLookupKey);
					newItem.texturePath = itemLookupKey;
				}

				newItem.type = TextureType.ICON_ITEM;
				if(newItem.quant > 0)
					rewardArray.Push(newItem);			
			}
		}
	}
	
	public	function	canUnlockAt(currentLevel:int){
		return (this.unlock[currentLevel]) ? true : false;
	}
	
	public	function	getNextUnlockLevel(currentLevel:int){
		return currentLevel + 1;
	}
	private var unlockArray:Array = new Array();
	private var rewardArray:Array = new Array();
	
	public function GetUnlockItems()
	{
		return unlockArray;
	}
	public function GetRewards()
	{
		return rewardArray;
	}
	
	public function CloseMenu()
	{
		menuOpened = false;
	}
	
	class UnlockItem
	{
		var name:String;
		var description:String;
		var texturePath:String;
		var type:String;
	}
	
	class Reward
	{
		var name:String;
		var texturePath:String;
		var quant:int;
		var type:String;
		var id:int;
	}
	
	class UnlockHelp
	{
		var name:String;
		var unlockLevel:int;
	}
	
	function initUnlockHelp()
	{
		if(seed["openSurvePlayerLevel"])
			var level = _Global.INT32(seed["openSurvePlayerLevel"]);
		else
			level = 15;
		unlockhelpList.clear();
		for(var i:System.Collections.DictionaryEntry in unlockhelps)
		{
			var helpitem:UnlockHelp = new UnlockHelp();
			helpitem.name = i.Value;
			helpitem.unlockLevel = level;
			unlockhelpList.Push(helpitem);
		}
	}
		
	public function updateHelpLevel(helpname:String, newLevel:int)
	{
		for(var i:int =0;i<unlockhelpList.length;i++)
		{
			var helpitem:UnlockHelp = (unlockhelpList[i] as UnlockHelp);
			if(helpitem.name == helpname)
				helpitem.unlockLevel = newLevel;
		}
	}
}
