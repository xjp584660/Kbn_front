using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.IO;
using System;
using System.Linq;
using KBN;

public class OneRowSkill
{
	public List<int> rowSkill = new List<int>();
}

public class GDS_TechnologyShow : NewGDS 
{
	public override string FileName
	{
		get
		{
			return "technologyShow";
		}
	}

	public void LoadData(object fileName)
	{
		if (NeedDownLoad) 
		{
			DownLoadFromServer(fileName.ToString());
		}
		else
		{
			LoadFromLocal(fileName.ToString());
		}
	}
	
	public override void OKHandler(byte[] data)
	{
		LoadingProfiler.Instance.StartTimer("GDS_TecnologyShow.cs::OKHandler");
		System.DateTime startTime = System.DateTime.Now;
		PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
		Save (msgData.type, msgData.version, msgData.data, msgData.restart);
		msgData.data=DesDeCode(msgData.data);
		m_DT.UpdateItemsFromString<KBN.DataTable.TechnologyShow> (msgData.data,0);
		LoadingProfiler.Instance.EndTimer("GDS_TecnologyShow.cs::OKHandler");

		FreeStrData ();
	}
	
	public override void ErrorHandler(string errorMessage, string errorCode)
	{
		
	}
	
	public override void LoadFromLocal(string filename)
	{
		LoadingProfiler.Instance.StartTimer("GDS_TecnologyShow.cs::LoadFromLocal");
		System.DateTime startTime = System.DateTime.Now;
		base.LoadFromLocal (filename);
		m_DT.UpdateItemsFromString<KBN.DataTable.TechnologyShow> (m_strData,0);
		LoadingProfiler.Instance.EndTimer("GDS_TecnologyShow.cs::LoadFromLocal");

		FreeStrData ();
	}

	public KBN.DataTable.TechnologyShow GetItemById(int ID)
	{
		return m_DT.GetItem<KBN.DataTable.TechnologyShow> (ID.ToString());
	}

	// 获得每行要显示的技能
	public List<OneRowSkill> GetRowSkills(int sort)
	{
		int ID = 0;
		KBN.DataTable.TechnologyShow technologyShow = null;
		List<OneRowSkill> skills = new List<OneRowSkill>(); 
		do {
			ID++;
			technologyShow = GetItemById (ID);
			if(technologyShow != null && technologyShow.SORT == sort)
			{
				OneRowSkill rowSkill = new OneRowSkill();
				
				rowSkill.rowSkill.Add (technologyShow.NUM1);
				rowSkill.rowSkill.Add (technologyShow.NUM2);
				rowSkill.rowSkill.Add (technologyShow.NUM3);
				rowSkill.rowSkill.Add (technologyShow.NUM4);
				rowSkill.rowSkill.Add (technologyShow.NUM5);
				
				skills.Add (rowSkill);	
			}
		} while(technologyShow != null);

		return skills;
	}
}
