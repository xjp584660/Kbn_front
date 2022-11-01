using UnityEngine;
using System.Collections;

public class AndroidKeyboard  : IActionHandler
{
	private static AndroidKeyboard sInstance = new AndroidKeyboard();
	
	private object mListener = null;


	private AndroidKeyboard()
	{
		if(RuntimePlatform.Android != Application.platform) return;
	}
	
	public static AndroidKeyboard Instance()
	{
		return sInstance;
	}
	
	public void Initialize(object listener)
	{
		if(RuntimePlatform.Android != Application.platform) return;
		KChatBarMgr.setAcitionHandler(this);
		mListener = listener;
	}
	
	public void handleAction(string type,object data,object sender)
	{
		if(RuntimePlatform.Android != Application.platform) return;
		if(mListener == null) return;
		
		System.Type t = mListener.GetType();
		System.Reflection.MethodInfo method = t.GetMethod("handleAndroid");
		
		if(method == null) return;
		Debug.Log("ming handle anction type=" + type);
		if(type == KChatBarMgr.AC_IME_SEND)
			method.Invoke(mListener,new object[]{"send",data});
		else if(type == KChatBarMgr.AC_SEND)
			method.Invoke(mListener,new object[]{"send",data});
		else if(type == KChatBarMgr.AC_POS_CHANGED)
			method.Invoke(mListener,new object[]{"position",data});
		else if(type == KChatBarMgr.AC_KEYBOARD_SHOWED)
			method.Invoke(mListener,new object[]{"show",data});
		else if(type == KChatBarMgr.AC_KEYBOARD_HIDDEN)
			method.Invoke(mListener,new object[]{"hide",data});
		else if(type == KChatBarMgr.AC_ON_RESUME)
			method.Invoke(mListener,new object[]{"resume",""});
		else if(type == KChatBarMgr.AC_CHATBAR_BACKPRESS)
			method.Invoke(mListener,new object[]{"backpress",""});
		else if(type == KChatBarMgr.AC_PLUS_BTN_CLICK)
			method.Invoke(mListener,new object[]{"plusclicked",""});
	}
	
	public string GetText()
	{
		if(RuntimePlatform.Android != Application.platform) return "";
		return KChatBarMgr.getInputText();
	}
	
	public void SetText(string text)
	{
		if(RuntimePlatform.Android != Application.platform) return;
		KChatBarMgr.SetText(text);
	}
	
	public void ShowChatBar(bool showKeyboard)
	{
		if(RuntimePlatform.Android != Application.platform) return;
		KChatBarMgr.showChatBar(false);
	}
	
	public void ShowPlus(bool showPlus)
	{
		if(RuntimePlatform.Android != Application.platform) return;
		int t = 0;
		if(!showPlus)	t = 8;		
		KChatBarMgr.setPlusButtonVisibility("kTagButtonPlus",t);
	}
	
	public void CloseChatBar()
	{
		if(RuntimePlatform.Android != Application.platform) return;
		KChatBarMgr.closeChatBar();
	}
	
	public void SetMaxChars(int num)
	{
		if(RuntimePlatform.Android != Application.platform) return;
		KChatBarMgr.SetMaxChars(num);
	}
	
	public void SetSendButtonText(string text)
	{
		if(RuntimePlatform.Android != Application.platform) return;
		KChatBarMgr.setSendButtonText(text);
	}
	
	public void SetHint(string hint)
	{
		if(RuntimePlatform.Android != Application.platform) return;
		KChatBarMgr.SetHint(hint);
	}
	
	public void ShowKeyboard(bool willShow)
	{
		KChatBarMgr.showChatInputKeyBoard(willShow);
	}
}
