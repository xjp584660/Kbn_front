using UnityEngine;
using System.Collections;
using GameMain = KBN.GameMain;

public class AvaCoopRallyContent : UIObject
{
    private NavigatorController nc;

    [SerializeField]
    private AvaCoopRallyList rallyList;
    [SerializeField]
    private AvaRallyAttackDetail rallyDetail;

    public override void Init()
    {
        base.Init();
        nc = new NavigatorController();
        rallyList.Init();
        rallyDetail.Init();
    }

    public override int Draw()
    {
        nc.DrawItems();
        return -1;
    }

    public override void Update()
    {
        base.Update();
        this.nc.u_Update();
    }

    public override void FixedUpdate()
    {
        base.FixedUpdate();
        this.nc.u_FixedUpdate();
    }

    public void RequestAndInitData()
    {
        nc.clear();
        nc.push(rallyList);
        rallyList.RequestAndInitData();
    }

    public override void OnPopOver()
    {
        base.OnPopOver();
        rallyList.OnPopOver();
        rallyDetail.OnPopOver();
    }

    public void HandleNotification(string type, object content)
    {
        if (nc.topUI == rallyList)
        {
            switch (type)
            {
            case Constant.Notice.AvaCoopInspectRallyDetail:
                int rallyMarchId = System.Convert.ToInt32(content);
                this.ViewDetail(rallyMarchId);
                break;
            case Constant.Notice.AvaCoopRallyListRefreshed:
                rallyList.UpdateRallyList();
                break;
            case Constant.Notice.AvaCoopRallyDetailRefreshed:
                this.OnRallyDetailInfoRefreshed();
                break;
            }
        }
        else if (nc.topUI == rallyDetail)
        {
            rallyDetail.HandleNotification(type, content);
        }
    }

    private void ViewDetail(int rallyMarchId)
    {
        GameMain.Ava.RallyShare.RefreshRallyDetailInfo(rallyMarchId);
    }

    private void OnRallyDetailInfoRefreshed()
    {
        if (GameMain.Ava.RallyShare.CurrentDetail == null)
        {
            rallyList.RequestAndInitData();
            return;
        }

        nc.popedFunc = OnRallyDetailPop;
        this.rallyDetail.OnGoBack = () => 
        {
            if (nc == null || nc.topUI != this.rallyDetail)
            {
                return;
            }
            
            nc.pop();
        };
        this.rallyDetail.SetUIData(GameMain.Ava.RallyShare.CurrentDetail);
        nc.push(this.rallyDetail);
    }

    private void OnRallyDetailPop(NavigatorController nc, UIObject uiObj)
    {
        nc.popedFunc = null;
        rallyList.RequestAndInitData();
    }

	public bool OnBackButton()
	{
		if(!nc.isNormaState)
		{
			return true;
		}
		if(nc.topUI == rallyDetail)
		{
			nc.pop();
			return true;
		}
		return false;
	}
}
