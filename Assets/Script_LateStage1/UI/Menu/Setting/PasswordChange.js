class PasswordChange extends PopMenu
{
	public var email:Label;
	public var emailTextField:TextField;
	public var password:Label;
	public var passwordTextField:TextField;
	public var backLabel2:Label;
	public var btnLogin:Button;
	public var passwordChanged:Label;
	public var reLog:Label;
	public var logo:Label;
//	public var btnForget:Button;
	function Init()
	{
		super.Init();
//		var arStrings:Object = Datas.instance().arStrings();
		title.txt = Datas.getArString("Settings.Login");
		email.txt = Datas.getArString("Settings.Email");
		password.txt = Datas.getArString("Settings.Password");
		btnLogin.txt = Datas.getArString("Settings.Login");
//		btnForget.txt = Datas.getArString("Settings.ForgetPassword"];
		passwordChanged.txt = Datas.getArString("Settings.PasswordUpdate");
		reLog.txt = Datas.getArString("Settings.LoginAgain");
		btnLogin.OnClick = Login;
		btnClose.SetVisible(false);
	}
	
	function DrawItem()
	{
		title.Draw();
		logo.Draw();
		backLabel2.Draw();
		email.Draw();
		emailTextField.Draw();
		password.Draw();
		passwordTextField.Draw();
//		btnBack.Draw();
//		btnForget.Draw();
		btnLogin.Draw();
		passwordChanged.Draw();
		reLog.Draw();
	}
	
	function Login()
	{
//		emailTextField._txt = "lh@163.com";
//		passwordTextField._txt = "12345678";
		if(!CheckFormate())
		{
			return;
		}
		UnityNet.Login(emailTextField.txt, passwordTextField.txt, LoginSuccess, null);
	}
	
	function LoginSuccess(result:HashObject)
	{
		var oldId:long = 	Datas.instance().getKabamId();
		Datas.instance().setNaid(_Global.GetString(result["naid"]));
		Datas.instance().setKabamId(_Global.INT64(result["kabam_id"]));
		Datas.instance().setAccessToken(result["access_token"].Value);
		Datas.instance().setWorldid(_Global.INT32(result["lastServerId"]));
		Datas.instance().setTvuid(_Global.INT32(result["tvuid"]));
		Datas.instance().setEmail(emailTextField.txt);
		
//		var arStrings:Object = Datas.instance().arStrings();
		MenuMgr.getInstance().PushMessage(Datas.getArString("Settings.LoginSuccess"));
		
	//	var setting:PlayerSetting = m_parent as PlayerSetting;
	//	m_parent.PopSubMenu();
	//	m_parent.PushSubMenu(setting.loginState, null);
	//	setting.SwitchToLoginState();
		GameMain.instance().LoginSucess();
	//	if(	oldId != Datas.instance().getKabamId() )
			GameMain.instance().restartGame();
//		else
//			MenuMgr.getInstance().PopMenu("");	
	}
	
	function OnPush(param:Object)
	{
		emailTextField.txt = Datas.instance().getEmail();
		passwordTextField.txt = "";
	}
	
	private function CheckFormate():boolean
	{
		return true;
	}
	
}

