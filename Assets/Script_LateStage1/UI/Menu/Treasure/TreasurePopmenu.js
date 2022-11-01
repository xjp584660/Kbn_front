class TreasurePopmenu extends PopMenu implements IEventHandler
{
	public var devideLine:Label;
	public var l_Line2:Label;
	//public var boxA:BoxAnimation;
	public var chestDes:Label;
	public var chestIcon:Label;
	
	public var boxC:BoxContent;
	public var stakeC:StakeContent;

	public static var USE_STAKE_OPEN_CHEST:String = "useStakeOpenChest";
	public static var BOX_ANIMATION_FINISH:String = "boxAnimationFinish";
	public static var OPEN_CHEST:String = "openChest";
	public static var BUY_STAKE:String = "buyStake";
	public static var UPDATE_STAKE_CONTENT:String = "updateStakeContent";
	
	private var controller:NavigatorController;
	private var chestId:int;
	
	public function Init():void
	{
		super.Init();
	
		//boxA.Init(this); 
		chestIcon.Init();
		chestDes.Init();
		boxC.Init();
		stakeC.Init(this);

		devideLine.Init();
		devideLine.setBackground("between line", TextureType.DECORATION);
		l_Line2.Init();
		l_Line2.setBackground("between line_list_small", TextureType.DECORATION);
		controller = new NavigatorController();
		controller.Init();
		controller.push(stakeC);
	}
	
	private function handleAnimationFinished():void
	{
		controller.push(boxC);
	}
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("TreasurePopmenu");
	}
	
	function Update()
	{
		//boxA.Update();
		controller.u_Update();
	}

	function FixedUpdate()
	{
		controller.u_FixedUpdate();	
	}
		
	public function OnPush(param:Object):void
	{
		chestId = Treasure.getInstance().chestId;
		
		//boxA.resetState();
		chestDes.txt = Datas.getArString("itemName.i" + chestId);
		chestIcon.useTile = true;
		chestIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile(TextureMgr.instance().LoadTileNameOfItem(chestId));
		//chestIcon.tile.name = TextureMgr.instance().LoadTileNameOfItem(chestId);
				
		title.txt = Datas.getArString("MessagesModal.CollectedTreasure");
		stakeC.resetDisplay();
	}
	
	public function OnPop():void
	{
		controller.pop2Root();
	}
	
	public	function OnPopOver():void
	{
		stakeC.Clear();
	}
	
	function DrawItem()
	{
		devideLine.Draw();
		l_Line2.Draw();
		//boxA.Draw();
		chestIcon.Draw();
		chestDes.Draw();
		
		controller.DrawItems();
	}
	
	public function handleItemAction(action:String, params:Object):void
	{		
		switch(action)
		{
			case USE_STAKE_OPEN_CHEST:
				useStake(params);
				break;
			case BOX_ANIMATION_FINISH:
				animationFinish();
				break;
			case OPEN_CHEST:
				openChest(params);
				break;	
			case BUY_STAKE:
				buyStake(params);
				break;	
		}
	}
	
	private function useStake(param:Object):void
	{
		Treasure.getInstance().openTreasureChest(chestId, _Global.INT32((param as Hashtable)["itemId"]), successUseStake);																		
	}
	
	private function successUseStake(result:Object):void
	{
		boxC.SetRowData(result);
		//boxA.playAnimation();
		if((result as Array).length == 0)
		{
			chestDes.txt = Datas.getArString("Common.TreasureChestEmpty"); 
		}
		else
		{
			chestDes.txt = Datas.getArString("Common.TreasureChestContains"); 
		}
		
		title.txt = Datas.getArString("Common.Chest");
		
		controller.push(boxC);
	}
	
	private var savedParam:Hashtable;
	private function buyStake(param:Object):void
	{
		savedParam = param as Hashtable;
		Shop.instance().swiftBuy(savedParam["itemId"], successBuyStake);
	}
	
	private function successBuyStake():void
	{
		stakeC.resetDisplay();
		useStake(savedParam);
	}
	
	private function openChest(param:Object):void
	{
		Treasure.getInstance().openTreasureChest(chestId, successOpenChest);
	}
	
	private function successOpenChest(result:Object):void
	{
		boxC.SetRowData(result);
		//boxA.playAnimation();
		if((result as Array).length == 0)
		{
			chestDes.txt = Datas.getArString("Common.TreasureChestEmpty"); 
		}
		else
		{
			chestDes.txt = Datas.getArString("Common.TreasureChestContains"); 
		}
		
		title.txt = Datas.getArString("Common.Chest");
		
		controller.push(boxC);
	}
	
	private function animationFinish():void
	{
		controller.push(boxC);
	}
}