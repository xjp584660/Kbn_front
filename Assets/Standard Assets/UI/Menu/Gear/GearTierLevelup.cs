using UnityEngine;
using System.Collections;
using KBN;
using System.Collections.Generic;
using System;

public class GearTierLevelup : TabContentUIObject,GestureReceiver, ITouchable
{
	[SerializeField]
	private SimpleLabel backGroundImage;
	[SerializeField]
	private Button backwardButton;
	[SerializeField]
	private Button forwardButton;

	[SerializeField]
	private Button levelUpBtn;

	[SerializeField]
	private SimpleLabel description;
	public Button helpButton;
	public GearTierUpgradePanel panel;

	public SimpleLabel levelUpDescription;
	public SimpleLabel middleDescription;

	public override void Init()
	{
		InitBackground();
		InitButton();
		InitDescription();

		InitTransition();
		InitGesture();
		InitHelpButton();
		InitPanel();
		InitAbsolut();
		InitFloat();

		RegistData();
	}

	private void InitBackground()
	{
		var gearSpt = TextureMgr.singleton.GetGearSpt();
		backGroundImage.tile = gearSpt.GetTile("Forging_disc_bg");
		backGroundImage.useTile = true;
	}

	private void InitButton()
	{
		backwardButton.mystyle.normal.background = TextureMgr.singleton.LoadTexture("gear_button_flip_left_normal", TextureType.BUTTON);
		forwardButton.mystyle.normal.background = TextureMgr.singleton.LoadTexture("gear_button_flip_left_normal", TextureType.BUTTON);
		backwardButton.mystyle.active.background = TextureMgr.singleton.LoadTexture("gear_button_flip_left_down", TextureType.BUTTON);
		forwardButton.mystyle.active.background = TextureMgr.singleton.LoadTexture("gear_button_flip_left_down", TextureType.BUTTON);
		levelUpBtn.changeToBlueNew();
		levelUpBtn.txt = KBN.Datas.getArString("Common.LevelUp_title");
		levelUpBtn.OnClick = new System.Action(OnLevelUpClick);
		backwardButton.OnClick = new System.Action(OnBackwardClick);
		forwardButton.OnClick = new System.Action(OnForwardClick);
	}

	private void InitDescription()
	{
		description.txt = KBN.Datas.getArString("GearReset.TierTips");
		levelUpDescription.txt = KBN.Datas.getArString("GearReset.MaxTierTips");
		middleDescription.txt = KBN.Datas.getArString("GearReset.TierGearTips");
	}

	public void InitPanel()
	{
		panel.Init();

	}

	public void OnCurrentArmChanged(Arm o, Arm n)
	{
		TransitionOnArmChanged();
		//UpdateLevelUpButton();
		CheckTierLevel(n.TierLevel);
	}

	public void OnExperenceChanged(int o,int n)
	{

	}

	private void InitGesture()
	{
		KBN.GestureManager.singleton.RegistReceiver(this);
		KBN.GestureManager.singleton.RegistTouchable(this);
	}
	private void InitHelpButton()
	{
		helpButton.Init();
		helpButton.OnClick = new System.Action(OnHelpButtonClick);
	}
	private void RegistData()
	{
		GearData.singleton.AddArmListener(this);
	}

	public override void OnPush(object par)
	{
		panel.SetVisible(true);
	}
	
	public override void Update()
	{
		UpdateTransition();
		UpdateHelpButton();
		UpdatePanel();
		UpdateFloat();
	}


	private void UpdateGearItem()
	{
		var arm = GearData.singleton.CurrentArm;
		if(arm == null) return;
		panel.TheArm = GearData.singleton.CurrentArm;
		UpdateLevelUpButton();
	}
	private void UpdateHelpButton()
	{
		helpButton.Update();
	}

	private void UpdatePanel()
	{
		panel.Update();
	}
	private void UpdateLevelUpButton()
	{
		levelUpBtn.EnableBlueButton(panel.IsValid());
	}

	public override int Draw()
	{
		GUI.BeginGroup(rect);
		DrawBackground();

		DrawDescription();
		DrawInformationLabel();

		DrawTransition();
		DrawPanel();

		DrawButtons();

		DrawInterface();
		DrawFloat();

		GUI.EndGroup();
		DrawHelpButton();
		return 0;
	}
	private void DrawHelpButton()
	{
		helpButton.Draw();
	}
	private void DrawBackground()
	{
		backGroundImage.Draw();
	}

