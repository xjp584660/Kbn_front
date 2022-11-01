using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using System.Text;

using _Global = KBN._Global;
using MenuMgr = KBN.MenuMgr;
using UnityNet = KBN.UnityNet;
using KBN;

public class PassMissionMapManager
{
	public static PassMissionMapManager instance;

    public static PassMissionMapManager Instance()
    {
        if(instance == null)
        {
            instance = new PassMissionMapManager();
        }

        return instance;
    }

    // 地图上每排的个数
    public int NUMBER_OF_ROWS = 11;

	public Dictionary<int, PassMissionMapData> maps = new Dictionary<int, PassMissionMapData>();

	private bool unlockPass = false;

	private int unlockedCount = 0;
	private int allMapCount = 0; 

	private long endTime = 0;
	private int boxRewardId = 0;

	// 0未领取 1已领取
	private int boxRewardClaimState = 0;

	// 0不可领取 1可领取 2已领取
	public int GetBoxRewardState()
	{
		// 0不可领取 1可领取 2已领取
        int claimState = 0;
        if(GetBoxRewardClaimState() == 0)
        {
            claimState = CanClaimBigBox() == true ? 1 : 0;
        }
        else if(GetBoxRewardClaimState() == 1)
        {
            claimState = 2;
        }

		return claimState;
	}

	public int GetBoxRewardClaimState()
	{
		return boxRewardClaimState;
	}

	public int GetAllMapCount()
	{
		return allMapCount;
	}

	public int GetUnlockedCount()
	{
		unlockedCount = 0;
		var mapDatas = maps.GetEnumerator();
		while(mapDatas.MoveNext())
		{
			if(mapDatas.Current.Value.unlockedState == UnlockedState.Unlocked)
			{
				unlockedCount++;
			}
		}

		return unlockedCount;
	}

	public bool CanClaimBigBox()
	{
		return GetUnlockedCount() >= GetAllMapCount();
	}

	public bool CanSeeOpenBtn()
	{
		bool can = false;
		if(endTime != 0 && GameMain.unixtime() < endTime)
		{
			can = true;
		}
		else
		{
			can = false;
		}

		return can;
	}

	public bool GetUnlockPass()
	{
		return unlockPass;
	}

	public long GetPassMissionEntTime()
	{
		return endTime;
	}

	public int GetBoxRewardId()
	{
		return boxRewardId;
	}

	public int GetMyApCount()
	{
		return MyItems.singleton.GetItemCount(Constant.PassMission.ApItemId);
	}

	public int GetUnlockPassItemCount()
	{
		return MyItems.singleton.GetItemCount(Constant.PassMission.OpenPassMissionItemId);
	}

	public void InitPassMissionMap(HashObject getSeed)
	{
		if(getSeed["seasonPassEvent"] == null)
		{
			return;
		}
		
		HashObject seasonPassEvent = getSeed["seasonPassEvent"];
		unlockPass = _Global.GetBoolean(seasonPassEvent["unlockPass"]);

		endTime = _Global.INT64(seasonPassEvent["endTime"]);
		boxRewardId = _Global.INT32(seasonPassEvent["rewards"]);
		boxRewardClaimState = _Global.INT32(seasonPassEvent["claimFinalReward"]);
	}

	public void InitMapData(HashObject getSeed)
	{
		InitMaps();
		HashObject seasonMap = getSeed["seasonMap"];
		UpdateSeasonMapData(seasonMap);
	}

	public void InitMaps()
	{
		maps.Clear();

		GDS_SeasonPassMap gdsSeasonPassMap = GameMain.GdsManager.GetGds<GDS_SeasonPassMap>();
		List<KBN.DataTable.SeasonPassMap> seasonMapList = gdsSeasonPassMap.GetSeasonMaps();
		allMapCount = seasonMapList.Count;

		for(int i = 0; i < seasonMapList.Count; ++i)
		{		
			PassMissionMapData mapData = new PassMissionMapData();
			mapData.mapId = _Global.INT32(seasonMapList[i].LOCATION_ID);
			mapData.costAp = _Global.INT32(seasonMapList[i].COST);
			mapData.unlockedState = UnlockedState.NotUnlocked;

			string rewards = seasonMapList[i].REWARD;
			string[] rewardDatas = rewards.Split(';');
			for(int j = 0; j < rewardDatas.Length; ++j)
			{
				string[] rewardData = rewardDatas[j].Split('_');
				int itemId = _Global.INT32(rewardData[0]);
				int itemCount = _Global.INT32(rewardData[1]);

				SeasonPassMapReward seasonPassMapReward = new SeasonPassMapReward(itemId, itemCount);

				mapData.rewards.Add(seasonPassMapReward);
			}

			if(!maps.ContainsKey(mapData.mapId))
			{
				maps.Add(mapData.mapId, mapData);
			}			
		}
	}

