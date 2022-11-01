
using System;
using KBN;
using KBN.DataTable;
using System.Collections.Generic;
using System.Linq;

public class AvaAllianceSkill{

	public delegate void OnUpgradeOk();
	public delegate void OnUpgradeError(int errorCode, string errorMsg);

	public class Requirement
	{
		public const int LevelTag = 1;
		public const int SkillTag = 2;

		public int AllianceLevel;
		public List<KeyValuePair<int, int>> Skills; //key: skillId, value: skillLevel

		public Requirement()
		{
			Skills = new List<KeyValuePair<int, int>>();
		}
	}

	public class Cost
	{
		public const int EapTag = 1;
		public int Eap;
 	}

	private readonly int _id;
	private int _level;
	private int _maxLevel;

	public AvaAllianceSkill( int id, int level )
	{
		_id = id;
		_level = level;

		InitByGds();
	}

	public int Id
	{
		get
		{
			return _id;
		}
	}

	public int Level
	{
		get
		{
			return _level;
		}

		set
		{
			if( _level == value )
				return;

			_level = value;
			InitByGds();
		}
	}

	public int BuffId
	{
		get;
		private set;
	}

	public int Duration
	{
		get;
		private set;
	}

	public int NextLevelBuffId
	{
		get;
		private set;
	}

	public AvaAllianceSkill.Requirement ToNextLevelRequirement
	{
		get;
		private set;
	}

	public AvaAllianceSkill.Cost ToNextLevelCost
	{
		get;
		private set;
	}

	public int MaxLevel
	{
		get
		{
			if( _maxLevel == 0 )
			{
				_maxLevel = GetMaxLevel();
			}
			return _maxLevel;
		}
	}

	public BuffScene Scene
	{
		get;
		private set;
	}

	public int Value
	{
		get;
		private set;
	}

	public BuffValueType ValueType
	{
		get;
		private set;
	}

	public int NextLevelValue
	{
		get;
		private set;
	}
	
	public BuffValueType NextLevelValueType
	{
		get;
		private set;
	}


	public void Upgrade( int allianceId, OnUpgradeOk onUpgradeOk, OnUpgradeError onUpgradeError )
	{
		PBMsgReqAllianceSkillUpgrade.PBMsgReqAllianceSkillUpgrade request = new PBMsgReqAllianceSkillUpgrade.PBMsgReqAllianceSkillUpgrade();
		
		Action<byte[]> responseOk = delegate( byte[] data ){
			GameMain.Ava.Alliance.ExpendablePoint -= ToNextLevelCost.Eap;
			Level ++;

			if( onUpgradeOk != null ){
				onUpgradeOk();
			}
		};

		Action<object, object> responseError = delegate( object errorMsg, object errorCode ){
			int intErrCode;
			int.TryParse( (string) errorCode, out intErrCode );

			string strErrMsg = (string)errorMsg;
			if( intErrCode == 4312 ){//4312: magic ; Level not match
				int intLevel;
				if( int.TryParse( strErrMsg, out intLevel ) ){
					Level = intLevel;
				}
			}

			if( onUpgradeError != null ){
				onUpgradeError( intErrCode, strErrMsg );
			}
		};
		request.allianceId = allianceId;
		request.skillId = Id;
		request.skillNextLevel = Level + 1;
		UnityNet.RequestForGPB("allianceSkillUpgrade.php", request, responseOk, responseError);
	}

	public static List<int> SkillIds()
	{
		List<int> skillIds = new List<int>();

		GDS_AllianceSkill skillGds = GameMain.GdsManager.GetGds<GDS_AllianceSkill>();
		Dictionary<string, IDataItem>.ValueCollection  items = skillGds.GetItems();

		foreach( var item in items )
		{
			AllianceSkill skill = ( AllianceSkill ) item;

			if( skillIds.Contains( skill.ID ) )
				continue;

			skillIds.Add( skill.ID );
		}

		return skillIds;
	}

