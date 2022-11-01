import System.Collections.Generic;
/**
*/
public class March extends BaseQueueMgr
{

	private	static	var	singleton:March;
	private var	seed:HashObject;	
	
	private var marchHash :Hashtable = {};	//_global.ap_{cityID}_{marchId}
	
	private var pveQueItem:MarchVO;
	
	public	static	function	instance()
	{
		if( singleton == null ){
			singleton = new March();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public static function clearMarchReturnCount(march:HashObject):void
	{
        //ggg
		for(var i:int = 1; i<13; i++)
		{
			march["unit"+ i +"Return"] = new HashObject( 0);
		}
	}
	//END Static util functions
	private var _eg:boolean =true;
	public	function	init( sd:HashObject )
	{
		rallyMarchDic = new Dictionary.<int, PBMsgMarchInfo.PBMsgMarchInfo>();
		seed = sd;
		var obj:Hashtable = seed["outgoing_marches"].Table;
		var mvo:MarchVO;
		var cityId:int;
		_eg = true;
		this.clearAll();
		
		for(var j:System.Collections.DictionaryEntry in obj) // c41..
		{
			var cs:String = j.Key;
			cs = cs.Substring(1);
			cityId = _Global.INT32(cs);
			for(var i:System.Collections.DictionaryEntry in (j.Value as HashObject).Table)
			{
				var id:HashObject =  i.Value;
				var marchType:int = _Global.INT32(id["marchType"].Value);
				if(marchType == Constant.MarchType.PVE || marchType == Constant.MarchType.ALLIANCEBOSS)
					addPveQueueItem(cityId,id,marchType);
				else
					addSeedMarchObj2Mgr(cityId,id);
			}
		}	
		
		MyItems.instance().updateTreasureChest();
		
		_eg = false;	
		
	}

	public function getMarchesInfo(marches : HashObject) : void
	{
		var obj:Hashtable = marches["marches"].Table;
		var mvo:MarchVO;
		var cityId:int;
		//this.clearAll();
		
		for(var j:System.Collections.DictionaryEntry in obj) // c41..
		{
			var cs:String = j.Key;
			cs = cs.Substring(1);
			cityId = _Global.INT32(cs);
			for(var i:System.Collections.DictionaryEntry in (j.Value as HashObject).Table)
			{
				var id:HashObject =  i.Value;
				var marchType:int = _Global.INT32(id["marchType"].Value);
				if(marchType == Constant.MarchType.PVE || marchType == Constant.MarchType.ALLIANCEBOSS)
					addPveQueueItem(cityId,id,marchType);
				else
					addSeedMarchObj2Mgr(cityId,id);
			}
		}	
	}
	/**
		seed may can't delete item node. then just set it null.
	**/
	public function getMarch(mid:int):MarchVO
	{
		var queue:BaseQueue = this.getQueue(GameMain.instance().getCurCityId());
		if(!queue)
			return null;	//
		var list:Array = queue.GetData();
		for(var mvo:MarchVO in list)
		{
			if(mvo.marchId == mid)
				return mvo;
		}
	}
	
	public function getMarchInTotalCitites(mid:int):MarchVO
	{
		var	cities:HashObject = seed["cities"];
		var cityInfo:HashObject;
		for(var i:int = 0; i < GameMain.instance().getCitiesNumber();i++)
		{
			cityInfo = cities[_Global.ap+i];
			var queue:BaseQueue = this.getQueue(_Global.INT32(cityInfo[_Global.ap+0]));
			if(!queue)
				continue;	//
			var list:Array = queue.GetData();
			for(var mvo:MarchVO in list)
			{
				if(mvo.marchId == mid)
					return mvo;
			}
		}
		return null;
	}
	
	public function isMarchExist(mid:int):boolean
	{
		var mvo:MarchVO;
		for(var i:System.Collections.DictionaryEntry in marchHash)
		{
			mvo = (i.Value as MarchVO);
			if(mvo.marchId == mid)
			{
				return true;
			}
		}
		
		return false;
	}
	
	public function isSurveyOpen():boolean
	{
		if(seed["openSurvey"])
			return seed["openSurvey"].Value;
		
		return false;
	}
	
	public function getMarchWithCityId(mid:int, cityId:int):MarchVO
	{
		var queue:BaseQueue = this.getQueue(cityId);
		if(!queue)
			return null;	//
		var list:Array = queue.GetData();
		for(var mvo:MarchVO in list)
		{
			if(mvo.marchId == mid)
				return mvo;
		}
		return null;
	}
	
	public function updateMarchQueueItem(mid:int, cityId:int,item:MarchVO):void
	{
		var queue:BaseQueue = this.getQueue(cityId);
		if(!queue)
			return;	//
		var list:Array = queue.GetData();
		for(var i:int = 0; i<list.length;i++)
		{
			var mvo:MarchVO = list[i] as MarchVO;
			if(mvo.marchId == mid)
				list[i] = item;
		}

	}
	
	public function itemCountInSurveyList(itemId:int):int
	{
		var sum:int = 0;
		var mvo:MarchVO;
		for(var i:System.Collections.DictionaryEntry in marchHash)
		{
			mvo = (i.Value as MarchVO);
			if(!mvo.isOpenedReward && mvo.surveyRewardId == itemId)
			{
				sum++;
			}
		}
		return sum;
	}
	
	public function addItemstoInventory(tileId:int):int
	{
		var mvo:MarchVO;
		for(var i:System.Collections.DictionaryEntry in marchHash)
		{
			mvo = (i.Value as MarchVO);
			if(mvo.marchType == Constant.MarchType.SURVEY && mvo.toTileId == tileId && (mvo.marchStatus == Constant.MarchStatus.DEFENDING ||mvo.marchStatus ==Constant.MarchStatus.RETURNING)&& mvo.surveyRewardId !=0)
			{
				mvo.isOpenedReward = true;
				seed["outgoing_marches"]["c"+mvo.fromCityId]["m"+mvo.marchId]["surveyStatus"].Value = 0;
				MyItems.instance().updateTreasureChest();			
			}
		}
	}
	
	public function openSurveyRewardDone(marchId:int, cityId:int):void
	{
		var sum:int = 0;
		var mvo:MarchVO;
		for(var i:System.Collections.DictionaryEntry in marchHash)
		{
			mvo = (i.Value as MarchVO);
			if(mvo.fromCityId == cityId && mvo.marchId == marchId && !mvo.isOpenedReward)
			{
				mvo.isOpenedReward = true;
				seed["outgoing_marches"]["c"+mvo.fromCityId]["m"+mvo.marchId]["surveyStatus"].Value = 0;
				mvo.marchType = Constant.MarchType.SURVEY;
			}
		}
	}
	
	public	function startSurvey(mvo:MarchVO, marchId :int, type:int, cityId:int, errorFunc:Function) 
	{	
		var reqVAR:Hashtable = {};
		
		reqVAR["xcoord"] = "" + mvo.toXCoord;
		reqVAR["ycoord"] = "" + mvo.toYCoord;
		
		reqVAR["tileid"] = "" + mvo.toTileId;
		reqVAR["kid"] = "" + mvo.knightId;
		reqVAR["cid"] = "" + cityId;
		reqVAR["mid"] = "" + marchId;
	
		var params : Array = new Array();
		params.Add( cityId );
		params.Add( marchId );
		var okFunc:Function = function(result:HashObject){
					
			var marchtime:long;
			var	ut = GameMain.unixtime();
			var marchObj:HashObject = seed["outgoing_marches"]["c" + cityId]["m" + marchId];
			
			if (result != null && result["error_code"] == null) 	//
			{
				marchObj["marchType"].Value = _Global.INT32(result["marchType"].Value);
				marchObj["marchStatus"].Value = Constant.MarchStatus.OUTBOUND;
				marchObj["returnUnixTime"].Value = _Global.INT64(result["returnTime"].Value);
				marchObj["destinationUnixTime"].Value = _Global.INT64(result["endTime"].Value);
				marchObj["marchUnixTime"].Value = _Global.INT64(result["startTime"].Value);
				marchObj["surveyStatus"].Value = 0;
				WildernessMgr.instance().setWilderinSurvey(_Global.INT32(reqVAR["tileid"]),1);
				March.instance().addSeedMarchObj2Mgr(cityId,marchObj) ;				
				//UpdateSeed.instance().update_seed(result["updateSeed"]);
			}
			else if(result != null)
			{
				errorFunc(result);
			}
		};
		
		UnityNet.reqSurvey(reqVAR, okFunc, null );
	}
	
	public	function cancelSurvey(mvo:MarchVO, marchId :int, type:int, cityId:int, errorFunc:Function) 
	{	
		var reqVAR:Hashtable = {};
		
		reqVAR["xcoord"] = "" + mvo.toXCoord;
		reqVAR["ycoord"] = "" + mvo.toYCoord;
		
		reqVAR["tileid"] = "" + mvo.toTileId;
		reqVAR["kid"] = "" + mvo.knightId;
		reqVAR["cid"] = "" + cityId;
		reqVAR["mid"] = "" + marchId;

	
		var params : Array = new Array();
		params.Add( cityId );
		params.Add( marchId );
		var okFunc:Function = function(result:HashObject){
					
			var marchtime:long;
			var	ut = GameMain.unixtime();
			var marchObj:HashObject = seed["outgoing_marches"]["c" + cityId]["m" + marchId];
			var wvo:WildernessVO = WildernessMgr.instance().getWilderness(_Global.INT32(marchObj["toTileId"].Value));
			wvo.inSurvey = 0;
			
			if (result != null)
			{
				marchObj["marchType"].Value = _Global.INT32(result["marchType"].Value);
				marchObj["marchStatus"].Value = Constant.MarchStatus.DEFENDING;
				March.instance().addSeedMarchObj2Mgr(cityId,marchObj);
				//UpdateSeed.instance().update_seed(result["updateSeed"]);
			}
		};
		
		UnityNet.reqCancelSurvey(reqVAR, okFunc, errorFunc );
	}
	
	public	function openSurveyReward(mvo:MarchVO, marchId :int, type:int, cityId:int, errorFunc:Function) 
	{	
		Treasure.getInstance().openTreasurePopmenu(marchId, cityId, mvo.surveyRewardId, openSurveyRewardDone);
	}
	
	public function addSeedMarchObj2Mgr(cityId:int,smObj:HashObject):MarchVO
	{
		if(!smObj)
			return;
		var mvo = new MarchVO();
		mvo.cityId = cityId;
		mvo.mergeDataFrom(smObj);
		this.add2Queue(mvo,cityId);
	}
	/**
	 queuemgr part...
	**/
	public function queueItemAdded(qItem:QueueItem,qId:int):void
	{	
		var queue:BaseQueue = this.getQueue((qItem as MarchVO).fromCityId);
		if(!queue)
			return;	//
		var list:Array = queue.GetData();
		
		var oldMvo:MarchVO = marchHash[_Global.ap + "_" + qId + "_" + qItem.id];
		var mvo:MarchVO = qItem as MarchVO;
		var addBar:boolean = true;
		//remove waiting for report..

		if(oldMvo == null || _eg)
		{
			addBar = (oldMvo == null);	
			list.push(qItem);
		}
		
		marchHash[_Global.ap + "_" + qId + "_" + qItem.id] = qItem;
		updateMarchQueueItem(qItem.id,(qItem as MarchVO).fromCityId,qItem);
		
		General.instance().setGeneralStatus(qId,mvo.knightId,Constant.GeneralStatus.MARCH);	//for check.			
				
		if(	!_eg && MenuMgr.getInstance().MainChrom.myCurProgressList != null)
		{
			if(oldMvo == null)
			{
				if(addBar && qId == GameMain.instance().getCurCityId() )
				MenuMgr.getInstance().OnStartMarch(qItem);
				
				MenuMgr.getInstance().sendNotification(Constant.Notice.ON_MARCH_OK,null);
			}
			else
				MenuMgr.getInstance().MainChrom.updateMarchProgress(qItem,qItem.id);
		}
	}	
	
	public function queueItemChanged(qItem:QueueItem,qId:int):void
	{
		var mvo:MarchVO = qItem as MarchVO;
		//集结时间到 等待服务器发march //keep in ProgressSlot.
		if((mvo.marchType == Constant.MarchType.RALLY_ATTACK || mvo.marchType == Constant.MarchType.JION_RALLY_ATTACK) && 
				(mvo.marchStatus == Constant.MarchStatus.RALLY_WAITING || mvo.marchStatus == Constant.MarchStatus.RALLYING))
		{
			mvo.marchStatus = Constant.MarchStatus.CLIENT_RALLY_WAIT;
			mvo.calcRemainingTime();
		}
	}

	public function queueItemRemoved(qItem:QueueItem,qId:int):void
	{
		//update ......
//		var queue:BaseQueue = this.getQueue(GameMain.instance().getCurCityId());
//		if(!queue)
//			return;	//
//		var list:Array = queue.GetData();
		
		var mvo:MarchVO = qItem as MarchVO;
		
		removeRallyMarchDic(mvo);
		
		var oldMvo:MarchVO = marchHash[_Global.ap + "_" + qId + "_" + qItem.id];	
		
		if(mvo.marchStatus == Constant.MarchStatus.DELETED)
		{
			return;
		}
		if(mvo.marchStatus == 0)	//not really added before.
		{
			if(oldMvo)
			{
				oldMvo.marchStatus = Constant.MarchStatus.INACTIVE;	//force remove from ProgressBar List.
				
				General.instance().setGeneralStatus(qId,mvo.knightId,Constant.GeneralStatus.IDLE);
				
				marchHash.Remove(_Global.ap + "_" + qId + "_" + qItem.id);		
				
				if(oldMvo == mvo)
					return;
			}
		}
		else if(mvo.marchType == Constant.MarchType.PVE || mvo.marchType == Constant.MarchType.ALLIANCEBOSS)
		{
			mvo.marchStatus = Constant.MarchStatus.DELETED;
			marchHash.Remove(_Global.ap + "_" + qId + "_" + mvo.id);
			var queue:BaseQueue = this.getQueue(qId);
			queue.cancelItem(mvo);
		}
		else if(mvo.marchStatus == Constant.MarchStatus.OUTBOUND)
		{
			mvo.marchStatus = Constant.MarchStatus.WAITING_FOR_REPORT;
			mvo.calcRemainingTime();	//removed form March but keep in ProgressSlot.
			switch(mvo.marchType)
			{
			
				case Constant.MarchType.TRANSPORT:
					mvo.titleStr = Datas.getArString("March.WaitForReportTransport");	
					break;
				case Constant.MarchType.COLLECT:
				case Constant.MarchType.COLLECT_RESOURCE:
//					mvo.titleStr = Datas.getArString("Newresource.march_gathering");	
					mvo.marchStatus = Constant.MarchStatus.DEFENDING;
					break;
				case Constant.MarchType.REINFORCE:
					mvo.titleStr = Datas.getArString("March.WaitForReportReforince");	
					break;
				case Constant.MarchType.REASSIGN:
					mvo.titleStr = Datas.getArString("March.WaitForReportReassign");	
					break;
				case Constant.MarchType.SURVEY:
					mvo.titleStr = Datas.getArString("MainChrome.Loadingddd");	
					break;
				default:
					mvo.titleStr = Datas.getArString("March.WaitForReport");
					break;
			}
			
		
		}
		
		if(mvo.marchStatus != 0)	//not init or returned value of updateseed.
			//UpdateSeed.instance().update_seed_ajax(true,syncSeedLoaded);
			GameMain.instance().dealyCallUpdateSeed(2);
		//changed it to waiting for report..	
		
		if(mvo.marchStatus == Constant.MarchStatus.RETURNING 
			|| mvo.marchStatus == Constant.MarchStatus.SITUATION_CHANGED
			|| (oldMvo != null && oldMvo.marchStatus == Constant.MarchStatus.WAITING_FOR_REPORT && mvo.marchStatus == 0 ) 
			|| mvo.marchType == Constant.MarchType.PVE || mvo.marchType == Constant.MarchType.ALLIANCEBOSS )
		{		
			//the troop return of pve is by update seed. when restart game,the unitReturnHash of mvo do not need.
			if(mvo.marchType != Constant.MarchType.PVE && mvo.marchType != Constant.MarchType.ALLIANCEBOSS)
			{
				var num:int;				
				for(var i:int = 0 ; i < Constant.MAXUNITID; i++)
				{				
					if(mvo.unitReturnHash[_Global.ap + i] == null )			//count:before battle. return: alived after battle		
						continue;				
					num = mvo.unitReturnHash[_Global.ap + i];															
					if(num > 0)
						Barracks.instance().addUnitsToSeed(i,num);
				}
			}
			
			General.instance().setGeneralStatus(qId, mvo.knightId,Constant.GeneralStatus.IDLE);	//for check.			
			Barracks.instance().UpadateAllTroop();		
		}	
			
		
		if(mvo.marchType == Constant.MarchType.ATTACK && (mvo.marchType == Constant.MarchType.COLLECT || mvo.marchType == Constant.MarchType.COLLECT_RESOURCE) && mvo.marchStatus != Constant.MarchStatus.RETURNING && mvo.marchStatus != Constant.MarchStatus.SITUATION_CHANGED)
		{
			//---------------------------------// zhou wei
			UpdateSeed.instance().followCheckQuestForMarch(2);
			//---------------------------------//
		}	
		if(mvo.marchStatus == 0 && (mvo.marchType ==Constant.MarchType.COLLECT || mvo.marchType ==Constant.MarchType.COLLECT_RESOURCE)){
			MyItems.instance().AddCarmotLootItem(mvo.marchId);
		}
		// if( mvo.marchType ==Constant.MarchType.COLLECT){
		// 	var mp:MapController = GameMain.instance().getMapController();
		// 	if( mp ){
		// 		mp.getTilesResourceStatesInfoDic(false);
		// 	}
		// }
		
						
		MenuMgr.getInstance().sendNotification(Constant.Notice.MARCH_ITEM_REMOVED,mvo);
		if(WorldBossController.singleton!=null)
        WorldBossController.singleton.SetBossState(mvo.toXCoord,mvo.toYCoord,
        	Constant.WorldBossAnimationState.normal,
        	Constant.WorldBOssAnimationAction.attack,
        	Constant.WorldBossAnimationPar.frontalAttack
        	);
	}
	
	public function creatQueueClass(qId:int):BaseQueue
	{
		var q:BaseQueue = super.creatQueueClass(qId);		
//		q.setMaxItemNum(10); // no limit of queue capacity. limit user's march action.
		return q;
	}
	
	public function updateQueue():void
	{
		var	cities:HashObject = seed["cities"];
		var cityInfo:HashObject;
		for(var i:int = 0;i < GameMain.instance().getCitiesNumber();i++)
		{
			cityInfo = cities[_Global.ap+i];			
			updateMarchQueueByCityId(_Global.INT32(cityInfo[_Global.ap+0]));
		}
	}
	
	public function checkMySelfRallyMarchIsReturn(marchs : System.Collections.Generic.List.<PBMsgMarchInfo.PBMsgMarchInfo>)
	{
		var queue:BaseQueue = this.getQueue(GameMain.instance().getCurCityId());
		if(!queue)
			return;	//
		var list:Array = queue.GetData();
		for(var mvo:MarchVO in list)
		{
			if(!(mvo.marchType == Constant.MarchType.RALLY_ATTACK || mvo.marchType == Constant.MarchType.JION_RALLY_ATTACK))
			{
				continue;
			}
			
			var have : boolean = false;
			for(var i : int = 0; i < marchs.Count; ++i)
			{
				if(mvo.marchId == marchs[i].marchId)
				{
					have = true;
				}
			}
			
			if(!have)
			{
				mvo.marchStatus = Constant.MarchStatus.INACTIVE;
			}
		}
	}
	
	public var rallyMarchDic : Dictionary.<int, PBMsgMarchInfo.PBMsgMarchInfo>;
	public var delayRallyMarchReturn : int = 4;
	public function changeRallyMarchItem(pbMsgMarch : PBMsgMarchInfo.PBMsgMarchInfo):void 
	{
		var marchVo : MarchVO = getMarch(pbMsgMarch.marchId) as MarchVO;
		if(marchVo == null)
		{
			_Global.LogWarning("March.changeRallyMarchItem  Donot have marchId " + pbMsgMarch.marchId + " in marchList!");
			return;
		}
				
		// marchVo.marchStatus == Constant.MarchStatus.RETURNING 等待播放战斗动画
		switch(pbMsgMarch.marchStatus)
		{
			case Constant.MarchStatus.RETURNING :
				if(pbMsgMarch.marchType == Constant.MarchType.RALLY_ATTACK && pbMsgMarch.startTimeStamp == pbMsgMarch.endTimeStamp)
				{// 发起者取消集结
					marchVo.marchStatus = Constant.MarchStatus.INACTIVE;
				}	
				else
				{
					addRallyMarchDic(pbMsgMarch);
					if(marchVo.isFighting && GameMain.unixtime() - marchVo.fightingTime >= delayRallyMarchReturn)
					{
						marchVo.isFighting = false;
		                _Global.LogWarning("rally march return");
		                updateRallyMarchData(marchVo.marchId);	                
					}
				}										
				break;
			
			case Constant.MarchStatus.HALF_RETURN : 
				pbMsgMarch.marchStatus = Constant.MarchStatus.RETURNING;
				addRallyMarchDic(pbMsgMarch);
				updateRallyMarchData(pbMsgMarch.marchId);
				break;
			
			default:
				addRallyMarchDic(pbMsgMarch);
				updateRallyMarchData(pbMsgMarch.marchId);	
		}	
	}
	
	private function addRallyMarchDic(pbMarch : PBMsgMarchInfo.PBMsgMarchInfo)
	{
		if(rallyMarchDic.ContainsKey(pbMarch.marchId))
		{
			rallyMarchDic[pbMarch.marchId] = pbMarch;
		}
		else
		{
			rallyMarchDic.Add(pbMarch.marchId, pbMarch);
		}
	}
	
	private function removeRallyMarchDic(marchVo : MarchVO)
	{
		if(marchVo.marchStatus == Constant.MarchStatus.RETURNING 
		&& (marchVo.marchType == Constant.MarchType.RALLY_ATTACK || marchVo.marchType == Constant.MarchType.JION_RALLY_ATTACK))
		{
			if(rallyMarchDic.ContainsKey(marchVo.marchId))
			{
				rallyMarchDic.Remove(marchVo.marchId);
				_Global.LogWarning("March.removeRallyMarchDic marchId " + marchVo.marchId);	
			}
		}
	}
	
	private function getRallyMarchById(marchId : int) : PBMsgMarchInfo.PBMsgMarchInfo
	{
		if(rallyMarchDic.ContainsKey(marchId))
		{
			return rallyMarchDic[marchId];
		}
		
		_Global.LogWarning("March.getRallyMarchById  Donot have marchId " + marchId + " in rallyMarchDic!");	
		return null;
	}
	
	private function checkRallyMarchBattleAnimStatus(mvo : MarchVO)
	{
//		_Global.LogWarning("checkRallyMarchBattleAnimStatus statut : " + mvo.marchStatus + " GameMain.unixtime : " 
//		+ GameMain.unixtime() + " mvo.fightingTime : " + mvo.fightingTime + " mvo.isFighting : " + mvo.isFighting);
	    //rally march return 等待播放战斗动画
        if(mvo.isFighting && GameMain.unixtime() - mvo.fightingTime >= delayRallyMarchReturn && mvo.marchStatus == Constant.MarchStatus.WAITING_FOR_REPORT 
        && (mvo.marchType == Constant.MarchType.RALLY_ATTACK || mvo.marchType == Constant.MarchType.JION_RALLY_ATTACK))
        {
            // todo  rally march return
            var pbRallyMarch : PBMsgMarchInfo.PBMsgMarchInfo = getRallyMarchById(mvo.marchId);
            //_Global.LogWarning("checkRallyMarchBattleAnimStatus pbRallyMarch : " + pbRallyMarch.marchStatus);
            if(pbRallyMarch != null && pbRallyMarch.marchStatus == Constant.MarchStatus.RETURNING 
            && (pbRallyMarch.marchType == Constant.MarchType.RALLY_ATTACK || pbRallyMarch.marchType == Constant.MarchType.JION_RALLY_ATTACK))
            {
                mvo.isFighting = false;
                _Global.LogWarning("rally march return 等待播放战斗动画");
                updateRallyMarchData(mvo.marchId);
            }
        }
	}
	
	private function updateRallyMarchData(marchId : int)
	{
		var pbMsgMarch : PBMsgMarchInfo.PBMsgMarchInfo = getRallyMarchById(marchId);
		if(pbMsgMarch != null)
		{
			var marchVo : MarchVO = getMarch(pbMsgMarch.marchId) as MarchVO;
			if(marchVo == null)
			{
				_Global.LogWarning("March.changeRallyMarchItem  Donot have marchId " + pbMsgMarch.marchId + " in marchList!");
				return;
			}
			
			var ut : long = GameMain.instance().unixtime();
			marchVo.rallyId = pbMsgMarch.rallyId;
			marchVo.startTime = marchVo.marchUnixTime = pbMsgMarch.startTimeStamp;
			marchVo.endTime = marchVo.destinationUnixTime = pbMsgMarch.endTimeStamp;
			marchVo.returnUnixTime = ut + 2 * (pbMsgMarch.endTimeStamp - pbMsgMarch.startTimeStamp);//ut + timediff + (ut + timediff - ut)
			marchVo.timeRemaining = marchVo.endTime - marchVo.startTime;
			marchVo.isSocketMarchData = true;
			/////////
			marchVo.toXCoord = pbMsgMarch.toX;
			marchVo.toYCoord = pbMsgMarch.toY;
			marchVo.fromXCoord = pbMsgMarch.fromX;
			marchVo.fromYCoord = pbMsgMarch.fromY;
			
			marchVo.marchType 		= pbMsgMarch.marchType;
			marchVo.marchTypeStr 	= March.getMarchTypeString(marchVo.marchType);
			marchVo.marchStatus 	= pbMsgMarch.marchStatus;
			marchVo.marchStatusStr = March.getMarchStatusString(marchVo.marchStatus);
			marchVo.titleStr = marchVo.marchStatusStr;	
			marchVo.titleStr += " ( " + marchVo.toXCoord + "," + marchVo.toYCoord + ")";
			marchVo.isWinner = pbMsgMarch.isWin;
			
			var speedUp : boolean = ((marchVo.marchType == Constant.MarchType.RALLY_ATTACK && (marchVo.marchStatus == Constant.MarchStatus.OUTBOUND 
			|| marchVo.marchStatus == Constant.MarchStatus.RETURNING)) || (marchVo.marchType == Constant.MarchType.JION_RALLY_ATTACK 
			&& (marchVo.marchStatus == Constant.MarchStatus.RALLYING || marchVo.marchStatus == Constant.MarchStatus.RETURNING)));
			marchVo.showSpeedUp = speedUp;

			var extra : boolean = (marchVo.marchType == Constant.MarchType.RALLY_ATTACK && (marchVo.marchStatus == Constant.MarchStatus.RALLY_WAITING
			|| marchVo.marchStatus == Constant.MarchStatus.RALLYING));
			marchVo.showExtraButton = extra;
			marchVo.showTime = true;
			
//			_Global.LogWarning("March.updateRallyMarchData  marchId : " + marchId + " marchStatus : " + marchVo.marchStatus 
//			+ " startTime : " + marchVo.startTime + " endTime : " + marchVo.endTime);	
			//var cityId : int = GameMain.instance().getCurCityId();
			//updateMarchQueueItem(marchVo.marchId ,cityId, marchVo);
			MenuMgr.getInstance().MainChrom.updateMarchProgress(marchVo, marchVo.marchId);
		}	
	}
	
	private function updateMarchQueueByCityId(cityid:int):void
	{
		var queue:BaseQueue = this.getQueue(cityid);
		if(!queue)
			return;
			
		var i:int;
		var qItem : QueueItem;
		var queueList:Array = queue.itemList;
		var avaStatus = GameMain.Ava.Event.CurStatus;
        var shouldRemoveDeploy:boolean = (
            avaStatus != AvaEvent.AvaStatus.Prepare &&
            avaStatus != AvaEvent.AvaStatus.Match &&
            avaStatus != AvaEvent.AvaStatus.Frozen &&
            avaStatus != AvaEvent.AvaStatus.Combat );
		
		for(i=0; i<queueList.length; i++)
		{
			qItem = queueList[i];
			var mvo:MarchVO = qItem as MarchVO;
			var t:long = qItem.timeRemaining;
			
			if (mvo != null && mvo.marchType == Constant.MarchType.AVA_SENDTROOP && shouldRemoveDeploy)
			{
				mvo.timeRemaining = 0;
				mvo.marchStatus = Constant.MarchStatus.INACTIVE;
                if (null != mvo.rawData && null != mvo.rawData["marchStatus"])
                    mvo.rawData["marchStatus"].Value = Constant.MarchStatus.INACTIVE;
			}
			
			checkRallyMarchBattleAnimStatus(mvo);
			
			if(qItem.timeRemaining > 0)// && mvo.marchStatus != Constant.MarchStatus.WAITING_FOR_REPORT
			{
				qItem.calcRemainingTime();				
			}
			else
			{
				if(qItem.classType == QueueType.MarchQueue)
				{
					
					if(mvo.marchStatus == Constant.MarchStatus.INACTIVE ||
						mvo.marchStatus == Constant.MarchStatus.RETURNING ||
						mvo.marchStatus == Constant.MarchStatus.SITUATION_CHANGED)
					{
						queueList.RemoveAt(i);
					}
				}
				if((mvo.marchType == Constant.MarchType.RALLY_ATTACK || mvo.marchType == Constant.MarchType.JION_RALLY_ATTACK) && 
				(mvo.marchStatus == Constant.MarchStatus.RALLY_WAITING || mvo.marchStatus == Constant.MarchStatus.RALLYING))
				{
					queue.queueMgr.queueItemChanged(qItem,queue.queueId);
				}
				else
				{
					queue.queueMgr.queueItemRemoved(qItem,queue.queueId);
				}				
			}
		}
	}
	
	public function add2Queue(qItem:QueueItem,qId:int):boolean
	{
		var q:BaseQueue = this.getAndCreatQueue(qId);
		return q.addItem(qItem,false);
	}
	
	public function addPveQueueItem()
	{	
		var pveMarchData:KBN.PveMarchData = KBN.PveController.instance().GetPveMarchInfo() as KBN.PveMarchData;
		pveQueItem = new MarchVO();
		//var pveQueItem = new QueueItem();
		pveQueItem.NIDX = MarchVO.NID++;
		pveQueItem.fromCityId = pveQueItem.cityId = pveMarchData.cityID;
		pveQueItem.classType = QueueType.MarchQueue; 
		
		pveQueItem.startTime = pveQueItem.marchUnixTime = pveMarchData.marchTime;
		pveQueItem.endTime = pveQueItem.destinationUnixTime = pveMarchData.marchEndTime;		
		//pveQueItem.returnUnixTime = pveQueItem.this.getLong("returnUnixTime");
		pveQueItem.id = pveQueItem.marchId = pveMarchData.marchID;
		pveQueItem.marchStatus = Constant.MarchStatus.OUTBOUND;
		
		if(pveMarchData.isAllianceBoss)
			pveQueItem.marchType = Constant.MarchType.ALLIANCEBOSS;
		else
			pveQueItem.marchType = Constant.MarchType.PVE;
		
		pveQueItem.marchStatusStr = pveQueItem.itemName = Datas.getArString("Campaign.CampaignTitle");// "Campaign";
		pveQueItem.showSpeedUp = true;
		pveQueItem.fromXCoord = pveQueItem.toXCoord = pveQueItem.fromYCoord = pveQueItem.toYCoord = -1;
		
		pveQueItem.knightId	= pveMarchData.knightId;
		pveQueItem.knightName = General.instance().getOriginalKnightName(pveMarchData.knightId);
			
		pveQueItem.knightShowName = General.singleton.getKnightShowName(pveQueItem.knightName, GameMain.instance().getCurCityOrder());	
			
		add2Queue(pveQueItem,pveMarchData.cityID);

	}
	
	public function addPveQueueItem(cityId:int,smObj:HashObject, marchType:int)
	{	
		if(!smObj)
			return;
		var endTime:long = _Global.INT64(smObj["destinationUnixTime"]);
		if(endTime <= GameMain.unixtime())
			return;
		
		pveQueItem = new MarchVO();
		//var pveQueItem = new QueueItem();
		pveQueItem.NIDX = MarchVO.NID++;
		pveQueItem.fromCityId = pveQueItem.cityId = cityId;
		pveQueItem.classType = QueueType.MarchQueue; 
		
		pveQueItem.startTime = pveQueItem.marchUnixTime = _Global.INT64(smObj["marchUnixTime"]);
		pveQueItem.endTime = pveQueItem.destinationUnixTime = endTime;	
		//pveQueItem.returnUnixTime = pveQueItem.this.getLong("returnUnixTime");
		pveQueItem.id = pveQueItem.marchId = _Global.INT32(smObj["marchId"]);
		pveQueItem.marchStatus = Constant.MarchStatus.OUTBOUND;
		
		pveQueItem.marchType = marchType;
		
		pveQueItem.marchStatusStr = pveQueItem.itemName = Datas.getArString("Campaign.CampaignTitle");// "Campaign";
		pveQueItem.showSpeedUp = true;
		pveQueItem.fromXCoord = pveQueItem.toXCoord = pveQueItem.fromYCoord = pveQueItem.toYCoord = -1;
		
		pveQueItem.knightId	= _Global.INT32(smObj["knightId"]);
		pveQueItem.knightName = General.instance().getOriginalKnightName(pveQueItem.knightId);
			
		pveQueItem.knightShowName = General.singleton.getKnightShowName(pveQueItem.knightName, GameMain.instance().getCurCityOrder());	
			
		add2Queue(pveQueItem,cityId);

	}
	
	public function getPveQueItem():MarchVO
	{
		return pveQueItem;
	}
	
	///////end queueMgr part ../////////



	/////function for update_seed////////
	
	public function syncSeedMarch(cityId:int,marchId:int):void
	{		
		setMarchReturn(cityId,marchId);
	}
	
	public function setMarchReturn(cityId:int,marchId:int):void
	{
		var smObj:HashObject = seed["outgoing_marches"]["c" + cityId]["m" + marchId];
		var marchType:int = _Global.INT32(smObj["marchType"]);
		if(marchType != Constant.MarchType.PVE && marchType != Constant.MarchType.ALLIANCEBOSS)
			addSeedMarchObj2Mgr(cityId,smObj);
	}	
	public function updateMarchVOReturn(cityId:int, marchId:int, unitIdStr:String,num:Object):void
	{
		var un:int = _Global.INT32(num);
		var mvo:MarchVO = marchHash[_Global.ap + "_" + cityId + "_" + marchId] as MarchVO;	//_global.ap_{cityID}_{marchId};
		if(!mvo) return;
		mvo.setUnitReturn(unitIdStr,un);	
	}
	
	//end  for update_seed..////////		
					
	public function getMarchListByFilter(func:Function):Array
	{
		var list:Array = new Array();
		for(var i:System.Collections.DictionaryEntry in marchHash)
		{
			if(!func || func(i.Value) )
				list.push(i.Value);
		}
		return list;
	}
	
	public function getMarchListByFilter(list:Array, func:Function):Array
	{
		for(var i:System.Collections.DictionaryEntry in marchHash)
		{
			if(!func || func(i.Value) )
				list.push(i.Value);
		}
		return list;
	}
	
	public function getMarchId(cityId:int):int
	{
		var id:int;
		var obj:Hashtable;
		if(seed["outgoing_marches"] == null || seed["outgoing_marches"]["c" + cityId] == null)
		{
			return 0;
		}
		obj = seed["outgoing_marches"]["c" + cityId].Table;
		if(obj == null)
		{
			return 0;
		}
		for(var i:System.Collections.DictionaryEntry in obj)
		{
			if(i == null || i.Value == null || (i.Value as HashObject)["marchStatus"] == null || (i.Value as HashObject)["marchId"] == null)
			{				
//				_Global.Log("Invalid seed Data");
				continue;
			}
			
			if( _Global.INT32((i.Value as HashObject)["marchStatus"]) == Constant.MarchStatus.INACTIVE ){
					(i.Value as HashObject)["marchStatus"].Value="1";
				return _Global.INT32((i.Value as HashObject)["marchId"]);
			}
				
		}
		return 0;
	}
	//获取all可用的March id
	public function getAvaliableMarchIds(cityId:int):Array
	{
		var id:int;
		var obj:Hashtable;
		var marchIds:Array = new Array();
		if(seed["outgoing_marches"] == null || seed["outgoing_marches"]["c" + cityId] == null)
		{
			return marchIds;
		}
		obj = seed["outgoing_marches"]["c" + cityId].Table;
		if(obj == null)
		{
			return marchIds;
		}
		for(var i:System.Collections.DictionaryEntry in obj)
		{
			if(i == null || i.Value == null || (i.Value as HashObject)["marchStatus"] == null || (i.Value as HashObject)["marchId"] == null)
			{				
//				_Global.Log("Invalid seed Data");
				continue;
			}
			
			if( _Global.INT32((i.Value as HashObject)["marchStatus"]) == Constant.MarchStatus.INACTIVE ){
					marchIds.push(_Global.INT32((i.Value as HashObject)["marchId"]));
				
			}
				
		}
		return marchIds;
	}
	
	public function  executeMarch(reqVAR:Object,okFunc:Function):void	
	{
		var okFunction = function(result:HashObject)
		{
			var buffItems:String = _Global.GetString(result["buffItems"]);
			if (!String.IsNullOrEmpty(buffItems))
			{
				var items = buffItems.Split(","[0]);
				for (var i:int = 0; i < items.Length; i++)
				{
					var id:int = _Global.INT32(items[i]);
					if (id > 0) {
						MyItems.instance().subtractItem(id);
					}
				}
			}
			
			//detail data ....
			var a:Hashtable = reqVAR as Hashtable;
			if( a["type"] != null && a["type"] == ""+Constant.MarchType.TRANSPORT ) {
				SoundMgr.instance().PlayEffect( "kbn tournament 2.2 marching special", "Audio/Pvp/");
			} else {
				SoundMgr.instance().PlayEffect( "kbn tournament 2.1 marching", "Audio/Pvp/");
			}
            
            CheckDailyQuest(reqVAR as Hashtable);

			if(okFunc != null)
				okFunc(result);			
			
		};
		UnityNet.reqExecuteMarch(reqVAR,okFunction,null);
		
		
		
	}
    
    private function CheckDailyQuest(marchRequestDict : Hashtable)
    {
        if (marchRequestDict == null)
        {
            return;
        }
        
        var marchType : int = _Global.INT32(marchRequestDict["type"]);
        var allianceRequestId : int = _Global.INT32(marchRequestDict["alRequestId"]);
        if (allianceRequestId > 0)
        {
            DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.AllianceMarchHelp, marchType);
        }
    }
	
	//this method willnot add to Queue./should merge reosurce/troop infos and then call addSeedMarchObj2Mgr.
	public	function	addToSeed(marchid:String, start:long, eta:long, xcoord:String, ycoord:String,type:String,
									kid:String, tid:String, ttype:String, tlevel:String, surveyStatus:int, rallyId:int, worldBossId:int):Object
	{
		addToSeed(marchid,start,eta,xcoord,ycoord,type,kid,tid,ttype,tlevel,surveyStatus,Constant.MarchStatus.OUTBOUND,rallyId,worldBossId);
	}
	
	public function addToSeed(marchid:String, start:long, eta:long, xcoord:String, ycoord:String,type:String,
									kid:String, tid:String, ttype:String, tlevel:String, surveyStatus:int,marchStatus:int,rallyId:int,worldBossId:int):Object
	{
		var currentcityid:int = GameMain.instance().getCurCityId();
		var atkobj = new HashObject({
				"marchId":marchid,
				"destinationUnixTime": eta,
				"marchUnixTime": start,
				"returnUnixTime": eta + (eta - start),
				"toXCoord": xcoord,
				"toYCoord": ycoord,
				"marchType": type,
				"knightId": kid,
				"fromCityId":currentcityid,
				"marchStatus": marchStatus,
				"surveyStatus": surveyStatus,
				"rallyId": rallyId,
				"worldBossId": worldBossId
//				"gold": resources[0]
			});
		if (tid) {
			atkobj["toTileId"]  = new HashObject( tid );
			atkobj["toTileType"] = new HashObject( ttype);
			atkobj["toTileLevel"] = new HashObject( tlevel);
		}

		var nKID:int = _Global.INT32(kid);
		if(nKID > 0)
		{
			General.instance().setGeneralStatus(currentcityid,nKID,Constant.GeneralStatus.MARCH);
		}
		
		
		seed["outgoing_marches"]["c" + currentcityid]["m" + marchid] = atkobj;			
		return atkobj;
	}
	
	public function getTroopMax(cityId:int,knight:Knight,isAvaDeploy:boolean):long
	{
		var knightTroop:int = 0;
		var deployAdditive:int = 0;
		if(knight != null)
			knightTroop = GearManager.Instance().GetKnightTroop(knight);
		var curLevel:int = Building.instance().getMaxLevelForType(Constant.Building.RALLY_SPOT,cityId);
		
		var buffValue:BuffValue = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Limit, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));
		
