#pragma strict

class NewFteGuideArrow extends UIObject
{
	//----------------------------------------------------
	public var arrow:Label;
	//----------------------------------------------------
	
	//-----------------------------------------------------	
	private final var RockVerticalDis:float = 10.0f;
	private final var RockHorizontalDis:float = 10.0f;
	
	private final var AnimDirPositive:int = 0;
	private final var AnimDirNegative:int = 1;
	//-----------------------------------------------------	
	
	//-----------------------------------------------------	
	private var isAnimPlaying:boolean = false;
	
	private var rockSpeed:float = 15.0f; // per seconds
	
	private var startPos:float = 8.0f; // 
	private var endPos:float = 8.0f; //  
	private var currPos:float = 8.0f; // 
	
	private var animDir:int = -1; // 0 = left2right or top2bottom, 1 = right2left or bottom2top
	
	private var displayData:NewFteDisplayData = null;
	//-----------------------------------------------------	
	private var lastTracePos:Vector2 = Vector2.zero;
	
	//-----------------------------------------------------	
	public override function Init()
	{
		super.Init();
		InitVariables();
	}
	
	private function InitVariables()
	{
		isAnimPlaying = false;
		
		startPos = 0;
		endPos = 0;
		currPos = 0;
		
		animDir = -1;
		
		displayData = null;
		
		lastTracePos = Vector2.zero;
	} 
	
	public override function Draw()
	{
		if (!super.visible)
			return;
			
		// GUI.BeginGroup(super.rect);
		
		arrow.Draw();
		
		// GUI.EndGroup();
	}
	
	public override function Update()
	{
		if (isAnimPlaying && null != displayData)
		{
			switch(displayData.arrowLayout)
			{
				case NewFteConstants.GUILayout.ArrowUpwards:
				case NewFteConstants.GUILayout.ArrowDownwards:
					arrow.rect.y = CalcCurrRockVal();
					break;
				case NewFteConstants.GUILayout.ArrowLeftwards:
				case NewFteConstants.GUILayout.ArrowRightwards:
					arrow.rect.x = CalcCurrRockVal();
					break;
			}
		} // End if (null != displayData)
	}
	
	public function set Data(value:Object)
	{
		displayData = value as NewFteDisplayData;
		if (null == displayData.traceObj) return;
		
		// Trace this uiobject's rect
		var tScreenRect:Rect = displayData.traceObj.ScreenRect;
		NewFteDisplayMgr.Instance().AddTracerGetRect(displayData.traceObj, this);
		
		var tex2D:Texture2D = GetTextureByLayout(displayData.arrowLayout);
		arrow.rect = CalcRectByLayout(displayData.arrowLayout, tex2D, tScreenRect);
		StartDisplacementAnim();
		
		GearSysHelpUtils.SetLabelTexture(arrow, tex2D);
	}
	
	private function GetTraceRect(traceRect:Rect)
	{
		if (null == displayData) return;
		
		var newTracePos:Vector2 = new Vector2(traceRect.x, traceRect.y);
		if ( !newTracePos.Equals(lastTracePos) )
		{
			arrow.rect = CalcRectByLayout(displayData.arrowLayout, new Vector2(arrow.rect.width, arrow.rect.height), traceRect);
			StartDisplacementAnim();
			
			lastTracePos = new Vector2(traceRect.x, traceRect.y);
		}
	}
	
	private function CalcCurrRockVal():float
	{
		if (animDir == AnimDirPositive)
		{ 
			currPos += Time.deltaTime * rockSpeed;
			if (currPos >= endPos)
			{
				currPos = endPos;
				animDir = AnimDirNegative;	
			}
		}
		else if (animDir == AnimDirNegative)
		{
			currPos -= Time.deltaTime * rockSpeed;	
			if (currPos <= startPos)
			{
				currPos = startPos;
				animDir = AnimDirPositive;	
			}
		}
		
		return currPos;
	}
	
