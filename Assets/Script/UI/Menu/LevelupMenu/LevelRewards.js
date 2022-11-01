class LevelRewards extends PopMenu
{
	var unlockList:UIList;
	var rewardList:UIList;
	
	var unlockItem:UnlockItem ;
	var rewardItem:RewardItem;
	var unlockItems:ListItem[];
	var rewardItems:ListItem[];
	
	var unlock:Label;
	var rewards:Label;
	var unlock_bg:SimpleLabel;
	var reward_bg1:SimpleLabel;
	var reward_bg2:SimpleLabel;
	var reachLevel:SimpleLabel;
	var level:SimpleLabel;
	var titlebg:SimpleLabel;
	var line:Label;
	var line2:Label;
	var bntClaim:Button;
	var btnItems:Button;
	
	public var scrollView:ScrollView;
	public function Init()
	{
        if (KBN.FTEMgr.isFTERuning()) {
            LockRadio = false;
        }
		super.Init();
		unlockList.growDown = true;
		rewardList.growDown = true;
		
		unlockList.Init();
		rewardList.Init();
		
		unlock.txt = Datas.getArString("LevelUp.Unlocked") ;
		rewards.txt = Datas.getArString("Common.Rewards") ;
		title.txt = Datas.getArString("Common.LevelUp_title") ;
		reachLevel.txt = Datas.getArString("Common.Congratulation") ;
		bntClaim.txt = Datas.getArString("Common.OK_Button");
		btnItems.txt = Datas.getArString("Common.ViewChest");
		
		bntClaim.OnClick = function(param:Object)
		{
			MenuMgr.getInstance().PopMenu("");
			LevelUp.instance().CloseMenu();
			LevelUp.instance().check();
			
			JoinAllianceTip.getInstance().popupJoinAllianceTip();
			
			if(isRate)
			{
				GameMain.instance().CheckAndOpenRaterAlert("levelup");
				
			}

		};
		
		btnItems.OnClick = function(param:Object)
		{
			MenuMgr.getInstance().PopMenu("");
			
			JoinAllianceTip.getInstance().setJoinAllianceTipEnable(false);
			
			LevelUp.instance().CloseMenu();
			LevelUp.instance().check();		
			
			if(isRate)
			{
				GameMain.instance().CheckAndOpenRaterAlert("levelup");
			}
			
			var obj:Object = {"selectedTab":1, "selectedList":4};
			MenuMgr.getInstance().PushMenu("InventoryMenu", obj);			
		};
		
		for(var i:int=0; i< unlockItems.length; i++)
		{
			unlockItems[i] = Instantiate(unlockItem);
//			unlockItems[i].DontDestroyOnLoad (unlockItems[i].transform.gameObject);
		}		
				
		for(i=0; i< rewardItems.length; i++)
		{
			rewardItems[i] = Instantiate(rewardItem);
//			rewardItems[i].DontDestroyOnLoad (rewardItems[i].transform.gameObject);
		}
		
		btnClose.SetVisible(false);
	}
	
	private function hasFreeChest():LevelUp.UnlockItem
	{
		var reward:LevelUp.Reward;
		var rewardsArray:Array = LevelUp.instance().GetRewards();
		
		for(var a:int = 0; a < rewardsArray.length; a ++)
		{
			reward = rewardsArray[a];
			
			if(reward.id > 30000 && reward.id <= 30100)
			{
				var unlockItem:LevelUp.UnlockItem = new LevelUp.UnlockItem();
				unlockItem.type = TextureType.ICON_ITEM;
				unlockItem.texturePath = reward.texturePath;
				unlockItem.name = reward.name; 
				unlockItem.description = Datas.getArString("Common.LevelChestDesc", [MystryChest.instance().GetLevelOfChest(reward.id)]);//MystryChest.instance().GetLevelChestDes(reward.id);
				
				return unlockItem;
			}		
		}
		
		return null;
	}
	private var isRate:boolean = false;
	public function OnPush(param:Object)
	{
		super.OnPush(param);
		isRate = param;
		unlockList.Clear();
		rewardList.Clear();
		var seed:Object = GameMain.instance().getSeed();
	//	level.txt = "" + param["level"] ;
		var unlocks:Array = LevelUp.instance().GetUnlockItems();
		var rewardsArray:Array = LevelUp.instance().GetRewards();
				
		var freeChestForReward:LevelUp.UnlockItem = hasFreeChest();
		
		if(freeChestForReward != null)		
		{
			unlocks.Unshift(freeChestForReward);
		}

		for(var i:int=0; i<unlocks.length; i++)
		{
			var unlocked:LevelUp.UnlockItem = unlocks[i] as LevelUp.UnlockItem;
			unlockList.AddItem(unlockItems[i]);
		//	unlockItems[i].icon.mystyle.normal.background = TextureMgr.instance().LoadTexture(unlocks[i].texturePath, unlocks[i].type);//Resources.Load(unlocks[i].texturePath);
			unlockItems[i].icon.useTile = true;
			unlockItems[i].btnSelect.SetVisible(false);
			var type:String  = unlocked.type;
			if( type == TextureType.ICON_BUILDING)
				unlockItems[i].icon.tile = TextureMgr.instance().BuildingSpt().GetTile(unlocked.texturePath);
			else if(type == TextureType.ICON_UNIT)
				unlockItems[i].icon.tile = TextureMgr.instance().UnitSpt().GetTile(unlocked.texturePath);
			else if(type == TextureType.ICON_ITEM)	
				unlockItems[i].icon.tile = TextureMgr.instance().ItemSpt().GetTile(unlocked.texturePath);
			else if(type == TextureType.ICON_ELSE)
			{
				unlockItems[i].btnSelect.SetVisible(true);
				(unlockItems[i] as UnlockItem).setHelpFunc();
				unlockItems[i].icon.tile = TextureMgr.instance().ElseIconSpt().GetTile(unlocked.texturePath);
			}
			//unlockItems[i].icon.tile.name = unlocked.texturePath;	
			
			unlockItems[i].title.txt = unlocked.name;
			unlockItems[i].description.txt = unlocked.description;
		}
		
		for(i=0; i<rewardsArray.length; i++)
		{
			var reward:LevelUp.Reward = rewardsArray[i] as LevelUp.Reward;
			rewardList.AddItem(rewardItems[i]);
		//	rewardItems[i].icon.mystyle.normal.background = TextureMgr.instance().LoadTexture(rewardsArray[i].texturePath, rewardsArray[i].type);//Resources.Load(rewardsArray[i].texturePath);
			rewardItems[i].icon.useTile = true;
			type  = reward.type;
			if( type == TextureType.ICON_ELSE)
			{
				rewardItems[i].icon.tile = TextureMgr.instance().ElseIconSpt().GetTile(reward.texturePath);
				(rewardItems[i] as RewardItem).frame.SetVisible(false);
			}
			else if(type == TextureType.ICON_ITEM)
			{
				rewardItems[i].icon.tile = TextureMgr.instance().ItemSpt().GetTile(reward.texturePath);
				
				if(reward.id > 30000 && reward.id <= 30100)
				{
					(rewardItems[i] as RewardItem).frame.SetVisible(true);
				}
				else
				{
					(rewardItems[i] as RewardItem).frame.SetVisible(false);
				}
				
			}
			
			//rewardItems[i].icon.tile.name = reward.texturePath;
			
			rewardItems[i].description.txt = "" + reward.quant;
			rewardItems[i].title.txt = reward.name;
		}
		
		if(freeChestForReward != null)
		{
			btnItems.SetVisible(true);
			bntClaim.rect.x = 50;
		}
		else
		{
			btnItems.SetVisible(false);
			bntClaim.rect.x = 199;
		}
		
		if(unlocks.length > 0)
			scrollView.component = [unlock, line, unlockList, line2, rewards, rewardList];
		else
			scrollView.component = [rewards, rewardList];	
		scrollView.AutoLayout();
		scrollView.MoveToTop();
		SoundMgr.instance().PlayEffect("rare_drop", /*TextureType.AUDIO*/"Audio/");
	}
	
	public	function	OnPopOver()
	{
		for(var obj : UIObject in unlockItems)
		{
			TryDestroy(obj);
		}		

		for(var obj : UIObject in rewardItems)
		{
			TryDestroy(obj);
		}
		scrollView.clearUIObject();
	}
	
	function DrawItem()
	{
		titlebg.Draw();
		reachLevel.Draw();
	//	level.Draw();		
//		rewards.Draw();
//		unlockList.Draw();
//		rewardList.Draw();
//		line.Draw();
//		bntClaim.Draw();
		scrollView.Draw();
		btnItems.Draw();
		bntClaim.Draw();
	}
	
	function Update()
	{
		scrollView.Update();
	}
	public function OnBackButton() : boolean
	{
		return true;
	}		
}

