
class InventoryMenu extends ComposedMenu implements IEventHandler
{
	// Use this for initialization
	var pageScrList : ScrollList;
	public var inventoryPageItem : InventoryPageItem;
	var inventoryPageItems : System.Collections.Generic.List.<ListItem>;
	var pageDatas : Array;
	
	var generalList: ScrollList; 
	var speedList: ScrollList;
	var attackList: ScrollList;
	var productionList: ScrollList;
	var chestList: ScrollList;
	var buffList: ScrollList;
	var troopsList: ScrollList;
	var gearList: ScrollList;
	var heroList: ScrollList;
	var exchangeList: ScrollList;
	private var m_inventoryList : ScrollList[];
	
	var generalShopList: ScrollList; 
	var speedShopList: ScrollList;
	var attackShopList: ScrollList;
	var productShopList: ScrollList;
	var chestShopList: ScrollList;
	var buffShopList: ScrollList;
	var troopsShopList: ScrollList;
	var gearShopList: ScrollList;
	var heroShopList: ScrollList;
	var exchangeShopList: ScrollList;
	private var m_shopList : ScrollList[];
	
	
	private var curList:ScrollList;
	
	public var itemTemplate: ListItem;
	public var myItemTemplate:ListItem;
	public var listbar: ToolBar;
	public var itemShop:ToolBar;
	private var purchasedId:int;
	var    bHaveData:boolean;
	private var selectedList:int = 0;
	private var selectedMyItemList:int = 0;
	private var selectedTitle:int = 0;
	public  var line:SimpleLabel;
	private var shopOk:boolean;
	private var itemcost:int;
	
	public var emptyBack:Label;
 	public var empty:Label;
 	
 	public var  l_discount1:Label;
 	public var  l_discount2:Label;
 	public var  l_discount3:Label;
 	public var  l_discount4:Label;
 	public var  l_discount5:Label;
 	public var l_pageLeft:Button;
 	public var l_pageRight:Button;
 	private var isRate:boolean = false;

	private var selectedIdInShop:Array;
	private var selectedIdInPack:Array;
	private var m_waitingLabel : LoadingLabelImpl;
	private var m_selectedItemId : int = -1;
	
	@SerializeField
	private var m_hightAnimName : String;
	
	function InitTabPage()
	{	
		var strSpeed:String = Datas.getArString("Common.Speedup");
		var strCombat:String = Datas.getArString("Common.Combat");
		var strResource:String = Datas.getArString("Common.Resources");
		var strGeneral:String = Datas.getArString("Common.Misc");
		var strChest:String = Datas.getArString("Common.Chest");
		var strBuff:String = Datas.getArString("Common.Buff");
		var strTroops:String = Datas.getArString("Common.Troops");
		var strGear:String = Datas.getArString("Common.Gear");
		var strHero:String = Datas.getArString("Common.Hero");
		var strExchange:String = Datas.getArString("Common.Exchange");
		
		l_pageLeft.OnClick = OnPageLeft;
		l_pageRight.OnClick = OnPageRight;
		
		listbar.Init();
		listbar.toolbarStrings = [strGeneral, strSpeed, strCombat,strResource, strChest];
		
		pageScrList.itemDelegate = this;
		pageDatas = new Array
				([
					{
						"shopType" : 0,
						"tabName" : strGeneral
					},
					{
						"shopType" : 1,
						"tabName" : strSpeed
					},
					{
						"shopType" : 2,
						"tabName" : strCombat
					},
					{
						"shopType" : 3,
						"tabName" : strResource
					},
					{
						"shopType" : 4,
						"tabName" : strChest
					},
					{
						"shopType" : 5,
						"tabName" : strBuff
					},
					{
						"shopType" : 6,
						"tabName" : strTroops
					},
					{
						"shopType" : 7,
						"tabName" : strGear
					},
					{
						"shopType" : 8,
						"tabName" : strHero
					},
					{
						"shopType" : 9,
						"tabName" : strExchange
					}
				]);	
	
		pageScrList.m_nOffSet = 0f;
		inventoryPageItem.Init();
		pageScrList.Init(inventoryPageItem);	
		pageScrList.SetData(pageDatas);
		
		inventoryPageItems = pageScrList.GetItemLists();
		_timeStartedLerping = Time.time;
		SetPageListFromAndToPos(0f, MyItems.instance().GetMemoryTabPos());
	}
	
