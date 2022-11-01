
using UnityEngine;

public class FlashLabel : Label
{
	private IComposedScreenplay screenplays;
	private IScreenplay flashScreenplay;
	private int times;
	private float from;
	private float to;
	private float accelerate;
	public IComposedScreenplay Screenplay
	{
		get
		{
			return screenplays;
		}
	}
	
	public int Times
	{
		set
		{
			if(screenplays == null) return;
			if(flashScreenplay == null) return;
			//if(value as int <= 0) return; 
			times = value;
			screenplays.Clear();
			for(var i=0;i<times;i++)
				screenplays.Add(flashScreenplay);
		}
	}
	
	public float From
	{
		set
		{
			from = value;
		}
	}
	
	public float To
	{
		set
		{
			to = value;
		}
	}
	
	public float Accelerate
	{
		set
		{
			accelerate = value;
		}
	}
	
	
	public void Begin()
	{
		if(from < 0.0f) return;
		if(to < 0.0f) return;
		if(from > 1.0f) return;
		if(to > 1.0f) return;
		if(times < 1) return;
		
		float s = 0.0f;
		float v = 0.0f;
		float a = accelerate;
		
		screenplays.Begin(s,v,a);
	}
	
	public void Begin(float from,float to,int times)
	{
		From = from;
		To = to;
		Times = times;
		
		Begin();
	}
	
	public override void Init()
	{
		base.Init();
		screenplays = new IComposedScreenplay(this);
		flashScreenplay = new FlashScreenplay();
		times = 0;
		alphaEnable = true;
		accelerate = Mathf.PI;
	}
	
	public override void Update()
	{
		base.Update();
		if(screenplays == null) return;
		screenplays.Update();
		alpha = (float)(screenplays.data.S * (to - from) + from);
	}
}
