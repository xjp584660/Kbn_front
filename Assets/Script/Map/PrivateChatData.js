/// Use the jason format to parse a HashObject to an instance of specific class
class GetConversationsReponse
{
	class PlayerInfo
	{
		@JasonData("playerName")
		public var userName:String;
		
		@JasonData("allianceName")
		public var allianceName:String;	
	}
	
	@JasonData("newChats", MapKey=typeof(int), MapValue=typeof(NewChat))
	class PlayerChatInfo
	{
		class NewChat
		{
			@JasonData("a0")
			public var message:String; 
			
			@JasonData("a1")
			public var dateTime:String;
			
			@JasonData("a2")
			public var badge:String;
			
			@JasonData("a3")
			public var avatar:String;

			@JasonData("a4")
			public var transLate:String;

			@JasonData("a5")
			public var shareReport:String;
		}
		
		// The Dictionary's Key is chatId
		public var newChats:Hashtable;
		//@JasonData
		// public var newChats:System.Collections.Generic.Dictionary.<int, NewChat>;
	} 
	
	@JasonData("ok")
	public var isOk:boolean;
	 
	//@JasonData("all")
	//public var conversationCnt:int;
	//
	//@JasonData("new")
	//public var newConversationCnt:int;
					
	// The Dictionary's Key is playerid
	@JasonData("players", MapKey=typeof(int), MapValue=typeof(PlayerInfo))
	public var playerInfos:Hashtable;
	
	// The Dictionary's Key is playerid
	@JasonData("data", MapKey=typeof(int), MapValue=typeof(PlayerChatInfo))
	public var playerChats:Hashtable;
	
	//public var playerChats:System.Collections.Generic.Dictionary.<int, System.Collections.Generic.Dictionary.<int, PlayerChatInfo.NewChat> >;
	//@JasonData
	//public var playerChats:PlayerChatInfo[];
	
	// override the Object
	public function ToString():String
	{
		var sb:System.Text.StringBuilder = new System.Text.StringBuilder(1024);
		
		BuildString(sb, "ok=" + isOk.ToString());
		//BuildString(sb, "all=" + conversationCnt.ToString());
		//BuildString(sb, "new=" + newConversationCnt.ToString());
		
		//...
		
		return sb.ToString();
	}
	
	private function BuildString(sb:System.Text.StringBuilder, content:String)
	{
		sb.AppendLine(content);
	}
}
	
/// The data struct parse from server
class GetOne2OneChatReponse
{
	@JasonData("ok")
	public var isOk:boolean;
	
	@JasonData("userId")
	public var userId:int;
	
	@JasonData("displayName")
	public var userName:String;
	
	@JasonData("allianceName")
	public var allianceName:String;
	
	class NewChat
	{
		@JasonData("a0")
		public var message:String; 
		
		@JasonData("a1")
		public var dateTime:String;
		
		@JasonData("a2")
		public var badge:String;
		
		@JasonData("a3")
		public var avatar:String;
		
		@JasonData("a4")
		public var transLate:String;

		@JasonData("a5")
		public var shareReport:String;
	}
	
	//// The Dictionary's Key is chatId
	//@JasonData("data", MapKey = typeof(int), MapValue = typeof(NewChat))
	//public var newChats:Hashtable;
	//public function set income_newChats(value : System.Collections.Hashtable)
	//{
	//	newChats = new System.Collections.Generic.Dictionary.<int, NewChat>();
	//	for (var dat : System.Collections.DictionaryEntry in value)
	//		newChats.Add(_Global.INT32(dat.Key), dat.Value as NewChat);
	//}
	
	@JasonData("data")
	public var newChats:System.Collections.Generic.Dictionary.<int, NewChat> 
				= new System.Collections.Generic.Dictionary.<int, NewChat>();
}

/// The data struct parse from server
class SetOne2OneChatReponse
{
	@JasonData("ok")
	public var isOk:boolean;
	
