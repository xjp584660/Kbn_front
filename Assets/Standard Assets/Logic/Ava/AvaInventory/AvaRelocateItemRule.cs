using System;

public class AvaRelocateItemRule : AvaUseItemRule
{
    private enum RelocateItemType
    {
        FixedPosition = 6800,
        RandomPosition = 6801,
        FixedPositionOnce = 6900,
        RandomPositionOnce = 6901,

    }

    public override int[] GetIdoneousItemTypes()
    {
        return new int[] { (int)RelocateItemType.FixedPosition, (int)RelocateItemType.RandomPosition, (int)RelocateItemType.FixedPositionOnce, (int)RelocateItemType.RandomPositionOnce };
    }

    public override bool ShowUse(AvaItem item)
    {
        return true;
    }

    public override bool CanUse(AvaItem item)
    {
        if (KBN.GameMain.Ava.Event.CurStatus != AvaEvent.AvaStatus.Combat)
        {
            return false;
        }

        return true;
    }

    public override void Use(AvaItem item, object[] args)
    {
        if (item.Type == (int)RelocateItemType.FixedPosition || item.Type == (int)RelocateItemType.FixedPositionOnce)
        {
            if (args != null && args.Length >= 2)
            {
                PBMsgReqAVARelocate.PBMsgReqAVARelocate request = new PBMsgReqAVARelocate.PBMsgReqAVARelocate();
                request.itemId = item.Type;
                request.xCoord = (int)args[0];
                request.xCoordSpecified = true;
                request.yCoord = (int)args[1];
                request.yCoordSpecified = true;
                KBN.UnityNet.RequestForGPB("avaRelocate.php", request, OnUseItemOK);
            }
            else
            {
                KBN.MenuMgr.instance.PushMenu("AvaTeleport", item.Type, "trans_zoomComp");
            }
        }
        else if (item.Type == (int)RelocateItemType.RandomPosition || item.Type == (int)RelocateItemType.RandomPositionOnce)
        {
            PBMsgReqAVARelocate.PBMsgReqAVARelocate request = new PBMsgReqAVARelocate.PBMsgReqAVARelocate();
            request.itemId = item.Type;
            request.xCoordSpecified = false;
            request.yCoordSpecified = false;
            KBN.UnityNet.RequestForGPB("avaRelocate.php", request, OnUseItemOK);
        }
        else
        {
            throw new NotSupportedException();
        }
    }
    
    private void OnUseItemOK(byte[] data)
    {
        PBMsgAVARelocate.PBMsgAVARelocate pbMessage = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVARelocate.PBMsgAVARelocate>(data);
        KBN.MyItems.singleton.subtractItem(pbMessage.itemId);
        KBN.MenuMgr.instance.PopMenu("AvaTeleport");
        KBN.Game.Event.Fire(this, new KBN.AvaMoveTileEventArgs(pbMessage.oldxCoord, pbMessage.oldyCoord, pbMessage.xCoord, pbMessage.yCoord));
        KBN.Game.Event.Fire(this, new KBN.AvaUseItemEventArgs(pbMessage.itemId));
        KBN.MenuMgr.instance.PushMessage(KBN.Datas.getArString("ToastMsg.UseItem"));
    }
}
