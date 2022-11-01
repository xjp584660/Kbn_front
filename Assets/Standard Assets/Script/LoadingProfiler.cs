using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class LoadingProfiler : MonoBehaviour
{
	public class LoadingTimer
	{
		private bool m_ActiveFlag = false;
		private float m_ActiveTime = 0f;
		private float m_TotalTime = 0f;

		public void Reset()
		{
			m_ActiveTime = m_ActiveFlag ? Time.realtimeSinceStartup : 0f;
			m_TotalTime = 0f;
		}

		public bool Active
		{
			get
			{
				return m_ActiveFlag;
			}

			set
			{
				if (m_ActiveFlag != value)
				{
					m_ActiveFlag = value;
					if (value)
					{
						m_ActiveTime = Time.realtimeSinceStartup;
					}
					else
					{
						m_TotalTime += Time.realtimeSinceStartup - m_ActiveTime;
						m_ActiveTime = 0f;
					}
				}
			}
		}

		public float TotalTime
		{
			get
			{
				return m_ActiveFlag ? (m_TotalTime + Time.realtimeSinceStartup - m_ActiveTime) : m_TotalTime;
			}
		}
	}

	private static LoadingProfiler m_Instance = null;
	private IDictionary<string, LoadingTimer> m_LoadingTimerList = new Dictionary<string, LoadingTimer>();
	[SerializeField]
	private bool m_Active = false;
	private Rect m_WindowRect = new Rect(0, 0, 480, 240);

	public static LoadingProfiler Instance
	{
		get
		{
			if (m_Instance == null)
			{
				m_Instance = GameObject.FindObjectOfType(typeof(LoadingProfiler)) as LoadingProfiler;
				if (m_Instance == null)
				{
					GameObject go = new GameObject("LoadingProfiler");
					DontDestroyOnLoad(go);
					m_Instance = go.AddComponent(typeof(LoadingProfiler)) as LoadingProfiler;
				}
			}
			
			return m_Instance;
		}
	}

	public void StartTimer(string name)
	{
		LoadingTimer timer = null;
		if (!m_LoadingTimerList.TryGetValue(name, out timer))
		{
			timer = new LoadingTimer();
			m_LoadingTimerList.Add(name, timer);
		}

		timer.Active = true;
	}

	public void EndTimer(string name)
	{
		LoadingTimer timer = null;
		if (!m_LoadingTimerList.TryGetValue(name, out timer))
		{
			return;
		}
		
		timer.Active = false;
	}

	private void Awake()
	{
		m_Instance = this;
	}

	private void Start()
	{
	
	}
	
	private void Update()
	{
	
	}

	private void OnGUI()
	{
		if (!m_Active)
		{
			return;
		}

		m_WindowRect.height = 100 + 20 * m_LoadingTimerList.Count;
		m_WindowRect = GUI.Window(0, m_WindowRect, DrawProfileWindow, "Profile Window");
	}

	private void DrawProfileWindow(int windowId)
	{
		GUI.DragWindow(m_WindowRect);
		if (GUI.Button(new Rect(5, 5, 22, 22), "x"))
		{
			m_Active = false;
		}

		GUI.Label(new Rect(10, 30, 460, 20), string.Format("Game Run Time: {0:F2} s", Time.realtimeSinceStartup));
		GUI.Label(new Rect(10, 50, 460, 20), string.Format("Level Time: {0:F2} s", Time.timeSinceLevelLoad));
		int i = 0;
		foreach (KeyValuePair<string, LoadingTimer> timer in m_LoadingTimerList)
		{
			GUI.Label(new Rect(10, 80 + 20 * i++, 460, 20), string.Format("{0}: [{1}] {2:F2} s", timer.Key, timer.Value.Active ? "Active" : "Inactive", timer.Value.TotalTime));
		}
	}

	public bool Active
	{
		get
		{
			return m_Active;
		}

		set
		{
			m_Active = value;
		}
	}
}
