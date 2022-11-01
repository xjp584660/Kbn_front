using UnityEngine;
using System.Collections;
using System.Threading;
using System.Collections.Generic;
namespace KBN
{
	public class GDS_PveChapter : NewGDS 
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
			LoadingProfiler.Instance.StartTimer("GDS_PveChapter.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.PveChapter> (msgData.data,0);
			LoadingProfiler.Instance.EndTimer("GDS_PveChapter.cs::OKHandler");

			FreeStrData ();

		}

		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}

		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_PveChapter.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.PveChapter> (m_strData,0);
			LoadingProfiler.Instance.EndTimer("GDS_PveChapter.cs::LoadFromLocal");

			FreeStrData ();
		}

		public KBN.DataTable.PveChapter GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.PveChapter> (id.ToString());
		}

		public int GetChapterIdFromSlotId(int slotId)
		{
			Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection dataItems = GetItems();
			foreach (KBN.DataTable.PveChapter dataItem in dataItems)
			{
				if(dataItem.SLOT_ID == slotId)
				{
					return dataItem.ID;
				}
			}
			return 0;
		}

		public int GetChapterSlotId(int chapterId)
		{
			KBN.DataTable.PveChapter item = GetItemById (chapterId);
			if (item != null) 
				return item.SLOT_ID;
			return 0;
		}

		public int GetChapterType(int chapterId)
		{
			KBN.DataTable.PveChapter item = GetItemById (chapterId);
			if (item != null) 
				return item.TYPE;
			return 0;
		}

		public int GetChapterActiveDuration(int chapterId)
		{
			KBN.DataTable.PveChapter item = GetItemById (chapterId);
			if (item != null) 
				return item.ACTIVE_DURATION;
			return 0;
		}

		public KBN.DataTable.PveChapter GetChapterItemFromSlotId(int slotId)
		{
			Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection dataItems = GetItems();
			foreach (KBN.DataTable.PveChapter dataItem in dataItems)
			{
				if(dataItem.SLOT_ID == slotId)
				{
					return dataItem;
				}
			}
			return null;
		}
	}
}