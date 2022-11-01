import System.Collections.Generic;

public class EventInfo extends ComposedUIObj
{
	public var btn_Prize:Button;
	public var btn_Help:Button;
	public var eventName:Label;
	public var eventTime:Label;
	public var timeDescription:Label;
	public var Eventdescription:Label;
	public var coordinate:Label;
	public var bossBeatXYBtn:Button;
	//public var prizeDesc:Label;
	public var icon:Label;
	public var l_Line:Label;
	public var l_ClickTip:Label;
	public var rankList:ScrollList;
	public var rankItem :ListItem;
	public var bgRankList:Label;
	public var bgRankTitle:Label;
	public var titleRank:Label;
	public var titleName:Label;
	public var titleScore:Label;
	public var titleCustm1:Label;
	public var tipsOnLeaderboard:Label;
	public var btnClass:Button;
	
	public var myRank:Label;
	public var myName:Label;
	public var myScore:Label;
	public var myCustm1:Label;
	public var bgMyRankMsg:Label;
	public var bgFlag:Label;
	public var fenge1:Label;
	public var fenge2:Label;
	
	public var scoreTypeBackground:Label;
	public var scoreTypeProgressBar:Label;
	public var scoreTypeCurPos:Label;
	public var scoreOne:Label;
	public var scoreTwo:Label;
	public var scoreThree:Label;
	public var scoreOnePos:Label;
	public var scoreTwoPos:Label;
	public var scoreThreePos:Label;
	public var scoreBack:Label;
	public var scoreOneArrow:Label;
	public var scoreTwoArrow:Label;
	public var scoreThreeArrow:Label;
	
	public var ec_Btn4Page:Input2Page;
	
	protected var nc:NavigatorController;	
	private var m_data:HashObject;
	private var m_detailInfo:HashObject;
	private var m_startTime:long;
	private var m_endTime:long;
	private var m_rewardEndTime:long;
	
	private var isShowViewPrize : boolean;
	private var isSeasonEvent : boolean;
	private var isScoreType : boolean;
    
    private var eventPlayerGroups:EventPlayerGroups;
    private var eventAllReward:EventAllRewardPage;
    
    private var menuHead : MenuHead;
    public function set MenuHead(value : MenuHead) {
        menuHead = value;
    }

//    @System.Serializable
//    private class UIConfig {
//        @SerializeField private var timeDescriptionRect : Rect;
//        @SerializeField private var eventTimeRect : Rect;
//        @SerializeField private var prizeBtnRect : Rect;
//        @SerializeField private var prizeBtnFontSize : FontSize;
//        @SerializeField private var rankAreaRect : Rect;
//        @SerializeField private var titleFields : Vector2[];
//        @SerializeField private var myInfoFields : Vector2[];
//        @SerializeField private var rankRowHeight : int;
//        @SerializeField private var coordinateRect : Rect;
//        
//        public function get TimeDescriptionRect() : Rect {
//            return timeDescriptionRect;
//        }
//        
//        public function get EventTimeRect() : Rect {
//            return eventTimeRect;
//        }
//        
//        public function get PrizeBtnRect() : Rect {
//        	return prizeBtnRect;
//        }
//        
//        public function get PrizeBtnFontSize() : FontSize {
//        	return prizeBtnFontSize;
//        }
//        
//        public function get RankAreaRect() : Rect {
//        	return rankAreaRect;
//        }
//        
//        public function get TitleFields() : Vector2[] {
//            return titleFields;
//        }
//        
//        public function get MyInfoFields() : Vector2[] {
//            return myInfoFields;
//        }
//        
//        public function get RankRowHeight() : int {
//        	return rankRowHeight;
//        }
//        
//        public function get CoordinateRect() : Rect {
//        	return coordinateRect;
//        }
//    }
//    
//    @SerializeField private var uiConfigNormal : UIConfig;
//    @SerializeField private var uiConfigIndividualTournament : UIConfig;
//    @SerializeField private var uiConfigSeasonEvent : UIConfig;
//    private var uiConfig : UIConfig;
    
    // Individual tournament
    @SerializeField private var topRewardGroupBg : Label;
    @SerializeField private var topRewardIcon : Label;
    @SerializeField private var topRewardName : Label;
    @SerializeField private var topRewardCount : Label;
    @SerializeField private var viewAllRewardBtn : Button;
    //@SerializeField private var viewAllRewardBtnNormalRect : Rect;
    //@SerializeField private var viewAllRewardBtnClaimRect : Rect;
    @SerializeField private var userGroupInfoBtn : Button;
    
    private var updateHelper : TimeBasedUpdateHelper;
    
