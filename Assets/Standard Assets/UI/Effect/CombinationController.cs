using System.Collections.Generic;

public class CombinationController : BaseEffect
{	
	private IList<BaseEffect> effectsArr;
	private bool isPlay; 
	private BaseEffect curEffect;  
	private int counter;
    private CombinationType combinationType;
	
    private CombinationState curState;
    private CombinationState oldState;
	
	public enum CombinationType
	{
		SERIAL = 0,
		COLLATERAL,
	};
	
	public enum CombinationState
	{
		STOP = 0,
		PLAYING,
		REVERTING
	};

    public CombinationController(CombinationType _type)
	{
		effectsArr = new List<BaseEffect>();
		
		combinationType = _type;
	}
	
	public void executeEffect()
	{
		if(oldState == CombinationState.STOP || oldState == CombinationState.REVERTING)
		{
			playEffect();
		}
		else if(oldState == CombinationState.PLAYING)
		{
			revertEffect();
		}	
	}
		
	public override void playEffect()
	{
		switch(combinationType)
		{
			case CombinationType.SERIAL:
				if(curState == CombinationState.STOP)
				{
					oldState = curState;
					curState = CombinationState.PLAYING;
					
					counter = 0;
					curEffect = effectsArr[counter]; 			
					curEffect.playEffect();							
				}			
				break;
			case CombinationType.COLLATERAL:
				if(curState == CombinationState.STOP)
				{
					oldState = curState;
					curState = CombinationState.PLAYING;
					
					for(int a = 0; a < effectsArr.Count; a++)
					{
						curEffect = effectsArr[a]; 			
						curEffect.playEffect();						
					}				
				}
				break;
		}
	}
	
    public override void resetEffectState(int _state)
	{
		BaseEffect effect;
		for(int a = 0; a < effectsArr.Count; a++)
		{
			effect = effectsArr[a];
			effect.resetEffectState(_state);		
		}
        oldState = (CombinationState)_state;
		curState = CombinationState.STOP;
	}

	public override void revertEffect()
	{
		switch(combinationType)
		{
			case CombinationType.SERIAL:
				if(curState == CombinationState.STOP && oldState == CombinationState.PLAYING)
				{		
					oldState = curState;
					curState = CombinationState.REVERTING;
					
					counter = effectsArr.Count - 1; 
					curEffect = effectsArr[counter];
					curEffect.revertEffect();			
				}			
				break;
			case CombinationType.COLLATERAL:
				if(curState == CombinationState.STOP && oldState == CombinationState.PLAYING)
				{
					oldState = curState;
					curState = CombinationState.REVERTING;
					
					for(int a = 0; a < effectsArr.Count; a++)
					{
						curEffect = effectsArr[a]; 			
						curEffect.revertEffect();						
					}					
				}				
				break;
		}		
	}
		
	public override void drawItems()
	{
		if(effectsArr != null && effectsArr.Count != 0) 
		{ 
			BaseEffect effect;
			for(int a = 0; a < effectsArr.Count; a++)
			{
				effect = effectsArr[a] as BaseEffect;
				effect.drawItems();
			}			 
		}
	}
	
	public void collateralUpdateEffects()
	{
		if(curState == CombinationState.STOP)
		{
			return;
		}
		
		bool allFinish = true;
		for(int a = 0; a < effectsArr.Count; a++)
		{
			curEffect = effectsArr[a];
			
			if(curEffect != null)
			{
				curEffect.updateEffect();
			}
			
			if(!curEffect.isFinish())
			{
				allFinish = false;
			}
		}
		
		if(allFinish)
		{
			oldState = curState;
			curState = CombinationState.STOP;
		}
	}
	
	public override bool isFinish()
	{
		return (curState == CombinationState.STOP) && (oldState != CombinationState.STOP);
	}
	
	public void serialUpdateItems()
	{
		if(curState == CombinationState.STOP)
		{
			return;
		}
	
		if(curEffect != null) 
		{
			curEffect.updateEffect();	 
		}
		
		if(curState == CombinationState.PLAYING)
		{
			if(curEffect.isFinish())
			{
				counter++;			
				if(counter >= effectsArr.Count)
				{
					oldState = curState;
					curState = CombinationState.STOP;
					curEffect = null;					
				}
				else
				{
					curEffect = effectsArr[counter];
					curEffect.playEffect();					
				}
			}			
		}
		else if(curState == CombinationState.REVERTING)
		{
			if(curEffect.isFinish())
			{
				counter--;
				if(counter < 0)
				{
					oldState = curState;
					curState = CombinationState.STOP;
					curEffect = null;
				}
				else
				{
					curEffect = effectsArr[counter];
					curEffect.revertEffect();
				}
			}
		}		
	}   
	
	public override void updateEffect()
	{
		if(combinationType != CombinationType.SERIAL) 
		{
			collateralUpdateEffects();
		}
		else 
		{
			serialUpdateItems();
		}
	}

	public void add(BaseEffect effect)
	{
	 	effectsArr.Add(effect); 
	}
}

