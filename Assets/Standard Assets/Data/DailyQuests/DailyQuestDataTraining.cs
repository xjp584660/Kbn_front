using UnityEngine;
using System.Collections;

public class DailyQuestDataTraining : DailyQuestDataAbstract
{
    public int TroopId { get; protected set; }

    public override DailyQuestType Type
    {
        get
        {
            return DailyQuestType.Training;
        }
    }

    public override void PopulateImageInfo(Label label)
    {
        label.useTile = true;
        label.tile = TextureMgr.instance().IconSpt().GetTile(TroopId < 0 ? "bi_13_p1" : "ui_" + TroopId);
    }

    protected override void ParseParams(int[] paramArray)
    {
        TroopId = (paramArray[0] == 99 ? -1 : paramArray[0]);
    }

    public override void RunLink()
    {
        RunLink(Constant.LinkerType.TRAINING, null);
    }

    public override void CheckProgress(object progressData)
    {
        var dict = progressData as Hashtable;
        int troopId = (int) dict["uid"];
        int qty = (int) dict["qty"];

        if (TroopId > 0 && TroopId != troopId)
        {
            return;
        }

        IncreaseDoneCount(qty);
    }
}
