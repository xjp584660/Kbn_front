


class NewCastleMenu extends KBNMenu
{

	@Space(30) @Header("----------NewCastleMenu----------")

	public var toolBar:ToolBar;
	public var menuHead:MenuHead;
	public var clone_menuHead : MenuHead;
	public var conquerContent:ConquerContent;
	public var standardBuildingContent:StandardBuildingContent;
	public var overviewContent:OverviewContent;	
    
    @SerializeField
    private var defenseContent : CastleDefenseContent;

    public var new_defenseContent:NewCastleDefenseContent;
	
	private var tabString:Array;
	private var tabUI:Array;
	private var curUI:UIObject;
//	private static var g_instance:NewCastleMenu;
	private var g_buildInfor:Building.BuildingInfo;
	
	function Init()
	{
		if ( clone_menuHead != null )
			menuHead = Instantiate(clone_menuHead);
		if ( menuHead != null )
			menuHead.Init();
		
		toolBar.Init();
		toolBar.selectedIndex = 0;
		toolBar.indexChangedFunc = indexChangedFunc;
				
		conquerContent.Init();
		standardBuildingContent.Init();
		overviewContent.Init();
        defenseContent.Init();
        new_defenseContent.Init();
		
		if (GameMain.singleton.IsHideTroopLimitServer()) {
			tabUI = [standardBuildingContent, overviewContent, conquerContent, new_defenseContent];
		}else{
			tabUI = [standardBuildingContent, overviewContent, conquerContent, defenseContent];
		}
		curUI = tabUI[0];
		
//		g_instance = this;
	}

//	public static function getInstance():NewCastleMenu
//	{
//		if(!g_instance)
//		{
//			g_instance = new NewCastleMenu();
//		}
//		
//		return g_instance;
//	}
	
	protected function indexChangedFunc(index:int):void
	{
		curUI = tabUI[index];
		
		if(index == 1)
		{
			(curUI as OverviewContent).setData();
			mCurrentIndex = 1;
		}
		else if(index == 2)
		{
			(curUI as ConquerContent).setData(g_buildInfor);				
			mCurrentIndex = 2;
		}
        else if (index == 3)
        {
            // (curUI as CastleDefenseContent).SetData();  
            if (GameMain.singleton.IsHideTroopLimitServer()) {
            	(curUI as NewCastleDefenseContent).SetData();		            	
            }else{
            	(curUI as CastleDefenseContent).SetData();			            	
            }
        }
	}
	
	private var mCurrentIndex:int = 0;
	public function getmyNacigator():NavigatorController
	{
		if(curUI == null) return null;
		var content:OverviewContent = (curUI as OverviewContent);
		if(content == null) return null;
		
		if(mCurrentIndex == 1)
			return content.navigatorController;
		else 
			return null;
	}	
							
	function DrawItem()
	{
		if(curUI)
		{
			curUI.Draw();
		}
		
		frameTop.Draw();
		toolBar.Draw();
	}
	
	function DrawBackground()
	{
		DrawMiddleBg();
		
	//	GUI.Label(Rect(0, bgStartY - 2, frameTop.width, frameTop.height), frameTop);

	}
	
	function DrawTitle()
	{
		menuHead.Draw();
	}
	
	function Update()
	{
		menuHead.Update();
		if(toolBar.selectedIndex == 1)
		{
			overviewContent.Update();
		}
		else if(toolBar.selectedIndex == 2)
		{
			conquerContent.Update();
		}
		else if(toolBar.selectedIndex == 0)
		{
			standardBuildingContent.Update();
		}
        else if (toolBar.selectedIndex == 3)
        {
            
            if (GameMain.singleton.IsHideTroopLimitServer()) {
				new_defenseContent.Update();
			}else{
				defenseContent.Update();
			}
        }
	}
	
	function OnPop()
	{
		overviewContent.onPop();
		standardBuildingContent.rect.y = 150;
		super.OnPop();
	}
	
	public function OnPopOver()
	{
		if ( clone_menuHead != null && menuHead != null )
		{
			TryDestroy(menuHead);
			menuHead = null;
		}
		conquerContent.Clear();
		standardBuildingContent.Clear();
        defenseContent.Clear();
        new_defenseContent.Clear();
	}
	
