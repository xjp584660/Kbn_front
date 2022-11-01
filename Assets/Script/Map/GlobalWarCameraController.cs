using UnityEngine;
using System.Collections;

public class GlobalWarCameraController : MonoBehaviour {


	// Grid
	public MapGrid m_grid;

	// OP
	private bool m_isDragging = false;
	private float m_mouseXOnClick;
	private float m_mouseYOnClick;
	private Vector2 m_lastCameraPos = new Vector2();
	private ArrayList m_clouds = new ArrayList();

	// Layers
	private Transform m_layerRoot;
	private Transform[,,] m_tiles;
	private Vector2 m_boundaryLeftTop;
	private Vector2 m_boundaryRightBottom;
	//private Vector2 m_lastBGLayerPos;
	//private Transform[] m_tempHTiles; // Used for swapping tiles internally
	private Transform[] m_tempVTiles;
	
	// Constants
	private float SCREEN2WORLD_FACTOR = 0.01f;
	private float CLOUD_MOVING_SPEED = 0.001f;


	private float LAYER_TILE_SIZE = 3.0f;
	private int TILE_SHOW_COLS = 3;
	private int TILE_SHOW_ROWS = 3;



	private static bool MACRO_OP_MOVE_CAMERA = false;


	// Use this for initialization
	void Start () {
		GameObject layerBG = GameObject.Find( "Layer_Background" );
		if( layerBG == null ) {
			return;
		}
		m_layerRoot = layerBG.transform;
		saveLastCameraPos();
		// Clouds
		int cloudIndex = 1;
		GameObject cloud;
		do {
			cloud = GameObject.Find( "cloud" + cloudIndex++ );
			if( cloud != null )
				m_clouds.Add( cloud );
		}while( cloud != null );

		// Tiles
		m_tiles = new Transform[3, TILE_SHOW_ROWS, TILE_SHOW_COLS];
		for( int i = 0; i < TILE_SHOW_ROWS; ++i ) {
			for( int j = 0; j < TILE_SHOW_COLS; ++j ) {
				int index = i*TILE_SHOW_COLS+j;
				m_tiles[0,i,j] = m_layerRoot.Find("texture_ground_00"+index);
				m_tiles[1,i,j] = m_layerRoot.Find("gaoguang_00"+index);
				m_tiles[2,i,j] = m_layerRoot.Find("yinying_00"+index);
			}
		}
		Transform bound = GameObject.Find( "BoundaryLeftTop" ).transform;
		m_boundaryLeftTop = new Vector2( bound.position.x, bound.position.z );
		bound = GameObject.Find( "BoundaryRightBottom" ).transform;
		m_boundaryRightBottom = new Vector2( bound.position.x, bound.position.z );
		//m_tempHTiles = new Transform[TILE_SHOW_COLS];
		m_tempVTiles = new Transform[TILE_SHOW_ROWS];
		//m_lastBGLayerPos = new Vector2( m_layerRoot.localPosition.x, m_layerRoot.localPosition.z );
		// Render queue
		GetComponent<Camera>().transparencySortMode = TransparencySortMode.Orthographic;
	}
	
	// Update is called once per frame
	void Update () {
		Vector3 pos = gameObject.transform.position;
		gameObject.transform.position = pos;


		if( Input.GetMouseButtonDown( 0 ) ) {
			onMouseDown();
		}
		else if( Input.GetMouseButtonUp( 0 ) ) {
			onMouseUp();
		}

		if( m_isDragging ) {
			float xDiff = m_mouseXOnClick - Input.mousePosition.x;
			float yDiff = m_mouseYOnClick - Input.mousePosition.y;
			if( Mathf.Abs( xDiff ) > Mathf.Epsilon ||
			   Mathf.Abs( yDiff ) > Mathf.Epsilon ) {
				onMouseMove( xDiff, yDiff );
				m_mouseXOnClick = Input.mousePosition.x;
				m_mouseYOnClick = Input.mousePosition.y;
				saveLastCameraPos();
			}
		}


		updateClouds();
	}


	void updateClouds() {
		foreach( GameObject cloud in m_clouds ) {
			Vector3 pos = cloud.transform.position;
			pos.z += CLOUD_MOVING_SPEED;
			cloud.transform.position = pos;
		}
	}



	void saveLastCameraPos() {
/*#*/if( MACRO_OP_MOVE_CAMERA ) {
		m_lastCameraPos.x = gameObject.transform.position.x;
		m_lastCameraPos.y = gameObject.transform.position.z;
/*#*/} else {
		m_lastCameraPos.x = m_layerRoot.localPosition.x;
		m_lastCameraPos.y = m_layerRoot.localPosition.z;
/*#*/}
	}

	void updatePosition( Transform trans, float dx, float dy, float dz ) {
		trans.localPosition = new Vector3( trans.localPosition.x + dx,
		                                  trans.localPosition.y + dy,
		                                  trans.localPosition.z + dz );
	}
	void leftShiftBackgroundTiles() {
		for( int layer = 0; layer < 3; ++layer ) {
			for( int i = 0; i < TILE_SHOW_ROWS; ++i ) {
				updatePosition( m_tiles[layer, i, 0], LAYER_TILE_SIZE * ( TILE_SHOW_COLS - 1 ), 0, 0 );
				m_tempVTiles[i] = m_tiles[layer, i, 0];
			}

			for( int i = 0; i < TILE_SHOW_COLS - 1; ++i ) {
				for( int j = 0; j < TILE_SHOW_ROWS; ++j ) {
					m_tiles[layer, j, i] = m_tiles[layer, j, i+1];
					updatePosition( m_tiles[layer, j, i], -LAYER_TILE_SIZE, 0, 0 );
				}
			}
			for( int i = 0; i < TILE_SHOW_ROWS; ++i ) {
				m_tiles[layer, i, TILE_SHOW_COLS - 1] = m_tempVTiles[i];
			}
			
		}
	}

