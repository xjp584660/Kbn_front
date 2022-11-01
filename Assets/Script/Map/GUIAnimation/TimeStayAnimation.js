#pragma strict

public class TimeStayAnimation extends IAnimation
{
	//------------------------------------------------
	private var stayTime:float = 0;
	private var currTiming:float = 0;
	
	private var uiObject:UIObject = null;
	
	//------------------------------------------------
	public static function StartAnim(obj:UIObject, stayTime:float, endDel:System.Action):TimeStayAnimation
	{
		var anim:TimeStayAnimation = obj.gameObject.GetComponent(typeof(TimeStayAnimation)) as TimeStayAnimation;
		if (null == anim)
		{
			anim = obj.gameObject.AddComponent(typeof(TimeStayAnimation)) as TimeStayAnimation;
		}
		
		anim.PlayAnim(stayTime, endDel);
		return anim;
	}
	
	public static function StopAnim(obj:UIObject, destroy:boolean)
	{
		var anim:TimeStayAnimation = obj.gameObject.GetComponent(typeof(TimeStayAnimation)) as TimeStayAnimation;
		if (null == anim)
		{
			return null;
		}
		
		anim.StopAnim(destroy);
	}
	
	//-----------------------------------------------------------------------------
	public function PlayAnim(stayTime:float, endDel:System.Action)
	{
		super.PlayAnim(false, endDel);
		
		this.stayTime = stayTime;
		this.currTiming = 0;
		this.isFinish = false;
		this.uiObject = gameObject.GetComponent(typeof(UIObject)) as UIObject;
	}
	
	public override function StopAnim(destroy:boolean)
	{
		super.StopAnim(destroy);
	}
	
	public override function Update()
	{
		if (super.isFinish) return;
		if (null == uiObject) return;
		
		super.Update();
		
		currTiming += Time.deltaTime;
		if (currTiming >= stayTime)
		{
			currTiming = 0;
			StopAnim(true);
		}
	}
}