using UnityEngine;
using System;

public class TipBar : UIObject
{
	[UnityEngine.Space(30), UnityEngine.Header("----------TipBar----------")]

	protected LineGUIAnimation lineIn = null;
	protected LineGUIAnimation lineOut = null;
	protected LineGUIAnimation lineOut2 = null;
	public override void Init()
	{
		base.Init();
		rect = CreateRect();
		lineIn = null;
		lineOut = null;
		lineOut2 = null;
		time = 0.0f;
	}

    public virtual void InitForWorldMap()
    {
        // Empty
    }

    public virtual void setInfoContent(string s)
    {
        // Empty
    }

	public virtual bool IsShow()
	{
		return visible;
	}

	public virtual void ReSetRect()
	{

	}
	
	
	protected float time;
	public float stopTime;
	
	public float StopTime
	{
		set {
			stopTime = value;
		}
	}

	public virtual void SetTipBarStopTime(float t)
	{
		stopTime=t;
	}
	
	public override void Update()
	{
		base.Update();

		if(!IsShow()) return;
		if(stopTime <= 0.0f) return;
		time += Time.deltaTime;
		if(time >= stopTime)
		{
			Hide();
			time = 0.0f;
		}
	}
	
	protected virtual Rect CreateRect()
	{
		return new Rect();
	}
		
	public virtual void Show()
	{
		LineInAnimate();
	}

	public virtual void WorldMapShow()
	{
		WorldMapLineInAnimate();
		time=0.0f;
	}

	public virtual void Hide()
	{
		LineOutAnimate();
	}
	
	protected virtual void LineInAnimate()
	{	
		visible = true;
		Rect from = new Rect(CreateRect());
		from.height = 0;
		from.y = 475;
		rect = from;		
		Rect to = new Rect(CreateRect());
		UIObject uiobject = this;
		float s = 0.0f;
		float v = 5.8f;
		float a = -2.35f;
		lineIn = LineAnimate(lineIn,OnLineInFinish,from,to,uiobject,s,v,a);
	}
	protected virtual void LineOutAnimate()
	{
		Rect to = new Rect(CreateRect());
		to.height = 0;
		to.y = 455;
		Rect from = new Rect(CreateRect());
		UIObject uiobject = this;
		float s = 0.0f;
		float v = 5.8f;
		float a = -2.35f;
		lineOut2 = LineAnimate(lineOut2,OnLineOutFinish,from,to,uiobject,s,v,a);
	}
	
	
	protected virtual void OnOutFinish()
	{
		visible = false;
		if(OnLineOutFinish != null)
			OnLineOutFinish();
	}
	protected virtual void OnInFinish()
	{
		if(OnLineInFinish != null)
			OnLineInFinish();
		time = 0.0f;
	}

	protected virtual void WorldMapLineInAnimate()
	{
		visible = true;
		Rect from = new Rect(0,0.4f*Screen.height,Screen.width,0.2f*Screen.height);
		from.height = 0;
		from.y = 475;
		rect = from;		
		var to = new Rect(0,0.4f*Screen.height,Screen.width,0.2f*Screen.height);
		UIObject uiobject = this;
		float s = 0.0f;
		float v = 5.8f;
		float a = -2.35f;
		lineIn = LineAnimate(lineIn,OnLineInFinish,from,to,uiobject,s,v,a);
	}

	protected virtual LineGUIAnimation LineAnimate(LineGUIAnimation line,Action finish,Rect from,Rect to,UIObject uiobject,float s,float v,float a)
	{
		line = GUIAnimationManager.Instance().CreateLineAnimation(finish,from,to,uiobject);
		line.SetDefault(true);
		line.From = from;
		line.To = to;
		line.TheObject = uiobject;
		GUIAnimationManager.Instance().Start(line,s,v,a);
		return line;
	}
	public Action OnLineInFinish;
	public Action OnLineOutFinish;
	
}
