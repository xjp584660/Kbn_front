using UnityEngine;
using System.Linq;
using System.Collections.Generic;

public class RenderRectMaker
{
    // 4 vertices from bottom-left corner in counter-clockwise order: 0, 1, 3, 2
    private static readonly int[] verticesForTris = new int[] {0,2,1,2,3,1};
    // 16 vertices. Outer rect: 0,4,5,1,6,7,3,9,8,2,10,11; inner rect: 12-15
    private static readonly int[] vertices9ForTris = new int[] {
        0,11,4,
        11,12,4,
        4,12,5,
        12,13,5,
        5,13,1,
        13,6,1,
        11,10,12,
        10,15,12,
        12,15,13,
        15,14,13,
        13,14,6,
        14,7,6,
        10,2,15,
        2,9,15,
        15,9,14,
        9,8,14,
        14,8,7,
        8,3,7,
    };

	private RenderCache m_rdCache;
	public RenderRectMaker()
	{
		m_rdCache = new RenderCache();
	}

	public RenderRectMaker(RenderCache rc)
	{
		m_rdCache = rc;
	}

	public RenderCache Cache
	{
		get
		{
			return m_rdCache;
		}
	}
	#region Basic Add Functions
	public void Add(UnityEngine.Rect rect, UnityEngine.Rect uv)
	{
		Vector3[] vecs = priv_toVectorArray(rect);
		Vector2[] uvs = priv_toUVArray(uv);
        m_rdCache.AddArray(vecs, uvs, null, verticesForTris);
	}

	public void Add(UnityEngine.Rect rect, UnityEngine.Rect uv, uint texId)
	{
		Vector3[] vecs = priv_toVectorArray(rect);
		Vector2[] uvs = priv_toUVArray(uv);
		uint[] texIds = new uint[verticesForTris.Length/3];
		for ( int i = 0; i != texIds.Length; ++i )
			texIds[i] = texId;
		m_rdCache.AddArray(vecs, uvs, null, verticesForTris, texIds);
	}

	public void Add(UnityEngine.Rect rect, UnityEngine.Rect uv, RectOffset borderOffset)
    {
        Add(rect, uv, borderOffset, Color.white);
    }

	public void Add(UnityEngine.Rect rect, UnityEngine.Rect uv, RectOffset borderOffset, uint texId)
	{
		Add(rect, uv, borderOffset, Color.white, texId);
	}
	
	public void Add(UnityEngine.Rect rect, UnityEngine.Rect uv, RectOffset borderOffset, Color col)
    {
        Vector4 border = new Vector4(borderOffset.left, borderOffset.right, borderOffset.top, borderOffset.bottom);
        Vector3[] vecs = priv_toVectorArray(rect, border);
        Texture2D tex = m_rdCache.SourceImage;
        Vector2[] uvs = priv_toUVArray(uv, new Vector4(border.x / tex.width, border.y / tex.width,
                                                       border.z / tex.height, border.w / tex.height));
        m_rdCache.AddArray(vecs, uvs, Enumerable.Repeat(col, vecs.Length).ToArray(), vertices9ForTris);
    }

	public void Add(UnityEngine.Rect rect, UnityEngine.Rect uv, RectOffset borderOffset, Color col, uint texId)
	{
		Vector4 border = new Vector4(borderOffset.left, borderOffset.right, borderOffset.top, borderOffset.bottom);
		Vector3[] vecs = priv_toVectorArray(rect, border);
		Texture2D tex = m_rdCache.SourceImage;
		Vector2[] uvs = priv_toUVArray(uv, new Vector4(border.x / tex.width, border.y / tex.width,
		                                               border.z / tex.height, border.w / tex.height));

		uint[] texIds = new uint[vertices9ForTris.Length/3];
		for ( int i = 0; i != texIds.Length; ++i )
			texIds[i] = texId;
		m_rdCache.AddArray(vecs, uvs, Enumerable.Repeat(col, vecs.Length).ToArray(), vertices9ForTris, texIds);
	}

