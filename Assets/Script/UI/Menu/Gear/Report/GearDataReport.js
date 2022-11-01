


public class GearDataReport extends TabContentUIObject
{
	public var table:GearTroopTable;
	//public var mask:Label;
	
	public function Init()
	{
		table.Init();
		//mask.Init();
		table.attack.txt = Datas.getArString("Gear.EquipmentAttributeAttack");
		table.life.txt = Datas.getArString("Gear.EquipmentAttributeLife");
		table.speed.txt = Datas.getArString("Gear.EquipmentAttributeSpeed");
		table.load.txt = Datas.getArString("Gear.EquipmentAttributeLoad");
		table.deattack.txt = Datas.getArString("Gear.EquipmentAttributeDeAttack");
		table.delife.txt = Datas.getArString("Gear.EquipmentAttributeDeLife");
	}
	
	public function OnPush(param:Object)
	{
		var selfKnight:Knight = GearReport.Instance().Self;
		var enemyKnight:Knight = GearReport.Instance().Enemy;
		if(selfKnight == null) return;
		if(enemyKnight == null) return;
		
		var selfData:Dictionary.<int,GearTroopItem.GearTroopItemData> = GearReport.Instance().Format(GearReport.Instance().Calculate(selfKnight.Arms));
		var enemyData:Dictionary.<int,GearTroopItem.GearTroopItemData> = GearReport.Instance().Format(GearReport.Instance().Calculate(enemyKnight.Arms));
		
		table.Datas = GearReport.Instance().Minus(selfData,enemyData);
		table.OnPush();
		//mask.mystyle.normal.background = TextureMgr.instance().LoadTexture("Mask_Lightcolor",TextureType.GEAR);
	}
	
	public function OnPop()
	{
		
	}
	public function OnPopOver()
	{
		table.DestroyResource();
	}
	
	public function OnSelect()
	{
		
	}
	public function Update()
	{
		table.Update();
		//mask.Update();
	}
	public function Draw()
	{
		table.Draw();
		//mask.Draw();
	}
	
}