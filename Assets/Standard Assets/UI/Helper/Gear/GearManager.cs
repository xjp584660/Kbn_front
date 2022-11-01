
using System.Collections.Generic;
using UnityEngine;
using KBN;

//it is also somewhat the Controller of MVC.
public class GearManager
{
	private static GearManager sInstance = new GearManager();
	private Weaponry mWeaponry = null;
	private Knights mKnights;
	
	 
	//knights should be initialized before weaponry. 
	//both of the knights and weaponry are initialized after getseed ok.
	
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	public static GearManager Instance()
	{
		return sInstance;
	}
	
	private GearManager()
	{
	}

	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	public Knight GetKnight( int knightID )
	{
		if(knightID < 0) return null;
		return mKnights.GetKnight(knightID);
	}


	//Weaponry
	private Weaponry CreateWeaponry()
	{
		if(mWeaponry == null) 
		{	
			mWeaponry = new Weaponry();
			mWeaponry.OnParsePutArm = OnParsePutArm;
			mWeaponry.OnParseRemoveArm = OnParseRemoveArm;
			mWeaponry.Capacity = GetStorageCount();
		}
		return mWeaponry;
	}
	
	public Weaponry GearWeaponry
	{
		get
		{
			return CreateWeaponry();
		}
	}
	
	private void OnParsePutArm(Arm arm,int knightID)
	{  
		if(arm == null) return;
		if(knightID < 0) return;
		Knight knight = mKnights.GetKnight(knightID); 
		if(knight == null) return;
		knight.PutArm(arm);
	}
	private void OnParseRemoveArm(Arm arm,int knightID)
	{
		if(arm == null) return;
		if(knightID < 0) return;
		Knight knight = mKnights.GetKnight(knightID); 
		if(knight == null) return;
		knight.RemoveArm(arm);
	}
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//knight
	
	public bool CanPutArm(Arm arm,Knight knight)
	{
		if(arm == null ) return false;
		if(knight == null) return false;
		
		string req = GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetReq(arm.GDSID);
		if(req == null) return true;
		if(req == "") return true;
		string[] strReqs = req.Split("*"[0]);
		
		string title = strReqs[0].Substring(0,1);
		if(title == "1")
		{
			int l = _Global.INT32(strReqs[0].Substring(2));
			return knight.Level >= l;
		}
		
		return false;
	}
	
	public int GetArmReqLevel(Arm arm)
	{
		return arm.ReqLevel;
	}
	
	
	private Knights CreateKnights()
	{
		if(mKnights == null)
		{
			mKnights = new Knights();
		}
		return mKnights;
	}
	
	public Knights GearKnights
	{
		get
		{
			return CreateKnights();
		}
	}
	
	
	public bool PutArm(Arm arm,int knightID)
	{
		return PutArm(arm,mKnights.GetKnight(knightID));
	}
	public bool PutArm(Arm arm,Knight knight)
	{
		if(arm == null) return false;
		if(knight == null) return false;
		
		knight.PutArm(arm);
		arm.PutArm(knight.KnightID);
		return true;
	}
	
	public void RemoveArm(Arm arm,int knightID)
	{
		RemoveArm(arm,mKnights.GetKnight(knightID));
	}
	
	private void RemoveArm(Arm arm,Knight knight)
	{
		if(arm == null) return;
		if(knight == null) return;
		
		knight.RemoveArm(arm);
		arm.RemoveArm(knight.KnightID);
	}
	
	public int GetKnightLevel(Knight knight)
	{
		return knight.Level;
	}
	
	public double GetShowKnightAttack(Knight knight)
	{
		return knight.Level + GetShowData(GetArmsAttack(knight.Arms));
	}
	
	public double GetShowData(double d)
	{
		return d * 200.0f;
	}
	
	public double GetArmsAttack(Arm[] arms)
	{
		double r = 0.0f;
		if(arms == null) return r;
		foreach(Arm arm in arms)
		{
			if(arm == null) continue;
			r += GetArmAttack(arm.GDSID,arm.StarLevel,arm.TierLevel);
		}
		return r;
	}
	public double GetArmsLife(Arm[] arms)
	{
		double r = 0;
		if(arms == null) return r;
		foreach(Arm arm in arms)
		{
			if(arm == null) continue;
			r += GetArmLife(arm.GDSID,arm.StarLevel,arm.TierLevel);
		}
		
		return r;
		
	}
	
