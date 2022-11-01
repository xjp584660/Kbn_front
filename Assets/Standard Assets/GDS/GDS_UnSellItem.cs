using UnityEngine;
using System.Collections;
using System.Threading;

namespace KBN
{
	public class GDS_UnSellItem :  GDS_Template<DataTable.UnSellitem, GDS_UnSellItem> 
	{

	    public override void OKHandler(byte[] data)
		{
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.UnSellitem> (msgData.data,0);
			FreeStrData ();
		}
		
		protected override void ParseStrData()
		{
			System.DateTime startTime = System.DateTime.Now;
			//_Global.Log("$$$$$  Real DataTable m_gdsName: " + (System.DateTime.Now - startTime).TotalMilliseconds);
			m_DT.UpdateItemsFromString<KBN.DataTable.UnSellitem> (m_strData,0);
			//_Global.Log("$$$$$  Parse DataTable m_gdsName: " + (System.DateTime.Now - startTime).TotalMilliseconds);
		}

	}
}

