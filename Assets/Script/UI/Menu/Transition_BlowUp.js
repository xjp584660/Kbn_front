
class Transition_BlowUp extends Transition
{
	enum TRANSITON_STATE{
		NONE,
		BLOW_UP,
		REDUCE,
		OVER
	};
	
	private var alpha:float;
	private var m_curMenuColor:Color;
	private var m_nextMenuColor:Color;
	private var m_scale:float;
	private var m_state:TRANSITON_STATE;
	public function FadeinUpdate()
	{
		if( IsFin() ) 
			return;
		alpha += 30;
		
		if(m_state == TRANSITON_STATE.BLOW_UP)
		{
			m_scale+=0.07;
			if(m_scale>=1.1)m_state = TRANSITON_STATE.REDUCE;
		}
		else if(m_state == TRANSITON_STATE.REDUCE)
		{
			m_scale-=0.07;
			if(m_scale<=1.0)
			{
				m_state = TRANSITON_STATE.OVER;
				m_scale = 1.0;
				m_bFin = true;
			}
		}
		

		
		if(alpha >= 255)
		{
			alpha = 255;
		//	m_nextMenu.SetState( MENUSTATE.Show );
//			m_bFin = true;
			
	//		m_curMenu.SetVisible(false);

		}
		m_nextMenuColor.a = 1.0*alpha/255;
		m_nextMenu.SetColor(m_nextMenuColor);
		var needScaleMenu : KBNMenu = m_nextMenu as KBNMenu;
		if ( needScaleMenu != null )
			needScaleMenu.SetScale(m_scale);
		//m_nextMenu.SetScale(m_scale);
		m_nextMenu.rect.x = ( rectNextMenu.x + (1-m_scale)*rectNextMenu.width/2) /m_scale;
		m_nextMenu.rect.y = ( rectNextMenu.y + (1-m_scale)*rectNextMenu.height/2) /m_scale;
		
		if(m_bFin)
		{
			GameMain.singleton.TouchForbidden = false;
			if(	m_nextMenu)	
				m_nextMenu.SetDisabled(false);
			m_curMenu = null;
			m_nextMenu = null;
		}

	}
	
	public function SetStartPos(_pos:Vector2):void
	{	
		alpha = 0;	
		m_scale = 0.0001f;
		m_state = TRANSITON_STATE.BLOW_UP;
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
		
		if(curMenu)
			rectCurMenu = curMenu.rect;
		if(m_nextMenu)	
			rectNextMenu = m_nextMenu.rect;
		m_bFin = false;	
	}
	
	public function FadeoutUpdate()
	{		
		if( IsFin() ) 
			return;
		alpha -= 30;
		
		m_scale-=0.1;
		if(m_scale<=0)
		{
			m_scale = 0.001f;
			m_bFin = true;
		}
		
		if(0 >= alpha)
		{
			alpha = 0;
		}
		m_curMenuColor.a = 1.0*alpha/255;
		m_curMenu.SetColor(m_curMenuColor);
		var needScaleMenu : KBNMenu = m_curMenu as KBNMenu;
		if ( needScaleMenu != null )
			needScaleMenu.SetScale(m_scale);
		//m_curMenu.SetScale(m_scale);	
		
		m_curMenu.rect.x = ( rectCurMenu.x + (1-m_scale)*rectCurMenu.width/2) /m_scale;
		m_curMenu.rect.y = ( rectCurMenu.y + (1-m_scale)*rectCurMenu.height/2) /m_scale;	
		
		if(m_bFin)
		{
			GameMain.singleton.TouchForbidden = false;
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
	
}	

