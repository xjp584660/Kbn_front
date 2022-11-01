using UnityEngine;
using System.Collections;
using System.Runtime.InteropServices;

using System;
using System.IO;
using System.Text;
using System.Security.Cryptography;

using System.Collections.Generic;

public class NativeCaller 
{

#if	!UNITY_EDITOR
#if  UNITY_IOS
	#if !UNITY_ANDROID
		[DllImport ("__Internal")]
		private static extern void _BuyAppProduct(string productId, string userName);

		[DllImport ("__Internal")]
		private static extern void _BuyAppOfferProduct(string productId, string userName, int offerId);
		

		[DllImport ("__Internal")]
		private static extern void _SetProductPakages(string jsonStr);
		
		[DllImport ("__Internal")]
		private static extern void _ItunesCheckPackages();
		
		
		//Share 
		// [DllImport ("__Internal")]
		// private static extern bool _IsShareLogin(int type);	
		// [DllImport ("__Internal")]
		// private static extern void _SendShareStatus(string status,int type);
		
		// [DllImport ("__Internal")]
		// private static extern void _LoginShare(int type);
		
		
		// [DllImport ("__Internal")]
		// private static extern string _GetShareLoginName(int type);
		// [DllImport ("__Internal")]
		// private static extern void _LogoutShare(int type);
		// [DllImport ("__Internal")]
		// private static extern void _SharePhoto(string path);
		[DllImport ("__Internal")]
		private static extern void _GetDeviceInfo();
		
		[DllImport ("__Internal")]
		private static extern void _RecoverPaymentObserver();
		
		[DllImport ("__Internal")]
		private static extern void _OpenRaterAlert(string title, string msg, 
		                                           string rateNow, string rateLater, 
		                                           string noRate, string clientVer, string url,string id);
    
        [DllImport ("__Internal")]
        private static extern void _OpenRaterAlertNew(string title, string msg,
                                                  string rateNow, string rateLater,
                                                  string userVoice, string clientVer, string url, string id);
		
		[DllImport ("__Internal")]
		private static extern void _OpenUserVoice(string ssoToken, string site, string key, string secret);

		[DllImport ("__Internal")]
		private static extern void _PermanentCacheFiles(string filePath);
		
		[DllImport ("__Internal")]
		private static extern void _InitMobileAppTracker(String advertiserId, string appKey, string siteId);
		
		[DllImport ("__Internal")]
		private static extern void _Chartboost(string appSignature, string appId);
		
		[DllImport ("__Internal")]
		private static extern void _ShowInputBoxAtx(float x,float y,float width,float height,int inputGuid);
		
		[DllImport ("__Internal")]
		private static extern void _ChangeInputBoxAtx(float x,float y,float width,float height);
		
		[DllImport ("__Internal")]
		private static extern void _SetInputBoxMaxChars(int maxChars);
		
		[DllImport ("__Internal")]
		private static extern void _HideInputBox();
		
		[DllImport ("__Internal")]
		private static extern string _GetInputBoxText();
		
		[DllImport ("__Internal")]
		private static extern string _GetAllOpenFile();
		
		[DllImport ("__Internal")]
		private static extern void _SetInputBoxText(string txt);


		[DllImport ("__Internal")]
		private static extern void _ChartboostShowInterstitial(string appSignature, string appId);
		
		
		[DllImport ("__Internal")]
		private static extern void _TrackAction(string action);
		
		[DllImport ("__Internal")]
		private static extern void _TrackNanigansEvent(string Uid, string Type, string Name, string AppId);
		
		[DllImport ("__Internal")]
		private static extern bool _IsIpodPlaying();
		
		[DllImport ("__Internal")]
		private static extern bool _ShowTapjoyOffers();
		
		[DllImport ("__Internal")]
		private static extern bool _requestTapjoyConnect(string appId, string secretKey);
		
		[DllImport ("__Internal")]
		private static extern bool _SetTapJoyTVUID(string TVUID);
		
		[DllImport ("__Internal")]
		private static extern bool _IsAllow24FPS();
		
		[DllImport ("__Internal")]
		private static extern void _UpdateLimitedTracking();

		[DllImport ("__Internal")]
		private static extern void _ResetAchievements();
		
		[DllImport ("__Internal")]
		private static extern void _AuthehticatLocalUser();
		
		[DllImport ("__Internal")]
		private static extern void _ShowGameCenterChallenges();
			
		[DllImport ("__Internal")]
		private static extern void _ShowGameCenterLeaderboards();
		
		[DllImport ("__Internal")]
		private static extern void _ReportAchievement(string archievementId);
		
		[DllImport ("__Internal")]
		private static extern void _ReportScore(string category,long score);

