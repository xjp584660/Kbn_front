

public class WorldBossEventDetail extends ComposedUIObj{
	
	public var titleTab:ToolBar;

	public var rankList:ScrollList;
	public var rankItem :ListItem;

	public var ec_Btn4Page:Input2Page;


 	public var detailTip:ComposedUIObj;
 	public var rankTip:ComposedUIObj;
 	public var sourceObj:ComposedUIObj;

 	public var openReWardViewBtn:Button;
 	public var b_hlepBtn:Button;
 	public var b_gotoMap:Button;
 	public var l_eventBg:Label;
 	public var l_time:Label;
 	public var l_des:Label;

 	public var l_rank_des:Label;
 	public var l_rank_rank:Label;
 	public var l_rank_name:Label;
 	public var l_rank_source:Label;
 	public var l_rank_time:Label;

 	public var l_rank_meRank:Label;
 	public var l_rank_meName:Label;
 	public var l_rank_meSource:Label;
 	private var meRank:String="-";
 	private var meName:String="-";
 	private var meSource:String="-";

 	public var lbl_noresult:Label;

 	public var source_top:Label;
 	public var source_Label:Label;
 	public var sourcelabel_clone:Label;
 	public var sourcelabel_icon_clone:Label;
 	public var sourcelabel_label_clone:Label;
 	public var mySource_label:Label;

	public function Init(){
		super.Init();
		lbl_noresult.Init();
		lbl_noresult.txt = Datas.getArString("Alliance.NO_Alliances");
		lbl_noresult.SetVisible(false);
		ec_Btn4Page.Init();
		ec_Btn4Page.pageChangedHandler = ec_gotoPage;
		rankList.Init(rankItem);
		titleTab.indexChangedFunc=changeToolBar;
		titleTab.toolbarStrings=[Datas.getArString("WorldBoss.Title_Text1"),Datas.getArString("WorldBoss.Title_Text2")];
		detailTip.SetVisible(true);
		rankTip.SetVisible(false);

		l_eventBg.mystyle.normal.background=TextureMgr.instance().LoadTexture("worldboss_img",TextureType.DECORATION);
		openReWardViewBtn.txt=Datas.getArString("WorldBoss.Button_Text1");

		b_gotoMap.txt=Datas.getArString("");
		b_hlepBtn.OnClick=OpenHelp;
		b_gotoMap.OnClick=GotoMap;
		l_time.txt=GameMain.singleton.GetWorldBossTimeTip();
		l_des.txt=Datas.getArString("WorldBoss.Desc_Text1");

		l_rank_des.txt=Datas.getArString("WorldBoss.Rank_Text4");
		l_rank_rank.txt=Datas.getArString("WorldBoss.Rank_Text1");
		l_rank_name.txt=Datas.getArString("WorldBoss.Rank_Text2");
		l_rank_source.txt=Datas.getArString("WorldBoss.Rank_Text3");
		l_rank_time.txt=GameMain.singleton.GetWorldBossTimeTip();

		source_Label.txt=Datas.getArString("WorldBoss.Rank_Text6");


		
	}

	private var boss_x:int=400;
	private var boss_y:int=400;

	private function GotoMap(){
		GameMain.instance().gotoMap(boss_x,boss_y);
		if (_Global.OpenWorldBossEventType==0) {
			KBN.MenuMgr.instance.PopMenu("");
			KBN.MenuMgr.instance.PopMenu("");

		}else if (_Global.OpenWorldBossEventType==1) {
			KBN.MenuMgr.instance.PopMenu("");
		}
		
	}

	private function OpenHelp(){
		MenuMgr.getInstance().PushMenu("WorldBossHelpMenu", "bossEvent", "trans_zoomComp");
	}

