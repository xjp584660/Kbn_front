

class MainChrom extends KBNMenu{
	@Space(30) @Header("---------- MainChrom ----------") 

	public var coordinateBar:CoordinateBar;

	public var  topBar:Tile;
	/*public var  bottomBar:Tile;*/
	
	public var  selectedBtnTexture:Texture2D;
	public var  normalBtnTexture:Texture2D;
	public var  upTexture:Texture2D;
	public var  downBtnTexture:Texture2D;

	public var  btnBuildQueue:Button;
	public var  btnShowList:Button;
	public var  buffObj:BuffIcon;

	@SerializeField
	private var worldMapBuff:WorldMapBuff;

    public var btnDailyLogin:Button;
    private var btnDailyLoginElem:IUIElement;
    @SerializeField
    private var btnDailyLoginAnimParam : String;

    private var buffObjElem : IUIElement;

    private var dailyLoginRedDot : SimpleLabel = new SimpleLabel();
    private var dailyLoginRedDotElem : IUIElement;
     private var offerRefreshTimmer:float=0;
    @Serializable
    private class DailyLoginRedDotConfig
    {
       @SerializeField
       private var xRelativeOffset : float;

       public function get XRelativeOffset() : float
       {
           return xRelativeOffset;
       }

       @SerializeField
       private var yRelativeOffset : float;

       public function get YRelativeOffset() : float
       {
           return yRelativeOffset;
       }

       @SerializeField
       private var relativeRadius : float;

       public function get RelativeRadius() : float
       {
           return relativeRadius;
       }

       public function DailyLoginRedDotConfig(xRelativeOffset : float, yRelativeOffset : float, relativeRadius : float)
       {
           this.xRelativeOffset = xRelativeOffset;
           this.yRelativeOffset = yRelativeOffset;
           this.relativeRadius = relativeRadius;
       }
    }
     
    /*@SerializeField*/
    private var dailyLoginRedDotConfig : DailyLoginRedDotConfig;

	public var 	btnWheelGame : Button;
	public var	lbWheelGameLessTime : SimpleLabel;

	public var btnStatePopup: Button;
	public var btnThirdPartyPayment: Button;
	public var btnMistExpedition: Button;
	public var btnSeasonPass : Button;
	public var labelSeasonPassTimer : Label;
	public var  btnBeginner:Button;
	public var  labelBeginnerTimer:Label;
	private var beginnerTimeEnd:long;

    public var btnUniversalOffer:Button;
    public var labelOfferTimer:Label;
	private var OfferTimeEnd:long;

	public var 	btnEventCenter:Button;
	public var  btnSaleIcon:SaleIconItem;
	public var  btnSwitchView:Button;
	public var  btnChat:Button;
	/*public var  btnOverView:Button;*/
	public var  btnMoney:Button;
	public var  btnSODA:Button;
	public var  btnTrain:Button;
	public var  btnMarch:Button;
	public var  btnExplore:Button;
	/*public var  btnBoost:Button;*/
	public var  btnRes:Button;
	public var  btnHome:Button;
	public var  btnCities:Button;
	
	/*layout need these, though no ref in code*/
	public var  btnMissionHead:Button;
	public var  btnMissionMessage:Button;
	public var  btnMissionClaim:Button;
	public var  btnMissionDetail:Button;
	public var  missionArrow:Label;
	public var  missionRedDot:Label;
	public var  missionBalloon:MissionBalloon;

	public var redColor:Color;
	public var blackColor:Color;

	public var  cityBar:ToolBar;
	public var  progressSlot:ProgressSlot;

	public var  buildSlot:ProgressSlot;
	public var  researchSlot:ProgressSlot;
	public var  trainSlot:ProgressSlot;
	public var  wallTrainSlot:ProgressSlot;
	public var  marchSlots:ProgressSlot[];
	public var  wildernessSlots:ProgressSlot[];
	public var  buidingList:ProgressList;
	public var  trainList:ProgressList;
	public var  marchList:ProgressList;
	public var  exploreList:ProgressList;
	public var  chatText:SimpleButton;
	public var  chatText1:Label;
	public var  chatText2:Label;
	public var 	chatIcon1:Label;
	public var 	chatIcon2:Label;
	public var  money:Label;
	public var 	gemIcon:Label;

	public var textureMonster:Texture2D;
	public var TextureGlobal:Texture2D;
	public var TextureAlliance:Texture2D;
	public var TextureWhisper:Texture2D;

	public var  userName:Label;
	//public var  level:Label;
	public var  might:Label;
	public var  crown:Label;
	public var  food:Label;
	public var  gold:Label;
	public var  lumber:Label;
	public var  stone:Label;
	public var  carmot:Label;
	public var  steel:Label;
	public var  citycoord:Label;
	public var  cityName:Label;
	public var  time:Label;
	public var  timeLeft:Label;
	public var  xpBar:PercentBar;
	public var  cityBack:Label;
	public var  l_city:Label;
	public var  citiesNoteBack:Label;
	public var  citiesNote:Label;
//	public var  test:Label;
	private var curProgressList:ProgressList;
//	public var	btnProgress:ToolBar;
//	private var curProgress:int;
//	private var  curProgressState:int = 0;//0 hide, 1 tow slot, 2 show all
	public var  topOfferType:int;

	public var resourceBg:Label;
	public var resourceCom:ComposedUIObj;

	private var  flashTime:float;
	private var flashTimeVip:float;
	private var  bHightlight:boolean;
	private var goldBase:long;
	private var foodBase:long;
	private var lumberBase:long;
	private var ironBase:long;
	private var stoneBase:long;
	private var vipOpenSituation:int; // -1 - unknown, 0 - not open, 1 - opened

	private var foodPro:float;
	private var lumberPro:float;
	private var ironPro:float;
	private var stonePro:float;
	private var tax:float;

	public  var trainNote:NotifyBug;
	public  var buildNote:NotifyBug;
	public  var marchNote:NotifyBug;
	public  var exploreNote:NotifyBug;

	public var topBg:Label;

	public	var chromBtnQuest		:ChromeButtonObj;
	public	var chromBtnHeroRelic	:ChromeButtonObj;
	public	var chromBtnMail		:ChromeButtonObj;
	public 	var chromBtnGamble		:ChromeButtonObj;
	public	var chromBtnAlliance	:ChromeButtonObj;
	public	var chromBtnShop		:ChromeButtonObj;
	public	var chromBtnSetting		:ChromeButtonObj;
	public	var chromBtnResearch	:ChromeButtonObj;
	public	var chromBtnTrain		:ChromeButtonObj;
	public	var chromBtnLeaderBoard	:ChromeButtonObj;
	public	var chromBtnShare		:ChromeButtonObj;
	public	var chromBtnOpenGear	:ChromeButtonObj;

	public	var chromBtnCampaign	:ChromeButtonObj;
	public	var chromBtnLast		:ChromeButtonObj;

	//public	var lblLeft:Label;
	//public	var lblRight:Label;
	//public	var lblSlider:Label;

	public	var chromBtnsScroll:ScrollView;
	public  var trainShortcut:ShortcutSlot;
	public  var researchShortcut:ShortcutSlot;
	public  var tileShortcut:ShortcutSlot;

	//public  var btnTest1:SimpleButton;
	//public  var btnTest2:SimpleButton;

	private var mailCnt:int = 0;

	public var waitingLabel:LoadingLabel;
	public var moveMapLoadingLabel:MoveMapLoadingLabel;
	public var gemsAnimation:GemsAnimation;

	public var noticeRow:Label;
	public var noticeIcon:Label;
	public var noticeButton:Button;
	private var noticeUrgent:Notice;
	private var saleItem:saleNotice;

	public var curSlot1Offer:int = 8;

	private var g_fullScreenMask : Texture;

	public var redBackground:Texture2D;
	public var blueBackground:Texture2D;

	private var m_logicWidth : float;
	private var m_logicHeight : float;

    private var openDailyLoginOnMystryChestLoad : boolean = false;

	protected var  monoBehaviour:MonoBehaviour ;

	public var  btnPopUp:Button;
	public var  btnPopUpLight:FlickerLabel;

	public var iconHider : MainChromeIconHider;
	public var technologyHintClone : GameObject;
	public var technologyHint : TechnologyHint;

	@Space(20) @Header("---------- 是否开启 迷雾远征 活动(仅 Editor 中可使用) ") 
	@SerializeField private var isOpenMistExpedition: boolean = true;
	@Header("---------- 是否开启 三方支付 入口(仅 Editor 中可使用) ") 
	@SerializeField private var isOpenThirdPartyPayment: boolean = true;



	public function ShowTechHint(pos : Vector2) : void
	{
		technologyHint = GameObject.Instantiate(technologyHintClone).GetComponent(TechnologyHint);
		technologyHint.SetLightPos(pos);
	}

	public function DestroyTechHint()
	{
		if(technologyHint != null && technologyHint.gameObject != null)
		{
			GameObject.Destroy(technologyHint.gameObject);
		}
	}

	public function MainChrom()
	{
		m_lastGameViewType = -1;
		m_logicWidth = 640;	//	1536
		m_logicHeight = 960;	//	2048
	}

	public function setNeedResort( needResort : boolean )
	{
		m_needResort = needResort;
	}

    function Init()
	{
    	// WorldBossInfoUIObject.Init();
    	m_stopGambleAnimation = false;
    	m_lastGameViewType = -1;
    	monoBehaviour = GameMain.instance();
    	var texMgr : TextureMgr = TextureMgr.instance();
		//btnRes.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_resource bar_normal", TextureType.BUTTON);
		//btnRes.mystyle.active.background = TextureMgr.instance().LoadTexture("button_resource bar_down", TextureType.BUTTON);

		topOfferType = 8;

		topBg.alphaEnable = true;
		topBg.tile = texMgr.BackgroundSpt().GetTile("chrome_butter_bg");
		//topBg.tile.name = "chrome_butter_bg";
		topBg.useTile = true;
		//topBg.mystyle.normal.background = texMgr.LoadTexture("chrome_butter_bg", TextureType.BACKGROUND);

		labelOfferTimer.mystyle.normal.background = texMgr.LoadTexture("chrome_icon_Countdown", TextureType.BACKGROUND);
    	coordinateBar.Init();
    	chromBtnsScroll.Init();
    	m_scale = 1.0;
//    	btnBuildQueue.txt = "Build";
    	btnBuildQueue.OnClick = ClickBuildQueue;
    	btnTrain.OnClick = ClickTrainQueue;
    	btnMarch.OnClick = ClickMarchQueue;
    	btnExplore.OnClick = ClickExploreQueue;
    	curProgressList = buidingList;
    	btnBuildQueue.mystyle.normal.background = selectedBtnTexture;
    	//gold.txt = "10m";

    	btnEventCenter.OnClick = reqEventCenter;
    	btnEventCenter.SetVisible(false);
    	btnSwitchView.OnClick = SwitchView;
    	btnPopUp.OnClick = OnClickPopUp;
    	btnPopUp.setNorAndActBG("button_chrome_normal","button_chrome_down");
//    	btnSwitchView.hasMultipleNormalBG(true);
    	//isPlayQuestAnimation = false;
    	lastFinishedQuestNum = 0;

    	//resourceCom.component = [food, steel, gold, lumber, stone];
    	resourceCom.Init();

    	chromBtnAlliance.OnClick = openAlliance;
    	chromBtnGamble.OnClick = OpenGamble;
    	chromBtnMail.OnClick = OpenEmail;
    	chromBtnCampaign.OnClick = GotoCampaignScene;
    	chromBtnQuest.OnClick = OpenMission;
    	chromBtnShop.OnClick = OpenShop;
    	chromBtnResearch.OnClick = OpenAcademy;
    	chromBtnTrain.OnClick = OpenBarrack;
    	chromBtnSetting.OnClick = OpenSetting;
    	chromBtnLeaderBoard.OnClick = OpenLeaderBoard;
    	chromBtnShare.OnClick = OpenShare;
		chromBtnOpenGear.OnClick = OpenGear;
		chromBtnHeroRelic.OnClick = OpenHeroRelic;
    	chromBtnLast.OnClick = null;

    	btnRes.OnClick = OpenResourceMenu;
    	btnHome.OnClick = OpenPlayerInfo;
    	btnMoney.OnClick = OpenPayment;
    	btnSODA.OnClick = OpenSODA;
    	btnChat.OnClick = OpenChat;
    	btnChat.setNorAndActBG("button_chat_normal","button_chat_down");
		btnShowList.OnClick = ClickShowList;
		btnWheelGame.OnClick = OpenWheelMenu;
		missionBalloon.Init();

		btnMoney.SetFont(FontSize.Font_18,FontType.GEORGIAB);

		buidingList.Init();
		buidingList.OnProgressListRemove = priv_onProgressListChanged;
		trainList.Init();
		trainList.OnProgressListRemove = priv_onProgressListChanged;
		marchList.Init();
		marchList.OnProgressListRemove = priv_onProgressListChanged;
		exploreList.Init();
		exploreList.OnProgressListRemove = priv_onProgressListChanged;

		buffObj.Init();
		worldMapBuff.Init();

		chatText1.Init();
		chatText2.Init();
		chatIcon1.Init();
		chatIcon2.Init();

		chatText.alpha = 0.8;
		chatText.mystyle.normal.background = texMgr.LoadTexture("square_black", TextureType.BACKGROUND);
		chatText.OnClick = OpenChat;

		chatText1.txt = "";
		chatText2.txt = "";
		chatIcon1.mystyle.normal.background = null;
		chatIcon2.mystyle.normal.background = null;

		if ( _Global.IsLargeResolution() )
		{
			waitingLabel.rect = new Rect(0,0,256, 256);
			//moveMapLoadingLabel.rect = new Rect(0,0,256, 256);

			marchList.rect = Rect(0, 0, 933, 0);
			exploreList.rect = Rect(0, 0, 865, 0);
			trainList.rect = Rect(0, 0, 865, 0);
			buidingList.rect = Rect(0, 0, 865, 0);
			researchShortcut.rect = Rect(0, 0, 865, 67);
			tileShortcut.rect = Rect(0, 0, 865, 67);
			trainShortcut.rect = Rect(0, 0, 865, 67);

			trainShortcut.description.SetFont(FontSize.Font_25);
			trainShortcut.btnSelect.SetFont(FontSize.Font_32);

			researchShortcut.description.SetFont(FontSize.Font_25);
			researchShortcut.btnSelect.SetFont(FontSize.Font_32);

			tileShortcut.description.SetFont(FontSize.Font_25);
			tileShortcut.btnSelect.SetFont(FontSize.Font_32);
			crown.mystyle.normal.background = null;
		}
		else
		{
			waitingLabel.rect = new Rect(0,0,128, 128);
			//moveMapLoadingLabel.rect = new Rect(0,0,128, 128);

			marchList.rect = Rect(150, 783, 545, 0);
			exploreList.rect = Rect(150, 783, 490, 0);
			trainList.rect = Rect(150, 783, 490, 0);
			buidingList.rect = Rect(150, 783, 490, 0);
			researchShortcut.rect = Rect(0, 0, 490, 57);
			tileShortcut.rect = Rect(0, 0, 490, 57);
			trainShortcut.rect = Rect(0, 0, 490, 57);

			trainShortcut.description.SetFont(FontSize.Font_BEGIN);
			trainShortcut.btnSelect.SetFont(FontSize.Font_20);

			researchShortcut.description.SetFont(FontSize.Font_BEGIN);
			researchShortcut.btnSelect.SetFont(FontSize.Font_20);

			tileShortcut.description.SetFont(FontSize.Font_BEGIN);
			tileShortcut.btnSelect.SetFont(FontSize.Font_20);
		}
		waitingLabel.Init();
		moveMapLoadingLabel.Init();
		var arString:Datas = Datas.instance();


		btnMoney.Init();
		btnSODA.Init();
		btnMarch.Init();
		btnExplore.Init();
		btnTrain.Init();
		btnBuildQueue.Init();
		// MarchSearchBtn.Init();
		MarchSearchBtn.OnClick=OpenMarchSearchMenu;
		worldbossBtn.OnClick=OpenWorldBossEventMenu;
		worldbossTime.Init();

		// SetWorldBossInfoVis(false,null);
		// MarchSearchBtn.mystyle.normal.background=TextureMgr.instance().LoadTexture("Beginners-Offer_buff",TextureType.DECORATION);

		//btnMoney.txt = arString.getArString("Common.GetMore");
		btnMarch.txt = arString.getArString("Common.March");
		btnExplore.txt = arString.getArString("Common.Wilds");
		btnTrain.txt = arString.getArString("Common.Troops");
		btnBuildQueue.txt = arString.getArString("Common.Building");
//		btnMissionClaim.txt = Datas.getArString("fortuna_gamble.win_claimButton");

	    var seed:HashObject = GameMain.instance().getSeed();

        btnStatePopup.SetVisible(true);
		btnStatePopup.OnClick = OpenStatePopupDialog;


		btnMistExpedition.mystyle.normal.background = TextureMgr.instance().LoadTexture("mistexpedition_btn_icon_enter", TextureType.MISTEXPEDITION);
		btnThirdPartyPayment.mystyle.normal.background = TextureMgr.instance().LoadTexture("thirdpartypayment_btn_icon_enter", TextureType.THIRDPARTYPAYMENT);
		btnMistExpedition.OnClick = OpenMistExpeditionMenu;
		btnThirdPartyPayment.OnClick = OnThirdPartyPaymentBtnClick;

		SetMistExpeditionOpenState();
		SetThirdPartyPaymentOpenState();

		btnSeasonPass.OnClick = OpenPassMissionMenu;

		btnBeginner.SetVisible(false);
		labelBeginnerTimer.SetVisible(false);
		btnBeginner.OnClick = priv_openBeginnerOffer;
        btnUniversalOffer.OnClick = OpenUniversalOffer;

        //offerChange
        var offerCount:int=PaymentOfferManager.Instance.GetOfferListCount();
        if(offerCount>0)
        {
    		btnBeginner.mystyle.normal.background = TextureMgr.instance().LoadTexture("Beginners-Offer_buff1",TextureType.DECORATION);
			btnBeginner.mystyle.active.background =TextureMgr.instance().LoadTexture("Beginners-Offer_buff1",TextureType.DECORATION);
        	btnBeginner.SetVisible(false);
        	labelBeginnerTimer.txt = "";

        	btnUniversalOffer.SetVisible(true);
        	labelOfferTimer.SetVisible(true);
        	labelOfferTimer.txt = Datas.getArString("Common.Special");
        }
        else{
        	btnUniversalOffer.SetVisible(false);
        	labelOfferTimer.SetVisible(false);
    	}

/*offerChange
        var offerData : PaymentOfferData;

        for(var i:int= 1;i<=2;i++)
		{
            offerData = PaymentOfferManager.Instance.GetDataByCategory(i);

            if (offerData != null)
			{
				curSlot1Offer = i;
				beginnerTimeEnd = offerData.EndTime;

//				labelBeginnerTimer.SetVisible(true);
//				btnBeginner.SetVisible(true);
				labelBeginnerTimer.txt = "";
				if(offerData.IsTop)
					topOfferType = i;

                PaymentOfferManager.Instance.UpdateDisplayDataWithData(PaymentOfferManager.DisplayPosition.Upper, i);
				break;
			}
		}

        offerData = PaymentOfferManager.Instance.GetDataByCategory(3);
		if(offerData != null)
		{
			OfferTimeEnd = offerData.EndTime;
//            btnUniversalOffer.SetVisible(true);
//            labelOfferTimer.SetVisible(true);
            labelOfferTimer.txt = "";
			if(offerData.IsTop)
				topOfferType = 3;

            PaymentOfferManager.Instance.UpdateDisplayDataWithData(PaymentOfferManager.DisplayPosition.Lower, 3);
		}
		else
		{
//            btnUniversalOffer.SetVisible(false);
//            labelOfferTimer.SetVisible(false);
//		}*/

        btnDailyLogin.OnClick = OpenDailyLoginRewardMenu;
        btnDailyLogin.txt = arString.getArString("Common.Login");
        StopDailyLoginAnimation();
        dailyLoginRedDotConfig = new DailyLoginRedDotConfig(.85f, .1f, .08f);
        dailyLoginRedDot.mystyle.normal.background = TextureMgr.instance().LoadTexture("RedDot", TextureType.DECORATION);
        UpdateDailyLoginBtnVisibility();

	   	buildNote.rect.x = btnBuildQueue.rect.xMax - buildNote.rect.width;
	    marchNote.rect.x = btnMarch.rect.xMax - marchNote.rect.width;
	    exploreNote.rect.x = btnExplore.rect.xMax - exploreNote.rect.width;
	    trainNote.rect.x = btnTrain.rect.xMax - trainNote.rect.width;

	    researchShortcut.Init();
	    researchShortcut.description.txt = arString.getArString("Common.StartResearch");
	    researchShortcut.btnSelect.txt = arString.getArString("Common.BtnNow");
	    researchShortcut.btnSelect.OnClick = OpenAcademy;

	    tileShortcut.Init();
	    tileShortcut.description.txt = arString.getArString("Common.NoWildRecovering");
	    tileShortcut.btnSelect.txt = arString.getArString("Common.ManageButton");
	    tileShortcut.btnSelect.OnClick = OpenTileManager;

	    trainShortcut.Init();
	    trainShortcut.description.txt = arString.getArString("Common.StartTrain");
	    trainShortcut.btnSelect.txt = arString.getArString("Common.BtnNow");
	    trainShortcut.btnSelect.OnClick = OpenBarrack;


	    money.txt = "";

		//level.txt = "";
		userName.txt = "";
		citycoord.txt = "";
		cityName.txt = "";
		time.txt ="";

		researchShortcut.SetVisible(false);
		trainShortcut.SetVisible(false);
		tileShortcut.SetVisible(false);

		//bottomBar.spt = TextureMgr.instance().BackgroundSpt();
		//bottomBar.rect = new Rect( 0, rect.height -105 , 640, 105);
		//bottomBar.name = "tool bar_bottom";
		topBar = TextureMgr.instance().BackgroundSpt().GetTile("tool bar_bottom");
		//topBar.spt = TextureMgr.instance().BackgroundSpt();
		//topBar.rect = new Rect( 0, 0, 640, 105);

		//mailCnt = _Global.INT32(seed["newMailCount"]) + _Global.INT32(seed["newReportCount"]);

		btnCities.OnClick = OpenCities;

		var nextlvlxp:int = _Global.INT32(seed["xp"]["nextlvlxp"]) + 1;
		xpBar.Init( _Global.INT32(seed["xp"]["xp"]), nextlvlxp );

		cityBack.useTile = true;
		cityBack.drawTileByGraphics = true;
		cityBack.TileSprite= TextureMgr.instance().ElseIconSpt();
		cityBack.TileName = "";
		//cityBack.tile.SetSpriteEdge(0);

		citiesNoteBack.useTile = true;
		citiesNoteBack.drawTileByGraphics = true;
		citiesNoteBack.TileSprite= TextureMgr.instance().ElseIconSpt();

		if(CityQueue.instance().NotifyAttack)
		{
			citiesNoteBack.TileName = "Multi_city_icon";
			citiesNote.Background = TextureMgr.instance().LoadTexture("Warning",TextureType.DECORATION);

			var x:int = citiesNoteBack.Region.x + (citiesNoteBack.Region.width - citiesNote.Background.width/2)/2;
			var y:int = citiesNoteBack.Region.y + (citiesNoteBack.Region.height - citiesNote.Background.height/2)/2;
			var width:int = citiesNote.Background.width/2 ;
			var height:int = citiesNote.Background.height/2;
			citiesNote.Region = new Rect(x,y,width, height);
		}
		else
		{
			citiesNote.SetVisible(false);
			citiesNoteBack.SetVisible(false);
		}

		chromBtnQuest.Init();
		chromBtnMail.Init();
		chromBtnGamble.Init();
		chromBtnAlliance.Init();
		chromBtnShop.Init();
		chromBtnHeroRelic.Init();

		chromBtnLeaderBoard.Init();
		chromBtnResearch.Init();
		chromBtnSetting.Init();
		chromBtnShare.Init();
		chromBtnOpenGear.Init();
		chromBtnTrain.Init();

		chromBtnCampaign.Init();
		chromBtnLast.Init();
		chromBtnLast.btn.mystyle.normal.background = null;
		chromBtnLast.btn.mystyle.active.background = null;

		//lblSlider.setBackground("chrome_slider1", TextureType.DECORATION);
		GearSysController.CheckIsGearSysUnlocked
		(
			function()
			{
				var isOpenGear : boolean = GearSysController.IsOpenGearSys();
				priv_initChromeButtonScrolls(isOpenGear);
			},
			function(resultDatas:Array)
			{
				priv_initChromeButtonScrolls(false);
			}
		);

		UpdateGambleInfo(_Global.INT32(seed["hasFreePlay"]));

	    SetBtnMoneyStyle(Payment.instance().IsDisplayRealGems());

	    //notice row
	    buffObj.SetDisabled(false);
	    //noticeRow.SetVisible(false);
		//noticeIcon.SetVisible(false);
		//noticeButton.SetVisible(false);

	    noticeUrgent = null;
	    saleItem = null;
	    noticeIcon.useTile = true;
		noticeIcon.tile = TextureMgr.instance().GeneralSpt().GetTile(null);
		//noticeIcon.tile.name  = "";
		//noticeIcon.tile.spt.edge = 1;
		noticeButton.OnClick = function (){
			this.priv_changeNoticeStage(false);
			//noticeRow.SetVisible(false);
			//noticeIcon.SetVisible(false);
			//noticeButton.SetVisible(false);
			var notices = ChatNotices.instance().GetNoticesList();
			if(noticeUrgent != null && notices != null && notices.Count > 0)
			{
				MenuMgr.getInstance().PushMenu("ChatRotator", noticeUrgent, "trans_zoomComp", priv_screenPosToLogicPos(noticeButton.rect.center));
			}
			buffObj.SetDisabled(false);
		};
		updateSalesIcon();

		Quests.instance().createDisplayInfor();

		this.priv_initLayout();

        MystryChest.instance().AddLoadMystryChestCallback(OnMystryChestLoaded);

        btnPopUpLight.mystyle.normal.background = TextureMgr.instance().LoadTexture("sanjiaotubiao_texiao",TextureType.DECORATION);
    	btnPopUpLight.Init();

    	vipOpenSituation = -1;

    	if(GameMain.instance().IsPveOpened() && KBN.PveController.instance().GetPveMinLevel () <= GameMain.instance().getPlayerLevel ())
		{
			chromBtnCampaign.animationLabel.SetVisible(true);
		}
		else
		{
			chromBtnCampaign.animationLabel.SetVisible(false);
		}

		sl_MergeServerCircle.setBackground("ui_merge_ef_loop",TextureType.ICON);
		sl_MergeServerArrow1.setBackground("ui_merge_ef_the arrow1",TextureType.ICON);
		sl_MergeServerArrow2.setBackground("ui_merge_ef_the arrow2",TextureType.ICON);
		var color :Color = new Color(1,1,1,0);
		sl_MergeServerCircle.SetColor(color);
		sl_MergeServerArrow1.SetColor(color);
		sl_MergeServerArrow2.SetColor(color);
		sl_MergeServerCircleElem.rect.width = 0;
		sl_MergeServerCircleElem.rect.height = 0;
		stepDoing = 1;

		//SetSODAVisible(KBNSODA.Instance.Visible);

		InitStatePopupEntranceAnimation();
		cityBackTex = TextureMgr.instance().LoadTexture("city_background2",TextureType.BACKGROUND);
		vipOpenTex = TextureMgr.instance().LoadTexture( "VIP", TextureType.DECORATION );
		vipTex = TextureMgr.instance().LoadTexture( "chrome_crown", TextureType.DECORATION );
		eventBackNormal = TextureMgr.instance().LoadTexture("Event_icon_normal",TextureType.ICON);
		eventBackActive = TextureMgr.instance().LoadTexture("Event_icon_Award",TextureType.ICON);
	}

