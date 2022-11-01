using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GridPositionAllocator : FloatingLayerMgr.PositionAllocator {

	public int gridNumInX;
	public int gridNumInZ;
	public Vector2 gap;

	private Vector2 cellSize;
	private List<int> availableCells;

	public override void Init (Rect outerArea, Rect innerArea)
	{
		cellSize = new Vector2(outerArea.width / gridNumInX, outerArea.height / gridNumInZ);
		availableCells = new List<int>();

		if (gap.x * 2 > cellSize.x) gap.x = 0;
		if (gap.y * 2 > cellSize.y) gap.y = 0;
	}

	public override void Release ()
	{
		availableCells = null;
	}

	private void indexToCoord(int idx, out int x, out int y)
	{
		x = idx % gridNumInX;
		y = idx / gridNumInX;
	}

	private int distanceToCenter(int idx)
	{
		int x, y;
		indexToCoord(idx, out x, out y);
		return Mathf.Abs(x - gridNumInX / 2) + Mathf.Abs(y - gridNumInZ / 2);
	}

	public override void Reset ()
	{
		availableCells.Clear();
		for (int i = 0; i < gridNumInX * gridNumInZ; i++)
			availableCells.Add(i);

		availableCells.Sort(delegate(int a, int b) {
			return distanceToCenter(a) - distanceToCenter(b);
		});
	}

	public override void Add (Vector3 pos)
	{
		int xIdx = (int)(pos.x / cellSize.x);
		int zIdx = (int)(pos.z / cellSize.y);
		int idx = zIdx * gridNumInX + xIdx;
		availableCells.Remove(idx);
	}

	private Vector3 generatePositionOnCell(int idx)
	{
		int xIdx = idx % gridNumInX;
		int zIdx = idx / gridNumInX;
		
		float x = Random.Range( xIdx * cellSize.x + gap.x, (xIdx + 1) * cellSize.x - gap.x);
		float z = Random.Range( zIdx * cellSize.y + gap.y, (zIdx + 1) * cellSize.y - gap.y);

		availableCells.Remove(idx);
		return new Vector3(x, 0, z);
	}

	public override Vector3 New (bool isRespawn)
	{
		if (availableCells.Count > 0) {
			return generatePositionOnCell(availableCells[availableCells.Count - 1]);
		}
		return base.New(isRespawn);
	}

	public override int MaxCount ()
	{
		return gridNumInX * gridNumInZ;
	}
}
