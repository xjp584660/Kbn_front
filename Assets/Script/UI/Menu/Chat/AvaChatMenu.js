import System.Linq;

class AvaChatMenu extends KBN.AvaChatMenu  
{
	public var IgnoredUsers:Object;// = new Object();

	public var clone_headMenu : MenuHead;
	public var g_headMenu:MenuHead;
	public var g_buttonSend:Button;
	public var g_buttonRequest:Button;
	public var g_messageTxt:InputBox;
	public var g_toolBar:ToolBar;
	public var notifyBugs:NotifyBug[];
	public var tempItem:ListItem;
	public var allianceAlert:Label;
	public var allianceBtn:Button;
	public var joinAllianceTip:JoinAllianceDes;
	private var clone_joinAllianceTip:JoinAllianceDes;
	public var userSettingBtn:Button;
	
	public var globalScrollView:ScrollView;	
	public var allianceScrollView:ScrollView;
	
	public var globalContainer:AspectContainer;
	public var allianceContainer:AspectContainer;

	public var g_bgMiddleBodyTop:Label;
	public var g_bgBottom:Label;
	
	public var inputImply:Label;
	public var noticeIcon:Label;
	public var noticeRow:Label;
	public var noticeTitle:Label;
	public var noticeButton:Button;
	//-------------------------------------//
	public var componentMove:ComposedUIObj;
	private var moveToYPosition:int;
	private var moveSpeed:int;
	private var maxStep:int = 5;
	private var OriginalYPosition:int;
	private var framePerMove:int = 2;
	private var isMoveComponent:boolean;
	private var isMoveUp:boolean = true;
	private var moveStep:int = 0;
	private var count:int = 0;
	private var componentMoveIsTop:boolean = false;
	private var keyboardViewHeight:float = 0.0f;
	//-------------------------------------//
	
	private var chatType:int = 1;
	private var chatTypeId:int = 1;
	private var timestamp:int = 0;
	private var chatCounter:int = 0;
	
	private var g_curNewest:Hashtable;
	//private var g_recipients:Hashtable;
	
	private static var VIEW_HEIGHT:int = 700;
	private static var VIEW_HEIGHT_ALLIANCE:int = 700; 
	
	public static final var NoticeHeight = 78;
	
	//---------------------------------------//
	private var g_MessageMaxNum = 30;
	public static var TimeSeparatorInterval1 = 60; 	// seconds
	public static var TimeSeparatorInterval2 = 300;	// seconds
	public var g_itemsGloble:Array;
	public var g_itemsAlliance:Array;
	public var g_itemsAll:Array; 
	
	//---------------------------------------//
	private var g_isGlobal = true;
	
	private var g_checkiPhoneKeyboard:boolean = false;
	private static var g_instance:AvaChatMenu;
	
	private var offset = 10;
	private var userTitle:int;
	
	//---------------------------------------//
	public static var GETTING_CHAT:int = 0;
	public static var GETTED_CHAT:int = 1;
	
	private var getChatStatus:int = GETTED_CHAT;
	//---------------------------------------//
	private var currentNotice:Notice;

	@HideInInspector
	public var androidChat:AndroidChat;
	
//	public var privateChatSheet:PrivateChatSheet;
	
	// Lihaojie 2013.06.26 Perfect channel table pages 
	public static final var SheetGlobal:int = 0;
	public static final var SheetAlliance:int = 1;
	
	// Enumerate getChat.php chat data type
	public static final var ChatDataTypeGlobal:int = 1;
	public static final var ChatDataTypeAlliance:int = 2;
	
	private var currScrollView:ScrollView = null;	
	
	public function AvaChatMenu()
	{
		g_curNewest = new Hashtable(); 
		
		for (var i:int = 1; i <= 2; i++)
		{
			g_curNewest["c" + i.ToString()] = -1;
		}
		
		//g_recipients = new Hashtable();
	}
	
	public function Init()
	{
		g_headMenu = GameObject.Instantiate(clone_headMenu);
		var seed : HashObject = GameMain.instance().getSeed();
		TimeSeparatorInterval1 = (null != seed["serverSetting"]["chatTimeLabelInterval1"] ? 
			_Global.INT32(seed["serverSetting"]["chatTimeLabelInterval1"]) : 60);
		TimeSeparatorInterval2 = (null != seed["serverSetting"]["chatTimeLabelInterval2"] ? 
			_Global.INT32(seed["serverSetting"]["chatTimeLabelInterval2"]) : 300);
		
		//notice
		currentNotice = ChatNotices.instance().GetCurrentNotice();
		userTitle = Constant.Alliance.Member;
		
		inputImply.Init();
		inputImply.txt = Datas.getArString("Common.MaxCharacters");
		allianceScrollView.Init();	
		globalScrollView.Init();
		g_itemsGloble = new Array();
		
		g_itemsAlliance = new Array();
		g_itemsAll = new Array();
		g_buttonSend.OnClick = handleBtnSend;
		
		g_messageTxt.ActiveClick = handleClickText;
		g_messageTxt.Guid = Constant.InputBoxGuid.AVA_CHAT_INPUT;
		g_messageTxt.OnOutInputBox = InputBoxKeyboard_OnOut;
		g_messageTxt.SetInputBoxMaxChars(Constant.ChatMaxLength);
		g_messageTxt.Init();
		g_messageTxt.SetText("");
		wordsStyle = g_messageTxt.mystyle;
		
		//g_messageTxt.setReadEndEnable(true);
		//g_messageTxt.handleTextClicked = handleClickText;
		//g_messageTxt.inputDoneFunc = handleInputDone;
		
		
		g_bgMiddleBodyTop.Init();
		g_bgBottom.Init();
		g_headMenu.Init();
		g_toolBar.Init();
		g_toolBar.SetDefaultNormalTxtColor(FontColor.New_PageTab_Yellow);
		g_toolBar.SetDefaultOnNormalTxtColor(FontColor.New_PageTab_Yellow);
		userSettingBtn.Init();
		userSettingBtn.OnClick = handleUserSetting;
		
		if(RuntimePlatform.Android == Application.platform)
			moveSpeed = _Global.CalculateKeyboardSpeed(maxStep);

		/*
		if(_Global.IsLowerKeyboard())
		{
			moveSpeed = 49;
		}
		else
		{
			moveSpeed = 86;
		}
		*/
		getChatStatus = GETTED_CHAT;
		
		allianceAlert.Init();
		allianceBtn.Init();
		//joinAllianceTip.Init();
		clone_joinAllianceTip = Instantiate(joinAllianceTip);
		clone_joinAllianceTip.Init();

		g_toolBar.indexChangedFunc = indexChangedFunc;	
		
		var blinkStartCol:Color = new Color(20.0/255, 20.0/255, 0, 0);
		var blinkEndCol:Color = FontMgr.GetColorFromTextColorEnum(FontColor.TabNormal_Light);
		g_toolBar.setColorChangedValue(blinkStartCol, 5, 2, blinkEndCol);
		g_toolBar.SetTabsColor(blinkEndCol);
		
		g_isFirstLoginChat = true;
		g_instance = this;

		GameMain.instance().resgisterRestartFunc(function(){
			g_instance = null;
		});		
		
		OriginalYPosition = 960 - componentMove.rect.height + 5;
	
		g_bgMiddleBodyTop.useTile = false;
		g_bgMiddleBodyTop.tile = null;//TextureMgr.instance().BackgroundSpt().GetTile(null);
		g_bgMiddleBodyTop.mystyle.normal.background = TextureMgr.instance().LoadTexture("frame_metal_top",TextureType.DECORATION);
		g_bgMiddleBodyTop.mystyle.border = new RectOffset(27, 27, 0, 0);
		
		g_bgBottom.useTile = true;
//		g_bgBottom.tile = TextureMgr.instance().BackgroundSpt().GetTile("tool bar_bottomnew");
		//g_bgBottom.tile.name = "small_bar_bottom";	
		g_bgBottom.drawTileByGraphics = true;
		
		this.displayNoticeSetting();
		noticeButton.OnClick = function(){
			UnityNet.SendNoticeBI(1);
			var notices = ChatNotices.instance().GetNoticesList(); 
			if(currentNotice != null && notices != null && notices.Count > 0)
			{
				MenuMgr.getInstance().PushMenu("ChatRotator", currentNotice, "trans_zoomComp");
			}
		};
		
		g_buttonRequest.OnClick = allianceRequestPop;
		g_buttonRequest.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_+_normal",TextureType.DECORATION);
		g_buttonRequest.mystyle.active.background = TextureMgr.instance().LoadTexture("button_+_down",TextureType.DECORATION);

		androidChat = new AndroidChat();
		
		androidChat.allianceRequestPop = this.allianceRequestPop;
		androidChat.sendChat = this.SendChat;
		androidChat.SetChatHistoryHeight = this.SetChatHistoryHeight;
		androidChat.CanShowPlus = this.CanShowPlus;
		androidChat.GetViewY = this.GetViewY;
		androidChat.GetViewHeight = this.GetViewHeight;
		androidChat.TargetMenu = this;
		androidChat.CanShowBar = CanShowBar;
		androidChat.OnInit();
		androidChat.SetText("");
		
		allianceAlert.txt = Datas.getArString("Common.NoAlliance");
		allianceBtn.txt = Datas.getArString("Common.JoinAlliance");
		allianceBtn.OnClick = handleAlliance;
	
		g_headMenu.setTitle(Datas.getArString("ModalTitle.Chat"));
        g_headMenu.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_OUTPOST);
		g_buttonSend.txt = Datas.getArString("Common.Send_button");
		g_toolBar.toolbarStrings = [(Datas.getArString("Common.Global") as String), 
									(Datas.getArString("Common.Alliance") as String)];
						
		
		globalContainer.Init();
		allianceContainer.Init();
		var tempBalloon : MessageBalloon = tempItem as MessageBalloon;
		if (_Global.IsTallerThanLogicScreen()) {
			globalContainer.SetAspect(Screen.width, Screen.height, AspectContainer.AspectType.LockWidth);
			allianceContainer.SetAspect(Screen.width, Screen.height, AspectContainer.AspectType.LockWidth);
		}
		if (null != tempBalloon) {
			tempBalloon.avatar.inScreenAspect = _Global.IsShorterThanLogicScreen();
		}
		g_toolBar.inScreenAspect = _Global.IsShorterThanLogicScreen();
		