	public Label SetImage(Label image,string name)
	{
		if(image == null) return image;
		
		image.tile = TextureMgr.instance().GetGearIcon(name);
		image.useTile = true;
		return image;
	}
	
	public Label SetImageNull(Label image)
	{
		if(image == null) return image;
		
		image.mystyle.normal.background = null;
		image.useTile = false;
		return image;
		
	}
	
	
	public double GetShowKnightLife(Knight knight)
	{
		return knight.Level + GetShowData(GetArmsLife(knight.Arms));
	}
	
	public int GetKnightTroop(Knight knight)
	{
		if(knight == null) return 0;
		if(knight.Arms == null) return 0;
		Dictionary<int,double>[] dics = GearReport.Instance().Calculate(knight.Arms);
		if(dics != null && dics[2] != null)
		{
			foreach(int a in dics[2].Values)
				return a;
		}
		return 0;
	}

	
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//mount
	public bool CanMount(Arm arm,ArmSkill skill,int stoneid)
	{
		if(IsReadyForMount(arm,skill))
			return IsMatchStone(skill.ID,stoneid);
		return false;
	}
	public bool IsMatchStone(int skillid,int stoneid)
	{
		return (GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetStoneData(skillid,stoneid) > 0);
	}
	public bool IsReadyForMount(Arm arm,ArmSkill skill)
	{
		if(arm.Skills[skill.Position] == null || skill == null) return false;
		if(arm.Skills[skill.Position].ID != skill.ID) return false;
		if(arm.StarLevel <= skill.Position) return false;
		return true;
	}
	public void SetAdditionText(StonePanel stone)
	{
		if(stone == null) return;
		bool isActive = stone.Active;
		if(isActive)
		{
			stone.addition.txt = Datas.getArString("Gear.EquipmentActiveDesc");
			//stone.addition.mystyle.normal.textColor = new Color(189.0f/255.0f,150.0f/255.0f,99.0f/255.0f,1.0f);
			stone.addition.normalTxtColor = FontColor.Description_Dark;
		}
		else
		{
			stone.addition.txt = Datas.getArString("Gear.EquipmentInactiveDesc");
			//stone.addition.mystyle.normal.textColor = new Color(7.0f/255.0f,105.0f/255.0f,205.0f/255.0f,1.0f);
			stone.addition.normalTxtColor = FontColor.Blue;
		}
		
	}

	
	public string GetCompareSkillData(Arm arm,ArmSkill skill,int stone)
	{
		var s = "";
		bool isPercent = GearManager.Instance().IsPercent(skill.ID);
		double d = GearManager.Instance().GetSkillPercentage(arm,skill,skill.Stone);
		double m = GearManager.Instance().GetSkillPercentage(arm,skill,stone);
		double k = m - d;
		bool f = k >= 0;
		if(isPercent)
		{
			s = ToPercentString( k );

		}
		else
		{
			s = k.ToString();
		}
		if(f) s = "+" + s;
		return s;
	}
	
	
	
	public string GetSkillData(Arm arm,ArmSkill skill,int stone)
	{
		var s = "";
		bool isPercent = GearManager.Instance().IsPercent(skill.ID);
		if(isPercent)
		{
			double d = GearManager.Instance().GetSkillPercentage(arm,skill,stone);
			s = ToPercentString( d );
		}
		else
		{
			s = GearManager.Instance().GetSkillPercentage(arm,skill,stone).ToString();
		}
		return s;
	}
	
	public string ToPercentString(double input)
	{
		return ( input / 10000.0f ).ToString("P1",System.Globalization.CultureInfo.InvariantCulture);
	}
	