	private var pagePosMax : float = -722f;
	function OnPageLeft()
	{
		SetPageListFromAndToPos(pageScrList.m_nOffSet, 0f);
	}
	
	function OnPageRight()
	{
		SetPageListFromAndToPos(pageScrList.m_nOffSet, pagePosMax);
	}
	
	function SetMyItemPageTab(pageType : int)
	{	
		if ( pageType >= m_inventoryList.Length || pageType < 0 )
			return;
			
		curList = m_inventoryList[pageType];
		
		for(var i : int = 0; i < inventoryPageItems.Count;++i)
		{
			var pageItem : InventoryPageItem = inventoryPageItems[i] as InventoryPageItem;
			pageItem.SetPageTab(pageType);
		}
	}
	
	function Init()
	{
		super.Init();
		m_waitingLabel = null;
		m_selectedItemId = -1;
		
		InitTabPage();

		var inventoryList : System.Collections.Generic.List.<ScrollList> = new System.Collections.Generic.List.<ScrollList>();
		generalList.itemDelegate = this;	inventoryList.Add(generalList);
		speedList.itemDelegate = this;		inventoryList.Add(speedList);
		attackList.itemDelegate = this;		inventoryList.Add(attackList);
		productionList.itemDelegate = this;	inventoryList.Add(productionList);
		chestList.itemDelegate = this;		inventoryList.Add(chestList);
		buffList.itemDelegate = this;		inventoryList.Add(buffList);
		troopsList.itemDelegate = this;		inventoryList.Add(troopsList);
		gearList.itemDelegate = this;		inventoryList.Add(gearList);
		heroList.itemDelegate = this;		inventoryList.Add(heroList);
		exchangeList.itemDelegate = this;	inventoryList.Add(exchangeList);
		m_inventoryList = inventoryList.ToArray();

		inventoryList.Clear();
		generalShopList.itemDelegate = this;inventoryList.Add(generalShopList);
		speedShopList.itemDelegate = this;	inventoryList.Add(speedShopList);
		attackShopList.itemDelegate = this;	inventoryList.Add(attackShopList);
		productShopList.itemDelegate = this;inventoryList.Add(productShopList);
		chestShopList.itemDelegate = this;	inventoryList.Add(chestShopList);
		buffShopList.itemDelegate = this;	inventoryList.Add(buffShopList);
		troopsShopList.itemDelegate = this;	inventoryList.Add(troopsShopList);
		gearShopList.itemDelegate = this;	inventoryList.Add(gearShopList);
		heroShopList.itemDelegate = this;	inventoryList.Add(heroShopList);
		exchangeShopList.itemDelegate = this;	inventoryList.Add(exchangeShopList);
		m_shopList = inventoryList.ToArray();

		selectedIdInShop = new Array();
		selectedIdInPack = new Array();		
		
		var shop:String = Datas.getArString("MainChrome.ShopTab_Title");
		var item:String = Datas.getArString("MainChrome.MyItemsTab_Title");
		itemShop.Init();
		itemShop.toolbarStrings = [shop, item];
		itemShop.indexChangedFunc = function(selIdx : int)
		{
			SetInvertoryMemoryTabPage(selIdx);
			priv_stopFlashAnim();
		};

		listbar.indexChangedFunc = SelectTab;
		var shopInstance : Shop = Shop.instance();
		selectedList = shopInstance.GetMemoryTabPage();
		SelectTab(selectedList);
		selectedMyItemList = MyItems.instance().GetMemoryTabPage();
		SetMyItemPageTab(selectedMyItemList);
		
		empty.txt = Datas.getArString("Common.NoItem");
		title.txt = Datas.getArString("Common.Inventory");

		l_discount1.tile = TextureMgr.instance().ElseIconSpt().GetTile("sale_king");
		l_discount1.useTile = true;
		l_discount1.drawTileByGraphics = true;
		l_discount2.tile = TextureMgr.instance().ElseIconSpt().GetTile("sale_king");
		l_discount2.useTile = true;
		l_discount2.drawTileByGraphics = true;
		l_discount3.tile = TextureMgr.instance().ElseIconSpt().GetTile("sale_king");
		l_discount3.useTile = true;
		l_discount3.drawTileByGraphics = true;
		l_discount4.tile = TextureMgr.instance().ElseIconSpt().GetTile("sale_king");
		l_discount4.useTile = true;
		l_discount4.drawTileByGraphics = true;
		l_discount5.tile = TextureMgr.instance().ElseIconSpt().GetTile("sale_king");
		l_discount5.useTile = true;	
		l_discount5.drawTileByGraphics = true;
		
		l_discount1.SetVisible(false);
		l_discount2.SetVisible(false);
		l_discount3.SetVisible(false);
		l_discount4.SetVisible(false);
		l_discount5.SetVisible(false);	
		
		isRate = false;
	
		if (KBN._Global.IsLargeResolution ()) 
		{
			SetScrollistRectY(210);		
		}
		else
		{
			SetScrollistRectY(203);
		}
	}

