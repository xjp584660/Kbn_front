using UnityEngine;
using System.Collections;
using KBN;
using System;

public enum CityState
{
	ALIVE,
	LOCKED,
	WAITINGBUILD,
	INCOMING
};

public class City
{
	public CityState state = CityState.INCOMING;
	public int cityId;
	public int citySequence = 0;
	public string cityName;
	public bool bCreat = false;
	public int x;
	public int y;
	public int provinceId;
	public bool flash;
	public long UnblockedTime = 0;
	public bool isOpenedByServer = false;
	public class BuildRequirement{
		public string title { get; private set; }
		public int need { get; private set; }
		public bool needItem { get; private set; }
		public bool isMet { get; private set; }

		public void setTitle(string title) {
			this.title = title;
		}

		public void setNeed(int need) {
			this.need = need;
		}

		public void setNeedItem(bool needItem) {
			this.needItem = needItem;
		}

		public void setIsMet(bool isMet) {
			this.isMet = isMet;
		}
	}
	//	AttackComing attackQueue = new AttackComing();
	public bool bAttacked = false;
	public int dependencyCityId = -1;
	public long closeDependTimeStart = -1;
	public long closeDependTimeEnd = -1;
	public BuildRequirement reqLevel { get; private set; }
	public BuildRequirement reqItem { get; private set; }
	public BuildRequirement reqPlain { get; private set; }

	public City() {
		reqLevel = new BuildRequirement();
		reqItem = new BuildRequirement();
		reqPlain = new BuildRequirement();
	}
}


public class CityQueue
{	
	System.Collections.Generic.List<City> cityList = new System.Collections.Generic.List<City>();
	private bool noteOnMainchrome = false;
	private int MaxNum = 5;
	private int MaxReleaseNum = 5;
	private	static	CityQueue singleton;
	private HashObject seed;
	private bool bNotifyAttack = false;
	private static void priv_OnGameRestart()
	{
		singleton = null;
	}

	public	static	CityQueue instance (){
		if( singleton == null ){
			singleton = new CityQueue();
			KBN.GameMain.singleton.resgisterRestartFunc(new Action(priv_OnGameRestart));
		}
		return singleton;
	}
	
	public	void init ( HashObject sd ){
		seed = sd;
		cityList.Clear();
		for(int i = 0; i<MaxNum;i++)
		{
			cityList.Add(new City());
			cityList[i].citySequence = i+1;
			cityList[i].dependencyCityId = i;
		}
		SyncWithSeed();
	}

	public void UpdateCityDependency(HashObject dat)
	{
		priv_clearDependTime();
		var cityDependency = dat["cityDependency"];
		if ( cityDependency == null )
			return;
		priv_updateDependCity(cityDependency);
		priv_updateDependTime(cityDependency);
	}

	private void priv_updateDependCity(HashObject cityDependency)
	{
		var city = "city";
		foreach ( System.Collections.DictionaryEntry node in cityDependency.Table )
		{
			string key = (string)node.Key;
			if ( key.Length <= city.Length || key.Substring(0, city.Length) != city )
				continue;
			var dependencyCityId = _Global.INT32(node.Value);
			var citySequence = _Global.INT32(key.Substring(city.Length));
			var cityIdx = citySequence - 1;
			if ( cityIdx < 0 || cityList.Count <= cityIdx )
				continue;
			cityList[cityIdx].dependencyCityId = dependencyCityId;
		}
	}

	private void priv_clearDependTime()
	{
		for ( int i = 0; i != cityList.Count; ++i )
		{
			cityList[i].closeDependTimeStart = -1;
			cityList[i].closeDependTimeEnd = -1;
		}
	}

	private void priv_updateDependTime(HashObject cityDependency)
	{
		var city = "dependency";
		foreach ( System.Collections.DictionaryEntry node in cityDependency.Table )
		{
			string key = (string)node.Key;
			if ( key.Length <= city.Length || key.Substring(0, city.Length) != city )
				continue;
			HashObject chrNode = (HashObject)node.Value;
			var startStopTime = _Global.INT32(chrNode["start"]);
			var endStopTime = _Global.INT32(chrNode["end"]);
			//var dependencyCityId = _Global.INT32(dnode.Value);
			var citySequence = _Global.INT32(key.Substring(city.Length));
			var cityIdx = citySequence - 1;
			if ( cityIdx < 0 || cityList.Count <= cityIdx )
				continue;
			cityList[cityIdx].closeDependTimeStart = startStopTime;
			cityList[cityIdx].closeDependTimeEnd = endStopTime;
		}
	}
	

