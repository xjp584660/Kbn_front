using UnityEngine;
using System.Collections;

public class AvaInfoItem : FullClickItem
{
    public Label l_Name;
    public Label l_You;
    public Label l_Enemy;

    private AvaInfoItemData _data;

    public override void Init()
    {
        base.Init();
        btnDefault.alpha = 0;
    }

    public override void SetRowData(object data)
    {
        _data = data as AvaInfoItemData;
        l_Name.txt = _data.name;
        if (_data.type == AvaInfoItemData.DataType.PLAIN)
        {
            l_You.txt = _data.yourData.ToString();
            l_Enemy.txt = _data.enemyData.ToString();
        }
        else if (_data.type == AvaInfoItemData.DataType.TIME)
        {
			l_You.txt = KBN._Global.timeFormatStr(KBN._Global.INT64(_data.yourData));
			l_Enemy.txt = KBN._Global.timeFormatStr(KBN._Global.INT64(_data.enemyData));
        }
    }

    public override int Draw()
    {
        base.Draw();

        GUI.BeginGroup(rect);
        l_Name.Draw();
        l_You.Draw();
        l_Enemy.Draw();
        GUI.EndGroup();

        return -1;
    }

    public override void Update()
    {
        base.Update();
    }
}