		var marchSizeBuff:int = (GameMain.unixtime() < _Global.INT64(seed["bonus"]["bC410"][_Global.ap + 1].Value)) ? _Global.INT32(seed["bonus"]["bC410"][_Global.ap + 0].Value) : 0;
		
		//var suitTroopBuff:int = Calculate(GearData.Instance().CurrentKnight.Arms);
//		var suitTroopBuff:int = 0;
//		if(knight != null)
//		suitTroopBuff= Calculate(knight.Arms);
//		suitTroopBuff = GearManager.Instance().GetKnightTroop(knight);
		if (isAvaDeploy)
		{
			var seed:HashObject = GameMain.instance().getSeed();
			if (null != seed && null != seed["avaBarrackEffect"])
				deployAdditive = _Global.INT32(seed["avaBarrackEffect"]);
		}
		
		var techBuff : int = Technology.instance().getAddMarchCount();
		
		return GameMain.GdsManager.GetGds.<GDS_Building>().getBuildingEffect(Constant.Building.RALLY_SPOT,curLevel,Constant.BuildingEffectType.EFFECT_TYPE_MARCH_TROOP_LIMIT) * ( 1 + buffValue.Percentage )  + buffValue.Number + marchSizeBuff + knightTroop + deployAdditive + techBuff;
	}
	/*
	function Calculate(arms:Arm[]):int
	{
		var suitCount:int=0;
		var currentArm:Arm = null;
		for(var arm:Arm in arms)
		{
			if(arm == null) continue;
			if(arm.Threesetattribute!=String.Empty)
			{
				suitCount++;
				currentArm=arm;
			}
		}
		return CalculateSuit(suitCount,currentArm);
	}
	function CalculateSuit( _suitCount:int, _arm:Arm):int
	{
	
		if (_suitCount > 4) 
			{
				if(_arm.Fivesetattribute.Contains(":"))
				{
					return SetSuitTwoAttibute(_arm.Fivesetattribute);	
				}
				else
				{
					return SetSuitOneAttibute(_arm.Fivesetattribute);	
				}
			}else if (_suitCount > 2) 
			{
				if(_arm.Threesetattribute.Contains(":"))
				{
					return SetSuitTwoAttibute(_arm.Threesetattribute);	
				}
				else
				{
					return SetSuitOneAttibute(_arm.Threesetattribute);	
				}
			}

			
	}
	function SetSuitOneAttibute(currentArm:String):int
	{
		if(currentArm.Split('_'[0])[0]=="3")
		{
			return _Global.INT32(currentArm.Split('_'[0])[1]);
			
		}
		else
		{
			return 0;
		}
	}
	
	function SetSuitTwoAttibute(currentArm:String):int
	{
		var oneAttribute:String=currentArm.Split(":"[0])[0];//1_5000
		var twoAttribute:String=currentArm.Split(":"[0])[1];//4_7000
		if(oneAttribute.Split('_'[0])[0]=="3")
		{
			return _Global.INT32(oneAttribute.Split('_'[0])[1]);
		}
		else if(twoAttribute.Split('_'[0])[0]=="3")
		{
			return _Global.INT32(twoAttribute.Split('_'[0])[1]);
		}
		else
		{
		return 0;
			
		}
	}
	*/
	protected function syncSeedLoaded():void
	{
//		this.init(this.seed);
	}
	
	//static functions ..
	public static function getMarchTypeString(type:int):String
	{
		var arStrings:Datas = Datas.instance();
		var marchType:String;
		switch (type)
		{
			case Constant.MarchType.TRANSPORT:
				marchType = arStrings.getArString("Common.Transport");
				break;
			case Constant.MarchType.REINFORCE:
				marchType = arStrings.getArString("Common.Reinforce");
				break;
			case Constant.MarchType.SCOUT:
				marchType = arStrings.getArString("Common.Scout");
				break;
			case Constant.MarchType.ATTACK:
			case Constant.MarchType.PVP:
				marchType = arStrings.getArString("Common.Attack");
				break;
			case Constant.MarchType.COLLECT:
				marchType = arStrings.getArString("Newresource.tile_button_gather");
				break;
			case Constant.MarchType.COLLECT_RESOURCE:
				marchType = arStrings.getArString("Newresource.CollectButton");
				break;
			case Constant.MarchType.REASSIGN:
				marchType = arStrings.getArString("Common.Reassign");
				break;
			case Constant.MarchType.SURVEY:
				marchType = arStrings.getArString("Common.SurveyBtn");	
				break;
			case Constant.MarchType.RALLY_ATTACK:
				marchType = arStrings.getArString("WarHall.Rallying");	
				break;
			case Constant.MarchType.PVE:
			case Constant.MarchType.ALLIANCEBOSS:
				marchType = arStrings.getArString("Campaign.CampaignTitle");	
			
				break;
			}
		return marchType;
	}
	public static function getMarchStatusString(status:int):String
	{
		var arStrings:Datas = Datas.instance();
		var marchStatus:String;
		switch (status) 
		{
			case Constant.MarchStatus.OUTBOUND:
				marchStatus = arStrings.getArString("Common.Marching");
				break;
			case Constant.MarchStatus.DEFENDING:
				marchStatus = arStrings.getArString("Common.Defending");
				break;
			case Constant.MarchStatus.WAITING_FOR_REPORT:
				marchStatus = arStrings.getArString("March.WaitForReport");
			case Constant.MarchStatus.RETURNING:
			case Constant.MarchStatus.SITUATION_CHANGED:
				marchStatus = arStrings.getArString("Common.Returning");
				break;
			case Constant.MarchStatus.ABORTING:
				marchStatus = arStrings.getArString("Common.Aborting");
				break;
			case Constant.MarchStatus.RALLYING:
				marchStatus = arStrings.getArString("WarHall.Rallying");
				break;
			case Constant.MarchStatus.RALLY_WAITING:
				marchStatus = arStrings.getArString("WarHall.Waiting");
				break;
			default:
				marchStatus = arStrings.getArString("Common.Undefined");
				break;
		}
		return marchStatus;
	}
	
	public static function getTileTypeString(type:int):String
	{
		var tile:String = "";
		var arStrings:Datas = Datas.instance();

		switch (type) 
		{
			case Constant.TileType.BOG: 
				tile = Datas.getArString("Common.Bog");
				break;
			case Constant.TileType.GRASSLAND: 
				tile = arStrings.getArString("Common.Grassland");
				break;
			case Constant.TileType.LAKE: 
				tile = Datas.getArString("Common.Lake");
				break;
//			case Constant.TileType.RIVER: 
//				tile = Datas.getArString("Common.River");
//				break;
			case Constant.TileType.WOODS: 
				tile = Datas.getArString("Common.Woods");
				break;
			case Constant.TileType.HILLS: 
				tile = Datas.getArString("Common.Hills");
				break;
			case Constant.TileType.MOUNTAIN: 
				tile = Datas.getArString("Common.Mountain");
				break;
			case Constant.TileType.PLAIN: 
				tile = Datas.getArString("Common.Plain");
				break;
			case Constant.TileType.CITY: 
				tile = Datas.getArString("Common.City");
				break;
//			case Constant.TileType.RUIN: 
//				tile = 'Ruin';
//				break;
//			case Constant.TileType.CITY_MIST: 
//				tile = 'City Mist';
//				break;
		}

		return tile;
	}
	
	
	public function surveyError(result:HashObject):void
	{
		var errorCode:int = _Global.INT32(result["error_code"].Value);
		var restart:Function = function()
		{
			//GameMain.instance().restartGame();
			MenuMgr.getInstance().PopMenu("");
		};
		
		var Speedup:Function = function()
		{
			MenuMgr.getInstance().PopMenu("");
			if(errorCode == 900)//tile recovering
			{
				var wvo:WildernessVO = WildernessMgr.instance().getWilderness(_Global.INT32(result["tileid"].Value));
				MenuMgr.getInstance().PushMenu("SpeedUpMenu",wvo, "trans_zoomComp");
			}
			else if(errorCode == 901)
			{
				var mvo:MarchVO = March.instance().getMarchWithCityId(_Global.INT32(result["marchInfo"]["marchId"].Value), _Global.INT32(result["marchInfo"]["cityId"].Value));
				MenuMgr.getInstance().PushMenu("SpeedUpMenu",mvo, "trans_zoomComp");	
			}	
		};

		
		var dialogparam:Hashtable;
		var dialog:EventDoneDialog = MenuMgr.getInstance().getEventDoneDialog();
		dialog.SetExtraLabeTxtColor(FontColor.SmallTitle);
		dialog.extraLabe.image = null;
		
		if(902 == _Global.INT32(result["error_code"].Value))
		{
			dialogparam = {"Msg":Datas.getArString("MessagesModal.SurveyDailyLimit"),
							   //"btnTxt":Datas.getArString("AdditionalCity.Restart"),
							   "isShowCloseButton":true,
							   "btnHandler": restart,
							   "extraLabel":Datas.getArString("Common.Error"),
							   "btnTxt":Datas.getArString("Common.OK_Button"),
							   "isLineShown": true};
			dialog.setLayout(560,420);				   
			dialog.setMsgLayout(54.9,140.2,450,120);
			dialog.setLine1Layout(29,76.4,487.5,17);
			dialog.setLine2Layout(29,405.7,487.5,17);
			dialog.setextraLabeLayout(0,34,560,120);
			MenuMgr.getInstance().PushEventDoneDialog(dialogparam);
		}
		else if(904 == _Global.INT32(result["error_code"].Value))
		{
			dialogparam = {"Msg":Datas.getArString("MessagesModal.CannotSurvey"),
							   //"btnTxt":Datas.getArString("AdditionalCity.Restart"),
							   "isShowCloseButton":true,
							   "btnHandler": restart,
							   "extraLabel":Datas.getArString("Common.Error"),
							   "btnTxt":Datas.getArString("Common.OK_Button"),
							   "isLineShown": true};
			dialog.setLayout(560,420);				   
			dialog.setMsgLayout(54.9,140.2,450,120);
			dialog.setLine1Layout(29,76.4,487.5,17);
			dialog.setLine2Layout(29,405.7,487.5,17);
			dialog.setextraLabeLayout(0,34,560,120);
			MenuMgr.getInstance().PushEventDoneDialog(dialogparam);
		}
		else
		{
			dialog.setLayout(560,420);				   
			dialog.setMsgLayout(60.1,121.1,450,120);
			dialog.setLine1Layout(29,76.4,487.5,17);
			dialog.setLine2Layout(29,405.7,487.5,17);
			dialog.setextraLabeLayout(0,34,560,120);

			if(900 == _Global.INT32(result["error_code"].Value))   						// tile in froze
			{
				dialogparam = {"Msg":Datas.getArString("MessagesModal.TileRecovering"),
							   //"btnTxt":Datas.getArString("AdditionalCity.Restart"),
							   "isShowCloseButton":true,
							   "btnHandler": Speedup,
							   "isLineShown": true,
							   "timeRemainingShown": true,
							   "extraLabel": Datas.getArString("Common.Error"),
							   "extraLabe2": Datas.getArString("Common.TimeRemining"),
							   "btnTxt":Datas.getArString("Common.Speedup"),
							   "timeRemaning": _Global.INT64(result["endTime"].Value)};
							   
				dialog.setextraLabe2Layout(57.8,220.5,556.7,120);
				dialog.settimeRemainingLayout(247.9,223.6,500,120);
				MenuMgr.getInstance().PushEventDoneDialog(dialogparam);
			}
			else if(901 == _Global.INT32(result["error_code"].Value))					//another general is digging
			{
				var mvo:MarchVO = March.instance().getMarchWithCityId(_Global.INT32(result["marchInfo"]["marchId"].Value), _Global.INT32(result["marchInfo"]["cityId"].Value));
				var cityname:String = GameMain.instance().getCityNameById(_Global.INT32(result["marchInfo"]["cityId"].Value));
				var knightName:String = General.singleton.getKnightShowName(General.instance().getKnightNameInTotalCities(mvo.knightId),GameMain.instance().getCityOrderWithCityId(mvo.fromCityId));
				dialogparam = {"Msg":Datas.getArString("Common.General"),//+ " "+ General.getKnightShowName(General.instance().getKnightNameInTotalCities(mvo.knightId),GameMain.instance().getCityOrderWithCityId(mvo.fromCityId))+"  "+Datas.getArString("Common.From")+" "+cityname+"  "+Datas.getArString("MessagesModal.IsSurveying"),
							   //"btnTxt":Datas.getArString("AdditionalCity.Restart"),
							   "isShowCloseButton":true,
							   "btnHandler": Speedup,
							   "isLineShown": true,
							   "timeRemainingShown": true,
							   "extraLabel": Datas.getArString("Common.Error"),
							   "extraLabe2": Datas.getArString("Common.TimeRemining"),
							   "extraLabe3": " "+ knightName,
							   "extraLabe4": "  "+Datas.getArString("Common.From"),
							   "extraLabe5": " " + cityname,
							   "extraLabe6": "  "+Datas.getArString("MessagesModal.IsSurveying"),
							   "btnTxt":Datas.getArString("Common.Speedup"),
							   "timeRemaning": mvo.endTime};
								
				var capital:String = Datas.getArString("Common.General");
				dialog.setMsgLayout(50.1,121.1,450,120);			   
				dialog.setextraLabe2Layout(47.8,222.5,556.7,120);
				dialog.setextraLabe3Layout(capital.Length *12 + 50.1,121.1,556.7,120);
				dialog.setextraLabe4Layout(capital.Length *12 + 50.1+ knightName.Length * 12,121.1,556.7,120);// 376.7
				dialog.setextraLabe5Layout(41.5,156.2,556.7,120);
				dialog.setextraLabe6Layout(cityname.Length * 13 + 41.5,155.8,556.7,120);
				dialog.settimeRemainingLayout(237.9,225.9,500,120);
				MenuMgr.getInstance().PushEventDoneDialog(dialogparam);
			}
			else
			{
				MenuMgr.getInstance().PopMenu("");
				
				var errorMsg:String = result["error_code"].Value == UnityNet.NET_ERROR ? Datas.getArString("Error.Network_error") : UnityNet.localError( result["error_code"].Value, result["msg"].Value, null );
				if( errorMsg != null )
				{
					ErrorMgr.instance().PushError("",errorMsg);
				}
			}
		}
		

		//dialog.setIconLayout(160,43,273,168);
		
		
	}
	
}



