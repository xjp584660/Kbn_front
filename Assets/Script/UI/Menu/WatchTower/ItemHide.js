class ItemHide extends InventoryObj
{
	public var progress:ProgressBar;
	public var antiScoutTime:Label;
	public var clock:Label;
	public function Draw()
	{
		GUI.BeginGroup(rect);
		title.Draw();
			
		icon.Draw(); 
		description.Draw();
		if(Watchtower.instance().remainingAntiScoutingTime <= 0)
		{				
			btnSelect.Draw(); 
			price.Draw();
		}
		else
		{
			clock.Draw();
			progress.Draw();
			antiScoutTime.Draw();
		}		
		GUI.EndGroup();
	   	return -1;
	}
	
	function Update()
	{
		antiScoutTime.txt = _Global.timeFormatStr( Watchtower.instance().remainingAntiScoutingTime );
		progress.SetCurValue(Watchtower.instance().remainingAntiScoutingTime);
	}
}

