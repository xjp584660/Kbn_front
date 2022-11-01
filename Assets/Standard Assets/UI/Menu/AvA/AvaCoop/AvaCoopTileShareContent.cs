using UnityEngine;
using System.Collections;
using System;
using System.Collections.Generic;
using ScrollList = KBN.ScrollList;
using Datas = KBN.Datas;
using _Global = KBN._Global;
using Alliance = KBN.Alliance;
using GameMain = KBN.GameMain;
using MenuMgr = KBN.MenuMgr;

public class AvaCoopTileShareContent : UIObject
{
    [SerializeField]
    private ToggleButton tbAll;
    [SerializeField]
    private Label lblAll;
    [SerializeField]
    private ToggleButton tbMyLot;
    [SerializeField]
    private Label lblMyLot;
    [SerializeField]
    private ToggleButton tbSelectAll;
    [SerializeField]
    private Button btnEdit;
    [SerializeField]
    private Button btnCancel;
    [SerializeField]
    private Button btnDelete;
    [SerializeField]
    private Button btnMoveUp;
    [SerializeField]
    private Input2Page pageNav;
    [SerializeField]
    private AvaCoopTileShareItem itemTemplate;
    [SerializeField]
    private ScrollList scrollList;
    [SerializeField]
    private Label lblEmptyText;

	[SerializeField]
	private Label lblOwnTotalDataCount;

    [SerializeField]
    private int scrollListHeightNormal = 608;
    [SerializeField]
    private int scrollListHeightEdit = 552;
    [SerializeField]
    private int pageSize = 20;
    [SerializeField]
    private int btnDeleteTargetX = 390;
    [SerializeField]
    private int btnMoveUpTargetX = 560;
    [SerializeField]
    private float btnDeleteSpeed = 9;
    [SerializeField]
    private float btnMoveUpSpeed = 3;

    private bool IsLeader { set; get; }

    private bool isEdit = false;
    private bool IsEdit
    {
        set
        {
            isEdit = value;

            this.scrollList.rect.height = isEdit ? this.scrollListHeightEdit : this.scrollListHeightNormal;
            this.scrollList.AutoLayout();
            
            scrollList.ForEachItem(delegate (ListItem li)
            {
                var sii = li as AvaCoopTileShareItem;
                sii.IsEdit = isEdit;
                sii.IsLeader = IsLeader;
                return true;
            });
        }

        get
        {
            return isEdit;
        }
    }

    private AllianceVO myAlliance;

    private List<AvaSharedTileInfoData> cachedData = new List<AvaSharedTileInfoData>();

    public override void Init()
    {
        base.Init();
        InitAllianceInfo();
        InitToggles();
        InitButtons();
        InitData();
        InitScrollList();
        InitEmptyText();
        InitStatus();
    }

    public override int Draw()
    {
        if (!visible)
        {
            return -1;
        }

        this.tbAll.Draw();
        this.lblAll.Draw();
        this.tbMyLot.Draw();
        this.lblMyLot.Draw();
        this.scrollList.Draw();
		this.lblOwnTotalDataCount.Draw();

        DrawPageNav();
        DrawLeader();
        DrawEmpty();

        return -1;
    }

    public override void Update()
    {
        base.Update();
        this.scrollList.Update();
        UpdateBtnAnims();
    }

    private void UpdateBtnAnims()
    {
        if (!IsEdit)
        {
            return;
        }

        UpdateBtnAnim(btnDelete, btnDeleteTargetX, btnDeleteSpeed);
        UpdateBtnAnim(btnMoveUp, btnMoveUpTargetX, btnMoveUpSpeed);
    }

    private static void UpdateBtnAnim(Button btn, float targetX, float speed)
    {
        if (btn.rect.x - targetX  <= speed && btn.rect.x - targetX >= -speed)
        {
            btn.rect.x = targetX;
        }
        else
        {
            btn.rect.x -= speed;
        }
    }
    
    public override void OnPopOver()
    {
        base.OnPopOver();
        this.scrollList.Clear();
        this.scrollList.ClearData2();
    }

    public void RequestAndInitData()
    {
        IsEdit = false;
        pageNav.setShowPage(1);
        tbAll.SetSelected(true);
        tbMyLot.SetSelected(false);
        GameMain.Ava.TileShare.RefreshShareList(AvaTileShare.SubCommand.Alliance, 1, this.pageSize);
    }

    private void RefreshData()
    {
        pageNav.setShowPage(1);
        GameMain.Ava.TileShare.RefreshShareList(tbAll.selected ? AvaTileShare.SubCommand.Alliance : AvaTileShare.SubCommand.Player,
                                                1, this.pageSize);
    }

    public void HandleNotification(string type, object data)
    {
        switch (type)
        {
        case Constant.Notice.AvaCoopTileShareListRefreshed:
            OnDataUpdate();
            break;
        case Constant.Notice.AvaAbandonTileOK:
            OnAbandonTileOK();
            break;
        case Constant.Notice.AvaDeleteSharedTileOK:
            OnDeleteSharedTileOK();
            break;
        case Constant.Notice.AvaCoopReorderTilesOK:
            OnReorderTilesOK();
            break;
        case Constant.Notice.AvaCoopTileShareItemSelectionChanged:
            OnShareItemSelectionChanged();
            break;
        }
    }

