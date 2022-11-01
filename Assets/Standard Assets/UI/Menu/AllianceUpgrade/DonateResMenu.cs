using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;
using System;

public class DonateResMenu : PopMenu 
{
	[SerializeField] private SimpleLabel line;
	[SerializeField] private ScrollList itemList;
	[SerializeField] private ListItem donateResItem;
	[SerializeField] private SimpleLabel allianceApTxt;
	[SerializeField] private SimpleLabel allianceApDesc;
	[SerializeField] private SimpleLabel personalApTxt;
	[SerializeField] private SimpleLabel personalApDesc;
	[SerializeField] private Button donateBtn;
	
	private AvaDonateResource donateResData;
	private bool isUpdateList;
	public override void Init()
	{
		base.Init();
		title.txt = Datas.getArString("Alliance.info_dummy_alliancedonationtitle");
		line.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("between line", TextureType.DECORATION);
		allianceApTxt.txt = "0";
		allianceApTxt.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("AP_icon", TextureType.DECORATION);
		allianceApDesc.txt = Datas.getArString("Alliance.info_dummy_alliancedonation_alliancepointsgained");
		personalApTxt.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("HP_icon", TextureType.DECORATION);
		personalApTxt.txt = "0";
		personalApDesc.txt = Datas.getArString("Alliance.info_dummy_alliancedonation_honorpointsgained");
		donateBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
		donateBtn.OnClick = new System.Action(handleClick);
		donateBtn.txt = Datas.getArString("Alliance.info_dummy_alliancedonation_donatebtn");
		itemList.Init(donateResItem);
	}
	
	protected override void DrawItem()
	{
		line.Draw();
		itemList.Draw();
		allianceApTxt.Draw();
		allianceApDesc.Draw();
		personalApTxt.Draw();
		personalApDesc.Draw();
		donateBtn.Draw();
	}
	
	public override void Update() 
	{
		if(isUpdateList)
			itemList.Update ();
	}
	
	public override void OnPush(object param)
	{
		isUpdateList = true;
		RefreshMenu ();
	}

	private void RefreshMenu()
	{
		donateResData = new AvaDonateResource ();
		itemList.Clear ();
		itemList.MoveToTop ();
		itemList.SetData(FillData());
		itemList.UpdateData();
		itemList.ResetPos();
		UpdateButton ();
		allianceApTxt.txt = "0";
		personalApTxt.txt = "0";
	}
	
	public override void OnPop()
	{
		base.OnPop();
	}
	
	public override void OnPopOver()
	{
		base.OnPopOver ();
		itemList.Clear();
	}
	
	private IEnumerable FillData()
	{
		int curCityId = GameMain.singleton.getCurCityId();
		List<DonateResItem.DataStruct> testHash= new List<DonateResItem.DataStruct>();
		testHash.Add (new DonateResItem.DataStruct(
			Constant.ResourceType.GOLD,
			GameMain.Ava.Player.MaxDonateGold(),
			AvaDonateResource.DonateUnit(Constant.ResourceType.GOLD),
			OnItemValueChange,
			onSliderDrag
		));
		testHash.Add (new DonateResItem.DataStruct(
			Constant.ResourceType.FOOD,
			GameMain.Ava.Player.MaxDonateFood(),
			AvaDonateResource.DonateUnit(Constant.ResourceType.FOOD),
			OnItemValueChange,
			onSliderDrag
		));
		testHash.Add (new DonateResItem.DataStruct(
			Constant.ResourceType.LUMBER,
			GameMain.Ava.Player.MaxDonateWood(),
			AvaDonateResource.DonateUnit(Constant.ResourceType.LUMBER),
			OnItemValueChange,
			onSliderDrag
		));
		testHash.Add (new DonateResItem.DataStruct(
			Constant.ResourceType.STONE,
			GameMain.Ava.Player.MaxDonateStone(),
			AvaDonateResource.DonateUnit(Constant.ResourceType.STONE),
			OnItemValueChange,
			onSliderDrag
		));
		testHash.Add (new DonateResItem.DataStruct(
			Constant.ResourceType.IRON,
			GameMain.Ava.Player.MaxDonateOre(),
			AvaDonateResource.DonateUnit(Constant.ResourceType.IRON),
			OnItemValueChange,
			onSliderDrag
		));
	
		return testHash.ToArray();
	}

