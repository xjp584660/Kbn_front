class MaintenanceChat
{
	private	static	var	singleton:MaintenanceChat;
	private var m_Author:String;
	private var m_WorldId:int;
	private var m_MaxChatId:String;
	private var m_Avatar:String;
	private var m_Badge:String;
	private var m_UserId:int;
	
	public static function getInstance():MaintenanceChat
	{
		if(singleton == null){
			singleton = new MaintenanceChat();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	private function MaintenanceChat()
	{
		Init();
	}
	private function Init():void
	{
		if(String.IsNullOrEmpty(m_Author) )
		{
			m_Author = GameMain.instance().getUserName();
		}
		m_WorldId = Datas.instance().worldid();
		m_UserId = Datas.instance().tvuid();
		m_Avatar = AvatarMgr.instance().PlayerAvatar;
	}
	
	public function getAuthor():String
	{
		return (String.IsNullOrEmpty(m_Author) ? "" : m_Author);
	}
	
	public function setAuthor(author:String):void
	{
		m_Author = author;
	}
	
	public function getWorldId():int
	{
		return m_WorldId;
	}
	
	public function setWorldId(worldId:int):void
	{
		m_WorldId = worldId;
	}
	
	public function getMaxChatId():String
	{
		return (String.IsNullOrEmpty(m_MaxChatId) ? "" : m_MaxChatId);
	}
	
	public function setMaxChatId(chatId:String):void
	{
		if(_Global.INT32(chatId) > _Global.INT32(m_MaxChatId))
			m_MaxChatId = chatId;
	}
	
	public function getAvatar():String
	{
		return String.IsNullOrEmpty(m_Avatar) ? "1001" : m_Avatar;
	}
	
	public function setAvatar(avatar:String):void
	{
		m_Avatar = avatar;
	}
	
	public function getBadge():String
	{
		return String.IsNullOrEmpty(m_Badge) ? "" : m_Badge;
	}
	
	public function setBadge(badge:String):void
	{
		m_Badge = badge;
	}
	
	public function reqGetMaintenanceChat(resultFunc:Function):void
	{
		var params:Array = new Array();	
 		params.Add("get");
 		params.Add(getAuthor());
 		params.Add(getWorldId().ToString());
 		params.Add(getMaxChatId());
 		params.Add(getAvatar());
 		params.Add(getBadge());
 		
 		var okFunc:Function = function(result:HashObject)
		{
	  		if(result["ok"].Value)
			{
				setMaxChatId(_Global.GetString(result["chatId"]));
				setAuthor(_Global.GetString(result["author"]));
				setWorldId(_Global.INT32(result["serverId"]));
				setAvatar(_Global.GetString(result["portraitname"]));
				setBadge(_Global.GetString(result["badge"]));
  				if(resultFunc)
					resultFunc(result);
	  		}	 
		};
 		
 		UnityNet.reqGetMaintenanceChat(params, okFunc, null);
	}
	
	public function reqSendMaintenanceChat(content:String,resultFunc:Function):void
	{
		var params:Array = new Array();	
 		params.Add("send");
 		params.Add(getAuthor());
 		params.Add(getWorldId().ToString());
 		params.Add(content);
 		params.Add(getAvatar());
 		params.Add(getBadge());
 		
 		var okFunc:Function = function(result:HashObject)
		{
	  		if(result["ok"].Value)
			{
  				if(resultFunc)
					resultFunc();
	  		}	 
		};
 		
 		UnityNet.reqSendMaintenanceChat(params, okFunc, null);
	}

}