    private function SetScoreTypeVisible(visible : boolean){
		scoreTypeBackground.SetVisible(visible);
		scoreTypeProgressBar.SetVisible(visible);
		scoreTypeCurPos.SetVisible(visible);
		scoreOne.SetVisible(visible);
		scoreTwo.SetVisible(visible);
		scoreThree.SetVisible(visible);
		scoreOnePos.SetVisible(visible);
		scoreTwoPos.SetVisible(visible);
		scoreThreePos.SetVisible(visible);
		//l_Line.SetVisible(visible);
		scoreBack.SetVisible(visible);
		scoreOneArrow.SetVisible(visible);
		scoreTwoArrow.SetVisible(visible);
		scoreThreeArrow.SetVisible(visible);
    }
    
    private function SetTopRewardGroupVisible(visible : boolean) {
        topRewardGroupBg.SetVisible(visible);
        topRewardIcon.SetVisible(visible);
        topRewardName.SetVisible(visible);
        topRewardCount.SetVisible(visible);
        //viewAllRewardBtn.SetVisible(visible);
    }
    
    private function InitTopRewardGroup() {
        topRewardGroupBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2", TextureType.DECORATION);
        topRewardIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
        topRewardIcon.useTile = true;
        //viewAllRewardBtn.changeToBlue();
        viewAllRewardBtn.OnClick = buttonHandler;
        viewAllRewardBtn.clickParam = "VIEW_ALL_REWARD";
        viewAllRewardBtn.txt = Datas.getArString("Tournament.Prizebutton");
    }
    
    private function InitIndividualTournamentPart() {
        InitTopRewardGroup();
        userGroupInfoBtn.OnClick = buttonHandler;
        userGroupInfoBtn.clickParam = "VIEW_GROUPS_INFO";
    }
	
	public function Init(nc:NavigatorController):void
	{
		this.nc = nc;
		
		//var img:Texture2D = TextureMgr.instance().LoadTexture("ui_bg_wood",TextureType.BACKGROUND);
		//bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_bg_wood");
		bgMyRankMsg.setBackground("Event_mytiao", TextureType.DECORATION);
		
		bgFlag.setBackground("icon_map_view_flag_yellow_0", TextureType.ICON_ELSE);
		
		//l_Line.setBackground("between line", TextureType.DECORATION);
		l_ClickTip.txt = Datas.getArString("EventCenter.CheckRewards");
		icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		icon.useTile = true;
		btn_Prize.OnClick = buttonHandler;
		btn_Help.OnClick = buttonHandler;
		btn_Prize.clickParam = "PRIZE";
		btn_Help.clickParam = "HELP";
		rankItem.Init();
        rankList.Init(rankItem);
		ec_Btn4Page.Init();
		ec_Btn4Page.pageChangedHandler = ec_gotoPage;	//TODO;
		btnClass.txt = Datas.getArString("SeasonRank.ClassPageTitle");
		btnClass.OnClick = ShowClassifications;
		
		bossBeatXYBtn.OnClick = locatePos;
        
        InitIndividualTournamentPart();
	}
    
    private function InitUpdateHelper()
    {
        var timePoints : long[] = [m_startTime, m_endTime, m_rewardEndTime];
        var updateMethods : System.Action.<long>[] = [
        	new System.Action.<long>(UpdateBeforeStart), 
        	new System.Action.<long>(UpdateEventOngoing), 
        	new System.Action.<long>(UpdateRewardTime), 
        	new System.Action.<long>(UpdateRewardEnd)
        	];
        var initMethods : System.Action.<long>[] = [null as System.Action.<long>, null as System.Action.<long>,
            null as System.Action.<long>, null as System.Action.<long>];
    
        updateHelper = new TimeBasedUpdateHelper(timePoints, initMethods, updateMethods);
    }
	
	private function UpdateBeforeStart(curTime : long) {
		timeDescription.txt  = Datas.getArString("EventCenter.StartsIn");//"Activity is about to begin ";
		eventTime.txt = _Global.timeFormatShortStr(m_startTime-curTime,true);
		eventTime.SetVisible(true);
		eventTime.rect = new Rect(260,198,208,30);				
		coordinate.SetVisible(false);
		bossBeatXYBtn.SetVisible(false);
		btn_Prize.SetVisible(false);
		bgFlag.SetVisible(false);
	}
	
	private function locatePos(clickParam:Object):void
    {
        MenuMgr.getInstance().PopMenu("");
        
        var x : int = _Global.INT32((clickParam as Hashtable)["x"]);
        var y : int = _Global.INT32((clickParam as Hashtable)["y"]);
        
        Message.getInstance().GoToMapFromReport(x, y);
    }
	
