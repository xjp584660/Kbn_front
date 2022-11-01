class TileInfoPopUpAVAImp {

	public function canShowScoreProgressBar() {
		return m_canShowScoreProgressBar;
	}

	public function setPopUp( popup : TileInfoPopUp ) {
		m_popup = popup;
	}
	public function getOccupationTime() : int {
		return GameMain.unixtime() - m_occupationTime;
	}
	
	public function getTotalScore() : float {
		if( m_occupationTime == 0 )
			return 1f;
		if( m_T == 0f )
			return 1f;
		var t : float = m_matchEndTime - m_occupationTime;
		var score : float = m_avaPower * m_m * m_c * ( m_para3 * t / m_T * t * t + m_para2 * t / m_T * t + m_para1 * t / m_T );
		score = score * Mathf.Pow(m_avaPow / m_alliancePower, m_avaPP);
		if( m_isWonder ) {
			score *= m_n;
		} else {
			score *= m_s;
		}
		return Mathf.Max( 1f, score );
	}
	
	public function getScore() : float {
		if( m_occupationTime == 0 )
			return 0f;
		if( m_T == 0f )
			return 0f;
		var t : float = GameMain.unixtime() - m_occupationTime;
		if( t <= 0f )
			return 0f;
			
		var score : float = m_avaPower * m_m * m_c * ( m_para3 * t / m_T * t * t + m_para2 * t / m_T * t + m_para1 * t / m_T );
		score = score * Mathf.Pow(m_avaPow / m_alliancePower, m_avaPP);
		if( m_isWonder ) {
			score *= m_n;
		} else {
			score *= m_s;
		}
		return score;
	}
	
	public function getScoreProgress() : float {
		return getScore() / getTotalScore();
	}
	private var m_lastForceRepaintTime : long = 0;
	public function setup( info : PBMsgAVATileInfo.PBMsgAVATileInfo ) {
		
		m_tileId = info.tileId;
		m_canShowScoreProgressBar = false;
		// Loading indicator
		m_popup.loadingIndicator.SetVisible( false );
		
		// Share button
		m_popup.shareBtn.SetVisible( info.shared == 0 );
		m_popup.shareBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture( "tilepopup_envelope_closed",
													TextureType.MAP17D3A_UI);
		m_popup.shareBtn.mystyle.active.background = TextureMgr.instance().LoadTexture( "tilepopup_envelope_closed",
													TextureType.MAP17D3A_UI);
					
		m_popup.moveCityIcon.OnClick = onMoveCityBtnClick;					
		m_popup.shareBtn.OnClick = onShareBtnClick;
		// Share button 2
		m_popup.shareBtn2.OnClick = onShareBtnClick2;
		m_popup.shareBtn2.SetVisible( info.shared != 0 );
		m_popup.shareBtn2.mystyle.normal.background = TextureMgr.instance().LoadTexture( "tilepopup_envelope_opened",
													TextureType.MAP17D3A_UI);
		m_popup.shareBtn2.mystyle.active.background = TextureMgr.instance().LoadTexture( "tilepopup_envelope_opened",
													TextureType.MAP17D3A_UI);
		// Share icon
		m_popup.sharedIcon.SetVisible( false );
		
		
		
		if( info.tileType != Constant.TileType.TILE_TYPE_AVA_BOG &&
			info.tileType != Constant.TileType.TILE_TYPE_AVA_BOG2 &&
			info.tileType != Constant.TileType.TILE_TYPE_AVA_BOG3 &&
			info.tileType != Constant.TileType.TILE_TYPE_AVA_BOG4 &&
		   info.tileType != Constant.TileType.TILE_TYPE_AVA_BOG5 ) {
	
			// Tile name
			var tileName = Datas.getArString( AvaUtility.GetTileNameKey( info.tileType ) );
			m_popup.title.txt = tileName;
			m_popup.title.SetVisible( true );
			
			// Tile description
			var desc = Datas.getArString( AvaUtility.GetTileDescKey( info.tileType ) );
			m_popup.detailInfo.desc = desc;
			
			m_popup.label1.SetVisible( true );
			m_popup.label2.SetVisible( true );
			m_popup.label3.SetVisible( true );
			m_popup.label4.SetVisible( true );
			m_popup.label5.SetVisible( true );
			m_popup.label1Btn.SetVisible( false );
			if( info.userId == 0 ) {
				m_popup.label1.txt = Datas.getArString("Common.Unoccupied");
			} else {
				m_popup.label1.txt = info.userName;
			}
			m_popup.label2.txt = Datas.getArString("Common.Might") + ": " + info.might;
			m_popup.label3.txt = Datas.getArString("Common.Alliance") + ": " + ( ( info.allianceId == 0 ) ? Datas.getArString("Common.None") : info.allianceName );
			m_popup.label4.txt = ( info.allianceId == 0 ) ? ( Datas.getArString("AllianceInfo.AllianceDiplomacy") + ": "  + Datas.getArString("Alliance.relationNeutral") ) : "";
			m_popup.label5.txt = "";
			
			// Score progress

			/* // Test data
			info.occupationTime = GameMain.unixtime();
			info.matchEndTime = GameMain.unixtime() + 120;
			info.scorePerSecond = 1000;
			*/
			if( info.userId != 0 ) {
				var seed:HashObject = GameMain.instance().getSeed();
				var myUserID = _Global.INT32(seed["player"]["userId"].Value);
				var myServerID = _Global.INT32(seed["player"]["worldId"].Value);
				
				if( myUserID == info.userId && ( info.serverId == 0 || myServerID == info.serverId ) ) {
					m_occupationTime = info.occupationTime;
					if( info.occupationTime != 0 ) {
						m_canShowScoreProgressBar = true;
						m_popup.showAVAProgressBar();
						m_matchEndTime = info.matchEndTime;
						m_scorePerSecond = info.scorePerSecond;
						m_avaPower = ( info.avaPower == "" ) ? 0 : Convert.ToDouble( info.avaPower );
						m_alliancePower = ( info.alliancePower == "" ) ? 0 : Convert.ToDouble( info.alliancePower );
						m_avaPow = ( info.avaPow == "" ) ? 0 : Convert.ToDouble( info.avaPow );
						m_avaPP = ( info.avaPP == "" ) ? 0 : Convert.ToDouble( info.avaPP );
						m_m = ( info.m == "" ) ? 0 : Convert.ToDouble( info.m );
						m_c = ( info.c == "" ) ? 0 : Convert.ToDouble( info.c );
						m_s = ( info.s == "" ) ? 0 : Convert.ToDouble( info.s );
						m_n = ( info.n == "" ) ? 0 : Convert.ToDouble( info.n );
						m_T = ( info.T == "" ) ? 1 : Convert.ToDouble( info.T );
						m_para1 = ( info.para1 == "" ) ? 0 : Convert.ToDouble( info.para1 );
						m_para2 = ( info.para2 == "" ) ? 0 : Convert.ToDouble( info.para2 );
						m_para3 = ( info.para3 == "" ) ? 0 : Convert.ToDouble( info.para3 );
						m_isWonder = info.tileType == Constant.TileType.TILE_TYPE_AVA_WONDER;
					}
				}
			}
			
			// Buttons
			m_popup.avaBtn1.SetVisible( false );
			m_popup.avaBtn2.SetVisible( false );
			m_popup.avaBtn3.SetVisible( false );
			m_popup.bottomBtn1.SetVisible( false );
			m_popup.bottomBtn2.SetVisible( false );
			handleButtons( info.allianceId, info.userId, info.serverId );
			
			// Protection cover double-check
			if( info.userId != 0 ) {
				var now : long = GameMain.unixtime();
				if( GameMain.unixtime() < info.protectTime ) {
					var mc : MapController = GameMain.instance().getMapController2();
					if( mc != null ) {
						mc.updateTileProtectionCover( info.tileId, info.tileType, info.userId, info.protectTime );
						KBN.GameMain.singleton.forceRepaintWorldMap2();
						m_lastForceRepaintTime = now;
					}
				}
				if( now - m_lastForceRepaintTime >= 10 ) {
					m_lastForceRepaintTime = now;
					KBN.GameMain.singleton.forceRepaintWorldMap2();
				}
			}
			
			
		}
	}
	
	private function onMoveCityBtnClick()
	{
    	var confirmStr:String = Datas.getArString("Teleport.TeleportConfirm");
		confirmStr = confirmStr + "\n" + "(" + m_popup.detailInfo.x + "," +  m_popup.detailInfo.y+")";	
		var cd:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		cd.setLayout(600,380);
		cd.setTitleY(120);
		cd.setButtonText(Datas.getArString("Common.OK_Button"),Datas.getArString("Common.Cancel"));
		MenuMgr.getInstance().PushConfirmDialog(confirmStr, "", MoveCity, null);
	}
	
    private function MoveCity():void
    {
    	m_popup.dismiss();
    	var x:int=_Global.INT32(m_popup.detailInfo.x);
    	var y:int=_Global.INT32(m_popup.detailInfo.y);

		MenuMgr.getInstance().PopMenu("");
    	GameMain.Ava.Inventory.UseItem(6800, x, y);
    }
	
	private function onShareBtnClick() {
		GameMain.instance().getMapController2().avaImp.reqShareTile( m_tileId );
	}
	
	private function onShareBtnClick2() {
		MenuMgr.instance.PushMessage( Datas.getArString("AVA.chrome_TileHasBeenShared") );
	}
	
	public function handleIfPossible( tile : HashObject ) : boolean {
		var tileType : int = _Global.INT32( tile["tileType"] );
		if( tileType < Constant.TileType.TILE_TYPE_AVA_PLAYER || tileType > Constant.TileType.TILE_TYPE_AVA_LAST ) {
			return false;
		}
		
		// Cooridates
		m_destCoordX = _Global.INT32( tile["xCoord"] );
		m_destCoordY = _Global.INT32( tile["yCoord"] );
		m_tileType = tileType;
		m_protectTime = _Global.INT64(tile["protectTime"]);
		
		// Handle the dialog here
		m_popup.hideAll();
		return true;
	}
	
	private function onReinforce() {
		m_popup.dismiss();
		//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":m_destCoordX, "y":m_destCoordY, "type":Constant.AvaMarchType.REINFORCE,"ava":1},"trans_zoomComp");
		MarchDataManager.instance().SetData({"x":m_destCoordX, "y":m_destCoordY, "type":Constant.AvaMarchType.REINFORCE,"ava":1});
	}
	
	
	private function onViewTroop() {
		m_popup.dismiss();
		MenuMgr.getInstance().PushMenu("AvaTileTroopMenu", m_tileId, "trans_zoomComp");
	}
	
	private function superWonderProtect() : boolean
	{
		var curTime : long = GameMain.unixtime ();
		if((GameMain.Ava.Event.IsShowSuperWonderProtect() && (m_tileType >= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER1 &&
		m_tileType <= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER4)) || curTime <= m_protectTime)
		{
			ErrorMgr.instance().PushError(String.Empty, Datas.getArString("AVA.SuperWonderProtectTime"));
			return true;
		}
		
		return false;
	}
	
	private function onScout() {
		if(superWonderProtect())
		{
			return;
		}
		
		m_popup.dismiss();
        
        var eagleEyeLevel : int = GameMain.Ava.Seed.EagleEyeLevel;
        if (eagleEyeLevel <= 0)
        {
            ErrorMgr.instance().PushError(String.Empty, Datas.getArString("AVA.ResearchNeededDesc"));
            return;
        }
        
        if (!CanScout())
        {
            ErrorMgr.instance().PushError(String.Empty, Datas.getArString("AVA.CannotScoutThisTile"));
            return;
        }
        
        MenuMgr.getInstance().PushMenu("ScoutMenu",
        {
            "x": m_destCoordX,
            "y": m_destCoordY,
            "ava": 1
        }, "trans_zoomComp");
	}
	
    private function CanScout() : boolean
    {
        if (m_popup.tileUserInfo != null)
        {
            var w:int = _Global.INT32(m_popup.tileUserInfo["w"]);
            return w != 2 && w != 3; // Not under protection
        }
        
        return true;
    }
    
    private function setConfirmDialogMenu() : String
	{
		var menu : KBNMenu = MenuMgr.getInstance().getMenu("ConfirmDialog");
		var cd:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		cd.setLayout(600,380);
		cd.setTitleY(120);
		cd.setButtonText(Datas.getArString("Common.OK_Button"),Datas.getArString("Common.Cancel"));		
	}
    
	private function onAttack() {
		if(superWonderProtect())
		{
			return;
		}
		
		if(GameMain.Ava.TileShare.OwnTotalDataCount >= GameMain.Ava.Seed.OccupyTileLimit)
		{
			setConfirmDialogMenu();
			MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("GrailWar.ReachTileLimit"), "", confirmDialog, null);
			return;
		}
		
		attack();
	}
	
	private function confirmDialog()
	{
		MenuMgr.getInstance().PopMenu("");
		attack();
	}
	
	private function attack()
	{
		m_popup.dismiss();
		//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":m_destCoordX, "y":m_destCoordY, "type":Constant.AvaMarchType.ATTACK,"ava":1},"trans_zoomComp");
		MarchDataManager.instance().SetData({"x":m_destCoordX, "y":m_destCoordY, "type":Constant.AvaMarchType.ATTACK,"ava":1});
	}
	
	private function onRallyAttack() {
		if(superWonderProtect())
		{
			return;
		}
		
		if(GameMain.Ava.TileShare.OwnTotalDataCount >= GameMain.Ava.Seed.OccupyTileLimit)
		{
			setConfirmDialogMenu();
			MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("GrailWar.ReachTileLimit"), "", confirmDialogRallyAttack, null);
			return;
		}
		
		rallyAttack();
	}
	
	private function confirmDialogRallyAttack()
	{
		MenuMgr.getInstance().PopMenu("");
		rallyAttack();
	}
	
	private function rallyAttack()
	{
		m_popup.dismiss();
		MenuMgr.getInstance().PushMenu( "AvaRallyAttackTimeSettings", {"x":m_destCoordX, "y":m_destCoordY, "tileType":m_tileType,
										"type":Constant.AvaMarchType.RALLYATTACK,"ava":1}, "trans_zoomComp" );
	}
	
	private function onViewOutpost() {
		m_popup.dismiss();
		MenuMgr.instance.PushMenu("OutpostMenu", null);
	}
	
	private function handleButtons( allianceID : int, userID : int, serverID : int ) {
		var seed:HashObject = GameMain.instance().getSeed();
		var myAllianceID = _Global.INT32(seed["player"]["allianceId"].Value);
		var myUserID = _Global.INT32(seed["player"]["userId"].Value);
		var myServerID = _Global.INT32(seed["player"]["worldId"].Value);
		
	    m_popup.l_topRight.SetVisible(false);
		m_popup.topRightBtn.SetVisible(false);
		m_popup.moveCityIcon.SetVisible(m_tileType == Constant.TileType.TILE_TYPE_AVA_PLAIN);
			
		if( m_tileType == Constant.TileType.TILE_TYPE_AVA_BOG ||
			m_tileType == Constant.TileType.TILE_TYPE_AVA_BOG2 ||
			m_tileType == Constant.TileType.TILE_TYPE_AVA_BOG3 ||
			m_tileType == Constant.TileType.TILE_TYPE_AVA_BOG4 ||
			m_tileType == Constant.TileType.TILE_TYPE_AVA_BOG5 ) {
			
			m_popup.bog();
		} else if( m_tileType == Constant.TileType.TILE_TYPE_AVA_MERCENERY ) {
			m_popup.bottomBtn1.SetVisible( true );
			m_popup.bottomBtn2.SetVisible( true );
			m_popup.bottomBtn1.txt = Datas.getArString("Common.Attack");
			m_popup.bottomBtn2.txt = Datas.getArString("Common.Scout");
			m_popup.bottomBtn1.OnClick = onAttack;
			m_popup.bottomBtn2.OnClick = onScout;
		} else if( allianceID == myAllianceID && ( serverID == 0 || myServerID == serverID ) ) {
			
			if( userID == myUserID ) { // Myself
				m_popup.bottomBtn1.SetVisible( true );
				m_popup.bottomBtn2.SetVisible( true );
				if( m_tileType == Constant.TileType.TILE_TYPE_AVA_PLAYER ) {
					m_popup.bottomBtn1.txt = Datas.getArString("AVA.battle_outpostbtn");
					m_popup.bottomBtn1.OnClick = onViewOutpost;
				} else {
					m_popup.bottomBtn1.txt = Datas.getArString("Common.Reinforce");
					m_popup.bottomBtn1.OnClick = onReinforce;
				}
				m_popup.bottomBtn2.txt = Datas.getArString("Common.ViewTroops");
				m_popup.bottomBtn2.OnClick = onViewTroop;
			} else { // Friend in the same alliance
				m_popup.bottomBtn1.SetVisible( true );
				m_popup.bottomBtn2.SetVisible( true );
				m_popup.bottomBtn1.txt = Datas.getArString("Common.Reinforce");
				m_popup.bottomBtn2.txt = Datas.getArString("Common.ViewReinforcements");
				m_popup.bottomBtn1.OnClick = onReinforce;
				m_popup.bottomBtn2.OnClick = onViewTroop;
			}
		
		} else { // Enemy
			m_popup.avaBtn1.SetVisible( true );
			m_popup.avaBtn2.SetVisible( true );
			m_popup.avaBtn3.SetVisible( true );
			m_popup.avaBtn1.txt = Datas.getArString("Common.Attack");
			m_popup.avaBtn2.txt = Datas.getArString("Common.Scout");
			m_popup.avaBtn3.txt = Datas.getArString("AVA.chrome_rallyattackbtn");
			m_popup.avaBtn1.OnClick = onAttack;
			m_popup.avaBtn2.OnClick = onScout;
			m_popup.avaBtn3.OnClick = onRallyAttack;
		}
	}
	
	private var m_popup : TileInfoPopUp;
	private var m_destCoordX : int;
	private var m_destCoordY : int;
	private var m_tileType : int;
	private var m_tileId : int;
	private var m_occupationTime : long;
	private var m_protectTime : long;
	private var m_matchEndTime : long;
	private var m_scorePerSecond : long;
	private var m_canShowScoreProgressBar : boolean;
	
	private var m_avaPower : float;
	private var m_alliancePower : float;
	private var m_avaPow : float;
	private var m_avaPP : float;
	private var m_m : float;
	private var m_c : float;
	private var m_n : float;
	private var m_s : float;
	private var m_T : float;
	private var m_para1 : float;
	private var m_para2 : float;
	private var m_para3 : float;
	private var m_isWonder : boolean;
}