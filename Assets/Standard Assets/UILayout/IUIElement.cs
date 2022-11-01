using UnityEngine;

public interface IUIElement
{
	object RealObj{get;}
	Rect rect{get;set;}
	void Draw();
	bool IsShow{get;}
	FontSize FontSizeEnum{set;}
	FontType FontTypeEnum{set;}
	FontColor NormalTextColorEnum{set;}
	TextAnchor Alignment{set;get;}
	string Text{set;get;}
	//Texture NormalBackground{get;set;}
	//Texture ActiveBackground{get;set;}
}

public class UINullElement : IUIElement
{
	public object RealObj { get { return null; } }
	Rect m_rect = new Rect();
	public Rect rect { get {return m_rect;} set { m_rect = value; } }
	public void Draw() {}
	public bool IsShow { get {return false;} }
	public FontSize FontSizeEnum { set {} }
	public FontType FontTypeEnum { set {} }
	public FontColor NormalTextColorEnum { set{} }
	public TextAnchor Alignment { set {} get { return TextAnchor.MiddleCenter; } }
	public string Text { set {} get {return null;} }
}


public class CUIWithUIObject : IUIElement
{
	private UIObject m_uiObj;
	public object RealObj { get { return m_uiObj; } }
	public CUIWithUIObject(UIObject uiObj)
	{
		m_uiObj = uiObj;
	}
	public Rect rect {
		get
		{
			return m_uiObj.rect;
		}
		set
		{
			m_uiObj.rect = value;
		}
	}
	public void Draw()
	{
		m_uiObj.Draw();
	}
	public bool IsShow
	{
		get
		{
			return m_uiObj.isVisible();
		}
	}
	public FontSize FontSizeEnum
	{
		set {
			SimpleUIObj simpUI = m_uiObj as SimpleUIObj;
			if ( simpUI != null )
				simpUI.SetFont(value);
		}
	}
	public FontType FontTypeEnum
	{
		set {
			SimpleUIObj simpUI = m_uiObj as SimpleUIObj;
			if ( simpUI != null )
				simpUI.SetFont(simpUI.font, value);
		}
	}
	public FontColor NormalTextColorEnum
	{
		set {
			SimpleUIObj simpUI = m_uiObj as SimpleUIObj;
			if ( simpUI != null )
				simpUI.SetNormalTxtColor(value);
		}
	}
	public TextAnchor Alignment
	{
		get
		{
			SimpleUIObj simpUI = m_uiObj as SimpleUIObj;
			if ( simpUI != null )
				return simpUI.mystyle.alignment;
			return TextAnchor.MiddleCenter;
		}
		set
		{
			SimpleUIObj simpUI = m_uiObj as SimpleUIObj;
			if ( simpUI != null )
				simpUI.mystyle.alignment = value;
		}
	}
	public string Text
	{
		set
		{
			SimpleUIObj simpUI = m_uiObj as SimpleUIObj;
			if ( simpUI != null )
				simpUI.txt = value;
		}
		get
		{
			SimpleUIObj simpUI = m_uiObj as SimpleUIObj;
			if ( simpUI != null )
				return simpUI.txt;
			return null;
		}
	}
}

public class CUIWithUIElement : IUIElement
{
	private UIElement m_uiElement;
	public object RealObj { get {return m_uiElement;} }

	public CUIWithUIElement(UIElement uiElement)
	{
		m_uiElement = uiElement;
	}

