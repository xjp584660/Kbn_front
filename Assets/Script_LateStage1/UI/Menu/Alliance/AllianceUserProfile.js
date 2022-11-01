import System.Linq;
public class AllianceUserProfile extends PopMenu
{
	public var l_avatar :SimpleLabel;
	public var l_avatarFrame :SimpleLabel;
	
	public var l_badge  :SimpleLabel;
	
	public var l_badgeDesc :SimpleLabel;
	
	public var l_name	:Label;
	
	public var l_city	:Label;
	
	public var l_might	:Label;
	
	public var l_alliance:Label;
	
	public var l_apos	:Label;
	
	public var l_adip	:Label;
	
	public var l_impeachNotice : Label;
	
	public var allianceEmblem :AllianceEmblem;

	public var l_time	:Label;
	
	public var btn_send	:Button;
	public var btn_position	:Button;
	public var btn_makeMVP	:Button;
	public var btn_remove	:Button;
	
	public var line_texure:Texture2D;
	public var l_line1:Label;
//	public var l_line2:Label;
	public var l_frame:SimpleLabel;

	public var lb_mvp : Label;
	//data
	protected var gvo:GeneralUserInfoVO;
	
	public var lb_cityPos : Button[];
	public var lb_cityName : Label[];

	public var color_choice : UIDisableCtrl;
	
	public var l_sLine1:Label;
//	public var l_sLine2:Label;
//	public var l_sLine3:Label;
//	public var l_sLine4:Label;
//	public var l_sLine5:Label;
//	public var l_sLine6:Label;
	public var minBadgeWidth : int;
	public var isImpeachTime : boolean = true;
	public var btn_info : Button;
	
	public function DrawItem()
	{
		l_frame.Draw();
		l_line1.Draw();		
		l_sLine1.Draw();
		l_avatar.Draw();
		l_avatarFrame.Draw();
		l_badge.Draw();
		l_badgeDesc.Draw();
		l_name.Draw();		
		l_city.Draw();
		l_time.Draw();
		l_might.Draw();
		l_alliance.Draw();
		l_apos.Draw();
		l_adip.Draw();
		l_impeachNotice.Draw();
		allianceEmblem.Draw();
		
		btn_send.Draw();
		btn_position.Draw();
		btn_makeMVP.Draw();
		btn_remove.Draw();
		
		title.Draw();
		btnClose.Draw();
		
		lb_mvp.Draw();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
		if(gvo != null && gvo.impeachTime != 0 && isImpeachTime)
		{
			var timeRemaining : long =  gvo.impeachTime - GameMain.unixtime();	
			if(timeRemaining >= 0)
			{
				l_impeachNotice.txt = Datas.getArString("Alliance.ImpeachDeadlineTime") + " " + _Global.timeTotalFormatStr(timeRemaining,false);			
			}
			else
			{
				isImpeachTime = false;
				l_impeachNotice.SetVisible(false);
				UpdateMembersData();
				//Invoke("UpdateMembersData",60f);	
			}
			//l_impeachNotice.txt = "The Chancellor will be dissmissed after " + _Global.timeTotalFormatStr(timeRemaining,false);
		}
		
		for ( var item : Button in lb_cityPos )
			item.Draw();
		for ( var item : Label in lb_cityName )
			item.Draw();
		btn_info.Draw();
	}
	
	private function UpdateMembersData()
	{
		this.sendNotification(Constant.Notice.ALLIANCE_MEMBER_PROMOTE,null);
	}
	
