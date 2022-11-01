
class	CollectSpeedUpMenu extends	PopMenu implements IEventHandler{

	public	var	separateLine1:Label;
//	public	var	separateLine2:Label;
	public	var	timeTxtLabel:Label;
	public	var	timeIconLabel:Label;
	public	var	percentBar:PercentBar;
	public	var	instantFinishBtn:Button;
	public var btn_allianeHelp:Button;
	public var l_allianceHelpCount:Label;
	
	public	var	listView:ScrollList;
	public	var	speedUpItem:SpeedUpItem;
	
	public var l_gem_label:Label;
	public var l_gem:Label;
	
//	private	var	speedUpItemIds:Array = [1, 2, 3, 4, 5, 6, 7];
//	private	var speedUpFortificationIds:Array = [24];
//    private	var speedUpTrainingIds:Array = [34];
//	private var speedUpMarchIds:Array=[1,2,3,4,5,6,7];
	
	private	var	speedUpData:QueueItem;
	private	var	typeId:int;
	private	var	onMinAgo:long;
	private	var data:Array = new Array();
	private var isCloseAfterAnimationFinish:boolean = false;
	
//	public	function	Awake(){
//		super.Awake();
//		Init();
//	}
	
	function Init()
	{
	    super.Init();
		listView.Init(speedUpItem);
		title.txt = Datas.getArString("Common.Speedup");
		
		separateLine1.setBackground("between line", TextureType.DECORATION);
		
		var f_min:float;
		var f_max:float;
		l_gem_label.txt = Datas.getArString("Common.Gems");
		
		l_gem_label.Init();
		l_gem_label.SetFont();
		//l_gem_label.mystyle.CalcMinMaxWidth(GUIContent(l_gem_label.txt),f_min,f_max);
		l_gem.rect.x = l_gem_label.rect.x + l_gem_label.GetWidth();
		
		isCloseAfterAnimationFinish = false;
		btnClose.OnClick = OnCloseClick;
		listView.itemDelegate = this;
	}
	
//	public	function	Start(){
//		super.Start();
//	}
	
	public	function	Update(){
//		_Global.Log(" SpeedUP menu update");
		listView.Update();

		var timeLeft:long = getTimeLeft();
		if(timeLeft < 0) timeLeft = 0;
		timeTxtLabel.txt = _Global.timeFormatStr( timeLeft );
		if( speedUpData.endTime > 0 && timeLeft > 0 ){
			var duration = getDuration( speedUpData );
			percentBar.update(duration - timeLeft);
			if( onMinAgo - timeLeft > 60 ){
				instantFinishBtn.txt = SpeedUp.instance().getTotalGemCost(timeLeft) + " " + Datas.getArString("SpeedUp.BuyInstantFinish");
				onMinAgo = timeLeft;
			}
			if(speedUpData.classType == QueueType.WildernessQueue && (speedUpData as WildernessVO).tileStatus == Constant.WildernessState.FREETOSURVEY)
			{
				this.close();
				MenuMgr.getInstance().sendNotification(Constant.Notice.SPEED_WILDER_OK, speedUpData.id);
			}
		}
		else
		{
			if(!isCloseAfterAnimationFinish && percentBar.getCurBarState() == PercentBar.PercentBarState.STOP)
			{
				MenuMgr.getInstance().PopMenu("CollectSpeedUpMenu");
			}
		}
				
		if(isCloseAfterAnimationFinish && percentBar.getCurBarState() == PercentBar.PercentBarState.STOP)
		{  
			MenuMgr.getInstance().PopMenu("CollectSpeedUpMenu");
		}
		
		percentBar.Update();
		
		if((MenuMgr.getInstance().Chat as ChatMenu).whetherGetChat(false))
		{
			(MenuMgr.getInstance().Chat as ChatMenu).getChat(true);
		}
		if(speedUpData.helpNeedCheck)
		{
			this.checkAllianceHelp();
		}	
	}
	
	public function DrawItem()
	{
		separateLine1.Draw();
		
		listView.Draw();
//		separateLine2.Draw();
		percentBar.Draw();
		timeIconLabel.Draw();
		timeTxtLabel.Draw();
//		instantFinishBtn.Draw();
		
//		btn_allianeHelp.Draw();
//		l_allianceHelpCount.Draw();
		l_gem.Draw();
		l_gem_label.Draw();
	}
	