	private function SetScrollistRectY(rectY : int)
	{
		var i : int;
		for(i = 0;i < m_inventoryList.Length;++i)
		{
			m_inventoryList[i].rect.y = rectY;
		}

		for(i = 0; i < m_shopList.Length;++i)
		{
			m_shopList[i].rect.y = rectY;
		}
	}
	
	public  function SelectTab(index:int)
	{
		if(selectedTab == 0) 
		{
			Shop.instance().SetMemoryTabPage(index);
		}
	}
	
	public var timeTakenDuringLerp : float = 0.02f;
	var _isLerping : boolean = false;
	var _timeStartedLerping : float;
	// Update is called once per frame
	function Update () 
	{
		super.Update();
		
		pageScrList.Update();
		
		if ( m_waitingLabel != null )
			m_waitingLabel.Update();

		if(selectedTab == 1)
		{
			UpdateItemList();
		}
		else if(selectedTab == 0)
		{
			UpdateShopList();
		}
		
		UpdatePageListPos();		
	} 
	
	private var pagePosFrom : float;
	private var pagePosTo : float;
	private function SetPageListFromAndToPos(from : float, to : float)
	{			
		pagePosFrom = from;
		pagePosTo = to;
		_isLerping = true;
	}
	
	private function UpdatePageListPos()
	{
		if(_isLerping)
		{
			var timeSinceStarted : float = Time.time - _timeStartedLerping;
            var percentageComplete : float = timeSinceStarted / timeTakenDuringLerp;
            //pageScrList.m_nOffSet = Mathf.Lerp(0f,MyItems.instance().GetMemoryTabPos(),percentageComplete);
            pageScrList.m_nOffSet = Mathf.Lerp(pagePosFrom,pagePosTo,percentageComplete);
            
            if(percentageComplete >= 1.0f)
            {
            	_isLerping = false;
            	pageScrList.m_nOffSet = pagePosTo;
            }	
		}	
	}

	function DrawItem() 
	{
		if ( m_waitingLabel != null && !IsPaint() )
			return;
			
		if(selectedTab == 1)
		{
			listbar.SetVisible(false);
			pageScrList.SetVisible(true);
 			SetMyItemPageTab(selectedMyItemList);
 			DrawItemList();		
 		}
 		else if(selectedTab == 0)
 		{
 			listbar.SetVisible(true);
 			pageScrList.SetVisible(false);
 			selectedList = listbar.Draw();			
 			DrawShopList();		
 		}
 		
 		if ( m_waitingLabel != null )
 			m_waitingLabel.Draw();
	}		
			
	public function addSelectedId(_isInShop:boolean, _id:int):void
	{	
		if(_isInShop)
		{	
			if(!_Global.IsValueInArray(selectedIdInShop, _id))
			{
				selectedIdInShop.Push(_id);
			}	
		}
		else
		{
			if(!_Global.IsValueInArray(selectedIdInPack, _id))
			{
				selectedIdInPack.Push(_id);
			}	
		}
	}
	
	public function delSelectedId(_isInShop:boolean, _id:int):void
	{
		if(_isInShop)
		{	
			if(_Global.IsValueInArray(selectedIdInShop, _id))
			{
				selectedIdInShop.Remove(_id);
			}	
		}
		else
		{
			if(_Global.IsValueInArray(selectedIdInPack, _id))
			{
				selectedIdInPack.Remove(_id);
			}	
		}
	}
	
