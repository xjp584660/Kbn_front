class InboxObj extends UIObject
{
	public var labelDate:Label;
	public var iconEnvelope:Label;
	
	public var userName:Button;
	public var messageToOrFrom:Label;
	public var messageSubject:Label;
	public var messageBody:Label;
	public var divideline1:Label;
	public var actionBtn:Button;
	public var linker:Linker;
	@SerializeField
	private var scrollView:ScrollView;
	public var messageComponent:ComposedUIObj;
	public var titleComponent:ComposedUIObj;
	
	public var mailTipBg : SimpleLabel;
	public var mailTipIcon : SimpleLabel;
	public var mailTip : SimpleLabel;
	
	private var g_name:String;
	private var g_type:int;
	private var g_subject:String;
	private var _MessageType:int;
	private var g_userId:int;
	private var seed:HashObject;
	private var isSystemUser:boolean;
	
	private var content:String = "";
    
    private var prizeItems : MessageDAO.PrizeItems;
    
    private final static var UnknownContent : String = "---";
    
    @SerializeField
    private var rewardsSplitLine : Label;
    @SerializeField
    private var rewardsStatusLabel : Label;
    @SerializeField
    private var rewardsHeaderLabel : Label;
    @SerializeField
    private var rewardsItemPairTemplate : NewSubItemPair;
    
    private var cachedTipMessage : String = "";
    
    private function AddRewardsToScrollView() : void
    {
        scrollView.clearUIObject();

        if (prizeItems == null)
        {
            return;
        }

        scrollView.addUIObject(rewardsSplitLine);
        
        if (prizeItems.claimed)
        {
            rewardsStatusLabel.txt = Datas.getArString("MessageReward.Claimed");
        }
        else if (prizeItems.HasExpired)
        {
            rewardsStatusLabel.txt = Datas.getArString("MessageReward.Expired");
        }
        
                
        var canClaim = !prizeItems.claimed && !prizeItems.HasExpired;
        
        if (!canClaim)
        {
			scrollView.addUIObject(rewardsStatusLabel);
		
        }else{
			rewardsHeaderLabel.txt = Datas.getArString("MessageReward.RewardTitle");
			scrollView.addUIObject(rewardsHeaderLabel);
		}
     
        
        for (var i : int = 0; i < prizeItems.items.Length; i = i + 2)
        {
            var itemPair : NewSubItemPair = Instantiate(rewardsItemPairTemplate) as NewSubItemPair;
            var left : InventoryInfo = new InventoryInfo();
            left.id = prizeItems.items[i];
            left.quant = prizeItems.itemsCount[i];
            
            var right : InventoryInfo = null;
            if (i + 1 < prizeItems.items.Length)
            {
                right = new InventoryInfo();
                right.id = prizeItems.items[i + 1];
                right.quant = prizeItems.itemsCount[i + 1];
            }

            itemPair.SetData(
                {"InventoryInfo": left, "ShouldCover": !canClaim}, 
                right == null ? null : {"InventoryInfo": right, "ShouldCover": !canClaim}
            );
            scrollView.addUIObject(itemPair);

        }
    }
	
	public function Init()
	{
		divideline1.Init();
		labelDate.Init();
		iconEnvelope.Init();
		userName.Init();
		scrollView.Init();
		
		messageToOrFrom.Init();
		messageSubject.Init();
		messageBody.Init();
		messageBody.maxChar = 2000;
		content = "";
		
		iconEnvelope.setBackground("fuction_icon_Mail2_big", TextureType.DECORATION);
		mailTipIcon.setBackground("quest_point", TextureType.DECORATION);
		mailTipBg.setBackground("square_black2", TextureType.DECORATION);
        
        divideline1.setBackground("mail_Split-line", TextureType.DECORATION);
        rewardsSplitLine.setBackground("mail_Split-line", TextureType.DECORATION);
		
		SetMailTip("");
	}
	
	public function Draw() : int
	{
		GUI.BeginGroup(rect);
		scrollView.Draw();
        DrawMailTip();			
		GUI.EndGroup();
        
        return -1;
	}
    
    private function DrawMailTip()
    {
        if (prizeItems != null)
        {
            return;
        }
        
        mailTipBg.Draw();
        mailTipIcon.Draw();
        mailTip.Draw();
    }
	
	function Update()
	{
		scrollView.Update();
	}
	
	private function handleProfile()
	{
		if(isSystemUser)
		{
			return;
		}
		
		Alliance.getInstance().reqGetUserGeneralInfo(g_userId ,successGetUserInfor);
	}
	
	private function successGetUserInfor(_data:GeneralUserInfoVO)
	{
		var detailInfo:TileInfoPopUp.DetailInfo = parseDataToDetailInfo(_data.rawData);
		var userinfo = new UserDetailInfo();
		userinfo.userId = _Global.ToString(_data.rawData["userId"]);
		userinfo.userName = detailInfo.userName;
		userinfo.userLevel = detailInfo.userLevel;
		userinfo.avatar = detailInfo.avatar;
		userinfo.avatarFrame = detailInfo.avatarFrame;
		userinfo.badge = detailInfo.badge;
		userinfo.might = detailInfo.might;
		userinfo.allianceName = detailInfo.allianceName;
		userinfo.allianceDip = detailInfo.allianceDip;
		userinfo.desc = detailInfo.desc;
		userinfo.allianceEmblem = _data.allianceEmblem;

		userinfo.allianceId = _Global.ToString(_data.rawData["allianceId"]);
 		userinfo.viewFrom = UserDetailInfo.ViewFromMail;
		MenuMgr.getInstance().PushMenu("PlayerProfile", userinfo, "trans_zoomComp");
	}
	
	private function parseDataToDetailInfo(_data:HashObject):TileInfoPopUp.DetailInfo
	{
		var detailInfo:TileInfoPopUp.DetailInfo = new TileInfoPopUp.DetailInfo();
		var user:HashObject = _data;
		
		detailInfo.tileUserId = user["userId"].Value;
		
		if(null != user["name"])
		{
			detailInfo.userName = user["name"].Value;
		}
		else
		{
			detailInfo.userName = UnknownContent;
		}
		
		if(null != user["might"])
		{
			detailInfo.might = user["might"].Value + "";
		}
		else
		{
			detailInfo.might = UnknownContent;
		}
		
		if(null != user["title"])
		{
			detailInfo.userLevel = user["title"].Value + "";
		}
		else
		{
			detailInfo.userLevel = UnknownContent;
		}
	
		if(null != user["allianceId"] && _Global.INT32(user["allianceId"]))
		{
			detailInfo.allianceName = user["allianceName"].Value;
			detailInfo.allianceDip = allianceDiplomacy(_Global.INT32(user["allianceId"]));
		}
		else
		{
			detailInfo.allianceName = UnknownContent;
			detailInfo.allianceDip = UnknownContent;
		}
		
		if(null != user["portraitname"])
		{
			detailInfo.avatar = user["portraitname"].Value;
		}
		else
		{
			detailInfo.avatar = "1001";
		}
		
		if(null != user["badge"])
		{
			detailInfo.badge = user["badge"].Value;
		}

		return detailInfo;
	}
	
	private function allianceDiplomacy(allianceId:int):String
	{
		var returnStr:String = Datas.getArString("Alliance.relationNeutral");
		var i:int;
		if(allianceId && seed["allianceDiplomacies"] && seed["allianceDiplomacies"]["allianceId"]) 
		{
		
			if (allianceId == _Global.INT32(seed["allianceDiplomacies"]["allianceId"])) 
			{
				returnStr = Datas.getArString("Alliance.relationFriendly");
			}
			else 
			{
				var alliances:Array = _Global.GetObjectValues(seed["allianceDiplomacies"]["friendly"]);
				for(i = 0; i<alliances.length; i++)
				{
					if(allianceId == _Global.INT32((alliances[i] as HashObject)["allianceId"]))
					{
						returnStr = Datas.getArString("Alliance.relationFriendly");
						break;
					}
				}
				
				alliances = _Global.GetObjectValues(seed["allianceDiplomacies"]["hostile"]);
				for(i = 0; i<alliances.length; i++)
				{
					if(allianceId == _Global.INT32((alliances[i] as HashObject)["allianceId"]))
					{
						returnStr = Datas.getArString("Alliance.relationHostile");
						break;
					}
				}
				
				alliances = _Global.GetObjectValues(seed["allianceDiplomacies"]["friendlyToThem"]);
				for(i = 0; i<alliances.length; i++)
				{
					if(allianceId == _Global.INT32((alliances[i] as HashObject)["allianceId"]))
					{
						returnStr = Datas.getArString("Alliance.statusPending");
						break;
					}
				}
				
				alliances = _Global.GetObjectValues(seed["allianceDiplomacies"]["friendlyToYou"]);
				for(i = 0; i<alliances.length; i++)
				{
					if(allianceId == _Global.INT32((alliances[i] as HashObject)["allianceId"]))
					{
						returnStr = Datas.getArString("Alliance.statusPending");
						break;
					}
				}
			}
		}	
		
		return returnStr;
	}

	//****		
	//**_data
	//**	type
	//**	name
	//**	subject
	//**	message
	//****
	
	public function setData(_data:Object)
	{
		var boxType:String;
		messageComponent.clearUIObject();
		
//		arString = Datas.instance().arStrings();
		seed = GameMain.instance().getSeed();
		var m_data:Hashtable =  _data as Hashtable;
		g_type = _Global.INT32(m_data["type"]);
		g_name = m_data["name"];
	 	g_subject = m_data["subject"];
	 		 	
	 	_MessageType = _Global.INT32(m_data["messageType"]);

		if (_MessageType == Constant.MessageType.AllianceInvite) {
	 		iconEnvelope.mystyle.normal.background = TextureMgr.instance().LoadTexture("Invitations_icon", TextureType.DECORATION);
		 	actionBtn.txt = Datas.getArString("Alliance.InviteSettings");
	 	} else {
	 		iconEnvelope.mystyle.normal.background = TextureMgr.instance().LoadTexture("fuction_icon_Mail2_big", TextureType.DECORATION);
		 	actionBtn.txt = Datas.getArString("Common.ClickToAction");
	 	}
	 	
	 	if(m_data["userId"])
	 	{
	 		g_userId = _Global.INT32(m_data["userId"]);
	 	}
	 	else
	    {
	       g_userId = 0;
	    }
	    isSystemUser = (m_data["isSystemUser"] || g_userId == 0);				
		
		if(g_type == EmailMenu.INBOX_TYPE)
		{
			messageToOrFrom.txt = Datas.getArString("Common.From") + ":  ";
			boxType = MessageCacheType.inbox.ToString();
		}else if (g_type == EmailMenu.INBOX_TYPE2) {
			messageToOrFrom.txt = Datas.getArString("Common.From") + ":  ";
			boxType = MessageCacheType.sysInbox.ToString();
		}
		else
		{
			messageToOrFrom.txt = Datas.getArString("Common.To") + ":  ";
			boxType = MessageCacheType.outbox.ToString();
		}

		labelDate.txt = _Global.DateTime(_Global.INT64(m_data["date"]));
		
		messageSubject.txt = g_subject;	
		messageBody.txt = "";
		
        InitUserName();
        
        prizeItems = m_data["prizeItems"];
        
		var msgID = _Global.INT32(m_data["messageId"]);

		scrollView.MoveToTop();
		
		Message.getInstance().view(boxType, msgID, function(paramData : HashObject)
		{
			resultFunc(boxType, paramData);
		},m_data["isSys"]);
	}

	public function SetMessageSubject(subject:String){
		messageSubject.txt=subject;
	}
    
    private function InitUserName() : void
    {
        userName.txt = g_name;
        if (isSystemUser)
        {
            userName.SetNormalTxtColor(FontColor.TabNormal);
            userName.SetDisabled(true);
        }
        else
        {
            userName.SetNormalTxtColor(FontColor.Blue);
            userName.SetDisabled(false);
        }
        userName.OnClick = handleProfile;
    }
    
    public function SetMailTip(message : String)
    {
        cachedTipMessage = message;
    }
	
	private function priv_isNeedShowActionBtn(boxType : String, mailDat : HashObject)
	{
		if ( _Global.INT32(mailDat["isInvitation"]) )
			return true;

		if ( _MessageType == Constant.MessageType.AllianceRequestJoin )
			return true;

		if ( _MessageType == Constant.MessageType.AllianceInvite )
			return true;

		if ( _MessageType != Constant.MessageType.AllianceChangePosition )
			return false;

		if ( boxType != MessageCacheType.inbox.ToString()&&boxType != MessageCacheType.sysInbox.ToString() )
			return false;

		if ( Alliance.getInstance().MyOfficerType() <= 0)
			return false;

		return true;
	}

	public function GetBodyMessage():String{
		return messageBody.txt;
	}
	public function SetBodyMessgae(bodyM:String){
		messageBody.txt=bodyM;
	}

	private function resultFunc(boxType : String, _data:HashObject)
	{
		messageBody.SetFont();
		messageBody.txt = _data["messageBody"].Value;
		content = _data["messageBody"].Value;
		var _height:int = messageBody.mystyle.CalcHeight(GUIContent(_data["messageBody"].Value as String), messageBody.rect.width);
		messageBody.rect.height = _height;
		messageComponent.addUIObject(messageBody);
		messageComponent.rect.height = _height;

		if ( priv_isNeedShowActionBtn(boxType, _data) )
		{
			var _size:Vector2 = actionBtn.mystyle.CalcSize(GUIContent(actionBtn.txt));
			actionBtn.rect = Rect(messageBody.rect.x, messageBody.rect.y + _height, _size.x + 30, _size.y + 50);
			messageComponent.addUIObject(actionBtn);
			messageComponent.rect.height = actionBtn.rect.y + actionBtn.rect.height;
			
			actionBtn.OnClick = handleClickAction;
		}
		else
		{
			if( _data["destination"] && _data["destination"].Value != "" )
			{
				LinkUI(_data["destination"].Value, _data["displayTxt"].Value);
				linker.rect = Rect(messageBody.rect.x, messageBody.rect.y + _height + 30, linker.rect.width, linker.rect.height);
				messageComponent.addUIObject(linker);
				messageComponent.rect.height = linker.rect.y + linker.rect.height;
			}
		}
		
        AddRewardsToScrollView();
        UpdateMailTip();
		scrollView.AutoLayout();
	}
    
    private function UpdateMailTip()
    {   
        SetMailTipVisible(!String.IsNullOrEmpty(cachedTipMessage) && prizeItems == null);
    }
    
    private function SetMailTipVisible(visible : boolean)
    {
        mailTipBg.SetVisible(visible);
        mailTipIcon.SetVisible(visible);
        mailTip.SetVisible(visible);
        
        if (visible) {
            mailTip.txt = cachedTipMessage;
            scrollView.rect.height = 701 - mailTipBg.rect.height;
        } else {
            scrollView.rect.height = 701;
        }
    }
    

	private var urlPrefix:String = "url:";	
			
	private function LinkUI(destination:String, displayTxt:String):void
	{
		if(destination.StartsWith(urlPrefix))
		{
			destination = destination.Substring(urlPrefix.Length);
			linker.setUrlLinker(displayTxt, destination);
		}
		else
		{
			linker.setInnerLinker(displayTxt, destination);
		}
	}
		
	private function OpenPlayerSetting():void
	{
        MenuAccessor.OpenPlayerSetting(null);
	}

	private function handleClickAction()
	{
		if (_MessageType == Constant.MessageType.AllianceInvite)
		{
			var para:Object = {"barIndex":Constant.UserSetting.BLOCK_USER};
			MenuMgr.getInstance().PushMenu("UserSettingMenu", para);
			return;
		}

		MenuMgr.getInstance().MainChrom.openAlliance(null);
	}
	
	public function get Content()
	{
		return content;
	}
}
