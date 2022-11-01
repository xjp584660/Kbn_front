class ChooseLanguage extends SubMenu implements IEventHandler
{
	class Lang
    {
    	var type:int;
    	var name:String;
    	var selected:boolean;
    };
    /**
    enum GameLaguage
    {
    	EN,
    	FR,
    	IT,
    	DE,
    	SP,
    	TR,
    	SV,
    	NL,
    	DA,
    	RU,
    	PL,
    	PT,
    	CNT
    }
    **/
	private var selectedLang:Lang;
	
	public  var langList:ScrollList;
	private var langData:Array;
	
	public  var btnSelect:Button;
	public  var langTemplate:LanguageItem;
	
	private var m_bIsNeedRestart : boolean;
	
	public var langHash:Hashtable = {};
	public var topMask:SimpleLabel;
	public var bottomMask:SimpleLabel;
	
	function Init(parent:ComposedMenu)
	{
		super.Init(parent);
		langList.itemDelegate = this;
		langData = new Array();
		langList.Init( langTemplate );
		InitLangData();
		btnSelect.OnClick = SetLang;
		btnSelect.txt = Datas.getArString("Common.OK_Button");
		title.txt = Datas.getArString("Settings.Language");
		/**
		var type:int = SystemLanguage.English;
		langHash[_Global.ap + type] = GameLaguage.EN;
		type = SystemLanguage.French;
		langHash[_Global.ap + type] = GameLaguage.FR;
		type = SystemLanguage.German;
		langHash[_Global.ap + type] = GameLaguage.DE;
		type = SystemLanguage.Italian;
		langHash[_Global.ap + type] = GameLaguage.IT;
		type = SystemLanguage.Spanish;
		langHash[_Global.ap + type] = GameLaguage.SP;	
		type = SystemLanguage.Turkish;
		langHash[_Global.ap + type] = GameLaguage.TR;
		type = SystemLanguage.Swedish;
		langHash[_Global.ap + type] = GameLaguage.SV;	
		type = SystemLanguage.Dutch; 
		langHash[_Global.ap + type] = GameLaguage.NL;	
		type = SystemLanguage.Danish;
		langHash[_Global.ap + type] = GameLaguage.DA;
		type = SystemLanguage.Russian; 
		langHash[_Global.ap + type] = GameLaguage.RU;	
		type = SystemLanguage.Polish;
		langHash[_Global.ap + type] = GameLaguage.PL;	
		type = SystemLanguage.Portuguese;
		langHash[_Global.ap + type] = GameLaguage.PT;	
		**/
		m_bIsNeedRestart = false;
		
		if(topMask.mystyle.normal.background == null)
		{
			topMask.mystyle.normal.background = TextureMgr.instance().LoadTexture("Mask_Lightcolor",TextureType.GEAR);
		}
		if(bottomMask.mystyle.normal.background == null)
		{
			bottomMask.mystyle.normal.background = TextureMgr.instance().LoadTexture("Mask_Lightcolor",TextureType.GEAR);
		}
	}
	
	function DrawItem()
	{
		langList.Draw();
		topMask.Draw();
		bottomMask.Draw();
		title.Draw();
		btnBack.Draw();
		btnSelect.Draw();
	}
	

	function DrawBackground()
	{
	}
	
	function OnPush(param:Object)
	{
		if(selectedLang)
			selectedLang.selected = false;
		//var curLang:int = langHash[_Global.ap + Datas.instance().getGameLanguage()];	
		selectedLang = getLang(Datas.instance().getGameLanguage());	//langData[curLang];
		selectedLang.selected = true;
		
		langList.SetData(langData);
	}
	
	public	function	OnPopOver(){
		langList.Clear();
		if ( m_bIsNeedRestart && GameMain.instance())
			GameMain.instance().restartGame();
	}
	
	public function handleItemAction(action:String,param:Object):void
	{
			switch(action)
			{
			case Constant.Action.PROVINCE_SELECT:
				if(selectedLang)
					selectedLang.selected = false;
				selectedLang = param;
				selectedLang.selected = true;	
			}	
	}
	
	function InitLangData()
	{
		/**
		var provinceKeys:Array = _Global.GetObjectKeys(Datas.instance().provinceNames());
	//	var arString:Object = Datas.instance().arStrings();
		for(var i:int = 0; i<GameLaguage.CNT; i++ )
		{
			var lang:Lang = new Lang();
			lang.type = i;
			lang.name = GetLanguageName(i);
			langData.Push(lang);
		}
		**/
		var clLangNull:ChooseLanguage.Lang = new ChooseLanguage.Lang();
		clLangNull.type = -1;
		clLangNull.name = "";
		langData.Push(clLangNull);
		
		var list:Array = LocaleUtil.getInstance().getLangList();
		var luLang:LocaleUtil.SysLang;
		var clLang:ChooseLanguage.Lang;
		
		for(luLang in list)
		{
			clLang = new ChooseLanguage.Lang();
			
			clLang.type = luLang.id;
			clLang.name = Datas.getArString("Language." + luLang.strKey);
			//GetLanguageName(luLang.id);
			langData.Push(clLang);
		}
		langData.Push(clLangNull);
	}
	function getLang(type:int):Lang
	{
		for(var lang:Lang in langData)
		{
			if(lang.type == type)
				return lang;
		}
		return langData[1];//if not found, set it as default English..
	}
	function SetLang(param:Object)
	{	
	 	var lang:int = selectedLang.type;
	 	/**
	 	switch(selectedLang.type)
	 	{
	 	case GameLaguage.EN:
	 		lang = SystemLanguage.English;
	 		break;
	 	case GameLaguage.FR:
	 		lang = SystemLanguage.French;
	 		break;
	 	case GameLaguage.IT:
	 		lang = SystemLanguage.Italian;
	 		break;
	 	case GameLaguage.DE:
	 		lang = SystemLanguage.German;
	 		break;
	 	case GameLaguage.SP:
	 		lang = SystemLanguage.Spanish;
	 		break;
	 	case GameLaguage.TR:
	 		lang = SystemLanguage.Turkish;
	 		break;
	 	case GameLaguage.SV:
	 		lang = SystemLanguage.Swedish;
	 		break;
	 	case GameLaguage.NL:
	 		lang = SystemLanguage.Dutch;
	 		break;
	 	case GameLaguage.DA:
	 		lang = SystemLanguage.Danish;
	 		break;	
	 	case GameLaguage.RU:
	 		lang = SystemLanguage.Russian;
	 		break;	
	 	case GameLaguage.PL:
	 		lang = SystemLanguage.Polish;
	 		break;	
	 	case GameLaguage.PT:
	 		lang = SystemLanguage.Portuguese;
	 		break;					
	 	default:
	 		lang = SystemLanguage.English;			
	 	}
	 	**/
	 	if( Datas.instance().getGameLanguage() != lang ){
	 	
	 		DefaultBack(null);
	 	
	 		Datas.instance().setGameLanguage(lang);
	 		m_bIsNeedRestart = true;
	 	}
	}
	/*
	private function GetLanguageName(type:int):String
	{
		//return LocaleUtil.getInstance().getLangKey(type);
		 
		switch(type)
	 	{
	 	case GameLaguage.EN:
	 		return Datas.getArString("Language.English");
	 	case GameLaguage.FR:
	 		return Datas.getArString("Language.French");
	 	case GameLaguage.IT:
	 		return Datas.getArString("Language.Italian");
	 	case GameLaguage.DE:
	 		return Datas.getArString("Language.German");
	 	case GameLaguage.SP:
	 		return Datas.getArString("Language.Spanish");
	 	case GameLaguage.TR:
	 		return Datas.getArString("Language.Turkish");
	 	case GameLaguage.SV:
	 		return Datas.getArString("Language.Swedish");
	 	case GameLaguage.NL:
	 		return Datas.getArString("Language.Dutch");
	 	case GameLaguage.DA:
	 		return Datas.getArString("Language.Danish");
	 	case GameLaguage.RU:
	 		return Datas.getArString("Language.Russian");
	 	case GameLaguage.PL:
	 		return Datas.getArString("Language.Polish");
	 	case GameLaguage.PT:	
	 		return Datas.getArString("Language.Br_Portuguese");
	 	default:
	 		return Datas.getArString("Language.English");		
	 	}
	 	
	}
	*/
	function Update()
	{
		langList.Update();
	}

}

