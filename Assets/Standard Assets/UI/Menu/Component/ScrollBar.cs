using UnityEngine;

public class ScrollBar : UIObject
{
	[UnityEngine.Space(30), UnityEngine.Header("----------ScrollBar----------")]

	public GUIStyle mystyle;
	public int width;
	public int height;
	public float fadeinTime = 0.5f;
	private float length;
	private bool hiding;
	private float eclipseTime;
	//private float alpha;
	
	public override void Init()
	{	
		mystyle.normal.background = TextureMgr.instance().LoadTexture("scrollbar",TextureType.BUTTON);
		mystyle.border.top = 2;
		mystyle.border.bottom = 2;
	}
	public override int Draw()
	{
		if(!visible)
			return -1;
		Color oldColor = GUI.color;
		GUI.color = new Color(oldColor.r, oldColor.g, oldColor.b, 1.0f*alpha/255);
		GUI.Label( rect, "", mystyle);
		GUI.color = oldColor;
		return -1;
	}

	public void MoveTo(float x, float y)
	{
		rect.x = x;
		rect.y = y;
	}
	
	public void SetLength(float l)
	{
		length = l;
		rect.height = length;
	}
	
	public float GetLength()
	{
		return length;
	}
	
	public void Hide()
	{
		hiding = true;
		alpha = 0;
		eclipseTime = 0;
		if( fadeinTime == 0)
			fadeinTime = 0.5f;
	}
	
	public void Show()
	{
		visible = true;
		alpha = 255;
	}
	
	public void UpdateData()
	{
		if(hiding)
		{
			eclipseTime += Time.deltaTime;
			alpha = 255 - 255*eclipseTime/fadeinTime;
			if(alpha <= 0)
			{
				hiding = false;
				visible = false;
				alpha = 255;
			}
		}
	}

}

