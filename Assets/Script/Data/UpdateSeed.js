//$Id: UpdateSeed.js,v 1.15.10.21 2011/02/19 21:03:32 pmcilroy Exp $

class UpdateSeed extends KBN.UpdateSeed
{

	private	var	seed:HashObject;
	private	var	needCheckQuestCnt:int;
	private var needCheckQuestCntForMarch:int;
	private var needCheckQuestCntForBuilding:int;
	private var updateSeedDisabled:boolean;

	public static function instance() : UpdateSeed
    {
		if( singleton == null )
        {
			singleton = new UpdateSeed();
			GameMain.instance().resgisterRestartFunc(function()
            {
				singleton = null;
			});
		}
		
		return singleton as UpdateSeed;
	}
	
	public function set DisableUpdateSeed(value:boolean) {
		updateSeedDisabled = value;
	}
	
	public	function	init(sd:HashObject){
		updateSeedDisabled = false;
		seed = sd;
	}
	
	public	function	followCheckQuest( cnt:int ){
		if( cnt > needCheckQuestCnt ){
			needCheckQuestCnt = cnt;
		}
	}
	
	public function 	followCheckQuestForBuiding(cnt:int):void
	{
		if(cnt > needCheckQuestCntForBuilding)
		{
			needCheckQuestCntForBuilding = cnt;
		}
	}
	
	public function followCheckQuestForMarch(cnt:int):void
	{
		if( cnt > needCheckQuestCntForMarch )
		{
			needCheckQuestCntForMarch = cnt;
		}		
	}
	
public function update_seed_ajax()
{
	update_seed_ajax( false, null );
}

public function update_seed_ajax_Force()
{
	update_seed_ajax( true, null );
}

	var g_update_seed_ajax_do:boolean =false;
public function update_seed_ajax(marchForceUpdateFlag:boolean, updateSeedDoneCallback:Function)
{
	if(g_update_seed_ajax_do || updateSeedDisabled){
		return;
	}
	
	g_update_seed_ajax_do = true;		
	
	var okFunc = function(result:Object)
	{
		if( autoUpdateResult(result) )
		{
			if (updateSeedDoneCallback) 
			{
				updateSeedDoneCallback();
			}
		}
		
		if( needCheckQuestCntForBuilding > 0 ){
			Quests.instance().checkForBuilding();
			needCheckQuestCntForBuilding --;
		}		
		
		if( needCheckQuestCnt > 0 ){
			Quests.instance().checkForTroop();
			needCheckQuestCnt --;
		}
		
		MenuMgr.getInstance().MainChrom.UpdateChromeButtonScrolls();
		
		g_update_seed_ajax_do = false;
		GameMain.instance().invokeUpdateSeedInTime(30);
		
	};
	var errorFunc = function(msg:String, errorCode:String)
	{
		
		g_update_seed_ajax_do = false;
		GameMain.instance().invokeUpdateSeedInTime(30);
		
	};

//	UnityNet.UpdateSeed( marchForceUpdateFlag ? true : false, autoUpdateResult , errorFunc);
	UnityNet.UpdateSeed( marchForceUpdateFlag, okFunc , errorFunc);
}
//
public function autoUpdateResult(result:HashObject):boolean
{
//		g_update_seed_ajax_do = false;
	if (!result["ok"].Value)
		return false;

	GameMain.adjustUnixtime(_Global.parseTime(result["resmicrotime"]));

	var msgbug:boolean = false;
//			var newFoundArtifact = result["foundArtifacts"][""+currentcityid];
	var newArtifactSet:HashObject = result["artifactSets"]["completed"];
	if(result["players"])
	{
		update_players(result["players"]);
	}
	if( result["player"]["allianceId"] ) {
		seed["player"]["allianceId"] = result["player"]["allianceId"];
	}
	if(result["allianceNames"])
	{
		update_allianceNames(result["allianceNames"]);
	}
    
    if (result["hasAvAReward"])
    {
        seed["hasAvAReward"] = result["hasAvAReward"];
    }
	
	if(result["hasLeagueSeasonReward"])
	{
		seed["hasLeagueSeasonReward"] = result["hasLeagueSeasonReward"];
	}
	
	if(result["leagueLevel"])
	{
		seed["leagueLevel"] = result["leagueLevel"];
	}
	
	if(result["leagueRank"])
	{
		seed["leagueRank"] = result["leagueRank"];
	}
	
	if(result["selfSeasonRewardBar"])
	{
		seed["selfSeasonRewardBar"] = result["selfSeasonRewardBar"];
	}
	
	if(result["allianceSeasonRewardBar"])
	{
		seed["allianceSeasonRewardBar"] = result["allianceSeasonRewardBar"];
	}
	if(result["bonus"] != null && result["bonus"]["bC3100"]!=null)
	{
		seed["bonus"]["bC3100"] = result["bonus"]["bC3100"];
		BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_TRAINTROOP, -1);
	}
	
	if (result["updateMarch"]) {
		update_march(result["updateMarch"]);
	}
	
	if (result["beginnerProtectionExpireUnixTime"] != null)
    {
        seed["player"]["beginnerProtectionExpireUnixTime"] = result["beginnerProtectionExpireUnixTime"];
        BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_FRESHMAN, -1);
    }

	//SyncGameCenterLeaderBoard
	if (result["private_update"] && result["private_update"]["needUpdateLB"] != null && result["private_update"]["needUpdateLB"].Value == true) {
		GameCenterHelper.SyncGameCenterLeaderBoard();
	}
	
	if(result["queue_atkinc"])
	{
		update_atkinc(result["queue_atkinc"]);
	}
	if (result["updateInventory"]) {
		update_inventory(result["updateInventory"]);
	}
	if (result["fortifications"]){
		seed["fortifications"] = result["fortifications"];
		for( var f:int = 0; f < Constant.FortificationTypesIDS.length; f ++ ){
			Walls.instance().UpadateTroopList(Constant.FortificationTypesIDS[f]);
		}
		MenuMgr.getInstance().sendNotification(Constant.Notice.WALL_UNITS_CNT_UP, null);
	}
	if (result["updateSeed"]) {
		update_seed(result["updateSeed"]);
	}
	if (result["additionalNewTradeReportCnt"]) {
		seed["newTradeReports"].Value = _Global.INT32(seed["newTradeReports"]) + _Global.INT32(result["additionalNewTradeReportCnt"]);
		msgbug = true;
	}
	if(result["activity"])
	{
		seed["activity"] = result["activity"];
		updateOfferParams();
	}
	
	if(result["openSurvePlayerLevel"])
	{
		LevelUp.instance().updateHelpLevel( "surveyhelp" , _Global.INT32(result["openSurvePlayerLevel"]));
	}
	
	if(result["openSurvey"])
	{
		seed["openSurvey"] = result["openSurvey"];
	}
	
	if(result["buyUpgradRateBuilding"])
	{
		seed["buyUpgradRateBuilding"] = result["buyUpgradRateBuilding"];
	}
	
	if(result["directbuyType"])
	{
		seed["directbuyType"] = result["directbuyType"];
	}
	
	if(result["buyUpgradeRateTech"])
	{
		seed["buyUpgradeRateTech"] = result["buyUpgradeRateTech"];
	}
	
	seed["upgradeRate"] = (result["upgradeRate"] == null)? null:result["upgradeRate"];

	if(result["cityWilderness"])
	{
		update_wilderness(result["cityWilderness"]);
	}
	
	if(result["cityReleaseTime"])
	{
		seed["cityReleaseTime"] = result["cityReleaseTime"];
		updateCityComingTime();
		CityQueue.instance().updateQueue();
	}
	
	if(result["gemBalance"])
	{
		seed["player"]["gems"].Value = _Global.INT64(result["gemBalance"]);
	}

    if (result["shadowGemBalance"])
    {
        seed["player"]["shadowGems"].Value = _Global.INT64(result["shadowGemBalance"]);
    }

	/*
	if (result["newReportCount"]) {
		seed["newReportCount"].Value = _Global.INT32(result["newReportCount"]);
		seed["newDisasterReportCount"].Value = _Global.INT32(result["newDisasterReportCount"]);
		msgbug = true;
	}
	if (result["newMailCount"]) {
		seed["newMailCount"].Value = _Global.INT32(result["newMailCount"]);
		msgbug = true;
	}
	*/
	//local mail

	if(result["hasNewReceiveMail"]){
	 	seed["hasNewReceiveMail"]= result["hasNewReceiveMail"];
	}
	
	if(result["hasNewSentMail"]){
	 	seed["hasNewSentMail"] = result["hasNewSentMail"];
	 	
	}
	
	if(result["hasNewReport"]){
	 	seed["hasNewReport"] = result["hasNewReport"];
	}
	
	if(seed["hasNewReport"]!=null && seed["hasNewReport"].Value==true){
		Message.getInstance().DownLoadReports(function () {
			_Global.Log("download message success.......");
		}, "");
	}else if(seed["hasNewReceiveMail"]!=null && seed["hasNewReceiveMail"].Value==true){
	 	Message.getInstance().DownLoadInboxs(true,function(){
	 		Message.getInstance().DownLoadInboxs(false,function(){
	 			_Global.Log("download message success.......");	
	 		});
	 	});
	}else if(seed["hasNewSentMail"]!=null && seed["hasNewSentMail"].Value==true){
	 	Message.getInstance().DownLoadOutboxs(function(){
			
		});
	}
	
	if(result["haveNewAVAReport"]!=null && result["haveNewAVAReport"].Value==true){
		Message.Instance.DownloadAvaReports();
	}
	 
	//end
	
	if(result["outgoing_marches"])
	{
		updateMarchId(result["outgoing_marches"]);
	}
