public class Info2_Main extends ComposedUIObj
{
//	public var scroll_view : ScrollView;
	public var detailCon : ComposedUIObj;
	
	public var l_bg1		:Label;
//	public var l_bg2		:Label;
	
	public var emblem		:AllianceEmblemButton;
	
	public var sv_l_name 	:Label;
	public var ld_name	:Label;
	public var l_nameIcon:Label;
	
	public var sv_l_leader :Label;
	public var ld_leader	:Label;
	public var l_leaderIcon:Label;
	
	public var sv_l_members	:Label;
	public var ld_members	:Label;
	public var l_membersIcon:Label;
	
	public var sv_l_ranking	:Label;
	public var ld_ranking	:Label;
	public var l_rankingIcon:Label;
	
	public var l_leagueIcon:Label;
	public var l_leagueTitle:Label;
	public var l_leagueName:Label;
	public var l_leagueImg:Label;
	
	public var sv_l_might	:Label;
	public var ld_might		:Label;
	public var l_mightIcon:Label;

	public var sv_l_joinCondition:Label;
	public var btn_joinCondition :Button;
	
	public var sv_l_des		:Label;
	public var btn_des		:Button;
	
	//
	public var apProgressBar:ProgressBarWithBg;
	public var allianceIcon	:AllianceIcon;
	public var btn_MoreAp	:Button;
	public var btn_Dummy	:Button;
	public var btn_Donate	:Button;
	public var sv_l_Light	:Label;
	//
	
	public var sv_box :VBox;
	
	public var sv_b_ib1	:Info_Button;
	public var sv_b_ib2	:Info_Button;
	public var sv_b_ib3	:Info_Button;
	
	public var sv_b_ib4	:Info_Button;
	public var sv_b_ib5	:Info_Button;
	public var sv_b_ib6	:Info_Button;
	
	public var btn_message 	:Button;
	public var btn_leave	:Button;

	public var btn_position :Button;

	public var texture_line	:Texture2D;
	public var texture_bottom:Texture2D;
	
	public var ins_InfoButton :Info_Button;

	public var language_icon:Label;
	public var l_language:Label;
	public var id_language:Button;
	public var language_icon_l:Label;

	private var vo:AllianceVO;
	
	public function DrawBackGround()
	{
		this.drawTexture(texture_line,13,365,620,4);
		this.drawTexture(texture_bottom,0,707);		
	}
	
	public function Init()
	{
		super.Init();
		
		sv_b_ib1 = Instantiate(ins_InfoButton);
		sv_b_ib3 = Instantiate(ins_InfoButton);
		sv_b_ib2 = Instantiate(ins_InfoButton);
		sv_b_ib4 = Instantiate(ins_InfoButton);
		sv_b_ib5 = Instantiate(ins_InfoButton);
		sv_b_ib6 = Instantiate(ins_InfoButton);

		sv_b_ib1.Init();
		sv_b_ib2.Init();
		sv_b_ib3.Init();
		sv_b_ib4.Init();
		sv_b_ib5.Init();
		sv_b_ib6.Init();

		l_nameIcon.setBackground("icon_A_name",TextureType.ICON);
		l_leaderIcon.setBackground("icon_A_Chancellor",TextureType.ICON);
		l_membersIcon.setBackground("icon_A_Members",TextureType.ICON);
		l_mightIcon.setBackground("icon_A_Might",TextureType.ICON);
		l_rankingIcon.setBackground("icon_A_Ranking",TextureType.ICON);
//		l_bg2.setBackground("frame_metal_square", TextureType.DECORATION);
		
		btn_message.txt = Datas.getArString("MembersInfo.MsgEveryone");
		btn_leave.txt = Datas.getArString("AllianceInfo.LeaveAlliance");

		sv_b_ib2.setStrings(Datas.getArString("AllianceInfo.SetDiplomacy_Content"),Datas.getArString("AllianceInfo.SetDiplomacy") );
		sv_b_ib3.setStrings(Datas.getArString("AllianceInfo.ViewDiplomacy_Content"),Datas.getArString("AllianceInfo.ViewDiplomacy") );

		sv_box.reLayout();
		
		apProgressBar.Init();
		apProgressBar.thumb.setBackground("payment_Progressbar_Orange",TextureType.DECORATION);	
		apProgressBar.SetBg("progress_bar_bottom",TextureType.DECORATION);
		
		allianceIcon.Init();
		
		btn_MoreAp.OnClick = handleMoreApClick;
		btn_MoreAp.txt = Datas.getArString("Alliance.info_moreapbtn");
		
		btn_Dummy.OnClick = handleDummyClick;
		btn_Dummy.txt = Datas.getArString("Alliance.info_dummybtn");
		
		btn_Donate.OnClick = handleDonateClick;
		btn_Donate.txt = Datas.getArString("Alliance.info_donatebtn");
		
		sv_l_Light.setBackground("RoundTower_icon2",TextureType.DECORATION);
		UpdateLightIcon();
		
		sv_b_ib1.ShowNewIcon(false);
		sv_b_ib2.ShowNewIcon(false);
		sv_b_ib3.ShowNewIcon(false);
		UpdateNewIcon();
		
		GameMain.Ava.Alliance.OnCapChanged += OnCapChanged;
		GameMain.Ava.Alliance.OnLevelChanged += OnLevelChanged;

		language_icon.Init();
		l_language.Init();
		id_language.Init();
		language_icon_l.Init();
		id_language.OnClick=Setlanguage;

	}

