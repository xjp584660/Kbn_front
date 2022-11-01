using UnityEngine;
using System.Collections;
using System;
using System.Collections.Generic;

public class GearTierLevelUpArmPanel : UIObject
{
	public Label frame;
	public GearScrollViewItem centerArm;
	public FlashLabel title;
	public Label hpPicture;
	public FlashLabel hpDescription;
	public Label attackPicture;
	public FlashLabel attackDescription;
	public Label soliderPicture;
	public FlashLabel soliderDescription;
	public Label backgroundLabel;



	public KBN.AnimationLabel animation;

	public override void Init()
	{
		frame.Init();
		InitArm();
		title.Init();
		hpPicture.Init();
		hpDescription.Init();
		attackPicture.Init();
		attackDescription.Init();
		soliderPicture.Init();
		soliderDescription.Init();
		backgroundLabel.Init();
		centerArm.leftButton.SetVisible(true);

		attackPicture.image = TextureMgr.singleton.LoadTexture("swords", TextureType.BUTTON);
		hpPicture.image = TextureMgr.singleton.LoadTexture("icon_life", TextureType.BUTTON);
		soliderPicture.image = TextureMgr.singleton.LoadTexture("icon_solider", TextureType.ICON);

		frame.useTile = true;
		frame.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_heroframe1");
		backgroundLabel.mystyle.normal.background = TextureMgr.singleton.LoadTexture("map_icon_button_down",TextureType.BUTTON);

		animation.OnAnimationOver = new System.Action(OnAnimationFinish);
		animation.Init("tongyongbaopo000", 6, KBN.AnimationLabel.LABEL_STATE.NONE);

		animation.rect = centerArm.rect;

		centerArm.leftButton.OnClick = new Action<System.Object> (OnLeftButtonClick);
		centerArm.btn.OnClick = new Action<System.Object> (OnLeftButtonClick);
		InitFlash();
	}

	private void InitFlash()
	{
		title.From = 1.0f;
		title.To = 0.0f;
		title.Times = 1;
		title.Screenplay.OnFinish = OnTitleFinish;
		title.alphaEnable = false;

		hpDescription.From = 1.0f;
		hpDescription.To = 0.0f;
		hpDescription.Times = 1;
		hpDescription.Screenplay.OnFinish = OnHDFinish;
		hpDescription.alphaEnable = false;

		attackDescription.From = 1.0f;
		attackDescription.To = 0.0f;
		attackDescription.Times = 1;
		attackDescription.Screenplay.OnFinish = OnAttackFinish;
		attackDescription.alphaEnable = false;

		soliderDescription.From = 1.0f;
		soliderDescription.To = 0.0f;
		soliderDescription.Times = 1;
		soliderDescription.Screenplay.OnFinish = OnTroopFinish;
		soliderDescription.alphaEnable = false;
	}

	private void Flash()
	{
		title.Begin();
		hpDescription.Begin();
		attackDescription.Begin();
		soliderDescription.Begin();
	}

	private void OnTitleFinish()
	{
		if(storeTitle != "")
			title.txt = storeTitle;
		title.alphaEnable = false;
	}

	private void OnHDFinish()
	{
		if(storeHP != "")
			hpDescription.txt = storeHP;
		hpDescription.alphaEnable = false;
	}

	private void OnAttackFinish()
	{
		if(storeAttack != "")
			attackDescription.txt = storeAttack;
		attackDescription.alphaEnable = false;
	}
	private void OnTroopFinish()
	{
		if(storeTroop != "")
			soliderDescription.txt = storeTroop;
		soliderDescription.alphaEnable = false;
	}

	private void OnLeftButtonClick(System.Object p)
	{
		if(TheArm == null) 
			return;

		int[] ids = GearManager.Instance().GetShowSkill(TheArm.Category, TheArm.TierLevel);

		if (null == ids || 0 == ids.Length)
			return;
		
		KBN.MenuMgr.instance.PushMenu("GearTierSkillPopup", new List<int>(ids), "trans_zoomComp");
	}

	private void OnAnimationFinish()
	{

	}

	private void InitArm()
	{
		LocateArm();
	}

	public override void Update()
	{
		frame.Update();
		centerArm.Update();
		title.Update();
		hpPicture.Update();
		hpDescription.Update();
		attackPicture.Update();
		attackDescription.Update();
		soliderPicture.Update();
		soliderDescription.Update();
		backgroundLabel.Update();
		animation.Update();

		//UpdateFontSize();
	}

	private void UpdateFontSize()
	{
		if(title.mystyle.fontSize != 15)
			title.mystyle.fontSize = 15;
		if(hpDescription.mystyle.fontSize != 13)
			hpDescription.mystyle.fontSize = 13;
		if(attackDescription.mystyle.fontSize != 13)
			attackDescription.mystyle.fontSize = 13;
		if(soliderDescription.mystyle.fontSize != 13)
			soliderDescription.mystyle.fontSize = 13;
	}


