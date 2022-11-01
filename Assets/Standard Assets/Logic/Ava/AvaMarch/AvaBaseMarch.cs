using KBN;
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class AvaBaseMarch 
{
	protected PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo m_MarchInfo;

	public AvaBaseMarch(PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo marchData)
	{
		m_MarchInfo = marchData;
	}

	public virtual void Update()
	{
		if(Constant.AvaMarchStatus.OUTBOUND == Status && LeftTime <= 0)
		{
			RequestUpdateMarch();
		}
		if(Constant.AvaMarchStatus.RETURNING == Status && LeftTime <= 0)
		{
			Status = Constant.AvaMarchStatus.DELETED;
			GameMain.Ava.Units.RequestAvaUnits ();
		}
	}

	public int TileId
	{
		get
		{
			return m_MarchInfo.toTileId;
		}
	}

	public int MarchId
	{
		get
		{
			return m_MarchInfo.marchId;
		}
	}

	public int Type
	{
		get
		{
			return m_MarchInfo.marchType;
		}
	}

	public int Status
	{
		get
		{
			return m_MarchInfo.marchStatus;
		}
		set
		{
			m_MarchInfo.marchStatus = value;
		}
	}

	public int StartTime
	{
		get
		{
			return m_MarchInfo.marchTimestamp;
		}
	}

	public int EndTime
	{
		get
		{
			if(Status == Constant.AvaMarchStatus.OUTBOUND || Status == Constant.AvaMarchStatus.RALLYING)
			{
				return m_MarchInfo.destinationEta;
			}
			else if(Status == Constant.AvaMarchStatus.RETURNING)
			{
				return m_MarchInfo.returnEta;
			}
			return 0;
		}
		set
		{
			if(Status == Constant.AvaMarchStatus.OUTBOUND || Status == Constant.AvaMarchStatus.RALLYING)
			{
				m_MarchInfo.destinationEta = value;
			}
			else if(Status == Constant.AvaMarchStatus.RETURNING)
			{
				m_MarchInfo.returnEta = value;
			}
		}
	}

	public int OrigTotalTime
	{
		get
		{
			return m_MarchInfo.oneWaySecond;
		}
	}

	public PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo MarchData
	{
		get
		{
			return m_MarchInfo;
		}
		set
		{
			m_MarchInfo = value;
		}
	}

	public int GetUnitsCount()
	{
		int total = 0;
		for(int i=0;i<m_MarchInfo.unitlist.Count;i++)
		{
			total += m_MarchInfo.unitlist[i].count;
		}
		return total;
	}

	public int GetReturnUnitCount()
	{
		int total = 0;
		for(int i=0;i<m_MarchInfo.returnunit.Count;i++)
		{
			total += m_MarchInfo.returnunit[i].count;
		}
		return total;
	}

	public List<PBMsgAVAMarchList.PBMsgAVAMarchList.Unit> UnitList
	{
		get
		{
			return m_MarchInfo.unitlist;
		}
	}

	public List<PBMsgAVAMarchList.PBMsgAVAMarchList.Unit> ReturnUnitList
	{
		get
		{
			return m_MarchInfo.returnunit;
		}
	}

	public int KnightId
	{
		get
		{
			return m_MarchInfo.knightId;
		}
	}

	public int KnightLevel
	{
		get
		{
			return m_MarchInfo.knightLevel;
		}
	}

	public string KnightTextureName
	{
		get
		{
			return General.getGeneralTextureName(m_MarchInfo.knightName, m_MarchInfo.cityOrder);
		}
	}

	public string KnightShowName
	{
		get
		{
			return General.singleton.getKnightShowName(m_MarchInfo.knightName, m_MarchInfo.cityOrder);
		}
	}

	public List<PBMsgAVAMarchList.PBMsgAVAMarchList.HeroInfo> HeroList
	{
		get
		{
			return m_MarchInfo.herolist;
		}
	}

	public Vector2 TargetCoord
	{
		get
		{
			return new Vector2(m_MarchInfo.toXCoord,m_MarchInfo.toYCoord);
		}
	}

	public int TargetTileType
	{
		get
		{
			return m_MarchInfo.toTileType;
		}
	}

	public string TargetPlayerName
	{
		get
		{
			return m_MarchInfo.toPlayerName;
		}
	}

	public int FromPlayerId
	{
		get
		{
			return m_MarchInfo.fromPlayerId;
		}
	}

	public string FromPlayerName
	{
		get
		{
			return m_MarchInfo.fromPlayerName;
		}
	}

	public int LeftTime
	{
		get
		{
			int curTime = (int)KBN.GameMain.unixtime();
			if(Constant.AvaMarchStatus.OUTBOUND == Status)
			{
				return (m_MarchInfo.destinationEta - curTime) > 0 ? (m_MarchInfo.destinationEta - curTime) : 0;
			}
			else if(Constant.AvaMarchStatus.RETURNING == Status)
			{
				return (m_MarchInfo.returnEta - curTime) > 0 ? (m_MarchInfo.returnEta - curTime) : 0;
			}
			else if(Constant.AvaMarchStatus.RALLYING == Status)
			{
				return (m_MarchInfo.rallyAttackInfo.leaveTime - curTime) > 0 ? (m_MarchInfo.rallyAttackInfo.leaveTime - curTime) : 0;
			}
			else
			{
				return 0;
			}
		}
	}

	public float Progress
	{
		get
		{
			if (Constant.AvaMarchStatus.OUTBOUND == Status ||
			    Constant.AvaMarchStatus.RETURNING == Status ||
			    Constant.AvaMarchStatus.RALLYING == Status)
			{
				if (OrigTotalTime == 0)
				{
					return 0.0f;
				}

				return 1.0f - Mathf.Clamp01((float)LeftTime / OrigTotalTime);
			}

			if (Constant.AvaMarchStatus.DEFENDING == Status ||
                Constant.AvaMarchStatus.WAITING_FOR_REPORT == Status)
			{
				return 1.0f;
			}

			return 0.0f;
		}
	}

	public virtual string GetTypeString()
	{
		return string.Empty;
	}

	public virtual string GetStatusString(bool withCoords)
	{
		return "";
	}

	public string GetTileCoordStr()
	{
		return string.Format("({0}, {1})", (int)TargetCoord.x, (int)TargetCoord.y); 
	}

	public void CopyDataFromPBMsgMarch(PBMsgAVAMarch.PBMsgAVAMarch.MarchInfo data)
	{

	}

	public void RequestUpdateMarch()
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		request.cmd = 3;
		request.subcmd = 3;
		PBMsgReqAVA.PBMsgReqAVA.UpdateMarchInfo updateMarchInfo = new PBMsgReqAVA.PBMsgReqAVA.UpdateMarchInfo ();
		updateMarchInfo.marchId = m_MarchInfo.marchId;
		request.updateMarchInfo = updateMarchInfo;
		UnityNet.RequestForGPB("ava.php", request, OnUpdateMarchOK, null,true);
	}

	private void OnUpdateMarchOK(byte[] data)
	{
		PBMsgAVAMarch.PBMsgAVAMarch response = _Global.DeserializePBMsgFromBytes<PBMsgAVAMarch.PBMsgAVAMarch>(data);
		byte[] byMarch = _Global.SerializePBMsg2Bytes<PBMsgAVAMarch.PBMsgAVAMarch.MarchInfo>(response.marchinfo);
		MarchData = _Global.DeserializePBMsgFromBytes<PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo>(byMarch);
	}

	public void RequestRecallMarch()
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		request.cmd = 3;
		request.subcmd = 5;
		request.recallMarchId = m_MarchInfo.marchId;
		UnityNet.RequestForGPB("ava.php", request, OnRecallOK, null);
	}

	private void OnRecallOK(byte[] data)
	{
		PBMsgAVAMarch.PBMsgAVAMarch response = _Global.DeserializePBMsgFromBytes<PBMsgAVAMarch.PBMsgAVAMarch>(data);
		byte[] byMarch = _Global.SerializePBMsg2Bytes<PBMsgAVAMarch.PBMsgAVAMarch.MarchInfo>(response.marchinfo);
		MarchData = _Global.DeserializePBMsgFromBytes<PBMsgAVAMarchList.PBMsgAVAMarchList.MarchInfo>(byMarch);
	}
}
