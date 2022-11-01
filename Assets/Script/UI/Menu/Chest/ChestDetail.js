class ChestDetail extends PopMenu
{
	public var itemList:ScrollList;
	public var subItem:NewSubItem;
	
	public var chestName:Label;
	public var chestDesc:Label;
	public var descMyst:Label;
	public var descMyst2:Label;
	public var line:SimpleLabel;
	public var line2:Label;
	public var chestBack:Label;
	public var chestIcon:Label;
	private var chestId:int;
	public var chestSummary:ComposedUIObj;
	private var subItems:HashObject;
	private var dropGearItems:int[];
	//private var dropGearItems:HashObject;
	
	//Add by Caisen 2014.8.7 start
	public var btn_reward:Button;
	public var isDrawRewardButton:boolean=false;
	public var rewardType:int=1;
	//Add by Caisen 2014.8.7 end
	
	function Init()
	{
		super.Init();
		itemList.Init(subItem);
		chestSummary.component = [chestBack, chestName, chestIcon, chestDesc];
		title.txt = Datas.getArString("Common.Chest");
		chestIcon.useTile = true;
		chestIcon.tile =  TextureMgr.instance().ItemSpt().GetTile(null);
		
		//Add by Caisen 2014.8.7 start
		btn_reward.txt=Datas.getArString("PVP.Event_Leaderboard_Claim");
		btn_reward.changeToBlueNew();
		btn_reward.OnClick = rewardOnClick;
		//Add by Caisen 2014.8.7 end
	}
	
	public function OnPush(param:Object)
	{
		var data:HashObject = param as HashObject;
		super.OnPush(data);
		var displayData : ChestDetailDisplayData = ChestDetailDisplayData.CreateWithHashObject(data);
		//_Global.Log(displayData.ToString());
		itemList.ClearData2();
		if ( data["WheelGamePrizeType"] != null )
		{
			var prizeType : int = _Global.INT32(data["WheelGamePrizeType"]);
			if ( prizeType < WheelGameEnumType.Key )
			{
				var titleStr : String = Datas.getArString("WheelGame.CommonPrize"+(prizeType+1).ToString());
				title.txt = titleStr;
			}
			else if ( prizeType == WheelGameEnumType.GrandPrize )
			{
				var titleStrGrandPrize : String = Datas.getArString("WheelGame.GrandPrize");
				title.txt = titleStrGrandPrize;
			}
			
			if ( data["WheelGamePrizeIcon"] != null )
			{
				chestIcon.tile = data["WheelGamePrizeIcon"].Value as Tile;
			}
		}
//		var arStrings:Object = Datas.instance().arStrings();
		if ( chestId == Constant.ItemId.WHEELGAME_KEY )
		{
			title.txt = Datas.getArString("WheelGame.Key");
		}
		
		
		chestName.txt = displayData.Name;
		var count:int = _Global.INT32(data["itemCnt"]);
		if(count < 1)
		{
			chestDesc.txt = displayData.Desc;
		}
		else
		{
			chestDesc.txt = String.Format(Datas.getArString("itemDesc.MysteryChest_2"),count);
		}
		
		
		
		descMyst.SetVisible(displayData.ShouldShowDescMyst);
		descMyst.txt = displayData.DescMyst;
		descMyst2.SetVisible(displayData.ShouldShowDescMyst2);
		line2.SetVisible(displayData.ShouldShowDescMyst2);
		descMyst2.txt = displayData.DescMyst2;
        chestIcon.tile = TextureMgr.instance().LoadTileOfItem(displayData.Id);
		itemList.SetVisible(displayData.ShouldShowItemList);
		var items : InventoryInfo[] = displayData.Items;
		if (items.Length > 0)
		{
			itemList.SetData(items);
			itemList.ResetPos();
		}
		
		//Add by Caisen 2014.8.7 start
		/*
		if(_Global.GetBoolean(data["hasReward"])==true)
		{
			isDrawRewardButton=true;		
		}
		else
		{
			isDrawRewardButton=false;
		}
		*/
		isDrawRewardButton=_Global.GetBoolean(data["hasReward"]);
		if(data["rewardType"] != null)
		{
			rewardType = _Global.INT32(data["rewardType"]);
		}

		if(data["claimState"] != null)
		{
			var claimState : int = _Global.INT32(data["claimState"]);
			if(claimState == 0)
			{
				btn_reward.EnableBlueButton(false);
				btn_reward.txt = Datas.getArString("PassMission.Claim");
			}
			else if(claimState == 1)
			{
				btn_reward.EnableBlueButton(true);
				btn_reward.txt = Datas.getArString("PassMission.Claim");
			}
			else
			{
				btn_reward.EnableBlueButton(false);
				btn_reward.txt = Datas.getArString("PassMission.Claimed");
			}
		}
		//Add by Caisen 2014.8.7 end
		
	}
	
	function DrawItem()
	{
		line.Draw();
		chestSummary.Draw();
		itemList.Draw();
		descMyst.Draw();
		line2.Draw();
		descMyst2.Draw();
		//Add by Caisen 2014.8.7 start
		if(isDrawRewardButton==true)
		{
			btn_reward.Draw();
		}
		//Add by Caisen 2014.8.7 end
	}
	
	function Update()
	{
		itemList.Update();
	}
	
	public function OnPopOver()
	{
		itemList.Clear();
		chestSummary.clearUIObject();
	}

	private function rewardOnClick(param : System.Object) : void
    {
		// PassSeassion
		if(rewardType == 1)
		{
            PassMissionMapManager.Instance().claimBoxReward();
		}
    }
}

