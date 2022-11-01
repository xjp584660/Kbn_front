using UnityEngine;
using System.Collections;

public class AvaBuffStatsItem : FullClickItem
{
    public Label l_buffIcon;
    public Label l_yourBuff;
    public Label l_enemyBuff;

    private AvaInfoItemData _data;

    public override void Init()
    {
        base.Init();

        btnDefault.alpha = 0.3f;
    }

    public override void SetRowData(object data)
    {
        base.SetRowData(data);

        _data = data as AvaInfoItemData;
        l_buffIcon.useTile = true;
		l_buffIcon.tile = TextureMgr.instance().IconSpt().GetTile(_data.name);
        //l_buffIcon.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_blue_1", TextureType.ICON_ELSE);
        l_yourBuff.txt = _data.yourData.ToString() + "%";
        l_enemyBuff.txt = _data.enemyData.ToString() + "%";
    }

    public override int Draw()
    {
        GUI.BeginGroup(rect);
        l_buffIcon.Draw();
        l_yourBuff.Draw();
        l_enemyBuff.Draw();
		line.Draw();
        GUI.EndGroup();

        return -1;
    }
}
