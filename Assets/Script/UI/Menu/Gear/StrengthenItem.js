#pragma strict

class StrengthenItem extends ListItem implements ITouchable
{
	public var itemBackgroundBtn:Button;
	public var itemIcon:Label;
	public var itemCnt:Label;
	public var itemGems:Label;
	
	public var hilight:FlashLabel;
	
	@SerializeField private var levelLabel:Label;
	
	//------------------------------------------------------------
	private var dataArray:Array; // [0]-hammerId [1]-needItemId [2]-needItemCnt [3]-costGems [4]-maxLevelUpRate
	
	private var hammerId:int;
	private var isCanUse:boolean;
	
	private var touchableActivated:System.Action.<ITouchable>;
	private var screenAbsoluteRect:Rect;
	
	@SerializeField private var itemGemsMinX : float = 0;
	@SerializeField private var itemCntMinX : float = 0;
	
	//------------------------------------------------------------
	public override function Init()
	{
		InitItemBackground();
		InitHilight();
		
		RegisterGesture();
		
		hammerId = -1;
		isCanUse = true;
	}
	
	private function InitItemBackground()
	{
		itemBackgroundBtn.rect.x = itemBackgroundBtn.rect.y = 0;
		itemBackgroundBtn.rect.width = super.rect.width;
		itemBackgroundBtn.rect.height = super.rect.height;
		
		var bgNormalName:String = "Equipment_bg";
		var bgActiveName:String = "Equipment_bg2";
		itemBackgroundBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture(bgNormalName, TextureType.BUTTON);
		itemBackgroundBtn.mystyle.active.background = TextureMgr.instance().LoadTexture(bgActiveName, TextureType.BUTTON);
		
		levelLabel.mystyle.normal.background = TextureMgr.instance().LoadTexture("Hammer_level", TextureType.DECORATION);
		levelLabel.mystyle.contentOffset.y = 5;
		levelLabel.rect.width = 38;
		levelLabel.rect.height = 48;
		levelLabel.rect.x = rect.width - levelLabel.rect.width - 8;
		levelLabel.rect.y = 2;
	}
	
	public override function Draw()
	{
		if (!super.visible)
			return;
		
		super.prot_calcScreenRect();
		
		// MUST be GUI.BeginGroup(super.rect)/GUI.EndGroup() Clamped
		Local2ScreenRect();
		UpdateGestures();
		
		GUI.BeginGroup(super.rect); 
		
		itemBackgroundBtn.Draw();
		DrawHilight();
		
		itemIcon.Draw();
		itemCnt.Draw();
		itemGems.Draw();
		if (ItemLevel() > 0 && hammerId != -1)
		{
			levelLabel.Draw();
		}
		
		GUI.EndGroup();
	}
	
	public override function Update()
	{
		super.Update();
		UpdateHilight();
	}
	
	public override function OnClear()
	{
		super.OnClear();
		UnregisterGesture();
	}
	
	private function RegisterGesture()
	{ 
		// Use the GestureManager from Cai Ming code
		// For add touchable rect to Controller
		GestureManager.Instance().RegistTouchable(this);
	}
	
	private function UnregisterGesture()
	{
		GestureManager.Instance().RemoveTouchable(this);
	}
	
	// Update per frame
	private function Local2ScreenRect()
	{
		GUI.BeginGroup(super.rect);
		var minPoint:Vector2 = GUIUtility.GUIToScreenPoint(new Vector2(0, 0));
		GUI.EndGroup();
		
		screenAbsoluteRect.x = minPoint.x;
		screenAbsoluteRect.y = minPoint.y;
		screenAbsoluteRect.width = super.rect.width;
		screenAbsoluteRect.height = super.rect.height;
	}
	
	public function Screen2LocalPos(screenPos:Vector2)
	{	 		
		GUI.BeginGroup(super.rect); 
		var minPoint:Vector2 = GUIUtility.ScreenToGUIPoint(screenPos);
		GUI.EndGroup();
		
	  	_Global.Log("Screen: " + screenPos + " GUI: " + minPoint);
		super.rect.x = minPoint.x;
		super.rect.y = minPoint.y;
	}
	
