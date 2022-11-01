using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.IO;
using System;
using System.Linq;
namespace KBN
{
	public class GDS_Troop : NewGDS 
	{
		private string LV;
		private string YourLv;
		private string Population;

		public const int MAX_UNIT = 50;
		
        public override string FileName
        {
            get
            {
                return "troop";
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
			LoadingProfiler.Instance.StartTimer("GDS_Troop.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
//			long mem1 = System.GC.GetTotalMemory (true);
			m_DT.UpdateItemsFromString<KBN.DataTable.Troop> (msgData.data,0);
//			long mem2 = System.GC.GetTotalMemory (true);
//			_Global.Log("######  DataTable GDS_Troop Memory:" + (mem2 - mem1));
			LoadingProfiler.Instance.EndTimer("GDS_Troop.cs::OKHandler");

			FreeStrData ();
		}
		
		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}
		
		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_Troop.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.Troop> (m_strData,0);
			LoadingProfiler.Instance.EndTimer("GDS_Troop.cs::LoadFromLocal");

			FreeStrData ();
		}
		
		public KBN.DataTable.Troop GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.Troop> (id.ToString());
		}
		
		protected override void Init()
		{
			base.Init();
			Population = Datas.getArString("Common.Population");
			LV =  Datas.getArString("Common.Lv") ;
			YourLv = Datas.getArString("Common.YourLevel");
		}

		public ArrayList GetTroopIDs()
		{
			ArrayList arr = new ArrayList();
			Dictionary<string, KBN.DataTable.IDataItem> gdsTroopList = GetItemDictionary();
			foreach(string key in gdsTroopList.Keys)
			{
				if(_Global.INT32(key) < MAX_UNIT)
				{
					arr.Add("u"+key);
				}
			}

			return arr;
		}
		
