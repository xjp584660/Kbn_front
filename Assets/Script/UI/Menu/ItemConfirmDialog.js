
public class ItemConfirmDialog extends ConfirmDialog
{
	public var itemIcon:Label;
	public var content2:Label;
	public var spliteLine:Label; 
	
	//--------------------------------------------------------------- 
	public function Init():void
	{
		super.Init();  
	}
	
	public function setDefautLayout():void
	{ 
		// Null
	}
	
	public override function DrawItem()
	{
		super.DrawItem();
		
		itemIcon.Draw();
		content2.Draw();
		spliteLine.Draw(); 
	}
	
	public override function OnPush(param:System.Object)
	{
		super.OnPush(param);
		
		SetCancelAble(false);
		super.btnConfirm.SetVisible(false);
	}
	
	public function SetMyItemData(param:Object)
	{
		var itemId:int = param;
		GearSysHelpUtils.SetMyItemIcon(itemIcon, itemId);
		 
		super.title.txt = Datas.getArString("itemName.i" + itemId.ToString());
		super.m_msg.txt = Datas.getArString("itemDesc.i" + itemId.ToString());
		content2.txt = Datas.getArString("Get it from XXXXXX");
	}
	
	public function SetEquipItemData(param:Object)
	{
		var gearId:int = param;
		GearSysHelpUtils.SetEquipItemIcon(itemIcon, gearId);
		
		super.title.txt = Datas.getArString("gearName.g" + gearId.ToString());
		super.m_msg.txt = Datas.getArString("gearDesc.g" + gearId.ToString());
		content2.txt = Datas.getArString("Get it from XXXXXX");
	}
}
