using UnityEngine;
using System;

public class LineGUIAnimation : IGUIAnimation
{
	
	private Rect from;
	private Rect to;
	 
	private double distance;
	public LineGUIAnimation()
	{
		
	}

	public Rect From
	{
		set {
			from = value;
		}
	}
	
	public Rect To
	{
		set {
			to = value;
		}
	}
	
	public override void Init()
	{
		base.Init();
	}
	
	public override void SetDefault(bool isDefault)
	{
		base.SetDefault(isDefault);
		if(isDefault)
		{
			Screenplay = new ArcOutScreenplay();
		}
	}
	
	
	
	private Rect rect;
	protected override void OnUpdate()
	{
		if(!IsValid()) return;
		rect.x = from.x + screenplay.data.S * (to.x - from.x);
		rect.y = from.y + screenplay.data.S * (to.y - from.y);
		rect.width = from.width + screenplay.data.S * (to.width - from.width);
		rect.height = from.height + screenplay.data.S * (to.height - from.height);
		
		uiobject.SetRect(rect);
	}	
	
	protected override bool IsValid()
	{
		if(from == to ) return false; 
		
		return base.IsValid();
	}
	
}
