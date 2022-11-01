using UnityEngine;
using System.Collections;
using KBN;

public class DailyQuestDataResetGear : DailyQuestDataAbstract
{
    public int TargetGearType { get; protected set; }

    public override DailyQuestType Type
    {
        get
        {
            return DailyQuestType.ResetGear;
        }
    }

    protected override void ParseParams(int[] paramArray)
    {
        TargetGearType = -1;
        
        if (paramArray.Length < 1)
        {
            return;
        }
        
        TargetGearType = paramArray[0] == 99 ? -1 : paramArray[0];
    }

    public override void PopulateImageInfo(Label label)
    {
        label.useTile = true;
        label.tile = TextureMgr.instance().IconSpt().GetTile("DailyQuestResetGear");
    }

    public override void RunLink()
    {
        RunLink(Constant.LinkerType.BLACKSMITH, "equipment");
    }

    public override void CheckProgress(object progressData)
    {
        int gearType = (int) progressData;

        if (TargetGearType >= 0 && TargetGearType != gearType)
        {
            return;
        }

        IncreaseDoneCount(1);
    }
}
