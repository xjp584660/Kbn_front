
import System.Threading;

//public	var		loadDataThread:Thread;
public var loadStringThread:Thread;

private	var flashTextures:Array = new Array(5);
//private	var		randomArray:Array = new Array();

private var loadingAnimBg:GameObject;

private	var		logoIcon:Texture;
private	var		flash:Texture;
private var		loadingBarBg:Texture;
//@SerializeField
private var		loadingBarBgTop:float = 762;
private	var		loadingBarMaxLength:int = 401;
private	var		loadingBarCurMaxLength:int;
private	var		loadingBarLength:int = 30; //range: 30~341
private	var		loadingBarStyle:GUIStyle;
private var		m_loadingBarHead : Texture;

private	var		loadStarted:boolean;
private var     maxPercent:int;
public  var     loadMessage:Label;
public  var     updateMessage:Label;
private var     messageAlpha:int;
private var     waitStr:String[] = ["", ".", "..", "..."];
private var     dotCnt:int;
private var     waitingTime:float;
private var     loadStr:String;
private var 	servers:Hashtable;
private static var	coldStart:boolean = true;
private var startTime:System.DateTime;

public var loadingMenu:LoadingMenu;
public var showDebugServers: boolean;




@Space(20)
@SerializeField private var ServerButtonWidth: float = 240;
@SerializeField private var ServerButtonHeight: float = 60;
@SerializeField private var ServerButtonHeightOffset: float = 330;
@SerializeField private var ServerButtonDistance: float = 5;

private var mNum: int = 0;
private var mNewNum: int = 0;


//private	var		time:float;
//private	var		flashAlpha:float = 0.2;
//private	var		deltaAlpha:float = 0.08;

private var downloadingMessage: String;


private static var showErrorTrigger: boolean = false;
private static var showErrorLog: boolean = false;
private final static var ErrorTriggerRect: Rect = new Rect(440, 900, 200, 60);



private static var midStr: String = "qy01";
private static var midSetted: String = "";
private var buid: String = "1618"; //becomeUserID.
private var bpwd: String = "koc123btn";
private var skipFTE: boolean = false;
private var fpsTrigger: boolean = false;
private var loadingProfile: boolean = false;
private var showTextField: boolean = true;

private static var customServerURL_SubDomain: String = "https://beta";
private static var customServerURL_MainDomain: String = ".kocbattle.com/";
private static var customServerIsProduct: boolean = false;





function OnLevelWasLoaded(lv:int){
	Resources.UnloadUnusedAssets();
	System.GC.Collect();
}

