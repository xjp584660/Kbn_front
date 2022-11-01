public class AllianceInfo1 extends BaseAllianceTab implements IEventHandler
{
	/// infoCon.
	public var info_l_desc			:Label;
	public var info_l_tip			:JoinAllianceDes;
	private var clone_info_l_tip	:JoinAllianceDes;
	public var info_l_joinTitle		:Label;
	public var info_l_joinContent	:Label;
	public var info_l_creatTitle	:Label;
	public var info_l_creatContent	:Label;
	public var info_l_errorTip		:Label;
	public var info_btn_join		:Button;
	public var info_btn_creat		:Button;
//	public var info_l_bg			:Label;
	public var info_l_bg0			:Label;
	public var info_tb_join			:TouchAreaButton;
	public var info_tb_creat		:TouchAreaButton;
	
//	public var info_l_line1			:Label;
//	public var info_l_line2			:Label;
//	public var info_l_line3			:Label;
	//allianceListCon
	public var alc_btn_back	:Button;
	public var alc_l_title	:Label;
	
	//alliance list for join.
//	public var alc_l_bg3	:Label;
//	public var alc_sv		:ScrollView;
	
	//allianceDetailCon
	protected var ald_btn_back	:Button;
	protected var ald_l_title	:Label;
	public var ald_detail	:AllianceDetail;
	public var ald_btn_join :Button;
	@SerializeField
	private var ald_btn_msgLeader : Button;
	@SerializeField
	private var m_rectForCenter : Rect;
	@SerializeField
	private var m_rectForL : Rect;
	@SerializeField
	private var m_rectForR : Rect;
	
	//allianceCreatCon
	protected var aln_btn_back	:Button;
	protected var aln_l_title	:Label;
	
	public var aln_l_bg1	:BottomPaper;
//	public var aln_l_bg2	:Label;
	public var aln_l_name	:Label;
//	public var aln_tf_name	:TextField;
	public var aln_it_name	:InputText;
	public var aln_l_desc	:Label;
//	public var aln_tf_desc	:TextField;
	public var aln_it_desc	:InputText;
	public var aln_l_language:Label;
	public var aln_it_language_btn:Button;
	
	public var aln_btn_creat:Button;
	
	//all subed.
	public var infoCon:Info1_Main;
	@SerializeField
	private var alliancesListPage : AlliancesListPage;
	public var allianceDetailCon:ComposedUIObj;
	public var allianceCreatCon:ComposedUIObj;
	//data & others
//	protected var nc:NavigatorController;
	protected var forJoinAlliance:AllianceVO;
	
	private var searchStr:String = "";
	public function Init():void
	{
		alliancesListPage.Init(this);
		alliancesListPage.onGoBackClick = function(){goBack(null);};
		allianceDetailCon.Init();
		allianceCreatCon.Init();
	/*
		infoCon = new SubContainer();
		allianceListCon = new SubContainer();
		allianceDetailCon = new SubContainer();
		allianceCreatCon = new SubContainer();
	*/	
		ald_detail.Init();
		infoCon.Init();
		alliancesListPage.rect.height = infoCon.rect.height = allianceDetailCon.rect.height = allianceCreatCon.rect.height = rect.height;
		
		this.info_tb_join.Init();
		this.info_tb_creat.Init();
		
		//init alias
		aln_btn_back = ald_btn_back = alc_btn_back;
		aln_l_title = ald_l_title = alc_l_title;
		
		clone_info_l_tip = Instantiate(info_l_tip);
		
		clone_info_l_tip.Init();
		clone_info_l_tip.rect.y 	  = -15;
		clone_info_l_tip.rect.width = this.rect.width;
		clone_info_l_tip.SetLayout("AllianceMenu");
		
		//infoCon
//		infoCon.addUIObject(info_l_bg0);
//		infoCon.addUIObject(info_l_bg);
//		infoCon.addUIObject(info_l_line1);
//		infoCon.addUIObject(info_l_line2);
//		infoCon.addUIObject(info_l_line3);
		infoCon.addUIObject(clone_info_l_tip);
		infoCon.addUIObject(info_tb_join);
		infoCon.addUIObject(info_tb_creat);		
		infoCon.addUIObject(info_l_joinTitle); 
		infoCon.addUIObject(info_l_joinContent);
		infoCon.addUIObject(info_l_creatTitle);
		infoCon.addUIObject(info_l_creatContent);
		infoCon.addUIObject(info_l_errorTip);
		infoCon.addUIObject(info_btn_join);
		infoCon.addUIObject(info_btn_creat);
		

//		allianceListCon.addUIObject(alc_sv);
//		allianceListCon.addUIObject(alc_l_bg3);

		


		//allianceDetailCon
		allianceDetailCon.addUIObject(ald_btn_back);
		allianceDetailCon.addUIObject(ald_l_title);
//		allianceDetailCon.addUIObject(ald_l_name);
//		allianceDetailCon.addUIObject(ald_l_founder);
//		allianceDetailCon.addUIObject(ald_l_members);
//		allianceDetailCon.addUIObject(ald_l_ranking);
//		allianceDetailCon.addUIObject(ald_l_might);
//		allianceDetailCon.addUIObject(ald_l_desc);
		allianceDetailCon.addUIObject(ald_detail);
		
		allianceDetailCon.addUIObject(ald_btn_join);
		allianceDetailCon.addUIObject(ald_btn_msgLeader);
		//allianceCreatCon
		aln_l_bg1.Init();
		allianceCreatCon.addUIObject(aln_l_bg1);
//		allianceCreatCon.addUIObject(aln_l_bg2);
		allianceCreatCon.addUIObject(aln_btn_back);
		allianceCreatCon.addUIObject(aln_l_title);
		allianceCreatCon.addUIObject(aln_l_name);
		allianceCreatCon.addUIObject(aln_it_name);
		allianceCreatCon.addUIObject(aln_l_desc);
		allianceCreatCon.addUIObject(aln_it_desc);
		allianceCreatCon.addUIObject(aln_btn_creat);
		allianceCreatCon.addUIObject(aln_l_language);
		allianceCreatCon.addUIObject(aln_it_language_btn);
		aln_it_language_btn.txt=Datas.getArString("Alliance.Setting");
		aln_it_language_btn.OnClick=function(){
			MenuMgr.getInstance().PushMenu("AllianceLanguageMenu",0,"trans_zoomComp");
		};
		/// handlers & data.
		alc_btn_back.OnClick = goBack;
		nc = new NavigatorController();	
		nc.Init();	
		nc.push(infoCon);
		nc.pushedFunc = pushedFunc;
		nc.popedFunc = popedFunc;
		
		//
		aln_it_name.maxChar = 15;	//
 		if (Application.platform == RuntimePlatform.OSXEditor) 
 		{
 			aln_it_name.txt = String.Format("Alliance{0}", GameMain.unixtime());
		}
		else
		{
			aln_it_name.txt = "";
		}
		
		aln_it_name.type = TouchScreenKeyboardType.Default;
		aln_it_desc.type = TouchScreenKeyboardType.Default;
		
//		alc_l_bg3.setBackground("frame_metal_square", TextureType.DECORATION);
//		aln_l_bg2.setBackground("frame_metal_square", TextureType.DECORATION);
//		info_l_bg.setBackground("frame_metal_square", TextureType.DECORATION);
				
		initData();
	}

	public function RefreshLanguage(selectId:int){
		var gds:KBN.DataTable.AllianceLanguage=GameMain.GdsManager.GetGds.<KBN.GDS_Alliancelanguage>().GetItemById(selectId);
		aln_it_language_btn.txt=Datas.getArString(gds.LanguageName);
	}
	
	protected function initData():void
	{
//		info_l_desc.txt = Datas.getArString("Alliance.Description");
		info_l_joinTitle.txt = Datas.getArString("AllianceInfo.NoAlliance");
		info_l_joinContent.txt = Datas.getArString("Alliance.JoinAlliance_Button");
		info_l_creatTitle.txt = Datas.getArString("AllianceInfo.StartOwn");
		info_l_creatContent.txt = Datas.getArString("AllianceInfo.CreateAlliance");
		info_l_errorTip.txt = Datas.getArString("AllianceInfo.EmbassyRequired");
		
		
		this.info_tb_creat.OnClick = buttonHandler;
		this.info_btn_creat.OnClick = buttonHandler;
		this.info_tb_creat.clickParam = this.info_btn_creat.clickParam = "INFO_CREAT";
		this.info_tb_join.OnClick = buttonHandler;
		this.info_btn_join.OnClick = buttonHandler;
		this.info_tb_join.clickParam = this.info_btn_join.clickParam = "INFO_JOIN";
		
		//allianceDetailCon
		this.ald_btn_join.OnClick = buttonHandler;
		this.ald_btn_join.clickParam ="INFO_REQ_JOIN";
		this.ald_btn_msgLeader.OnClick = buttonHandler;
		this.ald_btn_msgLeader.clickParam = "INFO_SEND_MAIL";
		
		//allianceCreatCon
		this.aln_btn_creat.OnClick = buttonHandler;
		this.aln_btn_creat.clickParam = "INFO_REQ_CREAT";
		
		this.ald_btn_join.txt = Datas.getArString("Alliance.RequestJoin_Button");
		this.ald_btn_msgLeader.txt = Datas.getArString("Alliance.MessageLeader");
		this.aln_btn_creat.txt = Datas.getArString("Alliance.CreateAlliance_button");
		
		this.aln_l_name.txt = Datas.getArString("Common.Name");
		this.aln_l_desc.txt = Datas.getArString("Common.Description");
		this.aln_l_language.txt=Datas.getArString("Alliance.Language");
		
	}	
	public var  LINE_V:int = 95;
	public function setEmbassLevel(lv:int):void
	{
		//
		var showE:boolean = lv < 1;
		
//		info_l_line2.rect.y = info_l_line1.rect.y + LINE_V;
//		info_l_line3.rect.y = info_l_line2.rect.y + LINE_V;
		
		this.info_l_creatContent.rect.y = this.info_l_joinContent.rect.y + LINE_V;
		this.info_l_creatTitle.rect.y = this.info_l_joinTitle.rect.y + LINE_V;
		this.info_btn_creat.rect.y = this.info_btn_join.rect.y +LINE_V;
//		this.info_l_errorTip.rect.y = this.info_l_line2.rect.y  + (LINE_V - info_l_errorTip.rect.height)/2;	
		
		
		
		this.info_l_creatContent.SetVisible(!showE);
		this.info_l_creatTitle.SetVisible(!showE);
		this.info_tb_creat.SetVisible(!showE);
		this.info_btn_creat.SetVisible(!showE);
		this.info_l_errorTip.SetVisible(showE);
		
		ald_detail.rect.y = 62;
		ald_detail.rect.x = 25;
		ald_detail.setRectHeight(680);
		
		// clear...
		//DEBUG ...   set to "" while release.
//		this.aln_it_name.txt = "A19_" + GameMain.unixtime();
//		this.aln_it_desc.txt = "Alliance Description Craet At " + GameMain.unixtime();
	}
	function FixedUpdate()
	{
		nc.u_FixedUpdate();	
	}
	
	public function Update() // per frame.
	{
		//nc.u_FixedUpdate();
		nc.u_Update();
		
		if ( nc.topUI == alliancesListPage )
			nc.topUI.Update();
	}
	protected function pushedFunc(nc:NavigatorController, prevObj : UIObject):void	
	{
		switch(nc.topUI)
		{
			case alliancesListPage:
				alliancesListPage.OnPush();
				break;
		}
		updateTitle();
	}
	
	protected function popedFunc(nc:NavigatorController, prevObj : UIObject):void
	{
		updateTitle();
	}
	protected function updateTitle():void
	{
		switch(nc.topUI)
		{
			case Info1_Main:
				break;
			case alliancesListPage:
				this.alc_l_title.txt = Datas.getArString("AllianceInfo.BrowseAlliance");
				break;
			case allianceDetailCon:
				this.alc_l_title.txt = Datas.getArString("Alliance.AllianceInfo");
				break;
			case allianceCreatCon:
				this.alc_l_title.txt = Datas.getArString("AllianceInfo.CreateAlliance");
				break;
		}
	}
	
	public function pushSubmenu(submenuName:String):void
	{
		switch(submenuName)
		{
			case "INFO_CREAT":
				nc.push(this.allianceCreatCon);	
				break;
			case "INFO_JOIN":
				nc.push(this.alliancesListPage);
				break;
		}		
	}
	
	private function buttonHandler(clickParam:Object):void
	{
		switch(clickParam)
		{
			case "INFO_CREAT":
				nc.push(this.allianceCreatCon);	
				
				break;
			case "INFO_JOIN":
				nc.push(this.alliancesListPage);
				break;
			case "INFO_REQ_JOIN":
				UnityNet.reqJoinAlliance(Datas.getArString("HtmlAllianceRequest.SendRequest"),forJoinAlliance.allianceId,Datas.getArString("HtmlAllianceRequest.InterestInJoining"),onRequestJoin );				
				break;
			case "INFO_REQ_CREAT":
				Alliance.getInstance().reqCreateAlliance(aln_it_name.txt,aln_it_desc.txt,GameMain.instance().getCurCityId(),onCreateSucess );				
				break;
			case "INFO_SEND_MAIL":
				var _obj:Object = {"subMenu":"compose", "name":this.forJoinAlliance.leaderName};
				MenuMgr.getInstance().PushMenu("EmailMenu", _obj);
				break;
		}
	}
	
	public function UpdateAllianceRankList()
	{
		alliancesListPage.alc_gotoPage(1);
	}
	
	private function gotoAllianceDetail(avo:AllianceVO):void
	{
		this.forJoinAlliance = avo;
		nc.push(this.allianceDetailCon);
		// set data ..
		updateTitle();
//		this.ald_l_name.txt = avo.name;
//		this.ald_l_founder.txt = "Founder: " + avo.founderGenderAndName;
//		this.ald_l_members.txt = "Members: " + avo.membersCount;
//		this.ald_l_ranking.txt = "Ranking: " + avo.ranking;
//		this.ald_l_might.txt = "Might: " + avo.might;
//		this.ald_l_desc.txt = "Description: " + avo.description;
		ald_detail.setAllianceInfo(avo);
		//	check if can request to join
		var level : int = GameMain.instance().getPlayerLevel();
		var might : long = GameMain.instance().getPlayerMight();
		var textureMgr : TextureMgr = TextureMgr.instance();
		if ( avo.joinCheckMode )
		{
			this.ald_btn_join.txt = Datas.getArString("Alliance.RequestJoin_Button");
			this.ald_btn_msgLeader.SetVisible(true);
			this.ald_btn_msgLeader.changeToBlueNew();
			this.ald_btn_join.rect = m_rectForL;
			this.ald_btn_msgLeader.rect = m_rectForR;
		}
		else
		{
			this.ald_btn_join.txt = Datas.getArString("AllianceInfo.JoinAlliance");
			this.ald_btn_join.rect = m_rectForCenter;
			this.ald_btn_msgLeader.SetVisible(false);
		}

		if ( avo.joinCheckMode == true && (level < avo.minLevelCanJoin || might < avo.minMightCanJoin) )
		{
			ald_btn_join.changeToGreyNew();
			this.ald_btn_join.clickParam = "";
		}
		else
		{
			ald_btn_join.changeToBlueNew();
			this.ald_btn_join.clickParam = "INFO_REQ_JOIN";
		} 
	}
	
	private function goBack(clickParam:Object):void
	{
		nc.pop();
	}
	
	public function handleItemAction(action:String,data:Object):void
	{
		switch(action)
		{
			case Constant.Action.ALLIANCE_ITEM_NEXT:
				gotoAllianceDetail(data as AllianceVO);
				break;
		}
	}
		
		
	protected function onRequestJoin(isDirectLogin : boolean):void
	{
		if ( isDirectLogin )
		{
			var strFmt : String = Datas.getArString("AllianceJoin.toaster");
			var toast : String = String.Format(strFmt, forJoinAlliance.name);
			MenuMgr.getInstance().PushMessage(toast);
			UpdateSeed.instance().update_seed_ajax( true, null );
		}
		else
		{
			MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Alliance_RequestJoin"));
		}
		MenuMgr.getInstance().PopMenu("");
	}
	protected function onCreateSucess():void
	{
		MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Alliance_CreateSucess"));
		//
		aln_it_desc.txt = "";
		aln_it_name.txt = "";

		AllianceMenu.OnCreateNewAllianceOK();
		UpdateSeed.singleton.update_seed_ajax();
	}
	
	public	function	Clear()
	{
		infoCon.clearUIObject();
		alliancesListPage.Clear();
		allianceDetailCon.clearUIObject();
		allianceCreatCon.clearUIObject();
		clone_info_l_tip.Clear();
	}
	
}
