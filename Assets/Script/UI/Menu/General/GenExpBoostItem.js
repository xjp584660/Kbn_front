
class	GenExpBoostItem	extends	ListItem{

	public var l_Line:Label;
	public var cntLabel:Label;
	//public var price:Label;	 
	//public var salePrice:Label;
	//public var deleteLine:Label;
	public var sale:Label;
	public var saleComponent:SaleComponent;
	
	private var bSale:boolean;
	private var m_data:Hashtable;
	private var itemCount:int;
	private var item:Hashtable;
	
	function Init()
	{
		saleComponent.Init();
		btnSelect.OnClick = handleClick;
		l_Line.setBackground("between line_list_small",TextureType.DECORATION);
	}
	
	private function handleClick():void
	{
		if(itemCount > 0)
		{
			useItem( _Global.INT32(m_data["itemId"]), _Global.INT32(m_data["kid"]));
		}
		else
		{
			Shop.instance().swiftBuy(m_data["itemId"], function()
			{
				SetOwnItemData(1);
				useItem( _Global.INT32(m_data["itemId"]), _Global.INT32(m_data["kid"]));
			});			
		}
	}
	
	public	function	Draw()
	{
		GUI.BeginGroup(rect);
		l_Line.Draw();
		icon.Draw();
		title.Draw();
		description.Draw();
		btnSelect.Draw();
		
		cntLabel.Draw();
		saleComponent.Draw();
		sale.Draw();
		GUI.EndGroup();
	}
	
	public function Update()
	{
		saleComponent.Update();
	}
	
	public function SetRowData(data:Object)
	{	
		m_data =  data as Hashtable;

		icon.useTile = true;
		var itemId : int = _Global.INT32(m_data["itemId"]);
		icon.tile = TextureMgr.instance().LoadTileOfItem(itemId);
		
		//var iconName : String = null;
		//	- by cwu
		//		2014-06-04
		//if(_Global.INT32(m_data["itemId"]) >= 2201)
		//	iconName = "i363";
		//else
		//	iconName = "i"+ m_data["itemId"];	
		//icon.tile = TextureMgr.instance().GeneralSpt().GetTile(iconName);

		title.txt = m_data["itemName"];
		description.txt = m_data["desc"];
		itemCount = _Global.INT32(m_data["count"]);
		item = m_data["item"] as Hashtable;

		saleComponent.setData(item["price"], item["salePrice"], _Global.INT64(item["startTime"]), _Global.INT64(item["endTime"]), _Global.INT32(item["isShow"]));
		sale.SetVisible(saleComponent.isShowSale);
		
		SetOwnItemData(itemCount);

	}
	
	private function SetOwnItemData(_itemCount:int):void
	{
		if(_itemCount > 0)
		{
			cntLabel.txt = Datas.getArString("Common.Own") + ": " +  _itemCount;			
			btnSelect.txt = Datas.getArString("Common.Use_button");
			btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
			btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
						
			saleComponent.SetVisible(false);
			sale.SetVisible(false);
		}
		else
		{
			cntLabel.txt = Datas.getArString("Common.Own") + ": " +  0;
			btnSelect.txt = Datas.getArString("Common.BuyAndUse_button");
			btnSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
			btnSelect.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_downnew",TextureType.BUTTON);
		}
	}
	
	
	private	function	useItem(itemId:int, knightId:int ){
		
		General.instance().useExpBoost(itemId, knightId, function(){
			var menuMgr:MenuMgr = MenuMgr.getInstance();
			menuMgr.PopMenu("");
			var pushStr:String = Datas.getArString("ToastMsg.General_AddExpOk").Replace("%1$s", title.txt);
			menuMgr.PushMessage(pushStr);
			
			GearManager.Instance().GearKnights.GetKnight(knightId).Parse();
			
			var generalMenu:GeneralMenu = menuMgr.getMenu("GeneralMenu") as GeneralMenu;
			if( generalMenu ){
				generalMenu.generalTab.setListData(General.instance().getGenerals());
				generalMenu.generalTab.generalList.Update();
			}
			
			var marchMenu:SelectKnight = menuMgr.getMenu("SelectKnight") as SelectKnight;
			if( marchMenu ){
				marchMenu.updateGeneralExp();
			}
			
		},function(errMsg : String, errCode : String)
		{
			ErrorMgr.instance().PushError("", Datas.getArString( String.Format( "Error.err_{0}", errCode ) ), false, Datas.getArString("Common.OK_Button")
				,function()
				{
					var menuMgr1:MenuMgr = MenuMgr.getInstance();
					menuMgr1.PopMenu("");
		//			var pushStr1:String = Datas.getArString("ToastMsg.General_AddExpOk").Replace("%1$s", title.txt);
		//			menuMgr1.PushMessage(pushStr1);
					
					GearManager.Instance().GearKnights.GetKnight(knightId).Parse();
					
					var generalMenu1:GeneralMenu = menuMgr1.getMenu("GeneralMenu") as GeneralMenu;
					if( generalMenu1 ){
						generalMenu1.generalTab.setListData(General.instance().getGenerals());
						generalMenu1.generalTab.generalList.Update();
					}
					
					var marchMenu1:SelectKnight = menuMgr1.getMenu("SelectKnight") as SelectKnight;
					if( marchMenu1 )
					{
						marchMenu1.updateGeneralExp();
					}
					
				}
			);
		}
		
		);
	}
}
