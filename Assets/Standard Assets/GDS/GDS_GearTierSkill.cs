using UnityEngine;
using System.Collections;
using System;

namespace KBN
{
	public class GDS_TierSkill : GDS_Template<KBN.DataTable.GearTierSkill, GDS_TierSkill>
	{
        public override string FileName
        {
            get
            {
                return "GearTierSkill";
            }
        }

		public override void OKHandler(byte[] data)
		{
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.GearTierSkill> (msgData.data,0,1);
            FreeStrData ();
        }

		protected override void ParseStrData()
		{
			System.DateTime startTime = System.DateTime.Now;
			_Global.Log("$$$$$  Real DataTable m_gdsName: " + (System.DateTime.Now - startTime).TotalMilliseconds);
			m_DT.UpdateItemsFromString<KBN.DataTable.GearTierSkill> (m_strData,0,1);
			_Global.Log("$$$$$  Parse DataTable m_gdsName: " + (System.DateTime.Now - startTime).TotalMilliseconds);
		}
        
        private string GetUpgradeItemID(int partID, int tier)
		{
			KBN.DataTable.GearTierSkill t = this.GetItemById(tier.ToString(),partID.ToString());
			if(t == null) return "";
			return t.levelItem;
		}
		private string GetUpgradeItemNum(int partID,int tier)
		{
			KBN.DataTable.GearTierSkill t = this.GetItemById(tier.ToString(),partID.ToString());
			if(t == null) return "";
			
			return t.levelItemCount;
		}

		private string GetResetItemID(int partID, int tier)
		{
			KBN.DataTable.GearTierSkill t = this.GetItemById(tier.ToString(),partID.ToString());
			if(t == null) return "";

			return t.resetItem;
		}

		private string GetResetItemNum(int partID, int tier)
		{
			KBN.DataTable.GearTierSkill t = this.GetItemById(tier.ToString(),partID.ToString());
			if(t == null) return "";
			return t.resetItemCount;
		}

		private string GetSkill(int partID, int tier)
		{
			KBN.DataTable.GearTierSkill t = this.GetItemById(tier.ToString(),partID.ToString());
			if(t == null) return "";
			return t.skill;
		}

		private string GetSkillInfo(int partID, int tier)
		{
			KBN.DataTable.GearTierSkill t = this.GetItemById(tier.ToString(),partID.ToString());
			if(t == null) return "";
			return t.skillinfo;
        }

		public string[] GetStringData(int partID, int tier,Func<int,int,string> f,char split)
		{
			if(f == null) return null;
			string ids = f(partID,tier);
			string []s = ids.Split(split);
			if(s == null) return null;
            return s;
		}

		public int[] GetIntData(int partID, int tier,Func<int,int,string> f,char split)
		{
			if(f == null) return null;

			string []s = GetStringData(partID,tier,f,split);
			if(s == null) return null;

			int n = s.Length;
			if(n < 1) return null;

            int []i = new int[n];
			for(int j = 0;j<n;j++)
			{
				i[j] = int.Parse(s[j]);
			}
            return i;
		}


		public int[] GetUpgradeItemIDs(int partID, int tier)
		{
			return GetIntData(partID,tier,GetUpgradeItemID,'*');
		}
		public int[] GetUpgradeItemNums(int partID, int tier)
		{
			return GetIntData(partID,tier,GetUpgradeItemNum,'*');
		}
		public int[] GetResetItemIDs(int partID, int tier)
		{
			return GetIntData(partID,tier,GetResetItemID,'*');
		}
		public int[] GetResetItemNums(int partID, int tier)
		{
			return GetIntData(partID,tier,GetResetItemNum,'*');
		}

		public string[] GetSkillIDs(int index, int partID, int tier)
		{
			string [] skills = GetStringData(partID, tier,GetSkill,'*');
			if(skills == null) return null;
			if(index > skills.Length || index < 1) return null;
			string [] skill = skills[index -1].Split(':');
			string [] ids = null;
			for(int i = 0;i< skill.Length;i++)
			{
				string s = skill[i];
				string[] ss = s.Split('_');
				if(ss == null) continue;
				ids[i] = ss[0];
			}
			return ids;
		}



		public int [] GetSkillInfos(int partID, int tier)
		{
			int [] infos = GetIntData(partID,tier,GetSkillInfo,':');
			if(infos == null) return null;
			return infos;
		}
















































	}
}
