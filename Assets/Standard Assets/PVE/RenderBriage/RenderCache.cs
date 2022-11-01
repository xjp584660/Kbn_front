
public class RenderCache
{
	private class RenderBlock
	{
		public UnityEngine.Texture2D img;
		public uint	texIdx;
		public System.Collections.Generic.List<int> m_idt = new System.Collections.Generic.List<int>();
	}

	private System.Collections.Generic.LinkedList<RenderBlock> m_renderBlock = null;
	private System.Collections.Generic.List<UnityEngine.Texture2D> m_img = new System.Collections.Generic.List<UnityEngine.Texture2D>();
	private AtlasGroup	m_sourceGroup;
	private UnityEngine.Material m_met;
	private UnityEngine.Mesh m_msh;
	private UnityEngine.Matrix4x4 m_vsOrthMatrix = UnityEngine.Matrix4x4.identity;
	private UnityEngine.Matrix4x4 m_vsOrthAdjustMatrix = UnityEngine.Matrix4x4.identity;
	private UnityEngine.Matrix4x4 m_vsMatrix = UnityEngine.Matrix4x4.identity;
	private UnityEngine.Color m_bkColor = UnityEngine.Color.white;
	private System.Collections.Generic.List<UnityEngine.Vector3> m_vec = new System.Collections.Generic.List<UnityEngine.Vector3>();
	private System.Collections.Generic.List<UnityEngine.Vector2> m_uv = new System.Collections.Generic.List<UnityEngine.Vector2>();
	private System.Collections.Generic.List<UnityEngine.Color> m_color = new System.Collections.Generic.List<UnityEngine.Color>();
	private System.Collections.Generic.List<int> m_idt = new System.Collections.Generic.List<int>();
	private System.Collections.Generic.List<uint> m_texIdx = new System.Collections.Generic.List<uint>();

	private bool m_isNeedUpdateMesh;
	private bool m_isNeedUpdateImg;
	private bool m_isNeedUpdateMatrix;
	private bool m_isNeedUpdateColor = true;

	private System.Collections.Generic.LinkedList<RenderBlock> priv_doResetRenderBlock()
	{
		var renderBlocks = new System.Collections.Generic.LinkedList<RenderBlock>();
		for ( int i = 0; i < m_texIdx.Count; ++i )
		{
			RenderBlock rdBlock = new RenderBlock();
			var texId = m_texIdx[i];
			if ( (int)texId < m_img.Count )
				rdBlock.img = m_img[(int)texId];
			rdBlock.texIdx = texId;
			for ( ; i != m_texIdx.Count; ++i )
			{
				if ( texId != m_texIdx[i] )
				{
					--i;
					break;
				}

				rdBlock.m_idt.Add(m_idt[i*3+0]);
				rdBlock.m_idt.Add(m_idt[i*3+1]);
				rdBlock.m_idt.Add(m_idt[i*3+2]);
			}

			if ( rdBlock.m_idt.Count != 0 )
			{
				renderBlocks.AddLast(rdBlock);
			}
		}

		return renderBlocks;
	}

	public RenderCache()
		: this("UIDraw/DrawMultiUI")
	{
	}

	public RenderCache(string shaderName)
	{
		m_msh = new UnityEngine.Mesh();
		UnityEngine.Shader sd = UnityEngine.Shader.Find(shaderName);
		m_met = new UnityEngine.Material(sd);
		m_vsOrthMatrix = UnityEngine.Matrix4x4.Ortho(0, (float)UnityEngine.Screen.width, (float)UnityEngine.Screen.height, 0, 0, 100);
		m_isNeedUpdateMatrix = true;
	}

	public UnityEngine.Texture2D SourceImage
	{
		get
		{
			if ( m_img.Count == 0 )
				return null;
			return m_img[0];
		}
	}

	public UnityEngine.Texture2D[] SourceImages
	{
		get
		{
			return m_img.ToArray();
		}

		set
		{
			m_isNeedUpdateImg = true;
			m_sourceGroup = null;
			m_img.Clear();
			m_img.AddRange(value);
		}
	}

	public AtlasGroup SourceGroup
	{
		get
		{
			return m_sourceGroup;
		}

		set
		{
			m_isNeedUpdateImg = false;
			m_img.Clear();
			m_sourceGroup = value;
		}
	}
	
	public UnityEngine.Matrix4x4 VSMatrix
	{
		get
		{
			return m_vsMatrix;
		}
		
		set
		{
			m_vsMatrix = value;
			m_isNeedUpdateMatrix = true;
		}
	}
	
	public UnityEngine.Matrix4x4 OrtMatrix
	{
		get
		{
			return m_vsOrthAdjustMatrix;
		}
		
		set
		{
			m_vsOrthAdjustMatrix = value;
			m_isNeedUpdateMatrix = true;
		}
	}

	public UnityEngine.Color MulColor
	{
		get
		{
			return m_bkColor;
		}
		set
		{
			m_bkColor = value;
			m_isNeedUpdateColor = true;
		}
	}