	@JasonData("recipient")
	public var userId:int;
	
	@JasonData("chatId")
	public var chatId:int;
}

//---------------------------------------------------------------------
// Chat data struction
//--------------------------------------------------------------------- 
class SingleConvData
{ 
	public static final var ChatingMsgCacheTopLimit:int = 50; 
	public static final var IsSortByChatId:boolean = true;
	
	// This conversation's target information
	public var targetId:int = -1; 
	public var targetName:String = String.Empty;
	public var targetAllianceId:int = -1; 
	public var targetAllianceName:String = String.Empty;
	public var targetAvatar:String = String.Empty;
	public var targetAvatarFrame:String = "img0";
	public var targetChatFrame:String = "img0";
	public var targetBadge:String = String.Empty;
	
	public var lastestReadedChatId:int = -1; // Maybe include the ignored message chatId
	public var newestChatId:int = -1; // Maybe include the ignored message chatId
	public var newestDateTime:String = String.Empty; // Maybe include the ignored message chatId

	public var transLate:String=String.Empty;
	public var shareReport:String ;
	
	private var chatDatas:System.Collections.Generic.List.<ChatItemData> 
						= new System.Collections.Generic.List.<ChatItemData>(); // ChatItemData[] 
	
	//----------------------------------------------------------  
	public function SingleConvData()
	{
		targetId = -1; 
		targetName = String.Empty;
		targetAllianceId = -1; 
		targetAllianceName = String.Empty;
		
		lastestReadedChatId = -1;
		newestChatId = -1;
		
		newestDateTime = String.Empty;

		transLate=String.Empty;
	}
	
	public function CopyFrom(data:SingleConvData)
	{
		targetId = data.targetId;
		targetName = data.targetName;
		targetAllianceId = data.targetAllianceId;
		targetAllianceName = data.targetAllianceName;
		targetAvatar = data.targetAvatar;
		targetAvatarFrame = data.targetAvatarFrame;
		targetChatFrame = data.targetChatFrame;
		targetBadge = data.targetBadge; 
		transLate = data.transLate;
		shareReport = data.shareReport;
	
		
		lastestReadedChatId = data.lastestReadedChatId; 
		newestChatId = data.newestChatId; 
		
		for (var j:int = 0; j < data.Count; j++)
		{
			var chatData:ChatItemData = ChatItemData.CopyFrom(data.GetChatData(j));
			Add(chatData);
		}
	}
	
	public function get Count():int
	{
		return chatDatas.Count;
	} 
	
	public function GetChatData(index:int):ChatItemData
	{
		if (index < 0 || index >= chatDatas.Count) return null;
		return chatDatas[index];
	}
	
	public function Add(itemData:ChatItemData)
	{
		// Execute our add logic
		// Sometime we cann't get the targetId, but can get targetName
		// If the ChatItemData is me send, break the search
		var myUserId:int = Datas.instance().tvuid();
		if (myUserId != itemData.userId)
		{
			targetId = itemData.userId;
			targetName = itemData.userName; 
			targetAllianceId = itemData.allianceId; 
			targetAllianceName = itemData.allianceName;
			targetAvatar = itemData.avatar;
			targetBadge = itemData.badge;
			targetAvatarFrame = itemData.avatarFrame;
			if(targetAvatarFrame == "")
				targetAvatarFrame = "img0";
			targetChatFrame = itemData.chatFrame;
			if(targetChatFrame == "")
				targetChatFrame = "img0";
		}
		//_Global.LogWarning(">>>>>>>"+itemData.shareReport);
		// Update the newest data
		if (itemData.chatState == ChatItemData.ChatStateHistory
			|| itemData.chatState == ChatItemData.ChatStateReaded)
		{
			lastestReadedChatId = lastestReadedChatId < itemData.chatId ? itemData.chatId : lastestReadedChatId;
		}
		newestChatId = newestChatId < itemData.chatId ? itemData.chatId : newestChatId;
		newestDateTime = itemData.msgDateTime;
		transLate = itemData.transLate;
		if (itemData.shareReport){
			shareReport = "shareReport";
		}
		
	
		if (myUserId != itemData.userId)
		{
			var index:int = chatDatas.FindIndex(function(element:ChatItemData)
			{
				if (element.chatId == itemData.chatId) 
				{
					return true;
				}
				return false;
			});
			
			if (-1 != index) 
			{
				return;
			}
		}
		
		// First check is the ignored message
		if (!itemData.isIgnored)
		{
			chatDatas.Add(itemData);
		}
	}
	