	public function Init()
	{
		super.Init();

		btn_info.OnClick = buttonHelp;
		btnClose.OnClick = buttonHandler;
		btn_send.OnClick = buttonHandler;
		btn_makeMVP.OnClick = buttonHandler;
		btn_remove.OnClick = buttonHandler;
		btn_send.clickParam = "SEND";
		btn_position.OnClick = priv_setAllianceRights;
		//btn_makeMVP.clickParam = "DEMOTE";
		btn_remove.clickParam = "REMOVE";
		btnClose.clickParam = "CLOSE";	
		//
		title.txt = Datas.getArString("Common.PlayerProfile_Tilte");
		btn_send.txt = Datas.getArString("Common.SendMessage");
		btn_position.txt = Datas.getArString("Alliance.PositionLabel");
		btn_makeMVP.txt = Datas.getArString("Alliance.MakeMvpBtn");
		btn_remove.txt = Datas.getArString("Common.Remove");
		for ( var i : int = 0; i != lb_cityName.length; ++i )
		{
			lb_cityName[i].txt = Datas.getArString("Common.City") + (i+1).ToString();
		}
		var strNA = String.Format("({0})", Datas.getArString("Alliance.CoordNotAppliable"));
		for ( var x : int = 0; x != lb_cityPos.length; ++x )
		{
			var lb : Button = lb_cityPos[x];
			lb.txt = strNA;
			color_choice.FillStyleWithCtrlState(lb.mystyle, false);
		}
		
		var textMgr : TextureMgr = TextureMgr.instance();
		lb_mvp.mystyle.normal.background = textMgr.LoadTexture("mvp", TextureType.ICON);

		l_name.txt = Datas.getArString("Common.Name") + ":";
		l_city.txt = Datas.getArString("Common.Cities") + ":";
		l_might.txt = Datas.getArString("Common.Might") + ":";	// "Might:";
		l_alliance.txt = Datas.getArString("Common.Alliance") + ":";
		l_apos.txt = Datas.getArString("Profile.AlliancePosition");	// no : .. the string contains : 
		l_adip.txt = Datas.getArString("Profile.AllianceDiplomacy");
		l_time.txt = Datas.getArString("MembersInfo.LastOnline") +":";
		l_sLine1.setBackground("between line_list_small",TextureType.DECORATION);
//		l_sLine2.setBackground("between line_list_small",TextureType.DECORATION);
//		l_sLine3.setBackground("between line_list_small",TextureType.DECORATION);
//		l_sLine4.setBackground("between line_list_small",TextureType.DECORATION);
//		l_sLine5.setBackground("between line_list_small",TextureType.DECORATION);
		
		l_frame.setBackground("Quest_kuang", TextureType.DECORATION);
		l_avatar.useTile = true;
		l_avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile("player_avatar_default");
		l_avatarFrame.useTile = false;
		l_badge.SetVisible(false);
		l_badgeDesc.SetVisible(false);
		
		l_avatar.inScreenAspect = !_Global.IsFitLogicScreen();
		l_avatar.lockWidthInAspect = _Global.IsTallerThanLogicScreen();
		l_avatar.lockHeightInAspect = _Global.IsShorterThanLogicScreen();
		l_avatarFrame.inScreenAspect = !_Global.IsFitLogicScreen();
		l_avatarFrame.lockWidthInAspect = _Global.IsTallerThanLogicScreen();
		l_avatarFrame.lockHeightInAspect = _Global.IsShorterThanLogicScreen();
		
		allianceEmblem.SetVisible(false);
	}
	public function OnPush(data:Object):void
	{
		isImpeachTime = true;
		var memberInfo:AllianceMemberVO = data as AllianceMemberVO;
		var alliance : Alliance = Alliance.getInstance();
		alliance.reqGetUserGeneralInfo(memberInfo.userId,info_loaded);	
		//var avo:AllianceVO = alliance.myAlliance;

		var tStr:String = memberInfo.lastLogin;
		tStr = (tStr == null) ? "" : tStr;
		
		l_time.txt = Datas.getArString("MembersInfo.LastOnline") +": " + tStr;
		
		var reOrderDat : System.Collections.Generic.List.<UIObject> = new System.Collections.Generic.List.<UIObject>();
		reOrderDat.Add(l_name);
		reOrderDat.Add(l_time);
		reOrderDat.Add(l_city);
		var startPos : int = 0;
		var stepLen : int = 0;
		if ( !alliance.myAlliance.HaveRights(AllianceRights.RightsType.ViewCoordinates) )
		{
			for ( var item : Button in lb_cityPos )
				item.SetVisible(false);
			for ( var item : Label in lb_cityName )
				item.SetVisible(false);
		}
		else
		{
			for ( var item : Button in lb_cityPos )
				item.SetVisible(true);
			for ( var item : Label in lb_cityName )
				item.SetVisible(true);
			reOrderDat.Add(lb_cityName[0]);
			reOrderDat.Add(lb_cityName[2]);
		}
		reOrderDat.Add(l_might);
		reOrderDat.Add(l_alliance);
		reOrderDat.Add(l_apos);
		reOrderDat.Add(l_adip);
		reOrderDat.Add(l_impeachNotice);

//		startPos = l_line1.rect.y + l_line1.rect.height;
//		stepLen = (l_line2.rect.y - startPos)/reOrderDat.Count;

//		var ctrlIdx : int = 0;
//		for ( var uiObj : UIObject in reOrderDat )
//		{
//			uiObj.rect.y = startPos + stepLen * ctrlIdx;
//			uiObj.rect.height = stepLen;
//			++ctrlIdx;
//		}

//		lb_cityPos[0].rect.y = lb_cityPos[1].rect.y = lb_cityName[1].rect.y = lb_cityName[0].rect.y;
//		lb_cityPos[2].rect.y = lb_cityPos[3].rect.y = lb_cityName[3].rect.y = lb_cityName[2].rect.y;

		btn_send.SetVisible(false);
		btn_position.SetVisible(false);
		btn_makeMVP.SetVisible(false);
		btn_remove.SetVisible(false);
		lb_mvp.SetVisible(false);
	}