		public HashObject GetTrainCostData(string troopType,int troopId)
		{
			KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());
			if(itemTroop!=null)
			{
				HashObject data = new HashObject(
					new Hashtable(){
						{"a0",itemTroop.Gold},
						{"a1",itemTroop.Food},
						{"a2",itemTroop.Wood},
						{"a3",itemTroop.Stone},
						{"a4",itemTroop.Iron},
						{"a5",itemTroop.Population},
						{"a6",itemTroop.Time},
						{"a7",itemTroop.Carmot},
					}
				);
				return data;
			}
			return null;
		}
		
		public bool IsTroop(string troopType,int troopId)
		{
			if(troopType == Constant.TroopType.UNITS && troopId>=0 && troopId<MAX_UNIT)
			{
				KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());
				if(itemTroop != null)
					return true;
			}
			else if(troopType == Constant.TroopType.FORT && troopId>=MAX_UNIT)
			{
				KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());
				if(itemTroop != null)
					return true;
			}

			return false;
		}
		
		public int GetAttributeFromAttrType(string troopType,int troopId,int attrType)
		{
			KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());
			if(itemTroop!=null)
			{
				switch(attrType)
				{
				case Constant.TroopAttrType.HEALTH:
					return itemTroop.LIFE;
				case Constant.TroopAttrType.ATTACK:
					return itemTroop.ATTACK;
				case Constant.TroopAttrType.SPEED:
					return itemTroop.SPEED;
				case Constant.TroopAttrType.AVASPEED:
					return itemTroop.AVA_SPEED;
				case Constant.TroopAttrType.LOAD:
					return itemTroop.LOAD;
				case Constant.TroopAttrType.UPKEEP:
					return itemTroop.UPKEEP;
				case Constant.TroopAttrType.SPACE:
					return itemTroop.SPACE;
				case Constant.TroopAttrType.MIGHT:
					return itemTroop.MIGHT;
				case Constant.TroopAttrType.TIER:
					return itemTroop.TIER;
				case Constant.TroopAttrType.LIFERATE:
					return itemTroop.LIFE_RATE;
				case Constant.TroopAttrType.ATTACKRATE:
					return itemTroop.ATTACK_RATE;
				case Constant.TroopAttrType.TRAINABLE:
					return itemTroop.TRAINABLE;
				case Constant.TroopAttrType.TYPE:
					return itemTroop.Type;
				
				}
			}
			return 0;
		}

		public int GetTrainCostResource(string troopType,int troopId,int resourceId)
		{
			int costRes = 0;
			KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());
			if(itemTroop!=null)
			{
				switch(resourceId)
				{
				case 0:
					costRes = itemTroop.Gold;
					break;
				case 1:
					costRes = itemTroop.Food;
					break;
				case 2:
					costRes = itemTroop.Wood;
					break;
				case 3:
					costRes = itemTroop.Stone;
					break;
				case 4:
					costRes = itemTroop.Iron;
					break;
				case 5:
					costRes = itemTroop.Population;
					break;
				case 6:
					costRes = itemTroop.Time;
					break;
				}
			}

			if(costRes < 0)
				costRes = 0;
			return costRes;

		}
		
		public int GetTrainBaseTime(string troopType,int troopId)
		{
			int retTime = 0;
			KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());
			if(itemTroop!=null)
			{
				retTime = itemTroop.Time;
			}
			if(retTime < 0)
				retTime = 0;
			return retTime;
		}
		
		public ArrayList GetTrainNeedItems(string troopType,int troopId)
		{
			ArrayList retArr = new ArrayList();
			HashObject itemObj;
			int reqItemId;
			int reqNum = 0;

			KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());

			string itemKey;
			if(itemTroop!=null)
			{
				string [] columns = itemTroop.REQUIREMENT.Split ('*');
				foreach(string strColumn in columns)
				{
					if(strColumn == "0" || strColumn == "")continue;
					int _Index = strColumn.LastIndexOf('_');
					itemKey = strColumn.Substring(0,_Index);

					if(itemKey.StartsWith("8_"))
					{
						reqItemId = _Global.INT32(itemKey.Substring(2));
						reqNum = _Global.INT32(strColumn.Substring(_Index+1));
						itemObj = new HashObject(
							new Hashtable()
							{
								{"itemId",reqItemId},
								{"num",reqNum},
							}
						);
						retArr.Add(itemObj);
					}
				}
			}
			return retArr;
		}
		
		public HashObject GetRequirementData(string troopType,int troopId)
		{
			KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());
			if(itemTroop!=null)
			{
				Hashtable newHash = new Hashtable();
				string [] columns = itemTroop.REQUIREMENT.Split ('*');
				foreach(string strColumn in columns)
				{
					if(strColumn == "0" || strColumn == "")continue;
					int _Index = strColumn.LastIndexOf('_');
					string itemKey = strColumn.Substring(0,_Index);
					string itemNum= strColumn.Substring(_Index+1);

					newHash.Add("r"+itemKey, itemNum);
				}
				HashObject data = new HashObject(newHash);
				return data;
			}
			return null;
		}
		
		public HashObject GetCostData(string troopType,int troopId)
		{
			KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());
			if(itemTroop!=null)
			{
				HashObject data = new HashObject(
					new Hashtable(){
					{"a0",itemTroop.Gold},
					{"a1",itemTroop.Food},
					{"a2",itemTroop.Wood},
					{"a3",itemTroop.Stone},
					{"a4",itemTroop.Iron},
					{"a5",itemTroop.Population},
					{"a6",itemTroop.Time},
					{"a7",itemTroop.Carmot},
				}
				);
				return data;
			}
			return null;
		}
		
		public int GetTroopMight(string troopType,int troopId)
		{
			KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());
			if(itemTroop!=null)
			{
				return itemTroop.MIGHT;
			}
			return 0;
		}
		
		//	order by Constant.ResourceType
		public int[] GetTroopHealCostData(int troopId)
		{
			int[] cost = new int[8];	//	Constant.ResourceType[0~4];

			KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());
			if(itemTroop!=null)
			{
				cost[0] = itemTroop.CURE_GOLD;
				cost[1] = itemTroop.CURE_FOOD;
				cost[2] = itemTroop.CURE_WOOD;
				cost[3] = itemTroop.CURE_STONE;
				cost[4] = itemTroop.CURE_IRON;
				cost[7] = itemTroop.CURE_CARMOT;
			}
			return cost;
		}
		
		public int GetTroopHealCostTime(int troopId)
		{
			KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());
			if(itemTroop!=null)
			{
				return itemTroop.CURE_TIME;
			}
			return 0;
		}

		public class ResourceRequire
		{
			public struct TroopRequire
			{
				public TroopRequire(int tID, int tCnt)
				{
					troopId = tID;
					troopCnt = tCnt;
				}
				public int troopId;
				public int troopCnt;
			}

			public struct ItemRequire
			{
				public ItemRequire(int iID, int iCnt)
				{
					itemId = iID;
					itemCnt = iCnt;
				}
				public int itemId;
				public int itemCnt;
			}

			public ResourceRequire()
			{
				troopRequire = new System.Collections.Generic.List<TroopRequire>();
				itemRequire = new System.Collections.Generic.List<ItemRequire>();
			}

			public System.Collections.Generic.List<TroopRequire> troopRequire;
			public System.Collections.Generic.List<ItemRequire> itemRequire;
		}


		public ResourceRequire GetResourceRequeire(string troopType, int troopId)
		{
			var rr = new ResourceRequire();
			KBN.DataTable.Troop itemTroop = m_DT.GetItem<KBN.DataTable.Troop> (troopId.ToString ());

			string itemKey;
			if ( itemTroop!=null )
			{
				string [] columns = itemTroop.REQUIREMENT.Split ('*');
				foreach(string strColumn in columns)
				{
					if(strColumn == "0" || strColumn == "")continue;
					int _Index = strColumn.LastIndexOf('_');
					itemKey = strColumn.Substring(0,_Index);
					
					if ( itemKey.StartsWith("20_") )
					{
						var reqTroopId = _Global.INT32(itemKey.Substring(3));
						var reqNum = _Global.INT32(strColumn.Substring(_Index+1));
						rr.troopRequire.Add(new ResourceRequire.TroopRequire(reqTroopId, reqNum));
						continue;
					}

					if ( itemKey.StartsWith("8_") )
					{
						var reqItemId = _Global.INT32(itemKey.Substring(2));
						var reqItemNum = _Global.INT32(strColumn.Substring(_Index+1));
						rr.itemRequire.Add(new ResourceRequire.ItemRequire(reqItemId, reqItemNum));
						continue;
					}
				}
			}
			return rr;
		}

		public ArrayList GetTrainNeedTroops(string troopType,int troopId)
		{
			ArrayList retArr = new ArrayList();
			var rr = this.GetResourceRequeire(troopType, troopId);
			for ( int i = 0; i != rr.troopRequire.Count; ++i )
			{
				//reqTroopId = _Global.INT32(itemKey.Substring(3));
				//reqNum = _Global.INT32(strColumn.Substring(_Index+1));
				HashObject itemObj = new HashObject(
					new Hashtable()
					{
						{"troopId", rr.troopRequire[i].troopId},
						{"num", rr.troopRequire[i].troopCnt},
					}
				);
				retArr.Add(itemObj);
			}
			return retArr;
		}
	}
}