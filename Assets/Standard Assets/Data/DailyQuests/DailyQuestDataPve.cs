using UnityEngine;
using System.Collections;

public class DailyQuestDataPve : DailyQuestDataAbstract
{
    public override DailyQuestType Type
    {
        get
        {
            return DailyQuestType.Pve;
        }
    }

    public override void PopulateImageInfo(Label label)
    {
        label.useTile = false;
        label.mystyle.overflow = new RectOffset(0, 0, 0, 0);
        label.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_icon_campaign", TextureType.BUTTON);
    }

    public override void RunLink()
    {
        RunLink(Constant.LinkerType.PVE, null);
    }

    public override void CheckProgress(object progressData)
    {
        int staminaCost = KBN._Global.INT32(progressData);
        IncreaseDoneCount(staminaCost);
    }
}
