class Linker extends Button
{
	private var linkerType:String;
	private var InnerClick:Function;
	private var url:String  = "";
	
	function Init()
	{
		super.Init();
	}
	
	public function setUrlLinker(_txt:String, _url:String):void
	{
		linkerType = Constant.LinkerType.URL;
		txt = _txt;
		url = _url;
		InnerClick = OpenURL;
		
		autoSize();
	}
	
	public function autoSize():void
	{
//		 FontMgr.SetStyleFont(mystyle, font,FontType.TREBUC);
		var _size:Vector2 = mystyle.CalcSize(GUIContent(txt));
		rect = Rect(rect.x, rect.y, _size.x + 30, _size.y + 50);
	}
	
	public function setInnerLinker(_txt:String, _linkerType:String):void
	{
		linkerType = _linkerType;
		txt = _txt;
	
		switch(linkerType)
		{
			case Constant.LinkerType.SHOP:
				InnerClick = OpenShop;
				break;
			case Constant.LinkerType.INVENTORY:
				InnerClick = OpenInventory;
				break;
			case Constant.LinkerType.ALLIANCE:
				InnerClick = OpenAlliance;
				break;
			case Constant.LinkerType.QUEST:
				InnerClick = OpenQuest;
				break;
			case Constant.LinkerType.GET_GEMS:
				InnerClick = OpenGetGems;
				break;
			case Constant.LinkerType.KABAM_ID:
				InnerClick = OpenKabamId;
				break;				
			case Constant.LinkerType.HELP:
				InnerClick = OpenHelp;	
				break;
			case Constant.LinkerType.ROUNDTOWER:
				InnerClick = OpenRoundTower;
				break;
			case Constant.LinkerType.SURVEYOPENHELP:
				InnerClick = OpenSurveyHelp;	
				break;
			case Constant.LinkerType.EVENTVENTER:
				InnerClick = OpenEventCenter;	
				break;
			case Constant.LinkerType.SERVERMERGE:
				InnerClick = OpenServerMerge;	
				break;				
		}
		
		autoSize();
	}

	private static function OpenShop():void
	{
		var object:Object = {"selectedTab":0};
		MenuMgr.getInstance().PushMenu("InventoryMenu", object);
	}

	private static function priv_openInventoryMenuWithParam(param : String) : void
	{
		try
		{
			var datTable : Hashtable = null;
			if ( !String.IsNullOrEmpty(param) )
			{
				if ( param[0] == "{" )
				{
					var hoParam : HashObject = JSONParse.ParseStatic(param);
					datTable = hoParam.Table;
				}
				else
				{
					//	"0:3:271"
					var params : String[] = param.Split(":"[0]);
					var hoNewParam : HashObject = new HashObject();
					if ( params.Length > 0 )
						hoNewParam["selectedTab"] = new HashObject(_Global.INT32(params[0]));
					if ( params.Length > 1 )
						hoNewParam["selectedList"] = new HashObject(_Global.INT32(params[1]));
					if ( params.Length > 2 )
						hoNewParam["selectedItem"] = new HashObject(_Global.INT32(params[2]));
					datTable = hoNewParam.Table;
				}
			}

			MenuMgr.getInstance().PushMenu("InventoryMenu", datTable);
		}
		catch(e : System.Exception)
		{
			MenuMgr.getInstance().PushMenu("InventoryMenu", null);
		}
	}

	private static function OpenRoundTower():void
	{
		var cityId:int = GameMain.instance().getCurCityId();
				
		if(Building.instance().hasBuildingbyType(cityId, Constant.Building.MUSEUM))
    	{
	    	var	slotId:int = Building.instance().getPositionForType(Constant.Building.MUSEUM);
	    	var buildingInfor:Building.BuildingInfo = Building.instance().buildingInfo(slotId , Constant.Building.MUSEUM);
	    	
	    	var hash:HashObject = new HashObject({"toolbarIndex":2, "infor":buildingInfor});
	    	MenuMgr.getInstance().PushMenu("MuseumBuilding", hash);    	
    	}
    	else
    	{
    		ErrorMgr.instance().PushError("",Datas.getArString("MessagesModal.BuildMuseum"));
    	}
	}
	
