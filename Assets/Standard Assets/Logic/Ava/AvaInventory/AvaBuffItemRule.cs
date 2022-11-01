using System;

public class AvaBuffItemRule : AvaUseItemRule
{
    public override int[] GetIdoneousItemTypes()
    {
        return new int[] { 6806, 6807, 6808, 6809, 6810, 6811, 6906, 6907, 6908, 6909, 6910, 6911 };
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

        long buffEndTime = KBN.GameMain.PlayerBuffs.AvaSelfRunningBuffs.GetRunningBuffEndTimeBy(item.BuffId, BuffSource.Item);
        long avaEndTime = KBN.GameMain.Ava.Event.GetCombatEndTime();
        if (buffEndTime >= avaEndTime)
        {
            return false;
        }

        return true;
    }

    public override void Use(AvaItem item, object[] args)
    {
        PBMsgReqAVAItemUse.PBMsgReqAVAItemUse request = new PBMsgReqAVAItemUse.PBMsgReqAVAItemUse
        {
            itemId = item.Type,
        };
        
        KBN.UnityNet.RequestForGPB("avaBuffItemUse.php", request, OnUseItemOK);
    }

    private void OnUseItemOK(byte[] data)
    {
        PBMsgReqAVAItemUse.PBMsgReqAVAItemUse pbMessage = KBN._Global.DeserializePBMsgFromBytes<PBMsgReqAVAItemUse.PBMsgReqAVAItemUse>(data);
        KBN.MyItems.singleton.subtractItem(pbMessage.itemId);
        AvaItem avaItem = KBN.GameMain.Ava.Inventory.GetItem(pbMessage.itemId);
        if (avaItem == null)
        {
            throw new NullReferenceException("Ava item is null.");
        }

        KBN.GameMain.PlayerBuffs.AddTimeToRunningBuff(avaItem.BuffId, BuffSource.Item, avaItem.Duration);
        KBN.Game.Event.Fire(this, new KBN.AvaUseItemEventArgs(pbMessage.itemId));
        KBN.MenuMgr.instance.PushMessage(KBN.Datas.getArString("ToastMsg.UseItem"));
    }
}
