using UnityEngine;

public class Move : BaseEffect
{
    private MoveState curState;
    private MoveState oldState;
	
	private Vector2 startPos;
	private Vector2 endPos;
	private Vector2 curPos;
	private Vector2 desPos;
	
	private Matrix4x4 oldMatrix;
	
	public enum MoveState
	{
		STOP = 0,
		MOVING,
		REVERT_MOVING,
		PAUSE
	};
	
	public Move()
	{

	}
	
	public void init(UIObject _obj, Vector2 _startPos, Vector2 _endPos)
	{
		curObject  = _obj;	
		startPos   = _startPos;
		endPos     = _endPos;
		subEffect  = null;
		
		curState = MoveState.STOP;		
		oldState = MoveState.STOP;		
		
        resetEffectState((int)EffectConstant.EffectState.START_STATE);		
	}
	
	public void init(BaseEffect _effect, Vector2 _startPos, Vector2 _endPos)
	{
		subEffect  = _effect;	
		startPos   = _startPos;
		endPos     = _endPos;
		curObject  = null;
		
		curState = MoveState.STOP;		
		oldState = MoveState.STOP;			
		
        resetEffectState((int)EffectConstant.EffectState.START_STATE);	
	}
	
    public override void resetEffectState(int _state)
	{
        switch((EffectConstant.EffectState)_state)
		{
			case EffectConstant.EffectState.START_STATE:
				curPos = startPos;
				desPos = endPos;
				break;
				
			case EffectConstant.EffectState.END_STATE:
				curPos = endPos;
				desPos = startPos;
				break;				
		}
	}
	
	public override void playEffect()
	{
		if(curState == MoveState.STOP)
		{
			oldState = curState;
			curState = MoveState.MOVING;
			
			curPos = startPos;
			desPos = endPos;
		}
		else if(curState == MoveState.PAUSE)
		{
			curState = oldState;
			oldState = MoveState.PAUSE;		
		}
		else if(curState == MoveState.REVERT_MOVING)
		{
			oldState = curState;
			curState = MoveState.MOVING;	
		}
		
		if(subEffect != null)
		{
			subEffect.playEffect();
		}
	}
	
	public override void updateEffect()
	{
		if(subEffect != null)
		{
			subEffect.updateEffect();
		}
	
		if(curState == MoveState.STOP || curState == MoveState.PAUSE)
		{
			return;
		}
	
		float timeGap = Time.deltaTime;
		curPos = Vector2.Lerp(curPos, desPos, timeGap);
				
		if(Vector2.Distance(curPos, desPos) < 2)
		{
			curPos = desPos;
		
			oldState = curState;
			curState = MoveState.STOP;
		}
	}
	
	public override void drawItems()
	{		
		oldMatrix = GUI.matrix;
		
		Matrix4x4 tempMatrix = 	Matrix4x4.TRS (new Vector3(curPos.x, curPos.y, 0), Quaternion.identity, Vector3.one); 
		
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
		if(curState == MoveState.STOP)
		{
			oldState = curState;
			curState = MoveState.REVERT_MOVING;
			
			curPos = endPos;
			desPos = startPos;
		}
		else if(curState == MoveState.MOVING)
		{
			oldState = curState;
			curState = MoveState.REVERT_MOVING;		
		}
		
		if(subEffect != null)
		{
			subEffect.revertEffect();
		}		
	}
	
	public override void pauseEffect()
	{
		if(curState == MoveState.MOVING || curState == MoveState.REVERT_MOVING)
		{
			oldState = curState;
			curState = MoveState.PAUSE;
		}
		
		if(subEffect != null)
		{
			subEffect.pauseEffect();
		}		
	}
	
	public override bool isFinish()
	{
		bool isFinishEffect = (curState == MoveState.STOP) && (oldState != MoveState.PAUSE);;
		
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
}
