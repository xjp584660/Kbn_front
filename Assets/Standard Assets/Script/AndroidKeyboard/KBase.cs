using UnityEngine;
using System.Collections;
using System;

public  class KBaseMgr
{
	
	protected string javaClassName = "__class_name__";
	protected string behaviourName = "__behaviour__";
	
	/*******************DO NOT MODIFY IT ***************************/
	protected const string CALL_BACK_FUNC 	= "javaCallBack";
	protected const string SET_UNITY_PARAMS = "setUnityParams";
	protected const string CALL_ACTION 		= "callAction";
	protected const string GET_INSTANCE		= "getInstance";
	/*************************************************************/

	protected IActionHandler _handler;
	protected KBaseBehaviour _behaviour;
	
	public static T createInstance<T> (string  BehaviourName) where T:MonoBehaviour
	{
		GameObject obj = new GameObject(BehaviourName);
		return obj.AddComponent<T>();
	}

	protected KBaseMgr(string java_class_class,string behaviour_name)
	{
		this.javaClassName = java_class_class;
		this.behaviourName = behaviour_name;

		this.createBehaviour(behaviourName);
		this.setJavaCallBackParams(behaviourName,CALL_BACK_FUNC);
		_behaviour._mgr = this;
	}
	
	public void setAcitionHandler(IActionHandler handler)
	{
		this._handler = handler;
		
	}
	
	public void setJavaCallBackParams(string unityObj,string unityFunc)
	{
#if UNITY_ANDROID	
		callAndroid(SET_UNITY_PARAMS,unityObj,unityFunc);
#endif
	}
	
	protected void callAndroidAction(int action,params object[] args)
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
			getJavaObject().Call(CALL_ACTION,action,list);	
		}
#endif

	}
#if UNITY_ANDROID	
	protected void callAndroid(string method, params object[] args)
	{
		if(Application.platform == RuntimePlatform.Android)
		{
			Debug.Log("call Android:" + method  + "params:" +  args.ToString());
			this.getJavaObject().Call(method,args);
		}
	}
	protected T callAndroid<T>(string method, params object[] args)
	{
		if(Application.platform == RuntimePlatform.Android)
		{
			Debug.Log("call Android:" + method  + "params:" +  args.ToString());
			return this.getJavaObject().Call<T>(method,args);
		}
		return default(T);
	}
	protected  AndroidJavaObject getJavaObject()
	{
		AndroidJavaClass jc = new AndroidJavaClass(this.javaClassName);
		return jc.CallStatic<AndroidJavaObject>(GET_INSTANCE);
		
	}
#endif
	virtual protected void createBehaviour(string name)
	{
		_behaviour = createInstance<KBaseBehaviour>(name);
		
	}
	virtual protected void behaviourCreated()
	{

	}
	
	//virtual 
	virtual public void javaCallBack(string str)
	{
	}
	virtual public void javaCallBack(int type,string content)
	{
	}
}


public class KBaseBehaviour : MonoBehaviour
{
	public KBaseMgr _mgr;

	void Awake()
	{
		DontDestroyOnLoad(this.transform.gameObject);
	}
	
	public void javaCallBack(string content)
	{
		Debug.Log("Java CallBack Content:" + content);
		try
		{
			if(_mgr != null)
			{
				int idx1= content.IndexOf(":");
				if(idx1 > 0)
				{
					int id = int.Parse(content.Substring(0,idx1));
					string str = content.Substring(idx1+1);	
					_mgr.javaCallBack(id,str);
				}
				else
				{
					_mgr.javaCallBack(content);
				}
			}
		}
		catch(Exception e)
		{
			Debug.Log("javaCallBack:" + e.StackTrace);
		}
	}
}

public interface  IActionHandler
{
	void handleAction(string type,object data,object sender);
}
