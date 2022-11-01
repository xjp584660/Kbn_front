
using KBN;

public class ArmSkill : IParser
{
	public int mID;
	public int mPosition;
	public int[] mTarget;
	public int mLevel;
	public int mExperence;
	public int mBuff;
	public int mStone;

	public int mRare;
	
	public IParser mParser;
	public Arm mArm;
	
	public Arm TheArm
	{
		get
		{
			return mArm;
		}
		set
		{
			mArm = value;
		}
	}

	public int Experence
	{
		get
		{
			return mExperence;
		}
	}
	
	public int ID
	{
		get
		{
			return mID;
		}
		set
		{
			mID = value;
		}
	}
	public int Position
	{
		get
		{
			return mPosition - 1;
		}
		set
		{
			mPosition = value + 1;
		}
	}
	public int BuffId
	{
		get
		{
			return mBuff;
		}
	}
	
	public int Rare
	{
        get
		{
			return mRare;
		}
	}
	public int Stone
	{
		get
		{
			return mStone;
		}
		set
		{
			mStone = value;
		}
	}
	
	public bool IsStoneChanged()
	{
		return (IsChanged("stone",mStone));
	}
	
	public void SyncStone()
	{
		if(mSeed == null) return;
		SetSeedValue("stone",mStone);
	}
	
	public override bool Parse()
	{
		if(mSeed == null) return false;
		if(mSeed["i"] != null)
			mID = _Global.INT32(mSeed["i"]);
		if(mSeed["p"] != null)
			mPosition = _Global.INT32(mSeed["p"]);
		if(mSeed["s"] != null)
			mStone = _Global.INT32(mSeed["s"]);
		 mRare = GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetRare(mID);
		
		return true;			
	}

	public void SetData(int id,int position,int stone){
		mID=id;
		mPosition=position;
		mStone=stone;
		mIsParseValid=true;
	}
	
	public override bool SynSeed()
	{
		if(mSeed == null) return false;
		SetSeedValue("i",mID);
		SetSeedValue("p",mPosition);
		SetSeedValue("s",mStone);
		return true;
	}
	
	public override bool IsChanged()
	{
		if(IsChanged("i",mID)) return true;
		if(IsChanged("p",mPosition)) return true;
		if(IsChanged("s",mStone)) return true;
		return false;
	}
}
