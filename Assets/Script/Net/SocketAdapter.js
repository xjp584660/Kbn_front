import System;
import System.Threading;
import System.Net;
import System.Net.Sockets;
import System.Text;
import System.Collections;

public class SocketCallBack
{
	public var Operation:String;
	public var Method:Function;
	public var Param:Object;
	public function Do()
	{
		_Global.Log("socket notice:" + Operation);
		Method(Param);
	}
}

static class SocketAdapter
{
	private var client:TcpClient;
	private var hostAddress:String;
	private var hostPort:int;
	
	private var stream:NetworkStream;
	private var buffer:byte[];
	private var size:int = 8192;
	private var curPlayer:String;
	private var jsonPaser:JSONParse; //
	
	private var asyncCallback:AsyncCallback;
	private var poll_inverval:float = 5.0;
	
	private var handlers:Array;
	
	private var handlersQueue:Array;
	
	public function get HandlersQueue()
	{
		return handlersQueue;
	}
	
	public function RegisterHandler(handler:SocketCallBack):boolean
	{
		if(handlers == null)
		{
			handlers = new Array();
		}
		var contains:boolean = false;
		for(var i:int = 0;i<handlers.length; i++)
		{
			if((handlers[i] as SocketCallBack).Operation == handler.Operation)
			{
				contains = true;
				break;
			}
		}
		if(contains == false)
		{
			handlers.Add(handler);
		}
	}
	
	public function RemoveHandler(handler:String):boolean
	{
		var index:int = -1;
		for(var i:int = 0; i < handlers.length; i++)
		{
			if((handlers[i] as SocketCallBack).Operation == handler)
			{
				index = i;
				break;
			}
		}
		handlers.splice(index,1);
	}
	
	private function FindCallback(handler:String):SocketCallBack
	{
		var callback:SocketCallBack;
		var index:int = -1;
		for(var i:int = 0; i < handlers.length; i++)
		{
			if((handlers[i] as SocketCallBack).Operation == handler)
			{
				callback = handlers[i];
				break;
			}
		}
		return callback; 
	}
	public function Connect(ip:String,port:int,player:String):void
	{
		try
		{
			var ipAddress:IPAddress;
			if(IPAddress.TryParse(ip,ipAddress))
			{
				hostAddress = ip;
				curPlayer = player;
				hostPort = port;
				client = new TcpClient();
				client.Connect(ipAddress,hostPort);
				stream = client.GetStream();
//				running = true;
				authenticateUser(player);
				StartRead();
			}
		}
		catch(error:Exception)
		{	
			client = null;
			_Global.Log(error.Message);
		}
	}
	
	private function authenticateUser(player:String)
	{
		stream = client.GetStream();
		if(stream.CanWrite)
		{
			var shuttle:String  = "{\"type\":\"subscribe\", \"data\":" + player + "}";
			var playerData:byte[] = Encoding.UTF8.GetBytes(shuttle);
			stream.Write(playerData,0,playerData.Length);
			stream.Flush();
		}
	}
	
	private function StartRead()
	{
		if(asyncCallback == null)
		{
			asyncCallback = new AsyncCallback(ReadMessage);
		}
		if(stream != null && stream.CanRead)
		{
			buffer = new byte[size];
			stream.BeginRead(buffer,0,size,asyncCallback,null);
		}
	}
	
	private function get JSONParser()
	{
		if(jsonPaser == null)
		{
			jsonPaser = new JSONParse();
		}
		return jsonPaser;
	}
	
	private function ReadMessage(result:IAsyncResult)
	{
		_Global.Log("read start");
		var bytesRead:int = 0;
		if(stream == null)
		{
			return;
		}
		try
		{
			if(stream.CanRead)
			{
				bytesRead = stream.EndRead(result);
				if(bytesRead == 0)
				{
					client.Close();
					stream.Close();
				}
				else
				{
					var msg:String = Encoding.UTF8.GetString(buffer, 0, bytesRead);
					
					_Global.Log("reading:" + msg);
					
					var resultObj:HashObject = JSONParser.Parse(msg);
					var callback:SocketCallBack = FindCallback(resultObj["type"].Value);
					if(callback != null)
					{
						callback.Param = resultObj;
						if(handlersQueue == null)
						{
							handlersQueue = new Array();
						}
						handlersQueue.Unshift(callback);
					}
				}
			}	
		}
		catch(error:Exception)
		{
			_Global.Log(error.Message);
		}
		finally
		{
			buffer = new byte[size];
			StartRead();
		}
	}
	
	public function Update(time:float)
	{
		if(client != null)
		{
			poll_inverval -= time;
			if(poll_inverval <=0)
			{
				poll_inverval = 5.0;
				checkSocket();
			}
		}
	}

	public function checkSocket()
	{
		var connectionOk:boolean = false;
		if(client != null)
		{
			var canWrite:boolean = client.Client.Poll(-1, SelectMode.SelectWrite);
			connectionOk = canWrite;
		}
		if(connectionOk == false && hostAddress != null && hostPort >0 && curPlayer != null)
		{
			Connect(hostAddress,hostPort,curPlayer);
		}
	}
	
	public function Ready()
	{
		if(client != null)
		{
			return client.Client.Poll(-1, SelectMode.SelectWrite); 
		}
		return false;
	}
}