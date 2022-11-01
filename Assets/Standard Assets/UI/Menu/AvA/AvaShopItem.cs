using KBN;
using System;
using UnityEngine;

public class AvaShopItem : ListItem
{
    [SerializeField]
    private Label lockIcon;
    [SerializeField]
    private Label informationIcon;
    [SerializeField]
    private Label owned;
    [SerializeField]
    private Label price;
    [SerializeField]
    private Label require;
    [SerializeField]
    private Label mask;
    [SerializeField]
	private SimpleLabel line;
    [SerializeField]
	private Button btnDetail;

    private AvaItem avaItem;
	private int buffId;
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

        btnSelect.txt = Datas.getArString("Common.Buy");
        btnSelect.OnClick = new Action(OnBuyClick);
		btnDetail.OnClick = new Action(OnDetailClick);
    }

	float lastUpdateTime = 0.0f;
    public override void Update()
    {
        combination.updateEffect();

		if (Time.realtimeSinceStartup - lastUpdateTime > 0.5f)
		{
			lastUpdateTime = Time.realtimeSinceStartup;

			if (avaItem != null && avaItem.BuyTime == 1)
				UpdateBuffTime();
		}
    }

    public override int Draw()
    {
        GUI.BeginGroup(rect);
        title.Draw();
        owned.Draw();
        price.Draw();
        require.Draw();
        line.Draw();
        turnover.drawItems();
        nameFade.drawItems();
        descriptionFade.drawItems();
        icon.Draw();
        lockIcon.Draw();
        informationIconFade.drawItems();
        btnDetail.Draw();
        btnSelect.Draw();
        GUI.EndGroup();

        return -1;
    }

	private void UpdateBuffTime()
	{
		if (buffId > 0)
		{
			long expireTime = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffEndTimeBy(buffId, BuffSource.Item);
			long timeLeft = expireTime - GameMain.unixtime();
			if (timeLeft < 0)
				timeLeft = 0;
			owned.txt = string.Format(Datas.getArString("AllianceShop.item_active"), _Global.timeFormatStr(timeLeft));
		}
	}

    public override void UpdateData()
    {
		int quantityLim = KBN.GameMain.Ava.Inventory.GetItemQuantityLimitUpgradeVer( avaItem.QuantityLimitation, avaItem.Type );
		if (avaItem.BuyTime == 0)
		{
			if (avaItem.Quantity >= quantityLim )
			{
				owned.txt = string.Format("{0}: <color=red>{1}/{2}</color>", Datas.getArString("Common.Owned"), avaItem.Quantity.ToString(), quantityLim.ToString());
			}
			else
			{
				owned.txt = string.Format("{0}: {1}/{2}", Datas.getArString("Common.Owned"), avaItem.Quantity.ToString(), quantityLim.ToString());
			}
		}
		else
		{
			UpdateBuffTime();
		}

        if (GameMain.Ava.Alliance.Level < avaItem.AllianceLevelLimitation)
        {
            lockIcon.SetVisible(true);
            require.txt = string.Format(Datas.getArString("Allianceshop.basicshop_unlockrequirement"), avaItem.AllianceLevelLimitation.ToString());
            require.SetVisible(true);
            btnSelect.SetVisible(false);
        }
        else if (avaItem.BuyTime == 0 && (GameMain.Ava.Event.CanEnterAvaMiniMap() || GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Match))
        {
            lockIcon.SetVisible(false);
            require.txt = Datas.getArString("Allianceshop.basicshop_BuyingPohibitedDuringTheBattle");
            require.SetVisible(true);
            btnSelect.SetVisible(false);
        }
        else
        {
            lockIcon.SetVisible(false);
            require.SetVisible(false);
            btnSelect.SetVisible(true);
			if (avaItem.BuyTime == 1)
			{
				btnSelect.txt = Datas.getArString("Common.BuyAndUse_button");
				btnSelect.SetFont(FontSize.Font_20);
			}
			else
			{
				btnSelect.txt = Datas.getArString("Common.Buy");
				btnSelect.SetFont(FontSize.Font_22);
			}

			if (avaItem.Quantity >= quantityLim || GameMain.Ava.Player.ExpendablePoint < avaItem.Price)
			{
				btnSelect.changeToGreyNew();
            }
            else
			{
				btnSelect.changeToGreenNew();
            }
        }
    }

    public override void SetRowData(object data)
    {
        avaItem = data as AvaItem;
        if (avaItem == null)
        {
            throw new System.ArgumentNullException("data");
        }

		buffId = -1;

		int itemId = avaItem.Type;
		if (itemId >= 6820 && itemId < 6860)
		{
			GDS_AllianceShopItem avaShopItemGds = GameMain.GdsManager.GetGds<GDS_AllianceShopItem>();
			var gdsItem = avaShopItemGds.GetItemById(itemId);
			buffId = gdsItem.BUFF_ID;
		}

        UpdateData();
        icon.tile.name = TextureMgr.singleton.LoadTileNameOfItem(avaItem.Type);
        title.txt = avaItem.Name;
        price.txt = avaItem.Price.ToString();
        description.txt = avaItem.Description;

        AvaShopMenu avaShopMenu = MenuMgr.instance.getMenu("AvaShopMenu") as AvaShopMenu;
        if (avaShopMenu == null)
        {
            throw new NullReferenceException("AvaShopMenu is invalid.");
        }

        if (avaShopMenu.IsSelected(avaItem.Type))
        {
            combination.resetEffectState((int)EffectConstant.EffectState.END_STATE);
        }
        else
        {
            combination.resetEffectState((int)EffectConstant.EffectState.START_STATE);
        }
    }

    private void OnBuyClick()
    {
        AvaShopMenu avaShopMenu = MenuMgr.instance.getMenu("AvaShopMenu") as AvaShopMenu;
        if (avaShopMenu == null)
        {
            throw new NullReferenceException("AvaShopMenu is invalid.");
        }

		// hard coded item id * alliance buff
		// 6820 ~ 6839    attack buff
		// 6840 ~ 6859    defense buff
		int itemId = avaItem.Type;
		if (buffId > 0)
		{
			long expireTime = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffEndTimeBy(buffId, BuffSource.Item);

			if (expireTime > 0)
			{
				var dialog = MenuMgr.instance.getConfirmDialog();
				dialog.setLayout(600, 320);
				dialog.setContentRect(70,85,0,110);


				MenuMgr.instance.PushConfirmDialog(Datas.getArString("Buff.Bufflist_Confirm"), string.Empty, new Action<object>(delegate (object obj) {
					avaShopMenu.BuyItem(itemId, 1);
				}), null, true);

				dialog.setButtonText(Datas.getArString("Common.Confirm"), Datas.getArString("Common.Cancel"));
				return;
			}
		}

		avaShopMenu.BuyItem(itemId, 1);
	}

	private void OnDetailClick()
	{
        AvaShopMenu avaShopMenu = MenuMgr.instance.getMenu("AvaShopMenu") as AvaShopMenu;
        if (avaShopMenu == null)
        {
            throw new NullReferenceException("AvaShopMenu is invalid.");
        }

        if (avaShopMenu.IsSelected(avaItem.Type))
		{
			combination.revertEffect();
            avaShopMenu.Unselect(avaItem.Type);
		}
		else
		{
			combination.playEffect();
            avaShopMenu.Select(avaItem.Type);
		}
	}
}
