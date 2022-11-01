class MuseumExchangePieceItem extends UIObject //implements System.IDisposable
{
	private var pieceId:int;
	private var ownNum:int;
	
	public var toggleButton:ToggleButton;
	public var areaButton:SimpleButton;
	
	public var piecePic:ItemPic;
	public var pieceDes:Label;
	public var pieceName:Label;
	
	public var numDes:Label;
	public var iconState:Label;
	
	public var satisfied:Texture2D;
	public var unsatisfied:Texture2D;
	
	public var line:Label;
	
	public var picPosLeft:int;
	public var labelPosLeft:int;
	public var statePosLeft:int;
	public var toggleMarginRight:int;
	
	public var handleDelegate:IEventHandler;
	
	public function get getId():int
	{
		return pieceId;
	}
	
	public function get IsSatisfied():boolean
	{
		return (satisfied == iconState.mystyle.normal.background);
	}
	
	function Init()
	{
		toggleButton.Init();
		
		areaButton.Init();
		areaButton.rect = new Rect(0, 0, rect.width, rect.height);
		
		piecePic.Init();
		iconState.Init();
		pieceDes.Init();
		pieceName.Init();
		
		numDes.Init();
		
		line.Init();
		
		setToggleVisible(false);
	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		
		if (Event.current.type == EventType.Repaint)
			toggleButton.Draw();
		areaButton.Draw();
		
		piecePic.Draw();
		iconState.Draw();
		pieceDes.Draw();
		pieceName.Draw();
		
		numDes.Draw();
		
		line.Draw();
		GUI.EndGroup();
	}	
	
	public function setData(param:Object):void
	{
		var data:KBN.EventEntity.EventPiece = param as KBN.EventEntity.EventPiece;
		
		pieceId = data.id;
		ownNum = data.ownNum;
		
		//piecePic.useTile = true;
		//piecePic.tile.spt = TextureMgr.instance().ElseIconSpt();
		//piecePic.tile.name = data.texturePath;
		piecePic.SetId(pieceId);
		
		if(data.categary == MyItems.Category.MystryChest)
		{ 
			pieceDes.txt = MystryChest.instance().GetChestDesc(pieceId);
			pieceName.txt = MystryChest.instance().GetChestName(pieceId);
		}
		else if(data.categary == MyItems.Category.LevelChest)
		{
			pieceDes.txt = Datas.getArString("Common.LevelChestDesc", [MystryChest.instance().GetLevelOfChest(pieceId)]);
			pieceName.txt = Datas.getArString("Common.LevelChestName", [MystryChest.instance().GetLevelOfChest(pieceId)]);			
		}
		else
		{
			pieceDes.txt = Datas.getArString("itemDesc."+ "i"+ pieceId);
			pieceName.txt = Datas.getArString("itemName."+"i" + pieceId);
		}
		
		pieceDes.txt = Datas.getArString("itemDesc."+ "i"+ pieceId);
		pieceName.txt = Datas.getArString("itemName."+"i" + pieceId);
		
		if(data.ownNum >= data.needNum)
		{
			numDes.txt = (Datas.getArString("Common.Owned") as String) + ": " + "<color=white>" + data.ownNum + "</color>" + "/" + data.needNum;
		}
		else
		{
			numDes.txt = (Datas.getArString("Common.Owned") as String) + ": " + "<color=#CF6548>" + data.ownNum + "</color>" + "/" + data.needNum;
		}
		
		if(data.needNum <= data.ownNum)
		{
			iconState.mystyle.normal.background = satisfied;
		}
		else
		{
			iconState.mystyle.normal.background = unsatisfied;
		}
		
	}
	
	public function resetDisplay(param:Object):void
	{
		var data:KBN.EventEntity.EventPiece = param as KBN.EventEntity.EventPiece;
		if(data.ownNum != ownNum)
		{

			if(data.ownNum >= data.needNum)
			{
				numDes.txt = (Datas.getArString("Common.Owned") as String) + ": " + "<color=white>" + data.ownNum + "</color>" + "/" + data.needNum;
			}
			else
			{
				numDes.txt = (Datas.getArString("Common.Owned") as String) + ": " + "<color=CF6548>" + data.ownNum + "</color>" + "/" + data.needNum;
			}
				
		}
		
		if(data.needNum <= data.ownNum)
		{
			iconState.mystyle.normal.background = satisfied;
		}
		else
		{
			iconState.mystyle.normal.background = unsatisfied;			
		}		
	}	
	
	public function setToggleVisible(visible:boolean):void{
		toggleButton.SetVisible(visible);
		areaButton.SetVisible(visible);
		
		var deltaX:float = toggleMarginRight + toggleButton.rect.width;
		iconState.rect.x = statePosLeft + (visible ? deltaX : 0);
		piecePic.rect.x = picPosLeft + (visible ? deltaX : 0);
		pieceDes.rect.x = labelPosLeft + (visible ? deltaX : 0);
		pieceName.rect.x = labelPosLeft + (visible ? deltaX : 0);
		toggleButton.valueChangedFunc = toggleValueChangedFunc;
		areaButton.OnClick = onAreaButtonClicked;
	}
	
	private function onAreaButtonClicked():void {
		if (!toggleButton.selected)
			toggleButton.selected = true;
//		toggleValueChangedFunc(true);
	}
	
	private function toggleValueChangedFunc(val : boolean):void{
		if (val && null != handleDelegate) {
			handleDelegate.handleItemAction("piece_item_changed", this);
		}
	}
	
	public function set selected(value:boolean) {
		toggleButton.selected = value;
	}
	
	public function get selected():boolean {
		return toggleButton.selected;
	}
}