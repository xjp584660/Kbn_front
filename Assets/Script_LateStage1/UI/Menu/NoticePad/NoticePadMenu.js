import System.Collections.Generic;
public class NoticePadMenu extends KBNMenu
{

	//0:Toumament Info  1:Shared info  2:Toumament Rank
	public static var indexOfSelectTab:int;

	public static var backButtonMotifIsHome : boolean = true;
	//all draw
	public var lineup:Label;
	public var linedown:Label;
	public var toolbar:ToolBar;
	public var clone_menuHead : MenuHead;
	public var menuHead : MenuHead;
	
	//Toumament Info Draw
	public var deadLineTime:Label;
	public var labelIntroduction:Label;
	public var labelIntroductionPic:Label;
	public var labelActivityReward:Label;
	public var btn_DetialIntroduction:Button;
	public var btn_ViewLoss:Button;
	public var pic_ViewLoss:Label;
	public var pic_ViewLossUp:Label;
	public var toumamentInfoList:ScrollList;
	//public var toumamentInfoDescList:ScrollList;
	public var toumamentInfoTemplate:ToumamentInfoItem;
	//public var toumamentInfoDescTemplate:ToumamentInfoDescItem;
	public var toumamentInfoDesc:Label;
	//public var toolbarForToumament:ToolBar;
	public var alliance:AllianceBossSelectItem;
	public var personal:AllianceBossSelectItem;
	
	//Shared info Draw  
	//tb1  tb2  
	public var btn_Edit:Button;
	public var btn_Cancel:Button;
	public var SharedInfoList:ScrollList;
	public var SharedInfoTemplate:SharedInfoItem;
	public var btn_DeleteItem:Button;
	public var btn_MoveUpItem:Button;
	//public var btn_StickItem:Button;
	public var btn_FirstPage:Button;
	public var btn_LastPage:Button;
	public var btn_PrePage:Button;
	public var btn_NextPage:Button;
	public var cur_Page:Label;
	public var tb_SelectAll:ToggleButton;
	private var isLeader:boolean=false;
	private var _isEdit:boolean=false;
    
    private function GetisEdit() : boolean
    {
        return _isEdit;
    }
    
    private function SetisEdit(value : boolean)
    {
        _isEdit = value;
        SharedInfoList.ForEachItem(function(li : ListItem) : boolean
        {
            var sii : SharedInfoItem = li as SharedInfoItem;
            sii.IsEdit = _isEdit;
            sii.IsLeader = isLeader;
            return true;
        });
    }
    
	public var tb_All:ToggleButton;
	public var tb_MyLot:ToggleButton;
	public var tb_lb_All:Label;
	public var tb_lb_MyLot:Label;
	public var shareInfoEmpty:Label;
	public var shareInfoEmptyback:Label;
	private var maxPage:int;
	var tmpshdata:SharedTileInfoData;
	var shdata:Array=new Array();
	var shareTotalPage:int;
	var shareCurPage:int=1;
	
	//ToumamentRank Draw
	public var tb_AllRank:ToggleButton;
	public var tb_IndividualRank:ToggleButton;
	public static var isAllianRank:boolean=true;
	public static var isIndiviRank:boolean=false;
	public var tb_lb_AllRank:Label;
	public var tb_lb_IndividualRank:Label;
	public var toumamentRankList:ScrollList;
	public var toumamentRankTemplate:ToumamentRankItem;
	public var label_Rank:Label;
	public var label_Name:Label;
	public var label_Integration:Label;
	public var label_Reward:Label;
	public var btn_rank_FirstPage:Button;
	public var btn_rank_LastPage:Button;
	public var btn_rank_PrePage:Button;
	public var btn_rank_NextPage:Button;
	public var cur_rank_Page:Label;
	
	public var rank_background:Label;
	private var rankTotalPage:int;
	private var rankCurPage:int=1;
	//public static var rankPageSize:int=20;
	
	//Alliance Info
	var myAlliance:AllianceVO;
	
