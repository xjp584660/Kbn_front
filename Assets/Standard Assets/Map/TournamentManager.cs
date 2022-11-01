// TournamentManager.cs
//
// Brief: Manages the state of the world map tournament.
// Created: Hong Pan
//
using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

namespace KBN
{

	public class TournamentManager : MonoBehaviour {


		//-----------------------------------------------------------------------------------
		// Public Interfaces
		//-----------------------------------------------------------------------------------
		public bool ActivitySituationChanged {
			set { m_activitySituationChanged = value; }
			get { return m_activitySituationChanged; }
		}

		public bool isTournamentTurnedOn() {

			long rewardingBufferTime = 0;
			if( GameMain.singleton == null ) {
				return false;
			}
			HashObject seed = GameMain.singleton.getSeed();
			if( seed != null ) {
				if( seed["worldmap"] != null ) {
					if( seed["worldmap"]["rewardInterval"] != null ) {
						rewardingBufferTime = _Global.INT32( seed["worldmap"]["rewardInterval"] );
					}
				}
			}
			long now = KBN.GameMain.unixtime ();
			long endTime = PvPToumamentInfoData.instance().actionEndTime;

			long delta = now - endTime;
			return ( delta <= rewardingBufferTime );
		}
	
		public bool isTournamentStarted() {
			if( !isTournamentTurnedOn() ) {
				return false;
			}
			long now = KBN.GameMain.unixtime();
			long startTime = PvPToumamentInfoData.instance().actionStartTime;
			long endTime = PvPToumamentInfoData.instance().actionEndTime;
			if( now < startTime ) // Anncouncing in adavance
			{
				return false;
			}
			else if( now < endTime ) // Started
			{
				return true;
			}
			return false;
		}

		public void setTileCoordContext( float xOrg, float yOrg, float tileWorldWidth, float tileWorldHeight ) {
			m_xOrg = xOrg;
			m_yOrg = yOrg;
			m_tileWorldWidth = tileWorldWidth;
			m_tileWorldHeight = tileWorldHeight;
		}

		public int getTileDamageStage( int tileID ) {
			const int STAGES = 4;
			string key = ""+tileID;
			if( m_incomingData[key] == null ) {
				return -1;
			}
			PBMsgWorldMapSocket.PBMsgWorldMapSocket d = m_incomingData[key].Value as PBMsgWorldMapSocket.PBMsgWorldMapSocket;
			if( d.maxHP == 0 ) {
				return -1;
			}
			long s = d.maxHP / STAGES;
			long h = System.Math.Max( d.curHP - 1, 0 );
			long i = h / s;
			if( i >= 0 && i < STAGES ) {
				return (int)(STAGES - 1 - i);
			}
			return -1;
		}

		public void playStageSound( int stage ) {
			if( stage == 0 ) {
				SoundMgr.instance().PlayEffect("kbn tournament 1.1 stage1", "Audio/Pvp/");
			} else if( stage == 1 ) {
				SoundMgr.instance().PlayEffect("kbn tournament 1.2 stage2", "Audio/Pvp/");
			} else if( stage == 2 ) {
				SoundMgr.instance().PlayEffect("kbn tournament 1.3 stage3", "Audio/Pvp/");
			} else if( stage == 3 ) {
				SoundMgr.instance().PlayEffect("kbn tournament 1.4 stage4", "Audio/Pvp/");
			}
		}

		public void cleanupTileContext() {
			m_followingMap = new HashObject();
			m_incomingData = new HashObject();
		}

		public void setAcceptSocketData( bool accept ) {
			m_acceptSocketData = accept;
		}

		public void receiveTournamentSocketPacket(byte[] result) {
			if( !isTournamentStarted() ) {
				return;
			}
			if( !m_acceptSocketData ) {
				return;
			}

			const float HEIGHT = 0.0f;
			PBMsgWorldMapSocket.PBMsgWorldMapSocket worldMapData  = 
				_Global.DeserializePBMsgFromBytes<PBMsgWorldMapSocket.PBMsgWorldMapSocket> (result);

			Vector3 localPos = new Vector3(
				m_xOrg + ( worldMapData.xcoord - 1 ) * m_tileWorldWidth,
				HEIGHT,
				m_yOrg - ( worldMapData.ycoord - 1 ) * m_tileWorldHeight );
			// Find the current damage stage of the tile
			int stage = getTileDamageStage( worldMapData.tileId );
			if( stage == -1 )
				stage = 0;

			bool canPlaySound = true;
			string key = ""+worldMapData.tileId;
			if( m_incomingData[key] == null ) {
				m_incomingData[key] = new HashObject();
			} else {
				if( DYNAMICALLY_PLAY_SOUND_ON_TILE_STATE_TRANSITION ) {
					PBMsgWorldMapSocket.PBMsgWorldMapSocket sockData = m_incomingData[key].Value as PBMsgWorldMapSocket.PBMsgWorldMapSocket;
					canPlaySound = sockData.tileId != worldMapData.tileId;
				}
			}

			m_incomingData[key].Value = worldMapData;

			if( DYNAMICALLY_PLAY_SOUND_ON_TILE_STATE_TRANSITION ) {
				if( canPlaySound ) {
					playStageSound( stage );
				}
			}
			MarchEffectManager.Type type = MarchEffectManager.Type.FIGHTING_CITY_1x1_STAGES;
			if( worldMapData.tileType >= Constant.TileType.WORLDMAP_1X1_DUMMY && worldMapData.tileType <= Constant.TileType.WORLDMAP_LAST ) {
				if( worldMapData.tileType >= Constant.TileType.WORLDMAP_2X2_LT_DUMMY ) {
					type = MarchEffectManager.Type.FIGHTING_TILE_2x2_STAGES;
				} else {
					type = MarchEffectManager.Type.FIGHTING_TILE_1x1_STAGES;
				}
			} else if( worldMapData.tileType == Constant.TileType.WORLDMAP_2X2_KEY_TILE ) {
				type = MarchEffectManager.Type.FIGHTING_TILE_2x2_STAGES;
			}
			// Stage effect(Unique & Auto recycled)
			MarchEffectManager.EffectOnDiffStages.Stage stageEnum = MarchEffectManager.EffectOnDiffStages.Stage.FIRING_IN_SLIGHT_FORCE + stage;
			MarchEffectManager.instance().activateEffectOnDiffStages( type, null, localPos, stageEnum, worldMapData.tileId );

			// Tile state(Unique & Auto recycled)
			TileStateUnderAttackManager.getInstance().activateTileStateHUD( key, localPos, worldMapData.curHP, worldMapData.maxHP,
			                                                               type == MarchEffectManager.Type.FIGHTING_TILE_2x2_STAGES );
		}


