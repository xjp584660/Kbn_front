using UnityEngine;
using System.Collections;


/// <summary>
/// Atlas group.
/// 	Contains multi atlas.
/// </summary>
public class AtlasGroup
{
	//[System.FieldAttribute]
	public enum ImageField : byte
	{
		None = 0,
		/// <summary>
		/// 此图元存在空白边界.
		/// </summary>
		HaveBorder = 1,
		/// <summary>
		///  是否存在9宫格边界.
		/// </summary>
		HaveCBorder = 2,
	}

	/// <summary>
	/// 纹理信息
	/// </summary>
	public class TextureInfo
	{
		/// <summary>
		/// 纹理索引，从0开始，具体取决于打包时候的配置
		/// </summary>
		public	int			texIdx;
		/// <summary>
		/// 纹理名字，实用此名字从资源包中寻找资源，比如 icons_default
		/// </summary>
		public	string 		name;
		/// <summary>
		/// 纹理打包时候的宽度.
		/// </summary>
		public	uint 		width;
		/// <summary>
		/// 纹理打包时候的高度.
		/// </summary>
		public	uint 		height;
		/// <summary>
		/// 纹理在内存中的宽度（支持low版本压缩，压缩之后的大小）.
		/// </summary>
		public	uint		inMemWidth;
		/// <summary>
		/// 纹理在内存中的高度（支持low版本压缩，压缩之后的大小）.
		/// </summary>
		public	uint		inMemHeight;

		/// <summary>
		/// 纹理的 handle.
		/// </summary>
		/// <value>The texure handle.</value>
		public	Texture2D	texHandle
		{
			get
			{
				m_tickCnt = 0;
				return m_texHandle;
			}

			set
			{
				m_tickCnt = 0;
				m_texHandle = value;
			}
		}

		public TextureInfo()
		{
		}
		/// <summary>
		/// Initializes a new instance of the <see cref="AtlasGroup+TextureInfo"/> class.
		/// </summary>
		/// <param name="other">从此纹理中抓取数据.</param>
		/// <param name="newTexIdx">将此索引替换掉原纹理中的索引.</param>
		public TextureInfo(TextureInfo other, int newTexIdx)
		{
			texIdx = newTexIdx;
			name = other.name;
			width = other.width;
			height = other.height;
			inMemWidth = other.inMemWidth;
			inMemHeight = other.inMemHeight;
		}
		/// <summary>
		/// Update this instance.
		/// </summary>
		/// <remarks>
		/// 每调用一次，将记为一个时钟，当间隔设定好的时钟周之后，如果没有外部访问纹理对象，则该纹理被释放
		/// 间隔时间为<see cref="AtlasGroup+TextureInfo+gm_runOverTickCnt"/>变量
		/// </remarks>
		public	void Update()
		{
			if ( m_texHandle == null || ++m_tickCnt < gm_runOverTickCnt )
				return;
			this.ClearTexture();
		}
		/// <summary>
		/// 释放纹理资源
		/// </summary>
		public void ClearTexture()
		{
			UnityEngine.Resources.UnloadAsset(m_texHandle);
			m_texHandle = null;
		}

		/// <summary>
		/// 间隔多少个时间周期周后删除此纹理.
		/// </summary>
		static private int	gm_runOverTickCnt = 3;
		/// <summary>
		/// 当前纹理已经多少个时间周期没有被访问到了.
		/// </summary>
		private int			m_tickCnt;
		private	Texture2D 	m_texHandle;
	}
	/// <summary>
	/// 图元信息
	/// </summary>
	public class Image
	{
		/// <summary>
		/// 此图元所在的纹理索引
		/// </summary>
		public uint			texIdx;
		/// <summary>
		/// 此图元所在当前纹理中的位置和大小（按照原始尺寸计算 [<see cref="AtlasGroup+TextureInfo+inMemWidth"/>, <see cref="AtlasGroup+TextureInfo+inMemHeight"/>] ）
		/// 排除了空白边界元素<see cref="AtlasGroup+Image+border"/>
		/// </summary>
		public Rect 		rect;
		/// <summary>
		/// 空白边界
		/// </summary>
		public RectOffset 	border;
		/// <summary>
		/// 此图元在纹理中的uv位置和大小
		/// </summary>
		public Rect 		uvRect;
		/// <summary>
		/// 此图元所在原始纹理中的位置和大小（按照原始尺寸计算 [<see cref="AtlasGroup+TextureInfo+width"/>, <see cref="AtlasGroup+TextureInfo+height"/>] ）
		/// 排除了空白边界元素<see cref="AtlasGroup+Image+border"/>
		/// </summary>
		public Rect 		OrgRect;
		/// <summary>
		/// 九宫格边界尺寸，包含了空白边界<see cref="AtlasGroup+Image+border"/>
		/// </summary>
		public RectOffset	cborder;
		/// <summary>
		/// 逻辑尺寸，包含了空白边界的原始尺寸
		/// </summary>
		public Rect 		LogicRect;

