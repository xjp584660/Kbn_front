class MigrateAccount extends SubMenu{

	public var mtitle:Label;
	public var line:Label;
	public var mframeTop:Label;
	
	public var confirm:Button;
	public var tipsLabel:Label;
	
	public var emaileLabel:Label;
	public var passwordLabel:Label;
	public var emaileInut:TextField;
	public var passwordInput:TextField;

	function Init()
	{
		confirm.OnClick = OnConfirm;
		mtitle.txt=Datas.getArString("Migrate.Confirm_Title");
		tipsLabel.txt=Datas.getArString("Migrate.Confirm_Test");
		emaileLabel.txt=Datas.getArString("ModalTitle.Email");
		passwordLabel.txt=Datas.getArString("Settings.Password");
		confirm.txt=Datas.getArString("Migrate.Confirm_Button");
        emaileInut.mystyle.normal.background = TextureMgr.instance().LoadTexture("Migrate_Email_InputBackGround",TextureType.DECORATION);
        passwordInput.mystyle.normal.background = TextureMgr.instance().LoadTexture("Migrate_Email_InputBackGround",TextureType.DECORATION);
		emaileInut.ClearField();
		passwordInput.ClearField();
	}
	
	public function OnPush(param:Object):void
	{
		//TODO.
	}
	
	function excuteMigrate()
	{
		var account:String = emaileInut.txt;
		var password:String = passwordInput.txt;
		if(account==null || password==null || account.length ==0 || password.length==0){
			ErrorMgr.instance().PushError("",Datas.getArString("Error.err_1600"));
			return;
		}
		
		var okFunc:Function = function(result:HashObject)
		{
			if (result["ok"].Value) {				
					var popMenu : PopMenuComponent = MenuMgr.getInstance().GetCurMenu() as PopMenuComponent;
				    var migrateMenu : MigrateMenu=popMenu.GetPopMenu() as MigrateMenu;
				    var selectServerId : int=migrateMenu.getSelectServeId();
				    var needItemCount : int=migrateMenu.getNeedItemCount();
					var migrateTime:String = migrateMenu.getMigrateTime() + "";
					
					MenuMgr.getInstance().PopMenu("");
					MenuMgr.getInstance().PushMenu("MigrateConfirmHelp", {"selectServerId": selectServerId, "needItemCount": needItemCount, 
					"migrateTime": migrateTime, "account": account, "password":password}, "trans_zoomComp");
			}
		};
		
		var errorFunc:Function = function(errorMsg:String, errorCode:String)
		{
			ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
		};

		UnityNet.MigrateMailBox(account, password, okFunc, errorFunc);	
	}
	
	private function OnConfirm(param:Object)
	{
	    excuteMigrate();	    
	}
	
	
	function Update()
	{
	}
	
	function DrawItem()
	{
		for(var i:int=0;i<componetList.Count;i++){
			componetList[i].Draw();
		}
	}
	
	function DrawBackground()
	{
		
	}
}