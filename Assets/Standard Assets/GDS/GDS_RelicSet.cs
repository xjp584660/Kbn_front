using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.IO;
using System;
using System.Linq;
using KBN;

public class GDS_RelicSet : NewGDS {

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
		LoadingProfiler.Instance.StartTimer("GDS_RelicSet.cs::OKHandler");
		System.DateTime startTime = System.DateTime.Now;
		PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
		Save (msgData.type, msgData.version, msgData.data, msgData.restart);
		msgData.data=DesDeCode(msgData.data);
		m_DT.UpdateItemsFromString<KBN.DataTable.RelicSet> (msgData.data,0);
		LoadingProfiler.Instance.EndTimer("GDS_RelicSet.cs::OKHandler");

		FreeStrData ();
	}
	
	public override void ErrorHandler(string errorMessage, string errorCode)
	{
		
	}
	
	public override void LoadFromLocal(string filename)
	{
		LoadingProfiler.Instance.StartTimer("GDS_RelicSet.cs::LoadFromLocal");
		System.DateTime startTime = System.DateTime.Now;
		base.LoadFromLocal (filename);
		m_DT.UpdateItemsFromString<KBN.DataTable.RelicSet> (m_strData,0);
		LoadingProfiler.Instance.EndTimer("GDS_RelicSet.cs::LoadFromLocal");

		FreeStrData ();
	}

	public KBN.DataTable.RelicSet GetItemById(int ID)
	{
		return m_DT.GetItem<KBN.DataTable.RelicSet> (ID.ToString());
	}

	public float GetTwoSetValue(int setID)
	{
		return _Global.FLOAT(Math.Round(GetItemById(setID).TWO_VALUE * 0.01f, 1));
	}

	public float GetFourSetValue(int setID, int level, int attack, int health, int load)
	{
		string fourSetValue = GetItemById(setID).FOUR_VALUE;
		string[] values = fourSetValue.Split('_');
		
		float setValue = _Global.FLOAT(values[0]) + level * _Global.FLOAT(values[1]) + attack * _Global.FLOAT(values[2]) + 
						health * _Global.FLOAT(values[3]) + load * _Global.FLOAT(values[4]);
		return setValue;
	}
} 