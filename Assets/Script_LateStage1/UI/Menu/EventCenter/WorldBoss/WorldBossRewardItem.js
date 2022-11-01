

public class WorldBossRewardItem extends ListItem
{
	public var itemName:Label;
	public var count:Label;
	public var bg:Label;

	public function Init(){
		super.Init();
		icon.useTile=true;
		icon.tile=TextureMgr.instance().ItemSpt().GetTile(null);
	}

	public function SetRowData(data:Object){
		var reward:HashObject=data as HashObject;
		var texMgr : TextureMgr = TextureMgr.instance();
		icon.tile.name=texMgr.LoadTileNameOfItem(_Global.INT32(reward["id"]));	
		itemName.txt=MyItems.GetItemName(_Global.INT32(reward["id"]));
		count.txt="x"+_Global.INT32(reward["qty"]);
	}

	public function Draw(){
		GUI.BeginGroup(rect);
		// title.Draw();
		bg.Draw();
		icon.Draw();
		itemName.Draw();
		count.Draw();
		GUI.EndGroup();
	}

	public function OnPopOver()
	{
		super.OnPopOver();
		icon.tile.name = null;
		icon.tile = null;
	}
}