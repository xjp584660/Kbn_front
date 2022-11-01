using UnityEngine;
using System;
using System.Collections;

public class GearGachaSkill : UIObject {

	[SerializeField]
	private SimpleButton btnLock;

	[SerializeField]
	private ArmSkillLabel lblCurSkill;
	[SerializeField]
	private ArmSkillLabel lblNextSkill;
	
	[SerializeField]
	private SimpleLabel lblCurSkillRate;
	[SerializeField]
	private SimpleLabel lblNextSkillRate;

	[SerializeField]
	private GearGachaSkillButton btnCurSkill;
	[SerializeField]
	private GearGachaSkillButton btnNextSkill;
	
	[SerializeField]
	private SimpleLabel lblArrow;
	[SerializeField]
	private SimpleLabel lblUnknown;
	[SerializeField]
	private SimpleButton btnUnknown;

	public delegate bool ToggleLogicDelegate(bool current, Action<bool> asyncResultFunc);
	public ToggleLogicDelegate LockToggleDelegate;

	public Action UnknownButtonDelegate { get; set; }

	private Arm currentGear = null;
	public Arm CurrentGear { 
		get{
			return currentGear;
		}
		set{
			currentGear = value;
			btnCurSkill.TheArm = value;
			btnNextSkill.TheArm = value;
			SetLock(false);
		}
	}

	public int SkillPosition {
		set {
			btnCurSkill.Position = value;
			btnNextSkill.Position = value;
		}
	}

	private Rect originPosNextSkill;
	private Rect originPosNextSkillRate;

	private int curSkillId = 0;
	private int nextSkillId = 0;
	
	public bool HasCurrentSkill {
		get {
			return (0 != curSkillId && Constant.Gear.NullSkillID != curSkillId);
		}
	}

	public bool HasNextSkill {
		get {
			return (0 != nextSkillId && Constant.Gear.NullSkillID != nextSkillId);
		}
	}

	public override void Init ()
	{
		base.Init ();

		btnLock.Init();
		btnLock.mystyle.normal.background = TextureMgr.instance().LoadTexture("Equipment_unlocked", TextureType.BUTTON);
		btnLock.OnClick = new Action(OnLockButton);

		lblCurSkill.Init();
		lblCurSkill.background = TextureMgr.instance().LoadTexture("map_icon_button", TextureType.BUTTON);
		lblNextSkill.Init();

		lblCurSkillRate.Init();
		lblNextSkillRate.Init();

		btnCurSkill.Init();
		btnNextSkill.Init();
		btnCurSkill.rect = lblCurSkill.rect;
		btnNextSkill.rect = lblNextSkill.rect;
		btnCurSkill.RegisterTouchable();

		lblArrow.Init();
		lblArrow.mystyle.normal.background = TextureMgr.instance().LoadTexture("Pointing_arrow", TextureType.DECORATION);
		lblUnknown.Init();
		lblUnknown.mystyle.normal.background = TextureMgr.instance().LoadTexture("Mysterious_property", TextureType.DECORATION);
		btnUnknown.Init();
		btnUnknown.mystyle.normal.background = TextureMgr.instance().LoadTexture("map_icon_button", TextureType.BUTTON);
		btnUnknown.mystyle.active.background = TextureMgr.instance().LoadTexture("map_icon_button_down", TextureType.BUTTON);
		btnUnknown.OnClick = new Action(OnUnknownButton);

		originPosNextSkill = lblNextSkill.rect;
		originPosNextSkillRate = lblNextSkillRate.rect;

		Locked = false;
		NextSkillId = 0;
		CurrentSkillId = 0;
	}

