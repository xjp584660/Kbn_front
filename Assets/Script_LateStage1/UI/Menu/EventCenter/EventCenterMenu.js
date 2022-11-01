class EventCenterMenu extends KBNMenu implements IEventHandler
{
	public var clone_menuHead : MenuHead;
	public var g_headMenu:MenuHead;
	public var eventList:ScrollList;
	public var listItem:EventCenterItem;
	public var detailInfo:EventInfo;
    
    @SerializeField private var detailInfoSpendNGet : EventInfoSpendNGet;
    
	protected var nc:NavigatorController;
	
    @SerializeField private var eventPlayerGroups:EventPlayerGroups;
	@SerializeField private var eventAllReward:EventAllRewardPage;
    
	public function Init():void
	{
		super.Init();
		eventList.Init(listItem);
		eventList.itemDelegate = this;
		g_headMenu = GameObject.Instantiate(clone_menuHead);
		g_headMenu.Init();
		nc = new NavigatorController();
		nc.push(eventList);
		detailInfo.Init(nc);
        detailInfoSpendNGet.Init(nc);
        eventPlayerGroups.Init(nc);
        eventAllReward.Init(nc);

		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		bgStartY = 68;
		repeatTimes = (rect.height - 1) / bgMiddleBodyPic.rect.height + 1;
		//bgMiddleBodyPic.spt.edge = 2;
		
		frameTop.rect = Rect( 0, EventCenterUtils.EventCenterMenuRankFrameTopY, frameTop.rect.width, frameTop.rect.height);
		canBeBottom = false;
	}
	
	function DrawBackground()
	{
		g_headMenu.Draw();
		DrawMiddleBg();

		frameTop.Draw();
	}
	
	function DrawItem() 
	{
		nc.DrawItems();
	}
	
	function FixedUpdate()
	{
		nc.u_FixedUpdate();	
	}
	
	public function Update()
	{
		g_headMenu.Update();
		nc.u_Update();
	}
	
	public function OnPush(param:Object):void
	{
		super.OnPush(param);
		var eventTitle:String = Datas.getArString("EventCenter.EventCenter");
		g_headMenu.setTitle(eventTitle);
	
	var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		bgStartY = 68;
		//bgMiddleBodyPic.TryChangeImage("ui_paper_bottomEmail", true);
		//bgMiddleBodyPic.rect = bgMiddleBodyPic.spt.GetTileRect("ui_paper_bottom");
//		repeatTimes = (rect.height - 1) / bgMiddleBodyPic.rect.height + 1;
		//bgMiddleBodyPic.spt.edge = 2;
		
		frameTop.rect = Rect( 0, EventCenterUtils.EventCenterMenuRankFrameTopY, frameTop.rect.width, frameTop.rect.height);
		
		nc.pop2Root();
			
		FreshenEventListData();
	}
	
	public function FreshenEventListData()
	{
		eventList.Clear();
		
		var events : Array = EventCenter.getInstance().getAllEventListData();
        for(var j : int = 0; j < events.Count; j++)
        {
        	var eventItem : HashObject = events[j] as HashObject;
            var reads : Array = _Global.GetObjectValues(Message.getInstance().ReadEventCenterTable());
            for(var i : int = 0;i < reads.Count;++i)
			{
				var message:EventCenterTableInfo = reads[i] as EventCenterTableInfo;
				var id : int = _Global.INT32(eventItem["eventId"]);
				if(message.eventId == id)
				{
					eventItem["isRead"] = new HashObject();
					eventItem["isRead"].Value = message.isRead.ToString();
				}
				
				if(id == 0)
				{
					if(eventItem["seasonId"] != null)
					{
						if(message.eventId == _Global.INT32(eventItem["seasonId"]))
						{
							eventItem["isRead"] = new HashObject();
							eventItem["isRead"].Value = message.isRead.ToString();
						}
					}
				}		
			}
        }
        eventList.m_nOffSet = 0f;
		eventList.SetData(events);
	}
	
	public function OnPushOver() {
		canBeBottom = true;
	}
	
	public	function	OnPopOver()
	{
		eventList.Clear();
		detailInfo.Clear();
        detailInfoSpendNGet.Clear();
		TryDestroy(g_headMenu);
		g_headMenu = null;
	}
	public function OnPop()
	{
			 
	}
	
	public function handleItemAction(action:String,params:Object)
	{
		var data:HashObject = params as HashObject;
		switch(action)
		{
			case Constant.Action.EVENTCENTER_ITEM_NEXT:	
				if (EventCenterUtils.IsSeasonEvent(data))
				{
					var seasonId:String = _Global.GetString(data["seasonId"].Value);
					EventCenter.getInstance().reqGetSeasonEventDetailInfo(seasonId,ViewSeasonEventDetail);
				}
				else
				{
					var eventId:String = _Global.GetString(data["eventId"].Value);
					EventCenter.getInstance().reqGetEventDetailInfo(eventId,ViewEventDetail);
				}
				break;
		}
	}
	
	protected function menuLeft():void
	{
        if (nc.uiNumbers <= 2) {
		    g_headMenu.leftHandler = null;
        }
		nc.pop();
	}
	
	protected function ViewEventDetail(eventData:HashObject,detail:HashObject,rankData:HashObject[]):void
	{
		if(eventData == null || detailInfo == null) return;

        g_headMenu.leftHandler = menuLeft;
        
        switch (_Global.INT32(eventData["eventType"]))
        {
        case Constant.EventCenter.GameEventType.SpendNGet:
            detailInfoSpendNGet.resetNC(nc);
            detailInfoSpendNGet.SetData(eventData, detail);
            nc.push(detailInfoSpendNGet);
            break;
        default:
            detailInfo.resetNC(nc);
            nc.push(detailInfo);
            detailInfo.MenuHead = g_headMenu;
    		detailInfo.showDetailInfo(eventData,detail,rankData,eventPlayerGroups,eventAllReward);
    		detailInfo.setPage(EventCenter.getInstance().getRankCurPage(),
                EventCenter.getInstance().getRankTotalPage());
        }
	}
	
	protected function ViewSeasonEventDetail(eventData:HashObject, detail:HashObject, rankData:HashObject[])
	{
		if (null == eventData || null == detailInfo)
			return;
			
		if (_Global.INT32(eventData["eventType"]) != Constant.EventCenter.GameEventType.SeasonEvent)
			return;
		
		g_headMenu.leftHandler = menuLeft;
		
		detailInfo.resetNC(nc);
		nc.push(detailInfo);
		detailInfo.MenuHead = g_headMenu;

		var curPage : int = _Global.INT32(detail["ranking"]["page"]);
		var totalPage : int = _Global.INT32(detail["ranking"]["total"]);
		
		detailInfo.showDetailInfo(eventData,detail,rankData,eventPlayerGroups,eventAllReward);
		detailInfo.setPage(curPage, totalPage);
	}

	public function getmyNacigator():NavigatorController
	{
		return nc;
	}	
}