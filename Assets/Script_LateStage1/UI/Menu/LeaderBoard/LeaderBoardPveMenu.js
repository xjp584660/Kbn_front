import System.Collections.Generic;

class LeaderBoardPveMenu extends ComposedMenu
{
	public var l_bg:Label;
	public var lblTipsBack:Label;

	public var lblTipColumns:Label;
	public var lblRank:Label;
	public var lblAlcAndName:Label;
	public var lblMight:Label;
	
	public var toolBarTypes:ToolBar;
	public var toolBarDates:ToolBar;
	
	public var btnHelp:Button;

	public var lblTips1:Label;
	public var lblTips2:Label;
	public var lblCutLine1:Label;
	public var lblCutLine2:Label;
	/*leader list*/
	public var leaderList:ScrollList;
	public var itemTemplate:FullClickItem;
		
	/*page*/
	public var inputPager:Input2Page;


	private var dataSource:Array;
	private var keyword:String;
	
	//
	public var myRank:Label;
	public var myMight:Label;
	public var lockIcon:Label;
	public var scoreDesc :SimpleLabel;
	public var scoreDescText :SimpleLabel;
	
	private var Data:KBN.LeaderBoardInfoBase;
	private var curPageIndex:int;
	public var lbl_noresult:Label;
	
	function Init()
	{
		super.Init();
		
		toolBarDates.Init();
		toolBarTypes.Init();
		toolBarDates.toolbarStrings = [Datas.getArString("Rank.CampaignRank_AllTime"),Datas.getArString("Rank.CampaignRank_ThisWeek"),Datas.getArString("Rank.CampaignRank_LastWeek")];
		toolBarTypes.toolbarStrings = [Datas.getArString("Rank.CampaignRank_SubTitle1"),Datas.getArString("Rank.CampaignRank_SubTitle2")];//troops killed & score
		
		toolBarTypes.indexChangedFunc = toolBarTypes_SelectedIndex_Changed;
		toolBarDates.indexChangedFunc = toolBarDateTypes_SelectedIndex_Changed;

		leaderList.Init(itemTemplate);
		
		lblTips1.txt =  Datas.getArString("Rank.CampaignRank_Tip");
//		lblTips2.txt = Datas.getArString("Leaderboard.tipDaily");
		
		lblRank.txt = Datas.getArString("Rank.CampaignRank_Tex1");
		lblAlcAndName.txt = Datas.getArString("Rank.CampaignRank_Tex2");
		lblMight.txt = Datas.getArString("Rank.CampaignRank_Tex3");
		
		inputPager.Init();
		inputPager.pageChangedHandler = inputPager_Changed;
		
		lbl_noresult.txt = Datas.getArString("Alliance.NO_Alliances");
		lbl_noresult.visible = false;

		keyword = "";
		btnHelp.OnClick = function(param:Object)
		{
			var setting:InGameHelpSetting = new InGameHelpSetting();
			setting.type = "other";
			setting.key = "rank";
			setting.name = Datas.getArString("Leaderboard.Title");
			
			MenuMgr.getInstance().PushMenu("InGameHelp", setting, "trans_horiz");
		};
		
		myRank.txt = String.Format(Datas.getArString("Rank.CampaignRank_MyRank"), " ");
		myMight.txt = String.Format(Datas.getArString("Rank.CampaignRank_MyMight"), " ");

		lockIcon.useTile = true;
		lockIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile("Multi_city_Lock");
		scoreDesc.setBackground("square_blackorg", TextureType.DECORATION);
		scoreDescText.txt = Datas.getArString("Rank.CampaignRank_ScoreTip");
	}
	
	public	function	OnPopOver()
	{
		super.OnPopOver();
		leaderList.Clear();
	}
	
	function Update () {
		super.Update();	
		leaderList.Update();
	} 

	function DrawItem() {
		toolBarDates.Draw();
//		btnHelp.Draw();
		lblTips1.Draw();
//		lblTips2.Draw();
		
		if(toolBarTypes.selectedIndex == 0)
		{
			lblCutLine1.Draw();
			lblCutLine2.Draw();
		}
		
		lblRank.Draw();
		lblAlcAndName.Draw();
		lblMight.Draw();
		
		leaderList.Draw();
		if(toolBarTypes.selectedIndex == 0)
		{
			inputPager.Draw();
		}
		scoreDesc.Draw();
		scoreDescText.Draw();
		
		lockIcon.Draw();
		myRank.Draw();
		myMight.Draw();
		
		lbl_noresult.Draw();
	}	 
	
	function DrawTitle()
	{
		super.DrawTitle();
	}
	
