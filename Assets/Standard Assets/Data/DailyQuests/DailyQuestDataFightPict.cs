﻿using UnityEngine;
using System.Collections;

public class DailyQuestDataFightPict : DailyQuestDataFightWorldMap
{
	public override DailyQuestType Type
	{
		get
		{
			return DailyQuestType.FightPict;
		}
	}

    public override void PopulateImageInfo(Label label)
    {
        label.useTile = true;
        label.tile = TextureMgr.instance().IconSpt().GetTile("DailyQuestFightPict");
    }
}