/* todo artifact		
	if (newFoundArtifact) {
		var newInventoryInfo = {};
		newInventoryInfo["newFoundArtifact"] = 1;
		update_inventory(newInventoryInfo);
		Museum.singleton.checkNewArtifacts(newFoundArtifact);
	}

	if (newArtifactSet) {
		var setId:int = _Global.INT32(newArtifactSet);
		var shareInfo = result.artifactSets.completedShareInfo;
		if ( shareInfo ) {
			ArtifactSetUtil.displaySetCompletion(setId,shareInfo);
		}
	}
*/

	if(result["rtEvent"])
	{
		Museum.instance().updateEvent(result["rtEvent"]);
	}
	
	var isNeedUpdateGamble : boolean = false;
	if(result["magicalBoxHasEvent"])
	{
		Gamble.getInstance().updateActivity(result["magicalBoxHasEvent"]);
		isNeedUpdateGamble = true;
	}

	if (msgbug) {
	// show new mail and report cnt. notifytip	Messages.notifyBug();
	}
	if (result["updateHelpConstruct"]) {
		update_help_construct(result["updateHelpConstruct"]);
	}
	if (result["updateHelpResearch"]) {
		update_help_research(result["updateHelpResearch"]);
	}
	// If the alliance situation has changed the map needs to be redrawn 
	if (result["allianceDiplomacies"] ) {
		seed["allianceDiplomacies"] = result["allianceDiplomacies"];
//todo mapview.js		g_mapObject.getMoreSlots();
	}
	if (result["updateMight"] != null) {
		seed["player"]["might"].Value = _Global.INT64(result["updateMight"]);
//to do		update_might();
	}
	if (result["serverSetting"] != null) {
		update_serverSetting(result["serverSetting"]);
	}
	if (result["updateCityUnits"]) {
		update_cityUnits(result["updateCityUnits"]);
		Barracks.instance().UpadateAllTroop();
	}
	if(result["city_unit_count"])
	{
		update_cityUnits(result["city_unit_count"]);
		Barracks.instance().UpadateAllTroop();
	}

    if (result["city_defense_count"] != null)
    {
        UpdateSelectiveDefenseUnits(result["city_defense_count"]);
    }

	if ( result["cityDependency"] != null )
	{
		seed["cityDependency"] = result["cityDependency"];
		CityQueue.instance().UpdateCityDependency(seed);
	}

	if(result["training_queue"])
	{
		update_trainslots(result["training_queue"]);				
	}
	
	if(result["training_bad_queue"] != null)
	{
		delete_trainslots(result["training_bad_queue"]);
	}
	
	if(result["fortify_queue"])
	{
		update_wallTrainSlots(result["fortify_queue"]);				
	}
	
	if(  result["knights"] ){
		addKnights(result["knights"]);
	}
	
	if(  result["updateKnight"] ){
		update_knights(result["updateKnight"]);
	}
	
	if( result["vip"] != null)
	{
		GameMain.instance().CheckVipLevelUp(result["vip"]);
		seed["vip"] = result["vip"];
	}
	if(result["pveOpened"] != null)
	{
		seed["pveOpened"] = result["pveOpened"];
	}
	if(result["vipOpened"] != null)
	{
		seed["vipOpened"] = result["vipOpened"];
	}
	if(result["worldmapOpened"] != null )
	{
		seed["worldmapOpened"] = result["worldmapOpened"];
	}
	if(result["pveBossOpened"] != null)
	{
		seed["pveBossOpened"] = result["pveBossOpened"];
		if(_Global.INT32(result["pveBossOpened"]) == 0)
		{
			GameMain.instance().OnPveBossSwitchClosed();
		}
	}
	
	if(result["hasFreePlay"] != null)
	{
		seed["hasFreePlay"] = result["hasFreePlay"];
		isNeedUpdateGamble = true;
	}

	if(result["player"]["truceExpireUnixTime"] != null)
	{
		seed["player"]["truceExpireUnixTime"] = result["player"]["truceExpireUnixTime"];
		BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_PEASE, -1);
	}
	
	if( result["geEvent"] != null)
	{
		seed["geEvent"] = result["geEvent"];
	}
	if( result["leaders"] != null)
	{
		seed["leaders"] = result["leaders"];
	}
	if( result["heroElevateOpened"] != null)
	{
		seed["heroElevateOpened"] = result["heroElevateOpened"];
	}
	if( result["heroSkillLVUpOpened"] != null)
	{
		seed["heroSkillLVUpOpened"] = result["heroSkillLVUpOpened"];
	}
	if( result["serverMerge"] != null)
	{
		if(_Global.INT32 (seed ["serverMerge"]["isOpened"]) != _Global.INT32 (result ["serverMerge"]["isOpened"]))
		{
			seed["serverMerge"] = result["serverMerge"];
			MenuMgr.getInstance().sendNotification(Constant.Notice.ServerMergeSwitchChanged, null);
		}
		seed["serverMerge"] = result["serverMerge"];
	}
	if( result["worldmap"] != null )
	{
		if(_Global.INT32 (seed ["worldmap"]["available"]) != _Global.INT32 (result ["worldmap"]["available"]))
		{
			seed["worldmap"] = result["worldmap"];
			MenuMgr.getInstance().sendNotification(Constant.Notice.WorldMapActivityChanged, null);
		}
		seed["worldmap"] = result["worldmap"];
	}
	if( result["gdsVer"] != null)
	{
		seed["gdsVer"] = result["gdsVer"];
		var gdsVer : HashObject = seed["gdsVer"];
		var gameMain = GameMain.instance();
		gameMain.checkGDSReload(gdsVer);
	}
	
	if(result["prestige"] != null)
	{
		seed["prestige"] = result["prestige"];
	}
	
	if(result["trianRefundTroopRate"] != null)
	{
		seed["trianRefundTroopRate"] = result["trianRefundTroopRate"];
	}
	
	if(result["gdsAdjustment"] != null)
	{
		seed["gdsAdjustment"] = result["gdsAdjustment"];
	}
	
	if( result["reskin"] != null)
	{
		seed["reskin"] = result["reskin"];
	}
	
	if( result["combatswitch"] != null)
	{
		seed["combatswitch"] = result["combatswitch"];
	}
	
	if (result["pop_payment"]) {
		Payment.instance().DirectPurchaseItem(result["pop_payment"]);
	}
	
	if( result["shopUpgraded"] && Shop.instance != null )
	{
		if(result["shopUpgraded"].Value)
		{
			Shop.instance().updateShop = true;
		}
	}
	
	if( result["inventoryUpgraded"] && MyItems.instance() != null )
	{
		if(result["inventoryUpgraded"].Value)
		{
			MyItems.instance().NeedUpdate = true;
		}
	}
	
	if(result["config"] != null && seed != null)
	{
		seed["config"] = result["config"];
	}
	
	if ( result["alliancePermission"] != null )
	{
		AllianceRights.UpdateBySeed(result["alliancePermission"]);
	}
	
	MenuMgr.getInstance().MainChrom.SetWheelGameInfo(result["wheelgame"]);
	seed.Remove("wheelgame");

	if(result["rater"] != null )
	{
		if(result["rater"]["open"] != null && result["rater"]["open"].Value != null)
		{
			if(result["rater"]["open"].Value == "1")
			{
				GameMain.instance().isRaterOpen = true;
			}
		}
	
		if(result["rater"]["push"] != null && result["rater"]["push"].Value != null)
		{
			if(result["rater"]["push"].Value == "1")
			{
				GameMain.instance().CheckAndOpenRaterAlert(true,"update");
			}
		}
	}
	
	if ( result["hospital_data"] != null )
	{
		seed["hospital_data"] = result["hospital_data"];
		MenuMgr.getInstance().sendNotification(Constant.Notice.HOSPITAL_DATA_CHANGED, null);
	}

	if ( result["hospital_queue"] != null )
	{
		seed["hospital_queue"] = result["hospital_queue"];
		HealQueue.instance().init(seed);
	}
    
    if (result["selective_defense_queue"] != null)
    {
        seed["selective_defense_queue"] = result["selective_defense_queue"];
        SelectiveDefenseQueueMgr.instance().init(seed);
    }

	if (result["heroOpened"] != null)
	{
	    HeroManager.Instance().SetHeroEnable(_Global.INT32(result["heroOpened"]) > 0);
	}
	
	if( result["pveFte"] != null)
	{
		seed["pveFte"] = result["pveFte"];
	}
	
	if( result["worldmap"] != null )
	{
		seed["worldmap"] = result["worldmap"];
	}
    
    if (result["extendBeginnerProtection"] != null)
    {
        seed["extendBeginnerProtection"] = result["extendBeginnerProtection"];
        GameMain.instance().OpenBuyPeacePopMenuIfNeeded();
    }

    if (result["beginnerProtectionExpireUnixTime"] != null)
    {
        seed["player"]["beginnerProtectionExpireUnixTime"] = result["beginnerProtectionExpireUnixTime"];
        BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_FRESHMAN, -1);
    }
    
    if (result["allianceEmblems"] != null)
    {
    	if (null != AllianceEmblemMgr.instance)
	    	AllianceEmblemMgr.instance.UpdateBySeed(result);
    }
    
    if (result["avaChatSwitch"] != null)
    {
    	if (null == seed["avaChatSwitch"])
    		seed["avaChatSwitch"] = new HashObject();
    	seed["avaChatSwitch"].Value = result["avaChatSwitch"].Value;
	}

	/* 迷雾远征 开关 */
	if (result["EXPEDITION_SWITCH"] != null) {
		if (null == seed["EXPEDITION_SWITCH"])
			seed["EXPEDITION_SWITCH"] = new HashObject();
		seed["EXPEDITION_SWITCH"].Value = result["EXPEDITION_SWITCH"].Value;
	}

	/* 三方支付开关 */
	if (result["XSOLLA_PAYMENT"] != null) {
		if (null == seed["XSOLLA_PAYMENT"])
			seed["XSOLLA_PAYMENT"] = new HashObject();
		seed["XSOLLA_PAYMENT"].Value = result["XSOLLA_PAYMENT"].Value;
	}

	/* 三方支付 网页链接 */
	if (result["XSOLLA_PAYMENT_URL"] != null) {
		if (null == seed["XSOLLA_PAYMENT_URL"])
			seed["XSOLLA_PAYMENT_URL"] = new HashObject();
		seed["XSOLLA_PAYMENT_URL"].Value = result["XSOLLA_PAYMENT_URL"].Value;
	}

	/* 账号删除 功能按钮显示开关 */
	if (result["CANCEL_ACCOUNT_URL_SWITCH"] != null) {
		if (null == seed["CANCEL_ACCOUNT_URL_SWITCH"])
			seed["CANCEL_ACCOUNT_URL_SWITCH"] = new HashObject();
		seed["CANCEL_ACCOUNT_URL_SWITCH"].Value = result["CANCEL_ACCOUNT_URL_SWITCH"].Value;
	}

	/* 账号删除 功能的跳转链接 */
	if (result["CANCEL_ACCOUNT_URL"] != null) {
		if (null == seed["CANCEL_ACCOUNT_URL"])
			seed["CANCEL_ACCOUNT_URL"] = new HashObject();
		seed["CANCEL_ACCOUNT_URL"].Value = result["CANCEL_ACCOUNT_URL"].Value;
	}

	/*PVP 等级限制显示*/
	if (result["PVP_ADMIT_LEVEL"] != null) {
		if (null == seed["PVP_ADMIT_LEVEL"]) {
			seed["PVP_ADMIT_LEVEL"] = new HashObject();
		}
		seed["PVP_ADMIT_LEVEL"].Value = result["PVP_ADMIT_LEVEL"].Value;
	}

    if (result["userAvAPower"] != null)
    {
    	if (null == seed["userAvAPower"])
    		seed["userAvAPower"] = new HashObject();
    	seed["userAvAPower"].Value = result["userAvAPower"].Value;
    }
    
    if (result["migrateSwitch"]) {
		GameMain.instance().SetMigrateSwitch(_Global.INT32(result["migrateSwitch"]) == 1 );
	}
    
    if (result["allianceAvAPower"] != null)
    {
    	if (null == seed["allianceAvAPower"])
    		seed["allianceAvAPower"] = new HashObject();
    	seed["allianceAvAPower"].Value = result["allianceAvAPower"].Value;
    }
    
    if (result["allianceMight"] != null)
    {
    	if (null == seed["allianceMight"])
    		seed["allianceMight"] = new HashObject();
    	seed["allianceMight"].Value = result["allianceMight"].Value;
    }
    
    if (result["serverSetting_ava"] != null)
    {
    	if (null == seed["serverSetting_ava"])
    		seed["serverSetting_ava"] = new HashObject();
    		
    	if (result["serverSetting_ava"]["deployMarchCount"] != null)
    	{
	    	if (null == seed["serverSetting_ava"]["deployMarchCount"])
	    		seed["serverSetting_ava"]["deployMarchCount"] = new HashObject();
	    	seed["serverSetting_ava"]["deployMarchCount"].Value = result["serverSetting_ava"]["deployMarchCount"].Value;
    	}
    	
    	if (result["serverSetting_ava"]["minAllianceMight"] != null)
    	{
	    	if (null == seed["serverSetting_ava"]["minAllianceMight"])
	    		seed["serverSetting_ava"]["minAllianceMight"] = new HashObject();
	    	seed["serverSetting_ava"]["minAllianceMight"].Value = result["serverSetting_ava"]["minAllianceMight"].Value;
    	}
    	
    	if (result["serverSetting_ava"]["minIndividualMight"] != null)
    	{
	    	if (null == seed["serverSetting_ava"]["minIndividualMight"])
	    		seed["serverSetting_ava"]["minIndividualMight"] = new HashObject();
	    	seed["serverSetting_ava"]["minIndividualMight"].Value = result["serverSetting_ava"]["minIndividualMight"].Value;
    	}
    	
    	if (result["serverSetting_ava"]["minProtectPower"] != null)
    	{
	    	if (null == seed["serverSetting_ava"]["minProtectPower"])
	    		seed["serverSetting_ava"]["minProtectPower"] = new HashObject();
	    	seed["serverSetting_ava"]["minProtectPower"].Value = result["serverSetting_ava"]["minProtectPower"].Value;
    	}
        
        MenuMgr.getInstance().sendNotification(Constant.Notice.AvaPowerUpdated, null);
    }
    
    if (result["updateIdealHero"] != null)
    {
    	var heroMgr : HeroManager = HeroManager.Instance();
    	var count : int = result["updateIdealHero"].Table.Count;
    	for (var i : int = 0; i < count; i++) {
    		heroMgr.SetHeroAvaDeployableStatus(_Global.INT32(result["updateIdealHero"][_Global.ap + i]));
    	}
    }
    if (result["monsterEvent"]!=null)
    {
    	MonsterController.instance().UpdateSeed(result["monsterEvent"]);
    }

    if (result["worldBossEvent"]!=null) {
        seed["worldBossEvent"]=result["worldBossEvent"];
    }

    if (result["hideTroopQueue"]!=null) {
    	seed["hideTroopQueue"]=result["hideTroopQueue"];
	}

    if (result["baseTileInfoMd5"]!=null) {
    	seed["baseTileInfoMd5"].Value=result["baseTileInfoMd5"].Value;
    }

    if (result["monthlyCard"]!=null) {
    	if(seed["monthlyCard"] == null)
    	{
	    	seed["monthlyCard"]=new HashObject();
			seed["monthlyCard"] = result["monthlyCard"];

			GameMain.instance().RefreshMonthlyCard();

	    	if(result["monthlyCard"].ToString()!="")
	    	{
		    	Payment.instance().buyMonthlyCardOk = true;	
		    	_Global.Log("MonthCard   buyMonthlyCardOk = true");	
	    	}	    	
    	}
    	else
    	{
	    	if(seed["monthlyCard"].ToString()=="" && result["monthlyCard"].ToString()!="")
	    	{
	    		Payment.instance().buyMonthlyCardOk = true;	
	    		_Global.Log("MonthCard   buyMonthlyCardOk = true  seed[monthlyCard].toString()==null");	
	    	}
			seed["monthlyCard"] = result["monthlyCard"];

			GameMain.instance().RefreshMonthlyCard();
    	}
    	MenuMgr.getInstance().sendNotification("UpdateMonthlyCard",null);
    }
    if (result["mapSearchTimes"]!=null) {
    	seed["mapSearchTimes"]=new HashObject();
    	seed["mapSearchTimes"].Value=result["mapSearchTimes"].Value;
    	MenuMgr.getInstance().sendNotification("UdpateMapSearchTimes",null);
    }
    
    if (_Global.INT32(result["santaKnightToaster"]) == 1)
    {
    	MenuMgr.getInstance().PushMessage(Datas.getArString("ToasterPrompt.VikingLostPower"));
    }
    
    if(result["allianceLevel"] != null)
    {
    	seed["allianceLevel"] = result["allianceLevel"];
    	GameMain.Ava.Alliance.Level = _Global.INT32(result["allianceLevel"]);
	}
	
	if(result["bonus"] != null && result["bonus"]["bC3500"] != null && result["bonus"]["bC3500"]["bT3501"]!=null)
	{
		//seed["bonus"]["bC3500"]["bT3501"]
		seed["bonus"]["bC3500"]["bT3501"] = result["bonus"]["bC3500"]["bT3501"];
		BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_COMBAT, 3500);
	}

	if(result["passMission"] != null)
	{
		PassMissionQuestManager.Instance().InitPassMissionQuests(result["passMission"]);
	}

	if(result["seasonPassEvent"] != null)
	{
		PassMissionMapManager.Instance().InitPassMissionMap(result);
	}
	  
    GameMain.PlayerBuffs.InitHomeBuffs( result );
    // Update buffs in BuffAndAlert
    BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_COMBAT, 261);  // attack buffs
    BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_COMBAT, 271);  // life buffs
   
	KBN.AllianceBossController.instance().UpdateSeed(seed["pveAllianceBoss"]);
	seed["pveAllianceBoss"] = result["pveAllianceBoss"];

	GearManager.Instance().UpdateBySeed(seed);	

	checkDataUpgrade(result);

	update_chatNotice(result["chatSales"]);
	update_salesNotice(result["chatSalesChrome"]);
	ChatNotices.instance().InitChatNotices();
	
	Technology.instance().updateSeed(result);		
	GameMain.instance().SyncPlayerData();
