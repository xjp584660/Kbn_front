using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class AvaActivityLogTab : UIObject, IEventHandler {

	[SerializeField]
	private ToggleButton radioAll;
	[SerializeField]
	private ToggleButton radioMine;

	[SerializeField]
	private SimpleLabel lblScrollViewFrame;

	[SerializeField]
	private ScrollList scrollList;
	[SerializeField]
	private AvaActivityLogListItem listItem;

	[SerializeField]
	private SimpleButton btnBottom;
	[SerializeField]
	private SimpleLabel lblBottom;
	[SerializeField]
	private SimpleLabel lblBottomBg;

	private RadioGroup radioGroup;

	private static float lastPosAll = Single.MaxValue;
	private static float lastPosMine = Single.MaxValue;

	private bool isBtnBottomVisible = false;

	public override void Init ()
	{
		base.Init ();

		radioAll.mystyle.normal.background = TextureMgr.singleton.LoadTexture("radio_box2", TextureType.DECORATION);
		radioAll.mystyle.onNormal.background = TextureMgr.singleton.LoadTexture("radio_box1", TextureType.DECORATION);
		radioAll.txt = Datas.getArString("AVA.WarRoom_ActivityLog_All");
		
		radioMine.mystyle.normal.background = TextureMgr.singleton.LoadTexture("radio_box2", TextureType.DECORATION);
		radioMine.mystyle.onNormal.background = TextureMgr.singleton.LoadTexture("radio_box1", TextureType.DECORATION);
		radioMine.txt = Datas.getArString("AVA.WarRoom_ActivityLog_MyActions");

		lblScrollViewFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_black", TextureType.DECORATION);

		btnBottom.mystyle.normal.background = null;
		btnBottom.mystyle.active.background = TextureMgr.singleton.LoadTexture("Black_Gradients", TextureType.DECORATION);;
		lblBottomBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Brown_Gradients2", TextureType.DECORATION);
		lblBottom.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_flip2_right_normal", TextureType.BUTTON);

		btnBottom.OnClick = new Action(OnBtnBottom);

		radioGroup = new RadioGroup();
		radioGroup.addButton(radioAll);
		radioGroup.addButton(radioMine);
		radioGroup.setSelectedButton(radioAll);
		radioGroup.buttonChangedFunc = new Action<ToggleButton>(OnFilterChanged);

		scrollList.Init(listItem);
		scrollList.itemDelegate = this;

//		lastPosAll = Single.MaxValue;
//		lastPosMine = Single.MaxValue;
	}

	public void OnPush()
	{
		if (radioGroup.getSelectedButton() == radioAll)
		{
			ResetListData(GameMain.Ava.ActivityLog.Data, lastPosAll);
		}
		else if (radioGroup.getSelectedButton() == radioMine)
		{
			ResetListData(GameMain.Ava.ActivityLog.DataFilter0, lastPosMine);
		}
	}

	public void OnLogUpdate()
	{
		if (radioGroup.getSelectedButton() == radioAll)
		{
			UpdateListData(GameMain.Ava.ActivityLog.Data);
		}
		else if (radioGroup.getSelectedButton() == radioMine)
		{
			UpdateListData(GameMain.Ava.ActivityLog.DataFilter0);
		}
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		base.Draw ();

		GUI.BeginGroup(rect);

		if (isBtnBottomVisible && Event.current.type != EventType.Repaint)
		{
			btnBottom.Draw();
		}

		radioAll.Draw();
		radioMine.Draw();

		lblScrollViewFrame.Draw();

		scrollList.Draw();

		if (isBtnBottomVisible)
		{
			lblBottomBg.Draw();
			lblBottom.Draw();
			if (Event.current.type == EventType.Repaint)
			{
				btnBottom.Draw();
			}
		}

		GUI.EndGroup();

		return -1;
	}

	public override void Update ()
	{
		base.Update ();

		scrollList.Update();
		isBtnBottomVisible = !scrollList.HasReachedBottom() && (scrollList.GetDataLength() * listItem.rect.height > scrollList.rect.height);

	}

	private void ResetListData(List<AvaActivityLogDataItem> data, float lastPos = Single.MaxValue)
	{
		scrollList.Clear();
		if (null != data) scrollList.SetData(data);
		scrollList.ResetPos();
		
		if (lastPos == Single.MaxValue)
		{
			scrollList.SmoothMoveToBottom();
		}
		else
		{
			scrollList.SetOffSet(lastPos);
		}
	}

	private void UpdateListData(List<AvaActivityLogDataItem> data)
	{
		scrollList.Clear();
		if (null != data) scrollList.SetData(data);

		if (scrollList.HasReachedBottom() && scrollList.IsIdle())
		{
			scrollList.ResetPos();
			scrollList.SmoothMoveToBottom();
		}
	}

	private void OnBtnBottom()
	{
		if (!scrollList.HasReachedBottom() && scrollList.IsIdle())
		{
			scrollList.ResetPos();
			scrollList.SmoothMoveToBottom();
		}
	}

	private void OnFilterChanged(ToggleButton obj)
	{
		if (obj == radioAll)
		{
			lastPosMine = scrollList.GetOffset();
			ResetListData(GameMain.Ava.ActivityLog.Data, lastPosAll);
		}
		else if (obj == radioMine)
		{
			lastPosAll = scrollList.GetOffset();
			ResetListData(GameMain.Ava.ActivityLog.DataFilter0, lastPosMine);
		}
	}

	public void handleItemAction (string action, object param)
	{
		if (action == "GotoTile")
		{
			AvaActivityLogDataItem data = param as AvaActivityLogDataItem;
			if (null != data)
			{
				MenuMgr.instance.PopMenu("AvaCoopMenu");
				GameMain.singleton.searchWorldMap2(data.TileXCoord, data.TileYCoord);
			}
		}
	}

	public void HandleNotification(string type, object content)
	{
		switch (type)
		{
		case Constant.AvaNotification.ActivityLogUpdated:
			OnLogUpdate();
			break;
		}
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

		scrollList.Clear();
		
		if (radioGroup.getSelectedButton() == radioAll)
		{
			lastPosAll = scrollList.GetOffset();
		}
		else if (radioGroup.getSelectedButton() == radioMine)
		{
			lastPosMine = scrollList.GetOffset();
		}
	}
}
