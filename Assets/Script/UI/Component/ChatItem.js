class ChatItem extends UIObject
{
	public var  btnChat:Button;
	public var  chatText:SimpleButton;
	public var  chatText1:Label;
	public var  chatText2:Label;
	public var 	chatIcon1:Label;
	public var 	chatIcon2:Label;	
	
	public var TextureGlobal:Texture2D;
	public var TextureAlliance:Texture2D;
	public var TextureWhisper:Texture2D;
	
	private var g_countForChattext:long = 0;
	private var g_curTime:long = 0; 
	private var g_updateChatInterval:int = 1;   
	
	public var redColor:Color;
	public var blackColor:Color;
	
	function Init():void
	{
		btnChat.OnClick = OpenChat;
		chatText1.Init();
		chatText2.Init();
		chatIcon1.Init();
		chatIcon2.Init();

		chatText.alpha = 1;
		chatText.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black", TextureType.BACKGROUND);
		chatText.OnClick = OpenChat;
		btnChat.setNorAndActBG("button_chat_normal","button_chat_down");

		chatText1.txt = "";
		chatText2.txt = "";
		chatIcon1.mystyle.normal.background = null;	
		chatIcon2.mystyle.normal.background = null;	
		
		UpdateMessage();
	}
	
	public function UpdateMessage()
	{
		var tempArray:Array = (MenuMgr.getInstance().Chat as ChatMenu).generateMesForMainChrom();
		
		chatText1.txt = "";
		chatText2.txt = "";
		chatIcon1.mystyle.normal.background = null;	
		chatIcon2.mystyle.normal.background = null;					
						
		if(tempArray.length > 0)
		{
			chatText1.txt = (tempArray[0] as Hashtable)["message"];
			chatIcon1.mystyle.normal.background = getTextureByType((tempArray[0] as Hashtable)["type"] + "");
			if(((tempArray[0] as Hashtable)["type"] as String) == Constant.ChatType.CHAT_EXCEPTION)
			{
				chatText1.mystyle.normal.textColor = redColor;
			}
			else
			{
				chatText1.mystyle.normal.textColor = blackColor;
			}
		}

		if(tempArray.length > 1)
		{
			chatText2.txt = (tempArray[1] as Hashtable)["message"];
			chatIcon2.mystyle.normal.background = getTextureByType((tempArray[1] as Hashtable)["type"] + "");
			
			if(((tempArray[1] as Hashtable)["type"] as String) == Constant.ChatType.CHAT_EXCEPTION)
			{
				chatText2.mystyle.normal.textColor = redColor;
			}
			else
			{
				chatText2.mystyle.normal.textColor = blackColor;
			}
		}
	}
	
	public function OpenChat()
	{
		MenuMgr.getInstance().PushMenu("ChatMenu", null);
	}
	
	public function getTextureByType(_type:String):Texture2D
	{
		switch(_type)
		{
			case Constant.ChatType.CHAT_GLOBLE:
				return TextureGlobal;
			case Constant.ChatType.CHAT_WHISPER:
				return TextureWhisper;
			case Constant.ChatType.CHAT_ALLIANCE:
				return TextureAlliance;
			case Constant.ChatType.CHAT_ALCREQUEST:
				return TextureAlliance;
			case Constant.ChatType.CHAT_ALCRQANSWER:
				return TextureAlliance;
			case Constant.ChatType.CHAT_EXCEPTION:
				return null;
		}
	}  
	
	public function Update()
	{
		if((MenuMgr.getInstance().Chat as ChatMenu).whetherGetChat(false))
		{
			(MenuMgr.getInstance().Chat as ChatMenu).getChat(true);
		}
		
		g_curTime = GameMain.unixtime();
		if(g_curTime - g_countForChattext >= g_updateChatInterval)
		{
			g_countForChattext = g_curTime;
			
			if((MenuMgr.getInstance().Chat as ChatMenu).isNeedUpdateMes)
			{
				UpdateMessage();
			}
		}
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		chatText.Draw();
		chatText1.Draw();
		chatText2.Draw();
		chatIcon1.Draw();
		chatIcon2.Draw();
		btnChat.Draw();
		GUI.EndGroup();
	}
}