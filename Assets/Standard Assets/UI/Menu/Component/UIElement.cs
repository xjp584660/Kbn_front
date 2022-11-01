using UnityEngine;
using System;
using System.Collections;

public class UIElement
{
	[UnityEngine.Space(30), UnityEngine.Header("----------UIElement----------")]

	public Rect rect = new Rect(0, 0, KBN.MenuMgr.SCREEN_WIDTH, KBN.MenuMgr.SCREEN_HEIGHT);
	[SerializeField] protected bool visible = true;
	protected bool disabled = false;
	public    string tips = "";
	[SerializeField] protected Color m_color = new Color(1f, 1f, 1f, 1f);
	public string uiName;
	
	public float alpha = 1.0f;
	public float rotateAngle = 0.0f;
	public bool flipX = false;
	public bool flipY = false;
	public float scaleX = 1.0f;
	public float scaleY = 1.0f;
	public bool inScreenAspect = false;
	public bool lockWidthInAspect = false;
	public bool lockHeightInAspect = false;
	
	// LiHaojie 2013.09.Add 02 for new fte module
	private uint m_needScreenRect;
	private bool m_needScreenRectOnce;
	private Rect m_rectOnScreen;
	
	public virtual void Sys_Constructor()
	{
		
	}
	
	public void SetDisabled(bool disabled)
	{
		this.disabled = disabled;
	}

    public bool GetDisabled()
    {
        return this.disabled;
    }
	
	protected bool applyRotationAndScaling() {
		Vector3 scale = new Vector3(flipX ? -scaleX : scaleX, flipY ? -scaleY : scaleY, 1.0f);
		if (inScreenAspect) {
			scale = Vector3.Scale(scale, KBN._Global.CalcScreenAspectScale(lockWidthInAspect, lockHeightInAspect));
		}
		KBN._Global.MultiplyRotateScaleMatrix(rect, rotateAngle, scale);
		return (Vector3.one != scale || rotateAngle != 0);
	}

	public virtual int Draw()
	{
	   return -1;
	}
	
    public virtual int Click()
	{
		if (null != OnClick) OnClick.DynamicInvoke(null);
		return -1;
	}

	public MulticastDelegate OnClick;
	
	protected void DrawTextureClipped( Texture2D textureToDraw ,  Rect sourceRect,  Rect paintRect,  UIRotation rotation)
	{		
		Matrix4x4 backupMarix  = GUI.matrix;
		if(rotation == UIRotation.FLIPX)
		{
			GUI.matrix = Matrix4x4.TRS (new Vector3(0, 0, 0), Quaternion.Euler(0, 180f, 0 ), new Vector3 (1, 1, 1))*GUI.matrix;
			paintRect.x = -paintRect.x - sourceRect.width;
		}
		else if(rotation == UIRotation.FLIPY)
		{
			GUI.matrix = Matrix4x4.TRS (new Vector3(0, 0, 0), Quaternion.Euler(180f, 0, 0 ), new Vector3 (1, 1, 1))*GUI.matrix;
			paintRect.y = -paintRect.y - sourceRect.height;
		}
		else if(rotation == UIRotation.FLIPXY)
		{
			GUI.matrix = Matrix4x4.TRS (new Vector3(0, 0, 0), Quaternion.Euler(180f, 180f, 0 ), new Vector3 (1, 1, 1))*GUI.matrix;
			paintRect.x = -paintRect.x - sourceRect.width;
			paintRect.y = -paintRect.y - sourceRect.height;
		}	
		float u1 = sourceRect.x;
		float v1 = sourceRect.y;
		//float u2 = sourceRect.xMax;
		//float v2 = sourceRect.yMax;
		//float du =u2-u1;
		//float dv =v2-v1;
		
		float wRatio = 1.0f*paintRect.width/sourceRect.width;
		float hRatio = 1.0f*paintRect.height/sourceRect.height;
		GUI.BeginGroup (new Rect (paintRect.x, paintRect.y, paintRect.width+1, paintRect.height+1));
	//	GUI.Label (new Rect(-u1,-v1 ,textureToDraw.width,textureToDraw.height), textureToDraw );	
		GUI.DrawTexture(new Rect(-u1*wRatio,-v1*hRatio ,textureToDraw.width*wRatio,textureToDraw.height*hRatio), textureToDraw );
		GUI.EndGroup ();
		
		GUI.matrix = backupMarix;
	}
	
