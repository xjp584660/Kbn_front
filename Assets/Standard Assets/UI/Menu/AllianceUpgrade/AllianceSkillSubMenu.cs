using UnityEngine;
using System;
using KBN;
using System.Collections.Generic;

public class AllianceSkillSubMenu : UIObject
{
	public class DataStruct
	{
		public AvaAllianceSkill skillData;
		public Action backFunc;
		public Action refreshEapFunc;

		public DataStruct(AvaAllianceSkill _skillData, Action _backFunc, Action _refreshEapFunc)
		{
			skillData = _skillData;
			backFunc = _backFunc;
			refreshEapFunc = _refreshEapFunc;
		}
	}

	public enum MENU_TYPE
	{
		SKILL_LEVEL_FULL,
		NO_RIGHT_LEVEL_UP,
		LEVEL_UP,
		IN_AVA
	};

	[SerializeField] private MENU_TYPE menuType = MENU_TYPE.SKILL_LEVEL_FULL;
	
	[SerializeField] private RequireContent requirecon;

	[SerializeField] private SimpleLabel skillIcon;
	[SerializeField] private SimpleLabel blackMask;
	[SerializeField] private SimpleLabel lockMask;
	[SerializeField] private ProgressBarWithBg progressBar;
	[SerializeField] private SimpleLabel lvLabel;
	
	[SerializeField] private SimpleLabel skillTitle;
	[SerializeField] private SimpleLabel skillDesc;

	[SerializeField] private Button backBtn;
	[SerializeField] private Button upgradeBtn;
	[SerializeField] private SimpleLabel needMoney;
	[SerializeField] private SimpleLabel line;

	[SerializeField] private SimpleLabel nextLevel;
	[SerializeField] private SimpleLabel nextLevelBg;
	[SerializeField] private SimpleLabel nextLevelDesc;
	[SerializeField] private SimpleLabel nextLevelDescBg;

	[SerializeField] private float offsetLevelUp;
	[SerializeField] private float offsetNoRight;

	[SerializeField] private SimpleLabel maxLevelDesc;
	[SerializeField] private SimpleLabel noRightDesc;
	[SerializeField] private NormalTipsBar tip;

	[SerializeField] private SimpleLabel notMetTip;

	[SerializeField] private SimpleLabel inAvaDesc;

	private Action refreshEapFunc;

	private DataStruct itemData;

	public override void Init()
	{
		base.Init();
		requirecon.Init();

		progressBar.Init();
		progressBar.thumb.setBackground("payment_Progressbar_Orange",TextureType.DECORATION);	
		progressBar.SetBg("pvpbuilding_hpmeter",TextureType.MAP17D3A_UI);
		blackMask.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("square_blackorg", TextureType.BACKGROUND);
		lockMask.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("icon_lock", TextureType.ICON);
		lvLabel.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("Points_collected", TextureType.MAP17D3A_UI);
		lvLabel.txt = "Lv";
		
		line.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("between line", TextureType.DECORATION);

		backBtn.setNorAndActBG("button_back2_normal","button_back2_down");
		if (KBN._Global.IsLargeResolution ()) 
		{
			backBtn.rect.width = 62;
		} 
		else if (KBN._Global.isIphoneX ()) 
		{
			backBtn.rect.width = 85;
		}
		else
		{
			backBtn.rect.width = 75;
		}
		backBtn.rect.height = 64;

		maxLevelDesc.txt = Datas.getArString ("Alliance.info_allianceskill_buildingleveldesc");
		noRightDesc.txt = Datas.getArString ("Alliance.info_allianceskill_upgradedesc");

		nextLevelBg.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("square_blackorg", TextureType.DECORATION);
		nextLevelDescBg.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("square_blackorg", TextureType.DECORATION);

		notMetTip.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("square_red", TextureType.DECORATION);
		notMetTip.txt = Datas.getArString("OpenAcademy.ReqNotMet");

		inAvaDesc.txt = Datas.getArString("Error.err_4351");

		upgradeBtn.OnClick = new Action(handleUpgrade);

		tip.Init();
		tip.StopTime = 2.0f;
	}

	public override int Draw()
	{
		GUI.BeginGroup(rect);
		backBtn.Draw ();
		skillIcon.Draw ();
//		blackMask.Draw ();
		lockMask.Draw ();
		progressBar.Draw ();
		lvLabel.Draw ();
		
		skillTitle.Draw ();
		skillDesc.Draw ();

		switch(menuType)
		{
		case MENU_TYPE.SKILL_LEVEL_FULL:
			DrawLevelFullMenu();
			break;
		case MENU_TYPE.NO_RIGHT_LEVEL_UP:
			DrawNoRightLevelUpMenu();
			break;
		case MENU_TYPE.LEVEL_UP:
			DrawLevelUpMenu();
			break;
		case MENU_TYPE.IN_AVA:
			DrawInAvaMenu();
			break;
		}
		tip.Draw ();
		GUI.EndGroup();
		return -1;
	}

