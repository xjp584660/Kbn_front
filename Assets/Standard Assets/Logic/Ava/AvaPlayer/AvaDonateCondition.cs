using KBN;
using System.Collections.Generic;

public class AvaDonateCondition {

	private const string TitleBuiding = "b";
	private const string TitleAllianceSkill = "as";
	private const string TitlePlayerLevel = "p";
	private const string TitleMight = "m";
	private const string TitleAllianceLevel = "al";

	private List<KeyValuePair<int, int>> _buildings; //key: buildingType; value: building level
	private List<KeyValuePair<int, int>> _allianceSkills;//key: skillId; value: skill level

	public List<KeyValuePair<int, int>> Buildings
	{
		get
		{
			return _buildings ?? ( _buildings = new List<KeyValuePair<int, int>>());
		}
	}

	public List<KeyValuePair<int, int>> AllianceSkills
	{
		get
		{
			return _allianceSkills ?? ( _allianceSkills = new List<KeyValuePair<int, int>>());
		}
	}

	public int PlayerLevel
	{
		get;
		private set;
	}

	public long Might
	{
		get;
		private set;
	}

	public int AllianceLevel
	{
		get;
		private set;
	}


	public AvaDonateCondition( string condition )
	{
		ParseCondition( condition );
	}

	private void ParseCondition( string input )
	{
		if( input == null )
			return;

		string[] conditions = input.Split(';');
		foreach( var condition in conditions )
		{
			if( condition.Length < 2 )
				continue;

			string[] parts = condition.Split('_');
			switch( parts[0] )
			{
			case	TitleBuiding:
				ParseBuilding( parts );
				break;

			case	TitleAllianceSkill:
				ParseAllianceSkill( parts );
				break;

			case	TitlePlayerLevel:
				ParsePlayerLevel( parts );
				break;

			case	TitleMight:
				ParseMight( parts );
				break;

			case	TitleAllianceLevel:
				ParseAllianceLevel( parts );
				break;
			}
		}
	}

	private void ParseBuilding( string[] idLevel )
	{
		if( idLevel.Length < 3 )
			return;

		int id = _Global.INT32( idLevel[1] );
		int lv = _Global.INT32( idLevel[2] );
		Buildings.Add(new KeyValuePair<int, int>( id, lv ));
	}

	private void ParseAllianceSkill( string[] idLevel )
	{
		if( idLevel.Length < 3 )
			return;
		
		int id = _Global.INT32( idLevel[1] );
		int lv = _Global.INT32( idLevel[2] );
		AllianceSkills.Add(new KeyValuePair<int, int>( id, lv ));
	}

	private void ParsePlayerLevel( string[] input )
	{
		if( input.Length < 2 )
			return;

		PlayerLevel = _Global.INT32( input[1] );
	}

	private void ParseMight( string[] input )
	{
		if( input.Length < 2 )
			return;
		
		Might = _Global.INT32( input[1] );
	}

	private void ParseAllianceLevel( string[] input )
	{
		if( input.Length < 2 )
			return;
		
		AllianceLevel = _Global.INT32( input[1] );
	}
                     
}                    
