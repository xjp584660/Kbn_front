using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

using UnityNet = KBN.UnityNet;
using Datas = KBN.Datas;
using GameMain = KBN.GameMain;
using _Global = KBN._Global;
using MyItems = KBN.MyItems;

public class EventCenter {
    private static  EventCenter singleton;
    private List<HashObject> eventList = new List<HashObject>();
	private List<HashObject> seasonEventList = new List<HashObject>();
    private HashObject curEventDetailInfo;
    private List<HashObject> curPageRankListData = new List<HashObject>();
    private int curPage;
    private int totalPage;
	private EventCenterAwardInfo awardInfo;

    

	private class Classification {
		public static readonly string[] ColorBackground = {
			"event_chompion",
			"event_gem",
			"event_platinum",
			"event_gold",
			"event_silver",
			"event_bronze",
			"event_ore",
			"event_stone",
			"event_wood",
		};

		private List<string> name;
		private List<int> minRank;
		private List<int> maxRank;

		public Classification(HashObject data)
		{
			name = new List<string>();
			minRank = new List<int>();
			maxRank = new List<int>();

			for (int i = 0; i < data.Table.Count; i++) {
				HashObject obj = data[_Global.ap + i] as HashObject;
				name.Add(obj["classname"].Value as string);
				minRank.Add(_Global.INT32(obj["minRank"]));
				maxRank.Add(_Global.INT32(obj["maxRank"]));
			}
		}

		public int GetClassification(int rank) 
		{
			for (int i = 0; i < name.Count; i++) {
				if (rank <= minRank[i] && rank >= maxRank[i])
					return i;
			}
			return -1;
		}

		public string GetClassificationName(int cls) 
		{
			if (cls < 0 || cls >= name.Count) 
				return null;
			return name[cls];
		}

		public HashObject[] CreatePageList(HashObject ranking)
		{
			if (null == ranking) 
				return null;
			object[] arr = _Global.GetObjectValues(ranking["rank"]);
			List<HashObject> ret = new List<HashObject>();

			for (int i = 0; i < arr.Length; i++) {
				HashObject obj = arr[i] as HashObject;
				int c = GetClassification(_Global.INT32(obj["rank"]));
				if (c >= 0 && c < name.Count) {
					obj["image"] = new HashObject();
					obj["image"].Value = ColorBackground[c] + "2";
				}
				ret.Add(obj);
			}
			ret.Sort(new RankDataComparer());

			return ret.ToArray();
		}

		public void SetBackgroundFileNames(HashObject cls)
		{
			if (null == cls) 
				return;

			for (int i = 0; i < cls.Table.Count; i++) {
				HashObject obj = cls[_Global.ap + i] as HashObject;
				obj["image"] = new HashObject();
				obj["image"].Value = ColorBackground[i] + "1";
			}
		}

		public void ClassifyMyScore(HashObject myScore)
		{
			if (null == myScore)
				return;

			if (null == myScore["class"]) {
				myScore["class"] = new HashObject();
				myScore["class"].Value = GetClassification(_Global.INT32(myScore["rank"])).ToString();
			}
		}
	}
	private Classification classification;

    public HashObject FakeData { get; set; }
    
    public static EventCenter getInstance()
    {
        if(singleton == null){
            singleton = new EventCenter();
            GameMain.singleton.resgisterRestartFunc(new Action(delegate () {
                singleton = null;
            }));
        }
        return singleton;
    }

#if DEBUG_EVENTCENTER
    private void LoadFakeData()
    {
        var textAsset = Resources.Load("FakeData/EventCenter/SpendAndGet") as TextAsset;
        if (textAsset == null)
        {
            FakeData = new HashObject();
            return;
        }

        FakeData = JSONParse.ParseStatic(textAsset.text);
    }
#endif


    public bool HaveEvent()
    {
        if(GameMain.singleton.getSeed()["geEvent"] != null) 
            return true;
        return false;
    }
    
