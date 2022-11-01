using UnityEngine;
using System.Collections;

public class AvaMapCloudMask : MonoBehaviour {

	public Transform CAMERA;
	public float XY_2_UV_FACTOR = 0.1f;

	void Update () {
		float x = CAMERA.position.x;
		float z = CAMERA.position.z;
		m_uvOffset.y = m_upIso.x * z + m_rightIso.x * x;
		m_uvOffset.x = -( m_upIso.z * z + m_rightIso.z * x );
		m_uvOffset.x *= XY_2_UV_FACTOR;
		m_uvOffset.y *= XY_2_UV_FACTOR;

		gameObject.GetComponent<Renderer>().material.SetTextureOffset( "_MainTex", m_uvOffset );
	}
	// Iso
	private Vector3 m_upIso = new Vector3( 1f, 0f, 1f );
	private Vector3 m_rightIso = new Vector3( 1f, 0f, -1f );
	private Vector2 m_uvOffset;
}
