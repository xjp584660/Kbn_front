using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;
using System;

public class ItemDonateMenu : PopMenu 
{
	[SerializeField] private SimpleLabel line;
	[SerializeField] private ScrollList itemList;
	[SerializeField] private ListItem donateItem;
	public override void Init()
	{
		base.Init();
		title.txt = Datas.getArString("Alliance.info_dummy_entrustitemstitle");
		line.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("between line", TextureType.DECORATION);
		itemList.Init(donateItem);
	}
	
	protected override void DrawItem()
	{
		line.Draw();
		itemList.Draw();
	}
	
	public override void Update() 
	{
		itemList.Update ();
	}
	
	public override void OnPush(object param)
	{
		itemList.Clear();
		RefreshMenu ();
	}

	private void RefreshMenu()
	{
		itemList.SetData (AvaDonateItem.DonateItemList().ToArray());
		itemList.ForEachItem (item=>{
			AllianceDonateItem itemD = item as AllianceDonateItem;
			itemD.SetClickFunc(new Action<AvaDonateItem>(OnClickItem));
			return true;
		});
//		itemList.UpdateData();
		itemList.ResetPos();
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

	private void OnClickItem(AvaDonateItem itemData)
	{
		if (!CanDonate()) 
		{
			return;
		}

		long preExpendablePoint = GameMain.Ava.Player.ExpendablePoint;
		long preAllianceLevel = GameMain.Ava.Alliance.Level;
		AvaPlayer.OnDonateOk OkFunc = delegate ()
		{
//			RefreshMenu();
			itemList.UpdateData();
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
		};
		GameMain.Ava.Player.DonateItem (GameMain.singleton.getCurCityId(), itemData, OkFunc);
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
}
