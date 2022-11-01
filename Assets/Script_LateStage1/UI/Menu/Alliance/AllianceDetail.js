public class AllianceDetail extends ComposedUIObj
{
	public var ald_l_name	:Label;
	public var ld_name		:Label;
		
	public var ald_l_leader:Label;
	public var ld_leader	:Label;
	
	public var ald_l_members:Label;
	public var ld_members	:Label;
	
	public var ald_l_ranking:Label;
	public var ld_ranking	:Label;
	
	public var ald_l_might	:Label;
	public var ld_might		:Label;
	
	public var ald_l_desc	:Label;
	public var ld_desc		:Label;

	public var language_icon:Label;
	public var l_language:Label;
	public var id_language:Label;
	public var language_icon_l:Label;

	public var ld_joinLimit	:Label;
	public var ald_l_joinLimitMight: Label;
	public var ald_l_joinLimitLevel: Label;
	
	public var l_bg:Label;
	public var l_line1:Label;
	public var l_line2:Label;
	public var l_line3:Label;
	public var l_line4:Label;
	public var l_line5:Label;
	public var l_line6:Label;
	public var l_line7:Label;
	public var l_line8:Label;
	public var l_line9:Label;
	public var l_nameIcon:Label;
	public var l_leaderIcon:Label;
	public var l_memberIcon:Label;
	public var l_rankingIcon:Label;
	public var l_mightIcon:Label;
	public var l_levelIcon:Label;
	public var l_level:Label;
	public var ld_level:Label;
	public var l_leagueIcon:Label;
	public var l_league:Label;
	public var ld_leagueName:Label;
	public var l_leagueImg:Label;
	public var scrollView:ScrollView;
	
	function Init()
	{
//		l_bg1.Init();
		//	no need the addition colon
		this.ld_joinLimit.txt = Datas.getArString("Alliance.InfoJoinReqs");
		this.ald_l_name.txt = Datas.getArString("Common.Name") + ":";
		this.ald_l_leader.txt = Datas.getArString("allianceTitle.title1") + ":";
		this.ald_l_members.txt = Datas.getArString("Alliance.Members") + ":";
		this.ald_l_ranking.txt = Datas.getArString("Common.Ranking") + ":";
		this.ald_l_might.txt  = Datas.getArString("Common.Might") + ":"; 
		this.ald_l_desc.txt = Datas.getArString("Common.Description") + ":";
		l_league.txt = Datas.getArString("Alliance.InviteLeague");
		l_level.txt = Datas.getArString("Alliance.InviteLevel");
		
		
		l_bg.setBackground("square_blackorg",TextureType.DECORATION);
		l_line1.setBackground("between line_list_small",TextureType.DECORATION);
		l_line2.setBackground("between line_list_small",TextureType.DECORATION);
		l_line3.setBackground("between line_list_small",TextureType.DECORATION);
		l_line4.setBackground("between line_list_small",TextureType.DECORATION);
		l_line5.setBackground("between line_list_small",TextureType.DECORATION);
		l_line6.setBackground("between line_list_small",TextureType.DECORATION);
		l_line7.setBackground("between line_list_small",TextureType.DECORATION);
		l_line8.setBackground("between line_list_small",TextureType.DECORATION);
		l_line9.setBackground("between line_list_small",TextureType.DECORATION);
		l_nameIcon.setBackground("icon_A_name",TextureType.ICON);
		l_leaderIcon.setBackground("icon_A_Chancellor",TextureType.ICON);
		l_memberIcon.setBackground("icon_A_Members",TextureType.ICON);
		l_rankingIcon.setBackground("icon_A_Ranking",TextureType.ICON);
		l_mightIcon.setBackground("icon_A_Might",TextureType.ICON);
		l_levelIcon.setBackground("icon_A_Level",TextureType.ICON);
		
		scrollView.Init();
	}
	
	public function Draw()
	{
		super.Draw();
		scrollView.Draw();
	}
	
	public function Update()
	{
		super.Update();
		scrollView.Update();
	}
	
	public function setRectHeight(hgt:int):void
	{
		this.rect.height = hgt;
		ld_desc.rect.height = hgt - ld_desc.rect.y - 65;			
	}
	
	public function setAllianceInfo(avo:AllianceVO):void
	{

		var gds:KBN.DataTable.AllianceLanguage=GameMain.GdsManager.GetGds.<KBN.GDS_Alliancelanguage>().GetItemById(avo.languageId);
		l_language.txt=Datas.getArString("Alliance.Language");
		language_icon.mystyle.normal.background=TextureMgr.instance().LoadTexture(gds.flagicon,TextureType.ALLIANCELANGUAGE);
		id_language.txt=Datas.getArString(gds.LanguageName);

		this.ld_name.txt = avo.name;
			
		this.ld_leader.txt =  avo.leaderName;
		
		this.ld_members.txt =  "" + avo.membersCount;
		
		this.ld_ranking.txt = "" + avo.ranking + Datas.getArString("Alliance.Rank_"+KBN.Alliance.singleton.RankType);
		
		this.ld_might.txt = _Global.NumFormat(avo.might);
		
		//avo.description = "Augustus Owsley Stanley (May 21, 1867 – August 12, 1958) was an American politician from the U.S. state of Kentucky. A Democrat, he served as the 38th Governor of Kentucky. From 1903 to 1915, Stanley represented Kentucky's 2nd congressional district in the U.S. House of Representatives, where he gained aAugustus Owsley Stanley (May 21, 1867 – August 12, 1958) was an American politician from the U.S. state of Kentucky. A Democrat, he served as the 38th Governor of Kentucky. From 1903 to 1915, Stanley represented Kentucky's 2nd congressional district in the U.S. House of Representatives, where he gained a  ";
		ld_desc.maxChar = avo.description.Length;
		ld_desc.txt = avo.description;
		
		ld_desc.SetFont(); // This will change the font size in the next draw call somehow, which will
								// lead to the inconsistence to the description height calculated here. So
								// we call it in advance to fix the issue.
		var _height:int = ld_desc.mystyle.CalcHeight(GUIContent(ld_desc.txt), ld_desc.rect.width);
		ld_desc.rect.height = _height; 
		scrollView.addUIObject(ld_desc);
		scrollView.AutoLayout();
		
		this.ld_leagueName.txt = Datas.getArString("LeagueName.League_"+avo.league);
		this.l_leagueIcon.setBackground("league_icon",TextureType.DECORATION);
		this.l_leagueImg.setBackground(SeasonLeagueMgr.instance().GetLeagueIconName(avo.league),TextureType.DECORATION);
		this.ld_level.txt = avo.level.ToString();
		
		if(KBNPlayer.Instance().getMight() < avo.minMightCanJoin)
		{
			this.ald_l_joinLimitMight.mystyle.normal.textColor = _Global.RGB(255,48,48);
		}
		else
		{
			this.ald_l_joinLimitMight.mystyle.normal.textColor = _Global.RGB(96,59,13);
		}
		if(KBNPlayer.Instance().getTitle() < avo.minLevelCanJoin)
		{
			this.ald_l_joinLimitLevel.mystyle.normal.textColor = _Global.RGB(255,48,48);
		}
		else
		{
			this.ald_l_joinLimitLevel.mystyle.normal.textColor = _Global.RGB(96,59,13);
		}

		// SET SCROLL RECT HEIGHT.
		var curLevel : int = GameMain.instance().getPlayerLevel();
		var curMight : long = GameMain.instance().getPlayerMight();

		var strRequired : String = Datas.getArString("Alliance.InfoRequired");
		ald_l_joinLimitLevel.txt = System.String.Format("{0} {1} {2}", Datas.getArString("Common.Level"), strRequired, avo.minLevelCanJoin.ToString());
		ald_l_joinLimitMight.txt = System.String.Format("{0} {1} {2}", Datas.getArString("Common.Might"), strRequired, _Global.NumFormat(avo.minMightCanJoin));

		if(curLevel < avo.minLevelCanJoin)
		{
			ald_l_joinLimitLevel.mystyle.normal.textColor = _Global.RGB(243,20,62);
		}
		else
		{
			ald_l_joinLimitLevel.mystyle.normal.textColor = _Global.RGB(207,169,114);
		}
		if(curMight < avo.minMightCanJoin)
		{
			ald_l_joinLimitMight.mystyle.normal.textColor = _Global.RGB(243,20,62);
		}
		else
		{
			ald_l_joinLimitMight.mystyle.normal.textColor = _Global.RGB(207,169,114);
		}
	}
}
