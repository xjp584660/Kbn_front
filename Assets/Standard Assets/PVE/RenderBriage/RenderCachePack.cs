
public class RenderCachePack
{
	private System.Collections.Generic.List<RenderCache> m_caches = new System.Collections.Generic.List<RenderCache>();
	private UnityEngine.Matrix4x4 m_worldMatrix = UnityEngine.Matrix4x4.identity;
	private bool m_isNeedUpdateMatrix = false;
	public void Add(RenderCache rdCache)
	{
		m_caches.Add(rdCache);
	}

	void priv_updateSetting()
	{
		if (m_isNeedUpdateMatrix)
		{
			foreach (var item in m_caches)
				item.VSMatrix = m_worldMatrix;
		}
		m_isNeedUpdateMatrix = false;
	}

	public void Draw()
	{
		priv_updateSetting();
		foreach (var item in m_caches)
		{
			item.Draw();
		}
	}

	public UnityEngine.Matrix4x4 WorldMatrix
	{
		get
		{
			return m_worldMatrix;
		}

		set
		{
			m_worldMatrix = value;
			m_isNeedUpdateMatrix = true;
		}
	}
}
