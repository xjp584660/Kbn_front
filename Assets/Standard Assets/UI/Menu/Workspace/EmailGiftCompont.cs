using UnityEngine;
using System.Collections;

public class EmailGiftCompont
	: UIObject
{
	//[SerializeField]
	//private KBN.ScrollList m_slItemsIcon;
	[SerializeField]
	private Label m_itemIconTemplate;
	[SerializeField]
	private Label m_rewardClaimedStage;
	[SerializeField]
	private Label m_theRewardsAre;

	public override int Draw()
	{
		GUI.BeginGroup(rect);

		GUI.EndGroup();
		return -1;
	}
}
