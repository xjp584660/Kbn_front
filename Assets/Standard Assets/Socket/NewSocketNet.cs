using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using UnityEngine;
namespace KBN
{
	public delegate void NewNetworkSignUpHandler();
	public delegate void NewNetworkConnectedHandler();

	public class NewSocketNet
	{
		private bool isEnable = false;
		// ip地址
		private string ipAddress = string.Empty;
		// 端口号
		private int port = 0;
		private float heartBentInterval = 30f;
		private int heartBeatCount = 3;
		private float reconnectInterval = 10f;
		private int reconnectCount = 3;
		private int currentReconnectCount = 0;
	 	private volatile float heartBeatElapse = 0f;
	    private volatile int missHeartBeatCount = 0;

		private bool signUpFlag = false;
		private bool reconnectFlag = false;
		private bool waitConnectFlag = false;
		private DateTime waitConnectTime = DateTime.MinValue;

		private int serverId;
		private int userId;
		private string playerName;
		private int allianceId;

		private NewNetworkNode networkNode = null;
	    private readonly IDictionary<Int32, IPacketHandler> packetHandlers = new Dictionary<Int32, IPacketHandler>();
	    private readonly Queue<Packet> packets = new Queue<Packet>();
	    private bool active = false;

	    /// <summary>
    	/// 连接成功事件。
    	/// </summary>
		public event NewNetworkConnectedHandler OnNewNetworkNodeConnected = null;

		public event NewNetworkSignUpHandler OnNewNetworkNodeSignUp = null;

		public List<Action> onConnecteds;
		public bool reconnectSuccess = false;

		protected NewSocketNet()
		{
			onConnecteds = new List<Action>();
			RegisterAllHandlers();
		}

		public static NewSocketNet instance
		{
			get;
			protected set;
		}

		public bool IsSocketConnected()
		{
			if(networkNode == null)
			{
				return false;
			}

			return networkNode.Connected;
		}

		/// <summary>
		/// 注册消息回调
		/// </summary>
		public virtual void RegisterAllHandlers()
		{
			// C#的消息回调放这里
			RegisterHandler(new HeartBeatHandler());
			RegisterHandler(new SignUpHandler());
			RegisterHandler(new BattleInfoHandler());
			RegisterHandler(new MarchListHandler());
		}

		// 注册断线重连事件
		public void RegisterConnectedHandlers(Action action)
		{
			onConnecteds.Add(action);
		}

		/// <summary>
	    /// 注册消息包处理函数。
	    /// </summary>
	    /// <param name="handler">要注册的消息包处理函数。</param>
	    public void RegisterHandler(IPacketHandler handler)
	    {
	        if (handler == null)
	        {
	            throw new ApplicationException("NewSocketNet Packet handler is invalid.");
	        }

	        if (packetHandlers.ContainsKey(handler.Opcode))
	        {
	            throw new ApplicationException(string.Format("NewSocketNet Already exist opcode '{0}'.", handler.Opcode));
	        }

	        packetHandlers.Add(handler.Opcode, handler);
	    }

	    public void SetNewSocketIpAndPort(string ipAddress, int port)
	    {
	    	this.ipAddress = ipAddress;
	    	this.port = port;
	    }

	    public void SetOtherData(float heartBentInterval, int heartBeatCount, float reconnectInterval, int reconnectCount)
	    {
	    	this.heartBentInterval = heartBentInterval;
	    	this.heartBeatCount = heartBeatCount;
	    	this.reconnectInterval = reconnectInterval;
	    	this.reconnectCount = reconnectCount;
	    }

    	public void SetSignUpInformation(int serverId, int userId, string playerName, int allianceId)
		{
			this.serverId = serverId;
			this.userId = userId;
			this.playerName  = playerName;
			this.allianceId = allianceId;
		}

		public void AllianceChanged(int allianceId)
		{
			if(IsSocketConnected())
			{
				this.allianceId = allianceId;
				SignUp();
			}			
		}

		public void SetEnable(bool enable)
		{
			isEnable = enable;
			if (!enable)
			{
				Close();
			}
		}

		public bool GetEnable()
		{
			return isEnable;
		}

