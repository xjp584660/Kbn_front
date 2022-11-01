using UnityEngine;
using KBN;

public class Turnover : BaseEffect
{
	private UIObject frontalPanel;
	private UIObject reversePanel;

    private EffectConstant.PivotPosition pivotType;	
	private Vector2 pivotPoint;
	private Matrix4x4 oldMatrix;
	private Vector2 scale;

	private float curCounter;
	private float oldCounter;
	private bool isVertical;
	
    private TurnoverState curState;
    private TurnoverState oldState;
	
	private float timeCounter = 0.0f;
	private float stepValue = 0;
	private float speed = 30;
	private float half_PI = Mathf.PI * 0.5f;		
	
	//one Turning is PI
	public enum TurnoverState
	{
		STOP = 0,
		TURNING,
		REVERT_TURNING
	};
	
	public Turnover()
	{
		
	}	
	
	// scale (x, 1) horizonal 
	// scale (1, y)	vertical																		
	public void init(UIObject _frontalPanel, UIObject _reversePanel, bool _isVertical)
	{
		frontalPanel = _frontalPanel;
		reversePanel = _reversePanel;
		isVertical 	 = _isVertical;
			
		curObject = frontalPanel;
		
		setPivotPointType(EffectConstant.PivotPosition.MIDDLE_CENTER);		
	}
	
