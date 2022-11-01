import System.Text;

public class NewShareMenu extends KBNMenu
{
	public var clone_menuHead : MenuHead;
	public var menuHead:MenuHead;
	public var l_rect:Label;
	public var l_title1:Label;
	public var l_title2:Label;
	
	public var btn_logInOut:Button;
	@SerializeField
    private var btn_help:Button;
    @SerializeField
    private var btn_fbPost:Button;

	public var btn_fbInvite:Button;
	public var btn_mail:Button;
	public var btn_sms:Button;
	
	private var displayName:String;
	private var connected:boolean;
	
	private var fb_login_sended:boolean = false;
    
    private var inviteCode : String;
    private var fbPostUrl : String;
    private var fbPostImageUrl : String;
    private var serverName : String;
    
    @SerializeField
    private var inviteCodeDescKey : String;
    @SerializeField
    private var facebookPostButtonKey : String;

    @SerializeField
    private var facebookPostTitleKey : String;
    @SerializeField
    private var facebookPostContentKey : String;
    @SerializeField
    private var facebookPostActionKey : String;

	public function Init()
	{
		menuHead = GameObject.Instantiate(clone_menuHead);
		menuHead.Init();
		menuHead.setTitle(Datas.getArString("Common.Share"));
		
		frameTop.rect = Rect( 0, 69, frameTop.rect.width, frameTop.rect.height);
		
		fb_login_sended = false;
		if(!background)
			this.background = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.DECORATION);
		
		// if(Application.platform == RuntimePlatform.IPhonePlayer)
		// {
			btn_fbInvite.changeToGreyNew();
			btn_logInOut.changeToGreyNew();
			btn_mail.changeToGreyNew();
			btn_sms.changeToGreyNew();
			btn_fbPost.changeToGreyNew();
		// }
					
		btn_logInOut.OnClick = btnHander;
		btn_fbInvite.OnClick = btnHander;
		btn_mail.OnClick = btnHander;
		btn_sms.OnClick = btnHander;
        btn_fbPost.OnClick = OnClickFacebookPost;
        
        btn_help.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_i", TextureType.DECORATION);
        btn_help.mystyle.hover.background = TextureMgr.instance().LoadTexture("icon_i", TextureType.DECORATION);
        btn_help.OnClick = OnClickHelp;
		
		btn_fbInvite.clickParam = "INVITE";
		btn_mail.clickParam = "MAIL";
		btn_sms.clickParam = "SMS";
		
		btn_fbInvite.txt = Datas.getArString("Share.Btn_Facebook");
		btn_mail.txt = Datas.getArString("Share.Btn_Mail");
		btn_sms.txt = Datas.getArString("Share.Btn_SMS");
        btn_fbPost.txt = Datas.getArString(facebookPostButtonKey);
		
		if(Application.platform == RuntimePlatform.Android && !NativeCaller.IsSMSServiceProvided())
			btn_sms.EnableBlueButton(false);
		
		l_title1.SetFont(FontSize.Font_20,FontType.TREBUC);
		l_title2.SetFont(FontSize.Font_20,FontType.TREBUC);
		
