// TournamentMarchManager.cs
//
// Brief: Manages the effect animations of march,
//		like fighting, defending, etc.
// Created: Hong Pan
//
using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using GameMain = KBN.GameMain;
using _Global = KBN._Global;

[Serializable]
public class TournamentMarchAnimPool {

	public MapMoveAnim troopTemplate;
	public int initialSize = 3;
	public int maxSize = 10;

	private List<MapMoveAnim> pool = new List<MapMoveAnim>();
	private Dictionary<string, MapMoveAnim> table = new Dictionary<string, MapMoveAnim>();

	private MapMoveAnim newInstance() {
		MapMoveAnim instance = GameObject.Instantiate(troopTemplate) as MapMoveAnim;
		instance.SetDeleteOnDisable = false;
		instance.gameObject.SetActive(false);
		return instance;
	}

	public void init() {
		// pre-allocate pool to initial size
		while (pool.Count < initialSize)
			pool.Add(newInstance());
	}

	public void release() {
		// clear all
		for (int i = 0; i < pool.Count; i++) {
			if (null != pool[i] && null != pool[i].gameObject)
				GameObject.Destroy(pool[i].gameObject);
		}
	}

	public void update() {
		if (pool.Count > initialSize) {  // release an instance per frame until we reach max size;
			int idx = pool.FindLastIndex(x => !x.gameObject.activeSelf);
			if (-1 != idx) {
				GameObject.Destroy(pool[idx].gameObject);
				pool.RemoveAt(idx);
			}
		}
	}

	private MapMoveAnim alloc() {
		MapMoveAnim instance = null;
		int idx = pool.FindIndex(x => !x.gameObject.activeSelf);
		if (-1 != idx) {
			instance = pool[idx];
		} else {
			instance = newInstance();
			pool.Add(instance);
		}
		instance.gameObject.SetActive(true);
		return instance;
	}

	private void free(MapMoveAnim instance) {
		instance.gameObject.SetActive(false);
	}

	public void Clear() {
		for (int i = 0; i < pool.Count; i++)
			free(pool[i]);
		table.Clear();
	}

	public bool ContainsKey(string key) {
		return table.ContainsKey(key);
	}

	public MapMoveAnim this[string key] {
		get { // allocate on get
			if (!table.ContainsKey(key))
				table[key] = alloc();
			return table[key];
		}
		set {
			if (null != value) // only accept 'null' for free instance
				return;
			if (table.ContainsKey(key)) {
				free(table[key]);
				table.Remove(key);
			}
		}
	}
}

public class TournamentMarchManager : MonoBehaviour {

	#region Public Interfaces

	public float durationAfterDone = 3.0f;

	public void showMarch( string tileName ) {
		if (string.IsNullOrEmpty(tileName) || tileName == currentTile)
			return;

		cleanup();
		tournamentMarches = MapMemCache.instance().getTournamentMarchInfo(tileName);
		if (null == tournamentMarches)
			return;

		currentTile = tileName;
	}

	public void cleanup() {
		if (null == tournamentMarches) 
			return;
		for (int i = 0; i < tournamentMarches.Count; i++) {
			string marchId = tournamentMarches[i].marchId;
			if (marchAnimes.ContainsKey(marchId)) {
				marchAnimes[marchId].onDelete();
				marchAnimes[marchId] = null;
			}
		}
		tournamentMarches = null;
		currentTile = null;
	}

	public void setTileWH(float xorg, float yorg, float width, float height) {
		xOrg = xorg;
		yOrg = yorg;
		tileWidth = width;
		tileHeight = height;
	}

	public void toFront() {

	}

	public void toBack() {
		cleanup();
	}

	#endregion

	// -----------------------------------------

	#region Underlying Implementations

	private List<TournamentMarchData> tournamentMarches = null;
	[SerializeField] private TournamentMarchAnimPool marchAnimes;
	private string currentTile = null;

	private double curTime;
	
	private float xOrg, yOrg, tileWidth, tileHeight;
	
	void OnEnable() {
		marchAnimes.init();
	}
	
	void OnDisable() {
		marchAnimes.release();
	}

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		double unixTime = GameMain.unixtime();
		if (unixTime > curTime)
			curTime = unixTime;
		
		curTime += Time.deltaTime;
		marchAnimes.update();

		if (null == tournamentMarches)
			return;

		for (int i = 0; i < tournamentMarches.Count; i++) {
			TournamentMarchData march = tournamentMarches[i];
			if (march.isDone)
				continue;
			MapMoveAnim anim = marchAnimes[march.marchId];
			anim.setToCoor(march.endX, march.endY);
			
			Vector3 st = getWorldCoord(march.startX, march.startY);
			Vector3 ed = getWorldCoord(march.endX, march.endY);
			
			float progress = (float)((curTime - march.startTime) / (march.endTime - march.startTime));
			if (progress >= 1.0f) {
				march.isDone = true;
				march.doneTime = Time.realtimeSinceStartup;
			}
			progress = Mathf.Clamp01(progress);
			Vector3 pos = Vector3.Slerp(st, ed, progress);
			
			anim.transform.position = pos;
			anim.setTileFromTo( march.startX, march.startY, march.endX, march.endY );
			anim.setFromTo(st, ed);
		}
		
		tournamentMarches.RemoveAll(delegate (TournamentMarchData march) {
			if (march.isDone && Time.realtimeSinceStartup - march.doneTime > durationAfterDone) {
				if (marchAnimes.ContainsKey(march.marchId)) {
//					marchAnimes[march.marchId].onDelete();
					marchAnimes[march.marchId] = null;
				}
				return true;
			}
			return false;
		});
	}

	private Vector3 getWorldCoord(int tileX, int tileY) {
		return new Vector3(xOrg + tileWidth * (tileX - 1 + 0.5f), 0, yOrg - tileHeight * (tileY - 1 - 0.5f));
	}

	#endregion
}