	public override bool isFinish()
	{
		bool isEffectFinish = (curState == TurnoverState.STOP && (oldState == TurnoverState.TURNING || oldState == TurnoverState.REVERT_TURNING));
	
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
	
    public void setPivotPointType(EffectConstant.PivotPosition _pivotType)
	{
		pivotType = _pivotType;
		
		UIObject rectPanel = frontalPanel != null ? frontalPanel : reversePanel;
	
		switch(_pivotType)
		{
			case EffectConstant.PivotPosition.MIDDLE_CENTER:
				pivotPoint = new Vector2(rectPanel.rect.x + rectPanel.rect.width * 0.5f, rectPanel.rect.y + rectPanel.rect.height * 0.5f);
				break;
			case EffectConstant.PivotPosition.LEFT_CENTER:
				pivotPoint = new Vector2(rectPanel.rect.x, rectPanel.rect.y + rectPanel.rect.height * 0.5f); 
				break;				
			case EffectConstant.PivotPosition.RIGHT_CENTER:
				pivotPoint = new Vector2(rectPanel.rect.x + rectPanel.rect.width, rectPanel.rect.y + rectPanel.rect.height * 0.5f);
				break;
		}
	}
	
    public override void resetEffectState(int _state)
	{
        switch((EffectConstant.EffectState)_state)
		{
			case EffectConstant.EffectState.START_STATE:
				
				curObject = frontalPanel;
				
				if(curObject == null)
				{
					curCounter = half_PI - 0.05f;
				}
				else
				{
					curCounter = 0;
				}				
				
				oldState = TurnoverState.REVERT_TURNING;
				break;
				
			case EffectConstant.EffectState.END_STATE:
				curObject = reversePanel;
				
				if(curObject == null)
				{
					curCounter = half_PI + 0.05f;
				}
				else
				{
					curCounter = Mathf.PI;
				}
				
				oldState = TurnoverState.TURNING;			
				break;				
		}
	}

	
	public void setPivotPoint(Vector2 _pivotPoint)
	{
		pivotPoint = _pivotPoint;
	}

	public override void playEffect()
	{		
		if(curState == TurnoverState.STOP 
		&&(oldState == TurnoverState.STOP || oldState == TurnoverState.REVERT_TURNING))
		{
			oldState = curState;
			curState = TurnoverState.TURNING;
			
			curObject = frontalPanel;
			
			if(curObject == null)
			{
				curCounter = half_PI - 0.05f;
			}
			else
			{
				curCounter = 0f;
			}			
		}
	}
	
	public override void revertEffect()
	{
		if(curState == TurnoverState.STOP && oldState == TurnoverState.TURNING)
		{
			oldState = curState;
			curState = TurnoverState.REVERT_TURNING;
			
			curObject = reversePanel;
			
			if(curObject == null)
			{
				curCounter = half_PI + 0.05f;
			}
			else
			{
				curCounter = Mathf.PI;
			}			
		}
	}

	public override void drawItems()
	{
		if(curState != TurnoverState.STOP)
		{		
//			oldMatrix = GUI.matrix;
//			
//			Vector2 newPoint = GUIUtility.GUIToScreenPoint(pivotPoint);
//	
//			Vector2 zeroPoint = GUIUtility.GUIToScreenPoint(Vector2.zero);
//			newPoint -= zeroPoint;
//			zeroPoint = oldMatrix * new Vector4(zeroPoint.x, zeroPoint.y, 0.0, 1.0);
//			newPoint += zeroPoint;
//	
//			Matrix4x4 tempMatrix = Matrix4x4.TRS (newPoint, Quaternion.identity, new Vector3 (scale.x, scale.y, 1f)) 
//									   * Matrix4x4.TRS (-newPoint, Quaternion.identity, Vector3.one);
//			GUI.matrix = tempMatrix * oldMatrix;	

			oldMatrix = GUI.matrix; 
			// _Global.Log("oldMatrix.xScale:" + oldMatrix[0,0].ToString() 
			// 			+ " .yScale:" + oldMatrix[1,1].ToString() + " .zScale:" + oldMatrix[2,2].ToString());
	
			GUI.matrix = standardMatrix;
	
			Vector2 zeroPoint = GUIUtility.GUIToScreenPoint(Vector2.zero);		
			Vector3 newPoint = new Vector3(pivotPoint.x + zeroPoint.x, pivotPoint.y + zeroPoint.y, 0.001f);
	
			Matrix4x4 tempMatrix = 	Matrix4x4.TRS (newPoint, Quaternion.identity, new Vector3(scale.x, scale.y, 1f)) 
										* Matrix4x4.TRS(-newPoint, Quaternion.identity, Vector3.one);
	
			tempMatrix = GUIMatrix * tempMatrix * (GUIMatrix.inverse * oldMatrix);  
			for (int mtIndex = 0; mtIndex < 3; mtIndex++)
			{
				 if (Mathf.Abs(tempMatrix[mtIndex, mtIndex]) <= 0.01f)
				 	tempMatrix[mtIndex, mtIndex] = 0.01f; 
			}
			// _Global.Log("tempMatrix.xScale:" + tempMatrix[0,0].ToString() 
			// 			+ " .yScale:" + tempMatrix[1,1].ToString() + " .zScale:" + tempMatrix[2,2].ToString());
			
			try
			{
				GUI.matrix = tempMatrix;	
			}catch( System.Exception er ){
				_Global.Log("GUI.matrix:" + GUI.matrix);
			}
			
		}
		
		if(curObject != null)
		{
			curObject.Draw();
		}

		
		if(curState != TurnoverState.STOP)
		{
			GUI.matrix = oldMatrix;	
		}
	}
	
	public void setEnable(bool _enable)
	{
		enable = _enable;
	}

	public override void updateEffect()
	{
		if(curState == TurnoverState.STOP)
		{
			return;
		}
						
		timeCounter += Time.deltaTime;				
		stepValue = timeCounter * speed;
		timeCounter = 0;		
		
		//from Pi to zero
		if(curState == TurnoverState.REVERT_TURNING)
		{	
			oldCounter = curCounter;
			curCounter -= stepValue;
			
			if(oldCounter > half_PI && curCounter <= half_PI)
			{	
				curObject = frontalPanel;
				if(curObject == null)
				{
					curCounter = 0;
				}
				else
				{
					curCounter = half_PI;
				}
			}
			
			if(curCounter <= 0)
			{
				curCounter = 0;
				oldState = curState;
				curState = TurnoverState.STOP;
			}				
		}
		//from zero to Pi
		else if(curState == TurnoverState.TURNING)
		{
			oldCounter = curCounter;
			curCounter += stepValue;
			
			if(oldCounter < half_PI && curCounter >= half_PI)
			{
				curObject = reversePanel;
				
				if(curObject == null)
				{
					curCounter = Mathf.PI;
				}
				else
				{
					curCounter = half_PI;
				}				
			}
			
			if(curCounter >= Mathf.PI)
			{
				curCounter = Mathf.PI;
				oldState = curState;
				curState = TurnoverState.STOP;
			}
		}
		
		if(isVertical)
		{
			//vertical
			scale = new Vector2(1f, Mathf.Abs(Mathf.Cos(curCounter)) + 0.01f);
		}
		else
		{
			//horizon
			scale = new Vector2(Mathf.Abs(Mathf.Cos(curCounter)) + 0.01f, 1f);
		}											
	}
}
