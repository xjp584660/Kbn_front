import System.IO;
import System.Text;
	
class	Datas extends KBN.Datas {
	private	var	applicationTxtDir:String;
	
	private	var uid:int;
	private	var	worldId:int;
	private	var	scenceLevel:int;
	private	var	cityScale:float;
	private	var	fieldScale:float;
	private var pushNotification:int;

	private var naid:String;
	private var kabamId:String = "";
	private var become_user_id:String="";
	private var become_password:String="";
	private var accessToken:String;
	private var email:String;
	private var gameLanguage:int;
	private	var	gameLanguageAb:String;

	private	var	loginTime:String;
	private var fteEndTime:String;
	private var lastKabamIdTime:String;
	private var loginCnt:int;
	private var sessionCnt:int;
	
	private var shareCnt:int;
	private var lastShareInWhichSessions:int;
	private var last2ShareInWhichSessions:int;
	private var last3ShareInWhichSessions:int;
	private var lastPopupShareSession:int;
	private var popupShareMenuInterval: int;
	private var privacyMessage: String = "";

	private var kabamGamesLink:String = "";
	
	private var ignoreUsers:String;
	
	private	var	gameTheme:int = 1;
	
	private var picCampRemainTimes:int =0;
	private var picCampAttackTimes:int =0;
	
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new Datas();
		}
		return singleton as Datas;
	}
	
	public function GetUserCode(place:String):String
	{
		return place + "@=>@" + deviceInfo.mobileId + Time.time.ToString();
	}

	public function GetLanguageAb():String
	{
		return gameLanguageAb;
	}	

	public function GetKabamGamesLink():String
	{
		return kabamGamesLink;
	}
	public function SetKabamGamesLink(link:String)
	{
		kabamGamesLink = link;
	}
	
	public	static	function	free(){
		singleton = null;
	}
	
	public function SetBecomeUserId(idStr:String):void
	{
		become_user_id = idStr;
	}
	public function SetBecomeUserPassword(idStr:String):void
	{
		become_password = idStr;
	}
	public function GetBecomeUserPassword():String
	{
		return become_password;
	}
	public function GetBecomeUserId():String
	{
		return become_user_id;
	}
	public function IsBecomeUser():boolean
	{
		return become_user_id!=null && become_user_id.Length > 0;
	}
	public function SetDecodeKey(key:String):void
	{
		CLIENT_PUBLIC_KEY = key;
	}
	public function GetDecodeKey():String
	{
		return CLIENT_PUBLIC_KEY;
	}
	
	static public function getArString(keyPath:String,params:Array):String
	{
		var s:String = getArString(keyPath);
		var i:int = 0;
		var n:int = params.length;
		for(i=0; i<n; i++)
		{
			s = s.Replace("{"+i+"}",""+params[i]);		
		}
		return s;
	}

	static public function IsFirstNanigansInstall():boolean
	{
		return (PlayerPrefs.GetInt(NANIGANS,0) != 1);
	}
	static public function SetNanigansInstallFlag()
	{
		PlayerPrefs.SetInt(NANIGANS,1);
	}

	static public function getISALLOW24FPS()
	{
		if( PlayerPrefs.HasKey( ISALLOW24FPS ))
		{
			return PlayerPrefs.GetInt(ISALLOW24FPS);
		}
		else
		{
			if(NativeCaller.IsAllow24FPS())
			{
				PlayerPrefs.SetInt(ISALLOW24FPS,1);
			}
			else
			{
				PlayerPrefs.SetInt(ISALLOW24FPS,0);
			}
			return PlayerPrefs.GetInt(ISALLOW24FPS);
		}
	}
	
	public  function	updateLimitedTracking()
	{
		if( deviceInfo )
		{
			NativeCaller.UpdateLimitedTracking();
		}
	}
	
	public	function	getDeviceInfo():DeviceInfo{
		if( deviceInfo ){
			return deviceInfo;
		}
		
//		var	devString:String = NativeCaller.GetDeviceInfo();
//		_Global.Log("devString:" + devString);
//		var devObj:Object = (new JSONParse()).Parse(devString);
//		deviceInfo = new DeviceInfo();
//		if( devObj["Mac"] && devObj["Mac"].length > 0 ){
//			deviceInfo.mac = devObj["Mac"];
//			if( !PlayerPrefs.HasKey( MAC_ADDR ) ){
//				PlayerPrefs.SetString(MAC_ADDR, deviceInfo.mac);
//			}
//		}else{
//			deviceInfo.mac = PlayerPrefs.GetString( MAC_ADDR, "UNKNOWN");
//		}
//		
//		deviceInfo.manufactor = devObj["Manufactor"];
//		deviceInfo.model = devObj["Model"];
//		deviceInfo.osName = devObj["OSName"];
//		deviceInfo.osVersion = devObj["OSVersion"];
//		deviceInfo.udid = devObj["UDID"];
//		deviceInfo.systemLanguage = devObj["Language"];
//		
//		//59a1cc5e4b7af16131a80973739b783f = UnityNet.getMD5Hash("com.kabam.chinamobile.project1");
//		deviceInfo.mobileId = UnityNet.getMD5Hash("59a1cc5e4b7af16131a80973739b783f" + deviceInfo.mac);
//		_Global.Log( "mac:" + deviceInfo.mac + 
//		" manufactor:" + deviceInfo.manufactor + 
//		" model:" + deviceInfo.model + 
//		" osName:" + deviceInfo.osName + 
//		" osVersion:" + deviceInfo.osVersion + 
//		" mobileId:" + deviceInfo.mobileId +
//		" udid:" + deviceInfo.udid +
//		" systemLanguage:" + deviceInfo.systemLanguage );
		
		var unknown:String = "UNKNOWN";
		var deviceInfomation:String = NativeCaller.GetDeviceInfo();
		
		deviceInfo = new DeviceInfo();
		
		deviceInfo.mac0 = PlayerPrefs.GetString( DEV_MAC0, unknown);
		deviceInfo.macAll = PlayerPrefs.GetString( DEV_MAC_ALL, unknown);
		deviceInfo.manufactor = PlayerPrefs.GetString( DEV_MANUFACTOR, unknown);
		deviceInfo.model = PlayerPrefs.GetString( DEV_MODEL, unknown);
		deviceInfo.IFA = Application.platform == RuntimePlatform.IPhonePlayer ? unknown : PlayerPrefs.GetString(DEV_KOSIFA, unknown);
		deviceInfo.IFV = PlayerPrefs.GetString( DEV_KOSIFV, unknown);
		deviceInfo.osName = PlayerPrefs.GetString( DEV_OSNAME, unknown);
		deviceInfo.osVersion = PlayerPrefs.GetString( DEV_OSVERSION, unknown);
		deviceInfo.udid = PlayerPrefs.GetString( DEV_UDID, unknown);
		deviceInfo.systemLanguage = PlayerPrefs.GetString( DEV_LANGUAGE, unknown);
		if(deviceInfo.systemLanguage == "zh-Hans")
		{
			deviceInfo.systemLanguage = "zs";
		}
		else if(deviceInfo.systemLanguage == "zh-Hant")
		{
			deviceInfo.systemLanguage = "zt";
		}
		deviceInfo.carrierName = PlayerPrefs.GetString( DEV_CARRIER_NAME, unknown);
		deviceInfo.MNC = PlayerPrefs.GetString( DEV_MNC, unknown);
		deviceInfo.MCC = PlayerPrefs.GetString( DEV_MCC, unknown);
		deviceInfo.OpenUDID = PlayerPrefs.GetString( DEV_OPENUDID, unknown);
		deviceInfo.LimitAdTracking = PlayerPrefs.GetString(LIMITAD_TRACKING,unknown);
		
		deviceInfo.Initialize(deviceInfomation);
		
		
		//59a1cc5e4b7af16131a80973739b783f = UnityNet.getMD5Hash("com.kabam.chinamobile.project1");
		if(RuntimePlatform.Android == Application.platform){
//			deviceInfo.mobileId = UnityNet.getMD5Hash("59a1cc5e4b7af16131a80973739b783f" + NativeCaller.GetUniqueId());
			deviceInfo.mobileId = PlayerPrefs.GetString(SERVER_MOBILEID,UnityNet.getMD5Hash("59a1cc5e4b7af16131a80973739b783f" + NativeCaller.GetUniqueId()));
		}else if(RuntimePlatform.IPhonePlayer == Application.platform){
			// var osver:int = _Global.INT32(deviceInfo.osVersion.Substring(0,1));
			// if(osver >= 7){
				deviceInfo.mobileId = PlayerPrefs.GetString(SERVER_MOBILEID,UnityNet.getMD5Hash("59a1cc5e4b7af16131a80973739b783f" + deviceInfo.mac0));
			// }else{
			// 	deviceInfo.mobileId = UnityNet.getMD5Hash("59a1cc5e4b7af16131a80973739b783f" + deviceInfo.mac0);
			// }
		} else {//default

			deviceInfo.mobileId = PlayerPrefs.GetString(SERVER_MOBILEID, UnityNet.getMD5Hash("59a1cc5e4b7af16131a80973739b783f" + deviceInfo.mac0));
		}
		
		
		_Global.Log("Data.getDeviceInfo  mac0:" + deviceInfo.mac0 + 
		" macAll:" + deviceInfo.macAll + 
		" manufactor:" + deviceInfo.manufactor + 
		" model:" + deviceInfo.model + 
		" osName:" + deviceInfo.osName + 
		" osVersion:" + deviceInfo.osVersion + 
		" mobileId:" + deviceInfo.mobileId +
		" udid:" + deviceInfo.udid +
		" systemLanguage:" + deviceInfo.systemLanguage +
		" carrierName:" + deviceInfo.carrierName +
		" MNC:" + deviceInfo.MNC +
		" MCC:" + deviceInfo.MCC );
		 
		return deviceInfo;
	}
    
    public function UpdateIFAForIOS() {
        getDeviceInfo().IFA = NativeCaller.GetIFAForIOS();
    }
	
	public	function	getGameLanguageAb():String{
//		return "en";
		/*
		switch( gameLanguage ){
		case	SystemLanguage.German:
			return "de";
		
	//	case	SystemLanguage.Greek:
	//		return "el";
	//	
	//	case	SystemLanguage.English:
	//		return "en";
			
		case	SystemLanguage.Spanish:
			return "es";
			
		case	SystemLanguage.French:
			return "fr";
			
		case	SystemLanguage.Italian:
			return "it";
		case    SystemLanguage.Turkish:
			return "tr";
		case     SystemLanguage.Swedish:
			return "sv";
		case     SystemLanguage.Dutch: 
			return "nl";
		case     SystemLanguage.Danish:
			return "da";
		case     SystemLanguage.Russian: 
			return "ru";
		case     SystemLanguage.Polish:
			return "pl";
		case     SystemLanguage.Portuguese:
			return "pt"; 	 					 	
	//	case	SystemLanguage.Japanese:
	//		return "ja";
	//		
	//	case	SystemLanguage.Turkish:
	//		return "tr";
	//		
	//	case	SystemLanguage.Chinese:
	//		return "zh";
		
		default:
			return	"en";
		}
		*/
		return LocaleUtil.getInstance().getLang(gameLanguage).fileName;
	}
	
	public	function	init(){
//		PlayerPrefs.DeleteAll();
//		if( !PlayerPrefs.HasKey(DEV_UDID) ){
//			PlayerPrefs.SetString( DEV_UDID, iPhoneSettings.uniqueIdentifier);
//		}
		_Global.Log(" Unity iphone udid:" + SystemInfo.deviceUniqueIdentifier + " System udid:" + SystemInfo.deviceUniqueIdentifier );
		
		scenceLevel = PlayerPrefs.GetInt(SCENCE_LEVEL_KEY,GameMain.CITY_SCENCE_LEVEL);
		cityScale = PlayerPrefs.GetFloat(CITY_SCALE,GestureController.MAX_SCALE_FACTOR);
		fieldScale = PlayerPrefs.GetFloat(FIELD_SCALE,GestureController.MAX_SCALE_FACTOR);
		pushNotification = PlayerPrefs.GetInt( PUSH_NOTIFICATION, 1 );
		
		this.dataVersion = PlayerPrefs.GetString(DATAVERSION + worldid(),defaultDataVersion);
		this.uid = PlayerPrefs.GetInt(TVUID);
		this.worldId = PlayerPrefs.GetInt(WORLDID);
		
		kabamId = PlayerPrefs.GetString( KABAM_ID );
		naid    = PlayerPrefs.GetString( NAID );
		accessToken = PlayerPrefs.GetString( ACCESS_TOKEN );
		email = PlayerPrefs.GetString( EMAIL );
		
		gc_playerId =  PlayerPrefs.GetString(GAMECENTER_PLAYERID, "");
		gc_alias =  PlayerPrefs.GetString(GAMECENTER_ALIAS, "");
		
		gc_playerId_binded =  PlayerPrefs.GetString(GAMECENTER_PLAYERID_BINDED, "");
		gc_alias_binded =  PlayerPrefs.GetString(GAMECENTER_ALIAS_BINDED, "");

		loginTime = PlayerPrefs.GetString(LOGIN_TIME, "0");
		loginCnt = PlayerPrefs.GetInt(LOGIN_CNT, 0);
		
		sessionCnt = PlayerPrefs.GetInt(SESSION_COUNT, 0);
		shareCnt = PlayerPrefs.GetInt(SHARE_COUNT, 0);
		lastShareInWhichSessions = PlayerPrefs.GetInt(LASTSHARE_INWHICHSESSIONS, 0);
		last2ShareInWhichSessions = PlayerPrefs.GetInt(LAST2SHARE_INWHICHSESSIONS, 0);
		last3ShareInWhichSessions = PlayerPrefs.GetInt(LAST3SHARE_INWHICHSESSIONS, 0);
		lastPopupShareSession = PlayerPrefs.GetInt(LASTPOPUPSHARESESSION, 0);
		popupShareMenuInterval = PlayerPrefs.GetInt(POPUPSHAREMENUINTERVAL, 0);
        lastTimeToShowPaymentOffer = PlayerPrefs.GetString(LastTimeToShowPaymentOfferKey, "0");
		
		ignoreUsers =  PlayerPrefs.GetString(IGNORE_USERS, "{}");
		
		fteEndTime = PlayerPrefs.GetString(FTEEND_TIME, "0");
		lastKabamIdTime = PlayerPrefs.GetString(LASTKABAMID_TIME, "0");
		
		gameTheme = PlayerPrefs.GetInt(GAME_THEME,1);
	
		
		if( PlayerPrefs.HasKey( LANGUAGE ) )
		{
			gameLanguage = PlayerPrefs.GetInt( LANGUAGE, LocaleUtil.defaultID/*SystemLanguage.English*/);
			_Global.Log("game language:" + gameLanguage);
		}else
		{
//			gameLanguage = SystemLanguage.English;
			getDeviceInfo();
			_Global.Log("system language:" + deviceInfo.systemLanguage);
			//surpport mutilanguage
			/*
			switch( deviceInfo.systemLanguage){
			case	"de":
				gameLanguage = SystemLanguage.German;
				break;
				
			case	"es":
				gameLanguage = SystemLanguage.Spanish;
				break;
				
			case	"fr":
				gameLanguage = SystemLanguage.French;
				break;
				
			case	"tr":
				gameLanguage = SystemLanguage.Turkish;
				break;
			case	"sv":
				gameLanguage = SystemLanguage.Swedish;
				break;
			case	"nl":
				gameLanguage = SystemLanguage.Dutch;
				break;
			case	"da":
				gameLanguage = SystemLanguage.Danish;
				break;
			case	"ru":
				gameLanguage = SystemLanguage.Russian;
				break;
			case	"pl":
				gameLanguage = SystemLanguage.Polish;
				break;
			case	"pt":
				gameLanguage = SystemLanguage.Portuguese;
				break;	
			default:
				gameLanguage = SystemLanguage.English;
				break;
			}
			*/
			if (RuntimePlatform.Android == Application.platform)
				gameLanguage = LocaleUtil.getInstance().getLangIdByFN(deviceInfo.systemLanguage, deviceInfo.systemCountryCode);
			else			
				gameLanguage = LocaleUtil.getInstance().getLangIdByFN(deviceInfo.systemLanguage);
			setGameLanguage(gameLanguage);
		}

		gameLanguageAb = getGameLanguageAb();

		applicationTxtDir = GameMain.GetApplicationDataSavePath() + "/txt";
		var	txtDirInfo:DirectoryInfo = new DirectoryInfo(applicationTxtDir);
		if( !txtDirInfo.Exists ){
			txtDirInfo.Create();
		}
		
		if( PlayerPrefs.HasKey(CLIENT_VERSION_KEY) )
		{
			var clientVer:String = PlayerPrefs.GetString(CLIENT_VERSION_KEY);
			if( clientVer != BuildSetting.ClientVersion && (Application.platform == RuntimePlatform.IPhonePlayer || Application.platform == RuntimePlatform.Android))
			{//client update
				setOtaHasDownloaded( false );
				var finfos:FileInfo[] = txtDirInfo.GetFiles();
				for( var i:int = 0; i < finfos.length; i ++ )
				{
					if( finfos[i].Name.EndsWith(FILE_SUFFIX) )
					{
						finfos[i].Delete();
					}
				}
				
				PlayerPrefs.SetString(CLIENT_VERSION_KEY, BuildSetting.ClientVersion);
				PlayerPrefs.SetFloat(CITY_SCALE,GestureController.MAX_SCALE_FACTOR);
				PlayerPrefs.SetFloat(FIELD_SCALE,GestureController.MAX_SCALE_FACTOR);
				cityScale = PlayerPrefs.GetFloat(CITY_SCALE,GestureController.MAX_SCALE_FACTOR);
				fieldScale = PlayerPrefs.GetFloat(FIELD_SCALE,GestureController.MAX_SCALE_FACTOR);
				PlayerPrefs.SetString(DATAVERSION + worldid(),defaultDataVersion);
				this.dataVersion = PlayerPrefs.GetString(DATAVERSION + worldid(),defaultDataVersion);
//				GDSMgr.instance().ClearPlayerPrefs_GDS();
			}
		}
		else
		{
			PlayerPrefs.SetString(CLIENT_VERSION_KEY, BuildSetting.ClientVersion);
		}
	}
	
	public function clearClientUserData()
	{
		for(var item in [NAID,KABAM_ID,EMAIL,GAMECENTER_PLAYERID,GAMECENTER_ALIAS,GAMECENTER_PLAYERID_BINDED,GAMECENTER_ALIAS_BINDED])
		{
			PlayerPrefs.SetString(item,String.Empty);
		}
		PlayerPrefs.SetString(DATAVERSION + worldid(),"1");
		PlayerPrefs.SetInt(TVUID,0);
		PlayerPrefs.SetInt(VIPLEVELUPFLAG1,0);
		PlayerPrefs.SetInt(VIPLEVELUPFLAG2,0);
//		GDSMgr.instance().ClearPlayerPrefs_GDS();
		ChapterMapController.ClearUnlockMapData();
//		SetMarchAnimationLevelId_Campaign(0);
//		SetMarchAnimationEndTime_Campaign(0);
//		SetMarchAnimationLevelId_Chapter(0);
//		SetMarchAnimationEndTime_Chapter(0);
		this.init();
	}
	public function PrivacyClear()
	{
		try
		{
			var txtPrivacy: String = System.IO.Path.Combine(GameMain.GetPrivacyDataSavaPath(), "");
			if (Directory.Exists(txtPrivacy))
			{
				Directory.Delete(txtPrivacy, true);
			}
			GetPrivacy();
		}
		catch (e: System.Exception)
		{
			_Global.Log(" Clear PrivacyClear ");
			throw;
		}

	}

	public function GetPrivacy()
	{
		var txtprivacy: String = System.IO.Path.Combine(GameMain.GetPrivacyDataSavaPath(), "");
		Directory.CreateDirectory(txtprivacy);
	}

	public	function	clear(){ //for debug.
		PlayerPrefs.DeleteAll();
		
//		var	txtDirInfo:DirectoryInfo = new DirectoryInfo(applicationTxtDir);
//		var finfos:FileInfo[] = txtDirInfo.GetFiles();
//		for( var i:int = 0; i < finfos.length; i ++ ){
//			if( finfos[i].Name.EndsWith(FILE_SUFFIX) ){
//				finfos[i].Delete();
//			}
//		}
		try{
			var txtDir : String = System.IO.Path.Combine(GameMain.GetApplicationDataSavePath(),"txt");
			if (Directory.Exists(txtDir))
			{
				Directory.Delete(txtDir, true);
			}
			Directory.CreateDirectory(txtDir);
			var otaDir : String = System.IO.Path.Combine(GameMain.GetApplicationDataSavePath(),"ota");
			if (Directory.Exists(otaDir))
			{
				Directory.Delete(otaDir, true);
			}
			Directory.CreateDirectory(otaDir);
			ClearDirsFiles(GameMain.GetApplicationDataSavePath(),"user_");
			
			//removed in 18.5.0 Gaea	
//			NativeCaller.DoRestartOtherLevels();
		}catch( e:System.Exception ){
			_Global.Log(" Clear error " );
			throw;
		}
		
		become_user_id = "";
		become_password = "";
		AssetBundleManager.Instance().ClearAll();
//		delDataDownloadFile();
//		delStrDownloadFile();
	}
	
	public function clearMailAndReport()
	{
		try{
			ClearDirsFiles(SerializationUtils.GetiPhoneDocumentsPath(),"user_");
		}catch( e:System.Exception ){
			_Global.Log(" Clear mail And Report error " );
			throw;
		}
		
	}
	
