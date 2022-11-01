using UnityEngine;
using System.Collections;

public class AvaTileProtectionTimeHUDMgr : MonoBehaviour {

	//-----------------------------------------------------------------------------------
	// Public Interfaces
	//-----------------------------------------------------------------------------------
	public int OFFSET_Y = -88;
	public GameObject PROTECTION_COVER_PREFAB;

	public void deactivateTileProtectionHUD( string name ) {
		remove( name );
	}
	public void activateTileProtectionHUD( string name, Vector3 tilePos, long time, bool is2x2, bool showTime ) {
		AvaTileProtectionTimeHUD hud = findHUD( name );
		if( hud == null ) {
			// 
			Pair newPair = new Pair();
			newPair.m_tilePos = tilePos;
			GameObject go = Instantiate( Resources.Load( "WorldMap17d3a/Prefab/AVATileProtectionHUD", typeof( GameObject ) ) ) as GameObject;
			go.name = "AVATileProtectionHUD";
			newPair.m_hud = go.GetComponent<AvaTileProtectionTimeHUD>();
			newPair.m_time = time;
			newPair.m_cover = ( Instantiate( PROTECTION_COVER_PREFAB ) as GameObject ).transform;
			newPair.m_hud.protection = newPair.m_cover.gameObject;
			newPair.m_cover.position = tilePos + Vector3.up * 1.45f;
			Vector3 scale = new Vector3( 0.25f, 1f, 0.35f );
			if(is2x2)
			{
				scale *= 2;
			}
			newPair.m_cover.localScale = scale;
			m_table.Add( name, newPair );
			KBN._Global.LogWarning("AvaTileProtectionTimeHUDMgr.activateTileProteftionHUD  name: " + name);
			hud = newPair.m_hud;
		}
		hud.Time = time;
		hud.Is2x2 = is2x2;
		hud.SetVisible( showTime );
	}
	public void setTileWH( float w, float h ) {
		m_tileWidth = w;
		m_tileHeight = h;
	}
	
	public void cleanup() {
		foreach( DictionaryEntry de in m_table ) {
			Pair p = de.Value as Pair;
			Destroy( p.m_hud.gameObject );
			Destroy( p.m_cover.gameObject );
		}
		m_table.Clear();
	}
	
	public static AvaTileProtectionTimeHUDMgr getInstance() {
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
			Vector3 screenPoint = m_camera.WorldToScreenPoint( worldPos );
			p.m_hud.rect.x = screenPoint.x - p.m_hud.m_labelBG.rect.width / 2;
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
	private static AvaTileProtectionTimeHUDMgr s_singleton;
	private class Pair {
		public Vector3 m_tilePos;
		public AvaTileProtectionTimeHUD m_hud;
		public long m_time;
		public Transform m_cover;
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
			if( now > p.m_time ) {
				a.Add( de.Key );
			}
		}
		foreach( string s in a ) {
			remove( s );
		}
	}
	private void remove( string name ) {
		if( m_table.Contains( name ) ) {
			Pair p = m_table[name] as Pair;
			Destroy( p.m_hud.gameObject );
			Destroy( p.m_cover.gameObject );
			m_table.Remove( name );
		}
	}
	private AvaTileProtectionTimeHUD findHUD( string name ) {
		string key = name; // Name is the key
		if( m_table.Contains( key ) ) {
			Pair p = m_table[key] as Pair;
			return p.m_hud;
		}
		return null;
	}
}
