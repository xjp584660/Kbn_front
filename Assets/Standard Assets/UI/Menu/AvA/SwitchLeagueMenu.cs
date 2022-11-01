using UnityEngine;
using System.Collections;
using System;
using KBN;
public class SwitchLeagueMenu : PopMenu ,IEventHandler
{
	public Button btnOk;
	public Label lFrame;
	public ListItem itemTemplate;
	public ScrollList scrollList;
	private SeasonLeagueMgr.LeagueListItemData m_SelectedData = null;
	public override void Init ()
	{
		base.Init ();
		scrollList.Init(itemTemplate);
		scrollList.itemDelegate = this;
		lFrame.setBackground ("Quest_kuang2", TextureType.DECORATION);
		btnClose.OnClick = new Action (OnClose);
		btnClose.setNorAndActBG ("button_popup1_close_normal","button_popup1_close_down");
		btnOk.OnClick = new Action (OnOk);
		btnOk.setNorAndActBG ("button_60_blue_normalnew","button_60_blue_downnew");
		btnOk.txt = Datas.getArString ("Common.OK_Button");
		title.txt = Datas.getArString ("AVA.LeagueLeaderboard_LeagueList");
	}

	public override int Draw ()
	{
		return base.Draw ();
	}

	public override void Update ()
	{
		base.Update ();
		scrollList.Update ();
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();
		scrollList.Clear ();
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);
		scrollList.SetData (SeasonLeagueMgr.instance().GetLeagueListForShow());
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();
		title.Draw ();
		btnOk.Draw ();
		lFrame.Draw ();
		scrollList.Draw ();

	}

	public override void handleNotification (string type, object body)
	{

	}

	public void handleItemAction(string action, object param)
	{
		switch (action)
		{
		case Constant.Action.SELECTLEAGUE:
			if(m_SelectedData != null)
			{
				m_SelectedData.bSelected = false; 
			}
			m_SelectedData = param as SeasonLeagueMgr.LeagueListItemData;
			m_SelectedData.bSelected = true;
			break;
		}
	}

	private void OnClose()
	{
		MenuMgr.instance.PopMenu ("");
	}

	private void OnOk()
	{
		SeasonLeagueMgr.instance ().CurShowLeague = m_SelectedData.leagueLevel;
		MenuMgr.instance.SendNotification (Constant.Notice.OnSelectLeagueOK);
		MenuMgr.instance.PopMenu ("");
	}


}