	private function Setlanguage()
	{
		if (vo!=null) {
			MenuMgr.getInstance().PushMenu("AllianceLanguageMenu",vo.isChairman()?1:2,"trans_zoomComp");
		}
		
	}
	
	private function priv_setPositionInfo(avo:AllianceVO)
	{
		vo=avo;
		var minWidth : float = 0.0f;
		var maxWidth : float = 0.0f;

		var gds:KBN.DataTable.AllianceLanguage=GameMain.GdsManager.GetGds.<KBN.GDS_Alliancelanguage>().GetItemById(avo.languageId);
		l_language.txt=Datas.getArString("Alliance.Language");
		language_icon.mystyle.normal.background=TextureMgr.instance().LoadTexture(gds.flagicon,TextureType.ALLIANCELANGUAGE);
		id_language.txt=Datas.getArString(gds.LanguageName);

		this.btn_position.rect = this.ld_members.rect;
		this.btn_position.txt = avo.role;
		
		var yourPosition : String = Datas.getArString("Alliance.YourPosition");

		var frontString = System.String.Format("{0} ({1} ", avo.membersCount.ToString(), yourPosition);
		this.ld_members.mystyle.CalcMinMaxWidth(GUIContent(frontString), minWidth, maxWidth);
		this.btn_position.rect.x = Mathf.Ceil(this.btn_position.rect.x + maxWidth);

		var positionLength : float = 0.0f;
		this.btn_position.mystyle.CalcMinMaxWidth(GUIContent(this.btn_position.txt), minWidth, positionLength);
		this.btn_position.rect.width = positionLength;

		//	use ' ' to fill this space.
		var spaceChar : char = 0x00a0;
		var space : String = spaceChar.ToString();
		var spaceWidth : float = 0.0f;
		this.ld_members.mystyle.CalcMinMaxWidth(GUIContent(space), minWidth, spaceWidth);

		var spaceCount : int = Mathf.Ceil(positionLength/(spaceWidth==0?positionLength:spaceWidth));
		var strNullSpace : System.Text.StringBuilder = new System.Text.StringBuilder(spaceCount);
		for ( var i : int = 0; i != spaceCount; ++i )
			strNullSpace.Append(space);

		this.ld_members.txt =  System.String.Format("{0} ({1} {2})", avo.membersCount.ToString(), yourPosition, strNullSpace.ToString());
		
		this.l_leagueIcon.setBackground("league_icon",TextureType.DECORATION);
		this.l_leagueTitle.txt = Datas.getArString("PVP.TileLeagueTitle");
		this.l_leagueName.txt = Datas.getArString("LeagueName.League_"+avo.league);
		this.l_leagueImg.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(avo.league),TextureType.DECORATION);
		l_leagueImg.rect.x = l_leagueName.rect.x + l_leagueName.GetWidth() + 10;
		