	function Init()
	{ 	
		//all Init
		super.Init();
		
		//Alliance Info
		if( Alliance.getInstance().hasGetAllianceInfo ){
			myAlliance = Alliance.getInstance().myAlliance;
		}else{
			Alliance.getInstance().reqAllianceInfo();
		}
		
		//RequestToumamentInfo();
		
		toumamentInfoList.Init(toumamentInfoTemplate);
		//toumamentInfoDescList.Init(toumamentInfoDescTemplate);
		//rankPageSize=20;
		menuHead = GameObject.Instantiate(clone_menuHead);
		menuHead.Init();
		menuHead.SetVisible(true);
		menuHead.l_title.txt=Datas.getArString("PVP.Event_Title");	
		menuHead.l_title.rect.x = 65;
		menuHead.l_title.rect.width = 400;
		
		
		//title.txt = Datas.getArString("PVP.Event_Title");	
		
		//lineup.setBackground("between line", TextureType.DECORATION);
		//linedown.setBackground("between line", TextureType.DECORATION);
		
		toolbar.Init();
		toolbar.toolbarStrings = [Datas.getArString("PVP.Event_Detail_Title"), 
								  Datas.getArString("PVP.Event_Share_Title"), 
								  Datas.getArString("PVP.Event_Leaderboard_Title")];
		toolbar.ToSubTabTexture();
		var texMgr : TextureMgr = TextureMgr.instance();
		toolbar.mystyle.normal.background = texMgr.LoadTexture("tab_normal", TextureType.BUTTON);
		toolbar.mystyle.onNormal.background = texMgr.LoadTexture("tab_selectedmail", TextureType.BUTTON);
		//toolbar.rect=new Rect(20,120,600,61);
		
		
		indexOfSelectTab=PvPToumamentInfoData.instance().noticeIndexOfSelectTab;
		toolbar.selectedIndex=indexOfSelectTab;
		
		toolbar.indexChangedFunc = SelectTab;
		
		//Get Alliance Rank Data when an act has ended.
		if(toolbar.selectedIndex==2)
		{
			RequestAndInitRankData();
		}
		

		
		//Toumament Info Init
		/*
		toolbarForToumament.Init();
		toolbarForToumament.ToLightTabTexture();
		toolbarForToumament.toolbarStrings = [Datas.getArString("PVP.Details_AllianceReward"),Datas.getArString("String.PlayerReward")];
        toolbarForToumament.indexChangedFunc = SelectTypeForToolbarForToumament;
        toolbarForToumament.SetDefaultNormalTxtColor(FontColor.SmallTitle);
        toolbarForToumament.SetDefaultOnNormalTxtColor(FontColor.SmallTitle);*/
        alliance.Init();
		personal.Init();
		alliance.txt = Datas.getArString("PVP.Details_AllianceReward");//"Alliance";
		personal.txt = Datas.getArString("Event.IndividualRewards");//"Personal";
		alliance.OnClick = handleSelectAlliance;
		personal.OnClick = handleSelectPersonal;
		
		
        
       	
		labelIntroduction.setBackground("Quest_kuang",TextureType.DECORATION);
		labelIntroduction.txt = "";
		labelIntroductionPic.setBackground("Decorative_strips2",TextureType.DECORATION);
		labelActivityReward.setBackground("Quest_kuang1",TextureType.DECORATION);
		labelActivityReward.txt="";//wait string.
		btn_ViewLoss.txt=Datas.getArString("PVP.Event_Detail_ViewTroop");
		btn_ViewLoss.mystyle.normal.background=TextureMgr.instance().LoadTexture("square_black_4",TextureType.DECORATION);
		btn_ViewLoss.mystyle.active.background=TextureMgr.instance().LoadTexture("square_black2",TextureType.DECORATION);
		btn_ViewLoss.OnClick = function()
		{
			var id:HashObject = new HashObject({
													"MenuType" : TournamentTroopRestoreMenu.MENU_TYPE.WORLD_MAP,
													"isViewTroop":true
												});
			MenuMgr.getInstance().PushMenu("TournamentTroopRestoreMenu",id,"trans_zoomComp");

		};
		pic_ViewLoss.setBackground("button-pve-bg",TextureType.DECORATION);
		pic_ViewLossUp.setBackground("troop_restore_report_icon",TextureType.MAP17D3A_UI);
		btn_DetialIntroduction.OnClick=function()
		{
			MenuMgr.getInstance().PushMenu("DetialPopUpMenu",null,"trans_zoomComp");
		};
		
		
		//Shared info Init
		
		//tb1  tb2  
		tb_lb_All.txt=Datas.getArString("PVP.Event_Share_All");
		tb_lb_MyLot.txt=Datas.getArString("PVP.Event_Share_Mine");
		
		tb_All.mystyle.normal.background = TextureMgr.instance().LoadTexture("radio_box2",TextureType.DECORATION);
		tb_MyLot.mystyle.normal.background = TextureMgr.instance().LoadTexture("radio_box2",TextureType.DECORATION);
		
		tb_All.mystyle.onNormal.background = TextureMgr.instance().LoadTexture("radio_box1",TextureType.DECORATION);
		tb_MyLot.mystyle.onNormal.background = TextureMgr.instance().LoadTexture("radio_box1",TextureType.DECORATION);
		tb_All.mystyle.active.background = TextureMgr.instance().LoadTexture("radio_box1",TextureType.DECORATION);
		tb_MyLot.mystyle.active.background = TextureMgr.instance().LoadTexture("radio_box1",TextureType.DECORATION);
		
		btn_Edit.txt=Datas.getArString("Common.Edit");
		btn_Edit.changeToBlueNew();		
		
		btn_Cancel.txt=Datas.getArString("Common.Cancel");
		btn_Cancel.changeToBlueNew();
		//SharedInfoList.txt="btn_Edit";
		//public var SharedInfoTemplate:SharedInfoItem;
		btn_DeleteItem.txt="";
		btn_DeleteItem.mystyle.normal.background = TextureMgr.instance().LoadTexture("alliancewall_Delete",TextureType.BUTTON);
		btn_DeleteItem.mystyle.active.background = TextureMgr.instance().LoadTexture("alliancewall_Delete2",TextureType.BUTTON);
		btn_DeleteItem.rect.x=640;
		btn_MoveUpItem.txt="";
		btn_MoveUpItem.mystyle.normal.background = TextureMgr.instance().LoadTexture("shared_Up",TextureType.BUTTON);
		btn_MoveUpItem.mystyle.active.background = TextureMgr.instance().LoadTexture("shared_Up2",TextureType.BUTTON);
		btn_MoveUpItem.rect.x=640;
/*		btn_StickItem.txt="";
		btn_StickItem.mystyle.normal.background = TextureMgr.instance().LoadTexture("shared_top",TextureType.BUTTON);
		btn_StickItem.mystyle.active.background = TextureMgr.instance().LoadTexture("shared_top2",TextureType.BUTTON);	*/	
		btn_FirstPage.txt="";
		btn_FirstPage.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_flip2_dark_left_normal",TextureType.BUTTON);
		btn_FirstPage.mystyle.active.background = TextureMgr.instance().LoadTexture("button_flip2_dark_left_down",TextureType.BUTTON);
		btn_LastPage.txt="";
		btn_LastPage.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_flip2_dark_right_normal",TextureType.BUTTON);
		btn_LastPage.mystyle.active.background = TextureMgr.instance().LoadTexture("button_flip2_dark_right_down",TextureType.BUTTON);
		btn_PrePage.txt="";
		btn_PrePage.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_flip_dark_left_normal",TextureType.BUTTON);
		btn_PrePage.mystyle.active.background = TextureMgr.instance().LoadTexture("button_flip_dark_left_down",TextureType.BUTTON);
		btn_NextPage.txt="";
		btn_NextPage.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_flip_dark_right_normal",TextureType.BUTTON);
		btn_NextPage.mystyle.active.background = TextureMgr.instance().LoadTexture("button_flip_dark_right_down",TextureType.BUTTON);
		cur_Page.txt="1";
		cur_Page.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2",TextureType.DECORATION);
		SharedInfoList.Init(SharedInfoTemplate);
		
		shdata.Clear();
		shareInfoEmpty.txt=Datas.getArString("PVP.Event_Share_Empty");
		shareInfoEmptyback.setBackground("square_black2",TextureType.DECORATION);
		SharedInfoList.SetData(shdata);
		
		btn_DeleteItem.OnClick=function(param:Object)
		{
			var tileidarray:ArrayList=new ArrayList();
			for(var item:SharedTileInfoData in shdata)
			{					
				if(item.isTb_Selected)
				{	
					if(item.flagid==4||item.flagid==5)
					{
						//item.isTb_Selected=false;
						SharedTileInfoData.isHasAllianceMemberTile=true;
					}
					else
					{
						tileidarray.Add(item.tileid);
					}	
				}
			}
			if(tileidarray.Count!=0)
			{
				if(tb_All.selected==true)
				{
					PvPToumamentInfoData.instance().RequestDeleteAllianceSharedTile(tileidarray);
				}
				else if(tb_MyLot.selected==true)
				{
					PvPToumamentInfoData.instance().RequestDeletePlayerSharedTile(tileidarray);
				}
			}
			if(SharedTileInfoData.isHasAllianceMemberTile==true)
			{
				SharedTileInfoData.isHasAllianceMemberTile=false;
				MenuMgr.instance.PushMessage(Datas.getArString("PVP.Event_Share_Toaster"));
			}
		};
		
		btn_MoveUpItem.OnClick=function(param:Object)
		{		
			var tileidarray:ArrayList=new ArrayList();
			for(var item:SharedTileInfoData in shdata)
			{
				if(item.isTb_Selected)
				{
					tileidarray.Add(item.tileid);
				}
			}
			if(tileidarray.Count!=0)
			{
				if(tb_All.selected==true)
				{
					PvPToumamentInfoData.instance().RequestSetAllianceOrderSharedTile(tileidarray);
				}
				else if(tb_MyLot.selected==true)
				{
					PvPToumamentInfoData.instance().RequestSetPlayerOrderSharedTile(tileidarray);
				}
			}
		};
		
		btn_Edit.OnClick=function(param:Object)
		{
			SetisEdit(true);
			SharedInfoList.SetData(shdata);
			SharedInfoList.rect.height=552;
		};
		
		btn_Cancel.OnClick=function(param:Object)
		{
			SetisEdit(false);
			SharedInfoList.SetData(shdata);
			SharedInfoList.rect.height=608;
			SharedInfoList.SetData(shdata);
			btn_MoveUpItem.rect.x=640;
			btn_DeleteItem.rect.x=640;
			tb_SelectAll.selected=true;
			tb_SelectAll.selected=false;
		};
		
		tb_SelectAll.valueChangedFunc = function(val:boolean)
		{
			for(var item:SharedTileInfoData in shdata)
			{
				item.isTb_Selected = val;
			}
			SharedInfoList.SetData(shdata);
		};
		
		btn_NextPage.OnClick=function(param:Object)
		{
			if(parseInt(cur_Page.txt)==shareTotalPage)
			{
				cur_Page.txt=shareTotalPage+"";
			}
			else
			{
				cur_Page.txt=(parseInt(cur_Page.txt)+1)+"";
				RefreshSharedPageData();
			}
			
		};
		btn_PrePage.OnClick=function(param:Object)
		{
			if(parseInt(cur_Page.txt)==1)
			{
				cur_Page.txt="1";
			}
			else
			{
				cur_Page.txt=(parseInt(cur_Page.txt)-1)+"";
				RefreshSharedPageData();
			}
		};
		btn_FirstPage.OnClick=function(param:Object)
		{
			if(parseInt(cur_Page.txt)!=1)
			{
				cur_Page.txt="1";
				RefreshSharedPageData();
			}
		};
		
		btn_LastPage.OnClick=function(param:Object)
		{
			if(parseInt(cur_Page.txt)!=shareTotalPage)
			{
				cur_Page.txt=shareTotalPage+"";
				RefreshSharedPageData();
			}
		};
		
		
		
		tb_All.selected=true;
		tb_MyLot.selected=false;
		tb_All.valueChangedFunc = function(val:boolean)
		{
			if(val==true)
			{
				tb_All.selected=true;
				tb_MyLot.selected=false;
				PvPToumamentInfoData.instance().RequestSharedInfo(Constant.ReqPvPToumamentId.ShareList,1,PvPToumamentInfoData.instance().sharePageSize);
				cur_Page.txt="1";
			}
			else
			{
				tb_MyLot.selected=true;
			}
			tb_SelectAll.selected=false;
            SetisEdit(false);
			//Todo:Update data
		};		
		tb_MyLot.valueChangedFunc = function(val:boolean)
		{
			if(val==true)
			{
				tb_MyLot.selected=true;
				tb_All.selected=false;
				PvPToumamentInfoData.instance().RequestSharedInfo(Constant.ReqPvPToumamentId.ShareMyList,1,PvPToumamentInfoData.instance().sharePageSize);
				cur_Page.txt="1";
			}
			else
			{
				tb_All.selected=true;
			}
			tb_SelectAll.selected=false;
            SetisEdit(false);
			//Todo:Update data
		};
		
		
		//ToumamentRank Draw
		toumamentRankList.Init(toumamentRankTemplate);
		
		tb_lb_AllRank.txt=Datas.getArString("PVP.Event_Leaderboard_Alliance");
		tb_lb_IndividualRank.txt=Datas.getArString("PVP.Event_Leaderboard_Player");
		
		tb_AllRank.mystyle.normal.background = TextureMgr.instance().LoadTexture("radio_box2",TextureType.DECORATION);
		tb_IndividualRank.mystyle.normal.background = TextureMgr.instance().LoadTexture("radio_box2",TextureType.DECORATION);
		
		tb_AllRank.mystyle.onNormal.background = TextureMgr.instance().LoadTexture("radio_box1",TextureType.DECORATION);
		tb_IndividualRank.mystyle.onNormal.background = TextureMgr.instance().LoadTexture("radio_box1",TextureType.DECORATION);
		tb_AllRank.mystyle.active.background = TextureMgr.instance().LoadTexture("radio_box1",TextureType.DECORATION);
		tb_IndividualRank.mystyle.active.background = TextureMgr.instance().LoadTexture("radio_box1",TextureType.DECORATION);
		tb_AllRank.selected=true;
		tb_IndividualRank.selected=false;
		tb_AllRank.valueChangedFunc = function(val:boolean)
		{
			if(val==true)
			{
				tb_AllRank.selected=true;
				tb_IndividualRank.selected=false;
				PvPToumamentInfoData.instance().RequestRankInfo(Constant.ReqPvPToumamentId.AllianceLeaderboard,1,PvPToumamentInfoData.instance().rankPageSize);
				cur_rank_Page.txt="1";
				rankCurPage = 1;
				isAllianRank=true;
				isIndiviRank=false;
			}
			else
			{
				tb_IndividualRank.selected=true;
			}
			//Todo:Update data
		};		
		tb_IndividualRank.valueChangedFunc = function(val:boolean)
		{
			if(val==true)
			{
				//MenuMgr.instance.SendNotification( Constant.PvPResponseOk.ReceiveTournamentBonus, null );
				/*
				var tmpRankdata:ToumamentRankData=new ToumamentRankData();
				var touRankArray:Array=new Array();
				tmpRankdata.r_Name="tmpRankdata.r_Name";
				tmpRankdata.r_Integration=88888;
				tmpRankdata.r_AllianceOfPlayer="r_AllianceOfName";
				tmpRankdata.r_position=1;
				tmpRankdata.m_bonus=GetBonusByRank(1);
				touRankArray.Add(tmpRankdata);				
				toumamentRankList.SetData(touRankArray);
				*/
				tb_IndividualRank.selected=true;
				tb_AllRank.selected=false;
				PvPToumamentInfoData.instance().RequestRankInfo(Constant.ReqPvPToumamentId.PlayerLeaderboard,1,PvPToumamentInfoData.instance().rankPageSize);
				cur_rank_Page.txt="1";
				rankCurPage = 1;
				isIndiviRank=true;
				isAllianRank=false;
			}
			else
			{
				tb_AllRank.selected=true;
			}
			//Todo:Update data
		};
		label_Rank.txt=Datas.getArString("PVP.Event_Leaderboard_SubTitle1");
		label_Name.txt=Datas.getArString("PVP.Event_Leaderboard_SubTitle2");
		label_Integration.txt=Datas.getArString("PVP.Event_Leaderboard_SubTitle3");
		label_Reward.txt=Datas.getArString("PVP.Event_Leaderboard_SubTitle4");
		
		btn_rank_FirstPage.txt="";
		btn_rank_FirstPage.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_flip2_dark_left_normal",TextureType.BUTTON);
		btn_rank_FirstPage.mystyle.active.background = TextureMgr.instance().LoadTexture("button_flip2_dark_left_down",TextureType.BUTTON);
		btn_rank_LastPage.txt="";
		btn_rank_LastPage.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_flip2_dark_right_normal",TextureType.BUTTON);
		btn_rank_LastPage.mystyle.active.background = TextureMgr.instance().LoadTexture("button_flip2_dark_right_down",TextureType.BUTTON);
		btn_rank_PrePage.txt="";
		btn_rank_PrePage.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_flip_dark_left_normal",TextureType.BUTTON);
		btn_rank_PrePage.mystyle.active.background = TextureMgr.instance().LoadTexture("button_flip_dark_left_down",TextureType.BUTTON);
		btn_rank_NextPage.txt="";
		btn_rank_NextPage.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_flip_dark_right_normal",TextureType.BUTTON);
		btn_rank_NextPage.mystyle.active.background = TextureMgr.instance().LoadTexture("button_flip_dark_right_down",TextureType.BUTTON);
		cur_rank_Page.txt="1";
		cur_rank_Page.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2",TextureType.DECORATION);
		rankCurPage = 1;
		
		rank_background.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2",TextureType.DECORATION);

		btn_rank_NextPage.OnClick=function(param:Object)
		{
			if(parseInt(cur_rank_Page.txt)==rankTotalPage)
			{
				cur_rank_Page.txt=rankTotalPage+"";
				rankCurPage = rankTotalPage;
			}
			else
			{
				cur_rank_Page.txt=(parseInt(cur_rank_Page.txt)+1)+"";
				rankCurPage++;
				RefreshRankedPageData();
			}
			
		};
		btn_rank_PrePage.OnClick=function(param:Object)
		{
			if(parseInt(cur_rank_Page.txt)==1)
			{
				cur_rank_Page.txt="1";
				rankCurPage = 1;
			}
			else
			{
				cur_rank_Page.txt=(parseInt(cur_rank_Page.txt)-1)+"";
				rankCurPage--;
				RefreshRankedPageData();
			}
		};
		btn_rank_FirstPage.OnClick=function(param:Object)
		{
			if(parseInt(cur_rank_Page.txt)!=1)
			{
				cur_rank_Page.txt="1";
				rankCurPage = 1;
				RefreshRankedPageData();
			}
		};
		
		btn_rank_LastPage.OnClick=function(param:Object)
		{
			if(parseInt(cur_Page.txt)!=rankTotalPage)
			{
				cur_rank_Page.txt=rankTotalPage+"";
				rankCurPage = rankTotalPage;
				RefreshRankedPageData();
			}
		};
	}
	
	
	
