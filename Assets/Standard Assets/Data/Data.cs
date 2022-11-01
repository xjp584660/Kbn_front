using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
namespace KBN {

    public abstract class Datas {
		public enum AppStore
		{
			Unknown,
			ITunes,
			GooglePlay,
			Amazon
		}

        #region Nested classes
        public class DeviceInfo {
            public  string osName;
            public  string osVersion;
            public  string mac0;
            public  string macAll;
            public  string mobileId;
            public  string udid;
            public  string manufactor;
            public  string model;
            public  string systemLanguage;
            public  string systemCountryCode;
            public  string carrierName;
            public  string MNC;
            public  string MCC;
            public  string OpenUDID;
            public  string IFA;
            public  string IFV;
            public  string LimitAdTracking;
			public  string ADID;

            public bool IsSupportGameCenterV6() {
                if (RuntimePlatform.IPhonePlayer == Application.platform) {
                    return true;
                    // int osver = _Global.INT32(osVersion.Substring(0, 1));
                    // return osver >= 6;
                }
                return false;
            }
            
            public void Initialize(string content) {
                try {
                    if (RuntimePlatform.Android != Application.platform)
                        return;
                    _Global.Log("ming content:" + content);
                    if (content == null || content == "")
                        return;
                    
                    HashObject hash = JSONParse.instance.NewInstance().Parse(content);
                    
                    if (hash[DEV_MAC0] != null)
                        mac0 = hash[DEV_MAC0].Value.ToString();
                    _Global.Log("ming mac0:" + mac0);
                    
                    if (hash[DEV_MAC0] != null)
                        macAll = hash[DEV_MAC0].Value.ToString();
                    _Global.Log("ming macAll:" + macAll);
                    
                    
                    if (hash[DEV_OSNAME] != null)
                        osName = hash[DEV_OSNAME].Value.ToString();
                    _Global.Log("ming osName:" + osName);
                    
                    if (hash[DEV_OSVERSION] != null)
                        osVersion = hash[DEV_OSVERSION].Value.ToString();
                    _Global.Log("ming osVersion:" + osVersion);
                    
                    if (hash[DEV_MANUFACTOR] != null)
                        manufactor = hash[DEV_MANUFACTOR].Value.ToString();
                    _Global.Log("ming manufactor:" + manufactor);
                    
                    if (hash[DEV_MODEL] != null)
                        model = hash[DEV_MODEL].Value.ToString();
                    _Global.Log("ming model:" + model);
                    
                    if (hash[DEV_KOSIFA] != null)
                        model = hash[DEV_KOSIFA].Value.ToString();
                    _Global.Log("ming model:" + model);
                    
                    if (hash[DEV_KOSIFV] != null)
                        IFV = hash[DEV_KOSIFV].Value.ToString();
					_Global.Log("ming IFV:" + IFV);
                    
                    if (hash[DEV_LANGUAGE] != null)
                        systemLanguage = hash[DEV_LANGUAGE].Value.ToString();
                    _Global.Log("ming systemLanguage:" + systemLanguage);
                    
                    if (hash[DEV_COUNTRY_CODE] != null)
                        systemCountryCode = hash[DEV_COUNTRY_CODE].Value.ToString();
                    _Global.Log("ming systemCountryCode:" + systemCountryCode);
                    
                    if (hash[DEV_CARRIER_NAME] != null)
                        carrierName = hash[DEV_CARRIER_NAME].Value.ToString();
                    _Global.Log("ming carrierName:" + carrierName);
                    
                    if (hash[DEV_MNC] != null)
                        MNC = hash[DEV_MNC].Value.ToString();
                    _Global.Log("ming MNC:" + MNC);
                    
                    if (hash[DEV_MCC] != null)
                        MCC = hash[DEV_MCC].Value.ToString();
                    _Global.Log("ming MCC:" + MCC);
                    
                    if (hash[DEV_OPENUDID] != null)
                        OpenUDID = hash[DEV_OPENUDID].Value.ToString(); 
                    _Global.Log("ming OpenUDID:" + OpenUDID);
                    
                    if (hash[LIMITAD_TRACKING] != null)
                        LimitAdTracking = hash[LIMITAD_TRACKING].Value.ToString();  
                    _Global.Log("ming limitAdtracking:" + LimitAdTracking); 
                    
                    if (hash[DEV_UDID] != null)
                        udid = hash[DEV_UDID].Value.ToString();
					_Global.Log("ming DEV_UDID:" + LimitAdTracking); 

					if (hash[AndroidADID] != null)
					{
						if(hash[AndroidADID].Value != null)
							ADID = hash[AndroidADID].Value.ToString();
						else
							ADID = "";
					}
					_Global.Log("ming ADID:" + ADID); 

                } catch (System.Exception ex) {
                    _Global.Log(ex.Message);
                }
                _Global.Log("ming udid:" + udid);                                                                                                                       
            }

