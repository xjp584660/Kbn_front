using UnityEngine;
using System.Collections;
using System.Threading;
namespace KBN
{
	public class GDS_HeroSkillFate : NewGDS 
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
			LoadingProfiler.Instance.StartTimer("GDS_HeroSkillFate.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.HeroSkillFate> (msgData.data,0);
			LoadingProfiler.Instance.EndTimer("GDS_HeroSkillFate.cs::OKHandler");

			FreeStrData ();
		}

		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}

		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_HeroSkillFate.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.HeroSkillFate> (m_strData,0);
			LoadingProfiler.Instance.EndTimer("GDS_HeroSkillFate.cs::LoadFromLocal");

			FreeStrData ();
		}

		public KBN.DataTable.HeroSkillFate GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.HeroSkillFate> (id.ToString());
		}
	}
}