using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System;
using LitJson;

namespace KBN
{
	public class GDS_Gear : NewGDS
    {
        public override string FileName                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        {
            get
            {
                return "gear";
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
			LoadingProfiler.Instance.StartTimer("GDS_Gear.cs::OKHandler");
			System.DateTime startTime = System.DateTime.Now;
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
//			long mem1 = System.GC.GetTotalMemory (true);
			m_DT.UpdateItemsFromString<KBN.DataTable.Gear> (msgData.data,0);
//			long mem2 = System.GC.GetTotalMemory (true);
//			_Global.Log("######  DataTable GDS_Gear Memory:" + (mem2 - mem1));
			LoadingProfiler.Instance.EndTimer("GDS_Gear.cs::OKHandler");

			FreeStrData ();
		}
		
		public override void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}
		
		public override void LoadFromLocal(string filename)
		{
			LoadingProfiler.Instance.StartTimer("GDS_Gear.cs::LoadFromLocal");
			System.DateTime startTime = System.DateTime.Now;
			base.LoadFromLocal (filename);
			m_DT.UpdateItemsFromString<KBN.DataTable.Gear> (m_strData,0);
			LoadingProfiler.Instance.EndTimer("GDS_Gear.cs::LoadFromLocal");

			FreeStrData ();
		}
		
		public KBN.DataTable.Gear GetItemById(int id)
		{
			return m_DT.GetItem<KBN.DataTable.Gear> (id.ToString());
		}


        KBN.DataTable.Gear _Item ;
		public int GetRare(int id)
		{

			_Item = GetItemById (id);
			return _Item == null ? 0 : _Item.rare;
		}

		public int GetType(int id)
		{
			_Item = GetItemById (id);
			return _Item == null ? 0 : _Item.type;
		}

		public string GetReq(int id)
		{
			_Item = GetItemById (id);
			return _Item == null ? "" : _Item.req;
		}

		public string GetPic(int id,int tierLevel)
		{
			string[] tier = GetTierPics(id);
			if(tier == null || (tierLevel < 1 || tierLevel > tier.Length))
			{
			//	_Item = GetItemById (id);
			//	return _Item == null ? "" : _Item.pic;
			}
			else
			{
				return tier[tierLevel-1];
			}
			return "";
		}

		public string GetIcon(int id,int tierLevel)
		{
			string [] tier = GetTierSmallPics(id);
			if(tier == null || (tierLevel < 1 || tierLevel > tier.Length))
			{
			//	_Item = GetItemById (id);
			//	return _Item == null ? "" : _Item.smallPic;
			}
			else
			{
				return tier[tierLevel-1];
			}
			return "";
		}

		public int GetColorIndex(int id,int tierLevel)
		{
			int [] tier = GetTierColors(id);
			if(tier == null || (tierLevel < 1 || tierLevel > tier.Length))
			{
			//	_Item = GetItemById (id);
			//	return _Item == null ? 0 : _Item.colorIndex;
			}
			else
			{
				return tier[tierLevel-1];
			}
			return 0;
		}

		public int GetSlotCount(int id, int tierLevel)
		{
			int [] tier = GetTierSlots(id);
			if(tier == null || (tierLevel < 1 || tierLevel > tier.Length))
			{
				//	_Item = GetItemById (id);
				//	return _Item == null ? 0 : _Item.colorIndex;
			}
			else
			{
				return tier[tierLevel-1];
			}
			return 0;
		}

		public int GetExperence(int id,int level)
		{
			_Item = GetItemById (id);
			string exp = (_Item == null ? "" : _Item.lv_exp);
			char [] charSeparators = new char[]{'*'};
			string[] result = exp.Split(charSeparators, System.StringSplitOptions.None);
			if(level>=result.Length)
			{
				return 0;
			}
			else
			{
				return _Global.INT32(result[level]);
			}
		}


		public int GetToExperence(int id,int tierLevel)
		{
			int [] tier = GetTierExps(id);
			if(tier == null || (tierLevel < 1 || tierLevel > tier.Length))
			{
			//	_Item = GetItemById (id);
			//	return _Item == null ? 0 : _Item.defaultToExp;
			}
			else
			{
				_Item = GetItemById (id);
				return tier[tierLevel-1] + _Item.defaultToExp;
			}
			return 0;
		}

