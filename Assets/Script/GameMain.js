
//import System.IO;
//import	System.DateTime;
import		System.Threading;

class GameMain extends KBN.GameMain
{

	private	var	currentcityinfo:HashObject;
	//private	var	citylist:Object;
	private	var	raterUrl:String;
	private var m_RaterParams:HashObject;
	private	var	deltaTime:double;
	public	var	comeFromLoading:boolean;

	private	var	curCityId:int;
	private	var	curCityOrder:int;
	private var	curCityCoor: Vector2;


	private	var	cityController:CityController;
	private	var	fieldController:FieldsController;
	private	var	mapController:MapController;
	private var mapController2:MapController;
	private	var	campaignMapController:CampaignMapController;
	private	var	chapterMapController:ChapterMapController;
	private var heroExploreController: HeroExploreController;
	private var	mistExpeditionMapController: MistExpeditionMapController;



	private var allianceBossController:AllianceBoss;
	private	var	cityScaleFactor:float;
	private	var	fieldScaleFactor:float;

	private var campaignLoadingCam : Camera;
	private var mistExpeditionSceneMaskCam: Camera;

	private var loopCntOfCurMusic:int;
	private var curMusicName:String;
	private var lastMusicName:String;
	private var curMusicOTAType:String;
	private var lastMusicOTAType:String;

	private var loadedLevel:boolean[] = [false, false, false, false, false, false, false, false, false, false, false];
	private var loadingLevel: boolean[] = [false, false, false, false, false, false, false, false, false, false, false];

	public var  errorMgr:ErrorMgr;
	public var  fteMgr :KBN.FTEMgr;
	public var	cloudMgr:CloudMgr;
	//private var	rainMgr:RainMgr;
	public var  birdMgr:BirdMgr;
	//private var	snowEffect:ParticleEffect;

	public	var	rainEnable:boolean = false;
	public	var	snowEnable:boolean = true;

	private		var	initOver:boolean = false;
	private		var m_isPushedMainChrome = false;

	private      var loadingCameraObj:GameObject;
	private		var	loading:Loading;

	private		var	saveDataThread:Thread;
	private		var	saveStrThread:Thread;
	private		var	saveBuildingDataThread:Thread;
	private		var	saveTroopDataThread:Thread;
	private		var	saveGearDataThread:Thread;
	private		var	saveGearSkillDataThread:Thread;
	private		var	saveGearLevelUpDataThread:Thread;
	private		var	saveGearSysUnlockDataThread:Thread;
	private		var	saveGearItemChestListDataThread:Thread;

	private		var bCanGCAuth:boolean = false;
	private     var bLogin:boolean;
	private		var timeForMap:float;

	public      var showLogin:boolean = false;

	private		var	signupOver:boolean = false;
	private		var	backgroundTime:long;
	private		var	sessionTime:long;
	private		var	isFirstSession:boolean;
	//private		var	userHasStartFTE:boolean;
	private		static var	coldStart:boolean = true;//this should be static variable, when restart, contain old value

	private		var	mapInitCenterX:int;
	private		var	mapInitCenterY:int;

	private var isShareDlgOpened:boolean = false;

	private var startTime:System.DateTime;

	private var shouldShowChartboostInterstitial : boolean = false;

	private var m_curChapterId:int = 0;
	private var m_bCanEnterCampaignScene = false;
	private var m_bPveGDSOnReady = false;

	private var m_resetViewport = false;

	private var viewPort_Y:float;
	private var viewPort_H:float;

	private var playerMigrateStatus:int;
	private var migrateSwitch:boolean = false;

	private var otaDownloader : KBN.AssetBundleOTADownloader;
	private var assetBundleManager_Deprecate : KBN.AssetBundleManager_Deprecate;

	private var USE_AVA_MINIMAP_AS_FORTH_SEQUENCED_SCENE : boolean = false;

	public var offsetY:float;
	public var offsetHeight:float;


	/* 所有的 map ctr 的字典集合 */
	private var mapControllerDic: System.Collections.Generic.Dictionary.<int, GestureController>;


	private var currentGameDate: System.DateTime;




public function onAbandonTileOK( tileId : int )
{
	if( mapController2 != null )
	{
		mapController2.onAbandonTileOK( tileId );
	}
}

public function onCityMoved( oldX : int, oldY : int, newX : int, newY : int )
{
	if( mapController2 != null )
	{
		mapController2.onCityMoved( oldX, oldY, newX, newY );
	}
}

public function getOTADownloader() : KBN.AssetBundleOTADownloader
{
	return otaDownloader;
}

public function getAssetBundleManager_Deprecate() : KBN.AssetBundleManager_Deprecate
{
	return assetBundleManager_Deprecate;
}

	public function get CurrentCamera() : Camera
	{
		return GetSceneCameraBySceneLevel(curScenceLevel);
	}

