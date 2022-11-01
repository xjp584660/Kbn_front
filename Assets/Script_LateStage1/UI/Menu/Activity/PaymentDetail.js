
class PaymentDetail extends UIObject{

	public var itemList:ScrollList;
	public var subItem:DetailListItem;
	
	public var chestBg:SimpleLabel;
	public var backBtn:SimpleButton;
	public var chestIcon:SimpleLabel;
	public var chestName:SimpleLabel;
	public var chestDesc:SimpleLabel;
	
	private var chestId:int;
	
	
	function Init()
	{
		super.Init();
//		itemList.Init(subItem);
		
		backBtn.OnClick = function(param:Object){
	//		MenuMgr.getInstance().paymentMenu.ClickBack(param);
		};
	}
	
//	public function InitWithData(data:Payment.PaymentElement)
//	{
//		chestId = data.chestId;
//		
////		var arStrings:Object = Datas.instance().arStrings();
//		chestName.txt = Datas.getArString("itemName.i" + chestId);
//		chestDesc.txt = Datas.getArString("itemDesc.i" + chestId);
//		chestIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture("i"+ chestId, TextureType.ICON_ITEM);//Resources.Load("Textures/UI/icon/icon_item/i"+ chestId);
//		
//		InitSubItem();
//	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);
			chestBg.Draw();
			backBtn.Draw();
			chestIcon.Draw();
			chestName.Draw();
			chestDesc.Draw();
			
			itemList.Draw();
		GUI.EndGroup();
	}
	
	function Update()
	{
		itemList.Update();
	}
	
	private function InitSubItem()
	{
		var data:Array = new Array();
		var subItems:HashObject = Datas.instance().chestlist()["i"+ chestId];
		var newItem:InventoryInfo;
		var keys:Array =  _Global.GetObjectKeys(subItems);
		for(var i:int = 0; i < keys.length; i++ )
		{
			newItem = new InventoryInfo();
			newItem.id = _Global.INT32(keys[i]);
			newItem.quant = _Global.INT32(subItems[keys[i]]);
			data.Push(newItem);
		}
		
		itemList.SetData(data);
		itemList.ResetPos();
	}
}