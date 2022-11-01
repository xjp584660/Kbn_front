import System.Collections.Generic;

public class RallySelectTroopItem extends ListItem
{
	public var troopName : Label;
	public var troopCount : Label;
	public var line : Label;

	public function Init(param:Object)
	{
		
	}

	public function Update()
	{
		
	}

	public function Draw()
	{
		GUI.BeginGroup(rect);

		troopName.Draw();
		troopCount.Draw();
		line.Draw();

		GUI.EndGroup();
	}


	public function SetData(troopType : int, troopCount : int, isLast : boolean)
	{
		this.troopName.txt = Datas.instance().getArString("unitName.u" + troopType);
		this.troopCount.txt = troopCount.ToString();
		if(isLast)
		{
			line.rect.x = 24;
			line.rect.width = 590;
		}
		else
		{
			line.rect.x = 66;
			line.rect.width = 500;
		}
	}

	function FixedUpdate()
	{
		
	}

	public function Clear()
	{

	}
}