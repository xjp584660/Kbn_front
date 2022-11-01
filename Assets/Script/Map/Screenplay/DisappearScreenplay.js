


public class DisappearScreenplay extends IScreenplay
{
	protected function UpdateStart()
	{
		if(!IsValid()) return;
		
		//mData.Velocity = SlotMachineConstance.ScreenMaxSpeed;
		//mData.Acceleration = 0.0f;
		data.A = 30.0f;
		data.V = -5.0f;
		
		super.UpdateStart();
	}
	
	protected function UpdateFinish()
	{
		data.V = 0.0f;
		super.UpdateFinish();
	}
	protected function UpdateAcc()
	{
		if( data.S < 1.0f) 
			return;
		else if(data.S >= 1.0f) 
		{
			data.S = 1.0f;
			data.V = 0.0f;
			data.A = 0.0f;
		}
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