using UnityEngine;
using System.Collections;
using KBN;

public enum UIRotation
{
	None,
	FLIPX,
	FLIPY,
	FLIPXY,
}


public class  UIObject : MonoBehaviour
{

	[Space(30),Header("----------UIObject----------")]

	//real position and size
	public Rect rect = new Rect(0, 0, MenuMgr.SCREEN_WIDTH, MenuMgr.SCREEN_HEIGHT);
	public float rotateAngle = 0.0f;
	public bool flipX = false;
	public bool flipY = false;
	public float scaleX = 1.0f;
	public float scaleY = 1.0f;
	public bool inScreenAspect = false;
	public bool lockWidthInAspect = false;
	public bool lockHeightInAspect = false;
	[SerializeField]
	protected bool visible = true;
	protected bool disabled = false;
	public    string tips = "";
	protected Color m_color =  new Color(1.0f, 1.0f, 1.0f, 1.0f);
	public    Texture2D background;
	public string uiName;
	public float alpha = 1.0f;
	public bool alphaEnable = false;
	public bool grey = false;
	
	private uint m_needScreenRect;
	private bool m_needScreenRectOnce;
	public Rect m_rectOnScreen;

	public virtual void Awake()
	{
		enabled = false;
	}

	public virtual void Init()
	{
		m_rectOnScreen = new Rect(-1, -1, 0, 0);
	}

	public bool IsPaint()
	{
		return Event.current.type == EventType.Repaint;
	}

	protected bool applyRotationAndScaling()
	{
		Vector3 scale = new Vector3(flipX ? -scaleX : scaleX, flipY ? -scaleY : scaleY, 1.0f);
		if (inScreenAspect)
		{
			scale = Vector3.Scale(scale, KBN._Global.CalcScreenAspectScale(lockWidthInAspect, lockHeightInAspect));
		}
		KBN._Global.MultiplyRotateScaleMatrix(rect, rotateAngle, scale);
		return (Vector3.one != scale || rotateAngle != 0);
	}

	public Vector3 GetScreenScale(){
		Matrix4x4 matrix = GUI.matrix; 
		_Global.setGUIMatrix();
//		_Global.Log("scrollList2-->GUI.matrix"+GUI.matrix[0,0]+","+GUI.matrix[1,1]);
		Vector3 scale = new Vector3(flipX ? -scaleX : scaleX, flipY ? -scaleY : scaleY, 1.0f);
		if (inScreenAspect)
		{
			scale = Vector3.Scale(scale, KBN._Global.CalcScreenAspectScale(lockWidthInAspect, lockHeightInAspect));
		}
		GUI.matrix=matrix;
		return scale;
	}

	protected void prot_calcScreenRect()
	{
		if (m_needScreenRect == 0 && !m_needScreenRectOnce)
			return;
		m_needScreenRectOnce = false;
		m_rectOnScreen = _Global.CalcScreenRect(rect);
	}

	public bool NeedScreenRect
	{
		get
		{
			return m_needScreenRect != 0;
		}
		set
		{
			if (value)
				++m_needScreenRect;
			else
				--m_needScreenRect;
		}
	}

	public void MakeNeedScreenRectOnce()
	{
		m_needScreenRectOnce = true;
	}

	///<summary>
	///<param name="cnt">positive or negative</param>
	///</summary>
	public void ChangeScreenRectCount(int cnt)
	{
		m_needScreenRect += (uint)cnt; 
	}

	public Rect ScreenRect
	{
		get{ return m_rectOnScreen; }
	}

	public void center()
	{
		rect.x = (MenuMgr.SCREEN_WIDTH - rect.width) / 2;
		rect.y = (MenuMgr.SCREEN_HEIGHT - rect.height) / 2;
	}

	public virtual void SetDisabled(bool disabled)
	{
		this.disabled = disabled;
	}

	public virtual int Draw()
	{
		return -1;
	}

	public virtual int Click()
	{
		if (m_onClick == null)
			return -1;
		try
		{
			m_onClick.DynamicInvoke(null);
		}
		catch (System.Reflection.TargetParameterCountException /*e*/)
		{
			m_onClick.DynamicInvoke(new object[]{ null });
		}
		return -1;
	}