	public function handleNotification(type : String, param : Object) : void
    {
        switch (type)
	    {
            case Constant.PvPResponseOk.ToumamentInfoOK:
				var data:Array = PvPToumamentInfoData.instance().itemDataList.ToArray();
				toumamentInfoList.SetData( data );
				toumamentInfoList.UpdateData();
				toumamentInfoList.ResetPos();
				deadLineTime.txt = KBN.TournamentManager.getInstance().getTournamentTimeNotice();
				toumamentInfoDesc.txt=PvPToumamentInfoData.instance().labelIntroduction;
			break;
			
			case Constant.PvPResponseOk.SharedPageAllOK:
			case Constant.PvPResponseOk.SharedPageMyLotOK:
			
				shareTotalPage=Mathf.Ceil(PvPToumamentInfoData.instance().shareData.total*1.0f/PvPToumamentInfoData.instance().sharePageSize);
				//shareTotalPage=2;
				if(shareTotalPage==0)
				{
					shareTotalPage=1;
				}
				shdata.Clear();
				isLeader=PvPToumamentInfoData.instance().shareData.isLeader;
				for(var i:int=0;i<PvPToumamentInfoData.instance().shareData.items.Count;i++)
				{
					var tmpshdata:SharedTileInfoData=new SharedTileInfoData();
					tmpshdata.flagid=PvPToumamentInfoData.instance().shareData.items[i].status;					
					tmpshdata.intergration=PvPToumamentInfoData.instance().shareData.items[i].integration;
					tmpshdata.might=PvPToumamentInfoData.instance().shareData.items[i].might;
					tmpshdata.tileKind=PvPToumamentInfoData.instance().shareData.items[i].tileKind; 
					if(PvPToumamentInfoData.instance().shareData.items[i].userId==0)
					{
						tmpshdata.s_occupantName=Datas.getArString("Common.None");
						tmpshdata.s_allinaceName=Datas.getArString("Common.None");
					}
					else
					{
						tmpshdata.s_occupantName=PvPToumamentInfoData.instance().shareData.items[i].userName;
						tmpshdata.s_allinaceName=PvPToumamentInfoData.instance().shareData.items[i].allianceName;
					}
					tmpshdata.level=PvPToumamentInfoData.instance().shareData.items[i].level;
					tmpshdata.coordinateX=PvPToumamentInfoData.instance().shareData.items[i].xcoord;
					tmpshdata.coordinateY=PvPToumamentInfoData.instance().shareData.items[i].ycoord;
					tmpshdata.tileid=PvPToumamentInfoData.instance().shareData.items[i].tileId;
					shdata.Add(tmpshdata);
				}
				SharedInfoList.SetData(shdata);
				SharedInfoList.UpdateData();
				SharedInfoList.ResetPos();
			break;  
			
			case Constant.PvPResponseOk.DeleteSharedOK: 
				var tshdata:Array=new Array();
				//var isShowToast:boolean=false;
				for(var item:SharedTileInfoData in shdata)
				{
					if(
					(!item.isTb_Selected)
						||
					(item.isTb_Selected&&(item.flagid==4||item.flagid==5))
						)
					{
						tshdata.Add(item);
					}	
				}
				//ResetDataSource();
				shdata=tshdata;
				SharedInfoList.SetData(tshdata);
				SharedInfoList.UpdateData();
				SharedInfoList.ResetPos();
				tb_SelectAll.selected=false;
			break;
			
			case  Constant.PvPResponseOk.SetOrderOK:
				RequestAndInitSharedData();
			break;
			
			case Constant.PvPResponseOk.AbandonTileOK:
				RefreshSharedPageData();
			break;
			
			case Constant.PvPResponseOk.RankPageAllianOK:
			case Constant.PvPResponseOk.RankPageIndiOK:
				var touRankArray:Array=new Array();
				
				rankTotalPage=Mathf.Ceil(PvPToumamentInfoData.instance().rankData.total*1.0f/PvPToumamentInfoData.instance().rankPageSize);
				if(rankTotalPage==0)
				{
					rankTotalPage=1;
				}
				var startingPos : int = (parseInt(cur_rank_Page.txt)-1)*PvPToumamentInfoData.instance().rankPageSize + 1;
				
				var rankData : PBMsgLeaderboard.PBMsgLeaderboard = PvPToumamentInfoData.instance().rankData;
				var timeNow:long = KBN.GameMain.unixtime();
				var timeStart:long = PvPToumamentInfoData.instance().actionStartTime;
					
				for(i=0;i<rankData.data.Count;i++)
				{
					var tmpRankdata:ToumamentRankData = new ToumamentRankData();
					
					tmpRankdata.status=PvPToumamentInfoData.instance().rankData.status;
					if(tb_AllRank.selected)
					{
						isAllianRank=true;
						isIndiviRank=false;
						tmpRankdata.r_Name = rankData.data[i].allianceName;
						tmpRankdata.r_Integration = rankData.data[i].score;
						tmpRankdata.r_AllianceIdOfPlayer = rankData.data[i].allianceId;
						tmpRankdata.r_position = startingPos + i;
						if(timeNow<timeStart)
						{
							tmpRankdata.m_bonus=GetBonusByRank(i+1+(rankCurPage-1)*PvPToumamentInfoData.instance().rankPageSize,
															PvPToumamentInfoData.instance().m_tournamentFinishInfo,true);	
						}
						else
						{
							tmpRankdata.m_bonus=GetBonusByRank(i+1+(rankCurPage-1)*PvPToumamentInfoData.instance().rankPageSize,
															PvPToumamentInfoData.instance().m_tournamentInfo,true);
						}
					}
					else if(tb_IndividualRank.selected)
					{
						isIndiviRank=true;
						isAllianRank=false;
						tmpRankdata.r_Name=PvPToumamentInfoData.instance().rankData.data[i].displayName;
						tmpRankdata.r_Integration=PvPToumamentInfoData.instance().rankData.data[i].score;
						tmpRankdata.r_AllianceOfPlayer=PvPToumamentInfoData.instance().rankData.data[i].allianceName;
						tmpRankdata.r_position=startingPos + i;
						if(timeNow<timeStart)
						{
							tmpRankdata.m_bonus=GetBonusByRank(i+startingPos,
														PvPToumamentInfoData.instance().m_tournamentFinishInfo,false);	
						}
						else
						{
							tmpRankdata.m_bonus=GetBonusByRank(i+startingPos,
														PvPToumamentInfoData.instance().m_tournamentInfo,false);
						}
					}
					touRankArray.Add(tmpRankdata);
				}
				
				// Check to see if the player is in this page or not
				if( rankData.position != 0 ) {
					var endPos : int = startingPos + rankData.data.Count - 1;
					if( rankData.position < startingPos || rankData.position > endPos ) {
						var extraData : ToumamentRankData = new ToumamentRankData();
						
						extraData.r_position = rankData.position;
						extraData.r_Integration = rankData.score;
						
						if( timeNow < timeStart ) {
							extraData.m_bonus = GetBonusByRank( rankData.position,
														PvPToumamentInfoData.instance().m_tournamentFinishInfo, tb_AllRank.selected );	
						} else {
							extraData.m_bonus = GetBonusByRank( rankData.position,
														PvPToumamentInfoData.instance().m_tournamentInfo, tb_AllRank.selected );
						}
						
						var seed : HashObject = GameMain.singleton.getSeed();
						if( seed != null && seed["player"] != null ) {
							
							var allianceName = "";
							if( seed["allianceDiplomacies"] != null &&
								seed["allianceDiplomacies"]["allianceName"] != null ) {
								allianceName = _Global.ToString(seed["allianceDiplomacies"]["allianceName"]);
							}
						
							if( tb_AllRank.selected ) {
								extraData.r_Name = allianceName;
								extraData.r_AllianceIdOfPlayer = ( seed["player"]["allianceId"] != null ) ? _Global.INT32( seed["player"]["allianceId"].Value ) : 0;
							} else if( tb_IndividualRank.selected ) {
							 	var uid : int = Datas.instance().tvuid();
    							var userName : String = seed["players"]["u"+ uid ]["n"].Value;
    
								extraData.r_Name = userName;
								extraData.r_AllianceOfPlayer = allianceName;
							}
						}
						
						touRankArray.Add( extraData );
					}
				}
				
				
				toumamentRankList.SetData(touRankArray);
				toumamentRankList.UpdateData();
				toumamentRankList.ResetPos();
				break;
			case Constant.PvPResponseOk.ReceiveTournamentBonusForPlayer:
				tb_IndividualRank.selected=true;
				tb_AllRank.selected=false;
				PvPToumamentInfoData.instance().RequestRankInfo(Constant.ReqPvPToumamentId.PlayerLeaderboard,1,PvPToumamentInfoData.instance().rankPageSize);
				cur_rank_Page.txt="1";
				isIndiviRank=true;
				isAllianRank=false;
				break;
			
			case Constant.PvPResponseOk.ReceiveTournamentBonusForAlliance:
				tb_IndividualRank.selected=false;
				tb_AllRank.selected=true;
				PvPToumamentInfoData.instance().RequestRankInfo(Constant.ReqPvPToumamentId.AllianceLeaderboard,1,PvPToumamentInfoData.instance().rankPageSize);
				cur_rank_Page.txt="1";
				isIndiviRank=false;
				isAllianRank=true;
				break;
				
			case Constant.Notice.ALLIANCE_INFO_LOADED:
				var myAlliance:AllianceVO = Alliance.getInstance().myAlliance;
				ToumamentRankItem.myAllianceName = myAlliance?myAlliance.name:"" ;
				break;
	    }
    }
	
