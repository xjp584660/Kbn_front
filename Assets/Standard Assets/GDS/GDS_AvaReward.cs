using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

namespace KBN
{

	public class GDS_AvaReward : GDS_Template<DataTable.AvaReward, GDS_AvaReward> 
	{

		public class AvaReward : IComparable<AvaReward>
		{
			public int MinScore { get; private set; }
			public int MaxScore { get; private set; }
			public int EAP { get; private set; }
			public string Items { get; private set; }

			public AvaReward(DataTable.AvaReward reward)
			{
				string[] scores = reward.SCORE.Split('*');
				MinScore = _Global.INT32(scores[0]);
				MaxScore = _Global.INT32(scores[1]);

				EAP = reward.EAP;

				Items = reward.REWARD;
			}

			public int CompareTo (AvaReward other)
			{
				return MinScore.CompareTo(other.MinScore);
			}
		}

		public List<AvaReward> GetItems()
		{
			List<AvaReward> ret = new List<AvaReward>();

			var items = m_DT.GetItems();
			foreach(var item in items)
			{
				ret.Add(new AvaReward(item as DataTable.AvaReward));
			}

			ret.Sort();

			return ret;
		}
	}

}