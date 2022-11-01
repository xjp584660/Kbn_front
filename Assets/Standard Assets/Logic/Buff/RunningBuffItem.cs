using KBN;
using KBN.DataTable;
using System;
using System.Collections.Generic;

public class RunningBuffItem{
	
	private Buff _buffEntity;
	private BuffSubtarget _subtarget;
	
	public int Id{
		get;
		set;
	}
	
	public long Eta{
		get;
		set;
	}
	
	public BuffSource  Src{
		get;
		set;
	}
	
	public BuffScene Scene{
		get{
			return (BuffScene) Enum.Parse( typeof( BuffScene), _buffEntity.SCENE.ToString());
		}
	}
	
	public BuffTarget Target{
		get{
			return (BuffTarget) Enum.Parse( typeof( BuffTarget), _buffEntity.TARGET.ToString() );
		}
	}
	
	public BuffSubtarget Subtarget{
		get{
			return _subtarget ?? ( _subtarget = new BuffSubtarget( _buffEntity.SUB_TARGET ) );
		}
	}

	public int	Value{
		get{
			return _buffEntity.VALUE;
		}
	}

	public BuffValueType ValueType{
		get{
			return (BuffValueType)Enum.Parse(typeof( BuffValueType), _buffEntity.VALUE_TYPE.ToString() );
		}
	}

	public BuffScope Scope{
		get{
			return ( BuffScope ) Enum.Parse( typeof( BuffScope ), _buffEntity.SCOPE.ToString() );
		}
	}
	
	public RunningBuffItem( int buffId, long eta, BuffSource buffSrc ){
		Id = buffId;
		Eta = eta;
		Src = buffSrc;
		
		GDS_Buff buffGds = GameMain.GdsManager.GetGds<GDS_Buff>();
		_buffEntity = buffGds.GetItemById( Id );

		if( _buffEntity == null ){
			throw new Exception( "Buff not in Gds. buffId:" + Id );
		}
	}
	
	public long LeftTime(){
		if( Eta <= 0 )
			return long.MaxValue;
		
		long lt = Eta - GameMain.unixtime();
		return lt < 0 ? 0 : lt;
	}
}
