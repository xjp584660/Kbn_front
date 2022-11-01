
public class WorldBossDropItem extends ListItem
{
	public function Init(){
		super.Init();
		icon.useTile=true;
		icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
	}

	public function SetRowData(data:Object)
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		icon.tile.name=texMgr.LoadTileNameOfItem(_Global.INT32(data));
		
	}
}