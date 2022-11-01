using UnityEngine;

public class Scale : BaseEffect
{
	private float minScale;
	private float maxScale; 
	private float curScale;
	
    private ScaleState curState;
    private ScaleState oldState;
	private bool isZoomin; 
	private float speed = 1;
	private float scaleValue; 
	private Vector2 pivotPoint; 
	private Matrix4x4 oldMatrix;

	public enum ScaleState
	{
		STOP = 0,
		ZOOMING,
		REVERT_ZOOMING,
		PAUSE
	};

    public Scale()
    {

    }
	
	public void init(UIObject _obj, bool _isZoomin, float _minScale, float _maxScale)
	{		
		curObject = _obj;
		subEffect = null;
		minScale  = _minScale;
		maxScale  = _maxScale;
		
		isZoomin = _isZoomin;
		curState = ScaleState.STOP;
		oldState = ScaleState.STOP;

        resetEffectState((int)EffectConstant.EffectState.START_STATE);
						
		createPivotPoint(EffectConstant.PivotPosition.MIDDLE_CENTER);		
	}
	
	
	
	public void init(BaseEffect _effect, bool _isZoomin, float _minScale, float _maxScale)
	{
		curObject = null;
		minScale  = _minScale;
		maxScale  = _maxScale;
		subEffect = _effect;
		
		isZoomin = _isZoomin;
		curState = ScaleState.STOP;
		oldState = ScaleState.STOP;	
		
        resetEffectState((int)EffectConstant.EffectState.START_STATE);
		
		createPivotPoint(EffectConstant.PivotPosition.MIDDLE_CENTER);								
	} 
	
    public void createPivotPoint(EffectConstant.PivotPosition positon)
	{
		UIObject obj = getUIObject(); 
		
		if(obj == null)
		{
			return;
		}	
					
		switch(positon)
		{
			case EffectConstant.PivotPosition.MIDDLE_CENTER:
				pivotPoint = new Vector2(obj.rect.x + obj.rect.width * 0.5f,			
										 obj.rect.y + obj.rect.height * 0.5f);
				break;		
		}
	}	

	public override void playEffect()
	{
		if(curState == ScaleState.STOP)
		{
			oldState = curState;
			curState = ScaleState.ZOOMING; 
			
			if(isZoomin)
			{
				curScale = minScale;
			}
			else
			{
				curScale = maxScale;
			}
		}
		else if(curState == ScaleState.REVERT_ZOOMING)
		{
			oldState = curState;
			curState = ScaleState.ZOOMING;			
		}
		else if(curState == ScaleState.PAUSE)
		{
			curState = oldState;			
			oldState = ScaleState.PAUSE;		
		}
		
		if(subEffect != null)
		{
			subEffect.playEffect();
		}				
	}
	
	public override void pauseEffect()
	{
		if(curState == ScaleState.REVERT_ZOOMING || curState == ScaleState.ZOOMING)
		{
			oldState = curState;
			curState = ScaleState.PAUSE;
		}
		
		if(subEffect != null)
		{
			subEffect.pauseEffect();
		}						
	}
	
	public override void revertEffect()
	{
		if(curState == ScaleState.ZOOMING)
		{
			oldState = curState;
			curState = ScaleState.REVERT_ZOOMING;
		}
		else if(curState == ScaleState.STOP)
		{
			oldState = curState;
			curState = ScaleState.REVERT_ZOOMING;		
		
			if(isZoomin)
			{
				curScale = maxScale;
			}
			else
			{
				curScale = minScale;
			}			
		}
		
		if(subEffect != null)
		{
			subEffect.revertEffect();
		}		
	}
	
	public override void updateEffect()
	{
		if(curState != ScaleState.STOP || curState != ScaleState.PAUSE)
		{ 
			float timeCounter = Time.deltaTime;	
			scaleValue = timeCounter * speed;
			if(curState == ScaleState.ZOOMING)
			{
				if(isZoomin)
				{ 
					if(curScale == maxScale)
					{ 
						oldState = curState;
						curState = ScaleState.STOP;
					}
					
					curScale += scaleValue;
					if(curScale > maxScale)
					{
						curScale = maxScale;
					}
				}
				else
				{ 
					if(curScale == minScale)
					{
						oldState = curState;
						curState = ScaleState.STOP;					
					}
				
					curScale -= scaleValue; 				
					if(curScale < minScale)
					{
						curScale = minScale;
					}
				}
			}
			else if(curState == ScaleState.REVERT_ZOOMING)			
			{
				if(isZoomin)
				{
					if(curScale == minScale)
					{
						oldState = curState;
						curState = ScaleState.STOP;					
					}
				
					curScale -= scaleValue; 				
					if(curScale < minScale)
					{
						curScale = minScale;
					}
				}
				else
				{
					if(curScale == maxScale)
					{ 
						oldState = curState;
						curState = ScaleState.STOP;
					}
					
					curScale += scaleValue;
					if(curScale > maxScale)
					{
						curScale = maxScale;
					}
				}				
			}
		}
		
		
		if(subEffect != null)
		{
			subEffect.updateEffect();
		}			
	}
	
	public override void drawItems()
	{
		oldMatrix = GUI.matrix;

		GUI.matrix = standardMatrix;

		Vector2 zeroPoint = GUIUtility.GUIToScreenPoint(Vector2.zero);		
		Vector3 newPoint = new Vector3(pivotPoint.x + zeroPoint.x, pivotPoint.y + zeroPoint.y, 0f);

		Matrix4x4 tempMatrix = 	Matrix4x4.TRS (newPoint, Quaternion.identity, new Vector3(curScale, curScale, 1f)) 
									* Matrix4x4.TRS(-newPoint, Quaternion.identity, Vector3.one);

		GUI.matrix = GUIMatrix * tempMatrix * (GUIMatrix.inverse * oldMatrix);

		if(curObject != null)
		{			
			curObject.Draw();
		}
		
		if(subEffect != null)
		{			
			subEffect.drawItems();
		}

		GUI.matrix = oldMatrix;			
	}
	
	public override bool isFinish()
	{
		bool isFinishEffect = (curState == ScaleState.STOP && (oldState == ScaleState.ZOOMING || oldState == ScaleState.REVERT_ZOOMING));
		
		if(curObject != null)
		{
			return isFinishEffect;
		}
		else if(subEffect != null)
		{
			return isFinishEffect && subEffect.isFinish();
		}
		
		return true;
	}
	
    public override void resetEffectState(int _state)
	{
        switch((EffectConstant.EffectState)_state)
		{
			case EffectConstant.EffectState.START_STATE:				
				if(isZoomin)
				{
					curScale = minScale;
				}
				else
				{
					curScale = maxScale;
				}
				
				break;				
			case EffectConstant.EffectState.END_STATE:
				if(isZoomin)
				{
					curScale = maxScale;
				}
				else
				{
					curScale = minScale;
				}
				
				break;				
		}
	}	
}
