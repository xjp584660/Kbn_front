using KBN;
using System.Collections.Generic;
using System;

public class RunningBuffs {

	private List<RunningBuffItem> _runningBuffs = new List<RunningBuffItem>();

	public RunningBuffItem this[int i]{
		get{
			if(i>=_runningBuffs.Count)
				return null;
			return _runningBuffs[i];
		}
		set{
			if(i>=_runningBuffs.Count)
				return;
			_runningBuffs[i] = value;
		}
	}

	public int Count {
		get{
			return _runningBuffs.Count;
		}
	}

	public void Add( RunningBuffItem item ){
		_runningBuffs.Add( item );
	}

	public void Remove( RunningBuffItem item ){
		_runningBuffs.Remove(item);
	}

	public void Clear(){
		_runningBuffs.Clear();
	}

	public long GetRunningBuffEndTimeBy( int buffId, BuffSource src )
	{
		long ret = 0;

		foreach( var runningBuff in _runningBuffs ){

			if( runningBuff.Id == buffId &&
			   runningBuff.Src == src ){

				ret = runningBuff.Eta;
				break;
			}
		}

		return ret;
	}


	public List<RunningBuffItem> GetRunningBuffsBy(BuffScene scene, BuffTarget target, BuffSubtarget subTarget){
		
		List<RunningBuffItem> ret = new List<RunningBuffItem>();

		foreach( var runningBuff in _runningBuffs ){
			
			if( runningBuff.LeftTime() <= 0 )
				continue;
			
			if( runningBuff.Scene == scene &&
			   runningBuff.Target == target &&
			   runningBuff.Subtarget == subTarget ){
				ret.Add( runningBuff );
			}
		}
		
		return ret;
	}

	public List<RunningBuffItem> GetRunningBuffsBy(BuffScene scene, BuffTarget target, BuffSubtarget subTarget, BuffSource source ){
		
		List<RunningBuffItem> ret = new List<RunningBuffItem>();
		
		foreach( var runningBuff in _runningBuffs ){
			
			if( runningBuff.LeftTime() <= 0 )
				continue;
			
			if( runningBuff.Scene == scene &&
			   runningBuff.Target == target &&
			   runningBuff.Subtarget == subTarget &&
			   runningBuff.Src == source ){
				ret.Add( runningBuff );
			}
		}
		
		return ret;
	}

	public BuffValue GetRunningBuffsValueBy(BuffScene scene, BuffTarget target, BuffSubtarget subTarget){

		BuffValue ret = new BuffValue();
		
		foreach( var runningBuff in _runningBuffs ){
			
			if( runningBuff.LeftTime() <= 0 )
				continue;

			if( runningBuff.Scene == scene &&
			   runningBuff.Target == target &&
			   runningBuff.Subtarget == subTarget){
			
				if( runningBuff.ValueType == BuffValueType.Percent ){
					ret.Percentage += runningBuff.Value/100f;
				}else {
					ret.Number += runningBuff.Value;
				}

				if (ret.Eta == 0 || runningBuff.Eta < ret.Eta)
					ret.Eta = runningBuff.Eta;
			}
		}
		
		return ret;

	}

	public BuffValue GetRunningBuffsValueBy(BuffScene scene, BuffTarget target, BuffSubtarget subTarget, BuffSource source){
		
		BuffValue ret = new BuffValue();
		
		foreach( var runningBuff in _runningBuffs ){
			
			if( runningBuff.LeftTime() <= 0 )
				continue;
			
			if( runningBuff.Scene == scene &&
			   runningBuff.Target == target &&
			   runningBuff.Subtarget == subTarget &&
			   runningBuff.Src == source ){

				if( runningBuff.ValueType == BuffValueType.Percent ){
					ret.Percentage += runningBuff.Value/100f;
				}else {
					ret.Number += runningBuff.Value;
				}
				
				if (ret.Eta == 0 || runningBuff.Eta < ret.Eta)
					ret.Eta = runningBuff.Eta;
			}
		}
		
		return ret;
	}

	public BuffValue GetRunningBuffsValueBy(BuffScene scene, BuffTarget target, BuffSubtarget subTarget, BuffScope scope){
		
		BuffValue ret = new BuffValue();
		
		foreach( var runningBuff in _runningBuffs ){
			
			if( runningBuff.LeftTime() <= 0 )
				continue;
			
			if( runningBuff.Scene == scene &&
			   runningBuff.Target == target &&
			   runningBuff.Subtarget == subTarget &&
			   runningBuff.Scope == scope ){
				
				if( runningBuff.ValueType == BuffValueType.Percent ){
					ret.Percentage += runningBuff.Value/100f;
				}else {
					ret.Number += runningBuff.Value;
				}
				
				if (ret.Eta == 0 || runningBuff.Eta < ret.Eta)
					ret.Eta = runningBuff.Eta;
			}
		}
		
		return ret;
	}

	public void AddTimeToRunningBuff( int buffId, BuffSource source, long time )
	{
		foreach( var runningBuff in _runningBuffs ){
			
			if( runningBuff.Id == buffId &&
			   runningBuff.Src == source ){
				
				runningBuff.Eta += time;
				return;
			}
		}
		
		RunningBuffItem item = new RunningBuffItem( buffId, GameMain.unixtime() + time, source );
		Add ( item );
	}

	public void Sort()
	{
		_runningBuffs.Sort(CompareFunc);
	}

	private int CompareFunc(RunningBuffItem x, RunningBuffItem y)
	{
		if (x == null)
		{
			if (y == null)
			{
				return 0;
			}
			else
			{
				return -1;
			}
		}
		else
		{
			if (y == null)
			{
				return 1;
			}
			else
			{
				if(x.Id == y.Id)
					return 0;
				if(x.Id > y.Id)
					return 1;
				if(x.Id < y.Id)
					return -1;
			}
		}
		return 0;
	}
}
