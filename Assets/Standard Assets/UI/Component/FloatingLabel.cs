using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;



public class FloatingLabel : Label
{
	LineGUIAnimation line = null;
	FadeGUIAnimation fade = null;
	Rect backRect;
	
	public Action<FloatingLabel> OnFinish;
	
	public void Init()
	{
		base.Init();
		SetVisible(false);	
		line = null;
		fade = null;
	}

	public Rect BackRect
	{
		set
		{
			backRect = value;
		}

	}



	protected void LineAnimate()
	{
		Rect to = new Rect(rect);
		to.y -= 100;
		Rect from = new Rect(rect);
		float s = 0.0f;
		float v = 1.8f;
		float a = -1.35f;
		LineAnimate(OnLineFinish,from,to,s,v,a);
	}
	private bool isLineFinish;
	private bool isFadeFinish;
	private void OnLineFinish()
	{
		isLineFinish = true;
		if(isFadeFinish)
		{
			if(OnFinish != null)
				OnFinish(this); 
			SetVisible(false);	
		}
	}
	private void OnFadeFinish()
	{
		isFadeFinish = true;
		if(isLineFinish)
		{
			if(OnFinish != null)
				OnFinish(this);
			SetVisible(false);	
		}		
	}
	
	
	protected IGUIAnimation LineAnimate(System.Action finish,Rect from,Rect to,float s,float v,float a)
	{
		line = GUIAnimationManager.Instance().CreateLineAnimation(finish,from,to,this);
		line.SetDefault(true);
		line.From = from;
		line.To = to; 
		line.TheObject = this;
		GUIAnimationManager.Instance().Start(line,s,v,a);
		return line;
	}
	
	protected IGUIAnimation FadeAnimate(System.Action finish,float s,float v,float a)
	{
		fade = GUIAnimationManager.Instance().CreateFadeAnimation(finish,this);
		fade.SetDefault(true);
		fade.TheObject = this;
		GUIAnimationManager.Instance().Start(fade,s,v,a);
		
		return fade;
		
	}
	protected void FadeAnimate()
	{
		float s = 0.0f;
		float v = 1.8f;
		float a = -1.35f;

		FadeAnimate(OnFadeFinish,s,v,a);
	}
	
	public void Begin()
	{
		Reset();
		LineAnimate();
		FadeAnimate();
		isLineFinish = false;
		isFadeFinish = false;
		SetVisible(true);
	}
	
	public void Reset()
	{
		rect = backRect;
		this.alpha = 1.0f;
	}
	
	
}
