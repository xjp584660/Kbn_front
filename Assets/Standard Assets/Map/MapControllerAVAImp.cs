using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class MapControllerAVAImp {

	//-----------------------------------------------------------------------------------
	// Public interfaces
	//-----------------------------------------------------------------------------------

	public MapControllerAVAImp( MapController mapCtrl ) {
		m_mapCtrl = mapCtrl;
	}

	public PBMsgAVATileMarchLineList.PBMsgAVATileMarchLineList FollowedMarchLines {
		get { return m_followedMarchLines; }
	}

	public void try2DownloadMapCache() {
		int actID = GameMain.Ava.Event.GetActId();
		int worldID = KBN.Datas.singleton.worldid();
		string key = ""+actID+"_"+worldID;
		string value = PlayerPrefs.GetString( key, "0" );
		if( value == "0" ) {
			reqMapCacheData();
		}
	}

    private void OnNetworkSignup()
    {
        GameMain.Ava.March.RequestMarchList();
        GameMain.Ava.March.RequestIncommingAttackList();
    }

    public void Free()
    {
        NewSocketNet.instance.OnNewNetworkNodeSignUp -= OnNetworkSignup;
    }

	public void toFront() {
		m_lastFollowedTileID = -1;
		m_nextUpdateTime = 0;
		NewSocketNet.instance.OnNewNetworkNodeSignUp += OnNetworkSignup;
	}

	public void toBack() {
		NewSocketNet.instance.OnNewNetworkNodeSignUp -= OnNetworkSignup;
		if( m_lastFollowedTileID != -1 ) {
			sendTileMarchLineSocketData( m_lastFollowedTileID, 2 );
			cleanUpTileMarchLines( m_lastFollowedTileID );
		}
	}

	public void onFollowedTileChange() {
		if( m_lastFollowedTileID != -1 ) {
			m_nextUpdateTime = GameMain.unixtime() + 3; // Request the data after some seconds
		}
	}

	public void update() {
		if( m_nextUpdateTime != 0 ) {
			if( GameMain.unixtime() >= m_nextUpdateTime ) {
				requestTileMarchLines( m_lastFollowedTileID );
				m_nextUpdateTime = 0;
			}
		}
	}
	private bool m_tileMarchLineReqReturned = true;
	public void showAVATileMarchLines( int tileID ) {

		requestTileMarchLines( tileID );
		return;

		if( m_lastFollowedTileID == -1 ) {
			m_lastFollowedTileID = tileID;
			sendTileMarchLineSocketData( tileID, 1 );
			requestTileMarchLines( tileID );
			m_tileMarchLineReqReturned = false;
		} else {
			if( m_lastFollowedTileID == tileID ) {

#if CLEAN_UP_MARCH_LINES_ON_TOGGLE
				sendTileMarchLineSocketData( tileID, 2 );
				cleanUpTileMarchLines( tileID );
				m_lastFollowedTileID = -1;
#endif
				if( m_tileMarchLineReqReturned ) {
					requestTileMarchLines( tileID );
					m_tileMarchLineReqReturned = false;
				}
			} else {
				// Clean up the old ones
				sendTileMarchLineSocketData( m_lastFollowedTileID, 2 );
				cleanUpTileMarchLines( m_lastFollowedTileID );
				// Create new ones
				sendTileMarchLineSocketData( tileID, 1 );
				requestTileMarchLines( tileID );
				m_tileMarchLineReqReturned = false;
				m_lastFollowedTileID = tileID;
			}
		}
		m_mapCtrl.showTournamentInfo();
	}
	
	public bool convertToKeyTile2x2( int tileType, ref int col, ref int row ) {
		bool changed = false;
		switch (tileType) {
		case Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER2:
			col--;
			changed = true;
			break;
		case Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER3:
			row--;
			changed = true;
			break;
		case Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER4:
			col--;
			row--;
			changed = true;
			break;
		}
		return changed;
	}

	public bool checkProtected( long protectTime ) {
		long now = GameMain.unixtime();
		return ( now < protectTime );
	}

	public void setupTileEffect( GameObject tile, int tileType ) {
		return;
		if( tileType == Constant.TileType.TILE_TYPE_AVA_LIFE ) {


			if( tile.transform.Find( "PSELife" ) == null ) {
				GameObject a = Resources.Load<GameObject>("WorldMap17d3a/Prefab/AVATileEffectLife");
				a = GameObject.Instantiate( a ) as GameObject;
				a.name = "PSELife";
				a.transform.parent = tile.transform.parent;
				a.transform.position = tile.transform.position;
				a.transform.rotation = Quaternion.identity;

//				a.transform.localPosition = Vector3.zero;
//				a.transform.localRotation = Quaternion.Euler( 0f, -180f, 0f );
				//					a.transform.Find( "Particle" ).localRotation = Quaternion.Euler( -90f, 0f, 0f );
				
			}
		} else {
			Transform a = tile.transform.Find( "PSELife" );
			if( a != null ) {
				GameObject.Destroy( a.gameObject );
			}
		}
	}

	public void reqMapData( List<string> blockNames ) {

		if( USE_TEST_DATA ) { // We'd like to generate some test data ourselves.
			GhostMap.getInstance().switchDataSet( false );
			if( !TEST_DATA_INITIALIZED ) {
				m_blockData = new HashObject();
				for( int x = 1; x <= Constant.Map.AVA_MINIMAP_WIDTH; ++x ) {
					for( int y = 1; y <= Constant.Map.AVA_MINIMAP_HEIGHT; ++y ) {
						PBMsgAVAMap.PBMsgAVAMap.Tile t = new PBMsgAVAMap.PBMsgAVAMap.Tile();
						int motif = TEST_TILE_MOTIFS[(int)UnityEngine.Random.Range(0.0f, (float)(TEST_TILE_MOTIFS.Length-1))];
						genTestTileData( t, x, y, motif, 8, 0 );
						constructBlockData( t );
					}
				}

				updateMemCache();
				TEST_DATA_INITIALIZED = true;
			}
			m_mapCtrl.reqWorldMapOk();
			return;
		}

		// This is the real world, request data from the server...
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA();
		request.map = new PBMsgReqAVA.PBMsgReqAVA.Map();
		request.cmd = 2;
		request.subcmd = 1;
		foreach( string s in blockNames ) {
			string[] f = s.Split( '_' );
			int x = _Global.INT32( f[1] );
			int y = _Global.INT32( f[3] );
			int block = x / Constant.Map.BLOCK_TILE_CNT + 1 + ( y / Constant.Map.BLOCK_TILE_CNT ) * 16;
			request.map.blocks.Add( block );
		}
		MenuMgr.instance.setAvaWaitingLabelVisiable (true);
		UnityNet.RequestForGPB( "ava.php", request, onReqMapDataSucceeded, onReqMapDataFailed,true );
	}

	public void reqTileInfo( int tileId ) {
		PBMsgReqAVA.PBMsgReqAVA a = new PBMsgReqAVA.PBMsgReqAVA();
		PBMsgReqAVA.PBMsgReqAVA.TileInfo aa = new PBMsgReqAVA.PBMsgReqAVA.TileInfo();
		aa.tileId = tileId;
		a.cmd = 2;
		a.subcmd = 2;
		a.tileInfo = aa;
		MenuMgr.instance.setAvaWaitingLabelVisiable (true);
		UnityNet.RequestForGPB( "ava.php", a, onReqTileInfoSucceeded, onReqTileInfoFailed,true );
	}

	public void reqShareTile( int tileId ) {
		PBMsgReqAVA.PBMsgReqAVA.Share aa = new PBMsgReqAVA.PBMsgReqAVA.Share();
		aa.tileId = tileId;
		PBMsgReqAVA.PBMsgReqAVA a = new PBMsgReqAVA.PBMsgReqAVA();
		a.cmd = 7;
		a.subcmd = 1;
		a.share = aa;
		MenuMgr.instance.setAvaWaitingLabelVisiable (true);
		UnityNet.RequestForGPB( "ava.php", a, onReqShareTileSucceeded, onReqShareTileFailed,true );
	}


	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	
	
	
	
	//-----------------------------------------------------------------------------------
	// Underlying implementations
	//-----------------------------------------------------------------------------------
	private void limitFollowedMarchLines() {
		if( m_followedMarchLines != null ) {

			const int MAX_FOLLOWED_MARCHLINES = 30;

			if( m_followedMarchLines.marchLineList.Count <= MAX_FOLLOWED_MARCHLINES ) {
				return;
			}

			// Bubble sort
			for( int i = 0; i < m_followedMarchLines.marchLineList.Count - 1; ++i ) {
				for( int j = i + 1; j < m_followedMarchLines.marchLineList.Count; ++j ) {
					PBMsgAVATileMarchLineList.PBMsgAVATileMarchLineList.MarchLineInfo m1 = m_followedMarchLines.marchLineList[i];
					PBMsgAVATileMarchLineList.PBMsgAVATileMarchLineList.MarchLineInfo m2 = m_followedMarchLines.marchLineList[j];
					if( m1.endTime > m2.endTime ) {
						m_followedMarchLines.marchLineList[i] = m2;
						m_followedMarchLines.marchLineList[j] = m1;
					}
				}
			}

			// Remove last Count - max_followed_marchlines elements
			int count = m_followedMarchLines.marchLineList.Count;
			int number = count - MAX_FOLLOWED_MARCHLINES;
			for( int i = 0; i < number; ++i ) {
				m_followedMarchLines.marchLineList.RemoveAt( count - i - 1 );
			}
		}
	}

	private void reqMapCacheData() {
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA();
		request.map = new PBMsgReqAVA.PBMsgReqAVA.Map();
		request.cmd = 2;
		request.subcmd = 4;
		MenuMgr.instance.setAvaWaitingLabelVisiable (true);
		UnityNet.RequestForGPB( "ava.php", request, onReqMapCacheDataSucceeded, onReqMapCacheDataFailed,true );
	}

	private void requestTileMarchLines( int tileID ) {
		// PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA();
		// request.marchLine = new PBMsgReqAVA.PBMsgReqAVA.MarchLine();
		// request.cmd = 3;
		// request.subcmd = 6;
		// request.marchLine.tileId = tileID;
		// MenuMgr.instance.setAvaWaitingLabelVisiable (true);
		// UnityNet.RequestForGPB( "ava.php", request, onShowTileMarchLineSucceeded, onShowTileMarchLineFailed,true );

		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA();
		request.marchLine = new PBMsgReqAVA.PBMsgReqAVA.MarchLine();
		request.cmd = 3;
		request.subcmd = 7;
		// request.marchLine.tileId = tileID;
		MenuMgr.instance.setAvaWaitingLabelVisiable (true);
		UnityNet.RequestForGPB( "ava.php", request, newListcallback, onShowTileMarchLineFailed,true );
	}
	private void newListcallback(byte[] data){
		MenuMgr.instance.setAvaWaitingLabelVisiable (false);
		if (data == null)
		{
			// MenuMgr.instance.SendNotification(Constant.Notice.AvaGetMarchListOK, null);
			return;
		}
		PBMsgAVAMarchLineList.PBMsgAVAMarchLineList allMarch = _Global.DeserializePBMsgFromBytes<PBMsgAVAMarchLineList.PBMsgAVAMarchLineList>(data);
		for(int i=0;i<allMarch.marchLineList.Count;i++)
		{
			PBMsgAVAMarchLineList.PBMsgAVAMarchLineList.MarchLineInfo marchInfo=allMarch.marchLineList[i];
			PBMsgMarchInfo.PBMsgMarchInfo march=new PBMsgMarchInfo.PBMsgMarchInfo();

			march.marchId=marchInfo.marchId;
			march.fromX=marchInfo.fromX;
			march.fromY=marchInfo.fromY;
			march.toX=marchInfo.toX;
			march.toY=marchInfo.toY;
			march.marchType=marchInfo.marchType;
			march.marchStatus=marchInfo.marchStatus;
			march.startTimeStamp=marchInfo.startTimeStamp;
			march.endTimeStamp=marchInfo.endTimeStamp;
			march.fromPlayerId=marchInfo.fromPlayerId;
			march.worldBossId=marchInfo.worldBossId;
			march.oneWayTime=marchInfo.oneWayTime;
			march.toAllianceId =marchInfo.toAllianceId;
			march.fromAllianceId =marchInfo.fromAllianceId;
			march.isWin = marchInfo.isWin;
				
			KBN.AvaMarchController.instance().AddMarch(march);
		}
	}

	private void sendTileMarchLineSocketData( int tileID, int op ) {
		if( NewSocketNet.instance != null ) {
			battleInfo.battleInfo msgSoket = new battleInfo.battleInfo();
			msgSoket.userId = Datas.singleton.tvuid();
			msgSoket.type = 2;
			msgSoket.cmd = op; // 1 for registering, 2 for unregistering
			msgSoket.worldId = Datas.singleton.worldid();
			msgSoket.id = 1;
			msgSoket.subId = tileID;
			msgSoket.mode = 0;
			NewSocketNet.instance.Send( msgSoket );
		}
	}
	
	private void cleanUpTileMarchLines( int tileID ) {
		m_mapCtrl.m_avaMapAnimMgr.cleanUpFollowedMarchLines();
		m_followedMarchLines = null;
	}

	private void onShowTileMarchLineSucceeded( byte[] bytes ) {
		MenuMgr.instance.setAvaWaitingLabelVisiable (false);
		if( bytes != null ) {
			m_followedMarchLines = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVATileMarchLineList.PBMsgAVATileMarchLineList>( bytes );
			limitFollowedMarchLines();
		}
		m_tileMarchLineReqReturned = true;
	}

	private void onShowTileMarchLineFailed( string errorMessage, string errorCode ) {
		MenuMgr.instance.setAvaWaitingLabelVisiable (false);
		ErrorMgr.singleton.PushError("",  Datas.getArString( string.Format( "Error.err_{0}", errorCode ) ), true, "", null);
	}


	private void onReqTileInfoSucceeded( byte[] bytes ) {
		MenuMgr.instance.setAvaWaitingLabelVisiable (false);
		PBMsgAVATileInfo.PBMsgAVATileInfo d = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVATileInfo.PBMsgAVATileInfo>( bytes );
		TileInfoPopUp sc = m_mapCtrl.tileInfoPopUp.GetComponent<TileInfoPopUp>();
		sc.setupAVATileInfo( d );
	}
	
	private void onReqTileInfoFailed( string errorMessage, string errorCode ) {
		MenuMgr.instance.setAvaWaitingLabelVisiable (false);
		ErrorMgr.singleton.PushError("",  Datas.getArString( string.Format( "Error.err_{0}", errorCode ) ), true, "", null);
	}
	
	private void onReqShareTileSucceeded( byte[] bytes ) {
		MenuMgr.instance.setAvaWaitingLabelVisiable (false);
		MenuMgr.instance.PushMessage( Datas.getArString("Common.Done") );
		m_mapCtrl.hideShareButton();
	}

	private void onReqMapDataSucceeded( byte[] rawData ) {

		MenuMgr.instance.setAvaWaitingLabelVisiable (false);
		m_blockData = new HashObject();
		PBMsgAVAMap.PBMsgAVAMap d = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVAMap.PBMsgAVAMap>(rawData);
		foreach( PBMsgAVAMap.PBMsgAVAMap.Tile a in d.tile ) {
			// Construct the block data
			constructBlockData( a );
		}
		updateMemCache();
		m_mapCtrl.reqWorldMapOk();
	}

	private void onReqMapCacheDataSucceeded( byte[] rawData ) {
		MenuMgr.instance.setAvaWaitingLabelVisiable (false);
		PBMsgAVAMapCache.PBMsgAVAMapCache d = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVAMapCache.PBMsgAVAMapCache>(rawData);
		GhostMap.getInstance().switchDataSet( false );
		HashObject data = JSONParse.instance.Parse( d.tile );
		string[] keys = _Global.GetObjectKeys( data );

		for( int i = 0; i < keys.Length; ++i ) {
			int tileId = _Global.INT32( keys[i] );
			int tileType = _Global.INT32( data[keys[i]] );
			if( tileType == Constant.TileType.TILE_TYPE_AVA_PLAYER ) {
				tileType = Constant.TileType.TILE_TYPE_AVA_PLAIN;
			}
			int x = ( ( tileId - 1 ) % Constant.Map.AVA_MINIMAP_WIDTH ) + 1;
			int y = ( tileId - 1 ) / Constant.Map.AVA_MINIMAP_WIDTH + 1;
			GhostMap.getInstance().SetData( x, y, tileType, 1, 0 );
		}

		GhostMap.getInstance().WriteToFile();
		// Write down the state that the cache file's been downloaded
		int actID = GameMain.Ava.Event.GetActId();
		int worldID = KBN.Datas.singleton.worldid();
		string key = ""+actID+"_"+worldID;
		PlayerPrefs.SetString( key, "1" );
	}


	private void updateMemCache() {
		MapMemCache.instance().switchDataSet( false );
		if( USE_TEST_DATA ) {
			MapMemCache.instance().EnableBlockCacheSizeLimit = false;
		}
		List<string> keys = new List<string>(_Global.GetObjectKeys( m_blockData ));
		for( int k = 0; k < keys.Count; k++ ) {
			// Map memory cache will update the ghost map cache
			MapMemCache.instance().updateBlock( keys[k], m_blockData[keys[k]] );
		}
	}

	private void constructBlockData( PBMsgAVAMap.PBMsgAVAMap.Tile tile ) {
		int blockX = ( tile.xcoord - 1 ) / Constant.Map.BLOCK_TILE_CNT;
		int blockY = ( tile.ycoord - 1 ) / Constant.Map.BLOCK_TILE_CNT;
		string blockName = "bl_"+(blockX*Constant.Map.BLOCK_TILE_CNT)+"_bt_"+(blockY*Constant.Map.BLOCK_TILE_CNT);

		if( m_blockData[blockName] == null ) {
			m_blockData[blockName] = new HashObject();
		}

		HashObject data = new HashObject();
		// Key-values the core system needs to use
		data["tileType"] = new HashObject();
		data["tileType"].Value = ""+tile.tileType;
		data["xCoord"] = new HashObject();
		data["xCoord"].Value = ""+tile.xcoord;
		data["yCoord"] = new HashObject();
		data["yCoord"].Value = ""+tile.ycoord;
		data["tileLevel"] = new HashObject();
		data["tileLevel"].Value = "1";
		data["tileUserId"] = new HashObject();
		data["tileUserId"].Value = ""+tile.userId;
		data["tileCityId"] = new HashObject();
		data["tileCityId"].Value = "0";
		data["tileAllianceId"] = new HashObject();
		data["tileAllianceId"].Value = ""+tile.allianceId;
		data["tileKind"] = new HashObject();
		data["tileKind"].Value = "1";
		data["tileId"] = new HashObject();
		data["tileId"].Value = ""+tile.tileId;
		data["tileProvinceId"] = new HashObject();
		data["tileProvinceId"].Value = ""+tile.provinceId;
		data["protectTime"] = new HashObject();
		data["protectTime"].Value = ""+tile.protectTime;
		data["serverId"] = new HashObject();
		data["serverId"].Value = ""+tile.serverId;

		string key = "l_"+tile.xcoord+"_t_"+tile.ycoord;
		m_blockData[blockName][key] = data;
	}

	private void genTestTileData( PBMsgAVAMap.PBMsgAVAMap.Tile t, int x, int y, int motif, int level, int cityType ) {
		t.xcoord = x;
		t.ycoord = y;
		t.tileId = 1;
		t.blockId = 1;
		t.provinceId = 1;
		t.tileType = motif;
		t.serverId = 1;
		t.allianceId = 0;
		t.userId = 1;
		t.userName = "TEST";
		t.allianceName = "TEST_ALLIANCE";
	}

	private void onReqShareTileFailed( string errorMessage, string errorCode ) {
		MenuMgr.instance.setAvaWaitingLabelVisiable (false);
		ErrorMgr.singleton.PushError("",  Datas.getArString( string.Format( "Error.err_{0}", errorCode ) ), true, "", null);
	}

	private void onReqMapDataFailed( string errorMessage, string errorCode ) {
		MenuMgr.instance.setAvaWaitingLabelVisiable (false);
		ErrorMgr.singleton.PushError("",  Datas.getArString( string.Format( "Error.err_{0}", errorCode ) ), true, "", null);
	}

	private void onReqMapCacheDataFailed( string errorMessage, string errorCode ) {
		MenuMgr.instance.setAvaWaitingLabelVisiable (false);
		ErrorMgr.singleton.PushError("",  Datas.getArString( string.Format( "Error.err_{0}", errorCode ) ), true, "", null);
	}

	private static byte[] TEST_TILE_MOTIFS = {
		/*0, 10, 11, 20, 30, 40, 50, 51, 52,*/
		70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
	};

	private bool TEST_DATA_INITIALIZED = false;
	private bool USE_TEST_DATA = false;
	private MapController m_mapCtrl;
	private HashObject m_blockData;
	private int m_lastFollowedTileID;
	private long m_nextUpdateTime;
	private PBMsgAVATileMarchLineList.PBMsgAVATileMarchLineList m_followedMarchLines;
}
