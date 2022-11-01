

 
public class KnightPanel extends UIObject
{
	
	private var knight:Knight;
	
	public var nakedKnight:Label;
	public var hand:Label;
	public var ringSlot:SimpleLabel;
	public var KnightArmDestinations:Rect[];
	public var KnightArmSensingArea:Rect[];
	public var photo:Label;
	public var attack:Label;
	public var life:Label;

	public var leveltxt:Label;
	public var attacktxt:Label;
	public var lifetxt:Label;
	public var detail:Button;
	
	public var troop:Label;
	public var troopTxt:Label;
	
	private var drawSequence:int[];
	
	// LiHaojie 2013.09.13: Just for location
	private var transitItems:GearScrollViewItem[];
	
	private var items:GearScrollViewItem[];
	
	@SerializeField
	private var level:Label;
	@SerializeField
	protected var m_starHeroIconFrame : Label;
	@SerializeField
	protected var m_star : Label;
	
	private function InitItems()
	{
		items = new GearScrollViewItem[Constant.Gear.ArmCategoryNumber];
	}
	private function UpdateItems()
	{
		
	}
	private function DrawItems()
	{
		if(items == null) 
			items = new GearScrollViewItem[Constant.Gear.ArmCategoryNumber];
		for(var i:int = 0;i<items.length;i++)
		{ 
			var j:int = drawSequence[i]; 
			if(items[j] == null) continue;
			if(items[j] != null)
			{
				items[j].SetRect(KnightArmDestinations[j]);
				items[j].Draw();
			}	
			if(j == (Constant.ArmType.Sword - 1))
				DrawHand();
		}
	}
	
	private function SwitchItem(position:int,arm:Arm)
	{
		if(position < 0 || position > items.length) return;
		if(items == null) 
			items = new GearScrollViewItem[Constant.Gear.ArmCategoryNumber];
		if(arm == null) 
		{
			if(items[position] != null) 
			{
				items[position].OnPopOver();
				DisplayChanged(knight);
			}
			items[position] = null;
			return;
		}
		else if(items[position] == null)
		{
			items[position] = KBN.GearItems.Instance().CreateKnightArmItem(arm);
		}
		else if(items[position].TheArm == arm)
			return;
		else
		{
			items[position].OnPopOver();
			items[position] = KBN.GearItems.Instance().CreateKnightArmItem(arm);
		}
		if(KnightArmSensingArea != null && items != null && items[position] != null && KnightArmSensingArea.length > position && position >= 0)
			items[position].SensingArea = KnightArmSensingArea[position];
		DisplayChanged(knight);
	}
		
	private function DestroyItem()
	{
		if(items == null) 
			items = new GearScrollViewItem[Constant.Gear.ArmCategoryNumber];
		
		for(var i:int = 0;i< items.length;i++)
		{	 
			if(items[i] == null) continue;
			items[i].OnPopOver(); 
			items[i] = null;
		}
		
	}
	
	public function set TheKnight(value:Knight)
	{ 
		DisplayChanged(value);
		OnKnightChanged(knight,value);
		knight = value;
		
	} 
	
	private function DisplayChanged(knight:Knight)
	{
		var curCityOrder:int = GameMain.instance().getCurCityOrder();
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();

		photo.useTile = true;
		photo.tile = iconSpt.GetTile(General.getGeneralTextureName(knight.Name, curCityOrder ));
		//photo.tile.name = General.getGeneralTextureName(knight.Name, curCityOrder );
		if(leveltxt != null)
			leveltxt.txt = knight.ShowerLevel;//GearManager.Instance().GetKnightLevel(knight);
		if(attacktxt != null)
			attacktxt.txt = "" + GearManager.Instance().GetShowKnightAttack(knight);
		if(lifetxt != null)
			lifetxt.txt = "" + GearManager.Instance().GetShowKnightLife(knight);
		if(troopTxt != null)
			troopTxt.txt = "" + GearManager.Instance().GetKnightTroop(knight);
		if ( knight.IsHaveStar )
		{
			m_starHeroIconFrame.SetVisible(true);
			m_starHeroIconFrame.useTile = true;
			m_starHeroIconFrame.tile = iconSpt.GetTile("frame_reincarnation");
			m_star.SetVisible(true);
			m_star.useTile = true;
			m_star.tile = texMgr.IconSpt().GetTile("lv_reincarnation");
			level.SetVisible(false);
		}
		else
		{
			m_starHeroIconFrame.SetVisible(false);
			m_star.SetVisible(false);
			level.SetVisible(true);
			level.mystyle.normal.background = texMgr.LoadTexture("Button_UserInfo_lv", TextureType.DECORATION);
		}
	} 
	private function OnKnightChanged(o:Knight,n:Knight)
	{
		if(o == n) return;
		DestroyItem();
	}
	
	private function InitDetail()
	{
		if(detail == null) return;
		detail.Init();
		detail.txt = Datas.getArString("Gear.CheckDetailBtn");
		detail.setNorAndActBG("button_blue","button_blue_down");
		detail.OnClick = ClickDetail;
	}
	
	private function ClickDetail()
	{
		MenuMgr.getInstance().PushMenu("KnightInformationPopMenu", null, "trans_zoomComp");
	}
	
	public function get TheKnight()
	{
		return knight;
	}
	
	public function Init()
	{
		InitNakedNight();
		InitKnightArmDestinations();
		InitDrawSequence();
		InitLabels();
		InitDetail();
		InitItems();
		InitNullTransitItems();
		InitBackForwardButton();
	}
	
