using System;
using System.Collections.Generic;

public class RadioGroup
{
	protected ToggleButton _currentButton = null;
	
	public Action<ToggleButton> buttonChangedFunc; // func(selectedButton)
	
	protected List<ToggleButton> _childs = new List<ToggleButton>();
	
	public void addButton(ToggleButton btn)
	{
		_childs.Add(btn);
		btn.valueChangedFunc2 = valueChangedFunc2;
	}
	public void setSelectedButton(ToggleButton btn)
	{
		setSelectedButton(btn,true);
	}
	public void setSelectedButton(ToggleButton btn,bool sendChangeEvent)
	{
		if(null == btn)
			return;
		if(btn != _currentButton)
		{
			ToggleButton tmp = _currentButton;
			_currentButton = btn;
			
			if(tmp != null)
			{
				tmp.selected = false;
			}
			
			_currentButton.selected = true;
			
			if(buttonChangedFunc != null && sendChangeEvent)
				buttonChangedFunc(_currentButton);
		}
		else
		{
			_currentButton.selected = true;
		}
	}
	
	public ToggleButton getSelectedButton()
	{
		return _currentButton;
	}
	
	protected void valueChangedFunc2(ToggleButton btn,bool b)
	{
		if( b)
		{
			this.setSelectedButton(btn);
		}
		else
		{
			if(btn == _currentButton)
				_currentButton.selected = true;
		}
	}
}
