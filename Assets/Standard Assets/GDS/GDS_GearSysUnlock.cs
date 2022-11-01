using UnityEngine;
using System.Collections;
using System.Threading;
namespace KBN
{
	public class GDS_GearSysUnlock : NewGDS
	{
        public override string FileName
        {
            get
            {
                return "gearSysUnlock";
            }
        }

        public override string KeyForVersionCheck
        {
            get
            {
                return "sysConfig";
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
			LoadingProfiler.Instance.StartTimer("GDS_GearSysUnlock.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			long mem1 = System.GC.GetTotalMemory (true);
			m_DT.UpdateItemsFromString<KBN.DataTable.GearSysUnlock>(msgData.data,0);
			long mem2 = System.GC.GetTotalMemory (true);
			LoadingProfiler.Instance.EndTimer("GDS_GearSysUnlock.cs::OKHandler");

			FreeStrData ();
		}
		
		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}
		
		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_GearSysUnlock.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.GearSysUnlock>(m_strData,0);
			LoadingProfiler.Instance.EndTimer("GDS_GearSysUnlock.cs::LoadFromLocal");

			FreeStrData ();
		}
		
		public KBN.DataTable.GearSysUnlock GetItemByKey(string key)
		{
			return m_DT.GetItem<KBN.DataTable.GearSysUnlock>(key);
		}




	}
}