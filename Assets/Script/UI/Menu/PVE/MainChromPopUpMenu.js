class MainChromPopUpMenu extends KBNMenu
{
	private static var UI_BG_WOOD_WEN_HEIGHT:float = 20;

	@SerializeField private var backBtn:Button;
	@SerializeField private var titleImage:SimpleLabel;
	@SerializeField private var titleText :Label;
	
	@SerializeField private var backRect:Rect;
	private var listItem:System.Collections.ArrayList;
	
	@SerializeField private	var chromBtnQuest		:ChromeButtonObj;
	@SerializeField private	var chromBtnMail		:ChromeButtonObj;
	@SerializeField private var chromBtnGamble		:ChromeButtonObj;
	@SerializeField private	var chromBtnAlliance	:ChromeButtonObj;
	@SerializeField private	var chromBtnShop		:ChromeButtonObj;
	@SerializeField private	var chromBtnSetting		:ChromeButtonObj;
	@SerializeField private	var chromBtnResearch	:ChromeButtonObj;
	@SerializeField private	var chromBtnTrain		:ChromeButtonObj;
	@SerializeField private	var chromBtnLeaderBoard	:ChromeButtonObj;
	@SerializeField private	var chromBtnShare		:ChromeButtonObj;
	@SerializeField private	var chromBtnOpenGear	:ChromeButtonObj;
	@SerializeField private	var chromBtnCampaign	:ChromeButtonObj;
	@SerializeField private var chromBtnHeroRelic   :ChromeButtonObj;
	
	@SerializeField private var iphoneXBottomFrame:SimpleLabel;
	@SerializeField private var btnViewRect:Rect;
	@SerializeField private var perRow:int = 6;
	public function Init()
	{
		backBtn.OnClick = OnClickPopUp;
    	backBtn.setNorAndActBG("button_chromepopup_normal","button_chromepopup_down");
		
		if(titleImage.mystyle.normal.background == null)
		{
			titleImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("chrome_Decoration",TextureType.DECORATION);
		}
		iphoneXBottomFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("iphoneX_Bottom", TextureType.LOAD);
		iphoneXBottomFrame.rect.y=420;
		iphoneXBottomFrame.rect.height=38;
//		iphoneXBottomFrame.rect.height=_Global.IphoneXBottomFrameHeight();
//		iphoneXBottomFrame.rect.y=
		titleText.setBackground("Brown_Gradients",TextureType.DECORATION);
		titleText.txt = Datas.getArString("Common.Mainchrome_Title");//"THE TITLE BAR";
		
		var img : Texture2D = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_bg_wood");
		bgMiddleBodyPic.rect.width = rect.width;
		
		marginT = TextureMgr.instance().LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);			
//		marginM = new Material(Shader.Find("Mobile/Decaration/Margin"));
		
		resetLayout();
		
		//--------------------------
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

		chromBtnQuest.Init(); 
		chromBtnMail.Init(); 
		chromBtnGamble.Init(); 
		chromBtnAlliance.Init(); 
		chromBtnShop.Init(); 
		chromBtnLeaderBoard.Init();
		chromBtnResearch.Init();
		chromBtnSetting.Init();
		chromBtnShare.Init();
		chromBtnOpenGear.Init();
		chromBtnTrain.Init();
		chromBtnCampaign.Init();
		chromBtnHeroRelic.Init();
		
//		chromBtnQuest.setData({"icon":"button_icon_quests","txt": Datas.getArString("MainChrome.QuestsTab_Title"),"num":0});
//		chromBtnMail.setData({"icon":"button_icon_Mail","txt":Datas.getArString("MainChrome.MessagesTab_Title"),"num":0});
//		chromBtnGamble.setData({"icon":"button_icon_item","txt":Datas.getArString("Common.Gamble"),"num":0});
//		chromBtnAlliance.setData({"icon":"button_icon_Allise","txt":Datas.getArString("MainChrome.AllianceTab_Title"),"num":0});
//		chromBtnShop.setData({"icon":"button_icon_shop","txt":Datas.getArString("Common.Inventory"),"num":0});
//		chromBtnTrain.setData({"icon":"button_icon_train","txt":Datas.getArString("Common.Train"),"num":0});
//		chromBtnResearch.setData({"icon":"button_icon_research","txt":Datas.getArString("Common.Research"),"num":0});
//		chromBtnLeaderBoard.setData({"icon":"button_icon_leaderboard","txt":Datas.getArString("Common.Rank"),"num":0});
//		chromBtnSetting.setData({"icon":"button_icon_setting","txt":Datas.getArString("Common.Settings_Title"),"num":0});
//		chromBtnShare.setData({"icon":"button_icon_share","txt":Datas.getArString("Common.Share"),"num":0});
//		chromBtnCampaign.setData({"icon":"button_icon_Mail","txt":Datas.getArString("Campaign.Campaign"),"num":0});
		
		chromBtnQuest.setData({"icon":"button_icon_quests","txt": Datas.getArString("MainChrome.QuestsTab_Title"),"num":0});
		chromBtnMail.setData({"icon":"button_icon_Mail","txt":Datas.getArString("MainChrome.MessagesTab_Title"),"num":0});
		chromBtnGamble.setData({"icon":"button_icon_item","txt":Datas.getArString("Common.Gamble"),"num":0});
		chromBtnAlliance.setData({"icon":"button_icon_Allise","txt":Datas.getArString("MainChrome.AllianceTab_Title"),"num":0});
//		chromBtnShop.setData({"icon":"button_icon_shop","txt":Datas.getArString("Common.Inventory"),"num":0});
		var shop:Shop = Shop.instance();
		if(shop.HasDiscountItem(Shop.SPEEDUP) || shop.HasDiscountItem(Shop.GENERAL) || shop.HasDiscountItem(Shop.ATTACK)
			|| shop.HasDiscountItem(Shop.PRODUCT) || shop.HasDiscountItem(Shop.CHEST))
		{
			chromBtnShop.setData({"icon":"button_icon_shop2","txt":Datas.getArString("Common.Inventory"),"num":0});
		}
		else
		{
			chromBtnShop.setData({"icon":"button_icon_shop","txt":Datas.getArString("Common.Inventory"),"num":0});
		}

		chromBtnTrain.setData({"icon":"button_icon_train","txt":Datas.getArString("Common.Train"),"num":0});
		chromBtnResearch.setData({"icon":"button_icon_research","txt":Datas.getArString("Common.Research"),"num":0});
		chromBtnLeaderBoard.setData({"icon":"button_icon_leaderboard","txt":Datas.getArString("Common.Rank"),"num":0});
		chromBtnSetting.setData({"icon":"button_icon_setting","txt":Datas.getArString("Common.Settings_Title"),"num":0});
		chromBtnShare.setData({"icon":"button_icon_share","txt":Datas.getArString("Common.Share"),"num":0});
		chromBtnHeroRelic.setData({"icon":"button_icon_heroRelic","txt":Datas.getArString("HeroRelic.Warehouse"),"num":0});
		if(GameMain.instance().IsPveOpened()) 
			chromBtnCampaign.setData({"icon":"button_icon_campaign","txt":Datas.getArString("Common.Campaign"),"num":0});
		
		listItem = new System.Collections.ArrayList();
		listItem.Add(chromBtnShop);
		listItem.Add(chromBtnQuest);
		listItem.Add(chromBtnAlliance);
		listItem.Add(chromBtnMail);
		listItem.Add(chromBtnGamble);
		if(GameMain.instance().IsPveOpened()) 
			listItem.Add(chromBtnCampaign);
		listItem.Add(chromBtnHeroRelic);
		listItem.Add(chromBtnTrain);
		listItem.Add(chromBtnResearch);
		listItem.Add(chromBtnLeaderBoard);
		listItem.Add(chromBtnSetting);
		listItem.Add(chromBtnShare);	
		GearSysController.CheckIsGearSysUnlocked
		(
			function()
			{
				var isOpenGear : boolean = GearSysController.IsOpenGearSys();
				if(isOpenGear)
				{
					priv_updateChromeBtnIcon();
					listItem.Add(chromBtnOpenGear);
				}
			},
			function(resultDatas:Array)
			{
			}
		);
		
			
		var newHeight : float = 94;//100;//94
		var nameFontSize : FontSize = FontSize.Font_20;
		var noticeFontSize : FontSize = FontSize.Font_BEGIN;
//		if ( _Global.IsLargeResolution() )
//		{
//			newHeight = 111;
//			//	old is 94 / 105
//			nameFontSize = FontSize.Font_40;
//			noticeFontSize = FontSize.Font_32;
//		}

		for(var i=0; i<listItem.Count; i++)
		{
			var itemBtn:ChromeButtonObj = listItem[i] as ChromeButtonObj;
			
			
			var rowNum:int = i/perRow;
			var colNum:int = i%perRow;
			
//			itemBtn.rect = Rect( btnViewRect.x+colNum*btnViewRect.width, btnViewRect.y+rowNum*btnViewRect.height, newHeight, newHeight);
//			itemBtn.btn.rect = Rect( 2, 3, 90, 90 );
//			itemBtn.lblIcon.rect = Rect( 10, 6, 70, 72 );
//			itemBtn.notfiyNum.rect = Rect( 55, 5, 33, 34 );
			itemBtn.Resize(newHeight, nameFontSize, noticeFontSize);
			itemBtn.rect.x = btnViewRect.x+colNum*btnViewRect.width;
			itemBtn.rect.y = btnViewRect.y+rowNum*btnViewRect.height;
			//itemBtn.btn.rect.x = 8;
			//itemBtn.btn.rect.height = 88;
			
//			itemBtn.btn.rect = Rect( 15, 3, 88, 88 );
//			itemBtn.btn.mystyle.contentOffset.x = -10;
//			itemBtn.btn.mystyle.padding.top = 70;
		}
		
		SetChromObjCount();
		if(GameMain.instance().IsPveOpened() && KBN.PveController.instance().GetPveMinLevel () <= GameMain.instance().getPlayerLevel ())
		{
			chromBtnCampaign.animationLabel.SetVisible(true);
		}
		else
		{
			chromBtnCampaign.animationLabel.SetVisible(false);
		}
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
	
	public function Update () 
	{
	}
	
	public function resetLayout()
	{
		repeatTimes = (rect.height - 15) / UI_BG_WOOD_WEN_HEIGHT;
//		marginM.SetTextureScale("_MainTex", Vector2(1, repeatTimes));
		backRect = Rect( 0, 5, rect.width, rect.height);
	}
	
	public  function DrawItem()
	{
		titleText.Draw();
		titleImage.Draw();
		if(KBN._Global.isIphoneX()){
			iphoneXBottomFrame.Draw();
		}
		backBtn.Draw();
		
		for(var i=0; i<listItem.Count; i++)
		{
			var obj:ChromeButtonObj = listItem[i] as ChromeButtonObj;
			obj.Draw();
		}
	}
	
	function OnPush(param:Object)
	{
		this.UpdateGambleAnimation(MenuMgr.getInstance().MainChrom.chromBtnGamble.IsPlayingAnimation);
	}

    public function UpdateGambleAnimation(isPlay : boolean) : void
    {
		if ( isPlay )
			chromBtnGamble.PlayNoticeAnimation();
		else
			chromBtnGamble.StopNoticeAnimation();
	}

	public function OnPopOver()
	{
		super.OnPopOver();
		
	}
	
	private function OnClickPopUp():void
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
 	function openAlliance()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.openAlliance(null);
 	}
	
	function OpenGamble()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.OpenGamble(null);
 	}
 	
 	function OpenEmail()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.OpenEmail();
 	}
	
	function GotoCampaignScene()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.GotoCampaignScene(null);
 	}
 	
 	function OpenMission()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.OpenMission();
 	}
	
	function OpenShop()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.OpenShop();
 	}
 	
 	function OpenAcademy()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.OpenAcademy(null);
 	}
	
	function OpenBarrack()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.OpenBarrack(null);
 	}
 	
 	function OpenSetting()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.OpenSetting();
 	}
	
	function OpenLeaderBoard()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.OpenLeaderBoard(null);
 	}
 	
 	function OpenShare()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.OpenShare();
 	}
	
	function OpenGear()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.OpenGear();
	 }
	 
	function OpenHeroRelic()
	{
		MenuMgr.getInstance().PopMenu("");
 		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.OpenHeroRelic();
	}
 	
 	function SetChromObjCount()
 	{
		chromBtnMail.SetCnt(Message.getInstance().MessageStatistics.UnreadCount);
		chromBtnQuest.SetCnt(Quests.instance().GetQuestComp());
		chromBtnCampaign.SetCnt(KBN.PveController.instance().GetActiveBossCount());
		
//		if(Gamble.getInstance().HasActivity)
//		{
//			chromBtnGamble.setPicture("button_icon_item2");
//		}s
		
		var seed:HashObject = GameMain.instance().getSeed();
		var freeCnt=_Global.INT32(seed["hasFreePlay"]);
		if(freeCnt>0){
			chromBtnGamble.setPicture("button_icon_item2");
		}
		chromBtnGamble.SetCnt(freeCnt);
 	}
 	
 	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
		case Constant.Notice.LEVEL_UP:
			if(GameMain.instance().IsPveOpened() && KBN.PveController.instance().GetPveMinLevel () <= GameMain.instance().getPlayerLevel ())
			{
				chromBtnCampaign.animationLabel.SetVisible(true);
			}
			break;
		}
	}
	
}