#pragma strict

class MessageBalloon extends ListItem {

	public var	leftLine	: SimpleLabel;
	public var	rightLine	: SimpleLabel;
	public var	time		: SimpleLabel;
	
	public var	avatar		: SimpleLabel;
	public var  avatarFrame      : SimpleLabel;
	public var	corner		: SimpleLabel;
	public var	alliEmblem	: AllianceEmblem;
	
	public var  balloon		: SimpleLabel;
	public var  chatFrame   : String;
	public var  balloonCopy : SimpleButton;

	public var  transBtn:SimpleButton; //翻译按钮
	public var  transLabel:SimpleLabel; //翻译字段
	
	public var	badge		: SimpleLabel;
	public var	username	: SimpleLabel;
	public var	whisper		: SimpleLabel;
	public var	alliance	: SimpleLabel;
	public var	allianceLeagueIcon	: SimpleLabel;
	public var	message		: SimpleLabel;
	
	public var	btnHelp		: SimpleButton;
	
	public var	btnInfo		: SimpleButton;
	
	public var	item		: SimpleLabel;
	
	public var	totalWidth	: int;
	public var	minHeight	: int;
	public var	avatarRect	: Rect;
	public var	avatarFrameRect	: Rect;
	
	public var	balloonPadding	: Rect; 	// left, top, right, bottom
	public var	infoLineHeight	: int;
	public var	badgeRect		: Rect;
	public var	usernameMargin	: Vector2;
	public var	allianceMargin	: Vector2;
	public var	btnHelpMargin	: Rect;		// left, top, right, bottom
	public var	cornerRect		: Rect;
	public var	emblemRect		: Rect;
	public var	itemRect		: Rect;
	public var	itemMargin		: Rect;
	public var	leaugeMargin	: Rect;
	public var	separatorMargin	: int;
	public var	separatorThin	: int;
	
	public var	minAllianceGap	: int;
	public var	minAllianceWidth	: int;
	
	public var	whisperTo_Gap	: int;
	
	private var	isMe 			: boolean;
	private var	showInfoLine	: boolean;
	private var showSeparator	: boolean = false;
	
	private var chatType 		: String;
	private var sender			: String;
	private var msg				: String;
	private var helpInfo		: Hashtable;
	private var senderId		: int;
	private var selfId			: int;
	private var allianceId		: int;
	private var allianceName	: String;
	private var allianceLeague	: int;
	private var timeStamp		: long = -1;
	private var isPrivateChat	: boolean;
	private var isAva			: boolean;
	private var transLan        : String;
	private var isCanTrans      : boolean = true; //策划修改翻译按钮一直显示
	public  var rSPrefab        : ReportShareItem;
	private var isReportShare   : boolean;
	private var reportId        : int; 
	private var isAvaReportShare: boolean;
	private var serverId        : int;
	private var eventId         : int;
	private var reportShareItem : ReportShareItem;
	
	private var marchData : HashObject = new HashObject();//Info of MarchLine
	
	public function get uid() : int {
		return senderId;
	}
	
	public function get timestamp() : long {
		return timeStamp;
	}
	
	public function get isTimeSeparatorVisible() : boolean {
		return showSeparator;
	}
	
	public function DrawItem() : void
	{
	
		if (!visible)
			return;
//			return -1;
			
		//super.DrawItem();
//		GUI.BeginGroup(rect);
		
		if (showSeparator) {
			leftLine.Draw();
			rightLine.Draw();
			time.Draw();
		}
		
		avatar.Draw();
		avatarFrame.Draw();
			
		var oldMatrix = GUI.matrix;
		// keep aspect adjustment with avatar
		if (avatar.inScreenAspect)
			_Global.MultiplyAspectAdjustMatrix(avatar.rect, avatar.lockWidthInAspect, avatar.lockHeightInAspect);
		if(avatarFrame.inScreenAspect)
			_Global.MultiplyAspectAdjustMatrix(avatarFrame.rect, avatarFrame.lockWidthInAspect, avatarFrame.lockHeightInAspect);
		corner.Draw();
		alliEmblem.Draw();
		if (avatar.inScreenAspect)
			GUI.matrix = oldMatrix;
		if (avatarFrame.inScreenAspect)
			GUI.matrix = oldMatrix;
		
		balloon.Draw();
		
		if (showInfoLine) {
			badge.Draw();
			username.Draw();
			whisper.Draw();
			alliance.Draw();
			allianceLeagueIcon.Draw();
		}
		
		message.Draw();
		
		if(!isMe)
		{
		  btnInfo.Draw();
		}
		
		btnHelp.Draw();
		
		item.Draw();
		transBtn.Draw();
		transLabel.Draw();
		balloonCopy.Draw();
		
		if (isReportShare||isAvaReportShare)
		{
		if (reportShareItem!=null)
		    reportShareItem.Draw();
		}
//		GUI.EndGroup();
//		return -1;
	}
	
	
	private function assignTextWithClipping(label : SimpleLabel, text : String, prefix : String, suffix : String, width : int)
	{
		if (width >= 0)
			label.txt = prefix + text + suffix;
		else
			label.txt = _Global.GUIClipToWidth(label.mystyle, prefix + text, width, "...", suffix);
	}

	private function MoveMarch()
	{
	  if (isReportShare){
	    clickShareReport();
	  }
	  else if (isAvaReportShare)
	  {
	   clickAvaShareReport();
	  }
	  else if (isMatch) {
			if (GameMain.instance().curSceneLev()==5||GameMain.instance().curSceneLev()==6) {
				KBN.MenuMgr.instance.PopMenu("");	
				KBN.MenuMgr.instance.PopMenu("PveMainChromMenu");
				GoToMap();			
			}else if (GameMain.instance().curSceneLev()==8) {
				KBN.MenuMgr.instance.PopMenu("");
				KBN.MenuMgr.instance.PopMenu("AllianceBossListMenu");
				KBN.MenuMgr.instance.PopMenu("PveMainChromMenu");
				Invoke("GoToMap",1f);
			}
			else{
				KBN.MenuMgr.instance.PopMenu("");
				KBN.MenuMgr.instance.PopMenu("MonsterMenu");
				GoToMap();
			}
			
		}else{
			_Global.Log("Click Message");
		}	
	}
	private function GoToMap(){
		GameMain.instance().gotoMap(march_x,march_y);	
	}

