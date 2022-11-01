using UnityEngine;

public class Fade : BaseEffect
{	
	public enum FadeState
	{
		STOP = 0,
		FADING_IN,
		FADING_OUT,
		PAUSE
	};
	
    private FadeState curState;
    private FadeState oldState;
    private EffectConstant.FadeType fadeType;
	
	private float minAlpha;
	private float maxAlpha;
	
	private float alphaValue;
	private float moveCounter = 0;
	private float stepValue = 0;
	private float speed = 5;
	
	public Fade()
	{
		
	}	
	
	public void setFadeSpeed(float _speed)
	{
		speed = _speed;
	}		
	
	public override bool isFinish()
	{
		bool isEffectFinish = (curState == FadeState.STOP) && (oldState == FadeState.FADING_IN || oldState == FadeState.FADING_OUT);
	
		if(curObject != null)
		{
			return isEffectFinish;	
		}
		
		if(subEffect != null)
		{
			return isEffectFinish && subEffect.isFinish(); 
		}
		
		return true;
	}
	
    public void init(BaseEffect _effect, EffectConstant.FadeType _fadeType)
	{
		init(_effect, _fadeType, 0, 1);
	}
	
    public void init(BaseEffect _effect, EffectConstant.FadeType _fadeType, float _minAlpha, float _maxAlpha)
	{
		fadeType  = _fadeType;				
		subEffect = _effect;	
		minAlpha  = _minAlpha;
		maxAlpha  = _maxAlpha;
		
		curObject = null;
		
		curState  = FadeState.STOP;
		oldState  = FadeState.STOP;
		
		resetEffectState((int)EffectConstant.EffectState.START_STATE);		
	}

    public void init(UIObject _uiObject, EffectConstant.FadeType _fadeType)
	{
		init(_uiObject, _fadeType, 0, 1);
	}
	
	//the Alpha is from 0 to 1
    public void init(UIObject _uiObject, EffectConstant.FadeType _fadeType, float _minAlpha, float _maxAlpha)
	{		
		fadeType  = _fadeType;				
		curObject = _uiObject;				
		minAlpha  = _minAlpha;
		maxAlpha  = _maxAlpha;
		
		subEffect = null;
		
		curState  = FadeState.STOP;
		oldState  = FadeState.STOP;
		
		resetEffectState((int)EffectConstant.EffectState.START_STATE);
	}			
	
	public override void pauseEffect()
	{
		if(curState == FadeState.FADING_IN || curState == FadeState.FADING_OUT)
		{
			oldState = curState;
			curState = FadeState.PAUSE;
		}
		
		if(subEffect != null)
		{
			subEffect.pauseEffect();
		}
	}
	
	public override void playEffect()
	{	
		switch(fadeType)
		{
			case EffectConstant.FadeType.FADE_IN:
				
				if(curState == FadeState.STOP)
				{
					alphaValue = minAlpha;
					oldState = curState;
					curState = FadeState.FADING_IN; 					
				}
				else if(curState == FadeState.FADING_OUT)
				{
					oldState = curState;
					curState = FadeState.FADING_IN;
				}
				else if(curState == FadeState.PAUSE)
				{
					curState = oldState;
					oldState = FadeState.PAUSE;
				}
				break;
			case EffectConstant.FadeType.FADE_OUT:
				if(curState == FadeState.STOP)
				{
					alphaValue = maxAlpha;
					oldState = curState;
					curState = FadeState.FADING_OUT; 					
				}
				else if(curState == FadeState.FADING_IN)
				{
					oldState = curState;
					curState = FadeState.FADING_OUT;
				}
				else if(curState == FadeState.PAUSE)
				{
					curState = oldState;
					oldState = FadeState.PAUSE;
				}	

				break;
			case EffectConstant.FadeType.BLINK:
				if(curState == FadeState.PAUSE)
				{
					curState = oldState;
					oldState = FadeState.PAUSE;				
				}
				else if(curState == FadeState.STOP && oldState == FadeState.STOP)
				{
					alphaValue = maxAlpha;
					oldState = curState;
					curState = FadeState.FADING_OUT; 					
				}
				break;
		}
		
		if(subEffect != null)
		{
			subEffect.playEffect();
		}		
	}
	
