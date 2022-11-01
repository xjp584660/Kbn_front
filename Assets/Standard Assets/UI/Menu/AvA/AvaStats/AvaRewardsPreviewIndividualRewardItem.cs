using UnityEngine;
using System.Collections;

using KBN;

public class AvaRewardsPreviewIndividualRewardItem : UIObject {

	[SerializeField]
	private SimpleLabel lbIcon;
	[SerializeField]
	private SimpleLabel lbTitle;
	[SerializeField]
	private SimpleLabel lbCount;

	
	public override void Init ()
	{
		base.Init ();
	}
	
	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);

		lbIcon.Draw();
		lbTitle.Draw();
		lbCount.Draw();
		
		GUI.EndGroup();
		
		return -1;
	}
	
	public override void SetUIData (object data)
	{
		base.SetUIData (data);

		string[] datas = (data as string).Split(':');

		int itemId = _Global.INT32(datas[0]);
		int count = _Global.INT32(datas[1]);

		lbIcon.useTile = true;
		lbIcon.tile = TextureMgr.singleton.IconSpt().GetTile(Datas.singleton.getImageName(itemId));

		lbTitle.txt = Datas.getArString("itemName.i" + itemId);
		lbCount.txt = "x" + count;
	}

}
