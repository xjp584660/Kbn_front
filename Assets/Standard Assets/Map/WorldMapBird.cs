using UnityEngine;
using System.Collections;

public class WorldMapBird : MonoBehaviour {

	public Vector3 movingDir;
	public float minSpeed;
	public float maxSpeed;

	public float maxScale;
	public float minScale;

	private Vector3 speed;

	void OnEnable() {
		movingDir.Normalize();
		speed = movingDir * Random.Range(minSpeed, maxSpeed);

		float scale = Random.Range(minScale, maxScale);
		transform.localScale = new Vector3(scale, scale, scale);

		MaterialColorScheme.instance.ApplyColorScheme(gameObject, "WorldMapBird");
	}

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		gameObject.transform.localPosition += speed * Time.deltaTime;
	}
}
