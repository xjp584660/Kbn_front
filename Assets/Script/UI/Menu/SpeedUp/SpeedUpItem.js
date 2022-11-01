
class	SpeedUpItem	extends	ListItem{

	public var l_Line:Label;
	public var cntLabel:Label;
	public var sale:Label;
	public var saleComponent:SaleComponent;
	
	private	var	contentData:Hashtable;
	private var item:Hashtable;
	private var itemCount:int;
	private    var    typeId:int;
	
	function Init()
	{
		icon.useTile = true;
		icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		
		btnSelect.OnClick = handleClick;
		
		saleComponent.Init();
	}
	
	public	function	Draw()
	{
		GUI.BeginGroup(rect);
		icon.Draw();
		title.Draw();
		description.Draw();
		btnSelect.Draw();
		cntLabel.Draw();
		sale.Draw();
		saleComponent.Draw();
		l_Line.Draw();
		GUI.EndGroup();
	}
	
	function Update()
	{
		saleComponent.Update();
	}
	
	public function SetRowData(data:Object){
		
		l_Line.setBackground("between line_list_small",TextureType.DECORATION);
		contentData = data as Hashtable;
		itemCount = contentData["count"];
		item = contentData["item"] as Hashtable;
		typeId = contentData["itemType"];
		
		saleComponent.setData(item["price"], item["salePrice"], _Global.INT64(item["startTime"]), _Global.INT64(item["endTime"]), _Global.INT32(item["isShow"]));
		sale.SetVisible(saleComponent.isShowSale);
		
		if(itemCount > 0 )
		{
			conHasItem();
		}else{
			conNoItem();
		}
		
		var id : int = _Global.INT32(contentData["itemId"]);
		if((id >= 4301 && id <= 4308) || id <= 7 || id == 6851 || id == 6852 || id == 4309 || id == 4310 || id == 4311 || id == 4312)
		{
			icon.tile.name = "i" + contentData["itemId"];
		}
		else if(id > 7 && id < 6851)
			icon.tile.name = "i7";// + contentData["itemId"];		
			
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt = contentData["itemName"];
		description.txt = contentData["itemDesc"];		
	}
	
	private	function	useItem(type:int, itemId:int, targetId:int,targetData:QueueItem/*,forceUpdateSeed*/){
//		MenuMgr.getInstance().PopMenu("");
		var okCallback:Function = function(){
			itemCount = MyItems.instance().countForItem(itemId);
			if(itemCount > 0 ){
				conHasItem();
			}else{
				conNoItem();
			}
			contentData["count"] = itemCount;
		};
		SpeedUp.instance().apply(type, itemId, targetId,targetData/*,forceUpdateSeed*/, okCallback);
	}
	
	private	function	conNoItem()
	{
		cntLabel.SetVisible(false);
		saleComponent.SetVisible(true);
		sale.SetVisible(saleComponent.isShowSale);
		
		btnSelect.txt = Datas.getArString("Common.BuyAndUse_button");
		btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
		btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_downnew",TextureType.BUTTON);

		cntLabel.txt = Datas.getArString("Common.Own") + ": " + 0;

	}
	
	private	function	conHasItem()
	{
		cntLabel.SetVisible(true);		
		cntLabel.txt = Datas.getArString("Common.Own") + ": " + itemCount;
		sale.SetVisible(false);
		saleComponent.SetVisible(false);

		btnSelect.txt = Datas.getArString("Common.Use_button");
		btnSelect.mystyle.normal.background = Resources.Load("Textures/UI/button/button_60_blue_normalnew");
		btnSelect.mystyle.active.background = Resources.Load("Textures/UI/button/button_60_blue_downnew");
	}

	private function handleClick(param:Object):void
    {
        if(handlerDelegate)
            handlerDelegate.handleItemAction(Constant.Action.USE_SPEEDUP_ITEM,contentData);
        
        if( !SpeedUp.instance().CanClickSpeedUpItem) return;
        
        var open : boolean = SpeedUp.instance().GetSpeedUpIsOpenHint();
        var price : int = _Global.INT32(item["price"]);
        if(itemCount <= 0 && !open && price >= GameMain.instance().gemsMaxCost())
        {
            MenuMgr.getInstance().PushMenu("SpeedUpDialog", contentData , "trans_zoomComp"); 
			MenuMgr.getInstance().getMenuAndCall("SpeedUpDialog", function(menu : KBNMenu) {
				var SpeedUpDialogmenu:SpeedUpDialog = menu as SpeedUpDialog;
				if(SpeedUpDialogmenu != null)
			   {
				SpeedUpDialogmenu.setAction(UseItemOk);
			   }
			});
        }
        else
        {
            UseItemOk();
        }    
    }
    
    private function UseItemOk()
    {
        if(itemCount > 0)
        {
            useItem(contentData["itemType"], contentData["itemId"], contentData["targetId"],contentData["targetData"]/*,false*/);
        }
        else
        {    
            Shop.instance().swiftBuy(contentData["itemId"], function(){
                itemCount++;
                conHasItem();
                useItem(contentData["itemType"], contentData["itemId"], contentData["targetId"],contentData["targetData"]/*,true*/);
            });            
        }
    }
}
