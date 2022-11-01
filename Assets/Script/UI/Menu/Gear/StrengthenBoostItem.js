#pragma strict

class StrengthenBoostItem extends ListItem
{
	private var itemId:int;
	private var itemData:Hashtable;
	
	public var line:SimpleLabel;
	public var sale:Label; // this is sale icon
	public var owned:Label;
	
	public var saleComponent:SaleComponent;
	private var ownedNum:int;
	
	function Init()
	{
		btnSelect.OnClick = handleClick;
		line.setBackground("between line_list_small",TextureType.DECORATION);
		
		saleComponent.Init();
	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		line.Draw();
		icon.Draw();
		title.Draw();
		description.Draw();
		owned.Draw();
		saleComponent.Draw();
		btnSelect.Draw();
		sale.Draw();

		GUI.EndGroup();
	}
	
	function Update()
	{
		saleComponent.Update();
	}
	
	private function setButtonState(ownedNum:int):void
	{
		if(ownedNum > 0)
		{
			saleComponent.SetVisible(false);
			sale.SetVisible(false);
			
			btnSelect.txt = Datas.getArString("Common.Use_button");
			btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
			btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
			owned.txt = Datas.getArString("Common.Owned") + ": " + ownedNum;
		}
		else
		{
			btnSelect.txt = Datas.getArString("Common.BuyAndUse_button");
			btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
			btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_downnew",TextureType.BUTTON);
			owned.txt = Datas.getArString("Common.Owned") + ": 0";
		}	
	}
	
	function SetRowData(data:Object)
	{
		itemId = (data as Hashtable)["ID"];
		itemData = (data as Hashtable)["itemData"] as Hashtable;
		
		icon.useTile = true;
		icon.tile = TextureMgr.instance().ElseIconSpt().GetTile(TextureMgr.instance().LoadTileNameOfItem(itemId));
		//icon.tile.name = TextureMgr.instance().LoadTileNameOfItem(itemId);

		ownedNum = (data as Hashtable)["count"];
		
		saleComponent.setData(itemData["price"], itemData["salePrice"], _Global.INT64(itemData["startTime"]), _Global.INT64(itemData["endTime"]), itemData["isShow"]);
		sale.SetVisible(saleComponent.isShowSale);

		setButtonState(ownedNum);
		
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt = Datas.getArString("itemName.i" + itemId);
		description.txt = Datas.getArString("itemDesc.i"+itemId) ;
	}
	
	private function handleClick():void
	{
		if(ownedNum > 0)
		{
			MyItems.instance().Use(itemId);	
			
			ownedNum -= 1;
			setButtonState(ownedNum);
			owned.txt = Datas.getArString("Common.Owned") + ": " + ownedNum;
		}
		else
		{
			var buySucess:System.Action = function()
			{
				MyItems.instance().Use(itemId);
			};		
		
			Shop.instance().swiftBuy(itemId, buySucess);
		}
	}
}
