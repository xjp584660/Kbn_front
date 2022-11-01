class Transition_Down extends Transition
{
	private var curIndex:int;
	public var transY:System.Collections.ArrayList = new System.Collections.ArrayList();
	public var transSpeed:System.Collections.ArrayList = new System.Collections.ArrayList();
	public function StartTrans(curMenu:UIObject, nextMenu:UIObject)
	{
		super.StartTrans(curMenu, nextMenu);
		GameMain.singleton.TouchForbidden = true;
		transY.Clear();
		transY.Add(-1*MenuMgr.SCREEN_HEIGHT);
		transY.Add(100f);
		transY.Add(-50);
		transY.Add(0);
		
		transSpeed.Clear();
		transSpeed.Add(0f);
		transSpeed.Add(2400f);
		transSpeed.Add(-1200f);
		transSpeed.Add(2400f);
	}
	
	public function SetStartPos(_pos:Vector2):void
	{	
		curIndex = 0;
		m_nextMenu.rect.y = _Global.FLOAT(transY[curIndex]);
		curIndex++;
	}
	
	public function FadeinUpdate()
	{
		if( IsFin() ) return;
		if(Math.Abs(m_nextMenu.rect.y - _Global.FLOAT(transY[curIndex])) <= Math.Abs(_Global.FLOAT(transSpeed[curIndex]))*Time.deltaTime)
		{
			m_nextMenu.rect.y = _Global.FLOAT(transY[curIndex]);
			curIndex++;
			if(transY.Count<=curIndex)
			{
				GameMain.singleton.TouchForbidden = false;
				m_nextMenu.rect.y = rectNextMenu.y;
				m_bFin = true;
				(m_nextMenu as KBNMenu).SetDisabled(false);
				(m_nextMenu as KBNMenu).OnFadeinEnd();
				m_curMenu = null;
				m_nextMenu = null;
			}
			return;
		}
		
		m_nextMenu.rect.y += _Global.FLOAT(transSpeed[curIndex])*Time.deltaTime;
	}
	
	public function FadeoutUpdate()
	{

		m_curMenu.rect.y -= _Global.FLOAT(transSpeed[1])*Time.deltaTime;
		if(m_curMenu.rect.y < -1*MenuMgr.SCREEN_HEIGHT)
		{
			GameMain.singleton.TouchForbidden = false;
			m_curMenu.rect.y = rectCurMenu.y;
			m_curMenu.SetVisible(false);
//			if(m_nextMenu)
//				m_nextMenu.SetDisabled(false);
			m_bFin = true;
			
			m_curMenu = null;
			m_nextMenu = null;
		}
	}
}