	private var eventBackNormal : Texture;
	private var eventBackActive : Texture;
    private function InitStatePopupEntranceAnimation() : void
    {
        StopStatePopupEntranceTweener();
    }

    public function set StatePopupRotation(value : float)
    {
        btnStatePopup.rotateAngle = value;
    }

    public function get StatePopupRotation() : float
    {
        return btnStatePopup.rotateAngle;
    }

    private function StopStatePopupEntranceTweener() : void
	{

    }

    private function StartStatePopupEntranceTweener() : void
    {

        _Global.Log("[MainChrom StartStatePopupEntranceTweener] before calling Tweener.Play()");

    }

    public function UpdateGambleInfo(freeCnt : int) : void
    {
    	//setSeniorGambleState(Gamble.getInstance().HasActivity);
		chromBtnGamble.SetCnt(freeCnt);
		changeGambleState(freeCnt);
		var menuMgr : MenuMgr = MenuMgr.getInstance();
		var mainChromePopMenu : MainChromPopUpMenu = menuMgr.getMenu("MainChromPopUpMenu");
		if ( !m_stopGambleAnimation && freeCnt != 0 )
		{
			chromBtnGamble.PlayNoticeAnimation();
			if ( mainChromePopMenu != null )
				mainChromePopMenu.UpdateGambleAnimation(true);
		}
		else
		{
			chromBtnGamble.StopNoticeAnimation();
			if ( mainChromePopMenu != null )
				mainChromePopMenu.UpdateGambleAnimation(false);
		}
	}

	private var m_stopGambleAnimation : boolean = false;
	public function StopGambleAnimation():void
	{
		m_stopGambleAnimation = true;
		chromBtnGamble.StopNoticeAnimation();
	}

    public function StartDailyLoginAnimation() : void
    {
        if (String.IsNullOrEmpty(btnDailyLoginAnimParam))
        {
            return;
        }


        var gen : IAnimationCurveGenerator = AnimationCurveGeneratorFactory.GetGenerator(btnDailyLoginAnimParam);
        if (gen == null)
        {
            return;
        }

        var acInfo : AnimationCurveInfo = gen.Generate();
    }

    public function StopDailyLoginAnimation() : void
    {

    }


    private function OnMystryChestLoaded() : void {
        UpdateDailyLoginBtnVisibility();
        if (openDailyLoginOnMystryChestLoad) {
            openDailyLoginOnMystryChestLoad = false;
            // Wait for a frame cause the current frame is too busy to play smoothly the animation of Daily Login UI
            if (GameMain.instance() != null) {
                GameMain.instance().StartCoroutine(DoOpenDailyLoginRewardMenuCo());
            } else {
                DoOpenDailyLoginRewardMenu();
            }
        }
    }

    public function UpdateDailyLoginBtnVisibility() : void
    {
        var visible : boolean = ShouldShowDailyLoginBtn();
        btnDailyLogin.SetVisible(visible);

        var dotVisible : boolean = visible && DailyLoginRewardMgr.Instance.CanClaimAny;
        dailyLoginRedDot.SetVisible(dotVisible);

        var shouldAnimate : boolean = dotVisible && DailyLoginRewardMgr.Instance.HasNotOpenedUI;
        if (shouldAnimate)
        {
            StartDailyLoginAnimation();
        }
        else
        {
            StopDailyLoginAnimation();
        }
    }

    private function ShouldShowDailyLoginBtn() : boolean
    {
        _Global.Log(String.Format("[MainChrom ShouldShowDailyLoginBtn] FeatureSwitch={0}, HasMystryChest={1}, Mystry loaded={2}",
            DailyLoginRewardMgr.Instance.FeatureSwitch, DailyLoginRewardMgr.Instance.HasMystryChest, MystryChest.instance().IsLoadFinish));

        if (!DailyLoginRewardMgr.Instance.FeatureSwitch)
        {
            return false;
        }

        if (DailyLoginRewardMgr.Instance.HasMystryChest)
        {
            return MystryChest.instance().IsLoadFinish;
        }

        return true;
    }


    private function priv_initChromeButtonScrolls(isOpenGearBtn : boolean) : void
    {
		chromBtnsScroll.clearUIObject();
		chromBtnsScroll.Init();
		//chromBtnsScroll.addUIObject(lblLeft);
		chromBtnsScroll.addUIObject(chromBtnShop);
		chromBtnsScroll.addUIObject(chromBtnQuest);
		chromBtnsScroll.addUIObject(chromBtnAlliance);
		chromBtnsScroll.addUIObject(chromBtnMail);
		chromBtnsScroll.addUIObject(chromBtnGamble);
		//chromBtnsScroll.addUIObject(lblSlider);

		if(GameMain.instance().IsPveOpened())
			chromBtnsScroll.addUIObject(chromBtnCampaign);
		chromBtnsScroll.addUIObject(chromBtnHeroRelic);
		chromBtnsScroll.addUIObject(chromBtnTrain);
		chromBtnsScroll.addUIObject(chromBtnResearch);
		chromBtnsScroll.addUIObject(chromBtnLeaderBoard);
		chromBtnsScroll.addUIObject(chromBtnSetting);
		chromBtnsScroll.addUIObject(chromBtnShare);
		chromBtnsScroll.addUIObject(chromBtnOpenGear);
		chromBtnOpenGear.SetVisible(isOpenGearBtn);
		chromBtnQuest.setData({"icon":"button_icon_quests","txt": Datas.getArString("MainChrome.QuestsTab_Title"),"num":0});
		chromBtnMail.setData({"icon":"button_icon_Mail","txt":Datas.getArString("MainChrome.MessagesTab_Title"),"num":0});
		chromBtnGamble.setData({"icon":"button_icon_item","txt":Datas.getArString("Common.Gamble"),"num":0});
		chromBtnAlliance.setData({"icon":"button_icon_Allise","txt":Datas.getArString("MainChrome.AllianceTab_Title"),"num":0});
		chromBtnShop.setData({"icon":"button_icon_shop","txt":Datas.getArString("Common.Inventory"),"num":0});
		chromBtnTrain.setData({"icon":"button_icon_train","txt":Datas.getArString("Common.Train"),"num":0});
		chromBtnResearch.setData({"icon":"button_icon_research","txt":Datas.getArString("Common.Research"),"num":0});
		chromBtnLeaderBoard.setData({"icon":"button_icon_leaderboard","txt":Datas.getArString("Common.Rank"),"num":0});
		chromBtnSetting.setData({"icon":"button_icon_setting","txt":Datas.getArString("Common.Settings_Title"),"num":0});
		chromBtnShare.setData({"icon":"button_icon_share","txt":Datas.getArString("Common.Share"),"num":0});
		chromBtnHeroRelic.setData({"icon":"button_icon_heroRelic","txt":Datas.getArString("HeroRelic.Warehouse"),"num":0});
		if ( isOpenGearBtn )
			priv_updateChromeBtnIcon();
		if(GameMain.instance().IsPveOpened())
			chromBtnCampaign.setData({"icon":"button_icon_campaign","txt":Datas.getArString("Common.Campaign"),"num":0});
		chromBtnsScroll.addUIObject(chromBtnLast);

		chromBtnsScroll.MoveToTop();
    }

    public function UpdateChromeButtonScrolls()
    {
    	GearSysController.CheckIsGearSysUnlocked
		(
			function()
			{
				chromBtnOpenGear.SetVisible(true);
				priv_updateChromeBtnIcon();
				chromBtnsScroll.AutoLayout();
				chromBtnsScroll.MoveToTop();
			},
			function()
			{
				chromBtnOpenGear.SetVisible(false);
				chromBtnsScroll.AutoLayout();
				chromBtnsScroll.MoveToTop();
			}
		);
    }

    public function priv_updateChromeBtnIcon()
    {
		if ( PlayerPrefs.HasKey("mainChromeHadShowGear") )
		{
			chromBtnOpenGear.setData({"icon":"GearChromeIconNormal", "txt":Datas.getArString("Gear.ChromeEntrance"),"num":0});
		}
		else
		{
			chromBtnOpenGear.setData({"icon":"GearChromeIconNew", "txt":Datas.getArString("Gear.ChromeEntrance"),"num":0});
		}
    }

    public function get myCurProgressList():ProgressList
	{
		return curProgressList;
	}

	public function SetWheelGameInfo(wheelGameNode : HashObject)
	{
		priv_setWheelGameIcon(-1);
		if ( wheelGameNode == null )
		{
			m_endTime = 0;
			return;
		}

		//var wheelGameNode : HashObject = result["wheelgame"];
		var closeTime : long = _Global.parseTime(wheelGameNode["endtime"]);
		if ( closeTime > GameMain.unixtime() )
		{
			if ( wheelGameNode["backcolor"] != null )
			{
				var col : String = wheelGameNode["backcolor"].Value as String;
				if ( col.Substring(0, 1) == "#" )
				{
					WheelGameTurnplate.SetBackgroundColor(_Global.ARGB(col.Substring(1, col.Length-1)));
					//m_bkColor.a = 1.0f;
				}
			}
			var wheelGameId : int = _Global.INT32(wheelGameNode["wheelid"]);
			m_endTime = closeTime;
			priv_setWheelGameIcon(wheelGameId);
		}
		else
		{
			priv_setWheelGameIcon(-1);
		}
	}

	private function priv_setWheelGameIcon(wheelId : int)
	{
		btnWheelGame.clickParam = wheelId;
		if ( wheelId >= 0 )
		{
			btnWheelGame.SetVisible(true);
			lbWheelGameLessTime.SetVisible(true);
		}
		else
		{
			btnWheelGame.SetVisible(false);
			lbWheelGameLessTime.SetVisible(false);
			m_endTime = 0;
		}
	}

	public function RefreshCurrentMission()
	{
		missionBalloon.RefreshCurrentMission();
	}

