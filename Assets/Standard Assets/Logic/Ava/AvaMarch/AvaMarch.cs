using KBN;
using System.Collections.Generic;
using UnityEngine;

public partial class AvaMarch : AvaModule
{
	private List<AvaBaseMarch> m_MarchList = new List<AvaBaseMarch>();
	private List<PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList.MarchInfo> m_IncomingAttackList 
		= new List<PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList.MarchInfo> ();

	private PBMsgAvaTileTroops.PBMsgAvaTileTroops m_TileTroopInfo
		= new PBMsgAvaTileTroops.PBMsgAvaTileTroops ();

	public List<AvaBaseMarch> MarchList
	{
		get { return m_MarchList; }
	}
    public List<PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList.MarchInfo> IncomingAttackList
    {
        get
        {
            return m_IncomingAttackList;
        }
    }

	public PBMsgAvaTileTroops.PBMsgAvaTileTroops TileTroopInfo
	{
		get
		{
			return m_TileTroopInfo;
		}
	}

	public AvaMarch(AvaManager avaEntry)
		: base(avaEntry)
	{
	}
	

	public override void Init()
	{
#if DEBUG_AVA_COOP
        FakeRallyAttackData(m_MarchList);
#endif
	}
	
	public override void Update()
	{
		bool removedMarch = false;

		for(int i=0;i<m_MarchList.Count;i++)
		{
			AvaBaseMarch march = m_MarchList[i];
			march.Update();
			if(Constant.AvaMarchStatus.DELETED == march.Status)
			{
				m_MarchList.Remove(march);
				removedMarch = true;
			}
		}

		if (removedMarch)
			MenuMgr.instance.SendNotification(Constant.Notice.AvaMarchRemoved, null);
	}

	public List<AvaBaseMarch> GetRallyAttackList()
	{
		List<AvaBaseMarch> rallyAttackList = new List<AvaBaseMarch> ();
		AvaBaseMarch march;
		for(int i=0;i<m_MarchList.Count;i++)
		{
			march = m_MarchList[i];
			if (Constant.AvaMarchType.RALLYATTACK != march.MarchData.marchType)
			{
                continue;
            }

            if (march.Status != Constant.AvaMarchStatus.RALLYING && march.Status != Constant.AvaMarchStatus.OUTBOUND)
            {
                continue;
            }

            if (march.MarchData.rallyAttackInfo == null)
            {
                continue;
            }

		    rallyAttackList.Add(march);
		}
		return rallyAttackList;
	}

    public AvaBaseMarch GetMarchById(int id)
    {
        if (this.m_MarchList == null)
        {
            return null;
        }

		for(int i=0;i<m_MarchList.Count;i++)
		{
			if(id == m_MarchList[i].MarchData.marchId)
			{
				return m_MarchList[i];
			}
		}
        return null;
    }
	
    public PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList.MarchInfo GetIncomingAttackById(int id)
    {
        if (this.m_IncomingAttackList == null)
        {
            return null;
        }

        for (int i = 0; i < m_IncomingAttackList.Count; ++i)
        {
            if (id == m_IncomingAttackList[i].marchId)
            {
                return m_IncomingAttackList[i];
            }
        }
        return null;
    }

