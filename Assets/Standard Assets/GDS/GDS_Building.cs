using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.IO;
using System;
using System.Linq;
using KBN;

public class GDS_Building : NewGDS
{
    public override string FileName
    {
        get
        {
            return "building";
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
		LoadingProfiler.Instance.StartTimer("GDS_Building.cs::OKHandler");
		System.DateTime startTime = System.DateTime.Now;
		PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
		Save (msgData.type, msgData.version, msgData.data, msgData.restart);
		msgData.data=DesDeCode(msgData.data);
//		long mem1 = System.GC.GetTotalMemory (true);
		m_DT.UpdateItemsFromString<KBN.DataTable.Building> (msgData.data,0,1);
//		long mem2 = System.GC.GetTotalMemory (true);
//		_Global.Log("######  DataTable GDS_Building Memory:" + (mem2 - mem1));
		LoadingProfiler.Instance.EndTimer("GDS_Building.cs::OKHandler");

		FreeStrData ();
	}
	
	public override void ErrorHandler(string errorMessage, string errorCode)
	{
		
	}
	
	public override void LoadFromLocal(string filename)
	{
		LoadingProfiler.Instance.StartTimer("GDS_Building.cs::LoadFromLocal");
		System.DateTime startTime = System.DateTime.Now;
		base.LoadFromLocal (filename);
		m_DT.UpdateItemsFromString<KBN.DataTable.Building> (m_strData,0,1);
		LoadingProfiler.Instance.EndTimer("GDS_Building.cs::LoadFromLocal");

		FreeStrData ();
	}
	
	public KBN.DataTable.Building GetItemById(int id,int level)
	{
		return m_DT.GetItem<KBN.DataTable.Building> (id.ToString(), level.ToString());
	}
	
	//"0000": none, "1000": city1,"1100":city1 and city 2, ... "1111": all city
	public string getNeedCityOrder(int buildingTypeId,int level)
	{
		KBN.DataTable.Building itemData = GetItemById(buildingTypeId,level);
		if(itemData!=null)
		{
			return _Global.GetString(itemData.City);
		}
		return "";
	}
	
	public HashObject getPrestigeDataFromRealLv(int buildingTypeId,int curLevel)
	{
		HashObject retData = new HashObject(
			new Hashtable(){
				{"prestige",0},
				{"level",curLevel}
			}
		);

		int i = 0;
		int prestige = 0;
		KBN.DataTable.Building itemData = null;
		do{
			i++;
			itemData = GetItemById(buildingTypeId,i);
			if(itemData != null && itemData.PRESTIGE != "")
			{
				prestige++;
				if(curLevel>i)
				{
					retData["prestige"].Value = prestige;
					retData["level"].Value = curLevel - i;
				}
			}
		}while(itemData != null);

		return retData;
	}
	
	public int getMaxLevelOfThisPrestige(int buildingTypeId,int prestige)
	{
		int retLevel = getPrestigeLevel(buildingTypeId,prestige+1) == Constant.INVALID_PRESTIGELV ? getBuildingTopLevel(buildingTypeId):getPrestigeLevel(buildingTypeId,prestige+1);
		return retLevel;
	}
	
	public int getPrestigeLevel(int buildingTypeId,int prestige)
	{
		if(prestige>=0 && prestige<=3)
		{
			int i = 0;
			int curPrestige = 0;
			KBN.DataTable.Building itemData = null;
			do{
				i++;
				itemData = GetItemById(buildingTypeId,i);
				if(itemData != null && itemData.PRESTIGE != "")
				{
					curPrestige++;
					if(prestige == curPrestige)
						return i;
				}
			}while(itemData != null);
		}
		return 0;
	}
	
	public bool isPrestigeLevel(int buildingTypeId,int curLevel)
	{
		int i = 0;
		KBN.DataTable.Building itemData = null;
		do{
			i++;
			itemData = GetItemById(buildingTypeId,i);
			if(itemData != null && itemData.PRESTIGE != "")
			{
				if(curLevel == i)
					return true;
			}
		}while(itemData != null);
		return false;
	}
	
	public string getPrestigeImgName(int buildingTypeId,int curLevel)
	{
		int i = 0;
		KBN.DataTable.Building itemData = null;
		do{
			i++;
			itemData = GetItemById(buildingTypeId,i);
			if(itemData != null && itemData.PRESTIGE != "")
			{
				if(curLevel == i)
					return itemData.PRESTIGE;
			}
		}while(itemData != null);
		return "";
	}
	
	public int getBuildingTopLevel(int buildingTypeId)
	{
		int level=0;
		KBN.DataTable.Building itemData = null;
		do{
			level++;
			itemData = GetItemById(buildingTypeId,level);
		}while(itemData != null);
		level--;
		return level;
	}

	public int getMaxMarch(int buildingTypeId, int level)
	{
		int max = 0;
		KBN.DataTable.Building itemData = GetItemById(buildingTypeId,level);
		if(itemData != null)
		{
			string effect = itemData.EFFECT;
			string [] columns = effect.Split ('*');
			string maxMarch = columns[1];
			max = _Global.INT32(maxMarch.Substring(3));
		}
		return max;
	}
	
	public int getCostResource(int buildingTypeId, int level, int resourceId)
	{
		int cost = 0;
		KBN.DataTable.Building itemData = GetItemById(buildingTypeId,level);
		if(itemData!=null)
		{
			switch(resourceId)
			{
			case 0:
				cost = itemData.Gold;
				break;
			case 1:
				cost = itemData.Food;
				break;
			case 2:
				cost = itemData.Wood;
				break;
			case 3:
				cost = itemData.Stone;
				break;
			case 4:
				cost = itemData.Iron;
				break;
			case 5:
				cost = itemData.Population;
				break;
			case 6:
				cost = itemData.Time;
				break;
			case 7:
				cost = _Global.INT32(itemData.Carmot);
				break;
			}
		}
		return cost;
	}
	
	public int getBuildBaseTimeForLevel(int buildingTypeId, int level)
	{
		int time = 0;
		KBN.DataTable.Building itemData = GetItemById(buildingTypeId,level);
		if(itemData!=null)
		{
			time = itemData.Time;
		}
		return time;
	}
	
	public System.Collections.Generic.IEnumerable<HashObject> getBuildNeedItems(int buildingTypeId,int level)
	{
		KBN.DataTable.Building itemData = GetItemById(buildingTypeId,level);
		string itemKey;
		if(itemData!=null)
		{
			string [] columns = itemData.REQUIREMENT.Split ('*');
			foreach(string strColumn in columns)
			{
				if(strColumn == "0" || strColumn == "")continue;
				int _Index = strColumn.LastIndexOf('_');
				itemKey = strColumn.Substring(0,_Index);
				
				if(itemKey.StartsWith("8_"))
				{
					int reqItemId = _Global.INT32(itemKey.Substring(2));
					int reqNum = _Global.INT32(strColumn.Substring(_Index+1));
					HashObject itemObj = new HashObject(new System.Collections.Hashtable{{"itemId",reqItemId},{"num",reqNum}});
					yield return itemObj;
				}
			}
		}
		
	}
	
	public HashObject getBuildRequirementData(int buildingTypeId,int level)
	{
		Hashtable newHash = new Hashtable();
		KBN.DataTable.Building itemData = GetItemById(buildingTypeId,level);
		string itemKey;
		string itemNum;
		if(itemData!=null)
		{
			string [] columns = itemData.REQUIREMENT.Split ('*');
			foreach(string strColumn in columns)
			{
				if(strColumn == "0" || strColumn == "")continue;
				int _Index = strColumn.LastIndexOf('_');
				itemKey = strColumn.Substring(0,_Index);
				itemNum = strColumn.Substring(_Index+1);
				newHash.Add("r"+itemKey, itemNum);
			}
		}
		HashObject data = new HashObject(newHash);
		return data;
	}
	
	public HashObject getBuildCostData(int buildingTypeId,int level)
	{
		KBN.DataTable.Building itemData = GetItemById(buildingTypeId,level);
		if(itemData!=null)
		{
			HashObject data = new HashObject(
				new Hashtable(){
					{"a0",itemData.Gold},
					{"a1",itemData.Food},
					{"a2",itemData.Wood},
					{"a3",itemData.Stone},
					{"a4",itemData.Iron},
					{"a5",itemData.Population},
					{"a6",itemData.Time},
					{"a7",itemData.Carmot},
				}
			);
			return data;
		}
		return null;
	}
	//singal effect
	public int getBuildingEffect(int buildingTypeId,int level,string effectType)
	{
		int ret = 0;
		KBN.DataTable.Building itemData = GetItemById(buildingTypeId,level);
		string itemKey;
		string itemNum;
		if(itemData!=null)
		{
			string [] columns = itemData.EFFECT.Split ('*');
			foreach(string strColumn in columns)
			{
				if(strColumn == "0" || strColumn == "")continue;
				int _Index = strColumn.LastIndexOf('_');
				itemKey = strColumn.Substring(0,_Index);
				itemNum = strColumn.Substring(_Index+1);
				if(effectType == itemKey)
					ret = _Global.INT32(itemNum);
			}
		}
		return ret;
	}
	
	public string getBuildingIconName(int buildingTypeId,int level)
	{
		string ret = "";
		KBN.DataTable.Building itemData = GetItemById(buildingTypeId,level);
		if(itemData!=null)
		{
			ret = _Global.GetString(itemData.Icon);
		}
		return ret;
	}
	
	public string getBuildingImgName(int buildingTypeId,int level)
	{
		string ret = "";
		KBN.DataTable.Building itemData = GetItemById(buildingTypeId,level);
		if(itemData!=null)
		{
			ret = _Global.GetString(itemData.Image);
		}
		return ret;
	}

    public class DebugException : System.Exception
    {
        public DebugException(string msg) : base(msg)
        {
        }
    }

    public string getBuildingImgNameWithThrow(int buildingTypeId, int level)
    {
        string ret = getBuildingImgName(buildingTypeId, level);
        if (string.IsNullOrEmpty(ret))
        {
            string errorMsg = "Unknown error";

			KBN.DataTable.Building itemData = GetItemById(buildingTypeId,level);
			if(itemData==null)
			{
				errorMsg = "data is null";
			}
            throw new DebugException(errorMsg);
        }
        return ret;
    }
}
