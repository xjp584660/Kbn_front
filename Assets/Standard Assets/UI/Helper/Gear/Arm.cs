
using System.Collections.Generic;
using KBN;

public class Arm : IParser
{
	//---------------------------------------------------------------------------------------------------------
	public class ArmTag
	{
		public bool isRed = false;
	}
	//---------------------------------------------------------------------------------------------------------
	private int mPlayerGearID;
	private string mPic;
	private int mGearID;
	private int mRare;
	private int mArmType = Constant.ArmType.All;
//	private int mPosition;
	private int mAttack;
	private int mHp;
	private int mTroopLimit;
	private int mCurrentLevel;
	private int mExperence;
	private int mToExperence;
	private int mKnightID;
	private string knightName;
	private string knightRemark;
	private int cityId;
	private int mStatus;
	private int mIsLocked;
	private int mStarLevel;
	private int mTierLevel = 1;

	private string setid;
	private string threesetattribute;
	private string fivesetattribute;

	private Dictionary<int,ArmSkill> mArmSkills;
	
	public int belongFteId = -1;

	private bool isShowBase=false;


	private string remarkName;// Customname

	private int skillsRare;

	private int reqLevel;
 
	public bool ArmIsParseValid{
		get{
			return mIsParseValid;
		}
		set{
			mIsParseValid=value;
		}
	}


	private ArmTag tag;	
	public ArmTag Tag
	{
		get
		{
			return tag;
		}
	}
	
	//---------------------------------------------------------------------------------------------------------	
 	public Arm()
 	{
 		tag = new ArmTag();
 		mArmSkills = new Dictionary<int,ArmSkill>();
 	}
 	//---------------------------------------------------------------------------------------------------------
	public Dictionary<int,ArmSkill> Skills
 	{
		get
		{
	 		return mArmSkills;
	 	}
	 	set
	 	{
	 		mArmSkills = value;
	 	}
	}
 	
 	public int PlayerID
 	{
		get
		{
	 		return mPlayerGearID;
	 	}
	 	set
	 	{
	 		mPlayerGearID = value;
	 	}
	}

	public bool IsShowBase
	{
		get{
			return isShowBase;
		}
		set{
			isShowBase=value;
		}
	}

 	public bool IsValidCategory()
 	{
 		if(Category <= Constant.ArmType.Largetest && Category >= Constant.ArmType.Smallest) return true;
 		return false;
 	}
 	public string Picture
	{
		get
		{
			return mPic;

		}
		set
		{
			mPic = value;
		}
	}
	public int Rare
	{
		get
		{
			return mRare;

		}
		set
		{
			mRare = value;
		}
	}
 	public int GDSID
 	{
		get
		{
	 		return mGearID;
	 	}
	 	set
	 	{
	 		mGearID = value;
	 	}
	}
	public bool IsArmed
 	{
		get
		{
 			return mStatus == 1;
		}
 	}

	public int Status
	{
		set
		{
			mStatus = value;
		}
	}

	public int KnightID
	{
		get
		{
			return mKnightID;
		}
		set
		{
			mKnightID = value;
		}
	}
	public string KnightName
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
	public string KnightRemark
	{
		get
		{
			return knightRemark;
		}
		set
		{
			knightRemark = value;
		}
	}
	public int CityId
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
	
	public int StarLevel
	{
		get
		{
			return mStarLevel;
		}
		set
		{
			mStarLevel = value;
		}
	}

	public int Experence
	{
		get
		{
			return mExperence;
		}
		set
		{
			mExperence = value;
		}
	}
	public int ToExperence
	{
		get
		{
			return mToExperence;
		}
		set
		{
			mToExperence = value;
		}
	}

	public int Category
	{
		get
		{
			return mArmType;
		}
		set
		{
			mArmType = value;
		}
	}
	
	public int SkillLevel
	{
		get
		{
			return mCurrentLevel;
		}
		set
		{
			mCurrentLevel = value;
		}
	}
	
	public int Attack
	{
		get
		{
			return mAttack;
		}
		set
		{
			mAttack = value;

		}
	}
	public int HP
	{
		get
		{
			return mHp;
		}
		set
		{
			mHp = value;
		}
	} 
	public int TroopLimit
	{
		get
		{
			return mTroopLimit;
		}
		set
		{
			mTroopLimit = value;
		}
	}
	
	public Dictionary<int,ArmSkill> ArmSkills
	{
		get
		{
			return mArmSkills;
		}
	}
	
	public bool Locked
	{
		get
		{
			if (mIsLocked <= 0)
				return false;

			return true;
		}
		set
		{
			if (value)
				mIsLocked = 1;
			else
				mIsLocked = 0;
		}
	}
	
