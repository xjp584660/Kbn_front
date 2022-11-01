public class AlliancesTab extends BaseAllianceTab implements IEventHandler
{
	public var l_bg1 		:Label;
	public var l_bg2 		:Label;
//	public var l_bg3 		:Label;
	
	public var alc_l_t1		:Label;
	public var alc_l_t2		:Label;
	public var alc_l_t3		:Label;
	public var alc_l_t4		:Label;
	public var alc_l_t5		:Label;

	public var alc_l_warning:Label;
	
	public var alc_sv_scroll :ScrollList;
	public var alc_sv_sitem  :ListItem;
	public var alc_sv_b4g	:Button4Page;		
	
	public var mainCon : ComposedUIObj;
	public var allianceDetailCon:AllianceDetailCon2;
	
	public var asbar :AllianceSearchBar;
	public var swithBtn:Button;
	private var searchStr:String="";
	/***
	**/
	protected var detailAlliance:AllianceVO;
	
	public function Init()
	{
		nc = new NavigatorController();
		swithBtn.Init();
		swithBtn.setNorAndActBG("button_down_normal","button_down_down");
		if (KBN._Global.IsLargeResolution ()) 
		{
			swithBtn.rect.width = 62;
		} 
		else if (KBN._Global.isIphoneX ()) 
		{
			swithBtn.rect.width = 85;
		}
		else
		{
			swithBtn.rect.width = 75;
		}
		swithBtn.rect.height = 64;
		
		asbar.Init();
		asbar.callback_x = callback_x;
		asbar.callback_search = callback_search;
		
		alc_sv_scroll.Init(alc_sv_sitem);
		alc_sv_scroll.itemDelegate = this;
		alc_sv_b4g.Init();
		alc_sv_b4g.pageChangedHandler = alc_gotoPage;	//TODO;
		
		alc_l_warning.txt = Datas.getArString("Alliance.NO_Alliances");
		alc_l_warning.SetVisible(false);
		
		allianceDetailCon.Init();
		allianceDetailCon.btn_send.OnClick = send_message;
		allianceDetailCon.nav_head.controller = nc;
		swithBtn.OnClick = OpenSwitchAllianceRankMenu;
		nc.push(mainCon);
		
//		l_bg3.setBackground("frame_metal_square", TextureType.DECORATION);
		
		//TEST..
//		mainCon.addUIObject(alc_sv_sitem);
		//
		alc_l_t1.txt = Datas.getArString("Common.NO_");
		alc_l_t2.txt = Datas.getArString("Alliance.AllianceNameAndOwner");
		alc_l_t3.txt = "";	// Datas.getArString("Common.Owner");
		alc_l_t4.txt = Datas.getArString("Alliance.Members");
		alc_l_t5.txt = Datas.getArString("Alliance.LeaderboardTitle_Level");
		Alliance.getInstance().RankType = Constant.AllianceRankType.LEVEL;
	}
	public function Update()
	{
		super.Update();
		if(nc.topUI == mainCon)
			alc_sv_scroll.Update();
			
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
	
	public function showAllianceList():void
	{
		searchStr = asbar.it_search.txt = "";
		alc_gotoPage(1);
	}
	
	private function alc_gotoPage (page:int):void
	{
		Alliance.getInstance().reqAllianceGetOtherInfO(Alliance.getInstance().RankType,page,searchStr,alc_listload);
	}
	
	
	private function alc_listload(result:HashObject,list:AllianceVO[])
	{
		//
		//list.sort(mightSortFunc);
		alc_sv_scroll.ResetPos();
		alc_sv_scroll.SetData(list);
		if(KBN.Alliance.singleton.RankType == Constant.AllianceRankType.LEAGUE)
		{
			alc_l_warning.txt = Datas.getArString("Alliance.AllianceSearch_NoResult");
		}
		else
		{
			alc_l_warning.txt = Datas.getArString("Alliance.NO_Alliances");
		}
		alc_l_warning.SetVisible(list == null || list.length == 0);
	
		alc_sv_b4g.setPages(_Global.INT32(result["currentPage"]), _Global.INT32(result["noOfPages"]) );		
		
		//alc_sv_scroll.rect.height = alc_sv_scroll.rowDist * list.length;		

	}
	
	
	////
	private function callback_x():void
	{
		if(searchStr == "")
			return;
		searchStr = "";
		alc_gotoPage(1);
	}
	
	private function callback_search():void
	{
		searchStr = asbar.getSearchText();
		alc_gotoPage(1);	
	}
	
	private function gotoAllianceDetail(avo:AllianceVO):void
	{
		this.detailAlliance = avo;
		nc.push(this.allianceDetailCon);
		allianceDetailCon.nav_head.updateBackButton();
//		allianceDetailCon.detail.setRectHeight(585);
		allianceDetailCon.detail.setAllianceInfo(avo);
	}
	
	
	protected function send_message(clickParam:Object):void
	{
		//TODO......
		var data:Hashtable = {};
		data["title"] = Datas.getArString("Alliance.MessageLeader");
		data["toIds"] =  detailAlliance.hostUserId;	//allianceId
		data["type"] = "user";
		data["tileId"] = "";
		data["toname"] = detailAlliance.hostGenderAndName;
		MenuMgr.getInstance().PushMenu("AllianceMail",data,"trans_zoomComp");
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
	
	private function OpenSwitchAllianceRankMenu(param:Object):void
	{
		MenuMgr.getInstance().PushMenu("SwitchAllianceRankMenu",null,"trans_zoomComp");
	}
	
	public	function	Clear()
	{
		alc_sv_scroll.Clear();
	}
}
