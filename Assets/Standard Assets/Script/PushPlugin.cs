using UnityEngine;
using System.Collections;
using System.Runtime.InteropServices;

public class PushPlugin
{
	private static PushPlugin g_instance;
	#if	!UNITY_EDITOR
		#if  UNITY_IOS
			#if !UNITY_ANDROID
		[DllImport ("__Internal")]
		private static extern bool _createLocalNotification(string str);		
		
		[DllImport ("__Internal")]
		private static extern void _clearLocalPushNotification();
			#endif
		#endif
	#endif
	private AndroidNativeCaller native = new  AndroidNativeCaller();
	
	private PushPlugin()
	{

	}
	
	public static PushPlugin getInstance()
	{
		if(g_instance == null)
		{
			g_instance = new PushPlugin();	
		}
		
		return g_instance;
	}
	
	public void ClearLocalNotification()
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_clearLocalPushNotification();	
			#endif
		#endif
	}
	
	public void ActivatePushNotification(string _param)
	{
		#if	!UNITY_EDITOR
			#if  UNITY_IOS
				_createLocalNotification(_param);
				Debug.Log("notification _param ios = " + _param);
			#endif

			#if  UNITY_ANDROID
				native.Notify(_param);
				Debug.Log("notification _param android = " + _param);
			#endif
		#endif
	}
}
