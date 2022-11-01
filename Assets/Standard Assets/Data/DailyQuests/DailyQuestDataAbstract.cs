using UnityEngine;
using System.Collections;

using _Global = KBN._Global;
using Datas = KBN.Datas;

public abstract class DailyQuestDataAbstract
{
    public class Reward
    {
        public int ItemId { get; private set; }
        public int ItemCount { get; private set; }

        public Reward(int itemId, int itemCount)
        {
            ItemId = itemId;
            ItemCount = itemCount;
        }
    }
    
    public int Id { get; protected set; }
    
    public string DescKey { get; protected set; }
    
    public object[] DescParams { get; protected set; }
    
    public int DoneCount { get; protected set; }
    
    public int RequestedCount { get; protected set; }
    
    public Reward[] Rewards { get; protected set; }
    
    public bool RewardClaimed { get; set; }

    public abstract DailyQuestType Type { get; }

    public virtual string Desc
    {
        get
        {
            return Datas.GetFormattedString(DescKey, DescParams);
        }
    }

    public bool HasCompleted
    {
        get
        {
            return DoneCount >= RequestedCount;
        }
    }

    public bool CanClaim
    {
        get
        {
            return HasCompleted && !RewardClaimed;
        }
    }

    public virtual void PopulateImageInfo(Label label)
    {
        label.useTile = true;
        label.tile = TextureMgr.instance().IconSpt().GetTile("icon_default");
    }

    public void UpdateDoneCount(int doneCount)
    {
        DoneCount = doneCount;
    }

    public void IncreaseDoneCount(int delta)
    {
        int lastDoneCount = DoneCount;
        DoneCount += delta;
        if (DoneCount > RequestedCount)
        {
            DoneCount = RequestedCount;
        }

        if (DoneCount > lastDoneCount)
        {
            KBN.MenuMgr.instance.SendNotification(Constant.Notice.DailyQuestProgressIncreased);
        }
    }

    public virtual void CheckProgress(object progressData)
    {
        throw new System.NotImplementedException();
    }

    public virtual void RunLink()
    {
        throw new System.NotImplementedException();
    }

    protected void RunLink(string linkType, string param)
    {
        MenuAccessor.LinkerHandleDefaultAction(linkType, param);
    }

    public void ParseParams(HashObject paramsNode)
    {
        var keys = _Global.GetObjectKeys(paramsNode);
        var paramArray = new int[keys.Length];
        for (int i = 0; i < keys.Length; ++i)
        {
            paramArray[i] = _Global.INT32(paramsNode[_Global.ap + i]);
        }
        ParseParams(paramArray);
    }
    
    protected virtual void ParseParams(int[] paramArray)
    {
        // Implement in subclasses
    }

    public static DailyQuestDataAbstract CreateWithHashObject(HashObject ho)
    {
        var type = (DailyQuestType)(_Global.INT32(ho["type"]));
        var ret = CreateEmptyQuestData(type);
        
        ret.Id = _Global.INT32(ho["id"]);
        ret.DescKey = _Global.GetString(ho["descKey"]);
        ret.DoneCount = _Global.INT32(ho["doneCnt"]);
        ret.RequestedCount = _Global.INT32(ho["reqCnt"]);
        ret.ParseParams(ho["params"]);

        string[] keys;
        var descParamsNode = ho["descParams"];
        keys = _Global.GetObjectKeys(descParamsNode);
        ret.DescParams = new object[keys.Length];
        for (int i = 0; i < keys.Length; ++i)
        {
            ret.DescParams[i] = _Global.GetString(descParamsNode[_Global.ap + i]);
        }
        
        var rewardsNode = ho["rewards"];
        keys = _Global.GetObjectKeys(rewardsNode);
        ret.Rewards = new DailyQuestDataAbstract.Reward[keys.Length];
        for (int i = 0; i < keys.Length; ++i)
        {
            var rewardNode = rewardsNode[_Global.ap + i];
            ret.Rewards[i] = new DailyQuestDataAbstract.Reward(_Global.INT32(rewardNode["id"]), _Global.INT32(rewardNode["qty"]));
        }
        
        ret.RewardClaimed = false;
        
        return ret;
    }
    
    private static DailyQuestDataAbstract CreateEmptyQuestData(DailyQuestType type)
    {
        switch (type)
        {
        case DailyQuestType.Building:               return new DailyQuestDataBuilding();
        case DailyQuestType.Training:               return new DailyQuestDataTraining();
        case DailyQuestType.Exploration:            return new DailyQuestDataExploration();
        case DailyQuestType.Pve:                    return new DailyQuestDataPve();
        case DailyQuestType.ResetGear:              return new DailyQuestDataResetGear();
        case DailyQuestType.Gamble:                 return new DailyQuestDataGamble();
        case DailyQuestType.Healing:                return new DailyQuestDataHealing();
        case DailyQuestType.UseGearTierItem:        return new DailyQuestDataUseGearTierItem();
        case DailyQuestType.WorldBoss:              return new DailyQuestDataWorldBoss();
        case DailyQuestType.FightPict:              return new DailyQuestDataFightPict();
        case DailyQuestType.FightPlayer:            return new DailyQuestDataFightPlayer();
        case DailyQuestType.AllianceMarchHelp:      return new DailyQuestDataAllianceMarchHelp();
        case DailyQuestType.ForgeGear:              return new DailyQuestDataForgeGear();
        default: throw new System.ArgumentException("Illegal quest type " + type);
        }
    }
}
