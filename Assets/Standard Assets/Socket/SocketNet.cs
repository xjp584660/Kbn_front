//// Socket Network Manager v1.0
//// yjiang@kabaminc.com 2014-06-18
//
//using System;
//
//namespace KBN
//{
//	public class SocketNet
//	{
//		private bool m_IsEnable = false;
//		private string m_IpAddress = null;
//		private int m_Port = 0;
//		private float m_HeartBeatInterval = 30f;
//		private int m_HeartBeatCount = 3;
//		private float m_ReconnectInterval = 10f;
//		private int m_ReconnectCount = 3;
//		private int m_CurrentReconnectCount = 0;
//		private bool m_SignUpFlag = false;
//		private bool m_ReconnectFlag = false;
//		private bool m_WaitConnectFlag = false;
//		private DateTime m_WaitConnectTime = DateTime.MinValue;
//		
//		private int m_ServerId = 0;
//		private int m_UserId = 0;
//		private string m_NickName = null;
//		private int m_AllianceId = 0;
//		
//		protected SocketNet()
//		{
//			NetworkManager.Instance.OnNetworkConnected += OnNetworkConnected;
//			NetworkManager.Instance.OnNetworkSendPacket += OnNetworkSendPacket;
//			NetworkManager.Instance.OnNetworkMissHeartBeat += OnNetworkMissHeartBeat;
//			NetworkManager.Instance.OnNetworkError += OnNetworkError;
//			NetworkManager.Instance.OnNetworkSignUp += OnNetworkSignUp;
//			
//			RegisterAllHandlers();
//		}
//
//		public void RegisterNetworkErrorFunc(NetworkErrorHandler _errorFunc)
//		{
//			NetworkManager.Instance.OnNetworkError += _errorFunc;
//		}
//
//		public void RegisterNetworkConnectFunc(NetworkConnectedHandler _connectFunc)
//		{
//			NetworkManager.Instance.OnNetworkConnected += _connectFunc;
//		}
//
//		public void RegisterNetworkSignUpFunc(NetworkSignUpHandler _signUptFunc)
//		{
//			NetworkManager.Instance.OnNetworkSignUp += _signUptFunc;
//		}
//
//		public static SocketNet Instance
//		{
//			get;
//			protected set;
//		}
//        
//        public bool IsEnable
//		{
//			get
//			{
//				return m_IsEnable;
//			}
//		}
//		
//		public string IpAddress
//		{
//			get
//			{
//				return m_IpAddress;
//			}
//			set
//			{
//				m_IpAddress = value;
//			}
//		}
//		
//		public int Port
//		{
//			get
//			{
//				return m_Port;
//			}
//			set
//			{
//				m_Port = value;
//			}
//		}
//
//		public float HeartBeatInterval
//		{
//			get
//			{
//				return m_HeartBeatInterval;
//			}
//			set
//			{
//				m_HeartBeatInterval = value;
//			}
//		}
//
//		public int HeartBeatCount
//		{
//			get
//			{
//				return m_HeartBeatCount;
//			}
//			set
//			{
//				m_HeartBeatCount = value;
//			}
//		}
//
//		public float ReconnectInterval
//		{
//			get
//			{
//				return m_ReconnectInterval;
//			}
//			set
//			{
//				m_ReconnectInterval = value;
//			}
//		}
//		
//		public int ReconnectCount
//		{
//			get
//			{
//				return m_ReconnectCount;
//			}
//			set
//			{
//				m_ReconnectCount = value;
//			}
//		}
//		
//		public virtual void RegisterAllHandlers()
//		{
//			
//		}
//
//		public void SetEnable(bool enable)
//		{
//			m_IsEnable = enable;
//			if (!enable)
//			{
//				Close();
//			}
//		}
//		
//		public void Connect()
//		{
////			ErrorMgr.singleton.PushError("", "Connect", true, Datas.getArString("Common.OK_Button"), null);
//			m_WaitConnectFlag = false;
//			NetworkManager.Instance.Create(8192, 8192);
//			NetworkManager.Instance.HeartBeatInterval = m_HeartBeatInterval;
//			NetworkManager.Instance.Connect(m_IpAddress, m_Port);
//			_Global.Log("SocketNet Connect !!!!!!!!!");
//		}
//		
//		public void Reconnect()
//		{
//			Close();
//
//			m_CurrentReconnectCount++;
//			if (m_CurrentReconnectCount > m_ReconnectCount)
//			{
//				_Global.Log(String.Format("$$$$$m_CurrentReconnectCount >= m_ReconnectCount {0}:{1}", m_CurrentReconnectCount.ToString(),m_ReconnectCount.ToString()));
//				ErrorMgr.singleton.PushError("", Datas.getArString("Error.err_100000"), true, Datas.getArString("Common.OK_Button"), null);
//				m_CurrentReconnectCount = 0;
//				//return;
//			}
//
//			m_WaitConnectFlag = true;
//			m_WaitConnectTime = DateTime.Now.AddSeconds(m_ReconnectInterval);
//        }
//        
//		public void Close()
//		{
//			NetworkManager.Instance.Close();
//		}
//		
//		public void Update()
//		{
//			if (!m_IsEnable)
//			{
//				return;
//			}
//
//			if (m_SignUpFlag)
//			{
//				m_SignUpFlag = false;
//				SignUp();
//			}
//			else if (m_ReconnectFlag)
//			{
//				m_ReconnectFlag = false;
//				Reconnect();
//			}
//			else if (m_WaitConnectFlag)
//			{
//				if (DateTime.Now >= m_WaitConnectTime)
//				{
//					Connect();
//				}
//			}
//			else
//			{
//				NetworkManager.Instance.Update();
//			}
//		}
//		
//		public void RegisterHandler(IPacketHandler handler)
//		{
//			NetworkManager.Instance.RegisterHandler(handler);
//		}
//		
//		public void SetSignUpInformation(int serverId, int userId, string nickName, int allianceId)
//		{
//			m_ServerId = serverId;
//			m_UserId = userId;
//			m_NickName  = nickName;
//			m_AllianceId = allianceId;
//		}
//		
//		private void SignUp()
//		{
//			egs_packet.signup request = new egs_packet.signup();
//			request.realmid = m_ServerId;
//			request.playerid = m_UserId;
//			request.nick = m_NickName;
//			request.anllianceid = m_AllianceId;
//			request.cver = BuildSetting.clientVersion;
//			NetworkManager.Instance.Send(request, "Signup");
//			_Global.Log (String.Format("Signup Begin {0}:{1}." , m_IpAddress.ToString(), m_Port.ToString()));
////			ErrorMgr.singleton.PushError("", "Signup start", true, Datas.getArString("Common.OK_Button"), null);
//        }
//
//		private void OnNetworkSignUp()
//		{
//            var logString = String.Format("SignUp {0}:{1} OK!", m_IpAddress.ToString(), m_Port.ToString());
//            _Global.Log(logString);
//
//            if (BuildSetting.DebugMode != 0)
//            {
//                UnityNet.reportErrorToServer(UnityNet.CLIENT_LOG, null, UnityNet.CLIENT_LOG, logString, false);
//            }
//		}
//        
//        private void OnNetworkConnected(object userData)
//        {	
//            // WARN: This callback is not running in main thread!!!
//            _Global.Log(String.Format("Connect {0}:{1} OK! UserData='{2}'.", m_IpAddress.ToString(), m_Port.ToString(), userData == null ? "<null>" : userData.ToString()));
//			m_CurrentReconnectCount = 0;
//			m_SignUpFlag = true;
//        }
//        
//        private void OnNetworkSendPacket(object userData)
//        {
//            // WARN: This callback is not running in main thread!!!
//			_Global.Log(String.Format("Send Packet OK! UserData='{0}'.", userData == null ? "<null>" : userData.ToString()));
//        }
//        
//        private void OnNetworkMissHeartBeat(int missCount)
//        {
//			if (!m_IsEnable)
//			{
//				return;
//			}
//            // WARN: This callback is not running in main thread!!!
//			_Global.Log(String.Format("Miss Heart Beat {0} Times.", missCount.ToString()));
//			if (missCount >= m_HeartBeatCount)
//            {
//				_Global.Log(String.Format("$$$$$missCount >= m_HeartBeatCount {0}:{1}", missCount.ToString(),m_HeartBeatCount.ToString()));
//				ErrorMgr.singleton.PushError("", Datas.getArString("Error.err_100000"), true, Datas.getArString("Common.OK_Button"), null);
//                m_ReconnectFlag = true;
//            }
//        }
//        
//        private void OnNetworkError(NetworkErrorCode errorCode, string errorMessage)
//        {
//			if (!m_IsEnable)
//			{
//				return;
//			}
//			// WARN: This callback is not running in main thread!!!
//			_Global.Log(string.Format("Network Error! Error Code: {0}, Error Message: {1}", errorCode.ToString(), errorMessage));
//			m_ReconnectFlag = true;
//		}
//
//		public void SendHeartBeat()
//		{
//			NetworkManager.Instance.Send(new PBHeartBeat(), "HeartBeat");
//		}
//	}
//}