	//活动中 Start Time ~ End Time
	private function UpdateEventOngoing(curTime : long) {
		timeDescription.txt  = Datas.getArString("EventCenter.EndsIn");//"This event ends in ";
		eventTime.txt = _Global.timeFormatShortStr(m_endTime - curTime,true);
		eventTime.rect = new Rect(300,198,208,30);
		eventTime.SetVisible(true);
		btn_Prize.SetVisible(false);
		bgFlag.SetVisible(false);
		if(_Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_CERTAINPRIZE
				|| _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.GROUPED_RANK_CERTAINPRIZE)
		{
			var x:int = GameMain.instance().getBossCoord(_Global.GetString(m_data["eventId"])).x;
			var y:int = GameMain.instance().getBossCoord(_Global.GetString(m_data["eventId"])).y;
			if(x==0 || y==0)
			{
				coordinate.SetVisible(false);
				bossBeatXYBtn.SetVisible(false);
			}
			else
			{
				coordinate.txt = Datas.getArString("Common.Coordinates") + ": ";
				bossBeatXYBtn.txt = " (" + GameMain.instance().getBossCoord(_Global.GetString(m_data["eventId"])).x + ","
					+ GameMain.instance().getBossCoord(_Global.GetString(m_data["eventId"])).y + ")";
		        bossBeatXYBtn.clickParam = {"x":GameMain.instance().getBossCoord(_Global.GetString(m_data["eventId"])).x
		        	, "y":GameMain.instance().getBossCoord(_Global.GetString(m_data["eventId"])).y};				

				coordinate.SetVisible(true);
				bossBeatXYBtn.SetVisible(true);
			}
		}
		else
		{
			coordinate.SetVisible(false);
			bossBeatXYBtn.SetVisible(false);
		}
	}
	
	private function UpdateRewardTime(curTime : long) {
		coordinate.SetVisible(false);
		bossBeatXYBtn.SetVisible(false);
		if(isSeasonEvent)
		{
			UpdateRewardTimeSeasonEvent(curTime);
		}
		else if(_Global.GetString(m_data["prize"]) == Constant.EventCenter.PrizeStatus.NOPRIZE)
		{
			UpdateRewardTimeNoPrize(curTime);
		}
		else if(_Global.GetString(m_data["prize"]) == Constant.EventCenter.PrizeStatus.PRIZE)
		{
			UpdateRewardTimeGotPrize(curTime);
		}
		else if(_Global.GetString(m_data["prize"]) == Constant.EventCenter.PrizeStatus.HAVEGOTPRIZE)
		{
			UpdateRewardTimePrizeClaimed(curTime);
		}
	}
	
	private function UpdateRewardTimeSeasonEvent(curTime : long) {
		eventTime.SetVisible(false);
		btn_Prize.SetVisible(false);
		timeDescription.txt  = Datas.getArString("EventCenter.ProcessingResults");
	}
	
	//活动结束没有奖励可领   End Time ~ Reward End Time
	private function UpdateRewardTimeNoPrize(curTime : long) {
		eventTime.SetVisible(false);
		btn_Prize.SetVisible(false);
		if(_Global.GetString(m_data["status"]) == Constant.EventCenter.PRIZEOPEN)
		{
			timeDescription.txt  = Datas.getArString("EventCenter.NoPrize");
		}
		else
		{
			timeDescription.txt  = Datas.getArString("EventCenter.ProcessingResults");
		}
	}
	
	//活动结束有奖励可领  End Time ~ Reward End Time
	private function UpdateRewardTimeGotPrize(curTime : long) {
		eventTime.txt = _Global.timeFormatShortStr(m_rewardEndTime-curTime,true);
		eventTime.SetVisible(true);
		eventTime.rect = new Rect(400,198,208,30);
		if(_Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_CERTAINPRIZE
				|| _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.GROUPED_RANK_CERTAINPRIZE
				|| _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_RANDOMPRIZE)
		{
			bgFlag.SetVisible(true);
		}
		if(_Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_CERTAINPRIZE
				|| _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.GROUPED_RANK_CERTAINPRIZE
				|| _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.NORANK_CERTAINPRIZE)
		{
			timeDescription.txt  = Datas.getArString("EventCenter.WonPrize");
			btn_Prize.txt = Datas.getArString("EventCenter.ClaimBtn");
			btn_Prize.SetVisible(true);
			
			//viewAllRewardBtn.rect = new Rect(360,244,185,65);
			//btn_Prize.rect = new Rect(120,244,185,65);
			//l_Line.SetVisible(false);		
			HideTopRewardGroupIfNeeded();
		}
		else if(_Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_RANDOMPRIZE 
				|| _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.NORANK_RANDOMPRIZE)
		{
			if(_Global.INT32(m_detailInfo["slotTimes"]) >0 )
			{
				btn_Prize.txt = Datas.getArString("EventCenter.PlaySlot") + "(" + _Global.GetString(m_detailInfo["slotTimes"]) + ")";
				btn_Prize.SetVisible(true);
				HideTopRewardGroupIfNeeded();
				timeDescription.txt  = Datas.getArString("EventCenter.WonSlot");
			}
			else
			{
				EventCenter.getInstance().setEventItemPrizeInfo(_Global.GetString(m_data["eventId"]),Constant.EventCenter.PrizeStatus.HAVEGOTPRIZE);
				btn_Prize.SetVisible(false);
				timeDescription.txt  = Datas.getArString("EventCenter.AlreadyClaimed");
			}
		}
	}
	