function Start() {

	/*------------------------------------------------------------*/
	/*  初始化 TA */
	ThinkingAnalyticsManager.Instance.Init();

	/* 游戏loading 加载 开始计时 */
	ThinkingAnalyticsManager.Instance.StartTimeTrackEvent("loading");
	/*------------------------------------------------------------*/


    /*_Global.AutoTest();*/
    startTime = System.DateTime.Now;
	KBN.LoadingTimeTracker.Instance.StartTracking(coldStart ? KBN.LoadingTimeTracker.StartMode.FirstStart : KBN.LoadingTimeTracker.StartMode.Restart
												, UnityNet.SendLoadingTimeBI);


	_Global.LOWENDPRODUCT = false;

	#if	!UNITY_EDITOR
		#if UNITY_IPHONE
			var generation = UnityEngine.iOS.Device.generation;

			if (generation == UnityEngine.iOS.DeviceGeneration.iPodTouch4Gen
				|| generation == UnityEngine.iOS.DeviceGeneration.iPad1Gen
				|| generation == UnityEngine.iOS.DeviceGeneration.iPhone4
				|| generation == UnityEngine.iOS.DeviceGeneration.iPhone3GS)
			{
				_Global.LOWENDPRODUCT = true;
			}

			if (generation == UnityEngine.iOS.DeviceGeneration.iPodTouch4Gen
				|| generation == UnityEngine.iOS.DeviceGeneration.iPad1Gen
				|| generation == UnityEngine.iOS.DeviceGeneration.iPhone4
				|| generation == UnityEngine.iOS.DeviceGeneration.iPhone3GS
				/* || generation == UnityEngine.iOS.DeviceGeneration.iPadMini1Gen */
				|| generation == UnityEngine.iOS.DeviceGeneration.iPodTouch5Gen)
			{
				_Global.LOWENDPRODUCT_4_MAP_SYSTEM = true;
			}


			if( generation == UnityEngine.iOS.DeviceGeneration.iPodTouch5Gen )
				_Global.IS_TOUCH5_GEN = true;
		#endif
	#endif



	Application.backgroundLoadingPriority = UnityEngine.ThreadPriority.High;
    JSONParse.defaultInst();
	LocaleUtil.getInstance().Init();
	_Global.Log("$$$$$  After load--localutilInit : " + (System.DateTime.Now - startTime).TotalMilliseconds);
	//removed in 18.5.0 Gaea
	//	KabamLab.ADS.KADS.StartNewRelic(LocaleUtil.NewRelic[NativeCaller.NewRelic.ID]);

	var	data:Datas = Datas.instance();
    data.init();
    _Global.Log("$$$$$  After loding--dataInit : " + (System.DateTime.Now - startTime).TotalMilliseconds);
    data.setLoginCnt( data.getLoginCnt() + 1 );

	// Create AttackFlash instance here, for GUI & script order.
	AttackFlash.Instance.SetEnable(false);

//    UnityNet.selectServer(UnityNet.URL_SERVER1);
//    UnityNet.init("a",TextureMgr.instance());
//    GameMain.checkData();

//    loadDataThread = new Thread(new ThreadStart(data.loadDataFromLocal));
//    loadDataThread.Start();

	NativeCaller.Chartboost(LocaleUtil.ChartboostHash);
	_Global.Log("$$$$$  After load nativeCaller.charboost : " + (System.DateTime.Now - startTime).TotalMilliseconds);

	var assetBundleMgr: AssetBundleManager = AssetBundleManager.Instance();
	assetBundleMgr.Init(GameMain.GetApplicationDataSavePath() + "/ota/" + data.getGameTheme());
	assetBundleMgr.LoadResourceListFromLocal();
	assetBundleMgr.LoadAssetBundle("load");
	assetBundleMgr.LoadAssetBundle("loading");
	assetBundleMgr.LoadAssetBundle("Loading_new");

	var texMgr : TextureMgr = TextureMgr.instance();
	texMgr.InitSpt();

	_Global.Log("$$$$$  After loding--texMgrInit : " + (System.DateTime.Now - startTime).TotalMilliseconds);
	var localeUtil : LocaleUtil = LocaleUtil.getInstance();
	var loadingInfo : LocaleUtil.LoadingInfo = localeUtil.TheLoadingInfo;

	logoIcon = texMgr.LoadTexture("gamelogo_" + data.getGameLanguageAb(), TextureType.LOAD);
	if( logoIcon == null ){
		logoIcon = texMgr.LoadTexture("gamelogo_en", TextureType.LOAD);
	}

	var cam:Camera = GetComponent("Camera") as Camera;
	if (null != cam) {
		// fit aspect for a 640x960 background image
		cam.orthographicSize = 14.0f * Mathf.Min(1.0f, (Screen.height * 640.0f / 960.0f / Screen.width));
	}
//	var loading_anim_prefab : GameObject = texMgr.loadAnimationSprite("Loading_new", "Loading");
//	loadingAnimBg = GameObject.Instantiate(loading_anim_prefab) as GameObject;
//	loadingAnimBg.transform.parent = transform;

	var loading_anim_prefab : GameObject = texMgr.loadAnimationSprite("Loading_2018", "Loading");
	loadingAnimBg = GameObject.Instantiate(loading_anim_prefab) as GameObject;
	loadingAnimBg.transform.parent = transform;
	loadingMenu = loadingAnimBg.GetComponent("LoadingMenu") as LoadingMenu;
	transform.localPosition -= Vector3.right * 100;

	loadingBarBg = texMgr.LoadTexture("loading_progressbar", TextureType.LOAD);

	loadingBarStyle = new GUIStyle();
	loadingBarStyle.normal.background = texMgr.LoadTexture("loading_tiao2", TextureType.LOAD);//Resources.Load("Textures/UI/LOAD/loading_tiao2");
	loadingBarStyle.border.left = 15;
	loadingBarStyle.border.right = 15;

	if ( !String.IsNullOrEmpty(loadingInfo.ScrollHeader) )
		m_loadingBarHead = texMgr.LoadTexture(loadingInfo.ScrollHeader, TextureType.LOAD);

//	initRandomArray();
	//useGUILayout = false;


    Screen.autorotateToLandscapeLeft = false;
    Screen.autorotateToLandscapeRight = false;
    Screen.autorotateToPortraitUpsideDown = false;

//    TouchScreenKeyboard.autorotateToLandscapeLeft = false;
//    TouchScreenKeyboard.autorotateToLandscapeRight = false;
//    TouchScreenKeyboard.autorotateToPortraitUpsideDown = false;

	downloadingMessage = String.Empty;
	Application.runInBackground = true;
	loadMessage.txt = "";
	loadStr = "";
	dotCnt = 0;
	waitingTime = 0.0;

	setLoadPercent(30);

	_Global.Log("$$$$$  After loding--percent30 : " + (System.DateTime.Now - startTime).TotalMilliseconds);
	if(MenuMgr.getInstance() != null)
		MenuMgr.free();

	FontMgr.Init();

	loadMessage.txt = "";

	if( BuildSetting.INTERNAL_VERSION ){
		servers = UnityNet.DebugServers();
		if(PlayerPrefs.HasKey("test_Build")){
			var myBuild=PlayerPrefs.GetString("test_Build");
			buid=myBuild.length>0?myBuild:"1618";
		}
	}else{
		Invoke("startLoad", 0.1 );
	}
	Invoke("PlaySplashMusic", 0.1 );


	tk2dSystem.CurrentPlatform = _Global.IsLowEndProduct() ? "1x" : "2x";
	loadingMenu.Init();

}

