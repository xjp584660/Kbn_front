class PrivateChatDetail extends SubMenu
{
	// Instantiate prefabs
	public var prefabOne2oneMsgItem:ListItem; // The original MessageItem
	
	public var gotoConvListBtn:Button;
	public var gotoConvListExtBtn:Button;
	
	public var bgBorder:SimpleLabel;
	public var chatingTargetBtn:Button;
	public var cutoffLineLabel:SimpleLabel;
	public var badge:SimpleLabel;
	public var target:SimpleLabel;
	
	public var one2oneMsgsScrollView:ScrollView;
	public var one2oneMsgsContainer:AspectContainer;
	
	//------------------------------------------------------------------ 
	/// Private variables
	//------------------------------------------------------------------ 
	private var one2oneMsgForwardAddIndex:int = 0;
	private var one2oneMsgUnshiftAddIndex:int = 0; 
	
	private var fixedReqTiming:float = 0.0f; 
	private var fixedAysnAddOne2OneItemTiming:float = 0.0f; 
	
	private var parentPrivateSheet:PrivateChatSheet = null;
	private var currDetailConvData:SingleConvData = null;
	private var currOldDetailConvData:SingleConvData = null;
	
	private var lastHasNotice:boolean = false; 
	private var hasBadge:boolean = false;
	
	//----------------------------------------------------------------------
	public function Init(parent:PrivateChatSheet)
	{
		//super.active = true;
		super.enabled = true;
		
		parentPrivateSheet = parent;
		
		one2oneMsgsScrollView.Init(); 
		one2oneMsgsScrollView.clearUIObject(); 
		
		var tempBalloon : MessageBalloon = prefabOne2oneMsgItem as MessageBalloon;
		one2oneMsgsContainer.Init();
		if (_Global.IsTallerThanLogicScreen()) {
			one2oneMsgsContainer.SetAspect(Screen.width, Screen.height, AspectContainer.AspectType.LockWidth);
		}
		if (null != tempBalloon) {
			tempBalloon.avatar.inScreenAspect = _Global.IsShorterThanLogicScreen();
		}
		
		InitVariables();
		RegisterControlsEvent();
		
		DefaultRectNoNotice();
		
		gotoConvListBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_moreinfo_small2_left_normal", TextureType.BUTTON);
		gotoConvListBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_moreinfo_small2_left_down", TextureType.BUTTON);
		bgBorder.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_chat_white1", TextureType.DECORATION);
		bgBorder.mystyle.border = new RectOffset(15, 22, 15, 20);
		bgBorder.rect = new Rect(20, 154, 604, 90);
		gotoConvListBtn.rect = new Rect(30, 175, 43, 43);
		gotoConvListExtBtn.rect = new Rect(0, 154, 150, 90);
		chatingTargetBtn.rect = new Rect(150, 154, 490, 90);
		
		target.normalTxtColor = FontColor.Grey;
		target.font = FontSize.Font_25;
		target.SetFont();
		target.SetVisible(true);
		badge.SetVisible(false);
		
		SetVisible(false);
	}
	
	public function Draw()
	{
		if (!super.visible)
			return;
			
		GUI.BeginGroup(super.rect);
		
		// Notice the draw sequence, can treat as layers
		bgBorder.Draw();	
		gotoConvListBtn.Draw();
		gotoConvListExtBtn.Draw();
		
		badge.Draw();
		target.Draw();
		
		chatingTargetBtn.Draw();
		
//		cutoffLineLabel.Draw();
		
		one2oneMsgsContainer.SetGroupPos(rect.x, rect.y);
		one2oneMsgsContainer.Draw();
		
		GUI.EndGroup();
	}
	
	public function Update()
	{ 
		if (!super.enabled)
			return;
		
		if (!super.visible)
			return;	
			
		one2oneMsgsScrollView.Update(); 
		
		// Fixed request
		if (null != currDetailConvData && one2oneMsgsScrollView.isVisible())
			FixedRequestGetOne2OneData(currDetailConvData.targetId, currDetailConvData.lastestReadedChatId); 
		
		if (null != currOldDetailConvData)
		{
			AsynUnshiftAddOne2OneMsgItems(currOldDetailConvData);
		}
		
		// Asyn add ListItem, avoid cpu block
		if (null != currDetailConvData)
		{ 
			AsynAddOne2OneMsgItems(currDetailConvData); 
		}
	}
	
	public function OnClear()
	{
		//currDetailConvData = null;
		//currOldDetailConvData = null;
		//
		//one2oneMsgForwardAddIndex = 0;
		//one2oneMsgUnshiftAddIndex = 0;
		//one2oneMsgsScrollView.clearUIObject();
	}
	
	public function OnPop()
	{
		super.OnPop();
		
		currDetailConvData = null;
		currOldDetailConvData = null;
	}
	
	public function OnPush(params:Object)
	{
		if (null == params) return;
		
		if(params as Hashtable)
		{
			ShowOne2OneChatingControls(true);
			
			//var targetId:int = _Global.INT32((params as Hashtable)["targetId"]);
			var targetName:String = ((params as Hashtable)["targetName"]) as String;
			var targetBadge:String = ((params as Hashtable)["targetBadge"]) as String;
			hasBadge = !String.IsNullOrEmpty(targetBadge);
			
			var tmpConvData:SingleConvData = parentPrivateSheet.GetSingleConvData(targetName);
			if (null == tmpConvData) return;
			
			// Display the messages
			currOldDetailConvData = new SingleConvData();
			currOldDetailConvData.CopyFrom(tmpConvData); 
			
			one2oneMsgUnshiftAddIndex = 0; // Reset the index flag 
			one2oneMsgsScrollView.clearUIObject();
			
			SetTargetNameAndBadge(targetName, targetBadge);
			 
			 // A new copy data, separate from conversion list
			currDetailConvData = new SingleConvData(); 
			currDetailConvData.targetId = tmpConvData.targetId; 
			currDetailConvData.targetName = tmpConvData.targetName;
			currDetailConvData.targetAllianceId = tmpConvData.targetAllianceId;
			currDetailConvData.targetAllianceName = tmpConvData.targetAllianceName; 
			currDetailConvData.targetAvatar = tmpConvData.targetAvatar;
			currDetailConvData.targetBadge = tmpConvData.targetBadge;
			currDetailConvData.lastestReadedChatId = tmpConvData.lastestReadedChatId; 
			currDetailConvData.newestChatId = tmpConvData.newestChatId;
			
			one2oneMsgForwardAddIndex = currDetailConvData.Count;
			
			// Switch to the one-one private chat window
			// Need the new GET from server?
			UnityNetGetOne2OneChat(currDetailConvData.targetId, currDetailConvData.lastestReadedChatId);
		}
	}
	
	private function SetTargetNameAndBadge(targetName : String, targetBadge : String) : void
	{
		target.mystyle.alignment = TextAnchor.MiddleCenter;
		target.txt = targetName;
		var size:Vector2 = target.mystyle.CalcSize(new GUIContent(target.txt));
		if (hasBadge) {
			badge.SetVisible(true);
			badge.useTile = true;
			badge.tile = TextureMgr.instance().ElseIconSpt().GetTile(targetBadge);
			badge.rect = new Rect((640 - size.x - 50) / 2, 174, 48, 48);
			target.rect = new Rect(badge.rect.xMax + (50 - 48), 174, size.x, 48);
		} else {
			badge.SetVisible(false);
			target.rect = new Rect((640 - size.x) / 2, 174, size.x, 48);
		}
	}
	
	public function SetVisible(visible:boolean)
	{ 
		super.visible = visible;
		ShowOne2OneChatingControls(visible);
		
		if (visible)
		{
			if (null != currDetailConvData)
				UnityNetGetOne2OneChat(currDetailConvData.targetId, currDetailConvData.lastestReadedChatId); 
				
			AdjustRectByChatNotice();
			AdjustRectByInputbox();
		}
	}
	
	private function InitVariables()
	{ 
		currDetailConvData = null;
		currOldDetailConvData = null;
		
		one2oneMsgForwardAddIndex = 0;
		one2oneMsgUnshiftAddIndex = 0;
		
		fixedReqTiming = 0.0f; 
		fixedAysnAddOne2OneItemTiming = 0.0f; 
		
		lastHasNotice = false;
	}
	
	private function RegisterControlsEvent()
	{
		gotoConvListBtn.OnClick = function()
		{
			SetVisible(false);
			parentPrivateSheet.PopSubMenu(this, function()
			{
				parentPrivateSheet.CurrPageIndex = PrivateChatSheet.PrivatePageConvList;
			});
		};
		
		gotoConvListExtBtn.OnClick = gotoConvListBtn.OnClick;
		
		chatingTargetBtn.OnClick = function()
		{
			if (null != currDetailConvData)
			{
				var userInfo = new UserDetailInfo();
				userInfo.userId = currDetailConvData.targetId.ToString();
				userInfo.userName = currDetailConvData.targetName;
				userInfo.allianceId = currDetailConvData.targetAllianceId.ToString();
		 		userInfo.viewFrom = UserDetailInfo.ViewFromOne2OneChat;
		 		MenuMgr.getInstance().PushMenu("PlayerProfile", userInfo, "trans_zoomComp");
			}
		};
	}
	
	private function DefaultRectNoNotice()
	{
		// Rise the all y
		super.rect.y = 20;
		super.rect.height = 840 + 2048; // walk around with wrong clipping to one2oneMsgsContainer
		
		one2oneMsgsContainer.rect.y = 246;
		this.one2oneMsgsScrollView.rect.y = 263;
		this.one2oneMsgsScrollView.rect.height = 635;
	#if UNITY_IPHONE
		// Rise the all y
		one2oneMsgsContainer.rect.height = 592;
	#endif
	}
	
	public function AdjustRectByChatNotice()
	{ 
		/// The all controls is postioning by assume no Notice
		var notice:Notice = ChatNotices.instance().GetCurrentNotice();  
		var currHasNotice:boolean = null != notice;
		 
		if (!lastHasNotice && currHasNotice)
		{  
			// Fall down the all y
			super.rect.y += ChatMenu.NoticeHeight;
			super.rect.height -= ChatMenu.NoticeHeight;  
			
		}
		else if (lastHasNotice && !currHasNotice)
		{    
			// Rise the all y
			DefaultRectNoNotice(); 
		}   
		lastHasNotice = currHasNotice;
	}
		
	public function AdjustRectByInputboxMoving(moveSpeed:int)
	{
		one2oneMsgsContainer.rect.height += moveSpeed;
		
		one2oneMsgsScrollView.AutoLayout();			
		one2oneMsgsScrollView.MoveToBottom();
	} 
	
	public function AdjustRectByInputbox()
	{
		// Has inputbox?
		if (ChatMenu.getInstance().g_buttonSend.isVisible() 
			|| ChatMenu.getInstance().g_messageTxt.isVisible())
		{ 
			var height:int = 620; 
			
			height = ChatMenu.getInstance().componentMove.rect.y - one2oneMsgsContainer.rect.y - 24;
			if (ChatNotices.instance().GetCurrentNotice())
				height -= ChatMenu.NoticeHeight;
			
			height = Mathf.Clamp(height, 0, 620); 
			one2oneMsgsContainer.rect.height = height;
		}
		
		one2oneMsgsScrollView.AutoLayout();			
		one2oneMsgsScrollView.MoveToBottom();
	}
	
	public function resetBottomOriginalPos()
	{ 
		AdjustRectByChatNotice();
		AdjustRectByInputbox();
		one2oneMsgsScrollView.AutoLayout();			
		one2oneMsgsScrollView.MoveToBottom();
	}
	
	private function ShowOne2OneChatingControls(show:boolean)
	{
		gotoConvListBtn.SetVisible(show);
		gotoConvListExtBtn.SetVisible(show);
			
		badge.SetVisible(hasBadge & show);
		chatingTargetBtn.SetVisible(show);
		cutoffLineLabel.SetVisible(show);
		
		one2oneMsgsScrollView.SetAllVisible(show);
	}
	
	private function FixedRequestGetOne2OneData(talkingTargetId:int, lastestChatId:int)
	{
		fixedReqTiming += Time.deltaTime;
		if (fixedReqTiming >= PrivateChatSheet.FixedReqInterval) 
		{
			fixedReqTiming -= PrivateChatSheet.FixedReqInterval;
			UnityNetGetOne2OneChat(talkingTargetId, lastestChatId); 
			
			//Debug.Log("1111111FixedRequestGetOne2OneData.talkingTargetId:" + talkingTargetId.ToString());
		}
	}
	
	public function TrimOne2OneMsgDatas()
	{
		if (null == currDetailConvData)
			return;
			
		if (currDetailConvData.Count >= SingleConvData.ChatingMsgCacheTopLimit)
		{
			var removeCnt:int = currDetailConvData.Count - SingleConvData.ChatingMsgCacheTopLimit;
			currDetailConvData.RemoveRange(0, removeCnt);
			one2oneMsgForwardAddIndex -= removeCnt;
			
			// Trim the conversion data
			var tmpConvData:SingleConvData = parentPrivateSheet.GetSingleConvData(currDetailConvData.targetName);
			if (null != tmpConvData)
			{
				tmpConvData.RemoveRange(0, removeCnt);
			}
		}
	}
	
	public function SendChat(message:String,isShareReport:Boolean,realMsg:String)
	{
		if (null != currDetailConvData)
		{
			// Package send message into our conversation
			var sendMsgData:ChatItemData = ChatItemData.GetChatItemData(message, currDetailConvData.targetName);
			sendMsgData.chatState = ChatItemData.ChatStateReaded;
			if(isShareReport){
				sendMsgData.shareReport = "shareReport";
			}

			parentPrivateSheet.AddSingleConvData(currDetailConvData.targetId, sendMsgData);
			
			currDetailConvData.Add(sendMsgData);
			
			if (realMsg!=null)
			{
				UnityNetSendOne2OneChat(currDetailConvData.targetId, realMsg);
			}
			else
			{
				UnityNetSendOne2OneChat(currDetailConvData.targetId, message);
			}
			
			
			TrimOne2OneMsgDatas();
		}
	}
	
	public function CombineConvDatasAndSort(newDatas:GetOne2OneChatReponse)
	{ 
		if (null == newDatas.newChats || newDatas.newChats.Count == 0)
			return;
		// Not in ignoredlist 
		var isIgnoredUser:boolean = UserSetting.getInstance().isIgnoredUser(newDatas.userId);
		
		var tmpList:List.<ChatItemData> = new List.<ChatItemData>();
		for (var oneChatKeyVal:KeyValuePair.<int, GetOne2OneChatReponse.NewChat> in newDatas.newChats)
		{
			var chatItemData:ChatItemData = 
								ChatItemData.GetChatItemData(newDatas.userId, newDatas.userName, newDatas.allianceName, oneChatKeyVal.Value.avatar, oneChatKeyVal.Value.badge
								, oneChatKeyVal.Key, oneChatKeyVal.Value.message, oneChatKeyVal.Value.dateTime,oneChatKeyVal.Value.transLate,oneChatKeyVal.Value.shareReport);
			chatItemData.chatState = ChatItemData.ChatStateReaded;
			chatItemData.isIgnored = isIgnoredUser;
			
			tmpList.Add(chatItemData);
		} // End for (var oneChatKeyVal in playerChatKeyVal.Value.newChats) 
		
		tmpList.Sort(SingleConvData.SortCompareByChatId); 
		for (var i:int = 0; i < tmpList.Count; i++)
		{ 
			currDetailConvData.Add(tmpList[i]);
		}
		
		TrimOne2OneMsgDatas();
	}
	
	// UnityNetGetOne2OneChat
	private function UnityNetGetOne2OneChat(userId:int, lastestChatId:int)
	{ 
		var reqParams:Hashtable = new Hashtable(); 
		reqParams.Add("type", "detail"); 
		reqParams.Add("userId", userId);
		reqParams.Add("lastChatId", lastestChatId);
		
		UnityNet.reqGetOne2OneChat(reqParams, GetOne2OneChatOk, GetOne2OneChatError);
	}
	
	// UnityNetGetOne2OneChat callback
	private function GetOne2OneChatOk(result:HashObject)
	{
		// Debug.Log("---------------------:" + result.ToString());
		
		var responeData:GetOne2OneChatReponse = new GetOne2OneChatReponse();
		JasonConvertHelper.ParseToObjectOnce(responeData, result); 
		parentPrivateSheet.CombineConvDatasAndSort(responeData); // Combine the new datas
		
		//Debug.Log("GetOne2OneChatOk.responeData.userId:" + responeData.userId);
		//Debug.LogWarning("result:  " + result);
		// Flush the detail chat data
		if (null != currDetailConvData 
				&& String.Equals(currDetailConvData.targetName, responeData.userName))
		{
			parentPrivateSheet.UpdateSingleConvData(responeData.userName, responeData.userId); 
			CombineConvDatasAndSort(responeData);
		}
		
		parentPrivateSheet.SaveConvDatas();
	}
	
	// UnityNetGetOne2OneChat callback
	private function GetOne2OneChatError(msg:String, errorCode:String)
	{
		//Debug.Log("GetOne2OneChatError");
	}

	// UnityNetSendOne2OneChat
	private function UnityNetSendOne2OneChat(recipientId:int, message:String)
	{ 
		var reqParams:Hashtable = new Hashtable(); 
		reqParams.Add("type", "send");
		reqParams.Add("recipient", recipientId);
		reqParams.Add("comment", message);
		
		UnityNet.reqSendOne2OneChat(reqParams, SendOne2OneChatOk, SendOne2OneChatError);
	}
	
	// UnityNetSendOne2OneChat callback
	private function SendOne2OneChatOk(result:HashObject)
	{
		//Debug.Log("SendOne2OneChatOk");
		
		var responeData:SetOne2OneChatReponse = new SetOne2OneChatReponse();
		JasonConvertHelper.ParseToObjectOnce(responeData, result);
		
		if (null != currDetailConvData)
		{
			parentPrivateSheet.UpdateSendNewChatId(currDetailConvData.targetName, responeData.chatId);
		}
		
		parentPrivateSheet.SaveConvDatas();
	}
	
	// UnityNetSendOne2OneChat callback
	private function SendOne2OneChatError(msg:String, errorCode:String)
	{
		//Debug.Log("SendOne2OneChatError");
	}
	
	private function AsynAddOne2OneMsgItems(singleConvData:SingleConvData)
	{   
		fixedAysnAddOne2OneItemTiming += Time.deltaTime;
		if (fixedAysnAddOne2OneItemTiming >= PrivateChatSheet.FixedAysnAddItemInterval)
		{ 
			fixedAysnAddOne2OneItemTiming -= PrivateChatSheet.FixedAysnAddItemInterval;
			
			// All reduce the IgnoredCount
			var addCountPerFrame:int = 0;
			while (one2oneMsgForwardAddIndex < singleConvData.Count && addCountPerFrame < PrivateChatSheet.SynCntPerFrame)
			{  
				var thisFrameAddCntLimit:int = one2oneMsgForwardAddIndex + PrivateChatSheet.SynCntPerFrame;
				for (var i:int = one2oneMsgForwardAddIndex; i < singleConvData.Count && i < thisFrameAddCntLimit; i++)
				{ 
					AddListItem(one2oneMsgsScrollView, PrivateChatSheet.ChatingMsgTopLimit, singleConvData.GetChatData(i).ToMessageItem(), prefabOne2oneMsgItem);
					one2oneMsgForwardAddIndex++; 
					addCountPerFrame++;
				}
				
				one2oneMsgsScrollView.AutoLayout();
				one2oneMsgsScrollView.MoveToBottom();
			}
		}
	}  
	
	private function AsynUnshiftAddOne2OneMsgItems(singleConvData:SingleConvData)
	{   
		fixedAysnAddOne2OneItemTiming += Time.deltaTime;
		if (fixedAysnAddOne2OneItemTiming >= PrivateChatSheet.FixedAysnAddItemInterval)
		{ 
			fixedAysnAddOne2OneItemTiming -= PrivateChatSheet.FixedAysnAddItemInterval;
			
			// All reduce the IgnoredCount
			var addCountPerFrame:int = 0;
			while (one2oneMsgUnshiftAddIndex < singleConvData.Count && addCountPerFrame < PrivateChatSheet.SynCntPerFrame)
			{  
				var startIndex:int = singleConvData.Count - one2oneMsgUnshiftAddIndex - 1;
				var thisFrameAddCntLimit:int = startIndex - PrivateChatSheet.SynCntPerFrame; 
				for (var i:int = startIndex; i >= 0 && i >= thisFrameAddCntLimit; i--)
				{ 
					UnshiftAddListItem(one2oneMsgsScrollView, PrivateChatSheet.ChatingMsgTopLimit, singleConvData.GetChatData(i).ToMessageItem(), prefabOne2oneMsgItem);
					one2oneMsgUnshiftAddIndex++; 
					addCountPerFrame++;
				}
				
				one2oneMsgsScrollView.AutoLayout();
				one2oneMsgsScrollView.MoveToBottom();
			}
		}
	} 
	
	private function AddListItem(scrollView:ScrollView, topLimit:int, itemData:Object, prefabItem:ListItem):ListItem
	{  
		var itemObject:ListItem = null;
		var balloon1:MessageBalloon = null;
		var balloon2:MessageBalloon = null;
		var balloon3:MessageBalloon = null;
		var dObj:UIObject = null;
		
		while (scrollView.numUIObject >= topLimit)
		{
			dObj = scrollView.shiftUIObject(); 
			dObj.OnClear();
			UIObject.TryDestroy(dObj);
		}
		
		itemObject = Instantiate(prefabItem);
		itemObject.Init();
		itemObject.SetRowData(itemData);
		scrollView.addUIObject(itemObject); 
		
		balloon1 = scrollView.getUIObjectAt(0) as MessageBalloon;
		if (null != balloon1)
			balloon1.SetTimeSeparatorVisible(true);
			
		balloon1 = scrollView.getUIObjectAt(scrollView.numUIObject - 1) as MessageBalloon;
		balloon2 = scrollView.getUIObjectAt(scrollView.numUIObject - 2) as MessageBalloon;
		if (null != balloon1 && null != balloon2) {
			if (balloon1.timestamp - balloon2.timestamp > ChatMenu.TimeSeparatorInterval1) {
				balloon1.SetTimeSeparatorVisible(true);
				return itemObject;
			}
		}
		
		for (var i : int = scrollView.numUIObject - 2; i >= 0; i--) {
			balloon3 = scrollView.getUIObjectAt(i) as MessageBalloon;
			if (null != balloon3 && balloon3.isTimeSeparatorVisible) {
				break;
			}
		}
		if (null != balloon1 && null != balloon3 && 
			(!balloon3.isTimeSeparatorVisible ||
				balloon1.timestamp - balloon3.timestamp > ChatMenu.TimeSeparatorInterval2)) {
			balloon1.SetTimeSeparatorVisible(true);
		}
		
		return itemObject;
	}
	
	private function UnshiftAddListItem(scrollView:ScrollView, topLimit:int, itemData:Object, prefabItem:ListItem):ListItem
	{  
		var itemObject:ListItem = null;
		var balloon1:MessageBalloon = null;
		var balloon2:MessageBalloon = null;
		
		// we do not delete the newest messages, so just cut off the olders
		if (scrollView.numUIObject >= topLimit)
			return null;
		
		balloon1 = scrollView.getUIObjectAt(0) as MessageBalloon;
		
		itemObject = Instantiate(prefabItem);
		itemObject.SetRowData(itemData);
		scrollView.UnshiftUIObject(itemObject);
		
		balloon2 = scrollView.getUIObjectAt(0) as MessageBalloon;
		if (null != balloon2) {
			balloon2.SetTimeSeparatorVisible(true);
		}
		
		if (null != balloon1 && null != balloon2) {
			if (balloon1.timestamp - balloon2.timestamp <= ChatMenu.TimeSeparatorInterval1)
				balloon1.SetTimeSeparatorVisible(false);
		}
		
		return itemObject;
	}
}
