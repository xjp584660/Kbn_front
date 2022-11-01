using UnityEngine;
using System.Collections;
/**

	it'll not open the keyboard when you open the chatbar,you'd click the edittext to openit.

	1:you'll receive (javacallback) AC_POS_CHANGED action,set the unity scrollist to the proper position when you show the chatbar.
	2:you'll receive AC_KEYBOARD_SHOWED action while you click the input edittext; then you'd start tweener in unity to modify the scrollist.
		3:you may receive AC_POS_CHANGED action again with some devices,
	4:you'll receive AC_KEYBOARD_HIDDEN action while you press back to hidden keyboard(there's some problem while you click the button on keyboard to hidden the keyboard)
		5:you may receive AC_POS_CHANGED action again with some devices(if you received at step 3)
	6:
	
	ADVICE: when your receive AC_POS_CHANGED, stop other tweenr and set the scroolist to the current position by force.
	



 **/
public class KChatBarMgr
{
	const int OPEN_CHATBAR 	= 1;
	const int CLOSE_CHATBAR = 2;
	const int SHOW_KEYBOARD = 3;
	const int SET_MAXCHAR 	= 4;
	const int SET_TEXT		= 5;
	const int SET_BTN_TEXT	= 6;
	const int SET_SIZE		= 7;
	const int SET_PLUS_BTN_TEXT = 8;
	const int SET_PLUS_BTN_VISIBILITY = 9;
	const int SET_HINT = 10;

	public const string AC_IME_SEND = "kchat_ac_ime_send";
	public const string AC_SEND = "kchat_ac_send";
	public const string AC_IME_BACKPRESS = "kchat_ac_ime_backpress";
	public const string AC_KEYBOARD_SHOWED = "kchat_ac_keyboard_showed";
	public const string AC_KEYBOARD_HIDDEN = "kchat_ac_keyboard_hidden";
	public const string AC_CHATBAR_BACKPRESS = "kcaht_ac_chatbar_backpress";
	public const string AC_PLUS_BTN_CLICK = "kchat_ac_plus_btn_click";
	public const string AC_POS_CHANGED = "kchat_ac_pos_changed";
	public const string AC_ON_RESUME = "AC_ON_RESUME";
	
	const string JAVA_CLASS_NAME = "com.kabam.lab.chat.KChatMgr";
	
	public static void setAcitionHandler(IActionHandler handler)
	{
		if(Application.platform == RuntimePlatform.Android)
		{
			KChatBehaviour.getInstance().setAcitionHandler(handler);
			setJavaCallBackParams(KChatBehaviour.BehaviourName,"javaCallBack");
		}
	}
	
	public static void showChatInputKeyBoard(bool b = true)
	{
#if UNITY_ANDROID		
		if(Application.platform == RuntimePlatform.Android || true)
		{
			callAndroidAction(SHOW_KEYBOARD,b);
		}
#endif
	}
	public static void showChatBar(bool showKeyBoard = true)
	{
#if UNITY_ANDROID		
		if(Application.platform == RuntimePlatform.Android)
		{
			callAndroidAction(OPEN_CHATBAR,showKeyBoard);
		}
#endif
	}
	
	public static void closeChatBar()
	{
#if UNITY_ANDROID		
		if(Application.platform == RuntimePlatform.Android)
		{
			callAndroidAction(CLOSE_CHATBAR);
		}
#endif
	}
	
	public static void setSize(int width,int height)
	{
#if UNITY_ANDROID		
		if(Application.platform == RuntimePlatform.Android)
		{
			callAndroidAction(SET_SIZE,width,height);
		}
#endif
	}
	public static void setIMEAutoHideWithSend(bool b = false)
	{
#if UNITY_ANDROID		
		if(Application.platform == RuntimePlatform.Android)
		{
			getJavaObject().Call("setIMEAutoHideWithSend",b);
		}
#endif
	}
	public static void setAutoClearAfterSend(bool b = true)
	{
#if UNITY_ANDROID		
		if(Application.platform == RuntimePlatform.Android)
		{
			getJavaObject().Call("setAutoClear",b);
		}
#endif
	}

	public static void setSendButtonText(string text)
	{
		callAndroidAction(SET_BTN_TEXT,text);
	}

	public static void setPlusButtonTextWithTag(string tag,string text)
	{
		callAndroidAction(SET_PLUS_BTN_TEXT,tag,text);
	}

	/// <summary>
	/// Sets the plus button visibility.
	/// visibility
	/// 	0: This view is visible.
	/// 	4: This view is invisible, but it still takes up space for layout purposes.
	/// 	8: This view is invisible, and it doesn't take any space for layout
	/// 
	public static void setPlusButtonVisibility(string tag,int visibility)
	{
		callAndroidAction(SET_PLUS_BTN_VISIBILITY,tag,visibility);
	}
	public static string getInputText()
	{
		 
#if UNITY_ANDROID		
		if(Application.platform == RuntimePlatform.Android)
		{
			return getJavaObject().Call<string>("getInputText");
		}
#endif
		 
		return "";
	}
	
	public static void setInputText(string text)
	{
#if UNITY_ANDROID
		if(Application.platform == RuntimePlatform.Android)
		{
			getJavaObject().Call<string>("setInputText",text);
		}
#endif
	}
	
	
	protected static void callAndroidAction(int action,params object[] args)
	{		
#if UNITY_ANDROID		
		if(Application.platform == RuntimePlatform.Android)
		{
			string[] list = null;
			if(args != null)
				list = new string[args.Length];
			for(int i = 0; i < args.Length; i++)
			{
				list[i] = args[i].ToString();
			}
			getJavaObject().Call("callAction",action,list);	
		}
#endif

	}
	public static void SetHint(string hint)
	{
#if UNITY_ANDROID
		callAndroidAction(SET_HINT,hint);
#endif
	}
	public static void SetMaxChars(int max)
	{
#if UNITY_ANDROID
		callAndroidAction(SET_MAXCHAR,max);
#endif
	}
	
	public static void SetText(string text)
	{
#if UNITY_ANDROID
		callAndroidAction(SET_TEXT,text);
#endif		
	}
	
	public static void setJavaCallBackParams(string unityObj,string unityFunc)
	{
#if UNITY_ANDROID
		getJavaObject().Call("setUnityParams",unityObj,unityFunc);
#endif
	}
	
	
#if UNITY_ANDROID	
	private static AndroidJavaClass jc = null;
	protected static AndroidJavaObject getJavaObject()
	{
		if(jc == null)
			jc = new AndroidJavaClass(JAVA_CLASS_NAME);
		return jc.CallStatic<AndroidJavaObject>("getInstance");
		
	}

#endif
}