class MarchVO extends QueueItem
{
		public static var NID:int = 1;
		public var NIDX:int = 0;
		/**
		public  var id:int;
		public	var	itemType:int;
		public  var itemName:String;
		public 	var cityId:int;
		public	var	startTime:long;
		public	var	endTime:long;
		public	var	needed:int;
		public	var	timeRemaining:long;
		public  var classType:QueueType;
		public	var	level:int;
		**/
		public var marchUnixTime		:long;
		public var destinationUnixTime	:long;
		public var returnUnixTime		:long;
		public var marchId				:int;
		public var fromPlayerId			:int;
		public var fromCityId			:int;
		public var fromAllianceId		:int;	
		public var fromXCoord			:int;
		public var fromYCoord			:int;
		public var toPlayerId			:int;
		public var toCityId				:int;
		public var toTileId				:int;
		public var toAllianceId			:int;
		public var toXCoord			:int;	
		public var toYCoord			:int;
		public var toTileType		:int;
		public var toTileLevel		:int;
		public var marchType		:int;
		public var marchStatus		:int;
		//
		public var marchTypeStr	:String;
		public var marchStatusStr:String;
		public var toTileTypeStr :String;
		
		public var isWinner			:int;
		
		public var marchTimestamp	:String;
		public var destinationEta	:String;
		public var returnEta		:String;
		public var gold				:int;	//resource 0.
		