	private function StartDisplacementAnim()
	{
		if (null == displayData) return;
		
		isAnimPlaying = true;
		switch(displayData.arrowLayout)
		{
			case NewFteConstants.GUILayout.ArrowUpwards:
				startPos = arrow.rect.y;
				endPos = arrow.rect.y + RockVerticalDis;
				animDir = AnimDirPositive;
				break;
			case NewFteConstants.GUILayout.ArrowDownwards:
				startPos = arrow.rect.y - RockVerticalDis;
				endPos = arrow.rect.y;
				animDir = AnimDirPositive;
				break;
			case NewFteConstants.GUILayout.ArrowLeftwards:
				startPos = arrow.rect.x;
				endPos = arrow.rect.x + RockHorizontalDis;
				animDir = AnimDirPositive;
				break;
			case NewFteConstants.GUILayout.ArrowRightwards:
				startPos = arrow.rect.x - RockHorizontalDis;
				endPos = arrow.rect.x;
				animDir = AnimDirPositive;
				break;
		} 
		
		currPos = startPos;
	}
	
	private function StopDisplacementAnim()
	{
		isAnimPlaying = false;
		
		if (null != displayData)
		{
			switch(displayData.arrowLayout)
			{
				case NewFteConstants.GUILayout.ArrowUpwards:
				case NewFteConstants.GUILayout.ArrowDownwards:
					arrow.rect.y = startPos;
					break;
				case NewFteConstants.GUILayout.ArrowLeftwards:
				case NewFteConstants.GUILayout.ArrowRightwards:
					arrow.rect.x = startPos;
					break;
			}
		} // End if (null != displayData)
	}
	
	private function GetTextureByLayout(layout:String):Texture2D
	{
		var tex2D:Texture2D = null;
		switch(layout)
		{
			case NewFteConstants.GUILayout.ArrowUpwards:
				tex2D = TextureMgr.instance().LoadTexture("pointing_up", TextureType.FTE);
				break;
			case NewFteConstants.GUILayout.ArrowDownwards:
				tex2D = TextureMgr.instance().LoadTexture("pointing_down", TextureType.FTE);
				break;
			case NewFteConstants.GUILayout.ArrowLeftwards:
				tex2D = TextureMgr.instance().LoadTexture("pointing_left", TextureType.FTE);
				break;
			case NewFteConstants.GUILayout.ArrowRightwards:
				tex2D = TextureMgr.instance().LoadTexture("pointing_right", TextureType.FTE);
				break;
		}
		
		return tex2D;
	}
	
	public static function CalcRectByLayout(layout:String, tex2D:Texture2D, tScreenRect:Rect):Rect
	{
		return CalcRectByLayout(layout, new Vector2(tex2D.width, tex2D.height), tScreenRect);
	}
	
	public static function CalcRectByLayout(layout:String, wh:Vector2, tScreenRect:Rect):Rect
	{
		var resultRect:Rect = new Rect(0, 0, 1, 1);
		
		resultRect.width = wh.x;
		resultRect.height = wh.y;
		
		switch(layout)
		{
			case NewFteConstants.GUILayout.ArrowUpwards:
				// CenterPoint - xxx
				resultRect.x = tScreenRect.xMin + 0.5f * tScreenRect.width - 0.5f * resultRect.width;
				resultRect.y = tScreenRect.yMax;
				break;
			case NewFteConstants.GUILayout.ArrowDownwards:
				resultRect.x = tScreenRect.xMin + 0.5f * tScreenRect.width - 0.5f * resultRect.width;
				resultRect.y = tScreenRect.yMin - resultRect.height;
				break;
			case NewFteConstants.GUILayout.ArrowLeftwards:
				resultRect.x = tScreenRect.xMax;
				resultRect.y = tScreenRect.yMin + 0.5f * tScreenRect.height - 0.5f * resultRect.height;
				break;
			case NewFteConstants.GUILayout.ArrowRightwards:
				resultRect.x = tScreenRect.xMin - resultRect.width;
				resultRect.y = tScreenRect.yMin + 0.5f * tScreenRect.height - 0.5f * resultRect.height;
				break;
		}
		
		return resultRect;
	}
}