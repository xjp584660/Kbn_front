class Transition_Fade extends Transition
{
	private var endAlpha:float;
	private var curAlpha:float;
	private var fadeSpeed:int = 3;	
	private var timeCounter:float;
	
	private var fadeObject:UIObject;
	private var hasSetTransition:boolean;
	
	public function StartTrans()
	{
		GameMain.singleton.TouchForbidden = true;
		m_bFin = false;
	}
	
	public function SetFadeObject(obj:UIObject):void
	{
		m_curMenu = obj;
	}
	
	public function SetEndAlpha(_endAlpha:float):void
	{
		endAlpha   = _endAlpha;
	}
	
	public function FadeinUpdate()
	{
		if(IsFin()) 
		{
			return;
		}
		
		timeCounter = Time.deltaTime;
		curAlpha += timeCounter * fadeSpeed;
		
		if(curAlpha > endAlpha)
		{
			curAlpha = endAlpha;
		}
		
		m_curMenu.SetColor(new Color(1, 1, 1, curAlpha));
		
		if(curAlpha >= endAlpha)
		{
			GameMain.singleton.TouchForbidden = false;
			m_curMenu.SetDisabled(false);
			m_bFin = true;		
		}
	}
	
	public function FadeoutUpdate()
	{
		if(IsFin())
		{ 
			return;
		}
		
//		m_curMenu.enabled = false;
		
		timeCounter = Time.deltaTime;
		curAlpha -= timeCounter * fadeSpeed;		
		
		if(curAlpha < 0)
		{
			curAlpha = 0;
		}
		
		m_curMenu.SetColor(new Color(1, 1, 1, curAlpha));
		
		if(curAlpha <= 0)
		{	
			GameMain.singleton.TouchForbidden = false;		
			m_curMenu.SetVisible(false);
			m_curMenu = null;
			m_bFin = true;		
		}
	}
}