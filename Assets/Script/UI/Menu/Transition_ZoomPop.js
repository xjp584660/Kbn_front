
class Transition_ZoomPop extends Transition
{
	private var hiding:boolean;
	private var eclipseTime:float;
	private var alpha:float;
	private var m_curMenuColor:Color;
	private var m_nextMenuColor:Color;
	private var m_scale:float;
	public function FadeinUpdate()
	{
		if( IsFin() ) 
			return;
		alpha += 30;
		m_scale = alpha +1;

		
		if(alpha >= 255)
		{
			alpha = 255;
			m_scale =256;
		//	m_nextMenu.SetState( MENUSTATE.Show );
			GameMain.singleton.TouchForbidden = false;
			m_bFin = true;
			
	//		m_curMenu.SetVisible(false);

		}
		var scale:float = 1.0*m_scale/256;
		m_nextMenuColor.a = 1.0*alpha/255;
		m_nextMenu.SetColor(m_nextMenuColor);
		var needScaleMenu : KBNMenu = m_nextMenu as KBNMenu;
		if ( needScaleMenu != null )
			needScaleMenu.SetScale(1.0*m_scale/256);
		//m_nextMenu.SetScale(1.0*m_scale/256);
		m_nextMenu.rect.x = ( rectNextMenu.x + (1-scale)*rectNextMenu.width/2) /scale;
		m_nextMenu.rect.y = ( rectNextMenu.y + (1-scale)*rectNextMenu.height/2) /scale;
		
		if(m_bFin)
		{
			if(	m_nextMenu)	
				m_nextMenu.SetDisabled(false);
			m_curMenu = null;
			m_nextMenu = null;
		}

	}
	
	public function StartTrans(curMenu:UIObject, nextMenu:UIObject)
	{
		GameMain.singleton.TouchForbidden = true;
		m_nextMenu = nextMenu;
		m_curMenu = curMenu;
		if(m_nextMenu)
			m_nextMenuColor = m_nextMenu.GetColor();
		if(m_curMenu)	
			m_curMenuColor =  m_curMenu.GetColor();
		alpha = 0;	
		m_scale = 1;
		
		if(curMenu)
			rectCurMenu = curMenu.rect;
		if(m_nextMenu)	
			rectNextMenu = m_nextMenu.rect;
		m_bFin = false;	
	}
	
	public function FadeoutUpdate()
	{
		alpha += 30;		
		FadeoutPercent(alpha);
		
	}
	
	protected function FadeoutPercent(alpha:int):void
	{
		if( IsFin() ) 
			return;
		m_scale = alpha;
		
		
		if(alpha >= 255)
		{
			alpha = 255;
			m_scale =255;
		//	m_curMenu.SetState( MENUSTATE.Disappear );
//			m_curMenu.enabled = false;
			if(m_nextMenu)
			{
//				m_nextMenu.enabled = true;
				m_nextMenu.SetDisabled(false);
			}	
			m_curMenu.SetVisible(false);	
//			if(m_curMenu instanceof Menu)		
//				(m_curMenu as Menu).OnPopOver();
			GameMain.singleton.TouchForbidden = false;
			m_bFin = true;
		}
		m_curMenuColor.a = 1.0 - 1.0*alpha/255;
		m_curMenu.SetColor(m_curMenuColor);
		var needScaleMenu : KBNMenu = m_curMenu as KBNMenu;
		if ( needScaleMenu != null )
			needScaleMenu.SetScale(1.0 - 1.0*m_scale/256);
		//m_curMenu.SetScale(1.0 - 1.0*m_scale/256);	
		
		var scale:float = 1.0 - 1.0*m_scale/256;
		m_curMenu.rect.x = ( rectCurMenu.x + (1-scale)*rectCurMenu.width/2) /scale;
		m_curMenu.rect.y = ( rectCurMenu.y + (1-scale)*rectCurMenu.height/2) /scale;	
		
		if(m_bFin)
		{
			if(m_curMenu)
				m_curMenu.SetVisible(false);
			if(	m_nextMenu)	
				m_nextMenu.SetDisabled(false);
			m_curMenu.rect.x = rectCurMenu.x ;
			m_curMenu.rect.y = rectCurMenu.y ;
			m_curMenu = null;
			m_nextMenu = null;
		}	
	}
	
	public function FadeOut2End()
	{
		FadeoutPercent(255);
	}
}	

