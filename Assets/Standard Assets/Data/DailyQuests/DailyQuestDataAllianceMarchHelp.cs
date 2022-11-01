using UnityEngine;
using System.Collections;

using KBN;

public class DailyQuestDataAllianceMarchHelp : DailyQuestDataAbstract
{
    public int TargetMarchType { get; protected set; }

    public override DailyQuestType Type
    {
        get
        {
            return DailyQuestType.AllianceMarchHelp;
        }
    }

    protected override void ParseParams(int[] parameters)
    {
        TargetMarchType = -1;
        if (parameters.Length == 0)
        {
            return;
        }

        TargetMarchType = (parameters[0] == 99 ? -1 : parameters[0]);
    }

    public override void PopulateImageInfo(Label label)
    {
        label.useTile = false;
        label.mystyle.overflow = new RectOffset(0, 0, 0, 0);
        label.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_alliance_Invite", TextureType.ICON);
    }

    public override void RunLink()
    {
        RunLink(Constant.LinkerType.CHAT, "alliance");
    }

    public override void CheckProgress(object progressData)
    {
        int marchType = _Global.INT32(progressData);

        if (TargetMarchType >= 0 && TargetMarchType != marchType)
        {
            return;
        }

        IncreaseDoneCount(1);
    }
}
