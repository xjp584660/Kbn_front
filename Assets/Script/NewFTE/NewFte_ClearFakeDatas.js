#pragma strict
class NewFteStep_ClearFakeDatas extends StepAction
{
	public function NewFteStep_ClearFakeDatas(data:NewFteDisplayData)
	{
		super(data);
	}

	public function Begin(fteID : int, fteStep : NewFteStep) 
	{
		NewFteFakeDatasMgr.Instance().TrimFteFakeDatas(fteID);
		super.Begin(fteID, fteStep);
	}

	// 
	protected function OnBeginDone()
	{
		this.Done();
	}
}
