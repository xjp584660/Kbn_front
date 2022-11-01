/// <summary>
/// 图组（对应被包含在<see cref="AtlasGroup"/>中)
/// </summary>
public class Tile
{
	private TileNode[] m_TileNodes = null;
	private AtlasGroup.Image m_SpriteImage = null;
	private TileSprite m_Sprite = null;

	/// <summary>
	/// 禁止外部构造
	/// </summary>
	private Tile()
	{
	}
	/// <summary>
	/// 此图组的名字
	/// </summary>
	/// <value>图组名.</value>
	public string name
	{
		get { return (m_TileNodes != null && m_TileNodes.Length > 0) ? m_TileNodes[0].name : null; }
		set { this.TryChangeImage(value, false); }
	}
	/// <summary>
	/// 所在的大图
	/// </summary>
	/// <value>大图.</value>
	public TileSprite sprite
	{
		get { return (m_TileNodes != null && m_TileNodes.Length > 0) ? m_TileNodes[0].sprite : null; }
	}
	/// <summary>
	/// 得到或者设置当前的图组的渲染矩形大小
	/// </summary>
	/// <value>此图元所占的矩形.</value>
	public UnityEngine.Rect rect
	{
		get { return (m_TileNodes != null && m_TileNodes.Length > 0) ? m_TileNodes[0].rect : new UnityEngine.Rect(); }
		set
		{
			foreach (TileNode tileNode in m_TileNodes)
			{
				tileNode.rect = value;
			}
		}
	}
	/// <summary>
	/// 得到此图组一个图元的基础属性
	/// </summary>
	/// <value>图元属性.</value>
	public AtlasGroup.Image prop
	{
		get { return (m_TileNodes != null && m_TileNodes.Length > 0) ? m_TileNodes[0].prop : null; }
	}
	/// <summary>
	/// 此图组是否有效
	/// </summary>
	/// <value><c>true</c> 此图组有合法的来源; otherwise, <c>false</c>.</value>
	public bool IsValid
	{
		get { return sprite != null; }
	}

	/// <summary>
	/// 得到图组第一个图元的纹理
	/// </summary>
	/// <value>对应的纹理.</value>
	public UnityEngine.Texture2D SourceImage
	{
		get
		{
			if ( m_TileNodes == null || m_TileNodes.Length <= 0 )
				return null;
			return m_TileNodes[0].sprite.GetTextureInfo(m_TileNodes[0].prop.texIdx).texHandle;
		}
	}
	/// <summary>
	/// 尝试切换到另一个图组
	/// </summary>
	/// <returns><c>true</c>, 切换成功了！, <c>false</c> otherwise.</returns>
	/// <param name="name">新的目标图组名.</param>
	/// <param name="cpRect">If set to <c>true</c> 将新图片的渲染区域设定为目标区域.</param>
	public bool TryChangeImage(string name, bool cpRect)
	{
		if (m_TileNodes == null)
		{
			return false; // Oops!
		}
		
		if ( m_Sprite != null )
		{
			var tileNodes = m_Sprite.FindTileNodes(name);
			if ( tileNodes != null )
			{
				m_TileNodes = tileNodes;
				return true;
			}
		}

		if (m_TileNodes.Length != 1)
		{
			m_TileNodes = new TileNode[1];
			m_TileNodes[0] = TileNode.CreateTileNode(name, m_SpriteImage, m_Sprite);
		}

		if ( m_TileNodes[0].TryChangeImage(name, cpRect) )
			return true;
		m_TileNodes[0] = TileNode.CreateTileNode("", null, m_Sprite);
		return false;
	}

	/// <summary>
	/// 尝试从大图中创建一个图组
	/// </summary>
	/// <returns>创建的新图组，如果失败则是null.</returns>
	/// <param name="inName">此图组的名字.</param>
	/// <param name="source">原始的大图.</param>
	public static Tile TryCreateTile(string inName, TileSprite source)
	{
		TileNode[] nodes = source.FindTileNodes(inName);
		if ( nodes == null )
			return null;

		Tile tile = new Tile();
		tile.m_Sprite = source;
		tile.m_TileNodes = nodes;
		for ( int i = 0; i != nodes.Length; ++i )
		{
			if ( nodes[i] == null )
				nodes[i] = source.FindAnyTileNode("icon_default");
		}
		return tile;
	}


