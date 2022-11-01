using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using UILayout;

using _Global = KBN._Global;
using GameMain = KBN.GameMain;
using Datas = KBN.Datas;

public class AvaMainChromeProgressView : UIObject {

	[SerializeField]
	private Button btnMarch;
	[SerializeField]
	private Button btnShowList;
	[SerializeField]
	private NotifyBug marchNote;

	[SerializeField]
	private ProgressList progressList;
	[SerializeField]
	private AvaMarchSlot marchSlot;

	public Action OnReorderLayout { get; set; }

	private UIObjContainForLayout progressContainRef;
	private UISize progressListHeight;

	private Texture2D uptex = null;
	private Texture2D downtex = null;

	private Dictionary<int, AvaMarchSlot> marchSlots = new Dictionary<int, AvaMarchSlot>();

	public override void Init ()
	{
		base.Init ();

		btnMarch.Init();
		btnMarch.OnClick = new Action(OnShowListButton);
		btnShowList.Init();
		btnShowList.OnClick = new Action(OnShowListButton);
		marchNote.Init();

		uptex = TextureMgr.singleton.LoadTexture("button_task_list_up", TextureType.DECORATION);
		downtex = TextureMgr.singleton.LoadTexture("button_task_list_down", TextureType.DECORATION);

		btnMarch.txt = Datas.getArString("Common.March");

		progressContainRef = null;

		if (_Global.IsLargeResolution()) {
			progressList.rect = new Rect(0, 0, 965, 0);
		} else {
			progressList.rect = new Rect(0, 0, 590, 0);
		}
		progressList.Init(this);
		progressList.OnProgressListRemove = OnMarchRemoved;
	}

	public override void Update ()
	{
		base.Update ();

		progressList.Update();
		progressList.UpdateData();
		uint height = (uint)Mathf.RoundToInt(progressList.rect.height);
		if (height != progressListHeight.Min) {
            UpdateLayout(height);
		}
	}

    private void UpdateLayout(uint height)
    {
        progressListHeight.Value = height;
        if (null != OnReorderLayout)
            OnReorderLayout();
    }

	public void SetContainRef(UILayout.UIFrame uiFrame)
	{
		
		var progressGrid = uiFrame.FindItem("MainChrom.MiddelFrame.LeftIconsGrid.RightDats.MarchProgressGrid") as UILayout.Grid;
		var containRef = uiFrame.FindItem("MainChrom.MiddelFrame.LeftIconsGrid.RightDats.MarchProgressGrid.ProgressView") as UIObjContainForLayout;

		if (null != progressContainRef || null == containRef || null == progressGrid)
			return;

		progressListHeight = progressGrid.Row(0);
		progressListHeight.Value = 0;

		progressContainRef = containRef;

		progressContainRef.AddItem(ObjToUI.Cast(progressList), 0, 
		                           UIObjContainForLayout.FillHorizon.DockRight, 
		                           UIObjContainForLayout.FillVertical.Fill, 
		                           UIObjContainForLayout.LockType.LockWidth);


        progressList.ShowAll();
		btnShowList.image = downtex;
	}

    public void SetFixedRect()
    {
        progressList.ResetFixedRect();
    }

	private void OnShowListButton()
	{
		if (!progressList.IsHide()) {
			progressList.hideAllWithAnimation();
			btnShowList.image = uptex;
		} else {
			progressList.showAllWithAnimation();
			btnShowList.image = downtex;
		}
	}

	public void Clear(bool refresh = true)
	{
		progressList.Clear(false);

		foreach(var slot in marchSlots.Values)
		{
			TryDestroy(slot);
		}

		marchSlots.Clear();

        if (refresh)
        {
            progressList.Hide();
            UpdateLayout((uint)progressList.rect.height);
            btnShowList.image = uptex;
        }

        marchNote.SetCnt(0);

	}

	public void ReloadMarchList()
	{
		var marchList = GameMain.Ava.March.GetMyMarchList();

		_Global.Log("[AvaMainChrome] ReloadMarchList() count = " + marchList.Count);
		Clear(false);
		foreach(var data in marchList) {
			AddMarch(data, false);
		}
        progressList.Hide();
        UpdateLayout((uint)progressList.rect.height);
        progressList.showAllWithAnimation();
        btnShowList.image = downtex;
	}

	public void AddMarch(AvaBaseMarch data, bool refresh = true)
	{
		if (data.Status == Constant.AvaMarchStatus.INACTIVE || 
		    data.Status == Constant.AvaMarchStatus.DELETED ||
		    marchSlots.ContainsKey(data.MarchId))
			return;

		AvaMarchSlot slot = Instantiate(marchSlot) as AvaMarchSlot;
		slot.Init();
		slot.SetUIData(data);
		progressList.AddItem(slot);
		progressList.UpdateData();

		marchSlots.Add(data.MarchId, slot);

		marchNote.SetCnt(progressList.GetItemsCnt());

        if (refresh) 
        {
            progressList.Hide();
            UpdateLayout((uint)progressList.rect.height);
            progressList.showAllWithAnimation();
            btnShowList.image = downtex;
        }

	}

	private void OnMarchRemoved(ProgressList list)
	{
		List<int> deletedMarches = new List<int>();
		foreach(int key in marchSlots.Keys)
		{
			if (marchSlots[key].willBeRemoved())
				deletedMarches.Add(key);
		}
		foreach(int key in deletedMarches)
		{
			TryDestroy(marchSlots[key]);
			marchSlots.Remove(key);
		}

		marchNote.SetCnt(progressList.GetItemsCnt());

        progressList.Hide();
        UpdateLayout((uint)progressList.rect.height);
        progressList.showAllWithAnimation();
        btnShowList.image = downtex;

	}

}
