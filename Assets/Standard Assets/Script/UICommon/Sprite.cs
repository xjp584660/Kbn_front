
using UnityEngine;

/// <summary>
/// 大图组对具体项目相关的一些实现
/// </summary>
public class TileSprite
	: AtlasGroup
{
	/// <summary>
	/// 当前第一张纹理
	/// </summary>
	/// <value>第一张纹理.</value>
	private Texture2D m_img
	{
		get
		{
			return this.ValidateTexture(0);
		}
	}
	/// <summary>
	/// 缺图情况下使用的默认图标
	/// </summary>
	private static Texture2D gm_defaultIcon;
	static public Texture2D DefaultIcon
	{
		set
		{
			gm_defaultIcon = value;
		}
	}
	/// <summary>
	/// 基础渲染接口.
	/// </summary>
	/// <param name="tile">需要渲染的图组.</param>
	/// <param name="position">渲染的目标区域.</param>
	/// <param name="useGraphics">If set to <c>true</c> 使用Grahpics Draw(不受GUI.BeginGroup的裁切影响).</param>
	/// <param name="mat">渲染时使用的材质信息.</param>
	/// <remarks>当指定了渲染材质mat，必须同时开启useGraphics才算有效</remarks>
	private void DrawInternal(TileNode tile, Rect position, bool useGraphics, Material mat)
	{
		if( Event.current.type != EventType.Repaint )
			return;

		if (m_imgDatas == null || m_imgDatas.Count == 0)
		{
			if (m_img != null)
			{
				GUI.DrawTexture(position, m_img);
			}
			else
			{
				GUI.DrawTexture(position, gm_defaultIcon);
			}
			return;
		}

		if ( !tile.IsValid || tile.prop == null )
		{
			GUI.DrawTexture(position, gm_defaultIcon);
			return;
		}
		try
		{
			priv_drawSpriteImage(tile.prop, position, useGraphics, mat);
		}
		catch(System.NullReferenceException)
		{
			GUI.DrawTexture(position, gm_defaultIcon);
		}
	}
	/// <summary>
	/// 渲染图组.
	/// </summary>
	/// <param name="tile">待渲染图组.</param>
	/// <param name="position">渲染区域.</param>
	/// <param name="useGraphics">If set to <c>true</c> use graphics draw.</param>
    public void Draw(TileNode tile, Rect position, bool useGraphics)
    {
        DrawInternal(tile, position, useGraphics, null);
    }
	/// <summary>
	/// 渲染图组.
	/// </summary>
	/// <param name="tile">待渲染图组.</param>
	/// <param name="position">渲染区域.</param>
	/// <param name="mat">渲染使用的材质.</param>
    public void Draw(TileNode tile, Rect position, Material mat)
    {
        DrawInternal(tile, position, true, mat);
    }
	/// <summary>
	/// 渲染单个图元
	/// </summary>
	/// <param name="spriteImage">待渲染图元.</param>
	/// <param name="position">渲染的区域.</param>
	/// <param name="useGraphics">If set to <c>true</c> use graphics draw.</param>
	/// <param name="mat">渲染使用的材质信息.</param>

	private void priv_drawSpriteImage(Image spriteImage, Rect position, bool useGraphics, Material mat)
	{
		if ( spriteImage.cborder != null )
		{
			var newRO = new RectOffset(spriteImage.cborder.left, spriteImage.cborder.right, spriteImage.cborder.top, spriteImage.cborder.bottom);
			priv_drawSpriteImage(spriteImage, position, useGraphics, newRO, mat);
		}
		else
		{
			priv_drawSpriteImage(spriteImage, position, useGraphics, null, mat);
		}
	}

	private static RectOffset gm_zeroRectOffset = new RectOffset(0, 0, 0, 0);
	private static GUIStyle gm_guiStyle = new GUIStyle();
	private static Rect gm_rectForLabel = new Rect(0, 0, 0, 0);

	/// <summary>
	/// 渲染单个图元.
	/// </summary>
	/// <param name="spriteImage">待渲染图元.</param>
	/// <param name="position">渲染的区域.</param>
	/// <param name="useGraphics">If set to <c>true</c> use graphics draw.</param>
	/// <param name="ro">九宫格的外框.</param>
	/// <param name="mat">渲染使用的材质.</param>
	private void priv_drawSpriteImage(Image spriteImage, Rect position, bool useGraphics, RectOffset ro, Material mat)
	{
		var img = this.ValidateTexture(spriteImage.texIdx);
		Rect realPosition = spriteImage.GetRealRect (position, ref ro);
		if ( useGraphics )
		{
			if ( ro == null )
				ro = gm_zeroRectOffset;
			Graphics.DrawTexture(realPosition, img, spriteImage.uvRect, ro.left, ro.right, ro.top, ro.bottom, mat);
		}
		else if ( ro == null )
		{
			float u1 = spriteImage.rect.x;
			float v1 = spriteImage.rect.y;

			float wRatio = position.width/spriteImage.OrgRect.width;
			float hRatio = position.height/spriteImage.OrgRect.height;

			GUI.BeginGroup (realPosition);
			GUI.DrawTexture(new Rect(-u1*wRatio,-v1*hRatio , img.width*wRatio, img.height*hRatio), img );
			GUI.EndGroup ();
		}
		else
		{

			gm_guiStyle.border.left = (int)(ro.left + spriteImage.rect.x);
			gm_guiStyle.border.top = (int)(ro.top + spriteImage.rect.y);
			gm_guiStyle.border.right = (int)(img.width - (spriteImage.rect.x + spriteImage.rect.width) + ro.right);
			gm_guiStyle.border.bottom = (int)(img.height - (spriteImage.rect.y + spriteImage.rect.height) + ro.bottom);
			gm_guiStyle.normal.background = img;

			gm_rectForLabel.x = -spriteImage.rect.x;
			gm_rectForLabel.y = -spriteImage.rect.y;
			gm_rectForLabel.width = img.width + (realPosition.width - spriteImage.rect.width);
			gm_rectForLabel.height = img.height + (realPosition.height - spriteImage.rect.height);

			GUI.BeginGroup (realPosition);
			GUI.Label(gm_rectForLabel, (Texture2D)null, gm_guiStyle);
			GUI.EndGroup ();
		}
	}
	/// <summary>
	/// 根据图组名字渲染图组
	/// </summary>
	/// <param name="tileName">待渲染的图组名字.</param>
	/// <param name="position">渲染到的目标位置.</param>
	/// <param name="useGraphics">If set to <c>true</c> use graphics draw.</param>
	public void Draw(string tileName, Rect position, bool useGraphics)
	{
		if ( Event.current.type != EventType.Repaint || (m_imgDatas != null && (tileName == null ||tileName == "") ) )
			return;

		if (m_imgDatas.Count == 0)
		{
			if (m_img != null)
				GUI.DrawTexture(position, m_img);
			else
				GUI.DrawTexture(position, gm_defaultIcon);
			return;
		}

		Image[] spriteImages = null;
		if ( !prot_tryGetImages(tileName, out spriteImages) )
		{
			GUI.DrawTexture(position, gm_defaultIcon);
			return;
		}

		try
		{
			for ( int i = 0; i != spriteImages.Length; ++i )
				priv_drawSpriteImage(spriteImages[i], position, useGraphics, null);
		}
		catch(System.NullReferenceException)
		{
			GUI.DrawTexture(position, gm_defaultIcon);
		}
	}
	/// <summary>
	/// 渲染目标图组到对应区域
	/// </summary>
	/// <param name="tile">待渲染图组.</param>
	/// <param name="position">渲染的目标位置.</param>
	public void Draw(TileNode tile, Rect position)
	{
		 Draw(tile, position, false);
	}
	/// <summary>
	/// 渲染制定名字的图组到对应的区域
	/// </summary>
	/// <param name="tileName">待渲染图组名.</param>
	/// <param name="position">渲染的目标位置.</param>
	public void Draw(string tileName, Rect position)
	{
		 Draw(tileName, position, false);
	}
	/// <summary>
	///	查找图组中的任意一个图元
	/// </summary>
	/// <returns>待查找的图元,找不到图组则返回为null.</returns>
	/// <param name="name">图组名字.</param>
	public TileNode FindAnyTileNode(string name)
	{
		Image[] prop = null;
		if ( !this.prot_tryGetImages(name, out prop) )
			return null;
		return TileNode.CreateTileNode(name, prop[0], this);
	}
	/// <summary>
	/// 查找图组中的所有图元
	/// </summary>
	/// <returns>图元组,如果图组不存在则返回null.</returns>
	/// <param name="name">图组名字.</param>
	public TileNode[] FindTileNodes(string name)
	{
		if ( name == null )
			return null;
		Image[] prop = null;
		if ( !this.prot_tryGetImages(name, out prop) )
			return null;
		TileNode[] nodes = new TileNode[prop.Length];
		for ( int i = 0; i != prop.Length; ++i )
			nodes[i] = TileNode.CreateTileNode(name, prop[i], this);
		return nodes;
	}
	/// <summary>
	/// 获得对应图组中的图元
	/// </summary>
	/// <returns>图元组,如果图组不存在则返回默认缺省图元组.</returns>
	/// <param name="name">Name.</param>
	public TileNode[] GetTileNodes(string name)
	{
		if ( name == null )
			return new TileNode[]{TileNode.CreateTileNode("", null, this)};
		TileNode[] tileNode = FindTileNodes(name);
		if ( tileNode == null )
			return new TileNode[]{TileNode.CreateTileNode(name, null, this)};
		return tileNode;
	}
	/// <summary>
	/// 根据名字查找图组
	/// </summary>
	/// <returns>指定名字的图组,如果不存在对应名字的图组则返回null.</returns>
	/// <param name="name">图组名字.</param>
	public Tile FindTile(string name)
	{
		return Tile.TryCreateTile(name, this);
	}

	/// <summary>
	/// 根据名字查找图组
	/// </summary>
	/// <returns>指定名字的图组,如果不存在对应名字的图组则返回默认空白图组.</returns>
	/// <param name="name">图组名字.</param>
	public Tile GetTile(string name)
	{
		if (name == null)
		{
			return Tile.CreateTile(null, null, this);
		}
		
		var tile = FindTile(name);
		if (tile != null)
		{
			return tile;
		}

		return Tile.CreateTile(name, null, this);
	}
	/// <summary>
	/// 根据纹理创建一个大图，以作他用
	/// </summary>
	/// <returns>大图.</returns>
	/// <param name="image">源纹理.</param>
	static public TileSprite CreateSprite(Texture2D image) 
	{ 
		TileSprite newSpt = new TileSprite();
		newSpt.m_textureInfo = new System.Collections.Generic.List<TextureInfo>();
		TextureInfo tInfo = new TextureInfo();
		tInfo.texIdx = 0;
		tInfo.name = "";
		tInfo.texHandle = image;
		tInfo.width = (uint)image.height;
		tInfo.height = (uint)image.width;
		newSpt.m_textureInfo.Add(tInfo);
		return newSpt;
	}
	/// <summary>
	/// 根据大图描述文件加载大图簇
	/// </summary>
	/// <returns>大图簇.</returns>
	/// <param name="dat">大图簇的信息.</param>
	static public TileSprite CreateSprite(TextAsset dat)
	{
		TileSprite newSpt = new TileSprite();
		System.IO.MemoryStream ms = new System.IO.MemoryStream(dat.bytes);
		newSpt.Read(ms);
		return newSpt;
	}
	/// <summary>
	/// 通过纹理和名字创建图组
	/// </summary>
	/// <returns>指定的图组.</returns>
	/// <param name="image">源纹理.</param>
	/// <param name="name">图组名.</param>
	static public Tile CreateTile(Texture2D image, string name)
	{
		var spt = TileSprite.CreateSprite(image);
		Tile tile = Tile.CreateTile(name, null, spt);
		tile.rect = new Rect(0.0f, 0.0f, (float)image.width, (float)image.height);
		return tile;
	}
}