	public function RefreshSharedPageData()
	{
		if(tb_All.selected==true)
		{
			PvPToumamentInfoData.instance().RequestSharedInfo(Constant.ReqPvPToumamentId.ShareList,parseInt(cur_Page.txt),PvPToumamentInfoData.instance().sharePageSize);
		}
		else
		{
			PvPToumamentInfoData.instance().RequestSharedInfo(Constant.ReqPvPToumamentId.ShareMyList,parseInt(cur_Page.txt),PvPToumamentInfoData.instance().sharePageSize);
		}
	}
	
	public function RefreshRankedPageData()
	{
		if(tb_AllRank.selected==true)
		{
			PvPToumamentInfoData.instance().RequestRankInfo(Constant.ReqPvPToumamentId.AllianceLeaderboard,parseInt(cur_rank_Page.txt),PvPToumamentInfoData.instance().rankPageSize);
		}
		else
		{
			PvPToumamentInfoData.instance().RequestRankInfo(Constant.ReqPvPToumamentId.PlayerLeaderboard,parseInt(cur_rank_Page.txt),PvPToumamentInfoData.instance().rankPageSize);
		}
	}
	
	private function SelectTypeForToolbarForToumament(index:int)
    {
        PvPToumamentInfoData.instance().indexOfSelectTabForToumament=index;
        PvPToumamentInfoData.instance().RequestToumamentInfo();
    }
    
