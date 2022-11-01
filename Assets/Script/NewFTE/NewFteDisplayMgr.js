#pragma strict

import System;
import System.Collections;
import System.Collections.Generic;
import System.Reflection;

class NewFteDisplayMgr
{
	private static var instance:NewFteDisplayMgr = null;
	private function NewFteDisplayMgr() {}
	
	public static function Instance():NewFteDisplayMgr
	{
		if (null == instance)
		{
			instance = new NewFteDisplayMgr();
			instance.Init();
			
			GameMain.instance().resgisterRestartFunc(function(){
				instance.Free();
				instance = null;
			});
		}
		
		return instance;
	}
	
	///----------------------------------------------------------
	private var isActive:boolean = false;
	
	private var bgMask:NewFteBGMask = null;
	private var dialog:NewFteDialog = null;
	private var dragIndicator:NewFteDragIndicator = null;
	
	private var prefabGuideArrow:NewFteGuideArrow = null;
	private var prefabHighLightBorder:NewFteHighlightBorder = null; 
	private var prefabFlagIcon:NewFteFlagIcon = null;
	
	private var fteUIObjects:List.<UIObject> = null;  
	private var rmFteUIObjects:List.<UIObject> = null; // Only need cache key
	 
	//----------------------------------------------------------
	private var rmTraceUIObjects:List.<UIObject> = null; // Only need cache key
	private var tracerGetRectMethods:Dictionary.<UIObject, Array> = null; 
	
	private var topObjPairInfo:Array = null;
	
	//----------------------------------------------------------
	private var timerList:List.<TimerSimulator> = null;
	
	///----------------------------------------------------------
	private function Init()
	{ 
		InitVariables(); 
	}
	
	private function Free()
	{
	}
	
	private function InitVariables()
	{
		isActive = true;
		
		bgMask = null;
		dialog = null;
		dragIndicator = null;
		
		prefabGuideArrow = null;
		prefabHighLightBorder = null; 
		prefabFlagIcon = null;
		
		fteUIObjects = new List.<UIObject>();  
		rmFteUIObjects = new List.<UIObject>();  
		
		rmTraceUIObjects = new List.<UIObject>();
		tracerGetRectMethods = new Dictionary.<UIObject, Array>();
		
		topObjPairInfo = null;
		timerList = new List.<TimerSimulator>();
		
		InitPrefabTemplates();
	} 
	
	private function InitPrefabTemplates()
	{
		var tmpObj:GameObject = null;
		if (null == prefabGuideArrow)
		{
			tmpObj = TextureMgr.instance().LoadPrefab("menu/NewFte/NewFteGuideArrow") as GameObject;
			prefabGuideArrow = tmpObj.GetComponent(typeof(NewFteGuideArrow)) as NewFteGuideArrow;
			prefabGuideArrow.Init();
		}
		
		if (null == prefabHighLightBorder)
		{
			tmpObj = TextureMgr.instance().LoadPrefab("menu/NewFte/NewFteHighlightBorder") as GameObject;
			prefabHighLightBorder = tmpObj.GetComponent(typeof(NewFteHighlightBorder)) as NewFteHighlightBorder;
			prefabHighLightBorder.Init();
		}
		
		if (null == prefabFlagIcon)
		{
			tmpObj = TextureMgr.instance().LoadPrefab("menu/NewFte/NewFteFlagIcon") as GameObject;
			prefabFlagIcon = tmpObj.GetComponent(typeof(NewFteFlagIcon)) as NewFteFlagIcon;
			prefabFlagIcon.Init();
		}
	}
	
