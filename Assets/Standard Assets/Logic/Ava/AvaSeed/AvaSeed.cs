using KBN;
using System.Collections.Generic;
public partial class AvaSeed : AvaModule
{
	private PBMsgAVASeed.PBMsgAVASeed m_Seed = new PBMsgAVASeed.PBMsgAVASeed ();



	public AvaSeed(AvaManager avaEntry)
		: base(avaEntry)
	{
	}
	
	
	public override void Init()
	{
		Game.Event.RegisterHandler (EventId.AvaMoveTile, OnMoveTileSuccess);
	}
	
	public override void Update()
	{
	}

	public override void Clear()
	{
		Game.Event.UnregisterHandler (EventId.AvaMoveTile, OnMoveTileSuccess);
	}

	public int OccupyTileLimit
	{
		get
		{
			return m_Seed.occupyTileLimit;
		}
	}

    public int EagleEyeLevel
    {
        get
        {
            return m_Seed.eagleEye.levelSpecified ? m_Seed.eagleEye.level : 0;
        }
    }

    public int EmbassyLevel
    {
        get
        {
            return m_Seed.embassy.levelSpecified ? m_Seed.embassy.level : 0;
        }
    }

    public int WatchTowerLevel
    {
        get
        {
            return m_Seed.watchTower.levelSpecified ? m_Seed.watchTower.level : 0;
        }
    }

    public bool CanSeeEnemyResearch
    {
        get
        {
            return m_Seed.watchTower.canSeeEnemyResearchSpecified ? m_Seed.watchTower.canSeeEnemyResearch : false;
        }
    }

	public int MyOutPostTileX
	{
		get
		{
			int myTileIndex = MyOutPostTileId - 1;
			int x = ( myTileIndex % Constant.Map.AVA_MINIMAP_WIDTH ) + 1;
			return x;
		}
	}

	public int MyOutPostTileY
	{
		get
		{
			int myTileIndex = MyOutPostTileId - 1;
			int y = myTileIndex / Constant.Map.AVA_MINIMAP_WIDTH + 1;
			return y;
		}
	}

	public int MyOutPostTileId
	{
		get
		{
			return m_Seed.tileId;
		}
	}

	public int UserId
	{
		get
		{
			return m_Seed.userId;
		}
	}

	public int AllianceId
	{
		get
		{
			return m_Seed.allianceId;
		}
	}

	public int AssignKnightId
	{
		get
		{
			return m_Seed.defenseKnight;
		}
		set
		{
			m_Seed.defenseKnight = value;
		}
	}

    public AllianceEmblemData EnemyEmblemData
    {
        get
        {
            if (m_Seed != null && m_Seed.enemyEmblemInfo != null
                && m_Seed.enemyEmblemInfo.curBanner != null
                && m_Seed.enemyEmblemInfo.curStyle != 0
                && m_Seed.enemyEmblemInfo.curStyleColor != null
                && m_Seed.enemyEmblemInfo.curSymbol != 0
                && m_Seed.enemyEmblemInfo.curSymbolColor != null)
            {
                return new AllianceEmblemData(m_Seed.enemyEmblemInfo.curBanner,
                                              m_Seed.enemyEmblemInfo.curStyle,
                                              m_Seed.enemyEmblemInfo.curStyleColor,
                                              m_Seed.enemyEmblemInfo.curSymbol,
                                              m_Seed.enemyEmblemInfo.curSymbolColor);
            }
            else
            {
                return null;
            }
        }
    }

    public string EnemyAllianceName
    {
        get
        {
            if (m_Seed != null)
            {
                return m_Seed.enemyAllianceName;
            }
            return null;
        }
    }

    public long UserAllianceInitScore
    {
        get
        {
            return m_Seed.allianceScores[0];
        }
    }

    public long EnemyAllianceInitScore
    {
        get
        {
            return m_Seed.allianceScores[1];
        }
    }

