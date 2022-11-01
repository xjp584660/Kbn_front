

public class ISinScreenplay : IScreenplay
{
	protected override void UpdateData()
	{		
		data.V += data.A * UnityEngine.Time.deltaTime;
		data.S = UnityEngine.Mathf.Sin((float)data.V);
	}
	
}