		public void unregisterSocketPacket_All() {
			if( Datas.singleton == null ) {
				return;
			}
//			if( isTournamentStarted() ) {
//				m_followingMap = new HashObject();
//				
//				battleInfo.battleInfo msgSoket = new battleInfo.battleInfo();
//				msgSoket.userId = Datas.singleton.tvuid();
//				msgSoket.type = SOCKET_REQ_TYPE_PVP;
//				msgSoket.cmd = SOCKET_UN_REGISTER;
//				msgSoket.worldId = Datas.singleton.worldid();
//				msgSoket.id = SOCKET_REGISTER_TYPE_TILE;
//				msgSoket.subId = Alliance.singleton.MyAllianceId();
//				safeSocketPacketDeliver( msgSoket );
//			}
		}

		// Will be called every time the player moves the camera and releases the touch, like:
		// begin()
		// foreach activity tile
		//	updateActivityTile
		// end()
		public void updateActivityTilesBegin() {
			if( isTournamentStarted() ) {
				if( REGISTER_ACTIVITY_TILES_IN_BULK ) {
					m_tileBatchToRegister = new List<int>();
				}
			}
		}

		public void updateActivityTilesEnd() {
			if( isTournamentStarted() ) {
				if( REGISTER_ACTIVITY_TILES_IN_BULK ) {
					registerSocketPacket_TileInfoBatch();
				}
			}
		}

		public void updateActivityTile( HashObject tileInfo ) {
			if( isTournamentStarted() ) {
				if( tileInfo != null ) {
					if( tileInfo["tileId"] != null ) {
						int id = _Global.INT32( tileInfo["tileId"].Value as String );
						string key = ""+id;
						// Update the following map
						if( m_followingMap[key] == null ) {
							m_followingMap[key] = new HashObject();
							m_followingMap[key].Value = tileInfo;
							if( REGISTER_ACTIVITY_TILES_IN_BULK ) {
								m_tileBatchToRegister.Add( id );
							} else {
								registerSocketPacket_TileInfo( id ); // Register one by one...(low performance)
							}
						}
					}
				}
			}
		}

		public void setAllianceHelpCityMarch( int cityID, int marchID ) {
			m_allianceHelpCityID = cityID;
			m_allianceHelpMarchID = marchID;
		}


		public float getBonusProgressPerc() {
			return m_bonusProgressPerc;
		}

		public int getBonusTime( int index ) {
			return m_bonusTime[index];
		}

		public int getBonusPoints( int index ) {
			return m_bonusPoints[index];
		}

		public bool convertToKeyTile2x2( int tileType, ref int col, ref int row ) {
			bool changed = false;
			switch (tileType) {
				case Constant.TileType.WORLDMAP_2X2_RT_ACT:
					col--;
					changed = true;
					break;
				case Constant.TileType.WORLDMAP_2X2_RT_DUMMY:
					col--;
					changed = true;
					break;
				case Constant.TileType.WORLDMAP_2X2_LB_ACT:
					row--;
					changed = true;
					break;
				case Constant.TileType.WORLDMAP_2X2_LB_DUMMY:
					row--;
					changed = true;
					break;
				case Constant.TileType.WORLDMAP_2X2_RB_ACT:
					col--;
					row--;
					changed = true;
					break;
				case Constant.TileType.WORLDMAP_2X2_RB_DUMMY:
					col--;
					row--;
					changed = true;
					break;
			}
			return changed;
		}


		public string getTileName( HashObject slotInfo ) {
			if( slotInfo != null ) {
				int tileType = _Global.INT32( slotInfo["tileType"] );
				int tileUserId = _Global.INT32( slotInfo["tileUserId"] );
				string cityName = slotInfo["cityName"] == null ? "" : ( slotInfo["cityName"].Value as string );
				int tileKind = ( slotInfo["tileKind"] != null ) ? _Global.INT32( slotInfo["tileKind"] ) : 1;
				return getTileName( tileType, tileUserId, cityName, tileKind );
			}
			return "";
		}