	public function hasSelectedId(_isInShop:boolean, _id:int):boolean
	{
		if(_isInShop)
		{			
			return _Global.IsValueInArray(selectedIdInShop, _id);
		}
		else
		{
			return _Global.IsValueInArray(selectedIdInPack, _id);
		}	
	}
	
	function UpdateItemList()
	{
		curList.Update();	
		if(pageScrList.m_nOffSet == 0)
		{
			l_pageLeft.SetVisible(false);
			l_pageRight.SetVisible(true);
		}	
		else if(pageScrList.m_nOffSet == pagePosMax)
		{
			l_pageLeft.SetVisible(true);
			l_pageRight.SetVisible(false);
		}	
		else
		{
			l_pageLeft.SetVisible(true);
			l_pageRight.SetVisible(true);
		}
	}
	
	function UpdateShopList()
	{
		if ( selectedList >= m_shopList.Length || selectedList < 0 )
			return;
		m_shopList[selectedList].Update();
	}

	function UpdateInventoryItemCount()
	{
		//shop tab
		for ( var i : int = 0; i != m_shopList.Length; ++i )
			m_shopList[i].UpdateData();
		//myitems tab
		for ( i = 0; i != m_inventoryList.Length; ++i )
			m_inventoryList[i].UpdateData();
	}
	function DrawShopList()
	{
		//l_discount1.tile.spt.edge = 0;
		l_discount1.Draw();
		l_discount2.Draw();
		l_discount3.Draw();
		l_discount4.Draw();
		l_discount5.Draw();	
		//l_discount1.tile.spt.edge = 2;
		if ( 0 <= selectedList && selectedList < m_shopList.Length )
			m_shopList[selectedList].Draw();		
	}
	
	function DrawItemList()
	{
		if(curList.GetDataLength() > 0)
			curList.Draw();
		else
		{
			emptyBack.Draw();
			empty.Draw();
		}	
		
		pageScrList.Draw();

		l_pageLeft.Draw();
		l_pageRight.Draw();
	}
	
	function DrawBackground()
	{
		super.DrawBackground();
	}
	
	public function SetInvertoryMemoryTabPage(page : int) : void 
	{
		PlayerPrefs.SetInt(Constant.ShopAndMyItemsTabMemory.InventoryTabMemory, page);
	}

	public function GetInvertoryMemoryTabPage() : int
	{
		if(PlayerPrefs.HasKey(Constant.ShopAndMyItemsTabMemory.InventoryTabMemory))
		{
			var page : int = PlayerPrefs.GetInt(Constant.ShopAndMyItemsTabMemory.InventoryTabMemory);
			return page;
		}

		return 0;
	}
	
	public function OnPush(param:Object)
	{		
		MyItems.instance().ReseaseNewItemList();
		
		MyItems.instance().ResortShopList();
		for ( var i : int = 0; i != m_inventoryList.Length; ++i )
		{
			m_inventoryList[i].Init(myItemTemplate);
			m_inventoryList[i].Clear();
		}

		for ( i = 0; i != m_shopList.Length; ++i )
			m_shopList[i].Init(itemTemplate);

		super.OnPush(param);
		var paramSelectedTab : int = 0;
		var paramSelectedList : int = selectedList;

		if(param)
		{
			if((param as Hashtable)["selectedTab"] != null)
			{
				paramSelectedTab = _Global.INT32((param as Hashtable)["selectedTab"]);
			}
			else
			{
				paramSelectedTab = GetInvertoryMemoryTabPage();
			}

			if((param as Hashtable)["selectedList"] != null )
			{
				//SelectTab(_Global.INT32(param["selectedList"]));
				paramSelectedList = _Global.INT32((param as Hashtable)["selectedList"]);
			}
			if((param as Hashtable)["selectedItem"] != null )
			{
				m_selectedItemId = _Global.INT32((param as Hashtable)["selectedItem"]);
			}
			if((param as Hashtable)["isRate"] != null )
			{
				isRate = _Global.GetBoolean((param as Hashtable)["isRate"]);
			}
		}
		else
		{
			paramSelectedTab = GetInvertoryMemoryTabPage();
		}

		if ( paramSelectedTab >= itemShop.toolbarStrings.Length )
			paramSelectedTab = itemShop.selectedIndex;
		itemShop.selectedIndex = paramSelectedTab;
		if ( paramSelectedList >= listbar.toolbarStrings.Length )
			paramSelectedList = listbar.selectedIndex;
		listbar.selectedIndex = paramSelectedList;
		SelectTab(paramSelectedList);

		if(Shop.instance().updateShop)
		{
			Shop.instance().getShopData(priv_getShopAndSetMystryChestData);
		}
		else
		{
			priv_getShopAndSetMystryChestData();
		}
		
		menuHead.rect.height = 150;
		
		menuHead.setTitle( Datas.getArString("Common.Inventory") ) ;
	}

