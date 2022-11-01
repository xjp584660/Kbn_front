using UnityEngine;
using System.Collections;

using GearData = KBN.GearData;

public class GearTierUpgradePanel : UIObject
{

	public GearTierLevelUpArmPanel armPanel;
	public GearTierLevelUpBottlePanel bottlePanelLeft;
	public GearTierLevelUpBottlePanel bottlePanelRight;
	public GearScrollViewItem centerArm;

	public Label leftBridge;
	public Label rightBridge;

	public override void Init()
	{
		InitCenterArm();

		armPanel.centerArm = centerArm;
		armPanel.Init ();
		bottlePanelLeft.Init();
		bottlePanelRight.Init();
		InitBridge();
	}

	private void InitCenterArm()
	{
		centerArm.star = null;
		centerArm.Init();
	}

	private void InitBridge()
	{
		leftBridge.Init();
		rightBridge.Init();
		leftBridge.useTile = false;
		rightBridge.useTile = false;
		leftBridge.mystyle.normal.background = TextureMgr.instance().LoadTexture("Connection_slots",TextureType.DECORATION);
		rightBridge.mystyle.normal.background = TextureMgr.instance().LoadTexture("Connection_slots",TextureType.DECORATION);
	}

	public override void Update()
	{
		armPanel.Update ();
		bottlePanelLeft.Update();
		bottlePanelRight.Update();
		leftBridge.Update();
		rightBridge.Update();

	}

	public override int Draw()
	{
		if(!visible) return 0;
		GUI.BeginGroup(rect);
		armPanel.Draw ();
		bottlePanelLeft.Draw();
		bottlePanelRight.Draw();
		leftBridge.Draw();
		rightBridge.Draw();
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
			OnArmChanged(arm,value);
			arm = value;
		}
	}

	private void OnArmChanged(Arm o,Arm n)
	{
		if(n == null) return;

		armPanel.TheArm = n;
		armPanel.UpdateInformation();
		UpdatePanelInformation(n);

	}

	public void UpdateFlashArm(Arm arm)
	{
		if(arm == null) return;
		armPanel.UpdateFlashArm(arm);
		UpdatePanelInformation(arm);
	}

	public void UpdatePanelInformation(Arm arm)
	{
		int [] ids = GearManager.Instance().GetTierUpgradeItemIDs(arm.Category,arm.TierLevel);
		int [] nums = GearManager.Instance().GetTierUpgradeItemNums(arm.Category,arm.TierLevel);
		if(ids == null) return;
		if(ids.Length < 1) return;
		if(nums == null) return;
		if(nums.Length < 1) return;
        
		bool reachedMaxLevel = (arm.TierLevel >= GearData.singleton.GachaLevelUpMaxTier);
		
		bottlePanelLeft.SetVisible(!reachedMaxLevel);
		bottlePanelRight.SetVisible(!reachedMaxLevel);
		leftBridge.SetVisible(!reachedMaxLevel);
		rightBridge.SetVisible(!reachedMaxLevel);

		if (reachedMaxLevel) {
			return;
		}
		//armPanel.UpdateInformation();
		
        bottlePanelLeft.ID = ids[0];
		bottlePanelLeft.Count = KBN.MyItems.singleton.GetItemCount(ids[0]);
		bottlePanelLeft.Need = nums[0];
		bottlePanelLeft.Level = arm.TierLevel;


		if(ids.Length > 1 && nums.Length > 1)
		{
			bottlePanelRight.ID = ids[1];
			bottlePanelRight.Count = KBN.MyItems.singleton.GetItemCount(ids[1]);
            bottlePanelRight.Need = nums[1];
			bottlePanelRight.Level = arm.TierLevel;
        }
	}

	public override void SetUIData(System.Object data)
	{
		Arm a = data as Arm;
		if( a == null) return;
		TheArm = a;
	}

	public void OnSelect()
	{
		armPanel.OnSelect();
		bottlePanelLeft.OnSelect();
		bottlePanelRight.OnSelect();
    }

	public override void SetVisible(bool isVisible)
	{
		visible = isVisible;
	}

	public override void OnPopOver()
	{

	}

	public bool IsValid()
	{
		return bottlePanelLeft.IsValid() && bottlePanelRight.IsValid();
	}

}
