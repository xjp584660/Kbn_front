using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using KBN;

public class AllianceSkillList : UIObject
{
	public enum MENU_TYPE
	{
		NULL,
		NORMAL
	};
	[SerializeField] private MENU_TYPE menuType = MENU_TYPE.NORMAL;

	[SerializeField] private ScrollList skillList;
	[SerializeField] private ListItem skillItem;

	[SerializeField] private SimpleLabel nullBg;
	[SerializeField] private SimpleLabel nullDesc;
	public Action<AvaAllianceSkill> clickFunc = null;
	private List<AvaAllianceSkill> data;

	public override void Init()
	{
		base.Init ();
		skillList.Init(skillItem);
		nullBg.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("square_blackorg", TextureType.DECORATION);
		nullDesc.txt = Datas.getArString ("Allianceshop.basicshopdesc");
	}

	public override int Draw()
	{
		GUI.BeginGroup(rect);
		switch(menuType)
		{
		case MENU_TYPE.NULL:
			NullDraw();
			break;
		case MENU_TYPE.NORMAL:
			NormalDraw();
			break;
		}
		GUI.EndGroup();
		return -1;
	}

	private void NormalDraw()
	{
		skillList.Draw ();
	}

	private void NullDraw()
	{
		nullBg.Draw ();
		nullDesc.Draw ();
	}

	public override void Update() 
	{
		skillList.Update ();
	}

	public void OnPush(object param)
	{
		clickFunc = (Action<AvaAllianceSkill>)param;
	}
	
	public void OnPop()
	{
	}
	
	public override void OnPopOver()
	{
		base.OnPopOver ();
		skillList.Clear();
	}

	private IEnumerable FillData()
	{
		if (data == null)
			return null;
		List<AllianceSkillItem.DataStruct> dataList = new List<AllianceSkillItem.DataStruct>();
		data.ForEach (
			i=>{
				dataList.Add(new AllianceSkillItem.DataStruct(i, new Action<AvaAllianceSkill>(handleClick)));
			}
		);
		return dataList.ToArray();
	}

	private void handleClick(AvaAllianceSkill data)
	{
		if (clickFunc != null)
			clickFunc (data);
	}

	private void RefreshMenu()
	{
		skillList.SetData(FillData());
		skillList.UpdateData();
		//skillList.ResetPos();
	}

	public void SetData(List<AvaAllianceSkill> _data)
	{
		if (_data == null)
		{
			menuType = MENU_TYPE.NULL;
			return;
		}
		else
		{
			data = _data;
			menuType = MENU_TYPE.NORMAL;
		}
		RefreshMenu ();
	}
}
