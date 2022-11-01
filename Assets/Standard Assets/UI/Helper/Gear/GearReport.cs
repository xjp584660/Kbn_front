
using System.Collections.Generic;
using KBN;

public class GearReport
{
	class GearDataInfo{
		private Arm arm;
		private int count;
//		private int gearID;
		private string setid;

		public string Setid {
			get {
				return setid;
			}
			set {
				setid = value;
			}
		}

		public Arm Arm {
			get {
				return arm;
			}
			set {
				arm = value;
			}
		}


		public int Count {
			get {
				return count;
			}
			set {
				count = value;
			}
		}



	}
	private static GearReport sInstance = new GearReport();
	
	private GearReport()
	{
		
	}
	
	public static GearReport Instance()
	{
		return sInstance;
	}
	
	
	private Dictionary<int,double> attack = null;
	private Dictionary<int,double> life = null;
	private Dictionary<int,double> troop = null;
	private Dictionary<int,double> speed = null;
	private Dictionary<int,double> load = null;
	private Dictionary<int,double> deattack = null;
	private Dictionary<int,double> delife = null;
	private Dictionary<int,double>[] data;
	
	public void Init()
	{ 
		data = new Dictionary<int,double>[7];
		attack = new Dictionary<int,double>();
		life = new Dictionary<int,double>();
		troop = new Dictionary<int,double>();
		speed = new Dictionary<int,double>();
		load = new Dictionary<int,double>();
		deattack = new Dictionary<int,double>();
		delife = new Dictionary<int,double>();
		
		data[0] = attack;
		data[1] = life;
		data[2] = troop;
		data[3] = load;
		data[4] = speed;
		data[5] = deattack;
		data[6] = delife;
		
		Clear();
	}
	private void Clear()
	{
		List<int> a = GearManager.Instance().GetAllTroopID();
		foreach(int i in a)
		{
			if(attack == null) continue;
			attack[i] = 0;
			if(life == null) continue;
			life[i] = 0;
			if(troop == null) continue;
			troop[i] = 0; 
			if(load == null) continue;
			load[i] = 0; 
			if(speed == null) continue;
			speed[i] = 0; 
			if(deattack == null) continue;
			deattack[i] = 0;
			if(delife == null) continue;
			delife[i] = 0;
		}
	}
	
	public Dictionary<int,double>[] Calculate(System.Collections.ICollection arms)
	{
		if(arms == null) return null;
		Clear();
		int suitCount=0;
		List<GearDataInfo> gdiList = new List<GearDataInfo> ();
		GearDataInfo gearData;
		Arm currentArm = null;
		foreach(Arm arm in arms)
		{
			bool flag=false;


			if(arm == null) continue;
			if(null!=arm.Threesetattribute && arm.Threesetattribute!=string.Empty)
			{
				suitCount++;
				currentArm=arm;

				foreach (GearDataInfo item in gdiList) {
					if(item.Setid.Equals(arm.Setid)){//如果已经存在该arm数据，只需要在数量上自增
						flag=true;
						item.Count++;
						break;
					}
				}
				if(!flag) {
					gearData=new GearDataInfo();
					gearData.Arm=arm;
					gearData.Count=1;
					gearData.Setid=arm.Setid;
					gdiList.Add(gearData);
				}

			}
			CalculateArm(arm);
			var skills = arm.Skills;
			if(skills == null) continue;
			foreach(ArmSkill skill in skills.Values)
			{
				if(skill == null) continue;
				if(arm.StarLevel <= skill.Position) continue;
				CalculateSkill(arm,skill);
			}
		}
		GearDataInfo res = GetSuitArm (gdiList);
		if(res!=null)
		CalculateSuit(res.Count,res.Arm);
		//CalculateSuit(suitCount,currentArm);
		return data;
	}

	GearDataInfo GetSuitArm(List<GearDataInfo> gdiList){
		if (gdiList.Count == 0)
			return null;
		gdiList.Sort ((gdf1,gdf2) => gdf2.Count - gdf1.Count);
		return gdiList[0];

	}
	
