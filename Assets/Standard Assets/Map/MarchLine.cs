// MarchLine.cs
//
// Brief: March line animation class.
// Created: Hong Pan
// Note: Courtesy of the KOM team.
using UnityEngine;
using System.Collections;

public class MarchLine {
/*Macros*/
	public static bool DEBUG_HEAD_SLOT = false;


	//-----------------------------------------------------------------------------------
	// Public interfaces
	//-----------------------------------------------------------------------------------
	public enum Type {
		STATIC = 0, // The curve will change neithor its length nor orientation
		DYNAMIC_WITH_LINE_PATH, // No need to update the curve's orientation
		DYNAMIC_WITH_CURVE_PATH, // Needs to update hte curve's orientation
	};

	private Type m_type { get; set; }
	public Transform m_st { get; set; } // Starting GO's trans, would be dynamic in the runtime.
	public Transform m_end { get; set; }
	private float m_stepLineAspect { get; set; }
	private float m_texAspect { get; set; }
	private float m_headAspect { get; set; }


	public MarchLine( Type type, Transform st, Transform end, Transform parent,
	                 Material mat, Material matShadow, Material matHead ) {

		m_stepLineAspect = DEFAULT_STEP_LINE_ASPECT;
		m_texAspect = DEFAULT_TEX_ASPECT;
		m_type = type;
		m_go = new GameObject();
		m_mat = mat;
		m_matShadow = matShadow;
		if( matShadow ) {
			m_goShadow = new GameObject();
		}
		m_matHead = matHead;
		if( matHead ) {
			m_goHead = new GameObject();
		}
		m_st = st;
		m_end = end;
		m_xSc = 1f;
		m_initDist = Mathf.Max(Vector3.Distance( st.localPosition, end.localPosition ), 10.0f);
		m_steps = Mathf.Max( Mathf.FloorToInt( m_initDist * DIST2STEPS_FACTOR ) + 1, 5 );
		m_wsDistPerStep =  m_initDist / m_steps;
		
		// Interior ctrl pts
		Vector3 p0 = new Vector3( st.localPosition.x, 0f, st.localPosition.z );
		Vector3 p1 = new Vector3( end.localPosition.x, 0f, end.localPosition.z );
		Vector3 i0 = ( p0 + p1 ) / 3f;
		//i0.y += CURVE_CTRLPT2_HEIGHT;
		Vector3 i1 = ( p0 + p1 ) * 2f / 3f;
		//i1.y += CURVE_CTRLPT3_HEIGHT;
		m_bez = new BezierCurve( p0, i0, i1, p1 );
		
		// Create the mesh
		createVerts();
		createUV();
		createIndices();
		createMesh( parent, m_go, m_mat, m_verts, m_uv, m_indices, st.localPosition );
		if( m_matShadow ) {
			createMesh( parent, m_goShadow, m_matShadow, m_vertsShadow, m_uv, m_indices, st.localPosition );
		}
		if( m_matHead ) {
			createMesh( parent, m_goHead, m_matHead, m_vertsHead, m_uvHead, m_indicesHead, st.localPosition );
			m_goHead.transform.localScale = new Vector3( 1f, 1f, 1.3f );
		}
	}