	public function GetDatas():List.<ChatItemData>
	{ 
		return chatDatas;
	}
	
	public function InsertRange(insertIndex:int, convData:SingleConvData)
	{ 
		 chatDatas.InsertRange(insertIndex, convData.GetDatas());
	} 
	
	public function Remove(itemData:ChatItemData)
	{
		chatDatas.Remove(itemData);
	}
	
	 public function RemoveAt(index:int)
	{
		chatDatas.RemoveAt(index);
	} 
	
	public function RemoveRange(startIndex:int, count:int)
	{
		chatDatas.RemoveRange(startIndex, count);
	}
	
	public function Clear()
	{
		chatDatas.Clear();
	}
	
	public function UpdateSendNewChatId(chatId:int)
	{
		var myUserId:int = Datas.instance().tvuid();
		for (var i:int = chatDatas.Count - 1; i >= 0; i--)
		{
			if (myUserId == chatDatas[i].userId && chatDatas[i].chatId == 0)
			{
				chatDatas[i].chatId = chatId;
				break;
			}
		}
	}
	
	public function MarkReaded(startIndex:int, count:int)
	{
		if (startIndex >= chatDatas.Count) return; 
		
		if (startIndex + count > chatDatas.Count) 
		{
			count = chatDatas.Count - startIndex;
		}
		
		for (var i:int = startIndex; i < startIndex + count; i++)
		{
			chatDatas[i].chatState = ChatItemData.ChatStateReaded;
			lastestReadedChatId = lastestReadedChatId < chatDatas[i].chatId ? chatDatas[i].chatId : lastestReadedChatId;
		}
	}
	
	public function GetNotMeLastestData():ChatItemData
	{
		var myUserId:int = Datas.instance().tvuid();
		for (var i:int = chatDatas.Count - 1; i >= 0; i--)
		{
			if (myUserId != chatDatas[i].userId)
				return chatDatas[i];
		}
		
		return null;
	}
	
	public function HasUnreadMsg():boolean
	{
		// chatDatas.GetEnumerator();
		for (var i:int = chatDatas.Count - 1; i >= 0; i--)
		{
			if (chatDatas[i].chatState == ChatItemData.ChatStateUnread)
				return true;
		}
		
		return false;
	}
	
	public function Sort()
	{ 
		if (chatDatas.Count == 0) return;
		 
		// Sort the list first
		if (IsSortByChatId)
			chatDatas.Sort(SortCompareByChatId);
		else
			chatDatas.Sort(SortCompareByDateTime); // Maybe concurrency time
		
		for (var data:ChatItemData in chatDatas)
		{
			if (data.chatState == ChatItemData.ChatStateHistory
				|| data.chatState == ChatItemData.ChatStateReaded) 
			{
				lastestReadedChatId = data.chatId;
			}
			else
				break;
		}
		
		var lastChatId:int = chatDatas[chatDatas.Count - 1].chatId;
		newestChatId = newestChatId < lastChatId ? lastChatId : newestChatId;
		
		if (!IsSortByChatId)
		{
			var lastDateTime:String = chatDatas[chatDatas.Count - 1].msgDateTime;
			if (String.Compare(newestDateTime, lastDateTime) < 0)
				newestDateTime = lastDateTime;
		}
	}
	