		public string getTileName( int tileType, int tileUserId, string cityName, int tileKind ) {
			string name = "";
			switch( tileType ) {
				case Constant.TileType.CITY:
					if( tileUserId == 0 ) {
						name = Datas.getArString("Common.BarbarianCamp");
					} else {
						name = cityName;
					}
					break;
				case Constant.TileType.BOG: name = Datas.getArString("Common.Bog"); break;
				case Constant.TileType.GRASSLAND: name = Datas.getArString("Common.Grassland"); break;
				case Constant.TileType.LAKE: name = Datas.getArString("Common.Lake"); break;
				case Constant.TileType.WOODS: name = Datas.getArString("Common.Woods"); break;
				case Constant.TileType.HILLS: name = Datas.getArString("Common.Hills"); break;
				case Constant.TileType.MOUNTAIN: name = Datas.getArString("Common.Mountain"); break;
				case Constant.TileType.PLAIN: name = Datas.getArString("Common.Plain"); break;
				case Constant.TileType.WORLDMAP_1X1_ACT:
					name = Datas.getArString( ( tileKind == 1 ) ? "PVP.TileType_Boss" : "PVP.TileType_Resource" );
					break;
				case Constant.TileType.WORLDMAP_1X1_DUMMY: 
				case Constant.TileType.WORLDMAP_2X2_LT_DUMMY:
				case Constant.TileType.WORLDMAP_2X2_RT_DUMMY:
				case Constant.TileType.WORLDMAP_2X2_LB_DUMMY:
				case Constant.TileType.WORLDMAP_2X2_RB_DUMMY:
					name = Datas.getArString("Common.Bog");
					break;
				case Constant.TileType.WORLDMAP_2X2_LT_ACT:
				case Constant.TileType.WORLDMAP_2X2_RT_ACT:
				case Constant.TileType.WORLDMAP_2X2_LB_ACT:
				case Constant.TileType.WORLDMAP_2X2_RB_ACT:
					name = Datas.getArString( ( tileKind == 1 ) ? "PVP.TileType_Boss" : "PVP.TileType_Resource" );
					break;
			}
			return name;
		}
		public void requestAllianceHelpItemUsing( int itemID, Action<HashObject> canGiveHelp, Action<HashObject> cannotGiveHelp ) {
			m_lastUsedMarchHelpItemID = itemID;
			m_canGiveHelp = canGiveHelp;
			m_cannotGiveHelp = cannotGiveHelp;
			PBMsgReqWorldMap.PBMsgReqWorldMap request = new PBMsgReqWorldMap.PBMsgReqWorldMap();
			request.cmd = 2;
			request.subcmd = 10;
			request.itemId = itemID;
			request.toCityId = m_allianceHelpCityID;
			request.toMarchId = m_allianceHelpMarchID;
			UnityNet.RequestForGPB( "worldmap.php", request, onNotifyServerOK_AllianceHelpDone, onAllianceMarchHelpError );
		}

		public void requestTournamentBonusAcquirementForAlliance() {
			HashObject seed = GameMain.singleton.getSeed();

			PBMsgReqWorldMap.PBMsgReqWorldMap request = new PBMsgReqWorldMap.PBMsgReqWorldMap();
			request.cmd = 2;
			request.subcmd = 8;
			if( seed["player"] != null && seed["player"]["allianceId"] != null ) {
				request.allianceId = _Global.INT32(seed["player"]["allianceId"].Value);
			}
			UnityNet.RequestForGPB( "worldmap.php", request, onNotifyServerOK_TournamentBonusAcquireForAlliance, onError );
		}

		public void requestTournamentBonusAcquirementForPlayer() {
			HashObject seed = GameMain.singleton.getSeed();
			PBMsgReqWorldMap.PBMsgReqWorldMap request = new PBMsgReqWorldMap.PBMsgReqWorldMap();
			request.cmd = 2;
			request.subcmd = 11;
			if( seed["player"] != null && seed["player"]["allianceId"] != null ) {
				request.allianceId = _Global.INT32(seed["player"]["allianceId"].Value);
			}
			UnityNet.RequestForGPB( "worldmap.php", request, onNotifyServerOK_TournamentBonusAcquireForPlayer, onError );
		}

		public void requestTroopRestoreCheck()
		{
			PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
			request.cmd = 2;
			request.subcmd = 5;
			KBN.UnityNet.RequestForGPB("worldmap.php", request, onNotifyServerOK_TroopRestoreCheck, onError);
		}
		public void requestTroopRestoreAcquirement() {
			PBMsgReqWorldMap.PBMsgReqWorldMap request = new PBMsgReqWorldMap.PBMsgReqWorldMap();
			request.cmd = 2;
			request.subcmd = 9;
			UnityNet.RequestForGPB( "worldmap.php", request, onNotifyServerOK_TroopRestoreAcquire, onError, true );
		}

		public void requestTileShare( int tileID ) {
			PBMsgReqWorldMap.PBMsgReqWorldMap request = new PBMsgReqWorldMap.PBMsgReqWorldMap();
			request.cmd = 3;
			request.subcmd = 1;
			request.tileId.Add( tileID );
			UnityNet.RequestForGPB( "worldmap.php", request, onNotifyServerOK_TileShareResult, onError );
		}

