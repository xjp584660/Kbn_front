using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using _Global = KBN._Global;
using Datas = KBN.Datas;

public enum UnlockedState
{
	NotUnlocked,//未解锁
	Unlockable, //可解锁
	Unlocked,   //已解锁			
};

public class SeasonPassMapReward
{
	public int ItemId { get; private set; }
	public int ItemCount { get; private set; }

	public SeasonPassMapReward(int itemId, int itemCount)
	{
		ItemId = itemId;
		ItemCount = itemCount;
	}
}

public class PassMissionMapData 
{
	public int mapId;
	public int costAp;
	public UnlockedState unlockedState;
	public List<SeasonPassMapReward> rewards = new List<SeasonPassMapReward>();


}