	public void InitAllianceIncRate()
	{
		AvaEntry.AvaScoreStats.MyIncreaseRate = UserAllianceIncRate;
		AvaEntry.AvaScoreStats.EnemyIncreaseRate = EnemyAllianceIncRate;
		AvaEntry.AvaScoreStats.UserScore = UserAllianceInitScore;
		AvaEntry.AvaScoreStats.Set_UserScore (UserAllianceInitScore);
		AvaEntry.AvaScoreStats.EnemyScore = EnemyAllianceInitScore;
		AvaEntry.AvaScoreStats.Set_EnemyScore (EnemyAllianceInitScore);
	}

	public float UserAllianceIncRate
	{
		get
		{
			return _Global.FLOAT(m_Seed.scoreIncRate[0]);
		}
	}

	public float EnemyAllianceIncRate
	{
		get
		{
			return _Global.FLOAT(m_Seed.scoreIncRate[1]);
		}
	}

	public List<PBMsgAVASeed.PBMsgAVASeed.Item> SpeedUpItemList()
	{
		List<PBMsgAVASeed.PBMsgAVASeed.Item> retList = new List<PBMsgAVASeed.PBMsgAVASeed.Item> ();
		PBMsgAVASeed.PBMsgAVASeed.Item item = new PBMsgAVASeed.PBMsgAVASeed.Item ();
		for(int i=0;i<ItemList.Count;i++)
		{
			if(null != MyItems.singleton.GetInventoryInfo(ItemList[i].itemId,MyItems.Category.Speed))
			{
				retList.Add(ItemList[i]);
			}
		}
		return retList;
	}

	public List<PBMsgAVASeed.PBMsgAVASeed.Item> ItemList
	{
		get
		{
			return m_Seed.items;
		}
	}

	public int GetItemNum(int itemId)
	{
		for(int i=0;i<m_Seed.items.Count;i++)
		{
			if(itemId == m_Seed.items[i].itemId)
			{
				return m_Seed.items[i].num;
			}
		}
		return 0;
	}

	public bool SubtractItem(int itemId, int num = 1)
	{
		PBMsgAVASeed.PBMsgAVASeed.Item item;
		for(int i=0;i<m_Seed.items.Count;i++)
		{
			item = m_Seed.items[i];
			if(itemId == item.itemId)
			{
				if(item.num >= num)
				{
					item.num -= num;
					return true;
				}
				else
				{
					item.num = 0;
					m_Seed.items.Remove(item);
					return false;
				}
			}

		}
		return false;
	}

