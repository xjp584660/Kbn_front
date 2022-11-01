#pragma strict

import System.Collections.Generic;

public class HealQueue  extends BaseQueueMgr
{
	public class HealQueueItem extends QueueItem
	{
		var m_unitDat : System.Collections.Generic.Dictionary.<int, int>;
		var m_totalUnit : int;
		public function HealQueueItem(cityId : int
									, queueId : int
									, start : long
									, finish : long
									, troopCnt : System.Collections.Generic.IEnumerable.<System.Collections.Generic.KeyValuePair.<int, int> >)
		{
			this.itemName = Datas.getArString("Hospital.Barname");
			this.cityId = cityId;
			this.id = queueId;
			this.classType = QueueType.HealQueue;

			var ap:String = _Global.ap;
			this.startTime = start;
			this.endTime = finish;
			this.timeRemaining = finish - start;

			var unitDat : System.Collections.Generic.Dictionary.<int, int> = new System.Collections.Generic.Dictionary.<int, int>();
			m_totalUnit = 0;
			for ( var dat : System.Collections.Generic.KeyValuePair.<int, int> in troopCnt )
			{
				unitDat.Add(dat.Key, dat.Value);
				m_totalUnit += dat.Value;
			}

			if ( unitDat.Count != 0 )
				m_unitDat = unitDat;
		}

		public function HealQueueItem(cityId : int, queueId : int, src : HashObject)
		{
			var ap:String = _Global.ap;
			this.cityId = cityId;
			this.classType = QueueType.HealQueue;
			this.id = queueId;
			this.startTime = _Global.parseTime(src["startTime"]);
			this.endTime = _Global.parseTime(src["endTime"]);
			this.timeRemaining = this.endTime - GameMain.instance().unixtime();
			this.itemName = Datas.getArString("Hospital.Barname");

			var unit : String = "unit";
			var unitDat : System.Collections.Generic.Dictionary.<int, int> = new System.Collections.Generic.Dictionary.<int, int>();
			m_totalUnit = 0;
			for ( var dat : System.Collections.DictionaryEntry in src.Table )
			{
				var k : String = dat.Key;
				if ( k.Length < unit.Length || k.Substring(0, unit.Length) != unit )
					continue;
				var cnt : int = _Global.INT32(dat.Value);
				if ( cnt <= 0 )
					continue;
				m_totalUnit += cnt;
				var idStr : String = k.Substring(unit.Length);
				var id : int = _Global.INT32(idStr);
				unitDat.Add(id, cnt);
			}
			
			if ( unitDat.Count != 0 )
				m_unitDat = unitDat;
		}
		
		public function get TotalHeal() : int
		{
			return m_totalUnit;
		}
        
        public function get UnitData() : IEnumerable.< KeyValuePair.<int, int> >
        {
            return m_unitDat;
        }
	}

	static private var m_healQueue : HealQueue;
	static public function instance() : HealQueue
	{
		if ( m_healQueue == null )
			m_healQueue = new HealQueue();
		return m_healQueue;
	}

	public	function	init( sd:HashObject )
	{
		super.clearAll();
		//cacheTList.Clear();

		//seed = sd;
		var seed : HashObject = GameMain.instance().getSeed();
		var hospitalQueue : HashObject = seed["hospital_queue"];
		if ( hospitalQueue == null )
			return;

		var obj:Hashtable = hospitalQueue.Table;	//["city" + cityId];
		var cityId:int;
		//_inited = false;

		for(var j:System.Collections.DictionaryEntry in obj) // c41..
		{
			var cs:String = j.Key;
			cs = cs.Substring(1);//cityi..
			cityId = _Global.INT32(cs);
			for(var i:System.Collections.DictionaryEntry in (j.Value as HashObject).Table)
			{
				var id : int = _Global.INT32((i.Key as String).Substring(1));
				priv_addQueueItem(cityId, id, i.Value);
			}
		}
		//_inited = true;
		MenuMgr.getInstance().UpdateTrainProgress();
	}
	