	// Override ITouchable
	public function GetAbsoluteRect():Rect
	{
		// Convert to screen coordinate?
		return screenAbsoluteRect;
	}
	public function GetName():String
	{
		return "";
	}
	public function IsVisible():boolean
	{
		return visible;
	}
	
	public function GetZOrder():int
	{
		return 10;
	} 
	
	public function SetTouchableActiveFunction(activated:System.Action.<ITouchable>)
	{
		touchableActivated = activated;
	}
	
	private function UpdateGestures()
	{	
		if (touchableActivated != null)
			touchableActivated(this); 
	}
	
	public override function SetRowData(object:Object):void
	{
		Data = object;
	}
	
	public function set Data(value:Object)
	{	
		dataArray = value as Array;
		
		hammerId = dataArray[0];
		var needItemId:int = dataArray[1];
		var needItemCnt:int = dataArray[2];
		
		var itemLevel:int = ItemLevel();
		if (itemLevel > 0)
			levelLabel.txt = itemLevel.ToString();
		
		if (-1 == hammerId)
			NullStrengthenItemData();
		else
			UpdateItemDatas(hammerId, needItemId, needItemCnt);
	}
	
	public function get Data():Array
	{	
		return dataArray;
	}
	
	public function OnlyShowHammer()
	{
		itemIcon.SetVisible(true);
		
		itemBackgroundBtn.SetVisible(false);
		itemCnt.SetVisible(false);
		itemGems.SetVisible(false);
		levelLabel.SetVisible(false);
	}
	
	public function GetHammerId():int
	{	
		return dataArray[0];
	}
	
	public function GetNeedItemId():int
	{
		return dataArray[1];
	}
	
	public function GetNeedItemCount():int
	{
		return dataArray[2];
	}
	
	public function GetCostGems():int
	{	
		return dataArray[3];
	}
	
	public function IsMaxLevelUpRate():boolean
	{
		return -1 != hammerId && 5 <= dataArray.length && 1 == dataArray[4];
	}
	
	public function ItemLevel() : int
	{
		return (6 <= dataArray.length) ? dataArray[5] : -1;
	}
	
	public function IsCanUse():boolean
	{
		return isCanUse;	
	}
	
	public function UpdateItemDatas(needItemId:int, needItemCnt:int)
	{
		if (-1 != hammerId)
			UpdateItemDatas(hammerId, needItemId, needItemCnt);
	}
	
