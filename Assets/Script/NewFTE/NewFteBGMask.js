#pragma strict

class NewFteBGMask extends UIObject
{
	//----------------------------------------------------
	public var maskLabel:Label;
	//----------------------------------------------------
	
	//-----------------------------------------------------	
	public override function Init()
	{
		super.Init();
		InitVariables();
	}
	
	private function InitVariables()
	{
	} 
	
	public override function Draw()
	{
		if (!super.visible)
			return;
		
		super.prot_calcScreenRect();
						
		GUI.BeginGroup(super.rect);
		maskLabel.Draw();
		GUI.EndGroup();
	}
	
	public override function Update()
	{
	}
	
	public override function SetVisible(visible:boolean)
	{
		super.SetVisible(visible);
	}
}