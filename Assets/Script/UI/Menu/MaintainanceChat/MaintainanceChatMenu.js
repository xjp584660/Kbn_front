class MaintainanceChatMenu extends KBNMenu
{
	public var clone_headMenu : MenuHead;
	public var g_headMenu:MenuHead;
	public var g_buttonSend:Button;
	public var g_messageTxt:InputBox;
	public var tempItem:ListItem;
	public var chat_ScrollView:ScrollView;	
	public var g_bgMiddleBodyTop:Label;
	public var g_bgBottom:Label;
	public var inputImply:Label;
	public var l_notice:Label;
	
	public var componentMove:ComposedUIObj;
	private var moveToYPosition:int;
	private var moveSpeed:int;
	private var maxStep:int = 5;
	private var OriginalYPosition:int;
	private var framePerMove:int = 2;
	private var isMoveComponent:boolean;
	private var isMoveUp:boolean = true;
	private var moveStep:int = 0;
//	private var count:int = 0;
	private var componentMoveIsTop:boolean = false;
	private var keyboardViewHeight:float = 0.0f;
	
	private var m_DataList:Array = new Array();
	private var g_MessageMaxNum = 30;
	private static var VIEW_HEIGHT:int = 650;
	private var m_TimeIntervalForGet:float = 0;
	private var m_TimeIntervalForAdd:float = 0;
	private static var INTERVAL:int = 10;
	
	private var androidChat:AndroidChat;
	
	function Init()
	{
		g_headMenu = GameObject.Instantiate(clone_headMenu);
		inputImply.Init();
		inputImply.txt = Datas.getArString("Common.MaxCharacters");
		chat_ScrollView.Init();
		
		g_messageTxt.ActiveClick = handleClickText;
		g_messageTxt.Guid = Constant.InputBoxGuid.MAINTAINANCECHAT_INPUT;
		g_messageTxt.OnOutInputBox = InputBoxKeyboard_OnOut;
		g_messageTxt.SetInputBoxMaxChars(Constant.ChatMaxLength);
		g_messageTxt.Init();
		g_bgMiddleBodyTop.Init();
		g_bgBottom.Init();
		l_notice.Init();
		l_notice.txt = Datas.getArString("MaintenanceChat.ChatBanner");
		g_headMenu.Init();
		g_headMenu.setPaymentContentsVisible(false);
		g_headMenu.backTile.rect.height = 85;
		if(RuntimePlatform.Android == Application.platform)
			moveSpeed = _Global.CalculateKeyboardSpeed(maxStep);
		
		OriginalYPosition = 960 - componentMove.rect.height + 5;
	
		g_bgMiddleBodyTop.useTile = false;
//		g_bgMiddleBodyTop.tile.spt = TextureMgr.instance().BackgroundSpt();
		g_bgMiddleBodyTop.mystyle.normal.background = TextureMgr.instance().LoadTexture("frame_metal_top",TextureType.DECORATION);
		g_bgMiddleBodyTop.mystyle.border = new RectOffset(27, 27, 0, 0);
		
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottom");
	//	bgMiddleBodyPic.spt = TextureMgr.instance().BackgroundSpt();
		//bgMiddleBodyPic.name = "ui_paper_bottom";
		//bgMiddleBodyPic.rect = bgMiddleBodyPic.spt.GetTileRect("ui_paper_bottom");
		repeatTimes = (rect.height - 1) / bgMiddleBodyPic.rect.height + 1;
		
		//bgMiddleBodyPic.spt.edge = 2;
		
		g_bgBottom.useTile = false;
//		g_bgBottom.tile.spt = TextureMgr.instance().BackgroundSpt();
//		g_bgBottom.tile.name = "small_bar_bottom";	
//		g_bgBottom.drawTileByGraphics = true;
		g_bgBottom.setBackground("small_bar_bottom",TextureType.BACKGROUND);
		g_buttonSend.OnClick = handleBtnSend;
		g_buttonSend.txt = Datas.getArString("Common.Send_button");
		
		androidChat = new AndroidChat();
		androidChat.OnBackKey = OnBackKey;
		androidChat.sendChat = this.AndroidSendChat;
		androidChat.SetChatHistoryHeight = this.SetChatHistoryHeight;
		androidChat.GetViewY = this.GetViewY;
		androidChat.GetViewHeight = this.GetViewHeight;
		androidChat.TargetMenu = this;
		androidChat.CanShowBar = CanShowBar;
		androidChat.CanShowPlus = CanShowPlus;
		androidChat.OnInit();
	}
	private function CanShowPlus():boolean
	{
		return false;
	}
	private function OnBackKey()
	{
		androidChat.ShowChatBar("MaintainanceChatMenu");
	}
	private function CanShowBar(topMenuName:String):boolean
	{
		return topMenuName.Equals(this.menuName);
	}
	
	public function GetViewY():int
	{
		return chat_ScrollView.rect.y;
	}
	
	public function GetViewHeight():int
	{
		return VIEW_HEIGHT;
	}
	
	private function SetChatHistoryHeight(height:int)
	{
		chat_ScrollView.rect.height = height;
		chat_ScrollView.AutoLayout();
		chat_ScrollView.MoveToBottom();	
	}	
	
	function DrawItem() 
	{
		l_notice.Draw();
		chat_ScrollView.Draw();
		
		if(RuntimePlatform.Android != Application.platform)	
		{
			componentMove.Draw();
			inputImply.Draw();
		}
	}
	
	function DrawBackground()
	{
		if(Event.current.type != EventType.Repaint)
		{
			return;
		}
		
		DrawMiddleBg();
		g_bgMiddleBodyTop.Draw();
	}
	
	function DrawTitle()
	{
		g_headMenu.Draw();
	}
	
	private function handleClickText():void
	{
		if(RuntimePlatform.Android == Application.platform)
		{
			isMoveUp = true;
			isMoveComponent = true;
		}

	}

	private	var seeed:HashObject;
	private	var chatLimitLv:int;
	private	var playerLv:int;
	
	public function Update()
	{
		g_headMenu.Update();
		m_TimeIntervalForAdd += Time.deltaTime;
		m_TimeIntervalForGet += Time.deltaTime;
		if(m_TimeIntervalForAdd >= 0.2)
		{
			m_TimeIntervalForAdd = 0;
			addComponentForScrollView();
		}
		
		if(m_TimeIntervalForGet >= INTERVAL)
		{
			m_TimeIntervalForGet = 0;
			MaintenanceChat.getInstance().reqGetMaintenanceChat(SuccessGetChat);
		}
		
		chat_ScrollView.Update();
		
		if(isMoveComponent && Application.platform != RuntimePlatform.Android)
		{
			moveBottomUpAndDown();
		}
		
		if(g_messageTxt.OnFocus || g_messageTxt.GetText() != "")
		{
			inputImply.visible = false;
		}
		else
		{
			inputImply.visible = true;
		}

		seeed=seeed==null?GameMain.instance().getSeed():seeed;
		chatLimitLv=seeed==null?0:_Global.INT32(seeed["chatLimitLevel"]);
		playerLv=GameMain.instance().getPlayerLevel();
		if (playerLv>=chatLimitLv) {
			inputImply.txt = Datas.getArString("Common.MaxCharacters");
			g_buttonSend.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
			g_buttonSend.mystyle.active.background=TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
			g_buttonSend.OnClick = handleBtnSend;
			
		}else{
			inputImply.txt = Datas.getArString("Error.err_1202",[chatLimitLv.ToString()]);
			g_buttonSend.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
			g_buttonSend.mystyle.active.background=TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
			g_buttonSend.OnClick = null;
		}
	}
	
	public function OnPush(param:Object)
	{
		g_headMenu.setTitle(Datas.getArString("MantenanceChat.ChatTitle"));
		g_headMenu.btn_back.SetVisible(false);
		resetBottomOriginalPos();
		MaintenanceChat.getInstance().reqGetMaintenanceChat(SuccessGetChat);
		androidChat.ShowChatBar("MaintainanceChatMenu");
	}
	public function OnBackButton():boolean
	{
		
		androidChat.ShowChatBar("MaintainanceChatMenu");

		return true;
	}
	
	private function moveBottomUpAndDown():void
	{
		if(isMoveUp)
		{
			moveStep++;
			
			if(moveStep > maxStep)
			{
				isMoveComponent = false;
				isMoveUp = false;
				componentMoveIsTop = true;
				//show inputbox
				var inputrect:Rect = RealInputRect();
				g_messageTxt.ChangeInputBoxAt(inputrect.x,inputrect.y,inputrect.width,inputrect.height);
			}
			else
			{
				chat_ScrollView.rect.height -= moveSpeed;
				chat_ScrollView.AutoLayout();
				chat_ScrollView.MoveToBottom();						
				componentMoveIsTop = false;
				componentMove.rect.y -= moveSpeed;
			}
		}
		else
		{
			moveStep--;
			componentMoveIsTop = false;
			if(moveStep <= 0)
			{
				isMoveComponent = false;
				isMoveUp = true;
				resetBottomOriginalPos();
			}
			else
			{
				chat_ScrollView.rect.height += moveSpeed;
				chat_ScrollView.AutoLayout();
				chat_ScrollView.MoveToBottom();
				componentMove.rect.y += moveSpeed;
			}			
		}
	}
	//not unity rect
	private function RealInputRect():Rect
	{
		var x:float = componentMove.rect.x + g_messageTxt.rect.x + 10;
		var y:float = componentMove.rect.y + g_messageTxt.rect.y + 15;
		var w:float = g_messageTxt.rect.width - 20;
		var h:float = g_messageTxt.rect.height;
		return _Global.UnitySizeToReal(new Rect(x,y,w,h));
	}
	
	private function handleBtnSend()
	{
		if(isMoveComponent == false)
		{
			SendChat();
		}
	}
	
	
	public function AndroidSendChat(s:String)
	{
		androidChat.TempString = s;
		SendChat();
	}
	
	public function SendChat():void
	{
	
		var sendMessage:String = g_messageTxt.GetText();

		if (sendMessage == null) return;

  		if(RuntimePlatform.Android == Application.platform)
 			sendMessage = androidChat.TempString;

  		g_messageTxt.SetText("");
 
 		androidChat.SetText("");
 
 		sendMessage = sendMessage.Trim();
 	
 		if (Application.platform == RuntimePlatform.OSXEditor) 
 		{
 	
			sendMessage = "Test chat message " + _Global.DateTime(GameMain.unixtime());
		}
 		if(sendMessage.Length < 1)
 		{

 			return;
 		}

 		MaintenanceChat.getInstance().reqSendMaintenanceChat(sendMessage,SuccessSendChat);
 
	}
	
	private function ConvertToNewChatItem(data : HashObject) : Hashtable
	{
		var avatar : String = _Global.GetString(data["portraitname"]);
		var t : Hashtable = {
			"chatId"		: _Global.GetString(data["chatId"]),
			"username"		: _Global.GetString(data["author"]),
			"message"		: _Global.GetString(data["content"]),
			"avatar"		: (String.IsNullOrEmpty(avatar) ? "1001" : avatar),
			"badge"			: _Global.GetString(data["badge"]),
			"time"			: _Global.GetString(data["time"]),
			"isMe"			: (_Global.GetString(data["author"]) == MaintenanceChat.getInstance().getAuthor()).ToString(),
			"type"			: Constant.ChatType.CHAT_GLOBLE
		};
		return t;
	}
	
	public function SuccessGetChat(data:HashObject):void
	{
		if(_Global.GetString(data["maintenanceOver"]) != "0")
		{
			ErrorMgr.instance().PushError("",Datas.getArString("MaintenanceChat.GameRestartPrompt"),false, Datas.getArString("FTE.Restart"),restartGame);
		}
		INTERVAL = _Global.INT32(data["interval"]);
		var newList:Array = _Global.GetObjectValues(data["entry"]);
		for(var i:int=0;i<newList.length;i++)
		{
//			if(m_DataList.length >= g_MessageMaxNum)
//			{
//				m_DataList.Shift();
//			}
			m_DataList.Push(ConvertToNewChatItem(newList[i]));
		}
	}
	
	public function restartGame():void
	{
		PopupMgr.getInstance().clearCurPopInfor();
		PopupMgr.getInstance().setMaintanceFlag(false);
		GameMain.instance().restartGame();
	}
	
	public function SuccessSendChat():void
	{
		
	}
	
	public function addComponentForScrollView()
	{
		var a:int = 0;
		var item:Object;
		var itemObject:ListItem;
		var dObj:UIObject;
		
		if(m_DataList.length > 0)
		{
			item = m_DataList.shift();
			if(chat_ScrollView.numUIObject >= g_MessageMaxNum)
			{
				dObj = chat_ScrollView.shiftUIObject();	
			}
			itemObject = Instantiate(tempItem);
			itemObject.SetRowData(item);
			chat_ScrollView.addUIObject(itemObject);
			ChatMenu.InsertTimeSeparator(chat_ScrollView);
			chat_ScrollView.AutoLayout();
			chat_ScrollView.MoveToBottom();
		}
		
		if( dObj )
		{
			TryDestroy(dObj);
		}
	}
	
	public function setMoveSpeed(keyboardHeight:float)
	{
		moveSpeed = keyboardHeight/maxStep;
		if(componentMoveIsTop == false)
		{
			isMoveUp = true;
			isMoveComponent = true;
		}
		AdjustInputLayout_AfterInputModeChanged(keyboardHeight);
		keyboardViewHeight = keyboardHeight;
	}
	
	public function AdjustInputLayout_AfterInputModeChanged(keyboardHeight:float):void
	{
		var sub:float = keyboardHeight - keyboardViewHeight;
		if(g_messageTxt.OnFocus && keyboardViewHeight > 0 && componentMoveIsTop == true && componentMove.rect.y < OriginalYPosition)
		{
			componentMove.rect.y = componentMove.rect.y - sub;
			chat_ScrollView.rect.height = chat_ScrollView.rect.height - sub;
			chat_ScrollView.AutoLayout();
			chat_ScrollView.MoveToBottom();
			var inputrect:Rect = RealInputRect();
			g_messageTxt.ChangeInputBoxAt(inputrect.x,inputrect.y,inputrect.width,inputrect.height);
		}
	}
	
	private function resetBottomOriginalPos():void
	{
		componentMoveIsTop = false;
		isMoveComponent = false;
		isMoveUp = true;
		moveStep = 0;
		
		componentMove.rect.y = OriginalYPosition;
		chat_ScrollView.rect.height = VIEW_HEIGHT;	
		
		chat_ScrollView.AutoLayout();			
		chat_ScrollView.MoveToBottom();
	}
	
	public function InputBoxKeyboard_OnOut()
	{
		resetBottomOriginalPos();
		g_messageTxt.Done();
	}
	
	public function Hide()
	{
		isMoveComponent = true;
		isMoveUp = false;
		g_messageTxt.Done();
	}
	
	public function Return()
	{
		g_messageTxt.Done();
	}
}