	private static function OpenSurveyHelp():void
	{
		var cityId:int = GameMain.instance().getCurCityId();
    	var buildingInfor:Building.BuildingInfo = Building.instance().buildingInfo(0 , Constant.Building.PALACE);	    	
    	var hash:HashObject = new HashObject({"toolbarIndex":2, "infor":buildingInfor});
    	MenuMgr.getInstance().PushMenu("NewCastleMenu", hash); 
	}
	
	private static function OpenServerMerge():void
	{
		if(GameMain.singleton.IsServerMergeOpened())
		{
			KBN.MergeServerManager.getInstance().RequestAllServerMergeMsg();
		}
	}
	
	private static function OpenEventCenter():void
	{
		EventCenter.getInstance().reqGetEventList(OpenEventCenterMenu);
	}
	
	private static function OpenEventCenterMenu():void
	{
		MenuMgr.getInstance().PushMenu("EventCenterMenu", null);
	}
	
	private static function OpenInventory():void
	{
		var object:Object = {"selectedTab":1};
		MenuMgr.getInstance().PushMenu("InventoryMenu", object);
	}
	
	private static function OpenAlliance():void
	{
		MenuMgr.getInstance().MainChrom.openAlliance(null);
	}
	
	private static function OpenQuest():void
	{
		MenuMgr.getInstance().MainChrom.OpenMission();
	}

	private static function OpenGetGems():void
	{
		MenuMgr.getInstance().MainChrom.OpenPayment();
	}		
	
	private static function OpenKabamId():void
	{
        MenuAccessor.OpenKabamId();
	}
	
	private static function OpenHelp():void
	{
        MenuAccessor.OpenHelp();
	}
	
	private static function OpenShare():void
	{
		MenuMgr.getInstance().MainChrom.OpenShare();
	}
    
        
    private static function OpenCityView() : void
    {
        GameMain.instance().loadLevel(GameMain.CITY_SCENCE_LEVEL);
    }
    
    private static function OpenFieldView() : void
    {
        GameMain.instance().loadLevel(GameMain.FIELD_SCENCE_LEVEL);
    }
    
    private static function OpenAVAMinimap() : void
    {
    	GameMain.Ava.Seed.RequestAvaSeed();
    }
    
    private static function OpenWorldView() : void
    {
        GameMain.instance().loadLevel(GameMain.WORLD_SCENCE_LEVEL);
    }
    
    private static function OpenTraining() : void
    {
        MenuMgr.getInstance().MainChrom.OpenBarrack(null);
    }
    
    private static function OpenHeroHouse() : void
    {
    	GameMain.instance().OpenHero();
    }
    
    private static function OpenCampaign() : void
    {
        MenuMgr.getInstance().MainChrom.GotoCampaignScene(null);
    }
    
    private static function OpenGamble() : void
    {
        MenuMgr.getInstance().PushMenu("GambleMenu", null);
    }
    
    public static function OpenPremiumGamble() : void
    {
    	MenuMgr.getInstance().PushMenu("GambleMenu", { "premium" : 1 });
    }

    private static function OpenChat(param : String) : void
    {
        var chatMenuName = "ChatMenu";
        var paramDict : Hashtable = null;
        if (!String.IsNullOrEmpty(param))
        {
            paramDict = new Hashtable();
            paramDict.Add("tabName", param);
        }

        MenuMgr.getInstance().PushMenu(chatMenuName, paramDict);
    }
    
    private static function OpenHealing() : void
    {
        if (Building.instance().getMaxLevelForType(Constant.Building.HOSPITAL) <= 0)
        {
            ErrorMgr.instance().PushError("", Datas.getArString("DailyQuest.NoHospitalTips"));
            return;
        }

        // Hotfix before release 17.4. TODO: Better the code.
        for (var c : DictionaryEntry in GameMain.instance().getSeed()["cities"].Table)
        {
            var cityInfo : HashObject = c.Value;
            var cityId : int = _Global.INT32(cityInfo[_Global.ap + 0]);
            if (Building.instance().getMaxLevelForType(Constant.Building.HOSPITAL, cityId) > 0)
            {
                MenuMgr.getInstance().PushMenu("HospitalHealPopMenu", cityId, "trans_zoomComp");
                break;
            }
        }
    }
    