	public void SyncWithSeed ()
	{
		HashObject citiesInfo =  seed["cities"];
		HashObject citiesReleaseTimes = seed["cityReleaseTime"];
		HashObject cityInfo;
		int cityOrder;
		int listIndex;
		City city;
		for ( int i = 0; citiesInfo[_Global.ap + i] != null; ++i )
		{
			cityInfo = citiesInfo[_Global.ap + i];
			cityOrder = _Global.INT32(cityInfo[_Global.ap + 6]);
			listIndex = cityOrder - 1;
			city = cityList[listIndex] as City;
			city.state = CityState.ALIVE;
			city.citySequence = cityOrder;
			city.cityId = _Global.INT32(cityInfo[_Global.ap + 0]);
			if (i == cityList.Count - 1)/*当前等于医院 把医院ID存起来*/
			{
				Datas.singleton.saceHospitalCityId(city.cityId);
			}
			city.cityName = cityInfo[_Global.ap + 1].Value.ToString();
			city.x = _Global.INT32(cityInfo[_Global.ap + 2]);
			city.y = _Global.INT32(cityInfo[_Global.ap + 3]);
			city.provinceId = _Global.INT32(cityInfo[_Global.ap + 4]);
			//i++;
		}
		//Datas arstrings = Datas.singleton;
		
		for(int j = 1; j < MaxNum; j++)
		{
			city = cityList[j];
			if ( city.state == CityState.ALIVE )
				continue;
			city.state = CityState.LOCKED;
			city.reqItem.setTitle(Datas.getArString("PlayerInfo.NewCityReqTitle1"));
			city.reqItem.setNeedItem(true);
			city.reqLevel.setTitle(Datas.getArString("PlayerInfo.NewCityReqTitle"+(j*2)));
			city.reqPlain.setTitle(Datas.getArString("PlayerInfo.NewCityReqTitle3"));
		}
		
		for(int j= 2; j<=MaxReleaseNum; j++)
		{
			if(citiesReleaseTimes != null && citiesReleaseTimes["city"+j] != null)
			{
				cityList[j-1].UnblockedTime = _Global.INT64(citiesReleaseTimes["city"+j].Value);
				cityList[j-1].isOpenedByServer = true;
			}
			else
				cityList[j-1].UnblockedTime = GameMain.unixtime() -1;
		}

		this.UpdateCityDependency(seed);
	}
	
	public City CheckNewCtiyRequirement ()
	{
		City waitingBuildCity = null;
		bool isFirstWaitingCity = true;
		
		bool hasPlain = false;
		object[] cityKeys = _Global.GetObjectKeys(seed["wilderness"]);
		int i;
		for(i=0; i<cityKeys.Length; i++)
		{
			Hashtable totalWilds = seed["wilderness"][cityKeys[i].ToString()].Table;
			if(totalWilds != null)
			{
				foreach (System.Collections.DictionaryEntry _wild in totalWilds)
				{
					HashObject wild = _wild.Value as HashObject;
					if(Constant.TileType.PLAIN == _Global.INT32(wild["tileType"]))
					{
						hasPlain = true;
						break;
					}	
				}
			}
			if( hasPlain ){
				break;
			}
		}
		
		HashObject buildCityReqs = Datas.singleton.buildCityReqs();
		for(i=0; i< cityList.Count; i++)
		{
			City city = cityList[i];
			if(i>=1 && city.state != CityState.ALIVE)
			{			
				if( city.UnblockedTime == 0 || (city.UnblockedTime!=0 && (city.UnblockedTime > GameMain.unixtime() || !city.isOpenedByServer)) )
					city.state = CityState.INCOMING;
				else 
					city.state = CityState.LOCKED;
			}

			if(city.state != CityState.WAITINGBUILD && city.state != CityState.LOCKED)
				continue;
			int itemId = _Global.INT32(buildCityReqs["c"+city.citySequence]["needItem"].Value);	
			int level =  _Global.INT32(buildCityReqs["c"+city.citySequence]["buildLevel"]);
			int playerLevel = _Global.INT32(seed["player"]["title"]);
			if(playerLevel > _Global.INT32(buildCityReqs["c"+city.citySequence]["unLockLevel"]) )
			{
				if ( !priv_isNeedWaitPrvCity(city) )
				{
					city.state = CityState.WAITINGBUILD;
				}
			}

			city.reqItem.setIsMet(MyItems.singleton.countForItem(itemId) != 0);
			city.reqItem.setNeed(itemId);
			bool temp = city.reqLevel.isMet;
			city.reqLevel.setIsMet(_Global.INT32(seed["player"]["title"])>=level);
			if( temp != city.reqLevel.isMet)
				city.flash = city.reqLevel.isMet;
			if(city.flash)
				noteOnMainchrome = true;	
			city.reqPlain.setIsMet(hasPlain);
			city.bCreat = hasPlain && city.reqItem.isMet && city.reqLevel.isMet;
			
			if(isFirstWaitingCity)
			{
				waitingBuildCity = city;	
				isFirstWaitingCity = false;
			}				
			//break;	
		}
		
		return waitingBuildCity;
	}

