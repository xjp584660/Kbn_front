using UnityEngine;
using System.Collections;
using System.Threading;
namespace KBN
{
	public class GDS_HeroBasic : NewGDS 
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
			LoadingProfiler.Instance.StartTimer("GDS_HeroBasic.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data,msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.HeroBasic> (msgData.data,0);
			LoadingProfiler.Instance.EndTimer("GDS_HeroBasic.cs::OKHandler");

			FreeStrData ();
		}

		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}

		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_HeroBasic.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.HeroBasic> (m_strData,0);
			LoadingProfiler.Instance.EndTimer("GDS_HeroBasic.cs::LoadFromLocal");

			FreeStrData ();
		}
		
		public KBN.DataTable.HeroBasic GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.HeroBasic> (id.ToString());
		}

		public bool IsElevateLevel(int id,int level,int curElevate)
		{
			KBN.DataTable.HeroBasic gdsItem = GetItemById (id);
			if( gdsItem != null)
			{
				char [] charSeparators = new char[]{'*'};
				string[] strElevateLevels = gdsItem.ELEVATELEVEL.Split(charSeparators, System.StringSplitOptions.None);
				for(int i=0;i<strElevateLevels.Length;i++)
				{
					if(level == _Global.INT32(strElevateLevels[i]) && (curElevate != i+1))
					{
						return true;
					}
				}
				return false;
			}
			else
			{
				return false;
			}
		}
	}
}