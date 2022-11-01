using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

using Datas = KBN.Datas;
using GameMain = KBN.GameMain;
using MenuMgr = KBN.MenuMgr;
using ScrollList = KBN.ScrollList;

public class OutpostTroopsMovement : UIObject, IEventHandler {
    
    [SerializeField]
    private OutpostStatusLabel lbTime;

	[SerializeField]
	private SimpleLabel lbFrame;
	[SerializeField]
	private SimpleLabel lbDesc;
	[SerializeField]
	private SimpleButton btnMarch;
	[SerializeField]
	private SimpleLabel lbCount;

    [SerializeField]
    private SimpleLabel lbNoMarchesDesc;

	[SerializeField]
	private ScrollList scrollList;

	[SerializeField]
	private OutpostTroopsMovementListItem listItem;

	public Action<object> OnPushMarchDetail { get; set; }

	public override void Init ()
	{
		base.Init ();

        lbTime.Init();

		lbFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_black", TextureType.DECORATION);
		btnMarch.EnableBlueButton(true);
		btnMarch.txt = Datas.getArString("OpenRallyPoint.MarchTroops");
		btnMarch.OnClick = new Action(OnMarchButtonClick);
		scrollList.Init(listItem);
		scrollList.itemDelegate = this;
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);
		
        lbDesc.txt = Datas.getArString("AVA.outpost_troopsmovement_marchdesc");
        lbNoMarchesDesc.txt = Datas.getArString("AVA.Outpost_deploytroops_nonetroopsmovementdesc");

		UpdateData();
	}

	public void UpdateData()
	{
		var marchList = GameMain.Ava.March.GetMyMarchList();

		var skillEffects = GameMain.Ava.PlayerSkill.GetPlayerSkill(1).GetEffects();
		int maxCount = skillEffects[1];

		lbCount.txt = string.Format("{0}/{1}", marchList.Count, maxCount);

		btnMarch.EnableBlueButton(marchList.Count < maxCount);

        lbNoMarchesDesc.SetVisible(marchList.Count <= 0);

        scrollList.MoveToTop();
		scrollList.Clear();
		scrollList.SetData(marchList);
        scrollList.MoveToTop();
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);

        lbTime.Draw();

		lbFrame.Draw();
		lbDesc.Draw();
		btnMarch.Draw();
		lbCount.Draw();

        lbNoMarchesDesc.Draw();
		scrollList.Draw();

		GUI.EndGroup();

		return -1;
	}

	public override void Update ()
	{
		base.Update ();

        lbTime.Update();
		scrollList.Update();
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

		scrollList.Clear();
	}

	public void handleItemAction (string action, object param)
	{
		if (action == "OnClick") {
			if (null != OnPushMarchDetail)
				OnPushMarchDetail(param);
		}
	}

	private void OnMarchButtonClick()
	{
		//MenuMgr.instance.PushMenu("MarchMenu", new Hashtable() { {"ava", 1} }, "trans_zoomComp");
		KBN.GameMain.singleton.SetMarchData(
			new Hashtable() { {"ava", 1} }
		);
	}
}
