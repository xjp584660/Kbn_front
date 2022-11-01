using UnityEngine;
using System.Collections;

public class DailyQuestDataExploration : DailyQuestDataAbstract
{
    public override DailyQuestType Type
    {
        get
        {
            return DailyQuestType.Exploration;
        }
    }

    public override void PopulateImageInfo(Label label)
    {
        label.useTile = false;
        label.mystyle.overflow = new RectOffset(0, 50, 0, 0);
        label.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_morgause_images", TextureType.DECORATION);
    }

    public override void RunLink()
    {
        RunLink(Constant.LinkerType.HERO_HOUSE, null);
    }

    public override void CheckProgress(object progressData)
    {
        IncreaseDoneCount(1);
    }
}
