import System.Collections;
import System.Collections.Generic;
import JasonReflection;
import System.Text;

class PrivateChatSheet extends MonoBehaviour
{ 
	//------------------------------------------------------------------  
	/// Public variables in inspector
	//------------------------------------------------------------------ 
	// Instantiate prefabs
	public var prefabChatRecordItem:ListItem;

	public var chatDetailMenu:PrivateChatDetail;
	
	public var blankConvListPrompt:Label;
	public var conversationScrollView:ScrollView;
	
	public var msgCountLabel:Label;
	public var newMsgCountLabel:Label;  
	public var msgCountSuffix:Label;
	public var newMsgCountSuffix:Label; 
	
	public var selectAllConvs:CheckBox;
	
	public var editBtn:Button;
	public var cancelBtn:Button;
	public var emptyBtn:Button;
	public var deleteBtn:Button;
	
	public var bottomBGLabel:Label;
	
	public var tmpConvItem:ConversationItem;
	
	@HideInInspector public var NewestChatId:int = -1;
	
	//------------------------------------------------------------------ 
	/// Private variables
	//------------------------------------------------------------------ 
	public static var ConvListToplimit:int = 20;
	public static var One2OneMsgRecordCnt:int = 5;  
	public static var ChatingMsgTopLimit:int = 100;
	
	public static var FixedReqInterval:float = 30.0f; 
	public static var SynCntPerFrame:int = 2;
	public static var FixedAysnAddItemInterval:float = 0.1f;
 
 	public static var PrivatePageConvList:int = 0; 
 	public static var PrivatePageOne2OneList:int = 1; 
 	
 	// In which page
 	private var currPage:int = PrivatePageConvList;
 	
	private var conversationDatas:List.<SingleConvData> = null; // Generic class List<> 
	private var currDetailConvData:SingleConvData = null;
	
	private var convListDrawIndex:int = 0;
	
	private var fixedReqTiming:float = 0.0f; 
	private var fixedAysnAddConvItemTiming:float = 0.0f;
	
	private var isInEdit:boolean = false;
	//----------------------------------------------------------------------
	private var lastHasNotice:boolean = false; 
	private var objTrans:SingleObjTransition = new SingleObjTransition();
	 
	//----------------------------------------------------------------------
	public function Init()
	{
		//super.active = true;
		super.enabled = true;
		
		chatDetailMenu.Init(this);  
		
		conversationScrollView.Init(); 
		conversationScrollView.clearUIObject();
		
		InitVariables();
		LocalizeWords();
		RegisterControlsEvent(); 
		
		DefaultRectNoNotice();
		LoadConvDatasFromLocalCaches(); 
		
		ShowConversationControls(true); 
		ShowEditStatusControls(false);
		blankConvListPrompt.SetVisible(false);
		
	}
	
	public function Draw()
	{
		// Notice the draw sequence, can treat as layers	
		chatDetailMenu.Draw();
		
		conversationScrollView.Draw();
		
		blankConvListPrompt.Draw();
		
		bottomBGLabel.Draw();
		msgCountLabel.Draw();
		newMsgCountLabel.Draw(); 
		newMsgCountSuffix.Draw();
		 
		selectAllConvs.Draw();
		
		editBtn.Draw();
		cancelBtn.Draw();
		emptyBtn.Draw();
		deleteBtn.Draw();
		
		//tmpConvItem.Draw();
	}
	
	public function Update()
	{ 
		if (!super.enabled)
			return;
		
		if (CurrPageIndex == PrivatePageConvList) 
		{	
			conversationScrollView.Update();
			
			// Asyn add ListItem, avoid cpu block
			if (!isInEdit) // Not in edit mode
			{
				// Fixed request
				FixedRequestGetConvDatas();
				AsynAddConvItems();  
			}
		}
		else if (CurrPageIndex == PrivatePageOne2OneList)
		{
			chatDetailMenu.Update();
		}
			 
		// Not have notification, so call it like ChatMenu code
		AdjustRectByChatNotice();
		objTrans.Update();
	} 
	
	public function OnClear()
	{
		chatDetailMenu.OnClear();
	}
	
	public function SetVisible(visible:boolean)
	{
		if (visible)
		{ 
			var chatMenu:ChatMenu = MenuMgr.getInstance().getChatMenu();
			if (CurrPageIndex == PrivatePageConvList) 
			{
				RequestGetConvDatas(); 
				
				ShowTextField(false);  
				
				CalcConvListMsgsCount();
				SynConvItemsDisplay();
				
				chatMenu.g_headMenu.setPaymentContentsVisible(false);
			}
			else if (CurrPageIndex == PrivatePageOne2OneList)
			{ 
				ShowTextField(true);
				chatDetailMenu.SetVisible(visible);	 
				
				chatMenu.g_headMenu.setPaymentContentsVisible(true);
			}
		}
		
		// Note: reduce the cpu usage
		super.enabled = visible;
	} 
	