            public void Log() {
                
                _Global.Log("ming mac0:" + mac0);
                _Global.Log("ming osName:" + osName);
                _Global.Log("ming osVersion:" + osVersion);
                _Global.Log("ming manufactor:" + manufactor);
                
                _Global.Log("ming model:" + model);
                _Global.Log("ming systemLanguage:" + systemLanguage);
                _Global.Log("ming systemCountryCode:" + systemCountryCode);
                
                _Global.Log("ming carrierName:" + carrierName);
                _Global.Log("ming MNC:" + MNC);
                _Global.Log("ming MCC:" + MCC);
                
                _Global.Log("ming OpenUDID:" + OpenUDID);
                _Global.Log("ming udid:" + udid);
                
            }
            
            public string GetAndroidSystemLanguage() {
                if (Application.platform != RuntimePlatform.Android) 
                    return systemLanguage;
                if (systemLanguage == "zh") {
                    if (systemCountryCode == "CN")
                        return "zs";
                    else
                        return "zt";
                }
                return systemLanguage;
            }       
        }
        #endregion

        #region Fields
        protected static KBNString arString = new KBNString();
        protected HashObject    gameData;
        protected DeviceInfo deviceInfo;
        public  static  string CLIENT_VERSION_KEY = "CVER";
        protected string CLIENT_PUBLIC_KEY = "null";
        
        protected string strVersion = "1";
        protected string dataVersion = "1";
        
        protected string lastLoadStrVersion = "1";
        protected string lastLoadDataVersion = "1";
        
        protected static  string LOADING_MOBILE_BI = "LOADING_MOBILE_BI";//include start game, getservertime and ota
        
        protected static  string DATA_FILE_NAME = "d";
        protected static  string STRING_FILE_NAME = "s";
        
        protected static  string RESOURCE_PATH = "Data/";
        protected static  string FILE_SUFFIX = ".txt";
        
        protected static  string SCENCE_LEVEL_KEY = "scenceLevel";
        protected static  string CITY_SCALE = "cityScale";
        protected static  string FIELD_SCALE = "fieldScale";
        protected static  string LOGIN_TIME = "loginTime";
        protected static  string LOGIN_CNT = "loginCnt";
        protected static  string SESSION_COUNT = "sessionCnt";
        
        protected static  string SHARE_COUNT = "shareCnt";
        protected static  string LASTSHARE_INWHICHSESSIONS = "lastShareInWhichSessions";
        protected static  string LAST2SHARE_INWHICHSESSIONS = "last2ShareInWhichSessions";
        protected static  string LAST3SHARE_INWHICHSESSIONS = "last3ShareInWhichSessions";
        protected static  string LASTPOPUPSHARESESSION = "lastPopupShareSession";
        protected static  string POPUPSHAREMENUINTERVAL = "popupShareMenuInterval";
        
        protected static  string NAID = "naid";
        protected static  string KABAM_ID = "kabamid";
        protected static  string ACCESS_TOKEN = "access_token";
        protected static  string EMAIL = "email";
        protected static  string LANGUAGE = "language";
        protected static  string TVUID = "tvuid";
        protected static  string WORLDID = "worldid";
        protected static  string CITYID = "cityid";
        protected static  string HOSPITALCITYID = "Hospitalcityid";/*医院城市ID*/


