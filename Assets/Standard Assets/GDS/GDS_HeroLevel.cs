using UnityEngine;
using System.Collections;
using System.Threading;
namespace KBN
{
	public class GDS_HeroLevel : NewGDS 
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
			LoadingProfiler.Instance.StartTimer("GDS_HeroLevel.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.HeroLevel> (msgData.data,0,1);
			LoadingProfiler.Instance.EndTimer("GDS_HeroLevel.cs::OKHandler");

			FreeStrData ();
		}

		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}

		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_HeroLevel.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.HeroLevel> (m_strData,0,1);
			LoadingProfiler.Instance.EndTimer("GDS_HeroLevel.cs::LoadFromLocal");

			FreeStrData ();
		}

		public KBN.DataTable.HeroLevel GetItemById(int id, int level)
		{
			return m_DT.GetItem<KBN.DataTable.HeroLevel> ((id/Constant.Hero.MaxHeroNumPerTier).ToString(), level.ToString());
		}
	}
}