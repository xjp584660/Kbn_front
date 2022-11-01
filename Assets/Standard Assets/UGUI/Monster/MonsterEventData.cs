using UnityEngine;
using System.Collections;
using System;

public class MonsterEventData {

	public  int				eventId;
	public  string			startTime;
	public  long			startUnixTime;
	public  string			endTime;
	public  long			endUnixTime;
	public 	string			openTime;
	public  int				curCommonPool;
	public  int				curElitePool;
	public  int				dailyFree;
	public  int				curCommonBossId;
	public  int 			curCommonSort;
	public  int             curEliteSort;
	public  string			commonName;
	public  string			commonBackground;
	public  string			commonPicture;
	public  string			commonDescription;
	public  int				commonCost;
	public  int				curCommonBossBlood;
	public  int				commonFree;
	public  int				curEliteBossId;
	public  string	 		eliteName;
	public  string			eliteBackground;
	public  string			elitePicture;
	public  string			eliteDescription;
	public  int				eliteCost;
	public  int				curEliteBossBlood;
	public  int				eliteFree;

	public  int  attack;   //是否攻击,1=攻击  0=打开界面
	public  int  getFreeTimes;
	public  int  isDead;
	public  int  isRun;
	public  int  crit;
	public  int  commonFreeOnce;
	public  int  eliteFreeOnce;
	public  object[]  attackReward;
	public  object[] deadReward;
	public  int     dropGems; 

	public int GetCurCost(int bossType)
	{
		if(bossType==1)
		{
			if(dailyFree>0||commonFree>0){return 0;}else{return commonCost;}
		}
		else
		{
			if(eliteFree>0){return 0;}else{return eliteCost;}
		}
	}

	public void ClearAttackData()
	{
		attack=0;
		getFreeTimes=0;
		isDead=0;
		isRun=0;
		crit=0;
		attackReward=null;
		deadReward=null;
		// dropGems=0;
	}

	public long GetStartOpenTimeUnix()
	{
		System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
		DateTime dt=DateTime.Now;
		long startOpenTimeUnix=(long)(new System.DateTime(dt.Year,dt.Month,dt.Day,GetOpenStartHour(),GetOpenStartMin(),0)-startTime).TotalSeconds;
		return startOpenTimeUnix;
	}
	public long GetEndOpenTimeUnix()
	{
		System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
		DateTime dt=DateTime.Now;
		long endOpenTimeUnix=(long)(new System.DateTime(dt.Year,dt.Month,dt.Day,GetOpenEndHour(),GetOpenEndMin(),0)-startTime).TotalSeconds;
		return endOpenTimeUnix;
	}

	private int GetOpenStartHour()
	{
		string[] strs=openTime.Split('-');
		if(strs.Length>0)
		{
			return int.Parse((strs[0].Split(':'))[0]);
		}
		return DateTime.Now.Hour;
	}
	private int GetOpenStartMin()
	{
		string[] strs=openTime.Split('-');
		if(strs.Length>0)
		{
			return int.Parse((strs[0].Split(':'))[1]);
		}
		return DateTime.Now.Minute;
	}
	private int GetOpenEndHour()
	{
		string[] strs=openTime.Split('-');
		if(strs.Length>0)
		{
			return int.Parse((strs[1].Split(':'))[0]);
		}
		return DateTime.Now.Hour;
	}
	private int GetOpenEndMin()
	{
		string[] strs=openTime.Split('-');
		if(strs.Length>0)
		{
			return int.Parse((strs[1].Split(':'))[1]);
		}
		return DateTime.Now.Minute;
	}

}

