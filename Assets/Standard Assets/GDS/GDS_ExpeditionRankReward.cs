using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;


/*迷雾远征 排行榜奖励GDS表*/
namespace KBN
{

	public class GDS_ExpeditionRankReward : GDS_Template<DataTable.ExpeditionRankReward, GDS_ExpeditionRankReward>
	{
		public class ExpeditionRankReward : IComparable<ExpeditionRankReward>
		{
			public int MinScore { get; private set; }
			public int MaxScore { get; private set; }
			public string Items { get; private set; }

			public ExpeditionRankReward(DataTable.ExpeditionRankReward reward)
			{
				string[] scores = reward.SCORE.Split('*');
				if (scores[0] == "INT" || scores[1] == "INT") { return; }
				MinScore = _Global.INT32(scores[0]);
				MaxScore = _Global.INT32(scores[1]);


				Items = reward.REWARD;
			}

			public int CompareTo(ExpeditionRankReward other)
			{
				return MinScore.CompareTo(other.MinScore);
			}
		}

		public List<ExpeditionRankReward> GetItems()
		{
			List<ExpeditionRankReward> ret = new List<ExpeditionRankReward>();

			var items = m_DT.GetItems();
			foreach (var item in items)
			{
				ExpeditionRankReward expedition = new ExpeditionRankReward(item as DataTable.ExpeditionRankReward);
				if (expedition.Items != null) {
					ret.Add(expedition);
				}
			}

			ret.Sort();

			return ret;
		}

	}
}
