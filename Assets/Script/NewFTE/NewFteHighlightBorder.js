#pragma strict

class NewFteHighlightBorder extends UIObject
{
	//-----------------------------------------------------	
	public var border:Label;
	//-----------------------------------------------------	
	
	//-----------------------------------------------------	
	private final var AutoExtendRange:Vector2 = new Vector2(10f, 5f);
	private final var AnimScaleRatio:float = 1.1f;
	
	private final var AnimDirPositive:int = 0;
	private final var AnimDirNegative:int = 1;
	//-----------------------------------------------------	
	
	//-----------------------------------------------------	
	private var isAnimPlaying:boolean = false;
	
	private var speed:float = 0.3f;
	
	private var currAnimScale:float = 1.0f;
	private var basicRectSize:Vector2 = new Vector2(10, 10);
	private var rectCenter:Vector2 = Vector2.zero;
	
	private var animDir:int = -1;
	
	private var displayData:NewFteDisplayData = null;
	//-----------------------------------------------------	
	
	//-----------------------------------------------------	
	public override function Init()
	{
		super.Init();
		
		InitVariables();
	}
	
	private function InitVariables()
	{
		isAnimPlaying = false;
	} 
	
	public override function Draw()
	{
		if (!super.visible)
			return;
			
		// GUI.BeginGroup(super.rect);
		
		border.Draw();
		
		// GUI.EndGroup();
	}
	
	public override function Update()
	{ 
		if (isAnimPlaying)
		{
			if (animDir == AnimDirPositive)
			{
				currAnimScale += Time.deltaTime * speed;
				if (currAnimScale >= AnimScaleRatio)
				{
					currAnimScale = AnimScaleRatio;
					animDir = AnimDirNegative;
				}
			}
			else if (animDir == AnimDirNegative)
			{
				currAnimScale -= Time.deltaTime * speed;
				if (currAnimScale <= 1.0f)
				{
					currAnimScale = 1.0f;
					animDir = AnimDirPositive;
				}
			}
			
			border.rect.width = basicRectSize.x * currAnimScale;
			border.rect.height = basicRectSize.y * currAnimScale;
			
			border.rect.x = rectCenter.x - 0.5f * border.rect.width;
			border.rect.y = rectCenter.y - 0.5f * border.rect.height;
			
		} // End if (null != displayData)
	}
	
	public function set Data(value:Object)
	{
		displayData = value as NewFteDisplayData;
		if (null == displayData.traceObj) return;
		
		var tRelRect:Rect = displayData.traceObj.ScreenRect;
		NewFteDisplayMgr.Instance().AddTracerGetRect(displayData.traceObj, this);
		
		border.rect = tRelRect;
		AutoExtendRect(tRelRect);
		StartScaleAnim();
	}
	
	public function SetTraceObject(uiObj:UIObject)
	{
		if (null == uiObj) return;
		
		var tRelRect:Rect = uiObj.ScreenRect;
		NewFteDisplayMgr.Instance().AddTracerGetRect(uiObj, this);
		
		border.rect = tRelRect;
		AutoExtendRect(tRelRect);
		StartScaleAnim();
	}
	
	private function GetTraceRect(traceRect:Rect)
	{
		rectCenter.x = traceRect.center.x; 
		rectCenter.y = traceRect.center.y; 
		
		basicRectSize.x = traceRect.width + AutoExtendRange.x;
		basicRectSize.y = traceRect.height + AutoExtendRange.y;
	}
	
	private function AutoExtendRect(relRect:Rect)
	{
		border.rect.width = relRect.width + AutoExtendRange.x;
		border.rect.height = relRect.height + AutoExtendRange.y;
		
		border.rect.x = relRect.center.x - 0.5f * border.rect.width;
		border.rect.y = relRect.center.y - 0.5f * border.rect.height;
		
		rectCenter.x = relRect.center.x;
		rectCenter.y = relRect.center.y;
	}
	
	public function StartScaleAnim()
	{
		currAnimScale = 1.0f;
		animDir = AnimDirPositive;
		isAnimPlaying = true;
		
		basicRectSize.x = border.rect.width;
		basicRectSize.y = border.rect.height;
	}
	
	public function StopScaleAnim()
	{
		currAnimScale = 1.0f;
		isAnimPlaying = false;
		
		border.rect.width = basicRectSize.x;
		border.rect.height = basicRectSize.y;
		
		border.rect.x = rectCenter.x - 0.5f * border.rect.width;
		border.rect.y = rectCenter.y - 0.5f * border.rect.height;
	}
} 