using UnityEngine;
using System.Collections;
using System;

public class AndroidNativeCaller 
{
	
	#region Fields
	private string mPluginPackageName = "";
	
	private AndroidJavaObject mActivity = null;
	private AndroidJavaObject mNativeObject = null;
	private AndroidJavaObject mBillingObject = null;
	private AndroidJavaObject m_application = null;

	#endregion

	#region JNI
	
	public void SetPackageName(string packageName)
	{
		mPluginPackageName = packageName;
		Debug.Log("set package name = " + packageName);
	}
	
	private AndroidJavaObject GetActivity()
	{
		if( mActivity == null)
		{
			AndroidJavaClass player = new AndroidJavaClass("com.unity3d.player.UnityPlayer"); 
			mActivity = player.GetStatic<AndroidJavaObject>("currentActivity");
		}
		return mActivity;
	}
	
	private AndroidJavaObject GetNativeObject()
	{
		Debug.Log("mPluginPackageName=" + mPluginPackageName);
		if(mNativeObject == null)
		{
			mNativeObject = new AndroidJavaObject("com.kabam.plugin.AndroidPlugin",new object[]{});
		}
		return mNativeObject;
	}
	
	#endregion

	#region Get Device Information
	
	public string GetDeviceInformation()
	{
		AndroidJavaObject native = GetNativeObject();
		return native.CallStatic<string>("GetDeviceInfo",new object[]{GetActivity()});
	}

	public string GetGCMRegistrationId()
	{
		AndroidJavaObject native = GetNativeObject();
		string registrationId = native.CallStatic<string>("GetGCMRegistrationId", new object[]{});
		Debug.Log("Android GCM token = " + registrationId);
		return registrationId;
	}
	
	#endregion
	
	#region Share

//	public void SendFacebookPost(string urlLink, string imageUrl, string title, string description, string action)
//	{
//		AndroidJavaObject native = GetNativeObject();
//		native.CallStatic("SendFacebookPost", new object[]{description,GetActivity()});
//	}


