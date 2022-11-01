//this is not only pve, but also hero
class PveLeaderboardMenu extends PopMenu
{
	@SerializeField private var menuType :Constant.PveLeaderboardMenuType.Menu_Type;
	
	private var totalNum:int = 100;//100
	@SerializeField private var leaderList:ScrollList;
	@SerializeField private var leaderItem:ListItem;
	@SerializeField private var listbar: ToolBar;
	
	@SerializeField private var raking:Label;
	@SerializeField private var score:Label;
	@SerializeField private var page:Label;
	@SerializeField private var line:Label;
	@SerializeField private var topsoil:Label;
	
	@SerializeField private var soilRaking:Label;
	@SerializeField private var soilName:Label;
	@SerializeField private var soilScore:Label;
	
	@SerializeField private var curAlpha :float = 0.75f;
	@SerializeField private var myTitle:Label;
	@SerializeField private var bottomDesc :SimpleLabel;
	
	public var leftBtn:Button;
	public var rightBtn:Button;
	
	public var curPage:int;
	public var curType:int;
	public var chapterID:int;
	
	public var Data:KBN.LeaderBoardInfoBase;
	private var curSelectIndex:int;
	
	public function Init():void
	{
		super.Init();
		leaderItem.Init();
		leaderList.Init(leaderItem);
		
		listbar.Init();
		raking.Init();
		score.Init();
		
		leftBtn.Init();
		rightBtn.Init();
		page.Init();
		line.Init();
		topsoil.Init();
		
		btnClose.Init();
		
		listbar.indexChangedFunc = SelectTab;
		
		btnClose.OnClick = handleBack;
		leftBtn.setNorAndActBG("button_flip_left_normal","button_flip_left_down");
		rightBtn.setNorAndActBG("button_flip_right_normal","button_flip_right_down");
		leftBtn.OnClick = handleClickLeft;
		rightBtn.OnClick = handleClickRight;
		
		topsoil.setBackground("square_black2",TextureType.DECORATION);
		line.setBackground("between line_list_small",TextureType.DECORATION);
		
		listbar.mystyle.normal.background = TextureMgr.instance().LoadTexture("tab_big_normal", TextureType.BUTTON);
		listbar.mystyle.onNormal.background = TextureMgr.instance().LoadTexture("tab_big_down", TextureType.BUTTON);
		
		page.txt = "";
		
		listbar.SetNormalTxtColor(FontColor.New_PageTab_Yellow);
		listbar.SetOnNormalTxtColor(FontColor.New_PageTab_Yellow);
	}
	
	public function DrawItem()
	{
		leaderList.Draw();
		listbar.Draw();
		
		raking.Draw();
		score.Draw();
		page.Draw();
		line.Draw();
		topsoil.Draw();
		
		soilRaking.Draw();
		soilName.Draw();
		soilScore.Draw();
		
		leftBtn.Draw();
		rightBtn.Draw();
		bottomDesc.Draw();
		
		var oldAlpha:float = GUI.color.a;
		GUI.color.a = curAlpha;
		myTitle.Draw();
		GUI.color.a = oldAlpha;
	}
	
	function Update() 
	{
	}
	