//			arthurCheck(result["arthurCheckArray"]);
	Alliance.getInstance().updateSeed(result);
	DailyLoginRewardMgr.Instance.UpdateBySeed(result);
	
	AvatarMgr.instance().UpdateBySeed(seed);
	Message.getInstance().UpdateEventCenterTabel(seed);

	if ( isNeedUpdateGamble )
	{
		var menuMgr : MenuMgr = MenuMgr.instance;
		if ( menuMgr != null && menuMgr.MainChrom != null )
			menuMgr.MainChrom.UpdateGambleInfo(_Global.INT32(seed["hasFreePlay"]));
	}

	return true;
}


function checkDataUpgrade(result:HashObject)
{
	GameMain.instance().checkUpdateSeed(result);	//reload data...
}
function update_serverSetting(setting:HashObject) {
	if( setting["gameCenterBindOpen"] != null ){
		if( seed["serverSetting"] == null ) seed["serverSetting"] = new HashObject();
        var serverSetting : HashObject = seed["serverSetting"];
		if( serverSetting["gameCenterBindOpen"] == null 
			|| _Global.INT32(serverSetting["gameCenterBindOpen"]) != _Global.INT32( setting["gameCenterBindOpen"] ) ){
			
			serverSetting["gameCenterBindOpen"] = setting["gameCenterBindOpen"];
			MenuMgr.getInstance().sendNotification(Constant.Notice.SERVER_SETTING_CHANGED,null);
		}
        if (setting["gearMaxLevel"] != null) {
            serverSetting["gearMaxLevel"] = setting["gearMaxLevel"];
        } else {
            serverSetting.Remove("gearMaxLevel");
        }
	}

    GameMain.UpdateGearMaxLevel(seed);

	//Alliance.getInstance().UpdateServerSetting(setting);
	GearSysController.UpdateFromSettingSeed(setting);
	
	Quests.instance().UpdateMainRecommendLevel(seed);
	
	BuildingDecMgr.getInstance().checkForGearSys();
	BuildingDecMgr.getInstance().checkForHospitalHaveWounded();
}
function update_chatNotice(notices:HashObject)
{
	seed["chatSales"] = notices;
}