        protected static  string PUSH_NOTIFICATION = "PushNotification";
        protected static  string ERROR_LOG_FILE_NAME = "e";
        protected static  int ERROR_LOG_MAX_SIZE = 10240;
        
        protected static  string DEV_MAC0 = "KMAC0";
        protected static  string DEV_MAC_ALL = "KMACALL";
        protected static  string DEV_UDID = "KUDID";
        protected static  string DEV_OSNAME = "KOSNAME";
        protected static  string DEV_OSVERSION = "KOSVERSION";
        protected static  string DEV_MANUFACTOR = "KMANUFACTOR";
        protected static  string DEV_MODEL = "KMODEL";
        protected static  string DEV_LANGUAGE = "KSYSLANGUAGE";
        protected static  string DEV_COUNTRY_CODE = "KSYSCOUNTRYCODE";
        protected static  string DEV_CARRIER_NAME = "KCARRIERNAME";
        protected static  string DEV_MNC = "KMNC";
        protected static  string DEV_MCC = "KMCC";
        protected static  string DEV_OPENUDID = "OPENUDID";
        protected static  string DEV_KOSIFA = "KOSIFA";
        protected static  string DEV_KOSIFV = "KOSIFV";
        protected static  string FTEEND_TIME = "fteend_time";
        protected static  string LASTKABAMID_TIME = "lastkabamid_time";
        protected static  string LIMITAD_TRACKING = "LIMITADTRACKING";
		protected static  string AndroidADID = "ADID";
        protected static  string GAME_THEME = "GAMETHEME";

        protected const string LastTimeToShowPaymentOfferKey = "LastTimeToShowPaymentOffer";
        
        protected static string IGNORE_USERS = "ignored_users";
        
        protected static string NANIGANS = "nanigans";
        protected static string ISALLOW24FPS = "isallow24fps";
        
        protected static string RATER_FLAG = "rater_flag";
        public  static string RATER_NOW = "1";
        public  static string RATER_LATER = "2";
        public  static string RATER_NO = "3";
        
        protected static string DATAVERSION = "DATAVERSION";
        protected static string defaultDataVersion = "1";
		protected static string VIPLEVELUPFLAG1 = "VipLevelUpFlag1";
		protected static string VIPLEVELUPFLAG2 = "VipLevelUpFlag2";
		protected static string CAMPAIGN_MARCHANIMATION_LEVELID = "CamPaign_MarchAnimation_LevelId";
		protected static string CAMPAIGN_MARCHANIMATION_ENDTIME = "CamPaign_MarchAnimation_LeftTime";

		protected static string CHAPTER_MARCHANIMATION_LEVELID = "Chapter_MarchAnimation_LevelId";
		protected static string CHAPTER_MARCHANIMATION_ENDTIME = "CamPaign_MarchAnimation_LeftTime";

        protected const string LastSelectedDefenseTroopsKey = "LastSelectedDefenseTroops";

        protected const string PLAYER_CURRENT_LEVEL = "kbn_local_player_current_level_";
        protected const string PLAYER_IS_FIRST_BUY = "kbn_local_player_is_first_buy_state";

        #endregion

        public static AppStore GetPlatform()
		{
			if(RuntimePlatform.IPhonePlayer == Application.platform)
			{
				return AppStore.ITunes;
			}
			else if(RuntimePlatform.Android == Application.platform)
			{
				DeviceInfo devInfo = singleton.getDeviceInfo();
				if( string.Compare(devInfo.manufactor, "Amazon", true ) == 0 )
				{
					return AppStore.Amazon;
				}
				else
				{
					return AppStore.GooglePlay;
				}
			}
			else
			{
				return AppStore.Unknown;
			}
		}

