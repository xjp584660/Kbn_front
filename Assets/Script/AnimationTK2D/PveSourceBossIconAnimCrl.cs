using UnityEngine;
using System.Collections;

public class PveSourceBossIconAnimCrl : MonoBehaviour {

	private tk2dSprite sprite;
	// Use this for initialization
	void Start () 
	{
		sprite = GetComponent<tk2dSprite>();
	}

	public void IconGray()
	{		
		sprite = GetComponent<tk2dSprite>();
		sprite.color = new Vector4(120/255f, 120/255f, 120/255f, 220/255f);
	}

	public void IconNormal()
	{
		sprite = GetComponent<tk2dSprite>();
		sprite.color = new Vector4(1f, 1f, 1f, 1f);
	}
}