	public function OnPushOver() : void
	{
		if(MyItems.instance().IsShowItemChangeMsg){
			//MenuMgr.instance.PushMessage("some data have changed");
			MyItems.instance().IsShowItemChangeMsg=false;
		}
		else {
			MyItems.instance().saveItemCoutDic();
		}
			
		if ( m_selectedItemId <= 0 )
			return;

	    var gen : IAnimationCurveGenerator = AnimationCurveGeneratorFactory.GetGenerator(m_hightAnimName);
	    if (gen == null)
	    	return;

		InventoryObjBase.SetHightLightItemID(m_selectedItemId);
		InventoryObjBase.SetHightLightAlpha(0);
       	var acInfo : AnimationCurveInfo = gen.Generate();
        return;
	}

	public function set FlashAlpha(value : float)
	{
		_Global.Log("FlashAlpha:" + (value*100).ToString());
		InventoryObjBase.SetHightLightAlpha(value);
	}
	
	public function get FlashAlpha() : float
	{
		return InventoryObjBase.GetHightLightAlpha();
	}

	private function priv_stopFlashAnim()
	{
		InventoryObjBase.SetHightLightItemID(-1);
		InventoryObjBase.SetHightLightAlpha(0);
	}
	
	private function priv_getShopAndSetMystryChestData()
	{
		if ( !KBN.FTEMgr.isFTERuning() )
		{
			m_waitingLabel = new LoadingLabelImpl();
			MystryChest.instance().AddLoadMystryChestCallback(function()
			{
				var menu : InventoryMenu = MenuMgr.getInstance().getMenu("InventoryMenu", false) as InventoryMenu;
				if ( menu == null )
					return null;
				menu.priv_onMystryChestLoadOK();
			});
		}
		else
		{
			this.priv_onMystryChestLoadOK();
		}
	}
	
	private function priv_onMystryChestLoadOK()
	{
		m_waitingLabel = null;
		if(MyItems.instance().NeedUpdate)
		{
			MyItems.instance().NeedUpdate = false;
			MyItems.instance().getInventoryData(GetItemList);
		}
		else
		{
			this.GetItemList();
		}
		this.GetShopList();
	}
	

	private function priv_getOwnedItemList(category : MyItems.Category) : System.Collections.Generic.List.<InventoryInfo>
	{
		var myItems:MyItems =  MyItems.instance();
		var arrDat : System.Collections.Generic.List.<InventoryInfo> = myItems.GetList(category);
		for (var j = arrDat.Count - 1; j >= 0; j--) {
			if ((((arrDat[j] as InventoryInfo).id>=4201&&(arrDat[j] as InventoryInfo).id<=4210)) || (arrDat[j] as InventoryInfo).id==4601)
				arrDat.Remove(arrDat[j]);
		}
		if ( m_selectedItemId == -1 )
			return arrDat;
		var idxPos : int = 0;
		for ( ; idxPos != arrDat.Count; ++idxPos )
			if ( (arrDat[idxPos] as InventoryInfo).id == m_selectedItemId)
				break;
		if ( idxPos == arrDat.Count )
			return arrDat;
		var rtArr : System.Collections.Generic.List.<InventoryInfo> = new System.Collections.Generic.List.<InventoryInfo>();
		rtArr.Add(arrDat[idxPos]);
		for ( var i : int = 0; i != idxPos; ++i )
			 {rtArr.Add(arrDat[i]);}
			
		for ( i = idxPos + 1; i != arrDat.Count; ++i )
			{rtArr.Add(arrDat[i]);} 
			
		return rtArr;
	}