		//[DllImport ("__Internal")]
		//public static extern bool InitOtherLevels(string appKey);
//		[DllImport ("__Internal")]
//		private static extern void ResetOtherLevelsAppKey(string appKey, string channelKey, string authKey);
//		[DllImport ("__Internal")]
//		private static extern void LinkOtherLevelsTrackingId(string trackID);
//		[DllImport ("__Internal")]
//		private static extern void UnlinkOtherLevelsTrackingId(string trackID);
//		[DllImport ("__Internal")]
//		private static extern void RestartOtherLevels();

		[DllImport("__Internal")]
		private static extern void  _startNewRelic(string token);

		[DllImport("__Internal")]
		private static extern float MemoryUsage();

        [DllImport("__Internal")]
        private static extern string _GetIFA();

//        [DllImport("__Internal")]
//		private static extern void _SendFacebookPost(string urlLink, string imageUrl, string title, string description, string action);

		[DllImport ("__Internal")]
		private static extern string _GetSystemProxyName();
		[DllImport ("__Internal")]
		private static extern int _GetSystemProxyPort();
	
		[DllImport ("__Internal")]
		private static extern float _GetMainScreenWidth();
		[DllImport ("__Internal")]
		private static extern float _GetMainScreenHeight();

		[DllImport ("__Internal")]
		private static extern void _GaeaLogin(string gaeaId, string loginType);
		
		[DllImport ("__Internal")]
		private static extern void _RoleCreate(string accountId, string serverId);
		
		[DllImport ("__Internal")]
		private static extern void _RoleLogin(string accountId, string serverId, int levelId);
		
		[DllImport ("__Internal")]
		private static extern void _RoleLogout(string accountId);
		
		[DllImport ("__Internal")]
		private static extern void _SetRoleLevel(int level, string accountId);
		
		[DllImport ("__Internal")]
		private static extern void _RechargeFinished(string transactionId, string currencyAmount, string currencyType, string payChannel, string goodId, int status);
	#endif
#endif
#endif

	#region GATA
	public  static void GaeaLogin(string gaeaId, string loginType)
	{
		#if	!UNITY_EDITOR
		#if  UNITY_IOS
		_GaeaLogin(gaeaId, loginType);
		#endif
		
		#if  UNITY_ANDROID
		android.GaeaLogin(gaeaId,loginType);
		#endif
		#endif

	}
	public static void RoleCreate(string accountId, string serverId)
	{
		#if	!UNITY_EDITOR
		#if  UNITY_IOS
		_RoleCreate(accountId, serverId);
		#endif
		
		#if  UNITY_ANDROID
		android.RoleCreate(accountId,serverId);
		#endif
		#endif

	}
	public static void RoleLogin(string accountId, string serverId, int levelId)
	{
		#if	!UNITY_EDITOR
		#if  UNITY_IOS
		_RoleLogin(accountId, serverId, levelId);
		#endif
		
		#if  UNITY_ANDROID
		android.RoleLogin(accountId,serverId,levelId);
		#endif
		#endif

	}
	public static void RoleLogout(string accountId)
	{
		#if	!UNITY_EDITOR
		#if  UNITY_IOS
		_RoleLogout(accountId);
		#endif
		
		#if  UNITY_ANDROID
		android.RoleLogout(accountId);
		#endif
		#endif

	}
	public static void SetRoleLevel(int level, string accountId)
	{
		#if	!UNITY_EDITOR
		#if  UNITY_IOS
		_SetRoleLevel(level, accountId);
		#endif
		
		#if  UNITY_ANDROID
		android.SetRoleLevel(level,accountId);
		#endif
		#endif

	}
	public static void RechargeFinished(string transactionId, string currencyAmount, string currencyType, string payChannel, string goodId, int status)
	{
		#if	!UNITY_EDITOR
		#if  UNITY_IOS		
		int amout = int.Parse(currencyAmount);
		_RechargeFinished(transactionId, amout/100.0+"", currencyType, payChannel, goodId, status);
		#endif
		
		#if  UNITY_ANDROID
		android.RechargeFinished(transactionId,currencyAmount,currencyType,payChannel,goodId,status);
		#endif
		#endif

	}
	#endregion

//    public static void SendFacebookPost(string urlLink, string imageUrl, string title, string description, string action)
//    {
//#if UNITY_EDITOR
//        KBN._Global.LogWarning("Unsupported in Unity Editor");
//#elif UNITY_IOS
//		_SendFacebookPost(urlLink,imageUrl,title,description,action);
//#elif UNITY_ANDROID
//        // TODO: Android implementation
//        // 'paramJson' is to be passed to the facebook feeding dialog as parameters.
//		android.SendFacebookPost(urlLink,imageUrl,title,description,action);
//#endif
//    }

	public static void DoResetOtherLevelsAppKey(string appKey, string channelKey, string authKey,string userInfoKey)
	{
//		#if	!UNITY_EDITOR
//		if ( string.IsNullOrEmpty(appKey) || string.IsNullOrEmpty(channelKey) || string.IsNullOrEmpty(authKey) )
//		{
//			return;
//		}
//
//		switch ( Application.platform )
//		{
//			#if  UNITY_IOS
//			case RuntimePlatform.IPhonePlayer:
//				ResetOtherLevelsAppKey(appKey, channelKey, authKey);
//				break;
//			#endif
//
//			#if UNITY_ANDROID
//			case RuntimePlatform.Android:
//			android.ResetOtherLevelsAppKey(appKey, channelKey, authKey,userInfoKey);
//				break;
//			#endif
//		}		
//		#endif
	}

