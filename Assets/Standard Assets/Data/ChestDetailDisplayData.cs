using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

using MyItems = KBN.MyItems;
using Datas = KBN.Datas;
using MystryChest = KBN.MystryChest;
using _Global = KBN._Global;

public class ChestDetailDisplayData
{
    public int Id { get; private set; }

    public string Name { get; private set; }

    public string Desc { get; private set; }

    public string DescMyst { get; private set; }

    public bool ShouldShowDescMyst { get; private set; }

    public string DescMyst2 { get; private set; }

    public bool ShouldShowDescMyst2 { get; private set; }

    private List<InventoryInfo> itemList = new List<InventoryInfo>();

    public InventoryInfo[] Items
    {
        get
        {
            return itemList.ToArray();
        }
    }

    public bool ShouldShowItemList { get; private set; }

    private const int GearDropChestBeginId = 64000;

    private const int GearDropChestEndId = 65000;

    private ChestDetailDisplayData()
    {
        DescMyst2 = Datas.getArString("itemDesc.MysteryChest_1");
    }

    private void InitWithHashObject(HashObject data)
    {
        if (Id == Constant.ItemId.WHEELGAME_KEY)
        {
            InitWheelGameKey(data);
			return;
        }
		switch ( (MyItems.Category)Convert.ToInt32(data["Category"].Value) )
		{
		case MyItems.Category.Chest:
            InitChest(data);
			break;

		case MyItems.Category.LevelChest:
            InitLevelChest(data);
			break;

		case MyItems.Category.MystryChest:
            InitMystryChest(data);
			break;

        case MyItems.Category.MonthlyCard:  //月卡类型的宝箱格式
            InitMonthlyCardChest(data);
            break;
		default:
			InitNormalItem(data);
			break;
        }
    }

    private void InitWheelGameKey(HashObject data)
    {
        Name = Datas.getArString(string.Format("itemName.i{0}", Id));
        Desc = Datas.getArString(string.Format("itemDesc.i{0}", Id));
        ShouldShowItemList = false;
        ShouldShowDescMyst = false;
        ShouldShowDescMyst2 = false;
    }

    private void InitChest(HashObject data)
    {
        Name = Datas.getArString(string.Format("itemName.i{0}", Id));
        Desc = Datas.getArString(string.Format("itemDesc.i{0}", Id));
        InitItemListData(Datas.singleton.chestlist()[string.Format("i{0}", Id)], null, false);
        ShouldShowItemList = true;
        ShouldShowDescMyst = false;
        ShouldShowDescMyst2 = false;
    }

    private void InitLevelChest(HashObject data)
    {
        int level = MystryChest.singleton.GetLevelOfChest(Id);
        Name = string.Format(Datas.getArString("Common.LevelChestName"), level);
        HashObject subItems = data["subItems"];
        ShouldShowDescMyst = false;
        if (subItems != null)
        {
            ShouldShowItemList = true;
            InitItemListData(subItems, null, true);
            Desc = Datas.getArString("itemDesc.MysteryChest_1");
            ShouldShowDescMyst2 = false;
        }
        else
        {
            ShouldShowItemList = false;
            Desc = string.Format(Datas.getArString("Common.LevelChestDesc"), level);
            ShouldShowDescMyst2 = _Global.GetBoolean(data["inShop"]);
        }
    }

    private void InitMonthlyCardChest(HashObject data)
    {
        Name = Datas.getArString(string.Format("itemName.i{0}", Id));
        Desc = Datas.getArString(string.Format("itemDesc.i{0}", Id));
        ShouldShowDescMyst2=false;
        HashObject subItems = data["subItems"];
        if (subItems != null)
        {
            ShouldShowItemList = true;
            InitItemListData(subItems, null, true);
        }
        else
        {
            ShouldShowItemList = false;
        }
    }

	private void InitNormalItem(HashObject data)
	{
		Name = Datas.getArString(string.Format("itemName.i{0}", Id));
		Desc = Datas.getArString(string.Format("itemDesc.i{0}", Id));
	}