	public Rect rect 
	{
		get
		{
			return m_uiElement.rect;
		}
		set
		{
			m_uiElement.rect = value;
		}
	}
	public void Draw()
	{
		m_uiElement.Draw();
	}
	public bool IsShow
	{
		get
		{
			return m_uiElement.isVisible();
		}
	}
	public FontSize FontSizeEnum
	{
		set
		{
			SimpleUIElement simpElement = m_uiElement as SimpleUIElement;
			if ( simpElement != null )
				simpElement.SetFont(value, simpElement.fontType);
		}
	}
	public FontType FontTypeEnum
	{
		set
		{
			SimpleUIElement simpElement = m_uiElement as SimpleUIElement;
			if ( simpElement != null )
				simpElement.SetFont(simpElement.font, value);
		}
	}
	public FontColor NormalTextColorEnum
	{
		set
		{
			SimpleUIElement simpElement = m_uiElement as SimpleUIElement;
			if ( simpElement != null )
				simpElement.SetNormalTxtColor(value);
		}
	}
	public TextAnchor Alignment
	{
		get
		{
			SimpleUIElement simpElement = m_uiElement as SimpleUIElement;
			if ( simpElement != null )
				return simpElement.mystyle.alignment;
			return TextAnchor.MiddleCenter;
		}
		set
		{
			SimpleUIElement simpElement = m_uiElement as SimpleUIElement;
			if ( simpElement != null )
				simpElement.mystyle.alignment = value;
		}
	}
	public string Text
	{
		set
		{
			SimpleUIElement simpUI = m_uiElement as SimpleUIElement;
			if ( simpUI != null )
				simpUI.txt = value;
		}
		get
		{
			SimpleUIElement simpUI = m_uiElement as SimpleUIElement;
			if ( simpUI != null )
				return simpUI.txt;
			return null;
		}
	}
}

public class CUIWithTile : IUIElement
{
	private Tile m_tile;
	public object RealObj { get {return m_tile;} }
	public CUIWithTile(Tile tile)
	{
		m_tile = tile;
	}
	public Rect rect
	{
		get
		{
			return m_tile.rect;
		}
		set
		{
			m_tile.rect = value;
		}
	}
	public void Draw()
	{
		m_tile.Draw();
	}
	public bool IsShow
	{
		get
		{
			return m_tile.IsValid;
		}
	}
	public FontSize FontSizeEnum
	{
		set
		{
		}
	}
	public FontType FontTypeEnum
	{
		set
		{
		}
	}
	public FontColor NormalTextColorEnum
	{
		set
		{
		}
	}
	public TextAnchor Alignment
	{
		get {return TextAnchor.MiddleCenter;}
		set {}
	}
	public string Text
	{
		set
		{
		}
		get
		{
			return null;
		}
	}
}