	public	function	OnPush( p:Object ){
		super.OnPush( p );
		
		var enable:boolean = true;
		speedUpData = p as QueueItem;
		var timeLeft:long;


//		_Global.Log(" speedup type:" + speedUpData.classType );
		switch( speedUpData.classType ){
		
		case QueueType.ResearchQueue:
			typeId = SpeedUp.PLAYER_ACTION_RESEARCH;
			break;
			
		case QueueType.BuildingQueue:
			typeId = SpeedUp.PLAYER_ACTION_CONSTRUCT;
			break;
//			
		case QueueType.TrainningQueue:
			typeId = SpeedUp.PLAYER_ACTION_TRAIN;
			break;
		//.. tzhou
		case QueueType.MarchQueue:
			var marchData:MarchVO = speedUpData as MarchVO;
			if(marchData.marchType == Constant.MarchType.PVE || marchData.marchType == Constant.MarchType.ALLIANCEBOSS)
				typeId = SpeedUp.PLAYER_ACTION_PVE;
			else if(marchData.marchType == Constant.MarchType.COLLECT)
			{
				typeId = SpeedUp.PLAYER_ACTION_COLLECTMARCH;
			}
			else if(marchData.marchType == Constant.MarchType.COLLECT_RESOURCE)
			{
				typeId = SpeedUp.RLAYER_ACTION_COLLECT_RESOURCE_MARCH;
			}
			else
				typeId = SpeedUp.PLAYER_ACTION_MARCH;
			break;
			
		case QueueType.WildernessQueue:
			typeId = SpeedUp.PLAYER_ACTION_WILDER;
			break;
		case QueueType.WallTrainingQueue:
			typeId = SpeedUp.PLAYER_ACTION_FORTIFY;
			break;
		case QueueType.ScoutQueue:
			typeId = SpeedUp.PLAYER_ACTION_SCOUT;
			break;
		case QueueType.HealQueue:
			typeId = SpeedUp.PLAYER_ACTION_HEAL;
			break;
		case QueueType.Hero:
			typeId = SpeedUp.PLAYER_ACTION_HERO;
			break;
        case QueueType.SelectiveDefense:
            typeId = SpeedUp.PLAYER_ACTION_SELECTIVE_DEFENSE;
            break;
		}
		
		timeLeft = speedUpData.timeRemaining;
		onMinAgo = timeLeft;
				
		if(typeId == SpeedUp.PLAYER_ACTION_COLLECTMARCH)
		{
			Shop.instance().getShopData(SetCollectItems);
		}
		else if(typeId == SpeedUp.RLAYER_ACTION_COLLECT_RESOURCE_MARCH)
		{
			Shop.instance().getShopData(SetCollectResourceItems);
		}	
		else
			Shop.instance().getShopData(SetItems);

		var duration = getDuration( speedUpData );
		percentBar.Init( duration - timeLeft, duration, true);
		
		checkAllianceHelp();
		
		l_gem.txt = Payment.instance().DisplayGems + "";
	}
	
	// We use the following functionality to store and fetch the
	// queue item duration because the new backend system will
	// change the starting and end time of the item abnormally when
	// a player accelerates it.
	private static var marchTotalTimeMap : HashObject = new HashObject();
	private function getDuration( q : QueueItem ) {
		var duration : int = q.endTime - q.startTime;
		if( q.customKey == "" ) {
			q.customKey = ""+GameMain.unixtime();
		}
		if( marchTotalTimeMap[q.customKey] == null ) {
			marchTotalTimeMap[q.customKey] = new HashObject();
			marchTotalTimeMap[q.customKey].Value = ""+duration;
		} else {
			var durationString : String = marchTotalTimeMap[q.customKey].Value as String;
			duration = _Global.INT32( durationString );
		}
		return duration;
	}
	
