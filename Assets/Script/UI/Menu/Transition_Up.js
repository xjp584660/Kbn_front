class Transition_Up extends Transition
{	
	protected var speed:float;
	
	public function StartTrans(curMenu:UIObject, nextMenu:UIObject)
	{
//		GameMain.singleton.TouchForbidden = true;
		m_curMenu = curMenu;
		m_nextMenu = nextMenu;
		if(curMenu)
			rectCurMenu = curMenu.rect;
		if(m_nextMenu)	
			rectNextMenu = m_nextMenu.rect;
		offSet = MenuMgr.SCREEN_HEIGHT;
		m_bFin = false;
	}
	
	public function FadeinUpdate()
	{
		if( IsFin() ) return;
		
//		offSet -= fadeinSpeed;
		offSet = Mathf.SmoothDamp(offSet, 0, speed, 0.15f);
		m_nextMenu.rect.y = offSet;
		// Debug.LogError("m_nextMenu.rect.y="+m_nextMenu.rect.y);
		if(m_nextMenu.rect.y < rectNextMenu.y + 2)
		{
//			GameMain.singleton.TouchForbidden = false;
			m_nextMenu.rect.y = rectNextMenu.y;
			m_bFin = true;
			
			if(m_curMenu){
//				m_curMenu.SetVisible(false);
				m_curMenu = null;
			}
			m_nextMenu = null;
		}

	}
	
	public function FadeoutUpdate()
	{
		if( IsFin() ) return;
		
		//offSet -= fadeinSpeed;
		offSet = Mathf.SmoothDamp(offSet, -2, speed, 0.15f);
		m_curMenu.rect.y  = MenuMgr.SCREEN_HEIGHT - offSet + rectCurMenu.y;
//		if(m_curMenu.rect.y >= MenuMgr.SCREEN_HEIGHT)
		if(m_curMenu.rect.y > MenuMgr.SCREEN_HEIGHT - 2)
		{
//			GameMain.singleton.TouchForbidden = false;
			m_curMenu.rect.y = rectCurMenu.y;
			m_curMenu.SetVisible(false);
//			if(m_curMenu instanceof Menu)
//				(m_curMenu as Menu).OnPopOver();
			if(m_nextMenu)
				m_nextMenu.SetDisabled(false);
			m_bFin = true;
			
			m_curMenu = null;
			m_nextMenu = null;
		}
	}
}	