    public void setEventListData(HashObject data)
    {
        eventList.Clear();
        seasonEventList.Clear();
        object[] tempArray = _Global.GetObjectValues(data["events"]);
        for(int i=0; i < tempArray.Length; i++)
        {
            eventList.Add(tempArray[i] as HashObject);
        }

        tempArray = _Global.GetObjectValues(data["seasons"]);
        for(int i=0; i < tempArray.Length; i++)
        {
			HashObject obj = tempArray[i] as HashObject;
			obj["image"] = new HashObject();
			obj["image"].Value = "EventSeasons";

            seasonEventList.Add(obj);
        }

#if DEBUG_EVENTCENTER
        LoadFakeData();
        eventList.Add(FakeData["BasicInfo"]);
#endif
    }
    
    public HashObject[] getEventListData()
    {
        return eventList.ToArray();
    }

	public HashObject[] getSeasonEventListData()
	{
		return seasonEventList.ToArray();
	}

	public HashObject[] getAllEventListData()
	{
		List<HashObject> allEvents = new List<HashObject>();

		//领奖时间过了不显示列表 也不能加入到ScrollList里 不然会有空格
		List<HashObject> seasonEventListTemp = new List<HashObject>();
		long curTime = GameMain.unixtime ();
		for(int i=0; i < seasonEventList.Count; i++)
		{
			HashObject obj = seasonEventList[i] as HashObject;
			long rewardEndTime = _Global.INT64(obj["rewardEndTime"]);
			if(rewardEndTime > curTime)
			{
				seasonEventListTemp.Add(obj);
			}
		}
		allEvents.AddRange(seasonEventListTemp);
		allEvents.AddRange(eventList);

		return allEvents.ToArray();
	}
    
    public void setCurEventDetailInfo(HashObject data)
    {
        curEventDetailInfo = data;
        if(data["ranking"] != null)
        {
            setRankCurPage(_Global.INT32(data["ranking"]["page"]));
            setRankTotalPage(_Global.INT32(data["ranking"]["total"]));
            setCurEventCurPageData(data["ranking"]);
        }
    }

	public void setClassification(HashObject data)
	{
		classification = (null == data["classification"] ? null : new Classification(data["classification"]));
	}
    
    public HashObject getCurEventDetailInfo()
    {
        return curEventDetailInfo;
    }
    
    public HashObject getOneEventData(string Id)
    {
        for(int i=0;i<eventList.Count;i++)
        {
            HashObject eventItem = eventList[i];
            if(_Global.GetString(eventItem["eventId"]) == Id)
            {
                return eventList[i];
            }
        }
        return null;
    }

	public HashObject getOneSeaonEventData(string Id)
	{
		for(int i=0;i<seasonEventList.Count;i++)
		{
			HashObject eventItem = seasonEventList[i];
			if(_Global.GetString(eventItem["seasonId"]) == Id)
			{
				return seasonEventList[i];
			}
		}
		return null;
	}
    
    public void setCurEventCurPageData(HashObject data)
    {
        curPageRankListData.Clear();
        object[] tempArray = _Global.GetObjectValues(data["ranks"]);
        for(int i=0; i < tempArray.Length; i++)
        {
            curPageRankListData.Add(tempArray[i] as HashObject);
        }
        SortRankData();
        curPage = _Global.INT32(data["page"]);
    }
    
    public HashObject[] getCurEventCurPageList()
    {
        if(curPageRankListData.Count > 0)
            return curPageRankListData.ToArray();
        else
            return null;
    }
    
    public void setRankCurPage(int page)
    {
        curPage = page;
    }
    
    public int getRankCurPage()
    {
        return curPage;
    }
    
    public void setRankTotalPage(int page)
    {
        totalPage = page;
    }
    
    public int getRankTotalPage()
    {
        return totalPage;
    }
    
