using UnityEngine;
using System.Collections;
using Datas = KBN.Datas;
using ScrollList = KBN.ScrollList;
using GameMain = KBN.GameMain;
using _Global = KBN._Global;

public class AvaCoopRallyList : UIObject
{
    [SerializeField]
    private ScrollList scrollList;
    [SerializeField]
    private Label emptyText;
    [SerializeField]
    private AvaCoopRallyItem itemTemplate;

    public override void Init()
    {
        base.Init();
        scrollList.Init(itemTemplate);
        emptyText.txt = Datas.getArString("AVA.NoRallyMarch");
    }

    public override void OnPopOver()
    {
        base.OnPopOver();
        scrollList.Clear();
        scrollList.ClearData2();
    }

    public void RequestAndInitData()
    {
        _Global.Log("[AvaCoopRallyList RequestAndInitData]");
        scrollList.Clear();
        scrollList.ClearData2();
        GameMain.Ava.RallyShare.RefreshRallyList();
    }

    public override void Update()
    {
        base.Update();
        scrollList.Update();
    }

    public override int Draw()
    {
        GUI.BeginGroup(this.rect);
        scrollList.Draw();
        if (scrollList.GetDataLength() <= 0)
        {
            emptyText.Draw();
        }
        GUI.EndGroup();
        return -1;
    }

    public void UpdateRallyList()
    {
        scrollList.SetData(GameMain.Ava.RallyShare.Summary);
        scrollList.AutoLayout();
        scrollList.ResetPos();
    }
}
