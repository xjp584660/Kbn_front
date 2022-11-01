using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using System.Text;

using _Global = KBN._Global;
using MenuMgr = KBN.MenuMgr;
using UnityNet = KBN.UnityNet;
using FTEMgr = KBN.FTEMgr;

public sealed class DailyQuestManager
{
    private List<DailyQuestDataAbstract> quests = new List<DailyQuestDataAbstract>();

#if DEBUG_DAILY_QUEST
    public HashObject FakeData { get; private set; }

    public void LoadFakeData()
    {
        var textAsset = Resources.Load("FakeData/DailyQuests/DailyQuests") as TextAsset;
        if (textAsset == null)
        {
            FakeData = new HashObject();
            return;
        }
        
        FakeData = JSONParse.ParseStatic(textAsset.text);
    }
#endif

    #region Static interface
    public static DailyQuestManager Instance { get; private set; }

    public static void MakeInstance()
    {
        if (Instance != null)
        {
            throw new NotSupportedException("An instance of DailyQuestManager already exists.");
        }
        
        Instance = new DailyQuestManager();
    }

    public static void ClearInstance()
    {
        Instance = null;
    }
    #endregion

    #region Interface
    public void InitDataWithHashObject(HashObject ho)
    {
#if DEBUG_DAILY_QUEST
        ho = FakeData["getSeedResponse"];
#endif

        if (ho == null)
        {
            ho = new HashObject();
        }

        int count = _Global.GetObjectKeys(ho).Length;

        quests.Clear();
        for (int i = 0; i < count; ++i)
        {
            var questNode = ho[_Global.ap + i];
            quests.Add(DailyQuestDataAbstract.CreateWithHashObject(questNode));
        }
    }

    public void ReqUpdateData()
    {
#if DEBUG_DAILY_QUEST
        OnReceiveData(FakeData["updateResponse"]);
#else
        UnityNet.DoRequest("updateDailyQuests.php", new WWWForm(), new Action<HashObject>(OnReceiveData), null);
#endif
    }

    public void CheckQuestProgress(DailyQuestType type, object progressData)
    {
		if (FTEMgr.isFTERuning())
		{
			return;
		}

        foreach (var quest in quests)
        {
            if (quest.Type != type || quest.RewardClaimed)
            {
                continue;
            }

            quest.CheckProgress(progressData);
        }
    }

    public void ReqClaimQuestReward(int questId, Action<HashObject, DailyQuestDataAbstract> okFunc)
    {
        
        Action<HashObject> onQuestRewardClaimed = delegate (HashObject ho)
        {
            if (ho == null)
            {
                return;
            }

            DailyQuestDataAbstract currentQuest = null;
            foreach (var quest in quests)
            {
                if (quest.Id == questId)
                {
                    quest.RewardClaimed = true;
                    currentQuest = quest;
                    break;
                }
            }

            if (currentQuest != null)
            {
                ShowClaimToastAndAddItems(currentQuest);
            }

            if (okFunc != null)
            {
                okFunc(ho, currentQuest);
            }
            
            MenuMgr.instance.sendNotification(Constant.Notice.DailyQuestRewardClaimed, questId);
        };

#if DEBUG_DAILY_QUEST
        onQuestRewardClaimed(FakeData["claimRewardResponse"]);
#else
        WWWForm form = new WWWForm();
        form.AddField("questId", questId.ToString());
        UnityNet.DoRequest("claimDailyQuestRewards.php", form, onQuestRewardClaimed, null);
#endif
    }

    public DailyQuestDataAbstract[] Quests
    {
        get
        {
            return quests.ToArray();
        }
    }

    public DailyQuestDataAbstract[] UnclaimedQuests
    {
        get
        {
            List<DailyQuestDataAbstract> unclaimedQuests = new List<DailyQuestDataAbstract>();

            int canClaimIndex = -1;
            foreach (var quest in quests)
            {
                if (quest.RewardClaimed)
                {
                    continue;
                }

                if (quest.CanClaim)
                {
                    unclaimedQuests.Insert(++canClaimIndex, quest);
                }
                else
                {
                    unclaimedQuests.Add(quest);
                }
            }
            return unclaimedQuests.ToArray();
        }
    }

    public bool CanClaimAny
    {
        get
        {
            foreach (var quest in quests)
            {
                if (quest.CanClaim)
                {
                    return true;
                }
            }

            return false;
        }
    }
    #endregion

    #region Private methods
    private DailyQuestManager()
    {
#if DEBUG_DAILY_QUEST
        LoadFakeData();
#endif
    }

    private void OnReceiveData(HashObject ho)
    {
        if (ho == null)
        {
            return;
        }

        ho = ho["dailyQuests"];
        if (ho == null)
        {
            return;
        }

        for (int i = 0; i < quests.Count; ++i)
        {
            if (quests[i].RewardClaimed)
            {
                continue;
            }

            bool found = false;
            foreach (var key in _Global.GetObjectKeys(ho))
            {
                var questNode = ho[key];
                if (_Global.INT32(questNode["id"]) == quests[i].Id)
                {
                    found = true;
                    quests[i].UpdateDoneCount(_Global.INT32(questNode["doneCnt"]));
                    break;
                }
            }

            if (!found)
            {
                quests[i].RewardClaimed = true;
            }
        }

        MenuMgr.instance.sendNotification(Constant.Notice.DailyQuestDataUpdated, null);
    }

    private void ShowClaimToastAndAddItems(DailyQuestDataAbstract quest)
    {
        var sb = new StringBuilder();
        sb.Append(KBN.Datas.getArString("QuestsModal.ClaimReward"));
        sb.Append("\n");
        for (int i = 0; i < quest.Rewards.Length; ++i)
        {
            var reward = quest.Rewards[i];
            sb.AppendFormat("{0}: {1}  ", KBN.Datas.getArString("itemName.i" + reward.ItemId), reward.ItemCount);
            if (i > 0 && i % 2 == 0)
            {
                sb.Append("\n");
            }

            KBN.MyItems.singleton.AddItemWithCheckDropGear(reward.ItemId, reward.ItemCount);
        }

        MenuMgr.instance.PushDailyQuestRewardMessage(sb.ToString(), quest);
    }
    #endregion
}