private function startLoad(){
	loadNextLevel(_Global.RELEASE_SERVER_ID);
}

private function reqLoadingTips(){
	UnityNet.reqLoadingTips(MessageOk, MessageErr);
}

private function MessageOk(result:HashObject)
{
	if( result["data"]){
		SetMessage(_Global.GetString(result["data"]));
	}
}

private function MessageErr(msg:String, errorCode:String)
{
	loadMessage.txt = "";
}

private function PlaySplashMusic()
{
	SoundMgr.instance().PlaySplashMusic();
}

private function InitMobileAppTracker()
{
	if(coldStart)
	{
		coldStart = false;
		LocaleUtil.getInstance().MobileAppTrackerInstallToServer();
		NativeCaller.InitMobileAppTracker(LocaleUtil.ApptrackerHash);
	}
}

function SetMessage(txt:String)
{
	if(txt != loadStr)
	{
		loadStr = txt;
		loadMessage.txt = txt;
	}
}
//function FixedUpdate(){
//	_Global.Log("loading fixedupdate");
//	time -= Time.fixedDeltaTime;
//	if( time < 0 ){
//
//		flashAlpha += deltaAlpha;
//		if( flashAlpha >= 1 ){
//			deltaAlpha *= -1;
//		}else if( flashAlpha <= 0.2 ){
//			deltaAlpha *= -1;
//			randFlashTexture();
//		}
//
//		time += 0.1;
//	}
//}

