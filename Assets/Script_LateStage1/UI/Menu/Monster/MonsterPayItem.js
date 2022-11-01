

public class MonsterPayItem extends ListItem
{
	public var l_icon:Label;
	public var l_price:Label;
	public var l_priceIcon:Label;
	public var l_bg:Label;
	@SerializeField
	public var btnDefault:Button;

	private var itemData : HashObject;

	protected var _data:Payment.PaymentElement;

	public function Init()
	{
		super.Init();
		l_price.Init();
		l_icon.Init();
		l_priceIcon.Init();
		l_bg.Init();
		btnDefault.Init();


		// btnDefault.mystyle.normal.background =  TextureMgr.instance().LoadTexture("listbackground",TextureType.DECORATION);

		btnDefault.OnClick = buy;

		// l_icon.useTile = true;
		// l_icon.tile = TextureMgr.instance().ElseIconSpt().GetTile(null);
		btnDefault.txt=Datas.getArString("Labyrinth.Buy");
		// l_priceIcon.useTile = true;
		// l_priceIcon.tile =  TextureMgr.instance().ElseIconSpt().GetTile("gems");
		// l_priceIcon.SetRectWHFromTile();

	}

	private function buy():void
	{
		var okFunction:function():void=function():void
		{
			MenuMgr.getInstance().sendNotification("Monster_buyItem",null);
		};
		Shop.instance().BuyInventory(_Global.INT32(itemData["id"]), _Global.INT32(itemData["price"]), 1, false,okFunction);
	}

	public function DrawItem()
	{
		//GUI.BeginGroup(rect);
	    DrawInternal();
		//GUI.EndGroup();
	}
    
    protected function DrawInternal()
    {
        btnDefault.Draw();  
        l_bg.Draw();
        l_icon.Draw();    
        l_price.Draw();
        l_priceIcon.Draw();         
    }

	public function SetRowData(data:System.Object):void
	{
        itemData = data as HashObject;
        // l_icon.tile.name=TextureMgr.instance().LoadTileNameOfItem(_Global.INT32(itemData["id"]));
        l_icon.mystyle.normal.background=TextureMgr.instance().LoadTexture("i"+_Global.INT32(itemData["id"]),TextureType.MONSTER_BOSS);
		l_price.txt=itemData["price"].Value.ToString();
	}


	public function getData():Payment.PaymentElement
	{
		return _data;
	}
}