	public function set CurrPageIndex(value:int) 
	{ 
		currPage = value;  
		
		var chatMenu:ChatMenu = MenuMgr.getInstance().getChatMenu();
		if (CurrPageIndex == PrivatePageConvList) 
		{
			RequestGetConvDatas(); 
			
			ShowTextField(false);
			ShowConversationControls(true); 
			ShowEditStatusControls(false); 
			
			chatMenu.g_headMenu.setPaymentContentsVisible(false);
		}
		else if (CurrPageIndex == PrivatePageOne2OneList)
		{
			ShowTextField(true);
			ShowConversationControls(false); 
			
			chatDetailMenu.SetVisible(true);
			chatMenu.g_headMenu.setPaymentContentsVisible(true);
			chatMenu.androidChat.OnIndexChanged();
		}
	} 
	
	public function get CurrPageIndex() { return currPage; }
	
	public function PopSubMenu(subMenu:UIObject, endDel:Function)
	{
		objTrans.BeginPop(subMenu, endDel);
	}
	 
	private function InitVariables()
	{  
		currPage = PrivatePageConvList;
		
		conversationDatas = new System.Collections.Generic.List.<SingleConvData>(); 
		convListDrawIndex = 0;
		
		fixedReqTiming = 0.0f; 
		fixedAysnAddConvItemTiming = 0.0f;  
		
		isInEdit = false;
		
		lastHasNotice = false;
	}
	
	private function LocalizeWords()
	{
		blankConvListPrompt.txt = Datas.getArString("Chat.BlankConversationList");
		
		editBtn.txt = Datas.getArString("Common.Edit");
		cancelBtn.txt = Datas.getArString("Common.Cancel");
		emptyBtn.txt = Datas.getArString("Common.Empty");
		deleteBtn.txt = Datas.getArString("MessagesModal.Delete_button"); 
		
		msgCountSuffix.txt = Datas.getArString("Common.New"); 
		newMsgCountSuffix.txt = Datas.getArString("Common.New"); 
	}
	
	private function RegisterControlsEvent()
	{
		/// ----Select all check box event----
		selectAllConvs.OnSelectChanged = function(self:CheckBox, isSelected:boolean)
		{
			var listItem:ConversationItem = null;
			for (var i:int = 0; i < conversationScrollView.numUIObject; i++)
			{
				listItem = conversationScrollView.getUIObjectAt(i) as ConversationItem;
				if (null == listItem) continue;
				
				listItem.SetSelect(isSelected);
			}			
		};
		
		editBtn.OnClick = function()
		{  
			isInEdit = true;
			
			selectAllConvs.IsSelect = false;
			ShowEditStatusControls(true);
			
			var listItem:ConversationItem = null;
			for (var i:int = 0; i < conversationScrollView.numUIObject; i++)
			{
				listItem = conversationScrollView.getUIObjectAt(i) as ConversationItem;
				if (null == listItem) continue;
				
				listItem.SetSelect(false);
			}
		};
		
		cancelBtn.OnClick = function()
		{  	 
			isInEdit = false;
			ShowEditStatusControls(false); 
		};
		
		emptyBtn.OnClick = function()
		{
			if (conversationDatas.Count == 0) return;
			
			var dialogOk:System.Action.<System.Object> = function(p:System.Object)
			{
				RequestDeleteConvDatas(conversationDatas);
			
				convListDrawIndex = 0;
				conversationDatas.Clear();
				conversationScrollView.clearUIObject();
				
				selectAllConvs.IsSelect = false; 
				CalcConvListMsgsCount();
				
				ChatMsgDB.GetInstance().DeleteDBFile();
			};
			
			OpenDialog(Datas.getArString("Chat.DeleteAllConversation"), dialogOk, null);
		};
		
		deleteBtn.OnClick = function()
		{
			var listItem:ConversationItem = null;
			var uiObjsCnt:int = conversationScrollView.numUIObject; 
			if (uiObjsCnt == 0) return;
			
			var delItems:List.<ConversationItem> = new List.<ConversationItem>();
			var delSingleConvDatas:List.<SingleConvData> = new List.<SingleConvData>();
			for (var i:int = 0; i < uiObjsCnt; i++)
			{
				listItem = conversationScrollView.getUIObjectAt(i) as ConversationItem;
				if (null == listItem) continue;
				
				if (listItem.IsSelected())
				{
					delItems.Add(listItem);
					
					delSingleConvDatas.Add(GetSingleConvData(listItem.Data.targetName));
					RemoveSingleConvData(listItem.Data.targetName);
				} // End if (listItem.IsSelected())
			}  
			
			for (var j:int = 0; j < delItems.Count; j++)
			{
				conversationScrollView.removeUIObject(delItems[j]);
					
				delItems[j].OnClear();
				UIObject.TryDestroy(delItems[j]);
			}
			
			conversationScrollView.AutoLayout();
			conversationScrollView.MoveToTop(); 
			
			RequestDeleteConvDatas(delSingleConvDatas);
			convListDrawIndex -= delSingleConvDatas.Count; 
			
			isInEdit = false;
			selectAllConvs.IsSelect = false;
			ShowEditStatusControls(false);
			CalcConvListMsgsCount();
			
			SaveConvDatas();
			
			delItems.Clear(); 
			delItems = null;
			
			delSingleConvDatas.Clear(); 
			delSingleConvDatas = null; 
		};
	}
	  