function Update(){

	if( loadingBarLength < loadingBarCurMaxLength ){

		if( loadingBarCurMaxLength == loadingBarMaxLength || maxPercent > 70 ){
			loadingBarLength += 10;
		}else{
			loadingBarLength += 10;
		}
	}
	waitingTime += Time.deltaTime;
	if(waitingTime >= 1.0)
	{
		waitingTime = 0;
		dotCnt++;
		dotCnt = dotCnt%4;
		if(loadStr != String.Empty)
			loadMessage.txt = loadStr;// + waitStr[dotCnt];

		var completed = AssetBundleManager.Instance().DownloadCompleteCount;
		var total = AssetBundleManager.Instance().DownloadTotalCount;
		if (total - completed > 0) {

			if (String.IsNullOrEmpty(downloadingMessage)) {
				downloadingMessage = Datas.getArString("OTA.LoadingTips");
			}

			var message = String.Format("{0} ({1}/{2})", downloadingMessage, completed, total);

			updateMessage.txt = message;
			updateMessage.SetVisible(true);
		}
		else {
			updateMessage.SetVisible(false);
		}
	}

}

function OnGUI(){
	GUI.depth = 2;
	var backMatrix:Matrix4x4 = GUI.matrix;

	_Global.setGUIMatrix();
	loadingMenu.Draw();
	if(Event.current.type == EventType.Repaint)
	{
		GUI.DrawTexture(Rect(320-logoIcon.width/2, 70, logoIcon.width,logoIcon.height), logoIcon  );

		var rectLoadingBarBg : Rect = new Rect((640 - loadingBarBg.width) * 0.5, loadingBarBgTop , loadingBarBg.width, loadingBarBg.height);
		GUI.DrawTexture(rectLoadingBarBg, loadingBarBg);

		var rectLoadingBar : Rect = new Rect(117, 792, loadingBarLength, 32);
		GUI.Label(rectLoadingBar, null as Texture, loadingBarStyle);
		if ( m_loadingBarHead != null )
		{
			var rectPumbkin : Rect = new Rect(
				rectLoadingBar.xMax - m_loadingBarHead.width/2
				, (rectLoadingBar.yMax + rectLoadingBar.yMin - m_loadingBarHead.height)/2
				, m_loadingBarHead.width, m_loadingBarHead.height
				);
			GUI.DrawTexture(rectPumbkin, m_loadingBarHead);
		}
	}

	if( BuildSetting.INTERNAL_VERSION && showDebugServers){
		if (!loadStarted) {
            displayServer();
        }
        DisplayErrorTrigger();
	}
	ShowLoadMessage();
	GUI.matrix = backMatrix;
}

public function setLoadPercent(p:int){
	loadingBarCurMaxLength = 30 + 3.71 * p; //3.71: (401 - 30)/100;
	maxPercent = p;
	_Global.Log("$$$$$  After loding--percent  : " +p +"  :"+ (System.DateTime.Now - startTime).TotalMilliseconds);
//	_Global.Log("p:" + p + " loadingBarCurMaxLength:" + loadingBarCurMaxLength);
}

public function finished():boolean{
	return loadingBarLength >= loadingBarMaxLength;
}

//private function randFlashTexture(){
//	if( randomArray.length == 0 ){
//		initRandomArray();
//	}
//	var	selected:int = Random.Range(0,randomArray.length - 1);
//	flash = flashTextures[randomArray[selected]];
//	randomArray.RemoveAt(selected);
//}

//private function initRandomArray(){
//
//	for( var i:int = 0; i < flashTextures.length; i ++ ){
//		randomArray.Add( i );
//	}
//}