	public List<AvaBaseMarch> GetMyMarchList()
	{
		List<AvaBaseMarch> myMarchList = new List<AvaBaseMarch> ();
		AvaBaseMarch march;
		int myUserId = AvaEntry.Seed.UserId;
		for(int i=-0;i<m_MarchList.Count;i++)
		{
			march = m_MarchList[i];
			if(Constant.AvaMarchType.RALLYATTACK == march.Type)
			{
				AvaRallyAttack rallyAttack = (AvaRallyAttack)march;
                if(rallyAttack.HasJoin())
				{
					myMarchList.Add(march);
				}
			}
			else
			{
				myMarchList.Add(march);
			}
		}
		return myMarchList;
	}

#if DEBUG_AVA_COOP
    private static void FakeRallyAttackData(List<AvaBaseMarch> marchList)
    {
        for (int i = 0; i < 50; ++i)
        {
            var rallyInfo = new PBMsgAVAMarchList.PBMsgAVAMarchList.RallyAttackInfo();
            rallyInfo.rallyNumber = 10;
            rallyInfo.leaveTime = 1419050755;

            for (int j = 0; j < Random.Range(1, rallyInfo.rallyNumber + 1); ++j)
            {
                var tmpPlayer = new PBMsgAVAMarchList.PBMsgAVAMarchList.RallyPlayerInfo();
                tmpPlayer.knightName = Random.Range(1, 6).ToString();
                tmpPlayer.knightCityOrder = 1;
                tmpPlayer.playerName = "PlayerName" + j;
                tmpPlayer.playerId = j + 925;
                tmpPlayer.role = (j == 0 ? 1 : 2);
                tmpPlayer.arrivalTime = 1419090755;
                
                for (int k = 0; k < Random.Range(1, 20); ++k)
                {
                    var tmpUnit = new PBMsgAVAMarchList.PBMsgAVAMarchList.Unit();
                    tmpUnit.count = (k + 1) * Random.Range(100, 500);
                    tmpUnit.unitId = k + 1;
                    tmpPlayer.unitlist.Add(tmpUnit);
                }

                for (int k = 0; k < Random.Range(0, 5); ++k)
                {
                    var tmpHero = new PBMsgAVAMarchList.PBMsgAVAMarchList.HeroInfo();
                    tmpHero.heroId = k * 1000 + 1;
                    tmpHero.heroTypeId = k + 201;
                    tmpHero.level = k + 1;
                    tmpPlayer.herolist.Add(tmpHero);
                }
                
                rallyInfo.rallyPlayerList.Add(tmpPlayer);
            }
            
            var march = new PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo();
            march.rallyAttackInfo = rallyInfo;
            march.marchType = Constant.AvaMarchType.RALLYATTACK;
            march.marchId = i + 925;
            march.marchTimestamp = 1418868295;
            march.destinationEta = 1419910755;
            march.fromPlayerId = i + 1;
            march.fromPlayerName = "FromPlayer";
            march.marchStatus = Constant.AvaMarchStatus.OUTBOUND;
            march.toTileType = Random.Range(Constant.TileType.TILE_TYPE_AVA_PLAYER, Constant.TileType.TILE_TYPE_AVA_LAST + 1);
            march.toXCoord = i + 1;
            march.toYCoord = 2 * i + 1;
            march.fromXCoord = i + 4;
            march.fromYCoord = i + 6;

            marchList.Add(new AvaRallyAttack(march));
        }
    }
#endif

	public AvaBaseMarch AddMarch(PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo marchData)
	{
		AvaBaseMarch march = null;
		switch(marchData.marchType)
		{
		case Constant.AvaMarchType.ATTACK:
			march = new AvaAttack(marchData);
			break;
		case Constant.AvaMarchType.REINFORCE:
			march = new AvaReinforce(marchData);
			break;
		case Constant.AvaMarchType.SCOUT:
			march = new AvaScout(marchData);
			break;
		case Constant.AvaMarchType.RALLYATTACK:
			march = new AvaRallyAttack(marchData);
			break;
		case Constant.AvaMarchType.RALLYREINFORCE:
			march = new AvaRallyReinforce(marchData);
			break;
		}
		if(march != null)
		{
			AddMarch(march);
		}
		return march;
	}
	
	public void AddMarch(AvaBaseMarch march)
	{
		m_MarchList.Add (march);
	}

	public override void Clear()
	{
		m_MarchList.Clear ();
	}

	public void ClearMarchList()
	{
		m_MarchList.Clear ();
		MenuMgr.instance.SendNotification(Constant.Notice.AvaGetMarchListOK, null);
	}

	public long GetMaxTroops(Knight knight)
	{
		var effect = AvaEntry.PlayerSkill.GetPlayerSkill(1).GetEffects();
		int skillEffect = effect[2];

		int knightEffect = 0;
		if (null != knight)
			knightEffect = GearManager.Instance().GetKnightTroop(knight);

		// GDS_AllianceSkill 表里的22技能是增加Ava March发兵上限的buff
		int allianceSkillBuffValue = GameMain.Ava.Alliance.GetSkillBuffValue(22);

		return skillEffect + knightEffect + allianceSkillBuffValue;
	}


