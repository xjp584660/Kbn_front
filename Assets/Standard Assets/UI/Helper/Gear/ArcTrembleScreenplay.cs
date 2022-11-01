


public class ArcTrembleScreenplay : IScreenplay
{
	private System.Random mRandom;
	private bool mIsStop = false;
	private float mMax = 0.0f;
	public override void Init()
	{
	}
	
	protected override void UpdateStart()
	{ 
		data.S = 0.0f;
		mRandom = new System.Random();
		mIsStop = false;
		data.A = 1.0f;
		mMax = 1000.0f;
		base.UpdateStart();
	}
	
	

	
	protected override void UpdateAcc()
	{
		if( mMax < 0 ) mMax = 1;
		if( data.A > 0 )
		{
			data.S = mRandom.Next(0, (int)mMax) / 10000.0f;
		}
		else 
		{
			data.S = mRandom.Next((int)-mMax,0) / 10000.0f;
		}
		mMax -= mRandom.Next(-6,14);
		data.A = -1.0f * data.A;
		
		if(mIsStop) 	
			base.UpdateAcc();
	}
	
	public override void SetValue(string name, object o)
	{	
		if(name == "stop")
		{
			mIsStop = true;
		}
		
		
	}	
	
	
}