	public override void revertEffect()
	{
		switch(fadeType)
		{
			case EffectConstant.FadeType.FADE_IN:
				
				if(curState == FadeState.STOP
				&& oldState == FadeState.FADING_IN)
				{
					alphaValue = maxAlpha;
					oldState = curState;
					curState = FadeState.FADING_OUT; 					
				}
				else if(curState == FadeState.FADING_IN)
				{
					oldState = curState;
					curState = FadeState.FADING_OUT;
				}
				else if(curState == FadeState.PAUSE 
					 && oldState == FadeState.FADING_IN)
				{
					oldState = curState;
					curState = FadeState.FADING_OUT;					
				}
				
				break;
			case EffectConstant.FadeType.FADE_OUT:
				if(curState == FadeState.STOP
				&& oldState == FadeState.FADING_OUT)
				{
					alphaValue = maxAlpha;
					oldState = curState;
					curState = FadeState.FADING_IN; 
				}
				else if(curState == FadeState.FADING_IN)
				{
					oldState = curState;
					curState = FadeState.FADING_OUT;
				}
				else if(curState == FadeState.PAUSE
					 && oldState == FadeState.FADING_IN)
				{
					curState = oldState;
					oldState = FadeState.FADING_OUT;
				}	

				break;
			case EffectConstant.FadeType.BLINK:
				break;
		}
		
		if(subEffect != null)
		{
			subEffect.revertEffect();
		}			
	}
	
	public override void updateEffect()
	{		
		if(subEffect != null)
		{
			subEffect.updateEffect();
		}	
	
		if(curState == FadeState.STOP || curState == FadeState.PAUSE)
		{
			return;
		}

		moveCounter += Time.deltaTime;	
		stepValue = moveCounter * speed;		
		moveCounter = 0;
		
		if(curState == FadeState.FADING_IN)
		{
			alphaValue += stepValue;
			
			if(alphaValue > maxAlpha)
			{
				if(fadeType != EffectConstant.FadeType.BLINK)
				{
					oldState = curState;
					curState = FadeState.STOP;
					
					setUIObjectDisable(false);
				}
				else
				{
					oldState = curState;	
					curState = FadeState.FADING_OUT;
				}
				
				alphaValue = maxAlpha;
			}
		}
		else if(curState == FadeState.FADING_OUT)
		{
			alphaValue -= stepValue;
			
			if(alphaValue < minAlpha)
			{
				if(fadeType != EffectConstant.FadeType.BLINK)
				{
					oldState = curState;
					curState = FadeState.STOP;
					
					setUIObjectDisable(true);
				}
				else
				{
					oldState = curState;
					curState = FadeState.FADING_IN;			
				}
				
				alphaValue = minAlpha;
			}
		}																						
	}	
		
	public override void drawItems()
	{
		float oldAlpha = GUI.color.a;
		GUI.color = new Color(1, 1, 1, alphaValue * oldAlpha);

		if(curObject != null)
		{
			curObject.Draw();
		}
		
		if(subEffect != null)
		{
			subEffect.drawItems();
		}
	
		GUI.color = new Color(1, 1, 1, oldAlpha);		
	}
	
    public override void resetEffectState(int _state)
	{
        switch((EffectConstant.EffectState)_state)
		{
			case EffectConstant.EffectState.START_STATE:
				
				switch(fadeType)
				{
					case EffectConstant.FadeType.FADE_IN:
						alphaValue = minAlpha;
						
						if(curObject != null)
						{
							curObject.SetDisabled(true);
						}
						
						if(subEffect != null)						
						{
							subEffect.setUIObjectDisable(true);
						}
						break;
					case EffectConstant.FadeType.FADE_OUT:
						alphaValue = maxAlpha;
						
						if(curObject != null)
						{
							curObject.SetDisabled(false);
						}						
						
						if(subEffect != null)						
						{						
							subEffect.setUIObjectDisable(false);
						}
						break;
					case EffectConstant.FadeType.BLINK:
						alphaValue = maxAlpha;
						break;
				}						
				
				break;				
			case EffectConstant.EffectState.END_STATE:
				
				switch(fadeType)
				{
					case EffectConstant.FadeType.FADE_IN:
						alphaValue = maxAlpha;
						
						if(curObject != null)
						{
							curObject.SetDisabled(false);
						}						
						
						if(subEffect != null)						
						{						
							subEffect.setUIObjectDisable(false);
						}
						break;
					case EffectConstant.FadeType.FADE_OUT:

						alphaValue = minAlpha;
						
						if(curObject != null)
						{
							curObject.SetDisabled(true);
						}
						
						if(subEffect != null)						
						{
							subEffect.setUIObjectDisable(true);
						}						
						break;
					case EffectConstant.FadeType.BLINK:
						alphaValue = maxAlpha;
						break;
				}					
				
				break;				
		}

        oldState  = (FadeState)_state;
		curState  = FadeState.STOP;
	}			
}