	public static string GetGCMRegistrationId()
	{
		return android.GetGCMRegistrationId();
	}

	public static void DoLinkOtherLevelsTrackingId(string trackingID, int worldId)
	{
//		//string trackingID = string.Format ("{0}-{1}", naid.ToString(), uid.ToString());
//		string olOldTrackingID = "OLTrackingID";
//		#if	!UNITY_EDITOR
//		string oldTrackingID = PlayerPrefs.GetString(olOldTrackingID);
//		if ( oldTrackingID != trackingID && !String.IsNullOrEmpty(oldTrackingID) )
//		{
//			switch ( Application.platform )
//			{
//				#if  UNITY_IOS
//				case RuntimePlatform.IPhonePlayer:
//					UnlinkOtherLevelsTrackingId(oldTrackingID);
//					break;
//				#endif
//
//				#if UNITY_ANDROID
//
//				case RuntimePlatform.Android:
//					android.UnLinkOtherLevelsTrackingId(oldTrackingID);
//					break;
//				#endif
//			}
//		}
//
//		switch ( Application.platform )
//		{
//			#if  UNITY_IOS
//			case RuntimePlatform.IPhonePlayer:
//				LinkOtherLevelsTrackingId(trackingID);
//				break;
//			#endif
//
//			#if UNITY_ANDROID
//			case RuntimePlatform.Android:
//				android.LinkOtherLevelsTrackingId(trackingID);
//				break;
//			#endif
//		}
//		#endif
//		PlayerPrefs.SetString(olOldTrackingID, trackingID);
	}

	public static void DoUnlinkOtherLevelsTrackingId(string trackingID, int worldId)
	{
//		#if	!UNITY_EDITOR
//		//string trackingID = string.Format ("{0}-{1}", naid.ToString(), uid.ToString());
//		switch ( Application.platform )
//		{
//			#if  UNITY_IOS
//			case RuntimePlatform.IPhonePlayer:
//				UnlinkOtherLevelsTrackingId(trackingID);
//				break;
//			#endif
//			#if UNITY_ANDROID
//			case RuntimePlatform.Android:
//				android.UnLinkOtherLevelsTrackingId(trackingID);
//				break;
//			#endif
//		}
//		#endif
	}
	
	public static void DoRestartOtherLevels()
	{
//		#if	!UNITY_EDITOR
//			#if  UNITY_IOS
//			if ( Application.platform == RuntimePlatform.IPhonePlayer )
//				RestartOtherLevels();
//			#endif
//		#endif
	}
		

	private static AndroidNativeCaller android = new AndroidNativeCaller();

	public class UserVoice
	{
		public static String nodeName = "UserVoice";
	
		public static String VECTOR = "Vector";
		public static String SECRET = "Secret";
		public static String SITE = "Site";
		public static String KEY = "Key";
		public static String SSOKEY = "SSOKey";
		public static String SUBDOMAIN = "Subdomain";
	}
	
	public class AppTracker
	{
		public static String nodeName = "AppTracker";
		public static String ADVERTISERID = "AdvertiserId";
		public static String APPKEY = "AppKey";
		public static String SITEID = "SiteId";
		public static String SITEID_ANDROID = "SiteId_Android";
	}
	
	public class ChartBoost
	{
		public static String nodeName = "ChartBoost";
		public static String nodeNameAndroid = "ChartBoost_Android";
		public static String APPSIGNATURE = "AppSignature";
		public static String APPID = "AppId";
		public static String APPSIGNATURE_ANDROID = "AppSignature_Android";
		public static String APPID_ANDROID = "AppId_Android";
	}
	
	public class TapjoyBoost
	{
		public static String nodeName = "TapjoyBoost";
	
		public static String APPID = "AppID";
		public static String SECRETKEY = "SecretKey";
		
	}
	
	public class NanigansBoost
	{
		public static String nodeName = "NanigansBoost";
	
		public static String APPID = "AppID";
	}
	public class NewRelic
	{
		public static String nodeName = "NewRelic";

		public static String ID = "ID";
	}
	public class Facebook
	{
		public static String AppID = "appid";
	}

    public class ADX
    {
        public const string NodeName = "ADX";
        public const string ClientId = "ClientId";
    }
			
