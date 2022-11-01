using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

using _Global = KBN._Global;
using Datas = KBN.Datas;
using ScrollList = KBN.ScrollList;
using BarracksBase = KBN.BarracksBase;
using OutpostTroopsDeployment = KBN.OutpostTroopsDeployment;

public class OutpostTroopsMarchInfo : UIObject {

	[SerializeField]
	private SimpleButton btnBack;

	[SerializeField]
	private SimpleLabel lbFrame;
	[SerializeField]
	private SimpleLabel lbTarget;
	[SerializeField]
	private SimpleLabel lbKnight;
	[SerializeField]
	private SimpleLabel lbState;
	[SerializeField]
	private SimpleLabel lbType;
	[SerializeField]
	private SimpleLabel lbOwnder;
	[SerializeField]
	private SimpleLabel lbTileType;

	[SerializeField]
	private SimpleLabel lbKnightIcon;

	[SerializeField]
	private SimpleLabel lbSeparator;

	[SerializeField]
	private ScrollList scrollList;

	[SerializeField]
	private OutpostTroopItem listItem;

	public Action OnGoBack { get; set; }

	private OutpostTroopsDeployment.MarchData cachedDeployData;
	private AvaBaseMarch cachedMarchData;

	public override void Init ()
	{
		base.Init ();
		
		btnBack.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_back2_normal", TextureType.BUTTON);
		btnBack.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_back2_down", TextureType.BUTTON);
		btnBack.OnClick = new Action(OnBackButton);

		lbFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_black", TextureType.DECORATION);
		
		lbSeparator.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line", TextureType.DECORATION);

		scrollList.Init(listItem);
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);

		btnBack.Draw();
		
		lbFrame.Draw();
		lbTarget.Draw();
		lbKnight.Draw();
		lbState.Draw();
		lbType.Draw();
		lbOwnder.Draw();
		lbTileType.Draw();
		
		lbKnightIcon.Draw();
		
		lbSeparator.Draw();
		
		scrollList.Draw();

		GUI.EndGroup();

		return -1;
	}

	public override void Update ()
	{
		base.Update ();
		scrollList.Update();
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);

		cachedDeployData = data as OutpostTroopsDeployment.MarchData;
		cachedMarchData = data as AvaBaseMarch;

		if (null != cachedDeployData) {

			lbTarget.SetVisible(false);
			lbState.SetVisible(false);
			lbType.SetVisible(false);
			lbOwnder.SetVisible(false);
			lbTileType.SetVisible(false);

			lbKnight.txt = string.Format("{0}: {1}", Datas.getArString("Common.General"), cachedDeployData.knightShowName);

			lbKnightIcon.useTile = true;
			lbKnightIcon.tile = TextureMgr.singleton.GeneralSpt().GetTile(cachedDeployData.knightTexName);

			List<object> datalist = new List<object>();

			HashObject rawData = cachedDeployData.heroData;

			for (int i = 0; null != rawData["hero" + i]; i++) {
				datalist.Add(_Global.INT32(rawData["hero" + i]));
			}

			for (int i = 0; i < Constant.MAXUNITID; i++) {
				int num = _Global.INT32(rawData["unit" + i + "Return"]);
				if (num > 0) {
					var troop = BarracksBase.baseSingleton.GetTroopInfo(i);
					troop.owned = num;
					datalist.Add(troop);
				}
			}

			scrollList.Clear();
			scrollList.SetData(datalist);
            scrollList.MoveToTop();

		} else if (null != cachedMarchData) {

			
			lbTarget.SetVisible(true);
			lbState.SetVisible(true);
			lbType.SetVisible(true);
			lbOwnder.SetVisible(true);
			lbTileType.SetVisible(true);
			
			lbTarget.txt = cachedMarchData.GetTypeString() + cachedMarchData.GetTileCoordStr();
			lbKnight.txt = string.Format("{0}: {1}", Datas.getArString("Common.General"), cachedMarchData.KnightShowName);
			lbState.txt = string.Format("{0}: {1}", Datas.getArString("Common.Status"), cachedMarchData.GetStatusString(false));
			lbType.txt = string.Format("{0}: {1}", Datas.getArString("Common.Type"), cachedMarchData.GetTypeString());
			lbOwnder.txt = string.Format("{0}: {1}", Datas.getArString("Common.Owner"), cachedMarchData.FromPlayerName);
			lbTileType.txt = string.Format("{0}: {1}", Datas.getArString("Common.TileType"), cachedMarchData.TargetTileType.ToString());
			
			lbKnightIcon.useTile = true;
			lbKnightIcon.tile = TextureMgr.singleton.GeneralSpt().GetTile(
				cachedMarchData.Type == Constant.AvaMarchType.SCOUT ? 
				"timg_6" : 
				cachedMarchData.KnightTextureName);
			
			List<object> datalist = new List<object>();
			foreach (var hero in cachedMarchData.HeroList) {
				datalist.Add(hero.heroId); // user hero id here
			}

			for (int i = 0; i < cachedMarchData.ReturnUnitList.Count; i++) {
				var troop = BarracksBase.baseSingleton.GetTroopInfo(cachedMarchData.ReturnUnitList[i].unitId);
				troop.owned = cachedMarchData.ReturnUnitList[i].count;
				datalist.Add(troop);
			}
			
			scrollList.Clear();
			scrollList.SetData(datalist);
            scrollList.MoveToTop();
		}
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();
		scrollList.Clear();
        scrollList.MoveToTop();
	}

	private void OnBackButton()
	{
		if (null != OnGoBack) {
            OnPopOver();
			OnGoBack();
        }
	}

}
