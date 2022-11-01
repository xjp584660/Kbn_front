using UnityEngine;
using System.Collections;

public class DailyQuestDataUseGearTierItem : DailyQuestDataAbstract
{
    public override DailyQuestType Type
    {
        get
        {
            return DailyQuestType.UseGearTierItem;
        }
    }
}