	public void update() {
		m_uOffset -= Time.deltaTime * 0.2f;
		setUOffset( m_uOffset );

		if( m_type != Type.STATIC ) {
			m_go.transform.localPosition = m_st.localPosition;
			if( m_matShadow ) {
				m_goShadow.transform.localPosition = m_st.localPosition;
			}

			// Update the length by the dist proportion
			m_xSc = Vector3.Distance( m_st.localPosition, m_end.localPosition ) / m_initDist;
			m_go.transform.localScale = new Vector3( m_xSc, m_xSc, 1 );

			// Also scale the tex, m_xSc should be corrected somehow 'cause the curve length doesn't
			// have a linear relationship with the dist. Now we just use m_xSc for a rough approximation.
			m_go.GetComponent<Renderer>().material.SetTextureScale( "_MainTex", new Vector2( m_xSc, 1f ) );
			if( m_matShadow ) {
				m_goShadow.transform.localScale = new Vector3( m_xSc, 1, 1 );
				// Shadow tex scaling is okay since it's linear.
				m_goShadow.GetComponent<Renderer>().material.SetTextureScale( "_MainTex", new Vector2( m_xSc, 1f ) );
			}

			// Update the rot
			if( m_type == Type.DYNAMIC_WITH_CURVE_PATH ) { // Need to update the orientation
				updateRot();
			}
			// Finally transform the head slot point from its local space to the world space,
			// then "plug" the head into the slot.
			if( m_matHead ) {
				m_goHead.transform.position = m_go.transform.TransformPoint( m_vHeadSlot.x,
			                                                            m_vHeadSlot.y,
			                                                            m_vHeadSlot.z );
			}
		}
/*#if*/
if( DEBUG_HEAD_SLOT ) {
			if( m_goHeadSlot ) {
				Vector3 slot = m_go.transform.TransformPoint( m_vHeadSlot.x,
			                                             m_vHeadSlot.y,
			                                             m_vHeadSlot.z );
				m_goHeadSlot.transform.position = slot;
			}
		}
/*#endif*/

	}


	public GameObject getGO () {
		return m_go;
	}

	//-----------------------------------------------------------------------------------
	// Underlying implementations
	//-----------------------------------------------------------------------------------
	public Material m_mat;
	public Material m_matShadow;
	public Material m_matHead;

	private GameObject m_go;
	private GameObject m_goShadow;
	private GameObject m_goHead;
	public GameObject m_goHeadSlot;
	private BezierCurve	m_bez;
	private Vector3 m_vHeadSlot;

	// Curve sim rel:
	// dist = distance( st, end );
	// steps = dist / m_wsDistPerStep
	private int m_steps;
	private float m_wsDistPerStep; // world space distance per step in the curve param space

	// Dynamic length
	private float m_xSc; // Curve length scaling
	private float m_initDist; // Initial dist between the starting pos and the dest pos
	
	// Mesh
	private Vector3[] m_verts;
	private Vector3[] m_vertsShadow;
	private Vector2[] m_uv;
	private Vector3[] m_vertsHead;
	private Vector2[] m_uvHead;
	private int[] m_indices;
	private int[] m_indicesHead;

	
	// Animation
	private Vector2 m_uvOffset = new Vector2();
	private float m_uOffset;
	
	private static float CURVE_CTRLPT2_HEIGHT = 1.0f;
	private static float CURVE_CTRLPT3_HEIGHT = 1.0f;
	private static float DIST2STEPS_FACTOR = 1.0f; // Tweak this for steps
	private static float DEFAULT_STEP_LINE_ASPECT = 4.4f;//3.2f; // Tweak this for line thickness
	private static float DEFAULT_TEX_ASPECT = 10.0f; // Tweak this for texture aspect

	private void updateRot() {
		if( m_st != null && m_end != null ) {
			Vector3 to = m_end.localPosition - m_st.localPosition;
			to.y = 0;
			setRot( Quaternion.FromToRotation( Vector3.right, to ) );

		}
	}

	private void setRot( Quaternion or ) {
		m_go.transform.localRotation = or;
		if( m_matShadow ) {
			m_goShadow.transform.localRotation = or;
		}
		if( m_matHead ) {
			m_goHead.transform.localRotation = or;
		}
	}

	private void setUOffset( float u ) {
		m_uvOffset.x = u;
		m_go.GetComponent<Renderer>().material.SetTextureOffset( "_MainTex", m_uvOffset );
		if( m_matShadow ) {
			m_goShadow.GetComponent<Renderer>().material.SetTextureOffset( "_MainTex", m_uvOffset );
		}
	}