	private function DefaultRectNoNotice()
	{
		blankConvListPrompt.rect.y = 172; 
			
		conversationScrollView.rect.y = 170;
		conversationScrollView.rect.height = 705;
	}
	
	private function AdjustRectByChatNotice()
	{ 
		/// The all controls is postioning by assume no Notice
		var notice:Notice = ChatNotices.instance().GetCurrentNotice();  
		var currHasNotice:boolean = null != notice;
		if (!lastHasNotice && currHasNotice)
		{  
			// Fall down the all y 
			blankConvListPrompt.rect.y += ChatMenu.NoticeHeight; 
			
			conversationScrollView.rect.y += ChatMenu.NoticeHeight;
			conversationScrollView.rect.height -= ChatMenu.NoticeHeight; 
		}
		else if(lastHasNotice && !currHasNotice)
		{    
			// Rise the all y 
			DefaultRectNoNotice();
		}  
		
		chatDetailMenu.AdjustRectByChatNotice();
		
		lastHasNotice = currHasNotice;
	}  
	
	public function AdjustRectByInputboxMoving(moveSpeed:int)
	{
		//Debug.Log("AdjustRectByInputboxMoving");
		if (CurrPageIndex == PrivatePageOne2OneList)
		{
		//	Debug.Log("AdjustRectByInputboxMoving:CurrPageIndex == PrivatePageOne2OneList");
			chatDetailMenu.AdjustRectByInputboxMoving(moveSpeed);
		}
	} 
	
	public function resetBottomOriginalPos()
	{
		//Debug.LogWarning(">>>>>>>>resetBottomOriginalPos");
		chatDetailMenu.resetBottomOriginalPos();
	}
	
	private function ShowTextField(show:boolean)
	{
		ChatMenu.getInstance().g_messageTxt.SetVisible(show);
		ChatMenu.getInstance().g_buttonSend.SetVisible(show); 
		ChatMenu.getInstance().inputImply.SetVisible(show);  
		ChatMenu.getInstance().g_bgBottom.SetVisible(show);  
		
		if (show)
		{
			ChatMenu.getInstance().androidChat.OnIndexChanged();
			var topMenu : KBNMenu = MenuMgr.getInstance().Top() as KBNMenu;
			if( topMenu != null ){
				ChatMenu.getInstance().androidChat.ShowChatBar(topMenu.menuName);
			}
		}
		else
		{
			ChatMenu.getInstance().androidChat.CloseChatBar();
		}
		
		ChatMenu.getInstance().g_buttonRequest.SetVisible(false); 
		
		if (show)
		{
			ChatMenu.getInstance().g_buttonSend.rect.width = 170;	
		} 
		else
		{
			ChatMenu.getInstance().g_messageTxt.Done();
		}
	}
	
	private function ShowConversationControls(show:boolean)
	{
		// Opposite visibility 
		conversationScrollView.SetAllVisible(show);
		
		msgCountLabel.SetVisible(show);
		newMsgCountLabel.SetVisible(show); 
		msgCountSuffix.SetVisible(show);
		newMsgCountSuffix.SetVisible(show);
		
	 	selectAllConvs.SetVisible(show);
		 
		editBtn.SetVisible(show);
		cancelBtn.SetVisible(show);
		emptyBtn.SetVisible(show);
		deleteBtn.SetVisible(show);
		
		bottomBGLabel.SetVisible(show);
	} 
	
	private function ShowEditStatusControls(show:boolean)
	{ 
		var listItem:ConversationItem = null;
		for (var i:int = 0; i < conversationScrollView.numUIObject; i++)
		{
			listItem = conversationScrollView.getUIObjectAt(i) as ConversationItem;
			if (null == listItem) continue;
			
			listItem.ShowSelect(show);
		}
			
		editBtn.SetVisible(!show);
		emptyBtn.SetVisible(!show);
		
		cancelBtn.SetVisible(show);
		deleteBtn.SetVisible(show);
		
		selectAllConvs.SetVisible(show);
		
		msgCountLabel.SetVisible(!show);
		newMsgCountLabel.SetVisible(!show); 
		msgCountSuffix.SetVisible(!show);
		newMsgCountSuffix.SetVisible(!show);
	}
	