	public override int Draw ()
	{
		if (!visible || !lblCurSkill.isVisible())
			return 0;

		base.Draw ();

		GUI.BeginGroup(rect);

		btnLock.Draw();

		lblArrow.Draw();
		btnUnknown.Draw();
		lblUnknown.Draw();

		btnCurSkill.Draw();
		btnNextSkill.Draw();

		lblCurSkill.Draw();
		lblCurSkillRate.Draw();

		lblNextSkill.Draw();
		lblNextSkillRate.Draw();

		GUI.EndGroup();

		return 0;
	}

	public override void Update ()
	{
		base.Update ();
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();
		btnCurSkill.RemoveTouchable();
	}

	private string getSkillRate(int skillId) {
		return GearManager.Instance().ToPercentString(
				GearManager.Instance().GetSkillPercentage(skillId, CurrentGear.SkillLevel)
			);
	}

	public int CurrentSkillId {
		set {
			curSkillId = value;
			if (!HasCurrentSkill) {
				lblCurSkill.SetVisible(false);
				lblCurSkillRate.SetVisible(false);
				btnCurSkill.SetVisible(false);
				return;
			}
			lblCurSkill.SetVisible(true);
			lblCurSkillRate.SetVisible(true);
			btnCurSkill.SetVisible(true);
			lblCurSkill.SkillID = value;
			lblCurSkillRate.txt = getSkillRate(value);
			btnCurSkill.SkillID = value;
		}
		get {
			return curSkillId;
		}
	}

	public int NextSkillId {
		set {
			nextSkillId = value;
			updateNextSkill();
		}
		get {
			return nextSkillId;
		}
	}

	public void SetNextSkillWithAnim(int skillId, float delay1, float delay2) {
		nextSkillId = skillId;
		updateNextSkill();
		onChangeAnimFinish();
	}

	private void updateNextSkill() {
		if (Locked && HasCurrentSkill) {
			lblNextSkill.SetVisible(true);
			lblNextSkillRate.SetVisible(true);
			btnNextSkill.SetVisible(true);
			lblNextSkill.SkillID = curSkillId;
			lblNextSkillRate.txt = getSkillRate(curSkillId);
			btnNextSkill.SkillID = curSkillId;
		} else {
			lblNextSkill.SetVisible(HasNextSkill);
			lblNextSkillRate.SetVisible(HasNextSkill);
			btnNextSkill.SetVisible(HasNextSkill);
			if (HasNextSkill) {
				lblNextSkill.SkillID = nextSkillId;
				lblNextSkillRate.txt = getSkillRate(nextSkillId);
				btnNextSkill.SkillID = nextSkillId;
			}
		}
	}

	private void doNextSkillAnim(float delay1, float delay2) {

		Animating = true;
		if (Animating || !HasNextSkill)
			return;


	}

	public void ChangeToNextSkill() {
		if (!HasCurrentSkill || !HasNextSkill)
			return;

		CurrentSkillId = NextSkillId;
		NextSkillId = 0;
	}

	private void ChangeToNextSkillWithAnim(float delay) {
		Animating = true;
		if (!HasCurrentSkill || !HasNextSkill)
			return;

		
	}

	private void onChangeAnimFinish() {
		ChangeToNextSkill();
		lblNextSkill.rect = originPosNextSkill;
		lblNextSkillRate.rect = originPosNextSkillRate;
		Animating = false;
	}

	public bool Animating {
		get;
		private set;
	}

	public bool Locked {
		get; 
		private set;
	}

	private void OnUnknownButton() {
		if (null != UnknownButtonDelegate)
			UnknownButtonDelegate();
	}

	private void OnLockButton() {
		if (null != LockToggleDelegate)
			SetLock(LockToggleDelegate(Locked, SetLock));
		else
			SetLock(!Locked);
	}

	public void SetLock(bool v) {
		Locked = v;
		GearGachaResetLockDataCache.SetLock(CurrentGear, CurrentSkillId, v);
		btnLock.mystyle.normal.background = TextureMgr.instance().LoadTexture(Locked ? "Equipment_lock" : "Equipment_unlocked", TextureType.BUTTON);
		updateNextSkill();
	}
}