	public function Draw()
	{
		if (!isActive)
			return;
			
		var tmpGUIMatrix:Matrix4x4 = GUI.matrix; 
		_Global.setGUIMatrix();
		
		if (null != bgMask)
		{
			bgMask.Draw();
		}
		
		if (null != dialog)
		{
			dialog.Draw();
		}

		//GUI.matrix = Matrix4x4.identity;
		for (var tracePair:KeyValuePair.<UIObject, Array> in tracerGetRectMethods)  
		{
			// Cache the old rect data 
			var traceObj:UIObject = tracePair.Key;
			var tmpRect:Rect = new Rect(traceObj.rect); 
			
			traceObj.rect = traceObj.ScreenRect;
			traceObj.rect.x /= GameMain.horizRatio;
			traceObj.rect.width /= GameMain.horizRatio;
			traceObj.rect.y /= GameMain.vertRatio;
			traceObj.rect.height /= GameMain.vertRatio;
			if(traceObj!=null&&traceObj.gameObject.name != "GearScrollViewItem(Clone)"){
				traceObj.Draw(); 
			}
//			traceObj.Draw(); 
			traceObj.rect = tmpRect;

			traceObj.MakeNeedScreenRectOnce();

			var tracers:Array = tracePair.Value as Array;
			// Dispatch
			for (var i : int = 0; i != tracers.length; ++i )
			//for (var tracer:System.Object in tracers)
			{
				var tracer : System.Object = tracers[i];
				var methodInfo:MethodInfo = tracer.GetType().GetMethod("GetTraceRect", 
																		BindingFlags.Instance | BindingFlags.NonPublic 
																		| BindingFlags.Instance | BindingFlags.Public);
				if (null != methodInfo)
				{
					var paramInfo:ParameterInfo[] = methodInfo.GetParameters();
					var params:System.Object[] = new Object[paramInfo.Length];
					params[0] = traceObj.ScreenRect;
					if(traceObj!=null&&
						(traceObj.name=="btnBack" || traceObj.name=="btnleft")){
						params[0] =new Rect(traceObj.ScreenRect.x-3,traceObj.ScreenRect.y-3,traceObj.ScreenRect.width-15,traceObj.ScreenRect.height);
					}
					
					methodInfo.Invoke(methodInfo.IsStatic ? null : tracer, params);
				}
			}
		}

		GUI.matrix = Matrix4x4.identity;
		for (var fteObj:UIObject in fteUIObjects)
		{ 
			fteObj.Draw(); 
		}
		
		// The top UIObject
		_Global.setGUIMatrix();
		if (null != topObjPairInfo)
		{
			var fieldInfo:System.Reflection.FieldInfo = topObjPairInfo[0] as System.Reflection.FieldInfo;
			if (null != fieldInfo)
			{
				var topObj:UIObject = fieldInfo.GetValue(topObjPairInfo[1]);
				if (null == topObj)
				{
					topObjPairInfo = null;
				}
				else
				{
					// Check is GearScrollViewItem
					if ((topObj as GearScrollViewItem) || (topObj as StoneItem))
					{
						topObj.Draw();
					}
					else
					{
						topObj.rect = topObj.ScreenRect;
						topObj.rect.x /= GameMain.horizRatio;
						topObj.rect.width /= GameMain.horizRatio;
						topObj.rect.y /= GameMain.vertRatio;
						topObj.rect.height /= GameMain.vertRatio;
						
						topObj.Draw(); 
						topObj.rect = tmpRect;  
						topObj.MakeNeedScreenRectOnce();
					}
				}
			}
		}
		
		GUI.matrix = Matrix4x4.identity;
		if (null != dragIndicator)
		{
			dragIndicator.Draw();
		}
		
		
		GUI.matrix = tmpGUIMatrix;
	}
	
	public function Update()
	{
		if (!isActive)
			return;

		if (null != dialog)
		{
			dialog.Update();
		}

		if (null != dragIndicator)
		{
			dragIndicator.Update();
		}

		UpdateTimers();
		UpdateFteObjects();
		UpdateTraceObjects();
	}
	
	private function UpdateTimers()
	{
		for ( var pos : int = 0; pos < timerList.Count; )
		{
			var timer : TimerSimulator = timerList[pos];
			timer.Update();
			
			if (timer.IsAutoRemove && timer.IsFinish)
			{
				timerList.RemoveAt(pos);
				//tRmList.Add(timer);
			}
			else
			{
				++pos;
			}
		}
	}
	
