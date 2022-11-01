public class CarmotTileTroopInfo extends ComposedUIObj
{
	public var l_title 	:Label;
	public var l_img 	:Label;
	
	public var l_bg1 :Label;	
	
	public var l_name 		:Label;
	public var l_type		:Label;
	public var l_speed		:Label;
	public var l_tileType	:Label;
	public var l_owner		:Label;
	
	
	public var scroll_troop:ScrollList;
	public var ins_troopItem :ListItem;
	

	public	var	seperateLine:Label;
	
	
	protected var wildTroop:Attack.TileTroopInfo;
	
	protected var data_loaded :boolean = false;	
	
	protected var marchId:int;
	protected var marchType:int;
	protected var fromCityId:int;
	
	private var buttonDefaultWidth:float;
	private var buttonDefaultRecallX:float;
	private var buttonDefaultSpeedupX:float;
	
	private var buttonSmallWidth:float;
	private var buttonSmalltHeight:float;
	
	public var  line:SimpleLabel;
	public var tileKey : String;
	
	public function Init():void
	{				
		seperateLine.setBackground("between line", TextureType.DECORATION);
		line.setBackground("between line", TextureType.DECORATION);
		scroll_troop.Init(ins_troopItem);
	}
	
   
	public function SetData(coordx:String,coordy:String):void
	{	
		tileKey = String.Concat(coordx, "_", coordy);	
		 var marchId = CollectionResourcesMgr.instance().GetResourcesMarchIdByCoord(coordx,coordy);
		 RallyPoint.instance().viewMarch(marchId, UpdateData);
	}
	
	public function UpdateData(result:HashObject){
	
		var march:HashObject = result["march"];
		var fromCityId:int= _Global.INT32(march["fromCityId"]);
		var curCityOrder:int = GameMain.instance().getCityOrderWithCityId(fromCityId);
		var carmotSeed:int=_Global.INT32(march["carmotCollectSpeed"]);// 每秒采集数量
		var carmotSpeedAdd:int= 0;
		if(march["heroCarmotSpeed"] !=null){
			var temp:float=_Global.FLOAT(march["heroCarmotSpeed"]);
			carmotSpeedAdd = temp;
		}
		
		var buffSpeedAdd : float = 0f;
		var tileType : int = CollectionResourcesMgr.instance().GetResourcesType(tileKey);
		if(tileType == Constant.CollectResourcesType.CARMOT)
		{
			var carmotBuffType : int = BuffAndAlert.instance().getCarmotCollectBuffType();
			if(carmotBuffType == 1)
			{
				buffSpeedAdd = 0.5f;
				carmotSpeedAdd += buffSpeedAdd * carmotSeed *3600;
			}
			else if(carmotBuffType == 2)
			{
				buffSpeedAdd = 1f;
				carmotSpeedAdd += buffSpeedAdd * carmotSeed * 3600;
			}
		}
		else
		{
			var collectResourceBuffType : int = BuffAndAlert.instance().getResourceCollectBuffType();
			if(collectResourceBuffType != 0)
			{
				buffSpeedAdd = 0.5f;
				carmotSpeedAdd += buffSpeedAdd * carmotSeed * 3600;
			}
		}
		
		carmotSeed *=3600;// 每hour采集数量
		l_name.txt = Datas.getArString("Common.General") +": " +  General.singleton.getKnightShowName(march["knightName"].Value, curCityOrder);
		l_img.useTile = true;
		l_img.tile = TextureMgr.instance().GeneralSpt().GetTile(General.getGeneralTextureName(march["knightName"].Value, curCityOrder));
		l_tileType.txt = Datas.getArString("Common.TileType") +": " + March.getTileTypeString(_Global.INT32(result["march"]["toTileType"] ) );
		l_owner.txt = Datas.getArString("Common.Owner") +": " + GameMain.instance().getSeed()["player"]["name"].Value;
		if(carmotSpeedAdd > 0){
			l_speed.txt=Datas.getArString ("Newresource.tile_gatherspeed")  +_Global.NumSimlify(carmotSeed)+"/h <color=#348620>+ "+_Global.NumSimlify(_Global.INT32(carmotSpeedAdd)) +"/h</color>"; 
		}else
		l_speed.txt=Datas.getArString("Newresource.tile_gatherspeed")  +_Global.NumSimlify(carmotSeed)+"/h"; 
		var ul:Array = new Array();
			
		var num:int;
		var id;
		for(var i:int=0; i<Constant.MAXUNITID; i++)
		{
			num = _Global.INT32(march["unit"  +i + "Return"]);
			if(num > 0)
			{
				id = Barracks.instance().creatTroopInfo(i,num);	//{"unitId":i,"unitNum":num};
				ul.push(id);				
			}
		}
		ul.Sort(Barracks.TroopInfo.CompareById);
		if (HeroManager.Instance().GetHeroEnable())
		{
			var index : int = 0;
			while (true)
			{
				if (march["hero" + index.ToString()] == null)
				{
					break;
				}
				ul.Splice(0, 0,_Global.GetString(march["hero" + index.ToString()]));
//				ul.Push(_Global.GetString(march["hero" + index.ToString()]));
				index++;
			}
		}
		scroll_troop.SetData(ul);
	}
	
	public function Update()
	{
		super.Update();
		
	}
	
	public function onClose(){
		
	}	
	
	public function Clear()
	{
		scroll_troop.Clear();
	}
}
