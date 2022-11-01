
using System.Collections.Generic;
using KBN;

public class Weaponry : IParser
{
	private Dictionary<int,Arm> mArms;
	
	public System.Action<Arm, int> OnParsePutArm;
	public System.Action<Arm, int> OnParseRemoveArm;
	
	private int capacity;
	
	public Weaponry()
	{
		mArms = new Dictionary<int,Arm>();
	}
	public void Clear()
	{
		if(mArms != null)
			mArms.Clear();
	}
	public Arm GetArm(int id)
	{
		if(mArms == null) return null;
		if(!mArms.ContainsKey(id)) return null;
		return mArms[id];
	}
	
	public void AddArm(Arm arm)
	{
		if(arm == null) return;
		mArms[arm.PlayerID] = arm;
	}
	public void RemoveArm(Arm arm)
	{
		if(arm == null) return;
		mArms.Remove(arm.PlayerID);
	}
	public void RemoveArm(int playerID)
	{
		mArms.Remove(playerID);
	}
	public List<Arm> GetArms()
	{
		List<Arm> list = new List<Arm>();
		foreach(System.Collections.Generic.KeyValuePair<int, Arm> pair in mArms)
		{
			if(pair.Value != null)
			{
				list.Add(pair.Value);
			}
		}
		
		list.Sort((a, b)=>
		{
			if (a.belongFteId > 0 && b.belongFteId < 0) return -1;
			if (b.belongFteId > 0 && a.belongFteId < 0) return 1;
			// Both fte arm, sort it as 
			
			return b.StarLevel - a.StarLevel;
		});
		return list;
	}
	public List<Arm> GetStoredArms()
	{
		List<Arm> list = new List<Arm>();
		foreach(System.Collections.Generic.KeyValuePair<int, Arm> pair in mArms)
		{
			if(pair.Value != null)
			{
				if(!pair.Value.IsArmed)
					list.Add(pair.Value);
			}
			
		}
		
		list.Sort((a, b)=>
		{
			if (a.belongFteId > 0 && b.belongFteId < 0) return -1;
			if (b.belongFteId > 0 && a.belongFteId < 0) return 1;
			// Both fte arm, sort it as 
			
			return b.StarLevel - a.StarLevel;
		});
		return list;
	}
	public List<Arm> GetArmedArms()
	{
		List<Arm> list = new List<Arm>();
		foreach(System.Collections.Generic.KeyValuePair<int, Arm> pair in mArms)
		{
			if(pair.Value != null)
			{
				if(pair.Value.IsArmed)
					list.Add(pair.Value);
			}
			
		}		
		return list;
	}
	public List<Arm> GetUnlockedNotArmedNotCurrentArms(int type,Arm arm)
	{
		List<Arm> arms = new List<Arm>();
		foreach(KeyValuePair<int,Arm> pair in mArms)
		{
			if(pair.Value == null) continue;
			if (type == Constant.ArmType.Smallest)
				switch (pair.Value.GDSID)
				{
					case 1999900:
						continue;
					case 1999901:
						continue;
					case 1999902:
						continue;
					case 1999903:
						continue;
					case 1999904:
						continue;
				}
			if ((pair.Value.Category == type || type == Constant.ArmType.All) && !pair.Value.IsArmed && !pair.Value.Locked && pair.Value != arm)
				arms.Add(pair.Value);
		}
		return arms;
		
	}
	
	public List<Arm> GetNotArmedArmsByType(int type)
	{
		List<Arm> arms = new List<Arm>();
		foreach(KeyValuePair<int,Arm> pair in mArms)
		{
			if(pair.Value == null) continue;
			switch (pair.Value.GDSID)
			{
				case 1999900:
					continue;
				case 1999901:
					continue;
				case 1999902:
					continue;
				case 1999903:
					continue;
				case 1999904:
					continue;
			}
			if ((pair.Value.Category == type || type == Constant.ArmType.All) && !pair.Value.IsArmed)
				arms.Add(pair.Value);
		}
		
		return arms;
	}
	
