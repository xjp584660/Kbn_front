using UnityEngine;
using System.Collections;



public class KChatBehaviour : MonoBehaviour
{
	public static string BehaviourName = "KChatBehaviour";
	
	private static KChatBehaviour _instance;
	
	public static KChatBehaviour getInstance()
	{
		if(_instance == null)
		{
			GameObject obj = new GameObject(BehaviourName);
			_instance = obj.AddComponent<KChatBehaviour>();
		}
		return _instance;
	}
	
	void Awake()
	{
		DontDestroyOnLoad(this.transform.gameObject);
	}
	
	protected IActionHandler _handler;
	public void setAcitionHandler(IActionHandler handler)
	{
		this._handler = handler;

	}
	
	
	public void javaCallBack(string content)
	{
		int idx1= content.IndexOf(":");
		int id = int.Parse(content.Substring(0,idx1));
		string str = content.Substring(idx1+1);	// means inputtext commonly.
		//same as KChatBar.java line 33.
		Debug.Log("ming android javaCallBack str"+str);
		Debug.Log("ming android javaCallBack id"+id);
		switch(id)
		{
		case 4:
			this.callHandler(KChatBarMgr.AC_IME_SEND,str,null);	
			break;
		case 1:
			this.callHandler(KChatBarMgr.AC_SEND,str,null);
			break;
		case 2:
			this.callHandler(KChatBarMgr.AC_IME_BACKPRESS,str,null);
			break;
		case 3:
			this.callHandler(KChatBarMgr.AC_CHATBAR_BACKPRESS,str,null);
			break;
		case 5:
			this.callHandler(KChatBarMgr.AC_PLUS_BTN_CLICK,str,null);		// str: button tag.
			break;
		case 6:
			int h = 0;
			int.TryParse(str,out h);
			this.callHandler(KChatBarMgr.AC_POS_CHANGED,h,null);	// h means the distance beteen the top of screen and the top of chatbar. you'd calculate it to uniyt GUI heigh in your game.
			break;
		case 7:
			this.callHandler(KChatBarMgr.AC_KEYBOARD_SHOWED,null,null);
			break;
		case 8:
			this.callHandler(KChatBarMgr.AC_KEYBOARD_HIDDEN,null,null);
			break;
		case 9:
			this.callHandler(KChatBarMgr.AC_ON_RESUME,null,null);
			break;
		}
		
	}
	
	protected void callHandler(string type,object data,object sender = null)
	{
		if(_handler != null)
		{
			_handler.handleAction(type,data,sender);
		}
	}
}

