using UnityEngine;
using System.Collections;
using KBN;
using KBN.DataTable;
public class LeagueListItem : ListItem 
{
	public ToggleButton tb;
	public Label lblBg;
	public Label lblLeagueIcon;
	public Label lblLeagueName;
	public Label lblMyLeagueTxt;
	public Button btnGhost;
	private SeasonLeagueMgr.LeagueListItemData curLeague = null;
	public override void Init ()
	{
		base.Init ();
		lblBg.setBackground ("ui_hero_frame", TextureType.DECORATION);
		tb.Init ();
		tb.valueChangedFunc = new System.Action< bool>(OnSelect);
		lblMyLeagueTxt.txt = Datas.getArString ("AVA.LeagueLeaderboard_MyLeague");
		btnGhost.OnClick = new System.Action(OnChangeSelected);
	}

	public override int Draw ()
	{
		GUI.BeginGroup(rect);

		lblBg.Draw ();
		tb.Draw ();
		lblLeagueIcon.Draw ();
		lblLeagueName.Draw ();
		lblMyLeagueTxt.Draw ();
		btnGhost.Draw ();
		GUI.EndGroup ();
		return -1;

	}

	public override void Update ()
	{
		base.Update ();
		tb.Update ();
		if(curLeague != null)
		{
			tb.selected = curLeague.bSelected;
		}
	}

	public override void UpdateData ()
	{
		base.UpdateData ();
	}

	public override void SetRowData (object data)
	{
		curLeague = data as SeasonLeagueMgr.LeagueListItemData;
		if(curLeague == null)
		{
			return;
		}
		lblLeagueIcon.setBackground (SeasonLeagueMgr.instance().GetLeagueIconName(curLeague.leagueLevel), TextureType.DECORATION);
		lblLeagueName.txt = Datas.getArString ("LeagueName.League_" + curLeague.leagueLevel);
		tb.selected = curLeague.bSelected;
		lblMyLeagueTxt.SetVisible (SeasonLeagueMgr.instance ().Respose!=null && curLeague.leagueLevel == SeasonLeagueMgr.instance ().Respose.userLeagueInfo.leagueLevel);
	}
	
	private void OnSelect(bool bSelected)
	{
		if(bSelected && handlerDelegate != null)
		{
			curLeague.bSelected = true;
			handlerDelegate.handleItemAction(Constant.Action.SELECTLEAGUE,curLeague);
		}
	}

	private void OnChangeSelected()
	{
		tb.selected = !tb.selected;
	}

}
