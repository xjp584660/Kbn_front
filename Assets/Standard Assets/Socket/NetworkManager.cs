//// Socket Network Manager v1.0
//// yjiang@kabaminc.com 2014-06-18
//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Net;
//using System.Net.Sockets;
//using UnityEngine;
//
//public delegate void NetworkSignUpHandler();
//
///// <summary>
///// 网络管理器。
///// </summary>
//public sealed class NetworkManager
//{
//    private NetworkNode m_NetworkNode = null;
//    private readonly IDictionary<Int32, IPacketHandler> m_PacketHandlers = new Dictionary<Int32, IPacketHandler>();
//    private readonly Queue<Packet> m_Packets = new Queue<Packet>();
//    private bool m_Active = false;
//    private float m_HeartBeatInterval = 30f;
//    private volatile float m_HeartBeatElapse = 0f;
//    private volatile int m_MissHeartBeatCount = 0;
//
//    private static NetworkManager m_Instance = null;
//
//    /// <summary>
//    /// 初始化网络管理器的新实例。
//    /// </summary>
//    private NetworkManager()
//    {
//        // Register heart beat handler.
//        RegisterHandler(new HeartBeatHandler());
//		RegisterHandler(new SignUpHandler());
//    }
//
//    /// <summary>
//    /// 网络管理器入口
//    /// </summary>
//    public static NetworkManager Instance
//    {
//        get
//        {
//            if (m_Instance == null)
//            {
//                m_Instance = new NetworkManager();
//            }
//
//            return m_Instance;
//        }
//    }
//
//    /// <summary>
//    /// 获取网络是否已连接。
//    /// </summary>
//    public bool Connected
//    {
//        get
//        {
//            if (m_NetworkNode != null)
//            {
//                return m_NetworkNode.Connected;
//            }
//
//            return false;
//        }
//    }
//
//    /// <summary>
//    /// 获取或设置心跳间隔秒数。
//    /// </summary>
//    public float HeartBeatInterval
//    {
//        get
//        {
//            return m_HeartBeatInterval;
//        }
//        set
//        {
//            m_HeartBeatInterval = value;
//        }
//    }
//
//    /// <summary>
//    /// 连接成功事件。
//    /// </summary>
//    public event NetworkConnectedHandler OnNetworkConnected = null;
//
//    /// <summary>
//    /// 发送消息包事件。
//    /// </summary>
//    public event NetworkSendPacketHandler OnNetworkSendPacket = null;
//
//    /// <summary>
//    /// 心跳丢失事件。
//    /// </summary>
//    public event NetworkMissHeartBeatHandler OnNetworkMissHeartBeat = null;
//
//    /// <summary>
//    /// 连接错误事件。
//    /// </summary>
//    public event NetworkErrorHandler OnNetworkError = null;
//
//	/// <summary>
//	/// signup成功事件。
//	/// </summary>
//	public event NetworkSignUpHandler OnNetworkSignUp = null;
//
//    /// <summary>
//    /// 网络管理器轮询。
//    /// </summary>
//    public void Update()
//    {
//        if (m_Active)
//        {
//            m_HeartBeatElapse += Time.deltaTime;
//            if (m_HeartBeatElapse >= m_HeartBeatInterval)
//            {
//                m_HeartBeatElapse = 0f;
//                if (m_MissHeartBeatCount > 0 && OnNetworkMissHeartBeat != null)
//                {
//					OnNetworkMissHeartBeat(m_MissHeartBeatCount);
//                }
//
//                Send(new PBHeartBeat(), "HeartBeat");
//                m_MissHeartBeatCount++;
//            }
//        }
//
//        lock (m_Packets)
//        {
//            while (m_Packets.Count > 0)
//            {
//                Packet packet = m_Packets.Dequeue();
//                IPacketHandler handler = null;
//                if (!m_PacketHandlers.TryGetValue(packet.Opcode, out handler))
//                {
//                    throw new ApplicationException(string.Format("Can not found socket handler with opcode '{0}'.", packet.Opcode));
//                }
//				if(packet.Opcode == (int)PBOpcode.signup)
//					if (OnNetworkSignUp != null)
//					{
//						OnNetworkSignUp();
//					}
//                handler.Handle(packet.Bytes);
//            }
//        }
//    }
//
//    /// <summary>
//    /// 注册消息包处理函数。
//    /// </summary>
//    /// <param name="handler">要注册的消息包处理函数。</param>
//    public void RegisterHandler(IPacketHandler handler)
//    {
//        if (handler == null)
//        {
//            throw new ApplicationException("Packet handler is invalid.");
//        }
//
//        if (m_PacketHandlers.ContainsKey(handler.Opcode))
//        {
//            throw new ApplicationException(string.Format("Already exist opcode '{0}'.", handler.Opcode));
//        }
//
//        m_PacketHandlers.Add(handler.Opcode, handler);
//    }
//
//    /// <summary>
//    /// 创建网络结点。
//    /// </summary>
//    /// <param name="receiveBufferSize">设置接收缓冲区字节数。</param>
//    /// <param name="sendBufferSize">设置发送缓冲区字节数。</param>
//    public void Create(int receiveBufferSize, int sendBufferSize)
//    {
//        if (m_NetworkNode != null)
//        {
//			string errorMessage = "You must close current network node first.";
//			if (OnNetworkError != null)
//			{
//				OnNetworkError(NetworkErrorCode.StatusError, errorMessage);
//			}
//			else
//			{
//				throw new ApplicationException(errorMessage);
//			}
//        }
//
//        m_NetworkNode = new NetworkNode();
//        m_NetworkNode.OnNetworkNodeConnected += OnNetworkNodeConnected;
//        m_NetworkNode.OnNetworkNodeSendPacket += OnNetworkNodeSendPacket;
//        m_NetworkNode.OnNetworkNodeReceivePacket += OnNetworkNodeReceivePacket;
//        m_NetworkNode.OnNetworkNodeError += OnNetworkNodeError;
//        m_NetworkNode.ReceiveBufferSize = receiveBufferSize;
//        m_NetworkNode.SendBufferSize = sendBufferSize;
//    }
//
//    /// <summary>
//    /// 关闭网络结点。
//    /// </summary>
//    public void Close()
//    {
//        if (m_NetworkNode == null)
//        {
//            return;
//        }
//
//		m_Packets.Clear ();
//		m_Active = false;
//        m_NetworkNode.OnNetworkNodeConnected -= OnNetworkNodeConnected;
//        m_NetworkNode.OnNetworkNodeSendPacket -= OnNetworkNodeSendPacket;
//        m_NetworkNode.OnNetworkNodeReceivePacket -= OnNetworkNodeReceivePacket;
//        m_NetworkNode.OnNetworkNodeError -= OnNetworkNodeError;
//        m_NetworkNode.Close();
//        m_NetworkNode = null;
//    }
//
//    /// <summary>
//    /// 连接到远程主机。
//    /// </summary>
//    /// <param name="ipAddress">远程主机的 IP 地址。</param>
//    /// <param name="port">远程主机的端口号。</param>
//    public void Connect(string ipAddress, int port)
//    {
//        Connect(ipAddress, port, null);
//    }
//
//    /// <summary>
//    /// 连接到远程主机。
//    /// </summary>
//    /// <param name="ipAddress">远程主机的 IP 地址。</param>
//    /// <param name="port">远程主机的端口号。</param>
//    /// <param name="userData">用户自定义数据。</param>
//    public void Connect(string ipAddress, int port, object userData)
//    {
//		if (m_NetworkNode == null)
//		{
//			string errorMessage = "You must create network node first.";
//			if (OnNetworkError != null)
//			{
//				OnNetworkError(NetworkErrorCode.StatusError, errorMessage);
//			}
//			else
//			{
//				throw new ApplicationException(errorMessage);
//			}
//			return;
//		}
//
//        m_NetworkNode.Connect(IPAddress.Parse(ipAddress), port, userData);
//    }
//
//    /// <summary>
//    /// 向远程主机发送数据包。
//    /// </summary>
//    /// <param name="packet">要发送的数据包。</param>
//    public void Send<T>(T packet) where T : IPacket
//    {
//        Send(packet, null);
//    }
//
//    /// <summary>
//    /// 向远程主机发送数据包。
//    /// </summary>
//    /// <param name="packet">要发送的数据包。</param>
//    /// <param name="userData">用户自定义数据。</param>
//    public void Send<T>(T packet, object userData) where T : IPacket
//    {
//        if (m_NetworkNode == null)
//        {
//            string errorMessage = "You must create network node first.";
//			if (OnNetworkError != null)
//			{
//				OnNetworkError(NetworkErrorCode.StatusError, errorMessage);
//			}
//			else
//			{
//				throw new ApplicationException(errorMessage);
//			}
//			return;
//        }
//
//        if (packet == null)
//        {
//            throw new ApplicationException("Packet is invalid.");
//        }
//
//		PBPacket pbPacket = new PBPacket();
//        pbPacket.Opcode = packet.Opcode;
//
//        using (MemoryStream packetStream = new MemoryStream())
//        {
//            ProtoBuf.Serializer.Serialize<T>(packetStream, packet);
//            pbPacket.Data = packetStream.ToArray();
//        }
//
//        byte[] data = null;
//        using (MemoryStream dataStream = new MemoryStream())
//        {
//			ProtoBuf.Serializer.SerializeWithLengthPrefix<PBPacket>(dataStream, pbPacket, ProtoBuf.PrefixStyle.Fixed32BigEndian);
//            data = dataStream.ToArray();
//        }
//
//        m_NetworkNode.Send(data, userData);
//    }
//
//	public static T GetPacket<T>(byte[] bytes) where T : IPacket
//	{
//		T packet = default(T);
//		try
//		{
//			using (MemoryStream memoryStream = new MemoryStream(bytes))
//			{
//				packet = ProtoBuf.Serializer.Deserialize<T>(memoryStream);
//			}
//		}
//		catch(System.Exception ex)
//		{
//			string temp = "Packet bytes:";
//			if (bytes != null)
//			{
//				for (int i = 0; i < bytes.Length; i++)
//				{
//					temp += " " + bytes[i].ToString();
//                }
//            }
//            temp += "\n";
//            UnityEngine.Debug.LogError(temp + ex.ToString());
//            throw;
//        }
//
//		return packet;
//	}
//
//    private void ResetHeartBeat()
//    {
//        m_MissHeartBeatCount = 0;
//        m_HeartBeatElapse = 0f;
//    }
//
//    private void OnNetworkNodeConnected(NetworkNode sender, object userData)
//    {
//        m_Active = true;
//        ResetHeartBeat();
//        if (OnNetworkConnected != null)
//        {
//            OnNetworkConnected(userData);
//        }
//    }
//
//    private void OnNetworkNodeSendPacket(NetworkNode sender, object userData)
//    {
//        if (OnNetworkSendPacket != null)
//        {
//            OnNetworkSendPacket(userData);
//        }
//    }
//
//    private void OnNetworkNodeReceivePacket(NetworkNode sender, int opcode, byte[] data)
//    {
//        ResetHeartBeat();
//        lock (m_Packets)
//        {
//            m_Packets.Enqueue(new Packet(opcode, data));
//        }
//
//		UnityEngine.Debug.Log("Receive Packet! Opcode='" + opcode + "', Name='"+ ((PBOpcode)opcode).ToString() + "'.");
//    }
//
//    private void OnNetworkNodeError(NetworkNode sender, NetworkErrorCode errorCode, string errorMessage)
//    {
//        m_Active = false;
//        if (OnNetworkError != null)
//        {
//			OnNetworkError(errorCode, errorMessage);
//        }
//    }
//
//    /// <summary>
//    /// 将 int 转换成 bytes。
//    /// </summary>
//    /// <param name="int32">要转换的 int。</param>
//    /// <returns>转换后的 bytes。</returns>
//    private byte[] GetBytesFromInt(int int32)
//    {
//        return new byte[] { (byte)((int32 >> 24) & 0xff), (byte)((int32 >> 16) & 0xff), (byte)((int32 >> 8) & 0xff), (byte)(int32 & 0xff) };
//    }
//}