	//Net
	public void RequestMarch(PBMsgReqAVA.PBMsgReqAVA.ReqMarchInfo marchInfo)
	{
		if(AvaEntry.Event.CurStatus != AvaEvent.AvaStatus.Combat)
		{
			return;
		}
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		//cmd scmd
		request.cmd = 3;
		request.subcmd = 1;
		request.reqMarchInfo = marchInfo;
		UnityNet.RequestForGPB("ava.php", request, OnMarchOK, null);
	}

	private void OnMarchOK(byte[] data)
	{
		PBMsgAVAMarch.PBMsgAVAMarch response = _Global.DeserializePBMsgFromBytes<PBMsgAVAMarch.PBMsgAVAMarch>(data);
		byte[] byMarch = _Global.SerializePBMsg2Bytes<PBMsgAVAMarch.PBMsgAVAMarch.MarchInfo>(response.marchinfo);
		PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo marchData = _Global.DeserializePBMsgFromBytes<PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo>(byMarch);
		AvaBaseMarch marchInfo = AddMarch (marchData);

		//update main chrome
		if (null != marchInfo)
			MenuMgr.instance.SendNotification(Constant.Notice.AvaMarchOK, marchInfo);
		//update Units
		AvaEntry.Units.RequestAvaUnits ();
		SoundMgr.instance().PlayEffect( "kbn tournament 2.1 marching", "Audio/Pvp/");

		if( response.marchinfo.marchType == Constant.AvaMarchType.SCOUT ) {
			SoundMgr.instance().PlayMusic("ScoutSlower v4", false, "Audio/Ava/");
			GameMain.singleton.setCurMusicName("ScoutSlower v4", "Audio/Ava/");
			GameMain.singleton.setLastMusicName("kbn_desertmap_music_final", "Audio/Ava/");
			GameMain.singleton.setLoopCntOfCurMusic(1);
		} else if( response.marchinfo.marchType == Constant.AvaMarchType.ATTACK ) {
			SoundMgr.instance().PlayMusic("AttackSlower v3", false, "Audio/Ava/");
			GameMain.singleton.setCurMusicName("AttackSlower v3", "Audio/Ava/");
			GameMain.singleton.setLastMusicName("kbn_desertmap_music_final", "Audio/Ava/");
			GameMain.singleton.setLoopCntOfCurMusic(1);
		}
	}

	public void RequestMarchList()
	{
		if(AvaEntry.Event.CurStatus != AvaEvent.AvaStatus.Combat)
		{
			return;
		}
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		request.cmd = 3;
		request.subcmd = 2;
		UnityNet.RequestForGPB("ava.php", request, OnGetMarchListOK, null,true);
	}

	private void OnGetMarchListOK(byte[] data)
	{
		m_MarchList.Clear ();
		if (data == null)
		{
			MenuMgr.instance.SendNotification(Constant.Notice.AvaGetMarchListOK, null);
			return;
		}
		PBMsgAVAMarchList.PBMsgAVAMarchList allMarch = _Global.DeserializePBMsgFromBytes<PBMsgAVAMarchList.PBMsgAVAMarchList>(data);
		for(int i=0;i<allMarch.marchlist.Count;i++)
		{
			AddMarch(allMarch.marchlist[i]);
		}

#if DEBUG_AVA_COOP
        FakeRallyAttackData(m_MarchList);
#endif

		MenuMgr.instance.SendNotification(Constant.Notice.AvaGetMarchListOK, null);
	}

	public void RequestIncommingAttackList()
	{
		if(AvaEntry.Event.CurStatus != AvaEvent.AvaStatus.Combat)
		{
			return;
		}
#if DEBUG_AVA_INCOMING_ATTACKS
        var fakeData = new PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList();
        for (int i = 0; i < 20; ++i)
        {
            var march = new PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList.MarchInfo();
            march.marchId = i + 1;
            march.destinationEta = 1419406008 + i * 100;
            march.toTileType = i + 1;
            march.toXCoord = i * 20;
            march.toYCoord = i * 30;
            march.marchType = i % 2 == 0 ? Constant.AvaMarchType.ATTACK : Constant.AvaMarchType.RALLYATTACK;
            march.fromPlayerName = "From player name " + march.marchId;

            for (int j = 0; j < Random.Range(0, 11); ++j)
            {
                var unit = new PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList.Unit();
                unit.unitId = j + 1;
                unit.count = (j + 1) * 1000;
                march.unitlist.Add(unit);
            }

            for (int j = 0; j < Random.Range(0, 8); ++j)
            {
                var tech = new PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList.Tech();
                tech.Id = j + 1;
                tech.level = j + 1;
                march.techlist.Add(tech);
            }

            for (int j = 0; j < Random.Range(0, 5); ++j)
            {
                var hero = new PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList.HeroInfo();
                hero.heroTypeId = 201 + j;
                hero.level = j * 2 + 1;
                march.herolist.Add(hero);
            }

            fakeData.marchlist.Add(march);
        }

        OnGetInCommingAttackListOK(_Global.SerializePBMsg2Bytes<PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList>(fakeData));
#else
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		request.cmd = 3;
		request.subcmd = 4;
		UnityNet.RequestForGPB("ava.php", request, OnGetInCommingAttackListOK, null,true);
#endif
	}

