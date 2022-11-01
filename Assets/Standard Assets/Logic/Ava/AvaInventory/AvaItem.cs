using System;

public class AvaItem
{
    private AvaInventory m_AvaInventory;
    private KBN.DataTable.AllianceShopItem m_GdsItem;

    public AvaItem(AvaInventory avaInventory, int type)
    {
        if (avaInventory == null)
        {
            throw new ArgumentNullException("avaInventory");
        }

        m_AvaInventory = avaInventory;
        Type = type;
        KBN.GDS_AllianceShopItem gds = KBN.GameMain.GdsManager.GetGds<KBN.GDS_AllianceShopItem>();
        if (gds == null)
        {
            throw new NullReferenceException("GDS AllianceShopItem is invalid.");
        }

        m_GdsItem = gds.GetItemById(type);
        if (m_GdsItem == null)
        {
            throw new NullReferenceException(string.Format("Can not find key '{0}' in GDS AllianceShopItem.", type.ToString()));
        }
    }
    
    public int Type
    {
        get;
        private set;
    }
    
    public string Name
    {
        get
        {
            return KBN.Datas.getArString("itemName.i" + Type);
        }
    }

    public string Description
    {
        get
        {
            return KBN.Datas.getArString("itemDesc.i" + Type);
        }
    }

    public bool ShowInBasicShop
    {
        get
        {
            return m_GdsItem.ISSHOW != 0;
        }
    }

    public int BuffId
    {
        get
        {
            return m_GdsItem.BUFF_ID;
        }
    }

    public int Duration
    {
        get
        {
            return m_GdsItem.DURATION;
        }
    }

    public bool ShowUse
    {
        get
        {
            AvaUseItemRule rule = m_AvaInventory.GetUseItemRule(Type);
            if (rule == null)
            {
                return false;
            }
            
            return rule.ShowUse(this);
        }
    }

    public bool CanUse
    {
        get
        {
            if (Quantity <= 0)
            {
                return false;
            }

            AvaUseItemRule rule = m_AvaInventory.GetUseItemRule(Type);
            if (rule == null)
            {
                return false;
            }

            return rule.CanUse(this);
        }
    }

    public int Price
    {
        get
        {
            return m_GdsItem.BASIC_SHOP_PRICE;
        }
    }

    public int Quantity
    {
        get
        {
            return KBN.MyItems.singleton.GetItemCount(Type);
        }
    }
    
    public int QuantityLimitation
    {
        get
        {
            return m_GdsItem.QUANTITY_LIMITAION;
        }
    }

    public int AllianceLevelLimitation
    {
        get
        {
            return m_GdsItem.REQ_ALLIANCE_LEVEL;
        }
    }

	public int RequireSkill
	{
		get
		{
			if (m_GdsItem.REQ_SKILL_LEVEL.Contains("_"))
			{
				return KBN._Global.INT32(m_GdsItem.REQ_SKILL_LEVEL.Split('_')[0]);
			}
			return -1;
		}
	}

	public int RequireSkillLevel
	{
		get
		{
			if (m_GdsItem.REQ_SKILL_LEVEL.Contains("_"))
			{
				return KBN._Global.INT32(m_GdsItem.REQ_SKILL_LEVEL.Split('_')[1]);
			}
			return -1;
		}
	}

	public int BuyTime
	{
		get
		{
			return m_GdsItem.BUY_TIME;
		}
	}
}
