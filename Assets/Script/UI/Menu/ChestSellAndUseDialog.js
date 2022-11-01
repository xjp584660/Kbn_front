#pragma strict

public class ChestSellAndUseDialog extends PopMenu
{
    @SerializeField
	private var m_btnUse : Button;
	@SerializeField
    private var m_btnSell : Button;

    @SerializeField
    private var m_bg : Label;

    @SerializeField
    private var m_title2 : Label;

    @SerializeField
    private var m_itemIcon : SimpleLabel;
    
    @SerializeField
    private var m_itemName : SimpleLabel;

    @SerializeField
    private var m_itemDesc : SimpleLabel;
    
    @SerializeField
    private var m_splice : SimpleLabel;
    


    private var itemId:int;


    public function Init()
	{
		super.Init();
        var texMgr : TextureMgr = TextureMgr.instance();
        m_btnUse.txt = Datas.getArString("Common.Use_button");
        m_btnSell.txt = Datas.getArString("Common.Sell");
        m_splice.mystyle.normal.background = texMgr.LoadTexture("between line", TextureType.DECORATION);
        title.txt = Datas.getArString("Sellitem.GearChestSell_Tilte");
        m_title2.txt = Datas.getArString("Sellitem.GearChestSell_Text");
      

        
	}
    public function OnPush(param : Object)
	{
        itemId = _Global.INT32(param);
        this.m_btnUse.OnClick = priv_UseItem;
        this.m_btnSell.OnClick = priv_SellItem;
        var itemName : String = TextureMgr.instance().LoadTileNameOfItem(itemId);
		m_itemIcon.useTile = true;
        m_itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(itemName);
        m_itemName.txt = Datas.getArString("itemName.i" + itemId.ToString());
       
        m_itemDesc.txt = Datas.getArString("itemDesc.i" + itemId.ToString());
       
    }

    public function OnPushOver():void{
        m_title2.mystyle.normal.textColor = Color.grey;
        m_itemName.mystyle.normal.textColor = Color.yellow;
        m_itemDesc.mystyle.normal.textColor = Color.white;
    }

    public function DrawItem()
	{
        m_btnUse.Draw();
        m_btnSell.Draw();
        btnClose.Draw();
        m_splice.Draw();
        m_title2.Draw();
        m_bg.Draw();
        m_itemIcon.Draw();
        m_itemName.Draw();
        m_itemDesc.Draw();
        
	}
    private function priv_UseItem()
    {
        MenuMgr.getInstance().PopMenu("");
        MyItems.instance().Use(itemId);
    }
    private function priv_SellItem()
    {
       
        MenuMgr.getInstance().PopMenu("");

        MenuMgr.getInstance().PushMenu("SellItemPopupMenu", itemId, "trans_zoomComp");
    }
}