		public var unitReturnHash:Hashtable = {};		
		public var UnitCountHash:Hashtable = {};
		
		public var resource1	:int;
		public var resource2	:int;
		public var resource3	:int;	//......
		public var resource8	:int;
					
		public var unit0Count	:int;	// ......
		public var unit16Count	:int;
						
		public var unit0Return	:int;	//......
		public var unit16Return	:int;
		public var unitTotalReturn:int;
		
		public var speed		:int;
		public var knightId		:int;
		public var knightCombat			:int;
		public var knightCombatBoostExpiration			:String;
		public var knightLevel					:int;
		public var knightSkillPointsApplied		:int;
		public var fromInformatics				:int;
		public var fromLoadTech					:int;
	
		public var knightName	:String;
		public var knightShowName	:String;
		public var knightTexName :String;
		
		public var surveyRewardId:int;
		public var isOpenedReward:boolean;
	//	add
		public var isActive:boolean = true;
//		public var cityId:int;
		//cache
		public var priv_marchInfo:HashObject;
		
		public var buffs : System.Collections.Generic.List.<int> = null;
		
		//rally march
		public var isSocketMarchData : boolean = false;
		public var isFighting : boolean = false;
		public var fightingTime : int = 0;
		public var rallyId : int = 0;
		public var worldBossId : int = 0;
		
