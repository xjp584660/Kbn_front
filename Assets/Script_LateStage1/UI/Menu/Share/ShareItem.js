public class ShareItem extends ListItem
{
	
	public var btn_logout	:Button;
	public var btn_share	:Button;
	public var btn_login	:Button;
	
	public var l_title		:Label;
	public var l_content	:Label;
	public var l_img		:Label;
	
	public var l_bg			:Label;
	
	protected var share_type	:int;	
	protected var loginName		:String = null;
	
	private static var ICONS:Array = ["","share_tt","share_fb","share_e","share_sms" ];
		
	public static var msg4Send:String =null;
	
	public function Init(type:int, loginName:String):void
	{
		this.loginName = loginName;
		PlayerPrefs.SetString("Share_LoginName_" + type,loginName);
		Init(type);		
	}
	public function Init(type:int):void
	{
		var login:boolean;		
		login = NativeCaller.IsShareLogin(type);		

		if(login)
			loginName = NativeCaller.GetShareLoginName(type);		

		if(loginName == null)
		{
			loginName = PlayerPrefs.GetString("Share_LoginName_" + type, "");
		}
		
		l_title.SetFont(FontSize.Font_20,FontType.TREBUC);	
		l_title.txt = Datas.getArString("Share.Share_Title_" + type);
		
		l_img.useTile = true;
		l_img.tile = TextureMgr.instance().ElseIconSpt().GetTile(ICONS[type]);
		//l_img.tile.name  = ICONS[type];
		
		//Resources.Load("Textures/UI/icon/" + ICONS[type]);
		setStatus(login,type);
		
		btn_login.clickParam = "LOGIN";
		btn_share.clickParam = "SHARE";
		btn_logout.clickParam = "LOGOUT";		
		btn_login.OnClick = buttonHandler;
		btn_share.OnClick = buttonHandler;
		btn_logout.OnClick = buttonHandler;
	}
	
	public function setStatus(login:boolean,type:int):void
	{
		this.share_type = type;
		switch(type)
		{
			case Constant.ShareType.Share_Twitter:
			case Constant.ShareType.Share_FaceBook:
					btn_logout.txt = Datas.getArString("Common.Logout");
					btn_login.txt = Datas.getArString("Common.Login");
					btn_share.txt = Datas.getArString("Common.Share");
					
					btn_logout.SetVisible(login);
					btn_share.SetVisible(login);
					btn_login.SetVisible(!login);
					
					if(login)
						l_content.txt = Datas.getArString("Share.LoginAs",[loginName]);
					else
						l_content.txt = Datas.getArString("Share.Share_Content_" + type);
					
				break;
			case Constant.ShareType.Share_EMail:
			case Constant.ShareType.Share_SMS:
					btn_logout.SetVisible(false);
					btn_share.SetVisible(true);
					btn_login.SetVisible(false);
					
				l_content.txt = Datas.getArString("Share.Share_Content_" + type);	
				btn_share.txt = Datas.getArString("Common.Share");
				break;
		}
	}
	
	public function buttonHandler(clickParam:Object):void
	{
		switch(clickParam)
		{
			case "LOGIN":	//auto login and Share.					
			case "SHARE":
				if( !msg4Send )
					msg4Send = Datas.getArString("Share.Default_Msg");
//				_Global.Log("Msg4Send:" + msg4Send);	
				NativeCaller.SendShareStatus(msg4Send,this.share_type);
				break;		
			case "LOGOUT":
				NativeCaller.LogoutShare(this.share_type);
				this.setStatus(false,share_type);
				break;
			
		}
	}
	
	public function SetRowData(data:Object):void
	{
		var type:int = (data as Hashtable)["type"];
		var loginName :String = (data as Hashtable)["loginName"];
		
		if(loginName)
			this.Init(type,loginName);
		else
			this.Init(type);
	}	
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		
		l_bg.Draw();
		l_title.Draw();
		l_content.Draw();
		l_img.Draw();
		
		
		btn_logout.Draw();
		btn_login.Draw();
		btn_share.Draw();
		
		GUI.EndGroup();
	}
}