function update_salesNotice(notices:HashObject)
{
	seed["chatSalesChrome"] = notices;
	saleNotices.instance().InitsaleNotices();
	MenuMgr.getInstance().MainChrom.updateSalesIcon();
}

function updateCityComingTime()
{
	var cityList:System.Collections.Generic.List.<City> = CityQueue.instance().Cities;
	for(var j:int= 2; j<=CityQueue.instance().MaxReleasedCityCnt; j++)
	{
		if(seed["cityReleaseTime"] && seed["cityReleaseTime"]["city"+j])
		{
			cityList[j-1].UnblockedTime = _Global.INT64(seed["cityReleaseTime"]["city"+j].Value);
			cityList[j-1].isOpenedByServer = true;
		}
		else
		{
			cityList[j-1].UnblockedTime = GameMain.instance().unixtime()-1;
			if(cityList[j-1].isOpenedByServer)
			{
				cityList[j-1].isOpenedByServer = false;
				var citiesMenu:Cities = MenuMgr.getInstance().getMenu("Cities") as Cities;
				if( citiesMenu ){
					citiesMenu.cityList.SetData(CityQueue.instance().Cities);
				}
			}
		}
	}
}

function updateOfferParams():void
{
    if (PaymentOfferManager.Instance == null)
    {
        return;
    }
    PaymentOfferManager.Instance.UpdateDataWithHashObject(seed["activity"]);
    seed.Remove("activity");

	var ifHasOffer:boolean = PaymentOfferManager.Instance.IsHaveOffer();

	if(!ifHasOffer)		
	{
	    Payment.instance().setCurNoticeType(8);
	    MenuMgr.getInstance().MainChrom.topOfferType = 8;
    }
	
}

function update_trainslots(slots:HashObject)
{
	var cities:Array = _Global.GetObjectKeys(slots);
	if( seed["training_queue"] == null )
		seed["training_queue"] = new HashObject();
	for(var i:int = 0; i<cities.length; i++)
	{
		var citySlots:HashObject = slots[cities[i]];
		var keys:Array = _Global.GetObjectKeys(citySlots);
		for(var j:int = 0; j<keys.length;j++)
		{
			var slot:HashObject = citySlots[keys[j]];
			if( seed["training_queue"][cities[i]][keys[j]] == null )
			{
				seed["training_queue"][cities[i]][keys[j]] = slot;
			}
		}
	}
}

function delete_trainslots(slots:HashObject)
{
   var cities:Array = _Global.GetObjectKeys(slots);
   for(var i:int = 0; i<cities.length; i++)
   {
      var slot:String = "" + slots[cities[i]];
      if(seed["training_queue"][cities[i]] != null)
		  seed["training_queue"][cities[i]].Remove(slot);
   }	
  
}

function update_wallTrainSlots(slots:HashObject){
	var cities:Array = _Global.GetObjectKeys(slots);
	for(var i:int = 0; i<cities.length; i++)
	{
		var citySlots:HashObject = slots[cities[i]];
		var keys:Array = _Global.GetObjectKeys(citySlots);
		for(var j:int = 0; j<keys.length;j++)
		{
			var slot:HashObject = citySlots[keys[j]];
			if( seed["fortify_queue"][cities[i]][keys[j]] == null )
			{
				seed["fortify_queue"][cities[i]][keys[j]] = slot;
			}
		}
	}
	
}

