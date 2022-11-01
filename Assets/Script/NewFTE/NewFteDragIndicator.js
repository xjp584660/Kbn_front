#pragma strict

class NewFteDragIndicator extends UIObject
{
	//----------------------------------------------------
	public var indicator:Label;
	public var textLabel:Label;
	//----------------------------------------------------
	
	//-----------------------------------------------------	
	public override function Init()
	{
		super.Init();
		
		InitRects();
		InitVariables();
	}
	
	private function InitVariables()
	{
	} 
	
	private function InitRects()
	{
		indicator.rect.x = 0.5f * (super.rect.width - indicator.rect.width);
		indicator.rect.y = 0.5f * (super.rect.height - indicator.rect.height);
		
		textLabel.rect.y = indicator.rect.y - textLabel.rect.height + 5.0f;
	}
	
	public override function Draw()
	{
		if (!super.visible)
			return;
		
		super.prot_calcScreenRect();
						
		GUI.BeginGroup(super.rect);
		
		indicator.Draw();
		textLabel.Draw();
		
		GUI.EndGroup();
	}
	
	public override function Update()
	{
	}
	
	public override function SetVisible(visible:boolean)
	{
		super.SetVisible(visible);
	}
	
	public function set Data(value:Object)
	{
		if (null == value) return;
		
		var data:NewFteDisplayData = value as NewFteDisplayData;
		if (!data.hasDragIndicator) return;
		
		SetIndicateText(data.indicateText);
	}
	
	private function SetIndicateText(text:String)
	{
		textLabel.txt = text;
		textLabel.rect.width = _Global.GUICalcWidth(textLabel.mystyle, text) + 10.0f;
	}
}