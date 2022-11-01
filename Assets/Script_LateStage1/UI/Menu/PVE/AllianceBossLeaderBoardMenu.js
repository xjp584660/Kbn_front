class AllianceBossLeaderBoardMenu extends PopMenu
{
	@SerializeField private var line:Label;
	@SerializeField private var leaderList:ScrollList;
	@SerializeField private var leaderItem:ListItem;
	@SerializeField private var listbar:ToolBar;
	@SerializeField private var alliance:AllianceBossSelectItem;
	@SerializeField private var personal:AllianceBossSelectItem;
	@SerializeField private var darkBack1:Label;
	@SerializeField private var darkBack2:Label;
	@SerializeField private var ranking:SimpleLabel;
	@SerializeField private var nameTmp:SimpleLabel;
	@SerializeField private var damage:SimpleLabel;
	@SerializeField private var view:SimpleLabel;
	@SerializeField private var inputPager:Button4Page;
	@SerializeField private var currentNotic:SimpleLabel;
	@SerializeField private var lastTimeNotic:SimpleLabel;
	@SerializeField private var allianceNotic:SimpleLabel;
	@SerializeField private var personalNotic:SimpleLabel;
	
	
	public function Init():void
	{
		super.Init();
		title.txt = Datas.getArString("Dungeon.Leaderboard_Title");//"Rank";
		ranking.txt = Datas.getArString("Dungeon.Leaderboard_Subtitle1");//"ranking";
		nameTmp.txt = Datas.getArString("Dungeon.Leaderboard_Subtitle2");//"name";
		damage.txt = Datas.getArString("Dungeon.Leaderboard_Subtitle3");//"damage";
		view.txt = Datas.getArString("Dungeon.Leaderboard_Subtitle4");//"view";
		btnClose.OnClick = handleBack;
		line.setBackground("between line",TextureType.DECORATION);
		listbar.Init();
		listbar.toolbarStrings = [Datas.getArString("Dungeon.Leaderboard_Tab1"),Datas.getArString("Dungeon.Leaderboard_Tab2")];
		listbar.indexChangedFunc = SelectTab;
		listbar.mystyle.normal.background = TextureMgr.instance().LoadTexture("tab_big_Paper_normal", TextureType.BUTTON);
		listbar.mystyle.onNormal.background = TextureMgr.instance().LoadTexture("tab_big_Paper_down", TextureType.BUTTON);
		listbar.SetNormalTxtColor(FontColor.New_PageTab_Yellow);
		listbar.SetOnNormalTxtColor(FontColor.New_PageTab_Yellow);
		darkBack1.setBackground("square_black2",TextureType.DECORATION);
		darkBack2.setBackground("square_black2",TextureType.DECORATION);
		inputPager.Init();
		inputPager.pageChangedHandler = inputPager_Changed;
		inputPager.l_label.SetFont(FontSize.Font_25);
		inputPager.l_label.SetNormalTxtColor(FontColor.SmallTitle);
		alliance.Init();
		personal.Init();
		alliance.txt = Datas.getArString("Dungeon.Leaderboard_Alliance");//"Alliance";
		personal.txt = Datas.getArString("Dungeon.Leaderboard_Player");//"Personal";
		alliance.OnClick = handleSelectAlliance;
		personal.OnClick = handleSelectPersonal;
		
		currentNotic.mystyle.normal.background = TextureMgr.instance().LoadTexture("RoundTower_icon2", TextureType.DECORATION);
		lastTimeNotic.mystyle.normal.background = TextureMgr.instance().LoadTexture("RoundTower_icon2", TextureType.DECORATION);
		allianceNotic.mystyle.normal.background = TextureMgr.instance().LoadTexture("RoundTower_icon2", TextureType.DECORATION);
		personalNotic.mystyle.normal.background = TextureMgr.instance().LoadTexture("RoundTower_icon2", TextureType.DECORATION);
		
		leaderList.Init(leaderItem);
	}
	
	public function DrawItem()
	{
		darkBack1.Draw();
		darkBack2.Draw();
		title.Draw();
		btnClose.Draw();
		line.Draw();
		listbar.Draw();
		leaderList.Draw();
		ranking.Draw();
		nameTmp.Draw();
		damage.Draw();
//		view.Draw();
		inputPager.Draw();
		alliance.Draw();
		personal.Draw();
		currentNotic.Draw();
		lastTimeNotic.Draw();
		allianceNotic.Draw();
		personalNotic.Draw();
	}
	
	function Update() 
	{
		leaderList.Update();
	}
	
	public function OnPush(param:Object)
	{
		alliance.SetState(AllianceBossSelectItem.ItemState.SELECTED);
		SelectTab(0);
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		leaderList.Clear();
	}
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("AllianceBossLeaderBoardMenu");
	}
	
	public function inputPager_Changed(pageIndex:int)
	{
		ReqLeaderBoarInfo();
	}
	
	public function handleItemClick(itemData:KBN.LeaderBoardItemInfo)
	{
		var HasReward:boolean = false;
		if(KBN.LeaderBoardController.instance().GetLeaderBoard().hasReward)
		{
			var isAlliance:boolean = alliance.isSelect;
			if(isAlliance)
			{
				if(itemData.allianceId == Alliance.getInstance().MyAllianceId())
					HasReward = true;
			}
			else
			{
				if(itemData.userID == Datas.instance().tvuid())
					HasReward = true;
			}
		}

		var id:HashObject = new HashObject({
			"Category":"Chest",
			"inShop":false,
			"hasReward":HasReward,
			"bonus":itemData.reward,
			"acqBonusOccasion":"pve"
		});
		MenuMgr.instance.PushMenu("ChestDetail4IndividualProps", id, "trans_zoomComp");
	}
	
	public function handleReceiveClick(itemData:KBN.LeaderBoardItemInfo)
	{
		KBN.LeaderBoardController.instance().ReqGetLeaderBoardReward();
	}
	
	public function SelectTab(index:int)
	{
		var isAlliance:boolean = alliance.isSelect;
		if(isAlliance)
			handleSelectAlliance();
		else
			handleSelectPersonal();
	}
	
	private function handleSelectAlliance()
	{
		inputPager.setPages(0,1);
		alliance.SetState(AllianceBossSelectItem.ItemState.SELECTED);
		personal.SetState(AllianceBossSelectItem.ItemState.UN_SELECTED);
		leaderList.Clear();
		ReqLeaderBoarInfo();
	}
	
	private function handleSelectPersonal()
	{
		inputPager.setPages(0,1);
		personal.SetState(AllianceBossSelectItem.ItemState.SELECTED);
		alliance.SetState(AllianceBossSelectItem.ItemState.UN_SELECTED);
		leaderList.Clear();
		ReqLeaderBoarInfo();
	}
	
	private function ReqLeaderBoarInfo()
	{
		var pageNum:int = inputPager.getCurPage();
		var reqType:KBN.LeaderBoardInfoBase.LEADERBOARD_TYPE;
		var isAlliance:boolean = alliance.isSelect;
		if(listbar.selectedIndex == 0 && isAlliance)
			reqType = KBN.LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_ALLIANCE_CURRENT;
		else if(listbar.selectedIndex == 0 && !isAlliance)
			reqType = KBN.LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_PERSONAL_CURRENT;
		else if(listbar.selectedIndex == 1 && isAlliance)
			reqType = KBN.LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_ALLIANCE_LASTTIME;
		else if(listbar.selectedIndex == 1 && !isAlliance)
			reqType = KBN.LeaderBoardInfoBase.LEADERBOARD_TYPE.LEADERBOARD_TYPE_ALLIANCEBOSS_DAMAGE_PERSONAL_LASTTIME;
		KBN.LeaderBoardController.instance().ReqAllianceBossDamageLeaderBoard(reqType, pageNum);
	}
	
	public function handleNotification(type:String, param:Object):void
	{
		switch(type)
		{
			case Constant.Notice.LEADERBOARD_DATA_OK:
				var paramStr :String = param as String;
				if(paramStr == "AllianceBossDamageLeaderBoard")
				{
					RefreshMenu();
				}
				break;
			case Constant.Notice.ALLIANCE_BOSS_REWARD_REFRESH:
				RefreshMenu();
				break;
		}
	}
	
	private function RefreshMenu()
	{
//		TestData();
		var Data:KBN.AllianceBossDamageLeaderBoard = KBN.LeaderBoardController.instance().GetLeaderBoard() as KBN.AllianceBossDamageLeaderBoard;
		var dataList :System.Collections.Generic.List.<KBN.LeaderBoardItemInfo> = Data.leaderBoardList;
		leaderList.Clear();
		leaderList.SetData(dataList.ToArray());
		leaderList.ForEachItem(
			function(item:ListItem)
			{
				var isAlliance:boolean = alliance.isSelect;
				if(isAlliance)
				{
					(item as PveLeaderListItem).SetDisplayNameType(PveLeaderListItem.DISPLAYE_NAME_TYPE.ALLIANCE_NAME);
					(item as PveLeaderListItem).SetJudgeType(PveLeaderListItem.JUDGE_TYPE.ALLIANCE_ID);
				}
				else
				{
					(item as PveLeaderListItem).SetDisplayNameType(PveLeaderListItem.DISPLAYE_NAME_TYPE.UER_NAME_AND_ALLIANCE_NAME);
					(item as PveLeaderListItem).SetJudgeType(PveLeaderListItem.JUDGE_TYPE.USER_ID);
				}
				(item as PveLeaderListItem).SetClickFunction(handleItemClick);
				(item as PveLeaderListItem).SetClickReceiveFunction(handleReceiveClick);
				
				return true;
			}
		);
		leaderList.UpdateData();
		leaderList.ResetPos();
		var maxPage:int = (Data.total-1)/Data.PAGESIZE + 1;
		inputPager.setPages(Data.curPage,maxPage);		
		UpdateNotice(Data);
	}
	
	private function UpdateNotice(Data:KBN.AllianceBossDamageLeaderBoard)
	{
		currentNotic.SetVisible(false);
		lastTimeNotic.SetVisible(false);
		allianceNotic.SetVisible(false);
		personalNotic.SetVisible(false);
		if(Data.curAlReward||Data.curPerReward)
			currentNotic.SetVisible(true);
		if(Data.lastAlReward||Data.lastPerReward)
			lastTimeNotic.SetVisible(true);
		if(listbar.selectedIndex == 0)
		{
			if(Data.curAlReward)
				allianceNotic.SetVisible(true);
			if(Data.curPerReward)
				personalNotic.SetVisible(true);
		}
		else if(listbar.selectedIndex == 1)
		{
			if(Data.lastAlReward)
				allianceNotic.SetVisible(true);
			if(Data.lastPerReward)
				personalNotic.SetVisible(true);
		}
	}
	
	private function TestData()
	{
//		var dataList :System.Collections.Generic.List.<KBN.LeaderBoardItemInfo> = new System.Collections.Generic.List.<KBN.LeaderBoardItemInfo>();
//		dataList.Add(new KBN.LeaderBoardItemInfo(0,1,1111,"xhx",1,"333"));
//		dataList.Add(new KBN.LeaderBoardItemInfo(0,2,1111,"xhx",1,"333"));
//		dataList.Add(new KBN.LeaderBoardItemInfo(0,3,1111,"xhx",1,"333"));
//		dataList.Add(new KBN.LeaderBoardItemInfo(0,4,1111,"xhx",1,"333"));
//		dataList.Add(new KBN.LeaderBoardItemInfo(0,5,1111,"xhx",1,"333"));
//		dataList.Add(new KBN.LeaderBoardItemInfo(0,6,1111,"xhx",1,"333"));
//		leaderList.Clear();
//		leaderList.SetData(dataList.ToArray());
//		leaderList.UpdateData();
//		leaderList.ResetPos();
	}
}