	private static function priv_isCanRemove(avo:AllianceVO, gvo : GeneralUserInfoVO) : boolean
	{
		if ( !AllianceRights.IsHaveRights(avo.userOfficerType, AllianceRights.RightsType.TickingMember) )
			return false;
		if ( avo.userOfficerType >= gvo.officerType )
			return false;
		return true;
	}

	protected function setButtonStatus(isself:boolean):void
	{
		var avo:AllianceVO = Alliance.getInstance().myAlliance;
		
		if ( isself )
			btn_send.changeToGreyNew();
		else
			btn_send.changeToBlueNew();

		if ( this.priv_isCanRemove(avo, gvo) )
			btn_remove.changeToBlueNew();
		else
			btn_remove.changeToGreyNew();

		if ( gvo.officerType != 0 )
			btn_position.changeToBlueNew();
		else
			btn_position.changeToGreyNew();

		if ( !AllianceRights.IsHaveRights(avo.userOfficerType, AllianceRights.RightsType.MakeMVP) || gvo.isMVP || gvo.officerType == 0 )
		{
			btn_makeMVP.OnClick = null;
			btn_makeMVP.changeToGreyNew();
		}
		else
		{
			btn_makeMVP.OnClick = priv_setMVP;
			btn_makeMVP.changeToBlueNew();
		}

		btn_send.SetVisible(!isself);
		btn_position.SetVisible(!isself);
		btn_makeMVP.SetVisible(!isself);
		btn_remove.SetVisible(!isself);
		btn_remove.txt = Datas.getArString("Common.Remove");
		lb_mvp.SetVisible(gvo.isMVP);
		l_impeachNotice.SetVisible(false);
		if(gvo.positionType == 1 && !isself)
		{
			if(gvo.impeachTime != 0)
			{
				btn_remove.txt = Datas.getArString("Alliance.Impeachingbutton");	
				l_impeachNotice.SetVisible(true);				
			}
			else
			{
				btn_remove.txt = Datas.getArString("Alliance.Impeachbutton");		
			}
					
			btn_remove.SetVisible(true);			
			if(gvo.isCanBeImpeached)
			{
				btn_remove.changeToBlueNew();
				btn_remove.clickParam = "Impeach";
			}
			else
			{
				btn_remove.changeToGreyNew();
			}
		}
	}

	private function priv_whenChangedPosition(userID : int, newOfficer : int)
	{
		priv_whenChangedPositionOpt(userID, newOfficer, function()
		{
			var menuMgr : MenuMgr = MenuMgr.getInstance();
			menuMgr.PopMenu("AllianceMemberRightsMenu");
		});
	}