	public virtual int Click(object param)
	{
		if (m_onClick != null)
		{
			try
			{
				m_onClick.DynamicInvoke(new object[]{ param });
			}
			catch (System.Reflection.TargetParameterCountException /*e*/)
			{
				m_onClick.DynamicInvoke(null);
			}
		}
		return -1;
	}

	public System.MulticastDelegate OnClick
	{
		get
		{
			return m_onClick;
		}
		set
		{
			m_onClick = value;
		}
	}

	protected System.MulticastDelegate m_onClick;

	protected void DrawTextureClipped(Texture2D textureToDraw, Rect sourceRect, Rect paintRect, UIRotation rotation)
	{		
		Matrix4x4 backupMarix = GUI.matrix;
		if (rotation == UIRotation.FLIPX)
		{
			GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.Euler(0, 180f, 0), Vector3.one) * GUI.matrix;
			paintRect.x = -paintRect.x - sourceRect.width;
		}
		else if (rotation == UIRotation.FLIPY)
		{
			GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.Euler(180f, 0, 0), Vector3.one) * GUI.matrix;
			paintRect.y = -paintRect.y - sourceRect.height;
		}
		else if (rotation == UIRotation.FLIPXY)
		{
			GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.Euler(180f, 180f, 0), Vector3.one) * GUI.matrix;
			paintRect.x = -paintRect.x - sourceRect.width;
			paintRect.y = -paintRect.y - sourceRect.height;
		}	
		float u1 = sourceRect.x;
		float v1 = sourceRect.y;
		//float u2 = sourceRect.xMax;
		//float v2 = sourceRect.yMax;
		//float du =u2-u1;
		//float dv =v2-v1;

		float wRatio = 1.0f * paintRect.width / sourceRect.width;
		float hRatio = 1.0f * paintRect.height / sourceRect.height;
		GUI.BeginGroup(new Rect(paintRect.x, paintRect.y, paintRect.width + 1, paintRect.height + 1));
		//	GUI.Label (new Rect(-u1,-v1 ,textureToDraw.width,textureToDraw.height), textureToDraw );	
		GUI.DrawTexture(new Rect(-u1 * wRatio, -v1 * hRatio, textureToDraw.width * wRatio, textureToDraw.height * hRatio), textureToDraw);
		GUI.EndGroup();
			
		GUI.matrix = backupMarix;
	}

	public void drawTexture(Texture2D texture, float px, float py)
	{
		///
		if (texture)
			DrawTextureClipped(texture, new Rect(0, 0, texture.width, texture.height), new Rect(px, py, texture.width, texture.height), UIRotation.None);
	}

	public void drawTexture(Texture2D texture, float px, float py, float pw, float ph)
	{
		///
		if (texture)
			DrawTextureClipped(texture, new Rect(0, 0, texture.width, texture.height), new Rect(px, py, pw, ph), UIRotation.None);	//TODO...
	}

	public virtual void SetColor(Color c)
	{
		m_color = c;
	}

	public Color GetColor()
	{
		return m_color;
	}

	public virtual void SetVisible(bool enable)
	{
		this.visible = enable;
	}

	public bool isVisible()
	{
		return visible;
	}

	public virtual void FixedUpdate()
	{
	}

	public virtual void Update()
	{
	}

	public virtual void OnClear()
	{
	}

	public void setXY(float x, float y)
	{
		rect.x = x;
		rect.y = y;
	}

	public Rect Region
	{
		set{ rect = value; }
		get{ return rect; }
	}

	public static bool TryDestroy(UIObject Obj)
	{
		try
		{
			if (Obj != null && Obj.gameObject.name.Contains("(Clone)"))
			{
				UnityEngine.Object.Destroy(Obj.gameObject);
				return true;
			}
		}
		catch (System.Exception /*e*/)
		{
		    
		}
		return false;
	}

	public virtual void OnPopOver()
	{
			
	}

	public virtual void SetUIData(System.Object data)
	{
	}

	public virtual void SetRect(Rect r)
	{
		rect.x = r.x;
		rect.y = r.y;
		rect.width = r.width;
		rect.height = r.height;
	}

	protected Object FindChild(string subName, string typeName)
	{
		Transform sub = this.transform.Find(subName);
		if (sub == null)
			return null;
		return sub.gameObject.GetComponent(typeName);
	}
}