class PlayerSetting extends ComposedMenu
{
	public var scroll:ScrollView;
	public var backLabel:Label;
	public var backLabel2:Label;
	public var frameLabel:SimpleLabel;
	public var line:Label;
	public var raterBtn:Button;
	public var raterLabel:StarRating;
	public var kabamId:SettingItem;
	public var language:SettingItem;
	public var notification:SettingItem;
	public var help:SettingItem;
	public var about:SettingItem;
	public var sound:SettingItem;
	public var games:SettingItem; // abandoned
	public var aboutMenu:About;
	public var gameCenterId:SettingItem;
    public var redeemInviteCode:SettingItem;
    //public var map:SettingItem;s

	public var kabamIdMenu:KabamId;
	public var gameCenterIdMenu:GameCenterId;
	public var creatKabamIdMenu:CreatKabamId;
	public var settingContent:ComposedUIObj;
	public var login:KabamLogin;
	public var helpMenu:HelpMenu;
	public var loginState:LoginState;
	public var soundMenu : SoundSubMenu;
	//public var mapMenu : MapSubMenu;
	public var pushMenu:PushSubMenu;
	public var gamesMenu:MoreKabamGamesSubMenu;
    public var redeemInviteCodeMenu:RedeemInviteCodeSubMenu;
	public var chooseLanguage:ChooseLanguage;
	private var backRect:Rect;
	public var animClipRect:Rect;
	
	public var CloseCallback:System.Action = null;
    
    private enum RedeemInviteCodeStatus
    {
        Unknown,
        EntranceVisible,
        EntranceInvisible
    }
    
    private var redeemInviteCodeStatus : RedeemInviteCodeStatus = RedeemInviteCodeStatus.Unknown;
            	
	function Init()
	{
		super.Init();
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		
		kabamId.Init();
		language.Init();
		notification.Init();
		help.Init();
		about.Init();
		sound.Init();
		//map.Init();
//		games.Init();
        redeemInviteCode.Init();
		gameCenterId.Init();		
		
		var borderX:int = 8;
		var borderY:int = 11;
		btnClose.rect = Rect(rect.width - 100 - borderX, 0, 100 + borderX, 100 + borderY);
		btnClose.mystyle.overflow.left = btnClose.mystyle.normal.background.width - 100;
		btnClose.mystyle.overflow.bottom = btnClose.mystyle.normal.background.height  - 100;
		btnClose.mystyle.overflow.top =  -borderY;
		btnClose.mystyle.overflow.right =  - borderX;
		
		line.setBackground("between line", TextureType.DECORATION);
		
		hasOpenedGamble = false;
		
		frameLabel.Sys_Constructor();
		frameLabel.mystyle.border = new RectOffset(68, 68, 68, 68);
		frameLabel.rect = new Rect(0, 0, rect.width + 2, rect.height);
		frameLabel.useTile = true;
		frameLabel.tile = iconSpt.GetTile("popup1_transparent");
		btnClose.OnClick = CloseMenu;

		var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
//		repeatTimes = (rect.height - 15)/bgMiddleBodyPic.rect.height +1;
		backRect = Rect( 5, 5, rect.width, rect.height - 10);
		
		if (animClipRect.width <= 0 || animClipRect.height <= 0)
		{
			animClipRect = Rect(10, 0, rect.width, rect.height);
		}
		title.txt = Datas.getArString("Common.Settings_Title");
		
		kabamId.title.SetFont(FontSize.Font_20,FontType.TREBUC);
		gameCenterId.title.SetFont(FontSize.Font_20,FontType.TREBUC);
		language.title.SetFont(FontSize.Font_20,FontType.TREBUC);
		notification.title.SetFont(FontSize.Font_20,FontType.TREBUC);
		about.title.SetFont(FontSize.Font_20,FontType.TREBUC);
		sound.title.SetFont(FontSize.Font_20,FontType.TREBUC);
		//map.title.SetFont(FontSize.Font_20,FontType.TREBUC);
//		games.title.SetFont(FontSize.Font_20,FontType.TREBUC);
        redeemInviteCode.title.SetFont(FontSize.Font_20,FontType.TREBUC);
		
		kabamId.title.txt = Datas.getArString("Settings.KabamID");
		
		if (Datas.GetPlatform() == Datas.AppStore.ITunes)
			gameCenterId.title.txt = Datas.getArString("Common.GameCenterID");
		else if ( Datas.GetPlatform() == Datas.AppStore.Amazon)
	    {
      		gameCenterId.SetVisible(false);
//      		games.SetVisible(false);
	    }
		else
			gameCenterId.title.txt = Datas.getArString("Common.GameCenterID_android");
		
		language.title.txt = Datas.getArString("Settings.Language");
		notification.title.txt = Datas.getArString("Settings.Notification");
		about.title.txt = Datas.getArString("Settings.About");
		sound.title.txt = Datas.getArString("Settings.GeneralSetting");
		//map.title.txt = Datas.getArString("Settings.Map");
//		games.title.txt = Datas.getArString("Settings.MoreKabamGames");
        redeemInviteCode.title.txt = Datas.getArString("Settings.RedeemInviteCode");
		
		m_color = new Color(1,1,1,1);
        redeemInviteCode.SetVisible(false);
		about.Init();
		kabamId.Init();
		gameCenterId.Init();
		sound.Init();
		//map.Init();
		language.Init();
		about.Init();
		notification.Init();
		scroll.Init();
//		games.Init();
        redeemInviteCode.Init();
        
		kabamId.SetClickFunc( OpenKabamId);
		gameCenterId.SetClickFunc(OpenGameCenterId);
		language.SetClickFunc( OpenLanguage );
		about.SetClickFunc( OpenAbout );
		sound.SetClickFunc(OpenSound);
		//map.SetClickFunc(OpenMap);
		notification.SetClickFunc(OpenPush);
//		games.SetClickFunc(OpenGames);
        redeemInviteCode.SetClickFunc(OpenRedeemInviteCode);
		settingContent.component = [title, line, backLabel2, scroll];
		
		tabArray = [settingContent];
		
		aboutMenu.Init(this);
		kabamIdMenu.Init(this);
		gameCenterIdMenu.Init(this);
		creatKabamIdMenu.Init(this);
		login.Init(this);
		helpMenu.Init(this);
		loginState.Init(this);
		soundMenu.Init(this);
		//mapMenu.Init(this);
		pushMenu.Init(this);
		chooseLanguage.Init(this);	
		gamesMenu.Init(this);
        redeemInviteCodeMenu.Init(this);
        
        if (redeemInviteCodeStatus == RedeemInviteCodeStatus.Unknown)
        {
            ReqCheckRedeemEntrance();
        }
        
        GameMain.instance().resgisterRestartFunc(function() {
            if (this == null)
            {
                return;
            }
            
            redeemInviteCodeStatus = RedeemInviteCodeStatus.Unknown;
        });
        
        PopulateScrollView();
	}
    