    private void InitMystryChest(HashObject data)
    {
        Name = MystryChest.singleton.GetChestName(Id);
        Desc = MystryChest.singleton.GetChestDesc(Id);
        HashObject subItems = data["subItems"];

        List<int> dropGearItemIds = null;
        if (data["gearDrop"] != null)
        {
            dropGearItemIds = new List<int>();
            foreach (HashObject gearItem in _Global.GetObjectValues(data["gearDrop"]))
            {
                dropGearItemIds.Add(_Global.INT32(gearItem["gid"]));
            }
        }

        if (subItems != null && dropGearItemIds != null)
        {
            InitItemListData(subItems, dropGearItemIds, false);
            ShouldShowItemList = true;
            ShouldShowDescMyst = false;
            ShouldShowDescMyst2 = false;

            if (Id >= GearDropChestBeginId && Id < GearDropChestEndId)
            {
                Desc = Datas.getArString("itemDesc.Blacksmith_2");
            }
            else
            {
                Desc = Datas.getArString("itemDesc.MysteryChest_2");
            }
        }
        else
        {
            ShouldShowItemList = false;
            ShouldShowDescMyst = true;
            DescMyst = MystryChest.singleton.GetChestDescMyst(Id);
            ShouldShowDescMyst2 = _Global.GetBoolean(data["inShop"]);
            if (Id >= GearDropChestBeginId && Id < GearDropChestEndId)
            {
                DescMyst2 = Datas.getArString("itemDesc.Blacksmith_1");
            }
            else
            {
                DescMyst2 = Datas.getArString("itemDesc.MysteryChest_1");
            }
        }
    }

	public static InventoryInfo[] GetOfferItems(HashObject subItems)
	{
		List<InventoryInfo> itemListTemp = new List<InventoryInfo>();
		
		if (subItems != null)
		{
			List<string> keys = new List<string>(_Global.GetObjectKeys(subItems));
			keys.Sort(SortItemKeys);
			for (int i = 0; i < keys.Count; i++)
			{
				var newItem = new InventoryInfo();
				newItem.id = GetIdFromKey(keys[i]);
				newItem.quant = _Global.INT32(subItems[keys[i]]);
				newItem.category = (int)MyItems.GetItemCategoryByItemId(newItem.id);
				itemListTemp.Add(newItem);
			}
		}

		return itemListTemp.ToArray();
	}

    private void InitItemListData(HashObject subItems, List<int> dropGearItemIds, bool isLevelChest)
    {
        itemList.Clear();

        if (subItems != null)
        {
            List<string> keys = new List<string>(_Global.GetObjectKeys(subItems));
            keys.Sort(SortItemKeys);
            for (int i = 0; i < keys.Count; i++)
            {
                var newItem = new InventoryInfo();
                newItem.id = GetIdFromKey(keys[i]);
                newItem.quant = _Global.INT32(subItems[keys[i]]);

                if (isLevelChest)
                {
                    if (MystryChest.singleton.IsLevelChest(newItem.id))
                    {
                        itemList.Insert(0, newItem);
                    }
                    else
                    {
                        itemList.Add(newItem);
                    }
                }
                else
                {
                    itemList.Add(newItem);
                }
            }
        }

        if (dropGearItemIds != null)
        {
            for (int i = 0; i < dropGearItemIds.Count; ++i)
            {
                var newItem = new InventoryInfo();
                newItem.id = _Global.INT32(dropGearItemIds[i]);
                newItem.quant = 1;
                newItem.category = (int)MyItems.Category.GearItem; 
                itemList.Add(newItem);
            }
        }
    }

    private static int SortItemKeys(string key1, string key2)
    {
        return GetIdFromKey(key1) - GetIdFromKey(key2);
    }

    private static int GetIdFromKey(string key)
    {
        return key.IndexOf('i') == 0 ? _Global.INT32(key.Split('i')[1]) : _Global.INT32(key);
    }

    public override string ToString() {
        return string.Format("[ChestDetailDisplayData: Id={0}, Name=\"{1}\", Desc=\"{2}\", DescMyst=\"{3}\", ShouldShowDescMyst={4}, " +
                             "DescMyst2=\"{5}\", ShouldShowDescMyst2={6}, itemList.Count={7}, ShouldShowItemList={8}]",
                             Id, Name, Desc, DescMyst, ShouldShowDescMyst,
                             DescMyst2, ShouldShowDescMyst2, itemList.Count, ShouldShowItemList);
    }

    public static ChestDetailDisplayData CreateWithHashObject(HashObject ho)
    {
        if (ho == null)
        {
            throw new ArgumentNullException("Cannot create from null.");
        }

        var ret = new ChestDetailDisplayData();
        ret.Id = Convert.ToInt32(ho["ID"].Value);
        ret.InitWithHashObject(ho);
        return ret;
    }
}
