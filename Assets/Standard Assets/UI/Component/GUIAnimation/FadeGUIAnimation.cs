

public class FadeGUIAnimation : IGUIAnimation
{	
	
	private float alpha;
	private float from;
	private float to;
	
	public float From
	{
		set {
			from = value;
		}
	}
	public float To
	{
		set {
			to = value;
		}
	}
		
	public override void Init()
	{
		base.Init();

		if(uiobject != null)
			uiobject.alphaEnable = true;
		from = 1.0f;
		to = 1.0f;
	}
	
	protected override void OnUpdate()
	{ 
		base.OnUpdate();

		uiobject.alpha = from + (to - from) * screenplay.data.S;
	}	
	
	protected override bool IsValid()
	{
		return base.IsValid();
	}
	
	public override void SetDefault(bool isDefault)
	{
		base.SetDefault(isDefault);
		if(isDefault)
		{
			Screenplay = new ArcOutScreenplay();
			if(uiobject != null)
				uiobject.alphaEnable = true;
		}
	}
	
	
}
