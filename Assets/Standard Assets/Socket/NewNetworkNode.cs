// Socket Network Manager v1.0
// yjiang@kabaminc.com 2014-06-18

using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;

/// <summary>
/// 网络连接结点。
/// </summary>
public class NewNetworkNode
{
	private Socket m_Socket = null;
	private bool isConnected = false;

	private bool isEnable = false;

	public void SetNodeEnable(bool enable)
	{
		isEnable = enable;
	}
	
	/// <summary>
	/// 初始化网络连接结点的新实例。
	/// </summary>
	public NewNetworkNode()
	{
		m_Socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
	}
	
	/// <summary>
	/// 获取网络是否已连接。
	/// </summary>
	public bool Connected
	{
		get
		{
			return m_Socket.Connected;
		}
	}
	
	/// <summary>
	/// 获取已经从网络接收且可供读取的数据量。
	/// </summary>
	public int Available
	{
		get
		{
			return m_Socket.Available;
		}
	}
	
	/// <summary>
	/// 获取或设置接收缓冲区字节数。
	/// </summary>
	public int ReceiveBufferSize
	{
		get
		{
			return m_Socket.ReceiveBufferSize;
		}
		set
		{
			m_Socket.ReceiveBufferSize = value;
		}
	}
	
	/// <summary>
	/// 获取或设置发送缓冲区字节数。
	/// </summary>
	public int SendBufferSize
	{
		get
		{
			return m_Socket.SendBufferSize;
		}
		set
		{
			m_Socket.SendBufferSize = value;
		}
	}
	
	/// <summary>
	/// 连接成功事件。
	/// </summary>
	public event NetworkNodeConnectedHandler OnNetworkNodeConnected = null;
	
	/// <summary>
	/// 发送消息包事件。
	/// </summary>
	public event NetworkNodeSendPacketHandler OnNetworkNodeSendPacket = null;
	
	/// <summary>
	/// 收到消息包事件。
	/// </summary>
	public event NetworkNodeReceivePacketHandler OnNetworkNodeReceivePacket = null;
	
	/// <summary>
	/// 连接错误事件。
	/// </summary>
	public event NetworkNodeErrorHandler OnNetworkNodeError = null;

	/// <summary>
	/// 连接到远程主机。
	/// </summary>
	/// <param name="ipAddress">远程主机的 IP 地址。</param>
	/// <param name="port">远程主机的端口号。</param>
	/// <param name="userData">用户自定义数据。</param>
	public void Connect(IPAddress ipAddress, int port, object userData = null)
	{
		try
		{
			if(!isEnable)
			{
				return;
			}
			m_Socket.BeginConnect(ipAddress, port, new AsyncCallback(ConnectCallback), userData);
		}
		catch (Exception exception)
		{
			if (((exception is ThreadAbortException) || (exception is StackOverflowException)) || (exception is OutOfMemoryException))
			{
				throw;
			}
			
			if (OnNetworkNodeError != null)
			{
				OnNetworkNodeError(this, NetworkErrorCode.ConnectError, exception.Message);
				return;
			}
			else
			{
				throw new ApplicationException(string.Format("BeginConnect exception '{0}'.", exception.Message), exception);
			}
		}
	}
	
	/// <summary>
	/// 关闭连接并释放所有相关资源。
	/// </summary>
	public void Close()
	{
		try
		{
			//m_Socket.Shutdown(SocketShutdown.Both);
			m_Socket.BeginDisconnect(true, new AsyncCallback(DisconnectCallback), m_Socket);
		}
			catch (Exception exception)
		{
			// if (((exception is ThreadAbortException) || (exception is StackOverflowException)) || (exception is OutOfMemoryException))
			// {
			// 	throw;
			// }

			// if (OnNetworkNodeError != null)
			// {
			// 	OnNetworkNodeError(this, NetworkErrorCode.SendError, exception.Message);
			// 	return;
			// }
			// else
			// {
			// 	throw new ApplicationException(string.Format("BeginDisconnect exception '{0}'.", exception.Message), exception);
			// }
		}
		finally
		{
			//m_Socket.Close();
		}	
	}

	private void DisconnectCallback(IAsyncResult ar)
	{
		try
		{
			m_Socket.EndDisconnect(ar);
			isConnected = false;
		}
		catch (Exception exception)
		{
			if (((exception is ThreadAbortException) || (exception is StackOverflowException)) || (exception is OutOfMemoryException))
			{
				throw;
			}
			
			if (OnNetworkNodeError != null)
			{
				OnNetworkNodeError(this, NetworkErrorCode.SendError, exception.Message);
				return;
			}
			else
			{
				throw new ApplicationException(string.Format("EndDisconnnnect exception '{0}'.", exception.Message), exception);
			}
		}
	}
	