        public string LastSelectedDefenseTroopsData
        {
            get
            {
                return PlayerPrefs.GetString(LastSelectedDefenseTroopsKey, "{}");
            }

            set
            {
                if (value == null)
                {
                    value = "{}";
                }
                PlayerPrefs.SetString(LastSelectedDefenseTroopsKey, value);
            }
        }

        protected string lastTimeToShowPaymentOffer;
        public long LastTimeToShowPaymentOffer
        {
            get
            {
                if (!string.IsNullOrEmpty(lastTimeToShowPaymentOffer))
                {
                    lastTimeToShowPaymentOffer = PlayerPrefs.GetString(LastTimeToShowPaymentOfferKey, "0");
                }
                return _Global.INT64(lastTimeToShowPaymentOffer);
            }

            set
            {
                lastTimeToShowPaymentOffer = value.ToString();
                PlayerPrefs.SetString(LastTimeToShowPaymentOfferKey, lastTimeToShowPaymentOffer);
            }
        }

        public string getDataVersion()
        {
            return dataVersion;
        }

        public abstract DeviceInfo getDeviceInfo();

        public static Datas singleton { get; protected set; }

        public abstract string getGameLanguageAb();

        public abstract void saveErrorLog(string e);

        public abstract void delErroLog();

        public abstract string GetDecodeKey();

        public abstract long getKabamId();

        public abstract string getNaid();

        public abstract string getAccessToken();

        public abstract string GetGameCenterPlayerId_Binded();

        public abstract string GetGameCenterAlias_Binded();

        public abstract string GetBecomeUserId();
		public abstract int getPicCampRemainTimes();
		public abstract void setPicCampRemainTimes();
		public abstract void reducePicCampRemainTimes();

        public abstract int getPicCampAttackTimes();
        public abstract void SetPicCampAttackTimes();
        public abstract void reducePicCampAttackTimes();

        public abstract string GetBecomeUserPassword();

        public abstract int getGameTheme();
		public abstract int worldid ();
		public abstract int tvuid ();
        public abstract void saceHospitalCityId(int id);
        public abstract int getHospitalCityId();

        public abstract string GetTADeviceId();



        private System.IO.StreamWriter st;
        public void getPrivacyPolicyMenu(string flag)
        {
            var filePath = Path.Combine(KBN._Global.ApplicationPersistentDataPath + "/Privacy", "PrivacyPolicyMenu.txt");
            Debug.Log(string.Format("<color=#ff0000>{0}</color>", filePath));
            byte[] byteArray = System.Text.UTF8Encoding.UTF8.GetBytes(flag);
            using (MemoryStream memory = new MemoryStream(byteArray))
            {
                byte[] buffer = new byte[1024 * 1024];
                FileStream file = File.Open(filePath, FileMode.OpenOrCreate);
                int readBytes;
                while ((readBytes = memory.Read(buffer, 0, buffer.Length)) > 0)
                {
                    file.Write(buffer, 0, readBytes);
                }


                file.Close();

            }
            //st = File.CreateText(KBN._Global.ApplicationPersistentDataPath + "PrivacyPolicyMenu");
            //st.Write(flag);
            //Debug.Log(string.Format("<color=#ff0000>{0}</color>", KBN._Global.ApplicationPersistentDataPath + "PrivacyPolicyMenu"));
            //st.Close();
        }

        public static string getArString(string keyPath) {
            return arString.LoadStr(keyPath);
        }

        public static string GetFormattedString(string keyPath, params object[] parameters)
        {
            var ret = getArString(keyPath);
            if (parameters == null || parameters.Length == 0)
            {
                return ret;
            }

            try
            {
                return string.Format(ret, parameters);
            }
            catch(System.FormatException)
            {
                // Do nothing
            }
            return ret;
        }

        public static bool IsExistString(string keyPath) {
            return arString.Contains(keyPath);
        }

        public static bool TryGetString(ref string keyPath) {
            if (!arString.Contains(keyPath))
                return false;
            keyPath = arString.LoadStr(keyPath);
            return true;
        }
        