	private var isMatch:boolean;
	private var march_x:int;
	private var march_y:int;
	private var isHaveTrans:boolean=false; //是否已经翻译
	private var isTranIng=false;
	private var transBaseStr:String;
	//翻译语言
	private function TransMessgae(){
		if (!isTranIng) {
			isTranIng=true;	
			if (!isHaveTrans) {
			    transBaseStr=message.txt;
				if (transBaseStr!=null&&transBaseStr!="") {
					//翻译语言
					KBN.GoogleTrans.instance().Trans(transBaseStr,TransAfer);
				}
			}else{
				if (transBaseStr!=null&&transBaseStr!="") {
					message.txt=transBaseStr;
					layout();
				}	
				transBaseStr="";
				isHaveTrans=false;
				isTranIng=false;
				transLabel.txt=Datas.getArString("Chat.Translate_Text1");
			}
		}	
	}

	private function TransAfer(isScuess:boolean,la:String,tranInfo:String){
		if (isScuess) {
			message.txt=tranInfo;
			isHaveTrans=true;
			transLabel.txt=la;
			layout();
		}
		isTranIng=false;
	}

	public function HaveChatFrame() : Boolean
	{
		if(this.chatFrame != null && this.chatFrame != "img0")
		{
			return true;
		}

		return false;
	}
	
