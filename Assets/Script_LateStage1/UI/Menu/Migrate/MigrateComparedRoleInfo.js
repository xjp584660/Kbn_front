import System.Collections.Generic;
class MigrateComparedRoleInfo extends SubMenu{

    public var nextButton:Button;
    public var curTitle:Label;
    public var line:Label;
    public var composeUIObjs : List.<ComposedUIObj>;
    public var divideline1:Label;
    public var divideline2:Label;
    public var notice:Label;

    @System.Serializable
    public class RoleInfo 
    {
        @SerializeField public var icon : Label;
        @SerializeField public var name : Label;
        @SerializeField public var might : Label;
        @SerializeField public var gems : Label;
        @SerializeField public var city : Label;
        @SerializeField public var title : Label;
    }
    @SerializeField
    public var rollInfos : List.<RoleInfo>;

    function Init()
    {
        //condition.Init();
        nextButton.OnClick = nextClick;
        nextButton.txt=Datas.getArString("Migrate.Role_Button");
        curTitle.txt=Datas.getArString("Migrate.Role_Title");

        rollInfos[0].icon.useTile = true;
        rollInfos[0].icon.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(AvatarMgr.instance().PlayerAvatar));
        rollInfos[0].title.txt = Datas.getArString("Migrate.Role_CurrentWorld");

        rollInfos[1].icon.useTile = true;
        rollInfos[1].icon.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(AvatarMgr.instance().PlayerAvatar));
        rollInfos[1].title.txt = Datas.getArString("Migrate.Role_TargetWorld");
    }
       
    public function OnPush(param:Object):void
    {
        var result : HashObject = param as HashObject;
        var sourcePlayerInfo : HashObject = result["sourcePlayerInfo"];
        rollInfos[0].name.txt = String.Format((sourcePlayerInfo["displayName"].Value).ToString()+" ("+Datas.getArString("HeroHouse.Collection_Level")+")",(sourcePlayerInfo["title"].Value).ToString());
        rollInfos[0].might.txt = String.Format(Datas.getArString("MergeServer.ServerData_Might"),(sourcePlayerInfo["might"].Value).ToString());
        rollInfos[0].gems.txt = String.Format(Datas.getArString("Migrate.Role_World_Gem")+" :{0}",(sourcePlayerInfo["shadowGems"].Value).ToString());
        rollInfos[0].city.txt = String.Format(Datas.getArString("MergeServer.ServerData_City"),(sourcePlayerInfo["cityAmount"].Value).ToString());

        var targetPlayerInfo : HashObject = result["targetPlayerInfo"];
        rollInfos[1].name.txt = String.Format((targetPlayerInfo["displayName"].Value).ToString()+" ("+Datas.getArString("HeroHouse.Collection_Level")+")",(targetPlayerInfo["title"].Value).ToString());
        rollInfos[1].might.txt = String.Format(Datas.getArString("MergeServer.ServerData_Might"),(targetPlayerInfo["might"].Value).ToString());
        rollInfos[1].gems.txt = String.Format(Datas.getArString("Migrate.Role_World_Gem")+" :{0}",(targetPlayerInfo["shadowGems"].Value).ToString());
        rollInfos[1].city.txt = String.Format(Datas.getArString("MergeServer.ServerData_City"),(targetPlayerInfo["cityAmount"].Value).ToString());

        notice.txt = String.Format(Datas.getArString("Migrate.Role_Notice"),(targetPlayerInfo["cityAmount"].Value).ToString());
    }
    
    private function nextClick(param:Object)
    {
        var comparedData : ComparedData = new ComparedData();
        comparedData.callBack = function()
        {
            OpenConditionMenu();
        };
        comparedData.msgTxt = Datas.getArString("Migrate.ChooseServer_HaveAccount");
        MenuMgr.getInstance().PushMenu("MigrateComparedDialog", comparedData , "trans_zoomComp"); 
    }

    private function OpenConditionMenu()
    {
        var popMenu:PopMenuComponent = MenuMgr.getInstance().GetCurMenu() as PopMenuComponent;
        var migrateMenu:MigrateMenu=popMenu.GetPopMenu() as MigrateMenu;
        migrateMenu.OpenConditionMenu();
    }
    
    function Update()
    {

    }
    
    function DrawItem()
    {
        for(var i : int = 0; i < composeUIObjs.Count; i++)
        {
            composeUIObjs[i].Draw();
        }

        nextButton.Draw();
        line.Draw();
        curTitle.Draw();
        divideline1.Draw();
        divideline2.Draw();
        notice.Draw();
    }
    
    function DrawBackground()
    {
        
    }
}