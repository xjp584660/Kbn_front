
using System.Collections.Generic;
using UnityEngine;

public class IScreenplay
{
	public UIObject myObject;
	protected State mState = State.None;
	public System.Action OnFinish = null;
	public System.Action OnWillFinish = null;
	public System.Action<IScreenplay> OnBegin;
	public System.Action<IScreenplay> OnPlayFinish;
	
	public class MoveData
	{
		public float V = 0.0f;
		public float A = 0.0f;
		public float S = 0.0f;
		public float deltaS = 0.0f;
	}
	
	public MoveData data = new MoveData();
	
	public virtual void Init()
	{
		
	}

	public virtual void Begin(float s,float v,float a)
	{
		data.S = s;
		data.V = v;
		data.A = a;

		ReSet();
		if(OnBegin != null)
			OnBegin(this);
	}
	public void ReSet()
	{
		this.mState = State.Start;
		data.deltaS = 0.0f;		
	}
	public void Stop()
	{
		if(OnFinish != null)
			OnFinish();
		if(OnPlayFinish != null)
			OnPlayFinish(this);		
		ReSet();	
	}
	
	public enum State
	{
		Start = 1,
		Acc = 2,
		Des = 3,
		Finish = 4,
		Idle = 5,
		None = 6
	}
	
	protected virtual void UpdateData()
	{
		data.V += data.A * Time.deltaTime;
		data.deltaS = data.V * Time.deltaTime;
		data.S += data.deltaS;
	}
	
	
	
	protected void UpdateState()
	{	
		UpdateData();
		
		if(mState == State.Start)
		{
			UpdateStart();
		}
		else if(mState == State.Finish)
		{
			UpdateFinish();
		}
		else if(mState == State.Acc)
		{
			UpdateAcc();
		}
		else if(mState == State.Des)
		{
			UpdateDes();
		}
		else if(mState == State.Idle)
		{
			UpdateIdle();
		}
		else
		{
			UpdateNone();
		}

	}
	
	public virtual void Update()
	{
		UpdateState();
	}

	
	protected virtual bool IsValid()
	{
		if(data == null) return false;
		
		
		return true;
	}
	
	public void SetState(State state)
	{	
		this.mState = state;
		
	}	
	public virtual State GetState()
	{
		return this.mState;
	}
	
	protected Dictionary<string,object> values = new Dictionary<string,object>();
	public virtual void SetValue(string name, object o)
	{	
		values[name] = o;
	}	
	public object GetValue(string name)
	{	
		if(values.ContainsKey(name))
			return values[name];
		else
			return null;
	}	
		
	protected virtual void UpdateStart()
	{
		SetState(State.Acc);
	}
	
	protected virtual void UpdateAcc()
	{
		SetState(State.Idle);
	}
	
	protected virtual void UpdateIdle()
	{
		SetState(State.Des);
	}
	
	
	protected virtual void UpdateDes()
	{
		if(OnWillFinish != null)
			OnWillFinish();
		SetState(State.Finish);
	}
	
	protected virtual void UpdateFinish()
	{
		SetState(State.None);
		if(OnFinish != null)
			OnFinish();
		if(OnPlayFinish != null)
			OnPlayFinish(this);
	}
	
	
	protected virtual void UpdateNone()
	{
		
	}
	
	
	
}
