using UnityEngine;
using System.Collections;

public class RandomPositionAllocator : FloatingLayerMgr.PositionAllocator {

	public int count;
	
	private Rect outerArea;
	private Rect innerArea;
	private Vector2 spawnArea;
	private Vector2 halfSpawnArea;

	private float camTransXAbs;
	private float camTransZAbs;

	public override void Init (Rect outerArea, Rect innerArea)
	{
		this.outerArea = outerArea;
		this.innerArea = innerArea;
		spawnArea = new Vector2(outerArea.width - innerArea.width, outerArea.height - innerArea.height);
		halfSpawnArea = new Vector2(spawnArea.x * 0.5f, spawnArea.y * 0.5f);
	}

	public override void SetCameraMovement (Vector3 trans)
	{
		camTransXAbs = Mathf.Abs(trans.x);
		camTransZAbs = Mathf.Abs(trans.z);
	}

	public override Vector3 New (bool isRespawn)
	{
		float x = 0, y = 0;
		if (isRespawn) {
			if (camTransXAbs >= camTransZAbs) {
				x = Random.Range(0.0f, spawnArea.x);
				y = Random.Range(0.0f, outerArea.height);
				if (x > halfSpawnArea.x) {
					x += innerArea.width;
				}
			} else {
				x = Random.Range(0.0f, outerArea.width);
				y = Random.Range(0.0f, spawnArea.y);
				if (y > halfSpawnArea.y) {
					y += innerArea.height;
				}
			}
		} else {
			x = Random.Range(0.0f, outerArea.width);
			y = Random.Range(0.0f, outerArea.height);
		}
		return new Vector3(x, 0, y);
	}

	public override int MaxCount ()
	{
		return count;
	}

}