public function update_inventory(inventory:HashObject)
{
	var keys:Array=_Global.GetObjectKeys(inventory);
	var itemId:int;
	var count:int;
	for (var i=0;i<keys.length;i++) 
	{
		itemId = _Global.INT32(keys[i]);
		count = _Global.INT32(inventory[keys[i]]);
		MyItems.instance().AddItem(itemId,count);
	}
}
function update_cityUnits(cityUnits : HashObject){
	var citylist:Array =_Global.GetObjectKeys(cityUnits);
	var prefix:String ="";
	for(var i=0;i<citylist.length;i++){
		var unitlist:Array=_Global.GetObjectKeys(cityUnits[citylist[i]]);
		var cityid:String =(citylist[i] as String).Split("c"[0])[1];
		for(var j=0;j<unitlist.length;j++){
			var unitid:String = (unitlist[j] as String).Split("u"[0])[1];

//			if (_Global.IsValueInArray( Constant.FortificationTypesIDS, unitid))
//			{
//				seed["fortifications"]["city"+cityid]["fort"+unitid].Value=_Global.INT32(cityUnits[citylist[i]][unitlist[j]].Value);
//				Walls.instance().UpadateTroopList(_Global.INT32(unitid));
//			}else{

				seed["units"]["city"+cityid]["unt"+unitid]= new HashObject(_Global.INT64(cityUnits[citylist[i]][unitlist[j]]));
//			}
		}
		
		MenuMgr.getInstance().sendNotification(Constant.Notice.WALL_UNITS_CNT_UP, null);
	}
//	if($("cityinfo_3").visible()){
//		cityinfo_changetab(3);
//	}
}

private function UpdateSelectiveDefenseUnits(defenseUnits : HashObject)
{
    if (seed["selective_defense"] == null)
    {
        seed["selective_defense"] = new HashObject();
    }

    var cityList : String[] = _Global.GetObjectKeys(defenseUnits);
    for (var i = 0; i < cityList.Length; ++i)
    {
        var unitList : String[] = _Global.GetObjectKeys(defenseUnits[cityList[i]]);
        var cityId : String = cityList[i].Split("c"[0])[1];
        
        if (seed["selective_defense"]["c" + cityId] == null)
        {
            seed["selective_defense"]["c" + cityId] = new HashObject();
        }
        
        for (var j = 0; j < unitList.Length; ++j)
        {
            var unitId : String = unitList[j].Split("u"[0])[1];
            seed["selective_defense"]["c" + cityId]["u" + unitId] = 
                    new HashObject(_Global.INT32(defenseUnits[cityList[i]][unitList[j]]));
        }
    }

    MenuMgr.getInstance().sendNotification(Constant.Notice.SelectiveDefenseCountChanged, null);
}

function update_help_research(updateResearch){
/*	var tch=_Global.INT32(updateResearch.t);
	var diff=_Global.INT32(updateResearch.n);
	if(_Global.INT32(seed.tch_hlp["t"+tch])>0){
		diff=diff-_Global.INT32(seed.tch_hlp["t"+tch]);
	}
	seed.tch_hlp["t"+tch]=_Global.INT32(updateResearch.n);
	var cities=Object.keys(seed.queue_tch);
	for(var i=0;i<cities.length;i++){
		for(var j=0;j<seed.queue_tch[cities[i]].length;j++){
			if(_Global.INT32(seed.queue_tch[cities[i]][j][0])==tch){

				var totalTime = _Global.INT32(seed.queue_tch[cities[i]][j][3]) - _Global.INT32(seed.queue_tch[cities[i]][j][2]);
				var onePercent = _Global.INT32(totalTime * 0.01);
				var oneMinute = 60; 
				var whichGreater = Math.max(onePercent, oneMinute);

				seed.queue_tch[cities[i]][j][2]=_Global.INT32(seed.queue_tch[cities[i]][j][2])-whichGreater*diff;
				seed.queue_tch[cities[i]][j][3]=_Global.INT32(seed.queue_tch[cities[i]][j][3])-whichGreater*diff;
				break;
			}
		}
	}*/
}
function update_help_construct(updateConstruct){
/*	var bld=_Global.INT32(updateConstruct.b);
	var diff=_Global.INT32(updateConstruct.n);
	if(_Global.INT32(seed.con_hlp["b"+bld])>0){
		diff=diff-_Global.INT32(seed.con_hlp["b"+bld]);
	}
	seed.con_hlp["b"+bld]=_Global.INT32(updateConstruct.n);
	var cities=Object.keys(seed.queue_con);
	for(var i=0;i<cities.length;i++){
		for(var j=0;j<seed.queue_con[cities[i]].length;j++){
			if(_Global.INT32(seed.queue_con[cities[i]][j][2])==bld){

				var totalTime = _Global.INT32(seed.queue_con[cities[i]][j][4]) - _Global.INT32(seed.queue_con[cities[i]][j][3]);
				var onePercent = _Global.INT32(totalTime * 0.01);
				var oneMinute = 60; 
				var whichGreater = Math.max(onePercent, oneMinute);

				seed.queue_con[cities[i]][j][3]=_Global.INT32(seed.queue_con[cities[i]][j][3])-whichGreater*diff;
				seed.queue_con[cities[i]][j][4]=_Global.INT32(seed.queue_con[cities[i]][j][4])-whichGreater*diff;
				break;
			}
		}
	}*/
}


function update_players(players:HashObject)
{
	var playersIds:Array = _Global.GetObjectKeys(players);
	for(var j=0;j<playersIds.length;j++)
	{
		seed["players"][playersIds[j]] =players[playersIds[j]];
	}	
	
}				

function update_allianceNames(allianceNames:HashObject)
{		
	var keys:Array = _Global.GetObjectKeys(allianceNames);
	if(seed["allianceNames"] == null)
		seed["allianceNames"] = new HashObject();
	for(var j=0;j<keys.length;j++)
	{
		seed["allianceNames"][keys[j]] =allianceNames[keys[j]];
	}	
}
						
function update_atkinc(ackinc:HashObject)
{	
	if(Watchtower.instance() == null)
		return;
	
	var marches:Array = _Global.GetObjectKeys(ackinc);
	var numIncAtkAfter:int = 0;
	for(var j=0;j<marches.length;j++)
	{			// incoming march began			
		var curMarch:HashObject = ackinc[marches[j]];		
		seed["queue_atkinc"][marches[j]] = ackinc[marches[j]];
		
		if(seed["queue_atkinc"][marches[j]]["score"])
		{
	//		Watchtower.instance().UpdateAtkinc(marches[j], seed["queue_atkinc"][marches[j]], seed);	
			numIncAtkAfter++;
		}		
	}		
	
	seed["queue_atkinc"] = 	ackinc;
	Watchtower.instance().SynDataWithSeed();
	
}



function updateMarchId(updateMarchIdObj:HashObject):void
{
	for(var cty:System.Collections.DictionaryEntry  in updateMarchIdObj.Table)
	{
		var marches:Array = _Global.GetObjectValues(cty.Value as HashObject);
		
		for(var march:Object in marches)
		{
			if(_Global.INT32((march as HashObject)["marchStatus"]) == Constant.MarchStatus.INACTIVE)
			{
				if(!seed["outgoing_marches"][cty.Key as String])
					seed["outgoing_marches"][cty.Key as String] = new HashObject();				
				seed["outgoing_marches"][cty.Key as  String]["m" + (march as HashObject)["marchId"].Value ] = march as HashObject;			
			}	
		}
	}
}

function update_wilderness(updateWilderness:HashObject)
{
	var obj:Hashtable = updateWilderness.Table;
	var curWilderList:Array;
	var newtileId:int;
	var newcityId:int;
	for(var j:System.Collections.DictionaryEntry in obj) // c41..
	{
		var cs:String = j.Key;
		cs = cs.Substring(4);
		var cityId:int = _Global.INT32(cs);
		var tileid:int;
		var rlist:Hashtable = (j.Value as HashObject).Table;
		var comeTileIds:Array = new Array();
		for(var element:System.Collections.DictionaryEntry in rlist)
		{
			comeTileIds.Add(_Global.INT32((element.Key as String).Substring(1)));
		}
		curWilderList = WildernessMgr.instance().getWildernessIdArray(cityId);
		
		if(curWilderList == null)
		{
			curWilderList = new Array();
		}
			
		newcityId = cityId;
		
		for(var s:int = 0; s<curWilderList.length; s++)                   //DELETE
		{
			tileid = curWilderList[s];

			var flag:boolean = true;
//			var tempTileid:int;
            var index : int = System.Array.IndexOf.<int>(comeTileIds.ToBuiltin(int), tileid);
			if(index > -1)
				flag = false;
//			for(var k:int = 0; k<rlist.length; k++)
//			{
//				tempTileid = _Global.INT32(rlist[k]);
//				if(tempTileid == tileid)
//				{
//					flag = false;
//					break;
//				}
//			}
			if(flag)
			{		
				var wvo:WildernessVO = WildernessMgr.instance().getWilderness(tileid);
				wvo.tileStatus = Constant.WildernessState.DELETED;
				wvo.calcRemainingTime();
				//WildernessMgr.instance().AddEmptySlot(tileid+WildernessMgr.EmptySlotBaseSequence);
				March.instance().addItemstoInventory(tileid);
				seed["wilderness"]["city"+cityId].Remove(("t"+tileid));
			}
		}
		
		for(var k:int = 0; k<comeTileIds.length; k++)						//ADD
		{
			tileid = comeTileIds[k];

			var flag1:boolean = true;

			var addindex:int = System.Array.IndexOf.<int>(curWilderList.ToBuiltin(int), tileid);
			if(addindex > -1)
				flag1 = false;

			if(flag1)
			{
				seed["wilderness"]["city"+cityId]["t"+tileid] = new HashObject();
				seed["wilderness"]["city"+cityId]["t"+tileid] = rlist["t"+tileid];
				seed["wilderness"]["city"+cityId]["t"+tileid]["inSurvey"] = new HashObject();
				seed["wilderness"]["city"+cityId]["t"+tileid]["inSurvey"].Value = 0;
//				var wvo:WildernessVO = WildernessMgr.instance().getWilderness(tileid);
//				wvo.inSurvey = Constant.WildernessState.DELETED;
//				wvo.calcRemainingTime();
				var id:HashObject =  seed["wilderness"]["city"+cityId]["t"+tileid];
				WildernessMgr.instance().addSeedMarchObj2Mgr(cityId,id);
			}
		}
	}
	
}