		public function set c_marchInfo(value:HashObject)
		{
			priv_marchInfo = value;
			if (null != value) {
				mergeDataFrom(value["march"]);
			}
		}
		
		public function get c_marchInfo():HashObject
		{
			return priv_marchInfo;
		}

		public function mergeDataFrom(src:HashObject):void
		{
			NIDX = NID++;
			rawData = src;
			var tmp:String;
			var i:int;			
			//QueueItem part.
			this.classType = QueueType.MarchQueue; 
			isSocketMarchData = false;
			startTime = marchUnixTime = this.getLong("marchUnixTime");
			endTime = destinationUnixTime = this.getLong("destinationUnixTime");		
			returnUnixTime = this.getLong("returnUnixTime");
			
			rallyId = this.getInt("rallyId");
			worldBossId = this.getInt("worldBossId");
			id = marchId = this.getInt("marchId");
			/////////
			toXCoord = this.getInt("toXCoord");
			toYCoord = this.getInt("toYCoord");
			
			isActive = (toXCoord !=0 || toYCoord!=0);
			if(!isActive)
				return;
			
			marchType 		= this.getInt("marchType");
			marchTypeStr 	= March.getMarchTypeString(marchType);
			marchStatus 	= this.getInt("marchStatus");			
			if(marchStatus == Constant.MarchStatus.INACTIVE)
			{
				isActive = false;	
//				_Global.Log("<color=#0000ffff>"+"isActive="+isActive+"</color>");
			}						
			
			if(marchStatus == Constant.MarchStatus.RETURNING
				||marchStatus == Constant.MarchStatus.SITUATION_CHANGED)
			{
				startTime = destinationUnixTime;
				endTime = returnUnixTime;
			}
			
			marchStatusStr = March.getMarchStatusString(marchStatus);
			this.titleStr = marchStatusStr;
			
			
//			this.marchUnixTime 			= this.getLong("marchUnixTime");
//			this.destinationUnixTime 	= this.getLong("destinationUnixTime");
//			this.returnUnixTime 		= this.getLong("returnUnixTime");
//			this.marchId 				= this.getInt("marchId");
			this.fromPlayerId 			= this.getInt("fromPlayerId");
			this.fromCityId				= this.getInt("fromCityId");
			this.fromAllianceId 		= this.getInt("fromAllianceId");
			this.fromXCoord 		= this.getInt("fromXCoord");
			this.fromYCoord 		= this.getInt("fromYCoord");
			this.toPlayerId 		= this.getInt("toPlayerId");
			this.toCityId 			= this.getInt("toCityId");
			this.toTileId 			= this.getInt("toTileId");
			this.toAllianceId 		= this.getInt("toAllianceId");
			this.toXCoord 			= this.getInt("toXCoord");
			this.toYCoord			= this.getInt("toYCoord");
			this.toTileType 		= this.getInt("toTileType");
			this.toTileLevel	 	= this.getInt("toTileLevel");
			this.marchType 			= this.getInt("marchType");
			
			if (null == this.getValue("winner")) {
				this.isWinner = Constant.MarchResult.UNKNOWN;
			} else {
				// 1 <- 0 lose
				// 2 <- 1  win
				this.isWinner = this.getInt("winner") + 1;
				this.isWinner=this.isWinner==2?2:1;
			}

			this.marchTimestamp 	= this.getString("marchTimestamp");
			this.destinationEta 	= this.getString("destinationEta");
			this.returnEta 			= this.getString("returnEta");
			
			this.speed 			= this.getInt("speed");
			this.knightId 		= this.getInt("knightId");
			this.knightCombat 	= this.getInt("knightCombat");
			this.knightCombatBoostExpiration = this.getString("knightCombatBoostExpiration");
			this.knightLevel 				= this.getInt("knightLevel");
			this.knightSkillPointsApplied 	= this.getInt("knightSkillPointsApplied");
			this.fromInformatics 		= this.getInt("fromInformatics");
			this.fromLoadTech 			= this.getInt("fromLoadTech");
			if(src["rewards"])
			{
				//var rlist:Array = _Global.GetObjectValues(src["rewards"]);
				
				this.surveyRewardId		= _Global.INT64(src["rewards"][_Global.ap + 0]["itemId"]);
			}
			else
				this.surveyRewardId		= 0;
			
			if(src["surveyStatus"])
				this.isOpenedReward = this.getInt("surveyStatus") == 0?true:false;
			else
				this.isOpenedReward = false;
			
			var untNum:int = 0;
			var untReturn:int = 0;
			var tn:int = 0;
			for(i=0;i<Constant.MAXUNITID;i++)
			{
				if(marchStatus == Constant.MarchStatus.SITUATION_CHANGED)
				{
					src["unit" + i + "Return"] = src["unit" + i + "Count"];
				}				
				tn = _Global.INT32( src["unit"+i+"Return"] );
				if(tn > 0)
					unitReturnHash[_Global.ap + i] = tn;
				tn = _Global.INT32( src["unit" +i + "Count"] );
				if(tn > 0)
					UnitCountHash[_Global.ap + i] = tn;

				untNum += _Global.INT32( src["unit" +i + "Count"] );
				untReturn +=_Global.INT32( src["unit" +i + "Return"] );
			}
			this.unitTotalReturn = untReturn;
			/// knightName --> ID  
			knightName = General.instance().getOriginalKnightNameInTotalCities(knightId);
			
			knightShowName = General.instance().getKnightNameInTotalCities(knightId);		
			knightTexName = General.instance().getKnightTexNameById(knightId);	
			
			switch(marchStatus)
			{
				case Constant.MarchStatus.DEFENDING:
					titleStr = (marchType == Constant.MarchType.AVA_SENDTROOP) ? 
							Datas.getArString("March.deployStatus", [_Global.NumFormat(untReturn)]) : 
							Datas.getArString("March.EncampStatus",[toXCoord, toYCoord,_Global.NumFormat(untReturn)]);
					break;
				case Constant.MarchStatus.RETURNING:
				case Constant.MarchStatus.SITUATION_CHANGED:
					break;
				default:
					switch(marchType)
					{
						case Constant.MarchType.TRANSPORT:
							titleStr =  Datas.getArString("March.TransportStatus",[toXCoord, toYCoord]); //
							break;
						case Constant.MarchType.REINFORCE:
							titleStr =  Datas.getArString("March.ReinforceStatus",[toXCoord, toYCoord]);
							break;
						case Constant.MarchType.PVP:
						case Constant.MarchType.ATTACK:
							titleStr =  Datas.getArString("March.AttackStatus",[toXCoord, toYCoord]);
							break;
						case Constant.MarchType.COLLECT:
							if(toXCoord!=0 && toYCoord!=0)
							titleStr =  Datas.getArString("Newresource.march_gathering",[toXCoord, toYCoord]);
							else
							titleStr="";
//							returnUnixTime=0;
//							destinationUnixTime=0;
							showTime=true;
							break;
						case Constant.MarchType.COLLECT_RESOURCE:
							if(toXCoord!=0 && toYCoord!=0)
							titleStr =  Datas.getArString("Newresource.march_gathering2",[toXCoord, toYCoord]);
							else
							titleStr="";
//							returnUnixTime=0;
//							destinationUnixTime=0;
							showTime=true;
							break;
						case Constant.MarchType.REASSIGN:
							titleStr =  Datas.getArString("March.ReassignStatus",[toXCoord, toYCoord]);
							break;
						case Constant.MarchType.SURVEY:
							titleStr = Datas.getArString("OpenPalace.Surveying",[toXCoord, toYCoord]);	
							break;
						case Constant.MarchType.RALLY_ATTACK:
						case Constant.MarchType.JION_RALLY_ATTACK:
							titleStr += " ( " + toXCoord + "," + toYCoord + ")";
							break;
					}
					break;
			}
			
			buffs = new System.Collections.Generic.List.<int>();
			var buffStr:String = this.getString("buffItems");
			if (!String.IsNullOrEmpty(buffStr))
			{
				var buffArr = buffStr.Split(","[0]);
				for (i = 0; i < buffArr.Length; i++)
				{
					var id = _Global.INT32(buffArr[i]);
					//MarchBuffItem.GetBuffTileByItemId
					if(id == 3290 || id == 3291 || id == 3292 || id == 3295 || id == 3296 || id == 3297 || id == 3299)
					{
						buffs.Add(id);
					}	
				}
			}
			
			// if(marchType==Constant.MarchType.COLLECT)
			// 	{
			// 		var mp:MapController = GameMain.instance().getMapController();
			// 		if( mp ){
			// 			mp.getTilesResourceStatesInfoDic(false);
			// 		}
			// 	}
			
		}
		
