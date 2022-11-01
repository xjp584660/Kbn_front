class Transition_immediate extends Transition
{
	public function StartTrans(curMenu:UIObject, nextMenu:UIObject)
	{
		GameMain.singleton.TouchForbidden = true;
		m_bFin = false;
		m_nextMenu = nextMenu;
		m_curMenu = curMenu;
		//MenuMgr.getInstance().FixedUpdate();
	}
	
	public function FadeinUpdate()
	{
		if( IsFin() ) 
			return;
		m_nextMenu.SetDisabled(false);
		m_curMenu = null;
		m_nextMenu = null;
		GameMain.singleton.TouchForbidden = false;
		m_bFin = true;
	}
	
	public function FadeoutUpdate()
	{
		if( IsFin() ) 
			return;
//		m_curMenu.enabled = false;
		if(m_nextMenu)
		{
//			m_nextMenu.enabled = true;
			m_nextMenu.SetDisabled(false);
		}	

		m_curMenu.SetVisible(false);
//		if(m_curMenu instanceof Menu)		
//			(m_curMenu as Menu).OnPopOver();
		m_curMenu = null;
		m_nextMenu = null;
		GameMain.singleton.TouchForbidden = false;
		m_bFin = true;
	}
	
}

