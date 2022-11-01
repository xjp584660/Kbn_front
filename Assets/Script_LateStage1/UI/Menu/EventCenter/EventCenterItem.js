public class EventCenterItem extends FullClickItem
{
	@SerializeField private var eventName:Label;
	@SerializeField private var eventNameBack:Label;
	@SerializeField private var eventTime:Label;
	@SerializeField private var timeDescription:Label;
	@SerializeField private var Eventdescription:Label;
	@SerializeField private var l_bg:Label;
	@SerializeField private var l_bg_Cup:Label;
	@SerializeField private var lTimeicon:Label;
	@SerializeField private var lNew:Label;
	@SerializeField private var prizeIcon:Label;
	@SerializeField private var redPoint:Label;
    @SerializeField private var topRewardIcon:Label[];
    //@SerializeField private var topRewardFrame:Label;
    //@SerializeField private var topRewardDefaultBg:Label;
    
    @SerializeField private var l_highlight:SimpleLabel;
    @SerializeField private var l_highlight_offset:RectOffset;
    
    @SerializeField private var l_goldFrame:SimpleLabel;
    @SerializeField private var l_goldFrame_offset:RectOffset;
    
    @SerializeField private var groupYOffset:float = 5;
    
	private var m_data:HashObject;
	private var m_startTime:long;
	private var m_endTime:long;
	private var m_rewardEndTime:long;
	private var PRIZESPT:TileSprite;
    
    private var updateHelper : TimeBasedUpdateHelper;
	
	function Init()
	{	
		super.Init();	
		//m_data = new EventCent.EventItemData();
		
		lNew.setBackground("Event_New", TextureType.DECORATION);
		//l_bg.setBackground("Event_tiao", TextureType.DECORATION);
		
		//l_highlight.setBackground("fte_light", TextureType.FTE);
		//l_highlight.SetVisible(false);
		//l_highlight.rect = rect;
		//l_highlight.rect.x = 0;
		//l_highlight.rect.y = 0;
        
        //l_goldFrame.setBackground("chestFrame", TextureType.DECORATION);
        //l_goldFrame.SetVisible(false);
        //l_goldFrame.rect = rect;
        //l_goldFrame.rect.x = 0;
        //l_goldFrame.rect.y = 0;
		
		icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		icon.useTile = true;
		prizeIcon.setBackground("Beginners-offer_gamble", TextureType.ICON_ELSE);
		PRIZESPT = TextureMgr.instance().ElseIconSpt();
		
        InitTopRewardGroup();
        
		btnSelect.OnClick = ViewDetail;
		setAllComponentVisible(false);
		btnDefault.mystyle.active.background = null;
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
    
    private function InitTopRewardGroup() {
    
    	for(var i : int = 0; i < topRewardIcon.Length; ++i)
    	{
    		topRewardIcon[i].tile = TextureMgr.instance().ItemSpt().GetTile(null);
        	topRewardIcon[i].useTile = true;
    	}
        
        //topRewardDefaultBg.tile = TextureMgr.instance().BackgroundSpt().GetTile("icon_default_bg");
        //topRewardDefaultBg.useTile = true;
        //topRewardFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("chestFrame", TextureType.DECORATION);
    }
    
    private function get ShouldShowTopReward() : boolean {
        if (m_data == null) {
            return false;
        }
        return EventCenterUtils.IsShowViewPrize(m_data);
    }
    
    private function SetTopRewardGroupVisible(visibility : boolean) {
        if (!ShouldShowTopReward) {
            visibility = false;
        }
        
        for(var i : int = 0; i < topRewardIcon.Length; ++i)
    	{
    		 topRewardIcon[i].SetVisible(visibility);
    	}
        //topRewardDefaultBg.SetVisible(visibility);
        //topRewardIcon.SetVisible(visibility);
        //topRewardFrame.SetVisible(visibility);
    }
    
    private function DrawTopRewardGroup() {
        for(var i : int = 0; i < topRewardIcon.Length; ++i)
    	{
    		 topRewardIcon[i].Draw();
    	}
        //topRewardDefaultBg.Draw();
        //topRewardIcon.Draw();
        //topRewardFrame.Draw();
    }
	
	public function DrawItem()
	{
		super.DrawItem();	
//		if (l_highlight.isVisible()) {
//			l_highlight.rect = l_highlight_offset.Add(rect);
//			l_highlight.Draw();
//		}
		
		//GUI.BeginGroup(new Rect(rect.x, rect.y + groupYOffset, rect.width, rect.height));
		l_bg.Draw();
		btnSelect.Draw();
		eventNameBack.Draw();
		eventName.Draw();
		eventTime.Draw();
		timeDescription.Draw(); 
 		icon.Draw();
 		title.Draw();
 		lTimeicon.Draw();
 		l_bg_Cup.Draw();
 		lNew.Draw();
 		prizeIcon.Draw();
 		redPoint.Draw();
        DrawTopRewardGroup();
		//GUI.EndGroup();
        
        if (l_goldFrame.isVisible()) {
            l_goldFrame.rect = l_goldFrame_offset.Add(rect);
            l_goldFrame.Draw();
        }
	}
	
    private function UpdateBeforeStart(curTime : long) : void
    {
        eventName.SetVisible(true);
        l_bg.SetVisible(true);
        icon.SetVisible(true);
        lTimeicon.SetVisible(true);
        l_bg_Cup.SetVisible(false);
        lNew.SetVisible(true);
        if(_Global.GetString(m_data["viewDetail"]) == Constant.EventCenter.CANVIEWDETAIL)
        {
            btnSelect.SetVisible(true);
        }
        else
        {
            btnSelect.SetVisible(false);
        }
        
        prizeIcon.SetVisible(false);
        timeDescription.txt  = Datas.getArString("EventCenter.StartsIn");//"Activity is about to begin ";
        timeDescription.rect = new Rect(170,45,345,60);
        eventTime.txt = _Global.timeFormatShortStr(m_startTime-curTime,true);
        eventTime.SetVisible(true);
        timeDescription.SetVisible(true);
        SetTopRewardGroupVisible(false);
        UpdateSeasonEventElements(true);
    }
    
    private function UpdateSeasonEventElements(visible : boolean) : void
    {
        visible = visible && EventCenterUtils.IsSeasonEvent(m_data);
        //l_highlight.SetVisible(visible);
        //l_goldFrame.SetVisible(visible);
    }
    
    private function UpdateEventOngoing(curTime : long) : void
    {
        eventName.SetVisible(true);
        l_bg.SetVisible(true);
        icon.SetVisible(true);
        lTimeicon.SetVisible(true);
        l_bg_Cup.SetVisible(false);
        lNew.SetVisible(false);
        prizeIcon.SetVisible(false);
        btnSelect.SetVisible(true);
        timeDescription.txt  = Datas.getArString("EventCenter.EndsIn");//"This event ends in ";
          timeDescription.rect = new Rect(170,45,345,60);
        eventTime.txt = _Global.timeFormatShortStr(m_endTime-curTime,true);
        eventTime.SetVisible(true);
        timeDescription.SetVisible(true);
        SetTopRewardGroupVisible(true);
        UpdateSeasonEventElements(true);
        
        if (_Global.INT32(m_data["eventType"]) == Constant.EventCenter.GameEventType.SpendNGet)
        {
            SetTopRewardGroupVisible(false);
            prizeIcon.SetVisible(_Global.GetString(m_data["prize"]) == Constant.EventCenter.PrizeStatus.PRIZE);
        }
    }
    
    private function UpdateRewardTime(curTime : long) : void
    {
        eventName.SetVisible(true);
        l_bg.SetVisible(true);
        icon.SetVisible(true);
        lNew.SetVisible(false);
        btnSelect.SetVisible(true);
        SetTopRewardGroupVisible(false);
        UpdateSeasonEventElements(true);
        //activity end
        if(EventCenterUtils.IsSeasonEvent(m_data))
        {
            timeDescription.txt  = Datas.getArString("EventCenter.ProcessingResults");
              timeDescription.rect = new Rect(170,65,345,60);
            lTimeicon.SetVisible(false);
            l_bg_Cup.SetVisible(false);
            prizeIcon.SetVisible(false);
            eventTime.SetVisible(false);
            timeDescription.SetVisible(true);
        }
        else if(_Global.GetString(m_data["prize"]) == Constant.EventCenter.PrizeStatus.NOPRIZE)
        {
            //no prize
            if(_Global.GetString(m_data["status"]) == Constant.EventCenter.PRIZEOPEN)
            {
                timeDescription.txt  = Datas.getArString("EventCenter.NoPrize");
                  timeDescription.rect = new Rect(170,65,345,60);
            }
            else
            {
                timeDescription.txt  = Datas.getArString("EventCenter.ProcessingResults");
                  timeDescription.rect = new Rect(170,65,345,60);
            }
            lTimeicon.SetVisible(false);
            l_bg_Cup.SetVisible(false);
            prizeIcon.SetVisible(false);
            eventTime.SetVisible(false);
            timeDescription.SetVisible(true);
        }
        else if(_Global.GetString(m_data["prize"]) == Constant.EventCenter.PrizeStatus.PRIZE)
        {
            //won prize
            lTimeicon.SetVisible(false);
            l_bg_Cup.SetVisible(true);
            prizeIcon.SetVisible(true);
            eventTime.txt = _Global.timeFormatShortStr(m_rewardEndTime-curTime,true);
            eventTime.SetVisible(true);
            timeDescription.SetVisible(true);
            if(_Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_CERTAINPRIZE ||
                    _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.NORANK_CERTAINPRIZE ||
                    _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.GROUPED_RANK_CERTAINPRIZE)
            {
                //rank
                timeDescription.txt  = Datas.getArString("EventCenter.WonPrize");
                  timeDescription.rect = new Rect(170,45,345,60);
            }
            else if(_Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.RANK_RANDOMPRIZE ||
                    _Global.GetString(m_data["rewardType"]) == Constant.EventCenter.RewardType.NORANK_RANDOMPRIZE)
            {
                //random
                timeDescription.txt  = Datas.getArString("EventCenter.WonSlot");
                  timeDescription.rect = new Rect(170,45,345,60);
            }
            else
            {
                //random
                timeDescription.txt  = Datas.getArString("EventCenter.WonSlot");
                  timeDescription.rect = new Rect(170,45,345,60);
            }
        }
        else if(_Global.GetString(m_data["prize"]) == Constant.EventCenter.PrizeStatus.HAVEGOTPRIZE)
        {
            //already claimed
            lTimeicon.SetVisible(false);
            l_bg_Cup.SetVisible(false);
            prizeIcon.SetVisible(false);
            timeDescription.txt  = Datas.getArString("EventCenter.AlreadyClaimed");
              timeDescription.rect = new Rect(170,65,345,60);
            eventTime.SetVisible(false);
            timeDescription.SetVisible(true);
        }
    }
    
    private function UpdateRewardEnd(curTime : long)
    {
        setAllComponentVisible(false);
    }
    
	public function Update()
	{
		l_bg.Update();
        updateHelper.Update();
	}
	
	public function setAllComponentVisible(bVisible:boolean)
	{
		eventName.SetVisible(bVisible);
		eventTime.SetVisible(bVisible);
		timeDescription.SetVisible(bVisible);
		Eventdescription.SetVisible(bVisible);
		l_bg.SetVisible(bVisible);
		icon.SetVisible(bVisible);
		l_bg_Cup.SetVisible(bVisible);
		lTimeicon.SetVisible(bVisible);
		lNew.SetVisible(bVisible);
		prizeIcon.SetVisible(bVisible);
        SetTopRewardGroupVisible(bVisible);
		btnSelect.SetVisible(bVisible);
		UpdateSeasonEventElements(bVisible);
	}
	
	public function SetRowData(_data:Object)
	{
		m_data = _data as HashObject;
		eventName.txt = m_data["name"].Value;
		var iconName : String = m_data["image"].Value;
		if(iconName == "EventSeasons")
		{
			var img : Texture2D = TextureMgr.instance().LoadTexture(iconName,TextureType.DECORATION);
			icon.tile = TileSprite.CreateTile (img, iconName);
		}
		else
		{
			icon.tile.name = iconName;
		}
		
		m_startTime = _Global.INT64(m_data["startTime"]);
		m_endTime = _Global.INT64(m_data["endTime"]);
		m_rewardEndTime = _Global.INT64(m_data["rewardEndTime"]);
		redPoint.SetVisible(_Global.INT32(m_data["isRead"]) != 1);
        SetTopRewardImageIfNeeded();   
        InitUpdateHelper();
	}
    
    private function SetTopRewardImageIfNeeded() {
        if (ShouldShowTopReward) {
        
        	if (null != m_data["topReward"])
        	{
        		InitTopRewardGroup();
        		var topReward:String = m_data["topReward"].Value as String;
    			//var rewards:String[] = topReward.Replace("[", "").Split("]"[0]);
    			//topRewardIcon.tile.name = TextureMgr.instance().LoadTileNameOfItem(_Global.INT32(rewards[0].Split(":"[0])[0]));
    			var rewards:String[] = topReward.Replace("[", "").Split("]"[0]);
    			for(var i : int = 0; i < rewards.Length - 1; ++i)
    			{
    				if(i >= 3)
    				{
    					continue;
    				}
    				topRewardIcon[i].tile.name = TextureMgr.instance().LoadTileNameOfItem(_Global.INT32(rewards[i].Split(":"[0])[0]));
    			}
        	}
        	else if (null != m_data["groupedTournament"])
        	{
        		InitTopRewardGroup();
	            var tournamentInfo : HashObject = m_data["groupedTournament"];
	            var topRewardItemId : int = _Global.INT32(tournamentInfo["topReward"]);
	            topRewardIcon[0].tile.name = TextureMgr.instance().LoadTileNameOfItem(topRewardItemId);
            }
        }
    }
	
	protected function ViewDetail():void
	{
		if(handlerDelegate)
		{
			handlerDelegate.handleItemAction(Constant.Action.EVENTCENTER_ITEM_NEXT, m_data);
			if(m_data["eventId"] != null)
			{
				Message.getInstance().SetEventCenterRead(_Global.INT32(m_data["eventId"]));
			}
			if(m_data["seasonId"] != null)
			{
				Message.getInstance().SetEventCenterRead(_Global.INT32(m_data["seasonId"]));
			}
			redPoint.SetVisible(false);
			
	        var menu : EventCenterMenu = KBN.MenuMgr.instance.getMenu("EventCenterMenu") as EventCenterMenu;
	        if(menu != null)
	        {
	       		menu.FreshenEventListData();
       		}
		}			
	}
}