	private function HideTopRewardGroupIfNeeded() {
		if (!btn_Prize.isVisible() || !isShowViewPrize) {
			return;
		}
		SetTopRewardGroupVisible(false);
		viewAllRewardBtn.SetVisible(true);
		//viewAllRewardBtn.rect = viewAllRewardBtnClaimRect;
	}

	//活动结束领取完奖励   End Time ~ Reward End Time
	private function UpdateRewardTimePrizeClaimed(curTime : long) {
		timeDescription.txt = Datas.getArString("EventCenter.AlreadyClaimed");
		eventTime.SetVisible(false);
		btn_Prize.SetVisible(false);
	}

	private function UpdateRewardEnd(curTime : long) {
		setAllComponentVisible(false);
	}

	public function Update():void
	{
		rankList.Update();
		//SetTopRewardGroupVisible(isShowViewPrize && !isScoreType);
		//viewAllRewardBtn.rect = viewAllRewardBtnNormalRect;
        updateHelper.Update();
	}

	public function resetNC(nc:NavigatorController):void
	{
		this.nc = nc;
	}

	public function showDetailInfo(data : HashObject, info : HashObject, rankDataList : HashObject[],
            eventPlayerGroups : EventPlayerGroups, eventAllReward : EventAllRewardPage):void
	{
        this.eventPlayerGroups = eventPlayerGroups;
        this.eventAllReward = eventAllReward;
        this.menuHead = menuHead;
    
		m_data = data;
		m_detailInfo = info;
		m_startTime = _Global.INT64(m_data["startTime"]);
		m_endTime = _Global.INT64(m_data["endTime"]);
		m_rewardEndTime = _Global.INT64(m_data["rewardEndTime"]);
		eventName.txt = m_data["name"].Value;
		Eventdescription.txt = m_data["desc1"].Value;
		var iconName : String = m_data["image"].Value;
 		if(iconName == "EventSeasons")
 		{
			icon.useTile = false;
 			var img : Texture2D = TextureMgr.instance().LoadTexture(iconName,TextureType.DECORATION);
			icon.tile = TileSprite.CreateTile (img, iconName);
			icon.mystyle.normal.background = img;
 		}
 		else
 		{
			icon.mystyle.normal.background = null;
			icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
			icon.useTile = true;
 			icon.tile.name = iconName;
 		}
		
        InitUpdateHelper();
        
		icon.SetVisible(true);
		eventName.SetVisible(true);
		Eventdescription.SetVisible(true);
		timeDescription.SetVisible(true);
		//l_Line.SetVisible(true);
		btn_Help.SetVisible(true);
		
		isShowViewPrize = EventCenterUtils.IsShowViewPrize(m_data);
		isSeasonEvent = EventCenterUtils.IsSeasonEvent(m_data);
		isScoreType = EventCenterUtils.isScoreRewardsOpen(m_detailInfo["scoreRewards"]);
		ec_Btn4Page.pageChangedHandler = isSeasonEvent ? ec_seasonGotoPage : ec_gotoPage;
		if(isScoreType)
		{
			SetTopRewardGroupVisible(false);
			SetScoreTypeVisible(true);

			bgRankList.rect = new Rect(24,459,590,403);
			bgRankTitle.rect = new Rect(29.6f,465,582,35);
			titleName.rect = new Rect(156.8f,466.7f,300,30);
			titleScore.rect = new Rect(363,466,300,30);
			titleRank.rect = new Rect(92,466,200,30);
			rankList.rect = new Rect(25,496.2f,590,330);
			rankList.Init(rankItem);
			myName.rect = new Rect(152.8f,822,320,30);
			myScore.rect = new Rect(368,822,300,30);
			fenge1.SetVisible(true);
			fenge2.SetVisible(true);
			viewAllRewardBtn.SetVisible(true);
			
			SetScoreTypeData();
		}
        else if (isShowViewPrize && !isScoreType) {
            SetTopRewardGroupVisible(true);
			SetScoreTypeVisible(false);
			fenge1.SetVisible(true);
			fenge2.SetVisible(true);
			
			bgRankList.rect = new Rect(24,459,590,403);
			bgRankTitle.rect = new Rect(29.6f,465,582,35);
			titleName.rect = new Rect(156.8f,466.7f,300,30);
			titleScore.rect = new Rect(363,466,300,30);
			titleRank.rect = new Rect(92,466,200,30);
			rankList.rect = new Rect(25,496.2f,590,330);
			rankList.Init(rankItem);
			myName.rect = new Rect(152.8f,822,320,30);
			myScore.rect = new Rect(368,822,300,30);
			fenge1.SetVisible(true);
			fenge2.SetVisible(true);
            viewAllRewardBtn.SetVisible(true);
            
            SetTopRewardDisplayInfo();
            if (EventCenterUtils.EventIsGrouped(m_detailInfo)) {
                userGroupInfoBtn.SetVisible(true);
                var userGroupIndex : int = EventCenterUtils.GetUserGroupIndexFromEvent(m_detailInfo);
                userGroupInfoBtn.image = TextureMgr.instance().LoadTexture(String.Format("league_{0}", userGroupIndex), TextureType.DECORATION);
                var userGroupInfo : HashObject = EventCenterUtils.GetGroupInfoAtIndex(EventCenterUtils.GetAllGroupInfoFromEvent(m_detailInfo), userGroupIndex);
                userGroupInfoBtn.txt = EventCenterUtils.GetGroupLongTitleFromGroupInfo(userGroupInfo);
            } else {
                userGroupInfoBtn.SetVisible(false);
            }
            //ApplyUIConfig(uiConfigIndividualTournament);
        } else if (isSeasonEvent) {
            SetTopRewardGroupVisible(false);
            userGroupInfoBtn.SetVisible(false);
            SetScoreTypeVisible(false);
            viewAllRewardBtn.SetVisible(false);
            fenge1.SetVisible(false);
			fenge2.SetVisible(false);
            
        	bgRankList.rect = new Rect(24,260,590,600);
			bgRankTitle.rect = new Rect(29.6f,265,582,35);
			titleRank.rect = new Rect(92,267,200,30);
			titleName.rect = new Rect(92f,267f,300,30);
			titleScore.rect = new Rect(363,267,300,30);
			rankList.rect = new Rect(25,296.2f,590,547);
			rankList.Init(rankItem);
			myName.rect = new Rect(92f,822,320,30);
			myScore.rect = new Rect(368,822,300,30);
			
            //ApplyUIConfig(uiConfigSeasonEvent);
        } else {
        	bgRankList.rect = new Rect(24,260,590,600);
			bgRankTitle.rect = new Rect(29.6f,265,582,35);
			titleRank.rect = new Rect(92,267,200,30);
			titleName.rect = new Rect(92f,267f,300,30);
			titleScore.rect = new Rect(363,267,300,30);
			rankList.rect = new Rect(25,496.2f,590,547);
			rankList.Init(rankItem);
			myName.rect = new Rect(92f,822,320,30);
			myScore.rect = new Rect(368,822,300,30);
        
            SetTopRewardGroupVisible(false);
            userGroupInfoBtn.SetVisible(false);
            SetScoreTypeVisible(false);
            viewAllRewardBtn.SetVisible(false);
            fenge1.SetVisible(false);
			fenge2.SetVisible(false);
            //ApplyUIConfig(uiConfigNormal);
        }

		showRank(rankDataList);
		showPrizeMsg();
		
		btn_Help.SetVisible(true);
	}
	