	public List<Arm> GetArmsByType(int type)
	{
		List<Arm> arms = new List<Arm>();
		foreach(KeyValuePair<int,Arm> pair in mArms)
		{
			if(pair.Value == null) continue;		
			if((pair.Value.Category == type || type == Constant.ArmType.All))
				arms.Add(pair.Value);
		}
		
		arms.Sort((a, b)=>
		{
			if (a.belongFteId > 0 && b.belongFteId < 0) return -1;
			if (b.belongFteId > 0 && a.belongFteId < 0) return 1;
			// Both fte arm, sort it as 
			
			return b.StarLevel - a.StarLevel;
		});
		return arms;
	}
	
	public List<Arm> GetSortArmsByType(int type)
	{
		List<Arm> arms = new List<Arm>();
		foreach(KeyValuePair<int,Arm> pair in mArms)
		{
			if(pair.Value == null) continue;
			switch (pair.Value.GDSID)
			{
				case 1999900:
					continue;
				case 1999901:
					continue;
				case 1999902:
					continue;
				case 1999903:
					continue;
				case 1999904:
					continue;
			}
			if((pair.Value.Category == type || type == Constant.ArmType.All))
				arms.Add(pair.Value);
		}
		
		arms.Sort((arm1, arm2)=>
		{
			int direction = 1;
			if(arm1 == null) return direction;
			if(arm2 == null) return -1 * direction;
			
			if(arm1.StarLevel < arm2.StarLevel) return direction;
			if(arm1.StarLevel > arm2.StarLevel) return -1 * direction;
			
			int total1 = GearManager.Instance().GetTotalArmRare(arm1);
			int total2 = GearManager.Instance().GetTotalArmRare(arm2);
			
			if(total1 < total2) return direction;
			if(total1 > total2) return -1 * direction;
			
			int gdsid1 = arm1.GDSID;
			int gdsid2 = arm2.GDSID;
			
			if(gdsid1 < gdsid2) return direction;
			if(gdsid1 > gdsid2) return -1 * direction;
			
			return 0;
		});
		return arms;
	}
	
	public int Capacity
	{
		get
		{
			return capacity;
		}
		set
		{
			capacity = value;
		}
	}
	
	public override bool Parse()
	{
		if(mSeed == null) return false;
		if(mSeed["gearList"] == null) return false;
		var array = _Global.GetObjectValues(mSeed["gearList"]);
		if(array == null) return false;
		
		int n = array.Length;
		if(mSeed["capacity"] != null)
			capacity = _Global.INT32(mSeed["capacity"]);
		
		for(int i = 0; i < n; i++)
		{	
			Arm arm = new Arm();
			HashObject armSeed = (HashObject)array[i];
			arm.Parse(armSeed);
			if(!arm.IsParseValid()) return false;
			
			
			if(arm.IsArmed)
			{
				if(OnParsePutArm != null)
					OnParsePutArm(arm,arm.KnightID);
			}
			else
			{
				if(mArms.ContainsKey(arm.PlayerID) && mArms[arm.PlayerID] != null)
				{
					if(mArms[arm.PlayerID].IsArmed)
					{
						if(OnParseRemoveArm != null)
							OnParseRemoveArm(mArms[arm.PlayerID],mArms[arm.PlayerID].KnightID);
					}
				}
			}
			this.AddArm(arm);
		}
		return true;			
	}
	
	public override bool SynSeed()
	{
		if(!IsParseValid()) return false;
		foreach(System.Collections.Generic.KeyValuePair<int, Arm> pair in mArms)
		{
			if(pair.Value != null)
			{
				if(!pair.Value.SynSeed()) return false;
			}
		}
		return true;
	}

	public override bool IsChanged()
	{
		if(!IsParseValid()) return false;
		foreach(System.Collections.Generic.KeyValuePair<int, Arm> pair in mArms)
		{
			if(pair.Value != null)
			{
				if(pair.Value.IsChanged()) return true;
			}	
		}
		return false;
	}

}

