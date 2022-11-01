class TournamentCompleteMenu extends PopMenu
{
	public var betweenLine:Label;
	public var description:Label;
	public var btnReward:Button;
	
	private var needCloseBtn : boolean = false;
	public function Init():void
	{
		super.Init();
		title.txt=Datas.getArString("PVP.Report_End_Title");
		if( needCloseBtn ) {
			btnClose.txt="";
			btnClose.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_popup1_close_normal",TextureType.BUTTON);
			btnClose.mystyle.active.background=TextureMgr.instance().LoadTexture("button_popup1_close_down",TextureType.BUTTON);
		}
		betweenLine.setBackground("between line",TextureType.DECORATION);
		description.txt=Datas.getArString("PVP.Report_End_Desc");
		btnReward.txt=Datas.getArString("Common.OK_Button");
		btnReward.changeToBlueNew();
		btnReward.OnClick = function(param:Object)
		{
			var paramHash:HashObject = new HashObject(
				{"MenuType" : TournamentTroopRestoreMenu.MENU_TYPE.WORLD_MAP}
			);
			MenuMgr.getInstance().PopMenu( "TournamentCompleteMenu" );
			MenuMgr.getInstance().PushMenu( "TournamentTroopRestoreMenu", paramHash, "trans_zoomComp" );
			/*
			UpdateSeed.instance().update_seed_ajax(true, null);
			var seed:HashObject = GameMain.singleton.getSeed();
			if(seed==null)
			{
				return;
			}
			else if(seed["worldmap"]==null)
			{
				return;
			}
			else if(seed["worldmap"]["troop"]==null)
			{
				return;
			}
			else
			{
				if(seed["worldmap"]["troop"].Value==0)
				{
					MenuMgr.getInstance().PopMenu( "TournamentCompleteMenu" );
					MenuMgr.getInstance().PushMenu( "TournamentTroopRestoreMenu", paramHash, "trans_zoomComp" );
				}
				else if(seed["worldmap"]["troop"].Value==1)//no troops back or already back, do what? asking xuezheng......
				{
					MenuMgr.getInstance().PopMenu( "TournamentCompleteMenu" );
				}
				else
				{
					MenuMgr.getInstance().PopMenu( "TournamentCompleteMenu" );
				}
			}
			*/
			
			
		};
		
	}
	
	public function handleNotification(type : String, param : Object) : void
    {
    }
    
	function Update() 
	{
		super.Update();
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush( param );
		
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
	}
	
	public function DrawItem()
	{
		title.Draw();
		betweenLine.Draw();
		description.Draw();
		btnReward.Draw();
	}
}