	function OnPush(param:Object)
	{
		//var buildInfo : Building.BuildingInfo;
		if(param as Building.BuildingInfo)
		{
			g_buildInfor = param as Building.BuildingInfo;	
			toolBar.selectedIndex = 0;
		}
		else
		{			
			var hash:HashObject = param as HashObject;
			toolBar.selectedIndex = _Global.INT32(hash["toolbarIndex"].Value);
			g_buildInfor = (hash["infor"].Value) as Building.BuildingInfo;		
		}
	
		super.OnPush(g_buildInfor);
//		var arString:Object = Datas.instance().arStrings();
		
		var isNewHideTroop=GameMain.singleton.IsHideTroopLimitServer();
		if (isNewHideTroop) {
			tabString = [
	            Datas.getArString("Common.Details"),
	            Datas.getArString("Common.Overview"),
	            Datas.getArString("Common.Conquests"),
	            Datas.getArString("OpenPalace.button_Hide")];
		}else{
			tabString = [
	            Datas.getArString("Common.Details"),
	            Datas.getArString("Common.Overview"),
	            Datas.getArString("Common.Conquests"),
	            Datas.getArString("SelectiveDefense.DefenseTab")];
		}

        

		toolBar.toolbarStrings = tabString;
		//toolBar.selectedIndex = 0;
		//g_buildInfor = buildInfo;//param as Building.BuildingInfo;
		standardBuildingContent.rect.y = 145;
		UpdateData(g_buildInfor);
		
		curUI = tabUI[toolBar.selectedIndex];
		
		if(toolBar.selectedIndex == 1)
		{
			(curUI as OverviewContent).setData();	
		}
		else if(toolBar.selectedIndex == 2)
		{
			(curUI as ConquerContent).setData(g_buildInfor);				
		}
        else if (toolBar.selectedIndex == 3)
        {
            if (GameMain.singleton.IsHideTroopLimitServer()) {
            	(curUI as NewCastleDefenseContent).SetData();		            	
            }else{
            	(curUI as CastleDefenseContent).SetData();			            	
            }
        }
		SoundMgr.instance().PlayOpenBuildMenu(this.g_buildInfor.typeId);
	}	
	protected function UpdateData(buildingInfo:Object):void
	{
		g_buildInfor = buildingInfo as Building.BuildingInfo;

//		var arString:Object = Datas.instance().arStrings();
		var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(g_buildInfor.typeId,g_buildInfor.curLevel);
		menuHead.setTitle(Datas.getArString("ModalTitle.Castle"), prestigeData["level"].Value,prestigeData["prestige"].Value);

		standardBuildingContent.UpdateData(g_buildInfor);
		
	}
/***  hanle notifications ..**/
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.PREVIOUS_PROGRESS_COMPLETE:
				standardBuildingContent.setWaitingFlagTrue();
				break;
			case Constant.Notice.BUILDING_PROGRESS_COMPLETE:
				handleComplete(body as BuildingQueueMgr.QueueElement);
				break;
			case Constant.Notice.SPEED_WILDER_OK:
				handleColddownSpeedup(body);				
				break;
            case Constant.Notice.ChangeCity:
                MenuMgr.getInstance().PopMenu("NewCastleMenu");
                break;
		}
        
        if (curUI instanceof CastleDefenseContent||curUI instanceof NewCastleDefenseContent)
        {
            if (GameMain.singleton.IsHideTroopLimitServer()) {
            	new_defenseContent.HandleNotification(type, body);			            	
            }else{
            	defenseContent.HandleNotification(type, body);			            	
            }
        }
	}
	
	private function handleColddownSpeedup(param:Object):void
	{
		//var targetId:int = _Global.INT32(param["targetId"]);
		conquerContent.updateConquerItem(param);
	}
	
	protected function handleComplete(qItem:BuildingQueueMgr.QueueElement):void
	{
		if(!g_buildInfor || !qItem)
		{
			return;
		}
		
		if(qItem.level == 0 && qItem.slotId == g_buildInfor.slotId )
		{
			this.close();
		}
		else
		{				
			UpdateData(Building.instance().buildingInfo(g_buildInfor.slotId,g_buildInfor.typeId) );						
		}
	}
	//end  notification 
	public function OpenInGameHelp()
    {
        if (standardBuildingContent == null)
        {
            return;
        }
        
        standardBuildingContent.OpenInGameHelp();
    }
}
