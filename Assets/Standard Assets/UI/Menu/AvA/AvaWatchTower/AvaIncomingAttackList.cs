using UnityEngine;
using System.Collections;
using System.Collections.Generic;

using ScrollList = KBN.ScrollList;
using _Global = KBN._Global;
using GameMain = KBN.GameMain;
using Datas = KBN.Datas;

public class AvaIncomingAttackList : UIObject
{
    [SerializeField]
    private SimpleLabel attackCounter;
    [SerializeField]
    private ScrollList scroll;
    [SerializeField]
    private AvaIncomingAttackItem itemTemplate;

    private const string AttackCounterKey = "WatchTower.IncomingAttacks";

    public override void Init()
    {
        base.Init();

        attackCounter.setBackground("square_black2", TextureType.DECORATION);
        attackCounter.txt = string.Format("{0}: {1}", Datas.getArString(AttackCounterKey), 0);

        scroll.Clear();
        scroll.ClearData2();
        scroll.Init(itemTemplate);
    }

    public void RefreshData()
    {
        var rawDataList = GameMain.Ava.March.IncomingAttackList;
        var dataList = new List<Hashtable>();
        for (int i = 0; i < rawDataList.Count; ++i)
        {
            var rawData = rawDataList[i];
            var data = new Hashtable();
            data["Id"] = rawData.marchId;
            data["Name"] = Datas.getArString(AvaUtility.GetTileNameKey(rawData.toTileType));
            data["CoordX"] = rawData.toXCoord;
            data["CoordY"] = rawData.toYCoord;
            if (rawData.destinationEtaSpecified)
            {
                data["Eta"] = rawData.destinationEta;
            }
            data["IsRally"] = (rawData.marchType == Constant.AvaMarchType.RALLYATTACK);
            dataList.Add(data);
        }
        dataList.Sort((x, y) => _Global.INT64(x["Eta"]).CompareTo(_Global.INT64(y["Eta"])));
        scroll.SetData(dataList);
        scroll.MoveToTop();
        attackCounter.txt = string.Format("{0}: {1}" , Datas.getArString(AttackCounterKey), dataList.Count);
    }

    public void HandleNotification(string type, object content)
    {
    }

    public override void OnPopOver()
    {
        base.OnPopOver();
        scroll.Clear();
        scroll.ClearData2();
    }

    public override int Draw()
    {
        GUI.BeginGroup(this.rect);
        attackCounter.Draw();
        scroll.Draw();
        GUI.EndGroup();
        return -1;
    }

    public override void Update()
    {
        base.Update();
        scroll.Update();
    }
}
