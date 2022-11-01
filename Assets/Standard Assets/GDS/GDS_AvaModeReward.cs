using System;
using System.Collections;
using System.Collections.Generic;

namespace KBN
{
	public class GDS_AvaModeReward : GDS_Template<DataTable.AvaModeReward, GDS_AvaModeReward> 
	{

		public class AvaModeReward : IComparable<AvaModeReward>
		{
			public int MinScore { get; private set; }
			public int MaxScore { get; private set; }
			public int EAP { get; private set; }
			public string Items { get; private set; }

			public AvaModeReward(DataTable.AvaModeReward reward)
			{
				string[] scores = reward.SCORE.Split('*');
				MinScore = _Global.INT32(scores[0]);
				MaxScore = _Global.INT32(scores[1]);

				EAP = reward.EAP;

				Items = reward.REWARD;
			}

			public int CompareTo (AvaModeReward other)
			{
				return MinScore.CompareTo(other.MinScore);
			}
		}

		public List<AvaModeReward> GetItems()
		{
			List<AvaModeReward> ret = new List<AvaModeReward>();

			var items = m_DT.GetItems();
			foreach(var item in items)
			{
				ret.Add(new AvaModeReward(item as DataTable.AvaModeReward));
			}

			ret.Sort();

			return ret;
		}
	}
}
