using KBN;
using System;
using UnityEngine;

public class AvaInventoryItem : ListItem
{
    [SerializeField]
    private Label informationIcon;
    [SerializeField]
    private Label owned;
    [SerializeField]
    private Label require;
    [SerializeField]
    private Label mask;
    [SerializeField]
	private SimpleLabel line;
    [SerializeField]
	private Button btnDetail;

    private AvaItem avaItem;
    private CombinationController combination;
    private Turnover turnover;
    private Fade nameFade;
    private Fade informationIconFade;
    private Fade descriptionFade;

	public override void Init()
	{
        icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
        icon.useTile = true;

        mask.alphaEnable = true;
        mask.alpha = 0.7f;

        title.SetFont();

        combination = new CombinationController(CombinationController.CombinationType.SERIAL);

        turnover = new Turnover();
        turnover.init(null, mask, true);
        combination.add(turnover);

        informationIconFade = new Fade();
        informationIconFade.init(informationIcon, EffectConstant.FadeType.FADE_OUT);
        combination.add(informationIconFade);

        nameFade = new Fade();
        nameFade.init(title, EffectConstant.FadeType.FADE_IN);
        combination.add(nameFade);

        descriptionFade = new Fade();
        descriptionFade.init(description, EffectConstant.FadeType.FADE_IN);
        combination.add(descriptionFade);

        require.txt = Datas.getArString("AVA.Outpost_item_noneusedesc");
        btnSelect.txt = Datas.getArString("Common.Use_button");
        btnSelect.OnClick = new Action(OnUseClick);
		btnDetail.OnClick = new Action(OnDetailClick);
    }

    public override void Update()
    {
        combination.updateEffect();
    }

    public override int Draw()
    {
        GUI.BeginGroup(rect);
        title.Draw();
        owned.Draw();
        require.Draw();
        line.Draw();
        turnover.drawItems();
        nameFade.drawItems();
        descriptionFade.drawItems();
        icon.Draw();
        informationIconFade.drawItems();
        btnDetail.Draw();
        btnSelect.Draw();
        GUI.EndGroup();

        return -1;
    }

    public override void UpdateData()
    {
		int quantityLim = KBN.GameMain.Ava.Inventory.GetItemQuantityLimitUpgradeVer( avaItem.QuantityLimitation, avaItem.Type );
		owned.txt = string.Format("{0}: {1}/{2}", Datas.getArString("Common.Owned"), avaItem.Quantity.ToString(), quantityLim.ToString());
        btnSelect.SetVisible(avaItem.ShowUse && avaItem.CanUse);
        require.SetVisible(avaItem.ShowUse && !avaItem.CanUse && GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Combat);
    }

    public override void SetRowData(object data)
    {
        avaItem = data as AvaItem;
        if (avaItem == null)
        {
            throw new System.ArgumentNullException("data");
        }

        UpdateData();
        icon.tile.name = TextureMgr.singleton.LoadTileNameOfItem(avaItem.Type);
        title.txt = avaItem.Name;
        description.txt = avaItem.Description;

        OutpostMenu outpostMenu = MenuMgr.instance.getMenu("OutpostMenu") as OutpostMenu;
        if (outpostMenu == null)
        {
            throw new NullReferenceException("OutpostMenu is invalid.");
        }
        
        OutpostTabInventory outpostInventory = outpostMenu.GetInventoryTab();
        if (outpostInventory == null)
        {
            throw new NullReferenceException("OutpostTabInventory is invalid.");
        }

        if (outpostInventory.IsSelected(avaItem.Type))
        {
            combination.resetEffectState((int)EffectConstant.EffectState.END_STATE);
        }
        else
        {
            combination.resetEffectState((int)EffectConstant.EffectState.START_STATE);
        }
    }

    public override bool isUseOutListItem()
    {
        UnityEngine.Debug.LogWarning(avaItem.Quantity.ToString());
        if (avaItem == null)
        {
            return false;
        }

        if (avaItem.Quantity > 0)
        {
            return false;
        }

        return true;
    }

    private void OnUseClick()
    {
        OutpostMenu outpostMenu = MenuMgr.instance.getMenu("OutpostMenu") as OutpostMenu;
        if (outpostMenu == null)
        {
            throw new NullReferenceException("OutpostMenu is invalid.");
        }

        OutpostTabInventory outpostInventory = outpostMenu.GetInventoryTab();
        if (outpostInventory == null)
        {
            throw new NullReferenceException("OutpostTabInventory is invalid.");
        }

        outpostInventory.UseItem(avaItem.Type);
    }

	private void OnDetailClick()
	{
        OutpostMenu outpostMenu = MenuMgr.instance.getMenu("OutpostMenu") as OutpostMenu;
        if (outpostMenu == null)
        {
            throw new NullReferenceException("OutpostMenu is invalid.");
        }
        
        OutpostTabInventory outpostInventory = outpostMenu.GetInventoryTab();
        if (outpostInventory == null)
        {
            throw new NullReferenceException("OutpostTabInventory is invalid.");
        }

        if (outpostInventory.IsSelected(avaItem.Type))
		{
			combination.revertEffect();
            outpostInventory.Unselect(avaItem.Type);
		}
		else
		{
			combination.playEffect();
            outpostInventory.Select(avaItem.Type);
		}
	}
}
