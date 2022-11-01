#pragma strict

class NewFteDisplayData
{
	public var hasDialog:boolean;
	public var dialogAvatar:String;
	public var dialogContent:String;
	public var dialogLayout:String;
	
	public var hasArrow:boolean;
	public var arrowLayout:String;
	
	public var hasHighlight:boolean;
	public var highLightLayout:String;
	
	public var hasDragIndicator:boolean;
	public var indicateText:String;
	
	public var traceObjName:String = null;
	public var traceObjType:String = NewFteConstants.TraceObjectType.UIObject; // Default is UIObject
	
	public var dragDroppedTargetName:String = null;
	public var dragTraceTargetType:String = null;
	public var dragTraceSourceType:String = null;
	
	public var traceObj:UIObject = null;
	//public var dragDroppedTarget:UIObject = null;
	
	public var waitTime:float = 0.0f;
	
	public static function BuildFromJson(jsonData:HashObject):NewFteDisplayData
	{
		var result:NewFteDisplayData = new NewFteDisplayData();
		result.ParseJson(jsonData);
		
		return result;
	}
	
	private function ParseJson(jsonData:HashObject)
	{
		// Parse the data
		if (null != jsonData[NewFteConstants.StepNodeKey.HasDialog])
		{
			hasDialog = _Global.GetBoolean(jsonData[NewFteConstants.StepNodeKey.HasDialog]);
			dialogAvatar = _Global.GetString(jsonData[NewFteConstants.StepNodeKey.DialogAvatar]);
			dialogContent = _Global.GetString(jsonData[NewFteConstants.StepNodeKey.DialogContent]);
			dialogContent = Datas.getArString(dialogContent); // As a string keys
			dialogLayout = _Global.GetString(jsonData[NewFteConstants.StepNodeKey.DialogLayout]);
		}
		
		if (null != jsonData[NewFteConstants.StepNodeKey.HasGuideArrow])
		{
			hasArrow = _Global.GetBoolean(jsonData[NewFteConstants.StepNodeKey.HasGuideArrow]);
			arrowLayout = _Global.GetString(jsonData[NewFteConstants.StepNodeKey.GuideArrowLayout]);
		}
		
		if (null != jsonData[NewFteConstants.StepNodeKey.HasHighlightBorder])
		{
			hasHighlight = _Global.GetBoolean(jsonData[NewFteConstants.StepNodeKey.HasHighlightBorder]);
			highLightLayout = _Global.GetString(jsonData[NewFteConstants.StepNodeKey.HighlightLayout]);
		}
		
		if (null != jsonData[NewFteConstants.StepNodeKey.TraceUIObject])
		{
			traceObjName = _Global.GetString(jsonData[NewFteConstants.StepNodeKey.TraceUIObject]);
		}
		
		if (null != jsonData[NewFteConstants.StepNodeKey.HasDragIndicator])
		{
			hasDragIndicator = _Global.GetBoolean(jsonData[NewFteConstants.StepNodeKey.HasDragIndicator]);
			indicateText = _Global.GetString(jsonData[NewFteConstants.StepNodeKey.IndicatorText]);
			indicateText = Datas.getArString(indicateText); // As a string keys
		}
		
		if (null != jsonData[NewFteConstants.StepNodeKey.TraceDragDroppedTargetObj])
		{
			dragDroppedTargetName = _Global.GetString(jsonData[NewFteConstants.StepNodeKey.TraceDragDroppedTargetObj]);
			dragTraceTargetType = _Global.GetString(jsonData[NewFteConstants.StepNodeKey.TraceTargetType]);
			dragTraceSourceType = _Global.GetString(jsonData[NewFteConstants.StepNodeKey.TraceSourceType]);
		}

		// Is the immediate instance
		traceObj = null;
		//dragDroppedTarget = null;
		
		if (null != jsonData[NewFteConstants.StepNodeKey.WaitTime])
		{
			waitTime = _Global.FLOAT(jsonData[NewFteConstants.StepNodeKey.WaitTime].Value);
		}
	}
}

class NewFteStepData
{
	public var id:int;
	public var name:String; // GetAsString()
	 
	public var isCanSkip:boolean;
	public var isNotifyServer:boolean;
	public var needSkipPhps:Array = null;
	
	public var fakeFreeItems:NewFteRewards = null; // Just for simulate some function
	public var realRewards:NewFteRewards = null;
	
	public var openConditions:NewFteConditions = null;
	public var completeConditions:NewFteConditions = null;
	