private function loadNextLevel(serverName:String){
    KBN.LoadingTimeTracker.Instance.OnStartConnectingServer();
	LoadingProfiler.Instance.StartTimer("Load GameMain");
	setLoadPercent(50);
	InitNet(serverName);
	InitMobileAppTracker();

	if(skipFTE)
		KBN.FTEMgr.skipFTE();

	ShowFps.isNeedShowProfileInfo=fpsTrigger;
	LoadingProfiler.Instance.Active = loadingProfile;


	loadStarted = true;
	if(BuildSetting.INTERNAL_VERSION) LogWindow.Instance.Active = showErrorLog;//show log window,used to check log on mobile device
	/*reqLoadingTips();*/
	#if UNITY_EDITOR
		/* if (BuildSetting.INTERNAL_VERSION ){*/
				if(!showErrorLog) {
					InputField.Instance.Active = showTextField;/*choose 显示辅助文本输入框*/
				}else{
					InputField.Instance.Active = false;
				}

		/*	}*/

		Application.LoadLevelAdditive("Game");
	#else
		Application.LoadLevelAdditiveAsync("Game");
	#endif

	setLoadPercent(60);
}


	//yyyyy
	//random message tips:
	//1.339line //reqLoadingTips();
	//2.add next lines
	InvokeRepeating("MRandomMessageTips",0,10f);

	 private function MRandomMessageTips()
	 {
   		mNum = Random.Range(0,20);
		while(mNum == mNewNum)
		{
   		  mNum = Random.Range(0,20);
		}
		loadMessage.txt = Datas.getArString("randomMessageTipsNum.u"+mNum.ToString());
		if(loadMessage.txt.ToString().Contains("randomMessageTipsNum.u"))
   			loadMessage.txt="";

		mNewNum = mNum;

	 }







	private function displayServer(){

		var a:int = 0;
		var half : int = (servers.Count + 1) / 2;
		for(var i:System.Collections.DictionaryEntry in servers)
		{
			if(a < half)
			{
				if (GUI.Button(Rect(50, ServerButtonHeightOffset + a * (ServerButtonHeight + ServerButtonDistance), ServerButtonWidth, ServerButtonHeight), i.Key as String))
				{
					handleClick(i.Key as String);
				}
			}
			else
			{
				if (GUI.Button(Rect(350, ServerButtonHeightOffset + (a - half) * (ServerButtonHeight + ServerButtonDistance), ServerButtonWidth, ServerButtonHeight), i.Key as String))
				{
					handleClick(i.Key as String);
				}
			}
			a++;
		}


		/*---------------- 通过自定义 服务器 的 url 登陆游戏 -------------*/

		GUI.Label(Rect(20, 265, 100, 40), "subDomain:");
		customServerURL_SubDomain = GUI.TextField(Rect(20, 280, 100, 40), customServerURL_SubDomain);
		GUI.Label(Rect(150, 265, 250, 40), "mainDomain:");
		customServerURL_MainDomain = GUI.TextField(Rect(150, 280, 250, 40), customServerURL_MainDomain);
		customServerIsProduct = GUI.Toggle(Rect(400, 290, 150, 40), customServerIsProduct , "is " + UnityNet.URL_US_OFFICIAL);

		if (GUI.Button(Rect(480, 280, 150, 40), "Login By Server URL")) {
			CustomLoginBtnClick();
		}

		/*-------------------------------------------------------------*/


		midStr = GUI.TextField(Rect(20,10,400,60),midStr);
		if(GUI.Button(Rect(450,10,180,60),"SET MID"))
		{
			midSetted = midStr;
			Datas.instance().clearClientUserData();
			Datas.instance().SetBecomeUserId("");	// if MID seted, cancel Become User .
		}

		buid = GUI.TextField(Rect(20,80,200,60),buid);
		bpwd = GUI.PasswordField(Rect(240,80,200,60),bpwd,'*'[0]);
		PlayerPrefs.SetString("test_Build", buid);
	//	buid ="3982";
	//	bpwd ="koc123btn";
		if(GUI.Button(Rect(440,80,200,60),"Become User"))
		{
			Datas.instance().SetBecomeUserId(buid);
			Datas.instance().SetBecomeUserPassword(bpwd);
		}


		if(GUI.Button(Rect(20,160,400,60),"Clear PlayerPrefs"))
		{
	//		PlayerPrefs.DeleteAll();
			PlayerPrefs.DeleteKey("test_Build");
			buid = "";
			bpwd = "";
			Datas.instance().clear();
			Datas.instance().init();
		}

		if (GUI.Button(Rect(55, 850, 180, 76), "Clear privacyPolicy"))
		{
			Datas.instance().PrivacyClear();
		}

		skipFTE = GUI.Toggle(Rect(450,160, 200, 30),skipFTE,"skipFTE");
		fpsTrigger=GUI.Toggle(Rect(450,200,150,30),fpsTrigger,"show fps,memory");
		loadingProfile = GUI.Toggle(Rect(450, 180, 200, 30), loadingProfile, "Show Loading Profile");
		showTextField = GUI.Toggle(Rect(450, 230, 200, 30), showTextField, "Show TextField");
	}


	private function handleClick(param: String): void {
		/*
	//	if(param == UnityNet.URL_US_OFFICIAL)
	//	{
	//		if(Application.platform != RuntimePlatform.OSXEditor && Application.platform != RuntimePlatform.WindowsEditor)
	//		{
	//			loadNextLevel(param);
	//		}
	//	}
	//	else
	//	{
	//	}
		 */
		loadNextLevel(param);
	}

	/* 处理自定义 服务器登陆  */
	private function CustomLoginBtnClick(): void {
		if (!String.IsNullOrEmpty(customServerURL_SubDomain) && !String.IsNullOrEmpty(customServerURL_MainDomain)) {

			KBN.LoadingTimeTracker.Instance.OnStartConnectingServer();
			LoadingProfiler.Instance.StartTimer("Load GameMain");
			setLoadPercent(50);

			var mobileId: String;

			if (customServerIsProduct || String.IsNullOrEmpty(midSetted)) {
				mobileId = Datas.instance().getDeviceInfo().mobileId;

			} else {
				mobileId = midSetted;
				midSetted = "";
			}

			UnityNet.SetSelectServer(customServerURL_SubDomain, customServerURL_MainDomain);
			UnityNet.init(mobileId, SoundMgr.instance());


			InitMobileAppTracker();

			if (skipFTE)
				KBN.FTEMgr.skipFTE();

			ShowFps.isNeedShowProfileInfo = fpsTrigger;
			LoadingProfiler.Instance.Active = loadingProfile;


			loadStarted = true;
			if (BuildSetting.INTERNAL_VERSION) LogWindow.Instance.Active = showErrorLog;


		#if UNITY_EDITOR
			if (!showErrorLog) {
				InputField.Instance.Active = showTextField;
			} else {
				InputField.Instance.Active = false;
			}

			Application.LoadLevelAdditive("Game");
		#else
			Application.LoadLevelAdditiveAsync("Game");
		#endif

			setLoadPercent(60);
		}
	}