function update_march(updateMarch:HashObject)
{
	var cities:Array =_Global.GetObjectKeys(updateMarch);	
	var numIncAtkBefore:int = 0;
	var numIncAtkCityId:int = 0;
	var numIncAtkAfter:int = 0;
	var cityId:int;
	for(var i=0;i<cities.length;i++)
	{
		cityId = _Global.INT32((cities[i] as String).Split("c"[0])[1]);
		var marches:Array = _Global.GetObjectKeys(updateMarch[cities[i]]);	//KEYS.

		for(var j=0;j<marches.length;j++)
		{
			// incoming march began			
			var curMarch:HashObject = updateMarch[cities[i]][marches[j]];
			var cid:String =(cities[i] as String ).Split("c"[0])[1];
			var mid:String =(marches[j] as String).Split("m"[0])[1];
				
			if(curMarch && curMarch["score"] && seed["outgoing_marches"][cities[i]] && !seed["outgoing_marches"][cities[i]][marches[j]])
			{
				// Handle incoming marches when available
			/*	if (Object.isArray(seed.queue_atkinc)) {
					seed.queue_atkinc = new Object;
				}	*/			
				seed["queue_atkinc"][marches[j]] = curMarch;
				if(seed["queue_atkinc"][marches[j]]["marchType"] && _Global.INT32(seed["queue_atkinc"][marches[j]]["marchType"]) == Constant.MarchType.ATTACK && (_Global.INT32(seed["queue_atkinc"][marches[j]]["marchType"]) == Constant.MarchType.COLLECT || 
				_Global.INT32(seed["queue_atkinc"][marches[j]]["marchType"]) == Constant.MarchType.COLLECT_RESOURCE))
				{
					if( Watchtower.instance() != null )
						Watchtower.instance().UpdateAtkinc(marches[j], seed["queue_atkinc"][marches[j]], seed);
				}	
				numIncAtkAfter++;
				if (curMarch["players"]) 
				{
					var player:Hashtable = curMarch["players"].Table;
					var pkey:String = _Global.GetObjectKeys(player)[0] as String;
					if (!seed["players"][pkey]) 
					{
						seed["players"][pkey] = player[pkey];
					}
				}
			}
			else 
			if((curMarch["marchStatus"] != null && _Global.INT32( curMarch["marchStatus"] ) == Constant.MarchStatus.INACTIVE) && seed["queue_atkinc"][marches[j]])
			{
				seed["queue_atkinc"].Remove(marches[j]);
//				WatchTower.instance().UpdateAtkinc(marches[j], seed["queue_atkinc"][marches[j]], seed);
				if (_Global.GetObjectKeys(seed["queue_atkinc"]).length==0) 
				{
					seed["queue_atkinc"] = new HashObject();
				}
				updateMarchWithElse(curMarch,cid,mid);	//fix patch.
			}	
			else
			{ //START MY MARCH.
				
				// update time
				var localMarchData : HashObject = null;
				if (null != seed["outgoing_marches"]["c"+cid] && null != seed["outgoing_marches"]["c"+cid]["m"+mid])
					localMarchData = seed["outgoing_marches"]["c"+cid]["m"+mid];
				
				if (null != localMarchData) {
					
					var timeChanged : boolean = false;
					if((_Global.INT32(localMarchData["marchType"]) == Constant.MarchType.COLLECT_RESOURCE || _Global.INT32(localMarchData["marchType"]) == Constant.MarchType.COLLECT) && 
					curMarch["marchStatus"] != null && (_Global.INT32(curMarch["marchStatus"]) == Constant.MarchStatus.DEFENDING || _Global.INT32(curMarch["marchStatus"]) == Constant.MarchStatus.RETURNING))
					{
						if (null != curMarch["startTime"]) {
							localMarchData["marchUnixTime"] = curMarch["startTime"];
							timeChanged = true;
						}
						if (null != curMarch["endTime"]) {
							localMarchData["destinationUnixTime"] = curMarch["endTime"];
							timeChanged = true;
						}
					
						// if(_Global.INT32(curMarch["marchStatus"]) == Constant.MarchStatus.RETURNING)
						// {
							if (null != curMarch["returnUnixTime"]) {
								localMarchData["returnUnixTime"] = curMarch["returnUnixTime"];
								timeChanged = true;
							}
						// }
						// else
						// {
							if (null != curMarch["returningTime"]) {
								localMarchData["destinationUnixTime"] = curMarch["returningTime"];
								timeChanged = true;
							}	
						//}
						if (null != curMarch["marchStatus"])
						{
							localMarchData["marchStatus"] = curMarch["marchStatus"];
							timeChanged = true;
						}
					}
					else
					{		
						if (null != curMarch["marchUnixTime"]) {
							localMarchData["marchUnixTime"] = curMarch["marchUnixTime"];
							timeChanged = true;
						}
						if (null != curMarch["destinationUnixTime"]) {
							localMarchData["destinationUnixTime"] = curMarch["destinationUnixTime"];
							timeChanged = true;
						}
						if (null != curMarch["returnUnixTime"]) {
							localMarchData["returnUnixTime"] = curMarch["returnUnixTime"];
							timeChanged = true;
						}					
					}	
					if (timeChanged) {
						var marchVO:MarchVO = March.instance().getMarchWithCityId(_Global.INT32(mid), _Global.INT32(cid));
						if (null != marchVO)
							marchVO.mergeDataFrom(localMarchData);
					}			
				}
								
				if(curMarch["fght"])
				{
					var unts :HashObject = curMarch["fght"]["s1"];
					var untkeys :Array =_Global.GetObjectKeys(unts);
					//set all to 0.
					March.clearMarchReturnCount(localMarchData);
					
					for(var k:int =0;k<untkeys.length;k++)	//KEY like u1 u2..
					{						
						var unitIdStr:String = ((untkeys[k] as String).Split("u"[0])[1]);
						
						if(null != localMarchData) //march back.
						{
							localMarchData["unit"+unitIdStr+"Return"]=unts[untkeys[k]][_Global.ap + 1];							
							//added.  modify  marchVO data if possilbe.
							March.instance().updateMarchVOReturn(_Global.INT32(cid),_Global.INT32(mid),unitIdStr,_Global.INT32(unts[untkeys[k]][_Global.ap + 1]) );
						}
						else //directly return back.
						{
							seed["units"]["city"+cid]["unt"+unitIdStr ].Value=_Global.INT32(seed["units"]["city"+cid]["unt"+unitIdStr]) + _Global.INT32(unts[untkeys[k]]["1"]);
						}
					}
					// move to the default else part..
				}
				
				// Defending......
				if(curMarch["conquered"] && _Global.INT32(curMarch["conquered"])==1)	// win the battle
				{
					localMarchData["marchStatus"].Value = curMarch["marchStatus"].Value;//Constant.MarchStatus.DEFENDING;
					March.instance().syncSeedMarch(_Global.INT32(cid), _Global.INT32(mid) );
					// seed.wilderness update
					if (_Global.INT32(localMarchData["toTileType"])!= 51 &&
							_Global.INT32(localMarchData["toTileType"])!= 52) 
					{
						var tileId:String = _Global.GetString(localMarchData["toTileId"]);
						if (!seed["wilderness"]["city"+cityId]["t"+tileId]) 
						{
						///	if (Object.isArray(seed.wilderness["city"+currentcityid])) 
						//	{
						//		seed.wilderness["city"+currentcityid] = {};
						//	}
						// add a wilderness. 
							
							var mp:MapController = GameMain.instance().getMapController();
							if( mp ){
								mp.repaint(true);
							}
						}
					}
					// updating marchStauts.
					
//					g_mapObject.getMoreSlots();
				}	
				else if(curMarch["marchStatus"] && _Global.INT32(curMarch["marchStatus"]) == Constant.MarchStatus.DEFENDING)
				{	// lost the battle ...
					var tileid:String = _Global.GetString(localMarchData["toTileId"]);
					if(curMarch["surveyStatus"] && _Global.INT32(curMarch["surveyStatus"]) == 1 )
					{
						if(null != localMarchData) 
						{
							var mvo:MarchVO = March.instance().getMarchInTotalCitites(_Global.INT32(mid));
							if(mvo && mvo.marchStatus == Constant.MarchStatus.DEFENDING)
							{
								continue;
							}
							var rlist:Array = _Global.GetObjectValues(curMarch["rewards"]);
							var item:HashObject;
							var iid:long;
							var inum:int;
							
							if(rlist.length == 0)	//
								continue;
								
							for(var s:int = 0; s<rlist.length; s++)
							{
								item = rlist[s] as HashObject;
								if(!item)
									continue;
									
								iid = _Global.INT64(item["itemId"]);
								inum = _Global.INT32(item["count"]);
								localMarchData["rewards"] = curMarch["rewards"];
								
								if(seed["items"]["i" + iid] == null)
								{
									seed["items"]["i" + iid] = new HashObject(1);
								}
								else
								{
									seed["items"]["i" + iid].Value = _Global.INT32(seed["items"]["i" + iid].Value)+inum;
								}
								
								if(localMarchData["surveyStatus"])
									localMarchData["surveyStatus"].Value = 1;
								else
								{
									localMarchData["surveyStatus"] = new HashObject();
									localMarchData["surveyStatus"].Value = 1;
								}
								//MyItems.instance().AddItem(iid,inum);
							}

						}
						var wvo:WildernessVO = WildernessMgr.instance().getWilderness(_Global.INT32(tileid));	
						if(curMarch["tiles"] && wvo) 
						{			
							var curMarchCityid:int = wvo.tileCityId;
							var tileObj:HashObject = curMarch["tiles"];
							if(MenuMgr.getInstance() != null)
								MenuMgr.getInstance().sendNotification(Constant.Notice.WILDSLOTS_UPDATE, null);
							seed["wilderness"]["city"+curMarchCityid]["t"+tileid]["freezeEndTime"].Value = _Global.INT64(tileObj["endTime"].Value);
							if(seed["wilderness"]["city"+curMarchCityid]["t"+tileid]["inSurvey"] == null)
								seed["wilderness"]["city"+curMarchCityid]["t"+tileid]["inSurvey"] = new HashObject();
							seed["wilderness"]["city"+curMarchCityid]["t"+tileid]["inSurvey"].Value = 0;
							wvo.mergeDataFrom(seed["wilderness"]["city"+curMarchCityid]["t"+tileid]);
							wvo.calcRemainingTime();
							wvo.inSurvey = 0;							
							if(curMarchCityid == GameMain.instance().getCurCityId())
								WildernessMgr.instance().AddSpeedUpSlot(wvo.tileId);

						}
						//continue;
					}				
					if(null != localMarchData) 
					{
						localMarchData["marchStatus"].Value = Constant.MarchStatus.DEFENDING;
						for(k=1;k<Constant.MAXUNITID;k++)
						{
							localMarchData["unit"+k+"Return"]=localMarchData["unit"+k+"Count"];
						}
						
						var incKeys:Array = _Global.GetObjectKeys(seed["queue_atkinc"]);
						var notInIncoming:boolean = false;
						for(k=0;k<incKeys.length;k++)
						{
							if(incKeys[k] == "m"+mid)
							{
				//				found = true;
							}
						}
						if(!notInIncoming) 
						{								
							seed["queue_atkinc"]["m"+mid] = localMarchData;							
						}
						March.instance().syncSeedMarch(_Global.INT32(cid), _Global.INT32(mid) );


					}
				}
				else	// for multily cities.
				if(curMarch["marchStatus"] && (_Global.INT32(curMarch["marchStatus"]) == Constant.MarchStatus.INACTIVE))
				{
					this.updateMarchWithElse(curMarch,cid,mid);
				}
				else 
				if(curMarch["fromPlayerId"] && curMarch["fromPlayerId"] == Datas.instance().tvuid())
				{
					try
					{						
						var keys:Array = _Global.GetObjectKeys(curMarch);						
						var fromCityId:int = curMarch["fromCityId"].Value;
						for(var xindex=0;xindex<keys.length;xindex++)
						{
							if(typeof(localMarchData[keys[xindex]].Value)=="undefined")
							{
								localMarchData[keys[xindex]] = curMarch[keys[xindex]];
							}
						}
						var marchId:String = (marches[j] as String).Substring(1);						
						localMarchData['marchId'].Value = marchId; 

					}catch(e){ }
				}
				//
				else if(curMarch["type"] && _Global.INT32(curMarch["type"]) == Constant.MarchType.REINFORCE)
				{
					//do nothing......
				}				
				else 	//invalid 
				{					
					
					updateMarchWithElse(curMarch,cid,mid);
				}
			//END MY MARCH.
			}
		//end for
		}

	}
	
	if( needCheckQuestCntForMarch > 0 ){
		new Thread( new ThreadStart( Quests.instance().checkForMarch )).Start();
		needCheckQuestCntForMarch --;
	}
    
    DailyQuestHelper.CheckFightWorldMapQuestProgress(updateMarch);
	return true;
}