		public void requestTileGiveUp( int tileID ) {
			PBMsgReqWorldMap.PBMsgReqWorldMap request = new PBMsgReqWorldMap.PBMsgReqWorldMap();
			request.cmd = 2;
			request.subcmd = 2;
			request.tileId.Add( tileID );
			UnityNet.RequestForGPB( "worldmap.php", request, onNotifyServerOK_TileGiveUpResult, onError );
		}

		public void requestTileBonus( int tileType, int col, int row, MulticastDelegate callback ) {
			convertToKeyTile2x2( tileType, ref col, ref row );
			m_tileStatusListener = callback;

			// Notify the server
			PBMsgReqWorldMap.PBMsgReqWorldMap request = new PBMsgReqWorldMap.PBMsgReqWorldMap();
			request.cmd = 2;
			request.subcmd = 7;
			request.xcoord = col;
			request.ycoord = row;
			UnityNet.RequestForGPB( "worldmap.php", request, onNotifyServerOK_TileBonusResult, onError, true );
		}

		public bool getTileBonus( int kind, int level ) {
			KBN.DataTable.WorldMap worldMap = GameMain.GdsManager.GetGds<GDS_WorldMap>().GetItemById( kind, level );
			if( worldMap == null ) {
				return false;
			}
			if( worldMap.SCORE == "0" || worldMap.TIME_COST == "0" ) {
				return false;
			}
			string[] fields1 = worldMap.SCORE.Split('_');
			string[] fields2 = worldMap.TIME_COST.Split('_');
			for( int i = 0; i < BONUS_LEVELS; ++i ) {
				m_bonusTime[i] = _Global.INT32( fields2[i] );
				m_bonusPoints[i] = _Global.INT32( fields1[i] );
			}
			return true;
		}

		public string getTimeFormat2Digits( long sec ) {
			long days = sec / (24*3600);
			sec -= days * 86400;
			long hours = sec / 3600;
			sec -= hours * 3600;
			long mins = sec / 60;
			long secs = sec % 60;
			return getTimeFormat2Digits( days, hours, mins, secs );
		}

		private string getTimeFormat2Digits( long day, long hour, long min, long sec ) {

			int validCount = 0;
			string timeFormat = "";
			if( day != 0 ) {
				validCount++;
				timeFormat += day+"d";
			}
			if( hour != 0 ) {
				validCount++;
				timeFormat += hour+"h";
				
			}
			if( validCount < 2 ) {
				if( min != 0 ) {
					validCount++;
					timeFormat += min+"m";
				}
			}
			
			if( validCount < 2 ) {
				timeFormat += sec+"s";
			}
			return timeFormat;
		}

		public string getTournamentTimeNotice() {
			long timeNow = KBN.GameMain.unixtime();
			long timeStart = PvPToumamentInfoData.instance().actionStartTime;
			long timeEnd = PvPToumamentInfoData.instance().actionEndTime;
			long deltaTime = 0;
			string notice = KBN.Datas.getArString("Board.PVP_Countdown3");
			string prefix = "";

			if( timeNow < timeStart )
			{
				deltaTime = timeStart - timeNow;
				prefix = Datas.getArString("Board.PVP_Countdown1");
				if( m_lastState == State.UNKNOWN ) {
					m_lastState = State.STOPPED;
				} else if( m_lastState != State.STOPPED ) {
					m_lastState = State.STOPPED;
					m_activitySituationChanged = true;
				}
			}
			else if( timeNow < timeEnd )
			{
				deltaTime = timeEnd - timeNow;
				prefix = Datas.getArString("Board.PVP_Countdown2");
				if( m_lastState == State.UNKNOWN ) {
					m_lastState = State.STARTED;
				} else if( m_lastState != State.STARTED ) {
					m_lastState = State.STARTED;
					m_activitySituationChanged = true;
				}
			}
			else {
				if( m_lastState == State.UNKNOWN ) {
					m_lastState = State.STOPPED;
				} else if( m_lastState != State.STOPPED ) {
					m_lastState = State.STOPPED;
					m_activitySituationChanged = true;
				}
			}
			if( prefix != "" ) {
				string postfix = _Global.timeFormatStr( deltaTime );
				notice = string.Format( prefix, postfix );

			}


			return notice;
		}


		
		void Awake() {
			s_singleton = this;
		}

		// Use this for initialization, 
		void Start() {
			init();
			if( PRE_FETCH_TOURNAMENT_INFO ) {
				PvPToumamentInfoData.instance().RequestToumamentInfo( false, false );
			}
		}
	
