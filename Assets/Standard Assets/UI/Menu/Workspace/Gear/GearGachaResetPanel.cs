using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

using GameMain = KBN.GameMain;
using _Global = KBN._Global;
using Datas = KBN.Datas;
using GearData = KBN.GearData;
using UnityNet = KBN.UnityNet;
using MyItems = KBN.MyItems;
using MenuMgr = KBN.MenuMgr;
using ErrorMgr = KBN.ErrorMgr;

public class GearGachaResetPanel : UIObject 
{
	#region ui control
	public SimpleLabel lblGearBg;
	
	public KnightItemIcon gearIcon;
	public SimpleLabel lblGearName;
	public SimpleLabel lblGearAttack;
	public SimpleLabel lblGearHP;
	public SimpleLabel lblGearTroopLimit;
	public SimpleLabel lblResetItemIcon;
	public SimpleLabel lblResetItem;
	public SimpleLabel lblLockItemIcon;
	public SimpleLabel lblLockItem;
	
	public SimpleButton btnGearInfo;
	public Button btnReset;
	
	public SimpleLabel lblTableHeadBg;
	public SimpleLabel lblTableBg;
	public SimpleLabel lblTableHeadCur;
	public SimpleLabel lblTableHeadNext;
	
	public GearGachaSkill[] curSkills;

	public float heightDelta;
	public float gearBgOriginHeight;
	#endregion

	#region public member
	public Action OnResetSkills { get; set; }
	public Action OnConfirmSkills { get; set; }
	public Func<bool> IsForbidden { get; set; }
	#endregion

	#region local data
	private Arm curGear = null;
	private int resetItemId = 0;
	private long resetItemAmount = 0;
	private int resetItemAmountNeeded = 0;

	private Rect skillsRect;
	#endregion
	
	
	public override void Init()
	{
		base.Init();

		// gear area
		lblGearBg.Init();
		lblGearBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black", TextureType.DECORATION);
		
		gearIcon.Init();
		gearIcon.SetOnClickDelegate(new Action(OnGearInfoButton));
		lblGearName.Init();
		lblGearAttack.Init();
		lblGearAttack.mystyle.normal.background = TextureMgr.instance().LoadTexture("swords", TextureType.BUTTON);
		lblGearHP.Init();
		lblGearHP.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_life", TextureType.BUTTON);
		lblGearTroopLimit.Init();
		lblGearTroopLimit.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_solider", TextureType.ICON);
		lblResetItem.Init();
		lblResetItemIcon.Init();
		lblLockItem.Init();
		lblLockItemIcon.Init();

		lblLockItemIcon.useTile = true;
		lblLockItemIcon.tile = TextureMgr.singleton.IconSpt().GetTile(Datas.singleton.getImageName(GearGachaReset.LockItemId));
		
		btnGearInfo.Init();
		btnGearInfo.mystyle.normal.background = TextureMgr.instance().LoadTexture("Mysterious_property", TextureType.DECORATION);
		btnGearInfo.OnClick = new Action(OnGearInfoButton);
		
		btnReset.Init();
		btnReset.mystyle.normal.background = TextureMgr.instance().LoadTexture("button-cave-Retry", TextureType.BUTTON);
		btnReset.OnClick = new Action(OnResetButton);
		
		// skill area
		lblTableHeadBg.Init();
		lblTableHeadBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black", TextureType.DECORATION);
		lblTableBg.Init();
		lblTableBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black", TextureType.DECORATION);
		
		lblTableHeadCur.Init();
		lblTableHeadCur.txt = Datas.getArString("GearReset.CurrentSkill");
		lblTableHeadNext.Init();
		lblTableHeadNext.txt = Datas.getArString("GearReset.NewSkill");

		if (null != curSkills) {
			for (int i = 0; i < curSkills.Length; i++) {
				curSkills[i].Init();
				curSkills[i].LockToggleDelegate = OnLockToggle;
				curSkills[i].UnknownButtonDelegate = OnGearInfoButton;
			}
		}

		skillsRect = rect;
		skillsRect.x = 0;
		skillsRect.y = 0;
	}
	
	public override void Update()
	{
		
	}
	