	public string ToPercentString(int input)
	{
		double inp = input;
		return ( inp / 10000.0f ).ToString("P1",System.Globalization.CultureInfo.InvariantCulture);
	}
	public string FormatString(int input)
	{
		return ( input ).ToString("P1",System.Globalization.CultureInfo.InvariantCulture);
	}
	public string FormatString(double input)
	{
		double inp = input;
		return ( inp ).ToString("P1",System.Globalization.CultureInfo.InvariantCulture);		
	}
	public string GearFormatString(double input)
	{
		double inp = input;
		if (inp >= 10.00) 
			return Mathf.Round (_Global.FLOAT (inp * 100)).ToString () + "%";
		else 
		{
			int temp = _Global.INT32(inp * 1000);
			int x = temp / 10;
			int y = temp % 10;
			string X = (x).ToString ();
			string Y = y.ToString();
			string finalData = X + "." + Y;
			return finalData + "%";
		}
	}
	public string GetSkillData(Arm arm,ArmSkill skill)
	{
		return GetSkillData(arm,skill,skill.Stone);
	}
	
	public int GetStorageCount()
	{	
		int storageCount = 0;
		
		foreach (City city in CityQueue.instance().Cities)
		{
			int buildingLvl = MenuAccessor.GetBuildingMaxLevelForType(Constant.Building.BLACKSMITH, city.cityId);
			if (buildingLvl >= 0)
			{
				storageCount += GameMain.GdsManager.GetGds<GDS_Building>().getBuildingEffect(
																		Constant.Building.BLACKSMITH, buildingLvl, 
																		Constant.BuildingEffectType.EFFECT_TYPE_BLACK_SMITH_SLOT_COUNT);
			}
		}

		return storageCount;
	}
	
	public bool HasEnoughGearStorage()
	{
		var equipList = GearWeaponry.GetArms();
		int storageCount = GetStorageCount();
		
		return equipList.Count < storageCount;
	}
	
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//Utility
	
