using UnityEngine;
using System.Collections;
using System.Threading;
using System.Collections.Generic;
namespace KBN
{
	public class GDS_PveLevel : NewGDS 
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
			LoadingProfiler.Instance.StartTimer("GDS_PveLevel.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.PveLevel> (msgData.data,0);
			LoadingProfiler.Instance.EndTimer("GDS_PveLevel.cs::OKHandler");

			FreeStrData ();
		}

		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}
		
		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_PveLevel.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.PveLevel> (m_strData,0);
			LoadingProfiler.Instance.EndTimer("GDS_PveLevel.cs::LoadFromLocal");

			FreeStrData ();
		}

		public KBN.DataTable.PveLevel GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.PveLevel> (id.ToString());
		}

		public string GetLevelNameKey(int levelId)
		{
			KBN.DataTable.PveLevel item = GetItemById (levelId);
			if (item != null) 
			{
				return item.NAME;
			}
			return "";
		}

		public int GetChapterTotalStars(int chapterId)
		{
			int totalStars = 0;
			Dictionary<string, KBN.DataTable.IDataItem> gdsPveLevelList = GameMain.GdsManager.GetGds<KBN.GDS_PveLevel>().GetItemDictionary();
			foreach(string key in gdsPveLevelList.Keys)
			{
				if(_Global.INT32(key)/1000000 == chapterId)
				{
					totalStars += 3;
				}
			}
			return totalStars;
		}


	}
}