//EXIST STRING HARDCODE: function localError(...)

import	System.Text;

class	UnityNet extends KBN.UnityNet {
    //for Xcode Native
    public static function InitPlayerPrefs()
    {
        var str:String = "mobileid="+mobileId + "&platformid=" + platformId + "&gver=" + BuildSetting.CLIENT_VERSION + "&vcs=" + BuildSetting.CLIENT_VERSION;
        if(Datas.instance().getKabamId() != 0)
            str = str + "&kabam_id=" + Datas.instance().getKabamId();
        //not needed.
        PlayerPrefs.SetString(Constant.NativeDefine.KMP_FB_TOKEN,"access_token");
        PlayerPrefs.SetString(Constant.NativeDefine.KMP_AUTH,str);
    }

	public static function initPlatform()
	{
		var store:Datas.AppStore  = Datas.GetPlatform();
		switch(store)
		{
			case Datas.AppStore.ITunes:
				platformId = IPHONE_PLATFORM_ID;
				break;
			case Datas.AppStore.GooglePlay:
				platformId = GOOGLEPLAY_PLATFORM_ID;
				break;
			case Datas.AppStore.Amazon:
				platformId = AMAZON_PLATFORM_ID;
				break;
			default:
			#if UNITY_ANDROID
				platformId = GOOGLEPLAY_PLATFORM_ID;
			#else
				platformId = IPHONE_PLATFORM_ID;
			#endif
				break;

		}

		_Global.Log("platformId=" + platformId);
		_Global.Log("store=" + store);

	}

