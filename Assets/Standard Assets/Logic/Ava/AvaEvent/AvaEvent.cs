using KBN;
using UnityEngine;
using System.Collections.Generic;

public partial class AvaEvent : AvaModule
{
	public enum AvaStatus
	{
		Idle = 0,
		Prepare,
		Match,
		Frozen,
		Combat,
		EndFrozen,
		ClaimReward,
		Rewward,
		EndIdle
	};

	public enum AvaType
	{
		// 原ava活动
		AVA,
		// 新活动 积分是原来60倍
		GW_WONDER
	}

	public enum GWWonderState
	{
		//没有开启的GW-Wonder
		NotOpen,
		//有开启的GW-Wonder，但是本联盟还没有报名
		OpenAndNotJoin,
		//有开启的GW-Wonder，并且本联盟已经报名
		OpenAndJoin,
	}

	private float m_deltaTime;
	private const int REFRESHTICK = 60;
	private const int ENDFROZENTIME = 60 * 5;
	private const int TIMEINTERAL_7DAY = 3600*24*7;
	private PBMsgAVAEvent.PBMsgAVAEvent m_avaEventData = new PBMsgAVAEvent.PBMsgAVAEvent();
	private AvaStatus m_curStatus;
	private int m_OutPostStatus = 0;
    private const string CachedEventIdKeyFormat = "Ava.Event.CachedId.User_{0}.World_{1}";
	private const string WonderEnd = "WonderEnd";
	private PBMsgAvaMatchMakingResult.PBMsgAvaMatchMakingResult m_MatchData = null;
	private AvaType m_curAvaType;
	public AvaEvent(AvaManager avaEntry)
		: base(avaEntry)
	{
	}

	public override void Init()
	{
		RequestAvaEvent();
	}

	public override void Update()
	{
		//1 fps
		m_deltaTime ++;
		if(m_deltaTime >= REFRESHTICK)
		{
			m_deltaTime = 0;
			RequestAvaEvent();
			GameMain.Ava.March.RequestMarchList();
			GameMain.Ava.March.RequestIncommingAttackList();
		}

		UpdateStatus ();
	}

	public override void Clear()
	{

	}

