using System;
using System.Collections.Generic;

public class AvaInventory : AvaModule
{
    IDictionary<int, AvaItem> m_AvaItems;
    IDictionary<int, AvaUseItemRule> m_AvaUseItemRules;

    public AvaInventory(AvaManager avaEntry)
        : base(avaEntry)
    {
        m_AvaItems = new Dictionary<int, AvaItem>();
        m_AvaUseItemRules = new Dictionary<int, AvaUseItemRule>();
    }

    public override void Init()
    {
        KBN.GDS_AllianceShopItem gds = KBN.GameMain.GdsManager.GetGds<KBN.GDS_AllianceShopItem>();
        if (gds == null)
        {
            throw new NullReferenceException("GDS AllianceShopItem is invalid.");
        }

        Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection dataItems = gds.GetItems();
        foreach (KBN.DataTable.AllianceShopItem dataItem in dataItems)
        {
            m_AvaItems.Add(dataItem.ITEMTYPE, new AvaItem(this, dataItem.ITEMTYPE));
        }

        RegisterAllUseItemRules();
    }

	public int GetItemQuantityLimitUpgradeVer( int original, int itemID )
	{
		HashObject seed = KBN.GameMain.singleton.getSeed();
		int level = KBN._Global.INT32(seed["allianceLevel"]);
		KBN.GDS_AllianceUpgrade gds2 = KBN.GameMain.GdsManager.GetGds<KBN.GDS_AllianceUpgrade>();
		KBN.DataTable.AllianceUpgrade item2 = gds2.GetItemById( level );
		if( item2 != null )
		{
			string a = item2.Inventory_limit;
			string[] aa = a.Split(':');
			for( int i = 0; i < aa.Length; ++i )
			{
				string[] aaa = aa[i].Split('_');
				if( aaa.Length >= 2 )
				{
					if( aaa[0] == ""+itemID )
					{
						original = KBN._Global.INT32( aaa[1] );
						break;
					}
				}
			}
		}
		
		return original;
	}

    public bool MysticShopOpened
    {
        get;
        set;
    }

    public int CanBuyBasicCount
    {
        get
        {
            int count = 0;
            AvaItem[] items = GetBasicItems();
            for (int i = 0; i < items.Length; i++)
            {
				int quantityLim = GetItemQuantityLimitUpgradeVer( items[i].QuantityLimitation, items[i].Type );
				int canBuyCount = quantityLim - items[i].Quantity;
                if (canBuyCount <= 0)
                {
                    continue;
                }

                count += canBuyCount;
            }

            return count;
        }
    }

    public AvaItem[] GetBasicItems()
    {
        List<AvaItem> basicItems = new List<AvaItem>();
        foreach (AvaItem item in m_AvaItems.Values)
        {
            if (item.ShowInBasicShop)
            {
				if (item.BuyTime == 1 && item.RequireSkill > 0 && this.AvaEntry.Alliance.GetSkillLevel(item.RequireSkill) != item.RequireSkillLevel)
					continue;

                basicItems.Add(item);
            }
        }

        return basicItems.ToArray();
    }

    public AvaItem[] GetMysticItems()
    {
        return new AvaItem[] {};
    }

    public IList<AvaItem> GetInventoryItems()
    {
        IList<AvaItem> inventoryItems = new List<AvaItem>();
        foreach (AvaItem item in m_AvaItems.Values)
        {
            if (item.Quantity > 0)
            {
                inventoryItems.Add(item);
            }
        }

        return inventoryItems;
    }

    public AvaItem GetItem(int type)
    {
        AvaItem item = null;
        if (m_AvaItems.TryGetValue(type, out item))
        {
            return item;
        }

        return null;
    }

    public AvaUseItemRule GetUseItemRule(int type)
    {
        AvaUseItemRule rule = null;
        if (m_AvaUseItemRules.TryGetValue(type, out rule))
        {
            return rule;
        }

        return null;
    }

    public void UseItem(int type, params object[] args)
    {
        AvaItem item = GetItem(type);
        if (item == null)
        {
            throw new NullReferenceException(string.Format("Can not found ava item type '{0}'.", type));
        }

        AvaUseItemRule rule = GetUseItemRule(type);
        if (rule == null)
        {
            throw new NotSupportedException(string.Format("Can not found ava use item rule for item type '{0}'.", type));
        }

        rule.Use(item, args);
    }

    public void BuyItem(AvaShopType shopType, int type, int count)
    {
        if (shopType == AvaShopType.Undefined)
        {
            throw new ArgumentOutOfRangeException("shopType");
        }

        PBMsgReqAllianceShopBuy.PBMsgReqAllianceShopBuy request = new PBMsgReqAllianceShopBuy.PBMsgReqAllianceShopBuy
        {
            itemId = type,
            itemCount = count,
            location = (int)shopType,
        };

        KBN.UnityNet.RequestForGPB("allianceShopBuy.php", request, OnBuyItemOK);
    }

    private void RegisterAllUseItemRules()
    {
        RegisterUseItemRule(new AvaRelocateItemRule());
        RegisterUseItemRule(new AvaBuffItemRule());
        RegisterUseItemRule(new AvaSpeedUpItemRule());
    }

    private void RegisterUseItemRule(AvaUseItemRule rule)
    {
        int[] types = rule.GetIdoneousItemTypes();
        if (types == null)
        {
            return;
        }

        for (int i = 0; i < types.Length; i++)
        {
            if (m_AvaUseItemRules.ContainsKey(types[i]))
            {
                throw new InvalidOperationException(string.Format("Ava use item rule '{0}' already exist.", types[i]));
            }

            m_AvaUseItemRules.Add(types[i], rule);
        }
    }

    private void OnBuyItemOK(byte[] data)
    {
        PBMsgAllianceShopBuy.PBMsgAllianceShopBuy pbMessage = KBN._Global.DeserializePBMsgFromBytes<PBMsgAllianceShopBuy.PBMsgAllianceShopBuy>(data);
        AvaEntry.Player.ExpendablePoint = pbMessage.eap;

		if (pbMessage.itemCount > 0)
		{
	        KBN.MyItems.singleton.AddItemWithCheckDropGear(pbMessage.itemId, pbMessage.itemCount);
	        KBN.MenuMgr.instance.PushMessage(KBN.Datas.getArString("ToastMsg.BuySuccess"));
		}
		else
		{
			KBN.GameMain.singleton.seedUpdate(false);
			KBN.MenuMgr.instance.PushMessage(KBN.Datas.getArString("ToastMsg.UseItem"));
		}
		
		KBN.Game.Event.Fire(this, new KBN.AvaBuyItem());
		KBN.MenuMgr.instance.sendNotification("UpdateItem", null);
    }
}