    private function handleSelectAlliance()
	{
		alliance.SetState(AllianceBossSelectItem.ItemState.SELECTED);
		personal.SetState(AllianceBossSelectItem.ItemState.UN_SELECTED);
		PvPToumamentInfoData.instance().indexOfSelectTabForToumament=0;
        PvPToumamentInfoData.instance().RequestToumamentInfo();
	}
	
	private function handleSelectPersonal()
	{
		personal.SetState(AllianceBossSelectItem.ItemState.SELECTED);
		alliance.SetState(AllianceBossSelectItem.ItemState.UN_SELECTED);
		PvPToumamentInfoData.instance().indexOfSelectTabForToumament=1;
        PvPToumamentInfoData.instance().RequestToumamentInfo();
	}
	
	public  function SelectTab(index:int)
	{
		indexOfSelectTab=index;
        SetisEdit(false);
		SharedInfoList.rect.height=608;
		if(index==0)
		{
			PvPToumamentInfoData.instance().RequestToumamentInfo();
		}
		else if(index==1)
		{
			RequestAndInitSharedData();
		}
		else if(index==2)
		{
			RequestAndInitRankData();
		}
	}
	
	public function RequestAndInitSharedData()
	{
		var startTime:long = PvPToumamentInfoData.instance().actionStartTime;
		var endTime:long = PvPToumamentInfoData.instance().actionEndTime;
		var now:long = KBN.GameMain.unixtime();
		if(now>endTime||now<startTime)//
		{
			btn_Edit.visible=false;
		}
		else
		{
			btn_Edit.visible=true;
		}
		PvPToumamentInfoData.instance().RequestSharedInfo(Constant.ReqPvPToumamentId.ShareList,1,PvPToumamentInfoData.instance().sharePageSize);
		cur_Page.txt="1";
		tb_All.selected=true;
	}
	
