using UnityEngine;
using System.Collections;

public class textss : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public string jiamiString="jiami";
	public string jiemiString="jiemi";

	// public string DESkey = "BsSV0qcM@uToRjwN";

	public void Jiami(){
		string str=KBN.UnityNet.DESEnCode(jiamiString);
		Debug.LogWarning("jiami string="+str);
	}

	public void Jiemi(){
		string str=KBN.UnityNet.DESDeCode(jiemiString);
		Debug.LogWarning("jiemi string="+str);
	}
}
