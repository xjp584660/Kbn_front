/*
 * @FileName:		GDS_ExpeditionBattle.cs
 * @Author:			lisong
 * @Date:			2022-05-17 14:45:56
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	GDS 迷雾远征 战斗奖励 配置数据
 *
*/

namespace KBN
{
    public class GDS_ExpeditionBattle : NewGDS
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
			LoadingProfiler.Instance.StartTimer("GDS_ExpeditionBattle.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS>(data);
			Save(msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data = DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.ExpeditionBattle>(msgData.data, 0);
			LoadingProfiler.Instance.EndTimer("GDS_ExpeditionBattle.cs::OKHandler");

			FreeStrData();
		}



		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_ExpeditionBattle.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal(filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.ExpeditionBattle>(m_strData, 0);
			LoadingProfiler.Instance.EndTimer("GDS_ExpeditionBattle.cs::LoadFromLocal");

			FreeStrData();
		}


		public KBN.DataTable.ExpeditionBattle GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.ExpeditionBattle>(id.ToString());
		}

	}
}