		// 创建
		public void Creat()
		{
			if(networkNode == null)
			{
				networkNode = new NewNetworkNode();
				networkNode.ReceiveBufferSize = 8192;
	        	networkNode.SendBufferSize = 8192;
			}
			
			networkNode.SetNodeEnable(isEnable);
			networkNode.OnNetworkNodeConnected += OnNetworkNodeConnected;
	        networkNode.OnNetworkNodeSendPacket += OnNetworkNodeSendPacket;
	        networkNode.OnNetworkNodeReceivePacket += OnNetworkNodeReceivePacket;
			networkNode.OnNetworkNodeError += OnNetworkNodeError;
	        
			Connect();
		}

		private void Connect()
		{
			Connect(ipAddress, port);
		}

		// 链接
		private void Connect(string ipAddress, int port)
		{
			waitConnectFlag = false;
			if (networkNode == null)
	        {
				string errorMessage = "NewSocketNet You must create network node first.";
				OnNetworkError(NetworkErrorCode.StatusError, errorMessage);
	        }

			try
			{
				IPAddress IpAddress = IPAddress.Parse(ipAddress);
				lock(networkNode)
		  		{
				 	networkNode.Connect(IpAddress, port);
		  		}
			}
			catch (Exception exception)
			{
				throw new ApplicationException(string.Format("NewSocketNet Connect Error '{0}'.", exception.Message), exception);
			}
		}

		// 关闭
		public void Close()
		{	 
			if (networkNode == null)
	        {
	            return;
	        }

        	lock(networkNode)
			{
				packets.Clear();
				//active = false;
				networkNode.OnNetworkNodeConnected -= OnNetworkNodeConnected;
				networkNode.OnNetworkNodeSendPacket -= OnNetworkNodeSendPacket;
				networkNode.OnNetworkNodeReceivePacket -= OnNetworkNodeReceivePacket;
				networkNode.OnNetworkNodeError -= OnNetworkNodeError;
				networkNode.Close();
				//networkNode = null;
			}
		}

		// 重连
		public void Reconnect()
		{
			 KBN._Global.LogWarning("NewSocketNet.Reconnnect");
			if( networkNode==null){
				return;
			}
			Close();

			currentReconnectCount++;
			if (currentReconnectCount > reconnectCount)
			{
				//KBN._Global.Log(String.Format("$$$$$NewSocketNet currentReconnectCount >= reconnectCount {0}:{1}", currentReconnectCount.ToString(),reconnectCount.ToString()));
				//KBN.ErrorMgr.singleton.PushError("", KBN.Datas.getArString("Error.err_100000"), true, KBN.Datas.getArString("Common.OK_Button"), null);
				currentReconnectCount = 0;
			}
	
			waitConnectFlag = true;
			waitConnectTime = DateTime.Now.AddSeconds(reconnectInterval);
		}

		// 登陆
		public void SignUp()
		{
			egs_packet.signup request = new egs_packet.signup();
			request.realmid = serverId;
			request.playerid = userId;
			request.nick = playerName;
			request.anllianceid = allianceId;
			request.cver = BuildSetting.ClientVersion;
			this.Send(request, "Signup");
			//_Global.Log (String.Format("NewSocketNet Signup Begin {0}:{1}." , ipAddress.ToString(), port.ToString()));
		}
		public List<string> GetTileList(){
			return tileList;
		}
		private List<string> tileList=new List<string>();
		//获取tile信息
		public void GetMap(string str)
		{
			//if(str=="")
				//Debug.LogWarning("Blocks==空");
			PBMap map=new PBMap();
			map.SetData(str);

			this.Send(map,"GetTile");
		}

		// 获取March信息
		public void SendGetMarchList(string centerMapTile)
		{
			// _Global.LogWarning("NewSockketNet.SendGetMarchList  centerMapTile : " + centerMapTile);
			PBMarchList tileInfo = new PBMarchList();
			tileInfo.SetData(centerMapTile);

			this.Send(tileInfo, "GetMarchList");
		}

		// 心跳
		public void SendHeartBeat()
		{
			this.Send(new PBHeartBeat(), "HeartBeat");
		}