		/// <summary>
		/// 将此图元放入一个指定的区域之后实际的位置信息情况.
		/// </summary>
		/// <returns>图元最终的矩形区域.</returns>
		/// <param name="position">原图元需要绘制的区域.</param>
		public UnityEngine.Rect GetRealRect(UnityEngine.Rect position)
		{
			float wRatio = position.width/this.OrgRect.width;
			float hRatio = position.height/this.OrgRect.height;
			Rect realPosition = new Rect (
				position.x + this.border.left * wRatio
				, position.y + this.border.top * hRatio
				, position.width - (this.border.left + this.border.right) * wRatio
				, position.height - (this.border.top + this.border.bottom) * hRatio
				);
			return realPosition;
		}


		/// <summary>
		/// 根据9宫格边界得到一个图元放入指定区域之后实际的位置情况.
		/// </summary>
		/// <returns>图元最终的矩形区域.</returns>
		/// <param name="position">原图元需要绘制的区域.</param>
		/// <param name="ro">9宫格区域.</param>
		public UnityEngine.Rect GetRealRect(UnityEngine.Rect position, ref UnityEngine.RectOffset ro)
		{
			if ( ro == null )
				return this.GetRealRect(position);

			//float wRatio = this.OrgRect.width/this.LogicRect.width;
			//float hRatio = this.OrgRect.width/this.LogicRect.height;
			if ( this.border.left > ro.left )
			{
				position.x += this.border.left;
				position.width -= this.border.left;
				ro.left = 0;
			}
			else
			{
				ro.left -= this.border.left;
			}

			if ( this.border.top > ro.top )
			{
				position.y += this.border.top;
				position.height -= this.border.top;
				ro.left = 0;
			}
			else
			{
				ro.top -= this.border.top;
			}

			if ( this.border.right > ro.right )
			{
				position.width -= this.border.right - ro.right;
				ro.right = 0;
			}
			else
			{
				ro.right -= this.border.right;
			}

			if ( this.border.bottom > ro.bottom )
			{
				position.height -= this.border.bottom - ro.bottom;
				ro.bottom = 0;
			}
			else
			{
				ro.bottom -= this.border.bottom;
			}
			return position;
		}

		public Image()
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="AtlasGroup+Image"/> class.
		/// </summary>
		/// <param name="other">从此图元信息复制数据.</param>
		/// <param name="newTexIdx">替换一个新的所在纹理索引.</param>
		public Image(Image other, uint newTexIdx)
		{
			texIdx = newTexIdx;
			rect = other.rect;
			border = other.border;
			cborder = other.cborder;
			uvRect = other.uvRect;
			OrgRect = other.OrgRect;
			LogicRect = other.LogicRect;
		}
	}

