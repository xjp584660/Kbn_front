public class BlueLightPrize extends PopMenu
{
	public var l_title 	:Label;

	public var l_img	:Label;
	public var l_name	:Label;
	public var btn_view	:Button;
	
	public function Init():void
	{
		super.Init();
		l_title.txt = Datas.getArString("paymentLabel.blueLightPrize_title");
		l_title.SetNormalTxtColor(FontColor.New_Describe_Grey_1);
		
		l_img.useTile = true;
		l_img.tile = TextureMgr.instance().ElseIconSpt().GetTile(Constant.DefaultChestTileName);
		//l_img.tile.name = Constant.DefaultChestTileName;
		
		btn_view.txt =Datas.getArString("Common.View_Inventory");
		btn_view.OnClick = openMyItem;
		btn_view.SetNormalTxtColor(FontColor.Button_White);
		
		l_name.SetNormalTxtColor(FontColor.New_Describe_Grey_1);
	}
	
	public function OnPush(param:Object):void
	{
		//TODO...
		var chestId:int;
		if(param)
		{
			chestId = _Global.INT32((param as HashObject)["chest"]);
		}
		
		l_name.txt = Datas.getArString("itemName.i" + chestId);
		
	}
	
	protected function openMyItem(clickParam:Object):void
	{
		MenuMgr.getInstance().PopMenu("");
		MenuMgr.getInstance().PushMenu("InventoryMenu",{"selectedTab":1,"selectedList":4,"isRate":true});

	}
	
	public function DrawItem()
	{
		l_title.Draw();
		l_img.Draw();
		l_name.Draw();
		btn_view.Draw();
	}		
	
	public function OnPopOver()
	{
		GameMain.instance().CheckAndOpenRaterAlert("bluelight");		
	}
	
	
}