	function DrawBackground()
	{
		super.DrawBackground();
		lblTipColumns.Draw();
		l_bg.Draw();
		lblTipsBack.Draw();
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		
		toolBarTypes.selectedIndex = 0;
		toolBarDates.selectedIndex = 0;
		curPageIndex = 1;
		
		displaySetting();
		menuHead.setTitle(Datas.getArString("Rank.CampaignRank_Title")) ;
		menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		
		menuHead.btn_back.setNorAndActBG("button_back2_normal","button_back2_down");
		
		toolBarDateTypes_SelectedIndex_Changed();
	}
	
	public function OnPop()
	{
	    super.OnPop();
	}
	
	//input 
	protected function inputPager_Changed(pageIndex:int)
	{
		curPageIndex = pageIndex;
		KBN.LeaderBoardController.instance().ReqPveTroopKillLeaderBoard(toolBarDates.selectedIndex, curPageIndex);
	}
	
	//tool bar top
	public function toolBarTypes_SelectedIndex_Changed()
	{
		displaySetting();

	}
	
	//tool bar bottom
	public function toolBarDateTypes_SelectedIndex_Changed()
	{
		curPageIndex = 1;
		KBN.LeaderBoardController.instance().ReqPveTroopKillLeaderBoard(toolBarDates.selectedIndex, curPageIndex);
	}
	
	private function displaySetting()
	{
		var selected:int = toolBarTypes.selectedIndex;
		if(selected == 0)
		{
			toolBarDates.SetVisible(true);
			btnHelp.SetVisible(true);
			lblTips1.SetVisible(true);
//			lblTips2.SetVisible(true);
			
			lblRank.SetVisible(true);
			lblAlcAndName.SetVisible(true);
			lblMight.SetVisible(true);
			
			leaderList.SetVisible(true);
			inputPager.SetVisible(true);
			lblTipColumns.SetVisible(true);
			l_bg.SetVisible(true);
			lblTipsBack.SetVisible(true);
			myRank.SetVisible(true);
			myMight.SetVisible(true);
			scoreDesc.SetVisible(false);
			scoreDescText.SetVisible(false);
		}
		else
		{
			toolBarDates.SetVisible(false);
			btnHelp.SetVisible(false);
			lblTips1.SetVisible(false);
//			lblTips2.SetVisible(false);
			
			lblRank.SetVisible(false);
			lblAlcAndName.SetVisible(false);
			lblMight.SetVisible(false);
			
			leaderList.SetVisible(false);
			inputPager.SetVisible(false);
			
			lblTipColumns.SetVisible(false);
			l_bg.SetVisible(false);
			lblTipsBack.SetVisible(false);
			myRank.SetVisible(false);
			myMight.SetVisible(false);
			scoreDesc.SetVisible(true);
			scoreDescText.SetVisible(true);
			
			lbl_noresult.SetVisible(false);
		}
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
		case Constant.Notice.PVE_TROOPKILL_LEADER_BOARD_OK:
			Data = KBN.LeaderBoardController.instance().GetLeaderBoard() as KBN.LeaderBoardInfoBase;
			UpdateMenu();
			break;
		}
	}
	
	private function UpdateMenu()
	{
		myRank.txt = String.Format(Datas.getArString("Rank.CampaignRank_MyRank"), " "+Data.position);
		myMight.txt = String.Format(Datas.getArString("Rank.CampaignRank_MyMight"), " "+Data.score);
		if(Data.score == 0 && Data.position == 0)
			myRank.txt = String.Format(Datas.getArString("Rank.CampaignRank_MyRank"), " ");
		var pageCount:int = _Global.INT32(Data.total / Data.PAGESIZE) + (Data.total % Data.PAGESIZE > 0?1:0);
		if(pageCount ==0)
		{
			curPageIndex = 0;
		}
		inputPager.setPages(curPageIndex,pageCount);
		
		var dataList :List.<KBN.LeaderBoardItemInfo> = Data.leaderBoardList;
		var dataArray:Array = new Array();
		var i:int;
		for(i = 0;i<dataList.Count;i++)
		{
			var mightItem:MightItem = new MightItem();
			mightItem.Rank = dataList[i].rank;
			mightItem.Name = dataList[i].displayName;
			mightItem.AllianceName = dataList[i].allianceName;
			mightItem.Might = dataList[i].score;
			mightItem.UserId = dataList[i].userID;
			mightItem.AllianceId = dataList[i].allianceId;
			
			dataArray.Add(mightItem);
		}
		
		if(dataList.Count > 0)
		{
			lbl_noresult.visible = false;
		}
		else
		{
			lbl_noresult.visible = true;
		}
		
		leaderList.Clear();
		leaderList.SetData(dataArray);	
		leaderList.UpdateData();
		leaderList.ResetPos();
	}
}