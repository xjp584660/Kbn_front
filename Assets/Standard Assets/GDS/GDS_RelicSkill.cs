using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.IO;
using System;
using System.Linq;
using KBN;

public class GDS_RelicSkill : NewGDS {

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
		LoadingProfiler.Instance.StartTimer("GDS_RelicSkill.cs::OKHandler");
		System.DateTime startTime = System.DateTime.Now;
		PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
		Save (msgData.type, msgData.version, msgData.data, msgData.restart);
		msgData.data=DesDeCode(msgData.data);
		m_DT.UpdateItemsFromString<KBN.DataTable.RelicSkill> (msgData.data,0);
		LoadingProfiler.Instance.EndTimer("GDS_RelicSkill.cs::OKHandler");

		FreeStrData ();
	}
	
	public override void ErrorHandler(string errorMessage, string errorCode)
	{
		
	}
	
	public override void LoadFromLocal(string filename)
	{
		LoadingProfiler.Instance.StartTimer("GDS_RelicSkill.cs::LoadFromLocal");
		System.DateTime startTime = System.DateTime.Now;
		base.LoadFromLocal (filename);
		m_DT.UpdateItemsFromString<KBN.DataTable.RelicSkill> (m_strData,0);
		LoadingProfiler.Instance.EndTimer("GDS_RelicSkill.cs::LoadFromLocal");

		FreeStrData ();
	}

	public KBN.DataTable.RelicSkill GetItemById(int ID)
	{
		return m_DT.GetItem<KBN.DataTable.RelicSkill> (ID.ToString());
	}

	public float getDeputySkillValue(int skillId, int skillLevel)
	{
		KBN.DataTable.RelicSkill skill = GetItemById(skillId);
		if(skill != null)
		{
			string level_value = skill.LEVEL_VALUE;
			string[] deputySkills = level_value.Split(';');
			for(int i = 0; i < deputySkills.Length; ++i)
			{
				string[] values = deputySkills[i].Split('_');
				int tempSkillLevel = _Global.INT32(values[0]);
				if(skillLevel == tempSkillLevel)
				{
					return _Global.FLOAT(values[1]) * 0.01f;
				}
			}
		}

		return 0f;
	}
}