	function GetItemList()
	{
		generalList.SetData(priv_getOwnedItemList(MyItems.Category.General));
		speedList.SetData(priv_getOwnedItemList(MyItems.Category.Speed));
		attackList.SetData(priv_getOwnedItemList(MyItems.Category.Attack));
		productionList.SetData(priv_getOwnedItemList(MyItems.Category.Product));
		chestList.SetData(priv_getOwnedItemList(MyItems.Category.Chest));
		buffList.SetData(priv_getOwnedItemList(MyItems.Category.Buff));
		troopsList.SetData(priv_getOwnedItemList(MyItems.Category.Troops));
		gearList.SetData(priv_getOwnedItemList(MyItems.Category.Gear));
		heroList.SetData(priv_getOwnedItemList(MyItems.Category.Hero));
		exchangeList.SetData(priv_getOwnedItemList(MyItems.Category.Exchange));
		
		//treasure
		//resetTreasureList();

		speedList.ResetPos();
		generalList.ResetPos();
		productionList.ResetPos();
		attackList.ResetPos();
		chestList.ResetPos();
		buffList.ResetPos();
		troopsList.ResetPos();
		gearList.ResetPos();
		heroList.ResetPos();
		exchangeList.ResetPos();	
	} 

	public function OnPopOver()
	{
		var  startTime = System.DateTime.Now;

		_Global.Log("<color=#00ff00>start updataSeed</color>"+(System.DateTime.Now - startTime).TotalMilliseconds);
		if(GameMain.isUpdateSeed){
			GameMain.instance().updateSeed();
					
		}
		
		_Global.Log("<color=#00ff00>end updataSeed</color>"+(System.DateTime.Now - startTime).TotalMilliseconds);
		
		if(isRate)
		{
			GameMain.instance().CheckAndOpenRaterAlert("bluelight");
		}
		pageScrList.Clear();
		
		generalList.Clear();
		speedList.Clear();
	    attackList.Clear();
		productionList.Clear();
		chestList.Clear();
		buffList.Clear();
		troopsList.Clear();
		gearList.Clear();
		heroList.Clear();
		exchangeList.Clear();
//		featuredList.Clear();

		speedShopList.Clear();
		attackShopList.Clear();
		productShopList.Clear();	
		generalShopList.Clear();
		chestShopList.Clear();
		buffShopList.Clear();
		troopsShopList.Clear();
		gearShopList.Clear();
		heroShopList.Clear();
		exchangeShopList.Clear();

		priv_stopFlashAnim();
		MyItems.instance().SetMemoryTabPos(pageScrList.m_nOffSet);
		super.OnPopOver();
	}
	
	
	private function priv_getShopItemList(arrDat : Array) : Array
	{
		if ( m_selectedItemId == -1 )
			return arrDat;
		var idxPos : int = 0;
		for ( ; idxPos != arrDat.length; ++idxPos )
			if ( (arrDat[idxPos] as Hashtable)["ID"] == m_selectedItemId )
				break;
		if ( idxPos == arrDat.length )
			return arrDat;
		var rtArr : System.Collections.Generic.List.<System.Object> = new System.Collections.Generic.List.<System.Object>();
		rtArr.Add(arrDat[idxPos]);
		for ( var i : int = 0; i != idxPos; ++i )
			rtArr.Add(arrDat[i]);
		for ( i = idxPos + 1; i != arrDat.length; ++i )
			rtArr.Add(arrDat[i]);
		return rtArr.ToArray();
	}

