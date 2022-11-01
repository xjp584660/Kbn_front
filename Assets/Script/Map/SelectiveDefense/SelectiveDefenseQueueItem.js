#pragma strict
import System.Collections.Generic;
import System.Collections;

public class SelectiveDefenseQueueItem extends QueueItem
{
    private var unitsData : Dictionary.<int, int> = new Dictionary.<int, int>();
    private var totalUnit : int;
    
    public function get TotalUnit() : int
    {
        return totalUnit;
    }
    
    public function GetUnitsData() : IEnumerable.< KeyValuePair.<int, int> >
    {
        for (var pair : KeyValuePair.<int, int> in unitsData)
        {
            yield pair;
        }
    }
    
    public function SelectiveDefenseQueueItem(cityId : int, queueId : int, startTime : long, endTime : long,
        units : IEnumerable.< KeyValuePair.<int, int> >)
    {
        this.cityId = cityId;
        this.id = queueId;
        this.classType = QueueType.SelectiveDefense;
        this.startTime = startTime;
        this.endTime = endTime;
        this.timeRemaining = endTime - startTime;
        
        totalUnit = 0;
        for (var unit : KeyValuePair.<int, int> in units)
        {
            unitsData[unit.Key] = unit.Value;
            totalUnit += unit.Value;
        }
    }
    
    public function SelectiveDefenseQueueItem(cityId : int, queueId : int, src : HashObject)
    {
        this.cityId = cityId;
        this.id = queueId;
        this.classType = QueueType.SelectiveDefense;
        this.startTime = _Global.INT64(src["startTime"]);
        this.endTime = _Global.INT64(src["endTime"]);
        this.timeRemaining = endTime - startTime;
        
        totalUnit = 0;
        for (var key : String in _Global.GetObjectKeys(src["data"]))
        {
            var unitId : int = _Global.INT32(key.Split("u"[0])[1]);
            var troopCount = _Global.INT32(src["data"][key]);
            if (troopCount <= 0)
            {
                continue;
            }
            unitsData.Add(unitId, troopCount);
            totalUnit += troopCount;
        }
    }
}