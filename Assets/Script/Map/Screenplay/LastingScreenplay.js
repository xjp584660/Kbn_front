

public class LastingScreenplay extends IScreenplay
{
	protected function UpdateStart()
	{
		if(!IsValid()) return;
		
		data.V = 1600.0f;
		data.A = 100.0f;
		super.UpdateStart();
	}

	protected function UpdateFinish()
	{
		data.V = 0.0f;
		data.A = 0.0f;
		super.UpdateFinish();
	}
	protected function UpdateAcc()
	{
		return;
		super.UpdateAcc();
	}
	
	protected function UpdateDes()
	{
		super.UpdateDes();
	}
	
	protected function UpdateIdle()
	{
		super.UpdateIdle();
	}
	
	protected function UpdateNone()
	{
		super.UpdateNone();
	}
	
	public function SetValue(name:String, o:Object)
	{
		super.SetValue(name, o);
		
		
		
	}
	
	protected function IsValid():boolean
	{
		if(!super.IsValid()) return false;

		return true;
	}
	
}