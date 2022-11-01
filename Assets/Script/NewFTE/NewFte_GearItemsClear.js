#pragma strict
class NewFteStep_CearItemsClear extends StepAction
{
	public function NewFteStep_CearItemsClear(data:NewFteDisplayData)
	{
		super(data);
	}

	public function Begin(fteID : int, fteStep : NewFteStep) 
	{
		var items : System.Collections.Generic.List.<Arm> = GearManager.Instance().GearWeaponry.GetArms();
		for ( var item in items )
		{
			if ( item.PlayerID < 0 )
				GearManager.Instance().GearWeaponry.RemoveArm(item);
		}
		super.Begin(fteID, fteStep);
	}

	// 
	protected function OnBeginDone()
	{
		this.Done();
	}
}
