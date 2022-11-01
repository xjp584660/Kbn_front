using UnityEngine;
using System.Collections;
using System.Collections.Generic;

using _Global = KBN._Global;

public class GameEventDetailInfoSpendNGet : GameEventDetailInfoBase
{
    public class Reward
    {
        public int ItemId { get; protected set; }
        public int ClaimableNum { get; set; }

        public Reward(int itemId, int claimableNum)
        {
            ItemId = itemId;
            ClaimableNum = claimableNum;
        }
    }

    public class Milestone
    {
        public int GemsCount { get; protected set; }
        public int Index { get; protected set; }
        public List<Reward> Rewards { get; protected set; }

        public Milestone(int index, int gemsCount, List<Reward> rewards)
        {
            GemsCount = gemsCount;
            Rewards = rewards;
            Index = index;
        }
    }

    public bool IsRepeatable { get; protected set; }

    public int GemsSpent { get; protected set; }

    public List<Milestone> Milestones { get; protected set; }

    public int MaxGemsCount {
        get
        {
            if (Milestones == null || Milestones.Count <= 0)
            {
                return 0;
            }

            return Milestones[Milestones.Count - 1].GemsCount;
        }
    }

    public GameEventDetailInfoSpendNGet(HashObject main, HashObject detail) : base(main, detail)
    {
        var spendNGetNode = detail["spendAndGet"];
        if (spendNGetNode == null)
        {
            spendNGetNode = new HashObject();
        }
        IsRepeatable = _Global.GetBoolean(spendNGetNode["repeatable"]);
        GemsSpent = _Global.INT32(spendNGetNode["gemsSpent"]);
        Milestones = ParseMilestonesData(spendNGetNode["milestones"]);
    }

    private List<GameEventDetailInfoSpendNGet.Milestone> ParseMilestonesData(HashObject milestonesNode)
    {
        if (milestonesNode == null)
        {
            milestonesNode = new HashObject();
        }

        var milestones = new List<GameEventDetailInfoSpendNGet.Milestone>();
        
        var milestonesCount = _Global.GetObjectKeys(milestonesNode).Length;
        for (int i = 0; i < milestonesCount; ++i)
        {
            var milestoneNode = milestonesNode[string.Format("{0}{1}", _Global.ap, i)];
            var rewardsNode = milestoneNode["rewards"];
            var rewards = ParseRewardsData(rewardsNode);
            var milestone = new Milestone(i, _Global.INT32(milestoneNode["gemsCount"]), rewards);
            milestones.Add(milestone);
        }
        
        return milestones;
    }
    
    private List<GameEventDetailInfoSpendNGet.Reward> ParseRewardsData(HashObject rewardsNode)
    {
        if (rewardsNode == null)
        {
            rewardsNode = new HashObject();
        }

        var rewardsCount = _Global.GetObjectKeys(rewardsNode).Length;
        var rewards = new List<GameEventDetailInfoSpendNGet.Reward>();
        
        for (int i = 0; i < rewardsCount; ++i)
        {
            var rewardNode = rewardsNode[string.Format("{0}{1}", _Global.ap, i)];
            var reward = new Reward(_Global.INT32(rewardNode["rewardItemId"]), 
                                    _Global.INT32(rewardNode["claimableItemNum"]));
            
            rewards.Add(reward);
        }
        
        return rewards;
    }
}
