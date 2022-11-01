class AllianceBossResetMenu extends PopMenu
{
	@SerializeField private var line:Label;
	@SerializeField private var topDesc:Label;
	@SerializeField private var bottomDesc:Label;
	@SerializeField private var buyBtn:Button;
	@SerializeField private var itemIcon:Label;
	@SerializeField private var itemNum :SimpleLabel;
	private var isReset:boolean = false;
	
	public function Init():void
	{
		super.Init();
		btnClose.OnClick = handleBack;
		buyBtn.OnClick = handleReset;
		
		line.setBackground("between line",TextureType.DECORATION);
		
		buyBtn.setNorAndActBG("button_60_blue_normalnew","button_60_blue_downnew");
		
		title.txt = Datas.getArString("Dungeon.Retry_Title");
		topDesc.txt = Datas.getArString("Dungeon.Retry_Desc");
		bottomDesc.txt = Datas.getArString("Dungeon.Retry_Notice");
		itemIcon.useTile = true;
		itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		itemIcon.tile.name = TextureMgr.instance().LoadTileNameOfItem(KBN.AllianceBossController.RESET_ITEM_ID);
		buyBtn.txt = Datas.getArString("Common.Use_button");//"Use";
	}
	
	public function DrawItem()
	{
		line.Draw();
		topDesc.Draw();
		buyBtn.Draw();
		bottomDesc.Draw();
		itemIcon.Draw();
		itemNum.Draw();
	}
	
	function Update() 
	{
	}
	
	public function OnPush(param:Object)
	{
		isReset = false;
		var itemCount:long = MyItems.instance().countForItem(KBN.AllianceBossController.RESET_ITEM_ID);
		itemNum.txt = Datas.getArString("Common.Owned") + ': ' + itemCount;
		if(itemCount<=0)
		{
			buyBtn.SetVisible(false);
			bottomDesc.SetVisible(true);
		}
		else
		{
			buyBtn.SetVisible(true);
			bottomDesc.SetVisible(false);
		}
	}
	
	public function OnPop()
	{
		super.OnPop();
	}
	
	public function OnPopOver()
    {
        super.OnPopOver();
        
        itemIcon.tile.name = null;
		itemIcon.tile = null;
		
		if(isReset)
		{
			MenuMgr.getInstance().sendNotification (Constant.Notice.ALLIANCE_BOSS_RESET,"second");
		}
		isReset = false;
    }
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("AllianceBossResetMenu");
	}
	
	function handleReset()
	{
		KBN.AllianceBossController.instance().ReqAllianceBossReset();
	}
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
		case Constant.Notice.ALLIANCE_BOSS_RESET:
			if(body as String == "first")
			{
				isReset = true;
				MenuMgr.getInstance().PopMenu("AllianceBossResetMenu");
			}
			break;
		}
	}
}