	private function UpdateFteObjects()
	{
		for (var fteObj:UIObject in fteUIObjects)
		{ 
			fteObj.Update(); 
		}  
		
		// Move unuseful objects
		var rmObj:UIObject = null;
		for (rmObj in rmFteUIObjects)
		{
			fteUIObjects.Remove(rmObj);
			RemoveTracerGetRect(rmObj);
			
			RealDestroyUIObject(rmObj);
		} 
		rmFteUIObjects.Clear();  
	}
	
	private function UpdateTraceObjects()
	{
		for (var tracePair:KeyValuePair.<UIObject, Array> in tracerGetRectMethods)  
		{
			tracePair.Key.Update();
		}
		
		var rmObj:UIObject = null;
		for (rmObj in rmTraceUIObjects)
		{
			// rmObj.ChangeScreenRectCount(-tracerGetRectMethods.Count);
			tracerGetRectMethods.Remove(rmObj);
		} 
		rmTraceUIObjects.Clear(); 
	}
	
	public function get TopObjPairInfo():Array
	{
		return topObjPairInfo;
	}
	
	public function set TopObjPairInfo(value:Array)
	{
		topObjPairInfo = value;
	}
	
	public function AddTraceUIObject(obj:UIObject)
	{  
		if (tracerGetRectMethods.ContainsKey(obj))
		{ 
			return;
		} 
		else
		{
			var tracers:Array = new Array(); 
			tracerGetRectMethods[obj] = tracers;
		}
	}
	
	public function RemoveTraceUIObject(obj:UIObject)
	{ 
		rmTraceUIObjects.Add(obj);
	} 
	
	public function AddTracerGetRect(obj:UIObject, tracerObj:System.Object)
	{  
		var tracers:Array = null;
		if (tracerGetRectMethods.ContainsKey(obj))
		{
			tracers = tracerGetRectMethods[obj] as Array;
		}
		else
		{
			tracers = new Array();
			tracerGetRectMethods[obj] = tracers;
		}
		tracers.Push(tracerObj);
		
		obj.NeedScreenRect = (0 != tracers.Count);
	}
	
	public function RemoveTracerGetRect(tracerObj:System.Object)
	{ 
		var tmpRemoveList:Array = new Array(); 
		
		for (var entity:KeyValuePair.<UIObject, Array> in tracerGetRectMethods)
		{
			var tracers:Array = entity.Value; 
			for (var tracer:System.Object in tracers)
			{
				if (tracer == tracerObj)
				{
					tmpRemoveList.Add(tracer);
				}
			} 
			 
			for (var rmObj:System.Object in tmpRemoveList)
			{
				tracers.Remove(rmObj);
			}  
			tmpRemoveList.Clear();
		}
	}
		
	public function ShowBGMask(isShow:boolean):NewFteBGMask
	{
		if (null == bgMask)
		{
			var tmpObj:GameObject = TextureMgr.instance().LoadPrefab("menu/NewFte/NewFteBGMask") as GameObject;
			bgMask = tmpObj.GetComponent(typeof(NewFteBGMask)) as NewFteBGMask;
			bgMask.Init();
		}
		
		if (null != bgMask)
		{
			bgMask.NeedScreenRect = true;
			bgMask.SetVisible(isShow);
		}
		return bgMask;
	}
	
	public function ShowDialog(isShow:boolean):NewFteDialog
	{
		if (null == dialog)
		{
			var tmpObj:GameObject = TextureMgr.instance().LoadPrefab("menu/NewFte/NewFteDialog") as GameObject;
			dialog = tmpObj.GetComponent(typeof(NewFteDialog)) as NewFteDialog;
			dialog.Init();
		}
		
		if (null != dialog)
		{
			dialog.NeedScreenRect = true;
			dialog.SetVisible(isShow);
		}
		return dialog;
	}
	
	public function ShowDragIndicator(isShow:boolean):NewFteDragIndicator
	{
		if (null == dragIndicator)
		{
			var tmpObj:GameObject = TextureMgr.instance().LoadPrefab("menu/NewFte/NewFteDragIndicator") as GameObject;
			dragIndicator = tmpObj.GetComponent(typeof(NewFteDragIndicator)) as NewFteDragIndicator;
			dragIndicator.Init();
		}
		
		if (null != dragIndicator)
		{
			dragIndicator.NeedScreenRect = true;
			dragIndicator.SetVisible(isShow);
		}
		return dragIndicator;
	}
	
