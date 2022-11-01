// MarchEffectManager.cs
//
// Brief: Manages the effect animations of march,
//		like fighting, defending, etc.
// Created: Hong Pan
//
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class MarchEffectManager : MonoBehaviour {


	//-----------------------------------------------------------------------------------
	// Public Interfaces
	//-----------------------------------------------------------------------------------
	public class EffectOnDiffStages {

		public enum Stage {
			FIRING_IN_SLIGHT_FORCE = 0,
			FIRING_IN_GREAT_FORCE,
			BURNING_FIERCELY,
			SMOKING_AND_RUINING,
			VANISHED,
		};

		public EffectOnDiffStages( GameObject go, bool is2x2 ) {
			m_go = go;
			m_go.name = "GO_EffectOnDiffStage";
			m_is2x2 = is2x2;
		}
		public void cleanup() {
			if( m_go != null ) {
				m_go.transform.parent = null;
			   	Destroy( m_go );
			}
		}

		public void setParent( Transform parent ) {
			if( m_go ) {
				m_go.transform.parent = parent;
			}
		}

		public void setLocalPos( Vector3 localPos ) {
			if( m_go ) {
				m_go.transform.localPosition = localPos;
			}
		}

		public bool isFree() { return m_isFree; }
		public void release() { m_isFree = true; hideAll(); setParent( null ); }
		public void setTileID( int tileID ) { m_tileID = tileID; }
		public int getTileID() { return m_tileID; }

		public void reserve() {
			m_isFree = false;
			m_lastUpdateTime = KBN.GameMain.unixtime();
		}

		public long getLastUpdateTime() {
			return m_lastUpdateTime;
		}


		public void setStage( Stage stage ) {
			if( stage == Stage.FIRING_IN_SLIGHT_FORCE ) {
				show( "Particle1" );
			} else if( stage == Stage.FIRING_IN_GREAT_FORCE ) {
				show( "Particle2" );
			} else if( stage == Stage.BURNING_FIERCELY ) {
				show( "Particle3" );
			} else if( stage == Stage.SMOKING_AND_RUINING ) {
				show( "Particle4" );
			} else {
				hideAll();
			}
		}
		private void hideAll() {
			if( m_go != null ) {
				m_go.active = false;
				Transform[] trans = m_go.GetComponentsInChildren<Transform>( true );
				foreach( Transform t in trans ) {
					t.gameObject.active = false;
				}
			}
		}
		private void show( string subGOName ) {
			hideAll();
			if( m_go ) {
				m_go.active = true;
				Transform go = m_go.transform.Find( subGOName );
				if( go != null ) {
					go.gameObject.SetActiveRecursively( true );
//					go.localRotation = Quaternion.Euler( 320f, 45f, 0f );
					if( m_is2x2 ) {
						go.localPosition = new Vector3( 1.38f, 2.91f, 0.16f );
					} else {
						go.localPosition = new Vector3( 0.0f, 2.0f, 0.2f );
					}
				}
			}
		}

		private GameObject m_go;
		private bool m_isFree;
		private int m_tileID;
		private long m_lastUpdateTime;
		private bool m_is2x2;
	};

	public enum Type {
		UNKNOWN,
		FIGHTING_CITY_1x1,
		FIGHTING_TILE_1x1,
		FIGHTING_TILE_2x2,
		FIGHTING_CITY_1x1_STAGES,
		FIGHTING_TILE_1x1_STAGES,
		FIGHTING_TILE_2x2_STAGES,
		DEFENDING,
		SURVEY,
	};



	public EffectOnDiffStages activateEffectOnDiffStages( Type type, Transform parent, Vector3 localPos, EffectOnDiffStages.Stage initialStage, int tileID ) {
		string key = ""+tileID;
		hideEffectOnCertainTile( key );
		if( m_tile2EffectMap[key] == null ) {
			m_tile2EffectMap[key] = new HashObject();
		}

		for( int i = 0; i < m_effectsOnDiffStages.Count; ++i ) {
			if( m_effectsOnDiffStages[i].isFree() ) {
				m_effectsOnDiffStages[i].reserve();
				m_effectsOnDiffStages[i].setParent( parent );
				m_effectsOnDiffStages[i].setStage( initialStage );
				m_effectsOnDiffStages[i].setLocalPos( localPos );

				m_tile2EffectMap[key].Value = m_effectsOnDiffStages[i];
				return m_effectsOnDiffStages[i];
			}
		}

		GameObject go = activateEffect( parent, type );
		bool is2x2 = ( type == Type.FIGHTING_TILE_2x2 ) || ( type == Type.FIGHTING_TILE_2x2_STAGES );
		EffectOnDiffStages a = new EffectOnDiffStages( go, is2x2 );
		a.setParent( parent );
		a.reserve();
		a.setStage( initialStage );
		a.setLocalPos( localPos );
		m_effectsOnDiffStages.Add( a );

		m_tile2EffectMap[key].Value = a;
		return a;
	}




	public void cleanupAllEffectOnStages() {
		for( int i = 0; i < m_effectsOnDiffStages.Count; ++i ) {
			m_effectsOnDiffStages[i].cleanup();
		}
		m_effectsOnDiffStages.Clear();
		m_tile2EffectMap = new HashObject();
	}

	public GameObject activateEffect( Transform parent, Type type ) {
		string pathName = null;
		bool isTransport = false;
		string name = "not_transport";
		switch( type ) {
			case Type.FIGHTING_CITY_1x1: {
			pathName = "WorldMap17d3a/Prefab/MarchEffect_CityAttack";
					break;
				}
			case Type.FIGHTING_TILE_1x1: {
			pathName = "WorldMap17d3a/Prefab/MarchEffect_TileAttack1x1";
					break;
				}
			case Type.FIGHTING_TILE_2x2: {
			pathName = "WorldMap17d3a/Prefab/MarchEffect_TileAttack2x2";
				break;
			}
			case Type.FIGHTING_CITY_1x1_STAGES: {
				pathName = "WorldMap17d3a/Prefab/MarchEffect_CityAttackStages";
				break;
			}
			case Type.FIGHTING_TILE_1x1_STAGES: {
				pathName = "WorldMap17d3a/Prefab/MarchEffect_TileAttack1x1Stages";
				break;
			}
			case Type.FIGHTING_TILE_2x2_STAGES: {
				pathName = "WorldMap17d3a/Prefab/MarchEffect_TileAttack2x2Stages";
				break;
			}
			case Type.SURVEY: {
				pathName = "WorldMap17d3a/Prefab/EffectSurvey";
				break;
			}
		}
		if( pathName == null ) {
			return null;
		}

		GameObject go = Instantiate( Resources.Load( pathName, typeof( GameObject ) ) ) as GameObject;
		Resources.UnloadUnusedAssets();


		go.transform.parent = parent;
		go.name = name;


		switch( type ) {
			case Type.FIGHTING_TILE_2x2: {
				go.transform.localPosition = new Vector3( 1.48f, 0.0f, -0.4f );
				break;
			}
			case Type.FIGHTING_TILE_2x2_STAGES: {
				go.transform.localPosition = new Vector3( 0.95f, 0f, -1.16f );
				break;
			}
			case Type.SURVEY: {
				parent.transform.localRotation = Quaternion.Euler( 0f, 0f, 0f );
				go.transform.localPosition = new Vector3( 0f, -0.6f, 0f );
				go.transform.localRotation = Quaternion.Euler( 8f, 24.57f, 0f );
				go.transform.localScale = new Vector3( 1.5f, 1.5f, 1.5f );
				break;
			}
			default: {
				go.transform.localPosition = Vector3.zero;
				break;
			}
		}
		return go;
	}

	public static MarchEffectManager instance() {
		return m_singleton;
	}


	void Awake() {
		m_singleton = this;
	}

	// Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
		freeAllEffectOnStagesHint();
	}


	//-----------------------------------------------------------------------------------
	// Underlying Implementations
	//-----------------------------------------------------------------------------------
	private static MarchEffectManager m_singleton;

	private static int FREE_TIME_THRESHOLD = 50; // Seconds

	private List< EffectOnDiffStages > m_effectsOnDiffStages = new List< EffectOnDiffStages >();
	private HashObject m_tile2EffectMap = new HashObject();

	private void freeAllEffectOnStagesHint() {
		
		long now = KBN.GameMain.unixtime();
		ArrayList a = new ArrayList();
		
		for( int i = 0; i < m_effectsOnDiffStages.Count; ++i ) {
			if( !m_effectsOnDiffStages[i].isFree() ) {
				if( now - m_effectsOnDiffStages[i].getLastUpdateTime() >= FREE_TIME_THRESHOLD ) {
					a.Add( m_effectsOnDiffStages[i] );
				}
			}
		}
		foreach( EffectOnDiffStages e in a ) {
			e.release();
		}
	}

	private void hideEffectOnCertainTile( string key ) {
		if( m_tile2EffectMap[key] != null ) {
			EffectOnDiffStages effect = m_tile2EffectMap[key].Value as EffectOnDiffStages;
			if( !effect.isFree() ) {
				effect.release();
			}
		}
	}
}