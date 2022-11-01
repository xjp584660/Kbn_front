using UnityEngine;
using System.Collections;
using System;
using Datas = KBN.Datas;
using _Global = KBN._Global;

public class AvaCoopMenu : KBNMenu
{
    [SerializeField]
    private ToolBar titleTab;
    [SerializeField]
    private MenuHead menuHeadTemplate;
    [SerializeField]
    private AvaCoopTileShareContent share;
    [SerializeField]
    private AvaCoopRallyContent rally;
	[SerializeField]
	private AvaActivityLogTab log;

	[SerializeField]
	private NotifyBug notifyRally;

    private MenuHead menuHead;
    private UIObject currentTabContent;

	private static int lastTabIndex = int.MaxValue;

    public override void Init()
    {
        base.Init();
        InitMenuHead();
        this.share.Init();
		this.rally.Init();
		this.log.Init();
        InitTitleTab();
		
		this.notifyRally.Init();
		this.notifyRally.mystyle.normal.background = TextureMgr.instance().LoadTexture("task_list_number_bottom", TextureType.ICON);
		int border = 2;
		int width = ((int)titleTab.rect.width - border * (titleTab.toolbarStrings.Length - 1)) / titleTab.toolbarStrings.Length;
		notifyRally.rect = new Rect(
			titleTab.rect.x + width * 2 - notifyRally.rect.width + 8,
			titleTab.rect.y - 8,
			notifyRally.rect.width,
			notifyRally.rect.height
			);
    }

    protected override void DrawTitle()
    {
        menuHead.Draw();
    }

    protected override void DrawItem()
    {
        base.DrawItem();
        this.currentTabContent.Draw();
        this.frameTop.Draw();
        this.titleTab.Draw();
		this.notifyRally.Draw();
    }

	public override void OnPush (object param)
	{
		base.OnPush(param);
		this.log.OnPush();

		bool indexSet = false;

		if (null != param && param is Hashtable)
		{
			Hashtable data = param as Hashtable;
			if (null != data["gotoRallyAttack"] && _Global.INT32(data["gotoRallyAttack"]) == 1)
			{
				titleTab.selectedIndex = 1;
				indexSet = true;
			}
		}


		if (!indexSet && lastTabIndex != int.MaxValue)
		{
			titleTab.selectedIndex = lastTabIndex;
		}

		notifyRally.SetCnt(KBN.GameMain.Ava.March.GetRallyAttackList().Count);
		if (titleTab.selectedIndex != 1) {	
			KBN.GameMain.Ava.RallyShare.RefreshRallyList();
		}
	}

    public override void OnPushOver()
    {
        base.OnPushOver();
        share.RequestAndInitData();
    }

    public override void OnPopOver()
    {
        TryDestroy(menuHead);
        this.share.OnPopOver();
        this.rally.OnPopOver();
		this.log.OnPopOver();
        base.OnPopOver();
    }

    public override void Update()
    {
        base.Update();
        this.currentTabContent.Update();
    }

    public override void FixedUpdate()
    {
        base.FixedUpdate();
        this.currentTabContent.FixedUpdate();
    }

    public override void handleNotification(string type, object body)
    {
        if (this.currentTabContent == this.share)
        {
            share.HandleNotification(type, body);
        }
        else if (this.currentTabContent == this.rally)
        {
            rally.HandleNotification(type, body);
        }
		if (this.currentTabContent == this.log)
		{
			log.HandleNotification(type, body);
		}

		if (type == Constant.Notice.AvaCoopRallyListRefreshed)
		{
			int cnt = 0;
			var list = KBN.GameMain.Ava.RallyShare.Summary;
			for (int i = 0; i < list.Count; i++)
			{
				if (list[i].CurMarchSlotCnt < list[i].MaxMarchSlotCnt)
					cnt++;
			}

			notifyRally.SetCnt(cnt);
		}
    }

    private void InitMenuHead()
    {
        menuHead = Instantiate(menuHeadTemplate) as MenuHead;
        menuHead.Init();
        menuHead.SetVisible(true);
        menuHead.setTitle(Datas.getArString("AVA.coop_title"));
        menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_OUTPOST);
    }

    private void InitTitleTab()
    {
        titleTab.Init();
        titleTab.toolbarStrings = new string[]
        {
            Datas.getArString("AVA.coop_sharedinfotitle"),
            Datas.getArString("AVA.coop_ralllyinfotitle"),
			Datas.getArString("AVA.WarRoom_LogTitle"),
        };
        titleTab.indexChangedFunc = OnTabSelected;
        titleTab.selectedIndex = 0;
        this.currentTabContent = this.share;
    }

    private void OnTabSelected(int selectedIndex)
    {
        switch (selectedIndex)
        {
        case 0:
            this.currentTabContent = this.share;
            share.RequestAndInitData();
            break;
        case 1:
            this.currentTabContent = this.rally;
            rally.RequestAndInitData();
            break;
		case 2:
			this.currentTabContent = this.log;
//			log.OnLogUpdate();
			break;
        default:
            throw new ApplicationException("Invalid tab index: " + selectedIndex);
        }

		lastTabIndex = selectedIndex;
    }

	public override bool OnBackButton()
	{
		if(currentTabContent == rally)
		{
			return rally.OnBackButton();
		}
		return false;
	}
}