	private function GetSceneCameraBySceneLevel(sceneLevel: int): Camera {
		var curCamera: Camera = null;
		switch (sceneLevel) {
			case CITY_SCENCE_LEVEL:
				if (cityController != null) {
					curCamera = cityController.getCurCamera();
				}
				break;
			case FIELD_SCENCE_LEVEL:
				if (fieldController != null) {
					curCamera = fieldController.getCurCamera();
				}
				break;
			case AVA_MINIMAP_LEVEL:
				if (mapController2 != null) {
					curCamera = mapController2.getCurCamera();
				}
			case WORLD_SCENCE_LEVEL:
				if (mapController != null) {
					curCamera = mapController.getCurCamera();
				}
				break;
			case CAMPAIGNMAP_SCENE_LEVEL:
				if (campaignMapController != null) {
					curCamera = campaignMapController.getCurCamera();
				}
				break;
			case CHAPTERMAP_SCENE_LEVEL:
				if (chapterMapController != null) {
					curCamera = chapterMapController.getCurCamera();
				}
				break;
			case HERO_EXPLORE_LEVEL:
				if (heroExploreController != null) {
					curCamera = heroExploreController.getCurCamera();
				}
				break;
			case ALLIANCE_BOSS_LEVEL:
				if (allianceBossController != null) {
					curCamera = allianceBossController.getCurCamera();
				}
				break;
			case MISTEXPEDITION_LEVEL:
				if (mistExpeditionMapController != null) {
					curCamera = mistExpeditionMapController.getCurCamera();
				}
				break;
		}

		return curCamera;
	}

public function setViewPort():void
{
	if ( MenuMgr.getInstance().MainChrom.BodyElement == null )
		return;

	var rectBody : Rect = new Rect(MenuMgr.getInstance().MainChrom.BodyElement.rect);
	rectBody.y = _Global.ScreenHeight - MenuMgr.getInstance().MainChrom.chromBtnsScroll.rect.y;

	var screenHeight : int;
	var headHeight : int;
	var sceneLevel = getScenceLevel();

	if (sceneLevel == CAMPAIGNMAP_SCENE_LEVEL) {
		/* This menu wouldn't be initialized if the main chrome instance were loaded before
			the pve main chrome, in which case we'll try to set the viewport again in the
			next cycle by setting the reset viewport flag.
		*/
		var menu: KBNMenu = MenuMgr.getInstance().getMenu("PveMainChromMenu");

		if (menu != null) {
			screenHeight = _Global.ScreenHeight;
			headHeight = _Global.IsLargeResolution() ? 220 : 140;
			rectBody.height = screenHeight - headHeight;
			rectBody.y = 0;
			if (KBN._Global.isIphoneX()) {
				rectBody.y = 22;
			}
		}
		else {
			m_resetViewport = true;
		}
	}
	else if (sceneLevel == CHAPTERMAP_SCENE_LEVEL) {
		var menu2 = MenuMgr.getInstance().getMenu("PveMainChromMenu");
		if (menu2 == null)
			return;
		var pveMainChromeMenu: PveMainChromMenu = menu2 as PveMainChromMenu;
		screenHeight = _Global.ScreenHeight;
		headHeight = pveMainChromeMenu.menuHead.rect.height - 50;
		rectBody.height = screenHeight - headHeight;
		rectBody.y = 0;
		if (KBN._Global.isIphoneX()) {
			rectBody.y = 22;
		}
	}
	else if (sceneLevel == HERO_EXPLORE_LEVEL) {
		rectBody.height = _Global.ScreenHeight;
		rectBody.y = 0;
		if (KBN._Global.isIphoneX()) {
			/* rectBody.y = rectBody.y+10;*/
		}
	}
	else if (sceneLevel == WORLD_SCENCE_LEVEL || sceneLevel == AVA_MINIMAP_LEVEL) {
		rectBody.height = (_Global.ScreenHeight - MenuMgr.getInstance().MainChrom.CoordingBarHeight) - rectBody.y;
		rectBody.height += 10;
	}
	else if (sceneLevel == MISTEXPEDITION_LEVEL) {
		rectBody.height = _Global.ScreenHeight;
		rectBody.y = 0;
		if (KBN._Global.isIphoneX()) {
			rectBody.y = 22;
		}
	}
	else
	{
		rectBody.height = (_Global.ScreenHeight - MenuMgr.getInstance().MainChrom.resourceBg.rect.center.y) - rectBody.y;
	}

	if(KBN._Global.isIphoneX()) {
		rectBody.y = rectBody.y+40;
		rectBody.height = rectBody.height*0.91f;
	}

	viewPort_H = rectBody.height / _Global.ScreenHeight;
	viewPort_Y = rectBody.y / _Global.ScreenHeight;

	var curCamera : Camera = this.CurrentCamera;
	if (curCamera != null) {
		if (sceneLevel == MISTEXPEDITION_LEVEL) {
			curCamera.rect = new Rect(0, 0, 1, 1);
			if (KBN._Global.isIphoneX()) {
				curCamera.orthographicSize = 9.25f;
			} else {
				curCamera.orthographicSize = 8f;

			}
		}
		else {
			curCamera.rect = new Rect(0, viewPort_Y, 1, viewPort_H);
		}
	}

	/* pve camera */
	if (sceneLevel == CHAPTERMAP_SCENE_LEVEL)
	{
		curCamera.transform.position.z = -(curCamera.rect.height*960/2/100);
	}
}

public	static function instance():GameMain{
	return singleton ? (singleton as GameMain) : null ;
}

public function getCurCityId():int{
	return curCityId;
}

public function getCurCityOrder():int{
	return curCityOrder;
}

public function getCurCityCoor(cityId:int):Vector2{

	var cityQueue : CityQueue = CityQueue.instance();
	var city : City = cityQueue.GetCity(cityId);
	if ( city == null )
		return new Vector2(0, 0);
	return new Vector2(city.x, city.y);
}

public function getCityOrderWithCityId(cid:int):int
{
	var cities : Hashtable = seed["cities"].Table;
	var city:HashObject;
	for(var i:int = 0; i < cities.Count; i++)
	{
		city = cities[_Global.ap + i];
		if(city == null)
			continue;
		if(_Global.INT32(city[_Global.ap + 0]) == cid)
			return _Global.INT32(city[_Global.ap + 6]);
	}
	return curCityOrder;
}

public function getCityIdByCityOrder(cityOrder : int) : int
{
	var cities : Hashtable = seed["cities"].Table;
	var city : HashObject;
	for(var i:int = 0; i < cities.Count; i++)
	{
		city = cities[_Global.ap + i];
		if(city == null)
			continue;
		if(_Global.INT32(city[_Global.ap + 6]) == cityOrder)
			return _Global.INT32(city[_Global.ap + 0]);
	}
	return curCityId;
}

public function getCityNameByXY(cx:int,cy:int):String
{
	var cn:String = Datas.getArString("ModalMessagesViewReports.NoCityName");
	var cities:Hashtable = seed["cities"].Table;
	var cityInfor:HashObject;
	var c:System.Collections.DictionaryEntry;
	for(c in cities)
	{
		cityInfor = c.Value;

		if(_Global.INT32(cityInfor[_Global.ap + 2]) == cx && _Global.INT32(cityInfor[_Global.ap + 3]) == cy )
		{
			cn = cityInfor[_Global.ap + 1].Value;
			break;
		}
	}

	return cn;
}

public function setBuildingAnimationOfCity(buildingType:int, animationType:String):void
{
	if(cityController != null)
	{
		cityController.setAnimationWithTypeId(buildingType, animationType);
	}
}

public function buyMonthCardOk()
{
	if(cityController != null)
	{
		cityController.buyMonthCardOk();
	}
}

public function getCityNameById(id:int):String
{
	var cn:String = Datas.getArString("ModalMessagesViewReports.NoCityName");
	var cities:Hashtable = seed["cities"].Table;
	var cityInfor:HashObject;
	var c:System.Collections.DictionaryEntry;
	for(c in cities)
	{
		cityInfor = c.Value;

		if(_Global.INT32(cityInfor[_Global.ap + 0]) == id)
		{
			cn = cityInfor[_Global.ap + 1].Value;
			break;
		}
	}

	return cn;
}

public function gemsMaxCost() : int
{
	return _Global.INT32(seed["gemCostMsgNum"]);
}

public function isShowCarmot():boolean{
	return seed["mapSearchCarmot"]==null?false:
		_Global.INT32(seed["mapSearchCarmot"])==1;
}

public function isShowMapSearchResource() : boolean
{
	return seed["mapSearchResource"] == null ? false :
		_Global.INT32(seed["mapSearchResource"]) == 1;
}

public function getMapSearchTimes():int{
	return seed["mapSearchTimes"]==null?0:
		_Global.INT32(seed["mapSearchTimes"]);
}


public function getRaterUrl():String{
	return raterUrl;
}

function Awake(){
	_Global.Log("[GameMain Awake]");

	mapControllerDic = System.Collections.Generic.Dictionary.<int, GestureController>();

    offsetY = 30;
    offsetHeight = 0.91f;
	singleton = this;
    // For conversion to C# TODO: remove when possible
    Payment.instance();
    AmazonPayment.getInstance();
    FTELocalServer.getInstance();
    NewFteMgr.Instance();
    MystryChest.instance();
    Building.instance();
    Message.getInstance();
	Flags.instance();// init flags
    DailyLoginRewardMgr.MakeInstance();
    PaymentOfferManager.MakeInstance();
    DailyQuestManager.MakeInstance();
    ToastNetHook.MakeInstance();
    StatePopupEntranceController.MakeInstance();

    gdsManager = new GdsManager();
    m_AvaManager = new AvaManager();
    m_PlayerBuff = new PlayerBuff();
    InstanceGDS();
    Museum.instance();
    m_showKabamID_BIPosition = -1;
	m_isHaveTOSCheck = false;
	/*removed in 18.5.0 Gaea  --Begin
	if(RuntimePlatform.Android != Application.platform && RuntimePlatform.IPhonePlayer != Application.platform)
	KBNSODA.Instance.Enable = false;
	--end */

	allianceEmblemMgr = new AllianceEmblemMgr();
}

public function MapIsAutoUpdate() : boolean
{
    return getMapController().isAutoupdate();
}


private var gameInitTime:long=0;
public function GetApplicationInitTime():long
{
	return gameInitTime - NativeCaller.GetApplicationInitTime();
}

function Start() {

	assetBundleManager_Deprecate = GameObject.Find("GlobalObj").GetComponent(typeof(KBN.AssetBundleManager_Deprecate));
	otaDownloader = GameObject.Find("GlobalObj").GetComponent(typeof(KBN.AssetBundleOTADownloader));
	otaDownloader.setOwner( this );
	SoundMgr.instance().setAssetBundleManager( assetBundleManager_Deprecate );

	startTime = System.DateTime.Now;
	//_Global.Log("$$$$$  After startTimeInit : " + (System.DateTime.Now - startTime).TotalMilliseconds);
	_Global.Log( "GameMain start");
	gameInitTime=_Global.INT64((System.DateTime.UtcNow - new System.DateTime(1970, 1, 1, 0, 0, 0, 0)).TotalMilliseconds); //获取游戏正式启动时间
	//Debug.Log("游戏启动时间="+gameInitTime);
	gameTime = 0;
	comeFromLoading = true;
	isShareDlgOpened = false;
	ResetFlags();
	//_Global.Log("$$$$$  After resetFlags : " + (System.DateTime.Now - startTime).TotalMilliseconds);
	Application.RegisterLogCallbackThreaded(HandleLog);

	KBN.NewUpdateSeed().getInstance().SetMonoBehavior(this.instance());
	errorMgr.Init();
	//FontMgr.Init();

	cloudMgr.init();


	//birdMgr.init();
	//_Global.Log("$$$$$  After biremgrInit : " + (System.DateTime.Now - startTime).TotalMilliseconds);
	loadingCameraObj = GameObject.Find("LoadingCamera");
	loading = loadingCameraObj.GetComponent("Loading");

	horizRatio = Screen.width /640.0f;
    vertRatio = Screen.height / 960.0f;

    fteMgr = KBN.FTEMgr.getInstance();
	fteMgr.PreInit();
	/*_Global.Log("$$$$$  After ftePreInit : " + (System.DateTime.Now - startTime).TotalMilliseconds);*/
	firstRequire();

	sessionTime = Time.realtimeSinceStartup;
	bCanGCAuth = false;

	if( USE_GHOST_MAP_2_CACHE_TILE_MOTIFS ) {
		GhostMap.getInstance().switchDataSet( true );
		if( !GhostMap.getInstance().ReadFromFile() ) { //
			GhostMap.getInstance().ClearData();
		}
		GhostMap.getInstance().switchDataSet( false );
		if( !GhostMap.getInstance().ReadFromFile() ) { //
			GhostMap.getInstance().ClearData();
		}
	}
}

private static final var LogFormatToSend = "{0}\n{1}";
function HandleLog (logString : String, stackTrace : String, type : LogType) {
#if UNITY_EDITOR
	if (logString.Contains("Request error (error):") && stackTrace.Contains("UnityEditor.AsyncHTTPClient:Done") && type == LogType.Error)
	{
		return;
	}
#endif


#if	!UNITY_EDITOR && UNITY_ANDROID
	var isException:boolean = true;
	if(logString == "eglMakeCurrent(s_EGLDisplay, EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT): EGL_BAD_DISPLAY: An EGLDisplay argument does not name a valid EGL display connection.")
	{
		//send to see if this is fixed by unity version upgrade.
		isException = false;
	}
	else if(logString.Contains("[EGL]"))
	{
		//not send to reduce the amount of bugs,in case of ignorance of the real bugs.
		isException = false;
		return;
	}
#else
	var isException:boolean = true;
#endif

	switch( type ){
	case	LogType.Error:
	#if			UNITY_EDITOR
		if ( logString == "The profiler has run out of samples for this frame. This frame will be skipped." )
			break;
	#endif
		if(logString.Contains("because it was not built with the right version or build target"))
		{
			isException = false;
		}
		UnityNet.reportErrorToServer( "CLIENT_ERROR", null, null, String.Format(LogFormatToSend, logString, stackTrace), isException);
		break;

	case	LogType.Assert:
		UnityNet.reportErrorToServer( "CLIENT_ASSERT", null, null, String.Format(LogFormatToSend, logString, stackTrace), isException);
		break;

	case	LogType.Exception:

		if( saveDataThread ){
			saveDataThread.Join();
		}

		if( saveStrThread ){
			saveStrThread.Join();
		}

		if(saveBuildingDataThread)
		{
			saveBuildingDataThread.Join();
		}

		if(saveTroopDataThread)
		{
			saveTroopDataThread.Join();
		}

		if(saveGearDataThread != null)
			saveGearDataThread.Join();
		if(saveGearSkillDataThread != null)
			saveGearSkillDataThread.Join();
		if(saveGearLevelUpDataThread != null)
			saveGearLevelUpDataThread.Join();
		if(saveGearSysUnlockDataThread != null)
			saveGearSysUnlockDataThread.Join();

		if(logString.StartsWith("IOException"))
		{
			stackTrace = stackTrace + NativeCaller.GetAllOpenFile();
		}

		UnityNet.reportErrorToServer( "CLIENT_EXCEPTION", null, null,  String.Format(LogFormatToSend, logString, stackTrace), isException);
		break;

	}

}

/* start init */
function firstRequire(){

	QualitySettings.vSyncCount = 0;
	if( Application.platform == RuntimePlatform.Android )
	{
		var androidFrame = _Global.GetAndroidFrame();
	}
	else
	{
		Application.targetFrameRate = 30;
		/*
		// if(Datas.getISALLOW24FPS() == 1)
		// {
		// 	Application.targetFrameRate = 30;
		// }
		// else
		// {
		// 	Application.targetFrameRate = 30;
		// }
		 */
	}


	//InitNet();
	UnityNet.setInLoadingScene( false);
//	UnityNet.SendPreLoadBI(Constant.BIType.FTE,userHasStartFTE?0:1, 100,10001001);
//	_Global.Log("firstRequire Datas.instance().getMobileLoadBI():" + Datas.instance().getMobileLoadBI());
	//_Global.Log("$$$$$  After setInLoadingScene : " + (System.DateTime.Now - startTime).TotalMilliseconds);
	var userHasStartFTE:boolean = KBN.FTEMgr.isUserStartFTE( Datas.instance().tvuid(), Datas.instance().worldid() );
	isFirstSession = !userHasStartFTE;
	//_Global.Log("$$$$$  After loadStringsFromLocal--> : " + (System.DateTime.Now - startTime).TotalMilliseconds);
//	loading.loadDataThread.Join();
	Datas.instance().loadStringsFromLocal();
	//loading.SetMessage(Datas.instance().getArString("Loading.Load_Assets"));
	//_Global.Log("$$$$$  After loadStringsFromLocal : " + (System.DateTime.Now - startTime).TotalMilliseconds);
	MenuMgr.getInstance().InitMainMenu();

	//_Global.Log("$$$$$  After InitMainMenu : " + (System.DateTime.Now - startTime).TotalMilliseconds);


	var localUtil : LocaleUtil = LocaleUtil.getInstance();
	UnityNet.reqServerTime(firstGetServerTimeOk, firstGetServerTimeError, localUtil.ConfigFileVersion);

}

private function firstGetServerTimeOk( result:HashObject ){
	//_Global.Log("$$$$$  After firstGetServerTimeOk : " + (System.DateTime.Now - startTime).TotalMilliseconds);
    // Because Apple doesn't allow fetching IFA any more
	if (Application.platform == RuntimePlatform.IPhonePlayer
            && result["canFetchIFA"] != null
            && _Global.GetBoolean(result["canFetchIFA"].Value) == true) {
        Datas.instance().UpdateIFAForIOS();
    }

//    ADXWrapper.IsEnabled = (result["enableAdX"] == null ? true : _Global.GetBoolean(result["enableAdX"]));
//    if (Application.platform == RuntimePlatform.IPhonePlayer)
//    {
//    	var osVersion : String = Datas.instance().getDeviceInfo().osVersion;
//    	ADXWrapper.IsEnabled = ADXWrapper.IsEnabled && (_Global.INT32(osVersion.Split("."[0])[0]) >= ADXWrapper.RequestIOSVer);
//    }
//
//    if (ADXWrapper.IsColdStart)
// 	{
// 		ADXWrapper.IsColdStart = false;
// 		ADXWrapper.reportAppOpen();
// 		ADXWrapper.SendAdXEvent("Launch", String.Empty, String.Empty);
// 	}

	if( result["subDomain"] && result["mainDomain"] ){
		UnityNet.initByServerSetting(result["subDomain"].Value,result["mainDomain"].Value);
	}

	if( Datas.instance().getMobileLoadBI() < 10001001 ){
		UnityNet.SendPreLoadBI(Constant.BIType.FTE,0, 100,10001001);
		Datas.instance().setMobileLoadBI(10001001);
	}
//	TextureMgr.instance().CheckUpgrade();

	raterUrl = result["irateurl"].Value;

	ParticalEffectMgr.getInstance().setFireworkStartTime(_Global.INT64(result["fireworkTime"]));

	var gameConfigStatus : HashObject = result["gameConfigStatus"];
	if ( gameConfigStatus != null )
	{
		var isNeedUpdateConfigLog : int = _Global.INT32(gameConfigStatus.Value);
		if ( isNeedUpdateConfigLog != 0 )
		{
			var gameConfigDownloadURLField : HashObject = result["gameConfigDownloadUrl"];
			var gameConfigVersionField : HashObject = result["gameConfigVersion"];
			var gameConfigDownloadURL : String = null;
			var gameConfigVersion : String = null;
			if ( gameConfigDownloadURLField != null )
				gameConfigDownloadURL = gameConfigDownloadURLField.Value as String;
			if ( gameConfigVersionField != null )
				gameConfigVersion = gameConfigVersionField.Value as String;

			var localUtil : LocaleUtil = LocaleUtil.getInstance();
			localUtil.UpdateConfigFileFromURL(gameConfigDownloadURL, gameConfigVersion);
		}
	}

	//loading.SetMessage(Datas.instance().getArString("Loading.Connect_Server"));

	/*------------------------------------------------------------*/
	/*   TA 数据统计 上传数据时的时间戳 校验 （毫秒时间戳） */
	var curTime: long = _Global.INT32(result["restime"]) * 1000L;
	ThinkingAnalyticsManager.Instance.CalibrateTime(curTime);


	/* 取消登录 / 退出当前账号的登录状态 */
	ThinkingAnalyticsManager.Instance.ClearAccountID();
	/* 清除缓存中的公共属性 */
	ThinkingAnalyticsManager.Instance.ClearSuperProperties();



	/* 设置 游客 ID */
	ThinkingAnalyticsManager.Instance.SetDistinctID(Datas.instance().GetTADeviceId());


	currentGameDate = System.DateTime.UtcNow;

	if (result.Contains("gameNumber")) {
		var timeStamp: long = _Global.INT64(result["gameNumber"].Value.ToString());
		if (timeStamp != 0) {
			currentGameDate = (new System.DateTime(1970, 1, 1, 0, 0, 0, 0)).AddMilliseconds(timeStamp);
		}
	}


	/* 事件：设备首次激活时上报 */
	var prop = new System.Collections.Generic.Dictionary.<String, System.Object>();
	prop.Add("device_activate_time", currentGameDate);
	ThinkingAnalyticsManager.Instance.TrackFirstEvent("device_activate",Datas.instance().GetTADeviceId(), prop);


	/*------------------------------------------------------------*/

	StartCoroutine("serverTimeOk", result);
}



private function firstGetServerTimeError(errorMsg:String, errorCode:String){
//	_Global.Log("GetSeedError:" + errorMsg);
	retryDlg(errorMsg, errorCode, function(){
		var localUtil : LocaleUtil = LocaleUtil.getInstance();
		UnityNet.reqServerTime(firstGetServerTimeOk, firstGetServerTimeError, localUtil.ConfigFileVersion);
	});
}



private function serverTimeOk(result:HashObject){

	loading.setLoadPercent(70);
	yield;
//	checkString();
//	yield;
	gameTime = _Global.parseTime( result["restime"] );
	timeKind = _Global.GetString( result["timekind"] );
	var gameNumber:long = _Global.INT64(result["gameNumber"]);
	UnityNet.initGameNumber( gameNumber );



	if (Datas.instance().getMobileLoadBI() < 10001002) {
		UnityNet.SendBI(Constant.BIType.FTE,100,10001002);
		Datas.instance().setMobileLoadBI(10001002);
	}

	if(result["pKey"])
	{
		var arr:char[] = UnityNet.getMD5Hash(result["pKey"].Value).ToCharArray();
		arr.Reverse(arr);
		Datas.instance().SetDecodeKey(new String(arr));
		encrypt = result["encrypt"].Value;
	}

	UnityNet.signup( -1, signupOk,signupError);
}

function Signup()
{
	UnityNet.signup(-1, signupOk,signupError);
}


private function AddMapCtrToDic(key: int, controller: GestureController) {
	if (!mapControllerDic.ContainsKey(key))
		mapControllerDic.Add(key, controller);
	else
		mapControllerDic[key] = controller;
}

public function onLevelLoaded(level:int, controller:GestureController){

	LoadingProfiler.Instance.EndTimer("Load GameMain");

	loadedLevel[level] = true;
	loadingLevel[level] = false;

	switch(level)
	{
		case CITY_SCENCE_LEVEL:
			cityController = controller;
			AddMapCtrToDic(level, controller);

			HeroManager.Instance().Check(true);
			break;
		case FIELD_SCENCE_LEVEL:
			fieldController = controller;
			AddMapCtrToDic(level, controller);

			break;
		case WORLD_SCENCE_LEVEL:
			mapController = controller;
			AddMapCtrToDic(level, controller);

			mapController.search( mapInitCenterX, mapInitCenterY );
			mapController.setTipBar(GameObject.Find("InfoTipsBar").GetComponent.<InfoTipsBar>(), 3.0f);
			break;
		case AVA_MINIMAP_LEVEL:
			mapController2 = controller;
			AddMapCtrToDic(level, controller);

			mapController2.search(Constant.Map.AVA_MINIMAP_WIDTH / 2, Constant.Map.AVA_MINIMAP_HEIGHT / 2);
			mapController2.setTipBar(GameObject.Find("InfoTipsBar").GetComponent.<InfoTipsBar>(), 3.0f);
			break;
		case CAMPAIGNMAP_SCENE_LEVEL:
			campaignMapController = controller;
			AddMapCtrToDic(level, controller);

			campaignMapController.OnEnterScene();
			break;
		case CHAPTERMAP_SCENE_LEVEL:
			chapterMapController = controller;
			AddMapCtrToDic(level, controller);

			break;
	    case HERO_EXPLORE_LEVEL:
			heroExploreController = controller;
			AddMapCtrToDic(level, controller);

	        break;
		case ALLIANCE_BOSS_LEVEL:
			allianceBossController = controller;
			AddMapCtrToDic(level, controller);

			break;
		case MISTEXPEDITION_LEVEL:
			mistExpeditionMapController = controller;
			AddMapCtrToDic(level, controller);
			break;
	}

	if( comeFromLoading ){
//		comeFromLoading = false;

		loading.setLoadPercent(100);
		bCanGCAuth = true;
		while( !loading.finished()){
			yield;
		}

		PushPlugin.getInstance().ClearLocalNotification();

		KBN.LoadingTimeTracker.Instance.EndTracking();

		if (!PrivacyPolicyMenu.IsPrivacyPolicyServiced())
			MenuMgr.getInstance().PushMenu("PrivacyPolicyMenu", null, "trans_zoomComp");

		var wait_1 = new WaitForSeconds(1);
		while (!PrivacyPolicyMenu.IsPrivacyPolicyServiced())
			yield wait_1;


		Destroy(loadingCameraObj);
		loadingCameraObj = null;
		loading = null;

		if( Datas.GetPlatform() != Datas.AppStore.Amazon ){
			var AmzonIAPMgr:GameObject = GameObject.Find("AmazonIAPManager");
			Destroy(AmzonIAPMgr);
			AmzonIAPMgr = null;
		}

		_Global.Log("[GameMain onLevelLoaded] Push MainChrom");
		MenuMgr.getInstance().PushMenu("MainChrom", null, "trans_immediate");
		m_isPushedMainChrome = true;

		fte_startFTE();

		LevelUp.instance().check();
		//if(fteMgr.isFinished)
		PlaySceneMusic(level);
		if(_Global.INT32(seed["impeachNotice"].Value.ToString()) == 1)
		{
		   var errorMessage : String = Datas.getArString("Alliance.Impeachprompt");
		   ErrorMgr.singleton.PushError("", errorMessage, true, Datas.getArString("Common.OK"), null);
		}

		if(isForceServerMerge() == 1)
		{
		   MenuMgr.getInstance().MainChrom.OpenServerMerge();
		}

		if(seed["logBack"]!=null&&_Global.ToBool(seed["logBack"]))
		{
			ErrorMgr.instance().PushError("",Datas.getArString("ClearingNotice.Email"));
		}

		PassMissionMapManager.Instance().InitPassMissionMap(seed);
		PassMissionMapManager.Instance().InitMapData(seed);

		this.sendRemotePushToken();
		this.sendPushBI(null);

	}


	setScenceLevel(level);
	if(comeFromLoading){

		ParticalEffectMgr.getInstance().init();

		if(seed["serverSetting"]["effectOpen"])
		{
			var openEffect:boolean = _Global.INT32(seed["serverSetting"]["effectOpen"]) ? true : false;
			ParticalEffectMgr.getInstance().setEffectEnable(openEffect);
		}


		comeFromLoading = false;
		deltaTime = Time.realtimeSinceStartup - deltaTime;
		gameTime += deltaTime;

		var loadTime:long = Time.realtimeSinceStartup - backgroundTime;
		var param:Array = new Array();
		param.Add(Datas.instance().getLoginCnt());
		param.Add(loadTime + "");
		param.Add(KBN.FTEMgr.isUserStartFTE( Datas.instance().tvuid(), Datas.instance().worldid() )?0:1);
		param.Add(Application.internetReachability == NetworkReachability.ReachableViaCarrierDataNetwork ? 1: 0);
		UnityNet.loginSuccess( param, null, null );
		Datas.instance().setLoginCnt(0);//clear

		InvokeRepeating("secondUpdate",1,1);

		Invoke( "reportSavedErrorToServer", 10 );
		Invoke( "recoverBuyObserver", 15 );

		this.FreeRAM();

/*		if( rainMgr != null ){
//			rainMgr.SetDisable(true);
//		}
*/
	}

}

private function recoverPaymentObserver(result:HashObject){
	if( Datas.GetPlatform() == Datas.AppStore.Amazon ){
		AmazonPayment.getInstance().recoverPayment();
	}else{
		NativeCaller.ItunesCheckPackages();
	}
//	NativeCaller.RecoverPaymentObserver();
}

private function reportSavedErrorToServer(){

	var	localError:String = Datas.instance().getErrorLog();
	if( !localError || localError.length <= 0 ){
		return;
	}
	UnityNet.reportErrorToServer( "CLIENT_SAVED_ERROR_LOG", null, null,  localError, false);

}

//signup
function signupOk(result:HashObject)
{
	var loginType:String = "";
	if(Application.platform == RuntimePlatform.Android)
	{
		loginType = "Google";
	}
	else if (RuntimePlatform.IPhonePlayer == Application.platform)
	{
		loginType = "appstore";
	}
	NativeCaller.GaeaLogin(_Global.GetString(result["tvuid"]), loginType);

	StartCoroutine("afterSignup",result);

}

private var m_protobuffSwitch : boolean;
public function get UseProtoBuffer() : boolean
{
	return m_protobuffSwitch;
}

private	function afterSignup(result:HashObject){
	//ServerMerge

	if(result["serverMergeMsg"] != null)
	{
		ServerMergeStep = _Global.INT32(result["serverMergeMsg"]["serverMergeStep"]);
		FromServerName = _Global.GetString(result["serverMergeMsg"]["fromServerName"]);
		if(ServerMergeStep == 0)
		{
			ErrorMgr.instance().PushError("", Datas.getArString("MergeServer.Confirm_Wait"),false,Datas.getArString("FTE.Restart"),restartGame);
		}
	}

    if (result["loginTime"] != null)
    {
        DailyLoginRewardMgr.Instance.UpdateLogin(_Global.INT32(result["loginTime"]["dayInMonth"]),
            _Global.GetBoolean(result["loginTime"]["firstTimeToday"]),
            _Global.GetBoolean(result["loginTime"]["autoPopup"]));
    }

	if(result["fteFilterGDS"] != null)
	{
		m_bNeedCheckString = (_Global.INT32(result["fteFilterGDS"]["stringUpgrade"]) != 0);
		m_bNeedCheckGDSVersion = (_Global.INT32(result["fteFilterGDS"]["gdsVersion"]) != 0);
	}

	var worldIdArray:HashObject = result["worldid"];
	var worldid:int = _Global.INT32(worldIdArray[_Global.ap + 0]);
	var tvuid:int = _Global.INT32(result["tvuid"]);
	var theme:int = _Global.INT32(result["theme"]);
	var mstryChestLoadType : int = _Global.INT32(result["mystryChestLoadType"]);
	var mystryChestDataType : int = _Global.INT32(result["mystryChestDataType"]);
	var protobuffSwitch : int = _Global.INT32(result["protobuffswitch"]);
	if ( protobuffSwitch == 0 )
		m_protobuffSwitch = true;
	else
		m_protobuffSwitch = false;

	m_RaterParams = result["rateActive"];
	var datas:Datas = Datas.instance();

	if( theme != datas.getGameTheme() ){
		datas.setGameTheme( _Global.INT32(result["theme"]) );
		//_Global.Log("gameTheme:" + theme);
		datas.loadStringsFromLocal();
	}
	//after get game theme, textureMgr init spt

//	var startTime:System.DateTime = System.DateTime.Now;

	if(m_bNeedCheckString)
		checkString();
	//_Global.Log("$$$$$  After checkString : " + (System.DateTime.Now - startTime).TotalMilliseconds);

	var assetBundleMgr:AssetBundleManager = AssetBundleManager.Instance();
	KBN.Game.Event.RegisterHandler(KBN.EventId.DownloadCheckFailure, OnDownloadCheckFailure);
	KBN.Game.Event.RegisterHandler(KBN.EventId.DownloadFailure, OnDownloadFailure);
	assetBundleMgr.ReqResourceList();
	while ( !assetBundleMgr.BundleListReady || !assetBundleMgr.CheckAllAssetBundlesDownloadSuccess() )
	{
		yield;
	}
	//assetBundleMgr.LoadAllAssetBundles();
	loading.setLoadPercent(75);
	//_Global.Log("$$$$$  After AssetBundleManager LoadAllAssetBundles: " + (System.DateTime.Now - startTime).TotalMilliseconds);
	TextureMgr.instance().ReInitSpt();
//	yield;

	//init base url by setting worldid
	UnityNet.setWorldId(worldid);
	NativeCaller.RequestTapjoyConnect(LocaleUtil.TapjoyHash);
	AndroidChat.SetBackendHeight(_Global.INT32(result["androidHeight"]));

//	_Global.Log("worldid:" + worldid + " tvuid:" + tvuid);
//	NativeCaller.SetTapJoyTVUID(tvuid.ToString());
	//save tvuid
	datas.setTvuid(tvuid);
	datas.setWorldid(worldid);
	datas.SaveServerDataForClient(result);
	datas.SycDataVersionFromPlayerPrefs();
	//removed in 18.5.0 Gaea
//	TrackNanigansInstallOrVisit(Datas.instance().getNaid());

	/* removed in 18.5.0 --begin
	KBNSODA.Instance.Parse(result["soda"],result["tvuid"]);
	KBNSODA.Instance.Initialize();
	KBNSODA.Instance.Login();
	//init gds  must in main thread
	//InstanceGDS();
	--end */

	MystryChest.instance().LoadType = mstryChestLoadType;
	MystryChest.instance().DataType = mystryChestDataType;
	MystryChest.instance().InitWithSync();
	if(m_bNeedCheckGDSVersion)
	{
		//_Global.Log("$$$$$  After checkGdsVersion---> : " + (System.DateTime.Now - startTime).TotalMilliseconds);
		checkGDSVersion();
	}
	else
	{
		Datas.instance().loadDataFromLocal();
		gdsManager.LoadGdsesOfCategoryFromLocal(GdsCategory.Default);
	}
	if(!Message.getInstance().CheckSqlVersion()){
		Datas.instance().clearMailAndReport();//clear chche file
	}
	Message.getInstance().SetMessageReady();
	UnityNet.setReportNormalErrorToServer(result["logSwitcher"] == null ? true : result["logSwitcher"].Value);
	signupOver = true;

	if(datas.IsBecomeUser() && result["mobileid"] != null)
	{
		UnityNet.changeMobileId(result["mobileid"].Value);	/* if null use old one. become user will be invalid*/
	}

	/*	_Global.Log("signupOk uid:" + tvuid + " worldid:" + worldid + " Datas.instance().getUserLoadBI():" + Datas.instance().getUserLoadBI());*/
	if( datas.getUserLoadBI() < 10001003 ){
		UnityNet.SendBI(Constant.BIType.FTE,100,10001003);
		datas.setUserLoadBI(10001003);
	}



	/*request Seed*/
	UnityNet.getSeed(tvuid, getSeedOk, getSeedError);

	/*------------------------------------------------------------*/

	/* 缓存玩家的等级 */
	if (result != null && result.Contains("Title")) {
		Datas.instance().SetPlayerCurrentLevel(_Global.INT32(result["Title"]));
	}
	

	/* 缓存玩家是否是首次购买道具 */
	if (result != null && result.Contains("FirstBuy")) {
		Datas.instance().SetPlayerFirstBuyState(_Global.GetBoolean(result["FirstBuy"]));
	}




	/* 设置公共属性 */
	var prop  = new System.Collections.Generic.Dictionary.<String, System.Object>();

	/* 渠道 */
	#if UNITY_ANDROID
	prop.Add("channel", "google");
	#elif UNITY_IOS
	prop.Add("channel", "appstore");	
	#endif
	/* 区服id */
	prop.Add("server_id", worldid);
	/* 玩家账号id */
	prop.Add("userId", tvuid);


	var uuid = "";
	if (result.Contains("Uuid"))
		uuid = result["Uuid"].Value.ToString();



	if (result.Contains("gameNumber")) {
		var timeStamp : long = _Global.INT64(result["gameNumber"].Value.ToString());
		if (timeStamp != 0) {
			currentGameDate = (new System.DateTime(1970, 1, 1, 0, 0, 0, 0)).AddMilliseconds(timeStamp);
		}
		else
			currentGameDate = System.DateTime.UtcNow;

	}

	if (currentGameDate == null) {
		currentGameDate = System.DateTime.UtcNow;
	}

	#if UNITY_EDITOR
	Debug.Log("<color=#00ff88ff>uuid-------++++++++++ <" + uuid + "> +++++++++++----</color>");
	#endif

	/* 设置账户 ID */
	ThinkingAnalyticsManager.Instance.SetAccountID(uuid);

	/* 如果 没有游客id，再次设置上  */
	if (String.IsNullOrEmpty(ThinkingAnalyticsManager.Instance.GetDistinctId()))
		ThinkingAnalyticsManager.Instance.SetDistinctID(Datas.instance().GetTADeviceId());



	/* 设备ID */
	prop.Add("device_id", Datas.instance().GetTADeviceId());
	ThinkingAnalyticsManager.Instance.SetSuperProperties(prop);

	/* 动态设置  玩家的等级 公共属性 */
	ThinkingAnalyticsManager.Instance.SetDynamicSuperProperties(new ThinkingAnalyticsManager_DynamicPlayerLevelProp());



	/* 开启自动收集事件 */
	ThinkingAnalyticsManager.Instance.EnableAutoTrack(true);


	/*
	 *账号注册时间
	 */
	var newAccountDate: System.DateTime = currentGameDate;
	if (result != null && result.Contains("register_time")) {
		var timeStamp2: long = _Global.INT64(result["register_time"].Value.ToString());
		if (timeStamp2 != 0) {
			newAccountDate = (new System.DateTime(1970, 1, 1, 0, 0, 0, 0)).AddMilliseconds(timeStamp2);
		}
	}
	prop = new System.Collections.Generic.Dictionary.<String, System.Object>();
	prop.Add("register_time", newAccountDate);/* 账号注册时间 */
	ThinkingAnalyticsManager.Instance.SetUserPropertyOnce(prop);


	/*
	 * 角色创建时间
	 */
	var newRoleDate: System.DateTime = currentGameDate;

	if (result != null && result.Contains("role_create_time")) {
		var timeStamp3: long = _Global.INT64(result["role_create_time"].Value.ToString());
		if (timeStamp3 != 0) {
			newRoleDate = (new System.DateTime(1970, 1, 1, 0, 0, 0, 0)).AddMilliseconds(timeStamp3);
		}
	}

	prop = new System.Collections.Generic.Dictionary.<String, System.Object>();
	prop.Add("role_create_time", newRoleDate);/* 角色创建时间 */
	ThinkingAnalyticsManager.Instance.SetUserPropertyOnce(prop);


	/* 用户属性：玩家最后登录 时间戳 */
	prop = new System.Collections.Generic.Dictionary.<String, System.Object>();
	prop.Add("last_login_time", currentGameDate);/* 最后登录时间 */
	ThinkingAnalyticsManager.Instance.SetUserProperty(prop);

	/*------------------------------------------------------------*/



	/* MystryChest.instance().Init(); */

	/*
	//remove in 18.5.0 Gaea --- begin
	var otherLevels : HashObject = result["otherLevels"];
	if ( otherLevels != null )
	{
		var appKey : String = otherLevels["appKey"].Value as String;
		var channelKey : String = otherLevels["channelKey"].Value as String;
		var authKey : String = otherLevels["authKey"].Value as String;
		var userInfoKey : String = otherLevels["userInfoKey"].Value as String;

		NativeCaller.DoResetOtherLevelsAppKey(appKey, channelKey, authKey,userInfoKey);
		NativeCaller.DoLinkOtherLevelsTrackingId(userInfoKey, worldid);
	}
	//--- remove in 18.5.0 Gaea end
	*/



}


/* 动态设置 玩家等级 */
public class ThinkingAnalyticsManager_DynamicPlayerLevelProp implements ThinkingAnalyticsManager.IDynamicSuperProperties {
	public function GetDynamicSuperProperties(): System.Collections.Generic.Dictionary.<String, System.Object> {
		var prop = new System.Collections.Generic.Dictionary.<String, System.Object>();
		prop.Add("level_current", Datas.instance().GetPlayerCurrentLevel());
		return prop;
	}
}
	

private function TrackNanigansInstallOrVisit(id : String)
{
    var fbAppId : String = LocaleUtil.NanigansHash[NativeCaller.NanigansBoost.APPID];
    if(Datas.IsFirstNanigansInstall())
    {
        NativeCaller.TrackNanigansInstall(id, fbAppId);
        Datas.SetNanigansInstallFlag();
    }
    else
    {
        NativeCaller.TrackNanigansVisit(id, fbAppId);
    }
}

/********************************************************************************************************

 FTE Part.
***********************************************************************************************************/

function fte_checkDataStatus():void
{

}

//call by KBN.FTEMgr.
function OnFTEInited():void
{
//	fteMgr.startFTE();
//modify seed.
	StartCoroutine(init());

//	fteMgr.firstInitStep();

//	initOver = true;
}

private function get ShouldShowChartboostInterstitial() : boolean
{
    return shouldShowChartboostInterstitial;
}

function OnFTEComplete(didFTE:boolean):void
{
	//after fte , city pos maybe changed
	mapInitCenterX = _Global.INT32(currentcityinfo[_Global.ap + 2]);
	mapInitCenterY = _Global.INT32(currentcityinfo[_Global.ap + 3]);

    if (ShouldShowChartboostInterstitial)
    {
	    NativeCaller.ChartboostShowInterstitial(LocaleUtil.ChartboostHash);
	}

	invokeUpdateSeedInTime(30);

	didFTE |= NewFteMgr.Instance().IsForbidMenuEvent;
	if( didFTE ){
		NativeCaller.TrackAction("FTEOver");
		NativeCaller.TrackFTEComplete();
		NativeCaller.RoleCreate(Datas.instance().tvuid().ToString(), Datas.instance().worldid().ToString());
		NativeCaller.SetRoleLevel(2, Datas.instance().tvuid().ToString());
	}
	else
	{
		Invoke("OpenShareMenu",2);
		NativeCaller.RoleLogin(Datas.instance().tvuid().ToString(), Datas.instance().worldid().ToString(),KBN.KBNPlayer.instance.getTitle());
	}

	if(didFTE && Datas.instance().getKabamId() == 0)
	{
		priv_showKabamID(1);
		Invoke("FreeRAM",3);
		PlaySceneMusic(curScenceLevel);
		Datas.instance().setFteEndTime(System.DateTime.Now.Ticks);

	}
	else
	{

		Invoke("priv_openGamble", 2);	//no need for gc.
//		OpenGamble();
        if (CheckAndShowPaymentOffer())
        {
            // Empty
        }
		else if( needPopupKabamId() )
		{
			priv_showKabamID(2);
		}
		else
		{
			GameCenterAuthor();
		}
	}

    Invoke("OpenDailyLoginRewardMenuIfNeeded", 2);

    Invoke("OpenBuyPeacePopMenuIfNeeded", 3);
    Invoke("OpenServerMergeWelComeMenu", 2);
//	MenuMgr.getInstance().InventoryMenu.loadShopData();
	Shop.instance().getShopData(successGetShopData, true);

	if(Application.platform == RuntimePlatform.Android)
		PlayerPrefs.SetInt(Constant.NativeDefine.KMP_PUSH_NOTIFICATION,15);

	CheckAndOpenRaterAlert(m_RaterParams,"start");

	Quests.instance().createDisplayInfor();
}


private var m_showKabamID_BIPosition : int = -1;
private var m_isHaveTOSCheck : boolean = false;
private var m_tosCheckValue : boolean = false;
private function priv_showKabamID(biID : int)
{
	m_showKabamID_BIPosition = biID;
	priv_doShowKabamID();
}


private function priv_doShowKabamID()
{
	if ( !m_isHaveTOSCheck || m_showKabamID_BIPosition < 0 )
		return;
	OpenPlayerSetting();
    MenuAccessor.SetKabamIdBIPosition(m_showKabamID_BIPosition);
}


public function DoAfterTOSCheck(isPopTOS : boolean)
{
	m_tosCheckValue = isPopTOS;
	m_isHaveTOSCheck = true;
	priv_doShowKabamID();
}

private function successGetShopData():void
{
	var shop:Shop = Shop.instance();
	if(shop.HasDiscountItem(Shop.SPEEDUP) || shop.HasDiscountItem(Shop.GENERAL) || shop.HasDiscountItem(Shop.ATTACK)
		|| shop.HasDiscountItem(Shop.PRODUCT) || shop.HasDiscountItem(Shop.CHEST))
	{
		MenuMgr.getInstance().MainChrom.chromBtnShop.lblIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_icon_shop2",TextureType.BUTTON);
	}
	else
	{
		MenuMgr.getInstance().MainChrom.chromBtnShop.lblIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_icon_shop",TextureType.BUTTON);
	}
}

public function OpenShareMenu()
{
	if(migrateState()>0) return;
	var setting:HashObject = new HashObject({"lv1":{"sessionCount":3,"shareCount":9999999},"lv2":{"sessionCount":10,"shareCount":3},"lv3":{"sessionCount":25,"shareCount":3},"lv4":{"sessionCount":50,"shareCount":3}});
	if(Datas.instance().sharePopSetting() != null)
	{
		setting = Datas.instance().sharePopSetting();
	}
	var shareCount:int = Datas.instance().getShareCnt();
	var sessionCount:int = Datas.instance().getSessionCnt();

	var last3ShareSessions:int = Datas.instance().getLast3ShareSessions();
	var lastPopupShareSession:int = Datas.instance().getLastPopupShareSession();
	var popupInterval:int = Datas.instance().getPopupShareMenuInterval();

	var isPop:boolean = false;

	var lvCount:int = _Global.GetObjectKeys(setting).length;
	if(lvCount > 0)
	{
		if(sessionCount < Constant.BEGINNER_SESSIONS)
		{
			//beginner
			var beginnerShare:int = _Global.INT32(setting["lv"+1]["shareCount"]);
			var beginnerSession:int = _Global.INT32(setting["lv"+1]["sessionCount"]);
			if(sessionCount >= beginnerSession)
			{
				if((sessionCount % beginnerSession) == 0)
				{
					isPop = true;
				}
			}
		}
		else
		{
			for(var lv:int = lvCount;lv >= 1;lv--)
			{
				var lvShare:int = _Global.INT32(setting["lv"+lv]["shareCount"]);
				var lvSession:int = _Global.INT32(setting["lv"+lv]["sessionCount"]);
				if((sessionCount - last3ShareSessions) >= lvSession)
				{
					if(lvSession > popupInterval)
					{
						popupInterval = lvSession;
						Datas.instance().setLastPopupShareSession(sessionCount);
						Datas.instance().setPopupShareMenuInterval(popupInterval);
						isPop = true;
						break;
					}
					else if((sessionCount - lastPopupShareSession) >= popupInterval)
					{
						Datas.instance().setLastPopupShareSession(sessionCount);
						isPop = true;
						break;
					}
				}
			}
		}
		var joinTime:long = getJoinTime();
		var lastPopTimeSpan:System.TimeSpan = System.TimeSpan( joinTime*System.TimeSpan.TicksPerSecond);
		var curTimespan:System.TimeSpan = System.TimeSpan( unixtime()*System.TimeSpan.TicksPerSecond);
		if(curTimespan.TotalDays - lastPopTimeSpan.TotalDays < 7.0)
		{
			isPop = false;
		}


		if(isPop && !isShareDlgOpened)
		{
			isShareDlgOpened = true;

			var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
			dialog.menuName = "SharePopup";
			dialog.setLayout(600,380);
			dialog.setTitleY(60);
			dialog.setContentRect(70,120,0,120);
			MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("Share.InvitePopup"),"",shareOkClick,shareCancelClick);
			dialog.setDefaultButtonText();

			if (dialog.btnClose)
			{
				dialog.btnClose.OnClick = shareCloseBtnClick;
			}

		}
	}

}
private function shareOkClick()
{
	MenuMgr.getInstance().PopMenu("");
	MenuMgr.getInstance().PushMenu("ShareMenu", null);

	isShareDlgOpened = false;
}