	private function SetScoreTypeData()
	{
        var scoreProgressBarLengh : float = 522f;
        var scorePosOffset : float = 54.5f;
        var scoreCurPosOffset : float = 43f;
        var scoreLaeblOffset : float = -236f;
        var scoreOrrowOffset : float = 43f;
        		
		var scoreRewardsHo : HashObject = null;		
    	scoreRewardsHo = EventCenterUtils.GetGroupRewardsFromScoreRewards(m_detailInfo["scoreRewards"]);  
    	var scoreRewards : EventCenterGroupRewards = EventCenterGroupRewards.CreateFromHashObject(scoreRewardsHo);
    	
		var firstStageScore : String = _Global.GetString(scoreRewards[0].FromRank);
		var secondStageScore : String = _Global.GetString(scoreRewards[1].FromRank);
		var thirdStageScore : String = _Global.GetString(scoreRewards[2].FromRank);
		
		var oneScoreLengh : float = scoreProgressBarLengh / _Global.FLOAT(thirdStageScore);
		
		scoreOne.rect.x = oneScoreLengh * _Global.FLOAT(firstStageScore) + scoreLaeblOffset;
		scoreOne.txt = _Global.NumSimlify(_Global.INT64(firstStageScore), Constant.MightDigitCountInList, false);
		
		scoreTwo.rect.x = oneScoreLengh * _Global.FLOAT(secondStageScore) + scoreLaeblOffset;
		scoreTwo.txt = _Global.NumSimlify(_Global.INT64(secondStageScore), Constant.MightDigitCountInList, false);;
		scoreThree.txt = _Global.NumSimlify(_Global.INT64(thirdStageScore), Constant.MightDigitCountInList, false);;
		
		scoreOnePos.rect.x = oneScoreLengh * _Global.FLOAT(firstStageScore) + scorePosOffset;
		scoreTwoPos.rect.x = oneScoreLengh * _Global.FLOAT(secondStageScore) + scorePosOffset;
		
		scoreOneArrow.rect.x = oneScoreLengh * _Global.FLOAT(firstStageScore) + scoreOrrowOffset;
		scoreTwoArrow.rect.x = oneScoreLengh * _Global.FLOAT(secondStageScore) + scoreOrrowOffset;
		
		if(m_detailInfo["ranking"]!=null)
		{			
			var scoreWidth : float = _Global.FLOAT(m_detailInfo["ranking"]["myScore"]["score"].Value) * oneScoreLengh;
			if(scoreWidth > scoreProgressBarLengh)
			{
				scoreTypeProgressBar.rect.width = scoreProgressBarLengh;
			}
			else
			{
				scoreTypeProgressBar.rect.width = _Global.FLOAT(m_detailInfo["ranking"]["myScore"]["score"].Value) * oneScoreLengh;
			}
		}
		
		scoreTypeCurPos.rect.x = scoreTypeProgressBar.rect.width + scoreCurPosOffset;
	}
	
//	private function ApplyUIConfig(config : UIConfig) {
//		uiConfig = config;
//		
//		timeDescription.rect = uiConfig.TimeDescriptionRect;
//		eventTime.rect = uiConfig.EventTimeRect;
//		btn_Prize.rect = uiConfig.PrizeBtnRect;
//		btn_Prize.font = uiConfig.PrizeBtnFontSize;
//		
//		var r : Rect = uiConfig.RankAreaRect;
//		
//		l_Line.rect      =  new Rect(r.x - 10,  r.y - 30,           r.width + 20,  20            );
//		bgRankTitle.rect =  new Rect(r.x,       r.y + 16,           r.width,       40            );
//		bgRankList.rect  =  new Rect(r.x,       r.y + 16,           r.width,       r.height + 30 );
//		rankList.rect    =  new Rect(r.x + 5,   r.y + 55,           r.width + 40,  r.height - 40 );
//		bgMyRankMsg.rect =  new Rect(r.x - 9,   r.y + r.height - 5, r.width + 20,  40            );
//		
//		
//		titleRank.rect.y   = r.y + 20;
//		titleName.rect.y   = r.y + 20;
//		titleScore.rect.y  = r.y + 20;
//		titleCustm1.rect.y = r.y + 20;
//		
//		myRank.rect.y   = r.y + r.height;
//		myName.rect.y   = r.y + r.height;
//		myScore.rect.y  = r.y + r.height;
//		myCustm1.rect.y = r.y + r.height;
//		
//		var titles : Vector2[] = uiConfig.TitleFields;
//		var mys : Vector2[] = uiConfig.MyInfoFields;
//		
//		titleCustm1.SetVisible(false);
//		myCustm1.SetVisible(false);
//
//		titleRank.rect.x = titles[0].x;
//		titleRank.rect.width = titles[0].y;
//		
//		titleName.rect.x = titles[1].x;
//		titleName.rect.width = titles[1].y;
//		
//		titleScore.rect.x = titles[2].x;
//		titleScore.rect.width = titles[2].y;
//		
//		if (titles.length > 3) {
//			titleCustm1.SetVisible(true);
//			titleCustm1.rect.x = titles[3].x;
//			titleCustm1.rect.width = titles[3].y;
//		}
//		
//		myRank.rect.x = mys[0].x;
//		myRank.rect.width = mys[0].y;
//		
//		myName.rect.x = mys[1].x;
//		myName.rect.width = mys[1].y;
//		
//		myScore.rect.x = mys[2].x;
//		myScore.rect.width = mys[2].y;
//		
//		if (mys.length > 3) {
//			myCustm1.SetVisible(true);
//			myCustm1.rect.x = mys[3].x;
//			myCustm1.rect.width = mys[3].y;
//		}
//		
//		rankList.rowDist = uiConfig.RankRowHeight;
//		rankItem.rect.height = uiConfig.RankRowHeight;
//		rankList.Init(rankItem);
//		
//		coordinate.rect = uiConfig.CoordinateRect;
//	}