	private var m_endTime : long;
	public function get WheelGameLeftTotalSecond() : int
	{
		if ( m_endTime <= GameMain.unixtime() )
			return 0;
		return m_endTime - GameMain.unixtime();
	}

	private 	function priv_updateWheelGameTimeLeft() : void
	{
		if ( !lbWheelGameLessTime.isVisible() )
			return;
		var lessTime : int = this.WheelGameLeftTotalSecond;
		if ( lessTime <= 0 )
		{
			priv_setWheelGameIcon(-1);
			return;
		}

		var lessTimeStr : String = _Global.timeFormatShortStrEx(lessTime, false);
		lbWheelGameLessTime.txt = lessTimeStr;
		//timeLeftToSpin.txt = String.Format(fmtString, lessTimeStr);
	}




	private function priv_onProgressListChanged(progressList : ProgressList) : void
	{
		if ( curProgressList == progressList )
		{
			//curProgressList.showAllWithAnimation();
			curProgressList.ShowAll();
			//ChangeQueueState();

			if(curProgressList == marchList)
			{
				if(curProgressList.GetItemsCnt() == 0)
				{
					btnShowList.image = upTexture;
				}
				else
				{
					btnShowList.image = downBtnTexture;
				}
			}
			else
			{
				btnShowList.image = downBtnTexture;
			}

			m_needResort = true;
		}
	}

    public function SetBtnMoneyStyle(isReal:boolean)
    {
    	if(isReal == false)
		{
			btnMoney.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_gem_60_blue_normal",TextureType.BUTTON);
			btnMoney.mystyle.active.background = TextureMgr.instance().LoadTexture("button_gem_60_blue_down",TextureType.BUTTON);
		}
		else
		{
			btnMoney.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_gem_60_green_normal",TextureType.BUTTON);
			btnMoney.mystyle.active.background = TextureMgr.instance().LoadTexture("button_gem_60_green_down",TextureType.BUTTON);
		}
    }

    private function OpenCities(param:Object)
    {

    	MenuMgr.getInstance().PushMenu("Cities", null, "trans_zoomComp", priv_screenPosToLogicPos(btnCities.rect.center));
    }

    public function OpenBarrack(param:Object)
    {
		var	slotId:int = Building.instance().getPositionForType(Constant.Building.BARRACKS);
		if( slotId  == -1 ){
			var message:String = Datas.getArString("MainChrome.trainWarning");
			ErrorMgr.instance().PushError("",message);
		}else{
			Building.instance().openStandardBuilding(Constant.Building.BARRACKS,slotId);
            MenuAccessor.OpenBarrackWithTab(1);
		}
    }

    public function GotoCampaignScene(param:Object)
    {
    	if(!GameMain.instance().IsPveOpened())
    	{
    		ErrorMgr.instance().PushError("", Datas.getArString("Common.Campaign_ShutDownDesc"), true, "OK", null);
    		return;
    	}

    	var seed:HashObject = GameMain.instance().getSeed();
    	var playerLevel:int = _Global.INT32(seed["xp"]["lvl"].Value);
    	if(playerLevel<KBN.PveController.instance().GetPveMinLevel())
    	{
    		ErrorMgr.instance().PushError("", Datas.getArString("Common.Campaign_UnactiveDesc"), true, "OK", null);
    		return;
    	}

    	GameMain.instance().hideTileInfoPopup();
    	if (GameMain.instance().getMapController()!=null) {
	    	GameMain.instance().getMapController().HiteCityDirectionRoot();
	    }
    	MenuMgr.getInstance().SwitchMenu ("MainChrom",null);
    	SetVisible(false);
    	GameMain.singleton.TouchForbidden = true;
    	GameMain.singleton.ForceTouchForbidden = true;
    	GameMain.instance().GotoCampaignScene();
    }

    private function OpenResourceMenu()
    {
    	MenuMgr.getInstance().PushMenu("ResourceMenu", null);
    }

    private function OpenPlayerInfo(param:Object)
    {
    	MenuMgr.getInstance().PushMenu("PlayerInfo", null);
    }

    public function OpenSetting()
    {
		MenuMgr.getInstance().PushMenu("PlayerSetting", null, "trans_zoomComp" );
    }
    public function OpenShare()
    {
    	MenuMgr.getInstance().PushMenu("ShareMenu", null);
    }
    public function OpenGear() : void
    {
  		var members : Array = General.instance().getGenerals();
  		if ( members.Count == 0 )
  			return;
  		PlayerPrefs.SetInt("mainChromeHadShowGear", 1);
  		priv_updateChromeBtnIcon();
  		var i:int = 0;
  		while(true)
  		{
  			if(i >= members.length) return;

  			var member : HashObject = members[i];
  			if(member == null) return;
  			if(member["knightLocked"] != null && member["knightLocked"].Value == "1")
  			{
  				i++;
  				continue;
  			}

			var knightId:int = _Global.INT32(member["knightId"]);
			MenuMgr.getInstance().PushMenu("GearMenu", [knightId,"home"], "");
  			break;
  		}
    }
    public function OpenHeroRelic() : void
    {
		if(KBN.HeroRelicManager.instance().CanOpenHeroRelic())
		{
			MenuMgr.getInstance().PushMenu("HeroRelicWarehouseMenu", null, "trans_zoomComp" );
		}
		else
		{
			MenuMgr.getInstance().PushMessage(Datas.getArString("Relic.InventoryNone"));
		}
    }
    public function OpenAcademy(param:Object)
    {
		var	slotId:int = Building.instance().getPositionForType(Constant.Building.ACADEMY);
		if( slotId  == -1 ){
			ErrorMgr.instance().PushError("",Datas.getArString("MainChrome.researchWarning"));
		}else{
			Building.instance().openStandardBuilding(Constant.Building.ACADEMY,slotId);
            MenuAccessor.SwitchTabIndexInAcademyBuilding(1);
		}
    }

    private function OpenTileManager(param:Object)
    {
    	var cityId:int = GameMain.instance().getCurCityId();
    	var buildingInfor:Building.BuildingInfo = Building.instance().buildingInfo(0 , Constant.Building.PALACE);
    	var hash:HashObject = new HashObject({"toolbarIndex":2, "infor":buildingInfor});
    	MenuMgr.getInstance().PushMenu("NewCastleMenu", hash);
    }

    public function OpenEmail()
    {
    	var _obj:Hashtable = {};
    	MenuMgr.getInstance().PushMenu("EmailMenu", _obj);
    }

    function ClickBuildQueue(param:Object)
    {
    	//hide tile info popup in world map
    	if( GameMain.instance().getScenceLevel()  == GameMain.WORLD_SCENCE_LEVEL )
    	{
    		GameMain.instance().hideTileInfoPopup();
    	}

       	if(!isChangeProgressList)
    	{
    		isChangeProgressList = true;
			if(curProgressList != null && curProgressList != buidingList)
			{
				nexProgressList = buidingList;
				curProgressList.hideAllWithAnimation();

				btnBuildQueue.mystyle.normal.background = selectedBtnTexture;
				btnTrain.mystyle.normal.background = normalBtnTexture;
				btnMarch.mystyle.normal.background = normalBtnTexture;
				btnExplore.mystyle.normal.background = normalBtnTexture;
				CheckQueueState(true);
			}
			else if(curProgressList != null && curProgressList == buidingList)
			{
				nexProgressList = null;
				ChangeQueueState();
			}
    	}
    }

    function ChangeQueueState():void
    {
    	if(curProgressList == null)
    	{
    		return;
    	}

    	if(curProgressList.GetItemsCnt() == 0)
    	{
    		btnShowList.image = upTexture;
    		return;
    	}

    	if(!curProgressList.IsHide())
    	{
    		btnShowList.image = upTexture;
    		curProgressList.hideAllWithAnimation();
    	}
    	else
    	{
    		btnShowList.image = downBtnTexture;
    		curProgressList.showAllWithAnimation();
    	}

//		if(curProgressList.GetItemsCnt() == 0)
//			return;
//		if(curProgressList.IsHide())
//		{
//			curProgressState = 0;
//		}
//		else if(curProgressList.IsShowAll())
//		{
//			curProgressState = 2;
//		}
//		else
//		{
//			curProgressState = 1;
//		}
//
//		curProgressState++;
//		if(curProgressList.GetItemsCnt() <= 2)
//		{
//			curProgressState = curProgressState%2;
//		}
//		else
//		{
//			curProgressState = curProgressState%3;
//		}
//
//		if(curProgressState == 0)
//		{
//			curProgressList.hideAllWithAnimation();
//			btnShowList.image = upTexture;
//		}
//		else if(curProgressState == 1)
//		{
//			curProgressList.showAllWithAnimation();
//			btnShowList.image = downBtnTexture;
//		}
//		else
//		{
//			curProgressList.showAllWithAnimation();
//			btnShowList.image = downBtnTexture;
//		}
   }

    function CheckQueueStateAfterAdd(progressList:ProgressList):void
    {
    	if(curProgressList == null)
    	{
    		return;
    	}

    	if(curProgressList == progressList)
    	{
    		btnShowList.image = downBtnTexture;
    	}
    }

    function CheckQueueState(isHideProgressList:boolean)
    {
    	if(curProgressList == null)
    	{
    		return;
    	}

    	if(curProgressList.GetItemsCnt() == 0)
    	{
    		btnShowList.image = upTexture;
    	}
    	else
    	{
 			if(isHideProgressList)
			{
				btnShowList.image = upTexture;
			}
			else
			{
				btnShowList.image = downBtnTexture;
			}
    	}
    }

    function ClickMarchQueue(param:Object)
    {
    	//hide tile info popup in world map
    	if( GameMain.instance().getScenceLevel()  == GameMain.WORLD_SCENCE_LEVEL ){
    		GameMain.instance().hideTileInfoPopup();
    	}

       	if(!isChangeProgressList)
    	{
    		isChangeProgressList = true;
	    	if(curProgressList && curProgressList != marchList)
			{
				nexProgressList = marchList;
				curProgressList.hideAllWithAnimation();

				btnBuildQueue.mystyle.normal.background = normalBtnTexture ;
				btnTrain.mystyle.normal.background = normalBtnTexture;
				btnMarch.mystyle.normal.background = selectedBtnTexture;
				btnExplore.mystyle.normal.background = normalBtnTexture;
				CheckQueueState(true);
			}
			else if(curProgressList && curProgressList == marchList)
			{
				nexProgressList = null;
				ChangeQueueState();
			}
    	}
    }

    function ClickExploreQueue(param:Object):void
    {
    	if( GameMain.instance().getScenceLevel()  == GameMain.WORLD_SCENCE_LEVEL ){
    		GameMain.instance().hideTileInfoPopup();
    	}

       	if(!isChangeProgressList)
    	{
    		isChangeProgressList = true;
	    	if(curProgressList && curProgressList != exploreList)
			{
				nexProgressList = exploreList;
				curProgressList.hideAllWithAnimation();

				btnBuildQueue.mystyle.normal.background = normalBtnTexture ;
				btnTrain.mystyle.normal.background = normalBtnTexture;
				btnMarch.mystyle.normal.background = normalBtnTexture;
				btnExplore.mystyle.normal.background = selectedBtnTexture;
				CheckQueueState(true);
			}
			else if(curProgressList && curProgressList == exploreList)
			{
				nexProgressList = null;
				ChangeQueueState();
			}
    	}
    }

    function ClickTrainQueue(param:Object)
    {
    	//hide tile info popup in world map
    	if( GameMain.instance().getScenceLevel()  == GameMain.WORLD_SCENCE_LEVEL ){
    		GameMain.instance().hideTileInfoPopup();
    	}

    	if(!isChangeProgressList)
    	{
    		isChangeProgressList = true;
	    	if(curProgressList != null && curProgressList != trainList)
			{

				nexProgressList = trainList;
				curProgressList.hideAllWithAnimation();

				btnBuildQueue.mystyle.normal.background = normalBtnTexture ;
				btnTrain.mystyle.normal.background = selectedBtnTexture;
				btnMarch.mystyle.normal.background = normalBtnTexture;
				btnExplore.mystyle.normal.background = normalBtnTexture;
				CheckQueueState(true);
			}
			else if(curProgressList != null && curProgressList == trainList)
			{
				nexProgressList = null;
				ChangeQueueState();
			}
    	}
    }

    function ClickShowList(param:Object)
    {
    	//hide tile info popup in world map
    	if( GameMain.instance().getScenceLevel()  == GameMain.WORLD_SCENCE_LEVEL )
    	{
    		GameMain.instance().hideTileInfoPopup();
    	}

    	if(curProgressList.GetItemsCnt() == 0)
    	{
    		return;
    	}

    	isChangeProgressList = true;

    	nexProgressList = null;

    	ChangeQueueState();

//    	if(!curProgressList.IsHide())
//    	{
//    		btnShowList.image = upTexture;
//    		curProgressList.hideAllWithAnimation();
//    	}
//    	else
//    	{
//    		btnShowList.image = downBtnTexture;
//    		curProgressList.showAllWithAnimation();
//    	}
    }

    function HideAllList()
    {
    	buidingList.Hide();
    	trainList.Hide();
    	marchList.Hide();
    	exploreList.Hide();

    	btnShowList.image = upTexture;
    }

	private var g_countForChattext:long = 0;
	private var g_curTime:long = 0;
	private var g_updateChatInterval:int = 1;

	public function getTextureByType(_type:String):Texture2D
	{
		switch(_type)
		{
			case Constant.ChatType.CHAT_GLOBLE:
				return TextureGlobal;
			case Constant.ChatType.CHAT_MONSTER:
				return textureMonster;
			case Constant.ChatType.CHAT_WHISPER:
				return TextureWhisper;
			case Constant.ChatType.CHAT_ALLIANCE:
			case Constant.ChatType.CHAT_ALLIANCE_OFFICER:
			case Constant.ChatType.HELP_FOUNDER_INITIATE:
			case Constant.ChatType.HELP_HELPER_CONFIRM:
				return TextureAlliance;
			case Constant.ChatType.CHAT_ALCREQUEST:
				return TextureAlliance;
			case Constant.ChatType.CHAT_ALCRQANSWER:
				return TextureAlliance;
			case Constant.ChatType.CHAT_EXCEPTION:
				return null;
		}
	}

	var cityBackTex:Texture;
	var vipOpenTex:Texture;
	var vipTex:Texture;
    private var m_vipLevel : IUIElement;
    private var m_vipBG : SimpleLabelImple;
   	private function UpdateVIPLevel()
   	{
   		if(m_vipLevel == null || m_vipBG == null) return;
   		// Check VIP switch
		var bVipOpened:boolean = GameMain.instance().IsVipOpened();
		var texVipTemp : Texture = bVipOpened == true ? vipOpenTex : vipTex;
		var elem = m_vipLevel.RealObj as SimpleLabel;
		elem.image = texVipTemp;
   		if(!bVipOpened)
   		{
   			m_vipLevel.Text = "";
   			(m_vipBG.RealObj as SimpleLabel).SetVisible( false );

   		}
   		else
   		{
   			var vipData:HashObject = GameMain.instance().GetVipData();
   			m_vipLevel.Text = _Global.INT32(vipData["vipLevel"]).ToString();

   			flashTimeVip += Time.deltaTime;
			if(flashTimeVip >= 1.0)
			{
				m_vipBG.SetNormalBackground(cityBackTex,false);
			}
			if(flashTimeVip >= 2.0)
			{
				flashTimeVip = 0;
				m_vipBG.SetNormalBackground(null,false);
			}
			(m_vipBG.RealObj as SimpleLabel).SetVisible( Datas.singleton.GetVipLevelUpFlag1()==1 );
   		}
   	}

	private var m_btnMergeServer : IUIElement;
	private var m_bgMergeServer : IUIElement;
	private var m_btnAvaEvent : IUIElement;
	// private var m_btnWorldboss: IUIElement;
	// private var m_labelWorlboss:IUIElement;

	@SerializeField private var sl_MergeServerCircle : SimpleLabel = new SimpleLabel();
	private var sl_MergeServerCircleElem : IUIElement;
	@SerializeField private var sl_MergeServerArrow1 : SimpleLabel = new SimpleLabel();
	private var sl_MergeServerArrow1Elem : IUIElement;
	@SerializeField private var sl_MergeServerArrow2 : SimpleLabel = new SimpleLabel();
	private var sl_MergeServerArrow2Elem : IUIElement;

	@SerializeField private var CIRCLE_OFFSET_X : float;
	@SerializeField private var CIRCLE_OFFSET_Y : float;
	@SerializeField private var ARROW1_OFFSET_X : float;
	@SerializeField private var ARROW1_OFFSET_Y : float;
	@SerializeField private var ARROW2_OFFSET_X : float;
	@SerializeField private var ARROW2_OFFSET_Y : float;

	private function UpdateMergeServer()
	{
		if( m_btnMergeServer == null || m_bgMergeServer == null )
			return;
//		var btnMergeServer = m_btnMergeServer.RealObj as SimpleButton;
		var l_bgMergeServer = m_bgMergeServer.RealObj as SimpleLabel;
//
		var bMergeServerOpen:boolean = GameMain.singleton.IsServerMergeOpened();
//
//		btnMergeServer.SetVisible(bMergeServerOpen);
//		l_bgMergeServer.SetVisible(bMergeServerOpen);
//		setCenterComponentVisible(bMergeServerOpen);

//		var btnNoticePad = m_btnNoticePad.RealObj as SimpleButton;
//		btnNoticePad.SetVisible(!bMergeServerOpen && (KBN.AllianceBossController.instance().IsActive() || KBN.TournamentManager.getInstance().isTournamentStarted()));

		if(bMergeServerOpen)
		{
//			btnRoundTower.SetVisible(false);
			UpdateMergeServerAfxStep1();
			UpdateMergeServerAfxStep2();
			UpdateMergeServerAfxStep3();
			UpdateMergeServerAfxStep4();
		}

		var startTime:long = GameMain.singleton.GetServerMergeStartTime();
		var leftTime : long = startTime - GameMain.unixtime();
		if(leftTime > 0)
		{
			m_bgMergeServer.Text = _Global.timeFormatStr(leftTime);
		}
		else
		{
			l_bgMergeServer.SetVisible(false);
		}

	}

	private var m_btnNoticePad : IUIElement;

    private var cityDefenseStatusLabel : SimpleLabel = null;
    private function UpdateCityDefenseStatus() : void
    {
        if (cityDefenseStatusLabel == null)
        {
            return;
        }

        var seed : HashObject = GameMain.instance().getSeed();
        if (seed == null)
        {
            return;
        }

        var cityNode : HashObject = seed["citystats"]["city" + GameMain.instance().getCurCityId()];
        if (cityNode != null && _Global.GetString(cityNode["gate"]) == Constant.City.DEFEND)
        {
            cityDefenseStatusLabel.SetVisible(true);
            cityDefenseStatusLabel.tile = TextureMgr.instance().IconSpt().GetTile("city_troops_unhidden");
            return;
        }

        if (Castle.instance().HasSelectiveDefense())
        {
            cityDefenseStatusLabel.SetVisible(true);
            cityDefenseStatusLabel.tile = TextureMgr.instance().IconSpt().GetTile("city_under_selective_defense");
            return;
        }

        cityDefenseStatusLabel.SetVisible(false);
    }

