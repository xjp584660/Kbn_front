//#define USE_TEST_ANIMATIONS

using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class AvaMapAnimMgr : MonoBehaviour {

	public GameObject MARCH_ANIMATION_PREFAB;

	public Vector3 troopOffset = new Vector3(-2, 2, -2);

	public static AvaMapAnimMgr getInstance() {
		return s_singleton;
	}

#if USE_TEST_ANIMATIONS
	private List<AvaBaseMarch> CREATE_TEST_ANIMATIONS() {
		List<AvaBaseMarch> l = new List<AvaBaseMarch>();
		PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo i = new PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo();
		i.marchId = 1;
		i.fromXCoord = 10;
		i.fromYCoord = 10;
		i.toXCoord = 1;
		i.toYCoord = 1;
		i.marchTimestamp = (int)GameMain.unixtime();
		i.destinationEta = (int)GameMain.unixtime() + 60*5;
		i.marchStatus = Constant.AvaMarchStatus.OUTBOUND;
		l.Add( new AvaBaseMarch( i ) );

		i = new PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo();
		i.marchId = 2;
		i.fromXCoord = 10;
		i.fromYCoord = 10;
		i.toXCoord = 20;
		i.toYCoord = 1;
		i.marchTimestamp = (int)GameMain.unixtime();
		i.destinationEta = (int)GameMain.unixtime() + 60*5;
		i.marchStatus = Constant.AvaMarchStatus.OUTBOUND;
		l.Add( new AvaBaseMarch( i ) );

		i = new PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo();
		i.marchId = 3;
		i.fromXCoord = 10;
		i.fromYCoord = 10;
		i.toXCoord = 1;
		i.toYCoord = 20;
		i.marchTimestamp = (int)GameMain.unixtime();
		i.destinationEta = (int)GameMain.unixtime() + 60*5;
		i.marchStatus = Constant.AvaMarchStatus.OUTBOUND;
		l.Add( new AvaBaseMarch( i ) );

		i = new PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo();
		i.marchId = 4;
		i.fromXCoord = 10;
		i.fromYCoord = 10;
		i.toXCoord = 20;
		i.toYCoord = 20;
		i.marchTimestamp = (int)GameMain.unixtime();
		i.destinationEta = (int)GameMain.unixtime() + 60*5;
		i.marchStatus = Constant.AvaMarchStatus.OUTBOUND;
		l.Add( new AvaBaseMarch( i ) );
		return l;
	}
#endif // USE_TEST_ANIMATIONS

	public void init() {
#if USE_TEST_ANIMATIONS
		m_testData = CREATE_TEST_ANIMATIONS();
#endif // USE_TEST_ANIMATIONS
	}

	public void toFront() {
		foreach( DictionaryEntry de in m_marchAnims ) {
			GameObject a = de.Value as GameObject;
			MapMoveAnim sc = a.GetComponent<MapMoveAnim>();
			sc.toFront();
		}
	}

	public void toBack() {
		foreach( DictionaryEntry de in m_marchAnims ) {
			GameObject a = de.Value as GameObject;
			MapMoveAnim sc = a.GetComponent<MapMoveAnim>();
			sc.toBack();
		}
	}

	public void setTileWH( float xorg, float yorg, float width, float height ) {
		m_tileWorldWidth = width;
		m_tileWorldHeight = height;
		m_xOrg = xorg;
		m_yOrg = yorg;
		m_isInitDone = true;
	}

	public void cleanUpAll() {
		// Table-1
		foreach( DictionaryEntry de in m_marchAnims ) {
			GameObject a = de.Value as GameObject;
			MapMoveAnim sc = a.GetComponent<MapMoveAnim>();
			sc.onDelete();
			Destroy( a );
		}
		m_marchAnims.Clear();
		m_marchAnimsLastState.Clear();
		// Table-2
		cleanUpFollowedMarchLines();
	}

	public void cleanUpFollowedMarchLines() {
		foreach( DictionaryEntry de in m_marchAnims2 ) {
			GameObject a = de.Value as GameObject;
			MapMoveAnim sc = a.GetComponent<MapMoveAnim>();
			sc.onDelete();
			Destroy( a );
		}
		m_marchAnims2.Clear();
	}

	void Awake() {
		s_singleton = this;
	}

	void Update() {
		if( !m_isInitDone )
			return;

		if( GameMain.singleton == null )
			return;



		List<AvaBaseMarch> l = GameMain.Ava.March.GetMyMarchList();
#if USE_TEST_ANIMATIONS
		l = m_testData;
#endif // USE_TEST_ANIMATIONS

		checkDelete( l );
		bool updateLeftTime = false;
		// Use the following scheme to make the troop move
		// smoothly along the path although it's updating on
		// a second basis.
		if( m_lastUnixTime != GameMain.unixtime() ) {
			m_lastUnixTime = GameMain.unixtime();
			updateLeftTime = true;
		}

		for( int i = 0; i < l.Count; i++ ) {

			PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo info = l[i].MarchData;
			updateAnimation( m_marchAnims, info.marchId, info.marchType,
			                info.fromXCoord, info.fromYCoord,
			                info.toXCoord, info.toYCoord, info.toTileType, l[i].MarchData.marchStatus,
			                info.destinationEta, info.marchTimestamp, info.returnEta, info.isWin,
			                updateLeftTime, info.oneWaySecond, null, m_marchAnimsLastState );
		}

		// Followed march lines
		MapController mc = GameMain.singleton.getMapController2();
		if( mc != null ) {
			PBMsgAVATileMarchLineList.PBMsgAVATileMarchLineList l2 = mc.avaImp.FollowedMarchLines;
			if( l2 != null ) {
				checkDelete2( l2 );

				for( int i = 0; i < l2.marchLineList.Count; ++i ) {
					updateAnimation( m_marchAnims2, l2.marchLineList[i].marchId, Constant.MarchType.ATTACK,
					                l2.marchLineList[i].fromXCoord, l2.marchLineList[i].fromYCoord,
					                l2.marchLineList[i].toXCoord, l2.marchLineList[i].toYCoord,
					                Constant.TileType.TILE_TYPE_AVA_WONDER,
					                Constant.AvaMarchStatus.OTHERS_MARCH_LINE,
					                l2.marchLineList[i].endTime,
					                l2.marchLineList[i].startTime,
					                0, l2.marchLineList[i].isWin, updateLeftTime, l2.marchLineList[i].endTime - l2.marchLineList[i].startTime, m_marchAnims, null );
				}
			}
		}
	}

	private void updateAnimation( Hashtable hashtable, int marchId, int marchType, int fromXCoord, int fromYCoord,
	                             int toXCoord, int toYCoord, int toTileType, int marchStatus,
	                             int destinationEta, int marchTimestamp, int returnEta, int isWin,
	                             bool updateLeftTime, int oneWaySeconds, Hashtable returnIfExistsInThis,
	                             Hashtable lastState ) {
		if( marchId == 0 ) {
			return;
		}

		if( returnIfExistsInThis != null ) {
			if( returnIfExistsInThis.Contains( marchId ) ) {
				return;
			}
		}

		GameObject theAnim;
		bool updateLeftTimeForThisOne = false;
		
		// Add one if necessary
		if( !hashtable.Contains( marchId ) ) { // The animation doesn't exist, need to create one.
			
			theAnim = Instantiate( MARCH_ANIMATION_PREFAB ) as GameObject;
			hashtable.Add( marchId, theAnim );
			updateLeftTimeForThisOne = true;
		} else {
			theAnim = hashtable[marchId] as GameObject;
		}
		theAnim.SetActive( true );
		
		// Handle its state
		MapMoveAnim sc = theAnim.GetComponent<MapMoveAnim>();
		sc.setMarchType( marchType );
		sc.setMarchid( marchId );
		sc.IsAVA = true;
		
		MapMoveAnim.DestType destType = MapMoveAnim.DestType.TILE_1x1;
		if( toTileType == Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER || 
		          ( toTileType >= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER1 &&
		          toTileType <= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER4 ) ) {
			destType = MapMoveAnim.DestType.TILE_2x2;
		}
		int status = marchStatus;
		float totalTime = oneWaySeconds;
		int endTime = destinationEta;

		switch( status ) {

		case Constant.AvaMarchStatus.OTHERS_MARCH_LINE:
			if( isWin >= 0 && isWin <= 2 ) {
				// isWin brief:
				// 0 - Defender wins
				// 1 - Attacker wins
				// 2 - Defender wins
				sc.setMoveState( MapMoveAnim.MoveState.Returning, destType, (isWin!=1)?Constant.MarchResult.LOSE:Constant.MarchResult.WIN);
			} else { // isWin 3 - Return
				sc.setMoveState( MapMoveAnim.MoveState.Returning, destType, Constant.MarchResult.UNKNOWN);
			}
			break;

		case Constant.AvaMarchStatus.OUTBOUND:
			sc.setMoveState( MapMoveAnim.MoveState.Moving, destType );
			break;
			
		case Constant.AvaMarchStatus.DEFENDING:
			sc.setMoveState(MapMoveAnim.MoveState.Defending, destType);
			break;
			
		case Constant.AvaMarchStatus.SITUATION_CHANGED:
		case Constant.AvaMarchStatus.RETURNING:

			if( isWin >= 0 && isWin <= 2 ) {
				// isWin brief:
				// 0 - Defender wins
				// 1 - Attacker wins
				// 2 - Defender wins
				sc.setMoveState( MapMoveAnim.MoveState.Returning, destType, (isWin!=1)?Constant.MarchResult.LOSE:Constant.MarchResult.WIN);
			} else { // isWin 3 - Return
				sc.setMoveState( MapMoveAnim.MoveState.Returning, destType, Constant.MarchResult.UNKNOWN);
			}
			endTime = returnEta;
			// Swap the source and destination points
			int tmp = toXCoord;
			toXCoord = fromXCoord;
			fromXCoord = tmp;
			tmp = toYCoord;
			toYCoord = fromYCoord;
			fromYCoord = tmp;
			break;

		case Constant.AvaMarchStatus.WAITING_FOR_REPORT:
			sc.setMoveState( MapMoveAnim.MoveState.Fighting, destType );
			break;
			
		case Constant.AvaMarchStatus.DELETED:
		case Constant.AvaMarchStatus.INACTIVE:
		default:
			theAnim.SetActive( false );
			break;
		}

		sc.setToCoor( toXCoord, toYCoord );


		if( totalTime < 0.01f ) { // Avoid division by zero unexpectedly
			totalTime = 0.01f;
		}
		Vector2 ver = new Vector2( ( toXCoord - fromXCoord ) / totalTime ,
		                          ( toYCoord - fromYCoord ) / totalTime );

		// Last state check...
		// Make sure when a march state changes, recalculate its left time
		// immediately.
		if( lastState != null ) {
			if( lastState.Contains( marchId ) ) {
				int theStatus = ( lastState[marchId] as IntegerWrapper ).m_i;
				if( theStatus != status ) {
					updateLeftTimeForThisOne = true;
					IntegerWrapper i = new IntegerWrapper( status );
					lastState[marchId] = i;
				}

			} else {
				IntegerWrapper i = new IntegerWrapper( status );
				lastState.Add( marchId, i );
			}
		}


		// Check if needs updating the left time
		if( updateLeftTime || updateLeftTimeForThisOne ) {
			sc.LeftTime = endTime - GameMain.unixtime();
		}
		sc.LeftTime -= Time.deltaTime;
		if( sc.LeftTime < 0 ) {
			sc.LeftTime = 0;
		}
		
		float coorX = toXCoord - sc.LeftTime * ver.x;
		float coorY = toYCoord - sc.LeftTime * ver.y;
		
		if( status == Constant.MarchStatus.DEFENDING ) {
			coorX = toXCoord;
			coorY = toYCoord;
		}
		theAnim.transform.position = new Vector3( m_xOrg + m_tileWorldWidth*(coorX-1) + m_tileWorldWidth * 0.5f, 
		                                         0, 
		                                         m_yOrg - m_tileWorldHeight*(coorY-1) + m_tileWorldHeight * 0.5f ) 
			+ troopOffset;
		
		float fromX = m_xOrg + m_tileWorldWidth * ( fromXCoord - 1 ) + m_tileWorldWidth * 0.5f;
		float fromZ = m_yOrg - m_tileWorldHeight * ( fromYCoord - 1 ) + m_tileWorldHeight * 0.5f;
		float toX = m_xOrg + m_tileWorldWidth * ( toXCoord - 1 ) + m_tileWorldWidth * 0.5f;
		float toZ = m_yOrg - m_tileWorldHeight * ( toYCoord - 1 ) + m_tileWorldHeight * 0.5f;
		sc.setTileFromTo( fromXCoord, fromYCoord, toXCoord, toYCoord );
		sc.setFromTo( new Vector3( fromX, 0f, fromZ ) + troopOffset,
		             new Vector3( toX, 0f, toZ ) + troopOffset );
	}

	private void checkDelete( List<AvaBaseMarch> l ) {
		
		foreach( DictionaryEntry de in m_marchAnims ) {
			int a = KBN._Global.INT32( de.Key );
			bool inUse = false;
			for( int i = 0; i < l.Count; i++ ) {
				if( a == l[i].MarchData.marchId ) {
					inUse = true;
					break;
				}
			}
			if( !inUse ) {
				m_deleteList.Add( a );
			}
		}
		
		for( int i = 0; i < m_deleteList.Count; ++i ) {
			int id = m_deleteList[i];
			GameObject a = m_marchAnims[id] as GameObject;
			MapMoveAnim sc = a.GetComponent<MapMoveAnim>();
			sc.onDelete();
			m_marchAnims.Remove( id );
			Destroy( a );
		}
		m_deleteList.Clear();
	}

	private void checkDelete2( PBMsgAVATileMarchLineList.PBMsgAVATileMarchLineList l ) {

		long now = KBN.GameMain.unixtime();
		foreach( DictionaryEntry de in m_marchAnims2 ) {
			int id = KBN._Global.INT32( de.Key );
			bool inUse = false;
			int indexFound = -1;
			for( int i = 0; i < l.marchLineList.Count; i++ ) {
				if( id == l.marchLineList[i].marchId ) {
					indexFound = i;
					if( now < l.marchLineList[i].endTime ) {
						inUse = true;
					}
					break;
				}
			}
			if( !inUse ) {
				m_deleteList.Add( id );
				if( indexFound != -1 ) {
					l.marchLineList.RemoveAt(indexFound);
				}
			}
		}
		
		for( int i = 0; i < m_deleteList.Count; ++i ) {
			int id = m_deleteList[i];
			GameObject a = m_marchAnims2[id] as GameObject;
			MapMoveAnim sc = a.GetComponent<MapMoveAnim>();
			sc.onDelete();
			m_marchAnims2.Remove( id );
			Destroy( a );
		}
		m_deleteList.Clear();
	}

	private class IntegerWrapper {
		public IntegerWrapper( int i ) { m_i = i; }
		public int m_i;
	};

	private long m_lastUnixTime;
	private bool m_isInitDone;
	private	float m_xOrg;
	private	float m_yOrg;
	private	float m_tileWorldWidth;
	private	float m_tileWorldHeight;
	private List<int> m_deleteList = new List<int>();
	private Hashtable m_marchAnims = new Hashtable();
	private Hashtable m_marchAnims2 = new Hashtable();
	private Hashtable m_marchAnimsLastState = new Hashtable();

	private List<AvaBaseMarch> m_testData;
	private static AvaMapAnimMgr s_singleton;
}
