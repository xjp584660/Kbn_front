
using KBN;

public class Knight : IParser
{
	private static int gm_starStartLevel = 0;
	private Arm[] mArms;
	
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	private int cityId;
	private long energyReplenishmentTickerUT;
	private int experience;
	
	private int knightEnergy;
	private int knightFbuid;
	private int knightId;
	
	private int knightLevel;
	private int knightLordUserId;
	private int knightMaxEnergy;
	
	private string knightName;
	private int knightStatus;
	private string loginYMD;
	private int knightLocked;
	private int loyalty;
	//not synchorouns
	private System.DateTime loyaltyTimestamp;
	private string pic_square;
	private int playerLevel;
	
	private int salaryTickerUT;
	private string updateYMD;
	public bool isMyKnight = true;
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//constuctor
	public Knight()
	{		
		mArms = new Arm[Constant.Gear.ArmPositionNumber];
	}
	
	public static void SetStarStartLevel(int lv)
	{
		gm_starStartLevel = lv;
	}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//arms
	public Arm GetArm(int position)
	{
		return mArms[position - 1];
	}
	public Arm[] Arms
	{
		get
		{
			return mArms;
		}
	}
	
	public void PutArm(Arm arm)
	{
		if(arm == null) return;
		if(arm.Category - 1 < 0 || arm.Category - 1 >= Constant.Gear.ArmPositionNumber) return;
		mArms[arm.Category - 1] = arm;
	}
	
	public void RemoveArm(Arm arm)
	{
		if(arm == null) return;
		mArms[arm.Category - 1] = null;
	}

	public bool IsArmed(int position)
	{
		return mArms[position - 1] != null;
	}
	
	public void RemoveArm(int position)
	{
		Arm arm = mArms[position - 1];
		RemoveArm(arm);
	}
	public bool IsIDValid()
	{
		return knightId > 0;
	}
	public int KnightID
	{
		get
		{
			return knightId;
		}
		set
		{
			knightId = value;
		}
	}

	public string Name
	{
		get
		{
			return knightName;
		}
		set
		{
			knightName = value;
		}
	}
	
	public int CityID
	{
		get
		{
			return cityId;
		}
		set
		{
			cityId = value;
		}
	}
	public string AvatarImage
	{
		get
		{
			return pic_square;
		}
	}
	
	public int Level
	{
		get
		{
			return knightLevel;
		}
		set
		{
			knightLevel = value;
		}
	}

	public int Locked
	{
		get
		{
			return knightLocked;
		}
		set
		{
			knightLocked = value;
		}
	}
	
	public bool IsArmChanged()
	{
		for(int i = 0;i < mArms.Length; i ++)
		{
			if(mArms[i] == null) continue;
			if(mArms[i].IsArmChanged()) return true;
		}
		return false;
	}
	public void SynLocked()	
	{
		SetSeedValue("knightLocked",knightLocked);
	}

	public string ShowerLevel
	{
		get
		{
			return GetShowerLevel(knightLevel);
		}
	}

	public bool IsHaveStar
	{
		get
		{
			return IsStarLevel(knightLevel);
		}
	}

	public static bool IsStarLevel(int lev)
	{
		return gm_starStartLevel > 0 && lev - gm_starStartLevel >= 0;
	}
	
	public static string GetShowerLevel(int lev)
	{
		if ( !IsStarLevel(lev) )
			return lev.ToString();
		string ret = Datas.singleton.GetStarKnightLevel(lev);
		if ( ret == null )
			return (lev - gm_starStartLevel + 1).ToString();
		return ret;
	}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	//IParser
	public override bool Parse()
	{
		if(mSeed == null) return false;

		cityId = _Global.INT32(mSeed["cityId"]);
		energyReplenishmentTickerUT = _Global.INT64(mSeed["energyReplenishmentTickerUT"]);
		experience = _Global.INT32(mSeed["experience"]);
		
		knightEnergy = _Global.INT32(mSeed["knightEnergy"]);
		knightFbuid = _Global.INT32(mSeed["knightFbuid"]);
		knightId = _Global.INT32(mSeed["knightId"]);
		
		knightLevel = _Global.INT32(mSeed["knightLevel"]);

		knightLordUserId = _Global.INT32(mSeed["knightLordUserid"]);
		knightMaxEnergy = _Global.INT32(mSeed["knightMaxEnergy"]);

		knightName = _Global.ToString(mSeed["knightName"]);
		knightStatus = _Global.INT32(mSeed["knightStatus"]);
		loginYMD = _Global.ToString(mSeed["loginYMD"]);
		
		loyalty = _Global.INT32(mSeed["loyalty"]);
		pic_square = _Global.ToString(mSeed["pic_square"]);
		playerLevel = _Global.INT32(mSeed["playerLevel"]);
		
		salaryTickerUT = _Global.INT32(mSeed["salaryTickerUT"]);
		updateYMD = _Global.ToString(mSeed["updateYMD"]);
		knightLocked = _Global.INT32(mSeed["knightLocked"]);
		
		return true;			
	}
	
	public override bool SynSeed()
	{
		if(!IsParseValid()) return false;
		
		SetSeedValue("cityId",cityId);		
		SetSeedValue("energyReplenishmentTickerUT",energyReplenishmentTickerUT);	
		SetSeedValue("experience",experience);	
		
		SetSeedValue("knightEnergy",knightEnergy);		
		SetSeedValue("knightFbuid",knightFbuid);	
		SetSeedValue("knightId",knightId);	
		
		SetSeedValue("knightLevel",knightLevel);		
		SetSeedValue("knightLordUserid",knightLordUserId);	
		SetSeedValue("knightMaxEnergy",knightMaxEnergy);	
	
		SetSeedValue("knightName",knightName);		
		SetSeedValue("knightStatus",knightStatus);	
		SetSeedValue("loginYMD",loginYMD);	
		
		SetSeedValue("loyalty",loyalty);		
		SetSeedValue("pic_square",pic_square);	
		SetSeedValue("playerLevel",playerLevel);
		
		SetSeedValue("salaryTickerUT",salaryTickerUT);	
		SetSeedValue("updateYMD",updateYMD);								
		SetSeedValue("knightLocked",knightLocked);								
		
		return true;
	}
	public override bool IsChanged()
	{ 
		if(!IsParseValid()) return false;

		if(IsChanged("cityId",cityId)) return true;
		if(IsChanged("energyReplenishmentTickerUT",energyReplenishmentTickerUT)) return true;
		if(IsChanged("experience",experience)) return true;
		
		if(IsChanged("knightEnergy",knightEnergy)) return true;
		if(IsChanged("knightFbuid",knightFbuid)) return true;
		if(IsChanged("knightId",knightId)) return true;
		
		if(IsChanged("knightLevel",knightLevel)) return true;
		if(IsChanged("knightLordUserid",knightLordUserId)) return true;
		if(IsChanged("knightMaxEnergy",knightMaxEnergy)) return true;
	
		if(IsChanged("knightName",knightName)) return true;
		if(IsChanged("knightStatus",knightStatus)) return true;
		if(IsChanged("loginYMD",loginYMD)) return true;
		
		if(IsChanged("loyalty",loyalty)) return true;
		if(IsChanged("pic_square",pic_square)) return true;
		if(IsChanged("playerLevel",playerLevel)) return true;
		
		if(IsChanged("salaryTickerUT",salaryTickerUT)) return true;
		if(IsChanged("updateYMD",updateYMD)) return true;
		if(IsChanged("knightLocked",knightLocked)) return true;
		
		return false;
	}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
				
}
