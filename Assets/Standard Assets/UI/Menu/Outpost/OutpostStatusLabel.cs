using UnityEngine;
using System.Collections;

using GameMain = KBN.GameMain;

public class OutpostStatusLabel : UIObject {

    [SerializeField]
    private SimpleLabel lbBg;
    [SerializeField]
    private SimpleLabel lbFg;


    public override void Init ()
    {
        base.Init ();

        lastUpdateTime = 0f;

        lbBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Decorative_strips2", TextureType.DECORATION);
        lbFg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Decorative_strips2", TextureType.DECORATION);

        lbFg.txt = string.Empty;
    }

    public override int Draw ()
    {
        base.Draw ();

        if (!visible)
            return -1;

        GUI.BeginGroup(rect);

        lbBg.Draw();
        lbFg.Draw();

        GUI.EndGroup();

        return -1;
    }

    private float lastUpdateTime = 0f;

    public override void Update ()
    {
        base.Update ();

        float now = Time.realtimeSinceStartup;
        if (now - lastUpdateTime < 0.5f) 
            return;

        lastUpdateTime = now;

        lbFg.txt = GameMain.Ava.Event.GetLeftTimeTips();
    }

}
