class EmailMenu extends ComposedMenu
{
	public var btnHome:Button;
	public var btnEdit:Button;
	public var btnCompose:Button;
	public var btnEmpty:Button;
	public var btnDelete:Button;
	public var btnMarkAsRead:Button;
	public var btnSelectAll:ToggleButton;
	public var bgMiddleTop:Label;
	public var bgBottom:Label;
	public var NoMailAlert:Label;
	public var userSettingBtn:Button;
	
	public var composeMenu:SubEmailCompose;
	public var inboxMenu:SubEmailInbox;
	public var reportMenu:SubEmailReport;
	public var composeObject:ComposeObj;
	public var tipForMessages:Label;
	public var tipForNewMessages:Label;
	
	public var scrollSystemBox:ScrollView;
	public var scrollInbox:ScrollView;
	public var scrollInbox2:ScrollView;
	public var scrollReport:ScrollView;
	public var scrollSent:ScrollView;
	
	public var btnPageTurn:ChangePageObj;
	public var emailItem:EmailItem;
		
	private var g_isEdit:boolean ;
	private var g_hasGetScrollData:boolean ;
	private var g_isCompose:boolean;
	
	private var g_oldSelectTab:int = 0;
	private var arString:Object;
		
	static var INBOX_TYPE:int = 0;
	static var INBOX_TYPE2:int=4;
	static var REPORT_TYPE:int = 1;
	static var SENT_TYPE:int = 2;
	
	public static var SUBMENU_COMPOSE:String = "compose";
	
	private static var g_instance:EmailMenu;
	
	private var tabStrings:Array;
	private var seed:HashObject;
	private var g_isInSubMenu:boolean;
	
	private var UI_done:boolean;
	
	public function setEmailItemRead(type:int, index:int)
	{
		var tempArray:Array = new Array();
		var hasChangePage:boolean = false;
		var arrayLength:int;
		
		if(type == INBOX_TYPE)
		{
			tempArray = scrollInbox.getUIObject();
			hasChangePage = g_inboxHasChangePage;
		}
		else if (type==INBOX_TYPE2) {
			tempArray=scrollInbox2.getUIObject();
			hasChangePage=g_inbox2_HasChangePage;
		}
		else if(type == REPORT_TYPE)
		{
			tempArray = scrollReport.getUIObject();
			hasChangePage = g_reportHasChangePage;			
		}
		else if(type == SENT_TYPE)
		{
			return;
		}
		
		if(hasChangePage)
		{
			arrayLength = tempArray.length - 1;
		}
		else
		{
			arrayLength = tempArray.length;
		}
		
		if(arrayLength >= 1)
		{
			var item:EmailItem;
			for(var a:int = 0; a < arrayLength; a++)
			{
				item = tempArray[a] as EmailItem;
				if(item.itemIndex == index)
				{
					if(!item.hasRead)
					{
						if(type == INBOX_TYPE)
						{
							item.setReaded( true );
							if(g_newNumInbox > 0)
							{
								g_newNumInbox--;
							}
						}else if (type == INBOX_TYPE2) {
							item.setReaded( true );
							if(g_newNumInbox > 0)
							{
								g_newNumInbox--;
							}
						}
						else if(type == REPORT_TYPE)
						{
							item.setReaded( false );
							if(g_newNumReport > 0)
							{
								g_newNumReport--;
							}	
						}
						
						return;					
					}
				}
			}
		}
	}
	
	public static function getInstance():EmailMenu
	{
//		if(g_instance == null)
//		{	
//			g_instance = new EmailMenu();		
//		}

		return g_instance;
	}
		
	function Init()
	{
		super.Init(false);

		Message.getInstance().clearMessageHeader();

		newCurpage=new NewCurPage();
		titleTab.SetNormalTxtColor(FontColor.New_PageTab_Yellow);
		titleTab.SetOnNormalTxtColor(FontColor.New_Describe_Grey_1);
		scrollSystemBox.Init();
		scrollInbox.Init();
		scrollInbox2.Init();
		scrollReport.Init();
		scrollReport.IsDebug=true;
		scrollSent.Init();	
	
		tabArray = [scrollInbox,scrollInbox2,scrollReport,scrollSent];

		btnHome.Init();
		btnEdit.Init();
		
		btnCompose.Init();
		btnDelete.Init();
		btnMarkAsRead.Init();
		
		composeMenu.Init();
		inboxMenu.Init();
		reportMenu.Init();	
		
		btnPageTurn.Init();
		composeObject.Init();
		bgMiddleTop.Init();
		bgBottom.Init();
		btnSelectAll.Init();
		tipForMessages.Init();
		tipForNewMessages.Init();
		btnEmpty.Init();
		NoMailAlert.Init();
		userSettingBtn.Init();
		userSettingBtn.OnClick = handleUserSetting;
		if (KBN._Global.IsLargeResolution ()) 
		{
			userSettingBtn.rect.x = 410;
			userSettingBtn.rect.width = 65;
			
			btnEdit.rect.x = 480;
			btnEdit.rect.width = 150;
		}
		else if (KBN._Global.isIphoneX ()) 
		{
			userSettingBtn.rect.x = 380;
			userSettingBtn.rect.width = 85;
		}
		else
		{
			userSettingBtn.rect.x = 388;
			userSettingBtn.rect.width = 75;
			btnEdit.rect.x = 465;
			btnEdit.rect.width = 170;
		}
		userSettingBtn.rect.height = 64;
		userSettingBtn.rect.y = 2;
		
		btnCompose.OnClick = handleCompose;
		btnEmpty.OnClick = handleEmpty;
		btnDelete.OnClick = handleDelete;
		btnMarkAsRead.OnClick = handleMarkAsRead;
		btnEdit.OnClick = hanldeEdit;

		g_instance  = this;
		GameMain.instance().resgisterRestartFunc(function(){
			g_instance = null;
		});
		//menuHead.Init();
	//	titleBack = TextureMgr.instance().LoadTexture("bg_ui_second_layer", TextureType.BACKGROUND);	
		titleBack = TextureMgr.instance().BackgroundSpt().GetTile("bg_ui_second_layer");
		//titleBack.rect = titleBack.spt.GetTileRect("bg_ui_second_layer");
		titleBack.rect.x = 0;
		titleBack.rect.y = 0;
		//titleBack.name = "bg_ui_second_layer";
		
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomEmail",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomEmail");
//		bgMiddleBodyPic.spt = TextureMgr.instance().BackgroundSpt();
		//bgMiddleBodyPic.name = "ui_paper_bottom";
		
		//bgMiddleBodyPic.spt.edge = 2;
		
		bgBottom.useTile = false;
		bgBottom.setBackground("tool bar_bottomnew",TextureType.BACKGROUND);
		
		bgMiddleTop.useTile = false;
		bgMiddleTop.mystyle.normal.background = TextureMgr.instance().LoadTexture("frame_metal_top",TextureType.DECORATION);
		bgMiddleTop.mystyle.border = new RectOffset(27, 27, 0, 0);
		
		titleTab.SetDefaultNormalTxtColor(FontColor.New_PageTab_Yellow);
		titleTab.SetDefaultOnNormalTxtColor(FontColor.New_Describe_Grey_1);
		