	public override int Draw()
	{
		if (!visible)
			return 0;

		GUI.BeginGroup(rect);
		
		lblGearBg.Draw();
		gearIcon.Draw();
		lblGearName.Draw();
		lblGearAttack.Draw();
		lblGearHP.Draw();
		lblGearTroopLimit.Draw();
		lblResetItemIcon.Draw();
		lblResetItem.Draw();
		lblLockItemIcon.Draw();
		lblLockItem.Draw();
		
		btnGearInfo.Draw();
		btnReset.Draw();

		GUI.BeginGroup(skillsRect);

		lblTableBg.Draw();
		lblTableHeadBg.Draw();
		lblTableHeadCur.Draw();
		lblTableHeadNext.Draw();
		
		if (null != curSkills) {
			for (int i = 0; i < curSkills.Length; i++) {
				curSkills[i].Draw();
			}
		}
		GUI.EndGroup();

		GUI.EndGroup();
		return 0;
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();
		if (null != curSkills) {
			for (int i = 0; i < curSkills.Length; i++)
				curSkills[i].OnPopOver();
		}
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);
		
		Arm arm = data as Arm;
		if (null != arm)
			updateGear(arm);
	}

	private void updateGear(Arm gear)
	{
		curGear = gear;
		int[] itemId = GearManager.Instance().GetResetItemIDs(gear.Category, gear.TierLevel);
		int[] itemNeed = GearManager.Instance().GetResetItemNum(gear.Category, gear.TierLevel);
		if (null != itemId && itemId.Length > 0 && null != itemNeed && itemNeed.Length > 0) {
			resetItemId = itemId[0];
			resetItemAmountNeeded = itemNeed[0];
		} else {
			resetItemId = 0;
			resetItemAmountNeeded = 0;
		}

		gearIcon.Data = gear;
		lblGearName.txt = String.Format("{0} ({1} {2})", 
		                                GearManager.Instance().GetArmName(gear), 
		                                Datas.getArString("Common.Tier"), gear.TierLevel);

		lblGearAttack.txt = GearManager.Instance().GetShowData(
			GearManager.Instance().GetArmAttack(gear.GDSID, gear.StarLevel, gear.TierLevel)
			).ToString();

		lblGearHP.txt = GearManager.Instance().GetShowData(
			GearManager.Instance().GetArmLife(gear.GDSID, gear.StarLevel, gear.TierLevel)
			).ToString();

		lblGearTroopLimit.txt = GearManager.Instance().GetArmTroop(gear.GDSID, gear.StarLevel).ToString();

		updateResetItem();

		int slotCount = GearManager.Instance().GetArmSlotCount(gear);
		for (int i = 0; i < curSkills.Length; i++) {
			curSkills[i].CurrentGear = gear;
			curSkills[i].SkillPosition = i;
			curSkills[i].CurrentSkillId = gear.Skills[i].ID; //(i < slotCount) ? gear.Skills[i].ID : 0;
			curSkills[i].NextSkillId = 0;
			curSkills[i].SetLock(GearGachaResetLockDataCache.IsLocked(curGear, gear.Skills[i].ID));
		}

		updateLockItem();
	}

	private void updateResetItem()
	{
		lblResetItem.SetVisible(resetItemId != 0);
		btnReset.SetVisible(resetItemId != 0);
		if (resetItemId != 0) {
			int remainTimes = RemainingFreeChance();
			if (remainTimes > 0) {
				lblResetItemIcon.SetVisible(false);
				lblResetItem.txt = String.Format("{0} {1}", Datas.getArString("GearReset.FreeChance"), remainTimes);
			} else {
				lblResetItemIcon.SetVisible(true);
				resetItemAmount = MyItems.singleton.countForItem(resetItemId);
				lblResetItemIcon.useTile = true;
				lblResetItemIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile(Datas.singleton.getImageName(resetItemId));
				lblResetItem.txt = String.Format("{0} {1}/{2}", Datas.getArString("GearReset.Owned"), resetItemAmountNeeded, resetItemAmount);

				float width = lblResetItem.mystyle.CalcSize(new GUIContent(lblResetItem.txt)).x;
				lblResetItemIcon.rect.x = lblResetItem.rect.xMax - width - lblResetItemIcon.rect.width - 4;
			}
		}
	}

	private void updateLockItem()
	{
		int lockCount = LockedSkillsNum;
		var lockItemSetting = GearManager.Instance().GachaLockItemCount;

		bool showLockItem = (resetItemId != 0 && lockCount > 0 && null != lockItemSetting && lockItemSetting.Length >= lockCount);

		lblLockItem.SetVisible(showLockItem);
		lblLockItemIcon.SetVisible(showLockItem);

		if (showLockItem) {
			long lockItemAmount = MyItems.singleton.countForItem(GearGachaReset.LockItemId);

			lblLockItem.txt = String.Format("{0} {1}/{2}", Datas.getArString("GearReset.Owned"), lockItemSetting[lockCount - 1], lockItemAmount);

			float reset_width = lblResetItem.mystyle.CalcSize(new GUIContent(lblResetItem.txt)).x;
			float lock_width = lblLockItem.mystyle.CalcSize(new GUIContent(lblLockItem.txt)).x;
			float width = Mathf.Max (reset_width, lock_width);

			lblResetItemIcon.rect.x = lblResetItem.rect.xMax - width - lblResetItemIcon.rect.width - 4;
			lblLockItemIcon.rect.x = lblLockItem.rect.xMax - width - lblLockItemIcon.rect.width - 4;
			
			lblLockItem.rect.y = lblResetItem.rect.y + heightDelta;
			lblLockItemIcon.rect.y = lblResetItemIcon.rect.y + heightDelta;

			lblGearBg.rect.height = gearBgOriginHeight + heightDelta;
			skillsRect.y = heightDelta;
		} else {
			lblGearBg.rect.height = gearBgOriginHeight;
			skillsRect.y = 0;
		}
	}

	private bool OnLockToggle(bool current, Action<bool> asyncResultFunc) {
		if (current) {
			asyncResultFunc(false);
			updateLockItem();
			return false;
		}

		int skillCount = 0;
		int lockCount = LockedSkillsNum;
		var lockItemSetting = GearManager.Instance().GachaLockItemCount;
		long lockItemAmount = MyItems.singleton.countForItem(GearGachaReset.LockItemId);

		for (int i = 0; i < curSkills.Length; i++) {
			if (curSkills[i].HasCurrentSkill)
				skillCount ++;
		}
		if (lockCount + 1 >= skillCount) {  // all skill locked
			ErrorMgr.singleton.PushError("",Datas.getArString("GearReset.LockAllSkillError"));
			return false;
		}

		if (null == lockItemSetting || lockItemSetting.Length < lockCount + 1 || lockItemSetting[lockCount] > lockItemAmount) {
			ErrorMgr.singleton.PushError("",Datas.getArString("GearReset.LackLockItem"));
			return false;
		}
		ItemConfirmPopupParam param = new ItemConfirmPopupParam();
		param.description = string.Format(Datas.getArString("GearReset.LockPopupTips"), lockItemSetting[lockCount]);
		param.itemId = GearGachaReset.LockItemId;
		param.OnCancel = null;
		param.OnConfirm = delegate() {
			asyncResultFunc(true);
			updateLockItem();
		};
		MenuMgr.instance.PushMenu("ItemConfirmPopup", param, "trans_zoomComp");
		return false;
	}

	private void OnGearInfoButton() {
		int[] ids = GearManager.Instance().GetShowSkill(curGear.Category, curGear.TierLevel);
		if (null == ids || 0 == ids.Length)
			return;

		MenuMgr.instance.PushMenu("GearTierSkillPopup", new List<int>(ids), "trans_zoomComp");
	}

	private int RemainingFreeChance() {
		return Mathf.Max(0, GearManager.Instance().FreeGachaResetCount - GearManager.Instance().PlayerGachaResetCount);
	}

	private void OnResetButton() {
		// Caution! : IsForbidden must be set, the cloned panels created by Transition will not set this field.
		if (null == curGear || Animating || IsForbidden == null || IsForbidden())
			return;

		// check stones
		for (int i = 0; i < curGear.ArmSkills.Count; i++) {
			if (GearManager.Instance().IsStoneIDLegal(curGear.ArmSkills[i].Stone)) {  // has stones
				ErrorMgr.singleton.PushError("",Datas.getArString("GearReset.RubyEmbedError"));
				return;
			}
		}

		// check times
		if (GearManager.Instance().PlayerGachaResetCount >= GearManager.Instance().MaxGachaResetCount) {
			ErrorMgr.singleton.PushError("",Datas.getArString("GearReset.MaxResetTips"));
			return;
		}

		// check locks
		bool[] skillLockStatus = null;
		int skillCount = 0;
		int lockCount = 0;
		if (null != curSkills) {
			skillLockStatus = new bool[curSkills.Length];
			for (int i = 0; i < skillLockStatus.Length; i++) {
				if (!curSkills[i].HasCurrentSkill)
					continue;

				skillCount ++;
				skillLockStatus[i] = curSkills[i].Locked;
				if (skillLockStatus[i])
					lockCount ++;
			}
		}
		if (lockCount >= skillCount) {  // all skill locked
			ErrorMgr.singleton.PushError("",Datas.getArString("GearReset.LockAllSkillError"));
			return;
		}

		var lockItemSetting = GearManager.Instance().GachaLockItemCount;
		long lockItemAmount = MyItems.singleton.countForItem(GearGachaReset.LockItemId);
		if (lockCount > 0 && (null == lockItemSetting || lockItemSetting.Length < lockCount || lockItemSetting[lockCount - 1] > lockItemAmount)) { // lack of lock item
			ErrorMgr.singleton.PushError("",Datas.getArString("GearReset.LackLockItem"));
			return;
		}
		
		if (resetItemAmount < resetItemAmountNeeded && RemainingFreeChance() <= 0) { // lack of reset item

			InstantUsePopupParam param = new InstantUsePopupParam();
			param.description = Datas.getArString("GearReset.LackResetItem");
			param.itemId = resetItemId;
			param.count = (int)(resetItemAmountNeeded - resetItemAmount);
			param.buttonText = Datas.getArString("Common.BuyAndUse_button");
			param.OnUseItem = delegate () {
				UnityNet.reqGearGachaReset(curGear.PlayerID, resetItemId, resetItemAmountNeeded, skillLockStatus, new Action<HashObject>(OnResetSuccess), null);
			};
			MenuMgr.instance.PushMenu("InstantUsePopup", param, "trans_zoomComp");
			return;
		}
		
		UnityNet.reqGearGachaReset(curGear.PlayerID, resetItemId, resetItemAmountNeeded, skillLockStatus, new Action<HashObject>(OnResetSuccess), null);
	}
	
	private void OnResetSuccess(HashObject result) {
		if (_Global.GetBoolean(result["ok"])) {
			
			if (null != result["resetcount"])
				GearManager.Instance().PlayerGachaResetCount = _Global.INT32(result["resetcount"]);

			if (GearManager.Instance().PlayerGachaResetCount > GearManager.Instance().FreeGachaResetCount) {
				MyItems.singleton.subtractItem(resetItemId, resetItemAmountNeeded);
			}
			MyItems.singleton.subtractItem(GearGachaReset.LockItemId, _Global.INT32(result["lockitemcount"]));
			updateResetItem();

            CheckDailyQuestProgress(result);

			if (_Global.INT32(result["gearid"]) != curGear.PlayerID)
				return;

			HashObject skills = result["skill"];
			HashObject locks = result["lockitem"];
			float delay = 0.0f;
			float delayDelta = 0.1f;
			float delay2 = curSkills.Length * delayDelta + 0.5f;

			for (int i = 0; i < curSkills.Length; i++) {
				int skillId = _Global.INT32(skills[_Global.ap + i]);
				bool locked = (_Global.INT32(locks[_Global.ap + i]) != 0);
				if (curSkills[i].HasCurrentSkill) {
					if (!locked && 0 != skillId && Constant.Gear.NullSkillID != skillId) {
						curGear.ArmSkills[i].ID = skillId;
						curSkills[i].SetNextSkillWithAnim(skillId, delay, delay2);
						delay += delayDelta;
						delay2 += delayDelta;
					}
				}
			}

			updateLockItem();

			if (null != OnResetSkills)
				OnResetSkills();
		}
	}

    private void CheckDailyQuestProgress(HashObject ho)
    {
        if (ho == null)
        {
            return;
        }

        HashObject gearTypeNode = ho["geartype"];
        if (gearTypeNode == null)
        {
            return;
        }

        int gearTypeId = _Global.INT32(gearTypeNode);
        DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.ResetGear, gearTypeId);
    }

	private bool Animating {
		get {
			for (int i = 0; i < curSkills.Length; i++) {
				if (curSkills[i].HasCurrentSkill && curSkills[i].Animating)
					return true;
			}
			return false;
		}
	}

	public bool WaitForConfirm {
		get {
			return Animating;
		}
	}

	private int LockedSkillsNum {
		get {
			int lockCount = 0;
			for (int i = 0; i < curSkills.Length; i++) {
				if (curSkills[i].HasCurrentSkill && curSkills[i].Locked)
					lockCount ++;
			}
			return lockCount;
		}
	}
}
