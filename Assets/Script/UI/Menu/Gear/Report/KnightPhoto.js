

public class KnightPhoto extends UIObject
{
	@SerializeField
	protected  var levelIcon:Label;
	@SerializeField
	protected var m_starHeroIconFrame : Label;
	@SerializeField
	protected var m_star : Label;
	@SerializeField
	protected var m_generalName : Label;

	private var knight:Knight;
	
	public var photo:Label;
	
	public var attack:Label;
	public var life:Label;
	public var troop:Label;
	
	public var levelText:Label;
	public var attackText:Label;
	public var lifeText:Label;
	public var troopText:Label;
	
	public var title:Label;
	public var line1:Label;
	public var line2:Label;
	public var line3:Label;
	public var line4:Label;
	
	public function get TheKnight():Knight
	{
		return knight;
	}
	
	public function set TheKnight(value:Knight)
	{
		this.knight = value;
		OnKnightChanged(knight);
	} 
	
	public function set Title(value:String)
	{
		title.txt = value;
	}
	public function get Photo():Label
	{
		return photo;
	}
	private function OnKnightChanged(knight:Knight)
	{
		if(knight == null) return;
		
		
		photo.useTile = true;
		photo.tile = TextureMgr.instance().GeneralSpt().GetTile(General.getGeneralTextureName(knight.Name, knight.CityID));//GameMain.instance().getCityOrderWithCityId(knight.CityID) ));
		//photo.tile.name = General.getGeneralTextureName(knight.Name, GameMain.instance().getCityOrderWithCityId(knight.CityID) );

		levelText.txt = knight.ShowerLevel;//"" + GearManager.Instance().GetKnightLevel(knight);
		attackText.txt = "" + (GearManager.Instance().GetShowKnightAttack(knight));
		lifeText.txt = "" + (GearManager.Instance().GetShowKnightLife(knight));
		troopText.txt = "" + GearManager.Instance().GetKnightTroop(knight);
		
		if(knight.isMyKnight)
		{
			Title = General.singleton.getKnightShowName(knight.Name,knight.CityID);
		}
		else
		{
			Title = General.singleton.getKnightNameByCityOrderAndName(knight.Name,knight.CityID);
		}
		//GameMain.instance().getCityOrderWithCityId(knight.CityID));
		this.SetData(knight.IsHaveStar);
	}

	
	public function Init()
	{
		title.Init();
		line1.Init();
		line2.Init();
		line3.Init();
		line4.Init();
		photo.Init();
		troop.Init();
		
		attack.Init();
		life.Init();
		levelText.Init();
		attackText.Init();
		lifeText.Init();
		troopText.Init();
		
		troop.mystyle.normal.background = ItemPropertyKind.GetTextureByKind(ItemPropertyKind.TroopsLimit);
		attack.mystyle.normal.background = ItemPropertyKind.GetTextureByKind(ItemPropertyKind.Attack);
		life.mystyle.normal.background = ItemPropertyKind.GetTextureByKind(ItemPropertyKind.Life);
		line1.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line_list_small",TextureType.DECORATION);
		line2.mystyle.normal.background = line1.mystyle.normal.background;
		line3.mystyle.normal.background = line1.mystyle.normal.background;
		line4.mystyle.normal.background = line1.mystyle.normal.background;
	}
	
	public function Update()
	{
		photo.Update();
		attack.Update();
		life.Update();
		levelText.Update();
		attackText.Update();
		lifeText.Update();
		title.Update();
		line1.Update();
		line2.Update();
		line3.Update();
		line4.Update();		
		troop.Update();
		troopText.Update();
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		photo.Draw();
		attack.Draw();
		life.Draw();
		levelText.Draw();
		attackText.Draw();
		lifeText.Draw();
		title.Draw();
		line1.Draw();
		line2.Draw();
		line3.Draw();
		line4.Draw();		
		troop.Draw();
		troopText.Draw();
		prot_drawItems();
		GUI.EndGroup();
	}

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

