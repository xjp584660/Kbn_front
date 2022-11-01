using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;
using KBN.DataTable;
using System;

public class AvaBuffInfoPopMenu : PopMenu
{
    public KBN.ScrollList scrollList;
    public AvaBuffInfoItem itemTemplate;

    public Label divideLabel;

    public override void Init()
    {
        base.Init();

        btnClose.Init();
        btnClose.OnClick = new System.Action<System.Object>((param) => {
            KBN.MenuMgr.instance.PopMenu("AvaBuffInfoPopMenu");
        });

        divideLabel.Init();
        divideLabel.setBackground("between line", TextureType.DECORATION);

        itemTemplate.Init();
        scrollList.Init(itemTemplate);

		FillBuffData ();

        scrollList.ResetPos();
		title.txt = Datas.getArString("AVA.stats_YourAllianceBuffInfo");
    }
	
    protected override void DrawItem()
    {
        base.DrawItem();

        divideLabel.Draw();
        scrollList.Draw();
    }

    public override void Update()
    {
        base.Update();

        scrollList.Update();
    }

    public override void OnPush(object param)
    {
        base.OnPush(param);
    }

    public override void OnPop()
    {
        base.OnPop();
    }

    public override void OnPopOver()
    {
        base.OnPopOver();

        scrollList.Clear();
    }

	private void FillBuffData()
	{
		List<AvaBuffInfoItem.DataStruct> listData = new List<AvaBuffInfoItem.DataStruct> ();
		RunningBuffs myRunBuffs = GameMain.PlayerBuffs.AvaSelfRunningBuffs;
		BuffSubtarget allType = new BuffSubtarget (BuffSubtargetType.UnitType, 0);
		
		GDS_AVABuffList avaBuffListGds = GameMain.GdsManager.GetGds<GDS_AVABuffList>();
		Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection dataItems  = avaBuffListGds.GetItems ();
        int avaMode = _Global.INT32(GameMain.Ava.Event.CurAvaType);
		foreach(AVABuffList dataItem in dataItems)
		{
            if(avaMode == 0 && (dataItem.ID == 10 || dataItem.ID == 11))
            {
                continue;
            }

            //_Global.LogWarning("ID : " + dataItem.ID);
			BuffTarget tempTarget = (BuffTarget)Enum.Parse(typeof( BuffTarget), dataItem.TARGET.ToString());
			BuffSubtarget tempSubtarget = new BuffSubtarget (dataItem.SUB_TARGET);
			
			float homePercent = 0f;
			float tilePercent = 0f;
			homePercent += myRunBuffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, tempSubtarget, BuffSource.AllianceSkill).Percentage;
			homePercent += myRunBuffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, allType, BuffSource.AllianceSkill).Percentage;
            //_Global.LogWarning("homePercent : " + homePercent);
            if(dataItem.ID == 10 || dataItem.ID == 11)
            {
                tilePercent += myRunBuffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, tempSubtarget, BuffSource.AvaTile).Percentage;
                //_Global.LogWarning("tilePercent1 : " + tilePercent);
            }
            else
            {
                tilePercent += myRunBuffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, tempSubtarget, BuffSource.AvaTile).Percentage;
                //_Global.LogWarning("tilePercent1 : " + tilePercent);
                tilePercent += myRunBuffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, allType, BuffSource.AvaTile).Percentage;
                //_Global.LogWarning("tilePercent2 : " + tilePercent);
            }
			
			int skill24BuffCount = _Global.INT32(myRunBuffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, allType, BuffSource.AvaTile).Percentage * 100f / 5f);
            //_Global.LogWarning("skill24BuffCount : " + skill24BuffCount);
			float skill24BuffValue = 0f;
			skill24BuffValue += GameMain.PlayerBuffs.mySkill24BuffsValue * skill24BuffCount;
            //_Global.LogWarning("skill24BuffValue : " + skill24BuffValue);
			tilePercent += skill24BuffValue;
            //_Global.LogWarning("tilePercent3 : " + tilePercent);

			listData.Add(new AvaBuffInfoItem.DataStruct(dataItem.ICON,_Global.GetString(homePercent*100f), _Global.GetString(tilePercent*100f)));
		}

		scrollList.SetData(listData);
		scrollList.UpdateData();
		scrollList.ResetPos();
	}
}
