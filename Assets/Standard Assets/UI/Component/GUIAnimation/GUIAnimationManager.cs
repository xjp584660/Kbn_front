using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

public class GUIAnimationManager
{
	private static GUIAnimationManager sInstance = null;
	private GUIAnimationManager() {}
	
	public static GUIAnimationManager Instance()
	{
		if (null == sInstance)
		{
			sInstance = new GUIAnimationManager();
			sInstance.Init();
		}
		
		return sInstance;
	}
	
	private List<IGUIAnimation> animations = new List<IGUIAnimation>();
	private List<IGUIAnimation> readyToDelete = new List<IGUIAnimation>();
	private Dictionary<IGUIAnimation,Action> finishes = new Dictionary<IGUIAnimation,Action>();
	
	// LiHaojie 2013.08.20: Add MonoBehaviour component
	private List<IAnimation> animsByComponent = null;
	private List<IAnimation> tmpRemoveList = null;

	private void Init()
	{
		animsByComponent = new List<IAnimation>();
		tmpRemoveList = new List<IAnimation>(); 
	}
	
	public void AddAnimByComponent(IAnimation anim)
	{
		if (!animsByComponent.Contains(anim))
			animsByComponent.Add(anim);
	}
	
	public void RemoveAnimByComponent(IAnimation anim)
	{
		tmpRemoveList.Add(anim);
	}
	
	private void Add(IGUIAnimation animation)
	{
		if( animation != null && !animations.Contains(animation))
			animations.Add(animation);
	}
	private void Remove(IGUIAnimation animation)
	{
		if( animation != null && animations.Contains(animation))
			readyToDelete.Add(animation);
	} 
	
	
	public void Update()
	{
		for(int k = 0;k<animations.Count;k++)
		{
			if(animations[k] != null)
				animations[k].Update();
		}
		if(readyToDelete != null && readyToDelete.Count > 0)
		{
			foreach(IGUIAnimation animation in readyToDelete)
			{
				animations.Remove(animation);
			}
			readyToDelete.Clear();
		}
		
		// LiHaojie 2013.08.20: Add MonoBehaviour component
		for (int i = 0; i < animsByComponent.Count; i++)
		{
			animsByComponent[i].Update();
		}
		
		for (int j = 0; j < tmpRemoveList.Count; j++)
		{
			animsByComponent.Remove(tmpRemoveList[j]);
		}
		tmpRemoveList.Clear();
	}	
	
	private void OnAnimationFinish(IGUIAnimation animation)
	{ 
		if( finishes.ContainsKey(animation) )
		{
			if(finishes[animation] != null)
			{
				Action func = finishes[animation];
				func();
			}
		}
		Remove(animation);
		animation.Enable = false;
	}
	
	public LineGUIAnimation CreateLineAnimation(Action OnFinish,Rect from,Rect to,UIObject uiobject,float s,float v,float a)
	{ 
		LineGUIAnimation lineAnimation = CreateLineAnimation(OnFinish,from,to,uiobject);
		lineAnimation.SetDefault(true);
		Start(lineAnimation,s,v,a); 
		return lineAnimation;
	} 
	public LineGUIAnimation CreateLineAnimation(Action OnFinish,Rect from,Rect to,UIObject uiobject)
	{
		LineGUIAnimation lineAnimation = new LineGUIAnimation();
		Add(lineAnimation);
		lineAnimation.OnFinish = OnAnimationFinish;
		lineAnimation.From = from;
		lineAnimation.To = to;
		lineAnimation.TheObject = uiobject;
		lineAnimation.Enable = false;
		lineAnimation.Init();
		
		finishes[lineAnimation] = OnFinish; 
		return lineAnimation;
	}
	
	public FadeGUIAnimation CreateFadeAnimation(Action OnFinish,UIObject uiobject)
	{
		FadeGUIAnimation fadeAnimation = new FadeGUIAnimation();
		Add(fadeAnimation);
		fadeAnimation.Enable = false;
		fadeAnimation.TheObject = uiobject;
		if(uiobject != null)
			uiobject.alphaEnable = true;
		fadeAnimation.OnFinish = OnAnimationFinish;
		fadeAnimation.Init();
		
		finishes[fadeAnimation] = OnFinish;
		return fadeAnimation;
	}
	
	public void Start(IGUIAnimation animation,float s,float v,float a)
	{
		animation.Enable = true;
		Add(animation);
		animation.Start(s,v,a);
	}
	
	
	
	
}