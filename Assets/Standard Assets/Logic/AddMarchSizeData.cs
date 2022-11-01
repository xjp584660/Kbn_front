using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using KBN;

public class AddMarchSizeData 
{

	public class MarchBuffItemData
	{
		public int itemId = 0;
		public long itemCount = 0;
		public long marchSize = 0;
		public bool selected = false;

		public MarchBuffItemData(int _itemId, long _itemCount, long _marchSize, bool _selected = false)
		{
			itemId = _itemId;
			itemCount = _itemCount;
			marchSize = _marchSize;
			selected = _selected;
		}
	}

	private static AddMarchSizeData singleton = null;
	private List<MarchBuffItemData> buffItemList = null;

	private AddMarchSizeData()
	{
	}

	public static AddMarchSizeData getInstance()
	{
		if(singleton == null)
		{
			singleton = new AddMarchSizeData();
			GameMain.singleton.resgisterRestartFunc(new Action(OnRestartGame));
			singleton.InitBuffList();
		}
		return singleton;
	}

	public List<MarchBuffItemData> BuffItemList
	{
		get
		{
			return buffItemList;
		}
	}

	private static void OnRestartGame()
	{
		singleton = null;
	}

	private void InitBuffList()
	{
		//no config, so hard code......*&&%$$%^ ....
		buffItemList = new List<MarchBuffItemData> ();
		MarchBuffItemData dataItem = new MarchBuffItemData (0,0,0,true);
		buffItemList.Add (dataItem);

	 	dataItem = new MarchBuffItemData (3293,MyItems.singleton.countForItem(3293),25000);
		buffItemList.Add (dataItem);

		dataItem = new MarchBuffItemData (3294,MyItems.singleton.countForItem(3294),50000);
		buffItemList.Add (dataItem);
	}

	public void ResetBuffListData()
	{
		for(int i=0;i<buffItemList.Count;i++)
		{
			buffItemList[i].itemCount = MyItems.singleton.countForItem(buffItemList[i].itemId);
			if(buffItemList[i].itemId == 0)
			{
				buffItemList[i].selected = true;
			}
			else
			{
				buffItemList[i].selected = false;
			}

		}
	}

	public void UpdateDataItem(int _itemId, bool _selected)
	{
		for(int i=0;i<buffItemList.Count;i++)
		{
			if(buffItemList[i].itemId == _itemId)
			{
				buffItemList[i].itemCount = MyItems.singleton.countForItem(_itemId);
				buffItemList[i].selected = _selected;
				return;
			}
		}
	}

	public void OnToggleBuffItem(MarchBuffItemData data)
	{
		for(int i=0;i<buffItemList.Count;i++)
		{
			if(buffItemList[i].itemId == data.itemId)
			{
				buffItemList[i].selected = true;
			}
			else
			{
				buffItemList[i].selected = false;
			}
		}
	}

	public int GetSelectedBuffItemId()
	{
		for(int i=0;i<buffItemList.Count;i++)
		{
			if(buffItemList[i].selected == true)
			{
				return buffItemList[i].itemId;
			}
		}
		return 0;
	}

	public long GetSelectedBuffSize()
	{
		for(int i=0;i<buffItemList.Count;i++)
		{
			if(buffItemList[i].selected == true)
			{
				return buffItemList[i].marchSize;
			}
		}
		return 0;
	}

}
