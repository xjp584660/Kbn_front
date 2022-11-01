public class HeroElevateReqItem extends ListItem
{
	public var l_Enough:Label;
	public var l_line:Label;
	public var l_Own:Label;
	private var reqItem :KBN.HeroElevateReqItem = null;
	
	
	public function Init()
	{
		icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		icon.useTile = true;
		l_line.setBackground("between line_list_small",TextureType.DECORATION);
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
			
		icon.Draw();
		title.Draw();
		l_Enough.Draw();
		description.Draw();
		l_Own.Draw();
		l_line.Draw();
			
		GUI.EndGroup();
	}
	
	public function SetRowData(data : Object) : void
	{
		reqItem = data as KBN.HeroElevateReqItem;
		if (reqItem == null)
	    {
	    	return;
	    }
	    icon.tile.name  = TextureMgr.instance().LoadTileNameOfItem(reqItem.ID);
	    description.txt = Datas.getArString("itemDesc."+"i" + reqItem.ID);
	    title.txt = Datas.getArString("itemName."+"i" + reqItem.ID);
	    l_Own.txt = Datas.getArString("Common.Own") + ": " + reqItem.CurNum + "/" + reqItem.ReqNum;
	    if(reqItem.CurNum >= reqItem.ReqNum)
	    {
	    	l_Own.SetNormalTxtColor(FontColor.Description_Light);
	    	l_Enough.setBackground("icon_satisfactory",TextureType.ICON);
	    }
	    else
	    {
	    	l_Own.SetNormalTxtColor(FontColor.Red);
	    	l_Enough.setBackground("icon_unsatisfactory",TextureType.ICON);
	    }
	}
}