[UILayout.UIFrameLayout(TypeName="ObjToUI")]
 public class AgentElement : CAElement, IUIElement
 {
	private UILayout.UIFrame m_uiFrame;
	private IUIElement m_uiElement;
	private FontSize m_tgtFontSize = FontSize.END;
	private FontColor m_tgtNormalTxtColor = FontColor.Default;
	private FontType m_tgtFontType = FontType.END;
	private bool m_isSetAlignment = false;
	private TextAnchor m_tgtAlignment = TextAnchor.MiddleCenter;
	private string m_txt;
	private bool m_isHaveRect = false;
	private Rect m_rect;
	public string RefName;
	public string ClassName;
	//public int ZOrderOffset;
	public AgentElement()
	{
	}

	public IUIElement RealElement
	{
		get
		{
			priv_loadElement();
			return m_uiElement;
		}
		set 
		{
			m_uiElement = value;
		}
	}

	public object RealObj
	{
		get
		{
			priv_loadElement();
			return m_uiElement.RealObj;
		}
	}
	
	public Rect rect
	{
		get
		{
			if ( m_uiElement != null )
				return m_uiElement.rect;
			priv_loadElement();
			if ( m_uiElement != null )
				return m_uiElement.rect;
			return m_rect;
		}
		set
		{
			if ( m_uiElement != null )
			{
				m_uiElement.rect = value;
				return;
			}
			m_isHaveRect = true;
			m_rect = value;
		}
	}
	
	public void Draw()
	{
		priv_loadElement();
		m_uiElement.Draw();
	}
	public bool IsShow
	{
		get 
		{
			priv_loadElement();
			return m_uiElement.IsShow;
		}
	}
	public FontSize FontSizeEnum
	{
		set
		{
			m_tgtFontSize = value;
		}
	}
	public FontType FontTypeEnum
	{
		set
		{
			m_tgtFontType = value;
		}
	}
	
	public FontColor NormalTextColorEnum
	{
		set
		{
			m_tgtNormalTxtColor = value;
		}
	}
	public TextAnchor Alignment
	{
		get
		{
			return m_tgtAlignment;
		}
		set
		{
			m_tgtAlignment = value;
			m_isSetAlignment = true;
		}
	}
	public string Text
	{
		set
		{
			m_txt = value;
		}
		get
		{
			return m_txt;
		}
	}
	
	public override void SetFrame(UILayout.UIFrame uiFrame)
	{
		m_uiFrame = uiFrame;
	}
	
	private void priv_loadElement()
	{
		if ( m_uiElement != null )
			return;
		m_uiElement = priv_findUIObjFromString(RefName, m_uiFrame);


		if ( m_tgtFontSize != FontSize.END )
			m_uiElement.FontSizeEnum = m_tgtFontSize;

		if ( m_tgtNormalTxtColor != FontColor.Default )
			m_uiElement.NormalTextColorEnum = m_tgtNormalTxtColor;

		if ( m_tgtFontType != FontType.END )
			m_uiElement.FontTypeEnum = m_tgtFontType;

		if ( m_isSetAlignment )
			m_uiElement.Alignment = m_tgtAlignment;
		else
			m_tgtAlignment = m_uiElement.Alignment;

		if ( m_txt != null )
			m_uiElement.Text = m_txt;
		else
			m_txt = m_uiElement.Text;

		if ( m_isHaveRect )
			m_uiElement.rect = m_rect;
		else
			m_rect = m_uiElement.rect;
	}
	
	static private IUIElement priv_castWithObject(object uiObj)
	{
		IUIElement uiElement = ObjToUI.Cast(uiObj as UIObject);
		if ( uiElement != null )
			return uiElement;
		uiElement = ObjToUI.Cast(uiObj as UIElement);
		if ( uiElement != null )
			return uiElement;
		uiElement = ObjToUI.Cast(uiObj as Tile);
		if ( uiElement != null )
			return uiElement;
		return ObjToUI.CreateNullElement();
	}
	
	private static IUIElement priv_findUIObjFromString(string strObj, UILayout.UIFrame uiFrame)
	{
		if ( strObj == null )
			return null;
		if ( strObj == "null" )
			return ObjToUI.CreateNullElement();

		object objMenu = uiFrame.GetValue("@ThisMenu");
		if (objMenu == null) {
			return null;
		}

		string[] strObjs = strObj.Split("."[0]);
		object objNode = objMenu;
		foreach ( string objStr in strObjs )
		{
			object objFromField = priv_findUIObjFieldFromString(objStr, objNode);
			if ( objFromField != null )
			{
				objNode = objFromField;
				continue;
			}
			
			object objFromProp = priv_findUIObjPropFromString(objStr, objNode);
			if ( objFromProp != null )
			{
				objNode = objFromProp;
				continue;
			}

			return null;
		}
		
		return priv_castWithObject(objNode);
	}
	
	private static object priv_findUIObjPropFromString(string objStr, object objNode)
	{
		System.Type objType = objNode.GetType();
		System.Reflection.PropertyInfo propInfo = objType.GetProperty(objStr);
		if ( propInfo == null )
			return null;
		if ( !propInfo.CanRead )
			return null;
		return propInfo.GetValue(objNode, null);
	}
	
	private static object priv_findUIObjFieldFromString(string objStr, object objNode)
	{
		System.Type objType = objNode.GetType();
		System.Reflection.FieldInfo fieldInfo = objType.GetField(objStr);
		if ( fieldInfo == null )
			return null;
		
		return fieldInfo.GetValue(objNode);
	}
 }
 
 [UILayout.UIFrameLayout(TypeName="Label")]
 public class SimpleLabelImple : IUIElement
 {
	private string m_name;
	private SimpleLabel m_simpleLabel;
	public SimpleLabelImple()
	{
		m_simpleLabel = new SimpleLabel();
	}
	public string Name
	{
		get
		{
			return m_name;
		}
		set
		{
			m_name = value;
		}
	}
	public object RealObj
	{
		get
		{
			return m_simpleLabel;
		}
	}

	public Rect rect
	{
		get
		{
			return m_simpleLabel.rect;
		}
		set
		{
			m_simpleLabel.rect = value;
		}
	}
	
	public void Draw()
	{
		m_simpleLabel.Draw();
	}
	
	public bool IsShow
	{
		get
		{
			return m_simpleLabel.isVisible();
		}
	}
	
	public Texture NormalBackground
	{
		set 
		{
			SetNormalBackground(value,true);
		}
		get
		{
			return m_simpleLabel.mystyle.normal.background;
		}
	}

    public float Alpha
    {
        set
        {
            Color c = m_simpleLabel.GetColor();
            m_simpleLabel.SetColor(new Color(c.r, c.g, c.b, value));
        }
        get
        {
            return m_simpleLabel.GetColor().a;
        }
    }
	
	public void SetNormalBackground(Texture tex, bool bSycRect)
	{
		m_simpleLabel.mystyle.normal.background = tex as Texture2D;
		if ( tex != null && bSycRect )
		{
			m_simpleLabel.rect.width = tex.width;
			m_simpleLabel.rect.height = tex.height;
		}
	}

	public Texture ActiveBackground
	{
		set
		{
			m_simpleLabel.mystyle.active.background = value as Texture2D; // !!!!
			if ( value != null )
			{
				m_simpleLabel.rect.width = value.width;
				m_simpleLabel.rect.height = value.height;
			}
		}
		get
		{
			return m_simpleLabel.mystyle.active.background;
		}
	}
	public RectOffset BackgroundBorder
	{
		set
		{
			m_simpleLabel.mystyle.border = value;
		}
		get
		{
			return m_simpleLabel.mystyle.border;
		}
	}
	public FontSize FontSizeEnum
	{
		set
		{
			m_simpleLabel.SetFont(value, m_simpleLabel.fontType);
		}	
	}
	public FontType FontTypeEnum
	{
		set
		{
			m_simpleLabel.SetFont(m_simpleLabel.font, value);
		}
	}
	public FontColor NormalTextColorEnum
	{
		set
		{
			m_simpleLabel.SetNormalTxtColor(value);
		}
	}
	public TextAnchor Alignment
	{
		get
		{
			return m_simpleLabel.mystyle.alignment;
		}
		set
		{
			m_simpleLabel.mystyle.alignment = value;
		}
	}
	public string Text
	{
		set
		{
			m_simpleLabel.txt = value;
		}
		get
		{
			return m_simpleLabel.txt;
		}
	}
 }
 [UILayout.UIFrameLayout(TypeName="Button")]
