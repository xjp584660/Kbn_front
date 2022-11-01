#pragma strict

class StrengthenMatMenu extends PopMenu
{
	public var seperateLine:Label;
	public var seperateLine1:Label;
	public var scrollList:ScrollList;
	public var boostItem:StrengthenBoostItem;
	
	public var composed:ComposedUIObj;
	public var buff:Label;
	public var label1:Label;
	public var label2:Label;
	public var label3:Label;
	public var label4:Label;
	public var itemName:Label;
	public var icon:Label;	

	private var resourceId:int;
	private var m_data:Hashtable;
	private var buffEndTime:long;
	private var lastTime:long;
	private var remainTime:long;
	
	private var reqItemId:int;
	
	function Init()
	{
		super.Init();
		
		title.txt = Datas.getArString("Gear.UpgradeItemTitle");
		scrollList.Init(boostItem);
		
		seperateLine.setBackground("between line", TextureType.DECORATION);
		seperateLine1.setBackground("between line", TextureType.DECORATION);
		
		buff.Init();
		label1.Init();
		label2.Init();
		label3.Init();
		label4.Init();
		itemName.Init();
		icon.Init();
		
		seperateLine1.Init();
		seperateLine.Init();
		
		composed.component = [itemName, buff, label1, label2, label3, label4];		
	}
	
	function OnPush(param:Object)
	{
		super.OnPush(param);
	
		if(aniOwnedLabel)
		{
			aniOwnedLabel.SetVisible(true);
			aniOwnedLabel = null;
		}
		
		if(aniBuffLabel)
		{
			aniBuffLabel.SetVisible(true);
			aniBuffLabel = null;
		}
		
	
		reqItemId = (param as Hashtable)["data"];
		newInitComponent(true);
		SetItems();
	}
	
	public function OnPopOver()
	{
		scrollList.Clear();
	}
	
	function Update()
	{
		scrollList.Update();

		// playAnimation();				
	}
	
	function DrawItem()
	{
		icon.Draw();
		composed.Draw();
		seperateLine.Draw();
		seperateLine1.Draw();		
		scrollList.Draw();
	}
	
	private function SetItems():void
	{
		var sellItemIds:List.<int> = GameMain.GdsManager.GetGds.<KBN.GDS_GearItemChestList>().GetCanBuyItemList(reqItemId);
		if (null == sellItemIds)
			return;
		
		var data:Hashtable;
		var arr:Array = new Array();
		for(var a:int = 0; a < sellItemIds.Count; a++)
		{
			var itemId:int = _Global.INT32(sellItemIds[a]);
			var count:int = MyItems.instance().countForItem(itemId);
			var itemData:Hashtable = GetItemData(itemId);
			
			data = {"ID":itemId, "count":count, "itemData":itemData};
			arr.Push(data);
		}
		
		scrollList.SetData(arr);
	}
	
	private function GetItemData(itemId:int):Hashtable
	{
		var itemData:Hashtable;
		if (MystryChest.instance().IsMystryChest(itemId) || MystryChest.instance().IsLevelChest(itemId))
		{
			itemData = MystryChest.instance().GetChestItemData(itemId);
		}
		else
		{
			var price:int = _Global.INT32((Datas.instance().itemlist())["i" + itemId]["price"]);		
			itemData = {"price":price, "salePrice":price, "startTime":0, "endTime":0 ,"isShow":0};
			// itemData = Shop.instance().getItem(Shop.PRODUCT, itemId);
		}
		
		return itemData;
	}
	
	public function newInitComponent(isInit:boolean):void
	{
		itemName.txt = Datas.getArString("itemName.i" + reqItemId);
		GearSysHelpUtils.SetMyItemIcon(icon, reqItemId);
		
		ownedNum = MyItems.instance().countForItem(reqItemId);
		
		label1.txt = Datas.getArString("itemDesc.i" + reqItemId);
		label2.txt = "";
		label3.txt = Datas.getArString("Common.Owned") + ": " + ownedNum.ToString();
		label4.txt = "";
		buff.txt = "";
	}
	
	private var aniOwnedLabel:Label;
	private var aniBuffLabel:Label;
	private var ownedNum:long;
	private var buffNum:long;
	private var countForOwned:int = 0;
	private var countForBuff:int = 0;
	
	
	public function setAnimation():void
	{
		aniOwnedLabel = label3;
		
		countForOwned = 0;
		timerOwned = 0.0f;
	}
	
	private var timerOwned:float;
	private var timerbuff:float;
	private var duration:float = 0.2;
	private var maxCount:int = 8;
	
	public function playAnimation():void
	{
		if(aniOwnedLabel)
		{
			timerOwned += Time.deltaTime;
			if(timerOwned > duration * countForOwned)
			{
				if(countForOwned < maxCount)
				{
					aniOwnedLabel.SetVisible(countForOwned % 2 > 0 ? true : false);			
				}
				
				countForOwned++;
				
				if(countForOwned > maxCount + 1)
				{
					aniOwnedLabel.txt = Datas.getArString("Common.Owned") + ": " + _Global.NumFormat(ownedNum);
					aniOwnedLabel.SetVisible(true);
					aniOwnedLabel = null;
					countForOwned = 0;
				}
			}
		}
	}

	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
		case Constant.Notice.ITEM_USE_CHEST:
			newInitComponent(false);
			setAnimation();				
			break;
		}		
	}	
}