	public void Add(UnityEngine.Rect rect, UnityEngine.Rect uv, UnityEngine.Color col)
	{
		Vector3[] vecs = priv_toVectorArray(rect);
		Vector2[] uvs = priv_toUVArray(uv);
		UnityEngine.Color[] cols = new Color[]{col, col, col, col};
        m_rdCache.AddArray(vecs, uvs, cols, verticesForTris);
	}
	public void Add(UnityEngine.Rect rect, UnityEngine.Rect uv, UnityEngine.Color col, uint texId)
	{
		Vector3[] vecs = priv_toVectorArray(rect);
		Vector2[] uvs = priv_toUVArray(uv);
		UnityEngine.Color[] cols = new Color[]{col, col, col, col};
		uint[] texIds = new uint[verticesForTris.Length/3];
		for ( int i = 0; i != texIds.Length; ++i )
			texIds[i] = texId;
		m_rdCache.AddArray(vecs, uvs, cols, verticesForTris, texIds);
	}

	public void Add(UnityEngine.Rect rect, UnityEngine.Quaternion quat, UnityEngine.Rect uv, RectOffset borderOffset)
    {
        this.Add(rect, quat, uv, borderOffset, Color.white);
    }


	public void Add(UnityEngine.Rect rect, UnityEngine.Quaternion quat, UnityEngine.Rect uv)
	{
		this.Add(rect, quat, uv, UnityEngine.Color.white);
	}

	public void Add(UnityEngine.Rect rect, UnityEngine.Quaternion quat, UnityEngine.Rect uv, uint texId)
	{
		this.Add(rect, quat, uv, UnityEngine.Color.white, texId);
	}

	public void Add(UnityEngine.Rect rect, UnityEngine.Quaternion quat, UnityEngine.Rect uv, RectOffset borderOffset, UnityEngine.Color col)
	{
        Vector4 border = new Vector4(borderOffset.left, borderOffset.right, borderOffset.top, borderOffset.bottom);
        Vector3[] vecs = priv_toVectorArray(rect, border);
        Texture2D tex = m_rdCache.SourceImage;
        Vector2[] uvs = priv_toUVArray(uv, new Vector4(border.x / tex.width, border.y / tex.width,
                                                       border.z / tex.height, border.w / tex.height));
        Vector3 center = new Vector3((vecs[0].x + vecs[1].x)*0.5f, (vecs[0].y + vecs[2].y) * 0.5f, 0.0f);
        priv_PerformRotationOnVecs(vecs, center, quat);
        m_rdCache.AddArray(vecs, uvs, Enumerable.Repeat(col, vecs.Length).ToArray(), vertices9ForTris);
    }

    public void Add(UnityEngine.Rect rect, UnityEngine.Quaternion quat, UnityEngine.Rect uv, UnityEngine.Color col)
	{
		this.Add(rect, rect.center, quat, uv, col);
	}

	public void Add(UnityEngine.Rect rect, UnityEngine.Vector2 quatCenter, UnityEngine.Quaternion quat, UnityEngine.Rect uv, UnityEngine.Color col)
	{
		this.Add(rect, quatCenter, quat, uv, col, 0);
	}

	public void Add(UnityEngine.Rect rect, UnityEngine.Quaternion quat, UnityEngine.Rect uv, UnityEngine.Color col, uint texId)
	{
		this.Add(rect, rect.center, quat, uv, col, texId);
	}
	
	public void Add(UnityEngine.Rect rect, UnityEngine.Vector2 quatCenter, UnityEngine.Quaternion quat, UnityEngine.Rect uv, UnityEngine.Color col, uint texId)
	{
		Vector3[] vecs = priv_toVectorArray(rect);
		Vector2[] uvs = priv_toUVArray(uv);
		Vector3 center = new Vector3(quatCenter.x, quatCenter.y, 0.0f);
		priv_PerformRotationOnVecs(vecs, center, quat);
		UnityEngine.Color[] cols = new Color[]{col, col, col, col};
		uint[] texIds = new uint[verticesForTris.Length/3];
		for ( int i = 0; i != texIds.Length; ++i )
			texIds[i] = texId;
		m_rdCache.AddArray(vecs, uvs, cols, verticesForTris, texIds);
	}
	#endregion
	