	public override int Draw()
	{
		GUI.BeginGroup(rect);
		backgroundLabel.Draw();
		frame.Draw();

		centerArm.Draw();
		title.Draw();
		hpPicture.Draw();
		hpDescription.Draw();
		attackPicture.Draw();
		attackDescription.Draw();
		soliderPicture.Draw();
		soliderDescription.Draw();
		animation.Draw();

		GUI.EndGroup();
		return 1;
	}

	private Arm arm;
	public Arm TheArm
	{
		get
		{
			return arm;
		}
		set
		{
			SetUIData(value);
			arm = value;
		}
	}

	public void UpdateFlashArm(Arm arm)
	{
		centerArm.TheArm = arm;
		SetAnimateTitle(arm);
		SetAnimateHP(arm);
		SetAnimateAttack(arm);
		SetAnimateTroop(arm);
	}

	public void StartAnimation()
	{
		animation.Start();
	}

	public void StopAnimation()
	{
		animation.Stop();
	}

	public override void SetUIData (System.Object data)
	{
		Arm arm = data as Arm;
		if(arm == null) return;

		centerArm.TheArm = arm;
		SetTitle(arm);
		SetHP(arm);
		SetAttack(arm);
		SetTroop(arm);
	}

	private void SetTitle(Arm arm)
	{
		if(arm == null) return;
		int tier = arm.TierLevel;
		title.txt = string.Format(KBN.Datas.getArString("Common.Tier"),tier.ToString()) + " " + arm.TierLevel.ToString() ;
	}
	private string storeTitle = "";
	private void SetAnimateTitle(Arm arm)
	{
		if(arm == null) return;
		int tier = arm.TierLevel;

		storeTitle = string.Format(KBN.Datas.getArString("Common.Tier"),tier.ToString()) + " " + arm.TierLevel.ToString() ;
		if(storeTitle == title.txt)
		{
			SetTitle(arm);
		}
		else
		{
			title.alphaEnable = true;
			title.Begin();
		}
	}
	private string storeHP = "";
	private void SetHP(Arm arm)
	{
		if(arm == null) return;
		hpDescription.txt = GearManager.Instance().GetShowData(GearManager.Instance().GetArmLife(arm.GDSID,arm.StarLevel,arm.TierLevel)).ToString();
	}

	private void SetAnimateHP(Arm arm)
	{
		if(arm == null) return;

		storeHP = GearManager.Instance().GetShowData(GearManager.Instance().GetArmLife(arm.GDSID,arm.StarLevel,arm.TierLevel)).ToString();
		if(storeHP == hpDescription.txt)
		{
			SetHP(arm);
		}
		else
		{
			hpDescription.alphaEnable = true;
			hpDescription.Begin();
		}
	}
	private string storeAttack ="";
	private void SetAttack(Arm arm)
	{
		if(arm == null) return;
		attackDescription.txt = GearManager.Instance().GetShowData(GearManager.Instance().GetArmAttack(arm.GDSID,arm.StarLevel,arm.TierLevel)).ToString();
	}

	private void SetAnimateAttack(Arm arm)
	{
		if(arm == null) return;
		storeAttack = GearManager.Instance().GetShowData(GearManager.Instance().GetArmAttack(arm.GDSID,arm.StarLevel,arm.TierLevel)).ToString();

		if(storeAttack == attackDescription.txt)
		{
			SetAttack(arm);
		}
		else
		{
			attackDescription.alphaEnable = true;
			attackDescription.Begin();
		}
	}
	private string storeTroop = "";
	private void SetTroop(Arm arm)
	{
		if(arm == null) return;
		soliderDescription.txt = GearManager.Instance().GetArmTroop(arm.GDSID,arm.StarLevel).ToString();
	}

	private void SetAnimateTroop(Arm arm)
	{
		if(arm == null) return;


		storeTroop = GearManager.Instance().GetArmTroop(arm.GDSID,arm.StarLevel).ToString();
		if(storeTroop == soliderDescription.txt)
		{
			SetTroop(arm);
		}
		else
		{
			soliderDescription.alphaEnable = true;
			soliderDescription.Begin();
		}
	}

	public void LocateArm()
	{
		centerArm.rect = new Rect(20,60,150,150);
		centerArm.btn.rect = new Rect(0,0,150,150);
	}

	public void UpdateInformation()
	{
		SetTitle(TheArm);
		SetHP(TheArm);
		SetAttack(TheArm);
		SetTroop(TheArm);
	}

	public override void SetVisible(bool isVisible)
	{
		frame.SetVisible(isVisible);
		centerArm.SetVisible(isVisible);
		title.SetVisible(isVisible);
		hpPicture.SetVisible(isVisible);
		hpDescription.SetVisible(isVisible);
		attackPicture.SetVisible(isVisible);
		attackDescription.SetVisible(isVisible);

	}

	public void OnSelect()
	{

	}
	public override void OnPopOver()
	{

	}



}