public class SimpleButtonImple : UILayout.ModifyPropertysContains , IUIElement
 {
	private SimpleButton m_simpleButton;
	public SimpleButtonImple()
	{
		m_simpleButton = new SimpleButton();
	}
	public object RealObj
	{
		get
		{
			return m_simpleButton;
		}
	}

	public Rect rect
	{
		get
		{
			return m_simpleButton.rect;
		}
		set
		{
			m_simpleButton.rect = value;
		}
	}
	
	public void Draw()
	{
		m_simpleButton.Draw();
	}
	
	public bool IsShow
	{
		get
		{
			return m_simpleButton.isVisible();
		}
	}
	public Texture NormalBackground
	{
		set
		{
			m_simpleButton.mystyle.normal.background = value as Texture2D;
			if ( value != null )
			{
				m_simpleButton.rect.width = value.width;
				m_simpleButton.rect.height = value.height;
			}
		}
		get
		{
			return m_simpleButton.mystyle.normal.background;
		}
	}
	public Texture ActiveBackground
	{
		set
		{
 			m_simpleButton.mystyle.active.background = value as Texture2D;
			if ( value != null )
			{
				m_simpleButton.rect.width = value.width;
				m_simpleButton.rect.height = value.height;
			}
		}
		get
		{
			return m_simpleButton.mystyle.active.background;
		}
	}
	public RectOffset BackgroundBorder
	{
		set
		{
			m_simpleButton.mystyle.border = value;
		}
		get
		{
			return m_simpleButton.mystyle.border;
		}
	}
	public FontSize FontSizeEnum
	{
		set
		{
			m_simpleButton.SetFont(value, m_simpleButton.fontType);
		}
	}
	public FontType FontTypeEnum
	{
		set
		{
			m_simpleButton.SetFont(m_simpleButton.font, value);
		}
	}
	public FontColor NormalTextColorEnum
	{
		set
		{
			m_simpleButton.SetNormalTxtColor(value);
		}
	}
	public TextAnchor Alignment
	{
		get
		{
			return m_simpleButton.mystyle.alignment;
		}
		set
		{
			m_simpleButton.mystyle.alignment = value;
		}
	}
	public string Text
	{
		set
		{
			m_simpleButton.txt = value;
		}
		get
		{
			return m_simpleButton.txt;
		}
	}
	public System.MulticastDelegate OnClick
	{
		set
		{
			m_simpleButton.OnClick = value;
		}
		get
		{
			return m_simpleButton.OnClick;
		}
	}
 }
 
 
 public class ObjToUI
 {
	static public IUIElement Cast(UIObject uiObj )
	{
		if ( uiObj == null )
			return null;
		return new CUIWithUIObject(uiObj);
	}
	
	static public IUIElement Cast(UIElement uiElement)
	{
		if ( uiElement == null )
			return null;
		return new CUIWithUIElement(uiElement);
	}
	
	static public IUIElement Cast(Tile tile)
	{
		if ( tile == null )
			return null;
		return new CUIWithTile(tile);
	}
	
	static public IUIElement CreateNullElement()
	{
		return new UINullElement();
	}
 }
 
 
 [UILayout.HaveValueCastAttribute]
 public class CastStringToTexture
 {
	private static System.Text.RegularExpressions.Regex gm_texReg = new System.Text.RegularExpressions.Regex("{Texture (?<Name>.+)\\s*:\\s*(?<Path>\\w+)}");
	private static System.Text.RegularExpressions.Regex gm_httpTexReg = new System.Text.RegularExpressions.Regex("{HttpTexture (?<URL>.+)\\s*}");
	private static System.Text.RegularExpressions.Regex gm_buildTexReg = new System.Text.RegularExpressions.Regex("{PrefabTexture (?<Name>.+)\\s*:\\s*(?<Path>\\w+)}");
	private static System.Text.RegularExpressions.Regex gm_rectReg = new System.Text.RegularExpressions.Regex("{\\s*(?<x>[\\+-]{0,1}\\d+(\\.\\d+)?)\\s*,\\s*(?<y>[\\+-]{0,1}\\d+(\\.\\d+)?)\\s*,\\s*(?<w>[\\+-]{0,1}\\d+(\\.\\d+)?)\\s*,\\s*(?<h>[\\+-]{0,1}\\d+(\\.\\d+)?)\\s*}");
	private static System.Text.RegularExpressions.Regex gm_vecReg = new System.Text.RegularExpressions.Regex("{\\s*(?<x>[\\+-]{0,1}\\d+(\\.\\d+)?)\\s*,\\s*(?<y>[\\+-]{0,1}\\d+(\\.\\d+)?)\\s*}");
	private static System.Text.RegularExpressions.Regex gm_txtReg = new System.Text.RegularExpressions.Regex("{DataTxt (?<TxtKey>[^\\s]+)\\s*}");
    private static System.Text.RegularExpressions.Regex gm_tileReg = new System.Text.RegularExpressions.Regex("{Tile (?<SpriteName>\\w+):(?<TileName>\\w+)}");

    [UILayout.ValueCastAttribute]
    static public Tile CastToTile(string texInfo)
    {
        System.Text.RegularExpressions.Match matchInfo = gm_tileReg.Match(texInfo);
        if ( !matchInfo.Success )
            return null;
        string spriteName = matchInfo.Groups["SpriteName"].Value.ToString();
        string tileName = matchInfo.Groups["TileName"].Value.ToString();
        TextureMgr texMgr = TextureMgr.instance();
        TileSprite spt = null;
        switch (spriteName)
        {
        case "IconSpt":
            spt = texMgr.IconSpt();
            break;
        default:
            return null;
        }
        return spt.GetTile(tileName);
    }

	[UILayout.ValueCastAttribute]
	static public bool CastToTexture(string texInfo, object h, ref Texture tex)
	{
		tex = null;
		if ( texInfo == "{null}" )
			return true;
		System.Text.RegularExpressions.Match matchInfo = gm_texReg.Match(texInfo);
		if ( !matchInfo.Success )
			return false;
		string name = matchInfo.Groups["Name"].Value.ToString();
		string path = matchInfo.Groups["Path"].Value.ToString();
		TextureMgr texMgr = TextureMgr.instance();
		System.Reflection.FieldInfo fieldInfo = typeof(TextureType).GetField(path);
		if ( fieldInfo == null )
			return false;
		string pathName = fieldInfo.GetValue(null) as string;
		tex = texMgr.LoadTexture(name, pathName);
		return true;
	}

	[UILayout.ValueCastAttribute]
	static public Texture CastToHttpTexture(string texInfo)
	{
		System.Text.RegularExpressions.Match matchInfo = gm_httpTexReg.Match(texInfo);
		if ( !matchInfo.Success )
			return null;
		string name = matchInfo.Groups["URL"].Value.ToString();
		TextureMgr texMgr = TextureMgr.instance();
		return texMgr.LoadTexture(name);
	}

	[UILayout.ValueCastAttribute]
	static public Texture CastToBuildTexture(string texInfo)
	{
		System.Text.RegularExpressions.Match matchInfo = gm_buildTexReg.Match(texInfo);
		if ( !matchInfo.Success )
			return null;
		string name = matchInfo.Groups["Name"].Value.ToString();
		string path = matchInfo.Groups["Path"].Value.ToString();
		///*
		TextureMgr texMgr = TextureMgr.instance();
		GameObject animationSprClone = texMgr.loadAnimationSprite(name, path);
		animationSprClone = GameObject.Instantiate(animationSprClone) as GameObject;
		Texture2D texIcon = animationSprClone.transform.GetChild(0).GetComponent<Renderer>().material.mainTexture as Texture2D;
		GameObject.Destroy(animationSprClone);
		return texIcon;
		//*/
		/*
		tk2dSpriteCollectionData tk2dCollections = tk2dSystem.LoadResourceByName.< tk2dSpriteCollectionData > ("f1_0_4_1SC");
		Texture2D tex = tk2dCollections.textures[0];
		Resources.Unload(tk2dCollections);
		tk2dCollections.Unload();
		return tex;
		//*/
	}
	[UILayout.ValueCastAttribute]
	static public bool CastToTexture2D(string texInfo, object h, ref Texture2D tex)
	{
		Texture texTmp = null;
		if ( !CastToTexture(texInfo, h, ref texTmp) )
			return false;
		tex = (Texture2D)texTmp;
		return true;
	}
	[UILayout.ValueCastAttribute]
	static public Texture2D CastToBuildTexture2D(string texInfo)
	{
		return CastToBuildTexture(texInfo) as Texture2D;
	}
	[UILayout.ValueCastAttribute]
	static public Rect CastToRect(string rectInfo)
	{
		System.Text.RegularExpressions.Match matchInfo = gm_rectReg.Match(rectInfo);
		if ( !matchInfo.Success )
			return new Rect();
		string strX = matchInfo.Groups["x"].Value.ToString();
		string strY = matchInfo.Groups["y"].Value.ToString();
		string strW = matchInfo.Groups["w"].Value.ToString();
		string strH = matchInfo.Groups["h"].Value.ToString();
		float x = System.Convert.ToSingle(strX);
		float y = System.Convert.ToSingle(strY);
		float w = System.Convert.ToSingle(strW);
		float h = System.Convert.ToSingle(strH);
		return new Rect(x, y, w, h);
	}
	[UILayout.ValueCastAttribute]
	static public RectOffset CastToRectOffset(string rectInfo)
	{
		System.Text.RegularExpressions.Match matchInfo = gm_rectReg.Match(rectInfo);
		if ( !matchInfo.Success )
			return new RectOffset(0, 0, 0, 0);
		string strX = matchInfo.Groups["x"].Value.ToString();
		string strY = matchInfo.Groups["y"].Value.ToString();
		string strW = matchInfo.Groups["w"].Value.ToString();
		string strH = matchInfo.Groups["h"].Value.ToString();
		int x = System.Convert.ToInt32(strX);
		int y = System.Convert.ToInt32(strY);
		int w = System.Convert.ToInt32(strW);
		int h = System.Convert.ToInt32(strH);
		return new RectOffset(x, y, w, h);
	}
	[UILayout.ValueCastAttribute]
	static public Vector2 CastToVector2(string vecInfo)
	{
		System.Text.RegularExpressions.Match matchInfo = gm_vecReg.Match(vecInfo);
		if ( !matchInfo.Success )
			return new Vector2();
		string strX = matchInfo.Groups["x"].Value.ToString();
		string strY = matchInfo.Groups["y"].Value.ToString();
		float x = System.Convert.ToSingle(strX);
		float y = System.Convert.ToSingle(strY);
		return new Vector2(x, y);
	}
	
	[UILayout.ValueCastAttribute]
	static public string CastToString(string stringInfo)
	{
		System.Text.RegularExpressions.Match matchInfo = gm_txtReg.Match(stringInfo);
		if ( !matchInfo.Success )
			return null;
		string strKey = matchInfo.Groups["TxtKey"].Value.ToString();
		string val = KBN.Datas.getArString(strKey);
		return val;
	}
	[UILayout.ValueCastAttribute]
	static public TextAnchor CastToTextAnchor(string alignInfo)
	{
		return (TextAnchor) System.Enum.Parse(typeof(TextAnchor), alignInfo);
	}
	
////	[UILayout.ValueCastAttribute(Function, string)]
	[UILayout.ValueCastAttribute(typeof(System.MulticastDelegate), typeof(string))]
	static public System.MulticastDelegate CastToClickEvent(string funcName, object obj)
	{
		UILayout.ModifyPropertysContains contains = obj as UILayout.ModifyPropertysContains;
		object objFrame = contains.GetValue("@ThisMenu");// as Menu;
		if ( objFrame == null )
			return null;
		System.Reflection.MethodInfo method = objFrame.GetType().GetMethod(funcName
	           , System.Reflection.BindingFlags.InvokeMethod
	           | System.Reflection.BindingFlags.Instance
	           | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.NonPublic
	           //| System.Reflection.BindingFlags.Static
	           );
		if ( method.GetParameters().Length == 0 )
		{
			return new System.Action(delegate()
			{
				method.Invoke(objFrame, null);
			});
		}
		
		return new System.Action<object>(delegate(object param)
		{
			object[] args = new object[1];
			args[0] = param;
			method.Invoke(objFrame, args);
		});
	}
}
