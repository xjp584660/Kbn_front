using UnityEngine;
using System.Collections;

// Hammersley Point Set
// http://mathworld.wolfram.com/HammersleyPointSet.html
// python implementation:
// http://www.math.uiuc.edu/~gfrancis/illimath/windows/aszgard_mini/pylibs/cgkit/hammersley.py

public class HammersleyPositionAllocator : FloatingLayerMgr.PositionAllocator {
	
	public int count;

	private Rect outerArea;
	private Rect innerArea;
	private Vector2 spawnArea;
	private Vector2 halfSpawnArea;

	private Vector2[] hammersleyPoints;
	private int curIdx;

	private float camTransXAbs;
	private float camTransZAbs;

	private const int randomGroup = 3;

	public override void Init (Rect outerArea, Rect innerArea)
	{
		this.outerArea = outerArea;
		this.innerArea = innerArea;
		spawnArea = new Vector2(outerArea.width - innerArea.width, outerArea.height - innerArea.height);
		halfSpawnArea = new Vector2(spawnArea.x * 0.5f, spawnArea.y * 0.5f);

		GenerateHammersleySequance(count * randomGroup);
		curIdx = 0;
	}

	public override void Release ()
	{
		hammersleyPoints = null;
		curIdx = 0;
	}

	private void GenerateHammersleySequance(int count)
	{
		hammersleyPoints = new Vector2[count];
		for (int k = 0; k < count; k++) {
			float u = 0.0f, p = 0.5f;
			int kk = k;
			while (kk > 0) {
				if ((kk & 1) == 1) {
					u += p;
				}
				p *= 0.5f;
				kk >>= 1;
			}
			float v = (k + 0.5f) / count;
			hammersleyPoints[k] = new Vector2(u, v);
		}
	}

	public override void SetCameraMovement (Vector3 trans)
	{
		camTransXAbs = Mathf.Abs(trans.x);
		camTransZAbs = Mathf.Abs(trans.z);
	}

	public override void Reset()
	{
		curIdx = Random.Range(0, hammersleyPoints.Length);
	}

	public override Vector3 New (bool isRespawn)
	{
		float x = hammersleyPoints[curIdx].x;
		float y = hammersleyPoints[curIdx].y;
		curIdx += randomGroup;
		if (curIdx >= hammersleyPoints.Length)
			curIdx = 0;

		if (isRespawn) {
			if (camTransXAbs >= camTransZAbs) {
				x *= spawnArea.x;
				y *= outerArea.height;
				if (x > halfSpawnArea.x) {
					x += innerArea.width;
				}
			} else {
				x *= outerArea.width;
				y *= spawnArea.y;
				if (y > halfSpawnArea.y) {
					y += innerArea.height;
				}
			}
		} else {
			x *= outerArea.width;
			y *= outerArea.height;
		}
		return new Vector3(x, 0, y);
	}
	
	public override int MaxCount ()
	{
		return count;
	}
	
}
