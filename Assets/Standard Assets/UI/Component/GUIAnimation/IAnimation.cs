using UnityEngine;
using System;
using System.Collections.Generic;

public class IAnimation : MonoBehaviour
{
	public bool isLoop = false;
	
	protected bool isFinish = false;
	protected Action OnFinishDel;
	
	public virtual void PlayAnim(bool isLoop, Action endDel)
	{
		this.isLoop = isLoop;
		this.isFinish = false;
		this.OnFinishDel = endDel;
		
		GUIAnimationManager.Instance().AddAnimByComponent(this);
	}
	
	public virtual void StopAnim(bool destroy)
	{
		OnFinish();
		
		if (destroy) 
		{
			DestroyThis();
		}
	}
	
	protected void OnFinish()
	{
		isFinish = true;
		if (null != this.OnFinishDel)
			this.OnFinishDel();
			
		GUIAnimationManager.Instance().RemoveAnimByComponent(this);
	}
	
	protected void DestroyThis()
	{
		if (Application.isEditor)
			UnityEngine.Object.DestroyImmediate(this, true);
		else
			UnityEngine.Object.Destroy(this, 0.0f);	
	}
	
	public virtual void Update()
	{
	}
}