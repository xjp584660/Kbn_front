using UnityEngine;
using System.Collections;
using System;

using GameMain = KBN.GameMain;
using MenuMgr = KBN.MenuMgr;
using Datas = KBN.Datas;

public class AvaCoopTileShareItem : BaseTileShareItem
{
    public override void Init()
    {
        base.Init();
        this.cityName.setBackground("square_black", TextureType.DECORATION);
        this.backgroundPic.setBackground("square_black", TextureType.DECORATION);
    }

    public override void SetRowData(object data)
    {
        base.SetRowData(data);
        var castedData = (tmpdata as AvaSharedTileInfoData);
        cityName.txt = Datas.getArString(AvaUtility.GetTileNameKey(castedData.TileType));
        cityLevel.txt = "";

        // My own outpost
        if (castedData.tileid == GameMain.Ava.Seed.MyOutPostTileId)
        {
            buttonSelect.SetVisible(false);
        }
    }

    protected override void OnClickAttack(object param)
    {
        // MenuMgr.instance.PushMenu("MarchMenu", new Hashtable
        // {
        //     { "x", this.tmpdata.coordinateX },
        //     { "y", this.tmpdata.coordinateY },
        //     { "ava", 1 },
        //     { "types", new int[]
        //         { Constant.AvaMarchType.ATTACK, Constant.AvaMarchType.RALLYATTACK }
        //     },
        // }, "trans_zoomComp");
        KBN.GameMain.singleton.SetMarchData(new Hashtable
            {
                { "x", this.tmpdata.coordinateX },
                { "y", this.tmpdata.coordinateY },
                { "ava", 1 },
                { "types", new int[]
                    { Constant.AvaMarchType.ATTACK, Constant.AvaMarchType.RALLYATTACK }
                },
            }
        );
    }
    
    protected override void OnClickAbandon(object param)
    {
        GameMain.Ava.TileShare.AbandonTile(tmpdata.tileid);
    }
    
    protected override void OnClickSupport(object param)
    {
        // MenuMgr.instance.PushMenu("MarchMenu", new Hashtable
        // {
        //     { "x", this.tmpdata.coordinateX },
        //     { "y", this.tmpdata.coordinateY },
        //     { "ava", 1 },
        //     { "type", Constant.AvaMarchType.REINFORCE },
        // }, "trans_zoomComp");
              KBN.GameMain.singleton.SetMarchData( new Hashtable
            {
                { "x", this.tmpdata.coordinateX },
                { "y", this.tmpdata.coordinateY },
                { "ava", 1 },
                { "type", Constant.AvaMarchType.REINFORCE },
            }
        );
    }
    
    protected override void OnClickDefault(object param)
    {
        base.OnClickDefault(param);

        if (!IsEdit)
        {
            if (MenuMgr.instance.hasMenuByName("AvaMainChrome"))
            {
                MenuMgr.instance.pop2Menu("AvaMainChrome");
            }
            GameMain.singleton.setSearchedTileToHighlight2(tmpdata.coordinateX, tmpdata.coordinateY);
            GameMain.singleton.gotoMap2(tmpdata.coordinateX, tmpdata.coordinateY);
        }
    }

    protected override void OnSelect(bool selected)
    {
        base.OnSelect(selected);
        MenuMgr.instance.sendNotification(Constant.Notice.AvaCoopTileShareItemSelectionChanged, null);
    }
}