		public function changeToReturing():void
		{
			this.marchStatus = Constant.MarchStatus.RETURNING;		
			startTime = destinationUnixTime;
			endTime = returnUnixTime;
			marchStatusStr = March.getMarchStatusString(marchStatus);								
		}
		
		public function setUnitReturn(uid:String,intV:int):void
		{
			unitReturnHash[_Global.ap + uid] = intV;
		}
		
		public function setUnitCount(uid:String,intV:int):void
		{
			UnitCountHash[_Global.ap + uid] = intV;
		}
		
		//override functions......
		
		public function calcRemainingTime():void
		{			
			this.needed = this.endTime - this.startTime;	
			this.timeRemaining =  endTime - GameMain.unixtime();
			
			switch(marchStatus)
			{
				case Constant.MarchStatus.DEFENDING: 				//2
						timeRemaining = 1;	
						this.needed ++;
						if(marchType != Constant.MarchType.COLLECT && marchType != Constant.MarchType.COLLECT_RESOURCE){
							showTime = false;
						}		
						showSpeedUp = true;
						showExtraButton = false;
						
						if(WildernessMgr.instance().isConquedWild(toXCoord,toYCoord) && (marchType != Constant.MarchType.SURVEY || isOpenedReward) && March.instance().isSurveyOpen())
						{
							showExtraButton = true;
							this.extraBtnStr = Datas.getArString("Common.SurveyBtn");
							this.extraBtnAction = "SURVEY";
						}
						
						if(marchType == Constant.MarchType.SURVEY && !isOpenedReward)//marchType == Constant.MarchType.SURVEY && 
						{
							this.btnStr = Datas.getArString("Common.CollectBtn");
							this.btnAction = "OPENREWARD";
							showExtraButton = false;
							titleStr = Datas.getArString("March.SurveyComplete",[toXCoord, toYCoord]);
						}
						else if(marchType == Constant.MarchType.AVA_SENDTROOP)
						{
							this.btnStr = Datas.getArString("Common.Recall");
							this.btnAction = "RECALL";
							titleStr = Datas.getArString("March.deployStatus", [_Global.NumFormat(unitTotalReturn)]);
						}
						else if(marchType == Constant.MarchType.COLLECT || marchType == Constant.MarchType.COLLECT_RESOURCE)
						{
							returnUnixTime=0;
							if(GameMain.unixtime()>destinationUnixTime) destinationUnixTime=0;
							this.btnStr = Datas.getArString("Newresource.tile_button_gohome");
							this.btnAction = "GOHOME";
							if(toXCoord!=0 && toYCoord!=0)
							{
								if(marchType == Constant.MarchType.COLLECT)
								{
									titleStr =  Datas.getArString("Newresource.march_gathering",[toXCoord, toYCoord]);
								}
								else
								{
									titleStr =  Datas.getArString("Newresource.march_gathering2",[toXCoord, toYCoord]);
								}
							}
							else 
							{
								titleStr="";
							}
						}
						else
						{
							this.btnStr = Datas.getArString("Common.Recall");
							this.btnAction = "RECALL";
							titleStr = Datas.getArString("March.EncampStatus",[toXCoord, toYCoord,_Global.NumFormat(unitTotalReturn)]);
						}
						
//						if(marchType == Constant.MarchType.SURVEY)
//						{
						
												
						break;
//				case Constant.MarchStatus.OUTBOUND:	//marching......
				case Constant.MarchStatus.WAITING_FOR_REPORT:	
					showSpeedUp = false;
					showExtraButton = false;
					timeRemaining = 1;
					if(marchType != Constant.MarchType.COLLECT && marchType != Constant.MarchType.COLLECT_RESOURCE){
						showTime = false;
						
					}
//					else
//					{
//						this.btnStr = Datas.getArString("Newresource.tile_button_gohome");
//						this.btnAction = "GOHOME";
//						titleStr = Datas.getArString("March.deployStatus", [_Global.NumFormat(unitTotalReturn)]);
//						showSpeedUp = true;	
//					}
					break;
				case Constant.MarchStatus.CLIENT_RALLY_WAIT:	
					showSpeedUp = false;
					showExtraButton = false;
					timeRemaining = 1;
					showTime = false;
					break;
				case Constant.MarchStatus.DELETED:
				case Constant.MarchStatus.INACTIVE: 				//0
					timeRemaining = 0; //remove from List
					isActive = false;	//remove from RallyPoint
					if(marchType == Constant.MarchType.COLLECT || marchType == Constant.MarchType.COLLECT_RESOURCE){
						showTime = true;
//						timeRemaining=
					}
					break;						
				default:											// 1
					showTime = true;
					if(marchType == Constant.MarchType.COLLECT || marchType == Constant.MarchType.COLLECT_RESOURCE)
					{
					
						this.btnStr = Datas.getArString("Newresource.march_button_operate");
							this.btnAction = "OPERATE";
							titleStr = Datas.getArString("Newresource.march_gather", [toXCoord, toYCoord]);
							if(marchStatus==8)
							titleStr = Datas.getArString("Newresource.march_returning");
							
					}
					else if(marchType == Constant.MarchType.RALLY_ATTACK && marchStatus == Constant.MarchStatus.RALLY_WAITING)
					{
						showExtraButton = true;
						showSpeedUp = false;
						this.extraBtnStr = Datas.getArString("Common.Stop");
						this.extraBtnAction = "RALLY_CANCEL";
					}
					else if(marchType == Constant.MarchType.SURVEY && marchStatus != Constant.MarchStatus.RETURNING && marchStatus != Constant.MarchStatus.SITUATION_CHANGED)
					{
						showExtraButton = true;
						this.extraBtnStr = Datas.getArString("Common.Stop");
						this.extraBtnAction = "CANCEL";
					}
					else
						showExtraButton = false;
					break;
			}
		}
		