    public void AddArray(UnityEngine.Vector3[] rect, UnityEngine.Vector2[] uvs, UnityEngine.Color[] colors, int[] indices, uint[] texIdx)
	{
		priv_AddArray(rect, uvs, colors, indices, texIdx);
	}

	public void AddArray(UnityEngine.Vector3[] rect, UnityEngine.Vector2[] uvs, UnityEngine.Color[] colors, int[] indices)
	{
		uint[] texIdx = new uint[indices.Length / 3];
		for ( int i = 0; i != texIdx.Length; ++i )
			texIdx[i] = 0;
		priv_AddArray(rect, uvs, colors, indices, texIdx);
    }

	private void priv_AddArray(UnityEngine.Vector3[] rect, UnityEngine.Vector2[] uvs, UnityEngine.Color[] colors, int[] indices, uint[] texIdx)
	{
		var last = m_vec.Count;
        foreach (var index in indices)
            m_idt.Add(last + index);
        
		foreach(var r in rect)
			m_vec.Add(r);

		foreach(var uv in uvs)
			m_uv.Add(uv);

		if ( colors != null )
		{
			foreach(var col in colors)
				m_color.Add(col);
		}
		else
		{
			for ( var i = 0; i != uvs.Length; ++i )
				m_color.Add(UnityEngine.Color.white);
		}

		m_texIdx.AddRange(texIdx);
		m_isNeedUpdateMesh = true;
	}

	public void AddTri(UnityEngine.Vector3[] pos, UnityEngine.Vector2[] uvs, UnityEngine.Color[] colors)
	{
		uint[] texIdx = new uint[pos.Length / 3];
		for ( int i = 0; i != texIdx.Length; ++i )
			texIdx[i] = 0;
		AddTri(pos, uvs, colors, texIdx);
	}

	public void AddTri(UnityEngine.Vector3[] pos, UnityEngine.Vector2[] uvs, UnityEngine.Color[] colors, uint[] texIdx)
	{
		var last = m_vec.Count;
		for (int i = 0; i != pos.Length; ++i)
			m_idt.Add(i + last);
		
		foreach(var r in pos)
			m_vec.Add(r);
		
		foreach(var uv in uvs)
			m_uv.Add(uv);
		
		foreach(var tidx in texIdx)
			m_texIdx.Add(tidx);
		
		if ( colors != null )
		{
			foreach(var col in colors)
				m_color.Add(col);
		}
		else
		{
			for ( var i = 0; i != pos.Length; ++i )
				m_color.Add(UnityEngine.Color.white);
		}
		
		m_isNeedUpdateMesh = true;
	}
	
	public void Draw()
	{
		if (!priv_makeValid())
            return;
		if ( m_renderBlock == null || m_renderBlock.Count == 0 )
			return;

		int submeshIdx = 0;
		for ( var node = m_renderBlock.First; node != null; node = node.Next, ++submeshIdx )
		{
			if ( m_sourceGroup != null )
				node.Value.img = m_sourceGroup.ValidateTexture(node.Value.texIdx);

			m_met.SetTexture("_MainTex", node.Value.img);
			if ( m_met.SetPass(0) )
			{
				UnityEngine.Graphics.DrawMeshNow(m_msh, m_vsOrthMatrix, submeshIdx);
			}
		}
	}

	public void Clear()
	{
		if ( m_idt.Count == 0 )
			return;
		m_isNeedUpdateMesh = true;
		m_vec.Clear();
		m_uv.Clear();
		m_color.Clear();
		m_idt.Clear();
		m_texIdx.Clear();
        m_msh = new UnityEngine.Mesh();
	}
	
	private bool priv_makeValid()
	{
		if ( m_isNeedUpdateMesh )
		{
            if (m_vec.Count == 0 || m_idt.Count == 0)
                return false;

			m_isNeedUpdateMesh = false;
			m_msh.vertices = m_vec.ToArray();
			m_msh.uv = m_uv.ToArray();
			m_msh.colors = m_color.ToArray();
			m_renderBlock = priv_doResetRenderBlock();
			m_msh.subMeshCount = m_renderBlock.Count;
			int subMesh = 0;
			foreach ( var renderBlock in m_renderBlock )
			{
				m_msh.SetIndices(renderBlock.m_idt.ToArray(), UnityEngine.MeshTopology.Triangles, subMesh);
				++subMesh;
			}
		}
		
		if ( m_isNeedUpdateImg )
		{
            if (m_img == null)
                return false;

			m_isNeedUpdateImg = false;
			m_met.SetTexture("_MainTex", m_img[0]);
		}
		
		if ( m_isNeedUpdateMatrix )
		{
			m_isNeedUpdateMatrix = false;
			UnityEngine.Matrix4x4 last = m_vsOrthMatrix * m_vsOrthAdjustMatrix * m_vsMatrix;
			m_met.SetMatrix("_Mat", last);
		}
		
		if ( m_isNeedUpdateColor )
		{
			m_isNeedUpdateColor = false;
			m_met.SetColor("_Color", m_bkColor);
		}

        return true;
	}
}
