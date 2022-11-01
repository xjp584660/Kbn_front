using UnityEngine;
using System.Collections;

public class DailyQuestDataForgeGear : DailyQuestDataAbstract
{
    public int TargetGearType { get; protected set; }
    public int TargetGearLevel { get; protected set; }

    public override DailyQuestType Type
    {
        get
        {
            return DailyQuestType.ForgeGear;
        }
    }

    protected override void ParseParams(int[] paramArray)
    {
        TargetGearType = -1;
        TargetGearLevel = -1;

        if (paramArray.Length < 2)
        {
            return;
        }

        TargetGearType = paramArray[0] == 99 ? -1 : paramArray[0];
        TargetGearLevel = paramArray[1] == 99 ? -1 : paramArray[1];
    }

    public override void PopulateImageInfo(Label label)
    {
        label.useTile = false;
        label.mystyle.overflow.right = 0;
        label.mystyle.normal.background = TextureMgr.instance().LoadTexture("GearChromeIconNormal", TextureType.BUTTON);
    }

    public override void RunLink()
    {
        RunLink(Constant.LinkerType.BLACKSMITH, "equipment");
    }

    public override void CheckProgress(object progressData)
    {
        var progressDict = progressData as Hashtable;

        if (progressDict == null)
        {
            return;
        }

        int gearType = (int) progressDict["gearType"];
        int currentLevel = (int) progressDict["currentLevel"];

        if (TargetGearType >= 0 && TargetGearType != gearType)
        {
            return;
        }

        if (TargetGearLevel >= 0 && TargetGearLevel != currentLevel)
        {
            return;
        }

        IncreaseDoneCount(1);
    }
}
