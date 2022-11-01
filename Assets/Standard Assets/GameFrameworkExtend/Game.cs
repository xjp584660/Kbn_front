//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using GameFramework;
using UnityEngine;

namespace KBN
{
	/// <summary>
	/// 游戏框架基础组件。
	/// </summary>
	[AddComponentMenu("Game Framework/Game Framework Base")]
	public class Game : MonoBehaviour
	{
	    private static Game m_Instance = null;
	
	    private Framework m_Framework = null;
	
	    private EventComponent m_EventComponent = null;
		private DownloadComponent m_DownloadComponent = null;
		int mindex=0;
	    private static Game Instance
	    {
	        get
	        {
	            return m_Instance;
	        }
	    }

		public static DownloadComponent Download
		{
			get
			{
				return Instance.m_DownloadComponent;
			}
		}
	
	    /// <summary>
	    /// 获取事件组件。
	    /// </summary>
	    public static EventComponent Event
	    {
	        get
	        {
	            return Instance.m_EventComponent;
	        }
	    }
	
	    private void Awake()
	    {
	        if (m_Instance != null)
	        {
                throw new FrameworkException("Game framework must have one and only one.");
	        }

	        m_Framework = new Framework();
	        m_Framework.Init();
	
	        m_Instance = this;
	        DontDestroyOnLoad(gameObject);
	
	        // Cache components.
			m_DownloadComponent = GetCacheComponent<DownloadComponent>();
	        m_EventComponent = GetCacheComponent<EventComponent>();
	
	        // Init managers.
			m_DownloadComponent.Init(m_Framework.Download);
	        m_EventComponent.Init(m_Framework.Event);
            #if UNITY_ANDROID
			      Screen.sleepTimeout = SleepTimeout.NeverSleep;
            #endif

		}
	
	    private void Update()
	    {
			m_Framework.Update(Time.deltaTime, Time.deltaTime/* Use Time.unscaledDeltaTime after Unity 4.5*/);
			CheckAutoHotKey();
	    }
		private void CheckAutoHotKey(){
//			Vector3[] points=new Vector3[]{new Vector3(2,2,5),new Vector3(2,4,5),new Vector3(2,6,5),new Vector3(2,8,5),
//				new Vector3(2,4,5),new Vector3(2,5,5),new Vector3(2,6,5),new Vector3(2,4,5),
//				new Vector3(8,7,5),new Vector3(2,4,5),new Vector3(2,68,9),new Vector3(12,4,5),
//				new Vector3(2,5,5),new Vector3(2,1,5),new Vector3(2,4,5),new Vector3(2,6,5),
//				new Vector3(2,7,5),new Vector3(2,9,5),new Vector3(2,8,5),new Vector3(2,4,5),
//				new Vector3(8,7,5),new Vector3(2,4,5),new Vector3(2,68,9),new Vector3(12,4,5),
//				new Vector3(2,7,5),new Vector3(2,4,5),new Vector3(2,8,5),new Vector3(2,1,5),
//				new Vector3(2,4,5)}; //test point
			if(Input.GetMouseButtonDown(0)){
				Vector3 pos=Input.mousePosition;
				string menuName="MainUI";
				if(MenuMgr.instance && MenuMgr.instance.GetCurMenu()){
					menuName=MenuMgr.instance.GetCurMenu().menuName;
				}
				ATData data=new ATData(pos,menuName);

//				_Global.Log ("<color=#00ff00>------</color>"+Time.time);
//				if(Time.time>10) {
//					if(mindex<points.Length){
//						data.pos=points[mindex];
//						mindex++;
//					}else mindex=0;
//
//				}
//				Debug.Log("AutoHotKey-->"+CheckAutoHotTools.Instance.GetPoints());
				if (!CheckAutoHotTools.Instance.addDate(data)) {
					//Debug.LogError ("AutoHotKey-->"+CheckAutoHotTools.Instance.GetPoints());
				    KBN.UnityNet.reportErrorToServer( "CLIENT_ERROR", null, null,  "AutoHotKey-->"+CheckAutoHotTools.Instance.GetPoints(), false);
					//Debug.Log("AutoHotKey-->"+CheckAutoHotTools.Instance.GetPoints());

				} else {
				//_Global.Log ("<color=#00ff00>添加success</color>");
				}
			}
		}
	
	    private void InternalShutdown()
	    {
            m_Framework.Shutdown();
            m_Framework = null;
            m_Instance = null;

	    }
	
	    private T GetCacheComponent<T>() where T : Component
	    {
	        T[] components = GetComponents<T>();
	        if (components.Length > 1)
	        {
	            throw new FrameworkException(string.Format("Game framework must have only one {0} type component.", typeof(T).Name));
	        }
	        else if (components.Length == 1)
	        {
	            return components[0];
	        }
	        else
	        {
	            return null;
	        }
	    }
	
	    public static void Shutdown()
	    {
	        Destroy(Instance.gameObject);
            Instance.InternalShutdown();
	    }
	}
}