        public static bool IsStringReady() {
            return arString.IsStringReady();
        }

        #region Get children node Functions.
        public HashObject getGameData() {
            return gameData;
        }

        public HashObject itemlist() {
            return gameData["itemlist"];
        }

		public HashObject itemOrders()
		{
			return gameData["itemOrder"];
		}

        public HashObject chestlist() {
            return gameData["chestlist"];
        }
        
        public HashObject surveyTileType() {
            return gameData["canSurveyTileType"];
        }
        
        public HashObject researchData() {
            return gameData["researchData"];
        }
        
        public HashObject recipeData() {
            return gameData["recipeData"];
        }

        public HashObject unitmight() {
            return  gameData["unitmight"];
        }
        
        public HashObject questlist() {
            return  gameData["questlist"];
        }
        
        public HashObject imageResourceData() {
            return gameData["imageResourceData"];
        }

        public HashObject artifactData() {
            return  gameData["artifactData"];
        }

        public HashObject provinceNames() {
            return gameData["provincenames"];
        }

        public HashObject buildCityReqs() {
            return  gameData["buildCityReqs"];
        }
        
        public HashObject sharePopSetting() {
            return  gameData["share"];
        }

		public HashObject gearLevelUpTools() {
			return gameData["gearlevelupitemlist"];
		}

		public HashObject colorLabeledQuestList() {
			return gameData["recommendquestlist"];
		}

		public string GetStarKnightLevel(int lev)
		{
			var knightNode = gameData["knightstarlevel"];
			if ( knightNode == null )
				return null;
			var levDat = knightNode[lev.ToString()];
			if ( levDat == null )
				return null;
			return getArString(_Global.GetString(levDat));
		}

		public HashObject allianceEmblemConfig() {
			return gameData["allianceEmblemsConfig"];
		}

        #endregion
        
        public bool    otaHasDownloaded(){
            return PlayerPrefs.GetInt("OTA_DONE", 0) != 0;
        }
        
        public void setOtaHasDownloaded(bool b){
            PlayerPrefs.SetInt("OTA_DONE", b ? 1 : 0 );
        }

        static public object getValue(HashObject data, string keyPath)
        {
            string[] list = keyPath.Split('.');
            HashObject tbj = data;
            
            int n = list.Length;
            string key;
            for(int i=0; i<n; i++)
            {
                key = list[i];
                tbj = tbj[key];
                
                if(tbj == null)            
                    break;            
                
            }        
            return tbj;        
        }

        static public object getHashObjectValue(HashObject data, string keyPath)
        {
            var hObj = getValue(data,keyPath) as HashObject;
            if (hObj != null)
                return hObj.Value;
            return null;
        }

        static public int getIntValue(HashObject data, string keyPath)
        {
            object v = getValue(data,keyPath);
            if( v as HashObject != null)
                return _Global.INT32((v as HashObject).Value );
            else
                return _Global.INT32(v);    
        }

		public HashObject getOneRecipe(string recipeId)
		{
			foreach ( HashObject tempData in _Global.GetObjectValues(this.recipeData()) )
			{
				if(_Global.GetString(tempData["recipeId"]) == recipeId)
					return tempData;
			}
			return null;
		}

		public void SetVipLevelUpFlag1(int iLevelUP)
		{
			PlayerPrefs.SetInt (VIPLEVELUPFLAG1,iLevelUP);
		}

		public int GetVipLevelUpFlag1()
		{
			return PlayerPrefs.GetInt (VIPLEVELUPFLAG1,0);
		}

		public void SetVipLevelUpFlag2(int iLevelUP)
		{
			PlayerPrefs.SetInt (VIPLEVELUPFLAG2,iLevelUP);
		}
		
		public int GetVipLevelUpFlag2()
		{
			return PlayerPrefs.GetInt (VIPLEVELUPFLAG2,0);
		}
		public 	abstract	string 	getImageName(int itemId);

		protected void ClearDirFiles(string path){
			ClearDirsFiles(path,"*");
		}