	private function priv_whenChangedPositionOpt(userID : int, newOfficer : int, fnNeedClose : Function)
	{
		var menuMgr : MenuMgr = MenuMgr.getInstance();
		var alliance : Alliance = Alliance.getInstance();
		if ( newOfficer == gvo.positionType )
		{
			fnNeedClose();
			return;
		}
		if(	newOfficer == Constant.Alliance.ViceChancellor && !alliance.isAvailablePosForViceChancellor() )
		{
			var confirmDlg : ConfirmDialog = menuMgr.getConfirmDialog();
			if ( confirmDlg != null )
			{
				confirmDlg.SetCancelAble(false);
				confirmDlg.setButtonText(Datas.getArString("Common.Confirm"), Datas.getArString("Common.Cancel"));
			}
			menuMgr.PushConfirmDialog(Datas.getArString("Alliance.PostOccupiedByMembers"), ""
				, null, null
				, true);

			return;
		}

		var changePosition : System.Action = function()
		{
			Alliance.getInstance().reqAllianceSetMembersPosition(userID, newOfficer, function(newType)
			{
				mote_result1(newType);
				gvo.positionType = newOfficer;
				fnNeedClose();
			});
		};

		var strNotice : String = null;
		var confirmDialogHeigh : int = 320;
		var confirmDialogStartY : int = 90;
		if ( newOfficer == Constant.Alliance.Chancellor )
		{
			strNotice = Datas.getArString("Alliance.PromotRegentWarning");
			confirmDialogHeigh = 320;
			confirmDialogStartY = 90;
		}
		else if ( newOfficer != Constant.Alliance.ViceChancellor && newOfficer != Constant.Alliance.Member && newOfficer != Constant.Alliance.Officer
			&& alliance.FindMemberCountByOfficer(newOfficer) != 0 )
		{	//	need request for check.
			var oldMember : String = "";
			for ( var mem : AllianceMemberVO in alliance.Members )
			{
				if ( mem.positionType == newOfficer )
				{
					oldMember = mem.name;
					break;
				}
			}
			strNotice = String.Format(Datas.getArString("Alliance.PostOccupiedByAMember"), oldMember, gvo.name);
			confirmDialogHeigh = 500;
			confirmDialogStartY = 140;
		}

		if ( strNotice == null )
		{
			changePosition();
			return;
		}

		var choiceDlg : ConfirmDialog = menuMgr.getConfirmDialog();
		if ( choiceDlg != null )
		{
			choiceDlg.setLayout(600,confirmDialogHeigh);
			choiceDlg.setTitleY(60);
			choiceDlg.setContentRect(70,confirmDialogStartY,0,260);
			choiceDlg.setButtonText(Datas.getArString("Common.Confirm"), Datas.getArString("Common.Cancel"));
		}
		menuMgr.PushConfirmDialog(strNotice, "", changePosition, null, true);
	}

	private function priv_setAllianceRights() : void
	{
		MenuMgr.getInstance().PushMenu("AllianceMemberRightsMenu", null, "trans_zoomComp");
		MenuMgr.getInstance().getMenuAndCall("AllianceMemberRightsMenu", function(menu : KBNMenu) {
			var memberRightsMenu : AllianceMemberRightsMenu = menu as AllianceMemberRightsMenu;
			if ( memberRightsMenu == null )
			{
				return;
			}

			var isReadOnly : boolean = priv_getIsReadOnly(Alliance.getInstance().myAlliance, gvo);
			memberRightsMenu.SetData(gvo.userId, gvo.officerType, isReadOnly, priv_whenChangedPosition);
		});
	}
	
	private static function priv_showPos(strPos : Object)
	{
		var pos : int[] = strPos as int[];
		var x : int = pos[0];
		var y : int = pos[1];
		var gameMain : GameMain = GameMain.instance();
		gameMain.gotoMap(x,y);
		//gameMain.loadLevel(4);
		//gameMain.searchWorldMap(x,y);
		MenuMgr.getInstance().SwitchMenu("MainChrom", null, "trans_pop");
	}
	
	private function priv_setMVP() : void
	{
		Alliance.getInstance().reqAllianceSetMVP(gvo.userId, function(newType)
		{
			MenuMgr.getInstance().sendNotification(Constant.Notice.ALLIANCE_INFO_LOADED,null);
			var msg : String = String.Format(Datas.getArString("Alliance.ToasterMvpIsMade"), l_name.txt);
			MenuMgr.getInstance().PushMessage(msg);
			gvo.isMVP = true;
			lb_mvp.SetVisible(true);
			btn_makeMVP.changeToGreyNew();
		});
	}

	private function priv_getIsReadOnly(theSelf : AllianceVO, theOther : GeneralUserInfoVO) : boolean
	{
		//	read only : positoon is less other, or is self, or haven't change positoon rights.
		if ( Datas.instance().tvuid() == theOther.userId )
			return true;
		if ( theSelf.userOfficerType >= theOther.officerType )
			return true;
		if ( !AllianceRights.Rights[theSelf.userOfficerType].haveRights[AllianceRights.RightsType.ChangePosition] )
			return true;
		return false;
	}
	
