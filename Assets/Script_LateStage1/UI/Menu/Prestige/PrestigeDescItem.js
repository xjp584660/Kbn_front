
class PrestigeDescItem extends ListItem
{
	public var l_LvBonus:Label;
	public var l_DescTxt:Label;
	public var l_Star1:Label;
	public var l_Star2:Label;
	public var l_Star3:Label;
	
	private var m_data:HashObject;
	
	private static var X_INIT:int = 45;
	private static var STAR_WIDTH:int = 25;
	private static var STAR_OFFSET:int = 14;
	
	public function Init()
	{
		l_Star1.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_Star2.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_Star3.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		l_LvBonus.Draw();
		l_DescTxt.Draw();
		l_Star3.Draw();
		l_Star2.Draw();
		l_Star1.Draw();
		GUI.EndGroup();
	}
	
	public function SetRowData(data:Object)
	{
		m_data = data as HashObject;
		
		l_LvBonus.txt = m_data["lvBonus"].Value;
		l_DescTxt.txt = m_data["lvDesc"].Value;
		var prestige:int = _Global.INT32(m_data["prestige"]);
		l_Star1.SetVisible(prestige>=1);
		l_Star2.SetVisible(prestige>=2);
		l_Star3.SetVisible(prestige>=3);
		
		l_Star1.rect.x = X_INIT;
		l_Star2.rect.x = l_Star1.rect.x + STAR_OFFSET;
		l_Star3.rect.x = l_Star2.rect.x + STAR_OFFSET;
		l_LvBonus.rect.x = X_INIT + STAR_WIDTH + (prestige-1)*STAR_OFFSET + 5;
		l_DescTxt.rect.x = l_LvBonus.rect.x;
		
		
	}
}