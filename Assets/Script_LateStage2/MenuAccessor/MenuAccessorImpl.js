#pragma strict

public class MenuAccessorImpl extends MenuAccessorBase
{
    public function MenuAccessorImpl()
    {
        Instance = this;
        GameMain.instance().resgisterRestartFunc(function()
        {
            Instance = null;
        });
    }

    public function SwitchTabIndexInAcademyBuilding(index : int)
    {
        MenuMgr.getInstance().getMenuAndCall("AcademyBuilding", function(menu : KBNMenu)
        {
            var academyBuildingMenu:AcademyBuilding = menu as AcademyBuilding;
            if (academyBuildingMenu != null)
            {
                academyBuildingMenu.toolBar.selectedIndex = 1;
            }
        });
    }

    public function AcademyBuildingChangeStartIndex(index : int)
    {
        AcademyBuilding.gm_startPageIndex = index;
    }

    public function AllianceWallInputReturn()
    {
        var allianceMenu:AllianceMenu = MenuMgr.getInstance().getMenu("AllianceMenu") as AllianceMenu;
        if (allianceMenu != null)
        {
            var menu:AllianceWallCon = allianceMenu.tab_report.wallCon;
            menu.Return();
        }
    }

    public function AllianceWallInputHide()
    {
        var allianceMenu:AllianceMenu = MenuMgr.getInstance().getMenu("AllianceMenu") as AllianceMenu;
        if(allianceMenu != null)
        {
            var menu:AllianceWallCon = allianceMenu.tab_report.wallCon;
            menu.Hide();
        }
    }

    public function OpenBarrackWithTab(index : int)
    {
        MenuMgr.getInstance().getMenuAndCall("BarrackMenu", function(menu : KBNMenu):void
        {
            var barrackMenu:BarrackMenu = menu as BarrackMenu;
            if (barrackMenu != null) {
                barrackMenu.titleTab.SelectTab(index);
            }
        });
    }

    public function BarrackMenuSwitchToTrainList(barrackMenu : UIObject)
    {
        (barrackMenu as BarrackMenu).SwitchToTrainList();
    }

    public function BarrackMenuOnDismissOK(barrackMenu : UIObject)
    {
        (barrackMenu as BarrackMenu).OnDismissOk();
    }

    public function GetBuildingMaxLevelForType(buildType : int, cityId : int) : int
    {
        return Building.instance().getMaxLevelForType(buildType, cityId);
    }

    public function OpenEventDialog()
    {
        var cityId:int = GameMain.instance().getCurCityId();
                
        if(Building.instance().hasBuildingbyType(cityId, Constant.Building.MUSEUM))
        {
            var slotId:int = Building.instance().getPositionForType(Constant.Building.MUSEUM);
            var buildingInfor:Building.BuildingInfo = Building.instance().buildingInfo(slotId , Constant.Building.MUSEUM);
            
            var hash:HashObject = new HashObject({"toolbarIndex":2, "infor":buildingInfor});
            MenuMgr.getInstance().PushMenu("MuseumBuilding", hash);        
        }
        else
        {
            ErrorMgr.instance().PushError("",Datas.getArString("MessagesModal.BuildMuseum"));
        }
    }
    
    public function OpenUniversalOffer()
    {
    /*offerChange
        Payment.instance().setCurNoticeType(3);
        var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetDisplayDataByDisplayPosition(PaymentOfferManager.DisplayPosition.Lower);
        if ( offerData == null )
            return;
        MenuMgr.getInstance().PushMenu("PaymentOfferMenu",
            {"data": offerData, "curType":3},
            "trans_zoomComp");*/
    }
    
    public function LinkerHandleDefaultAction(linkType : String, param : String)
    {
        Linker.DefaultActionHandler(linkType, param);
    }
    
    public function OpenMissionMenu(param : Object)
    {
        MenuMgr.getInstance().PushMenu("Mission", param);
    }
    

    public function OpenPlayerSetting(closeCallback : System.Action)
    {
        MenuMgr.getInstance().SwitchMenu("PlayerSetting", null, "trans_zoomComp" );
        MenuMgr.getInstance().getMenuAndCall("PlayerSetting", function(menu : KBNMenu)
        {
            var playerSetting:PlayerSetting = menu as PlayerSetting;
            if ( playerSetting != null )
            {
                if (closeCallback != null)
                {
                    playerSetting.CloseCallback = closeCallback;
                };
                playerSetting.SwitchToKabamID();
                
            }
        });
        Datas.instance().setLastKabamIdTime(System.DateTime.Now.Ticks);
    }
    
    public function OpenKabamId()
    {
        MenuMgr.getInstance().SwitchMenu("PlayerSetting", null, "trans_zoomComp" );
        MenuMgr.getInstance().getMenuAndCall("PlayerSetting", function(menu : KBNMenu) {
            var playerSetting:PlayerSetting = menu as PlayerSetting;
            if ( playerSetting != null )
                playerSetting.OpenKabamId(null);    
        });
    }
    
    public function OpenHelp()
    {
        MenuMgr.getInstance().SwitchMenu("PlayerSetting", null, "trans_zoomComp" );
        MenuMgr.getInstance().getMenuAndCall("PlayerSetting", function(menu : KBNMenu) {
            var playerSetting:PlayerSetting = menu as PlayerSetting;
            if ( playerSetting != null )
                playerSetting.SwitchToHelp();
        });
    }
    
    public function SetKabamIdBIPosition(biPos : int)
    {
        KabamId.BIPosition = biPos;
    }

    public function OpenInGameHelpFromTierLevelUp()
    {
    	var setting:InGameHelpSetting = new InGameHelpSetting();
		setting.type = "TierLevelUp";
		setting.key = "GearTier";
		setting.name = Datas.instance().getArString("Common.EquipmentReset_Sub1");
		
		MenuMgr.getInstance().PushMenu("InGameHelp", setting, "trans_horiz");
    }
    
    public function SetAllianceWallKeyboardHeight(height : String)
    {
        var allianceMenu:AllianceMenu = MenuMgr.getInstance().getMenu("AllianceMenu") as AllianceMenu;
        if (allianceMenu != null)
        {
            var fHeight : float = _Global.FLOAT(height);
            var menu : AllianceWallCon = allianceMenu.tab_report.wallCon;
            menu.setMoveSpeed(fHeight);
        }
    }
}
