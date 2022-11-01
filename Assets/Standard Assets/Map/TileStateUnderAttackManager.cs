// TileStateUnderAttackManager.cs
//
// Brief: Manages the tile state HUD.
// Created: Hong Pan
//
using UnityEngine;
using System.Collections;

public class TileStateUnderAttackManager : MonoBehaviour {

	//-----------------------------------------------------------------------------------
	// Public Interfaces
	//-----------------------------------------------------------------------------------
	public int OFFSET_Y = -88;
	public void activateTileStateHUD( string name, Vector3 tilePos, long curHP, long maxHP, bool is2x2 ) {
		TileStateUnderAttackHUD hud = findHUD( name );
		if( hud == null ) {
			// 
			Pair newPair = new Pair();
			newPair.m_tilePos = tilePos;
			GameObject go = Instantiate( Resources.Load( "WorldMap17d3a/Prefab/TileStateUnderAttack", typeof( GameObject ) ) ) as GameObject;
			go.name = "TileStateUnderAttackHUD";
			newPair.m_hud = go.GetComponent<TileStateUnderAttackHUD>();
			newPair.m_lastUpdateTime = KBN.GameMain.unixtime();
			m_table.Add( name, newPair );
			hud = newPair.m_hud;
		}

		hud.MaxHP = maxHP;
		hud.CurHP = curHP;
		hud.Is2x2 = is2x2;
	}
	public void setTileWH( float w, float h ) {
		m_tileWidth = w;
		m_tileHeight = h;
	}
	
	public void cleanup() {
		foreach( DictionaryEntry de in m_table ) {
			Pair p = de.Value as Pair;
			Destroy( p.m_hud.gameObject );
		}
		m_table.Clear();
	}

	public static TileStateUnderAttackManager getInstance() {
		return s_singleton;
	}
	public void Awake() {
		s_singleton = this;
		GameObject go = GameObject.Find("mapCamera");
		if( go == null ) {
			go = GameObject.Find("mapCamera2");
		}
		m_camera = go.GetComponent<Camera>();
	}

	public void Update() {
		if( m_table.Count == 0 ) {
			return;
		}
		
		WorldMapCamSwitch camSwitch = m_camera.GetComponent<WorldMapCamSwitch>();
		camSwitch.SwitchOn();
		foreach( DictionaryEntry de in m_table ) {
			Pair p = de.Value as Pair;
			Vector3 worldPos = new Vector3( p.m_tilePos.x + HUD_OFFSET_X,
			                               p.m_tilePos.y,
			                               p.m_tilePos.z + HUD_OFFSET_Z );
			if( p.m_hud.Is2x2 ) {
				worldPos.x += m_tileWidth / 2;
				worldPos.z -= m_tileHeight / 2;
			}
			Vector3 screenPoint = m_camera.WorldToScreenPoint( worldPos );
			p.m_hud.rect.x = screenPoint.x - p.m_hud.MaxFillingWidth / 2;
			p.m_hud.rect.y = Screen.height - screenPoint.y + OFFSET_Y;
		}
		camSwitch.SwitchOff();

		cleanupHint();
	}
	//-----------------------------------------------------------------------------------
	// Underlying Implementations
	//-----------------------------------------------------------------------------------
	[SerializeField] private float HUD_OFFSET_X = 0.35f;
	[SerializeField] private float HUD_OFFSET_Z = 0.64f;
	private static int CLEANUP_TIME_THRESHOLD = 50; // Seconds
	private static TileStateUnderAttackManager s_singleton;
	private class Pair {
		public Vector3 m_tilePos;
		public TileStateUnderAttackHUD m_hud;
		public long m_lastUpdateTime;
	};
	private Hashtable m_table = new Hashtable();
	private Camera m_camera;
	private float m_tileWidth;
	private float m_tileHeight;

	private void cleanupHint() {
		long now = KBN.GameMain.unixtime();
		ArrayList a = new ArrayList();
		foreach( DictionaryEntry de in m_table ) {
			Pair p = de.Value as Pair;
			if( now - p.m_lastUpdateTime >= CLEANUP_TIME_THRESHOLD ) {
				a.Add( de.Key );
			}
		}
		foreach( string s in a ) {
			remove( s );
		}
	}
	private void remove( string name ) {
		if( m_table.Contains( name) ) {
			Pair p = m_table[name] as Pair;
			Destroy( p.m_hud.gameObject );
			m_table.Remove( name );
		}
	}
	private TileStateUnderAttackHUD findHUD( string name ) {
		string key = name; // Name is the key
		if( m_table.Contains( key ) ) {
			Pair p = m_table[key] as Pair;
			p.m_lastUpdateTime = KBN.GameMain.unixtime();
			return p.m_hud;
		}
		return null;
	}
}