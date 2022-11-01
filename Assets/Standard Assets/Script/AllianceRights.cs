
using JasonReflection;
using System.Linq;

public class AllianceRights
{
	public enum RightsType
	{
		TickingMember,		//	1
		ChangePosition,		//	2
		ChangeDescription,	//	3
		ChangeJoinCondition,//	4
		AcceptJoin,			//	5
		InvitingMember,		//	6
		SetDiplomacy,		//	7
		SetNoticeBoard,		//	8
		ModerateWall,		//	9
		ViewCoordinates,	//	10
		SendOfficialMessage,//	11
		MakeMVP,			//	12
		
		OfficerChat,        //  13
		AllianceBossMsg,    //  14

		EditAllianceEmblem,	//  15

		UpgradeAllianceSkill, //16
		ImpeachChancellor,             //17 

		AllianceDeployment,   //18

		RightsTypeCnt
	}
	
	static AllianceRights()
	{
		gm_allianceRightsData = new AllianceRightsData();
		gm_allianceRightsData.AllianceRightList = new AllianceRight[7];
		for ( int i = 0; i != gm_allianceRightsData.AllianceRightList.Length; ++i )
			gm_allianceRightsData.AllianceRightList[i] = new AllianceRight();

		for ( int i = 0; i != gm_allianceRightsData.AllianceRightList[0].haveRights.Length; ++i )
		{
			gm_allianceRightsData.AllianceRightList[1].haveRights[i] = true;
			gm_allianceRightsData.AllianceRightList[2].haveRights[i] = true;
		}
			
		gm_allianceRightsData.AllianceRightList[2].haveRights[(int)RightsType.ChangeJoinCondition] = false;
		gm_allianceRightsData.AllianceRightList[2].haveRights[(int)RightsType.ViewCoordinates] = false;
	}

	public class AllianceRight
	{
		public bool[] haveRights;
		public AllianceRight()
		{
			haveRights = new bool[(int)RightsType.RightsTypeCnt];
		}
	}

	private class AllianceRightsData
	{
		public AllianceRight[] AllianceRightList{get;set;}
	}

	private static AllianceRightsData gm_allianceRightsData ;
	
	public static AllianceRight[] Rights
	{
		get{return gm_allianceRightsData.AllianceRightList;}
	}
	
	private class RightsSeedData
	{
		[JasonDataAttribute]
		public System.Collections.Generic.Dictionary<int, int[]> rightsData;
	}

	/// <summary>
	/// Updates this rights data by seed.
	/// </summary>
	/// <param name='ho'>
	/// Ho.the seed data from server.
	/// </param>
	public static bool UpdateBySeed(HashObject ho)
	{
		HashObject hoTmp = new HashObject();
		hoTmp["rightsData"] = ho;

		RightsSeedData rsd = new RightsSeedData();
		if ( !JasonConvertHelper.ParseToObjectOnce(rsd, hoTmp) )
			return false;

		int maxOfficerId = rsd.rightsData.Keys.Max();
		gm_allianceRightsData.AllianceRightList = new AllianceRight[maxOfficerId+1];
		gm_allianceRightsData.AllianceRightList[0] = new AllianceRight();

		foreach ( int officer in rsd.rightsData.Keys )
		{
			AllianceRight rightsItem = new AllianceRight();
			gm_allianceRightsData.AllianceRightList[officer] = rightsItem;
			foreach ( int mask in rsd.rightsData[officer] )
			{
				if(rightsItem.haveRights.Length >= mask)
				rightsItem.haveRights[mask-1] = true;
			}
		}

		return true;
	}

	public static bool IsHaveRights(int officer, RightsType rights)
	{
		return Rights[officer].haveRights[(int)rights];
	}
}
