
namespace KBN
{
    public class GDS_Template<T, TD> : NewGDS where TD : class, new() where T : KBN.DataTable.IDataItem, new()
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
            LoadingProfiler.Instance.StartTimer(FileName + "OKHandler");
            System.DateTime startTime = System.DateTime.Now;
            PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS>(data);
            Save(msgData.type, msgData.version, msgData.data, msgData.restart);
            pri_UpdateItemsFromString();
            LoadingProfiler.Instance.EndTimer(FileName + "OKHandler");

            FreeStrData();
        }

        public override void ErrorHandler(string errorMessage, string errorCode)
        {

        }

        public override void LoadFromLocal(string filename)
        {
            LoadingProfiler.Instance.StartTimer(filename + "LoadFromLocal");
            base.LoadFromLocal(filename);
            ParseStrData();
            LoadingProfiler.Instance.EndTimer(filename + "LoadFromLocal");
            FreeStrData();
        }

        protected virtual void ParseStrData()
        {
            System.DateTime startTime = System.DateTime.Now;
            UpdateItemsFromString();
        }

        protected virtual void pri_UpdateItemsFromString(){
            m_strData = DesDeCode(m_strData);
            m_DT.UpdateItemsFromString<T>(m_strData, 0);
        }

        protected virtual void UpdateItemsFromString()
        {
            // m_strData = DesDeCode(m_strData);
            m_DT.UpdateItemsFromString<T>(m_strData, 0);
        }

        public T GetItemById(int id)
        {
            return m_DT.GetItem<T>(id.ToString());
        }

        public T GetItemById(params string[] keys)
        {
            return m_DT.GetItem<T>(keys);
        }




    }
}
