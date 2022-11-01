using UnityEngine;
using System;

public class SliderEx : Slider 
{
	[SerializeField] private int minNum = 10;
	[SerializeField] private int perNum = 100;
	public Action<long> valueChangedFuncEx;
	private bool isNeedExpansion = false;

	public long GetCurValue()
	{
		if(isNeedExpansion)
			return base.GetCurValue()/perNum;
		else
			return base.GetCurValue();
	}
	
	public void Init(long maxValue)
	{
		IsNeedExpansion (maxValue);
		valueChangedFunc = OnValueChanged;
		if (isNeedExpansion)
			base.Init (maxValue*perNum);
		else
			base.Init(maxValue);

		SetActRect ();
	}
	
	public void Init(long maxValue, bool initDefaultTexture)
	{
		IsNeedExpansion (maxValue);
		valueChangedFunc = OnValueChanged;
		if(isNeedExpansion)
			base.Init (maxValue*perNum,initDefaultTexture);	
		else
			base.Init (maxValue,initDefaultTexture);

		SetActRect ();
	}
	
	public override void SetCurValue(long v)
	{
		if (isNeedExpansion)
			base.SetCurValue (v * perNum);
		else
			base.SetCurValue(v);
	}

	private void IsNeedExpansion(long maxValue)
	{
		if(maxValue<=minNum)
			isNeedExpansion = true;
		else
			isNeedExpansion = false;
	}

	private void OnValueChanged(long curValue) 
	{
		if(isNeedExpansion)
		{
			curValue = (long)Math.Ceiling((Double)curValue/(Double)perNum);
		}
		CallVallueChangedFunc (curValue);
	}

	private void CallVallueChangedFunc(long curValue)
	{
		if (valueChangedFuncEx != null)
			valueChangedFuncEx (curValue);
	}

	protected override void OnMouse(bool _isDown)
	{
		if(!_isDown)
		{
			if(isNeedExpansion)
			{
				SetCurValue((long)Math.Ceiling((Double)m_curValue/(Double)perNum));
				OnValueChanged (m_curValue);
			}
		}
		base.OnMouse (_isDown);
	}

	private void SetActRect()
	{
		actRect = new Rect(rect.x, rect.y-300, rect.width, rect.height + 600);
	}
}
