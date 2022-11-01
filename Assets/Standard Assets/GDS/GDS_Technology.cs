using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.IO;
using System;
using System.Linq;
using KBN;

public class GDS_Technology : NewGDS 
{
	public override string FileName
	{
		get
		{
			return "technology";
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
		LoadingProfiler.Instance.StartTimer("GDS_Tecnology.cs::OKHandler");
		System.DateTime startTime = System.DateTime.Now;
		PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
		Save (msgData.type, msgData.version, msgData.data, msgData.restart);
		msgData.data=DesDeCode(msgData.data);
		m_DT.UpdateItemsFromString<KBN.DataTable.Technology> (msgData.data,0,1);
		LoadingProfiler.Instance.EndTimer("GDS_Technology.cs::OKHandler");

		FreeStrData ();
	}
	
	public override void ErrorHandler(string errorMessage, string errorCode)
	{
		
	}
	
	public override void LoadFromLocal(string filename)
	{
		LoadingProfiler.Instance.StartTimer("GDS_Tecnology.cs::LoadFromLocal");
		System.DateTime startTime = System.DateTime.Now;
		base.LoadFromLocal (filename);
		m_DT.UpdateItemsFromString<KBN.DataTable.Technology> (m_strData,0,1);
		LoadingProfiler.Instance.EndTimer("GDS_Technology.cs::LoadFromLocal");

		FreeStrData ();
	}

	public KBN.DataTable.Technology GetItemById(int skillID,int level)
	{
		return m_DT.GetItem<KBN.DataTable.Technology> (skillID.ToString(), level.ToString());
	}

	//获得技能类型
	public int getTechnologyType(int skillID)
	{
		KBN.DataTable.Technology tecnology = GetItemById(skillID, 1);
		if(tecnology != null)
		{
			return tecnology.sort;
		}

		return 1;
	}

	//根据技能id获得技能等级上限
	public int getTechnologySkillMaxLevel(int skillID)
	{
		int level=0;
		KBN.DataTable.Technology tecnology = null;
		do{
			level++;
			tecnology = GetItemById(skillID,level);
		}while(tecnology != null);
		level--;
		return level;
	}

	//解锁技能条件
	public string getUnlockSkillCondition(int skillID)
	{
		//int level=0;
		KBN.DataTable.Technology tecnology = GetItemById(skillID,1);;
//		do{
//			level++;
//			tecnology = GetItemById(skillID,level);
//		}while(tecnology != null && tecnology.UNLOCKREQTECH != "0");

		return tecnology.UNLOCKREQTECH;	
	}

	//升级所需资源
	public int getCostResource(int skillID,int level,int resourceId)
	{
		int cost = 0;
		KBN.DataTable.Technology itemData = GetItemById(skillID,level);
		if(itemData!=null)
		{
			switch(resourceId)
			{
			case Constant.ResourceType.GOLD://0
				cost = itemData.GOLD;
				break;
			case Constant.ResourceType.FOOD://1
				cost = itemData.FOOD;
				break;
			case Constant.ResourceType.LUMBER://2
				cost = itemData.WOOD;
				break;
			case Constant.ResourceType.STONE://3
				cost = itemData.STONE;
				break;
			case Constant.ResourceType.IRON://4
				cost = itemData.ORE;
				break;
			case Constant.ResourceType.POPULATION://5
				cost = 0;
				break;
			case Constant.ResourceType.ITEMS://6
				cost = itemData.TIME;
				break;
			case Constant.ResourceType.CARMOT://7
				cost = itemData.Carmot;
				break;
			}
		}
		return cost;
	}

	//解锁 建筑条件
	public HashObject getTechnologyUnlockRequirementData(int skillID,int level)
	{
		Hashtable newHash = new Hashtable();
		KBN.DataTable.Technology itemData = GetItemById(skillID,level);
		string itemKey;
		string itemNum;
		if(itemData!=null)
		{
			string [] columns = itemData.UNLOCKREQBUILD.Split (':');
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

	//解锁 技能条件
	public HashObject getTechnologyUnlockSkillRequirementData(int skillID,int level)
	{
		Hashtable newHash = new Hashtable();
		KBN.DataTable.Technology itemData = GetItemById(skillID,level);
		string itemKey;
		string itemNum;
		if(itemData!=null)
		{
			string [] columns = itemData.UNLOCKREQTECH.Split (';');
			foreach(string strColumn in columns)
			{				
				if(strColumn == "0" || strColumn == "")
				{
					continue;
				}
				else
				{		
					int _Index = strColumn.LastIndexOf('_');			
					itemKey = strColumn.Substring(0,_Index);
					itemNum = strColumn.Substring(_Index+1);
				}
				
				newHash.Add("r"+itemKey, itemNum);
			}
		}
		HashObject data = new HashObject(newHash);
		return data;
	}

	// 升级
	public HashObject getTechnologyRequirementData(int skillID,int level)
	{
		Hashtable newHash = new Hashtable();
		KBN.DataTable.Technology itemData = GetItemById(skillID,level);
		string itemKey;
		string itemNum;
		if(itemData!=null)
		{
			string [] columns = itemData.UPGRATEREQ.Split (':');
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

	public HashObject getTechnologyItemsData(int skillID,int level)
	{
		Hashtable newHash = new Hashtable();
		KBN.DataTable.Technology itemData = GetItemById(skillID,level);
		string itemKey;
		string itemNum;
		if(itemData!=null)
		{
			string [] columns = itemData.ITEM.Split (':');
			foreach(string strColumn in columns)
			{
				if(strColumn == "0" || strColumn == "")continue;
				string [] columns0 = strColumn.Split ('_');
				itemKey = columns0[0];
				itemNum = columns0[1];
				newHash.Add("r8_"+itemKey, itemNum);
			}
		}
		HashObject data = new HashObject(newHash);
		return data;
	}

	public HashObject getTechnologyCostData(int buildingTypeId,int level)
	{
		KBN.DataTable.Technology itemData = GetItemById(buildingTypeId,level);
		if(itemData!=null)
		{
			HashObject data = new HashObject(
				new Hashtable(){
					{"a0",itemData.GOLD},
					{"a1",itemData.FOOD},
					{"a2",itemData.WOOD},
					{"a3",itemData.STONE},
					{"a4",itemData.ORE},
					{"a5",itemData.TIME},
					{"a6",itemData.TIME},
					{"a7",itemData.Carmot},
				}
			);
			return data;
		}
		return null;
	}

	//技能上级条件
	public string getSkillUpgrateContion(int skillID,int level)
	{
		KBN.DataTable.Technology tecnology = GetItemById(skillID, level);
		if(tecnology != null)
		{
			return tecnology.UPGRATEREQ;
		}

		return "";
	}

	//升级技能所需时间
	public int getSkillUpgrateNeedTime(int skillID,int level)
	{
		int time = 0;
		KBN.DataTable.Technology tecnology = GetItemById(skillID, level);
		if(tecnology != null)
		{
			time = tecnology.TIME;
		}

		return time;
	}

	// effect
	public int getEffect(int skillID,int level,int index)
	{
		KBN.DataTable.Technology tecnology = GetItemById(skillID, level);
		if(tecnology != null)
		{
			string effect = tecnology.EFFECT;
			string [] columns = effect.Split ('*');
			string temp = columns[index - 1];
			if(temp != "" && _Global.IsNumber(temp))
			{
				int value = int.Parse(temp);
				return value;
			}			
		}

		return 0;
	}

	public string getEffectString(int skillID,int level,int index)
	{
		KBN.DataTable.Technology tecnology = GetItemById(skillID, level);
		if(tecnology != null)
		{
			string effect = tecnology.EFFECT;
			string [] columns = effect.Split ('*');
			string temp = columns[index - 1];
			return temp;	
		}

		return "";
	}

	// effect 1 2 3 4（_后面是数值） 12是数值  其余是百分比
	public int getEffectIndex(int skillID,int level)
	{
		KBN.DataTable.Technology tecnology = GetItemById(skillID, level);
		if(tecnology != null)
		{
			string effect = tecnology.EFFECT;
			string [] columns = effect.Split ('*');

			for(int i = 0; i < columns.Length;++i)
			{
				string temp = columns[i];
				if(temp != "" && !_Global.IsNumber(temp))
				{
					return i + 1;
				}

				if(temp != "" && _Global.IsNumber(temp) && _Global.INT32(temp) != 0)
				{
					return i + 1;
				}
			}					
		}

		return 1;
	}

	public int getMightValue(int skillID, int level)
	{
		int might = 0;
		KBN.DataTable.Technology tecnology = GetItemById(skillID, level);
		if(tecnology != null)
		{
			might = tecnology.MIGHT;		
		}

		return might;
	}

	public string getIconName(int skillID, int level)
	{
		string icon = "";
		KBN.DataTable.Technology tecnology = GetItemById(skillID, level);
		if(tecnology != null)
		{
			icon = tecnology.ICON;		
		}
		
		return icon;
	}
}
