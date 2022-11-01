class BuffSubMenuItem extends ListItem
{	
	public var sub_icon:Label;
	public var sub_name:Label;
	public var sub_btn:Button;
	public var sub_des:Label;
	public var sub_own:Label;	
	//public var sub_diomand:Label;
	//public var sub_gem:Label;
	public var sub_line:Label;
	//public var sub_salePrice:Label;
	//public var sub_deleteLine:Label;
	public var sub_saleIcon:Label;
	
	public var saleComponent:SaleComponent;
	
	private var data:BuffItem;
	private var buyItemId:int;
	
	function Init()
	{
		sub_icon.Init();
		sub_name.Init();
		sub_btn.Init();
		sub_des.Init();
		sub_own.Init();	
		//sub_diomand.Init();
		//sub_gem.Init();
		sub_line.Init();
		sub_line.setBackground("between line_list_small",TextureType.DECORATION);
		//sub_salePrice.Init();
		//sub_deleteLine.Init();
		sub_saleIcon.Init();
		
		saleComponent.Init();			
	}
	
	private function handleClick():void
	{
		if(data.sub_owned > 0)
		{
			useItem(data.type, data.id);
		}
		else
		{
			buyAndUseItem(data.type, data.id);
		}
	}
	
	private function buyAndUseItem(_type:int, _itemId:int):void
	{
		if(_type == Constant.BuffType.BUFF_TYPE_ANTI_SCOUT)
		{
			var bufferMenu:BuffMenu = MenuMgr.getInstance().getMenu("BuffMenu") as BuffMenu;
			if ( bufferMenu != null )
				bufferMenu.popSubMenu(false);
			Watchtower.instance().useHide();
		}
		else
		{
			buyItemId = _itemId;
			Shop.instance().swiftBuy(_itemId, successBuyAndUseItem);
		}
	}
	
	private function successBuyAndUseItem():void
	{
		useItem(data.type, buyItemId);
	
		if(data.type == Constant.BuffType.BUFF_TYPE_PEASE)
		{
			var bufferMenu:BuffMenu = MenuMgr.getInstance().getMenu("BuffMenu") as BuffMenu;
			if ( bufferMenu != null )
				bufferMenu.popSubMenu(false);
		}

		data.sub_owned += 1;
		
		sub_btn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
		sub_btn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
		sub_btn.txt = Datas.getArString("Common.Use_button");
		sub_own.txt = Datas.getArString("Common.Owned") + ': ' + data.sub_owned;
		//sub_diomand.visible = false;
		//sub_gem.visible = false;
		//sub_salePrice.visible = false;
		//sub_deleteLine.visible = false;
		saleComponent.SetVisible(false);
		sub_saleIcon.visible = false;						
	}
	
	private function useItem(_type:int, _itemId:int):void
	{
		if(_type == Constant.BuffType.BUFF_TYPE_CARMOTCOLLECT)
		{
			var buffType : int = BuffAndAlert.instance().getCarmotCollectBuffType();
			if(buffType == 0)
			{
				MyItems.instance().Use(_itemId);
			}
			else if(buffType == 1)
			{
				if(_itemId == 146 || _itemId == 147)
				{
					ErrorMgr.instance().PushError("",Datas.getArString("Error.err_261"));
				}
				else
				{
					MyItems.instance().Use(_itemId);
				}
			}
			else if(buffType == 2)
			{
				if(_itemId == 144 || _itemId == 145)
				{
					ErrorMgr.instance().PushError("",Datas.getArString("Error.err_261"));
				}
				else
				{
					MyItems.instance().Use(_itemId);
				}
			}
		}
		else
		{
			MyItems.instance().Use(_itemId);
		}
		
		
		if(_type == Constant.BuffType.BUFF_TYPE_PEASE)
		{
			var bufferMenu:BuffMenu = MenuMgr.getInstance().getMenu("BuffMenu") as BuffMenu;
			if ( bufferMenu != null )
				bufferMenu.popSubMenu(false);
		}
	}															
		
	function Draw()
	{		
		GUI.BeginGroup(rect);		
		sub_line.Draw();
		sub_icon.Draw();
		sub_name.Draw();
		sub_btn.Draw();
		sub_des.Draw();
		sub_own.Draw();	
		//sub_diomand.Draw();
		//sub_gem.Draw();
		//sub_salePrice.Draw();
		//sub_deleteLine.Draw();
		saleComponent.Draw();
		
		sub_saleIcon.Draw();
		GUI.EndGroup();			
	}
	
	public function Update()
	{
		saleComponent.Update();
	}
	
	function setData(_data:BuffItem)
	{	
		data = _data;
	
		sub_icon.useTile = true;
		sub_icon.tile = TextureMgr.instance().ElseIconSpt().GetTile(data.sub_icon);
		//sub_icon.tile.name = data.sub_icon;
		
		sub_name.txt = data.sub_name;
		sub_des.txt = data.sub_des;
		
		//sub_salePrice.visible = false;
		//sub_deleteLine.visible = false;
		sub_saleIcon.SetVisible(false);
		
		sub_btn.OnClick = handleClick;
		
		saleComponent.setData(data.sub_price, data.sub_salePrice, data.startTime, data.endTime, data.isShow);			
		
		if(data.type == Constant.BuffType.BUFF_TYPE_ANTI_SCOUT || data.type == Constant.BuffType.BUFF_TYPE_PEASE)
		{
			rect.height = 195;
			sub_des.rect.height = 132;
			sub_btn.rect.y = 100;
			//sub_own.rect.y = 135;
			//sub_diomand.rect.y = 8 + 25;
			//sub_gem.rect.y = 15 + 25;			
			//sub_salePrice.rect.y = 15 + 25;
			//sub_deleteLine.rect.y = 20 + 25;
			//saleComponent.rect.y = 16;
		}
		else
		{
			rect.height = 170;
			sub_des.rect.height = 120;
			sub_btn.rect.y = 75;
			//sub_own.rect.y = 135;
			//sub_diomand.rect.y = 8;
			//sub_gem.rect.y = 15;			
			//sub_salePrice.rect.y = 15;
			//sub_deleteLine.rect.y = 20;
			//saleComponent.rect.y = 16;
		}	

		if(data.sub_owned > 0)
		{
			sub_btn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
			sub_btn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
			sub_btn.txt = Datas.getArString("Common.Use_button");
			sub_own.txt = Datas.getArString("Common.Owned") + ': ' + data.sub_owned;
			//sub_diomand.visible = false;
			//sub_gem.visible = false;	
			
			saleComponent.SetVisible(false);			
		}
		else
		{
			sub_btn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
			sub_btn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_downnew",TextureType.BUTTON);
			sub_btn.txt = Datas.getArString("Common.BuyAndUse_button");
			sub_own.txt = Datas.getArString("Common.Owned") + ': ' + "0";
			//sub_diomand.visible = true;
			//sub_gem.visible = true;
		
			var curTime:long = GameMain.unixtime();
			
			if(saleComponent.isShowSale)
			{
				sub_saleIcon.SetVisible(true);
			}
			
			/*
			if(data.sub_price != data.sub_salePrice)
			{
				sub_gem.rect.x  = sub_diomand.rect.x +  Constant.SalePrice.Text_OffsetX1;
				sub_salePrice.rect.x = sub_diomand.rect.x + Constant.SalePrice.Text_OffsetX2;
				sub_deleteLine.rect.x = sub_diomand.rect.x + Constant.SalePrice.DeLine_OffsetX;
				
				sub_deleteLine.rect.height = Constant.SalePrice.DeLine_Height;
				sub_deleteLine.rect.y = sub_gem.rect.y +  Constant.SalePrice.DeLine_OffsetY;
				
				sub_gem.mystyle.normal.textColor = Color(196.0/255, 196.0/255,196.0/255 , 1.0);
				sub_salePrice.visible = true;
				sub_deleteLine.visible = true;
					

				sub_salePrice.txt = data.sub_salePrice + "";
				
				if(data.sub_price < 10)
				{
					sub_deleteLine.rect.width = Constant.SalePrice.DeLine_Wid1;
				}			
				else if(data.sub_price < 100)
				{
					sub_deleteLine.rect.width = Constant.SalePrice.DeLine_Wid2;	
				}
				else
				{
					sub_deleteLine.rect.width = Constant.SalePrice.DeLine_Wid3;						
				}					
			}
			else
			{
				sub_gem.mystyle.normal.textColor = new Color(1.0, 1.0,1.0 , 1.0);
			}
			*/							
		}
		
		//sub_gem.txt = data.sub_price + "";
		sub_line.rect.y = rect.height - 4;
	}
}