	public bool IsMaxLevel
	{
		get
		{
			int gearMaxLevelFromServer = GameMain.singleton.GetGearMaxLevelFromServer();
			int gearMaxLevelFromGDS = GameMain.GdsManager.GetGds<KBN.GDS_GearLevelUp>().GetArmMaxLevel(this.GDSID);
			int maxLevel = gearMaxLevelFromGDS <= gearMaxLevelFromServer ? gearMaxLevelFromGDS : gearMaxLevelFromServer;
			return this.SkillLevel == maxLevel;
		}
	}

	public int TierLevel
	{
		get
		{
			return mTierLevel;
		}
		set
		{
			mTierLevel = value;
		}
	}
	public string Setid
	{
		get
		{
			if(string.IsNullOrEmpty(setid)) setid= "0";
			return setid;
		}
		set
		{
			setid = value;
		}
	}
	public string Threesetattribute
	{
		get
		{
			return threesetattribute;
		}
		set
		{
			threesetattribute = value;
		}
	}
	public string Fivesetattribute
	{
		get
		{
			return fivesetattribute;
		}
		set
		{
			fivesetattribute = value;
		}
	}

	public string RemarkName
	{
		get
		{
			return remarkName;
		}
		set{
			remarkName = value;
		}
	}

	public int SkillsRare
	{
       get
		{
			return skillsRare;
		}
	}
    public int ReqLevel
	{
		get
		{
           return reqLevel;
		}
		set{
			reqLevel = value;
		}
	}

	//---------------------------------------------------------------------------------------------------------
	public void PutArm(int knightID)
	{
		if(this.mKnightID == knightID ) return;
		this.mKnightID = knightID;
		this.mStatus = 1;
	}
	public void RemoveArm(int knightID)
	{
		if(this.mKnightID != knightID ) return;
		this.mKnightID = -1;
		this.mStatus = 0;
		this.knightName="";
		this.cityId=0;
	}
	
	public bool IsArmChanged()
	{
		if(IsChanged("knight",mKnightID)) return true;
		if(IsChanged("status",mStatus))	return true;
		return false;
	}
	
	public void SyncArm()
	{
		if(!IsParseValid()) return;
		mKnightID = _Global.INT32(mSeed["knight"]);
		mStatus = _Global.INT32(mSeed["status"]);
	}

    public int GetArmReqLevel(int GDSID)
	{
        string req = GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetReq(GDSID);
		if(req == "") return 0;
		string[] strReqs = req.Split("*"[0]);
		
		string title = strReqs[0].Substring(0,1);


		if(title == "1")
		{
			int l = System.Convert.ToInt32(strReqs[0].Substring(2));
			return l;
		}

		return 0;
	}
	public string GetKightNameString(Label label){
		string str="";
		if (this.mKnightID>0)  //有穿戴 
		{
			if (cityId==0)
			{
				System.Action<HashObject> okFunc=delegate(HashObject callbackResult){
					if (callbackResult["des"]!=null)
					{
						string thisKnightName=callbackResult["des"]["knightName"].Value.ToString();
						int thisCityId=_Global.INT32(callbackResult["des"]["cityType"]);
						if (thisCityId!=0)
						{
							str= Datas.getArString("Gear.Wearer");
							string name=General.singleton.getKnightShowName(thisKnightName, thisCityId);
							str=string.Format(str,name,thisCityId.ToString());	

							knightName=thisKnightName;
							cityId=thisCityId;
						}
					}
					label.txt=str;
				};
				UnityNet.getKnightDes(this.mPlayerGearID,okFunc,null);
			}else
			{
				str= Datas.getArString("Gear.Wearer");
				string name=General.singleton.getKnightShowName(knightName, cityId);
				str=string.Format(str,name,cityId.ToString());
			}	
		}
		return str;
	}
	
