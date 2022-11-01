class PopupMgr extends KBN.PopupMgr
{	
	private var popupStack:Array;
	private var curWindowInfor:PopupInfor;
	private var m_bCanOpen:boolean = true;
	private var m_bMaintanceFlag:boolean = false;
	
	private var curWindowPriority:int;
	private var localMessageID:int;
	
//	private var localVersionInt:Array;

	public static var BAN_USER:String 		= "banuser";
	public static var MAINTENCE:String 		= "maintenance";
	public static var NORMAL_UPDATE:String 	= "normalupdate";
	public static var HARD_UPDATE:String 	= "hardupdate";
	public static var MESSAGE:String 		= "1";
	
	private var hasPriority1Mes:boolean;
	private var hasPriority2Mes:boolean;
	
	private var windowHash:Hashtable;
	private var popupInforHash:Hashtable;
	
	private var POINT_BANUSER:String = "banned";
	private var POINT_MAINTENCE:String = "maintence";	
	private var POINT_MESSAGE:String = "broadcast";
	
	private var POINT_UPGRADE_VERSION:String = "version";
	private var POINT_UPGRADE_URL:String = "url";
	private var POINT_UPGRADE_FLAG:String = "upgrade_flag";
		
	public static var PRIORITY_1:int = 1;
	public static var PRIORITY_2:int = 2;
	
	public static var REQUEST_GAME_VERSION:String = "requestGameVersion";
	public static var REQUEST_MESSAGE_ID:String = "requestMessageId";

//	public var UPDATE_URL:String;// = "http://www.cmdev3.kabam.asia/ota/public/";//"itms-apps://itunes.apple.com/us/app/mai.wang/id427392280?ls=1&mt=8";
	
	public static var UPDATE_STATE_FORCE:int = 2;
	public static var UPDATE_STATE_MAY:int = 1;
	public static var UPDATE_STATE_IGNORE:int = 0;
	
	private var hasShowNormalUpdateMenu:boolean = false;
	
	private function PopupMgr()
	{
		popupStack = new Array();

		hasPriority1Mes = false;
		hasPriority2Mes = false;
		
		curWindowPriority = 0;
		
		_isLockScreen = false;
		
		localMessageID = loadMesId();
		
//		initLocalGameVersion();
		hasShowNormalUpdateMenu = false;

		windowHash = new Hashtable();
		windowHash.Add(BAN_USER, 	new BanUser());
		windowHash.Add(MAINTENCE, 	new Maintenance());
		windowHash.Add(HARD_UPDATE, new HardUpdate());
		windowHash.Add(NORMAL_UPDATE,new NormalUpdate());
		windowHash.Add(MESSAGE, 	new PopupMessage());
	}
	
//	private function initLocalGameVersion():void
//	{
//		var version:Array = (BuildSetting.clientVersion).Split("."[0]);
//		var dataGameVersion:Array = new Array();
//		dataGameVersion.push(parseInt(version[0].Trim()));
//		dataGameVersion.push(parseInt(version[1].Trim()));
//		
//		var localVersion:String = PlayerPrefs.GetString(REQUEST_GAME_VERSION);
//		
//		if(localVersion == "")
//		{
//			PlayerPrefs.SetString(REQUEST_GAME_VERSION, BuildSetting.clientVersion);
//		}
//		else
//		{
//			version = localVersion.Split("."[0]);
//			var lovalGameVersion:Array = new Array();
//			lovalGameVersion.push(parseInt(version[0].Trim()));
//			lovalGameVersion.push(parseInt(version[1].Trim()));
//			
//			if((dataGameVersion[0] > lovalGameVersion[0]) || (dataGameVersion[1] > lovalGameVersion[1]))
//			{
//				PlayerPrefs.SetString(REQUEST_GAME_VERSION, BuildSetting.clientVersion);
//			}			
//		}
//		
//		localVersion = PlayerPrefs.GetString(REQUEST_GAME_VERSION);
//		
//		version = localVersion.Split("."[0]);
//		localVersionInt = new Array();
//		localVersionInt.push(parseInt(version[0].Trim()));
//		localVersionInt.push(parseInt(version[1].Trim()));
//	}

	public static function getInstance():PopupMgr
	{
		if(instance == null)
		{
			instance = new PopupMgr();
		}
		
		return instance as PopupMgr;
	}

	private function openWindow(infor:PopupInfor):void
	{
		if(m_bCanOpen)
		{
			var window:BaseTemplate = windowHash[infor.type] as BaseTemplate;
			window.openWindow(infor);
		}
	}
	
	public function forceCloseCurWindow():void
	{
		if(!curWindowInfor)
		{
			return;
		}
	
		var window:BaseTemplate = windowHash[curWindowInfor.type];
		window.closeWindow();
		curWindowInfor = null;
	}
	
	private function parseDataFromServer(_data:HashObject):PopupInfor
	{
		var data:HashObject = _data;
		var infor:PopupInfor;
			
		if(data["type"].Value == NORMAL_UPDATE)
		{
			infor = new PopupInfor();
			infor.type 	= NORMAL_UPDATE;
			infor.URL 	= data["url"].Value;
			infor.version = data["version"].Value;
			infor.priority = PRIORITY_2;
		}
		else if(data["type"].Value == HARD_UPDATE)
		{
			_isLockScreen = true;
			
			infor = new PopupInfor();
			infor.type 	= HARD_UPDATE;
			infor.URL 	= data["url"].Value;
			infor.version = data["version"].Value;
			infor.priority = PRIORITY_1;			
		}
		else if(data["type"].Value == MESSAGE)
		{
			infor = new PopupInfor();
			infor.id 	= _Global.INT32(data["messageId"]);
			infor.type 	= MESSAGE;
			infor.message = data["message"].Value;
			infor.priority = PRIORITY_2;
		}
		else if(data["type"].Value == BAN_USER)
		{
			_isLockScreen = true;	
			
			infor = new PopupInfor();
			infor.type 	= BAN_USER;
			infor.endTime = _Global.INT64(data["endtime"]);
			infor.priority = PRIORITY_1;
		}
		else if(data["type"].Value == MAINTENCE)
		{
			//_isLockScreen = true;
			
			infor = new PopupInfor();
			infor.type 	= MAINTENCE;
			infor.endTime = _Global.INT64(data["endtime"]);
			infor.priority = PRIORITY_1;
			//infor.message = data["message"].Value;
		}
		
		return infor;
	}

	public function update():void
	{
		if(popupStack.length > 0 && curWindowInfor == null)
		{
			curWindowInfor = popupStack.Shift();
			openWindow(curWindowInfor);
		}
	}
	
//	private function isHardUpdateGame(updateVersion:String):int
//	{	
//		var version:Array = updateVersion.Split("."[0]);
//		var updateVerArr:Array = new Array();		
//		updateVerArr.push(parseInt(version[0].Trim()));
//		updateVerArr.push(parseInt(version[1].Trim()));	
//
//		if(localVersionInt[0] < updateVerArr[0]) 
//		{
//			return UPDATE_STATE_FORCE;
//		}
//		else if(localVersionInt[0] == updateVerArr[0])
//		{
//			if(localVersionInt[1] < updateVerArr[1])
//			{
//				return UPDATE_STATE_MAY;
//			}		
//		}
//
//		return UPDATE_STATE_IGNORE;
//	}
	
//	public static function saveGameVersion(version:String):void
//	{
//		PlayerPrefs.SetString(REQUEST_GAME_VERSION, version);
//	}
	
	public static function loadMesId():int
	{
		var _str:String = PlayerPrefs.GetString(REQUEST_MESSAGE_ID);
		var returnInt:int = 0;

		try
		{	
			if(_str != "")
			{
				returnInt = _Global.INT32(_str);
			}	
		}
		catch(e:System.Exception)
		{
		
		}

		return returnInt;
	}
	
	public static function saveMesId(id:int):void
	{			
		PlayerPrefs.SetString(REQUEST_MESSAGE_ID, id + "");	
	}
	
	public function clearCurPopInfor():void
	{
		curWindowInfor = null;
		m_bCanOpen = true;
		hasShowNormalUpdateMenu = false;
	}
	
	public function checkPointOfSeed(url:String, seed:HashObject):boolean
	{
//		if( !UPDATE_URL && (url.EndsWith("getServerTime.php") || url.EndsWith("warmStartTracking.php") )){
//			if( seed["url"] ){
//				UPDATE_URL = seed["url"];
//			}
//		}
		if((curWindowInfor != null) && (curWindowInfor.priority == PRIORITY_1) )
		{
			m_bCanOpen = false;;
		}
		
		if(m_bMaintanceFlag) 
			m_bCanOpen = false;
		
		var data:HashObject;
		if(seed[POINT_BANUSER] != null || seed[MAINTENCE] != null)
		{
			popupStack.clear();
			forceCloseCurWindow();
			
			if(seed[POINT_BANUSER] != null)
			{
				data = new HashObject({"type":BAN_USER, "endtime":seed[POINT_BANUSER].Value + ""});
				curWindowInfor = parseDataFromServer(data);
			}
			else
			{
				m_bMaintanceFlag = true;
				data = new HashObject({"type":MAINTENCE, "endtime":seed[MAINTENCE].Value + ""});
				curWindowInfor = parseDataFromServer(data);
				if(seed["worldid"] != null)
				{
					var worldIdArray:HashObject = seed["worldid"];
					var worldid:int = _Global.INT32(worldIdArray[_Global.ap + 0]);
					MaintenanceChat.getInstance().setWorldId(worldid);
				}
			}
			
			openWindow(curWindowInfor);
			return true;
		}
		else
		{
			var versionFlag:int = seed[POINT_UPGRADE_FLAG]!=null?_Global.INT32(seed[POINT_UPGRADE_FLAG]):0;
			if(versionFlag >= 1)
			{
//				version = version.Substring(0, version.IndexOf(".", version.IndexOf(".", 0) + 1));			
//				if(version != (localVersionInt[0] + "." + localVersionInt[1]))
//				if(version)
//				{	
//					var updateState:int = isHardUpdateGame(version);

					var upgrateUrl:String = seed[POINT_UPGRADE_URL].Value;
					var version:String = seed[POINT_UPGRADE_VERSION].Value;
					
					if(versionFlag == UPDATE_STATE_FORCE)
					{	
						popupStack.clear();
						forceCloseCurWindow();					
						data = new HashObject({"type":HARD_UPDATE, "version":version, "url":upgrateUrl});
						curWindowInfor = parseDataFromServer(data);
						openWindow(curWindowInfor);
						return true;
					}
					else if(versionFlag == UPDATE_STATE_MAY && !hasShowNormalUpdateMenu)
					{
//						saveGameVersion(version);
//						var tempArr:Array = version.Split("."[0]);
//						localVersionInt.push(parseInt(tempArr[0].Trim()));
//						localVersionInt.push(parseInt(tempArr[1].Trim()));
						if(url.EndsWith("getServerTime.php"))
						{
							return;
						}
						
						hasShowNormalUpdateMenu = true;
						data = new HashObject({"type":NORMAL_UPDATE, "version":version, "url":upgrateUrl});
						popupStack.push(parseDataFromServer(data));
					}				
//				}			
			}

			if(seed[POINT_MESSAGE] != null)
			{
				var id:int = _Global.INT32(seed[POINT_MESSAGE]);
				if((localMessageID != id) && (id != 0))
				{
					getMessage();
				}
			}
		}
		return false;
	}
			
	private function getMessage():void
	{
		var canGetPopupMessage:Function = function(result:HashObject)
		{		
	  		if(result["ok"].Value)
			{
				var id:int = _Global.INT32(result["messageId"]);
				var message:HashObject = result["message"][id + ""];
				
				if(message)
				{
					localMessageID = id;
					saveMesId(localMessageID);
					var infor:PopupInfor = parseDataFromServer(message);
					popupStack.push(infor);				
				}				
	  		}			 
		};
		
		//---------------------------------------------------------//
		UnityNet.reqPopupMessage(null, canGetPopupMessage, null);  	
		//---------------------------------------------------------// 			
	}	
	
	public function setMaintanceFlag(bMaintance:boolean)
	{
		m_bMaintanceFlag = bMaintance;
	}
	
	public function getMaintanceFlag():boolean
	{
		return m_bMaintanceFlag;
	}
}
