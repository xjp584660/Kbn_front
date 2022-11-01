class BoxContent extends UIObject
{
	public var btnOK:Button;	
	public var bg:Label;
	public var icon:ItemPic;
	public var nameLabel:Label;
	public var countLabel:Label;
	public var splashLabel:Label;
		
	private var eventHandler:IEventHandler;
	
	public function Init():void
	{
		btnOK.Init();
		bg.Init();
		icon.Init();
		nameLabel.Init();
		countLabel.Init();
		splashLabel.Init();
		
		btnOK.OnClick = handleClick;
		bg.setBackground("square_black2",TextureType.DECORATION);
	}
	
	private function handleClick():void
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
	public function SetRowData(_data:Object):void
	{
		var arr:Array = _data as Array;
		
		btnOK.txt = Datas.getArString("Common.OK_Button");
		
		if(arr.length == 0)
		{
			icon.SetVisible(false);
			nameLabel.SetVisible(false);
			countLabel.SetVisible(false);	
			splashLabel.SetVisible(false);			
		}
		else
		{
			var data:HashObject = arr[0];
		
			icon.SetVisible(true);
			nameLabel.SetVisible(true);
			countLabel.SetVisible(true);
			splashLabel.SetVisible(true);
		
			//icon.useTile = true;
			//icon.tile.spt = TextureMgr.instance().ElseIconSpt();
			//icon.tile.name = TextureMgr.instance().LoadTileNameOfItem(_Global.INT32(data["itemId"].Value));
			icon.SetId(_Global.INT32(data["itemId"].Value));		
			
			nameLabel.txt = Datas.getArString("itemName.i" + data["itemId"].Value) + " ( x " + data["count"].Value + " )";
			countLabel.txt = ""; //Datas.getArString("Common.Count" + ": " + data["count"].Value);
		}
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
				
		bg.Draw();
		splashLabel.Draw();
		icon.Draw();
		nameLabel.Draw();
		countLabel.Draw();		
		btnOK.Draw();
		
		GUI.EndGroup();
	}
}