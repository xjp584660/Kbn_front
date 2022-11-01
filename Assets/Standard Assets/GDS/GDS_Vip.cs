using UnityEngine;
using System.Collections;
using System.Threading;
using System.Collections.Generic;
namespace KBN
{
	public class GDS_Vip : NewGDS 
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
			LoadingProfiler.Instance.StartTimer("GDS_Vip.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.Vip> (msgData.data,0);
			LoadingProfiler.Instance.EndTimer("GDS_Vip.cs::OKHandler");
			
		}
		
		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}
		
		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_Vip.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.Vip> (m_strData,0);
			LoadingProfiler.Instance.EndTimer("GDS_Vip.cs::LoadFromLocal");
		}
		
		public KBN.DataTable.Vip GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.Vip> (id.ToString());
		}

		public int GetVipMaxLevel()
		{
			return m_DT.GetCount () - 1;//now from 0 to 9
		}
	
		
	}
}