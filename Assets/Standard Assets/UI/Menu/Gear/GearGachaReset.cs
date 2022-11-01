using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

using GameMain = KBN.GameMain;
using _Global = KBN._Global;
using GearData = KBN.GearData;
using GestureManager = KBN.GestureManager;
using MenuMgr = KBN.MenuMgr;
using Datas = KBN.Datas;

public class GearGachaReset : TabContentUIObject, GestureReceiver, ITouchable
{
	#region ui control
	public SimpleLabel lblDesc;
	public SimpleButton btnInfo;
	public SimpleLabel lblLimit;
	
	public SimpleButton btnPrev;
	public SimpleButton btnNext;

	public GearGachaResetPanel panel;

	public ArmSkillTip skillTip;
	#endregion

	private KnightTransition transition;
	Action<GestureReceiver> ReceiverActivated = null;
	Action<ITouchable> TouchableActivated = null;
	private bool stayOnTop = false;
	private const string TouchableName = "GearGachaReset";

	private static Rect FullScreenRect = new Rect(0, 0, 640, 960);

	public static int LockItemId { get; private set; }

	public override void Init()
	{
		base.Init();

		GearData.singleton.AddArmListener(this);
		GestureManager.singleton.RegistReceiver(this);
		GestureManager.singleton.RegistTouchable(this);

		HashObject seed = GameMain.singleton.getSeed();
		if (null != seed["serverSetting"]) {
			LockItemId = _Global.INT32(seed["serverSetting"]["gearTierSkillLockItem"]);
		}

		// basic controll
		lblDesc.Init();
		lblDesc.txt = Datas.getArString("GearReset.TierResetTips");

		btnInfo.Init();
		btnInfo.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_i", TextureType.DECORATION);
		btnInfo.OnClick = new Action(OnInfoButton);

		lblLimit.Init();
		lblLimit.mystyle.normal.background = TextureMgr.instance().LoadTexture("Orange_AndDown_gradient", TextureType.DECORATION);

		btnPrev.Init();
		btnPrev.mystyle.normal.background = TextureMgr.instance().LoadTexture("gear_button_flip_left_normal", TextureType.BUTTON);
		btnPrev.mystyle.active.background = TextureMgr.instance().LoadTexture("gear_button_flip_left_down", TextureType.BUTTON);
		btnPrev.OnClick = new Action(OnPrevButton);
		btnNext.Init();
		btnNext.mystyle.normal.background = TextureMgr.instance().LoadTexture("gear_button_flip_right_normal", TextureType.BUTTON);
		btnNext.mystyle.active.background = TextureMgr.instance().LoadTexture("gear_button_flip_right_down", TextureType.BUTTON);
		btnNext.OnClick = new Action(OnNextButton);

		panel.Init();
		panel.OnResetSkills = new Action(updateResetTimes);
		panel.IsForbidden = new Func<bool>(() => transition.IsTransiting);
		transition = new KnightTransition();
		transition.OnTransitionFinish = new Action<double>(OnTransitionFinish);
		transition.Init();

		skillTip.Init();
	}

	public override int Draw()
	{
		GUI.BeginGroup(rect);

		lblDesc.Draw();
		btnInfo.Draw();
		lblLimit.Draw();

		panel.Draw();
		transition.Draw();

		if (stayOnTop) {
			if (null != TouchableActivated)
				TouchableActivated(this);
			if (null != ReceiverActivated)
				ReceiverActivated(this);
			stayOnTop = false;
		}
		
		btnPrev.Draw();
		btnNext.Draw();

		GUI.EndGroup();

		skillTip.Draw();

		return 0;
	}

	public override void Update ()
	{
		base.Update ();

		stayOnTop = true;

		transition.Update();
	}

	public override void OnPush(object param)
	{
		GearGachaResetLockDataCache.Clear();
		panel.SetVisible(true);
	}

	private void updateResetTimes()
	{
		lblLimit.txt = String.Format(Datas.getArString("GearReset.ResetTime") + " <color=white>{0}/{1}</color>",
		                             GearManager.Instance().PlayerGachaResetCount,
		                             GearManager.Instance().MaxGachaResetCount);
	}

	public override void OnPop()
	{
		
	}
	
	public override void OnSelect()
	{
		updateResetTimes();

		panel.SetUIData(GearData.singleton.CurrentArm);
	}
	
	public override void OnInActive()
	{
		hideSkillTips();
	}

	public override bool RefuseTabSwitch()
	{
		return panel.WaitForConfirm;
	}

	public bool RefuseBackButton()
	{
		return panel.WaitForConfirm;
	}

	public override void OnClear ()
	{
		base.OnClear ();
	}

