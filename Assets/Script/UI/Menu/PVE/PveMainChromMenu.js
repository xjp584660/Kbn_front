public class PveMainChromMenu extends KBNMenu
{
	enum Menu_Type
	{
		PVE_MAINCHROM_TYPE_CAMPAIGNMAP_SCENE = 0,
		PVE_MAINCHROM_TYPE_CHAPTERMAP_SCENE = 1
	};
	public var menuHead:MenuHead;
	public var clone_menuHead : MenuHead;
	public var line:SimpleLabel;
	public var toolBar:ToolBar;
	public var starIcon:PveStar;
	public var staminaIcon:PveStamina;
	public var scoreIcon:PveScore;
	
	//chat
	public var  btnChat:Button;
	public var  chatText:SimpleButton;
	public var  chatText1:Label;
	public var  chatText2:Label;
	public var 	chatIcon1:Label;
	public var 	chatIcon2:Label;
	public var  weeklyLimit:Label;	
	
	public var TextureGlobal:Texture2D;
	public var TextureAlliance:Texture2D;
	public var TextureWhisper:Texture2D;
	
	private var g_countForChattext:long = 0;
	private var g_curTime:long = 0; 
	private var g_updateChatInterval:int = 1;   
	
	public var redColor:Color;
	public var blackColor:Color;
	//chat
	
	private var m_layOutMain : UILayout.Grid;
	private var m_uiElementMgr : UIElementMgr = new UIElementMgr();
	private var m_needRevisite : boolean = true;
	private var m_needResort : boolean = false;
	private var totalData:KBN.PveTotalData;
	private var chapterData:KBN.PveChapterData;
	private var resultData : KBN.PveResultData;
	
	private var menuType:Menu_Type;
	var	m_menuHeadBgSize : UILayout.UISize = null;

	public var scrollList:ScrollList;
	public var item:ListItem;

	private var uigrid:UIGridTool=new UIGridTool();
	public var grid:UIGrid;

	private var gridPrefab:UIGrid;
	public var  btnTopHide:Button;
	
	function Init():void
	{
		
		// item.Init();
		// scrollList.Init(item);
		
		if ( clone_menuHead != null )
			menuHead = Instantiate(clone_menuHead);
		if ( menuHead != null )
		{
			menuHead.Init();
			menuHead.setTitle( Datas.getArString("Campaign.CampaignTitle") ) ;//"CAMPAIGN"
			menuHead.btn_back.setNorAndActBG("button_home_normal","button_home_down");
			menuHead.backTile = TextureMgr.instance().BackgroundSpt().GetTile("bg_ui_second_chapter");
			menuHead.backTile.rect.height = 80;
//			menuHead.btn_back.rect = new Rect(0,0,100,65);
			
			//line.rect = new Rect(0,140,641,50);
		}
		
		if(line.mystyle.normal.background == null)
		{
			line.mystyle.normal.background = TextureMgr.instance().LoadTexture("frame_metal_top",TextureType.DECORATION);
		}
		
		starIcon.Init();
		staminaIcon.Init();
		scoreIcon.Init();
		
		menuHead.btn_back.OnClick = handleClick;
		weeklyLimit.Init();
		btnChat.OnClick = OpenChat;
		chatText1.Init();
		chatText2.Init();
		chatIcon1.Init();
		chatIcon2.Init();

		chatText.alpha = 0.45;
		chatText.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black", TextureType.BACKGROUND);
		chatText.OnClick = OpenChat;
		btnChat.setNorAndActBG("button_chat_normal","button_chat_down");

		weeklyLimit.txt = "";
		chatText1.txt = "";
		chatText2.txt = "";
		chatIcon1.mystyle.normal.background = null;	
		chatIcon2.mystyle.normal.background = null;	
		toolBar.Init();
		toolBar.SetDefaultNormalTxtColor(FontColor.New_PageTab_Yellow);
		toolBar.SetDefaultOnNormalTxtColor(FontColor.New_PageTab_Yellow);
		toolBar.toolbarStrings = [Datas.getArString("Campaign.Title_Normal"),Datas.getArString("Campaign.Title_Elite")];
		toolBar.indexChangedFunc = tabChanged;
		UpdateMessage();
		this.priv_initLayout();
		m_menuHeadBgSize = m_layOutMain.Row(0);
		
		
		if(KBN.PveController.instance().PveType == Constant.PveType.NORMAL)
		{
			toolBar.selectedIndex = 0;
		}
		else
		{
			toolBar.selectedIndex = 1;
		}
		uigrid = new UIGridTool();
		gridPrefab = uigrid.Init(menuHead,132,true,grid,item,620,0);
		btnTopHide.OnClick = OnTopHideBtnClick;
	}
	
	public function tabChanged(index:int)
	{
		 if(GameMain.singleton.ForceTouchForbidden || GameMain.instance().getCampaignMapController().isTransitingToChapterMap())
		 {
		 	return;
		 }
		switch(index)
		{
			case 0:
				KBN.PveController.instance().PveType = Constant.PveType.NORMAL;
				KBN.Game.Event.Fire(this, new KBN.CampaignModeEventArgs(Constant.PveType.NORMAL));
			break;
			case 1:
				KBN.PveController.instance().PveType = Constant.PveType.ELITE;
				KBN.Game.Event.Fire(this, new KBN.CampaignModeEventArgs(Constant.PveType.ELITE));
			break;
		}
	}
	
	function OnPush(param:Object):void
	{
		checkIphoneXAdapter();
		showIphoneXFrame=false;
		totalData = KBN.PveController.instance().GetPveTotalInfo() as KBN.PveTotalData;
		resultData = KBN.PveController.instance().GetResultInfo() as KBN.PveResultData;
		
		menuType = Menu_Type.PVE_MAINCHROM_TYPE_CAMPAIGNMAP_SCENE;
//		starIcon.SetData(totalData.totalStar);
//		staminaIcon.SetData(totalData.samina);
//		scoreIcon.SetData(totalData.totalScore);
		
		//hide main chrom 
		//MenuMgr.getInstance().pop2Menu("MainChrom");
		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.SetVisible(false);

		// var array:Array = BuffAndAlert.instance().getArrayForScrollList();
		var array:Array = BuffAndAlert.instance().buffIconForMainChrome;
		if (array==null||array.length==0) {
			array=new Array();
			array.push(5);
		}
		uigrid.Refresh(_Global.ArrayToList(array));
		// scrollList.SetData(array);
		// scrollList.ResetPos();
		//temporary code
		//MenuMgr.getInstance().PopMenu("PveLoadMenu");
	}

	
	function Draw():int
	{
		if(!visible)
			return -1;
		if(disabled && Event.current.type != EventType.Repaint)	
			return -1;
		//if(menuHead != null)
		//	menuHead.Draw();
		//starIcon.Draw();
		//staminaIcon.Draw();
		//scoreIcon.Draw();
		var matrix:Matrix4x4 = GUI.matrix; 
		if(adapterIphoneX){


//			var scale2:Matrix4x4 = Matrix4x4.Scale  ( new Vector3 (scaleX, scaleY, 1.0f));
//			GUI.matrix = scale2*matrix ;
//			var f:float= rect.y*scaleY+offsetY;
//			GUI.BeginGroup(new Rect (rect.x,f,rect.width,rect.height));
			priv_drawLayout();
//			GUI.EndGroup();





		}else{
			priv_drawLayout();
		}
		
		GUI.matrix = matrix;
		// scrollList.Draw();
		uigrid.Draw();
		//item.Draw();
		btnTopHide.Draw();
		return -1;
	}
	
	public function Update()
	{
		if(!visible)
			return;
//		if(Input.GetMouseButtonDown(0))
//		{
//			handleBack();
//		}
//		staminaIcon.Update();

		menuHead.l_gem.txt = Payment.instance().DisplayGems + "";
		priv_resetLayout();
		
		if((MenuMgr.getInstance().Chat as ChatMenu).whetherGetChat(false))
		{
			(MenuMgr.getInstance().Chat as ChatMenu).getChat(true);
		}
		
		g_curTime = GameMain.unixtime();
		if(g_curTime - g_countForChattext >= g_updateChatInterval)
		{
			g_countForChattext = g_curTime;
			
			if((MenuMgr.getInstance().Chat as ChatMenu).isNeedUpdateMes)
			{
				UpdateMessage();
			}
		}
		
		
		if(KBN.GameMain.singleton.curSceneLev() == KBN.GameMain.singleton.CAMPAIGNMAP_SCENE_LEVEL && m_menuHeadBgSize.Value != 170)
		{
			toolBar.visible = true;
			m_menuHeadBgSize.Value = _Global.IsLargeResolution()?220:140;
			m_uiElementMgr.Reorder(m_layOutMain);

			weeklyLimit.SetVisible(false);
		}
		else if(KBN.GameMain.singleton.curSceneLev() == KBN.GameMain.singleton.CHAPTERMAP_SCENE_LEVEL && m_menuHeadBgSize.Value != 100)
		{
			toolBar.visible = false;
			m_menuHeadBgSize.Value = _Global.IsLargeResolution()?130:80;
			m_uiElementMgr.Reorder(m_layOutMain);

			if(KBN.PveController.instance().PveType == Constant.PveType.NORMAL)
			{
				var campaignLimit : int = GameMain.instance().GetCampaignLimit();
				var normalAttackNumPerWeek : int = resultData.normalAttackNumPerWeek;
				weeklyLimit.txt = String.Format(Datas.getArString("Campain.WeeklyLimit"), normalAttackNumPerWeek, campaignLimit);
				weeklyLimit.SetVisible(true);
			}
			else
			{
				weeklyLimit.SetVisible(false);
			}
		}

		if (BuffAndAlert.instance().isPveRefresh) {
			var array:Array = BuffAndAlert.instance().buffIconForMainChrome;
			if (array==null||array.length==0) {
				array=new Array();
				array.push(5);
			}
			uigrid.Refresh(_Global.ArrayToList(array));
			BuffAndAlert.instance().setPveBuffFalse();
		}
	}
	
	private function UpdateMessage()
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
	
	public function OnPopOver()
	{
		if ( clone_menuHead != null && menuHead != null )
		{
			TryDestroy(menuHead);
			menuHead = null;
		}
		// scrollList.Clear();
		uigrid.Clear();
		var mainChrom : MainChrom = MenuMgr.getInstance().getMenu("MainChrom");
		mainChrom.SetVisible(true);
	}
	
	public function handleBack()
	{
		MenuMgr.getInstance().PopMenu("PveMainChromMenu");
		
		//MenuMgr.getInstance().PushMenu("RefillStaminaMenu", null, "trans_zoomComp");
	}
	
	function getTestDate():Hashtable
	{
		var testData :Hashtable = 
		{
			"score":9999999,
			"star":9999999,
			"stamina":99
			
		};
		return testData;
	}
	
	/* xml */
	private function priv_initLayout()
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		var textResource : TextAsset;
		if ( _Global.IsLargeResolution() )
			textResource = texMgr.LoadUILayout("PveMainChromMenu.high");
		else
			textResource = texMgr.LoadUILayout("PveMainChromMenu.low");

		var memStream : System.IO.Stream = new System.IO.MemoryStream(textResource.bytes);
		var initPropList : System.Collections.Generic.Dictionary.<String, Object> = new System.Collections.Generic.Dictionary.<String, Object>();
		initPropList["@ThisMenu"] = this;
		var rootObj : UILayout.UIFrame = UILayout.XAMLResReader.ReadFile(memStream, initPropList) as UILayout.UIFrame;
		
		m_layOutMain = rootObj.FindItem("PveMainChromMenu") as UILayout.Grid;
		
		m_needRevisite = true;
		
		m_needResort = true;
	}
	public function setResortEnabled( enabled : boolean )
	{
		m_needResort = enabled;
	}
	
	private function priv_resetLayout() : void
	{
		if ( !m_needResort )
			return;

		m_needResort = false;
		m_uiElementMgr.Reorder(m_layOutMain);
		GameMain.instance().setViewPort();
		
		if(MenuMgr.getInstance() != null)
		{
			var chatMenu : ChatMenu = MenuMgr.getInstance().Chat;
			chatMenu.MainChromChatTextWidth = chatText1.rect.width;
			chatMenu.MainChromChatTextGUIStyle = chatText1.mystyle;
		}
	}
	
	private function priv_drawLayout()
	{
		if ( m_needRevisite )
		{
			m_needRevisite = false;
			m_uiElementMgr.CatchElement(m_layOutMain);
			m_uiElementMgr.Reorder(m_layOutMain);
		}

		m_uiElementMgr.Draw();
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
//			case Constant.Notice.UPDATE_PVE_STAMINA:
//				staminaIcon.SetData(totalData.samina);
//				break;
//			case Constant.Notice.UPDATE_PVE_SCORE_STAR:
//				updateScore();
//				break;
			case Constant.Notice.PVE_ENTER_CAMPAIGNMAP_SCENE:
				OnEnterCampaignMap(body);
				break;
			case Constant.Notice.PVE_ENTER_CHAPTERMAP_SCENE:
				OnEnterChapterMap(body);
				break;
		}
	}
	
