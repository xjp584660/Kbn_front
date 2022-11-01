
/*
 * @FileName:		GDS_ExpeditionMap.cs
 * @Author:			xue
 * @Date:			2022-08-11 16:54:22
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	GDS 迷雾远征 Buff 配置数据
 *
*/


using System.Collections.Generic;

namespace KBN
{
    public class GDS_ExpeditionBuff : NewGDS
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
			LoadingProfiler.Instance.StartTimer("GDS_ExpeditionBuff.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS>(data);
			Save(msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data = DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.ExpeditionBuff>(msgData.data, 0);
			LoadingProfiler.Instance.EndTimer("GDS_ExpeditionBuff.cs::OKHandler");

			FreeStrData();
		}



		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_ExpeditionBuff.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal(filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.ExpeditionBuff>(m_strData, 0);
			LoadingProfiler.Instance.EndTimer("GDS_ExpeditionBuff.cs::LoadFromLocal");

			FreeStrData();
		}


		public KBN.DataTable.ExpeditionBuff GetItemById(string id)
		{
			return m_DT.GetItem<KBN.DataTable.ExpeditionBuff>(id);
		}

	}

}
