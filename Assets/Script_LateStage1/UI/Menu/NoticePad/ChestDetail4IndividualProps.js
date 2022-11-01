class ChestDetail4IndividualProps extends PopMenu
{
	public var itemList:ScrollList;
	public var subItem:NewSubItem;
	
	public var line:SimpleLabel;
	private var chestId:int;
	private var subItems:HashObject;
	private var dropGearItems:int[];
	
	//Add by Caisen 2014.8.7 start
	public var btn_reward:Button;
	public var isDrawRewardButton:boolean=false;
	//Add by Caisen 2014.8.7 end
	
	public var rewardDesc:Label;
	
	function Init()
	{
		super.Init();
		itemList.Init(subItem);
		title.txt = Datas.getArString("Campaign.LevelSubTitle1");
		//Add by Caisen 2014.8.27 start
		btn_reward.txt=Datas.getArString("EventCenter.ClaimBtn");
		btn_reward.changeToBlueNew();
		rewardDesc.txt=Datas.getArString("PVP.Event_Leaderboard_ClaimText");
		//Add by Caisen 2014.8.27 end
	}
	
	public function OnPush(param:Object)
	{
		var data:HashObject = param as HashObject;
		super.OnPush(data);
		
		itemList.ClearData2();
		itemList.SetVisible( true );
		
		if( data["bonus"] != null ) {
			
			var keys : Array = _Global.GetObjectKeys( data["bonus"] );
			var items : InventoryInfo[] = new InventoryInfo[keys.Count];
			
			for( var i : int = 0; i < keys.Count; ++i ) {
				items[i] = new InventoryInfo();
				items[i].id = _Global.INT32( keys[i] );
				items[i].quant = _Global.INT32( data["bonus"][keys[i]] );
				items[i].category = MyItems.Category.General;
			}
		
			
			if (items.Length > 0)
			{
				itemList.SetData(items);
				itemList.ResetPos();
			}
		}
		
		//Add by Caisen 2014.8.27 start
		isDrawRewardButton=_Global.GetBoolean(data["hasReward"]);
		if(isDrawRewardButton==true)
		{
			btnClose.visible=false;
		}
		else
		{
			btnClose.visible=true;
		}
		//Add by Caisen 2014.8.27 end
		KBN.TournamentManager.getInstance();
		if( isDrawRewardButton ) {
			if( data["acqBonusOccasion"] != null ) {
				if( ( data["acqBonusOccasion"].Value as String ) == "pvp" ) {
					btn_reward.OnClick = function() { // PVP
						if(KBN._Global.GetBoolean(data["isAlliance"])==true)
						{
							KBN.TournamentManager.getInstance().requestTournamentBonusAcquirementForAlliance();
						}
						else
						{
							KBN.TournamentManager.getInstance().requestTournamentBonusAcquirementForPlayer();
						}
					};
				} else if( ( data["acqBonusOccasion"].Value as String ) == "pve" ) {
					rewardDesc.txt="";
					btn_reward.OnClick = function() { // PVE
						KBN.LeaderBoardController.instance().ReqGetLeaderBoardReward();
						MenuMgr.getInstance().PopMenu("ChestDetail4IndividualProps");
					};
				}
			}
		}
		
	}

	
	function DrawItem()
	{
		line.Draw();
		itemList.Draw();
		//Add by Caisen 2014.8.7 start
		if(isDrawRewardButton==true)
		{
			rewardDesc.Draw();
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
	}
}