	public static void ShowInputBoxAt(float x,float y,float width,float height,int inputGuid)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
			if (Application.platform == RuntimePlatform.IPhonePlayer)
				_ShowInputBoxAtx(x,y,width,height,inputGuid);
			else
			#endif
		#endif
			Debug.Log("Cant't show inputbox  In this platform");
		Debug.Log("ShowInputBoxAt");
	}
	public static void ChangeInputBoxAt(float x,float y,float width,float height)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
			if (Application.platform == RuntimePlatform.IPhonePlayer)
				_ChangeInputBoxAtx(x,y,width,height);
			else
			#endif
		#endif
			Debug.Log("Cant't change inputbox  In this platform");
		Debug.Log("ChangeInputBoxAt");
	}
	
	public static void SetInputBoxMaxChars(int maxChars)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
			if (Application.platform == RuntimePlatform.IPhonePlayer)
				_SetInputBoxMaxChars(maxChars);
			else
			#endif
		#endif
			Debug.Log("Cant't set inputbox max chars In this platform");
		Debug.Log("SetInputBoxMaxChars");
	}
	
	public static void HideInputBox()
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
			if (Application.platform == RuntimePlatform.IPhonePlayer)
				_HideInputBox();			
			else
			#endif
		#endif
			Debug.Log("Cant't hide inputbox  In this platform");
		Debug.Log("HideInputBox");
	}
	
	public static string GetInputBoxText()
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
			if (Application.platform == RuntimePlatform.IPhonePlayer)
				return _GetInputBoxText();
			else
			#endif
		#endif
			return string.Empty;
	}
	
	public static string GetAllOpenFile()
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
			if (Application.platform == RuntimePlatform.IPhonePlayer)
				return _GetAllOpenFile();
			else
			#endif
		#endif
			return string.Empty;
	}
	
	public static void SetInputBoxText(string txt)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
			if (Application.platform == RuntimePlatform.IPhonePlayer)
				_SetInputBoxText(txt);
			else
			#endif
		#endif
			Debug.Log("Cant't get inputbox txt  In this platform");
		Debug.Log("SetInputBoxText");
	}
	
    /// <summary>
    /// Buies the app product.
    /// </summary>
    /// <param name="productId">Product identifier.</param>
    /// <param name="userName">A one-way hash needed by iOS7+ for irregular activity tracking.</param>
	public static void BuyAppProduct(string productId, string userName)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_BuyAppProduct(productId, userName);
			#endif
			#if  UNITY_ANDROID
				android.BuyAppProduct(productId);
				Debug.Log("productId=" + productId);
			#endif	
		#endif	

	}

	public static void BuyOfferProduct(string productId, string userName, int offerId)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_BuyAppOfferProduct(productId, userName, offerId);
			#endif
			#if  UNITY_ANDROID
				android.BuyAppProduct(productId);
				Debug.Log("productId=" + productId);
			#endif	
		#endif	
	}

	public static bool IsSupportV3()
	{
		if(Application.platform == RuntimePlatform.Android)
		{
			return android.IsSupportedV3();
		}
		return false;
	}
	
	//_ChartboostShowInterstitial
	public	static	void ChartboostShowInterstitial(Hashtable hash)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				//_ChartboostShowInterstitial(hash[ChartBoost.APPSIGNATURE] as string, hash[ChartBoost.APPID] as string);
			#endif
			#if  UNITY_ANDROID
				//android.ChartboostShow();
			#endif	
		#endif	
		Debug.Log("Chartboost");
	}
		
	public static void GetPurchase()
	{
		if(Application.platform == RuntimePlatform.Android)
		{
			android.GetPurchase();
		}
	}
	
	public static bool IsOtherMusicPlaying() 
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
		    	return false;
			#endif
		#endif
	    return false;
	}
	
	public static void SetProductPackages(string jsonStr)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_SetProductPakages(jsonStr);
			#endif
			#if  UNITY_ANDROID
				android.SetProductPackages(jsonStr);
			#endif
		#endif
		Debug.Log("SetProductPackages end");
	}
	public static void Confirm(string notification)
	{
		if(Application.platform == RuntimePlatform.Android)
			android.Confirm(notification);
		Debug.Log("Confirm");
	}
	
	public static void ItunesCheckPackages()
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_ItunesCheckPackages();
			#endif

			#if  UNITY_ANDROID
				android.CheckPackages();
			#endif
		#endif
		Debug.Log("ItunesCheckPackages");
	}
	
	/// Share ..
	public static bool IsShareLogin(int type)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				//return _IsShareLogin(type);
				return false;
			#endif

			#if  UNITY_ANDROID
				return android.IsFacebookLogin();
			#endif
		#endif
		Debug.Log("IsShareLogin");
		return false;	//
	}
	
	public static void LoginShare(int type)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				 	//_LoginShare(type);	
			#endif

			#if  UNITY_ANDROID
				android.LoginFacebook();
			#endif
		#endif
		Debug.Log("LoginShare");
	}
	public static void  SendShareStatus(string status,int type)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				 	//_SendShareStatus(status,type);	
			#endif

			#if  UNITY_ANDROID
				android.SendShareStatus(status,type);
			#endif
		#endif
	}
	
	public static string GetShareLoginName(int type)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				 	//return _GetShareLoginName(type);
					 return null;
			#endif
		#endif
		Debug.Log("GetShareLoginName");
		return null;
	}
	
	public static void LogoutShare(int type)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				//_LogoutShare(type);		
			#endif
			#if  UNITY_ANDROID
				android.LogoutFacebook();
			#endif
		#endif
		Debug.Log("LogoutShare");
	}

	public static void SharePhoto(string path)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
			//_SharePhoto(path);		
			#endif
			#if  UNITY_ANDROID
			android.SharePhoto(path);
			#endif
		#else
			KBN.MenuMgr.instance.sendNotification(Constant.Notice.ShareSendFBPostFailed, "share error on unity Enitor environment");

		#endif
		Debug.Log("LogoutShare");
	}
	
	//device info
