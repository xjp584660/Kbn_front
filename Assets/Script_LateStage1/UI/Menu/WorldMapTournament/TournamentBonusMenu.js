class TournamentBonusMenu extends KBNMenu
{

	@SerializeField private var m_title : Label;
	@SerializeField private var m_splitter : Label;
	@SerializeField private var m_buildingName : Label;
	@SerializeField private var m_flag : Label;
	@SerializeField private var m_coordinate: Label;
	@SerializeField private var m_bonusBrief : Label;
	@SerializeField private var m_bonusBriefBG : Label;
	@SerializeField private var m_rewardTitle : Label;
	@SerializeField private var m_bonusScrollList : ScrollList;
	@SerializeField private var m_viewBattleFieldButton : Button;

	@SerializeField private var m_dlgFrame : SimpleLabel;
	@SerializeField private var m_dlgInterior : SimpleLabel;
	@SerializeField private var m_dlgLeftTop : SimpleLabel;
	@SerializeField private var m_dlgRightTop : SimpleLabel;
	@SerializeField private var m_dlgLeftBottom : SimpleLabel;
	@SerializeField private var m_dlgRightBottom : SimpleLabel;
	@SerializeField private var m_frameRect : Rect;

	@SerializeField private var m_bonusListItemTemplate : TournamentBonusListItem;
	

	private static var UI_BG_WOOD_WEN_HEIGHT:float = 20;
	
	public function Init():void
	{
		super.Init();
		
		m_bonusScrollList.Init();
		
		m_dlgFrame.Sys_Constructor();
		m_dlgFrame.mystyle.border = new RectOffset(68, 68, 68, 68);
		if( m_dlgFrame.mystyle.normal.background == null )
		{
			m_dlgFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("popup1_transparent",TextureType.DECORATION);
		}
		if(m_dlgInterior.mystyle.normal.background == null)
		{
			m_dlgInterior.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
		}
		
		m_bonusBriefBG.setBackground( "Brown_Gradients2", TextureType.DECORATION );
		
		
		// Button
		btnClose.mystyle.normal.background = TextureMgr.instance().LoadTexture( "button_popup1_close_normal", TextureType.BUTTON );
		btnClose.mystyle.active.background = TextureMgr.instance().LoadTexture( "button_popup1_close_down", TextureType.BUTTON );
		btnClose.OnClick = onClickCloseButton;
		m_viewBattleFieldButton.mystyle.normal.background = TextureMgr.instance().LoadTexture( "button_60_blue_normalnew", TextureType.BUTTON );
		m_viewBattleFieldButton.mystyle.active.background = TextureMgr.instance().LoadTexture( "button_60_blue_downnew", TextureType.BUTTON );
		m_viewBattleFieldButton.OnClick = onClickViewBattleFieldButton;
		
		// Dialog
		//m_dlgLeftTop.setBackground("win-top",TextureType.DECORATION);
		//m_dlgRightTop.setBackground("win-top",TextureType.DECORATION);
		//m_dlgLeftBottom.setBackground("bossinfo-bg-bottom",TextureType.DECORATION);
		//m_dlgRightBottom.setBackground("bossinfo-bg-bottom",TextureType.DECORATION);
		
		marginT = TextureMgr.instance().LoadTexture("ui_bg_wood_wen", TextureType.DECORATION);
//		marginM = new Material(Shader.Find("Mobile/Decaration/Margin"));
		
		m_splitter.setBackground( "between line", TextureType.DECORATION );
		m_bonusScrollList.Init( m_bonusListItemTemplate );
		
		
		
		// Text
		m_title.txt = Datas.getArString( "PVP.Report_succeed_Title" );
		m_bonusBrief.txt = String.Format( Datas.getArString( "PVP.Report_succeed_Notice" ), 0, 0 );
		m_rewardTitle.txt = Datas.getArString( "Common.Rewards" );
		m_viewBattleFieldButton.txt = Datas.getArString( "PVP.Report_View" );
		
		resetLayout();
	}
	
	
	public function resetLayout()
	{
		repeatTimes = (m_frameRect.height - 15) / UI_BG_WOOD_WEN_HEIGHT;
//		marginM.SetTextureScale("_MainTex", Vector2(1, repeatTimes));
		m_dlgFrame.rect.x = m_frameRect.x;
		m_dlgFrame.rect.y = m_frameRect.y;
		m_dlgFrame.rect.width = m_frameRect.width;
		m_dlgFrame.rect.height = m_frameRect.height - 3;
	}
	
	
	public function DrawItem()
	{
		btnClose.Draw();
		m_title.Draw();
		m_splitter.Draw();
		m_buildingName.Draw();
		m_flag.Draw();
		m_coordinate.Draw();
		m_bonusBriefBG.Draw();
		m_bonusBrief.Draw();
		m_rewardTitle.Draw();
		m_viewBattleFieldButton.Draw();
		
		m_bonusScrollList.Draw();
	}
	
	protected function DrawBackground()
	{
	
		GUI.BeginGroup(m_frameRect);
			m_dlgInterior.rect = Rect(13, 13, m_frameRect.width-26, m_frameRect.height-26);
			m_dlgInterior.Draw();
//			Graphics.DrawTexture(Rect(9, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);		
//			Graphics.DrawTexture(Rect(m_frameRect.width - 9 - 23, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, marginM);
			GUI.DrawTextureWithTexCoords(new Rect(9, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
			GUI.DrawTextureWithTexCoords(new Rect(m_frameRect.width - 9 - 23, 10, 23, UI_BG_WOOD_WEN_HEIGHT * repeatTimes), marginT, new Rect(0, 0, 1, repeatTimes), true);
		GUI.EndGroup();
		
		
		m_dlgFrame.Draw();
		m_dlgLeftTop.Draw();
		m_dlgRightTop.Draw();
		m_dlgLeftBottom.Draw();
		m_dlgRightBottom.Draw();
	}
	
	function Update() 
	{
		super.Update();
		m_bonusScrollList.Update();
		
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush( param );
		
		if( param != null ) {
			var KEY_PARAMS : int = 7;
			var valString : String = param as String;
			var list : Array = valString.Split( "_"[0] );
			var tileKind : int = _Global.INT32( list[5] as String );
			var canOccupyTile : int = _Global.INT32( list[6] as String );
			// Title & Brief
			if( tileKind == 1 )//Boss tile
			{
				m_bonusBrief.visible = canOccupyTile != 0;
				m_bonusBriefBG.visible = canOccupyTile != 0;
			}
			else if( tileKind == 2 )//Recource tile
			{
				m_bonusBrief.visible=false;
				m_bonusBriefBG.visible=false;
			}
			
			// Bonus
			if( list.Count >= KEY_PARAMS ) {
				m_bonusBrief.txt = String.Format( Datas.getArString( "PVP.Report_succeed_Notice" ), list[0], list[1] );
				m_coordinate.txt = "("+list[2]+","+list[3]+")";
				m_buildingName.txt = list[4];
				
				/*
				list.Add( 20001 );
				list.Add( 1 );
				list.Add( 20001 );
				list.Add( 1 );
				list.Add( 20001 );
				list.Add( 1 );
				list.Add( 20001 );
				list.Add( 1 );
				list.Add( 20001 );
				list.Add( 1 );
				*/
				
				if( list.Count > KEY_PARAMS ) { // Bonus
					var array : Array = new Array();
					var nFields : int = list.Count - KEY_PARAMS;
					if( nFields % 2 == 0 ) { // Should be times of 2
						var nProps : int = nFields / 2;
						
						for( var i : int = 0; i < nProps; ++i ) {
							var id : String = list[KEY_PARAMS+i*2] as String;
							if( id != "0" ) {
								var num : String = list[KEY_PARAMS+i*2+1] as String;
								array.Add( id+"_"+num );
							}
						}
						if( array.Count > 0 ) {
							m_bonusScrollList.SetData( array );
							m_bonusScrollList.UpdateData();
							m_bonusScrollList.ResetPos();
							m_bonusScrollList.SetVisible( true );
						}
					}
				} else {
					m_bonusScrollList.SetVisible( false );
				}
			}
		}
		SoundMgr.instance().PlayEffect( "kbn tournament 3.1 occupation", "Audio/Pvp/");
		
		UpdateSeed.instance().update_seed_ajax(false, null);
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		m_bonusScrollList.Clear();
	}
	
	private function onClickViewBattleFieldButton()
	{
		close();
		var obj:Hashtable = { "OpenReport":"true" };
		MenuMgr.getInstance().PushMenu("EmailMenu", obj);
	}
	
	private function onClickCloseButton()
	{
		close();
	}
}