    private function SetTopRewardDisplayInfo() {
    	var topRewardItemId : int = 0;
    
    	if (null != m_data["topReward"])
    	{
    		var topReward:String = m_data["topReward"].Value as String;
			var rewards:String[] = topReward.Replace("[", "").Split("]"[0]);
			var reward:String[] = rewards[0].Split(":"[0]);
			topRewardItemId = _Global.INT32(reward[0]);
	        topRewardIcon.tile.name = TextureMgr.instance().LoadTileNameOfItem(topRewardItemId);
	        topRewardCount.txt = String.Format("X {0}", _Global.INT32(reward[1]));
	        topRewardName.txt = Datas.getArString(String.Format("itemName.i{0}", topRewardItemId));
    	}
    	else if (null != m_data["groupedTournament"])
    	{
	        var tournamentInfo : HashObject = m_data["groupedTournament"];
	        topRewardItemId = _Global.INT32(tournamentInfo["topReward"]);
	        topRewardIcon.tile.name = TextureMgr.instance().LoadTileNameOfItem(topRewardItemId);
	        topRewardCount.txt = String.Format("X {0}", _Global.INT32(tournamentInfo["topRewardQty"]));
	        topRewardName.txt = Datas.getArString(String.Format("itemName.i{0}", topRewardItemId));
        }
    }

	public function buttonHandler(clickParam:Object):void
	{
		switch(clickParam)
		{
			case "PRIZE":
				reqGetPrize();
			    break;
			case "HELP":
				OpenHelpMenu();
                break;
            case "VIEW_ALL_REWARD":
                ViewAllReward();
			    break;
            case "VIEW_GROUPS_INFO":
                ViewGroupsInfo();
                break;
		}
	}
    
