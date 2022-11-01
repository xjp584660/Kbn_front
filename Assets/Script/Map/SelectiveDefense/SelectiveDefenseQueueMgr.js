#pragma strict
import System.Collections.Generic;

public class SelectiveDefenseQueueMgr extends BaseQueueMgr
{
    static private var myInstance : SelectiveDefenseQueueMgr;
    static public function instance() : SelectiveDefenseQueueMgr
    {
        if (myInstance == null)
        {
            myInstance = new SelectiveDefenseQueueMgr();
        }
        return myInstance;
    }
    
    public function init(sd : HashObject)
    {
        super.clearAll();
        var seed : HashObject = GameMain.instance().getSeed();
        var queueData : HashObject = seed["selective_defense_queue"];
        if (queueData == null)
            return;

        var obj : Hashtable = queueData.Table;
        var cityId : int;

        for (var j : DictionaryEntry in obj)
        {
            var cs : String = j.Key;
            cs = cs.Substring(1);
            cityId = _Global.INT32(cs);
            for(var i : DictionaryEntry in (j.Value as HashObject).Table)
            {
                var id : int = _Global.INT32((i.Key as String).Substring(1));
                priv_addQueueItem(cityId, id, (i.Value as HashObject));
            }
            
            MenuMgr.getInstance().sendNotification(Constant.Notice.SelectiveDefenseQueueUpdate, null);
        }
    }
    
    public function AddQueue(queueId : int, cityId : int, startTime : long, endTime : long,
        troopCnt : IEnumerable.< KeyValuePair.<int, int> >)
    {
        var queueItem : SelectiveDefenseQueueItem =
            new SelectiveDefenseQueueItem(cityId, queueId, startTime, endTime, troopCnt);
        add2Queue(queueItem, queueId);
        MenuMgr.getInstance().UpdateTrainProgress();
    }
    
    public function GetQueueByCityId(cityId : int) : List.<SelectiveDefenseQueueItem>
    {
        var ltItem : List.<SelectiveDefenseQueueItem> = new List.<SelectiveDefenseQueueItem>();
        for (var baseQueue : BaseQueue in this.GetQueueList())
        {
            for (var item : SelectiveDefenseQueueItem in baseQueue.GetData())
            {
                if (item.cityId == cityId)
                    ltItem.Add(item);
            }
        }
        return ltItem;
    }
    
    public function Queue() : List.<SelectiveDefenseQueueItem>
    {
        var curCityId : int = GameMain.instance().getCurCityId();
        return GetQueueByCityId(curCityId);
    }
    
    public function get HaveEmptyDeployingSlot() : boolean
    {
        return this.Queue().Count == 0;
    }
    
    public function queueItemRemoved(qItem : QueueItem, qId : int):void
    {
        var item : SelectiveDefenseQueueItem = qItem as SelectiveDefenseQueueItem;
        if (item == null)
        {
            return;
        }
        
        var seed : HashObject = GameMain.instance().getSeed();
        if (seed["selective_defense"] == null)
        {
            seed["selective_defense"] = new HashObject();
        }

        seed["selective_defense"]["c" + item.cityId] = new HashObject();
        for (var unitData : KeyValuePair.<int, int> in item.GetUnitsData())
        {
            seed["selective_defense"]["c" + item.cityId]["u" + unitData.Key] = new HashObject(unitData.Value);
        }
        GameMain.instance().invokeUpdateSeedInTime(2);
    }
    
    private function priv_addQueueItem(cityId : int, queueId : int, src : HashObject) : void
    {
        if ( _Global.INT32(src["status"]) == 0 )
            return;
        var queueItem : SelectiveDefenseQueueItem = new SelectiveDefenseQueueItem(cityId, queueId, src);
        add2Queue(queueItem, queueId);
    }
}