		protected void  ClearDirsFiles(string path,string wildcards ){
			if(!Directory.Exists(path)) return;
			DirectoryInfo dirInfo = new DirectoryInfo (path);
			DirectoryInfo[] dirs= dirInfo.GetDirectories ();
			
			foreach (var item in dirs) {
				string dirpath=Path.Combine (path, item.Name);
				if (item.Name.StartsWith (wildcards) || wildcards=="*") {
					Directory.Delete (dirpath,true);
				}
				
				
			}
		}





		public string saveScreenShort(Texture2D texture){
			string imgPath = KBN._Global.ApplicationPersistentDataPath + "/imageCache";
			if(!Directory.Exists(imgPath)){
				Directory.CreateDirectory(imgPath);
			}else{//clear old photo
				string[] paths =	Directory.GetFileSystemEntries(imgPath);
				for (int i = 0; i < paths.Length; i++) {
					File.Delete(paths[i]);
				}

			}
			string imageName=string.Format("{0}.png",GameMain.unixtime());
			imgPath = Path.Combine(imgPath,imageName);
//			Texture2D t = getScreenTexture(rect);

			//二进制转换
			byte[] byt = texture.EncodeToPNG ();
			System.IO.File.WriteAllBytes (imgPath, byt);
			return imgPath;
		}

		public Texture2D getScreenTexture(Rect rect) {
			Rect realRect=new Rect(0,0,0,0);
			realRect.x=rect.x*Screen.width/640;
			realRect.width=rect.width*Screen.width/640;

			realRect.height=rect.height*Screen.height/960;
			realRect.y=Screen.height - rect.y*Screen.height/960-realRect.height;

			if(KBN._Global.isIphoneX()){//iphoneX YScale is about 0.91f
				realRect.height=0.91f*rect.height*Screen.height/960;
				realRect.y=Screen.height - rect.y*Screen.height/960-realRect.height-40;
			}


			//需要正确设置好图片保存格式
			Texture2D t = new Texture2D( Mathf.FloorToInt(realRect.width),Mathf.FloorToInt(realRect.height),TextureFormat.RGB24, true);
			//按照设定区域读取像素；注意是以左下角为原点读取
			t.ReadPixels (realRect, 0, 0, false);
			t.Apply ();
			return t;

		}
		

				
				//		public int GetMarchAnimationLevelId_Campaign()
//		{
//			return PlayerPrefs.GetInt (CAMPAIGN_MARCHANIMATION_LEVELID,-1);
//		}
//
//		public void SetMarchAnimationLevelId_Campaign(int levelId)
//		{
//			PlayerPrefs.SetInt (CAMPAIGN_MARCHANIMATION_LEVELID,levelId);
//		}
//
//		public long GetMarchAnimationEndTime_Campaign()
//		{
//			return _Global.INT64(PlayerPrefs.GetString (CAMPAIGN_MARCHANIMATION_ENDTIME,""));
//		}
//		
//		public void SetMarchAnimationEndTime_Campaign(long endTime)
//		{
//			PlayerPrefs.SetString (CAMPAIGN_MARCHANIMATION_ENDTIME,endTime+"");
//		}
//
//
//		public int GetMarchAnimationLevelId_Chapter()
//		{
//			return PlayerPrefs.GetInt (CHAPTER_MARCHANIMATION_LEVELID,-1);
//		}
//		
//		public void SetMarchAnimationLevelId_Chapter(int levelId)
//		{
//			PlayerPrefs.SetInt (CHAPTER_MARCHANIMATION_LEVELID,levelId);
//		}
//
//		public long GetMarchAnimationEndTime_Chapter()
//		{
//			return _Global.INT64(PlayerPrefs.GetString (CHAPTER_MARCHANIMATION_ENDTIME,""));
//		}
//		
//		public void SetMarchAnimationEndTime_Chapter(long endTime)
//		{
//			PlayerPrefs.SetString (CHAPTER_MARCHANIMATION_ENDTIME,endTime+"");
//		}
	}
}
