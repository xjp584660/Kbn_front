


public class TabContentUIObject : UIObject
{
	[UnityEngine.Space(30), UnityEngine.Header("----------TabContentUIObject----------")]

	public System.Action<string> OnSetTitle;
	public virtual void OnPush(object param)
	{
		
	}
	public virtual void OnPop()
	{
		
	}
	
	public virtual void OnSelect()
	{
		
	}
	
	public virtual void OnInActive()
	{
		
	}

	public virtual bool RefuseTabSwitch()
	{
		return false;
	}

	public virtual void HandleNotification(string action, object data)
	{

	}

	public virtual bool OnBackButton()
	{
		return false;
	}
}