private function shareCancelClick()
{
	MenuMgr.getInstance().PopMenu("");
	isShareDlgOpened = false;
}

private function shareCloseBtnClick()
{
	MenuMgr.getInstance().PopMenu("");
	isShareDlgOpened = false;
}

private function CheckAndShowPaymentOffer() : boolean
{
    var offerToShow : PaymentOfferData = PaymentOfferManager.Instance.GetOfferForAutoPopup();

    // No offer to show
    if (offerToShow == null)
    {
        return false;
    }

    StartCoroutine("ShowPaymentOfferWithDelay", offerToShow);
}

private function ShowPaymentOfferWithDelay(offerToShow : PaymentOfferData) : IEnumerator
{
    yield new WaitForSeconds(3);
    var offerMenuName : String = "OfferPopMenu";
    if (MenuMgr.getInstance().hasMenuByName(offerMenuName))
    {
        return;
    }
    var currentUnixTime : long = unixtime();
    var currentTime : DateTime = new DateTime(currentUnixTime * TimeSpan.TicksPerSecond);
    var lastTime : DateTime = new DateTime(Datas.instance().LastTimeToShowPaymentOffer * TimeSpan.TicksPerSecond);
    if (currentTime.Date <= lastTime.Date)
    {
        return;
    }

    Datas.instance().LastTimeToShowPaymentOffer = currentUnixTime;
    Payment.instance().setCurNoticeType(offerToShow.Type);
    MenuMgr.getInstance().PushMenu(offerMenuName, offerToShow, "trans_zoomComp");
     //MenuMgr.getInstance().PushMenu(offerMenuName,{"offerPage" : Constant.OfferPage.Offer, "data" : offerToShow},"trans_zoomComp");
     //MenuMgr.getInstance().PushMenu(offerMenuName, Constant.OfferPage.Offer, "trans_zoomComp");
}

private function PlaySceneMusic(level:int)
{
	try
	{
		switch(level)
		{
			case CITY_SCENCE_LEVEL:
				SoundMgr.instance().PlayMusic("KoCM_Field_Loop", false, /*TextureType.AUDIO*/"Audio/");
				setCurMusicName("KoCM_Field_Loop", /*TextureType.AUDIO*/"Audio/");
				setLastMusicName("KBN_forest_loop", /*TextureType.AUDIO*/"Audio/");
				setLoopCntOfCurMusic(1);
				break;
			case FIELD_SCENCE_LEVEL:
				SoundMgr.instance().PlayMusic("KoCM_Field_Loop", false, /*TextureType.AUDIO*/"Audio/");
				setCurMusicName("KoCM_Field_Loop", /*TextureType.AUDIO*/"Audio/");
				setLastMusicName("KBN_forest_loop", /*TextureType.AUDIO*/"Audio/");
				setLoopCntOfCurMusic(1);
				break;
			case AVA_MINIMAP_LEVEL:
				SoundMgr.instance().PlayMusic("kbn_desertmap_music_final", false, /*TextureType.AUDIO*/"Audio/Ava/");
				setCurMusicName("kbn_desertmap_music_final", /*TextureType.AUDIO*/"Audio/Ava/");
				setLastMusicName("KBN_forest_loop", /*TextureType.AUDIO*/"Audio/");
				setLoopCntOfCurMusic(0);
				break;
			case WORLD_SCENCE_LEVEL:
				SoundMgr.instance().PlayMusic("KoCM_Map_Loop", false, /*TextureType.AUDIO*/"Audio/");
				setCurMusicName("KoCM_Map_Loop", /*TextureType.AUDIO*/"Audio/");
				setLastMusicName("KBN_forest_loop", /*TextureType.AUDIO*/"Audio/");
				setLoopCntOfCurMusic(1);
				break;
			case CAMPAIGNMAP_SCENE_LEVEL:
				if(KBN.PveController.instance().GetActivHidenBossNum()>0)
				{
					SoundMgr.instance().PlayMusic("PVE World Map 2",false, TextureType.AUDIO_PVE);
					setCurMusicName("PVE World Map 2",TextureType.AUDIO_PVE);
					setLastMusicName("KBN_forest_loop",TextureType.AUDIO);
					setLoopCntOfCurMusic(1);
				}
				else
				{
					SoundMgr.instance().PlayMusic("PVE World Map 1",false, TextureType.AUDIO_PVE);
					setCurMusicName("PVE World Map 1",TextureType.AUDIO_PVE);
					setLastMusicName("KBN_forest_loop",TextureType.AUDIO);
					setLoopCntOfCurMusic(1);
				}
				break;
			case CHAPTERMAP_SCENE_LEVEL:
				switch(m_curChapterId%4)
				{
				case 0:
					SoundMgr.instance().PlayMusic("PVE Chapter1 Mountain",false, TextureType.AUDIO_PVE);
					setCurMusicName("PVE Chapter1 Mountain", TextureType.AUDIO_PVE);
					break;
				case 1:
					SoundMgr.instance().PlayMusic("PVE Chapter2 Grassland", false, TextureType.AUDIO_PVE);
					setCurMusicName("PVE Chapter2 Grassland", TextureType.AUDIO_PVE);
					break;
				case 2:
					SoundMgr.instance().PlayMusic("PVE Chapter3 Coastline", false, TextureType.AUDIO_PVE);
					setCurMusicName("PVE Chapter3 Coastline", TextureType.AUDIO_PVE);
					break;
				case 3:
					SoundMgr.instance().PlayMusic("KBN_Holy_Irish_loop", false, TextureType.AUDIO_PVE);
					setCurMusicName("KBN_Holy_Irish_loop", TextureType.AUDIO_PVE);
					break;
				}
				setLastMusicName("KBN_forest_loop", TextureType.AUDIO);
				setLoopCntOfCurMusic(1);
				break;
			case HERO_EXPLORE_LEVEL:
				SoundMgr.instance().PlayMusic("HeroExplore", false, /*TextureType.AUDIO_HERO*/"Audio/Hero/");
				setCurMusicName("HeroExplore", /*TextureType.AUDIO_HERO*/"Audio/Hero/");
				setLastMusicName("KBN_forest_loop", /*TextureType.AUDIO*/"Audio/");
				setLoopCntOfCurMusic(1);
				break;
			case ALLIANCE_BOSS_LEVEL:
				SoundMgr.instance().PlayMusic("kbn ally dungeon 1.1 cave",false, TextureType.AUDIO_PVE);
				setCurMusicName("kbn ally dungeon 1.1 cave",TextureType.AUDIO_PVE);
				setLastMusicName("KBN_forest_loop", TextureType.AUDIO);
				setLoopCntOfCurMusic(1);
				break;
		}
	}
	catch (error: System.Exception) {
		UnityNet.reportErrorToServer("GameMain.PlaySceneMusic", null, "Client Exception", error.Message, false);
	}
}

public function SwitchMusicLogic()
{
	if(!SoundMgr.instance())
	{
		return;
	}
	if( !SoundMgr.instance().IsMusicPlaying() )
	{
		if(getLoopCntOfCurMusic() > 1)
		{
			setLoopCntOfCurMusic(getLoopCntOfCurMusic()-1);
			SoundMgr.instance().PlayMusic(curMusicName, false, curMusicOTAType);
		}
		else
		{
			if( getCurMusicName() == "kbn_desertmap_music_final" ) {
				SoundMgr.instance().PlayMusic( "kbn_desertmap_ambient_final", false, "Audio/Ava/" );
				setCurMusicName("kbn_desertmap_ambient_final", "Audio/Ava/");
				setLastMusicName("kbn_desertmap_ambient_final", "Audio/Ava/");
				setLoopCntOfCurMusic(4);
			} else if( getCurMusicName() == "kbn_desertmap_ambient_final" ) {
				SoundMgr.instance().PlayMusic( "kbn_desertmap_music_final", false, "Audio/Ava/" );
				setCurMusicName("kbn_desertmap_music_final", "Audio/Ava/");
				setLastMusicName("kbn_desertmap_music_final", "Audio/Ava/");
				setLoopCntOfCurMusic(0);
			} else {

				var lastMusic:String = getLastMusicName();
				setLastMusicName(getCurMusicName(), curMusicOTAType);
				setCurMusicName(lastMusic, lastMusicOTAType);
				SoundMgr.instance().PlayMusic(lastMusic, false, lastMusicOTAType);
				if (getCurMusicName()=="KoCM_Field_Loop" || getCurMusicName()=="KoCM_Map_Loop" || getCurMusicName()=="HeroExplore")
				{
					setLoopCntOfCurMusic(1);
				}
				else if( getCurMusicName() == "kbn_desertmap_music_final" )
				{
					setLoopCntOfCurMusic(0);
				}
				else if( getCurMusicName() == "kbn_desertmap_ambient_final" )
				{
					setLoopCntOfCurMusic(4);
				}
				else
				{
					var randCnt:int = Random.Range(3,5);
					setLoopCntOfCurMusic(randCnt);
				}
			}
		}
	}
}

public function FreeRAM():void
{
	Resources.UnloadUnusedAssets();
	System.GC.Collect();
}


private function priv_openGamble():void
{
	var seed:HashObject = GameMain.instance().getSeed();
	if ( _Global.INT32(seed["hasFreePlay"]) <= 0 )
		return;
	if ( seed["magicBoxCanPopup"] != null && _Global.INT32(seed["magicBoxCanPopup"]) == 0 )
		return;
	MenuMgr.getInstance().SwitchMenu("GambleMenu", null, true);
}


private function OpenDailyLoginRewardMenuIfNeeded() : void {
    if (DailyLoginRewardMgr.Instance.AutoPopup
        && DailyLoginRewardMgr.Instance.FirstLoginToday
        && !DailyLoginRewardMgr.Instance.AllClaimed) {
        DailyLoginRewardMgr.Instance.UpdateDataAndOpenMenu();
    }
}

private function OpenServerMergeWelComeMenu():void
{
	if(ServerMergeStep == 1)
	{
		MenuMgr.getInstance().PushMenu("ServerMergeWelcomeMenu", FromServerName, "trans_zoomComp");
	}
}

public function OpenBuyPeacePopMenuIfNeeded() : void
{
    var menuNameToOpen : String = "BuyPeacePopMenu";
    if (MenuMgr.getInstance().hasMenuByName(menuNameToOpen))
    {
        return;
    }

    if (seed == null)
    {
        return;
    }

    var buyPeaceNode : HashObject = seed["extendBeginnerProtection"];
    if (buyPeaceNode == null)
    {
        return;
    }

    MenuMgr.getInstance().PushMenu(menuNameToOpen, buyPeaceNode, "trans_zoomComp");
    seed.Remove("extendBeginnerProtection");
}

function OpenPlayerSetting():void
{
    MenuAccessor.OpenPlayerSetting(GameCenterAuthor);
}

function fte_checkFTE():void
{
	fteMgr.Init();
}

function fte_startFTE():void
{
	fteMgr.startFTE();
	MenuMgr.getInstance().MainChrom.RefreshCurrentMission();
}
function fte_preInitSeed():void
{


}

/*******************************************************************************
END OF FTE PART.

********************************************************************************/

private function GameCenterAuthor(){
	if( seed["serverSetting"] != null
		&& _Global.INT32(seed["serverSetting"]["gameCenterBindOpen"]) == 1 ){
		GameCenterHelper.Authenticate();
	}
}

public function GameCenter_AuthERROR(error:String)
{
	GameCenterHelper.SetEnable( false );
	_Global.Log("GameCenter_AuthERROR");
	Datas.instance().SetGameCenterPlayerId(String.Empty);
	Datas.instance().SetGameCenterAlias(String.Empty);

	MenuMgr.getInstance().sendNotification(Constant.Notice.GAMECENTER_ID_CHANGED,null);
}

public function GameCenter_AuthSuccess(success:String)
{
	var didFTE:boolean = NewFteMgr.Instance().IsForbidMenuEvent;
	if(didFTE) return;

	if(!bCanGCAuth) return;
	if( seed["serverSetting"] == null
		|| _Global.INT32(seed["serverSetting"]["gameCenterBindOpen"]) != 1 ){
		return;
	}


	_Global.Log("GameCenter_AuthSuccess");
	var playerIdBinded:String = Datas.instance().GetGameCenterPlayerId_Binded();
	var playerIdLast = Datas.instance().GetGameCenterPlayerId();
	var playerAliasBind = Datas.instance().GetGameCenterAlias_Binded();
	var index:int = success.IndexOf("\n");
	if(index < 0 || index >= success.Length) return;
	var playerIdAuth:String = success.Substring(0,index);
	var aliasAuth:String = success.Substring(index+1);

	Datas.instance().SetGameCenterPlayerId(playerIdAuth);
	Datas.instance().SetGameCenterAlias(aliasAuth);
	MenuMgr.getInstance().sendNotification(Constant.Notice.GAMECENTER_ID_CHANGED,null);

	if(playerIdAuth ==  playerIdBinded)
	{
//		GameCenterHelper.SyncGameCenter();
		if(aliasAuth != playerAliasBind)
		{
			Datas.instance().SetGameCenterAlias_Binded(aliasAuth);
		}
		GameCenterHelper.SyncGameCenterAchievement();
		return;
	}

	GameCenterHelper.SetEnable( false );
	var today:String = System.DateTime.Now.ToString("yyyyMMdd");
	if(playerIdAuth !=  playerIdLast)
	{
		PlayerPrefs.SetInt("gamecenter_bind_notice_count",0);
		PlayerPrefs.SetInt(today,0);
	}

	var count:int = PlayerPrefs.GetInt("gamecenter_bind_notice_count",0);
	if(count >= 3)
	{
		return;
	}

	if(PlayerPrefs.GetInt(today,0) == 1)
	{
		return;
	}
	else
	{
		PlayerPrefs.SetInt(today,1);
		PlayerPrefs.SetInt("gamecenter_bind_notice_count",count + 1);
	}
	CheckGameCenterIdForBind(null,playerIdAuth,aliasAuth);
}

public function CheckGameCenterIdForBind(callback:Function,playerIdAuth:String,aliasAuth:String)
{
	var check:Function = function(result:HashObject){
		var warning:String = Datas.getArString("GameCenter.LinkAccountWarning");
		var userIdOfGcId:int = _Global.INT32(result["tvuid"]);
		var creatGuest:boolean = false;
		var playerIdBinded:String = Datas.instance().GetGameCenterPlayerId_Binded();

		var confirm:Function = null;

		if(result["exists"].Value == false)
		{
			if(String.IsNullOrEmpty(playerIdBinded))
			{
				warning = Datas.getArString("GameCenter.LinkAccountWarning");
				confirm = function(){
					GameCenterHelper.bindGameCenterId(playerIdAuth,aliasAuth,callback);
				};
			}
			else
			{
				if(result["guestexists"] && result["guestexists"].Value == true)
				{
					warning = Datas.getArString("GameCenter.SwitchToGuestAccount");
				}
				else
				{
					warning = Datas.getArString("GameCenter.IDHasChanged");
				}
				confirm = function(){
					GameCenterHelper.switchGuestAccount(callback);
				};
			}
		}
		else
		{
			if(Datas.instance().tvuid() == userIdOfGcId)
			{
				//nothing
				Datas.instance().SetGameCenterPlayerId_Binded(playerIdAuth);
				Datas.instance().SetGameCenterAlias_Binded(aliasAuth);
				GameCenterHelper.SyncGameCenterAchievement();
				return;
			}
			else
			{
				warning = String.Format(Datas.getArString("GameCenter.IdAlreadyLinked"),aliasAuth);
				confirm = function(){
					GameCenterHelper.switchGameCenterAccount(playerIdAuth,aliasAuth,callback);
				};
			}

		}

		var confirmCallback:System.Action = function(){
			MenuMgr.getInstance().PopMenu("");
			if(confirm != null)
				confirm();
		};

		var confirmDialog : ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		confirmDialog.menuName = "GameCenterPopup";
		confirmDialog.setLayout(600,380);
		confirmDialog.setTitleY(60);
		confirmDialog.setContentRect(70,85,0,160);
		MenuMgr.getInstance().PushConfirmDialog(warning,"",confirmCallback,null);
		confirmDialog.setDefaultButtonText();
	};

	UnityNet.CheckGameCenerIdStatus(playerIdAuth, check);
}

/********** APP *******************/

/*Native InputBox click Return*/
public function InputBoxReturn(guid:String)
{
	var id:int = _Global.INT32(guid);
	switch(id)
	{
		case Constant.InputBoxGuid.CHAT_INPUT:
			chatInputReturn();
			break;
		case Constant.InputBoxGuid.ALLIANCEWALL_INPUT:
			allianceWallInputReturn();
			break;
		case Constant.InputBoxGuid.MAINTAINANCECHAT_INPUT:
			maintainanceChatInputReturn();
			break;
		case Constant.InputBoxGuid.AVA_CHAT_INPUT:
			avaChatInputReturn();
			break;
		default:
			break;
	}
}

public function InputBoxHidden(guid:String)
{
	var id:int = _Global.INT32(guid);
	switch(id)
	{
		case Constant.InputBoxGuid.CHAT_INPUT:
			chatInputHide();
			break;
		case Constant.InputBoxGuid.ALLIANCEWALL_INPUT:
			allianceWallInputHide();
			break;
		case Constant.InputBoxGuid.MAINTAINANCECHAT_INPUT:
			maintainanceChatInputHide();
			break;
		case Constant.InputBoxGuid.AVA_CHAT_INPUT:
			avaChatInputHide();
			break;
		default:
			nomalInputHidden();
			break;
	}
}
private function nomalInputHidden()
{
	if(InputText.getKeyBoard())
	{
		InputText.getKeyBoard().active = false;
	}
}
private function chatInputReturn()
{
	var menu:ChatMenu = MenuMgr.getInstance().getChatMenu();
	menu.Return();
}
private function chatInputHide()
{
	var menu:ChatMenu = MenuMgr.getInstance().getChatMenu();
	menu.Hide();
}

private function avaChatInputReturn()
{
	var menu:AvaChatMenu = MenuMgr.getInstance().getAvaChatMenu() as AvaChatMenu;
	menu.Return();
}

private function avaChatInputHide()
{
	var menu:AvaChatMenu = MenuMgr.getInstance().getAvaChatMenu() as AvaChatMenu;
	menu.Hide();
}

private function maintainanceChatInputHide()
{
	var menu:MaintainanceChatMenu = MenuMgr.getInstance().getMenu("MaintainanceChatMenu") as MaintainanceChatMenu;
	if(menu)
		menu.Hide();
}

private function maintainanceChatInputReturn()
{
	var menu:MaintainanceChatMenu = MenuMgr.getInstance().getMenu("MaintainanceChatMenu") as MaintainanceChatMenu;
	if(menu)
		menu.Return();
}

private function allianceWallInputReturn()
{
    MenuAccessor.AllianceWallInputReturn();
}

private function allianceWallInputHide()
{
    MenuAccessor.AllianceWallInputHide();
}

private function SetChatKeyboardHeight(height:String)
{
	var fHeight:float = _Global.FLOAT(height);
	var menu:ChatMenu = MenuMgr.getInstance().getChatMenu();
	menu.setMoveSpeed(fHeight);
}

private function SetAvaChatKeyboardHeight(height:String)
{
	var fHeight:float = _Global.FLOAT(height);
	var menu:AvaChatMenu = MenuMgr.getInstance().getAvaChatMenu() as AvaChatMenu;
	menu.setMoveSpeed(fHeight);
}

private function SetMaintainanceChatKeyboardHeight(height:String)
{
	var fHeight:float = _Global.FLOAT(height);
	var menu:MaintainanceChatMenu = MenuMgr.getInstance().getMenu("MaintainanceChatMenu") as MaintainanceChatMenu;
	if(menu != null)
		menu.setMoveSpeed(fHeight);
}

private function SetAlWallKeyboardHeight(height:String)
{
    MenuAccessor.SetAllianceWallKeyboardHeight(height);
}

private function RaterDialogReturn(action:String)
{
	if(action == null || action == "") return;
	var raterFlag:String = action.Substring(0,1);
	var id:String = action.Substring(1);
	var p:int = id.IndexOf("@=>@");
	//_Global.Log("ming RaterDialogReturn 0" + raterFlag);
	//_Global.Log("ming RaterDialogReturn 1" + id);
	//_Global.Log("ming RaterDialogReturn 2" + p);
	var place:String = "";
	if(p > 0)
		place = id.Substring(0,p);
	//_Global.Log("ming RaterDialogReturn 3" + place);
	UnityNet.SendRaterBI(raterFlag,id,place);
    if (raterFlag == Constant.AppRaterFlag.UserVoice) {
        OpenUserVoice();
    }
}

public function OpenUserVoice() {
    var uid : int = Datas.instance().tvuid();
    var userName : String = seed["players"]["u"+ uid ]["n"].Value;
    NativeCaller.OpenUserVoice(uid, userName, Datas.instance().worldid(), LocaleUtil.UservoiceHash);
}

private function RaterOpen(id:String)
{
	var p:int = id.IndexOf("@=>@");
	//("ming RaterOpen 0" + p);

	var place:String = "";
	if(p > 0)
		place = id.Substring(0,p);
	//_Global.Log("ming RaterOpen 1" + place);
	//_Global.Log("ming RaterOpen 2" + id);

	UnityNet.SendRaterOpenBI(id,place);
}
/////////////////////
//payment
////////////////////
private	var	isBuyAppProduct:boolean;
public function buyAppProduct(productId:String,payoutId:int){
	var pe:Payment.PaymentElement =Payment.instance().GetOrderInfo(payoutId);
	if(pe != null)
	{
 	 	if( Datas.GetPlatform() == Datas.AppStore.Amazon ){
 			AmazonPayment.getInstance().BuyAppProduct(productId);
		} else {

			/*------------------------------------------------------------*/
			/* gems 充值参数 */
			var prop = new System.Collections.Generic.Dictionary.<String, System.Object>();

				var price_cents: int = 0;
				System.Int32.TryParse(pe.cents, price_cents);

#if UNITY_EDITOR || UNITY_ANDROID
			/*android 端 当出现 cent 不是整数时 */
			if (price_cents == 0) {
				price_cents = _Global.INT32(_Global.FilterStringToNumberStr(pe.cents));
			}
#endif

			prop.Add("product_value", price_cents);/* 支付档位 */
			prop.Add("resource_value", pe.currency);/* 虚拟币价值 */
			prop.Add("currency_type", pe.currencyCode);/* 支付币种 */

			prop.Add("pay_method", "");	/* 支付方式 */

			prop.Add("is_first", Datas.instance().GetPlayerisFirstBuyState());/* 是否首次 */
			prop.Add("product_id", pe.payoutId);/* 商品ID */
			prop.Add("product_type", "base paid");/* 商品类型 */

			var price:double = 0f;
			System.Double.TryParse(pe.PriceWithoutCurrencySymbol, price);
			prop.Add("pay_amount", price);/* 支付金额 */

#if UNITY_ANDROID
			prop.Add("platform", "google");/* 付费渠道 */
#elif UNITY_IOS
			prop.Add("platform", "appstore");	/* 付费渠道 */
#endif

			var prodectArr: Array = new Array();
			var prodect = new System.Collections.Generic.Dictionary.<String, System.Object>();
			/*  只有一个商品 */
			prodect.Add("resource_name", "gems");/* 商品详情 - 资源名称 */
			prodect.Add("resource_num", pe.currency);/* 商品详情 - 资源数量 */
			prodectArr.Add(prodect);

			prop.Add("product_detail", prodectArr);/* 商品详情 - 资源名称 */

			/* 事件 - 发起充值*/
			ThinkingAnalyticsManager.Instance.TrackEvent("recharge", prop);

			/*------------------------------------------------------------*/

            var userName : String = Datas.instance().getHashedNaid();
			NativeCaller.BuyAppProduct(productId, userName);
		}
		MenuMgr.getInstance().netBlock = true;
		isBuyAppProduct = true;
	}
	else
	{
		Payment.instance().reqPaymentData();
	}
}

