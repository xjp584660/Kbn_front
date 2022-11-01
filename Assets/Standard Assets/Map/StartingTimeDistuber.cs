// StartingTimeDistuber.cs
//
// Brief: Set the starting time of an animation randomly.
// Created: Hong Pan
//
using UnityEngine;
using System.Collections;

public class StartingTimeDistuber : MonoBehaviour {

	// Use this for initialization
	void Start () {
		distubeStartingTime();
	}


	void OnEnable() {
		distubeStartingTime();
	}



	private void distubeStartingTime() {
		Component[] comp = GetComponentsInChildren( typeof( Animation ) );
		bool timeGen = false;
		float time = 0f;
		for( int i = 0; i < comp.Length; ++i ) {
			Animation anim = comp[i] as Animation;
			if( !timeGen ) {
				timeGen = true;
				time = Random.Range( 0f, anim["Take 001"].length );
			}
			anim["Take 001"].time = time;
		}
	}
}