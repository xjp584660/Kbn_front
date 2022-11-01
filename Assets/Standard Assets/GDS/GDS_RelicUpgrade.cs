using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.IO;
using System;
using System.Linq;
using KBN;

public class GDS_RelicUpgrade : NewGDS {

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
		LoadingProfiler.Instance.StartTimer("GDS_RelicUpgrade.cs::OKHandler");
		System.DateTime startTime = System.DateTime.Now;
		PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
		Save (msgData.type, msgData.version, msgData.data, msgData.restart);
		msgData.data=DesDeCode(msgData.data);
		m_DT.UpdateItemsFromString<KBN.DataTable.RelicUpgrade> (msgData.data,0,1);
		LoadingProfiler.Instance.EndTimer("GDS_RelicUpgrade.cs::OKHandler");

		FreeStrData ();
	}
	
	public override void ErrorHandler(string errorMessage, string errorCode)
	{
		
	}
	
	public override void LoadFromLocal(string filename)
	{
		LoadingProfiler.Instance.StartTimer("GDS_RelicUpgrade.cs::LoadFromLocal");
		System.DateTime startTime = System.DateTime.Now;
		base.LoadFromLocal (filename);
		m_DT.UpdateItemsFromString<KBN.DataTable.RelicUpgrade> (m_strData,0,1);
		LoadingProfiler.Instance.EndTimer("GDS_RelicUpgrade.cs::LoadFromLocal");

		FreeStrData ();
	}

	public KBN.DataTable.RelicUpgrade GetItemById(int ID, int Level)
	{
		return m_DT.GetItem<KBN.DataTable.RelicUpgrade> (ID.ToString(), Level.ToString());
	}

	public int getRelicUpgradeMaxLevel(int ID)
	{
		int level=0;
		KBN.DataTable.RelicUpgrade relicUpgrade = null;
		do{
			level++;
			relicUpgrade = GetItemById(ID,level);
		}while(relicUpgrade != null);
		level--;
		return level;
	}

	public List<int> getExpList(int ID)
	{
		List<int> expList = new List<int>();
		int level = 0;
		int exp = 0;
		KBN.DataTable.RelicUpgrade relicUpgrade = null;
		do{
			level++;
			relicUpgrade = GetItemById(ID,level);
			if(relicUpgrade != null)
			{				
				exp += relicUpgrade.EXP;
				expList.Add(exp);
			}		
		}while(relicUpgrade != null);
		level--;

		return expList;
	}

	public float getMainSkillValue(int relicId, int level, int mainSkill)
	{
		KBN.DataTable.RelicUpgrade relic = GetItemById(relicId, level);
		if(relic != null)
		{
			string main_type = relic.MAIN_VALUE;
			string[] mainSkills = main_type.Split('_');
			for(int i = 0; i < mainSkills.Length; ++i)
			{
				//string[] values = mainSkills[i].Split('_');
				//int tempSkill = _Global.INT32(values[0]);
				if(mainSkill == i + 1)
				{
					float value = _Global.FLOAT(mainSkills[i]);
					if(mainSkill <= 3)
					{
						return value;
					}
					else
					{
						return value * 0.01f;
					}
				}
			}
		}

		return 0f;
	}
}