	private void OnItemValueChange(int resType, long v)
	{
		switch (resType) {
		case Constant.ResourceType.GOLD:
			donateResData.Glod = v;
			break;
		case Constant.ResourceType.FOOD:
			donateResData.Food = v;
			break;
		case Constant.ResourceType.LUMBER:
			donateResData.Wood = v;
			break;
		case Constant.ResourceType.STONE:
			donateResData.Stone = v;
			break;
		case Constant.ResourceType.IRON:
			donateResData.Ore = v;
			break;
		}
 
		allianceApTxt.txt = donateResData.ToAp()+"";
		personalApTxt.txt = donateResData.ToAp()+"";
		UpdateButton ();
	}

	private void handleClick()
	{
		if (!CanDonate()) 
		{
			return;
		}
		long preExpendablePoint = GameMain.Ava.Player.ExpendablePoint;
		long preAllianceLevel = GameMain.Ava.Alliance.Level;
		AvaPlayer.OnDonateOk OkFunc = delegate ()
		{
			RefreshMenu();
			long dPoint = GameMain.Ava.Player.ExpendablePoint - preExpendablePoint;
			ConfirmDialog dialog = MenuMgr.instance.getConfirmDialog();
			string strTips = "";
			if(GameMain.Ava.Alliance.Level > preAllianceLevel)
			{
				dialog.setLayout(600, 320);
				dialog.setContentRect(70,85,0,110);
//				strTips = string.Format(Datas.getArString("Alliance.APGainedAndAllianceUpgradeMessage"),string.Format ("<color=wight>{0}</color>",dPoint),string.Format ("<color=wight>{0}</color>",dPoint),string.Format ("<color=wight>{0}</color>",GameMain.Ava.Alliance.Level));
				strTips = string.Format(Datas.getArString("Alliance.APGainedAndAllianceUpgradeMessage"),dPoint,dPoint,GameMain.Ava.Alliance.Level);
			}
			else
			{
				dialog.setLayout(600, 310);
				dialog.setContentRect(70,85,0,90);
				strTips = string.Format(Datas.getArString("Alliance.APGainedMessage"),dPoint,dPoint);
			}
			dialog.SetCancelAble(false);
			MenuMgr.instance.PushConfirmDialog(strTips,"",null,null);
			UpdateSeed.singleton.update_seed_ajax();
		};
		int curCityId = GameMain.singleton.getCurCityId();
		GameMain.Ava.Player.DonateResource (curCityId, donateResData, OkFunc);
	}


	private void UpdateButton ()
	{
		if(donateResData.ToAp() > 0)
		{
			donateBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
			donateBtn.SetDisabled(false);
		}
		else
		{
			donateBtn.setNorAndActBG("button_60_grey_normalnew","button_60_grey_normalnew");
			donateBtn.SetDisabled(true);
		}
	}

	private bool CanDonate()
	{
		int needPlayerLevel; 
		if(!GameMain.Ava.Player.PlayerLevelSatisfiedDonation(out needPlayerLevel))
		{
			ErrorMgr.singleton.PushError("", string.Format(Datas.getArString("Error.err_4320"), needPlayerLevel), true, "OK", null);
			return false;
		}
		long needMight;
		if(!GameMain.Ava.Player.MightStatisfiedDonation(out needMight))
		{
			ErrorMgr.singleton.PushError("", string.Format(Datas.getArString("Error.err_4321"), needMight), true, "OK", null);
			return false;
		}
		int needAllianceLevel;
		if(!GameMain.Ava.Player.AllianceLevelStatisfiedDonation(out needAllianceLevel))
		{
			ErrorMgr.singleton.PushError("", string.Format(Datas.getArString("Error.err_4319"), needAllianceLevel), true, "OK", null);
			return false;
		}
		int needBuildingType;
		int needBuildingLevel;
		if(!GameMain.Ava.Player.BuildingLevelStatisfiedDonation(out needBuildingType, out needBuildingLevel))
		{
			ErrorMgr.singleton.PushError("", string.Format(Datas.getArString("Error.err_4322"), Datas.getArString("buildingName."+"b"+needBuildingType), needBuildingLevel), true, "OK", null);
			return false;
		}
		int needAllianceSkillId;
		int needAllianceSkillLevel;
		if(!GameMain.Ava.Player.AllianceSkillLevelStatisfedDonation(out needAllianceSkillId, out needAllianceSkillLevel))
		{
			ErrorMgr.singleton.PushError("", string.Format(Datas.getArString("Error.err_4323"), Datas.getArString ("AllianceSkill.Name_s" + needAllianceSkillId), needAllianceSkillLevel), true, "OK", null);
			return false;
		}
		return true;
	}

	private void onSliderDrag(bool isSliderDrag)
	{
		isUpdateList = !isSliderDrag;
	}
}
