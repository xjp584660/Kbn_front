class CreatKabamId extends SubMenu
{
	public var email:Label;
	public var emailTextField:TextField;
	public var password:Label;
	public var passwordTextField: PasswordField;
	public var password2:Label;
	public var password2TextField: PasswordField;
	public var btnCreat:Button;
	public var backLabel:Label;
	public var passwordRule:Label;
	function Init(parent:ComposedMenu)
	{
		super.Init(parent);
//		var arStrings:Object = Datas.instance().arStrings();
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt = Datas.getArString("Settings.CreatAccount_Title");
		email.txt = Datas.getArString("Settings.Email");
		password.txt = Datas.getArString("Settings.Password");
		password2.txt = Datas.getArString("Settings.PasswordAgain");
		btnCreat.txt = Datas.getArString("Common.Create");
		btnCreat.OnClick = Register;
		passwordTextField.txt = "";
		password2TextField.txt = ""; 
		passwordRule.txt = Datas.getArString("Settings.PasswordRule");
		
		emailTextField.Init();
		emailTextField.setReadEndEnable(true);
	}
	
	function DrawItem()
	{
		title.Draw();
		backLabel.Draw();
		email.Draw();
		emailTextField.Draw();
		password.Draw();
		passwordTextField.Draw();
		password2.Draw();
		password2TextField.Draw();
		passwordRule.Draw();
		btnBack.Draw();
		btnCreat.Draw();
	}
	
	function Register(param:Object)
	{
//		emailTextField._txt = "a2@163.com";
//		passwordTextField._txt = "12345678";
//		password2TextField._txt = "12345678";
		if(!CheckInput())
			return;
		UnityNet.Register(emailTextField.txt, passwordTextField.txt, RegisterSuccess, null);
	}
	
	function RegisterSuccess(result:HashObject)
	{
//		_Global.Log("Naid: "+ result["naid"]);
//		_Global.Log("kabam_id: "+ result["kabam_id"]);
		UnityNet.SendKabamBI(KabamId.BIPosition, 303);
		Datas.instance().setNaid(_Global.GetString(result["naid"]));
		Datas.instance().setKabamId(_Global.INT64(result["kabam_id"]));
		Datas.instance().setAccessToken(result["access_token"].Value);
		Datas.instance().setEmail(emailTextField.txt);
		AddRewards(result["rewards"]);
		GameMain.instance().LoginSucess();
		MenuMgr.getInstance().PopMenu("");
	//	GameMain.instance().restartGame();
//		_Global.Log("kabamid: " + _Global.INT32(result["kabam_id"]));
	}
	
	private function CheckInput():boolean
	{
	//	var arStrings:Object = Datas.instance().arStrings();
		if(emailTextField.txt == "" || passwordTextField.txt == "")
		{
			ErrorMgr.instance().PushError("",Datas.getArString("Error.err_1600"));
			return false;
		}	
		if(passwordTextField._txt != password2TextField._txt)
		{
			ErrorMgr.instance().PushError(null, Datas.getArString("Settings.InvalidPassword"));
			passwordTextField.txt = "";
			password2TextField.txt = ""; 
			return false;
		}
		
		if(passwordTextField._txt == "" )
		{	
			ErrorMgr.instance().PushError(null, Datas.getArString("Settings.InputPassword"));
			passwordTextField.txt = "";
			password2TextField.txt = ""; 
			return false;	
		}
		

		return true;
	}
	
	function OnPush(param:Object)
	{
		passwordTextField.txt = "";
		password2TextField.txt = ""; 
		emailTextField.txt = "";
	}
	
	function AddRewards(rewards:HashObject)
	{
		var seed:Object = GameMain.instance().getSeed();
		var gems:int = _Global.INT32(rewards["gems"]);
		Payment.instance().AddGems(gems);
		if(rewards["gems"] != null && gems > 0)
			GameMain.instance().CheckAndOpenRaterAlert("kabamid");
		var keys:Array = _Global.GetObjectKeys(rewards["items"]);
		var items:HashObject = rewards["items"];
		for(var i = 0; i<keys.length; i++)
		{
			MyItems.instance().AddItem(_Global.INT32(keys[i]), _Global.INT32(items[keys[i]]));
		}
		
		var chests:HashObject = rewards["chests"];
		keys =_Global.GetObjectKeys(chests) ;
		for(i = 0; i<keys.length; i++)
		{
			MyItems.instance().AddItem(_Global.INT32(keys[i]), _Global.INT32(chests[keys[i]]));
		}
		
	}
	
	function DrawBackground()
	{

	}
	
	function OnPop()
	{
		if(InputText.getKeyBoard())
		{
			InputText.getKeyBoard().active = false;
		}
	}
	
	function DefaultBack(parram:Object)
	{
		UnityNet.SendKabamBI(KabamId.BIPosition, 301);
		m_parent.PopSubMenu();
	}
}