	public function AddQueue(queueId : int, cityId : int, startTime : long, endTime : long, troopCnt : System.Collections.Generic.IEnumerable.<System.Collections.Generic.KeyValuePair.<int, int> > )
	{
		//var cityId : int = GameMain.instance().getCurCityId();
		var healQueueItem : HealQueueItem = new HealQueueItem(cityId, queueId, startTime, endTime, troopCnt);
		add2Queue(healQueueItem, queueId);
		MenuMgr.getInstance().UpdateTrainProgress();
	}
	
	public function GetQueueByCityId(cityId : int) : System.Collections.Generic.List.<HealQueueItem>
	{
		var ltItem : System.Collections.Generic.List.<HealQueueItem> = new System.Collections.Generic.List.<HealQueueItem>();
		for ( var baseQueue : BaseQueue in this.GetQueueList() )
		{
			for ( var item : HealQueueItem in baseQueue.GetData() )
			{
				if ( item.cityId == cityId )
					ltItem.Add(item);
			}
		}
		return ltItem;
	}
	
	public function Queue() : System.Collections.Generic.List.<HealQueueItem>
	{
		var curCityId : int = GameMain.instance().getCurCityId();
		return GetQueueByCityId(curCityId);
	}

	public function queueItemAdded(qItem:QueueItem,qId:int):void
	{
		if (qItem.cityId == GameMain.instance().getCurCityId() )
			GameMain.instance().setBuildingAnimationOfCity(Constant.Building.HOSPITAL, Constant.BuildingAnimationState.Open);
	}

	public function queueItemRemoved(qItem:QueueItem,qId:int):void
	{
        CheckDailyQuestProgress(qItem as HealQueueItem);
		MenuMgr.getInstance().sendNotification(Constant.Notice.HEAL_COMPLETED, null);
		if (qItem.cityId == GameMain.instance().getCurCityId() )
			GameMain.instance().setBuildingAnimationOfCity(Constant.Building.HOSPITAL, Constant.BuildingAnimationState.Close);
        GameMain.instance().invokeUpdateSeedInTime(2);
	}
    
    private function CheckDailyQuestProgress(qItem : HealQueueItem) : void
    {
        var unitData : Dictionary.<int, int> = new Dictionary.<int, int>();
        for (var kvPair : KeyValuePair.<int, int> in qItem.UnitData)
        {
            unitData[kvPair.Key] = kvPair.Value;
        }
        DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.Healing, unitData);
    }
	
	public function checkAnimationState()
	{
		if ( this.NeedShowAnimation )
			GameMain.instance().setBuildingAnimationOfCity(Constant.Building.HOSPITAL, Constant.BuildingAnimationState.Open);
		else
			GameMain.instance().setBuildingAnimationOfCity(Constant.Building.HOSPITAL, Constant.BuildingAnimationState.Close);
	}
	
	public function get NeedShowAnimation() : boolean
	{
		var q : System.Collections.Generic.List.<HealQueueItem> = this.Queue();
		return q.Count != 0;
	}
	
	public function GetTotalInHealCountInCity(cityId : int)
	{
		var totalHeal : int = 0;
		for ( var queueItem : HealQueueItem in this.GetQueueByCityId(cityId) )
			totalHeal += queueItem.TotalHeal;
		return totalHeal;
	}
	
	public function get TotalInHealCountInCurrentCity() : int
	{
		var curCityId : int = GameMain.instance().getCurCityId();
		return this.GetTotalInHealCountInCity(curCityId);
	}
	
	public function get IsHaveEmptySlotByHeal() : boolean
	{
		return this.Queue().Count == 0;
	}
	

	private function priv_addQueueItem(cityId : int, queueId : int, src : HashObject)
	{
		if ( _Global.INT32(src["status"]) == 0 )
			return;
		var healQueueItem : HealQueueItem = new HealQueueItem(cityId, queueId, src);
		add2Queue(healQueueItem, queueId);
	}
}
