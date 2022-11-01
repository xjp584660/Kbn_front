import System.Collections.Generic;

public class OtherKnightInfomationPopMenu extends PopMenu implements ITouchable
{
    public var table:GearTroopTable;
    public var popTitle:Label;
    public var line1:Label;
    public var line2:Label;
    public var star:Label;
    public var level:Label;
    public var levelText:Label;
    public var troop:Label;
    public var troopText:Label;
    public var photo:Label;


	//public var mask:Label;
	public function OnPush(param:Object)
	{
        var info : GeneralInfoVO = param as GeneralInfoVO;

        var tilename : String = General.getGeneralTextureName(info.knightName, info.cityOrder);

        this.popTitle.txt = General.singleton.getKnightNameByCityOrderAndName(info.knightName, info.cityOrder);
		photo.useTile = true;
        photo.tile = TextureMgr.singleton.IconSpt().GetTile(tilename);
        this.star.SetVisible(info.isStar);
        this.level.SetVisible(!info.isStar);
        this.levelText.txt =(info.isStar ? info.starLevel.ToString() : info.knightLevel.ToString());

        var troopNum : Double = 0f;
        for(var k:KeyValuePair.<int,GearTroopItem.GearTroopItemData> in info.gearTroopItemDatas)
        { 
            var temp : GearTroopItem.GearTroopItemData = k.Value;
            troopNum = temp.troop;
            break;
        }
        this.troopText.txt = (troopNum * 10000).ToString(); 
        
		table.Datas = info.gearTroopItemDatas;
		table.OnPush();
		
		table.attack.txt = Datas.getArString("Gear.EquipmentAttributeAttack");
		table.life.txt = Datas.getArString("Gear.EquipmentAttributeLife");
		table.speed.txt = Datas.getArString("Gear.EquipmentAttributeSpeed");
		table.load.txt = Datas.getArString("Gear.EquipmentAttributeLoad");
		table.deattack.txt = Datas.getArString("Gear.EquipmentAttributeDeAttack");
		table.delife.txt = Datas.getArString("Gear.EquipmentAttributeDeLife");
	}
	
	public function Init()
	{
		super.Init();
		table.Init();
	
		InitAbsoluteRect();
	}
	public function Update()
	{
		super.Update();
		table.Update();
	}
	
	
	function DrawItem()
	{
        popTitle.Draw();
        line1.Draw();
        line2.Draw();
        photo.Draw();
        star.Draw();
        level.Draw();
        levelText.Draw();
        troop.Draw();
        troopText.Draw();
		table.Draw();				
		DrawInterface();			
	}
	
	public function OnPopOver()
	{
		table.DestroyResource();
	}
	
	//======================================================================================================
	//touchable interface 
	private var mAbsoluteRect:Rect; 
	private var mActivated:System.Action.<ITouchable>;
	private var receiverActivated:Function;
	public function GetName():String
	{
		return "";
	}
	public function IsVisible():boolean
	{
		return visible;
	}
	
	private function InitAbsoluteRect()
	{
		mAbsoluteRect = new Rect(0,0,640,960);
	}
	public function GetAbsoluteRect():Rect
	{ 
		return mAbsoluteRect;
	}

	public function GetZOrder():int
	{
		return 1000;
	}
	public function SetTouchableActiveFunction(Activated:System.Action.<ITouchable>)
	{
		mActivated = Activated;
	}

	private function DrawInterface()
	{	
		if(mActivated != null)
			mActivated(this); 
		if(receiverActivated != null)
			receiverActivated(this);
	}
	
}