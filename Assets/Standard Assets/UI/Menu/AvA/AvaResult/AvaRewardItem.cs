using UnityEngine;
using System.Collections;

public class AvaRewardItem : FullClickItem
{
    public SimpleLabel rewardIcon;
    public SimpleLabel rewardTitle;
    public SimpleLabel rewardDesc;
	public SimpleLabel Bg;

    public override void Init()
    {
        base.Init();

        btnDefault.alpha = 0.3f;
		Bg.setBackground ("ui_chat_white1", TextureType.DECORATION);
    }

    public override void SetRowData(object data)
    {
        PBMsgAVAResult.PBMsgAVAResult.Reward _data = data as PBMsgAVAResult.PBMsgAVAResult.Reward;
        if (_data != null)
        {
            string iconName = TextureMgr.instance().LoadTileNameOfItem(_data.itemId);
            rewardIcon.useTile = true;
            rewardIcon.tile = TextureMgr.instance().IconSpt().GetTile(iconName);

            rewardTitle.txt = KBN.Datas.getArString("itemName." + "i" + _data.itemId);
            rewardDesc.txt = KBN.Datas.getArString("itemDesc." + "i" + _data.itemId);
        }
    }

    public override int Draw()
    {
//        base.Draw();

        GUI.BeginGroup(rect);
		Bg.Draw ();
        rewardIcon.Draw();
        rewardTitle.Draw();
        rewardDesc.Draw();
        GUI.EndGroup();

        return -1;
    }
}