	/// <summary>
	/// 根节点路径，以 Resource 为起点
	/// </summary>
	protected string m_rootPath;
	/// <summary>
	/// 所有纹理信息，下标对应着纹理索引
	/// </summary>
	protected System.Collections.Generic.List<TextureInfo> m_textureInfo = null;
	/// <summary>
	/// 所有图元信息
	/// 下标对应着后面的名字到索引中的索引
	/// </summary>
	protected System.Collections.Generic.List<Image> m_imgDatas = null;
	/// <summary>
	/// 从图元名字到索引列表，索引列表靠前则渲染的时候位于底层，对应的值为图元信息中的下标
	/// </summary>
	protected System.Collections.Generic.Dictionary<string, int[]> m_name2Idx = null;
	/// <summary>
	/// 是否从资源中初始化过
	/// </summary>
	/// <remarks>>
	/// 如果某些纹理的大小和记录中的，则需要重新加载确认一下。
	/// low 版本下的OTA需要从内存中加载
	/// </remarks>
	private bool m_isLoadFromResource = false;
	/// <summary>
	/// 跟路径（相对于Resource)
	/// </summary>
	/// <value>The root path.</value>
	public string RootPath{get{return m_rootPath;}}
	/// <summary>
	/// 根据纹理索引获得纹理
	/// </summary>
	/// <returns>纹理信息.</returns>
	/// <param name="idx">纹理索引号.</param>
	public TextureInfo GetTextureInfo(uint idx)
	{
		if ( m_textureInfo == null || idx >= m_textureInfo.Count )
			return null;
		return m_textureInfo[(int)idx];
	}

	/// <summary>
	/// 得到所有的纹理信息列表
	/// </summary>
	/// <value>纹理信息列表（只读）.</value>
	public System.Collections.Generic.IEnumerable<TextureInfo> TextureInfos
	{
		get
		{
			return m_textureInfo;
		}
	}
	/// <summary>
	/// 得到所有的纹理
	/// </summary>
	/// <value>得到所有的纹理.</value>
	/// <remarks>某些不在内存中的纹理会返回空.</remarks>
	public Texture2D[] SourceImages
	{
		get
		{
			if ( m_textureInfo == null )
				return null;
			var texs = new Texture2D[m_textureInfo.Count];
			for ( int i = 0; i != m_textureInfo.Count; ++i )
				texs[i] = m_textureInfo[i].texHandle;
			return texs;
		}
	}
	/// <summary>
	/// 根据索引获取纹理
	/// </summary>
	/// <returns>索引所对应的纹理对象.</returns>
	/// <param name="texIdx">纹理索引.</param>
	/// <remarks>
	/// 如果不在当前内存中，则加载之后返回；
	/// 此操作会重置纹理的延迟卸载计数器为0
	/// </remarks>
	public Texture2D ValidateTexture(uint texIdx)
	{
		if ( m_textureInfo == null || m_textureInfo.Count <= texIdx )
			return null;
		var texInfo = m_textureInfo[(int)texIdx];
		if ( texInfo.texHandle != null )
			return texInfo.texHandle;
		var texMgr = TextureMgr.instance();
		var fileName = System.IO.Path.GetFileNameWithoutExtension(texInfo.name);
		texInfo.texHandle = texMgr.LoadTexture(fileName, m_rootPath + "/");
		return texInfo.texHandle;
	}


