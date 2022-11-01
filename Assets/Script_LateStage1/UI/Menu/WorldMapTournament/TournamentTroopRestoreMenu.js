class TournamentTroopRestoreMenu extends PopMenu
{
	public enum MENU_TYPE
	{
		WORLD_MAP = 0,
		ALLIANCE_BOSS,
	};
	private var menuType:MENU_TYPE;
	public var betweenLine:Label;
	public var description:Label;
	public var listBackground:Label;
	public var lbTroops:Label;
	public var lbRestore:Label;
	public var lineUp:Label;
	public var btnOK:Button;
	public var troopList:ScrollList;
	public var troopListTemplate:RestoreListItem;
	private var needCloseBtn : boolean = false;
	private var needConfirmBtn : boolean = true;
	
	
	public function Init():void
	{
		super.Init();
		
		btnClose.txt="";
		btnClose.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_popup1_close_normal",TextureType.BUTTON);
		btnClose.mystyle.active.background=TextureMgr.instance().LoadTexture("button_popup1_close_down",TextureType.BUTTON);
		betweenLine.setBackground("between line",TextureType.DECORATION);
		lineUp.setBackground("bg_line_bright",TextureType.DECORATION);
		listBackground.setBackground("Quest_kuang",TextureType.DECORATION);
		btnOK.txt=Datas.getArString("Event.End_ClaimTroop");
		btnOK.changeToBlueNew();
		btnOK.OnClick = function(param:Object)
		{
			if(menuType == MENU_TYPE.ALLIANCE_BOSS)
			{
				MenuMgr.getInstance().PopMenu( "TournamentTroopRestoreMenu" );
			}
			else if(menuType == MENU_TYPE.WORLD_MAP)
			{
				MenuMgr.getInstance().PopMenu( "TournamentTroopRestoreMenu" );
				NoticePadMenu.backButtonMotifIsHome = true;
				PvPToumamentInfoData.instance().PopUpNoticePad(2);
			}
		};
		// Init the list
		troopList.Init(troopListTemplate);
	}
	
	function Update() 
	{
		super.Update();
		troopList.Update();
	}
	
	public function handleNotification(type : String, param : Object) : void
    {
        switch (type)
	    {
            case Constant.PvPResponseOk.WorldMapTroopRestoreOK:
            	troopList.Clear();
            	var items:Array = GetItemData(param);
            	var total:int=0;
            	for(var i:int=0;items!=null&&i<items.length;i++)
            	{
            		total+=(items[i] as RestoreListData).num;
            		if((items[i] as RestoreListData).num!=0)
            		{
            			break;
            		}
            	}
            	if(total==0)
            	{
            		MenuMgr.instance.PushMessage(Datas.getArString("Event.Losttroop_Empty"));
            	}
            	if(items!=null)
				{
					troopList.SetData( items );
				}
            	break;
            case Constant.Notice.ALLIANCE_BOSS_TROOP_DATA_OK:
            	RefreshMenu(param);
            	break;
      	}	
    }
    
    private function GetItemData(param : Object):Array
    {
    	var items:Array = new Array();
      	var fields : Array = _Global.ToString(param).Split( "_"[0] );
      	if( fields.Count % 2 != 0 )
      		return;
      	var numUnits = fields.Count / 2;
      	for( var i : int = 0; i < numUnits; ++i ) {
      		var id : String = fields[i*2];
      		var num : String = fields[i*2+1];
      		var newData:RestoreListData = new RestoreListData();
      		newData.type = Datas.instance().getArString("unitName."+"u" + id);
      		newData.num = _Global.INT32( num );
      		items.Add( newData );
      	}
      	return items;
    }
    
	public function OnPush(param:Object)
	{
		super.OnPush( param );
		if(param == null ) {
			return;
		}
		RefreshMenu(param);
	}
	
	private function RefreshMenu(param:Object)
	{
		var data:HashObject = param as HashObject;
		var isViewingTroop : boolean = false;
		
		menuType = _Global.INT32(data["MenuType"]);
		if(menuType == MENU_TYPE.ALLIANCE_BOSS)
		{
			troopList.Clear();
			var paramData:Object = data["Data"] as Object;
			var items:Array = GetItemData(paramData);
			troopList.SetData( items );
			isViewingTroop = _Global.GetBoolean(data["isViewTroop"]);
			needConfirmBtn=!isViewingTroop;
			needCloseBtn=!needConfirmBtn;
	
			if( isViewingTroop ) {
				description.txt=Datas.getArString("Event.Losttroop_Desc");
				lbTroops.txt=Datas.getArString("Common.Troops");
				lbRestore.txt=Datas.getArString("Event.Losttroop_Lost");
				title.txt=Datas.getArString("Event.LostTroop_Title");
			} else {
				description.txt=Datas.getArString("PVP.RestoreTroops_Desc");
				lbTroops.txt=Datas.getArString("Common.Troops");
				lbRestore.txt=Datas.getArString("PVP.RestoreTroops_Restore");
				title.txt=Datas.getArString("PVP.RestoreTroops_Title");
			}
//			var seed : HashObject = GameMain.instance().getSeed();
//			if(seed["pveAllianceBoss"] != null && _Global.INT32(seed["pveAllianceBoss"]["troopReturn"]) != 0)
//				needConfirmBtn = true;
		}
		else if(menuType == MENU_TYPE.WORLD_MAP)
		{			
			isViewingTroop = _Global.GetBoolean(data["isViewTroop"]);
			needConfirmBtn=!isViewingTroop;
			needCloseBtn=!needConfirmBtn;
	
			if( isViewingTroop ) {
				description.txt=Datas.getArString("Event.Losttroop_Desc");
				lbTroops.txt=Datas.getArString("Common.Troops");
				lbRestore.txt=Datas.getArString("Event.Losttroop_Lost");
				title.txt=Datas.getArString("Event.LostTroop_Title");
				KBN.TournamentManager.getInstance().requestTroopRestoreCheck();
			} else {
				description.txt=Datas.getArString("PVP.RestoreTroops_Desc");
				lbTroops.txt=Datas.getArString("Common.Troops");
				lbRestore.txt=Datas.getArString("PVP.RestoreTroops_Restore");
				title.txt=Datas.getArString("PVP.RestoreTroops_Title");
				KBN.TournamentManager.getInstance().requestTroopRestoreAcquirement();
			}
		}
		
		btnClose.SetVisible(needCloseBtn);
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		troopList.Clear();
	}
	
	public function DrawItem()
	{
		title.Draw();
		betweenLine.Draw();
		description.Draw();
		listBackground.Draw();
		lbTroops.Draw();
		lbRestore.Draw();
		lineUp.Draw();
		if(needConfirmBtn)
		{
			btnOK.Draw();
		}
		troopList.Draw();
	}
}