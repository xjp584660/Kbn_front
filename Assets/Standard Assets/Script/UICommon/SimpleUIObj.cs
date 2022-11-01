using UnityEngine;

public class  SimpleUIObj : UIObject
{
	[Space(30), Header("----------SimpleUIObj----------")]

	public FontSize font = FontSize.Font_18;
	public  UnityEngine.GUIStyle mystyle;
	public string category;
	public string content;
	public string txt = "";
	
	public FontType fontType;
	protected FontType m_curFontType = FontType.END;
	protected FontSize m_curFontSize = FontSize.END;
	public FontColor normalTxtColor;
	protected FontColor m_curNormalTxtColor = FontColor.Default;
	public FontColor onNormalTxtColor;
	protected FontColor m_curOnNormalTxtColor = FontColor.Default;

	//	replace to static var? you must clean this field after game restart.
	private UnityEngine.GUIContent m_contentForDraw;
	protected UnityEngine.GUIContent prot_getGUIContent(string txt, UnityEngine.Texture image, string tips)
	{
		if ( m_contentForDraw == null )
		{
			m_contentForDraw = new UnityEngine.GUIContent(txt, image, tips);
		}
		else
		{
			m_contentForDraw.image = image;
			m_contentForDraw.text = txt;
			m_contentForDraw.tooltip = tips;
		}
		
		return m_contentForDraw;
	}

	protected UnityEngine.GUIContent prot_getGUIContent(string txt, UnityEngine.Texture image)
	{
		return prot_getGUIContent(txt, image, null);
	}
	
	public void setBorder(int left,int top,int right,int bottom)
	{
		mystyle.border.left = left;
		mystyle.border.top = top;
		mystyle.border.right = right;
		mystyle.border.bottom = bottom;
	}

	public void SetTextClip(string Clipable, string Endstring) {
		FontMgr.SetStyleFont(mystyle, font,FontType.TREBUC);
		float Width = rect.width;
		string NewText = Clipable + Endstring;
		if (KBN._Global.GUICalcWidth(mystyle, NewText) > rect.width + float.Epsilon) {
			string EndText = "..." + Endstring;
			Width -= KBN._Global.GUICalcWidth(mystyle, EndText);
			NewText = KBN._Global.GUIClipToWidth(mystyle, Clipable, Width) + EndText;
		}
		txt = NewText;
	}
	
	public void SetTextClip(string string1) {
		SetTextClip(string1, null);
	}
	
	public void ClipText() {
		SetTextClip(txt);
	}
	
	public void SetFont()
	{
		if(m_curFontSize == font && m_curFontType == fontType) 
			return;
		m_curFontType = fontType;
		m_curFontSize = font;
		FontMgr.SetStyleFont(mystyle, m_curFontSize,m_curFontType);
	}
	
	public void SetFont(FontSize fontSizeIn,FontType fontTypeIn)
	{
		fontType = fontTypeIn;
		font = fontSizeIn;
		this.SetFont();
	}
	
	public void SetFont(FontSize fontSizeIn)
	{
		this.SetFont(fontSizeIn, fontType);
	}
	
	public void SetNormalTxtColor()
	{
		if(m_curNormalTxtColor == normalTxtColor) 
			return;
		m_curNormalTxtColor = normalTxtColor;
		FontMgr.SetStyleTextColor(mystyle.normal,m_curNormalTxtColor);
	}
	
	public void SetNormalTxtColor(FontColor color)
	{
		normalTxtColor = color;
		this.SetNormalTxtColor();
	}
	
	public void SetOnNormalTxtColor()
	{
		if(m_curOnNormalTxtColor == onNormalTxtColor) 
			return;
		m_curOnNormalTxtColor = onNormalTxtColor;
		FontMgr.SetStyleTextColor(mystyle.onNormal,m_curOnNormalTxtColor);
	}
	
	public void SetOnNormalTxtColor(FontColor color)
	{
		onNormalTxtColor = color;
		this.SetOnNormalTxtColor();
	}
}
