public class WildernessMgr extends BaseQueueMgr
{
	private	static	var	singleton:WildernessMgr;
	private var	seed:HashObject;
	
	private var _inited:boolean = false;
	
	private var wildernessHash :Hashtable = {};
	
	public	static	function	instance()
	{
		if( singleton == null ){
			singleton = new WildernessMgr();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public function canTileSurvey(tileType:int):boolean
	{
		var hashObj:HashObject = Datas.instance().surveyTileType();
		
		if(hashObj == null)
		{
			return false;
		}
		
		var tileSurveyType:Array = _Global.GetObjectValues(hashObj);
		var type:int;
		
		for(var a:int = 0; a < tileSurveyType.length; a++)
		{
			type = _Global.INT32(tileSurveyType[a]);
		
			if(tileType == type)
			{
				return true;
			}
		}
		
		return false;				
	}
		
	
	private var _eg:boolean =true;
	public	function	init( sd:HashObject )
	{
		seed = sd;
		_eg =true;
		var obj:Hashtable = seed["wilderness"].Table;
		var mvo:MarchVO;
		var cityId:int;
		
		
		this.clearAll();
		for(var j:System.Collections.DictionaryEntry in obj) // c41..
		{
			var cs:String = j.Key;
			cs = cs.Substring(4);
			cityId = _Global.INT32(cs);
			for(var i:System.Collections.DictionaryEntry in (j.Value as HashObject).Table)
			{
				var id:HashObject =  i.Value;
				addSeedMarchObj2Mgr(cityId,id);
			}
		}	
		
		_eg = false;	
		
	}
	
	public function addSeedMarchObj2Mgr(cityId:int,smObj:HashObject):MarchVO
	{
		var wvo:WildernessVO = new WildernessVO();
		if(!smObj)
			return;
		wvo.cityId = cityId;
		wvo.mergeDataFrom(smObj);
		
		
		this.add2Queue(wvo,cityId);
		
	}
	
	public function AddSpeedUpSlot(tileid:int):void
	{
		var wvo:WildernessVO = getWilderness(tileid);
		if(wvo == null)
			return;
		MenuMgr.getInstance().OnAddConqueredWild(wvo);
	}
	
	public function queueItemAdded(qItem:QueueItem,qId:int):void
	{	
		var oldWvo:WildernessVO = wildernessHash[_Global.ap + "_" + qId + "_" + qItem.id];
		var wvo:WildernessVO = qItem as WildernessVO;
		var addBar:boolean = true;
		//remove waiting for report..
		if(_eg )
			return;
		if(wvo.tileStatus == Constant.WildernessState.UNCONQUERED)
		{
			//MenuMgr.getInstance().OnAddConqueredWild(qItem);
			return;
		}
		if(oldWvo)	// && mvo.marchStatus == Constant.MarchStatus.WAITING_FOR_REPORT)
		{
			addBar = false;
			wildernessHash.Remove(_Global.ap + "_" + qId + "_" + qItem.id);
		}
		else
		{
			addBar = true;	
		}
		
		wildernessHash[_Global.ap + "_" + qId + "_" + qItem.id] = qItem;
		
		//General.instance().setGeneralStatus(qId,mvo.knightId,Constant.GeneralStatus.MARCH);	//for check.			

		if(!_eg &&  MenuMgr.getInstance().MainChrom.myCurProgressList != null && wvo.tileStatus == Constant.WildernessState.DURINGCD && wvo.tileCityId == GameMain.instance().getCurCityId())
		{
			MenuMgr.getInstance().OnAddConqueredWild(qItem);
		}

	}
	
	public function queueItemRemoved(qItem:QueueItem,qId:int):void
	{
		var oldWvo:WildernessVO = wildernessHash[_Global.ap + "_" + qId + "_" + qItem.id];
		var wvo:WildernessVO = qItem as WildernessVO;
		wildernessHash.Remove(_Global.ap + "_" + qId + "_" + qItem.id);
	}
	
	
	public function getWilderness(tileId:int):WildernessVO
	{
		var obj:Hashtable = seed["wilderness"].Table;
		
		for(var j:System.Collections.DictionaryEntry in obj) // c41..
		{
			var cs:String = j.Key;
			cs = cs.Substring(4);
			var cityId:int = _Global.INT32(cs);
			var queue:BaseQueue = this.getQueue(cityId);
			if(!queue)
				continue;	//
			var list:Array = queue.GetData();
			for(var wvo:WildernessVO in list)
			{
				if(wvo.tileId == tileId)
					return wvo;
			}
		}
		return null;
	}
	
	public function isConquedWild(x:int, y:int):boolean
	{
		var obj:Hashtable = seed["wilderness"].Table;
		
		for(var j:System.Collections.DictionaryEntry in obj) // c41..
		{
			var cs:String = j.Key;
			cs = cs.Substring(4);
			var cityId:int = _Global.INT32(cs);
			var queue:BaseQueue = this.getQueue(cityId);
			if(!queue)
				continue;
			var list:Array = queue.GetData();
			for(var wvo:WildernessVO in list)
			{
				if(wvo.xCoord == x && wvo.yCoord == y && wvo.tileStatus != Constant.WildernessState.UNCONQUERED)
				{
					return true;
				}
			}
		}	
		return false;

	}
	
	public function abandonWilder(tileid:int):void
	{
		var wvo:WildernessVO = getWilderness(tileid);
		if(wvo == null)
			return;
		wvo.tileStatus = Constant.WildernessState.DELETED;
		wvo.calcRemainingTime();
		//AddEmptySlot(tileid+WildernessMgr.EmptySlotBaseSequence);
		March.instance().addItemstoInventory(tileid);
		
		if(seed["wilderness"]["city"+wvo.tileCityId]["t"+tileid])
			seed["wilderness"]["city"+wvo.tileCityId].Remove(("t"+tileid));
	}
	
	public function getWildernessIdArray(cityId:int):Array
	{
		var queue:BaseQueue = this.getQueue(cityId);
		if(!queue)
			return null;
			
		var list:Array = queue.GetData();
		var returnlist:Array = new Array();
		for(var wvo:WildernessVO in list)
		{
			if(wvo.tileStatus != Constant.WildernessState.UNCONQUERED)
				returnlist.Add(wvo.tileId);
		}
		
		return returnlist;
	}
	
	public function setWilderinSurvey(tileId:int, state:int):void
	{
		var obj:Hashtable = seed["wilderness"].Table;
		
		for(var j:System.Collections.DictionaryEntry in obj) // c41..
		{
			var cs:String = j.Key;
			cs = cs.Substring(4);
			var cityId:int = _Global.INT32(cs);
			var queue:BaseQueue = this.getQueue(cityId);
			if(!queue)
				continue;	//
			var list:Array = queue.GetData();
			for(var wvo:WildernessVO in list)
			{
				if(wvo.tileId == tileId)
				{
					seed["wilderness"]["city"+cityId]["t"+tileId]["inSurvey"].Value = state;
					wvo.inSurvey = state;
				}
			}
		}	
	}
}

class WildernessVO extends QueueItem
{
	public var tileId:int;
	public var xCoord:int;	
	public var yCoord:int;
	public var tileType:int;
	public var tileLevel:int;
	public var orgTileLevel:int;
	public var tileCityId:int;
	public var tileUserId:int;
	public var tileAllianceId:int;
	public var tileProvinceId:int;
	public var tileBlockId:int;
	public var tileStatus:int;
	public var inSurvey:int;
	
	public var isActive:boolean = true;
	
	public function mergeDataFrom(src:HashObject):void
	{
		rawData = src;
		var tmp:String;
		var i:int;			

		this.classType = QueueType.WildernessQueue; 
		
		
		endTime = this.getLong("freezeEndTime");	
		this.needed = this.getLong("freezeNeedTimes");	
		startTime =  endTime - this.needed;
			
		id = tileId = this.getInt("tileId");

		this.xCoord = this.getInt("xCoord");
		this.yCoord = this.getInt("yCoord");
		this.tileType = this.getInt("tileType");
		this.tileLevel = this.getInt("tileLevel");
		this.orgTileLevel = this.getInt("orgTileLevel");
		this.tileCityId = this.getInt("tileCityId");
		this.tileUserId = this.getInt("tileUserId");
		this.tileAllianceId = this.getInt("tileAllianceId");
		this.tileProvinceId = this.getInt("tileProvinceId");
		this.tileBlockId = this.getInt("tileBlockId");

		this.tileStatus = (endTime > GameMain.unixtime())?Constant.WildernessState.DURINGCD : Constant.WildernessState.FREETOSURVEY;

		this.inSurvey = this.getInt("inSurvey");
//		isActive = (toXCoord !=0 || toYCoord!=0);
//		if(!isActive)
//			return;
				
		if(tileStatus == Constant.WildernessState.DURINGCD)
		{
			isActive = false;												
		}						

	}
	
			
	public function calcRemainingTime():void
	{
		this.timeRemaining =  endTime - GameMain.unixtime();
		showTime = false;
		switch(tileStatus)
		{
			case Constant.WildernessState.DURINGCD:
				if(timeRemaining < 0.5)
				{
					timeRemaining = 1;
					this.tileStatus = Constant.WildernessState.FREETOSURVEY;
				}
				showTime = true;
				showSpeedUp = true;
				this.btnStr = Datas.getArString("Common.Speedup");
				this.btnAction = "SPEEDUP";
				titleStr = Datas.getArString("OpenPalace.TileRecoveringVar",[xCoord, yCoord]);
				break;
				
			case Constant.WildernessState.FREETOSURVEY:
				timeRemaining = 1;
				if(inSurvey == 0) //ready for survey
					titleStr = Datas.getArString("Common.NoTilesRecovering",[xCoord, yCoord]);
				else
					titleStr = Datas.getArString("OpenPalace.Surveying",[xCoord, yCoord]);
				if(!WildernessMgr.instance().canTileSurvey(tileType))
					titleStr = Datas.getArString("Common.CannotSurveyVar",[xCoord, yCoord]);
				this.btnStr = Datas.getArString("Common.ManageButton");
				this.btnAction = "JUMPTOCASAL";
				break;
				
			case Constant.WildernessState.UNCONQUERED:
				timeRemaining = needed;
				titleStr = Datas.getArString("Common.Available");
				this.btnStr = Datas.getArString("Common.ManageButton");
				this.btnAction = "JUMPTOCASAL";
				break;
				
			case Constant.WildernessState.DELETED:
				timeRemaining = 0;
				break;
		}
	}
	
	public function speed2EndTime(neweta:long):void
	{
		var speeded:long = endTime - neweta;
		endTime = neweta;
		startTime -= speeded;			
	}
	
	public function get willBeRemoveFromBar():boolean
	{
		//marchstatus......
		switch(tileStatus)
		{
			case Constant.WildernessState.DURINGCD:	//marching....
				return false;
				
			default:
				return true;
			break;
		}
	}
	
}