    private function PopulateScrollView() : void
    {
        scroll.clearUIObject();
        //scroll.UnshiftUIObject(map);
        scroll.UnshiftUIObject(redeemInviteCode);
//        scroll.UnshiftUIObject(games);		
        scroll.UnshiftUIObject(language);
        scroll.UnshiftUIObject(notification);
        scroll.UnshiftUIObject(about);
        scroll.UnshiftUIObject(sound);
        scroll.UnshiftUIObject(gameCenterId);
        scroll.UnshiftUIObject(kabamId);        
    }
    
    private function ReqCheckRedeemEntrance() : void
    {
        var url : String = "inviteCode.php";
        var paramDict : Hashtable = new Hashtable();
        paramDict.Add("op", "check_redeem_entrance");
        UnityNet.reqWWW(url, paramDict, OnCheckRedeemEntranceSuccess, null);
    }
    
    private function OnCheckRedeemEntranceSuccess(ho : HashObject) : void
    {
        var canOpenRedeemUI : boolean = _Global.GetBoolean(ho["canOpenRedeemUI"]);
        
        if (canOpenRedeemUI)
        {
            redeemInviteCodeStatus = RedeemInviteCodeStatus.EntranceVisible;
        }
        else
        {
            redeemInviteCodeStatus = RedeemInviteCodeStatus.EntranceInvisible;
        }
        
        RefreshLayout();
    }
	
	private function priv_adjustYPosition()
	{
		var objs:Array = scroll.getUIObject();
		
		var totalHeigh : float = 0.0f;
		for ( var i = 0; i != objs.length; ++i )
		{
			var item : SettingItem = objs[i] as SettingItem;
			if ( !item || !item.isVisible())
				continue;
			
			totalHeigh += item.rect.height;
		}
		
		scroll.rect.height = totalHeigh;
		this.backLabel2.rect.height = totalHeigh + 15;
	}
	
	public	function	OnPopOver()
	{
		if(CloseCallback != null)
		{
			CloseCallback();
			CloseCallback = null;
		}
		super.OnPopOver();
	}

	protected function prot_OnSubMenuTransFin(menu : SubMenu, isPush : boolean)
	{
		if ( !isPush && (menu as ChooseLanguage) != null )
		{
			menu.OnPopOver();
		}
	}
	
    function DrawBackground()
	{
		if(Event.current.type != EventType.Repaint)
			return;
		
		GUI.BeginGroup(backRect);
		DrawMiddleBg(rect.width - 22,6);
		prot_drawFrameLine();
		GUI.EndGroup();
	}
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.APP_BECOME_ACTIVE:
				if(this.GetTopSubMenu() == pushMenu)
				{
					pushMenu.OnPush(null);
				}
				break;
				
