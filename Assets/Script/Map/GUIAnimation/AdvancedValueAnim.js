#pragma strict

public class AdvancedValueAnim extends IAnimation
{
	//------------------------------------------------
	private var startVal:float = 0;
	private var endVal:float = 0;
	
	private var currTiming:float = 0;
	
	private var uiObject:UIObject = null;
	
	private var currVal:float = 0;
	private var mulSpeed:float = 4.0f; 
	
	protected var OnUpdateDel:System.Action.<float>;
	
	//------------------------------------------------
	public static function StartAnim(obj:UIObject, startVal:float, endVal:float, updateDel:System.Action.<float>, endDel:System.Action):AdvancedValueAnim
	{
		var anim:AdvancedValueAnim = obj.gameObject.GetComponent(typeof(AdvancedValueAnim)) as AdvancedValueAnim;
		if (null == anim)
		{
			anim = obj.gameObject.AddComponent(typeof(AdvancedValueAnim)) as AdvancedValueAnim;
		}
		
		anim.PlayAnim(startVal, endVal, updateDel, endDel);
		return anim;
	}
	
	public static function StopAnim(obj:UIObject, destroy:boolean)
	{
		var anim:AdvancedValueAnim = obj.gameObject.GetComponent(typeof(AdvancedValueAnim)) as AdvancedValueAnim;
		if (null == anim)
		{
			return null;
		}
		
		anim.StopAnim(destroy);
	}
	
	//-----------------------------------------------------------------------------
	public function PlayAnim(startVal:float, endVal:float, updateDel:System.Action.<float>, endDel:System.Action)
	{
		super.PlayAnim(false, endDel);
		
		this.startVal = startVal;
		this.endVal = endVal;
		
		this.currTiming = 0;
		this.isFinish = false;
		this.uiObject = gameObject.GetComponent(typeof(UIObject)) as UIObject; 
		
		currVal = startVal; 
		this.OnUpdateDel = updateDel;
	}
	
	public override function StopAnim(destroy:boolean)
	{
		super.StopAnim(destroy);
	}
	
	public override function Update()
	{
		if (super.isFinish) return;
		if (null == uiObject) return;
		
		currVal = Mathf.Lerp(currVal, endVal, mulSpeed * Time.deltaTime);
		if (Mathf.Abs(currVal - endVal) < 0.001f) 
		{
			StopAnim(true);
		}
		else
		{ 
			super.Update(); 
			if (null != this.OnUpdateDel) this.OnUpdateDel(currVal);
		}
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