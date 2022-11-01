// Soldier.cs
//
// Brief: Soldier action handler.
// Created: Hong Pan
//
using UnityEngine;
using System.Collections;
using KBN;

public class Soldier : MonoBehaviour {
	//-----------------------------------------------------------------------------------
	// Public interfaces
	//-----------------------------------------------------------------------------------
	public enum Type {
		ATTACKING,
		WINNER,
		LOSER,
		TRANSPORTER,
		COLLECT,
		COLLECT_RES,
	};

	public Type type { get; set; }

	public bool isReturn { get; set; }

	public void init( Transform parent, Vector3 from, Vector3 to ) {
		transform.parent = parent;
		transform.localPosition = Vector3.zero;
		m_posSrc = from;
		m_posDest = to;
		updateOrientation();
	}

	// Use this for initialization
	void Start () {
		Animation anim = gameObject.GetComponent<Animation>();
		if( anim != null ) {
			// Make every soldier start the anim differently
			anim["Take 001"].time = Random.Range( 0f, anim["Take 001"].length );
		}
	}

	void Update() {
		updateOrientation();
	}

	public void updateWorldPosition( Vector3 from, Vector3 to ) {
		m_posSrc = from;
		m_posDest = to;
	}

	//-----------------------------------------------------------------------------------
	// Underlying Implementations
	//-----------------------------------------------------------------------------------

	private Vector3 m_posSrc;
	private Vector3 m_posDest;


	private void updateOrientation() {
		// Direction
		transform.LookAt( m_posDest );
	}
}