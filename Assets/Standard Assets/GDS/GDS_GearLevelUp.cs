using UnityEngine;
using System.Collections;
using System.Threading;
namespace KBN
{
	public class GDS_GearLevelUp : NewGDS
	{
        public override string FileName
        {
            get
            {
                return "gearLevelUp";
            }
        }
		
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
			LoadingProfiler.Instance.StartTimer("GDS_GearLevelUp.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
//			long mem1 = System.GC.GetTotalMemory (true);
			m_DT.UpdateItemsFromString<KBN.DataTable.GearLevelUp> (msgData.data,0,1);
//			long mem2 = System.GC.GetTotalMemory (true);
//			_Global.Log("######  DataTable GDS_GearLevelUp Memory:" + (mem2 - mem1));
			LoadingProfiler.Instance.EndTimer("GDS_GearLevelUp.cs::OKHandler");

			FreeStrData ();
		}
		
		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}
		
		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_GearLevelUp.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.GearLevelUp> (m_strData,0,1);
			LoadingProfiler.Instance.EndTimer("GDS_GearLevelUp.cs::LoadFromLocal");

			FreeStrData ();
		}

		public KBN.DataTable.GearLevelUp GetItemById(int id, int level)
		{
			return m_DT.GetItem<KBN.DataTable.GearLevelUp> (id.ToString(), level.ToString());
		}

		public KBN.DataTable.GearLevelUp GetArmLevelData(int armId, int armLvl)
		{
			return GetItemById (armId, armLvl);
		}

		public int GetArmMaxLevel(int armId)
		{
			int level = 1;
			KBN.DataTable.GearLevelUp item = GetItemById(armId,level);
			while(item != null)
			{
				item = GetItemById(armId,++level);
			}
			return --level;
		}	


		public int GetStrengthenMight(int armId, int level, bool success)
		{
			KBN.DataTable.GearLevelUp item = GetItemById(armId,level);
			if(item == null) 
				return 0;
			if(success)
			{
				return item.mightSucc;
			}
			else
			{
				return item.mightFail;
			}
		}

		public int GetItemShowRate(int gearId,int gearlevel,int itemId)
		{
			KBN.DataTable.GearLevelUp item = GetItemById(gearId,gearlevel);
			string items = item.item;
			string showRates = item.showRate;
			char [] charSeparators = new char[]{'*'};
			string[] strItems = items.Split(charSeparators, System.StringSplitOptions.None);
			string[] strShowRates = showRates.Split(charSeparators, System.StringSplitOptions.None);
			if(strItems.Length != strShowRates.Length)
				return 0;
			for(int i=0;i<strItems.Length;i++)
			{
				if(_Global.INT32(strItems[i]) == itemId)
				{
					return _Global.INT32(strShowRates[i]);
				}
			}

			return 0;
		}
	}
}