	public static function reportPaymentErrorToServer(error_code:int, errorMsg:String):void
	{
		var form:WWWForm = new WWWForm();
		form.AddField("productid", getStringParam(errorMsg, ";productid:", ';'));
		form.AddField("currency", getStringParam(errorMsg, ";currency:", ';'));
		form.AddField("detail", errorMsg);
		form.AddField("errorcode", error_code.ToString());
		shortRequest("paymentError.php", form, null, null);
	}
	public static function SendAllianceInvitationClickBI(pos:String):void
	{
		var url:String = "tracking.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", Constant.BIType.ALLIANCE_INVITATION_CLICK);
		form.AddField("pos", pos);
		shortRequest(url, form, null, null);
	}

	public static function init(mid:String, moBehaviour:MonoBehaviour){
        _Global.Log("[UnityNet init]");
//		checkPlatform();
		initPlatform();
		changeMobileId(mid);
		monoBehaviour = moBehaviour;
		constMdValue = getMD5Hash(STATIC_KEY);

		baseUrl = selectedServerURL;

        // For UnityNet conversion to C# TODO: remove when possible
        PopupMgr.getInstance();

        onHookResult = null;
	}

	public static function changeMobileId(mid:String):void
	{
		if(mid && mid.Length > 0)
		{
			mobileId = mid;
			InitPlayerPrefs();
		}
	}

	public static function setWorldId(id: int) {
		var domain: String = subDomain + id + mainDomain;
		baseUrl = domain + "ajax/";
		PlayerPrefs.SetString(Constant.NativeDefine.KMP_WORLD_URL, domain);
	}

	public static function reqLoadingTips(okFunc:Function, errorFunc:Function){
		var url:String;
		var form:WWWForm = new WWWForm();

		url = selectedServerURL+ "getGameTip.php";

		var userID:int = Datas.instance().tvuid();
		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();
		var lang:String = Datas.instance().getGameLanguageAb().ToString();
		form.AddField("udid",deviceInfo.udid);
		form.AddField("tvuid",userID);
		form.AddField("lang",lang);
		baseRequest(url, form, okFunc, errorFunc);
	}

	//GameMain start
	public	static function	reqServerTime(okFunc:Function, errorFunc:Function, gameConfigVersion:String){
		var url:String = selectedServerURL + "getServerTime.php";

		var form:WWWForm = new WWWForm();
		form.AddField("gameConfigVersion", gameConfigVersion);

		baseRequest(url, form, okFunc, errorFunc);
	}

	public	static function	signup(worldId:int, okFunc:Function, errorFunc:Function){
		signup( worldId, okFunc, errorFunc, null, null );
	}

	public	static function	signup(worldId:int, okFunc:Function, errorFunc:Function, gcplayerId:String,gcplayerAlias:String){

		var form:WWWForm = new WWWForm();
		var language:String = Datas.instance().getGameLanguageAb();
		if(worldId != -1)
			form.AddField("worldid", worldId);
		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();
		form.AddField("udid",deviceInfo.udid);
		form.AddField("unityDevId",SystemInfo.deviceUniqueIdentifier);
		form.AddField("m_mac", deviceInfo.macAll);
		form.AddField("m_iso", deviceInfo.osName);
		form.AddField("m_osVer",deviceInfo.osVersion);
		form.AddField("m_deviceIFA",deviceInfo.IFA);
		form.AddField("m_deviceIFV",deviceInfo.IFV);

		_Global.Log("SignUp IFV : " + deviceInfo.IFV);

		var logString:String=String.Format("info:deviceinfo.mac0 is {0} , ifv is {1}", deviceInfo.mac0, deviceInfo.IFV);
		form.AddField("testData",logString);
		form.AddField("limit_ad",(deviceInfo.LimitAdTracking == "false"?"0":"1"));
		form.AddField("m_manufacturer", deviceInfo.manufactor);
		form.AddField("m_model", deviceInfo.model);
		form.AddField("m_language", deviceInfo.GetAndroidSystemLanguage());
		form.AddField("wifi", Application.internetReachability == NetworkReachability.ReachableViaCarrierDataNetwork ? 1: 0);
		form.AddField("carrierName",deviceInfo.carrierName);
		form.AddField("mnc",deviceInfo.MNC);
		form.AddField("mcc",deviceInfo.MCC);
		form.AddField("openUDID", deviceInfo.OpenUDID);


	/*------------------------------------------------------------*/
	/* 数数统计-公共事件属性需要上传后端 */
		var props = ThinkingAnalyticsManager.Instance.GetPresetProperties();
		if (props != null) {
			form.AddField("device_id", props.DeviceId);
			form.AddField("os", props.OS);
			form.AddField("OSVersion", props.OSVersion);
			form.AddField("app_version", props.AppVersion);
		}

	/*------------------------------------------------------------*/


		form.AddField("client_lang",language);

		if(String.IsNullOrEmpty(gcplayerId) == false)
		{
			form.AddField("gcUidAuth",gcplayerId);
		}
		if(String.IsNullOrEmpty(gcplayerAlias) == false)
		{
			form.AddField("gcNickAuth",gcplayerAlias);
		}

		if(Application.platform == RuntimePlatform.Android)
		{
			if(deviceInfo.ADID != null)
				form.AddField("adid",deviceInfo.ADID); //adid
			form.AddField("u4",UnityNet.getMD5Hash("59a1cc5e4b7af16131a80973739b783f" + SystemInfo.deviceUniqueIdentifier));
			form.AddField("imei",NativeCaller.GetIMEI());
		}

		var url: String = selectedServerURL + "signup.php";
		var lang:String = Datas.instance().getGameLanguageAb().ToString();
		form.AddField("lang",lang);

		baseRequest(url,form,okFunc,errorFunc);
	}

	public	static function	getSeed(tvuid:int, okFunc:Function, errorFunc:Function){
		var url:String = "getSeed.php";

		var language:String = Datas.instance().getGameLanguageAb();
		var form:WWWForm = new WWWForm();
		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();

		form.AddField("udid",deviceInfo.udid);
		form.AddField("m_deviceIFA",deviceInfo.IFA);
		form.AddField("m_deviceIFV",deviceInfo.IFV);
		form.AddField("limit_ad",(deviceInfo.LimitAdTracking == "false"?"0":"1"));
		form.AddField("openUDID",deviceInfo.OpenUDID);
		form.AddField("tvuid", tvuid);
		form.AddField("lang", language);
		if(Application.platform == RuntimePlatform.Android)
		{
			var initTime=GameMain.instance().GetApplicationInitTime()+"";
			if (PlayerPrefs.GetInt("isRestart",0)==0)
				form.AddField("initTime",initTime);
			else
				form.AddField("initTime","0");
		}

		var model : String = SystemInfo.deviceModel;
		form.AddField("deviceModel", model);
		var memorySize : int =  SystemInfo.systemMemorySize;
		form.AddField("systemMemorySize", memorySize);
		var graphicsMemorySize : int = SystemInfo.graphicsMemorySize;
		form.AddField("graphicsMemorySize", graphicsMemorySize);
		var processorCount : int = SystemInfo.processorCount;
		form.AddField("processorCount", processorCount);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static function	checkData(params:Array, okFunc:Function, errorFunc:Function){
		var url:String = "upgrade.php";

		var form:WWWForm = new WWWForm();
		form.AddField("type",""+ params[0]);
		form.AddField("version",""+ params[1]);
		form.AddField("worldId", Datas.instance().worldid() );

		shortDownload(url, form, okFunc, errorFunc);
	}

	public	static function	checkString(params:Array, okFunc:Function, errorFunc:Function){
		var url:String = "upgrade.php";

		var form:WWWForm = new WWWForm();
		form.AddField("type", ""+params[0]);
		form.AddField("language", ""+params[1]);
		form.AddField("version",""+ params[2]);
		form.AddField("worldId", Datas.instance().worldid() );
		form.AddField("format","text");

		shortDownload(url, form, okFunc, errorFunc);
	}

	public	static function	checkGDSVersion(params:Array, okFunc:Function, errorFunc:Function){
		var url:String = "gdsVersion.php";

		var form:WWWForm = new WWWForm();
		form.AddField("building",""+ params[0]);
		form.AddField("troop",""+ params[1]);
		form.AddField("gear",""+ params[2]);
		form.AddField("gearLevelUp",""+ params[3]);
		form.AddField("sysConfig",""+ params[4]);
		form.AddField("gearItemChest",""+ params[5]);
		form.AddField("gearSkill",""+ params[6]);
		form.AddField("d",""+ params[7]);
		form.AddField("Vip",""+ params[8]);
		form.AddField("PveBoss",""+ params[9]);
		form.AddField("PveChapter",""+ params[10]);
		form.AddField("PveDrop",""+ params[11]);
		form.AddField("PveLevel",""+ params[12]);
		form.AddField("PveMap",""+ params[13]);
		form.AddField("PveStory",""+ params[14]);
		form.AddField("HeroBasic",""+ params[15]);
		form.AddField("HeroCommon",""+ params[16]);
		form.AddField("HeroLevel",""+ params[17]);
		form.AddField("HeroRenownItem",""+ params[18]);
		form.AddField("HeroSkillFate",""+ params[19]);
		form.AddField("HeroSkillLevel",""+ params[20]);
		form.AddField("WorldMap",""+ params[21]);
		form.AddField("GearTierSkill",""+ params[22]);
        form.AddField("HeroLevelUpItems", "" + params[23]);
		form.AddField("worldId", Datas.instance().worldid() );

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static function	checkGDS_Building(params:Array, okFunc:Function, errorFunc:Function){
		var url:String = "gds.php";

		var form:WWWForm = new WWWForm();
		form.AddField("type",""+ params[0]);
		form.AddField("version",""+ params[1]);
		form.AddField("worldId", Datas.instance().worldid() );

		shortDownload(url, form, okFunc, errorFunc);
	}

	public	static function	checkGDS_Troop(params:Array, okFunc:Function, errorFunc:Function){
		var url:String = "gds.php";

		var form:WWWForm = new WWWForm();
		form.AddField("type",""+ params[0]);
		form.AddField("version",""+ params[1]);
		form.AddField("worldId", Datas.instance().worldid() );

		shortDownload(url, form, okFunc, errorFunc);
	}
	public	static function	checkGDS_Gear(params:Array, okFunc:Function, errorFunc:Function){
		var url:String = "gds.php";

		var form:WWWForm = new WWWForm();
		form.AddField("type",""+ params[0]);
		form.AddField("version",""+ params[1]);
		form.AddField("worldId", Datas.instance().worldid() );

		shortDownload(url, form, okFunc, errorFunc);
	}

	public	static	function	reqWarmStart(okFunc:Function, errorFunc:Function){
		var url:String = "warmStartTracking.php";
		shortRequest(url, null, okFunc, errorFunc);
	}

	public	static	function	loginSuccess(params:Array, okFunc:Function, errorFunc:Function){
		var url:String = "successLoginTracking.php";
		var form:WWWForm = new WWWForm();

		form.AddField("loginCount",""+params[0]);
		form.AddField("loadTime",""+params[1] );
		form.AddField("firstTimeUser",""+params[2]);
		form.AddField("wifi",""+params[3]);

		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();
		form.AddField("udid",deviceInfo.udid);
		form.AddField("openUDID",deviceInfo.OpenUDID);
		form.AddField("m_deviceIFA",deviceInfo.IFA);
		form.AddField("m_deviceIFV",deviceInfo.IFV);
		form.AddField("limit_ad",(deviceInfo.LimitAdTracking == "false"?"0":"1"));

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	sessionTime( params:Array, okFunc:Function, errorFunc:Function ){
		var url:String = "datameerTracking.php";
		var form:WWWForm = new WWWForm();

		form.AddField("dmType","gameLiveSession");
		form.AddField("liveTimes",""+params[0] );
		form.AddField("firstSession",""+params[1]);
		form.AddField("coldStart",""+params[2]);
		form.AddField("waitingTime",""+params[3]);

		shortRequest(url, form, okFunc, errorFunc);
	}
	//GameMain end

	//start Building
	public	static	function	reqInstantBuild(params:Array, okFunc:Function, errorFunc:Function){
		var	url:String = "construct.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0] );
		form.AddField("gems",""+params[1] );
		form.AddField("ilist",""+params[2] );
		form.AddField("lv", ""+params[3] );
		form.AddField("pos", ""+params[4] );
		form.AddField("type",""+params[5] );
		form.AddField("instant",1);
		if( params.length > 6 ){
			form.AddField("bid", ""+params[6] );
		}

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqBuild(params:Array, okFunc:Function, errorFunc:Function){
		var	url:String = "construct.php";

		var form:WWWForm = new WWWForm();
		form.AddField("cid", ""+params[0]);
		form.AddField("pos", ""+params[1]);
		form.AddField("lv",""+params[2]);
		form.AddField("type",""+params[3]);

		if( params.length > 4 ){
			form.AddField("bid", ""+params[4]);
		}

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqDelete(params:Array, okFunc:Function, errorFunc:Function){
		var	url:String = "destruct.php";

		var form:WWWForm = new WWWForm();
		form.AddField("cid", ""+params[0]);
		form.AddField("pos", ""+params[1]);
		form.AddField("lv",""+params[2]);
		form.AddField("type",""+params[3]);

		if( params.length > 4 ){
			form.AddField("bid",""+params[4]);
		}

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqCancelBuild(params:Array, okFunc:Function, errorFunc:Function){
		var	url:String = "cancelConstruction.php";

		var form:WWWForm = new WWWForm();
		form.AddField("requestType", ""+params[0]);
		form.AddField("cityId",""+params[1]);
		form.AddField("buildingPosition", ""+params[2]);
		form.AddField("buildingId",""+params[3]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqDestruct(params:Array, okFunc:Function, errorFunc:Function){
		var	url:String = "destroyBuilding.php";

		var form:WWWForm = new WWWForm();
		form.AddField("requestType", ""+params[0] );
		form.AddField("cityId",""+params[1]);
		form.AddField("buildingId",""+params[2]);
		form.AddField("pos",""+ params[3]);

		shortRequest(url, form, okFunc, errorFunc);
	}
	//end Building

	public	static	function	reqInstantResearch( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "research.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("lv", ""+params[1]);
		form.AddField("tid", ""+params[2]);
		form.AddField("gems",""+params[3]);
		form.AddField("ilist",""+params[4]);


		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqUpgradeResearch( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "research.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("lv", ""+params[1]);
		form.AddField("tid", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqCheckTechPopUp( params:Array, okFunc:Function, errorFunc:Function )
	{
		var	url:String = "checkPopUp.php";

		var form:WWWForm = new WWWForm();

		form.AddField("type",""+params[0]);
		form.AddField("cityId",""+params[1]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqUpgradeTechnology( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "technology.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("lv", ""+params[1]);
		form.AddField("tid", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqInstantTechnology( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "technology.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("lv", ""+params[1]);
		form.AddField("tid", ""+params[2]);
		form.AddField("gems",""+params[3]);
		form.AddField("ilist",""+params[4]);


		shortRequest(url, form, okFunc, errorFunc);
	}

//	public	static	function	reqMarketSpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "speedupTrade.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("mid",params[0]);
//		form.AddField("cid", params[1]);
//		form.AddField("iid", params[2]);
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

//	public	static	function	reqTrainingInstantSpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "speedupTraining.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("cid",params[0]);
//		form.AddField("iid", params[1]);
//		form.AddField("tid", params[2]);
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

	public	static	function	reqGemsInstantSpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "speedupUseGems.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("act", ""+params[1]);
		form.AddField("gems", ""+params[2]);
		form.AddField("ilist", ""+params[3]);

		if(params.length > 6)
		{
			form.AddField("mid",""+params[4]);
			form.AddField("directBuyflag", ""+params[5]);
			form.AddField("dollar", ""+params[6]);
		}
		else
		{
			form.AddField("directBuyflag", ""+params[4]);
			form.AddField("dollar", ""+params[5]);
		}
		shortRequest(url, form, okFunc, errorFunc);
	}

//	public	static	function	reqFortifyingInstantSpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "speedupFortifying.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("cid",params[0]);
//		form.AddField("iid", params[1]);
//		form.AddField("fid", params[2]);
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

	public	static	function	reqConstructionApplySpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "speedupConstruction.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("iid", ""+params[1]);
		form.AddField("bid", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqResearchApplySpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "speedupResearch.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("iid", ""+params[1]);
		form.AddField("tid", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqTechnologyApplySpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "speedupTechnology.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("iid", ""+params[1]);
		form.AddField("tid", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqTrainingApplySpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "speedupTraining.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("iid", ""+params[1]);
		form.AddField("tid", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqFortifyingApplySpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "speedupFortifying.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("iid", ""+params[1]);
		form.AddField("fid", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqScoutApplySpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "speedupScout.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("iid", ""+params[1]);

		shortRequest(url, form, okFunc, errorFunc);
	}

//	public	static	function	reqTempleApplySpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "speedupDevelopment.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("cid",params[0]);
//		form.AddField("iid", params[1]);
//		form.AddField("bid", params[2]);
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

	public	static	function	reqMarchApplySpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "speedupMarch.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("iid", ""+params[1]);
		form.AddField("mid", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqMarchApplyCollectSpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "speedupCollectMarch.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("iid", ""+params[1]);
		form.AddField("mid", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqMarchApplyCollectResourceSpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "speedupMineMarch.php";

		var form:WWWForm = new WWWForm();

		form.AddField("iid", ""+params[1]);
		form.AddField("cid",""+params[0]);
		form.AddField("mid", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqTileApplySpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "speedupTileFreeze.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("iid", ""+params[1]);
		form.AddField("mid", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqHeroApplySpeedUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "speedupSleepingHero.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid", ""+params[0]);
		form.AddField("iid", ""+params[1]);
		form.AddField("mid", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqDismissUnits( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "dismissUnits.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("type", ""+params[1]);
		form.AddField("quant", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}


	public	static	function	reqTrainUnit( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "train.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("type", ""+params[1]);
		form.AddField("quant", ""+params[2]);
		form.AddField("items", ""+params[3]);
		form.AddField("tid", ""+params[4]);


		shortRequest(url, form, okFunc, errorFunc);
	}

	//--------------------------------------------------------------------------------------//add by zhouwei
	public	static function reqSeniorGambleSetting(okFunc:Function, errorFunc:Function)
	{
		var url:String = "getMagicalBox.php";
		var form:WWWForm = new WWWForm();
		form.AddField("lang",Datas.instance().getGameLanguageAb());
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqEventDetail(okFunc:Function, errorFunc:Function):void
	{
		var url:String = "getRoundTowerEvents.php";
		var form:WWWForm = new WWWForm();

		/*
		var text:TextAsset = Resources.Load("Data/test");
		var content:String = text.text;
		var data:HashObject = (new JSONParse()).Parse(content);

		if(okFunc != null)
		{
			okFunc(data);
		}
		*/
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqArtifactDetail(okFunc:Function, errorFunc:Function):void
	{
		var url:String = "getRoundTowerEvents.php";
		var form:WWWForm = new WWWForm();

		form.AddField("type", "artifact");

		shortRequest(url, form, okFunc, errorFunc);
	}

//	public static function reqClaimEvent(eventId:int, okFunc:Function, errorFunc:Function):void
//	{
//		var	url:String = "claimEventReward.php";
//
//		var form:WWWForm = new WWWForm();
//		form.AddField("eventId", eventId);
//
//		/*
//		var data:HashObject = new HashObject({"ok":true});
//		if(okFunc != null)
//		{
//			okFunc(data);
//		}*/
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}
//
//	public static function reqClaimEvent(eventId:int, crestId:int, okFunc:Function, errorFunc:Function)
//	{
//		var	url:String = "claimEventReward.php";
//
//		var form:WWWForm = new WWWForm();
//		form.AddField("eventId", eventId);
//		form.AddField("crestId", crestId);
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

	public static function reqOpenTreasureChest(params:Array, okFunc:Function, errorFunc:Function):void
	{
		var url:String = "treasureChest.php";

		var form:WWWForm = new WWWForm();
		form.AddField("chestId", params[0] + "");
		form.AddField("itemId", params[1] + "");
		form.AddField("marchId", params[2] + "");
		form.AddField("cityId", params[3] + "");


		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqGetStakeDescription(params:Array, okFunc:Function, errorFunc:Function):void
	{
		var url:String = "treasureCrest.php";

		var form:WWWForm = new WWWForm();
		form.AddField("chestId", params[0] + "");
		form.AddField("itemId", params[1] + "");

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqGiveHelp(params:Array, okFunc:Function, errorFunc:Function):void
	{
		var	url:String = "allianceHelp.php";

		var form:WWWForm = new WWWForm();
		form.AddField("htype","giveHelp");
		form.AddField("inviterId",""+params[0]);
		form.AddField("cid",""+params[1]);
		form.AddField("dtype",""+params[2]);
		form.AddField("dstype",""+params[5]);
		form.AddField("did",""+params[3]);
		form.AddField("dlv",""+params[4]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqBlockUserList(okFunc:Function, errorFunc:Function)
	{
		var	url:String = "emailBlock.php";

		var form:WWWForm = new WWWForm();
		form.AddField("act","list");

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqIgnoreUserList(okFunc:Function, errorFunc:Function)
	{
		var	url:String = "ignore.php";

		var form:WWWForm = new WWWForm();
		form.AddField("act","list");

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqUnblockUser(params:Array, okFunc:Function, errorFunc:Function)
	{
		var	url:String = "emailBlock.php";

		var form:WWWForm = new WWWForm();
		form.AddField("act","delete");
		form.AddField("targetId", ""+params[0]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqIgnoreUser(params:Array, okFunc:Function, errorFunc:Function)
	{
		var	url:String = "ignore.php";

		var form:WWWForm = new WWWForm();

		form.AddField("ignoreId",""+params[0]);
		form.AddField("set", ""+params[1]);


		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqPopupMessage(params:Array, okFunc:Function, errorFunc:Function)
	{
		var	url:String = "broadcast.php";
		shortRequest(url, null, okFunc, errorFunc);
	}

//	public static function reqSilenceUser(params:Array, okFunc:Function, errorFunc:Function)
//	{
//		var	url:String = "silence.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("silenceId",params[0] );
//		form.AddField("reason", params[1] );
//		form.AddField("set", params[2] );
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

	public static function reqReportUser(params:Array, okFunc:Function, errorFunc:Function)
	{
		var	url:String = "reportUserComments.php";

		var form:WWWForm = new WWWForm();

		form.AddField("userId",""+params[0]);
		form.AddField("ctype", ""+params[1]);
		form.AddField("chatId", ""+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

//	public static function reqRenametUser(params:Array, okFunc:Function, errorFunc:Function)
//	{
//		var	url:String = "rename.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("renameId",params[0] );
//		form.AddField("newName", params[1] );
//		form.AddField("set", params[2] s);
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

	public static function reqChangeAvatar(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "changeportrait.php";

		var form:WWWForm = new WWWForm();

		form.AddField("type", 	params[0].ToString());
		form.AddField("kid", 	params[1].ToString());
		form.AddField("corder", params[2].ToString());

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqGetChat(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "getChat.php";

		var form:WWWForm = new WWWForm();

		form.AddField("ctype", ""+params[0]);
		form.AddField("ctypeId", ""+params[1]);
		form.AddField("curNewest1", ""+params[2]);
		form.AddField("curNewest2", ""+params[3]);
		form.AddField("curNewest3",""+ params[4]);
		form.AddField("curNewest5",""+ params[5]);
		form.AddField("sid", ""+params[6]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqAvaGetChat(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "avaChat.php";

		var form:WWWForm = new WWWForm();

		form.AddField("opt", "get");
		form.AddField("curNewest1", ""+params[0]);
		form.AddField("curNewest2", ""+params[1]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqSendChat(params:Array, okFunc:Function, errorFunc:Function)
	{
		reqSendChat(params,okFunc,errorFunc,"");
	}
	public static function reqSendChat(params:Array, okFunc:Function, errorFunc:Function,addition:String)
	{
		var url:String = "sendChat.php";

		var form:WWWForm = new WWWForm();

		form.AddField("ctype", params[0].ToString());
		form.AddField("additionalInfo", addition);
		form.AddField("lang", Datas.instance().GetLanguageAb());
		if(_Global.INT32(params[1]) == -3)
		{
			form.AddField("comment", params[2].ToString());
			form.AddField("ctypeId", params[3].ToString());
			form.AddField("nm", params[4].ToString());
			form.AddField("sid", params[5].ToString());
		}
		else
		{
			if(_Global.INT32(params[1]) == -5)
			{
				form.AddField("name", params[2].ToString());
			}
			else
			{
				form.AddField("recipient", params[1].ToString());
			}

			form.AddField("comment", params[3].ToString());
			form.AddField("ctypeId", params[4].ToString());
			form.AddField("nm", params[5].ToString());
			form.AddField("sid", params[6].ToString());

			if (params.length == 11) {
				form.AddField("answertype", params[7].ToString());
				form.AddField("requestName", params[8].ToString());
				form.AddField("difftime", params[9].ToString());
				if (_Global.INT32(params[7]) == Constant.AllianceRequestType.REINFORCE) {
					form.AddField("troopcount", params[10].ToString());
				} else if (_Global.INT32(params[7]) == Constant.AllianceRequestType.RESOURCE) {
					form.AddField("rescount", params[10].ToString());
				}
			}
		}

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqAvaSendChat(params:Array, okFunc:Function, errorFunc:Function,addition:String)
	{
		var url:String = "avaChat.php";

		var form:WWWForm = new WWWForm();

		form.AddField("opt", "send");
		form.AddField("chatType", params[0].ToString());
//		form.AddField("additionalInfo", addition);
//		form.AddField("lang", Datas.instance().GetLanguageAb());
		if(_Global.INT32(params[1]) == -3)
		{
			form.AddField("msg", params[2].ToString());
		}
		else
		{
			form.AddField("msg", params[3].ToString());
		}

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqGetMaintenanceChat(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "maintenanceChat.php";

		var form:WWWForm = new WWWForm();
		form.AddField("action", params[0].ToString());
		form.AddField("author", params[1].ToString());
		form.AddField("serverId", params[2].ToString());
		form.AddField("chatId", params[3].ToString());
		form.AddField("portraitname", params[4].ToString());
		form.AddField("badge", params[5].ToString());
		form.AddField("platformId",platformId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqSendMaintenanceChat(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "maintenanceChat.php";

		var form:WWWForm = new WWWForm();
		form.AddField("action", params[0].ToString());
		form.AddField("author", params[1].ToString());
		form.AddField("serverId", params[2].ToString());
		form.AddField("content", params[3].ToString());
		form.AddField("portraitname", params[4].ToString());
		form.AddField("badge", params[5].ToString());
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqGetConversationDatas(params:Hashtable, okFunc:Function, errorFunc:Function)
	{
		var url:String = "privatechat.php";

		var form:WWWForm = new WWWForm();
		for (var keyVal:System.Collections.DictionaryEntry in params)
		{
			form.AddField(keyVal.Key.ToString(), keyVal.Value.ToString());
		}

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqDeleteConversationDatas(params:Hashtable, okFunc:Function, errorFunc:Function)
	{
		var url:String = "privatechat.php";

		var form:WWWForm = new WWWForm();
		for (var keyVal:System.Collections.DictionaryEntry in params)
		{
			form.AddField(keyVal.Key.ToString(), keyVal.Value.ToString());
		}

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqGetOne2OneChat(params:Hashtable, okFunc:Function, errorFunc:Function)
	{
		var url:String = "privatechat.php";

		var form:WWWForm = new WWWForm();
		for (var keyVal:System.Collections.DictionaryEntry in params)
		{
			form.AddField(keyVal.Key.ToString(), keyVal.Value.ToString());
		}

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqSendOne2OneChat(params:Hashtable, okFunc:Function, errorFunc:Function)
	{
		var url:String = "privatechat.php";

		var form:WWWForm = new WWWForm();
		for (var keyVal:System.Collections.DictionaryEntry in params)
		{
			form.AddField(keyVal.Key.ToString(), keyVal.Value.ToString());
		}

		shortRequest(url, form, okFunc, errorFunc);
	}


	public static function reqQuestRewards( params:Array, okFunc:Function, errorFunc:Function )
	{
		var	url:String = "quest.php";
		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("rcid", ""+params[1]);
		form.AddField("qid", ""+params[2]);
		form.AddField("chrome", ""+params[3]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqChangeTaxModal( params:Array, okFunc:Function, errorFunc:Function )
	{
		var url:String = "changeTax.php";
		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("rate",""+params[1]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqraiseGoldModal(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "levyGold.php";
		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqCityActionAbandon(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "abandonCity.php";
		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("xCoord",""+params[1]);
		form.AddField("yCoord",""+params[2]);
		form.AddField("tid",""+params[3]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqIncreaseHappinessModal(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "coliseumEvent.php";
		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("eventid",""+params[1]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqCityWilds(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "getCityWilds.php";
		var form:WWWForm = new WWWForm();

		form.AddField("cid", ""+params[0]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqChariotRaceModal(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "coliseumEvent.php";
		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("eventid",""+params[1]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqSanctuaryChange(params:Array, okFunc:Function, errorFunc:Function)
	{
		var	url:String = "gate.php";
		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("state",""+params[1]);

		shortRequest(url, form, okFunc, errorFunc);
	}

//	public static function reqViewMarchReport(params:Array, okFunc:Function, errorFunc:Function)
//	{
//		var	url:String = "fetchReport.php";
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("rid",""+params[0]);
//		form.AddField("side",""+params[1]);
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

//	public static function reqShowMarchReportsList(params:Array, okFunc:Function, errorFunc:Function)
//	{
//		var url:String = "getReport.php";
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("pageNo",""+params[0]);
//		if(params.length > 1)
//		{
//			form.AddField("group",""+params[1]);
//		}
//		shortRequest(url, form, okFunc, errorFunc);
//	}

//	public static function reqShowCityReportsList(params:Array, okFunc:Function, errorFunc:Function)
//	{
//		var	url:String = "listDisasterReports.php";
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("pageNo",params[0]);
//		shortRequest(url, form, okFunc, errorFunc);
//	}

//	public static function reqViewDisasterReports(params:Array, okFunc:Function, errorFunc:Function)
//	{
//		var	url:String = "listDisasterReports.php";
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("pageNo",params[0]);
//		shortRequest(url, form, okFunc, errorFunc);
//	}

	//	remove by cwu @ 2014-01-15
	//public static function reqMarkCheckedReportsAsRead(params:Array, okFunc:Function, errorFunc:Function)
	//{
	//	var url:String = "readCheckedReports.php";
	//	var form:WWWForm = new WWWForm();

	//	form.AddField("s0rids",""+params[0]);
	//	form.AddField("s1rids",""+params[1]);
	//	shortRequest(url, form, okFunc, errorFunc);
	//}

	public static function reqDeleteCheckedReports(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "deleteCheckedReports.php";
		var form:WWWForm = new WWWForm();

		//form.AddField("requestType",params[0]);
		form.AddField("s0rids",""+params[0]);
		form.AddField("s1rids",""+params[1]);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqSend(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "sendeEmail.php";
		var form:WWWForm = new WWWForm();

		form.AddField("emailTo",""+params[0] );
		form.AddField("subject",""+params[1] );
		form.AddField("message",""+params[2] );
		form.AddField("requestType",""+params[3] );

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqNewShowList(params:Array, okFunc:Function, errorFunc:Function){
		var url:String = "getEmail.php";
		var form:WWWForm = new WWWForm();
		form.AddField("requestType",""+params[0] );
		form.AddField("boxType",""+params[1] );
		form.AddField("maxmailid",""+params[2]);
		form.AddField("minmailid",""+params[3]);
		shortRequest(url, form, okFunc, errorFunc);
	}


	public static function reqDeleteMessage(params:Array, okFunc:Function, errorFunc:Function)
	{
		var url:String = "getEmail.php";
		var form:WWWForm = new WWWForm();

		form.AddField("requestType","ACTION_ON_MESSAGES");
		form.AddField("selectedAction","delete");
		form.AddField("selectedMessageIds",""+params[0] );
		form.AddField("boxType",""+params[1] );

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function reqAction(params:Array, okFunc:Function, errorFunc:Function)
	{
		//var url:String = "getEmail.php";
		var url:String = "blockUser.php";

		var form:WWWForm = new WWWForm();

		form.AddField("requestType","ACTION_ON_MESSAGES");
		form.AddField("selectedAction",""+params[0] );
		form.AddField("selectedMessageIds",""+params[1] );
		form.AddField("boxType",""+params[2] );

//		_Global.Log(params[0]+" "+params[1]+" "+params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function ChangeUserSetting(SettingId:String, Value:String, okFunc:Function, errorFunc:Function) {
		var url:String = "changeUserSettings.php";
		var form:WWWForm = new WWWForm();

		form.AddField("settingid",""+SettingId);
		form.AddField("settingvalue",""+Value);

		shortRequest(url, form, okFunc, errorFunc);
	}
//
//	public static function (params:Array, okFunc:Function, errorFunc:Function)
//	{
//		var url:String = "";
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("pageNo",params[0]);
//		shortRequest(url, form, okFunc, errorFunc);
//	}
	//--------------------------------------------------------------------------------------//

	public	static	function	reqRemoveTraining( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "cancelTraining.php";

		var form:WWWForm = new WWWForm();


		form.AddField("requestType", ""+params[0]);
		form.AddField("cityId",""+params[1]);
		form.AddField("typetrn", ""+params[2]);
		form.AddField("numtrptrn", ""+params[3]);
		form.AddField("trnETA", ""+params[4] );
		form.AddField("trnTmp", ""+params[5] );
		form.AddField("trnNeeded", ""+params[6] );
		form.AddField("trainingId", ""+params[7]);


		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqClaimLevelUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "quest.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid", ""+params[0]);
		form.AddField("rcid", ""+params[1]);
		form.AddField("qid",""+params[2]);
//		form.AddField("cid2", params[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}


	public	static	function	reqTrainDefense( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "fortify.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0]);
		form.AddField("type", ""+params[1]);
		form.AddField("quant", ""+params[2]);
		form.AddField("items",""+ params[3]);
		form.AddField("fid",""+ params[4]);


		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqRemoveFortifications( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "cancelFortifications.php";

		var form:WWWForm = new WWWForm();

		form.AddField("requestType",""+params[0] );
		form.AddField("cityId", ""+params[1] );
		form.AddField("typefrt", ""+params[2] );
		form.AddField("numtrpfrt", ""+params[3] );
		form.AddField("frtETA", "" + params[4] );
		form.AddField("frtTmp", "" +params[5] );
		form.AddField("frtNeeded", ""+params[6] );
		form.AddField("frtid", ""+params[7] );


		shortRequest(url, form, okFunc, errorFunc);
	}

//	public	static	function	reqMuseumBuyItem( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "buyItem.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("iid",params[0] );
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

//	//AddCityNew
//	public	static	function	reqBuildNewCity( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "buildCity.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("cid",params[0] );
//		form.AddField("tid",params[1] );
//		form.AddField("cname",params[2] );
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}
//	//end AddCityNew

//	public	static	function	reqCompleteArtifactSet( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "completeArtifactSet.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("setid",params[0] );
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

//	public	static	function	reqCancelMarch( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "cancelMarch.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("marchId",params[0] );
//		form.AddField("requestType",params[1] );
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

	//start attack
	public	static	function	reqWildernessView( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "viewTile.php";

		var form:WWWForm = new WWWForm();

		form.AddField("tid",""+params[0] );

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqWildernessAbandon( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "abandonWilderness.php";

		var form:WWWForm = new WWWForm();

		form.AddField("tid",""+params[0] );
		form.AddField("x",""+params[1] );
		form.AddField("y",""+params[2] );
		form.AddField("cid",""+params[3] );

		shortRequest(url, form, okFunc, errorFunc);
	}

//	public	static	function	reqWildernessBuildCity( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "buildCity.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("tid",params[0]);
//		form.AddField("cid",params[1]);
//		form.AddField("cname",params[2]);
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}
	//end attack

	//getGCLeaderboard.php
	public	static	function	reqGameCenterLeaderBoardData(okFunc:Function, errorFunc:Function ){
		var	url:String = "getGCLeaderboard.php";
		var form:WWWForm = new WWWForm();
		shortRequest(url, form, okFunc, errorFunc);
	}

	//leader board
	public	static	function	reqLeaderboardInfo( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "getLeaderboard.php";
		var form:WWWForm = new WWWForm();

		form.AddField("action",""+params[0]);//1: browse
		form.AddField("page",""+params[1]);
		if(_Global.INT32(params[0]) != 1)
		{
			form.AddField("keyword",""+params[2]);
		}
		form.AddField("type",""+params[3]);
		form.AddField("date",""+params[4]);
		shortRequest(url, form, okFunc, errorFunc);
	}
	//bookmark
	public	static	function	reqSetBookmarkLocation( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "tileBookmark.php";

		var form:WWWForm = new WWWForm();

		form.AddField("requestType",""+params[0] );	//BOOKMARK_LOCATION
		form.AddField("tileId",""+params[1]);
		form.AddField("bookmarkName",""+params[2] );
		form.AddField("type",""+params[3]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqBookmarkInfo( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "tileBookmark.php";

		var form:WWWForm = new WWWForm();

		form.AddField("requestType",""+params[0] );	//GET_BOOKMARK_INFO

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqDelBookmark( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "tileBookmark.php";

		var form:WWWForm = new WWWForm();

		form.AddField("requestType",""+params[0] );
		form.AddField("bookmarkId",""+params[1] );

		shortRequest(url, form, okFunc, errorFunc);
	}
	//end bookmark

	//embassy
//	public	static	function	reqKickOutAllies( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "kickoutReinforcements.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("mid",params[0] );
//		form.AddField("cid",params[1] );
//		form.AddField("fromUid",params[2] );
//		form.AddField("fromCid",params[3] );
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}
	//end embassy

	//General
	public	static	function	reqGeneralExpBoost( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "experienceKnight.php";

		var form:WWWForm = new WWWForm();

		form.AddField("iid",""+params[0] );
		form.AddField("cid",""+params[1] );
		form.AddField("kid",""+params[2] );
		form.AddField("g",""+params[3] );

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqGeneralExpLevelUp( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "experienceKnightLevel.php";

		var form:WWWForm = new WWWForm();

		form.AddField("iid",""+params[0] );
		form.AddField("cid",""+params[1] );
		form.AddField("kid",""+params[2] );
		form.AddField("g",""+params[3] );

		shortRequest(url, form, okFunc, errorFunc);
	}

//	public	static	function	reqGeneralSeek( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "seekknight.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("pid",params[0] );
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

//	public	static	function	reqGeneralAppoint( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "hireknight.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("cid",params[0] );
//		form.AddField("friendpfid",params[1] );
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

//	public	static	function	reqGeneralDismiss( params:Array, okFunc:Function, errorFunc:Function ){
//		var	url:String = "fireKnight.php";
//
//		var form:WWWForm = new WWWForm();
//
//		form.AddField("cid",params[0] );
//		form.AddField("kid",params[1] );
//
//		shortRequest(url, form, okFunc, errorFunc);
//	}

	public	static	function	reqGeneralAssignJob( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "assignknight.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0] );
		form.AddField("kid",""+params[1] );
		form.AddField("pos",""+params[2] );

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqUnassignKnight( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "unassignKnight.php";

		var form:WWWForm = new WWWForm();

		form.AddField("kid",""+params[0] );
		form.AddField("cid",""+params[1] );

		shortRequest(url, form, okFunc, errorFunc);
	}
	//end General

	//FortunasGamble
	public	static	function	reqChooseMmbCard( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "magicalboxPick.php";

		var form:WWWForm = new WWWForm();
		form.AddField("advanced",""+params[0]);
		form.AddField("isNinePlay",""+params[1]);
		form.AddField("advancedGambleAmount",""+params[2]);
//		form.AddField("cid",params[1] );
//		form.AddField("fromUid",params[2] );
//		form.AddField("fromCid",params[3] );

		shortRequest(url, form, okFunc, errorFunc);
	}

	//March
	public	static	function	reqExecuteMarch( reqVAR:Object, okFunc:Function, errorFunc:Function ){
		var	url:String = "march.php";

		var form:WWWForm = new WWWForm();
		/**
		form.AddField("cid",params[0] );
		form.AddField("type",params[1] );
		form.AddField("kid",params[2] );
		form.AddField("xcoord",params[3] );
		form.AddField("ycoord",params[4] );
		form.AddField("mid",params[5] );
		**/
		var heroIdString : String = "";
		for(var i:System.Collections.DictionaryEntry in reqVAR)
		{
            if ((i.Key as String).Substring(0, 1) == "h")
		    {
                heroIdString += (i.Key as String).Substring(1) + ",";
		    }
	        else
	        {
                form.AddField(i.Key as String,i.Value as String);
            }
		}
	    form.AddField("userHeroIds", heroIdString);
		shortRequest(url, form, okFunc, errorFunc);
	}

	//end March

	//Watchtower
	public	static	function	reqUseHide( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "antiscouting.php";

		var form:WWWForm = new WWWForm();
		var cid:int = params[0];
		form.AddField("cid",cid );

		shortRequest(url, form, okFunc, errorFunc);
	}
	//end Watchtower

	//scout
	public	static	function	reqScout( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "scouting.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0] );
		form.AddField("txcoord",""+params[1] );
		form.AddField("tycoord",""+params[2] );
		form.AddField("instant",""+params[3] );
		form.AddField("useitem",""+params[4] );
		form.AddField("gems",""+params[5] );
		form.AddField("ilist",""+params[6] );

		shortRequest(url, form, okFunc, errorFunc);
	}
	//end scout

	//RallyPoint

	public	static	function	reqUndefend( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "undefend.php";

		var form:WWWForm = new WWWForm();

		form.AddField("cid",""+params[0] );
		form.AddField("mid",""+params[1] );

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqSurvey( reqVAR:Object, okFunc:Function, errorFunc:Function ){
		var	url:String = "survey.php";

		var form:WWWForm = new WWWForm();

		for(var i:System.Collections.DictionaryEntry in reqVAR)
		{
			form.AddField(i.Key as String,i.Value as String);
		}

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqOpenSurveyReward( reqVAR:Object, okFunc:Function, errorFunc:Function ){
		var	url:String = "treasureChest.php";

		var form:WWWForm = new WWWForm();

		for(var i:System.Collections.DictionaryEntry in reqVAR)
		{
			form.AddField(i.Key as String,i.Value as String);
		}

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqCancelSurvey( reqVAR:Object, okFunc:Function, errorFunc:Function ){
		var	url:String = "cancelsurvey.php";

		var form:WWWForm = new WWWForm();

		for(var i:System.Collections.DictionaryEntry in reqVAR)
		{
			form.AddField(i.Key as String,i.Value as String);
		}

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqFetchMarch( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "fetchMarch.php";

		var form:WWWForm = new WWWForm();

		form.AddField("rid",""+params[0] );

		shortRequest(url, form, okFunc, errorFunc);
	}

	//end RallyPoint

	public static function fetchMapTilesForPlayer(params:Array,okFunc:Function,errorFunc:Function){
		var url:String = "fetchMapTilesForPlayer.php";
		var form:WWWForm = new WWWForm();
		form.AddField("blocks",""+params[0]);
		form.AddField("changed",""+params[1]);
		shortRequest(url,form,okFunc,errorFunc);
	}

	//start payment
	public	static	function	reqPaymentList( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "payments.php";
		var form:WWWForm = new WWWForm();
//		form.AddField("tvuid",params[0]);
		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();
		form.AddField("udid",deviceInfo.udid);
		form.AddField("m_deviceIFA",deviceInfo.IFA);
		form.AddField("m_deviceIFV",deviceInfo.IFV);
		form.AddField("limit_ad",(deviceInfo.LimitAdTracking == "false"?"0":"1"));
		form.AddField("openUDID",deviceInfo.OpenUDID);
		form.AddField("type","payouts");	//HARD CODE.
		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	reqAmazonOrderList( params:Array, okFunc:Function, errorFunc:Function ){
		var	url:String = "payments.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type","orders");	//HARD CODE.
		shortRequest(url, form, okFunc, errorFunc);
	}
	//end payment

	public	static function GetInventoryList(okFunc:Function, errorFunc:Function)
	{
		var url:String = "showShop.php";
		var form:WWWForm = new WWWForm();
		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static function GetInventoryList(okFunc:Function, errorFunc:Function,forceNoConnectMenu:boolean)
	{
		var url:String = "showShop.php";
		var form:WWWForm = new WWWForm();
		shortRequest(url, form, okFunc, errorFunc,forceNoConnectMenu);
	}

	static function BuyInventory(id:int, buyCnt:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "buyItemBatch.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", id);
		form.AddField("buyitemamount", buyCnt);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function UpdateSeed(forceUpdate:boolean,okFunc:Function, errorFunc:Function)
	{
		var url:String = "updateSeed.php";
		var language:String = Datas.instance().getGameLanguageAb();
		var form:WWWForm = new WWWForm();
		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();
		form.AddField("udid",deviceInfo.udid);
		form.AddField("m_deviceIFA",deviceInfo.IFA);
		form.AddField("m_deviceIFV",deviceInfo.IFV);
		form.AddField("limit_ad",(deviceInfo.LimitAdTracking == "false"?"0":"1"));
		form.AddField("openUDID",deviceInfo.OpenUDID);
		form.AddField("forceUpdate", forceUpdate?1:0);
		if(Message.getInstance().MessageStatistics != null)
		{
			form.AddField("maxInboxId", Message.getInstance().MessageStatistics.InboxMaxId);
		    form.AddField("maxReportId",Message.getInstance().MessageStatistics.ReportMaxId);
		    form.AddField("maxAVAReportId",Message.getInstance().MessageStatistics.AvaReportMaxId);
		    form.AddField("maxSendId", Message.getInstance().MessageStatistics.OutboxMaxId);
		}
		else
		{
			form.AddField("maxInboxId", 0);
		    form.AddField("maxReportId",0);
		    form.AddField("maxAVAReportId",0);
		    form.AddField("maxSendId", 0);
		}

	    form.AddField("lang", language);
	    // form.AddField("xxx", null);
		shortRequest(url, form, okFunc, errorFunc);

	}

	static function UseResourceItem(itemId:int, itemCnt : int, cityId:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "resourceCrate.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cityId);
		form.AddField("cnt", itemCnt);
		form.AddField("userid", GameMain.instance().getUserId());
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function UseTroopItem(itemId:int, cityId:int, itemCnt : int, okFunc:Function, errorFunc:Function)
	{
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cityId);

		var url : String = null;
		if ( itemCnt == 1 )
		{
			url = "addTroops.php";
		}
		else
		{
			url = "addTroopsBatchItem.php";
			form.AddField("itemcount", itemCnt);
		}
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function UseVipItem(itemId:int, cityId:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "useVipItem.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cityId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function BoostProduction(itemId:int, cityId:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "boostProduction.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cityId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function BoostCombat(itemId:int, cityId:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "boostCombat.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cityId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function BoostCollectCarmot(itemId:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "boostCollectCarmot.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function Volunteer(itemId:int, cityId:int,okFunc:Function, errorFunc:Function)
	{
		var url:String = "volunteee.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cityId);
		shortRequest(url, form, okFunc, errorFunc);
	}
	static function FertilizePeople(itemId:int,cityId:int,okFunc:Function, errorFunc:Function)
	{
		var url:String = "fertilizePeople.php";
		var form:WWWForm = new WWWForm();
		form.AddField("itemid", itemId);
		form.AddField("cid", cityId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function UseItem2AddGems(itemId:int,cityId:int,okFunc:Function, errorFunc:Function)
	{
		var url:String = "depositGems.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cityId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function Hypnotize(cityId:int,okFunc:Function, errorFunc:Function)
	{
		var url:String = "hypnotize.php";
		var form:WWWForm = new WWWForm();
		form.AddField("cid", cityId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function UseSRMap(itemId:int,okFunc:Function, errorFunc:Function)
	{
		var url:String = "useSRMap.php";
		var form:WWWForm = new WWWForm();
		form.AddField("itemId", itemId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function UseRandomChest(itemId:int, cityId:int,okFunc:Function, errorFunc:Function)
	{
		var url:String = "medals.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cityId);
		form.AddField("requestType", "DRAW_ITEM");
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function UseItemChest(itemId:int,itemCnt:int,okFunc:Function, errorFunc:Function)
	{
		var url:String = "itemChest.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("boxnum", itemCnt);
		form.AddField("userid", GameMain.instance().getUserId());
		shortRequest(url, form, okFunc, errorFunc);
	}
	static function UseItemChest(itemId:int,okFunc:Function, errorFunc:Function)
	{
		var url:String = "itemChest.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("userid", GameMain.instance().getUserId());
		shortRequest(url, form, okFunc, errorFunc);
	}
	static function UsePeaceDove( itemId:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "doveOut.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function ChangeName(itemId:int, cityId:int, newName:String, okFunc:Function, errorFunc:Function)
	{
		var url:String = "changename.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cityId);
		form.AddField("displayname", newName);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function GetWorldsInfo( okFunc:Function, errorFunc:Function)
	{
		var url:String = "myServers.php";
		var form:WWWForm = new WWWForm();
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function GetNewWorld(okFunc:Function, errorFunc:Function)
	{
		var url:String = "worlds.php";

		var form:WWWForm = new WWWForm();
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function Relocate(itemId:int, cid:int, xcoord:int, ycoord:int,okFunc:Function, errorFunc:Function)
	{
		var url:String = "relocate.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cid);
		form.AddField("xcoord", xcoord);
		form.AddField("ycoord", ycoord);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function RadomRelocate(itemId:int, cid:int, pid:int ,okFunc:Function, errorFunc:Function)
	{
		var url:String = "relocate.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cid);
		form.AddField("pid", pid);
		shortRequest(url, form, okFunc, errorFunc);
	}

	static function RnameCity(itemId:int, cid:int, cityname:String ,okFunc:Function, errorFunc:Function)
	{
		var url:String = "changeCityName.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cid);
		form.AddField("cityname", cityname);
		shortRequest(url, form, okFunc, errorFunc);
	}

	/*get alliance info by alliance Id-------- */
	public static function GetAllianceInfo(allianceId:int,okFunc:Function,errorFunc:Function,noConnectMenu:boolean)
	{
		var url:String = "getAllianceInfo.php";
		var form: WWWForm = new WWWForm();
		form.AddField("allianceId",allianceId);
		shortRequest(url, form, okFunc, errorFunc,noConnectMenu);
	}

	public static function UpdateAllianceDes(allianceId:int, descType : int, des:String,okFunc:Function)
	{
		var url:String = "changeAllianceDescription.php";
		var form: WWWForm = new WWWForm();
		form.AddField("allianceId",allianceId);
		form.AddField("description",des);
		form.AddField("strtype", descType);
		shortRequest(url, form, okFunc, null);
	}

	public static function  Register(email:String, password:String, okFunc:Function, errorFunc:Function)
	{
		var url:String = selectedServerURL + "kabamId.php";


		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();

		var form:WWWForm = new WWWForm();
		form.AddField("act", "signup");
		form.AddField("email", email);
		form.AddField("password", password);

		form.AddField("m_iso", deviceInfo.osName);
		form.AddField("m_osVer",deviceInfo.osVersion);
		form.AddField("m_manufacturer", deviceInfo.manufactor);
		form.AddField("m_model", deviceInfo.model);
		form.AddField("m_language", deviceInfo.systemLanguage);//Application.systemLanguage.ToString());
		if(Application.platform == RuntimePlatform.Android)
			form.AddField("adid",deviceInfo.ADID); //adid
		baseRequest( url, form, okFunc, errorFunc);
	}

	public static function  Login(email:String, password:String, okFunc:Function, errorFunc:Function)
	{
		var url:String = selectedServerURL + "kabamId.php";


		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();
		_Global.Log("UnityNet.Login  udid : " + deviceInfo.udid + " osName : " + deviceInfo.osName + " osVersion : " + deviceInfo.osVersion +
		" manufactor : " + deviceInfo.manufactor + " model : " + deviceInfo.model + " systemLanguage : " + deviceInfo.systemLanguage +
		" ADID : " + deviceInfo.ADID + " email : " + email + " password " + password);
		var form:WWWForm = new WWWForm();
		form.AddField("act", "login");
		form.AddField("email", email);
		form.AddField("password", password);
		form.AddField("udid", deviceInfo.udid);
		form.AddField("m_iso", deviceInfo.osName);
		form.AddField("m_osVer",deviceInfo.osVersion);
		form.AddField("m_manufacturer", deviceInfo.manufactor);
		form.AddField("m_model", deviceInfo.model);
		form.AddField("m_language", deviceInfo.systemLanguage);//Application.systemLanguage.ToString());
		if(Application.platform == RuntimePlatform.Android)
			form.AddField("adid",deviceInfo.ADID); //adid
		baseRequest( url, form, okFunc, errorFunc );
//		shortRequest(url, form, okFunc, errorFunc);
	}
	public static function  ResetPassword(email:String, okFunc:Function, errorFunc:Function)
	{
		var url:String = selectedServerURL + "kabamId.php";

		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();

		var form:WWWForm = new WWWForm();
		form.AddField("act", "resetpwd");
		form.AddField("email", email);
		form.AddField("udid", deviceInfo.udid);
		form.AddField("m_iso", deviceInfo.osName);
		form.AddField("m_osVer",deviceInfo.osVersion);
		form.AddField("m_manufacturer", deviceInfo.manufactor);
		form.AddField("m_model", deviceInfo.model);
		form.AddField("m_language", deviceInfo.systemLanguage);//Application.systemLanguage.ToString());
		if(Application.platform == RuntimePlatform.Android)
			form.AddField("adid",deviceInfo.ADID); //adid
		baseRequest( url, form, okFunc, errorFunc );
//		shortRequest(url, form, okFunc, errorFunc);
	}
//	public static function  VerifyId(kabamId:int, naid:int, token:String, okFunc:Function, errorFunc:Function)
//	{
//		var url:String;
//		url = selectedServerURL + "kabamIdVerify.php";
//
//		var form:WWWForm = new WWWForm();
////		form.AddField("kabam_id", kabamId);
////		form.AddField("naid", naid);
////		form.AddField("access_token", token);
//		baseRequest(url, form, okFunc, errorFunc);
//	}

	public static function GetHelp(type:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "help.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", type);

		var	devInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();
		form.AddField("device", devInfo.model);
		form.AddField("os", devInfo.osName + "-" + devInfo.osVersion);
		form.AddField("wifi", Application.internetReachability == NetworkReachability.ReachableViaCarrierDataNetwork ? 1: 0);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function SendDirectPaymentBI(pos:int, subtype:int, params:Array):void
	{
		var url:String = "tracking.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", Constant.BIType.DIRECTPAYMENT);
		form.AddField("pos", "" + pos);
		if(subtype != -1)
			form.AddField("subType", "" + subtype);
		if(params != null && params.length == 4)
		{
			form.AddField("oldGems", "" + params[0]);
			form.AddField("spendGems", "" + params[1]);
			form.AddField("spendDollars", "" + params[2]);
			form.AddField("directbuyflag", "" + params[3]);
		}

		shortRequest(url, form, null, null);
	}

	public static function SendPaymentBI(pos:int):void
	{
		var url:String = "tracking.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", Constant.BIType.PAYMENT);
		form.AddField("pos", pos);
		shortRequest(url, form, null, null);
	}

	public static function SendPreLoadBI(type:int, firstTimeUser:int, step:int,slice:int):void
	{
		var url:String = selectedServerURL + "preLoading.php";


		var form:WWWForm = new WWWForm();
		form.AddField("type", type);
		form.AddField("firstTimeUser", firstTimeUser);
		form.AddField("step", step);
		form.AddField("slice", slice);
		baseRequest(url, form, null, null);

	}
	public static function SendPushBI(bi:String,enterType:int):void
	{
		var url:String = "tracking.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", Constant.BIType.PUSH);
		form.AddField("mainClass", enterType);
		form.AddField("subClass", bi);
		shortRequest(url, form, null, null);
	}

	private static function SendTypedBIInternal(biType:int,bi:int,enterType:int):void
	{
		var url:String = "tracking.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", biType);
		form.AddField("mainClass", enterType);
		form.AddField("subClass", bi);
		shortRequest(url, form, null, null);
	}

	public static function SendQuestBalloonStatusBI(status:int):void
	{
		var url:String = "tracking.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", Constant.BIType.QUEST_BALLOON_STATUS);
		form.AddField("status", status + "");
		shortRequest(url, form, null, null);
	}

	public static function SendQuestCompleteBI(questId:int):void
	{
		var url:String = "tracking.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", Constant.BIType.QUEST_COMPLETE);
		form.AddField("questid", questId + "");
		shortRequest(url, form, null, null);
	}

	public static function SendRaterBI(action:String,id:String,place:String):void
	{
		var url:String = "tracking.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", Constant.BIType.RATERBI);
		form.AddField("action", action);
		form.AddField("id", id);
		form.AddField("place",place);
		shortRequest(url, form, null, null);
	}
	public static function SendRaterOpenBI(id:String,place:String):void
	{
		var url:String = "tracking.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", Constant.BIType.RATEROPENBI);
		form.AddField("id", id);
		form.AddField("place",place);
		shortRequest(url, form, null, null);
	}

    public static function SendLoadingTimeBI(
            startMode : KBN.LoadingTimeTracker.StartMode,
            fullTime : float,
            afterConnectTime : float,
            interrupted : boolean,
            hasPaused : boolean) : void
    {
        var url : String = "tracking.php";
        var form : WWWForm = new WWWForm();
        form.AddField("type", Constant.BIType.LOADING_TIME);
        var subType : int = (startMode == KBN.LoadingTimeTracker.StartMode.FirstStart ?
                Constant.BIType.LoadingTimeSubType.FIRST_START :
                Constant.BIType.LoadingTimeSubType.RESTART);
        form.AddField("subType", subType);

        var deviceInfo : Datas.DeviceInfo = Datas.instance().getDeviceInfo();
        form.AddField("device", deviceInfo.model);
        form.AddField("manufactor", deviceInfo.manufactor);
        form.AddField("firstTimeLoading",KBN.FTEMgr.getInstance()!=null && KBN.FTEMgr.getInstance().isCurrentCompleteFTE() ? 0 : 1);
        form.AddField("osName", deviceInfo.osName);
        form.AddField("osVersion", deviceInfo.osVersion);
        form.AddField("interrupted", interrupted ? "1" : "0");
        form.AddField("paused", hasPaused ? "1" : "0");
        form.AddField("fullTime", fullTime.ToString(".0"));
        form.AddField("afterConnectTime", afterConnectTime.ToString(".0"));
        shortRequest(url, form, null, null);
    }

	public static function SendKabamBI(position:int, subPosition:int)
	{
		SendTypedBIInternal(Constant.BIType.KABAMBI,subPosition,position);
	}
	public static function SendNoticeBI(bi:int):void
	{
		var enterType:int = 1;
		SendTypedBIInternal(Constant.BIType.NOTICE,bi,enterType);
	}

	public	static	function GetUserInfo(userId:int,okFunc:Function, errorFunc:Function,noConnectMenu:boolean)
	{

		var url:String = "getUserGeneralInfo.php";

		var form:WWWForm = new WWWForm();

		form.AddField("uid", userId);
		shortRequest(url, form, okFunc, errorFunc,noConnectMenu);
	}
	public	static	function GetUserInformation(userId:int,okFunc:Function, errorFunc:Function,noConnectMenu:boolean)
	{

		var url:String = "getUserInformation.php";

		var form:WWWForm = new WWWForm();

		form.AddField("uid", userId);
		shortRequest(url, form, okFunc, errorFunc,noConnectMenu);
	}
	public static function GetIgnoredUsers(okFunc,errorFunc)
	{
		var url:String = "getUserIgnore.php";

		var form:WWWForm = new WWWForm();
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function SendPushToKen(okFunc:Function,errorFunc:Function):void
	{
		var url = "pushNotification.php";
		var form:WWWForm = new WWWForm();
		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();
		var token:String = PlayerPrefs.GetString(Constant.NativeDefine.KMP_DEVICE_TOKEN);
		var type:int;
		if(Application.platform == RuntimePlatform.Android)
		{
			token = NativeCaller.GetGCMRegistrationId();
			type = 15;
		}
		else if(Application.platform == RuntimePlatform.IPhonePlayer)
		{
			token = PlayerPrefs.GetString(Constant.NativeDefine.KMP_DEVICE_TOKEN);
			PlayerPrefs.DeleteKey(Constant.NativeDefine.KMP_DEVICE_TOKEN);
			type = 1;
		}

		//var type:int = PlayerPrefs.GetInt(Constant.NativeDefine.KMP_PUSH_NOTIFICATION,1);
		form.AddField("token",token);
		form.AddField("global_set",type);

		form.AddField("m_deviceIFA",deviceInfo.IFA);
		form.AddField("m_deviceIFV",deviceInfo.IFV);
		Datas.instance().updateLimitedTracking();
		var LimitAdTracking:String = PlayerPrefs.GetString(Constant.NativeDefine.KMP_PUSH_LIMITADTRACKING,"false");
		form.AddField("limit_ad",(LimitAdTracking == "false"?"0":"1"));

		shortRequest(url, form, okFunc, errorFunc);
		_Global.Log("UnityNet.SendPushToKen   token : " + token + " global_set : " + type);
	}

	public static function UpdateContentPushSetting(city_set:int,march_set:int,mail_set:int,okFunc:Function,errorFunc:Function):void
	{

		var url = "pushNotification.php";
		var form:WWWForm = new WWWForm();
		var type:int = PlayerPrefs.GetInt(Constant.NativeDefine.KMP_PUSH_NOTIFICATION,0);
		//form.AddField("global_set",type);
		//form.AddField("global_set",1);

		form.AddField("city_set",city_set);
		form.AddField("march_set",march_set);
		form.AddField("mail_set",mail_set);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function BuildCity(cityId:int, tid:int, cityName:String, cityType:int, okFunc:Function,errorFunc:Function)
	{
		var url = "buildCity.php";
		var form:WWWForm = new WWWForm();
		var type:int = PlayerPrefs.GetInt(Constant.NativeDefine.KMP_PUSH_NOTIFICATION,0);
		form.AddField("cid",cityId);
		form.AddField("tid",tid);
		form.AddField("cname",cityName);
		form.AddField("cityType",cityType);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function ReqMystryChestConfig(okFunc:Function,errorFunc:Function)
	{
		var url:String = "getMysteryChestList.php";
		var language:String = Datas.instance().getGameLanguageAb();
		var form:WWWForm = new WWWForm();
		form.AddField("lang",language);
		form.AddField("version",PlayerPrefs.GetString("MystryChestData_version_"+KBN.Datas.singleton.worldid(),"0"));
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function ClaimArtifact(artifactId:int,okFunc:Function,errorFunc:Function):void
	{
		var url = "claimEventReward.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", "artifact");
		form.AddField("eventId",artifactId);
		shortRequest(url, form, okFunc, errorFunc);
	}


	public static function GooglePlayBuyProduct(signedData:String,signature:String,trkid:String,payoutid:String,okFunc:Function,errorFunc:Function):void
	{
		var	url:String = "payments.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type","verifyresponse");	//HARD CODE as before.
		form.AddField("response-data",signedData);
		form.AddField("response-signature",signature);
		form.AddField("externalTrkid",trkid);
		form.AddField("payoutid",payoutid);
		var pe:Payment.PaymentElement =Payment.instance().GetOrderInfo(_Global.INT32(payoutid));
		if(pe!=null){
			var sCents : String;
			if(Application.platform == RuntimePlatform.Android)
			{
				var dCents:double = NativeCaller.GetCents(payoutid);
				dCents *= 100f;
				sCents = dCents.ToString();
			}
			else
			{
				var paymentCents : float = _Global.FLOAT(pe.cents);
				paymentCents *= 100f;
				sCents = paymentCents.ToString();
			}
			form.AddField("cents",sCents);
			form.AddField("currency",pe.currencyCode);

			_Global.Log("payment cents : " + paymentCents + "");
			_Global.Log("payment currency : " + pe.currencyCode + "");
		}
		else
		{
			_Global.Log("UnityNet GooglePlayBuyProduct : No payment in paymentlists  : " + payoutid);
		}

		if(Payment.instance().IsBuyOffer())
 		{
 			var offerId : int = Payment.instance().GetPaymentOfferID();
			form.AddField("offerId",offerId);
		}
		else
		{
			form.AddField("offerId",-2);
 		}

		_Global.Log("payment trkid : " + trkid + "");
		_Global.Log("payment payoutid : " + payoutid + "");

		shortRequest(url, form, okFunc, errorFunc);
	}

	public	static	function	AmazonVerifyProduct(form:WWWForm,
										okFunc:Function,errorFunc:Function):void{
		var	url:String = "payments.php";
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function SlotRequest(eventid:String,okFunc:Function,errorFunc:Function):void
	{
		var	url:String = "eventcenter.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type","slot");	//HARD CODE as before.
		form.AddField("eventId",eventid);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function SpendNGetDetailInfo(webData: String[], okFunc: Function, errorFunc: Function) {
		var url: String = "eventcenter.php";
		var form: WWWForm = new WWWForm();
		form.AddField("type", webData[0]);
		form.AddField("lang", webData[1]);
		form.AddField("eventId", webData[2]);

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function AllianceResourceRequest(cityid:int,res:long[],okFunc:Function)
	{
		var	url:String = "allianceRequest.php";
		var form:WWWForm = new WWWForm();
		form.AddField("action","sent");
		form.AddField("fromCityId",cityid);
		form.AddField("requestType","1");
		form.AddField("gold",res[0]);
		for(var i:int = 1;i<res.length;i++)
		{
			form.AddField("r" + i,res[i]);
		}

		shortRequest(url, form, okFunc, null);
	}
	public static function AllianceReinforceRequest(cityid:int,okFunc:Function)
	{
		var	url:String = "allianceRequest.php";
		var form:WWWForm = new WWWForm();
		form.AddField("action","sent");
		form.AddField("fromCityId",cityid);
		form.AddField("requestType","0");
		/*
		form.AddField("gold",res[0]);
		for(var i:int = 1;i<res.length;i++)
		{
			form.AddField("r" + i,res[i]);
		}
		*/
		shortRequest(url, form, okFunc, null);
	}
	public static function AllianceWorldMapSpeedUpRequest(cityID:int, marchID:int, okFunc:Function)//by Caisen 2014.8.18
	{
		var	url:String = "allianceRequest.php";
		var form:WWWForm = new WWWForm();
		form.AddField("action","sent");
		form.AddField("requestType","2");
		form.AddField("fromCityId",cityID);
		form.AddField("marchId",marchID);
		shortRequest(url, form, okFunc, null);
	}

	public static  function KnightGearSave(knight:Knight,okFunc:Function,errFunc:Function)
	{
		var url:String = "knightGearSave.php";
	    var form:WWWForm = new WWWForm();
	    if(knight == null) return;

	    form.AddField("knight",knight.KnightID);
	    for(var i:int = 0; i < knight.Arms.length;i++)
	    {
	    	if( knight.Arms[i] == null )
	    		form.AddField("p" + (i+1),"0");
	    	else
	    		form.AddField("p" + (i+1),knight.Arms[i].PlayerID);
	    }
	    shortRequest(url, form, okFunc, errFunc);
	}

	public static function knightGearList(okFunc:Function)
	{
		var url:String = "knightGears.php";
	    var form:WWWForm = new WWWForm();

		shortRequest(url, form, okFunc, null);
	}

	//
	private static function shortRequestByHashtable(url:String, params:Hashtable, okFunc:Function, errorFunc:Function)
	{
		var form:WWWForm = new WWWForm();
		for (var keyVal:System.Collections.DictionaryEntry in params)
		{
			form.AddField(keyVal.Key.ToString(), keyVal.Value.ToString());
		}

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function ReqGearLockEquip(params:Hashtable, okFunc:Function, errorFunc:Function)
	{
		var url:String = "knightGearLock.php";
		shortRequestByHashtable(url, params, okFunc, errorFunc);
	}

	//before v16.1.1,use it
//	public static function ReqGearStrengthen(params:Hashtable, okFunc:Function, errorFunc:Function)
//	{
//		var url:String = "knightGearLevelup.php";
//		shortRequestByHashtable(url, params, okFunc, errorFunc);
//	}

	public static function ReqGearStrengthen(params:Hashtable, okFunc:Function, errorFunc:Function)
	{
		var url:String = "gearStrengthen.php";
		shortRequestByHashtable(url, params, okFunc, errorFunc);
	}

	public static function knightGearUnlockSkill(uniqId:int,ids:int[],okFunc:Function,errorFunc:Function)
	{
		if(ids == null) return;
		if(ids.length <= 0) return;

		var url:String = "knightGearUnlockSkill.php";
	    var form:WWWForm = new WWWForm();

	    var s:String = ids[0].ToString();
	    for(var i:int = 1;i<ids.length;i++)
	    {
	    	s += ",";
	    	s += ids[i].ToString();
	    }

		form.AddField("uniqId", uniqId.ToString());
		form.AddField("uniqIdList", s);
		shortRequest(url, form, okFunc, errorFunc);

	}

	public static function knightGearMount(uniqId:int,stones:int[],okFunc:Function, errorFunc:Function)
	{
		if(stones == null) return;
		if(stones.length <= 0 ) return;
		var url:String = "knightGearMount.php";
	    var form:WWWForm = new WWWForm();
		form.AddField("uniqId", uniqId.ToString());
		for(var i:int = 0; i < stones.length;i++)
		{
			if(GearManager.Instance().IsStoneIDLegal(stones[i]))
			{
				form.AddField("slot_" + i, stones[i].ToString());
			}
		}
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function ReqNewFteData(params:Hashtable, okFunc:Function, errorFunc:Function)
	{
		var url:String = "knightGearFte.php";
		shortRequestByHashtable(url, params, okFunc, errorFunc);
	}

	public static function WheelGamesGetDetailInfo(wheelid : int, okFunc : Function, errFunc : Function)
	{
		var url:String = "wheelGameInfo.php";
		var form : WWWForm = new WWWForm();
		form.AddField("wheelid", wheelid);
		shortRequest(url, form, okFunc, errFunc);
	}

	public static function WheelGameBeginRoll(wheelid : int, isGems : boolean, cost : int, okFunc : Function, errFunc : Function)
	{
		var url : String = "wheelGameStart.php";
		var form : WWWForm = new WWWForm();
		form.AddField("wheelid", wheelid);
		form.AddField("wheeltype", isGems?1:2);
		form.AddField("wheelprice", cost);
		shortRequest(url, form, okFunc, errFunc);
	}

	public static function WheelGameBeginNineRoll(wheelid : int, gemsCost : int, tokenCost : int, okFunc : Function, errFunc : Function)
	{
		var url : String = "wheelGameStart.php";
		var form : WWWForm = new WWWForm();
		form.AddField("wheelid", wheelid);
		form.AddField("wheeltype", 3);
		form.AddField("gems", gemsCost);
		form.AddField("wheelprice", tokenCost);
		shortRequest(url, form, okFunc, errFunc);
	}

	public static function WheelGameReward(wheelid : int, wheelCount : int, okFunc : Function, errFunc : Function)
	{
		var url : String = "wheelGameReward.php";
		var form : WWWForm = new WWWForm();
		form.AddField("wheelid", wheelid);
		form.AddField("wheelCount", wheelCount);
		shortRequest(url, form, okFunc, errFunc, true);
	}

	public static function UseBonusTroopItem(itemId:int, cityId:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "trainBonus.php";
		var form:WWWForm = new WWWForm();
		form.AddField("iid", itemId);
		form.AddField("cid", cityId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function GetCarmotIntroEmail( cityId:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "sendCarmotInstructions.php";
		var form:WWWForm = new WWWForm();
		form.AddField("cid", cityId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function GetCarmotDropLoot( marchId:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "getCarmotLoot.php";
		var form:WWWForm = new WWWForm();
		form.AddField("marchId", marchId);
		shortRequest(url, form, okFunc, errorFunc);
	}
	public static function GetGeneralStatues( cityId:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "getKnightsStaus.php";
		var form:WWWForm = new WWWForm();
		form.AddField("cid", cityId);
		shortRequest(url, form, okFunc, errorFunc);
	}
	public static function GetMigrateWords(  okFunc:Function, errorFunc:Function)
	{
		var url:String = "migrateServers.php";
		var form:WWWForm = new WWWForm();
//		form.AddField("serverId", serverId);
//		form.AddField("userId", userId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function GetMigrateConditions(selectServer:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "migrateConditions.php";
		var form:WWWForm = new WWWForm();
//		form.AddField("serverId", serverId);
//		form.AddField("userId", userId);
		form.AddField("selectServerId", selectServer);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function GetComparedMigrateRoleInfo( selectServer:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "migrateRoleInfo.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", 2);
		form.AddField("selectServerId", selectServer);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function GetMigrateRoleInfo( selectServer:int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "migrateRoleInfo.php";
		var form:WWWForm = new WWWForm();
//		form.AddField("serverId", serverId);
//		form.AddField("userId", userId);
		form.AddField("selectServerId", selectServer);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function GetMigrateTroopLimit(okFunc:Function, errorFunc:Function)
	{
		var url:String="migrateAercenaryLimit.php";

		var form:WWWForm=new WWWForm();

		shortRequest(url,form,okFunc,errorFunc);
	}

	public static function Migrate( migrateTime:String,selectServer:int,itemCount:int,account:String,password:String, okFunc:Function, errorFunc:Function)
	{
		var url:String = "migrateExcute.php";
		var form:WWWForm = new WWWForm();
		form.AddField("migrateTime", migrateTime);
//		form.AddField("userId", userId);
		form.AddField("selectServerId", selectServer);
		form.AddField("itemCount", itemCount);
		form.AddField("account", account);
		form.AddField("password", password);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function MigrateMailBox(account:String,password:String, okFunc:Function, errorFunc:Function)
	{
		var url:String = "migrateConfirm.php";
		var form:WWWForm = new WWWForm();
		form.AddField("account", account);
		form.AddField("password", password);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function MigrateCancel( type:String, okFunc:Function, errorFunc:Function)
	{
		var url:String = "migrateCancel.php";
		var form:WWWForm = new WWWForm();
		form.AddField("type", type);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function getPictCampResource(tileId:int,okFunc:Function,errorFunc:Function)
	{
		var url:String = "getPictCampResource.php";
		var form:WWWForm = new WWWForm();
		form.AddField("tid", tileId);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function GetShowSkills(okFunc:Function,errorFunc:Function)
	{
		var url:String="showSkill.php";
		var form:WWWForm=new WWWForm();
		form.AddField("cityId",GameMain.instance().getCurCityId());
		shortRequest(url,form,okFunc,errorFunc);
	}

	public static function GetMapSearchPoint(type:int,level:int,x:int,y:int,okFunc:Function,errorFunc:Function)
	{

		var url:String="getTargetTile.php";
		var form:WWWForm=new WWWForm();
		var sdfsd:Object;
		form.AddField("type",type);
		form.AddField("level",level);
		form.AddField("xCoord",x);
		form.AddField("yCoord",y);
		// form.AddField("asasd",sdfsd);
		shortRequest(url,form,okFunc,errorFunc);
	}

	public static function SetAllianceLanguage(id:int,okFunc:Function,errorFunc:Function)
	{
		var url:String="allianceSetLanguage.php";
		var form:WWWForm=new WWWForm();
		form.AddField("language",id);
		shortRequest(url,form,okFunc,errorFunc);
	}

	public static function AddImpeachChancellor(okFunc:Function,errorFunc:Function)
	{
		var url:String="addInpeachChancellor.php";
		var form:WWWForm=new WWWForm();
		shortRequest(url,form,okFunc,errorFunc);
	}

	//取消集结
	public static function rallyCancel(rallyId : int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "rally.php";
		var cityId : int = GameMain.singleton.getCurCityId();

		var form:WWWForm = new WWWForm();
		form.AddField("type", 3);
		form.AddField("rallyId", rallyId);
		form.AddField("cityId", cityId);

		shortRequest(url, form, okFunc, errorFunc);
	}

	//集结加速
	public static function rallySpeedUp(itemId : int, marchId : int, rallyId : int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "rally.php";

		var cityId : int = GameMain.singleton.getCurCityId();
		var form:WWWForm = new WWWForm();
		form.AddField("type", 4);
		form.AddField("itemId", itemId);
		form.AddField("marchId", marchId);
		form.AddField("rallyId", rallyId);
		form.AddField("cityId", cityId);

		shortRequest(url, form, okFunc, errorFunc);
	}

	//世界boss
	public static function worldBossSpeedUp(params:Array, okFunc:Function, errorFunc:Function)
	{
		var    url:String = "speedupWorldBossMarch.php";

        var form:WWWForm = new WWWForm();

        form.AddField("cid",""+params[0]);
        form.AddField("iid", ""+params[1]);
        form.AddField("mid", ""+params[2]);

        shortRequest(url, form, okFunc, errorFunc);
	}

	//获取世界Boss列表
	public	static function	getWorldBossList(type:int, okFunc:Function, errorFunc:Function){
		var url:String = "getWorldBossList.php";

		var cityId : int = GameMain.singleton.getCurCityId();
		var form:WWWForm = new WWWForm();
		form.AddField("type", type);

		shortRequest(url, form, okFunc, errorFunc);
	}

	//获取月卡奖励
	public static function getMonthlyCardReward(okFunc:Function, errorFunc:Function){
		var url:String="getMonthlyCardReward.php";

		var form:WWWForm=new WWWForm();

		shortRequest(url,form,okFunc,errorFunc);
	}


	//解散藏兵 new
	public static function dismissCityHideTroop(okFunc:Function, errorFunc:Function){

		var url:String="dismissCityHideTroop.php";
		var cityId:String=GameMain.instance().getCurCityId().ToString();
		var form:WWWForm=new WWWForm();
		form.AddField("cid",cityId);

		shortRequest(url, form, okFunc, errorFunc);
	}

	//修改骑士备注
	public static function renameKnightName(knightRemark : String, kid : int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "changeKnightRemark.php";
		var form:WWWForm = new WWWForm();
		form.AddField("knightRemark", knightRemark);
		form.AddField("kid", kid);


		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function getBaseMapInfo(okFunc:Function, errorFunc:Function){
		var url:String = "getBaseMapInfo.php";
		var form:WWWForm = new WWWForm();

		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function getReportLog(ava : int, reportId : int, okFunc:Function, errorFunc:Function)
	{
		var url:String = "getReportLog.php";
		var form:WWWForm = new WWWForm();
		form.AddField("ava", ava);
		form.AddField("reportId", reportId);

		shortRequest(url, form, okFunc, errorFunc);
	}
	public static function getReportData(userId:int, reportId:int, okFunc:Function, errorFunc:Function){
	    var url:String = "getShareReport.php";
	    var form:WWWForm = new WWWForm();
	    form.AddField("sharePlayerId",userId);
	    form.AddField("reportId",reportId);

	    shortRequest(url, form, okFunc, errorFunc);
	}

	public static function getAvaReportData(userId:int, reportId:int, serverId:int, eventId:int, okFunc:Function, errorFunc:Function)
	{
	    var url:String = "getShareReport.php";
	    var form:WWWForm = new WWWForm();
	    form.AddField("sharePlayerId",userId);
	    form.AddField("reportId",reportId);
	    form.AddField("ava",1);
	    form.AddField("shareServerId",serverId);
	    form.AddField("eventId",eventId);

	    shortRequest(url, form, okFunc, errorFunc);
	}
	public static function renameEquip(gearId:int,remark:String,okFunc:Function,errorFunc:Function){
	    var url:String = "changeGearRemark.php";
	    var form:WWWForm = new WWWForm();
	    form.AddField("gearId",gearId);
	    form.AddField("remark",remark);

	    shortRequest(url, form, okFunc, errorFunc);

	}
	public static function sendFPSDate(fpsdate:String,okFunc:Function,errorFunc:Function)
	{
		//_Global.LogWarning("sendFPSDate....:"+fpsdate);
		var url:String = "fpsLog.php";
		var form:WWWForm = new WWWForm();
		var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();
		form.AddField("m_manufacturer", deviceInfo.manufactor);
		form.AddField("m_model", deviceInfo.model);
		form.AddField("m_iso", deviceInfo.osName);
		form.AddField("m_osVer",deviceInfo.osVersion);
		form.AddField("fpsData",fpsdate);

		shortRequest(url, form, okFunc, errorFunc);

	}

	public static function getMarchesInfo(okFunc:Function, errorFunc:Function)
	{
		var url:String = "getMarchesInfo.php";
		var form:WWWForm = new WWWForm();
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function getTileInfoByCoord(xCoord : int, yCoord : int, okFunc : Function, errorFunc : Function)
	{
		var url : String = "getTileInfoByCoord.php";
		var form:WWWForm = new WWWForm();
		form.AddField("xCoord", xCoord);
		form.AddField("yCoord",yCoord);
		shortRequest(url, form, okFunc, errorFunc);
	}

	public static function getDefaultMarches(cid:int,okFunc:Function,errorFunc:Function){
		var url:String = "getDefaultMarches.php";
		var form:WWWForm = new WWWForm();
		form.AddField("cid",cid);
		shortRequest(url,form,okFunc,errorFunc);
	}
	public static function saveDefaultMarch(cid:int,mNum:int,kid:int,trooplist:Array,userHeroIds:String,buffItems:String,okFunc:Function,errorFunc:Function)
	{
		//	saveDefaultMarch.php 保存预设队列，参数{cid: 城市id, mNum: 第几条预设队列，kid: 骑士id, userHeroIds:英雄id, buffItems: 使用的buff}
		var url:String = "saveDefaultMarch.php";
		var form:WWWForm = new WWWForm();
		form.AddField("cid",cid);
		form.AddField("mNum",mNum);
		form.AddField("kid",kid);
		form.AddField("userHeroIds",userHeroIds);
		form.AddField("buffItems",buffItems);
		for( var i :int = 0; i < trooplist.length; i++)
		{
			var troop:Barracks.TroopInfo = trooplist[i] as Barracks.TroopInfo;
			if (troop != null)
			{
				if(troop.selectNum > 0)
				form.AddField("u" + troop.typeId, troop.selectNum);
			}
		}

	    shortRequest(url,form,okFunc,errorFunc);
	}

	public static function decorationUpdate(type : String, itemId : int, okFunc : Function, errorFunc : Function)
	{
		var url : String = "decorationUpdate.php";
		var form : WWWForm = new WWWForm();
		form.AddField("type", type);
		form.AddField("itemId", itemId);

	    shortRequest(url, form, okFunc, errorFunc);
	}

	public static function decorationUnlock(type : String, itemId : int, okFunc : Function, errorFunc : Function)
	{
		var url : String = "decorationUnlock.php";
		var form : WWWForm = new WWWForm();
		form.AddField("type", type);
		form.AddField("itemId", itemId);

	    shortRequest(url, form, okFunc, errorFunc);
	}

	/********************************************** 城堡皮肤 ***************************************************************/

	/*获得城堡皮肤列表数据*/
	public static function	reqCityReplaceSkinData(cityId: int,okFunc: Function, errorFunc: Function) {
		var url: String = "cityReplaceSkin.php";

		var form: WWWForm = new WWWForm();

		form.AddField("type", 1);
		form.AddField("cityId", cityId);

		shortRequest(url, form, okFunc, errorFunc);
	}

	/*更换城堡的皮肤*/
	public static function	reqCityReplaceSkinChangeNewSkin(cityId: int, skinId: int, okFunc: Function, errorFunc: Function) {
		var url: String = "cityReplaceSkin.php";

		var form: WWWForm = new WWWForm();

		form.AddField("type", 2);
		form.AddField("cityId", cityId);
		form.AddField("skinId", skinId);

		shortRequest(url, form, okFunc, errorFunc);
	}


	/*使用城堡皮肤道具*/
	public static function	reqCityReplaceSkinUseSkinProp(cityId: int, skinPropId: int, okFunc: Function, errorFunc: Function) {
		var url: String = "cityReplaceSkin.php";

		var form: WWWForm = new WWWForm();

		form.AddField("type", 3);
		form.AddField("cityId", cityId);
		form.AddField("iid", skinPropId);

		shortRequest(url, form, okFunc, errorFunc);
	}

	/*检测是否可以购买皮肤道具*/
	public static function	reqCityReplaceSkinCheckBuyLimitState(cityId: int, skinPropId: int,okFunc: Function, errorFunc: Function) {
		var url: String = "cityReplaceSkin.php";
		var form: WWWForm = new WWWForm();

		form.AddField("type", 4);
		form.AddField("cityId", cityId);
		form.AddField("iid", skinPropId);

		shortRequest(url, form, okFunc, errorFunc);
	}

	/*购买皮肤道具*/
	public static function	reqCityReplaceSkinBuySkinProp(cityId: int, skinPropId: int, buyCnt: int, okFunc: Function, errorFunc: Function) {
		var url: String = "buyItemBatch.php";
		var form: WWWForm = new WWWForm();

		form.AddField("type", 1);
		form.AddField("cityId", cityId);
		form.AddField("iid", skinPropId);
		form.AddField("buyitemamount", buyCnt);

		shortRequest(url, form, okFunc, errorFunc);
	}

	/*购买 城堡皮肤道具后，需要更新玩家的道具数据 */
	public static function	reqCityReplaceSkinUpdateProp(cityId: int, skinPropId: int,okFunc: Function, errorFunc: Function) {
		var url: String = "cityReplaceSkin.php";

		var form: WWWForm = new WWWForm();

		form.AddField("type", 5);
		form.AddField("cityId", cityId);
		form.AddField("iid", skinPropId);

		shortRequest(url, form, okFunc, errorFunc);
	}

	/**************************************************************************************************************************/


	/********************************************** 迷雾远征 ***************************************************************/


	/* ----------------------------
	* 获得迷雾远征 入口 基础信息 数据
	* ----------------------------
	*
	*/
	public static function reqMistExpeditionEntranceInfo(okFunc: Function, errorFunc: Function) {
		var url: String = "pveTowerMarch.php";

		var form: WWWForm = new WWWForm();

		form.AddField("type", 6);
		shortRequest(url, form, okFunc, errorFunc);
	}

	/* ----------------------------
	* 获得 迷雾远征玩法入口
	* ----------------------------
	*
	*/
	public static function reqMistExpeditionSceneEntranceInfo(okFunc: Function, errorFunc: Function) {
		var url: String = "useExpeditionItem.php";

		var form: WWWForm = new WWWForm();

		form.AddField("type", 1);
		shortRequest(url, form, okFunc, errorFunc);
	}


	/* ----------------------------
	 * 获得迷雾远征基础信息 数据
	 * ----------------------------
	 *
	*/
	public static function reqMistExpeditionMapInfo(okFunc: Function, errorFunc: Function) {
		var url: String = "pveTowerMarch.php";

		var form: WWWForm = new WWWForm();

		form.AddField("type", 1);
		shortRequest(url, form, okFunc, errorFunc);
	}

	/* 战斗事件 - 发送战斗 march 信息
	 * 参数：cid: 城市id, hid: 领袖id,lid:事件点的id(eventPointId) floor: 当前事件所在的层数（共1-15层）, mapType: 事件类型, units:部队排遣数据
	*/
	public static function reqMistExpeditionEventBattleMarch(cityId: int, laederId: int, eventPointId: int, layer: int, eventType: int, unitsDataStr: String, okFunc: Function, errorFunc: Function) {
		var url: String = "pveTowerMarch.php";

		var form: WWWForm = new WWWForm();

		form.AddField("type", 2);
		form.AddField("cid", cityId);/* city id */
		form.AddField("hid", laederId);/* hero id */
		form.AddField("lid", eventPointId);/* event point id */
		form.AddField("floor", layer);/* event layer */
		form.AddField("mapType", eventType);
		form.AddField("units", unitsDataStr);

		shortRequest(url, form, okFunc, errorFunc);
	}

	/* 战斗事件 - 获得战斗 match 结果  */
	public static function reqMistExpeditionEventBattleMarchResult(cityId: int, marchID: int, eventPointId: int, okFunc: Function, errorFunc: Function) {
		var url: String = "pveTowerMarch.php";

		var form: WWWForm = new WWWForm();

		form.AddField("type", 3);
		form.AddField("cid", cityId);
		form.AddField("mid", marchID);
		form.AddField("lid", eventPointId);

		shortRequest(url, form, okFunc, errorFunc);
	}

	/* 重置迷雾远征的所有数据 */
	public static function reqMistExpeditionMapInitData(okFunc: Function, errorFunc: Function) {
		var url: String = "pveTowerMarch.php";

		var form: WWWForm = new WWWForm();

		form.AddField("type", 4);
		shortRequest(url, form, okFunc, errorFunc);
	}

	/* 迷雾远征中 事件点的选中状态保存 */
	public static function reqMistExpeditionMapSelectEventPoint(eventPointId: int, okFunc: Function, errorFunc: Function) {
		var url: String = "pveTowerMarch.php";

		var form: WWWForm = new WWWForm();

		form.AddField("type", 5);
		form.AddField("lid", eventPointId);
		shortRequest(url, form, okFunc, errorFunc);
	}


	/* ----------------------------
	 * 随机（迷雾沼泽）事件
	 * ----------------------------
	 */
  	/* 随机（迷雾沼泽）事件 - 获得其他的事件 */
	public static function reqMistExpeditionEventGetRandomEvent(eventPointId: int, layer: int, eventType: int, mapId: int, okFunc: Function, errorFunc: Function) {
  		var url: String = "getExpeditionRandPoint.php";

  		var form: WWWForm = new WWWForm();

		form.AddField("lid", eventPointId);
  		form.AddField("floor", layer);
  		form.AddField("mapType", eventType);
  		form.AddField("mapId", mapId);

  		shortRequest(url, form, okFunc, errorFunc);
  	}

	/* ----------------------------
	 * 排行榜数据
	 * ----------------------------
	 */
	public static function reqMistExpeditionEventLeaderBoard(okFunc: Function, errorFunc: Function) {
		var url: String = "getExpeditionLeaderboard.php";

		shortRequest(url, null, okFunc, errorFunc);
	}




	/* ----------------------------
	 * 远征中的 远征商人
	 * ----------------------------
	 */

	/* 远征商人 - 商品列表 */
	public static function reqMistExpeditionEventMerchantGetItemList(eventPointId: int, okFunc: Function, errorFunc: Function) {
		var url: String = "merChant.php";
		var form: WWWForm = new WWWForm();

		form.AddField("type", 1);
		form.AddField("pointId", eventPointId);/*事件点ID*/

		shortRequest(url, form, okFunc, errorFunc);
	}

	/* 远征商人 - 通过 远征币 购买 buff 物品 */
	public static function reqMistExpeditionEventMerchantBuyItemByCoin(eventPointId: int, buffId: int, okFunc: Function, errorFunc: Function) {
		var url: String = "merChant.php";
		var form: WWWForm = new WWWForm();

		form.AddField("type", 2);
		form.AddField("pointId", eventPointId);/* 事件点ID */
		form.AddField("buffId", buffId);/*buff ID*/

		shortRequest(url, form, okFunc, errorFunc);
	}

	/* 远征商人 - 通过 gems 购买 buff 物品 */
	public static function reqMistExpeditionEventMerchantBuyItemByGems(id: int, buyCnt: int, eventPointId : int, okFunc: Function, errorFunc: Function) {

		var url: String = "buyItemBatch.php";
		var form: WWWForm = new WWWForm();
		form.AddField("type", 2);
		form.AddField("iid", id);/*buff ID*/
		form.AddField("buyitemamount", buyCnt);
		form.AddField("pointId", eventPointId);/* 事件点ID */
		shortRequest(url, form, okFunc, errorFunc);
	}

	/* 远征商人 - 放弃本次远征商人购买，退出 */
	public static function reqMistExpeditionEventMerchantExit(eventPointId: int, okFunc: Function, errorFunc: Function) {
		var url: String = "merChant.php";
		var form: WWWForm = new WWWForm();

		form.AddField("type", 4);
		form.AddField("pointId", eventPointId);/*事件点ID*/


		shortRequest(url, form, okFunc, errorFunc);
	}

	/* ----------------------------
	 * 战斗事件点奖励领取
	 * ----------------------------
	 */
	public static function reqMistExpeditionEventReceiveReward(isBoss:boolean, eventPointId: int, rewardBuffId: String, okFunc: Function, errorFunc: Function) {
		var url: String = "receiveReward.php";
		var form: WWWForm = new WWWForm();

		var type = 1;
		if (isBoss) type = 2;

		form.AddField("rewardtype", type);			/* 领取战斗buff奖励，1:普通、精英战斗 2:boss战斗*/
		form.AddField("pointId", eventPointId);		/* 事件点ID */
		form.AddField("rewardId", rewardBuffId);	/* 领取的奖励buff ID*/

		shortRequest(url, form, okFunc, errorFunc);
	}

	/* ----------------------------
	 *	宝箱 事件点
	 * ----------------------------
	 */
	public static function reqMistExpeditionGetChestItemData(mapId: int, eventPointId: int, okFunc: Function, errorFunc: Function) {
		var url: String = "getExpeditionChest.php";

		var form: WWWForm = new WWWForm();
		form.AddField("mapId", mapId);				/* 地图 id */
		form.AddField("lid", eventPointId);			/*事件点 id */

		shortRequest(url, form, okFunc, errorFunc);
	}

	/* ----------------------------
	 *	支援点 事件
	 * ----------------------------
	 */
	public static function reqMistExpeditionSupplyStation(eventPointId: int, okFunc: Function, errorFunc: Function) {
		var url: String = "recoveryTroops.php";

		var form: WWWForm = new WWWForm();
		form.AddField("type", 1);					/* type = 1    恢复兵量 */
		form.AddField("pointId", eventPointId);		/* 事件点 id */

		shortRequest(url, form, okFunc, errorFunc);
	}


	/* ----------------------------
	 *	领袖选择
	 * ----------------------------
	 */
	public static function reqMistExpeditionSelectLeader(leaderId: int, okFunc: Function, errorFunc: Function) {
		var url: String = "checkLeader.php";

		var form: WWWForm = new WWWForm();
		form.AddField("leaderId", leaderId);			/* 领袖 id */

		shortRequest(url, form, okFunc, errorFunc);
	}

	/* ----------------------------
	* 迷雾远征 复活
	* ----------------------------
	*
	*/
	public static function reqMistExpeditionResurrection(eventPointId: int, okFunc: Function, errorFunc: Function) {
		var url: String = "useExpeditionItem.php";

		var form: WWWForm = new WWWForm();

		form.AddField("type", 2);
		form.AddField("pointId", eventPointId);
		shortRequest(url, form, okFunc, errorFunc);
	}





	/* ----------------------------
	 *	远征最终结算
	 * ----------------------------
	 */
	public static function reqMistExpeditionSettlement(okFunc: Function, errorFunc: Function) {
		var url: String = "settlement.php";

		shortRequest(url, null, okFunc, errorFunc);
	}
	
  /**************************************************************************************************************************/

}
