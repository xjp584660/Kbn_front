
class CityRequirement extends ListItem
{
	public var requirement:City.BuildRequirement;
	public var satisfied:Label;
	public var itemName:Label;
	public var money_priceObj:SaleComponent; 
	public var saleIcon:Label;
	public var lbX : SimpleLabel;

	public var owned:Label;
	private var itemNum:int;
	private var isUIVisible:boolean = true;
	function Init()
	{
		icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		icon.useTile = true;
		icon.drawTileByGraphics = true;
		btnSelect.txt = Datas.getArString("Common.Buy");
		
		if(money_priceObj != null)
		{
			money_priceObj.Init();
		}
		
		if(itemName != null)
		{
			itemName.Init();
		}
		
	}
	function Draw()
	{
		if(!isUIVisible)
			return;
		
		GUI.BeginGroup(rect);
		title.Draw();
		if(requirement.needItem)
		{
			icon.Draw();
			itemName.Draw(); 
			saleIcon.Draw();
			if( itemNum == 0)
			{
				money_priceObj.Draw();
				btnSelect.Draw();
			}	
			
			owned.Draw();
			lbX.Draw();
		}	

		description.Draw();

		satisfied.Draw();		
		
		GUI.EndGroup();
	}
	
	public function SetRowData(data:Object)
	{
		requirement = data;
		UpdateData();
	}
	
	public function UpdateData()
	{
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt = requirement.title;
		if(requirement.isMet)
		{
			satisfied.Background = TextureMgr.instance().LoadTexture("icon_satisfactory",TextureType.ICON);
			description.txt = Datas.getArString("PlayerInfo.ReqMet");
		}	
		else
		{	 
			satisfied.Background = TextureMgr.instance().LoadTexture("icon_unsatisfactory",TextureType.ICON);
			description.txt = Datas.getArString("PlayerInfo.ReqNotMet");
		}
			
		if(requirement.needItem)
		{
			icon.TileName = "i" + requirement.need;	
			btnSelect.OnClick = BuyCityItem;
			btnSelect.changeToGreenNew();
			itemName.txt = Datas.getArString("itemName.i" + requirement.need);
			description.txt = Datas.getArString("itemDesc.i" + requirement.need);
			
			var minWidth : float = 0.0f;
			var maxWidth : float = 0.0f;
			var spaceWidth : float = 0.0f;
			itemName.SetFont();
			itemName.mystyle.CalcMinMaxWidth(GUIContent(itemName.txt), minWidth, maxWidth);
			//lbX = new SimpleLabel();
			var xPos : float = itemName.rect.left + minWidth + 10;
			lbX.rect.x = xPos;
			lbX.txt = "x";
			lbX.mystyle.CalcMinMaxWidth(GUIContent(lbX.txt), minWidth, maxWidth);
			owned.rect.x = lbX.rect.x + minWidth + 10;

			var obj:HashObject = (Datas.instance().itemlist())["i" + requirement.need];
			var category:int = _Global.INT32(obj["category"]);
						 
			var item:Hashtable = Shop.instance().getItem(category, requirement.need);
			money_priceObj.setData(item["price"], item["salePrice"], _Global.INT64(item["startTime"]), _Global.INT64(item["endTime"]), _Global.INT32(item["isShow"]));
			
			itemNum = MyItems.instance().countForItem(requirement.need);
			//owned.txt = Datas.getArString("Common.Owned") + ": " + itemNum;
			owned.txt = itemNum.ToString();
			if ( itemNum == 0 )
			{
				owned.SetNormalTxtColor(FontColor.Red);
//				owned.mystyle.normal.textColor = new UnityEngine.Color(1.0f, 0.0f, 0.0f, 1.0f);
			}
			else
			{
				owned.SetNormalTxtColor(FontColor.Button_White);
//				owned.mystyle.normal.textColor = new UnityEngine.Color(1.0f, 1.0f, 1.0f, 1.0f);
			}
			
			if(money_priceObj.isShowSale)
			{
				saleIcon.SetVisible(true);
			}
			else
			{
				saleIcon.SetVisible(false);
			}
			
			if(requirement.isMet)
			{
				money_priceObj.SetVisible(false);
				btnSelect.SetVisible(false);
				saleIcon.SetVisible(false);
			}
			else
			{
				money_priceObj.SetVisible(true);
				btnSelect.SetVisible(true);	
				
				var isItemBuyable:boolean = Shop.instance().itemExistInShop(category, requirement.need);	
				if(!isItemBuyable)
				{
					money_priceObj.SetVisible(false);
					btnSelect.SetVisible(false);
					saleIcon.SetVisible(false);
					title.txt = Datas.getArString("PlayerInfo.ObtainDeed");;
				}			
			}
			
			/*
			var shoplist:Array = Shop.instance().dataGeneral;		
			for(var i:int = 0; i<shoplist.length; i++)
			{
				var item:Hashtable = shoplist[i]  as Hashtable;
				if(item["ID"] == requirement.need)
				{
					btnSelect.changeToBlue();
					btnSelect.OnClick = BuyCityItem;
					money_priceObj.SetVisible(true);
				}
			}*/
		}	
		
		
	}
	
	function BuyCityItem()
	{
		var okFunc:System.Action = function()
		{
			CityQueue.instance().CheckNewCtiyRequirement();
			UpdateData();
			MenuMgr.getInstance().sendNotification(Constant.Notice.NEWCITY_REQUIREMENT, null);
		};
		Shop.instance().swiftBuy(requirement.need, okFunc);
	}	
	
	function Update()
	{
		money_priceObj.Update();
	}
	
	function SetVisible(param:boolean):void
	{
		isUIVisible = param;
	}

}
