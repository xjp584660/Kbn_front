#pragma strict


public class HospitalWoundedItem
	extends ListItem
{
	@SerializeField
	private var m_backGround : Label;
	public function Init()
	{
		var texMgr : TextureMgr = TextureMgr.instance();
		m_backGround.mystyle.normal.background = texMgr.LoadTexture("square_blackorg", TextureType.DECORATION);
		m_backGround.rect.width = this.rect.width;
		m_backGround.rect.height = this.rect.height;
	}

	public function SetRowData(dat : System.Object)
	{
		var inf : HospitalMenu.WoundedInfo = dat as HospitalMenu.WoundedInfo;
		icon.useTile = true;
		icon.tile = inf.TroopIconTile;
		title.txt = inf.TroopName;
		description.txt = inf.troopCount.ToString();
	}

	public function Draw()
	{
		if ( visible )
		{
			GUI.BeginGroup(rect);
			m_backGround.Draw();
			GUI.EndGroup();
		}
		super.Draw();
	}
}