	// The default sorting is ascending order (donn't need descending order,if need can reverse the result)
	public static function SortCompareByChatId(obj1:ChatItemData, obj2:ChatItemData):int
    {  
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
    		result = obj1.chatId - obj2.chatId;;
    	}
    	
    	return result;
    }
     
    private function SortCompareByDateTime(obj1:ChatItemData, obj2:ChatItemData):long
    {
    	var result:long = 0;
    	
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
    		result = String.Compare(obj1.msgDateTime, obj2.msgDateTime);
    		//result = obj1.msgDateTimeHash - obj2.msgDateTimeHash;
    	}
    	 
    	return result;
    }
}

class ChatItemData
{   
	// Simulate Enumerate type
	public static final var ChatStateHistory = 0;
	public static final var ChatStateReaded = 1;
	public static final var ChatStateUnread = 2;

	public var chatId:int = -1;
	public var chatType:String = "";
	public var chatState:int = ChatStateUnread;
	public var isIgnored:boolean = false;

	public var userId:int = -1;
	public var userName:String = "";
	
	public var msgContent:String = "";
	public var msgDateTime:String = "";
	public var msgDateTimeHash:long = -1;
	
	public var allianceName:String = "";
	public var allianceId:int = -1;
	public var alliancePosition:int = -1;
	
	public var avatar:String = "";	
	public var badge:String = "";
	public var avatarFrame:String = "";
	public var chatFrame:String = "";
	
	public var attachItemId:int = -1;

	public var transLate:String="";

	public var shareReport:String;
	
	private static var tmpChatId:int = -1;
	
	public static function GetChatItemData(object:Object):ChatItemData
	{
		var tData = object as Hashtable;
		tmpChatId = tData["newchatid"];
		
		var itemData:ChatItemData = new ChatItemData();
		itemData.chatId = tmpChatId;
		itemData.chatType = tData["type"];
		
		itemData.userId = _Global.INT32(tData["userid"]);
		itemData.userName = tData["username"];
	
		if(tData["allianceID"])
		{
			itemData.allianceId = _Global.INT32(tData["allianceID"]);	
		}
		if(!String.IsNullOrEmpty(tData["allianceName"]))
		{
			itemData.allianceName = tData["allianceName"];
		}
		if(!String.IsNullOrEmpty(tData["avatar"]))
		{
			itemData.avatar = tData["avatar"];
		}
		if(!String.IsNullOrEmpty(tData["badge"]));
		{
			itemData.badge = tData["badge"];
		}
		if(!String.IsNullOrEmpty(tData["avatarFrame"]))
		{
			itemData.avatarFrame = tData["avatarFrame"];
		}
		if(!String.IsNullOrEmpty(tData["chatFrame"]))
		{
			itemData.chatFrame = tData["chatFrame"];
		}
		
		itemData.msgContent = tData["message"];
		itemData.msgDateTime = tData["time"];
		itemData.msgDateTimeHash = _Global.DateTimeChatToTicks(itemData.msgDateTime);
		
		itemData.alliancePosition = tData["title"];
		
		itemData.attachItemId = tData["itemId"];
		if (tData["transLan"]!=null) {
			itemData.transLate=tData["transLan"];
		}
		//Datas.instance().getImageName(tData["itemId"]);
		if (tData["shareReport"]!=null)
		{
			itemData.shareReport = "shareReport";
		}
		

		return itemData;
	}
	