		public function get willBeRemoveFromBar():boolean
		{
			//marchstatus......
			switch(marchStatus)
			{
				case Constant.MarchStatus.OUTBOUND:	//marching....
				case Constant.MarchStatus.WAITING_FOR_REPORT:
				case Constant.MarchStatus.DEFENDING:
				case Constant.MarchStatus.RALLY_WAITING:
				case Constant.MarchStatus.RALLYING:
				case Constant.MarchStatus.CLIENT_RALLY_WAIT:
					return false;
				case Constant.MarchStatus.INACTIVE:
					return true;
				break;
			}
			
			return timeRemaining <= 0;		
		}
		//override .
		public function speed2EndTime(neweta:long):void
		{
			var speeded:long = endTime - neweta;
			endTime = neweta;
			startTime -= speeded;			
			
			switch(marchStatus)
			{
				case Constant.MarchStatus.OUTBOUND:					
					this.destinationUnixTime -= speeded;			
					this.returnUnixTime -= speeded;					
					break;
					
				case Constant.MarchStatus.SITUATION_CHANGED:
				case Constant.MarchStatus.RETURNING: 
					this.returnUnixTime -= speed;
			}
		}
		//
		
		function GetReturnUnixTime():long
		{
			return returnUnixTime;
		}
		
		function GetDestinationUnixTime():long
		{
			return destinationUnixTime;
		}
		
	}