	public Texture2D GetTextureByName(string name)
	{	
		// if(IsTileExist(name))
		// {
		// 	return ValidateTexture((unit)(m_name2Idx[name][0]));
		// }
		Image img;
		
		if(prot_tryGetFirstImage(name,out img))
		{
			return ValidateTexture(img.texIdx);
		}
		return null;
	}
	/// <summary>
	/// 对应的纹理是否是OTA中的.
	/// </summary>
	/// <returns><c>true</c> 此纹理来自OTA,或OTA中有此纹理; otherwise, <c>false</c>.</returns>
	/// <param name="texIdx">纹理索引.</param>
	public bool IsOTA(uint texIdx)
	{
		if ( m_textureInfo == null || m_textureInfo.Count <= texIdx )
			return false;
		var texInfo = m_textureInfo[(int)texIdx];
		//if ( texInfo.texHandle != null )
		//	return texInfo.texHandle;
		var texMgr = TextureMgr.instance();
		var fileName = System.IO.Path.GetFileNameWithoutExtension(texInfo.name);
		return texMgr.IsOTA(fileName, m_rootPath + "/");
	}
	/// <summary>
	/// 卸载所有在内存中的纹理
	/// </summary>
	public void ClearTextures()
	{
		for ( int i = 0; i != m_textureInfo.Count; ++i )
			m_textureInfo[i].ClearTexture();
	}
	/// <summary>
	/// 将一个目标纹理合并到本纹理上.
	/// </summary>
	/// <param name="ag">需要合并过来的纹理.</param>
	/// <param name="chgdTexture">需要修改的纹理名字.</param>
	public void Combine(AtlasGroup ag, string[] chgdTexture)
	{
		//	search new texture.
		if ( ag.m_textureInfo == null || ag.m_textureInfo.Count == 0 )
			return;
		if ( ag.m_name2Idx == null || ag.m_name2Idx.Count == 0 )
			return;

		var newTexture = new System.Collections.Generic.Dictionary<uint, TextureInfo>();	//	new index-> texture info
		var texIdxChanged = new System.Collections.Generic.Dictionary<uint, uint>();	//	new index -> old index
		//	index changed, and new texture.
		for ( uint i = 0; i != ag.m_textureInfo.Count; ++i )
		{
			uint selfIdx = 0;
			for ( ; selfIdx != m_textureInfo.Count; ++selfIdx )
			{
				if ( ag.m_textureInfo[(int)i].name != m_textureInfo[(int)selfIdx].name )
					continue;

				if ( i != selfIdx )
				{
					texIdxChanged.Add(i, selfIdx);
					break;
				}

				for ( int m = 0; m != chgdTexture.Length; ++m )
				{
					if ( ag.m_textureInfo[(int)i].name == chgdTexture[m] )
					{
						texIdxChanged.Add(i, i);
						break;
					}
				}
				break;
			}

			if ( selfIdx == m_textureInfo.Count )
			{
				newTexture.Add(i, ag.m_textureInfo[(int)i]);
			}
		}

		//	cast new to changed.
		foreach ( System.Collections.Generic.KeyValuePair<uint, TextureInfo> tex in newTexture )
		{
			var idx = m_textureInfo.Count;
			texIdxChanged.Add(tex.Key, (uint)idx);
			m_textureInfo.Add(new TextureInfo(tex.Value, idx));
		}

		System.Collections.Generic.List<Image> refNewImg = new System.Collections.Generic.List<Image>();
		//	combine image info.
		foreach ( System.Collections.Generic.KeyValuePair<string, int[]> tex2Name in ag.m_name2Idx )
		{
			refNewImg.Clear();
			for ( int c = 0; c != tex2Name.Value.Length; ++c )
			{
				//remove texture which ref to old texture
				var newIdx = tex2Name.Value[c];
				var newImgData = ag.m_imgDatas[newIdx];
				if ( !texIdxChanged.ContainsKey(newImgData.texIdx) )
				{	//	old texture, we shouldn't use this.
					refNewImg.Clear();
					break;
				}
				var chgdTexIdx = texIdxChanged[newImgData.texIdx];
				refNewImg.Add(new Image(newImgData, chgdTexIdx));
				//imgIdxChanged.Add(m_imgDatas.Length, new Image(newImgData, chgdTexIdx));
			}

			if ( refNewImg.Count == 0 )
				continue;
			int[] newIdxs = new int[refNewImg.Count];
			for ( int c = 0; c != newIdxs.Length; ++c )
				newIdxs[c] = m_imgDatas.Count + c;
			m_imgDatas.AddRange(refNewImg);
			m_name2Idx[tex2Name.Key] = newIdxs;
		}

		var texIds = new System.Collections.Generic.List<int>();
		foreach ( var k in texIdxChanged.Keys )
			texIds.Add((int)k);

		priv_loadFromResource(texIds.ToArray());
	}

	/// <summary>
	/// 描述文件版本号，每次修改 byte 文件都需要增加此版本号
	/// </summary>
	protected const byte GM_FILE_VERSION = 1;