//	public static string GetDeviceInfo()
//	{
//		if (Application.platform == RuntimePlatform.IPhonePlayer)
//			 	return _GetDeviceInfo();
//		return "{\"Mac\":\"Editor UNKNOWN\",\"UDID\":\"Editor UNKNOWN\",\"OSName\":\"Mac OS\", \"OSVersion\":\"1.0.0\", \"Manufactor\":\"Apple\",\"Model\":\"13\",\"Language\":\"English\"}";
//	}
	
	public static string GetDeviceInfo()
	{
		Debug.Log("ming GetDeviceInfo");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				 	_GetDeviceInfo();
			#endif

			#if  UNITY_ANDROID
				return android.GetDeviceInformation();
			#endif
		#endif
		return "";
	}

    public static string GetIFAForIOS() {
        #if !UNITY_EDITOR && UNITY_IOS
            return _GetIFA();
        #endif
        return "";
    }

	public static string GetSystemProxyName() {
		#if !UNITY_EDITOR && UNITY_IOS
		return _GetSystemProxyName();
		#endif
		return "";
	}

	public static int GetSystemProxyPort() {
		#if !UNITY_EDITOR && UNITY_IOS
		return _GetSystemProxyPort();
		#endif
		return 0;
	}

	private static Dictionary<string,string> currencyHash = new Dictionary<string, string>();
	public static string GetCurrencySign(String name)
	{
		Debug.Log("ming GetCurrencySign");
		#if	!UNITY_EDITOR
			#if  UNITY_ANDROID
				if(!currencyHash.ContainsKey(name))
					currencyHash[name] = android.GetCurrencySign(name);
				Debug.Log("GetCurrencySign");
				return currencyHash[name];
			#else
				return "";
			#endif
		#endif
		return "";
	}
	
	//payment recover
	public	static	void RecoverPaymentObserver(){
		Debug.Log("ming RecoverPaymentObserver");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				 	_RecoverPaymentObserver();
			#endif
		#endif
		Debug.Log("RecoverPaymentObserver");
	}
	
	public	static	void OpenRaterAlert(string title, string msg, string rateNow, string rateLater, string noRate, string clientVer, string url, string id){
		Debug.Log("ming OpenRaterAlert");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				 	_OpenRaterAlert(title, msg, rateNow, rateLater, noRate, clientVer, url,id);
			#endif
			#if  UNITY_ANDROID
				android.OpenRaterAlert(title,msg,rateNow,rateLater,noRate,clientVer,url);
			#endif
		#endif
		Debug.Log("OpenRaterAlert");
	}

    // Currently only for iOS because Android doesn't have UserVoice yet
    public static void OpenRaterAlertNew(string title, string msg, string rateNow, string rateLater, string userVoice, string clientVer, string url, string id) {
#if !UNITY_EDITOR && UNITY_IOS
        _OpenRaterAlertNew(title, msg, rateNow, rateLater, userVoice, clientVer, url, id);
#endif
    }

	public	static	void OpenUserVoice(int uid, string display_name, int worldId, Hashtable hash)
	{
		// Debug.Log("ming OpenUserVoice");
		// string userDetails = "{\"guid\":" + uid + ",\"display_name\":\"" + display_name + "_" + worldId  +"\"}";
		// string ssoToken = createUserVoiceToken(userDetails, hash);
		// #if	!UNITY_EDITOR
		// 	#if  UNITY_IOS
		// 		_OpenUserVoice(ssoToken, hash[UserVoice.SITE] as string, hash[UserVoice.KEY] as string, hash[UserVoice.SECRET] as string);
		// 	#endif
		// 	#if  UNITY_ANDROID
		// 	android.OpenUserVoice(hash[UserVoice.SITE] as string, hash[UserVoice.KEY] as string, hash[UserVoice.SECRET] as string);
		// 	#endif
		// #endif
		// Debug.Log("OpenUserVoice");
	}
	
	private	static	string createUserVoiceToken(string userDetails, Hashtable uservoiceHash){
		Debug.Log("ming createUserVoiceToken");
		string uservoiceSubdomain = uservoiceHash[UserVoice.SUBDOMAIN] as String;//"battleforthenorth";
		string ssoKey = uservoiceHash[UserVoice.SSOKEY] as String;//"9ea62e19724deb5d2650317c113653f4";
		string initVector = uservoiceHash[UserVoice.VECTOR] as String;//"OpenSSL for Ruby"; // DO NOT CHANGE
		
		Debug.Log("UserVoice arguments:" + uservoiceSubdomain + ", " + ssoKey +", " + initVector);
		
		byte[] initVectorBytes = Encoding.UTF8.GetBytes(initVector);
		byte[] keyBytesLong;
		
		using( SHA1CryptoServiceProvider sha = new SHA1CryptoServiceProvider() ) {
			keyBytesLong = sha.ComputeHash( Encoding.UTF8.GetBytes( ssoKey + uservoiceSubdomain ) );
		}
		byte[] keyBytes = new byte[16];
		Array.Copy(keyBytesLong, keyBytes, 16);
		
		byte[] textBytes = Encoding.UTF8.GetBytes(userDetails);
		for (int i = 0; i < 16; i++) {
			textBytes[i] ^= initVectorBytes[i];
		}
		
		
		// Encrypt the string to an array of bytes
		byte[] encrypted = encryptStringToBytes_AES(textBytes, keyBytes, initVectorBytes);
		string encoded = Convert.ToBase64String(encrypted);
		Debug.Log("createUserVoiceToken");
		return WWW.EscapeURL(encoded);
		
    }

    static byte[] encryptStringToBytes_AES(byte[] textBytes, byte[] Key, byte[] IV) {
		Debug.Log("ming encryptStringToBytes_AES");
		// Declare the stream used to encrypt to an in memory
		// array of bytes and the RijndaelManaged object
		// used to encrypt the data.
		using( MemoryStream msEncrypt = new MemoryStream() )
		using( RijndaelManaged aesAlg = new RijndaelManaged() )
		{
			// Provide the RijndaelManaged object with the specified key and IV.
			aesAlg.Mode = CipherMode.CBC;
			aesAlg.Padding = PaddingMode.PKCS7;
			aesAlg.KeySize = 128;
			aesAlg.BlockSize = 128;
			aesAlg.Key = Key;
			aesAlg.IV = IV;
			// Create an encrytor to perform the stream transform.
			ICryptoTransform encryptor = aesAlg.CreateEncryptor();
			
			// Create the streams used for encryption.
			using( CryptoStream csEncrypt = new CryptoStream( msEncrypt, encryptor, CryptoStreamMode.Write ) ) {
				csEncrypt.Write( textBytes, 0, textBytes.Length );
				csEncrypt.FlushFinalBlock();
			}
			
			byte[] encrypted = msEncrypt.ToArray();
			// Return the encrypted bytes from the memory stream.
			Debug.Log("encryptStringToBytes_AES");
			return encrypted;
      }
	}
	
	public	static	void PermanentCacheFiles(string filePath){
		Debug.Log("ming PermanentCacheFiles");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_PermanentCacheFiles(filePath);
			#endif
		#endif
		Debug.Log("PermanentCachFiles");
	}
	
	public	static	void InitMobileAppTracker(Hashtable hash){
		Debug.Log("ming InitMobileAppTracker");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
					
				//_InitMobileAppTracker(hash[AppTracker.ADVERTISERID] as string, hash[AppTracker.APPKEY] as string, hash[AppTracker.SITEID] as string);
			
			#endif
			#if  UNITY_ANDROID
				android.InitMobileAppTracker(hash[AppTracker.ADVERTISERID] as string, hash[AppTracker.APPKEY] as string, hash[AppTracker.SITEID_ANDROID] as string);
			
			#endif
		#endif
		Debug.Log("InitMobileAppTracker");
	}

	public static void MobileAppTrackerPaymentEvent()
	{
#if UNITY_ANDROID && !UNITY_EDITOR
		android.MobileAppTrackerPaymentEvent();
#endif
	}
	
	public	static	void Chartboost(Hashtable hash){
		Debug.Log("ming Chartboost");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS

				//_Chartboost(hash[ChartBoost.APPSIGNATURE] as string, hash[ChartBoost.APPID] as string);
			
			#endif
			#if  UNITY_ANDROID

				//android.Chartboost(hash[ChartBoost.APPSIGNATURE_ANDROID] as string, hash[ChartBoost.APPID_ANDROID] as string);
			
			#endif
		#endif
		Debug.Log("Chartboost");
	}
	
	public	static	void TrackAction(string action){
		Debug.Log("ming TrackAction");
		Debug.Log("TrackAction");
	}
		

	public static void TrackFTEComplete()
	{
		Debug.Log("ming TrackFTEComplete");
		if(Application.platform == RuntimePlatform.Android)
		{
			android.TrackFTEComplete();
		}
		Debug.Log("TrackFTEComplete");
		
	}

	public static long GetApplicationInitTime(){
		Debug.Log("ming TrackFTEComplete");
		if(Application.platform == RuntimePlatform.Android)
		{
			return android.GetApplicationInitTime();
		}
		return 0;
		Debug.Log("TrackFTEComplete");
	}
	
	public static double GetCents(string product)
	{
		Debug.Log("ming GetCents");
		if(Application.platform == RuntimePlatform.Android)
		{
			return android.GetCents(product);
		}		
		Debug.Log("GetCents");
		return 0.0f;
	}
	public static string GetNames(string product)
	{
		Debug.Log("ming GetNames");
		if(Application.platform == RuntimePlatform.Android)
		{
			return android.GetNames(product);
		}	
		Debug.Log("GetNames");
		return "";
	}
	
	public static void AdwordsTrackPurchase(string sku, string productName, double price)
	{
		Debug.Log("ming AdwordsTrackPurchase");
		if(Application.platform == RuntimePlatform.Android)
		{
			android.AdwordsTrackPurchase( sku,  productName,  price);
		}	
		Debug.Log("AdwordsTrackPurchase");
	}
	
	public static void SetAndroidPackageName(string packageName)
	{
		Debug.Log("ming SetAndroidPackageName");
		if(Application.platform == RuntimePlatform.Android)
		{
			android.SetPackageName(packageName);
		}

		Debug.Log("SetAndroidPackageName");
	}

	public static void TrackNanigansInstall(string id, string AppId)
	{
		Debug.Log("ming TrackNanigansInstall");
		#if	!UNITY_EDITOR
			#if  UNITY_ANDROID
				Debug.Log("native caller TrackNanigansInstall id="+id);
				android.TrackNanigansInstall(id);
			#endif
			#if  UNITY_IOS
				_TrackNanigansEvent(id, "install", "main", AppId);
				Debug.Log("native caller TrackNanigansInstall finished id="+id +"  AppId = "+AppId);
			#endif
		#endif
	}

    public static void TrackNanigansVisit(string id, string AppId)
    {
        #if !UNITY_EDITOR
            #if UNITY_ANDROID
                // TODO: Add Android functionality for this
				android.TrackNanigansVisit(id);
            #elif UNITY_IOS
                _TrackNanigansEvent(id, "visit", "dau", AppId);
            #endif
        #endif
    }
	
	public static bool IsAllow24FPS()
	{
		Debug.Log("ming IsAllow24FPS");
		#if	!UNITY_EDITOR
			#if  UNITY_ANDROID

	//			android.ShowTapJoyOffers();
				return false;
			#endif
			#if  UNITY_IOS
				return _IsAllow24FPS();
			#else
				return false;
			#endif
		#endif
		return false;

	}
	
	public static void UpdateLimitedTracking()
	{
		Debug.Log("ming UpdateLimitedTracking");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_UpdateLimitedTracking();
				Debug.Log("native caller _UpdateLimitedTracking");
			
			#endif
		#endif
	}
	
	public static void ShowTapJoyOffers()
	{
//		Debug.Log("ming ShowTapJoyOffers");
//		#if	!UNITY_EDITOR
//			#if  UNITY_ANDROID
//				android.ShowTapJoyOffers();
//			#endif
//			#if  UNITY_IOS
//				_ShowTapjoyOffers();
//				Debug.Log("native caller ShowTapJoyOffers");
//			#endif
//		#endif
	}
	
	public static void RequestTapjoyConnect(Hashtable hash)
	{
//		Debug.Log("ming RequestTapjoyConnect");
//		#if	!UNITY_EDITOR
//			#if  UNITY_IOS
//
//				_requestTapjoyConnect(hash[TapjoyBoost.APPID] as string, hash[TapjoyBoost.SECRETKEY] as string);
//				Debug.Log("native caller RequestTapjoyConnect");
//			
//			#endif
//		#endif
	}
	
	public static void SetTapJoyTVUID(string tvuid)
	{
//		Debug.Log("ming SetTapJoyTVUID");
//		#if	!UNITY_EDITOR
//			#if  UNITY_ANDROID
//				android.SetTapJoyTVUID(tvuid);
//			#endif
//			#if  UNITY_IOS
//				_SetTapJoyTVUID(tvuid);
//			#endif
//		#endif
	}
	
	public static string GetUniqueId()
	{
		#if	!UNITY_EDITOR
			#if  UNITY_ANDROID
				Debug.Log("ming GetUniqueId : " + android.GetUniqueId());
				return android.GetUniqueId();
			#endif
		#endif
		return "";
	}
	
	public static string GetIMEI()
	{		
		#if	!UNITY_EDITOR
			#if  UNITY_ANDROID
				Debug.Log("ming GetIMEI : " + android.GetIMEI());
				return android.GetIMEI();
			#endif
		#endif
		return "";
	}
	
	public static void ResetAchievements()
	{
		Debug.Log("ming ResetAchievements");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_ResetAchievements();
			#endif
			#if  UNITY_ANDROID
				android.ResetAchievements();
			#endif
		#endif
	}
	
	public static void AuthehticatLocalUser()
	{
		Debug.Log("ming AuthehticatLocalUser");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_AuthehticatLocalUser();
			#endif
			#if  UNITY_ANDROID
				//nothing
				android.AuthehticatLocalUser();
			#endif
		#endif
	}
	
	// android
	
	public static void LogoutGameServices()
	{
		Debug.Log("ming LogoutGameServices");
		if (Application.platform == RuntimePlatform.Android)
			android.LogoutGameServices();
	}
	
	public static void ShowLeaderboard()
	{
		Debug.Log("ming ShowLeaderboard");
		if (Application.platform == RuntimePlatform.Android)
			android.ShowLeaderboard();
		else if(Application.platform == RuntimePlatform.IPhonePlayer)
		{
			
		}
	}
	
	public static bool IsSignInGameServices()
	{
		Debug.Log("ming IsSignInGameServices");
		if (Application.platform == RuntimePlatform.Android)
			return android.IsSignInGameServices();
		return false;
	}
	
	public static void ShowAchievements()
	{
		Debug.Log("ming ShowAchievements");
		if (Application.platform == RuntimePlatform.Android)
			android.ShowAchievements();
	}
	
	public static void UnlockAchievement(string achievementId)
    {
		Debug.Log("ming UnlockAchievement");
		if (Application.platform == RuntimePlatform.Android)
			android.UnlockAchievement(achievementId);
    }
    
    public static void IncrementAchievement(string achievementId, int steps)
    {
		Debug.Log("ming IncrementAchievement");
    	if (Application.platform == RuntimePlatform.Android)
			android.IncrementAchievement(achievementId, steps);
    }
    
    public static void SubmitScore(string leaderboardId, long score)
    {
		Debug.Log("ming SubmitScore");
		if (Application.platform == RuntimePlatform.Android)
			android.SubmitScore(leaderboardId, score);
    } 
	
	public static string GetGoogleAccountName()
	{
		Debug.Log("ming GetGoogleAccountName");
		if (Application.platform == RuntimePlatform.Android)
			return android.GetGoogleAccountName();
		return "";
	}
	
	public static void ResetAchievement(string acheivementId)
	{
		Debug.Log("ming ResetAchievement");
		if (Application.platform == RuntimePlatform.Android)
			android.ResetAchievement(acheivementId);
	}
	
	public static void ResetLeaderboard(string leaderboardId)
	{
		Debug.Log("ming ResetLeaderboard");
		if (Application.platform == RuntimePlatform.Android)
			android.ResetLeaderboard(leaderboardId);
	}
	
	// android
	
	public static void ReportAchievement(string archievementId)
	{
		Debug.Log("ming ReportAchievement");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_ReportAchievement(archievementId);
			#endif
		#endif
	}
	
	
	public static void ReportScore(long score,string category)
	{
		Debug.Log("ming ReportScore");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_ReportScore(category,score);
			#endif
		#endif
	}
	
	public static void ShowGameCenterChallenges()
	{
		Debug.Log("ming ShowGameCenterChallenges");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_ShowGameCenterChallenges();	
			#endif
		#endif
	}
	
	public static void ShowGameCenterLeaderboards()
	{
		Debug.Log("ming ShowGameCenterLeaderboards");
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_ShowGameCenterLeaderboards();
			#endif
		#endif
	}
	public static void StartNewRelic(string id)
	{

		if(Application.platform == RuntimePlatform.IPhonePlayer)
		{
			#if	!UNITY_EDITOR
				#if UNITY_IOS
				_startNewRelic(id);
				#endif
			#endif
		}
		else
		if(Application.platform == RuntimePlatform.Android)
		{
			#if UNITY_ANDROID
			Debug.Log("ming StartNewRelic called");
			android.StartNewRelic();	

			#endif	
		}
			
	}

	public static float GetMemoryUsage()
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
			return MemoryUsage();
			#endif
		#endif
		return 0.0f;
	}

	public static bool IsSMSServiceProvided()
	{
		#if UNITY_ANDROID
		if(Application.platform == RuntimePlatform.Android)
		{
			Debug.Log("ming IsSMSServiceProvided called");
			return android.IsSMSServiceProvided();
		}
		#endif	
		return true;
	}

	public static bool OnBackButtonPressed()
	{
		#if UNITY_ANDROID
		return android.OnBackButtonPressed();
		#endif	

		return false;
	}

	public static float GetMainScreenWidth()
	{
		#if	!UNITY_EDITOR
		#if  UNITY_IOS
		return _GetMainScreenWidth();
		#endif
		#endif
		return 0.0f;
	}

	public static float GetMainScreenHeight()
	{
		#if	!UNITY_EDITOR
		#if  UNITY_IOS
		return _GetMainScreenHeight();
		#endif
		#endif
		return 0.0f;
	}

}
