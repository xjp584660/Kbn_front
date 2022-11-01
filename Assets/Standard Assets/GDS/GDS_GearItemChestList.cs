using UnityEngine;
using System.Collections;
using System.Threading;
using System.Collections.Generic;
namespace KBN
{
	public class GDS_GearItemChestList : NewGDS
	{	
        public override string FileName
        {
            get
            {
                return "gearItemChest";
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
			LoadingProfiler.Instance.StartTimer("GDS_GearItemChestList.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
//			long mem1 = System.GC.GetTotalMemory (true);
			m_DT.UpdateItemsFromString<KBN.DataTable.GearItemChest>(msgData.data,0);
//			long mem2 = System.GC.GetTotalMemory (true);
//			_Global.Log("######  DataTable GDS_GearItemChestList Memory:" + (mem2 - mem1));
			LoadingProfiler.Instance.EndTimer("GDS_GearItemChestList.cs::OKHandler");

			FreeStrData ();

		}
		
		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}
		
		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_GearItemChestList.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			long mem1 = System.GC.GetTotalMemory (true);
			m_DT.UpdateItemsFromString<KBN.DataTable.GearItemChest>(m_strData,0);
			long mem2 = System.GC.GetTotalMemory (true);
			LoadingProfiler.Instance.EndTimer("GDS_GearItemChestList.cs::LoadFromLocal");

			FreeStrData ();
		}
		
		public KBN.DataTable.GearItemChest GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.GearItemChest>(id.ToString());
		}

		public List<int> GetCanBuyItemList(int itemId)
		{
			List<int> retList = new List<int> ();
			KBN.DataTable.GearItemChest item = GetItemById(itemId);
			if(item != null)
			{
				string items =  item.chestList;
				char [] charSeparators = new char[]{'/'};
				string[] result = items.Split(charSeparators, System.StringSplitOptions.None);
				for(int i=0;i<result.Length;i++)
				{
					if( !System.String.IsNullOrEmpty(result[i]))
					{
						retList.Add(_Global.INT32(result[i]));
					}
				}
			}
			return retList;
		}


//		public function GetCanBuyItemList(itemId:int):Array
//		{
//			var tObj:HashObject = super.m_Data[itemId.ToString()];
//			if (null!= tObj && tObj["chestList"])
//			{
//				var list:Array = new Array();
//				var count:int = tObj["chestList"].Table.Count;
//				for (var i:int = 0; i < count; i++)
//				{
//					list.Add(tObj["chestList"]["p" + i].Value);
//				}
//				return list;
//			}
//			
//			return null;
//		}


	}
}