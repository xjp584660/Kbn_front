#pragma strict

public class AlphaFlareAnim extends IAnimation
{
	//------------------------------------------------
	private var stayTime:float = 0;
	private var currTiming:float = 0;
	
	private var uiObject:UIObject = null;
	
	private var mulSpeed:float = 1.0f;
	private var upperLimit:float = 1;
	
	//------------------------------------------------
	public static function StartAnim(obj:UIObject, stayTime:float, endDel:System.Action):AlphaFlareAnim
	{
		var anim:AlphaFlareAnim = obj.gameObject.GetComponent(typeof(AlphaFlareAnim)) as AlphaFlareAnim;
		if (null == anim)
		{
			anim = obj.gameObject.AddComponent(typeof(AlphaFlareAnim)) as AlphaFlareAnim;
		}
		
		anim.PlayAnim(stayTime, endDel);
		return anim;
	}
	
	public static function StopAnim(obj:UIObject, destroy:boolean)
	{
		var anim:AlphaFlareAnim = obj.gameObject.GetComponent(typeof(AlphaFlareAnim)) as AlphaFlareAnim;
		if (null == anim)
		{
			return null;
		}
		
		anim.StopAnim(destroy);
	}
	
	//-----------------------------------------------------------------------------
	public function PlayAnim(stayTime:float, endDel:System.Action)
	{
		if (stayTime >= 0)
			super.PlayAnim(false, endDel);
		else
			super.PlayAnim(true, endDel);
		
		this.stayTime = stayTime;
		this.currTiming = 0;
		this.isFinish = false;
		
		this.uiObject = gameObject.GetComponent(typeof(UIObject)) as UIObject;
		this.uiObject.alphaEnable = true;
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
		
		// PingPongs the value t, so that it is never larger than length and never smaller than 0.
		this.uiObject.alpha = Mathf.PingPong(mulSpeed * Time.time, upperLimit);
		
		currTiming += Time.deltaTime;
		if (!super.isLoop && currTiming >= stayTime)
		{
			currTiming = 0;
			StopAnim(true);
		}
	}
	
	public function set UpperLimit(value:float)
	{
		upperLimit = value;
	}
	
	public function set MulSpeed(value:float)
	{
		mulSpeed = value;
	} 
	
	public function get MulSpeed():float
	{
		return mulSpeed;
	} 
}