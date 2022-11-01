using UnityEngine;

public class Rotate : BaseEffect
{
    private EffectConstant.RotateType rotateType;
    private RotateDirection rotateDir;
	
	private float curAngle;
	private float beginAngle;
	private float endAngle;
	private float rotateAngle;	
	
    private RotateState curState;
    private RotateState oldState;
	
	private Matrix4x4 oldMatrix;
	private Vector2 pivotPoint;
	
	private int curDir = 1;	
	private float gap = 0.1f;
	private float moveCounter = 0;
	private float stepValue = 0;
	private int multiple = 100;
	private int speed1 = 3;	
	
	public enum RotateState
	{
		STOP = 0,
		ROTATING,
		REVERT_ROTATING,
		PAUSE
	};
	
	public enum RotateDirection
	{
		CLOCKWISE = 0,
		ANTI_CLOCKWISE
	};
	
	public Rotate()
	{
		
	}
	
	public override bool isFinish()
	{		
		bool isFinishEffect = ((curState == RotateState.STOP) && (oldState == RotateState.ROTATING || oldState == RotateState.REVERT_ROTATING));
		
		if(curObject != null)
		{
			return isFinishEffect;
		}
		
		if(subEffect != null)
		{
			return isFinishEffect && subEffect.isFinish();
		}
		
		return true;		
	}
	
    public void init(BaseEffect _effect, EffectConstant.RotateType _rotateType, RotateDirection _rotateDir, float _beginAngle, float _rotateAngle)
	{
		subEffect  = _effect;	
		rotateType = _rotateType;
		rotateDir  = _rotateDir;		
		curObject  = null;					
									
		curState = RotateState.STOP;		
		oldState = RotateState.STOP;
		
		setBeginAndRotateAngle(_beginAngle, _rotateAngle);
		
        resetEffectState((int)EffectConstant.EffectState.START_STATE);	
		
		createPivotPoint(EffectConstant.PivotPosition.MIDDLE_CENTER);
	}
				
    public void init(UIObject _obj, EffectConstant.RotateType _rotateType, RotateDirection _rotateDir, float _beginAngle, float _rotateAngle)
	{	
		curObject  = _obj;	
		rotateType = _rotateType;
		rotateDir  = _rotateDir;	
		subEffect  = null;		
			
		curState = RotateState.STOP;		
		oldState = RotateState.STOP;

		setBeginAndRotateAngle(_beginAngle, _rotateAngle);
		
        resetEffectState((int)EffectConstant.EffectState.START_STATE);	
		
		createPivotPoint(EffectConstant.PivotPosition.MIDDLE_CENTER);														
	}
	
	public void setBeginAndRotateAngle(float _beginAngle, float _rotateAngle)
	{
		beginAngle = _beginAngle;
		rotateAngle = _rotateAngle;
		
		if(rotateDir == RotateDirection.CLOCKWISE)
		{
			endAngle = beginAngle + rotateAngle;	
		}
		else
		{
			endAngle = beginAngle - rotateAngle;
		}
	}
	
    public override void resetEffectState(int _state)
	{
        switch((EffectConstant.EffectState)_state)
		{
			case EffectConstant.EffectState.START_STATE:
				switch(rotateType)
				{
					case EffectConstant.RotateType.LOOP:
						break;
					case EffectConstant.RotateType.ROTATE_INSTANT:	
						curAngle = endAngle;
						break;
					case EffectConstant.RotateType.ROTATE_ANGLE:	
						curAngle = beginAngle;
						
						if(rotateDir == RotateDirection.CLOCKWISE)
						{
							curDir = 1;
						}
						else
						{
							curDir = -1;
						}							
						break;				
				}
				break;				
			case EffectConstant.EffectState.END_STATE:				
				switch(rotateType)
				{
					case EffectConstant.RotateType.LOOP:
						break;
					case EffectConstant.RotateType.ROTATE_INSTANT:
						curAngle = beginAngle;
						break;
					case EffectConstant.RotateType.ROTATE_ANGLE:	
						curAngle = endAngle;
						
						if(rotateDir == RotateDirection.CLOCKWISE)
						{
							curDir = -1;
						}
						else
						{
							curDir = 1;
						}							
						break;				
				}
				break;				
		}
	}

