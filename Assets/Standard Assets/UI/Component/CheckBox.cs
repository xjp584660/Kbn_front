using UnityEngine;
using System;

public class CheckBox : Button
{
	public Texture picOnSelected;
	public Texture picOnUnselected;

	public Action<CheckBox, bool> OnSelectChanged;
	protected bool m_isSelected;

	private bool m_isInitSet;
	private bool m_isLocked; // lock state, can't be click.

	public CheckBox()
	{
		m_isInitSet = false;
		m_isLocked = false;
		m_isSelected = true;
		image = picOnSelected;
	}

	public override int Click()
	{
		if ( m_isLocked )
			return -1;

		var v = base.Click();
		this.IsSelect = !this.IsSelect;
		return v;
	}

	public void FocusSetup(bool isSelect, bool isInvokeCallback)
	{
		m_isSelected = isSelect;
		if ( m_isSelected == true )
			image = picOnSelected;
		else
			image = picOnUnselected;
		if ( isInvokeCallback && OnSelectChanged != null )
			OnSelectChanged(this, isSelect);
	}

	public bool IsSelect
	{
		get
		{
			return m_isSelected;
		}
		set
		{
			if ( m_isSelected == value && m_isInitSet == true )
				return;
			
			m_isInitSet = true;
			if ( value == true )
				image = picOnSelected;
			else
				image = picOnUnselected;
			m_isSelected = value;
			
			if ( OnSelectChanged != null )
				OnSelectChanged(this, value);
		}
	}


	public bool LockState
	{
		get
		{
			return m_isLocked;
		}
		set
		{
			m_isLocked = value;
		}
	}

}
