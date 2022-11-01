using UnityEngine;
using System.Collections;

using _Global = KBN._Global;
using GameMain = KBN.GameMain;
using TroopInfo = KBN.BarracksBase.TroopInfo;
using AvaTroopInfo = PBMsgAVAMarchList.PBMsgAVAMarchList.Unit;

public class OutpostTroopItem : ListItem {

	[SerializeField]
	private SimpleLabel lbFrame;
	[SerializeField]
	private SimpleLabel lbIcon;
	[SerializeField]
	private SimpleLabel lbTitle;
	[SerializeField]
	private SimpleLabel lbContent;

	private TroopInfo cachedData;
	private int heroId;

	public override void Init ()
	{
		base.Init ();

		lbFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_black", TextureType.DECORATION);
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);
		lbFrame.Draw();
		lbIcon.Draw();
		lbTitle.Draw();
		lbContent.Draw();
		GUI.EndGroup();

		return -1;
	}

	public override void SetRowData (object data)
	{
		base.SetRowData (data);

		SetUIData(data);
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);

		cachedData = data as TroopInfo;

		if (null != cachedData) { // it's troops

			lbIcon.useTile = true;
			lbIcon.tile = TextureMgr.singleton.UnitSpt().GetTile(cachedData.troopTexturePath);

            lbTitle.txt = cachedData.troopName;
			lbContent.txt = cachedData.owned.ToString();

		} else if (data is int) { // it's a hero
			heroId = (int)data;
			var heroData = GameMain.Ava.Units.GetHeroInfo(heroId);
			if (null == heroData) 
				return;

			lbIcon.useTile = true;
			lbIcon.tile = TextureMgr.singleton.UnitSpt().GetTile(heroData.HeadSmall);
			
            lbTitle.txt = heroData.Name;
			lbContent.txt = "Lv." + heroData.Level;
		}
	}

}
