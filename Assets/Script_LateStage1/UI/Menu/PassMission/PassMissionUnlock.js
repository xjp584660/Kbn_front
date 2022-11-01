class PassMissionUnlock extends PopMenu
{
    public var titleName : Label;
    public var line : Label;
    public var content : Label;
    public var itemIcon : Label;
    public var itemCount : Label;
    public var btnOk : Button;
    public var btnCancel : Button;
    public var btnCloseMenu : Button;
	
	function Init()
	{
        super.Init();
        titleName.txt = Datas.getArString("PassMission.Title");
        content.txt = Datas.getArString("PassMission.UnlockText1");
        btnOk.OnClick = btnOkOnClicked;
        btnOk.txt = Datas.getArString("Common.OK_Button");
        btnCancel.OnClick = btnCancelOnClicked;
        btnCancel.txt = Datas.getArString("Common.Cancel");
        itemIcon.useTile = true;
        itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
        btnCloseMenu.OnClick = btnCloseMenuOnClicked;
	}
	
	public function OnPush(param:Object)
	{
        var texMgr : TextureMgr = TextureMgr.instance();
        itemIcon.tile.name = texMgr.LoadTileNameOfItem(Constant.PassMission.OpenPassMissionItemId);
        var unlockPassItemCount : int = PassMissionMapManager.Instance().GetUnlockPassItemCount();
        itemCount.txt = String.Format(Datas.getArString("PassMission.UnlockText2"), unlockPassItemCount);
        if(unlockPassItemCount > 0)
        {
            //btnOk.EnableBlueButton(true);
            btnOk.txt = Datas.getArString("Common.OK_Button");
        }
        else
        {
          btnOk.txt = Datas.getArString("paymentLabel.buyNow");
            //btnOk.EnableBlueButton(false);
        }
        var img : Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile (img, "ui_paper_bottomSystem");
    }
    
    public function Draw()
	{
		super.Draw();
	}
	
	function DrawItem()
	{
        super.DrawItem ();
        titleName.Draw();
        line.Draw();
        content.Draw();
        itemIcon.Draw();
        itemCount.Draw();
        btnOk.Draw();
        btnCancel.Draw();
        btnCloseMenu.Draw();
	}
	
	function Update()
	{
		
	}
	
	public function OnPopOver()
	{
		
	}

	private function btnOkOnClicked(param : System.Object) : void
    {
      if(btnOk.txt == Datas.getArString("Common.OK_Button"))
      {
        PassMissionMapManager.Instance().unlockPassSeassion();
      }
      else if(btnOk.txt == Datas.getArString("paymentLabel.buyNow"))
      {
        MenuMgr.getInstance().PopMenu("PassMissionUnlock");
        Payment.instance().setCurNoticeType(8);

        var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetDisplayDataByDisplayPosition();
        if ( offerData == null )
          return;

        MenuMgr.getInstance().PushMenu("OfferMenu", Constant.OfferPage.PassMapOpen, "trans_zoomComp");  
      }
    }

    private function btnCancelOnClicked(param : System.Object) : void
    {
		MenuMgr.getInstance().PopMenu("PassMissionUnlock");
    }

    private function btnCloseMenuOnClicked(param : System.Object) : void
    {
		MenuMgr.getInstance().PopMenu("PassMissionUnlock");
    }
}