	/// <summary>
	/// 向远程主机发送数据包。
	/// </summary>
	/// <param name="data">要发送的数据包。</param>
	/// <param name="userData">用户自定义数据。</param>
	public void Send(byte[] data, object userData = null)
	{
		try
		{
			if(!isConnected || !isEnable)
			{
				return;
			}
			m_Socket.BeginSend(data, 0, data.Length, SocketFlags.None, new AsyncCallback(SendCallback), userData);
		}
		catch (Exception exception)
		{
			if (((exception is ThreadAbortException) || (exception is StackOverflowException)) || (exception is OutOfMemoryException))
			{
				throw;
			}
			
			if (OnNetworkNodeError != null)
			{
				OnNetworkNodeError(this, NetworkErrorCode.SendError, exception.Message);
				return;
			}
			else
			{
				throw new ApplicationException(string.Format("BeginSend exception '{0}'.", exception.Message), exception);
			}
		}
	}
	
	private void Receive(ReceiveState state)
	{
		try
		{
			if(!isConnected || !isEnable)
			{
				return;
			}
			m_Socket.BeginReceive(state.buffer, 0, state.buffer.Length, SocketFlags.None, new AsyncCallback(ReceiveCallback), state);
		}
		catch (Exception exception)
		{
			if (((exception is ThreadAbortException) || (exception is StackOverflowException)) || (exception is OutOfMemoryException))
			{
				throw;
			}
			
			if (OnNetworkNodeError != null)
			{
				OnNetworkNodeError(this, NetworkErrorCode.ReceiveError, exception.Message);
				return;
			}
			else
			{
				throw new ApplicationException(string.Format("BeginReceive exception '{0}'.", exception.Message), exception);
			}
		}
	}
	
	private byte[] Process(byte[] data)
	{
		while (true)
		{
			if (data.Length < 4)
			{
				return data;
			}
			
			int packetLength = GetIntFromBytes(data[0], data[1], data[2], data[3]);
			if (data.Length - 4 < packetLength)
			{
				return data;
			}
			
			byte[] packetBytes = new byte[packetLength];
			Buffer.BlockCopy(data, 4, packetBytes, 0, packetLength);
			PBPacket pbPacket = null;
			try
			{
				using (MemoryStream packetStream = new MemoryStream(packetBytes))
				{
					pbPacket = ProtoBuf.Serializer.Deserialize<PBPacket>(packetStream);
				}
			}
			catch(System.Exception ex)
			{
				string temp = "Packet bytes:";
				if (packetBytes != null)
				{
					for (int i = 0; i < packetBytes.Length; i++)
					{
						temp += " " + packetBytes[i].ToString();
					}
				}
				temp += "\n";
				UnityEngine.Debug.LogError(temp + ex.ToString());
				throw;
			}
			if (OnNetworkNodeReceivePacket != null)
			{
				OnNetworkNodeReceivePacket(this, pbPacket.Opcode, pbPacket.Data);
			}
			
			int leftLength = data.Length - 4 - packetLength;
			byte[] leftData = new byte[leftLength];
			Buffer.BlockCopy(data, 4 + packetLength, leftData, 0, leftLength);
			data = leftData;
		}
	}
	
	private void ConnectCallback(IAsyncResult ar)
	{
		try
		{
			m_Socket.EndConnect(ar);
		}
		catch (Exception exception)
		{
			if (((exception is ThreadAbortException) || (exception is StackOverflowException)) || (exception is OutOfMemoryException))
			{
				throw;
			}
			
			if (OnNetworkNodeError != null)
			{
				OnNetworkNodeError(this, NetworkErrorCode.ConnectError, exception.Message);
				return;
			}
			else
			{
				throw new ApplicationException(string.Format("EndConnect exception '{0}'.", exception.Message), exception);
			}
		}
		
		isConnected = true;
		if (OnNetworkNodeConnected != null)
		{
			OnNetworkNodeConnected(this, ar.AsyncState);
		}
		
		// Start receive.
		Receive(new ReceiveState(ReceiveBufferSize));
	}
	
	private void SendCallback(IAsyncResult ar)
	{
		try
		{
			if(!isEnable)
			{
				return;
			}
			m_Socket.EndSend(ar);
		}
		catch (Exception exception)
		{
			if (((exception is ThreadAbortException) || (exception is StackOverflowException)) || (exception is OutOfMemoryException))
			{
				throw;
			}
			
			if (OnNetworkNodeError != null)
			{
				OnNetworkNodeError(this, NetworkErrorCode.SendError, exception.Message);
				return;
			}
			else
			{
				throw new ApplicationException(string.Format("EndSend exception '{0}'.", exception.Message), exception);
			}
		}
		
		if (OnNetworkNodeSendPacket != null)
		{
			OnNetworkNodeSendPacket(this, ar.AsyncState);
		}
	}
	