	private void DrawButtons()
	{
		backwardButton.Draw();
		forwardButton.Draw();
		levelUpBtn.Draw();
    }
	private void DrawDescription()
	{
		description.Draw();
		levelUpDescription.Draw();
		middleDescription.Draw ();
	}

	private void DrawInformationLabel()
	{
	//	attackLabel.Draw();
	//	lifeLabel.Draw();
	//	solider.Draw();
	}

	private void DrawPanel()
	{
		panel.Draw ();
	}
	private void RemoveGesture()
	{
		KBN.GestureManager.singleton.RemoveReceiver(this);
		KBN.GestureManager.singleton.RemoveTouchable(this);
        
    }

	public override void OnPopOver()
	{
		RemoveGesture();
		panel.OnPopOver();
	}

	public void OnGesture(KBN.GestureManager.GestureEventType type,List<ITouchable> touchables, object t)
	{
		if(MenuMgr.instance.Top() == null) return;
		if(MenuMgr.instance.Top().menuName != "ArmMenu") return;
        
		foreach(ITouchable touchable in touchables)
		{
			OnWindow(type,touchable);
		}
    }

	private void OnWindow(KBN.GestureManager.GestureEventType type,ITouchable touchable)
	{
		if(touchable != this) return;
		
		switch(type)
		{
		case GestureManager.GestureEventType.SlidePress:
			Begin ();
			break;
		case GestureManager.GestureEventType.SlideMove:
			InputCurrent();
			break;
		case GestureManager.GestureEventType.SlideOver:
			Finish();
			break;
		}
	
	
	}


	//==================================================================================================
	private Action<ITouchable> activated;
	private Action<GestureReceiver> receiverActivated;
	private Rect absolut;

	private void InitAbsolut()
	{
		absolut = new Rect(0,0,640,960);
	}

	public void SetReceiverActiveFunction(System.Action<GestureReceiver> Activated)
	{
		receiverActivated = Activated;
	}

	public Rect GetAbsoluteRect()
	{
		return absolut;
	}
	public int GetZOrder()
	{
		return 0;
	}
	public void SetTouchableActiveFunction(Action<ITouchable> Activated)
	{
		activated = Activated;
	}
	public string GetName()
	{
		return "GearTierLevelup";
	}
	public bool IsVisible()
	{
		return true;
	}

	private void DrawInterface()
	{
		if(activated != null)
			activated(this);
		if(receiverActivated != null) 
			receiverActivated(this);
	}
	//==================================================================================================
	public FloatingLabel floatMight;
	//floating label might
	private void InitFloat()
	{
		floatMight.Init();
		floatMight.mystyle.normal.textColor = new Color(14.0f/255.0f,227.0f/255.0f,16.0f/255.0f,1.0f);
		floatMight.BackRect = new Rect(panel.armPanel.rect.x,panel.armPanel.rect.y + panel.armPanel.rect.height / 2,panel.armPanel.rect.width,20); 

	}
	private void UpdateFloat()
	{
		floatMight.Update();
	}

	private void DrawFloat()
	{
		floatMight.Draw();
	}


	//==================================================================================================
	private KnightTransition transition;


	private void InitTransition()
	{
		transition = new KnightTransition();
		transition.OnTransitionFinish = OnTransitionFinish;
		transition.Init();
	}
	private void UpdateTransition()
	{
		transition.Update();
	}
	private void DrawTransition()
	{
		transition.Draw();
	}
	private void Begin()
	{

		if(transition.IsTransiting ) return;
		Arm pre = GearData.singleton.PreviousArm;
		Arm next = GearData.singleton.NextArm;
		Arm current = GearData.singleton.CurrentArm;

		transition.Begin(panel,new object[]{pre,current,next});

	}
	
	private void InputCurrent()
	{

		transition.InputCurrent();
	}

	private void Finish()
	{

		transition.Finish();
	}
	private void Finish(double destination)
	{

		transition.Finish(destination);
	}
	
