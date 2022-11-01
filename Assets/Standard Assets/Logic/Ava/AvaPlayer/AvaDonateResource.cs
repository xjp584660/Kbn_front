
using KBN;
using KBN.DataTable;
using UnityEngine;

public class AvaDonateResource
{
	public long Food
	{
		get;
		set;
	}

	public long Ore
	{
		get;
		set;
	}

	public long Wood
	{
		get;
		set;
	}
	
	public long Stone
	{
		get;
		set;
	}

	public long Glod
	{
		get;
		set;
	}

	public long FoodToAp()
	{
		return CountToAp( Constant.ResourceType.FOOD, Food );
	}

	public long OreToAp()
	{
		return CountToAp( Constant.ResourceType.IRON, Ore );
	}

	public long WoodToAp()
	{
		return CountToAp( Constant.ResourceType.LUMBER, Wood );
	}

	public long StoneToAp()
	{
		return CountToAp( Constant.ResourceType.STONE, Stone );
	}

	public long GoldToAp()
	{
		return CountToAp( Constant.ResourceType.GOLD, Glod );
	}

	public long ToAp()
	{
		return FoodToAp() + OreToAp() + WoodToAp() + StoneToAp () + GoldToAp();
	}

	public static long ApLimit(int allianceLevel, int type)
	{
		GDS_AllianceUpgrade upgradeGds = GameMain.GdsManager.GetGds<GDS_AllianceUpgrade>();
		AllianceUpgrade upgradeGdsItem = upgradeGds.GetItemById(allianceLevel);

		switch( type )
		{
		case Constant.ResourceType.FOOD:
			return upgradeGdsItem.Food_limit;

		case Constant.ResourceType.IRON:
			return upgradeGdsItem.Ore_limit;

		case Constant.ResourceType.LUMBER:
			return upgradeGdsItem.Wood_limit;

		case Constant.ResourceType.STONE:
			return upgradeGdsItem.Stone_limit;

		case Constant.ResourceType.GOLD:
			return upgradeGdsItem.Gold_limit;
		}

		return 0;
	}

	public static long ApToCount( int type, long ap )
	{
		AllianceDonate gdsItem = AllianceDonateGdsItem( type );

		if( ap < gdsItem.AP )
			return 0;

		return Mathf.FloorToInt( ap / gdsItem.AP ) * gdsItem.Donation;

	}

	public static long CountToAp( int type, long count )
	{
		AllianceDonate gdsItem = AllianceDonateGdsItem( type );

		if( count < gdsItem.Donation )
			return 0;

		return Mathf.FloorToInt( count/gdsItem.Donation ) * gdsItem.AP;
	}

	public static int DonateUnit( int type )
	{
		AllianceDonate donateItem = AllianceDonateGdsItem( type );

		return donateItem.Donation;
	}

	private static AllianceDonate AllianceDonateGdsItem( int type )
	{
		GDS_AllianceDonate donateGds = GameMain.GdsManager.GetGds<GDS_AllianceDonate>();

		string key = string.Empty;
		switch( type )
		{
		case	Constant.ResourceType.FOOD:
			key = "Food";
			break;

		case	Constant.ResourceType.IRON:
			key = "Ore";
			break;

		case	Constant.ResourceType.LUMBER:
			key = "Wood";
			break;

		case	Constant.ResourceType.STONE:
			key = "Stone";
			break;

		case	Constant.ResourceType.GOLD:
			key = "Gold";
			break;
		}

		return donateGds.GetItemById(key);
	}
	
}


