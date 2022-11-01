using UnityEngine;
using System.Collections;

public class ParticleRelease:MonoBehaviour 
{
	private ParticleSystem ps;
	
	// Use this for initialization
	void Awake() 
	{
		ps = this.GetComponent<ParticleSystem>();
		Destroy(this.gameObject, ps.duration * 1.5f);
	}
}