	private function OnConvItemGotoDetail(item:ConversationItem)
	{   
		// One-One chating messages
		if (null != item.Data) 
		{ 
			var tmpConvData:SingleConvData = GetSingleConvData(item.Data.targetName);
			if (null != tmpConvData)
				tmpConvData.MarkReaded(0, tmpConvData.Count); 
			
			CurrPageIndex = PrivatePageOne2OneList; 
			
			var params:Hashtable = new Hashtable(); 
			//params["targetId"] = item.Data.targetId;
			params["targetName"] = item.Data.targetName;
			params["targetBadge"] = item.Data.targetBadge;
			objTrans.BeginPush(chatDetailMenu, params, null);  
		} 
	}
	
	private function CalcConvListMsgsCount()
	{
		var msgCnt:int = conversationDatas.Count;
		
		// Calculate unread conversation message
		var newMsgCnt:int = 0; 
		for (var i:int = 0; i < msgCnt; i++)
		{ 
			if (conversationDatas[i].HasUnreadMsg())
			{
				newMsgCnt++;
			}
		}
		
		msgCountLabel.txt = String.Format(Datas.getArString("Chat.ConversationNumber"), msgCnt, ConvListToplimit);
		newMsgCountLabel.txt = newMsgCnt.ToString();
		
		if (msgCnt >= ConvListToplimit)
		{
			SetTextColor(msgCountLabel, Color.red);
		}
		else
		{
			SetTextColor(msgCountLabel, Color.white);
		}
		
		blankConvListPrompt.SetVisible(msgCnt <= 0);
	}
	
	private function CalcOne2OneMsgsCount()
	{
		var msgCnt:int = 20;
		var newMsgCnt:int = 10;
		
		msgCountLabel.txt = msgCnt.ToString();
		newMsgCountLabel.txt = newMsgCnt.ToString();
	}
	
	private function OpenDialog(content:String, okFunc:System.Action.<System.Object>, cancelFunc:System.Action.<System.Object>)
	{
		var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		dialog.setLayout(600, 380);
		dialog.setTitleY(60);
		dialog.setContentRect(70, 140, 0, 100);
		MenuMgr.getInstance().PushConfirmDialog(content, "", okFunc, cancelFunc, true);
		// dialog.setDefaultButtonText();
	}
	
	public function SendChat(message:String,isshare:Boolean,realMsg:String)
	{
		chatDetailMenu.SendChat(message,isshare,realMsg);
	}
	
	private function RequestGetConvDatas()
	{
		var params:Array = new Array();
		
		for (var i:int = 0; i < conversationDatas.Count; i++)
		{
			params.Add(conversationDatas[i].targetId);
			params.Add(conversationDatas[i].newestChatId);
		}
		
		UnityNetGetConversationDatas(params);
		params = null;
	}
	
	private function RequestDeleteConvDatas(deleteList:List.<SingleConvData>)
	{
		var params:Array = new Array();
		
		for (var i:int = 0; i < deleteList.Count; i++)
		{
			params.Add(deleteList[i].targetId);
			params.Add(deleteList[i].newestChatId);
		}
		
		UnityNetDeleteConversationDatas (params);
		params = null;
	}
	
	private function FixedRequestGetConvDatas()
	{
		fixedReqTiming += Time.deltaTime;
		if (fixedReqTiming >= FixedReqInterval) 
		{
			fixedReqTiming -= FixedReqInterval;
			RequestGetConvDatas();
		}
	} 
	
	private function TrimConvDatas()
	{
		// Cutoff the old conversation data in current cache
		if (conversationDatas.Count > ConvListToplimit) 
		{
			// Notify the server to delete
			var delSingleConvDatas:List.<SingleConvData> = new List.<SingleConvData>();
			for (var i:int = ConvListToplimit; i < conversationDatas.Count; i++)
			{
				delSingleConvDatas.Add(conversationDatas[i]);
			}
			RequestDeleteConvDatas(delSingleConvDatas);
			delSingleConvDatas = null;
			
			// Remove the end data,because they is oldest data 
			var removeCnt:int = conversationDatas.Count - ConvListToplimit;
			conversationDatas.RemoveRange(ConvListToplimit, removeCnt);
			
			//convListDrawIndex -= removeCnt; // Adjust the convListDrawIndex to adapt the new list
			//if (convListDrawIndex < 0) convListDrawIndex = 0;
		}
		
		NewestChatId = -1;
		for (var convIndex:int = 0; i < conversationDatas.Count; i++)
		{
			NewestChatId = NewestChatId < conversationDatas[i].newestChatId ? conversationDatas[i].newestChatId : NewestChatId;
		}
	}
	