private function updateMarchWithElse(curMarch:HashObject,cid:String,mid:String):void
{
	try
	{
		if(curMarch["newArrivalTime"])
			return;							
		// web platform has bugs here.
		//Constant.MarchStatus.RETURNING;
//						if(curMarch["marchStatus"] == 0)
//						{
//							_Global.Log(" March Returened!");
//						}
		var marchtime:long;
		var	ut = GameMain.unixtime();
		var marchObj:HashObject = seed["outgoing_marches"]["c" + cid]["m" + mid];
		var k:int;		
		if(marchObj == null)
		{
//			_Global.Log("UpdateSeed: March not exists.." + cid + " : " + mid );
			return;
		}	
		
		var mtype:int  = _Global.INT32(marchObj["marchType"]);	
		var mstatus:int;
		
		if(curMarch["marchStatus"] != null)
		{
		  	mstatus = _Global.INT32(curMarch["marchStatus"]);
			seed["outgoing_marches"]["c"+cid]["m"+mid]["marchStatus"] = curMarch["marchStatus"];
		}
		else
		{
			//mstatus = _Global.INT32(seed["outgoing_marches"]["c"+cid]["m"+mid]["marchStatus"]);
			for(k=1;k<Constant.MAXUNITID;k++)
			{
				if(curMarch["u" + k ] != null)
				{
					for(k=1;k<Constant.MAXUNITID;k++)
					{
						marchObj["unit"+ k +"Count"].Value = _Global.INT32(curMarch["u" + k ]);
					}
					break;
				}
			} 
			March.instance().syncSeedMarch(_Global.INT32(cid),_Global.INT32(mid) );
			return ;
		}
	
		switch(mtype)
		{
			case Constant.MarchType.TRANSPORT:
				for(k=1;k<Constant.MAXUNITID;k++)
				{
					seed["outgoing_marches"]["c"+cid]["m"+mid]["unit"+k+"Return"]=seed["outgoing_marches"]["c"+cid]["m"+mid]["unit"+k+"Count"];
				}
				break;
			case Constant.MarchType.REINFORCE:	
			case Constant.MarchType.SURVEY:
			case Constant.MarchType.ATTACK:
			case Constant.MarchType.COLLECT:
			case Constant.MarchType.COLLECT_RESOURCE:
				marchtime = _Global.INT64(marchObj["returnUnixTime"]) - _Global.INT64(marchObj["destinationUnixTime"]);
				// returning not by recall. 
				if(mstatus == Constant.MarchStatus.RETURNING || mstatus == Constant.MarchStatus.SITUATION_CHANGED)
				{
					if(curMarch["returningTime"] != null)
						ut = _Global.INT64(curMarch["returningTime"]);
					marchObj["returnUnixTime"].Value = ut + marchtime;
					marchObj["destinationUnixTime"].Value = ut;
					marchObj["marchUnixTime"].Value = ut - marchtime;
				}
				break;
			case Constant.MarchType.ALLIANCEBOSS:
				if (mstatus == Constant.MarchStatus.INACTIVE)
				{
					if (KBN.PveController.instance().GetPveMarchInfo().levelID == _Global.INT32(marchObj["toTileId"]))
					{
						KBN.PveController.instance().OnAllianceBossMarchOver(false);
					}
					MenuMgr.instance.sendNotification(Constant.Notice.PVE_UPDATE_MARCH_DATA, "updateAttackBtn");
				}
				break;
		}
		//sync  unitXReturn with update_March data.
		
		for(k=1;k<Constant.MAXUNITID;k++)
		{
			if(marchObj["unit"+ k +"Return"] == null)
				marchObj["unit"+ k +"Return"] = new HashObject();
			
			if(curMarch["unit" + k  + "Return"] != null)
				marchObj["unit"+ k +"Return"].Value = _Global.INT32(curMarch["unit" + k  + "Return"]);
			else
				marchObj["unit"+ k +"Return"].Value = 0;
		}
		if (null != curMarch["winner"])
		{
			marchObj["winner"] = curMarch["winner"];
		}
		
		if(mtype == Constant.MarchType.RALLY_ATTACK || mtype == Constant.MarchType.JION_RALLY_ATTACK)
		{
			return;
		}
		March.instance().setMarchReturn(_Global.INT32(cid),_Global.INT32(mid) );
	}catch(e)
	{
	}

}