	public function RequestAndInitRankData()
	{
		UpdateSeed.instance().update_seed_ajax(true, null);
		PvPToumamentInfoData.instance().RequestRankInfo(Constant.ReqPvPToumamentId.AllianceLeaderboard,1,PvPToumamentInfoData.instance().rankPageSize);
		cur_rank_Page.txt="1";
		rankCurPage = 1;
		tb_AllRank.selected=true;
		isAllianRank=true;
	}
	
	function Update()
	{
		super.Update();
		menuHead.Update();
		toumamentInfoList.Update();
		//toumamentInfoDescList.Update();
		SharedInfoList.Update();
		toumamentRankList.Update();
		UpdateTime();
		if(indexOfSelectTab==1&&(isLeader && GetisEdit()))//Animation
		{
			if(btn_DeleteItem.rect.x-390<=9&&btn_DeleteItem.rect.x-390>=-9)
			{
				btn_DeleteItem.rect.x=390;
			}
			else
			{
				btn_DeleteItem.rect.x-=9;
			}
			
			if(btn_MoveUpItem.rect.x-560<=3&&btn_MoveUpItem.rect.x-390>=-3)
			{
				btn_MoveUpItem.rect.x=560;
			}
			else
			{
				btn_MoveUpItem.rect.x-=3;
			}
			
		}	
	}
	
