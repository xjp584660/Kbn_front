class LoginMenu extends PopMenu
{	
	public var email:Label;
	public var emailTextField:TextField;
	public var password:Label;
	public var passwordTextField:TextField;
	public var l_bg:Label;
	public var btnLogin:Button;
	public var btnForget:Button;
	
	public var forgetPassword:Label;
	public var forgetPasswordTextField:TextField;
	public var forgetPasswordTips:Label;
	
	public var btnResetPassword:Button;
	public var resetPasswordSucessTips:Label;
	public static var BIPosition:int;
	public var btnBack:Button;
	
	function Init()
	{
		super.Init();
//		var arStrings:Object = Datas.instance().arStrings();
		title.txt = Datas.getArString("Settings.Login");
		email.txt = Datas.getArString("Settings.Email");
		password.txt = Datas.getArString("Settings.Password");
		btnLogin.txt = Datas.getArString("Settings.Login");
		btnForget.txt = Datas.getArString("Settings.ForgetPassword");
		btnLogin.OnClick = Login;
			
		btnForget.OnClick = OnForgetPassword;
		
		btnBack.OnClick = onDefaultBack;
		
		forgetPassword.txt = Datas.getArString("Settings.ForgotyourPass");
		btnResetPassword.txt = Datas.getArString("Settings.UpdatePassword");
		btnResetPassword.OnClick = OnResetPassword;
		forgetPasswordTips.txt = Datas.getArString("Settings.UpdatePasswordTips");
		
		
		showLogInInfo(true,false,false);
	}
	
	function onDefaultBack(parram:Object)
	{
		showLogInInfo(true,false,false);
	
		UnityNet.SendKabamBI(BIPosition, 401);
	}
	
	function DrawItem()
	{
		title.Draw();
		l_bg.Draw();
		email.Draw();
		emailTextField.Draw();
		password.Draw();
		passwordTextField.Draw();
	//	btnBack.Draw();
		btnForget.Draw();
		btnLogin.Draw();
		
		btnBack.Draw();
		forgetPassword.Draw();
		forgetPasswordTextField.Draw();
		forgetPasswordTips.Draw();
		resetPasswordSucessTips.Draw();
		btnResetPassword.Draw();
	}
	
	function Login()
	{
		if(!CheckFormate())
		{
			return;
		}
//		emailTextField._txt = "1012@163.com";
//		passwordTextField._txt = "123456789";
		UnityNet.Login(emailTextField.txt, passwordTextField.txt, LoginSuccess, null);
	}
	
	function LoginSuccess(result:HashObject)
	{
//		_Global.Log("Naid: "+ result["naid"]);
//		_Global.Log("kabam_id: "+ result["kabam_id"] + "|" + _Global.INT64(result["kabam_id"]));
		Datas.instance().setNaid(_Global.GetString(result["naid"]) );
		Datas.instance().setKabamId(_Global.INT64(result["kabam_id"]));
		Datas.instance().setAccessToken(result["access_token"].Value);
		Datas.instance().setWorldid(_Global.INT32(result["lastServerId"]));
		Datas.instance().setTvuid(_Global.INT32(result["tvuid"]));
		Datas.instance().setEmail(emailTextField.txt);
		Datas.instance().SaveServerDataForClient(result);
		MenuMgr.getInstance().PopMenu("");
		//GameMain.instance().LoginSucess();
		if(GameMain.instance().curSceneLev() >= GameMain.CITY_SCENCE_LEVEL)
		{ 
			GameMain.instance().restartGame();
		}
		else
		{
			GameMain.instance().Signup();
		}
//		AfternLogin();
	}
	
	var AfternLogin:Function;
	
	private function Restart()
	{

	}
	
	function OnPush(param:Object)
	{
		emailTextField.txt = Datas.instance().getEmail();
		passwordTextField.txt = "";
		AfternLogin = Restart;
	}
	
	private function CheckFormate():boolean
	{
		if(emailTextField.txt == "" || passwordTextField.txt == "")
		{
			ErrorMgr.instance().PushError("",Datas.getArString("Error.err_1600"));
			return false;
		}	
		return true;
	}
	
	private function showLogInInfo(isHide:boolean,isHideTwoPanel:boolean,isResetPasswordSucess:boolean)
	{
		email.SetVisible(isHide);
		emailTextField.SetVisible(isHide);
		password.SetVisible(isHide);
		passwordTextField.SetVisible(isHide);
		
		btnLogin.SetVisible(isHide);
		
		btnForget.SetVisible(isHide);
		btnBack.SetVisible(!isHide);
			
		forgetPassword.SetVisible(isHideTwoPanel);
		forgetPasswordTextField.SetVisible(isHideTwoPanel);
		forgetPasswordTips.SetVisible(isHideTwoPanel);
		btnResetPassword.SetVisible(isHideTwoPanel);
		
		resetPasswordSucessTips.SetVisible(isResetPasswordSucess);		
	}
	
	private function OnResetPassword()
	{
		UnityNet.SendKabamBI(BIPosition, 404);
		showLogInInfo(false,true,false);
		if(!CheckInput())
			return;
		UnityNet.ResetPassword(forgetPasswordTextField.txt, ResetPasswordSuccess, null);
	}
	
	function ResetPasswordSuccess(result:HashObject)
	{
		if(result!=null)
		{
			if(result["ok"]!=null)
			{
				if(_Global.GetBoolean(result["ok"]))
				{
					showLogInInfo(false,false,true);
					resetPasswordSucessTips.txt = String.Format(Datas.getArString("Settings.InvitationCodeTips_4"),"<color=#ff0000>"+forgetPasswordTextField.txt+"</color>");
				}
			}
		}
	}
	
	private function CheckInput():boolean
	{
		if(forgetPasswordTextField.txt == "")
		{
			ErrorMgr.instance().PushError("",Datas.getArString("Error.err_1600"));
			return false;
		}	

		return true;
	}
	
	private function OnForgetPassword()
	{
		UnityNet.SendKabamBI(BIPosition, 404);
		showLogInInfo(false,true,false);
		//Application.OpenURL("https://www.kabam.com/account/forgot");
	}
	
	function OnPop()
	{
		if(emailTextField.getKeyBoard())
		{
			emailTextField.getKeyBoard().active = false;
		}
		if(passwordTextField.getKeyBoard())
		{
			passwordTextField.getKeyBoard().active = false;
		}
	}

}