    private static function OpenBlacksmith(param : String) : void
    {
        var slotId : int = Building.instance().getPositionForType(Constant.Building.BLACKSMITH);
        if (slotId < 0)
        {
            ErrorMgr.instance().PushError("", Datas.getArString("DailyQuest.NoBlacksmithTips"));
            return;
        }
        
        var pushParam : Hashtable = new Hashtable();
        pushParam.Add("buildingInfo", Building.instance().buildingInfo(slotId, Constant.Building.BLACKSMITH));
        pushParam.Add("tabName", param);
        
        MenuMgr.getInstance().PushMenu("BlackSmithMenu", pushParam);
    }
    
	private function OpenURL():void
	{
		if(url != "")
		{
			Application.OpenURL(url);
		}
	}
	
	public static function DefaultActionHandler(operationType:String):void
	{
		DefaultActionHandler(operationType, null);
	}

	public static function DefaultActionHandler(operationType:String, param:String):void
	{
		switch(operationType)
		{
			case Constant.LinkerType.URL:
				if ( !String.IsNullOrEmpty(param) )
					Application.OpenURL(param);
				break;
			case Constant.LinkerType.INVENTORY_MENU:
				priv_openInventoryMenuWithParam(param);
				break;
			case Constant.LinkerType.OFFER:
				MenuAccessor.OpenUniversalOffer();
				break;
			case Constant.LinkerType.SHOP:
				OpenShop();
				break;
			case Constant.LinkerType.INVENTORY:
				OpenInventory();
				break;
			case Constant.LinkerType.ALLIANCE:
				OpenAlliance();
				break;
			case Constant.LinkerType.QUEST:
				OpenQuest();
				break;
			case Constant.LinkerType.GET_GEMS:
				OpenGetGems();
				break;
			case Constant.LinkerType.KABAM_ID:
				OpenKabamId();
				break;
			case Constant.LinkerType.HELP:
				OpenHelp();
				break;
			case Constant.LinkerType.SHARE:
				OpenShare();
				break;
			case Constant.LinkerType.ROUNDTOWER:
				OpenRoundTower();	
				break;
			case Constant.LinkerType.SURVEYOPENHELP:
				OpenSurveyHelp();	
				break;
			case Constant.LinkerType.EVENTVENTER:
				OpenEventCenter();	
				break;
			case Constant.LinkerType.SERVERMERGE:
				OpenServerMerge();	
				break;
            case Constant.LinkerType.CITY:
                OpenCityView();
                break;
            case Constant.LinkerType.FIELD:
                OpenFieldView();
                break;
            case Constant.LinkerType.AVA_MINIMAP:
            	OpenAVAMinimap();
            	break;
            case Constant.LinkerType.WORLD:
                OpenWorldView();
                break;
            case Constant.LinkerType.TRAINING:
                OpenTraining();
                break;
            case Constant.LinkerType.HERO_HOUSE:
                OpenHeroHouse();
                break;
            case Constant.LinkerType.PVE:
                OpenCampaign();
                break;
            case Constant.LinkerType.GAMBLE:
                OpenGamble();
                break;
            case Constant.LinkerType.PREMIUM_GAMBLE:
                OpenPremiumGamble();
                break;
            case Constant.LinkerType.BLACKSMITH:
                OpenBlacksmith(param);
                break;
            case Constant.LinkerType.HEAL:
                OpenHealing();
                break;
            case Constant.LinkerType.CHAT:
                OpenChat(param);
                break;    	
            default: break;
		}
	}

	public function Click():int
	{
		SoundMgr.instance().PlayEffect("on_tap", /*TextureType.AUDIO*/"Audio/");

		if(m_onClick != null)
		{
			Click(clickParam);
		}
		else if(InnerClick != null)
		{
			InnerClick();
		}
		
		return -1;
	}
}