public function buyAppOfferProduct(productId: String, payoutId: int, offerData: PaymentOfferData)
{
	var pe:Payment.PaymentElement =Payment.instance().GetOrderInfo(payoutId);
	if(pe != null)
	{

		var offerId: int = offerData.Id;
	/*------------------------------------------------------------*/
		/*商品类型 / offer 类型  */
		var productType: String = "";
		if (offerData.offerType == 0) {
			productType = "liveops offer";
		} else if (offerData.offerType == 1) {
			productType = "monthly card";
		} else
			productType = "protection cover";



		/* offer 充值参数 */
		var prop = new System.Collections.Generic.Dictionary.<String, System.Object>();

		var price_cents: int = 0;
		System.Int32.TryParse(pe.cents, price_cents);

#if UNITY_EDITOR || UNITY_ANDROID
		/*android 端 当出现 cent 不是整数时 */
		if (price_cents == 0) {
			price_cents = _Global.INT32(_Global.FilterStringToNumberStr(pe.cents));
		}
#endif

		prop.Add("product_value", price_cents);/* 支付档位 */
		prop.Add("resource_value", pe.currency);/* 虚拟币价值 */
		prop.Add("currency_type", pe.currencyCode);/* 支付币种 */

		prop.Add("pay_method", "");	/* 支付方式 */

		prop.Add("is_first", Datas.instance().GetPlayerisFirstBuyState());/* 是否首次 */
		prop.Add("product_id", offerId);/* 商品ID */
		prop.Add("product_type", productType);/* 商品类型 */

		var price: double = 0f;
		System.Double.TryParse(pe.PriceWithoutCurrencySymbol, price);
		prop.Add("pay_amount", price);/* 支付金额 */

#if UNITY_ANDROID
		prop.Add("platform", "google");/* 付费渠道 */
#elif UNITY_IOS
		prop.Add("platform", "appstore");	/* 付费渠道 */
#endif


		var prodectItemsArr: Array = new Array();
		var prodectItemDataDict = new System.Collections.Generic.Dictionary.<String, int>();

		/* 月卡 或者 RewardChestId 为 0 */
		if ((offerData.IsMonthlyCard || offerData.RewardChestId == 0 ) && offerData.subItems != null) {
			var items: InventoryInfo[] = ChestDetailDisplayData.GetOfferItems(offerData.subItems);
			for (var info: InventoryInfo in items) {
				var id = info.id + "";
				if (!prodectItemDataDict.ContainsKey(id)) {
					prodectItemDataDict.Add(id, info.quant);
				}
			}

		} else {
			var id2 = offerData.RewardChestId + "";
			if (!prodectItemDataDict.ContainsKey(id2)) {
				prodectItemDataDict.Add(id2, offerData.RewardChestValue);
			}
		}

		for (var kv: KeyValuePair.<String, int> in prodectItemDataDict) {
			var prodectItem = new System.Collections.Generic.Dictionary.<String, System.Object>();
			prodectItem.Add("resource_name", kv.Key);/* 商品详情 - 资源名称 */
			prodectItem.Add("resource_num", kv.Value);/* 商品详情 - 资源数量 */
			prodectItemsArr.Add(prodectItem);
		}

		prop.Add("product_detail", prodectItemsArr);/* 商品详情 - 资源名称 */




		/* 事件 - 发起充值*/
		ThinkingAnalyticsManager.Instance.TrackEvent("recharge", prop);

	/*------------------------------------------------------------*/




		var userName : String = Datas.instance().getHashedNaid();
		NativeCaller.BuyOfferProduct(productId, userName, offerId);
		MenuMgr.getInstance().netBlock = true;
		isBuyAppProduct = true;
		Payment.instance().SetBuyOfferData(true, offerId);
	}
	else
	{
		Payment.instance().reqPaymentData();
	}
}

public function paymentOk(msg:String):void
{
	/*------------------------------------------------------------*/
	/* 修改 本地缓存 - 玩家是否是首次购买道具的状态 */
	Datas.instance().SetPlayerFirstBuyState(false);
	/*------------------------------------------------------------*/

	if( isBuyAppProduct ){
		MenuMgr.getInstance().netBlock = false;
		isBuyAppProduct = false;
	}

	if(Datas.GetPlatform() == Datas.AppStore.ITunes ||
		RuntimePlatform.OSXEditor == Application.platform ||
		Datas.GetPlatform() == Datas.AppStore.Amazon)
    {
		Payment.instance().responseToObjectC(msg);
    }

	if(Application.platform == RuntimePlatform.Android)
	{
		Payment.instance().AndroidPaymentOk();
	}

	SoundMgr.instance().PlayEffect( "KBN_Purchase4", /*TextureType.AUDIO*/"Audio/" );

	if(msg != null && msg != "" && Payment.instance().getBuyItemOkCallback() != null)
	{
		Payment.instance().BuyItemOkCallback();
		Payment.instance().resetBuyItemOkCallback();
	}

	var raterFlag:String = Datas.instance().getRaterFlag();

	MenuMgr.getInstance().sendNotification(Constant.Notice.PAYMENT_CLOSE, null);
}

//ios
public function paymentRewardByVerify(result:String):void
{

	var obj:HashObject = (new JSONParse()).Parse(result);
	paymentRewardByVerify(obj);
// 	_Global.Log("gameMain.js-->paymentRewardByVerify--"+result);
}
//andriod and amazone
public function paymentRewardByVerify(result:HashObject):void
{
	Payment.instance().addBeginnerOfferReward(result);

    if (result == null)
    {
        return;
    }

	if (result["rateActive"] != null)
	{
		CheckAndOpenRaterAlert(result["rateActive"],"payment");
	}

    if (result["beginnerProtectionExpireUnixTime"] != null)
    {
        seed["player"]["beginnerProtectionExpireUnixTime"] = result["beginnerProtectionExpireUnixTime"];
        BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_FRESHMAN, -1);
    }

    if (Alliance.getInstance().MyAllianceId() > 0)
    {
	    var eap:int = _Global.INT32( result["eap"] );
	    Ava.Player.SelfPurchaseAp += eap;
	    Ava.Player.ExpendablePoint += eap;

	    Ava.Alliance.ExpendablePoint += eap;

	    var cap:int = _Global.INT32( result["cap"] );
	    Ava.Alliance.CumulatePoint = cap;

	    var allianceLevel = _Global.INT32( result["level"] );
	    Ava.Alliance.Level = allianceLevel;
    }
}
public	function paymentCancel():void{
	if( isBuyAppProduct ){
		MenuMgr.getInstance().netBlock = false;
		isBuyAppProduct = false;

		if(Payment.instance().getBuyItemOkCallback() != null)
		{
			UnityNet.SendDirectPaymentBI( Constant.PaymentBI.Cancel, -1, null);
			Payment.instance().resetBuyItemOkCallback();
		}

	}
}

public  function  paymentError( errorInfo:String ):void{
  if( isBuyAppProduct ){
    MenuMgr.getInstance().netBlock = false;
    isBuyAppProduct = false;
  }
}

public function paymentErrorWithDlg(result:String):void
{
	if( isBuyAppProduct ){
		MenuMgr.getInstance().netBlock = false;
		isBuyAppProduct = false;
	}
	if(result == null)
		return;	//

	//waitForLoadStrings();
	var errorMsg:String;
	//xx:xxxxx format.
	var ecode:int = _Global.INT32(result.Substring(0,3));
	var eMsg:String = result.Substring(3);

	Payment.instance().resetBuyItemOkCallback();
	switch(ecode)
	{
		case 12:	//verify failed.
			errorMsg = Datas.getArString("Error.Payment_verify_error");
			break;
		default:
			if(Datas.GetPlatform() == Datas.AppStore.ITunes){
				errorMsg = Datas.getArString("Error.Payment_itunes_connect_error");
			}
			//Only Amazon Apps In-App Purchase messaging should be included in the purchase flow
//			else if( Datas.GetPlatform() == Datas.AppStore.Amazon ){
//				errorMsg = Datas.getArString("Error.Payment_amazon_connect_error");
//			}
			else if(Datas.GetPlatform() == Datas.AppStore.GooglePlay){
				errorMsg = Datas.getArString("Error.Payment_googleplay_connect_error");
			}
			break;
	}

	if (ecode != 12) {
		UnityNet.reportPaymentErrorToServer(ecode,eMsg);
		// 支付失败log收集 "%3d:description:%s;reason:%s;suggession:%s;productid:%s;cents:%d;currency:%s"
		UnityNet.reportErrorToServer("GameMain  paymentErrorWithDlg : ",null,null,result,false);
	}

	if (ecode != 2/*SKErrorPaymentCancelled*/) {
		ErrorMgr.instance().PushError("",errorMsg);
	}

}

public function valideProducts( msg:String ){
	if(msg == "v2")
		Payment.instance().setValideProducts(null);
//	MenuMgr.getInstance().netBlock = false;
	else
		Payment.instance().setValideProducts((new JSONParse()).Parse(msg));
}

public function recoverBuyObserver(){
	var paymentItems:Array = Payment.instance().getPaymentItems();

	if( paymentItems == null || paymentItems.length <= 0 ){
		var errorFunc:Function = function(errorMsg:String, errorCode:String){
			//Do nothing, only to NOT display retry dialog
		};
		Payment.instance().reqPaymentList( recoverPaymentObserver, errorFunc, false, false );
	}
}

public function cancelrecoverBuyObserver(){
	if( IsInvoking( "recoverBuyObserver" ) ){
		CancelInvoke("recoverBuyObserver");
	}
}

/////////////////////
//end payment
////////////////////
public function shareErrorDialog(strKey:String):void
{
	if( Datas.GetPlatform() != Datas.AppStore.Amazon ){
		if(ErrorMgr.instance() != null)
			ErrorMgr.instance().PushError("",Datas.getArString(strKey),true, Datas.getArString("Common.OK"),null );
	}
}

public function shareLogoutOk(str:String):void
{
    MenuMgr.getInstance().sendNotification(Constant.Notice.ShareLogOutOK, str);
}

public function shareLoginOk(str:String):void
{
    MenuMgr.getInstance().sendNotification(Constant.Notice.ShareLogInOK, str);
}

public function shareLoginFailed(str:String):void
{
    MenuMgr.getInstance().sendNotification(Constant.Notice.ShareLogInFailed, str);
}

public function shareSendOk(str:String):void
{
    MenuMgr.getInstance().sendNotification(Constant.Notice.ShareSendOK, str);
}

public function FBInviteSended(str:String):void
{
    MenuMgr.getInstance().sendNotification(Constant.Notice.ShareSendInvite, str);
}

public function ShareSendFBPostOK(str : String) : void
{
    MenuMgr.getInstance().sendNotification(Constant.Notice.ShareSendFBPostOK, str);
}

public function ShareSendFBPostFailed(str : String) : void
{
    MenuMgr.getInstance().sendNotification(Constant.Notice.ShareSendFBPostFailed, str);
}

/************************************/
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//android methods only.
public function ShowMessage(flag:String):void
{
	//_Global.Log("show message begin. flag = " + flag);
	if(Application.platform != RuntimePlatform.Android) return;

	switch(flag)
	{
		case "not supported":
			ErrorMgr.instance().ForcePushError("",Datas.getArString("Error.Google_play_purchase"));
			//UnityNet.reportErrorToServer("CLIENT_ERROR",null,null,"The current version of Google play does not support the purchase or Google play was not correctly installed.",false);
			GameMain.instance().LockScreen("false");
			break;
		case "already purchased":
			if(MenuMgr.instance.GetCurMenuName() != "ErrorDialog")
			{
				ErrorMgr.instance().ForcePushError("",Datas.getArString("MessagesModal.GoogleRestartPurchase"));
			}
			GameMain.instance().LockScreen("false");
			break;
		case "googlelinkfailed":
			ErrorMgr.instance().ForcePushError("",Datas.getArString("Google.linkfailed"));
			GameMain.instance().LockScreen("false");
			break;
		default:
			UnityNet.reportErrorToServer("CLIENT_ERROR",null,null,"",false);
			break;
	}

}

public function VerifyPayment(information:String)
{
	GooglePlayPayment.VerifyPayment(information);
}

public function AmazonVerifyPayment(userId:String, receipt:AmazonReceipt){
	if( Datas.GetPlatform() == Datas.AppStore.Amazon ){
		AmazonPayment.getInstance().VerifyPayment(userId, receipt);
	}
}

