using UnityEngine;
using System.Collections;

public class AvaTroopReportItem : FullClickItem
{
    public SimpleLabel type;
    public SimpleLabel dead;
    public SimpleLabel bruise;
    public SimpleLabel hospital;

    public float clipWidth;

    public override void Init()
    {
        base.Init();

        btnDefault.alpha = 0.3f;
    }

    public override void SetRowData(object data)
    {
        PBMsgAVAResult.PBMsgAVAResult.Troop _data = data as PBMsgAVAResult.PBMsgAVAResult.Troop;
        if (_data != null)
        {
            string troopType = KBN.Datas.getArString("unitName.u" + _data.type.ToString());
            type.txt = KBN._Global.GUIClipToWidth(type.mystyle, troopType, clipWidth, "...", null);
            dead.txt = _data.fight.ToString();
            bruise.txt = _data.survive.ToString();
            hospital.txt = _data.injure.ToString();
        }
    }

    public override int Draw()
    {
        base.Draw();

        GUI.BeginGroup(rect);
        type.Draw();
        dead.Draw();
        bruise.Draw();
        hospital.Draw();
        GUI.EndGroup();

        return -1;
    }
}