	private bool priv_isNeedWaitPrvCity(City city)
	{
		var waitIdx = city.dependencyCityId - 1;
		if ( waitIdx < 0 )
			return false;
		if ( waitIdx >= cityList.Count )
			return true;
		City cityInList = cityList[waitIdx];
		if ( cityInList.state == CityState.ALIVE )
			return false;
		return true;
	}
	
	public void updateQueue ()
	{
		//Menu curMenu = MenuMgr.getInstance().GetCurMenu();
		//if( curMenu != null && curMenu.menuName == "Cities")
		//	return;
		
		HashObject citiesReleaseTimes = seed["cityReleaseTime"];
		for(int j= 2; j<=MaxReleaseNum; j++)
		{
			if(citiesReleaseTimes != null && citiesReleaseTimes["city"+j] != null)
			{
				cityList[j-1].UnblockedTime = _Global.INT64(citiesReleaseTimes["city"+j].Value);
				cityList[j-1].isOpenedByServer = true;
			}
			else
			{
				cityList[j-1].UnblockedTime = GameMain.unixtime()-1;
				if(cityList[j-1].isOpenedByServer)
				{
					cityList[j-1].isOpenedByServer = false;
					continue;
				}
			}
			
			long RestTime = cityList[j-1].UnblockedTime - GameMain.unixtime();
			if(RestTime <= 0)
			{
				CityQueue.instance().CheckNewCtiyRequirement();
			}
		}	
	}
	
	public City GetCity (int cityId)
	{
		for(int i=0; i< cityList.Count; i++)
		{
			if(cityList[i].cityId == cityId)
			{
				return cityList[i];
			}
		}
		return null;
	}

	//	0,1,2,3,4
	public City GetCreatedCityByIdx(int cityIdx)
	{
		if ( cityIdx < 0 || cityIdx >= cityList.Count )
			return null;
		var city = cityList[cityIdx];
		if ( city.state == CityState.ALIVE )
			return city;
		return null;
	}

	public int GetCityIdByCityOrder(int cityOrder)
	{
		for(int i=0;i<cityList.Count;i++)
		{
			if(cityList[i].citySequence == cityOrder)
			{
				return cityList[i].cityId;
			}
		}
		return 0;
	}

	public System.Collections.Generic.List<City> Cities
	{
		get
		{
			return cityList;
		}
	}
	
	public int MaxCityCnt
	{
		get
		{
			return MaxNum;
		}
	}
	
	public int MaxReleasedCityCnt
	{
		get
		{
			return MaxReleaseNum;
		}
	}
	
	public void ClearAttackInfo ()
	{
		for(int i = 0; i < MaxNum; i++)
		{
			cityList[i].bAttacked = false;
		}
	}
	
	public bool NotifyAttack
	{
		set
		{
			bNotifyAttack = value;
		}
		get
		{
			return bNotifyAttack;
		}
	}
	
	public bool ReachNewCityLevel ()
	{
		return noteOnMainchrome;
	}
	
	public void StopNote ()
	{
		noteOnMainchrome = false;
		for(int i=0; i< MaxNum; i++)
		{
			(cityList[i] as City).flash = false;
		}
		MenuMgr.instance.sendNotification(Constant.Notice.NOTE_NEWCITY, null);
	}
}

public class MyCitiesController
{
	private static System.Collections.Generic.List<CityInfo> cities;
	public static void Init (HashObject seed)
	{
		cities = new System.Collections.Generic.List<CityInfo>();
		Hashtable cts = seed["cities"].Table;
		for(int i = 0; i < cts.Count; i++)
		{
			HashObject city = cts[_Global.ap + i] as HashObject;
			if(city != null)
			{
				CityInfo info = new CityInfo(city);
				cities.Add(info);
			}
		}
		cities.Sort((a,b)=>{
			return  a.Id - b.Id;
		});
	}
	
	public static System.Collections.Generic.List<CityInfo> MyCities ()
	{
		return cities;
	}
}

public class CityInfo
{
	public string Name;
	public int Id;
	public int X;
	public int Y;
	public bool Selected;
	public CityInfo (HashObject val)
	{
		Id = _Global.INT32(val[_Global.ap + 0]);
		Name = val[_Global.ap+1].Value.ToString();
		X = _Global.INT32(val[_Global.ap + 2]);
		Y = _Global.INT32(val[_Global.ap + 3]);
		Selected = false;
	}
	
	public CityInfo ()
	{
	}
}