	public function SetRowData(_data : Object) : void {
		
		transLabel.txt=Datas.getArString("Chat.Translate_Text1");
		balloonCopy.OnClick = MoveMarch;
		// balloonCopy.OnClick=TransMessgae;
		transBtn.OnClick=TransMessgae;
		var data : Hashtable = _data as Hashtable;
		chatType = data["type"];
		chatFrame = data["chatFrame"];
		
		sender 			= (null == data["username"] ? "" : data["username"]);
		msg 			= (null == data["message"] ? "" : data["message"]);
		senderId 		= (null == data["userid"] ? -1 : _Global.INT32(data["userid"]));
		selfId 			= Datas.instance().tvuid();
		allianceId 		= (null == data["allianceID"] ? -1 : _Global.INT32(data["allianceID"]));
		allianceName 	= (null == data["allianceName"] ? "" : data["allianceName"]);
		allianceLeague  = (null == data["allianceLeague"] ? 0 : data["allianceLeague"]);
		timeStamp		= (null == data["time"] ? -1 : _Global.INT64(data["time"]));
		isPrivateChat	= false;
		isAva			= (null == data["ava"] ? false : _Global.INT32(data["ava"]) == 1);
		//transLan        = (null != data["transLan"]?data["transLan"]:"");
		isReportShare   = (data["shareReport"]!=null &&data["shareReport"]!=""? true : false);
		isAvaReportShare= (null == data["AVAshareReport"]? false : true);
		if(isReportShare||isAvaReportShare)
		{
		    reportShareItem = Instantiate(rSPrefab).GetComponent("ReportShareItem");
		}

		// var gameLanguage:int = PlayerPrefs.GetInt("language" ,LocaleUtil.defaultID);
		// var toLanguage:String=LocaleUtil.getInstance().getFileName(gameLanguage);
		//isCanTrans= (transLan!=""&&transLan!=toLanguage);
		if (null != data["allianceEmblem"]) {
			alliEmblem.Data = data["allianceEmblem"];
		} else {
			alliEmblem.Data = null;
		}
		alliEmblem.SetVisible(false);
		
		corner.SetVisible(false);
		btnHelp.txt = Datas.getArString("Common.Help");
		enableButton(true);
		btnHelp.SetVisible(false);
		showInfoLine = true;
		alliance.txt = "";
		item.SetVisible(false);
		
		whisper.txt = " " + Datas.getArString("Common.Whisper");
		whisper.SetVisible(false);
		
		// avatar
		setSystemAvatar();
		badge.SetVisible(false);
		
		leftLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line_list_small", TextureType.DECORATION);
		rightLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line_list_small", TextureType.DECORATION);
		balloon.mystyle.normal.background = HaveChatFrame() ? TextureMgr.instance().LoadTexture(this.chatFrame, TextureType.DECORATION) : TextureMgr.instance().LoadTexture("ui_chat_white", TextureType.DECORATION);
		
		isMe = (null == data["isMe"] ? (selfId == senderId) : _Global.GetBoolean(data["isMe"]));
		
		username.SetFont();
		username.txt = sender;
		if (GameMain.instance().curSceneLev()!=9) {
			_Global.GetPositionFromString(msg,msg,isMatch,march_x,march_y);
		}
		if (isReportShare){
		  reportShareData(msg);
		}
		else if (isAvaReportShare)
		{
		  avaReportShareData(msg);
		}
		 else {
		  message.txt = msg;
		}
		username.normalTxtColor = FontColor.Grey;
		message.normalTxtColor = FontColor.SmallTitle;
		alliance.normalTxtColor = FontColor.SmallTitle;
		alliance.SetVisible(false);
		allianceLeagueIcon.SetVisible(false);
		switch (chatType) {
		case Constant.ChatType.CHAT_ALCRQANSWER:
			username.normalTxtColor = FontColor.Dark_Red;
			message.normalTxtColor = FontColor.Dark_Red;
			username.mystyle.fontStyle = FontStyle.Italic;
			message.mystyle.fontStyle = FontStyle.Italic;
			balloon.mystyle.normal.background = HaveChatFrame() ? TextureMgr.instance().LoadTexture(this.chatFrame, TextureType.DECORATION) : TextureMgr.instance().LoadTexture("ui_chat_yellow", TextureType.DECORATION);
			setIconForAlliance(_Global.INT32(data["title"]), _Global.GetBoolean(data["isMVP"]));
			setAvatar(data["avatar"], data["avatarFrame"]);
			break;
		case Constant.ChatType.CHAT_ALCREQUEST:
			alliance.SetVisible(true);
			if (_Global.INT32(data["requestType"]) == Constant.AllianceRequestType.RESOURCE) {
				alliance.txt = Datas.getArString("Alliance.ResourceRequest");
			} else if(_Global.INT32(data["requestType"]) == Constant.AllianceRequestType.REINFORCE){//Caisen 2014.8.18 start
				alliance.txt = Datas.getArString("Alliance.ReinforceRequest");
			} else if(_Global.INT32(data["requestType"]) == Constant.AllianceRequestType.TOURNAMAMENT_HELP) {
				alliance.txt = Datas.getArString("Alliance.MarchRequest");
			}//Caisen 2014.8.18 end
			alliance.normalTxtColor = FontColor.Dark_Red;
			username.normalTxtColor = FontColor.Dark_Red;
			message.normalTxtColor = FontColor.Dark_Red;
			username.mystyle.fontStyle = FontStyle.Italic;
			message.mystyle.fontStyle = FontStyle.Italic;
			balloon.mystyle.normal.background = HaveChatFrame() ? TextureMgr.instance().LoadTexture(this.chatFrame, TextureType.DECORATION) : TextureMgr.instance().LoadTexture("ui_chat_yellow", TextureType.DECORATION);
			setIconForAlliance(_Global.INT32(data["title"]), _Global.GetBoolean(data["isMVP"]));
			setAvatar(data["avatar"], data["avatarFrame"]);
			
			if (!isMe) {
				btnHelp.SetVisible(true);
				btnHelp.OnClick = function() {
					var x : int = _Global.INT32(data["requestX"]);
					var y : int = _Global.INT32(data["requestY"]);
					var requestId : int = _Global.INT32(data["requestId"]);
					
					if (null != data["requestType"] && _Global.INT32(data["requestType"]) == Constant.AllianceRequestType.RESOURCE) {
						// resource
						// MenuMgr.getInstance().PushMenu("MarchMenu",
						// 	{
						// 		"x" : x, 
						// 		"y" : y, 
						// 		"type" : Constant.MarchType.TRANSPORT,
						// 		"requestUser" : sender,
						// 		"requestId" : requestId,
						// 		"res" : data["res"],
						// 		"resArr" : data["resArr"]
						// 	},
						// 	"trans_zoomComp");
							MarchDataManager.instance().SetData(
							{
								"x" : x, 
								"y" : y, 
								"type" : Constant.MarchType.TRANSPORT,
								"requestUser" : sender,
								"requestId" : requestId,
								"res" : data["res"],
								"resArr" : data["resArr"]
							});
					} else {
							// reinforce
							// MenuMgr.getInstance().PushMenu("MarchMenu",
							// 	{
							// 		"x" : x,
							// 		"y" : y, 
							// 		"type" : Constant.MarchType.REINFORCE,
							// 		"requestUser" : sender,
							// 		"requestId" : requestId
							// 	},
							// 	"trans_zoomComp");
								MarchDataManager.instance().SetData(
									{
										"x" : x,
										"y" : y, 
										"type" : Constant.MarchType.REINFORCE,
										"requestUser" : sender,
										"requestId" : requestId
									}
								);
					}
				};
			}
			
			break;
		case Constant.ChatType.AVA_RALLY_ATTACK:
			alliance.SetVisible(true);
			alliance.normalTxtColor = FontColor.Dark_Red;
			username.normalTxtColor = FontColor.Dark_Red;
			message.normalTxtColor = FontColor.Dark_Red;
			username.mystyle.fontStyle = FontStyle.Italic;
			message.mystyle.fontStyle = FontStyle.Italic;
			balloon.mystyle.normal.background = HaveChatFrame() ? TextureMgr.instance().LoadTexture(this.chatFrame, TextureType.DECORATION) : TextureMgr.instance().LoadTexture("ui_chat_yellow", TextureType.DECORATION);
			setIconForAlliance(_Global.INT32(data["title"]), _Global.GetBoolean(data["isMVP"]));
			setAvatar(data["avatar"], data["avatarFrame"]);
			
			var log_arr:String[] = (data["activity_log"] as String).Split("#"[0]);
			var tileType:int = _Global.INT32(log_arr[7]);
			var xcoord:int = _Global.INT32(log_arr[8]);
			var ycoord:int = _Global.INT32(log_arr[9]);
			var timeLeft:int = _Global.INT32(log_arr[10]);
			
			message.mystyle.richText = true;
			message.txt = String.Format(Datas.getArString("AVA.WarRoom_StartRallyAttackLog"),
			                              String.Empty,
			                              "<color=#00A0E9>" + Datas.getArString( AvaUtility.GetTileNameKey(tileType)) + "</color>",
			                              "<color=#00A0E9>(" + xcoord + "," + ycoord + ")</color>",
										  (timeLeft / 60));
			
			
			if (!isMe) {
				btnHelp.SetVisible(true);
				btnHelp.OnClick = function() {
					MenuMgr.getInstance().PopMenu("AvaChatMenu");
					MenuMgr.getInstance().PushMenu("AvaCoopMenu", 
						{
							"gotoRallyAttack" : 1
						});
				};
			}
			
			break;
		case Constant.ChatType.HELP_FOUNDER_INITIATE:
			balloon.mystyle.normal.background = HaveChatFrame() ? TextureMgr.instance().LoadTexture(this.chatFrame, TextureType.DECORATION) : TextureMgr.instance().LoadTexture("ui_chat_white", TextureType.DECORATION);
			alliance.SetVisible(true);
			alliance.txt = Datas.getArString("Alliance.SpeedupRequest");
			alliance.normalTxtColor = FontColor.Dark_Red;
			username.normalTxtColor = FontColor.Dark_Red;
			message.normalTxtColor = FontColor.Dark_Red;
			username.mystyle.fontStyle = FontStyle.Italic;
			message.mystyle.fontStyle = FontStyle.Italic;
			
			setIconForAlliance(_Global.INT32(data["title"]), _Global.GetBoolean(data["isMVP"]));
			setAvatar(data["avatar"], data["avatarFrame"]);
			break;
		case Constant.ChatType.HELP_HELPER_CONFIRM:
		
			helpInfo = data["data"];
				
			if( null != helpInfo["type"] && helpInfo["type"] == "AllianceSpeedUp" ) {
				btnHelp.OnClick = helpMarchAccelerate;
			} else {
				btnHelp.OnClick = helpAccelerate;
			}
			
			btnHelp.SetVisible(true);
			alliance.SetVisible(true);
			alliance.txt = Datas.getArString("Alliance.SpeedupRequest");
			alliance.normalTxtColor = FontColor.Dark_Red;
			username.normalTxtColor = FontColor.Dark_Red;
			message.normalTxtColor = FontColor.Dark_Red;
			username.mystyle.fontStyle = FontStyle.Italic;
			message.mystyle.fontStyle = FontStyle.Italic;
			balloon.mystyle.normal.background = HaveChatFrame() ? TextureMgr.instance().LoadTexture(this.chatFrame, TextureType.DECORATION) : TextureMgr.instance().LoadTexture("ui_chat_yellow", TextureType.DECORATION);
			setIconForAlliance(_Global.INT32(data["title"]), _Global.GetBoolean(data["isMVP"]));
			setAvatar(data["avatar"], data["avatarFrame"]);
			break;
		case Constant.ChatType.CHAT_RULE:
			message.txt = Datas.getArString("Chat.ChatRules") + ":" + Datas.getArString("Chat.Rules");
			
			showInfoLine = true;
			username.txt = Datas.getArString("Chat.ExceptionName");
			username.normalTxtColor = FontColor.Grey;
			username.mystyle.fontStyle = FontStyle.Italic;
			message.normalTxtColor = FontColor.Grey;
			message.mystyle.fontStyle = FontStyle.Italic;
			break;
		case Constant.ChatType.CHAT_AWARD:
			showInfoLine = true;
			username.txt = Datas.getArString("Chat.ExceptionName");
			username.normalTxtColor = FontColor.Grey;
			message.normalTxtColor = FontColor.Grey;
			username.mystyle.fontStyle = FontStyle.Italic;
			message.mystyle.fontStyle = FontStyle.Italic;
			
			item.SetVisible(true);
			item.useTile = true;
			item.tile = TextureMgr.instance().ElseIconSpt().GetTile(Datas.instance().getImageName(data["itemId"]));
			
			break;
		case Constant.ChatType.CHAT_MONSTER:
			username.txt = Datas.getArString("Chat.ExceptionName");
			username.normalTxtColor = FontColor.Grey;
			message.normalTxtColor = FontColor.Grey;
			username.mystyle.fontStyle = FontStyle.Italic;
			message.mystyle.fontStyle = FontStyle.Italic;
			break;
		case Constant.ChatType.CHAT_NOT_ONLINE:
		case Constant.ChatType.CHAT_NO_USER:
			isMe = false;
			username.txt = Datas.getArString("Chat.ExceptionName");
			if (chatType.Equals(Constant.ChatType.CHAT_NOT_ONLINE))		
				message.txt = data["to"] + " " + Datas.getArString("Chat.NotOnline");
			else if (chatType.Equals(Constant.ChatType.CHAT_NO_USER))
				message.txt = data["to"] + " " + Datas.getArString("Chat.UserNotExist");
				
			username.normalTxtColor = FontColor.Grey;
			username.mystyle.fontStyle = FontStyle.Italic;
			message.normalTxtColor = FontColor.Grey;
			message.mystyle.fontStyle = FontStyle.Italic;
			showInfoLine = true;
			break;
		case Constant.ChatType.CHAT_EXCEPTION:
			isMe = false;
			username.normalTxtColor = FontColor.Grey;
			username.mystyle.fontStyle = FontStyle.Italic;
			message.normalTxtColor = FontColor.Grey;
			message.mystyle.fontStyle = FontStyle.Italic;
			break;
		case Constant.ChatType.CHAT_GLOBLE:
			setAvatar(data["avatar"], data["avatarFrame"]);
			if (null != alliEmblem.Data) alliEmblem.SetVisible(true);
				
			if (!String.IsNullOrEmpty(allianceName)) {
				alliance.SetVisible(true);
				alliance.txt = "[" + allianceName + "]";
				allianceLeagueIcon.SetVisible(true);
				allianceLeagueIcon.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(allianceLeague),TextureType.DECORATION);
			}
			if (isMe) {
				balloon.mystyle.normal.background = HaveChatFrame() ? TextureMgr.instance().LoadTexture(this.chatFrame, TextureType.DECORATION) : TextureMgr.instance().LoadTexture("ui_chat_blue", TextureType.DECORATION);
			}
			setBadge(data["badge"]);
			break;
		case Constant.ChatType.CHAT_WHISPER:
			setAvatar(data["avatar"], data["avatarFrame"]);
			if (null != alliEmblem.Data) alliEmblem.SetVisible(true);
			if (isMe) {
				whisper.txt = Datas.getArString("Common.WhisperTo");
				whisper.SetVisible(true);
				username.txt = data["to"];
				balloon.mystyle.normal.background = HaveChatFrame() ? TextureMgr.instance().LoadTexture(this.chatFrame, TextureType.DECORATION) : TextureMgr.instance().LoadTexture("ui_chat_green", TextureType.DECORATION);
			} else {
				whisper.SetVisible(true);
				balloon.mystyle.normal.background = HaveChatFrame() ? TextureMgr.instance().LoadTexture(this.chatFrame, TextureType.DECORATION) : TextureMgr.instance().LoadTexture("ui_chat_green", TextureType.DECORATION);
				setBadge(data["badge"]);
				if (!String.IsNullOrEmpty(allianceName)) {
					alliance.SetVisible(true);
					alliance.txt = "[" + allianceName + "]";
				}
			}
			break;
		case Constant.ChatType.CHAT_ALLIANCE:
		case Constant.ChatType.CHAT_ALLIANCE_OFFICER:
			if (senderId > 0)
				setAvatar(data["avatar"], data["avatarFrame"]);
			if (isMe) {
				balloon.mystyle.normal.background = HaveChatFrame() ? TextureMgr.instance().LoadTexture(this.chatFrame, TextureType.DECORATION) : TextureMgr.instance().LoadTexture("ui_chat_blue", TextureType.DECORATION);
			}
			setIconForAlliance(_Global.INT32(data["title"]), _Global.GetBoolean(data["isMVP"]));
			
			break;
		case Constant.ChatType.CHAT_PRIVATE_ONE2ONE:
			setAvatar(data["avatar"], data["avatarFrame"]);
			balloon.mystyle.normal.background = HaveChatFrame() ? TextureMgr.instance().LoadTexture(this.chatFrame, TextureType.DECORATION) : TextureMgr.instance().LoadTexture("ui_chat_green", TextureType.DECORATION);
			isPrivateChat = true;
			showInfoLine = false;
			break;
		};
		
