/*
 * @FileName:		GDS_ExpeditionMap.cs
 * @Author:			lisong
 * @Date:			2022-05-17 14:45:56
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	GDS 迷雾远征 地图 配置数据
 *
*/

using System.Collections.Generic;

namespace KBN
{

	public class GDS_ExpeditionMap : NewGDS
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
			LoadingProfiler.Instance.StartTimer("GDS_ExpeditionMap.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS>(data);
			Save(msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data = DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.ExpeditionMap>(msgData.data, 0);
			LoadingProfiler.Instance.EndTimer("GDS_ExpeditionMap.cs::OKHandler");

			FreeStrData();
		}



		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_ExpeditionMap.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal(filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.ExpeditionMap>(m_strData, 0);
			LoadingProfiler.Instance.EndTimer("GDS_ExpeditionMap.cs::LoadFromLocal");

			FreeStrData();
		}


		public KBN.DataTable.ExpeditionMap GetItemById(int id)
		{
			return GetItemById(id.ToString());
		}

		public KBN.DataTable.ExpeditionMap GetItemById(string id)
		{
			return m_DT.GetItem<KBN.DataTable.ExpeditionMap>(id);
		}


		/// <summary>
		/// 根据map id 获得 对应的配置信息数据
		/// </summary>
		/// <param name="mapID"></param>
		/// <returns></returns>
		public List<KBN.DataTable.ExpeditionMap> GetMapConfigDataByMapID(uint mapID) {
			return GetMapConfigDataByMapID(mapID.ToString());
		}

		/// <summary>
		/// 根据map id 获得 对应的配置信息数据
		/// </summary>
		/// <param name="mapID"></param>
		/// <returns></returns>
		public List<KBN.DataTable.ExpeditionMap> GetMapConfigDataByMapID(string mapID)
		{
			var list = new List<KBN.DataTable.ExpeditionMap>();

			var id = (int.Parse(mapID) > 9 ? "1" : "10") + mapID;

			var dic = GetItemDictionary();

			var slotIDList = new List<string>();

            for (int i = 1; i <= 14; i++) {
				var temp = i >9 ? "" +i : "0" +i;
				if (i % 2 != 0) {
					slotIDList.Add(temp + "01");
					slotIDList.Add(temp + "03");
					slotIDList.Add(temp + "05");
				}
				else {
					slotIDList.Add(temp + "02");
					slotIDList.Add(temp + "04");
				}
            }

			slotIDList.Add("1503");


			for (int i = 0; i < slotIDList.Count; i++)
            {
				var key = id + slotIDList[i];
				if (dic.ContainsKey(key)) {
					list.Add((KBN.DataTable.ExpeditionMap)dic[key]);
				}

			}

			return list;
		}


	}
}