    private void DrawLeader()
    {
        if (!this.IsLeader)
        {
            return;
        }

        if (this.IsEdit)
        {
            this.btnDelete.Draw();
            this.btnCancel.Draw();
            this.btnMoveUp.Draw();
            this.tbSelectAll.Draw();
        }
        else
        {
            this.btnEdit.Draw();
        }
    }

    private void DrawPageNav()
    {
        if (this.scrollList.GetDataLength() <= 0)
        {
            return;
        }

        this.pageNav.Draw();
    }
    
    private void DrawEmpty()
    {
        if (this.scrollList.GetDataLength() > 0)
        {
            return;
        }

        this.lblEmptyText.Draw();
    }

    private void InitData()
    {
        cachedData.Clear();
    }

    private void InitAllianceInfo()
    {
        if (Alliance.singleton.hasGetAllianceInfo)
        {
            OnGetMyAllianceInfo();
        }
        else
        {
            Alliance.singleton.reqAllianceInfo(OnGetMyAllianceInfo);
        }
    }

    private void OnGetMyAllianceInfo()
    {
        myAlliance = Alliance.singleton.myAlliance;
    }

    private void InitToggles()
    {
        lblAll.txt = Datas.getArString("PVP.Event_Share_All");
        tbAll.SetSelected(true);
        tbAll.valueChangedFunc = new Action<bool>(OnAll);
        tbAll.mystyle.normal.background = TextureMgr.instance().LoadTexture("radio_box2",TextureType.DECORATION);
        tbAll.mystyle.active.background = TextureMgr.instance().LoadTexture("radio_box1",TextureType.DECORATION);

        lblMyLot.txt = Datas.getArString("PVP.Event_Share_Mine");
        tbMyLot.SetSelected(false);
        tbMyLot.valueChangedFunc = new Action<bool>(OnMine);
        tbMyLot.mystyle.normal.background = TextureMgr.instance().LoadTexture("radio_box2",TextureType.DECORATION);
        tbMyLot.mystyle.active.background = TextureMgr.instance().LoadTexture("radio_box1",TextureType.DECORATION);

        tbSelectAll.valueChangedFunc = new Action<bool>(OnSelectAll);
    }

    private void InitButtons()
    {
        btnEdit.txt = Datas.getArString("Common.Edit");
        btnEdit.changeToBlueNew();
        btnEdit.OnClick = new Action<object>(OnEdit);

        btnCancel.txt = Datas.getArString("Common.Cancel");
        btnCancel.changeToBlueNew();
        btnCancel.OnClick = new Action<object>(OnCancel);

        btnDelete.txt = string.Empty;
        btnDelete.mystyle.normal.background = TextureMgr.instance().LoadTexture("alliancewall_Delete",TextureType.BUTTON);
        btnDelete.mystyle.active.background = TextureMgr.instance().LoadTexture("alliancewall_Delete2",TextureType.BUTTON);
        btnDelete.rect.x = 640;
        btnDelete.OnClick = new Action<object>(OnDelete);

        btnMoveUp.txt = string.Empty;
        btnMoveUp.mystyle.normal.background = TextureMgr.instance().LoadTexture("shared_Up",TextureType.BUTTON);
        btnMoveUp.mystyle.active.background = TextureMgr.instance().LoadTexture("shared_Up2",TextureType.BUTTON);
        btnMoveUp.rect.x = 640;
        btnMoveUp.OnClick = new Action<object>(OnMoveUp);

        pageNav.Init();
        pageNav.pageChangedHandler = new Action<int>(OnPageChanged);
    }

    private void InitScrollList()
    {
        this.scrollList.Clear();
        this.scrollList.ClearData2();
        this.scrollList.rect.height = this.scrollListHeightNormal;
        this.scrollList.Init(itemTemplate);
    }

    private void InitEmptyText()
    {
        this.lblEmptyText.txt=Datas.getArString("PVP.Event_Share_Empty");
        this.lblEmptyText.setBackground("square_blackorg", TextureType.DECORATION);
    }
    
    private void InitStatus()
    {
        this.IsLeader = false;
        this.IsEdit = false;
    }

    private void OnPageChanged(int page)
    {
        GameMain.Ava.TileShare.RefreshShareList(tbAll.selected ? AvaTileShare.SubCommand.Alliance : AvaTileShare.SubCommand.Player,
                                                page, this.pageSize);
    }

    private void OnEdit(object param)
    {
        this.IsEdit = true;
    }

    private void OnCancel(object param)
    {
        this.IsEdit = false;
        btnMoveUp.rect.x = 640;
        btnDelete.rect.x = 640;
        tbSelectAll.SetSelected(true);
        tbSelectAll.SetSelected(false);
    }

