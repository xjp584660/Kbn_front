using System;
using System.Collections;
using System.Collections.Generic;

namespace KBN
{
	public class GDS_SeasonLeague : GDS_Template<DataTable.SeasonLeague, GDS_SeasonLeague>
	{
		public override void OKHandler(byte[] data)
		{
			PBMsgGDS.PBMsgGDS msgData = _Global.DeserializePBMsgFromBytes<PBMsgGDS.PBMsgGDS> (data);
			Save (msgData.type, msgData.version, msgData.data, msgData.restart);
			msgData.data=DesDeCode(msgData.data);
			m_DT.UpdateItemsFromString<KBN.DataTable.SeasonLeague> (msgData.data,0);
			FreeStrData ();
		}
		
		protected override void ParseStrData()
		{
			System.DateTime startTime = System.DateTime.Now;
			_Global.Log("$$$$$  Real DataTable m_gdsName: " + (System.DateTime.Now - startTime).TotalMilliseconds);
			m_DT.UpdateItemsFromString<KBN.DataTable.SeasonLeague> (m_strData,0);
			_Global.Log("$$$$$  Parse DataTable m_gdsName: " + (System.DateTime.Now - startTime).TotalMilliseconds);
		}

		public class LeagueReward : IComparable<LeagueReward>
		{
			public int Level { get; private set; }
			public int MaxRank { get; set; }
			public int MinRank { get; private set; }
			public int Buff { get; private set; }
			public string Items { get; private set; }
			public string Special { get; private set; }
			
			public LeagueReward(DataTable.SeasonLeague reward)
			{
				Level = _Global.INT32(reward.LEAGUE_LEVEL);
				MinRank = _Global.INT32(reward.BATTLE_RANK);
				
				Buff = _Global.INT32(reward.TRAINING_BUFF);
				
				Items = reward.REWARD_ITEM;
				Special = reward.LEAGUE_REWARD_BADGE_ITEM;
			}
			
			public int CompareTo (LeagueReward other)
			{
				return Level.CompareTo(other.Level);
			}

		}

		public List<LeagueReward> GetItems()
		{
			List<LeagueReward> ret = new List<LeagueReward>();
			
			var items = m_DT.GetItems();
			foreach(var item in items)
			{
				ret.Add(new LeagueReward(item as DataTable.SeasonLeague));
			}
			
			ret.Sort();

			int lastMinRank = 0;
			for (int i = 0; i < ret.Count; i++) {
				ret[i].MaxRank = lastMinRank + 1;
				lastMinRank = ret[i].MinRank;
			}
			
			return ret;
		}
	}
}