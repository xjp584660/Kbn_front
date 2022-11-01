
public class GeneralReincarnationInfo extends ListItem
{
	@SerializeField
	protected  var levelIcon:Label;
	
	@SerializeField
	protected var m_starHeroIconFrame : Label;
	@SerializeField
	protected var m_star : Label;
	@SerializeField
	protected var m_generalName : Label;
	
	protected function SetData(isStar : boolean)
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		if ( isStar )
		{
			m_starHeroIconFrame.drawTileByGraphics = false;
			m_star.drawTileByGraphics = false;
			m_starHeroIconFrame.SetVisible(true);
			m_starHeroIconFrame.useTile = true;
			m_starHeroIconFrame.tile = iconSpt.GetTile("frame_reincarnation");
			m_star.SetVisible(true);
			m_star.useTile = true;
			m_star.tile = texMgr.IconSpt().GetTile("lv_reincarnation");
			levelIcon.SetVisible(false);
			if ( m_generalName != null )
				m_generalName.normalTxtColor = FontColor.Orange;
		}
		else
		{
			m_starHeroIconFrame.SetVisible(false);
			m_star.SetVisible(false);
			levelIcon.SetVisible(true);
			levelIcon.mystyle.normal.background = texMgr.LoadTexture("Button_UserInfo_lv", TextureType.DECORATION);
			if ( m_generalName != null )
				m_generalName.normalTxtColor = FontColor.Description_Light;
		}
	}
	
	protected function prot_drawItems()
	{
		m_starHeroIconFrame.Draw();
		m_star.Draw();
		levelIcon.Draw();
		if ( m_generalName != null )
			m_generalName.Draw();
	}
}