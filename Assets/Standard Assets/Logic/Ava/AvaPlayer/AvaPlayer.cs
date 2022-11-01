using System.Collections.Generic;
using System;
using KBN;
using KBN.DataTable;

public class AvaPlayer : AvaModule
{
	private long _eap;

	public event OnEapChangedDelegate OnEapChanged; 

	public delegate void OnDonateOk();
	public delegate void OnClaimOk();
	public delegate void OnEapChangedDelegate( long oldEap, long newEap );

    public AvaPlayer(AvaManager avaEntry)
        : base(avaEntry)
    {
    }
	
    public long ExpendablePoint
    {
        get
		{
			return _eap;
		}
        set
		{
			if( value == _eap )
				return;

			long old = _eap;
			_eap = value;

			if( OnEapChanged != null )
			{
				OnEapChanged( old, _eap );
			}
		}
    }

	public int UnclaimedPoint
	{
		get;
		set;
	}

	public int AlliesPurchaseAp
	{
		get;
		set;
	}

	public int SelfPurchaseAp
	{
		get;
		set;
	}

	public int StoneAp
	{
		get;
		set;
	}

	public int OreAp
	{
		get;
		set;
	}

	public int WoodAp
	{
		get;
		set;
	}

	public int FoodAp
	{
		get;
		set;
	}

	public int GoldAp
	{
		get;
		set;
	}

	private AvaDonateCondition _donateCondition;
	public AvaDonateCondition DonateCondition
	{

		get
		{
			if( _donateCondition != null )
				return _donateCondition;

			HashObject  gameData = Datas.singleton.getGameData();

			string strCondition = _Global.GetString(gameData["allianceDonateRequirements"]);
			_donateCondition = new AvaDonateCondition(strCondition);

			return _donateCondition;
		}

	}

	private Dictionary<int, int> _itemTimes;
	public Dictionary<int, int> ItemTimes //Key: itemId, value: count
	{
		get
		{
			return _itemTimes ?? ( _itemTimes = new Dictionary<int, int>() );
		}
	}

	public long MaxDonateStone()
	{
		return CanDonateMax( Constant.ResourceType.STONE, StoneAp );
	}

	public long MaxDonateOre()
	{
		return CanDonateMax( Constant.ResourceType.IRON, OreAp );
	}

	public long MaxDonateWood()
	{
		return CanDonateMax( Constant.ResourceType.LUMBER, WoodAp );
	}
	 
	public long MaxDonateFood()
	{
		return CanDonateMax( Constant.ResourceType.FOOD, FoodAp );
	}

	public long MaxDonateGold()
	{
		return CanDonateMax( Constant.ResourceType.GOLD, GoldAp );
	}

	public int DonateItemTime( int itemId )
	{
		if ( ItemTimes.ContainsKey( itemId ) ) 
		{
			return ItemTimes[itemId];
		}

		return 0;
	}

	public void Claim(OnClaimOk onClaimOk)
	{
		Action<HashObject> okFunc = delegate (HashObject result) {
			AlliesPurchaseAp += UnclaimedPoint;
			ExpendablePoint += UnclaimedPoint;
			UnclaimedPoint = 0; 

			if( onClaimOk != null ){
				onClaimOk();
			}
		};

		UnityNet.reqClaimAlliancePoint( UnclaimedPoint, okFunc, null );
	}

	public void DonateItem( int cityId, AvaDonateItem donateItem, OnDonateOk onDonateItemOk)
	{
		PBMsgReqAllianceDonate.PBMsgReqAllianceDonate request = new PBMsgReqAllianceDonate.PBMsgReqAllianceDonate();

		request.cid = cityId;

		Action<byte[]> responseOk = delegate( byte[] data ){

			var result = _Global.DeserializePBMsgFromBytes<PBMsgAllianceDonate.PBMsgAllianceDonate>(data);

			DonateApToAlliance( result.itemAp );
			AvaAlliance alliance = GameMain.Ava.Alliance;
			if( result.levelSpecified ){
				alliance.Level = result.level;
			}
			if( result.capSpecified ){
				alliance.CumulatePoint = result.cap;
			}

			int key = donateItem.Id;
			if( ItemTimes.ContainsKey( key ) ){
				ItemTimes[key] += 1;
			}else{
				ItemTimes.Add( key, 1 );
			}


			MyItems.singleton.subtractItem( donateItem.Id, donateItem.CountPerDonate );

			if( onDonateItemOk != null ){
				onDonateItemOk();
			}

		};
		request.type = 1;// 0: resource, 1: item
		request.itemid = donateItem.Id;
		UnityNet.RequestForGPB("allianceDonate.php", request, responseOk, null);
	}

