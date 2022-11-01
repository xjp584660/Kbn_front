using UnityEngine;
using System.Collections;

public class ParticleAc : MonoBehaviour {
	
	public enum xyz
	{
		x=0,
		y=1,
		z
	}
	public xyz mxyz = xyz.y;
	public float ac = 1.0f;
	public float rate = 1.0f;
	
	private Vector3 dir = Vector3.zero;
	
	void Start()
	{
		dir = Vector3.zero;
		switch(mxyz)
		{
			case xyz.x:
				dir.x = 1;
				break;
			case xyz.y:
				dir.y = 1;
				break;
			case xyz.z:
				dir.z = 1;
				break;
		default:
			break;
		}
	}
	
	
	void Update () 
	{
		Particle[] particles = GetComponent<ParticleEmitter>().particles;
		int i = 0;
		ac += rate * Time.deltaTime;
		dir += dir*Time.deltaTime * ac;
		while (i < particles.Length) {
			
//			float yPosition = Mathf.Sin(Time.time) * Time.deltaTime * ac;
			particles[i].velocity = dir;//new Vector3(0, Mathf.Sin(Time.time) * Time.deltaTime * ac, 0);
			i++;
		}
		GetComponent<ParticleEmitter>().particles = particles;
//		particleEmitter.localVelocity = new Vector3(0,particleEmitter.localVelocity.y+ac*Time.deltaTime,0);
	}
}
