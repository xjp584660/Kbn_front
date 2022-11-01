public class RallyTroopsItem extends ListItem
{
	public var l_img 	:Label;
	public var l_content :Label;
	public var l_title :Label;
	public var l_bg :Label;
	
	public function Draw()
	{
		if (!visible)
			return;

		GUI.BeginGroup(rect);
		
		l_bg.Draw();
		l_title.Draw();		
		l_img.Draw();	
		l_content.Draw();
		
		GUI.EndGroup();
	}

	public function SetRowData(data:Object)
	{
		var info:Barracks.TroopInfo = data as Barracks.TroopInfo;	
		if(info)
		{	
			l_content.txt =  "" + info.selectNum;
			l_title.SetFont(FontSize.Font_20,FontType.TREBUC);
			l_title.txt = info.troopName;
			l_img.useTile = true;
			l_img.tile = TextureMgr.instance().UnitSpt().GetTile(info.troopTexturePath);
			//l_img.tile.name = info.troopTexturePath;
		//	l_img.mystyle.normal.background = TextureMgr.instance().LoadTexture(info.troopTexturePath, TextureType.ICON_UNIT);//Resources.Load(info.troopTexturePath);
			return;
		}
		
		// if (HeroManager.Instance().GetHeroEnable())
		// {
		// 	var heroIdStr : String = data as String;
		// 	if (!String.IsNullOrEmpty(heroIdStr))
		// 	{
		// 		var heroId : long = long.Parse(heroIdStr);
		// 		var heroInfo : KBN.HeroInfo = HeroManager.Instance().GetHeroInfo(heroId);
		// 		l_img.useTile = true;
		// 		l_img.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		// 		l_img.tile.name = heroInfo.HeadSmall;
		// 		l_title.SetFont(FontSize.Font_20, FontType.TREBUC);
		// 		l_title.txt = heroInfo.Name;
		// 		l_content.txt = String.Format(Datas.getArString("HeroHouse.Detail_Might"), heroInfo.Might.ToString());
		// 		return;
		// 	}
		// }
	}

}