	/// <summary>
	/// 从大图中创建一个图组
	/// </summary>
	/// <returns>创建的新图组.</returns>
	/// <param name="inName">此图组的名字.</param>
	/// <param name="inProp">图组的基础属性</param> 
	/// <param name="source">原始的大图.</param>
	/// <remarks>如果大图中没有此数据则直接创建一个新的图组</remarks>
	public static Tile CreateTile(string inName, AtlasGroup.Image inProp, TileSprite source)
	{
		Tile tile = new Tile();
		tile.m_SpriteImage = inProp;
		tile.m_Sprite = source;

		TileNode[] nodes = source.FindTileNodes(inName);
		if ( nodes == null )
		{
			tile.m_TileNodes = new TileNode[1];
			tile.m_TileNodes[0] = TileNode.CreateTileNode(inName, inProp, source);
			return tile;
		}

		tile.m_TileNodes = nodes;
		for ( int i = 0; i != nodes.Length; ++i )
		{
			if ( nodes[i] == null )
				nodes[i] = source.FindAnyTileNode("icon_default");
		}
		return tile;
	}
	/// <summary>
	/// 渲染此图，位置为此图组指定的 rect 区域
	/// </summary>
	public void Draw()
	{
		foreach (TileNode tileNode in m_TileNodes)
		{
			tileNode.Draw();
		}
	}
	
	/// <summary>
	/// 渲染此图，位置为此图组指定的 rect 区域
	/// </summary>
	/// <param name="position">绘制的目标区域</param>
	public void Draw(UnityEngine.Rect position)
	{
		foreach (TileNode tileNode in m_TileNodes)
		{
			tileNode.Draw(position);
		}
	}

	/// <summary>
	/// 渲染此图，位置为此图组指定的rect区域
	/// </summary>
	/// <param name="position">绘制的目标区域</param>
	/// <param name="useGraphices">是否使用 UnityEngine.Graphics 方式渲染，是，则不会受到 GUI.BeginGroup 的裁剪影响</param>
	public void Draw(UnityEngine.Rect position, bool useGraphics)
	{
		foreach (TileNode tileNode in m_TileNodes)
		{
			tileNode.Draw(position, useGraphics);
		}
	}
	/// <summary>
	/// 通过指定的材质在指定位置渲染
	/// </summary>
	/// <param name="position">绘制的目标区域</param>
	/// <param name="mat">绘制所用的材质</param>
    public void Draw(UnityEngine.Rect position, UnityEngine.Material mat)
    {
        foreach (TileNode tileNode in m_TileNodes)
        {
            tileNode.Draw(position, mat);
        }
    }
	/// <summary>
	/// 在默认位置渲染
	/// </summary>
	/// <param name="useGraphics">If set to <c>true</c> use graphics， 此方式不受GUI.BeginGroup的裁切影响.</param>
	public void Draw(bool useGraphics)
	{
		foreach (TileNode tileNode in m_TileNodes)
		{
			tileNode.Draw(useGraphics);
		}
	}
	/// <summary>
	/// 通过索引得到图元
	/// </summary>
	/// <returns>在指定索引位置的图元，如果索引越界，则返回空.</returns>
	/// <param name="index">图元所在的索引.</param>
	public TileNode GetTileNode(int index)
	{
		return (index < m_TileNodes.Length) ? m_TileNodes[index] : null;
	}
	/// <summary>
	/// 得到所有的图元
	/// </summary>
	/// <value>图元列表.</value>
	public System.Collections.Generic.IEnumerable<TileNode> TileNodes
	{
		get
		{
			return m_TileNodes;
		}
	}
}
