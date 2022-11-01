using UnityEngine;
using System.Collections;
using System;
using System.Collections.Generic;

using GameMain = KBN.GameMain;
using Datas = KBN.Datas;
using MenuMgr = KBN.MenuMgr;
using _Global = KBN._Global;
using HeroInfo = KBN.HeroInfo;
using TroopInfo = KBN.BarracksBase.TroopInfo;
using KBN;

public class OutpostAllianceDeploymentPanel : UIObject {

    [SerializeField]
    private SimpleButton btnBack;
	[SerializeField]
	private SimpleLabel lbLowerFrame;

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

	[SerializeField]
	protected SimpleLabel playerIcon;
		[SerializeField]
	protected SimpleLabel playerIconFrame;
	[SerializeField]
	private SimpleLabel playerName;
	[SerializeField]
	private SimpleLabel knightNum;
	[SerializeField]
	private SimpleLabel heroNum;
	[SerializeField]
	private SimpleLabel unitNum;

    public Action OnGoBack { get; set; }
	public override void Init ()
	{
		base.Init ();

		lbLowerFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
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

        btnBack.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_back2_normal", TextureType.BUTTON);
        btnBack.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_back2_down", TextureType.BUTTON);
        btnBack.OnClick = new Action(OnBackButton);
	}

	public void SetUIData (object data, AvaAllianceDeployment deployment)
	{
		//base.SetUIData (data);

		playerIcon.useTile = true;
		playerIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile(GameMain.singleton.GetAvatarTextureName(deployment.avatarId));
		if(deployment.avatarFrame != "img0")
		{
			playerIconFrame.useTile = true;
			playerIconFrame.tile = TextureMgr.instance().ElseIconSpt().GetTile(deployment.avatarFrame);
		}
		else
		{
			playerIconFrame.useTile = false;
		}
		playerName.txt = deployment.displayName;
		knightNum.txt = string.Format(Datas.getArString("Ava.Outpost_KnightNum") ,deployment.knightNum);
		heroNum.txt = string.Format(Datas.getArString("Ava.Outpost_HeroNum") ,deployment.heroNum);
		unitNum.txt = string.Format(Datas.getArString("Ava.Outpost_UnitNum") ,deployment.unitNum);

        knightList.Clear(true);
        heroList.Clear(true);
        troopList.Clear(true);

		HashObject result = data as HashObject;

		HashObject knights = result["knights"];
		int knightsCount = _Global.GetObjectValues(knights).Length;
		List<GeneralInfoVO> knightListTemp = new List<GeneralInfoVO>();
		for( int i = 0; i < knightsCount; i ++ )
		{
			HashObject knight = knights[_Global.ap + i];

			GeneralInfoVO temp = new GeneralInfoVO();
			temp.knightName = _Global.GetString(knight["knightName"]);
			temp.knightId = _Global.INT32(knight["knightId"]);
			temp.knightLevel = _Global.INT32(knight["knightLevel"]);
			temp.cityOrder = _Global.INT32(knight["cityOrder"]);

			// HashObject gearsHO = knight["gears"];
			// string[] troopIds = _Global.GetObjectKeys(gearsHO);
			// List<int> a = GearManager.Instance().GetAllTroopID();
			// for(int k = 0; k < a.Count; ++k)
			// {
			// 	GearTroopItem.GearTroopItemData alltroopData = new GearTroopItem.GearTroopItemData();

			// 	alltroopData.id = a[k];
			// 	alltroopData.attack = 0f;
			// 	alltroopData.life = 0f;
			// 	alltroopData.troop = 0f;
			// 	alltroopData.load = 0f;
			// 	alltroopData.speed = 0f;
			// 	alltroopData.deattack = 0f;
			// 	alltroopData.delife = 0f;

			// 	temp.gearTroopItemDatas.Add(a[k], alltroopData);
			// }
			
			// for(int j = 0; j < troopIds.Length; ++j)
			// {
			// 	HashObject gearHO = gearsHO[troopIds[j]];
			// 	int troopId = _Global.INT32(troopIds[j]);
			// 	double attack = _Global.DOULBE64(gearHO["attack"]) / 10000f;
			// 	double life = _Global.DOULBE64(gearHO["hp"]) / 10000f;
			// 	double troop = _Global.DOULBE64(gearHO["limit"]) / 10000f;
			// 	double load = _Global.DOULBE64(gearHO["load"]) / 10000f;
			// 	double speed = _Global.DOULBE64(gearHO["speed"]) / 10000f;
			// 	double deattack = _Global.DOULBE64(gearHO["dettack"]) / 10000f;
			// 	double delife = _Global.DOULBE64(gearHO["dhp"]) / 10000f;

			// 	if(troopId == 99)
			// 	{
			// 		for(int k = 0; k < a.Count; ++k)
			// 		{
			// 			troopId = a[k];
			// 			if(temp.gearTroopItemDatas.ContainsKey(troopId))
			// 			{
			// 				temp.gearTroopItemDatas[troopId].id = troopId;
			// 				temp.gearTroopItemDatas[troopId].attack += attack;
			// 				temp.gearTroopItemDatas[troopId].life += life;
			// 				temp.gearTroopItemDatas[troopId].troop += troop;
			// 				temp.gearTroopItemDatas[troopId].load += load;
			// 				temp.gearTroopItemDatas[troopId].speed += speed;
			// 				temp.gearTroopItemDatas[troopId].deattack += deattack;
			// 				temp.gearTroopItemDatas[troopId].delife += delife;
			// 			}	
			// 		}
			// 	}
			// 	else
			// 	{
			// 		if(temp.gearTroopItemDatas.ContainsKey(troopId))
			// 		{
			// 			temp.gearTroopItemDatas[troopId].id = troopId;
			// 			temp.gearTroopItemDatas[troopId].attack += attack;
			// 			temp.gearTroopItemDatas[troopId].life += life;
			// 			temp.gearTroopItemDatas[troopId].troop += troop;
			// 			temp.gearTroopItemDatas[troopId].load += load;
			// 			temp.gearTroopItemDatas[troopId].speed += speed;
			// 			temp.gearTroopItemDatas[troopId].deattack += deattack;
			// 			temp.gearTroopItemDatas[troopId].delife += delife;
			// 		}				
			// 	}				
			// }
			temp.isOtherKnight = true;
			knightListTemp.Add(temp);
		}
		var knightDataList = knightListTemp;

		HashObject heros = result["heroes"];
		string[] heroIds = _Global.GetObjectKeys(heros);
		List<HeroInfo> heroListTemp = new List<HeroInfo>();
		for( int i = 0; i < heroIds.Length; i ++ )
		{
			HashObject heroHO = heros[heroIds[i]];

			int heroId = _Global.INT32(heroIds[i]);
			HeroInfo hero = new HeroInfo(heroId, 0);

			hero.Type = _Global.INT32(heroHO["ID"]);

			HashObject levelInfo = heroHO["levelInfo"];
			hero.Level = _Global.INT32(levelInfo["RENOWN_LEVEL"]);
			// hero.Attack = _Global.INT32(levelInfo["ATTACK"]);
			// hero.Health = _Global.INT32(levelInfo["LIFE"]);
			// hero.Load = _Global.INT32(levelInfo["WISE"]);
			// //hero.Renown = _Global.INT32(levelInfo["RENOWN"]);
			// hero.Renown = _Global.INT32(heroHO["renown"]);
			// hero.CalculateLevelAndRenown();
			// hero.Might = _Global.INT32(hero.CalculateMight(hero.Level));
			// hero.Status = KBN.HeroStatus.Assigned;

			// HashObject fateInfo = heroHO["fateInfo"];
			// string[] fateIds = _Global.GetObjectKeys(fateInfo);
			// for(int j = 0; j < fateIds.Length; j++)
			// {
			// 	int fateId = _Global.INT32(fateIds[j]);
			// 	int fateLevel = _Global.INT32(fateInfo[fateIds[j]]["level"]);
			// 	HeroSkill fateSkill = new HeroSkill(fateId, fateLevel);
			// 	if(fateLevel == 0)
			// 	{
			// 		fateSkill.Actived = false;
			// 		fateSkill.Level = 1;
			// 	}
			// 	else
			// 	{
			// 		fateSkill.Actived = true;
			// 	}
				
			// 	fateSkill.RefreshEffectParam();
			// 	fateSkill.FillCondition();
			// 	hero.Fate.Add(fateSkill);
			// }

			// HashObject skillInfo = heroHO["skillInfo"];
			// string[] skillIds = _Global.GetObjectKeys(skillInfo);
			// for(int j = 0; j < skillIds.Length; j++)
			// {
			// 	int skillId = _Global.INT32(skillIds[j]);
			// 	int skillLevel = _Global.INT32(skillInfo[skillIds[j]]["level"]);
			// 	HeroSkill skill = new HeroSkill(skillId, skillLevel);
			// 	skill.Actived = skillLevel == 0 ? false : true;
			// 	skill.RefreshEffectParam();
			// 	hero.Skill.Add(skill);
			// }

			hero.ISOtherHero = true;
			heroListTemp.Add(hero);
		}
		var heroDataList = heroListTemp;

		HashObject units = result["units"];
		int unitsCount = _Global.GetObjectValues(units).Length;
		List<TroopInfo> troopInfoListTemp = new List<TroopInfo>();
		for( int i = 0; i < unitsCount; i ++ )
		{
			HashObject unit = units[_Global.ap + i];

			TroopInfo troop = new TroopInfo();
			troop.typeId = _Global.INT32(unit["unitId"]);
			troop.owned = _Global.INT64(unit["num"]);
			troop.troopTexturePath = "ui_" + troop.typeId;
			// if (troop.typeId >= 50)
			// {
			// 	troop.troopName = Datas.getArString("fortName.f" + troop.typeId);
			// }
			// else
			// {
				troop.troopName = Datas.getArString("unitName.u" + troop.typeId);
			// }

			troopInfoListTemp.Add(troop);
		}
		var troopDataList = troopInfoListTemp;

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
		
		btnBack.Draw();
		lbLowerFrame.Draw();

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
		playerIcon.Draw();
		playerIconFrame.Draw();
		playerName.Draw();
		knightNum.Draw();
		heroNum.Draw();
		unitNum.Draw();

		return -1;
	}


	public override void OnPopOver ()
	{
		base.OnPopOver ();

		knightList.Clear(true);
		heroList.Clear(true);
		troopList.Clear(true);
	}

     private void OnBackButton()
    {
        if (null != OnGoBack) {
            OnPopOver();
            OnGoBack();
        }
    }
}
