using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class FloatingLayerMgr : MonoBehaviour {

	public class PositionAllocator : MonoBehaviour {
		public virtual void Init(Rect outerArea, Rect innerArea) {}
		public virtual void Release() {}
		public virtual void Reset() {}
		public virtual void Add(Vector3 pos) {}
		public virtual Vector3 New(bool isRespawn) { return Vector3.zero; }
		public virtual int MaxCount() { return 0; }
		public virtual void SetCameraMovement(Vector3 trans) {}
	}

	public GameObject[] layerSpriteTemplates;
	public float baseHeight;
	public float[] layerHeights;
	public PositionAllocator[] layerPositionAllocators;
	public float[] layerCamMoveSpeeds;
	public Camera curCamera;
	public Rect outerRect;
	public Rect innerRect;
	public Vector2 outerRectOffset;

	private Vector3 camTrans = Vector3.zero;

	private List<GameObject>[] sprites;
	private Vector3 originPoint;
	private Rect cullingRect;

	void OnEnable() {
		if (null != sprites)
			return;

		sprites = new List<GameObject>[layerSpriteTemplates.Length];
		for (int i = 0; i < sprites.Length; i++) {
			sprites[i] = new List<GameObject>();
			layerPositionAllocators[i].Init(outerRect, innerRect);
			int count = layerPositionAllocators[i].MaxCount();
			for (int j = 0; j < count; j++) {
				GameObject spr = Instantiate(layerSpriteTemplates[i]) as GameObject;
				sprites[i].Add(spr);
			}
		}

		SpawnAll();
	}

	void OnDisable() {
		if (null == sprites)
			return;

		for (int i = 0; i < sprites.Length; i++) {
			for (int j = 0; j < sprites[i].Count; j++)
				Destroy(sprites[i][j]);
			sprites[i].Clear();
			sprites[i] = null;
			layerPositionAllocators[i].Release();
		}
		sprites = null;
	}

	private bool ShouldBeCull(GameObject spr) {
		Vector3 pos = spr.transform.position;
		return (!cullingRect.Contains(new Vector2(pos.x, pos.z)));
	}

	private void Spawn(int layer) {
		List<GameObject> sprs = sprites[layer];
		for (int i = 0; i < sprs.Count; i++) {
			Vector3 pos = originPoint + layerPositionAllocators[layer].New(false);
			pos.y = baseHeight + layerHeights[layer];
			sprs[i].transform.position = pos;
		}
	}

	private void Respawn(int layer) {
		List<GameObject> sprs = sprites[layer];

		for (int i = 0; i < sprs.Count; i++) {
			if (!sprs[i].activeSelf)
				continue;
			sprs[i].transform.position += camTrans * layerCamMoveSpeeds[layer];
			if (ShouldBeCull(sprs[i])) { // should be respawn
				sprs[i].SetActive(false);
			} else {
				layerPositionAllocators[layer].Add(sprs[i].transform.position - originPoint);
			}
		}

		for (int i = 0; i < sprs.Count; i++) {
			if (!sprs[i].activeSelf) {
				Vector3 pos = originPoint + layerPositionAllocators[layer].New(true);
				pos.y = baseHeight + layerHeights[layer];
				sprs[i].transform.position = pos;
				sprs[i].SetActive(true);
			}
		}
	}

	private void UpdateCullingRect() {
		Vector3 centerPoint = curCamera.transform.position + new Vector3(outerRectOffset.x, 0, outerRectOffset.y);
		cullingRect = outerRect;
		cullingRect.x = centerPoint.x - cullingRect.width * 0.5f;
		cullingRect.y = centerPoint.z - cullingRect.height * 0.5f;
		originPoint = new Vector3(cullingRect.x, 0, cullingRect.y);
	}

	public void SpawnAll() {
		UpdateCullingRect();

		if (null == sprites)
			return;

		for (int i = 0; i < sprites.Length; i++) {
			layerPositionAllocators[i].Reset();
			Spawn(i);
		}
	}

	public void OnCameraMove(Vector3 trans) {
		camTrans += trans;
	}

	// Use this for initialization
	void Start () {
//		SpawnAll();
	}
	
	// Update is called once per frame
	void Update () {
		UpdateCullingRect();

		for (int i = 0; i < sprites.Length; i++) {
			layerPositionAllocators[i].Reset();
			layerPositionAllocators[i].SetCameraMovement(camTrans);
			Respawn(i);
		}
		camTrans = Vector3.zero;
	}


#if UNITY_EDITOR
	void OnDrawGizmosSelected() {
		if (!Application.isPlaying)
			return;

		Vector3 center = new Vector3(cullingRect.center.x, baseHeight ,cullingRect.center.y);
		Vector3 outerSize = new Vector3(outerRect.width, 0, outerRect.height);
		Vector3 innerSize = new Vector3(innerRect.width, 0, innerRect.height);

		Gizmos.color = Color.yellow;
		Gizmos.DrawWireCube(center, innerSize);
		Gizmos.DrawWireCube(center, outerSize);
	}
#endif
}