		void init() {
			m_lastQueryTime = GameMain.unixtime();
			m_actID = -1;
			m_completeDialogFinished = false;
			m_tileOccupationHandleCache = new HashObject();
			m_tileOccupiedTime = GameMain.unixtime();
			m_bonusProgressPerc = 0f;
			getTileBonus( 1, 9 );
			m_lastUsedMarchHelpItemID = -1;
			m_acceptSocketData = false;
		}


		
		// Update is called once per frame
		private bool m_firstLoadInfo = false;
		private long m_lastForceRefreshCheckTime = 0;
		private long m_lastUpdateTime = 0;
		void Update() {

			if(!GameMain.singleton.IsPushMainchrome()) {
				return;
			}
			if( !m_firstLoadInfo ) {
				PvPToumamentInfoData.instance().RequestToumamentInfo( false, false );
				m_firstLoadInfo = true;
				NewSocketNet.instance.RegisterNetworkSignUpFunc( onPostSignUpHandler );
			}

			long now = GameMain.unixtime();
			
			if( now - m_lastUpdateTime < 1 ) {
				return;
			}

			m_lastUpdateTime = now;

			// All the following operations should be performed
			// based on a time basis more than one second

			analyzeSeed();

			if( isTournamentStarted() ) {
				updateTileBonusProgress();

				if( FORCE_REFRESH_ACTIVITY_TILES ) {
					if( m_acceptSocketData ) {
						if( now - m_lastForceRefreshCheckTime > FORCE_REFRESH_ACTIVITY_TILES_TIME_THRESHOLD ) {
							m_lastForceRefreshCheckTime = now;
							string[] keys = _Global.GetObjectKeys( m_followingMap );
							if( keys.Length > FORCE_REFRESH_ACITIVITY_TILES_THRESHOLD ) {
								forceRefreshActivityTiles();
							}
						}
					}
				}
			}
		}

		
		public static TournamentManager getInstance() {
			return s_singleton;
		}

		//-----------------------------------------------------------------------------------
		// Underlying Implementations
		//-----------------------------------------------------------------------------------
		private enum State {
			UNKNOWN,
			STARTED,
			STOPPED
		};

		private const int WORLDMAP_WIN_BOSS = 1;
		private const int WORLDMAP_LOST_BOSS = 2;
		private const int WORLDMAP_WIN_PLAYER = 3;
		private const int WORLDMAP_LOSE_TILE_CONTENTION = 4;
		private const int WORLDMAP_MARCH = 5;
		private const int WORLDMAP_TILES_OCCUPIED_OVERFLOW = 6;
		private const int WORLDMAP_REINFORCE_LOST = 7;
		private const int WORLDMAP_LOST_MY_TILE = 8;

		private static int BONUS_LEVELS = 5;

		private static long QUERY_PEROID = 5;

		private static bool DYNAMICALLY_PLAY_SOUND_ON_TILE_STATE_TRANSITION = true;
		private static bool PRE_FETCH_TOURNAMENT_INFO = false;

		// The activity tile socket listening functionalities:

		// 1) Registry delivery in bulk.
		// 2) Force adjusting range on max listening tile number.
		// 3) Unregistering & Force updating on leaving and entering the map view.
		// 4) Re-registry after re-signup in the map view.

		// This variable is used to switch on the tile registry in bulk.
		private const bool REGISTER_ACTIVITY_TILES_IN_BULK = true;

		// These variables are used to realize the tile unregistry on
		// a threshold basis.
		private const bool FORCE_REFRESH_ACTIVITY_TILES = true;
		private const int FORCE_REFRESH_ACTIVITY_TILES_TIME_THRESHOLD = 2;
		private const int FORCE_REFRESH_ACITIVITY_TILES_THRESHOLD = 50;


		private static TournamentManager s_singleton;
		
		private State m_lastState = State.UNKNOWN;

		private long m_startingTime;
		private long m_endTime;
		private long m_lastQueryTime;

		// Data exchange
		private long m_actID;
		private bool m_completeDialogFinished;
		private HashObject m_tileOccupationHandleCache;
		private Action<HashObject> m_canGiveHelp;
		private Action<HashObject> m_cannotGiveHelp;


		// Tile bonus
		private int[] m_bonusTime = new int[BONUS_LEVELS];
		private int[] m_bonusPoints = new int[BONUS_LEVELS];
		private long m_tileOccupiedTime;
		private float m_bonusProgressPerc;

		// Tile share
		private MulticastDelegate m_tileStatusListener;

		// Alliance help
		private int m_allianceHelpCityID;
		private int m_allianceHelpMarchID;
		private int m_lastUsedMarchHelpItemID;

		// Socket data
		private HashObject m_incomingData = new HashObject();
		private HashObject m_followingMap = new HashObject();
		private List<int> m_tileBatchToRegister;
		private bool m_acceptSocketData;

		private const int SOCKET_REQ_TYPE_PVP = 0;
		private const int SOCKET_REGISTER = 1;
		private const int SOCKET_UN_REGISTER = 2;
		private const int SOCKET_REGISTER_TYPE_TILE = 1;

		// Scene data
		private float m_xOrg;
		private float m_yOrg;
		private float m_tileWorldWidth;
		private float m_tileWorldHeight;

		// Activity changed
		private bool m_activitySituationChanged = false;



		//Add by Caisen 2014.9.3 
		//the end time (after speed up) 
		public int theNewEndTime=0;

		private void safeSocketPacketDeliver( battleInfo.battleInfo packet ) {
			if( NewSocketNet.instance != null ) {
				//NewSocketNet.instance.Send( packet );
			}
		}

		private void onPostSignUpHandler() {
			if( m_acceptSocketData ) {
				forceRefreshActivityTiles();
			}
		}

		private void forceRefreshActivityTiles() {
			cleanupTileContext();
			unregisterSocketPacket_All();
			GameMain.singleton.forceRepaintWorldMap();
		}