	public function CreateGuideArrow(data:NewFteDisplayData):NewFteGuideArrow
	{
		if (null == data) 
			return null;
		
		var newResult:NewFteGuideArrow = MonoBehaviour.Instantiate(prefabGuideArrow) as NewFteGuideArrow;
		newResult.Init();
		newResult.Data = data;
		
		newResult.NeedScreenRect = true;
		newResult.SetVisible(true);  
		
		fteUIObjects.Add(newResult);
		return newResult;
	} 
	
	public function DeleteGuideArrow(obj:UIObject)
	{
		rmFteUIObjects.Add(obj);
	}
	
	public function CreateHighLightBorder(data:NewFteDisplayData):NewFteHighlightBorder
	{
		if (null == data) 
			return null;

		var newResult:NewFteHighlightBorder = MonoBehaviour.Instantiate(prefabHighLightBorder) as NewFteHighlightBorder;
		newResult.Init();
		newResult.Data = data;
		
		newResult.NeedScreenRect = true;
		newResult.SetVisible(true);  
		
		fteUIObjects.Add(newResult);
		return newResult;
	} 
	
	public function CreateHighLightBorder(relObj:UIObject):NewFteHighlightBorder
	{
		var newResult:NewFteHighlightBorder = MonoBehaviour.Instantiate(prefabHighLightBorder) as NewFteHighlightBorder;
		newResult.Init();
		newResult.SetTraceObject(relObj);
		
		newResult.NeedScreenRect = true;
		newResult.SetVisible(true);  
		
		fteUIObjects.Add(newResult);
		return newResult;
	}
	
	public function DeleteHighLightBorder(obj:UIObject)
	{
		rmFteUIObjects.Add(obj);
	}
	
	public function CreateFlagIcon(relObj:UIObject):NewFteFlagIcon
	{
		var newResult:NewFteFlagIcon = MonoBehaviour.Instantiate(prefabFlagIcon) as NewFteFlagIcon;
		newResult.Init();
		newResult.SetTraceObject(relObj);
		
		newResult.NeedScreenRect = true;
		newResult.SetVisible(true);  
		
		fteUIObjects.Add(newResult);
		return newResult;
	}
	
	public function DeleteFlagIcon(obj:UIObject)
	{
		rmFteUIObjects.Add(obj);
	}
	
	private function RealDestroyUIObject(obj:UIObject)
	{
		UIObject.TryDestroy(obj);
	}
	
	public function IsBGMaskVisible():boolean
	{
		if (null == bgMask) return false;
		
		return bgMask.isVisible();
	}
	
	public function IsUIObjsVisible():boolean
	{
		var result:boolean = false;
		
		result |= IsBGMaskVisible();
		result |= (null != dialog && dialog.isVisible());
		result |= (null != dragIndicator && dragIndicator.isVisible());
		result |= (tracerGetRectMethods.Count > 0);
		result |= (fteUIObjects.Count > 0);
		
		return result;
	}
	
	public function get IsClickMenuForbidRect():boolean
	{
		if (!isActive)
			return false;
			
		if (NewFteMgr.Instance().IsAllFteCompleted)
			return false;
			
		if (null == bgMask) return false;
		
		// Check first
		UpdateInput();
		
		if (bgMask.isVisible() 
			&& (NewFteDisplayMgr.isInputDown || NewFteDisplayMgr.isInputMoving)
			)
		{ 
			// Include current position
			var clickPos:Vector2 = Input.mousePosition;
			clickPos.y = Screen.height - clickPos.y;
			if (bgMask.ScreenRect.Contains(clickPos))
			{
				return true;
			} 
			
			// Include start position
			clickPos.x = NewFteDisplayMgr.inputStartPosX; 
			clickPos.x = Screen.height - NewFteDisplayMgr.inputStartPosY; 
			if (bgMask.ScreenRect.Contains(clickPos))
			{
				return true;
			}
			
			return false;
		} 
		
		return false;
	}
	
