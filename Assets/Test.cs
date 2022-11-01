using UnityEngine;
using System.Collections;

public class Test : MonoBehaviour {

	public UILabel label;
	// Use this for initialization
	void Start () {
		TweenText.Begin(label, 2, 100);
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