			case Constant.Notice.GAMECENTER_ID_CHANGED:
			case Constant.Notice.SERVER_SETTING_CHANGED:
					gameCenterIdMenu.handleNotification(type, body);
				break;
		}
	}
	
    private function RefreshLayout()
    {   
//        redeemInviteCode.SetVisible(redeemInviteCodeStatus == RedeemInviteCodeStatus.EntranceVisible); removed in 18.5.0 Gaea
        priv_adjustYPosition();
        scroll.AutoLayout();
        scroll.MoveToTop();
    }
    
	function OnPush( param:Object )
	{
		super.OnPush(param);
		showIphoneXFrame=false;
        RefreshLayout();
        
		while(curState != State.Normal)
		{
			UpdateTransition();
		}
		curState = State.Normal;
		
		PlayModalOpen();
		
//		repeatTimes = 43;
		marginT = TextureMgr.instance().LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);			
//		marginM = new Material(Shader.Find("Mobile/Decaration/Margin"));
//		marginM.SetTextureScale("_MainTex", Vector2(1, repeatTimes));			
		
	}

	private var hasOpenedGamble:boolean = false;
	
	public function OnPop():void
	{
		super.OnPop();
		pushMenu.OnPop();
		subMenuStack.Clear();
	}
	
	public function OpenGamebleAfterKabamID():void
	{
		var seed:HashObject = GameMain.instance().getSeed();
		if(_Global.INT32(seed["hasFreePlay"]) > 0)
		{
			MenuMgr.getInstance().SwitchMenu("GambleMenu", null);
		}		
	}
		
	public function DrawTitle()
	{
		frameLabel.Draw();	
		btnClose.Draw();		
	}
	
	function DrawItem()
	{ 
		GUI.BeginGroup(animClipRect);
		super.DrawItem();
		GUI.EndGroup();
	}
	
	protected function DrawSubMenu()
	{
		GUI.BeginGroup(animClipRect);
		super.DrawSubMenu();
		GUI.EndGroup();
	}
	
	public function PushSubMenu(menu:SubMenu, param:Object)
	{
		menu.rect.x = -animClipRect.x;
		super.PushSubMenu(menu, param);
	}
	
	private function SetNotification(bPush:boolean)
	{
		Datas.instance().setPushNotification(bPush);
	}
	
	private function OpenAbout(param:Object)
	{
		PushSubMenu(aboutMenu, param);
	}
	
	public function OpenKabamId(param:Object)
	{
		var kabamId:long = Datas.instance().getKabamId();
		if(kabamId == 0)
		{
			PushSubMenu(kabamIdMenu, false);
			KabamId.BIPosition = 3;
			UnityNet.SendKabamBI(KabamId.BIPosition, 0);
		}	
		else
			PushSubMenu(loginState, null);	
	}
	
	public function OpenGameCenterId(param:Object)
	{
		PushSubMenu(gameCenterIdMenu, null);	
	}
	
	private function OpenHelp(param:Object)
	{
		PushSubMenu(helpMenu, param);
	}
	
	private function OpenLanguage(param:Object)
	{
		PushSubMenu(chooseLanguage, param);
	}
	
	private function OpenSound(param:Object)
	{
		PushSubMenu(soundMenu, param);
	}
	
	private function OpenMap(param:Object)
	{
		//PushSubMenu(mapMenu, param);
	}
	
	private function OpenPush(param:Object)
	{
		PushSubMenu(pushMenu, param);
	}
	
	private function OpenGames(param:Object)
	{
		PushSubMenu(gamesMenu, param);
	}
    
    private function OpenRedeemInviteCode(param:Object)
    {
        PushSubMenu(redeemInviteCodeMenu, param);
    }
	
	public  function SwitchToLoginState()
	{
		subMenuStack.Clear();
		PushSubMenu(loginState, null);
		while( curState != State.Normal )
		{
			UpdateTransition();
		}
	}
	
	public  function SwitchToKabamID()
	{
		subMenuStack.Clear();
		PushSubMenu(kabamIdMenu, true);
		while( curState != State.Normal )
		{
			UpdateTransition();
		}
	}
	
	public function SwitchToHelp()
	{
		subMenuStack.Clear();
		PushSubMenu(helpMenu, true);
		while( curState != State.Normal )
		{
			UpdateTransition();
		}
	}
	
	public function CloseMenu(param:Object)
	{
		if(subMenuStack.Count > 0)
		{
			if(subMenuStack[subMenuStack.Count - 1] == kabamIdMenu)
			{
				UnityNet.SendKabamBI(KabamId.BIPosition, 2);
			}
			else if(subMenuStack[subMenuStack.Count - 1] == creatKabamIdMenu)
			{
				UnityNet.SendKabamBI(KabamId.BIPosition, 302);
			}
			else if(subMenuStack[subMenuStack.Count - 1] == login)
			{
				UnityNet.SendKabamBI(KabamId.BIPosition, 402);
			}
		}
		MenuMgr.getInstance().PopMenu("");
		
	}
	
	function Update()
	{
		super.Update();
		scroll.Update();
	}

	public function OnBackButton() : boolean
	{
		return false;
	}
}
