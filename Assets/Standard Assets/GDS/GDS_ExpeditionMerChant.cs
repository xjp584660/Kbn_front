/*
 * @FileName:		GDS_ExpeditionMap.cs
 * @Author:			xue
 * @Date:			2022-08-25 10:45:11
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	GDS 迷雾远征 商人物品 配置数据
 *
*/





namespace KBN {

    public class GDS_ExpeditionMerChant : NewGDS {

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
            LoadingProfiler.Instance.StartTimer("GDS_ExpeditionMerChant.cs:OKHandler");
            System.DateTime stratTime = System.DateTime.Now;
            PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS>(data);
            Save(msgData.type, msgData.version, msgData.data, msgData.restart);
            msgData.data = DesDeCode(msgData.data);
            m_DT.UpdateItemsFromString<KBN.DataTable.ExpeditionMerChant>(msgData.data, 0);
            LoadingProfiler.Instance.EndTimer("GDS_ExpeditionMerChant.cs:OKHandler");

            FreeStrData();
        }


        public override void LoadFromLocal(string filename)
        {
            LoadingProfiler.Instance.StartTimer("GDS_ExpeditionMerChant.cs:OKHandler");
            System.DateTime startTime = System.DateTime.Now;
            base.LoadFromLocal(filename);
            m_DT.UpdateItemsFromString<KBN.DataTable.ExpeditionMerChant>(m_strData, 0);
            LoadingProfiler.Instance.EndTimer("GDS_ExpeditionMerChant.cs::LoadFromLocal");

            FreeStrData();
        }

        public KBN.DataTable.ExpeditionMerChant GetItemById(string id)
        {
            return m_DT.GetItem<KBN.DataTable.ExpeditionMerChant>(id);
        }

    }

}