	public void CalculateSuit(int _suitCount,Arm _arm)
	{
		if (_suitCount > 2) 
		{
			if(_arm.Threesetattribute.Contains(":"))
			{
				SetSuitTwoAttibute(_arm.Threesetattribute);	
			}
			else
			{
				SetSuitOneAttibute(_arm.Threesetattribute);	
			}
		}

		if (_suitCount > 4) 
		{
			if(_arm.Fivesetattribute.Contains(":"))
			{
				SetSuitTwoAttibute(_arm.Fivesetattribute);	
			}
			else
			{
				SetSuitOneAttibute(_arm.Fivesetattribute);	
			}
		}
	}
	public void SetSuitOneAttibute(string currentArm)
	{
		if(currentArm.Split('_')[0]=="3")
		{
//			return;
			Add(_Global.DOULBE64(currentArm.Split('_')[1]),data[_Global.INT32(currentArm.Split('_')[0])-1]);
			
		}
		else
		{
			//Debug.Log (currentArm.Split('_')[0]+" =type =  "+currentArm.Split('_')[1]);
			Add(_Global.DOULBE64(currentArm.Split('_')[1])/10000.0f,data[_Global.INT32(currentArm.Split('_')[0])-1]);
		}
	}
	public void SetSuitTwoAttibute(string currentArm)
	{
		string oneAttribute=currentArm.Split(':')[0];//1_5000
		string twoAttribute=currentArm.Split(':')[1];//4_7000
		if(oneAttribute.Split('_')[0]=="3")
		{
//			return;
			Add(_Global.DOULBE64(twoAttribute.Split('_')[1]),data[_Global.INT32(twoAttribute.Split('_')[0])-1]);
		}
		else
		{
			//data[_Global.INT32(oneAttribute.Split('_')[0])]=_Global.INT32(oneAttribute.Split('_')[1]);
			Add(_Global.DOULBE64(oneAttribute.Split('_')[1])/10000.0f,data[_Global.INT32(oneAttribute.Split('_')[0])-1]);
			
		}
		if(twoAttribute.Split('_')[0]=="3")
		{
//			return;
			Add(_Global.DOULBE64(twoAttribute.Split('_')[1]),data[_Global.INT32(twoAttribute.Split('_')[0])-1]);
		}
		else
		{
		//	data[_Global.INT32(twoAttribute.Split('_')[0])]=_Global.INT32(twoAttribute.Split('_')[1]);
			Add(_Global.DOULBE64(twoAttribute.Split('_')[1])/10000.0f,data[_Global.INT32(twoAttribute.Split('_')[0])-1]);
			
		}
	}

	private void CalculateArm(Arm arm)
	{
		if(arm == null) return;
		int star = arm.StarLevel;
		int id = arm.GDSID;
		int tierLevel = arm.TierLevel;
		int[] targets = GearManager.Instance().GetTargets(arm);
		
		foreach(int target in targets)
		{
			double a = GearManager.Instance().GetArmAttack(id,star,tierLevel);
			double h = GearManager.Instance().GetArmLife(id,star,tierLevel);
			double t = GearManager.Instance().GetArmTroop(id,star);
			double l = GearManager.Instance().GetArmLoad(id,star);
			double s = GearManager.Instance().GetArmSpeed(id,star);
			double da = GearManager.Instance().GetArmDeAttack(id,star);
			double dh = GearManager.Instance().GetArmDeLife(id,star);
			
			if(target == 99)
			{
				Add(a,attack);
				Add(h,life);
				Add(t,troop);
				Add(l,load);
				Add(s,speed);
				Add(da,deattack);
				Add(dh,delife);
			}
			else
			{
				Add(target,a,attack);
				Add(target,h,life);
				Add(target,t,troop);
				Add(target,l,load);
				Add(target,s,speed);
				Add(target,da,deattack);
				Add(target,dh,delife);
			}
		}
	}
	