public function LockScreen(isLock:String)
{
	if(isLock.Trim().ToLower() == "true")
	{
		MenuMgr.getInstance().netBlock = true;
	}
	else if(isLock.Trim().ToLower() == "false")
	{
		MenuMgr.getInstance().netBlock = false;
	}
}
public function OnBackButtonClicked(message:String)
{
	Debug.Log("OnBackButtonClicked gamemain");
	//_Global.Log("menu OnBackButtonClicked.");
	MenuMgr.getInstance().UpdateAndroidBackKey();
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



function signupError(errorMsg:String, errorCode:String){

	retryDlg(errorMsg, errorCode, function(){
		UnityNet.signup(-1, signupOk,signupError);
	});
}

public static function UpdateGearMaxLevel(seed : HashObject) : void {
    if (seed["serverSetting"] != null && seed["serverSetting"]["gearMaxLevel"] != null) {
        GearLevelUpData.GearLevelUpItem.GlobalMaxLevel = _Global.INT32(seed["serverSetting"]["gearMaxLevel"]);
    } else {
        GearLevelUpData.GearLevelUpItem.GlobalMaxLevel = -1;
    }
}

private function UpdateShouldShowChartboostInterstitial(seed : HashObject) : void {
    shouldShowChartboostInterstitial = (_Global.INT32(seed["shouldShowChartboostInterstitial"]) != 0);
}

//get seed
function getSeedOk(result: HashObject) {


	loading.setLoadPercent(80);

	var data: Datas = Datas.instance();


	if( data.getUserLoadBI() < 10001004 ){
		UnityNet.SendBI(Constant.BIType.FTE,100, 10001004);
		data.setUserLoadBI(10001004);
	}

	gameTime = _Global.parseTime( result["restime"] );// - Time.realtimeSinceStartup;
//	Datas.instance().setLoginTime(gameTime);

	data.setLoginTime(System.DateTime.Now.Ticks);
	deltaTime = Time.realtimeSinceStartup;

	seed = result["seed"];

	RefreshLocalCacheData();

    if (seed["player"]["shadowGems"] == null) {
        seed["player"]["shadowGems"] = new HashObject(0);
    }

	data.setPicCampRemainTimes(_Global.INT32(seed["restAttackNpcNum"]));
	data.SetPicCampAttackTimes(_Global.INT32(seed["totalAttackPictNum"]));
    UpdateGearMaxLevel(seed);
    UpdateShouldShowChartboostInterstitial(seed);
    Quests.instance().UpdateMainRecommendLevel(seed);

    DailyLoginRewardMgr.Instance.UpdateBySeed(seed);
    DailyLoginRewardMgr.Instance.InitDataFromGetSeed(seed);

    PaymentOfferManager.Instance.UpdateDataWithHashObject(seed["activity"]);
    seed.Remove("activity");

    DailyQuestManager.Instance.InitDataWithHashObject(seed["dailyQuests"]);
	seed.Remove("dailyQuests");

	PassMissionQuestManager.Instance().InitPassMissionQuests(seed["passMission"]);
	seed.Remove("passMission");

	//PassMissionMapManager.Instance().InitPassMissionMap(seed);

	GetRater(seed["rater"]);
	MenuMgr.getInstance().MainChrom.SetWheelGameInfo(seed["wheelgame"]);
	GearManager.Instance().GearKnights.Clear();
	GearManager.Instance().GearKnights.Parse(seed);
	MyItems.instance().SetBatchConfig(seed);

	var serverSettingData = seed["serverSetting"];
	if (serverSettingData != null) {
		if (serverSettingData["kabamGamesLink"] != null) {
			data.SetKabamGamesLink(_Global.GetString(serverSettingData["kabamGamesLink"]));
		}
		if (serverSettingData["gearMaxTier"] != null) {
			GearData.Instance().GachaLevelUpMaxTier = _Global.INT32(serverSettingData["gearMaxTier"]);
		}

		if (null != MaterialColorScheme.instance){
			MaterialColorScheme.instance.useScheme = (_Global.INT32(serverSettingData["halloweenColorScheme"]) == 1);
		}
	}

	fix_hackSeed(seed);

	var cityInfo:HashObject;
	var cityId:int = data.getCityId();
	var	cities:HashObject = seed["cities"];
	for( var i:int = 0; ; i ++ ){
		cityInfo = cities[_Global.ap+i];
		if( cityInfo == null ){
			currentcityinfo = cities[_Global.ap+0];
			data.saveCityId(_Global.INT32(currentcityinfo[_Global.ap+0]));
			curCityOrder = _Global.INT32(currentcityinfo[_Global.ap+6]);
			break;
		}else if( _Global.INT32(cityInfo[_Global.ap+0]) == cityId ){
			currentcityinfo = cityInfo;
			curCityOrder = _Global.INT32(cityInfo[_Global.ap+6]);
			break;
		}
	}

	curCityId = _Global.INT32(currentcityinfo[_Global.ap+0]);
	mapInitCenterX = _Global.INT32(currentcityinfo[_Global.ap + 2]);
	mapInitCenterY = _Global.INT32(currentcityinfo[_Global.ap + 3]);

	//__updateKPushModule(seed["serverSetting"]);
	var alliancePermission : HashObject = seed["alliancePermission"];
	if ( alliancePermission != null )
		AllianceRights.UpdateBySeed(alliancePermission);

	allianceEmblemMgr.UpdateBySeed(seed);

	GearSysController.UpdateFromSettingSeed(seed["serverSetting"]);
	GearManager.Instance().UpdateBySeed(seed);

	// LiHaojie 2013.09.26: MUST keep below codes at the ending of this method
	GearManager.Instance().GearWeaponry.Clear();
//	fte_checkFTE();	//will call  init
	CheckMigrate(seed);
	SyncPlayerData();
	MyCitiesController.Init(seed);
	Message.getInstance().UpdateEventCenterTabel(seed);
//	StartGame();
	if (seed["heroOpened"] != null)
	{
	    HeroManager.Instance().SetHeroEnable(_Global.INT32(seed["heroOpened"]) > 0);
	}

	if ( seed["serverSetting"] != null )
	{
		var startLevel : int = _Global.INT32(seed["serverSetting"]["KnightDefaultStartLevel"]);
		if ( startLevel > 0 )
			Knight.SetStarStartLevel(startLevel);
	}

//	SocketNet.GetInstance().SetEnable(false);
//	if (seed["socket"] != null)
//	{
//		if (seed["socket"]["active"].Value == "1")
//		{
//			SocketNet.GetInstance().SetEnable(true);
//			SocketNet.GetInstance().IpAddress = seed["socket"]["ip"].Value;
//			SocketNet.GetInstance().Port = _Global.INT32(seed["socket"]["port"].Value);
//			SocketNet.GetInstance().HeartBeatInterval = (seed["socket"]["heartbeatinterval"] != null ? _Global.INT32(seed["socket"]["heartbeatinterval"].Value) : 30f);
//			SocketNet.GetInstance().HeartBeatCount = (seed["socket"]["heartbeatcount"] != null ? _Global.INT32(seed["socket"]["heartbeatcount"].Value) : 3);
//			SocketNet.GetInstance().ReconnectInterval = (seed["socket"]["reconnectinterval"] != null ? _Global.INT32(seed["socket"]["reconnectinterval"].Value) : 10f);
//			SocketNet.GetInstance().ReconnectCount = (seed["socket"]["reconnectcount"] != null ? _Global.INT32(seed["socket"]["reconnectcount"].Value) : 3);
//			SocketNet.GetInstance().SetSignUpInformation(
//				_Global.INT32(seed["player"]["worldId"].Value),
//				_Global.INT32(seed["player"]["userId"].Value),
//				seed["player"]["name"].Value,
//				_Global.INT32(seed["player"]["allianceId"].Value));
//			SocketNet.GetInstance().Connect();
//		}
//	}

	if (seed["monsterEvent"]!=null)
    {
    	MonsterController.instance().UpdateSeed(seed["monsterEvent"]);
	}
	//Debug.LogWarning("KBN.Datas.singleton.worldid()="+KBN.Datas.singleton.worldid());
    if (PlayerPrefs.GetString("mapMD5"+KBN.Datas.singleton.worldid(),"")!=GameMain.singleton.GetMapMD5()){
    	UnityNet.getBaseMapInfo(GetBaseTileDataOk,null);
    }
    WorldBossController.instance().Init();
    KBN.RallyController.instance().Init();
	birdMgr.init();

	KBN.HeroRelicManager.instance().InitHeroRelicManager();


	/*------------------------------------------------------------*/
	/* 开始 游戏登出时的 在线时长计时 */
	ThinkingAnalyticsManager.Instance.StartTimeTrackEvent("logout");

	var prop = new System.Collections.Generic.Dictionary.<String, System.Object>();

	/* 事件： 玩家登录 （登录（账号和角色是同时登录）完成后） */
	prop = new System.Collections.Generic.Dictionary.<String, System.Object>();
	prop.Add("is_from_background", GameMain.isGameEnter);/*是否后台唤起*/
	ThinkingAnalyticsManager.Instance.TrackEvent("login", prop);
	/*------------------------------------------------------------*/


	GameMain.isGameEnter = true;

	PlayerPrefs.SetInt("isRestart", 0);

}




function GetBaseTileDataOk(result : HashObject):void{
	if (result["ok"]) {
		MapMemCache.instance().SetBaseTileDatas(result);
	}
}

function changeMigrateItemCount(itemId:int,count:int){

	var itemIdString : String = "i" + itemId.ToString();
	var itemObj : HashObject = seed["items"][itemIdString];
	if ( itemObj != null )
	{
		var oldCount:int = _Global.INT32(seed["items"][itemIdString]);
		itemObj.Value = count+oldCount;
	}

	else{
		seed["items"][itemIdString] = new HashObject(count);
	}

}


function CheckMigrate(seed : HashObject){
	if (seed["playerMigrateStatus"]) {
		playerMigrateStatus = _Global.INT32(seed["playerMigrateStatus"]["status"]);
		if(playerMigrateStatus==1){
			var migrateTime:String = _Global.DateTimeChatFormat2(_Global.INT64(seed["playerMigrateStatus"]["migrateTime"]));
			MenuMgr.getInstance().PushMenu("MigrateDialog", {"type":0,"time":migrateTime,"fromLoading":1}, "trans_zoomComp");
		}else{
		   fte_checkFTE();
		}
	}else{
		fte_checkFTE();
	}

	if (seed["migrateSwitch"]) {
		migrateSwitch = _Global.INT32(seed["migrateSwitch"]) == 1 ?true:false;
	}
}

function SetMigrateSwitch(mgSwitch:boolean){
	migrateSwitch=mgSwitch;
}
function GetmMigrateSwitch():boolean
{
	return migrateSwitch;
}

public function getPlayerMigrateStatus()
{
	return playerMigrateStatus;
}

public function getUserId():int{
	if(seed!=null){
		return _Global.INT32(seed["player"]["userId"].Value);
	}

    return 0;
}

public function isSkipFTE():boolean
{
	if(seed["isNewplayer"]!=null){
		return _Global.INT32(seed["isNewplayer"].Value)==1?true:false;

	}
	return false;
}

public function updateSeed() {
	/* reGet seed */
	var	onOk:Function = function(result:HashObject){
		seed = result["seed"];

		RefreshLocalCacheData();

		MyItems.instance().checkItemCount();
		MyItems.instance().UpdateAllItemList(seed);
		MyItems.instance().IsShowItemChangeMsg=true;

		MyItems.instance().saveItemCoutDic();
	};
	if(isUpdateSeed){
			UnityNet.getSeed(getUserId(), onOk, null);
			isUpdateSeed=false;
	}


}


function getSeedError(errorMsg:String, errorCode:String){
//	_Global.Log("GetSeedError:" + errorMsg);

	//__updateKPushModule(null);
	retryDlg(errorMsg, errorCode, function(){
		var tvuid:int = Datas.instance().tvuid();
		UnityNet.getSeed(tvuid, getSeedOk, getSeedError);
	});
}

function retryDlg( msg:String, errorCode:String, retryFunc:Function ){
	//waitForLoadStrings();
//	var arStrings:Object = Datas.instance().arStrings();
	var errorMsg:String = errorCode == UnityNet.NET_ERROR ? Datas.getArString("Error.Network_error") : UnityNet.localError( errorCode, msg, null );
	if( errorMsg != null ){
		ErrorMgr.instance().PushError("",errorMsg, false, Datas.getArString("FTE.Retry"), retryFunc);
	}

}


function preInit(fteSeed:Object)
{

}

function init(){
	var flags:Flags = Flags.instance();
	//wait str, data loading completed.

	var startWait:long = gameTime;
	var ww:long = 0;

	//_Global.Log("$$$$$  After checkGDSLoadFlags--> : " + (System.DateTime.Now - startTime).TotalMilliseconds);
	LoadingProfiler.Instance.StartTimer("GameMain Init Wait GDS");

	var waitTime = new WaitForSeconds(.5f);

	while( !flags.GM_STR_LOADED ||	!flags.GM_DATA_LOADED || !gdsManager.GdsesOfCategoryAreLoaded(GdsCategory.Default)
		|| (MystryChest.instance().LoadType == MystryChest.EnumLoadType.SyncLoad && flags.MYSTRY_CHEST_CONFIG == false))
	{
		yield waitTime;
	}

	LoadingProfiler.Instance.EndTimer("GameMain Init Wait GDS");
	LoadingProfiler.Instance.StartTimer("GameMain Init Other");
	//_Global.Log("$$$$$  After checkGDSLoadFlags : " + (System.DateTime.Now - startTime).TotalMilliseconds);
	//set gds version to playerprefs
	Datas.instance().setPlayerPrefs_DATAVERSION();

	cityScaleFactor = Datas.instance().getCityScale();
	fieldScaleFactor = Datas.instance().getFieldScale();


	CityQueue.instance().init(seed);
	initComponents();
	NewFteMgr.Instance().InitDatas();
	m_AvaManager.Init();
	m_PlayerBuff.InitHomeBuffs( seed );
	BuildingDecMgr.getInstance().checkForGearSys();
	BuildingDecMgr.getInstance().checkForHospitalHaveWounded();

	fteMgr.firstInitStep();

	loading.setLoadPercent(85);
	yield;

	Quests.instance().initQuestData();
	MenuMgr.getInstance().InitInGameMenu();
	//_Global.Log("$$$$$  After InitInGameMenu : " + (System.DateTime.Now - startTime).TotalMilliseconds);

	loading.setLoadPercent(90);
	yield;
	Payment.instance().reqPaymentData();
	yield;
	//_Global.Log("$$$$$  After InitInGameMenu  yield: " + (System.DateTime.Now - startTime).TotalMilliseconds);
	var lastSaveLevel = Datas.instance().scencelevel();
	if( lastSaveLevel <= 1 || lastSaveLevel >= 5){//maybe in scence 0, user shut down application
		lastSaveLevel = CITY_SCENCE_LEVEL;
	}
	while(MenuMgr.getInstance().getStackNum() > 0)
	{
		yield;
	}
	loadingLevel[lastSaveLevel]  = true;
	#if UNITY_EDITOR
	Application.LoadLevelAdditive(lastSaveLevel);
	#else
	Application.LoadLevelAdditiveAsync(lastSaveLevel);
	#endif
	//_Global.Log("$$$$$  ===================== : " + (System.DateTime.Now - startTime).TotalMilliseconds);
	MystryChest.instance().InitWithAsync();

//	Invoke("VerifyAccount",30);

	bLogin = Datas.instance().getKabamId() != 0;
	//ignored users in PlayerPrefs
	UserSetting.getInstance().initIgnoredUsers(seed);

	ChatNotices.instance().InitChatNotices();
	saleNotices.instance().InitsaleNotices();

	//init in test server
	initSocketConnection();

	var sessionCnt:int = Datas.instance().getSessionCnt();
	Datas.instance().setSessionCnt(sessionCnt + 1);


 	if(!KBN.FTEMgr.getInstance() || KBN.FTEMgr.getInstance().isFinished)
	{
		  Message.getInstance().DownLoadReports(function () {//DownLoad reports info
			  //("download message success.......");

			  Message.getInstance().DownLoadInboxs(true, function () {//DownLoad email info
				  Message.getInstance().DownLoadInboxs(false, function () {
					  //_Global.Log("download message success.......");

				  });
			  });
		  },"");
	}
	//end
	//_Global.Log("before get purchase");
	NativeCaller.GetPurchase();
	//_Global.Log("after get purchase.");

	initOver = true;
	GearNet.Instance().knightGearList();

	NewSocketNet.GetInstance().SetEnable(false);
	if (seed["newSocket"] != null && seed["newSocket"].ToString() != "")
	{
		if (seed["newSocket"]["active"].Value == "1")
		{
			NewSocketNet.GetInstance().SetEnable(true);
			NewSocketNet.GetInstance().SetNewSocketIpAndPort(seed["newSocket"]["ip"].Value, _Global.INT32(seed["newSocket"]["port"].Value));

			NewSocketNet.GetInstance().SetOtherData((seed["newSocket"]["heartbeatinterval"] != null ? _Global.INT32(seed["newSocket"]["heartbeatinterval"].Value) : 30f),
				(seed["newSocket"]["heartbeatcount"] != null ? _Global.INT32(seed["newSocket"]["heartbeatcount"].Value) : 3),
				(seed["newSocket"]["reconnectinterval"] != null ? _Global.INT32(seed["newSocket"]["reconnectinterval"].Value) : 10f),
				(seed["newSocket"]["reconnectcount"] != null ? _Global.INT32(seed["newSocket"]["reconnectcount"].Value) : 3));

			NewSocketNet.GetInstance().SetSignUpInformation(
				_Global.INT32(seed["player"]["worldId"].Value),
				_Global.INT32(seed["player"]["userId"].Value),
				seed["player"]["name"].Value,
				_Global.INT32(seed["player"]["allianceId"].Value));
			NewSocketNet.GetInstance().Creat();
		}
	}

	LoadingProfiler.Instance.EndTimer("GameMain Init Other");
	_Global.LogWarning("GameMain.Init()");


	/*------------------------------------------------------------*/
	/* 游戏loading 加载 结束计时 */
	var prop = new Dictionary.<String, System.Object>();
	prop.Add("loading_id", "1");
	ThinkingAnalyticsManager.Instance.EndTimeTrackEvent("loading", prop);
	/*------------------------------------------------------------*/



}

private function initSocketConnection()
{
	if(seed["player"]["inTestWorld"].Value)
	{
		var ip:String = seed["player"]["socketIp"]?seed["player"]["socketIp"].Value:null;
		var port:int = _Global.INT32(seed["player"]["socketPort"]);
		var player:String = "{\"player_id\": \"" + Datas.instance().worldid() + "_" + Datas.instance().tvuid() +"\"}";

		SocketAdapter.Connect(ip,port,player);

		var handler:SocketCallBack = new SocketCallBack();
		handler.Operation = "job_completed";
		handler.Method = function(result:Object){
			GameMain.instance().seedUpdateSocket(true);
		};
		SocketAdapter.RegisterHandler(handler);
	}
}

private function initComponents()
{
	Utility.instance().init(seed);
	General.instance().init(seed);
	SpeedUp.instance().init(seed);
	LevelUp.instance().init(seed);
	Quests.instance().init(seed);
	Building.instance().init(seed);
	Research.instance().init(seed);
	HealQueue.instance().init(seed);
    SelectiveDefenseQueueMgr.instance().init(seed);
	Resource.instance().init(seed);
	Barracks.instance().init(seed);
	BuildingQueueMgr.instance().init(seed);
	UpdateSeed.instance().init(seed);
	MyItems.instance().init(seed);
	Prop.getInstance().init(seed);
	RallyPoint.instance().init(seed);
	Walls.instance().init(seed);
	Embassy.instance().init(seed);
	Bookmark.instance().init(seed);
	Attack.instance().init(seed);
	Scout.instance().init(seed);
	WildernessMgr.instance().init(seed);

	Castle.instance().init(seed);
	Player.getInstance().init(seed);
	March.instance().init(seed);
	Watchtower.instance().init(seed);
	Alliance.getInstance().init(seed);
	Museum.instance().init(seed);
	WorkShop.instance().init(seed);

	AvatarMgr.instance().init(seed);
	FrameMgr.instance().init(seed);
	Technology.instance().init(seed);
}

public function getMapController() : MapController {
	return mapController;
}

public function getMapController2() : MapController {
	return mapController2;
}

public function forceRepaintWorldMap2() {
	if( mapController2 ){
		MapView.instance().AllForceUpdate = true;
		mapController2.repaint(true);
		MapView.instance().AllForceUpdate = false;
	}
}

public function forceRepaintWorldMap() {
	if( mapController ){
		if(curScenceLevel == AVA_MINIMAP_LEVEL)
		{
			MapView.instance().AllForceUpdate = true;
			mapController.repaint(true);
			MapView.instance().AllForceUpdate = false;
		}
	}
}

public function repaintWorldMap() {
	if( mapController ){
		mapController.repaint(true);
	}
}

public function changeCity(cityId:int):void{

	if( cityId == curCityId ){
		return;
	}

	var cityInfo:HashObject;
	var	cities:HashObject = seed["cities"];
	for( var i:int = 0; ; i ++ ){
		cityInfo = cities[_Global.ap+i];
		if( cityInfo == null ){
			return;
		}else if( _Global.INT32(cityInfo[_Global.ap+0]) == cityId ){
			curCityOrder = _Global.INT32(cityInfo[_Global.ap+6]);
			break;
		}
	}

	Datas.instance().saveCityId(cityId);

	currentcityinfo = cityInfo;
	curCityId = cityId;
	mapInitCenterX = _Global.INT32(currentcityinfo[_Global.ap + 2]);
	mapInitCenterY = _Global.INT32(currentcityinfo[_Global.ap + 3]);

	initComponentsAfterChangeCity();
	MenuMgr.getInstance().InitInGameMenuAfterChangeCity();
    MenuMgr.getInstance().sendNotification(Constant.Notice.ChangeCity, null);

	BuildingDecMgr.getInstance().resetDecoForGear();

	if( cityController ){
		cityController.init();
	}
	if( fieldController ){
		fieldController.init();
	}
	if( mapController ){
		mapController.repaint(true);
	}

	BuildingDecMgr.getInstance().checkForGearSys();
	BuildingDecMgr.getInstance().checkForHospitalHaveWounded();
	HealQueue.instance().checkAnimationState();
	Quests.instance().updateQuestData();
	Technology.instance().checkAnimationState();
//	FreeRAM();

}

private function initComponentsAfterChangeCity(){
	Research.instance().resetAfterChangeCity();
	Resource.instance().InitAfterChangeCity();
	Barracks.instance().InitAfterChangeCity();
	Walls.instance().InitAfterChangeCity();
	Scout.instance().init(seed);

	March.instance().init(seed);
	WildernessMgr.instance().init(seed);
	Watchtower.instance().init(seed);
}

public function checkData(){
	var version:String = Datas.instance().getPlayerPrefs_DATAVERSION();
	var params1:Array = new Array();
	params1.Add("data");
	params1.Add(version);
	Flags.instance().GM_DATA_LOADED = false;
	var dataOkFunc:Function = function(bytes:byte[], texts:String){
		//_Global.Log("Data check OK");

//		saveDataThread = new Thread(function()
//		{
			Datas.instance().setData(bytes, texts, true,false);

			Flags.instance().GM_DATA_LOADED = true;
			//_Global.Log("data ok get Flags.GM_DATA_LOADED:" + Flags.instance().GM_DATA_LOADED);
//		});
//
//		saveDataThread.Start();
	};

	var	dataErrorFunc:Function = function(msg:String, errorCode:String)
	{
		Flags.instance().GM_DATA_LOADED = true;

		//_Global.Log("Data check Error:"+msg);
		//_Global.Log("data error get Flags.GM_DATA_LOADED:" + Flags.instance().GM_DATA_LOADED);
	};

//	_Global.Log("local data version:" + version );
	UnityNet.checkData(params1, dataOkFunc, dataErrorFunc );
}

public function checkGDSReload(gdsVer:HashObject) : void
{
	if (m_bNeedCheckGDSVersion == false)
	{
		return;
	}

	this.StartCoroutine(priv_chkGDSReload(gdsVer));
}

private function priv_chkGDSReload(gdsVer:HashObject)
{
	if (gdsVer == null)
	{
		return;
	}

    gdsManager.CheckGdsReloadFromServer(gdsVer);
    if (!gdsManager.GdsesAreAllReloaded())
	{
        yield new WaitForSeconds(.5f);
	}
	HeroManager.Instance().Check(true);
	if(Flags.instance().GetRestartGameFlag())
	{
		ErrorMgr.instance().PushError("",Datas.getArString("PopUpInfor.InGame_Restart_Content"),false, Datas.getArString("FTE.Restart"),restartGame);
	}
}

public function checkGDSVersion():void
{
    GdsManagerHelper.CheckGdsVersion(gdsManager, function(result : HashObject)
	{
		checkGDS();//only d.txt
        gdsManager.LoadGdsesOfCategory(GdsCategory.Default);
	});
}

private function checkGDS():void
{
	//_Global.Log("$$$$$  After loadGDS from Local or download---> : " + (System.DateTime.Now - startTime).TotalMilliseconds);
	if(m_bNeedCheckData)
		checkData();
	else
		Datas.instance().loadDataFromLocal();

	//_Global.Log("$$$$$  After loadGDS from Local or download : " + (System.DateTime.Now - startTime).TotalMilliseconds);
}

private function checkString(){
	var version:String = Datas.instance().getStringVersion();
	var language:String = Datas.instance().getGameLanguageAb();
	var params2:Array = new Array();
	params2.Add("string");
	params2.Add(language);
	params2.Add(version);

	Flags.instance().GM_STR_LOADED = false;
//	_Global.Log("local string version:" + version );
	var strOkFunc:Function = function(bytes:byte[], texts:String){
		_Global.Log("str check OK");

//		saveStrThread = new Thread(function()
//		{
			Datas.instance().setStrings(bytes, texts, true,false);

			Flags.instance().GM_STR_LOADED = true;
			_Global.Log("str ok get Flags.GM_STR_LOADED:" + Flags.instance().GM_STR_LOADED);
//		});
//		saveStrThread.Start();
	};

	var	strErrorFunc:Function = function(msg:String, errorCode:String)
	{
		Flags.instance().GM_STR_LOADED = true;

		_Global.Log("str check Error:"+msg);
		_Global.Log("str error get Flags.GM_STR_LOADED:" +  Flags.instance().GM_STR_LOADED);
	};

	UnityNet.checkString(params2, strOkFunc, strErrorFunc );
}

//end start init

private function secondUpdate(){
//	_Global.Log("secondUpdate");

	gameTime += 1;

	update_queue();
	Barracks.instance().Update();
	Walls.instance().Update();
	Watchtower.instance().Update();
	Resource.instance().Update();
	MyItems.instance().Update();
	MystryChest.instance();
	HeroManager.Instance().Update();
	KBN.PveController.instance().Update();
	KBN.AllianceBossController.instance().Update();
    m_AvaManager.Update();
    Technology.instance().Update();
    Payment.instance().Update();

    if(MenuMgr.getInstance() && MenuMgr.getInstance().MainChrom)
    {
        MenuMgr.getInstance().MainChrom.SecondUpdate();
    }
}

public function resetSecondUpdate():void
{
	if( IsInvoking( "secondUpdate" ) )
	{
		CancelInvoke("secondUpdate");
	}
	InvokeRepeating("secondUpdate",1,1);
}

public function invokeUpdateSeedInTime( seconds:int ){
	if( IsInvoking( "seedUpdate" ) ){
		CancelInvoke("seedUpdate");
	}
	Invoke("seedUpdate",seconds);
}

public function CancelUpdateSeed()
{
	if( IsInvoking( "seedUpdate" ) ){
		CancelInvoke("seedUpdate");
	}
}

private function seedUpdate(){
	seedUpdate(false);
}

public function seedUpdate(marchForceUpdateFlag:boolean)
{
	UpdateSeed.instance().update_seed_ajax(marchForceUpdateFlag, null);
}

public function seedUpdateAfterQueue(marchForceUpdateFlag:boolean)
{
	if(SocketAdapter.Ready() == false)
	{
		_Global.Log("Update start by Local");
		seedUpdate(marchForceUpdateFlag);
	}
}
public function seedUpdateSocket(marchForceUpdateFlag:boolean)
{
	_Global.Log("Update start by Socket server");
	seedUpdate(marchForceUpdateFlag);
}


private     function AccountOk(result:Object)
{
	bLogin = true;
//	Invoke("VerifyAccount",30);
}

private     function AccountUpdate(result:Object)
{
	MenuMgr.getInstance().PushMenu("PasswordChange", null, "trans_zoomComp");
	bLogin = false;
	CancelInvoke("seedUpdate");
}

public      function IsLogin():boolean
{
	return bLogin;
}

public      function LoginSucess()
{
	bLogin = true;
	invokeUpdateSeedInTime(30);
//	Invoke("VerifyAccount",30);
}

function	update_queue(){
	BuildingQueueMgr.instance().update();
	Research.instance().updateQueue();
	HealQueue.instance().updateQueue();
	March.instance().updateQueue();
	Scout.instance().updateQueue();
	Payment.instance().updateQueue();
	WildernessMgr.instance().updateQueue();
    SelectiveDefenseQueueMgr.instance().updateQueue();
    Technology.instance().updateQueue();
}

public function OnApplicationPause(pause:boolean)
{
	if( pause ){
		cloudMgr.reset();
		birdMgr.reset();
		deltaTime = Time.realtimeSinceStartup;
		if( initOver ){
			var data:String = PushNotification.getInstance().noticesStr;
			PushPlugin.getInstance().ActivatePushNotification(data);

			saveData();
		}


		sessionTime = Time.realtimeSinceStartup - sessionTime;
		if( signupOver ){
			var	params:Array = new Array();
			var waitingTime:double = RecorderWaitingTime.getLoadingTimeAndClear();
			params.Add(sessionTime + "");
			params.Add(isFirstSession?1:0);
			params.Add(coldStart?1:0);
			params.Add(waitingTime);
			UnityNet.sessionTime( params, null, null );
			getMarchesInfo();
		}


		/*------------------------------------------------------------*/
		/* 事件：用户登出 （角色退出游戏时上报（杀进程、切换角色、重新读loading条、切到后台）） */

		ThinkingAnalyticsManager.Instance.EndTimeTrackEvent("logout");
		/*------------------------------------------------------------*/



	} else {

		/*------------------------------------------------------------*/
		/*重新开始 游戏登出时的 在线时长计时 */

		ThinkingAnalyticsManager.Instance.StartTimeTrackEvent("logout");
		/*------------------------------------------------------------*/

		var mp:MapController = GameMain.instance().getMapController();
			if( mp ){
				mp.getTilesResourceStatesInfoDic(false);
			}
		//SocketNet.GetInstance().SendHeartBeat();
		NewSocketNet.GetInstance().SendHeartBeat();
		coldStart = false;
		isFirstSession = false;

		RecorderWaitingTime.onRestart();

		sessionTime = Time.realtimeSinceStartup;
		backgroundTime += Time.realtimeSinceStartup - deltaTime;

		var sessionCnt:int = Datas.instance().getSessionCnt();
		Datas.instance().setSessionCnt(sessionCnt + 1);

        // start a chartboost session every time the game becomes active, as needed by newer SDK version
        NativeCaller.Chartboost(LocaleUtil.ChartboostHash);
	 	if( initOver && m_isPushedMainChrome ) {
			gameTime += Time.realtimeSinceStartup - deltaTime;
			deltaTime = Time.realtimeSinceStartup;

			if( needRestart() ){
				restartGame();
			}else{
				trackWarmStart();

				var didFTE:boolean = KBN.FTEMgr.isFTERuning();
				didFTE |= NewFteMgr.Instance().IsForbidMenuEvent;
				if(didFTE == false)
				{
					_Global.Log("Warm restart**************");
					Invoke("OpenShareMenu",1);
				}
			}
		}
		MenuMgr.getInstance().sendNotification(Constant.Notice.APP_BECOME_ACTIVE,null);
		this.sendPushSettings();
		GameMain.instance().dealyCallUpdateSeed(1);
	}
}

private function reqWarmStartOk( result:HashObject ){

	gameTime = _Global.parseTime( result["restime"] );// - Time.realtimeSinceStartup;

	warmStartRetryCnt = 0;

	if( needRestart() ){
		restartGame();
	}

}

private		var	warmStartRetryCnt:int = 0;
private	function reqWarmStartError( errorMsg:String, errorCode:String ){
	if( warmStartRetryCnt < 3 ){
		trackWarmStart();
		warmStartRetryCnt ++;
	}else{
		warmStartRetryCnt = 0;
	}
}

private	function trackWarmStart(){
	UnityNet.reqWarmStart(reqWarmStartOk, reqWarmStartError);
}

private function needRestart():boolean{
	var beginTime:long = Datas.instance().getLoginTime();
	var beginDateTime:System.DateTime = new System.DateTime(beginTime);
	var	nowDateTime:System.DateTime = System.DateTime.Now;

	return  (beginDateTime.Day != nowDateTime.Day && nowDateTime.Hour >= 4 )
			|| (beginDateTime.Day == nowDateTime.Day && beginDateTime.Hour < 4 && nowDateTime.Hour >= 4 )
			|| beginDateTime.Month != nowDateTime.Month
			|| beginDateTime.Year != nowDateTime.Year;
}

private    function passOneDay(beginTime:long):boolean
{
	var beginDateTime:System.DateTime = new System.DateTime(beginTime);
	var	nowDateTime:System.DateTime = System.DateTime.Now;

//	_Global.Log("day:" + nowDateTime.Day + " month:" + nowDateTime.Month + " year:" + nowDateTime.Year);

	return  beginDateTime.Day != nowDateTime.Day
			|| beginDateTime.Month != nowDateTime.Month
			|| beginDateTime.Year != nowDateTime.Year;
}

private function needPopupKabamId():boolean
{
	var lastTime:long = Datas.instance().getLastKabamIdTime();
	if(Datas.instance().getKabamId() != 0 )
	{
		return false;
	}
	var offsetTime:long = unixtime() - _Global.parseTime(seed["players"]["u"+ Datas.instance().tvuid() ]["fteFinishTime"]);
	if(offsetTime > 7*24*3600 || !passOneDay(lastTime))
		return false;
	return true;
}


private function saveData(){
	if( curScenceLevel >= CITY_SCENCE_LEVEL){
		Datas.instance().setScenceLevel(curScenceLevel);
	}
	if( cityController ){
		cityScaleFactor = cityController.getCurScaleFactor();
		if( cityScaleFactor > 0 ){
			Datas.instance().setCityScale(cityScaleFactor);
		}
	}

	if( fieldController ){
		fieldScaleFactor = fieldController.getCurScaleFactor();
		if( fieldScaleFactor > 0 ){
			Datas.instance().setFieldScale(fieldScaleFactor);
		}
	}
	if( USE_GHOST_MAP_2_CACHE_TILE_MOTIFS ) {
		GhostMap.getInstance().switchDataSet( true );
		GhostMap.getInstance().WriteToFile();
		GhostMap.getInstance().switchDataSet( false );
		GhostMap.getInstance().WriteToFile();
	}
}

public function OnApplicationQuit(){
	saveData();

	//SocketNet.GetInstance().Close();

	NewSocketNet.GetInstance().Close();
    m_AvaManager.ClearAll();
}


/* 除了指定的 ctr 以外 其他都需要执行 toBack 方法 */
private function SetControllerToBack(exceptionCtrKey: int) {

	for (var kv: KeyValuePair.<int, GestureController> in mapControllerDic) {
		if (exceptionCtrKey != kv.Key && kv.Value != null)
			kv.Value.toBack();
	}
}


public function setScenceLevel( lv : int ){
	LastSceneLevel = curScenceLevel;

	if (null != campaignLoadingCam && campaignLoadingCam.gameObject.activeSelf )
		campaignLoadingCam.gameObject.SetActive(false);

	if (null != avaLoadingCam && avaLoadingCam.gameObject.activeSelf )
		avaLoadingCam.gameObject.SetActive(false);

    CheckReportViewingType(lv);

	/* unload scene */
	checkUnloadScene(lv);

	/*	var campaignObj:GameObject = null;*/
	if (lv == FIELD_SCENCE_LEVEL)
	{

		SetControllerToBack(lv);

		fieldController.toFront();

		cloudMgr.setEnable(true);
		birdMgr.setEnable(true);
	}
	else if(lv == CITY_SCENCE_LEVEL)
	{
		SetControllerToBack(lv);


		cityController.toFront();

		cloudMgr.setEnable(true);
		birdMgr.setEnable(true);
		HealQueue.instance().checkAnimationState();
		Barracks.instance().checkSlotForAnimation();
		Research.instance().checkAnimationState();
		Technology.instance().checkAnimationState();
		MenuMgr.getInstance().MainChrom.setNeedResort( true );
	}
	else if(lv == WORLD_SCENCE_LEVEL || lv == AVA_MINIMAP_LEVEL )
	{
		SetControllerToBack(lv);


	    if( lv == WORLD_SCENCE_LEVEL )
	    {
			mapController.toFront();
		}
		else if( lv == AVA_MINIMAP_LEVEL )
		{
			mapController2.toFront();
		}
		cloudMgr.setEnable(false);
		birdMgr.setEnable(false);
		birdMgr.setEagleEnable(false);
	}
	else if(lv == CAMPAIGNMAP_SCENE_LEVEL)
	{
		SetControllerToBack(lv);

		cloudMgr.setEnable(false);
		birdMgr.setEnable(false);
		birdMgr.setEagleEnable(false);
		campaignMapController.SetLastSceneLevel(curScenceLevel);
		campaignMapController.toFront();
		MenuMgr.getInstance().sendNotification(Constant.Notice.PVE_ENTER_CAMPAIGNMAP_SCENE,null);
	}
	else if(lv == CHAPTERMAP_SCENE_LEVEL)
	{
		SetControllerToBack(lv);

		cloudMgr.setEnable(false);
		birdMgr.setEnable(false);
		birdMgr.setEagleEnable(false);
		chapterMapController.Init(GetCurChapterId());
		chapterMapController.toFront();
		MenuMgr.getInstance().sendNotification(Constant.Notice.PVE_ENTER_CHAPTERMAP_SCENE,chapterMapController.GetChapterId());
	}
	else if (lv == HERO_EXPLORE_LEVEL)
	{
		SetControllerToBack(lv);

	    heroExploreController.toFront();
	    MenuMgr.instance.sendNotification(Constant.Hero.HeroExploreSceneLoaded, null);
	    cloudMgr.setEnable(false);
	    birdMgr.setEnable(false);
	    birdMgr.setEagleEnable(false);
	}
	else if (lv == ALLIANCE_BOSS_LEVEL)
	{
		SetControllerToBack(lv);
		allianceBossController.toFront();
	}
	else if (lv == MISTEXPEDITION_LEVEL) {
		SetControllerToBack(lv);

		cloudMgr.setEnable(false);
		birdMgr.setEnable(false);
		birdMgr.setEagleEnable(false);
		mistExpeditionMapController.SetLastSceneLevel(curScenceLevel);

		mistExpeditionMapController.toFront();
	}


	curScenceLevel = lv;
	Technology.instance().ShowTechMerlinMenu();
	ParticalEffectMgr.getInstance().onScenceChanged(curScenceLevel);

	addScenceMsg();
	MenuMgr.getInstance().MainChrom.SetView(curScenceLevel);
	setViewPort();

	if(lv == FIELD_SCENCE_LEVEL)
		fteMgr.checkNextFTE(FTEConstant.Step.UP_BUILD_CLICK_FARM);
	if(lv == CITY_SCENCE_LEVEL)
		fteMgr.checkNextFTE(FTEConstant.Step.UP_TECH_CLICK_ACADEMY);
}

private function addScenceMsg(){
	if( getPlayerLevel() > 4 ){
		return;
	}

//	var arStrings:Object = Datas.instance().arStrings();
	var endY:float = 0;
	var msg:String = "";
	switch( curScenceLevel ){
	case	CITY_SCENCE_LEVEL:
		endY = MenuMgr.getInstance().MainChrom.btnRes.rect.yMax;
		msg = Datas.getArString("ToastMsg.Scence_City");
		break;

	case	FIELD_SCENCE_LEVEL:
		endY = MenuMgr.getInstance().MainChrom.btnRes.rect.yMax;
		msg = Datas.getArString("ToastMsg.Scence_Field");
		break;
	case	AVA_MINIMAP_LEVEL:
	case	WORLD_SCENCE_LEVEL:
		endY = MenuMgr.getInstance().MainChrom.CoordingBarHeight;
		msg = Datas.getArString("ToastMsg.Scence_World");
		break;
	case	CAMPAIGNMAP_SCENE_LEVEL:
//		endY = MenuMgr.getInstance().MainChrom.CoordingBarHeight;
//		msg = Datas.getArString("ToastMsg.Scence_World");
		break;
	case 	CHAPTERMAP_SCENE_LEVEL:
	    break;
    case HERO_EXPLORE_LEVEL:
        break;
	}
	if( msg == null || msg.Length <= 0 )
		return;

	endY /= vertRatio;

	MenuMgr.getInstance().PushScenceMessage(msg,Rect(0,endY - 100 - 10,640,140),Rect(0,endY - 10, 640, 140));
}

public function getScenceLevel():int{
	return curScenceLevel;
}

public function getCityScaleFactor():float{
	return cityScaleFactor;
}

public function getFieldScaleFactor():float{
	return fieldScaleFactor;
}

public function setCityController(cc:CityController){
	cityController = cc;
}

public function getCityController():CityController
{
	return cityController;
}

public function setFieldController(fc:FieldsController){
	fieldController = fc;
}

public function getFieldController():FieldsController
{
	return fieldController;
}

public function setMapController(mc:MapController){
	mapController = mc;
}

// temporary, overrided function in GameMain.cs, TODO remove me if possible
public function getMapViewControllerTransform(idx:int):Transform
{
	if (idx == 0 && cityController) return cityController.transform;
	if (idx == 1 && fieldController) return fieldController.transform;
	if (idx == 2 && mapController) return mapController.transform;
	return null;
}

public function getCampaignMapController():CampaignMapController
{
	return campaignMapController;
}

public function getChapterMapController():ChapterMapController
{
	return chapterMapController;
}

public function getChapterID():int
{
	if(chapterMapController != null)
	{
		return chapterMapController.GetChapterId();
	}
	return -1;
}

public function getHeroExploreController():HeroExploreController
{
    return heroExploreController;
}


public function GetMistExpeditionMapController(): MistExpeditionMapController {
	return mistExpeditionMapController;
}




public function getAllianceBossController():AllianceBoss
{
    return allianceBossController;
}

public function SetCityCameraPos(pos : Vector2)
{
	//cityController.actScale();
	cityController.SetCityCameraPos(pos);
}

public function getBuildingPos(slotId:int):Vector2
{
	if(slotId < 100)
	{
		return cityController.getBuildingPos(slotId);
	}

	return Vector2.zero;
}

public function getSlotScreenPos(slotId:int):Vector2
{
	if(slotId < 100)
	{
		return cityController.getSlotScreenPos(slotId);
	}

	return fieldController.getSlotScreenPos(slotId);
}
public function nextLevel()
{
	var nextScenceLevel = curScenceLevel+ 1;

	if( USE_AVA_MINIMAP_AS_FORTH_SEQUENCED_SCENE )
	{
		if( nextScenceLevel == AVA_MINIMAP_LEVEL + 1 )
			nextScenceLevel = 2;
		else if( nextScenceLevel > 4 )
			nextScenceLevel = AVA_MINIMAP_LEVEL;
	}
	else
	{
		if(nextScenceLevel > 4)
			nextScenceLevel = 2;
	}

//	_Global.Log("Application loadNextLevel:" + nextScenceLevel );
	MenuMgr.getInstance().scenceMessage.forceFinish();
	loadLevel(nextScenceLevel);
}

public function loadLevel( level:int ){
	if( curScenceLevel == level ){
		return;
	}

	if (!loadedLevel[level]) {

		if(!loadingLevel[level]) {
			loadingLevel[level] = true;
			Application.LoadLevelAdditiveAsync(level);
		    FreeRAM();
		}
	}
	else {
		setScenceLevel(level);
	}

	PlaySceneMusic(level);

	if(level == CAMPAIGNMAP_SCENE_LEVEL && campaignMapController!=null)
	{
		campaignMapController.OnEnterScene();
	}

}

public function onHitSlot(slotId:int):void
{

	if(curScenceLevel == CAMPAIGNMAP_SCENE_LEVEL)
	{
		if(campaignMapController != null)
		{
			campaignMapController.OnHitSlot(slotId);
		}
		return;
	}
	else if(curScenceLevel == CHAPTERMAP_SCENE_LEVEL)
	{
		if(chapterMapController != null)
		{
			chapterMapController.OnHitSlot(slotId);
		}
		return;
	}

	else if (curScenceLevel == MISTEXPEDITION_LEVEL) {
		if (mistExpeditionMapController != null) {
			mistExpeditionMapController.OnHitSlot(slotId);
		}
		return;
	}

	if ((curScenceLevel == CITY_SCENCE_LEVEL && slotId >= 100) || (curScenceLevel == FIELD_SCENCE_LEVEL && slotId < 100) )
	{
		return;
	}

	if( curScenceLevel == FIELD_SCENCE_LEVEL && slotId == FieldsController.CASTLE_SLOT_ID)
	{
		loadLevel(CITY_SCENCE_LEVEL);
		return;
	}

	var a:HashObject = seed["buildings"]["city"+curCityId]["pos"+slotId];

	if( a == null || a.Table.Count == 0 )
	{
		Building.instance().openCreatBuilding(slotId);
	}
	else
	{
	//there's bug here.if creat a new building .here return an index Array.not Hash Array.
//		var lv:int = _Global.INT32(a[_Global.ap + 1]);
		var type:int = _Global.INT32(a[_Global.ap + 0]);
		//Building.instance().deleteAction(type,lv,slotId);
		Building.instance().openStandardBuilding(type,slotId);
	}
}

public function onBuildingStart(slotId:int, buildingTypeId:int, newLevel:int){
	onBuildingStart(slotId,buildingTypeId,newLevel,null);
}
public function onBuildingStart(slotId:int, buildingTypeId:int, newLevel:int, qItem:QueueItem){
	if( !initOver )
		return;

//	_Global.Log("on Building Start in main");
	if( cityController && slotId < 100){
		cityController.addBuildingAnimation( slotId, buildingTypeId );

	}else if( fieldController && slotId >= 100 ){
		fieldController.addBuildingAnimation( slotId, buildingTypeId );

	}

	MenuMgr.getInstance().OnStartBuild(qItem);
}

public function buildingTechnology(slotId:int, buildingTypeId:int, curLevel:int)
{
	cityController.addPrestigeAniWithBuilding(slotId, buildingTypeId, curLevel);
}

public function onBuildingFinish(slotId:int, buildingTypeId:int, newLevel:int, lastLevel:int){

	//UpdateSeed.instance().update_seed_ajax(true, null);

	seedUpdateAfterQueue(true);
	UpdateSeed.instance().followCheckQuestForBuiding(2);

//	_Global.Log("on Building Finish in main slotId:" + slotId);
	var ctller:SlotBuildController;


	if( slotId < 100){
		ctller = cityController;

		if( buildingTypeId == Constant.Building.PALACE && fieldController){//castle, change field slots
			fieldController.onCastleLevelChanged(newLevel);
		}
	}else if( slotId >= 100 ){
		ctller = fieldController;
	}

	if(!ctller)
		return;

	if( newLevel ){
		if( gdsManager.GetGds.<GDS_Building>().isPrestigeLevel( buildingTypeId, lastLevel ) && newLevel > lastLevel ){

			ctller.addPrestigeAniWithBuilding(slotId, buildingTypeId, newLevel);
		}else{
			ctller.addBuilding(slotId, buildingTypeId, newLevel);
		}
	}else{ //new level == 0; back to empty slot
		ctller.removeBuilding(slotId);
	}

	if(buildingTypeId == 0 && lastLevel == Constant.CarmotLimitLevel-1){
					//_Global.Log("<color=#00ff00>new resource Unlock...</color>");
				if(!PlayerPrefs.HasKey(GameMain.instance().getUserId()+"carmotGuid"))
					{
						MenuMgr.instance.PopMenu("");
						MenuMgr.getInstance().PushMenu("CarmotIntroDialog",{"type":0},"trans_pop");
						GetCarmotIntroEmail();
					}

//					var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
//					mainChrom.priv_initLayout();
		}
}

private function GetCarmotIntroEmail(){
	var okFunc = function(result:HashObject)
		{
		//To do ...
		};

	UnityNet.GetCarmotIntroEmail(curCityId, okFunc, null);
}

public function reqWorldMapOk()
{
	if( mapController ){
		mapController.reqWorldMapOk();
	}
}

//start world map
public function onReqWorldMap(blockNames:Array, okFunc:Function, errorFunc:Function){
	var list:System.Collections.Generic.List.<String> = new System.Collections.Generic.List.<String>();
	for(var name in blockNames) {
		list.Add(name as String);
	}
	onReqWorldMap(list, okFunc, errorFunc);
}

public function searchWorldMap(x:int, y:int){
	if( mapController ){
		mapController.setSearchedTileToHighlight( x, y );
		mapController.search(x,y);
	}
}

public function searchWorldMap2(x:int, y:int){
	if( mapController2 ){
		mapController2.setSearchedTileToHighlight( x, y );
		mapController2.search(x,y);
	}
}

public function toggleShowTileLevel() {
	if( mapController ) {
		mapController.toggleShowTileLevel();
	}
}

public function toggleShowTournamentInfo() {
	if( mapController ) {
		mapController.showTournamentInfo();
	}
}

public function toggleShowAVAMarchLineInfo() {
	if( mapController2 ) {
		mapController2.showAVAMarchLineInfo();
	}
}

public function setCloudMaskEnabled( enabled : boolean ) {
	if( mapController2 ) {
		mapController2.setCloudMaskEnabled( enabled );
	}
}


public function GetTileInfoPopup()
{
	if( mapController )
	{
		var tileInfoPopUpScript:TileInfoPopUp = mapController.tileInfoPopUp.GetComponent("TileInfoPopUp");
		return tileInfoPopUpScript;
	}
	return null;
}

public function GetTileInfoPopup2()
{
	if( mapController2 )
	{
		var tileInfoPopUpScript:TileInfoPopUp = mapController2.tileInfoPopUp.GetComponent("TileInfoPopUp");
		return tileInfoPopUpScript;
	}
	return null;
}


public function hideTileInfoPopup(){
	if( mapController ){
		var tileInfoPopUpScript:TileInfoPopUp = mapController.tileInfoPopUp.GetComponent("TileInfoPopUp");
		tileInfoPopUpScript.dismiss();
	}
}

public function hideTileInfoPopup2(){
	if( mapController2 ){
		var tileInfoPopUpScript:TileInfoPopUp = mapController2.tileInfoPopUp.GetComponent("TileInfoPopUp");
		tileInfoPopUpScript.dismiss();
	}
}
//end world map


/* get player lv
 * 获得玩家的等级
 */
public	function getPlayerLevel():int{
	if (seed != null && seed.Contains("player") && seed["player"].Contains("title")) {
		return _Global.INT32(seed["player"]["title"]);
	}
	else {
		return 10;
	}
 
}


public function getPlayerMight() : long{
	return _Global.INT64(seed["player"]["might"]);
}

public function getPlayerCityCount() : int{
	return seed["cities"].Table.Count;
}

public function getPlayerGems() : int{
	return _Global.INT32(seed["player"]["gems"]);
}

public function getPlayerWorldGems() : int{
	return _Global.INT32(seed["player"]["worldGems"]);
}

public function getPlayerShadowGems() : int{
	return _Global.INT32(seed["player"]["shadowGems"]);
}

public function getPlayerName() : String{
	return seed["player"]["name"].Value as String;
}

public function isWritePaymentLog() : String{
	return seed["isWritePaymentLog"].Value.ToString();
}

public function isForceServerMerge() : int
{
	return _Global.INT32(seed["serverMerge"]["forceMerge"].Value);
}

public function getChancellorInactiveTime() : String{
    return seed["chancellorInactiveTime"].Value.ToString();
}

public function getDeadLine() : String{
    return seed["deadLine"].Value.ToString();
}

public function getJoinTimes() : String{
    return seed["joinTime"].Value.ToString();
}

public function canMigrate() : boolean{
	return _Global.INT32(seed["canMigrate"])==1?true:false;
}

public function migrateState() : int{
	return _Global.INT32(seed["migrate"]);
}

public function getMainCityId() : int
{
	var cities: Hashtable = seed["cities"].Table;
	var hashObj: HashObject = null;
	for (var i: System.Collections.DictionaryEntry in cities) {
		hashObj = i.Value as HashObject;
		if (_Global.INT32(hashObj[_Global.ap+6]) == 1){
			return _Global.INT32(hashObj[_Global.ap+0]);
		}
	}
	return 0;
}

public function isMainCity() : boolean
{
	var currentCityInfo : HashObject = GetCityInfo(curCityId);
	if(currentCityInfo != null) {
		if (_Global.INT32(currentCityInfo[_Global.ap + 6]) == 1){
			return true;
		}
	}

	return false;
}

public function GetCityInfo(cityId:int):HashObject
{
	var cities:Hashtable = seed["cities"].Table;
	for(var i:System.Collections.DictionaryEntry in cities){
		if(_Global.INT32((i.Value as HashObject)[_Global.ap+0]) == cityId){
			return i.Value;
		}
	}
	return seed["cities"][_Global.ap + 0]; /* default to 0 in case something goes wrong - don't kill whole map*/
}

public function changeRallyMarchItem( march : PBMsgMarchInfo.PBMsgMarchInfo):void
{
	March.instance().changeRallyMarchItem(march);
}

public function checkMySelfRallyMarchIsReturn(marchs : System.Collections.Generic.List.<PBMsgMarchInfo.PBMsgMarchInfo>):void
{
	March.instance().checkMySelfRallyMarchIsReturn(marchs);
}

public function syncSeedMarch(cityId : int, marchId : int) : void
{
	March.instance().syncSeedMarch(cityId, marchId);
}

public function getMarchesInfo() : void
{
	if(seed != null)
	{
		UnityNet.getMarchesInfo(getMarchesInfoSuccess, null);
	}
}

public function getMarchesInfoSuccess(result : HashObject) : void
{
	if(result["marches"] != null)
	{
		seed["outgoing_marches"] = result["marches"];
		March.instance().getMarchesInfo(result);
	}
}

function	OnGUI(){

	_Global.setGUIMatrix();
	ShowFps.Draw();
	if(!errorMgr.IsShowError() ){
		return;
	}

	errorMgr.Draw();
}

function	FixedUpdate()
{
	errorMgr.FixedUpdate();

	ParticalEffectMgr.getInstance().Update();
}

public function updateAni(){
	if( cloudMgr != null ) cloudMgr.Update();
	if( birdMgr != null ) birdMgr.Update();
//	if( rainMgr != null ) rainMgr.Update();
}


function Update ()
{
	gameDeltaTime += Time.deltaTime;
	ShowFps.Update();
	if( m_resetViewport )
	{
		m_resetViewport = false;
		setViewPort();
	}

	if(PlayerPrefs.HasKey("loadReport") && PlayerPrefs.GetInt("loadReport")==1){
			PlayerPrefs.SetInt("loadReport",0);
			Message.getInstance().DownLoadReports(function() {
				/*_Global.Log("download message success.......");*/
				},"");
	}


	//for loading campaign scene animation
	if(!m_bPveGDSOnReady && gdsManager.GdsesOfCategoryAreLoaded(GdsCategory.Pve))
	{
		m_bPveGDSOnReady = true;
		KBN.PveController.instance().PveGDSOnReady();
	}
	if(m_bCanEnterCampaignScene && gdsManager.GdsesOfCategoryAreLoaded(GdsCategory.Pve))
	{
		m_bCanEnterCampaignScene = false;
		KBN.PveController.instance().ReqPveInfo();
	}

	//SocketNet.GetInstance().Update();
	NewSocketNet.GetInstance().Update();

	SwitchMusicLogic();


	if( Application.platform == RuntimePlatform.IPhonePlayer ){
		return;
	}
	if( Application.platform == RuntimePlatform.Android ){
		return;
	}
	//mouse support, add by sc
	if (GestureController.MouseSupport) return;

	var mgr: MenuMgr = MenuMgr.getInstance();
	if (mgr != null || !mgr.CanTouchMap() || !mgr.MainChrom)
		return;


	if(Input.GetMouseButtonDown(0))
	{
		if (TouchForbidden || ForceTouchForbidden) return;

		var cameraRect:Rect = Camera.main.pixelRect;

		switch( curScenceLevel ){
		case CITY_SCENCE_LEVEL:
			cameraRect = cityController.viewRect;
			break;
		case FIELD_SCENCE_LEVEL:
			cameraRect = fieldController.viewRect;
			break;
		case AVA_MINIMAP_LEVEL:
			cameraRect = mapController2.viewRect;
			break;
		case WORLD_SCENCE_LEVEL:
			cameraRect = mapController.viewRect;
			break;
		case CAMPAIGNMAP_SCENE_LEVEL:
			cameraRect = campaignMapController.viewRect;
			break;
		case CHAPTERMAP_SCENE_LEVEL:
			cameraRect = chapterMapController.viewRect;
			break;
        case HERO_EXPLORE_LEVEL:
            cameraRect = heroExploreController.viewRect;
			break;
		case MISTEXPEDITION_LEVEL:
			cameraRect = mistExpeditionMapController.viewRect;
			break;
		}





//		_Global.Log(" progressArea:" + progressArea+ " mpos:"  + Input.mousePosition);
		ParticalEffectMgr.getInstance().playEffect(ParticalEffectMgr.ParticalEffectType.snow);

		if( !cameraRect.Contains( Input.mousePosition) )
			return;
		if ( MenuMgr.getInstance().isHitUI(Input.mousePosition) )
			return;

		hitMouse(Input.mousePosition);
		return;
	}



}

private function hitMouse(position:Vector3)
{
	//var touch:Touch = Input.touches[0];
//	if( touch.phase == TouchPhase.Ended){
		var ray:Ray = Camera.main.ScreenPointToRay(position);
		var raycastHit:RaycastHit;
		if( Physics.Raycast(ray,raycastHit) )
		{
			if(curScenceLevel == CITY_SCENCE_LEVEL )
			{
				cityController.hitSlot(raycastHit);
			}
			else if( curScenceLevel == FIELD_SCENCE_LEVEL )
			{
//				var slotId : int;
//				slotId = _Global.INT32(raycastHit.transform.name);
//				onHitSlot(slotId);
				fieldController.hitSlot(raycastHit);
			}
			else if( curScenceLevel == WORLD_SCENCE_LEVEL )
			{
				var pos:Vector2 = new Vector2(position.x, position.y);
				mapController.onTouchBegin(pos);
				mapController.hit(pos);
			}
			else if( curScenceLevel == AVA_MINIMAP_LEVEL )
			{
				var pos2:Vector2 = new Vector2(position.x, position.y);
				mapController2.onTouchBegin(pos2);
				mapController2.hit(pos2);
			}
			else if(curScenceLevel == CAMPAIGNMAP_SCENE_LEVEL )
			{
				campaignMapController.hitSlot(raycastHit);
			}
			else if (curScenceLevel == CHAPTERMAP_SCENE_LEVEL)
			{
				chapterMapController.hitSlot(raycastHit);
			}
			else if (curScenceLevel == HERO_EXPLORE_LEVEL)
			{
			    heroExploreController.hitSlot(raycastHit);
			}
			else if (curScenceLevel == MISTEXPEDITION_LEVEL) {
				mistExpeditionMapController.hitSlot(raycastHit);
			}

		}
//	}
}


/* ////////use item city move//////// */
public function moveCityTo( x:int, y:int ){
	Bookmark.instance().moveCityTo(x,y);
	mapInitCenterX = x;
	mapInitCenterY = y;

	if( mapController){
		mapController.moveCityTo(x, y );
	}

	loadLevel(WORLD_SCENCE_LEVEL);
	var bar:CoordinateBar = MenuMgr.getInstance().MainChrom.coordinateBar;
	bar.setXFieldContent(x + "");
	bar.setYFieldContent(y + "");
}

private var isSearchTile:boolean = false;
private var searchX:int;
private var searchY:int;



public function setSearchedTileToHighlight( x:int, y:int ) {
	if( mapController ) {
		mapController.setSearchedTileToHighlight( x, y );
	}
}

public function gotoMap( x:int, y:int ){

	if(curScenceLevel == CAMPAIGNMAP_SCENE_LEVEL || curScenceLevel == CHAPTERMAP_SCENE_LEVEL)
	{
		MenuMgr.getInstance().PopMenu("PveMainChromMenu");
	}

	isSearchTile = true;

	searchX = x;
	searchY = y;

	if(mapController == null)
	{
		mapInitCenterX = x;
		mapInitCenterY = y;
	}

	loadLevel(WORLD_SCENCE_LEVEL);

	Invoke("delaySearchMap", 2);
}

public function delaySearchMap()
{
	if( mapController )
	{
		mapController.search(searchX, searchY);
	}
}

public function setSearchedTileToHighlight2( x:int, y:int ) {
	if( mapController2 ) {
		mapController2.setSearchedTileToHighlight( x, y );
	}
}
public function gotoMap2( x:int, y:int ){

	isSearchTile = true;

	searchX = x;
	searchY = y;

	if( mapController2 ){
		mapController2.search( x, y );
	}else{
		mapInitCenterX = x;
		mapInitCenterY = y;
	}

	if( curScenceLevel != AVA_MINIMAP_LEVEL)
	{
		LoadAVAAnimation();
	}
}

public function restartGame(){

	PlayerPrefs.SetInt("isRestart",1);

	Application.RegisterLogCallbackThreaded(null);
	CancelInvoke();
	saveData();

	//	maybe unit net RPC return later,
	// 		to avoid accessing MenuMgr in delegate process, we must free that before MenuMgr destory .
	UnityNet.free();
	//Data and menumgr are special, they start before gamemain.
	MenuMgr.free();
	m_isPushedMainChrome = false;

	GameCenterHelper.SetEnable(false);
	for( var i:int = restartFuncs.Count - 1 ; i >= 0; i -- ){
		restartFuncs[i].DynamicInvoke([]);
	}
	restartFuncs.Clear();

	Datas.free();

    StatePopupEntranceController.ClearInstance();
    DailyQuestManager.ClearInstance();
    ToastNetHook.ClearInstance();
    DailyLoginRewardMgr.ClearInstance();
    PaymentOfferManager.ClearInstance();

    //SocketNet.GetInstance().Close();
    NewSocketNet.GetInstance().Clear();
    m_AvaManager.ClearAll();
	TextureMgr.instance().Clear();
	HeroManager.Free();
	m_bPveGDSOnReady = false;
	m_bCanEnterCampaignScene = false;
	coldStart = false;
	KBN.FTEMgr.restartSetFTE();

	if(PopupMgr.getInstance() != null)
	{
		PopupMgr.getInstance().clearCurPopInfor();
	}
	UnityNet.setInLoadingScene( true);
	StopAllCoroutines();
    KBN.Game.Shutdown();
	Application.LoadLevel("Loading");
//	this.enabled = false;
	this.gameObject.SetActive(false);
	singleton = null;
}

public function dealyCallUpdateSeed(delay:int)
{
	Invoke("_dellayupdateseed",delay);
}
private function _dellayupdateseed()
{
	//UpdateSeed.instance().update_seed_ajax(true,null);
	seedUpdateAfterQueue(true);
}

public function sendRemotePushToken():void
{
	//device token. system push setting
	if(seed != null && seed["push"] == null)
		seed["push"] = new HashObject();
	UnityNet.SendPushToKen(null,null);
}

public function sendPushSettings():void
{
	/* system push setting, game push setting*/
	if(seed != null){
		var pushData = seed["push"];
		if (pushData != null)
			UnityNet.UpdateContentPushSetting(_Global.INT32(pushData["city_set"]), _Global.INT32(pushData["march_set"]), _Global.INT32(pushData["mail_set"]),null,null);

	}
}

public function sendDeviceToken(deviceToken : String) : void
{
	var token : String = deviceToken;
	PlayerPrefs.SetString(Constant.NativeDefine.KMP_DEVICE_TOKEN,token);
//	_Global.Log("GameMain.sendDeviceToken   DeviceToken : " + token);
//	UnityNet.reportErrorToServer("IOS_Device_Token Test : ",null,null,token,false);
}

// auto send
public function sendPushBI(msg:String):void
{
	if(msg == null && PlayerPrefs.HasKey(Constant.NativeDefine.KMP_PUSH_STOREKEY) )
	{
		msg = PlayerPrefs.GetString(Constant.NativeDefine.KMP_PUSH_STOREKEY,null);
		PlayerPrefs.DeleteKey(Constant.NativeDefine.KMP_PUSH_STOREKEY);
	}

	if(msg == null)
		return;

	var biObj:HashObject = (new JSONParse()).Parse(msg); //
	var type:int = _Global.INT32(biObj["type"]);
	var biStr:String = biObj["bi"].Value;
	/*
	type
		1: Normal Enter
		2: Normal + Badge Enter
		3: Local Push Enter
		4: Remote Push Enter
	*/
	if(type == 4)
		type = 3;

	//_Global.Log("SEND PUSH BI : " + msg);
	if(biStr != null && biStr.Length > 0)
		UnityNet.SendPushBI(biStr,type);
}



//reload Data...
public function reloadData():void
{
	var params1:Array = new Array();
	params1.Add("data");
	params1.Add(Datas.instance().getLastLoadDataVersion() );

	var dataOkFunc:Function = function(bytes:byte[], texts:String)
	{
//		saveDataThread = new Thread(function()
//		{
			Datas.instance().setData(bytes, texts, false,true );
			loadedCheck("data",true);
//		});
//		saveDataThread.Start();
	};

	var	dataErrorFunc:Function = function(msg:String, errorCode:String)
	{
		loadedCheck("data",false);
	};
	UnityNet.checkData(params1, dataOkFunc, dataErrorFunc );

}

public function reloadStrings():void
{
	var language:String = Datas.instance().getGameLanguageAb();
	var params2:Array = new Array();
	params2.Add("string");
	params2.Add(language);
	params2.Add(Datas.instance().getLastLoadStrVersion());

	var strOkFunc:Function = function(bytes:byte[], texts:String)
	{
//		saveStrThread = new Thread(function()
//		{
			Datas.instance().setStrings(bytes, texts, false,true);
			loadedCheck("string",true);
//		});
//		saveStrThread.Start();
	};

	var	strErrorFunc:Function = function(msg:String, errorCode:String)
	{
		loadedCheck("string",false);
	};

	UnityNet.checkString(params2, strOkFunc, strErrorFunc );
}

private function loadedCheck(type:String,success:boolean):void
{
	switch(type)
	{
		case "data":
			Flags.instance().D_DATA_LOADED = true;
			break;
		case "string":

			Flags.instance().D_STR_LOADED = true;
			break;
	}
	//_Global.Log("loaded Check : " + type + " : " + success);
}


public function checkUpdateSeed(result:HashObject):void
{
	if(Flags.instance().D_ALL_RELOAD  == true )
		return;
//	Datas.instance().hackLastVersion();	//TEST.
	StartCoroutine("startReload", result);
}

private function startReload(result:HashObject)
{
	var local_last_strV:long = _Global.INT64(Datas.instance().getLastLoadStrVersion() );
	var local_last_dataV:long = _Global.INT64(Datas.instance().getLastLoadDataVersion() );

	var rmt_strV:long = _Global.INT64(result["strVersion"]);
	var rmt_dataV:long = _Global.INT64(result["dataVersion"]);


	//_Global.Log("Start  last Local strV/dataV: "+ local_last_strV + " / " + local_last_dataV);
	//_Global.Log("Start  remote strV/dataV: "+ rmt_strV + " / " + rmt_dataV);

	var needLoad:boolean = rmt_strV > local_last_strV || rmt_dataV > local_last_dataV;

	if(!needLoad)
		return;

	var flags:Flags = Flags.instance();
	if(flags.D_ALL_RELOAD == false)
	{

		flags.D_ALL_RELOAD = true;
		flags.NeedRestartForData = false;
		flags.NeedRestartForStrings = false;

		if(rmt_dataV > local_last_dataV )
			reloadData();
		else
			loadedCheck("data",true);

		if(rmt_strV > local_last_strV )
			reloadStrings();
		else
			loadedCheck("string",true);


		while (flags.D_DATA_LOADED == false || flags.D_STR_LOADED == false)
		{
			yield;
		}

		Datas.instance().PermanentCacheFile(Datas.instance().getFullStrFilePath());
		Datas.instance().PermanentCacheFile(Datas.instance().getFullDataFilePath());

		flags.D_DATA_LOADED = false;
		flags.D_STR_LOADED = false;
		flags.D_ALL_RELOAD = false;

		//restart Game..
		if(flags.GetRestartGameFlag())
		{
			ErrorMgr.instance().PushError("",Datas.getArString("PopUpInfor.InGame_Restart_Content"),false, Datas.getArString("FTE.Restart"),restartGame);
		}
	}
}

private function fix_hackSeed(seed:Object):void
{
	Payment.instance().blueLightData.init(seed);
}

public function setLoopCntOfCurMusic(cnt:int)
{
	loopCntOfCurMusic = cnt;
}

private function getLoopCntOfCurMusic()
{
	return loopCntOfCurMusic;
}

public function setCurMusicName(name:String, ota:String)
{
	curMusicName = name;
	curMusicOTAType = ota;
}

public function Verify(x:int,y:int){
	VerifyMenu.GetInstance().SetValue(x,y);
}

private function getCurMusicName():String
{
	return curMusicName;
}

public function setLastMusicName(name:String, ota:String)
{
	lastMusicName = name;
	lastMusicOTAType = ota;
}

private function getLastMusicName():String
{
	return lastMusicName;
}

public function getJoinTime():int
{
	if(seed && seed["player"] && seed["player"]["datejoinUnixTime"])
	{
		return _Global.INT64(seed["player"]["datejoinUnixTime"]);
	}
}

public function getEventIdFromBossCoord(x:String,y:String):String
{
	if(seed["geEvent"]!=null && seed["geEvent"]["events"]!=null)
	{
		var tempArray:Array = _Global.GetObjectValues(seed["geEvent"]["events"]);
		var eventItem:HashObject;
		if(tempArray.length > 0)
		{
			for(var j:int=0; j < tempArray.length; j++)
			{
				eventItem = tempArray[j] as HashObject;
				if(eventItem["bossInfo"] && eventItem["bossInfo"]["tiles"])
				{
					var bossArray:Array = _Global.GetObjectValues(eventItem["bossInfo"]["tiles"]);
					if(bossArray.length > 0)
					{
						var bossInfo:HashObject;
						bossInfo = bossArray[0] as HashObject;
						if(_Global.GetString(bossInfo["x"])==x && _Global.GetString(bossInfo["y"])==y)
							return _Global.GetString(eventItem["eventId"]);
					}
				}
			}
		}
	}
	return null;
}

public function getBossName():String
{
	if(seed["geEvent"]!=null && seed["geEvent"]["events"]!=null)
	{
		var tempArray:Array = _Global.GetObjectValues(seed["geEvent"]["events"]);
		var eventItem:HashObject;
		if(tempArray.length > 0)
		{
			for(var j:int=0; j < tempArray.length; j++)
			{
				eventItem = tempArray[j] as HashObject;
				if(eventItem["bossInfo"] && eventItem["bossInfo"]["name"])
				{
					return _Global.GetString(eventItem["bossInfo"]["name"]);
				}
			}
		}
	}
	return null;
}

public function haveAwardEvent():boolean
{
	if(seed["geEvent"]!=null && seed["geEvent"]["events"]!=null)
	{
		var tempArray:Array = _Global.GetObjectValues(seed["geEvent"]["events"]);
		var eventItem:HashObject;
		if(tempArray.length > 0)
		{
			for(var j:int=0; j < tempArray.length; j++)
			{
				eventItem = tempArray[j] as HashObject;
				if(_Global.GetString(eventItem["prize"]) == Constant.EventCenter.PrizeStatus.PRIZE)
					return true;
			}
		}
	}
	return false;
}

public function getBossCoord(eventId:String):Vector2
{
	var vRet:Vector2;
	if(seed["geEvent"]!=null && seed["geEvent"]["events"]!=null)
	{
		var tempArray:Array = _Global.GetObjectValues(seed["geEvent"]["events"]);
		var eventItem:HashObject;
		if(tempArray.length > 0)
		{
			for(var j:int=0; j < tempArray.length; j++)
			{
				eventItem = tempArray[j] as HashObject;
				if(_Global.GetString(eventItem["eventId"]) == eventId)
				{
					if(eventItem["bossInfo"] && eventItem["bossInfo"]["tiles"])
					{
						var bossArray:Array = _Global.GetObjectValues(eventItem["bossInfo"]["tiles"]);
						var bossInfo:HashObject;
						if(bossArray.length > 0)
						{
							bossInfo = bossArray[0] as HashObject;
							vRet.x = _Global.INT32(bossInfo["x"]);
							vRet.y = _Global.INT32(bossInfo["y"]);
							break;
						}
					}
				}
			}
		}
	}
	return vRet;
}

// 0: close, others:open, 0 default
public function getPrestigeOnOff():int
{
	if(seed["prestige"] != null)
	{
		return _Global.INT32(seed["prestige"]);
	}
	return 0;
}


//rate : 1/2 default
public function getTrainRefundTroopRate_Numerator():int
{
	var ret:int = 1;
	if(seed["trianRefundTroopRate"] != null)
	{
		var rate:String = _Global.GetString(seed["trianRefundTroopRate"]);
		if(rate.Contains(":"))
		{
			var arr:Array = rate.Split(":"[0]);
			if(arr.length == 2)
			{
				ret = _Global.INT32(arr[0]);
			}
		}

	}
	return ret;
}

public function getTrainRefundTroopRate_Denominator():int
{
	var ret:int = 2;
	if(seed["trianRefundTroopRate"] != null)
	{
		var rate:String = _Global.GetString(seed["trianRefundTroopRate"]);
		if(rate.Contains(":"))
		{
			var arr:Array = rate.Split(":"[0]);
			if(arr.length == 2)
			{
				ret = _Global.INT32(arr[1]);
			}
		}
	}
	return ret;
}

public function IsPveOpened():boolean
{
	if(seed["pveOpened"] != null)
	{
		return (_Global.INT32(seed["pveOpened"]) != 0);
	}
	return false;
}

public function IsVipOpened():boolean
{
	if(seed["vipOpened"] != null)
	{
		return (_Global.INT32(seed["vipOpened"]) != 0);
	}
	return false;
}

public function IsPveBossOpened():boolean
{
	if(seed["pveBossOpened"] != null)
	{
		return (_Global.INT32(seed["pveBossOpened"]) != 0);
	}
	return false;
}

/* 是否开启迷雾远征 活动 */
public function IsMistExpeditionOpened(): boolean {
	if (seed["EXPEDITION_SWITCH"] != null) {
		return (_Global.INT32(seed["EXPEDITION_SWITCH"]) != 0);
	}
	return false;
}


/* 是否开启第三方支付接口 */
public function IsOpenThirdPartyPayment(): boolean {

	if (seed["XSOLLA_PAYMENT"] != null) {
		return (_Global.INT32(seed["XSOLLA_PAYMENT"]) != 0);
	}
	return false;
}

/* 获得 三方支付的网址链接 */
public function GetThirdPartyPaymentURL(): String {

	var url = Constant.ThirdPartyPayment.ThirdPartyPaymentURL;

	if (seed["XSOLLA_PAYMENT_URL"] != null) {
		var tempURL = _Global.GetString(seed["XSOLLA_PAYMENT_URL"]);
		if (!String.IsNullOrEmpty(tempURL))
			url = tempURL;
	}

	return url;
}


/* 账号删除 功能的开关 */
public function IsOpenDeleteAccount(): boolean {

	if (seed["CANCEL_ACCOUNT_URL_SWITCH"] != null) {
		return (_Global.INT32(seed["CANCEL_ACCOUNT_URL_SWITCH"]) != 0);
	}
	return false;
}

/* 账号删除 功能的跳转链接 */
public function GetDeleteAccountURL(): String {

	var url = "";

	if (seed["CANCEL_ACCOUNT_URL"] != null) {
		var tempURL = _Global.GetString(seed["CANCEL_ACCOUNT_URL"]);
		if (!String.IsNullOrEmpty(tempURL))
			url = tempURL;
	}

	return url;
}

/*PVP 等级限制等级显示*/
public function GetPvpLevelRestrict(): String {
	var url = "";

	if (seed["PVP_ADMIT_LEVEL"] != null) {
		url = _Global.GetString(seed["PVP_ADMIT_LEVEL"]);
		if (String.IsNullOrEmpty(url))
			url = "00000";/*表示后端返回的数据有问题*/
	} else {
		url = "11111";/*表示后端没有返回数据*/
	}
	return url;
}


public function OnPveBossSwitchClosed()
{
	if(curScenceLevel == CAMPAIGNMAP_SCENE_LEVEL)
	{
		if(campaignMapController != null)
		{
			campaignMapController.DestroyAllBoss();
		}
	}
}

public function SyncPlayerData()
{
	KBNPlayer.Instance().SetSeed(seed);


	/* 更新本地的玩家等级 */
	Datas.instance().SetPlayerCurrentLevel(getPlayerLevel());

}

public function getUserName():String
{
	if(seed != null && seed["players"] != null
	 && seed["players"]["u"+ Datas.instance().tvuid() ] != null && seed["players"]["u"+ Datas.instance().tvuid() ]["n"] != null)
	{
		return _Global.GetString(seed["players"]["u"+ Datas.instance().tvuid() ]["n"]);
	}
	return "";
}


public function getTroopSaleDataFromSeed(troopType:String,troopId:int):HashObject
{
	var troopKey:String;
	if(Constant.TroopType.UNITS == troopType)
	{
		troopKey = "unit";
	}
	else if(Constant.TroopType.FORT == troopType)
	{
		troopKey = "fort";
	}
	if(seed["gdsAdjustment"] != null && seed["gdsAdjustment"]["troop"] != null
	&& seed["gdsAdjustment"]["troop"][troopKey] != null &&  seed["gdsAdjustment"]["troop"][troopKey][troopType+troopId]!=null)
	{
		return seed["gdsAdjustment"]["troop"][troopKey][troopType+troopId];
	}
	return null;
}

public function getResSaleForTrainTroop(troopType:String,troopId:int,resourceId:int):HashObject
{
	var data:HashObject = getTroopSaleDataFromSeed(troopType,troopId);
	if(data != null &&  data["c"] !=null && data["c"]["a"+resourceId] != null)
	{
		var ret:HashObject = new HashObject({"Numerator":_Global.INT32(data["c"]["a"+resourceId]),"Denominator":100});
		return ret;
	}
	return null;
}

public function getTroopSaleForTrainTroop(troopType:String,troopId:int)
{
	var data:HashObject = getTroopSaleDataFromSeed(troopType,troopId);
	if(data != null && data["u"] != null)
	{
		var ret:HashObject = new HashObject({"Numerator":_Global.INT32(data["u"]),"Denominator":100});
		return ret;
	}
	return null;
}

public function IsReskinPayment():boolean
{
	if(seed != null && seed["reskin"]!=null && seed["reskin"]["payments"]!=null)
	{
		return _Global.GetBoolean(seed["reskin"]["payments"]);
	}
	return false;
}

public function GetVipData():HashObject
{
	return seed["vip"] as HashObject;
}

public function GetVipOrBuffLevel():int
{
	var vipLevel:int = _Global.INT32(seed["vip"]["vipLevel"]);
	var vipTmpBuffLevel:int = _Global.INT32(seed["vip"]["vipBuff"]);
	var vipBuffEndTime:long = _Global.INT64(seed["vip"]["vipBuffExpireTime"]);
	if(vipBuffEndTime <= unixtime())
	{
		vipTmpBuffLevel = 0;
	}
	return (vipLevel>=vipTmpBuffLevel ? vipLevel:vipTmpBuffLevel);
}

public function GetVipReturnTroopLeftTime():int
{
	return _Global.INT32(seed["vip"]["returnTroopLeft"]);
}

public function paymentOkForGATA(msg:String):void
{
	if(String.IsNullOrEmpty(msg)){
		return;
	}
	var params:HashObject = (new JSONParse()).Parse(msg);
	//_Global.Log("payment_msg="+msg);

	 //UnityNet.reportErrorToServer("payOk_paymentOkForGATA",null,null,msg.ToString(),false);
	paymentOkForGATAHash(params);
}

public function paymentOkForGATAHash(params:HashObject)
{
	#if !UNITY_EDITOR
	if (BuildSetting.DEBUG_MODE == 0)
	{
		var transactionId:String = params["transactionId"].Value;
		var currencyAmount:String = params["currencyAmount"].Value.ToString();
		var currencyType:String = params["currencyType"].Value;
		var payChannel:String = params["payChannel"].Value;
		var goodId:String = params["goodId"].Value;
		var status:int = _Global.INT32(params["status"]);
		// UnityNet.reportErrorToServer("payOk_paymentOkForGATAHash",null,null,params.ToString(),false);
		//_Global.Log("paymentOkForGATAHash currencyAmount:" + currencyAmount +" currencyType:"+currencyType+ " transactionId : " + transactionId);


		NativeCaller.RechargeFinished(transactionId, currencyAmount, currencyType, payChannel, goodId, status);
	}
	#endif
}


public function CheckAndOpenRaterAlert(params:HashObject,place:String)
{
	if(params == null) return;
	CheckAndOpenRaterAlert(place);
}

public var isRaterOpen:boolean = false;
public var levelsRate:Array = null;
public var eventCenterTopRank:int = 0;
public var leaderBoardTopRank:int = 0;

private function GetRater(seed:HashObject)
{
	if(seed == null) return;
	isRaterOpen = false;
	eventCenterTopRank = 0;
	leaderBoardTopRank = 0;
	levelsRate = new Array();
	var arr:Array = null;
	if(seed["open"] != null)
		isRaterOpen = seed["open"].Value == "1";
	if(seed["ec_max_rank"] != null)
		eventCenterTopRank = _Global.INT32(seed["ec_max_rank"]);
	if(seed["lb_max_rank"] != null)
		leaderBoardTopRank = _Global.INT32(seed["lb_max_rank"]);
	if(seed["levels"] != null)
		arr = _Global.GetObjectValues(seed["levels"]);
	for(var i:int = 0;i<arr.length;i++)
	{
		levelsRate.Push(_Global.INT32(arr[i]));
	}
}



public function CheckAndOpenRaterAlert(place:String)
{
	CheckAndOpenRaterAlert(isRaterOpen,place);
	isRaterOpen = false;
}
public function CheckAndOpenRaterAlert(open:boolean,place:String)
{
	if(!open) return;

    var useNewRater : boolean = false;
    if (Datas.instance().GetPlatform() == Datas.AppStore.ITunes
            && seed["serverSetting"]["raterVer"] != null
            && _Global.INT32(seed["serverSetting"]["raterVer"].Value) != 0) {
        useNewRater = true;
    }

	var title:String = Datas.getArString("Settings.RaterMsgTitle");
	var content:String = Datas.getArString("Settings.RaterMsgContent");
	var raterNow:String = Datas.getArString("Settings.Rater");
	var raterLater:String = Datas.getArString("Settings.RaterLater");
	var notRater:String = Datas.getArString("Settings.NotRater");
    var userVoice:String = Datas.getArString("AppRater.Comments");
    var raterSkip:String = Datas.getArString("AppRater.Skip");

	//_Global.Log("ming CheckAndOpenRaterAlert 0" + place);
	//_Global.Log("ming CheckAndOpenRaterAlert 1" + Datas.instance().GetUserCode(place));

    if (useNewRater) {
        NativeCaller.OpenRaterAlertNew(title, content, raterNow, raterSkip, userVoice,
                BuildSetting.CLIENT_VERSION, GameMain.instance().getRaterUrl(), Datas.instance().GetUserCode(place));
    } else {
	    NativeCaller.OpenRaterAlert(title, content, raterNow, raterLater, notRater,
                BuildSetting.CLIENT_VERSION, GameMain.instance().getRaterUrl(),Datas.instance().GetUserCode(place));
    }

}

private function ResetFlags()
{
	m_bNeedCheckString = false;
	m_bNeedCheckData = false;
	m_bNeedCheckGDSVersion = false;

}

private function InstanceGDS()
{
    gdsManager.RegisterAll();
}

public function CheckVipLevelUp(vipData:HashObject)
{
	if(!IsVipOpened()) return;
	var curLevel:int = _Global.INT32(seed["vip"]["vipLevel"]);
	var level :int = _Global.INT32(vipData["vipLevel"]);
	var curBuffLevel:int = _Global.INT32(seed["vip"]["vipBuff"]);
	var buffLevel:int = _Global.INT32(vipData["vipBuff"]);

	if(level > curLevel)
	{
		if (HeroManager.Instance().Check(false))
		{
			HeroManager.Instance().RequestHeroHouseList(curCityId);
		}
		MenuMgr.getInstance().PushMenu("VIPLevelUpMenu", vipData, "trans_zoomComp");
		Datas.singleton.SetVipLevelUpFlag1(1);
		Datas.singleton.SetVipLevelUpFlag2(1);
	}
	else if(buffLevel > curBuffLevel)
	{
		if (HeroManager.Instance().Check(false))
		{
			HeroManager.Instance().RequestHeroHouseList(curCityId);
		}
	}
}

public function SetCurChapterId(id:int)
{
	m_curChapterId = id;
}

public function GetCurChapterId():int
{
	return m_curChapterId;
}

public function GotoCampaignScene()
{
	if (null == campaignLoadingCam) {
		var go = new GameObject("CampaignLoadingCamera");
		go.transform.position = new Vector3(-100, 100, -100);
		go.transform.rotation = Quaternion.Euler(90, 0, 0);
		campaignLoadingCam = go.AddComponent.<Camera>();
		campaignLoadingCam.orthographic = true;
	}
	CurrentCamera.gameObject.SetActive(false);

	campaignLoadingCam.gameObject.SetActive(true);

	if(GetPveFteStep() != 2)
		KBN.PveController.instance().SetPveFteStep(2);
	ParticalEffectMgr.getInstance().SetAllEffectActive(false);
	cloudMgr.setEnable(false);
	birdMgr.setEnable(false);
	NotDrawMenu = true;
	var pos:Vector3 = campaignLoadingCam.transform.position;


	var loadingCampaignSpr:GameObject = CreateAnimation("LoadingCampaign",Constant.AnimationSpriteType.CampaignAnimation,pos,12,Vector3.one);
	if(loadingCampaignSpr != null)
	{
		var loadingTipTrans:Transform = loadingCampaignSpr.transform.Find("loading_new_da boss/qianjing/xiaceng/Text_jieshao");
		if(loadingTipTrans != null)
		{
			var textmesh1:TextMesh = loadingTipTrans.gameObject.GetComponent(TextMesh);
			var number:int = _Global.GetRandNumber(1,11);
			textmesh1.text = Datas.getArString("Campaign.LoadingTip"+number);
		}
		var loadingNameTrans:Transform = loadingCampaignSpr.transform.Find("loading_new_da boss/qianjing/shangceng/Text_loading");
		if(loadingNameTrans != null)
		{
			var textmesh2:TextMesh = loadingNameTrans.gameObject.GetComponent(TextMesh);
			textmesh2.text = Datas.getArString("Common.Campaign");
		}
	}

	campaignLoadingCam.rect = new Rect(0, 0, 1, 1);
	campaignLoadingCam.orthographicSize = 9.2f * Screen.height / Screen.width;

	if( mapController != null ) {
		mapController.onGotoCampaign();
	}
}


/*=============================== MistExpedition 迷雾远征 ==============================================================*/

/*-------------------- 进入 -----------------------------------------*/
	/* 进入 MistExpedition 迷雾远征 场景 */
	public function GotoMistExpeditionScene() {

		TouchForbidden = true;
		ForceTouchForbidden = true;

		hideTileInfoPopup();
		var ctr = getMapController();
		if (ctr != null) {
			ctr.HiteCityDirectionRoot();
		}

		MenuMgr.getInstance().SwitchMenu("MainChrom", null);


		if (null == mistExpeditionSceneMaskCam) {
			var go = new GameObject("MistExpeditionSceneMaskCam");
			mistExpeditionSceneMaskCam = go.AddComponent.<Camera>();
			mistExpeditionSceneMaskCam.clearFlags = CameraClearFlags.Depth;
			mistExpeditionSceneMaskCam.cullingMask = 1 << 14;/* enable layer > MistExpeditionSceneCloudAnime */
			mistExpeditionSceneMaskCam.orthographic = true;
			go.transform.position = Vector3.up * 950;
			go.transform.rotation = Quaternion.Euler(90, 0, 0);
		}


		CreateExitMistExpeditionSceneCloudMaskAnimation("GotoMistExpeditionCloudCloseAnime");
		mistExpeditionSceneMaskCam.gameObject.SetActive(true);


		if (mapController != null) {
			mapController.onGotoMistExpedition();
		}


	}



	/* 进入迷雾远征遮罩云层动画 ：闭合 后的处理 */
	public function CheckGotoMistExpedition() {
		if (MenuMgr.instance.getMenu(Constant.MistExpeditionConst.SceneMenu_MainMenu) == null) {
			MenuMgr.instance.PushMenu(Constant.MistExpeditionConst.SceneMenu_MainMenu, null, "trans_immediate");
		}

		loadLevel(GameMain.MISTEXPEDITION_LEVEL);

		CreateExitMistExpeditionSceneCloudMaskAnimation("GotoMistExpeditionCloudOpenAnime");
		DestroyExitMistExpeditionSceneCloudMaskAnimation("GotoMistExpeditionCloudCloseAnime");

	}


	/*-------------------- 退出 -----------------------------------------*/

	/* 退出 MistExpedition 迷雾远征 场景 */
	public function ExitMistExpeditionScene() {
		/*
		 * 禁止任何操作：UI、场景中的
		 * 打开云层遮罩
		*/
		TouchForbidden = true;
		ForceTouchForbidden = true;

		if (mistExpeditionMapController != null) {
			mistExpeditionMapController.DisableAllMapSlotClickEvent();
		}


		CreateExitMistExpeditionSceneCloudMaskAnimation("ExitMistExpeditionCloudCloseAnime");
		mistExpeditionSceneMaskCam.gameObject.SetActive(true);

	}



	/* 退出迷雾远征遮罩云层动画 ：闭合 后的处理 */
	public function CheckExitMistExpedition() {
		/* 跳转场景
		 * 显示开启动画遮罩
		 * */


		/*MenuMgr.getInstance().SwitchMenu("MainChrom", null);*/

		MenuMgr.getInstance().PopMenu(Constant.MistExpeditionConst.SceneMenu_MainMenu);

		var mainChrom: MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		if (mainChrom != null)
			mainChrom.SetVisible(true);



		loadLevel(mistExpeditionMapController.GetBackToSceneLevel());

		CreateExitMistExpeditionSceneCloudMaskAnimation("ExitMistExpeditionCloudOpenAnime");
		DestroyExitMistExpeditionSceneCloudMaskAnimation("ExitMistExpeditionCloudCloseAnime");

	}

	/*------------------------------------------------------------------------*/

	public function CheckMistExpeditionCloudAnimationOver() {

		if (null != mistExpeditionSceneMaskCam && mistExpeditionSceneMaskCam.gameObject.activeSelf)
			mistExpeditionSceneMaskCam.gameObject.SetActive(false);

		DestroyExitMistExpeditionSceneCloudMaskAnimation("GotoMistExpeditionCloudOpenAnime");
		DestroyExitMistExpeditionSceneCloudMaskAnimation("ExitMistExpeditionCloudOpenAnime");

		ForceTouchForbidden = false;
		TouchForbidden = false;


	}

	/* 创建 加载 ExitMistExpedition 迷雾远征 时 的云层遮罩动画 */
	private function CreateExitMistExpeditionSceneCloudMaskAnimation(name: String): GameObject {
		var aniGo: GameObject = null;
		var aniSprTmp: GameObject = TextureMgr.instance().loadAnimationSprite(name, Constant.AnimationSpriteType.MistExpeditionCloudAnimation);
		if (aniSprTmp != null) {
			aniGo = Instantiate(aniSprTmp);
			aniSprTmp = null;
			FreeRAM();
			aniGo.name = name;
			aniGo.transform.parent = mistExpeditionSceneMaskCam.transform;
			aniGo.transform.localPosition = Vector3.forward * 100;
		}
		return aniGo;
	}


	/* 销毁 ExitMistExpedition 迷雾远征 的云层遮罩动画 */
	private function DestroyExitMistExpeditionSceneCloudMaskAnimation(name: String) {
		if (mistExpeditionSceneMaskCam != null) {
			var objTrans = mistExpeditionSceneMaskCam.transform.Find(name);
			if (objTrans != null) {
				Destroy(objTrans.gameObject);
			}

		}
	}

/*======================================================================================================================*/


	public function CheckPveGds()
	{
		if(!GdsManager.GdsesOfCategoryAreLoaded(GdsCategory.Pve))
		{
			gdsManager.LoadGdsesOfCategory(GdsCategory.Pve);
		}
		m_bCanEnterCampaignScene = true;
	}

	public function CheckUnlockPveBoss()
	{
		if(curScenceLevel == CAMPAIGNMAP_SCENE_LEVEL)
		{
			if(campaignMapController != null)
				campaignMapController.CheckUnlockBoss();
		}
	}


public function ChangeCampaignBossToNextLevel(curLevelID:int,nextLevelID:int)
{
	if(curScenceLevel == CAMPAIGNMAP_SCENE_LEVEL)
	{
		if(campaignMapController != null)
			campaignMapController.UnlockBoss_Step1_Replace(curLevelID,nextLevelID);
	}
}

public function SetCampaignBossHp(bossLevelId:int,bossChapterId:int,curHP:long,totalHP:long)
{
	if(curScenceLevel == CAMPAIGNMAP_SCENE_LEVEL)
	{
		if(campaignMapController != null)
			campaignMapController.SetBossCurHP(bossLevelId,bossChapterId,curHP,totalHP);
	}
}

public function SetPveMarchAnimationTime(levelId:long,marchTime:long)
{
	if(curScenceLevel == CHAPTERMAP_SCENE_LEVEL)
	{
		if(chapterMapController != null)
			chapterMapController.SetMarchAnimationTime(levelId,marchTime);
	}
	else if(curScenceLevel == CAMPAIGNMAP_SCENE_LEVEL)
	{
		if(campaignMapController != null)
			campaignMapController.SetMarchAnimationTime(levelId,marchTime);
	}
}

public function CreatePveMarchAnimation(levelId:long,marchTime:long)
{
	if(curScenceLevel == CHAPTERMAP_SCENE_LEVEL)
	{
		if(chapterMapController != null)
			chapterMapController.CreateMarchAnimation(levelId,marchTime);
	}
	else if(curScenceLevel == CAMPAIGNMAP_SCENE_LEVEL || curScenceLevel == ALLIANCE_BOSS_LEVEL)
	{
		if(campaignMapController != null)
			campaignMapController.CreateMarchAnimation(levelId,marchTime);
	}
}

public function CheckChapterLevelStarChanged()
{
	if(curScenceLevel == CHAPTERMAP_SCENE_LEVEL)
	{
		if(chapterMapController != null)
			chapterMapController.CheckLevelStarChanged();
	}
}

public function onPveResultMenuPopUp()
{
	CheckChapterLevelStarChanged();

	if( campaignMapController )
	{
		campaignMapController.onPveResultMenuPopUp();
	}
}

public function UnlockPveLevel_Step2(levelSlotId:int)
{
	if(chapterMapController != null)
		chapterMapController.UnlockLevel_Step2(levelSlotId);
}

public function UnlockPveLevel_Step3(levelSlotId:int)
{
	if(chapterMapController != null)
		chapterMapController.UnlockLevel_Step3(levelSlotId);
}

public function UnlockPveBoss_Step2()
{
	if(campaignMapController != null)
		campaignMapController.UnlockBoss_Step2();
}

public function UnlockPveNextChapter_Step1(chapterId:int)
{
	if(campaignMapController != null)
		campaignMapController.UnlockChapter_Step1(chapterId);
}

public function UnlockPveNextChapter_Step2()
{
	if(campaignMapController != null)
		campaignMapController.UnlockChapter_Step2();
}


public function CreateEnergyRecoverAnimation()
{
	if(campaignMapController != null)
		campaignMapController.CreateEnergyRecoverAnimation();
}

public function CreateScreenWhiteAnimation()
{
	if(campaignMapController != null)
		campaignMapController.CreateScreenWhiteAnimation();
}

public function CreateAnimation(name:String,type:String,positon:Vector3,y:float,localScale:Vector3):GameObject
{
	var aniSpr:GameObject = null;
	var aniSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite(name, type);
	if(aniSprTmp != null)
	{
		aniSpr = Instantiate(aniSprTmp);
		aniSprTmp = null;
		FreeRAM();
		aniSpr.transform.localPosition = positon;
		aniSpr.transform.localPosition.y = y;
		aniSpr.name = name;
		aniSpr.transform.localScale = localScale;
	}
	return aniSpr;
}

public function CreateAnimation(name:String,type:String,parentTrans:Transform,positon:Vector3,y:float,localScale:Vector3):GameObject
{
	var aniSpr:GameObject = null;
	var aniSprTmp:GameObject = TextureMgr.instance().loadAnimationSprite(name, type);
	if(aniSprTmp != null)
	{
		aniSpr = Instantiate(aniSprTmp);
		aniSprTmp = null;
		FreeRAM();
		aniSpr.transform.parent = parentTrans;
		aniSpr.transform.localPosition = positon;
		aniSpr.transform.localPosition.y = y;
		aniSpr.name = name;
		aniSpr.transform.localScale = localScale;
	}
	return aniSpr;
}

public function PveChapterCheckUnlockLevel()
{
	if(chapterMapController != null)
		chapterMapController.CheckUnlockLevel();
}

public function DestroyAnimation(name:String,parentTrans:Transform)
{
	var obj:GameObject;
	if(parentTrans != null)
	{
		obj = parentTrans.Find(name).gameObject;
		if(obj != null)
		{
			Destroy(obj);
		}
	}
	else
	{
		obj = GameObject.Find(name);
		if(obj != null)
		{
			Destroy(obj);
		}
	}
}

public function AddPveMarchToSeed()
{
	var marchData:KBN.PveMarchData = KBN.PveController.instance().GetPveMarchInfo() as KBN.PveMarchData;
	var atObj:HashObject;
	if(marchData.isAllianceBoss)
	{
		atObj = March.instance().addToSeed(marchData.marchID.ToString(),
											marchData.marchTime,
											marchData.marchEndTime,
											"-1", "-1",
											Constant.MarchType.ALLIANCEBOSS+"",
											marchData.knightId.ToString(),
											marchData.levelID.ToString(), "-1", "-1",-1,0,0);
	} else {
		atObj = March.instance().addToSeed(marchData.marchID+"", marchData.marchTime, marchData.marchEndTime, "-1", "-1",Constant.MarchType.PVE+"",marchData.knightId+"","-1", "-1", "-1",-1,0,0);
	}

	var idx:int;
	var units:List.<int> = marchData.units as List.<int>;
	for(idx=0; idx < units.Count; idx++)
	{
		if(units[idx]>0)
			Barracks.instance().addUnitsToSeed(idx+1, -units[idx]);
	}

	MenuMgr.getInstance().sendNotification(Constant.Notice.ON_MARCH_OK, null);
}

public function OpenHero() : void
{
	if (!HeroManager.Instance().Check(false))
	{
		ErrorMgr.instance().PushError("", Datas.getArString("Error.err_4003"));
    	return;
	}

	MenuMgr.instance.netBlock = true;
	AfterOpenHero();
}

private function AfterOpenHero() : void
{
	if (!HeroManager.Instance().Ready())
	{
		Invoke("AfterOpenHero", 0.1f);
		return;
	}

	MenuMgr.getInstance().PushMenu("HeroMenu", null);
	MenuMgr.instance.netBlock = false;
}

public function RefreshSceneMusic()
{
	PlaySceneMusic(curScenceLevel);
}

public function PlayMusic(fileName:String, path:String)
{
	SoundMgr.instance().PlayMusic(fileName, false, path);
	setCurMusicName(fileName,path);
	setLastMusicName("KBN_forest_loop",TextureType.AUDIO);
	setLoopCntOfCurMusic(1);
}

public override function onInitialAssetBundleListAcquire()
{
	// Query the audio asset bundle
	//assetBundleManager.retrieveAsset( "firework", "audio.assetbundle", true, onRetrieveAudioAsset );
}

private function onAudioAssetBundleDownloadComplete( assets : Object[] )
{
	var foobar : int = 0;

}

private function onRetrieveAudioAsset( assetBundleFileName : String,
										assetNames : String[],
										result : KBN.AssetBundleManager_Deprecate.RetrieveResult,
										assets : Object[],
										progress : float )
{
	switch( result )
	{
		case KBN.AssetBundleManager_Deprecate.RetrieveResult.RETRIEVE_RESULT_SUCCEEDED:
			onAudioAssetBundleDownloadComplete( assets );
			break;
		case KBN.AssetBundleManager_Deprecate.RetrieveResult.RETRIEVE_RESULT_DOWNLOAD_IN_PROGRESS:
			break;
		case KBN.AssetBundleManager_Deprecate.RetrieveResult.RETRIEVE_RESULT_NETWORK_ERROR:
			break;
	}
}

private function checkUnloadScene(sceneLv:int)
{
	if (sceneLv >= CITY_SCENCE_LEVEL && sceneLv <= WORLD_SCENCE_LEVEL || sceneLv == AVA_MINIMAP_LEVEL )
	{
		if( CAMPAIGNMAP_SCENE_LEVEL == LastSceneLevel )
		{
			unLoadScene(CAMPAIGNMAP_SCENE_LEVEL);
		}
	}
	else if( CAMPAIGNMAP_SCENE_LEVEL == sceneLv )
	{
		if( CHAPTERMAP_SCENE_LEVEL == LastSceneLevel )
		{
			unLoadScene(CHAPTERMAP_SCENE_LEVEL);
		}
		else if( ALLIANCE_BOSS_LEVEL == LastSceneLevel )
		{
			unLoadScene(ALLIANCE_BOSS_LEVEL);
		}
		else
		{
			TextureMgr.instance().DestroyGearSpt();
			unLoadScene(CITY_SCENCE_LEVEL);
			unLoadScene(FIELD_SCENCE_LEVEL);
			unLoadScene(WORLD_SCENCE_LEVEL);
			unLoadScene(AVA_MINIMAP_LEVEL);
		}
	}
	else if( CHAPTERMAP_SCENE_LEVEL == sceneLv )
	{
		unLoadScene(CAMPAIGNMAP_SCENE_LEVEL);
	}
	else if( ALLIANCE_BOSS_LEVEL == sceneLv )
	{
		unLoadScene(CAMPAIGNMAP_SCENE_LEVEL);
	}
	else if (MISTEXPEDITION_LEVEL == sceneLv) {
		TextureMgr.instance().DestroyGearSpt();
		unLoadScene(CITY_SCENCE_LEVEL);
		unLoadScene(FIELD_SCENCE_LEVEL);
		unLoadScene(WORLD_SCENCE_LEVEL);
		unLoadScene(AVA_MINIMAP_LEVEL);
	}

}

private function unLoadScene(sceneLv:int)
{
	var sceneObj:GameObject = null;
	switch (sceneLv)
	{
		case CITY_SCENCE_LEVEL:
			if( cityController != null )
			{
				cityController.Unload();
				sceneObj = cityController.gameObject;
			}
			break;
		case FIELD_SCENCE_LEVEL:
			if( fieldController != null )
			{
				fieldController.Unload();
				sceneObj = fieldController.gameObject;
			}
			break;
		case AVA_MINIMAP_LEVEL:
			if( mapController2 != null )
			{
				mapController2.Unload();
				sceneObj = mapController2.gameObject;
			}
			break;
		case WORLD_SCENCE_LEVEL:
			if( mapController != null )
			{
				mapController.Unload();
				sceneObj = mapController.gameObject;
			}
			break;
		case CAMPAIGNMAP_SCENE_LEVEL:
			if( campaignMapController != null )
			{
				sceneObj = campaignMapController.gameObject;
			}
			break;
		case CHAPTERMAP_SCENE_LEVEL:
			if( chapterMapController != null )
				sceneObj = chapterMapController.gameObject;
			break;
		case ALLIANCE_BOSS_LEVEL:
			if( allianceBossController != null )
				sceneObj = allianceBossController.gameObject;
			break;
		case MISTEXPEDITION_LEVEL:
			if (mistExpeditionMapController != null)
				sceneObj = mistExpeditionMapController.gameObject;
			break;
	}

	if(sceneObj != null)
	{
		loadedLevel[sceneLv] = false;
		Destroy(sceneObj);
		FreeRAM();
	}
}

public function get IsPvpServer() : boolean
{
    if (seed == null)
    {
        throw new System.ApplicationException("Seed hasn't been initilized yet.");
    }

    var serverSettingObj : HashObject = seed["serverSetting"];
    if (serverSettingObj == null)
    {
        return false;
    }

    return _Global.GetBoolean(serverSettingObj["isPvpServer"]);
}

public function CreateAllianceBossAttackAni()
{
	allianceBossController.CreateAttackAnimation();
}

public function UpdateAllianceBossSlot(isShow:boolean)
{
	if(campaignMapController!=null)
		campaignMapController.UpdateAllianceBossSlot(isShow);
}

public function IsPushMainchrome():boolean
{
	return m_isPushedMainChrome;
}

private function OnDownloadCheckFailure(sender:Object, e:GameFramework.GameEventArgs)
{
	var ne : KBN.DownloadCheckFailureEventArgs = e as KBN.DownloadCheckFailureEventArgs;
	//RetryDownloadAssetBundle(function(){
		AssetBundleManager.Instance().RetryDownload(ne.DownloadPath, ne.DownloadUri, ne.UserData);
	//});

}

private function OnDownloadFailure(sender:Object, e:GameFramework.GameEventArgs)
{
	var ne: KBN.DownloadFailureEventArgs = e as KBN.DownloadFailureEventArgs;
	//RetryDownloadAssetBundle(function(){
		AssetBundleManager.Instance().RetryDownload(ne.DownloadPath, ne.DownloadUri, ne.UserData);
	//});
}


private	function RetryDownloadAssetBundle( retryFunc:Function )
{
	//_Global.LogWarning("GameMain. RetryDownloadAssetBundle !!!!!!!!");
	ErrorMgr.instance().PushError("",Datas.getArString("Error.Network_error"), false, Datas.getArString("FTE.Retry"), retryFunc);
}

private var avaLoadingCam:Camera;
public function LoadAVAAnimation():void
{
	if (null == avaLoadingCam) {
		var go:GameObject = new GameObject("AVALoadingCamera");
		go.transform.position = new Vector3(-100, 100, -100);
		go.transform.rotation = Quaternion.Euler(90, 0, 0);
		avaLoadingCam = go.AddComponent.<Camera>() as Camera;
		avaLoadingCam.orthographic = true;
	}
	CurrentCamera.gameObject.SetActive(false);

	avaLoadingCam.gameObject.SetActive(true);

	ParticalEffectMgr.getInstance().SetAllEffectActive(false);
	cloudMgr.setEnable(false);
	birdMgr.setEnable(false);
	NotDrawMenu = true;
	ForceTouchForbidden = true;
	var pos:Vector3 = avaLoadingCam.transform.position;
	var loadingSpr:GameObject = CreateAnimation("Loading_ava",Constant.AnimationSpriteType.CampaignAnimation,pos,12,Vector3.one);
	avaLoadingCam.rect = new Rect(0, 0, 1, 1);
	avaLoadingCam.orthographicSize = 9.2f * Screen.height / Screen.width;

	if(loadingSpr!=null)
	{
		var loadingTipTrans:Transform = loadingSpr.transform.Find("loading_ava").Find("qianjing").Find("xiaceng").Find("Text_jieshao");
		if(loadingTipTrans != null)
		{
			var textmesh1:TextMesh = loadingTipTrans.gameObject.GetComponent(TextMesh);
			var number:int = _Global.GetRandNumber(1,4);
			textmesh1.text = Datas.getArString("AVA.Loadingdesc"+number);
		}
		var loadingNameTrans:Transform = loadingSpr.transform.Find("loading_ava").Find("qianjing").Find("shangceng").Find("Text_loading");
		if(loadingNameTrans != null)
		{
			var textmesh2:TextMesh = loadingNameTrans.gameObject.GetComponent(TextMesh);
			textmesh2.text = Datas.getArString("AVA.Loading_title");
		}
	}
	ForceTouchForbidden = true;
	if( mapController2 != null )
		mapController2.onGotoAVA();

	SoundMgr.instance().PlayMusic("Stinger v4", false, /*TextureType.AUDIO*/"Audio/Ava/");
}
//把 PBMsgMapChange 转换为 HashObject  start
public function GetTileInfoFromSocket(tileInfo:PBMsgMapChange.PBMsgMapChange):HashObject
{
	// body...
	var info:HashObject=new HashObject({
			"tileId": tileInfo.tileData.tileId.ToString(),
			"xCoord": tileInfo.tileData.xCoord.ToString(),
			"yCoord": tileInfo.tileData.yCoord.ToString(),
			"tileType": tileInfo.tileData.tileType.ToString(),
			"orgTileLevel": tileInfo.tileData.orgTileLevel.ToString(),
			"tileLevel": tileInfo.tileData.tileLevel.ToString(),
			"tileCityId": tileInfo.tileData.tileCityId.ToString(),
			"tileUserId": tileInfo.tileData.tileUserId.ToString(),
			"tileAllianceId": tileInfo.tileData.tileAllianceId.ToString(),
			"tileProvinceId": tileInfo.tileData.tileProvinceId.ToString(),
			"tileBlockId": tileInfo.tileData.tileBlockId.ToString(),
			"tileImgName": tileInfo.tileData.tileImgName.ToString(),
			"freezeEndTime": tileInfo.tileData.freezeEndTime.ToString(),
			"carmot": tileInfo.tileData.carmot.ToString(),
			"tileLv": tileInfo.tileData.tileLv.ToString(),
			"cityType": tileInfo.tileData.cityType.ToString(),
			"cityName": tileInfo.tileData.cityName.ToString(),
			"misted": tileInfo.tileData.misted.ToString(),
			"res_carmot": tileInfo.tileData.res_carmot.ToString(),
			"gateStatus":"0"
	});
	return info;
}

public function GetBaseTile(x:int,y:int):HashObject{
	var lv:int;
	var type:int;
	var byteData:byte;
	MapMemCache.instance().GetBaseTile(x,y,byteData);
	MapMemCache.instance().ByteToValue(byteData,lv,type);
////ProfilerSample.BeginSample("GameMain.js.GetBaseTile : new HashObject");
	var info=new HashObject({
		"tileId": "0",
		"xCoord": x.ToString(),
		"yCoord": y.ToString(),
		"tileType": type.ToString(),
		"orgTileLevel": lv.ToString(),
		"tileLevel": lv.ToString(),
		"tileCityId": "0",
		"tileUserId": "0",
		"tileAllianceId": "0",
		"tileProvinceId": "0",
		"tileBlockId": "0",
		"tileImgName": "tileImgName-null",
		"freezeEndTime": "0",
		"carmot": "0",
		"tileLv": "1",
		"cityType": "0",
		"cityName": "cityName-nuqll",
		"misted": "0",
		"res_carmot": "0",
		"gateStatus":"0"
	});

	return info;
////ProfilerSample.EndSample();
}

public function GetTileUserInfoFromSocket(tileInfo:PBMsgMapChange.PBMsgMapChange):HashObject
{
	var userInfoIdKey:String="u"+tileInfo.userInfo.userId;
	var userInfo=new HashObject({
		userInfoIdKey:{
			"n": tileInfo.userInfo.name.ToString(),
			"t": tileInfo.userInfo.title.ToString(),
			"m": tileInfo.userInfo.might.ToString(),
			"s": tileInfo.userInfo.sex.ToString(),
			"w": tileInfo.userInfo.warStatus.ToString(),
			"a": tileInfo.userInfo.allianceId.ToString(),
			"i": tileInfo.userInfo.avatarId.ToString(),
			"p": tileInfo.userInfo.portraitName.ToString(),
			"b": tileInfo.userInfo.badge.ToString(),
			"e": tileInfo.allianceInfo==null?"":{
				"curBanner": tileInfo.allianceInfo.curBanner,
				"curStyle": tileInfo.allianceInfo.curStyle,
				"curStyleColor": tileInfo.allianceInfo.curStyleColor,
				"curSymbol": tileInfo.allianceInfo.curSymbol,
				"curSymbolColor": tileInfo.allianceInfo.curSymbolColor
			}
		}
	});
	return userInfo;
}

public function avaMarchHeroLimit() : int
{
	if(seed["avaMarchHeroLimit"] != null)
	{
		return _Global.INT32(seed["avaMarchHeroLimit"].Value);
	}
	return 3;
}


public function GetCampaignLimit() : int
{
	if(seed["campaignLimit"] != null)
	{
		var campaignLimit : int = _Global.INT32(seed["campaignLimit"]);
		return campaignLimit;
	}

	return 7000;
}

public function GetTileAllianceNamesInfoFromSocket(tileInfo:PBMsgMapChange.PBMsgMapChange):HashObject
{
	var allianceId:String="a"+tileInfo.tileData.tileAllianceId;
	if (tileInfo.tileData.tileAllianceId==0) {
		return null;
	}else{
		var allianceInfo=new HashObject({
			allianceId:tileInfo.allianceInfo.name.ToString()
		});
		return allianceInfo;
	}
}

public function GetTileAllianceMightInfoFromSocket(tileInfo:PBMsgMapChange.PBMsgMapChange):HashObject
{
	var allianceId:String="a"+tileInfo.tileData.tileAllianceId;
	if (tileInfo.tileData.tileAllianceId==0) {
		return null;
	}else{
		var allianceInfo=new HashObject({
			allianceId:tileInfo.allianceInfo.might.ToString()
		});
		return allianceInfo;
	}
}

public function GetTileAllianceLeagueInfoFromSocket(tileInfo:PBMsgMapChange.PBMsgMapChange):HashObject
{
	var allianceId:String="a"+tileInfo.tileData.tileAllianceId;
	if (tileInfo.tileData.tileAllianceId==0) {
		return null;
	}else{
		var allianceInfo=new HashObject({
			allianceId:tileInfo.allianceInfo.leagues
		});
		return allianceInfo;
	}
}

public function SendGetMarchList(centerMapTile : String)
{
	NewSocketNet.GetInstance().SendGetMarchList(centerMapTile);
}
//把 PBMsgMapChange 转换为 HashObject  end

public function GetAvatarTextureName(avatar : String) : String
{
	return AvatarMgr.instance().GetAvatarTextureName(avatar);
}
public function CheckCampaignLevel():boolean
{
	return curScenceLevel == CAMPAIGNMAP_SCENE_LEVEL||curScenceLevel == CHAPTERMAP_SCENE_LEVEL;
}
public function SetMarchData(param:Object):void{
	MarchDataManager.instance().SetData(param);
}

public function IsCityTile(x : int, y : int) : boolean
{
	if(mapController != null)
	{
		return mapController.IsCityTile(x, y);
	}
	return false;
}

public function AvaU34DeploySwitch() : int
{
	if(seed["avaU34DeploySwitch"] != null)
	{
		return _Global.INT32(seed["avaU34DeploySwitch"]);
	}
	else
	{
		return 0;
	}
}

	public function GetCampaignSettlementSkip() : boolean
	{
		if(PlayerPrefs.HasKey(Constant.UserSetting.CampaignSettlementSkip))
		{
			var open : int = PlayerPrefs.GetInt(Constant.UserSetting.CampaignSettlementSkip);
			if(open == 0)
			{
				return false;
			}

			return true;
		}

		return false;
	}

	/******************************************** 获得 城堡皮肤相关的数据 *****************************************/



	/* 立即替换皮肤  */
	/* 当玩家手动更换使用城堡皮肤后，直接设置seed中当前玩家的城堡皮肤数据，这个数据会由 updateseed的请求操作后覆盖更新掉 */
	public function CitySkinUpdateImmediately(usedSkinId: String) {

		if (usedSkinId == null)
			return;

		var skinRes: String = null;
		var isdefault: int = 0;

		/*设置 seed 中 Cityskin的 数据*/
		if (seed.Contains("citySkins")) {
			var citySkinsData: HashObject = seed["citySkins"][getCurCityId() + ""];
			var keys: String[] = _Global.GetObjectKeys(citySkinsData);

			for (var j: int = 0; j < keys.Length; j++) {
				var data: HashObject = citySkinsData[keys[j]];

				/*查找、更新  皮肤的数据*/
				var isUsed: boolean = (data["skinid"].Value as String) == usedSkinId;
				if (!data.Contains("inuse"))
					data["inuse"] = new HashObject();
				data["inuse"].Value = isUsed ? "1" : "0";

				if (isUsed) {
					skinRes = data["skinres"].Value as String;
					isdefault = _Global.INT32(data["isdefault"].Value) == 1 ? 1 : 0;
				}

			}
		}

		var skinData: HashObject = new HashObject({ "isdefault": isdefault, "skinid": usedSkinId ,"skinRes": skinRes});


		/*replease city sence build*/
		if (getCityController() != null) {
			getCityController().ReplacePlayerCitySkinImmediately(skinData);
		}

		/*replease field sence build*/
		if (getFieldController() != null) {
			getFieldController().ReplacePlayerCitySkin();
		}

		/*replease world map sence build*/
		if (getMapController() != null) {
			getMapController().ReplacePlayerCitySkinImmediately(skinData);
		}

	}


	/* 由 updateseed.js 中 update_seed() 方法 的更新，来驱动 玩家城堡皮肤的更新 */
		public function CitySkinUpdate() {

		/*replease city sence build*/
		if (getCityController() != null) {
			getCityController().ReplacePlayerCitySkin();
		}

		/*replease field sence build*/
		if (getFieldController() != null) {
			getFieldController().ReplacePlayerCitySkin();
		}

		/*replease world map sence build*/
		if (getMapController() != null) {
			getMapController().ReplacePlayerCitySkin();
		}
	}



	/* 获得玩家城堡皮肤数据 */
	public function GetCurrentCitySkinsData(): HashObject {
		if (seed.Contains("citySkins") && seed["citySkins"] != null) {
			var curCityId: int = getCurCityId();
			return seed["citySkins"][curCityId + ""];
		} else
			return null;
	}

	/***********************************************************************************************************/

}
