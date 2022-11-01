class Transition_ZoomComponent extends Transition
{
	private var transitionBG:Transition_Fade;
	private var transitionMenu:Transition_ZoomMovePop;
	private var startPos:Vector2;

	private var hasSetTransition:boolean;

	public function StartTrans(curMenu:UIObject, nextMenu:UIObject)
	{
		GameMain.singleton.TouchForbidden = true;
		m_bFin = false;
		
		m_curMenu = curMenu;
		m_nextMenu = nextMenu;
				
		hasSetTransition = false;																				
	}
	
	public function SetStartPos(_pos:Vector2):void
	{	
		startPos = _pos;
	}
	
	public function FadeinUpdate()
	{		
		if(!hasSetTransition)
		{
			transitionBG = (m_nextMenu as PopMenuComponent).BgMenu.transition as Transition_Fade;
			transitionMenu = (m_nextMenu as PopMenuComponent).popMenu.transition as Transition_ZoomMovePop;

			transitionBG.StartTrans();	
			transitionBG.FadeinUpdate();
			transitionMenu.StartTrans(m_curMenu, (m_nextMenu as PopMenuComponent).popMenu);	
			transitionMenu.SetStartPos(startPos);
			transitionMenu.FadeinUpdate();

			hasSetTransition = true;
		}
		
		if(transitionBG.IsFin())
		{
			if(transitionMenu.IsFin())
			{
				GameMain.singleton.TouchForbidden = false;
				m_bFin = true;
			}
			else
			{
				transitionMenu.FadeinUpdate();
			}			
		}
		else
		{
			transitionBG.FadeinUpdate();
		}
	}
	
	public function FadeoutUpdate()
	{
		if(!hasSetTransition)
		{
			transitionBG = (m_curMenu as PopMenuComponent).BgMenu.transition;
			transitionMenu = (m_curMenu as PopMenuComponent).popMenu.transition;

			transitionBG.StartTrans();	
			transitionBG.FadeoutUpdate();	
			transitionMenu.StartTrans((m_curMenu as PopMenuComponent).popMenu, m_nextMenu);	
			transitionMenu.SetStartPos(startPos);		
			transitionMenu.FadeoutUpdate();
			
			hasSetTransition = true;
		}

		if(transitionMenu.IsFin())
		{
			if(transitionBG.IsFin())
			{
				GameMain.singleton.TouchForbidden = false;
				m_bFin = true;
			}
			else
			{
				transitionBG.FadeoutUpdate();
			}			
		}
		else
		{
			transitionMenu.FadeoutUpdate();
		}
	}
}