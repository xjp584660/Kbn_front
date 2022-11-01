
class LeaderboardMenu extends ComposedMenu
{
	public enum ERankType
	{	NormalRank
	,	CitySiegeRank
	}
	public var l_bg:Label;
	public var lblTipsBack:Label;

	public var lblTipColumns:Label;
	public var lblRank:Label;
	public var lblAlcAndName:Label;
	public var lblMight:Label;
	
	public var toolBarTypes:ToolBar;
	public var toolBarDates:ToolBar;
	
	public var btnHelp:Button;
	
	/*search bar*/
	public var input_key	:InputText;
	public var btn_x		:Button;
	public var btn_search	:Button;
	
	@SerializeField
	private var m_selfRank : SimpleLabel;
	@SerializeField
	private var m_selfPoint : SimpleLabel;
	
	public var lbl_noresult:Label;
	
	public var lblTips1:Label;
	public var lblTips2:Label;
	public var lblCutLine1:Label;
	public var lblCutLine2:Label;
	/*leader list*/
	public var leaderList:ScrollList;
	public var itemTemplate:FullClickItem;
		
	/*page*/
	public var inputPager:Input2Page;


	private var dataSource:Array;
	private var keyword:String;
	// Use this for initialization

	private var indexToType : List.<String>;
    private var typeToTitleKey : Dictionary.<String, String>;

	private var priv_getDataSource : function(int) : void;// = ResetDataSource;
	private var m_rankType : ERankType;
	
	private static var CITY_SIEGE_RANK_PAGE : int = 30;

    private function InitIndexToTypeList(rankType : ERankType) : void
    {
        indexToType = new List.<String>();
        switch ( rankType )
        {
        case ERankType.NormalRank:
	        if (GameMain.instance().IsPvpServer)
	        {
	            indexToType.Add(Leaderboard.Type.Killed);
	            return;
	        }

	        indexToType.Add(Leaderboard.Type.Might);
	        indexToType.Add(Leaderboard.Type.Gained);
	        indexToType.Add(Leaderboard.Type.Killed);
	        break;
		case ERankType.CitySiegeRank:
			indexToType.Add(Leaderboard.Type.Attack);
			indexToType.Add(Leaderboard.Type.Defend);
			break;
		}
    }
    
    private function InitTypeToTitleKeyDict() : void
    {
        typeToTitleKey = new Dictionary.<String, String>();
        typeToTitleKey.Add(Leaderboard.Type.Might, "Leaderboard.Might");
        typeToTitleKey.Add(Leaderboard.Type.Gained, "Leaderboard.MightGained");
        typeToTitleKey.Add(Leaderboard.Type.Killed, "Leaderboard.TroopsKilled");
        typeToTitleKey.Add(Leaderboard.Type.Attack, "Common.Attack");
        typeToTitleKey.Add(Leaderboard.Type.Defend, "SelectiveDefense.DefenseTab");
    }

    private function InitTypeToolBar() : void
    {
        var typeToolBarStrings : List.<String> = new List.<String>();
        for (var i : int = 0; i < indexToType.Count; ++i)
        {
            var type : String = indexToType[i];
            var title : String = Datas.getArString(typeToTitleKey[type]);
            typeToolBarStrings.Add(title);
        }
        toolBarTypes.toolbarStrings = typeToolBarStrings.ToArray();
    }
    
