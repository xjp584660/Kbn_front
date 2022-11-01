using UnityEngine;
using System;
using System.Collections;

using GameMain = KBN.GameMain;
using MenuMgr = KBN.MenuMgr;
using HeroInfo = KBN.HeroInfo;

public class OutpostTabMyTroopsHeroItem : UIObject {

	[SerializeField]
	private SimpleLabel iconFrame;
	[SerializeField]
	private SimpleLabel iconBg;
	[SerializeField]
	private SimpleLabel heroIcon;
	[SerializeField]
	private SimpleLabel infoIcon;
	[SerializeField]
	private SimpleLabel lbLevel;

	[SerializeField]
	private SimpleButton btnInfo;

	private HeroInfo cachedData;

	public override void Init ()
	{
		base.Init ();
		
		infoIcon.mystyle.normal.background = TextureMgr.singleton.LoadTexture("infor_icon", TextureType.DECORATION);

		iconFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("ui_hero_frame", TextureType.DECORATION);

		iconBg.useTile = true;
		iconBg.tile = TextureMgr.singleton.GetHeroSpt().GetTile("ui_herobg_1");

		btnInfo.rect = new Rect(0, 0, rect.width, rect.height);
		btnInfo.OnClick = new Action(OnInfoButtonClick);
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);
		btnInfo.Draw();
		iconFrame.Draw();
		iconBg.Draw();
		heroIcon.Draw();
		infoIcon.Draw();
		lbLevel.Draw();
		GUI.EndGroup();

		return -1;
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);

		cachedData = data as HeroInfo;
		if (null == cachedData)
			return;

		heroIcon.useTile = true;
		heroIcon.tile = TextureMgr.singleton.GetHeroSpt().GetTile(cachedData.Head);

		lbLevel.txt = "Lv. " + cachedData.Level; 
		infoIcon.SetVisible(!cachedData.ISOtherHero);
	}

	private void OnInfoButtonClick()
	{
		if (null != cachedData && !cachedData.ISOtherHero)
			MenuMgr.instance.PushMenu("HeroDetailView", cachedData, "trans_zoomComp");
	}

}