    public void setPrizeListData(HashObject data)
    {       
		awardInfo = new EventCenterAwardInfo();
		object[] tempArrayRankReward = _Global.GetObjectValues(data["reward"]["rankReward"]);
		for(int i=0; i < tempArrayRankReward.Length; i++)
		{   
			HashObject hashItem = tempArrayRankReward[i] as HashObject;
			int itemID = _Global.INT32(hashItem["itemId"]);
			int itemQty = _Global.INT32(hashItem["quantity"]);
			EventCenterGroupRewardItem item = new EventCenterGroupRewardItem(itemID,itemQty);
			
			awardInfo.rankRewardList.Add(item);
			MyItems.singleton.AddItem(itemID, itemQty);
		}

		object[] tempArrayScoreReward = _Global.GetObjectValues(data["reward"]["scoreReward"]);
		for(int i=0; i < tempArrayScoreReward.Length; i++)
		{
			HashObject hashItem = tempArrayScoreReward[i] as HashObject;
			int itemID = _Global.INT32(hashItem["itemId"]);
			int itemQty = _Global.INT32(hashItem["quantity"]);
			EventCenterGroupRewardItem item = new EventCenterGroupRewardItem(itemID,itemQty);
			
			awardInfo.scoreRewardList.Add(item);
			MyItems.singleton.AddItem(itemID, itemQty);
		}

		if(tempArrayRankReward.Length == 0 && tempArrayScoreReward.Length == 0)
		{
			object[] tempArray = _Global.GetObjectValues(data["reward"]);
			for(int i=0; i < tempArray.Length; i++)
			{   
				HashObject hashItem = tempArray[i] as HashObject;
				int itemID = _Global.INT32(hashItem["itemId"]);
				int itemQty = _Global.INT32(hashItem["quantity"]);
				EventCenterGroupRewardItem item = new EventCenterGroupRewardItem(itemID,itemQty);
				
				awardInfo.scoreRewardList.Add(item);
				MyItems.singleton.AddItem(itemID, itemQty);
			} 
		}
    }
    
    public void setEventItemPrizeInfo(string eventId,string prizeStatus)
    {
        HashObject eventItem = getOneEventData(eventId);
        eventItem["prize"].Value = prizeStatus;
    }
    
	public EventCenterAwardInfo getPrizeListData()
    {
		return awardInfo;
    }
	
    private class RankDataComparer : IComparer<HashObject> {
        public int Compare(HashObject objA, HashObject objB) {
            return _Global.INT32(objA["rank"]).CompareTo(_Global.INT32(objB["rank"]));
        }
    }
    
    public void SortRankData()
    {
        curPageRankListData.Sort(new RankDataComparer());
    }

    private class EventListComparer : IComparer<HashObject> {
        public int Compare(HashObject objA, HashObject objB) {
            return _Global.INT32(objA["priority"]).CompareTo(_Global.INT32(objB["priority"]));
        }
    }
    