	function Init()
	{
		super.Init();
		
		//menuHead.Init();
		toolBarDates.Init();
		toolBarTypes.Init();

		toolBarDates.toolbarStrings = [Datas.getArString("Leaderboard.AllTime"),Datas.getArString("Leaderboard.CurrentWeek"),Datas.getArString("Leaderboard.LastWeek")];
		
		toolBarTypes.indexChangedFunc = toolBarTypes_SelectedIndex_Changed;
		toolBarDates.indexChangedFunc = toolBarDateTypes_SelectedIndex_Changed;
		input_key.hidInput = true;
		input_key.maxChar = 15;
		leaderList.Init(itemTemplate);
		
		//l_bg.setBackground("backFrame", TextureType.DECORATION);
		
		btn_search.OnClick = Search;
		btn_search.txt = Datas.getArString("Common.Search");
		inputPager.Init();
		inputPager.pageChangedHandler = inputPager_Changed;
		btn_x.OnClick = ClearKeyword;
		lbl_noresult.txt = Datas.getArString("Alliance.NO_Alliances");
		lbl_noresult.visible = false;
		keyword = "";
		btnHelp.OnClick = function(param:Object)
		{
			var setting:InGameHelpSetting = new InGameHelpSetting();
			if ( m_rankType == ERankType.NormalRank )
			{
				setting.type = "other";
				setting.key = "rank";
				setting.name = Datas.getArString("Leaderboard.Title");
			}
			else if (m_rankType == ERankType.CitySiegeRank )
			{
				setting.type = "raw";
				setting.key = "BattleRank";
				setting.name = Datas.getArString("CitySiegeRank.Title");
			}
			else
			{
				return;
			}

			MenuMgr.getInstance().PushMenu("InGameHelp", setting, "trans_horiz");
		};
	}

	public function OnPush(param:Object)
	{
		super.OnPush(param);
		var rankType : ERankType = ERankType.NormalRank;
		if ( param == null )
	        rankType = ERankType.NormalRank;
		else
	        rankType = param;

		m_rankType = rankType;
		InitIndexToTypeList(rankType);
	   	InitTypeToTitleKeyDict();
	   	InitTypeToolBar();

		lblRank.txt = Datas.getArString("Rank.CampaignRank_Tex1");
		lblAlcAndName.txt = Datas.getArString("Rank.CampaignRank_Tex2");
		switch ( rankType )
		{
		case ERankType.NormalRank:
			input_key.SetVisible(true);
			btn_x.SetVisible(true);
			btn_search.SetVisible(true);
	
			m_selfRank.SetVisible(false);
			m_selfPoint.SetVisible(false);
			priv_getDataSource = ResetDataSource;
			menuHead.setTitle(Datas.getArString("Leaderboard.Title")) ;
			lblTips1.txt =  Datas.getArString("Leaderboard.tipTrain");
			lblTips2.txt = Datas.getArString("Leaderboard.tipDaily");
			lblMight.txt = Datas.getArString("Rank.CampaignRank_Tex3");
			break;

		case ERankType.CitySiegeRank:
			input_key.SetVisible(false);
			btn_x.SetVisible(false);
			btn_search.SetVisible(false);
	
			m_selfRank.SetVisible(true);
			m_selfPoint.SetVisible(true);
			priv_getDataSource = priv_getCitySiegeRankData;
			menuHead.setTitle(Datas.getArString("CitySiegeRank.Title")) ;
			lblTips1.txt = Datas.getArString("CitySiegeRank.AtkTips");
			lblTips2.txt = "";
			lblMight.txt = Datas.getArString("CitySiegeRank.Point");
			break;
		}

		toolBarTypes.selectedIndex = 0;
		toolBarDates.selectedIndex = 0;

		displaySetting();
		menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		menuHead.btn_back.setNorAndActBG("button_back2_normal","button_back2_down");
		leaderList.ResetPos();
		inputPager_Changed(1);
	} 

	public	function	OnPopOver()
	{
		leaderList.Clear();
		super.OnPopOver();
	}
	
	public function Search()
	{
		if(input_key.txt == null || input_key.txt.Length < 3)
		{
			ErrorMgr.instance().PushError("",Datas.getArString("Leaderboard.inputErr") );
		}
		else
		{
			keyword = input_key.txt;
			InputText.closeActiveInput();
			inputPager_Changed(1);
		}
	}
	
	private function CurType():String
	{
        if (toolBarTypes.selectedIndex >= indexToType.Count || toolBarTypes.selectedIndex < 0)
        {
            return indexToType[0];
        }        
        return indexToType[toolBarTypes.selectedIndex];
	}