	private void CalculateSkill(Arm arm,ArmSkill skill)
	{ 
		if(arm == null) return;
		if(skill == null) return;
		
		int percentage = GearManager.Instance().GetSkillPercentage(arm,skill,skill.Stone);
		double p = 0.0f;
		int type = GearManager.Instance().GetSkillType(arm,skill);
		
		type--;
		if(type != 2)
			p = percentage / 10000.0f;
		else
			p = percentage;
		
		if(type < 0 || type >= 7) return;
		int[] targets = GearManager.Instance().GetTargets(skill);
		if(targets == null) return;
		for(int i = 0;i<targets.Length;i++)
		{
			if(targets[i] == 99)
			{
				Add(p,data[type]);
			}
			else
			{
				Add(targets[i],p,data[type]);
			}
		}
	}
	
	
	public Dictionary<int,GearTroopItem.GearTroopItemData> Format(Dictionary<int,double>[] datas)
	{
		if(datas == null) return null;
		Dictionary<int,GearTroopItem.GearTroopItemData> r = new Dictionary<int,GearTroopItem.GearTroopItemData>();
		for(int i = 0;i< datas.Length;i++)
		{

			foreach(KeyValuePair<int,double> k in datas[i])
			{
				if(!r.ContainsKey(k.Key))
					r[k.Key] = new GearTroopItem.GearTroopItemData();
				
				r[k.Key].id = k.Key;
				if(i == 0)
				{
					r[k.Key].attack = k.Value;
				}
				else if(i == 1)
				{
					r[k.Key].life = k.Value;
				}
				else if(i == 2)
				{
					r[k.Key].troop = k.Value;
				}
				else if(i == 3)
				{
					r[k.Key].load = k.Value;
				}
				else if(i == 4)
				{
					r[k.Key].speed = k.Value;
				}
				else if(i == 5)
				{
					r[k.Key].deattack = k.Value;
				}
				else if(i == 6)
				{
					r[k.Key].delife = k.Value;
				}
			}
		}
		return r;
	}
 	
	public Dictionary<int,GearTroopItem.GearTroopItemData> Minus(Dictionary<int,GearTroopItem.GearTroopItemData> self,Dictionary<int,GearTroopItem.GearTroopItemData> enemy)
 	{
 		var r = new Dictionary<int,GearTroopItem.GearTroopItemData>();
 		if(self == null) return enemy;
 		if(enemy == null) return self;
 		
 		foreach(int key in self.Keys)
 		{ 
 			GearTroopItem.GearTroopItemData item = new GearTroopItem.GearTroopItemData(); 
 			if(enemy.ContainsKey(key))
 			{ 
 				item.id = self[key].id;
 				item.attack = self[key].attack - enemy[key].attack;
 				item.load = self[key].load - enemy[key].load;
 				item.speed = self[key].speed - enemy[key].speed;
 				item.life = self[key].life - enemy[key].life;
 				item.troop = self[key].troop - enemy[key].troop;
 				item.deattack = self[key].deattack - enemy[key].deattack;
 				item.delife = self[key].delife - enemy[key].delife;
 			} 
 			else
 			{
 				item = self[key];
 			} 
 			r[key] = item;
 		} 
 		foreach(int k in enemy.Keys)
 		{
 			if(!self.ContainsKey(k))
 			{
 				GearTroopItem.GearTroopItemData it = new GearTroopItem.GearTroopItemData();  
  				it.id = enemy[k].id;
 				it.attack = -1 * enemy[k].attack;
 				it.load = -1 * enemy[k].load;
 				it.speed = -1 * enemy[k].speed;
 				it.life = -1 * enemy[k].life;
 				it.troop = -1 * enemy[k].troop;
 				it.deattack = -1 * enemy[k].deattack;
 				it.delife = -1 * enemy[k].delife;
				r[k] = it;
 			}
 		}
 		
 		return r;
 	}

	/// <summary>
	/// 根据加成类型，获取单件装备和套装对某一属性总的加成之后的值
	/// </summary>
	/// <returns>The suit add.</returns>
	/// <param name="arms">Arms.</param>
	/// <param name="suitType">加成类型. 1 attack  2hp  3limit  4load  5 speed  6dattack  7dhp.</param>
	public float GetSuitAndSkillAdd(System.Collections.ICollection arms,int suitType)
	{
		Dictionary<int,GearTroopItem.GearTroopItemData> mdic=Format(Calculate(arms));
		double res=0;
		if(mdic == null)
		{
			return 0f;
		}
		foreach (GearTroopItem.GearTroopItemData item in mdic.Values) {
			switch (suitType) {
			case 1:
				res=item.attack;
				break;
			case 2:
				res=item.life;
				break;
			case 3:
//				res=0;
				res=item.troop;
				break;
			case 4:
				res=item.load;
				break;
			case 5:
				res=item.speed;
				break;
			case 6:
				res=item.deattack;
				break;
			case 7:
				res=item.delife;
				break;
			default:
				break;
			}
			break;
		}
		
		return (float)res;
	}
 	
 	
 	private Knight selfKnight;
 	private Knight enemyKnight;
 	