    public void SortEventList()
    {
        
        //priority
        eventList.Sort(new EventListComparer());
        
        long curTime = GameMain.unixtime();
        HashObject eventItem;
        HashObject itemTemp;
        //new
        for(int i =0;i<eventList.Count;i++)
        {
            eventItem = eventList[i] as HashObject;
            long startTime = _Global.INT64(eventItem["startTime"]);
            if(curTime < startTime)
            {
                itemTemp = new HashObject();
                itemTemp = eventItem;
                eventList.RemoveAt(i);
                eventList.Insert(0, itemTemp);
            }
        }
        //doing
        for(int j =0;j<eventList.Count;j++)
        {
            eventItem = eventList[j] as HashObject;
            //long startTime1 = _Global.INT64(eventItem["startTime"]);
            //long endTime = _Global.INT64(eventItem["endTime"]);
            if(curTime > _Global.INT64(eventItem["startTime"]) && curTime <= _Global.INT64(eventItem["endTime"]))
            {
                itemTemp = new HashObject();
                itemTemp = eventItem;
                eventList.RemoveAt(j);
                eventList.Insert(0, itemTemp);
            }
        }
        //award
        for(int k =0;k<eventList.Count;k++)
        {
            eventItem = eventList[k] as HashObject;
            if(_Global.GetString(eventItem["prize"]) == Constant.EventCenter.PrizeStatus.PRIZE)
            {
                itemTemp = new HashObject();
                itemTemp = eventItem;
                eventList.RemoveAt(k);
                eventList.Insert(0, itemTemp);
            }
        }
        
    }

    
    /*
        server response
        {"ok":true,"events":[{"eventId":"44","status":"1","priority":"1","viewDetail":"0","eventType":"1","rewardType":"1","image":"BossFights_icon","startTime":"1355194200","endTime":"1355196600","rewardEndTime":"1355207400","prize":"0","name":"boss fight-003","desc1":"boss fight-003~~boss fight-003~~boss fight-003~~","desc2":"boss fight-003~~boss fight-003~~boss fight-003~~boss fight-003~~boss fight-003~~boss fight-003~~","scoreName":"boss-003"}]
    */
    public void reqGetEventList(MulticastDelegate resultFunc)
    {
        List<string> webData = new List<string>(); 
        webData.Add("list");
        string language = Datas.singleton.getGameLanguageAb();
        webData.Add(language);   
        Action<HashObject> okFunc = delegate (HashObject result)
        {
            if(_Global.GetBoolean(result["ok"].Value))
            {
                setEventListData(result);
                SortEventList();
                if(resultFunc != null)
                    resultFunc.DynamicInvoke();
            }    
        };
        UnityNet.reqGetEventList(webData.ToArray(), okFunc, null);
    }

    //--world boss event start--

    private HashObject curBossEventDetailInfo;
    private List<HashObject> curBossPageRankListData = new List<HashObject>();
    private int curBossPage;
    private int totalBossPage;

    //获取世界boss活动详情
    public void reqGetBossEventDetailInfo(int eventId, MulticastDelegate resultFunc)
    {
        List<string> webData = new List<string>(); 
        webData.Add("detail");
        webData.Add(eventId.ToString());    
        Action<HashObject> okFunc = delegate (HashObject result)
        {
            if(_Global.GetBoolean(result["ok"].Value))
            {
                if(result["event"] != null)
                {
                    setCurBossEventDetailInfo(result["event"]);
                    if(resultFunc != null)
                    {
                        resultFunc.DynamicInvoke(getCurBossEventDetailInfo(),
                                                 getCurBossEventCurPageList());
                    }
                }
            }
        };
        UnityNet.reqGetBossEventDetailInfo(webData.ToArray(), okFunc, null);
    }

    public void setCurBossEventDetailInfo(HashObject data)
    {
        curBossEventDetailInfo = data;
        if(data["ranking"] != null)
        {
            setBossRankCurPage(_Global.INT32(data["ranking"]["page"]));
            setBossRankTotalPage(_Global.INT32(data["ranking"]["total"]));
            setCurBossEventCurPageData(data["ranking"]);
        }
    }

    public void setCurBossEventCurPageData(HashObject data)
    {
        curBossPageRankListData.Clear();
        object[] tempArray = _Global.GetObjectValues(data["ranks"]);
        for(int i=0; i < tempArray.Length; i++)
        {
            curBossPageRankListData.Add(tempArray[i] as HashObject);
        }
        SortBossRankData();
        curBossPage = _Global.INT32(data["page"]);
    }

    public HashObject getCurBossEventDetailInfo()
    {
        return curBossEventDetailInfo;
    }

    public void SortBossRankData()
    {
        curBossPageRankListData.Sort(new RankDataComparer());
    }
    
    public HashObject[] getCurBossEventCurPageList()
    {
        if(curBossPageRankListData.Count > 0)
            return curBossPageRankListData.ToArray();
        else
            return null;
    }

    public void setBossRankCurPage(int page)
    {
        curBossPage = page;
    }
    
    public int getBossRankCurPage()
    {
        return curBossPage;
    }
    
