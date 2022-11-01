using UnityEngine;
using System.Collections;

public class AvaStatsMenu : ComposedMenu, IEventHandler
{
	public AvaInfo info;
	public AvaScoreRank scoreRank;

	private int m_TabIndex;

	public override void Init ()
	{
		base.Init();
		if (clone_menuHead != null)
		{
			menuHead = (GameObject.Instantiate(clone_menuHead.gameObject) as GameObject).GetComponent<MenuHead>();
		}
		if (menuHead != null)
		{
			menuHead.Init();
            menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_OUTPOST);
		}

        titleTab.toolbarStrings = new string[] {KBN.Datas.getArString("AVA.stats_AVAinfotitle"), KBN.Datas.getArString("AVA.chrome_stats_scoreranktitle")};
		titleTab.indexChangedFunc = indexChanged;

		info.Init();
		scoreRank.Init();
		tabArray = new UIObject[]{info, scoreRank};
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);

		if (menuHead != null)
		{
			menuHead.setTitle(KBN.Datas.getArString("AVA.stats_statstitle"));
			menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		}
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();
		titleTab.Draw();

//		if (m_TabIndex == 0)
//		{
//			info.Draw();
//		}
//		else if (m_TabIndex == 1)
//		{
//			scoreRank.Draw();
//		}
	}

	public override void Update ()
	{
		base.Update ();
		titleTab.Update();

        info.Update();
        scoreRank.Update();
	}

	private void indexChanged(int index)
	{
		m_TabIndex = index;
	}

	public virtual void handleItemAction(string action, System.Object param)
	{
	}

	public override void OnPop()
	{
		base.OnPop();
	}
	
	public override void OnPopOver()
	{
		base.OnPopOver ();
		
		if ( clone_menuHead != null && menuHead != null )
		{
			TryDestroy(menuHead);
			menuHead = null;
		}
		
		info.OnPopOver ();
		scoreRank.OnPopOver ();
	}
}
