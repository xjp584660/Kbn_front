
public class WindmillAnim
{
	struct RoundItem
	{
		public uint layer;
		public uint idx;
		public Tile tile;
		public float radius;
		public float rotate;
		public UnityEngine.Vector2 size;
	}
	
	class RenderLayer
	{
		public RenderRectMaker renderMaker;
		public UnityEngine.Color mulColor;
		public bool needUpdateColor;
		public bool noNeedDraw;
	}
	
	private uint m_sptCount;
	private float m_stepAngle;

	private UnityEngine.Rect m_areaSize;
	//private System.Collections.Generic.List<RenderCache> m_rdCache;
	private System.Collections.Generic.List<RenderLayer> m_rectMaker;

	private System.Collections.Generic.List<RoundItem> m_roundItems = new System.Collections.Generic.List<RoundItem>();
	private float m_radian;
	private float m_curRadian;
	private UnityEngine.Matrix4x4 m_vsMatrix;

	private UnityEngine.Color m_globalColor = UnityEngine.Color.white;
	private bool m_bIsNeedUpdateColor = false;

	private bool m_isNeedUpdate;
	public WindmillAnim(UnityEngine.Rect areaSize, uint sptCount)
	{
		//m_rdCache = new RenderCache();
		m_rectMaker = new System.Collections.Generic.List<RenderLayer>();//(m_rdCache);
		m_areaSize = areaSize;
		m_sptCount = sptCount;
		m_stepAngle = 360.0f / sptCount;
	}

	public void AddLayer(AtlasGroup atlasGroup)
	{
		var layer = priv_newRenderLayer();
		m_rectMaker.Add(layer);
		layer.renderMaker.Cache.SourceGroup = atlasGroup;
	}
	public void AddLayer(UnityEngine.Texture2D[] img)
	{
		var layer = priv_newRenderLayer();
		m_rectMaker.Add(layer);
		layer.renderMaker.Cache.SourceImages = img;
	}
	private RenderLayer priv_newRenderLayer()
	{
		var make = new RenderRectMaker();
		var layer = new RenderLayer();
		layer.renderMaker = make;
		layer.mulColor = UnityEngine.Color.white;
		return layer;
	}

	public void AddItem(Tile inTile, uint inLayer, UnityEngine.Vector2 inSize, uint inIdx, float inRadius, float aditionRotate)
	{
		aditionRotate = aditionRotate * UnityEngine.Mathf.Rad2Deg;
		m_roundItems.Add(new RoundItem(){idx = inIdx, tile = inTile, radius = inRadius, size = inSize, rotate = aditionRotate, layer = inLayer});
		m_isNeedUpdate = true;
	}
	public void AddItem(Tile inTile, uint inLayer, UnityEngine.Vector2 inSize, uint inIdx, float inRadius)
	{
		this.AddItem(inTile, inLayer, inSize, inIdx, inRadius, 0.0f);
	}
	
	public UnityEngine.Color MulColor
	{
		get
		{
			return m_globalColor;
			//return m_rectMaker[0].renderMaker.Cache.MulColor;
		}
		set
		{
			m_globalColor = value;
			m_bIsNeedUpdateColor = true;

			//foreach(var item in m_rectMaker)
			//	item.renderMaker.Cache.MulColor = value;
		}
	}
	
	public UnityEngine.Color GetColor(int layer)
	{
		var renderLayer = m_rectMaker[layer];
		return renderLayer.mulColor;
	}
	
	public void SetColor(UnityEngine.Color col, int layer)
	{
		var renderLayer = m_rectMaker[layer];
		renderLayer.mulColor = col;
		renderLayer.needUpdateColor = true;
		m_bIsNeedUpdateColor = true;
	}
	
	public void DisableLayer(int layer)
	{
		var renderLayer = m_rectMaker[layer];
		renderLayer.noNeedDraw = true;
	}
	
	public void EnableLayer(int layer)
	{
		var renderLayer = m_rectMaker[layer];
		renderLayer.noNeedDraw = false;
	}

	public void AddRound(float rad)
	{
		m_radian += rad;
		if ( UnityEngine.Mathf.Abs(m_radian - m_curRadian) < 1.0e-6 )
			return;

		if ( m_radian > System.Math.PI * 2.0f )
			m_radian -= (float)System.Math.PI * 2.0f;
		else if ( m_radian < -2.0f * System.Math.PI )
			m_radian += 2.0f * (float)System.Math.PI;
		m_curRadian = m_radian;
		m_isNeedUpdate = true;
	}
	
	public UnityEngine.Matrix4x4 VSMatrix
	{
		get
		{
			return m_vsMatrix;
			//return m_rectMaker[0].Cache.VSMatrix;
		}
		
		set
		{
			m_vsMatrix = value;
			m_isNeedUpdate = true;
			//foreach(var item in m_rectMaker)
			//	item.Cache.VSMatrix = value;
		}
	}