//	function updateScore()
//	{
//		switch(menuType)
//		{
//		case Menu_Type.PVE_MAINCHROM_TYPE_CAMPAIGNMAP_SCENE:
//			starIcon.SetData(totalData.totalStar);
//			scoreIcon.SetData(totalData.totalScore);
//			break;
//		case Menu_Type.PVE_MAINCHROM_TYPE_CHAPTERMAP_SCENE:
//			starIcon.SetData(chapterData.curStar);
//			scoreIcon.SetData(chapterData.curScore);
//			break;
//		}
//		
//	}
	
	public function isHitUI(pos : Vector2) : boolean
	{
		if(isVisible())
			return m_uiElementMgr.IsHitUI(pos);
		else
			return false;
	}
	
	public function handleClick()
	{
		switch(menuType)
		{
		case Menu_Type.PVE_MAINCHROM_TYPE_CAMPAIGNMAP_SCENE:
			if( !GameMain.instance().getCampaignMapController().isTransitingToChapterMap() )
			{
				MenuMgr.getInstance().PopMenu("PveMainChromMenu");
				GameMain.instance().loadLevel(GameMain.instance().getCampaignMapController().GetBackToSceneLevel());
			}
			break;
		case Menu_Type.PVE_MAINCHROM_TYPE_CHAPTERMAP_SCENE:
			GameMain.instance().loadLevel(GameMain.CAMPAIGNMAP_SCENE_LEVEL);
			break;
		}
	}
	
	public function OnEnterCampaignMap(param:Object)
	{
		menuType = Menu_Type.PVE_MAINCHROM_TYPE_CAMPAIGNMAP_SCENE;
//		starIcon.SetData(totalData.totalStar);
//		staminaIcon.SetData(totalData.samina);
//		scoreIcon.SetData(totalData.totalScore);
		
		menuHead.setTitle( Datas.getArString("Campaign.CampaignTitle") ) ;
		menuHead.btn_back.setNorAndActBG("button_home_normal","button_home_down");
//		menuHead.btn_back.rect = new Rect(0,0,100,65);
	}
	
	public function OnEnterChapterMap(param:Object)
	{
		menuType = Menu_Type.PVE_MAINCHROM_TYPE_CHAPTERMAP_SCENE;
		
		var chapterID = _Global.INT32(param);
//		chapterData = KBN.PveController.instance().GetChapterData(chapterID) as KBN.PveChapterData;
//		if(chapterData != null)
//		{
//			starIcon.SetData(chapterData.curStar);
//			scoreIcon.SetData(chapterData.curScore);
//		}
//		else
//		{
//			starIcon.SetData(0);
//			scoreIcon.SetData(0);
//		}
		
		var gdsChapterItem:KBN.DataTable.PveChapter = GameMain.GdsManager.GetGds.<KBN.GDS_PveChapter>().GetItemById(chapterID);
		if(gdsChapterItem!=null)
			menuHead.setTitle( Datas.getArString(gdsChapterItem.NAME) ) ;
		else
			menuHead.setTitle( "" ) ;
			
		menuHead.btn_back.setNorAndActBG("button_back2_normal","button_back2_down");
		menuHead.btn_back.rect = new Rect(0,0,110,70);
			
//		staminaIcon.SetData(totalData.samina);
	}
	
	public function OnBackButton() : boolean
	{
		handleClick();
		return true;
	}
	
	function OpenChat()
	{
		MenuMgr.getInstance().PushMenu("ChatMenu", null);
	}
	
	public function getTextureByType(_type:String):Texture2D
	{
		switch(_type)
		{
			case Constant.ChatType.CHAT_GLOBLE:
				return TextureGlobal;
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
	
	function OnBack()
	{
		UpdateMessage();
	}

	private var isClicked:Boolean = false;
	function OnTopHideBtnClick():void
	{
		if(GameMain.instance().getCampaignMapController() != null)
		{
			GameMain.instance().getCampaignMapController().ClickTopHideBtn();
		}
		else if(GameMain.instance().getChapterMapController() != null)
		{
			GameMain.instance().getChapterMapController().ClickTopHideBtn();
		}
		isClicked = !isClicked;
		//item.btn.SetVisible(!isClicked);
		if(gridPrefab)
		{
			for (var i:int = 0;i < gridPrefab.transform.childCount;i++)
			{
				var pveBuffItem:PVEBuffItem = gridPrefab.transform.GetChild(i).GetComponent("PVEBuffItem") as PVEBuffItem;
				if(pveBuffItem!=null)
				{
					pveBuffItem.itemIcon.visible = !isClicked;
					pveBuffItem.btn.visible = !isClicked;
				}
			}
		}
		btnTopHide.flipY = !isClicked;
		
	}
	function ResetIsClicked(type:int):void
	{
		isClicked = false;
		//item.btn.SetVisible(!isClicked);
		if(gridPrefab)
		{
			for (var i:int = 0;i < gridPrefab.transform.childCount;i++)
			{
				var pveBuffItem:PVEBuffItem = gridPrefab.transform.GetChild(i).GetComponent("PVEBuffItem") as PVEBuffItem;
				if(pveBuffItem!=null)
				{
					pveBuffItem.itemIcon.visible = !isClicked;
					pveBuffItem.btn.visible = !isClicked;
				}
			}
		}
		btnTopHide.flipY = !isClicked;

		if(type == 1 )
		{
			btnTopHide.rect = new Rect(560,140,50,50);
		}
		else
		{
			btnTopHide.rect = new Rect(560,90,50,50);
		}
	}
}