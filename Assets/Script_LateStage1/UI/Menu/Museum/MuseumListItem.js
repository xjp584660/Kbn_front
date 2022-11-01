
import UnityEngine;
import System.Collections.Generic;
import System.Collections;
class MuseumListItem extends ListItem
{
	private var endTime:long;
	private var oldTime:long;
	private var presentTime:long;
	private var isEventOver:boolean;
	private var eventId:int;

	public var l_name:Label;
	public var l_time:Label;
	public var point:Label;
	public var l_claimed:Label;
	public var bgButton:SimpleButton;

	public var itemPic:ItemPic;
	public var itemDes:Label;
	public var itemName:Label;
	public var itemRewardNum:Label;
	public var iconChangeState:Label;
	public var itemPeekIcon:Label;
	public var itemPeekButton:Button;

	// public var pieceObj:MuseumExchangePieceItem;

	public var componentEvent:ComposedUIObj;
	public var componentBg:ComposedUIObj;

	public var icon_Clone:Label;
	public var jiahao_clone:Label;

	public var Endslabel:Label;

	private var data:KBN.EventEntity;

	public var scroll:ScrollList;
	public var item:MuseumIconItem;
	public static var ITEMCOUNT:int;

	public var satisfied:Texture2D;
	public var unsatisfied:Texture2D;



	public function get getId():int
	{
		return eventId;
	}

	private function IsArt():boolean{
		if (data!=null) {
			return data.tab>10||data.endTime==0;
		}
	}

	public function Init()
	{
		ITEMCOUNT=-1;
		l_name.Init();
		l_time.Init();
		point.Init();
		l_claimed.Init();
		item.Init();
		scroll.Init(item);

		itemPic.Init();
		itemDes.Init();
		itemName.Init();
		itemRewardNum.Init();
		itemPeekIcon.Init();
		itemPeekIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("infor_icon",TextureType.DECORATION);
		itemPeekButton.Init();
		bgButton.Init();
		bgButton.OnClick=ClickBg;
		Endslabel.txt=Datas.getArString("Common.End")+":";

		componentEvent.component = [itemPic,itemRewardNum, iconChangeState, itemPeekIcon, itemPeekButton];
	
	}
	private function ClickBg()
	{
		// Debug.Log("ClickBg");
		PlayerPrefs.SetInt("MuseumPointId_"+eventId,0);
		MenuMgr.getInstance().PushMenu("MuseumEventListMenu",data,"trans_zoomComp");
		point.SetVisible(isPoint());
	}

	public function SetRowData(param:Object)
	{
		data = param as KBN.EventEntity;
		l_time.SetVisible(!IsArt());
		Endslabel.SetVisible(!IsArt());
		endTime = data.endTime;
		eventId=data.id;
		if (!PlayerPrefs.HasKey("MuseumPointId_"+eventId)) {
			PlayerPrefs.SetInt("MuseumPointId_"+eventId,1);
		}
		itemPeekButton.OnClick = OnPeekInsideButtonNEW;

		// var list:List.<Object> = new List.<Object>();
		// for(var a:int = 0; a < data.pieces.Count; a ++)
		// {
		// 	list.Add(data.pieces[a] as Object);
		// }
		scroll.Clear();
		ITEMCOUNT=data.pieces.Count;
		scroll.SetData(data.pieces);

		itemPic.SetId(data.itemId);
		var itemCategary:int = MyItems.GetItemCategoryByItemId(data.itemId);
		data.itemCategary = itemCategary;
		if(itemCategary == MyItems.Category.MystryChest)
		{ 
			// itemDes.txt = MystryChest.instance().GetChestDesc(data.itemId);
			itemName.txt = MystryChest.instance().GetChestName(data.itemId);			
			l_name.txt = MystryChest.instance().GetChestName(data.itemId)+"  x" + data.itemNum;			
			itemPeekIcon.SetVisible(true);
			itemPeekButton.SetVisible(true);
		}
		else if(itemCategary == MyItems.Category.LevelChest)
		{
			// itemDes.txt = Datas.getArString("Common.LevelChestDesc", [MystryChest.instance().GetLevelOfChest(data.itemId)]);
			itemName.txt = Datas.getArString("Common.LevelChestName", [MystryChest.instance().GetLevelOfChest(data.itemId)]);			
			l_name.txt = Datas.getArString("Common.LevelChestName", [MystryChest.instance().GetLevelOfChest(data.itemId)])+"  x" + data.itemNum;			
			itemPeekIcon.SetVisible(true);
			itemPeekButton.SetVisible(true);
		}
		else if(itemCategary == MyItems.Category.Chest || itemCategary == MyItems.Category.TreasureChest)
		{
			// itemDes.txt = Datas.getArString("itemDesc."+ "i"+ data.itemId);
			itemName.txt = Datas.getArString("itemName."+"i" + data.itemId);
			l_name.txt = Datas.getArString("itemName."+"i" + data.itemId)+"  x" + data.itemNum;
			itemPeekIcon.SetVisible(true);
			itemPeekButton.SetVisible(true);
		}
		else
		{
			// itemDes.txt = Datas.getArString("itemDesc."+ "i"+ data.itemId);
			itemName.txt = Datas.getArString("itemName."+"i" + data.itemId);
			l_name.txt = Datas.getArString("itemName."+"i" + data.itemId)+"  x" + data.itemNum;
			itemPeekIcon.SetVisible(false);
			itemPeekButton.SetVisible(false);
		}	
		point.SetVisible(isPoint());
		if(data.canClaim)
		{
			iconChangeState.mystyle.normal.background = satisfied;
		}
		else
		{
			iconChangeState.mystyle.normal.background = unsatisfied;			
		}

		if(endTime > GameMain.unixtime())
		{
			isEventOver = false;
		}
		else
		{
			l_time.txt = "0";
			isEventOver = true;
		}
		if (data.limitQuantity!=0) {
			if(Museum.singleton.ComputeClaimCount(data) > 1 && data.batchReward)
			{
				l_claimed.txt = Datas.getArString("fortuna_gamble.win_claimButton") + ":"+data.changedQuantity + "/" + data.limitQuantity+" ...";
				// claimBtn.OnClick = OnMutiClaim;
			}
			else
			{
				l_claimed.txt = Datas.getArString("fortuna_gamble.win_claimButton")+":"+data.changedQuantity + "/" + data.limitQuantity;
				// claimBtn.OnClick = OnClaim;
			}
		}else{
			l_claimed.txt = Datas.getArString("fortuna_gamble.win_claimButton");
		}

	}

