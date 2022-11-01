/// <summary>
/// 基本图元
/// </summary>
public class TileNode
{
	/// <summary>
	/// 图元名字
	/// </summary>
	private string m_name = string.Empty;
	/// <summary>
	/// 所在的大图
	/// </summary>
	private TileSprite m_sprite = null;
	/// <summary>
	/// 需要渲染的位置区域
	/// </summary>
	public UnityEngine.Rect rect = new UnityEngine.Rect();
	/// <summary>
	/// 基础图元属性
	/// </summary>
	private AtlasGroup.Image m_prop = null;
	/// <summary>
	/// 禁止外部创建
	/// </summary>
	private TileNode()
	{
	}
	/// <summary>
	/// 图元的名字
	/// </summary>
	/// <value>图元的基础名字.</value>
	public string name
	{
		get { return m_name; }
		set { this.TryChangeImage(value, false); }
	}
	/// <summary>
	/// 图元的大图集合
	/// </summary>
	/// <value>大图信息.</value>
	public TileSprite sprite
	{
		get { return m_sprite; }
	}
	/// <summary>
	/// 基础图元属性
	/// </summary>
	/// <value>图元属性.</value>
	public AtlasGroup.Image prop
	{
		get { return m_prop; }
	}
	/// <summary>
	/// 是否当前图元有效
	/// </summary>
	/// <value><c>true</c> if this instance is valid; otherwise, <c>false</c>.</value>
	public bool IsValid
	{
		get { return m_sprite != null; }
	}
	/// <summary>
	/// 得到当前图元所在的纹理
	/// </summary>
	/// <value>如果当前图元有效，则得到当前所在的纹理.如果此纹理不在内存中则返回空</value>
	public UnityEngine.Texture2D SourceImage
	{
		get
		{
			if (m_sprite == null)
			{
				return null;
			}
			
			return m_sprite.GetTextureInfo(m_prop.texIdx).texHandle;
		}
	}
	/// <summary>
	/// 尝试切换图元
	/// </summary>
	/// <returns><c>true</c>, 表示切换成功, <c>false</c> 表示切换失败，切换失败当前状态不会被修改.</returns>
	/// <param name="name">新图元的名字.</param>
	/// <param name="cpRect">If set to <c>true</c> 置换图元的渲染区域信息为目标的区域信息.</param>
	public bool TryChangeImage(string name, bool cpRect)
	{
		if ( string.IsNullOrEmpty(name) )
		{
			m_name = null;
			m_prop = null;
			return true;
		}
		
		TileNode tileNode = m_sprite.FindAnyTileNode(name);
		if (tileNode == null)
		{
			return false;
		}
		
		this.priv_Copy(tileNode, cpRect);
		return true;
	}
	/// <summary>
	/// 从已有的图元中复制信息
	/// </summary>
	/// <param name="o">原始图元.</param>
	/// <param name="cpyRect">If set to <c>true</c> 从原始图元中复制信息到当前图元.</param>
	private void priv_Copy(TileNode o, bool cpyRect)
	{
		m_name = o.m_name;
		m_sprite = o.m_sprite;
		m_prop = o.m_prop;
		if (cpyRect)
		{
			rect = o.rect;
		}
	}
	/// <summary>
	/// 创建一个基础图元
	/// </summary>
	/// <returns>新的图元.</returns>
	/// <param name="inName">图元的名字.</param>
	/// <param name="inProp">图元的基础属性.</param>
	/// <param name="source">大图的引用.</param>
	public static TileNode CreateTileNode(string inName, AtlasGroup.Image inProp, TileSprite source)
	{
		TileNode tileNode = new TileNode();
		tileNode.m_name = inName;
		tileNode.m_prop = inProp;
		tileNode.m_sprite = source;
		if (tileNode.m_prop != null)
		{
			tileNode.rect = tileNode.m_prop.LogicRect;
		}
		
		return tileNode;
	}
	/// <summary>
	/// 在默认位置渲染
	/// </summary>
	public void Draw()
	{
		if (m_sprite == null || m_name == null)
		{
			return;
		}
		m_sprite.Draw(this, rect);
	}
	/// <summary>
	/// 在指定位置渲染
	/// </summary>
	/// <param name="position">所指定的渲染区域.</param>
	public void Draw(UnityEngine.Rect position)
	{
		if (m_sprite == null || m_name == null)
		{
			return;
		}
		
		m_sprite.Draw(this, position);
	}
	/// <summary>
	/// 是否使用graphics模式渲染
	/// </summary>
	/// <param name="position">指定的渲染区域.</param>
	/// <param name="useGraphics">If set to <c>true</c> 使用 graphics draw(不受BeginGroup, EndGroup的截断影响).</param>
	public void Draw(UnityEngine.Rect position, bool useGraphics)
	{
		if (m_sprite == null || m_name == null)
		{
			return;
		}
		
		m_sprite.Draw(this, position, useGraphics);
	}
	/// <summary>
	/// 在指定的位置用指定的材质渲染
	/// </summary>
	/// <param name="position">渲染的区域.</param>
	/// <param name="mat">渲染所使用的材质.</param>
    public void Draw(UnityEngine.Rect position, UnityEngine.Material mat)
    {
        if (m_sprite == null || m_name == null)
        {
            return;
        }
        
        m_sprite.Draw(this, position, mat);
    }
	/// <summary>
	/// 在默认位置渲染
	/// </summary>
	/// <param name="useGraphics">If set to <c>true</c> 使用 graphics draw(不受BeginGroup, EndGroup的截断影响).</param>
	public void Draw(bool useGraphics)
	{
		if (m_sprite == null || m_name == null)
		{
			return;
		}
		
		m_sprite.Draw(this, rect,useGraphics);
	}
}
