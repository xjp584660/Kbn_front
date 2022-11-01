using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class Label : SimpleUIObj {

	[Space(30),Header("----------Label----------")]

	public Texture image;
	public Rect sourceRect;
	public int maxChar = 999;
	public bool useTile = false;
	public bool drawTileByGraphics = false;
	public Tile tile;
	private bool m_isNeedInGroup = false;
	public Material material;
	
	private float oldAlpha;
	private Dictionary<string, Texture2D> backgroundDic = new Dictionary<string, Texture2D>();
	public virtual void Start() {	
	}
	
	// Update is called once per frame
	public override void Update() {
//		_Global.Log("error label should not update");
	}
	
	public void Copy(Label src)
	{
		rect = src.rect;
		mystyle = src.mystyle;
		category = src.category;
		content = src.content;
	}
	
	
	public bool InGroup {
		get {
			return m_isNeedInGroup;
		}
		set {
			m_isNeedInGroup = value;
		}
	}

	public override int Draw()
	{
		if( !visible || !IsPaint()){
			return -1;
		}
		
		Matrix4x4 oldMatrix = GUI.matrix;
		bool matrixChanged = applyRotationAndScaling();

		prot_calcScreenRect();
		
		SetFont();
		SetNormalTxtColor();
		if(!string.IsNullOrEmpty(txt) && txt.Length > maxChar)
			txt = txt.Substring(0,maxChar);
			
		if(alphaEnable)
		{
			oldAlpha = GUI.color.a;
			Color c = GUI.color;
			c.a = alpha;
			GUI.color = c;
		}

		Rect drawRect = this.rect;
		if ( m_isNeedInGroup )
		{
			GUI.BeginGroup(this.rect);
			drawRect.x = 0;
			drawRect.y = 0;
		}

		if(useTile && tile != null && tile.IsValid )
		{
			tile.rect = drawRect;
			if(GUI.color.a != 1)
			{
				tile.Draw(drawRect, false);
			}
			else
			{
				tile.Draw(drawRect, drawTileByGraphics);
			}

			if ( !string.IsNullOrEmpty(txt) )
				GUI.Label( drawRect, prot_getGUIContent(txt,null, tips), mystyle);	
		}
		else
		{
			GUI.Label( drawRect, prot_getGUIContent(txt,image, tips), mystyle);	
		}

		if (matrixChanged)
			GUI.matrix = oldMatrix;

		if(alphaEnable)	{
			Color c = GUI.color;
			c.a = oldAlpha;
			GUI.color = c;
		}

		if ( m_isNeedInGroup )
			GUI.EndGroup();
		return -1;
	}

	public int Draw(Rect des,Texture texture,Rect textureRect)
	{
		if( !visible || !IsPaint()) return -1;
		if(texture == null) return -1;
		if(tile == null) return -1;
		if(tile.name == null || tile.name == "") return -1;
		
//		FontMgr.SetStyleFont(mystyle, font,FontType.TREBUC);
		if(!string.IsNullOrEmpty(txt) && txt.Length > maxChar)
			txt = txt.Substring(0,maxChar);
			
		if(alphaEnable)
		{
			oldAlpha = GUI.color.a;
			Color c = GUI.color;
			c.a = alpha;
			GUI.color = c;
		}
		
		string name = tile.name;
		TileSprite sprite = TextureMgr.instance().ElseIconSpt();
		Rect source = sprite.GetRelativeSourceRect(name);
		source.width *= textureRect.width;
		source.height *= textureRect.height;
		source.x = source.x + textureRect.x * source.width;
		source.y = source.y + textureRect.y * source.height;
		
		Graphics.DrawTexture(des,texture,source,0,0,0,0,null);
		return -1;
	}

	public int DrawTexture()
	{
		return DrawTexture(rect, material);
	}

	private int DrawTexture(Material mat)
	{
		return DrawTexture(rect,mat);
	}
	private int DrawTexture(Rect destination,Material mat)
	{
		if( !visible || !IsPaint()) return -1;
		if( mystyle.normal.background == null ) return -1;
		if( useTile ) return -1;

		if(!string.IsNullOrEmpty(txt) && txt.Length > maxChar)
			txt = txt.Substring(0,maxChar);

        Graphics.DrawTexture(destination,mystyle.normal.background,mat);
		return -1;
	}

	public int GetTxtHeight()
	{
		SetFont();
		return (int)mystyle.CalcHeight( prot_getGUIContent(txt, null, null), rect.width);
	}

	
	public int GetWidth()
	{
		SetFont();
		int w = (int)mystyle.CalcSize( prot_getGUIContent(txt, image, tips)).x;
		return w;
	}

	public void SetRectWHFromTile()
	{
		if(useTile && tile.IsValid && tile.prop != null)
		{
			//Rect r = tile.spt.GetFullRect(tile.name);
			this.rect.width = tile.prop.LogicRect.width;
			this.rect.height = tile.prop.LogicRect.height;
		}
	}

//	public void DrawBackground()
//	{
//		if(!background)
//			return;
//		if(sourceRect.width==0&&sourceRect.height==0)
//			sourceRect = Rect(0, 0, background.width, background.height);
//				
//		DrawTextureClipped(background, sourceRect, rect, rotation);
//	}
	
/*	protected bool IsTouched()
	{
	    if(Application.platform == RuntimePlatform.IPhonePlayer || Application.platform == RuntimePlatform.Android)
	    {
			for(int i=0; i< Input.touchCount; i++)
			{
				Vector2 pos = Input.touches[i].position;
				if(rect.Contains(pos))
					return true;
			}
			return false;
		}
		else
		{
			Vector2 mousePos = new Vector2(Input.mousePosition.x, MenuMgr.SCREEN_HEIGHT -Input.mousePosition.y);
		//	print("x:"+mousePos.x+"y:"+mousePos.y+"mouse y:"+Input.mousePosition.y);
			return rect.Contains(mousePos);
		}
	}*/
	
	public  Texture2D Background {
		set {
			mystyle.normal.background = value;
		}
		get {
			return mystyle.normal.background;
		}
	}
	
	public void setBackground(string picPath, string textureType)
	{
		if(string.IsNullOrEmpty(picPath))return;
		if(!backgroundDic.ContainsKey(picPath))
		{
			Texture2D texture = TextureMgr.singleton.LoadTexture(picPath, textureType);
			mystyle.normal.background = texture;
			backgroundDic.Add(picPath, texture);
		}
		else
		{
			mystyle.normal.background = backgroundDic[picPath];
		}
		
	}
	
	public string TileName {
		set {	
			tile.name = value;
		}
		get
		{
			return tile.name;
		}
	}
	
	public TileSprite TileSprite {
		set {
			tile = (value as TileSprite).GetTile(null);
		}
	}
	
	public int Top {
		set {
			rect.y  = value;
		}
	}
	
	public int Left {
		set {
			rect.x = value;
		}
	}

	public override void OnPopOver() 
	{
		UIObject.TryDestroy(this);
	}
	
}