		UpdateAllianceLevelInfo();
	}

	public function showAllianceInfo(avo:AllianceVO):void
	{
		vo=avo;
		var gds:KBN.DataTable.AllianceLanguage=GameMain.GdsManager.GetGds.<KBN.GDS_Alliancelanguage>().GetItemById(avo.languageId);
		l_language.txt=Datas.getArString("Alliance.Language");
		language_icon.mystyle.normal.background=TextureMgr.instance().LoadTexture(gds.flagicon,TextureType.ALLIANCELANGUAGE);
		id_language.txt=Datas.getArString(gds.LanguageName);
		
		this.emblem.Data = AllianceEmblemMgr.instance.playerAllianceEmblem;
	
		this.sv_l_name.txt =  Datas.getArString("Common.Name") + ":";
		this.ld_name.txt = avo.name;

		this.sv_l_leader.txt = Datas.getArString("allianceTitle.title1") + ":";
		this.ld_leader.txt =  avo.leaderName;

		this.sv_l_members.txt = Datas.getArString("Alliance.Members") + ":";

		this.priv_setPositionInfo(avo);

		this.sv_l_ranking.txt =  Datas.getArString("Common.Ranking") + ":";
		this.ld_ranking.txt = "" + avo.ranking;
		
		this.sv_l_might.txt  = Datas.getArString("Common.Might") + ":";
		this.ld_might.txt = _Global.NumFormat(avo.might);

		//	it is already had the colon in this text.
//		this.sv_l_joinCondition.txt = Datas.getArString("Alliance.InfoJoinReqs");
//		this.sv_l_des.txt = Datas.getArString("Alliance.Description_1") + ":";
		this.sv_l_joinCondition.txt = "";
		this.sv_l_des.txt = "";
//		if ( AllianceRights.Rights[avo.userOfficerType].haveRights[AllianceRights.RightsType.ChangeJoinCondition] )
//		{
//			this.btn_joinCondition.txt = Datas.getArString("Alliance.ChangeAllianceDescription");
//		}
//		else
//		{
//			this.btn_joinCondition.txt = Datas.getArString("Alliance.ViewAllianceDescription");
//		}
		this.btn_joinCondition.txt = Datas.getArString("Alliance.InfoJoinReqs");
		
//		if ( AllianceRights.Rights[avo.userOfficerType].haveRights[AllianceRights.RightsType.ChangeDescription] )
//		{
//			this.btn_des.txt = Datas.getArString("Alliance.ChangeAllianceDescription");
//		}
//		else
//		{
//			this.btn_des.txt = Datas.getArString("Alliance.ViewAllianceDescription");
//		}
		this.btn_des.txt = Datas.getArString("Alliance.Description_1");
		
		this.btn_des.OnClick = function(){
			MenuMgr.getInstance().PushMenu("AllianceDesPopup", avo, "trans_zoomComp");
		};
		this.btn_joinCondition.OnClick = function(){
			MenuMgr.getInstance().PushMenu("AllianceConditionPopup", avo, "trans_zoomComp");
		};
		this.btn_position.OnClick = function()
		{
			MenuMgr.getInstance().PushMenu("AllianceMemberRightsMenu", null, "trans_zoomComp");
			MenuMgr.getInstance().getMenuAndCall("AllianceMemberRightsMenu", function(menu : KBNMenu) {
				var memberRightsMenu : AllianceMemberRightsMenu = menu as AllianceMemberRightsMenu;
				if ( memberRightsMenu != null )
					memberRightsMenu.SetData(-1, avo.userOfficerType, true, null);
			});
		};
		sv_box.clearUIObject(false, false);
		//todo rally
//		var curCityId:int = GameMain.instance().getCurCityId();
//		if(Building.instance().hasBuildingbyType(curCityId, Constant.Building.WAR_HALL))
//		{
//			sv_box.addUIObject(sv_b_ib6);
//			sv_b_ib6.setStrings(Datas.getArString("WarHall.AllianceBattle"),Datas.getArString("WarHall.ViewRallyAttack"));
//		}
		sv_box.addUIObject(sv_b_ib4);
		sv_box.addUIObject(sv_b_ib5);
		if ( AllianceRights.IsHaveRights(avo.userOfficerType, AllianceRights.RightsType.AcceptJoin) )
			sv_box.addUIObject(sv_b_ib1);

		if ( AllianceRights.IsHaveRights(avo.userOfficerType, AllianceRights.RightsType.SetDiplomacy) )
			sv_box.addUIObject(sv_b_ib2);		
			
		sv_box.addUIObject(sv_b_ib3);
		sv_box.reLayout();
		
		//sv_b_ib1.SetDisabled(!avo.isAdmin());
		//sv_b_ib2.SetDisabled(!avo.isAdmin());
		
		//
		var n:int = 0;
		if(Alliance.getInstance().pendingApprovals)
			n = Alliance.getInstance().pendingApprovals.length;
		sv_b_ib1.setStrings(Datas.getArString("Alliance.Pending_Member_Content",[n]),Datas.getArString("Alliance.ShowPending") );
		
		sv_b_ib4.setStrings(Datas.getArString("Alliance.info_viewalliancesbuffs"),Datas.getArString("Alliance.info_buffupgraderule") );
		sv_b_ib5.setStrings(Datas.getArString("Alliance.info_viewalliancesshop"),Datas.getArString("Alliance.info_itemsbuyingrule") );
		
	}
	
	public	function	Clear()
	{
		TryDestroy(sv_b_ib1);
		TryDestroy(sv_b_ib2);
		TryDestroy(sv_b_ib3);
		TryDestroy(sv_b_ib4);
		TryDestroy(sv_b_ib5);
		TryDestroy(sv_b_ib6);
		sv_box.clearUIObject();
		
		GameMain.Ava.Alliance.OnCapChanged -= OnCapChanged;
		GameMain.Ava.Alliance.OnLevelChanged -= OnLevelChanged;
	}
	
	private function handleMoreApClick()
	{
		MenuMgr.getInstance().PushMenu("MyAPMenu", null, "trans_zoomComp");
	}
	
	private function handleDummyClick()
	{
		MenuMgr.getInstance().PushMenu("ItemDonateMenu", null, "trans_zoomComp");
	}
	
	private function handleDonateClick()
	{
		MenuMgr.getInstance().PushMenu("DonateResMenu", null, "trans_zoomComp");
	}
	
	public function Update()
	{
		UpdateLightIcon();
		UpdateNewIcon();
	}
	
	private function UpdateLightIcon()
	{
		if(GameMain.Ava.Player.UnclaimedPoint>0)
			sv_l_Light.SetVisible(true);
		else
			sv_l_Light.SetVisible(false);
	}
	
	private function UpdateNewIcon()
	{
		if(PlayerPrefs.GetInt (Constant.PLAYER_PREFS.ALLIANCE_BUFF_MENU_OPEN+Datas.instance().tvuid()+Datas.instance().worldid(), 0) == 0)
			sv_b_ib4.ShowNewIcon(true);
		else
			sv_b_ib4.ShowNewIcon(false);
		if(PlayerPrefs.GetInt (Constant.PLAYER_PREFS.ALLIANCE_SHOP_MENU_OPEN+Datas.instance().tvuid()+Datas.instance().worldid(), 0) == 0)
			sv_b_ib5.ShowNewIcon(true);
		else
			sv_b_ib5.ShowNewIcon(false);
	}
	
	public function OnBack(preMenuName:String):void
	{
		UpdateAllianceLevelInfo();
	}
	
	private function OnCapChanged(oldCap:long, newCap:long):void
	{
		UpdateCap();
	}
	
	private function OnLevelChanged(oldLevel:long, newLevel:long):void
	{
		UpdateLevel();
	}
	
	private function UpdateAllianceLevelInfo():void
	{
		UpdateCap();
		UpdateLevel();
	}
	
	private function UpdateCap():void
	{
		if(HasAlliance())
		{
			apProgressBar.SetValue(GameMain.Ava.Alliance.CumulatePoint, GameMain.Ava.Alliance.UpgradeCumulatePoint());
			if(GameMain.Ava.Alliance.CumulatePoint >= GameMain.Ava.Alliance.UpgradeCumulatePoint())
				apProgressBar.SetTxt(Datas.getArString("Alliance.info_maxlevel"));
		}
	}
	
	private function UpdateLevel():void
	{
		if(HasAlliance())
		{
			allianceIcon.txt = GameMain.Ava.Alliance.Level+"";
		}
	}
	
	private function HasAlliance():boolean
	{
		var avo :AllianceVO = Alliance.getInstance().myAlliance;
		if ( avo != null && avo.allianceId != 0 )
			return true;
		return false;
	}
}