	private void InitByGds()
	{
		GDS_AllianceSkill skillGds = GameMain.GdsManager.GetGds<GDS_AllianceSkill>();
		AllianceSkill skillItem = skillGds.GetItemById( Id.ToString(), Level.ToString() );
		AllianceSkill nextLevelSkillItem = skillGds.GetItemById( Id.ToString(), (Level + 1).ToString() );

		if( skillItem != null ){
			BuffId = skillItem.BUFF_ID;
			Duration = skillItem.DURATION;
			GDS_Buff buffGds = GameMain.GdsManager.GetGds<GDS_Buff>();
			Buff buff = buffGds.GetItemById( BuffId );
			Scene = ( BuffScene ) Enum.Parse( typeof( BuffScene ), buff.SCENE.ToString() );
			ValueType = ( BuffValueType ) Enum.Parse( typeof( BuffValueType ) , buff.VALUE_TYPE.ToString() );
			Value = buff.VALUE;
		}

		if( nextLevelSkillItem != null ){
			ToNextLevelRequirement = ParseRequirement( nextLevelSkillItem.REQS );
			ToNextLevelCost = ParseCost( nextLevelSkillItem.COSTS );
			NextLevelBuffId = nextLevelSkillItem.BUFF_ID;

			GDS_Buff buffGds = GameMain.GdsManager.GetGds<GDS_Buff>();
			Buff buff = buffGds.GetItemById( nextLevelSkillItem.BUFF_ID );
			NextLevelValueType = ( BuffValueType ) Enum.Parse( typeof( BuffValueType ) , buff.VALUE_TYPE.ToString() );
			NextLevelValue = buff.VALUE;
		}

		if( _level == 0 ){
			if( nextLevelSkillItem != null ){
				int level1BuffId = nextLevelSkillItem.BUFF_ID;

				GDS_Buff buffGds = GameMain.GdsManager.GetGds<GDS_Buff>();
				Buff buff = buffGds.GetItemById( level1BuffId );
				Scene = ( BuffScene ) Enum.Parse( typeof( BuffScene ), buff.SCENE.ToString() );
			}
		}
	
	}

	private AvaAllianceSkill.Requirement ParseRequirement(string requirementStr)
	{
		AvaAllianceSkill.Requirement req = new AvaAllianceSkill.Requirement();

		string[] items = requirementStr.Split('*');
		foreach( string item in items )
		{
			string[] fields = item.Split('_');
			int tag;
			int.TryParse( fields[0], out tag );

			switch( tag )
			{
			case AvaAllianceSkill.Requirement.LevelTag:
				int.TryParse( fields[1], out req.AllianceLevel );
				break;

			case AvaAllianceSkill.Requirement.SkillTag:
				int skillId, skillLevel;
				int.TryParse( fields[1], out skillId );
				int.TryParse( fields[2], out skillLevel );
				req.Skills.Add( new KeyValuePair<int, int>( skillId, skillLevel ) );
				break;
			}
		}

		return req;
	}

	private AvaAllianceSkill.Cost ParseCost(string costStr)
	{
		AvaAllianceSkill.Cost cost = new AvaAllianceSkill.Cost();

		string[] items = costStr.Split('*');
		foreach( string item in items )
		{
			string[] fields = item.Split('_');
			int tag;
			int.TryParse( fields[0], out tag );
			
			switch( tag )
			{
			case AvaAllianceSkill.Cost.EapTag:
				int.TryParse( fields[1], out cost.Eap );
				break;

			}
		}

		return cost;
	}

	private int GetMaxLevel()
	{
		GDS_AllianceSkill skillGds = GameMain.GdsManager.GetGds<GDS_AllianceSkill>();
		
		string skillIdStr = Id.ToString();
		int level = 1;
		while ( skillGds.GetItemById( skillIdStr, level.ToString() ) != null )
		{
			level ++;
		}
		
		return level - 1;
	}

}
