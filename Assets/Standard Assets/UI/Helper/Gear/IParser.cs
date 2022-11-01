

public class IParser
{
	
	protected bool mIsParseValid = false;
	protected HashObject mSeed;
	protected object mValue;
	
	
	public void Parse(HashObject seed)
	{
		mSeed = seed;
		mIsParseValid = Parse();
	}
	
	public bool IsParseValid()
	{
		return mIsParseValid;
	}

	public virtual bool Parse()
	{
		return false;
	}
	
	public HashObject Seed
	{
		set
		{
			mSeed = value;
		}
	}
	
	public virtual bool SynSeed()
	{
		return false;
	}
	
	public virtual bool IsChanged()
	{
		return false;
	}
	
	protected void SetSeedValue(string key, object v)
	{
		if(key == null) return;
		if(key == "") return;
		if(v == null) return;
		
		if(mSeed[key] != null)
		{	
			if(mSeed[key].Value != null)
				mSeed[key].Value = v;
		}
	}
	
	protected bool IsChanged(string key, object v)
	{
		if(key == null) return false;
		if(key == "") return false;
		if(v == null) return false;
		if(mSeed[key] == null) return false;
		if(mSeed[key].Value == null) return false;
		return !mSeed[key].Value.Equals(v);
	}
	
	
}