	private void SendMail(string subject,string message)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("SendMail", new object[]{subject,message,GetActivity()});
	}
	
	private void SendMessage(string message)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("SendMessage", new object[]{message,GetActivity()});
	}
	public void LoginFacebook()
	{
		AndroidJavaObject native = GetNativeObject();
		native.Call("LoginFacebook", new object[]{});
	}
	public void LogoutFacebook()
	{
		AndroidJavaObject native = GetNativeObject();
		native.Call("LoginoutFacebook", new object[]{});
	}

	public void SharePhoto(string imgPath)
	{
		AndroidJavaObject native = GetNativeObject();
		native.Call("SharePhoto", new object[]{imgPath});
	}
	public bool IsFacebookLogin()
	{
		AndroidJavaObject native = GetNativeObject();
		Debug.Log("koc IsFacebookLogin=" + native.Call<bool>("IsLoginFacebook", new object[]{}).ToString());
		return native.Call<bool>("IsLoginFacebook", new object[]{});		
	}
	private void SendFacebookMessage(string message)
	{
		AndroidJavaObject native = GetNativeObject();
		native.Call("SendFacebookMessage", new object[]{message});
	}
	public void OpenUserVoice (string site, string key, string secret)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("OpenUserVoice", new object[]{site,key,secret});
	}
	public void SendShareStatus(string message, int type)
	{
		switch(type)
		{
		case ShareType.ShareFaceBook:
			if(message == "")
				message = "Please install AE.";
			SendFacebookMessage(message);
			break;
		case ShareType.ShareMail:
			SendMail("",message);
			break;
		case ShareType.ShareMessage:
			SendMessage(message);
			break;
		default:
			Debug.Log("Do not support share type.");
			break;
		}
	}
	
	public class ShareType
	{
		public const int ShareFaceBook = 2;
		public const int ShareMail = 3;
		public const int ShareMessage = 4;
	}

	
	#endregion

	#region Rater

	public void OpenRaterAlert(string title, string msg,string rateNow, string rateLater, string noRate, string clientVer, string url)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("showRateDialog", new object[]{GetActivity(),title,msg,rateNow,rateLater,noRate,clientVer,url});
		
	}
	
	#endregion
	
	#region Payment
	public AndroidJavaObject GetBillingObject()
	{
		if(mBillingObject == null)
		{
			AndroidJavaClass billingClass = new AndroidJavaClass("com.kabam.billing.BillingInApp");
			mBillingObject = billingClass.CallStatic<AndroidJavaObject>("Instance",new object[]{});
			//mBillingObject = new AndroidJavaObject("com.kabam.kbn.billing.BillingInApp",new object[]{GetActivity()}); 
		}
		return mBillingObject;
	}
	//获取application 启动时间
	public AndroidJavaObject GetApplicationObject()
	{
		if(m_application == null)
		{
			try{
				AndroidJavaClass billingClass = new AndroidJavaClass("com.kabam.kocmobile.KBNApplication");
				if(billingClass!=null){
					m_application = billingClass.CallStatic<AndroidJavaObject>("getInstance",new object[]{});
				}	
			}
			catch (Exception ex)
			{
				m_application=null;
			} 
		}
		return m_application;
	}
	public long GetApplicationInitTime()
	{
		AndroidJavaObject applia = GetApplicationObject();
		if(applia!=null){
			string applicationInitTime = applia.Call<string>("getInitTime",new object[]{});
			Debug.Log("启动时间application="+applicationInitTime);	
			return KBN._Global.INT64(applicationInitTime);
		}else{
			return 0;
		}
		
	}
	//end
	
	public void BuyAppProduct(string productId)
	{
		try
		{
			Debug.Log("product id is" + productId);
			AndroidJavaObject native = GetBillingObject();
			native.Call<bool>("BuyProduct",new object[]{productId});
			Debug.Log("BuyAppProduct is successful");
		}
		catch(Exception e)
		{
			Debug.Log(e.Message);
		}

	}
	public bool IsSupported()
	{
		AndroidJavaObject native = GetBillingObject();
		return native.Call<bool>("IsSupported",new object[]{});
	}
	public bool IsSupportedV3()
	{
		AndroidJavaObject native = GetBillingObject();
		return native.Call<bool>("IsSupportV3",new object[]{});
	}	
	public void Confirm(string notificationID)
	{
		AndroidJavaObject native = GetBillingObject();
		native.Call("Confirm",new object[]{notificationID});
	}
	

	public void GetPurchase()
	{
		AndroidJavaObject native = GetBillingObject();
		native.Call("GetPurchase",new object[]{});		
	}
	
	public void CheckPackages() //jinshouhui
	{
		Debug.Log("CheckPackages begins");
		AndroidJavaObject native = GetBillingObject();
		native.Call("CheckPackages",new object[]{});
		Debug.Log("CheckPackages ends");
	}
	

	public void SetProductPackages(string json)
	{
		Debug.Log("SetProductPackages begins");
		AndroidJavaObject native = GetBillingObject();
		native.Call("SetProductPackages",new object[]{json});
		Debug.Log("SetProductPackages ends");
	}
	
	public string GetCurrencySign(string name)
	{
		AndroidJavaObject native = GetNativeObject();
		Debug.Log("GetCurrencySign");
		string sign = native.CallStatic<string>("GetCurrencySign",new object[]{name});	
		Debug.Log("sign = " + sign);
		return sign;
	}
	
	#endregion
	
	#region InputBox
	
	public void ShowInputBoxAt(float x,float y,float width,float height,int inputGuid)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("ShowInputBoxAtx",new object[]{GetActivity(),x,y,width,height,inputGuid});
	}
	public void ChangeInputBoxAt(float x,float y,float width,float height)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("ChangeInputBoxAt",new object[]{GetActivity(),x,y,width,height});
		
	}
	public void HideInputBox()
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("HideInputBox",new object[]{GetActivity()});
	}
	
	public string GetInputBoxText()
	{
		AndroidJavaObject native = GetNativeObject();
		return native.CallStatic<string>("GetInputBoxText",new object[]{GetActivity()});
	}
	public void SetInputBoxText(string txt)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("SetInputBoxText",new object[]{GetActivity(),txt});
	}
	#endregion
	
	#region   AD
	
	public void Chartboost(string signature, string appID)
	{
//		AndroidJavaObject native = GetNativeObject();
//		native.CallStatic("Chartboost",new object[]{signature,appID,GetActivity()});
	}
	
	public void InitMobileAppTracker(string signature, string appID, string siteId)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("InitMobileAppTracker",new object[]{signature,appID,siteId,GetActivity()});
	}

	public void MobileAppTrackerPaymentEvent()
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("MobileAppTrackerPaymentEvent", new object[] {});
	}
	

	public void TrackFTEComplete()
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("TrackFTEComplete",new object[]{});		
	}
	
	public double GetCents(string product)
	{
		AndroidJavaObject native = GetNativeObject();
		return native.CallStatic<double>("GetCents",new object[]{product});		
	}
	public string GetNames(string product)
	{
		AndroidJavaObject native = GetNativeObject();
		return native.CallStatic<string>("GetNames",new object[]{product});		
	}
	
	public void AdwordsTrackPurchase(string sku, string productName, double price)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("AdwordsTrackPurchase",new object[]{sku,productName,price});
	}
	
	public void TrackNanigansInstall(string id)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("TrackNanigansInstall",new object[]{id,GetActivity()});
		Debug.Log("android native caller TrackNanigansInstall id = "+id);
	}
	public void TrackNanigansVisit(string id)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("TrackNanigansVisit",new object[]{id,GetActivity()});
		Debug.Log("android native caller TrackNanigansVisit id = "+id);
	}
	
	public void ShowTapJoyOffers()
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("ShowTapJoyOffers",new object[]{});				
	}	
	
	public void SetTapJoyTVUID(string tvuid)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("SetTapJoyTVUID",new object[]{tvuid});				
		
	}
	
	public void AuthehticatLocalUser()
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("LoginGameServices",new object[]{});
	}
	
	public void LogoutGameServices()
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("LogoutGameServices",new object[]{});
	}
	
	public void ShowLeaderboard()
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("ShowLeaderboard",new object[]{});
	}
	
	public bool IsSignInGameServices()
	{
		AndroidJavaObject native = GetNativeObject();
		return native.CallStatic<bool>("IsSignInGameServices",new object[]{});
	}
	
	public void ShowAchievements()
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("ShowAchievements",new object[]{});
	}
	
	public void UnlockAchievement(string achievementId)
    {
		Debug.Log("=========Enter UnlockAchievement : " + achievementId);
		AndroidJavaObject native = GetNativeObject();
		if (native == null)
		{
			Debug.Log("android native is null ! ");
		}
		native.CallStatic("UnlockAchievement",new object[]{achievementId});
    }
    
    public void IncrementAchievement(string achievementId, int steps)
    {
    	AndroidJavaObject native = GetNativeObject();
		native.CallStatic("IncrementAchievement",new object[]{achievementId, steps});
    }
    
    public void SubmitScore(string leaderboardId, long score)
    {
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("SubmitScore",new object[]{leaderboardId, score});
    } 
	
	public string GetGoogleAccountName()
	{
		AndroidJavaObject native = GetNativeObject();
		return native.CallStatic<string>("GetAccountName",new object[]{});
	}

	
 	public void ChartboostShow()
	{
//		AndroidJavaObject native = GetNativeObject();
//		native.CallStatic("ChartboostShow",new object[]{GetActivity()});
	}
	
	public void ResetAchievements()
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("ResetAchievements",new object[]{});
	}
	
	public void ResetAchievement(string acheivementId)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("ResetAchievement",new object[]{acheivementId});
	}
	
	public void ResetLeaderboard(string leaderboardId)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("ResetLeaderboard",new object[]{leaderboardId});
	}

	public void StartNewRelic()
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("StartNewRelic",new object[]{});
	}
	#endregion
	#region OtherLevels

	public void LinkOtherLevelsTrackingId(string id)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("LinkOtherLevelsTrackingId",new object[]{id});
		Debug.Log ("ming LinkOtherLevelsTrackingId 0");
	}
	public void UnLinkOtherLevelsTrackingId(string id)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("UnlinkOtherLevelsTrackingId",new object[]{id});
		Debug.Log ("ming UnLinkOtherLevelsTrackingId 0");
	}
	public void ResetOtherLevelsAppKey(string appKey, string channelKey, string authKey,string userInfoKey)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("ResetOtherLevelsAppKey",new object[]{appKey,channelKey,authKey,userInfoKey});
		Debug.Log ("ming ResetOtherLevelsAppKey 0");
	}

	#endregion
	#region   Notification
	
	public void Notify(string content)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("PushNotification",new object[]{content,GetActivity()});
	}
	
	#endregion
	
	#region Phone
	
	public string GetUniqueId()
	{
		AndroidJavaObject native = GetNativeObject();
		return native.CallStatic<string>("GetUDID",new object[]{});		
	}
	
	public string GetIMEI()
	{
		AndroidJavaObject native = GetNativeObject();
		return native.CallStatic<string>("GetIMEI",new object[]{});				
	}

	public bool IsSMSServiceProvided()
	{
		AndroidJavaObject native = GetNativeObject();
		return native.CallStatic<bool>("IsSMSServiceProvided",new object[]{});
	}
	
	#endregion
	public bool OnBackButtonPressed()
	{
		AndroidJavaObject native = GetNativeObject();
		return native.CallStatic<bool>("OnBackButtonPressed",new object[]{});		
	}

	#region GATA
	
	public void GaeaLogin(string gaeaId, string loginType)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("GaeaLogin",new object[]{gaeaId, loginType});
	}
	
	public void RoleCreate(string accountId, string serverId)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("RoleCreate",new object[]{accountId, serverId});
	}
	
	public void RoleLogin(string accountId, string serverId, int levelId)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("RoleLogin",new object[]{accountId, serverId, levelId});
	}
	
	public void RoleLogout(string accountId)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("RoleLogout",new object[]{accountId});
	}
	
	public void SetRoleLevel(int level, string accountId)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("SetRoleLevel",new object[]{accountId, level});
	}
	
	public void RechargeFinished(string transactionId, string currencyAmount, string currencyType, string payChannel, string goodId, int status)
	{
		AndroidJavaObject native = GetNativeObject();
		native.CallStatic("OnRecharge",new object[]{transactionId, goodId, currencyAmount, currencyType, payChannel, status});
	}
	
	#endregion

}
