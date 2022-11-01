public class AllianceInfo2 extends BaseAllianceTab implements IEventHandler
{
	public var info2_main :Info2_Main_View;
	public var info2_pend :Info2_Pending;
	public var info2_leader:Info2_Leaders;
	public var info2_dipView : Info2_DipView;
	public var info2_dipSet :Info2_DipSet;
	
	//data & other
	
	protected var avo:AllianceVO;
	public function Init()
	{
		super.Init();
		info2_main.Init(buttonHandler);
		
		//Pending Members.
		info2_pend.Init();
		info2_pend.btn_accept.OnClick = buttonHandler;
		info2_pend.btn_accept.clickParam = "PM_ACCEPT";
		info2_pend.btn_refuse.OnClick = buttonHandler;
		info2_pend.btn_refuse.clickParam = "PM_REFUSE";
		info2_pend.nav_head.controller = nc;
		//leader...
		/*
		info2_leader.nav_head.controller = nc;
		info2_leader.scroll_list.itemDelegate = this;
		info2_leader.Init();
		*/
		//dip view
		info2_dipView.Init();
		info2_dipView.nav_head.controller = nc;
		
		//dip set
		info2_dipSet.Init();
//		info2_dipSet.nav_head.controller = nc;
		
		nc.push(info2_main);
		
	}
	
	
	
	public function showAllianceInfo(avo:AllianceVO):void
	{
		this.avo = avo;

		info2_pend.nav_head.controller = nc;

		info2_main.showAllianceInfo(avo);
		
		
	}
	function FixedUpdate()
	{
		nc.u_FixedUpdate();	
	}
	
	public function Update() // per frame.
	{
		nc.u_Update();
	}
	
	protected function updateTitle():void
	{
		switch(nc.topUI)
		{
			case info2_main:				
			case info2_pend:
			case info2_dipView:
				menuHead.setTitle(Datas.getArString("Common.Alliance"));
				break;
			case info2_dipSet:
				// AllianceMenu didn't drawBackground
				var allianceMenu:AllianceMenu = MenuMgr.getInstance().getMenu("AllianceMenu") as AllianceMenu;
				if( allianceMenu ){
					allianceMenu.SetBgDrawAble(false);
					allianceMenu.toolBar.SetVisible(false);
					allianceMenu.frameTop.SetVisible(false);
				}
				
				menuHead.setTitle(Datas.getArString("AllianceInfo.SetDiplomacy") );
				menuHead.leftHandler = menuLeftHandler;
//				AllianceMenu.getInstance().toolBar.SetVisible(false);
//				MenuMgr.getInstance().allianceMenu.toolBar.SetVisible(false);
				break;
		}
	}
	
	protected function menuLeftHandler()
	{
		menuHead.leftHandler = null;
		var allianceMenu:AllianceMenu = MenuMgr.getInstance().getMenu("AllianceMenu") as AllianceMenu;
		if( allianceMenu ){
			allianceMenu.SetBgDrawAble(true);
			allianceMenu.toolBar.SetVisible(true);
			allianceMenu.frameTop.SetVisible(true);
		}
		nc.pop(info2_dipSet);
//		AllianceMenu.getInstance().toolBar.SetVisible(true);
//		MenuMgr.getInstance().allianceMenu.toolBar.SetVisible(true);
	}
	
	private function buttonHandler(clickParam:Object):void
	{
		switch(clickParam)
		{
			case "IB1":
				if(avo.HaveRights(AllianceRights.RightsType.AcceptJoin) )
				{	
					nc.push(this.info2_pend);
					info2_pend.showMemberList();
				}
				break;
			case "IB2":
				//if(avo.isAdmin() )
				if ( avo.HaveRights(AllianceRights.RightsType.SetDiplomacy) )
				{
					nc.push(this.info2_dipSet);
					info2_dipSet.show();
				}
				break;
			case "IB3":
				nc.push(this.info2_dipView);
				info2_dipView.setNController(nc);
				info2_dipView.showDipList();
				break;
			case "IB4":
				MenuMgr.getInstance().PushMenu("AllianceSkillMenu", null, "trans_horiz");
				break;
			case "IB5":
				MenuMgr.getInstance().PushMenu("AvaShopMenu", null, "trans_horiz");
				break;
			case "IB6":
				var curCityWarHallPos : int = Building.instance().getPositionForType(Constant.Building.WAR_HALL);
				var buildInfo : Building.BuildingInfo = Building.instance().buildingInfo(curCityWarHallPos,Constant.Building.WAR_HALL);	
				MenuMgr.getInstance().PushMenu("WarHallBuilding", {"selectIndex":1, "buildInfo":buildInfo}, "trans_horiz");
				break;
			case "IM_LEAVE":
					var cd:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
					
					if( avo.userOfficerType == Constant.Alliance.Chancellor )	//&& avo.membersCount > 1)
					{
						//assign
						cd.setLayout(600,540);
						cd.setTitleY(60);
						cd.setContentRect(70,140,0,260);
						if(avo.membersCount > 1)
						{
							MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("AllianceInfo.ResignDescription"),Datas.getArString("AllianceInfo.LeaveAlliance"),IM_showAssign, null, true);
							cd.setButtonText(Datas.getArString("AllianceInfo.Resign"),Datas.getArString("Common.Cancel"));
						}
						else
						{
							MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("AllianceInfo.YouAreOnlyPersonDescription"),Datas.getArString("AllianceInfo.LeaveAlliance"),IM_leaveAlliance,null, true);
							cd.setButtonText(Datas.getArString("Common.Leave"),Datas.getArString("Common.Cancel"));
						}
					}
					else	//leave..
					{
						cd.setLayout(600,380);
						cd.setTitleY(60);
						cd.setContentRect(70,140,0,100);
								
						MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("Alliance.LeaveAllianceDescription"),Datas.getArString("AllianceInfo.LeaveAlliance"),IM_leaveAlliance,null, true);
						cd.setButtonText( Datas.getArString("Common.Leave"),Datas.getArString("Common.Cancel") );
					}
					
				break;
			case "IM_MESSAGE":
				var data:Hashtable = {};
				data["title"] = Datas.getArString("MembersInfo.MsgEveryone");
				data["toIds"] = avo.allianceId;	//allianceId
				data["type"] = "allianceall";
				data["tileId"] = "";
				data["toname"] = avo.name;
				MenuMgr.getInstance().PushMenu("AllianceMail",data,"trans_zoomComp");
				break;
			//pending..
			case "PM_ACCEPT":
			case "PM_REFUSE":
				var list:Array = 	info2_pend.getSelectedIDs();
				if(list.length == 0)
				{					
					ErrorMgr.instance().PushError("",Datas.getArString("AllianceInfo.SelectAtLeastOne") );
				}
				else
				{
					var type:String = "approve";
					if(clickParam == "PM_REFUSE")
						type = "reject";
					Alliance.getInstance().reqPendingAction(list.ToBuiltin(typeof(int)), type, pending_result);
					nc.pop();
				}
				break;
				
				
		}
	
	}
	
	private function IM_showAssign():void
	{
		MenuMgr.getInstance().PushMenu("AssignLeaderMenu",null, "trans_zoomComp");
	}
	
	private function IM_leaveAlliance():void
	{
		//
		Alliance.getInstance().reqLeaveAlliance(IM_leaveResult);
	}
	
	//private function IM_cancelLeave():void
	//{
		//print("cancel");
	//	MenuMgr.getInstance().PopMenu("");
	//}
	
	private function IM_leaveResult():void
	{
		MenuMgr.getInstance().PopMenu("AllianceMenu");
		MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Alliance_LeaveSucess"));
		
		//----------------------------//
		MenuMgr.getInstance().Chat.clearAllianceChat();
		//----------------------------//
		var seed : HashObject = GameMain.instance().getSeed();
		seed["player"]["allianceId"].Value = 0;
	}
	
	private function pending_result():void
	{
		this.nc.pop(this.info2_pend);
	}
	
	public function handleItemAction(action:String,param:Object):void
	{
		switch(action)
		{
			//leadersItem.
			case Constant.Action.ALLIANCE_LDITEM_NAME:
				MenuMgr.getInstance().PushMenu("AllianceUserProfile",param,"trans_zoomComp");
				break;
			case Constant.Action.ALLIANCE_LDITEM_MAIL:	//param allianceMemberVo
				//AllianceMemberVO
				var data:Hashtable = {};
				data["title"] = "Message Leader";
				data["toIds"] =  (param as AllianceMemberVO).userId;	//allianceId
				data["type"] = "user";
				data["tileId"] = "";
				data["toname"] = (param as AllianceMemberVO).name;
				MenuMgr.getInstance().PushMenu("AllianceMail",data,"trans_zoomComp");
				break;
			case Constant.Action.ALLIANCE_PDITEM_NAME:
				//DISABLED.
				break;
		}
	}
	
	public	function	Clear()
	{
		info2_main.Clear();
		info2_pend.Clear();
		info2_leader.Clear();
		info2_dipView.Clear();
		info2_dipSet.Clear();
	}
	public function OnBackButton():boolean
	{
		if(nc.uiNumbers > 1)
		{
			if(nc.topUI == this.info2_dipSet)
				menuLeftHandler();
			else
				nc.pop();
			return true;
		}
		return false;
	}
	
	public function IsDipSetAsTopUI():boolean
	{
		return (nc.topUI == info2_dipSet);
	}
	
	public function OnBack(preMenuName:String):void
	{
		info2_main.OnBack(preMenuName);
	}
}