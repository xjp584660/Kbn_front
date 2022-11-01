using UnityEngine;
using System.Collections;
using System.Threading;
using System.Collections.Generic;
namespace KBN
{
	public class GDS_Alliancelanguage : NewGDS 
	{
		public override string FileName
		{
			get
			{
				return "Language";
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
			LoadingProfiler.Instance.StartTimer("GDS_Alliancelanguage.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);

			msgData.data=DesDeCode(msgData.data);

			m_DT.UpdateItemsFromString<KBN.DataTable.AllianceLanguage> (msgData.data,0);
			LoadingProfiler.Instance.EndTimer("GDS_Alliancelanguage.cs::OKHandler");
			
		}
		
		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}
		
		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_Alliancelanguage.cs::LoadFromLocal");
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.AllianceLanguage> (m_strData,0);
			LoadingProfiler.Instance.EndTimer("GDS_Alliancelanguage.cs::LoadFromLocal");
		}
		
		public KBN.DataTable.AllianceLanguage GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.AllianceLanguage> (id.ToString());
		}	

		public List<KBN.DataTable.AllianceLanguage> GetItems()
		{
			List<KBN.DataTable.AllianceLanguage> ret = new List<KBN.DataTable.AllianceLanguage>();

			var items = m_DT.GetItems();
			foreach(var item in items)
			{
				ret.Add(item as KBN.DataTable.AllianceLanguage);
			}

			// ret.Sort();

			return ret;
		}	
	}
}