	/// <summary>
	/// 从流中读取描述文件
	/// </summary>
	/// <param name="file">源文件流.</param>
	public void Read(System.IO.Stream file)
	{
		int tmpVersion = file.ReadByte();
		if ( tmpVersion < 0 )
			return;
		byte fileVersion = (byte)tmpVersion;
		if ( fileVersion > GM_FILE_VERSION )
		{
			fileVersion = 0;
			file.Seek(-1, System.IO.SeekOrigin.Current);
		}

		var binFile = new System.IO.BinaryReader(file);
		using ( binFile )
		{
			string path = binFile.ReadString();
			uint cnt = binFile.ReadUInt32();
			var textureInfo = new System.Collections.Generic.List<TextureInfo>((int)cnt);
			for ( int texCnt = 0; texCnt != cnt; ++texCnt )
			{
				var texInfo = binFile.ReadTextureInfo();
				textureInfo.Add(texInfo);
			}
			cnt = binFile.ReadUInt32();
			var imgs = new System.Collections.Generic.List<Image>();
			for ( int imgCnt = 0; imgCnt != cnt; ++imgCnt )
			{
				var img = binFile.ReadImage(fileVersion);
				imgs.Add(img);
			}

			var name2Idx = new System.Collections.Generic.Dictionary<string, int[]>();
			cnt = binFile.ReadUInt32();
			for ( int nameCnt = 0; nameCnt != cnt; ++nameCnt )
			{
				string name = binFile.ReadString();
				byte idxcnt = binFile.ReadByte();
				int[] idxs = new int[idxcnt];
				for ( int idxPos = 0; idxPos != idxcnt; ++idxPos )
					idxs[idxPos] = binFile.ReadInt32();
				name2Idx.Add(name, idxs);
			}

			m_rootPath = path;
			m_textureInfo = textureInfo;
			m_imgDatas = imgs;
			m_name2Idx = name2Idx;
		}

		foreach ( var img in m_imgDatas )
		{
			var texInfo = m_textureInfo[(int)img.texIdx];
			uint width = texInfo.inMemWidth;
			uint height = texInfo.inMemHeight;
			img.RecalcRect(width, height, texInfo.width, texInfo.height);
		}
	}
	/// <summary>
	/// 从当前资源中加载运行时信息（在OTA或者low版本的情况下需要调用）
	/// </summary>
	public void LoadFromResource()
	{
		if ( m_isLoadFromResource )
			return;
		m_isLoadFromResource = true;
		int[] texIds = new int[m_textureInfo.Count];
		for ( int i = 0; i != texIds.Length; ++i )
			texIds[i] = i;
		priv_loadFromResource(texIds);
	}