	private void createVerts() {
		int samples = m_steps + 1;
		int index = 0;
		m_verts = new Vector3[samples+samples];
		if( m_matShadow ) {
			m_vertsShadow = new Vector3[samples+samples];
		}
		float step = 1.0f / m_steps;
		for (int i = 0; i < 2; i++) {
			for (int j = 0; j < samples; j++) {
				float x = j * m_wsDistPerStep;
				float y = m_bez.getY( j * step );
				float z = ( i - 0.5f ) * m_wsDistPerStep / m_stepLineAspect;
				m_verts[index] = new Vector3( x, y, z );
				if( m_matShadow ) {
					m_vertsShadow[index] = new Vector3( x, m_verts[0].y, z );
				}
				index++;
			}
		}
		if( m_matHead ) {
			// Fetch the 4 pts of the last quad to generate the arrow head
			//
			// ...+-+-2-3
			// ...|/|/#/|
			// ...+-+-0-1
			//
			// '#' is the pivot
			Vector3 _0 = m_verts[index-samples-2];
			Vector3 _1 = m_verts[index-samples-1];
			Vector3 _2 = m_verts[index-2];
			Vector3 _3 = m_verts[index-1];
			Vector3 pivot = ( _0 + _2 ) * 0.5f;

			m_vHeadSlot = pivot;
			Vector3 _01 = _1 - _0;
			_01.Normalize();
			_01 = _01 * m_wsDistPerStep / m_stepLineAspect; // Make the arrow quad a square

			// pivot is used as the origin, so verts head
			// is defined in the local space
			m_vertsHead = new Vector3[4] {
				_0 - pivot,
				_0 - pivot + _01,
				_2 - pivot,
				_2 - pivot + _01,
			};
		}
	}
	
	//Create UV
	private void createUV() {
		int samples = m_steps + 1;
		m_uv = new Vector2[samples+samples];
		// We'd make the line_aspect the same with the line tex pixel-level aspect
		//               tw( tex wid in pixels )
		// tex_aspect = -------------------
		//               th( tex height in pixels )
		//
		//                sw( step line wid )
		// line_aspect = -----------------
		//                sh( step line height )
		//
		//  u * tw        sw
		// ---------- = ------- = line_aspect
		//  v * th        sh
		//
		//  u
		// --- * tex_aspect = line_aspect
		//  v
		// u = line_aspect / tex_aspect * v
		//
		uint index = 0;
		float u = m_stepLineAspect / m_texAspect;
		for (int i = 0; i < 2; i++) {
			for (int j = 0; j < samples; j++) {
				m_uv[index++] = new Vector2( j * u, i );
			}
		}
		if( m_matHead ) {
			m_uvHead = new Vector2[4] {
				new Vector2( 0f, 0f ),
				new Vector2( 1f, 0f ),
				new Vector2( 0f, 1f ),
				new Vector2( 1f, 1f ),
			};
		}
	}

	private void createIndices() {
		int nIndices = m_steps * 6;
		int iters = m_steps;
		if( m_matHead ) {
			m_indicesHead = new int[6] {
				0, 3, 1, 0, 2, 3,
			};
			nIndices -= 6;
			iters--;
		}
		m_indices = new int[nIndices];
		uint index = 0;
		for (int j = 0; j < iters; j++) {
			int line = m_steps + 1;
			int self = j;
			int next = j + line;
			m_indices[index] = self;
			m_indices[index + 1] = next + 1;
			m_indices[index + 2] = self + 1;
			m_indices[index + 3] = self;
			m_indices[index + 4] = next;
			m_indices[index + 5] = next + 1;
			index += 6;
		}
	}
	
	private void createMesh( Transform parent, GameObject go, Material mat, Vector3[] verts,
	                        Vector2[] uv, int[] indices, Vector3 pos ) {
		Mesh msh = go.AddComponent<MeshFilter>().mesh;
		go.AddComponent<MeshRenderer>();
		go.GetComponent<Renderer>().material = mat;
		msh.Clear();
		msh.vertices = verts;
		msh.uv = uv;
		msh.triangles = indices;
		msh.RecalculateNormals();
		msh.RecalculateBounds();
		go.transform.parent = parent;
		go.transform.localPosition = pos;
		go.name = "GO_MarchLine";
	}
}
