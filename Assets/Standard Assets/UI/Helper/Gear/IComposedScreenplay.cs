
using System.Collections.Generic;
using UnityEngine;

public class IComposedScreenplay : IScreenplay
{
	List<IScreenplay> screenplays;
	Dictionary<IScreenplay, System.Action<IScreenplay> > finishes;
	int current;
	float[] s;
	float[] v;
	float[] a;
	
	
	public IComposedScreenplay(UIObject tempObject)
	{
		current = -1;
		myObject = tempObject;
		screenplays = new List<IScreenplay>();
		finishes = new Dictionary<IScreenplay, System.Action<IScreenplay>>();
	}
	
	public void Add(IScreenplay screenplay)
	{
		if(screenplay == null) return;
		
		screenplays.Add(screenplay);
		finishes[screenplay] = screenplay.OnPlayFinish;
		screenplay.OnPlayFinish = OnSingleFinish;
		
	}	
	public int Count
	{
		get
		{
			if(screenplays == null) return 0;
			return screenplays.Count;
		}
	}
	
	public void Clear()
	{
		screenplays.Clear();
		finishes.Clear();
	}
	
	public override void Update()
	{
		if(current < 0) return;
		if(current >= screenplays.Count) return;
		if(screenplays[current] == null) return;
		
		screenplays[current].Update();
		
	}
	private float sd;
	private float vd;
	private float ad;
	
	public override void Begin(float s,float v,float a)
	{
		this.sd = s;
		this.vd = v;
		this.ad = a;
		current = 0;
		if(current < 0 || current >= screenplays.Count) return;
		screenplays[current].Begin(sd,vd,ad);
		data = screenplays[current].data;
		this.s = null;
		this.v = null;
		this.a = null;
		if(OnBegin != null)
			OnBegin(this);
		
	}
	public void Begin(float[] s,float[] v,float[] a)
	{
		if(s == null) return;
		if(v == null) return;
		if(a == null) return;
		
		current = 0;
		this.s = s;
		this.v = v;
		this.a = a;
		if(current < 0 || current >= screenplays.Count) return;
		screenplays[current].Begin(s[current],v[current],a[current]);
		data = screenplays[current].data;
		if(OnBegin != null)
			OnBegin(this);
		
	}
	
	private void OnSingleFinish(IScreenplay screenplay)
	{
		
		if(screenplay != null && finishes.ContainsKey(screenplay))
		{
			
			if(finishes[screenplay] != null && OnSingleFinish != finishes[screenplay])
			{
				
				finishes[screenplay](screenplay);
				
			}
		}
		
		current++;
		if(current >= screenplays.Count)
		{
			
			if(this.OnPlayFinish != null) 
				this.OnPlayFinish(this);
			if(this.OnFinish != null)
				this.OnFinish();
			return;
		}
		
		if(current < 0) return;
		
		if(s != null && v != null && a != null)
			screenplays[current].Begin(s[current],v[current],a[current]);
		else
			screenplays[current].Begin(sd,vd,ad);
		
		data = screenplays[current].data;
	}
	public override State GetState()
	{
		if(current >= 0 && current < screenplays.Count && screenplays[current] != null)
			return this.mState;
		return State.None;
	}
	

	public void SetCurrentValue(string name, object o)
	{	
		if(current >= 0 && current < screenplays.Count && screenplays[current] != null)
			screenplays[current].SetValue(name,o);
		SetValue(name,o);
	}	
	public object GetCurrentValue(string name)
	{	
		if(current >= 0 && current < screenplays.Count && screenplays[current] != null)
			return screenplays[current].GetValue(name);
		return GetValue(name);
	}	
	
	
}
