class KabamId extends SubMenu
{
	public var logo:Label;
	public var advertise:Label;
	public var post:Label;
	public var creat:SettingItem;
	public var manageId:SettingItem;
	public var backLabel:Label;	
	public var line:SimpleLabel;
	public var kabamDesc:Label;
	public var bonus1:Label;
	public var bonus2:Label;
	public var bonus3:Label;
	public var gem:SimpleLabel;
	public var btnContinue:Button;
	public static var BIPosition:int;
	private var canCreat:boolean;
	 
	function Init(parent:ComposedMenu)
	{
		super.Init(parent);
		
		// Manual size them
		creat.ManualSized = true;
		manageId.ManualSized = true;
		
		creat.Init();
		manageId.Init();
		
		//creat.line.rect = Rect(6, creat.rect.height - 9, creat.rect.width - 6, 9);
		creat.SetClickFunc(CreatId);
		manageId.SetClickFunc(Login);
		manageId.line.SetVisible(false);
		var arStrings:Datas = Datas.instance();
		kabamDesc.txt = Datas.getArString("Settings.KabamDesc");
		advertise.txt = Datas.getArString("Settings.SigneBenefit");
		creat.title.txt  = Datas.getArString("Settings.CreatId");
		manageId.title.txt  = Datas.getArString("Settings.IHaveID");
		bonus1.txt = Datas.getArString("Settings.Register_Benefit1");
		bonus2.txt = Datas.getArString("Settings.Register_Benefit2");
		bonus3.txt = Datas.getArString("Settings.Register_Benefit3");
		gem.tile = TextureMgr.instance().BackgroundSpt().GetTile("ad_gems");
		gem.useTile = true;
		//gem.name = "ad_gems";
		btnContinue.txt = Datas.getArString("Settings.ContinueAsGuest");
		btnContinue.OnClick = function()
		{
			MenuMgr.getInstance().PopMenu("");
			UnityNet.SendKabamBI(KabamId.BIPosition, 1);
		};
	}
	
	function DrawItem()
	{
		logo.Draw();
		backLabel.Draw();
		kabamDesc.Draw();
		
		line.Draw();
		advertise.Draw();
		bonus1.Draw();
		bonus2.Draw();
		bonus3.Draw();
		post.Draw();
		if(canCreat)
			creat.Draw();
		manageId.Draw();
		btnBack.Draw();
		gem.Draw();
		btnContinue.Draw();
	}
	
	function CreatId(param:Object)
	{
		var setting:PlayerSetting = m_parent as PlayerSetting;
		m_parent.PushSubMenu(setting.creatKabamIdMenu, param);
		UnityNet.SendKabamBI(KabamId.BIPosition, 3);
	}
	
	function Login(param:Object)
	{
		var setting:PlayerSetting = m_parent as PlayerSetting;
		var kabamId:long = Datas.instance().getKabamId();
		m_parent.PushSubMenu(setting.login, param);
		UnityNet.SendKabamBI(KabamId.BIPosition, 4);

	}
	
	function OnPush(param:Object)
	{
		canCreat = (0 == Datas.instance().getKabamId());
		if(param)
		{
			btnContinue.SetVisible(true);
			btnBack.SetVisible(false);
		}
		else
		{
			btnContinue.SetVisible(false);
			btnBack.SetVisible(true);
		}
	}
	
	function Update()
	{
		canCreat = (0 == Datas.instance().getKabamId());
	}
	
	function DrawBackground()
	{
	}
	
	function DefaultBack(parram:Object)
	{
		UnityNet.SendKabamBI(KabamId.BIPosition, 5);
		m_parent.PopSubMenu();
	}
}