    function SecondUpdate() : void
    {
        UpdateCityDefenseStatus();
        UpdateStatePopupEntranceAnimation();
    }


    private function UpdateStatePopupEntranceAnimation() : void
    {
        if (StatePopupEntranceController.Instance == null)
        {
            return;
        }

            if (!StatePopupEntranceController.Instance.ShouldAnimate)
            {
                StopStatePopupEntranceTweener();
            }
        else
        {
            if (StatePopupEntranceController.Instance.ShouldAnimate)
            {
                StartStatePopupEntranceTweener();
            }
        }
    }
    public var MarchSearchBtn:SimpleButton;
    public var worldbossBtn:SimpleButton;
    public var worldbossTime:SimpleLabel;
    private var isRealWorldBoss:boolean=false;

    // private var btnWorldboss:SimpleButton=null;
	// public var labelWorldboss:SimpleLabel=null;

	private function SetSeasonPassData()
	{
		btnSeasonPass.SetVisible(PassMissionMapManager.Instance().CanSeeOpenBtn());
		var texMgr = TextureMgr.instance();
		if(PassMissionMapManager.Instance().CanSeeOpenBtn() &&
		(PassMissionMapManager.Instance().GetBoxRewardState() == 1 || PassMissionQuestManager.Instance().HaveCanCaimed()))
		{
			btnSeasonPass.mystyle.normal.background = texMgr.LoadTexture("btnPassSeasonRed", TextureType.BUTTON);
		}
		else
		{
			btnSeasonPass.mystyle.normal.background = texMgr.LoadTexture("btnPassSeason", TextureType.BUTTON);
		}
		labelSeasonPassTimer.SetVisible(PassMissionMapManager.Instance().CanSeeOpenBtn());
		labelSeasonPassTimer.txt = PassMissionMapManager.Instance().SeasonPassTimer();
	}

	function Update () {
		if(!visible)
			return;

		SetSeasonPassData();
		MarchSearchBtn.SetVisible(GameMain.instance().getScenceLevel()==GameMain.WORLD_SCENCE_LEVEL);
		isRealWorldBoss=GameMain.singleton.IsHaveRealWorldBoss();

		// if ((!worldbossBtn.isVisible())&&(isRealWorldBoss&&GameMain.instance().getScenceLevel()==GameMain.WORLD_SCENCE_LEVEL)) {
			RefreshServerMergePosition();
		// }

		worldbossBtn.SetVisible(isRealWorldBoss&&GameMain.instance().getScenceLevel()==GameMain.WORLD_SCENCE_LEVEL);
		worldbossTime.SetVisible(isRealWorldBoss&&GameMain.instance().getScenceLevel()==GameMain.WORLD_SCENCE_LEVEL);
		if (isRealWorldBoss) {
			worldbossTime.txt=GameMain.singleton.GetWorldBossEndTime();
		}


		// if (isRealWorldBoss&&GameMain.instance().getScenceLevel()==GameMain.WORLD_SCENCE_LEVEL) {
		// 	if (m_btnAvaEvent!=null) {
		// 		var btnAvaEvent = m_btnAvaEvent.RealObj as SimpleButton;
		// 		if (btnAvaEvent!=null) {
		// 			btnAvaEvent.SetVisible(false);
		// 		}
		// 	}

		// 	btnWorldboss=btnWorldboss==null?(m_btnWorldboss.RealObj as SimpleButton):btnWorldboss;
		// 	labelWorldboss=labelWorldboss==null?(m_labelWorlboss.RealObj as SimpleLabel):labelWorldboss;

		// 	btnWorldboss.SetVisible(false);
		// 	labelWorldboss.SetVisible(false);
		// 	if (labelWorldboss!=null) {
		// 		labelWorldboss.txt=GameMain.singleton.GetWorldBossEndTime();
		// 	}

		// }
		// else
		// {
		// 	btnWorldboss=btnWorldboss==null?(m_btnWorldboss.RealObj as SimpleButton):btnWorldboss;
		// 	labelWorldboss=labelWorldboss==null?(m_labelWorlboss.RealObj as SimpleLabel):labelWorldboss;

		// 	if (btnWorldboss!=null) {
		// 		btnWorldboss.SetVisible(false);
		// 	}
		// 	if (labelWorldboss!=null) {
		// 		labelWorldboss.SetVisible(false);
		// 	}
		// }

		iconHider.Update();
		var seed:HashObject = GameMain.instance().getSeed();
		money.txt = Payment.instance().DisplayGems + "";
		var curCityId:int = GameMain.instance().getCurCityId();
		var curCityOrder:int = GameMain.instance().getCurCityOrder();
		var second:long= GameMain.unixtime();
		UpdateVIPLevel();
		UpdateMergeServer();
		buffObj.Update();
		worldMapBuff.Update();

		UpdateProgressListAnimation() ;

		if((MenuMgr.getInstance().Chat as ChatMenu).whetherGetChat(false))
		{
			(MenuMgr.getInstance().Chat as ChatMenu).getChat(true);
		}

		if(gemsAnimation)
		{
			gemsAnimation.Update();
		}
		g_curTime = GameMain.unixtime();
		if(g_curTime - g_countForChattext >= g_updateChatInterval)
		{
			g_countForChattext = g_curTime;

			if((MenuMgr.getInstance().Chat as ChatMenu).isNeedUpdateMes)
			{
				var tempArray:Array = (MenuMgr.getInstance().Chat as ChatMenu).generateMesForMainChrom();

				chatText1.txt = "";
				chatText2.txt = "";
				chatIcon1.mystyle.normal.background = null;
				chatIcon2.mystyle.normal.background = null;

				if(tempArray.length > 0)
				{
					chatText1.txt = (tempArray[0] as Hashtable)["message"];
					chatIcon1.mystyle.normal.background = getTextureByType((tempArray[0] as Hashtable)["type"].ToString());
					if(((tempArray[0] as Hashtable)["type"].ToString()) == Constant.ChatType.CHAT_EXCEPTION)
					{
						chatText1.mystyle.normal.textColor = redColor;
					}
					else
					{
						chatText1.mystyle.normal.textColor = blackColor;
					}
				}

				if(tempArray.length > 1)
				{
					chatText2.txt = (tempArray[1] as Hashtable)["message"];
					chatIcon2.mystyle.normal.background = getTextureByType((tempArray[1] as Hashtable)["type"].ToString());

					if(((tempArray[1] as Hashtable)["type"].ToString()) == Constant.ChatType.CHAT_EXCEPTION)
					{
						chatText2.mystyle.normal.textColor = redColor;
					}
					else
					{
						chatText2.mystyle.normal.textColor = blackColor;
					}
				}
			}
		}

		gold.txt =  _Global.NumSimlify( Resource.instance().getCountForType(Constant.ResourceType.GOLD, curCityId));
		food.txt = _Global.NumSimlify( Resource.instance().getCountForType(Constant.ResourceType.FOOD, curCityId));
		stone.txt = _Global.NumSimlify(Resource.instance().getCountForType(Constant.ResourceType.STONE, curCityId));
		if(Resource.instance().GetCastleLevel()>=Constant.CarmotLimitLevel){
			carmot.txt=_Global.NumSimlify(Resource.instance().getCountForType(Constant.ResourceType.CARMOT, curCityId));
		}else{
			carmot.txt="--";
		}

		steel.txt = _Global.NumSimlify(Resource.instance().getCountForType(Constant.ResourceType.IRON, curCityId));
		lumber.txt = _Global.NumSimlify(Resource.instance().getCountForType(Constant.ResourceType.LUMBER, curCityId)) ;

		var upKeepBuff : boolean = _Global.INT64(seed["bonus"]["bC3400"]["bT340" + curCityOrder]) > second;
		if (upKeepBuff)
		{
			food.txt = "<color=#4AA731>" + food.txt + "</color>";
		}

		crown.txt = seed["player"]["title"].Value.ToString();
		//level.txt = "" +seed["player"]["title"].Value;
		var mightValue : long = _Global.INT64(seed["player"]["might"]);
		var mightString : String = _Global.NumSimlify(mightValue, 3, true);
		might.txt = Datas.instance().getArString("MainChrome.MightInfo_Title") + ":" + mightString;
		userName.txt = seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value;
		var cityInfo:HashObject = GameMain.instance().GetCityInfo(curCityId);

		if(cityInfo)
		{
			citycoord.txt = "(" + cityInfo[_Global.ap+2].Value + ", "+ cityInfo[_Global.ap+3].Value+")";
			cityName.txt = cityInfo[_Global.ap+1].Value;
			if(cityName.GetWidth() > cityName.rect.width)
			{
				var cityNameTxt : String = _Global.CalculateLength(cityName.txt, "...", null, cityName.mystyle, cityName.rect.width);
				cityName.txt = cityNameTxt;
			}
		}

		if(userName.GetWidth() > userName.rect.width)
		{
			var userNameTxt : String = _Global.CalculateLength(userName.txt, "...", null, userName.mystyle, userName.rect.width);
			userName.txt = userNameTxt;
		}

		time.txt = _Global.HourTime24WithoutSecond(second);
		timeLeft.txt = time.txt;
		buidingList.UpdateData();
		marchList.UpdateData();
		exploreList.UpdateData();
		trainList.UpdateData();

//		_Global.DateTime(second)

		//get data from message.js

		var newMailCnt:int = Message.getInstance().MessageStatistics.UnreadCount;
		chromBtnMail.SetCnt(newMailCnt);

		if( mailCnt < newMailCnt)
		{
			SoundMgr.instance().PlayEffect( "new_message", /*TextureType.AUDIO*/"Audio/" );
		}
		mailCnt = newMailCnt;
		chromBtnQuest.SetCnt(Quests.instance().GetQuestComp());
	   	buildNote.SetCnt( researchShortcut.isVisible()? buidingList.GetItemsCnt()-1: buidingList.GetItemsCnt());
	    marchNote.SetCnt(marchList.GetItemsCnt());
	    exploreNote.SetCnt(tileShortcut.isVisible()?exploreList.GetItemsCnt()-1: exploreList.GetItemsCnt());
	    trainNote.SetCnt(trainShortcut.isVisible()?trainList.GetItemsCnt()-1:trainList.GetItemsCnt());


	    if( buidingList.GetItemsCnt() == 0 )
	    {
	    	if(Building.instance().getCountForType (Constant.Building.ACADEMY, curCityId) > 0 && KBN.FTEMgr.getInstance().isFinished )
	    	{
	    		researchShortcut.SetVisible(true);
	    		buidingList.AddItem(researchShortcut);
	    	}
			if ( curProgressList == buidingList )
				m_needResort = true;
	    }

	    if( trainList.GetItemsCnt() == 0  )
	    {
	    	if(Building.instance().getCountForType (Constant.Building.BARRACKS , curCityId) > 0)
	    	{
	    		trainShortcut.SetVisible(true);
	    		trainList.AddItem(trainShortcut);
	    	}
			if ( curProgressList == trainList )
				m_needResort = true;
	    }

 		if( exploreList.GetItemsCnt() == 0  )
	    {
	    	if(KBN.FTEMgr.getInstance().isFinished)
	    	{
	    		tileShortcut.SetVisible(true);
	    		exploreList.AddItem(tileShortcut);
	    	}
			if ( curProgressList == exploreList )
				m_needResort = true;
	    }

        /*offerChange
        var offerCount:int=PaymentOfferManager.Instance.GetOfferListCount();
        if(offerCount>0)
        {
        	btnUniversalOffer.SetVisible(true);
        	labelOfferTimer.SetVisible(true);
        	labelOfferTimer.txt = Datas.getArString("Common.Special");
        }else{
        	btnUniversalOffer.SetVisible(false);
        	labelOfferTimer.SetVisible(false);
        }*/
        var offerData : PaymentOfferData;
		//btnBeginner.SetVisible(false);
		labelBeginnerTimer.SetVisible(false);
		//---
		/**
		for(var k:int=1;k<=2;k++)
		{
            offerData = PaymentOfferManager.Instance.GetDataByCategory(k);
            if (offerData == null)
            	continue;

			curSlot1Offer = k;
			beginnerTimeEnd = offerData.EndTime;
			var showBeginner:boolean = beginnerTimeEnd > second;
			btnBeginner.SetVisible(showBeginner);
			labelBeginnerTimer.SetVisible(showBeginner);
			labelBeginnerTimer.txt = (beginnerTimeEnd - second<259200)?_Global.timeFormatShortStrEx(beginnerTimeEnd - second,false):Datas.getArString("Common.Special");

			//ifShowBL= !showBeginner;
            if (!showBeginner)
        	{
            	PaymentOfferManager.Instance.UpdateData(null, k);
       		}
			if(!showBeginner && Payment.instance().currentNoticeType == k)
			{
				topOfferType = PaymentOfferManager.Instance.GetDataByCategory(3) != null ? 3:8;
			}
			break;
		}

        offerData = PaymentOfferManager.Instance.GetDataByCategory(3);
		if(offerData != null)
		{
			OfferTimeEnd = offerData.EndTime;
			var showoffer:boolean = OfferTimeEnd > second;
            btnUniversalOffer.SetVisible(showoffer);
            labelOfferTimer.SetVisible(showoffer);
            labelOfferTimer.txt = (OfferTimeEnd - second<259200)? _Global.timeFormatShortStrEx(OfferTimeEnd - second,false):Datas.getArString("Common.Special");

            if (!showoffer)
            {
                PaymentOfferManager.Instance.UpdateData(null, 3);
            }
			if(!showoffer && Payment.instance().currentNoticeType == 3)
			{
				var j:int =0;
				while(++j <=2)
				{
					if(PaymentOfferManager.Instance.GetDataByCategory(j) != null)
					{
						topOfferType = j;
						break;
					}
				}
				if(topOfferType == 3)
					topOfferType =8;
			}
		}
        else
        {
            btnUniversalOffer.SetVisible(false);
            labelOfferTimer.SetVisible(false);
        }
*/
	    waitingLabel.Update();
	    moveMapLoadingLabel.Update();
	    chromBtnsScroll.Update();
		if( CityQueue.instance().ReachNewCityLevel() )
		{
			flashTime += Time.deltaTime;
			if(flashTime >= 1.0)
			{
				bHightlight = !bHightlight;
				if(bHightlight)
					cityBack.TileName = "city_background2";
				else
					cityBack.TileName = null;
				flashTime = 0;
			}
		}

		//update socket
		SocketAdapter.Update(Time.deltaTime);
		while(SocketAdapter.HandlersQueue != null && SocketAdapter.HandlersQueue.length >0)
		{
			var callback:SocketCallBack = SocketAdapter.HandlersQueue.Pop() as SocketCallBack;
			if(callback != null)
			{
				callback.Do();
			}
		}

		//urgent notice
		if(ChatNotices.instance().UrgentNotice == null || KBN.FTEMgr.isFTERuning() )
		{
			this.priv_changeNoticeStage(false);
			//noticeRow.SetVisible(false);
			//noticeIcon.SetVisible(false);
			//noticeButton.SetVisible(false);
			buffObj.SetDisabled(false);
		}
		else if(noticeUrgent == null ||(noticeUrgent != null && ChatNotices.instance().UrgentNotice.SaleId != noticeUrgent.SaleId))
		{
			noticeUrgent = ChatNotices.instance().UrgentNotice;
			noticeRow.txt = noticeUrgent.Title;
			this.priv_changeNoticeStage(true);
			//buffObj.SetDisabled(true);
			noticeIcon.tile.name  = noticeUrgent.Image;
			//noticeRow.SetVisible(true);
			//noticeIcon.SetVisible(true);
			//noticeButton.SetVisible(true);
		}
		else
		{
			//not change nodiceVisible
		}

		if(seed["geEvent"] != null && (seed["geEvent"]["events"] != null || seed["geEvent"]["seasons"] != null))
		{
			btnEventCenter.SetVisible(MystryChest.instance().IsLoadFinish);
			if(GameMain.instance().haveAwardEvent())
			{
				btnEventCenter.mystyle.normal.background = eventBackActive;
				btnEventCenter.mystyle.active.background = eventBackActive;
			}
			else
			{
				btnEventCenter.mystyle.normal.background = eventBackNormal;
				btnEventCenter.mystyle.active.background = eventBackNormal;
			}

		}
		else
		{
			btnEventCenter.SetVisible(false);
		}

		missionBalloon.Update();

		if(GameMain.instance().IsPveBossOpened() && GameMain.instance().IsPveOpened())
		{
			var bossCount:int = KBN.PveController.instance().GetActiveBossCount();
			chromBtnCampaign.SetCnt(bossCount);
		}
		else
		{
			chromBtnCampaign.SetCnt(0);
		}

		SetMistExpeditionOpenState();
		SetThirdPartyPaymentOpenState();

		priv_updateWheelGameTimeLeft();
		priv_resetLayout();
		UpdateOfferData();
	}

	//private var isPlayQuestAnimation:boolean = false;
	private var lastFinishedQuestNum:int;
	public static var LEVEL_LIMIT_QUEST_ANIMATION:int = 5;

	public function setQuestTipForMainchrom(_questNum:int):void
	{
		chromBtnQuest.SetCnt(_questNum);
		if(_questNum > lastFinishedQuestNum && GameMain.instance().getPlayerLevel() < LEVEL_LIMIT_QUEST_ANIMATION)
		{
			chromBtnQuest.PlayNoticeAnimation();
			lastFinishedQuestNum = _questNum;
		}
		else
		{
			lastFinishedQuestNum = _questNum;

			if(_questNum == 0)
			{
				chromBtnQuest.StopNoticeAnimation();
			}
		}
	}

	function UpdateOfferData(){
		offerRefreshTimmer+=Time.deltaTime;
		if(offerRefreshTimmer<1) return;
		offerRefreshTimmer=0;
		var offerCount = PaymentOfferManager.Instance.GetOfferListCount();
		if(offerCount<=0){
			btnUniversalOffer.SetVisible(false);
        	labelOfferTimer.SetVisible(false);
		}
	}

	public function StopQuestAnimation():void
	{
		chromBtnQuest.StopNoticeAnimation();
	}

	public function OpenGamble(clickParam:Object)
	{
	   MenuMgr.getInstance().PushMenu("GambleMenu", null);
	}

