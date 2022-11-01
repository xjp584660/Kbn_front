using UnityEngine;
using System.Collections;

public class DailyQuestDataWorldBoss : DailyQuestDataAbstract
{
    public override DailyQuestType Type
    {
        get
        {
            return DailyQuestType.WorldBoss;
        }
    }

    public override void RunLink()
    {
        RunLink(Constant.LinkerType.WORLD, null);
    }
}
