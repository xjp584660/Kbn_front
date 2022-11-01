using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using GameMain = KBN.GameMain;
using MenuMgr = KBN.MenuMgr;

/// <summary>
/// Share rally info in AVA co-op.
/// </summary>
public class AvaRallyShare : AvaModule
{
    public List<AvaRallySummaryInfo> Summary { get; private set; }

    public AvaRallyDetailInfo CurrentDetail { get; private set; }

    public AvaRallyShare(AvaManager avaEntry)
        : base(avaEntry)
    {
        Summary = new List<AvaRallySummaryInfo>();
    }

    public void RefreshRallyList()
    {
        List<AvaBaseMarch> l = GameMain.Ava.March.GetRallyAttackList();

        this.Summary.Clear();
        foreach (var march in l)
        {
            this.Summary.Add(new AvaRallySummaryInfo(march as AvaRallyAttack));
        }

        MenuMgr.instance.SendNotification(Constant.Notice.AvaCoopRallyListRefreshed, null);
    }

    public void RefreshRallyDetailInfo(int rallyMarchId)
    {
        var rallyRawData = GameMain.Ava.March.GetMarchById(rallyMarchId) as AvaRallyAttack;

        if (rallyRawData == null)
        {
            CurrentDetail = null;
        }
        else if (rallyRawData.Status != Constant.AvaMarchStatus.RALLYING && rallyRawData.Status != Constant.AvaMarchStatus.OUTBOUND)
        {
            CurrentDetail = null;
        }
        else
        {
            CurrentDetail = new AvaRallyDetailInfo(rallyRawData);
        }

        MenuMgr.instance.SendNotification(Constant.Notice.AvaCoopRallyDetailRefreshed, null);
    }
}
