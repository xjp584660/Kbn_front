using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.IO;
using System;
using System.Linq;
using KBN;

public class GDS_Relic : NewGDS {

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
		LoadingProfiler.Instance.StartTimer("GDS_Relic.cs::OKHandler");
		System.DateTime startTime = System.DateTime.Now;
		PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
		Save (msgData.type, msgData.version, msgData.data, msgData.restart);
		msgData.data=DesDeCode(msgData.data);
		m_DT.UpdateItemsFromString<KBN.DataTable.Relic> (msgData.data,0);
		LoadingProfiler.Instance.EndTimer("GDS_Relic.cs::OKHandler");

		FreeStrData ();
	}
	
	public override void ErrorHandler(string errorMessage, string errorCode)
	{
		
	}
	
	public override void LoadFromLocal(string filename)
	{
		LoadingProfiler.Instance.StartTimer("GDS_Relic.cs::LoadFromLocal");
		System.DateTime startTime = System.DateTime.Now;
		base.LoadFromLocal (filename);
		m_DT.UpdateItemsFromString<KBN.DataTable.Relic> (m_strData,0);
		LoadingProfiler.Instance.EndTimer("GDS_Relic.cs::LoadFromLocal");

		FreeStrData ();
	}

	public KBN.DataTable.Relic GetItemById(int ID)
	{
		return m_DT.GetItem<KBN.DataTable.Relic> (ID.ToString());
	}

	public string getIconName(int relicId)
	{
		KBN.DataTable.Relic relic = GetItemById(relicId);
		if(relic != null)
		{
			return relic.PICTURE;
		}

		return string.Empty;
	}
}