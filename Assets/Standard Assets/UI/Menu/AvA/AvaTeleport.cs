using System;
using UnityEngine;
using KBN;

public class AvaTeleport : PopMenu
{
    [SerializeField]
	private SimpleLabel xLabel;
    [SerializeField]
	private SimpleLabel yLabel;
    [SerializeField]
    private InputText xField;
    [SerializeField]
    private InputText yField;
	
    [SerializeField]
    private Button btnSubmit;
    [SerializeField]
    private Button btnCancel;
    [SerializeField]
    private SimpleLabel notify;
    [SerializeField]
    private SimpleLabel newCoord;
    [SerializeField]
    private SimpleLabel curCoord;
    [SerializeField]
    private Label icon;
    [SerializeField]
    private SimpleLabel line;

	private int m_ItemId;
	
	public override void Init()
	{
		base.Init();

		btnSubmit.txt = Datas.getArString("Common.Submit");
        btnSubmit.OnClick = new Action(OnSubmitClick);
		btnCancel.txt = Datas.getArString("Common.Cancel_Button");
        btnCancel.OnClick = new Action(OnCancelClick);

		xLabel.txt = Datas.getArString("Common.X");
		yLabel.txt = Datas.getArString("Common.Y");
		newCoord.txt = Datas.getArString("Common.NewCoordinates");
        icon.useTile = true;
        icon.tile = TextureMgr.instance().ItemSpt().GetTile("i6800");
		icon.drawTileByGraphics = true;
		notify.txt = Datas.getArString("Teleport.TeleportCondition");
        title.txt = Datas.getArString("itemName.i6800");
		
		if (RuntimePlatform.Android == Application.platform)
		{
			xField.type = TouchScreenKeyboardType.NumberPad;
			yField.type = TouchScreenKeyboardType.NumberPad;
			xField.hidInput = false;
			yField.hidInput = false;
		}
	}
	
	protected override void DrawItem()
	{
		icon.Draw();
		curCoord.Draw();
		line.Draw();
		newCoord.Draw();
		xLabel.Draw();
		yLabel.Draw();
		xField.Draw();
		yField.Draw();
		notify.Draw();
		btnSubmit.Draw();
		btnCancel.Draw();
	}
	
	public override void OnPush(object param)
	{
		int itemId = (int)param;
		m_ItemId = itemId;
		string iconTileName = Datas.singleton.getImageName(itemId);
		if (string.IsNullOrEmpty(iconTileName))
        {
			iconTileName = "i" + itemId.ToString();
        }

		icon.tile.name = iconTileName;
		title.txt = Datas.getArString("itemName.i" + itemId.ToString());

		int curCityId = GameMain.singleton.getCurCityId();
		HashObject cityInfo = GameMain.singleton.GetCityInfo(curCityId);
        string citycoord = string.Empty;
		if (cityInfo != null)
		{
            int x = KBN.GameMain.Ava.Seed.MyOutPostTileX;
            int y = KBN.GameMain.Ava.Seed.MyOutPostTileY;
            citycoord = string.Format("({0}, {1})", x.ToString(), y.ToString());	
		}
		curCoord.txt = Datas.getArString("Common.CurrentCoordinates") + "\n" + citycoord;
	}
	
	public override void Update()
	{
		CheckCoordinate(xField);	
		CheckCoordinate(yField);				
	}
	
    private void CheckCoordinate(InputText checkField)
	{
		if (string.IsNullOrEmpty(checkField.txt))
        {
			checkField.txt = "1";
		}
        else
        {
			int intValue = 0;
            if (!int.TryParse(checkField.txt, out intValue) || intValue <= 0)
            {
                checkField.txt = "1";
            }
            else if (intValue > Constant.Map.AVA_MINIMAP_WIDTH)
            {
                checkField.txt = Constant.Map.AVA_MINIMAP_WIDTH.ToString();
			}
		}
	}
	
	private void StartTeleport(object param)
	{
		int x = _Global.INT32(xField.txt);
		int y = _Global.INT32(yField.txt);
        GameMain.Ava.Inventory.UseItem(m_ItemId, x, y);
	}

    private void OnSubmitClick()
    {
        string confirmStr = Datas.getArString("Teleport.TeleportConfirm") + string.Format("\n({0}, {1})", xField.txt, yField.txt);
        
        ConfirmDialog cd = MenuMgr.instance.getConfirmDialog();
        cd.setLayout(600, 380);
        cd.setTitleY(120);
        cd.setButtonText(Datas.getArString("Common.OK_Button"), Datas.getArString("Common.Cancel"));
        MenuMgr.instance.PushConfirmDialog(confirmStr, string.Empty, new Action<object>(StartTeleport), null);
    }

    private void OnCancelClick()
    {
        MenuMgr.instance.PopMenu("");
    }
}
