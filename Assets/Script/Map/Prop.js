public class Prop extends KBN.Prop
{	
	public static function getInstance():Prop
	{
		if(_instance == null){
			_instance = new Prop();
			GameMain.instance().resgisterRestartFunc(function(){
				_instance = null;
			});
		}
		return _instance as Prop;
	}	
	private function Prop()
	{
	}
	private var seed:HashObject;
	public function init(seed:HashObject):void
	{
		this.seed = seed;
	}
	///
	
	private static var spedID:Array = [1,2,3,4,5,6,7,24,34];
	
	public function getSpeedUpPropList():Array
	{
		var pid:int;
		var i:int;
		var pvo:PropVO;
		var cd:Object;
		var TID:Object = Datas.instance().itemlist();
		var list:Array ;
		
		list = _Global.GetObjectKeys(TID);
		
		list = new Array();
		for(i=0; i<spedID.length; i++)
		{
			pvo = this.getPropById(spedID[i]);
			list.push(pvo);
		}		
		return list;		
	}
	
	public function getBoostCombatProp(pid:int):PropVO
	{
		var pvo:PropVO = this.getPropById(pid);
		var obj:String;
		switch(pid)
		{
			case 261:
			case 262:
				obj = seed["bonus"]["bC2600"]["bT2601"].Value as String;
				break;
			case 263:
				obj = seed["bonus"]["bC2600"]["bT2604"].Value as String;
				break;
			case 281:
				obj = seed["bonus"]["bC2600"]["bT2602"].Value as String;
				break;
			case 271:
			case 272:
				obj = seed["bonus"]["bC2700"]["bT2701"].Value as String;
				break;
			case 273:
				obj = seed["bonus"]["bC2700"]["bT2704"].Value as String;
				break;	
			case 301:
				obj = seed["bonus"]["bC2700"]["bT2702"].Value as String;
				break;		
		}
		if(obj)
		{
			pvo.expire = _Global.parseTime(obj);
		}
		return pvo;
	}
	
	
	public function getPropById(pid:int):PropVO
	{
		var TID:HashObject = Datas.instance().itemlist();
//		var arStrings:Object = Datas.instance().arStrings();
		var pvo:PropVO;
		var ItemData : HashObject;

		pvo = new PropVO();
		pvo.id = pid;
		ItemData = TID["i" + pvo.id];
		pvo.name = Datas.getArString("itemName.i" + pvo.id);//ItemData["name"];
		pvo.description = Datas.getArString("itemDesc.i" + pvo.id);//ItemData["description"];
		pvo.price = _Global.INT32(ItemData["price"]);
		pvo.category = _Global.INT32(ItemData["category"]);
		pvo.propNum = this.getPropNum(pvo.id);
		return pvo;
	}
		
	public function getPropNum(pid:int):int
	{
		var v:Object = seed["items"]["i" + pid]?seed["items"]["i" + pid].Value:null;
		if(v)
			return _Global.INT32(v);
		return 0;	
	}
	
}

