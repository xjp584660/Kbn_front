using UnityEngine;
using System.Collections;
using System;

using GameMain = KBN.GameMain;
using Datas = KBN.Datas;
using MenuMgr = KBN.MenuMgr;

public class OutpostTabMyTroopsInnerPanel : UIObject {

	[SerializeField]
	private OutpostTabMyTroopsHide hideTroopsPanel;

	[SerializeField]
	private SimpleLabel lbUpperFrame;
	[SerializeField]
	private SimpleLabel lbUpperFrameHeader;
	[SerializeField]
	private SimpleLabel lbLowerFrame;

	[SerializeField]
	private SimpleLabel lbDefenseGeneralTitle;
	[SerializeField]
	private SimpleLabel lbDefenseGeneralIcon;
	[SerializeField]
	private SimpleLabel lbDefenseGeneralName;
	[SerializeField]
	private SimpleLabel lbDefenseGeneralDesc;
	[SerializeField]
	private SimpleButton btnAssign;

	[SerializeField]
	private Label lbKnights;
	[SerializeField]
	private Label lbHeroes;
	[SerializeField]
	private Label lbTroops;
	[SerializeField]
	private SimpleLabel lbKnightAmount;
	[SerializeField]
	private SimpleLabel lbHeroAmount;
	[SerializeField]
	private SimpleLabel lbTroopAmount;
	[SerializeField]
	private UIList knightList;
	[SerializeField]
	private UIList heroList;
	[SerializeField]
	private UIList troopList;
	[SerializeField]
	private SimpleLabel lbTroopTips;

	[SerializeField]
	private OutpostTabMyTroopsKnightItem knightItem;
	[SerializeField]
	private OutpostTabMyTroopsHeroItem heroItem;
	[SerializeField]
	private OutpostTroopItem troopItem;

	public override void Init ()
	{
		base.Init ();

		lbUpperFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
		lbUpperFrameHeader.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
		lbLowerFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);

		lbDefenseGeneralTitle.txt = Datas.getArString("AVA.Outpost_mytroops_defensegeneral");

		btnAssign.EnableBlueButton(true);
		btnAssign.txt = Datas.getArString("Common.Assign");
        btnAssign.OnClick = new Action<object>(OnAssign);

		lbKnights.Init();
		lbKnights.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Brown_Gradients", TextureType.DECORATION);
		lbKnights.txt = Datas.getArString("Common.Generals");

		lbHeroes.Init();
		lbHeroes.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Brown_Gradients", TextureType.DECORATION);
		lbHeroes.txt = Datas.getArString("AVA.Outpost_mytroops_heroes");
		
		lbTroops.Init();
		lbTroops.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Brown_Gradients", TextureType.DECORATION);
        lbTroops.txt = Datas.getArString("AVA.outpost_TroopsInOutpost");

		lbKnightAmount.rect = lbKnights.rect;
		lbHeroAmount.rect = lbHeroes.rect;
		lbTroopAmount.rect = lbTroops.rect;

		knightList.Init();
		heroList.Init();
		troopList.Init();

