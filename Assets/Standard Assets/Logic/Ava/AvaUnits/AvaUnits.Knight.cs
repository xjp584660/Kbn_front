using KBN;
using System;
using System.Collections.Generic;

public enum AvaGeneralStatus
{
	Idle = 0,
	Assigned,
	Marching
}

public partial class AvaUnits : AvaModule
{
	private List<GeneralInfoVO> m_GeneralList = new List<GeneralInfoVO> ();

	public List<GeneralInfoVO> GetGeneralList()
	{
		return m_GeneralList;
	}

	public List<GeneralInfoVO> GetMarchGeneralList()
	{
		List<GeneralInfoVO> retList = new List<GeneralInfoVO> ();
		for(int i=0;i<m_GeneralList.Count;i++)
		{
			if((AvaGeneralStatus)Enum.Parse(typeof(AvaGeneralStatus), m_GeneralList[i].knightStatus.ToString()) == AvaGeneralStatus.Idle)
			{
				retList.Add(m_GeneralList[i]);
			}
		}
		return retList;
	}

	public void AssignGeneral(int generalId)
	{
		for(int i=0;i<m_GeneralList.Count;i++)
		{
			if(generalId == m_GeneralList[i].knightId)
			{
				m_GeneralList[i].knightStatus = 1;
				return;
			}
		}
	}

	public void UnAssignGeneral(int generalId)
	{
		for(int i=0;i<m_GeneralList.Count;i++)
		{
			if(generalId == m_GeneralList[i].knightId)
			{
				m_GeneralList[i].knightStatus = 0;
				return;
			}
		}
	}

	public void InitGeneralList()
	{
		m_GeneralList.Clear ();
		GeneralInfoVO generalInfo = null;
		int index = 0;
		_Global.LogWarning("AvaUnits.Knight knightCount" + m_Units.knights.Count);
		for(int i=0;i<m_Units.knights.Count;i++)
		{
			PBMsgAVATroop.PBMsgAVATroop.Knight general = m_Units.knights[i];
			generalInfo = new GeneralInfoVO();
			generalInfo.cityOrder = general.cityOrder;
			generalInfo.knightId = general.knightId;
			generalInfo.knightLevel = general.knightLevel;
			generalInfo.knightName = general.knightName;
			generalInfo.knightStatus = general.knightStatus;
			generalInfo.bAvaOnly = true;
			_Global.LogWarning("AvaUnits.Knight knightId" + general.knightId);
			_Global.LogWarning("AvaUnits.Knight knightStatus" + general.knightStatus);
			m_GeneralList.Add(generalInfo);
		}
	}

	public string GetKnightTextureName(int knightId)
	{
		for(int i=0;i<m_Units.knights.Count;i++)
		{
			PBMsgAVATroop.PBMsgAVATroop.Knight general = m_Units.knights[i];
			if (general.knightId == knightId)
				return General.getGeneralTextureName(general.knightName, general.cityOrder);
		}
		return string.Empty;
	}

	public string GetKnightShowName(int knightId)
	{
		for(int i=0;i<m_Units.knights.Count;i++)
		{
			PBMsgAVATroop.PBMsgAVATroop.Knight general = m_Units.knights[i];
			if (general.knightId == knightId)
				return General.singleton.getKnightShowName(general.knightName, general.cityOrder);
		}
		return string.Empty;
	}

	public void RequestAvaGeneralAssign(int knightId)
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		request.cmd = 8;
		request.subcmd = 1;
		request.knightId = knightId;
		UnityNet.RequestForGPB("ava.php", request, OnAssignOK, null);
	}

	private void OnAssignOK(byte[] data)
	{
		PBMsgAvaAssignKnight.PBMsgAvaAssignKnight response = _Global.DeserializePBMsgFromBytes<PBMsgAvaAssignKnight.PBMsgAvaAssignKnight> (data);
		AvaEntry.Seed.AssignKnightId = response.knightId;
		AssignGeneral (AvaEntry.Seed.AssignKnightId);
		MenuMgr.instance.SendNotification(Constant.AvaNotification.AssignKnightOK);
	}

	public void RequestAvaGeneralUnassign(int knightId)
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		request.cmd = 8;
		request.subcmd = 2;
		request.knightId = knightId;
		UnityNet.RequestForGPB("ava.php", request, OnUnassignOK, null);
	}

	private void OnUnassignOK(byte[] data)
	{
		PBMsgAvaUnAssignKnight.PBMsgAvaUnAssignKnight response = _Global.DeserializePBMsgFromBytes<PBMsgAvaUnAssignKnight.PBMsgAvaUnAssignKnight> (data);
        UnAssignGeneral(response.knightId);
		AvaEntry.Seed.AssignKnightId = 0;
		MenuMgr.instance.SendNotification(Constant.AvaNotification.UnAssignKnightOK);
	}
}