	public	function	OnPopOver()
	{
		listView.Clear();
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.ALLIANCE_HELP_ARRIVED:
					checkAllianceHelp();
				break;
			case Constant.Notice.GEMS_UPDATED:
					l_gem.txt = Payment.instance().DisplayGems + "";
				break;
			case Constant.Notice.SPEEDUP_ITEMS_UPDATED:
					UpdateItems();
				break;
		}
	}
	
	protected function checkAllianceHelp():void
	{
		var globalEnabler:boolean = Datas.getHashObjectValue(GameMain.instance().getSeed(),"config.allianceHelp") != false
		&& GameMain.instance().getSeed()["allianceDiplomacies"] != null;	//default ON
		// button
		if( globalEnabler )
		{
			btn_allianeHelp.SetVisible(true);
			l_allianceHelpCount.SetVisible(true);
			listView.rect.height = 520;
			
			if(speedUpData.canUseHelp())
			{
				btn_allianeHelp.changeToBlueNew();
				btn_allianeHelp.OnClick = handler_AllianceHelp;
			}		
			else
			{
				btn_allianeHelp.changeToGreyNew();
				btn_allianeHelp.OnClick = handler_AllianceHelp_NotFit;
			}
		}			
		else
		{
			//btn_allianeHelp.changeToGrey();
			btn_allianeHelp.SetVisible(false);
			l_allianceHelpCount.SetVisible(false);
			listView.rect.height = 600;
			btn_allianeHelp.OnClick = handler_AllianceHelp_NotFit;
		}
		
		listView.ResetPos();
		btn_allianeHelp.txt = Datas.getArString("SpeedUp.Request_Alliance_Help");
		l_allianceHelpCount.txt = "(" + speedUpData.help_cur + "/" + speedUpData.help_max + ")";
		
		speedUpData.helpNeedCheck = false;
	}
	
	public function OnPop():void
	{
		KBN.FTEMgr.getInstance().hideFTE(FTEConstant.Step.SPEED_UP_CLICK_INSTANT);	
	}
	
	public	function	getTimeLeft():long{
		return speedUpData.endTime - GameMain.unixtime();
	}
	
	
	function SetItems()
	{
//		var arStrings:Object = Data.instance().arStrings();
		data.Clear();
		var itemId:int;
		var timeLeft:long = speedUpData.timeRemaining;
		var items = SpeedUp.instance().sortSpeedUpItems(timeLeft);
		instantFinishBtn.SetVisible(true);
		instantFinishBtn.txt = SpeedUp.instance().getTotalGemCost(timeLeft) + " " + Datas.getArString("SpeedUp.BuyInstantFinish");
		instantFinishBtn.clickParam = {"itemType":typeId };
		instantFinishBtn.OnClick= function( param:Object ){
			if(percentBar.getCurBarState() != PercentBar.PercentBarState.STOP) return;
			var tl:long = speedUpData.timeRemaining;//MenuMgr.getInstance().SpeedUp.getTimeLeft();
			var price:int = SpeedUp.instance().getTotalGemCost(tl);
			SpeedUp.instance().useInstantSpeedUp((param as Hashtable)["itemType"], price, SpeedUp.instance().getItemListString(tl), speedUpData.id);
		};
		

		
		var itemList:HashObject = Datas.instance().itemlist();
		var seed:HashObject = GameMain.instance().getSeed();
		var count:int = 0;
		var item:Hashtable;
		
		for( var i:int = 0; i < items.length; i ++ ){
			itemId = items[i];
			if(itemId > SpeedUp.BASEITEM_NUM)
				itemId += SpeedUp.STANDERDITEM_COMP_CODE;

			count = seed["items"]["i" + itemId] ? _Global.INT32(seed["items"]["i" + itemId]):0;
			item = Shop.instance().getItem(Shop.SPEEDUP, itemId);
			
			if(itemId > SpeedUp.STANDERDITEM_COMP_CODE && count == 0)
				continue;
				
			data.push({
				"itemType":typeId,
				"itemId": itemId,
				"itemName":Datas.getArString("itemName."+"i" + itemId),
				"itemDesc":Datas.getArString("itemDesc."+"i" + itemId),
				"targetId":speedUpData.id,
				"targetData":speedUpData,
				"count":count,

				"item":item
				});

		}
		listView.SetData(data);
		listView.ResetPos();
	}

	function SetCollectItems()
	{
		data.Clear();
		var itemId:int;
		var timeLeft:long = speedUpData.timeRemaining;
		var items = SpeedUp.instance().sortSpeedUpItems(timeLeft);
		instantFinishBtn.SetVisible(false);
		title.txt = Datas.getArString("Newresource.march_operate_title");
		
		var itemList:HashObject = Datas.instance().itemlist();
		var seed:HashObject = GameMain.instance().getSeed();
		var count:int = 0;
		var item:Hashtable;
		
		
		var collectItems:Array = new Array();
			collectItems.Add(6851);
			collectItems.Add(6852);
		for( var i:int = 0; i < collectItems.length; i ++ ){
			itemId = collectItems[i];
		
			count = seed["items"]["i" + itemId] ? _Global.INT32(seed["items"]["i" + itemId]):0;
			item = Shop.instance().getItem(Shop.SPEEDUP, itemId);
		
			data.push({
				"itemType":typeId,
				"itemId": itemId,
				"itemName":Datas.getArString("itemName."+"i" + itemId),
				"itemDesc":Datas.getArString("itemDesc."+"i" + itemId),
				"targetId":speedUpData.id,
				"targetData":speedUpData,
				"count":count,

				"item":item
				});

		}

		listView.SetData(data);
		listView.ResetPos();
	}

	function SetCollectResourceItems()
	{
		data.Clear();
		var itemId:int;
		var timeLeft:long = speedUpData.timeRemaining;
		var items = SpeedUp.instance().sortSpeedUpItems(timeLeft);
		instantFinishBtn.SetVisible(false);
		title.txt = Datas.getArString("ResourceCollection.march_operate_title");
		
		var itemList:HashObject = Datas.instance().itemlist();
		var seed:HashObject = GameMain.instance().getSeed();
		var count:int = 0;
		var item:Hashtable;
		
		
		var collectItems:Array = new Array();
			collectItems.Add(4311);
			collectItems.Add(4312);
		for( var i:int = 0; i < collectItems.length; i ++ ){
			itemId = collectItems[i];
		
			count = seed["items"]["i" + itemId] ? _Global.INT32(seed["items"]["i" + itemId]):0;
			item = Shop.instance().getItem(Shop.SPEEDUP, itemId);
		
			data.push({
				"itemType":typeId,
				"itemId": itemId,
				"itemName":Datas.getArString("itemName."+"i" + itemId),
				"itemDesc":Datas.getArString("itemDesc."+"i" + itemId),
				"targetId":speedUpData.id,
				"targetData":speedUpData,
				"count":count,

				"item":item
				});

		}

		listView.SetData(data);
		listView.ResetPos();
	}

	function UpdateItems()
	{
		var seed:HashObject = GameMain.instance().getSeed();
		for(var a:int = 0; a < data.length; a++)
		{
			var tmp:Hashtable = data[a] as Hashtable;
			var itemId:int = _Global.INT32(tmp["itemId"]);
//			if(itemId > SpeedUp.BASEITEM_NUM)
//				itemId += SpeedUp.STANDERDITEM_COMP_CODE;
			if((itemId>7&&itemId !=6851&&itemId !=6852&&itemId!=4311&itemId!=4312)&& _Global.INT32(seed["items"]["i" + itemId]) == 0)
				data.Splice(a,1);
		}
		listView.Update();
		
		var timeLeft:long = getTimeLeft();
		
		if(speedUpData.endTime > 0)
		{
			if(timeLeft > 0 )
			{
				var duration = getDuration( speedUpData );
				percentBar.updateWithAnimation(duration - timeLeft);
			}
			else
			{
				isCloseAfterAnimationFinish = true;
				percentBar.updateWithCompleteAnimation();
			}		
		}
		else
		{
			isCloseAfterAnimationFinish = true;
			percentBar.updateWithCompleteAnimation();			
		}
	}
	
	protected function handler_AllianceHelp_NotFit(param:Object):void
	{
		if(GameMain.instance().getSeed()["allianceDiplomacies"] == null)
		{
			ErrorMgr.instance().PushError("",Datas.getArString("SpeedUp.Need_Alliance_4_Request_Help"));
			return;
		}
	}
	
	protected function handler_AllianceHelp(param:Object):void
	{
		var confirmDialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		confirmDialog.setDefautLayout();	
		confirmDialog.setContentRect(70,140,0,400);	
		confirmDialog.setButtonText(Datas.getArString("Common.post"), Datas.getArString("Common.Cancel") );
		
		MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("SpeedUp.Request_Alliance_Help_Content"),"",requestHelp,null, true);
				
	}
	
	protected function requestHelp():void
	{
		Alliance.getInstance().reqAllianceHelp(speedUpData,requestOk);
	}
	protected function requestOk(result:HashObject):void
	{
		if(result["ok"].Value)
		{
			speedUpData.helpSended();
			MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Post_Alliance_Help_OK"));
			checkAllianceHelp();
			
			var data:Hashtable = {"dlv": speedUpData.level, "dName":speedUpData.itemName};
			MenuMgr.getInstance().Chat.helpInviterItem(data);
		}
	}
	
	private function OnCloseClick()
	{
		MenuMgr.getInstance().PopMenu("CollectSpeedUpMenu");
	}
	
	public function handleItemAction(action:String,params:Object)
	{
		var contentData:Hashtable = params as Hashtable;
		switch(action)
		{
			case Constant.Action.USE_SPEEDUP_ITEM:	
				if(percentBar.GetCurstate() != PercentBar.PercentBarState.STOP || isCloseAfterAnimationFinish)
				{
					SpeedUp.instance().CanClickSpeedUpItem = false;
				}
				else
				{
					SpeedUp.instance().CanClickSpeedUpItem = true;
				}
				break;
		}
	}
}
