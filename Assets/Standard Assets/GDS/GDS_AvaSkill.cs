using UnityEngine;
using System.Collections;
using System.Threading;

namespace KBN
{
    public class GDS_AvaSkill : GDS_Template<DataTable.AvaSkill, GDS_AvaSkill>
    {
        public override void OKHandler(byte[] data)
        {
            PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
            Save (msgData.type, msgData.version, msgData.data, msgData.restart);
            msgData.data=DesDeCode(msgData.data);
            m_DT.UpdateItemsFromString<KBN.DataTable.AvaSkill> (msgData.data,0,1);
            FreeStrData ();
        }

        protected override void ParseStrData()
        {
            System.DateTime startTime = System.DateTime.Now;
            _Global.Log("$$$$$  Real DataTable m_gdsName: " + (System.DateTime.Now - startTime).TotalMilliseconds);
            m_DT.UpdateItemsFromString<KBN.DataTable.AvaSkill> (m_strData,0,1);
            _Global.Log("$$$$$  Parse DataTable m_gdsName: " + (System.DateTime.Now - startTime).TotalMilliseconds);
        }
    }
}