//	public	function	delDataDownloadFile(){
//		var filePath:String = applicationTxtDir + "/" + DATA_FILE_NAME + FILE_SUFFIX;
//		var finfo:FileInfo = new FileInfo(filePath);
//		finfo.Delete();
//	}
//	
//	public	function	delStrDownloadFile(){	
//		var filePath:String = applicationTxtDir + "/" + STRING_FILE_NAME + "_" + gameLanguageAb + FILE_SUFFIX;
//		var finfo:FileInfo = new FileInfo(filePath);
//		finfo.Delete();
//	}
	
	public	function	getStringVersion():String{
		return	strVersion;
	}
	
	public function getLastLoadDataVersion():String
	{
		return this.lastLoadDataVersion;
	}
	
	public function getLastLoadStrVersion():String
	{
		return this.lastLoadStrVersion;
	}
	
	public		function	loadDataFromLocal(){
//		_Global.Log("loadDataFromLocal");
		
		
		var text:TextAsset;
		var contentPackage:String;
		var contentLoaded:String;
		var bLoaded:boolean = false;
		var wholeObj:HashObject;
		var filePath:String = applicationTxtDir + "/" + DATA_FILE_NAME + "_" + worldId + FILE_SUFFIX;
		var finfo:FileInfo = new FileInfo(filePath);
		
		var startTime:System.DateTime;
		var endTime:System.DateTime;
		
		if( !finfo.Exists ){
			startTime = System.DateTime.Now;
			text = TextureMgr.instance().LoadText(DATA_FILE_NAME,TextureType.DATA);
			endTime = System.DateTime.Now;
			_Global.Log("$$$$$ Data readfile : " + (endTime-startTime).TotalMilliseconds);
			contentPackage = text.text;
			bLoaded = false;
		}else{
			try{
				contentLoaded = readFromFile(filePath, finfo.Length);
				bLoaded = true;
			}catch(err){
				text = TextureMgr.instance().LoadText(DATA_FILE_NAME,TextureType.DATA);
				contentPackage = text.text;
				bLoaded = false;
			}
		}

		if(bLoaded)
		{
			try{
				wholeObj = (new JSONParse()).Parse(contentLoaded);//multi thread, so new one jsonparse
			}
			catch(err){
				wholeObj = (new JSONParse()).Parse(contentPackage);
			}
		}
		else
		{
			startTime = System.DateTime.Now;
			wholeObj = (new JSONParse()).Parse(contentPackage);
			endTime = System.DateTime.Now;
			_Global.Log("$$$$$ Data JSONParse : " + (endTime-startTime).TotalMilliseconds);
		}
		gameData = wholeObj["data"];
		if(gameData == null)
		{
			GameMain.instance().checkData();
			//var dataLoaded : String = " Flags.GM_DATA_LOADED:" + Flags.instance().GM_DATA_LOADED;
			var errorLog : String = "UserId : " + GameMain.singleton.getUserId() + " CurMenu : " + MenuMgr.instance.GetCurMenuName() + " gameData == NULL "; 
			UnityNet.reportErrorToServer("Data  loadDataFromLocal : ", null, null, errorLog, false);
		}
		else
		{
			if(itemlist() == null)
			{
				GameMain.instance().checkData();
				//var dataLoaded : String = " Flags.GM_DATA_LOADED:" + Flags.instance().GM_DATA_LOADED;
				var errorLog1 : String = "UserId : " + GameMain.singleton.getUserId() + " CurMenu : " + MenuMgr.instance.GetCurMenuName() + " itemlist() == NULL " + gameData.ToString(); 
				UnityNet.reportErrorToServer("Data  loadDataFromLocal : ", null, null, errorLog1, false);
			}
		}
		lastLoadDataVersion = dataVersion = wholeObj["version"].Value;
		Flags.instance().GM_DATA_LOADED = true;
//		_Global.Log("loadDataFromLocal over!");
	}
	
	public function loadStringsFromLocal(){
		_Global.LogWarning("language: loadStringsFromLocal start!");
		var startTime:System.DateTime = System.DateTime.Now;

		var fileName: String = STRING_FILE_NAME + "_" + gameLanguageAb;
		var defaultFileName:String = STRING_FILE_NAME + "_en";
		var fileFullPath:String = applicationTxtDir + "/" + gameTheme + "/" + fileName + FILE_SUFFIX;
		
		var text:TextAsset;
		var content:String;
		
		var finfo:FileInfo = new FileInfo(fileFullPath);

		
		if( !finfo.Exists ){
			
			text = TextureMgr.instance().LoadText(fileName,TextureType.DATA);

			if (text == null) {
				text = TextureMgr.instance().LoadText(defaultFileName,TextureType.DATA);
			}
			arString.Init(text.bytes);
		}else{
			try{
				/* content = readFromFile(fileFullPath, finfo.Length); */
				arString.Init(finfo);
			}catch(err){
				text = TextureMgr.instance().LoadText(fileName,TextureType.DATA);
				if( text == null ){
					text = TextureMgr.instance().LoadText(defaultFileName,TextureType.DATA);
				}
				arString.Init(text.bytes);
			}
		}

		var parser:JSONParse = new JSONParse();
		var config:String = arString["config"];
		var configObj:HashObject = parser.Parse(config);	
		lastLoadStrVersion = strVersion = configObj["version"].Value;
		var version: String = lastLoadStrVersion;

		_Global.LogWarning("language: loadStringsFromLocal over!");
	}
	
	
	public		function	writeToFile( result:byte[], fileName:String,  path:String ):boolean{
		

		var	ret:boolean = false;
		var fs:FileStream = null;
		var fileFullPath:String = path + "/" + fileName + FILE_SUFFIX;
		try
		{			
			var	dirInfo:DirectoryInfo = new DirectoryInfo(path);
			if( !dirInfo.Exists ){
				dirInfo.Create();
			}
			
			fs = new FileStream(fileFullPath, FileMode.Create);
			fs.Write(result, 0, result.Length );
			ret = true;		
		}
		catch(err:System.Exception)
		{
			var finfo:FileInfo = new FileInfo(fileFullPath);
			if( finfo.Exists )
				finfo.Delete();
		}
		finally
		{
			if( fs )
				fs.Close();
		}
		
		//if( ret ){
//			NativeCaller.PermanentCachFiles(fileFullPath);
		//}
		
		return	ret;
	}
	
	public		function	readFromFile(fileName:String, needLen:int):String{
	
		var	ret:String = "";
		var bs:byte[] = new byte[needLen];
		
		var fs:FileStream;
		try{
			fs = new FileStream(fileName, FileMode.Open);
			var readLen:int = fs.Read(bs, 0, needLen );
			ret = System.Text.Encoding.UTF8.GetString(bs, 0, readLen);
		}catch(err){
			throw	err;
		}finally{
			if( fs ){
				fs.Close();
			}
		}

		return ret;
	}

	public function setData(bytes:byte[], texts:String,load2RAM, bReload:boolean):Object
	{
		bytes=System.Text.Encoding.Default.GetBytes ( UnityNet.DESDeCode_AES(texts,null) );
		var mem1:long = System.GC.GetTotalMemory (true);
		var startTime:System.DateTime  = System.DateTime.Now;
		var	downloadObj:HashObject = ( new JSONParse()).Parse( UnityNet.DESDeCode_AES(texts,null));
		_Global.Log("$$$$$  Json Parse Data: " + (System.DateTime.Now - startTime).TotalMilliseconds);
		var mem2:long = System.GC.GetTotalMemory (true);
		_Global.Log("$$$$$  Data Memory: " + (mem2 - mem1));
		
		if( !_Global.GetBoolean(downloadObj["ok"]) )
			return null;

		var curVersionData : HashObject = downloadObj["version"];
		if ( curVersionData == null )
			return null;
		lastLoadDataVersion = curVersionData.Value;
		var restart:boolean = false;
		if( _Global.INT32(downloadObj["restartGame"]) != 0 )
			restart = true;

		var downloadObjData : HashObject = downloadObj["data"];
		if ( downloadObjData == null )
			return null;

		var cachedGameData : HashObject = null;
		if(load2RAM)
			cachedGameData = downloadObjData;

		if ( cachedGameData != null )
		{
			gameData = cachedGameData;
			dataVersion = lastLoadDataVersion;
		}

		if(writeToFile(bytes, DATA_FILE_NAME + "_" + worldId, applicationTxtDir ))
			Flags.instance().SetValue(DATA_FILE_NAME,true);

		//Flags.SetValue(Constant.Flag.D_RESTART_GAME,restart);
		if( bReload && restart ){
			Flags.instance().NeedRestartForData = true;
		}

		_Global.Log("Set Data RestartGame:" + restart);
		return downloadObj;
	}
	/*
	public		function	setStrings(bytes:byte[], texts:String)
	{
		setStrings(bytes,texts,false);
	}
	*/
	public		function	setStrings(bytes:byte[], texts:String, load2RAM:boolean, bReload:boolean):HashObject
	{	
		bytes=System.Text.Encoding.Default.GetBytes ( UnityNet.DESDeCode_AES(texts,null) ); 
		var tempString:KBNString = new KBNString();
		tempString.Init(bytes);
		var temp:String = tempString["config"];
		
		var mem1:long = System.GC.GetTotalMemory (true);
		var startTime:System.DateTime = System.DateTime.Now;
		var config:HashObject = (new JSONParse()).Parse(temp);
		_Global.Log("$$$$$  Json Parse String: " + (System.DateTime.Now - startTime).TotalMilliseconds);
		var mem2:long = System.GC.GetTotalMemory (true);
		_Global.Log("$$$$$  Memory String: " + (mem2 - mem1));
		
		if(config["ok"].Value == true)
		{
			lastLoadStrVersion = strVersion = config["version"].Value;
			arString = tempString;
			//		Flags.SetValue(Constant.Flag.D_RESTART_GAME,downloadObj["restartGame"] == true);
			if( config["restartGame"] != null && config["restartGame"].Value == true && bReload ){
				Flags.instance().NeedRestartForStrings = true;
			}
			
			if(writeToFile(bytes, STRING_FILE_NAME + "_" + gameLanguageAb, applicationTxtDir + "/" + gameTheme ))
			{
				Flags.instance().SetValue(STRING_FILE_NAME + "_" + gameLanguageAb,true);
			}
		}

	}

	public function PermanentCacheFile(filePath:String):void
	{
		NativeCaller.PermanentCacheFiles(filePath);
	}
	
	
	///////////errorlog///////////////
	public	function	saveErrorLog(e:String){
		if( !e || e.Length <= 0 ){
			return;
		}
		
		var fileFullPath:String = applicationTxtDir + "/" + ERROR_LOG_FILE_NAME;
		var finfo:FileInfo = new FileInfo(fileFullPath);
		
		if( finfo.Exists && finfo.Length >= ERROR_LOG_MAX_SIZE ){
			return;
		}
		
		try{
			var fs:FileStream = new FileStream(fileFullPath, FileMode.Append);
			var result:byte[] = System.Text.Encoding.UTF8.GetBytes(e+"\n");
			fs.Write(result, 0, result.Length );
		}catch(err:System.Exception){
//			_Global.Log(err.ToString());
		}finally{
			if( fs ){
				fs.Close();
			}
		}
	}
	
	public	function	getErrorLog():String{
		var fileFullPath:String = applicationTxtDir + "/" + ERROR_LOG_FILE_NAME;
		var finfo:FileInfo = new FileInfo(fileFullPath);
		if( !finfo.Exists || finfo.Length <= 0 ){
			return null;
		}
		
		var ret:String = readFromFile(fileFullPath, finfo.Length);
		return ret;
	}
	
	public	function	delErroLog(){
		var fileFullPath:String = applicationTxtDir + "/" + ERROR_LOG_FILE_NAME;
		var finfo:FileInfo = new FileInfo(fileFullPath);
		finfo.Delete();
	}
	///////////end errorlog///////////
	
	public function getFullDataFilePath():String
	{
		return applicationTxtDir + "/" + DATA_FILE_NAME  + "_" + worldId + FILE_SUFFIX;
	}
	
	public function getFullStrFilePath():String
	{
		return applicationTxtDir + "/" + gameTheme + "/" + STRING_FILE_NAME + "_" + gameLanguageAb + FILE_SUFFIX;
	}
	
	//BI recorder//
	public		function	getMobileLoadBI():int{
		return PlayerPrefs.GetInt(LOADING_MOBILE_BI,0);
	}
	
	public		function	setMobileLoadBI(bi:int){
		PlayerPrefs.SetInt(LOADING_MOBILE_BI,bi);
	}
	
	public		function	getUserLoadBI():int{
//		_Global.Log("getUserLoadBI U_" + uid + "_W_"+ worldId + "_BI" + PlayerPrefs.GetInt("U_" + tvuid + "_W_"+ worldId + "_BI", 0 ));
		return	PlayerPrefs.GetInt("U_" + uid + "_W_"+ worldId + "_BI", 0 );
	}
	
	public		function	setUserLoadBI(bi:int){
//		_Global.Log("setUserLoadBI U_" + uid + "_W_"+ worldId + "_BI" + bi);
		PlayerPrefs.SetInt("U_" + uid + "_W_"+ worldId + "_BI", bi );
	}
	
	public		function	getRaterFlag():String{
		var flag:String =	PlayerPrefs.GetString(RATER_FLAG, "");
		if( !flag.StartsWith( BuildSetting.ClientVersion + "_" ) ){
			return "";
		}
		
		return flag.Substring( (BuildSetting.ClientVersion+ "_").Length );
	}
	
	public		function	setRaterFlag( flag:String ):void{
		PlayerPrefs.SetString(RATER_FLAG, BuildSetting.ClientVersion + "_" + flag);
	}

	//TODO添加  
	public function GetPrivacyPolicyMenu(flag: String): void {
		getPrivacyPolicyMenu(flag);
	}



	public		function	tvuid():int{
		return uid;
	}
	
	public		function	worldid():int{
		return worldId;
	}
	
	public		function	getCityScale():float{
		return cityScale;
	}
	
	public		function	getFieldScale():float{
		return fieldScale;
	}
	public function setScenceLevelWithOutSave(scence:int){
		scenceLevel = scence;
	}
	public		function	scencelevel():int{
		return scenceLevel;
		
	}
	
	public     function  getPushNotification():boolean{
		return pushNotification==1?true:false;
	}
	
	public      function getEmail():String{
		return email;
	}
	
	public      function getKabamId():long
	{
		return _Global.INT64(kabamId);
	}
	
	public      function getNaid():String
	{
		return  naid;
	}
	
	//set pic camp remain attack times
	public      function setPicCampRemainTimes(remainTimes:int)
	{
		picCampRemainTimes = remainTimes;
	}
	
	public      function reducePicCampRemainTimes(times:int)
	{
		picCampRemainTimes = picCampRemainTimes - times;
	}
	
	//get pic camp remain attack times
	public      function getPicCampRemainTimes():int
	{
		return  picCampRemainTimes;
	}

	//set pic camp attack times
	public      function SetPicCampAttackTimes(remainTimes:int)
	{
		picCampAttackTimes = remainTimes;
	}
	
	public      function reducePicCampAttackTimes(times:int)
	{
		picCampAttackTimes = picCampAttackTimes + times;
	}
	
	//get pic camp attack times
	public      function getPicCampAttackTimes():int
	{
		return  this.picCampAttackTimes;
	}
    
    // Meaningless string constant to append after naid before hashing.
    // Please don't modify unless it's really needed.
    private static final var HASH_APPEND_FOR_NAID = "PlayerPrefs.SetInt(LAST3SHARE_INWHICHSESSIONS, last3ShareInWhichSessions);**_";

    public function getHashedNaid() : String {
        var toHash : String = naid;
        if (String.IsNullOrEmpty(toHash)) {
             toHash = String.Empty;
        }
        return UtilityTools.ComputeSHA1HexStringFromString(String.Format("{0}{1}", 
                toHash, HASH_APPEND_FOR_NAID), null);
    }
	
	public      function getAccessToken():String
	{
		return accessToken;
	}
	
	public		function	setTvuid(id:int){
		uid = id;
		PlayerPrefs.SetInt(TVUID,id);
	}
	
	public		function	setWorldid(id:int){
		worldId = id;
		PlayerPrefs.SetInt(WORLDID,id);
	}
	
	public		function	saveCityId( id:int ){
		PlayerPrefs.SetInt(CITYID,id);
	}
	
	public		function	getCityId( ):int{
		return PlayerPrefs.GetInt(CITYID);
	}

	/*保存医院城市ID*/
	public function saceHospitalCityId(id: int) {
		PlayerPrefs.SetInt(HOSPITALCITYID, id);
	}


		/*获取医院城市ID*/
	public function getHospitalCityId(): int {
		return PlayerPrefs.GetInt(HOSPITALCITYID);
	}



	public		function	setScenceLevel(newLv:int){
		scenceLevel = newLv;
		PlayerPrefs.SetInt(SCENCE_LEVEL_KEY,newLv);
	}
	
	public		function	setCityScale(scale:float){
		cityScale = scale;
		PlayerPrefs.SetFloat(CITY_SCALE,cityScale);
	}
	
	public		function	setFieldScale(scale:float){
		fieldScale = scale;
		PlayerPrefs.SetFloat(FIELD_SCALE,fieldScale);
	}
	
	public		function	getGameTheme():int{
		return gameTheme;
	}

	public		function	setGameTheme(theme:int):int{
		gameTheme = theme;
		PlayerPrefs.SetInt(GAME_THEME, theme);
	}
	
	public      function setPushNotification(push:boolean)
	{
		if(push)
			pushNotification = 1;
		else
			pushNotification = 0;	
		PlayerPrefs.SetInt( PUSH_NOTIFICATION, pushNotification);
	}

	
	public      function setNaid(id:String)
	{
		naid = id;
		PlayerPrefs.SetString( NAID, naid);
	}
	
	public      function setKabamId(id:long)
	{
		kabamId = "" + id;
		PlayerPrefs.SetString( KABAM_ID, kabamId);
		// change UnityNet InitPlayerPrefs
		UnityNet.InitPlayerPrefs();
	}
	
	public      function setAccessToken(token:String)
	{
		accessToken = token;
		PlayerPrefs.SetString(ACCESS_TOKEN ,accessToken);
	}
	
	public      function setEmail(userEmail:String)
	{
		email = userEmail;
		PlayerPrefs.SetString(EMAIL ,email);
	}
	
	public      function setGameLanguage(lang:int)
	{
		gameLanguage = lang;
		PlayerPrefs.SetInt(LANGUAGE ,gameLanguage);
	}
	
	public      function getGameLanguage():int
	{
		return gameLanguage;
	}
	
	public		function	setLoginTime( time:long ){
		loginTime = "" + time;
		PlayerPrefs.SetString(LOGIN_TIME, loginTime);
	}
	
	public		function	getLoginTime():long{
		return _Global.parseTime(loginTime);
	}
	
	//like {u1_2:92384028340,u3_1:29483928349}
	public		function	setIgnoreUsers(users:String):void
	{ 
		ignoreUsers =  users;
		PlayerPrefs.SetString(IGNORE_USERS, ignoreUsers);
	}
	public		function	getIgnoreUsers():String
	{
		 return ignoreUsers;
	}
	
	public		function	setFteEndTime( time:long ){
		fteEndTime = "" + time;
		PlayerPrefs.SetString(FTEEND_TIME, fteEndTime);
	}
	
	public		function	getFteEndTime():long{
		return _Global.parseTime(fteEndTime);
	}
	
	public		function	setLastKabamIdTime( time:long ){
		lastKabamIdTime = "" + time;
		PlayerPrefs.SetString(LASTKABAMID_TIME, lastKabamIdTime);
	}
	
	public		function	getLastKabamIdTime():long{
		return _Global.parseTime(lastKabamIdTime);
	}

	public		function	getLoginCnt():int{
		return loginCnt;
	}
	
	public		function	setLoginCnt( cnt:int ){
		loginCnt = cnt;
		PlayerPrefs.SetInt(LOGIN_CNT, loginCnt);
	}
	
	public 		function 	getSessionCnt():int{
		return sessionCnt;
	}
	
	public		function	setSessionCnt(cnt:int):int{
		sessionCnt = cnt;
		PlayerPrefs.SetInt(SESSION_COUNT, sessionCnt);
	}
	
	public		function	setShareCnt(cnt:int):int{
		shareCnt = cnt;
		PlayerPrefs.SetInt(SHARE_COUNT, shareCnt);
	}
	public		function	getShareCnt():int{
		return shareCnt;
	}
	public		function	setLastShareSessions(session:int):int{
		lastShareInWhichSessions = session;
		PlayerPrefs.SetInt(LASTSHARE_INWHICHSESSIONS, lastShareInWhichSessions);
	}
	public		function	getLastShareSessions():int{
		return lastShareInWhichSessions;
	}
	public		function	setLast2ShareSessions(session:int):int{
		last2ShareInWhichSessions = session;
		PlayerPrefs.SetInt(LAST2SHARE_INWHICHSESSIONS, last2ShareInWhichSessions);
	}
	public		function	getLast2ShareSessions():int{
		return last2ShareInWhichSessions;
	}
	public		function	setLast3ShareSessions(session:int):int{
		last3ShareInWhichSessions = session;
		PlayerPrefs.SetInt(LAST3SHARE_INWHICHSESSIONS, last3ShareInWhichSessions);
	}
	public		function	getLast3ShareSessions():int{
		return last3ShareInWhichSessions;
	}
	public		function	setLastPopupShareSession(session:int):int{
		lastPopupShareSession = session;
		PlayerPrefs.SetInt(LASTPOPUPSHARESESSION, lastPopupShareSession);
	}
	public		function	getLastPopupShareSession():int{
		return lastPopupShareSession;
	}
	public		function	setPopupShareMenuInterval(session:int):int{
		popupShareMenuInterval = session;
		PlayerPrefs.SetInt(POPUPSHAREMENUINTERVAL, popupShareMenuInterval);
	}
	public		function	getPopupShareMenuInterval():int{
		return popupShareMenuInterval;
	}
    
    // Should be called from MyItems only, indicating for which items no use button should be
    // displayed in player's inventory list
    public function GetUnusableItemRanges() : KBN.IntIntervalUnion {
		if(gameData == null)
		{
			return KBN.IntIntervalUnion.CreateFromHashObject(null);
		}
		{
			return KBN.IntIntervalUnion.CreateFromHashObject(gameData["unusableItems"]);
		}     
    }
    
    // Should be called from MyItem only.
    public function GetShadowGemItemRanges() : KBN.IntIntervalUnion {
		if(gameData == null)
		{
			return KBN.IntIntervalUnion.CreateFromHashObject(null);
		}
		else
		{
			return KBN.IntIntervalUnion.CreateFromHashObject(gameData["shadowGemItems"]);
		}     
    }
	