	function OnPush(param:Object)
	{
		super.OnPush(param);
		menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
//		bgMiddleBodyPic = TextureMgr.instance().BackgroundSpt().GetTile("ui_paper_bottom");
		if( backButtonMotifIsHome ) {
			setBackButtonMotif_Home();
		} else {
			setBackButtonMotif_Back();
		}
		alliance.SetState(AllianceBossSelectItem.ItemState.SELECTED);
		personal.SetState(AllianceBossSelectItem.ItemState.UN_SELECTED);
		rankCurPage = 1;
	}
	
	public	function OnPopOver()
	{
		toumamentInfoList.Clear();
		//toumamentInfoDescList.Clear();
		SharedInfoList.Clear();
		TryDestroy(menuHead);
		toumamentRankList.Clear();
		menuHead = null;
		btn_MoveUpItem.rect.x=640;
		btn_DeleteItem.rect.x=640;
		SetisEdit(false);
	}
	
	public function DrawTitle():void
	{
		menuHead.Draw();
	}
	
	function DrawItem()
	{
		//lineup.Draw();
		//linedown.Draw();
		frameTop.Draw();
		toolbar.Draw();
		
		switch(indexOfSelectTab)
		{
			case 0:
				labelIntroduction.Draw();
				labelIntroductionPic.Draw();
				deadLineTime.Draw();
				toumamentInfoList.Draw();
				//toumamentInfoDescList.Draw();
				labelActivityReward.Draw();
				btn_DetialIntroduction.Draw();
				btn_ViewLoss.Draw();
				pic_ViewLoss.Draw();
				pic_ViewLossUp.Draw();
				toumamentInfoDesc.Draw();
				//toolbarForToumament.Draw();
				alliance.Draw();
				personal.Draw();
				break;
			case 1:
				tb_All.Draw();
				tb_MyLot.Draw();
				btn_FirstPage.Draw();
				btn_LastPage.Draw();
				btn_PrePage.Draw();
				btn_NextPage.Draw();
				cur_Page.Draw();
				SharedInfoList.Draw();
				tb_lb_All.Draw();
				tb_lb_MyLot.Draw();
				if(isLeader && GetisEdit())
				{
					btn_DeleteItem.Draw();
					btn_MoveUpItem.Draw();
					//btn_StickItem.Draw();
					tb_SelectAll.Draw();
					btn_Cancel.Draw();
				}
				else if(isLeader)
				{
					btn_Edit.Draw();
				}
				if(shdata.Count==0)
				{			
					shareInfoEmptyback.Draw();
					shareInfoEmpty.Draw();
				}
				break;
				
			case 2:
				rank_background.Draw();
				tb_AllRank.Draw();
				tb_IndividualRank.Draw();
				toumamentRankList.Draw();
				label_Rank.Draw();
				label_Name.Draw();
				label_Integration.Draw();
				label_Reward.Draw();
				btn_rank_FirstPage.Draw();
				btn_rank_LastPage.Draw();
				btn_rank_PrePage.Draw();
				btn_rank_NextPage.Draw();
				cur_rank_Page.Draw();
				tb_lb_AllRank.Draw();
				tb_lb_IndividualRank.Draw();
				break;
		}
		
	}
	
