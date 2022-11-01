using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class DailyQuestDataHealing : DailyQuestDataAbstract
{
    public int TroopId { get; protected set; }

    public override DailyQuestType Type
    {
        get
        {
            return DailyQuestType.Healing;
        }
    }

    public override void PopulateImageInfo(Label label)
    {
        label.useTile = true;
        label.tile = TextureMgr.instance().IconSpt().GetTile("bi_22");
    }

    protected override void ParseParams(int[] paramArray)
    {
        TroopId = (paramArray[0] == 99 ? -1 : paramArray[0]);
    }

    public override void RunLink()
    {
        RunLink(Constant.LinkerType.HEAL, null);
    }

    public override void CheckProgress(object progressData)
    {
        var unitData = progressData as IEnumerable<KeyValuePair<int, int>>;

        int delta = 0;
        foreach (var kvPair in unitData)
        {
            if (TroopId > 0 && TroopId != kvPair.Key)
            {
                continue;
            }

            delta += kvPair.Value;
        }

        IncreaseDoneCount(delta);
    }
}