//	public		function	arStrings():HashObject{
//		return arString;
//	}
	
	
	public 		function 	getImageName(itemId:int):String
	{
		var node : HashObject = gameData["imageResourceData"];
		do
		{
			if ( node == null )
				break;
			node = node["i" + itemId.ToString()];
			if ( node == null )
				break;
			node = node[_Global.ap + "1"];
			if ( node == null )
				break;
			return node.Value;
		}while(false);
		var texMgr : TextureMgr = TextureMgr.instance();
		if ( texMgr == null )
			return "";
		return texMgr.LoadTileNameOfItem(itemId);
		/*
		if(gameData["imageResourceData"])
		{
			returnStr = gameData["imageResourceData"]["i" + itemId][_Global.ap + 1].Value;
		}

		return returnStr;
		*/
	}
	
	//game center
	private static	var GAMECENTER_PLAYERID:String = "gamecenter_playerid";
	private static	var GAMECENTER_ALIAS:String = "gamecenter_alias";
	
	private static	var GAMECENTER_PLAYERID_BINDED:String = "gamecenter_playerid_binded";
	private static	var GAMECENTER_ALIAS_BINDED:String = "gamecenter_alias_binded";
	
	private var gc_playerId_binded:String;
	private var gc_alias_binded:String;
	private var gc_playerId:String;
	private var gc_alias:String;
	
	public function SetGameCenterPlayerId_Binded(playerId:String)
	{
		gc_playerId_binded = playerId;
		PlayerPrefs.SetString(GAMECENTER_PLAYERID_BINDED ,playerId);
	}
	
	public function GetGameCenterPlayerId_Binded():String
	{
		return gc_playerId_binded;
	}
	
	public function SetGameCenterAlias_Binded(alias:String)
	{
		gc_alias_binded = alias;
		PlayerPrefs.SetString(GAMECENTER_ALIAS_BINDED ,alias);
	}
	
	public function GetGameCenterAlias_Binded() : String
	{
		return gc_alias_binded;
	}
	
	public function SetGameCenterPlayerId(playerId:String)
	{
		gc_playerId = playerId;
		PlayerPrefs.SetString(GAMECENTER_PLAYERID ,playerId);
	}
	
	public function GetGameCenterPlayerId():String
	{
		return gc_playerId;
	}
	public function SetGameCenterAlias(alias:String)
	{
		gc_alias = alias;
		PlayerPrefs.SetString(GAMECENTER_ALIAS ,alias);
	}
	
	public function GetGameCenterAlias()
	{
		return gc_alias;
	}
	
	public function GetArchiveMentId(questId:int):String
	{
		
		var gameCenterData:HashObject = gameData["gameCenter"];
		
		if(gameCenterData != null )
		{
			
			if( GetPlatform() == AppStore.ITunes && gameCenterData["questAchievementIds"] != null )
			{
				
				var archivementId:int = _Global.INT32(gameCenterData["questAchievementIds"][questId + String.Empty]);
				if(archivementId > 0)
				{
					
					return archivementId + String.Empty;
				}
			}
			else if( GetPlatform() == AppStore.GooglePlay && gameCenterData["androidQuestAchievementIds"] != null )
			{
				if( gameCenterData["androidQuestAchievementIds"][questId + String.Empty] != null )
				{
					return gameCenterData["androidQuestAchievementIds"][questId + String.Empty].Value + String.Empty;
				}
			}
		}
		return String.Empty;
	}
	
	public function SaveServerDataForClient(serverData:HashObject)
	{
		var gcIdBind:String = serverData["clientData"]["gcuid"].Value;
		SetGameCenterPlayerId_Binded(gcIdBind);
		
		var gcAliasBind:String = serverData["clientData"]["gcunick"].Value;
		SetGameCenterAlias_Binded(gcAliasBind);
		
		if(serverData["clientData"]["naid"] != null)
		{
			var serverNaid:String = _Global.GetString(serverData["clientData"]["naid"]);
			setNaid(serverNaid);
		}
		if(serverData["clientData"]["mobileid"] != null)
		{
			SetServerMobileId(serverData["clientData"]["mobileid"].Value);
		}
		if(serverData["clientData"]["kabamid"] != null)
		{
			setKabamId(_Global.INT64(serverData["clientData"]["kabamid"]));
		}
		if(serverData["clientData"]["email"] != null)
		{
			setEmail(serverData["clientData"]["email"].Value);
		}
	}
	
	private static	var SERVER_MOBILEID:String = "server_mobileId";
	public function SetServerMobileId(serverMobileId:String)
	{
//		if(RuntimePlatform.IPhonePlayer == Application.platform)
//		{
			var device:DeviceInfo = getDeviceInfo();
//			if(String.IsNullOrEmpty(device.osVersion) == false)
//			{
				device.mobileId = serverMobileId;
				PlayerPrefs.SetString(SERVER_MOBILEID, serverMobileId);
				UnityNet.changeMobileId(serverMobileId);
//			}
//		}
	}
	
	public function setPlayerPrefs_DATAVERSION()
	{
		PlayerPrefs.SetString(DATAVERSION + worldid(),dataVersion);
	}
	
	public function SycDataVersionFromPlayerPrefs()
	{
		dataVersion = PlayerPrefs.GetString(DATAVERSION + worldid(),defaultDataVersion);
	}
	
	public function getPlayerPrefs_DATAVERSION():String
	{
		return PlayerPrefs.GetString(DATAVERSION + worldid(),defaultDataVersion);
	}

	/*--------------------------------------------------------------------*/
	/* 本地缓存的 当前服的玩家等级 */
	public function SetPlayerCurrentLevel(lv: int) {
		PlayerPrefs.SetInt(PLAYER_CURRENT_LEVEL + worldid(), lv);
	}

	public function GetPlayerCurrentLevel() : int {
		return PlayerPrefs.GetInt(PLAYER_CURRENT_LEVEL + worldid(), 1);
	}


	/* 本地缓存的 当前玩家是否是首次购买道具 */
	public function SetPlayerFirstBuyState(isFirstBuy: boolean) {
		PlayerPrefs.SetInt(PLAYER_IS_FIRST_BUY, isFirstBuy ? 1 : 0);
	}

	public function GetPlayerisFirstBuyState(): boolean {
		return PlayerPrefs.GetInt(PLAYER_IS_FIRST_BUY, 1) == 1;
	}
	/*--------------------------------------------------------------------*/


	/*-----------------------  获得 数数统计TA需要的 driveid -----------------------------*/

	public function GetTADeviceId(): String {

#if !UNITY_EDITOR && UNITY_ANDROID
		var deviceID = NativeCaller.GetUniqueId();
	
#elif !UNITY_EDITOR && UNITY_IOS
		var deviceID = getDeviceInfo().OpenUDID;
#else
		var deviceID = SystemInfo.deviceUniqueIdentifier;
#endif

		return deviceID;
	}

	/*--------------------------------------------------------------------*/

}
