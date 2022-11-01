class MessageItem extends ListItem
{
	public var userName:Label;
	public var message:Label;
	public var time:Label;
	public var iconType:Label;
	public var alliance:Label;
	public var helpBg:Label;
	public var helpBtn:Button;
	
	public var answerBtn:Button;
	public var btnUserInfo:Button;
	
	public var iconRules:Label;
	public var chatRules:Label;
	public var bgChatRules:Label;
	public var btnBackground:Button;
	
	public var mystyle:GUIStyle;
	public var picGlobal:Texture2D;
	public var picAlliance:Texture2D;
	public var picWhisper:Texture2D;
	private var picChancellor:Texture2D;
	private var picViceChancellor:Texture2D;
	private var picMVP : Texture2D;
	
	private var allianceName:String;
	private var allianceId:int;
	private var userId:int;
	private var chatUserName:String;
	private var chatType:String;

	//green
	private var colorSelfName:Color = new Color(0, 0.337, 0.129, 1); // #005621ff
	private var colorSelfMessage:Color = new Color(0.286 , 0.416, 0.004, 1); // #736a01ff
	
	//origine
	private var colorWhisperName:Color = new Color(0.929 , 0.322, 0, 1);// #ed5200ff
	private var colorWhisperMessage:Color = new Color(0.929 , 0.459, 0.122,1);// #ed751fff
	
	//brown
	private var colorOtherName:Color = new Color(0.510, 0.263, 0, 1);// #824300ff
	private var colorOtherMessage:Color = new Color(0.505f, 0.317f, 0.110f, 1.0f);// #916315ff
	
	private static var colorRequest:Color = _Global.RGB(132,40,40); // #842828ff
	//gray
	private var colorNoUser:Color = new Color(0.49, 0.49, 0.49, 1);// #7d7d7dff
	public var colorException:Color;
	
	private var g_isChatRules:boolean;	
	private var g_isAllianceRequest:boolean;
	private var g_isException:boolean;
	private var canClickChatItem:boolean;
	private var isDisplayAllianceName:boolean;

	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		if(g_isChatRules)
		{
			bgChatRules.Draw();
			iconRules.Draw();
			chatRules.Draw();
		}
		else
		{

	 		if(isDisplayAllianceName)
	 		{		
	 			alliance.Draw();
	 		}
	 		
			helpBg.Draw();
			helpBtn.Draw();
			
			userName.Draw(); 
			time.Draw();
	 		message.Draw();	
	 		if(g_isAllianceRequest)
			{
				answerBtn.Draw();
				btnUserInfo.Draw();
			}
			else
			{
				btnBackground.Draw();
			}
			
	 		if(!g_isException)
	 		{
	 			iconType.Draw();
	 		}			
			
		}
		
		GUI.EndGroup();
	}
	public function get type():String
	{
		return chatType;
	}
	
	public function get uid():int
	{
		return userId;
	}
	
	private function handleClick():void
	{
		if(!canClickChatItem) return;
		
		var userInfo = new UserDetailInfo();
		userInfo.userId = "" + userId;
		userInfo.userName = chatUserName;
		userInfo.allianceId = "" + allianceId;
 		userInfo.viewFrom = UserDetailInfo.ViewFromChat;
 		MenuMgr.getInstance().PushMenu("PlayerProfile", userInfo, "trans_zoomComp");
	}
	
	private var helpInfor:Hashtable;
	private function handleHelp():void
	{
		var params:Array = new Array();
		
 		params.Add(helpInfor["inviterId"]);
 		params.Add(helpInfor["cityId"]);
 		params.Add(helpInfor["type"]);
 		params.Add(helpInfor["dataId"]);
 		params.Add(helpInfor["dataLv"]);
 		params.Add(helpInfor["dataType"]);

		var canGiveHelp:Function = function(result:HashObject)
		{
	 		if(result["ok"].Value)
	 		{
                SetHelpButtonEnabled(false);
				MenuMgr.getInstance().Chat.giveHelpSuccess(helpInfor);
	 		}
	 	};
	 	
        var cannotGiveHelp : Function = function(errorMsg : String, errorCode : String) {
            if (errorCode == "1901") { // Already offered help
                SetHelpButtonEnabled(false);
            }
            var localizedErrorMsg : String = UnityNet.localError(errorCode, errorMsg, String.Empty);
            if(errorMsg != null) {
                ErrorMgr.instance().PushError("",localizedErrorMsg);
            }
        };
	 	UnityNet.reqGiveHelp(params, canGiveHelp, cannotGiveHelp);			
	}
	
	public function SetRowData(data:Object):void
	{
//		var arString:Object = Datas.instance().arStrings();
		var textMgr : TextureMgr = TextureMgr.instance();
		picChancellor = textMgr.LoadTexture("icon_Chancellors", TextureType.ICON);
		picViceChancellor = textMgr.LoadTexture("icon_Vice_Chancellors", TextureType.ICON);
		picMVP = textMgr.LoadTexture("mvp", TextureType.ICON);	
		helpBg.setBackground("chat_help_DialogBox", TextureType.DECORATION);

		var selfUserId:int = Datas.instance().tvuid();
		var _height:float;
		var rectAlliance:Vector2;
		var _data:Hashtable =  data as Hashtable;
		btnBackground.OnClick = handleClick;
		btnUserInfo.OnClick = handleClick;
		
		btnBackground.hasOnlyDownBackground(true);
		
		g_isChatRules = false;
		g_isException = false;
		g_isAllianceRequest = false;
		isDisplayAllianceName = false;
		
		if(_data["userid"])
		{
			userId = _Global.INT32(_data["userid"]);
		}
		
		if(_data["username"])
		{
			chatUserName = _data["username"];		
		}
		
		if(_data["allianceID"] 
			|| !String.IsNullOrEmpty(_Global.GetString(_data["allianceName"]))
			)
		{
			allianceId = _Global.INT32(_data["allianceID"]);	
			
			if(_data["allianceName"] != "")
			{
				alliance.txt = _data["allianceName"] + "";
				isDisplayAllianceName = true;
			}
			else
			{
				isDisplayAllianceName = false;
			}
		}
		else
		{
			isDisplayAllianceName = false;
		}
		
		helpBtn.SetVisible(false);
		helpBg.SetVisible(false);
		message.rect.x = 70;
		message.rect.width = 485;
		
		var isHelpConfirm:boolean = false;
		chatType = _data["type"];
		if(_data["additionalInfo"] == Constant.ChatType.CHAT_ALCRQANSWER)
		{
			chatType = Constant.ChatType.CHAT_ALCRQANSWER;
		}

		answerBtn.SetVisible(false);

		switch(chatType)
		{
			case Constant.ChatType.CHAT_ALCRQANSWER:
				userName.txt = Datas.getArString("Common.Alliance");// _data["username"];
				time.txt = _data["time"];
				message.txt = _data["message"];
				changeIconForAlliance(_data["title"], _data["isMVP"]);
				canClickChatItem = true;
				
				if (userId != selfUserId) {
					changeTextColor("#842828ff", "#842828ff");
				} else {
					changeTextColor("#005621ff", "#736a01ff");
				}
				answerBtn.SetVisible(false);
				isDisplayAllianceName = false;
				alliance.txt =  "";// "Resource Request";
				//todo strings
				
				answerBtn.OnClick = function(){
				};
				break;
			case Constant.ChatType.CHAT_ALCREQUEST:
				g_isAllianceRequest = true;
				userName.txt = _data["username"];
				time.txt = _data["time"];
				message.txt = _data["message"];
				message.rect.width = 420;
				changeIconForAlliance(_data["title"], _data["isMVP"]);
				canClickChatItem = true;
				
				if(userId != selfUserId) {
					changeTextColor("#842828ff", "#842828ff");		
				} else {
					changeTextColor("#005621ff", "#736a01ff");
				}
				answerBtn.SetVisible(true);
				isDisplayAllianceName = true;
				if(_Global.INT32(_data["requestType"]) == Constant.AllianceRequestType.RESOURCE)
				{
					alliance.txt = Datas.getArString("Alliance.ResourceRequest");
				}
				else if(_Global.INT32(_data["requestType"]) == Constant.AllianceRequestType.REINFORCE)//Caisen 2014.8.18 start
				{
					alliance.txt = Datas.getArString("Alliance.ReinforceRequest");
				}
				else
				{
					alliance.txt = Datas.getArString("Alliance.MarchRequest");
				}//Caisen 2014.8.18 end
				//todo strings
				
				answerBtn.OnClick = function(){
					var x:int = _Global.INT32(_data["requestX"]);
					var y:int = _Global.INT32(_data["requestY"]);
					var requestId:int = _Global.INT64(_data["requestId"]);
					
					if(_data["requestType"] != null && _Global.INT32(_data["requestType"]) == Constant.AllianceRequestType.RESOURCE)
					{
						//resource
						//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":x, "y":y, "type":Constant.MarchType.TRANSPORT,"requestUser":_data["username"],"requestId":requestId,"res":_data["res"],"resArr":_data["resArr"]},"trans_zoomComp");
						MarchDataManager.instance().SetData({"x":x, "y":y, "type":Constant.MarchType.TRANSPORT,"requestUser":_data["username"],"requestId":requestId,"res":_data["res"],"resArr":_data["resArr"]});
					}
					else
					{
						//refinforce
						//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":x, "y":y, "type":Constant.MarchType.REINFORCE,"requestUser":_data["username"],"requestId":requestId},"trans_zoomComp");
						MarchDataManager.instance().SetData({"x":x, "y":y, "type":Constant.MarchType.REINFORCE,"requestUser":_data["username"],"requestId":requestId});
					}
				};
				break;
			case Constant.ChatType.HELP_FOUNDER_INITIATE:
				helpBg.SetVisible(true);
				canClickChatItem = false;
				message.rect.x = 100;
				userName.txt = _data["username"];
				message.txt = _data["message"];
				time.txt = _data["time"];
				iconType.mystyle.normal.background = picAlliance;
				message.mystyle.normal.textColor = colorSelfMessage;
				break;
                
            // Deleted case: Constant.ChatType.HELP_FOUNDER_FEEDBACK

			case Constant.ChatType.HELP_HELPER_CONFIRM:
				helpBtn.SetVisible(true);
				helpBg.SetVisible(true);
				message.rect.x = 100;
				message.rect.width = 300;
				isHelpConfirm = true;
				canClickChatItem = false;
				helpInfor = _data["data"];
				userName.txt = helpInfor["inviterName"];
				
				var _name:String;
				if(helpInfor["type"] == "1")
				{
					_name = Datas.getArString("buildingName.b" + helpInfor["dataType"]);
					message.txt = Datas.getArString("AllianceHelp.PleaseHelpMe", [helpInfor["dataLv"], Datas.getArString("buildingName.b" + helpInfor["dataType"])]);
				}
				else if(helpInfor["type"] == "2") 
				{
					_name = Datas.getArString("techName.t" + helpInfor["dataType"]);
					message.txt = Datas.getArString("AllianceHelp.PleaseHelpMe", [helpInfor["dataLv"], Datas.getArString("techName.t" + helpInfor["dataType"])]);
				}
				
				time.txt = _data["time"];
				helpBtn.OnClick = handleHelp;
				helpBtn.txt = Datas.getArString("Common.Help");
				iconType.mystyle.normal.background = picAlliance;
				message.mystyle.normal.textColor = colorSelfMessage;
				break;
                
            // Deleted case: Constant.ChatType.HELP_HELPER_FEEDBACK

			case Constant.ChatType.CHAT_RULE:
				FontMgr.SetStyleFont(mystyle, FontSize.Font_18,FontType.TREBUC);
				mystyle.wordWrap = true;		
			
				g_isChatRules = true;
				
				iconRules.rect = new Rect(30, 0, 118, 119);
				iconRules.useTile = true;
				iconRules.tile = TextureMgr.instance().ElseIconSpt().GetTile("ui_chat_npc");
				//iconRules.tile.name = "ui_chat_npc";
				
				chatRules.txt = Datas.getArString("Chat.ChatRules") + ":" + Datas.getArString("Chat.Rules"); 
				chatRules.mystyle.normal.textColor = colorOtherName;
//				chatRules.txt = "<color=#824300ff>" + chatRules.txt + "</color>";
				
				chatRules.SetFont(FontSize.Font_18);
				_height = chatRules.mystyle.CalcHeight(GUIContent(chatRules.txt), chatRules.rect.width);				
				chatRules.rect.height = _height;
				
				if(iconRules.rect.height >= _height)
				{
					bgChatRules.rect.height = iconRules.rect.height;
					rect.height = iconRules.rect.height;
					chatRules.rect.y = 	(iconRules.rect.height - _height) / 2;		
				}
				else
				{
					bgChatRules.rect.height = _height;
					rect.height = _height;
					iconRules.rect.y = 	(_height - iconRules.rect.height) / 2;			
				}
				
				isDisplayAllianceName = false;
				return;
			case Constant.ChatType.CHAT_AWARD:
				
				FontMgr.SetStyleFont(mystyle, FontSize.Font_18,FontType.TREBUC);
				mystyle.wordWrap = true;		
			
				g_isChatRules = true;
				
				iconRules.rect = new Rect(38, 5, 100, 100);
				iconRules.useTile = true;
				iconRules.tile = TextureMgr.instance().ElseIconSpt().GetTile(Datas.instance().getImageName(_data["itemId"]));
				//iconRules.tile.name = Datas.instance().getImageName(_data["itemId"]);
				
				chatRules.SetFont(FontSize.Font_18);
				chatRules.txt = _data["message"]; 
				chatRules.mystyle.normal.textColor = colorException;
				
				_height = chatRules.mystyle.CalcHeight(GUIContent(chatRules.txt), chatRules.rect.width);
				chatRules.rect.height = _height;
				
				if(iconRules.rect.height >= _height)
				{
					bgChatRules.rect.height = iconRules.rect.height;
					rect.height = iconRules.rect.height + 10;
					chatRules.rect.y = 	(iconRules.rect.height - _height) / 2;		
				}
				else
				{
					bgChatRules.rect.height = _height;
					rect.height = _height;
					iconRules.rect.y = 	(_height - iconRules.rect.height) / 2;			
				}
				
				isDisplayAllianceName = false;
				return;
			case Constant.ChatType.CHAT_NOT_ONLINE:
			case Constant.ChatType.CHAT_NO_USER:
				userName.txt = _data["username"];
				time.txt = "";

				if (chatType.Equals(Constant.ChatType.CHAT_NOT_ONLINE))		
					message.txt = _data["to"] + " " + Datas.getArString("Chat.NotOnline");
				else if (chatType.Equals(Constant.ChatType.CHAT_NO_USER))
					message.txt = _data["to"] + " " + Datas.getArString("Chat.UserNotExist");
				
				canClickChatItem = false;
				isDisplayAllianceName = false;	
					
				iconType.mystyle.normal.background = picWhisper;
		        userName.mystyle.normal.textColor = colorNoUser;
				message.mystyle.normal.textColor = colorNoUser;
				time.mystyle.normal.textColor = colorNoUser;
				//alliance.mystyle.normal.textColor = colorNoUser;
							
				break;
			case Constant.ChatType.CHAT_EXCEPTION:
				g_isException = true;
				canClickChatItem = false;
				isDisplayAllianceName = false;
				
				time.txt = _data["time"];
				userName.txt = _data["username"];
				message.txt = _data["message"];	
					
				userName.mystyle.normal.textColor = colorException;
				message.mystyle.normal.textColor = colorException;										
				break;
			case Constant.ChatType.CHAT_GLOBLE:
				userName.txt = _data["username"];
				time.txt = _data["time"];
				message.txt = _data["message"];
				
				iconType.mystyle.normal.background = picGlobal;
				
				if(userId != selfUserId)
				{
//					userName.txt = "<color=#824300ff>" + userName.txt + "</color>";
//					time.txt = "<color=#824300ff>" + time.txt + "</color>";
//					message.txt = "<color=#916315ff>" + message.txt + "</color>";
					
					userName.mystyle.normal.textColor = colorOtherName;
					message.mystyle.normal.textColor = colorOtherMessage;
					time.mystyle.normal.textColor = colorOtherName;			
					//alliance.mystyle.normal.textColor = colorOtherName;
					canClickChatItem = true;			
				}
				else
				{
//					userName.txt = "<color=#005621ff>" + userName.txt + "</color>";
//					message.txt =  "<color=#736a01ff>" + message.txt + "</color>";
//					time.txt = "<color=#005621ff>" + time.txt + "</color>";
					userName.mystyle.normal.textColor = colorSelfName;
					message.mystyle.normal.textColor = colorSelfMessage;
					time.mystyle.normal.textColor = colorSelfName;
					//alliance.mystyle.normal.textColor = colorSelfName;
					canClickChatItem = false;
				}
																
				break;
			case Constant.ChatType.CHAT_WHISPER:
				userName.txt = _data["username"] + " [" + Datas.getArString("Common.WhisperTo") + " " + _data["to"] + "]";
				
				time.txt = _data["time"];
				message.txt = _data["message"];
				
				iconType.mystyle.normal.background = picWhisper;
//				userName.txt = "<color=#ed5200ff>" + userName.txt + "</color>";
//				time.txt = "<color=#ed5200ff>" + time.txt + "</color>";
//				message.txt = "<color=#ed751fff>" + message.txt + "</color>";
				
				userName.mystyle.normal.textColor = colorWhisperName;
				message.mystyle.normal.textColor = colorWhisperMessage;
				time.mystyle.normal.textColor = colorWhisperName;
				//alliance.mystyle.normal.textColor = colorWhisperName;				
				
				
				if(userId == selfUserId)
				{
					canClickChatItem = false;
				}
				else
				{
					canClickChatItem = true;
				}				
				
				break;
			case Constant.ChatType.CHAT_ALLIANCE:
			case Constant.ChatType.CHAT_ALLIANCE_OFFICER:
				isDisplayAllianceName = false;
				userName.txt = _data["username"];
				time.txt = _data["time"];
				message.txt = _data["message"];

				changeIconForAlliance(_data["title"], _data["isMVP"]==null?false:_data["isMVP"]);
				
				if(userId != selfUserId)
				{
//					userName.txt = "<color=#824300ff>" + userName.txt + "</color>";
//					time.txt = "<color=#824300ff>" + time.txt + "</color>";
//					message.txt = "<color=#916315ff>" + message.txt + "</color>";
					userName.mystyle.normal.textColor = colorOtherName;
					message.mystyle.normal.textColor = colorOtherMessage;
					time.mystyle.normal.textColor = colorOtherName;			
					//alliance.mystyle.normal.textColor = colorOtherName;	
					canClickChatItem = true;		
				}
				else
				{
//					userName.txt = "<color=#005621ff>" + userName.txt + "</color>";
//					message.txt =  "<color=#736a01ff>" + message.txt + "</color>";
//					time.txt = "<color=#005621ff>" + time.txt + "</color>";
					userName.mystyle.normal.textColor = colorSelfName;
					message.mystyle.normal.textColor = colorSelfMessage;
					time.mystyle.normal.textColor = colorSelfName;
					//alliance.mystyle.normal.textColor = colorSelfName;
					canClickChatItem = false;		
				}				
							
				break;	
				
			case Constant.ChatType.CHAT_PRIVATE_ONE2ONE:
				userName.txt = _data["username"];
				time.txt = _data["time"];
				message.txt = _data["message"];
				
				iconType.mystyle.normal.background = picWhisper;
				if(userId != selfUserId)
				{
//					userName.txt = "<color=#824300ff>" + userName.txt + "</color>";
//					time.txt = "<color=#824300ff>" + time.txt + "</color>";
//					message.txt = "<color=#916315ff>" + message.txt + "</color>";
					userName.mystyle.normal.textColor = colorOtherName;
					message.mystyle.normal.textColor = colorOtherMessage;
					time.mystyle.normal.textColor = colorOtherName;			
					canClickChatItem = true;			
				}
				else
				{
//					userName.txt = "<color=#005621ff>" + userName.txt + "</color>";
//					message.txt =  "<color=#736a01ff>" + message.txt + "</color>";
//					time.txt = "<color=#005621ff>" + time.txt + "</color>";
					userName.mystyle.normal.textColor = colorSelfName;
					message.mystyle.normal.textColor = colorSelfMessage;
					time.mystyle.normal.textColor = colorSelfName;
					canClickChatItem = false;
				}
																
				break;						
		}
			
		FontMgr.SetStyleFont(mystyle, FontSize.Font_20,FontType.TREBUC);
		mystyle.wordWrap = true;  
		
		userName.SetFont();
		alliance.SetFont();
		time.SetFont();
		message.SetFont(FontSize.Font_18);
		
		userName.rect.width = 280;
		if(isDisplayAllianceName)
		{
			if (chatType == Constant.ChatType.CHAT_WHISPER)
			{
				var Width:float = userName.rect.width;
				if (_Global.GUICalcWidth(mystyle, userName.txt) > Width)
				{
					var comeFromUserName:String = _Global.GetString(_data["username"]);
					var whisperToText:String = " [" + Datas.getArString("Common.WhisperTo") + " " + _data["to"] + "]";
					var whisperToTextRect:Vector2 = mystyle.CalcSize(GUIContent(whisperToText));
				
					var EndText:String = "...";
					Width -= _Global.GUICalcWidth(mystyle, EndText);
					Width -= whisperToTextRect.x;
					
					comeFromUserName = _Global.GUIClipToWidth(mystyle, comeFromUserName, Width) + EndText;
					userName.txt = comeFromUserName + whisperToText;
				}
			}
			else
			{
				userName.ClipText();
			}
			alliance.ClipText();
			
			_height = userName.mystyle.CalcHeight(GUIContent(userName.txt + alliance.txt), Screen.width); 
			rectAlliance = alliance.mystyle.CalcSize(GUIContent(alliance.txt));
			
			var timeRect:Vector2 = time.mystyle.CalcSize(GUIContent(time.txt));
			alliance.rect = new Rect(time.rect.xMax - timeRect.x - rectAlliance.x - 10, alliance.rect.y,
										rectAlliance.x + 8,  rectAlliance.y); 
									 
			// LiHaojie: adjust the rect in private chat 
			if (chatType == Constant.ChatType.CHAT_PRIVATE_ONE2ONE)
			{
				timeRect = time.mystyle.CalcSize(GUIContent(time.txt));
				alliance.rect = new Rect(time.rect.xMax - timeRect.x - rectAlliance.x - 10, alliance.rect.y,
										rectAlliance.x + 8,  rectAlliance.y); 
			}
		}
		else
		{
			if (chatType == Constant.ChatType.CHAT_WHISPER)
			{
				userName.rect.width = 440;
			}
			
			userName.ClipText();
			alliance.ClipText();
			_height = userName.mystyle.CalcHeight(GUIContent(userName.txt), Screen.width);
		}
		
		userName.rect.height = _height;
		message.rect.y = userName.rect.y + userName.rect.height + 15;		
		helpBg.rect.y = message.rect.y - 10;
		
		FontMgr.SetStyleFont(mystyle, FontSize.Font_18,FontType.TREBUC);
		mystyle.wordWrap = true;		
		
		_height = message.mystyle.CalcHeight(GUIContent(message.txt), message.rect.width);
		message.rect.height = _height + 10; 

		if(isHelpConfirm && message.rect.height < 70)
		{
			message.rect.height = 70;
		} 
		
		helpBg.rect.height = message.rect.height + 10;
		if (helpBg.isVisible())
		{
			rect.height = message.rect.yMax + 10;
			btnBackground.rect.height = rect.height;
		}
		else
		{
			rect.height = message.rect.yMax;
			btnBackground.rect.height = rect.height;
		} 
	}
	
	public function changeIconForAlliance(title:int, isMVP : boolean):void
	{
		var tex : Texture2D = null;
		if ( isMVP )
		{
			tex = picMVP;
		}
		else if(title == Constant.Alliance.Chancellor)
		{
			tex = picChancellor;
		}
		else if(title == Constant.Alliance.ViceChancellor)
		{
			tex = picViceChancellor;
		}
		else
		{
			tex = picAlliance;
		}
		iconType.mystyle.normal.background = tex;
	}
	protected function changeTextColor(colorName:String, colorMessage:String) 
	{
//		userName.txt = "<color=" + colorName + ">" + userName.txt + "</color>";
//		message.txt = "<color=" + colorMessage + ">" + message.txt + "</color>";
//		time.txt = "<color=" + colorName + ">" + time.txt + "</color>"; 

		// Convert the hex color string to UnityEngine.Color
		userName.mystyle.normal.textColor = Constant.ColorValue.FromHTMLHexString(colorName);
		message.mystyle.normal.textColor = Constant.ColorValue.FromHTMLHexString(colorMessage);
		time.mystyle.normal.textColor = Constant.ColorValue.FromHTMLHexString(colorName);
	}

    
    protected function SetHelpButtonEnabled(enabled : boolean) {
        helpBtn.SetDisabled(!enabled);
        var btnColor : String = enabled ? "Brown" : "Gray";
            helpBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture(String.Format("button_ChatHelp_{0}_normal", btnColor), TextureType.BUTTON);
            helpBtn.mystyle.active.background = TextureMgr.instance().LoadTexture(String.Format("button_ChatHelp_{0}_down", btnColor), TextureType.BUTTON);
    }
}