	private function CurDateType():String
	{
		switch(toolBarDates.selectedIndex)
		{
			case 0:
				return Leaderboard.DateType.All;
			case 1:
				return Leaderboard.DateType.ThisWeek;
			case 2:
				return Leaderboard.DateType.LastWeek;
			default:
				return Leaderboard.DateType.All;
		}
	}
	public function ClearKeyword()
	{
		if(keyword == null || keyword == "")
		{
			input_key.setKeyboardTxt("");
			input_key.txt = "";
		}
		else
		{
			input_key.setKeyboardTxt("");
			keyword = "";
			input_key.txt = "";
			inputPager_Changed(1);
		}
	}
	
	protected function inputPager_Changed(pageIndex:int)
	{
		priv_getDataSource(pageIndex);
	}
	
	private function priv_getCitySiegeRankData(pageIndex : int) : void
	{
		var msgRequest : PBMsgReqHeroLeaderboard.PBMsgReqHeroLeaderboard = new PBMsgReqHeroLeaderboard.PBMsgReqHeroLeaderboard();
		if ( toolBarTypes.selectedIndex < indexToType.Count )
		{
			//	0 : def, 1 : attack
			if ( indexToType[toolBarTypes.selectedIndex] == Leaderboard.Type.Attack )
				msgRequest.leaderboardType = 1;
			else if ( indexToType[toolBarTypes.selectedIndex] == Leaderboard.Type.Defend )
				msgRequest.leaderboardType = 0;
			else
				msgRequest.leaderboardType = 0;
		}
		msgRequest.page = pageIndex;
		msgRequest.pageSize = CITY_SIEGE_RANK_PAGE;//leaderList.rowPerPage;
		var okFunc : KBN.OKHandler = function(data : byte[]) : void
		{
			var msgLeaderBoard : PBMsgPveLeaderboard.PBMsgPveLeaderboard = 
				_Global.DeserializePBMsgFromBytes.<PBMsgPveLeaderboard.PBMsgPveLeaderboard> (data);
			var total : int = msgLeaderBoard.total;
			var rank : int = msgLeaderBoard.position;
			var point : int = msgLeaderBoard.score;

			if ( indexToType[toolBarTypes.selectedIndex] == Leaderboard.Type.Attack )
				m_selfPoint.txt = String.Format(Datas.getArString("CitySiegeRank.AtkPoint"), point);
			else if ( indexToType[toolBarTypes.selectedIndex] == Leaderboard.Type.Defend )
				m_selfPoint.txt = String.Format(Datas.getArString("CitySiegeRank.DefPoint"), point);
			else
				m_selfPoint.txt = "";

			if ( rank > 0 )
				m_selfRank.txt = String.Format(Datas.getArString("Rank.CampaignRank_MyRank"), rank.ToString());
			else
				m_selfRank.txt = String.Format(Datas.getArString("Rank.CampaignRank_MyRank"), "");
	
			var boardItemList : System.Collections.Generic.List.<MightItem> = new System.Collections.Generic.List.<MightItem>(msgLeaderBoard.data.Count);
			for ( var i : int = 0; i != msgLeaderBoard.data.Count; ++i )
			{
				var nodeItem : PBMsgPveLeaderboard.PBMsgPveLeaderboard.PBMsgPveLeaderboardList =
					msgLeaderBoard.data[i];
				var boardItem : MightItem = new MightItem();
				boardItem.Rank = i + msgRequest.pageSize * (msgRequest.page - 1) + 1;
				boardItem.Name = nodeItem.displayName;
				if ( nodeItem.allianceIdSpecified && nodeItem.allianceId > 0 && nodeItem.allianceNameSpecified )
					boardItem.AllianceName = nodeItem.allianceName;
				boardItem.Might = nodeItem.score;
				boardItem.UserId = nodeItem.userId;
				boardItem.AllianceId = nodeItem.allianceId;
				boardItemList.Add(boardItem);
			}
			var source : Array = boardItemList.ToArray();
			priv_setData(source, total, msgRequest.pageSize, msgRequest.page);
		};
		UnityNet.RequestForGPB ("leaderboardlist.php", msgRequest, okFunc, null); 
	}
	