	public void DonateResource( int cityId, AvaDonateResource res, OnDonateOk onDonateResOk )
	{
		PBMsgReqAllianceDonate.PBMsgReqAllianceDonate request = new PBMsgReqAllianceDonate.PBMsgReqAllianceDonate();

		request.type = 0;// 0: resource, 1: item

		request.food = res.Food;
		request.gold = res.Glod;
		request.ore = res.Ore;
		request.stone = res.Stone;
		request.wood = res.Wood;

		request.cid = cityId;

		Action<byte[]> responseOk = delegate( byte[] data ){

			var result = _Global.DeserializePBMsgFromBytes<PBMsgAllianceDonate.PBMsgAllianceDonate>(data);
			
			StoneAp += result.stoneAp;
			DonateApToAlliance( result.stoneAp );
			
			OreAp += result.oreAp;
			DonateApToAlliance( result.oreAp );
			
			WoodAp += result.woodAp;
			DonateApToAlliance( result.woodAp );
			
			FoodAp += result.foodAp;
			DonateApToAlliance( result.foodAp );
			
			GoldAp += result.goldAp;
			DonateApToAlliance( result.goldAp );

			AvaAlliance alliance = GameMain.Ava.Alliance;
			if( result.levelSpecified ){
				alliance.Level = result.level;
			}
			if( result.capSpecified ){
				alliance.CumulatePoint = result.cap;
			}

			Resource.singleton.addToSeed( Constant.ResourceType.STONE, -1 * res.Stone, cityId );
			Resource.singleton.addToSeed( Constant.ResourceType.IRON, -1 * res.Ore, cityId );
			Resource.singleton.addToSeed( Constant.ResourceType.LUMBER, -1 * res.Wood, cityId );
			Resource.singleton.addToSeed( Constant.ResourceType.FOOD, -1 * res.Food, cityId );
			Resource.singleton.addToSeed( Constant.ResourceType.GOLD, -1 * res.Glod, cityId );
			Resource.singleton.UpdateRecInfo();

			if( onDonateResOk != null ){
				onDonateResOk();
			}

		};

		UnityNet.RequestForGPB("allianceDonate.php", request, responseOk, null);
	}

	public bool PlayerLevelSatisfiedDonation( out int needPlayerLevel )
	{
		int playerLevel = GameMain.singleton.getPlayerLevel();
		needPlayerLevel = DonateCondition.PlayerLevel;
		if( playerLevel < needPlayerLevel )
			return false;

		return true;
	}

	public bool MightStatisfiedDonation( out long needMight )
	{
		long might = GameMain.singleton.getPlayerMight();
		needMight = DonateCondition.Might;
		if( might < needMight )
			return false;

		return true;
	}

	public bool AllianceLevelStatisfiedDonation( out int needAllianceLevel )
	{
		int allianceLevel = GameMain.Ava.Alliance.Level;
		needAllianceLevel = DonateCondition.AllianceLevel;
		if( allianceLevel < needAllianceLevel )
			return false;

		return true;
	}

	public bool BuildingLevelStatisfiedDonation( out int needBuildingType, out int needBuildingLevel )
	{
		needBuildingType = 0;
		needBuildingLevel = 0;

		List<KeyValuePair<int, int>> buildingCondition = DonateCondition.Buildings;
		foreach( var b in buildingCondition )
		{
			needBuildingType = b.Key;
			needBuildingLevel = b.Value;
			
			int buildingMaxLevel = KBN.Building.singleton.getMaxLevelForType(needBuildingType, GameMain.singleton.getCurCityId());
			if( buildingMaxLevel < needBuildingLevel )
				return false;
		}

		return true;
	}

	public bool AllianceSkillLevelStatisfedDonation( out int needAllianceSkillId, out int needAllianceSkillLevel )
	{
		needAllianceSkillId = 0;
		needAllianceSkillLevel = 0;

		List<KeyValuePair<int, int>> allianceSkillCondition = DonateCondition.AllianceSkills;
		foreach( var skillCondition in allianceSkillCondition )
		{
			needAllianceSkillId = skillCondition.Key;
			needAllianceSkillLevel = skillCondition.Value;
			
			int curLevel = GameMain.Ava.Alliance.GetSkillLevel( needAllianceSkillId );
			if( curLevel < needAllianceSkillLevel )
				return false;
		}

		return true;
	}

	public void OnLeaveAlliance()
	{
		ExpendablePoint = 0;
		UnclaimedPoint = 0;
		AlliesPurchaseAp = 0;
		SelfPurchaseAp = 0;
		StoneAp = 0;
		GoldAp = 0;
		WoodAp = 0;
		FoodAp = 0;
		OreAp = 0;

		_donateCondition = null;
		_itemTimes = null;
	}

	private void DonateApToAlliance(int ap)
	{
		AvaAlliance alliance = GameMain.Ava.Alliance;
		alliance.CumulatePoint += ap;
		alliance.ExpendablePoint += ap;
        ExpendablePoint += ap;
	}

	private long CanDonateMax( int resType, long curAp )
	{
		long apLimit = AvaDonateResource.ApLimit( AvaEntry.Alliance.Level, resType );
		long leftAp = apLimit - curAp;

		return AvaDonateResource.ApToCount( resType, leftAp );
	}

    public override void Init()
    {
		HashObject seed = GameMain.singleton.getSeed();
		ExpendablePoint = _Global.INT64(seed["avaPlayerInfo"]["eap"]);
    }

    public override void Update()
    {

    }

    public override void Clear()
    {

    }
}