	public void RequestAvaEvent()
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		request.cmd = 1;
		request.subcmd = 1;
		UnityNet.RequestForGPB("ava.php", request, OnAvaEventOK, OnError,true);
	}

	private void OnAvaEventOK(byte[] data)
	{
		if(data == null)
		{
			return;
		}
		m_avaEventData= _Global.DeserializePBMsgFromBytes<PBMsgAVAEvent.PBMsgAVAEvent>(data);
		m_curAvaType = (AvaType)_Global.INT32(m_avaEventData.mode);
		_Global.LogWarning("AvaEvent mode : " + m_avaEventData.mode);
		_Global.LogWarning("AvaEvent allianceRegion : " + m_avaEventData.allianceRegion);
		_Global.LogWarning("AvaEvent curState : " + m_curStatus);
		_Global.LogWarning("AvaEvent isApply : " + m_avaEventData.isApply);

		MenuMgr.instance.sendNotification(Constant.Notice.AvaEventOK, null);
		UpdateStatus (true);
        var eventId = m_avaEventData.actId;
        var cachedEventIdKey = string.Format(CachedEventIdKeyFormat, Datas.singleton.tvuid().ToString(), Datas.singleton.worldid().ToString());
        if (PlayerPrefs.GetInt(cachedEventIdKey, -1) != eventId)
        {
			Message.Instance.DeleteAvaReportsExcludingEventId(eventId);
            PlayerPrefs.SetInt(cachedEventIdKey, eventId);
			PlayerPrefs.Save();
        }
	}

	private void OnError(string errorMessage, string errorCode)
	{

	}
	
	private bool isRequestMatchMakingResult = false;
	private void UpdateStatus(bool bFirstTime = false)
	{
		long curTime = GameMain.unixtime ();
		bool bChanged = false;
		if(curTime < m_avaEventData.prepareTime && m_curStatus != AvaStatus.Idle)
		{
			m_curStatus = AvaStatus.Idle;
			bChanged = true;
		}
		else if(curTime >= GetSuperWonderProtectTime() && m_curStatus != AvaStatus.EndIdle 
		        && GameMain.singleton.curSceneLev() == GameMain.AVA_MINIMAP_LEVEL)
		{
			if(PlayerPrefs.HasKey(WonderEnd))
			{
				int wonderEnd = PlayerPrefs.GetInt(WonderEnd);
				if(wonderEnd == 1)
				{
					ShowSuperWonderProtectEndTip();
					PlayerPrefs.SetInt(WonderEnd, 0);
				}
			}
			else
			{
				ShowSuperWonderProtectEndTip();
				PlayerPrefs.SetInt(WonderEnd, 0);
			}
		}
		else if(curTime >= m_avaEventData.prepareTime && curTime < m_avaEventData.matchTime && m_curStatus != AvaStatus.Prepare)
		{
            m_curStatus = AvaStatus.Prepare;
			bChanged = true;
			if(!bFirstTime)
			{
				ShowPrepareTip();
			}
		}
		else if(curTime >= m_avaEventData.matchTime && curTime < m_avaEventData.startTime && m_curStatus != AvaStatus.Match)
		{
            m_curStatus = AvaStatus.Match;
			bChanged = true;				
		}
		else if(curTime >= m_avaEventData.matchTime && curTime < m_avaEventData.startTime && m_curStatus == AvaStatus.Match)
		{
			if(curTime >= m_avaEventData.matchTime + 60 && !isRequestMatchMakingResult && MatchResult == null)
			{
				GameMain.Ava.RequestMatchMakingResult();
				isRequestMatchMakingResult = true;
			}	
		}
		else if(curTime >= m_avaEventData.startTime && curTime < m_avaEventData.frozenTime && m_curStatus != AvaStatus.Frozen)
		{
			m_curStatus = AvaStatus.Frozen;
			bChanged = true;
            if (!bFirstTime)
            {
           	ShowFrozenTipIfNeeded(m_avaEventData.frozenTime - m_avaEventData.startTime);
		}
		}
		else if(curTime >= m_avaEventData.frozenTime && curTime < m_avaEventData.endTime && m_curStatus != AvaStatus.Combat)
		{
			m_curStatus = AvaStatus.Combat;
			bChanged = true;
		}
		else if(curTime >= m_avaEventData.endTime && curTime < m_avaEventData.endTime + ENDFROZENTIME && m_curStatus != AvaStatus.EndFrozen)
		{
			if(AvaEntry.Seed.AssignKnightId != 0)
			{
				AvaEntry.Seed.AssignKnightId = 0;
				MenuMgr.instance.SendNotification(Constant.AvaNotification.UnAssignKnightOK);
			}
			m_curStatus = AvaStatus.EndFrozen;
			bChanged = true;
			AvaEntry.March.ClearMarchList();
			AvaEntry.Units.ClearAllUnits();

		}
		else if(curTime >= m_avaEventData.endTime + ENDFROZENTIME && curTime < m_avaEventData.rewardTime && m_curStatus != AvaStatus.ClaimReward)
		{
			m_curStatus = AvaStatus.ClaimReward;
			bChanged = true;
		}
		else if(curTime >= m_avaEventData.rewardTime && m_avaEventData.isFinished == 0 && m_curStatus != AvaStatus.Rewward)
		{
			m_curStatus = AvaStatus.Rewward;
			bChanged = true;
		}
		else if(curTime >= m_avaEventData.rewardTime && m_avaEventData.isFinished == 1 && m_curStatus != AvaStatus.EndIdle)
		{
			m_curStatus = AvaStatus.EndIdle;
			bChanged = true;
			PlayerPrefs.SetInt(WonderEnd, 1);
		}

		if(bChanged)
		{
			KBN.Game.Event.Fire(this, new KBN.AvaStatusEventArgs(m_curStatus));
			MenuMgr.instance.SendNotification(Constant.AvaNotification.StatusChanged);
		}

		if (m_curStatus == AvaStatus.EndFrozen || m_curStatus == AvaStatus.ClaimReward
		    || m_curStatus == AvaStatus.Rewward || m_curStatus == AvaStatus.EndIdle)
        {
            if (KBN.GameMain.singleton.HasAvAReward && KBN.MenuMgr.instance.getMenu("AvaResultMenu") == null)
            {
                AvaResultMenu.requestAvaResult(AvaResultMenu.AvaResultType.CurrentResult, OnGetCurrentResultOK);
            }
        }

		if(!CanEnterAvaMiniMap())
		{
			if(GameMain.singleton.curSceneLev() == GameMain.AVA_MINIMAP_LEVEL)
			{
				GameMain.singleton.loadLevel(GameMain.CITY_SCENCE_LEVEL);

			}
		}
	}

    private void ShowFrozenTipIfNeeded(long duration)
    {
        if (GameMain.singleton.getScenceLevel() == GameMain.AVA_MINIMAP_LEVEL || FTEMgr.isFTERuning() || NewFteMgr.instance.IsDoingFte)
        {
            return;
        }

        var tipTxt = string.Format(Datas.getArString("Event.AVA_FrozenStartsNotification"), _Global.timeFormatStr(duration));
        if (MenuMgr.instance.hasMenuByName("NormalTipsMenu"))
        {
            return;
        }
        MenuMgr.instance.PushMenu("NormalTipsMenu", tipTxt, "trans_immediate");
    }

	private void ShowSuperWonderProtectEndTip()
	{
		if (FTEMgr.isFTERuning() || NewFteMgr.instance.IsDoingFte)
		{
			return;
		}
		
		var tipTxt = Datas.getArString("AVA.SuperWonderProtectEnd");
		if (MenuMgr.instance.hasMenuByName("NormalTipsMenu"))
		{
			return;
		}
		MenuMgr.instance.PushMenu("NormalTipsMenu", tipTxt, "trans_immediate");
	}

    private void ShowPrepareTip()
    {
		if (FTEMgr.isFTERuning() || NewFteMgr.instance.IsDoingFte)
		{
			return;
		}

        var tipTxt = Datas.getArString("Event.AVA_DeploymentStartsNotification");
        if (MenuMgr.instance.hasMenuByName("NormalTipsMenu"))
        {
            return;
        }
        MenuMgr.instance.PushMenu("NormalTipsMenu", tipTxt, "trans_immediate");
    }

	public int OutPostStatus
	{
		get
		{
			return m_OutPostStatus;
		}
	}

	public AvaType CurAvaType
	{
		get{
			return m_curAvaType;
		}
	}

	public GWWonderState CurGWWonderState()
	{
		long curTime = GameMain.unixtime();
		if(m_avaEventData.mode == "0")
		{
			return GWWonderState.NotOpen;
		}
		else
		{
			if(m_avaEventData.isApply == "0")
			{
				return GWWonderState.OpenAndNotJoin;
			}
			else
			{
				return GWWonderState.OpenAndJoin;
			}
		}
	}

	public AvaStatus CurStatus
	{
		get
		{
			return m_curStatus;
		}
	}
	public int GetActId()
	{
		return m_avaEventData.actId;
	}

	public string AllianceRegion()
	{
		return m_avaEventData.allianceRegion;
	}

	public long EUStartTime()
	{
		return m_avaEventData.startTimeEUUnix;
	}

	public long EUEndTime()
	{
		return m_avaEventData.endTimeEUUnix;
	}

	public long NAStartTime()
	{
		return m_avaEventData.startTimeNAUnix;
	}

	public long NAEndTime()
	{
		return m_avaEventData.endTimeNAUnix;
	}

    public long GetCombatEndTime()
    {
        return m_avaEventData.endTime;
    }

	public long GetCombatStartTime()
	{
		return m_avaEventData.startTime;
	}

	public long GetDeployStartTime()
	{
		return m_avaEventData.prepareTime;
	}

	public long GetSuperWonderProtectTime()
	{
		return m_avaEventData.startTime + m_avaEventData.superWonderProtectTime;
	}

	public bool IsShowSuperWonderProtect()
	{
		long curTime = GameMain.unixtime ();
		return curTime <= GetSuperWonderProtectTime() ? true : false;
	}

	public string GetLeftTimeTips()
	{
		long curTime = GameMain.unixtime ();
		string retStr = string.Empty;

		switch(m_curStatus)
		{
		case AvaStatus.Idle:
            retStr = FormatTimeTipText("Event.AVA_preparenexttime", m_avaEventData.prepareTime, curTime);
			break;
		case AvaStatus.Prepare:
            retStr = FormatTimeTipText("Event.AVA_preparetime", m_avaEventData.matchTime, curTime);
			break;
		case AvaStatus.Match:
			retStr = FormatTimeTipText("Event.AVA_matchtime", m_avaEventData.startTime, curTime);
			break;
		case AvaStatus.Frozen:
			retStr = FormatTimeTipText("Event.AVA_frozentime", m_avaEventData.frozenTime, curTime);
			break;
		case AvaStatus.Combat:
			retStr = FormatTimeTipText("Event.AVA_combattime", m_avaEventData.endTime, curTime);
			break;
		case AvaStatus.EndFrozen:
			retStr = FormatTimeTipText("Event.AVA_mapclosetime", m_avaEventData.endTime + ENDFROZENTIME, curTime);
			break;
		case AvaStatus.ClaimReward:
			retStr = Datas.getArString("Event.AVA_claimrewardtime");
			break;
		case AvaStatus.Rewward:
			retStr = Datas.getArString("Event.AVA_rewardtime");
			break;
		case AvaStatus.EndIdle:
			retStr = FormatTimeTipText("Event.AVA_preparenexttime", m_avaEventData.prepareTime+TIMEINTERAL_7DAY, curTime);
			break;
		}
		return retStr;
	}

	public string GetEventDesc()
	{
		string retStr = string.Empty;
		switch(m_curStatus)
		{
		case AvaStatus.Idle:
		case AvaStatus.EndIdle:
			retStr = Datas.getArString("Event.AVA_preparenexttimedesc");
			break;
		case AvaStatus.Prepare:
			retStr = Datas.getArString("Event.AVA_preparetimedesc");
			break;
		case AvaStatus.Match:
			retStr = Datas.getArString("Event.AVA_matchtimedesc");
			break;
		case AvaStatus.Frozen:
			retStr = Datas.getArString("Event.AVA_frozentimedesc");
			break;
		case AvaStatus.Combat:
			retStr = Datas.getArString("Event.AVA_combattimedesc");
			break;
		case AvaStatus.EndFrozen:
			retStr = Datas.getArString("Event.AVA_mapclosetimedesc");
			break;
		case AvaStatus.ClaimReward:
			retStr = Datas.getArString("Event.AVA_claimrewardtimedesc");
			break;
		case AvaStatus.Rewward:
			retStr = Datas.getArString("Event.AVA_rewardtimedesc");
			break;
		}
		return retStr;
	}

    private static string FormatTimeTipText(string key, long endTime, long curTime)
    {
		if(endTime < curTime)
		{
			return string.Format(Datas.getArString(key), _Global.timeFormatStr(0));
		}
		else
		{
			return string.Format(Datas.getArString(key), _Global.timeFormatStr(endTime - curTime));
		}
        
    }

    public long GetCombatLeftTime()
    {
        long leftTime = 0;
        if(AvaStatus.EndFrozen == CurStatus)
        {
            leftTime = m_avaEventData.endTime + ENDFROZENTIME - GameMain.unixtime ();
        }
        else
        {
            leftTime = m_avaEventData.endTime - GameMain.unixtime ();
        }
        if (leftTime < 0) 
        {
            leftTime = 0;
        }

        return leftTime;
    }

	public string GetCombatLeftTimeString()
	{
		return  _Global.timeFormatStr(GetCombatLeftTime());
	}

	public bool CanEnterAvaMiniMap()
	{
		if(m_curStatus == AvaStatus.Frozen || m_curStatus == AvaStatus.Combat)
		{
			return true;
		}
		else if(m_curStatus == AvaStatus.EndFrozen && (m_avaEventData.endTime + ENDFROZENTIME - GameMain.unixtime()) > 5)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

    private void OnGetCurrentResultOK(byte[] data)
    {
        if (data != null)
        {
            HashObject param = new HashObject();
            param["type"] = new HashObject(AvaResultMenu.AvaResultType.CurrentResult);
            param["data"] = new HashObject(data);
            KBN.MenuMgr.instance.PushMenu("AvaResultMenu", param, "trans_zoomComp");
        }
    }

    public long BattleStartTime
    {
        get
        {
            return m_avaEventData.frozenTime;
        }
    }

    public long EndFrozenEndTime
    {
        get
        {
            return m_avaEventData.endTime + ENDFROZENTIME;
        }
    }

	public PBMsgAvaMatchMakingResult.PBMsgAvaMatchMakingResult MatchResult
	{
		get
		{
			return m_MatchData;
		}
		set
		{
			m_MatchData = value;
			MenuMgr.instance.SendNotification(Constant.AvaNotification.MatchResultOK);
		}
	}
}
