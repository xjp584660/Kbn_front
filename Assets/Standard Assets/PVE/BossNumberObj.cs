using UnityEngine;
using System.Collections;

public class BossNumberObj : MonoBehaviour {


	public GameObject numberObj;
	public GameObject numberBg;
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () 
	{
		TextMesh text = numberObj.GetComponent ("TextMesh") as TextMesh;
		if (KBN._Global.INT32 (text.text) <= 0) 
		{
			numberObj.SetActive(false);
			numberBg.SetActive(false);
		}
		else
		{
			numberObj.SetActive(true);
			numberBg.SetActive(true);
		}
	}
}
