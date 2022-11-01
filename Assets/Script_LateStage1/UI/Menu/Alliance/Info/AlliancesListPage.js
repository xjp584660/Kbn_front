#pragma strict

class AlliancesListPage
	extends UIObject
{
	@SerializeField
	private var m_tabBar : ToolBar;
	@SerializeField
	private var btnBack	:Button;
	@SerializeField
	private var alc_l_warning:Label;

	private enum AllianceType
	{
		Recommend,
		All
	}
	
	private class ListInfo
	{
		public var uiArray : UIObject[];
		public var alliancesList :ScrollList;
		public var bodyFrameRect : Rect;
		public var titleFrameRect : Rect;
		public var titleYPos : float;
		public var contentRect : Rect;
		private var m_isBeLoaded : boolean = false;
		public function get isBeLoaded() : boolean{return m_isBeLoaded;}
		public function set isBeLoaded(value : boolean) {m_isBeLoaded = value;}
	}

	@SerializeField
	private var m_listInfo : ListInfo[];
	private var m_activeInfo : ListInfo;

	@SerializeField
	private var frameHeader	:Label;
	@SerializeField
	private var frameBody	:Label;
	@SerializeField
	private var alc_l_t1	:Label;
	@SerializeField
	private var alc_l_t2	:Label;
	@SerializeField
	private var alc_l_t4	:Label;
	@SerializeField
	private var alc_l_t5	:Label;
	@SerializeField
	private var line1		:Label;
	@SerializeField
	private var line2		:Label;
	@SerializeField
	private var line3		:Label;
	@SerializeField
	private var line4		:Label;
	
	@SerializeField
	private var alc_sv_b4g	:Button4Page;		
	@SerializeField
	private var alc_as_bar	:AllianceSearchBar;
	@SerializeField
	private var btn_switchRank	: Button;
	@SerializeField
	private var allianceInfoItem  : AllianceInfoItem;
	@SerializeField
	private var lbRecommandDiscription : Label;

	//private var isBeLoaded : boolean = false;

	private var searchStr:String = "";
	public var onGoBackClick : function():void;
	public function Init(evtHandle : IEventHandler)
	{
		searchStr = "";
		var texMgr : TextureMgr = TextureMgr.singleton;
		btnBack.mystyle.normal.background = texMgr.LoadTexture("button_back2_normal", TextureType.BUTTON);
		btnBack.mystyle.active.background = texMgr.LoadTexture("button_back2_down", TextureType.BUTTON);
//		frameHeader.mystyle.normal.background = texMgr.LoadTexture("square_blackorg", TextureType.DECORATION);
		frameBody.mystyle.normal.background = texMgr.LoadTexture("square_blackorg", TextureType.DECORATION);
		if (KBN._Global.IsLargeResolution ()) 
		{
			btnBack.rect.width = 60;
			btn_switchRank.rect.width = 60;
		} 
		else if (KBN._Global.isIphoneX ()) 
		{
			btnBack.rect.width = 85;
			btn_switchRank.rect.width = 85;
		}
		else
		{
			btnBack.rect.width = 75;
			btn_switchRank.rect.width = 75;
		}
		btnBack.rect.height = 64;
		btn_switchRank.rect.height = 64;
		m_tabBar.Init();
		m_tabBar.ToSubTabTexture();
		m_tabBar.toolbarStrings = [Datas.getArString("Alliancerecommended.Title"), Datas.getArString("AllianceAll.Title") ]; //["Detail","Technology"];
		lbRecommandDiscription.txt = Datas.getArString("Alliance.RecommendTips");
		alc_l_warning.SetVisible(false);
		alc_l_warning.txt = Datas.getArString("Alliance.NO_Alliances");

		for ( var listDat : ListInfo in m_listInfo )
		{
			listDat.alliancesList.itemDelegate = evtHandle;
			listDat.alliancesList.Init(allianceInfoItem);
			listDat.isBeLoaded = false;
		}
		alc_sv_b4g.Init();
		alc_sv_b4g.pageChangedHandler = alc_gotoPage;


		/// handlers & data.
		btnBack.OnClick = function(dat)
		{
			if ( onGoBackClick != null )
				onGoBackClick();
		};

		alc_as_bar.Init();
		alc_as_bar.callback_x = alc_callback_x;
		alc_as_bar.callback_search = alc_callback_search;
		btn_switchRank.OnClick = OpenSwitchAllianceRankMenu;
		btn_switchRank.setNorAndActBG("button_down_normal","button_down_down");
		initData();
		priv_chgTabel(m_listInfo[0]);
		Alliance.getInstance().RankType = Constant.AllianceRankType.LEVEL;
	}

	public function OnPush()
	{
		if ( !m_activeInfo.isBeLoaded )
		{
			m_activeInfo.isBeLoaded = true;
			priv_queryFillScrollList();
		}
	}

	protected function initData():void
	{
		this.alc_l_t1.txt = Datas.getArString("Common.NO_");
		this.alc_l_t2.txt = Datas.getArString("Alliance.AllianceNameAndOwner");
		this.alc_l_t4.txt = Datas.getArString("Alliance.Members");
		this.alc_l_t5.txt = Datas.getArString("Alliance.LeaderboardTitle_Level");
	}	
	
	public function Update() // per frame.
	{
		if ( m_activeInfo != null )
			m_activeInfo.alliancesList.Update();
		//allAlliancesList.Update();
		if(Alliance.getInstance().RankType == Constant.AllianceRankType.LEVEL)
		{
			alc_l_t5.txt = Datas.getArString("Alliance.LeaderboardTitle_Level");
		}
		else if(Alliance.getInstance().RankType == Constant.AllianceRankType.LEAGUE)
		{
			alc_l_t5.txt = Datas.getArString("Alliance.LeaderboardTitle_League");
		}
		else
		{
			alc_l_t5.txt = Datas.getArString("Common.Might");
		}
	}
	
	public function Draw()
	{
		GUI.BeginGroup(this.rect);
		var idx : int = m_tabBar.Draw();
		if ( m_listInfo[idx] != m_activeInfo )
			priv_chgTabel(m_listInfo[idx]);
		for ( var uiObj : UIObject in m_activeInfo.uiArray )
			uiObj.Draw();
//		frameHeader.Draw();
		alc_l_t1.Draw();
		alc_l_t2.Draw();
		alc_l_t4.Draw();
		alc_l_t5.Draw();
//		line1.Draw();
//		line2.Draw();
//		line3.Draw();
//		line4.Draw();
		GUI.EndGroup();
	}

	private function priv_queryFillScrollList() : void
	{
		if ( m_activeInfo == m_listInfo[AllianceType.Recommend] )
		{
			Alliance.getInstance().reqAllianceGetOtherInfO(Alliance.getInstance().RankType,-1, alc_listload);
		}
		else
		{
			alc_gotoPage(1);
		}
	}

	private function alc_callback_x():void
	{
		if(searchStr == "")
			return;
		searchStr = "";
		alc_gotoPage(1);
	}
	
	private function alc_callback_search():void
	{
		searchStr = alc_as_bar.getSearchText();
		alc_gotoPage(1);
	}
	
	public function alc_gotoPage(page:int):void
	{
		alc_l_warning.SetVisible(false);
		Alliance.getInstance().reqAllianceGetOtherInfO(Alliance.getInstance().RankType,page,searchStr,alc_listload);
	}
	
	private function alc_listload(result:HashObject,list:AllianceVO[])
	{
		m_activeInfo.alliancesList.ResetPos();
		m_activeInfo.alliancesList.SetData(list);
		if(KBN.Alliance.singleton.RankType == Constant.AllianceRankType.LEAGUE)
		{
			alc_l_warning.txt = Datas.getArString("Alliance.AllianceSearch_NoResult");
		}
		else
		{
			alc_l_warning.txt = Datas.getArString("Alliance.NO_Alliances");
		}
		alc_l_warning.SetVisible(list == null || list.length == 0);
		if ( m_activeInfo == m_listInfo[AllianceType.All] )
			alc_sv_b4g.setPages(_Global.INT32(result["currentPage"]), _Global.INT32(result["noOfPages"]) );
	}

	protected function onRequestJoin():void
	{
		MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Alliance_RequestJoin"));
	}
	
	public	function	Clear()
	{
		//allAlliancesList.Clear();
		for ( var listDat in m_listInfo )
		{
			listDat.alliancesList.Clear();
		}
	}
	
	private function priv_chgTabel(activeInfo : ListInfo)
	{
		alc_l_t1.rect.y = activeInfo.titleYPos;
		alc_l_t2.rect.y = activeInfo.titleYPos;
		alc_l_t4.rect.y = activeInfo.titleYPos;
		alc_l_t5.rect.y = activeInfo.titleYPos;

		frameHeader.rect = activeInfo.titleFrameRect;
		frameBody.rect = activeInfo.bodyFrameRect;
		m_activeInfo = activeInfo;
		if ( !m_activeInfo.isBeLoaded )
		{
			m_activeInfo.isBeLoaded = true;
			alc_l_warning.SetVisible(false);
			priv_queryFillScrollList();
		}
		else
		{
			alc_l_warning.SetVisible(m_activeInfo.alliancesList.GetDataLength() == 0);
		}
	}
	
	private function OpenSwitchAllianceRankMenu(param:Object):void
	{
		MenuMgr.getInstance().PushMenu("SwitchAllianceRankMenu",null,"trans_zoomComp");
	}
}

