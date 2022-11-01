class LeaderBoardFrontMenu extends KBNMenu
{
	@SerializeField private var topImage :SimpleLabel;
	@SerializeField private var topDesc :SimpleLabel;

	@SerializeField private var topLine :SimpleLabel;
	
	@SerializeField private var menuHead:MenuHead;
	@SerializeField private var clone_menuHead : MenuHead;
	
	@SerializeField private var rankList:ScrollList;
	@SerializeField private var rankItem:ListItem;
	
	private var arrayData:System.Collections.ArrayList;
	
	public function Init()
	{
		super.Init();
		rankItem.Init();
		rankList.Init(rankItem);
		
		if ( clone_menuHead != null )
			menuHead = Instantiate(clone_menuHead);
		if ( menuHead != null )
		{
			menuHead.Init();
			menuHead.setTitle( Datas.getArString("Campaign.CampaignTitle") ) ;//"CAMPAIGN"
			menuHead.btn_back.setNorAndActBG("button_home_normal","button_home_down");
		}
		menuHead.btn_back.OnClick = handleClick;
				
		if(topImage.mystyle.normal.background == null)
		{
			topImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("level_up_bg",TextureType.DECORATION);
		}
		
		if(topLine.mystyle.normal.background == null)
		{
			topLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("frame_metal_top",TextureType.DECORATION);
		}
		
		topDesc.txt = Datas.getArString("Rank.Tip");
		InitData();
		rankList.SetData(arrayData.ToArray());
		rankList.UpdateData();
		rankList.ResetPos();
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		
		if ( clone_menuHead != null && menuHead != null )
		{
			TryDestroy(menuHead);
			menuHead = null;
		}
		
		rankList.Clear();
	}
	
	function Update () 
	{
		super.Update();	
		
		if( menuHead ){
			menuHead.Update();
		}
		rankList.Update();
	} 
	function DrawBackground()
	{
		menuHead.Draw();
		DrawMiddleBg();
	}
	function DrawItem() 
	{
		topLine.Draw();
		
		topImage.Draw();
		topDesc.Draw();
		
		rankList.Draw();
	}
	public function OnPop()
	{
	    super.OnPop();
	}
	
	function OnPush(param:Object)
	{
		super.OnPush(param);
		menuHead.rect.height = Constant.UIRect.MENUHEAD_H1;
		menuHead.backTile.rect.height = 135;
		menuHead.setTitle( Datas.getArString("Rank.Title") ) ;
	}
	
	function handleClick()
	{
		MenuMgr.getInstance().PopMenu("LeaderBoardFrontMenu");
	}
	
	private function InitData()
	{
		var hashMight:HashObject = new HashObject({"icon":"trophy", "iconType":"ElseIconSpt", "desc":Datas.getArString("Rank.MightRank_Text"), "function":LeaderBoardItem.Function_Type.Function_Type_OnMightClick});
		var hashLeague:HashObject = new HashObject({"icon":"league_entrance", "iconType":"ElseIconSpt", "desc":Datas.getArString("AVA.LeagueLeaderboard_Title"), "function":LeaderBoardItem.Function_Type.Function_Type_OnLeagueClick});
		var hashDef:HashObject = new HashObject({"icon":"rank_icon_citysiege", "iconType":"ElseIconSpt", "desc":Datas.getArString("Rank.CitySiegeRank_Text"), "function":LeaderBoardItem.Function_Type.Function_Type_OnDefenseClick});
		var hashPve:HashObject = new HashObject({"icon":"button_icon_campaign", "iconType":"BUTTON", "desc":Datas.getArString("Rank.CampaignRank_Text"), "function":LeaderBoardItem.Function_Type.Function_Type_OnPveClick});
		var hashLeaderobard:HashObject = new HashObject({"icon":"Rank_AVA", "iconType":"ElseIconSpt", "desc":Datas.getArString("AVA.leaderboard_title"), "function":LeaderBoardItem.Function_Type.Function_Type_OnAvaEventClick});
		//var hashNone:HashObject = new HashObject({"icon":"", "desc":"", "iconType":"ElseIconSpt", "function":LeaderBoardItem.Function_Type.Function_Type_None});
		
		arrayData = new System.Collections.ArrayList();
		arrayData.Add(hashMight);
		arrayData.Add(hashLeague);
		arrayData.Add(hashDef);
		arrayData.Add(hashPve);
		arrayData.Add(hashLeaderobard);
		//arrayData.Add(hashNone);
	}
}