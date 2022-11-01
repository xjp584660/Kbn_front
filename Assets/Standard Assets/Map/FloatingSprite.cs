using UnityEngine;
using System.Collections;

public class FloatingSprite : MonoBehaviour {

	public Vector2 movingDir;

	public float baseSpeed;
	public float speedRangeMin;
	public float speedRangeMax;

	public bool randomScale;
	public float originScale;
	public float scaleRange;

	public Material[] materialList;

	public string tagName;

	private Vector3 speed;

	void OnEnable() {
		movingDir.Normalize();
		speed = movingDir * Random.Range(baseSpeed + speedRangeMin, baseSpeed + speedRangeMax);

		if (randomScale) {
			float scale = Random.Range(originScale - scaleRange, originScale + scaleRange);
			transform.localScale = new Vector3(scale, scale, scale);
		}

		if (materialList.Length > 0 && null != GetComponent<Renderer>()) {
			int idx = (int)Random.Range(0, materialList.Length);
			GetComponent<Renderer>().material = materialList[idx];
		}

		if (!string.IsNullOrEmpty(tagName)) {
			MaterialColorScheme.instance.ApplyColorScheme(gameObject, tagName);
		}
	}

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		gameObject.transform.localPosition += speed * Time.deltaTime;
	}
}
