class TroopItem extends FullClickItem
{
	protected var troopInfo:Barracks.TroopInfo;
	public  var owned:Label;
	public  var seperateLine:Label;
	//public  var lockIcon:SimpleLabel;
	public var unitIcon:UnitIcon;
	public var l_Sale:Label;
	public var blackFrame:Label;

	public function SetRowData(data:Object)
	{
		troopInfo = data as Barracks.TroopInfo;
//		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		//title.SetNormalTxtColor(FontColor.Title);
		title.txt = troopInfo.troopName;
		description.txt = troopInfo.description;
		owned.txt =  Datas.getArString("Common.Owned") +": " + _Global.NumSimlify(troopInfo.owned);
		btnSelect.clickParam = troopInfo;
		btnSelect.OnClick = function(param:Object)
		{
		//	MenuMgr.getInstance().PushMenu();
//			BarrackMenu.instance.ClickTroop(param);
			var barrackMenu:BarrackMenu = MenuMgr.getInstance().getMenu("BarrackMenu") as BarrackMenu;
			if( barrackMenu ) {
				barrackMenu.ClickTroop(param);
			}
		};
//		var iconPath:String = "ui_"+ data.typeId;
//	//	icon.mystyle.normal.background = TextureMgr.instance().LoadTexture(iconPath, TextureType.ICON_UNIT);//Resources.Load(iconPath); 
//		icon.tile.spt = TextureMgr.instance().UnitSpt();
//		icon.tile.name = iconPath;
//		
//		level.Rate = troopInfo.level;
//		l_type.TileName = "troop_type"+ troopInfo.actType;
//		level.rect.x = 50 + (70 - level.starWidth*troopInfo.level)/2;
		unitIcon.UnitId = troopInfo.typeId;
		unitIcon.UnitType = troopInfo.actType;
		unitIcon.UnitLevel = troopInfo.level;
		unitIcon.UnitLock = troopInfo.bLocked;
		//_Global.Log("ID : " + troopInfo.typeId + "  Lock : " + troopInfo.bLocked + "!!!!!!!!!!!!!");
		//Sale
		l_Sale.SetVisible(GameMain.instance().getTroopSaleDataFromSeed(Constant.TroopType.UNITS,troopInfo.typeId)!=null);
		
		blackFrame.Init();
		blackFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("backFrame",TextureType.FTE);
		
		btnDefault.clickParam = troopInfo;
		btnDefault.rect = new Rect(0,0,blackFrame.rect.width,blackFrame.rect.height);
		btnDefault.OnClick = btnSelect.OnClick;
	}
	
	public function DrawItem()
	{
		super.DrawItem();
//		super.Draw();
//		GUI.BeginGroup(rect);
		title.Draw();
		blackFrame.Draw();
//		if( troopInfo.bLocked )
//		{	
//			lockIcon.Draw();
//		}
		unitIcon.Draw();
		l_Sale.Draw();	
		owned.Draw();
		description.Draw();
		btnSelect.Draw();
		
//		GUI.EndGroup();
//		
//	   	return -1;
	}
	
	public function UpdateData()
	{
		owned.txt =  Datas.getArString("Common.Owned") +": " + _Global.NumSimlify(troopInfo.owned);
	}

	public function Init()
	{	
		super.Init();
//		icon.useTile = true;
////		icon.tile.spt = TextureMgr.instance().UnitSpt();
//		l_type.useTile = true;
////		l_type.drawTileByGraphics = true;
//		l_type.tile.spt = TextureMgr.instance().UnitSpt();
//		level.Text = "";
		unitIcon.Init();
//		var texMgr : TextureMgr = TextureMgr.instance();
//		var iconSpt : TileSprite = texMgr.IconSpt();
//		lockIcon.tile = iconSpt.GetTile("icon_lock2");//setBackground("icon_lock2", TextureType.ICON);
//		lockIcon.useTile = true;
		l_Sale.tile = TextureMgr.instance().ItemSpt().GetTile("sale_king");
		l_Sale.useTile = true;
		//l_Sale.tile.name = "sale_king";
	}
	
	public function SetScrollPos(pos:int, listHeight:int)
	{
		super.SetScrollPos(pos, listHeight);
//		scrollPos = pos;
		if(rect.y - pos < 0 || rect.y+rect.height - pos > listHeight)
		{
			unitIcon.DrawTileByGraphics = false;
		}
		else
		{
			unitIcon.DrawTileByGraphics = true;
		}				
	}
}

