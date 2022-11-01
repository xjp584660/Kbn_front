// SoldierManager.cs
//
// Brief: A singleton class managing all the soldiers on the world map.
// Created: Hong Pan
//
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class SoldierManager : MonoBehaviour {


	//-----------------------------------------------------------------------------------
	// Public Interfaces
	//-----------------------------------------------------------------------------------

	// Because in this situation we don't manage the life-cycle of the soldier
	// ourselves, we just instantiate a solder prefab and return it simply.
	public Soldier activateSoldier( Transform parent, Vector3 from, Vector3 to, bool isReturn, int isWin ) {
		Soldier soldier = allocateSoldier(isReturn, isWin, false);
		if( soldier != null ) {
			soldier.init( parent, from, to );
		}
		return soldier;
	}


	public Soldier activateTransporter( Transform parent, Vector3 from, Vector3 to ) {
		Soldier soldier = allocateTransporter( false );
		if( soldier != null ) {
			soldier.init( parent, from, to );
		}
		return soldier;
	}
	public Soldier activateCollect( Transform parent, Vector3 from, Vector3 to ) {
		Soldier soldier = allocateCollect( false );
		if( soldier != null ) {
			soldier.init( parent, from, to );
		}
		return soldier;
	}

	public Soldier activateCollectRes( Transform parent, Vector3 from, Vector3 to ) {
		Soldier soldier = allocateCollectRes( false );
		if( soldier != null ) {
			soldier.init( parent, from, to );
		}
		return soldier;
	}
	private Soldier allocateCollect( bool createFromScratch ) {
		Soldier soldier = null;
		string prefab = "WorldMap17d3a/Prefab/EffectCollect";
		if( !createFromScratch && m_freeCollects.Count > 0 ) {
			soldier = m_freeCollects[0];
			m_freeCollects.RemoveAt(0);
		}
		if( soldier == null ) {
			soldier = ( Instantiate( Resources.Load( prefab,
			                                        typeof( GameObject ) ) ) as GameObject ).GetComponent< Soldier >();
		}
		soldier.type = Soldier.Type.COLLECT;
		//		Resources.UnloadUnusedAssets();
		return soldier;
	}
	private Soldier allocateCollectRes( bool createFromScratch ) 
	{
		Soldier soldier = null;
		string prefab = "WorldMap17d3a/Prefab/ResourceCollect";
		if( !createFromScratch && m_freeCollectsRes.Count > 0 ) {
			soldier = m_freeCollectsRes[0];
			m_freeCollectsRes.RemoveAt(0);
		}
		if( soldier == null ) {
			soldier = ( Instantiate( Resources.Load( prefab,
			                                        typeof( GameObject ) ) ) as GameObject ).GetComponent< Soldier >();
		}
		soldier.type = Soldier.Type.COLLECT_RES;
		//		Resources.UnloadUnusedAssets();
		return soldier;
	}
	public void recycleSoldier( Soldier soldier ) {
		soldier.gameObject.SetActive( false );
		switch( soldier.type ) {
			case Soldier.Type.ATTACKING:
				m_freeSoldiers.Add( soldier );
				break;
			case Soldier.Type.WINNER:
				m_freeWinnerSoldiers.Add( soldier );
				break;
			case Soldier.Type.LOSER:
				m_freeLoserSoldiers.Add( soldier );
				break;
			case Soldier.Type.TRANSPORTER:
				m_freeTransporters.Add( soldier );
				break;
			case Soldier.Type.COLLECT:
				m_freeCollects.Add( soldier );
				break;
			case Soldier.Type.COLLECT_RES:
				m_freeCollectsRes.Add( soldier );
				break;
		}
	}

	public void cleanup() {
		foreach( Soldier s in m_freeSoldiers ) {
			Destroy(s.gameObject);
		}
		foreach( Soldier s in m_freeWinnerSoldiers ) {
			Destroy(s.gameObject);
		}
		foreach( Soldier s in m_freeLoserSoldiers ) {
			Destroy(s.gameObject);
		}
		foreach( Soldier s in m_freeTransporters ) {
			Destroy(s.gameObject);
		}
		foreach( Soldier s in m_freeCollects ) {
			Destroy(s.gameObject);
		}
		foreach( Soldier s in m_freeCollectsRes ) {
			Destroy(s.gameObject);
		}
	}

	public GameObject activeDefendingCamp( Transform parent ) {
		string prefab = "WorldMap17d3a/Prefab/MarchGroup_defending";
		GameObject go = Instantiate(Resources.Load<GameObject>(prefab)) as GameObject;
		go.transform.parent = parent;
		go.transform.localPosition = Vector3.zero;
		return go;
	}

	// void Awake() {
	// }

	// // Use this for initialization
	// void Start () {
	// 	//createDefaultPool();
	// }


	//-----------------------------------------------------------------------------------
	// Underlying Implementations
	//-----------------------------------------------------------------------------------
	private List<Soldier> m_freeSoldiers = new List<Soldier>();
	private List<Soldier> m_freeWinnerSoldiers = new List<Soldier>();
	private List<Soldier> m_freeLoserSoldiers = new List<Soldier>();
	private List<Soldier> m_freeTransporters = new List<Soldier>();
	private List<Soldier> m_freeCollects = new List<Soldier>();
	private List<Soldier> m_freeCollectsRes = new List<Soldier>();
	
	private static int DEFAULT_POOL_SIZE = 15;
	private static int DEFAULT_POOL_SIZE_OF_TRANSPORTERS = 3;

	private void createDefaultPool() {
		for( int i = 0; i < DEFAULT_POOL_SIZE; ++i ) {
			recycleSoldier( allocateSoldier( false, Constant.MarchResult.UNKNOWN, true ) );
		}
		for( int i = 0; i < DEFAULT_POOL_SIZE_OF_TRANSPORTERS; ++i ) {
			recycleSoldier( allocateTransporter( true ) );
		}
		Resources.UnloadUnusedAssets();
	}

	private Soldier allocateTransporter( bool createFromScratch ) {
		Soldier soldier = null;
		string prefab = "WorldMap17d3a/Prefab/EffectTransport";
		// if( !createFromScratch && m_freeTransporters.Count > 0 ) {
		// 	soldier = m_freeTransporters[0];
		// 	m_freeTransporters.RemoveAt(0);
		// }
		if( soldier == null ) {
			soldier = ( Instantiate( Resources.Load( prefab,
			                                        typeof( GameObject ) ) ) as GameObject ).GetComponent< Soldier >();
		}
		soldier.type = Soldier.Type.TRANSPORTER;
//		Resources.UnloadUnusedAssets();
		return soldier;
	}

	private Soldier allocateSoldier(bool isReturn, int isWin, bool createSoldierFromScratch) {
		bool isLow = KBN._Global.IsLowEndProduct();
		Soldier.Type type = Soldier.Type.ATTACKING;
		string prefab = "WorldMap17d3a/Prefab/MarchGroup";
		Soldier soldier = null;
		switch(isWin) {
		case Constant.MarchResult.UNKNOWN:
			if (isLow) prefab += "_low";
			type = Soldier.Type.ATTACKING;
			// if( !createSoldierFromScratch && m_freeSoldiers.Count > 0 ) {
			// 	soldier = m_freeSoldiers[0];
			// 	m_freeSoldiers.RemoveAt(0);
			// }
			break;
		case Constant.MarchResult.LOSE:
			prefab += "_lose";
			type = Soldier.Type.LOSER;
			// if( !createSoldierFromScratch && m_freeLoserSoldiers.Count > 0 ) {
			// 	soldier = m_freeLoserSoldiers[0];
			// 	m_freeLoserSoldiers.RemoveAt(0);
			// }
			 break;
		case Constant.MarchResult.WIN:
			prefab += "_win";
			if (isLow) prefab += "_low";
			type = Soldier.Type.WINNER;
			// if( !createSoldierFromScratch && m_freeWinnerSoldiers.Count > 0 ) {
			// 	soldier = m_freeWinnerSoldiers[0];
			// 	m_freeWinnerSoldiers.RemoveAt(0);
			// }
			break;
		}
		if( soldier == null ) {
			soldier =  (Instantiate(Resources.Load<GameObject>( prefab))as GameObject).GetComponent< Soldier >();
		}
		soldier.type = type;
//		Resources.UnloadUnusedAssets();
		soldier.isReturn = isReturn;
//		m_innerCounter++;
		return soldier;
	}
}