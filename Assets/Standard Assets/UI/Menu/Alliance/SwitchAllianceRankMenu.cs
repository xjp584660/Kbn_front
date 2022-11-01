using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class SwitchAllianceRankMenu : PopMenu 
{
	public Button btnOK;

	public ToggleButton tb_level;
	public ToggleButton tb_league;
	public ToggleButton tb_might;
	private List<ToggleButton> tbList = null;
	public Label l_level;
	public Label l_league;
	public Label l_might;
	public Label l_Line;
	private int m_areaIndex = 0;

	public override void Init()
	{
		base.Init ();
		m_areaIndex = 0;
		btnOK.Init ();
		btnOK.changeToBlueNew ();
		btnOK.OnClick = new Action (OnOK);
		title.txt =  Datas.getArString ("Alliance.AllianceSearch_Title");
		btnOK.txt = Datas.getArString ("Common.OK_Button");
		btnClose.setNorAndActBG ("button_popup1_close_normal","button_popup1_close_down");
		l_Line.setBackground ("between line",TextureType.DECORATION);
		tb_level.Init();
		tb_league.Init();
		tb_might.Init();
		l_level.txt = Datas.getArString ("Alliance.AllianceSearch_Type1");
		l_league.txt = Datas.getArString ("Alliance.AllianceSearch_Type2");
		l_might.txt = Datas.getArString ("Alliance.AllianceSearch_Type3");
		tb_level.selected = false;
		tb_league.selected = false;
		tb_might.selected = false;
		tbList = new List<ToggleButton> {tb_level, tb_league,tb_might};
		AddToggleButtonHandler();
		if (Alliance.singleton.RankType == Constant.AllianceRankType.LEVEL) 
		{
			m_areaIndex = 0;
		}
		else if(Alliance.singleton.RankType == Constant.AllianceRankType.LEAGUE)
		{
			m_areaIndex = 1;
		}
		else
		{
			m_areaIndex = 2;
		}
		tbList[m_areaIndex].selected = true;
	}

	protected override void DrawItem()
	{
		base.DrawItem ();
		title.Draw ();
		btnOK.Draw ();
		l_Line.Draw ();
		tb_level.Draw();
		tb_league.Draw();
		tb_might.Draw();
		l_level.Draw();
		l_league.Draw();
		l_might.Draw();

	}

	public override void OnPush(object param)
	{
		base.OnPush (param);

	}

	private void OnOK()
	{
		if (m_areaIndex == 0) 
		{
			Alliance.singleton.RankType = Constant.AllianceRankType.LEVEL;
		}
		else if(m_areaIndex == 1)
		{
			Alliance.singleton.RankType = Constant.AllianceRankType.LEAGUE;
		}
		else
		{
			Alliance.singleton.RankType = Constant.AllianceRankType.MIGHT;
		}
		MenuMgr.instance.SendNotification (Constant.Notice.AllianceRankSelectPrefix + m_areaIndex);
		MenuMgr.instance.PopMenu ("");
	}

	private void AddToggleButtonHandler()
	{
		tb_level.valueChangedFunc2 = new System.Action<ToggleButton, bool>(selectedIndexChanged);
		tb_league.valueChangedFunc2 = new System.Action<ToggleButton, bool>(selectedIndexChanged);
		tb_might.valueChangedFunc2 = new System.Action<ToggleButton, bool>(selectedIndexChanged);
	}
	
	private void RemoveToggleButtonHandler()
	{
		tb_level.valueChangedFunc2 = null;
		tb_league.valueChangedFunc2 = null;
		tb_might.valueChangedFunc2 = null;
	}

	private void selectedIndexChanged(ToggleButton sender, bool selected)
	{
		RemoveToggleButtonHandler();
		for (int i = 0; i < tbList.Count; ++i)
		{
			if (tbList[i] == sender && selected)
			{
				m_areaIndex = i;
				tbList[i].selected = true;
			}
			else
			{
				tbList[i].selected = false;
			}
		}
//		if (sender == tbList[m_areaIndex] && selected)
//		{
//			tbList[m_areaIndex].selected = true;
//		}
//		else
//		{
//			for (int i = 0; i < tbList.Count; ++i)
//			{
//				if (tbList[i] == sender)
//				{
//					m_areaIndex = i;
//					tbList[i].selected = true;
//				}
//				else
//				{
//					tbList[i].selected = false;
//				}
//			}
//		}
		AddToggleButtonHandler();
	}
}