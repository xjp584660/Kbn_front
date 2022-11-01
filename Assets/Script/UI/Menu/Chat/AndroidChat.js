

public class AndroidChat
{	
	static var mBackendHeight:int = 0;
	
	public var  allianceRequestPop:Function;
	public var  sendChat:Function;
	public var 	SetChatHistoryHeight:Function;

	public var  CanShowPlus:Function;
	public var  GetViewY:Function;
	public var  GetViewHeight:Function;
	public var  TargetMenu : KBNMenu;
	public var  CanShowBar:Function;
	
	public var  TempString:String;
	public var  OnBackKey:Function;
	public function OnInit()
	{
		if(RuntimePlatform.Android != Application.platform) return;
		
		
	}
	
	private function CallMethod(obj:Object, method:String, p:Object[])
	{
		
	}

	public function handleAndroid(type:String,message:Object)
	{
		if(RuntimePlatform.Android != Application.platform) return;
		if(type == "send") AndroidSend(message.ToString());
		else if(type == "position") AndroidMoveTo(_Global.INT32(message));
		else if(type == "show") AndroidMoveDefault();
		else if(type == "hide") AndroidMoveBottom();
		else if(type == "resume") AndroidResume();
		else if(type == "backpress") AndroidBackPressed();
		else if(type == "plusclicked") OnPlusClicked();
	}
	
	static function SetBackendHeight(h:int)
	{
		if(RuntimePlatform.Android != Application.platform) return;
		mBackendHeight = h; 
		
	}
	private function OnPlusClicked()
	{
		if(RuntimePlatform.Android != Application.platform) return;
		
	
		if(allianceRequestPop != null)
			allianceRequestPop();
	}
	
	private function AndroidSend(message:String)
	{
		
		if(RuntimePlatform.Android != Application.platform) return;
		if(message == null) return;
		
		if(sendChat != null)
				sendChat(message);
	}
	private function AndroidMoveDefault()
	{
		
		if(RuntimePlatform.Android != Application.platform) return;
		if(mBackendHeight > 0)
		{
			if(SetChatHistoryHeight != null)
				SetChatHistoryHeight(CalculateViewHeight(mBackendHeight));			
		}
		else
		{
			if(SetChatHistoryHeight != null) 
				SetChatHistoryHeight(180); 
		}
	
	}
	
	private function AndroidMoveTo(height:int)
	{  
		if(RuntimePlatform.Android != Application.platform) return;
		if(height <= 10) return;
		
		if(SetChatHistoryHeight != null)
			SetChatHistoryHeight(CalculateViewHeight(height));
	} 
	
	
	private function CalculateViewHeight(rawHeight:int):int
	{
		if(RuntimePlatform.Android != Application.platform) return;
		var h:int = rawHeight * 960 / Screen.height;
		if(GetViewY != null)
			return h - _Global.INT32(GetViewY());
		else 
			return 180;
	}
	
	private function AndroidMoveBottom()
	{
		
		if(SetChatHistoryHeight != null)
			if(GetViewHeight != null)
				SetChatHistoryHeight(_Global.INT32(GetViewHeight()));
	}
	private function AndroidResume()
	{ 
		if(RuntimePlatform.Android != Application.platform) return;	
		if(CanShowBar != null)
		{
			var topMenu : KBNMenu = MenuMgr.getInstance().Top();
			if(topMenu && CanShowBar(topMenu.menuName))
				Open();
		}
	}
	private function AndroidBackPressed()
	{
		if(RuntimePlatform.Android != Application.platform) return;
		GameMain.instance().OnBackButtonClicked("");
		CloseChatBar();
		if(OnBackKey != null)
			OnBackKey();
	}
	
	public function Open()
	{
		
		ShowChatBar(false);
			if(CanShowPlus != null)
				AndroidKeyboard.Instance().ShowPlus(CanShowPlus());
	}
	public function handleNotification(type:String, body:Object)
	{
		
		if(RuntimePlatform.Android != Application.platform) return;
		if(type == Constant.Notice.TOP_MENU_CHANGE)
		{
			var array:Array = body as Array;
			if(array == null) return;
			
			var oldMenuName:String = array[0];
			var newMenuName:String = array[1];
			
			ShowChatBar(newMenuName);
		}
		else if(type == Constant.Notice.TOAST_START)
		{
			this.CloseChatBar();
		}
		else if(type == Constant.Notice.TOAST_FINISH)
		{
			var topMenu : KBNMenu = MenuMgr.getInstance().Top() as KBNMenu;
			if( topMenu != null ){
				ShowChatBar(topMenu.menuName);
			}
		}
	}
	public function ShowChatBar(top:String)
	{
		
		if(CanShowBar == null) return;
		
		if(CanShowBar(top))
			this.Open();
		else 
			this.CloseChatBar();
		
	}

	public function OnIndexChanged()
	{
		
		if(RuntimePlatform.Android != Application.platform) return;
		
		var topMenu : KBNMenu = MenuMgr.getInstance().Top() as KBNMenu;
		
		if( topMenu != null )
			ShowChatBar(topMenu.menuName);
		if(CanShowPlus != null)
			AndroidKeyboard.Instance().ShowPlus(CanShowPlus());
		AndroidMoveBottom();
	}
	
	public function ShowChatBar(show:boolean)
	{
		
		if(RuntimePlatform.Android != Application.platform) return;
		AndroidKeyboard.Instance().Initialize(this);
		AndroidKeyboard.Instance().ShowChatBar(show);
		AndroidKeyboard.Instance().SetSendButtonText(Datas.getArString("Common.Send_button"));
		AndroidKeyboard.Instance().SetMaxChars(Constant.ChatMaxLength);
		AndroidKeyboard.Instance().SetHint(Datas.getArString("Common.MaxCharacters"));
	}
	public function CloseChatBar()
	{
		
		if(RuntimePlatform.Android != Application.platform) return;	
		AndroidKeyboard.Instance().CloseChatBar();
	
	}
	
	public function SetText(text:String)
	{
		AndroidKeyboard.Instance().SetText(text);
	}
	
	public function GetText():String
	{
		return AndroidKeyboard.Instance().GetText();
	}
	
	public function ShowKeyboard(willShow:boolean)
	{
		
		AndroidKeyboard.Instance().ShowKeyboard(willShow);
	}
}