	public function ShowNewPrivaliage()
	{
		var seed : HashObject = GameMain.singleton.getSeed();
		if(seed["playerMigrateStatus"]!=null && seed["playerMigrateStatus"]["status"]!=null) {
			var migrateState:int=_Global.INT32(seed["playerMigrateStatus"]["status"]);
			if(migrateState==2){//migrate success
//				var renameItemCount:int=0;
//				if(seed["playerMigrateStatus"]["itemAmount"]!=null){
//					renameItemCount=_Global.INT32(seed["playerMigrateStatus"]["itemAmount"]);
//				}
				Datas.instance().clearMailAndReport();//clear chche file
				Message.getInstance().ResetMessage();//init data
				MenuMgr.getInstance().PushMenu("MigrateDialog", {"type":1,"sourceServer":seed["playerMigrateStatus"]["sourceServerName"].Value,"targetServer":seed["playerMigrateStatus"]["targetServerName"].Value,"renameItemCount":seed["playerMigrateStatus"]["itemAmount"].Value}, "trans_zoomComp");
				return;
			}else if(migrateState==3){//migrate failed
				MenuMgr.getInstance().PushMenu("MigrateDialog", {"type":2,"sourceServer":seed["playerMigrateStatus"]["sourceServerName"].Value,"errorCode":_Global.INT32(seed["playerMigrateStatus"]["errorCode"])}, "trans_zoomComp");
				return;
			}
		}else
			GameMain.singleton.StartCoroutine(priv_openTOSDialogWithCoroutine());



	}
	private function priv_openTOSDialogWithCoroutine()
	{
    	while(!KBN.FTEMgr.getInstance().isAllowContentTouch )
    		yield;
		var seed : HashObject = GameMain.singleton.getSeed();
		var tosParam : HashObject = seed["tos"];
		if ( tosParam == null )
		{
			Payment.instance().reqPaymentData();
    		yield;
			ShowLoginPopupMenu();
			GameMain.instance().DoAfterTOSCheck(false);
			return;
		}

		var parm : LoginPopupParam = new LoginPopupParam();
		parm.onPopMenu = function()
		{
			this.ShowLoginPopupMenu();
		};

		parm.type = StartupPopDialog.EPopType.PicAndText;
		parm.title = Datas.getArString("Tos.Title");
		parm.content = Datas.getArString("Tos.Desc");
		var btnParams : LoginPopupParam.ButtonParam[] = new LoginPopupParam.ButtonParam[3];
		for ( var i : int = 0; i != btnParams.Length; ++i )
		{
			btnParams[i] = new LoginPopupParam.ButtonParam();
			btnParams[i].style = new LoginPopupParam.ButtonVisualStyle();
		}

		btnParams[0].onClick = function() : void
		{
			UnityNet.DoRequest(_Global.ToString(tosParam["accept"]), null, null, null);
		};
		btnParams[0].txt = Datas.getArString("Common.Accept_button");
		btnParams[0].style.textureType = LoginPopupParam.ButtonTextureType.Blue;
		btnParams[0].closeAfterClick = true;
		btnParams[1].txt = Datas.getArString("Tos.PriPolicy");
		btnParams[1].linkType = Constant.LinkerType.URL;
		btnParams[1].param = _Global.ToString(tosParam["privacyPolicy"]);
		btnParams[1].style.textureType = LoginPopupParam.ButtonTextureType.None;
		btnParams[1].style.fontColor = FontColor.Blue;
		btnParams[1].closeAfterClick = false;
		btnParams[2].txt = Datas.getArString("Tos.TermOfUse");
		btnParams[2].linkType = Constant.LinkerType.URL;
		btnParams[2].param = _Global.ToString(tosParam["serviceTerms"]);
		btnParams[2].style.textureType = LoginPopupParam.ButtonTextureType.None;
		btnParams[2].style.fontColor = FontColor.Blue;
		btnParams[2].closeAfterClick = false;
		parm.btnParams = btnParams;
		var texMgr = TextureMgr.instance();
		parm.pic = texMgr.LoadTexture("character_Morgause@" + TextureType.FTE, function(isOK : boolean, key : String, tex2D : Texture2D)
		{
			if ( !isOK )
			{
				this.ShowLoginPopupMenu();
				GameMain.instance().DoAfterTOSCheck(false);
				return;
			}

			parm.pic = tex2D;
			MenuMgr.getInstance().PushMenu("TosPopDialog", parm, "trans_zoomComp");
			GameMain.instance().DoAfterTOSCheck(true);
		});
	}

	public function ShowLoginPopupMenu()
	{
		var seed : HashObject = GameMain.singleton.getSeed();
		var popParam : HashObject = seed["loginPopUp"];
		if ( popParam == null )
			return;

		if ( popParam["type"] == null )
			return;
		var parm : LoginPopupParam = new LoginPopupParam();
		parm.type = _Global.INT32(popParam["type"]) - 1;
		if ( parm.type < 0 )
			return;
		parm.title = _Global.ToString(popParam["title"]);
		parm.content = _Global.ToString(popParam["content"]);
		if ( popParam["button"] != null )
		{
			var btnParams : System.Collections.Generic.List.<LoginPopupParam.ButtonParam> = null;
			var btns : HashObject = popParam["button"];
			for ( var idx : int = 0; idx != StartupPopDialog.MaxButtonCount; ++idx )
			{
				var bt : HashObject = btns[_Global.ap + idx.ToString()];
				if ( bt == null )
					break;
				var btnParam : LoginPopupParam.ButtonParam = new LoginPopupParam.ButtonParam();
				btnParam.linkType = _Global.ToString(bt["a0"]);
				btnParam.txt = _Global.ToString(bt["a1"]);
				btnParam.param = _Global.ToString(bt["a2"]);
				if ( btnParams == null )
					btnParams = new System.Collections.Generic.List.<LoginPopupParam.ButtonParam>();
				btnParams.Add(btnParam);
			}

			if ( btnParams != null )
			{
				parm.btnParams = btnParams.ToArray();
			}
		}

		if ( parm.type != StartupPopDialog.EPopType.TextOnly )
		{
			var picURL : String = _Global.ToString(popParam["pic"]);
			var texMgr = TextureMgr.instance();
			parm.pic = texMgr.LoadTexture(picURL, function(isOK : boolean, key : String, tex2D : Texture2D)
			{
				if ( !isOK )
					return;
				parm.pic = tex2D;
				MenuMgr.getInstance().PushMenu("StartupPopDialog", parm, "trans_zoomComp");
			});
		}
		else
		{
			MenuMgr.getInstance().PushMenu("StartupPopDialog", parm, "trans_zoomComp");
		}
	}

	public function OpenLeaderBoard(param:Object)
	{
//		MenuMgr.getInstance().PushMenu("LeaderboardMenu", null);
		MenuMgr.getInstance().PushMenu("LeaderBoardFrontMenu", null);
	}
	public function OpenShop():void
	{
		//var object:Object = {"selectedTab":0};
		MenuMgr.getInstance().PushMenu("InventoryMenu", null);
	}

	function OpenChat()
	{
//		print("open Chat");
		MenuMgr.getInstance().PushMenu("ChatMenu", null);
	}

	function OpenWheelMenu(param:Object)
	{
		/* TODO修改 日期 2022-10-21 */

		MenuMgr.getInstance().PushMenu("WheelGameTurnplate", param);
		//MenuMgr.getInstance().PushMenu("WheelGameTheCumulativeRewards", param);
	}

	private function reqEventCenter():void
	{
		EventCenter.getInstance().reqGetEventList(OpenEventCenterMenu);
	}

	private function OpenEventCenterMenu():void
	{
		MenuMgr.getInstance().PushMenu("EventCenterMenu", null);
	}

	public function OpenMission()
	{
//		print("open Mission");
		MenuMgr.getInstance().PushMenu("Mission", null);
	}

	function OpenPayment(){
		//var type:int=PaymentOfferManager.Instance.CheckTopOffer(topOfferType);
		//Payment.instance().setCurNoticeType(type);
		MenuMgr.getInstance().PushPaymentMenu(Constant.PaymentBI.MenuOpen);
	}
	function OpenSODA()
	{
		_Global.Log("open soda.");
		//SetSODAVisible(false);

		m_needResort = true;
//		KBNSODA.Instance.ShowUI();
	}

	private function priv_openBeginnerOffer()
	{
		Payment.instance().setCurNoticeType(curSlot1Offer);

        var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetDisplayDataByDisplayPosition();
		if ( offerData == null )
			return;

		MenuMgr.getInstance().PushMenu("OfferMenu", Constant.OfferPage.Offer, "trans_zoomComp");
	}

	public function OpenStatePopupDialog()
	{
		MenuMgr.getInstance().PushMenu("ChromeOrganizerMenu", null, "trans_zoomComp", priv_screenPosToLogicPos(btnStatePopup.rect.center));
	}


	/*开启 迷雾远征 窗口*/
	public function OpenMistExpeditionMenu() {
		MenuMgr.getInstance().PushMenu("MistExpeditionMenu", null);
	}

	/* 设置 迷雾远征 活动的开启状态：
	 * Editor 由 isOpenMistExpedition 作为主要控制条件；其他环境有服务器下发信号控制 */
	private function SetMistExpeditionOpenState() {
		var isOpen = GameMain.instance().IsMistExpeditionOpened();

		#if UNITY_EDITOR
		isOpen = isOpenMistExpedition || isOpen;
		#endif

		btnMistExpedition.SetVisible(isOpen);
	}


	/* 跳转到 web shop */
	private function OnThirdPartyPaymentBtnClick() {
	/*TODO 需要 传参数、url*/
		//var url = GameMain.instance().GetThirdPartyPaymentURL();
		//if (!String.IsNullOrEmpty(url))
		//	Application.OpenURL(url);

		//TODO 
		MenuMgr.getInstance().PushMenu("WheelGameLeaderboard", null);

	}

	/* 设置 三方支付 入口的开启状态：
	 * Editor 由 isOpenThirdPartyPayment 作为主要控制条件；其他环境有服务器下发信号控制 */
	private function SetThirdPartyPaymentOpenState() {
		var isOpen = GameMain.instance().IsOpenThirdPartyPayment();

			#if UNITY_EDITOR
		isOpen = isOpenThirdPartyPayment || isOpen;
			#endif

		btnThirdPartyPayment.SetVisible(isOpen);
	}




	public function OpenPassMissionMenu()
	{
		if(PassMissionMapManager.Instance().GetUnlockPass())
		{
			MenuMgr.getInstance().PushMenu("PassMissionMenu", Constant.OfferPage.Offer, "trans_zoomComp");
		}
		else
		{
			MenuMgr.getInstance().PushMenu("PassMissionUnlock", Constant.OfferPage.Offer, "trans_zoomComp");
		}
	}

    public function OpenUniversalOffer()
    {
        Payment.instance().setCurNoticeType(3);
//        var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetOfferForAutoPopup();
//        if ( offerData == null )
//            return;
//		var okCallback:Function = function( result:Object ){
//                 MenuMgr.getInstance().PushMenu("OfferPopMenu", offerData, "trans_zoomComp");
//            } ;
//        Payment.instance().reqPaymentList(okCallback,null, true, true);
		MenuMgr.getInstance().PushMenu("OfferMenu", Constant.OfferPage.Offer, "trans_zoomComp");
    }

    function OpenDailyLoginRewardMenu() {
        DailyLoginRewardMgr.Instance.UpdateDataAndOpenMenu();
    }

	public function openAlliance(data:Hashtable)
	{
		//checek embassy.
//		var el:int = Building.instance().getMaxLevelForType(Constant.Building.EMBASSY,GameMain.instance().getCurCityId() );
		var cityId:int;
		var el:int = 0;
		var seed:HashObject = GameMain.instance().getSeed();
		var cityInfos:Array = _Global.GetObjectValues( seed["cities"] );
		for( var i = 0; i < cityInfos.length; i ++ ){
			cityId = _Global.INT32((cityInfos[i] as HashObject)[_Global.ap+0]);
			el = Building.instance().getCountForType(Constant.Building.EMBASSY, cityId);
			if( el > 0 ){
				break;
			}
		}

		if(el == 0)
		{	//TODO..
			var ed:ErrorDialog = ErrorMgr.instance().m_errorDialog;
//			ed.setLayout(590,340);
//			ed.setContentRect(Rect(90,120,0,60));

			ErrorMgr.instance().PushError("",Datas.getArString("Alliance.BuildAnEmbassy") );
		}
		else if(null == data)
		{
			MenuMgr.getInstance().PushMenu("AllianceMenu",el);
		}
		else
		{
			data["el"] = el;
			MenuMgr.getInstance().PushMenu("AllianceMenu", data);
		}

	}

	function DrawItem(){

		//if(disabled && Event.current.type != EventType.Repaint)
		//	return;
	//	test.Draw();
		//btnSwitchView.Draw();
		//btnEventCenter.Draw();
		//btnSaleIcon.Draw();
		//chatText.Draw();
		//chatText1.Draw();
		//chatText2.Draw();
		//chatIcon1.Draw();
		//chatIcon2.Draw();
	//	btnChat.Draw();
	//	cityBar.Draw();

	//	buidingList.Draw();
		//ShowProgress();
		//trainNote.Draw();
		//buildNote.Draw();
		//marchNote.Draw();
		//exploreNote.Draw();
		//chromBtnsScroll.Draw();
	    // btnTest1.OnClick = function(param:Object)
	    // {
//	     	_Global.Log("click 1");
	    // };
	    //  btnTest2.OnClick = function(param:Object)
	    // {
//	     	_Global.Log("click 2");
	    // };

	    MarchSearchBtn.Draw();
	    worldbossBtn.Draw();
		worldbossTime.Draw();

	    // WorldBossInfoUIObject.Draw();

	}



	public function DrawMainHead()
	{

		if(disabled && Event.current.type != EventType.Repaint)
			return;

		//topBg.Draw();
		//resourceBg.Draw();
		//btnRes.Draw();
		//resourceCom.Draw();
		//time.Draw();
		//btnCities.Draw();
		//cityBack.Draw();
		//l_city.Draw();

		citiesNoteBack.Draw();
		citiesNote.Draw();
		//citycoord.Draw();
		//cityName.Draw();

		var oldMatrix : UnityEngine.Matrix4x4 = UIElementMgr.ResetMatrix();

		if (null != buffObjElem)
			buffObjElem.Draw();
		else
			buffObj.Draw();
		//ShowProgress();
		UIElementMgr.RestoryMatrix(oldMatrix);
		//btnRoundTower.Draw();

		//btnSaleIcon.Draw();
		//btnBeginner.Draw();
		//btnUniversalOffer.Draw();
		//btnBlueLight.Draw();

		//labelBeginnerTimer.Draw();
		//labelOfferTimer.Draw();

		//btnMoney.Draw();
		//btnHome.Draw();
		//money.Draw();
		//gemIcon.Draw();
		//crown.Draw();
		//level.Draw();
		//might.Draw();
		//userName.Draw();
		//xpBar.Draw();

		//if(gemsAnimation)
		//{
		//	gemsAnimation.Draw();
		//}

		//noticeRow.Draw();
		//noticeButton.Draw();
		//noticeIcon.Draw();
	}


	public function setSeniorGambleState(hasActivity:boolean):void
	{
//		if(hasActivity)
//		{
//			chromBtnGamble.setPicture("button_icon_item2");
//		}
//		else
//		{
//			chromBtnGamble.setPicture("button_icon_item");
//		}
	}

	function changeGambleState(freeCnt : int):void
	{
		if(freeCnt>0){//have free open box chance,box state is open
			chromBtnGamble.setPicture("button_icon_item2");
		}else{//don't have free open box chance,box state is close
			chromBtnGamble.setPicture("button_icon_item");
		}

	}

	function DrawBackground()
	{
	//	if(Event.current.type != EventType.Repaint)
	//		return;
	//	//bottomBar.Draw();
	}

	private function priv_drawMask() : void
	{
		if ( g_fullScreenMask == null )
			return;
		//	TODO: Use camer rect to draw.
		var maskRect : Rect = new Rect(0, 0, 640, 0);
		var gameMain : GameMain = GameMain.instance();
		if ( gameMain == null )
			return;

		switch ( gameMain.getScenceLevel() )
		{
		case GameMain.CITY_SCENCE_LEVEL:
		case GameMain.FIELD_SCENCE_LEVEL:
			maskRect.y = this.btnRes.rect.yMax - 20;
			break;
		case GameMain.AVA_MINIMAP_LEVEL:
		case GameMain.WORLD_SCENCE_LEVEL:
			maskRect.y = this.coordinateBar.rect.yMax - 20;
			break;
		}
		maskRect.height = this.chatIcon2.rect.yMax - rect.y;

		GUI.DrawTexture(maskRect, g_fullScreenMask);
	}

	public function Draw()
	{
	//	super.Draw();
		if(GameMain.instance() != null && GameMain.instance().getScenceLevel() != GameMain.AVA_MINIMAP_LEVEL &&
				GameMain.instance().getScenceLevel() > GameMain.WORLD_SCENCE_LEVEL)
		{
			return;
		}
		if(!visible)
			return -1;
		if(disabled && Event.current.type != EventType.Repaint)
			return;

		priv_drawMask();

		this.priv_resetLayout();
//		GUI.BeginGroup(rect);

		DrawBackground();
		//DrawTitle();
		var gMain:GameMain = GameMain.instance();
		if(Event.current.type == EventType.Repaint)
		{
			priv_drawLayout();
			if( gMain && ( gMain.getScenceLevel()  == GameMain.WORLD_SCENCE_LEVEL ||
							gMain.getScenceLevel()  == GameMain.AVA_MINIMAP_LEVEL )){
				//coordinateBar.Draw();

	//			if( gMain.getMapController() && gMain.getMapController().isFetchingTile() ){
				//	waitingLabel.Draw();
	//			}
//				worldMapBuff.Draw();
			}else{
				DrawMainHead();
			}
			DrawItem();
		}
		else
		{
			DrawItem();

            priv_drawLayout();

			if( gMain && ( gMain.getScenceLevel() == GameMain.AVA_MINIMAP_LEVEL || gMain.getScenceLevel()  == GameMain.WORLD_SCENCE_LEVEL )){
			//	coordinateBar.Draw();

	//			if( gMain.getMapController() && gMain.getMapController().isFetchingTile() ){
			//		waitingLabel.Draw();
	//			}
//				worldMapBuff.Draw();
			}else{
				DrawMainHead();
			}
		}
//		GUI.EndGroup();
	}

	public function AddBuildProgress(queueitem:QueueItem)
	{
		var cityId =GameMain.instance().getCurCityId();

		if(queueitem && queueitem.needed == 0)
			return;

		if( buildSlot == null)
		{
			buildSlot = Instantiate( progressSlot);
		}
		buidingList.UpdateData();

		if(queueitem == null)
			queueitem = BuildingQueueMgr.instance().first(cityId);

		buildSlot.Init(queueitem);

		if(queueitem.level > 0)
		{
			buildSlot.changeBackground(blueBackground);
		}
		else
		{
			buildSlot.changeBackground(redBackground);
		}
		researchShortcut.SetVisible(false);
		buidingList.AddItem(buildSlot);
		buidingList.UpdateData();
		buidingList.ShowAll();
		CheckQueueStateAfterAdd(buidingList);
		if ( curProgressList == buidingList )
			m_needResort = true;
	}
	public function addBuildProgress(qItem:QueueItem):void
	{
//		if( researchSlot == null)
//		{
			researchSlot = Instantiate( progressSlot);
//		}
		buidingList.UpdateData();
		researchSlot.Init(qItem);
		researchShortcut.SetVisible(false);
		buidingList.AddItem(researchSlot);
		buidingList.UpdateData();
		buidingList.ShowAll();
		CheckQueueStateAfterAdd(buidingList);
		if ( curProgressList == buidingList )
			m_needResort = true;
	}

