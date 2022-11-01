using UnityEngine;
using System.Collections;

public class KillSelf2 : MonoBehaviour {

	// Use this for initialization
	public float time=2f;
	void Start () {
		Kill();
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public void Kill(){
		Invoke("reallyKill",time);
	}

	private void reallyKill(){
		Destroy(gameObject);
	}
}
