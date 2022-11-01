using UnityEngine;
using System.Collections;
using KBN;

public class PveBuff : MonoBehaviour {
	[SerializeField]
	private GameObject timeBG;
	[SerializeField]
	private TextMesh time;
	[SerializeField]
	private GameObject icon;

	// Use this for initialization
	void Start () {
		icon.GetComponent<Renderer>().material.mainTexture = TextureMgr.singleton.LoadTexture("buff_Clover", TextureType.ICON);
	}

	private float lastUpdateTime = 0.0f;
	// Update is called once per frame
	void Update () {
		if (Time.realtimeSinceStartup - lastUpdateTime < 0.5)
			return;

		lastUpdateTime = Time.realtimeSinceStartup;

		HashObject seed = GameMain.singleton.getSeed();
		long timestamp = _Global.INT64(seed["bonus"]["bC3500"]["bT3501"]);
		long curtime = GameMain.unixtime();

		
		time.gameObject.SetActive(curtime < timestamp);
		icon.gameObject.SetActive(curtime < timestamp);
		timeBG.gameObject.SetActive(curtime < timestamp);

		if (curtime < timestamp) 
		{
			time.text = _Global.timeFormatStr(timestamp - curtime);
		}
	}
}