	/// <summary>
	/// 从当前资源中加载对应的纹理id的运行时信息
	/// </summary>
	/// <param name="texIds">需要加载的纹理id.</param>
	private void priv_loadFromResource(int[] texIds)
	{
		var texMgr = TextureMgr.instance();
		if ( m_imgDatas == null )
			return;

		var ltImg = new System.Collections.Generic.List<System.Collections.Generic.List<Image> >(m_textureInfo.Count);
		for ( int i = 0; i != m_textureInfo.Count; ++i )
		{
			if ( m_textureInfo[i].texHandle != null )
				ltImg.Add(null);
			else
				ltImg.Add(new System.Collections.Generic.List<Image>());
		}

		foreach ( var img in m_imgDatas )
		{
			var texIdx = (int)img.texIdx;
			var texInfo = m_textureInfo[(int)img.texIdx];
			var tex2D = m_textureInfo[texIdx].texHandle;
			if ( tex2D == null )
			{
				ltImg[texIdx].Add(img);
			}
			else
			{
				uint width = (uint)tex2D.width;
				uint height = (uint)tex2D.height;
				img.RecalcRect(width, height, texInfo.width, texInfo.height);
			}
		}

		for ( int i = 0; i != ltImg.Count; ++i )
		{
			if ( ltImg[i] == null )
				continue;
			bool isNeedAdjust = false;
			for ( int xx = 0; xx != texIds.Length; ++xx )
			{
				if ( texIds[xx] == i )
				{
					isNeedAdjust = true;
					break;
				}
			}

			if ( !isNeedAdjust )
				continue;

			var fileName = System.IO.Path.GetFileNameWithoutExtension(m_textureInfo[i].name);
			var texImg = texMgr.LoadTexture(fileName, m_rootPath + "/");
			if ( texImg == null )
				continue;
			if ( texImg.width == m_textureInfo[i].inMemWidth && texImg.height == m_textureInfo[i].inMemHeight )
			{
				UnityEngine.Resources.UnloadAsset(texImg);
				continue;
			}

			for ( int x = 0; x != ltImg[i].Count; ++x )
			{
				uint width = (uint)texImg.width;
				uint height = (uint)texImg.height;
				ltImg[i][x].RecalcRect(width, height, m_textureInfo[i].width, m_textureInfo[i].height);
			}
			UnityEngine.Resources.UnloadAsset(texImg);
		}
	}
	/// <summary>
	/// 检测对应名字的图组是否存在
	/// </summary>
	/// <returns><c>true</c> 当前图组集合中存在此图; otherwise, <c>false</c>.</returns>
	/// <param name="name">图组名字.</param>
	public bool IsTileExist(string name)
	{
		return m_name2Idx != null && m_name2Idx.ContainsKey(name);
	}
	/// <summary>
	/// 得到图组的原始尺寸
	/// </summary>
	/// <returns>原始尺寸，如果此图找不到则返回默认矩形.</returns>
	/// <param name="tileName">Tile name.</param>
	public Rect GetFullRect(string tileName)
	{
		Image img = null;
		if ( prot_tryGetFirstImage(tileName, out img) )
			return img.LogicRect;
		return new Rect();
	}
	/// <summary>
	/// 根据图组名字得到图组的uv
	/// </summary>
	/// <returns>此图组UV.</returns>
	/// <param name="tileName">图组名字.</param>
	/// <remarks>不建议使用，此函数仅能够返回图组中第一个图元的uv,不支持多层的图组.</remarks>
	public Rect GetRelativeSourceRect(string tileName)
	{
		Image img = null;
		if ( prot_tryGetFirstImage(tileName, out img) )
			return img.uvRect;
		return new Rect();
	}
	/// <summary>
	/// Update this instance.
	/// </summary>
	/// <remarks>建议和渲染帧同步，不要错开帧，此帧会导致纹理资源释放等副作用.</remarks>
	public void Update()
	{
		for ( int i = 0; i != m_textureInfo.Count; ++i )
			m_textureInfo[i].Update();
	}
	/// <summary>
	/// 得到图组中的第一个图元
	/// </summary>
	/// <returns><c>true</c>, 是否存在此图组名字, <c>false</c> otherwise.</returns>
	/// <param name="tileName">图组名.</param>
	/// <param name="img">第一个图元的信息（出参）.</param>
	protected bool prot_tryGetFirstImage(string tileName, out Image img)
	{
		img = null;
		int[] idxs = null;
		if ( m_name2Idx == null || !m_name2Idx.TryGetValue(tileName, out idxs) )
			return false;
		//	use the first one.
		img = m_imgDatas[idxs[0]];
		return true;
	}
	/// <summary>
	/// 得到指定名字图组中的所有图元
	/// </summary>
	/// <returns><c>true</c>, 是否找到了此名字的图组, <c>false</c> otherwise.</returns>
	/// <param name="tileName">图组名.</param>
	/// <param name="imgs">指定名字的图组（出参）.</param>
	protected bool prot_tryGetImages(string tileName, out Image[] imgs)
	{
		imgs = null;
		int[] idxs = null;
		if ( m_name2Idx == null || !m_name2Idx.TryGetValue(tileName, out idxs) )
			return false;
		//	use the first one.
		imgs = new Image[idxs.Length];
		for ( int i = 0; i != idxs.Length; ++i )
			imgs[i] = m_imgDatas[idxs[i]];
		return true;
	}
}

/// <summary>
/// 读取AtlasGroup文件信息的辅助扩展类
/// </summary>
static class ReaderClass
{
	public static AtlasGroup.TextureInfo ReadTextureInfo(this System.IO.BinaryReader file)
	{
		AtlasGroup.TextureInfo texInfo = new AtlasGroup.TextureInfo();
		texInfo.texIdx = file.ReadInt32();
		texInfo.name = file.ReadString();
		texInfo.width = file.ReadUInt32();
		texInfo.height = file.ReadUInt32();
		texInfo.inMemWidth = file.ReadUInt32();
		texInfo.inMemHeight = file.ReadUInt32();
		return texInfo;
	}

