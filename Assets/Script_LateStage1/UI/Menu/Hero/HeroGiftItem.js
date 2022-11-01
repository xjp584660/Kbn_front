public class HeroGiftItem extends ListItem
{
	@SerializeField
	private var line : Label;
    @SerializeField
    private var owned : Label;

	private var heroItem : InventoryInfo = null;

	public function Init() : void
	{
	    btnSelect.txt = Datas.getArString("BatchPurchase.Usebutton");

	    btnSelect.OnClick = OnSelectClick;
	}

	public function Update() : void
	{
	}

	public function Draw() : int
	{
		if (heroItem == null)
		{
			return;
		}

		GUI.BeginGroup(rect);
		icon.Draw();
		owned.Draw();
		title.Draw();
		description.Draw();
		btnSelect.Draw();
		line.Draw();
		GUI.EndGroup();

		return -1;
	}

	public function SetRowData(data : Object) : void
	{
	    heroItem = data as InventoryInfo;
		if (heroItem == null)
		{
			return;
		}

	    icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
	    icon.tile.name = TextureMgr.instance().LoadTileNameOfItem(heroItem.id);
	    title.txt = Datas.getArString(String.Format("itemName.i{0}", heroItem.id.ToString()));
	    description.txt = heroItem.description;
		UpdateData();
	}

	public function UpdateData() : void
    {
	    if (heroItem.quant > 0)
	    {
	        btnSelect.changeToBlueNew();
	    }
	    else
	    {
	        btnSelect.changeToGreyNew();
	    }

        if (heroItem.id < Constant.Hero.HeroLevelUpItemFrom)
        {
            btnSelect.txt = Datas.getArString("BatchPurchase.Usebutton");
        }
        else
        {
            btnSelect.txt = Datas.getArString("Common.Use_button");
        }

	    owned.txt = String.Format("{0}:{1}", Datas.getArString("Common.Owned"), heroItem.quant.ToString());
    }

    private function TryUseHeroLevelUpItem(heroItem : InventoryInfo, heroGift : HeroGift) : void
    {
        if (heroGift == null)
        {
            return;
        }

        if (!heroGift.HeroCanUseLevelUpItem(heroItem))
        {
            ErrorMgr.instance().PushError(String.Empty, Datas.getArString("Error.err_26"));
            return;
        }

        heroGift.RequestBoost(heroItem.id);
    }

    private function GetMaxAvailableNumber()
    {
    	var heroInfo : KBN.HeroInfo = KBN.HeroManager.Instance.GetHeroInfo( heroItem.customParam1 );
    	if( heroInfo == null )
    	{
    		return 0;
    	}
    	var upperBoundsLevel : int = heroInfo.MaxLevelOfElevate( heroInfo.Elevate );
    	if( heroInfo.Level >= upperBoundsLevel ) // The player reaches the upper bounds of the level
    	{
    		return 0;
    	}

    	var upperBoundsRenown : int = heroInfo.GetRenownOfLevel( upperBoundsLevel - 1 );
    	var renownDiff = upperBoundsRenown - heroInfo.CurTotalRenown;
    	if( renownDiff <= 0 ) // Unexpected error
    	{
    		return 0;
    	}

    	var gdsItem : KBN.DataTable.HeroCommon = GameMain.GdsManager.GetGds.<KBN.GDS_HeroCommon>().GetItemById( 1 );
    	var itemRenown : String[] = gdsItem.RENOWN_VALUE_.Split('*'[0]);
    	var itemIndex : int = heroItem.id % 10;
    	if( itemIndex >= 0 && itemIndex < itemRenown.Length )
    	{
    		var renownPerItem : int = _Global.INT32(itemRenown[itemIndex]);
    		var number : int = renownDiff / renownPerItem;
    		if( renownDiff % renownPerItem > 0 )
    			number++;
    		return number;
    	}
    	return 0;
    }

	private function OnSelectClick(param : Object) : void
	{
        if (heroItem.id < Constant.Hero.HeroGiftItemFrom || heroItem.id > Constant.Hero.HeroGiftItemTo)
        {
            return;
        }

        var heroGift : HeroGift = MenuMgr.getInstance().getMenu("HeroGift") as HeroGift;

        if (heroItem.id >= Constant.Hero.HeroLevelUpItemFrom)
        {
            TryUseHeroLevelUpItem(heroItem, heroGift);
            return;
        }

        // TODO: Use this value to limit the number of the items to use.
		var upperBoundsNumber : int = GetMaxAvailableNumber();
		var useParam : BatchUseAndBuyDialog.BatchBuyAndUseParam = new BatchUseAndBuyDialog.BatchBuyAndUseParam();
		useParam.itemId = heroItem.id;
		useParam.mayGropGear = false;
		useParam.isBuy = false;
		useParam.useDelegateOnUse = true;
		useParam.myDelegateOnUse = function( times : int ) {
			//var heroGift : HeroGift = MenuMgr.getInstance().getMenu("HeroGift") as HeroGift;
		    if (heroGift == null)
		    {
		        return;
		    }

		    heroGift.RequestBoost(heroItem.id, times);
		};
		useParam.upperBoundsNumber = upperBoundsNumber;
		MenuMgr.getInstance().PushMenu("BatchUseAndBuyDialog", useParam, "trans_zoomComp");
	}
}
