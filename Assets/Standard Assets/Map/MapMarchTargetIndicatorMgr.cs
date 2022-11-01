using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using _Global = KBN._Global;

public class MapMarchTargetIndicatorMgr : MonoBehaviour {


	public GameObject indicatorTemplate;

	private Dictionary<string, int> indicators = new Dictionary<string, int>();

	private Dictionary<string, GameObject> indicatorObjects = new Dictionary<string, GameObject>();

	private float xOrg, yOrg, tileWidth, tileHeight;

	void OnEnable() {
	}

	void OnDisable() {
	}

	public void setTileWH(float xorg, float yorg, float width, float height) {
		xOrg = xorg;
		yOrg = yorg;
		tileWidth = width;
		tileHeight = height;
	}

	public void AddIndicator(string tileName) {
		if (indicators.ContainsKey(tileName))
			indicators[tileName]++;
		else
			indicators[tileName] = 1;
		tryAddIndicatorObject(tileName);
	}

	public void RemoveIndicator(string tileName) {
		if (indicators.ContainsKey(tileName)) {
			indicators[tileName]--;
			if (0 >= indicators[tileName]) {
				indicators.Remove(tileName);
			}
		}

		// clean indicator objects
		UpdateIndicators();
	}

	public void CleanUpAll() {
		foreach(GameObject go in indicatorObjects.Values) {
			Destroy( go );
		}
		indicatorObjects.Clear();
		indicators.Clear();
	}

	public void UpdateIndicators() {

		HashSet<string> indicatorSet = new HashSet<string>();
		foreach (string tileName in indicators.Keys) {
			if (0 >= indicators[tileName])
			    continue;
			string realTileName = getRealTileName(tileName);
			if (null != realTileName) {
				tryAddIndicatorObject(tileName);
				indicatorSet.Add(realTileName);
			}
		}

		// clean indicator objects
		List<string> removeList = new List<string>();
		foreach(string tileName in indicatorObjects.Keys) {
			if (!indicatorSet.Contains(tileName)) {
				removeList.Add(tileName);
			}
		}
		for (int i = 0; i < removeList.Count; i++) {
			Destroy(indicatorObjects[removeList[i]]);
			indicatorObjects.Remove(removeList[i]);
		}
	}

	private string getRealTileName(string tileName) {
		string realTileName = null;
		int tileType = -1, tileX = 0, tileY = 0;
		getRealTileNameAndType(tileName, out realTileName, out tileType, out tileX, out tileY);
		return realTileName;
	}

	private void getRealTileNameAndType(string tileName, out string realTileName, out int tileType, out int tileX, out int tileY) {
		realTileName = null;
		tileType = -1;
		tileX = 0;
		tileY = 0;

		var tile = MapMemCache.instance().getTileInfoData(tileName);
		if (null == tile) {
			return;
		}
		
		tileType = _Global.INT32(tile["tileType"]);
		string[] nameSplits = tileName.Split('_');
		tileX = _Global.INT32(nameSplits[1]);
		tileY = _Global.INT32(nameSplits[3]);
		KBN.TournamentManager.getInstance().convertToKeyTile2x2(tileType, ref tileX, ref tileY);
		realTileName = "l_" + tileX + "_t_" + tileY;
	}

	private Vector3 getWorldCoord(int tileX, int tileY, bool is2x2) {
		return new Vector3(xOrg + ( tileX - 1 ) * tileWidth + (is2x2 ? (tileWidth * 0.5f) : 0), 
		                   1, 
		                   yOrg - ( tileY - 1 ) * tileHeight - (is2x2 ? (tileHeight * 0.5f) : 0));
	}

	private bool is2x2Tile(int tileType) {
		return (tileType >= Constant.TileType.WORLDMAP_2X2_LT_DUMMY && tileType <= Constant.TileType.WORLDMAP_2X2_RB_ACT) ||
			( tileType == Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER ||
			 ( tileType >= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER1 && tileType <= Constant.TileType.TILE_TYPE_AVA_SUPER_WONDER4 ) );
	}

	private void tryAddIndicatorObject(string tileName) {
		string realTileName = null;
		int tileType = -1, tileX = 0, tileY = 0;
		getRealTileNameAndType(tileName, out realTileName, out tileType, out tileX, out tileY);
		if (null == realTileName)
			return;

		if (!indicatorObjects.ContainsKey(realTileName)) {
			GameObject indicator = Instantiate(indicatorTemplate) as GameObject;
			indicatorObjects[realTileName] = indicator;

			bool is2x2 = is2x2Tile(tileType);
			indicator.transform.position = getWorldCoord(tileX, tileY, is2x2);
			if (is2x2) {
				indicator.transform.localScale = indicator.transform.localScale * 2;
			}
		}
	}

//	#region Debug
//
//	public int tileX = 1;
//	public int tileY = 1;
//	public bool add = false;
//	public bool remove = false;
//
//	void Update() {
//		if (add) {
//			add = false;
//			AddIndicator("l_" + tileX + "_t_" + tileY);
//		}
//		if (remove) {
//			remove = false;
//			RemoveIndicator("l_" + tileX + "_t_" + tileY);
//		}
//	}
//
//	#endregion
}