	public function AddTrainProgress()
	{
		trainList.Clear();
		var trainItem:QueueItem = Barracks.instance().Queue.First();
		if( trainItem != null ){
			if( trainSlot == null)
			{
				trainSlot = Instantiate( progressSlot);
			}
			trainSlot.Init(trainItem);
			trainList.AddItem(trainSlot);
		}

		trainItem  = Walls.instance().Queue.First();
		if( trainItem!=null){
			if( wallTrainSlot == null)
			{
				wallTrainSlot = Instantiate( progressSlot);
			}
			wallTrainSlot.Init(trainItem);
			trainList.AddItem(wallTrainSlot);
		}

		for ( var item : HealQueue.HealQueueItem in HealQueue.instance().Queue() )
		{
			var slotDat : ProgressSlot = Instantiate( progressSlot);
			slotDat.Init(item);
			trainList.AddItem(slotDat);
		}
		trainShortcut.SetVisible(false);
		trainList.UpdateData();
		trainList.ShowAll();
		CheckQueueStateAfterAdd(trainList);
		if ( curProgressList == trainList )
			m_needResort = true;
	}

	public function DelEmptyWilderSlot():void
	{
		for(var i:int = 0; i<10; i++)
		{
			if(wildernessSlots[i]  != null)
			{
				if(wildernessSlots[i].willBeRemoved() && wildernessSlots[i].getElement() != null)
				{
					wildernessSlots[i].clearElement();
				}
			}
		}
	}

	public function AddConqueredWild(qItem:QueueItem):void
	{
		exploreList.UpdateData();
		//exploreList.UpdateData();
		var index:int = 0;
		for(var i:int = 0; i<10; i++)
		{
			if(wildernessSlots[i]  == null)
			{
				index = i;
				wildernessSlots[index] = Instantiate( progressSlot);
				break;
			}
			else if(wildernessSlots[i].willBeRemoved())
			{
				index = i;
				break;
			}
		}

		var marchWidth:int = 379;

		wildernessSlots[index].progressBar.rect.width = marchWidth;
		wildernessSlots[index].Init(qItem);
		exploreList.AddItem(wildernessSlots[index]);

		exploreList.UpdateData();
		tileShortcut.SetVisible(false);
		ClickExploreQueue(null);
		//exploreList.ShowAll();
		CheckQueueStateAfterAdd(exploreList);
	}

//	public function PrePage()
//	{
//		marchList.PrePage();
//	}

	public function addMarchProgress(qItem:QueueItem):void
	{
		marchList.UpdateData();
		//exploreList.UpdateData();
		var index:int = 0;
		for(var i:int = 0; i<marchSlots.length; i++)
		{
			if(marchSlots[i]  == null)
			{
				index = i;
				marchSlots[index] = Instantiate( progressSlot);
				break;
			}
			else if(marchSlots[i].willBeRemoved())
			{
				index = i;
				break;
			}
		}

		var marchWidth:int = 379;
//		var scoutWidth:int = 490;
//		if(qItem.classType == QueueType.ScoutQueue)
//			marchSlots[index].progressBar.rect.width = scoutWidth;
//		else
			marchSlots[index].progressBar.rect.width = marchWidth;
		marchSlots[index].Init(qItem);
		marchList.AddItem(marchSlots[index]);
		marchList.UpdateData();
		ClickMarchQueue(null);
		marchList.Hide();
		CheckQueueStateAfterAdd(marchList);
		if ( curProgressList == marchList )
			m_needResort = true;
	}

	public function updateSalesIcon():void
	{
		var saleArray:Array = saleNotices.instance().GetNoticesList();
		if(saleArray == null || saleArray.length == 0 || KBN.FTEMgr.isFTERuning())
		{
			btnSaleIcon.SetVisible(false);
		}
		else
		{
			saleItem = (saleArray[0] as saleNotice);
			btnSaleIcon.Init(saleItem);
			btnSaleIcon.SetVisible(true);
		}

        btnStatePopup.SetVisible(!btnSaleIcon.isVisible());

		this.m_needResort = true;
	}
	private function getMarchSlotIndexWithId(marchId:int):int
	{
		for(var i:int = 0; i<marchSlots.length; i++)
		{
			if(marchSlots[i] != null && (marchSlots[i] as ProgressSlot).getElement() != null && marchSlots[i].getElement().id == marchId)
			{
				return i;
			}
		}
		return -1;
	}

	public function updateMarchProgress(qItem:QueueItem,marchId:int):void
	{
		for(var i:int = 0; i<marchSlots.length; i++)
		{
			if(i>=(marchList.GetItemsCnt()) || marchList.getItem(i)  == null)
			{
				continue;
			}
			else
			{
				var index:int = getMarchSlotIndexWithId(marchId);
				if(index == -1)
					continue;

				marchSlots[index].Init(qItem);
				for(var j:int = 0;j<marchList.GetItemsCnt();j++)
				{
					if(j>=(marchList.GetItemsCnt()) || marchList.getItem(j)  == null)
					{
						continue;
					}
					var temp:ProgressSlot = marchList.getItem(j) as ProgressSlot;
					if( temp != null && ((temp.getElement()) as MarchVO) != null && ((temp.getElement()) as MarchVO).marchId == marchId )
						marchList.setItem(j, marchSlots[index]);
				}
				break;
			}
		}
	}

	public function OnPush(param:Object)
	{
		checkIphoneXAdapter();
		InitProgress();
		curProgressList = buidingList;

		curProgressList.ShowAll();
		btnShowList.image = downBtnTexture;

		CityQueue.instance().CheckNewCtiyRequirement();
		//priv_resetLayout();
	}
	public function OnPushOver()
	{
		_Global.Log("[MainChrom OnPushOver]");
		//SetSODAVisible(KBNSODA.Instance.Visible);
		this.Update();
		this.ShowNewPrivaliage();
		RefreshServerMergePosition();
	}

	private var nexProgressList:ProgressList = null;
	private var isChangeProgressList:boolean = false;
	private var changeProgressListCounter:float = 0;
	private var changeProgressListGap:float = 0.2;
	private function UpdateProgressListAnimation():void
	{
		if(!isChangeProgressList)
		{
			return;
		}

		curProgressList.Update();

		if(curProgressList.isFinish())
		{
			if(nexProgressList != null)
			{
				changeProgressListCounter += Time.deltaTime;

				if(changeProgressListCounter <= changeProgressListGap)
				{
					return;
				}

				curProgressList = nexProgressList;
				nexProgressList = null;
				curProgressList.showAllWithAnimation();
				CheckQueueState(false);
				this.priv_unpdateCurProgressList();
			}
			else
			{
				isChangeProgressList = false;
				changeProgressListCounter = 0;
			}
		}
	}

	public function InitProgress()
	{
		buidingList.Init(this);
		trainList.Init(this);
		marchList.Init(this);
		exploreList.Init(this);

		btnBuildQueue.mystyle.normal.background = selectedBtnTexture;
		btnTrain.mystyle.normal.background = normalBtnTexture;
		btnMarch.mystyle.normal.background = normalBtnTexture;
		btnExplore.mystyle.normal.background = normalBtnTexture;

		initItemToList();
	}

	public	function	InitAfterChangeCity(){

		buidingList.Clear();
		trainList.Clear();
		marchList.Clear();
		exploreList.Clear();

		for(var i:int = 0; i<marchSlots.length; i++)
		{
			if(marchSlots[i]  != null)
			{
				TryDestroy(marchSlots[i] as ProgressSlot);
				marchSlots[i] = null;
			}
		}
//
		for(var j:int = 0; j<10; j++)
		{
			if(wildernessSlots[j]  != null)
			{
				TryDestroy(wildernessSlots[j] as ProgressSlot);
				wildernessSlots[j] = null;
			}
		}

		initItemToList();

		researchShortcut.SetVisible(false);
		trainShortcut.SetVisible(false);
		tileShortcut.SetVisible(false);

		if(curProgressList && curProgressList.GetItemsCnt() > 0)
		{
//			curProgressState = 1;
	 		//curProgressList.curState = ProgressList.ProgressState.STOP;
			//ChangeQueueState();
			priv_onProgressListChanged(curProgressList);
		}

	}

	private	function	initItemToList(){
		var cityId =GameMain.instance().getCurCityId();
		var newItem:ProgressSlot;

		if(BuildingQueueMgr.instance().first(cityId) != null)
		{
			/*
			newItem = Instantiate( progressSlot);
			newItem.Init(BuildingQueueMgr.instance().first(cityId));
			buidingList.AddItem(newItem);
			*/
			this.AddBuildProgress(null);
		}

		var techQueue : TechnologyQueueElement = Technology.instance().getFirstQueue();
		if(techQueue != null)
		{
			newItem = Instantiate( progressSlot);
			newItem.Init( techQueue );
			buidingList.AddItem(newItem);
		}

		if(Research.instance().getItemAtQueue(0,cityId) != null)
		{
			newItem = Instantiate( progressSlot);
			newItem.Init( Research.instance().getItemAtQueue(0,cityId) );
			buidingList.AddItem(newItem);
		}

		if(Barracks.instance().Queue.First() != null)
		{
			newItem = Instantiate( progressSlot);
			newItem.Init(Barracks.instance().Queue.First());
			trainList.AddItem(newItem);
		}

		if(Walls.instance().Queue.First() != null)
		{
			newItem = Instantiate( progressSlot);
			newItem.Init(Walls.instance().Queue.First());
			trainList.AddItem(newItem);
		}

		for ( var item : HealQueue.HealQueueItem in HealQueue.instance().Queue() )
		{
			newItem = Instantiate( progressSlot);
			newItem.Init(item);
			trainList.AddItem(newItem);
		}

		var wilderQueue:BaseQueue = WildernessMgr.instance().getQueue(cityId);
		var j:int;
		if(wilderQueue)
		{
			for(j=0;j<wilderQueue.itemList.length; j++)
			{
				 var tempWild:WildernessVO = wilderQueue.itemList[j] as WildernessVO;
				 if(wildernessSlots[j] == null && tempWild != null && tempWild.tileStatus == Constant.WildernessState.DURINGCD )
				 {
				 	 wildernessSlots[j] = Instantiate( progressSlot);
				 	 wildernessSlots[j].Init(wilderQueue.itemList[j]);
					 exploreList.AddItem(wildernessSlots[j]);
				 }
			}
		}

		var marchQueue:BaseQueue = March.instance().getQueue(cityId);
		var i:int;
		if(marchQueue)
		{
			for(i=0;i<marchQueue.itemList.length; i++)
			{
				 //newItem = Instantiate( progressSlot);
				 if(marchSlots[i] == null)
				 	marchSlots[i] = Instantiate( progressSlot);
				 //newItem.Init(marchQueue.itemList[i]);
				 marchSlots[i].Init(marchQueue.itemList[i]);
				 marchList.AddItem(marchSlots[i]);
			}
		}

		var scoutQueue:BaseQueue = Scout.instance().getQueue(cityId);
		if(scoutQueue)
		{
			var offset : int = 0;
			if ( marchQueue != null )
				offset = marchQueue.itemList.length;

			for(i=0;i<scoutQueue.itemList.length; i++)
			{
				var index:int = i + offset;
				if(marchSlots[index] == null)
					marchSlots[index] = Instantiate( progressSlot);
				 marchSlots[index].Init(scoutQueue.itemList[i]);
//				 newItem = Instantiate( progressSlot);
//				 newItem.Init(scoutQueue.itemList[i]);
				 marchList.AddItem(marchSlots[index]);
			}
		}
	}

	function SwitchView(param:Object)
	{
		if (KBHook.getInstance().isKeyBoardVisible() == true) {
			KBHook.getInstance().setKeyBoard(null);
		}


		//btnSwitchView.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_switchview_down",TextureType.BUTTON);

		GameMain.instance().nextLevel();
	}

	function SetView(curlevel:int)
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		switch(curlevel)
		{
		case GameMain.CITY_SCENCE_LEVEL:
			btnSwitchView.mystyle.normal.background = texMgr.LoadTexture("button_switchview_city_normal",TextureType.BUTTON);
			g_fullScreenMask = texMgr.LoadTexture("bg_mask", TextureType.DECORATION);
			break;
		case GameMain.FIELD_SCENCE_LEVEL:
			btnSwitchView.mystyle.normal.background = texMgr.LoadTexture("button_switchview_field_normal",TextureType.BUTTON);
			g_fullScreenMask = texMgr.LoadTexture("bg_mask", TextureType.DECORATION);
			break;
		case GameMain.AVA_MINIMAP_LEVEL:
		case GameMain.WORLD_SCENCE_LEVEL:
			btnSwitchView.mystyle.normal.background = texMgr.LoadTexture("button_switchview_worldmap_normal",TextureType.BUTTON);
			g_fullScreenMask = texMgr.LoadTexture("mask", TextureType.DECORATION);
			break;
		}

		var nexLevel:int = curlevel + 1;

		if(nexLevel > GameMain.WORLD_SCENCE_LEVEL && nexLevel != GameMain.AVA_MINIMAP_LEVEL )
		{
			nexLevel = GameMain.CITY_SCENCE_LEVEL;
		}

