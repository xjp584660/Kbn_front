using UnityEngine;
using System.Collections;
using System.Threading;
using System.Collections.Generic;
namespace KBN
{
	public class GDS_WorldMap : NewGDS
	{	
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
			LoadingProfiler.Instance.StartTimer("GDS_WorldMap.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			//			long mem1 = System.GC.GetTotalMemory (true);
			m_DT.UpdateItemsFromString<KBN.DataTable.WorldMap> (msgData.data,0,2);
			//			long mem2 = System.GC.GetTotalMemory (true);
			//			_Global.Log("######  DataTable GDS_WorldMap Memory:" + (mem2 - mem1));
			LoadingProfiler.Instance.EndTimer("GDS_WorldMap.cs::OKHandler");
			
			FreeStrData ();
		}
		
		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}
		
		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_WorldMap.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.WorldMap> (m_strData,0,2);
			LoadingProfiler.Instance.EndTimer("GDS_WorldMap.cs::LoadFromLocal");
			
			FreeStrData ();
		}
		
		public KBN.DataTable.WorldMap GetItemById(int id, int id2)
		{
			return m_DT.GetItem<KBN.DataTable.WorldMap> (id.ToString(), id2.ToString());
		}
	}
}