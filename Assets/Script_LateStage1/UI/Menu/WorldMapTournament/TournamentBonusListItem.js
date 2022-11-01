

class TournamentBonusListItem extends ListItem
{
	@SerializeField private var m_bonusIcon : Label;
	@SerializeField private var m_bonusName : Label;
	@SerializeField private var m_bonusBrief : Label;

	public function OnPopOver()
	{
		super.OnPopOver();
	}
	
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		m_bonusIcon.Draw();
		m_bonusName.Draw();
		m_bonusBrief.Draw();
		GUI.EndGroup();
		return -1;
	}
	
	public function Update()
	{
	}
	
	public function SetRowData(data:Object):void
	{
		if( data != null ) {
			var prop : String = data as String;
			var a : Array = prop.Split( "_"[0] );
			if( a.Count == 2 ) {
				var id : String = a[0] as String;
				var num : String = a[1] as String;
				m_bonusIcon.useTile = true;
				m_bonusIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile( null );
				m_bonusIcon.tile.name = TextureMgr.singleton.LoadTileNameOfItem( _Global.INT32( id ) );
				m_bonusName.txt = Datas.getArString( String.Format("itemName.i{0}", id ) );
				m_bonusBrief.txt = Datas.getArString( String.Format("itemDesc.i{0}", id ) );
			}
		}
	}
}