	private void DrawLevelFullMenu()
	{
		line.Draw ();
		maxLevelDesc.Draw ();
	}

	private void DrawNoRightLevelUpMenu()
	{
		upgradeBtn.Draw ();
		noRightDesc.Draw ();
		nextLevelBg.Draw ();
		nextLevelDescBg.Draw ();
		nextLevel.Draw ();
		nextLevelDesc.Draw ();
		GUI.BeginGroup(new Rect(0, offsetNoRight, rect.width, rect.height));
		requirecon.Draw ();
		GUI.EndGroup();
	}

	private void DrawLevelUpMenu()
	{
		upgradeBtn.Draw ();
		needMoney.Draw ();
		nextLevelBg.Draw ();
		nextLevelDescBg.Draw ();
		nextLevel.Draw ();
		nextLevelDesc.Draw ();
		notMetTip.Draw ();
		GUI.BeginGroup(new Rect(0, offsetLevelUp, rect.width, rect.height));
		requirecon.Draw ();
		GUI.EndGroup();
	}

	private void DrawInAvaMenu()
	{
		nextLevelBg.Draw ();
		nextLevelDescBg.Draw ();
		nextLevel.Draw ();
		nextLevelDesc.Draw ();
		inAvaDesc.Draw ();
		GUI.BeginGroup(new Rect(0, offsetLevelUp, rect.width, rect.height));
		requirecon.Draw ();
		GUI.EndGroup();
	}

	public override void Update()
	{
		requirecon.Update();

		tip.Update();
	}

	public void OnPush(object param)
	{
		itemData = param as DataStruct;
		backBtn.OnClick = itemData.backFunc;
		refreshEapFunc = itemData.refreshEapFunc;

		RefreshMenu ();
		tip.OnLineOutFinish ();

//		GameMain.Ava.Alliance.OnEapChanged += OnEapChanged;
		GameMain.Ava.Alliance.OnLevelChanged += OnLevelChanged;
	}

	private void RefreshMenu()
	{
		GetMenuType ();
		progressBar.SetValue(itemData.skillData.Level, itemData.skillData.MaxLevel);
		skillIcon.useTile = true;
		skillIcon.tile = TextureMgr.instance().IconSpt().GetTile("ava_buff"+itemData.skillData.Id);
		skillTitle.txt = Datas.getArString ("AllianceSkill.Name_s" + itemData.skillData.Id);
		skillDesc.txt = GetSkillDesc (itemData.skillData.Id, itemData.skillData.Value, itemData.skillData.ValueType);
		if(itemData.skillData.Level == 0)
			skillDesc.txt = "";
		lockMask.SetVisible (false);
		if(menuType != MENU_TYPE.SKILL_LEVEL_FULL)
		{
			nextLevel.txt = Datas.getArString ("Alliance.info_allianceskill_nextleveltitle")+" "+(itemData.skillData.Level+1);
			nextLevelDesc.txt = GetSkillDesc (itemData.skillData.Id, itemData.skillData.NextLevelValue, itemData.skillData.NextLevelValueType);
			
			if (!GameMain.Ava.Alliance.SkillToNextLevelRequirementSatisfied (itemData.skillData))
				lockMask.SetVisible (true);
			string redColor = "<color=red>{0}</color>";
			if(GameMain.Ava.Alliance.ExpendablePoint >=itemData.skillData.ToNextLevelCost.Eap)
				redColor = "{0}";
			needMoney.txt = string.Format(redColor, itemData.skillData.ToNextLevelCost.Eap);
			needMoney.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("AP_icon", TextureType.DECORATION);
			
			UpdateButton ();
			UpdateRequirecon ();
		}
	}

	public void OnPopOver()
	{
		base.OnPopOver ();
		requirecon.Clear();
//		GameMain.Ava.Alliance.OnEapChanged -= OnEapChanged;
		GameMain.Ava.Alliance.OnLevelChanged -= OnLevelChanged;
	}