	public void RequestAvaSeed()
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		//cmd scmd
		request.cmd = 1;
		request.subcmd = 3;
		UnityNet.RequestForGPB("ava.php", request, OnGetAvaSeedOk, OnGetAvaSeedError);
	}

	public void ConnectedAvaSeed()
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		//cmd scmd
		request.cmd = 1;
		request.subcmd = 3;
		UnityNet.RequestForGPB("ava.php", request, OnConnectedGetAvaSeedOk, OnGetAvaSeedError);
	}

	private void OnConnectedGetAvaSeedOk(byte[] data)
	{
		if(data == null)
			return;
		m_Seed = _Global.DeserializePBMsgFromBytes<PBMsgAVASeed.PBMsgAVASeed> (data);
		
		AvaEntry.AvaScoreStats.ownBigWonderNum = m_Seed.wonderCount.superWonder;
		AvaEntry.AvaScoreStats.ownSmallWonderNum = m_Seed.wonderCount.wonder;
		AvaEntry.AvaScoreStats.enemyBigWonderNum = m_Seed.enemyWonderCount.superWonder;
		AvaEntry.AvaScoreStats.enemySmallWonderNum = m_Seed.enemyWonderCount.wonder;
		
		AvaEntry.TileShare.OwnTotalDataCount = m_Seed.myTileCount;
		InitAllianceIncRate();

		int allianceId = _Global.INT32(GameMain.singleton.getSeed()["player"]["allianceId"].Value);
		GameMain.Ava.Alliance.GetSkillInfoFromServer (allianceId, null);
	}

	private void OnGetAvaSeedOk(byte[] data)
	{
		if(data == null)
			return;
		m_Seed = _Global.DeserializePBMsgFromBytes<PBMsgAVASeed.PBMsgAVASeed> (data);

		AvaEntry.AvaScoreStats.ownBigWonderNum = m_Seed.wonderCount.superWonder;
		AvaEntry.AvaScoreStats.ownSmallWonderNum = m_Seed.wonderCount.wonder;
		AvaEntry.AvaScoreStats.enemyBigWonderNum = m_Seed.enemyWonderCount.superWonder;
		AvaEntry.AvaScoreStats.enemySmallWonderNum = m_Seed.enemyWonderCount.wonder;

		AvaEntry.TileShare.OwnTotalDataCount = m_Seed.myTileCount;

		MenuMgr.instance.SendNotification(Constant.Notice.AvaGetSeedOK, null);
		if(MyOutPostTileId != 0)
		{
			InitAllianceIncRate();
			GameMain.singleton.LoadAVAAnimation();
			KBNMenu mainChrome = MenuMgr.instance.getMenu("MainChrom");
			if (null != mainChrome)
				mainChrome.SetVisible(false);
		}
		else
		{
			//error
			ErrorMgr.singleton.PushError("", Datas.getArString("AVA.cannotgotominimap"));
		}

		int allianceId = _Global.INT32(GameMain.singleton.getSeed()["player"]["allianceId"].Value);
		GameMain.Ava.Alliance.GetSkillInfoFromServer (allianceId, null);
		//GameMain.Ava.Alliance.GetSkillInfoFromServer (Alliance.singleton.myAlliance.allianceId, null);
	}

	private void OnGetAvaSeedError(string errorMessage, string errorCode)
	{
	}

    private const int RallyDetailDisplayLimitDefaultValue = 10;
    public int RallyDetailDisplayLimit
    {
        get
        {
#if DEBUG_AVA_COOP
            m_Seed = new PBMsgAVASeed.PBMsgAVASeed();
#endif
            int ret = m_Seed.rallyDetailDisplayLimit;
            return ret <= 0 ? RallyDetailDisplayLimitDefaultValue : ret;
        }
    }

	private void OnMoveTileSuccess(object sender, GameFramework.GameEventArgs e)
	{
		AvaMoveTileEventArgs ne = e as AvaMoveTileEventArgs;
		m_Seed.tileId = ne.NewXCoord + ( ( ne.NewYCoord - 1 ) * Constant.Map.AVA_MINIMAP_WIDTH );
		GameMain.singleton.onCityMoved( ne.OldXCoord, ne.OldYCoord, ne.NewXCoord, ne.NewYCoord );
	}

    public void UpdateMatchResultIfNeeded(PBMsgAvaMatchMakingResult.PBMsgAvaMatchMakingResult matchMakingResult)
    {
        if (m_Seed.matchMakingResult != null)
        {
            return;
        }

        var tmp = new PBMsgAVASeed.PBMsgAVASeed.MatchMakingResult();
        tmp.enemyAllianceName = matchMakingResult.enemyAllianceName;
        tmp.enemyAllianceRank = matchMakingResult.enemyAllianceRank;
        tmp.enemyAllianceScore = matchMakingResult.enemyAllianceScore;
        tmp.myAllianceName = matchMakingResult.myAllianceName;
        tmp.myAllianceRank = matchMakingResult.myAllianceRank;
        tmp.myAllianceScore = matchMakingResult.myAllianceScore;
        m_Seed.matchMakingResult = tmp;
    }

    public PBMsgAVASeed.PBMsgAVASeed.MatchMakingResult MatchMakingResult
    {
        get
        {
            return m_Seed.matchMakingResult;
        }
    }
}
