using UnityEngine;
using System.Collections;

using _Global = KBN._Global;

public abstract class GameEventDetailInfoBase
{
    public int Id { get; protected set; }

    public int RewardType { get; protected set; }

    public string PrizeStatus { get; protected set; }

    public string Status { get; protected set; }

    public string ImageName { get; protected set; }

    public long StartTime { get; protected set; }

    public long EndTime { get; protected set; }

    public long RewardEndTime { get; protected set; }

    public string Desc1 { get; protected set; }

    public string Desc2 { get; protected set; }

    public string Name { get; protected set; }

    public Constant.EventCenter.GameEventType GameEventType { get; protected set; }

    public GameEventDetailInfoBase(HashObject main, HashObject detail)
    {
        Id =_Global.INT32(main["eventId"]);
        ImageName = _Global.GetString(main["image"]);
        RewardType = _Global.INT32(main["rewardType"]);
        StartTime = _Global.INT64(main["startTime"]);
        EndTime = _Global.INT64(main["endTime"]);
        RewardEndTime = _Global.INT64(main["rewardEndTime"]);
        PrizeStatus = _Global.GetString(main["prize"]);
        Status = _Global.GetString(main["status"]);
        Desc1 = _Global.GetString(main["desc1"]);
        Desc2 = _Global.GetString(main["desc2"]);
        Name = _Global.GetString(main["name"]);
    }
}
