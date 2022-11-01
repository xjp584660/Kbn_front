
using UnityEngine;
using KBN;
using System.Collections;

public class NewSubItem : SubItem
{
	[SerializeField]
	private ItemPic itemPic;
    
    [SerializeField]
    private bool withProductSign;
	
	private SimpleLabel itemCover;
	private SimpleLabel ItemCover
	{
		get
		{
			if (itemCover == null)
			{
				itemCover = new SimpleLabel();
				itemCover.rect = itemPic.rect;
				itemCover.SetVisible(false);
				SetItemCoverTexture("item_progress_cover", TextureType.ICON_ELSE, ItemCoverColor);
			}
			return itemCover;
		}
	}

	private static readonly Color ItemCoverColor = new Color(0, 0, 0, .7f);

	public override void Init()
	{
		title.Init();
		description.Init();
	}
	
	private void SetItemCoverTexture(string name, string type, Color color)
	{
		itemCover.useTile = false;
		itemCover.mystyle.normal.background = TextureMgr.instance().LoadTexture(name, type);
		itemCover.SetColor(color);
	}

	public override void DrawItem()
	{	
        if (!visible)
        {
            return;
        }
		base.DrawItem();
		//GUI.BeginGroup(rect);
		backLabel.Draw();
		title.Draw();			
		itemPic.Draw();
		ItemCover.Draw();
		description.Draw();
		frame.Draw();
		//GUI.EndGroup();
		//return -1;
	}
	
	public override void SetRowData(object data)
	{
		if (data is InventoryInfo)
		{
			m_data = data as InventoryInfo;
			ItemCover.SetVisible(false);
		}
		else
		{
			var dataDict = data as Hashtable;
			m_data = dataDict["InventoryInfo"] as InventoryInfo;
			ItemCover.SetVisible(_Global.GetBoolean(dataDict["ShouldCover"]));
		}

		int qty = (m_data.customParam1 == 1) ? m_data.quant * 2 : m_data.quant;

        if (withProductSign)
        {
			description.txt = string.Format("X {0}", qty);
        }
        else
        {
			description.txt = qty.ToString();
        }

		if (m_data.customParam1 == 1)
		{
			description.txt = string.Format("<b>{0}</b> ({1} + {1})", description.txt, m_data.quant);
		}

		if (m_data.category == (int)MyItems.Category.GearItem)
		{
			title.txt = Datas.getArString("gearName.g" + m_data.id.ToString());
			itemPic.SetItemInventoryInfo(m_data);
		}
		else
		{
			//Object arStrings = Datas.instance().arStrings();
			if(MystryChest.singleton.IsMystryChest(m_data.id))
			{
				title.txt = MystryChest.singleton.GetChestName(m_data.id);
			}
			else if(MystryChest.singleton.IsLevelChest(m_data.id))
			{
				title.txt = string.Format(Datas.getArString("Common.LevelChestName"), MystryChest.singleton.GetLevelOfChest(m_data.id).ToString());
			}
			else
			{
				title.txt = Datas.getArString("itemName.i" + m_data.id); 
			}
		
			itemPic.SetId(m_data.id);
			
			if(MystryChest.singleton.IsLevelChest(m_data.id))
			{
				frame.SetVisible(true);	
			}
		}
		frame.SetVisible(false);
	}
}
