using UnityEngine;
using System.Collections;

public class DailyQuestDataGamble : DailyQuestDataAbstract
{
    public override DailyQuestType Type
    {
        get
        {
            return DailyQuestType.Gamble;
        }
    }

    public override void PopulateImageInfo(Label label)
    {
        label.useTile = false;
        label.mystyle.overflow = new RectOffset(-5, -5, 0, 0);
        label.mystyle.normal.background = TextureMgr.instance().LoadTexture("gamble_box", TextureType.BUTTON);
    }

    public override void RunLink()
    {
        RunLink(Constant.LinkerType.GAMBLE, null);
    }

    public override void CheckProgress(object progressData)
    {
        IncreaseDoneCount(1);
    }
}
