using UnityEngine;
using System.Collections;
using System.Threading;
namespace KBN
{
	public class GDS_PveBoss : NewGDS 
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
			LoadingProfiler.Instance.StartTimer("GDS_PveBoss.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			_Global.Log("$$$$$  Parse PBMsgGDS: " + (System.DateTime.Now - startTime).TotalMilliseconds);
			m_DT.UpdateItemsFromString<KBN.DataTable.PveBoss> (msgData.data,0);
			_Global.Log("$$$$$  Parse DataTable PveBoss: " + (System.DateTime.Now - startTime).TotalMilliseconds);
			LoadingProfiler.Instance.EndTimer("GDS_PveBoss.cs::OKHandler");

			FreeStrData ();
		}

		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}

		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_PveBoss.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			_Global.Log("$$$$$  Real DataTable PveBoss: " + (System.DateTime.Now - startTime).TotalMilliseconds);
			m_DT.UpdateItemsFromString<KBN.DataTable.PveBoss> (m_strData,0);
			_Global.Log("$$$$$  Parse DataTable PveBoss: " + (System.DateTime.Now - startTime).TotalMilliseconds);
			LoadingProfiler.Instance.EndTimer("GDS_PveBoss.cs::LoadFromLocal");

			FreeStrData ();
		}

		public KBN.DataTable.PveBoss GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.PveBoss> (id.ToString());
		}
	}
}