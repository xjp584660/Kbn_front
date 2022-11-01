using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using System.Text;

using _Global = KBN._Global;
using MenuMgr = KBN.MenuMgr;
using UnityNet = KBN.UnityNet;
using KBN;

public class PassMissionQuestManager
{
    public static PassMissionQuestManager instance;

    public static PassMissionQuestManager Instance()
    {
        if(instance == null)
        {
            instance = new PassMissionQuestManager();
        }

        return instance;
    }

	private List<PassMissionQuestDataAbstract> fixedQuests = new List<PassMissionQuestDataAbstract>();
    private List<PassMissionQuestDataAbstract> randomQuests = new List<PassMissionQuestDataAbstract>();
    private Dictionary<int, PassMissionQuestDataAbstract> quests = new Dictionary<int, PassMissionQuestDataAbstract>();
    private long seasonRefreshTime = 0;

    public void InitPassMissionQuests(HashObject seed)
    {
        if(seed == null)
        {
            seed = new HashObject();
        }

        int count = _Global.GetObjectKeys(seed).Length;

        randomQuests.Clear();
        fixedQuests.Clear();
        quests.Clear();

        for (int i = 0; i < count; ++i)
        {
            HashObject questNode = seed[_Global.ap + i];

            PassMissionQuestDataAbstract quest = PassMissionQuestDataAbstract.CreateWithHashObject(questNode);

            if(quest.questType == PassMissionQuestType.FixedQuestType)
            {
                fixedQuests.Add(quest);
            }
            else if(quest.questType == PassMissionQuestType.RandomQuestType)
            {
                randomQuests.Add(quest);
            }

            quests.Add(quest.Id, quest);
        }
    }

    public bool HaveCanCaimed()
    {
        var temp = quests.GetEnumerator();
        while(temp.MoveNext())
        {
            if(temp.Current.Value.HasCompleted && !temp.Current.Value.RewardClaimed)
            {
                return true;
            }
        }

        return false;
    }

    // 免费刷新4小时一个
    public long GetFreeRefreshTime()
    {
        HashObject temp = GameMain.singleton.getSeed();
        int refreshTime = _Global.INT32(temp["seasonColdTime"]);
        return seasonRefreshTime + refreshTime - GameMain.unixtime();
    }

    public string FormatTimeTipText()
    {
		if(GetFreeRefreshTime() < 0)
		{
			return string.Format(Datas.getArString("PassMission.FreeRefresh"), 1, _Global.timeFormatStr(0), GetRefreshItemCount());
        }
		else
		{
			return string.Format(Datas.getArString("PassMission.FreeRefresh"), 0, _Global.timeFormatStr(GetFreeRefreshTime()), GetRefreshItemCount());
		}       
    }

    public int GetRefreshItemCount()
    {
        return MyItems.singleton.GetItemCount(Constant.PassMission.RefreshRandomQuestItemId);
    }

    public int GetFixedQuestsCount()
    {
        return fixedQuests.Count;
    }

    public int GetCompletedQuestsCount()
    {
        int count = 0;
        for(int i = 0; i < fixedQuests.Count; ++i)
        {
            if(fixedQuests[i].HasCompleted)
            {
                count++;
            }
        }

        return count;
    }

    public PassMissionQuestDataAbstract[] GetFixedQuests()
    {
        return fixedQuests.ToArray();
    }

    public PassMissionQuestDataAbstract[] GetRandomQuests()
    {
        return randomQuests.ToArray();
    }

    // 刷新随机任务
    public void RefreshRandomQuest(int questId)
    {
        if(quests.ContainsKey(questId))
        {
            if(GetRefreshItemCount() > 0 || GetFreeRefreshTime() < 0)
            {
                // 1免费刷新 2道具刷新4602
                int refreshtype = GetFreeRefreshTime() < 0 ? 1 : 2;

                Action<HashObject> onRefreshRandomQuest = delegate (HashObject ho)
                {
                    if (ho == null)
                    {
                        return;
                    }

                    RemoveRandomQuest(questId);

                    HashObject randomQuest = ho["newTask"];

                    PassMissionQuestDataAbstract newTask = PassMissionQuestDataAbstract.CreateWithHashObject(randomQuest);
                    randomQuests.Add(newTask);

                    quests.Remove(questId);
                    quests.Add(newTask.Id, newTask);

                    seasonRefreshTime = _Global.INT64(ho["seasonRefreshTime"]);
                    if(refreshtype == 2)
                    {
                        MyItems.singleton.subtractItem(Constant.PassMission.RefreshRandomQuestItemId);
                    }
                    
                    MenuMgr.instance.sendNotification(Constant.Notice.PassMissionRefreshRandomQuest, null);
                };     
                
                UnityNet.refreshSeasonTask(questId, refreshtype, Constant.PassMission.RefreshRandomQuestItemId, onRefreshRandomQuest, null);   
            }
            else 
            {
                // 没有刷新物品或者免费刷新次数提示
                ErrorMgr.singleton.PushError("", Datas.getArString("PassMission.RefreshFail"));
            }          
        }
    }

    // 领取任务奖励
    public void ClaimQuestReward(int questId)
    {
        if(quests.ContainsKey(questId))
        {
            Action<HashObject> onPointClaimed = delegate (HashObject ho)
            {
                if (ho == null)
                {
                    return;
                }

                PassMissionQuestDataAbstract temp = quests[questId];
                if(temp.questType == PassMissionQuestType.RandomQuestType)
                {
                    RemoveRandomQuest(questId);

                    HashObject randomQuest = ho["newTask"];

                    PassMissionQuestDataAbstract newTask = PassMissionQuestDataAbstract.CreateWithHashObject(randomQuest);
                    randomQuests.Add(newTask);

                    quests.Remove(questId);
                    quests.Add(newTask.Id, newTask);

                    MenuMgr.instance.sendNotification(Constant.Notice.PassMissionClaimRandomQuestReward, null);
                }
                else
                {              
                    temp.RewardClaimed = true;
                    MenuMgr.instance.sendNotification(Constant.Notice.PassMissionClaimFixedQuestReward, questId);
                } 

                int point = _Global.INT32(ho["point"]);
                MyItems.singleton.AddItem(Constant.PassMission.ApItemId, point);
            };     
             
            UnityNet.claimPassPoint(questId, onPointClaimed, null);   
        }
    }

    public void RemoveRandomQuest(int questId)
    {
        for(int i = 0; i < randomQuests.Count; ++i)
        {
            if(questId == randomQuests[i].Id)
            {
                randomQuests.RemoveAt(i);
            }
        }
    }

    // 拉取任务列表
    public void ReqQuestsData()
    {
        UnityNet.getSeasonDetail(new Action<HashObject>(OnReqQuestsData), null);
    }

    private void OnReqQuestsData(HashObject ho)
    {
        InitPassMissionQuests(ho["tasks"]);
        seasonRefreshTime = _Global.INT64(ho["seasonRefreshTime"]);

        MenuMgr.instance.sendNotification(Constant.Notice.PassMissionReqQuestsData, null);
    }
}
