#pragma strict

public class PositionAnimation extends IAnimation
{
	//------------------------------------------------
	private var startPos:Vector2 = Vector2.zero;
	private var endPos:Vector2 = Vector2.zero;
	
	private var currPos:Vector2 = Vector2.zero;
	private var moveSpeed:float = 200.0f;
	
	private var uiObject:UIObject = null;
	
	//------------------------------------------------
	private var isCenter:boolean = true;
	private var realSpeed:Vector2;
	
	//------------------------------------------------
	public static function StartAnim(obj:UIObject, startPos:Vector2, endPos:Vector2, endDel:System.Action):PositionAnimation
	{
		var anim:PositionAnimation = obj.gameObject.GetComponent(typeof(PositionAnimation)) as PositionAnimation;
		if (null == anim)
		{
			anim = obj.gameObject.AddComponent(typeof(PositionAnimation)) as PositionAnimation;
		}
		
		anim.PlayAnim(startPos, endPos, endDel);
		return anim;
	}
	
	public static function StopAnim(obj:UIObject, destroy:boolean)
	{
		var anim:PositionAnimation = obj.gameObject.GetComponent(typeof(PositionAnimation)) as PositionAnimation;
		if (null == anim)
		{
			return null;
		}
		
		anim.StopAnim(destroy);
	}
	
	//-----------------------------------------------------------------------------
	public function PlayAnim(startPos:Vector2, endPos:Vector2, endDel:System.Action)
	{
		super.PlayAnim(true, endDel);
		
		this.startPos = startPos;
		this.endPos = endPos;
		
		this.uiObject = gameObject.GetComponent(typeof(UIObject)) as UIObject;
		
		this.currPos = startPos;
		CalcRealSpeed();
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
		
		var isOnceEnd:boolean = false;
		if ( (realSpeed.x > 0 && currPos.x >= endPos.x)
			|| (realSpeed.x < 0 && currPos.x <= endPos.x)
			)
		{
			currPos.x = endPos.x;
			currPos.y = endPos.y;
			
			isOnceEnd = true;
		}
		else
		{
			currPos.x += realSpeed.x * Time.deltaTime;
			currPos.y += realSpeed.y * Time.deltaTime;
		}
		
		this.uiObject.rect.x = currPos.x;
		this.uiObject.rect.y = currPos.y;
		if (isCenter)
		{
			this.uiObject.rect.x -= 0.5f * uiObject.rect.width;
			this.uiObject.rect.y -= 0.5f * uiObject.rect.height;
		}
		
		if (isOnceEnd)
		{
			if (super.isLoop)
			{
				currPos = startPos;
			}
			else
			{
				StopAnim(true);
			}
		}
	}
	
	private function CalcRealSpeed()
	{
		var xTime:float = Mathf.Abs(endPos.x - startPos.x) / moveSpeed;
		var yTime:float = Mathf.Abs(endPos.y - startPos.y) / moveSpeed;
		
		var longerTime:float = xTime >= yTime ? xTime: yTime;
		realSpeed.x = (endPos.x - startPos.x) / longerTime;
		realSpeed.y = (endPos.y - startPos.y) / longerTime;
	}
	
	public function set MoveSpeed(value:float)
	{
		moveSpeed = value;
		if (null != uiObject)
		{
			CalcRealSpeed();
		}
	}
	
	public function get MoveSpeed():float
	{
		return moveSpeed;
	}
}