	private function buttonHelp(clickParam:Object):void
	{
		MenuMgr.getInstance().PushMenu("CarmotHelpMenu", "Impeach", "trans_zoomComp");
	}

	protected function buttonHandler(clickParam:Object):void
	{
		switch(clickParam)
		{
			case "CLOSE":
				this.close();
				break;
			case "SEND":
				//POPUP SEND BOX.
				
				var data:Hashtable = {};
				data["title"] = Datas.getArString("Alliance.MessageCouncil");
				data["toIds"] =  gvo.userId;	
				data["type"] = "user";
				data["tileId"] = "";
				data["toname"] = gvo.name;
				MenuMgr.getInstance().PushMenu("AllianceMail",data,"trans_zoomComp");
				
				break;
			case "REMOVE":
				Alliance.getInstance().reqAllianceRemoveMember(gvo.userId,gvo.oldOfficerType,gvo.officerType,removeM_result);
				break;
			case "Impeach":
				var okFunc:Function = function(result:HashObject)
				{
					btn_remove.changeToGreyNew();
					btn_remove.txt = Datas.getArString("Alliance.Impeachingbutton");
					gvo.impeachTime = _Global.INT64(result["impeachTime"]);	
					l_impeachNotice.SetVisible(true);
				};
				UnityNet.AddImpeachChancellor(okFunc,null);			
				break;
		}
	}

	public function OnPop()
	{
		Alliance.singleton.clickMemberName = "";
		this.sendNotification(Constant.Notice.ALLIANCE_MEMBER_PROMOTE,null);
	}
	protected function  mote_result1(newType:int):void
	{
		var oldOfficerType : int = gvo.officerType;
		gvo.changeOfficeType(newType);
		var myAlliance :AllianceVO = Alliance.getInstance().myAlliance;
		
		switch(newType)
		{
			case Constant.Alliance.Chancellor:
					myAlliance.setUserOfficerType(Constant.Alliance.Member);	
					//ViceChancellor --> Chancellor
					Alliance.getInstance().removeLeaderByType(Constant.Alliance.Chancellor);
					//Alliance.getInstance().removeLeaderByType(Constant.Alliance.ViceChancellor);
					Alliance.getInstance().removeLeaderById(gvo.userId);
					
					Alliance.getInstance().addLeaderbyId(gvo.userId,newType);			
				break;
			case Constant.Alliance.ViceChancellor:
					Alliance.getInstance().addLeaderbyId(gvo.userId,newType);			
				break;
		}	
		
		MenuMgr.getInstance().sendNotification(Constant.Notice.ALLIANCE_INFO_LOADED,null);
		
		info_loaded(gvo);
		if ( oldOfficerType > newType )
			MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Alliance_PromoteSuccess"));
		else
			MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Alliance_DemoteSuccess"));
	}
	protected function removeM_result():void
	{
//		MenuMgr.getInstance().PopMenu("");
		this.close();
		MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Alliance_Kicksuccess"));

	}
	
	
	protected function info_loaded(gvo:GeneralUserInfoVO):void
	{
		//show data ..
		this.gvo = gvo;
		
		l_name.txt = /*Datas.getArString("Common.Name") + ": " + */ gvo.name;
		
		l_avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(gvo.avatar));
		if(gvo.avatarFrame != "img0")
		{
			this.l_avatarFrame.useTile = true;
			this.l_avatarFrame.tile = TextureMgr.instance().ElseIconSpt().GetTile(gvo.avatarFrame);
		}
		else
		{
			this.l_avatarFrame.useTile = false;
		}
		if (!String.IsNullOrEmpty(gvo.badge)) {
			l_badge.useTile = true;
			l_badge.tile = TextureMgr.instance().ElseIconSpt().GetTile(gvo.badge);
			l_badgeDesc.txt = Datas.getArString("Badge." + gvo.badge);
			l_badgeDesc.SetFont();
			var badgeSize : Vector2 = l_badgeDesc.mystyle.CalcSize(new GUIContent(l_badgeDesc.txt));
			if (badgeSize.x < minBadgeWidth)
				badgeSize.x = minBadgeWidth;
			l_badgeDesc.rect = new Rect(l_frame.rect.xMax - badgeSize.x - 6, l_badgeDesc.rect.y, badgeSize.x, badgeSize.y);
			l_badge.rect.x = l_badgeDesc.rect.x + (l_badgeDesc.rect.width - l_badge.rect.width) / 2;
			l_badge.SetVisible(true);
			l_badgeDesc.SetVisible(true);
			l_name.txt = _Global.GUIClipToWidth(l_name.mystyle, l_name.txt, (l_badgeDesc.rect.x - l_name.rect.x), "...", null);
		} else {
			l_badge.SetVisible(false);
			l_badgeDesc.SetVisible(false);
		}
		
