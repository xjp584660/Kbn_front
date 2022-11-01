using UnityEngine;
using System.Collections;
using System.Threading;
namespace KBN
{
	public class GDS_PveMap : NewGDS 
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
			LoadingProfiler.Instance.StartTimer("GDS_PveMap.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.PveMap> (msgData.data,0);
			LoadingProfiler.Instance.EndTimer("GDS_PveMap.cs::OKHandler");

			FreeStrData ();
		}

		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}

		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_PveMap.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.PveMap> (m_strData,0);
			LoadingProfiler.Instance.EndTimer("GDS_PveMap.cs::LoadFromLocal");

			FreeStrData ();
		}

		public KBN.DataTable.PveMap GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.PveMap> (id.ToString());
		}

		public int GetUnlockStar(int mapId)
		{
			KBN.DataTable.PveMap item = GetItemById (mapId);
			if(item != null)
			{
				return item.UNLOCK_STAR;
			}
			else
			{
				return 0;
			}
		}
	}
}