	public Knight Self
 	{
		get
		{
 			return selfKnight;
 		}
	}
	public Knight Enemy
 	{
		get
		{
 			return enemyKnight;
		}
 	}

    public List<int> ItemIds { get; private set; }

    public List<int> ItemCounts { get; private set; }

 	public bool ParseChest(HashObject seed)
 	{
        ItemIds = new List<int>();
        ItemCounts = new List<int>();
 		if(seed == null) return false;
 		if(seed["dropItems"] == null) return false;
        HashObject items = seed["dropItems"];
 		var arr = _Global.GetObjectKeys(items);
 		if(arr == null)
        {
            return false;
        }
 		
 		foreach(string id in arr)
 		{
 			int i = _Global.INT32(id.Substring(1));
 			if(i <= 0) return false;
            ItemIds.Add(i);
            ItemCounts.Add(KBN._Global.INT32(items[id]));
 		}
 		return true;
 	}
 	
 	
 	public Knight ParseSelf(HashObject seed,int self)
 	{ 
 		selfKnight = ParseReportKnight(seed["s" + self + "Gear"]);
 		ParseKnightInfo(seed,selfKnight,self);
 		return selfKnight;
 	}
 	public Knight ParseEnemy(HashObject seed,int enemy)
 	{	 
 		enemyKnight = ParseReportKnight(seed["s" + enemy + "Gear"]);
 		ParseKnightInfo(seed,enemyKnight,enemy);
 		return enemyKnight;
 	}
 	
 	private void ParseKnightInfo(HashObject seed,Knight knight,int self)
 	{
 		if(knight == null) return;
 		if(seed == null) return;
 		
 		knight.KnightID = _Global.INT32(seed["s" + self + "Kid"]);
 		knight.Name = _Global.ToString(seed["s" + self + "kName"]);
 		knight.CityID = _Global.INT32(seed["s" + self + "Order"]);
 		knight.Level = _Global.INT32(seed["s" + self + "KLv"]);
 	}
 	
	private Knight ParseReportKnight(HashObject seed)
	{
		if(seed == null) return null;
		
		Knight knight = new Knight();
		foreach(System.Collections.DictionaryEntry i in seed.Table)
		{
			Arm arm = ParseReportArm((HashObject)i.Value); 
			if(arm == null) continue;
			arm.PlayerID = _Global.INT32(i.Key.ToString().Substring(1));
			arm.Category = GearManager.Instance().GetArmType(arm);

			GearManager.Instance().PutArm(arm,knight);
		}
		return knight;
	}
	
	private Arm ParseReportArm(HashObject seed)
	{	
		if(seed == null) return null;
		Arm arm = new Arm();
		
		arm.StarLevel = _Global.INT32(seed["star"]);
		arm.GDSID = _Global.INT32(seed["type"]);
		arm.SkillLevel = _Global.INT32(seed["level"]);
        arm.TierLevel = _Global.INT32(seed["tier"]);
		arm.Threesetattribute=GearManager.Instance().GetThreesetattribute(arm.GDSID );
		arm.Fivesetattribute=GearManager.Instance().GetFivesetattribute(arm.GDSID );
		arm.Setid =GearManager.Instance ().getSetid (arm.GDSID) ;
		arm.Skills = new Dictionary<int,ArmSkill>();
		for(int i = 1;i<7;i++)
		{
			ArmSkill skill = new ArmSkill();
			arm.Skills[i-1] = skill;
			skill.ID = _Global.INT32(seed["skill"]["sk"+i]);
			skill.Stone = _Global.INT32(seed["skill"]["sl"+i]);
			skill.Position = i - 1;
		} 
		return arm;
		
	}
	
	
	
	private void Add(int index,double a,Dictionary<int,double> collection)
	{
		if(collection == null) return;
		if(!collection.ContainsKey(index))return;
		
		double b = collection[index];
		b += a;
		collection[index] = b;
	}
	private void Add(double a,Dictionary<int,double> collection)
	{
		if(collection == null) return;
		
		int[] ar = new int[collection.Keys.Count];
		int k = 0;
		foreach(int i in collection.Keys)
		{
			ar[k++] = i;
		}
		
		for(int j = 0;j<ar.Length;j++)
		{
			if(!collection.ContainsKey(ar[j])) continue;
			collection[ar[j]] = collection[ar[j]] + a;
		}
	
	}
	
	
	
}
