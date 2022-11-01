class SubEmailInbox extends BaseSubEmail
{
    @SerializeField
	private var inboxObject:InboxObj;
    @SerializeField
    private var btnClaim:Button;
    
    private var g_isSystemUser:boolean;
    
    private var prizeItems : MessageDAO.PrizeItems;
    public var subEmailBgBottom : Label;

    public var  transBtn:SimpleButton; //翻译按钮
	public var  transLabel:SimpleLabel; //翻译字段
    
    private class NetworkErrorCode
    {
        public static final var ClaimError_AlreadyClaimed : int = 4200;
        public static final var ClaimError_HasExpired : int = 4201;
    }

	public function Init()
	{	
		super.Init();
        InitClaimButton();
		inboxObject.Init();
		updateMailTip();
		transBtn.OnClick=TransMessgae;
	}
    
    private function InitClaimButton()
    {
        btnClaim.txt = Datas.getArString("EventCenter.ClaimBtn");
        btnClaim.changeToBlueNew();
        btnClaim.SetVisible(false);
        btnClaim.OnClick = OnClickClaim;
    }
	
    private function OnClickClaim(param : System.Object)
    {
        ReqClaimRewards();
    }
    
    private function ReqClaimRewards() : void
    {
        var paramDict : Hashtable = new Hashtable();
        paramDict.Add("messageId", g_messageId);
        paramDict.Add("isSysbox", g_isSystemUser ? "1" : "0");
        UnityNet.reqWWW("claimMessageRewards.php", paramDict, OnClaimRewardsSuccess, OnClaimRewardsFailure);
    }
    
    private function OnClaimRewardsSuccess(ho : HashObject) : void
    {
        for (var i : int = 0; i < prizeItems.items.Length; ++i)
        {
            MyItems.instance().AddItemWithCheckDropGear(prizeItems.items[i], prizeItems.itemsCount[i]);
        }
        
        SetRewardsClaimed();
        setInboxViewData();
    }
    
    private function OnClaimRewardsFailure(errMsg : String, errCode : String) : void
    {
        var newErrMsg : String = (errCode == UnityNet.NET_ERROR ? 
            Datas.getArString("Error.Network_error") : 
            UnityNet.localError(errCode, errMsg, ""));

        ErrorMgr.instance().PushError("", newErrMsg);
        
        if (errCode == NetworkErrorCode.ClaimError_AlreadyClaimed.ToString())
        {
            SetRewardsClaimed();
            setInboxViewData();
        }
    }
    
    private function SetRewardsClaimed()
    {
        prizeItems.claimed = true;
        Message.getInstance().ClaimPrize(_Global.INT32(g_messageId), g_isSystemUser);
    }
    
	public function DrawItem()
	{
		subEmailBgBottom.Draw();
		super.DrawItem();
		inboxObject.Draw();
        btnClaim.Draw();
        transBtn.Draw();
		transLabel.Draw();
	}
	
	public function OnPop()
	{
		super.OnPop();
		EmailMenu.getInstance().resetComponentsUnclicked();
	}
	
	function Update()
	{
		inboxObject.Update();
	
	}

	private var isHaveTrans:boolean=false; //是否已经翻译
	private var isTranIng=false;
	private var transBaseStr:String;
	//翻译语言
	private function TransMessgae(){
		if (!isTranIng) {
			isTranIng=true;	
			if (!isHaveTrans) {
			    transBaseStr=g_header["subject"].Value+"&&&"+inboxObject.GetBodyMessage();
				if (transBaseStr!=null&&transBaseStr!="") {
					//翻译语言
					KBN.GoogleTrans.instance().Trans(transBaseStr,TransAfer);
				}
			}else{
				if (transBaseStr!=null&&transBaseStr!="") {
					// message.txt=transBaseStr;
					var baseStrList:String[]=transBaseStr.Split("&&&"[0]);
					var count=baseStrList.Length;
					inboxObject.SetMessageSubject(baseStrList[0]);
					inboxObject.SetBodyMessgae(baseStrList[count-1]);
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
			// message.txt=tranInfo;
			var baseStrList:String[]=tranInfo.Split("&&&"[0]);
			var count=baseStrList.Length;
			inboxObject.SetMessageSubject(baseStrList[0]);
			inboxObject.SetBodyMessgae(baseStrList[count-1]);
			isHaveTrans=true;
			transLabel.txt=la;
		}
		isTranIng=false;
	}

	private function RestartTrans(){
		isHaveTrans=false;
        transBaseStr="";
        isTranIng=false;
        transLabel.txt=Datas.getArString("Chat.Translate_Text1");
	}
	private var transLan:String;
	private var isCanTrans:boolean = true;//策划修改翻译按钮一直显示

	private var isOutTime:Boolean = false;//联盟邀请超时
	protected function setInboxViewData() 
	{
		transLabel.txt=Datas.getArString("Chat.Translate_Text1");
		g_header = Message.getInstance().getMessageHeader(g_type, g_index);
		g_messageId = g_header["messageId"].Value;
		g_userId = _OtheruserId();
		g_isSystemUser = (_Global.INT32(g_header["isSys"]) == 1);
		_MessageType = _Global.INT32(g_header["messageType"]);
		var showSenderName : String = null;
		if ( _MessageType == Constant.MessageType.AllianceSys && g_header["allianceName"] != null && g_header["allianceName"].Value as String != null )
		{
			showSenderName = g_header["allianceName"].Value as String;
			var fmtString : String = Datas.getArString("Alliance.MessageSender");
			showSenderName = String.Format(fmtString, showSenderName);
		}
		else
		{
			showSenderName = g_header["displayName"].Value as String;
		}

        InitPrizeItemsByMailId(_Global.INT32(g_messageId), g_isSystemUser);
        
		var data = {
			"type":g_type,
			"name":showSenderName,
			"subject":g_header["subject"].Value,
			"messageId":g_header["messageId"].Value,
			"userId":g_userId,
			"date":g_header["unixTime"].Value,
			"isSystemUser":g_isSystemUser,
			"isSys":g_header["isSys"].Value,
			"messageType":g_header["messageType"],
            "prizeItems":prizeItems
        };
		inboxObject.setData(data);
		var outTime:Number = GameMain.instance().unixtime() - _Global.INT64( g_header["unixTime"].Value);
		//_Global.LogWarning("outTime:"+GameMain.instance().unixtime()+"endTime"+_Global.INT64( g_header["unixTime"].Value)+"_MessageType:"+_MessageType);
		isOutTime = _MessageType == Constant.MessageType.AllianceInvite && outTime > 259200;//联盟邀请大于3天
		//_Global.LogWarning("isOUtTime+"+isOutTime);
		UpdateButtonState();
        CheckClaimButtonVisibility();
        RestartTrans();
	
        // transLan=g_header["clientLang"]==null?"":_Global.GetString(g_header["clientLang"]);
        // var gameLanguage:int = PlayerPrefs.GetInt("language" ,LocaleUtil.defaultID);
		// var toLanguage:String=LocaleUtil.getInstance().getFileName(gameLanguage);
		//isCanTrans= (transLan!=""&&transLan!=toLanguage);
		transBtn.SetVisible(GameMain.singleton.IsTrans()&&isCanTrans&&!g_isSystemUser&&GameMain.singleton.getUserId()!=_OtheruserId());
		transLabel.SetVisible(GameMain.singleton.IsTrans()&&isCanTrans&&!g_isSystemUser&&GameMain.singleton.getUserId()!=_OtheruserId());
	}
    
    private function CheckClaimButtonVisibility()
    {
        var canClaim = (prizeItems != null && !prizeItems.claimed && !prizeItems.HasExpired);
        btnClaim.SetVisible(canClaim);
        
        if (btnFwd != null) btnFwd.SetVisible(!canClaim);
        if (btnReply != null) btnReply.SetVisible(!canClaim);
        if (btnDelete != null) btnDelete.SetVisible(!canClaim);
        if (btnBlock != null) btnBlock.SetVisible(!canClaim);
    }
	
    private function InitPrizeItemsByMailId(mailId : int, isSys : boolean) : void
    {
        prizeItems = null;
        prizeItems = Message.getInstance().GetPrizeInMail(mailId, isSys);
    }
    
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		setInboxViewData();
	}
	
	protected function nextEmail()
	{
		super.nextEmail();
		setInboxViewData();
	}
	
	protected function preEmail()
	{
		super.preEmail();
		setInboxViewData();
	}
	
	protected function handleDelete()
	{
		var type:String;
 		if(g_type == EmailMenu.REPORT_TYPE)
 		{
 			return;
 		}		
	
		var isSys:boolean = (_Global.INT32(g_header["isSys"]) == 1);

		if(g_type == EmailMenu.INBOX_TYPE||g_type == EmailMenu.INBOX_TYPE2)
		{
			Message.getInstance().DeleteMessageInbox(_Global.INT32(g_header["messageId"].Value),isSys,successDeleteFunc);
		}
		else
		{
			Message.getInstance().DeleteMessageOutbox(_Global.INT32(g_header["messageId"].Value),successDeleteFunc);
		}
	}
	
	private function successDeleteFunc()
	{	
		EmailMenu.getInstance().PopSubMenu();
		// EmailMenu.getInstance().changePageWhenDelMessage(1);
		EmailMenu.getInstance().successDeleteMesInboxNew();
		MenuMgr.getInstance().sendNotification("DeleteFuncAction",g_header);
	}
	
	protected function RealAccept():void
	{
		Alliance.getInstance().DoAccept(g_userId, _Global.INT32(g_header["fromAllianceId"]), function() {
			handleDelete();
		});
	}

	
	private function ShowAssign():void
	{
		MenuMgr.getInstance().PushMenu("AssignLeaderMenu",null);
	}
	
	protected function ComfirmAssignLeader()
	{
		var cd:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		cd.setLayout(600,540);
		cd.setTitleY(60);
		cd.setContentRect(70,140,0,260);
		cd.setButtonText(Datas.getArString("AllianceInfo.Resign"),Datas.getArString("Common.Cancel"));
		MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("AllianceInfo.ResignDescription"),Datas.getArString("AllianceInfo.LeaveAlliance"),ShowAssign,null);
	}
	
	protected function OnAccept():void
	{
		if(g_isSystemUser || g_userId == 0 || g_userId == Datas.instance().tvuid()) {
			return;
		}
		var FromAllianceId:int = _Global.INT32(g_header["fromAllianceId"]);
		if (FromAllianceId == 0 || Alliance.getInstance().MyAllianceId() == FromAllianceId) {
			handleDelete();
			return;
		}
		var el:int = Building.instance().getMaxLevelForType(Constant.Building.EMBASSY);
		if (el == 0) {
			ErrorMgr.instance().PushError("",Datas.getArString("Alliance.BuildAnEmbassy"));
			return;
		}
		if (Alliance.getInstance().IsChancellor()) {
			if (Alliance.getInstance().hasGetAllianceInfo) {
				var NeedAssign:boolean = Alliance.getInstance().myAlliance && Alliance.getInstance().myAlliance.membersCount > 1;
				if (NeedAssign) {
					ComfirmAssignLeader();
					return;
				}
			} else {
				Alliance.getInstance().reqAllianceInfo(OnAccept);
				return;
			}
		} 
		if (Alliance.getInstance().MyAllianceId() != 0) {
			var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
			dialog.setLayout(600,380);
			dialog.setTitleY(60);
			dialog.setContentRect(70,140,0,100);
			dialog.setButtonText(Datas.getArString("Common.Yes"),Datas.getArString("Common.No") );
			MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("Alliance.AlreadyInAlliance"), "", function() {
				MenuMgr.getInstance().PopMenu("");
				RealAccept();
			}, null);
		} else {
			RealAccept();
		}
	}
	
	protected function OnRefuse():void
	{
		if(g_isSystemUser || g_userId == 0 || g_userId == Datas.instance().tvuid()) {
			return;
		}
		var FromAllianceId:int = _Global.INT32(g_header["fromAllianceId"]);
		if (FromAllianceId == 0 || Alliance.getInstance().MyAllianceId() == FromAllianceId) {
			handleDelete();
			return;
		}
		Alliance.getInstance().DoRefuse(g_userId, _Global.INT32(g_header["fromAllianceId"]));
		handleDelete();
	}
	
	protected function handleReplyBtn()
	{
		if(g_isSystemUser)
		{
			ErrorMgr.instance().PushError("", Datas.getArString("MessagesModal.ActionNotAllowed"));
			return;
		}
		else
		{
			super.handleReplyBtn();
		}
	}	
	
	protected function handleBlock():void
	{
		if(g_isSystemUser)
		{
			ErrorMgr.instance().PushError("", Datas.getArString("MessagesModal.ActionNotAllowed"));
			return;
		}
		else
		{
			super.handleBlock();
		}
	}
	protected function GetDetailContent():String
	{
		return inboxObject.Content;
	}
	protected function Forward():void
	{
		var content:String = Datas.getArString("MessagesModal.ForwardedMessage") +  GetDetailContent();
		var fwd:String = Datas.getArString("MessagesModal.FWD") + ":";
		var data:Object = {"name":"","subject":fwd + g_header["subject"].Value,"messageBody":content};
		EmailMenu.getInstance().clickCompose(data);
	}
	
	private function _OtheruserId():int
	{
		var otherId:int = 0;
		if(g_type == EmailMenu.INBOX_TYPE)
 		{
 			if(g_header["fromUserId"])
			{
				otherId = _Global.INT32(g_header["fromUserId"].Value);
			}
 		}else if(g_type == EmailMenu.INBOX_TYPE2)
 		{
 			if(g_header["fromUserId"])
			{
				otherId = _Global.INT32(g_header["fromUserId"].Value);
			}
 		}
 		else if(g_type == EmailMenu.SENT_TYPE)
 		{
 			if(g_header["toUserId"])
			{
				g_userId = _Global.INT32(g_header["toUserId"].Value);
			}
 		}
 		else
 		{
 			otherId = 0;
 		}
 		return otherId;
	}

	protected function UpdateButtonState() : void
    {
		super.UpdateButtonState();
        UpdateReplyAndBlockButtonState();
        UpdateFwdButtonState();
	}
    
    private function UpdateReplyAndBlockButtonState() : void
    {
        if (_MessageType == Constant.MessageType.AllianceSys || g_isSystemUser || prizeItems != null)
        {
            btnReply.changeToGreyNew();
            btnBlock.changeToGreyNew();
        }
        else
        {
            btnReply.changeToBlueNew();
            btnBlock.changeToBlueNew();
		}
		
		 if(isOutTime)
		{
			btnAccept.changeToGreyNew();
			btnRefuse.changeToGreyNew();
		}
		// else
		// {
		// 	btnAccept.changeToBlueNew();
		// 	btnRefuse.changeToBlueNew();
		// }
    }
    
    private function UpdateFwdButtonState() : void
    {
        if (prizeItems != null)
        {
            btnFwd.changeToGreyNew();
        }
        else
        {
            btnFwd.changeToBlueNew();
        }
    }
	
	private function updateMailTip()
	{
		var okfunc = function (result : HashObject) {
            if (_Global.INT32(result["mailTips"]) == 1)
            {
                inboxObject.SetMailTip(Datas.getArString("Mail.Tips"));
            }
            else
            {
                inboxObject.SetMailTip("");
            }
		};
		
		var failfunc = function (msg : String, code : String) {
			inboxObject.SetMailTip("");
		};
		
		UnityNet.reqLoadingTips(okfunc, failfunc);
	}

}