		public int GetAttack(int id,int level,int tierLevel)
		{
			int origin = 0;

			_Item = GetItemById (id);
			string attack = (_Item == null ? "" : _Item.lv_attack);
			char [] charSeparators = new char[]{'*'};
			string[] result = attack.Split(charSeparators, System.StringSplitOptions.None);
			if(level>=result.Length)
			{
				origin = 0;
			}
			else
			{
				origin = _Global.INT32(result[level]);
			}

			int [] tier = GetTierAttacks(id);
			if(tier == null) return origin;
			if(tierLevel < 1 || tierLevel > tier.Length) return origin;
			return tier[tierLevel-1] + origin;
		}

		public int GetSpeed(int id,int level)
		{
			_Item = GetItemById (id);
			string speed = (_Item == null ? "" : _Item.lv_speed);
			char [] charSeparators = new char[]{'*'};
			string[] result = speed.Split(charSeparators, System.StringSplitOptions.None);
			if(level>=result.Length)
			{
				return 0;
			}
			else
			{
				return _Global.INT32(result[level]);
			}
		}

		public Dictionary<int,ArmSkill> GetArmSkill(Arm arm){
			_Item = GetItemById (arm.GDSID);
			string speed = (_Item == null ? "" : _Item.skill);
			char [] charSeparators = new char[]{'*'};
			string[] result = speed.Split(charSeparators, System.StringSplitOptions.None);

			Dictionary<int,ArmSkill> mArmSkills=new Dictionary<int,ArmSkill>();
			int count=result.Length;
			int pos=0;
			for(int i=0;i<count;i++){
				if(!string.IsNullOrEmpty(result[i])){
					ArmSkill skill=new ArmSkill();
					skill.SetData(_Global.INT32(result[i]),pos,0);
					skill.TheArm = arm;
					mArmSkills.Add(pos,skill);
					pos++;
				}
			}
			return mArmSkills;
		}

		public int GetLoad(int id,int level)
		{
			_Item = GetItemById (id);
			string load = (_Item == null ? "" : _Item.lv_load);
			char [] charSeparators = new char[]{'*'};
			string[] result = load.Split(charSeparators, System.StringSplitOptions.None);
			if(level>=result.Length)
			{
				return 0;
			}
			else
			{
				return _Global.INT32(result[level]);
			}
		}

		public int GetLvMight(int id,int level)
		{
			int origin = 0;
			
			_Item = GetItemById (id);
			string might = (_Item == null ? "" : _Item.lv_might);
			char [] charSeparators = new char[]{'*'};
			string[] result = might.Split(charSeparators, System.StringSplitOptions.None);
			if(level>=result.Length)
			{
				origin = 0;
			}
			else
			{
				origin = _Global.INT32(result[level]);
			}
			
			return origin;

		}

		public int GetMight(int id,int level,int tierLevel)
		{
			int origin = GetLvMight( id, level );

			int [] tier = GetTierMights(id);
			if(tier == null) return origin;
			if(tierLevel < 1 || tierLevel > tier.Length)return origin;

			return tier[tierLevel-1] + origin;
		}

		public int GetLife(int id,int level,int tierLevel)
		{
			int origin = 0;

			_Item = GetItemById (id);
			string life = (_Item == null ? "" : _Item.lv_hp);
			char [] charSeparators = new char[]{'*'};
			string[] result = life.Split(charSeparators, System.StringSplitOptions.None);
			if(level>=result.Length)
			{
				origin = 0;
			}
			else
			{
				origin = _Global.INT32(result[level]);
			}

			int [] tier = GetTierHPs(id);
			if(tier == null) return origin;
			if(tierLevel < 1 || tierLevel > tier.Length) return origin;
			return tier[tierLevel-1] + origin;
		}

		public int GetTroop(int id,int level)
		{
			_Item = GetItemById (id);
			string troop = (_Item == null ? "" : _Item.lv_limit);
			char [] charSeparators = new char[]{'*'};
			string[] result = troop.Split(charSeparators, System.StringSplitOptions.None);
			if(level>=result.Length)
			{
				return 0;
			}
			else
			{
				return _Global.INT32(result[level]);
			}
		}

		//no use
		
		public int GetDeAttack(int id,int level)
		{
//			return GetInt(id.ToString(),"gearConf","l"+level.ToString(),"da");
			return 0;
		}
		public int GetDeLife(int id,int level)
		{
//			return GetInt(id.ToString(),"gearConf","l"+level.ToString(),"dh");
			return 0;
		}

