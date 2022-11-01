public class HeroSkillLevelUpReqItem extends ListItem
{
	public var l_Enough:Label;
	public var l_line:Label;
	public var l_Own:Label;
	private var reqItem :KBN.HeroSkillLevelUpReqItem = null;
	
	
	public function Init()
	{
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
		reqItem = data as KBN.HeroSkillLevelUpReqItem;
		if (reqItem == null)
	    {
	    	return;
	    }

	
    	//Item Id and Num
	    description.txt = reqItem.Desc;
	    title.txt = reqItem.Title;
	    icon.tile = TextureMgr.instance().ItemSpt().GetTile(reqItem.IconName);
	    if(reqItem.Type == 1)
	    {
	    	//item
			l_Own.txt = Datas.getArString("Common.Own") + ": " + reqItem.CurNum + "/" + reqItem.ReqNum;
			l_Own.SetVisible(true);
	    }
	    else
	    {
	    	//hero
	    	l_Own.SetVisible(false);
	    }

	    if(reqItem.bEnough)
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