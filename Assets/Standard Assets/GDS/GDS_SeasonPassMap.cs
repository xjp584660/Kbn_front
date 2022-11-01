using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.IO;
using System;
using System.Linq;
using KBN;

public class GDS_SeasonPassMap : NewGDS {

	// public override string FileName
	// {
	// 	get
	// 	{
	// 		return "seasonPassMap";
	// 	}
	// }

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
		LoadingProfiler.Instance.StartTimer("GDS_SeasonPassMap.cs::OKHandler");
		System.DateTime startTime = System.DateTime.Now;
		PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
		Save (msgData.type, msgData.version, msgData.data, msgData.restart);
		msgData.data=DesDeCode(msgData.data);
		m_DT.UpdateItemsFromString<KBN.DataTable.SeasonPassMap> (msgData.data,0);
		LoadingProfiler.Instance.EndTimer("GDS_SeasonPassMap.cs::OKHandler");

		FreeStrData ();
	}
	
	public override void ErrorHandler(string errorMessage, string errorCode)
	{
		
	}
	
	public override void LoadFromLocal(string filename)
	{
		LoadingProfiler.Instance.StartTimer("GDS_SeasonPassMap.cs::LoadFromLocal");
		System.DateTime startTime = System.DateTime.Now;
		base.LoadFromLocal (filename);
		m_DT.UpdateItemsFromString<KBN.DataTable.SeasonPassMap> (m_strData,0);
		LoadingProfiler.Instance.EndTimer("GDS_SeasonPassMap.cs::LoadFromLocal");

		FreeStrData ();
	}

	public KBN.DataTable.SeasonPassMap GetItemById(int ID)
	{
		return m_DT.GetItem<KBN.DataTable.SeasonPassMap> (ID.ToString());
	}

	public List<KBN.DataTable.SeasonPassMap> GetSeasonMaps()
	{
		int ID = 0;
		KBN.DataTable.SeasonPassMap seasonPassMap = null;
		List<KBN.DataTable.SeasonPassMap> maps = new List<KBN.DataTable.SeasonPassMap>(); 
		do {
			ID++;
			seasonPassMap = GetItemById (ID);
			if(seasonPassMap != null)
			{
				maps.Add (seasonPassMap);	
			}
		} while(seasonPassMap != null);

		return maps;
	}
}