	public List<int> GetBaseSkills()
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetBaseSkills();
	}
	
	public string GetIconSkill(ArmSkill skill)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetIconSkill(skill.ID);
	}
	public string GetIconSkill(int skill)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetIconSkill(skill);
	}	
	public string GetArmDescription(Arm arm)
	{
		return Datas.getArString("gearDesc.g" + arm.GDSID);
	}
	public int GetArmType(Arm arm)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetType(arm.GDSID);
	}
	public string GetImageName(Arm arm)
	{
		//return "arm_" + arm.GDSID;
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetPic(arm.GDSID,arm.TierLevel);
		//return "";
	}
	public string GetIconName(Arm arm)
	{
		//return "arm_" + arm.GDSID;
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetIcon(arm.GDSID,arm.TierLevel);
	}
	public string GetBackgroundNameRed(Arm arm)
	{
		return "Equipment_bg_red";
	}
	public string GetBackgroundName(Arm arm)
	{
		return "Equipment_bg";
	}
	public string GetBackgroundActiveName(Arm arm)
	{
		return "Equipment_bg2";
	}
	public Texture2D GetGearFrameLabel(Arm arm)
	{
		if ( arm == null )
			return null;
		int colorIdx = GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetColorIndex(arm.GDSID,arm.TierLevel);
		Texture2D tex2D = TextureMgr.singleton.LoadTexture("Gear_circle_" + colorIdx.ToString(),TextureType.BUTTON);
		return tex2D;
	}
	public int GetArmSlotCount(Arm arm)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetSlotCount(arm.GDSID, arm.TierLevel);
	}
	public string GetSkillImageName(ArmSkill skill,bool isActive)
	{
		if(skill == null) return string.Empty;
		return GetSkillImageName(skill.ID, isActive);
	}
	public string GetSkillImageName(int skill,bool isActive)
	{
		if(skill < 0) return string.Empty;
		return GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetIconSkill(skill, isActive);
	}
	
	public string GetSkillLevelImage(ArmSkill skill,bool isActive)
	{
		if(skill == null) return string.Empty;
		return GetSkillLevelImage(skill.ID, isActive);
	} 
	public string GetSkillLevelImage(int skill,bool isActive)
	{
		if(skill < 0) return string.Empty;
		return GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetIconLevel(skill, isActive);
	}
	
	public string GetArmName(Arm arm)
	{
		if (arm == null)
			return null;
		if (string.IsNullOrEmpty(arm.RemarkName))
		{
			return Datas.getArString("gearName.g" + arm.GDSID);
		} else 
		{
			return arm.RemarkName;
		}
	}
	public string GetSkillTargetImage(ArmSkill skill,bool isActive)
	{
		if(skill == null) return string.Empty;
		return GetSkillTargetImage(skill.ID, isActive);
	} 
	public string GetSkillTargetImage(int skill,bool isActive)
	{
		if(skill < 0) return string.Empty;
		return GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetIconTarget(skill, isActive);
	}
	
	public int GetSkillType(Arm arm,ArmSkill skill)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetType(skill.ID);
	}
	
	public string GetSkillShowName(ArmSkill skill)
	{
		return "skill name";
	}
	
	public string GetSkillColorImageName(ArmSkill skill, bool isActive)
	{
		string name = GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetColor(skill.ID);
		if(isActive)
			return name;
		else
			return name + "_Dark";
	}
	
	public int GetSkillPercentage(Arm arm,ArmSkill skill,int stone)
	{
		if(arm == null) return 0;
		if(skill == null) return 0;
		
		int levelPercentage = GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetLevelData(skill.ID,arm.SkillLevel);
		if(!IsStoneIDLegal(stone)) return levelPercentage;
		int stonePercentage = GetStoneData(skill.ID,stone);
		
		return stonePercentage + levelPercentage;
	}

	public int GetSkillPercentage(int skillId, int skillLevel)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetLevelData(skillId, skillLevel);
	}
	//arm is gear
	public float GetKnightSkillLoad(System.Collections.ICollection arms){
//		Arm[] arms=knight.Arms;
		float p = 0.0f;
		foreach(Arm arm in arms)//calculate every gear
		{
			if(arm == null) continue;
			var skills = arm.Skills;

			foreach(ArmSkill skill in skills.Values)//calculaten every skill
			{
				if(skill == null) continue;
				if(arm.StarLevel <= skill.Position) continue;
				
				int percentage = GearManager.Instance().GetSkillPercentage(arm,skill,skill.Stone);
				int type = GearManager.Instance().GetSkillType(arm,skill);
				if(type==4){
					p+=percentage;
				}
			}
			

			
		}
		return p / 10000.0f;
		//int percentage = GearManager.Instance().GetSkillPercentage(arm,skill,skill.Stone);
	}

	public int GetStoneData(int skillid,int stoneid)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetStoneData(skillid,stoneid);
	}
	
	public int CompareSkill(Arm arm1,ArmSkill skill1,Arm arm2,ArmSkill skill2)
	{
		if(arm1 == null && arm2 == null) return 0;
		if(arm1 == null) return 1;
		if(arm2 == null) return -1;
		
		if(skill1 == null && skill2 == null) return 0;
		if(skill1 == null) return 1;
		if(skill2 == null) return -1;
		
		string[] target1 = SpliteTarget(GetTarget(skill1));
		string[] target2 = SpliteTarget(GetTarget(skill2));
		
		if(!IsSame(target1, target2)) return 2;  
		if(GearManager.Instance().IsPercent(skill1.ID) != GearManager.Instance().IsPercent(skill2.ID)) return 3;
		int p1 =  GetSkillPercentage(arm1,skill1,skill1.Stone);
		int p2 =  GetSkillPercentage(arm2,skill2,skill2.Stone);
		if( p1 > p2) return -1;
		if( p1 < p2) return 1;
		return 0;
	}
	
	public double[] CompareSkill(Arm arm1,Arm arm2)
	{
		if(arm1 == null) return null;
		if(arm2 == null) return null;	
		double[] r = new double[arm1.Skills.Count];
		if(arm1.Skills == null) return null;
		if(arm2.Skills == null) return null;
		for(int i = 0; i < arm1.Skills.Count; i++)
		{
			r[i] = 1.0f;
			for(int j = 0;j < arm2.Skills.Count ; j++)
			{
				if( arm1.Skills[i].ID == arm1.Skills[j].ID )
				{
					double p1 =  GetSkillPercentage(arm1,arm1.Skills[i],arm1.Skills[i].Stone);
					double p2 =  GetSkillPercentage(arm2,arm1.Skills[j],arm1.Skills[j].Stone);
					r[i] = p2 - p1;
					break;
				}
			}
		}
		return r;
	}
	private double[] CompareArm(Arm arm)
	{
		if(arm == null) return null;
		double[] r = new double[3];
		int star = arm.StarLevel;
		int id = arm.GDSID;
		int tier = arm.TierLevel;
	//	int[] targets = GearManager.Instance().GetTargets(arm);
		
		
		double a = GearManager.Instance().GetArmAttack(id,star,tier);
		double h = GearManager.Instance().GetArmLife(id,star,tier);
		double t = GearManager.Instance().GetArmTroop(id,star);
		
		r[0] = a;
		r[1] = h;
		r[2] = t; 
		return r;
	}
	
	public double[] CompareArm(Arm arm1,Arm arm2)
	{
		double[] r = new double[3];
		
		if(arm1 == null) return r;
		if(arm2 == null) return r;
		
		for(int i = 0; i < 3; i++)
			r[i] = 1.0f;
		
		double[] a1 = CompareArm(arm1);
		double[] a2 = CompareArm(arm2);
		
		for(int j = 0; j < 3; j++)
			r[j] = a2[j]-a1[j];

		return r;
	}
	
	public int GetTotalArmRare(Arm arm)
	{
		if(arm == null) return 0;
		int rare = arm.Rare;
		rare += arm.SkillsRare;
		return rare;
	}
	
	public int GetPureArmSkillRare(Arm arm)
	{
		if(arm == null) return 0;
		int rare = 0;
		for(int i =0;i<arm.Skills.Count;i++)
		{
			rare += GetSkillRare(arm.Skills[i].ID);
		}
		return rare;
	}
	
	public int GetPureArmRare(int id)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetRare(id);
	}
	public int GetSkillRare(int id) 
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetRare(id);
	}
	public int GetArmExperence(int id,int level)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetExperence(id,level);
	}
	public int GetArmToExperence(int id,int level)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetToExperence(id,level);
	}



	public double GetArmAttack(int id,int level,int tierLevel)
	{	
		double d = GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetAttack(id,level,tierLevel);
		return d / 10000.0f;
	}
	public int GetArmMight(int id,int level,int tierLevel)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetMight(id,level,tierLevel);
	}

	public int GetArmLvMight(int id,int level)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetLvMight(id,level);
	}

	public double GetArmLife(int id,int level,int tierLevel)
	{
		double d = GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetLife(id,level,tierLevel);
		return d / 10000.0f;
	}
	public int GetArmTroop(int id,int level) 
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetTroop(id,level);
	}
	public double GetArmSpeed(int id,int level)
	{
		double d = GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetSpeed(id,level);
		return d / 10000.0f;
	}
	public Dictionary<int,ArmSkill> GetArmSkill(Arm arm){
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetArmSkill(arm);
	}
	public string GetArmPic(int id){
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetArmPic(id);
	}
	public double GetArmLoad(int id,int level)
	{
		double d = GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetLoad(id,level);
		return d / 10000.0f;
	}
	public double GetArmDeAttack(int id,int level)
	{	
		double d = GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetDeAttack(id,level);
		return d / 10000.0f;
	}
	public double GetArmDeLife(int id,int level)
	{
		double d = GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetDeLife(id,level);
		return d / 10000.0f;
	}
	public string GetTarget(int skillid)
	{
		return  GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetTarget(skillid);
	}

	public string GetTarget(ArmSkill skill)
	{
		return  GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetTarget(skill.ID);
	}
	public string GetTarget(Arm arm)	
	{
		return  GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetTarget(arm.GDSID);
	}
	public string GetThreesetattribute(int gearId){
		return  GameMain.GdsManager.GetGds<KBN.GDS_Gear> ().GetThreesetattribute (gearId);
	}
	public string GetFivesetattribute(int gearId){
		return  GameMain.GdsManager.GetGds<KBN.GDS_Gear> ().GetFivesetattribute (gearId);
	}
	public string getSetid(int gearId){
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear> ().GetSetid (gearId);
	}
	public string[] SpliteTarget(string target)
	{	 
		return target.Split("+"[0]); 
	} 
	public int[] GetTargets(int skillid)
	{
		int[] ts = null; 
		string[] targets = SpliteTarget(GetTarget(skillid));
		if(targets == null) return null;
		if(targets.Length <= 0) return null;
		ts = new int[targets.Length];
		for(int i = 0;i<targets.Length;i++)
		{
			ts[i] = _Global.INT32(targets[i]);
		}
		return ts;
	}

	public int[] GetTargets(ArmSkill skill)
	{
		if(skill == null) return null;
		int[] ts = null; 
		string[] targets = SpliteTarget(GetTarget(skill));
		if(targets == null) return null;
		if(targets.Length <= 0) return null;
		ts = new int[targets.Length];
		for(int i = 0;i<targets.Length;i++)
		{
			ts[i] = _Global.INT32(targets[i]);
		}
		return ts;
	}
	public int[] GetTargets(Arm arm)
	{
		if(arm == null) return null;
		int[] ts = null; 
		string[] targets = SpliteTarget(GetTarget(arm));
		if(targets == null) return null;
		if(targets.Length <= 0) return null;
		ts = new int[targets.Length];
		for(int i = 0;i<targets.Length;i++)
		{
			ts[i] = _Global.INT32(targets[i]);
		}
		return ts;
	}
	
	
	public bool IsSame(string[] s1,string[] s2)
	{
		if(s1 == null) return false;
		if(s2 == null) return false; 
		
		if(s1.Length != s2.Length ) return false;
		for(int i = 0;i<s1.Length;i++)
		{
			if(s1[i] != s2[i]) return false;
		} 
		return true;
	}
	
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//stone
	//private Array stones = null;
	
	public long GetStoneNum(int id)
	{
		return MyItems.singleton.countForItem(id);
	}
	
	public void SubstractItem(int id)
	{
		MyItems.singleton.subtractItem(id);
	}
	public void SubstractItem(int id,int num)
	{
		MyItems.singleton.subtractItem(id,num);
	}
	
	public InventoryInfo[] GetAllStones()
	{
		var treasureList = MyItems.singleton.GetList(MyItems.Category.TreasureItem);
		for (int i = 0; i < treasureList.Count; )
		{
			InventoryInfo info = treasureList[i] as InventoryInfo;
			if (null == info || (info.id < 42000 || info.id > 42399))
			{
				treasureList.RemoveAt(i);
			}
			else
			{
				i++;
			}
		}
		
		return treasureList.ToArray();
	}
	
	
	public void RefreshStones()
	{
		
	}
	
	//public Array GetStonesByTypeFromItems(int type)
	//{
	//	if(stones == null) stones = new Array();
		
		
			
	//	return stones;
	//}
	
	
	public System.Collections.Generic.List<InventoryInfo> GetStonesByType(int type)
	{
		var array = GetAllStones();
		var a = new System.Collections.Generic.List<InventoryInfo>();
		for(int i =0;i<array.Length;i++)
		{
			InventoryInfo infor = array[i] as InventoryInfo;
			if(infor.id < 42000 || infor.id > 42399) continue;
			if(infor == null) continue;
			if(type == 0)
			{
				a.Add(infor);
			}
			else
			{
				int t = infor.id - type;
				if( t >= 0 && t < 100)
				{
					a.Add(infor);
				}
			}
		}
		return a;
	}
	
	public void AddItem(int id)
	{
		MyItems.singleton.AddItem(id);
	}
	public void AddItem(int id,int num)
	{
		MyItems.singleton.AddItem(id,num);
	}
	
	public bool IsStoneIDLegal(int id)
	{
		if(id >= Constant.StoneType.Smallest && id <=  Constant.StoneType.Largetest) return true;
		return false;
	}
	
	public bool IsPercent(int id)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_GearSkill>().GetIsPercent(id);
	}
	
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//destinations
	public void InitScrollRect()
	{
		
	}
	public void InitDestinations()
	{
		
	}

	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//report
	
	public List<int> GetAllTroopID()
	{
		List<int> list = new List<int>();
		var array = GameMain.GdsManager.GetGds<KBN.GDS_Troop>().GetTroopIDs();
		foreach(string i in array)
		{
			var t = i.Substring(1);
			var id = _Global.INT32(t);
			list.Add(id);
		}
		return list;
	}
	
	private int rareTotal;
	private int leveltip;
	
	public int LevelTip
	{
		get
		{
			return leveltip;
		}
	}
	public int RareTotal
	{
		get
		{
		return rareTotal;
		}
	}
	
	//rare 
	public void UpdateBySeed(HashObject seed)
	{
			if (null != seed["gear"])
		{
//			// TODO remove this, this data moved to Data.gameData
//			if (null != seed["gear"]["levelupTools"])
//			{
//				HashObject lvlTools = seed["gear"]["levelupTools"];
//				int idCnt = lvlTools.Table.Count;
//				
//				GearSysHelpUtils.StrengthenItemIds = new int[idCnt + 1];
//				for (int i = 0; i < idCnt; i++)
//				{
//					GearSysHelpUtils.StrengthenItemIds[i] = _Global.INT32(lvlTools["pos" + (i+1)]);
//				}
//				GearSysHelpUtils.StrengthenItemIds[idCnt] = -1;
//			}
			
			if (null != seed["gear"]["useItemRate"])
			{
				GearSysHelpUtils.UseItemRate = _Global.FLOAT(seed["gear"]["useItemRate"].Value);
			}
			
			if (null != seed["gear"]["useToolsRate"])
			{
				GearSysHelpUtils.UseToolsRate = _Global.FLOAT(seed["gear"]["useToolsRate"].Value);
			}
			if(null != seed["gear"]["gearUnlockLevelAlter"])
			{
				leveltip = _Global.INT32(seed["gear"]["gearUnlockLevelAlter"]);
			}
			if(null != seed["gear"]["skillRareSumAlter"])
			{
				rareTotal = _Global.INT32(seed["gear"]["skillRareSumAlter"]);
			}
			if (null != seed["gearSkillResetCount"])
			{
				MaxGachaResetCount = _Global.INT32(seed["gearSkillResetCount"]["maxcount"]);
//				PlayerGachaResetCount = _Global.INT32(seed["gearSkillResetCount"]["playercount"]);
				FreeGachaResetCount = _Global.INT32(seed["gearSkillResetCount"]["freecount"]);
				if (null != seed["gearSkillResetCount"]["lockcount"]) {
					string[] arr = _Global.GetString(seed["gearSkillResetCount"]["lockcount"]).Split('|');
					if (arr.Length > 0) {
						GachaLockItemCount = new int[arr.Length];
						for (int i = 0; i < arr.Length; i++) {
							GachaLockItemCount[i] = _Global.INT32(arr[i]);
						}
					}
					else
					{
						GachaLockItemCount = null;
					}
				}
			}
		}
	}

	//========================================================================================================================================
	public int[] GetShowSkill(int partID, int tier)
	{
		int [] ids = GameMain.GdsManager.GetGds<KBN.GDS_TierSkill>().GetSkillInfos(partID,tier);
		return ids;
	}

	public int[] GetResetItemIDs(int partID, int tier)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_TierSkill>().GetResetItemIDs(partID,tier);
	}

	public int[] GetResetItemNum(int partID, int tier)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_TierSkill>().GetResetItemNums(partID,tier);
	}

	public int[] GetTierUpgradeItemIDs(int partID, int tier)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_TierSkill>().GetUpgradeItemIDs(partID,tier);
	}

	public int[] GetTierUpgradeItemNums(int partID, int tier)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_TierSkill>().GetUpgradeItemNums(partID,tier);
	}

	public string GetTierSlot(int gearID)
	{
		return GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetTierSlot(gearID);
	}


	
	//========================================================================================================================================

	public int MaxGachaResetCount { get; private set; }
	public int FreeGachaResetCount { get; private set; }
	public int[] GachaLockItemCount { get; private set; }
	public int PlayerGachaResetCount { 
		get
		{
			HashObject seed = KBN.GameMain.singleton.getSeed();
			if (null != seed["gearSkillResetCount"]) {
				if (null != seed["gearSkillResetCount"]["playercount"]) {
					return _Global.INT32(seed["gearSkillResetCount"]["playercount"]);
				}
			}
			return 0;
		}
		set
		{
			HashObject seed = KBN.GameMain.singleton.getSeed();
			if (null != seed["gearSkillResetCount"]) {
				if (null != seed["gearSkillResetCount"]["playercount"]) {
					seed["gearSkillResetCount"]["playercount"].Value = value;
				}
			}
		}
	}
}