		// 轮询
		public void Update()
		{
			if(!isEnable)
			{
				return;
			}

			if (signUpFlag)
			{
				signUpFlag = false;
				SignUp();

			}
			else if (reconnectFlag)
			{
				reconnectFlag = false;
				Reconnect();
			}
			else if (waitConnectFlag)
			{
				if (DateTime.Now >= waitConnectTime)
				{
					ResetHeartBeat();
					Creat();
				}
			}
			else
			{
				NetTick();
			}

			if(reconnectSuccess)
			{
				for(int i = 0; i < onConnecteds.Count; ++i)
				{
					onConnecteds[i]();
				}

				reconnectSuccess = false;
			}
		}

		private void NetTick()
		{
			if (active)
	        {
	            heartBeatElapse += Time.deltaTime;
				if (heartBeatElapse >= heartBentInterval)
	            {
	                heartBeatElapse = 0f;
	                if (missHeartBeatCount > 0)
	                {
						OnNetworkMissHeartBeat(missHeartBeatCount);
	                }

					SendHeartBeat();
	                missHeartBeatCount++;
	            }
	        }

	        lock (packets)
	        {

	            while (packets.Count > 0)
	            {
	                Packet packet = packets.Dequeue();
	                //if(packet.Opcode == (int)PBOpcode.map)
        				//_Global.LogWarning("开始 lock-start 时间："+GZipHelper.GetTimeStamp(false));

	                IPacketHandler handler = null;
	                if (!packetHandlers.TryGetValue(packet.Opcode, out handler))
	                {
	                    throw new ApplicationException(string.Format("NewSocketNet Can not found socket handler with opcode '{0}'.", packet.Opcode));
	                }
	                //if(packet.Opcode == (int)PBOpcode.map)
        				//_Global.LogWarning("开始 Send-end 时间："+GZipHelper.GetTimeStamp(false));

        			if(packet.Opcode == (int)PBOpcode.signup)
        			{
        				if(OnNewNetworkNodeSignUp != null)
        				{
        					OnNewNetworkNodeSignUp();
        				}
        			}
			
	                handler.Handle(packet.Bytes);
	            }
	        }
		}

		/// <summary>
	    /// 向远程主机发送数据包。
	    /// </summary>
	    /// <param name="packet">要发送的数据包。</param>
	    public void Send<T>(T packet) where T : IPacket
	    {
	        Send(packet, null);
	    }

	    /// <summary>
	    /// 向远程主机发送数据包。
	    /// </summary>
	    /// <param name="packet">要发送的数据包。</param>
	    /// <param name="userData">用户自定义数据。</param>
	    public void Send<T>(T packet, object userData) where T : IPacket
	    {
			if(!isEnable)
			{
				return;
			}

	        if (networkNode == null)
	        {
				string errorMessage = "NewSocketNet You must create network node first.";
				OnNetworkError(NetworkErrorCode.StatusError, errorMessage);
				return;
	        }

	        if (packet == null)
	        {
				throw new ApplicationException("NewSocketNet Packet is invalid.");
	        }

			PBPacket pbPacket = new PBPacket();
	        pbPacket.Opcode = packet.Opcode;

	        if(packet.Opcode == (int)PBOpcode.marchList)
	        {
	        	pbPacket.Data = (packet as PBMarchList).GetData();
        	}
        	else
        	{
        		using (MemoryStream packetStream = new MemoryStream())
		        {
		            ProtoBuf.Serializer.Serialize<T>(packetStream, packet);
		            pbPacket.Data = packetStream.ToArray();
		        }
        	}
	        

	        byte[] data = null;
	        using (MemoryStream dataStream = new MemoryStream())
	        {
				ProtoBuf.Serializer.SerializeWithLengthPrefix<PBPacket>(dataStream, pbPacket, ProtoBuf.PrefixStyle.Fixed32BigEndian);
	            data = dataStream.ToArray();
	        }
	        //if(pbPacket.Opcode == (int)PBOpcode.map)
        		//_Global.LogWarning("开始 Send 时间："+GZipHelper.GetTimeStamp(false));
          lock(networkNode)
		  {
	        networkNode.Send(data, userData);
		  }
	    }

