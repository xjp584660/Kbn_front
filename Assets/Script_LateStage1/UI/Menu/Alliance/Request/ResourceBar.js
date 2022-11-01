class ResourceBar extends Slider
{
	public var valueChangingFunc:Function;
	
	function Draw()
	{
		if(Event.current.type == EventType.MouseDown && rect.Contains(Event.current.mousePosition) )
		{
			isDown = true;
		}
		else if(Event.current.type == EventType.MouseUp)	
		{
			isDown = false;
		}
		if(actRect.Contains(Event.current.mousePosition))
		{
			tmpV = GUI.HorizontalSlider (rect, m_curValue, m_min, m_max,sliderStyle, thumbStyle);
			
		}
		else
		{
			GUI.HorizontalSlider (rect, m_curValue, m_min, m_max,sliderStyle, thumbStyle);
		}
		if(!isDown && Event.current.type != EventType.Repaint && valueChangedFunc != null)
		{
			valueChangedFunc(tmpV);
		}
		
		if((!isDown || !actRect.Contains(Event.current.mousePosition))  && Event.current.type != EventType.Repaint)
		{
			return;	
		}
		
		if(tmpV != m_curValue && valueChangingFunc)
		{
			valueChangingFunc(tmpV);
		}
		m_curValue = tmpV;
	}
	function SetCurValue(v:long)
	{
		m_curValue = v;
		tmpV = v;
	}
}

