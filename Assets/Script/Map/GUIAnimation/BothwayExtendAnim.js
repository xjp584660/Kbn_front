#pragma strict

public class BothwayExtendAnim extends IAnimation
{
	enum ExtendStyle
	{
		UpDown,
		LeftRight,
		FourWay,
	}
	
	//------------------------------------------------
	private var style:ExtendStyle = ExtendStyle.UpDown;
	private var duration:float = 0;
	private var uiObject:UIObject = null;
	
	//------------------------------------------------
	private var moveSpeed:Vector2 = Vector2.zero;
	private var origRect:Rect;
	private var centerPos:Vector2 = Vector2.zero;
	
	//------------------------------------------------
	public static function StartAnim(obj:UIObject, style:ExtendStyle, duration:float, endDel:Action):BothwayExtendAnim
	{
		var anim:BothwayExtendAnim = obj.gameObject.GetComponent(typeof(BothwayExtendAnim)) as BothwayExtendAnim;
		if (null == anim)
		{
			anim = obj.gameObject.AddComponent(typeof(BothwayExtendAnim)) as BothwayExtendAnim;
		}
		
		anim.PlayAnim(style, duration, endDel);
		return anim;
	}
	
	public static function StopAnim(obj:UIObject, destroy:boolean)
	{
		var anim:BothwayExtendAnim = obj.gameObject.GetComponent(typeof(BothwayExtendAnim)) as BothwayExtendAnim;
		if (null == anim)
		{
			return null;
		}
		
		anim.StopAnim(destroy);
	}
	
	//-----------------------------------------------------------------------------
	public function PlayAnim(style:ExtendStyle, duration:float, endDel:Action)
	{
		super.PlayAnim(false, endDel);
		
		this.style = style;
		this.duration = duration;
		this.uiObject = gameObject.GetComponent(typeof(UIObject)) as UIObject;
		
		this.origRect = new Rect(uiObject.rect);
		this.centerPos = origRect.center;
		this.moveSpeed.x = origRect.width / duration;
		this.moveSpeed.y = origRect.height / duration;
		
		this.uiObject.rect.width = 0;
		this.uiObject.rect.height = 0;
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
		
		switch (this.style)
		{
			case ExtendStyle.UpDown:
				uiObject.rect.width = origRect.width;
				uiObject.rect.height += Time.deltaTime * moveSpeed.y;
			break;
			case ExtendStyle.LeftRight:
				uiObject.rect.width += Time.deltaTime * moveSpeed.x;
				uiObject.rect.height = origRect.height;
			break;
			case ExtendStyle.FourWay:
				uiObject.rect.width += Time.deltaTime * moveSpeed.x;
				uiObject.rect.height += Time.deltaTime * moveSpeed.y;
			break;
		}
		
		if (uiObject.rect.width >= origRect.width 
			&& uiObject.rect.height >= origRect.height)
		{
			uiObject.rect = origRect;
			super.OnFinish();
			return;
		}
		
		uiObject.rect.x = centerPos.x - 0.5f * uiObject.rect.width;
		uiObject.rect.y = centerPos.y - 0.5f * uiObject.rect.height;
	}
}