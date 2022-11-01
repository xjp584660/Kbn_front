using UnityEngine;
using System.Collections;

public class DailyQuestDataBuilding : DailyQuestDataAbstract
{
    public int BuildingId { get; protected set; }
    public int TargetLevel { get; protected set; }

    public override DailyQuestType Type
    {
        get
        {
            return DailyQuestType.Building;
        }
    }

    public override void PopulateImageInfo(Label label)
    {
        label.useTile = true;
        label.tile = TextureMgr.instance().IconSpt().GetTile(BuildingId < 0 ? "bi_0" : "bi_" + BuildingId);
    }

    protected override void ParseParams(int[] paramArray)
    {
        BuildingId = (paramArray[0] == 99 ? -1 : paramArray[0]);
        TargetLevel = (paramArray[1] == 99 ? -1 : paramArray[0]);
    }

    public override void RunLink()
    {
        if (BuildingId < 0 || !KBN.Building.IsFieldBuilding(BuildingId))
        {
            RunLink(Constant.LinkerType.CITY, null);
        }
        else
        {
            RunLink(Constant.LinkerType.FIELD, null);
        }
    }

    public override void CheckProgress(object progressData)
    {
        var dict = progressData as Hashtable;
        int level = (int) dict["level"];
        int lastLevel = (int) dict["lastLevel"];
        int buildingId = (int) dict["buildingId"];

        if (level <= lastLevel)
        {
            return;
        }

        if (BuildingId > 0 && BuildingId != buildingId)
        {
            return;
        }

        if (TargetLevel > 0 && TargetLevel != level)
        {
            return;
        }

        IncreaseDoneCount(1);
    }
}
