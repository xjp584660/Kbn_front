#pragma strict

class NewFteFlagIcon extends UIObject
{
	//----------------------------------------------------
	public var iconLabel:Label;
	//----------------------------------------------------
	
	private var uiObject:UIObject = null;
	private var tabIndex:int = -1;
	
	private var touchDoneDel:Function;
	
	//-----------------------------------------------------	
	public override function Init()
	{
		super.Init();
		
		iconLabel.NeedScreenRect = true;
		InitVariables();
	}
	
	private function InitVariables()
	{
		tabIndex = -1;
		uiObject = null;
	} 
	
	public override function Draw()
	{
		if (!super.visible)
			return;
		
		super.prot_calcScreenRect();		
		// GUI.BeginGroup(super.rect);
		iconLabel.Draw();
		// GUI.EndGroup();
	}
	
	public override function Update()
	{
		if (!super.visible) return;
		
		if (NewFteDisplayMgr.Instance().IsTouched())
		{
			// Include current position
			var clickPos:Vector2 = Input.mousePosition;
			clickPos.y = Screen.height - clickPos.y;
			if (iconLabel.ScreenRect.Contains(clickPos))
			{
				if (null != touchDoneDel)
				{
					touchDoneDel();
				}
			} 
		}
	}
	
	public function SetTraceObject(uiObj:UIObject)
	{
		if (null == uiObj) return;
		
		uiObject = uiObj;
		NewFteDisplayMgr.Instance().AddTracerGetRect(uiObj, this);
	}
	
	public function SetTraceToolbarIndex(index:int)
	{
		tabIndex = index;
	}
	
	private function GetTraceRect(traceRect:Rect)
	{
		if (null != uiObject && uiObject as ToolBar)
		{
			CalcTraceToolbar(uiObject as ToolBar, traceRect);
		}
	}
	
	private function CalcTraceToolbar(toolbar:ToolBar, traceRect:Rect)
	{
		if (tabIndex == -1) return;
		
		var border:int = 2;
		var width:int = (traceRect.width - border * (toolbar.toolbarStrings.length - 1)) / toolbar.toolbarStrings.length;			
		
		var tX:float = traceRect.x + tabIndex * width + tabIndex * border;
		var center:Vector2 = new Vector2(tX + 0.5f * width, traceRect.y + 0.5f * traceRect.height);
		iconLabel.rect.x = center.x - 0.5f * iconLabel.rect.width;
		iconLabel.rect.y = center.y - 0.5f * iconLabel.rect.height;
		
		// iconLabel.rect.width = width;
		// iconLabel.rect.height = toolbar.rect.height;
	}
	
	public function SetDoneDelegate(del:Function)
	{
		touchDoneDel = del;
	}
}