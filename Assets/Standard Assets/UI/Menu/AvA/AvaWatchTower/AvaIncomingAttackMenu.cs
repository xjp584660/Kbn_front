using UnityEngine;
using System.Collections;

using Datas = KBN.Datas;
using _Global = KBN._Global;
using GameMain = KBN.GameMain;

public class AvaIncomingAttackMenu : PopMenu
{
    [SerializeField]
    private SimpleLabel splitLine;
    [SerializeField]
    private AvaIncomingAttackList list;
    [SerializeField]
    private AvaIncomingAttackDetail detail;

    private NavigatorController nc;

    public override void Init()
    {
        base.Init();
        InitTitle();
        list.Init();
        detail.Init();
        nc = new NavigatorController();
    }

    public override void OnPush(object param)
    {
        base.OnPush(param);
        nc.push(list);
    }

    public override void OnPushOver()
    {
        base.OnPushOver();
        list.RefreshData();
    }

    public override void handleNotification(string type, object body)
    {
        if (nc.topUI != list)
        {
            return;
        }

        switch (type)
        {
        case Constant.Notice.AvaInspectIncomingAttackDetail:
            int marchId = System.Convert.ToInt32(body);
            this.ViewDetail(marchId);
            break;
        default:
            list.HandleNotification(type, body);
            break;
        }
    }

    public override void OnPopOver()
    {
        list.OnPopOver();
        detail.OnPopOver();
        nc = null;
    }

    protected override void DrawItem()
    {
        splitLine.Draw();
        nc.DrawItems();
    }

    public override void Update()
    {
        base.Update();
        nc.u_Update();
    }

    public override void FixedUpdate()
    {
        base.FixedUpdate();
        nc.u_FixedUpdate();
    }

    private void InitTitle()
    {
        this.title.txt = Datas.getArString("AVA.chrome_attackmetitle");
        this.splitLine.setBackground("between line", TextureType.DECORATION);
    }

    private void ViewDetail(int marchId)
    {
        var rawData = GameMain.Ava.March.GetIncomingAttackById(marchId);

        if (rawData == null)
        {
            list.RefreshData();
            return;
        }

        nc.popedFunc = OnDetailPopOver;
        detail.SetUIData(new AvaIncomingAttackDetailData(rawData));
        detail.OnGoBack = () =>
        {
            if (nc == null || nc.topUI != this.detail)
            {
                return;
            }

            nc.pop();
        };
        nc.push(detail);
    }

    private void OnDetailPopOver(NavigatorController nc, UIObject ui)
    {
        nc.popedFunc = null;
        detail.Clear();
        list.RefreshData();
    }

	public override bool OnBackButton()
	{
		if(nc.topUI == detail)
		{
			nc.pop();
			return true;
		}
		return false;
	}
}
