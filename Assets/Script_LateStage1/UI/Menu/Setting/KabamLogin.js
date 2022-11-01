/*20170503
add new features:
1.reset password.
2.forget mail.
  */
class KabamLogin extends SubMenu
{
	public var email:Label;
	public var emailTextField:TextField;
	public var password:Label;
	public var passwordTextField: PasswordField;
	public var backLabel:Label;
	public var btnLogin:Button;
	//yyyyy
	public var btnForget:Button;
	public var btnForgetEmail:Button;
	
	public var forgetPassword:Label;
	public var forgetPasswordTextField:TextField;
	public var forgetPasswordTips:Label;
	
	public var btnResetPassword:Button;
	public var resetPasswordSucessTips:Label;
	
	function Init(parent:ComposedMenu)
	{
		super.Init(parent);
//		var arStrings:Object = Datas.instance().arStrings();
		title.txt = Datas.getArString("Settings.Login");
		email.txt = Datas.getArString("Settings.Email");
		password.txt = Datas.getArString("Settings.Password");
		btnLogin.txt = Datas.getArString("Settings.Login");
		btnLogin.OnClick = Login;
		
		btnForget.txt = Datas.getArString("Settings.ForgetPassword");
		btnForgetEmail.txt = Datas.getArString("Settings.ForgotEmail");
		btnForget.OnClick = OnForgetPassword;
		btnForgetEmail.OnClick = OnForgetEmail;
		
		forgetPassword.txt = Datas.getArString("Settings.ForgotyourPass");
		btnResetPassword.txt = Datas.getArString("Settings.UpdatePassword");
		btnResetPassword.OnClick = OnResetPassword;
		forgetPasswordTips.txt = Datas.getArString("Settings.UpdatePasswordTips");
		
		
		showLogInInfo(true,false,false);
		
	}
	function handleTextClicked()
	{
	}
	function DrawItem()
	{
		title.Draw();
		backLabel.Draw();
		email.Draw();
		emailTextField.Draw();
		password.Draw();
		passwordTextField.Draw();
		btnBack.Draw();
		btnLogin.Draw();
		
		btnForget.Draw();
		btnForgetEmail.Draw();
		
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
//		emailTextField._txt = "lh1@163.com";
//		passwordTextField._txt = "12345678";
		UnityNet.Login(emailTextField.txt, passwordTextField.txt, LoginSuccess, null);
//		UnityNet.Login("1016@163.com", "123456789", LoginSuccess, null);
	}
	
	function LoginSuccess(result:HashObject)
	{
		Datas.instance().setNaid(_Global.GetString(result["naid"]) );
		Datas.instance().setKabamId(_Global.INT64(result["kabam_id"]));
		Datas.instance().setAccessToken(result["access_token"].Value);
		Datas.instance().setWorldid(_Global.INT32(result["lastServerId"]));
		Datas.instance().setTvuid(_Global.INT32(result["tvuid"]));
		Datas.instance().setEmail(emailTextField.txt);
		Datas.instance().SaveServerDataForClient(result);
		UnityNet.SendKabamBI(KabamId.BIPosition, 403);
//		_Global.Log("kabamid: " + _Global.INT32(result["kabam_id"]));
		AfternLogin();
	}
	
	var AfternLogin:Function;
	
	private function Restart()
	{
	//	var arStrings:Object = Datas.instance().arStrings();
		MenuMgr.getInstance().PushMessage(Datas.getArString("Settings.LoginSuccess"));
		
		var setting:PlayerSetting = m_parent as PlayerSetting;
		setting.SwitchToLoginState();
		GameMain.instance().LoginSucess();
		GameMain.instance().restartGame();
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
	
	
	function DrawBackground()
	{
		
	}
	
	function DefaultBack(parram:Object)
	{
		showLogInInfo(true,false,false);
	
		UnityNet.SendKabamBI(KabamId.BIPosition, 401);
		m_parent.PopSubMenu();
	}
	
	function OnPop()
	{
		if(InputText.getKeyBoard())
		{
			InputText.getKeyBoard().active = false;
		}
	}
	//yyyyy
	private function showLogInInfo(isHide:boolean,isHideTwoPanel:boolean,isResetPasswordSucess:boolean)
	{
		email.SetVisible(isHide);
		emailTextField.SetVisible(isHide);
		password.SetVisible(isHide);
		passwordTextField.SetVisible(isHide);
		
		btnLogin.SetVisible(isHide);
		
		btnForget.SetVisible(isHide);
		btnForgetEmail.SetVisible(isHide);
		
		
		forgetPassword.SetVisible(isHideTwoPanel);
		forgetPasswordTextField.SetVisible(isHideTwoPanel);
		forgetPasswordTips.SetVisible(isHideTwoPanel);
		btnResetPassword.SetVisible(isHideTwoPanel);
		
		resetPasswordSucessTips.SetVisible(isResetPasswordSucess);
		
	}
	private function OnForgetPassword()
	{
		UnityNet.SendKabamBI(KabamId.BIPosition, 404);
		showLogInInfo(false,true,false);
//		Application.OpenURL("https://www.kabam.com/account/forgot");

	}
	private function OnResetPassword()
	{
		UnityNet.SendKabamBI(KabamId.BIPosition, 404);
		showLogInInfo(false,true,false);
		if(!CheckInput())
			return;
		UnityNet.ResetPassword(forgetPasswordTextField.txt, ResetPasswordSuccess, null);
//		Application.OpenURL("https://www.kabam.com/account/forgot");

	}
	private function OnForgetEmail()
	{
		UnityNet.SendKabamBI(KabamId.BIPosition, 404);
		Application.OpenURL("https://gaea.zendesk.com/hc/en-us/requests/new");
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
	
////		_Global.Log("Naid: "+ result["naid"]);
////		_Global.Log("kabam_id: "+ result["kabam_id"]);
//		UnityNet.SendKabamBI(KabamId.BIPosition, 303);
//		Datas.instance().setNaid(_Global.GetString(result["naid"]));
//		Datas.instance().setKabamId(_Global.INT64(result["kabam_id"]));
//		Datas.instance().setAccessToken(result["access_token"].Value);
//		Datas.instance().setEmail(emailTextField.txt);
//		AddRewards(result["rewards"]);
//		GameMain.instance().LoginSucess();
//		MenuMgr.getInstance().PopMenu("");
//	//	GameMain.instance().restartGame();
////		_Global.Log("kabamid: " + _Global.INT32(result["kabam_id"]));
	}
}