		username.SetFont();
		whisper.SetFont();
		alliance.SetFont();
		message.SetFont();
		btnHelp.SetFont();
		time.SetFont();
		
		btnInfo.OnClick = playerProfile;
		
		if (showSeparator) {
			if (-1 != timeStamp)
				formatTimeLabel();
			else
				showSeparator = false;
		}
		
		layout();
	}
	
	public function SetTimeSeparatorVisible(v : boolean) : void {
		if (v == showSeparator)
			return;
		if (v && -1 == timeStamp)
			return;
		
		showSeparator = v;
		if (showSeparator) {
			formatTimeLabel();
		}
		layout();
	}
	
	private function formatTimeLabel() : void {
		// TODO
		time.txt = _Global.DateTimeChatFormat(timeStamp);
	}
	
	private function layout() : void {
		if(HaveChatFrame())
			balloon.mystyle.border = new RectOffset(50, 50, 50, 50);
		else 
			this.balloon.mystyle.border = new RectOffset(25, 25, 50, 25);
		var msgWidth : int = totalWidth - avatarRect.width - balloonPadding.x - balloonPadding.width;
		if (btnHelp.isVisible()) {
			msgWidth -= (btnHelp.rect.width + btnHelpMargin.x + btnHelpMargin.width);
		}
		if (item.isVisible()) {
			msgWidth -= (itemRect.width + itemMargin.x + itemMargin.width);
		}
		var msgHeight : int = message.mystyle.CalcHeight(new GUIContent(message.txt), msgWidth);
		var msgTop : int = balloonPadding.y + (showInfoLine ? infoLineHeight : 0);
		
		// height of separator line does NOT calculated into totalHeight
		var heightsetoff:int = (isReportShare||isAvaReportShare)? 70:0;
		var totalHeight : int = msgHeight + balloonPadding.height + 33 + heightsetoff;
		if (item.isVisible()) {
			var minHeightWithItem : int = msgTop + itemRect.height + itemMargin.height + balloonPadding.height;
			if (totalHeight < minHeightWithItem)
				totalHeight = minHeightWithItem;
		}
		if (minHeight > totalHeight)
			totalHeight = minHeight;
		
		// height of separator
		var sepHeight : int = 30;
		if (showSeparator) {
			var timeSize : Vector2 = time.mystyle.CalcSize(new GUIContent(time.txt));
			
			var lineLength : int = (totalWidth - timeSize.x) / 2;
			sepHeight = separatorThin > timeSize.y ? separatorThin : timeSize.y;
			
			var lineTop : int = separatorThin > timeSize.y ? 0 : (timeSize.y - separatorThin) / 2;
			var timeTop : int = separatorThin > timeSize.y ? (separatorThin - timeSize.y) / 2 : 0;
			
			sepHeight += separatorMargin * 2;
			lineTop += 3;		//separatorMargin ;
			timeTop += 3;		//separatorMargin ;
			
			leftLine.rect = new Rect(0, lineTop, lineLength, separatorThin);
			time.rect = new Rect(leftLine.rect.xMax, timeTop, timeSize.x, timeSize.y);
			rightLine.rect = new Rect(time.rect.xMax, lineTop, lineLength, separatorThin);
		}
		
		rect.width = totalWidth;
		if (isMe) {
			var cornerMargin:float = 0;
			var emblemMargin:float = 0;
			if (corner.isVisible())
				cornerMargin = cornerRect.x;
			if (alliEmblem.isVisible())
				emblemMargin = emblemRect.x + 10;
			this.rect.width += Mathf.Max(cornerMargin, emblemMargin);
		}
		if(KBN._Global.isIphoneX()) {
			lockHeightInAspect=true;
			sepHeight -=10;
		}else lockHeightInAspect=false;
		if(inScreenAspect)
		{
			var mScaleX:float = GetScreenScale().x;
			var mScaleY:float = GetScreenScale().y;
			this.useDrawrect=true;
			if(lockHeightInAspect)
			{
				mScaleX = Mathf.Clamp(mScaleX,0.7f,1.2f);
				this.rect.height  = mScaleY * (totalHeight + sepHeight + 35) + 50;
			}
			else
			{
				if (KBN._Global.IsLargeResolution ()) 
				{	
					mScaleY = Mathf.Clamp(mScaleY,0.7f,1.2f);
					this.rect.height  = mScaleY * (totalHeight + sepHeight) + 80;
				}
				else
				{
					mScaleY = Mathf.Clamp(mScaleY,0.7f,1.2f);
					this.rect.height  = mScaleY * (totalHeight + sepHeight )+ 80;
				}
			}
			DistNormal.x = this.rect.width;
			DistNormal.y = this.rect.height;
		}else{
			this.rect.height  = mScaleY * (totalHeight + sepHeight );
		}
//		rect.height = totalHeight + sepHeight;
		
		// avatar and balloon
		if (isMe) {
			avatar.rect = new Rect(totalWidth - avatarRect.width, sepHeight + avatarRect.y - 23, 
				avatarRect.width, avatarRect.height);
			avatarFrame.rect = new Rect(totalWidth - avatarFrameRect.width, sepHeight + avatarFrameRect.y - 23, 
				avatarFrameRect.width, avatarFrameRect.height);
			
			balloon.rect = new Rect(-2.5f, sepHeight + 2, avatar.rect.x, totalHeight);
			balloon.flipX = true;
		} else {
			avatar.rect = new Rect(avatarRect.x, sepHeight + avatarRect.y - 23,
				avatarRect.width, avatarRect.height);
			avatarFrame.rect = new Rect(avatarFrameRect.x, sepHeight + avatarFrameRect.y - 23,
				avatarFrameRect.width, avatarFrameRect.height);
			
			balloon.rect = new Rect(avatarRect.width + 8, sepHeight + 2, totalWidth - avatarRect.width - 9, totalHeight);
		}
		if (isReportShare||isAvaReportShare){
		   reportShareItem.rect = balloon.rect;
		   reportShareItem.Init();
		}
		balloonCopy.rect=balloon.rect;
		transBtn.rect.y=balloon.rect.y+balloon.rect.height-34;
		transLabel.rect.y=balloon.rect.y+balloon.rect.height-30;
		// corner
		if (corner.isVisible()) {
			corner.rect = new Rect(
				avatar.rect.xMax - cornerRect.width + cornerRect.x,
				avatar.rect.yMax - cornerRect.height + cornerRect.y,
				cornerRect.width, cornerRect.height);
		}
		
		// alliance emblem
		if (alliEmblem.isVisible()) {
			alliEmblem.rect = new Rect(
				avatar.rect.xMax - emblemRect.width + emblemRect.x,
				avatar.rect.yMax - emblemRect.height + emblemRect.y,
				emblemRect.width, emblemRect.height);
		}
		
		// message text
		var leftPadding : int = isMe ? balloonPadding.width : balloonPadding.x;
		var rightPadding : int = isMe ? balloonPadding.x : balloonPadding.width;
		message.rect = new Rect(
				balloon.rect.x + leftPadding, 
				balloon.rect.y + 18,
				msgWidth, msgHeight);
		
		var usernameLeft : int = message.rect.x + usernameMargin.x;
		var usernameTop : int = balloon.rect.y + balloonPadding.y + usernameMargin.y - 38;
		
		// badge
		if (badge.isVisible()) {
			badge.rect = new Rect(
				message.rect.x + badgeRect.x, balloon.rect.y + balloonPadding.y + badgeRect.y,
				badgeRect.width, badgeRect.height);
			
			usernameLeft += (badgeRect.x + badgeRect.width);
		}
		
		// username & whisper label & alliance
		var whisperSize : Vector2 = whisper.mystyle.CalcSize(new GUIContent(whisper.txt));
		var usernameSize : Vector2 = username.mystyle.CalcSize(new GUIContent(username.txt));
		var allianceSize : Vector2 = alliance.mystyle.CalcSize(new GUIContent(alliance.txt));
		
		if (isMe) whisperSize.x += whisperTo_Gap; // add gap after "whisper to" string;
		var totalInfoWidth : int = usernameSize.x + (whisper.isVisible() ? whisperSize.x : 0) +
									(alliance.isVisible() ? (allianceSize.x + minAllianceGap + allianceMargin.x) : 0);
		
		var expectedUsernameWidth : int = usernameSize.x;
		var expectedAllianceWidth : int = allianceSize.x;
		
		if (usernameLeft + totalInfoWidth > balloon.rect.xMax - rightPadding) {
			if (alliance.isVisible()) {
				if (!String.IsNullOrEmpty(allianceName)) { // has alliance,   clip alliance name first, then user name
					expectedAllianceWidth = balloon.rect.xMax - rightPadding - usernameLeft - usernameSize.x - 
												(whisper.isVisible() ? whisperSize.x : 0) - minAllianceGap - allianceMargin.x;
					if (expectedAllianceWidth < minAllianceWidth) {
						expectedAllianceWidth = minAllianceWidth;
						expectedUsernameWidth = balloon.rect.xMax - rightPadding - usernameLeft - expectedAllianceWidth - 
												(whisper.isVisible() ? whisperSize.x : 0) - minAllianceGap - allianceMargin.x;
					}
				} else {  // alliance help,  clip user name
					expectedUsernameWidth = balloon.rect.xMax - rightPadding - usernameLeft - expectedAllianceWidth - 
												(whisper.isVisible() ? whisperSize.x : 0) - minAllianceGap - allianceMargin.x;
				}
			} else { // no alliance,  clip user name
				expectedUsernameWidth = balloon.rect.xMax - rightPadding - usernameLeft - (whisper.isVisible() ? whisperSize.x : 0);
			}
		}
		
		assignTextWithClipping(username, username.txt, null, null, expectedUsernameWidth);
		usernameSize = username.mystyle.CalcSize(new GUIContent(username.txt));
		username.rect = new Rect(usernameLeft, usernameTop, usernameSize.x, usernameSize.y);
		
		// whisper label
		if (whisper.isVisible()) {
			if (isMe) {
				whisper.rect = new Rect(usernameLeft, usernameTop + usernameSize.y - whisperSize.y, whisperSize.x, whisperSize.y);
				username.rect.x = whisper.rect.xMax;
			} else {
				whisper.rect = new Rect(username.rect.xMax, usernameTop + usernameSize.y - whisperSize.y, whisperSize.x, whisperSize.y);
			}
		}
		
		// alliance info
		if (alliance.isVisible()) {
			if (!String.IsNullOrEmpty(allianceName)) {
				assignTextWithClipping(alliance, allianceName, "[", "]", expectedAllianceWidth);
			}
			allianceSize = alliance.mystyle.CalcSize(new GUIContent(alliance.txt));
			alliance.rect = new Rect(
				balloon.rect.xMax - rightPadding - allianceSize.x - allianceMargin.x + 25, 
				balloon.rect.y + balloonPadding.y + allianceMargin.y - 32,
				allianceSize.x, allianceSize.y);
			allianceLeagueIcon.rect = new Rect(
				balloon.rect.xMax - rightPadding - leaugeMargin.width - allianceSize.x + 15, 
				balloon.rect.y - 30,
				leaugeMargin.width, leaugeMargin.height);
		}
		
		// help button
		btnHelp.rect = new Rect(
			balloon.rect.xMax - rightPadding - btnHelp.rect.width - btnHelpMargin.width,
			message.rect.y + btnHelpMargin.y,
			btnHelp.rect.width,
			btnHelp.rect.height);
		
		// item icon
		if (item.isVisible()) {
			item.rect = new Rect(
				balloon.rect.xMax - rightPadding - itemRect.width - itemMargin.width,
				message.rect.y + itemMargin.y,
				itemRect.width,
				itemRect.height);
		}
			
		// whole bg button
		btnInfo.rect = avatar.rect;
		ChatMenu.getInstance().scrollViewAutoLayout();
	}
	
	public var relayout : boolean = false;
	public function Update() {
		if (relayout) {
			relayout = false;
			layout();
		}
		transBtn.SetVisible(GameMain.singleton.IsTrans()&&!isMe&&isCanTrans&&!(isReportShare||isAvaReportShare||isMatch));
		transLabel.SetVisible(GameMain.singleton.IsTrans()&&!isMe&&isCanTrans&&!(isReportShare||isAvaReportShare||isMatch));
	}
	
	protected function enableButton(enabled : boolean) {
		btnHelp.SetDisabled(!enabled);
		var btnColor : String = enabled ? "Brown" : "Gray";
		btnHelp.mystyle.normal.background = TextureMgr.instance().LoadTexture(String.Format("button_ChatHelp_{0}_normal", btnColor), TextureType.BUTTON);
		btnHelp.mystyle.active.background = TextureMgr.instance().LoadTexture(String.Format("button_ChatHelp_{0}_down", btnColor), TextureType.BUTTON);
	}
	
	private function playerProfile() {
		if (isMe || senderId <= 0 || isAva) return;
		
		var userInfo = new UserDetailInfo();
		userInfo.userId = "" + senderId;
		userInfo.userName = sender;
		userInfo.allianceId = "" + allianceId;
		userInfo.viewFrom = isPrivateChat ? UserDetailInfo.ViewFromOne2OneChat : UserDetailInfo.ViewFromChat;
		MenuMgr.getInstance().PushMenu("PlayerProfile", userInfo, "trans_zoomComp");
	}
	private function helpMarchAccelerate() {
		var cityID : int = helpInfo["cityId"]!=null ?  _Global.INT32(helpInfo["cityId"]) : 0;
		
		
		var tileInfo : String = "";
		if( helpInfo["dataId"] != null ) {
			tileInfo = helpInfo["dataId"] as String;
		}
		
		var canGiveHelp : System.Action.< HashObject > = function( param : HashObject )
		{
			enableButton(false);
			MenuMgr.getInstance().Chat.giveHelpSuccess(helpInfo);
		};
		
		var cannotGiveHelp : System.Action.< HashObject > = function( param : HashObject )
		{
			enableButton(false);
		};
		
		
		var a : Array = tileInfo.Split( "_"[0] );
		//a[0] as String
		
		//a[2] as String
		
		var marchID : int = (a[0] as String)!=null ? _Global.INT32(a[0]) : 0;////
		var curValue : int = (a[1] as String)!=null ? _Global.INT32(a[1]) : 0;////
		var maxValue : int = (a[2] as String)!=null ? _Global.INT32(a[2]) : 0;////
		var marchEndTime : long = (a[3] as String)!=null ? _Global.INT64(a[3]) : 0;////
		var marchStartTime : long = (a[4] as String)!=null ? _Global.INT64(a[4]) : 0;////
		
				
		var reqhash : Hashtable = new Hashtable();//send
		reqhash.Add( "rid", ""+marchID );
		UnityNet.reqWWW("fetchMarch.php", reqhash, okFunc, null);
		
		
		
		if( cityID != 0 && marchID != 0 ) {
			KBN.TournamentManager.getInstance().setAllianceHelpCityMarch( cityID, marchID );
			
			marchData["cityID"] = new HashObject();
			marchData["cityID"].Value = ""+cityID;
			marchData["marchID"] = new HashObject();
			marchData["marchID"].Value = ""+marchID;
			marchData["curValue"] = new HashObject();///////
			marchData["curValue"].Value = ""+curValue;///////
			marchData["maxValue"] = new HashObject();//////
			marchData["maxValue"].Value = ""+maxValue;//////
			//marchData["marchEndTime"] = new HashObject();//////
			//marchData["marchEndTime"].Value = ""+marchEndTime;//////
			marchData["marchStartTime"] = new HashObject();//////
			marchData["marchStartTime"].Value = ""+marchStartTime;//////
			marchData["canGiveHelp"] = new HashObject();
			marchData["canGiveHelp"].Value = canGiveHelp;
			marchData["cannotGiveHelp"] = new HashObject();
			marchData["cannotGiveHelp"].Value = cannotGiveHelp;
		}
		
		
	}
	function okFunc(result:HashObject):void
	{
		marchData["marchEndTime"] = new HashObject();//////
		if(_Global.INT32(result["march"]["marchStatus"].Value)==1)
		{
			marchData["marchEndTime"].Value = ""+result["march"]["destinationUnixTime"].Value;//////
		}
		else if(
		_Global.INT32(result["march"]["marchStatus"].Value)==7||
		_Global.INT32(result["march"]["marchStatus"].Value)==8||
		_Global.INT32(result["march"]["marchStatus"].Value)==9)
		{
			marchData["marchEndTime"].Value = ""+result["march"]["returnUnixTime"].Value;//////
		}
		
		if(GameMain.unixtime()>=_Global.INT32(marchData["marchEndTime"].Value))
		{
			MenuMgr.getInstance().PushMessage(Datas.getArString("Alliance.Request_March_Toaster"));
		}
		else
		{
			MenuMgr.getInstance().PushMenu( "SpeedUpMenu4MarchHelp", marchData, "trans_zoomComp" );
		}
		//Debug.Log(result);
	};
	
	private function helpAccelerate() {
		
		var params:Array = new Array();
		
		params.Add(helpInfo["inviterId"]);
		params.Add(helpInfo["cityId"]);
		params.Add(helpInfo["type"]);
		params.Add(helpInfo["dataId"]);
		params.Add(helpInfo["dataLv"]);
		params.Add(helpInfo["dataType"]);

		var canGiveHelp:Function = function(result:HashObject)
		{
			if(result["ok"].Value)
			{
				enableButton(false);
				MenuMgr.getInstance().Chat.giveHelpSuccess(helpInfo);
			}
		};
		
		var cannotGiveHelp : Function = function(errorMsg : String, errorCode : String) {
			if (errorCode == "1901") { // Already offered help
				enableButton(false);
			}
			var localizedErrorMsg : String = UnityNet.localError(errorCode, errorMsg, String.Empty);
			if(errorMsg != null) {
				ErrorMgr.instance().PushError("",localizedErrorMsg);
			}
		};
		UnityNet.reqGiveHelp(params, canGiveHelp, cannotGiveHelp);
	}
	
	private function setSystemAvatar() : void {
		avatar.useTile = false;
//		avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile("ui_chat_npc");
		avatar.setBackground("quest_point", TextureType.DECORATION);
		avatarFrame.useTile = false;
	}
	
	private function setAvatar(name : String, frame : String) : void {
		if (name == "system") {
			setSystemAvatar();
		} else {
			avatar.useTile = true;
			avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(name));
			if(frame != null && frame != "img0")
			{
				avatarFrame.useTile = true;
				avatarFrame.tile = TextureMgr.instance().ElseIconSpt().GetTile(frame);
			}
		}
	}
	
	private function setBadge(name : String) : void {
		if (String.IsNullOrEmpty(name)) {
			badge.SetVisible(false);
		} else {
			badge.SetVisible(true);
			badge.useTile = true;
			badge.tile = TextureMgr.instance().ElseIconSpt().GetTile(name);
		}
	}
	
	private function setIconForAlliance(title : int, isMVP : boolean) : void {
		if (isMVP) {
			badge.mystyle.normal.background = TextureMgr.instance().LoadTexture("mvp", TextureType.ICON);
			badge.SetVisible(true);
		} else {
			badge.SetVisible(false);
		}
		
		if (title == Constant.Alliance.Chancellor) {
			corner.SetVisible(true);
			corner.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_chief", TextureType.ICON);
		} else if (title == Constant.Alliance.ViceChancellor) {
			corner.SetVisible(true);
			corner.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_deputy_chief", TextureType.ICON);
		} else if (title == Constant.Alliance.Officer || title == Constant.Alliance.DefenseMinister || title == Constant.Alliance.DeputyDefenseMinister) {
			corner.SetVisible(true);
			corner.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_officer", TextureType.ICON);
		} else {
			corner.SetVisible(false);
		}
	}
	
	public function changeIconForAlliance(title : int, isMVP : boolean) : void {
		setIconForAlliance(title, isMVP);
		layout();
	}
	
	
	
	// ---------------------------  report share -----------------------------
	
	
	private function reportShareData(msg:String):void{
		var arr:Array = msg.Split(":"[0]);
		if(arr.length>2)
		{
			var defName:String = arr[0].ToString();
			var attackName:String = arr[1].ToString();
			var isWin:boolean = _Global.INT32(arr[2])==1;
			//_Global.LogWarning(">>>>>>>>>defName: "+defName+"attacker: "+attackName+"isWin: "+_Global.INT32(arr[2]));
			reportShareItem.SetData(attackName,defName,isWin);
			reportId = _Global.INT32(arr[3]);
	    }
	}
	
	private function clickShareReport():void{
	 	var okFunc = function(result : HashObject)
	   {
	    if (_Global.GetBoolean(result["ok"]))
		{
		   var obj:Hashtable = {};
		   MenuMgr.getInstance().PushMenu("EmailMenu",obj,"trans_immediate");
			MenuMgr.getInstance().getMenuAndCall("EmailMenu", function (menu:EmailMenu) {
			var emailMenu:EmailMenu = menu as EmailMenu;
			var data = {"type": emailMenu.REPORT_TYPE, "index":0,"isSys":false,"otherData":result,"senderID":senderId};
			emailMenu.getInstance().ClickShareReport(data);	
		});
		// var data = {"type": EmailMenu.REPORT_TYPE, "index":0,"isSys":false,"otherData":result,"senderID":senderId};
		// EmailMenu.getInstance().ClickShareReport(data);	

        }
	   };
	   UnityNet.getReportData(senderId,reportId,okFunc,null);
	}
	
	
	private function avaReportShareData(msg:String):void
	{
	    var arr:Array = msg.Split(":"[0]);
	    var defName:String = arr[0].ToString();
	    var attackName:String = arr[1].ToString();
	    var isWin:boolean = _Global.INT32(arr[2])==1;
	   // var isWin:boolean = true;
	    //_Global.LogWarning(">>>>>>>>>defName: "+defName+"attacker: "+attackName+"isWin: "+_Global.INT32(arr[2]));
	    reportShareItem.SetData(attackName,defName,isWin);
	    reportId = _Global.INT32(arr[3]);
	    serverId = _Global.INT32(arr[4]);
	    eventId  = _Global.INT32(arr[5]);
	
	}
	
	private function clickAvaShareReport():void
	{ 	var okFunc = function(result : HashObject)
	   {
	    if (_Global.GetBoolean(result["ok"]))
		{
			var obj: Hashtable = {};
			MenuMgr.getInstance().PushMenu("EmailMenu", obj, "trans_immediate");
			MenuMgr.getInstance().getMenuAndCall("EmailMenu", function (menu:EmailMenu) {
				var emailMenu: EmailMenu = menu as EmailMenu;
				var data = { "type": emailMenu.REPORT_TYPE, "index": 0, "isSys": false, "otherData": result, "senderID": senderId };
				emailMenu.getInstance().ClickShareReport(data);
			});

		//    MenuMgr.getInstance().getMenuAndCall("WatchTowerMenu", function(menu:Menu) { 
		// 	var watchTowerMenu:WatchTowerMenu = menu as WatchTowerMenu;
		// 	if ( watchTowerMenu != null )
		// 		watchTowerMenu.titleTab.SelectTab(1);
		// });
		// var data = {"type": EmailMenu.REPORT_TYPE, "index":0,"isSys":false,"otherData":result,"senderID":senderId};
		// EmailMenu.getInstance().ClickShareReport(data);	

		  
		}
	   };
	   
	    UnityNet.getAvaReportData(senderId,reportId,serverId,eventId,okFunc,null);
	}
}