	function GetShopList()
	{
		var shop:Shop = Shop.instance();
		speedShopList.SetData(priv_getShopItemList(shop.dataSpeed));
		generalShopList.SetData(priv_getShopItemList(shop.dataGeneral));
		productShopList.SetData(priv_getShopItemList(shop.dataProduct));
		attackShopList.SetData(priv_getShopItemList(shop.dataAttack));
		chestShopList.SetData(priv_getShopItemList(shop.dataChest));
		buffShopList.SetData(priv_getShopItemList(shop.dataBuff));
		troopsShopList.SetData(priv_getShopItemList(shop.dataTroops));
		gearShopList.SetData(priv_getShopItemList(shop.dataGear));
		heroShopList.SetData(priv_getShopItemList(shop.dataHero));
		exchangeShopList.SetData(priv_getShopItemList(shop.dataExchange));

		speedShopList.ResetPos();
		generalShopList.ResetPos();
		productShopList.ResetPos();
		attackShopList.ResetPos();
		chestShopList.ResetPos();
		buffShopList.ResetPos();
		troopsShopList.ResetPos();
		gearShopList.ResetPos();
		heroShopList.ResetPos();
		exchangeShopList.ResetPos();
		
		shop.updateShop = false;		
		l_discount1.SetVisible(false);
		l_discount2.SetVisible(false);
		l_discount3.SetVisible(false);
		l_discount4.SetVisible(false);
		l_discount5.SetVisible(false);	
		if(shop.HasDiscountItem(Shop.SPEEDUP))
		{
			l_discount1.SetVisible(true);
		}
		if(shop.HasDiscountItem(Shop.GENERAL))
		{
			l_discount2.SetVisible(true);
		}
		if(shop.HasDiscountItem(Shop.ATTACK))
		{
			l_discount3.SetVisible(true);
		}
		if(shop.HasDiscountItem(Shop.PRODUCT))
		{
			l_discount4.SetVisible(true);
		}
		if(shop.HasDiscountItem(Shop.CHEST))
		{
			l_discount5.SetVisible(true);
		}
		
		if(CheckDiscountExist())
		{
			MenuMgr.getInstance().MainChrom.chromBtnShop.lblIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_icon_shop2",TextureType.BUTTON);
		}
		else
		{
			MenuMgr.getInstance().MainChrom.chromBtnShop.lblIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_icon_shop",TextureType.BUTTON);
		}
	} 

	public function CheckDiscountExist():boolean
	{
		var shop:Shop = Shop.instance();
		if(shop.HasDiscountItem(Shop.SPEEDUP) || shop.HasDiscountItem(Shop.GENERAL) || shop.HasDiscountItem(Shop.ATTACK)
			|| shop.HasDiscountItem(Shop.PRODUCT) || shop.HasDiscountItem(Shop.CHEST))
		{
			return true;
		}
		return false;
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case "UpdateItem":
				UpdateInventoryItemCount();
				menuHead.l_gem.txt = Payment.instance().DisplayGems + "";
				break;
				
			case "updateDiscountInfo":
				updateDiscountInfo(System.Convert.ToInt32(body));
				break;
			/*	
			case "updateTreasureItems":
				resetTreasureList();
				break;*/
			case Constant.Notice.InventoryPage : 
				selectedMyItemList = System.Convert.ToInt32(body);
				MyItems.instance().SetMemoryTabPage(selectedMyItemList);
				SetMyItemPageTab(selectedMyItemList);
				break;
		}			
				
	}			
	
	static function BuyFail(result:Object)
	{
	}
	
	public function loadShopData():void
	{
		var shop:Shop = Shop.instance();
		if(shop.updateShop)
		{
			shop.getShopData(GetShopList,true);
		}
		else
		{
			GetShopList();
		}
	}
	
	
	public function updateDiscountInfo(_type:int)
	{
		//var array:Array;
		var ifshowSaleIcon = false;
		m_shopList[_type].ForEachItem(function(listItem:ListItem)
		{
			var item:InventoryObj = listItem as InventoryObj;
			if(item.getbSale())
			{
				ifshowSaleIcon = true;
				return false;
			}
			return true;
		});
		
		Shop.instance().setDiscountArray(_type,ifshowSaleIcon);
		updateTitleSaleIcon();
	}
	
	public function updateTitleSaleIcon()
	{
		var shop:Shop = Shop.instance();
		
		l_discount1.SetVisible(shop.HasDiscountItem(Shop.SPEEDUP));
		l_discount2.SetVisible(shop.HasDiscountItem(Shop.GENERAL));
		l_discount3.SetVisible(shop.HasDiscountItem(Shop.ATTACK));
		l_discount4.SetVisible(shop.HasDiscountItem(Shop.PRODUCT));
		l_discount5.SetVisible(shop.HasDiscountItem(Shop.CHEST));
		
		if(CheckDiscountExist())
		{
			MenuMgr.getInstance().MainChrom.chromBtnShop.lblIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_icon_shop2",TextureType.BUTTON);
		}
		else
		{
			MenuMgr.getInstance().MainChrom.chromBtnShop.lblIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_icon_shop",TextureType.BUTTON);
		}
	}
	
}
