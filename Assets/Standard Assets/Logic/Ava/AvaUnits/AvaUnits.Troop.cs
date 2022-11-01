using KBN;
using UnityEngine;
using System.Collections.Generic;
public partial class AvaUnits : AvaModule
{
	private List<BarracksBase.TroopInfo> m_TroopList = new List<BarracksBase.TroopInfo> ();

	public Dictionary<int, int> HideTroopsConfig { get; private set; }
	public List<int> HideTroopsTimePoints { get; private set; }

	public int HideTroopsStartTime { get; private set; }
	public int HideTroopsEndTime { get; private set; }

	public int HideTroopsDuration { get { return HideTroopsEndTime - HideTroopsStartTime; } }

	public bool IsTroopsHidden { get; private set; }

//	private void InitTroopList()
//	{
//		m_TroopList.Clear ();
//		foreach(PBMsgAVATroop.PBMsgAVATroop.Unit troop in m_Units.units)
//		{
//			m_TroopList.Add(GetTroopInfo(troop.unitId));
//		}
//	}
	
	public BarracksBase.TroopInfo GetTroopInfo(int typeId)
	{	
		BarracksBase.TroopInfo	ret = new BarracksBase.TroopInfo();
		ret.typeId = typeId;
		ret.troopName = Datas.getArString("unitName."+"u" + typeId);
		ret.troopTexturePath = "ui_" + typeId;
		ret.description = Datas.getArString("unitDesc."+"u" + typeId);
		ret.bLocked = false;
		ret.owned = GetTroopCountFromRawData(ret.typeId);
		ret.health = GameMain.GdsManager.GetGds<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.HEALTH);
		ret.attack = GameMain.GdsManager.GetGds<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.ATTACK);
		ret.speed = GameMain.GdsManager.GetGds<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.SPEED);
		ret.load = GameMain.GdsManager.GetGds<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.LOAD);
		ret.selectNum = 0;
		ret.actType =  GameMain.GdsManager.GetGds<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.TYPE);
		ret.level = GameMain.GdsManager.GetGds<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.TIER);
		ret.lifeRate = GameMain.GdsManager.GetGds<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.LIFERATE);
		ret.attackRate = GameMain.GdsManager.GetGds<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.ATTACKRATE);
		ret.upkeep = GameMain.GdsManager.GetGds<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.UPKEEP);
		ret.might = GameMain.GdsManager.GetGds<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.MIGHT);
		ret.trainable = GameMain.GdsManager.GetGds<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,ret.typeId,Constant.TroopAttrType.TRAINABLE) == 0? false:true;
		return ret;
	}
	
	private void UpdateTroopList()
	{
		BarracksBase.TroopInfo troop = null;
		for(int i=0;i<m_Units.units.Count;i++)
		{
			troop = GetTroopFromTroopList(m_Units.units[i].unitId);
			if(troop == null)
			{
				m_TroopList.Add(GetTroopInfo(m_Units.units[i].unitId));
			}
			else
			{
				troop.owned = (int)m_Units.units[i].num;
			}
		}

		//iterater invalid issue
		PBMsgAVATroop.PBMsgAVATroop.Unit troopRawData = null;
		for(int j=m_TroopList.Count-1;j>=0;j--)
		{
			troopRawData = GetTroopFromRawData(m_TroopList[j].typeId);
			if(troopRawData == null)
			{
				m_TroopList.RemoveAt(j);
			}
		}

	}
	
	public void SubtractUnits(int troopTypeId,int count)
	{
		for(int i=0;i<m_Units.units.Count;i++)
		{
			PBMsgAVATroop.PBMsgAVATroop.Unit unit = m_Units.units[i];
			if(troopTypeId == unit.unitId)
			{
				unit.num -= count;
				if(unit.num < 0) unit.num = 0;
				return;
			}
		}
	}
	
	public int GetTroopCountFromRawData(int troopTypeId)
	{
		for(int i=0;i<m_Units.units.Count;i++)
		{
			if(troopTypeId == m_Units.units[i].unitId)
			{
				return (int)m_Units.units[i].num;
			}
		}
		return 0;
	}

	public BarracksBase.TroopInfo GetTroopFromTroopList(int troopId)
	{
		for(int i=0;i<m_TroopList.Count;i++)
		{
			if(troopId == m_TroopList[i].typeId)
			{
				return m_TroopList[i];
			}
		}
		return null;
	}

	public PBMsgAVATroop.PBMsgAVATroop.Unit GetTroopFromRawData(int troopId)
	{
		for(int i=0;i<m_Units.units.Count;i++)
		{
			if(m_Units.units[i].unitId == troopId)
			{
				return m_Units.units[i];
			}
		}
		return null;
	}

	public List<BarracksBase.TroopInfo> TroopList
	{
		get
		{
			return m_TroopList;
		}
	}

	#region HideTroops

	private float currentHideTroopsProgress = 0.0f;
	private int currentHideTroopsRate = 0;

	public float CurrentHideTroopsProgress
	{
		get
		{
			return IsTroopsHidden && (AvaEntry.Event.CurStatus == AvaEvent.AvaStatus.Combat) ? currentHideTroopsProgress : 0.0f;
		}
	}
	
	public int CurrentHideTroopsRate 
	{
		get
		{
			return IsTroopsHidden && (AvaEntry.Event.CurStatus == AvaEvent.AvaStatus.Combat) ? currentHideTroopsRate : 0;
		}
	}

	private void InitHideTroopsConfig()
	{
		HashObject seed = GameMain.singleton.getSeed();
		if (null == seed || null == seed["avaHideTroopConfig"])
			return;
		
		HideTroopsConfig = new Dictionary<int, int>();
		string configString = seed["avaHideTroopConfig"].Value as string;
		string[] configPairs = configString.Split(',');
		for (int i = 0; i < configPairs.Length; i++)
		{
			string[] kv = configPairs[i].Split('|');
			HideTroopsConfig.Add(_Global.INT32(kv[0]), _Global.INT32(kv[1]));
		}
		
		HideTroopsTimePoints = new List<int>(HideTroopsConfig.Keys);
		HideTroopsTimePoints.Sort();
		
		HideTroopsStartTime = 0;
		HideTroopsEndTime = 0;
		
		if (HideTroopsTimePoints.Count < 1 || HideTroopsTimePoints[0] != 0)
		{
			throw new System.Exception("Invalid ava hide troops configuration.");
		}
		
		HideTroopsStartTime = HideTroopsTimePoints[0];
		HideTroopsEndTime = HideTroopsTimePoints[HideTroopsTimePoints.Count - 1];

		IsTroopsHidden = true;
		RequestHideTroopsState();
	}

	private float lastUpdateTime = 0.0f;
	private void UpdateHideTroopsProgress()
	{

		float time = Time.realtimeSinceStartup;
		if (time - lastUpdateTime > 0.5f)
		{
			lastUpdateTime = time;

			long now = GameMain.unixtime();
			long start = GameMain.Ava.Event.BattleStartTime;
			int elapsedTime = (int)(now - start);

			currentHideTroopsProgress = Mathf.Clamp01((float)elapsedTime / HideTroopsDuration);

			if (!IsTroopsHidden)
				return;

			int newRate = currentHideTroopsRate;
			for (int i = 0; i < HideTroopsTimePoints.Count; i++)
			{
				if (elapsedTime >= HideTroopsTimePoints[i])
				{
					newRate = HideTroopsConfig[HideTroopsTimePoints[i]];
				}
			}

			if (newRate != currentHideTroopsRate)
			{
				currentHideTroopsRate = newRate;
				if ((AvaEntry.Event.CurStatus == AvaEvent.AvaStatus.Combat || AvaEntry.Event.CurStatus == AvaEvent.AvaStatus.Frozen)
				    && m_TroopList.Count > 0)
				{
					MenuMgr.instance.PushMessage(string.Format(Datas.getArString("AVA.Outpost_HideTroops_HideRate"), newRate));
				}
			}
		}
	}

	public void RequestHideTroopsState()
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA();
		request.cmd = 1;
		request.subcmd = 11;
		UnityNet.RequestForGPB("ava.php", request, OnHideTroopsRequestOK);
	}

	public void RequestHideTroops()
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA();
		request.cmd = 1;
		request.subcmd = 9;
		UnityNet.RequestForGPB("ava.php", request, OnHideTroopsRequestOK);
	}

	public void RequestUnhideTroops()
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA();
		request.cmd = 1;
		request.subcmd = 10;
		UnityNet.RequestForGPB("ava.php", request, OnHideTroopsRequestOK);
	}

	private void OnHideTroopsRequestOK(byte[] data)
	{
		PBMsgAvaTroopStatus.PBMsgAvaTroopStatus status = _Global.DeserializePBMsgFromBytes<PBMsgAvaTroopStatus.PBMsgAvaTroopStatus>(data);
		if (status.hideStatus == 0)
		{
			IsTroopsHidden = false;
		}
		else if (status.hideStatus == 1)
		{
			IsTroopsHidden = true;
		}
	}

	#endregion
}
