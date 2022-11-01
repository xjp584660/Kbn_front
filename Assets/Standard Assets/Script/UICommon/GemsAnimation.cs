using UnityEngine;
using System.Collections;

public class GemsAnimation : SimpleUIObj
{
	/*gems animation*/
	private Rect m_screenGemsDefaultRect = new Rect(502,10,120,63);
	private Rect screenGemsAnimation = new Rect(502,10,1,63);
	private Rect soureGemsAnimation = new Rect(0.0f,0.0f,1.0f,1.0f);
	private Texture gemsLightTex;
	private float gemsAnimationWaitingTime = 30.0f;
	
	public void UpdateGemsDefaultRect(Rect rect)
	{
		m_screenGemsDefaultRect = new Rect(rect);
		m_screenGemsDefaultRect.x += 12;
		m_screenGemsDefaultRect.width -= 24;
		m_screenGemsDefaultRect.y += 10;
		m_screenGemsDefaultRect.height -= 20;
		
		if ( !this.isVisible() || gemsAnimationWaitingTime >= 0.0f )
		{
			screenGemsAnimation = new Rect(m_screenGemsDefaultRect);
			screenGemsAnimation.width = 1.0f;
		}
		else
		{
			screenGemsAnimation.y = m_screenGemsDefaultRect.y;
			screenGemsAnimation.height = m_screenGemsDefaultRect.height;
		}
	}
	
	// Update is called once per frame
	void Update () {
		if(gemsAnimationWaitingTime <= 0)
		{
			int width = 0;
			int change = KBN._Global.INT32(Time.deltaTime*500);
			if(screenGemsAnimation.x == m_screenGemsDefaultRect.left && screenGemsAnimation.width < m_screenGemsDefaultRect.width)
			{
				screenGemsAnimation.width = screenGemsAnimation.width + change > m_screenGemsDefaultRect.width ? m_screenGemsDefaultRect.width :screenGemsAnimation.width + change;
				soureGemsAnimation.width = 1.0f*(screenGemsAnimation.width/m_screenGemsDefaultRect.width);
				soureGemsAnimation.x = 1.0f - soureGemsAnimation.width;
			}
			else
			{
				screenGemsAnimation.x += change;
				if(screenGemsAnimation.x > m_screenGemsDefaultRect.right)
				{
					screenGemsAnimation.x = m_screenGemsDefaultRect.left;
					screenGemsAnimation.width = 1;
					
					gemsAnimationWaitingTime = 60.0f;
				}
				else
				{
					screenGemsAnimation.width -= change;
					soureGemsAnimation.width = 1.0f*(screenGemsAnimation.width/m_screenGemsDefaultRect.width);
					soureGemsAnimation.x = 0;
				}
			}
			
		}
		else
		{
			gemsAnimationWaitingTime -= Time.deltaTime;
		}
	}
	
	public int Draw()
	{	
		if(this.isVisible())
		{
			if(Event.current.type == EventType.Repaint && gemsAnimationWaitingTime <= 0)
			{
				if(gemsLightTex == null)
				{
					gemsLightTex = TextureMgr.instance().LoadTexture("GetMore_bright_flash",TextureType.GETMORE);
				}
				Graphics.DrawTexture(screenGemsAnimation,gemsLightTex,soureGemsAnimation,0,0,0,0,null);
			}
		}
		return -1;
	}
}
