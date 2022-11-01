using KBN;
using System.Collections.Generic;
public partial class AvaUnits : AvaModule
{
	private PBMsgAVATroop.PBMsgAVATroop m_Units = new PBMsgAVATroop.PBMsgAVATroop ();
	
	public AvaUnits(AvaManager avaEntry)
		: base(avaEntry)
	{
	}
	
	
	public override void Init()
	{
		RequestAvaUnits();
		InitHideTroopsConfig();
	}
	
	public override void Update()
	{
		UpdateHeroInfoList ();
		UpdateHideTroopsProgress();
	}

	public override void Clear()
	{
		m_TroopList.Clear ();
		m_GeneralList.Clear ();
		m_HeroInfoList.Clear ();
	}

	public void ClearAllUnits()
	{
		m_TroopList.Clear ();
		m_GeneralList.Clear ();
		m_HeroInfoList.Clear ();
		MenuMgr.instance.SendNotification(Constant.Notice.AvaUnitsRefreshed, null);
	}

	public List<PBMsgAVATroop.PBMsgAVATroop.Hero> HeroList
	{
		get
		{
			return m_Units.heros;
		}
	}

	public List<int> HeroIDList
	{
		get
		{
			List<int> idList =  new List<int> ();
			m_Units.heros.ForEach(i=>idList.Add(i.userHeroId));
			return idList;
		}
	}

	public List<PBMsgAVATroop.PBMsgAVATroop.Knight> KnightList
	{
		get
		{
			return m_Units.knights;
		}
	}

	public void RequestAvaUnits()
	{
		PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA ();
		request.cmd = 1;
		request.subcmd = 2;
		UnityNet.RequestForGPB("ava.php", request, OnGetAvaUnitsOk, OnGetAvaUnitsError,true);
	}

	private void OnGetAvaUnitsOk(byte[] data)
	{
		if (data == null)
		{
			m_TroopList.Clear ();
			m_GeneralList.Clear ();
			m_HeroInfoList.Clear ();
			MenuMgr.instance.SendNotification(Constant.Notice.AvaUnitsRefreshed, null);
			return;
		}
		m_Units = _Global.DeserializePBMsgFromBytes<PBMsgAVATroop.PBMsgAVATroop> (data);
		UpdateTroopList();
		InitHeroInfoList ();
		InitGeneralList ();
		MenuMgr.instance.SendNotification(Constant.Notice.AvaUnitsRefreshed, null);

	}
	
	private void OnGetAvaUnitsError(string errorMessage, string errorCode)
	{
	}
	
}
