

public class LeverScreenplay extends IScreenplay
{
	protected function UpdateStart()
	{
		if(!IsValid()) return;
//		data.V = 0.0f;
//		data.A = mA;
		
		data.V = 0.0f;
		data.A = -1 * 2 * mA;		
		
		super.UpdateStart();
	}
	
	protected function UpdateFinish()
	{
		
		super.UpdateFinish();
	}

	protected function UpdateAcc()
	{
	/*	if(data.V >= mV * 0.9)
			data.A = -1 * mA * 7;
		else
			return;
	*/	
		super.UpdateAcc();
	}
	
	protected function UpdateDes()
	{
		if(data.V <= -1 * mV * 5)
		{
			data.V = 0.0f;
			data.A = 0.0f;
		}
		else return;
		super.UpdateDes();
	}
	
	protected function UpdateIdle()
	{
/*		if(data.V <= 10)
		{
			data.V = 0.0f;
			data.A = -1 * 15 * mA;
		}
		else 
			return;		
*/		super.UpdateIdle();
	}
	
	protected function UpdateNone()
	{
	
		super.UpdateNone();
	}
	
	private var mA:double = 0.0f;
	private var mT:double = 0.0f;
	private var mV:double = 0.0f;
	
	public function SetValue(name:String, o:Object)
	{
		super.SetValue(name, o);
		if(name == "a")
			mA = o;
		mA = mA * 100 - 450;
		
		mT = System.Math.Sqrt(2 * 134 / mA);
		mV = mA * mT;
	}
	
	protected function IsValid():boolean
	{
		if(!super.IsValid()) return false;

		
				
		return true;
	}
	
}