		public static T GetPacket<T>(byte[] bytes) where T : IPacket
		{
			T packet = default(T);
			try
			{
				using (MemoryStream memoryStream = new MemoryStream(bytes))
				{
					packet = ProtoBuf.Serializer.Deserialize<T>(memoryStream);
				}
			}
			catch(System.Exception ex)
			{
				string temp = "Packet bytes:";
				if (bytes != null)
				{
					for (int i = 0; i < bytes.Length; i++)
					{
						temp += " " + bytes[i].ToString();
	                }
	            }
	            temp += "\n";
	            UnityEngine.Debug.LogError(temp + ex.ToString());
	            throw;
	        }

			return packet;
		}

	    private void ResetHeartBeat()
	    {
	        missHeartBeatCount = 0;
	        heartBeatElapse = 0f;
	    }

		private void OnNetworkNodeConnected(NewNetworkNode sender, object userData)
	    {
	        active = true;
			signUpFlag = true;
	        ResetHeartBeat();
			currentReconnectCount = 0;
	        reconnectSuccess = true;
			if(OnNewNetworkNodeConnected != null)
	        {
				OnNewNetworkNodeConnected();
	        }
	    }

		private void OnNetworkNodeSendPacket(NewNetworkNode sender, object userData)
	    {
	        // WARN: This callback is not running in main thread!!!
			//KBN._Global.Log(String.Format("NewSocketNet Send Packet OK! UserData='{0}'.", userData == null ? "<null>" : userData.ToString()));
	    }

		private void OnNetworkNodeReceivePacket(NewNetworkNode sender, int opcode, byte[] data)
	    {
			if(!isEnable)
			{
				return;
			}

			if(opcode == (int)PBOpcode.heartbeat)
			{
				ResetHeartBeat();
			}
				        
	        lock (packets)
	        {
	        	if(opcode == (int)PBOpcode.map){
        	    	//_Global.LogWarning("开始 packets 时间："+GZipHelper.GetTimeStamp(false));
	        	}
	            packets.Enqueue(new Packet(opcode, data));
	        }

			//UnityEngine.Debug.Log("NewSocketNet Receive Packet! Opcode='" + opcode + "', Name='"+ ((PBOpcode)opcode).ToString() + "'.");
	    }

	 	private void OnNetworkMissHeartBeat(int missCount)
	    {
			if(!isEnable)
			{
				return;
			}
	        // WARN: This callback is not running in main thread!!!
			//KBN._Global.Log(String.Format("NewSocketNet Miss Heart Beat {0} Times.", missCount.ToString()));
			if (missCount >= heartBeatCount)
	        {
				//KBN._Global.Log(String.Format("NewSocketNet $$$$$missCount >= heartBeatCount {0}:{1}", missCount.ToString(),heartBeatCount.ToString()));
				//KBN.ErrorMgr.singleton.PushError("", KBN.Datas.getArString("Error.err_100000"), true, KBN.Datas.getArString("Common.OK_Button"), null);
	            reconnectFlag = true;
	        }
	    }

		private void OnNetworkNodeError(NewNetworkNode sender, NetworkErrorCode errorCode, string errorMessage)
		{
			//active = false;
			OnNetworkError(errorCode,errorMessage);
		}

	   	private void OnNetworkError(NetworkErrorCode errorCode, string errorMessage)
	    {
			if(!isEnable)
			{
				return;
			}
			//UnityNet.reportErrorToServer("NewSocketNet  OnNetworkNodeError : ",null,null,string.Format("NewSocketNet Network Error! Error Code: {0}, Error Message: {1}", errorCode.ToString(), errorMessage),false);
			// WARN: This callback is not running in main thread!!!
		    KBN._Global.LogWarning(string.Format("NewSocketNet Network Error! Error Code: {0}, Error Message: {1}", errorCode.ToString(), errorMessage));
			reconnectFlag = true;
		}

		public void RegisterNetworkSignUpFunc(NewNetworkSignUpHandler _signUpFunc)
		{
			OnNewNetworkNodeSignUp += _signUpFunc;
		}

		public void Clear()
		{
			onConnecteds.Clear();
			SetEnable(false);
			if(networkNode != null)
			{
				networkNode = null;
			}
		}
	}
}