		private void registerSocketPacket_TileInfoBatch() {
//			if( isTournamentStarted() ) {
//				if( m_tileBatchToRegister.Count > 0 ) {
//					battleInfo.battleInfo msgSoket = new battleInfo.battleInfo();
//					msgSoket.userId = Datas.singleton.tvuid();
//					msgSoket.type = SOCKET_REQ_TYPE_PVP;
//					msgSoket.cmd = SOCKET_REGISTER;
//					msgSoket.worldId = Datas.singleton.worldid();
//					msgSoket.id = SOCKET_REGISTER_TYPE_TILE;
//					msgSoket.subId = 0;
//					msgSoket.subList = m_tileBatchToRegister;
//					safeSocketPacketDeliver( msgSoket );
//				}
//			}
		}
		
		private void registerSocketPacket_TileInfo( int tileID ) {
//			if( isTournamentStarted() ) {
//				battleInfo.battleInfo msgSoket = new battleInfo.battleInfo();
//				msgSoket.userId = Datas.singleton.tvuid();
//				msgSoket.type = SOCKET_REQ_TYPE_PVP;
//				msgSoket.cmd = SOCKET_REGISTER;
//				msgSoket.worldId = Datas.singleton.worldid();
//				msgSoket.id = SOCKET_REGISTER_TYPE_TILE;
//				msgSoket.subId = tileID;
//				safeSocketPacketDeliver( msgSoket );
//			}
		}

		private void updateTileBonusProgress() {
			if( m_tileOccupiedTime == 0 ) {
				m_bonusProgressPerc = 0f;
			} else {
				long now = GameMain.unixtime();
				long diff = now - m_tileOccupiedTime;
				m_bonusProgressPerc = (float)diff / m_bonusTime[BONUS_LEVELS-1];
				if( m_bonusProgressPerc < 0f )
					m_bonusProgressPerc = 0f;
			}
		}

		private void analyzeSeed() {
			HashObject seed = GameMain.singleton.getSeed();
			if( seed == null ) {
				return;
			}
			if( GameMain.singleton.IsPushMainchrome() ) {
				if( seed["worldmap"] != null ) {
					if( seed["worldmap"]["actId"] != null ) {
						long actID = _Global.INT64( seed["worldmap"]["actId"] );
						long pop = _Global.INT64( seed["worldmap"]["pop"] );
						long finished = _Global.INT64( seed["worldmap"]["finished"] );
						long reward = _Global.INT64( seed["worldmap"]["reward"] );
						long troop = _Global.INT64( seed["worldmap"]["troop"] );

						// Check completion
						if( actID != 0 ) {
							if( finished != 0 ) { // The tournament is finished
								if( pop == 0 ) {
									bool showDlg = false;
									if( m_actID != actID ) {
										showDlg = true;
									} else if( !m_completeDialogFinished ) {
										showDlg = true;
									}

									if( showDlg ) {
										MenuMgr.instance.PushMenu( "TournamentCompleteMenu", null, "trans_zoomComp" );
										m_completeDialogFinished = true;
										// Notify the server
										PBMsgReqWorldMap.PBMsgReqWorldMap request=new PBMsgReqWorldMap.PBMsgReqWorldMap();
										request.cmd = 2;
										request.subcmd = 4;
										UnityNet.RequestForGPB("worldmap.php", request, onNotifyServerOK_TournamentResult);
									}
								}
							}
						}
						m_actID = actID;


						// Check tile occupation
						object[] hash = _Global.GetObjectValues( seed["worldmap"]["msg"] );
						const int FIXED_PARAMS = 11;
						for( int i = 0; i < hash.Length; ++i ) {
							string a = ( hash[i] as HashObject ).Value as string;
							if( m_tileOccupationHandleCache[a] == null ) {
								string[] fields = a.Split('_');
								if( fields.Length >= FIXED_PARAMS ) {
									int tileID = System.Convert.ToInt32( fields[0] );
									int userID = System.Convert.ToInt32( fields[1] );
									int result = System.Convert.ToInt32( fields[2] );
									int points = System.Convert.ToInt32( fields[3] );
									int xcoord = System.Convert.ToInt32( fields[4] );
									int ycoord = System.Convert.ToInt32( fields[5] );
									string enemyAllianceName = System.Text.Encoding.Default.GetString( Convert.FromBase64String( fields[6] ) );
									int tileType = System.Convert.ToInt32( fields[7] );
									int tileKind = System.Convert.ToInt32( fields[8] );
									int tileLevel = System.Convert.ToInt32( fields[9] );
									int timeStamp = System.Convert.ToInt32( fields[10] );
									string tileName = getTileName( tileType, userID, "", tileKind );

									string valString = "";

									// Bonus props
									if( result == WORLDMAP_WIN_BOSS ||
									   result == WORLDMAP_WIN_PLAYER ||
									   result == WORLDMAP_TILES_OCCUPIED_OVERFLOW ) { // Win the tile
										points = 0;
										int secs = 0;
										KBN.DataTable.WorldMap worldMap = GameMain.GdsManager.GetGds<KBN.GDS_WorldMap>().GetItemById( tileKind, tileLevel );
										if( worldMap != null ) {
											string[] fields1 = worldMap.SCORE.Split('_');
											string[] fields2 = worldMap.TIME_COST.Split('_');
											
											if( fields1.Length > 0 ) {
												if( fields2.Length > 0 ) {
													points = _Global.INT32( fields1[fields1.Length-1] );
													secs = _Global.INT32( fields2[fields2.Length-1] );
												}
											}
										}
										string timeFormat = getTimeFormat2Digits( secs );
										int canOccupyTile = ( result == WORLDMAP_TILES_OCCUPIED_OVERFLOW ) ? 0 : 1;
										valString = ""+points+"_"+timeFormat+"_"+xcoord+"_"+ycoord+"_"+tileName+"_"+tileKind+"_"+canOccupyTile;
										if( fields.Length > FIXED_PARAMS ) { // This should be a tile with prop bonus
											int n = fields.Length - FIXED_PARAMS;
											if( n % 2 != 0 ) {
												// Something wrong
											} else {
												int nProps = n / 2;
												for( int j = 0; j < nProps; ++j ) {
													valString += "_";
													valString += fields[FIXED_PARAMS+j*2]; // ID
													valString += "_";
													valString += fields[FIXED_PARAMS+j*2+1]; // Number
												}
											}
										}
										MenuMgr.instance.PushMenu( "TournamentBonusMenu", valString, "trans_zoomComp" );

									} else if( result == WORLDMAP_LOST_MY_TILE ) {	// Lost my tile

										valString = "("+xcoord+","+ycoord+")_"+ // Tile name
													enemyAllianceName+"_"+ // Alliance name
													points; // Points
										MenuMgr.instance.PushMenu( "TournamentLostTileMenu", valString, "trans_zoomComp" );
									} else if( result == WORLDMAP_LOSE_TILE_CONTENTION ) { // Lose the tile contention
									} else if( result == WORLDMAP_LOST_BOSS ) { // Lose the boss tile fight
									}
									MenuMgr.instance.PushMessage( KBN.Datas.getArString("PVP.Report_Toaster") );
								}


								m_tileOccupationHandleCache[a] = new HashObject();
								m_tileOccupationHandleCache[a].Value = "1";
								// Notify the server
								PBMsgReqWorldMap.PBMsgReqWorldMap request = new PBMsgReqWorldMap.PBMsgReqWorldMap();
								request.cmd = 2;
								request.subcmd = 6;
								request.msg = a;
								UnityNet.RequestForGPB("worldmap.php", request, onNotifyServerOK_TileBattleResult);
							}
						}

					}
				}
			}
		}