    public void setBossRankTotalPage(int page)
    {
        totalBossPage = page;
    }
    
    public int getBossRankTotalPage()
    {
        return totalBossPage;
    }
    //获取世界boss排行信息
    public void reqGetBossPageOfRanking(int page,string eventId,MulticastDelegate resultFunc)
    {
        List<string> webData = new List<string>(); 
        webData.Add("ranking");
        webData.Add(eventId);
        webData.Add(page.ToString());   
        Action<HashObject> okFunc = delegate (HashObject result)
        {
            if(_Global.GetBoolean(result["ok"].Value))
            {
                if(_Global.GetBoolean(result["ranking"] != null))
                {
                    setCurBossEventCurPageData(result["ranking"]);
                    setBossRankCurPage(_Global.INT32(result["ranking"]["page"]));
                    setBossRankTotalPage(_Global.INT32(result["ranking"]["total"]));
                    if(resultFunc != null)
                    {
                        resultFunc.DynamicInvoke(getBossRankCurPage(),getBossRankTotalPage(),getCurBossEventCurPageList());
                    }
                }
                else
                {
                    curBossPageRankListData.Clear();
                }
            }
        };
        UnityNet.reqGetBossEventPageOfRanking(webData.ToArray(), okFunc, null);
    }

    //--world boss event end--
    
    /*
        {"ok":true,"event":{"eventId":"44","viewDetail":"0","rewardType":"1","rewardEndTime":"1355207400","ranking":{"page":1,"total":1,"ranks":[{"score":"6572","name":"PadDefault","rank":"1"},{"score":"1644","name":"4sw1","rank":"2"},{"score":"564","name":"Za6","rank":"3"},{"score":"96","name":"za4","rank":"4"}],"myScore":{"score":"0","name":"Tttrrr"}}}}
    */
    
    public void reqGetEventDetailInfo(string eventId, MulticastDelegate resultFunc)
    {
        List<string> webData = new List<string>(); 
        webData.Add("detail");
        string language = Datas.singleton.getGameLanguageAb();
        webData.Add(language);   
        webData.Add(eventId);    
        Action<HashObject> okFunc = delegate (HashObject result)
        {
            if(_Global.GetBoolean(result["ok"].Value))
            {
                if(result["event"] != null)
                {
                    setCurEventDetailInfo(result["event"]);
                    if(resultFunc != null)
                    {
                        resultFunc.DynamicInvoke(getOneEventData(_Global.GetString(result["event"]["eventId"])),
                                                 getCurEventDetailInfo(),
                                                 getCurEventCurPageList());
                    }
                }
            }
        };
#if DEBUG_EVENTCENTER
        if (eventId == "99999")
        {
            LoadFakeData();
            okFunc(FakeData["DetailInfo"]);
            return;
        }
#endif
        UnityNet.reqGetEventDetailInfo(webData.ToArray(), okFunc, null);
    }
    
    public void reqGetPageOfRanking(int page,string eventId,MulticastDelegate resultFunc)
    {
        List<string> webData = new List<string>(); 
        webData.Add("ranking");
        webData.Add(eventId);
        webData.Add(page.ToString());   
        Action<HashObject> okFunc = delegate (HashObject result)
        {
            if(_Global.GetBoolean(result["ok"].Value))
            {
                if(_Global.GetBoolean(result["ranking"] != null))
                {
                    setCurEventCurPageData(result["ranking"]);
                    setRankCurPage(_Global.INT32(result["ranking"]["page"]));
                    setRankTotalPage(_Global.INT32(result["ranking"]["total"]));
                    if(resultFunc != null)
                    {
                        resultFunc.DynamicInvoke(getRankCurPage(),getRankTotalPage(),getCurEventCurPageList());
                    }
                }
                else
                {
                    curPageRankListData.Clear();
                }
            }
        };
        UnityNet.reqGetEventPageOfRanking(webData.ToArray(), okFunc, null);
    }
    