	#region Add Tile
	public void Add(UnityEngine.Vector2 pos, Tile tile)
	{
		foreach ( var tn in tile.TileNodes )
			this.Add(pos, tn);
	}

	public void Add(UnityEngine.Rect rect, Tile tile)
	{
		foreach ( var tn in tile.TileNodes )
			this.Add(rect, tn);
	}

	public void Add(UnityEngine.Rect rect, Tile tile, UnityEngine.Color cols)
	{
		foreach ( var tn in tile.TileNodes )
			this.Add(rect, tn, cols);
	}

	public void Add(UnityEngine.Vector2 pos, UnityEngine.Quaternion quat, Tile tile)
	{
		foreach ( var tn in tile.TileNodes )
			this.Add(pos, quat, tn);
	}

	public void Add(UnityEngine.Rect rect, UnityEngine.Quaternion quat, Tile tile)
	{
		if ( tile == null )
			return;
		foreach ( var tn in tile.TileNodes )
			this.Add(rect, quat, tn);
	}

	public void Add(UnityEngine.Rect rect, UnityEngine.Quaternion quat, Tile tile, UnityEngine.Color col)
	{
		if ( tile == null )
			return;
		foreach ( var tn in tile.TileNodes )
			this.Add(rect, quat, tn, col);
	}
	#endregion
	#region Add Tile Node
	public void Add(UnityEngine.Vector2 pos, TileNode tile)
	{
		var rt = new Rect(tile.prop.LogicRect);
		rt.x = pos.x;
		rt.y = pos.y;
		rt = tile.prop.GetRealRect(rt);
		this.Add(rt, tile.prop.uvRect, tile.prop.texIdx);
	}

	public void Add(UnityEngine.Rect rect, TileNode tile)
	{
		var rt = tile.prop.GetRealRect(rect);
		this.Add(rt, tile.prop.uvRect, tile.prop.texIdx);
	}

	public void Add(UnityEngine.Rect rect, TileNode tile, UnityEngine.Color cols)
	{
		var rt = tile.prop.GetRealRect(rect);
		this.Add(rt, tile.prop.uvRect, cols, tile.prop.texIdx);
	}

	public void Add(UnityEngine.Vector2 pos, UnityEngine.Quaternion quat, TileNode tile)
	{
		var rt = new Rect(tile.prop.LogicRect);
		rt.x = pos.x;
		rt.y = pos.y;
		rt = tile.prop.GetRealRect(rt);
		this.Add(rt, quat, tile.prop.uvRect, tile.prop.texIdx);
	}

	public void Add(UnityEngine.Rect rect, UnityEngine.Quaternion quat, TileNode tile)
	{
		if ( tile == null )
			return;
		if ( tile.prop == null )
			return;
		var rt = tile.prop.GetRealRect(rect);
		this.Add(rt, rect.center, quat, tile.prop.uvRect, UnityEngine.Color.white, tile.prop.texIdx);
	}

	public void Add(UnityEngine.Rect rect, UnityEngine.Quaternion quat, TileNode tile, UnityEngine.Color col)
	{
		if ( tile == null )
			return;
		if ( tile.prop == null )
			return;
		var rt = tile.prop.GetRealRect(rect);
		this.Add(rt, rect.center, quat, tile.prop.uvRect, col, tile.prop.texIdx);
	}
	#endregion
	
    #region Draw
    public static void DrawWithMatrices(RenderRectMaker[] rrms, Matrix4x4 vsMatrix, Matrix4x4 ortMatrix)
    {
        for (int i = 0; i < rrms.Length; ++i)
        {
            var rrm = rrms[i];
            rrm.Cache.VSMatrix = vsMatrix;
            rrm.Cache.OrtMatrix = ortMatrix;
            rrm.Cache.Draw();
        }
    }