	public function CombineConvDatasAndSort(newDatas:GetConversationsReponse)
	{ 
		if (null == newDatas.playerInfos 
			|| null == newDatas.playerChats || newDatas.playerChats.Count == 0)
			return;
		
		var seed:HashObject = GameMain.instance().getSeed();
	 	var username:String = seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value;
	 	var userId:int = Datas.instance().tvuid();
	 	
		// Traverse the Dictionary, 3 layers
		for (var playerKeyVal:System.Collections.DictionaryEntry in newDatas.playerInfos)
		{  
			// Not self
			var playerId:int = _Global.INT32(playerKeyVal.Key); 
			if (playerId == userId) continue; 
			
			var isNewData:boolean = false;
			for (var playerChatKeyVal:System.Collections.DictionaryEntry in newDatas.playerChats)
			{
				var singleConvData:SingleConvData = null; 
				
				if (playerKeyVal.Key == playerChatKeyVal.Key)
				{
					var playerInfo:GetConversationsReponse.PlayerInfo = playerKeyVal.Value as GetConversationsReponse.PlayerInfo;
					
					//var playerId:int = _Global.INT32(playerChatKeyVal.Key);
					var playerName:String = playerInfo.userName;
					singleConvData = GetSingleConvData(playerId);
					
					// Not in ignoredlist 
					var isIgnoredUser:boolean = UserSetting.getInstance().isIgnoredUser(playerId);
					if (null == singleConvData && isIgnoredUser)
					{
						// Not cache it
						break; 
					}  
					else if (null == singleConvData)
					{  
						isNewData = true;
						singleConvData = new SingleConvData();
					}
					
					var playerChatInfo:GetConversationsReponse.PlayerChatInfo = playerChatKeyVal.Value as GetConversationsReponse.PlayerChatInfo;
					
					// Add the new chats  
					var tmpList:List.<ChatItemData> = new List.<ChatItemData>();
					for (var oneChatKeyVal:System.Collections.DictionaryEntry in playerChatInfo.newChats)
					{
						var chatId:int = _Global.INT32(oneChatKeyVal.Key);
						var oneChat:GetConversationsReponse.PlayerChatInfo.NewChat = 
											oneChatKeyVal.Value as GetConversationsReponse.PlayerChatInfo.NewChat;
						var chatItemData:ChatItemData = ChatItemData.GetChatItemData(playerId, playerInfo.userName
											, playerInfo.allianceName , oneChat.avatar, oneChat.badge, chatId
											, oneChat.message, oneChat.dateTime,oneChat.transLate,oneChat.shareReport);
						chatItemData.chatState = ChatItemData.ChatStateUnread;
						chatItemData.isIgnored = isIgnoredUser;
						
						tmpList.Add(chatItemData);
					} // End for (var oneChatKeyVal in playerChatKeyVal.Value.newChats)  
					
					tmpList.Sort(SingleConvData.SortCompareByChatId); 
					for (var i:int = 0; i < tmpList.Count; i++)
					{ 
						singleConvData.Add(tmpList[i]);
					}

					if (isNewData)
						conversationDatas.Add(singleConvData);
					 
				} // End if (playerKeyVal.Key == playerChatKeyVal.Key)
			} // End for (var playerChatKeyVal:System.Collections.DictionaryEntry int newDatas.playerChats)
		} // End for (var playerKeyVal:System.Collections.DictionaryEntry int newDatas.playerInfos)
		
		// Sort by newest chatId or date time?
		SortConvDatas(); 
		TrimConvDatas();
	} 
	
	public function CombineConvDatasAndSort(newDatas:GetOne2OneChatReponse)
	{ 
		if (null == newDatas.newChats || newDatas.newChats.Count == 0)
			return;
		
		// Not in ignoredlist 
		var isIgnoredUser:boolean = UserSetting.getInstance().isIgnoredUser(newDatas.userId);
			
		var isNewData:boolean = false;
		var singleConvData:SingleConvData = GetSingleConvData(newDatas.userId); 
		if (null == singleConvData && isIgnoredUser)
		{   
			// Not cache it
			return;
		}
		else if (null == singleConvData)
		{ 
			isNewData = true;
			singleConvData = new SingleConvData();
		}
		
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
			// Debug.Log("---------------itemData.chatId:" + tmpList[i].chatId);
			singleConvData.Add(tmpList[i]);
		}
		 
		if (isNewData)
		{
			conversationDatas.Add(singleConvData);
		}
			
