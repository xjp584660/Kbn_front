import System.Collections.Generic;

class FlashAnimation
{ 
	public static function SetUIObjectColor(obj:SimpleUIObj, color:Color) 
	{
		var isSame:boolean = Color.Equals(obj.mystyle.normal.textColor, color);
		if (!isSame)
		{
			obj.mystyle.normal.textColor = color;
		}
	}
	
	public static function InterpolationColor(col1:Color, col2:Color, factor:float):Color
	{ 
		// Simple linear interpolation 
		factor = Mathf.Clamp01(factor);
		var result:Color = col1 * (1.0f - factor) + col2 * factor; 
		return result;
	}
	
	class FlashData
	{ 
		public var obj:SimpleUIObj;
		public var col1:Color; 
		public var col2:Color;
		public var frameCnt:int = 24; // per second 
		public var circleCnt:int = -1; 
		 
		//private var usingInterpolation:boolean = false; 
		
		private var currFrameIndex:int = 0;
		private var tmpTiming:float = 0.0f;
		private var timePerFrame:float = 0.0f; 
		private var currCircleIndex:int = 0;
		
		public function Reset()
		{ 
			currFrameIndex = 0;
			tmpTiming = 0.0f;
			timePerFrame = 1.0f / frameCnt; 
			
			currCircleIndex = 0;
		}
		
		public function get IsLoop() { return circleCnt == -1; } 
		public function get IsFinish()
		{
			if (IsLoop) return false;
			
			return (currCircleIndex >= circleCnt && currFrameIndex >= frameCnt);
		}  
		
		public function Stop()
		{
			Reset(); 
			FlashAnimation.SetUIObjectColor(obj, col1);
		}
		
		public function Update()
		{ 
			if (!IsLoop && IsFinish)
			{ 
				// Can send a finish function to notify caller 
				FlashAnimation.SetUIObjectColor(obj, col1); // Using col1 to revalue the color 
				return;
			}
			
			var colIndex:int = currFrameIndex % 2; 
			if (colIndex == 0)
				FlashAnimation.SetUIObjectColor(obj, FlashAnimation.InterpolationColor(col1, col2, tmpTiming / timePerFrame));
			else
				FlashAnimation.SetUIObjectColor(obj, FlashAnimation.InterpolationColor(col2, col1, tmpTiming / timePerFrame));
			
			tmpTiming += Time.deltaTime;  
			if (tmpTiming >= timePerFrame)
			{ 
				if (currFrameIndex == frameCnt - 1)
				{ 
					currFrameIndex = 0;
					currCircleIndex++;
				} 
				else
					currFrameIndex++;
				tmpTiming = 0.0f; 
			}
		}
	}
	
	protected var flashList:List.<FlashData> = new List.<FlashData>();
	protected var freeList:List.<FlashData> = new List.<FlashData>();
	public function FlashAnimation()
	{
		flashList.Clear(); 
		freeList.Clear();
	}
	
	public function StartFlash(obj:SimpleUIObj, col1:Color, col2:Color, frameCnt:int, circleCnt:int)
	{
		var tmpData:FlashData = GetFromFlashList(obj);
		
		if (null == tmpData)
		{
			tmpData = GetFromFreeList(obj); 
			if (null != tmpData) freeList.Remove(tmpData);
		}
		
		if (null == tmpData)
		{
			tmpData = new FlashData(); 
			flashList.Add(tmpData);
		}
		
		tmpData.obj = obj; 
		tmpData.col1 = col1;
		tmpData.col2 = col2; 
		tmpData.frameCnt = frameCnt;
		tmpData.circleCnt = circleCnt; 
		tmpData.Reset();
	}
	
	public function StopFlash(obj:SimpleUIObj)
	{ 
		var flashCnt:int = flashList.Count; // Just for a cache
		for (var i:int; i < flashCnt; i++)
		{
			if (flashList[i].obj == obj) 
			{ 
				flashList[i].Stop();
				freeList.Add(flashList[i]);
				flashList.Remove(flashList[i]);
			}
		}
	}
	
	public function Clear()
	{  
		flashList.Clear(); 
		freeList.Clear();
	} 
	
	public function GetFromFlashList(obj:SimpleUIObj):FlashData
	{
		var tmpData:FlashData = null;
		for (var i:int; i < flashList.Count; i++)
		{
			if (flashList[i].obj == obj) 
			{
				tmpData = flashList[i];
				return tmpData;
			}
		}
		
		return tmpData;
	}
	
	public function GetFromFreeList(obj:SimpleUIObj):FlashData
	{
		var tmpData:FlashData = null;
		for (var i:int; i < freeList.Count; i++)
		{
			if (freeList[i].obj == obj) 
			{
				tmpData = freeList[i];
				return tmpData;
			}
		}
		
		return tmpData;
	}
	
	public function Update()
	{
		if (flashList.Count == 0) return; 
		
		var flashCnt:int = flashList.Count; // Just for a cache
		for (var i:int; i < flashCnt; i++)
		{
			flashList[i].Update(); 
			
			if (flashList[i].IsFinish) 
			{
				freeList.Add(flashList[i]);
				flashList.Remove(flashList[i]);
			}
		}
	}
}