	private void OnGetInCommingAttackListOK(byte[] data)
	{
		m_IncomingAttackList.Clear ();
		if(data == null)
		{
			MenuMgr.instance.SendNotification(Constant.Notice.AvaIncomingAttackListRefreshed, null);
			return;
		}
		PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList allIncommingAttack = _Global.DeserializePBMsgFromBytes<PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList>(data);
		if(allIncommingAttack == null)
			return;
		m_IncomingAttackList = allIncommingAttack.marchlist;
        MenuMgr.instance.SendNotification(Constant.Notice.AvaIncomingAttackListRefreshed, null);
	}

	public void RequestTileInfo(int tileId)
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		//cmd scmd
		request.cmd = 2;
		request.subcmd = 3;
		request.tileTroops = new PBMsgReqAVA.PBMsgReqAVA.TileTroops();
		request.tileTroops.tileId = tileId;
		UnityNet.RequestForGPB("ava.php", request, OnTileInfoOK, null);
	}
	
	private void OnTileInfoOK(byte[] data)
	{
		PBMsgAvaTileTroops.PBMsgAvaTileTroops msgAvaTileTroops = _Global.DeserializePBMsgFromBytes<PBMsgAvaTileTroops.PBMsgAvaTileTroops>(data);
		m_TileTroopInfo = msgAvaTileTroops;
		MenuMgr.instance.SendNotification(Constant.Notice.AvaTileTroopsOk, null);
	}

	public void RequestMarchRecall(int recallMarchId)
	{
		AvaBaseMarch march = GetMarchById (recallMarchId);
		if(march!=null)
		{
			march.RequestRecallMarch ();
		}
	}
	
	public static string getMarchStatusString(int status)
	{
		string marchStatus;
		switch (status) 
		{
		case Constant.AvaMarchStatus.OUTBOUND:
			marchStatus = Datas.getArString("Common.Marching");
			break;
		case Constant.AvaMarchStatus.DEFENDING:
			marchStatus = Datas.getArString("Common.Defending");
			break;
		case Constant.AvaMarchStatus.RETURNING:
		case Constant.AvaMarchStatus.SITUATION_CHANGED:
			marchStatus = Datas.getArString("Common.Returning");
			break;
		default:
			marchStatus = Datas.getArString("Common.Undefined");
			break;
		}
		return marchStatus;
	}

	public static string getMarchTypeString(int type)
	{
		string strMarchType = "";
		switch(type)
		{
		case Constant.AvaMarchStatus.OUTBOUND:
			strMarchType  = Datas.getArString("Common.Marching");
			break;
		case Constant.AvaMarchStatus.WAITING_FOR_REPORT:
			strMarchType  = Datas.getArString("March.WaitForReport");
			break;
		case Constant.AvaMarchStatus.RETURNING:
			strMarchType = Datas.getArString("Common.Returning");
			break;
		case Constant.AvaMarchStatus.DEFENDING:
			strMarchType = Datas.getArString("Common.Defending");
			break;
		}
		return strMarchType;
	}
	
	public static bool IsAvaMarch(int marchType)
	{
		bool ret = false;
		switch (marchType)
		{
		case Constant.AvaMarchType.ATTACK:
		case Constant.AvaMarchType.REINFORCE:
		case Constant.AvaMarchType.SCOUT:
		case Constant.AvaMarchType.RALLYATTACK:
		case Constant.AvaMarchType.RALLYREINFORCE:
			ret = true;
			break;
		default:
			ret = false;
			break;
		}
		return ret;
	}
}