	private void GetMenuType()
	{
		if (itemData.skillData.Level >= itemData.skillData.MaxLevel)
			menuType = MENU_TYPE.SKILL_LEVEL_FULL;
		else if(GameMain.Ava.Event.CanEnterAvaMiniMap())
			menuType = MENU_TYPE.IN_AVA;
		else if(Alliance.singleton.IsHaveRights(AllianceRights.RightsType.UpgradeAllianceSkill))
			menuType = MENU_TYPE.LEVEL_UP;
		else
			menuType = MENU_TYPE.NO_RIGHT_LEVEL_UP;
	}

	private void UpdateButton ()
	{
		if (menuType == MENU_TYPE.SKILL_LEVEL_FULL)
			return;
		upgradeBtn.txt = Datas.getArString("Alliance.info_allianceskill_upgradebtn");
		bool canUse = false;
		if(menuType == MENU_TYPE.LEVEL_UP && 
			GameMain.Ava.Alliance.SkillToNextLevelRequirementSatisfied(itemData.skillData) && 
			GameMain.Ava.Alliance.SkillToNextLevelCostSatisfied(itemData.skillData) &&
			GameMain.Ava.Alliance.ExpendablePoint >=itemData.skillData.ToNextLevelCost.Eap)
			canUse = true;
		if(canUse)
		{
			upgradeBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
			upgradeBtn.SetDisabled(false);
		}
		else
		{
			upgradeBtn.setNorAndActBG("button_60_grey_normalnew","button_60_grey_normalnew");
			upgradeBtn.SetDisabled(true);
		}
	}

	private void UpdateRequirecon ()
	{
		if (menuType == MENU_TYPE.SKILL_LEVEL_FULL)
			return;
		List<Requirement> listRequire = new List<Requirement> ();
		Requirement allianceLevel = new Requirement();
		allianceLevel.type = Datas.getArString ("IngameHelp.Alliance_Subtitle2");
		allianceLevel.required = Datas.getArString ("Common.Lv")+itemData.skillData.ToNextLevelRequirement.AllianceLevel;
		allianceLevel.own = Datas.getArString ("Common.Lv")+GameMain.Ava.Alliance.Level;
		allianceLevel.ok = GameMain.Ava.Alliance.Level>=itemData.skillData.ToNextLevelRequirement.AllianceLevel;
		listRequire.Add (allianceLevel);
		itemData.skillData.ToNextLevelRequirement.Skills.ForEach(i=>{
			Requirement skillRequirement = new Requirement();
			skillRequirement.type = Datas.getArString ("AllianceSkill.Name_s1"+i.Key);
			skillRequirement.required = Datas.getArString ("Common.Lv")+i.Value;
			skillRequirement.own = Datas.getArString ("Common.Lv")+GameMain.Ava.Alliance.GetSkillLevel(i.Key);
			skillRequirement.ok = GameMain.Ava.Alliance.GetSkillLevel(i.Key)>=i.Value;
			listRequire.Add (skillRequirement);
		});
		requirecon.showRequire(listRequire.ToArray(), true);
		notMetTip.SetVisible (!requirecon.req_ok);
	}

	private void handleUpgrade()
	{
		AvaAllianceSkill.OnUpgradeOk OkFunc = delegate () {
			RefreshMenu();
			SetInfoContent(Datas.getArString ("Alliance.allianceskill_permanent_homeskill_upgradenote"));
		};
		AvaAllianceSkill.OnUpgradeError ErrorFunc = delegate(int errorCode, string errorMsg) {
			RefreshMenu();
			ErrorMgr.singleton.PushError("", Datas.getArString ("Error.err_"+errorCode), true, "OK", null);
		};
		if(itemData != null)
		{
			itemData.skillData.Upgrade(Alliance.singleton.myAlliance.allianceId, OkFunc, ErrorFunc);
		}
	}

	private void SetInfoContent(string content)
	{
		tip.setInfoContent(content);
		tip.Show();
	}

	private string GetSkillDesc(int skillId, int value, BuffValueType valueType)
	{
		string strValue = "";
		if(valueType == BuffValueType.Percent)
		{
			strValue = value+"%";
		}
		else if(valueType == BuffValueType.Int)
		{
			strValue  = value+"";
		}
		else if(valueType == BuffValueType.Thethousand)
		{
			strValue = _Global.FLOAT(value) / 100f + "%";
		}
		return string.Format (Datas.getArString ("AllianceSkill.Desc_s" + itemData.skillData.Id + "_0"), strValue);
	}
	
	private void OnEapChanged(long oldEap, long newEap)
	{
		refreshEapFunc();
	}

	private void OnLevelChanged( long oldLevel, long newLevel )
	{
		UpdateRequirecon ();
	}
}