	public void SetColor(Color c)
	{
		m_color = c;
	}
	
	public Color GetColor()
	{
		return m_color;
	}
	
	public void SetVisible(bool enable)
	{
		this.visible = enable;
	}
	
	public bool isVisible()
	{
		return visible;
	}
	
	public virtual void Update()
	{
	}
	public virtual void FixedUpdate()
	{
	}
	public void drawTexture(Texture2D texture,float px,float py,float pw,float ph,UIRotation rotation)
	{
		if(null != texture)
			DrawTextureClipped(texture, new Rect( 0, 0, texture.width, texture.height), new Rect( px,py, pw, py), rotation);
	}
	
	public void drawTexture(Texture2D texture,float px,float py,float pw,float ph)
	{
		if(null != texture)
			DrawTextureClipped(texture, new Rect( 0, 0, texture.width, texture.height), new Rect( px,py, pw, py),UIRotation.None);
	}
	
	public void drawTexture(Texture2D texture,float px,float py)
	{		
		if(null != texture)
			DrawTextureClipped(texture, new Rect( 0, 0, texture.width, texture.height), new Rect( px,py, texture.width, texture.height), UIRotation.None);
	}
	//should ve override.
	public virtual void focusCamera(float cx,float by)
	{
//		rect.x = cx - rect.width / 2;
//		rect.y = by - rect.height;
	}
	
	public void SetXYWidth(int x, int y, int w) {
		rect.x = x;
		rect.y = y;
		rect.width = w;
	}
	
	public void SetVisibleXYWidth(int x, int y, int w, bool v) {
		rect.x = x;
		rect.y = y;
		rect.width = w;
		SetVisible(v);
	}
	
	public void SetVisibleXYWidth(int x, int y, int w) {
		rect.x = x;
		rect.y = y;
		rect.width = w;
		SetVisible(true);
	}
	
	protected void prot_calcScreenRect()
	{ 
		if(m_needScreenRect == 0 && !m_needScreenRectOnce)
			return;
		m_needScreenRectOnce = false;
		Vector3 testVert = new Vector4(1.0f, 1.0f, 0.0f, 1.0f);
		testVert = GUI.matrix.MultiplyPoint3x4(testVert);
		testVert.x = 1.0f/testVert.x;
		testVert.y = 1.0f/testVert.y;
		Vector2 posXY = GUIUtility.GUIToScreenPoint(new Vector2(rect.x * testVert.x, rect.y * testVert.y));
		Vector2 posWH = GUIUtility.GUIToScreenPoint(new Vector2(rect.xMax * testVert.x, rect.yMax * testVert.y)) - posXY;
		posXY.x /= testVert.x;
		posWH.x /= testVert.x;
		posXY.y /= testVert.y;
		posWH.y /= testVert.y;
		m_rectOnScreen.x = posXY.x;
		m_rectOnScreen.width = posWH.x;
		m_rectOnScreen.y = posXY.y;
		m_rectOnScreen.height = posWH.y;
	}
	
	public bool NeedScreenRect
	{
		get {
			return m_needScreenRect!=0;
		}
		set {
			if ( value )
				++m_needScreenRect;
			else
				--m_needScreenRect;
		}
	}

	public void MakeNeedScreenRectOnce()
	{
		m_needScreenRectOnce = true;
	}

	public Rect ScreenRect
	{
		get {
			return m_rectOnScreen;
		}
	}
}
