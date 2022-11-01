class TreasureItem extends ListItem
{
	private var data:InventoryInfo;
	
	public var numberLabel:Label;
	public var line:Label;
	public var iconPic:ItemPic;
	
	public function Init():void
	{
		numberLabel.Init();
		title.Init();
		description.Init();
		//icon.Init();
		btnSelect.Init();
		line.Init();
		
		line.setBackground("between line_list_small", TextureType.DECORATION);
		iconPic.Init();
		
		btnSelect.OnClick = handleClick;
	}
	
	private function handleClick():void
	{
		Treasure.getInstance().openTreasurePopmenu(0, 0, data.id, null);
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		//icon.Draw();
		title.Draw();
		description.Draw();
		numberLabel.Draw();
		btnSelect.Draw();
		line.Draw();
		iconPic.Draw();
		
		GUI.EndGroup();
	}	
	
	public function SetRowData(_data:Object):void
	{
		data = _data as InventoryInfo;
		
		if(data.category == MyItems.Category.TreasureChest)
		{
			btnSelect.SetVisible(true);
			description.txt = Datas.getArString("Common.OpenTreasureChest");
		}
		else
		{
			btnSelect.SetVisible(false);
			description.txt = Datas.getArString("itemDesc.i" + data.id);
		}
		
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt = Datas.getArString("itemName.i" + data.id);

		numberLabel.txt = Datas.getArString("Common.Owned") + ": " + data.quant;
		
		btnSelect.txt = Datas.getArString("Common.Use_button");
		
		//icon.useTile = true;
		//icon.tile.spt = TextureMgr.instance().ElseIconSpt();
		//icon.tile.name = TextureMgr.instance().LoadTileNameOfItem(data.id);
		
		iconPic.SetId(data.id);		
	}	
	
}