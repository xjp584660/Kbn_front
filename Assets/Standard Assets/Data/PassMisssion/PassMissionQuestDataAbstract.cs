using UnityEngine;
using System.Collections;

using _Global = KBN._Global;
using Datas = KBN.Datas;

public enum PassMissionQuestType
{
	FixedQuestType,
	RandomQuestType
};

public class PassMissionQuestDataAbstract
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

	public int Id {get; protected set;}	

	public int taskId {get; protected set;}

	public PassMissionQuestType questType {get; set;}

	public string DesKey {get; protected set;}

	public int DoneCount {get; protected set;}

	public int RequestedCount {get; protected set;}

	public bool RewardClaimed {get; set;}

	public Reward reward {get; protected set;}

	public string IconName {get; protected set;}

	public bool HasCompleted
	{
		get
		{	
			return DoneCount >= RequestedCount;
		}
	}

	public static PassMissionQuestDataAbstract CreateWithHashObject(HashObject ho)
    {
        PassMissionQuestDataAbstract passMission = new PassMissionQuestDataAbstract();
		passMission.Id = _Global.INT32(ho["id"]);
		passMission.taskId = _Global.INT32(ho["taskId"]);
		passMission.DesKey = _Global.GetString(ho["contentKey"]);
		passMission.IconName = _Global.GetString(ho["image"]);
		passMission.DoneCount = _Global.INT32(ho["value"]);
		passMission.RequestedCount = _Global.INT32(ho["targetValue"]);
		passMission.RewardClaimed = _Global.INT32(ho["claimStatus"]) == 1 ? true : false;

		PassMissionQuestDataAbstract.Reward reward = new PassMissionQuestDataAbstract.Reward(Constant.PassMission.ApItemId, _Global.INT32(ho["point"]));
		passMission.reward = reward;
           
        passMission.questType = (PassMissionQuestType)(_Global.INT32(ho["type"]));			

		return passMission;
    }
}