    private List<int> GetSelectedTileIds()
    {
        List<int> tileIds = new List<int>();
        foreach (var dataItem in this.cachedData)
        {
            if (dataItem.isTb_Selected)
            {
                tileIds.Add(dataItem.tileid);
            }
        }

        return tileIds;
    }
    
    private void OnDelete(object param)
    {
        var tileIds = this.GetSelectedTileIds();

        if (tileIds.Count <= 0)
        {
            return;
        }

        GameMain.Ava.TileShare.DeleteSharedTile(tbAll.selected ? AvaTileShare.SubCommand.Alliance : AvaTileShare.SubCommand.Player, tileIds);
    }

    private void OnMoveUp(object param)
    {
        var tileIds = this.GetSelectedTileIds();
        
        if (tileIds.Count <= 0)
        {
            return;
        }

        GameMain.Ava.TileShare.SetOrder(tbAll.selected ? AvaTileShare.SubCommand.Alliance : AvaTileShare.SubCommand.Player, tileIds);
    }

    private void OnAll(bool selected)
    {
        if (selected)
        {
            tbAll.SetSelected(true);
            tbMyLot.SetSelected(false);
            GameMain.Ava.TileShare.RefreshShareList(AvaTileShare.SubCommand.Alliance, 1, this.pageSize);
            pageNav.setShowPage(1);
        }
        else
        {
            tbAll.SetSelected(false);
            tbMyLot.SetSelected(true);
        }
        tbSelectAll.SetSelected(false);
        IsEdit = false;
    }

    private void OnMine(bool selected)
    {
        if (selected)
        {
            tbMyLot.SetSelected(true);
            tbAll.SetSelected(false);
            GameMain.Ava.TileShare.RefreshShareList(AvaTileShare.SubCommand.Player, 1, this.pageSize);
            pageNav.setShowPage(1);
        }
        else
        {
            tbAll.SetSelected(true);
            tbMyLot.SetSelected(false);
        }
        tbSelectAll.SetSelected(false);
        IsEdit = false;
    }

    private void OnSelectAll(bool selected)
    {
        foreach (var item in this.cachedData)
        {
            item.isTb_Selected = selected;
        }
        this.scrollList.SetData(cachedData);
    }

    private int TotalPages
    {
        get
        {
            var totalCount = GameMain.Ava.TileShare.TotalDataCount;
            return CalcPageCount(totalCount, pageSize);
        }
    }

    private static int CalcPageCount(int totalCount, int pageSize)
    {
        if (totalCount % pageSize == 0)
        {
            return totalCount / pageSize;
        }

        return totalCount / pageSize + 1;
    }

    private void OnDataUpdate()
    {
        var tileShare = GameMain.Ava.TileShare;
        this.IsLeader = tileShare.IsLeader;
        this.cachedData = tileShare.Data;
        btnEdit.EnableBlueButton(cachedData.Count > 0);
        IsEdit = IsEdit; // Refresh list items' IsEdit property
        this.scrollList.SetData(cachedData);
        this.scrollList.ResetPos();
        CheckSelectAll();

		lblOwnTotalDataCount.txt = String.Format(Datas.getArString("GrailWar.TileLimit"), tileShare.OwnTotalDataCount, GameMain.Ava.Seed.OccupyTileLimit);

        this.pageNav.setPages(GameMain.Ava.TileShare.PageToGet, this.TotalPages);
    }

    private void OnAbandonTileOK()
    {
        this.RefreshData();
    }

    private void OnDeleteSharedTileOK()
    {
        IsEdit = false;
        int currentPage = this.pageNav.getCurPage();
        var tileShare = GameMain.Ava.TileShare;
        var newTotalCount = tileShare.TotalDataCount - tileShare.TilesReallyDeleted.Count;
        var newTotalPages = CalcPageCount(newTotalCount, this.pageSize);

        if (tileShare.TilesReallyDeleted.Count < tileShare.TilesToDelete.Count)
        {
            MenuMgr.instance.PushMessage(Datas.getArString("PVP.Event_Share_Toaster"));
        }

        AvaTileShare.SubCommand subCommand = tbAll.selected ? AvaTileShare.SubCommand.Alliance : AvaTileShare.SubCommand.Player;
        if (currentPage == 1 || newTotalPages >= currentPage)
        {
            GameMain.Ava.TileShare.RefreshShareList(subCommand, currentPage, this.pageSize);
        }
        else
        {
            GameMain.Ava.TileShare.RefreshShareList(subCommand, newTotalPages, this.pageSize);
        }
    }

    private void OnReorderTilesOK()
    {
        IsEdit = false;
        RefreshData();
    }

    private void CheckSelectAll()
    {
        bool isAllSelected = true;
        foreach (var dataItem in this.cachedData)
        {
            if (!dataItem.isTb_Selected)
            {
                isAllSelected = false;
                break;
            }
        }
        this.tbSelectAll.SetSelected(isAllSelected);
    }

    private void OnShareItemSelectionChanged()
    {
        CheckSelectAll();
    }
}