		public string GetTarget(int id)
		{
			_Item = GetItemById (id);
			return _Item == null ? "" : _Item.baseTarget;
		}
//		
//		public function GetArmHashObject(id:int, level:int):HashObject
//		{
//			return super.m_Data[id.ToString()];
//		}



		private string GetTierPic(int id)
		{
			_Item = this.GetItemById(id);
			if(_Item == null) return "";
			return _Item.tierPic;
		}
		private string GetTierSmallPic(int id)
		{
			_Item = this.GetItemById(id);
			if(_Item == null) return "";
			return _Item.tierSmallPic;
		}

		public string GetTierSlot(int id)
		{
			_Item = this.GetItemById(id);
			if(_Item == null) return "";
			return _Item.tierSlot;
		}

		public string GetArmPic(int id){
			_Item = this.GetItemById(id);
			if(_Item == null) return "";
			return _Item.pic;
		}

		

		
		private string GetTierExp(int id)
		{
			_Item = this.GetItemById(id);
			if(_Item == null) return "";
			return _Item.tierExp;
		}
		


		
		private string GetTierMight(int id)
		{
			_Item = this.GetItemById(id);
			if(_Item == null) return "";
			return _Item.tierMight;
		}

		private string GetTierHP(int id)
		{
			_Item = this.GetItemById(id);
			if(_Item == null) return "";
			return _Item.tierHP;
		}
		

		private string GetTierAttack(int id)
		{
			_Item = this.GetItemById(id);
			if(_Item == null) return "";
			return _Item.tierAttack;
		}
		private string GetTierColor(int id)
		{
			_Item = this.GetItemById(id);
			if(_Item == null) return "";
			return _Item.tierColor;
		}

		public string GetThreesetattribute(int id){
			_Item = this.GetItemById(id);
			if(_Item == null) return "";
			return _Item.threesetattribute;
		}

		public string GetFivesetattribute(int id){
			_Item = this.GetItemById(id);
			if(_Item == null) return "";
			return _Item.fivesetattribute;
		}

		public string GetSetid(int id){
			_Item = this.GetItemById(id);
			if(_Item == null) return "";
			return _Item.setid;
		}

		private string[] GetStringData(int id,Func<int,string> f,char split)
		{
			if(f == null) return null;
			string ids = f(id);
			string []s = ids.Split(split);
			if(s == null) return null;

			return s;
		}
		
		private int[] GetIntData(int id,Func<int,string> f,char split)
		{
			if(f == null) return null;

			// string data=JsonMapper.ToJson(f);
			// _Global.LogWarning("111111" + data.ToString());
			string []s = GetStringData(id,f,split);
			if(s == null) return null;
			
			int n = s.Length;
			if(n < 1) return null;
			
			int []i = new int[n];
	
			for(int j = 0;j<n;j++)
			{
				int val;
				if( int.TryParse( s[j], out val ) ){
					i[j] = val;
				}
				else
				{
					UnityNet.reportErrorToServer("GDS_Gear  GetIntData : ",null,null,s[j].ToString(),false);
				}
			}
			return i;
		}


		public string [] GetTierPics(int id)
		{
			string [] pics = GetStringData(id,GetTierPic,':');
			return pics;
		}

		public string [] GetTierSmallPics(int id)
		{
			string [] smallPics = GetStringData(id,GetTierSmallPic,':');
			return smallPics;
		}

		public int [] GetTierExps(int id)
		{
			int [] exps = GetIntData(id,GetTierExp,':');
			return exps;
		}

		public int [] GetTierMights(int id)
		{
			int [] mights = GetIntData(id,GetTierMight,':');
			return mights;
		}

		public int [] GetTierHPs(int id)
		{
			int [] hps = GetIntData(id,GetTierHP,':');
			return hps;
		}

		public int [] GetTierAttacks(int id)
		{
			int [] attacks = GetIntData(id,GetTierAttack,':');
			return attacks;
		}

		public int [] GetTierColors(int id)
		{
			int [] colors = GetIntData(id,GetTierColor,':');
			return colors;
		}

		public int [] GetTierSlots(int id)
		{
			int [] slots = GetIntData(id, GetTierSlot, ':');
			return slots;
		}












































	}
}