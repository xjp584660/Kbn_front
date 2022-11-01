using UnityEngine;
using System;

public class IGUIAnimation
{
	public Action<IGUIAnimation> OnFinish;
	public Action<IGUIAnimation> OnStart;
	
	protected IScreenplay screenplay = null;
	protected UIObject uiobject = null;
	protected bool enable = false;
	
	public IGUIAnimation()
	{
		screenplay = null;
	}

	public IScreenplay Screenplay {
		get
		{
			return screenplay;
		}
		set
		{
			screenplay = value;
			if(screenplay != null) 	
				this.screenplay.OnFinish = OnAnimationFinish;
		}
	}
	protected bool isDefault = false;
	public virtual void SetDefault(bool isDefault)
	{
		this.isDefault = isDefault;
	}
	
	public UIObject TheObject
	{
		set{
			uiobject = value;
		}
	}
	
	public bool Enable
	{
		set {
			enable = value;
		}
	}
	
	public virtual void Init()
	{
		
	}
	public void Start(float s,float v,float a)
	{
		this.screenplay.Begin(s,v,a);
		if(OnStart != null)
			OnStart(this);
	}
	
	protected void OnAnimationFinish()
	{
		if(OnFinish != null)
			OnFinish(this);
	}
	
	protected virtual void OnUpdate()
	{
		
	}
	
	public void Update()
	{
		if(!IsValid()) return;
		screenplay.Update();
		OnUpdate();
	}
	
	protected virtual bool IsValid()
	{
		if( !enable ) return false;
		if( uiobject == null) return false;
		if( screenplay == null) return false;
		return true;
	}
	
}