	private void OnLevelUpClick()
	{
		Arm arm = GearData.singleton.CurrentArm;
		if(arm == null) return;
		UnityNet.GearTierLevelUp(arm.PlayerID,panel.bottlePanelLeft.ID.ToString(),
		                         panel.bottlePanelLeft.Need.ToString(),
		                         panel.bottlePanelRight.ID.ToString(),
		                         panel.bottlePanelRight.Need.ToString(),
		                         LevelUpOK,null);
	}

	private void LevelUpOK(HashObject hash)
	{
		if(hash == null) return;
		if(hash["currentLevel"] == null) return;
		if(hash["gearid"] == null) return;
		
		int tier = _Global.INT32(hash["currentLevel"]);
		int id = _Global.INT32(hash["gearid"]);
		CheckTierLevel(tier);
		
		Arm arm = GearManager.Instance().GearWeaponry.GetArm(id);
		if(arm == null) return;
		if(GearData.singleton.CurrentArm.PlayerID != arm.PlayerID) return;
		arm.TierLevel = tier;
		
		
		
		if(hash["requireitem1"] != null && hash["requirecount1"] != null)
		{
			int id1 = _Global.INT32(hash["requireitem1"]);
			int num1 = _Global.INT32(hash["requirecount1"]);
			MyItems.singleton.subtractItem(id1,num1);
		}
		if(hash["requireitem2"] != null && hash["requirecount2"] != null)
		{
			int id2 = _Global.INT32(hash["requireitem2"]);
			int num2 = _Global.INT32(hash["requirecount2"]);
			MyItems.singleton.subtractItem(id2,num2);
		}
		arm.ToExperence = GearManager.Instance().GetArmToExperence(arm.GDSID,tier);
		floatMight.txt = string.Format(KBN.Datas.getArString("Gear.EquipmentMightPlus"), GearManager.Instance().GetArmMight(arm.GDSID, arm.StarLevel ,arm.TierLevel));
		floatMight.Begin();
		
		int might = GearManager.Instance().GetArmMight(arm.GDSID,arm.StarLevel,arm.TierLevel);
		might += (int)KBNPlayer.instance.getMight();
		KBNPlayer.instance.setMight(might);	
		ParseSkill(arm,hash);
		panel.UpdateFlashArm(arm);
		panel.armPanel.StartAnimation();
		
	}
	
	private void ParseSkill(Arm arm,HashObject hash)
	{
		int [] stones = null;
		int i = 0;
		int n = 0;
		if(arm != null && arm.Skills != null)
		{
			n = arm.Skills.Count;
			stones = new int[n];
			for(i=0;i<n;i++)
				stones[i] = arm.Skills[i].Stone;
		}
		if(hash["s"] != null)
			arm.Parse(hash);
		
		
		for(i=0;i<n;i++)
		{
			arm.Skills[i].Stone = stones[i];
		}
		
	}


	private void OnBackwardClick()
	{
		if(GearData.singleton.PreviousArm == null) return;
		Begin();
		Finish(-1.0f);
	}
	
	private void OnForwardClick()
	{
		if(GearData.singleton.NextArm == null) return;
		Begin();
		Finish(1.0f);
	}

	private void TransitionOnArmChanged()
	{
		if( GearData.singleton.NextArm == null)
			forwardButton.alpha = 0.2f;
		else
			forwardButton.alpha = 1.0f;
		
		if( GearData.singleton.PreviousArm == null)
			backwardButton.alpha = 0.2f;
		else
			backwardButton.alpha = 1.0f;
	}
	
	private void OnTransitionFinish(double side)
	{
		if(side == -1f) GearData.singleton.ShiftPreviousArm();
		if(side == 1f) GearData.singleton.ShiftNextArm();	

		panel.TheArm = GearData.singleton.CurrentArm;
		UpdateLevelUpButton();
	}
	//==================================================================================================
	private void CheckTierLevel(int tier)
	{
		if(tier >= GearData.singleton.GachaLevelUpMaxTier)
		{
			levelUpBtn.SetVisible(false);
			levelUpDescription.SetVisible(true);
        }
		else
		{
			levelUpBtn.SetVisible(true);
			levelUpDescription.SetVisible(false);
		}

	}

	//==================================================================================================
	public override void OnSelect()
	{
		UpdateGearItem();
		panel.OnSelect();
    }
    private void OnHelpButtonClick()
	{
		MenuAccessor.OpenInGameHelpFromTierLevelUp();
	}

    
}