		if (null != notifyBugs && notifyBugs.Length == g_toolBar.toolbarStrings.Length)
		{
			var border:int = 2;
			var width:int = (g_toolBar.rect.width - border*( g_toolBar.toolbarStrings.length - 1 ) ) / g_toolBar.toolbarStrings.length;
			for (var i:int = 0; i < notifyBugs.Length; i++)
			{
				var right:int = g_toolBar.rect.x + (i + 1) * ( width + border );
				notifyBugs[i].rect = new Rect(right - notifyBugs[i].rect.width , g_toolBar.rect.y, notifyBugs[i].rect.width, notifyBugs[i].rect.height);
				notifyBugs[i].mystyle.normal.background = TextureMgr.instance().LoadTexture("task_list_number_bottom", TextureType.ICON);
				notifyBugs[i].SetCnt(0);
			}
		}
        
        super.Init();
	}
	
	
	public function ClearAllianceChatInfo()
	{
		g_itemsAlliance = new Array();
		g_curNewest["c" + ChatDataTypeAlliance.ToString()] = -1;
	}
	
	private function CanShowBar(topMenuName:String):boolean
	{
		var showBar:boolean = false;
		showBar = (topMenuName.Equals(this.menuName));
		
		if (g_toolBar.selectedIndex == SheetGlobal) // Global channel
		{
			showBar &= true;
		}
		else if(g_toolBar.selectedIndex == SheetAlliance) // Alliance channel
		{ 
			if(g_isJoinAlliance == true)
			{
				showBar &= true;
			}
			else
				showBar &= false;
		}
		
		return showBar;
	}
	
	public function CanShowPlus():boolean
	{
//		var showPlus:boolean = false;
//		// showPlus = (!g_isGlobal) && g_isJoinAlliance;
//		if (g_toolBar.selectedIndex == SheetGlobal) // Global channel
//		{
//			showPlus = false;
//		}
//		else if(g_toolBar.selectedIndex == SheetAlliance) // Alliance channel
//		{ 
//			if(g_isJoinAlliance == true)
//			{
//				showPlus = true;
//			}
//		}
//		return showPlus;
        return false;
	}
	public function GetViewHeight():int
	{
		if(RuntimePlatform.Android == Application.platform)
			return 800;
		return VIEW_HEIGHT;
	}
	public function GetViewY():int
	{
		if(g_isGlobal)
			return globalContainer.rect.y;			
		else
			return allianceContainer.rect.y;
	}
	public function SetChatHistoryHeight(height:int)
	{
		SetGlobalHeight(height);
		SetAllianceHeight(height);
	}
	
	private function SetAllianceHeight(height:int)
	{
		allianceContainer.rect.height = height;
		
		allianceScrollView.AutoLayout();
		allianceScrollView.MoveToBottom(); 
	}
	
	private function SetGlobalHeight(height:int)
	{
		globalContainer.rect.height = height;
		globalScrollView.AutoLayout();
		globalScrollView.MoveToBottom();	
	}	
	private function handleUserSetting():void
	{
		var para:Hashtable = {"barIndex":Constant.UserSetting.IGNORE_USER};
		MenuMgr.getInstance().PushMenu("UserSettingMenu", para);
	}
	
	public function allianceRequestPop()
	{
//		MenuMgr.getInstance().PushMenu("AllianceRequestPopup", null, "trans_zoomComp");
		this.Hide();
	}
	private function displayNoticeSetting():void
	{
		if(currentNotice != null)
		{
			if(VIEW_HEIGHT != 610)
			{
				VIEW_HEIGHT = 610;
				globalContainer.rect.height = VIEW_HEIGHT;
				allianceContainer.rect.height = VIEW_HEIGHT; 
			}
			globalContainer.rect.y = 254;
			allianceContainer.rect.y = 254;  
			 
			allianceAlert.rect.y = noticeButton.rect.yMax;
			allianceBtn.rect.y = noticeButton.rect.yMax - 0.5f * (allianceBtn.rect.height - allianceAlert.rect.height); 
			clone_joinAllianceTip.rect.y = allianceBtn.rect.y + 55;
			
			noticeIcon.visible = true;
			noticeTitle.visible = true;
			noticeRow.visible = true;
			noticeButton.visible = true;
		}
		else
		{
			if(VIEW_HEIGHT != 700)
			{
				VIEW_HEIGHT = 700;
				globalContainer.rect.height = VIEW_HEIGHT;
				allianceContainer.rect.height = VIEW_HEIGHT;
			} 
			
			globalContainer.rect.y = 164;  
			allianceContainer.rect.y = 164;
			
			allianceAlert.rect.y = 200;
			allianceBtn.rect.y = 200 - 0.5f * (allianceBtn.rect.height - allianceAlert.rect.height);
			clone_joinAllianceTip.rect.y = allianceBtn.rect.y + 55;
			
			noticeIcon.visible = false;
			noticeTitle.visible = false;
			noticeRow.visible = false;
			noticeButton.visible = false;
		}
	}
	
	private function handleClickText():void
	{
		if(RuntimePlatform.Android == Application.platform)
		{
			isMoveUp = true;
			isMoveComponent = true;
		}

	}
	
	public static function getInstance():AvaChatMenu
	{
		return g_instance;
	}
	private var oldValue:int = -1;
	private function indexChangedFunc(_value:int)
	{
		g_toolBar.resetColorByIndex(_value);
		if (_value < notifyBugs.Length && null != notifyBugs[_value])
		{
			notifyBugs[_value].SetCnt(0);
		}
		
		g_headMenu.setPaymentContentsVisible(true);
		
		g_messageTxt.SetVisible(true);
		g_buttonSend.SetVisible(true);
		inputImply.SetVisible(true);  
		g_bgBottom.SetVisible(true);  
		
		var scrollList:ScrollView = null; 
		var container:AspectContainer = null;
		if (_value == SheetGlobal) // Global channel
		{
			scrollList = globalScrollView;
			container = globalContainer;
			
			g_isGlobal = true;
			g_buttonSend.rect.width = 195;
			g_buttonRequest.SetVisible(false);
		}
		else if(_value == SheetAlliance) // Alliance channel
		{ 
			inputImply.visible = false;
			
			scrollList = allianceScrollView;
			container = allianceContainer;
			var b:boolean = true;
			g_isGlobal = false;
			if(g_isJoinAlliance == true)
			{
				SetAllianceChannelsState();
				
				g_buttonSend.rect.width = 195;
				g_buttonRequest.SetVisible(false);
				
			}
			else
			{
				_Global.Log("not join alliance");
				g_buttonSend.rect.width = 195;
				g_buttonRequest.SetVisible(false);
				
				g_messageTxt.SetVisible(false);
				g_buttonSend.SetVisible(false);
				inputImply.SetVisible(false);  
				g_bgBottom.SetVisible(false);
			} 
		}
		
		if(oldValue == -1 || oldValue != _value)
		{
			oldValue = _value;
			androidChat.OnIndexChanged();
		}
		
		
		var listHeight:float = VIEW_HEIGHT;
		if(g_messageTxt.OnFocus)
		{
			listHeight = VIEW_HEIGHT - moveSpeed * maxStep;
		}
		
		if (scrollList) 
		{ 
			scrollList.SetAllVisible(true);
			 
			container.rect.height = listHeight;
			scrollList.AutoLayout();
			scrollList.MoveToBottom(); 
		}  
	}
	
	private function OnAllianceChatSelected()
	{
		allianceScrollView.SetAllVisible(true);
		
		var scrollList:ScrollView = null;
		var container:AspectContainer = null;
		
		scrollList = allianceScrollView; 
		container = allianceContainer;
		
		g_buttonSend.rect.width = 195;
		g_buttonRequest.SetVisible(false);
			
		
		var listHeight:float = VIEW_HEIGHT;
		if(g_messageTxt.OnFocus)
		{
			listHeight = VIEW_HEIGHT - moveSpeed * maxStep;
		}
				
		if (scrollList) 
		{ 
			container.rect.height = listHeight;
			scrollList.AutoLayout();
			scrollList.MoveToBottom();
		}
		androidChat.OnIndexChanged();
	}

	private var temp_counter = 0;
	private var timerToAddComp:float = .0;
	private var oldTouched:boolean = false;
	private var curTouched:boolean = false;
	private var timerForTouchInterval:float = .0;
	private var getChatWhenTouched:boolean = true;

	private	var seeed:HashObject;
	private	var chatLimitLv:int;
	private	var playerLv:int;
	
	function Update()
	{
		g_headMenu.Update();
		
		g_toolBar.Update();
		
		currScrollView = null; 
		if(g_toolBar.selectedIndex == SheetGlobal)
		{
			globalScrollView.Update();
			currScrollView = globalScrollView;
		}
		else if(g_toolBar.selectedIndex == SheetAlliance)
		{	
			allianceScrollView.Update(); 
			currScrollView = allianceScrollView;
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
		
		if (null != currScrollView)
			curTouched = currScrollView.IsMoved();
		else
			curTouched = false;
			
		// curTouched = globalScrollView.IsMoved() || allianceScrollView.IsMoved() || allianceOfficerScrollView.IsMoved();
		if(curTouched != oldTouched)
		{
			if(!curTouched)
			{
				timerForTouchInterval += Time.deltaTime;
				if(timerForTouchInterval >= 2.0)
				{
					timerForTouchInterval = .0;
					oldTouched = curTouched;
					getChatWhenTouched = true;
				}
			}
			else
			{
				timerForTouchInterval = .0;
				timesGetChat = 0;
				oldTouched = curTouched;
				getChatWhenTouched = false;
			}
		}
		else
		{
			if(!curTouched)
			{
				timerToAddComp += Time.deltaTime;
				getChatWhenTouched = true;
				if(timerToAddComp > 0.2)
				{
					addComponentForScrollView();
					timerToAddComp = .0;
				}			
			}
			else
			{
				timerForTouchInterval = .0;
				getChatWhenTouched = false;
			}
		}
				
		if(whetherGetChat(true))
		{
			getChat(false);
			temp_counter = 0;	
		}

		currentNotice = ChatNotices.instance().GetCurrentNotice();
		// update notice layout
		if ((!noticeButton.isVisible() && null != currentNotice) || (noticeButton.isVisible() && null == currentNotice))
		{ 
			displayNoticeSetting();
		}
		// update notice content
		if (null != currentNotice)
		{
			noticeTitle.txt = currentNotice.Title;
			noticeIcon.useTile = true;
			noticeIcon.tile = TextureMgr.instance().GeneralSpt().GetTile(currentNotice.Image);
		}
		
		if(isMoveComponent && Application.platform != RuntimePlatform.Android)
		{
			moveBottomUpAndDown();
		}
		g_buttonSend.SetDisabled(isMoveComponent);
		
		if(g_messageTxt.OnFocus || g_messageTxt.GetText() != "")
		{
			inputImply.visible = false;
		}
		else
		{
			if (g_toolBar.selectedIndex == SheetAlliance && !g_isJoinAlliance)
			{
				inputImply.visible = false;
			}
			else
			{
				inputImply.visible = true;
			}
		}
	}
	
	private function resetBottomOriginalPos():void
	{
		componentMoveIsTop = false;
		isMoveComponent = false;
		isMoveUp = true;
		moveStep = 0;
		count = 0;
		componentMove.rect.y = OriginalYPosition;
		
		// VIEW_HEIGHT maybe is 700 or 610
		globalContainer.rect.height = VIEW_HEIGHT;
		allianceContainer.rect.height = VIEW_HEIGHT; 
		
		globalScrollView.AutoLayout();			
		globalScrollView.MoveToBottom();			

		allianceScrollView.AutoLayout();			
		allianceScrollView.MoveToBottom();	
		
	}
	
	private function moveBottomUpAndDown():void
	{
//		count++;		
//		if(count % framePerMove == 0)
//		{
//			count = 0;	
//		}
//		else
//		{
//			return;
//		}
		
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
				if(g_toolBar.selectedIndex == SheetGlobal)
				{
					globalContainer.rect.height -= moveSpeed;
					globalScrollView.AutoLayout();
					globalScrollView.MoveToBottom();
				}
				else if(g_toolBar.selectedIndex == SheetAlliance)
				{
					allianceContainer.rect.height -= moveSpeed;
					allianceScrollView.AutoLayout();
					allianceScrollView.MoveToBottom();
				}
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
				if(g_toolBar.selectedIndex == SheetGlobal)
				{
					globalContainer.rect.height += moveSpeed;
					globalScrollView.AutoLayout();
					globalScrollView.MoveToBottom();
				}
				else if(g_toolBar.selectedIndex == SheetAlliance)
				{
					allianceContainer.rect.height += moveSpeed;
					allianceScrollView.AutoLayout();
					allianceScrollView.MoveToBottom();	
				}
				
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
	
	//------------------------------------//
	private var FAST_INTERVAL:int = 5;	
	private var SLOW_INTERVAL:int = 20;
	private var GET_CHAT_DURATION:int = 30;
	
	private var defaultInterval:int = 10;
	private var isInGetCharDuration:boolean = false;

	private var lastGetChatTime:long = 0;
	private var lastSendChatTime:long = 0;

	private var curTime:long;
	private var timesGetChat:int = 0;
	private var g_isJoinAlliance:boolean;
	//------------------------------------//	
		
	public function whetherGetChat(inChatMenu:boolean):boolean
	{
		curTime = GameMain.unixtime();
		
		if(!KBN.FTEMgr.getInstance().isAllowContentTouch )
			return false;

		if(getChatStatus == GETTING_CHAT)
		{
			return false;
		}
		
		if(inChatMenu && !getChatWhenTouched && timesGetChat >= 1)
		{
			return false;
		}
	
		if(curTime - lastSendChatTime <= GET_CHAT_DURATION)
		{
			defaultInterval = FAST_INTERVAL;
		}
		else
		{
			defaultInterval = SLOW_INTERVAL;
		}

		if(curTime - lastGetChatTime > defaultInterval)
		{
			if(timesGetChat < 1)
			{
				timesGetChat++;
			}
		
			return true;
		}
		else
		{
			return false;
		}
	}
	
	private function handleBtnSend()
	{
		if(isMoveComponent == false)
		{
			sendChat(g_isGlobal);	
		}
		if(Application.platform != RuntimePlatform.Android)
		{
			if(g_isJoinAlliance)
			{
				if(componentMoveIsTop)
				{
					allianceContainer.rect.height = VIEW_HEIGHT - moveSpeed * maxStep;
				}
				else
				{
					allianceContainer.rect.height = VIEW_HEIGHT;
				}
				allianceScrollView.AutoLayout();
				allianceScrollView.MoveToBottom();			
			}
		}
		
		
		androidChat.ShowKeyboard(false);
	}

	public function OnPop()
	{
		super.OnPop();
		
		oldTouched = false;
		curTouched = false;	
		/*
		if(g_messageTxt.getKeyBoard())
		{
			g_messageTxt.getKeyBoard().active = false;
		}
		*/
		g_messageTxt.Done();
		g_toolBar.clearColorOperation();
		
		if(g_itemsAll.length > 0)
		{			
			var tempObj:Hashtable;
			var count:int = 0;
			var array:Array = new Array();
			
			for(var a:int = g_itemsAll.length - 1; a >= 0; a-- )
			{
				tempObj = g_itemsAll[a];
				if(tempObj["type"] + "" == Constant.ChatType.CHAT_RULE || tempObj["type"] + "" == Constant.ChatType.CHAT_NO_USER)
				{
					continue;
				}
				
				if(count++ > 2)
				{
					break;
				}
				
				array.push(tempObj);
			}
			
			g_itemsAll.clear();
			
			for(var b:int = 0; b < array.length; a++)
			{
				g_itemsAll.push(array.pop());
			}
			
			g_isNeedUpdateMes = true;
		}
	}
	
	public override function OnPopOver()
	{
		super.OnPopOver();
		
		clone_joinAllianceTip.Clear();
	}
	
    public override function Clear()
    {
        g_itemsAll = new Array();
        g_itemsGloble = new Array();
        g_itemsAlliance = new Array();
        
        globalScrollView.clearUIObject();
        allianceScrollView.clearUIObject();
        
        if (null != notifyBugs)
        {
            for (var i : int = 0; i < notifyBugs.Length; i++)
            {
                notifyBugs[i].SetCnt(0);
            }
        }
    }
    
	//private var g_defaultCharacterNo:int = 21;
	private var g_messageNoForMainChrom:int = 2;

	public function generateMesForMainChrom():System.Collections.Generic.List.<Hashtable>
	{
		var item:Hashtable;
		var returnStr:String = "";
		var tempStringLength:int = 0;
		var tempString:String;
		var tempObj:Hashtable;
		var returnArray:System.Collections.Generic.List.<Hashtable> = new System.Collections.Generic.List.<Hashtable>();
		var count:int = 0;
		
		g_isNeedUpdateMes = false;
		
		for(var a:int = 0; a < g_itemsAll.length; a++)
		{
			item = g_itemsAll[a];
			tempString = item["type"] + "";

			//this code is wired.
			if(tempString == Constant.ChatType.CHAT_RULE || tempString == Constant.ChatType.CHAT_NO_USER || tempString == Constant.ChatType.AVA_RALLY_ATTACK)
			{
				g_itemsAll.shift();
				a--;
				continue;
			}

			if(count++ > g_messageNoForMainChrom)
			{
				break;
			}			
									
			item = g_itemsAll[a];
			var timeString : String = "  " + _Global.HourTime24WithoutSecond(_Global.INT64(item["time"]));
			var finalString:String = item["message"].ToString();								   
			if(item["AVAshareReport"]!=null)
			{
			   var tempStr:String = item["message"].ToString();
			   var arr:Array = tempStr.Split(":"[0]);
			   if(arr.length>2){
		           var defName:String = arr[0].ToString();
		           var attackName:String = arr[1].ToString();
		           var isWin:boolean = _Global.INT32(arr[2])==1;
		            if(String.IsNullOrEmpty(attackName))
				   {
				     attackName = Datas.getArString("Common.Enemy");
				   }
				   if(String.IsNullOrEmpty(defName)){
				     defName = Datas.getArString("Common.Enemy");
				   }
		           if(isWin)
		           {
		             finalString = String.Format(Datas.getArString("BattleReprotShare.Text"),attackName,defName);
		           }
		           else
		           {
		           	 finalString = String.Format(Datas.getArString("BattleReprotShare.Text"),defName,attackName);
		           }
	           }
			}
		
			returnStr = _Global.GUIClipToWidth(wordsStyle, String.Format("{0}:{1}", item["username"], finalString.Replace("\n", " ").Replace("\r", "")),
											   Convert.ToSingle(wordsLength), "...", timeString);
			tempObj = {"type":item["type"],"message":returnStr};
//			if(tempString == Constant.ChatType.CHAT_ALLIANCE_OFFICER &&  !hasOfficerPermission)
//				continue;
			
			returnArray.Add(tempObj);
		}

		if(g_itemsAll.length > 2)
		{
			g_itemsAll.shift();
			g_isNeedUpdateMes = true;
		}
		
		return returnArray;
	}

	private var g_isFirstLoginChat:boolean;
	
    private function CheckPushParam(paramDict : Hashtable)
    {
        if (paramDict == null)
        {
            return;
        }

        var tabName : String = paramDict["tabName"];
        
        var tabIndex : int = -1;
        if (tabNameToIndex.Contains(tabName))
        {
            tabIndex = tabNameToIndex[tabName];
        }

        if (tabIndex >= 0)
        {
            g_toolBar.SelectTab(tabIndex);
        }
    }
    
    private static var tabNameToIndex : Hashtable =
    {
        "normal": 0,
        "alliance": 1,
        "private": 2
    };

    
	public function OnPush(param:Object)
	{	
		super.OnPush(param);
        
        var paramDict : Hashtable = param as Hashtable;
		
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		
		// First value the g_isJoinAlliance, it's very important
		CheckIsInAlliance();
		
		clone_joinAllianceTip.rect.width = this.rect.width;
		clone_joinAllianceTip.SetLayout("ChatMenu");
		
        CheckPushParam(paramDict);
		
		// Execute the alliance tab logic base on isInAlliance
		indexChangedFunc(g_toolBar.selectedIndex); // Default do some
		if (g_toolBar.selectedIndex == SheetAlliance)
		{
			OnAllianceChatSelected();
		}
		g_headMenu.setPaymentContentsVisible(true);
		
		
		getChatWhenTouched = true;
		oldTouched = false;
		curTouched = false;		
		
		if (g_toolBar.selectedIndex == SheetGlobal)
		{
			g_toolBar.selectedIndex = 0;
			g_buttonSend.rect.width = 195;
			g_buttonRequest.SetVisible(false);
		}
		else if (g_toolBar.selectedIndex == SheetAlliance)
		{
			if(g_isJoinAlliance == true)
			{
				// Update the member and officer button state
				SetAllianceChannelsState();
			}
			else
			{
				g_buttonSend.rect.width = 195;
				g_buttonRequest.SetVisible(false);
			}
		}
		
		resetBottomOriginalPos();
		userTitle = Alliance.getInstance().MyOfficerType();
		
		if(g_isFirstLoginChat)
		{ 
//			var itemObj:Object = {
//				"type":Constant.ChatType.CHAT_RULE,
//				"time":GameMain.unixtime().ToString()
//			};
//			g_itemsGloble.push(itemObj);
			g_isFirstLoginChat = false;
		}		

		lastSendChatTime = GameMain.unixtime(); 
		if(paramDict!=null&&!String.IsNullOrEmpty(paramDict["ReportShare"]))
		{
		    g_messageTxt.SetText(paramDict["ReportShare"]);
			androidChat.SetText(paramDict["ReportShare"]);
			m_ReportShareTxt = paramDict["ReportShareTxt"].ToString();
			m_StandShareTxt = paramDict["ReportShare"].ToString();
		}
	} 
	var m_ReportShareTxt:String;
	var m_StandShareTxt:String;
	private function CheckIsInAlliance()
	{
		if (Alliance.getInstance().MyAllianceId() <= 0)
		{
			g_isJoinAlliance = false;
		}
		else
		{
			g_isJoinAlliance = true;
		}
	}
	
	private function SetAllianceChannelsState()
	{
		if (g_isJoinAlliance)
		{
			if (!Alliance.getInstance().hasGetAllianceInfo)
			{
				Alliance.getInstance().reqAllianceInfo();
			}
		}
		
		if (g_toolBar.selectedIndex == SheetAlliance)
		{
			// Adjust the Request btn state
			SyncAllianceScrollViewRect();
		}
	}
	
	private function SyncAllianceScrollViewRect()
	{
		allianceContainer.rect.y = globalContainer.rect.y;
		allianceContainer.rect.height = globalContainer.rect.height; 
		
		allianceScrollView.AutoLayout();
	}
	
	private function handleAlliance()
	{
//		MenuMgr.getInstance().MainChrom.openAlliance(null);
	}
	
	public static function InsertTimeSeparator(list:ScrollView)
	{
		var count:int = list.numUIObject;
		if (0 == count)
			return;
		
		var balloon1 : MessageBalloon;
		var balloon2 : MessageBalloon;
		var balloon3 : MessageBalloon;
		
		balloon1 = list.getUIObjectAt(0) as MessageBalloon;
		if (null != balloon1)
			balloon1.SetTimeSeparatorVisible(true);
		
		if (2 > count)
			return;
		balloon1 = list.getUIObjectAt(count - 1) as MessageBalloon;
		balloon2 = list.getUIObjectAt(count - 2) as MessageBalloon;
		if (null == balloon1 || -1 == balloon1.timestamp || null == balloon2 || -1 == balloon2.timestamp)
			return;
		
		if (balloon1.timestamp - balloon2.timestamp > TimeSeparatorInterval1) {
			balloon1.SetTimeSeparatorVisible(true);
			return;
		}
		
		for (var i : int = count - 2; i >= 0; i--) {
			balloon3 = list.getUIObjectAt(i) as MessageBalloon;
			if (null != balloon3 && balloon3.isTimeSeparatorVisible) {
				break;
			}
		}
		if (null != balloon1 && null != balloon3 && 
			(!balloon3.isTimeSeparatorVisible ||
				balloon1.timestamp - balloon3.timestamp > TimeSeparatorInterval2)) {
			balloon1.SetTimeSeparatorVisible(true);
		}
	}
	
	public function addComponentForScrollView()
	{
		var a:int = 0;
		var item:Object;
		var itemObject:ListItem;
		var dObj:UIObject;
		
		if(g_toolBar.selectedIndex == SheetGlobal)
		{
			if(g_itemsGloble.length > 0)
			{
				item = g_itemsGloble.shift();
				(item as Hashtable)["ava"] = 1;
					
				if(globalScrollView.numUIObject <= g_MessageMaxNum)
				{
					itemObject = Instantiate(tempItem);
					itemObject.SetRowData(item);
					globalScrollView.addUIObject(itemObject);
				}
				else
				{
					dObj = globalScrollView.shiftUIObject();
					itemObject = Instantiate(tempItem);
					itemObject.SetRowData(item);
					globalScrollView.addUIObject(itemObject);
				}
				
				InsertTimeSeparator(globalScrollView);
				globalScrollView.AutoLayout();
				globalScrollView.MoveToBottom();
			}
		}
		else if(g_toolBar.selectedIndex == SheetAlliance && g_isJoinAlliance)
		{
			if(g_itemsAlliance.length > 0)
			{
				item = g_itemsAlliance.shift();
				(item as Hashtable)["ava"] = 1;
				
				if(allianceScrollView.numUIObject <= g_MessageMaxNum)
				{
					itemObject = Instantiate(tempItem);
					itemObject.SetRowData(item);					
					allianceScrollView.addUIObject(itemObject);
				}
				else
				{
					dObj = allianceScrollView.shiftUIObject();
					itemObject = Instantiate(tempItem);
					itemObject.SetRowData(item);						
					allianceScrollView.addUIObject(itemObject);
				}
				
				SetAllianceEmblemVisible(itemObject, false);
				
				InsertTimeSeparator(allianceScrollView);
				allianceScrollView.AutoLayout();
				allianceScrollView.MoveToBottom();
			}
		}
		
		if( null != dObj ){
			TryDestroy(dObj);
		}
	}
	
	private function SetAllianceEmblemVisible(item:ListItem, visible:boolean):void
	{
		var balloon = item as MessageBalloon;
		if (balloon != null) {
			balloon.alliEmblem.SetVisible(visible);
		}
	}
	
	public function clearAllianceChat():void
	{
		allianceScrollView.clearUIObject();
	}

	public function reportUser(userID, ctype, chatID):void
 	{
 		
 		
 		var okFunc:System.Action = function(){
			
			var params:Array = new Array(); 		
	 		params.Add("" + userID);
	 		params.Add("" + ctype);
	 		params.Add("" + chatID);
			
			var can:Function = function(result:HashObject)
			{
		  		if(result["ok"].Value)
				{	
					MenuMgr.getInstance().PopMenu("");
					MenuMgr.getInstance().PushMessage(Datas.getArString("Common.actionSucess"));
		  		}			 
			};
			
			//--------------------------------------------------------------//
			UnityNet.reqReportUser(params, can, null);
			//--------------------------------------------------------------//
		};

		var confirmDialog : ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();

		confirmDialog.setButtonText(Datas.getArString("Common.OK_Button"),Datas.getArString("Common.Cancel"));
		confirmDialog.setLayout(600,360);
		confirmDialog.setTitleY(60);
		confirmDialog.setContentRect(70,140,0,260);

		MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("Common.reportUserConfirm"), Datas.getArString("Common.reportUserConfirmTitle"), okFunc, null); 	
		
 	} 
 	
	public function activeKeyboard(whisperUserName:String):void
	{
		if(whisperUserName == "" || whisperUserName == null)
		{
			return;
		}
		
		indexChangedFunc(g_toolBar.selectedIndex);
		
		var username:String = "/" + whisperUserName + " ";
		g_messageTxt.SetText(username);
		androidChat.SetText(username);
		g_messageTxt.SetFocus();
	}
	
	private function createObjForHelp(str:String):Hashtable
	{
		var obj:Hashtable;		
		if(str != "")
		{
			var arr:Array = str.Split(","[0]);
			obj = {	"inviterId":arr[0],
					"inviterName":arr[1],
					"cityId":arr[2],
					"type":arr[3],
					"dataType":arr[4],
					"dataId":arr[5],
					"dataLv":arr[6]
				  };
		}					
		
		return obj;
	}
	
	private function priv_getMVPsArray(result : HashObject) : MVPArray
	{
		var mvps : MVPArray = new MVPArray();
		if ( result["data"]["mvp"] != null )
			JasonReflection.JasonConvertHelper.ParseToObjectOnce(mvps, result["data"]["mvp"]);
		return mvps;
	}
	
	private function incNotifyBug(ch:int)
	{
		if (g_toolBar.selectedIndex == ch)
			return;
		if (notifyBugs.length > ch && null != notifyBugs[ch])
			notifyBugs[ch].SetCnt(notifyBugs[ch].GetCnt() + 1);
	}

 	public function getChat(isOut:boolean):void
 	{ 
 		// Predefined  canGetChat and canntGetChat
		var canGetChat:Function = function(result:HashObject)
		{
			lastGetChatTime = GameMain.unixtime();
			getChatStatus = GETTED_CHAT;
			
	  		if(result["ok"].Value)
			{
				//GameMain.adjustUnixtime(_Global.parseTime(result["resmicrotime"]));
				
				// Add a new chat data for alliance officer, the new typeId is 5
	  			for (var i=1; i <= 2; i++)
	  			{ 
	  				var chats:HashObject = result["data"]["newChats"][""+i];
	  				var tempArray:Array = _Global.GetObjectValues(chats);

	   				if(tempArray.length > 0)
	  				{
	  					// If have the new message and current focus is not in that panel,then blink the control
	  					if(i == ChatDataTypeGlobal)
	  					{
	  						if(g_toolBar.selectedIndex != SheetGlobal)
		  					{
	  							g_toolBar.changeColorByIndex(SheetGlobal);
	  						}
	  					}
	  					else if(i == ChatDataTypeAlliance)
	  					{
	  						if(g_toolBar.selectedIndex != SheetAlliance)
		  					{
	  							g_toolBar.changeColorByIndex(SheetAlliance);
	  						}
		  				}
		  			}  				 				


					var _time:String;
//					var _arString:Object = Datas.instance().arStrings();
					var contentObj:HashObject;
					var isHelpItem:boolean;
					var helpMessage:String;
					var objForHelp:Hashtable;
					var filteredNum:int = 0;
					
					var needFlarePrivate:int = 0;
					var privateChatId:int = -1;
					
					for(var j=0; j < tempArray.length; j++)
					{					
						contentObj = chats[_Global.ap + j];
						var chatUserUserId:int = _Global.INT32(contentObj[_Global.ap + 4]);
						if(!UserSetting.getInstance().isIgnoredUser(chatUserUserId))  //here is for the block function 
						{ 
							var newItem:Hashtable;	
							_time = _Global.INT64(contentObj[_Global.ap + 7]).ToString();
													
							if( i == ChatDataTypeAlliance)//alliance chat
							{
								if (g_isJoinAlliance) {
									incNotifyBug(SheetAlliance);
								}
								
								var addition:String = "";
								if(contentObj[_Global.ap + 11] != null)
								{
									addition = contentObj[_Global.ap + 11].Value;
								}
								if(_Global.INT32(contentObj[_Global.ap + 10]) == 1)
								{
									var avatarAndFrame:String = contentObj[_Global.ap + 13].Value;
									var avatar : String = "";
									var avatarFrame : String = "img0";
									var chatFrame : String = "img0";
									var arrMsg : String[] = avatarAndFrame.Split(":"[0]);
									
									if(arrMsg.Length == 3)
									{
										avatar = (arrMsg[0] != null) ? arrMsg[0] : "";
										avatarFrame = arrMsg[1];
										chatFrame = arrMsg[2];
									}
									else
									{
										avatar = avatarAndFrame;
									}
									newItem = {
										"chatId":contentObj[_Global.ap + 6].Value,
										"time": _time,
										"ava": 1,
										"userid": _Global.INT32(contentObj[_Global.ap + 4]),
										"username": contentObj[_Global.ap + 0].Value,
										"activity_log": addition,
										"avatar":avatar,
										"avatarFrame":avatarFrame,
										"chatFrame":chatFrame,
										"type": Constant.ChatType.AVA_RALLY_ATTACK,
										"message":contentObj[_Global.ap + 3].Value,
										"allianceName":contentObj[_Global.ap + 9].Value, 
										"allianceID":contentObj[_Global.ap + 8].Value,
										"AVAshareReport":contentObj[_Global.ap + 16]!=null?contentObj[_Global.ap+16].ToString():null
									};

									addItem(g_itemsAlliance, newItem, false);
									g_isNeedUpdateMes = true;
//									objForHelp = createObjForHelp(contentObj[_Global.ap + 3].Value as String);
//									
//									if(Datas.instance().tvuid() != _Global.INT32(objForHelp["inviterId"]))
//									{
//										var mvplist : MVPArray = priv_getMVPsArray(result);
//										newItem = { "time":_time,
//													"data":objForHelp,
//													"userid":_Global.INT32(contentObj[_Global.ap + 4]),
////													"title":getTitleOfOfficer(contentObj[_Global.ap + 4].Value, result["data"]["allianceOfficer"]),
////													"isMVP":mvplist.dat.Contains(_Global.INT32(contentObj[_Global.ap + 4].Value)),
//													"avatar":_Global.GetString(contentObj[_Global.ap + 13]),
//													"type":Constant.ChatType.HELP_HELPER_CONFIRM
//													};
//										var resName : String;
//										if (objForHelp["type"] == "1") {
//											resName = Datas.getArString("buildingName.b" + objForHelp["dataType"]);
//										} else if (objForHelp["type"] == "2") {
//											resName = Datas.getArString("techName.t" + objForHelp["dataType"]);
//										}
//										if( objForHelp["type"] == "AllianceSpeedUp" ) {
//											newItem["message"] = objForHelp["dataLv"];
//										} else {
//											newItem["message"] = Datas.getArString("AllianceHelp.PleaseHelpMe", [objForHelp["dataLv"], resName]);
//										}
//										newItem["username"] = objForHelp["inviterName"];
//										
//										addItem(g_itemsAlliance, newItem, false);
//										g_isNeedUpdateMes = true;
//									}
//									else
//									{
//										filteredNum++;
//										continue;
//									}
								}
								else
								{
									newItem = NewRecvChatMsgItem(i, contentObj);
									newItem["additionalInfo"] = addition; 
									newItem["AVAshareReport"]=(contentObj[_Global.ap + 16]!=null?contentObj[_Global.ap+16].ToString():null);				

//									newItem["title"] = getTitleOfOfficer(contentObj[_Global.ap + 4].Value, result["data"]["allianceOfficer"]);
									var allMvps : MVPArray = priv_getMVPsArray(result);
//									newItem["isMVP"] = allMvps.dat.Contains(_Global.INT32(contentObj[_Global.ap + 4].Value));
									addItem(g_itemsAlliance, newItem, false);
									g_isNeedUpdateMes = true;												
								}										
							}
							else if( i == ChatDataTypeGlobal)//g_itemsGloble
							{
								incNotifyBug(SheetGlobal);
								
								if(contentObj[_Global.ap + 4].Value == "0" && _Global.INT32(contentObj[_Global.ap + 5]) > 0)
								{
									var arr:Array = (contentObj[_Global.ap + 3].Value as String).Split(":"[0]);
									var fmtString : String = "Chat.WonDI";
									if ( arr.length > 2 )
										fmtString = arr[2] as String;
									var rewardItem:Hashtable = { "username":contentObj[_Global.ap + 0].Value,
												"type":Constant.ChatType.CHAT_AWARD,
												"itemId":_Global.INT32(arr[1]),
												"message":Datas.getArString(fmtString, [arr[0].ToString(), Datas.getArString("itemName.i" + arr[1])]),
												"time":GameMain.unixtime().ToString()
												};					
									addItem(g_itemsGloble, rewardItem, false);
									continue;									
								}
								else
								{
									newItem = NewRecvChatMsgItem(i, contentObj);
									if(contentObj[_Global.ap + 16]!=null)
									{
									   newItem["AVAshareReport"]=contentObj[_Global.ap+16].ToString();	
									}		
				
									addItem(g_itemsGloble, newItem, false);									
								}

								g_isNeedUpdateMes = true;								
							}
							
							addItem(g_itemsAll, newItem, true);
	
						}
					}
					
					g_curNewest["c"+i] = _Global.INT32(result["data"]["nextNewests"][""+i]);
					
					if(i == ChatDataTypeAlliance && filteredNum == tempArray.length)
					{
						g_toolBar.resetColorByIndex(1);
					}
					
	  			}

	  			exceptionNum = 0;
	  			
	  			var help:HashObject = result["data"]["helpObj"];
	  			
	  			if(result["data"]["helpObj"])
	  			{
	  				helpInforOfOthers(result["data"]["helpObj"]);
	  				Alliance.getInstance().updateAllianceHelpData(result["data"]["helpObj"]);
	  			}
	  			
	  		}			 
		};
		
		var canntGetChat:Function = function(erroMsg:String, errorCode:String)
		{
			lastGetChatTime = GameMain.unixtime();
			getChatStatus = GETTED_CHAT;
			
			if(errorCode == UnityNet.CLIENT_EXCEPTION)
			{
				exceptionNum++;
				
				if(exceptionNum >= exceptionNumLimit)
				{
					var exceptionItem:Hashtable = NewExceptionMsgItem(Datas.getArString("Chat.ExceptionMessage"), Constant.ChatType.CHAT_EXCEPTION);
					//var exceptionItem:Hashtable = {"username":Datas.getArString("Chat.ExceptionName"), "time":"","message":Datas.getArString("Chat.ExceptionMessage"), "type":Constant.ChatType.CHAT_EXCEPTION};
					addItem(g_itemsGloble, exceptionItem, false);
					addItem(g_itemsAlliance, exceptionItem, false);
					addItem(g_itemsAll, exceptionItem, true);
					
					g_isNeedUpdateMes = true;
					exceptionNum = 0;
				}
			}
		}; 
		 
		getChatStatus = GETTING_CHAT;
		
		var params:Array = new Array();
 		params.Add(g_curNewest["c1"]);
 		params.Add(g_curNewest["c2"]);
 		
 		//--------------------------------------------------------------//
		UnityNet.reqAvaGetChat(params, canGetChat, canntGetChat);  	
		//--------------------------------------------------------------// 																														
 	}
 	
 	private function getTitleOfOfficer(uid:String, officerData:HashObject):int
 	{
 		if(officerData == null || officerData[uid] == null)
 		{
 			return Constant.Alliance.Member;
 		}
		var title : int = _Global.INT32(officerData[uid]);
		if (title >= Constant.Alliance.Chancellor && title <= Constant.Alliance.Member)
			return title;
		return Constant.Alliance.Member;
 	}
 	
 	public function giveHelpSuccess(data:Object):void
	{
        var helpInfo : Hashtable = data as Hashtable;
 		MenuMgr.getInstance().PushMessage(helpInfo["inviterName"] + ": " + Datas.getArString("AllianceHelp.YouHaveHelped"));
 	}
 	
 	public function helpInviterItem(data:Object):void
 	{
		var _time:String = GameMain.unixtime().ToString();
		var seed:HashObject = GameMain.instance().getSeed();
		var message:String = Datas.getArString("AllianceHelp.RequestSent", [(data as Hashtable)["dlv"], (data as Hashtable)["dName"]]);
		var newItem:Hashtable = { "time":_time,
							   "userid":Datas.instance().tvuid(),
							   "username":seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value,
//							   "title":Alliance.getInstance().MyOfficerType(),
//							   "isMVP":Alliance.getInstance().MyIsMVP,
							   "message":message,
					           "type":Constant.ChatType.HELP_FOUNDER_INITIATE,
							   "avatar":AvatarMgr.instance().PlayerAvatar,
							   "avatarFrame":FrameMgr.instance().PlayerHeadFrame,
							   "chatFrame":FrameMgr.instance().PlayerChatFrame,
					           "badge":AvatarMgr.instance().PlayerBadge
					           }; 		
 		
 		addItem(g_itemsAlliance, newItem, false); 		
 		addItem(g_itemsAll, newItem, false);
 		g_isNeedUpdateMes = true;
 	}

 	
 	private var helperNames:String;
 	private var helpItemName:String;
 	private var helpItemIevel:String;
 	private var hasGetInfor:boolean;
 	private var helpItem:HashObject;
 	public function helpInforOfOthers(data:HashObject):void
 	{
 		var cities:Array = _Global.GetObjectKeys(data);
 		var city:HashObject;
 		var keys:Array;
 		var key:String;
 		var item:HashObject;
 		var isTech:boolean;
 		//var message:String;
 		var helps:Array;
 		var help:HashObject;
 		var helpNum:String;
// 		var newItem:Object;

 		for(var a:int = 0; a < cities.length; a++)
 		{
 			city = data[cities[a] + ""];
 			keys = _Global.GetObjectKeys(city);
 			for(var b:int = 0; b < keys.length; b++)
 			{
 				key = keys[b];
 				item = city[key];
 				
 				helperNames = "";
 				
 				helps = _Global.GetObjectKeys(item);
 				isTech = !key.Contains("b_");
 				hasGetInfor = false;
 				for(var c:int = 0; c < helps.length; c++)
 				{
 					help = item[_Global.ap + c] as HashObject;
 					
 					if(!hasGetInfor)
 					{
	 					if(isTech)
		 				{
		 					helpItemName = Research.instance().getResearchNameById(_Global.INT32(help["tid"]));
		 					helpItemIevel = Research.instance().getReseachLvlById(_Global.INT32(help["tid"]));
		 				}
		 				else
		 				{
		 					helpItem = Building.instance().getBuildingObjById(cities[a], _Global.INT32(help["bid"]));
		 					helpItemName = Datas.getArString("buildingName.b" + helpItem[_Global.ap + 0].Value);
		 					helpItemIevel = helpItem[_Global.ap + 1].Value;
	 					}
 						hasGetInfor = true;
 					}
 					
 					helpNum = "( " + help["help_cur"].Value + "/" + help["help_max"].Value + " )";
 					//message = Datas.getArString("AllianceHelp.YouWereHelped", [help["helperName"].Value, helpItemName, helpItemIevel, helpNum]);
 					
 					/*var newItem:Hashtable = { "time":help["time"].Value,
 								"username":help["helperName"].Value,
							   	"message":message,
					           	"type":Constant.ChatType.HELP_FOUNDER_FEEDBACK};
	 				*/
	 				if(c == 0) //helps.length - 1)
	 				{
	 					helperNames += help["helperName"].Value;
	 				}
	 				/*else
	 				{
	 					helperNames += help["helperName"].Value + ", ";
	 				}*/
	 					
	 				//addItem(g_itemsAlliance, newItem, false); 				
 				}
 				helpItemIevel = (_Global.INT32(helpItemIevel) + 1) + "";
 				if(helps.length == 1) //&& !isInChatMenu)
 				{
 					MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Received_Alliance_Help_OK", [helperNames, helpItemIevel, helpItemName, helpNum]));
 				} 
 				else if(helps.length > 1)
 				{
 					MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Received_Multiple_Alliance_Help_OK", [helperNames, helps.length - 1, helpItemIevel, helpItemName, helpNum]));
 				}
 				
 			}
 		}	
 	}
 	
 	private var exceptionNum:int = 0;
 	private var exceptionNumLimit:int = 3;
 	
// 	private function isUserIgnored(userId:int):boolean
// 	{
// 		var currentWorldId:int = Datas.instance().worldid();
//		var key:String = "U" + userId + "_" + currentWorldId;
// 		if(IgnoredUsers == null || IgnoredUsers[key] == null)
// 		{
// 			return false;
// 		}
// 		var ignoredTime:long = _Global.INT64(IgnoredUsers[key]);
// 		var ignoredTimespan:System.TimeSpan = System.TimeSpan( ignoredTime*System.TimeSpan.TicksPerSecond);
//		var curTimespan:System.TimeSpan = System.TimeSpan(GameMain.unixtime()*System.TimeSpan.TicksPerSecond);
//		if(curTimespan.TotalHours - ignoredTimespan.TotalHours >= 24)
//		{
//			return false;
//		}
// 		return true;
// 	}
 	
 	private var maxNumForChatSaved:int = 0;
 	
	private function addItem(_array:Array, messageItem:Hashtable, isForMainCrom:boolean)
	{
		maxNumForChatSaved = isForMainCrom ? 80 : 40;
			
		if(_array.length >= maxNumForChatSaved)
		{
			_array.shift();
		}
		
		_array.push(messageItem);
	}
	
	public function ignoreUser(userId:int, userName:String, resultFunc:Function):void 
	{
		var okFunc:System.Action = function(){
			
//			var params:Array = new Array();
//			params.Add(userId);
//	 		params.Add(1);	
//			
//			var can:Function = function(result:Object)
//			{
//		  		if(result["ok"])
//				{	
//					setIgnoredUsers(userId);
//					MenuMgr.getInstance().PopMenu("");
//					MenuMgr.getInstance().PushMessage(Datas.getArString("Common.actionSucess"));
//					if(resultFunc)
//					{
//						resultFunc(result);
//					}
//		  		}			 
//			};
//			UnityNet.reqIgnoreUser(params, can, null);
			//-----------------------------------------------//
			
			UserSetting.getInstance().IgnoreUser(userId, userName, resultFunc);
		};

		var confirmDialog : ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		confirmDialog.setButtonText(Datas.getArString("Common.OK_Button"),Datas.getArString("Common.Cancel"));
		confirmDialog.setLayout(600,360);
		confirmDialog.setTitleY(60);
		confirmDialog.setContentRect(70,140,0,260);
		MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("Common.ignoreConfirm"), Datas.getArString("Common.ignoreConfirmTitle"), okFunc, null); 	
	}
	
 		
 	private function fireworkSwitch(_message:String):void
 	{
 		if(_message == Datas.getArString("Chat.FireworkTrigger"))
 		{
 			ParticalEffectMgr.getInstance().playEffect(ParticalEffectMgr.ParticalEffectType.chatFirework);
 		}
 	}					
 										
 																		
 	private	function	snowSwitch( message:String ):void{
 		
 		/*
 		if( _Global.IsStrInArray(snowOn, message, true ) ){
 			GameMain.instance().setSnowEffect(true);
 		}else if( _Global.IsStrInArray(snowOff, message, true ) ){
 			GameMain.instance().setSnowEffect(false);
 		}*/
 		
		//if(_Global.IsStrInArray(rainOn, message, true ))
//		if(message == Datas.getArString("Common.RainOn"))
//		{
//			GameMain.instance().setRainEffect(true);
//		}
		//else if(_Global.IsStrInArray(rainOff, message, true ))
//		else if(message == Datas.getArString("Common.RainOff"))
//		{
//			GameMain.instance().setRainEffect(false);
//		}
 	} 
 	
 	private function handleFeatureMsg(message:String):boolean
 	{
// 		if(message == Datas.getArString("Common.RainOn"))
//		{
//			GameMain.instance().setRainEffect(true);
//		}
//		else if(message == Datas.getArString("Common.RainOff"))
//		{
//			GameMain.instance().setRainEffect(false);
//		}
		
		var isFeatureMsg:boolean = false;
		
 		return isFeatureMsg;
 	}
 	
 	private function SendChat(message:String)
	{
		sendChat(g_isGlobal,message,"");
	}

 	private function NewSendMsgItem(sendMessage:String, msgType:String):Hashtable
 	{ 
 		var time:String = GameMain.unixtime().ToString();
		var _seed:HashObject = GameMain.instance().getSeed();
	 	var _username:String = _seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value;
 		
 		var newMsgItem:Hashtable = new Hashtable();
 		newMsgItem = {
 						"chatId":0,
						"username":_username,
						"userid":Datas.instance().tvuid(),
						"time":time,
						"message":sendMessage,
						"type":msgType,
						"avatar":AvatarMgr.instance().PlayerAvatar,
						"avatarFrame":FrameMgr.instance().PlayerHeadFrame,
						"chatFrame":FrameMgr.instance().PlayerChatFrame,
						"badge":AvatarMgr.instance().PlayerBadge
						};
		
		if (msgType != Constant.ChatType.CHAT_ALLIANCE && msgType != Constant.ChatType.CHAT_ALLIANCE_OFFICER) {
			newMsgItem["allianceEmblem"] = AllianceEmblemMgr.instance.playerAllianceEmblem;
		}
		
		return newMsgItem;
 	}
 	
 	private function NewRecvChatMsgItem(chatDataType:int, contentObj:HashObject):Hashtable
 	{ 
 		var _time:String = _Global.INT64(contentObj[_Global.ap + 7]).ToString();
 		
 		var chatType:String = ""; 
 		var addition:String = "";
 		switch (chatDataType)
 		{
 		case ChatDataTypeGlobal: 
 			chatType = Constant.ChatType.CHAT_GLOBLE;
 		break; 
 		case ChatDataTypeAlliance:
 			chatType = Constant.ChatType.CHAT_ALLIANCE;
 			
 			if(contentObj[_Global.ap + 11] != null)
			{
				addition = contentObj[_Global.ap + 11].Value;
			}
			if (addition == Constant.ChatType.CHAT_ALCRQANSWER)
				chatType = Constant.ChatType.CHAT_ALCRQANSWER;
 		break;
 		}
 		
		 var badge:String = (null != contentObj[_Global.ap + 12] ? contentObj[_Global.ap + 12].Value : "");
		 var avatarAndFrame:String = contentObj[_Global.ap + 13].Value;
		var avatar : String = "";
		var avatarFrame : String = "img0";
		var chatFrame : String = "img0";
		var arrMsg : String[] = avatarAndFrame.Split(":"[0]);
		
		if(arrMsg.Length == 3)
		{
			avatar = (arrMsg[0] != null) ? arrMsg[0] : "";
			avatarFrame = arrMsg[1];
			chatFrame = arrMsg[2];
		}
		else
		{
			avatar = avatarAndFrame;
		}
 		//var avatar:String = (null != contentObj[_Global.ap + 13] ? contentObj[_Global.ap + 13].Value : "");
 		var allianceEmblem:AllianceEmblemData = null;
 		if (null != contentObj[_Global.ap + 14] && null == contentObj[_Global.ap + 14].Value as String) {
 			allianceEmblem = new AllianceEmblemData();
 			JasonReflection.JasonConvertHelper.ParseToObjectOnce(allianceEmblem, contentObj[_Global.ap + 14]);
	 	}
 		
 		var newMsgItem:Hashtable = new Hashtable(); 
 		newMsgItem = {
					"chatId":contentObj[_Global.ap + 6].Value,
					"username":contentObj[_Global.ap + 0].Value,
					"userid":contentObj[_Global.ap + 4].Value,
					"time":_time,
					"message":contentObj[_Global.ap + 3].Value,
					"type":chatType, 
					"allianceName":contentObj[_Global.ap + 9].Value, 
					"allianceID":contentObj[_Global.ap + 8].Value,
					"avatar":avatar,
					"avatarFrame":avatarFrame,
					"chatFrame":chatFrame,
					"badge":badge
					};
		
		if (null != allianceEmblem)
			newMsgItem["allianceEmblem"] = allianceEmblem;

		if (contentObj[_Global.ap + 15]!=null) {
			newMsgItem["transLan"]=contentObj[_Global.ap + 15].Value.ToString();
		}
		
		return newMsgItem;
 	}
 	
 	private function NewRecvAllianceHelpMsgItem(chatDataType:int, contentObj:HashObject):Hashtable
 	{ 
 		var city:CityInfo = new CityInfo();
		city.Id = _Global.INT32(contentObj["fromCityId"]);
		city.Name = contentObj["fromCityName"].Value;
		city.X = _Global.INT32(contentObj["fromCityXCoord"]);
		city.Y = _Global.INT32(contentObj["fromCityYCoord"]);
		city.Y = _Global.INT32(contentObj["fromCityYCoord"]);
		
		var res:long[] = [0l,0l,0l,0l,0l];
		res[0] = _Global.INT64(contentObj["gold"]);
		
		var req:AllianceRequest = new AllianceRequest();
		req.city = city;
		req.Type = _Global.INT32(contentObj["requestType"]);
		for(var r:int = 1;r <= 4; r++)
		{
			res[r] = _Global.INT64(contentObj["resource" + r]);
		}
		req.Res = res;
		
		var _time:String = _Global.INT64(contentObj["requestTime"]).ToString();
		
		var newMsgItem:Hashtable = new Hashtable();
		newMsgItem = { 
					"chatId":contentObj["id"].Value,
					"requestId":contentObj["id"].Value,
					"username":contentObj["fromUserName"].Value,
					"userid":contentObj["fromUserId"].Value,
					"time":_time,
					"message":req.ToString(), 
					"type":Constant.ChatType.CHAT_ALCREQUEST,
					"alcrequest":true,
					"requestX":city.X,
					"requestY":city.Y,
					"res":req.Sum(),
					"resArr":req.ResValues(),
					"requestType":req.Type,
					"avatar":_Global.GetString(contentObj["portraitname"]),
					"badge":_Global.GetString(contentObj["badge"])
					};
					
		return newMsgItem;
 	}
 	
 	private function NewExceptionMsgItem(msg:String, msgType:String):Hashtable
 	{ 
	 	var exceptionItem:Hashtable = new Hashtable();
	 	exceptionItem = {
						"username":Datas.getArString("Chat.ExceptionName"), 
						"time":GameMain.unixtime().ToString(),
						"message":msg, 
						"type":msgType
						};
		return exceptionItem;
 	} 
 	 
 	public function sendChat(isGlobal:boolean,message:String,addition:String):void
 	{
 		
 		var sendMessage:String = "";
 		if(String.IsNullOrEmpty(message))
 		{
 			sendMessage = g_messageTxt.GetText();
 			g_messageTxt.SetText("");
 			androidChat.SetText("");
 		}
 		else
 		{
 			sendMessage = message;
 		}
 		sendMessage = sendMessage.Trim();
 		
 		// Lihaojie 2013.06.27: Test message in UnityEditor
 		if (Application.isEditor) 
 		{
 			sendMessage = "Test chat message ";
 			//sendMessage = "/NewUser-41  Test chat message ";
 			//sendMessage = "/NewUser-58  Test chat message ";
 			////sendMessage = "/NewUser-4P  Test chat message ";
 			//sendMessage = "/Joe  Test chat message ";
 			if (g_toolBar.selectedIndex == SheetGlobal)
 				sendMessage += "GlobalChannel";
 			else if (g_toolBar.selectedIndex == SheetAlliance && g_isJoinAlliance)
 			{
				sendMessage += "AllianceMemberChannel";
 			}
 			
 			sendMessage += " " + _Global.DateTime(GameMain.unixtime());
		}
 		
 		if(sendMessage.Length < 1)
 		{
 			return;
 		}
		 if( String.IsNullOrEmpty(m_ReportShareTxt)&&sendMessage.StartsWith("Report(")&&sendMessage.length>7)
		 {
 
			var endIndex:int = sendMessage.IndexOf(")");
			
			if ( endIndex!=-1&&endIndex>7&&  _Global.IsNumber(sendMessage.Substring(7,endIndex-7)))
			   {
				var reportId:int = _Global.INT32(sendMessage.Substring(7,endIndex-7));
				reportId = _Global.INT32(sendMessage.Substring(7,endIndex-7));
				if(reportId!=null&&reportId!=0)
				{
				var  g_header:HashObject =   Message.getInstance().GetAvaMessageByRid(reportId);
				if (g_header!=null)
				{
				
					
					var g_marchType:int = _Global.INT32(g_header["marchtype"]);
					//var corMatshare:Boolean = g_marchType == Constant.MarchType.COLLECT && g_header["boxContent"]["winner"]!=null;
					if(g_marchType == Constant.AvaMarchType.ATTACK || g_marchType == Constant.AvaMarchType.RALLY||g_marchType == Constant.AvaMarchType.RALLYATTACK)
					{
						var isWin:int = g_header["boxContent"]["winner"].Value;
						var atkName:String = g_header["atknm"].Value.ToString();
						var defName:String = g_header["defnm"].Value.ToString();
						m_ReportShareTxt = defName+":"+atkName+":"+isWin+":"+reportId+":"+ KBN.Datas.singleton.worldid()+":"+KBN.GameMain.Ava.Event.GetActId();
						m_StandShareTxt = "Report("+ reportId +")";
					// paramDict.Add("ReportShareTxt",sharereportTxt);
					// MenuMgr.getInstance().PushMenu("AvaChatMenu",paramDict);
					}
				}
				}
		    }

		   
		
		  }
 		if (g_toolBar.selectedIndex == SheetGlobal && !GameMain.instance().AvaGlobalChatEnabled())
 		{
 			var exceptionItem:Hashtable = NewExceptionMsgItem(Datas.getArString("AVA.cannochatinglobal"), Constant.ChatType.CHAT_EXCEPTION);
			addItem(g_itemsGloble, exceptionItem, false);
			
 			return;
 		}
 		
// 		snowSwitch( sendMessage );
		fireworkSwitch(sendMessage);

		//-------------------------------------//
		lastSendChatTime = GameMain.unixtime();			
		//-------------------------------------// 		

 		var params:Array = new Array();
 		var nm:String = "";
 		
 		// Private chat message parse?
 		if(sendMessage.Substring(0,1) == "@" || sendMessage.Substring(0,1) == "/")
 		{
 			var temp:Array = sendMessage.Split(' '[0]);
			
			if(temp.length < 2)
			{
				return;
			}
			
			return;
 		}
 		else
 		{
 			if (g_toolBar.selectedIndex == SheetGlobal)
 			{
 				chatType = ChatDataTypeGlobal;
 				
 				params.Add(chatType);
	 			params.Add(-3);
	 			params.Add(sendMessage); 
 			}
 			else if (g_toolBar.selectedIndex == SheetAlliance)
 			{
 				if(!g_isJoinAlliance)
 					return;
 					 
				chatType = ChatDataTypeAlliance;
 				
 				params.Add(chatType);
 				params.Add(-5);
	 						
	 			params.Add(nm);
	 			params.Add(sendMessage);
 			}
 		}
 		
 		params.Add(chatTypeId);
 		params.Add(nm);
 		params.Add(Datas.instance().worldid());
 		
		//------------------------------------------------------------------------------------------//
		var typeID = params[0];	 			
		var newItem:Hashtable;	
		//var time:String = _Global.HourTime24WithoutSecond(GameMain.unixtime());
		var _seed:HashObject = GameMain.instance().getSeed();
	 	var _username:String = _seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value ;
	 			
//	 	var isMVP : boolean = Alliance.getInstance().MyIsMVP;
		if(typeID == ChatDataTypeAlliance) // Alliance message
		{
			newItem = NewSendMsgItem(sendMessage, Constant.ChatType.CHAT_ALLIANCE);
//			newItem["title"] = userTitle;
//			newItem["isMVP"] = isMVP;
			if(!String.IsNullOrEmpty(m_ReportShareTxt)&&!String.IsNullOrEmpty(m_StandShareTxt)&&sendMessage.StartsWith(m_StandShareTxt))		
			{
				newItem["message"] = m_ReportShareTxt;
				newItem["AVAshareReport"] = true;
			}
			m_ReportShareTxt = "";
			m_StandShareTxt = "";
			addItem(g_itemsAlliance, newItem, false);	
			g_messageTxt.SetText("");
			androidChat.SetText("");
		} 
		else if (typeID == ChatDataTypeGlobal) // Global message
		{ 
			newItem = NewSendMsgItem(sendMessage, Constant.ChatType.CHAT_GLOBLE);
			if(!String.IsNullOrEmpty(m_ReportShareTxt)&&!String.IsNullOrEmpty(m_StandShareTxt)&&sendMessage.StartsWith(m_StandShareTxt))		
			{
				newItem["message"] = m_ReportShareTxt;
				newItem["AVAshareReport"] = true;
			
			}
			m_ReportShareTxt = "";
			m_StandShareTxt = "";
			addItem(g_itemsGloble, newItem, false);	
			g_messageTxt.SetText("");	
			androidChat.SetText("");								
		}
				
		addItem(g_itemsAll, newItem, true);	
 		
		//------------------------------------------------------------------------------------------// 		
 		
		var canSendChat:Function = function(result:HashObject)
		{	 	
	 		if(result["ok"].Value)
	 		{
				if(typeID == ChatDataTypeAlliance)
				{
					//change icon of chat message
//					var title:int = getTitleOfOfficer(Datas.instance().tvuid()+"", result["allianceOfficer"] as HashObject);
//					var isMVPChat : boolean = false;
//					if ( result["allianceOfficer"]["mvp"] != null )
//					{
//						isMVPChat = _Global.INT32(result["allianceOfficer"]["mvp"])==0?false:true;
//					}
//					if(userTitle != title)
//					{
//						userTitle = title;
//						var messageItem:MessageBalloon;
//						
//						var arr:Array = allianceScrollView.getUIObject();
//						
//						for(var a:int = 0; a < arr.length; a++)
//						{
//							messageItem = arr[a];
//							if(messageItem.uid == Datas.instance().tvuid())
//							{
//								messageItem.changeIconForAlliance(userTitle, isMVPChat);
//							}
//						}
//						
//						var arrItems:Array = g_itemsAlliance;
//						var allianceItem:Hashtable;
//						for(var b:int = 0; b < arrItems.length; b++)
//						{
//							allianceItem = arrItems[b];
//							if(_Global.INT32(allianceItem["userid"]) == Datas.instance().tvuid() && allianceItem["title"] != null)
//							{
//								allianceItem["title"] = userTitle;
//							}
//						}
//					}
				}
				
				if (typeID == ChatDataTypeGlobal)
					AvatarMgr.instance().PlayerBadge = (null != result["badge"] ? result["badge"].Value : "");
				
				g_isNeedUpdateMes = true;
	 		}
		};
		
		var canntSendChat:Function = function(erroMsg:String, errorCode:String)
		{			 
			var exceptionItem:Hashtable = NewExceptionMsgItem(Datas.getArString("Chat.NotSent"), Constant.ChatType.CHAT_EXCEPTION);
			
			if(typeID == ChatDataTypeGlobal)
			{
				addItem(g_itemsGloble, exceptionItem, false);
			}
			else if(typeID == ChatDataTypeAlliance)
			{
				addItem(g_itemsAlliance, exceptionItem, false);
			} 
			else
			{
				addItem(g_itemsGloble, exceptionItem, false);
				addItem(g_itemsAlliance, exceptionItem, false);
			}
			
			addItem(g_itemsAll, exceptionItem, true);
			
			g_isNeedUpdateMes = true;
		};	
		
		//--------------------------------------------------------------//
		//UnityNet.reqSendChat(params, canSendChat, canntSendChat);  	
		UnityNet.reqAvaSendChat(params, canSendChat, canntSendChat,addition);  	
		//--------------------------------------------------------------//	
			
 	}
 	
 	public function getChatType():int
 	{
 		return g_toolBar.selectedIndex;
 	}
 	
	function DrawItem() 
	{
		g_toolBar.Draw();
		
		var oldMatrix = GUI.matrix;
		
		// keep aspect adjustment with g_toolBar
		if (g_toolBar.inScreenAspect)
			_Global.MultiplyAspectAdjustMatrix(g_toolBar.rect, g_toolBar.lockWidthInAspect, g_toolBar.lockHeightInAspect);
			
		if (null != notifyBugs && notifyBugs.Length == g_toolBar.toolbarStrings.Length)
		{
			for (var i:int = 0; i < notifyBugs.Length; i++) {
				notifyBugs[i].Draw();
			}
		}
		
		if (g_toolBar.inScreenAspect)
			GUI.matrix = oldMatrix;
		
//		userSettingBtn.Draw();
						
		if(g_toolBar.selectedIndex == SheetGlobal)
		{
			globalContainer.Draw();
		}
		else if (g_toolBar.selectedIndex == SheetAlliance)
		{
			if(g_isJoinAlliance)
			{  
				allianceContainer.Draw(); 
			}
			else
			{
				allianceAlert.Draw();
				allianceBtn.Draw();				
				clone_joinAllianceTip.Draw();			
			}
		}
		
		// Update notice draw
		noticeIcon.Draw(); 
		noticeTitle.Draw(); 
		noticeButton.Draw();
			
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
		
		noticeRow.Draw(); 
		
		g_bgMiddleBodyTop.Draw();
	}
 	public function sendChat(isGlobal:boolean):void
 	{
 		sendChat(isGlobal,null,"");
 	}	
	function DrawTitle()
	{
		g_headMenu.Draw();
	}
	//JIRA 2507 add Toaster
	public function handleNotification(type:String, body:Object):void
	{
		androidChat.handleNotification(type,body);
		switch(type)
		{
			case Constant.Notice.BUILDING_PROGRESS_COMPLETE:
				this.pushMessage(Datas.getArString("ToastMsg.Building_Completed"));
				break;
			case Constant.Notice.RESEARCH_COMPLETE:
				this.pushMessage(Datas.getArString("ToastMsg.Research_Completed"));
				break;
			case Constant.Notice.TRAIN_COMPLETED:
				this.pushMessage(Datas.getArString("ToastMsg.Train_Completed"));
				break;
			case Constant.Notice.MARCH_ITEM_REMOVED:
				var mvo:MarchVO = body as MarchVO;
				if(!mvo)
					break;
				switch(mvo.marchStatus)
				{
				//march to dest. 
					case Constant.MarchStatus.WAITING_FOR_REPORT:	//march to dest .
						this.pushMessage(Datas.getArString("ToastMsg.March_Arrived"));
						break;
					case Constant.MarchStatus.INACTIVE:	//  returned back
						//this.pushMessage(Datas.getArString("ToastMsg.March_Returned"));
						break;
					
				}
				break;
			case Constant.Notice.ALLIANCE_INFO_LOADED:
				// First value the g_isJoinAlliance, it's very important
				CheckIsInAlliance();
				
				indexChangedFunc(g_toolBar.selectedIndex); // Default do some
				if (g_toolBar.selectedIndex == SheetAlliance)
				{
					OnAllianceChatSelected();
					SetAllianceChannelsState();
				}
				break;
		}
	}
	public function Return()
	{
		g_messageTxt.Done();
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

	private function pushMessage(msg:String):void
	{
		MenuMgr.getInstance().PushMessage(msg,Rect(0, -100,640,100),Rect(0,0, 640, 100));
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
	
	//without net request
	public function sendAllianceChat(message:String)
	{
		sendAllianceChat(message, Constant.ChatType.CHAT_ALLIANCE);
	}
	
	public function sendAllianceChat(message:String, chatType:String)
	{
		sendAllianceChat(message, chatType, 0);
	}
	
	public function sendAllianceChat(message:String, chatType:String, requestType:int)
	{
		var typeID:int = 4;	
		var newItem:Hashtable;	
		
//	 	userTitle = Alliance.getInstance().MyOfficerType();
//	 	var isMVP : boolean = Alliance.getInstance().MyIsMVP;

	 	newItem = NewSendMsgItem(message, chatType);
	 	newItem["username"] = KBNPlayer.Instance().getName();
//	 	newItem["title"] = userTitle;
	 	newItem["alcrequest"] = true;
//	 	newItem["isMVP"] = isMVP;
	 	if (chatType == Constant.ChatType.CHAT_ALCREQUEST)
	 	{
		 	newItem["requestType"] = requestType;
	 	}

		addItem(g_itemsAlliance, newItem, false);	
		addItem(g_itemsAll, newItem, true);
		g_isNeedUpdateMes = true;
	}
	
	public function AdjustInputLayout_AfterInputModeChanged(keyboardHeight:float):void
	{
		var sub:float = keyboardHeight - keyboardViewHeight;
		if(g_messageTxt.OnFocus && keyboardViewHeight > 0 && componentMoveIsTop == true && componentMove.rect.y < OriginalYPosition)
		{
			componentMove.rect.y = componentMove.rect.y - sub;

			globalContainer.rect.height = globalContainer.rect.height - sub;
			globalScrollView.AutoLayout();
			globalScrollView.MoveToBottom();

			// allianceContainer.rect.height = allianceContainer.rect.height - sub;
			// allianceScrollView.AutoLayout();
			// allianceScrollView.MoveToBottom();
			
			SyncAllianceScrollViewRect(); 
			allianceScrollView.AutoLayout();
			allianceScrollView.MoveToBottom();
			
			var inputrect:Rect = RealInputRect();
			g_messageTxt.ChangeInputBoxAt(inputrect.x,inputrect.y,inputrect.width,inputrect.height);
		}
	}
	
}
