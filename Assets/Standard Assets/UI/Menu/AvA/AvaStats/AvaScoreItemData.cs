using UnityEngine;
using System.Collections;

public class AvaScoreItemData
{
	public AvaScoreItemData(int _rank, string _name, string _flagName, long _score)
	{
		rank = _rank;
		name = _name;
		flagName = _flagName;
		score = _score;
	}

	public int rank;
	public string name;
	public string flagName;
	public long score;
}
