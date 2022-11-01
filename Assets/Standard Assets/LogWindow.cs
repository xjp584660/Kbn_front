using UnityEngine;
using System.Collections;
/** 
 *Copyright(C) 2017 by gaea
 *All rights reserved. 
 *FileName:     
 *Author:      csc
 *Version:      1.0.1
 *UnityVersion：5.4.1
 *Date:         
 *Description:    
 *History: 
*/
public class LogWindow : MonoBehaviour {

	public static LogWindow mInstance;
	string message = "";
	bool m_Active = false;
	bool isShink=true;//是否处于缩小状态
	string btnMsg="-";
	private Rect m_WindowRect = new Rect (0, 30, 200, 70);
	public int fontSize=20;


	private Vector2 scrollPosition;
	private int mwidth=620;
	private int mheight=900;
	string filterString="";
	string contentString="---";
	bool isClearOnLoad =true;
	[SerializeField]
	private int scrollHeight=1000;
	// 如果处于缩小状态返回空，否则返回该信息	
	public string GetMessage ()
	{
		if(isShink){
			return "";
		}else return message;
	}

	void Start(){
		LogTools.Instacne.Init();
		if(PlayerPrefs.HasKey("clearLogFlag")){
			isClearOnLoad=PlayerPrefs.GetInt("clearLogFlag")>0?true:false;
		}
		scrollHeight=1000;
	}
	public void SetScrollHeight(int height){
		if(scrollHeight<1000) scrollHeight = 1000;
		 scrollHeight = height;
	}

	public void SetlogContent(string content){
		contentString = content;
	}

	public static LogWindow Instance {
		get { 
			if (mInstance == null) {
				
				mInstance = GameObject.FindObjectOfType (typeof(LogWindow)) as LogWindow;
				if (mInstance == null) {
					GameObject go = new GameObject ("LogWindow");
					DontDestroyOnLoad (go);
					mInstance = go.AddComponent<LogWindow> ();
				}
			}
			return mInstance;
		}

	}


	public bool Active {
		set{ m_Active = value;
			LogTools.Instacne.IsSaveLog = m_Active;
		}
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

		Matrix4x4 backMatrix = GUI.matrix;
		
		KBN._Global.setGUIMatrix();
		m_WindowRect = GUI.Window (2, m_WindowRect, DrawWindowUI, "log window");
		GUI.matrix = backMatrix;
	}


	private void DrawWindowUI (int windowId)
	{

		if (isShink) {
			m_WindowRect.width = 80;
			m_WindowRect.height = 60;
			btnMsg = "+";
		} else {
			m_WindowRect.width = mwidth;
			m_WindowRect.height = mheight;
			btnMsg = "-";
//			message = GUI.TextField (new Rect (30, 30, 100, 30), message);
			DrawScrowView ();
		}

		if (GUI.Button (new Rect (5, 5, 42, 42), btnMsg)) {
			isShink = !isShink;
		}

		GUI.DragWindow ();

	}

	void DrawScrowView(){
		
//		int viewWidth= mwidth<500?500:mwidth;

//		scrollPosition=GUI.BeginScrollView (new Rect (10, 20, mwidth-30, mheight-30), scrollPosition, new Rect (10, 10,viewWidth , scrollHeight),true,true);
		scrollPosition=GUI.BeginScrollView (new Rect (10, 20, mwidth-30, mheight-30), scrollPosition, new Rect (10, 10,1400 , scrollHeight),true,true);

		GUILayout.BeginHorizontal ();
		GUILayout.Height (100);
		GUIStyle fontStyle=new GUIStyle();
		fontStyle.fontSize=fontSize;
		fontStyle.wordWrap=true;
		fontStyle.normal.textColor=Color.white;
		GUI.Label (new Rect (20,15,40,30), "filter");

		filterString =GUI.TextField (new Rect(60,10,100,30),filterString);

		if(GUI.Button(new Rect (170,10,100,30),"search")){
			int num;
			contentString = LogTools.Instacne.getLog (filterString,out num);
			SetScrollHeight (num * 25);
		}

		if(GUI.Button(new Rect (280,10,100,30),"clear")){
			contentString="--";
			LogTools.Instacne.ClearLog ();
		}
		if(GUI.Button(new Rect (340,40,100,30),"send")){
			Debug.LogError ("client log-->"+contentString);
		}

		bool temp = GUI.Toggle(new Rect(390,10, 100, 30),isClearOnLoad,"ClearOnLoad");
		if(temp!=isClearOnLoad){
			isClearOnLoad = temp;
			if(isClearOnLoad){
				PlayerPrefs.SetInt("clearLogFlag",1);
			}else{
				PlayerPrefs.SetInt("clearLogFlag",0);
			}

		}
		GUILayout.EndHorizontal ();


		GUILayout.BeginHorizontal ();
		GUILayout.Height (scrollHeight);
		GUI.Label (new Rect(30,50,1000,scrollHeight), contentString,fontStyle);
		GUILayout.EndHorizontal ();

		GUI.EndScrollView ();
	}
}
