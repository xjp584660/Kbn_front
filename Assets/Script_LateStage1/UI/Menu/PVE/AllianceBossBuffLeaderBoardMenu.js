class AllianceBossBuffLeaderBoardMenu extends PopMenu
{
	@SerializeField private var line:Label;
	@SerializeField private var leaderList:ScrollList;
	@SerializeField private var leaderItem:ListItem;
	@SerializeField private var desc:SimpleLabel;
	@SerializeField private var darkBack1:Label;
	@SerializeField private var darkBack2:Label;
	@SerializeField private var ranking:SimpleLabel;
	@SerializeField private var nameTmp:SimpleLabel;
	@SerializeField private var damage:SimpleLabel;
	@SerializeField private var inputPager:Button4Page;

	
	public function Init():void
	{
		super.Init();
		title.txt = Datas.getArString("Dungeon.Buff_Title");//"BUFF RANKING";
		ranking.txt = Datas.getArString("Dungeon.Buff_Subtitle1");//"ranking";
		nameTmp.txt = Datas.getArString("Dungeon.Buff_Subtitle2");//"name";
		damage.txt = Datas.getArString("Dungeon.Buff_Subtitle3");//"damage";
		btnClose.OnClick = handleBack;
		leaderList.Init(leaderItem);
		line.setBackground("between line_list_small",TextureType.DECORATION);
		darkBack1.setBackground("square_black2",TextureType.DECORATION);
		darkBack2.setBackground("square_black2",TextureType.DECORATION);
		inputPager.Init();
		inputPager.pageChangedHandler = inputPager_Changed;
		inputPager.l_label.SetFont(FontSize.Font_25);
		inputPager.l_label.SetNormalTxtColor(FontColor.SmallTitle);
	}
	
	public function DrawItem()
	{
//		darkBack1.Draw();
		darkBack2.Draw();
		title.Draw();
		btnClose.Draw();
		line.Draw();
		desc.Draw();
		leaderList.Draw();
		ranking.Draw();
		nameTmp.Draw();
		damage.Draw();
		inputPager.Draw();
	}
	
	function Update() 
	{
		leaderList.Update();
	}
	
	public function OnPush(param:Object)
	{
		var buff:float = KBN.AllianceBossController.instance().buff/10f;
		desc.txt = String.Format(Datas.getArString("Dungeon.Buff_Sum"),"  "+buff+"%")+"\n"+Datas.getArString("Dungeon.Buff_Desc");//"current buff:"+"40%"+"\n"+"xxxxxxxxxxxxxxxxxxxxxxxx";
		inputPager.setPages(0,1);
		SelectTab(0);
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		leaderList.Clear();
	}
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("AllianceBossBuffLeaderBoardMenu");
	}
	
	public function inputPager_Changed(pageIndex:int)
	{
		ReqLeaderBoarInfo();
	}
	
	public function handleArrawClick()
	{
	
	}
	
	public function SelectTab(index:int)
	{
		ReqLeaderBoarInfo();
	}
	
	private function ReqLeaderBoarInfo()
	{
		var pageNum:int = inputPager.getCurPage();
		KBN.LeaderBoardController.instance().ReqAllianceBossBuffLeaderBoard(pageNum);
	}
	
	public function handleNotification(type:String, param:Object):void
	{
		switch(type)
		{
			case Constant.Notice.LEADERBOARD_DATA_OK:
				var paramStr :String = param as String;
				if(paramStr == "AllianceBossBuffLeaderBoard")
				{
					RefreshMenu();
				}
				break;
		}
	}
	
	private function RefreshMenu()
	{
		var dataList :System.Collections.Generic.List.<KBN.LeaderBoardItemInfo> = 
			KBN.LeaderBoardController.instance().GetDataList() as System.Collections.Generic.List.<KBN.LeaderBoardItemInfo>;
		leaderList.Clear();
		leaderList.SetData(dataList.ToArray());
		leaderList.UpdateData();
		leaderList.ResetPos();
		
		var Data:KBN.LeaderBoardInfoBase = KBN.LeaderBoardController.instance().GetLeaderBoard() as KBN.LeaderBoardInfoBase;
		var maxPage:int = (Data.total-1)/Data.PAGESIZE + 1;
		inputPager.setPages(Data.curPage,maxPage);		
	}
}