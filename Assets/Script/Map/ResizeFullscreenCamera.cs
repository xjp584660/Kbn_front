using UnityEngine;
using System.Collections;

public class ResizeFullscreenCamera : MonoBehaviour
{
	// Use this for initialization
	void Start ()
	{
		GetComponent<Camera>().orthographicSize = 3.1f * Screen.height / Screen.width;
	}
	
	// Update is called once per frame
	void Update ()
	{
	}
}