function update_seed(updateSeed:HashObject):boolean
{
	if(updateSeed==null ){
		return false;
	}

	var cities:Array =updateSeed["city"]?_Global.GetObjectKeys(updateSeed["city"]):[];

	var prodUpdate:boolean = false;

	/*  是否需要更新玩家的城堡皮肤 */
	var citySkinUpdate: boolean = false;


	for(var i=0;i<cities.length;i++){
		var cid: String = cities[i];

		/******************************* production ******************************/

		var prod:HashObject=updateSeed["city"][cid]["production"];
		/*fiscalUnixTime, population, gold, resourceUnixTime, resourc1x3600,resource2x300,resource4x3600*/

		if (prod) {
			prodUpdate = true;
			if(prod["population"]!= null){
//				_Global.Log(prod["population"] + " cid:" + cid + " seed:" + ( seed != null ));
//				_Global.Log("citystats:"+seed["citystats"]);
//				var keys:Array = _Global.GetObjectKeys(seed["citystats"]);
//				for( var key in keys ){
//					_Global.Log("key :" + key );
//				}
//				_Global.Log("pop:"+seed["citystats"]["city"+cid]);
//				_Global.Log("pop:"+seed["citystats"]["city"+cid]["gold"]);
//				_Global.Log("pop:"+seed["citystats"]["city"+cid]["pop"]);
				seed["citystats"]["city"+cid]["pop"][_Global.ap +0].Value=_Global.INT32(prod["population"]);
			}
			
			if(prod["laborPopulation"]!= null)
			{
				seed["citystats"]["city"+cid]["pop"][_Global.ap +3].Value=_Global.INT32(prod["laborPopulation"]);
			}
			if(prod["populationCap"]!= null){
				seed["citystats"]["city"+cid]["pop"][_Global.ap +1].Value=_Global.INT32(prod["populationCap"]);
			}
			if(prod["gold"]!= null){
				seed["citystats"]["city"+cid]["gold"][_Global.ap +0].Value= _Global.INT64(prod["gold"]);
			}
			if(prod["taxRate"]!= null)
			{
				seed["citystats"]['city' + cid]["gold"][_Global.ap + 1].Value = _Global.INT32(prod["taxRate"]);
			}

			for(var j=1;j<9;j++){
				if(prod["resource"+j+"x3600"] != null){
//					_Global.Log(prod["resource"+j+"x3600"]);
					seed["resources"]["city"+cid]["rec"+j][_Global.ap +0].Value=_Global.INT64(prod["resource"+j+"x3600"]);
//					_Global.Log("update:"+seed["resources"]["city"+cid]["rec"+j][_Global.ap +0]/1000000);
				}
				if(prod["resource"+j+"Productivity"]!= null){
					seed["resources"]["city"+cid]["rec"+j][_Global.ap +2].Value=_Global.INT64(prod["resource"+j+"Productivity"]);
				}
				if(prod["resource"+j+"Capx3600"]!= null){
					seed["resources"]["city"+cid]["rec"+j][_Global.ap + 1].Value=_Global.INT64(prod["resource"+j+"Capx3600"]);
				}
				if(prod["resource"+j+"Upkeep"]!= null){
					seed["resources"]["city"+cid]["rec"+j][_Global.ap +3].Value=_Global.INT64(prod["resource"+j+"Upkeep"]);
				}
			}
			
			if(prod["happiness"]!= null){
				seed["citystats"]["city"+cid]["pop"][_Global.ap +2].Value=_Global.INT32(prod["happiness"]);
			}	
			
			if (prod["returnHero"] != null)
			{
			    var returnHeroList : Array = _Global.GetObjectValues(prod["returnHero"]);
			    for (var returnHero : HashObject in returnHeroList)
			    {
			        var heroId : long = _Global.INT64(returnHero["userHeroId"]);
			        var sleepTime : int = _Global.INT32(returnHero["sleepExpireTime"]);
			        var totalTime : int = _Global.INT32(returnHero["totalSleepTime"]);
			        KBN.HeroManager.Instance.SetHeroSleepStatus(heroId, sleepTime, totalTime);
			    }
			}

		}

		/******************************* 更新 citySkins 字段 数据 ******************************/

		var citySkin: HashObject = updateSeed["city"][cid]["citySkin"];
		if (citySkin) {
			citySkinUpdate = true;
			seed["citySkins"][cid + ""] = citySkin;
		}
		/*************************************************************************************/
		
	}
	
	if(prodUpdate)
		Resource.instance().UpdateRecInfo();	

	if(citySkinUpdate) {
		GameMain.instance().CitySkinUpdate();
	}


	if ( updateSeed["xp"] ) {
		seed["xp"] = updateSeed["xp"];
		MenuMgr.getInstance().MainChrom.UpdateData();
		if(GameMain.instance().curSceneLev() >= GameMain.CITY_SCENCE_LEVEL )
			LevelUp.instance().check();
	}
	
	if(updateSeed["vip"] != null)
	{
		GameMain.instance().CheckVipLevelUp(updateSeed["vip"]);
		seed["vip"] = updateSeed["vip"];
	}
	
	if (updateSeed["avaBarrackEffect"] != null)
	{
		seed["avaBarrackEffect"] = updateSeed["avaBarrackEffect"];
	}
	
/*main.js update ui	update_xp();
	update_gold();
	update_pop();*/

	
	
	return true;

}

public		function	addKnights(knights:HashObject){
	
	var cities:Array = _Global.GetObjectKeys( knights );
	var cid:String;
	for( var i:int = 0; i < cities.length; i ++ ){
		cid = cities[i];
		if(seed["knights"][cid] == null)
			 seed["knights"][cid] = new HashObject();			
		var	addKnights:Array = _Global.GetObjectKeys(knights[cid]);			
		for( var j:int = 0;  j < addKnights.length; j ++ ){
			seed["knights"][cid][addKnights[j]] = knights[cid][addKnights[j]];
			knights[cid][addKnights[j]] = null;
		}
	}

	GearManager.Instance().GearKnights.Parse(seed);
}

private		function	update_knights(knights:HashObject)
{
	var cities:Array = _Global.GetObjectKeys( knights );
	var cid:String;
	for( var i:int = 0; i < cities.length; i ++ ){
		cid = cities[i];
		var knightsInCity : HashObject = seed["knights"][cid];
		if(knightsInCity == null)
		{
			knightsInCity = new HashObject();
			seed["knights"][cid] = knightsInCity;
		}

		var newKnightsInCity : HashObject = knights[cid];
		var	keys:Array = _Global.GetObjectKeys(newKnightsInCity);			
		for( var j:int = 0;  j < keys.length; j ++ )
		{
			var knightId:int = _Global.INT32((keys[j] as String).Split("k"[0])[1]);
			var knightInCity : HashObject = knightsInCity["knt"+ knightId];
			if ( knightInCity == null )
				continue;
			var newKnight : HashObject = newKnightsInCity[keys[j]];
			knightInCity["experience"] = newKnight["exp"];
			knightInCity["knightLevel"] = newKnight["lv"];
		}
	}

	GearManager.Instance().GearKnights.Parse(seed);
}

}
