using KBN;
using KBN.DataTable;
using System.Collections.Generic;

public class AvaDonateItem
{

	private AvaDonateItem( int id, int countPerDonate, int apPerDonate, int timeLimit )
	{
		Id = id;
		CountPerDonate = countPerDonate;
		TimeLimit = timeLimit;
		ApPerDonate = apPerDonate;
	}

	public int Id
	{
		get;
		private set;
	}

	public int CountPerDonate
	{
		get;
		private set;
	}

	public int TimeLimit
	{
		get;
		private set;
	}

	public int ApPerDonate
	{
		get;
		private set;
	}

	public static List<AvaDonateItem> DonateItemList()
	{
		List<AvaDonateItem> retList = new List<AvaDonateItem>();

		GDS_AllianceDonate donateGds = GameMain.GdsManager.GetGds<GDS_AllianceDonate>();
		Dictionary<string, IDataItem> dic = donateGds.GetItemDictionary();
		Dictionary<string, IDataItem>.KeyCollection keys = dic.Keys;

		foreach( var key in keys )
		{
			int id;
			if( int.TryParse( key, out id ) )
			{
				AllianceDonate item = donateGds.GetItemById(key);

				int countPerDonate = item.Donation;
				int apPerDonate = item.AP;
				int timeLimit = item.Count_limit;

				retList.Add( new AvaDonateItem( id, countPerDonate, apPerDonate, timeLimit ) );
			}
		}

		return retList;
	}

}
