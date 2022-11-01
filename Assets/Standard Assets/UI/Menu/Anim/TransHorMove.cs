using KBN;

public class TransHorMove : Transition
{
	protected UIObject m_curPanel;
	protected UIObject m_nextPanel;
	private float m_sumTime;

	public override void StartTrans(UIObject curMenu, UIObject nextMenu)
	{
		GameMain.singleton.TouchForbidden = true;
		m_curPanel = curMenu;
		m_nextPanel = nextMenu;
		if(curMenu)
			rectCurMenu = curMenu.rect;
		if(m_nextPanel)	
			rectNextMenu = m_nextPanel.rect;
		offSet = MenuMgr.SCREEN_WIDTH;
		m_bFin = false;
		m_sumTime = 0.0f;
		
		m_nextPanel.rect.x = offSet;
	}
	
	public override void FadeinUpdate()
	{
		if( IsFin() ) return;
		
		float offsetDetal = UnityEngine.Mathf.SmoothStep(0, MenuMgr.SCREEN_WIDTH, m_sumTime/(MenuMgr.SCREEN_WIDTH/(8.0f*fadeinSpeed)));
		offSet -= (int)offsetDetal;
		//offSet -= fadeinSpeed;
		m_nextPanel.rect.x = offSet;
		m_curPanel.rect.x = -MenuMgr.SCREEN_WIDTH + offSet;
		if(m_nextPanel.rect.x <= rectNextMenu.x)
		{
			GameMain.singleton.TouchForbidden = false;
			m_nextPanel.rect.x = rectNextMenu.x;
			m_curPanel.rect.x = rectCurMenu.x;
			m_bFin = true;
			
			m_nextPanel = null;
			m_curPanel = null;
		}
		m_sumTime += UnityEngine.Time.deltaTime;
	}
	
	public override void FadeoutUpdate()
	{
		if( IsFin() ) return;
		
		offSet -= fadeinSpeed;
		m_curPanel.rect.x  = MenuMgr.SCREEN_WIDTH - offSet + rectCurMenu.x;
		m_nextPanel.rect.x  = -offSet + rectNextMenu.x;
		if(m_curPanel.rect.x >= MenuMgr.SCREEN_WIDTH)
		{
			GameMain.singleton.TouchForbidden = false;
			m_curPanel.rect.x = rectCurMenu.x;

			m_curPanel.SetVisible(false);
			if(m_curPanel is KBNMenu)
				(m_curPanel as KBNMenu).OnPopOver();
			m_nextPanel.SetDisabled(false);
			m_nextPanel.rect = rectNextMenu;
			m_bFin = true;
			
			m_curPanel = null;
			m_nextPanel = null;
		}
	}

	public void instantFinishTrans(bool isFadeIn)
	{
		if(m_curPanel == null || m_nextPanel == null)
		{
			return;
		}
	
		if(isFadeIn)
		{
			m_nextPanel.rect.x = rectNextMenu.x;
			m_curPanel.rect.x = rectCurMenu.x;
			m_bFin = true;
			
			m_nextPanel = null;
			m_curPanel = null;		
		}
		else
		{	
			
			m_curPanel.rect.x = rectCurMenu.x;

			m_curPanel.SetVisible(false);
			if(m_curPanel is KBNMenu)
				(m_curPanel as KBNMenu).OnPopOver();
			m_nextPanel.SetDisabled(false);
			m_nextPanel.rect = rectNextMenu;
			m_bFin = true;
			
			m_curPanel = null;
			m_nextPanel = null;			
		}		
	}
}
