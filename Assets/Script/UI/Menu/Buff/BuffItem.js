class BuffItem
{
	public var id:int;
	public var type:int;
	public var sub_icon:String;
	public var sub_des:String;
	public var sub_name:String;
	public var sub_owned:int;
	public var sub_price:int;
	public var sub_salePrice:int;
	public var startTime:long;
	public var endTime:long;
	public var isShow:int;
	
	public function parseBuffItem(buffType:int, Id:int, shopCategory:int):void
	{		
		id = Id;
		type = buffType;
		sub_icon = "i" + id;
		sub_des = Datas.instance().getArString("itemDesc."+ "i"+ id);
		sub_name = Datas.instance().getArString("itemName."+"i" + id);
		sub_owned = getItemCount(id);
		
		if(buffType != Constant.BuffType.BUFF_TYPE_CARMOTCOLLECT)
		{
			var item:Hashtable = Shop.instance().getItem(shopCategory, id);
			sub_price = item["price"];
			sub_salePrice = item["salePrice"];
			startTime = _Global.INT64(item["startTime"]);
			endTime = _Global.INT64(item["endTime"]);	
			isShow = item["isShow"];
		}	
	}
	
	private function getItemCount(id:int):int	
	{
		var seed:HashObject = GameMain.instance().getSeed();
		return seed["items"]["i" + id] ? _Global.INT32(seed["items"]["i" + id]) : 0;
	}	
}