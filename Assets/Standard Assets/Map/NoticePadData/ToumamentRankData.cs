using UnityEngine;
using System.Collections;

public class ToumamentRankData 
{
	public string r_Name;
	public string r_AllianceOfPlayer;
	public long r_AllianceIdOfPlayer;
	public static string r_MyAllianceName;
	public int status;//1-Can Receive Reward 0-Can't receive.
	public long r_Integration;
	public int r_position;
	public HashObject m_bonus;

	public ToumamentRankData()
	{
		r_MyAllianceName = "";
	}
}