	public function set IsActive(value:boolean)
	{
		isActive = value;
	}
	
	public function get IsActive():boolean
	{
		return isActive;
	}
	
	public static function IsTouched():boolean
	{
		var clicked:boolean = false;
#if (UNITY_ANDROID || UNITY_IPHONE) && !UNITY_EDITOR
		if (Input.touchCount > 0)
		{
		 	var touch:Touch = Input.touches[0];
		 	if (touch.phase == TouchPhase.Began)
			{
				clicked = true;
			}
			else if (touch.phase == TouchPhase.Canceled)
			{
				clicked = false;
			}
		 }
#elif UNITY_EDITOR
		if (Input.GetMouseButtonDown(0))
			clicked = true;
#endif
		return clicked;
	}
	
	// Not a beautiful coding, temporary!!!
	private static final var MoveThreshold:float = 1;
	
	private static var isInputDown:boolean = false;
	private static var isInputMoving:boolean = false;
	
	private static var inputStartPosX:float = 0; 
	private static var inputStartPosY:float = 0;
	
	public static function UpdateInput()
	{
#if (UNITY_ANDROID || UNITY_IPHONE) && !UNITY_EDITOR
		if (Input.touchCount > 0)
		{
		 	var touch:Touch = Input.touches[0];
		 	if (touch.phase == TouchPhase.Began)
			{
				isInputDown = true; 
				isInputMoving = false;
				
				inputStartPosX = Input.mousePosition.x;
				inputStartPosY = Input.mousePosition.y;
			}
			else if (touch.phase == TouchPhase.Moved)
			{ 
				isInputMoving = true;
			}
			else if (touch.phase == TouchPhase.Canceled)
			{
				isInputDown = false; 
				isInputMoving = false;
			}
		 }
#elif UNITY_EDITOR
		if (Input.GetMouseButtonDown(0))
		{
			if (isInputDown)
			{ 
				_Global.Log("Current Pos: " + Input.mousePosition.ToString()); 
				_Global.Log("Start Pos: " + new Vector2(inputStartPosX, inputStartPosY).ToString());
				
				if ((Input.mousePosition - new Vector2(inputStartPosX, inputStartPosY)).magnitude > MoveThreshold)
				{
					isInputMoving = true;
				}
			}
			else
			{ 
				_Global.Log("Enter begin:"); 
				
				isInputDown = true; 
				isInputMoving = false;
				
				inputStartPosX = Input.mousePosition.x;
				inputStartPosY = Input.mousePosition.y;
			}
		}
		else if (Input.GetMouseButtonUp(0))
		{
			isInputDown = false;	
			isInputMoving = false;
		}
#endif
	}
	
	public function AddTimer(timer:TimerSimulator)
	{
		if (!timerList.Contains(timer))
			timerList.Add(timer);
		else
		{
			timer.Reset();
		}
	}

	public function Clear() : void
	{
		bgMask = null;
		dialog = null;
		dragIndicator = null;
		for ( var item : UIObject in tracerGetRectMethods.Keys )
			rmTraceUIObjects.Add(item);
		for ( var fteObj : UIObject in fteUIObjects )
			rmFteUIObjects.Add(fteObj);
	}
}

class TimerSimulator
{
	private var timing:float;
	private var interval:float;
	private var callback:Function;
	
	private var isFinish:boolean;
	private var isAutoRemove:boolean;
	
	public function TimerSimulator(interval:float, callback:Function)
	{
		this.timing = 0;
		this.interval = interval;
		this.callback = callback;
		
		this.isFinish = false;
		this.isAutoRemove = true;
	}
	
	public function Reset()
	{
		timing = 0.0f;
		isFinish = false;
		isAutoRemove = true;
	}
	
	public function Update()
	{
		if (isFinish) return;
		
		if (timing >= interval)
		{
			isFinish = true;
			callback();
		}
		else
		{
			timing += Time.deltaTime;
		}
	}
	
	public function get IsFinish():boolean
	{
		return isFinish;
	}
	
	public function get IsAutoRemove():boolean
	{
		return isAutoRemove;
	}
}
