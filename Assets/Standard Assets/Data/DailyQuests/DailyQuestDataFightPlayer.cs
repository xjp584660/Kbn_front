using UnityEngine;
using System.Collections;

public class DailyQuestDataFightPlayer : DailyQuestDataFightWorldMap
{
    public override DailyQuestType Type
    {
        get
        {
            return DailyQuestType.FightPlayer;
        }
    }

    public override void PopulateImageInfo(Label label)
    {
        label.useTile = true;
        label.tile = TextureMgr.instance().IconSpt().GetTile("DailyQuestFightPlayer");
    }
}
