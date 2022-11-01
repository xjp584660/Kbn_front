using KBN;
using UnityEngine;

public class BaseEffect
{
	protected bool enable;
	protected Matrix4x4 GUIMatrix;
	protected Matrix4x4 standardMatrix;
	
	protected UIObject curObject;
	protected BaseEffect subEffect;
	
    public BaseEffect()
    {
        GUIMatrix = _Global.getGUIMatrix();
        standardMatrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, Vector3.one);
    }

	public void setEnable(bool _enable)
	{
		enable = _enable;
	}

	public virtual void playEffect(){}
	
    public virtual void resetEffectState(int _state){}
	
	public virtual void pauseEffect(){}
	
	public virtual void revertEffect(){}
	
    public virtual void updateEffect(){}
	
    public virtual void drawItems(){}
	
    public virtual bool isFinish(){ return false; }
	
	public UIObject getUIObject()
	{
		if(curObject != null)
		{
			return curObject;
		}
		
		if(subEffect != null)
		{
			return subEffect.getUIObject();
		}
		
		return null;
	}
	
	public void setUIObjectDisable(bool _disabled)
	{
		if(curObject != null)
		{
			curObject.SetDisabled(_disabled);
		}
		
		if(subEffect != null)
		{
			subEffect.setUIObjectDisable(_disabled);
		}
	}
	
}