	// The opreation, example: click a button/drag a object / waiting sometime... 
	public var guideAction:String;
	public var displayData:NewFteDisplayData = null;
	
	private var m_orgData : HashObject = null;

	private var m_dicHashLocalServerReplay : System.Collections.Generic.Dictionary.<String, HashObject> = new System.Collections.Generic.Dictionary.<String, HashObject>();
	@JasonReflection.JasonData("NetServerReturn")
	public function get DicHashLocalServerReplay() : System.Collections.Generic.Dictionary.<String, HashObject>
	{
		return m_dicHashLocalServerReplay;
	}
	public function set DicHashLocalServerReplay(value : System.Collections.Generic.Dictionary.<String, HashObject>)
	{
		m_dicHashLocalServerReplay = value;
	}

	//----------------------------------------------------------
	private var prevId:int;
	private var nextId:int;
	//----------------------------------------------------------
	
	public function NewFteStepData()
	{
		InitVariables();
	} 
	
	public function FindServerMsgReplay(phpInvoke : String) : HashObject
	{
		if ( m_dicHashLocalServerReplay.ContainsKey(phpInvoke) )
			return m_dicHashLocalServerReplay[phpInvoke];
		return null;
	}
	
	public function ClearServerMsgReplay(phpInvoke : String)
	{
		if ( m_dicHashLocalServerReplay.ContainsKey(phpInvoke) )
		{
			m_dicHashLocalServerReplay[phpInvoke] = null;
		}
	}

	public function get OrgData() : HashObject
	{
		return m_orgData;
	}
	
	public function NewFteStepData(jsonData:HashObject)
	{
		InitVariables(); 
		ParseJson(jsonData);
	}
	
	private function InitVariables()
	{
		id = -1;
		name = String.Empty; 
		
		prevId = -1; 
		nextId = -1; 
		
		isCanSkip = false; 
		isNotifyServer = false; 
		needSkipPhps = new Array(); 
		
		fakeFreeItems = null;
		realRewards = null;
		completeConditions = null;
		
		guideAction = String.Empty; 
	}
	
	private function ParseJson(jsonData:HashObject)
	{
		m_orgData = jsonData;
		// Parse the data
		id = _Global.INT32(jsonData[NewFteConstants.StepNodeKey.Id]);
		name = _Global.GetString(jsonData[NewFteConstants.StepNodeKey.Name]); 
		JasonReflection.JasonConvertHelper.ParseToObjectOnce(this, jsonData);

		isCanSkip = _Global.GetBoolean(jsonData[NewFteConstants.StepNodeKey.IsCanSkip]);
		isNotifyServer = _Global.GetBoolean(jsonData[NewFteConstants.StepNodeKey.IsNofityServer]); 
		
		needSkipPhps = _Global.GetObjectValues(jsonData[NewFteConstants.StepNodeKey.SkipPhpNames]); 
		fakeFreeItems = NewFteRewards.BuildFromJson(jsonData[NewFteConstants.StepNodeKey.FakeDatas]);  
		
		var tmpJson:HashObject = jsonData[NewFteConstants.FteNodeKey.OpenConditions];
		openConditions = NewFteConditions.BuildFromJson(tmpJson);
		
		tmpJson = jsonData[NewFteConstants.StepNodeKey.CompleteConditions];
		completeConditions = NewFteConditions.BuildFromJson(tmpJson);
		
		realRewards = NewFteRewards.BuildFromJson(jsonData[NewFteConstants.StepNodeKey.Rewards]);  
		
		guideAction = _Global.GetString(jsonData[NewFteConstants.StepNodeKey.GuideAction]); 
		displayData = NewFteDisplayData.BuildFromJson(jsonData);
	}
	
	public function MergeFromServer(seed:HashObject)
	{
	
	}
	
	// public function IsBeActive(toolbar:ToolBar, index:int):boolean
	// {
	// 	if (null == openConditions) return true;
	// 	
	// 	var result:boolean = true;
	// 	var cond:NewFteCondition = null;
	// 	for (var i:int = 0; i < openConditions.AndConditions.Count; i++)
	// 	{
	// 		cond = openConditions.AndConditions[i];
	// 		// if (cond as NewFteConditionTabIndex)
	// 		// {
	// 		// 	result &= (cond as NewFteConditionTabIndex).IsMeetCondition(toolbar, index);
	// 		// }
	// 		// else
	// 		result &= cond.IsReached();
	// 	}
	// 	
	// 	return result;
	// }
}