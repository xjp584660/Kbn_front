using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class AvAEventMenu : ComposedMenu, IEventHandler
{
//		public ToolBar tab;
	public AvADetails detail;
	public AvaSeasonLeagueLeaderBoard leagueLeaderBoard;
	public AvALeaderboard avaLeaderBoard;

	private int m_TabIndex;
	private bool isLeague = false;
	public override void Init()
	{
		base.Init();
		leagueLeaderBoard.Init ();
		avaLeaderBoard.Init ();
		titleTab.toolbarStrings = new string[] {(Datas.getArString("AVA.info_title") as string), (Datas.getArString("AVA.LeagueLeaderboard_Title") as string)};
		titleTab.indexChangedFunc = IndexChanged;
		tabArray = new UIObject[] {detail,leagueLeaderBoard};
		detail.Init ();
		detail.avaResult.handlerDelegate = this;
	}

	private void IndexChanged(int index)
	{
		m_TabIndex = index;

        if (m_TabIndex == 1)
        {
			if(isLeague)
			{
				leagueLeaderBoard.OnShow();
			}
			else
			{
				avaLeaderBoard.OnShow();
			}
            
        }
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();
		titleTab.Draw ();
		if(m_TabIndex == 0)
		{
			detail.Draw ();
		}
		else if(isLeague)
		{
			leagueLeaderBoard.Draw ();
		}
		else
		{
			avaLeaderBoard.Draw();
		}

	}

	public override void Update()
	{
		base.Update();
		titleTab.Update ();
		detail.Update ();
		leagueLeaderBoard.Update ();
		avaLeaderBoard.Update ();
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);
		if (menuHead != null)
		{
			menuHead.setTitle(Datas.getArString("Event.AVA_AVAeventtitle"));
			menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		}
		detail.UpdateData (param);
		menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_HOME);
		isLeague = true;
		if( param != null )
		{
			HashObject h = param as HashObject;
			if( h != null ) {
				if( h["FromRank"] != null ) 
				{
					isLeague = false;
					tabArray = new UIObject[] {detail,avaLeaderBoard};
					titleTab.selectedIndex = 1;
					menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_ARROW);
					titleTab.toolbarStrings = new string[] {(Datas.getArString("AVA.info_title") as string), (Datas.getArString("AVA.leaderboard_title") as string)};
				}
				else if(h["FromLeagueRank"] != null)
				{
					titleTab.selectedIndex = 1;
					menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_ARROW);
				}
			}
		}
	}

	public override void OnPop ()
	{
		base.OnPop ();
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();
		leagueLeaderBoard.OnPopOver ();
		TryDestroy (leagueLeaderBoard);
		avaLeaderBoard.OnPopOver ();
		TryDestroy (avaLeaderBoard);
	}

	public void handleItemAction(string action,object param)
	{	
		switch(action)
		{
		case Constant.Action.AVA_LASTRESULT:
			//push submenu
            AvaResultMenu.requestAvaResult(AvaResultMenu.AvaResultType.LastResult, OnGetLastResultOK);

			break;
		}
	}

	public override void handleNotification (string action, object data)
	{
		switch (action) 
		{
		case Constant.AvaNotification.StatusChanged:
			detail.RefreshStatus();
			break;
		case Constant.AvaNotification.MatchResultOK:
			detail.SetMatchData(GameMain.Ava.Event.MatchResult);
			break;
		case Constant.Notice.OnSelectLeagueOK:
			leagueLeaderBoard.OnSwitchLeagueOK();
			break;
		}
	}

    private void OnGetLastResultOK(byte[] data)
    {
        if (data != null)
        {
            HashObject param = new HashObject();
            param["type"] = new HashObject(AvaResultMenu.AvaResultType.LastResult);
            param["data"] = new HashObject(data);
            MenuMgr.instance.PushMenu("AvaResultMenu", param, "trans_zoomComp");
        }
    }
}