	private function isPoint():boolean{
		return PlayerPrefs.GetInt("MuseumPointId_"+eventId,0)==1;
	}

	public function Update()
	{
		// scroll.Update();
		if(isEventOver)
		{
			return;
		}
		
		if(!isEventOver)
		{
			var present:long = GameMain.unixtime();
			if(present - oldTime >= 1)
			{
				if(endTime - present >= 0)
				{
					l_time.txt = _Global.timeFormatStr(endTime - present);
					oldTime = present;				
				}
				else
				{
					isEventOver = true;
					// changeBtnSkin(isEventOver);
				}
			}		
		}															
	}

	public function OnPeekInsideButton()
	{
		MenuMgr.getInstance().PushMenu("ChestDetail", 
            new HashObject({"ID": data.itemId, "Category": data.itemCategary, "inShop": true}),
            "trans_zoomComp");
	}

	public function OnPeekInsideButtonNEW(){
		var displayData : ChestDetailDisplayData = ChestDetailDisplayData.CreateWithHashObject(
			new HashObject({"ID": data.itemId, "Category": data.itemCategary, "inShop": true}));
		var chestData:PBData.PBMsgResMystryChest.ChestData=MystryChest.instance().GetChestItemRawData(displayData.Id);
		if (chestData!=null) {
			var gearDrop:List.<int> = chestData.gearDrop;
			if (gearDrop!=null&&gearDrop.Count==1) {
				var id:int=gearDrop[0];
				var arm:Arm=new Arm();
				arm.GDSID=id;
				arm.Skills=GearManager.Instance().GetArmSkill(arm);
				arm.Category=GearManager.Instance().GetArmType(arm);
				arm.Rare=GearManager.Instance().GetPureArmRare(id);
				arm.TierLevel=GearManager.Instance().GetPureArmRare(id);
				arm.Setid=GearManager.Instance().getSetid(id);
				arm.Threesetattribute=GearManager.Instance().GetThreesetattribute(id);
				arm.Fivesetattribute=GearManager.Instance().GetFivesetattribute(id);
				arm.SkillLevel=1;
				arm.IsShowBase=arm.Category==6;
				arm.ArmIsParseValid=true;
				arm.ReqLevel = arm.GetArmReqLevel(id);
				OnShowItem(arm);
				return;
			}
		}
		OnPeekInsideButton();
	}

	private function OnShowItem(arm:Arm){
		// Debug.Log("装备的GDS.ID:"+arm.GDSID);
		MenuMgr.getInstance().sendNotification("OnShowTip",arm);
	}


	public function OnClear()
	{
		super.OnClear();
		scroll.Clear();
		
		// componentBg.clearUIObject();
	}
	var menu:MuseumBuilding;
	public function DrawItem()
	{
		componentBg.Draw();
		componentEvent.Draw();
		l_claimed.Draw();
		l_name.Draw();
		l_time.Draw();
		point.Draw();	
		scroll.Draw();
		if (MenuMgr.getInstance().GetCurMenuName()=="MuseumBuilding") {
			menu=MenuMgr.getInstance().GetCurMenu() as MuseumBuilding;
			if (menu!=null&&menu.isCanTimeCounter) {

			}else{
				bgButton.Draw();
			}
		}else{
			bgButton.Draw();
		}
		
	
	}
}