	private function changeToolBar()
	{
		if (titleTab.selectedIndex==0) {
			detailTip.SetVisible(true);
			rankTip.SetVisible(false);
		}else{
			detailTip.SetVisible(false);
			rankTip.SetVisible(true);
		}
	}
	private var lastUpdateTime:long=0;
	public function Init(data:HashObject,rankData:HashObject[]){
		sourceObj.clearUIObject();
		// Init();
		ShowRank(rankData);
		var curPage:int=_Global.INT32(data["ranking"]["page"]);
		var totalPage:int=_Global.INT32(data["ranking"]["total"]);
		lastUpdateTime=_Global.INT64(data["ranking"]["timestamp"]);
		l_rank_time.txt=Datas.getArString("Leaderboard.tipPre")+GameMain.singleton.GetWorldBossRankLastUpdateTime(lastUpdateTime);
		meRank=_Global.GetString(data["ranking"]["myScore"]["rank"]);
		meName=_Global.GetString(data["ranking"]["myScore"]["name"]);
		meSource=_Global.NumFinancial(_Global.GetString(data["ranking"]["myScore"]["score"]));
		l_rank_meRank.txt=meRank;
		l_rank_meName.txt=meName;
		l_rank_meSource.txt=meSource;
		setPage(curPage,totalPage);


		var boss:PBMsgWorldBossSocket.PBMsgWorldBossSocket
			=WorldBossController.singleton.GetCurBoss();
		if (boss!=null) {
			var bossId:int=boss.bossId;
			var key=PlayerPrefs.GetString(GameMain.singleton.getUserId()+"_"+Datas.singleton.worldid()+"_"+bossId,"");
			if (key!="") {
				var strList:String[]=key.Split('_'[0]);
				var bossX:int=_Global.INT32(strList[0]);
				var bossY:int=_Global.INT32(strList[1]);
				b_gotoMap.txt=Datas.getArString("WorldBoss.Button_Text3")+"("+bossX+","+bossY+")";

				boss_x=bossX;
				boss_y=bossY;
			}else{
				b_gotoMap.txt=Datas.getArString("WorldBoss.Button_Text2");
			}
		}else{
			b_gotoMap.txt=Datas.getArString("WorldBoss.Button_Text2");
		}

    	var scoreRewards : EventCenterGroupRewards = EventCenterGroupRewards.CreateFromSourceHashObject(data["scoreReward"]);
    	var count=scoreRewards.Count;
    	var scoreProgressBarLengh : float = 560f;
    	var scoreLaeblOffset : float = 40f-25f;//-236f;



    	for (var i = 0; i < count; i++) {
    		 if (sourcelabel_clone!=null) {
    		 	var sourcelabel:Label=(Instantiate(sourcelabel_clone.gameObject) as GameObject).GetComponent(Label);
    		 	
    		 	var oneScoreLengh : float = scoreProgressBarLengh / _Global.FLOAT(scoreRewards[count-1].FromRank);
    		 	sourcelabel.rect.x = oneScoreLengh * _Global.FLOAT(scoreRewards[i].FromRank) + scoreLaeblOffset+19f;
    		 	// sourcelabel.txt = _Global.NumSimlify(_Global.INT64(scoreRewards[i].FromRank), Constant.MightDigitCountInList, false);
    		 	sourceObj.addUIObject(sourcelabel);

    		 	mySource_label.rect.x=oneScoreLengh * _Global.FLOAT(data["ranking"]["myScore"]["score"]) + scoreLaeblOffset+15f;
    		 }
    		 if (sourcelabel_icon_clone!=null) {
    		 	var sourcelabel_bg:Label=(Instantiate(sourcelabel_icon_clone.gameObject) as GameObject).GetComponent(Label);
    		 	sourcelabel_bg.rect.x=sourcelabel.rect.x-10f;
    		 	sourceObj.addUIObject(sourcelabel_bg);
    		 }
    		 if (sourcelabel_label_clone!=null) {
    		 	var sourcelabel_label:Label=(Instantiate(sourcelabel_label_clone.gameObject) as GameObject).GetComponent(Label);
    		 	sourcelabel_label.rect.x=sourcelabel.rect.x-48;
    		 	sourcelabel_label.txt = _Global.NumSimlify(_Global.INT64(scoreRewards[i].FromRank), Constant.MightDigitCountInList, false);
    		 	sourceObj.addUIObject(sourcelabel_label);
    		 }
    		 if (i==count-1) {
    		 	if (_Global.FLOAT(data["ranking"]["myScore"]["score"])>=_Global.FLOAT(scoreRewards[i].FromRank)) {
    		 		source_top.rect.width=557f;
    		 	}else{
    		 		source_top.rect.width=scoreProgressBarLengh*
    		 		_Global.INT32(data["ranking"]["myScore"]["score"])/
    		 		_Global.INT32(scoreRewards[i].FromRank);
    		 	}
    		 	
    		 }
    	}
		
		
	}

	public function  OnPopOver() {
		// body...
		rankList.Clear();
		sourceObj.clearUIObject();
	}	

	public function ShowRank(listData:Array){
		if (listData != null&&listData.length>=0) {
			lbl_noresult.SetVisible(false);	
			rankList.SetData(listData);
			rankList.ResetPos();	
		}else{
			rankList.ClearData();
			lbl_noresult.SetVisible(true);
		}
	}
	public function setPage(cur:int,total:int)
	{
		ec_Btn4Page.setPages(cur,total);
	}

	public function Update():void
	{
		super.Update();
		l_time.txt=GameMain.singleton.GetWorldBossTimeTip();
		rankList.Update();
		
	}

	//换页  start
	private function ec_gotoPage(page:int):void
	{
		var eventId:int=GameMain.singleton.GetCurBossEventId();
		EventCenter.getInstance().reqGetBossPageOfRanking(page,_Global.GetString(eventId),setRankListWithBuiltinArray);
	}
	private function setRankListWithBuiltinArray(cur : int, total : int, listData : HashObject[])
	{
		SetRankList(cur, total, listData);
	}
	public function SetRankList(cur:int,total:int,listData:Array)
	{
		setPage(cur,total);
		if(listData != null)
		{
			rankList.SetData(listData);
			rankList.ResetPos();
		}
	}
	//换页  end
}