    private function ViewAllReward() {
    	var groupRewardsHo : HashObject = null;
    	var scoreRewardsHo : HashObject = null;
    	if (null != m_detailInfo["rewardConfig"])
    	{
    		groupRewardsHo = EventCenterUtils.GetGroupRewardsFromRewardConfig(m_detailInfo["rewardConfig"]);
    	}
    	else
    	{
	        var groupInfoHo : HashObject = EventCenterUtils.GetUserGroupInfoFromEvent(m_detailInfo);
	        groupRewardsHo = EventCenterUtils.GetGroupRewardsFromGroupInfo(groupInfoHo);
        }
        
        if(null != m_detailInfo["scoreRewards"])
        {
    		scoreRewardsHo = EventCenterUtils.GetGroupRewardsFromScoreRewards(m_detailInfo["scoreRewards"]);       	
        }
        eventAllReward.MenuHead = menuHead;
        
        if(isScoreType)
        {
        	eventAllReward.ResetAndShowAll(groupRewardsHo,scoreRewardsHo,EventCenterUtils.RankType.ScoreType);        
        }
        else{
        	eventAllReward.ResetAndShowRanking(groupRewardsHo);        
        }
        nc.push(eventAllReward);
    }
    
    private function ViewGroupsInfo() {
        eventPlayerGroups.MenuHead = menuHead;
        eventPlayerGroups.Show(m_detailInfo);
        nc.push(eventPlayerGroups);
    }
	
	public function setPage(cur:int,total:int)
	{
		ec_Btn4Page.setPages(cur,total);
	}
	
	private function setRankListWithBuiltinArray(cur : int, total : int, listData : HashObject[])
	{
		setRankList(cur, total, listData);
	}
	
	public function setRankList(cur:int,total:int,listData:Array)
	{
		setPage(cur,total);
		if(listData != null)
		{
			rankList.SetData(listData);
			rankList.ResetPos();
		}
	}
	
	public function setAllComponentVisible(bVisible:boolean)
	{
		btn_Prize.SetVisible(bVisible);
		btn_Help.SetVisible(bVisible);
		eventName.SetVisible(bVisible);
		eventTime.SetVisible(bVisible);
		timeDescription.SetVisible(bVisible);
		Eventdescription.SetVisible(bVisible);
		coordinate.SetVisible(bVisible);
		bossBeatXYBtn.SetVisible(bVisible);
		icon.SetVisible(bVisible);
		//l_Line.SetVisible(bVisible);
		setRankComponentVisible(bVisible);
		SetTopRewardGroupVisible(bVisible);
		userGroupInfoBtn.SetVisible(bVisible);
	}
	
	public function showRank(listData:Array)
	{
		if(listData != null)
		{
			rankList.SetData(listData);
			rankList.ResetPos();
		}
		else
			rankList.ClearData();
		if(_Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_CERTAINPRIZE
				|| _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.GROUPED_RANK_CERTAINPRIZE
				|| _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_RANDOMPRIZE
				|| isSeasonEvent)
		{
			if(m_detailInfo["ranking"]!=null)
			{
				myRank.txt = (_Global.INT32(m_detailInfo["ranking"]["myScore"]["rank"].Value) == 0 ? "" : _Global.GetString(m_detailInfo["ranking"]["myScore"]["rank"].Value));
				myName.SetFont();
				myName.txt = _Global.GUIClipToWidth(myName.mystyle, m_detailInfo["ranking"]["myScore"]["name"].Value, 140, "...", null);
				myScore.txt = _Global.NumFinancial((m_detailInfo["ranking"]["myScore"]["score"].Value).ToString());
				titleRank.txt = Datas.getArString("EventCenter.EventRank");
				titleName.txt = Datas.getArString("EventCenter.RankName");
				if (!isSeasonEvent)
				{
					titleScore.txt =  _Global.GetString(m_data["scoreName"]);
				}
				else
				{
					titleScore.txt =  Datas.getArString("SeasonRank.ScoreName");
					titleCustm1.txt = Datas.getArString("SeasonLeaderboard.World");
					myCustm1.txt = _Global.GetString(m_detailInfo["ranking"]["myScore"]["world"]);
				}
				var lastUpdateTime:long = _Global.INT64(m_detailInfo["ranking"]["lastUpdateTime"]);
				tipsOnLeaderboard.txt = Datas.getArString("Leaderboard.tipPre") + " " + _Global.HourTime24WithoutSecond(lastUpdateTime);
				setRankComponentVisible(true);
				
			}
			else
			{
				setRankComponentVisible(false);
			}
			
			
		}
		else
		{
			setRankComponentVisible(false);
		}
	}
	