	public static function GetChatItemData(contentObj:HashObject):ChatItemData
	{

		tmpChatId = contentObj[_Global.ap + 6].Value;
		
		var itemData:ChatItemData = new ChatItemData();
		itemData.chatId = tmpChatId;
		// itemData.chatType = tData["type"];
		
		itemData.userId = _Global.INT32(contentObj[_Global.ap + 4].Value);
		itemData.userName = contentObj[_Global.ap + 0].Value;		
	 	
		if(contentObj[_Global.ap + 8].Value)
		{
			itemData.allianceId = _Global.INT32(contentObj[_Global.ap + 8].Value);	
			
			if(!String.IsNullOrEmpty(contentObj[_Global.ap + 9].Value))
			{
				itemData.allianceName = contentObj[_Global.ap + 9].Value;
			}
		}
		if(null != contentObj[_Global.ap + 12] && !String.IsNullOrEmpty(contentObj[_Global.ap + 12].Value))
		{
			itemData.badge = contentObj[_Global.ap + 12].Value;
		}
		if(null != contentObj[_Global.ap + 13] && !String.IsNullOrEmpty(contentObj[_Global.ap + 13].Value))
		{
			
		}
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
		itemData.avatar = avatar;
		itemData.avatarFrame = avatarFrame;
		itemData.chatFrame = chatFrame;
		itemData.msgContent = contentObj[_Global.ap + 3].Value;
		itemData.msgDateTime = _Global.DateTimeChatFormat(_Global.INT64(contentObj[_Global.ap + 7]));
		itemData.msgDateTimeHash = _Global.DateTimeChatToTicks(itemData.msgDateTime);
		
		itemData.alliancePosition = GetAlliancePosition(itemData.userId);
		
		// itemData.attachItemId = tData["itemId"];
		//Datas.instance().getImageName(tData["itemId"]);

		return itemData;
	} 
	
	public static function GetChatItemData(userId:int, userName:String, allianceName:String, avatarName:String, badge:String,
										   chatId:int, message:String, dateTime:String,trans:String,shareReport:String):ChatItemData
	{ 
		var itemData:ChatItemData = new ChatItemData(); 
		
		itemData.chatId = chatId; 
		itemData.chatType = Constant.ChatType.CHAT_PRIVATE_ONE2ONE;
		
		itemData.userId = userId;
		itemData.userName = userName;

		itemData.msgContent = message;
		itemData.msgDateTime = _Global.DateTimeChatFormat(_Global.INT64(dateTime));
		itemData.msgDateTimeHash = _Global.DateTimeChatToTicks(itemData.msgDateTime);
		
		//itemData.allianceId = 0;
		itemData.allianceName = allianceName;
		var avatarAndFrame:String = avatarName;
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
		itemData.avatar = avatar;
		itemData.avatarFrame = avatarFrame;
		itemData.chatFrame = chatFrame;
		itemData.badge = badge;

		itemData.transLate=trans;
		itemData.shareReport = shareReport;

		return itemData;
	} 
	
	public static function GetChatItemData(sendMsgItem:Hashtable):ChatItemData
	{ 
		var itemData:ChatItemData = new ChatItemData(); 
		
		itemData.chatId = sendMsgItem["chatId"]; 
		// itemData.chatType = sendMsgItem["type"]; // In myself gui, not need CHAT_WHISPER type,change to CHAT_PRIVATE_ONE2ONE
		itemData.chatType = Constant.ChatType.CHAT_PRIVATE_ONE2ONE;
		
		itemData.userId = sendMsgItem["userid"];
		itemData.userName = sendMsgItem["username"];
		
		itemData.msgContent = sendMsgItem["message"];
		itemData.msgDateTime = sendMsgItem["time"];
		itemData.msgDateTimeHash = _Global.DateTimeChatToTicks(itemData.msgDateTime);
		
		itemData.allianceId = _Global.INT32(sendMsgItem["allianceID"]);
		itemData.allianceName = sendMsgItem["allianceName"];
		// itemData.allianceName = msgItem["to"];
		itemData.avatar = sendMsgItem["avatar"];
		itemData.avatarFrame = sendMsgItem["avatarFrame"];
		itemData.chatFrame = sendMsgItem["chatFrame"];
		itemData.badge = sendMsgItem["badge"];
		if (sendMsgItem["transLan"]!=null) {
			itemData.transLate=sendMsgItem["transLan"];
		}
		
		return itemData;
	}
	