		private void onNotifyServerOK_AllianceHelpDone( byte[] rawData ) {
			if( m_lastUsedMarchHelpItemID != -1 ) {
				MyItems.singleton.subtractItem( m_lastUsedMarchHelpItemID, 1 );
				//MenuMgr.instance.PopMenu( "" );
				if( m_canGiveHelp != null ) {
					m_canGiveHelp( null );
				}
			}
			if (rawData == null) 
			{
				return;
			} 
			else 
			{
				PBMsgWorldMapSpeedUp.PBMsgWorldMapSpeedUp speedup=new PBMsgWorldMapSpeedUp.PBMsgWorldMapSpeedUp();
				speedup=KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapSpeedUp.PBMsgWorldMapSpeedUp>(rawData);
				theNewEndTime=speedup.etaTimestamp;
				//theNewEndTime=rawData[0];
				//KBN.MenuMgr.instance.sendNotification(Constant.PvPResponseOk.RefreshTheEndTimeOfMarchLine);
				KBN.MenuMgr.instance.SendNotification(Constant.PvPResponseOk.RefreshTheEndTimeOfMarchLine);
				return;
			}
		}
		private void onAllianceMarchHelpError( string errorMessage, string errorCode ) {
			MenuMgr.instance.PopMenu( "" );

			ErrorMgr.singleton.PushError("",  Datas.getArString( string.Format( "Error.err_{0}", errorCode ) ), true, "", null);
			
			if( m_cannotGiveHelp != null ) {
				m_cannotGiveHelp( null );
			}
		}

		private void onNotifyServerOK_TournamentBonusAcquireForPlayer( byte[] rawData ) {
			if( rawData == null ) {
				return;
			}
			PBMsgWorldMapReward.PBMsgWorldMapReward d = KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapReward.PBMsgWorldMapReward>(rawData);
			List<PBMsgWorldMapReward.PBMsgWorldMapReward.item> reward = d.itemInfo;
			for( int i = 0; i < reward.Count; ++i ) {
				int itemID = reward[i].itemId;
				int num = reward[i].num;
				KBN.MyItems.singleton.AddItem( itemID, num );
			}
			MenuMgr.instance.PushMessage( Datas.getArString("Common.Done") );
			MenuMgr.instance.PopMenu( "" );
			MenuMgr.instance.SendNotification( Constant.PvPResponseOk.ReceiveTournamentBonusForPlayer, null );
		}

		private void onNotifyServerOK_TournamentBonusAcquireForAlliance( byte[] rawData ) {
			if( rawData == null ) {

				return;
			}
			PBMsgWorldMapReward.PBMsgWorldMapReward d = KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapReward.PBMsgWorldMapReward>(rawData);
			List<PBMsgWorldMapReward.PBMsgWorldMapReward.item> reward = d.itemInfo;
			for( int i = 0; i < reward.Count; ++i ) {
				int itemID = reward[i].itemId;
				int num = reward[i].num;
				KBN.MyItems.singleton.AddItem( itemID, num );
			}
			MenuMgr.instance.PushMessage( Datas.getArString("Common.Done") );
			MenuMgr.instance.PopMenu( "" );
			MenuMgr.instance.SendNotification( Constant.PvPResponseOk.ReceiveTournamentBonusForAlliance, null );
		}

