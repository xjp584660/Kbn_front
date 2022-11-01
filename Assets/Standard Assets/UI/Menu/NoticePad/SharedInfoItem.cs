using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using _Global = KBN._Global;

public class SharedInfoItem : BaseTileShareItem
{
    public override void Init()
    {
        base.Init();
        backgroundPic.setBackground("Quest_kuang", TextureType.DECORATION);
    }

    protected override void OnClickAttack(object param)
    {
        // KBN.MenuMgr.instance.PushMenu("MarchMenu", new Hashtable() {
        //     {"x", tmpdata.coordinateX},
        //     {"y", tmpdata.coordinateY},
        //     {"type", Constant.MarchType.ATTACK},
        // }, "trans_zoomComp");
        KBN.GameMain.singleton.SetMarchData(
            new Hashtable() 
            {
            {"x", tmpdata.coordinateX},
            {"y", tmpdata.coordinateY},
            {"type", Constant.MarchType.ATTACK},
            }
        );
    }
    
    protected override void OnClickAbandon(object param)
    {
        PvPToumamentInfoData.instance().RequestAbandonTileByTileId(tmpdata.tileid);
    }
    
    protected override void OnClickSupport(object param)
    {
        // KBN.MenuMgr.instance.PushMenu("MarchMenu", new Hashtable() {
        //     {"x", tmpdata.coordinateX},
        //     {"y", tmpdata.coordinateY},
        //     {"type", Constant.MarchType.REINFORCE}
        // }, "trans_zoomComp");
        KBN.GameMain.singleton.SetMarchData(
             new Hashtable() 
             {
                {"x", tmpdata.coordinateX},
                {"y", tmpdata.coordinateY},
                {"type", Constant.MarchType.REINFORCE}
             }
        );
    }
    
    protected override void OnClickDefault(object param)
    {
        base.OnClickDefault(param);
        if (!IsEdit)
        {
            KBN.MenuMgr.instance.pop2Menu("MainChrom");
            KBN.GameMain.singleton.setSearchedTileToHighlight(tmpdata.coordinateX, tmpdata.coordinateY);
            KBN.GameMain.singleton.gotoMap(tmpdata.coordinateX, tmpdata.coordinateY);
            MapMoveAnim.avoidForceUpdateWorldMapWithinSecond(2);
        }    
    }
}