	public void setRotateDirection(RotateDirection _rotateDir)
	{
		rotateDir = _rotateDir;
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
			case EffectConstant.PivotPosition.BottomLeft:
				pivotPoint = new Vector2(obj.rect.x,
										 obj.rect.y + obj.rect.height);
				break;	
			case EffectConstant.PivotPosition.BottomRight:
				pivotPoint = new Vector2(obj.rect.x + obj.rect.width,
										 obj.rect.y + obj.rect.height);
				break;
			case EffectConstant.PivotPosition.BottomCenter:
				pivotPoint = new Vector2(obj.rect.x + obj.rect.width * 0.5f,
										 obj.rect.y + obj.rect.height);
				break;				
		}
	}
	
	public override void pauseEffect()
	{
		if(curState == RotateState.ROTATING || curState == RotateState.REVERT_ROTATING)
		{
			oldState = curState;
			curState = RotateState.PAUSE;
		}
		
		if(subEffect != null)
		{
			subEffect.pauseEffect();
		}
	}
	
	public override void playEffect()
	{
		switch(rotateType)
		{
			//No revert_rotating state, 
			//Do not handle the rotating state
			case EffectConstant.RotateType.LOOP: 				
				if(curState == RotateState.PAUSE)
				{
					curState = oldState;
					oldState = RotateState.PAUSE;
				}
				else if(curState == RotateState.STOP)
				{
					curAngle = beginAngle;					
					oldState = curState;
					curState = RotateState.ROTATING;
					
					if(rotateDir == RotateDirection.CLOCKWISE)
					{
						curDir = 1;
					}
					else
					{
						curDir = -1;
					}									
				}	
				break;
			//just have stop_state
			case EffectConstant.RotateType.ROTATE_INSTANT:
				curAngle = endAngle;
				curState = RotateState.STOP;
				oldState = RotateState.ROTATING;
				break;
			//do not handle the rotating state
			case EffectConstant.RotateType.ROTATE_ANGLE:
				
				if(curState == RotateState.STOP)
				{
					oldState = curState;
					curState = RotateState.ROTATING;					
					curAngle = beginAngle;
					
					if(rotateDir == RotateDirection.CLOCKWISE)
					{
						curDir = 1;
					}
					else
					{
						curDir = -1;
					}							
				}
				else if(curState == RotateState.PAUSE)				
				{
					curState = oldState;
					oldState = RotateState.PAUSE;
				}
				else if(curState == RotateState.REVERT_ROTATING)
				{
					oldState = curState;
					curState = RotateState.ROTATING;
					
					if(rotateDir == RotateDirection.CLOCKWISE)
					{
						curDir = 1;
					}
					else
					{
						curDir = -1;
					}						
				}
				break;
		}
		
		if(subEffect != null)
		{
			subEffect.playEffect();
		}		
	}
	
	public override void updateEffect()
	{
		if(curState != RotateState.STOP || curState != RotateState.PAUSE)
		{
			moveCounter += Time.deltaTime;
			if(moveCounter > gap)
			{	
				stepValue = moveCounter * multiple;
				stepValue *= speed1;
				curAngle += stepValue * curDir;
				
				moveCounter = 0;
				
				switch(rotateType)
				{
					case EffectConstant.RotateType.LOOP:
						if(curAngle >= 360)
						{
							curAngle -= 360;
						}
						
						if(curAngle <= -360)
						{
							curAngle += 360;
						}
						
						break;
					case EffectConstant.RotateType.ROTATE_ANGLE:
						if(rotateDir == RotateDirection.CLOCKWISE)
						{
							if(curAngle < beginAngle || curAngle > endAngle)
							{
								curState = RotateState.STOP;
								oldState = RotateState.ROTATING;
								if(curAngle < beginAngle)
								{
									curAngle = beginAngle;
								}
								else
								{
									curAngle = endAngle;
								}
							}
						}
						else
						{
							if(curAngle > beginAngle || curAngle < endAngle)
							{
								curState = RotateState.STOP;
								oldState = RotateState.ROTATING;
								if(curAngle > beginAngle)
								{
									curAngle = beginAngle;
								}
								else
								{
									curAngle = endAngle;
								}
							}
						}
						break;
					case EffectConstant.RotateType.ROTATE_INSTANT:
						break;
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
	
		Matrix4x4 tempMatrix = 	Matrix4x4.TRS (newPoint, Quaternion.Euler (0f, 0f, curAngle), Vector3.one) 
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
	
	public override void revertEffect()
	{
		switch(rotateType)
		{
			case EffectConstant.RotateType.LOOP:
				break;
			case EffectConstant.RotateType.ROTATE_INSTANT:				
				curState = RotateState.STOP;
				oldState = RotateState.ROTATING;
				curAngle = beginAngle;
				break;
			case EffectConstant.RotateType.ROTATE_ANGLE:				
				if(curState == RotateState.STOP
				|| oldState == RotateState.ROTATING)
				{
					oldState = curState;
					curState = RotateState.REVERT_ROTATING;
					if(rotateDir == RotateDirection.CLOCKWISE)
					{
						curDir = -1;
					}
					else
					{
						curDir = 1;
					}					
					
				}
				else if(curState == RotateState.ROTATING)
				{
					oldState = curState;
					curState = RotateState.REVERT_ROTATING;					
					if(rotateDir == RotateDirection.CLOCKWISE)
					{
						curDir = -1;
					}
					else
					{
						curDir = 1;
					}				
				}
				else if(curState == RotateState.PAUSE)
				{
					curState = oldState;
					oldState = RotateState.PAUSE;
				}
				break;
		}
		
		if(subEffect != null)
		{
			subEffect.revertEffect();
		}						
	}

    public float currentAngle
    {
        get
        {
            return curAngle;
        }
    }

    public int rotateMultiple
    {
        get
        {
            return multiple;
        }
        set
        {
            multiple = value;
        }
    }
}
