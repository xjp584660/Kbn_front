using UnityEngine;
using System.Collections;
using GameMain = KBN.GameMain;
using Datas = KBN.Datas;

public class AvaRallySummaryInfo
{
    public int Id { get; set; }
    public int StarterPlayerId { get; set; }
    public string StarterPlayerName { get; set; }
    public string GeneralName { get; set; }
    public int CityOrder { get; set; }
    public long TroopCount { get; set; }
    public int MaxMarchSlotCnt { get; set; }
    public int CurMarchSlotCnt { get; set; }

    public long StartingTime { get; set; }
    public long LeavingTime { get; set; }
    public long BattleTime { get; set; }
    public string TargetTileTypeName { get; set; }

    public AvaRallySummaryInfo(AvaRallyAttack rawData)
    {
        var marchData = rawData.MarchData;
        StarterPlayerId = marchData.fromPlayerId;
        StarterPlayerName = marchData.fromPlayerName;

        var rallyData = marchData.rallyAttackInfo;
        var rallyPlayers = rallyData.rallyPlayerList;

        var rallyStarter = rallyPlayers[0];
        GeneralName = rallyStarter.knightName;
        CityOrder = rallyStarter.knightCityOrder;

        TroopCount = rawData.TroopCount;

        MaxMarchSlotCnt = rallyData.rallyNumber;
        CurMarchSlotCnt = rallyPlayers.Count;

        StartingTime = (long)(marchData.marchTimestamp);
        LeavingTime = (long)(rallyData.leaveTime);
        BattleTime = (long)(marchData.destinationEta);
        TargetTileTypeName = Datas.getArString(AvaUtility.GetTileNameKey(marchData.toTileType));

        Id = marchData.marchId;
    }
}
