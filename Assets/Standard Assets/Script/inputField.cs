using UnityEngine;
using System.Collections;

public class InputField : MonoBehaviour {

	public static InputField mInstance;
	string message = "";
	bool m_Active = false;
	bool isShink=true;//是否处于缩小状态
	string btnMsg="-";
	private Rect m_WindowRect = new Rect (0, 0, 150, 70);

	// 如果处于缩小状态返回空，否则返回该信息	
	public string GetMessage ()
	{
		if(isShink){
			return "";
		}else return message;
	}
	
	public static InputField Instance {
		get { 
			if (mInstance == null) {
				mInstance = GameObject.FindObjectOfType (typeof(InputField)) as InputField;
				if (mInstance == null) {
					GameObject go = new GameObject ("inputField");
					DontDestroyOnLoad (go);
					mInstance = go.AddComponent<InputField> ();
				}
			}
			return mInstance;
		}
		
	}
	
	
	public bool Active {
		set{ m_Active = value; }
		get{ return m_Active; }
	}

//	public bool Shink {
//		get{ 
//			if (!m_Active)
//				return true;
//			return isShink; 
//		}
//	}
	
	void OnGUI ()
	{
		
		if (!m_Active)
			return;
		
		
		m_WindowRect = GUI.Window (2, m_WindowRect, DrawWindowUI, "input field");
	}
	
	
	private void DrawWindowUI (int windowId)
	{
		
		if (isShink) {
			m_WindowRect.width = 40;
			m_WindowRect.height = 30;
			btnMsg = "+";
		} else {
			m_WindowRect.width = 150;
			m_WindowRect.height = 70;
			btnMsg = "-";
			message = GUI.TextField (new Rect (30, 30, 100, 30), message);
		}
		
		if (GUI.Button (new Rect (5, 5, 22, 22), btnMsg)) {
			isShink = !isShink;
		}

		GUI.DragWindow ();
	
	}
}
