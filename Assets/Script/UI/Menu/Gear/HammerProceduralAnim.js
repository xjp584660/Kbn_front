#pragma strict

class HammerProceduralAnim extends IAnimation
{
	// anti-clockwise:the fourth quadrant
	public var beginAngle:float = 20.0f;
	public var endAngle:float = 320.0f;
	
	public var phaseCount:int = 3;
	public var accelerateRate:float = 1.4f;
	
	//------------------------------------------------
	private var uiObject:Label = null;
	
	private var rotate:Rotate = null;
	
	private var anglePerPhase:float = 0.0f;
	private var phaseIndex:int = 0;
	private var phaseTargetAngle:float = 0.0f;
	private var phaseAccelerate:float = 1.0f;
	
	private var isForward:boolean = false;
	
	//------------------------------------------------
	public static function StartAnim(obj:UIObject, isLoop:boolean, endDel:System.Action):HammerProceduralAnim
	{
		var anim:HammerProceduralAnim = obj.gameObject.GetComponent(typeof(HammerProceduralAnim)) as HammerProceduralAnim;
		if (null == anim)
		{
			anim = obj.gameObject.AddComponent(typeof(HammerProceduralAnim)) as HammerProceduralAnim;
		}
		
		anim.PlayAnim(isLoop, endDel);
		return anim;
	}
	
	public static function StopAnim(obj:UIObject, destroy:boolean)
	{
		var anim:HammerProceduralAnim = obj.gameObject.GetComponent(typeof(HammerProceduralAnim)) as HammerProceduralAnim;
		if (null == anim)
		{
			return null;
		}
		
		anim.StopAnim(destroy);
	}
	
	//------------------------------------------------
	public function PlayAnim(isLoop:boolean, endDel:System.Action)
	{
		super.PlayAnim(isLoop, endDel);
		
		this.uiObject = gameObject.GetComponent(typeof(Label)) as Label;
		
		this.anglePerPhase = beginAngle - endAngle;
		if (anglePerPhase < 0)
		{
			anglePerPhase += 360;
		}
		anglePerPhase /= phaseCount;
		
		this.phaseIndex = 0;
		this.phaseTargetAngle = beginAngle - anglePerPhase;
		this.phaseAccelerate = 1.0f;
		
		isForward = true;
		
		this.rotate = new Rotate();
		this.rotate.init(uiObject, EffectConstant.RotateType.ROTATE_ANGLE, Rotate.RotateDirection.ANTI_CLOCKWISE, beginAngle, anglePerPhase);
		this.rotate.createPivotPoint(EffectConstant.PivotPosition.BottomCenter);
		this.rotate.playEffect();
		rotate.rotateMultiple = 50;
	}
	
	public function StopAnim(destroy:boolean)
	{
		super.StopAnim(destroy);
	}
	
	public function Update()
	{
		if (super.isFinish) return;
		if (null == uiObject) return;
		if (null == rotate) return;
		
		if (Mathf.Abs(rotate.currentAngle - phaseTargetAngle) <= 1.0f)
		{
			phaseIndex++;
			if (phaseIndex >= phaseCount && !super.isLoop)
			{
				return;
			}
			
			if (phaseIndex >= phaseCount)
			{
				if (isForward)
					BeginBackwardRotate();
				else
					BeginForwardRotate();
				
				phaseIndex = 0;
				isForward = !isForward;
				
				rotate.rotateMultiple = 50;
			}
			else
			{
				rotate.rotateMultiple *= accelerateRate;
				rotate.setBeginAndRotateAngle(rotate.currentAngle, anglePerPhase);
				
				// Calculate current phase target angle
				if (isForward)
				{
					phaseTargetAngle = phaseTargetAngle - anglePerPhase;
				}
				else
				{
					phaseTargetAngle = phaseTargetAngle + anglePerPhase;
				}
			}
		}
		
		rotate.updateEffect();
	}
	
	public function Draw()
	{
		if (null != rotate)
			rotate.drawItems();
	}
	
	private function BeginForwardRotate()
	{
		phaseIndex = 0;
		phaseTargetAngle = beginAngle - anglePerPhase;
		phaseAccelerate = 1.0f;
		
		rotate.setRotateDirection(Rotate.RotateDirection.ANTI_CLOCKWISE);
		rotate.setBeginAndRotateAngle(beginAngle, anglePerPhase);
		rotate.playEffect();
	}
	
	private function BeginBackwardRotate()
	{
		phaseIndex = 0;
		phaseTargetAngle = endAngle + anglePerPhase;
		phaseAccelerate = 1.0f;
		
		rotate.setRotateDirection(Rotate.RotateDirection.CLOCKWISE);
		rotate.setBeginAndRotateAngle(endAngle, anglePerPhase);
		rotate.playEffect();
	}
}