		if (KBN._Global.IsLargeResolution ()) 
		{
			scrollSystemBox.rect.y = 160;
			scrollInbox.rect.y = 160;
			scrollInbox2.rect.y=160;
			scrollReport.rect.y = 160;
			scrollSent.rect.y = 160;
		}
		else
		{
			scrollSystemBox.rect.y = 143;
			scrollInbox.rect.y = 143;
			scrollInbox2.rect.y=143;
			scrollReport.rect.y = 143;
			scrollSent.rect.y = 143;
		}

		scrollInbox.OnDropDown=OnDropDown;
		scrollInbox2.OnDropDown=OnDropDown;
		scrollSent.OnDropDown=OnDropDown;
		scrollReport.OnDropDown=g_curReportPage>=Message.getInstance().CountPage(MessageCacheType.report)?
				OnDropDown:OnDropDown;
	}
	
	private function handleUserSetting():void
	{
		var para:Object = {"barIndex":Constant.UserSetting.BLOCK_USER};
		MenuMgr.getInstance().PushMenu("UserSettingMenu", para);
	}
	
	private var g_curSysInboxPage:int = 1;
	private var g_curReportPage:int = 1;
	private var g_curInboxPage:int = 1;
	private var g_curSentPage:int = 1;
	private var g_totalNumIndex:int = 0;
	private var g_totalNumReport:int = 0;
	private var g_totalNumSent:int = 0;
	private var g_newNumInbox:int = -1;
	private var g_newSysNumInbox:int = -1;
	private var g_totalSysNumInbox:int = 0;
	private var g_newNumReport:int = -1;

	public function resetTipAndAlert():void
	{
		var statistics:MessageStatistics = Message.getInstance().MessageStatistics;
		g_totalNumSent = statistics.AllOutBoxCount;
		g_totalNumIndex = statistics.AllInboxCount;
		g_totalNumReport = Message.getInstance().AllReportCount;
		g_newNumReport = Message.getInstance().UnreadReportCount;
		g_newNumInbox = statistics.UnReadInobxCount;
		g_newSysNumInbox = statistics.UnreadSysMailCount;
		g_totalSysNumInbox=statistics.AllSysMailCount;
		if(titleTab.selectedIndex == 0)
		{			
			tipForMessages.txt = g_totalSysNumInbox + " " + Datas.getArString("Common.NoMessages");
			tipForNewMessages.txt =  g_newSysNumInbox + " " + Datas.getArString("Common.New");
		}
		if(titleTab.selectedIndex == 1)
		{			
			tipForMessages.txt = g_totalNumIndex + " " + Datas.getArString("Common.NoMessages");
			tipForNewMessages.txt =  g_newNumInbox + " " + Datas.getArString("Common.New");
		}
		else if(titleTab.selectedIndex == 2)
		{			
			tipForMessages.txt = g_totalNumReport + " " + Datas.getArString("Common.NoMessages");
			tipForNewMessages.txt =  g_newNumReport + " " + Datas.getArString("Common.New");
		}
		else if(titleTab.selectedIndex == 3)
		{		
			tipForMessages.txt = g_totalNumSent + " " + Datas.getArString("Common.NoMessages");
			tipForNewMessages.txt = "";
		}
		
		var sysInbox:String;
		if(g_newSysNumInbox != 0)
		{
			sysInbox = Datas.getArString("Chat.ExceptionName") + "(" + g_newSysNumInbox + ")";
		}
		else
		{
			sysInbox = Datas.getArString("Chat.ExceptionName");
		}
		
		var subInbox:String;
		if(g_newNumInbox != 0)
		{
			subInbox = Datas.getArString("Common.Inbox") + "(" + g_newNumInbox + ")";
		}
		else
		{
			subInbox = Datas.getArString("Common.Inbox");
		}
		
		var subReport:String;
		if(g_newNumReport != 0)
		{
			subReport  = Datas.getArString("Common.Report") + "(" + g_newNumReport + ")";
		}
		else
		{
			subReport  = Datas.getArString("Common.Report");
		}
		
		titleTab.toolbarStrings = [sysInbox,subInbox, subReport, Datas.getArString("Common.Sent") as String];
	}
	
	public function clickCompose(param:Object)
	{
		PushSubMenu(composeMenu, param);
	}
	
	public function clickInbox(param:Object)
	{
		PushSubMenu(inboxMenu, param);
	}
	
	public function clickReport(param:Object)
	{
		PushSubMenu(reportMenu, param);
	}
	
	public function isListItemSelectAll():boolean
	{
		return btnSelectAll.selected;
	}
	
	public function isEditable()
	{
		return g_isEdit;
	}
	
	public function get isInSubMenu():boolean
	{
		return g_isInSubMenu;
	}
	
	public function PushSubMenu(menu:SubMenu, param:Object)
	{
		g_isInSubMenu = true;
	
		menuHead.setBackBtnDisabled(true);
		titleTab.visible = false;
		super.PushSubMenu(menu, param);
	}	
	
	public function PopSubMenu()
	{
		if(subMenuStack == null || (subMenuStack != null && subMenuStack.Count < 1))
			return;
	
		popMenu = subMenuStack[subMenuStack.Count - 1];
		subMenuStack.RemoveAt(subMenuStack.Count - 1);
//		popMenu = subMenuStack.Pop();
		if(subMenuStack.Count > 1)
		{
			oldMenu = subMenuStack[subMenuStack.Count - 2];
		}
		else
		{	
			if(subMenuStack.Count == 0)
			{	
				g_isInSubMenu = false;
				titleTab.visible = true;
				menuHead.setBackBtnDisabled(false);
			}
			
			oldMenu = null;
		}		
		popMenu.OnPop();
		curState = State.Pop;
		trans.StartTrans(popMenu, tabArray[selectedTab]);
	}
	
	public function OnPop()
	{
		super.OnPop();

		if(curState != State.Normal)
		{
			if(curState == State.Push)
			{
				trans.instantFinishTrans(true);
			}
			else if(curState == State.Pop)
			{
				trans.instantFinishTrans(false);
			}
		}
		
		menuHead.setPaymentContentsVisible(true);
	}	
	
	public	function OnPopOver():void{
		scrollSystemBox.clearUIObject();
		scrollInbox.clearUIObject();
		scrollInbox2.clearUIObject();
		scrollReport.clearUIObject();
		scrollSent.clearUIObject();
		subMenuStack.Clear();
		Message.getInstance().clearMessageHeader();
		super.OnPopOver();
	}		

    private function InitBackButton(paramDict : Hashtable)
    {
        if (paramDict != null && _Global.GetString(paramDict["BackButton"]) == "Outpost")
        {
            menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_OUTPOST);
        }
        else
        {
            menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_HOME);
        }
    }

	public function OnPush(param:Object)
	{
		checkIphoneXAdapter();
		UI_done = false;
	
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomEmail",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomEmail");
		
		marginT = TextureMgr.instance().LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);			
		g_isInSubMenu = false;
			
		g_totalSysNumInbox=0;
		g_totalNumIndex = 0;
		g_totalNumReport = 0;
		g_totalNumSent = 0;
		g_newNumInbox = -1;
		g_newNumReport = -1;
		g_newSysNumInbox = -1;
		g_hasGetScrollData = true;
			
		if(subMenuStack.Count > 0)
		{
			menuHead.setBackBtnDisabled(true);
			titleTab.visible = false;		
		}
		else
		{
			menuHead.setBackBtnDisabled(false);
			titleTab.visible = true;
		}
		
		g_isCompose = false;		

		seed = GameMain.instance().getSeed();

		g_curReportPage = 1;
		g_curSysInboxPage = 1;
		g_curInboxPage = 1;
		g_curSentPage = 1;		
						
		btnPageTurn.setFunction(changePage);
		
		menuHead.setTitle(Datas.getArString("ModalTitle.Email"));
		btnHome.txt = Datas.getArString("Common.Back");
		btnCompose.txt = Datas.getArString("Common.Compose");
		btnDelete.txt = Datas.getArString("Common.Delete");
		btnMarkAsRead.txt = Datas.getArString("Common.Mark");	
		NoMailAlert.txt = Datas.getArString("MessagesModal.NoEmail");
		
		var subInbox:String = Datas.getArString("Common.Inbox");
		var subReport:String = Datas.getArString("Common.Report");
		var sysBox:String = Datas.getArString("Chat.ExceptionName");
		titleTab.toolbarStrings = [sysBox,subInbox, subReport, Datas.getArString("Common.Sent") as String];

		btnHome.OnClick = close;

        var paramDict : Hashtable = param as Hashtable;
        InitBackButton(paramDict);


		if(paramDict["subMenu"] && paramDict["subMenu"] == SUBMENU_COMPOSE)
		{
			g_isCompose = true;
			g_hasGetScrollData = true;
			composeObject.setData(param);
		}				
		if(g_isCompose)
			bgStartY = 86;
		else
			bgStartY = 140;
			
		menuHead.setPaymentContentsVisible(false);
		
		if(paramDict["OpenReport"] && paramDict["OpenReport"] == "true") {
			EmailMenu.getInstance().titleTab.selectedIndex = 2;
		}
		else if(paramDict["PveOpenReport"] && paramDict["PveOpenReport"] == "true") {
			EmailMenu.getInstance().titleTab.selectedIndex = 2;
			menuHead.btn_back.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_back2_normal",TextureType.BUTTON);
			menuHead.btn_back.mystyle.active.background = TextureMgr.instance().LoadTexture("button_back2_down",TextureType.BUTTON);
		}
	}

	public function PushDone()
	{
		Invoke("handlePushdone", 0.1);
	}
	
	private function handlePushdone()
	{
		UI_done = true;
		resetPageInfor();
	}
	public function changePageWhenDelMessage(deleteNum:int)
	{	
		if(selectedTab == 0)
		{
			if(deleteNum == (g_inboxHasChangePage ? scrollInbox.numUIObject - 1 : scrollInbox.numUIObject))
			{
				g_curSysInboxPage--;
				if(g_curSysInboxPage == 0)
				{
					g_curSysInboxPage = 1;
				}				
			}
		}
		
		if(selectedTab == 1)
		{
			if(deleteNum == (g_inboxHasChangePage ? scrollInbox2.numUIObject - 1 : scrollInbox2.numUIObject))
			{
				g_curInboxPage--;
				if(g_curInboxPage == 0)
				{
					g_curInboxPage = 1;
				}				
			}
		}
		
		if(selectedTab == 2)
		{
			if(deleteNum == (g_reportHasChangePage ? scrollReport.numUIObject - 1 : scrollReport.numUIObject))
			{
				g_curReportPage--;
				if(g_curReportPage == 0)
				{
					g_curReportPage = 1;
				}
			}
		}
		
		if(selectedTab == 3)
		{
			if(deleteNum == (g_sentHasChangePage ? scrollSent.numUIObject - 1 : scrollSent.numUIObject))
			{
				g_curSentPage--;
				if(g_curSentPage == 0)
				{
					g_curSentPage = 1;
				}
			}
		}
		
//		resetPageInfor();  //fc
	}
	
	public function resetComponentsUnclicked():void
	{
		var _array:Array = new Array();
		var _length:int;
		if(selectedTab == 0)
		{
			_array = scrollInbox.getUIObject();
			_length = g_inboxHasChangePage ? scrollInbox.numUIObject - 1 : scrollInbox.numUIObject;
		}
		else if(selectedTab == 1)
		{
			_array = scrollInbox2.getUIObject();
			_length = g_inboxHasChangePage ? scrollInbox2.numUIObject - 1 : scrollInbox2.numUIObject;
		}
		else if(selectedTab == 2)
		{
			_array = scrollReport.getUIObject();
			_length = g_reportHasChangePage ? scrollReport.numUIObject - 1 : scrollReport.numUIObject;
		}
		else if(selectedTab == 3)
		{
			_array = scrollSent.getUIObject();
			_length = g_sentHasChangePage ? scrollSent.numUIObject - 1 : scrollSent.numUIObject;
		}
		
		var _item:EmailItem;
		for(var a:int = 0; a < _length; a++)
		{
			_item = _array[a];
			_item.setClicked(false);
		}
	}
	
	private function changePage(curPage:int):void
	{
		if(selectedTab == 0)
		{
			g_curSysInboxPage = curPage;	
		}
		
			if(selectedTab == 1)
		{
			g_curInboxPage = curPage;	
		}	
		
		if(selectedTab == 2)
		{
			g_curReportPage = curPage;
			scrollReport.OnDropDown=g_curReportPage>=Message.getInstance().CountPage(MessageCacheType.report)?
				OnDropDown:OnDropDown;
		}
		
		if(selectedTab == 3)
		{
			g_curSentPage = curPage;
		}
		
		resetPageInfor();
	}

	private function OnDropDown(){
		btnPageTurn.GoToNextPage();
	}
	
	public function resetPageInfor():void
	{
		g_isEdit = false;
		g_hasGetScrollData = false;
		btnSelectAll.selected = false;		
	}
	
	public function resetMessageCurPage()
	{
		g_curSysInboxPage = 1;
		g_curInboxPage = 1;
		g_curSentPage = 1;
		g_curReportPage = 1;
	}

	class NewCurPage{
		public var tab0:int;
		public var tab1:int;
		public var tab2:int;
		public var tab3:int;
	}

	private var newCurpage:NewCurPage;
	
	public function fillView(isRefresh:boolean){
		if(UI_done)
		{
			if(selectedTab == 0)
			{
			    //_Global.Log('system EmailMenu_inox');

				if (newCurpage.tab0==0) {
					scrollInbox.clearUIObject();
					scrollInbox.MoveToTop();
				}
				if (newCurpage.tab0<=g_curSysInboxPage){
					Message.getInstance().ShowList("inbox", g_curSysInboxPage, resultGetSysInboxList,true,exceptionCallback,1,0);
					newCurpage.tab0=g_curSysInboxPage;
				}
				else if (newCurpage.tab0>g_curSysInboxPage) {
					scrollInbox.clearUIObject();
					Message.getInstance().ShowList("inbox", g_curSysInboxPage, resultGetSysInboxList,true,exceptionCallback,1,1);
					newCurpage.tab0=g_curSysInboxPage;
				}
			}
			else if(selectedTab == 1)
			{
			    //_Global.Log('EmailMenu_inox');

				if (newCurpage.tab1==0) {
					scrollInbox2.clearUIObject();
					scrollInbox2.MoveToTop();
				}
				if (newCurpage.tab1<=g_curInboxPage){
					Message.getInstance().ShowList("inbox", g_curInboxPage, resultGetInboxList,true,exceptionCallback,0,0);
					newCurpage.tab1=g_curInboxPage;
				}
				else if (newCurpage.tab1>g_curInboxPage) {
					scrollInbox2.clearUIObject();
					Message.getInstance().ShowList("inbox", g_curInboxPage, resultGetInboxList,true,exceptionCallback,0,1);
					newCurpage.tab1=g_curInboxPage;
				}
			}
			else if(selectedTab == 2)
			{
			   // _Global.Log('EmailMenu_report');
				if (newCurpage.tab2==0) {
					scrollReport.clearUIObject();
					scrollReport.MoveToTop();
				}
				if (newCurpage.tab2<=g_curReportPage){
					Message.getInstance().ShowReportList(g_curReportPage,resultGetReportList,exceptionCallback,0);
					newCurpage.tab2=g_curReportPage;
				}
				else if (newCurpage.tab2>g_curReportPage) {
					scrollReport.clearUIObject();
					Message.getInstance().ShowReportList(g_curReportPage,resultGetReportList,exceptionCallback,1);
					newCurpage.tab2=g_curReportPage;
				}	
			}
			else if(selectedTab == 3)
			{
			    //_Global.Log('EmailMenu_outbox');
				// scrollSent.clearUIObject();
				// scrollSent.MoveToTop();
				// Message.getInstance().ShowList("outbox", g_curSentPage, resultGetOutBoxList,true,exceptionCallback);	

				if (newCurpage.tab3==0) {
					scrollSent.clearUIObject();
					scrollSent.MoveToTop();
				}
				if (newCurpage.tab3<=g_curSentPage){
					Message.getInstance().ShowList("outbox", g_curSentPage, resultGetOutBoxList,true,exceptionCallback);
					newCurpage.tab3=g_curSentPage;
				}
				else if (newCurpage.tab3>g_curSentPage) {
					scrollSent.clearUIObject();
					Message.getInstance().ShowList("outbox", g_curSentPage, resultGetOutBoxList,true,exceptionCallback,0,1);
					newCurpage.tab3=g_curSentPage;
				}	
			}
		}
	}
	
	private function exceptionCallback()
	{
	
	}

	private function UpdateScrollView(){
		scrollInbox.scrollAble=titleTab.visible;
		scrollInbox2.scrollAble=titleTab.visible;
		scrollReport.scrollAble=titleTab.visible;
		scrollSent.scrollAble=titleTab.visible;
	}
	public function Update()
	{
		super.Update();
		menuHead.Update();
		composeObject.Update();
		composeMenu.Update();
		if(g_oldSelectTab != selectedTab && UI_done)
		{
			resetPageInfor();			
		}
		
		if(!g_hasGetScrollData && UI_done)
		{
			g_hasEmail = true;
		
			fillView(false);
			g_hasGetScrollData = true;
			g_oldSelectTab = selectedTab;
		}	
	
		if(selectedTab == 0)
		{
			scrollInbox.Update();
			scrollInbox.AutoLayout();
			tipForMessages.rect.y = 886;
			tipForNewMessages.rect.y = 916;
			btnDelete.rect.x = 245;
		} else if(selectedTab == 1)
		{
			scrollInbox2.Update();
			scrollInbox2.AutoLayout();
			tipForMessages.rect.y = 886;
			tipForNewMessages.rect.y = 916;
			btnDelete.rect.x = 245;
		}
		else if(selectedTab == 2)
		{
			scrollReport.Update();
			scrollReport.AutoLayout();
			tipForMessages.rect.y = 886;
			tipForNewMessages.rect.y = 916;
			btnDelete.rect.x = 245;
		}
		else if(selectedTab == 3)
		{
			scrollSent.Update();
			scrollSent.AutoLayout();
			tipForMessages.rect.y = 886;
			btnDelete.rect.x = 475;
		}	
		UpdateScrollView();	
	}
	

	
	public function DrawTitle()
	{
		if( subMenuStack.Count > 0 && curState == State.Normal )
			return;
		if(g_isCompose)
		{
			titleBack.Draw();										
			DrawMiddleBg();		
			composeObject.Draw();
			btnHome.Draw();
		}
		else
		{
			DrawMiddleBg();
//			bgMiddleTop.Draw();
			frameTop.Draw();
//			bgBottom.Draw();	
			selectedTab = titleTab.Draw();
			if( lastTab != selectedTab)
			{
				ClearMenuStack();
				lastTab = selectedTab;
			}
		}
	}
		
	function DrawBackground()
	{
		if( subMenuStack.Count > 0 && curState == State.Normal )
			return;
		menuHead.Draw();
	}
	
	public function DrawItem()
	{
		if(!g_isCompose)
		{
			if(g_hasEmail)
			{
				super.DrawItem();
			}
			else
			{
				NoMailAlert.Draw();
			}
			bgBottom.Draw();
			btnEdit.Draw();
			
			userSettingBtn.Draw();
			
			if(g_isEdit)
			{
				btnDelete.Draw();
				if(selectedTab != 3)
					btnMarkAsRead.Draw();
				btnSelectAll.Draw();
				btnEdit.txt = Datas.getArString("Common.Cancel_Button");		
			}
			else
			{
				btnCompose.Draw();
				var temo:String = Datas.getArString("Common.Edit");
				btnEdit.txt = Datas.getArString("Common.Edit");
				SetEmptyButtonState();
				tipForMessages.Draw();	
				tipForNewMessages.Draw();
				btnEmpty.Draw();
			}
			
		}
	}	
	
	private function SetEmptyButtonState()
	{
		var btnEmptyTxt : String = Datas.getArString("Common.Empty");
		switch(titleTab.selectedIndex)
		{
			case 0 :				
				if(g_newSysNumInbox != 0 || Message.getInstance().GetAllUnClaimedPrizeInMails().Count > 0)
				{
					btnEmptyTxt = Datas.getArString("Common.HaveRead");
				}
				else
				{
					btnEmptyTxt = Datas.getArString("Common.Empty");
				}			
				break;
			case 1 :
				btnEmptyTxt = g_newNumInbox == 0 ? Datas.getArString("Common.Empty") : Datas.getArString("Common.HaveRead");
				break;
			case 2 : 
				btnEmptyTxt = g_newNumReport == 0 ? Datas.getArString("Common.Empty") : Datas.getArString("Common.HaveRead");
				break;
			case 3 : 
				btnEmptyTxt = Datas.getArString("Common.Empty");
				break;
		}
		btnEmpty.txt = btnEmptyTxt;
	}
	
	private var g_inboxHasChangePage:boolean = false;
	private var g_inbox2_HasChangePage:boolean = false; 
	private var g_sentHasChangePage:boolean = false;
	private var g_reportHasChangePage:boolean = false;
	private var g_hasEmail:boolean = true;
	
								
																					
	public function resultGetInboxList(_result:HashObject,headers:Array)
	{
		getInboxList(_result,headers,MessageCacheType.inbox);
	}
	public function resultGetSysInboxList(_result:HashObject,headers:Array)
	{
		getInboxList(_result,headers,MessageCacheType.sysInbox);
	}
	public function getInboxList(_result:HashObject,headers:Array,_type:MessageCacheType)
	{
		
		if(_result != null)
		{		
			// scrollInbox.clearUIObject();
			
			try
			{
				var a:int = 0;
				var arr:Array = _GetScrollItem();
				for(a = 0; a < headers.length; a++)
				{
					if (headers[a]==null) {
						continue;
					}
					var data:HashObject = _type==MessageCacheType.sysInbox?Message.getInstance().getMessageHeader(INBOX_TYPE, a):Message.getInstance().getMessageHeader(INBOX_TYPE2, a);
					var g_id:int = _Global.INT32(data["messageId"]);
					if (!array_contain(arr[0],g_id)&&!array_contain(arr[1],g_id)) {
						var listItem:EmailItem = Instantiate(emailItem);
						
						if (_type==MessageCacheType.sysInbox) {
							listItem.resetData(_type==MessageCacheType.sysInbox?INBOX_TYPE:INBOX_TYPE2, a);
							scrollInbox.SetItemAutoScale(listItem);
						}else if (_type==MessageCacheType.inbox) {
							listItem.resetData(_type==MessageCacheType.sysInbox?INBOX_TYPE:INBOX_TYPE2, a);
							scrollInbox2.SetItemAutoScale(listItem);
						}
						
						listItem.rect.y = a * listItem.rect.height;
						
						if (_type==MessageCacheType.sysInbox) {
							scrollInbox.addUIObject(listItem);
						}else if (_type==MessageCacheType.inbox) {
							scrollInbox2.addUIObject(listItem);
						}
					}					
				}
			}
			catch(error:System.Exception)
			{
				UnityNet.reportErrorToServer("EmailMenu",null,"Client Exception",error.Message,false);
				doEmptybox();
				return;
			} 
			
			if(a > 0)
			{
				g_hasEmail = true;
			}
			else
			{
				g_hasEmail = false;
			}
			
			// if(Message.getInstance().CountPage(_type) > 1)
			// {
				btnPageTurn.setData(_Global.INT32(_result["pageNo"]),Message.getInstance().CountPage(_type));
			// 	scrollInbox.addUIObject(btnPageTurn);
				
			// 	g_inboxHasChangePage = true;	
			// }
			// else
			// {
			// 	g_inboxHasChangePage = false;
			// }
		}

		resetTipAndAlert();
	}
	
	private static function isSuccessReport( header : HashObject, data : HashObject ):boolean
	{
        return Message.getInstance().IsSuccessReport(header, data);
	}
	
	private var g_data : HashObject;
	private function successFunc(result:HashObject)
	{
		g_data = result;
	}
	
	private function array_contain(array:Array, obj:int){
		if (array!=null) {
			for (var i = 0; i < array.length; i++){
		        if (_Global.INT32(array[i]) == obj)//如果要求数据类型也一致，这里可使用恒等号===
		            return true;
		    }
		}	    
	    return false;
	}

	public function resultGetReportList(headers:Array)
	{
		// scrollReport.clearUIObject();
			
		try
	    {
			var a:int = 0;
			var arr:Array = _GetScrollItem();
			for(a = 0; a < headers.length; a++)
			{
				if (headers[a]==null) {
					continue;
				}

				var data:HashObject = Message.getInstance().getMessageHeader(REPORT_TYPE, a);
				var g_id:int = _Global.INT32(data["rid"]);
				
				if (!array_contain(arr,g_id)) {
					var listItem:EmailItem = Instantiate(emailItem);
					listItem.resetData(REPORT_TYPE, a);
					
					scrollReport.SetItemAutoScale(listItem);
					listItem.rect.y = a * listItem.rect.height;
					listItem.Init();
					scrollReport.addUIObject(listItem);
					
					// Set the icon
					var header : HashObject = Message.getInstance().getMessageHeader(REPORT_TYPE, a);
					var rid:int = _Global.INT32(header["rid"]);
					var side:int = _Global.INT32(header["side"]);
					Message.getInstance().viewMarchReportWithoutSetRead(rid, side, successFunc);
					var marchType:int = _Global.INT32(header["marchtype"]);
					var defid:int = _Global.INT32(header["defid"]);
					if((marchType==Constant.MarchType.COLLECT || marchType == Constant.MarchType.COLLECT_RESOURCE) && defid == 0){
						listItem.setReportIconBySuccessState(true);
					}else 
					   listItem.setReportIconBySuccessState( isSuccessReport( header, g_data ) );
					}			
			}
		}
	    catch(error:System.Exception)
	    {
			UnityNet.reportErrorToServer("EmailMenu",null,"Client Exception",error.Message,false);
			doEmptybox();
			return;
	    }
	    
		if(a > 0)
		{
			g_hasEmail = true;
		}
		else
		{
			g_hasEmail = false;
		}			
		
//		if(Message.getInstance().CountPage(MessageCacheType.report) > 1)
//		{			
			btnPageTurn.setData(g_curReportPage ,Message.getInstance().CountPage(MessageCacheType.report));
			// scrollReport.addUIObject(btnPageTurn);
		
			// g_reportHasChangePage = true;
//		}
//		else
//		{
//			g_reportHasChangePage = false;
//		}
		resetTipAndAlert();
	}
	
	public function resultGetOutBoxList(rslt:HashObject,headers:Array)
	{	
		if(rslt["ok"].Value)
		{
			// scrollSent.clearUIObject();
		
			try
			{
				var a:int = 0;
				var arr:Array = _GetScrollItem();
				for(a = 0; a < headers.length; a++)
				{			
					if (headers[a]==null) {
						continue;
					}

					var data:HashObject = Message.getInstance().getMessageHeader(SENT_TYPE, a);
					var g_id:int = _Global.INT32(data["messageId"]);
					if (!array_contain(arr,g_id)) {
						var listItem:EmailItem = Instantiate(emailItem);
						listItem.resetData(SENT_TYPE, a);

						scrollSent.SetItemAutoScale(listItem);
						listItem.rect.y = a * listItem.rect.height;
						scrollSent.addUIObject(listItem);
					}
				}
			}
			catch(error:System.Exception)
      		{
	        	UnityNet.reportErrorToServer("EmailMenu",null,"Client Exception",error.Message,false);
		        doEmptybox();
		        return;
		    }
		    
			if(a > 0)
			{
				g_hasEmail = true;
			}
			else
			{
				g_hasEmail = false;
			}			
			
			// if(Message.getInstance().CountPage(MessageCacheType.outbox) > 1)
			// {
				btnPageTurn.setData(_Global.INT32(rslt["pageNo"]),Message.getInstance().CountPage(MessageCacheType.outbox));
			// 	scrollSent.addUIObject(btnPageTurn);			
				
			// 	g_sentHasChangePage = true;
			// }
			// else
			// {
			// 	g_sentHasChangePage = false;
			// }
		}
		
		resetTipAndAlert();				
	}
	
	private function _CheckSelectedItem():Array
	{
		var a:int;
		var tempArray:Array;
		var arrayLength:int;
		var hasChangePage:boolean;
		var returnArray:Array = new Array();
		
		var inboxIds:Array = new Array();
		var sysIds:Array = new Array();
		
		var others:Array = new Array();//report or sent
		var tempEmailItem:EmailItem;
		
		if(selectedTab == 0)//inbox
		{
			tempArray = scrollInbox.getUIObject();
			hasChangePage = g_inboxHasChangePage;
		}else if(selectedTab == 1)//inbox
		{
			tempArray = scrollInbox2.getUIObject();
			hasChangePage = g_inboxHasChangePage;
		}
		else if(selectedTab == 2) //report
		{
			tempArray = scrollReport.getUIObject();
			hasChangePage = g_reportHasChangePage;
		}
		else if(selectedTab == 3) //outbox
		{
			tempArray = scrollSent.getUIObject();
			hasChangePage = g_sentHasChangePage;
		}
		
		if(false)//(hasChangePage)
		{			
			if (selectedTab == 2) {
				arrayLength = tempArray.length;
			}else{
				arrayLength = tempArray.length - 1;
			}
		}
		else
		{
			arrayLength = tempArray.length;
		}
		
		for(a = 0; a < arrayLength; a++)
		{
			tempEmailItem = tempArray[a];
			if(tempEmailItem.isSelect)
			{
				if(selectedTab == 0 || selectedTab == 1) //inbox
				{
					if(tempEmailItem.isSysBox)
					{
						sysIds.Add(tempEmailItem.id);
					}
					else
					{
						inboxIds.Add(tempEmailItem.id);
					}
				}
				else
				{
					others.Add(tempEmailItem.id);
				}
			}
		}
		
		if(selectedTab == 0 || selectedTab == 1)
		{
			returnArray.push(sysIds);
			returnArray.push(inboxIds);
		}
		else
		{
			returnArray = others;
		}
		return returnArray;
	}

	private function _GetScrollItem():Array
	{
		var a:int;
		var tempArray:Array;
		var arrayLength:int;
		var hasChangePage:boolean;
		var returnArray:Array = new Array();
		
		var inboxIds:Array = new Array();
		var sysIds:Array = new Array();
		
		var others:Array = new Array();//report or sent
		var tempEmailItem:EmailItem;
		
		if(selectedTab == 0)//inbox
		{
			tempArray = scrollInbox.getUIObject();
			hasChangePage = g_inboxHasChangePage;
		}else if(selectedTab == 1)//inbox
		{
			tempArray = scrollInbox2.getUIObject();
			hasChangePage = g_inboxHasChangePage;
		}
		else if(selectedTab == 2) //report
		{
			tempArray = scrollReport.getUIObject();
			hasChangePage = g_reportHasChangePage;
		}
		else if(selectedTab == 3) //outbox
		{
			tempArray = scrollSent.getUIObject();
			hasChangePage = g_sentHasChangePage;
		}
		
		if(false)//(hasChangePage)
		{			
			if (selectedTab == 2) {
				arrayLength = tempArray.length;
			}else{
				arrayLength = tempArray.length - 1;
			}
		}
		else
		{
			arrayLength = tempArray.length;
		}
		
		for(a = 0; a < arrayLength; a++)
		{
			tempEmailItem = tempArray[a];
			// if(tempEmailItem.isSelect)
			// {
				if(selectedTab == 0 || selectedTab == 1) //inbox
				{
					if(tempEmailItem.isSysBox)
					{
						sysIds.Add(tempEmailItem.id);
					}
					else
					{
						inboxIds.Add(tempEmailItem.id);
					}
				}
				else
				{
					others.Add(tempEmailItem.id);
				}
			// }
		}
		
		if(selectedTab == 0 || selectedTab == 1)
		{
			returnArray.push(sysIds);
			returnArray.push(inboxIds);
		}
		else
		{
			returnArray = others;
		}
		return returnArray;
	}

	private function _CheckSelectedItemObj():Array
	{
		var a:int;
		var tempArray:Array;
		var arrayLength:int;
		var hasChangePage:boolean;
		var returnArray:Array = new Array();
		
		var inboxIds:Array = new Array();
		var sysIds:Array = new Array();
		
		var others:Array = new Array();//report or sent
		var tempEmailItem:EmailItem;
		
		if(selectedTab == 0)//inbox
		{
			tempArray = scrollInbox.getUIObject();
			hasChangePage = g_inboxHasChangePage;
		}else if(selectedTab == 1)//inbox
		{
			tempArray = scrollInbox2.getUIObject();
			hasChangePage = g_inboxHasChangePage;
		}
		else if(selectedTab == 2) //report
		{
			tempArray = scrollReport.getUIObject();
			hasChangePage = g_reportHasChangePage;
		}
		else if(selectedTab == 3) //outbox
		{
			tempArray = scrollSent.getUIObject();
			hasChangePage = g_sentHasChangePage;
		}
		
		if(false)//(hasChangePage)
		{			
			if (selectedTab == 2) {
				arrayLength = tempArray.length;
			}else{
				arrayLength = tempArray.length - 1;
			}
		}
		else
		{
			arrayLength = tempArray.length;
		}
		
		for(a = 0; a < arrayLength; a++)
		{
			tempEmailItem = tempArray[a];
			if(tempEmailItem.isSelect)
			{
				if(selectedTab == 0 || selectedTab == 1) //inbox
				{
					if(tempEmailItem.isSysBox)
					{
						sysIds.Add(tempEmailItem);
					}
					else
					{
						inboxIds.Add(tempEmailItem);
					}
				}
				else
				{
					others.Add(tempEmailItem);
				}
			}
		}
		
		if(selectedTab == 0 || selectedTab == 1)
		{
			returnArray.push(sysIds);
			returnArray.push(inboxIds);
		}
		else
		{
			returnArray = others;
		}
		return returnArray;
	}
	public function handleEmpty()
	{
		var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		dialog.setLayout(600,380);
		dialog.setTitleY(60);
		dialog.setContentRect(70,140,0,100);
				
		if(btnEmpty.txt == Datas.getArString("Common.Empty"))
		{
			var totalStr:String = "";
			if(titleTab.selectedIndex == 0){
				totalStr = g_totalSysNumInbox + "";
			}
			else if(titleTab.selectedIndex == 1)
			{			
				totalStr = g_totalNumIndex + "";
			}
			else if(titleTab.selectedIndex == 2)
			{	
				totalStr = g_totalNumReport + "";	
			}
			else if(titleTab.selectedIndex == 3)
			{
				totalStr = g_totalNumSent + "";
			}

			var confirmStr:String = Datas.getArString("Common.EmptyConfirm").Replace("%1$s",totalStr);//%1$s
			MenuMgr.getInstance().PushConfirmDialog(confirmStr,"",function(){
			MenuMgr.getInstance().PopMenu("");
				doEmptybox();
			},null);	
		}
		else
		{
			var confirmHaveReadStr:String = Datas.getArString("Common.HaveReadConfirm").Replace("%1$s",totalStr);//%1$s
			MenuMgr.getInstance().PushConfirmDialog(confirmHaveReadStr,"",function(){
			MenuMgr.getInstance().PopMenu("");
				doHaveReadBox();
			},null);
		}
		
		dialog.setDefaultButtonText();
	}

	private function doHaveReadBox()
	{
		if(selectedTab == 0)
		{
			Message.getInstance().ReadAllSysEmail(successHaveRead);
		}
		if(selectedTab == 1)
		{
			Message.getInstance().ReadAllEmail(successHaveRead);
		}
		else if(selectedTab == 2)
		{
			Message.getInstance().ReadAllReport(successHaveRead);
		}
	}

	private function ReqClaimRewards(item : MessageDAO.PrizeItems) : void
    {
        var paramDict : Hashtable = new Hashtable();
        paramDict.Add("messageId", item.emailId);
        paramDict.Add("isSysbox", "0");

		var OnClaimRewardsSuccess = function(result : HashObject) {
			for (var i : int = 0; i < item.items.Length; ++i)
			{
				MyItems.instance().AddItemWithCheckDropGear(item.items[i], item.itemsCount[i]);							
			}

			Message.getInstance().ClaimPrize(item.emailId, false);
		};

        UnityNet.reqWWW("claimMessageRewards.php", paramDict, OnClaimRewardsSuccess, OnClaimRewardsFailure);
    }
    
    private function OnClaimRewardsFailure(errMsg : String, errCode : String) : void
    {
        var newErrMsg : String = (errCode == UnityNet.NET_ERROR ? 
            Datas.getArString("Error.Network_error") : 
            UnityNet.localError(errCode, errMsg, ""));

        ErrorMgr.instance().PushError("", newErrMsg);
    }

	private function successHaveRead()
	{
		var tempArray:Array;
		if(selectedTab == 0)//inbox
		{
			
			var prizeItems : List.<MessageDAO.PrizeItems> = Message.getInstance().GetAllUnClaimedPrizeInMails();
			for(var j = 0; j < prizeItems.Count; j++)
			{
				ReqClaimRewards(prizeItems[j]);
			}

			tempArray = scrollInbox.getUIObject();
			for (var i = 0; i < tempArray.length; i++) {
				(tempArray[i] as EmailItem).SetRead();
			}
		}else if(selectedTab == 1)//inbox2
		{
			tempArray = scrollInbox2.getUIObject();
			for (var ii = 0; ii < tempArray.length; ii++) {
				(tempArray[ii] as EmailItem).SetRead();
			}
		}
		else if(selectedTab == 2) //report
		{
			tempArray = scrollReport.getUIObject();
			for (var iii = 0; iii < tempArray.length; iii++) {
				(tempArray[iii] as EmailItem).SetRead();
			}
		}

		resetTipAndAlert();
	}
	
	private function doEmptybox()
	{
		if(selectedTab == 0)
		{
			Message.getInstance().EmptySysInboxMessages(successEmpty);
		}
		if(selectedTab == 1)
		{
			Message.getInstance().EmptyInboxMessages(successEmpty);
		}
		else if(selectedTab == 2)
		{
			Message.getInstance().EmptyReportMessages(successEmpty);
		}
		else if(selectedTab == 3)
		{
			Message.getInstance().EmptyOutboxMessages(successEmpty);
		}
	}
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case "DeleteFuncAction":
				DeleteFuncAction(body);

		}
	}
	private function DeleteFuncAction(body:Object){
		var h:HashObject=body as HashObject;
		var tempArray:Array;
		var id:int;

		if(selectedTab == 0)//inbox
		{
			tempArray = scrollInbox.getUIObject();
			id=_Global.INT32(h["messageId"]);
			for (var i = 0; i < tempArray.length; i++) {
				if ((tempArray[i] as EmailItem).id==id) {
					scrollInbox.removeUIObject(tempArray[i] as EmailItem);
				}
			}
		}else if(selectedTab == 1)//inbox2
		{
			tempArray = scrollInbox2.getUIObject();
			id=_Global.INT32(h["messageId"]);
			for (var ii = 0; ii < tempArray.length; ii++) {
				if ((tempArray[ii] as EmailItem).id==id) {
					scrollInbox2.removeUIObject(tempArray[ii] as EmailItem);
				}
			}
		}
		else if(selectedTab == 2) //report
		{
			tempArray = scrollReport.getUIObject();
			id=_Global.INT32(h["rid"]);
			for (var iii = 0; iii < tempArray.length; iii++) {
				if ((tempArray[iii] as EmailItem).id==id) {
					scrollReport.removeUIObject(tempArray[iii] as EmailItem);
				}
			}
		}
		else if(selectedTab == 3) //outbox
		{
			tempArray = scrollSent.getUIObject();
			id=_Global.INT32(h["messageId"]);
			for (var iiii = 0; iiii < tempArray.length; iiii++) {
				if ((tempArray[iiii] as EmailItem).id==id) {
					scrollSent.removeUIObject(tempArray[iiii] as EmailItem);
				}
			}
		}
	}

	public function handleDelete()
	{
		var arr:Array = _CheckSelectedItem();
		
		if(arr != null && arr.length > 0)
		{
			if(selectedTab == 0 && ((arr[0] as Array).length > 0 || (arr[1] as Array).length >0))
			{
				changePageWhenDelMessage((arr[0] as Array).length + (arr[1] as Array).length);
				Message.getInstance().DeleteSysMessagesTrue(arr[0],null);
				Message.getInstance().DeleteInboxMessagesTrue(arr[1],successDeleteMesInboxNew);
			}
			else if(selectedTab == 1  && ((arr[0] as Array).length > 0 || (arr[1] as Array).length >0))
			{
				changePageWhenDelMessage((arr[0] as Array).length + (arr[1] as Array).length);
				Message.getInstance().DeleteSysMessages(arr[0],null);
				Message.getInstance().DeleteInboxMessages(arr[1],successDeleteMesInboxNew);
			}
			else if(selectedTab == 2)
			{
				changePageWhenDelMessage(arr.length);
				Message.getInstance().DeleteReportMessages(arr.ToBuiltin(int), successDeleteMesReportNew);
			}
			else if(selectedTab == 3)
			{
				changePageWhenDelMessage(arr.length);
				Message.getInstance().DeleteOutboxMessages(arr.ToBuiltin(int), successDeleteMesOutboxNew);
			}
			changePageWhenDelMessageNew();
		}
	}
	private function changePageWhenDelMessageNew(){
		if(selectedTab == 0)
		{
			newCurpage.tab0=scrollInbox.numUIObject/10;
			g_curSysInboxPage=scrollInbox.numUIObject/10+1;
		}
		
		if(selectedTab == 1)
		{
			newCurpage.tab1=scrollInbox2.numUIObject/10;
			g_curInboxPage=scrollInbox2.numUIObject/10+1;
		}
		
		if(selectedTab == 2)
		{
			newCurpage.tab2=scrollReport.numUIObject/10;
			g_curReportPage=scrollReport.numUIObject/10+1;
		}
		
		if(selectedTab == 3)
		{
			newCurpage.tab3=scrollSent.numUIObject/10;
			g_curSentPage=scrollSent.numUIObject/10+1;
		}
		fillView(false);
	}
	//新的删除成功方法
	public function successDeleteMesReportNew(){
		// scrollReport.clearUIObject();
		// Message.getInstance().ShowReportList(g_curReportPage,resultGetReportList,exceptionCallback,1);
		// newCurpage.tab2=g_curReportPage;
		// scrollReport.DragOnce();
		
		// return;
	
		var arr:Array = _CheckSelectedItemObj();
		for (var i = arr.length - 1; i >= 0; i--) {
			scrollReport.removeUIObject(arr[i] as EmailItem);
		}
		scrollReport.DragOnce();
		
	}
	
	private function successEmpty()
	{
		if (titleTab.selectedIndex==0) {
			g_curSysInboxPage = 1;
			newCurpage.tab0=2;
		}else if (titleTab.selectedIndex==1) {
			g_curInboxPage = 1;
			newCurpage.tab1=2;
		}else if (titleTab.selectedIndex==2) {
			g_curReportPage = 1;
			newCurpage.tab2=2;
		}else if (titleTab.selectedIndex==3){
			g_curSentPage = 1;
			newCurpage.tab3=2;
		}

		fillView(false);
		resetPageInfor();
	}
	
	private function successDeleteMesInbox()
	{
		resetPageInfor();
	}

	public function successDeleteMesInboxNew()
	{
	
		// if(selectedTab == 0)
		// {	   
		// 	scrollInbox.clearUIObject();
		// 	Message.getInstance().ShowList("inbox", g_curSysInboxPage, resultGetSysInboxList,true,exceptionCallback,1,1);
		// 	newCurpage.tab0=g_curSysInboxPage;
		// 	scrollInbox.DragOnce();
		// }	
		// else if(selectedTab == 1)
		// {
		// 	scrollInbox2.clearUIObject();
		// 	Message.getInstance().ShowList("inbox", g_curInboxPage, resultGetInboxList,true,exceptionCallback,0,1);
		// 	newCurpage.tab1=g_curInboxPage;
		// 	scrollInbox2.DragOnce();
		// }
		
		// return;
		var arr:Array = _CheckSelectedItemObj();
//		for (var i = arr.length - 1; i >= 0; i--) {
//			scrollInbox.removeUIObject(arr[i] as EmailItem);
//		}

		if (selectedTab == 0 && ((arr[0] as Array).length > 0 || (arr[1] as Array).length >0)) {
			for (var ii = (arr[0] as Array).length - 1; ii >= 0; ii--) {
				scrollInbox.removeUIObject((arr[0] as Array)[ii] as EmailItem);
			}
			for (var jj = (arr[1] as Array).length - 1; jj >= 0; jj--) {
				scrollInbox.removeUIObject((arr[1] as Array)[jj] as EmailItem);
			}
			scrollInbox.DragOnce();
		}
		if (selectedTab == 1 && ((arr[0] as Array).length > 0 || (arr[1] as Array).length >0)) {
			for (var iii = (arr[0] as Array).length - 1; iii >= 0; iii--) {
				scrollInbox2.removeUIObject((arr[0] as Array)[iii] as EmailItem);
			}
			for (var j = (arr[1] as Array).length - 1; j >= 0; j--) {
				scrollInbox2.removeUIObject((arr[1] as Array)[j] as EmailItem);
			}
			scrollInbox2.DragOnce();
		}
	}
	
	private function successDeleteMesOutbox()
	{
		resetPageInfor();	
	}

	private function successDeleteMesOutboxNew()
	{
		// scrollSent.clearUIObject();
		// Message.getInstance().ShowList("outbox", g_curSentPage, resultGetOutBoxList,true,exceptionCallback,0,1);
		// newCurpage.tab3=g_curSentPage;

		
		// return;
	
		var arr:Array = _CheckSelectedItemObj();
		for (var i = arr.length - 1; i >= 0; i--) {
			scrollSent.removeUIObject(arr[i] as EmailItem);
		}	
		scrollSent.DragOnce();
	}
	
	private function successDeleteMesReport()
	{
		resetPageInfor();	
	}
	
	public function handleCompose()
	{
		var _data:Object = {"name":"", "subject":""};
		PushSubMenu(composeMenu, _data);
	}
	
	public function handleMarkAsRead()
	{
		var arr:Array = _CheckSelectedItem();
		
		if(arr != null && arr.length >0)
		{
			if(selectedTab == 0 && ((arr[0] as Array).length > 0 || (arr[1] as Array).length >0))
			{
				Message.getInstance().SetSysboxsRead(arr[0],null);
				Message.getInstance().SetInboxsRead(arr[1],successMarkNew);
			}
			else if(selectedTab == 1 && ((arr[0] as Array).length > 0 || (arr[1] as Array).length >0))
			{
				Message.getInstance().SetSysboxsRead(arr[0],null);
				Message.getInstance().SetInboxsRead(arr[1],successMarkNew);
			}
			else if(selectedTab == 2)
			{
				Message.getInstance().SetReportsRead(arr.ToBuiltin(int), successMarkNew);
			}
		}
	}
	private function successMarkNew(){
		var arr:Array = _CheckSelectedItemObj();
		if (selectedTab == 0 && ((arr[0] as Array).length > 0 || (arr[1] as Array).length >0)) {
			for (var ii = (arr[0] as Array).length - 1; ii >= 0; ii--) {
				((arr[0] as Array)[ii] as EmailItem).setReaded(true);
			}
			for (var jj = (arr[1] as Array).length - 1; jj >= 0; jj--) {
				((arr[1] as Array)[jj] as EmailItem).setReaded(true);
			}
		}
		if (selectedTab == 1 && ((arr[0] as Array).length > 0 || (arr[1] as Array).length >0)) {
			for (var iii = (arr[0] as Array).length - 1; iii >= 0; iii--) {
				((arr[0] as Array)[iii] as EmailItem).setReaded(true);
			}
			for (var j = (arr[1] as Array).length - 1; j >= 0; j--) {
				((arr[1] as Array)[j] as EmailItem).setReaded(true);
			}
		}
		if (selectedTab == 2) {
			for (var i = arr.length - 1; i >= 0; i--) {
				(arr[i] as EmailItem).setReaded(false);
			}
		}
	}


	private function successMark()
	{
		g_isEdit = false;		
		btnSelectAll.selected = false;
		g_hasGetScrollData = false;		
		resetTipAndAlert();
	}
	
	public function hanldeEdit()
	{
		g_isEdit = !g_isEdit;
	}
	
	public function isEdit()
	{
		return g_isEdit;
	}

	public function ClickShareReport(param:Object):void
	{
		subMenuStack.Add(reportMenu);
		reportMenu.OnPush(param);
		reportMenu.rect.x = 0;
		reportMenu.SetVisible(true);
	}
	public function PopShareReport()
	{
		subMenuStack.Remove(reportMenu);
		reportMenu.OnPop();
		MenuMgr.getInstance().PopMenu("EmailMenu");
	}
}