	public function UpdateTime()
	{
		deadLineTime.txt = KBN.TournamentManager.getInstance().getTournamentTimeNotice();
	}
	
	public function GetBonusByRank(rank:int,info:PBMsgWorldMapEvent.PBMsgWorldMapEvent,isAlliance:boolean)
	{
		if(info==null)
		{
			return;
		}
		var bonus : HashObject = new HashObject();
		var rewardsList:List.<PBMsgWorldMapEvent.PBMsgWorldMapEvent.Reward> = new List.<PBMsgWorldMapEvent.PBMsgWorldMapEvent.Reward>();
		if(isAlliance==true)
		{
			rewardsList=info.rewards;
		}
		else
		{
			rewardsList=info.playerRewards;
		}
		for(var i:int=rewardsList.Count-1;i>=0;i--)
		{
			var tmpmin:int=rewardsList[i].min;
			var tmpmax:int=rewardsList[i].max;
			if(rank>=tmpmin&&rank<=tmpmax)
			{
				var id : int = rewardsList[i].itemId;
				var num : int = rewardsList[i].num;
				var key : String = "" + id;
				if( bonus[key] == null ) {
					bonus[key] = new HashObject();
					bonus[key].Value = "0";
				}
				var curNum : String = "" + ( _Global.INT32( bonus[key] ) + num );
				bonus[key].Value = curNum;
			}
		}
		
		return bonus;
	}
	
	public function RequestTouRankSelfAllianData()
	{
		var myAlliance:AllianceVO;
		if( Alliance.getInstance().hasGetAllianceInfo ){
			myAlliance = Alliance.getInstance().myAlliance;
		}else{
			Alliance.getInstance().reqAllianceInfo();
		}
	}
	
	public function setBackButtonMotif_Home() {
		if( menuHead != null ) {
			menuHead.setBackButtonMotif( MenuHead.BACK_BUTTON_MOTIF_HOME );
		}
	}
	
	public function setBackButtonMotif_Back() {
		if( menuHead != null ) {
			if( menuHead != null ) {
				menuHead.setBackButtonMotif( MenuHead.BACK_BUTTON_MOTIF_ARROW );
			}
		}
	}
	
}