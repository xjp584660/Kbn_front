using UnityEngine;
using System.Collections;
using System.Threading;
namespace KBN
{
	public class GDS_PveDrop : NewGDS 
	{	
        public override GdsCategory Category
        {
            get
            {
                return GdsCategory.Pve;
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
			LoadingProfiler.Instance.StartTimer("GDS_PveDrop.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.PveDrop> (msgData.data,0);
			LoadingProfiler.Instance.EndTimer("GDS_PveDrop.cs::OKHandler");

			FreeStrData ();
		}
		
		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}
		
		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_PveDrop.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.PveDrop> (m_strData,0);
			LoadingProfiler.Instance.EndTimer("GDS_PveDrop.cs::LoadFromLocal");

			FreeStrData ();
		}
		
		public KBN.DataTable.PveDrop GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.PveDrop> (id.ToString());
		}
	}
}