class Transition_ZoomMovePop extends Transition
{	
	private var moveSpeed:float = 10;
	private var startAlpha:float = 0.3f;
	private var curPos:Vector2;
	private var tarPos:Vector2;
	private var startPos:Vector2;
	private var rect:Rect;
	private var scale:float;
	private var hasSetPos:boolean;
	
	private static final var FadeInDuration = .05f;
	private static final var FadeOutDuration = .05f;
	private static final var ScaleEpsilon = .02f;
	
	public function StartTrans(curMenu:UIObject, nextMenu:UIObject)
	{
		GameMain.singleton.TouchForbidden = true;
		m_nextMenu = nextMenu;
		m_curMenu = curMenu;

		if(nextMenu != null)
		{
			rectNextMenu = nextMenu.rect;
		}
		
		if(curMenu != null)
		{
			rectCurMenu = curMenu.rect;
		}
		
		m_bFin = false;
		hasSetPos = false;
	}
	
	public function SetStartPos(_pos:Vector2):void
	{
		startPos = _pos;
		
		if(startPos == Vector2.zero)
		{
			startPos = new Vector2(MenuMgr.SCREEN_WIDTH * 0.5 , MenuMgr.SCREEN_HEIGHT * 0.5);
		}
	}	
	
	public function FadeinUpdate()
	{
		if(IsFin())
		{
			return;
		}
		
		if(!hasSetPos)
		{
			curPos = startPos;
			tarPos = new Vector2(rectNextMenu.x, rectNextMenu.y);
			
			rect.width  = rectNextMenu.width;
			rect.height = rectNextMenu.height;
			
			hasSetPos = true;
		}
		
		var currentVel : float = 0f;
		scale = Mathf.SmoothDamp(scale, 1, currentVel, FadeInDuration);

		if (1 - scale < ScaleEpsilon)
		{
			scale = 1;
		}
		else if (scale < ScaleEpsilon)
		{
			scale = ScaleEpsilon;
		}

		var needScaleMenu : KBNMenu = m_nextMenu as KBNMenu;
		if ( needScaleMenu != null )
			needScaleMenu.SetScale(scale);
		
		if(scale < startAlpha)
		{
			m_nextMenu.SetColor(new Color(1,1,1,startAlpha));
		}
		else
		{
			m_nextMenu.SetColor(new Color(1,1,1,scale));
		}
		
		if(scale < 1)
		{
			curPos = startPos + scale * (tarPos - startPos);
			rect.x = curPos.x / scale;
			rect.y = curPos.y / scale;			
			m_nextMenu.rect = rect;
		}
		else
		{
			rect.x = rectNextMenu.x;
			rect.y = rectNextMenu.y;			
			m_nextMenu.rect = rect;
				
			m_nextMenu.SetDisabled(false);
			m_curMenu = null;
			m_nextMenu = null;
			GameMain.singleton.TouchForbidden = false;
			m_bFin = true;			
		}
	}
	
	public function FadeoutUpdate()
	{
		if(IsFin()) 
		{
			return;
		}
		
		if(!hasSetPos)
		{
			curPos = new Vector2(rectCurMenu.x, rectCurMenu.y);
			tarPos = startPos;
			
			rect.width  = rectCurMenu.width;
			rect.height = rectCurMenu.height;			
			
			hasSetPos = true;
		}
		
		
		var currentVel : float = 0f;
		scale = Mathf.SmoothDamp(scale, 0, currentVel, FadeOutDuration);
		

		if(scale < ScaleEpsilon)
		{
			
			if(m_nextMenu)
			{
				m_nextMenu.SetDisabled(false);
			}
	
			m_curMenu.SetVisible(false);
			m_curMenu.rect = rectCurMenu;
			m_curMenu = null;
			m_nextMenu = null;
			GameMain.singleton.TouchForbidden = false;
			m_bFin = true;	
			
			return;
		}
		
		if(scale < startAlpha)
		{
			m_curMenu.SetColor(new Color(1,1,1,startAlpha));
		}
		else
		{
			m_curMenu.SetColor(new Color(1,1,1,scale));
		}		
		
		curPos = startPos + scale * (new Vector2(rectCurMenu.x, rectCurMenu.y) - startPos);
		var needScaleMenu : KBNMenu = m_curMenu as KBNMenu;
		if ( needScaleMenu != null )
			needScaleMenu.SetScale(scale);
		rect.x = curPos.x / scale;
		rect.y = curPos.y / scale;
		m_curMenu.rect = rect;		
	}
} 