using UnityEngine;
using System.Collections;

public class RequirePopMenu : PopMenu {

    [SerializeField]
    private SimpleLabel lbSeparator;

    [SerializeField]
    private SimpleLabel lbDesc;

    [SerializeField]
    private RequireContent requires;

    public override void Init ()
    {
        base.Init ();

        lbSeparator.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line", TextureType.DECORATION);

        requires.Init();
    }

    public override void OnPush (object param)
    {
        base.OnPush (param);

        Hashtable data = param as Hashtable;
        if (null == data) {
            return;
        }

        title.txt = data["title"].ToString();
        lbDesc.txt = data["description"].ToString();

        Requirement[] requirements = data["requiremenets"] as Requirement[];

        requires.showRequire(requirements, true);
    }

    public override void OnPopOver ()
    {
        base.OnPopOver ();

        requires.Clear();
    }

    protected override void DrawItem ()
    {
        base.DrawItem ();

        lbSeparator.Draw();
        lbDesc.Draw();

        requires.Draw();
    }

    public override void Update ()
    {
        base.Update ();

        requires.Update();
    }
}
