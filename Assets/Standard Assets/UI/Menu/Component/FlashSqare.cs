using UnityEngine;

public class FlashSqare //extends SimpleUIObj
{
	/*animation*/
	private bool running = false;
	private float m_alphaValue = 0.0f;
	private float m_flushSpeed = 0.0f;
	private Texture2D m_showTexture = null;

	private string m_texName;
	private string m_texType;
	
	public void Play(string texName, string texFolder, float flushSpeed)
	{
		m_texName = texName;
		m_texType = texFolder;
		m_showTexture = null;
		running = true;
		m_alphaValue = 0.0f;
		m_flushSpeed = flushSpeed;
	}
	public void Stop(){
		running = false;	
	}
	void Init()
	{
		running = false;
		m_showTexture = null;
	}
	// Update is called once per frame
	public void Update()
	{
		if(	!running )
			return;

		float PI2 = 2.0f * 3.14149f;
		m_alphaValue += Time.deltaTime * m_flushSpeed;// * (1+m_alphaValue);
		if ( m_alphaValue > PI2)
		{
			//int cnt = (int)(m_alphaValue / m_alphaValue);
			//m_alphaValue -= cnt * m_alphaValue;
			m_alphaValue %= PI2;
		}
	}

	public int Draw(Rect texRect)
	{
		if ( m_showTexture == null )
		{
			TextureMgr texMgr = TextureMgr.instance();
			m_showTexture = texMgr.LoadTexture(m_texName, m_texType);
			if ( m_showTexture == null )
				return -1;
		}

		float showAlpha = Mathf.Sin(m_alphaValue);
		showAlpha -= 0.5f;
		if ( showAlpha <= 0.0f )
			return -1;
		showAlpha *= 2.0f;
		Color oldColor = GUI.color;
		GUI.color = new Color(1.0f, 1.0f, 1.0f, showAlpha);
		GUI.DrawTexture(texRect, m_showTexture);
		GUI.color = oldColor;
		return -1;
	}
}
