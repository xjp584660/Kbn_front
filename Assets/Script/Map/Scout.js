
class Scout  extends BaseQueueMgr{
	private	static	var	singleton:Scout;
	private var	seed:HashObject;
	
	private var lastItem : ScoutItem = null;
	
	private var _inited:boolean = false;
	
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new Scout();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public	function	init( sd:HashObject ){
		seed = sd;
		
		var currentcityid:int = GameMain.instance().getCurCityId();
		var scoutingTime:long = _Global.parseTime(seed["scouting"]["city" + currentcityid]["scoutingUnixtime"]);
		var scoutingDuration:long = _Global.parseTime(seed["scouting"]["city" + currentcityid]["scoutingDuration"]);
		var scoutingTimeLeft = scoutingTime - GameMain.unixtime();
		if (scoutingTimeLeft > 0) {
		
			var	item:ScoutItem = new ScoutItem();
			
			item.classType = QueueType.ScoutQueue;

			item.x = seed["scouting"]["city" + currentcityid]["xCoord"].Value;
			item.y = seed["scouting"]["city" + currentcityid]["yCoord"].Value;
			item.titleStr = Datas.instance().getArString("Common.Scouting") + "(" + item.x + "," + item.y + ")";

			item.showTime = true;
			item.endTime = scoutingTime;
			item.startTime = scoutingTime - scoutingDuration;
			item.showSpeedUp = true;
			item.calcRemainingTime();
			add2Queue(item, GameMain.instance().getCurCityId());
		}
		
		_inited = true;
	}
	
	// Executes a scout on a specific tile location
	//
	public	function	scout (xCoord:String, yCoord:String, instant:boolean, okCallback:System.Action.<boolean>) {
		
		var instantScoutGems:int = 0;
		var	itemsList:String = "";
		var currentcityid:int = GameMain.instance().getCurCityId();
		var params:Array = new Array();
		params.Add( currentcityid );
		params.Add( xCoord );
		params.Add( yCoord );
		params.Add( instant ? "true":"false" );
		params.Add( "false" );
		if( instant ){
			var timeRequired:long = getScoutTime( _Global.INT32(xCoord), _Global.INT32(yCoord) );
			itemsList = SpeedUp.instance().getItemListString(timeRequired);
			
			instantScoutGems = getScoutInstantlyGems( timeRequired );
		}
		
		params.Add( instantScoutGems );
		params.Add( itemsList );
		if(instant && Payment.instance().CheckGems(instantScoutGems) == false)
		{
			return;
		}
		else
		{
			var okFunc:Function = function(result:HashObject){
				if( instant ){
					var isReal:boolean = result["isWorldGem"]?result["isWorldGem"].Value == false:true;
					Payment.instance().SubtractGems(instantScoutGems,isReal);	
				}
				var	item:ScoutItem = new ScoutItem();
				item.classType = QueueType.ScoutQueue;
				item.x = result["scoutingXCoord"].Value;
				item.y = result["scoutingYCoord"].Value;
				item.endTime = _Global.parseTime(result["scoutingUnixtime"]);
				item.startTime = item.endTime - _Global.parseTime(result["scoutingDuration"]);
				item.calcRemainingTime();
				item.showSpeedUp = true;
				item.titleStr = Datas.instance().getArString("Common.Scouting") + "(" + item.x + "," + item.y + ")";
				item.showTime = true;
			
				add2Queue(item, GameMain.instance().getCurCityId());
				if (lastItem != null && lastItem != item)
				{
					lastItem.close = true;
				}
				lastItem = item;

				GameMain.instance().seedUpdateAfterQueue(false);
				if( okCallback ){
					okCallback(instant);
				}
			};
			
			UnityNet.reqScout(params, okFunc, null );
		}
	}
	
	/**
	 queuemgr part...
	**/
	public function queueItemAdded(qItem:QueueItem,qId:int):void
	{
		if( _inited ){
			MenuMgr.getInstance().OnStartMarch(qItem);
			if (lastItem != null && lastItem != qItem)
			{
				lastItem.close = true;
			}
			lastItem = qItem;
		}
	}
	
	public function queueItemRemoved(qItem:QueueItem,qId:int):void
	{
		GameMain.instance().dealyCallUpdateSeed(2);
		if (lastItem != null && lastItem != qItem)
		{
			lastItem.close = true;
		}
		lastItem = qItem;
		qItem.titleStr = Datas.instance().getArString("Common.Scouting");
		qItem.showSpeedUp = false;
		qItem.showTime = false;
	}
	
	public function creatQueueClass(qId:int):BaseQueue
	{
		var q:BaseQueue = super.creatQueueClass(qId);		
		q.setMaxItemNum(1); // TODO...
		return q;
	}

	public function closeScoutProgress()
	{
		if (lastItem == null)
		{
			return;
		}
		
		lastItem.close = true;
	}

	///////end queueMgr part ../////////
	
	public	function getScout():ScoutItem{
		var queue:BaseQueue = this.getQueue(GameMain.instance().getCurCityId());
		if(!queue)
			return null;	//
		var list:Array = queue.GetData();
		if(list.length >= 1)
			return list[0];
		else
			return null;
	}
	
	private	static	var	SCOUTING_CONST_SPEED:int = 6000;
	private	static	var	SCOUTING_BASE_SPEED:int = 2000;	
	private	static	var	SCOUTING_MIN_TIME:int = 30;
	
	public	function	getScoutTime(targetX:int, targetY:int):long{
		var curCityInfo:HashObject = GameMain.instance().GetCityInfo(GameMain.instance().getCurCityId());
		var disX:int = _Global.INT32(curCityInfo[_Global.ap + 2]) - targetX;
		var disY:int = _Global.INT32(curCityInfo[_Global.ap + 3]) - targetY;
		
		var t:long = Mathf.Ceil(Mathf.Sqrt(disX*disX + disY *disY ) * SCOUTING_CONST_SPEED /SCOUTING_BASE_SPEED);
		if( t < SCOUTING_MIN_TIME ){
			t = SCOUTING_MIN_TIME;
		}
		
		return t;
	}
	
	public	function	getScoutInstantlyGems( targetX:int, targetY:int ):int{
		var scoutTime:long = getScoutTime(targetX, targetY );
		return getScoutInstantlyGems(scoutTime);
	}
	
	public	function	getScoutInstantlyGems( time:long ):int{
		return SpeedUp.instance().getTotalGemCost(time) + 5;
	}
	
	class ScoutItem extends QueueItem{
		public	var	x:String;
		public	var	y:String;
		public  var close : boolean = false;
		
		public function get willBeRemoveFromBar():boolean
		{
			if (true /*!SocketNet.GetInstance().IsEnable*/) // Temp fix TODO: change back after KBN v17.2 submission
			{
				return timeRemaining <= 0;
			}
			else
			{
				return close;
			}
		}
	}
}
