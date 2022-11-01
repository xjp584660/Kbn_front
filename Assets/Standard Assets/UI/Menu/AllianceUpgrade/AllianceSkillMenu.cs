using UnityEngine;
using System;
using KBN;

public class AllianceSkillMenu : KBNMenu
{
	[SerializeField] private MenuHead clone_menuHead;
	[SerializeField] private MenuHead menuHead;
	[SerializeField] private SimpleLabel line;
	[SerializeField] private SimpleLabel lockIcon;
	[SerializeField] private ToolBar topToolBar;
	[SerializeField] private ToolBar bottomToolBar;
	[SerializeField] private AllianceSkillBottomItem bottomItem;

	//submenu
	[SerializeField] private AllianceSkillList skillList;
	[SerializeField] private AllianceSkillSubMenu skillSubMenu;

	private NavigatorController nc;

	public override void Init()
	{
		base.Init ();

		bottomItem.Init ();

		nc = new NavigatorController();
		nc.Init();
		nc.popedFunc = PopedFunc;
		nc.pushedFunc = PushedFunc;

		if ( clone_menuHead != null )
			menuHead = (Instantiate(clone_menuHead.gameObject) as GameObject).GetComponent<MenuHead>();	
		if ( menuHead != null )
		{
			menuHead.Init();
			menuHead.setTitle( Datas.getArString("Alliance.info_allianceskilltitle") ) ;
			menuHead.btn_back.setNorAndActBG("button_back2_normal","button_back2_down");
		}
		menuHead.btn_back.OnClick = new System.Action(handleBack);

		line.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("frame_metal_top", TextureType.DECORATION);
		lockIcon.useTile = true;
		lockIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile("Multi_city_Lock");

		topToolBar.Init();
		bottomToolBar.Init();
		topToolBar.toolbarStrings = new string[2]{Datas.getArString("Alliance.info_allianceskill_permanenttab"), Datas.getArString("Alliance.info_allianceskill_temporarytab")};
		bottomToolBar.toolbarStrings = new string[2]{Datas.getArString("Alliance.info_allianceskill_homeskilltab"), Datas.getArString("Alliance.info_allianceskill_avaskilltab")};
		topToolBar.indexChangedFunc = SelectTopTab;
		bottomToolBar.indexChangedFunc = SelectBottomTab;

		bottomToolBar.mystyle.normal.background = TextureMgr.instance().LoadTexture("tab_big_normal", TextureType.BUTTON);
		bottomToolBar.mystyle.onNormal.background = TextureMgr.instance().LoadTexture("tab_big_down", TextureType.BUTTON);

		skillList.Init ();
		skillSubMenu.Init ();

		GameMain.Ava.Alliance.OnEapChanged += OnEapChanged;
	}

	protected override void DrawItem()
	{
		menuHead.Draw ();
		line.Draw ();
		topToolBar.Draw ();
		bottomToolBar.Draw ();
		lockIcon.Draw ();
		bottomItem.Draw ();

		nc.DrawItems();
	}

	public override void Update() 
	{
		if( menuHead ){
			menuHead.Update ();
		}

		nc.u_Update();
	}

	public override void FixedUpdate()
	{
		nc.u_FixedUpdate();	
	}

	public override void OnPush(object param)
	{
		base.OnPush(param);
		nc.push(skillList);
		skillList.OnPush(new Action<AvaAllianceSkill>(handleSkillItemClick));
		RefreshBottomItem ();

		PlayerPrefs.SetInt(Constant.PLAYER_PREFS.ALLIANCE_BUFF_MENU_OPEN+Datas.singleton.tvuid()+Datas.singleton.worldid(),1);

		AvaAlliance.OnGetSkillInfoOk OkFunc = OnDataOk;
		GameMain.Ava.Alliance.GetSkillInfoFromServer (Alliance.singleton.myAlliance.allianceId, OkFunc);
	}

	private void OnDataOk()
	{
		SelectBottomTab (0);
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

		skillList.OnPopOver ();
		skillSubMenu.OnPopOver ();

		GameMain.Ava.Alliance.OnEapChanged -= OnEapChanged;
	}

	private void PopedFunc(NavigatorController nc, UIObject prevObj)
	{
	}

	private void PushedFunc(NavigatorController nc, UIObject prevObj)
	{
	}

	private void handleBack()
	{
		MenuMgr.instance.PopMenu("");
	}

	private void SelectTopTab(int index)
	{
		switch(index)
		{
		case 0:
			bottomToolBar.SelectTab(0);
			SelectBottomTab(0);
			break;
		case 1:
			bottomToolBar.SelectTab(0);
			SelectBottomTab(0);
			break;
		}
	}

	private void SelectBottomTab(int index)
	{
		nc.pop2Root ();
		RefreshBottomItem ();
		if(topToolBar.selectedIndex == 1)
		{
			skillList.SetData(null);
			return;
		}

		switch(index)
		{
		case 0:
			skillList.SetData(GameMain.Ava.Alliance.GetSkillsByScene(BuffScene.Home));
			break;
		case 1:
			skillList.SetData(GameMain.Ava.Alliance.GetSkillsByScene(BuffScene.Ava));
			break;
		}
	}

	private void handleSkillItemClick(AvaAllianceSkill data)
	{
		nc.push(skillSubMenu);
		skillSubMenu.OnPush (new AllianceSkillSubMenu.DataStruct(data, new Action(handleBackToList), new Action(RefreshBottomItem)));
		RefreshBottomItem ();
	}

	private void handleBackToList()
	{
		nc.pop ();
		RefreshList ();
	}

	private void RefreshList()
	{
		RefreshBottomItem ();

		if(topToolBar.selectedIndex == 0)
			if(bottomToolBar.selectedIndex == 0)
				skillList.SetData(GameMain.Ava.Alliance.GetSkillsByScene(BuffScene.Home));
			else if(bottomToolBar.selectedIndex == 1)
				skillList.SetData(GameMain.Ava.Alliance.GetSkillsByScene(BuffScene.Ava));
		else if(topToolBar.selectedIndex == 1)
			skillList.SetData(null);
	}

	private void RefreshBottomItem()
	{
		bottomItem.txt = GameMain.Ava.Alliance.ExpendablePoint + "";
	
		if(nc.topUI == skillList && topToolBar.selectedIndex == 0)
		{
			bottomItem.desc = Datas.getArString ("Alliance.allianceskill_permanent_homeskill_permanentbuffsdesc");
		}
		else if(nc.topUI == skillList && topToolBar.selectedIndex == 1)
		{
			bottomItem.desc = Datas.getArString ("Alliance.info_allianceskill_temporarybuffsdesc");
		}
		else
		{
			bottomItem.desc = "";
		}
	}

	private void OnEapChanged(long oldEap, long newEap)
	{
		RefreshBottomItem ();
	}

	public override bool OnBackButton()
	{
		if(topToolBar.selectedIndex == 0)
		{
			if(nc.topUI == skillSubMenu)
			{
				handleBackToList();
				return true;
			}
		}
		return false;
	}
}
