class About extends SubMenu
{
	public var gameTitle:Label;
	public var version:Label;
	public var btnPolicy:Button;
	public var btnService:Button;
	public var logo:Label; // abandoned
	public var copyRight:Label;
	public var IGP1:Button;
	public var IGP2:Button;
	public var backLabel2:Label;
	
	function Init(parent:ComposedMenu)
	{
		super.Init(parent);
//		var arStrings:Object = Datas.instance().arStrings();
		title.txt = Datas.getArString("Settings.About");
		version.txt = Datas.getArString("Settings.Version") + " " + BuildSetting.CLIENT_VERSION;
		btnPolicy.txt = Datas.getArString("Settings.PrivacyPolicy") ;
		btnService.txt = Datas.getArString("Settings.Service") ;
		copyRight.txt = Datas.getArString("Settings.Copyright") + " " +Datas.getArString("Settings.CopyrightYear");
		btnPolicy.OnClick = function(param:Object)
		{
			//var url:String = GameMain.instance().getSeed()["staticUrl"]["privacyPolicy"].Value;
			var url: String = "https://decagames.com/privacy.html";
			Application.OpenURL(url); 
		};
		
		btnService.OnClick = function(param:Object)
		{
			//var url:String = GameMain.instance().getSeed()["staticUrl"]["servicTerms"].Value;
			var url: String = "https://decagames.com/tos.html";
			Application.OpenURL(url); 
		};
		
		//gameTitle.useTile = true;
		//gameTitle.drawTileByGraphics = true;
		//gameTitle.tile.spt = TextureMgr.instance().ItemSpt(); 
		//gameTitle.tile.name = "logo_ti2";
//		gameTitle.useTile = false;
//		gameTitle.mystyle.normal.background = TextureMgr.instance().LoadTexture("logo_ti2", TextureType.ICON_ELSE);
		
		var	data:Datas = Datas.instance();
		var texMgr : TextureMgr = TextureMgr.instance();
		var logoIcon:Texture2D = texMgr.LoadTexture("gamelogo_" + data.getGameLanguageAb(), TextureType.LOAD);
		if( logoIcon == null ){
			logoIcon = texMgr.LoadTexture("gamelogo_en", TextureType.LOAD);
		}
		
		gameTitle.mystyle.normal.background = logoIcon;
		
//		logo.useTile = true;
//		logo.drawTileByGraphics = true;
//		logo.tile = TextureMgr.instance().BackgroundSpt().GetTile("about_kabam-logo"); 
	}
	
	function DrawItem()
	{
		title.Draw();
		btnBack.Draw();
		backLabel2.Draw();
		btnBack.Draw();
		gameTitle.Draw();
		version.Draw();
		btnPolicy.Draw();
		btnService.Draw();
//		logo.Draw();
		copyRight.Draw();
	}
	
	//function 
	
	function OnPush(param:Object)
	{
		
	}
	
	function DrawBackground()
	{
	}

}

