public class AllianceWallCon extends BaseAllianceTab implements IEventHandler
{
//	public var nav_head :NavigatorHead;
	public var wall_Scrollview : ScrollView;
	public var wallItem:ListItem;
	private var noticeObject:AllianceWallItem;
	private var wallMessageList:Array;//without alliance notice	
	public var g_bgBottom:Label;
	public var g_buttonSend:Button;
	public var g_messageTxt:InputBox;
	public var inputImply:Label;
	
	public var componentMove:ComposedUIObj;
	private var moveToYPosition:int;
	private var moveSpeed:float;
	private var maxStep:int = 5;
	private var componentMoveIsTop:boolean = false;
 	private var keyboardViewHeight:float = 0.0f;
	private var OriginalYPosition:int;
	private var isMoveComponent:boolean;
	private var isMoveUp:boolean = true;
	public var moveStep:int = 0;
	private static var VIEW_HEIGHT:int = 625;
	private static var numLoadWallPF = 2;
	private var g_MessageMaxNum = 50;
	private var bIsEditMode:boolean = false;
	private var editItem:AllianceWallItem;
	private var timeDelay:float = .0;
	private var bNeedAddNotice:boolean = false;
	private var androidChat:AndroidChat;
	
	public function Init():void
	{
		wallItem.Init();
		//	warning below : You are trying to create a MonoBehaviour using the 'new' keyword.
		//		This is not allowed. MonoBehaviours can only be added using AddComponent().
		//noticeObject = new AllianceWallItem();
		wallMessageList = new Array();
		wall_Scrollview.Init();
		g_bgBottom.Init();
		g_bgBottom.useTile = true;
		g_bgBottom.tile = TextureMgr.instance().BackgroundSpt().GetTile("small_bar_bottom");
		//g_bgBottom.tile.name = "small_bar_bottom";	
		g_bgBottom.drawTileByGraphics = true;
		
		g_messageTxt.ActiveClick = handleClickText;
		g_messageTxt.Guid = Constant.InputBoxGuid.ALLIANCEWALL_INPUT;
		g_messageTxt.OnOutInputBox = InputBoxKeyboard_OnOut;
		g_messageTxt.SetInputBoxMaxChars(Constant.ChatMaxLength);
		g_messageTxt.Init();
		
		inputImply.Init();
		inputImply.txt = Datas.getArString("Common.MaxCharacters");
		
		OriginalYPosition = 719 - componentMove.rect.height + 5;
		g_buttonSend.OnClick = handleBtnSend;
		g_buttonSend.txt = Datas.getArString("Common.Send_button");
		
	}
	public function SetAndroidChat(chat:AndroidChat)
	{
		if(chat == null) return;
		androidChat = chat;
		androidChat.allianceRequestPop = null;
		androidChat.sendChat = this.SendChat;
		androidChat.SetChatHistoryHeight = null;
		androidChat.CanShowPlus = this.CanShowPlus;
		androidChat.GetViewY = null;
		androidChat.GetViewHeight = null;
		
	}
	
	private function CanShowPlus():boolean
	{
		return false;
	}
		
	function Draw() 
	{
		GUI.BeginGroup(rect);
		wall_Scrollview.Draw();
		if(RuntimePlatform.Android != Application.platform)	
		{
			componentMove.Draw();
			inputImply.Draw();
		}
		GUI.EndGroup();
	}
	
	private	var seeed:HashObject;
	private	var chatLimitLv:int;
	private	var playerLv:int;