	public override void OnPopOver()
	{
		transition.OnPopOver();
		panel.OnPopOver();
		GearData.singleton.RemoveArmListener(this);
		GestureManager.singleton.RemoveTouchable(this);
		GestureManager.singleton.RemoveReceiver(this);
	}

	private void OnInfoButton() {
		InGameHelpSetting setting = new InGameHelpSetting();
		setting.name = Datas.getArString("Common.EquipmentReset_Sub2");
		setting.type = string.Empty;
		setting.key = "GearReset";

		MenuMgr.instance.PushMenu("InGameHelp", setting, "trans_horiz");
	}

	#region gesture interface
	public void OnGesture (GestureManager.GestureEventType type, List<ITouchable> touchables, object t)
	{
		bool gestureOnPanel = false;
		bool skillButtonClicked = false;

		for (int i = 0; i < touchables.Count; i++) {
			string name = touchables[i].GetName();
			switch(name) {
			case TouchableName:
				gestureOnPanel = true;
				if (panel.WaitForConfirm) {
					break;
				}
				switch (type) {
				case GestureManager.GestureEventType.SlidePress:
					BeginTransition();
					break;
				case GestureManager.GestureEventType.SlideMove:
					transition.InputCurrent();
					break;
				case GestureManager.GestureEventType.SlideOver:
					FinishTransition();
					break;
				}
				break;
			case "GearGachaSkillButton":
				if (type == GestureManager.GestureEventType.Clicked) {
					skillButtonClicked = true;
					OnSkillButton(touchables[i] as GearGachaSkillButton);
				}
				break;
			}
		}

		if (gestureOnPanel && !skillButtonClicked) {
			hideSkillTips();
		}
	}

	public void SetReceiverActiveFunction (Action<GestureReceiver> Activated)
	{
		ReceiverActivated = Activated;
	}

	public Rect GetAbsoluteRect ()
	{
		return FullScreenRect;
	}

	public int GetZOrder ()
	{
		return 0;
	}

	public void SetTouchableActiveFunction (Action<ITouchable> Activated)
	{
		TouchableActivated = Activated;
	}

	public string GetName ()
	{
		return TouchableName;
	}

	public bool IsVisible ()
	{
		return visible;
	}
	#endregion

	#region Transition logics
	private void BeginTransition()
	{
		if (!transition.IsTransiting) {
			Arm prev = GearData.singleton.PreviousArm;
			Arm cur = GearData.singleton.CurrentArm;
			Arm next = GearData.singleton.NextArm;
			
			transition.Begin(panel, new object[] {prev, cur, next});
		}
	}

	private void FinishTransition()
	{
		transition.Finish();
	}

	private void FinishTransition(double destination)
	{
		transition.Finish(destination);
	}

	private void OnTransitionFinish(double side)
	{
		if(side == -1)
			GearData.singleton.ShiftPreviousArm();
		if(side == 1)
			GearData.singleton.ShiftNextArm();
	}

	private void OnPrevButton()
	{
		if (null == GearData.singleton.PreviousArm || panel.WaitForConfirm)
			return;
		BeginTransition();
		FinishTransition(-1);
	}

	private void OnNextButton()
	{
		if (null == GearData.singleton.NextArm || panel.WaitForConfirm)
			return;
		BeginTransition();
		FinishTransition(1);
	}

	public void OnCurrentArmChanged(Arm oldArm, Arm newArm)
	{
		panel.SetUIData(GearData.singleton.CurrentArm);
		btnPrev.SetVisible(null != GearData.singleton.PreviousArm);
		btnNext.SetVisible(null != GearData.singleton.NextArm);
	}
	#endregion

	#region SkillTips
	private GearGachaSkillButton highlightedButton = null;
	private void OnSkillButton(GearGachaSkillButton btn) {
		if (0 == btn.SkillID || Constant.Gear.NullSkillID == btn.SkillID || null == btn.TheArm)
			return;

		if (skillTip.IsShow()) {
			hideSkillTips();
		} else {
			ArmSkill skill = new ArmSkill();
			skill.TheArm = btn.TheArm;
			skill.ID = btn.SkillID;

			if (btn.TheArm.ArmSkills[btn.Position].ID == btn.SkillID) {
				skill = btn.TheArm.ArmSkills[btn.Position];
			}

			if (null != highlightedButton)
				highlightedButton.Highlight = false;
			highlightedButton = btn;
			btn.Highlight = true;
			showSkillTips(btn.TheArm, skill);
		}
	}

	private void showSkillTips(Arm arm, ArmSkill skill) {
		skillTip.TheArm = arm;
		skillTip.Skill = skill;
		skillTip.Show();
	}

	private void hideSkillTips() {
		if (null != highlightedButton)
			highlightedButton.Highlight = false;
		highlightedButton = null;

		if (skillTip.IsShow())
			skillTip.Hide();
	}
	#endregion
}
