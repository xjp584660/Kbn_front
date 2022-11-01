class MigrateTroopLimit extends SubMenu
{   
    public var titleBackGroung : Label;
    public var smallBackground : Label;
    public var smallTitleBack : Label;    
    public var noticeLabel : Label;
    public var nextButton : Button;
    public var type : Label;
    public var bring : Label;
    public var own : Label;
    public var fenge1 : Label;
    public var fenge2 : Label;
    public var scroll : ScrollList;
    public var decLabel : Label;
    public var resListItem : MigrateResItem;
    private var list : Array;
    public var roleInfo : MigrateRoleInfo;
    private var migrateMenu : MigrateMenu;
    
    function Init()
    {
    	roleInfo.Init();
    	
    	title.txt = Datas.getArString("Migrant.MercenaryLimit_Text1");
    	type.txt = Datas.getArString("Migrant.MercenaryLimit_Text3");
    	bring.txt = Datas.getArString("Migrant.MercenaryLimit_Text4");
    	own.txt = Datas.getArString("Migrant.MercenaryLimit_Text5");
    	//noticeLabel.txt = Datas.getArString("Migrant.MercenaryLimit_Text6");
    	decLabel.txt = Datas.getArString("Migrant.MercenaryLimit_Text2");
    	nextButton.txt = Datas.getArString("Migrant.MercenaryLimit_Text7");
    	
    	nextButton.OnClick = OnNextBtnClick;
    	
    	scroll.Init(resListItem);
    	list = new Array();
    }
    
    private function OnNextBtnClick(param:Object)
	{	
		// var comparedData : ComparedData = new ComparedData();
        // comparedData.callBack = function()
        // {
            GetMigrateRoleInfo();
        // };
        // comparedData.msgTxt = Datas.getArString("Migrant.MercenaryLimit_Text8");
        // MenuMgr.getInstance().PushMenu("MigrateComparedDialog", comparedData , "trans_zoomComp"); 		
	}
	
	private function GetMigrateRoleInfo()
	{
		var okFunc:Function = function(result:HashObject)
		{
		    //migrateMenu.setNeedItemCount(needItemCount);
			migrateMenu.PushSubMenu(roleInfo, result);
		};
		var errorFunc:Function = function(errorMsg:String, errorCode:String)
		{
			ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
		};
		
		var popMenu:PopMenuComponent = MenuMgr.getInstance().GetCurMenu() as PopMenuComponent;
	    var migrateMenu:MigrateMenu=popMenu.GetPopMenu() as MigrateMenu;
	    var selectServerId:int=migrateMenu.getSelectServeId();

		UnityNet.GetMigrateRoleInfo(selectServerId, okFunc, errorFunc);
	}
    
    public function OnPush(param:Object):void
    {
		var popMenu : PopMenuComponent = MenuMgr.getInstance().GetCurMenu() as PopMenuComponent;
		migrateMenu = popMenu.GetPopMenu() as MigrateMenu;
		
		var result : HashObject = param as HashObject;
		var troopLimitData : HashObject = result["data"];
		var keys : Array = _Global.GetObjectKeys(troopLimitData);
		var flag : boolean = false;
		for(var j : int = 0; j < keys.length; j++)
		{
			var total : long = _Global.INT64(troopLimitData[keys[j]]["total"]);
			var limit : long = _Global.INT64(troopLimitData[keys[j]]["limit"]);
			
			var sg : MigrateRoleInfo.BringResData  = new MigrateRoleInfo.BringResData();
	        sg.typeName = Datas.instance().getArString("unitName." + keys[j].ToString());
	        sg.bring = limit;
	        sg.isResource = false;
	        sg.own = total;
	        
	        list.push(sg);
		}
		
		scroll.Clear();
        scroll.SetData(list);
        scroll.ResetPos();
    }
    
    function DrawItem()
    {	    
	    smallBackground.Draw();
	    smallTitleBack.Draw();
	    type.Draw();
	    bring.Draw();
	    own.Draw();
	    fenge1.Draw();
	    fenge2.Draw();
	    decLabel.Draw();
	    //noticeLabel.Draw();
	    nextButton.Draw();
	    scroll.Draw();
    }
    
    function DrawBackground()
    {
        titleBackGroung.Draw();
    }
    
    function Update()
    {
        scroll.Update();
    }
}