	public function UpdateItemDatas(itemId:int, needItemId:int, needItemCnt:int)
	{	
		var bgActiveName:String = "Equipment_bg2";
		itemBackgroundBtn.mystyle.active.background = TextureMgr.instance().LoadTexture(bgActiveName, TextureType.BUTTON);
		
		// Icon
		if (IsMaxLevelUpRate()) {
			GearSysHelpUtils.SetMyItemIcon(itemIcon, 5121);
		} else {
			GearSysHelpUtils.SetMyItemIcon(itemIcon, itemId);
		}
		
		var hammerCostGems:int = 0;
		var addtiveGems:int = 0;
		var bShowGems:boolean = false;	
		var hammerCnt:int = MyItems.instance().countForItem(itemId);
		var needItemCurrCnt:int = 0;
		if (-1 != needItemId)
			needItemCurrCnt = MyItems.instance().countForItem(needItemId);
		
		isCanUse = true;
		var itemData:HashObject = Datas.instance().itemlist()["i" + itemId];
		if (Shop.instance().IsInShopList(itemId))
		{
			if (needItemCurrCnt < needItemCnt || hammerCnt <= 0)
			{
				bShowGems = true;
			}
		}
		else
		{
			if (hammerCnt <= 0)
			{
				isCanUse = false;
			}
			else
			{
				if (needItemCurrCnt < needItemCnt)
				{
					if (-1 != needItemId && 0 != needItemId)
					{
						bShowGems = true;
					}
				}
			}
		}
		
		if(bShowGems)
		{
			if(hammerCnt <= 0)
			{
				var fHammerCost:float = Shop.instance().getCurPriceOfItem(_Global.INT32(itemData["category"]), itemId); 
				fHammerCost *= GearSysHelpUtils.UseToolsRate;
				hammerCostGems = fHammerCost + 0.5f;
			}
			if(needItemCurrCnt < needItemCnt)
			{
				var fAddCost:float = (needItemCnt-needItemCurrCnt) * _Global.INT32( (Datas.instance().itemlist())["i" + needItemId]["price"] ); 
				fAddCost *= GearSysHelpUtils.UseItemRate;
				addtiveGems = fAddCost + 0.5f;
			}
			hammerCostGems += addtiveGems;
		}

		if (bShowGems && hammerCostGems > 0)
		{
			itemCnt.SetVisible(true);
			itemCnt.txt = hammerCostGems.ToString();
			
			itemGems.SetVisible(true);
			itemGems.txt = "";
			
			var cntWidth:int = _Global.GUICalcWidth(itemCnt.mystyle, itemCnt.txt);
			itemGems.rect.x = itemGemsMinX;
			itemCnt.rect.x = itemGems.rect.x + itemGems.rect.width + 2;
			GearSysHelpUtils.SetLabelTexture(itemGems, "resource_icon_gems", TextureType.ICON);
		}
		else
		{
			itemCnt.SetVisible(true);
			var szFormat:String = "x{0}";
			itemCnt.txt = String.Format(szFormat, hammerCnt);
			itemCnt.rect.x = itemCntMinX;
			itemGems.SetVisible(false);
		}
		
		dataArray[1] = needItemId;
		dataArray[2] = needItemCnt;
		dataArray[3] = hammerCostGems;
	}
	
	public function SetOnClickDelegate(del:Function)
	{
		if (-1 != hammerId)
		{
			itemBackgroundBtn.clickParam = this;
			itemBackgroundBtn.OnClick = del;
		}
	}
	
	private function NullStrengthenItemData()
	{
		itemBackgroundBtn.mystyle.active.background = null;
		GearSysHelpUtils.SetLabelTexture(itemIcon, null);
		
		itemCnt.SetVisible(false);
		itemGems.SetVisible(false);
	}
	
	
	private function InitHilight()
	{
		if(hilight == null) return;
		hilight.Init();
		
		if(itemBackgroundBtn != null)
			hilight.rect = new Rect(0, 0, itemBackgroundBtn.rect.width, itemBackgroundBtn.rect.height);
		else
			hilight.rect = new Rect(0, 0, rect.width, rect.height);
		
		GearManager.Instance().SetImageNull(hilight);
		hilight.mystyle.normal.background = TextureMgr.instance().LoadTexture("kuang1",TextureType.DECORATION);
		hilight.mystyle.border.left = 10;
		hilight.mystyle.border.right = 10;
		hilight.mystyle.border.top = 10;
		hilight.mystyle.border.bottom = 10;
		Darken();
		
		hilight.Screenplay.OnPlayFinish = OnFlashFinish;
		hilight.From = 1.0f;
		hilight.To = 1.0f;
		hilight.Times = 0;
	}
	
	private function OnFlashFinish(screenplay:IScreenplay)
	{
		// if(hilight.isVisible())
		// {
		// 	hilight.Begin();
		// }
	}
	
	private function DrawHilight()
	{
		if(hilight == null) return;
		hilight.Draw();
	}
	
	private function UpdateHilight()
	{
		if(hilight == null) return;
		hilight.Update();
	}
	
	public function Hilighten()
	{
		if(hilight == null) return;
		hilight.SetVisible(true);
		hilight.Begin();
	}
	
	public function Darken()
	{
		if(hilight == null) return;
		hilight.SetVisible(false);
	}
}