	public void reqGetSeasonEventDetailInfo(string seasonId, MulticastDelegate resultFunc)
	{
		List<string> webData = new List<string>(); 
		webData.Add("detail");
		webData.Add(seasonId);    
		Action<HashObject> okFunc = delegate (HashObject result)
		{
			if(_Global.GetBoolean(result["ok"].Value))
			{
				setClassification(result);
				if (null == classification || null == result["ranking"]) 
					return;

				classification.ClassifyMyScore(result["ranking"]["myScore"]);
				HashObject[] page = classification.CreatePageList(result["ranking"]);
				if(resultFunc != null)
				{
					resultFunc.DynamicInvoke(getOneSeaonEventData(_Global.GetString(result["seasonId"])),
					                         result, page);
				}
			}
		};
		UnityNet.reqGetSeasonEventInfo(webData.ToArray(), okFunc, null);
	}

	public void reqGetPageOfSeasonRanking(int page, string seasonId, MulticastDelegate resultFunc)
	{
		if (null == classification) 
			return;

		List<string> webData = new List<string>(); 
		webData.Add("ranking");
		webData.Add(seasonId);
		webData.Add(page.ToString());   
		Action<HashObject> okFunc = delegate (HashObject result)
		{
			if(_Global.GetBoolean(result["ok"].Value))
			{
				int curPage = _Global.INT32(result["page"]);
				int totalPage = _Global.INT32(result["total"]);
				HashObject[] pageList = classification.CreatePageList(result);
				classification.ClassifyMyScore(result["myScore"]);

				if(resultFunc != null)
				{
					resultFunc.DynamicInvoke(curPage,totalPage,pageList);
				}
			}
		};
		UnityNet.reqGetSeasonEventInfo(webData.ToArray(), okFunc, null);
	}

	public void reqGetSeasonClassifications(string seasonId, MulticastDelegate resultFunc)
	{
		List<string> webData = new List<string>();
		webData.Add("class");
		webData.Add(seasonId);
		Action<HashObject> okFunc = delegate (HashObject result)
		{
			if(_Global.GetBoolean(result["ok"].Value))
			{
				if(resultFunc != null && result["classification"] != null && classification != null)
				{
					classification.SetBackgroundFileNames(result["classification"]);
					resultFunc.DynamicInvoke(result);
				}
			}
		};
		UnityNet.reqGetSeasonEventInfo(webData.ToArray(), okFunc, null);
	}

    public void reqGetPrize(string eventId,MulticastDelegate resultFunc)
    {
        List<string> webData = new List<string>(); 
        webData.Add("claim");
        webData.Add(eventId);
        Action<HashObject> okFunc = delegate (HashObject result)
        {
            if(_Global.GetBoolean(result["ok"].Value))
            {
                if(resultFunc != null)
                {
                    setPrizeListData(result);
                    setEventItemPrizeInfo(_Global.GetString(result["eventId"]),_Global.GetString(result["prize"]));
                    
					resultFunc.DynamicInvoke(getPrizeListData());
                }
            }
        };
        UnityNet.reqGetEventPrize(webData.ToArray(), okFunc, null);
    }

    public void ReqClaimSpendNGetReward(int eventId, int milestoneIndex, Action<HashObject> okFunc)
    {
        Hashtable payload = new Hashtable();
        payload.Add("eventId", eventId);
        payload.Add("type", "claim");
        payload.Add("milestoneIndex", milestoneIndex);

        Action<HashObject> okFuncWrapper = delegate (HashObject result)
        {
            setEventItemPrizeInfo(_Global.GetString(result["eventId"]),_Global.GetString(result["prize"]));
            if (okFunc == null)
            {
                return;
            }
            okFunc(result);
        };
        
#if DEBUG_EVENTCENTER
        LoadFakeData();
        okFuncWrapper(FakeData["ClaimResult"]);
#else
        UnityNet.reqWWW("eventcenter.php", payload, okFuncWrapper, null);
#endif
    }
}