	private function priv_setData(source:Array,total:int,pagesize:int,pageindex:int)
	{
		leaderList.SetData(source);
		leaderList.ResetPos();
		var pageCount:int = _Global.INT32(total / pagesize) + (total % pagesize > 0?1:0);
		if(pageCount ==0)
		{
			pageindex = 0;
		}
		inputPager.setPages(pageindex,pageCount);
		if(source.length > 0)
		{
			lbl_noresult.visible = false;
		}
		else
		{
			lbl_noresult.visible = true;
		}

		if(CurType() == Leaderboard.Type.Might)
		{
			if(Leaderboard.GetLastUpdate() >0)
			{
				var time:long =  GameMain.unixtime() - Leaderboard.GetLastUpdate();
				lblTips2.txt = Datas.getArString("Leaderboard.tipPre") + " " + _Global.timeFormatStrAbout(time) + " " + Datas.getArString("Leaderboard.ago");
			}
			else
			{
				lblTips2.txt = Datas.getArString("Leaderboard.tipDaily");
			}
		}
	}

	private function ResetDataSource(pageIndex:int)
	{
		var type:String = CurType();
		var dateType:String = CurDateType();
		Leaderboard.ReqLeaderBoard(priv_setData,pageIndex,keyword,type,dateType);
	}
	// Update is called once per frame
	function Update () {
		super.Update();	
		leaderList.Update();
	} 

	function DrawItem() {
		toolBarDates.Draw();
		btnHelp.Draw();
		lblTips1.Draw();
		lblTips2.Draw();

		lblRank.Draw();
		lblAlcAndName.Draw();
		lblMight.Draw();

		input_key.Draw();
		btn_x.Draw();
		btn_search.Draw();
		leaderList.Draw();
		lbl_noresult.Draw();
		inputPager.Draw();

		m_selfRank.Draw();
		m_selfPoint.Draw();
	}	 

	function DrawTitle()
	{
		super.DrawTitle();
	}
	
	function DrawBackground()
	{
		super.DrawBackground();
		
		lblTipColumns.Draw();
		l_bg.Draw();
		lblTipsBack.Draw();
		lblCutLine1.Draw();
		lblCutLine2.Draw();
	}
	
	private function displaySetting() : void
	{
		var selected:int = toolBarTypes.selectedIndex;
		if ( selected < 0 && selected >= indexToType.Count )
		{
			priv_changeSubBarDisplayState(true);
			return;
		}

		switch(indexToType[selected])
		{
		case Leaderboard.Type.Might:
		case Leaderboard.Type.Attack:
		case Leaderboard.Type.Defend:
			priv_changeSubBarDisplayState(false);
			break;
		default:
			priv_changeSubBarDisplayState(true);
			break;
		}
		
		switch ( indexToType[selected] )
		{
		case Leaderboard.Type.Attack:
			lblTips1.txt = Datas.getArString("CitySiegeRank.AtkTips");
			break;
		case Leaderboard.Type.Defend:
			lblTips1.txt = Datas.getArString("CitySiegeRank.DefTips");
			break;
		}
	}
	
	private function priv_changeSubBarDisplayState(isShowSearch : boolean)
	{
		lblTipsBack.visible = !isShowSearch;
		lblTips1.visible = !isShowSearch;
		lblTips2.visible = !isShowSearch;

		toolBarDates.visible = isShowSearch;
	}

	public function toolBarTypes_SelectedIndex_Changed()
	{
		displaySetting();
		input_key.setDone();
		if(InputText.getKeyBoard())
		{
			InputText.getKeyBoard().active = false;
		}
		input_key.txt = keyword;
		inputPager_Changed(1);
	}
	public function toolBarDateTypes_SelectedIndex_Changed()
	{
		input_key.setDone();
		if(InputText.getKeyBoard())
		{
			InputText.getKeyBoard().active = false;
		}	
		input_key.txt = keyword;
		inputPager_Changed(1);
	}
	
	public function OnPop()
	{
	    super.OnPop();
	    leaderList.Clear();
	    if(Leaderboard.shouldPopUp)
	    	GameMain.instance().CheckAndOpenRaterAlert("leaderboard");
	}
}
