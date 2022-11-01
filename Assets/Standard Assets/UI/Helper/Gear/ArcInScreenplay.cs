

public class ArcInScreenplay : IScreenplay
{
	protected override void UpdateStart()
	{
		if(!IsValid()) return;
		base.UpdateStart();
	}
	
	protected override void UpdateFinish()
	{
		data.V = 0.0f;
		data.A = 0.0f;
		base.UpdateFinish();
	}
	protected override void UpdateAcc()
	{
		if( data.S < 1.0f) 
			return;
		else if(data.S >= 1.0f) 
		{
			data.S = 1.0f;
			data.V = 0.0f;
			data.A = 0.0f;
		}
		base.UpdateAcc();
	}
	
}
