class LoginState extends SubMenu
{
	public var account:Label;
	public var signIn:Label;
	public var manageAccount:Label;
	public var kabam:Label;
	public var logo:Label;
	public var backLabel2:Label;
	public var btnLogin:Button;

	
	function Init(parent:ComposedMenu)
	{
		super.Init(parent);
//		var arStrings:Object = Datas.instance().arStrings();
		signIn.txt = Datas.getArString("Settings.SignedInAs");
		manageAccount.txt =  Datas.getArString("Settings.ManageAccount");
		kabam.txt =  Datas.getArString("Settings.ManageAccount_Web");
		btnLogin.txt = Datas.getArString("Settings.Login");
		btnLogin.OnClick =Login;
	}
	
	function DrawItem()
	{	
		btnBack.Draw();
		logo.Draw();
		backLabel2.Draw();
		signIn.Draw();
		account.Draw();
		manageAccount.Draw();
		kabam.Draw();
		btnLogin.Draw();
	}
	
	//function 
	
	function OnPush(param:Object)
	{
		account.txt = Datas.instance().getEmail();
	}
	
	function Login(param:Object)
	{
		var setting:PlayerSetting = m_parent as PlayerSetting;
		var kabamId:long = Datas.instance().getKabamId();
		m_parent.PushSubMenu(setting.login, param);
		UnityNet.SendKabamBI(KabamId.BIPosition, 4);

	}
	
	function DrawBackground()
	{
	}

}
