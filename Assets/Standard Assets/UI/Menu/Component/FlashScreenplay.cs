
using UnityEngine;

public class FlashScreenplay : ISinScreenplay
{
	private float originV = 0.0f;
	
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
		if(data.V - originV >= Mathf.PI * 3 / 3 || originV - data.V >= Mathf.PI * 3 / 3)
		{
			base.UpdateAcc();
		}
	}
	public override void Begin(float s,float v,float a)	
	{
		base.Begin(s,v,a);
		originV = data.V;
	}
	
}
