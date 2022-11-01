using UnityEngine;
using System.Collections;
using System.Threading;
using System.Collections.Generic;
namespace KBN
{
	public class GDS_GearSkill : NewGDS
	{	
        public override string FileName
        {
            get
            {
                return "gearSkill";
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
			LoadingProfiler.Instance.StartTimer("GDS_GearSkill.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
//			long mem1 = System.GC.GetTotalMemory (true);
			m_DT.UpdateItemsFromString<KBN.DataTable.GearSkill> (msgData.data,0);
//			long mem2 = System.GC.GetTotalMemory (true);
//			_Global.Log("######  DataTable GDS_GearSkill Memory:" + (mem2 - mem1));
			LoadingProfiler.Instance.EndTimer("GDS_GearSkill.cs::OKHandler");

			FreeStrData ();
		}
		
		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}
		
		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_GearSkill.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.GearSkill> (m_strData,0);
			LoadingProfiler.Instance.EndTimer("GDS_GearSkill.cs::LoadFromLocal");

			FreeStrData ();
		}
		
		public KBN.DataTable.GearSkill GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.GearSkill> (id.ToString());
		}

        KBN.DataTable.GearSkill _Item;
		public int GetType(int id)
		{
			_Item = GetItemById (id);
			return _Item == null ? 0 : _Item.type;
		}

		public string GetTarget(int id)
		{
			_Item = GetItemById (id);
			return _Item == null ? "" : _Item.subtype;
		}

//		public function GetTarget(id:int):String
//		{
//			var gearSkillItem : GearSkillData.GearSkillItem = m_gearData.Find(id);
//			if ( gearSkillItem == null )
//				return String.Empty;
//			return gearSkillItem.subType;
//		}

		public string GetColor(int id)
		{
			_Item = GetItemById (id);
			return _Item == null ? "" : _Item.color;
		}

		public int GetRare(int id)
		{
			_Item = GetItemById (id);
			return _Item == null ? 0 : _Item.rare;
		}

		public string GetIconSkill(int id)
		{
			_Item = GetItemById (id);
			return _Item == null ? "" : _Item.iconskill;
		}

		public int GetIconLevel(int id)
		{
			_Item = GetItemById (id);
			return _Item == null ? 0 : _Item.iconlevel;
		}

		public string GetIconTarget(int id)
		{
			_Item = GetItemById (id);
			return _Item == null ? "" : _Item.icontarget;
		}

		public string GetIconSkill(int id,bool isActive)
		{
			_Item = GetItemById (id);
			if(null == _Item) return "";
			if (isActive)
			{
				return _Item.iconskill + "_Light";
			}
			else
			{
				return _Item.iconskill + "_dark";
			}
		}

		public string GetIconLevel(int id, bool isActive)
		{
			_Item = GetItemById (id);
			if(null == _Item) return "";
			if (isActive)
			{
				if (SkillTypeIsDebuff(_Item.type))
				{
					return "Aperture_Light" + _Item.iconlevel + "_Debuff";
				}
				else
				{
					return "Aperture_Light" + _Item.iconlevel;
				}
			}
			else
			{
				return "Aperture_dark" + _Item.iconlevel;
			}
		}


		public string GetIconTarget(int id, bool isActive)
		{
			_Item = GetItemById (id);
			if(null == _Item) return "";
			if (isActive)
			{
				if (SkillTypeIsDebuff(_Item.type))
				{
					return _Item.icontarget + "_Light_Debuff";
				}
				else
				{
					return _Item.icontarget + "_Light";
				}
			}
			else
			{
				return _Item.icontarget + "_dark";
			}

		}

		public int GetLevelData(int id,int level)
		{
			_Item = GetItemById (id);
			string skills = (_Item == null ? "" : _Item.lv);
			char [] charSeparators = new char[]{'*'};
			string[] result = skills.Split(charSeparators, System.StringSplitOptions.None);
			if(level>result.Length)
			{
				return 0;
			}
			else
			{
				return _Global.INT32(result[level-1]);
			}
		}

		public int GetStoneData(int id,int stoneid)
		{
			_Item = GetItemById (id);
			string stones = (_Item == null ? "" : _Item.item);
			string values = (_Item == null ? "" : _Item.val);
			char [] charSeparators = new char[]{'*'};
			string[] resultStones = stones.Split(charSeparators, System.StringSplitOptions.None);
			string[] resultValues = values.Split(charSeparators, System.StringSplitOptions.None);
			if(resultStones.Length != resultValues.Length) 
				return 0;

			for( int i=0;i<resultStones.Length;i++)
			{
				if(stoneid == _Global.INT32(resultStones[i]))
				{
					return _Global.INT32(resultValues[i]);
				}
			}
			return 0;
		}

		public bool GetIsPercent(int id)
		{
			_Item = GetItemById (id);
			if (null == _Item)
			{
				return false;
			}
			else
			{
				return _Item.isPercent != 0 ;
			}
		}

		public List<int> GetBaseSkills()
		{
			List<int> retList = new List<int> ();

			Dictionary<string, KBN.DataTable.IDataItem> skillList = GetItemDictionary();
			foreach(string key in skillList.Keys)
			{
				if(_Global.INT32(key) < Constant.Gear.NullSkillID)
				{
					retList.Add(_Global.INT32(key));
				}
			}
			return retList;
		}
	
		public bool SkillTypeIsDebuff(int skillType)
		{
			return skillType == Constant.GearSkillType.ATTACKDEBUFF || skillType == Constant.GearSkillType.LIFEDEBUFF;
		}



	}
}