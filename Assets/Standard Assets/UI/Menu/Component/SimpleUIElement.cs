using UnityEngine;
using System;
using System.Collections;

public class SimpleUIElement : UIElement 
{

	[UnityEngine.Space(30), UnityEngine.Header("----------SimpleUIElement----------")]


	public  GUIStyle mystyle;
	public string category = "";
	public string content = "";
	public FontSize font = FontSize.Font_18;
	public string txt = "";
	
	public FontType fontType;
	protected FontType m_curFontType = FontType.END;
	protected FontSize m_curFontSize = FontSize.END;
	public FontColor normalTxtColor;
	protected FontColor m_curNormalTxtColor = FontColor.Default;
	public FontColor onNormalTxtColor;
	protected FontColor m_curOnNormalTxtColor = FontColor.Default;

	public SimpleUIElement()
	{
		mystyle = new GUIStyle();
	}

	public override void Sys_Constructor()
	{
		base.Sys_Constructor();
		Init();
	}
	
	public virtual void Init()
	{
//		FontMgr.SetStyleFont(mystyle, font,FontType.TREBUC);
	}	
	
	public Rect Region
	{
		set {
			rect = value;
		}
		get {
			return rect;
		}
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