	private function InitLabels()
	{
		attack.mystyle.normal.background = ItemPropertyKind.GetTextureByKind(ItemPropertyKind.Attack);
		life.mystyle.normal.background = ItemPropertyKind.GetTextureByKind(ItemPropertyKind.Life);
		if(troop != null)
			troop.mystyle.normal.background = ItemPropertyKind.GetTextureByKind(ItemPropertyKind.TroopsLimit);
		leveltxt.setBackground("Black_Gradients",TextureType.DECORATION);
		attacktxt.setBackground("Black_Gradients",TextureType.DECORATION);
		lifetxt.setBackground("Black_Gradients",TextureType.DECORATION);
		if(troopTxt != null)
			troopTxt.setBackground("Black_Gradients",TextureType.DECORATION);
	}
	private function InitDrawSequence()
	{
		drawSequence = [1,0,4,2,3,5];
	}

	private function InitNakedNight()
	{
		nakedKnight.Init();
		hand.Init();
		
		hand = GearManager.Instance().SetImage(hand,"Hand");
		nakedKnight = GearManager.Instance().SetImage(nakedKnight,"body");	
		
		ringSlot.mystyle.normal.background = TextureMgr.instance().LoadTexture("dicao_ring", TextureType.DECORATION);
	}
	
	private function InitKnightArmDestinations()
	{
/*		KnightArmDestinations = new Rect[Constant.Gear.ArmPositionNumber];
		for(var i:int = 0;i< Constant.Gear.ArmPositionNumber;i++)
		{
			KnightArmDestinations[i].x = i * 100;
			KnightArmDestinations[i].y = 200;
			KnightArmDestinations[i].width = 100;
			KnightArmDestinations[i].height = 200; 
		}
*/	}
	
	public function get Destinations():Rect[]
	{
		return KnightArmDestinations;
	}

	public function Update()
	{
		UpdateItems();
		UpdateKnight();
		UpdateBackForwardButton();
	}
	
	public function Draw()
	{
		if(!visible) return;
		GUI.BeginGroup(rect);
		
		nakedKnight.Draw();
		ringSlot.Draw();
		//DrawKnight();
		DrawNullTransitItems();
		DrawItems();
		leveltxt.Draw();
		attacktxt.Draw();
		lifetxt.Draw();
		photo.Draw();
		level.Draw();
		attack.Draw();
		life.Draw();
		if(troop != null) 
			troop.Draw();
		if(troopTxt != null)
			troopTxt.Draw();
		
		if(detail != null)
			detail.Draw();
		m_starHeroIconFrame.Draw();
		m_star.Draw();
		DrawBackForwardButton();
		GUI.EndGroup();
	}
	
	public function DrawHand()
	{
		hand.Draw();
	}
	private function UpdateKnight()
	{ 
		if( knight == null) return;
		var arms:Arm[] = knight.Arms;
		var n:int = arms.length;
		
		//i represents position
		for(var j:int = 0;j<n;j++)
		{  
			var i:int = drawSequence[j];
//			var item:GearScrollViewItem = null; 
			SwitchItem(i,arms[i]);
		}		
	}
	
	private function InitNullTransitItems()
	{
		if (!NewFteMgr.Instance().IsAllFteCompleted)
		{
			transitItems = new GearScrollViewItem[drawSequence.Length];
			KBN.GearItems.Instance().InitBlankItems();
			
			for(var j:int = 0; j < transitItems.Length; j++)
			{  
				var i:int = drawSequence[j];
				// var item:GearScrollViewItem = null; 
				transitItems[j] = KBN.GearItems.Instance().BlankArmItem[i];
				transitItems[j].SetRect(KnightArmDestinations[i]);
			}
		}
	}
	
	public function CheckIsNullTransitItem(item:GearScrollViewItem):boolean
	{
		if (transitItems)
		{
			for(var i:int = 0; i < transitItems.Length; i++)
			{  
				if (transitItems[i] == item)
				{
					return true;
				}
			}
			
			return false;
		}
		
		return false;
	}
	
	public function GetMatchItem(fteNullItem:GearScrollViewItem):GearScrollViewItem
	{
		if (transitItems && items)
		{
			for(var i:int = 0; i < transitItems.Length; i++)
			{  
				if (transitItems[i] == fteNullItem)
				{
					return items[i];
				}
			}
			
			return null;
		}
		
		return null;
	}
	
	private function DestroyNullTransitItems()
	{
		if (transitItems)
		{
			for(var i:int = 0; i < transitItems.Length; i++)
			{  
				transitItems[i].OnPopOver(); 
			}
		}
		
		transitItems = null;
	}
	
	private function DrawNullTransitItems()
	{
		if (!NewFteMgr.Instance().IsAllFteCompleted)
		{
			for (var i:int = 0; i < transitItems.Length; i++)
			{
				transitItems[i].Draw();
			}
		}
	}
	
	public function SetUIData(data:System.Object)
	{
		TheKnight = data as Knight;
	} 
	
	
	public function OnPopOver():void 
	{
		this.nakedKnight.OnPopOver();
		this.hand.OnPopOver();
		this.photo.OnPopOver();
		this.level.OnPopOver();
		this.attack.OnPopOver();
		this.life.OnPopOver();
		this.leveltxt.OnPopOver();
		this.attacktxt.OnPopOver();
		this.lifetxt.OnPopOver(); 
		DestroyItem();
		DestroyNullTransitItems();
		UIObject.TryDestroy(this);
	}
	
	//==================================================================================================

	public var detailButton_back:Button;
	
	private function InitBackForwardButton()
	{
		if(detailButton_back == null) return;
		detailButton_back.Init();
		detailButton_back.OnClick = ClickDetail;
	}
	
	private function UpdateBackForwardButton()
	{
		if(detailButton_back == null) return;
		detailButton_back.Update();
		
	}
	
	private function DrawBackForwardButton()
	{
		if(detailButton_back == null) return;
		detailButton_back.Draw();
	}
		
	
}