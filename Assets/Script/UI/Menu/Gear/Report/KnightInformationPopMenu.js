import System.Collections.Generic;

public class KnightInformationPopMenu extends PopMenu implements ITouchable
{
	public var table:GearTroopTable;
	public var photo:KnightPhoto;

	//public var mask:Label;
	public function OnPush(param:Object)
	{
		var curKnight : Knight = GearData.Instance().CurrentKnight;
		if( param != null ) {
			var knightID : String = param as String;
			var k : Knight = GearManager.Instance().GetKnight( _Global.INT32( knightID ) );
			if( k != null ) {
				curKnight = k;
			}
		}
		table.Datas = GearReport.Instance().Format(GearReport.Instance().Calculate(curKnight.Arms));
		table.OnPush();
		
		table.attack.txt = Datas.getArString("Gear.EquipmentAttributeAttack");
		table.life.txt = Datas.getArString("Gear.EquipmentAttributeLife");
		table.speed.txt = Datas.getArString("Gear.EquipmentAttributeSpeed");
		table.load.txt = Datas.getArString("Gear.EquipmentAttributeLoad");
		table.deattack.txt = Datas.getArString("Gear.EquipmentAttributeDeAttack");
		table.delife.txt = Datas.getArString("Gear.EquipmentAttributeDeLife");
		
		photo.TheKnight = curKnight;
		photo.Title = General.singleton.getKnightShowName(photo.TheKnight.Name,GameMain.instance().getCityOrderWithCityId(photo.TheKnight.CityID));
		photo.Photo.tile = TextureMgr.instance().GeneralSpt().GetTile(General.getGeneralTextureName(photo.TheKnight.Name, GameMain.instance().getCityOrderWithCityId(photo.TheKnight.CityID)));
	}
	
	public function Init()
	{
		super.Init();
		table.Init();
		photo.Init();
		//mask.Init();
		//mask.setBackground("Mask_Lightcolor",TextureType.GEAR);
		GestureManager.Instance().RegistTouchable(this);
		InitAbsoluteRect();
	}
	public function Update()
	{
		super.Update();
		table.Update();
		photo.Update();
		//mask.Update();
	}
	
	
	function DrawItem()
	{
		table.Draw();
		photo.Draw();					
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