    public static void Draw(RenderRectMaker[] rrms)
    {
        for (int i = 0; i < rrms.Length; ++i)
        {
            var rrm = rrms[i];
            rrm.Cache.Draw();
        }
    }
    #endregion

	private Vector3[] priv_toVectorArray(Rect r)
	{
		return new Vector3[]
		{
			new Vector3(r.xMin, r.yMax, 0.0f),
			new Vector3(r.xMax, r.yMax, 0.0f),
			new Vector3(r.xMin, r.yMin, 0.0f),
			new Vector3(r.xMax, r.yMin, 0.0f)
		};
	}
	
    private Vector3[] priv_toVectorArray(Rect r, Vector4 border)
    {
        return new Vector3[]
        {
            new Vector3(r.xMin, r.yMax, 0.0f),
            new Vector3(r.xMax, r.yMax, 0.0f),
            new Vector3(r.xMin, r.yMin, 0.0f),
            new Vector3(r.xMax, r.yMin, 0.0f),
            new Vector3(r.xMin + border.x, r.yMax, 0f),
            new Vector3(r.xMax - border.y, r.yMax, 0f),
            new Vector3(r.xMax, r.yMax - border.w, 0f),
            new Vector3(r.xMax, r.yMin + border.z, 0f),
            new Vector3(r.xMax - border.y, r.yMin, 0f),
            new Vector3(r.xMin + border.x, r.yMin, 0f),
            new Vector3(r.xMin, r.yMin + border.z, 0f),
            new Vector3(r.xMin, r.yMax - border.w, 0f),
            new Vector3(r.xMin + border.x, r.yMax - border.w, 0f),
            new Vector3(r.xMax - border.y, r.yMax - border.w, 0f),
            new Vector3(r.xMax - border.y, r.yMin + border.z, 0f),
            new Vector3(r.xMin + border.x, r.yMin + border.z, 0f),
        };
    }

	private Vector2[] priv_toUVArray(Rect uv)
	{
		return new Vector2[]
		{
			new Vector2(uv.xMin, uv.yMin),
			new Vector2(uv.xMax, uv.yMin),
			new Vector2(uv.xMin, uv.yMax),
			new Vector2(uv.xMax, uv.yMax)
		};
	}

    private Vector2[] priv_toUVArray(Rect uv, Vector4 border)
    {
        return new Vector2[]
        {
            new Vector2(uv.xMin, uv.yMin),
            new Vector2(uv.xMax, uv.yMin),
            new Vector2(uv.xMin, uv.yMax),
            new Vector2(uv.xMax, uv.yMax),
            new Vector2(uv.xMin + border.x, uv.yMin),
            new Vector2(uv.xMax - border.y, uv.yMin),
            new Vector2(uv.xMax, uv.yMin + border.w),
            new Vector2(uv.xMax, uv.yMax - border.z),
            new Vector2(uv.xMax - border.y, uv.yMax),
            new Vector2(uv.xMin + border.x, uv.yMax),
            new Vector2(uv.xMin, uv.yMax - border.z),
            new Vector2(uv.xMin, uv.yMin + border.w),
            new Vector2(uv.xMin + border.x, uv.yMin + border.w),
            new Vector2(uv.xMax - border.y, uv.yMin + border.w),
            new Vector2(uv.xMax - border.y, uv.yMax - border.z),
            new Vector2(uv.xMin + border.x, uv.yMax - border.z),
        };
    }

    private void priv_PerformRotationOnVecs(Vector3[] vecs, Vector3 center, Quaternion quat) {
        for (int i = 0; i != vecs.Length; ++i )
        {
            Vector3 vdis = vecs[i] - center;
            Vector3 res = quat * vdis;
            vecs[i] = center + res;
        }
    }
}
