class StakeItem extends ListItem
{	
	public var owned:Label;
	public var l_Line:Label;
	public var saleCompTemp:SaleComponent;
	private var saleComp:SaleComponent;
	public var saleIcon:Label; 
		
	private var data:Hashtable;
	private var count:int;
	private var isUpdateCutSale:boolean;
	private var hasCutSale:boolean;
	private var startCutSale:boolean;
	private var endTime:long;
	private var startTime:long;
	private var price:int;
	
	public function Init():void
	{
		l_Line.setBackground("between line_list_small",TextureType.DECORATION);
		owned.Init();
		title.Init();
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		description.Init();
		icon.Init();
		btnSelect.Init();
		if (null != saleComp) {
			TryDestroy(saleComp);
			saleComp = null;
		}
		saleComp = Instantiate(saleCompTemp);
		saleComp.Init();
		saleIcon.Init();

		btnSelect.OnClick = handleClick;
		isUpdateCutSale = false;
		hasCutSale = false;
		startCutSale = false;
	}
	
	private function handleClick():void
	{
		var param:Hashtable = {"itemId":data["ID"], "price":price};
	
		if(data["type"])
		{
			handlerDelegate.handleItemAction(TreasurePopmenu.OPEN_CHEST, null);
		}
		else
		{
			if(count == 0)
			{
				handlerDelegate.handleItemAction(TreasurePopmenu.BUY_STAKE, param);
			}
			else
			{
				handlerDelegate.handleItemAction(TreasurePopmenu.USE_STAKE_OPEN_CHEST, param);
			}
		}
	}
	
	private function setBtnState(num:int):void
	{
		if(num > 0)
		{
			saleComp.SetVisible(false);
			saleIcon.SetVisible(false);
					
			btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
			btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
			btnSelect.txt = Datas.getArString("Common.UseAndOpenBtn");	
			owned.txt = Datas.getArString("Common.Owned") + ': ' + num;		
		}
		else
		{
			btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
			btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_downnew",TextureType.BUTTON);
			btnSelect.txt = Datas.getArString("Common.BuyAndOpenBtn");
			owned.txt = Datas.getArString("Common.Owned") + ': ' + "0";
		}
	}
	
	public function SetRowData(_data:Object):void
	{
		data = _data as Hashtable;
		
		var crestMap:HashObject = Treasure.getInstance().crestDescription;
		
		if(data["type"])
		{
			icon.SetVisible(false);
			owned.SetVisible(false);			
			title.SetVisible(false);
			
			saleIcon.SetVisible(false);
			saleComp.SetVisible(false);				
			
			description.rect = new Rect(60, 25, 280, 110);
			var chestId:int = Treasure.getInstance().chestId;
			
			if(crestMap["0"] != null)
			{
				
				description.txt = Datas.getArString("itemDesc.i" + chestId, [Datas.getArString("itemName.i" + (crestMap["0"]["itemId"] as HashObject).Value)]);					
			}
			else
			{
				description.txt = "";
			}
			
			
			btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
			btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
			btnSelect.txt = Datas.getArString("Common.CollectBtn");
			
		}
		else
		{
			icon.SetVisible(true);
			owned.SetVisible(true);
			title.SetVisible(true);
			//saleIcon.SetVisible(true);
			
			icon.useTile = true;
			icon.tile = TextureMgr.instance().ElseIconSpt().GetTile(TextureMgr.instance().LoadTileNameOfItem(data["ID"]));
			//icon.tile.name = TextureMgr.instance().LoadTileNameOfItem(data["ID"]);
			
			title.txt = Datas.getArString("itemName.i" + data["ID"]);
			
			if(crestMap[data["ID"] + ""] != null)
			{
				description.txt = Datas.getArString("itemDesc.i" + data["ID"], 
								  [(crestMap[data["ID"] + ""]["num"] as HashObject).Value + "", 
								  Datas.getArString("itemName.i" + (crestMap[data["ID"] + ""]["itemId"] as HashObject).Value)]);					
			}
			else
			{
				description.txt = "";
			}
			
			description.rect = new Rect(170, 40, 180, 105);
			var seed:HashObject = GameMain.instance().getSeed();
			count = seed["items"]["i" + data["ID"]] ? _Global.INT32(seed["items"]["i" + data["ID"]]) :0;
			
			saleComp.setData(data["price"], data["salePrice"], _Global.INT64(data["startTime"]), _Global.INT64(data["endTime"]), _Global.INT32(data["isShow"]));
	
			saleIcon.SetVisible(saleComp.isShowSale);
			setBtnState(count);			
		}
	}

	private var curTime:long;
	private var oldTime:long;
	public function Update()
	{
		saleComp.Update();
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);		
		l_Line.Draw();
		owned.Draw();
		icon.Draw();
		title.Draw();
		description.Draw();
		btnSelect.Draw();
		saleIcon.Draw();		
		saleComp.Draw();
		GUI.EndGroup();
	}

}