	public UnityEngine.Matrix4x4 OrtMatrix
	{
		get
		{
			return m_rectMaker[0].renderMaker.Cache.OrtMatrix;
		}
		
		set
		{
			foreach(var item in m_rectMaker)
				item.renderMaker.Cache.OrtMatrix = value;
		}
	}

	public float Round
	{
		set
		{
			m_radian = value;
			if ( System.Math.Abs(m_radian - m_curRadian) < 0.5f * (float)System.Math.PI/180.0f )
				return;

			float rdFloat = (float)(m_radian / (System.Math.PI * 2.0f));
			int rdInt = (int)rdFloat;
			var rdDis = rdFloat >= 0.0f?rdFloat - rdInt:rdFloat - rdInt + 1;
			m_radian = rdDis * 2.0f * (float)System.Math.PI;
			//if ( m_radian > System.Math.PI * 2.0f )
			//	m_radian -= (float)System.Math.PI * 2.0f;
			//else if ( m_radian < -2.0f * System.Math.PI )
			//	m_radian += 2.0f * (float)System.Math.PI;
			m_curRadian = m_radian;
			m_isNeedUpdate = true;
		}
		
		get
		{
			return m_radian;
		}
	}
	
	public void SetRect(UnityEngine.Rect rect)
	{
		if ( m_areaSize == rect )
			return;
		m_areaSize = rect;
		m_isNeedUpdate = true;
	}

	public void Clear()
	{
		m_roundItems.Clear();
		foreach(var item in m_rectMaker)
			item.renderMaker.Cache.Clear();
		m_radian = 0.0f;
		m_curRadian = 0.0f;
		m_isNeedUpdate = true;
	}

	public void Clear(int layer)
	{
		m_rectMaker[layer].renderMaker.Cache.Clear();
	}
	
	public void Draw()
	{
		priv_applyChange();
		foreach(var item in m_rectMaker )
		{
			if ( item.noNeedDraw )
				continue;
			item.renderMaker.Cache.Draw();
		}
	}
	
	private void priv_applyChange()
	{
		if ( m_bIsNeedUpdateColor )
		{
			m_bIsNeedUpdateColor = false;
			for ( int i = 0; i != m_rectMaker.Count; ++i )
			{
				var item = m_rectMaker[i];
				item.renderMaker.Cache.MulColor = m_globalColor;
				if ( !item.needUpdateColor )
					continue;
				item.needUpdateColor = false;
				item.renderMaker.Cache.MulColor *= item.mulColor;
			}
		}

		if ( !m_isNeedUpdate )
			return;
		m_isNeedUpdate = false;
		foreach ( var item in m_roundItems )
		{
			float angle = priv_getAngle(item.idx);
			var center = priv_getCenterPos(angle, item.radius);
			UnityEngine.Rect rt = new UnityEngine.Rect(center.x - item.size.x * 0.5f, center.y - item.size.y * 0.5f, item.size.x, item.size.y);
			var quat = UnityEngine.Quaternion.AngleAxis(-angle-item.rotate, UnityEngine.Vector3.back);
			if ( m_rectMaker.Count <= item.layer )
				m_rectMaker.Add(new RenderLayer(){renderMaker = new RenderRectMaker(), mulColor = UnityEngine.Color.white});
			m_rectMaker[(int)item.layer].renderMaker.Add(rt, quat, item.tile);
		}

		m_roundItems.Clear();

		var rod = UnityEngine.Quaternion.AngleAxis((float)(-m_curRadian * 180.0f/System.Math.PI), UnityEngine.Vector3.back);
		var trans = new UnityEngine.Vector3(m_areaSize.center.x, m_areaSize.center.y, 0.0f);
		var mtr = UnityEngine.Matrix4x4.TRS(UnityEngine.Vector3.zero, rod, UnityEngine.Vector3.one);
		var transMtx = UnityEngine.Matrix4x4.TRS(trans, UnityEngine.Quaternion.identity, UnityEngine.Vector3.one);
		var rst =  m_vsMatrix * transMtx * mtr;
		foreach(var item in m_rectMaker)
			item.renderMaker.Cache.VSMatrix = rst;
	}

	private UnityEngine.Vector3 priv_getCenterPos(float angle, float radius)
	{
		angle = (float)System.Math.PI * angle/180.0f;
		var rtv = new  UnityEngine.Vector3(radius * (float)System.Math.Sin(angle), -1.0f * radius * (float)System.Math.Cos(angle), 0.0f);
		return rtv;
	}
	
	private float priv_getAngle(uint idx)
	{
		idx %= m_sptCount;
		float angle = idx * m_stepAngle;
		return angle;
	}
}
