
/*
 * @FileName:		GDS_ExpeditionMap.cs
 * @Author:			xue
 * @Date:			2022-08-12 14:46:11
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	GDS 迷雾远征 领袖 配置数据
 *
*/


namespace KBN
{
    public class GDS_ExpeditionLeader : NewGDS
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
            LoadingProfiler.Instance.StartTimer("GDS_ExpeditionLeader.cs:OKHandler");
            System.DateTime stratTime = System.DateTime.Now;
            PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS>(data);
            Save(msgData.type, msgData.version, msgData.data, msgData.restart);
            msgData.data = DesDeCode(msgData.data);
            m_DT.UpdateItemsFromString<KBN.DataTable.ExpeditionLeader>(msgData.data, 0);
            LoadingProfiler.Instance.EndTimer("GDS_ExpeditionLeader.cs:OKHandler");

            FreeStrData();
        }


        public override void LoadFromLocal(string filename)
        {
            LoadingProfiler.Instance.StartTimer("GDS_ExpeditionLeader.cs:OKHandler");
            System.DateTime startTime = System.DateTime.Now;
            base.LoadFromLocal(filename);
            m_DT.UpdateItemsFromString<KBN.DataTable.ExpeditionLeader>(m_strData, 0);
            LoadingProfiler.Instance.EndTimer("GDS_ExpeditionLeader.cs::LoadFromLocal");

            FreeStrData();
        }

        public KBN.DataTable.ExpeditionLeader GetItemById(string id)
        {
            return m_DT.GetItem<KBN.DataTable.ExpeditionLeader>(id);
        }

    }
}