        inviteCode = "";
        fbPostUrl = "";
		l_title2.txt = Datas.getArString("Share.ShareTitle2");
	}
    
    private function get HasInviteCode() : boolean
    {
        return !String.IsNullOrEmpty(inviteCode);
    }
	
    public function handleNotification(type : String, body : Object)
    {
        switch (type)
        {
        case Constant.Notice.ShareLogOutOK:
            shareLogoutOk(body as String);
            break;
        case Constant.Notice.ShareLogInOK:
            shareLoginOk(body as String);
            break;
        case Constant.Notice.ShareLogInFailed:
            shareLoginFailed(body as String);
            break;
        case Constant.Notice.ShareSendOK:
            shareSendOk(body as String);
            break;
        case Constant.Notice.ShareSendInvite:
            shareSendInvite(body as String);
            break;
        case Constant.Notice.ShareSendFBPostOK:
            OnFacebookPostOK(body as String);
            break;
        case Constant.Notice.ShareSendFBPostFailed:
            OnFacebookPostFailed(body as String);
        default:
            break;
        }
    }
    
    private function OnFacebookPostOK(str : String) : void
    {
        _Global.Log("[NewShareMenu OnFacebookPostOK] returned string: " + str);
    }
    
    private function OnFacebookPostFailed(str : String) : void
    {
        _Global.Log("[NewShareMenu OnFacebookPostFailed] returned string: " + str);
    }
    
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		menuHead.setTitle(Datas.getArString("Common.Share"));
        if (String.IsNullOrEmpty(inviteCode))
        {
            ReqInviteCode();
        }
		showStatus(NativeCaller.IsShareLogin(Constant.ShareType.Share_FaceBook));
	}
    
    private function ReqInviteCode()
    {
        var url : String = "inviteCode.php";
        var paramDict : Hashtable = new Hashtable();
        paramDict.Add("op", "get_invite_code");
        UnityNet.reqWWW(url, paramDict, OnReqInviteCodeSuccess, OnReqInviteCodeFailure);
    }
    
    private function OnReqInviteCodeSuccess(ho : HashObject) : void
    {
        inviteCode = _Global.GetString(ho["invite_code"]);
        fbPostUrl = _Global.GetString(ho["callback_url"]);
        fbPostImageUrl = _Global.GetString(ho["image_url"]);
        serverName = _Global.GetString(ho["world_name"]);
        l_title2.txt = String.Format(Datas.getArString(inviteCodeDescKey), inviteCode);
        showStatus(NativeCaller.IsShareLogin(Constant.ShareType.Share_FaceBook));
    }
    
    private function OnReqInviteCodeFailure(errorMsg : String, errorCode : String)
    {
        l_title2.txt = Datas.getArString("Share.ShareTitle2");
        inviteCode = "";
        fbPostUrl = "";
        showStatus(NativeCaller.IsShareLogin(Constant.ShareType.Share_FaceBook));
    }

	public function shareSendOk(str:String):void
	{
		// Empty
	}
	
	public function shareLogoutOk(str:String):void
	{
		var type:int = _Global.INT32(str);
		switch(type)
		{
			case Constant.ShareType.Share_FaceBook:
				this.showStatus(false);
				break;
		}
	}
	public function shareLoginOk(str:String):void
	{
		var infoStr :String;
		_Global.Log("ming ShareLoginOk 0 withStr:" + infoStr);
		if(!MenuMgr.getInstance().hasMenuByName(this.menuName) )
			return;
		
		var idx:int = str.IndexOf(":"[0]);
		var type:int = _Global.INT32(str.Substring(0,idx));
		infoStr = str.Substring(idx + 1);
		
		var req:Hashtable = new Hashtable();
		var infoObj:HashObject;
		
		switch(type)
		{
			case Constant.ShareType.Share_FaceBook:
				this.showStatus(true);
				if(fb_login_sended)
					return;
				infoObj = (new JSONParse()).Parse(infoStr);
				
				req["type"] = "fb";
				req["action"] = "login";
				var keyList:Array = _Global.GetObjectKeys(infoObj);
				for(var key:String in keyList)
				{
					req[key] = Datas.getHashObjectValue(infoObj,key);
				}
				UnityNet.reqWWW("share.php",req,shareResult,null);
				break;
		}
	}
	public function shareLoginFailed(str:String):void
	{
		if(MenuMgr.getInstance().hasMenuByName("ShareMenu") )
		{
			ErrorMgr.instance().PushError("",Datas.getArString("Share.LoginFailed_Content"),true, Datas.getArString("Common.OK"),null );
		}
	}
	
	public function shareSendInvite(str:String):void
	{
		//type,id0,id1,id2...
		var list:Array = str.Split(","[0]);
		var type :int = _Global.INT32(list[0]);
		var ids:String = str.Substring(2);
		var invites:int = list.length - 1;
		var typeStr:String = null;
		_Global.Log("result:" + str);
		
		switch(type)
		{
			case Constant.ShareType.Share_EMail:
				typeStr = "email";
				break;
			case Constant.ShareType.Share_SMS:
				typeStr = "sms";
				break;
			case Constant.ShareType.Share_FaceBook:
				typeStr = "fb";
				break;
		}
		if(typeStr != null)
		{
			UnityNet.reqWWW("share.php",{"type":typeStr,"action":"invite","invites":invites,"inviteIds":ids},shareResult,null);
			//
			var shareCnt:int = Datas.instance().getShareCnt();
			Datas.instance().setShareCnt(shareCnt + invites);
			
			var sessions:int = Datas.instance().getSessionCnt();
			if(invites >= 3)
			{
				Datas.instance().setLast3ShareSessions(sessions);
				Datas.instance().setLast2ShareSessions(sessions);
				Datas.instance().setLastShareSessions(sessions);
			}
			else if(invites == 2)
			{
				Datas.instance().setLast3ShareSessions(Datas.instance().getLast2ShareSessions());
				Datas.instance().setLastShareSessions(sessions);
				Datas.instance().setLast2ShareSessions(sessions);
			}
			else if(invites == 1)
			{
				Datas.instance().setLast3ShareSessions(Datas.instance().getLast2ShareSessions());
				Datas.instance().setLast2ShareSessions(Datas.instance().getLastShareSessions());
				Datas.instance().setLastShareSessions(sessions);
			}
			
			var setting:HashObject = new HashObject({"lv1":{"sessionCount":3,"shareCount":9999999},"lv2":{"sessionCount":10,"shareCount":3},"lv3":{"sessionCount":25,"shareCount":3},"lv4":{"sessionCount":50,"shareCount":3}});
			if(Datas.instance().sharePopSetting() != null)
			{
				setting = Datas.instance().sharePopSetting();
			}
			var interval:int =  Datas.instance().getLastShareSessions() - Datas.instance().getLast3ShareSessions();
			var lvCount:int = _Global.GetObjectKeys(setting).length;
			if(lvCount > 0)
			{
				for(var lv:int = 2;lv <= lvCount;lv++)
				{
					var lvSession:int = _Global.INT32(setting["lv"+lv]["sessionCount"]);
					if(interval < lvSession)
					{
						Datas.instance().setPopupShareMenuInterval(lvSession);
						break;
					}
				}
			}
		}
	}
	
	private function shareResult(result:HashObject):void
	{
		var gems:int = 0;
		var itemKeys:Array;
		var itemKey:String;
		var itemId:int;
		var itemNum:int;
		
		fb_login_sended = true;	//only have fb
		
		if(result["gems"] != null)
			gems = _Global.INT32(result["gems"]);
		if(gems > 0)
		{
			Payment.instance().AddGems(gems);
			MenuMgr.getInstance().PushMessage(Datas.getArString("Share.Get_Gems"));
		}
		
		if(result["items"] != null)
			itemKeys = _Global.GetObjectKeys(result["items"]);
		
		var hasItems:boolean = false;
		for(itemKey in itemKeys)
		{
			//item_xxx:xxx
			itemId = _Global.INT32(itemKey.Substring(5));
			itemNum = _Global.INT32(result["items"][itemKey]);
			if(itemNum > 0)
			{
				hasItems = true;
				MyItems.instance().AddItem(itemId,itemNum);
			}
		}
		
		if(hasItems)
		{
			MenuMgr.getInstance().PushMessage(Datas.getArString("Share.Get_Gifts"));
		}
	}
	
	private function showStatus(connected:boolean):void
	{
		// this.connected = connected;
		// if(connected)
		// {
		// 	l_title1.txt = Datas.getArString("Share.Logged_Title");
		// 	btn_logInOut.txt = Datas.getArString("Share.Btn_Disconnect");
		// 	btn_logInOut.clickParam = "LOGOUT";
			
		// 	btn_fbInvite.changeToOrange();
		// 	btn_fbInvite.clickParam = "INVITE";
            
        //     if (HasInviteCode)
        //     {
        //         btn_fbPost.changeToOrange();
        //     }
        //     else
        //     {
        //         btn_fbPost.changeToGreyNew();
        //     }
		// }
		// else
		// {
		// 	l_title1.txt = Datas.getArString("Share.NoLogged_Title");
		// 	btn_logInOut.txt = Datas.getArString("Share.Btn_Connect");
		// 	btn_logInOut.clickParam = "LOGIN";
			
		// 	btn_fbInvite.changeToGreyNew();
		// 	btn_fbInvite.clickParam = "";
            
        //     btn_fbPost.changeToGreyNew();
		// }
		// if(Application.platform == RuntimePlatform.Android)
		// 	GameMain.instance().LockScreen("false");
	}
	
	private function btnHander(clickParam:Object):void
	{
		
		// switch(clickParam)
		// {
		// 	case "LOGIN":
		// 		NativeCaller.LoginShare(Constant.ShareType.Share_FaceBook);
		// 		break;
		// 	case "LOGOUT":
		// 		NativeCaller.LogoutShare(Constant.ShareType.Share_FaceBook);
		// 		this.showStatus(false);
		// 		break;
		// 	case "INVITE":
		// 		NativeCaller.SendShareStatus(Datas.getArString("Share.ShareContent"),Constant.ShareType.Share_FaceBook);
		// 		break;
		// 	case "MAIL":
		// 		NativeCaller.SendShareStatus(Datas.getArString("Share.ShareEmail"),Constant.ShareType.Share_EMail);
		// 		break;
		// 	case "SMS":
		// 		NativeCaller.SendShareStatus(Datas.getArString("Share.ShareSms"),Constant.ShareType.Share_SMS);
		// 		break;
        //     default:
        //         break;
		// }
	}
    
    private function OnClickFacebookPost(param : Object) : void
    {
        SendFacebookPost();
    }
    
    private function OnClickHelp(param : Object) : void
    {
        var setting : InGameHelpSetting = new InGameHelpSetting();
        setting.name = Datas.getArString("IngameHelp.FBInvite_Title");
        setting.type = "";
        setting.key = "FBInvite";

        MenuMgr.getInstance().PushMenu("InGameHelp", setting, "trans_horiz");
    }
    
    private function SendFacebookPost() : void
    {
        var paramJsonKey : String = "{{\"link\":\"{0}\",\"picture\":\"{1}\",\"name\":\"{2}\",\"description\":\"{3}\",\"caption\":\"{4}\"}}";

        var postLinkContent : String = String.Format(Datas.getArString(facebookPostContentKey),
            (serverName == null ? "" : serverName),
            inviteCode);
        var paramJson = String.Format(paramJsonKey,
            fbPostUrl,
            (fbPostImageUrl == null ? "" : fbPostImageUrl),
            Datas.getArString(facebookPostTitleKey),
            postLinkContent,
            Datas.getArString(facebookPostActionKey));

//        NativeCaller.SendFacebookPost(fbPostUrl,fbPostImageUrl,Datas.getArString(facebookPostTitleKey),postLinkContent,Datas.getArString(facebookPostActionKey));
    }
	
	public function DrawBackground()
	{
		menuHead.Draw();
		bgStartY = 70;
		DrawMiddleBg();	
		
		frameTop.Draw();		
	}
	
	public function DrawTitle()
	{
		
	}
	
	public function DrawItem()
	{
		l_rect.Draw();
		l_title1.Draw();
		l_title2.Draw();
		btn_logInOut.Draw();
		btn_fbInvite.Draw();
//        btn_fbPost.Draw();
		btn_mail.Draw();
		btn_sms.Draw();
        btn_help.Draw();
	}

}