	public void UpdateSeasonMapData(HashObject seasonMap)
	{
		int count = _Global.GetObjectKeys(seasonMap).Length;
		for(int i = 0; i < count; ++i)
		{
			HashObject mapHO = seasonMap[_Global.ap + i];
			int id = _Global.INT32(mapHO["locationId"]);
			int status = _Global.INT32(mapHO["status"]);

			if(maps.ContainsKey(id))
			{
				maps[id].unlockedState = (UnlockedState)status;
				//_Global.LogWarning("Id : " + id + " state : " + status);
			}
		}
	}

	public string SeasonPassTimer()
	{
		long curTime = GameMain.unixtime();
		if(endTime < curTime)
		{
			return _Global.timeFormatStr(0);
		}
		else
		{
			return _Global.timeFormatStr(endTime - curTime);
		} 
	}

	public string FormatTimeTipText()
    {
		long curTime = GameMain.unixtime();
		if(endTime < curTime)
		{
			return string.Format(Datas.getArString("PassMission.EndTime"), _Global.timeFormatStr(0));
		}
		else
		{
			return string.Format(Datas.getArString("PassMission.EndTime"), _Global.timeFormatStr(endTime - curTime));
		}       
    }

	public void unlockMapReward(PassMissionMapData mapData)
	{
		Action<HashObject> onRewardClaimed = delegate (HashObject ho)
        {
            if (ho == null)
            {
                return;
            }

            mapData.unlockedState = UnlockedState.Unlocked;
			for(int i = 0; i < mapData.rewards.Count; ++i)
			{
				SeasonPassMapReward temp = mapData.rewards[i];
				MyItems.singleton.AddItem(temp.ItemId, temp.ItemCount);
			}

			HashObject locationIds = ho["locationIds"];
			int count = _Global.GetObjectKeys(locationIds).Length;
			for(int i = 0; i < count; ++i)
			{
				int id = _Global.INT32(locationIds[_Global.ap + i]);
				if(maps.ContainsKey(id))
				{
					maps[id].unlockedState = UnlockedState.Unlockable;
				}
			}
            
			MyItems.singleton.subtractItem(Constant.PassMission.ApItemId, mapData.costAp);
            MenuMgr.instance.sendNotification(Constant.Notice.PassMissionMapReward, mapData.mapId);
        };

		UnityNet.unlockMapReward(mapData.mapId, onRewardClaimed, null);
	}

	public void claimBoxReward()
	{
		Action<HashObject> onBoxRewardClaimed = delegate (HashObject ho)
        {
            if (ho == null)
            {
                return;
            }

			boxRewardClaimState = 1;
			int rewardId = _Global.INT32(ho["rewards"]);
			MyItems.singleton.AddItem(rewardId);
            MenuMgr.instance.sendNotification(Constant.Notice.PassMissionMapBoxReward, null);
        };

		UnityNet.getSeasonFinalReward(onBoxRewardClaimed, null);
	}

	public void unlockPassSeassion()
	{
		Action<HashObject> onUnlockPass = delegate (HashObject ho)
        {
            if (ho == null)
            {
                return;
            }

			HashObject seasonMap = ho["seasonMap"];
			UpdateSeasonMapData(seasonMap);
			unlockPass = true;
			MyItems.singleton.subtractItem(Constant.PassMission.OpenPassMissionItemId);
            MenuMgr.instance.PopMenu("PassMissionUnlock");
            MenuMgr.instance.PushMenu("PassMissionMenu", Constant.OfferPage.Offer, "trans_zoomComp");
        };

		UnityNet.unlockPass(Constant.PassMission.OpenPassMissionItemId, onUnlockPass, null);
	}
}
