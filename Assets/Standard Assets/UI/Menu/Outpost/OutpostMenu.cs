using UnityEngine;
using System;
using System.Collections;

using MenuMgr = KBN.MenuMgr;
using Datas = KBN.Datas;
using GameMain = KBN.GameMain;

public class OutpostMenu : KBNMenu {

	[SerializeField]
	private MenuHead menuHeadTemplate;
	
    [SerializeField]
    private NotifyBug undeployedMarchesCntBug;

	private MenuHead menuHead;

	[SerializeField]
	private TabControl tabControl;

    public enum OutpostTab
    {
        Detail = 0,
        Troop,
        Movement,
        Inventory
    }

	public override void Init ()
	{
		base.Init ();

		menuHead = Instantiate(menuHeadTemplate) as MenuHead;
		menuHead.Init();

		menuHead.setTitle(Datas.getArString("AVA.Outpost_title"));
		menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_OUTPOST);

		tabControl.Init();
		tabControl.ToolBarNames = new string[] {
			Datas.getArString("AVA.Outpost_detailstitle"),
			Datas.getArString("AVA.Outpost_mytroopstitle"),
			Datas.getArString("AVA.Outpost_troopsmovementtitle"),
			Datas.getArString("AVA.Outpost_itemtitle")
		};

		base.frameTop.rect.y = 132;
		base.bgStartY = (int)tabControl.rect.y;

        undeployedMarchesCntBug.Init();
        undeployedMarchesCntBug.mystyle.normal.background = TextureMgr.instance().LoadTexture("task_list_number_bottom", TextureType.ICON);
	}

	public override void FixedUpdate ()
	{
		base.FixedUpdate ();

		tabControl.FixedUpdate();
	}

	public override void Update ()
	{
		base.Update ();

		menuHead.Update();
		tabControl.Update();
	}

	public override void OnPush (object param)
	{
        Hashtable hashtable = param as Hashtable;

		var curStatus = GameMain.Ava.Event.CurStatus;

		if (curStatus != AvaEvent.AvaStatus.Combat ) {
			if (null == hashtable)
				hashtable = new Hashtable();
			if (!hashtable.ContainsKey("ShowTroopsDeployment"))
				hashtable["ShowTroopsDeployment"] = true;
		}

		base.OnPush (hashtable);
		
		tabControl.OnPush(hashtable);

        int border = 2;
        int width = ((int)tabControl.toolBar.rect.width - border * (tabControl.ToolBarNames.Length - 1)) / tabControl.ToolBarNames.Length;
        undeployedMarchesCntBug.rect = new Rect(
            tabControl.rect.x + width * 3 - undeployedMarchesCntBug.rect.width + 8,
            tabControl.rect.y - 8,
            undeployedMarchesCntBug.rect.width,
            undeployedMarchesCntBug.rect.height
            );
        undeployedMarchesCntBug.SetCnt(0);
        undeployedMarchesCntBug.SetVisible(curStatus == AvaEvent.AvaStatus.Prepare);

		if (hashtable != null)
		{
			if (hashtable.ContainsKey("TabIndex")) {
				OutpostTab selectedTab = (OutpostTab)hashtable["TabIndex"];
				SwitchTab(selectedTab);
			}
			if (hashtable.ContainsKey("UseBackButton")) {
				if ((bool)hashtable["UseBackButton"]) {
					menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_ARROW);
				}
			}
			if (hashtable.ContainsKey("UseHomeButton")) {
				if ((bool)hashtable["UseHomeButton"]) {
					menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_HOME);
				}
			}
			if (hashtable.ContainsKey("ShowTroopsDeployment")) {
				tabControl.ToolBarNames[2] = Datas.getArString("AVA.Outpost_deploytroopstitle");
			}
		}

        KBN.Game.Event.RegisterHandler(KBN.EventId.AvaStatus, OnAvaStatusChanged);
	}

	public override void OnPop ()
	{
		base.OnPop ();

		tabControl.OnPop();
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

        KBN.Game.Event.UnregisterHandler(KBN.EventId.AvaStatus, OnAvaStatusChanged);
		
		TryDestroy(menuHead);
		tabControl.OnPopOver();
	}

	protected override void DrawBackground ()
	{
		base.DrawBackground ();

		menuHead.Draw();
		base.frameTop.Draw();
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();

		tabControl.Draw();
        undeployedMarchesCntBug.Draw();
	}

    public OutpostTabInventory GetInventoryTab()
    {
        return tabControl.Items[(int)OutpostTab.Inventory] as OutpostTabInventory;
    }

    public void SwitchTab(OutpostTab tab) 
	{
        tabControl.toolBar.selectedIndex = (int)tab;
	}

	public override void handleNotification (string type, object body)
	{
		tabControl.SendNotification(type, body);

        if (type == Constant.Notice.AvaOutpostUpdateUndeployedAmount && body is int) {
            int num = (int)body;
            undeployedMarchesCntBug.SetCnt(num);
        }
	}

    private void OnAvaStatusChanged(object sender, GameFramework.GameEventArgs e)
    {
        KBN.AvaStatusEventArgs args = e as KBN.AvaStatusEventArgs;
        undeployedMarchesCntBug.SetVisible(args.Status == AvaEvent.AvaStatus.Prepare);
    }

	public override bool OnBackButton()
	{
		return tabControl.OnBackButton ();
	}
}
