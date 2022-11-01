using UnityEngine;
using System.Collections;

public class AllianceHelpMarchData 
{

	public string marchInfo; // 1 = outbound, 2 = defending, 5=unknown (reserved for frontend), 7=situation-changed, 8= returning, 9= aborting, 0 = inactive
	public int barCurValue;
	public int barMaxValue;
	public string helpBtnString;
	public int m_cityID;
	public int m_marchID;
	public int m_marchType; // 1 = transport, 2 = reinforce, 3 = scout, 4 = attack
	public long marchEndTime;
	public long marchStartTime;

	public AllianceHelpMarchData()
	{
		marchInfo = "";
		barCurValue = 0;
		barMaxValue = 0;
		helpBtnString = "";
	}
}