// Press the button to trigger an error

private function DisplayErrorTrigger() : void {
    if (!loadStarted) {
        showErrorTrigger = GUI.Toggle(ErrorTriggerRect, showErrorTrigger, "Show error trigger?");
       showErrorLog= GUI.Toggle(new Rect(440, 870, 200, 30), showErrorLog, "Show log window?");
        return;
    }
    if (showErrorTrigger && GUI.Button(ErrorTriggerRect, "Error")) {
        throw new System.Exception("An exception for debug");
    }

}


//function FixedUpdate()
//{
//	if(messageAlpha == 255)
//		messageAlpha = 0;
//	else
//		messageAlpha += 10;
//	if(messageAlpha > 255)
//		messageAlpha = 255;
//}

private function ShowLoadMessage()
{
//	var oldColor:Color = GUI.color;
//	GUI.color.a = messageAlpha/255.0;
	loadMessage.Draw();
	updateMessage.Draw();
//	GUI.color = oldColor;

}


//public function OnApplicationQuit(){
//_Global.Log("Loading OnApplicationQuit");
//}


private function InitNet(serverName:String)
{
	var mobileId:String;
	var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();

	if( serverName == UnityNet.URL_US_OFFICIAL || String.IsNullOrEmpty( midSetted ) ){
		mobileId = deviceInfo.mobileId;
		_Global.Log("Loading.InitNet mobileid deviceInfo.mobileId : " + mobileId);
	}else{
		mobileId = midSetted;
		_Global.Log("Loading.InitNet mobileid midSetted : " + mobileId);
		midSetted = "";

	}
	//mobileId = "7c48e590e36021740466886dabf583c9";
	UnityNet.selectServer(serverName);
	UnityNet.init(mobileId,SoundMgr.instance());

}

public function OnApplicationPause(pause : boolean) {
	if (pause) {
		KBN.LoadingTimeTracker.Instance.OnAppPause();
	}
}
