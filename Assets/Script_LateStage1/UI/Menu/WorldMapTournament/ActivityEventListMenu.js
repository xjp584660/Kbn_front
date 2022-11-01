class ActivityEventListMenu extends KBNMenu
{
	//定义menu顶部资源条 start
	public var clone_menuHead : MenuHead;
	public var menuHead : MenuHead;
	//end
	//定义列表
	public var actList:ScrollList;
	//定义模版
	public var actListTemplate:ActListItem;
	//初始化
	public function Init():void
	{
		super.Init();
		var borderX:int = 8;
		var borderY:int = 11;
		if( btnClose ){
			btnClose.rect = Rect(rect.width - 100 - borderX, 0, 100 + borderX, 100 + borderY);
			if ( btnClose.mystyle.normal.background == null )
			{
				var texMgr : TextureMgr = TextureMgr.instance();
				btnClose.mystyle.normal.background = texMgr.LoadTexture("button_popup1_close_normal", TextureType.BUTTON);
				btnClose.mystyle.active.background = texMgr.LoadTexture("button_popup1_close_down", TextureType.BUTTON);
			}

			btnClose.mystyle.overflow.left = btnClose.mystyle.normal.background.width - 100;
			btnClose.mystyle.overflow.bottom = btnClose.mystyle.normal.background.height  - 100;
			btnClose.mystyle.overflow.top =  -borderY;
			btnClose.mystyle.overflow.right =  - borderX;

			btnClose.OnClick = function()
			{
				MenuMgr.getInstance().PopMenu("");
			};
		}
		menuHead = GameObject.Instantiate(clone_menuHead);
		menuHead.Init();
		menuHead.SetVisible(true);
		menuHead.l_title.txt=Datas.getArString("Board.Title");	
		
		actList.Init(actListTemplate);
		
		
	    var touListArray:Array=new Array();
    	
		var tmpListdata:ActListData=new ActListData();
		//AvA Event
		tmpListdata=new ActListData();
		tmpListdata.actType=2;
		tmpListdata.isActivityTurnedOn=true;
		touListArray.Add(tmpListdata);
		//world boss
		tmpListdata=new ActListData();
		tmpListdata.actType=3;
		tmpListdata.isActivityTurnedOn=true;
		touListArray.Add(tmpListdata);
		//PVE null data
		tmpListdata=new ActListData();
		tmpListdata.actType=1;
		tmpListdata.isActivityTurnedOn=false;
		touListArray.Add(tmpListdata);
		//PVP null data
		tmpListdata=new ActListData();
		tmpListdata.actType=0;
		tmpListdata.isActivityTurnedOn=false;
		touListArray.Add(tmpListdata);

		actList.SetData(touListArray);

	
		PvPToumamentInfoData.instance().RequestToumamentInfo();
	}
	
	function Update() 
	{
		super.Update();
		actList.Update();
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush( param );
		UpdateSeed.instance().update_seed_ajax(true, null);
		menuHead.rect.height = Constant.UIRect.MENUHEAD_H1;
		menuHead.backTile.rect.height = 130;
//		bgMiddleBodyPic = TextureMgr.instance().BackgroundSpt().GetTile("ui_paper_bottom");
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottom");
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		actList.Clear();
        TryDestroy(menuHead);
	}
	public override function DrawBackground()
	{
		menuHead.Draw();
		DrawMiddleBg();
	}
	public function DrawItem()
	{
		frameTop.Draw();
		btnClose.Draw();
		actList.Draw();
	}
	
	public function handleNotification(type : String, param : Object) : void
    {
    	switch (type)
	    {
            case Constant.PvPResponseOk.ToumamentInfoOK:
            var touListArray:Array=new Array();
			var tmpListdata:ActListData=new ActListData();
			//AvA Event
			tmpListdata=new ActListData();
			tmpListdata.actType=2;
			tmpListdata.isActivityTurnedOn=true;
			touListArray.Add(tmpListdata);	

			//AvA Event
			tmpListdata=new ActListData();
			tmpListdata.actType=3;
			tmpListdata.isActivityTurnedOn=true;
			touListArray.Add(tmpListdata);

			//PVE data
			tmpListdata=new ActListData();
			tmpListdata.actType=1;
			if( KBN.AllianceBossController.instance().rewardEndTime!=0 )//=0:has no activity
			{
				tmpListdata.isActivityTurnedOn=true;
			}
			else
			{
				tmpListdata.isActivityTurnedOn=false;
			}
			touListArray.Add(tmpListdata);

			//PVP data
			tmpListdata=new ActListData();
			tmpListdata.actType=0;
			if( KBN.TournamentManager.getInstance().isTournamentTurnedOn() )
			{
				tmpListdata.isActivityTurnedOn=true;
			}
			else
			{
				tmpListdata.isActivityTurnedOn=false;
			}
			touListArray.Add(tmpListdata);

			actList.SetData(touListArray);
            break;
        }
    }
	
}