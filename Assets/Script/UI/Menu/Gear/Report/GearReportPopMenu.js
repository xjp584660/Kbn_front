

public class GearReportPopMenu extends PopMenu
{
	public var selfPhoto:KnightPhoto;
	public var enemyPhoto:KnightPhoto;
	 
	public var item:GearScrollViewItem;
	public var backgroundButton:Button;
	public var weaponImage:Label;
	public var star:StarLevel;
	public var stoneItem:StoneItem;
	public var number:Label;
	public var flash:FlashLabel;
	 
	public var tabControl:TabControl;
	public var line:Label;
	public function Init()
	{ 
		super.Init();  
		InitGearItems();
		line.Init(); 
		line.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line_list_small",TextureType.DECORATION);
		selfPhoto.Init();
		enemyPhoto.Init(); 
		// InitBackground();
		InitTabControl();
		tabControl.toolBar.styles[0].normal.background = TextureMgr.instance().LoadTexture("tab_big_Paper_normal",TextureType.BUTTON);
		tabControl.toolBar.styles[1].normal.background = TextureMgr.instance().LoadTexture("tab_big_Paper_normal",TextureType.BUTTON);
		tabControl.toolBar.styles[0].onNormal.background = TextureMgr.instance().LoadTexture("tab_big_Paper_down",TextureType.BUTTON);
		tabControl.toolBar.styles[1].onNormal.background = TextureMgr.instance().LoadTexture("tab_big_Paper_down",TextureType.BUTTON);		
	} 
	
	private function InitGearItems()
	{
		KBN.GearItems.Instance().item = item;
		KBN.GearItems.Instance().backgroundButton = backgroundButton;
		KBN.GearItems.Instance().weaponImage = weaponImage;
		KBN.GearItems.Instance().stoneItem = stoneItem;
		KBN.GearItems.Instance().star = star;
		KBN.GearItems.Instance().number = number;
		KBN.GearItems.Instance().flash = flash;
		KBN.GearItems.Instance().Init();
	}

	private function InitBackground()
	{
		
		bgMiddleBodyPic = TextureMgr.instance().BackgroundSpt().GetTile("ui_paper_bottomEmail");
		//bgMiddleBodyPic.rect = bgMiddleBodyPic.spt.GetTileRect("ui_paper_bottom");
		//bgMiddleBodyPic.name = "ui_paper_bottom";		
		
	}
	private function InitTabControl()
	{
		
		tabControl.Init();
		
		
		var toolBarNames = new String[2];
		toolBarNames[0] = Datas.getArString("Gear.BattleReportOurGeneral");
		toolBarNames[1] = Datas.getArString("Gear.BattleReportEnemyGeneral");
		tabControl.ToolBarNames = toolBarNames;
	}
	public function DrawBackground()
	{	 
		super.DrawBackground();		
	}
	
	
	public function Update()
	{
		super.Update();
		selfPhoto.Update();
		enemyPhoto.Update();
		line.Update(); 
		tabControl.Update();
	}
	public function Draw()
	{
		super.Draw();
	}
	public function DrawItem()
	{ 
		
		tabControl.Draw();
		selfPhoto.Draw();
		enemyPhoto.Draw(); 
		line.Draw();
	}
	public function OnPush(hash:Object)
	{
		tabControl.OnPush(hash); 
		var selfKnight:Knight = GearReport.Instance().Self;
		var enemyKnight:Knight = GearReport.Instance().Enemy;
		enemyKnight.isMyKnight = false;
		if(selfKnight == null) return;
		if(enemyKnight == null) return;
		
		selfPhoto.TheKnight = selfKnight; 
		enemyPhoto.TheKnight = enemyKnight; 
	}
	public function OnPopOver()
	{
		tabControl.OnPopOver();
		KBN.GearItems.Instance().OnPopOver();
	}
	
	public function OnPop()
	{
		tabControl.OnPop();
	}
	
	
}