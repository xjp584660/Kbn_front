using KBN;
using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

public class AvaMarchBoost : UIObject
{
	[SerializeField] private ScrollList boostList;
	[SerializeField] private ListItem boostItem;
	public override void Init()
	{
		base.Init ();
		boostList.Init(boostItem);
		boostList.SetData(FillData());
		boostList.UpdateData();
		boostList.ResetPos();

		KBN.Game.Event.RegisterHandler(EventId.AvaUseItem, UpdateList);
		KBN.Game.Event.RegisterHandler(EventId.AvaBuffListOk, UpdateList);
	}
	
	public override int Draw()
	{
		GUI.BeginGroup(rect);
		boostList.Draw ();
		GUI.EndGroup();
		return -1;
	}

	public override void Update()
	{
		boostList.Update ();
	}
	
	public void Clear()
	{
		boostList.Clear();
		KBN.Game.Event.UnregisterHandler(EventId.AvaUseItem, UpdateList);
		KBN.Game.Event.UnregisterHandler(EventId.AvaBuffListOk, UpdateList);
	}
	
	private IEnumerable FillData()
	{
		List<int> dataList = new List<int>(new int[]{6809, 6810, 6811, 6806, 6807, 6808});
		return dataList.ToArray();
	}

	public void updateData(int march_type)
	{

	}

	public void SetBuffCallback(System.Action<string> callback)
	{

	}

	private void UpdateList(object sender, GameFramework.GameEventArgs e)
	{
		boostList.UpdateData();
	}
}