	void rightShiftBackgroundTiles() {
		for( int layer = 0; layer < 3; ++layer ) {
			for( int i = 0; i < TILE_SHOW_ROWS; ++i ) {
				updatePosition( m_tiles[layer, i, TILE_SHOW_COLS - 1], -LAYER_TILE_SIZE * ( TILE_SHOW_COLS - 1 ), 0, 0 );
				m_tempVTiles[i] = m_tiles[layer, i, TILE_SHOW_COLS - 1];
			}
			for( int i = TILE_SHOW_COLS - 1; i > 0; --i ) {
				for( int j = 0; j < TILE_SHOW_ROWS; ++j ) {
					m_tiles[layer, j, i] = m_tiles[layer, j, i-1];
					updatePosition( m_tiles[layer, j, i], LAYER_TILE_SIZE, 0, 0 );
				}
			}
			for( int i = 0; i < TILE_SHOW_ROWS; ++i ) {
				m_tiles[layer, i, 0] = m_tempVTiles[i];
			}
		}
	}

	void upShiftBackgroundTiles() {
		for( int layer = 0; layer < 3; ++layer ) {
			for( int i = 0; i < TILE_SHOW_COLS; ++i ) {
				updatePosition( m_tiles[layer, 0, i], 0, 0, -LAYER_TILE_SIZE * ( TILE_SHOW_ROWS - 1 ) );
				m_tempVTiles[i] = m_tiles[layer, 0, i];
			}
			for( int i = 0; i < TILE_SHOW_ROWS - 1; ++i ) {
				for( int j = 0; j < TILE_SHOW_COLS; ++j ) {
					m_tiles[layer, i, j] = m_tiles[layer, i+1, j];
					updatePosition( m_tiles[layer, i, j], 0, 0, LAYER_TILE_SIZE );
				}
			}
			for( int i = 0; i < TILE_SHOW_COLS; ++i ) {
				m_tiles[layer, TILE_SHOW_ROWS - 1, i] = m_tempVTiles[i];
			}
		}
	}

	void downShiftBackgroundTiles() {
		for( int layer = 0; layer < 3; ++layer ) {
			for( int i = 0; i < TILE_SHOW_COLS; ++i ) {
				updatePosition( m_tiles[layer, TILE_SHOW_ROWS - 1, i], 0, 0, LAYER_TILE_SIZE * ( TILE_SHOW_ROWS - 1 ) );
				m_tempVTiles[i] = m_tiles[layer, TILE_SHOW_ROWS - 1, i];
			}
			for( int i = TILE_SHOW_ROWS - 1; i > 0; --i ) {
				for( int j = 0; j < TILE_SHOW_COLS; ++j ) {
					m_tiles[layer, i, j] = m_tiles[layer, i-1, j];
					updatePosition( m_tiles[layer, i, j], 0, 0, -LAYER_TILE_SIZE );
				}
			}
			for( int i = 0; i < TILE_SHOW_COLS; ++i ) {
				m_tiles[layer, 0, i] = m_tempVTiles[i];
			}
		}
	}
	

	void onMouseMove( float xDiff, float yDiff ) {
		float newX, newZ;

/*#*/if( MACRO_OP_MOVE_CAMERA ) {
		newX = m_lastCameraPos.x + xDiff * SCREEN2WORLD_FACTOR;
		newZ = m_lastCameraPos.y + yDiff * SCREEN2WORLD_FACTOR;
		gameObject.transform.position = new Vector3( newX,
			                                            gameObject.transform.position.y,
			                                            newZ );
/*#*/} else {
		float xSpeed = -xDiff * SCREEN2WORLD_FACTOR;
		float zSpeed = -yDiff * SCREEN2WORLD_FACTOR;
		newX = m_lastCameraPos.x + xSpeed;
		newZ = m_lastCameraPos.y + zSpeed;
		float halfHSize = TILE_SHOW_COLS * LAYER_TILE_SIZE * 0.5f;
		float halfVSize = TILE_SHOW_ROWS * LAYER_TILE_SIZE * 0.5f;
		
		if( xSpeed < 0.0f ) { // Push left
			while( newX - halfHSize < m_boundaryLeftTop.x ) {
				newX += LAYER_TILE_SIZE;
				leftShiftBackgroundTiles();
			}
			
		} else {

			while( newX + halfHSize > m_boundaryRightBottom.x ) {
				newX -= LAYER_TILE_SIZE;
				rightShiftBackgroundTiles();
			}
		}

		if( zSpeed < 0.0f ) {
			while( newZ - halfVSize < m_boundaryRightBottom.y ) {
				newZ += LAYER_TILE_SIZE;
				downShiftBackgroundTiles();
			}
		} else {
			while( newZ + halfVSize > m_boundaryLeftTop.y ) {
				newZ -= LAYER_TILE_SIZE;
				upShiftBackgroundTiles();
			}
		}
	
		m_layerRoot.localPosition = new Vector3( newX,
			                               m_layerRoot.localPosition.y,
		                                   newZ );
/*#*/}
	}

	void onMouseDown() {
		m_isDragging = true;
		m_mouseXOnClick = Input.mousePosition.x;
		m_mouseYOnClick = Input.mousePosition.y;
		saveLastCameraPos();
	}

	void onMouseUp() {
		m_isDragging = false;
	}
}