	public function OnPush(param:Object)
	{
		menuType = _Global.INT32(param);
		
		switch(menuType)
        {
        case Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_PVE:
        	listbar.toolbarStrings = [Datas.getArString("Campaign.Leaderboard_RadioBox1"), Datas.getArString("Campaign.Leaderboard_RadioBox2")];//["top100","Alliance"];
            myTitle.txt = Datas.getArString("Campaign.Leaderboard_Title");// "Leaderboard";
            raking.txt = String.Format(Datas.getArString("Campaign.Leaderboard_SubTitle1")," ");//"Raking  0";
			score.txt = String.Format(Datas.getArString("Campaign.Leaderboard_SubTitle2")," ");//"Score  0";
			
			soilRaking.txt = Datas.getArString("Campaign.Leaderboard_SubTitle3");//"Raking";
			soilName.txt = Datas.getArString("Campaign.Leaderboard_SubTitle4");//"Name";
			soilScore.txt = Datas.getArString("Campaign.Leaderboard_SubTitle5");//"Score";
			bottomDesc.txt = "";//Ranking calculated acording to all records of Campaign Battle scores.
            break;
        case Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_HERO:
        	listbar.toolbarStrings = [Datas.getArString("HeroHouse.Leaderboard_RadioBox1"),Datas.getArString("HeroHouse.Leaderboard_RadioBox2"), Datas.getArString("HeroHouse.Leaderboard_RadioBox3")];//["all time","this week", "past week"];
			myTitle.txt = Datas.getArString("HeroHouse.Leaderboard_Title");
			raking.txt = String.Format(Datas.getArString("HeroHouse.Leaderboard_SubTitle1")," ");//"Raking  0";
			score.txt = String.Format(Datas.getArString("HeroHouse.Leaderboard_SubTitle2")," ");//"Score  0";
			
			soilRaking.txt = Datas.getArString("HeroHouse.Leaderboard_SubTitle3");//"Raking";
			soilName.txt = Datas.getArString("HeroHouse.Leaderboard_SubTitle4");//"Name";
			soilScore.txt = Datas.getArString("HeroHouse.Leaderboard_SubTitle5");//"Score";
			bottomDesc.txt = Datas.getArString("HeroHouse.Leaderboard_Desc");//"hero bottom desc";
			break;
        }
        
		SelectTab(0);
	}
	
	public function OnPop()
	{
		super.OnPop();
		
	}
	