		l_city.txt = Datas.getArString("Common.Cities") + ": " + gvo.cities;
		l_might.txt = Datas.getArString("Common.Might") + ": " + _Global.NumFormat(gvo.might);
		l_alliance.txt = Datas.getArString("Common.Alliance") + ": " + gvo.allianceName;
		if ( gvo.officerType != 0 )
			l_apos.txt = Datas.getArString("Profile.AlliancePosition") + " " + gvo.positionStr;
		else
			l_apos.txt = Datas.getArString("Profile.AlliancePosition");
		l_adip.txt = Datas.getArString("Profile.AllianceDiplomacy") +" " + Datas.getArString("Alliance.relationFriendly") ;
		
		allianceEmblem.Data = gvo.allianceEmblem;
		ShowAllianceEmblem(null != gvo.allianceEmblem);
		
		var strNA = String.Format("({0})", Datas.getArString("Alliance.CoordNotAppliable"));
		for ( var i : int = 0; i != lb_cityPos.length; ++i )
		{
			var lb : Button = lb_cityPos[i];
			if ( gvo.coords == null || i >= gvo.coords.length || gvo.coords[i].x < 0 || gvo.coords[i].y < 0)
			{
				lb.txt = strNA;
				color_choice.FillStyleWithCtrlState(lb.mystyle, false);
				lb.OnClick = null;
			}
			else
			{
				var x : int = gvo.coords[i].x;
				var y : int = gvo.coords[i].y;
				lb.txt = String.Format("({0},{1})", x.ToString(), y.ToString());
				color_choice.FillStyleWithCtrlState(lb.mystyle, true);
				lb.clickParam = (new Array(x, y)).ToBuiltin(int) as int[];
				lb.OnClick = priv_showPos;
			}
		}
		
		var avo:AllianceVO = Alliance.getInstance().myAlliance;
		this.setButtonStatus(gvo.userId == Datas.instance().tvuid());
		
		var lastLoginTime:long = _Global.INT64(gvo.lastLogin);
		var offlineTime:long = GameMain.unixtime() - lastLoginTime;
		if(lastLoginTime>0 && offlineTime>0)
		{
			var lastOnlineTimeSpan : System.TimeSpan  = __getLastOnlineTime(offlineTime);
			l_time.txt = Datas.getArString("MembersInfo.LastOnline") +": " + __getLastOnlineTimeString(lastOnlineTimeSpan);
		}
	}
	
	private function ShowAllianceEmblem(visible:boolean)
	{
		allianceEmblem.SetVisible(visible);
		if (visible) {
			l_alliance.rect.x = 150;
			l_apos.rect.x = 150;
			l_adip.rect.x = 150;
			l_frame.rect.height = 360;
		} else {
			l_alliance.rect.x = 70;
			l_apos.rect.x = 70;
			l_adip.rect.x = 70;
			l_frame.rect.height = 350;
		}
	}
	
	private function __getLastOnlineTime(lastLoginTimeTS : long) : System.TimeSpan
	{
		if ( lastLoginTimeTS >= 0 )
		{
			var spanTime : System.TimeSpan = System.TimeSpan.FromSeconds(lastLoginTimeTS);
			return spanTime;
		}
		
		return System.TimeSpan.FromDays(9999);
	}

	private function __getLastOnlineTimeString(lastOnlineTimeSpan : System.TimeSpan):String
	{
		if ( lastOnlineTimeSpan.TotalHours <= 24 )
			return Datas.getArString("Alliance.MemberToday");

		if ( lastOnlineTimeSpan.TotalHours <= 48 )
			return Datas.getArString("Alliance.MemberYesterday");

		var days : int = lastOnlineTimeSpan.TotalDays;
		return System.String.Format(Datas.getArString("Alliance.MemberXDaysAgo"), days.ToString());
	}
}
