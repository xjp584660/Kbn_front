
using KBN;
using System;

public class BuffSubtarget : IEquatable<BuffSubtarget> {

	private readonly BuffSubtargetType _subtargetType;
	private readonly int _subtargetId;

	public BuffSubtargetType Type
	{
		get
		{
			return _subtargetType;
		}
	}

	public int Id
	{
		get
		{
			return _subtargetId;
		}
	}

	public BuffSubtarget( BuffSubtargetType type, int id )
	{
		_subtargetType = type;
		_subtargetId = id;
	}

	public BuffSubtarget( string subtarget )
	{
		string[] parts = subtarget.Split('_' );

		_subtargetType = ( BuffSubtargetType ) Enum.Parse( typeof( BuffSubtargetType ), parts[0] );
		_subtargetId = _Global.INT32( parts[1] );
	}


	public bool Equals( BuffSubtarget other )
	{
		if( other == null )
			return false;

		return this.Type == other.Type && this.Id == other.Id;
	}

	public override bool Equals( object other )
	{
		return Equals( other as BuffSubtarget );
	}

	public override int GetHashCode()
	{
		return ToString().GetHashCode();
	}

	public static bool operator == ( BuffSubtarget t1, BuffSubtarget t2 )
	{
		if( (object)t1 == null || (object)t2 == null )
		{
			return object.Equals( (object)t1, (object)t2 );
		}

		return t1.Equals( t2 );
	}

	public static bool operator != ( BuffSubtarget t1, BuffSubtarget t2 )
	{
		return !(t1 == t2);
	}

	public string ToString()
	{
		return string.Format( "{0}_{1}", (int)_subtargetType, _subtargetId );
	}
}