	private void ReceiveCallback(IAsyncResult ar)
	{
		ReceiveState state = ar.AsyncState as ReceiveState;
		int bytesReceived = 0;
		try
		{
			if(!isEnable)
			{
				return;
			}
			bytesReceived = m_Socket.EndReceive(ar);
		}
		catch (Exception exception)
		{
			if (((exception is ThreadAbortException) || (exception is StackOverflowException)) || (exception is OutOfMemoryException))
			{
				throw;
			}
			
			if (OnNetworkNodeError != null)
			{
				OnNetworkNodeError(this, NetworkErrorCode.ReceiveError, exception.Message);
				return;
			}
			else
			{
				throw new ApplicationException(string.Format("EndReceive exception '{0}'.", exception.Message), exception);
			}
		}
		
		if (bytesReceived <= 0)
		{
			string errorMessasge = "Receive bytes size must bigger than 0.";
			if (OnNetworkNodeError != null)
			{
				OnNetworkNodeError(this, NetworkErrorCode.ReceiveError, errorMessasge);
				return;
			}
			else
			{
				throw new ApplicationException(errorMessasge);
			}
		}
		
		byte[] data = new byte[state.data.Length + bytesReceived];
		Buffer.BlockCopy(state.data, 0, data, 0, state.data.Length);
		Buffer.BlockCopy(state.buffer, 0, data, state.data.Length, bytesReceived);
		string temp = string.Empty;
		for (int i = 0; i < bytesReceived; i++) {
			temp += state.buffer[i] + " ";
		}
		KBN._Global.Log ("Packet Received: " + temp);
		state.data = Process(data);
		Receive(state);
	}
	
	/// <summary>
	/// 将 bytes 转换成 int。
	/// </summary>
	/// <param name="byte0">要转换的 byte0。</param>
	/// <param name="byte1">要转换的 byte1。</param>
	/// <param name="byte2">要转换的 byte2。</param>
	/// <param name="byte3">要转换的 byte3。</param>
	/// <returns>转换后的 int。</returns>
	private int GetIntFromBytes(byte byte0, byte byte1, byte byte2, byte byte3)
	{
		return (byte0 << 24) | (byte1 << 16) | (byte2 << 8) | (byte3);
	}
	
	/// <summary>
	/// 将 bytes 转换成 int。
	/// </summary>
	/// <param name="bytes">要转换的 bytes。</param>
	/// <returns>转换后的 int。</returns>
	private int GetIntFromBytes(byte[] bytes)
	{
		if (bytes.Length != 4)
		{
			throw new ApplicationException("The bytes which will convert to uint must have 4 bytes.");
		}
		
		return GetIntFromBytes(bytes[0], bytes[1], bytes[2], bytes[3]);
	}
	
	/// <summary>
	/// 连接成功回调函数。
	/// </summary>
	/// <param name="sender">触发事件的网络连接结点。</param>
	/// <param name="userData">用户自定义数据。</param>
	public delegate void NetworkNodeConnectedHandler(NewNetworkNode sender, object userData);
	
	/// <summary>
	/// 发送消息包回调函数。
	/// </summary>
	/// <param name="sender">触发事件的网络连接结点。</param>
	/// <param name="userData">用户自定义数据。</param>
	public delegate void NetworkNodeSendPacketHandler(NewNetworkNode sender, object userData);
	
	/// <summary>
	/// 收到消息包回调函数。
	/// </summary>
	/// <param name="sender">触发事件的网络连接结点。</param>
	/// <param name="opcode">消息包协议编号。</param>
	/// <param name="data">消息包数据流。</param>
	public delegate void NetworkNodeReceivePacketHandler(NewNetworkNode sender, int opcode, byte[] data);
	
	/// <summary>
	/// 连接错误回调函数。
	/// </summary>
	/// <param name="sender">触发事件的网络连接结点。</param>
	/// <param name="errorCode">错误码。</param>
	/// <param name="errorMessage">错误信息。</param>
	public delegate void NetworkNodeErrorHandler(NewNetworkNode sender, NetworkErrorCode errorCode, string errorMessage);
	
	/// <summary>
	/// 数据包接收状态。
	/// </summary>
	private class ReceiveState
	{
		public byte[] buffer = null; // Receive buffer.
		public byte[] data = null; // All received data.
		
		public ReceiveState(int bufferSize)
		{
			buffer = new byte[bufferSize];
			data = new byte[0];
		}
	}
}