		// Sort by newest chatId or date time?
		SortConvDatas();
		TrimConvDatas();
	}
	
	private function LoadConvDatasFromLocalCaches()
	{
		conversationDatas.Clear();
		ChatMsgDB.GetInstance().ReadData(conversationDatas);
	}  
	
	private function SortConvDatas()
	{ 
		// Don't sort!!!
		//for (var val:SingleConvData in conversationDatas)
		//{
		//	val.Sort();
		//}
		
		if (SingleConvData.IsSortByChatId) 
			conversationDatas.Sort(SortConvDataByChatId);
		else 
			conversationDatas.Sort(SortConvDataByDateTime);
	} 
	
	private function SortConvDataByChatId(obj1:SingleConvData, obj2:SingleConvData):int
	{
		// We use descending order,so reverse the result
		var result:int = 0;
    	
    	if (null == obj1 && null == obj2) 
    	{
    		result = 0;
    	}
    	else if (null != obj1 && null == obj2)
    	{
    		result = 1;
    	}
    	else if (null == obj1 && null != obj2)
    	{
    		result = -1;
    	}
    	else
    	{
    		result = obj1.newestChatId - obj2.newestChatId;;
    	} 
    	
    	// Reverse the result
		return -result;
	} 
	
	private function SortConvDataByDateTime(obj1:SingleConvData, obj2:SingleConvData):int
	{
		// We use descending order,so reverse the result
		var result:int = 0;
    	
    	if (null == obj1 && null == obj2) 
    	{
    		result = 0;
    	}
    	else if (null != obj1 && null == obj2)
    	{
    		result = 1;
    	}
    	else if (null == obj1 && null != obj2)
    	{
    		result = -1;
    	}
    	else
    	{ 
    		result = String.Compare(obj1.newestDateTime, obj2.newestDateTime);
    	} 
    	
    	// Reverse the result
		return -result;
	}
	
	// Annotate the function,because the project not frequently use targetId, so use targetName now
	public function GetSingleConvData(targetId:int):SingleConvData
	{
		if (-1 == targetId) return null; 
		
		for (var val:SingleConvData in conversationDatas)
		{
			if (null != val && val.targetId == targetId) 
				return val;
		}
		
		return null;
	} 
	
	public function GetSingleConvData(targetName:String):SingleConvData
	{
		if (String.IsNullOrEmpty(targetName)) return null; 
		
		for (var val:SingleConvData in conversationDatas)
		{
			if (null != val && String.Equals(val.targetName, targetName, StringComparison.CurrentCultureIgnoreCase)) 
				return val;
		}
		
		return null;
	}
	
	public function AddSingleConvData(targetId:int, chatItemData:ChatItemData)
	{
		if (-1 == targetId) return null; 
		 
		var singleConvData:SingleConvData = null;
		for (var val:SingleConvData in conversationDatas)
		{
			if (null != val && val.targetId == targetId) 
			{ 
				singleConvData = val; 
				break;
			}
		} 
		
		// Here maybe we not care the ignored list?
		if (null == singleConvData)
		{
			singleConvData = new SingleConvData(); 
			singleConvData.targetId = targetId;
			conversationDatas.Insert(0, singleConvData);
			
			TrimConvDatas();
		}
		
		singleConvData.Add(chatItemData); 
	}
	
	public function AddSingleConvData(targetName:String, chatItemData:ChatItemData)
	{
		if (String.IsNullOrEmpty(targetName)) return null; 
		
		var singleConvData:SingleConvData = null;
		for (var val:SingleConvData in conversationDatas)
		{
			if (null != val && String.Equals(val.targetName, targetName, StringComparison.CurrentCultureIgnoreCase)) 
			{ 
				val.targetName = targetName; // Change the newest if we ignore string case
				singleConvData = val; 
				break;
			}
		} 
		
		// Here maybe we not care the ignored list?
		if (null == singleConvData)
		{
			singleConvData = new SingleConvData(); 
			singleConvData.targetName = targetName;
			conversationDatas.Insert(0, singleConvData);
			
			TrimConvDatas();
		} 
		
		singleConvData.Add(chatItemData); 
	}
	
	public function UpdateSingleConvData(targetName:String, targetId:int)
	{
		if (String.IsNullOrEmpty(targetName)) return null; 
		
		// Check is this a changed name
		var singleConvData:SingleConvData = null;
		for (var val:SingleConvData in conversationDatas)
		{
			if (null != val && val.targetId == targetId) 
			{ 
				singleConvData = val; 
				break;
			}
		}
		if (null != singleConvData)
		{
			// Find one, combine it with the new TargetName conversation
			var comb2ConvData:SingleConvData = GetSingleConvData(targetName);
			if (null != comb2ConvData && comb2ConvData.targetId != singleConvData.targetId)
			{
				comb2ConvData.targetId = targetId;
				comb2ConvData.InsertRange(0, singleConvData);
				
				conversationDatas.Remove(singleConvData);
			//	Debug.Log("A old user, but change a new name!!!");
				return;
			}
		}
		
		for (var val:SingleConvData in conversationDatas)
		{
			if (null != val && String.Equals(val.targetName, targetName, StringComparison.CurrentCultureIgnoreCase)) 
			{
				val.targetId = targetId;
				break;
			}
		}
	}
	
	// Update the cache for my send message,not from the get
	public function UpdateSendNewChatId(targetName:String, chatId:int)
	{
		if (String.IsNullOrEmpty(targetName)) return null; 
		
		for (var val:SingleConvData in conversationDatas)
		{
			if (null != val && String.Equals(val.targetName, targetName, StringComparison.CurrentCultureIgnoreCase)) 
			{
				val.UpdateSendNewChatId(chatId);
				break;
			}
		}
	}
	
	public function RemoveSingleConvData(targetId:int)
	{
		if (-1 == targetId) return; 
		
		for (var val:SingleConvData in conversationDatas)
		{
			if (null != val && val.targetId == targetId) 
			{
				conversationDatas.Remove(val);
				break;
			}
		}
	}
	
	public function RemoveSingleConvData(targetName:String)
	{
		if (String.IsNullOrEmpty(targetName)) return null; 
		
		for (var val:SingleConvData in conversationDatas)
		{
			if (null != val && String.Equals(val.targetName, targetName, StringComparison.CurrentCultureIgnoreCase)) 
			{
				conversationDatas.Remove(val);
				break;
			}
		}
	}
	
	public function SaveConvDatas()
	{
		var tmpDatas:List.<SingleConvData> = new List.<SingleConvData>();
		
		// Detect the record count
		var startIndex:int = conversationDatas.Count - ConvListToplimit;
		if (startIndex < 0)
		{
			startIndex = 0;
		}
		
		var tmpSingleConvData:SingleConvData = null;
		for (var i:int = startIndex; i < conversationDatas.Count; i++)
		{  
			// The user is not exist, avoid some special condition
			if (conversationDatas[i].targetId == -1) continue;
			
			tmpSingleConvData = new SingleConvData();
			tmpSingleConvData.CopyFrom(conversationDatas[i]); 
			
			// Detect the record count
			var rmCount:int = tmpSingleConvData.Count - One2OneMsgRecordCnt;
			if (rmCount > 0) 
			{
				tmpSingleConvData.RemoveRange(0, rmCount);	
			}
			
			//tmpSingleConvData.Sort();
			tmpDatas.Add(tmpSingleConvData);
		}
		
		if (tmpDatas.Count > 0)
			ChatMsgDB.GetInstance().WriteData(tmpDatas); 

		tmpDatas.Clear();
		tmpDatas = null;
	}
	
	// UnityNetGetConversationDatas
	private function UnityNetGetConversationDatas(params:Array)
	{
		var paramUnitCnt:int = 2;
		if (params.Count % paramUnitCnt != 0) 
		{
			throw "The method incoming params is not match with paramUnitCnt, See UnityNetGetConversationDatas";
		}
		
		var reqParams:Hashtable = new Hashtable(); 
		var count:int = parseInt(params.Count * 0.5f);
		reqParams.Add("type", "list");
		reqParams.Add("conversationCount", count);
		
		//var sb:StringBuilder = new StringBuilder(512);
		//sb.AppendFormat("type:", "list");
		//sb.AppendFormat("&conversationCount:{0}", count);
		for (var i:int = 0; i < count; i++)
		{
		 	reqParams.Add("recipient" + i.ToString(), params[i * paramUnitCnt]);
		 	reqParams.Add("chatId" + i.ToString(), params[i * paramUnitCnt + 1]); // Current has readed and the lastest chatId
		 	
		 	//sb.AppendFormat("&recipient{0}:{1}", i, params[i * paramUnitCnt]);
		 	//sb.AppendFormat(" chatId{0}:{1}", i, params[i * paramUnitCnt + 1]);
		}
		//Debug.Log("Sendto:\n" + sb.ToString());
		
		UnityNet.reqGetConversationDatas(reqParams, GetConvDatasOk, GetConvDatasError);
	}
	
	// UnityNetGetConversationDatas callback
	private function GetConvDatasOk(result:HashObject)
	{
		//Debug.Log("GetConvDatasOk");	
		
		// In edit state, do nth.
		if (isInEdit) return;
		
		// GameMain.adjustUnixtime(_Global.parseTime(result["resmicrotime"])); 
		var convDatasReponse:GetConversationsReponse = new GetConversationsReponse(); 
		JasonConvertHelper.ParseToObjectOnce(convDatasReponse, result); 
		CombineConvDatasAndSort(convDatasReponse); // Combine the new datas
		
		CalcConvListMsgsCount(); 
		SynConvItemsDisplay();
		
		SaveConvDatas(); 
	}
	
	// UnityNetGetConversationDatas callback
	private function GetConvDatasError(msg:String, errorCode:String)
	{
		//Debug.Log("GetConvDatasError");	
	}
	
	// UnityNetDeleteConversationDatas
	private function UnityNetDeleteConversationDatas(params:Array)
	{ 
		var paramUnitCnt:int = 2;
		if (params.Count % paramUnitCnt != 0) 
		{
			throw "The method incoming params is not match with paramUnitCnt, See UnityNetDeleteConversationDatas";
		}
		
		var reqParams:Hashtable = new Hashtable(); 
		var count:int = parseInt(params.Count * 0.5f);
		reqParams.Add("type", "delete");
		reqParams.Add("deleteCount", count);
		for (var i:int = 0; i < count; i++)
		{
		 	reqParams.Add("recipient" + i.ToString(), params[i * paramUnitCnt]);
		 	reqParams.Add("chatId" + i.ToString(), params[i * paramUnitCnt + 1]); // Current has readed and the lastest chatId
		}
		
		UnityNet.reqGetConversationDatas(reqParams, DeleteConvDatasOk, DeleteConvDatasError);
	}
	
	// UnityNetDeleteConversationDatas callback
	private function DeleteConvDatasOk(result:HashObject)
	{
		//Debug.Log("DeleteConvDatasOk");
	}
	
	// UnityNetDeleteConversationDatas callback
	private function DeleteConvDatasError(msg:String, errorCode:String)
	{
		//Debug.Log("DeleteConvDatasError");
	} 
	 
	// 
	public function RemoveConvItem(targetName:String)
	{  
		var listItem:ConversationItem = null;
		for (var i:int = 0; i < conversationScrollView.numUIObject; i++)
		{
			listItem = conversationScrollView.getUIObjectAt(i) as ConversationItem; 
			if (null != listItem && null != listItem.Data && listItem.Data.targetName.Equals(targetName)) 
			{ 
				conversationScrollView.removeUIObject(listItem);
					
				listItem.OnClear();
				UIObject.TryDestroy(listItem);
				break;
			}
		} 
		 
		conversationScrollView.AutoLayout();
		conversationScrollView.MoveToTop(); 
	}
	
	private function SynConvItemsDisplay()
	{   
		var listItem:ConversationItem = null;
		// Update the new data
		for (var j:int = 0; j < conversationScrollView.numUIObject && j < conversationDatas.Count; j++)
		{
			listItem = conversationScrollView.getUIObjectAt(j) as ConversationItem;
			listItem.Data = conversationDatas[j];
		}
	}

	private function AsynAddConvItems()
	{  
		fixedAysnAddConvItemTiming += Time.deltaTime;
		if (fixedAysnAddConvItemTiming >= FixedAysnAddItemInterval)
		//if (SimulateWaitForSeconds(fixedAysnAddConvItemTiming, FixedAysnAddItemInterval))
		{ 
			fixedAysnAddConvItemTiming -= FixedAysnAddItemInterval; 
			
			var addCountPerFrame:int = 0;
			var listItem:ConversationItem = null;
			while (convListDrawIndex < conversationDatas.Count && addCountPerFrame < SynCntPerFrame)
			{
				var thisFrameAddCntLimit = convListDrawIndex + SynCntPerFrame;
				for (var i:int = convListDrawIndex; i < conversationDatas.Count && i < thisFrameAddCntLimit; i++)
				{ 
					listItem = AddListItem(conversationScrollView, ConvListToplimit, conversationDatas[i], prefabChatRecordItem) as ConversationItem;
					listItem.SetGotoDetailDelegate(OnConvItemGotoDetail);
					convListDrawIndex++;
					addCountPerFrame++;
				}
				
				conversationScrollView.AutoLayout();
				conversationScrollView.MoveToTop();

			}
		}
	}
	
	//----------------------------------------------------------------------------------------------------
	/// Some speedy function to using operate GUI
	//----------------------------------------------------------------------------------------------------
	public static function AddListItem(scrollView:ScrollView, topLimit:int, itemData:Object, prefabItem:ListItem):ListItem
	{  
		var itemObject:ListItem = null;
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
		
		return itemObject;
	}
	
	public static function SetTextColor(text:Label, color:Color) 
	{
		var isSame:boolean = Color.Equals(text.mystyle.normal.textColor, color);
		if (!isSame)
		{
			text.mystyle.normal.textColor = color;
		}
	}
 
	
 
 	//private function SimulateWaitForSeconds(timing:float, waitingTime:float):boolean
	//{ 
	//	timing += Time.deltaTime;
	//	if (timing >= waitingTime)
	//	{
	//		timing -= waitingTime;
	//		
	//		return true;
	//	}
	//	
	//	return false;
	//}
	
	//private function DoWaitForSeconds (waitTime : float) 
	//{
	//	yield WaitForSeconds (waitTime);
	//}
}
