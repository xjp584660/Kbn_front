class MuseumEventListItem extends ListItem implements IEventHandler
{
	private var eventId:int;
	private var endTime:long;
	private var oldTime:long;
	private var presentTime:long;
	private var isEventOver:boolean;
	
	public var bg:Label;
	public var titleBg:Label;
	
	public var eventName:Label;
	public var limitDes:Label;
	public var timeTitle:Label;
	public var timeCounter:Label;
	public var lineDec:Label;
			
	public var itemPic:ItemPic;
	public var itemDes:Label;
	public var itemName:Label;
	public var itemRewardNum:Label;
	public var iconChangeState:Label;
	public var itemPeekIcon:Label;
	public var itemPeekButton:Button;
	
	public var line:Label;
	public var requirementLabel:Label;
	public var centerBg:Label;
	
	public var componentEvent:ComposedUIObj;
	public var componentTitle:ComposedUIObj;
	public var componentPiece:ComposedUIObj;
	public var component:ComposedUIObj;

	public var pieceObj:MuseumExchangePieceItem;
	public var claimBtn:Button;
	
	public var satisfied:Texture2D;
	public var unsatisfied:Texture2D;
	
	public var eventHandler:IEventHandler;

	
	
	private var selectedExchangePiece : MuseumExchangePieceItem = null;
	
	function Init()
	{		
		eventName.Init();
		limitDes.Init();
		iconChangeState.Init();
			
		bg.Init();
		titleBg.Init();
		timeTitle.Init();
		timeCounter.Init();
		
		lineDec.Init();
		
		itemPic.Init();
		itemDes.Init();
		itemName.Init();
		itemRewardNum.Init();
		itemPeekIcon.Init();
		itemPeekIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("infor_icon",TextureType.DECORATION);
		itemPeekButton.Init();
		
		line.Init();
		requirementLabel.Init();
		// requirementLabel.mystyle.normal.background = TextureMgr.instance().LoadTexture("Brown_Gradients",TextureType.DECORATION);
		
		pieceObj.Init();
		claimBtn.Init();
		
		componentTitle.component = [eventName, timeTitle, timeCounter, limitDes, lineDec];
		componentEvent.component = [itemPic, itemDes, itemName, itemRewardNum, iconChangeState, itemPeekIcon, itemPeekButton];
		componentPiece.component = [requirementLabel, component];
	}
	
	public function OnClear()
	{
		super.OnClear();
		component.clearUIObject();
	}
	
	public function get getId():int
	{
		return eventId;
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		centerBg.Draw();
		bg.Draw();
		
		componentTitle.Draw();
		componentEvent.Draw();
		componentPiece.Draw();		
		
		claimBtn.Draw();
		
		GUI.EndGroup();		
	}
	
	private var data:KBN.EventEntity;
	
	private function get IsOrLogic() : boolean 
	{
		return (null == data) ? false : (data.logicType == Constant.Museum.ExchangeLogicType.LOGIC_OR);
	}
	
	public function SetRowData(param:Object)
	{
		data = param as KBN.EventEntity;
		
		eventId = data.id;
		endTime = data.endTime;
		
		itemPeekButton.OnClick = OnPeekInsideButton;
		
		var obj:MuseumExchangePieceItem;
		for(var a:int = 0; a < data.pieces.Count; a ++)
		{
			obj = Instantiate(pieceObj);																								
			obj.setData(data.pieces[a]);
			obj.handleDelegate = this;
			obj.setToggleVisible(IsOrLogic);
			component.addUIObject(obj);
		}
		
		component.AutoLayout();
		
		componentPiece.rect.height = component.rect.height + component.rect.y;
		titleBg.rect.height = componentPiece.rect.height;
		
		claimBtn.rect.y = componentPiece.rect.y + componentPiece.rect.height + 30;
		rect.height = claimBtn.rect.y + claimBtn.rect.height + 15;
		centerBg.rect.height=claimBtn.rect.y-centerBg.rect.y-20;
		bg.rect.height = rect.height;
		
		requirementLabel.txt = (IsOrLogic) ? Datas.getArString("RoundTower.NewTypeEventRequire") : Datas.getArString("Common.Requirement");
		
		if (data.limitQuantity==0) {
			limitDes.SetVisible(false);
			claimBtn.txt = Datas.getArString("fortuna_gamble.win_claimButton");
			claimBtn.OnClick = OnClaim;
		}
		else if(Museum.singleton.ComputeClaimCount(data) > 1 && data.batchReward)
		{
			limitDes.SetVisible(true);
			claimBtn.txt = "(" + data.changedQuantity + "/" + data.limitQuantity +")  " + Datas.getArString("fortuna_gamble.win_claimButton") + "...";
			claimBtn.OnClick = OnMutiClaim;
		}
		else
		{
			limitDes.SetVisible(true);
			claimBtn.txt = "(" + data.changedQuantity + "/" + data.limitQuantity +")  " + Datas.getArString("fortuna_gamble.win_claimButton");
			claimBtn.OnClick = OnClaim;
		}

		
		
		eventName.txt = data.eventName + "";
		limitDes.txt = "( " + Datas.getArString("Museum.EventLimit") + ": " + data.limitQuantity + " )";
		
		//itemPic.useTile = true;
		//itemPic.tile.spt = TextureMgr.instance().ElseIconSpt();
		itemPic.SetId(data.itemId);
		
		var itemCategary:int = MyItems.GetItemCategoryByItemId(data.itemId);
		data.itemCategary = itemCategary;
		if(itemCategary == MyItems.Category.MystryChest)
		{ 
			itemDes.txt = MystryChest.instance().GetChestDesc(data.itemId);
			itemName.txt = MystryChest.instance().GetChestName(data.itemId);			
			itemPeekIcon.SetVisible(true);
			itemPeekButton.SetVisible(true);
		}
		else if(itemCategary == MyItems.Category.LevelChest)
		{
			itemDes.txt = Datas.getArString("Common.LevelChestDesc", [MystryChest.instance().GetLevelOfChest(data.itemId)]);
			itemName.txt = Datas.getArString("Common.LevelChestName", [MystryChest.instance().GetLevelOfChest(data.itemId)]);			
			itemPeekIcon.SetVisible(true);
			itemPeekButton.SetVisible(true);
		}
		else if(itemCategary == MyItems.Category.Chest || itemCategary == MyItems.Category.TreasureChest)
		{
			itemDes.txt = Datas.getArString("itemDesc."+ "i"+ data.itemId);
			itemName.txt = Datas.getArString("itemName."+"i" + data.itemId);
			itemPeekIcon.SetVisible(true);
			itemPeekButton.SetVisible(true);
		}
		else
		{
			itemDes.txt = Datas.getArString("itemDesc."+ "i"+ data.itemId);
			itemName.txt = Datas.getArString("itemName."+"i" + data.itemId);
			itemPeekIcon.SetVisible(false);
			itemPeekButton.SetVisible(false);
		}	
		
		var _size:Vector2 =  itemName.mystyle.CalcSize(GUIContent(itemName.txt));
		itemName.rect.width = _size.x + 10;
		itemRewardNum.rect.x = itemName.rect.x + itemName.rect.width + 5;
		itemRewardNum.txt =  "x" + data.itemNum;

		timeTitle.txt = Datas.getArString("ModalEvent.TimeRemaining");
		timeTitle.SetFont();
		timeCounter.rect.x = timeTitle.rect.x + timeTitle.GetWidth() + 15;
		
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
		}else if (endTime==0) {
			isEventOver = false;
		}
		else
		{
			timeCounter.txt = "0";
			isEventOver = true;
		}
		timeCounter.SetVisible(data.tab<=10&&endTime!=0);
		timeTitle.SetVisible(data.tab<=10&&endTime!=0);
		changeBtnSkin(isEventOver || !data.canClaim || IsOrLogic);
		
		selectedExchangePiece = null;
	}
	
	public function resetRowData(param:Object):void
	{
		data = param as KBN.EventEntity;
		var piecesObj:Array = component.getUIObject();
		
		var pieceObj:MuseumExchangePieceItem;
		var piece:KBN.EventEntity.EventPiece;
		
		for(var b:int = 0; b < data.pieces.Count; b++)
		{
			piece = data.pieces[b];
			for(var a:int = 0; a < piecesObj.length; a++)
			{
				pieceObj = piecesObj[a];
				if(piece.id == pieceObj.getId)
				{
					pieceObj.resetDisplay(piece);
					//break;
				}
			}		
		}

		if (data.limitQuantity==0) {
			limitDes.SetVisible(false);
			claimBtn.txt = Datas.getArString("fortuna_gamble.win_claimButton");
			claimBtn.OnClick = OnClaim;
		}
		else if(Museum.singleton.ComputeClaimCount(data) > 1 && data.batchReward)
		{
			limitDes.SetVisible(true);
			claimBtn.txt = "(" + data.changedQuantity + "/" + data.limitQuantity +")  " + Datas.getArString("fortuna_gamble.win_claimButton") + "...";
			claimBtn.OnClick = OnMutiClaim;
		}
		else
		{
			limitDes.SetVisible(true);
			claimBtn.txt = "(" + data.changedQuantity + "/" + data.limitQuantity +")  " + Datas.getArString("fortuna_gamble.win_claimButton");
			claimBtn.OnClick = OnClaim;
		}
		
		// claimBtn.txt = "(" + data.changedQuantity + "/" + data.limitQuantity +")  " + Datas.getArString("fortuna_gamble.win_claimButton");
		
		if(data.canClaim)
		{
			iconChangeState.mystyle.normal.background = satisfied;
		}
		else
		{
			iconChangeState.mystyle.normal.background = unsatisfied;
					
		}		
		
		if(data.endTime > GameMain.unixtime())
		{
			isEventOver = false;
		}else if (data.endTime==0) {
			isEventOver = false;
		}
		else
		{
			timeCounter.txt = "0";
			isEventOver = true;
		}
		timeCounter.SetVisible(data.tab<=10&&data.endTime!=0);
		timeTitle.SetVisible(data.tab<=10&&data.endTime!=0);
		changeBtnSkin(isEventOver || !data.canClaim || !canClaimInLogicOr());		
	}
	
	public function OnPeekInsideButton()
	{
		MenuMgr.getInstance().PushMenu("ChestDetail", 
            new HashObject({"ID": data.itemId, "Category": data.itemCategary, "inShop": true}),
            "trans_zoomComp");
	}
	
	public function handleItemAction(action:String, param:Object)
	{
		if (action == "piece_item_changed") {
			if (null != selectedExchangePiece)
				selectedExchangePiece.selected = false;
			selectedExchangePiece = param as MuseumExchangePieceItem;
			changeBtnSkin(isEventOver || !data.canClaim || !canClaimInLogicOr());
		}
	}
	
	private function canClaimInLogicOr():boolean
	{
		if (IsOrLogic)
		{
			return (null != selectedExchangePiece && selectedExchangePiece.IsSatisfied);
		}
		return true;
	}
	
	private function OnClaim(param:Object):void	
	{
		if (data.tab>10||endTime==0) {
			Claim();
		}
		else{
			if(isEventOver || !data.canClaim || !canClaimInLogicOr())
			{
				return;
			}
			if (IsOrLogic) {
				Museum.instance().ClaimEvent(eventId, selectedExchangePiece.getId,1, callBack);
			} else {
				Museum.instance().ClaimEvent(eventId, -1,1, callBack);
			}
		}
		
	}

	private function Claim()
	{
	
		var ok = function(result:HashObject){
			if(result["ok"].Value)
			{
				var itemIdlist:Array =_Global.GetObjectKeys(result["reward"]);
				for(var i=0;i<itemIdlist.length;i++)
				{
					var itemId:int = _Global.INT32(itemIdlist[i]);
					var count:int = _Global.INT32(result["reward"][itemIdlist[i]].Value);
					MyItems.instance().AddItem(itemId,count);
				}
				for(var j=0;j<data.pieces.Count;j++)
				{
					var piece:KBN.EventEntity.EventPiece = data.pieces[j] as KBN.EventEntity.EventPiece;
					//piece.own = piece.own - piece.need; 
					MyItems.instance().AddItem(piece.id,(0 - piece.needNum));
				}
				var num:int=_Global.INT32(result["claimCount"]);
				
				//Reset();
				var museumBuilding:MuseumBuilding = MenuMgr.getInstance().getMenu("MuseumBuilding") as MuseumBuilding;
				if( museumBuilding ){
					// museumBuilding.resetArtifacts();
					Museum.instance().ReSetArtDatas(data.id,num);
					Museum.instance().ArifactPriority();
				}
				callBack();
				// MenuMgr.getInstance().PushMessage(Datas.getArString("Common.actionSucess"));
			}
		};
		
		UnityNet.ClaimArtifact(data.id,ok,null);
		
	}
	private function OnMutiClaim(param:Object):void	
	{
		if(isEventOver || !data.canClaim || !canClaimInLogicOr())
		{
			return;
		}
		var crestId:int = -1;
		if(IsOrLogic) crestId = selectedExchangePiece.getId;
		
		var pushData : HashObject  = new HashObject({"eventName":data.eventName,"tab":data.tab,"endTime":data.endTime,"eventId":eventId,"crestId":crestId,"itemId":data.itemId,
		"exchangeMaxCount":Museum.singleton.ComputeClaimCount(data),"hasClaimedCount":data.changedQuantity,"claimCapCount":data.limitQuantity });
		MenuMgr.getInstance().PushMenu("MutiClaimPopMenu", pushData, "trans_zoomComp");
		return;
	}
	
	private function callBack():void
	{
		eventHandler.handleItemAction(EventDetail.RESET_EVENT_DISPLAY, (data.tab>10||data.endTime==0)?1:0);
		MenuMgr.getInstance().PushMessage(Datas.getArString("Common.actionSucess"));
		MenuMgr.instance.sendNotification(Constant.Notice.OnMutiClaimOK,null);
	}
	
	public function Update()
	{
		if(isEventOver)
		{
			return;
		}
		
		if(!isEventOver)
		{
			var present:long = GameMain.unixtime();
			if(present - oldTime >= 1)
			{
				if(endTime==0||endTime - present >= 0||data.tab>10)
				{
					timeCounter.txt = _Global.timeFormatStr(endTime - present);
					oldTime = present;				
				}
				else
				{
					isEventOver = true;
					changeBtnSkin(isEventOver);
				}
			}		
		}															
	}
	
	private function changeBtnSkin(canntClick:boolean):void	
	{
		if(canntClick)
		{
			claimBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
			claimBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
			claimBtn.SetDisabled(true);
		}
		else
		{
			claimBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
			claimBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
			claimBtn.SetDisabled(false);			
		}
	}
	
}
