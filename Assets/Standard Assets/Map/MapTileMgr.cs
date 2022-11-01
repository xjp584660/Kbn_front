using UnityEngine;
using System;
using System.Collections;

[Serializable]
public class MapTileMgr
{

	public delegate void ProcessDelegate(TilePrefabData go, int i, int j);

	public int batchLoadingCount = 2;

	private GameObject prefab;
	private ProcessDelegate initDelegate;
	private ProcessDelegate dataDelegate;

	private int width;
	private int height;
	private bool bInited;

	private TilePrefabData[,] tiles;
	private bool[,] dataFlag;

	public void Init(GameObject prefab, int width, int height, ProcessDelegate initDelegate, ProcessDelegate dataDelegate) {
		this.prefab = prefab;
		this.width = width;
		this.height = height;
		this.initDelegate = initDelegate;
		this.dataDelegate = dataDelegate;

		tiles = new TilePrefabData[width, height];
		dataFlag = new bool[width, height];

		for (int i = 0; i < width; i++) {
			for (int j = 0; j < height; j++) {
				tiles[i, j] = null;
				dataFlag[i, j] = false;
			}
		}

		bInited = false;
	}

	public void Update() {
		if (bInited)
			return;

		int count = batchLoadingCount;
		for (int i = 0; i < width; i++) {
			for (int j = 0; j < height; j++) {
				if (null == tiles[i, j] && count > 0) {
					count--;
					TilePrefabData tilePreData = new TilePrefabData();
					GameObject go = GameObject.Instantiate(prefab) as GameObject;
					tilePreData.tileObj = go;
					tilePreData.flagObj = go.transform.Find("flag").gameObject;
					tilePreData.levelObj = go.transform.Find("level").gameObject;
					tilePreData.buildingObj = go.transform.Find("building").gameObject;
					tilePreData.protectionCoverObj = go.transform.Find("protectionCover").gameObject;
					tilePreData.openObj = go.transform.Find("open").gameObject;

					tiles[i, j] = tilePreData;
					initDelegate(tiles[i, j], i, j);
					if (i == width - 1 && j == height -1)
						bInited = true;
				}
				if (null != tiles[i, j] && dataFlag[i, j]) {
					if(dataDelegate!=null) dataDelegate(tiles[i, j], i, j);
					dataFlag[i, j] = false;
				}
			}
		}
	}

	public void OnDataArrive(int i, int j) {
		if (null != tiles[i, j])
			if (dataDelegate != null) dataDelegate(tiles[i, j], i, j);
		else
			dataFlag[i,j] = true;
	}

	public void GetLocalCoord(GameObject go, ref int x, ref int y) {
		for (int i = 0; i < width; i++) {
			for (int j = 0; j < width; j++) {
				if (tiles[i, j].tileObj == go) {
					x = i;
					y = j;
					return;
				}
			}
		}
	}

	public GameObject GetTile(int i, int j) {
		if (i < 0 || i >= width || j < 0 || j > height)
			return null;
		return tiles[i, j].tileObj;
	}


	public TilePrefabData GetTileData(int i, int j)
	{
		if (i < 0 || i >= width || j < 0 || j > height)
			return null;
		return tiles[i, j];
	}
}