		hideTroopsPanel.Init();
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);

		hideTroopsPanel.SetUIData(data);
		UpdateDefenseGeneral();

        knightList.Clear(true);
        heroList.Clear(true);
        troopList.Clear(true);

		var knightDataList = GameMain.Ava.Units.GetGeneralList();
		var heroDataList = GameMain.Ava.Units.GetHeroList();
		var troopDataList = GameMain.Ava.Units.TroopList;

        knightDataList.Sort(
            delegate (GeneralInfoVO a, GeneralInfoVO b)
            {
                return b.knightLevel - a.knightLevel;
            }
        );

        heroDataList.Sort(
            delegate (KBN.HeroInfo a, KBN.HeroInfo b)
            {
                return b.Level - a.Level;
            }
        );

		knightList.Clear();
		for (int i = 0; i < knightDataList.Count; i++) {
			OutpostTabMyTroopsKnightItem item = Instantiate(knightItem) as OutpostTabMyTroopsKnightItem;
			item.Init();
			item.SetUIData(knightDataList[i]);
			knightList.AddItem(item);
		}

		heroList.Clear();
		for (int i = 0; i < heroDataList.Count; i++) {
			OutpostTabMyTroopsHeroItem item = Instantiate(heroItem) as OutpostTabMyTroopsHeroItem;
			item.Init();
			item.SetUIData(heroDataList[i]);
			heroList.AddItem(item);
		}

		long troopAmount = 0;

		troopList.Clear();
		for (int i = 0; i < troopDataList.Count; i++) {
			OutpostTroopItem item = Instantiate(troopItem) as OutpostTroopItem;
			item.Init();
			item.SetUIData(troopDataList[i]);
			troopList.AddItem(item);

			troopAmount += troopDataList[i].owned;
		}

		lbKnightAmount.txt = string.Format("{0} {1}", Datas.getArString("AVA.Outpost_mytroops_amount"), knightDataList.Count);
		lbHeroAmount.txt = string.Format("{0} {1}", Datas.getArString("AVA.Outpost_mytroops_amount"), heroDataList.Count);
		lbTroopAmount.txt = string.Format("{0} {1}", Datas.getArString("AVA.Outpost_mytroops_amount"), troopAmount);

		Relayout(knightDataList.Count > 0, heroDataList.Count > 0);
	}

	public override void Update ()
	{
		base.Update ();

		hideTroopsPanel.Update();
	}

    private int GetDefenseGeneral()
    {
        int knightId = 0;
        var generalList = GameMain.Ava.Units.GetGeneralList();
        
        for (int i = 0; i < generalList.Count; i++)
        {
            if (generalList[i].knightStatus == 1)
                knightId = generalList[i].knightId;
        }

        return knightId;
    }

	public void UpdateDefenseGeneral()
	{
        int knightId = GetDefenseGeneral();

		string texName = knightId > 0 ? GameMain.Ava.Units.GetKnightTextureName(knightId) : "li5";
		string showName = knightId > 0 ? GameMain.Ava.Units.GetKnightShowName(knightId) : string.Empty;

		lbDefenseGeneralIcon.useTile = true;
		lbDefenseGeneralIcon.tile = TextureMgr.singleton.GeneralSpt().GetTile(texName);
		
		lbDefenseGeneralName.txt = Datas.getArString(showName);
		lbDefenseGeneralDesc.txt = Datas.getArString("AVA.Outpost_defensegeneral_desc");
		lbDefenseGeneralDesc.rect.y = knightId > 0 ? (lbDefenseGeneralName.rect.y + 30) : lbDefenseGeneralName.rect.y;

		btnAssign.txt = knightId > 0 ? Datas.getArString("Common.Unassign") : Datas.getArString("Common.Assign");
		btnAssign.OnClick =  knightId > 0 ? new Action<object>(OnUnassign) : new Action<object>(OnAssign);

        var curStatus = GameMain.Ava.Event.CurStatus;

		btnAssign.EnableBlueButton(
            (knightId > 0 || GameMain.Ava.Units.KnightList.Count > 0) &&
            (curStatus == AvaEvent.AvaStatus.Prepare ||
             curStatus == AvaEvent.AvaStatus.Match ||
             curStatus == AvaEvent.AvaStatus.Frozen ||
             curStatus == AvaEvent.AvaStatus.Combat ));
	}
	
	private void Relayout(bool hasTroops, bool hasHeroes)
	{
		float startY = lbLowerFrame.rect.y + 10;
		float endY = 0;

		if (!hasTroops) {

			lbTroopTips.txt = Datas.getArString("AVA.Outpost_mytroops_notroopsnote");
			lbTroopTips.rect.y = startY;

			endY = lbTroopTips.rect.yMax;

			//
			lbKnights.SetVisible(false);
			lbKnightAmount.SetVisible(false);
			knightList.SetVisible(false);
			
			lbHeroes.SetVisible(false);
			lbHeroAmount.SetVisible(false);
			heroList.SetVisible(false);
			
			lbTroops.SetVisible(false);
			lbTroopAmount.SetVisible(false);
			troopList.SetVisible(false);
			
			lbTroopTips.SetVisible(true);

		} else {

			lbKnights.rect.y = startY;
			knightList.rect.y = lbKnights.rect.yMax;

			lbHeroes.rect.y = knightList.rect.yMax;
			if (hasHeroes) {
				heroList.rect.y = lbHeroes.rect.yMax;
				endY = heroList.rect.yMax;

				heroList.SetVisible(true);
				lbTroopTips.SetVisible(false);

			} else {
				lbTroopTips.txt = Datas.getArString("AVA.Outpost_mytroops_noherosnote");
				lbTroopTips.rect.y = lbHeroes.rect.yMax;
				endY = lbTroopTips.rect.yMax;

				heroList.SetVisible(false);
				lbTroopTips.SetVisible(true);
			}
			
			lbTroops.rect.y = endY;
			troopList.rect.y = lbTroops.rect.yMax;

			lbKnightAmount.rect = lbKnights.rect;
			lbHeroAmount.rect = lbHeroes.rect;
			lbTroopAmount.rect = lbTroops.rect;

			endY = troopList.rect.yMax;

			lbKnights.SetVisible(true);
			lbKnightAmount.SetVisible(true);
			knightList.SetVisible(true);

			lbHeroes.SetVisible(true);
			lbHeroAmount.SetVisible(true);

			lbTroops.SetVisible(true);
			lbTroopAmount.SetVisible(true);
			troopList.SetVisible(true);
		}

		lbLowerFrame.rect.height = endY - startY + 20;

		rect.height = lbLowerFrame.rect.yMax + 15;
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;
		
		hideTroopsPanel.Draw();

		lbUpperFrame.Draw();
		lbUpperFrameHeader.Draw();
		lbLowerFrame.Draw();
		
		lbDefenseGeneralTitle.Draw();
		lbDefenseGeneralIcon.Draw();
		lbDefenseGeneralName.Draw();
		lbDefenseGeneralDesc.Draw();
		btnAssign.Draw();

		lbKnights.Draw();
		lbKnightAmount.Draw();
		knightList.Draw();
		
		lbHeroes.Draw();
		lbHeroAmount.Draw();
		heroList.Draw();
		
		lbTroops.Draw();
		lbTroopAmount.Draw();
		troopList.Draw();

		lbTroopTips.Draw();

		return -1;
	}


	public override void OnPopOver ()
	{
		base.OnPopOver ();

		hideTroopsPanel.OnPopOver();
		knightList.Clear(true);
		heroList.Clear(true);
		troopList.Clear(true);
	}

    private void OnAssign(object param)
    {
		MenuMgr.instance.PushMenu("AssignGeneralMenu", new Hashtable() {
			{"avaDefenseGeneral", true},
			{"title", Datas.getArString("AVA.Outpost_mytroops_defensegeneral")}
		}, "trans_zoomComp");
    }

	private void OnUnassign(object param)
	{
        int knightId = GetDefenseGeneral();
		if (knightId > 0)
			GameMain.Ava.Units.RequestAvaGeneralUnassign(knightId);
	}
}
