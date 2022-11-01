public class AllianceMenu extends KBNMenu
{
	public var clone_menuHead : MenuHead;
	public var menuHead:MenuHead;
	public var toolBar:ToolBar;
	
	public var info1 :AllianceInfo1;
	public var info2 :AllianceInfo2;
	
	public var tab_member:AllianceMembers;
	public var tab_alliances:AlliancesTab;	
	public var tab_report : AllianceReportTab;
	public var backgoundPaper:Texture2D;
	public var backgoundWood:Texture2D;
	
	private var m_toolBarOnNormalColor:Color;
	
	//data ..
	protected var tabUI:Array;	
	protected var tabIndex:int=0;
	protected var curUI:BaseAllianceTab;
	
	private var avo:AllianceVO;
	private var tabStrings:Array;
	protected var bgY:int = 70;
	protected var bgDrawable:boolean = true;
	
	private var androidChat:AndroidChat;
	private var currentIndex:int;
	
	private var isFromAllianceBossSlot:boolean = false;
	
	private static var gm_isOnCreateNewAlliance : boolean = false;
//	protected static var _instance:AllianceMenu;
//	public static function getInstance():AllianceMenu
//	{
//		return _instance;
//	}
	public static function OnCreateNewAllianceOK() : void
	{
		gm_isOnCreateNewAlliance = true;
	}
	public function Init():void
	{
		menuHead = GameObject.Instantiate(clone_menuHead);
		tabUI = new Array();
//		_instance = this;	
//		background = Resources.Load("Textures/UI/ui_bg_wood");
		
		tabStrings = [Datas.getArString("Common.Info"),Datas.getArString("Alliance.Members"),Datas.getArString("Common.Alliances"),Datas.getArString("Common.AllianceWall")];
		toolBar.toolbarStrings = tabStrings;
		toolBar.rect.width = 600;
		menuHead.Init();
		toolBar.Init();
//		info1 = Instantiate(info1);
		info1.Init();
		info2.Init();
		tab_member.Init();
		tab_alliances.Init();
		tab_report.Init();
		
		info1.setMenuHead(menuHead);
		info2.setMenuHead(menuHead);
		tab_member.setMenuHead(menuHead);
		tab_alliances.setMenuHead(menuHead);
		tab_report.setMenuHead(menuHead);
		
		toolBar.selectedIndex = 0;
		toolBar.indexChangedFunc = indexChangedFunc;	
		
		toolBar.mystyle.onNormal.background  = backgoundWood;
		//toolBar.mystyle.active.background  = backgoundWood;
		var img : Texture2D = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_bg_wood");
		//bgMiddleBodyPic.name = "ui_bg_wood";

		androidChat = new AndroidChat();
		tab_report.SetAndroidChat(androidChat);
		androidChat.TargetMenu = this;
		androidChat.OnInit();
		androidChat.CanShowBar = CanShowChatBar;
		this.tab_report.wallCon.SetAndroidChat(androidChat);				
	}
	private function CanShowChatBar(topMenuName:String):boolean
	{
		if (String.IsNullOrEmpty(topMenuName)) return false;
		if (!topMenuName.Equals(this.menuName)) return false;
		
		if(currentIndex != 3) return false;
		if(!tab_report.CanShowChatBar()) return false;
		
		return true;
	}
	private function OnIndexChanged(index:int)
	{
		currentIndex = index;
		var topMenu : KBNMenu = MenuMgr.getInstance().Top() as KBNMenu;
		if( topMenu != null ){
			androidChat.ShowChatBar(topMenu.menuName);
		}
	}
		
	public function DrawItem()
	{
//		menuHead.Draw();
		
		//info1.Draw();
		if(curUI)
			curUI.Draw();
			
		frameTop.Draw();	
		
		toolBar.Draw();
	}
	function SetBgDrawAble(b:boolean):void
	{
		bgDrawable = b;
	}
	
	function DrawBackground()
	{
		menuHead.Draw();
		
		if(!bgDrawable)
			return;
		
		DrawMiddleBg();
//		if(this.background)
//			DrawTextureClipped(background, new Rect( 0, 0, background.width, background.height ), Rect( 0, bgY, background.width, background.height), UIRotation.None);
		
		/*if(frameTop.spt)
		{
			frameTop.rect = Rect( 0, bgY-4, frameTop.rect.width, frameTop.rect.height);
			frameTop.Draw(true);
		//	DrawTextureClipped(frameTop, new Rect( 0, 0, frameTop.width, frameTop.height), Rect( 0, bgY-4, frameTop.width, frameTop.height), UIRotation.None);
		}*/
		
		
	}
	
	
	private var submenuOfInforMenu:String;
	public function OnPush(param:Object):void
	{
		var el:int;
	
		isFromAllianceBossSlot = false;
		if(param as Hashtable)
		{
			super.OnPush((param as Hashtable)["el"]);
			el = _Global.INT32((param as Hashtable)["el"]);
			submenuOfInforMenu = (param as Hashtable)["submenu"] + "";		
			isFromAllianceBossSlot = (_Global.INT32((param as Hashtable)["from_alliance_boss"]) > 0);
		}
		else
		{
			super.OnPush(param);
			el = _Global.INT32(param);
			submenuOfInforMenu = "";
		}

		bgDrawable = true;
		bgStartY = 90;
		this.menuHead.setTitle(Datas.getArString("ModalTitle.Alliance") );
		
		Alliance.getInstance().reqAllianceInfo();

		if(el < 0)
		  	el = Building.instance().getMaxLevelForType(Constant.Building.EMBASSY,GameMain.instance().getCurCityId() );

		info1.setEmbassLevel(el);
		
		info1.SetVisible(false);
		info2.SetVisible(false);
		info1.showRoot();
		info2.showRoot();
		
		tab_member.showRoot();
		tab_alliances.showRoot();
		tab_report.showRoot();
		
		toolBar.SelectTab(0);	
		toolBar.SetVisible(false);
		curUI = null;
		tabIndex = 0;
		var img : Texture2D = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_bg_wood");
		toolBar.mystyle.onNormal.background = backgoundWood;
		//toolBar.mystyle.active.background = backgoundWood;
		
		m_toolBarOnNormalColor = new Color(249.0f/255.0f, 237.0f/255.0f, 145.0f/255.0f, 1.0f);
		
		toolBar.mystyle.onNormal.textColor = m_toolBarOnNormalColor;
		toolBar.mystyle.active.textColor = m_toolBarOnNormalColor;
		currentIndex = 0;
	}
	
	public	function	OnPopOver()
	{
		info1.Clear();
		info2.Clear();
		tab_member.Clear();
		tab_alliances.Clear();
		tab_report.Clear();
		TryDestroy(menuHead);
		currentIndex = 0;
		menuHead = null;
		
		if (isFromAllianceBossSlot)
		{
			KBN.PveController.instance().ReqPveInfo();
		}
	}
	
	public function handleNotification(type:String,body:Object):void
	{
		androidChat.handleNotification(type,body);
		switch(type)
		{
			case Constant.Notice.ALLIANCE_INFO_LOADED:
			case Constant.Notice.ALLIANCE_EMBLEM_CHANGED:
					allianceInfoLoaded();
				break;
			case Constant.Notice.ALLIANCE_MEMBER_PROMOTE:
				tab_member.UpdateMemberItems();
				
				break;
			case Constant.Notice.TOP_MENU_CHANGE:
				var array:Array = body as Array;
				if(array == null) return;
				
				var newMenuName:String = array[1];
				androidChat.ShowChatBar(newMenuName);
				break;
			case Constant.Notice.AllianceRankSelectMight:
				Alliance.getInstance().RankType = Constant.AllianceRankType.MIGHT;
				tab_alliances.showAllianceList();
				info1.UpdateAllianceRankList();
			break;
			case Constant.Notice.AllianceRankSelectLevel:
				Alliance.getInstance().RankType = Constant.AllianceRankType.LEVEL;
				tab_alliances.showAllianceList();
				info1.UpdateAllianceRankList();
			break;
			case Constant.Notice.AllianceRankSelectLeague:
				Alliance.getInstance().RankType = Constant.AllianceRankType.LEAGUE;
				tab_alliances.showAllianceList();
				info1.UpdateAllianceRankList();
			break;
		}
		tab_member.handleNotification(type,body);
	}
	
	/// handler ...
	protected function allianceInfoLoaded():void
	{
		avo = Alliance.getInstance().myAlliance;
		if ( avo != null && avo.allianceId != 0 )
		{	
			if(info2.IsDipSetAsTopUI())
				toolBar.SetVisible(false);
			else
				toolBar.SetVisible(true);
			
			tabUI[0] = info2;
			info2.SetVisible(true);
			tabUI[1] = tab_member;	
			tabUI[2] = tab_alliances;
			tabUI[3] = tab_report;
			bgY = 150;		
			bgStartY = 133;		
			frameTop.rect.y = 132;		
			info2.showAllianceInfo(avo);			
			tab_member.leadCon.showLeaders();
			tab_report.wallCon.setWallItemAdmin(0,avo.isAdmin());
			
			if ( gm_isOnCreateNewAlliance )
			{
				gm_isOnCreateNewAlliance = false;
				MenuMgr.getInstance().PushMenu("AllianceConditionPopup", avo, "trans_zoomComp");
			}
		}
		else	//
		{
//			toolBar.toolbarStrings = ["INFO"];
//			toolBar.rect.width =  100;
			bgY = 70;
			bgStartY = 70;	
			frameTop.rect.y = 70;
			toolBar.SetVisible(false);
			tabUI[0] = info1;
			info1.SetVisible(true);
			
			switch(submenuOfInforMenu)
			{
				case "createAlli":
					info1.pushSubmenu("INFO_CREAT");
					submenuOfInforMenu = "";
					break;
					
				case "joinAlli":
					info1.pushSubmenu("INFO_JOIN");
					submenuOfInforMenu = "";
					break;	
			}			
		}
		curUI = tabUI[tabIndex];
	}
	
	public function Update()
	{
		menuHead.Update();
		//info1.Update();
		if(curUI)
			curUI.Update();
	}
	
	public function FixedUpdate()
	{
		if(curUI)
			curUI.FixedUpdate();
	}
	
	protected function indexChangedFunc(index:int):void
	{
		tabIndex = index;
		curUI = tabUI[index];
		InputText.closeActiveInput();
		tab_report.wallCon.InputBoxKeyboard_OnOut();
		OnIndexChanged(index);
		var img : Texture2D = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.BACKGROUND);
		switch(index)
		{
			case 0:				
				bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_bg_wood");
				toolBar.mystyle.onNormal.background = backgoundWood;
				//toolBar.mystyle.active.background = backgoundWood;
				toolBar.mystyle.onNormal.textColor = m_toolBarOnNormalColor;
				//toolBar.mystyle.active.textColor = Color.white;
				break;
			case 1:
				bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_bg_wood");
				toolBar.mystyle.onNormal.background = backgoundWood;
				//toolBar.mystyle.active.background = backgoundWood;
				toolBar.mystyle.onNormal.textColor = m_toolBarOnNormalColor;
				//toolBar.mystyle.active.textColor = Color.white;
				tab_member.showMembers();
				break;
			case 2:
				bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_bg_wood");
				toolBar.mystyle.onNormal.background = backgoundWood;
				//toolBar.mystyle.active.background = backgoundWood;
				toolBar.mystyle.onNormal.textColor = m_toolBarOnNormalColor;
				//toolBar.mystyle.active.textColor = Color.white;
				tab_alliances.showAllianceList();
				break;
			case 3:
				var imgWall : Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
				bgMiddleBodyPic = TileSprite.CreateTile (imgWall, "ui_paper_bottomSystem");
				toolBar.mystyle.onNormal.background = backgoundPaper;
				//toolBar.mystyle.active.background = backgoundPaper;
				var color: Color = Color(0.54,0.34,0.165,1);
				toolBar.mystyle.onNormal.textColor = color;
				//toolBar.mystyle.active.textColor = color;
				tab_report.wallCon.resetBottomOriginalPos();
				tab_report.wallCon.getWallContext();
				tab_report.showWall();
				break;
		}	
	}
	
	public function getmyNacigator():NavigatorController
	{
		if(curUI == null) return null;
		return curUI.getmyNacigator();
	}
	
	public function OnBackButton():boolean
	{
		if(curUI != null)
			return curUI.OnBackButton();
		return super.OnBackButton();
	}
	
	public function OnBack(preMenuName:String):void
	{
		info2.OnBack(preMenuName);
	}
}