	function Update()
	{
		timeDelay += Time.deltaTime;;
		if(timeDelay >= 0.5)
		{
			timeDelay = .0;
			addComponentToWallScrollView();
		}
		wall_Scrollview.Update();
		if(isMoveComponent)
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
	
	public function InitScrollViewPos()
	{
		if(g_messageTxt.OnFocus)
		{
			wall_Scrollview.rect.height = VIEW_HEIGHT - moveSpeed * maxStep;
			wall_Scrollview.AutoLayout();
			wall_Scrollview.MoveToBottom();
		}
		else
		{
			wall_Scrollview.rect.height = VIEW_HEIGHT;	
			wall_Scrollview.AutoLayout();
			wall_Scrollview.MoveToBottom();				
		}
	}
	
	public function resetBottomOriginalPos():void
	{
		isMoveComponent = false;
		isMoveUp = true;
		moveStep = 0;
		componentMoveIsTop = false;
		componentMove.rect.y = OriginalYPosition;
		wall_Scrollview.rect.height = VIEW_HEIGHT;
		wall_Scrollview.AutoLayout();			
		wall_Scrollview.MoveToTop();								
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
				var inputrect:Rect = RealInputRect();
				g_messageTxt.ChangeInputBoxAt(inputrect.x,inputrect.y,inputrect.width,inputrect.height);
				wall_Scrollview.MoveToTop();
			}
			else
			{
				componentMoveIsTop = false;
				wall_Scrollview.rect.height -= moveSpeed;
				wall_Scrollview.AutoLayout();
				wall_Scrollview.MoveToBottom();
				componentMove.rect.y -= moveSpeed;
			}
		}
		else
		{
			componentMoveIsTop = false;
			moveStep--;
			if(moveStep <= 0)
			{
				isMoveComponent = false;
				isMoveUp = true;
				resetBottomOriginalPos();
			}
			else
			{
				wall_Scrollview.rect.height += moveSpeed;
				wall_Scrollview.AutoLayout();
				wall_Scrollview.MoveToBottom();
				componentMove.rect.y += moveSpeed;
			}			
		}	
	}
	
	private function handleClickText():void
	{
		if(Application.platform == RuntimePlatform.Android)
		{
			isMoveUp = true;
			isMoveComponent = true;	
		}
	}

	private function SendChat(message:String)
	{
		androidChat.TempString = message;
		handleBtnSend();
		androidChat.ShowKeyboard(true);
	}
	private function handleBtnSend() 
	{
		if(isMoveComponent == false || RuntimePlatform.Android == Application.platform) 
		{
			if(bIsEditMode)
				EditAlliceNotice(editItem);
			else
				sendWallText();
		}
	}
	
	public function EditAlliceNotice(item:AllianceWallItem):void
 	{
 		bIsEditMode = false;
 		editItem = null;
 		if(null == item) return;
 		var sendMessage:String = g_messageTxt.GetText();
		if(RuntimePlatform.Android == Application.platform)
 		{
 			sendMessage = androidChat.TempString;
			androidChat.TempString = ""; 
 		}	
 		g_messageTxt.SetText("");
 		androidChat.SetText(""); 		
 		
 		sendMessage = sendMessage.Trim();
 		InputBoxKeyboard_OnOut();
 		if(sendMessage.Length < 1)
 		{
 			return;
 		}
 		Alliance.getInstance().reqEditAllianceNotice(item.messageId,sendMessage,editAllianceNoticeResult);
 		resetBottomOriginalPos();
 	}
	
	public function editAllianceNoticeResult(newItem:Hashtable):void
	{
		var oldItemObject:AllianceWallItem = wall_Scrollview.getUIObjectAt(0) as AllianceWallItem;	
		if(oldItemObject != null)
		{
			oldItemObject.SetRowData(newItem);
			wall_Scrollview.AutoLayout();
			wall_Scrollview.MoveToTop();
		}
	}
	
	
	public function sendWallText():void
 	{
 		var sendMessage:String = g_messageTxt.GetText();
  		if(RuntimePlatform.Android == Application.platform)
 			sendMessage = androidChat.TempString;

  		g_messageTxt.SetText("");
 		androidChat.SetText("");
 		sendMessage = sendMessage.Trim();
 		InputBoxKeyboard_OnOut();
 		
 		if(sendMessage.Length < 1)
 		{
 			return;
 		}
 		
 		Alliance.getInstance().reqSendWallText(sendMessage,sendWallTextResult);
 	}
 	
 	public function sendWallTextResult(newItem:Hashtable)
 	{
 		var temp:AllianceWallItem = wall_Scrollview.getUIObjectAt(0) as AllianceWallItem;
 		if(temp == null) return;
 		var noticeItem:Hashtable;			
		noticeItem = {"messageId":temp.messageId,
				"userId":temp.msgUserId,
				"displayName":temp.userName.txt,
				"officerType":temp.msgAllianceTitle,
				"message": temp.message.txt,
				"type":temp.messageType,
				"lastUpdatedTime":temp.time.txt,
				"modify":temp.bEditVisible,
				"delete":temp.bDeleteVisible};	
 		var newNotice:AllianceWallItem = Instantiate(temp);
 		if(newNotice == null) return;
 		newNotice.SetRowData(noticeItem);
 		newNotice.handlerDelegate = this;
		wall_Scrollview.UnshiftUIObject(newNotice);
		
		var temp2:AllianceWallItem=  wall_Scrollview.getUIObjectAt(1);
		if(temp2 == null) return;
		temp2.SetRowData(newItem);
		temp2.handlerDelegate = this;
		wall_Scrollview.AutoLayout();
		wall_Scrollview.MoveToTop();
 	}
 	
 	public function Return()
	{
		g_messageTxt.Done();
	}
	
	public function Hide()
	{
		isMoveComponent = true;
		isMoveUp = false;
		g_messageTxt.Done();
	}
 	
 	public function InputBoxKeyboard_OnOut()
	{
		if(bIsEditMode) bIsEditMode = false;
		resetBottomOriginalPos();
		g_messageTxt.Done();
	}
	
	private function RealInputRect():Rect
	{
		var x:float = componentMove.rect.x + g_messageTxt.rect.x + 10;
		var y:float = componentMove.rect.y + g_messageTxt.rect.y + 15 + 240;
		var w:float = g_messageTxt.rect.width - 20;
		var h:float = g_messageTxt.rect.height;
		return _Global.UnitySizeToReal(new Rect(x,y,w,h));
	}
	
	public function addComponentToWallScrollView( )
	{
		for(var i:int=0;i<numLoadWallPF;i++)
		{
			if(wallMessageList.length > 0)
			{
				var itemObject:ListItem;
				itemObject = Instantiate(wallItem);
				if(itemObject == null) continue;
				itemObject.SetRowData(wallMessageList.shift());
				itemObject.handlerDelegate = this;					
				wall_Scrollview.UnshiftUIObject(itemObject);
				wall_Scrollview.AutoLayout();
				wall_Scrollview.MoveToTop();
			}
			else
			{
				break;
			}
		}
		if(true == bNeedAddNotice && wallMessageList.length <= 0)
		{
			bNeedAddNotice = false;
			if(noticeObject!=null)
			{
				wall_Scrollview.UnshiftUIObject(noticeObject);
				wall_Scrollview.AutoLayout();
				wall_Scrollview.MoveToTop();
			}
		}
	}
	
	public function getWallContext():void
 	{
 		Alliance.getInstance().reqGetWallText(getWallContextResult);
 	}
 	
 	public function getWallContextResult(result:HashObject):void
 	{
 		var tempArray:Array = _Global.GetObjectValues(result["messages"]);
		var msgItem:HashObject;
		wall_Scrollview.clearUIObject();
		wallMessageList.Clear();
		if(tempArray.length > 0)
		{
			for(var j:int=0; j < tempArray.length; j++)
			{
				msgItem = tempArray[j] as HashObject;
				if(Constant.AllianceWallType.NOTICE == _Global.INT32(msgItem["type"]))
				{
					bNeedAddNotice = true;
					noticeObject = Instantiate(wallItem);
					noticeObject.SetRowData(msgItem.Table);
					noticeObject.handlerDelegate = this;					
				}
				else if (Constant.AllianceWallType.NORMAL == _Global.INT32(msgItem["type"]))
					addWallMessage(msgItem.Table);
			}
			SortWallByMessageId();
			wall_Scrollview.AutoLayout();
			wall_Scrollview.MoveToTop();
		}
 	}
	public function handleNotification(type:String, body:Object):void
	{
		androidChat.handleNotification(type,body);
	}  	
 	public function handleItemAction(action:String,param:Object):void
	{
	
		switch(action)
		{
			case Constant.Action.ALLIANCEWALL_DELETE_ITEM:
				if(g_messageTxt.OnFocus) return;
				var delItem:AllianceWallItem = param as AllianceWallItem;
				if(null == delItem) return;
				var netparams:List.<String> = new List.<String>();
 				netparams.Add("delete");
 				netparams.Add(delItem.messageId.ToString());
				var canDelete:Function = function(result:HashObject)
				{
			 		if(result["ok"].Value)
			 		{
						wall_Scrollview.removeUIObject(delItem);
						wall_Scrollview.AutoLayout();
						wall_Scrollview.MoveToTop();
						delWallMessage(delItem.messageId);
			 		}
			 	};
			 	UnityNet.reqDelAllianceWallText(netparams.ToArray(), canDelete, null);	
				break;
			case Constant.Action.ALLIANCEWALL_EDIT_ITEM:
				androidChat.ShowKeyboard(true);
				if(g_messageTxt.OnFocus) return;
				//isMoveUp = true;
				//isMoveComponent = true;
				bIsEditMode = true;
				editItem = param as AllianceWallItem;
				g_messageTxt.SetFocus();
				wall_Scrollview.MoveToTop();
				break;
			default:
				break;	
		}	
 	}
 	
 	public function setWallItemAdmin(idx:int,bIsAdmin:boolean)
 	{	
 		var oldItemObject:AllianceWallItem = wall_Scrollview.getUIObjectAt(idx) as AllianceWallItem;	
		if(oldItemObject != null)
		{
			oldItemObject.setAdmin(bIsAdmin);
		}
 	}
	
	public function addWallMessage(messageItem:Hashtable)
	{
		
		if(wallMessageList.length >= g_MessageMaxNum-1)
		{
			wallMessageList.Shift();
			wallMessageList.Push(messageItem);
		}
		else
		{
			wallMessageList.Push(messageItem);
		}
	}
	
	public function delWallMessage(messageId:int):boolean
	{
		for(var i:int=0;i<wallMessageList.length;i++)
		{
			if(_Global.INT32((wallMessageList[i] as Hashtable)["messageId"]) == messageId)
			{
				wallMessageList.RemoveAt(i);
				return true;
			}
		}
		return false;
	}
	
	public function SortWallByMessageId()
	{
		wallMessageList.Sort(function (objA:Object,objB:Object){
				return _Global.INT32((objA as Hashtable)["messageId"]) - _Global.INT32((objB  as Hashtable)["messageId"]);
			});
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
	
	public	function	Clear()
	{
		wall_Scrollview.clearUIObject();
	}
	
	public function AdjustInputLayout_AfterInputModeChanged(keyboardHeight:float):void
	{
		var sub:float = keyboardHeight - keyboardViewHeight;
		if(g_messageTxt.OnFocus && keyboardViewHeight > 0 && componentMoveIsTop == true && componentMove.rect.y < OriginalYPosition)
		{
			componentMove.rect.y = componentMove.rect.y - sub;
			wall_Scrollview.rect.height -= sub;
			wall_Scrollview.AutoLayout();
			wall_Scrollview.MoveToBottom();
			var inputrect:Rect = RealInputRect();
			g_messageTxt.ChangeInputBoxAt(inputrect.x,inputrect.y,inputrect.width,inputrect.height);
		}
	}
}