	public static AtlasGroup.Image ReadImage(this System.IO.BinaryReader file, byte curFileVersion)
	{
		var img = new AtlasGroup.Image();
		AtlasGroup.ImageField iField = AtlasGroup.ImageField.HaveBorder;
		if ( curFileVersion >= 1 )
		{
			iField = (AtlasGroup.ImageField)file.ReadByte();
		}

		img.texIdx = file.ReadUInt32();
		//img.rect = file.ReadRect();
		if ( (iField & AtlasGroup.ImageField.HaveBorder) != AtlasGroup.ImageField.None )
			img.border = file.ReadRectOffset();
		if ( (iField & AtlasGroup.ImageField.HaveCBorder) != AtlasGroup.ImageField.None )
			img.cborder = file.ReadRectOffset();
		img.uvRect = file.ReadRect();
		//img.OrgRect = file.ReadRect();
		//img.LogicRect = file.ReadRect();
		return img;
	}
	public static Rect ReadRect(this System.IO.BinaryReader file)
	{
		Rect r = new Rect();
		r.x = file.ReadSingle();
		r.y = file.ReadSingle();
		r.width = file.ReadSingle();
		r.height = file.ReadSingle();
		return r;
	}
	public static RectOffset ReadRectOffset(this System.IO.BinaryReader file)
	{
		var r = new RectOffset();
		r.left = file.ReadInt32();
		r.right = file.ReadInt32();
		r.top = file.ReadInt32();
		r.bottom = file.ReadInt32();
		return r;
	}

	private static RectOffset gm_border = new RectOffset();
	public static void RecalcRect(this AtlasGroup.Image img, Texture2D tex2D, uint imgWidth, uint imgHeight)
	{
		img.RecalcRect((uint)tex2D.width, (uint)tex2D.height, imgWidth, imgHeight);
	}


	public static void RecalcRect(this AtlasGroup.Image img, uint tex2DWidth, uint tex2DHeight, uint imgWidth, uint imgHeight)
	{
		img.rect.x = img.uvRect.x * imgWidth;
		img.rect.y = imgHeight - (img.uvRect.y + img.uvRect.height) *  (float)imgHeight;
		img.rect.width = img.uvRect.width * (float)imgWidth;
		img.rect.height = img.uvRect.height * (float)imgHeight;

		float hScale = (float)tex2DWidth/(float)imgWidth;
		float vScale = (float)tex2DHeight/(float)imgHeight;
		if ( img.border == null )
		{
			img.border = gm_border;
			img.LogicRect = new Rect(img.rect);
		}
		else
		{
			img.LogicRect.x = img.rect.x - img.border.left;
			img.LogicRect.y = img.rect.y - img.border.top;
			img.LogicRect.width = img.rect.width + img.border.left + img.border.right;
			img.LogicRect.height = img.rect.height + img.border.top + img.border.bottom;
		}
		
		img.rect.x *= hScale;
		img.rect.width *= hScale;
		img.rect.y *= vScale;
		img.rect.height *= vScale;
		
		img.border.left = (int)(img.border.left * hScale);
		img.border.right = (int)(img.border.right * hScale);
		img.border.top = (int)(img.border.top * vScale);
		img.border.bottom = (int)(img.border.bottom * vScale);

		if ( img.cborder != null )
		{
			img.cborder.left = (int)(img.cborder.left * hScale);
			img.cborder.right = (int)(img.cborder.right * hScale);
			img.cborder.top = (int)(img.cborder.top * vScale);
			img.cborder.bottom = (int)(img.cborder.bottom * vScale);
		}

		img.OrgRect.x = img.rect.x - img.border.left;
		img.OrgRect.y = img.rect.y - img.border.top;
		img.OrgRect.width = img.rect.width + img.border.left + img.border.right;
		img.OrgRect.height = img.rect.height + img.border.top + img.border.bottom;
	}
}