		private void onNotifyServerOK_TroopRestoreCheck( byte[] rawData ) {
			if( rawData == null ) {
				MenuMgr.instance.SendNotification(Constant.PvPResponseOk.WorldMapTroopRestoreOK,
				                                  null );
				return;
			}
			PBMsgWorldMapUserStatus.PBMsgWorldMapUserStatus d = KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapUserStatus.PBMsgWorldMapUserStatus>(rawData);
			List<PBMsgWorldMapUserStatus.PBMsgWorldMapUserStatus.unit> u = d.data;
			
			string dataString = "";
			foreach( PBMsgWorldMapUserStatus.PBMsgWorldMapUserStatus.unit a in u ) {
				dataString += (dataString==""?"":"_")+a.unitId+"_"+a.num;
			}


			// Notify the dialog
			MenuMgr.instance.SendNotification(Constant.PvPResponseOk.WorldMapTroopRestoreOK,
				                                  dataString );
		}

		private void onNotifyServerOK_TroopRestoreAcquire( byte[] rawData ) {
			if( rawData == null ) {
				return;
			}
			PBMsgWorldMapReturnTroop.PBMsgWorldMapReturnTroop d = KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapReturnTroop.PBMsgWorldMapReturnTroop>(rawData);
			List<PBMsgWorldMapReturnTroop.PBMsgWorldMapReturnTroop.city> cities = d.cityInfo;

			HashObject idNumPairs = new HashObject();


			for( int i = 0; i < cities.Count; ++i ) {
				int cityID = cities[i].cityId;
				List<PBMsgWorldMapReturnTroop.PBMsgWorldMapReturnTroop.unit> troop = cities[i].troop;
				for( int j = 0; j < troop.Count; ++j ) {
					int troopID = troop[j].unitId;
					int num = troop[j].num;
					KBN.BarracksBase.baseSingleton.addUnitsToSeed( troopID, num, cityID );

					string key = ""+troopID;
					if( idNumPairs[key] == null ) {
						idNumPairs[key] = new HashObject();
						idNumPairs[key].Value = "0";
					}
					int curNum = _Global.INT32( idNumPairs[key].Value as string );
					curNum += num;
					idNumPairs[key].Value = ""+curNum;

				}
			}
			string dataString = "";
			string[] keys = _Global.GetObjectKeys( idNumPairs );
			for( int i = 0; i < keys.Length; ++i ) {
				dataString += ( i == 0 ? "" : "_" ) + keys[i] + "_" + ( idNumPairs[keys[i]].Value as string );
			}


			// Notify the dialog
			MenuMgr.instance.SendNotification(Constant.PvPResponseOk.WorldMapTroopRestoreOK,
			                                      dataString );
		}

		private void onNotifyServerOK_TileShareResult( byte[] rawData ) {
			if( rawData == null ) {
				MenuMgr.instance.PushMessage( Datas.getArString("Common.Done") );
				if( m_tileStatusListener != null ) {
					m_tileStatusListener.DynamicInvoke( 1, -1, 0 );
				}
				return;
			}
		}

		private void onNotifyServerOK_TileGiveUpResult( byte[] rawData ) {
			if( rawData == null ) {
			}
			MenuMgr.instance.PushMessage( Datas.getArString("Common.Done") );
			// Hide the tile info popup dialog
			GameObject dlg = GameObject.Find( "TileInfoPopUp" );
			if( dlg != null ) {
				TileInfoPopUp component = dlg.GetComponent<TileInfoPopUp>();
				if( component.isVisible() ){
					component.SetVisible(false);
				}
			}
			// Need to refresh the tiles around
			KBN.GameMain.singleton.repaintWorldMap();
		}
		
		private void onNotifyServerOK_TileBonusResult( byte[] rawData ) {
			if( rawData == null ) {
				return;
			}
			PBMsgWorldMapTileStatus.PBMsgWorldMapTileStatus d = KBN._Global.DeserializePBMsgFromBytes<PBMsgWorldMapTileStatus.PBMsgWorldMapTileStatus>(rawData);
			int tileId = d.tileId;
			int pointTime = d.pointTime;
			long point = d.point;
			int tileLevel = d.tileLevel;
			int tileKind = d.tileKind;
			int userId = d.userId;
			int allianceId = d.allianceId;
			int occupiedTime = d.occupiedTime;
			int shared = d.shared;
			m_tileOccupiedTime = occupiedTime;
			if( m_tileStatusListener != null ) {
				m_tileStatusListener.DynamicInvoke( shared, d.totalMight, d.leftMight );
			}
		}
		
		private void onNotifyServerOK_TournamentResult(byte[] rawData) {
			m_activitySituationChanged = true;
			if( rawData == null ) {
				return;
			}
		}

		private void onNotifyServerOK_TileBattleResult(byte[] rawData) {
			if( rawData == null ) {
				return;
			}
		}



		private void onError(string errorMessage, string errorCode) {}
	}
}