	// Package new chat data which is send by me
	public static function GetChatItemData(sendMessage:String, targetName:String):ChatItemData
 	{ 
 		var time:String = _Global.DateTimeChatFormat(GameMain.unixtime());
		var seed:HashObject = GameMain.instance().getSeed();
	 	var username:String = seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value;
	 	var userId:int = Datas.instance().tvuid();
 		
 		var itemData:ChatItemData = new ChatItemData(); 
		itemData.chatId = 0; 
		itemData.chatType = Constant.ChatType.CHAT_PRIVATE_ONE2ONE;
		
		itemData.userId = userId;
		itemData.userName = username;
		
		itemData.msgContent = sendMessage;
		itemData.msgDateTime = time;
		itemData.msgDateTimeHash = _Global.DateTimeChatToTicks(itemData.msgDateTime);
		
		var allianceVO:AllianceVO = Alliance.getInstance().myAlliance;
		if (null != allianceVO)
		{
			itemData.allianceId = allianceVO.allianceId;
			itemData.allianceName = allianceVO.name;
		}
		
		itemData.avatar = AvatarMgr.instance().PlayerAvatar;
		itemData.badge = AvatarMgr.instance().PlayerBadge;
		itemData.chatFrame = FrameMgr.instance().PlayerChatFrame;
		itemData.avatarFrame = FrameMgr.instance().PlayerHeadFrame;
		
		return itemData;
 	}
	
	public static function CopyFrom(data:ChatItemData):ChatItemData
	{
		var itemData:ChatItemData = new ChatItemData(); 
		
		itemData.chatId = data.chatId; 
		itemData.chatType = data.chatType; 
		itemData.chatState = data.chatState; 
		
		itemData.userId = data.userId;
		itemData.userName = data.userName;
		
		itemData.msgContent = data.msgContent; 
		itemData.msgDateTime = data.msgDateTime; 
		itemData.msgDateTimeHash = data.msgDateTimeHash; 
		
		itemData.allianceId = data.allianceId;
		itemData.allianceName = data.allianceName;
		itemData.alliancePosition = data.alliancePosition;
		itemData.avatar = data.avatar;
		itemData.avatarFrame = data.avatarFrame;
		itemData.chatFrame = data.chatFrame;
		itemData.badge = data.badge;

		itemData.transLate=data.transLate;
		
		itemData.attachItemId = data.attachItemId;
		itemData.shareReport = data.shareReport;

		
		return itemData;
	}
	
	public function ToMessageItem():Hashtable
	{ 
 		var newMsgItem:Hashtable = new Hashtable();
 		
 		var timeStamp:long = _Global.DateTimeTicksToUnixTimestamp(msgDateTimeHash);
 		
 		newMsgItem = 
 		{
			"chatId":chatId,
			"username":userName,
			"userid":userId,//Datas.instance().tvuid(),
			"time":timeStamp.ToString(),
			"message":msgContent,
			"type":chatType,
			"avatar":avatar,
			"avatarFrame":avatarFrame,
			"chatFrame":chatFrame,
			"badge":badge,
			"transLan":transLate,
			"shareReport":shareReport
		};
						
		newMsgItem["allianceID"] = allianceId;
		newMsgItem["allianceName"] = allianceName;
		
		//newMsgItem["from"] = "PrivateChat";
		
		return newMsgItem;
	}
	
	public static function GetAlliancePosition(uid:int):int
 	{
 		// contentObj[_Global.ap + 4].Value, result["data"]["allianceOfficer"]
 		var officerData:HashObject = null;
 		if(officerData == null || officerData[uid.ToString()] == null)
 		{
 			return Constant.Alliance.Member;
 		}
 	
 		if(officerData[uid.ToString()].Value == "1")
 		{
 			return Constant.Alliance.Chancellor;
 		}
 		else if(officerData[uid.ToString()].Value == "2")
 		{
 			return Constant.Alliance.ViceChancellor;
 		}
 		else
 		{
 			return Constant.Alliance.Member;
 		}
 	}
}
//---------------------------------------------------------------------