	public	function	OnPopOver()
	{
		super.OnPopOver();
		leaderList.Clear();
	}
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("PveLeaderboardMenu");
	}
	
	private function SelectTabPVE(index:int)
	{
		chapterID = 0;
		if(index == 0)
		{
			if(GameMain.instance().curSceneLev() == GameMain.CAMPAIGNMAP_SCENE_LEVEL)
			{
				myTitle.txt = Datas.getArString("Campaign.Leaderboard_Title");// "Leaderboard of Campaign";
				bottomDesc.txt = Datas.getArString("Campaign.Leaderboard_Desc1");
				curType = 0;
			}
			else if(GameMain.instance().curSceneLev() == GameMain.CHAPTERMAP_SCENE_LEVEL)
			{
				myTitle.txt = Datas.getArString("Campaign.Leaderboard_Title2");// "Leaderboard of this chapter";
				bottomDesc.txt = Datas.getArString("Campaign.Leaderboard_Desc2");
				curType = 2;
				chapterID = GameMain.instance().GetCurChapterId();
			}
			else
			{
				return;
			}
		}
		else if(index == 1)
		{
			if(GameMain.instance().curSceneLev() == GameMain.CAMPAIGNMAP_SCENE_LEVEL)
			{
				myTitle.txt = Datas.getArString("Campaign.Leaderboard_Title");// "Leaderboard of Campaign";
				bottomDesc.txt = Datas.getArString("Campaign.Leaderboard_Desc1");
				curType = 1;
			}
			else if(GameMain.instance().curSceneLev() == GameMain.CHAPTERMAP_SCENE_LEVEL)
			{
				myTitle.txt = Datas.getArString("Campaign.Leaderboard_Title2");// "Leaderboard of this chapter";
				bottomDesc.txt = Datas.getArString("Campaign.Leaderboard_Desc2");
				curType = 3;
				chapterID = GameMain.instance().GetCurChapterId();
			}
			else
			{
				return;
			}
		}
		
		curPage = 1;
		
		
		KBN.LeaderBoardController.instance().ReqPveLeaderBoard(curType, chapterID, curPage);
	}
	
	private function SelectTabHero(index:int)
	{
		curPage = 1;
		KBN.LeaderBoardController.instance().ReqHeroLeaderBoard(curSelectIndex, curPage);
	}
	
	public function SelectTab(index:int)
	{
		curSelectIndex = index;
		leaderList.Clear();
		page.txt = "1/1";
		
		switch(menuType)
		{
		case Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_PVE:
			SelectTabPVE(index);
			break;
		case Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_HERO:
			SelectTabHero(index);
			break;
		}
	}
	
	public function handleClickLeft()
	{
		curPage--;
		if(curPage<1)
		{
			curPage=1;
			return;
		}
		switch(menuType)
        {
        case Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_PVE:
        	KBN.LeaderBoardController.instance().ReqPveLeaderBoard(curType, chapterID, curPage);
            break;
        case Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_HERO:
        	KBN.LeaderBoardController.instance().ReqHeroLeaderBoard(curSelectIndex, curPage);
            break;
        }
	}
	
	public function handleClickRight()
	{
		curPage++;
		var maxNum = Data.total>totalNum?totalNum:Data.total;
		var maxPage:int = (maxNum-1)/Data.PAGESIZE + 1;
		if(curPage>maxPage)
		{
			curPage=maxPage;
			return;
		}
		switch(menuType)
        {
        case Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_PVE:
        	KBN.LeaderBoardController.instance().ReqPveLeaderBoard(curType, chapterID, curPage);
            break;
        case Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_HERO:
        	KBN.LeaderBoardController.instance().ReqHeroLeaderBoard(curSelectIndex, curPage);
            break;
        }
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
		case Constant.Notice.PVE_LEADER_BOARD_OK:
			Data = KBN.LeaderBoardController.instance().GetLeaderBoard() as KBN.LeaderBoardInfoBase;
			UpdateMenu();
			break;
		case Constant.Notice.HERO_LEADER_BOARD_OK:
			Data = KBN.LeaderBoardController.instance().GetLeaderBoard() as KBN.LeaderBoardInfoBase;
			UpdateMenu();
			break;
		}
	}
	
	public function UpdateMenu()
	{
		switch(menuType)
        {
        case Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_PVE:
        	if(Data.position<=0)
				raking.txt = String.Format(Datas.getArString("Campaign.Leaderboard_SubTitle1"),"  ");
			else
				raking.txt = String.Format(Datas.getArString("Campaign.Leaderboard_SubTitle1")," "+(Data.position));//"Raking  "+(Data.position+1);
				score.txt = String.Format(Datas.getArString("Campaign.Leaderboard_SubTitle2"),""+Data.score);//"Score  "+Data.score;
            break;
        case Constant.PveLeaderboardMenuType.Menu_Type.MENU_TYPE_HERO:
        	if(Data.position<=0)
				raking.txt = String.Format(Datas.getArString("HeroHouse.Leaderboard_SubTitle1"),"  ");
			else
				raking.txt = String.Format(Datas.getArString("HeroHouse.Leaderboard_SubTitle1")," "+(Data.position));//"Raking  "+(Data.position+1);
			score.txt = String.Format(Datas.getArString("HeroHouse.Leaderboard_SubTitle2"),""+Data.score);//"Score  "+Data.score;
            break;
        }
		
		var maxNum = Data.total>totalNum?totalNum:Data.total;
		var maxPage:int = (maxNum-1)/Data.PAGESIZE + 1;
		page.txt = curPage+"/"+maxPage;
		
		var dataList :System.Collections.Generic.List.<KBN.LeaderBoardItemInfo> = Data.leaderBoardList;
		leaderList.Clear();
		leaderList.SetData(dataList.ToArray());
		leaderList.UpdateData();
		leaderList.ResetPos();
	}
	
	private function IsHaveAlliance():boolean
	{
		var avo:AllianceVO = Alliance.getInstance().myAlliance;
		if ( avo != null && avo.allianceId != 0 )
			return true;
		return false;
	}
}