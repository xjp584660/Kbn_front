
class MigrateRoleInfo extends SubMenu{

    class BringResData
    {
        public var typeName:String;
        public var bring:long;
        public var own:long;
        public var resourceType:int;
        public var isResource:boolean;
    };
    public var nextButton:Button;
    public var mframeTop:Label;
    public var mframeTopTitle:Label;
    public var mframeBotomTitle:Label;
    public var mtitle:Label;
    public var infoButton1:Button;
    public var infoButton2:Button;
      
    public var noticeLabel:Label;
    public var noticeLabel2:Label;
    public var icon1:Label;
    public var noRole:Label;
    public var icon2:Label;
    public var lv1:Label;
    public var might1:Label;
    public var gems1:Label;
    public var city1:Label;
    public var line:Label;
    public var type1:Label;
    public var bring1:Label;
    public var own1:Label;
    public var scroll1:ScrollList;
    public var scroll3:ScrollList;
    private var list:Array;
    private var resList:Array;
    public var resListItem:MigrateResItem;
    public var migrateRoleResItem:MigrateRoleResItems;
    public var fenge1:Label;
    public var fenge2:Label;
    
    public var accountMenu:MigrateAccount;
    function Init()
    {
        accountMenu.Init();
        infoButton1.OnClick = OnInfo;
        infoButton2.OnClick = OnInfo;
        scroll1.Init(resListItem);

        scroll3.Init(migrateRoleResItem);
        nextButton.OnClick = OpenAccount;
        nextButton.txt=Datas.getArString("Migrate.Role_Button");
        mtitle.txt=Datas.getArString("Migrate.Role_Title");
        noRole.txt=Datas.getArString("Migrate.Role_NoRole");
        noticeLabel.txt=Datas.getArString("Migrate.Role_Rule");
        noticeLabel2.txt=Datas.getArString("Migrate.Role_Rule2");
        mframeTopTitle.txt=Datas.getArString("Migrate.Role_CurrentWorld");

        if(KBN._Global.IsLargeResolution ())
        {
            icon1.rect = new Rect(61,150,80,80);                
            scroll1.rect = new Rect(38,350,530,80);                    
        }
        else
        {
            icon1.rect = new Rect(61,135,100,100);        
            scroll1.rect = new Rect(38,347,530,80);        
        }
        icon1.useTile = true;
        icon1.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(AvatarMgr.instance().PlayerAvatar));
        lv1.txt= String.Format(GameMain.instance().getPlayerName()+" ("+Datas.getArString("HeroHouse.Collection_Level")+")",GameMain.instance().getPlayerLevel());
        might1.txt=String.Format(Datas.getArString("MergeServer.ServerData_Might"),GameMain.instance().getPlayerMight());
        gems1.txt=String.Format(Datas.getArString("Migrate.Role_World_Gem")+" :{0}",GameMain.instance().getPlayerShadowGems());
        city1.txt=String.Format(Datas.getArString("MergeServer.ServerData_City"),GameMain.instance().getPlayerCityCount());
        
        type1.txt=Datas.getArString("Migrate.Role_Type");
        bring1.txt=Datas.getArString("Migrate.Role_Bring");
        own1.txt=Datas.getArString("Migrate.Role_You_Own");

        list = new Array();
        resList = new Array();
    }
    
    function parseResource(resData:HashObject){
        var cities : Hashtable = resData["resourceInfo"].Table;
        var city:HashObject;

	    for(var j:int = 0; j < cities.Count; j++)
        {
            city = cities[_Global.ap + j];
            if(city == null)
                continue;
            resList.push(city);
        }
    }
	
	public function ChangePage(changePage : int)
	{
		var curPage : int = scroll3.CurrentPage() + changePage;
		if (curPage >= 0 && curPage < resList.Count)
		{
			scroll3.SetToPage(curPage);
		}
	}
    
    function parseOtherData(resData:HashObject){
        var sg:BringResData  = new BringResData();
        sg.typeName=Datas.getArString("Migrate.Role_World_Gem");
        sg.bring=_Global.INT64(resData["shadowGems"]);
        sg.isResource=false;
        sg.own=GameMain.instance().getPlayerShadowGems();
        
        var bh:BringResData  = new BringResData();
        bh.typeName=Datas.getArString("Migrate.Role_Item1");
        bh.bring=_Global.INT64(resData["braveHeart"]);
        bh.isResource=false;
        bh.own=MyItems.instance().countForItem(2416);
        
        list.push(sg);
        list.push(bh);      
    }
    
    public function OnPush(param:Object):void
    {
        //TODO.
        getRoleInfo(param);
    }
    
    function getRoleInfo(param:Object)
    {
        var result : HashObject = param as HashObject;

            if (result["ok"].Value) {
                parseResource(result["migrateResource"]);
                parseOtherData(result["migrateResource"]);
                scroll1.Clear();
                scroll3.Clear();
                scroll1.SetData(list);
                scroll1.ResetPos();
                scroll3.SetData(resList);
                scroll3.ResetPos();
            }
    }
    
    private function OpenAccount(param:Object)
    {
        var popMenu:PopMenuComponent = MenuMgr.getInstance().GetCurMenu() as PopMenuComponent;
        var migrateMenu:MigrateMenu=popMenu.GetPopMenu() as MigrateMenu;
        migrateMenu.PushSubMenu(accountMenu, param);
    }
    
    private function OnInfo(param:Object)
    {
        MenuMgr.getInstance().PushMenu("CarmotHelpMenu", "migrate", "trans_zoomComp");
    }
    
    function Update()
    {
        scroll3.Update();
    }
    
    function DrawItem()
    {
        for(var i:int=0;i<componetList.Count;i++){
	        if(componetList[i] != null)
	        {
	            componetList[i].Draw();
	        
	        }
        }
    }
    
    function DrawBackground()
    {
        
    }
}