		var nexBtnBg:Texture2D;
		switch(nexLevel)
		{
		case GameMain.CITY_SCENCE_LEVEL:
			nexBtnBg = TextureMgr.instance().LoadTexture("button_switchview_city_normal",TextureType.BUTTON);
			break;
		case GameMain.FIELD_SCENCE_LEVEL:
			nexBtnBg = TextureMgr.instance().LoadTexture("button_switchview_field_normal",TextureType.BUTTON);
			break;
		case GameMain.AVA_MINIMAP_LEVEL:
		case GameMain.WORLD_SCENCE_LEVEL:
			nexBtnBg = TextureMgr.instance().LoadTexture("button_switchview_worldmap_normal",TextureType.BUTTON);
			break;
		}

//		btnSwitchView.setNextNormalBG(nexBtnBg);
	}

	function UpdateData()
	{
		var seed:HashObject = GameMain.instance().getSeed();
		var nextlvlxp:int = _Global.INT32(seed["xp"]["nextlvlxp"]) + 1;
		xpBar.Init( _Global.INT32(seed["xp"]["xp"]), nextlvlxp );
	}

	public function handleNotification(type:String, body:Object):void
	{
		var x:int;
		var y:int;
		var width:int;
		var height:int;
		switch(type)
		{
			case Constant.Notice.SODA_VISIBLE:
				var vis:boolean = body;
				//SetSODAVisible(vis);
				break;
			case Constant.Notice.ATTACKINFO:
				if(CityQueue.instance().NotifyAttack)
				{
					citiesNoteBack.TileName = "Multi_city_icon";
					citiesNote.Background = TextureMgr.instance().LoadTexture("Warning",TextureType.DECORATION);
					x = citiesNoteBack.Region.x + (citiesNoteBack.Region.width - citiesNote.Background.width/2)/2;
				 	y = citiesNoteBack.Region.y + (citiesNoteBack.Region.height - citiesNote.Background.height/2)/2;
				 	width = citiesNote.Background.width/2 ;
				 	height = citiesNote.Background.height/2;
				 	citiesNote.Region = new Rect(x,y,width, height);
				 	citiesNote.SetVisible(true);
					citiesNoteBack.SetVisible(true);
			 	}
			 	else if(!CityQueue.instance().ReachNewCityLevel())
			 	{
			 		citiesNote.SetVisible(false);
					citiesNoteBack.SetVisible(false);
			 	}

				break;
			case Constant.Notice.LEVEL_UP:
//				if(CityQueue.instance().ReachNewCityLevel())
//				{
//					citiesNoteBack.TileName = "Multi_city_icon_Green";
//					citiesNote.Background = Resources.Load("Textures/UI/decoration/add");
//					x = citiesNoteBack.Region.x + (citiesNoteBack.Region.width - citiesNote.Background.width/2)/2;
//				 	y = citiesNoteBack.Region.y + (citiesNoteBack.Region.height - citiesNote.Background.height/2)/2;
//				 	width = citiesNote.Background.width/2 ;
//				 	height = citiesNote.Background.height/2;
//				 	citiesNote.Region = new Rect(x,y,width, height);
//				 	citiesNote.SetVisible(true);
//					citiesNoteBack.SetVisible(true);
//				}
//				else if(!CityQueue.instance().NotifyAttack)
//				{
//					citiesNote.SetVisible(false);
//					citiesNoteBack.SetVisible(false);
//				}
				if(GameMain.instance().IsPveOpened() && KBN.PveController.instance().GetPveMinLevel () <= GameMain.instance().getPlayerLevel ())
				{
					chromBtnCampaign.animationLabel.SetVisible(true);
				}
				break;
			case Constant.Notice.NOTE_NEWCITY:
				cityBack.TileName = "";
				break;
			case Constant.Notice.WILDSLOTS_UPDATE:
				DelEmptyWilderSlot();
				break;
            case Constant.Notice.DailyLoginRewardFeatureOnOrOff:
            case Constant.Notice.DailyLoginRewardClaimSuccess:
                UpdateDailyLoginBtnVisibility();
                break;
            case Constant.Notice.DailyLoginRewardUpdateDataSuccess:
                UpdateDailyLoginBtnVisibility();
                SetShouldOpenDailyLoginRewardMenu();
                break;
            case Constant.MergeServer.GetAllServerMergeMsgOk:
            	PushServerMergeMenu();
           	 	break;
           	case Constant.Notice.ServerMergeSwitchChanged:
           	case Constant.Notice.WorldMapActivityChanged:
           	case Constant.AvaNotification.StatusChanged:
           		RefreshServerMergePosition();
           		break;
            case Constant.Notice.DailyQuestProgressIncreased:
                RefreshCurrentMission();
                break;
            default: break;
		}
	}

    private function RefreshServerMergePosition()
    {
    	var btnMergeServer = m_btnMergeServer.RealObj as SimpleButton;
		var l_bgMergeServer = m_bgMergeServer.RealObj as SimpleLabel;
    	var bMergeServerOpen:boolean = GameMain.singleton.IsServerMergeOpened();

		btnMergeServer.SetVisible(bMergeServerOpen&&
			!(GameMain.instance().getScenceLevel()==GameMain.WORLD_SCENCE_LEVEL&&GameMain.singleton.IsHaveRealWorldBoss()));
		l_bgMergeServer.SetVisible(bMergeServerOpen&&
			!(GameMain.instance().getScenceLevel()==GameMain.WORLD_SCENCE_LEVEL&&GameMain.singleton.IsHaveRealWorldBoss()));
		setCenterComponentVisible(bMergeServerOpen);

		var btnAvaEvent = m_btnAvaEvent.RealObj as SimpleButton;
		var bShowAvaEvent:boolean = !bMergeServerOpen && (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Prepare
		|| GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Match || GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Frozen
		|| GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Combat || GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.EndFrozen);
		btnAvaEvent.SetVisible(bShowAvaEvent&&
			!(GameMain.instance().getScenceLevel()==GameMain.WORLD_SCENCE_LEVEL&&GameMain.singleton.IsHaveRealWorldBoss()));

		var btnNoticePad = m_btnNoticePad.RealObj as SimpleButton;
		var bShowNoticePad:boolean = !bShowAvaEvent && KBN.GameMain.singleton.IsWorldMapActivityOpened();
		btnNoticePad.SetVisible(bShowNoticePad&&
			!(GameMain.instance().getScenceLevel()==GameMain.WORLD_SCENCE_LEVEL&&GameMain.singleton.IsHaveRealWorldBoss()));


    }

    private function SetShouldOpenDailyLoginRewardMenu() {
        if (!MystryChest.instance().IsLoadFinish && DailyLoginRewardMgr.Instance.HasMystryChest) {
            this.openDailyLoginOnMystryChestLoad = true;
        } else {
            DoOpenDailyLoginRewardMenu();
        }
    }

    private function DoOpenDailyLoginRewardMenu() {
        if (!MenuMgr.getInstance().getMenu("DailyLoginRewardMenu")) {
        	var transition : String = "trans_zoomComp";
            if (GameMain.instance().curSceneLev() == GameMain.CITY_SCENCE_LEVEL || GameMain.instance().curSceneLev() == GameMain.FIELD_SCENCE_LEVEL)
            {
                MenuMgr.getInstance().PushMenu("DailyLoginRewardMenu", null,
                    transition, priv_screenPosToLogicPos(btnDailyLogin.rect.center));
            }
            else if (GameMain.instance().curSceneLev() == GameMain.WORLD_SCENCE_LEVEL ||
            		GameMain.instance().curSceneLev() == GameMain.AVA_MINIMAP_LEVEL)
            {
                MenuMgr.getInstance().PushMenu("DailyLoginRewardMenu", null,
                    transition);
            }
        }
    }

    private function DoOpenDailyLoginRewardMenuCo() : IEnumerator {
        yield;
        DoOpenDailyLoginRewardMenu();
    }

	private var m_layOutMain : UILayout.Grid;
	//private var m_layOutTop : UILayout.Grid;
	private var m_needResort : boolean = false;
	private var m_needRevisite : boolean = true;
	private var m_uiElement : System.Collections.Generic.List.<IUIElement>;
	private var m_uiElementMgr : UIElementMgr = new UIElementMgr();

	//	Begin World Map Usage.
	private var m_coordUI : UILayout.UIFrame;
	private var m_bodyPanelInWorld : UILayout.UIFrame;
	private var m_bodyPanelInCityAndField : UILayout.UIFrame;
	private var m_bodyFrameInWorld : IUIElement;
	private var m_bodyFrameCityAndField : IUIElement;
	private var m_bodyFrame : IUIElement;
	//	End World Map Usage.

	//	Begin No World Map Usage.
	private var m_topBar : UILayout.UIFrame;
	private var m_middelFrame : UILayout.Grid;
	//	End No World Map Usage.

	private var m_lastGameViewType : int;// = GameMain.CITY_SCENCE_LEVEL;

	private class MaxSizeChangedValue
	{
		public function MaxSizeChangedValue(inUISize : UILayout.UISize, inUILowMax : uint, inUIHighMax : uint)
		{
			uiSize = inUISize;
			uiLowMax = inUILowMax;
			uiHighMax = inUIHighMax;
		}
		public var uiSize : UILayout.UISize;
		public var uiLowMax : uint;
		public var uiHighMax : uint;
	}

	public function get CoordingBarHeight() : float
	{
		return coordinateBar.bgLabel.rect.yMax;
	}

	//private var m_needResizeData : System.Collections.Generic.List.<MaxSizeChangedValue>;

	public function get BodyElement() : IUIElement
	{
		return m_bodyFrame;
	}

	public function priv_initLayout()
	{
		var initPropList : System.Collections.Generic.Dictionary.<String, Object> = priv_getCurInitPropList();
		var rootObj : UILayout.UIFrame ;
		var currentCastleLevel=Resource.instance().GetCastleLevel();
		if(currentCastleLevel >= Constant.CarmotLimitLevel){
			rootObj = priv_loadXml("MainChrome2", initPropList);
		}else{
			rootObj = priv_loadXml("MainChrome1", initPropList);
		}

		m_layOutMain = rootObj.FindItem("MainChrom") as UILayout.Grid;
        var cityDefenseStatusContainer : UIObjContainForLayout
            = rootObj.FindItem("CityDefenseStatus") as UIObjContainForLayout;
        if (cityDefenseStatusContainer != null)
        {
            cityDefenseStatusLabel = (cityDefenseStatusContainer.GetUIItem(0).uiObj as SimpleLabelImple).RealObj
                as SimpleLabel;
            UpdateCityDefenseStatus();
        }

		m_topBar = m_layOutMain.FindItem("MainChrom.TopBar");

        if(currentCastleLevel >= Constant.CarmotLimitLevel){
			m_timeBar=m_topBar.FindItem("MainChrom.TopBar.TopButtonFrame.TopResourcesArea.TopResourceBar.TopTime.TopGrid") as UILayout.Grid;
        	timeBarHeight=m_timeBar.Row(0).Value;
		}else{
			timeBarHeight=0;
		}

        //vip   m_timeBar
		var vipLevelContain : UIObjContainForLayout = m_layOutMain.FindItem("VIPLevel") as UIObjContainForLayout;
		if ( vipLevelContain != null )
		{
			var vipBG : UIObjContainForLayout.UIObjInfo = vipLevelContain.GetUIItem(0);
			if( vipBG != null )
			{
				m_vipBG = vipBG.uiObj as SimpleLabelImple;
			}
			var vipUIObj : UIObjContainForLayout.UIObjInfo = vipLevelContain.GetUIItem(1);
			if ( vipUIObj != null )
				m_vipLevel = vipUIObj.uiObj;
		}

		//mergeServer,notice pad
		var mergeServerContain : UIObjContainForLayout = m_layOutMain.FindItem("RoundTower_ServerMerge") as UIObjContainForLayout;
		if ( mergeServerContain != null )
		{
			var objBtnMergeServer : UIObjContainForLayout.UIObjInfo = mergeServerContain.GetUIItem(0);
			if( objBtnMergeServer != null )
			{
				m_btnMergeServer = objBtnMergeServer.uiObj;
			}
			var objBGMergeServer : UIObjContainForLayout.UIObjInfo = mergeServerContain.GetUIItem(1);
			if ( objBGMergeServer != null )
			{
				m_bgMergeServer = objBGMergeServer.uiObj as SimpleLabelImple;
			}
			var objBtnNoticePad : UIObjContainForLayout.UIObjInfo = mergeServerContain.GetUIItem(2);
			if ( objBtnNoticePad != null )
			{
				m_btnNoticePad = objBtnNoticePad.uiObj;
			}
			var objBtnAvaEvent : UIObjContainForLayout.UIObjInfo = mergeServerContain.GetUIItem(3);
			if ( objBtnAvaEvent != null )
			{
				m_btnAvaEvent = objBtnAvaEvent.uiObj;
			}
			// var objBtnWorldboss : UIObjContainForLayout.UIObjInfo = mergeServerContain.GetUIItem(4);
			// if ( objBtnWorldboss != null )
			// {
			// 	m_btnWorldboss = objBtnWorldboss.uiObj;
			// }
			// var objLabelWorldboss : UIObjContainForLayout.UIObjInfo = mergeServerContain.GetUIItem(5);
			// if ( objLabelWorldboss != null )
			// {
			// 	m_labelWorlboss = objLabelWorldboss.uiObj;
			// }


		}

		// var worldbossContain : UIObjContainForLayout = m_layOutMain.FindItem("WorldBoss") as UIObjContainForLayout;
		// if (worldbossContain!=null) {
		// 	var objworldboss : UIObjContainForLayout.UIObjInfo = worldbossContain.GetUIItem(0);
		// 	if (objworldboss!=null) {
		// 		m_btnWorldboss=objworldboss.uiObj;
		// 	}
		// }

		RefreshServerMergePosition();

		var progressFrame : UILayout.UIFrame = priv_initCenterLayout();
		priv_initWorldMapHead(progressFrame);
		m_needResort = true;
		m_needRevisite = true;

		iconHider.Add(UIElementMgr.GetElements(m_layOutMain), true);
		iconHider.Add(UIElementMgr.GetElements(m_noticeBar), false);
		priv_unpdateCurProgressList();
		var agent = iconHider.Set("BuffObj", buffObjElem);
		if (null != agent)
			buffObjElem = agent;

        dailyLoginRedDotElem = ObjToUI.Cast(dailyLoginRedDot);
        agent = iconHider.Set("dailyLoginRedDot", dailyLoginRedDotElem);
        if (null != agent)
            dailyLoginRedDotElem = agent;
        btnDailyLoginElem = iconHider.Get("btnDailyLogin");

		addServerMergeToHider();
		addNoticePadToHider();
		addAvaEventToHider();
		addWorldbossToHider();

		//force init city mainchrome
		m_uiElementMgr.Reorder(m_layOutMain);
	}



	public function SetSODAVisible(visible:boolean)
	{
//		_Global.Log("[MainChrom SetSODAVisible] Start visible = " + visible + ", m_topBar = " + m_topBar);
//		if(m_topBar == null) return;
//
//		var grid: UILayout.Grid  = m_topBar.FindItem("MainChrom.TopBar.TopButtonFrame.TopButtonBar") as UILayout.Grid;
//		var sodaContainer : UIObjContainForLayout = m_topBar.FindItem("MainChrom.TopBar.TopButtonFrame.TopButtonBar.SODA") as UIObjContainForLayout;
//		if(sodaContainer == null) return;
//		var ui:UIObjContainForLayout.UIObjInfo = sodaContainer.GetUIItem(0);
//		if(ui == null) return;
//		var sb:AgentElement = ui.uiObj;
//		if(sb == null) return;
//		var sodaButton:Button = sb.RealObj as Button;
//		if(sodaButton == null) return;
//
//		if(visible)
//		{
//			//set border
//			sodaButton.mystyle.border.left = 15;
//			sodaButton.mystyle.border.right = 15;
//			sodaButton.mystyle.border.top = 5;
//			sodaButton.mystyle.border.bottom = 5;
//			//set width
//			var colsv:UILayout.Grid.Grid_ColumnDefinitions = grid.ColumnDefinitions;
//			var colv:UILayout.Grid_ColumnDefinition = colsv[2];
//			if(_Global.IsLargeResolution())
//			{
//				//colv.Width.Weight = 122;
//				colv.Width.Value = 122;
//			}
//			else
//			{
//				//colv.Width.Weight = 61;
//				colv.Width.Value = 61;
//			}
//		}
//		else
//		{
//			//set border
//			sodaButton.mystyle.border.left = 0;
//			sodaButton.mystyle.border.right = 0;
//			sodaButton.mystyle.border.top = 0;
//			sodaButton.mystyle.border.bottom = 0;
//
//
//			var colsu:UILayout.Grid.Grid_ColumnDefinitions = grid.ColumnDefinitions;
//			var colu:UILayout.Grid_ColumnDefinition = colsu[2];
//			//colu.Width.Weight = 0;
//			colu.Width.Value = 0;
//		}
//
//		_Global.Log("[MainChrom SetSODAVisible] End visble = " + visible);
//		m_needResort = true;
	}


	private function priv_getCurInitPropList() : System.Collections.Generic.Dictionary.<String, Object>
	{
		var initPropList : System.Collections.Generic.Dictionary.<String, Object> = new System.Collections.Generic.Dictionary.<String, Object>();
		initPropList["@ThisMenu"] = this;
		return initPropList;
	}

	private function priv_loadXml(fileName : String, initPropList : System.Collections.Generic.Dictionary.<String, Object>) : UILayout.UIFrame
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		return texMgr.LoadUILayout(fileName, initPropList);
	}

	private function priv_initWorldMapHead(marchProgressGrid : UILayout.UIFrame)
	{
		m_coordUI = coordinateBar.UIFrame;

		var waitingUI : UIObjContainForLayout = new UIObjContainForLayout();
		waitingUI.Name = "WaitingUI";
		//waitingLabel.rect = waitingLabel.layout;
		waitingUI.AddItem(ObjToUI.Cast(moveMapLoadingLabel), 0, UIObjContainForLayout.FillHorizon.Center, UIObjContainForLayout.FillVertical.Center, UIObjContainForLayout.LockType.LockSize);
		m_bodyPanelInWorld = waitingUI;
		m_bodyFrameInWorld = waitingUI.GetElement(0);

		var layoutCenter : UILayout.Grid = new UILayout.Grid(1, 2);
		layoutCenter.AddItem(marchProgressGrid, 0, 1);
		waitingUI.AddItem(layoutCenter);

		waitingUI.AddItem(ObjToUI.Cast(worldMapBuff), 1, UIObjContainForLayout.FillHorizon.DockRight, UIObjContainForLayout.FillVertical.DockTop, UIObjContainForLayout.LockType.LockSize);

		waitingUI.Parent = m_layOutMain;
	}

	private function priv_initCenterLayout() : UILayout.Grid
	{
		var panel : UILayout.Panel = m_layOutMain.FindItem("BodyFrame");//new UILayout.Panel();
		m_bodyPanelInCityAndField = panel;

		var bodyFrame : UIObjContainForLayout = m_layOutMain.FindItem("_BodyFrame");//new UIObjContainForLayout();
		m_bodyFrameCityAndField = bodyFrame.GetElement(0);
		m_bodyFrame = m_bodyFrameCityAndField;

		var middelFrame : UILayout.Grid = m_layOutMain.FindItem("MainChrom.MiddelFrame");//new UILayout.Grid(1, 2);
		m_middelFrame = middelFrame;

			var noticeBarRoot : UILayout.UIFrame = 	priv_loadXml("NoticeBar", this.priv_getCurInitPropList());

			//var noticeBar : UIObjContainForLayout = new UIObjContainForLayout();
			m_noticeBar = noticeBarRoot;
			//noticeBar.Name = "MainChrom.MiddelFrame.NoticeBar";
			//middelFrame.Row(0).Value = 0;
			//noticeBar.TargetArea.Height.Value = 92;
			//noticeBar.AddItem(ObjToUI.Cast(noticeButton), 0, UIObjContainForLayout.FillHorizon.Fill, UIObjContainForLayout.FillVertical.Fill, UIObjContainForLayout.LockType.LockHeight);
			//noticeBar.AddItem(ObjToUI.Cast(noticeRow), 1, UIObjContainForLayout.FillHorizon.Fill, UIObjContainForLayout.FillVertical.Fill, UIObjContainForLayout.LockType.LockHeight);
			//noticeBar.AddItem(ObjToUI.Cast(noticeIcon), 2, UIObjContainForLayout.FillHorizon.DockLeft, UIObjContainForLayout.FillVertical.Center, UIObjContainForLayout.LockType.LockSize);


						var topBuffIconsFrame : UIObjContainForLayout = m_layOutMain.FindItem("MainChrom.MiddelFrame.LeftIconsGrid.RightDats.TopBuffIconsGrid.TopBuffIconsFrame");//new UIObjContainForLayout();
						topBuffIconsFrame.SetChrFrame(buffObj.UIFrame);

						buffObjElem = ObjToUI.Cast(buffObj);


		var progressViewGrid : UILayout.Grid = m_layOutMain.FindItem("ProgressView") as UILayout.Grid;//new UILayout.Grid(1, 2);

					var marchProgressGrid : UILayout.Grid = m_layOutMain.FindItem("MainChrom.MiddelFrame.LeftIconsGrid.RightDats.MarchProgressGrid") as UILayout.Grid;//new UILayout.Grid(2, 2);

						var progressView : UIObjContainForLayout = m_layOutMain.FindItem("MainChrom.MiddelFrame.LeftIconsGrid.RightDats.MarchProgressGrid.ProgressView") as UIObjContainForLayout;//new UIObjContainForLayout();
						m_progressViewSize = marchProgressGrid.Row(0);
						m_progressViewSize.Value = 0;
						m_progressView = progressView;
						this.priv_unpdateCurProgressList();
		return progressViewGrid;
	}

	private function priv_drawLayout()
	{
		if ( m_needRevisite || m_uiElement == null )
		{
			m_needRevisite = false;
			m_uiElementMgr.CatchElement(m_layOutMain);
		}

		m_uiElementMgr.Draw(MainchromPreDraw, MainchromPostDraw);
	}

	private function MainchromPreDraw()
	{

	}

	private function MainchromPostDraw()
	{
		PopUpLightDraw();
		MergeServerAfxDraw();
		m_btnNoticePad.Draw();
		m_btnAvaEvent.Draw();
		// if (m_btnWorldboss!=null) {
		// 	m_btnWorldboss.Draw();
		// }
		// if (m_labelWorlboss!=null) {
		// 	m_labelWorlboss.Draw();
		// }

        DailyLoginRedDotDraw();
	}

	private function PopUpLightDraw()
	{
		var gMain:GameMain = GameMain.instance();
		if ( gMain != null )
		{
			if(gMain.GetPveFteStep() == 1 && GameMain.instance().IsPveOpened())
			{
				btnPopUpLight.rect.x = btnPopUp.rect.x;
				btnPopUpLight.rect.y = btnPopUp.rect.y;
				btnPopUpLight.rect.width = btnPopUp.rect.width;
				btnPopUpLight.rect.height = btnPopUp.rect.height;
				btnPopUpLight.Draw();
			}
		}
	}
 	private var stepDoing:int = 0;
	@SerializeField private var DeltaTimeStep3ToStep4 : float;
	private var m_deltaTimeStep3ToStep4 : float;
	@SerializeField private var flashSpeed : float;
	private function MergeServerAfxDraw()
	{
		sl_MergeServerArrow1Elem.Draw();
		sl_MergeServerArrow2Elem.Draw();
		sl_MergeServerCircleElem.Draw();
	}

	private function UpdateMergeServerAfxStep1()
	{
		if(stepDoing == 1)
		{
			var oldColor:Color = sl_MergeServerArrow1.GetColor();
			if(oldColor.a < 1)
			{
				oldColor.a += flashSpeed;
				if(oldColor.a > 1) oldColor.a = 1;
				sl_MergeServerArrow1.SetColor(oldColor);
			}
			else
			{
				oldColor.a = 1;
				sl_MergeServerArrow1.SetColor(oldColor);
				stepDoing = 2;
			}
		}
	}

	private function UpdateMergeServerAfxStep2()
	{
		if(stepDoing == 2)
		{
			var oldColor:Color = sl_MergeServerArrow2.GetColor();
			if(oldColor.a < 1)
			{
				oldColor.a += flashSpeed;
				if(oldColor.a > 1) oldColor.a = 1;
				sl_MergeServerArrow2.SetColor(oldColor);
			}
			else
			{
				oldColor.a = 1;
				sl_MergeServerArrow2.SetColor(oldColor);
				stepDoing = 3;
			}
		}
	}

	private function UpdateMergeServerAfxStep3()
	{
		var btnMergeServer = m_btnMergeServer.RealObj as SimpleButton;
		if(stepDoing == 3)
		{
			if(sl_MergeServerCircle.rect.width < 25)
			{
				sl_MergeServerCircleElem.rect.width += flashSpeed*25;
				sl_MergeServerCircleElem.rect.height += flashSpeed*25;
				sl_MergeServerCircleElem.rect.x -= flashSpeed*25/2;
				sl_MergeServerCircleElem.rect.y -= flashSpeed*25/2;
				var oldColor:Color = sl_MergeServerCircle.GetColor();
				if(oldColor.a < 1)
				{
					oldColor.a +=  flashSpeed;
					if(oldColor.a > 1) oldColor.a = 1;
					sl_MergeServerCircle.SetColor(oldColor);
				}
			}
			else
			{
				if(sl_MergeServerCircle.rect.width < 50)
				{
					sl_MergeServerCircleElem.rect.width += flashSpeed*25;
					sl_MergeServerCircleElem.rect.height += flashSpeed*25;
					sl_MergeServerCircleElem.rect.x -= flashSpeed*25/2;
					sl_MergeServerCircleElem.rect.y -= flashSpeed*25/2;

					var oldColor2:Color = sl_MergeServerCircle.GetColor();
					if(oldColor2.a > 0)
					{
						oldColor2.a -=  flashSpeed;
						if(oldColor2.a < 0) oldColor2.a = 0;
						sl_MergeServerCircle.SetColor(oldColor2);
					}
					else
					{
						oldColor2.a = 0;
						sl_MergeServerCircleElem.rect.width = 0;
						sl_MergeServerCircleElem.rect.height = 0;
						sl_MergeServerCircleElem.rect.x = btnMergeServer.rect.x + CIRCLE_OFFSET_X;
						sl_MergeServerCircleElem.rect.y = btnMergeServer.rect.y + CIRCLE_OFFSET_Y;
						sl_MergeServerCircle.SetColor(oldColor2);
						stepDoing = 4;
					}
				}
				else
				{
					oldColor2.a = 0;
					sl_MergeServerCircleElem.rect.width = 0;
					sl_MergeServerCircleElem.rect.height = 0;
					sl_MergeServerCircleElem.rect.x = btnMergeServer.rect.x + CIRCLE_OFFSET_X;
					sl_MergeServerCircleElem.rect.y = btnMergeServer.rect.y + CIRCLE_OFFSET_Y;
					sl_MergeServerCircle.SetColor(new Color(1,1,1,0));
					stepDoing = 4;
				}
			}
		}
	}

	private function UpdateMergeServerAfxStep4()
	{
		if(stepDoing == 4)
		{
			var oldColor:Color = sl_MergeServerArrow1.GetColor();
			if(oldColor.a > 0)
			{
				oldColor.a -=  flashSpeed;
				if(oldColor.a < 0) oldColor.a = 0;
				sl_MergeServerArrow1.SetColor(oldColor);
				sl_MergeServerArrow2.SetColor(oldColor);
			}
			else
			{
				oldColor.a = 0;
				sl_MergeServerArrow1.SetColor(oldColor);
				sl_MergeServerArrow2.SetColor(oldColor);
				stepDoing = 1;
			}
		}
	}

    private function DailyLoginRedDotDraw()
    {
        if (m_bodyFrame == null || m_bodyFrame != m_bodyFrameCityAndField)
        {
            return;
        }

        if (null != dailyLoginRedDotElem)
        {
           dailyLoginRedDotElem.Draw();
        }
        else
        {
           dailyLoginRedDot.Draw();
       }
    }


	var	m_progressViewSize : UILayout.UISize = null;
	var m_progressView : UIObjContainForLayout = null;
	var m_noticeBar : UILayout.UIFrame;
	var m_timeBar : UILayout.Grid;
	var timeBarHeight=0;

	private function priv_unpdateCurProgressList()
	{
		var elem:IUIElement = ObjToUI.Cast(curProgressList);
		var agent:IUIElement = iconHider.Set("ProgressList", elem);
		m_progressView.AddItem(null == agent ? elem : agent, 0,
			UIObjContainForLayout.FillHorizon.DockRight, UIObjContainForLayout.FillVertical.Fill, UIObjContainForLayout.LockType.LockWidth);
		m_progressView.TargetArea.Width.Value = curProgressList.rect.width;
		//m_progressView.TargetArea.Height.Value = curProgressList.rect.height;
		m_needResort = true;
		m_needRevisite = true;
	}

	private function priv_changeNoticeStage(isShow : boolean)
	{
		noticeRow.SetVisible(isShow);
		noticeIcon.SetVisible(isShow);
		noticeButton.SetVisible(isShow);
		if ( isShow )
		{
			if(timeBarHeight!=0){
				m_timeBar.Row(0).Value=0;
			}

			if ( m_middelFrame.Row(0).Value == m_noticeBar.Height.Value )
				return;
			m_middelFrame.AddItem(m_noticeBar, 0, 0);
			m_middelFrame.Row(0).Value = m_noticeBar.Height.Value;
		}
		else
		{
			if(timeBarHeight!=0){
				m_timeBar.Row(0).Value=timeBarHeight;
			}

			if ( m_middelFrame.Row(0).Value == 0 )
				return;
			m_middelFrame.AddItem(null, 0, 0);
			m_middelFrame.Row(0).Value = 0;
		}
		m_needRevisite = true;
		m_needResort = true;
	}


	private function priv_resetLayout() : void
	{
		var curProgressListHeight : uint = curProgressList.rect.height;
 		if ( m_progressViewSize.Min != curProgressListHeight )
 		{
 			m_progressViewSize.Value = curProgressListHeight;
			m_needResort = true;
		}

		priv_testIsNeedChangeMainLayout();

		if ( !m_needResort)
			return;

		priv_resizeSizeValue();
		m_needResort = false;
		m_uiElementMgr.Reorder(m_layOutMain);
		priv_layoutDailyLoginRedDot();

		if ( _Global.IsMiniResolution() )
		{
			chromBtnsScroll.ResetActRect();
		}
		else
		{
			chromBtnsScroll.ActRect = chromBtnsScroll.rect;
		}

		chromBtnsScroll.AutoLayout();
		if(MenuMgr.getInstance() != null)
		{
			var chatMenu : ChatMenu = MenuMgr.getInstance().Chat;
			chatMenu.MainChromChatTextWidth = chatText1.rect.width;
			chatMenu.MainChromChatTextGUIStyle = chatText1.mystyle;
		}
		m_progressViewSize.Value = curProgressListHeight;

		var gMain:GameMain = GameMain.instance();
		if ( gMain != null )
		{
			m_lastGameViewType = gMain.getScenceLevel();
			gMain.setViewPort();
		}

		xpBar.FocusRecalcPercentBarWidth();
		this.priv_recalcChromScrollIntervalSize();
		gemsAnimation.UpdateGemsDefaultRect(gemsAnimation.rect);

		layoutServerMerge();
	}

	private function addServerMergeToHider()
	{
		var mergeServerContain : UIObjContainForLayout = m_layOutMain.FindItem("RoundTower_ServerMerge") as UIObjContainForLayout;
		var objBtnMergeServer : UIObjContainForLayout.UIObjInfo = mergeServerContain.GetUIItem(1);
		var agentBtnMergeServer = iconHider.Set("btnMergeServer", objBtnMergeServer.uiObj);
		if (null != agentBtnMergeServer)
		{
			objBtnMergeServer.uiObj = agentBtnMergeServer;
		}
		var agentBGMergeServer = iconHider.Set("bgMergeServer", m_bgMergeServer);
		if (null != agentBGMergeServer)
			m_bgMergeServer = agentBGMergeServer;

		sl_MergeServerCircleElem = ObjToUI.Cast(sl_MergeServerCircle);
		var sl_MergeServerCircleAgent = iconHider.Set("sl_MergeServerCircle", sl_MergeServerCircleElem);
		if (null != sl_MergeServerCircleAgent)
			sl_MergeServerCircleElem = sl_MergeServerCircleAgent;

		sl_MergeServerArrow1Elem = ObjToUI.Cast(sl_MergeServerArrow1);
		var sl_MergeServerArrow1Agent = iconHider.Set("sl_MergeServerArrow1", sl_MergeServerArrow1Elem);
		if (null != sl_MergeServerArrow1Agent)
			sl_MergeServerArrow1Elem = sl_MergeServerArrow1Agent;

		sl_MergeServerArrow2Elem = ObjToUI.Cast(sl_MergeServerArrow2);
		var sl_MergeServerArrow2Agent = iconHider.Set("sl_MergeServerArrow2", sl_MergeServerArrow2Elem);
		if (null != sl_MergeServerArrow2Agent)
			sl_MergeServerArrow2Elem = sl_MergeServerArrow2Agent;
	}

	private function addAvaEventToHider()
	{
		var agentBtnAvaEvent = iconHider.Set("btnAvaEvent", m_btnAvaEvent);
		if (null != agentBtnAvaEvent)
			m_btnAvaEvent = agentBtnAvaEvent;
	}

	private function addWorldbossToHider(){
		// var agentBtnWorldboss=iconHider.Set("btnWorldboss",m_btnWorldboss);
		// if (null!=agentBtnWorldboss) {
		// 	m_btnWorldboss=agentBtnWorldboss;
		// }

		// var agentLabelWorldboss=iconHider.Set("labelWorldboss",m_labelWorlboss);
		// if (null!=agentLabelWorldboss) {
		// 	m_labelWorlboss=agentLabelWorldboss;
		// }
	}

	private function addNoticePadToHider()
	{
		var agentBtnNoticePad = iconHider.Set("btnNoticePad", m_btnNoticePad);
		if (null != agentBtnNoticePad)
			m_btnNoticePad = agentBtnNoticePad;
	}

	private function layoutServerMerge()
	{
		var btnMergeServer = m_btnMergeServer.RealObj as SimpleButton;
		sl_MergeServerCircleElem.rect.x = btnMergeServer.rect.x + CIRCLE_OFFSET_X;
		sl_MergeServerCircleElem.rect.y = btnMergeServer.rect.y + CIRCLE_OFFSET_Y;

		sl_MergeServerArrow1Elem.rect.x = btnMergeServer.rect.x + ARROW1_OFFSET_X;
		sl_MergeServerArrow1Elem.rect.y = btnMergeServer.rect.y + ARROW1_OFFSET_Y;

		sl_MergeServerArrow2Elem.rect.x = btnMergeServer.rect.x + ARROW2_OFFSET_X;
		sl_MergeServerArrow2Elem.rect.y = btnMergeServer.rect.y + ARROW2_OFFSET_Y;
	}

    private function priv_layoutDailyLoginRedDot()
    {
        var btnRect : Rect = (null != btnDailyLoginElem ? btnDailyLoginElem.rect : btnDailyLogin.rect);
        var diameter : float = dailyLoginRedDotConfig.RelativeRadius * btnRect.width * 2;
        var r:Rect = new Rect(
            btnRect.x + dailyLoginRedDotConfig.XRelativeOffset * btnRect.width,
            btnRect.y + dailyLoginRedDotConfig.YRelativeOffset * btnRect.height,
            diameter, diameter);

        if (null != dailyLoginRedDotElem)
        {
            dailyLoginRedDotElem.rect = r;
        }
        else
        {
            dailyLoginRedDot.rect = r;
        }
	}

	private function priv_resizeSizeValue()
	{
		chromBtnsScroll.forEachNewComponentObj(function(inObj : UIObject)
		{
			var chromObj : ChromeButtonObj = inObj as ChromeButtonObj;
			if ( chromObj == null )
				return;
			if ( _Global.IsLargeResolution() )
			{
				chromObj.btn.SetFont(FontSize.Font_25);
			}
			else
			{
				chromObj.btn.SetFont(FontSize.Font_20);
			}
		});
	}

	private function priv_recalcChromScrollIntervalSize()
	{
		var newHeight : float = 94;
		if(KBN._Global.isIphoneX()){
			newHeight=84;
		}
		var nameFontSize : FontSize = FontSize.Font_20;
		var noticeFontSize : FontSize = FontSize.Font_BEGIN;
		if ( _Global.IsLargeResolution() )
		{
			newHeight = chromBtnsScroll.rect.height - 11;
			//	old is 94 / 105
			nameFontSize = FontSize.Font_40;
			noticeFontSize = FontSize.Font_32;
		}

		chromBtnsScroll.forEachNewComponentObj(function(uiObj : UIObject)
		{
			var chromObj : ChromeButtonObj = uiObj as ChromeButtonObj;
			if ( chromObj == null )
				return;
			chromObj.Resize(newHeight, nameFontSize, noticeFontSize);
		});

		var fCnt : float = chromBtnsScroll.rect.width / chromBtnQuest.rect.width;
		var cnt : int = System.Math.Floor(fCnt);
		var fDelta : float = fCnt - cnt;

		if ( fDelta > 0.6 )
		{
			//	do nothing
		}
		else if ( fDelta < 0.4 )
		{
			--cnt;
		}
		else if ( cnt <= chromBtnsScroll.numUIObject )
		{
			chromBtnsScroll.AutoLayout();
			return;
		}

		if ( cnt > 1 )
		{
			if ( cnt < chromBtnsScroll.numUIObject )
			{
				var needTotalWidth : float = (cnt + 0.5f)*chromBtnQuest.rect.width;
				chromBtnsScroll.IntervalSize = (chromBtnsScroll.rect.width - needTotalWidth) / (cnt - 1);
			}
			else
			{
				chromBtnsScroll.IntervalSize = (chromBtnsScroll.rect.width - cnt * chromBtnQuest.rect.width) / (cnt - 1);
			}
		}
	}

	private function priv_testIsNeedChangeMainLayout() : void
	{
		var gMain:GameMain = GameMain.instance();
		if ( gMain == null )
			return;

		if( gMain.getScenceLevel() == m_lastGameViewType )
			return;

		if ( gMain.getScenceLevel() == GameMain.WORLD_SCENCE_LEVEL ||
			gMain.getScenceLevel() == GameMain.AVA_MINIMAP_LEVEL)
		{
			m_layOutMain.AddItem(m_coordUI, 0, 0);
			m_layOutMain.AddItem(m_bodyPanelInWorld, 0, 1);
			m_bodyFrame = m_bodyFrameInWorld;
			setCenterComponentVisible(false);
		}
		else
		{
			m_layOutMain.AddItem(m_topBar, 0, 0);
			m_layOutMain.AddItem(m_bodyPanelInCityAndField, 0, 1);
			m_bodyFrame = m_bodyFrameCityAndField;
			setCenterComponentVisible(true);
		}

		m_needResort = true;
		m_needRevisite = true;
	}

	private function setCenterComponentVisible(bVisible:boolean)
	{
		sl_MergeServerCircle.SetVisible(bVisible);
		sl_MergeServerArrow1.SetVisible(bVisible);
		sl_MergeServerArrow2.SetVisible(bVisible);
	}

	public function isHitUI(pos : Vector2) : boolean
	{
		if(isVisible())
			return m_uiElementMgr.IsHitUI(pos);
		else
			return false;
	}

	public function priv_screenPosToLogicPos(pt : Vector2) : Vector2
	{
		return new Vector2(pt.x / GameMain.horizRatio, pt.y / GameMain.vertRatio);
	}

	public function OnClickPopUp()
	{
		MenuMgr.getInstance().PushMenu("MainChromPopUpMenu", null, "trans_up_not_hide_bottom");
	}
	private function OpenMarchSearchMenu()
	{
		MenuMgr.getInstance().PushMenu("PveSearchMenu", null, "trans_up_not_hide_bottom");
	}
	private function OpenWorldBossEventMenu()
	{
		var eventId:int=GameMain.singleton.GetCurBossEventId();
		if (eventId!=0) {
			EventCenter.getInstance().reqGetBossEventDetailInfo(eventId,ViewBossEventDetail);
		}
	}
	public var WorldBossInfoUIObject:ComposedUIObj;

	public function SetWorldBossInfoVis(open:boolean,bossInfo:Object){
		if (WorldBossInfoUIObject!=null) {
			WorldBossInfoUIObject.SetVisible(open);
			WorldBossInfoUIObject.OnShow(bossInfo);
		}
	}

	private function ViewBossEventDetail(detail:HashObject,rankData:HashObject[]):void{
		_Global.Log("打开世界boss detail"+detail.ToString());
		// _Global.Log("打开世界boss detail"+rankData.ToString());
		_Global.OpenWorldBossEventType=1;
		MenuMgr.getInstance().PushMenu("WorldBossEventMenu", detail);
	}

	public function OpenServerMerge()
	{
		if(GameMain.singleton.IsServerMergeOpened())
		{
			KBN.MergeServerManager.getInstance().RequestAllServerMergeMsg();
		}
	}

	public function OpenNoticePad()
	{
		var seed : HashObject = KBN.GameMain.singleton.getSeed();
		var allianceID = _Global.INT32(seed["player"]["allianceId"].Value);
		if(_Global.INT32(seed["player"]["allianceId"].Value) == 0)
		{
			MenuMgr.instance.PushMessage( Datas.getArString( "PVP.Battle_FailToaster" ) );
		}
		else
		{
			PvPToumamentInfoData.instance().PopUpNoticePad(1);
		}
	}

	public function PushServerMergeMenu()
	{
		var simpleBtn:SimpleButton = m_btnMergeServer.RealObj as SimpleButton;
		MenuMgr.getInstance().PushMenu("ServerMergeMenu", null, "trans_zoomComp", GameMain.instance().ScreenToRelativeRect(simpleBtn.ScreenRect).center);
	}

	public function OpenAvaEvent()
	{
		MenuMgr.getInstance().PushMenu("AvAEventMenu", null);
	}



}


@UILayout.UIFrameLayout(TypeName="KBNMenu")
class UIMenu
	extends UILayout.Panel
{
	public class MenuProp
		extends UILayout.ModifyProperty.<KBNMenu>
	{
	}

	private static var gm_thisMenuProp : MenuProp = new MenuProp();

	public function UIMenu()
	{
		this.RegistProperty("@ThisMenu", new MenuProp());
		//this.RegistProperty("@ThisMenu", gm_thisMenuProp);
	}
}
