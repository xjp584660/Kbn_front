
public class	Research  extends BaseQueueMgr
{

	private	static	var	singleton:Research;
	private var	seed:HashObject;
	
	public	static	function	instance(){
		if( singleton == null ){
			singleton = new Research();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public	function	init( sd:HashObject )
	{
		super.clearAll();
		cacheTList.Clear();
		
		seed = sd;		
		var obj:Hashtable = GameMain.instance().getSeed()["queue_tch"].Table;	//["city" + cityId];
		var cityId:int;		
		_inited = false;
		
		new Thread( new ThreadStart( InitResearchList )).Start();
		for(var j:System.Collections.DictionaryEntry in obj) // c41..
		{
			var cs:String = j.Key;
			cs = cs.Substring(4);//cityi..
			cityId = _Global.INT32(cs);
			for(var i:System.Collections.DictionaryEntry in (j.Value as HashObject).Table)
			{
//				var id:int =  i._value ;
				addSeedResearch2Mgr(cityId,i.Value);
			}
		}	
		_inited = true;
	}
	public function resetAfterChangeCity()
	{
		this.updateAllTVO();
	}
	/*** queue ...***/
	private var _inited:boolean = false;
	public function addSeedResearch2Mgr(cityId:int ,techArray:HashObject):void
	{
		var rq:ResearchQueueElement = new ResearchQueueElement();		
		rq.mergeDataFrom(techArray);
		rq.cityId = cityId;
		this.add2Queue(rq,cityId);
		
	}
	
	public function queueItemAdded(qItem:QueueItem,qId:int):void
	{	
		if(	_inited)
		{
			if(qId == GameMain.instance().getCurCityId())
				MenuMgr.getInstance().onResearch(qItem);

			this.updateAllTVO();	
			MenuMgr.getInstance().sendNotification(Constant.Notice.RESEARCH_START,null);
			
			GameMain.instance().setBuildingAnimationOfCity(Constant.Building.ACADEMY, Constant.BuildingAnimationState.Open);
		}		
	}
	
	private function priv_isHaveActiveQueue(cityId : int) : boolean
	{
		var qItem:Research.ResearchQueueElement = this.getItemAtQueue(0, cityId);
		return qItem != null;
	}
	
	public function checkAnimationState()
	{
		var curCityId : int = GameMain.instance().getCurCityId();
		if ( this.priv_isHaveActiveQueue(curCityId) )
			GameMain.instance().setBuildingAnimationOfCity(Constant.Building.ACADEMY, Constant.BuildingAnimationState.Open);
		else
			GameMain.instance().setBuildingAnimationOfCity(Constant.Building.ACADEMY, Constant.BuildingAnimationState.Close);
	}

	public function queueItemRemoved(qItem:QueueItem,qId:int):void
	{
		//seed upgrade complete!
//		qItem.level++;
		seed["tech"]["tch" + qItem.id].Value = "" + qItem.level;
//		seed["queue_tch"]["city" + cityId].splice(0, 1);	
//		this.updateAllTVO();	//	
		updateTVO(qItem.id);
		//---------------------------------// zhou wei
		Quests.instance().checkForTechnology();
		//---------------------------------//
					
		MenuMgr.getInstance().sendNotification(Constant.Notice.RESEARCH_COMPLETE,null);
		GameMain.instance().setBuildingAnimationOfCity(Constant.Building.ACADEMY, Constant.BuildingAnimationState.Close);

		KBN.FTEMgr.getInstance().checkNextFTE(FTEConstant.Step.SPEED_UP_2_OPEN_LEVELUP);
		SoundMgr.instance().PlayEffect( "end_construction", /*TextureType.AUDIO*/"Audio/");
	}
	
	public function creatQueueClass(qId:int):BaseQueue
	{
		var q:BaseQueue = super.creatQueueClass(qId);		
		q.setMaxItemNum(1); // TODO...
		return q;
	}
	
	public function updateSearchWithHelpData(cid:int,robj:HashObject):void
	{
		var qItem:Research.ResearchQueueElement = this.getItemAtQueue(0, cid);
		var endTime:long = _Global.parseTime(robj["endTime"]);
		if(qItem != null && qItem.id == _Global.INT32(robj["tid"]) && endTime <= qItem.endTime )
		{
			qItem.startTime = _Global.parseTime(robj["beginTime"]);
			qItem.endTime = endTime;
			qItem.help_cur = _Global.INT32(robj["help_cur"]);
			qItem.help_max = _Global.INT32(robj["help_max"]);
			
			qItem.calcRemainingTime();
		}
	}
	
	// Triggers the upgrade action for a Technology, adding it to
	// the queue and deducting appropriate resources.
	//
	public	function	upgrade(techTypeId:int, techLevel:int) {
	
		var researchData:HashObject = Datas.instance().researchData();
		var general = General.instance();
		var resource:Resource = Resource.instance();
		var gMain:GameMain = GameMain.instance();
		var currentcityid:int = gMain.getCurCityId();
		var mult = Mathf.Pow(2, techLevel - 1);
		var i:int;
		var reqs:Array = Utility.instance().checkreq("t", techTypeId, techLevel);
		
		// If resources are not available, or the queue is full, do not continue.
		//if ( _Global.IsValueInObject(reqs[3], 0)|| Queue.full()) 
		if(this.isQueueFull(currentcityid) )
		{
//			Modal.showAlert(arStrings.OpenAcademy['UnableToResearch']);
			//TODO:
			return false;
		}
		else 
		{
//			for (i = 0; i <= 4; i++) 
//			{ // remove resources
//				
//				var ti:int = _Global.INT32( researchData["t" + techTypeId]["c"][_Global.ap + i] );
//				resource.addToSeed(i, ti * mult * -1, currentcityid);
//			}
//			Resource.instance().UpdateRecInfo();
			
			var okFunc:Function = function(result:HashObject)
			{
				for (i = 0; i <= 4; i++) 
				{ // remove resources
					
					var ti:int = _Global.INT32( researchData["t" + techTypeId]["c"][_Global.ap + i] );
					resource.addToSeed(i, ti * mult * -1, currentcityid);
				}
				var dummyCount: int = _Global.INT32( researchData["t" + techTypeId]["c"][_Global.ap + 11] );
				MyItems.instance().subtractItem(4123,dummyCount);
				Resource.instance().UpdateRecInfo();
				
//				_Global.Log("upgradeResearchOK");
				
//				var time:int = _Global.INT32(researchData["t" + techTypeId]["c"][_Global.ap + 10] * mult * (1 / (1 + general.intelligenceBonus())));
				
				var time :long = _Global.INT32(result["timeNeeded"]);//getResearchAloneTime(techTypeId,techLevel - 1);				
				var unixtime = GameMain.unixtime();
//				KTrack.event(["_trackEvent", "Research", techTypeId, techLevel, seed.player.title]);
				var obj:HashObject = seed["queue_tch"]["city" + currentcityid];
//				obj.push([techTypeId, techLevel, unixtime, unixtime + time, 0, time]);
				obj[_Global.ap + 0] = new HashObject( {
									_Global.ap + 0 : techTypeId, 
									_Global.ap + 1 : techLevel, 
									_Global.ap + 2 : unixtime, 
									_Global.ap + 3 : unixtime + time, 
									_Global.ap + 4 : 0, 
									_Global.ap + 5 : time,
									_Global.ap + 7 : result["help_cur"],
									_Global.ap + 8 : result["help_max"]
									}) ;
				if(result["updateSeed"]){
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}
				//TODO.. add a queuq to show
				this.addSeedResearch2Mgr( currentcityid, obj[_Global.ap + 0]);
				SoundMgr.instance().PlayEffect( "start_research", /*TextureType.AUDIO*/"Audio/" );
			};
			
			var	errorFunc:Function = function(msg:String, errorCode:int){
//				_Global.Log("upgradeResearchError:"+msg);
				//TODO:
			};
			
			var params:Array = new Array();
			params.Add(currentcityid);
			params.Add(techLevel);
			params.Add(techTypeId);
			
			UnityNet.reqUpgradeResearch(params, okFunc, null);
		}
	}
	
	public function getResearchNameById(tid:int):String
	{
		return Datas.getArString("techName.t" + tid);
	}
	
	public function getReseachLvlById(tid:int):String
	{
		return seed["tech"]["tch"+tid].Value+ "";
	}
	
	public function getInstantResearchGold(techTypeId:int, techLevel:int) 
	{
		var	researchAloneTime:int = getResearchAloneTime(techTypeId,techLevel);	
		var	goldRequired:int = SpeedUp.instance().getTotalGemCost(researchAloneTime);
		return goldRequired;
	}
	//techLevel : dest level.
	public	function	instantResearch(techTypeId:int, techLevel:int) {
		instantResearch(techTypeId,techLevel,null,null,0);
	}
	public	function	instantResearch(techTypeId:int, techLevel:int,onCallBack:Function,requirements:Array,aditionGems:float) {
		var	general:General = General.instance();
		var resource:Resource = Resource.instance();
		var speedUp:SpeedUp = SpeedUp.instance();
		var curCityId:int = GameMain.instance().getCurCityId();
		var mult = Mathf.Pow(2, techLevel - 1);
		var researchData:HashObject = Datas.instance().researchData();
		var	researchAloneTime:int = getResearchAloneTime(techTypeId,techLevel - 1);	//_Global.INT32(researchData["t"+techTypeId]["c"][_Global.ap + 6] * mult * (1 / (1 + general.intelligenceBonus())));
		var	goldRequired:int;
		
		var rate:float = _Global.FLOAT(seed["buyUpgradeRateTech"].Value);
		
		var tmpTimeceil:int = _Global.INT32(SpeedUp.instance().getTotalGemCost(researchAloneTime)*_Global.INT32(rate*10000) + 9999)/10000;
		
		if(seed["buyUpgradeRateTech"])
			goldRequired = tmpTimeceil+Mathf.Ceil(aditionGems*_Global.FLOAT(seed["buyUpgradeRateTech"].Value));
		else
			goldRequired = speedUp.getTotalGemCost(researchAloneTime)+aditionGems;
		
		var	itemsList:String = speedUp.getItemListString(researchAloneTime);
		
		var canAfford:boolean = false;
		
		if(Payment.instance().CheckGems(goldRequired))
		{
			canAfford = true;
		}
		else
		{
			return;
		}
		var	i:int;
		
		if(!canAfford) 
		{
//			ErrorMgr.instance().OpenNoMoneyDialog(goldRequired);
//			MenuMgr.getInstance().PushMenu("NogemMenu", new Object(), "trans_pop" );
			MenuMgr.getInstance().PushPaymentMenu();
		}
		 else 
		{
			var reqs:Array = Utility.instance().checkreq("t", techTypeId, techLevel);		
			// If resources are not available, or the queue is full, do not continue.
			/*
			if (_Global.IsValueInObject(reqs[3], 0) || this.isQueueFull(curCityId) )
			{
//				Modal.showAlert(arStrings.OpenAcademy["UnableToResearch"]);
				//TODO:
				return false;
			} 
			else 
			*/
			if(true)
			{
//				for (i = 0; i <= 4; i++) { // remove resources
//					resource.addToSeed(i, researchData["t" + techTypeId]["c"][_Global.ap + i] * mult * -1,curCityId );
//				}
//				Resource.instance().UpdateRecInfo();
				var okFunc:Function = function(result:HashObject)
				{
					for (i = 0; i <= 4; i++) { // remove resources
						resource.addToSeed(i, _Global.INT32(researchData["t" + techTypeId]["c"][_Global.ap + i].Value) * mult * -1,curCityId );
					}
					Resource.instance().UpdateRecInfo();
					SoundMgr.instance().PlayEffect( "start_research", /*TextureType.AUDIO*/"Audio/" );	
//					_Global.Log("instantResearchOK");
//					KTrack.event(["_trackEvent", "InstantResearch", techTypeId, techLevel, seed.player.title]);
					var isReal:boolean = result["isWorldGem"]?result["isWorldGem"].Value == false:true;
					Payment.instance().SubtractGems(goldRequired,isReal);
					
					seed["tech"]["tch"+techTypeId].Value = techLevel;

//					Modal.hideModalAll();
					if(result["updateSeed"]){
						UpdateSeed.instance().update_seed(result["updateSeed"]);
					}
					
//					this.addSeedResearch2Mgr( currentcityid, obj[_Global.ap + 0]);
//					updateAllTVO();	//will be called in a new thread while menu opened or reopen.
					updateTVO(techTypeId);
					MenuMgr.getInstance().sendNotification(Constant.Notice.RESEARCH_COMPLETE,null);

					//force update .0802.		
					//UpdateSeed.instance().update_seed_ajax(true,null);
					GameMain.instance().seedUpdateAfterQueue(true);
					if(onCallBack!=null)
						onCallBack();
					//---------------------------------// zhou wei
					Quests.instance().checkForTechnology();
					//---------------------------------//	
									
				};
				
				var	errorFunc:Function = function(msg:String, errorCode:String)
				{
					if(errorCode == "UNKNOWN")
						return;
						
					var errorMsg:String = errorCode == UnityNet.NET_ERROR ? Datas.getArString("Error.Network_error") : UnityNet.localError( errorCode, msg, null );
					
					if(errorCode != UnityNet.NET_ERROR && _Global.INT32(errorCode) == 3000 &&MenuMgr.getInstance().GetCurMenu() != MenuMgr.getInstance().MainChrom)
						MenuMgr.getInstance().PopMenu("");
					
					if( errorMsg != null )
					{
						ErrorMgr.instance().PushError("",errorMsg, true,Datas.getArString("FTE.Retry"), null);
					}
								
					GameMain.instance().seedUpdate(false);
				};
				
				var params:Array = new Array();
				params.Add(curCityId);
				params.Add(techLevel);
				params.Add(techTypeId);
				params.Add(goldRequired);
				params.Add(itemsList);
				
				UnityNet.reqInstantResearch(params, okFunc, null );
			}
		}
	}

	// returns true if another city is researching a technology
	public	function	otherCityIsResearching(techId:int):boolean
	{

		var	cities:Array = _Global.GetObjectKeys(seed["queue_tch"]);
		var	researchedInOtherCity:boolean = false;
		var	i:int;
		var currentcityid:int = GameMain.instance().getCurCityId();
		var cid:int;
		var cs:String;
		
		for (i = 0; i < cities.length; i++) 
		{
			cs = cities[i];
			cs = cs.Substring(4);//
			cid = _Global.INT32(cs);
			
			if(cid == currentcityid)
				continue;
			var qitem:Research.ResearchQueueElement = this.getItemAtQueue(0, cid);
			if(qitem && qitem.id == techId)
				return true;	
			/****
			if (cities[i] != "city" + currentcityid) 
			{
				if (seed["queue_tch"][cities[i]].length > 0) 
				{

					if( _Global.INT32(seed["queue_tch"][cities[i]][0][0]) == techId ){
						researchedInOtherCity = true;
						break;
					}
				}
			}
			***/
		}
		return researchedInOtherCity;
	}
	
	// Returns the maximum level for the technology ID as an integer
	// 
	public	function	getMaxLevelForType(technologyId):int{
		return _Global.INT32(seed["tech"]["tch" + technologyId]);
	}
	
	// Returns the percentage as decimal bonus for a given technology ID
	//
	public	function	bonusForType(technologyId) : float{
		var modifier:float = 0;
		var	totalBonus:float = 0;
		
		switch (technologyId) {
			case Constant.Research.IRRIGATION:
				modifier = 0.1;
				break;
			case Constant.Research.LOGGING:
				modifier = 0.1;
				break;
			case Constant.Research.STONEWORKING:
				modifier = 0.1;
				break;
			case Constant.Research.SMELTING:
				modifier = 0.1;
				break;
			case Constant.Research.TACTICS:
				modifier = 0.1;
				break;
//			case Constant.Research.STEALTH:
//				modifier = 0.1;
//				break;
			case Constant.Research.STEEL:
				modifier = 0.05;
				break;
			case Constant.Research.CAST_IRON:
				modifier = 0.05;
				break;
			case Constant.Research.WEIGHT_DIST:
				modifier = 0.1;
				break;
			case Constant.Research.ROADS:
				modifier = 0.1;
				break;
			case Constant.Research.HORSE:
				modifier = 0.05;
				break;
			case Constant.Research.SPRINGS:
				modifier = 0.05;
				break;
			case Constant.Research.STORAGE:
				modifier = 0.1;
				break;
			case Constant.Research.HEALING:
				modifier = 0.05;
				break;
			case Constant.Research.CRANES:
				modifier = 0.1;
				break;
		}
		
		totalBonus = getMaxLevelForType(technologyId) * modifier; // base bonus
//		totalBonus = totalBonus + (totalBonus * Temple.bonusForDeity(Constant.Deity.APOLLO)); // deity bonus
		return totalBonus;
	}
	
	function getTechIdByResource( resourceId:int ):int {
		if(resourceId == 5 || resourceId == 6 || resourceId == 7 ||resourceId == 8 )
			return Constant.Research.CAST_IRON ;
		else 
			return resourceId;
	}
	////////////////////////////// tzhou...
	protected var cacheTList:Array = new Array();
	public static var TECH_NUM = 15;
	public static var TECH_IDS:Array = [1,2,3,4,5,6,8,9,10,11,12,13,14,15,16];
	public function getTechnologyList(cityId:int):Array
	{
		return cacheTList;	
	}
	
	protected function InitResearchList()
	{
		var tvo: TechVO;
		var i:int;
		var curCityId:int =  GameMain.instance().getCurCityId();		
		for(i= 0; i<TECH_NUM; i++)
		{
			tvo = new TechVO();
			tvo.tid = TECH_IDS[i];
			tvo.texturePath = "timg_" + tvo.tid;
			tvo.cityId = curCityId;

				
			cacheTList.push(tvo);
	//		updateTVO(tvo,true);	
			tvo.name = Datas.getArString("techName.t" + tvo.tid );
			//a1--a7 ... numbers.
			//a8 ...
			tvo.description = Datas.getArString("techDesc.t" + tvo.tid);//td[ap+10];											
		}
		return cacheTList;
	}
	
	protected function updateTVO(tid:int):void
	{	
		var tvo:TechVO;
		if(!cacheTList)
			return;
		for(var i:int=0;i<cacheTList.length;i++)
		{
			tvo = cacheTList[i] as TechVO;
			if(tvo.tid == tid)
				updateTVO(tvo,false);
		}				
	}
	
	protected function updateTVO(tvo:TechVO,updateStaticInfo:boolean):void
	{
		var td:HashObject;
		var tch:HashObject = Datas.instance().getGameData()["techcost"];
		var ap:String = _Global.ap;
		var qe:ResearchQueueElement;		
		
		//TODO...
//		qe = this.getItemAtQueue(0,tvo.cityId);//	this.Queue.first(cityId);
		
		tvo.level = _Global.INT32(seed["tech"]["tch" + tvo.tid]);
		tvo.need_time = getResearchAloneTime(tvo.tid,tvo.level);			
		
		td = tch["tch" + tvo.tid];
		
		tvo.requirements = Research.instance().getTechnologyRequirements(tvo);		
		tvo.req_ok = Utility.areRequimentsAllOk(tvo.requirements);
		
		if(td && updateStaticInfo)
		{	
			tvo.name = Datas.getArString("techName.t" + tvo.tid );
			//a1--a7 ... numbers.
			//a8 ...
			tvo.description = Datas.getArString("techDesc.t" + tvo.tid);//td[ap+10];
		}
//		tvo.isOtherUpgrading = (qe!= null);		 
//		if(qe)
//		{				
//			if(tvo.tid == qe.id)
//			{
//				tvo.queueStatus = qe;
////				tvo.level = qe.level ; // upgrading ....
//			}
//		}
//		else
//		{
//			tvo.queueStatus = null;
//		}
		
	}
	public function updateAllTVO():void
	{
		var tvo:TechVO;
		if(!cacheTList)
			return;
		for(var i:int=0;i<cacheTList.length; i++)
		{
			tvo = cacheTList[i] as TechVO ;
			updateTVO(tvo,false);
		}
	}
	public function getTechnologyRequirements(tchVO:TechVO):Array
	{
		return Utility.instance().checkreq("t",tchVO.tid,tchVO.level + 1);
	}
	
	////////////////////////////////////////////////////////////////
	class	ResearchQueueElement extends QueueItem
	{
		public  var progress:int;
//		public  var classType:QueueType = QueueType.ResearchQueue;
		
		public function mergeDataFrom(src:HashObject)
		{
			var ap:String = _Global.ap;
			this.classType = QueueType.ResearchQueue;
			this.id = _Global.INT32(src[ap + 0]);
			this.level = _Global.INT32(src[ap + 1]);
			this.startTime = _Global.parseTime(src[ap + 2]);
			this.endTime = _Global.parseTime(src[ap + 3]);
			this.progress = _Global.INT32(src[ap + 4]);
			this.needed = _Global.INT32(src[ap + 5]);
			this.timeRemaining = this.endTime - GameMain.instance().unixtime();
			
			this.help_cur = _Global.INT32(src[ap + 7]);
			this.help_max = _Global.INT32(src[ap + 8]);
			//
//			var tch:Object = Datas.instance().getGameData()["techcost"];
			this.itemName = Datas.getArString("techName.t" + this.id);	//tch["tch" + id][ap + 0];
		}
	}
	
	//public	var	Queue:QueueClass = new QueueClass();
	
/***	
	class	QueueClass
	{
		// Returns the queue as a nice object that makes sense.
		// This is duplicated in building.js
		//
		public	function	parseQueue (queueArray:Object)
		{
			if (queueArray == null) 
			{
				return null;
			} else {
				var queue = new ResearchQueueElement();
				queue.mergeDataFrom(queueArray);				
				return queue;
			}
		}

//		// Gets a specific queue_tch index. Right now we can
//		// only have 1 per city, so it's kind of moot.
//		//
//		public	function	get(queueIndex:int, cityId:int) {
//			return parseQueue(seed["queue_tch"]["city" + cityId][queueIndex]);
//		}

		// Returns the first technology being researched in the queue.
		// Right now there can be only one, so it's kinda redundant.
		//
		public	function	first (cityId:int) {
//			return this.get(0, cityId); 
			var rl:Object = GameMain.instance().getSeed()["queue_tch"]["city" + cityId];
			return parseQueue(rl[_Global.ap + 0]);
		}

		// Returns true if there is already research in queue for the current city
		//
		public	function	full () 
		{
			var rl:Object = GameMain.instance().getSeed()["queue_tch"]["city"+GameMain.instance().getCurCityId()];
			var n:int = rl.Count;
			return n>=1;
		}
	}
	
	public	function	updateQueue(cityId:int){
	
		var tech:ResearchQueueElement = Queue.first(cityId);
		// Technology (Research) Queue
        if (tech) {
            var ut:long = GameMain.unixtime();
            var timeleft:long = tech.endTime - ut;
            tech.timeRemaining = timeleft;
//            var friendHelpCount:int = 0;
            
            if (timeleft > 0) {
                
                if (cityId == GameMain.instance().getCurCityId()) {
                	
                    percentcomplete = 1 - (tech.endTime - ut) / (tech.endTime - tech.startTime);
//                    if (_Global.INT32(seed["tch_hlp"]['t' + tech.itemType]) > 0) {
//                        friendHelpCount = seed.tch_hlp['t' + tech.itemType];
//                    }
//                    qhtml.push(queueTemplate.evaluate({
//                        className: 'researching',
//                        speedupCode: 'tch',
//                        name: arStrings.techName['t' + tech.itemType] + ' (' + [arStrings.Common.Lv, tech.level].join(' ') + ')',
//                        timeLeft: timestr(timeleft),
//                        targetId: tech.itemType,
//                        speedupStr: arStrings.Common.Speedup,
//                        width: _Global.INT32(shortQueueBarWidth * percentcomplete, 10),
//                        stats: '<span>' + g_js_strings.update_queue.frhelp + ': ' + friendHelpCount + '</span>'
//                    }));
//                    if ($('alchemymodal')) {
//                        $('alchemymodal_tch' + tech.itemType + '_queue_timeleft').update(timestr(timeleft));
//                    }
                }
            }
            else { // complete research
                seed["tech"]["tch" + tech.itemType] = "" + tech.level;
//                seed["tch_hlp"]["t" + tech.itemType] = 0;
//                seed["queue_tch"]["city" + cityId].splice(0, 1);
//                if ($("alchemymodal")) {
//                    Research.open();
//                }
            }
        }
	}
	**/
	
	public static function getResearchAloneTime(techId :int, lv:int):long
	 {
		var mult:float = Mathf.Pow(2, lv);
		
		var rd:HashObject = Datas.instance().researchData();
		
		var vipBuff:int = 0;
		if(GameMain.instance().IsVipOpened())
		{
			var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
			var vipLevel:int = GameMain.instance().GetVipOrBuffLevel();
			var vipDataItem: KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(vipLevel);
			if(vipDataItem != null)
			{
				vipBuff =  vipDataItem.TECH;
			}
		}
		
		var researchAloneTime:long = _Global.INT64(rd['t' + techId]["c"][_Global.ap + 10]) * mult * (1 / (1 + General.instance().intelligenceBonus() + 0.01f*vipBuff + Technology.instance().getCutDownResearchAlchemyTime()));
		//researchAloneTime = researchAloneTime * Technology.instance().getCutDownResearchAlchemyTime();
		switch(techId)
		{
			case Constant.Research.STEALTH:
				if(lv == 0) 
				{
					researchAloneTime = 30;
				}
				break;
			case Constant.Research.IRRIGATION:
				if(lv == 0) 
				{
					researchAloneTime = 30;
				}
				break;
			case Constant.Research.LOGGING:
				if(lv == 0) 
				{
					researchAloneTime = 10;
				}
				break;
			case Constant.Research.STONEWORKING:
				if(lv == 0) 
				{
					researchAloneTime = 10;
				}
				break;
			case Constant.Research.SMELTING:
				if(lv == 0) 
				{
					researchAloneTime = 10;
				}
				break;
		}
		
		return researchAloneTime;
	}

}
