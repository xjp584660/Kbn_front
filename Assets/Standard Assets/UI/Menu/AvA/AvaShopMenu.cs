using KBN;
using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

public class AvaShopMenu : ComposedMenu
{
    [SerializeField]
    private ListItem itemTemplate;
    [SerializeField]
    private Label empty;
    [SerializeField]
    private Label emptyBackground;
    [SerializeField]
    private NotifyBug notify;
    [SerializeField]
    private Label lockIcon;
    [SerializeField]
    private Label bottomBackground;
    [SerializeField]
    private Label point;
    [SerializeField]
    private Button btnInventory;
    [SerializeField]
	private ScrollList basicList;
    [SerializeField]
	private ScrollList mysticList;

	private ScrollList currentList;
    private IList<int> selectedShopItem;

	public override void Init()
	{
		base.Init();

        menuHead.rect.height = 150;
        menuHead.setBackButtonMotif(MenuHead.BACK_BUTTON_MOTIF_ARROW);
        menuHead.setTitle(Datas.getArString("Allianceshop.allianceshoptitle"));

        lockIcon.useTile = true;
        lockIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile("Multi_city_Lock");

        basicList.Init(itemTemplate);
        mysticList.Init(itemTemplate);

        selectedShopItem = new List<int>();

        string shop = Datas.getArString("Allianceshop.basicshoptitle");
        string item = Datas.getArString("Allianceshop.Mysteryshoptitle");
        titleTab.toolbarStrings = new string[] {shop, item};
        titleTab.indexChangedFunc = new Action<int>(OnShopTypeChanged);
        empty.txt = Datas.getArString("Allianceshop.basicshopdesc");
        btnInventory.txt = Datas.getArString("AVA.Outpost_itemtitle");

        tabArray = new UIObject[] {basicList, mysticList};
        currentList = basicList;

        btnInventory.OnClick = new Action(OnInventoryClick);

		GameMain.Ava.Player.OnEapChanged += OnEapChanged;
	}

    private void OnShopTypeChanged(int index)
    {
        switch (index)
        {
            case 0:
                currentList = basicList;
				basicList.SetStateIdle();
                basicList.SetData(GameMain.Ava.Inventory.GetBasicItems());
                basicList.ResetPos();
                break;
            case 1:
                currentList = mysticList;
				mysticList.SetStateIdle();
                mysticList.SetData(GameMain.Ava.Inventory.GetMysticItems());
                mysticList.ResetPos();
                break;
            default:
                throw new NotSupportedException("Not supported shop type.");
        }
    }

	public override void Update()
	{
		base.Update();

        currentList.Update();
	}

	public override void OnPush(object param)
	{
        base.OnPush(param);

		menuHead.rect.height = 150;
		menuHead.setTitle(Datas.getArString("Allianceshop.allianceshoptitle"));

        UpdatePoint();
		UpdateLeftBuyCount ();

		PlayerPrefs.SetInt(Constant.PLAYER_PREFS.ALLIANCE_SHOP_MENU_OPEN + Datas.singleton.tvuid() + Datas.singleton.worldid(), 1);
		KBN.Game.Event.RegisterHandler(KBN.EventId.AvaBuyItem, OnAvaBuyItem);

		AvaAlliance.OnGetSkillInfoOk OkFunc = OnDataOk;

		Alliance _yA = Alliance.singleton;
		AllianceVO _yAO = _yA.myAlliance;
		if (_yAO != null) {
			int _yI = _yAO.allianceId;
			GameMain.Ava.Alliance.GetSkillInfoFromServer (_yI, OkFunc);
		}
	}

	private void OnDataOk()
	{
		OnShopTypeChanged(0);
	}
	
	public override void OnPopOver()
	{
		basicList.Clear();
		mysticList.Clear();

        selectedShopItem.Clear();

		GameMain.Ava.Player.OnEapChanged -= OnEapChanged;
		KBN.Game.Event.UnregisterHandler(KBN.EventId.AvaBuyItem, OnAvaBuyItem);
		base.OnPopOver();
	}

    protected override void DrawItem()
    {
        base.DrawItem();
        bottomBackground.Draw();
        point.Draw();
//        btnInventory.Draw();
        if (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Prepare)
        {
            notify.Draw();
        }

        if (!GameMain.Ava.Inventory.MysticShopOpened)
        {
            lockIcon.Draw();
        }

        if (currentList.GetDataLength() <= 0)
        {
            emptyBackground.Draw();
            empty.Draw();
        }
    }
    
    public override void handleNotification(string type, object param)
	{
		switch(type)
		{
			case "UpdateItem":
//                UpdatePoint();
                currentList.UpdateData();
				break;
		}
	}

    public bool IsSelected(int itemType)
    {
        return selectedShopItem.Contains(itemType);
    }
    
    public void Select(int itemType)
    {
        if (!selectedShopItem.Contains(itemType))
        {
            selectedShopItem.Add(itemType);
        }
    }
    
    public void Unselect(int itemType)
    {
        if (selectedShopItem.Contains(itemType))
        {
            selectedShopItem.Remove(itemType);
        }
    }

    public void BuyItem(int itemType, int itemCount)
    {
        AvaShopType shopType = AvaShopType.Undefined;
        if (currentList == basicList)
        {
            shopType = AvaShopType.Basic;
        }
        else if (currentList == mysticList)
        {
            shopType = AvaShopType.Mystic;
        }

        GameMain.Ava.Inventory.BuyItem(shopType, itemType, itemCount);
    }

    private void UpdatePoint()
    {
        point.txt = Datas.getArString("Allianceshop.basicshop_honorpoints") + string.Format(" <color=white>{0}</color>", GameMain.Ava.Player.ExpendablePoint.ToString());
    }

    private void OnInventoryClick()
    {
        Hashtable args = new Hashtable { { "TabIndex", OutpostMenu.OutpostTab.Inventory }, { "UseBackButton", true } };
        MenuMgr.instance.PushMenu("OutpostMenu", args, "trans_horiz");
    }

	private void OnEapChanged(long oldEap, long newEap)
	{
		UpdatePoint();
	}

	private void OnAvaBuyItem(object sender, GameFramework.GameEventArgs e)
	{
		UpdateLeftBuyCount ();
	}

	private void UpdateLeftBuyCount()
	{
		notify.SetCnt(GameMain.Ava.Inventory.CanBuyBasicCount);
	}
}