	//---------------------------------------------------------------------------------------------------------	
	public override bool Parse()
	{
		if(mSeed == null) return false;
		if(mSeed["uid"] != null)
			mPlayerGearID = _Global.INT32(mSeed["uid"]);
		if(mSeed["p"] != null)
			mPic = _Global.ToString(mSeed["p"]);
		if(mSeed["gid"] != null)
			mGearID = _Global.INT32(mSeed["gid"]);
		if(mSeed["r"] != null)
			mRare = _Global.INT32(mSeed["r"]);
		if(mSeed["t"] != null)
			mArmType = _Global.INT32(mSeed["t"]);
		
		if(mSeed["at"] != null)
			mAttack = _Global.INT32(mSeed["at"]);
		if(mSeed["hp"] != null)
			mHp = _Global.INT32(mSeed["hp"]);
		if(mSeed["il"] != null)
			mIsLocked = _Global.INT32(mSeed["il"]);
		if(mSeed["ls"] != null)
			mStarLevel = _Global.INT32(mSeed["ls"]);
		if(mSeed["tr"] != null)
			mTroopLimit = _Global.INT32(mSeed["tr"]);
		if(mSeed["cl"] != null)
			mCurrentLevel = _Global.INT32(mSeed["cl"]);
		if(mSeed["ce"] != null)
			mExperence = _Global.INT32(mSeed["ce"]);
		if(mSeed["te"] != null)
			mToExperence = _Global.INT32(mSeed["te"]);
		if(mSeed["knight"] != null)
			mKnightID = _Global.INT32(mSeed["knight"]);
		if(mSeed["knightDetail"] != null){
			if (mSeed["knightDetail"]["knightId"] != null)
			{
				mKnightID = _Global.INT32(mSeed["knightDetail"]["knightId"]);
			}
			if (mSeed["knightDetail"]["knightName"] != null)
			{
				knightName = mSeed["knightDetail"]["knightName"].Value.ToString();
			}
			if (mSeed["knightDetail"]["knightRemark"] != null)
			{
				knightRemark = mSeed["knightDetail"]["knightRemark"].Value.ToString();
			}
			if (mSeed["knightDetail"]["cityType"] != null)
			{
				cityId = _Global.INT32(mSeed["knightDetail"]["cityType"]);
			}	
		}
			
		if(mSeed["status"] != null)
			mStatus = _Global.INT32(mSeed["status"]);
		if(mSeed["tier"] != null)
			mTierLevel = _Global.INT32(mSeed["tier"]);
		if(mSeed["setid"] != null)
			Setid = _Global.ToString(mSeed["setid"]);
		if(mSeed["threesetattribute"] != null)
			Threesetattribute = _Global.ToString(mSeed["threesetattribute"]);
		if(mSeed["fivesetattribute"] != null)
			Fivesetattribute = _Global.ToString(mSeed["fivesetattribute"]);
		if (mSeed ["remark"] != null)
			remarkName = mSeed ["remark"].Value.ToString ();
		object[] skills = null;
		if(mSeed["s"] != null)
			skills = _Global.GetObjectValues(mSeed["s"]);
		if(skills == null) return false;
		for(int i = 0;i< skills.Length;i++)
		{ 
			HashObject skillSeed = (HashObject)skills[i];
			ArmSkill skill = new ArmSkill();
			skill.Parse(skillSeed);
			skill.TheArm = this;
			//if(!skill.IsParseValid()) continue;
			mArmSkills[skill.Position] = skill;
			skillsRare += skill.Rare;
		}
        reqLevel = GetArmReqLevel(mGearID);
		return true;
	}
	
	public override bool SynSeed()
	{
		if(!IsParseValid()) return false;
		
		SetSeedValue("uid",mPlayerGearID);
		SetSeedValue("gid",mGearID);
		SetSeedValue("p",mPic);
		
		SetSeedValue("r",mRare);
		SetSeedValue("t",mArmType);
		

		SetSeedValue("at",mAttack);
		SetSeedValue("hp",mHp);
		SetSeedValue("il",mIsLocked);
		SetSeedValue("ls",mStarLevel);
		
		SetSeedValue("tr",mTroopLimit);
		SetSeedValue("cl",mCurrentLevel);
		SetSeedValue("ce",mExperence);
		
		SetSeedValue("te",mToExperence);
		SetSeedValue("knight",mKnightID);
		SetSeedValue("status",mStatus);
		SetSeedValue("tier",mTierLevel);

		SetSeedValue("setid", Setid);
		SetSeedValue("threesetattribute", Threesetattribute);
		SetSeedValue("fivesetattribute", Fivesetattribute);
		foreach (KeyValuePair<int,ArmSkill> pair in mArmSkills)
		{
			if(!pair.Value.SynSeed()) return false;
		}
		return true;
	}
	public override bool IsChanged()
	{ 
		if(!IsParseValid()) return false;
		
		if(IsChanged("gid",mGearID)) return true;
		if(IsChanged("r",mRare)) return true;
		if(IsChanged("t",mArmType))return true;
		if(IsChanged("ls",mStarLevel))return true;

		if(IsChanged("at",mAttack))return true;
		if(IsChanged("hp",mHp)) return true;
		if(IsChanged("il",mIsLocked)) return true;
		
		if(IsChanged("tr",mTroopLimit)) return true;
		if(IsChanged("cl",mCurrentLevel)) return true;
		if(IsChanged("ce",mExperence)) return true;
		
		if(IsChanged("knight",mKnightID)) return true;
		if(IsChanged("status",mStatus))	return true;
		if(IsChanged("tuier",mTierLevel))	return true;

		foreach(KeyValuePair<int,ArmSkill> pair in mArmSkills)
		{
			if(pair.Value.IsChanged()) return true;
		}

		return false;
	}
	//---------------------------------------------------------------------------------------------------------
	
}
