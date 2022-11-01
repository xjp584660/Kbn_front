class SetCityName extends SubMenu
{
	public var btnCreat:Button;
	public var l_name:Label;
	public var cityDesc:Label;
	public var nameTextfiled:TextField;
	public var cityIcon:Label;
	public var line:Label;
	public var citySequence:int;
	public var plainId:int;
	@SerializeField
	private var m_cityAliasName : SimpleLabel;
	function Init(parent:ComposedMenu)
	{
		super.Init(parent);
//		var arStrings:Object = Datas.instance().arStrings();
		btnCreat.txt = Datas.getArString("Common.Create");
		btnCreat.OnClick = BuildCity;
		
		
		title.txt = Datas.getArString("PlayerInfo.AddCityPopCityName");
		l_name.txt = Datas.getArString("PlayerInfo.AddCityPopCityNameDesc");
	}
	
	function OnPush(param:Object)
	{
		citySequence = (param as Hashtable)["city"];
		cityIcon.Background = TextureMgr.instance().loadBuildingTextureFromSprite("f" + citySequence + "_0_4_1");
		plainId =  _Global.INT32((param as Hashtable)["plainId"]);
	//	var arStrings:Object = Datas.instance().arStrings();
		cityDesc.txt = Datas.getArString("PlayerInfo.AddCityPopCityDesc");
		nameTextfiled.ClearField();

		var cityAliasNameKey : String = String.Format("CityName.{0}thCity", citySequence.ToString());
		if ( Datas.IsExistString(cityAliasNameKey) )
			m_cityAliasName.txt = Datas.getArString(cityAliasNameKey);
		else
			m_cityAliasName.txt = "";
	}

	function DrawItem()
	{
		btnBack.Draw();
		line.Draw();
		btnCreat.Draw();
		l_name.Draw();
		nameTextfiled.Draw();
		cityIcon.Draw();
		cityDesc.Draw();
		m_cityAliasName.Draw();
	}
	
	function BuildCity()
	{
		var name:String = nameTextfiled.txt; 
		if (Application.platform == RuntimePlatform.OSXEditor)
		{
 			name = String.Format("City{0}", GameMain.unixtime());
		}
		if (!name || name.length < 3 || name.length > 15) {
			ErrorMgr.instance().PushError("", Datas.getArString("Error.NameNotAllowed"));
			return;
		}
		var curCityId:int = GameMain.instance().getCurCityId();
		UnityNet.BuildCity( curCityId ,plainId,name, citySequence,BuildSuccess , null);
	}
	
	function BuildSuccess(result:Object)
	{
		var restart:Function = function()
		{
			GameMain.instance().restartGame();
		};
	
		var dialogparam:Hashtable = {"MainIcon": "f"+citySequence+"_0_4_1",
							   "DecrateIcon":"light_box",
							   "Msg":Datas.getArString("AdditionalCity.RestartNotif"),
							   "btnTxt":Datas.getArString("AdditionalCity.Restart"),
							   "isShowCloseButton":false,
							   "btnHandler": restart,
							   "responseBackKey":false};				  
		
		var dialog:EventDoneDialog = MenuMgr.getInstance().getEventDoneDialog();
		dialog.extraLabe.image = null;
		dialog.setLayout(590,500);
		dialog.setMsgLayout(50,247,500,120);
		dialog.setIconLayout(160,-40,270,270);
		
		MenuMgr.getInstance().PushEventDoneDialog(dialogparam);
		UpdateSeed.instance().DisableUpdateSeed = true;
		GameMain.instance().CancelUpdateSeed();
		GameMain.instance().RestartGameLater(5.0f); // restart game in 5 seconds
//		
//		ErrorMgr.instance().PushError("",Datas.getArString("AdditionalCity.RestartNotif"), false, Datas.getArString("AdditionalCity.Restart"), restart);
	}
}