	public function showPrizeMsg()
	{
		if(_Global.GetString(m_data["prize"]) == Constant.EventCenter.PrizeStatus.NOPRIZE)
		{
			btn_Prize.SetVisible(false);
			//prizeDesc.SetVisible(false);
		}
		else if (_Global.GetString(m_data["prize"]) == Constant.EventCenter.PrizeStatus.PRIZE)
		{
			if(_Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_CERTAINPRIZE
					|| _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.GROUPED_RANK_CERTAINPRIZE
					|| _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.NORANK_CERTAINPRIZE)
			{
				btn_Prize.txt = Datas.getArString("EventCenter.ClaimBtn");
				//prizeDesc.txt = Datas.getArString("EventCenter.WinPrizeNote");
			}
			else if(_Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_RANDOMPRIZE || _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.NORANK_RANDOMPRIZE)
			{
				btn_Prize.txt = Datas.getArString("EventCenter.PlaySlot") + "(" + _Global.GetString(m_detailInfo["slotTimes"]) + ")";
				//prizeDesc.txt = Datas.getArString("EventCenter.WinSlotNote");
			}
			else
			{
				//need check
				//btn_Prize.txt = Datas.getArString("EventCenter.PlaySlot");
				//prizeDesc.txt = Datas.getArString("EventCenter.WinPrizeNote");
			}
			
			btn_Prize.SetVisible(true);
			HideTopRewardGroupIfNeeded();
			//prizeDesc.SetVisible(true);
			
		}
		else if(_Global.GetString(m_data["prize"]) == Constant.EventCenter.PrizeStatus.HAVEGOTPRIZE)
		{
			btn_Prize.SetVisible(false);
			//prizeDesc.SetVisible(false);
		}
	}
	
	private function reqGetPrize()
	{
		if(_Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_CERTAINPRIZE
				|| _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.GROUPED_RANK_CERTAINPRIZE
				|| _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.NORANK_CERTAINPRIZE)
		{
			EventCenter.getInstance().reqGetPrize(_Global.GetString(m_data["eventId"].Value),RealGetPrize);
		}
		//else if(_Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_RANDOMPRIZE || _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.NORANK_RANDOMPRIZE)
		//{
		//	var leftTimes:int = _Global.INT32(m_detailInfo["slotTimes"]);
		//	var eventId:String = _Global.GetString(m_detailInfo["eventId"]);
		//	RandomPrize(eventId,leftTimes);
		//}
	}
	
	//private function RandomPrize(eventId:String,times:int)
	//{
	//	SlotMachineProvider.Instance().SetEventID(eventId);
	//	SlotMachineProvider.Instance().SetTimes(times);
	//	MenuMgr.getInstance().PushMenu("LotteryPopupMenu", null, "trans_pop");
	//}
	
	private function RealGetPrize(prizeData:EventCenterAwardInfo)
	{
		MenuMgr.getInstance().PushMenu("EventAwardMenu", prizeData, "trans_zoomComp");
	}
	
	private function OpenHelpMenu()
	{
		MenuMgr.getInstance().PushMenu("EventRulesMenu", m_data["desc2"].Value, "trans_zoomComp");
	}
	
	private function ec_gotoPage(page:int):void
	{
		EventCenter.getInstance().reqGetPageOfRanking(page,_Global.GetString(m_detailInfo["eventId"].Value),setRankListWithBuiltinArray);
	}
	
	private function ec_seasonGotoPage(page:int):void
	{
		EventCenter.getInstance().reqGetPageOfSeasonRanking(page,_Global.GetString(m_detailInfo["seasonId"].Value),setRankListWithBuiltinArray);
	}
	
	private function ShowClassifications():void
	{
		var okFunc = function(data:HashObject) {
			if (null != data) {
				data["myScore"] = m_detailInfo["ranking"]["myScore"];
				MenuMgr.getInstance().PushMenu("SeasonEventClassification", data, "trans_zoomComp");
			}
		};
		EventCenter.getInstance().reqGetSeasonClassifications(_Global.GetString(m_detailInfo["seasonId"].Value), okFunc);
	}
	
	private function setRankComponentVisible(bVisible:boolean):void
	{
		myRank.SetVisible(bVisible);
		myName.SetVisible(bVisible);
		myScore.SetVisible(bVisible);
		myCustm1.SetVisible(isSeasonEvent && bVisible);
		bgMyRankMsg.SetVisible(bVisible);
		bgFlag.SetVisible(bVisible);
		ec_Btn4Page.setAllComponentVisible(bVisible);
		bgRankList.SetVisible(bVisible);
		bgRankTitle.SetVisible(bVisible);
		titleRank.SetVisible(bVisible);
		titleName.SetVisible(bVisible);
		titleScore.SetVisible(bVisible);
		titleCustm1.SetVisible(isSeasonEvent && bVisible);
		rankList.SetVisible(bVisible);
		tipsOnLeaderboard.SetVisible(!isSeasonEvent && bVisible);
		btnClass.SetVisible(isSeasonEvent && bVisible);
		l_ClickTip.SetVisible(!isSeasonEvent && bVisible);
	}
	
	public	function	Clear()
	{
		rankList.Clear();
	}
}