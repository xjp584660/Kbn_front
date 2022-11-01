class GameCenterId extends SubMenu
{
	public var username:Label;
	public var message:Label; 
	public var gcIntroMessage:Label;
//	public var gcIntroTitle:Label; 
	public var gcIntroIcon:Label; 
	public var btnBind:Button;
	public var btnChallenge:Button;
	public var btnAchievement:Button;
	public var btnLeaderborad:Button;
	public var lblAchievement:Label;
	public var lblLeaderboard:Label;
	
	public var lblBack:Label;
	public var line:Label;
	public var line2:Label;
	public var gamecenterIdBind:Label;
	public var kabamId:Label;
	
	private var uis:Button[];
	private var bind:String;
	private var auth:String;
	var isSignIn:boolean = false;
	function Init(parent:ComposedMenu)
	{
		super.Init(parent);
		var tmgr:TextureMgr = TextureMgr.instance();
		var iconName:String = "gamecentericon";
		
		btnBind.OnClick = bindGameCenter;
		if (Datas.GetPlatform() == Datas.AppStore.ITunes)
		{
			btnBind.txt = Datas.getArString("GameCenter.LinkGameCenterBtn");
			btnBind.mystyle.normal.background=tmgr.LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
			btnBind.mystyle.active.background=tmgr.LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
			btnBind.mystyle.border.left = 35;
			btnBind.mystyle.border.right = 35;
			btnBind.mystyle.border.top = 0;
			btnBind.mystyle.border.bottom = 0;
			btnBind.rect.x=145;
			btnBind.rect.y=335;
			btnBind.rect.width=300;
			btnBind.rect.height=68;
			btnBind.mystyle.contentOffset.x=0;
			btnBind.mystyle.contentOffset.y=0;
			
			gcIntroMessage.txt = Datas.getArString("GameCenter.Description");
			title.txt = Datas.getArString("GameCenter.Title");
		}
		else if( Datas.GetPlatform() == Datas.AppStore.GooglePlay )
		{
			btnBind.txt = Datas.getArString("GameCenter.LinkGameCenterBtn_android");
			btnBind.mystyle.normal.background=tmgr.LoadTexture("btn_g+base", TextureType.DECORATION);
			btnBind.mystyle.active.background=tmgr.LoadTexture("btn_g+press", TextureType.DECORATION);
			btnBind.mystyle.border.left = 70;
			btnBind.mystyle.border.right = 10;
			btnBind.mystyle.border.top = 1;
			btnBind.mystyle.border.bottom = 1;
			btnBind.rect.x=145;
			btnBind.rect.y=335;
			btnBind.rect.width=300;
			btnBind.rect.height=68;
			btnBind.mystyle.contentOffset.x=17;
			btnBind.mystyle.contentOffset.y=0;
			
			iconName = "googlegamecentericon";
			
			gcIntroMessage.txt = Datas.getArString("GameCenter.Description_android");
			title.txt = Datas.getArString("GameCenter.Title_android");
			
			lblAchievement.mystyle.normal.background = tmgr.LoadTexture("gameservice_achievements_icon", TextureType.DECORATION);
			lblLeaderboard.mystyle.normal.background = tmgr.LoadTexture("gameservice_leaderboard_icon", TextureType.DECORATION);
		}
		
		
		line2.mystyle.normal.background = tmgr.LoadTexture("between line",TextureType.DECORATION);
		gcIntroIcon.mystyle.normal.background = tmgr.LoadTexture(iconName,TextureType.ICON);
		
		uis = [btnLeaderborad,btnAchievement,btnChallenge];
		btnChallenge.txt = Datas.getArString("GameCenter.Challenges");
		btnAchievement.txt = Datas.getArString("GameCenter.Achievements");
		btnLeaderborad.txt = Datas.getArString("GameCenter.Leaderboards");
		
		btnLeaderborad.OnClick = showLeaderboard;
		btnAchievement.OnClick = showAchievement;
		btnChallenge.OnClick = showChallenge;
		
		lblAchievement.SetVisible(false);
		lblLeaderboard.SetVisible(false);
	}
	
	function DrawItem()
	{
		lblBack.Draw();
		username.Draw();
		btnBack.Draw();
		message.Draw();
		btnBind.Draw();
		gamecenterIdBind.Draw();
		kabamId.Draw();
		line.Draw();
		
		line2.Draw();
		gcIntroIcon.Draw();
		title.Draw();
		gcIntroMessage.Draw();
		btnChallenge.Draw();
		btnAchievement.Draw();
		btnLeaderborad.Draw();
		
		lblAchievement.Draw();
	    lblLeaderboard.Draw();
	}

	function OnPush(param:Object)
	{
		for(var item in uis){
			item.changeToGreyNew();
		}
		initUIViewAndTexts();
	}
	
	private function initUIViewAndTexts()
	{
	
		username.txt = "";
		var seed:HashObject = GameMain.instance().getSeed();
		if( seed != null && seed["players"] != null 
			&& seed["players"]["u"+ Datas.instance().tvuid() ] != null 
			&& seed["players"]["u"+ Datas.instance().tvuid() ]["n"] != null ){
			username.txt = seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value;
		}
		
		kabamId.txt = String.Format("{0}: {1}",Datas.getArString("Settings.KabamID"),Datas.instance().getEmail());
			
		if (Datas.GetPlatform() == Datas.AppStore.ITunes)
		{
			auth = Datas.instance().GetGameCenterPlayerId();
			bind = Datas.instance().GetGameCenterPlayerId_Binded();
			if(String.IsNullOrEmpty(auth))
			{
				message.txt = Datas.getArString("GameCenter.NotLoggedIn");
			}
			else
			{
				message.txt = Datas.getArString("GameCenter.SignedInAs") + "\n" + Datas.instance().GetGameCenterAlias();
			}
			
			gamecenterIdBind.txt = String.Format("{0}: {1}",Datas.getArString("Common.GameCenterID"),Datas.instance().GetGameCenterAlias_Binded());
			
			
			btnBind.txt = Datas.getArString("GameCenter.LinkGameCenterBtn");
			btnBind.changeToGreyNew();
			
			if( seed["serverSetting"] != null  
				&& _Global.INT32(seed["serverSetting"]["gameCenterBindOpen"]) == 1 ){
				if(String.IsNullOrEmpty(auth) == false) 
				{
					if(auth != bind)
					{
						if(String.IsNullOrEmpty(bind) == false)
						{
							btnBind.txt = Datas.getArString("GameCenter.SwitchAccountBtn");
						}
						else
						{
							btnBind.txt = Datas.getArString("GameCenter.LinkGameCenterBtn");
						}
						btnBind.changeToBlueNew();
					}else{
						for(var item in uis){
							item.SetVisible(true);
							item.changeToBlueNew();
						}
					}
				}
			}
			
			var deviceInfo:Datas.DeviceInfo = Datas.instance().getDeviceInfo();
			if(deviceInfo == null || deviceInfo.IsSupportGameCenterV6() == false)
			{
				btnChallenge.SetVisible(false);
			}
		}
		else if (Datas.GetPlatform() == Datas.AppStore.GooglePlay)
		{
		//	var isSignIn:boolean = false;
			message.txt = "";
			try
			{
				gamecenterIdBind.txt = String.Format("{0}: {1}",Datas.getArString("Common.GameCenterID_android"),NativeCaller.GetGoogleAccountName());
				isSignIn = NativeCaller.IsSignInGameServices();
			}
			catch(Exception)
			{
				isSignIn = false;
				gamecenterIdBind.txt = Datas.getArString("Common.GameCenterID_android") + ":";
			}
			if ( isSignIn )
			{
				//message.txt = Datas.getArString("GameCenter.SignedInAs_adroid");
				btnBind.SetVisible(false);
				btnBind.txt = Datas.getArString("GameCenter.SwitchAccountBtn");
				for(var i:int = 0; i < uis.length-1; ++i)
				{
					uis[i].SetVisible(true);
					uis[i].changeToBlueNew();
				}
				lblAchievement.SetVisible(true);
	        	lblLeaderboard.SetVisible(true);
				uis[2].SetVisible(false);
			}
			else
			{
				message.txt = Datas.getArString("GameCenter.NotLoggedIn_android") + "\r\n" + Datas.instance().GetGameCenterAlias();
				for(var j:int = 0; j < uis.length; ++j)
				{
					uis[j].SetVisible(false);
				}
				lblAchievement.SetVisible(false);
	        	lblLeaderboard.SetVisible(false);
				btnBind.SetVisible(true);
				btnBind.txt = Datas.getArString("GameCenter.LinkGameCenterBtn_android");
			}
			
		}
		
	}
	
	function Update()
	{
		
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.GAMECENTER_ID_CHANGED:
			case Constant.Notice.SERVER_SETTING_CHANGED:
					initUIViewAndTexts();
				break;
		}
	}
	
	protected function bindGameCenter(clickParam:Object):void
	{
		if (Datas.GetPlatform() == Datas.AppStore.ITunes){
			var aliasAuth = Datas.instance().GetGameCenterAlias();
			if(String.IsNullOrEmpty(auth) == false && auth != bind) 
			{
				var callback:Function = function(restart:boolean){
					if(restart)
					{
						DefaultBack(null);
					}
					else
					{
						initUIViewAndTexts();
					}
				};
				GameMain.instance().CheckGameCenterIdForBind(callback,auth,aliasAuth);
			}
		}
		else if (Datas.GetPlatform() == Datas.AppStore.GooglePlay)
		{

//			if (NativeCaller.IsSignInGameServices())
//			{
//				_Global.Log("-------signIngameServer--------");
//				try
//				{
//					NativeCaller.LogoutGameServices();
//				}
//				catch(Exception)
//				{
//					ErrorMgr.singleton.PushError("",Datas.getArString("Error.Client_Error"));
//				}
//				initUIViewAndTexts();
//			}
//			else
//			{
//				_Global.Log("-----Not--signIngameServer--------");
			
				NativeCaller.AuthehticatLocalUser();
				DefaultBack(null);
				GameMain.instance().StartCoroutine(showBack());
//			}
		}	
	}
	
	private function showBack() : IEnumerator
{
	yield;	
	DefaultBack(null);
}
	
	protected function showLeaderboard(clickParam:Object):void
	{
		GameCenterHelper.ShowLeaderboardUI();
	}
	
	protected function showAchievement(clickParam:Object):void
	{
		GameCenterHelper.ShowAchievementsUI();
	}
	
	protected function showChallenge(clickParam:Object):void
	{
		GameCenterHelper.showChallengeUI();
	}

}